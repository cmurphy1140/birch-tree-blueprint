import type { GeneratorInput, Playbook } from '../types';
import { DeterministicGenerator } from '../lib/generator';
import { PlaybookStore } from '../lib/store';
import { AIGenerator } from '../lib/ai';
import { ExportManager } from '../lib/export';

export class GeneratorUI {
  private container: HTMLElement;
  private generator: DeterministicGenerator;
  private aiGenerator: AIGenerator;
  private store: PlaybookStore;
  private exportManager: ExportManager;
  private currentPlaybook: Playbook | null = null;
  private useAI: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.generator = new DeterministicGenerator();
    this.aiGenerator = new AIGenerator();
    this.store = new PlaybookStore();
    this.exportManager = new ExportManager();
    this.init();
  }

  private async init() {
    await this.store.init();
    this.render();
    this.attachEventListeners();
    this.loadSettings();
  }

  private render() {
    this.container.innerHTML = `
      <!-- Navigation Bar -->
      <nav class="nav-bar">
        <div class="nav-container">
          <a href="/" class="nav-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.5 2 9.5 3 9.5 4.5c0 .7.3 1.3.7 1.8L8.5 8H7c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h.5l2.2 5.5c.2.4.6.5 1 .5s.8-.1 1-.5L14 14h.5c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-1.5l-1.7-1.7c.4-.5.7-1.1.7-1.8C14.5 3 13.5 2 12 2z"/>
            </svg>
            <span>Birch Tree Blueprint</span>
          </a>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-headline fade-in-up">Birch Tree Blueprint</h1>
          <p class="hero-subheadline fade-in-up">Create professional PE playbooks that inspire movement and build confidence.</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container">
        <!-- Main Card -->
        <div class="card" style="max-width: 680px; margin: 0 auto;">
          <h2 style="font-size: 32px; font-weight: 600; margin-bottom: 8px;">Create Your Playbook</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 48px;">Generate a comprehensive PE playbook tailored to your needs.</p>
          
          <form id="generator-form">
            <div class="form-group">
              <label class="form-label">Grade Level</label>
              <select class="form-select" name="gradeLevel" required>
                <option value="">Select grade band</option>
                <option value="K-2">K-2</option>
                <option value="3-5">3-5</option>
                <option value="6-8">6-8</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Duration</label>
              <select class="form-select" name="duration" required>
                <option value="">Select duration</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Environment</label>
              <div style="display: flex; gap: 16px;">
                <label class="form-radio">
                  <input type="radio" name="environment" value="indoor" required>
                  <span>Indoor</span>
                </label>
                <label class="form-radio">
                  <input type="radio" name="environment" value="outdoor" required>
                  <span>Outdoor</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">PE Standards</label>
              <div id="standards-checkboxes" style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                <!-- Populated dynamically -->
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Equipment Level</label>
              <select class="form-select" name="equipmentLevel">
                <option value="minimal">Minimal (cones, balls)</option>
                <option value="standard">Standard (+ nets, hoops)</option>
                <option value="full">Full (all equipment)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Activity Preferences</label>
              <label class="form-checkbox">
                <input type="checkbox" name="teamBased" value="true">
                <span>Team-based activities</span>
              </label>
              <label class="form-checkbox">
                <input type="checkbox" name="competitive" value="true">
                <span>Competitive games</span>
              </label>
              <label class="form-checkbox">
                <input type="checkbox" name="creative" value="true">
                <span>Creative movement</span>
              </label>
            </div>

            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" id="use-ai" ${this.useAI ? 'checked' : ''}>
                <span>Enhanced AI Generation</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-large w-full">
              Generate Playbook
            </button>
          </form>
        </div>

        <!-- Generated Playbook Display -->
        <div id="playbook-display" class="hidden" style="margin-top: 48px;">
          <div class="card" style="max-width: 800px; margin: 0 auto;">
            <div class="flex justify-between items-center" style="margin-bottom: 32px;">
              <h2 style="font-size: 28px; font-weight: 600;">Your Playbook</h2>
              <div style="display: flex; gap: 12px;">
                <button class="btn btn-secondary" id="save-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                  </svg>
                  Save
                </button>
                <button class="btn btn-secondary" id="export-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export
                </button>
              </div>
            </div>
            <div id="playbook-content" class="playbook-content">
              <!-- Playbook content will be inserted here -->
            </div>
          </div>
        </div>
      </div>

      <!-- Resources Section - Enhanced Apple Style -->
      <div class="resources-section">
        <div class="resources-header">
          <h2 class="resources-title">Resources & Materials</h2>
          <p class="resources-subtitle">Essential tools and documents to enhance your PE teaching experience</p>
        </div>
        
        <div class="resource-grid">
          <!-- Course Syllabus -->
          <div class="resource-card" data-resource="syllabus">
            <div class="resource-gradient gradient-blue"></div>
            <div class="resource-content">
              <div class="resource-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 class="resource-title">Course Syllabus</h3>
              <p class="resource-description">Comprehensive PE curriculum outline with standards alignment</p>
              <a href="#" class="resource-link">
                Learn more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Indoor Activities -->
          <div class="resource-card" data-resource="indoor">
            <div class="resource-gradient gradient-green"></div>
            <div class="resource-content">
              <div class="resource-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 class="resource-title">Indoor Activities</h3>
              <p class="resource-description">Weather-proof activities perfect for gymnasium settings</p>
              <a href="#" class="resource-link">
                Explore
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Outdoor Activities -->
          <div class="resource-card" data-resource="outdoor">
            <div class="resource-gradient gradient-orange"></div>
            <div class="resource-content">
              <div class="resource-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                </svg>
              </div>
              <h3 class="resource-title">Outdoor Activities</h3>
              <p class="resource-description">Field games that maximize outdoor learning spaces</p>
              <a href="#" class="resource-link">
                Explore
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Strategy Worksheet -->
          <div class="resource-card" data-resource="worksheet">
            <div class="resource-gradient gradient-purple"></div>
            <div class="resource-content">
              <div class="resource-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3 class="resource-title">Strategy Worksheet</h3>
              <p class="resource-description">Planning templates and assessment tools</p>
              <a href="#" class="resource-link">
                Download
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Cards - Apple Style -->
      <div class="container" style="margin-top: 96px;">
        <div class="grid grid-3">
          <div class="feature-card stagger-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 class="feature-title">Standards Aligned</h3>
            <p class="feature-description">Every playbook meets national PE standards and state requirements</p>
          </div>

          <div class="feature-card stagger-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 class="feature-title">Time Efficient</h3>
            <p class="feature-description">Generate complete lesson plans in under 30 seconds</p>
          </div>

          <div class="feature-card stagger-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 class="feature-title">Age Appropriate</h3>
            <p class="feature-description">Tailored activities for every developmental stage</p>
          </div>
        </div>
      </div>

      <!-- Settings Modal -->
      <div id="settings-modal" class="modal-overlay">
        <div class="modal">
          <h3>Settings</h3>
          <div class="form-group">
            <label class="form-label">Theme</label>
            <select class="form-select" id="theme-select">
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">AI Provider</label>
            <select class="form-select" id="ai-provider">
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="none">None (Deterministic)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">API Key</label>
            <input type="password" class="form-input" id="api-key" placeholder="Enter your API key">
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary" id="save-settings">Save</button>
            <button class="btn btn-secondary" id="close-settings">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Library Modal -->
      <div id="library-modal" class="modal-overlay">
        <div class="modal" style="max-width: 800px;">
          <h3>Saved Playbooks</h3>
          <div id="library-content" style="max-height: 400px; overflow-y: auto;">
            <!-- Library items will be populated here -->
          </div>
          <div class="mt-3">
            <button class="btn btn-secondary" id="close-library">Close</button>
          </div>
        </div>
      </div>
    `;

    this.populateStandardsCheckboxes();
  }

  private populateStandardsCheckboxes() {
    const standardsContainer = document.getElementById('standards-checkboxes');
    if (!standardsContainer) return;

    const standards = [
      { id: 'locomotor', label: 'Locomotor Skills' },
      { id: 'teamwork', label: 'Teamwork & Cooperation' },
      { id: 'fitness', label: 'Health & Fitness' },
      { id: 'strategy', label: 'Strategy & Tactics' },
      { id: 'sportsmanship', label: 'Sportsmanship' }
    ];

    standardsContainer.innerHTML = standards.map(std => `
      <label class="form-checkbox">
        <input type="checkbox" name="standards" value="${std.id}">
        <span>${std.label}</span>
      </label>
    `).join('');
  }

  private attachEventListeners() {
    // Form submission
    const form = document.getElementById('generator-form') as HTMLFormElement;
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleGenerate();
    });

    // Quick preset button
    const quickPreset = document.getElementById('quick-preset');
    quickPreset?.addEventListener('click', () => {
      this.applyQuickPreset();
    });

    // AI toggle
    const aiToggle = document.getElementById('use-ai') as HTMLInputElement;
    aiToggle?.addEventListener('change', (e) => {
      this.useAI = (e.target as HTMLInputElement).checked;
      this.saveSettings();
    });

    // Export buttons
    document.getElementById('save-btn')?.addEventListener('click', () => this.savePlaybook());
    document.getElementById('export-btn')?.addEventListener('click', () => this.exportPlaybook());
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());
    document.getElementById('regenerate-btn')?.addEventListener('click', () => this.handleGenerate());

    // Settings modal
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.add('active');
    });

    document.getElementById('close-settings')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('active');
    });

    document.getElementById('save-settings')?.addEventListener('click', () => {
      this.saveSettings();
      document.getElementById('settings-modal')?.classList.remove('active');
    });

    // Library modal
    document.getElementById('library-btn')?.addEventListener('click', () => {
      this.showLibrary();
    });

    document.getElementById('close-library')?.addEventListener('click', () => {
      document.getElementById('library-modal')?.classList.remove('active');
    });

    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Resource cards
    document.querySelectorAll('.resource-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const resource = (e.currentTarget as HTMLElement).dataset.resource;
        this.handleResourceClick(resource);
      });
    });
  }

  private async handleGenerate() {
    const form = document.getElementById('generator-form') as HTMLFormElement;
    const formData = new FormData(form);
    
    const input: GeneratorInput = {
      gradeLevel: formData.get('gradeLevel') as string,
      duration: parseInt(formData.get('duration') as string),
      environment: formData.get('environment') as 'indoor' | 'outdoor',
      standards: formData.getAll('standards') as string[],
      equipmentLevel: formData.get('equipmentLevel') as string,
      teamBased: formData.get('teamBased') === 'true',
      competitive: formData.get('competitive') === 'true',
      creative: formData.get('creative') === 'true'
    };

    // Show loading state
    const displayDiv = document.getElementById('playbook-display');
    const contentDiv = document.getElementById('playbook-content');
    
    if (displayDiv) {
      displayDiv.classList.remove('hidden');
    }
    
    if (contentDiv) {
      contentDiv.innerHTML = `
        <div style="text-align: center; padding: 48px;">
          <div class="loading-spinner" style="margin: 0 auto;"></div>
          <p style="margin-top: 16px; color: var(--color-text-secondary);">Generating your playbook...</p>
        </div>
      `;
    }

    try {
      let playbook: Playbook;
      
      if (this.useAI) {
        playbook = await this.aiGenerator.generate(input);
      } else {
        playbook = this.generator.generate(input);
      }

      this.currentPlaybook = playbook;
      this.displayPlaybook(playbook);

      // Store playbook and input in sessionStorage for the playbook page
      const playbookData = {
        playbook,
        userInput: input
      };
      sessionStorage.setItem('currentPlaybook', JSON.stringify(playbookData));

      // Navigate to the playbook page
      window.location.href = '/playbook.html';
    } catch (error) {
      console.error('Failed to generate playbook:', error);
      if (contentDiv) {
        contentDiv.innerHTML = `
          <div style="text-align: center; padding: 48px;">
            <p style="color: var(--apple-red);">Failed to generate playbook. Please try again.</p>
          </div>
        `;
      }
    }
  }

  private displayPlaybook(playbook: Playbook) {
    const contentDiv = document.getElementById('playbook-content');
    if (!contentDiv) return;

    const html = `
      <div class="playbook">
        <h2>${playbook.title}</h2>
        <div class="playbook-meta mb-3">
          <span class="badge">${playbook.gradeLevel}</span>
          <span class="badge">${playbook.duration} min</span>
          <span class="badge">${playbook.environment}</span>
        </div>
        
        <p class="mb-3">${playbook.description}</p>
        
        <h3>Learning Objectives</h3>
        <ul class="mb-3">
          ${playbook.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
        
        <h3>Required Equipment</h3>
        <ul class="mb-3">
          ${playbook.equipment.map(eq => `<li>${eq}</li>`).join('')}
        </ul>
        
        <h3>Lesson Structure</h3>
        ${playbook.sections.map(section => `
          <div class="section mb-3">
            <h4>${section.name} (${section.duration} min)</h4>
            <p>${section.description}</p>
            <h5>Activities:</h5>
            <ul>
              ${section.activities.map(activity => `
                <li>
                  <strong>${activity.name}</strong>: ${activity.description}
                  ${activity.equipment ? `<br><em>Equipment: ${activity.equipment.join(', ')}</em>` : ''}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
        
        <h3>Assessment</h3>
        <p>${playbook.assessment}</p>
        
        <h3>Modifications</h3>
        <ul>
          ${playbook.modifications.map(mod => `<li>${mod}</li>`).join('')}
        </ul>
        
        <h3>Safety Considerations</h3>
        <ul>
          ${playbook.safetyConsiderations.map(safety => `<li>${safety}</li>`).join('')}
        </ul>
      </div>
    `;

    contentDiv.innerHTML = html;

    // Enable action buttons
    document.querySelectorAll('#save-btn, #export-btn, #print-btn, #regenerate-btn').forEach(btn => {
      (btn as HTMLButtonElement).disabled = false;
    });
  }

  private async savePlaybook() {
    if (!this.currentPlaybook) return;
    
    const id = await this.store.savePlaybook(this.currentPlaybook);
    console.log('Playbook saved with ID:', id);
    
    // Show success message
    this.showNotification('Playbook saved successfully!');
  }

  private async exportPlaybook() {
    if (!this.currentPlaybook) return;
    
    const format = await this.showExportDialog();
    if (!format) return;
    
    switch (format) {
      case 'pdf':
        await this.exportManager.exportToPDF(this.currentPlaybook);
        break;
      case 'docx':
        await this.exportManager.exportToWord(this.currentPlaybook);
        break;
      case 'json':
        await this.exportManager.exportToJSON(this.currentPlaybook);
        break;
    }
  }

  private async showExportDialog(): Promise<string | null> {
    // Simple implementation - in production, use a proper dialog
    return 'pdf';
  }

  private async showLibrary() {
    const modal = document.getElementById('library-modal');
    const content = document.getElementById('library-content');
    
    if (!modal || !content) return;
    
    const playbooks = await this.store.getAllPlaybooks();
    
    if (playbooks.length === 0) {
      content.innerHTML = '<p>No saved playbooks yet.</p>';
    } else {
      content.innerHTML = playbooks.map(pb => `
        <div class="card mb-2" style="cursor: pointer;" data-id="${pb.id}">
          <h4>${pb.title}</h4>
          <p class="text-muted">${pb.gradeLevel} • ${pb.duration} min • ${new Date(pb.createdAt).toLocaleDateString()}</p>
        </div>
      `).join('');
      
      content.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', async (e) => {
          const id = (e.currentTarget as HTMLElement).dataset.id;
          if (id) {
            const playbook = await this.store.getPlaybook(id);
            if (playbook) {
              this.currentPlaybook = playbook;
              this.displayPlaybook(playbook);
              modal.classList.remove('active');
            }
          }
        });
      });
    }
    
    modal.classList.add('active');
  }

  private applyQuickPreset() {
    const form = document.getElementById('generator-form') as HTMLFormElement;
    
    // Set quick preset values
    (form.elements.namedItem('gradeLevel') as HTMLSelectElement).value = '3-5';
    (form.elements.namedItem('duration') as HTMLSelectElement).value = '30';
    (form.elements.namedItem('environment') as HTMLInputElement).value = 'indoor';
    (form.elements.namedItem('equipmentLevel') as HTMLSelectElement).value = 'minimal';
    
    // Check some standards
    const standards = form.querySelectorAll('input[name="standards"]') as NodeListOf<HTMLInputElement>;
    standards[0].checked = true;
    standards[2].checked = true;
    
    // Set fun factors
    (form.elements.namedItem('teamBased') as HTMLInputElement).checked = true;
  }

  private toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  private loadSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Load AI settings
    const aiEnabled = localStorage.getItem('aiEnabled') === 'true';
    this.useAI = aiEnabled;
    const aiToggle = document.getElementById('use-ai') as HTMLInputElement;
    if (aiToggle) aiToggle.checked = aiEnabled;
  }

  private saveSettings() {
    localStorage.setItem('aiEnabled', this.useAI.toString());
    
    // Save other settings
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    if (themeSelect) {
      localStorage.setItem('theme', themeSelect.value);
    }
    
    const aiProvider = document.getElementById('ai-provider') as HTMLSelectElement;
    if (aiProvider) {
      localStorage.setItem('aiProvider', aiProvider.value);
    }
    
    const apiKey = document.getElementById('api-key') as HTMLInputElement;
    if (apiKey && apiKey.value) {
      localStorage.setItem('apiKey', apiKey.value);
    }
  }

  private showNotification(message: string) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--apple-blue);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  private handleResourceClick(resource: string | undefined) {
    if (!resource) return;
    
    // Handle resource actions
    switch (resource) {
      case 'syllabus':
        // Download syllabus
        window.open('/resources/syllabus.pdf', '_blank');
        break;
      case 'indoor':
        // Show indoor activities
        this.showResourceModal('Indoor Activities', 'Collection of indoor PE activities...');
        break;
      case 'outdoor':
        // Show outdoor activities
        this.showResourceModal('Outdoor Activities', 'Collection of outdoor PE activities...');
        break;
      case 'worksheet':
        // Download worksheet
        window.open('/resources/worksheet.pdf', '_blank');
        break;
    }
  }

  private showResourceModal(title: string, content: string) {
    // Create modal for resource display
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <p>${content}</p>
        <button class="btn btn-primary mt-3" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
}