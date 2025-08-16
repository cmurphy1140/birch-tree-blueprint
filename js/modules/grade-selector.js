// Grade Level Selector with Interactive Filtering
class GradeSelector {
    constructor(app) {
        this.app = app;
        this.currentGrade = 'all';
        this.init();
    }

    init() {
        this.createSelector();
        this.attachEventListeners();
    }

    createSelector() {
        const selectorHTML = `
            <div class="grade-selector-container">
                <h3 class="selector-title">Select Grade Level</h3>
                <div class="grade-buttons">
                    <button class="grade-btn grade-btn--active" data-grade="all">
                        <svg class="grade-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="9" y1="21" x2="9" y2="9"/>
                        </svg>
                        <span>All Grades</span>
                        <span class="grade-count">24 Activities</span>
                    </button>
                    <button class="grade-btn" data-grade="k-2">
                        <svg class="grade-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10"/>
                        </svg>
                        <span>K-2</span>
                        <span class="grade-count">8 Activities</span>
                    </button>
                    <button class="grade-btn" data-grade="3-5">
                        <svg class="grade-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span>3-5</span>
                        <span class="grade-count">8 Activities</span>
                    </button>
                    <button class="grade-btn" data-grade="6-8">
                        <svg class="grade-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        </svg>
                        <span>6-8</span>
                        <span class="grade-count">8 Activities</span>
                    </button>
                </div>
                <div class="grade-info">
                    <div class="info-card" id="grade-info-content">
                        <h4>All Grade Levels</h4>
                        <p>Comprehensive curriculum covering fundamental movement skills, sports, fitness, and wellness for K-8 students.</p>
                        <div class="skill-tags">
                            <span class="skill-tag">Motor Skills</span>
                            <span class="skill-tag">Team Sports</span>
                            <span class="skill-tag">Fitness</span>
                            <span class="skill-tag">Wellness</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const gradeSection = document.querySelector('#grade-levels');
        if (gradeSection) {
            const container = document.createElement('div');
            container.innerHTML = selectorHTML;
            gradeSection.insertBefore(container.firstElementChild, gradeSection.firstChild);
        }
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.grade-btn')) {
                const btn = e.target.closest('.grade-btn');
                this.selectGrade(btn.dataset.grade);
            }
        });
    }

    selectGrade(grade) {
        this.currentGrade = grade;
        
        // Update button states
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.classList.toggle('grade-btn--active', btn.dataset.grade === grade);
        });

        // Update info content
        this.updateGradeInfo(grade);
        
        // Filter curriculum content
        this.filterContent(grade);
        
        // Animate the change
        this.animateSelection();

        // Play sound effect
        if (this.app.modules.soundEffects) {
            this.app.modules.soundEffects.play('select');
        }
    }

    updateGradeInfo(grade) {
        const info = {
            'all': {
                title: 'All Grade Levels',
                description: 'Comprehensive curriculum covering fundamental movement skills, sports, fitness, and wellness for K-8 students.',
                skills: ['Motor Skills', 'Team Sports', 'Fitness', 'Wellness']
            },
            'k-2': {
                title: 'Kindergarten - 2nd Grade',
                description: 'Focus on fundamental movement patterns, body awareness, and cooperative play through engaging activities.',
                skills: ['Locomotor Skills', 'Balance', 'Spatial Awareness', 'Following Directions']
            },
            '3-5': {
                title: '3rd - 5th Grade',
                description: 'Introduction to sport-specific skills, team dynamics, and personal fitness concepts.',
                skills: ['Sport Skills', 'Teamwork', 'Strategy', 'Fitness Concepts']
            },
            '6-8': {
                title: '6th - 8th Grade',
                description: 'Advanced sport techniques, fitness planning, and lifetime wellness habits.',
                skills: ['Advanced Skills', 'Fitness Planning', 'Leadership', 'Wellness']
            }
        };

        const gradeInfo = info[grade];
        const infoCard = document.getElementById('grade-info-content');
        
        if (infoCard && gradeInfo) {
            infoCard.innerHTML = `
                <h4>${gradeInfo.title}</h4>
                <p>${gradeInfo.description}</p>
                <div class="skill-tags">
                    ${gradeInfo.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="grade-stats">
                    <div class="stat">
                        <span class="stat-value">${Math.floor(Math.random() * 50 + 150)}</span>
                        <span class="stat-label">Activities</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${Math.floor(Math.random() * 20 + 30)}h</span>
                        <span class="stat-label">Total Duration</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${Math.floor(Math.random() * 30 + 70)}%</span>
                        <span class="stat-label">Completion Rate</span>
                    </div>
                </div>
            `;
        }
    }

    filterContent(grade) {
        // Filter curriculum cards based on grade
        const cards = document.querySelectorAll('.curriculum-card');
        cards.forEach(card => {
            if (grade === 'all' || card.dataset.grade === grade) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }

    animateSelection() {
        const container = document.querySelector('.grade-selector-container');
        if (container) {
            container.classList.add('pulse');
            setTimeout(() => container.classList.remove('pulse'), 600);
        }
    }
}