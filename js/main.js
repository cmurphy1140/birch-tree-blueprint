// Main Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('[INFO] Initializing Birch Tree Blueprint Interactive PE Curriculum');

    // Initialize all modules inline for simplicity
    initializeApp();
});

function initializeApp() {
    // Initialize particle background
    if (typeof ParticleSystem !== 'undefined') {
        new ParticleSystem();
    }

    // Initialize counters animation
    animateCounters();

    // Initialize theme toggle
    initializeTheme();

    // Initialize interactive features
    initializeInteractiveFeatures();

    // Initialize PWA
    initializePWA();

    // Remove loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 1500);

    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to The Birch Tree Blueprint!', 'success');
    }, 2000);
}

function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(counter => {
        const target = parseInt(counter.dataset.count);
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    });
}

function initializeTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-theme-toggle]')) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            playSound('toggle');
        }
    });
}

function initializeInteractiveFeatures() {
    // Timer functionality
    let timerInterval = null;
    let timerSeconds = 0;

    document.addEventListener('click', (e) => {
        // Timer controls
        if (e.target.id === 'timer-btn') {
            document.getElementById('timer-modal')?.classList.add('show');
        }
        
        if (e.target.id === 'timer-start') {
            if (!timerInterval) {
                timerInterval = setInterval(() => {
                    timerSeconds++;
                    updateTimerDisplay(timerSeconds);
                }, 1000);
            }
        }
        
        if (e.target.id === 'timer-pause') {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        if (e.target.id === 'timer-reset') {
            clearInterval(timerInterval);
            timerInterval = null;
            timerSeconds = 0;
            updateTimerDisplay(0);
        }

        if (e.target.classList.contains('preset-btn')) {
            timerSeconds = parseInt(e.target.dataset.time);
            updateTimerDisplay(timerSeconds);
        }

        // Random activity generator
        if (e.target.id === 'random-activity-btn') {
            generateRandomActivity();
        }

        // Quiz button
        if (e.target.id === 'quiz-btn') {
            startQuiz();
        }

        // Search toggle
        if (e.target.closest('[data-search-toggle]')) {
            const searchModal = document.getElementById('search-modal');
            if (searchModal) {
                searchModal.classList.add('show');
                document.getElementById('search-input')?.focus();
            }
        }

        // Modal close buttons
        if (e.target.classList.contains('modal-close')) {
            e.target.closest('.modal')?.classList.remove('show');
            document.getElementById('search-modal')?.classList.remove('show');
        }

        // Start journey button
        if (e.target.id === 'start-journey') {
            showNotification('Your PE journey begins now!', 'success');
            document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
        }

        // Watch demo button
        if (e.target.id === 'watch-demo') {
            showNotification('Demo video coming soon!', 'info');
        }

        // Grade buttons
        if (e.target.closest('.grade-btn')) {
            const btn = e.target.closest('.grade-btn');
            document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('grade-btn--active'));
            btn.classList.add('grade-btn--active');
            filterByGrade(btn.dataset.grade);
        }

        // Equipment tabs
        if (e.target.classList.contains('equipment-tab')) {
            document.querySelectorAll('.equipment-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
            loadEquipmentCategory(e.target.dataset.category);
        }

        // Activity cards
        if (e.target.closest('.card-action-btn')) {
            const activityName = e.target.closest('.card-action-btn').dataset.activity;
            startActivity(activityName);
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Initialize equipment checklist
    loadEquipmentCategory('basic');

    // Initialize calendar
    renderCalendar();

    // Load initial activities
    loadActivities();
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const minDisplay = document.getElementById('timer-minutes');
    const secDisplay = document.getElementById('timer-seconds');
    if (minDisplay) minDisplay.textContent = minutes.toString().padStart(2, '0');
    if (secDisplay) secDisplay.textContent = secs.toString().padStart(2, '0');
}

function generateRandomActivity() {
    const activities = [
        'Jumping Jacks - 30 seconds',
        'High Knees - 20 seconds',
        'Plank Hold - 45 seconds',
        'Mountain Climbers - 30 seconds',
        'Burpees - 10 reps',
        'Lunges - 15 each leg',
        'Push-ups - 12 reps',
        'Squat Jumps - 15 reps'
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    showNotification(`Random Activity: ${randomActivity}`, 'info');
}

function startQuiz() {
    const modal = document.getElementById('quiz-modal');
    const container = document.getElementById('quiz-container');
    
    if (modal && container) {
        modal.classList.add('show');
        container.innerHTML = `
            <div class="quiz-start">
                <h3>PE Knowledge Quiz</h3>
                <p>Test your physical education knowledge!</p>
                <button class="btn btn-primary" onclick="showQuizQuestion(0)">Start Quiz</button>
            </div>
        `;
    }
}

function filterByGrade(grade) {
    showNotification(`Showing activities for: ${grade === 'all' ? 'All Grades' : grade.toUpperCase()}`, 'info');
    // Filter logic would go here
}

function loadEquipmentCategory(category) {
    const equipment = {
        basic: ['Cones (20)', 'Jump Ropes (30)', 'Hula Hoops (15)', 'Bean Bags (40)'],
        sports: ['Basketballs (12)', 'Soccer Balls (10)', 'Volleyballs (8)', 'Footballs (6)'],
        fitness: ['Yoga Mats (25)', 'Resistance Bands (20)', 'Medicine Balls (10)', 'Agility Ladders (5)'],
        safety: ['First Aid Kit (2)', 'Safety Cones (10)', 'Whistles (5)', 'Pinnies/Vests (30)']
    };

    const container = document.getElementById('equipment-list');
    if (container) {
        container.innerHTML = equipment[category].map(item => `
            <div class="equipment-item">
                <input type="checkbox" class="equipment-checkbox" checked>
                <span>${item}</span>
            </div>
        `).join('');
    }
}

function startActivity(activityName) {
    showNotification(`Starting: ${activityName}`, 'success');
    // Open timer modal
    document.getElementById('timer-modal')?.classList.add('show');
}

function performSearch(query) {
    const results = document.getElementById('search-results');
    if (!results || !query) {
        if (results) results.innerHTML = '';
        return;
    }

    // Simulated search results
    const searchData = [
        'Basketball Fundamentals',
        'Soccer Drills',
        'Fitness Circuit Training',
        'Jump Rope Skills',
        'Team Building Games'
    ];

    const filtered = searchData.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
    );

    results.innerHTML = filtered.map(result => `
        <div class="search-result">
            <h4>${result}</h4>
        </div>
    `).join('');
}

function renderCalendar() {
    const container = document.getElementById('calendar-grid');
    if (!container) return;

    const daysInMonth = 30;
    const events = [5, 12, 15, 20, 25]; // Days with events
    
    let html = '';
    
    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        html += `<div class="calendar-header-day">${day}</div>`;
    });

    // Calendar days
    for (let i = 1; i <= daysInMonth; i++) {
        const hasEvent = events.includes(i);
        html += `
            <div class="calendar-day ${hasEvent ? 'has-event' : ''}">
                ${i}
            </div>
        `;
    }

    container.innerHTML = html;
}

function loadActivities() {
    const container = document.getElementById('activities-grid');
    if (!container) return;

    const activities = [
        { title: 'Basketball Practice', grade: '3-5', duration: '30 min', difficulty: 3 },
        { title: 'Animal Movements', grade: 'K-2', duration: '15 min', difficulty: 1 },
        { title: 'Fitness Circuit', grade: '6-8', duration: '45 min', difficulty: 4 },
        { title: 'Dance Session', grade: '3-5', duration: '25 min', difficulty: 2 }
    ];

    container.innerHTML = activities.map(activity => `
        <div class="curriculum-card">
            <div class="card-inner">
                <div class="card-front">
                    <h4>${activity.title}</h4>
                    <p>Grade: ${activity.grade}</p>
                    <p>Duration: ${activity.duration}</p>
                    <p>Difficulty: ${'★'.repeat(activity.difficulty)}${'☆'.repeat(5-activity.difficulty)}</p>
                    <button class="card-action-btn" data-activity="${activity.title}">
                        Start Activity
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            ${getNotificationIcon(type)}
        </svg>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
}

function getNotificationIcon(type) {
    const icons = {
        success: '<path d="M20 6L9 17L4 12" stroke-width="2"/>',
        error: '<path d="M6 6L18 18M6 18L18 6" stroke-width="2"/>',
        info: '<circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M12 16V12M12 8H12.01" stroke-width="2"/>'
    };
    return icons[type] || icons.info;
}

function playSound(type) {
    // Simple sound effect using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = type === 'toggle' ? 500 : 400;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silently fail if audio not supported
    }
}

function initializePWA() {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, app will still work online
        });
    }

    // Add install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Could show install button here
    });
}

// Global quiz function
window.showQuizQuestion = function(questionIndex) {
    const questions = [
        {
            question: "How many minutes of physical activity should children get daily?",
            options: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"],
            correct: 2
        },
        {
            question: "What is the main benefit of stretching?",
            options: ["Speed", "Flexibility", "Strength", "Balance"],
            correct: 1
        }
    ];

    const container = document.getElementById('quiz-container');
    if (!container || questionIndex >= questions.length) {
        if (container) {
            container.innerHTML = `
                <div class="quiz-complete">
                    <h3>Quiz Complete!</h3>
                    <p>Great job!</p>
                    <button class="btn btn-primary" onclick="document.getElementById('quiz-modal').classList.remove('show')">Close</button>
                </div>
            `;
        }
        return;
    }

    const q = questions[questionIndex];
    container.innerHTML = `
        <div class="quiz-question">
            <h4>Question ${questionIndex + 1}</h4>
            <p>${q.question}</p>
            <div class="quiz-options">
                ${q.options.map((option, i) => `
                    <button class="quiz-option" onclick="checkAnswer(${questionIndex}, ${i}, ${q.correct})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
};

window.checkAnswer = function(questionIndex, selected, correct) {
    if (selected === correct) {
        showNotification('Correct! Well done!', 'success');
    } else {
        showNotification('Not quite right. Try again!', 'error');
    }
    setTimeout(() => showQuizQuestion(questionIndex + 1), 1000);
};