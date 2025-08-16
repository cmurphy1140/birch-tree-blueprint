// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeAccordions();
    initializeModal();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeDashboard();
});

// Smooth Scrolling Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinksContainer = document.querySelector('.nav-links');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
}

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Reset accordions in the newly active tab
            const activeTabAccordions = document.querySelectorAll(`#${targetTab} .accordion-item`);
            activeTabAccordions.forEach(item => item.classList.remove('active'));
        });
    });
}

// Accordion Functionality
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const wasActive = accordionItem.classList.contains('active');
            
            // Get all accordions in the same container
            const container = accordionItem.parentElement;
            const allItems = container.querySelectorAll('.accordion-item');
            
            // Close all accordions in the same container
            allItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle the clicked accordion
            if (!wasActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('syllabus-modal');
    const syllabusBtn = document.getElementById('syllabus-btn');
    const modalClose = document.querySelector('.modal-close');
    
    // Open modal
    if (syllabusBtn) {
        syllabusBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow to header on scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '';
        }
        
        // Hide/show header on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const elementsToAnimate = document.querySelectorAll('.pillar-card, .resource-card');
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Utility function to handle active navigation highlighting
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize active navigation highlighting
updateActiveNavigation();

// Add loading animation for images (if any)
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // If image is already cached
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
});

// Form validation for future contact forms
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Print functionality for resources
function initializePrintButtons() {
    const printButtons = document.querySelectorAll('[data-print]');
    
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.print();
        });
    });
}

// Initialize print functionality
initializePrintButtons();

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll event listeners
const optimizedScroll = throttle(function() {
    // Scroll-based functionality here
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Accessibility improvements
function initializeAccessibility() {
    // Add keyboard navigation for accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Update aria-expanded on accordion toggle
    const updateAriaExpanded = () => {
        accordionHeaders.forEach(header => {
            const isExpanded = header.parentElement.classList.contains('active');
            header.setAttribute('aria-expanded', isExpanded);
        });
    };
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', updateAriaExpanded);
    });
    
    // Add keyboard navigation for tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('tabindex', button.classList.contains('active') ? '0' : '-1');
        button.setAttribute('aria-selected', button.classList.contains('active'));
        
        button.addEventListener('keydown', function(e) {
            let newIndex;
            
            if (e.key === 'ArrowRight') {
                newIndex = (index + 1) % tabButtons.length;
            } else if (e.key === 'ArrowLeft') {
                newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            }
            
            if (newIndex !== undefined) {
                tabButtons[newIndex].click();
                tabButtons[newIndex].focus();
            }
        });
    });
}

// Initialize accessibility features
initializeAccessibility();

// Dashboard Functionality
function initializeDashboard() {
    // Animate counters
    animateCounters();
    
    // Timer functionality
    setupTimer();
    
    // Dashboard button handlers
    setupDashboardButtons();
    
    // Quiz functionality
    setupQuiz();
}

// Animate counters on dashboard
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Setup Timer Functionality
function setupTimer() {
    const timerModal = document.getElementById('timer-modal');
    const timerBtn = document.getElementById('timer-btn');
    const timerStart = document.getElementById('timer-start');
    const timerPause = document.getElementById('timer-pause');
    const timerReset = document.getElementById('timer-reset');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const modalClose = timerModal?.querySelector('.modal-close');
    
    let timerInterval = null;
    let totalSeconds = 0;
    let isRunning = false;
    
    // Open timer modal
    if (timerBtn && timerModal) {
        timerBtn.addEventListener('click', () => {
            timerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close timer modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            timerModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Timer controls
    if (timerStart) {
        timerStart.addEventListener('click', () => {
            if (!isRunning) {
                isRunning = true;
                timerInterval = setInterval(() => {
                    if (totalSeconds > 0) {
                        totalSeconds--;
                        updateTimerDisplay();
                    } else {
                        clearInterval(timerInterval);
                        isRunning = false;
                        alert('Timer completed!');
                    }
                }, 1000);
            }
        });
    }
    
    if (timerPause) {
        timerPause.addEventListener('click', () => {
            clearInterval(timerInterval);
            isRunning = false;
        });
    }
    
    if (timerReset) {
        timerReset.addEventListener('click', () => {
            clearInterval(timerInterval);
            isRunning = false;
            totalSeconds = 0;
            updateTimerDisplay();
        });
    }
    
    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            totalSeconds = parseInt(btn.getAttribute('data-time'));
            updateTimerDisplay();
        });
    });
    
    function updateTimerDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (timerMinutes) timerMinutes.textContent = minutes.toString().padStart(2, '0');
        if (timerSeconds) timerSeconds.textContent = seconds.toString().padStart(2, '0');
    }
}

// Setup Dashboard Button Handlers
function setupDashboardButtons() {
    // Random Activity Button
    const randomActivityBtn = document.getElementById('random-activity-btn');
    if (randomActivityBtn) {
        randomActivityBtn.addEventListener('click', () => {
            const activities = [
                'Jumping Jacks - 30 seconds',
                'High Knees - 20 seconds',
                'Mountain Climbers - 30 seconds',
                'Burpees - 10 reps',
                'Plank Hold - 45 seconds',
                'Lunges - 15 each leg',
                'Push-ups - 12 reps',
                'Squat Jumps - 15 reps',
                'Arm Circles - 30 seconds',
                'Wall Sits - 30 seconds'
            ];
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            alert(`Your Random Activity: ${randomActivity}`);
        });
    }
    
    // Progress Button
    const progressBtn = document.getElementById('progress-btn');
    if (progressBtn) {
        progressBtn.addEventListener('click', () => {
            const progressSection = document.querySelector('.progress-overview');
            if (progressSection) {
                progressSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}

// Setup Quiz Functionality
function setupQuiz() {
    const quizModal = document.getElementById('quiz-modal');
    const quizBtn = document.getElementById('quiz-btn');
    const quizOptions = document.querySelectorAll('.quiz-option');
    const modalClose = quizModal?.querySelector('.modal-close');
    
    // Open quiz modal
    if (quizBtn && quizModal) {
        quizBtn.addEventListener('click', () => {
            quizModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close quiz modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            quizModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Quiz option selection
    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove previous selections
            quizOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Check if correct
            if (option.classList.contains('correct')) {
                setTimeout(() => {
                    alert('Correct! Children should get at least 60 minutes of physical activity daily.');
                    quizModal.classList.remove('active');
                    document.body.style.overflow = '';
                }, 500);
            } else {
                option.style.background = '#f8d7da';
                option.style.borderColor = '#dc3545';
                setTimeout(() => {
                    option.style.background = '';
                    option.style.borderColor = '';
                }, 1000);
            }
        });
    });
}

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Add analytics tracking code here
    console.log('Event tracked:', { category, action, label });
}

// Track resource downloads
document.querySelectorAll('.resource-button').forEach(button => {
    button.addEventListener('click', function() {
        const resourceName = this.closest('.resource-card').querySelector('h3').textContent;
        trackEvent('Resources', 'Download', resourceName);
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});

// Handle browser back button for modal
window.addEventListener('popstate', function() {
    const modal = document.getElementById('syllabus-modal');
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});