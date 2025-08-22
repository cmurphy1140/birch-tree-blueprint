import './styles/app.css';

class Dashboard {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.attachEventListeners();
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
          <div style="display: flex; gap: 16px; align-items: center;">
            <a href="/generator.html" class="btn btn-primary">Generate Playbook</a>
            <a href="/playbook.html" class="btn btn-ghost">My Playbooks</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 120px 0 80px;">
        <div class="hero-content">
          <h1 class="hero-headline" style="color: white; font-size: 72px; margin-bottom: 24px;">
            Birch Tree Blueprint
          </h1>
          <p class="hero-subheadline" style="color: rgba(255,255,255,0.9); font-size: 32px; font-weight: 300;">
            Professional PE Curriculum for K-8 Education
          </p>
          <div style="margin-top: 48px; display: flex; gap: 16px; justify-content: center;">
            <a href="/generator.html" class="btn btn-large" style="background: white; color: #667eea; font-size: 18px; padding: 18px 36px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Start Generating
            </a>
            <button class="btn btn-large btn-ghost" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white; font-size: 18px; padding: 18px 36px;">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Access Cards -->
      <div class="container" style="margin-top: -40px; position: relative; z-index: 10;">
        <div class="grid grid-4">
          <div class="card feature-card" onclick="window.location.href='/generator.html'">
            <div class="feature-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3 class="feature-title">Create Playbook</h3>
            <p class="feature-description">Generate custom PE lessons</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h3 class="feature-title">My Library</h3>
            <p class="feature-description">Access saved playbooks</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 class="feature-title">Quick Start</h3>
            <p class="feature-description">30-minute lesson templates</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #fa709a, #fee140);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 class="feature-title">Standards</h3>
            <p class="feature-description">PE curriculum alignment</p>
          </div>
        </div>
      </div>

      <!-- Grade Level Selector -->
      <div class="container" style="margin-top: 80px;">
        <div style="text-align: center; margin-bottom: 48px;">
          <h2 style="font-size: 48px; font-weight: 600; margin-bottom: 16px;">Choose Your Grade Level</h2>
          <p style="font-size: 21px; color: var(--color-text-secondary);">Select a grade band to explore age-appropriate activities</p>
        </div>
        
        <div class="grid grid-3" style="gap: 32px;">
          <div class="grade-card" data-grade="K-2" style="cursor: pointer; transition: all 0.3s;">
            <div class="card" style="padding: 48px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <div style="font-size: 64px; margin-bottom: 24px;">🎈</div>
              <h3 style="font-size: 32px; margin-bottom: 16px;">Grades K-2</h3>
              <p style="font-size: 18px; opacity: 0.9;">Fundamental movement skills</p>
              <ul style="list-style: none; padding: 0; margin-top: 24px; font-size: 16px; text-align: left;">
                <li style="margin-bottom: 8px;">✓ Basic locomotor skills</li>
                <li style="margin-bottom: 8px;">✓ Balance & coordination</li>
                <li style="margin-bottom: 8px;">✓ Simple games</li>
                <li>✓ Movement exploration</li>
              </ul>
            </div>
          </div>

          <div class="grade-card" data-grade="3-5" style="cursor: pointer; transition: all 0.3s;">
            <div class="card" style="padding: 48px; text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
              <div style="font-size: 64px; margin-bottom: 24px;">⚽</div>
              <h3 style="font-size: 32px; margin-bottom: 16px;">Grades 3-5</h3>
              <p style="font-size: 18px; opacity: 0.9;">Skill development & team play</p>
              <ul style="list-style: none; padding: 0; margin-top: 24px; font-size: 16px; text-align: left;">
                <li style="margin-bottom: 8px;">✓ Sport-specific skills</li>
                <li style="margin-bottom: 8px;">✓ Team cooperation</li>
                <li style="margin-bottom: 8px;">✓ Game strategies</li>
                <li>✓ Fitness concepts</li>
              </ul>
            </div>
          </div>

          <div class="grade-card" data-grade="6-8" style="cursor: pointer; transition: all 0.3s;">
            <div class="card" style="padding: 48px; text-align: center; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
              <div style="font-size: 64px; margin-bottom: 24px;">🏃</div>
              <h3 style="font-size: 32px; margin-bottom: 16px;">Grades 6-8</h3>
              <p style="font-size: 18px; opacity: 0.9;">Advanced skills & fitness</p>
              <ul style="list-style: none; padding: 0; margin-top: 24px; font-size: 16px; text-align: left;">
                <li style="margin-bottom: 8px;">✓ Complex strategies</li>
                <li style="margin-bottom: 8px;">✓ Personal fitness</li>
                <li style="margin-bottom: 8px;">✓ Leadership skills</li>
                <li>✓ Lifetime activities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="container" style="margin-top: 80px; margin-bottom: 80px;">
        <div style="text-align: center; margin-bottom: 48px;">
          <h2 style="font-size: 48px; font-weight: 600; margin-bottom: 16px;">Why Choose Birch Tree Blueprint?</h2>
          <p style="font-size: 21px; color: var(--color-text-secondary);">Everything you need for successful PE instruction</p>
        </div>

        <div class="grid grid-3" style="gap: 32px;">
          <div class="feature-benefit">
            <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
            <h3 style="font-size: 24px; margin-bottom: 12px;">Standards-Aligned</h3>
            <p style="color: var(--color-text-secondary);">Every lesson meets national PE standards and state requirements</p>
          </div>

          <div class="feature-benefit">
            <div style="font-size: 48px; margin-bottom: 16px;">⚡</div>
            <h3 style="font-size: 24px; margin-bottom: 12px;">Instant Generation</h3>
            <p style="color: var(--color-text-secondary);">Create complete lesson plans in under 30 seconds</p>
          </div>

          <div class="feature-benefit">
            <div style="font-size: 48px; margin-bottom: 16px;">🎨</div>
            <h3 style="font-size: 24px; margin-bottom: 12px;">Fully Customizable</h3>
            <p style="color: var(--color-text-secondary);">Adapt activities for your equipment and space</p>
          </div>

          <div class="feature-benefit">
            <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
            <h3 style="font-size: 24px; margin-bottom: 12px;">Assessment Tools</h3>
            <p style="color: var(--color-text-secondary);">Built-in formative and summative assessments</p>
          </div>

          <div class="feature-benefit">
            <div style="font-size: 48px; margin-bottom: 16px;">♿</div>
            <h3 style="font-size: 24px; margin-bottom: 12px;">Differentiated</h3>
            <p style="color: var(--color-text-secondary);">Modifications for all ability levels</p>
          </div>

          <div class="feature-benefit">
            <div style="font-size: 48px; margin-bottom: 16px;">💾</div>
            <h3 style="font-size: 24px; margin-bottom: 12px;">Save & Export</h3>
            <p style="color: var(--color-text-secondary);">Download as PDF, Word, or share online</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer style="background: var(--apple-gray-02); padding: 48px 0; margin-top: 80px;">
        <div class="container">
          <div style="text-align: center;">
            <div class="nav-logo" style="justify-content: center; margin-bottom: 24px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.5 2 9.5 3 9.5 4.5c0 .7.3 1.3.7 1.8L8.5 8H7c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h.5l2.2 5.5c.2.4.6.5 1 .5s.8-.1 1-.5L14 14h.5c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-1.5l-1.7-1.7c.4-.5.7-1.1.7-1.8C14.5 3 13.5 2 12 2z"/>
              </svg>
              <span style="font-size: 24px; font-weight: 600;">Birch Tree Blueprint</span>
            </div>
            <p style="color: var(--color-text-secondary); margin-bottom: 24px;">
              Professional PE curriculum tools for modern educators
            </p>
            <div style="display: flex; gap: 24px; justify-content: center;">
              <a href="/generator.html" style="color: var(--apple-blue); text-decoration: none;">Generate Playbook</a>
              <a href="#" style="color: var(--apple-blue); text-decoration: none;">Resources</a>
              <a href="#" style="color: var(--apple-blue); text-decoration: none;">About</a>
              <a href="#" style="color: var(--apple-blue); text-decoration: none;">Contact</a>
            </div>
            <p style="color: var(--color-text-secondary); margin-top: 32px; font-size: 14px;">
              © 2024 Birch Tree Blueprint. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    `;
  }

  private attachEventListeners() {
    // Grade card click handlers
    document.querySelectorAll('.grade-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const grade = (e.currentTarget as HTMLElement).dataset.grade;
        // Navigate to generator with grade preselected
        window.location.href = `/generator.html?grade=${grade}`;
      });

      // Hover effects
      card.addEventListener('mouseenter', (e) => {
        const cardEl = (e.currentTarget as HTMLElement).querySelector('.card') as HTMLElement;
        if (cardEl) {
          cardEl.style.transform = 'translateY(-8px) scale(1.02)';
          cardEl.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        }
      });

      card.addEventListener('mouseleave', (e) => {
        const cardEl = (e.currentTarget as HTMLElement).querySelector('.card') as HTMLElement;
        if (cardEl) {
          cardEl.style.transform = 'translateY(0) scale(1)';
          cardEl.style.boxShadow = 'var(--shadow-md)';
        }
      });
    });

    // Learn More smooth scroll
    document.querySelector('.btn-ghost')?.addEventListener('click', () => {
      document.querySelector('.feature-benefit')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// Initialize dashboard
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  new Dashboard(app);
}