import type { GeneratorInput, Playbook, Activity, Standard, LessonBlock } from '../types';
import activitiesData from '../../data/activities.json';
import standardsData from '../../data/standards.json';

export class DeterministicGenerator {
  private activities: Activity[];
  private standards: Standard[];
  private warmups: any[];
  private cooldowns: any[];

  constructor() {
    this.activities = activitiesData.activities;
    this.standards = standardsData.standards;
    this.warmups = activitiesData.warmups;
    this.cooldowns = activitiesData.cooldowns;
  }

  generate(input: GeneratorInput): Playbook {
    const id = this.generateId();
    const now = new Date();
    
    // Filter activities based on constraints
    const eligibleActivities = this.filterActivities(input);
    const selectedStandards = this.getStandards(input.standards);
    
    // Generate lesson components
    const warmup = this.selectWarmup(input);
    const skillFocus = this.generateSkillFocus(input, eligibleActivities);
    const mainActivities = this.selectMainActivities(input, eligibleActivities);
    const cooldown = this.selectCooldown(input);
    
    // Generate supporting content
    const objective = this.generateObjective(input, selectedStandards);
    const materials = this.generateMaterials(input, mainActivities);
    const assessments = this.generateAssessments(input);
    const differentiation = this.generateDifferentiation(input);
    const socialEmotional = this.generateSEL(input);
    const crossCurricular = this.generateCrossCurricular(input);
    const safetyConsiderations = this.generateSafety(input, mainActivities);
    
    return {
      id,
      title: this.generateTitle(input, mainActivities),
      createdAt: now,
      updatedAt: now,
      input,
      gradeLevel: input.gradeLevel,
      duration: input.duration,
      environment: input.environment,
      standards: selectedStandards,
      objective,
      materials,
      warmup,
      skillFocus,
      mainActivity: mainActivities,
      cooldown,
      assessments,
      differentiation,
      socialEmotional,
      crossCurricular,
      safetyConsiderations,
      takeHome: this.generateTakeHome(input),
      metadata: {
        generated: 'deterministic',
        version: '1.0.0',
        favorite: false
      }
    };
  }

  private filterActivities(input: GeneratorInput): Activity[] {
    return this.activities.filter(activity => {
      // Check grade level
      if (!activity.gradeLevel.includes(input.gradeLevel)) {
        return false;
      }
      
      // Check environment
      if (!activity.environment.includes(input.environment)) {
        return false;
      }
      
      // Check activity type
      if (input.activityType !== 'mixed' && activity.category !== input.activityType) {
        return false;
      }
      
      // Check equipment constraints
      if (input.equipment === 'none' && activity.equipment.length > 0) {
        return false;
      }
      
      if (input.equipment === 'minimal' && activity.equipment.length > 2) {
        return false;
      }
      
      return true;
    });
  }

  private getStandards(standardIds: string[]): Standard[] {
    return this.standards.filter(s => standardIds.includes(s.id));
  }

  private selectWarmup(input: GeneratorInput): LessonBlock {
    const appropriate = this.warmups.filter(w => 
      w.gradeLevel.includes(input.gradeLevel)
    );
    
    const selected = appropriate[Math.floor(Math.random() * appropriate.length)] || this.warmups[0];
    
    return {
      name: selected.name,
      duration: `${selected.duration} minutes`,
      description: selected.description,
      instructions: selected.movements.map((m: string) => `Perform ${m}`),
      modifications: this.getWarmupModifications(input.gradeLevel)
    };
  }

  private generateSkillFocus(input: GeneratorInput, activities: Activity[]): LessonBlock {
    const skills = this.determineSkillFocus(input, activities);
    
    return {
      name: skills.name,
      duration: '8-10 minutes',
      description: skills.description,
      instructions: skills.instructions,
      equipment: skills.equipment,
      modifications: [
        'Adjust distance/height based on ability',
        'Provide visual demonstrations',
        'Use peer helpers for support'
      ]
    };
  }

  private selectMainActivities(input: GeneratorInput, activities: Activity[]): LessonBlock[] {
    const mainDuration = input.duration - 20; // Minus warmup, skill, cooldown
    const selected: LessonBlock[] = [];
    let remainingTime = mainDuration;
    
    // Sort by relevance to standards
    const sorted = activities.sort((a, b) => {
      const aRelevance = a.standards.filter(s => input.standards.includes(s)).length;
      const bRelevance = b.standards.filter(s => input.standards.includes(s)).length;
      return bRelevance - aRelevance;
    });
    
    // Select activities
    for (const activity of sorted) {
      if (remainingTime >= activity.duration) {
        selected.push(this.activityToLessonBlock(activity, input));
        remainingTime -= activity.duration;
        
        if (selected.length >= 3 || remainingTime < 5) break;
      }
    }
    
    // Add fun options modifications
    if (input.funOptions.includes('music')) {
      selected.forEach(block => {
        block.instructions.push('Play upbeat music throughout the activity');
      });
    }
    
    if (input.funOptions.includes('stations')) {
      selected.forEach(block => {
        block.instructions.unshift('Set up as a station in the rotation');
      });
    }
    
    return selected;
  }

  private selectCooldown(input: GeneratorInput): LessonBlock {
    const appropriate = this.cooldowns.filter(c => 
      c.gradeLevel.includes(input.gradeLevel)
    );
    
    const selected = appropriate[Math.floor(Math.random() * appropriate.length)] || this.cooldowns[0];
    
    return {
      name: selected.name,
      duration: `${selected.duration} minutes`,
      description: selected.description,
      instructions: selected.movements.map((m: string) => `Guide students through ${m}`),
      modifications: [
        'Allow students to sit if needed',
        'Provide quiet space for reflection',
        'Use calming music'
      ]
    };
  }

  private activityToLessonBlock(activity: Activity, input: GeneratorInput): LessonBlock {
    const block: LessonBlock = {
      name: activity.name,
      duration: `${activity.duration} minutes`,
      description: activity.description,
      instructions: [...activity.instructions],
      equipment: activity.equipment,
      modifications: activity.variations,
      safetyNotes: []
    };
    
    // Add theme if requested
    if (input.funOptions.includes('themes')) {
      const themes = ['Superheroes', 'Animals', 'Space', 'Under the Sea'];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      block.name = `${theme} ${block.name}`;
      block.instructions.unshift(`Today's theme: ${theme} - encourage creative interpretation!`);
    }
    
    // Add challenges if requested
    if (input.funOptions.includes('challenges')) {
      block.instructions.push('Add team challenges: Which group can complete the most rounds?');
    }
    
    return block;
  }

  private generateTitle(input: GeneratorInput, activities: LessonBlock[]): string {
    const themes = {
      'games': 'Game Day',
      'fitness': 'Fitness Challenge',
      'dance': 'Movement & Rhythm',
      'cooperative': 'Team Building',
      'individual': 'Skill Development',
      'mixed': 'PE Adventure'
    };
    
    const base = themes[input.activityType];
    const main = activities[0]?.name || 'Activities';
    
    return `${base}: ${main} & More`;
  }

  private generateObjective(input: GeneratorInput, standards: Standard[]): string {
    const objectives = {
      'K-2': {
        'S1': 'Students will demonstrate basic locomotor skills and body control',
        'S3': 'Students will engage in moderate physical activity and identify body responses',
        'S4': 'Students will follow rules and work cooperatively with peers',
        'S5': 'Students will express enjoyment in movement activities'
      },
      '3-5': {
        'S1': 'Students will apply sport-specific skills in modified game situations',
        'S2': 'Students will demonstrate basic strategies in small-sided games',
        'S3': 'Students will identify fitness components and set personal goals',
        'S4': 'Students will demonstrate good sportsmanship and teamwork'
      },
      '6-8': {
        'S1': 'Students will execute advanced techniques with consistency',
        'S2': 'Students will analyze and apply tactical decisions',
        'S3': 'Students will design and implement fitness improvement strategies',
        'S4': 'Students will demonstrate leadership and conflict resolution'
      }
    };
    
    const gradeObjectives = objectives[input.gradeLevel];
    const primary = standards[0]?.id || 'S1';
    
    return gradeObjectives[primary] || gradeObjectives['S1'];
  }

  private generateMaterials(input: GeneratorInput, activities: LessonBlock[]): string[] {
    const materials = new Set<string>();
    
    // Add basic equipment based on level
    if (input.equipment === 'full') {
      materials.add('Cones (20+)');
      materials.add('Various balls');
      materials.add('Jump ropes');
      materials.add('Mats');
    } else if (input.equipment === 'basic') {
      materials.add('Cones (10)');
      materials.add('Playground balls (5)');
    } else if (input.equipment === 'minimal') {
      materials.add('Cones or markers (5)');
    }
    
    // Add activity-specific equipment
    activities.forEach(activity => {
      activity.equipment?.forEach(item => materials.add(item));
    });
    
    // Add fun options equipment
    if (input.funOptions.includes('music')) {
      materials.add('Music player/speaker');
    }
    
    if (input.funOptions.includes('stations')) {
      materials.add('Station cards/signs');
    }
    
    return Array.from(materials);
  }

  private generateAssessments(input: GeneratorInput): string[] {
    const assessments = {
      'K-2': [
        'Teacher observation of skill performance',
        'Thumbs up/down self-assessment',
        'Simple exit ticket with faces',
        'Peer high-fives for effort'
      ],
      '3-5': [
        'Skill demonstration rubric',
        'Peer assessment checklist',
        'Self-reflection journal',
        'Goal-setting worksheet'
      ],
      '6-8': [
        'Performance analysis rubric',
        'Video self-assessment',
        'Written strategy reflection',
        'Fitness improvement tracking'
      ]
    };
    
    return assessments[input.gradeLevel];
  }

  private generateDifferentiation(input: GeneratorInput) {
    return {
      advanced: [
        'Add complexity to movement patterns',
        'Provide leadership roles',
        'Increase distance/speed/repetitions',
        'Challenge with additional rules'
      ],
      support: [
        'Reduce distance/speed requirements',
        'Provide visual demonstrations',
        'Allow modified movements',
        'Pair with supportive partner'
      ],
      ell: [
        'Use visual cues and demonstrations',
        'Pair with English-speaking buddy',
        'Provide movement vocabulary cards',
        'Use gestures and modeling'
      ]
    };
  }

  private generateSEL(input: GeneratorInput): string[] {
    const sel = {
      'K-2': [
        'Identifying feelings during activity',
        'Practicing taking turns',
        'Celebrating others\' success',
        'Using kind words'
      ],
      '3-5': [
        'Setting personal goals',
        'Managing frustration constructively',
        'Showing empathy for teammates',
        'Making responsible choices'
      ],
      '6-8': [
        'Demonstrating leadership',
        'Resolving conflicts peacefully',
        'Building positive relationships',
        'Reflecting on personal growth'
      ]
    };
    
    return sel[input.gradeLevel];
  }

  private generateCrossCurricular(input: GeneratorInput): string[] {
    const connections = {
      'K-2': [
        'Math: Counting repetitions and keeping score',
        'Science: Exploring how bodies move',
        'Language: Following multi-step directions'
      ],
      '3-5': [
        'Math: Calculating distances and angles',
        'Science: Understanding force and motion',
        'Social Studies: Games from different cultures'
      ],
      '6-8': [
        'Math: Analyzing statistics and probability',
        'Science: Biomechanics and physiology',
        'Health: Nutrition and wellness connections'
      ]
    };
    
    return connections[input.gradeLevel];
  }

  private generateSafety(input: GeneratorInput, activities: LessonBlock[]): string[] {
    const safety = [
      'Check playing area for hazards',
      'Ensure adequate spacing between students',
      'Review activity rules before starting',
      'Monitor for signs of fatigue or overexertion'
    ];
    
    if (input.environment === 'outdoor') {
      safety.push('Check weather conditions');
      safety.push('Ensure students have water');
      safety.push('Apply sunscreen if needed');
    }
    
    if (input.activityType === 'fitness') {
      safety.push('Emphasize proper form over speed');
      safety.push('Allow rest breaks as needed');
    }
    
    return safety;
  }

  private generateTakeHome(input: GeneratorInput): string {
    const challenges = {
      'K-2': 'Practice your favorite movement from today for 5 minutes each day!',
      '3-5': 'Create a new variation of today\'s game and teach it to your family!',
      '6-8': 'Track your physical activity for the week and set a personal goal!'
    };
    
    return challenges[input.gradeLevel];
  }

  private determineSkillFocus(input: GeneratorInput, activities: Activity[]): any {
    const skillsByType = {
      'games': {
        name: 'Game Skills Practice',
        description: 'Develop skills needed for main activities',
        instructions: [
          'Practice passing and receiving',
          'Work on spatial awareness',
          'Develop quick decision making'
        ],
        equipment: ['balls', 'cones']
      },
      'fitness': {
        name: 'Fitness Fundamentals',
        description: 'Build strength and endurance basics',
        instructions: [
          'Demonstrate proper form for exercises',
          'Practice pacing strategies',
          'Build core stability'
        ],
        equipment: ['mats']
      },
      'dance': {
        name: 'Rhythm and Coordination',
        description: 'Develop timing and body control',
        instructions: [
          'Practice basic rhythm patterns',
          'Work on coordination exercises',
          'Explore creative movement'
        ],
        equipment: ['music player']
      },
      'cooperative': {
        name: 'Communication Skills',
        description: 'Build teamwork foundations',
        instructions: [
          'Practice clear communication',
          'Develop trust activities',
          'Work on group problem-solving'
        ],
        equipment: []
      },
      'individual': {
        name: 'Personal Best Practice',
        description: 'Focus on individual skill improvement',
        instructions: [
          'Set personal goals',
          'Practice targeted skills',
          'Track improvement'
        ],
        equipment: ['cones', 'balls']
      },
      'mixed': {
        name: 'Multi-Skill Development',
        description: 'Variety of movement patterns',
        instructions: [
          'Practice different movement skills',
          'Combine movements in sequences',
          'Apply skills in various contexts'
        ],
        equipment: ['various']
      }
    };
    
    return skillsByType[input.activityType];
  }

  private getWarmupModifications(gradeLevel: string): string[] {
    const mods = {
      'K-2': [
        'Use animal movements for engagement',
        'Keep instructions simple',
        'Use music for timing'
      ],
      '3-5': [
        'Allow student leaders',
        'Add complexity progressively',
        'Include sport-specific movements'
      ],
      '6-8': [
        'Student-designed warm-ups',
        'Include dynamic stretching',
        'Sport-specific preparation'
      ]
    };
    
    return mods[gradeLevel] || mods['3-5'];
  }

  private generateId(): string {
    return `pb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}