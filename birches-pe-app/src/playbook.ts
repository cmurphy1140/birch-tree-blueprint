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
      <!-- Navigation Bar -->
      <nav class="nav-bar">
        <div class="nav-container">
          <a href="/" class="nav-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.5 2 9.5 3 9.5 4.5c0 .7.3 1.3.7 1.8L8.5 8H7c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h.5l2.2 5.5c.2.4.6.5 1 .5s.8-.1 1-.5L14 14h.5c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-1.5l-1.7-1.7c.4-.5.7-1.1.7-1.8C14.5 3 13.5 2 12 2z"/>
            </svg>
            <span>Birch Tree Blueprint</span>
          </a>
          <div style="display: flex; gap: 12px;">
            <a href="/" class="btn btn-ghost">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </a>
            <button class="btn btn-primary" id="print-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print
            </button>
          </div>
        </div>
      </nav>

      <!-- Playbook Content -->
      <div class="playbook-container" style="padding-top: calc(48px + 64px);">
        <!-- Playbook Header -->
        <div class="playbook-header">
          <h1 class="playbook-title fade-in-up">${this.playbook.title}</h1>
          <div class="playbook-meta fade-in-up">
            <span>${this.userInput.gradeLevel}</span>
            <span>•</span>
            <span>${this.userInput.duration} minutes</span>
            <span>•</span>
            <span>${this.userInput.environment === 'indoor' ? 'Indoor' : 'Outdoor'}</span>
          </div>
        </div>

        <!-- Overview Section -->
        <div class="playbook-content fade-in-up">
          <h2>Overview</h2>
          <p>${this.playbook.overview}</p>
          
          <h2>Program Goals</h2>
          <ul>
            ${this.playbook.goals.map(goal => `<li>${goal}</li>`).join('')}
          </ul>

          <h2>Standards Alignment</h2>
          <div class="grid grid-3" style="margin-top: 24px;">
            ${this.userInput.standards.map(standard => `
              <div class="feature-card">
                <div class="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </div>
                <h3 class="feature-title" style="text-transform: capitalize;">${standard.replace(/_/g, ' ')}</h3>
              </div>
            `).join('')}
          </div>

          <!-- Lessons Section -->
          <h2 style="margin-top: 64px;">Lesson Plans</h2>
          ${this.playbook.lessons.map((lesson, index) => `
            <div class="card" style="margin-top: 32px;">
              <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">
                Lesson ${index + 1}: ${lesson.title}
              </h3>
              
              <!-- Warm-up -->
              <div style="margin-bottom: 32px;">
                <h4 style="font-size: 19px; font-weight: 600; margin-bottom: 12px; color: var(--apple-blue);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                    <path d="M13 2L3 14l9 0 -1 8 10-12-9 0 1-8"/>
                  </svg>
                  Warm-up (${lesson.warmUp.duration} min)
                </h4>
                <p style="margin-bottom: 8px;">${lesson.warmUp.description}</p>
                ${lesson.warmUp.equipment.length > 0 ? 
                  `<p style="font-size: 14px; color: var(--color-text-secondary);">Equipment: ${lesson.warmUp.equipment.join(', ')}</p>` : ''}
              </div>

              <!-- Skill Focus -->
              <div style="margin-bottom: 32px;">
                <h4 style="font-size: 19px; font-weight: 600; margin-bottom: 12px; color: var(--apple-blue);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                  </svg>
                  Skill Focus (${lesson.skillFocus.duration} min)
                </h4>
                <p style="margin-bottom: 8px;">${lesson.skillFocus.description}</p>
                <p style="font-size: 14px; color: var(--color-text-secondary);">Skills: ${lesson.skillFocus.skills.join(', ')}</p>
              </div>

              <!-- Main Activity -->
              <div style="margin-bottom: 32px; padding: 24px; background: var(--apple-gray-02); border-radius: 12px;">
                <h4 style="font-size: 19px; font-weight: 600; margin-bottom: 12px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  Main Activity (${lesson.mainActivity.duration} min): ${lesson.mainActivity.name}
                </h4>
                <p style="margin-bottom: 16px;">${lesson.mainActivity.description}</p>
                <h5 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Rules:</h5>
                <ul style="margin-left: 20px;">
                  ${lesson.mainActivity.rules.map(rule => `<li>${rule}</li>`).join('')}
                </ul>
                ${lesson.mainActivity.equipment.length > 0 ? 
                  `<p style="font-size: 14px; color: var(--color-text-secondary); margin-top: 16px;">Equipment: ${lesson.mainActivity.equipment.join(', ')}</p>` : ''}
              </div>

              <!-- Differentiation -->
              <div class="grid grid-2" style="margin-bottom: 32px;">
                <div class="card" style="background: var(--apple-gray-02);">
                  <h5 style="font-size: 17px; font-weight: 600; margin-bottom: 8px; color: #34c759;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Easier Modification
                  </h5>
                  <p>${lesson.differentiation.easier}</p>
                </div>
                <div class="card" style="background: var(--apple-gray-02);">
                  <h5 style="font-size: 17px; font-weight: 600; margin-bottom: 8px; color: #ff9500;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                      <path d="M12 5v14M5 12h14M16 8l4-4M8 16l-4 4"/>
                    </svg>
                    Harder Modification
                  </h5>
                  <p>${lesson.differentiation.harder}</p>
                </div>
              </div>

              <!-- Closure & Assessment -->
              <div class="grid grid-2" style="margin-bottom: 32px;">
                <div>
                  <h5 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 12h8M12 8v8"/>
                    </svg>
                    Closure (${lesson.closure.duration} min)
                  </h5>
                  <p style="margin-bottom: 8px;">${lesson.closure.description}</p>
                  <p><strong>Reflection:</strong> ${lesson.closure.reflection}</p>
                </div>
                <div>
                  <h5 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Assessment
                  </h5>
                  <p style="margin-bottom: 8px;"><strong>Formative:</strong> ${lesson.assessment.formative}</p>
                  <p><strong>Summative:</strong> ${lesson.assessment.summative}</p>
                </div>
              </div>

              ${lesson.safety.length > 0 ? `
                <div style="padding: 16px; background: rgba(255, 59, 48, 0.1); border-radius: 12px; margin-bottom: 24px;">
                  <h5 style="font-size: 17px; font-weight: 600; margin-bottom: 8px; color: #ff3b30;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Safety Considerations
                  </h5>
                  <ul style="margin-left: 20px;">
                    ${lesson.safety.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${lesson.socialEmotional ? `
                <div style="padding: 16px; background: rgba(88, 86, 214, 0.1); border-radius: 12px;">
                  <h5 style="font-size: 17px; font-weight: 600; margin-bottom: 8px; color: #5856d6;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 8px;">
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

        <!-- Actions -->
        <div class="playbook-actions">
          <button class="btn btn-primary" id="save-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
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
      
      <div class="container" style="padding-top: 120px;">
        <div class="card" style="text-align: center; padding: 64px; max-width: 600px; margin: 0 auto;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 24px; opacity: 0.3;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h2 style="font-size: 32px; font-weight: 600; margin-bottom: 12px;">No Playbook Found</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 32px;">Generate a playbook first to see it here.</p>
          <a href="/" class="btn btn-primary btn-large">Go to Generator</a>
        </div>
      </div>
    `;
  }

  private renderError() {
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
      
      <div class="container" style="padding-top: 120px;">
        <div class="card" style="text-align: center; padding: 64px; max-width: 600px; margin: 0 auto;">
          <h2 style="font-size: 32px; font-weight: 600; margin-bottom: 12px;">Error Loading Playbook</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 32px;">There was an error loading your playbook.</p>
          <a href="/" class="btn btn-primary btn-large">Back to Generator</a>
        </div>
      </div>
    `;
  }

  private attachEventListeners() {
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
    
    // Show notification
    this.showNotification('Playbook saved successfully!');
  }

  private showExportOptions() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <h3>Export Playbook</h3>
        <p>Select export format:</p>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); window.print();">PDF (Print)</button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove();">Word Document</button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove();">JSON</button>
        </div>
        <button class="btn btn-ghost" style="margin-top: 24px;" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  private showNotification(message: string) {
    const notification = document.createElement('div');
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
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#playbook-app');
  if (app) {
    new PlaybookDisplay(app);
  }
});