// 3D Animated Curriculum Cards
class CurriculumCards {
    constructor(app) {
        this.app = app;
        this.activities = this.generateActivities();
        this.init();
    }

    generateActivities() {
        const activities = [
            // K-2 Activities
            { grade: 'k-2', title: 'Animal Movements', category: 'Locomotor Skills', difficulty: 1, duration: 15, equipment: ['Cones', 'Music'], 
              description: 'Students explore different animal movements to develop body awareness and coordination.' },
            { grade: 'k-2', title: 'Rainbow Run', category: 'Cardiovascular', difficulty: 1, duration: 20, equipment: ['Colored markers', 'Open space'],
              description: 'A colorful running activity that teaches colors while building endurance.' },
            { grade: 'k-2', title: 'Balance Beam Adventures', category: 'Balance', difficulty: 2, duration: 25, equipment: ['Balance beams', 'Mats'],
              description: 'Navigate through balance challenges to improve stability and confidence.' },
            
            // 3-5 Activities  
            { grade: '3-5', title: 'Basketball Fundamentals', category: 'Sport Skills', difficulty: 2, duration: 30, equipment: ['Basketballs', 'Hoops'],
              description: 'Learn dribbling, passing, and shooting techniques in fun drill stations.' },
            { grade: '3-5', title: 'Capture the Flag', category: 'Team Strategy', difficulty: 3, duration: 35, equipment: ['Flags', 'Cones'],
              description: 'Classic team game developing strategy, speed, and cooperation.' },
            { grade: '3-5', title: 'Jump Rope Challenge', category: 'Fitness', difficulty: 2, duration: 20, equipment: ['Jump ropes'],
              description: 'Progressive jump rope skills from basic to advanced tricks.' },
            
            // 6-8 Activities
            { grade: '6-8', title: 'Ultimate Frisbee', category: 'Team Sports', difficulty: 3, duration: 45, equipment: ['Frisbees', 'Cones'],
              description: 'Fast-paced team sport combining running, throwing, and strategic play.' },
            { grade: '6-8', title: 'Fitness Circuit Training', category: 'Strength & Conditioning', difficulty: 4, duration: 40, equipment: ['Various'],
              description: 'Rotating stations targeting different muscle groups and fitness components.' },
            { grade: '6-8', title: 'Volleyball Skills', category: 'Sport Skills', difficulty: 3, duration: 35, equipment: ['Volleyballs', 'Net'],
              description: 'Master serving, setting, and spiking through progressive drills.' }
        ];

        // Add random stats to each activity
        return activities.map(activity => ({
            ...activity,
            popularity: Math.floor(Math.random() * 100),
            completions: Math.floor(Math.random() * 500 + 100),
            rating: (Math.random() * 2 + 3).toFixed(1),
            trending: Math.random() > 0.7
        }));
    }

    init() {
        this.renderCards();
        this.attachEventListeners();
    }

    renderCards() {
        const container = document.querySelector('#grade-levels') || document.querySelector('.curriculum-section');
        if (!container) return;

        const cardsHTML = `
            <div class="curriculum-cards-container">
                <div class="cards-header">
                    <h3>Featured Activities</h3>
                    <div class="view-toggles">
                        <button class="view-btn view-btn--active" data-view="grid">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="7" height="7"/>
                                <rect x="14" y="3" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/>
                            </svg>
                        </button>
                        <button class="view-btn" data-view="list">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="8" y1="6" x2="21" y2="6"/>
                                <line x1="8" y1="12" x2="21" y2="12"/>
                                <line x1="8" y1="18" x2="21" y2="18"/>
                                <line x1="3" y1="6" x2="3.01" y2="6"/>
                                <line x1="3" y1="12" x2="3.01" y2="12"/>
                                <line x1="3" y1="18" x2="3.01" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="curriculum-cards" id="curriculum-cards">
                    ${this.activities.map(activity => this.createCard(activity)).join('')}
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = cardsHTML;
        container.appendChild(div);
    }

    createCard(activity) {
        const difficultyStars = '★'.repeat(activity.difficulty) + '☆'.repeat(5 - activity.difficulty);
        const trendingBadge = activity.trending ? '<span class="trending-badge">Trending</span>' : '';
        
        return `
            <div class="curriculum-card" data-grade="${activity.grade}" data-category="${activity.category}">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-header">
                            <span class="card-category">${activity.category}</span>
                            ${trendingBadge}
                        </div>
                        <h4 class="card-title">${activity.title}</h4>
                        <p class="card-description">${activity.description}</p>
                        <div class="card-stats">
                            <div class="stat-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <span>${activity.duration} min</span>
                            </div>
                            <div class="stat-item">
                                <span class="difficulty">${difficultyStars}</span>
                            </div>
                            <div class="stat-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                <span>${activity.completions}</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="rating">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                                <span>${activity.rating}</span>
                            </div>
                            <button class="card-action-btn" data-activity="${activity.title}">
                                Start Activity
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-back">
                        <h4>Equipment Needed</h4>
                        <ul class="equipment-list">
                            ${activity.equipment.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <div class="popularity-meter">
                            <span>Popularity</span>
                            <div class="meter">
                                <div class="meter-fill" style="width: ${activity.popularity}%"></div>
                            </div>
                            <span>${activity.popularity}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Card hover 3D effect
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.curriculum-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                if (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                } else {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                }
            });
        });

        // Card click actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.card-action-btn')) {
                const activity = e.target.closest('.card-action-btn').dataset.activity;
                this.startActivity(activity);
            }
            
            if (e.target.closest('.view-btn')) {
                const view = e.target.closest('.view-btn').dataset.view;
                this.changeView(view);
            }
        });
    }

    startActivity(activityName) {
        const activity = this.activities.find(a => a.title === activityName);
        if (activity && this.app.modules.timer) {
            this.app.modules.timer.startTimer(activity.duration * 60, activity.title);
        }
        this.app.showNotification(`Started: ${activityName}`, 'success');
    }

    changeView(view) {
        const container = document.getElementById('curriculum-cards');
        const buttons = document.querySelectorAll('.view-btn');
        
        buttons.forEach(btn => {
            btn.classList.toggle('view-btn--active', btn.dataset.view === view);
        });
        
        if (container) {
            container.className = `curriculum-cards curriculum-cards--${view}`;
        }
    }
}