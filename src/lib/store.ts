import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Playbook, AppSettings } from '../types';

interface PlaybookDB extends DBSchema {
  playbooks: {
    key: string;
    value: Playbook;
    indexes: { 'by-date': Date; 'by-favorite': number };
  };
  settings: {
    key: string;
    value: any;
  };
}

export class PlaybookStore {
  private db: IDBPDatabase<PlaybookDB> | null = null;
  private readonly DB_NAME = 'birches-pe-playbooks';
  private readonly DB_VERSION = 1;
  private readonly MAX_PLAYBOOKS = 10;

  async init(): Promise<void> {
    this.db = await openDB<PlaybookDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Create playbooks store
        if (!db.objectStoreNames.contains('playbooks')) {
          const playbookStore = db.createObjectStore('playbooks', {
            keyPath: 'id'
          });
          playbookStore.createIndex('by-date', 'createdAt');
          playbookStore.createIndex('by-favorite', 'metadata.favorite');
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      }
    });
  }

  async savePlaybook(playbook: Playbook): Promise<void> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction('playbooks', 'readwrite');
    await tx.objectStore('playbooks').put(playbook);
    
    // Enforce max playbooks limit
    await this.enforceLimit();
    
    await tx.done;
  }

  async getPlaybook(id: string): Promise<Playbook | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('playbooks', id);
  }

  async getAllPlaybooks(): Promise<Playbook[]> {
    if (!this.db) await this.init();
    const all = await this.db!.getAllFromIndex('playbooks', 'by-date');
    return all.reverse(); // Most recent first
  }

  async getFavorites(): Promise<Playbook[]> {
    if (!this.db) await this.init();
    const all = await this.getAllPlaybooks();
    return all.filter(p => p.metadata.favorite);
  }

  async deletePlaybook(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('playbooks', id);
  }

  async duplicatePlaybook(id: string): Promise<Playbook | null> {
    const original = await this.getPlaybook(id);
    if (!original) return null;
    
    const duplicate: Playbook = {
      ...original,
      id: this.generateId(),
      title: `${original.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        ...original.metadata,
        favorite: false
      }
    };
    
    await this.savePlaybook(duplicate);
    return duplicate;
  }

  async renamePlaybook(id: string, newTitle: string): Promise<void> {
    const playbook = await this.getPlaybook(id);
    if (!playbook) return;
    
    playbook.title = newTitle;
    playbook.updatedAt = new Date();
    
    await this.savePlaybook(playbook);
  }

  async toggleFavorite(id: string): Promise<void> {
    const playbook = await this.getPlaybook(id);
    if (!playbook) return;
    
    playbook.metadata.favorite = !playbook.metadata.favorite;
    playbook.updatedAt = new Date();
    
    await this.savePlaybook(playbook);
  }

  async exportPlaybook(id: string): Promise<string> {
    const playbook = await this.getPlaybook(id);
    if (!playbook) throw new Error('Playbook not found');
    
    return JSON.stringify(playbook, null, 2);
  }

  async importPlaybook(jsonData: string): Promise<Playbook> {
    const playbook = JSON.parse(jsonData) as Playbook;
    
    // Generate new ID to avoid conflicts
    playbook.id = this.generateId();
    playbook.createdAt = new Date(playbook.createdAt);
    playbook.updatedAt = new Date();
    
    await this.savePlaybook(playbook);
    return playbook;
  }

  async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    if (!this.db) await this.init();
    
    try {
      const value = await this.db!.get('settings', key);
      return value !== undefined ? value : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async setSetting<T>(key: string, value: T): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('settings', value, key);
  }

  async getSettings(): Promise<AppSettings> {
    return {
      aiProvider: await this.getSetting('aiProvider', 'none'),
      apiKey: await this.getSetting('apiKey', undefined),
      generationMode: await this.getSetting('generationMode', 'deterministic'),
      blendRatio: await this.getSetting('blendRatio', 0.5),
      theme: await this.getSetting('theme', 'light'),
      reducedMotion: await this.getSetting('reducedMotion', false),
      autoSave: await this.getSetting('autoSave', true)
    };
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      if (value !== undefined) {
        await this.setSetting(key, value);
      }
    }
  }

  private async enforceLimit(): Promise<void> {
    const all = await this.getAllPlaybooks();
    
    if (all.length > this.MAX_PLAYBOOKS) {
      // Keep favorites and most recent
      const nonFavorites = all.filter(p => !p.metadata.favorite);
      const toDelete = nonFavorites.slice(this.MAX_PLAYBOOKS - all.filter(p => p.metadata.favorite).length);
      
      for (const playbook of toDelete) {
        await this.deletePlaybook(playbook.id);
      }
    }
  }

  private generateId(): string {
    return `pb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction('playbooks', 'readwrite');
    await tx.objectStore('playbooks').clear();
    await tx.done;
  }

  async getStorageInfo(): Promise<{ count: number; size: number }> {
    const playbooks = await this.getAllPlaybooks();
    const size = new Blob([JSON.stringify(playbooks)]).size;
    
    return {
      count: playbooks.length,
      size
    };
  }
}