// Enhanced JavaScript for Birch Tree Blueprint

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScheduleViewer();
    initializeLessonGenerator();
    initializeModals();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeResourceButtons();
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
                if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    });
}

// Schedule Viewer
function initializeScheduleViewer() {
    const scheduleBtns = document.querySelectorAll('.schedule-btn');
    const daySchedules = document.querySelectorAll('.day-schedule');
    
    scheduleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetDay = this.getAttribute('data-day');
            
            // Remove active class from all buttons and schedules
            scheduleBtns.forEach(b => b.classList.remove('active'));
            daySchedules.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked button and corresponding schedule
            this.classList.add('active');
            const targetSchedule = document.getElementById(`${targetDay}-schedule`);
            if (targetSchedule) {
                targetSchedule.classList.add('active');
            }
        });
    });
}

// Lesson Plan Generator
function initializeLessonGenerator() {
    const generateBtn = document.getElementById('generate-lesson');
    const lessonOutput = document.getElementById('lesson-output');
    
    // Lesson plan templates
    const lessonTemplates = {
        k2: {
            locomotor: {
                woods: generateK2LocomotorWoods,
                outside: generateK2LocomotorOutside,
                classroom: generateK2LocomotorClassroom
            },
            manipulative: {
                woods: generateK2ManipulativeWoods,
                outside: generateK2ManipulativeOutside,
                classroom: generateK2ManipulativeClassroom
            },
            fitness: {
                woods: generateK2FitnessWoods,
                outside: generateK2FitnessOutside,
                classroom: generateK2FitnessClassroom
            },
            games: {
                woods: generateK2GamesWoods,
                outside: generateK2GamesOutside,
                classroom: generateK2GamesClassroom
            },
            dance: {
                woods: generateK2DanceWoods,
                outside: generateK2DanceOutside,
                classroom: generateK2DanceClassroom
            }
        },
        35: {
            locomotor: {
                woods: generate35LocomotorWoods,
                outside: generate35LocomotorOutside,
                classroom: generate35LocomotorClassroom
            },
            manipulative: {
                woods: generate35ManipulativeWoods,
                outside: generate35ManipulativeOutside,
                classroom: generate35ManipulativeClassroom
            },
            fitness: {
                woods: generate35FitnessWoods,
                outside: generate35FitnessOutside,
                classroom: generate35FitnessClassroom
            },
            games: {
                woods: generate35GamesWoods,
                outside: generate35GamesOutside,
                classroom: generate35GamesClassroom
            },
            dance: {
                woods: generate35DanceWoods,
                outside: generate35DanceOutside,
                classroom: generate35DanceClassroom
            }
        },
        68: {
            locomotor: {
                woods: generate68LocomotorWoods,
                outside: generate68LocomotorOutside,
                classroom: generate68LocomotorClassroom
            },
            manipulative: {
                woods: generate68ManipulativeWoods,
                outside: generate68ManipulativeOutside,
                classroom: generate68ManipulativeClassroom
            },
            fitness: {
                woods: generate68FitnessWoods,
                outside: generate68FitnessOutside,
                classroom: generate68FitnessClassroom
            },
            games: {
                woods: generate68GamesWoods,
                outside: generate68GamesOutside,
                classroom: generate68GamesClassroom
            },
            dance: {
                woods: generate68DanceWoods,
                outside: generate68DanceOutside,
                classroom: generate68DanceClassroom
            }
        }
    };
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const grade = document.getElementById('grade-select').value;
            const location = document.getElementById('location-select').value;
            const unit = document.getElementById('unit-select').value;
            
            if (!grade || !location || !unit) {
                lessonOutput.innerHTML = `
                    <div class="alert">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        Please select all options to generate a lesson plan
                    </div>
                `;
                return;
            }
            
            // Generate lesson plan
            const generator = lessonTemplates[grade]?.[unit]?.[location];
            if (generator) {
                lessonOutput.innerHTML = generator();
            } else {
                lessonOutput.innerHTML = generateDefaultLesson(grade, location, unit);
            }
        });
    }
}

// Sample Lesson Plan Generators
function generateK2LocomotorWoods() {
    return `
        <div class="generated-lesson">
            <h3>K-2 Locomotor Skills - The Woods (Café)</h3>
            <div class="lesson-section">
                <h4>Objective:</h4>
                <p>Students will demonstrate various locomotor movements with proper form in a confined space.</p>
            </div>
            <div class="lesson-section">
                <h4>NH Standards Alignment:</h4>
                <ul>
                    <li>Standard 1.2.1: Demonstrates locomotor skills with space awareness</li>
                    <li>Standard 2.2.3: Identifies movement concepts</li>
                </ul>
            </div>
            <div class="lesson-section">
                <h4>Equipment:</h4>
                <ul>
                    <li>Yoga mats or carpet squares</li>
                    <li>Masking tape for pathways</li>
                    <li>Music player</li>
                    <li>Picture cards of animals</li>
                </ul>
            </div>
            <div class="lesson-section">
                <h4>Warm-Up (5 min):</h4>
                <p>Animal stretches in personal space - students mirror teacher movements</p>
            </div>
            <div class="lesson-section">
                <h4>Main Activity (35 min):</h4>
                <ol>
                    <li><strong>Movement Exploration (10 min):</strong> Students practice walking, marching, galloping in designated pathways</li>
                    <li><strong>Animal Walks Station (15 min):</strong> Bear crawl, crab walk, frog jumps on mats</li>
                    <li><strong>Follow the Leader (10 min):</strong> Small groups practice different locomotor patterns</li>
                </ol>
            </div>
            <div class="lesson-section">
                <h4>Cool-Down (5 min):</h4>
                <p>Slow motion movements with calming music, ending in seated breathing exercises</p>
            </div>
            <div class="lesson-section">
                <h4>Assessment:</h4>
                <p>Observation checklist for proper form and spatial awareness</p>
            </div>
            <div class="lesson-section">
                <h4>Modifications:</h4>
                <ul>
                    <li>Limited mobility: Upper body movements while seated</li>
                    <li>Advanced: Add directional changes and speed variations</li>
                </ul>
            </div>
        </div>
    `;
}

function generate35FitnessOutside() {
    return `
        <div class="generated-lesson">
            <h3>Grades 3-5 Fitness & Wellness - Outside (Hardtop)</h3>
            <div class="lesson-section">
                <h4>Objective:</h4>
                <p>Students will identify components of health-related fitness through circuit training stations.</p>
            </div>
            <div class="lesson-section">
                <h4>NH Standards Alignment:</h4>
                <ul>
                    <li>Standard 2.5.7: Defines health-related fitness components</li>
                    <li>Standard 4.5.3: Describes how movement affects health</li>
                </ul>
            </div>
            <div class="lesson-section">
                <h4>Equipment:</h4>
                <ul>
                    <li>Cones for station markers</li>
                    <li>Jump ropes</li>
                    <li>Chalk for agility ladders</li>
                    <li>Stopwatch/timer</li>
                    <li>Station cards with instructions</li>
                </ul>
            </div>
            <div class="lesson-section">
                <h4>Warm-Up (7 min):</h4>
                <p>Dynamic stretching circle: arm circles, leg swings, jumping jacks, high knees</p>
            </div>
            <div class="lesson-section">
                <h4>Main Activity (35 min):</h4>
                <ol>
                    <li><strong>Circuit Introduction (5 min):</strong> Explain 5 fitness components and demonstrate each station</li>
                    <li><strong>Station Rotation (25 min):</strong>
                        <ul>
                            <li>Station 1: Cardiovascular - Jump rope challenges</li>
                            <li>Station 2: Muscular Strength - Push-up variations</li>
                            <li>Station 3: Muscular Endurance - Wall sits</li>
                            <li>Station 4: Flexibility - Yoga poses</li>
                            <li>Station 5: Agility - Ladder drills</li>
                        </ul>
                    </li>
                    <li><strong>Group Challenge (5 min):</strong> Class-wide plank hold competition</li>
                </ol>
            </div>
            <div class="lesson-section">
                <h4>Cool-Down (8 min):</h4>
                <p>Walking lap, static stretching, heart rate monitoring practice</p>
            </div>
            <div class="lesson-section">
                <h4>Assessment:</h4>
                <p>Exit ticket: Students identify one fitness component and explain its importance</p>
            </div>
        </div>
    `;
}

function generate68GamesClassroom() {
    return `
        <div class="generated-lesson">
            <h3>Grades 6-8 Games & Sports - Classroom</h3>
            <div class="lesson-section">
                <h4>Objective:</h4>
                <p>Students will analyze game strategies and develop tactical awareness through modified activities.</p>
            </div>
            <div class="lesson-section">
                <h4>NH Standards Alignment:</h4>
                <ul>
                    <li>Standard 2.8.2: Demonstrates offensive tactics</li>
                    <li>Standard 3.8.3: Uses communication for strategies</li>
                </ul>
            </div>
            <div class="lesson-section">
                <h4>Equipment:</h4>
                <ul>
                    <li>Soft foam balls</li>
                    <li>Desk arrangement for boundaries</li>
                    <li>Whiteboard for strategy diagrams</li>
                    <li>Team pinnies or colored bands</li>
                </ul>
            </div>
            <div class="lesson-section">
                <h4>Warm-Up (5 min):</h4>
                <p>Mental preparation: Review game concepts, visualization of plays</p>
            </div>
            <div class="lesson-section">
                <h4>Main Activity (35 min):</h4>
                <ol>
                    <li><strong>Strategy Discussion (10 min):</strong> Analyze offensive/defensive positioning using whiteboard</li>
                    <li><strong>Modified Handball (20 min):</strong> 3v3 games with emphasis on creating space and communication</li>
                    <li><strong>Team Huddle (5 min):</strong> Groups develop and share successful strategies</li>
                </ol>
            </div>
            <div class="lesson-section">
                <h4>Cool-Down (10 min):</h4>
                <p>Reflection discussion on strategy effectiveness, goal setting for next class</p>
            </div>
            <div class="lesson-section">
                <h4>Assessment:</h4>
                <p>Peer evaluation of teamwork and strategy implementation</p>
            </div>
        </div>
    `;
}

// Default lesson generator
function generateDefaultLesson(grade, location, unit) {
    const gradeLabel = grade === 'k2' ? 'K-2' : grade === '35' ? '3-5' : '6-8';
    const locationLabel = location === 'woods' ? 'The Woods (Café)' : 
                         location === 'outside' ? 'Outside (Hardtop)' : 'Classroom';
    const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1);
    
    return `
        <div class="generated-lesson">
            <h3>${gradeLabel} ${unitLabel} - ${locationLabel}</h3>
            <div class="lesson-section">
                <h4>Objective:</h4>
                <p>Students will develop ${unit} skills appropriate for their grade level in the ${location} setting.</p>
            </div>
            <div class="lesson-section">
                <h4>Warm-Up (5-7 min):</h4>
                <p>Grade-appropriate warm-up activities focusing on preparing for ${unit} activities.</p>
            </div>
            <div class="lesson-section">
                <h4>Main Activity (35-40 min):</h4>
                <p>Skill development and practice activities tailored to the ${location} environment.</p>
            </div>
            <div class="lesson-section">
                <h4>Cool-Down (5-7 min):</h4>
                <p>Recovery activities and reflection on learning objectives.</p>
            </div>
            <div class="lesson-section">
                <h4>Assessment:</h4>
                <p>Observation and feedback based on grade-level expectations.</p>
            </div>
        </div>
    `;
}

// More generator functions for different combinations
function generateK2ManipulativeOutside() {
    return `
        <div class="generated-lesson">
            <h3>K-2 Manipulative Skills - Outside (Hardtop)</h3>
            <div class="lesson-section">
                <h4>Objective:</h4>
                <p>Students will demonstrate basic throwing, catching, and kicking skills with age-appropriate equipment.</p>
            </div>
            <div class="lesson-section">
                <h4>Equipment:</h4>
                <ul>
                    <li>Bean bags</li>
                    <li>Foam balls of various sizes</li>
                    <li>Hula hoops as targets</li>
                    <li>Chalk for marking throwing lines</li>
                </ul>
            </div>
            <div class="lesson-section">
                <h4>Activities:</h4>
                <ol>
                    <li>Bean bag toss to targets at varying distances</li>
                    <li>Partner rolling and trapping practice</li>
                    <li>Underhand throwing to wall targets</li>
                    <li>Kicking stationary balls to goals</li>
                </ol>
            </div>
        </div>
    `;
}

// Initialize Modals
function initializeModals() {
    // Enhanced Syllabus Modal
    const syllabusBtn = document.getElementById('enhanced-syllabus-btn');
    const syllabusModal = document.getElementById('enhanced-syllabus-modal');
    
    if (syllabusBtn && syllabusModal) {
        syllabusBtn.addEventListener('click', function() {
            syllabusModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            loadEnhancedSyllabus();
        });
    }
    
    // Close modal functionality
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close on outside click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

// Load Enhanced Syllabus Content
function loadEnhancedSyllabus() {
    const syllabusContent = document.querySelector('.syllabus-content.enhanced');
    if (syllabusContent) {
        syllabusContent.innerHTML = `
            <div class="syllabus-grid">
                <div class="syllabus-section">
                    <h3>Course Information</h3>
                    <table class="syllabus-table">
                        <tr>
                            <td><strong>School:</strong></td>
                            <td>The Birches Academy, Salem, NH</td>
                        </tr>
                        <tr>
                            <td><strong>Grade Levels:</strong></td>
                            <td>K-8 (Seeds through Trees)</td>
                        </tr>
                        <tr>
                            <td><strong>Class Size:</strong></td>
                            <td>14-24 students</td>
                        </tr>
                        <tr>
                            <td><strong>Session Length:</strong></td>
                            <td>50 minutes weekly</td>
                        </tr>
                        <tr>
                            <td><strong>Locations:</strong></td>
                            <td>The Woods (Café), Outside Hardtop, Classroom</td>
                        </tr>
                    </table>
                </div>
                
                <div class="syllabus-section">
                    <h3>Program Philosophy</h3>
                    <p>Our PE program develops confident, competent movers who embrace lifelong physical activity. We focus on:</p>
                    <ul>
                        <li>Physical literacy development</li>
                        <li>Social-emotional growth</li>
                        <li>Inclusive participation</li>
                        <li>Standards-based instruction</li>
                        <li>Differentiated learning</li>
                    </ul>
                </div>
                
                <div class="syllabus-section">
                    <h3>Standards Alignment</h3>
                    <p>Our curriculum aligns with:</p>
                    <ul>
                        <li>2024 SHAPE America National PE Standards</li>
                        <li>New Hampshire State PE Requirements</li>
                        <li>CDC Physical Activity Guidelines</li>
                        <li>CASEL Social-Emotional Learning Framework</li>
                    </ul>
                </div>
                
                <div class="syllabus-section">
                    <h3>Assessment & Grading</h3>
                    <table class="grading-table">
                        <tr>
                            <td>Participation & Effort</td>
                            <td>40%</td>
                        </tr>
                        <tr>
                            <td>Skill Development</td>
                            <td>30%</td>
                        </tr>
                        <tr>
                            <td>Sportsmanship & Cooperation</td>
                            <td>20%</td>
                        </tr>
                        <tr>
                            <td>Knowledge & Understanding</td>
                            <td>10%</td>
                        </tr>
                    </table>
                </div>
                
                <div class="syllabus-section">
                    <h3>Dress Code & Equipment</h3>
                    <ul>
                        <li>Athletic shoes with non-marking soles (required)</li>
                        <li>Comfortable clothing allowing movement</li>
                        <li>Hair tied back if necessary</li>
                        <li>Water bottle encouraged</li>
                        <li>No jewelry that could cause injury</li>
                    </ul>
                </div>
                
                <div class="syllabus-section">
                    <h3>Safety Protocols</h3>
                    <ul>
                        <li>All students participate in safety orientation</li>
                        <li>Equipment inspection before each use</li>
                        <li>Proper warm-up and cool-down required</li>
                        <li>Immediate injury reporting procedure</li>
                        <li>Modified activities for medical needs</li>
                    </ul>
                </div>
                
                <div class="syllabus-section">
                    <h3>Communication</h3>
                    <p><strong>PE Department Contact:</strong></p>
                    <p>Email: pe@birchesacademy.edu</p>
                    <p>Phone: (555) 123-4567</p>
                    <p>Office Hours: Monday-Friday, 3:00-4:00 PM</p>
                </div>
                
                <div class="syllabus-section">
                    <h3>Make-Up Policy</h3>
                    <p>Students who miss PE can make up participation through:</p>
                    <ul>
                        <li>Written reflection on missed content</li>
                        <li>Home physical activity log (30 minutes)</li>
                        <li>After-school make-up session</li>
                        <li>Alternative assignment from teacher</li>
                    </ul>
                </div>
                
                <div class="syllabus-section">
                    <h3>Parent/Guardian Involvement</h3>
                    <p>We encourage families to:</p>
                    <ul>
                        <li>Support daily physical activity at home</li>
                        <li>Attend PE showcases and events</li>
                        <li>Communicate health concerns promptly</li>
                        <li>Volunteer for field day activities</li>
                        <li>Reinforce positive attitudes toward movement</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// Initialize Mobile Menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
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
        if (navLinks && mobileMenuToggle && 
            !e.target.closest('.main-nav') && 
            navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });
}

// Initialize Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow to header on scroll
        if (header) {
            if (currentScroll > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '';
            }
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.stat-card, .pillar-card, .standard-card, .fact-card, .resource-card, .location-card'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Initialize Resource Buttons
function initializeResourceButtons() {
    const resourceButtons = {
        'parent-guide-btn': generateParentGuide,
        'assessment-btn': generateAssessmentTools,
        'equipment-btn': generateEquipmentLists,
        'video-btn': generateVideoLibrary
    };
    
    Object.keys(resourceButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                resourceButtons[btnId]();
            });
        }
    });
}

// Resource Content Generators
function generateParentGuide() {
    const modal = createResourceModal('Parent & Guardian Guide', `
        <div class="parent-guide-content">
            <h3>Supporting Your Child's Physical Education Journey</h3>
            
            <div class="guide-section">
                <h4>Daily Physical Activity Recommendations</h4>
                <ul>
                    <li>Children ages 6-17: 60 minutes of moderate-to-vigorous activity daily</li>
                    <li>Include aerobic, muscle-strengthening, and bone-strengthening activities</li>
                    <li>Break up screen time with movement breaks</li>
                </ul>
            </div>
            
            <div class="guide-section">
                <h4>Home Activity Ideas</h4>
                <div class="activity-grid">
                    <div class="activity-card">
                        <h5>Indoor Activities</h5>
                        <ul>
                            <li>Dance parties</li>
                            <li>Yoga videos</li>
                            <li>Obstacle courses</li>
                            <li>Active video games</li>
                        </ul>
                    </div>
                    <div class="activity-card">
                        <h5>Outdoor Activities</h5>
                        <ul>
                            <li>Family walks/hikes</li>
                            <li>Bike rides</li>
                            <li>Playground visits</li>
                            <li>Backyard games</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="guide-section">
                <h4>Equipment for Home</h4>
                <ul>
                    <li>Jump rope</li>
                    <li>Various sized balls</li>
                    <li>Sidewalk chalk</li>
                    <li>Hula hoop</li>
                    <li>Bean bags</li>
                </ul>
            </div>
            
            <div class="guide-section">
                <h4>Communication Tips</h4>
                <ul>
                    <li>Ask about PE class activities</li>
                    <li>Celebrate effort over outcome</li>
                    <li>Share family activity successes</li>
                    <li>Communicate any health concerns</li>
                </ul>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

function generateAssessmentTools() {
    const modal = createResourceModal('Assessment Tools & Rubrics', `
        <div class="assessment-content">
            <h3>Grade-Level Assessment Tools</h3>
            
            <div class="assessment-section">
                <h4>K-2 Assessment Checklist</h4>
                <table class="assessment-table">
                    <tr>
                        <th>Skill</th>
                        <th>Emerging</th>
                        <th>Developing</th>
                        <th>Proficient</th>
                    </tr>
                    <tr>
                        <td>Locomotor Movement</td>
                        <td>Attempts skill</td>
                        <td>Performs with reminders</td>
                        <td>Performs independently</td>
                    </tr>
                    <tr>
                        <td>Following Directions</td>
                        <td>Needs support</td>
                        <td>Follows with prompts</td>
                        <td>Follows independently</td>
                    </tr>
                    <tr>
                        <td>Spatial Awareness</td>
                        <td>Learning boundaries</td>
                        <td>Usually maintains space</td>
                        <td>Consistently aware</td>
                    </tr>
                </table>
            </div>
            
            <div class="assessment-section">
                <h4>3-5 Skills Rubric</h4>
                <table class="assessment-table">
                    <tr>
                        <th>Component</th>
                        <th>4 - Exceeds</th>
                        <th>3 - Meets</th>
                        <th>2 - Approaching</th>
                        <th>1 - Beginning</th>
                    </tr>
                    <tr>
                        <td>Sport Skills</td>
                        <td>Advanced form</td>
                        <td>Proper form</td>
                        <td>Developing form</td>
                        <td>Learning basics</td>
                    </tr>
                    <tr>
                        <td>Teamwork</td>
                        <td>Leader & helper</td>
                        <td>Good teammate</td>
                        <td>Working on cooperation</td>
                        <td>Learning to share</td>
                    </tr>
                </table>
            </div>
            
            <div class="assessment-section">
                <h4>6-8 Performance Indicators</h4>
                <ul>
                    <li>Fitness goal setting and tracking</li>
                    <li>Strategy implementation in games</li>
                    <li>Leadership demonstration</li>
                    <li>Self-assessment reflections</li>
                </ul>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

function generateEquipmentLists() {
    const modal = createResourceModal('Equipment Lists by Grade', `
        <div class="equipment-content">
            <h3>Grade-Specific Equipment Needs</h3>
            
            <div class="equipment-grid">
                <div class="equipment-section">
                    <h4>K-2 Equipment</h4>
                    <ul>
                        <li>Bean bags (24)</li>
                        <li>Hula hoops (12)</li>
                        <li>Foam balls - various sizes</li>
                        <li>Scarves for movement</li>
                        <li>Parachute</li>
                        <li>Cones (30)</li>
                        <li>Jump ropes (short)</li>
                        <li>Balance beams (low)</li>
                    </ul>
                </div>
                
                <div class="equipment-section">
                    <h4>3-5 Equipment</h4>
                    <ul>
                        <li>Basketballs (size 5)</li>
                        <li>Soccer balls (size 4)</li>
                        <li>Volleyballs (trainer)</li>
                        <li>Jump ropes (standard)</li>
                        <li>Pinnies (2 sets)</li>
                        <li>Agility ladder</li>
                        <li>Frisbees</li>
                        <li>Paddle/racquet sets</li>
                    </ul>
                </div>
                
                <div class="equipment-section">
                    <h4>6-8 Equipment</h4>
                    <ul>
                        <li>Regulation balls (all sports)</li>
                        <li>Fitness equipment</li>
                        <li>Heart rate monitors</li>
                        <li>Resistance bands</li>
                        <li>Medicine balls</li>
                        <li>Badminton sets</li>
                        <li>Flag football sets</li>
                        <li>Stopwatches</li>
                    </ul>
                </div>
                
                <div class="equipment-section">
                    <h4>Adaptive Equipment</h4>
                    <ul>
                        <li>Sensory balls</li>
                        <li>Modified handles</li>
                        <li>Visual cue cards</li>
                        <li>Sound balls</li>
                        <li>Wheelchair accessible items</li>
                        <li>Weighted equipment</li>
                    </ul>
                </div>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

function generateVideoLibrary() {
    const modal = createResourceModal('Video Library & Demonstrations', `
        <div class="video-content">
            <h3>Instructional Video Resources</h3>
            
            <div class="video-categories">
                <div class="video-section">
                    <h4>Warm-Up & Cool-Down Routines</h4>
                    <ul>
                        <li>K-2 Animal Movement Warm-Up</li>
                        <li>3-5 Dynamic Stretching Sequence</li>
                        <li>6-8 Sport-Specific Warm-Ups</li>
                        <li>Mindfulness Cool-Down Series</li>
                    </ul>
                </div>
                
                <div class="video-section">
                    <h4>Skill Demonstrations</h4>
                    <ul>
                        <li>Proper Throwing Mechanics</li>
                        <li>Catching Progressions</li>
                        <li>Jump Rope Techniques</li>
                        <li>Ball Handling Skills</li>
                    </ul>
                </div>
                
                <div class="video-section">
                    <h4>Indoor Activities</h4>
                    <ul>
                        <li>Classroom Brain Breaks</li>
                        <li>Hallway Movement Games</li>
                        <li>Desk Yoga Series</li>
                        <li>Fitness Circuit Training</li>
                    </ul>
                </div>
                
                <div class="video-section">
                    <h4>Assessment Examples</h4>
                    <ul>
                        <li>Locomotor Skills Assessment</li>
                        <li>Fitness Testing Protocols</li>
                        <li>Peer Assessment Strategies</li>
                        <li>Self-Reflection Techniques</li>
                    </ul>
                </div>
            </div>
            
            <div class="video-note">
                <p><strong>Note:</strong> Videos are for demonstration purposes. Actual video library would be hosted on school's learning management system.</p>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

// Create Resource Modal Helper
function createResourceModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal resource-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <h2>${title}</h2>
            ${content}
        </div>
    `;
    
    // Add close functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', function() {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
    
    document.body.style.overflow = 'hidden';
    return modal;
}

// Add all the generator functions that were referenced
function generateK2LocomotorOutside() {
    return generateDefaultLesson('k2', 'outside', 'locomotor');
}

function generateK2LocomotorClassroom() {
    return generateDefaultLesson('k2', 'classroom', 'locomotor');
}

function generateK2ManipulativeWoods() {
    return generateDefaultLesson('k2', 'woods', 'manipulative');
}

function generateK2ManipulativeClassroom() {
    return generateDefaultLesson('k2', 'classroom', 'manipulative');
}

function generateK2FitnessWoods() {
    return generateDefaultLesson('k2', 'woods', 'fitness');
}

function generateK2FitnessOutside() {
    return generateDefaultLesson('k2', 'outside', 'fitness');
}

function generateK2FitnessClassroom() {
    return generateDefaultLesson('k2', 'classroom', 'fitness');
}

function generateK2GamesWoods() {
    return generateDefaultLesson('k2', 'woods', 'games');
}

function generateK2GamesOutside() {
    return generateDefaultLesson('k2', 'outside', 'games');
}

function generateK2GamesClassroom() {
    return generateDefaultLesson('k2', 'classroom', 'games');
}

function generateK2DanceWoods() {
    return generateDefaultLesson('k2', 'woods', 'dance');
}

function generateK2DanceOutside() {
    return generateDefaultLesson('k2', 'outside', 'dance');
}

function generateK2DanceClassroom() {
    return generateDefaultLesson('k2', 'classroom', 'dance');
}

// 3-5 Generators
function generate35LocomotorWoods() {
    return generateDefaultLesson('35', 'woods', 'locomotor');
}

function generate35LocomotorOutside() {
    return generateDefaultLesson('35', 'outside', 'locomotor');
}

function generate35LocomotorClassroom() {
    return generateDefaultLesson('35', 'classroom', 'locomotor');
}

function generate35ManipulativeWoods() {
    return generateDefaultLesson('35', 'woods', 'manipulative');
}

function generate35ManipulativeOutside() {
    return generateDefaultLesson('35', 'outside', 'manipulative');
}

function generate35ManipulativeClassroom() {
    return generateDefaultLesson('35', 'classroom', 'manipulative');
}

function generate35FitnessWoods() {
    return generateDefaultLesson('35', 'woods', 'fitness');
}

function generate35FitnessClassroom() {
    return generateDefaultLesson('35', 'classroom', 'fitness');
}

function generate35GamesWoods() {
    return generateDefaultLesson('35', 'woods', 'games');
}

function generate35GamesOutside() {
    return generateDefaultLesson('35', 'outside', 'games');
}

function generate35GamesClassroom() {
    return generateDefaultLesson('35', 'classroom', 'games');
}

function generate35DanceWoods() {
    return generateDefaultLesson('35', 'woods', 'dance');
}

function generate35DanceOutside() {
    return generateDefaultLesson('35', 'outside', 'dance');
}

function generate35DanceClassroom() {
    return generateDefaultLesson('35', 'classroom', 'dance');
}

// 6-8 Generators
function generate68LocomotorWoods() {
    return generateDefaultLesson('68', 'woods', 'locomotor');
}

function generate68LocomotorOutside() {
    return generateDefaultLesson('68', 'outside', 'locomotor');
}

function generate68LocomotorClassroom() {
    return generateDefaultLesson('68', 'classroom', 'locomotor');
}

function generate68ManipulativeWoods() {
    return generateDefaultLesson('68', 'woods', 'manipulative');
}

function generate68ManipulativeOutside() {
    return generateDefaultLesson('68', 'outside', 'manipulative');
}

function generate68ManipulativeClassroom() {
    return generateDefaultLesson('68', 'classroom', 'manipulative');
}

function generate68FitnessWoods() {
    return generateDefaultLesson('68', 'woods', 'fitness');
}

function generate68FitnessOutside() {
    return generateDefaultLesson('68', 'outside', 'fitness');
}

function generate68FitnessClassroom() {
    return generateDefaultLesson('68', 'classroom', 'fitness');
}

function generate68GamesWoods() {
    return generateDefaultLesson('68', 'woods', 'games');
}

function generate68GamesOutside() {
    return generateDefaultLesson('68', 'outside', 'games');
}

function generate68DanceWoods() {
    return generateDefaultLesson('68', 'woods', 'dance');
}

function generate68DanceOutside() {
    return generateDefaultLesson('68', 'outside', 'dance');
}

function generate68DanceClassroom() {
    return generateDefaultLesson('68', 'classroom', 'dance');
}