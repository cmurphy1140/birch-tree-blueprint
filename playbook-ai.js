// AI-Powered Playbook Generator
// Supports multiple LLM providers for flexibility

class PlaybookAI {
    constructor() {
        // API configuration - can be set via environment or user input
        this.config = {
            provider: 'openai', // 'openai', 'anthropic', 'cohere', 'huggingface'
            apiKey: null,
            model: 'gpt-3.5-turbo', // Default model
            maxTokens: 2000,
            temperature: 0.7
        };
        
        // API endpoints
        this.endpoints = {
            openai: 'https://api.openai.com/v1/chat/completions',
            anthropic: 'https://api.anthropic.com/v1/messages',
            cohere: 'https://api.cohere.ai/generate',
            huggingface: 'https://api-inference.huggingface.co/models/',
            gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        };
    }
    
    // Initialize with API key (can be stored in localStorage or environment)
    init(apiKey, provider = 'openai') {
        this.config.apiKey = apiKey;
        this.config.provider = provider;
        
        // Store in localStorage for persistence (encrypted in production)
        if (apiKey) {
            localStorage.setItem('playbook_api_key', btoa(apiKey));
            localStorage.setItem('playbook_provider', provider);
        }
    }
    
    // Load saved configuration
    loadConfig() {
        const savedKey = localStorage.getItem('playbook_api_key');
        const savedProvider = localStorage.getItem('playbook_provider');
        
        if (savedKey) {
            this.config.apiKey = atob(savedKey);
            this.config.provider = savedProvider || 'openai';
            return true;
        }
        return false;
    }
    
    // Generate comprehensive prompt for PE lesson
    generatePrompt(formData) {
        const prompt = `Create a comprehensive Physical Education lesson plan with the following specifications:

REQUIREMENTS:
- Grade Level: ${formData.gradeLevel}
- Duration: ${formData.duration} minutes
- Environment: ${formData.environment === 'indoor' ? 'Indoor Gymnasium' : 'Outdoor Field/Playground'}
- Equipment Available: ${formData.equipment}
- Activity Type: ${formData.activityType}

PE STANDARDS TO ADDRESS:
${formData.standards.map(s => `- ${this.formatStandard(s)}`).join('\n')}

SPECIAL FEATURES:
${formData.funOptions.map(opt => `- Include ${this.formatFunOption(opt)}`).join('\n')}

Please generate a detailed lesson plan that includes:

1. LESSON TITLE: Creative, engaging title that reflects the content

2. LEARNING OBJECTIVES: 2-3 specific, measurable objectives aligned with the selected standards

3. MATERIALS NEEDED: Comprehensive list based on equipment availability (${formData.equipment})

4. LESSON STRUCTURE:
   
   a) WARM-UP (5-8 minutes):
      - 2-3 specific warm-up activities
      - Include movement patterns appropriate for ${formData.gradeLevel}
      - Make it engaging and fun
   
   b) MAIN ACTIVITIES (${formData.duration - 13} minutes):
      - 2-3 main activities with detailed instructions
      - Include progressions and variations
      - Ensure activities align with ${formData.activityType}
      - Incorporate ${formData.funOptions.join(', ')} if specified
      - Age-appropriate for ${formData.gradeLevel}
   
   c) COOL-DOWN (3-5 minutes):
      - 2 cool-down activities
      - Include stretching or relaxation
      - Reflection questions for students

5. ASSESSMENT STRATEGIES:
   - 3 specific assessment methods
   - Include formative and summative options
   - Age-appropriate for ${formData.gradeLevel}

6. MODIFICATIONS:
   - 3 adaptations for different ability levels
   - Include challenges for advanced students
   - Support strategies for struggling students

7. SAFETY CONSIDERATIONS:
   - 3-4 specific safety points
   - Environmental considerations for ${formData.environment}

8. CROSS-CURRICULAR CONNECTIONS:
   - 2 connections to other subjects (math, science, language arts, etc.)

9. TAKE-HOME CHALLENGE:
   - 1 optional activity students can do at home

Format the response in clear sections with bullet points. Make it practical, engaging, and immediately usable by a PE teacher. Use encouraging, positive language throughout.`;

        return prompt;
    }
    
    // Format standard names for prompt
    formatStandard(standard) {
        const standardNames = {
            'motor-skills': 'Motor Skills & Movement Patterns - Develop fundamental and complex motor skills',
            'strategies': 'Movement Strategies & Tactics - Apply tactical concepts in games and activities',
            'fitness': 'Physical Fitness & Knowledge - Understand and improve health-related fitness',
            'behavior': 'Responsible Personal & Social Behavior - Demonstrate respect and responsibility',
            'social': 'Social Interaction & Cooperation - Work effectively with others',
            'value': 'Value of Physical Activity - Recognize the benefits of physical activity',
            'wellness': 'Health & Wellness - Connect physical activity to overall well-being'
        };
        return standardNames[standard] || standard;
    }
    
    // Format fun options for prompt
    formatFunOption(option) {
        const optionDescriptions = {
            'music': 'music and rhythm-based activities',
            'themes': 'themed activities (superheroes, animals, seasons, etc.)',
            'challenges': 'team challenges and competitive elements',
            'stations': 'station rotations with varied activities'
        };
        return optionDescriptions[option] || option;
    }
    
    // Call the AI API to generate lesson
    async generateLesson(formData) {
        if (!this.config.apiKey) {
            throw new Error('API key not configured. Please add your API key in settings.');
        }
        
        const prompt = this.generatePrompt(formData);
        
        try {
            let response;
            
            switch (this.config.provider) {
                case 'openai':
                    response = await this.callOpenAI(prompt);
                    break;
                case 'anthropic':
                    response = await this.callAnthropic(prompt);
                    break;
                case 'cohere':
                    response = await this.callCohere(prompt);
                    break;
                case 'huggingface':
                    response = await this.callHuggingFace(prompt);
                    break;
                case 'gemini':
                    response = await this.callGemini(prompt);
                    break;
                default:
                    response = await this.callOpenAI(prompt);
            }
            
            return this.parseAIResponse(response, formData);
            
        } catch (error) {
            console.error('AI Generation Error:', error);
            
            // Fallback to enhanced static generation if AI fails
            if (error.message.includes('API key')) {
                throw error;
            }
            
            // Return enhanced static version as fallback
            return this.generateEnhancedStaticLesson(formData);
        }
    }
    
    // OpenAI API call
    async callOpenAI(prompt) {
        const response = await fetch(this.endpoints.openai, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert Physical Education curriculum designer with 20 years of experience creating engaging, standards-aligned PE lessons for K-8 students.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // Anthropic Claude API call
    async callAnthropic(prompt) {
        const response = await fetch(this.endpoints.anthropic, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: this.config.maxTokens,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error('Anthropic API error');
        }
        
        const data = await response.json();
        return data.content[0].text;
    }
    
    // Cohere API call
    async callCohere(prompt) {
        const response = await fetch(this.endpoints.cohere, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                model: 'command'
            })
        });
        
        if (!response.ok) {
            throw new Error('Cohere API error');
        }
        
        const data = await response.json();
        return data.generations[0].text;
    }
    
    // HuggingFace API call (free tier)
    async callHuggingFace(prompt) {
        const model = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
        const response = await fetch(this.endpoints.huggingface + model, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: this.config.maxTokens,
                    temperature: this.config.temperature
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('HuggingFace API error');
        }
        
        const data = await response.json();
        return data[0].generated_text;
    }
    
    // Google Gemini API call
    async callGemini(prompt) {
        const response = await fetch(`${this.endpoints.gemini}?key=${this.config.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: this.config.maxTokens,
                    temperature: this.config.temperature
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Gemini API error');
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    
    // Parse AI response into structured lesson plan
    parseAIResponse(aiText, formData) {
        // Parse the AI response into structured sections
        const sections = this.extractSections(aiText);
        
        return {
            title: sections.title || this.generateTitle(formData),
            gradeLevel: formData.gradeLevel,
            duration: formData.duration,
            environment: formData.environment,
            standards: formData.standards,
            objective: sections.objectives || this.generateObjective(formData),
            materials: sections.materials || this.generateMaterials(formData),
            warmup: sections.warmup || this.generateWarmup(formData),
            mainActivity: sections.mainActivities || this.generateMainActivity(formData),
            cooldown: sections.cooldown || this.generateCooldown(formData),
            assessments: sections.assessments || this.generateAssessments(formData),
            modifications: sections.modifications || this.generateModifications(formData),
            safetyNotes: sections.safety || this.generateSafetyNotes(formData),
            crossCurricular: sections.crossCurricular || this.generateCrossCurricular(formData),
            takeHome: sections.takeHome || this.generateTakeHome(formData),
            aiGenerated: true,
            rawResponse: aiText
        };
    }
    
    // Extract sections from AI response
    extractSections(text) {
        const sections = {};
        
        // Extract title
        const titleMatch = text.match(/(?:LESSON TITLE|Title):\s*(.+)/i);
        sections.title = titleMatch ? titleMatch[1].trim() : null;
        
        // Extract objectives
        const objectivesMatch = text.match(/(?:LEARNING OBJECTIVES|Objectives):\s*([\s\S]+?)(?=\n\n|\nMATERIALS|$)/i);
        sections.objectives = objectivesMatch ? objectivesMatch[1].trim() : null;
        
        // Extract materials
        const materialsMatch = text.match(/(?:MATERIALS NEEDED|Materials):\s*([\s\S]+?)(?=\n\n|\nLESSON|WARM-UP|$)/i);
        sections.materials = materialsMatch ? this.parseList(materialsMatch[1]) : null;
        
        // Extract warm-up
        const warmupMatch = text.match(/WARM-UP[\s\S]*?:\s*([\s\S]+?)(?=\nMAIN|MAIN ACTIVITIES|$)/i);
        sections.warmup = warmupMatch ? {
            duration: '5-8 minutes',
            activities: this.parseList(warmupMatch[1])
        } : null;
        
        // Extract main activities
        const mainMatch = text.match(/MAIN ACTIVITIES[\s\S]*?:\s*([\s\S]+?)(?=\nCOOL-DOWN|COOL DOWN|$)/i);
        sections.mainActivities = mainMatch ? this.parseActivities(mainMatch[1]) : null;
        
        // Extract cool-down
        const cooldownMatch = text.match(/COOL-DOWN[\s\S]*?:\s*([\s\S]+?)(?=\nASSESSMENT|$)/i);
        sections.cooldown = cooldownMatch ? {
            duration: '3-5 minutes',
            activities: this.parseList(cooldownMatch[1])
        } : null;
        
        // Extract assessments
        const assessmentsMatch = text.match(/ASSESSMENT[\s\S]*?:\s*([\s\S]+?)(?=\nMODIFICATIONS|$)/i);
        sections.assessments = assessmentsMatch ? this.parseList(assessmentsMatch[1]) : null;
        
        // Extract modifications
        const modificationsMatch = text.match(/MODIFICATIONS[\s\S]*?:\s*([\s\S]+?)(?=\nSAFETY|$)/i);
        sections.modifications = modificationsMatch ? this.parseList(modificationsMatch[1]) : null;
        
        // Extract safety
        const safetyMatch = text.match(/SAFETY[\s\S]*?:\s*([\s\S]+?)(?=\nCROSS-CURRICULAR|CROSS CURRICULAR|$)/i);
        sections.safety = safetyMatch ? this.parseList(safetyMatch[1]) : null;
        
        // Extract cross-curricular
        const crossMatch = text.match(/CROSS-CURRICULAR[\s\S]*?:\s*([\s\S]+?)(?=\nTAKE-HOME|TAKE HOME|$)/i);
        sections.crossCurricular = crossMatch ? this.parseList(crossMatch[1]) : null;
        
        // Extract take-home
        const takeHomeMatch = text.match(/TAKE-HOME[\s\S]*?:\s*([\s\S]+?)$/i);
        sections.takeHome = takeHomeMatch ? takeHomeMatch[1].trim() : null;
        
        return sections;
    }
    
    // Parse bullet points or numbered lists
    parseList(text) {
        const lines = text.split('\n');
        const items = [];
        
        lines.forEach(line => {
            const cleaned = line.replace(/^[\s\-\*\•\d\.]+/, '').trim();
            if (cleaned) {
                items.push(cleaned);
            }
        });
        
        return items.filter(item => item.length > 0);
    }
    
    // Parse activities with descriptions
    parseActivities(text) {
        const activities = [];
        const blocks = text.split(/\n\n/);
        
        blocks.forEach(block => {
            const lines = block.split('\n');
            if (lines.length > 0) {
                const firstLine = lines[0].trim();
                const nameMatch = firstLine.match(/^(?:[\d\.\-\*\•]\s*)?(.+?)(?:\s*\((.+?)\))?$/);
                
                if (nameMatch) {
                    activities.push({
                        name: nameMatch[1].trim(),
                        duration: nameMatch[2] || '10 minutes',
                        description: lines.slice(1).join(' ').trim() || 'See instructions above'
                    });
                }
            }
        });
        
        return activities.length > 0 ? activities : null;
    }
    
    // Enhanced static lesson generation (fallback)
    generateEnhancedStaticLesson(formData) {
        // This uses the existing static generation but enhanced
        // Import the functions from the original playbook-generator.js
        return {
            title: this.generateTitle(formData),
            gradeLevel: formData.gradeLevel,
            duration: formData.duration,
            environment: formData.environment,
            standards: formData.standards,
            objective: this.generateObjective(formData),
            materials: this.generateMaterials(formData),
            warmup: this.generateWarmup(formData),
            mainActivity: this.generateMainActivity(formData),
            cooldown: this.generateCooldown(formData),
            assessments: this.generateAssessments(formData),
            modifications: this.generateModifications(formData),
            safetyNotes: this.generateSafetyNotes(formData),
            crossCurricular: this.generateCrossCurricular(formData),
            takeHome: this.generateTakeHome(formData),
            aiGenerated: false
        };
    }
    
    // Generate cross-curricular connections
    generateCrossCurricular(formData) {
        const connections = {
            'K-2': [
                'Math: Count repetitions, identify shapes in movement patterns',
                'Science: Explore how bodies move, animal movements',
                'Language Arts: Follow verbal directions, describe movements'
            ],
            '3-5': [
                'Math: Calculate scores, measure distances, track time',
                'Science: Study force, motion, and simple machines in sports',
                'Social Studies: Learn games from different cultures'
            ],
            '6-8': [
                'Math: Analyze statistics, calculate averages and percentages',
                'Science: Understand biomechanics and physiology',
                'Health: Connect fitness to nutrition and wellness'
            ]
        };
        
        return connections[formData.gradeLevel] || connections['3-5'];
    }
    
    // Generate take-home challenge
    generateTakeHome(formData) {
        const challenges = {
            'K-2': 'Practice your favorite animal walk for 5 minutes each day and teach it to a family member!',
            '3-5': 'Create a 5-minute fitness routine using household items and perform it 3 times this week.',
            '6-8': 'Track your daily physical activity for one week and set a personal improvement goal.'
        };
        
        return challenges[formData.gradeLevel] || challenges['3-5'];
    }
    
    // Copy methods from original generator for fallback
    generateTitle(data) {
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
    
    generateObjective(data) {
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
    
    generateMaterials(data) {
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
    
    generateWarmup(data) {
        const warmups = {
            'K-2': {
                indoor: [
                    'Simon Says with movements (jump, hop, spin, stretch)',
                    'Animal walks around the gym (bear crawl, crab walk, frog jumps)',
                    'Follow the Leader with various locomotor movements'
                ],
                outdoor: [
                    'Red Light, Green Light across the field',
                    'Nature scavenger hunt jog',
                    'Shadow tag in designated area'
                ]
            },
            '3-5': {
                indoor: [
                    'Dynamic stretching circuit (arm circles, leg swings, lunges)',
                    'Locomotor movement progressions (walk-jog-run-skip-gallop)',
                    'Four Corners fitness (jumping jacks, squats, push-ups, planks)'
                ],
                outdoor: [
                    'Lap around the field with varied movements',
                    'Dynamic stretching in a circle',
                    'Tag variations (freeze tag, octopus tag)'
                ]
            },
            '6-8': {
                indoor: [
                    'Student-led dynamic warm-up routine',
                    'Sport-specific movement patterns',
                    'Agility ladder or cone drills'
                ],
                outdoor: [
                    'Progressive running drills',
                    'Dynamic stretching and mobility work',
                    'Sport-specific warm-up games'
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
    
    generateMainActivity(data) {
        // Reuse from original implementation
        return window.generateMainActivity ? window.generateMainActivity(data) : [];
    }
    
    generateCooldown(data) {
        const cooldowns = {
            'K-2': [
                'Slow walking in a circle with deep breathing',
                'Simple stretches with counting',
                'Quiet game like "Silent Ball"'
            ],
            '3-5': [
                'Static stretching routine',
                'Yoga poses for kids',
                'Walking and reflection on lesson'
            ],
            '6-8': [
                'Student-led stretching',
                'Foam rolling (if available)',
                'Mindfulness and breathing exercises'
            ]
        };
        
        const gradeCooldowns = cooldowns[data.gradeLevel] || cooldowns['3-5'];
        
        return {
            duration: '3-5 minutes',
            activities: gradeCooldowns.slice(0, 2)
        };
    }
    
    generateAssessments(data) {
        const assessments = {
            'K-2': [
                'Observation of student participation and effort',
                'Simple self-assessment with thumbs up/down',
                'Exit ticket with smiley faces'
            ],
            '3-5': [
                'Peer assessment checklist',
                'Skill demonstration rubric',
                'Written reflection questions'
            ],
            '6-8': [
                'Self-assessment rubric',
                'Video analysis of performance',
                'Written tactical analysis'
            ]
        };
        
        const gradeAssessments = assessments[data.gradeLevel] || assessments['3-5'];
        return gradeAssessments;
    }
    
    generateModifications(data) {
        return [
            'For students with limited mobility: Provide alternative movements or seated options',
            'For advanced students: Add complexity to tasks or provide leadership roles',
            'For English Language Learners: Use visual demonstrations and pair with supportive partners'
        ];
    }
    
    generateSafetyNotes(data) {
        const notes = [
            'Ensure adequate spacing between students during activities',
            'Check equipment for damage before use',
            'Review boundaries and safety rules before each activity'
        ];
        
        if (data.environment === 'outdoor') {
            notes.push('Check field for hazards before activity');
            notes.push('Ensure students have water and sun protection');
        }
        
        return notes;
    }
}

// Export for use
window.PlaybookAI = PlaybookAI;