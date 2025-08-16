// Combined Interactive Modules for PE Curriculum Website

// Search System
class SearchSystem {
    constructor(app) {
        this.app = app;
        this.searchData = this.generateSearchData();
        this.init();
    }

    generateSearchData() {
        return [
            { title: 'Basketball Fundamentals', type: 'activity', grade: '3-5', tags: ['sports', 'teamwork'] },
            { title: 'Animal Movements', type: 'activity', grade: 'k-2', tags: ['locomotor', 'fun'] },
            { title: 'Fitness Circuit Training', type: 'activity', grade: '6-8', tags: ['fitness', 'strength'] },
            { title: 'Jump Rope Skills', type: 'resource', grade: '3-5', tags: ['cardio', 'coordination'] },
            { title: 'Safety Guidelines', type: 'resource', grade: 'all', tags: ['safety', 'rules'] },
            { title: 'Equipment Setup Guide', type: 'resource', grade: 'all', tags: ['equipment', 'setup'] }
        ];
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-search-toggle]')) {
                this.openSearch();
            }
        });

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
        }
    }

    openSearch() {
        const modal = document.getElementById('search-modal');
        if (modal) {
            modal.classList.add('show');
            document.getElementById('search-input')?.focus();
        }
    }

    performSearch(query) {
        const results = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.includes(query.toLowerCase()))
        );
        this.displayResults(results);
    }

    displayResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;

        container.innerHTML = results.map(result => `
            <div class="search-result" data-type="${result.type}">
                <div class="result-icon">
                    ${result.type === 'activity' ? '⚡' : '📚'}
                </div>
                <div class="result-content">
                    <h4>${result.title}</h4>
                    <span class="result-grade">${result.grade}</span>
                </div>
            </div>
        `).join('');
    }
}

// Progress Tracker with Simulated Data
class ProgressTracker {
    constructor(app) {
        this.app = app;
        this.progressData = this.generateProgressData();
        this.init();
    }

    generateProgressData() {
        const activities = ['Basketball', 'Soccer', 'Running', 'Gymnastics', 'Dance'];
        return activities.map(activity => ({
            name: activity,
            completed: Math.floor(Math.random() * 20 + 5),
            total: 25,
            percentage: Math.floor(Math.random() * 100)
        }));
    }

    init() {
        this.renderProgressCharts();
        this.animateCounters();
    }

    renderProgressCharts() {
        // Simulated chart rendering
        const chartCanvas = document.getElementById('progress-chart');
        if (chartCanvas && typeof Chart !== 'undefined') {
            new Chart(chartCanvas, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    datasets: [{
                        label: 'Activity Minutes',
                        data: [30, 45, 40, 50, 35],
                        borderColor: '#28a745',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    animateCounters() {
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.dataset.count);
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 30);
        });
    }
}

// Workout Timer
class WorkoutTimer {
    constructor(app) {
        this.app = app;
        this.time = 0;
        this.interval = null;
        this.isRunning = false;
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'timer-btn') this.openTimer();
            if (e.target.id === 'timer-start') this.start();
            if (e.target.id === 'timer-pause') this.pause();
            if (e.target.id === 'timer-reset') this.reset();
            if (e.target.classList.contains('preset-btn')) {
                this.setTime(parseInt(e.target.dataset.time));
            }
        });
    }

    openTimer() {
        const modal = document.getElementById('timer-modal');
        if (modal) modal.classList.add('show');
    }

    startTimer(duration, activityName) {
        this.time = duration;
        this.openTimer();
        this.start();
        if (activityName) {
            this.app.showNotification(`Timer started for: ${activityName}`, 'info');
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.interval = setInterval(() => {
                if (this.time > 0) {
                    this.time--;
                    this.updateDisplay();
                } else {
                    this.complete();
                }
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
    }

    reset() {
        this.pause();
        this.time = 0;
        this.updateDisplay();
    }

    setTime(seconds) {
        this.time = seconds;
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
    }

    complete() {
        this.pause();
        this.app.showNotification('Workout Complete! Great job!', 'success');
        // Play completion sound
        if (this.app.modules.soundEffects) {
            this.app.modules.soundEffects.play('complete');
        }
    }
}

// Quiz System with Sample Questions
class QuizSystem {
    constructor(app) {
        this.app = app;
        this.questions = this.generateQuestions();
        this.currentQuestion = 0;
        this.score = 0;
        this.init();
    }

    generateQuestions() {
        return [
            {
                question: "What is the recommended daily physical activity for children?",
                options: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"],
                correct: 2
            },
            {
                question: "Which skill is developed through balance beam activities?",
                options: ["Speed", "Stability", "Strength", "Stamina"],
                correct: 1
            },
            {
                question: "What does PE stand for?",
                options: ["Personal Exercise", "Physical Education", "Performance Enhancement", "Practice Everyday"],
                correct: 1
            },
            {
                question: "Which is a locomotor skill?",
                options: ["Throwing", "Catching", "Skipping", "Balancing"],
                correct: 2
            },
            {
                question: "How many players are on a basketball team on the court?",
                options: ["4", "5", "6", "7"],
                correct: 1
            }
        ];
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'quiz-btn') this.startQuiz();
            if (e.target.classList.contains('quiz-option')) {
                this.selectAnswer(parseInt(e.target.dataset.option));
            }
        });
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        const modal = document.getElementById('quiz-modal');
        if (modal) {
            modal.classList.add('show');
            this.showQuestion();
        }
    }

    showQuestion() {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        const q = this.questions[this.currentQuestion];
        container.innerHTML = `
            <div class="quiz-progress">
                Question ${this.currentQuestion + 1} of ${this.questions.length}
            </div>
            <h3 class="quiz-question">${q.question}</h3>
            <div class="quiz-options">
                ${q.options.map((option, index) => `
                    <button class="quiz-option" data-option="${index}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }

    selectAnswer(option) {
        const correct = this.questions[this.currentQuestion].correct;
        if (option === correct) {
            this.score++;
            this.app.showNotification('Correct!', 'success');
        } else {
            this.app.showNotification('Try again next time!', 'error');
        }

        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
            setTimeout(() => this.showQuestion(), 1000);
        } else {
            this.showResults();
        }
    }

    showResults() {
        const container = document.getElementById('quiz-container');
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        container.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <div class="score-display">
                    <span class="score-value">${this.score}/${this.questions.length}</span>
                    <span class="score-percentage">${percentage}%</span>
                </div>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
            </div>
        `;

        // Award achievement if score is high
        if (percentage >= 80) {
            this.app.modules.gamification?.awardAchievement('quiz_master');
        }
    }
}

// Activity Calendar
class ActivityCalendar {
    constructor(app) {
        this.app = app;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.events = this.generateEvents();
        this.init();
    }

    generateEvents() {
        return {
            '2024-11-05': { title: 'Basketball Practice', type: 'sports' },
            '2024-11-12': { title: 'Fitness Assessment', type: 'assessment' },
            '2024-11-15': { title: 'Dance Workshop', type: 'special' },
            '2024-11-20': { title: 'Soccer Tournament', type: 'competition' },
            '2024-11-25': { title: 'Yoga Session', type: 'wellness' }
        };
    }

    init() {
        this.renderCalendar();
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.getElementById('prev-month')?.addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.renderCalendar();
        });

        document.getElementById('next-month')?.addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.renderCalendar();
        });
    }

    renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const title = document.getElementById('calendar-month');
        if (title) {
            title.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        }

        const grid = document.getElementById('calendar-grid');
        if (!grid) return;

        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        let html = '';
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            html += `<div class="calendar-header-day">${day}</div>`;
        });

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hasEvent = this.events[dateStr];
            
            html += `
                <div class="calendar-day ${hasEvent ? 'has-event' : ''}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    ${hasEvent ? `<span class="event-indicator" title="${hasEvent.title}"></span>` : ''}
                </div>
            `;
        }

        grid.innerHTML = html;
    }
}

// Analytics Dashboard with Generated Data
class AnalyticsDashboard {
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        this.renderCharts();
    }

    renderCharts() {
        // Activity Distribution Chart
        this.renderActivityChart();
        // Skill Progression Chart
        this.renderSkillChart();
        // Engagement Chart
        this.renderEngagementChart();
        // Trends Chart
        this.renderTrendsChart();
    }

    renderActivityChart() {
        const canvas = document.getElementById('activity-chart');
        if (canvas && typeof Chart !== 'undefined') {
            new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Sports', 'Fitness', 'Dance', 'Gymnastics', 'Games'],
                    datasets: [{
                        data: [30, 25, 15, 20, 10],
                        backgroundColor: [
                            '#3b82f6',
                            '#10b981',
                            '#8b5cf6',
                            '#f97316',
                            '#ec4899'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    renderSkillChart() {
        const canvas = document.getElementById('skill-chart');
        if (canvas && typeof Chart !== 'undefined') {
            new Chart(canvas, {
                type: 'radar',
                data: {
                    labels: ['Strength', 'Flexibility', 'Endurance', 'Coordination', 'Balance'],
                    datasets: [{
                        label: 'Current Level',
                        data: [75, 60, 80, 70, 65],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    renderEngagementChart() {
        const canvas = document.getElementById('engagement-chart');
        if (canvas && typeof Chart !== 'undefined') {
            new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['K-2', '3-5', '6-8'],
                    datasets: [{
                        label: 'Participation Rate',
                        data: [85, 92, 78],
                        backgroundColor: '#10b981'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    renderTrendsChart() {
        const canvas = document.getElementById('trends-chart');
        if (canvas && typeof Chart !== 'undefined') {
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Active Students',
                        data: [150, 180, 175, 200, 220, 250],
                        borderColor: '#8b5cf6',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    update(progressData) {
        // Update analytics based on progress data
        console.log('[INFO] Analytics updated with new progress data');
    }
}

// Gamification System
class GamificationSystem {
    constructor(app) {
        this.app = app;
        this.achievements = this.generateAchievements();
        this.userAchievements = [];
        this.init();
    }

    generateAchievements() {
        return [
            { id: 'first_activity', name: 'First Steps', description: 'Complete your first activity', icon: '🏃', points: 10 },
            { id: 'week_streak', name: 'Week Warrior', description: '7-day activity streak', icon: '🔥', points: 50 },
            { id: 'quiz_master', name: 'Quiz Master', description: 'Score 80% or higher on a quiz', icon: '🎓', points: 30 },
            { id: 'team_player', name: 'Team Player', description: 'Participate in 5 team activities', icon: '🤝', points: 40 },
            { id: 'fitness_guru', name: 'Fitness Guru', description: 'Complete all fitness challenges', icon: '💪', points: 100 }
        ];
    }

    init() {
        this.renderAchievements();
        // Randomly award some achievements for demo
        setTimeout(() => {
            this.awardAchievement('first_activity');
        }, 3000);
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        const recentAchievements = this.achievements.slice(0, 3);
        container.innerHTML = recentAchievements.map(achievement => `
            <div class="achievement-badge">
                <div class="badge-icon">${achievement.icon}</div>
                <div class="badge-content">
                    <h5>${achievement.name}</h5>
                    <p>${achievement.points} points</p>
                </div>
            </div>
        `).join('');
    }

    awardAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !this.userAchievements.includes(achievementId)) {
            this.userAchievements.push(achievementId);
            this.app.showNotification(`Achievement Unlocked: ${achievement.name}!`, 'success');
            
            // Update UI
            this.renderAchievements();
            
            // Save to localStorage
            localStorage.setItem('achievements', JSON.stringify(this.userAchievements));
        }
    }

    checkAchievements(state) {
        const newAchievements = [];
        // Check various conditions based on state
        // Return newly earned achievements
        return newAchievements;
    }
}

// Equipment Manager
class EquipmentManager {
    constructor(app) {
        this.app = app;
        this.equipment = this.generateEquipment();
        this.init();
    }

    generateEquipment() {
        return {
            basic: [
                { name: 'Cones', quantity: 20, available: true },
                { name: 'Jump Ropes', quantity: 30, available: true },
                { name: 'Hula Hoops', quantity: 15, available: true },
                { name: 'Bean Bags', quantity: 40, available: false }
            ],
            sports: [
                { name: 'Basketballs', quantity: 12, available: true },
                { name: 'Soccer Balls', quantity: 10, available: true },
                { name: 'Volleyballs', quantity: 8, available: false },
                { name: 'Footballs', quantity: 6, available: true }
            ],
            fitness: [
                { name: 'Yoga Mats', quantity: 25, available: true },
                { name: 'Resistance Bands', quantity: 20, available: true },
                { name: 'Medicine Balls', quantity: 10, available: false },
                { name: 'Agility Ladders', quantity: 5, available: true }
            ],
            safety: [
                { name: 'First Aid Kit', quantity: 2, available: true },
                { name: 'Safety Cones', quantity: 10, available: true },
                { name: 'Whistles', quantity: 5, available: true },
                { name: 'Pinnies/Vests', quantity: 30, available: false }
            ]
        };
    }

    init() {
        this.renderEquipment('basic');
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('equipment-tab')) {
                const category = e.target.dataset.category;
                this.renderEquipment(category);
                
                // Update active tab
                document.querySelectorAll('.equipment-tab').forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.category === category);
                });
            }
        });
    }

    renderEquipment(category) {
        const container = document.getElementById('equipment-list');
        if (!container) return;

        const items = this.equipment[category] || [];
        container.innerHTML = items.map(item => `
            <div class="equipment-item">
                <input type="checkbox" class="equipment-checkbox" ${item.available ? 'checked' : ''}>
                <span class="equipment-name">${item.name}</span>
                <span class="equipment-quantity">(${item.quantity})</span>
            </div>
        `).join('');
    }
}

// Lesson Planner
class LessonPlanner {
    constructor(app) {
        this.app = app;
        this.currentLesson = null;
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'planner-btn') {
                this.openPlanner();
            }
        });
    }

    openPlanner() {
        this.generateLesson();
        this.app.showNotification('Lesson plan generated!', 'success');
    }

    generateLesson() {
        const activities = [
            'Warm-up: Dynamic stretching (5 min)',
            'Main Activity: Basketball drills (20 min)',
            'Team Game: 3v3 Basketball (15 min)',
            'Cool-down: Static stretching (5 min)'
        ];

        const lesson = {
            date: new Date().toLocaleDateString(),
            grade: '3-5',
            duration: '45 minutes',
            objectives: [
                'Develop basketball dribbling skills',
                'Improve hand-eye coordination',
                'Foster teamwork and communication'
            ],
            activities: activities,
            equipment: ['Basketballs', 'Cones', 'Pinnies'],
            assessment: 'Observation of skill progression and peer feedback'
        };

        this.currentLesson = lesson;
        return lesson;
    }

    print() {
        if (this.currentLesson) {
            window.print();
        } else {
            this.generateLesson();
            window.print();
        }
    }
}

// Video Modal System
class VideoModalSystem {
    constructor(app) {
        this.app = app;
        this.videos = {
            'basketball': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'soccer': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'fitness': 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        };
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'watch-demo') {
                this.openVideo('basketball');
            }
            if (e.target.classList.contains('modal-close')) {
                this.closeModals();
            }
        });
    }

    openVideo(videoId) {
        const modal = document.getElementById('video-modal');
        const frame = document.getElementById('video-frame');
        
        if (modal && frame) {
            frame.src = this.videos[videoId] || this.videos['basketball'];
            modal.classList.add('show');
        }
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        
        // Clear video source
        const frame = document.getElementById('video-frame');
        if (frame) frame.src = '';
    }
}

// Sound Effects
class SoundEffects {
    constructor(app) {
        this.app = app;
        this.sounds = {
            'click': { frequency: 400, duration: 50 },
            'success': { frequency: 800, duration: 200 },
            'error': { frequency: 200, duration: 300 },
            'complete': { frequency: 600, duration: 400 },
            'toggle': { frequency: 500, duration: 100 },
            'select': { frequency: 350, duration: 75 }
        };
        this.enabled = true;
        this.init();
    }

    init() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;

        const sound = this.sounds[soundName];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = sound.frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration / 1000);
    }

    toggle() {
        this.enabled = !this.enabled;
    }
}

// Performance Dashboard
class PerformanceDashboard {
    constructor(app) {
        this.app = app;
        this.metrics = {
            loadTime: 0,
            interactions: 0,
            errors: 0
        };
        this.init();
    }

    init() {
        this.measurePerformance();
        this.trackInteractions();
    }

    measurePerformance() {
        // Measure page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
            console.log(`[INFO] Page loaded in ${loadTime}ms`);
        });
    }

    trackInteractions() {
        document.addEventListener('click', () => {
            this.metrics.interactions++;
        });

        window.addEventListener('error', () => {
            this.metrics.errors++;
        });
    }

    getMetrics() {
        return this.metrics;
    }
}