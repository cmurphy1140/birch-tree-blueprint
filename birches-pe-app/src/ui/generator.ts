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
      <div class="generator-container">
        <nav class="nav glass">
          <div class="container">
            <div class="nav-container">
              <a href="/" class="nav-logo">
                <img src="/birch-tree-logo.svg" alt="Birch Tree Blueprint" width="32" height="32" />
                <span>Birch Tree Blueprint</span>
              </a>
              <div class="nav-menu">
                <button class="btn btn-ghost btn-icon" id="theme-toggle" aria-label="Toggle theme">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                </button>
                <button class="btn btn-ghost btn-icon" id="settings-btn" aria-label="Settings">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m3.22-10.22l4.24-4.24M5.54 5.54L1.3 1.3m17.16 17.16l-4.24-4.24M5.54 18.46L1.3 22.7M23 12h-6m-6 0H1m10.22 3.22l-4.24 4.24M18.46 5.54L22.7 1.3m-4.24 17.16l4.24 4.24M5.54 5.54L1.3 9.78"/>
                  </svg>
                </button>
                <button class="btn btn-ghost btn-icon" id="library-btn" aria-label="Library">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div class="container mt-4">
          <!-- Hero Section -->
          <div class="hero-section text-center mb-4">
            <h1 class="hero-title">Birch Tree Blueprint</h1>
            <p class="hero-subtitle">Professional PE Playbook Generator for K-8 Education</p>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <!-- Input Form -->
            <div class="card glass">
              <h2>Create Your Playbook</h2>
              
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
                  <label class="form-label">Duration (minutes)</label>
                  <select class="form-select" name="duration" required>
                    <option value="">Select duration</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Environment</label>
                  <div class="flex gap-2">
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
                  <label class="form-label">PE Standards (select 1-3)</label>
                  <div id="standards-checkboxes" class="standards-grid">
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
                  <label class="form-label">Fun Factors</label>
                  <label class="form-checkbox">
                    <input type="checkbox" name="teamBased" value="true">
                    <span>Team-based</span>
                  </label>
                  <label class="form-checkbox">
                    <input type="checkbox" name="competitive" value="true">
                    <span>Competitive</span>
                  </label>
                  <label class="form-checkbox">
                    <input type="checkbox" name="creative" value="true">
                    <span>Creative/Imaginative</span>
                  </label>
                </div>

                <div class="form-group">
                  <label class="form-checkbox">
                    <input type="checkbox" id="use-ai" ${this.useAI ? 'checked' : ''}>
                    <span>Use AI Generation (Claude/OpenAI)</span>
                  </label>
                </div>

                <div class="flex gap-2">
                  <button type="submit" class="btn btn-primary flex-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    Generate Playbook
                  </button>
                  <button type="button" id="quick-preset" class="btn btn-secondary">
                    Quick
                  </button>
                </div>
              </form>
            </div>

            <!-- Output Display -->
            <div class="card glass" style="grid-column: span 2;">
              <div class="playbook-header flex justify-between items-center mb-3">
                <h2>Generated Playbook</h2>
                <div class="flex gap-2">
                  <button class="btn btn-ghost btn-icon" id="save-btn" disabled aria-label="Save">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                  </button>
                  <button class="btn btn-ghost btn-icon" id="export-btn" disabled aria-label="Export">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                  <button class="btn btn-ghost btn-icon" id="print-btn" disabled aria-label="Print">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 6 2 18 2 18 9"/>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                      <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                  </button>
                  <button class="btn btn-ghost btn-icon" id="regenerate-btn" disabled aria-label="Regenerate">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="23 4 23 10 17 10"/>
                      <polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div id="playbook-content" class="playbook-content">
                <div class="empty-state text-center p-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 opacity-30">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <p class="text-muted">Configure options and generate your first playbook</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Modal -->
        <div id="settings-modal" class="modal-overlay">
          <div class="modal">
            <h3>Settings</h3>
            <div class="form-group">
              <label class="form-label">AI Provider</label>
              <select class="form-select" id="ai-provider">
                <option value="anthropic">Anthropic Claude</option>
                <option value="openai">OpenAI GPT-4</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">API Key</label>
              <input type="password" class="form-input" id="api-key" placeholder="sk-...">
              <small class="text-muted">Your key is stored locally and never sent to our servers</small>
            </div>
            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" id="blend-mode">
                <span>Blend Mode (Mix AI + Deterministic)</span>
              </label>
            </div>
            <div class="flex gap-2 justify-end mt-3">
              <button class="btn btn-ghost" id="settings-cancel">Cancel</button>
              <button class="btn btn-primary" id="settings-save">Save Settings</button>
            </div>
          </div>
        </div>

        <!-- Library Modal -->
        <div id="library-modal" class="modal-overlay">
          <div class="modal" style="max-width: 800px;">
            <h3>Saved Playbooks</h3>
            <div id="library-list" class="library-list mt-3">
              <!-- Populated dynamically -->
            </div>
            <div class="flex justify-end mt-3">
              <button class="btn btn-ghost" id="library-close">Close</button>
            </div>
          </div>
        </div>

        <!-- Export Modal -->
        <div id="export-modal" class="modal-overlay">
          <div class="modal">
            <h3>Export Playbook</h3>
            <div class="export-options grid grid-cols-2 gap-2 mt-3">
              <button class="btn btn-secondary" data-format="pdf">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                PDF
              </button>
              <button class="btn btn-secondary" data-format="docx">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Word
              </button>
              <button class="btn btn-secondary" data-format="markdown">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="M7 11h2l2 4 2-4h2M15 11v6"/>
                </svg>
                Markdown
              </button>
              <button class="btn btn-secondary" data-format="csv">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                </svg>
                CSV
              </button>
            </div>
            <div class="flex justify-end mt-3">
              <button class="btn btn-ghost" id="export-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.loadStandardsCheckboxes();
  }

  private async loadStandardsCheckboxes() {
    try {
      console.log('Loading standards...');
      const response = await fetch('/data/standards.json');
      const standards = await response.json();
      console.log('Standards loaded:', standards);
      
      const container = document.getElementById('standards-checkboxes');
      
      if (container && Array.isArray(standards)) {
        container.innerHTML = standards.map((std: any) => `
          <label class="form-checkbox">
            <input type="checkbox" name="standards" value="${std.id}">
            <span title="${std.description}">${std.name}</span>
          </label>
        `).join('');
        console.log(`Loaded ${standards.length} standards checkboxes`);
      } else {
        console.error('Standards container not found or data is not an array');
      }
    } catch (error) {
      console.error('Failed to load standards:', error);
    }
  }

  private attachEventListeners() {
    // Form submission
    const form = document.getElementById('generator-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => this.handleGenerate(e));

    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      document.documentElement.toggleAttribute('data-theme');
      localStorage.setItem('theme', document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light');
    });

    // Settings modal
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.add('active');
    });

    document.getElementById('settings-cancel')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('active');
    });

    document.getElementById('settings-save')?.addEventListener('click', () => {
      this.saveSettings();
    });

    // Library modal
    document.getElementById('library-btn')?.addEventListener('click', () => {
      this.showLibrary();
    });

    document.getElementById('library-close')?.addEventListener('click', () => {
      document.getElementById('library-modal')?.classList.remove('active');
    });

    // Export modal
    document.getElementById('export-btn')?.addEventListener('click', () => {
      document.getElementById('export-modal')?.classList.add('active');
    });

    document.getElementById('export-cancel')?.addEventListener('click', () => {
      document.getElementById('export-modal')?.classList.remove('active');
    });

    // Export format buttons
    document.querySelectorAll('[data-format]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const format = (e.currentTarget as HTMLElement).dataset.format;
        if (format && this.currentPlaybook) {
          this.exportPlaybook(format);
        }
      });
    });

    // Other buttons
    document.getElementById('save-btn')?.addEventListener('click', () => this.savePlaybook());
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());
    document.getElementById('regenerate-btn')?.addEventListener('click', () => this.regenerate());

    // Quick preset
    document.getElementById('quick-preset')?.addEventListener('click', () => {
      this.applyQuickPreset();
    });

    // AI toggle
    document.getElementById('use-ai')?.addEventListener('change', (e) => {
      this.useAI = (e.target as HTMLInputElement).checked;
    });
  }

  private async handleGenerate(e: Event) {
    e.preventDefault();
    console.log('Generate button clicked!');
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Build input object
    const standards = formData.getAll('standards') as string[];
    console.log('Selected standards:', standards);
    
    if (standards.length === 0 || standards.length > 3) {
      alert('Please select 1-3 PE standards');
      return;
    }

    const input: GeneratorInput = {
      gradeLevel: formData.get('gradeLevel') as 'K-2' | '3-5' | '6-8',
      duration: parseInt(formData.get('duration') as string) as 30 | 45 | 60,
      environment: formData.get('environment') as 'indoor' | 'outdoor',
      standards,
      equipmentLevel: formData.get('equipmentLevel') as 'minimal' | 'standard' | 'full',
      activityPreferences: {
        teamBased: (form.querySelector('input[name="teamBased"]') as HTMLInputElement)?.checked || false,
        competitive: (form.querySelector('input[name="competitive"]') as HTMLInputElement)?.checked || false,
        creative: (form.querySelector('input[name="creative"]') as HTMLInputElement)?.checked || false
      }
    };
    
    console.log('Input object:', input);

    // Show loading state
    const content = document.getElementById('playbook-content');
    if (content) {
      content.innerHTML = '<div class="text-center p-4"><div class="spinner"></div><p class="mt-2">Generating playbook...</p></div>';
    }

    try {
      // Generate playbook
      console.log('Starting generation...');
      let playbook: Playbook;
      
      if (this.useAI) {
        console.log('Using AI generation');
        const apiKey = localStorage.getItem('api-key');
        const provider = localStorage.getItem('ai-provider') || 'anthropic';
        
        if (!apiKey) {
          alert('Please configure your API key in settings');
          return;
        }
        
        playbook = await this.aiGenerator.generate(input, { apiKey, provider });
      } else {
        console.log('Using deterministic generation');
        playbook = await this.generator.generate(input);
        console.log('Generated playbook:', playbook);
      }

      this.currentPlaybook = playbook;
      
      // Store playbook and input in sessionStorage
      const playbookData = {
        playbook,
        userInput: input
      };
      sessionStorage.setItem('currentPlaybook', JSON.stringify(playbookData));
      
      // Navigate to the playbook page
      window.location.href = '/playbook.html';
    } catch (error) {
      console.error('Generation failed:', error);
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (content) {
        content.innerHTML = `<div class="text-center p-4" style="color: red;">Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
      }
    }
  }

  private renderPlaybook(playbook: Playbook) {
    const content = document.getElementById('playbook-content');
    if (!content) return;

    content.innerHTML = `
      <div class="playbook fade-in">
        <div class="playbook-meta mb-3">
          <h3>${playbook.title}</h3>
          <div class="flex gap-2 flex-wrap">
            <span class="badge badge-primary">${playbook.metadata.gradeLevel}</span>
            <span class="badge">${playbook.metadata.duration} min</span>
            <span class="badge">${playbook.metadata.environment}</span>
            ${playbook.metadata.standards.map(s => `<span class="badge badge-success">${s}</span>`).join('')}
          </div>
        </div>

        <div class="playbook-overview card mb-3">
          <h4>Overview</h4>
          <p>${playbook.overview}</p>
          <p><strong>Goals:</strong> ${playbook.goals.join(', ')}</p>
        </div>

        <div class="playbook-lessons">
          ${playbook.lessons.map((lesson, i) => `
            <div class="lesson-block card mb-3">
              <h4>Lesson ${i + 1}: ${lesson.title}</h4>
              
              <div class="lesson-section">
                <h5>Warm-up (${lesson.warmUp.duration} min)</h5>
                <p>${lesson.warmUp.description}</p>
                ${lesson.warmUp.equipment.length > 0 ? `<p><small>Equipment: ${lesson.warmUp.equipment.join(', ')}</small></p>` : ''}
              </div>

              <div class="lesson-section">
                <h5>Skill Focus (${lesson.skillFocus.duration} min)</h5>
                <p>${lesson.skillFocus.description}</p>
                <p><strong>Skills:</strong> ${lesson.skillFocus.skills.join(', ')}</p>
              </div>

              <div class="lesson-section">
                <h5>Main Activity (${lesson.mainActivity.duration} min)</h5>
                <p><strong>${lesson.mainActivity.name}</strong></p>
                <p>${lesson.mainActivity.description}</p>
                <p><strong>Rules:</strong></p>
                <ul>${lesson.mainActivity.rules.map(r => `<li>${r}</li>`).join('')}</ul>
                ${lesson.mainActivity.equipment.length > 0 ? `<p><small>Equipment: ${lesson.mainActivity.equipment.join(', ')}</small></p>` : ''}
              </div>

              <div class="lesson-section">
                <h5>Differentiation</h5>
                <p><strong>Easier:</strong> ${lesson.differentiation.easier}</p>
                <p><strong>Harder:</strong> ${lesson.differentiation.harder}</p>
              </div>

              <div class="lesson-section">
                <h5>Closure (${lesson.closure.duration} min)</h5>
                <p>${lesson.closure.description}</p>
                <p><strong>Reflection:</strong> ${lesson.closure.reflection}</p>
              </div>

              <div class="lesson-section">
                <h5>Assessment</h5>
                <p><strong>Formative:</strong> ${lesson.assessment.formative}</p>
                <p><strong>Summative:</strong> ${lesson.assessment.summative}</p>
              </div>

              ${lesson.safety.length > 0 ? `
                <div class="lesson-section">
                  <h5>Safety Considerations</h5>
                  <ul>${lesson.safety.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
              ` : ''}

              ${lesson.socialEmotional ? `
                <div class="lesson-section">
                  <h5>Social-Emotional Learning</h5>
                  <p>${lesson.socialEmotional}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private async savePlaybook() {
    if (!this.currentPlaybook) return;
    
    const name = prompt('Name this playbook:', this.currentPlaybook.title);
    if (name) {
      this.currentPlaybook.title = name;
      await this.store.savePlaybook(this.currentPlaybook);
      alert('Playbook saved!');
    }
  }

  private async showLibrary() {
    const playbooks = await this.store.getAllPlaybooks();
    const list = document.getElementById('library-list');
    
    if (list) {
      if (playbooks.length === 0) {
        list.innerHTML = '<p class="text-center text-muted">No saved playbooks yet</p>';
      } else {
        list.innerHTML = playbooks.map((pb, i) => `
          <div class="library-item card mb-2 flex justify-between items-center">
            <div>
              <h5>${pb.title}</h5>
              <div class="flex gap-2">
                <span class="badge">${pb.metadata.gradeLevel}</span>
                <span class="badge">${pb.metadata.duration} min</span>
                <span class="badge">${new Date(pb.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div class="flex gap-1">
              <button class="btn btn-ghost btn-icon" onclick="generatorUI.loadPlaybook(${i})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button class="btn btn-ghost btn-icon" onclick="generatorUI.deletePlaybook('${pb.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        `).join('');
      }
    }
    
    document.getElementById('library-modal')?.classList.add('active');
  }

  async loadPlaybook(index: number) {
    const playbooks = await this.store.getAllPlaybooks();
    if (playbooks[index]) {
      this.currentPlaybook = playbooks[index];
      this.renderPlaybook(this.currentPlaybook);
      document.getElementById('library-modal')?.classList.remove('active');
      
      // Enable action buttons
      document.querySelectorAll('#save-btn, #export-btn, #print-btn, #regenerate-btn').forEach(btn => {
        btn.removeAttribute('disabled');
      });
    }
  }

  async deletePlaybook(id: string) {
    if (confirm('Delete this playbook?')) {
      await this.store.deletePlaybook(id);
      this.showLibrary();
    }
  }

  private async exportPlaybook(format: string) {
    if (!this.currentPlaybook) return;
    
    try {
      switch (format) {
        case 'pdf':
          window.print();
          break;
        case 'docx':
          const docxBlob = await this.exportManager.toDocx(this.currentPlaybook);
          this.downloadBlob(docxBlob, `${this.currentPlaybook.title}.docx`);
          break;
        case 'markdown':
          const mdBlob = await this.exportManager.toMarkdown(this.currentPlaybook);
          this.downloadBlob(mdBlob, `${this.currentPlaybook.title}.md`);
          break;
        case 'csv':
          const csvBlob = await this.exportManager.toCsv(this.currentPlaybook);
          this.downloadBlob(csvBlob, `${this.currentPlaybook.title}.csv`);
          break;
      }
      
      document.getElementById('export-modal')?.classList.remove('active');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private regenerate() {
    const form = document.getElementById('generator-form') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit'));
    }
  }

  private applyQuickPreset() {
    const form = document.getElementById('generator-form') as HTMLFormElement;
    if (form) {
      (form.elements.namedItem('gradeLevel') as HTMLSelectElement).value = '3-5';
      (form.elements.namedItem('duration') as HTMLSelectElement).value = '45';
      (form.elements.namedItem('environment') as HTMLInputElement).value = 'indoor';
      (form.elements.namedItem('equipmentLevel') as HTMLSelectElement).value = 'standard';
      
      // Check first 2 standards
      const checkboxes = form.querySelectorAll('input[name="standards"]');
      checkboxes.forEach((cb, i) => {
        (cb as HTMLInputElement).checked = i < 2;
      });
    }
  }

  private saveSettings() {
    const provider = (document.getElementById('ai-provider') as HTMLSelectElement)?.value;
    const apiKey = (document.getElementById('api-key') as HTMLInputElement)?.value;
    const blendMode = (document.getElementById('blend-mode') as HTMLInputElement)?.checked;
    
    if (provider) localStorage.setItem('ai-provider', provider);
    if (apiKey) localStorage.setItem('api-key', apiKey);
    localStorage.setItem('blend-mode', blendMode ? 'true' : 'false');
    
    document.getElementById('settings-modal')?.classList.remove('active');
  }

  private loadSettings() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    const provider = localStorage.getItem('ai-provider');
    if (provider) {
      (document.getElementById('ai-provider') as HTMLSelectElement).value = provider;
    }
    
    const blendMode = localStorage.getItem('blend-mode') === 'true';
    (document.getElementById('blend-mode') as HTMLInputElement).checked = blendMode;
  }
}

// Export for global access
(window as any).generatorUI = null;