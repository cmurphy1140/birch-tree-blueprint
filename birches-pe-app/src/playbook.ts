import './styles/app.css';
import type { Playbook, GeneratorInput } from './types';

class PlaybookDisplay {
  private container: HTMLElement;
  private playbook: Playbook | null = null;
  private userInput: GeneratorInput | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init() {
    // Get playbook data from sessionStorage
    const storedData = sessionStorage.getItem('currentPlaybook');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        this.playbook = data.playbook;
        this.userInput = data.userInput;
        this.render();
      } catch (error) {
        console.error('Failed to load playbook:', error);
        this.renderError();
      }
    } else {
      this.renderEmpty();
    }
  }

  private render() {
    if (!this.playbook || !this.userInput) {
      this.renderEmpty();
      return;
    }

    this.container.innerHTML = `
      <nav class="nav glass">
        <div class="container">
          <div class="nav-container">
            <a href="/" class="nav-logo">
              <img src="/birch-tree-logo.svg" alt="Birch Tree Blueprint" width="32" height="32" />
              <span>Birch Tree Blueprint</span>
            </a>
            <div class="nav-menu">
              <a href="/" class="btn btn-ghost">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Generator
              </a>
              <button class="btn btn-primary" id="print-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print
              </button>
              <button class="btn btn-ghost btn-icon" id="theme-toggle" aria-label="Toggle theme">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mt-4">
        <div class="playbook-header card glass mb-4">
          <h1>${this.playbook.title}</h1>
          <div class="flex gap-2 flex-wrap mt-2">
            <span class="badge badge-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              ${this.userInput.gradeLevel}
            </span>
            <span class="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              ${this.userInput.duration} minutes
            </span>
            <span class="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${this.userInput.environment === 'indoor' ? 
                  '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>' : 
                  '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'}
              </svg>
              ${this.userInput.environment === 'indoor' ? 'Indoor' : 'Outdoor'}
            </span>
            ${this.userInput.standards.map(s => `
              <span class="badge badge-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                ${s}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="user-input-summary card glass mb-4">
          <h3>Configuration Details</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <strong>Equipment Level:</strong> ${this.userInput.equipmentLevel || 'Standard'}
            </div>
            <div>
              <strong>Team-Based:</strong> ${this.userInput.activityPreferences?.teamBased ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Competitive:</strong> ${this.userInput.activityPreferences?.competitive ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Creative:</strong> ${this.userInput.activityPreferences?.creative ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div class="playbook-overview card glass mb-4">
          <h2>Overview</h2>
          <p>${this.playbook.overview}</p>
          
          <h3 class="mt-3">Program Goals</h3>
          <ul>
            ${this.playbook.goals.map(goal => `<li>${goal}</li>`).join('')}
          </ul>
        </div>

        <h2 class="mb-3">Lesson Plans</h2>
        <div class="lessons-container">
          ${this.playbook.lessons.map((lesson, index) => `
            <div class="lesson-card card glass mb-4">
              <h3>Lesson ${index + 1}: ${lesson.title}</h3>
              
              <div class="lesson-components grid grid-cols-2 gap-3 mt-3">
                <div class="component-card">
                  <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <path d="M13 2L3 14l9 0 -1 8 10-12-9 0 1-8"/>
                    </svg>
                    Warm-up (${lesson.warmUp.duration} min)
                  </h4>
                  <p>${lesson.warmUp.description}</p>
                  ${lesson.warmUp.equipment.length > 0 ? 
                    `<small>Equipment: ${lesson.warmUp.equipment.join(', ')}</small>` : ''}
                </div>

                <div class="component-card">
                  <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                    </svg>
                    Skill Focus (${lesson.skillFocus.duration} min)
                  </h4>
                  <p>${lesson.skillFocus.description}</p>
                  <small>Skills: ${lesson.skillFocus.skills.join(', ')}</small>
                </div>
              </div>

              <div class="main-activity-card mt-3">
                <h4>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  Main Activity (${lesson.mainActivity.duration} min): ${lesson.mainActivity.name}
                </h4>
                <p>${lesson.mainActivity.description}</p>
                <h5>Rules:</h5>
                <ul>
                  ${lesson.mainActivity.rules.map(rule => `<li>${rule}</li>`).join('')}
                </ul>
                ${lesson.mainActivity.equipment.length > 0 ? 
                  `<small>Equipment: ${lesson.mainActivity.equipment.join(', ')}</small>` : ''}
              </div>

              <div class="differentiation-card grid grid-cols-2 gap-3 mt-3">
                <div>
                  <h5>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Easier Modification
                  </h5>
                  <p>${lesson.differentiation.easier}</p>
                </div>
                <div>
                  <h5>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <path d="M12 5v14M5 12h14M16 8l4-4M8 16l-4 4"/>
                    </svg>
                    Harder Modification
                  </h5>
                  <p>${lesson.differentiation.harder}</p>
                </div>
              </div>

              <div class="closure-assessment grid grid-cols-2 gap-3 mt-3">
                <div>
                  <h5>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 12h8M12 8v8"/>
                    </svg>
                    Closure (${lesson.closure.duration} min)
                  </h5>
                  <p>${lesson.closure.description}</p>
                  <p><strong>Reflection:</strong> ${lesson.closure.reflection}</p>
                </div>
                <div>
                  <h5>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    Assessment
                  </h5>
                  <p><strong>Formative:</strong> ${lesson.assessment.formative}</p>
                  <p><strong>Summative:</strong> ${lesson.assessment.summative}</p>
                </div>
              </div>

              ${lesson.safety.length > 0 ? `
                <div class="safety-card mt-3">
                  <h5>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Safety Considerations
                  </h5>
                  <ul>
                    ${lesson.safety.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${lesson.socialEmotional ? `
                <div class="sel-card mt-3">
                  <h5>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Social-Emotional Learning
                  </h5>
                  <p>${lesson.socialEmotional}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div class="actions-footer card glass mt-4 flex justify-center gap-3">
          <button class="btn btn-primary" id="save-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Playbook
          </button>
          <button class="btn btn-secondary" id="export-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <a href="/" class="btn btn-ghost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Generate New
          </a>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderEmpty() {
    this.container.innerHTML = `
      <nav class="nav glass">
        <div class="container">
          <div class="nav-container">
            <a href="/" class="nav-logo">
              <img src="/birch-tree-logo.svg" alt="Birch Tree Blueprint" width="32" height="32" />
              <span>Birch Tree Blueprint</span>
            </a>
          </div>
        </div>
      </nav>
      
      <div class="container mt-4">
        <div class="card glass text-center p-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 opacity-30">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h2>No Playbook Found</h2>
          <p class="text-muted mb-3">Generate a playbook first to see it here.</p>
          <a href="/" class="btn btn-primary">Go to Generator</a>
        </div>
      </div>
    `;
  }

  private renderError() {
    this.container.innerHTML = `
      <div class="container mt-4">
        <div class="card glass text-center p-4">
          <h2>Error Loading Playbook</h2>
          <p class="text-muted mb-3">There was an error loading your playbook.</p>
          <a href="/" class="btn btn-primary">Back to Generator</a>
        </div>
      </div>
    `;
  }

  private attachEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      document.documentElement.toggleAttribute('data-theme');
      localStorage.setItem('theme', document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light');
    });

    // Print button
    document.getElementById('print-btn')?.addEventListener('click', () => {
      window.print();
    });

    // Save button
    document.getElementById('save-btn')?.addEventListener('click', () => {
      this.savePlaybook();
    });

    // Export button
    document.getElementById('export-btn')?.addEventListener('click', () => {
      this.showExportOptions();
    });
  }

  private savePlaybook() {
    if (!this.playbook) return;
    
    // Save to localStorage
    const saved = localStorage.getItem('savedPlaybooks');
    const playbooks = saved ? JSON.parse(saved) : [];
    
    playbooks.unshift({
      ...this.playbook,
      savedAt: new Date().toISOString()
    });
    
    // Keep only last 10
    const trimmed = playbooks.slice(0, 10);
    localStorage.setItem('savedPlaybooks', JSON.stringify(trimmed));
    
    alert('Playbook saved successfully!');
  }

  private showExportOptions() {
    // TODO: Implement export modal
    alert('Export functionality coming soon!');
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#playbook-app');
  if (app) {
    new PlaybookDisplay(app);
  }
  
  // Load theme preference
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});