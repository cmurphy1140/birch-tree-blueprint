import type { Playbook, StoredPlaybook, AppSettings } from '../types';

export class PlaybookStore {
  private readonly STORAGE_KEY = 'birches_pe_playbooks';
  private readonly SETTINGS_KEY = 'birches_pe_settings';
  private readonly MAX_PLAYBOOKS = 10;

  async init(): Promise<void> {
    // Initialize localStorage if needed
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.SETTINGS_KEY)) {
      const defaultSettings: AppSettings = {
        theme: 'light',
        defaultDuration: 45,
        defaultParticipants: 25,
        favoriteActivities: [],
        aiProvider: null,
        autoSave: true,
        offlineMode: true
      };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaultSettings));
    }
  }

  async savePlaybook(playbook: Playbook): Promise<void> {
    const playbooks = await this.getAllPlaybooks();
    
    // Convert to StoredPlaybook
    const storedPlaybook: StoredPlaybook = {
      ...playbook,
      name: playbook.title,
      tags: [],
      favorite: false
    };
    
    // Add to beginning of array
    playbooks.unshift(storedPlaybook);
    
    // Keep only last MAX_PLAYBOOKS
    const trimmed = playbooks.slice(0, this.MAX_PLAYBOOKS);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
  }

  async getAllPlaybooks(): Promise<StoredPlaybook[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored) as StoredPlaybook[];
    } catch {
      return [];
    }
  }

  async getPlaybook(id: string): Promise<StoredPlaybook | null> {
    const playbooks = await this.getAllPlaybooks();
    return playbooks.find(p => p.id === id) || null;
  }

  async deletePlaybook(id: string): Promise<void> {
    const playbooks = await this.getAllPlaybooks();
    const filtered = playbooks.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  async updatePlaybook(id: string, updates: Partial<StoredPlaybook>): Promise<void> {
    const playbooks = await this.getAllPlaybooks();
    const index = playbooks.findIndex(p => p.id === id);
    
    if (index !== -1) {
      playbooks[index] = {
        ...playbooks[index],
        ...updates,
        modifiedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playbooks));
    }
  }

  async getSettings(): Promise<AppSettings> {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (!stored) {
      await this.init();
      return this.getSettings();
    }
    
    try {
      return JSON.parse(stored) as AppSettings;
    } catch {
      await this.init();
      return this.getSettings();
    }
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
  }

  async clearAll(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
    await this.init();
  }

  async exportData(): Promise<string> {
    const playbooks = await this.getAllPlaybooks();
    const settings = await this.getSettings();
    
    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      playbooks,
      settings
    }, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.playbooks) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.playbooks));
      }
      
      if (data.settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
      }
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }
}