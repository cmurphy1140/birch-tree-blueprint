// Main Application Module
class BirchTreeApp {
    constructor() {
        this.modules = {};
        this.state = {
            currentGrade: 'all',
            theme: localStorage.getItem('theme') || 'light',
            progress: JSON.parse(localStorage.getItem('progress')) || {},
            achievements: JSON.parse(localStorage.getItem('achievements')) || [],
            favorites: JSON.parse(localStorage.getItem('favorites')) || [],
            searchQuery: '',
            viewMode: 'grid'
        };
        this.init();
    }

    async init() {
        console.log('[INFO] Initializing Birch Tree Blueprint App');
        await this.loadModules();
        this.setupEventListeners();
        this.applyTheme();
        this.checkAchievements();
    }

    async loadModules() {
        // Dynamically load all feature modules
        this.modules.particles = new ParticleSystem();
        this.modules.gradeSelector = new GradeSelector(this);
        this.modules.search = new SearchSystem(this);
        this.modules.progress = new ProgressTracker(this);
        this.modules.timer = new WorkoutTimer(this);
        this.modules.quiz = new QuizSystem(this);
        this.modules.calendar = new ActivityCalendar(this);
        this.modules.analytics = new AnalyticsDashboard(this);
        this.modules.gamification = new GamificationSystem(this);
        this.modules.equipment = new EquipmentManager(this);
        this.modules.lessonPlanner = new LessonPlanner(this);
        this.modules.videoModal = new VideoModalSystem(this);
        this.modules.soundEffects = new SoundEffects(this);
        this.modules.performance = new PerformanceDashboard(this);
    }

    setupEventListeners() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-theme-toggle]')) {
                this.toggleTheme();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k':
                        e.preventDefault();
                        this.modules.search.openSearch();
                        break;
                    case 't':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.modules.lessonPlanner.print();
                        break;
                }
            }
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.state.theme);
        this.modules.soundEffects.play('toggle');
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
    }

    saveState() {
        localStorage.setItem('appState', JSON.stringify(this.state));
    }

    checkAchievements() {
        // Check and award achievements based on user actions
        const achievements = this.modules.gamification.checkAchievements(this.state);
        if (achievements.length > 0) {
            achievements.forEach(achievement => {
                this.showNotification(`Achievement Unlocked: ${achievement.name}`, 'success');
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <svg class="notification-icon" width="20" height="20">
                ${this.getIconSVG(type)}
            </svg>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getIconSVG(type) {
        const icons = {
            success: '<path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" fill="none"/>',
            error: '<path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2"/>',
            info: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2"/>'
        };
        return `<svg viewBox="0 0 24 24">${icons[type] || icons.info}</svg>`;
    }

    updateProgress(activity, completed) {
        if (!this.state.progress[activity]) {
            this.state.progress[activity] = { completed: 0, total: 0 };
        }
        this.state.progress[activity].completed += completed ? 1 : 0;
        this.state.progress[activity].total += 1;
        localStorage.setItem('progress', JSON.stringify(this.state.progress));
        this.modules.analytics.update(this.state.progress);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BirchTreeApp();
});