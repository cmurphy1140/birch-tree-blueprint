// Playbook Generator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePlaybookGenerator();
});

function initializePlaybookGenerator() {
    const form = document.getElementById('playbook-form');
    const resultDiv = document.getElementById('playbook-result');
    
    // Handle radio and checkbox styling
    const radioItems = document.querySelectorAll('.radio-item');
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    
    radioItems.forEach(item => {
        const input = item.querySelector('input[type="radio"]');
        input.addEventListener('change', function() {
            const group = document.querySelectorAll(`input[name="${this.name}"]`);
            group.forEach(radio => {
                radio.closest('.radio-item').classList.remove('selected');
            });
            if (this.checked) {
                item.classList.add('selected');
            }
        });
    });
    
    checkboxItems.forEach(item => {
        const input = item.querySelector('input[type="checkbox"]');
        input.addEventListener('change', function() {
            if (this.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    });
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            generatePlaybook();
        });
    }
}

async function generatePlaybook() {
    const formData = collectFormData();
    const aiEnabled = localStorage.getItem('ai_enabled') !== 'false';
    const hasApiKey = localStorage.getItem('playbook_api_key');
    
    // Show loading state
    const generateBtn = document.getElementById('generate-btn');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('loading-spinner');
    
    generateBtn.disabled = true;
    buttonText.textContent = 'Generating...';
    spinner.style.display = 'inline-block';
    
    try {
        let playbook;
        
        // Try AI generation first if enabled and configured
        if (aiEnabled && hasApiKey && window.playbookAI) {
            try {
                console.log('Generating with AI...');
                playbook = await window.playbookAI.generateLesson(formData);
            } catch (aiError) {
                console.error('AI generation failed, falling back to static:', aiError);
                
                // Show error message but continue with static generation
                if (aiError.message.includes('API key')) {
                    if (confirm('AI API key not configured. Would you like to configure it now?')) {
                        openAISettings();
                        return;
                    }
                }
                
                // Fall back to static generation
                playbook = createPlaybook(formData);
            }
        } else {
            // Use static generation
            playbook = createPlaybook(formData);
        }
        
        displayPlaybook(playbook);
        
    } catch (error) {
        console.error('Generation error:', error);
        alert('Error generating playbook. Please try again.');
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        buttonText.textContent = 'Generate Playbook';
        spinner.style.display = 'none';
    }
}

function collectFormData() {
    const form = document.getElementById('playbook-form');
    const formData = {
        gradeLevel: form.querySelector('#grade-level').value,
        duration: form.querySelector('#duration').value,
        environment: form.querySelector('input[name="environment"]:checked')?.value,
        standards: Array.from(form.querySelectorAll('input[name="standards"]:checked')).map(cb => cb.value),
        activityType: form.querySelector('#activity-type').value,
        equipment: form.querySelector('#equipment').value,
        funOptions: Array.from(form.querySelectorAll('input[name="fun"]:checked')).map(cb => cb.value)
    };
    return formData;
}

function createPlaybook(data) {
    const activities = generateActivities(data);
    const warmup = generateWarmup(data);
    const mainActivity = generateMainActivity(data);
    const cooldown = generateCooldown(data);
    const assessments = generateAssessments(data);
    
    return {
        title: generateTitle(data),
        gradeLevel: data.gradeLevel,
        duration: data.duration,
        environment: data.environment,
        standards: data.standards,
        objective: generateObjective(data),
        materials: generateMaterials(data),
        warmup: warmup,
        mainActivity: mainActivity,
        cooldown: cooldown,
        assessments: assessments,
        modifications: generateModifications(data),
        safetyNotes: generateSafetyNotes(data)
    };
}

function generateTitle(data) {
    const themes = {
        'motor-skills': 'Movement Mastery',
        'strategies': 'Strategic Play',
        'fitness': 'Fitness Challenge',
        'behavior': 'Team Excellence',
        'social': 'Cooperative Adventure',
        'value': 'Active Living',
        'wellness': 'Wellness Warriors'
    };
    
    const activityNames = {
        'games': 'Games Galore',
        'fitness': 'Fitness Festival',
        'dance': 'Rhythm & Movement',
        'cooperative': 'Team Building',
        'individual': 'Skill Builders',
        'mixed': 'PE Spectacular'
    };
    
    const primaryStandard = data.standards[0] || 'motor-skills';
    const theme = themes[primaryStandard];
    const activity = activityNames[data.activityType];
    
    return `${theme}: ${activity}`;
}

function generateObjective(data) {
    const objectives = {
        'K-2': {
            'motor-skills': 'Students will demonstrate basic locomotor skills and body awareness through guided movement activities.',
            'fitness': 'Students will participate in moderate physical activity and identify how their body feels during exercise.',
            'social': 'Students will practice sharing, taking turns, and encouraging classmates during activities.'
        },
        '3-5': {
            'motor-skills': 'Students will refine sport-specific skills and apply them in modified game situations.',
            'strategies': 'Students will demonstrate basic offensive and defensive strategies in small-sided games.',
            'fitness': 'Students will identify components of health-related fitness and set personal goals.'
        },
        '6-8': {
            'motor-skills': 'Students will execute advanced techniques with consistency in dynamic environments.',
            'strategies': 'Students will analyze and apply tactical decisions in competitive scenarios.',
            'fitness': 'Students will design and implement personal fitness plans based on FITT principles.'
        }
    };
    
    const gradeObjectives = objectives[data.gradeLevel] || objectives['3-5'];
    const primaryStandard = data.standards[0] || 'motor-skills';
    
    return gradeObjectives[primaryStandard] || gradeObjectives['motor-skills'];
}

function generateMaterials(data) {
    const materials = [];
    
    if (data.equipment === 'full') {
        materials.push('Cones (20)', 'Various balls (basketballs, soccer balls, playground balls)', 
                      'Hula hoops (10)', 'Jump ropes (class set)', 'Pinnies/jerseys', 
                      'Poly spots', 'Bean bags');
    } else if (data.equipment === 'basic') {
        materials.push('Cones (10)', 'Playground balls (10)', 'Poly spots or markers');
    } else if (data.equipment === 'minimal') {
        materials.push('Cones or markers (8)', 'Music player (optional)');
    } else {
        materials.push('No equipment needed - bodyweight activities');
    }
    
    if (data.funOptions.includes('music')) {
        materials.push('Music player with upbeat playlist');
    }
    
    if (data.funOptions.includes('stations')) {
        materials.push('Station cards or signs');
    }
    
    return materials;
}

function generateWarmup(data) {
    const warmups = {
        'K-2': {
            indoor: [
                'Simon Says with movements (jump, hop, spin, stretch)',
                'Animal walks around the gym (bear crawl, crab walk, frog jumps)',
                'Follow the Leader with various locomotor movements',
                'Freeze Dance with different body shapes'
            ],
            outdoor: [
                'Red Light, Green Light across the field',
                'Nature scavenger hunt jog',
                'Shadow tag in designated area',
                'Movement exploration to music'
            ]
        },
        '3-5': {
            indoor: [
                'Dynamic stretching circuit (arm circles, leg swings, lunges)',
                'Locomotor movement progressions (walk-jog-run-skip-gallop)',
                'Partner mirror movements',
                'Four Corners fitness (jumping jacks, squats, push-ups, planks)'
            ],
            outdoor: [
                'Lap around the field with varied movements',
                'Dynamic stretching in a circle',
                'Tag variations (freeze tag, octopus tag)',
                'Relay race warm-up'
            ]
        },
        '6-8': {
            indoor: [
                'Student-led dynamic warm-up routine',
                'Sport-specific movement patterns',
                'Agility ladder or cone drills',
                'Partner resistance exercises'
            ],
            outdoor: [
                'Progressive running drills',
                'Dynamic stretching and mobility work',
                'Sport-specific warm-up games',
                'Plyometric exercises'
            ]
        }
    };
    
    const gradeWarmups = warmups[data.gradeLevel] || warmups['3-5'];
    const envWarmups = gradeWarmups[data.environment] || gradeWarmups.indoor;
    
    return {
        duration: '5-8 minutes',
        activities: envWarmups.slice(0, 2)
    };
}

function generateMainActivity(data) {
    const activities = {
        games: {
            'K-2': [
                {
                    name: 'Sharks and Minnows',
                    description: 'Students (minnows) try to cross the ocean without being tagged by sharks. Tagged minnows become seaweed and can tag from a stationary position.',
                    duration: '10 minutes'
                },
                {
                    name: 'Clean Your Room',
                    description: 'Divide gym in half. Each team tries to clear their side by throwing soft objects to the other side. Team with fewer objects wins.',
                    duration: '8 minutes'
                }
            ],
            '3-5': [
                {
                    name: 'Ultimate Frisbee (Modified)',
                    description: 'No-contact version with simplified rules. Focus on passing, catching, and spatial awareness.',
                    duration: '15 minutes'
                },
                {
                    name: 'Capture the Flag',
                    description: 'Classic game with safety zones and specific roles for different skill levels.',
                    duration: '12 minutes'
                }
            ],
            '6-8': [
                {
                    name: 'Tournament Style Games',
                    description: 'Small-sided games (3v3 or 4v4) in basketball, soccer, or volleyball with rotation system.',
                    duration: '20 minutes'
                },
                {
                    name: 'Strategic Team Challenges',
                    description: 'Complex team games requiring strategy and communication (e.g., Ultimate Frisbee, Speedball).',
                    duration: '15 minutes'
                }
            ]
        },
        fitness: {
            'K-2': [
                {
                    name: 'Fitness Adventure Course',
                    description: 'Set up stations with different exercises (jumping, balancing, crawling). Students complete course multiple times.',
                    duration: '12 minutes'
                },
                {
                    name: 'Exercise Dice Game',
                    description: 'Roll dice to determine exercise and repetitions. Make it fun with themes and music.',
                    duration: '10 minutes'
                }
            ],
            '3-5': [
                {
                    name: 'Circuit Training Stations',
                    description: 'Rotate through 6-8 stations focusing on different fitness components. 1 minute per station.',
                    duration: '15 minutes'
                },
                {
                    name: 'Fitness Bingo',
                    description: 'Complete exercises to mark off bingo card. First to get bingo wins.',
                    duration: '12 minutes'
                }
            ],
            '6-8': [
                {
                    name: 'HIIT Workout',
                    description: 'High-intensity interval training with work/rest ratios appropriate for age group.',
                    duration: '15 minutes'
                },
                {
                    name: 'Personal Fitness Challenges',
                    description: 'Students work on personal fitness goals with choice of activities.',
                    duration: '20 minutes'
                }
            ]
        },
        cooperative: {
            'K-2': [
                {
                    name: 'Parachute Play',
                    description: 'Various parachute activities: popcorn, merry-go-round, making waves, and mushroom.',
                    duration: '12 minutes'
                },
                {
                    name: 'Human Knot',
                    description: 'Simple version where students hold hands in a circle and work together to untangle.',
                    duration: '8 minutes'
                }
            ],
            '3-5': [
                {
                    name: 'Team Building Challenges',
                    description: 'Problem-solving activities like "Cross the River" or "Pipeline" requiring teamwork.',
                    duration: '15 minutes'
                },
                {
                    name: 'Cooperative Relay Races',
                    description: 'Relays where teams must work together (three-legged race, wheelbarrow, etc.).',
                    duration: '12 minutes'
                }
            ],
            '6-8': [
                {
                    name: 'Leadership Initiatives',
                    description: 'Complex problem-solving tasks requiring planning, communication, and leadership.',
                    duration: '20 minutes'
                },
                {
                    name: 'Trust Activities',
                    description: 'Trust falls, blind navigation, and partner cooperation exercises.',
                    duration: '15 minutes'
                }
            ]
        }
    };
    
    const activityCategory = activities[data.activityType] || activities.games;
    const gradeActivities = activityCategory[data.gradeLevel] || activityCategory['3-5'];
    
    // Add fun options modifications
    let selectedActivities = [...gradeActivities];
    
    if (data.funOptions.includes('music')) {
        selectedActivities.forEach(act => {
            act.description += ' Play upbeat music throughout the activity.';
        });
    }
    
    if (data.funOptions.includes('themes')) {
        selectedActivities.forEach(act => {
            act.name = `Themed ${act.name} (Superheroes, Animals, or Seasons)`;
        });
    }
    
    if (data.funOptions.includes('stations') && data.activityType !== 'fitness') {
        selectedActivities = [{
            name: 'Station Rotation Activity',
            description: `Set up 4-5 stations with different activities from the lesson. Groups rotate every ${Math.floor(data.duration/5)} minutes.`,
            duration: `${data.duration - 15} minutes`
        }];
    }
    
    return selectedActivities;
}

function generateCooldown(data) {
    const cooldowns = {
        'K-2': [
            'Slow walking in a circle with deep breathing',
            'Simple stretches with counting',
            'Quiet game like "Silent Ball"',
            'Guided imagery relaxation'
        ],
        '3-5': [
            'Static stretching routine',
            'Yoga poses for kids',
            'Walking and reflection on lesson',
            'Partner stretches'
        ],
        '6-8': [
            'Student-led stretching',
            'Foam rolling (if available)',
            'Mindfulness and breathing exercises',
            'Progressive muscle relaxation'
        ]
    };
    
    const gradeCooldowns = cooldowns[data.gradeLevel] || cooldowns['3-5'];
    
    return {
        duration: '3-5 minutes',
        activities: gradeCooldowns.slice(0, 2)
    };
}

function generateAssessments(data) {
    const assessments = {
        'K-2': [
            'Observation of student participation and effort',
            'Simple self-assessment with thumbs up/down',
            'Exit ticket with smiley faces',
            'Verbal check for understanding'
        ],
        '3-5': [
            'Peer assessment checklist',
            'Skill demonstration rubric',
            'Written reflection questions',
            'Goal-setting worksheet'
        ],
        '6-8': [
            'Self-assessment rubric',
            'Video analysis of performance',
            'Written tactical analysis',
            'Fitness testing and tracking'
        ]
    };
    
    const gradeAssessments = assessments[data.gradeLevel] || assessments['3-5'];
    const standardsAssessments = [];
    
    if (data.standards.includes('motor-skills')) {
        standardsAssessments.push('Skills checklist for specific movements');
    }
    if (data.standards.includes('fitness')) {
        standardsAssessments.push('Heart rate monitoring and fitness tracking');
    }
    if (data.standards.includes('social')) {
        standardsAssessments.push('Teamwork and sportsmanship rubric');
    }
    
    return [...gradeAssessments.slice(0, 2), ...standardsAssessments];
}

function generateModifications(data) {
    return [
        'For students with limited mobility: Provide alternative movements or seated options',
        'For advanced students: Add complexity to tasks or provide leadership roles',
        'For English Language Learners: Use visual demonstrations and pair with supportive partners',
        'For students with attention challenges: Provide clear boundaries and frequent check-ins',
        'Equipment adaptations: Use lighter/larger balls, lower targets, or modified rules as needed'
    ];
}

function generateSafetyNotes(data) {
    const notes = [
        'Ensure adequate spacing between students during activities',
        'Check equipment for damage before use',
        'Review boundaries and safety rules before each activity',
        'Have students remove jewelry and tie back long hair'
    ];
    
    if (data.environment === 'outdoor') {
        notes.push('Check field for hazards before activity');
        notes.push('Ensure students have water and sun protection');
        notes.push('Have a plan for inclement weather');
    }
    
    if (data.activityType === 'fitness') {
        notes.push('Monitor students for signs of overexertion');
        notes.push('Emphasize proper form over speed or repetitions');
    }
    
    return notes;
}

function generateActivities(data) {
    // This function can be expanded to generate more specific activities
    return [];
}

function displayPlaybook(playbook) {
    const resultDiv = document.getElementById('playbook-result');
    
    // Check if AI-generated
    const aiGenerated = playbook.aiGenerated || false;
    const aiBadge = aiGenerated ? '<span class="ai-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> AI Generated</span>' : '';
    
    const html = `
        <div class="playbook-header">
            <h3 class="playbook-title">${playbook.title}${aiBadge}</h3>
            <div class="playbook-meta">
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    ${playbook.gradeLevel}
                </span>
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${playbook.duration} minutes
                </span>
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${playbook.environment === 'indoor' ? 'Indoor (Gymnasium)' : 'Outdoor (Field)'}
                </span>
            </div>
        </div>
        
        <div class="playbook-content">
            <div class="playbook-section">
                <h4>Learning Objective</h4>
                <p>${playbook.objective}</p>
            </div>
            
            <div class="playbook-section">
                <h4>PE Standards Addressed</h4>
                <ul>
                    ${playbook.standards.map(standard => `
                        <li>${formatStandard(standard)}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="playbook-section">
                <h4>Materials Needed</h4>
                <ul>
                    ${playbook.materials.map(material => `
                        <li>${material}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="playbook-section">
                <h4>Warm-Up (${playbook.warmup.duration})</h4>
                <ul>
                    ${playbook.warmup.activities.map(activity => `
                        <li>${activity}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="playbook-section">
                <h4>Main Activities</h4>
                ${playbook.mainActivity.map(activity => `
                    <div style="margin-bottom: 16px;">
                        <strong>${activity.name}</strong> (${activity.duration})
                        <p style="margin-top: 8px;">${activity.description}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="playbook-section">
                <h4>Cool-Down (${playbook.cooldown.duration})</h4>
                <ul>
                    ${playbook.cooldown.activities.map(activity => `
                        <li>${activity}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="playbook-section">
                <h4>Assessment Strategies</h4>
                <ul>
                    ${playbook.assessments.map(assessment => `
                        <li>${assessment}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="playbook-section">
                <h4>Modifications & Adaptations</h4>
                <ul>
                    ${playbook.modifications.map(mod => `
                        <li>${mod}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="playbook-section">
                <h4>Safety Considerations</h4>
                <ul>
                    ${playbook.safetyNotes.map(note => `
                        <li>${note}</li>
                    `).join('')}
                </ul>
            </div>
            
            ${playbook.crossCurricular ? `
            <div class="playbook-section">
                <h4>Cross-Curricular Connections</h4>
                <ul>
                    ${Array.isArray(playbook.crossCurricular) ? 
                        playbook.crossCurricular.map(connection => `<li>${connection}</li>`).join('') :
                        `<li>${playbook.crossCurricular}</li>`
                    }
                </ul>
            </div>
            ` : ''}
            
            ${playbook.takeHome ? `
            <div class="playbook-section">
                <h4>Take-Home Challenge</h4>
                <p>${playbook.takeHome}</p>
            </div>
            ` : ''}
        </div>
        
        <div class="action-buttons">
            <button class="action-button use-button" onclick="usePlaybook()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Use this suggestion in gym
            </button>
            <a href="mailto:info@birchesacademy.org?subject=PE Playbook: ${encodeURIComponent(playbook.title)}&body=${encodeURIComponent(generateEmailBody(playbook))}" class="action-button email-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email this gym plan to info@birchesacademy.org
            </a>
            <button class="action-button print-button" onclick="window.print()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print Playbook
            </button>
        </div>
    `;
    
    resultDiv.innerHTML = html;
    resultDiv.classList.add('active');
    
    // Scroll to result
    setTimeout(() => {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function formatStandard(standard) {
    const standardNames = {
        'motor-skills': 'Motor Skills & Movement Patterns',
        'strategies': 'Movement Strategies & Tactics',
        'fitness': 'Physical Fitness & Knowledge',
        'behavior': 'Responsible Personal & Social Behavior',
        'social': 'Social Interaction & Cooperation',
        'value': 'Value of Physical Activity',
        'wellness': 'Health & Wellness'
    };
    
    return standardNames[standard] || standard;
}

function generateEmailBody(playbook) {
    let body = `PE Playbook: ${playbook.title}\n\n`;
    body += `Grade Level: ${playbook.gradeLevel}\n`;
    body += `Duration: ${playbook.duration} minutes\n`;
    body += `Environment: ${playbook.environment === 'indoor' ? 'Indoor' : 'Outdoor'}\n\n`;
    body += `Objective: ${playbook.objective}\n\n`;
    body += `Main Activities:\n`;
    playbook.mainActivity.forEach(activity => {
        body += `- ${activity.name}: ${activity.description}\n`;
    });
    body += `\n[Generated by The Birches Academy PE Playbook Generator]`;
    
    return body;
}

function usePlaybook() {
    alert('Great choice! This playbook has been saved for your next gym class. Feel free to adapt it based on your students\' needs and energy levels. Have a fantastic PE session!');
    
    // You could also save to localStorage or send to a backend here
    const playbook = document.querySelector('.playbook-title').textContent;
    localStorage.setItem('lastPlaybook', playbook);
    localStorage.setItem('lastPlaybookDate', new Date().toISOString());
}