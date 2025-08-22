import type { GeneratorInput, Playbook, LessonBlock } from '../types';

export class DeterministicGenerator {
  private activities: any[] = [];
  private standards: any[] = [];

  constructor() {
    this.loadData();
  }

  private async loadData() {
    try {
      const [activitiesRes, standardsRes] = await Promise.all([
        fetch('/data/activities.json'),
        fetch('/data/standards.json')
      ]);
      
      this.activities = await activitiesRes.json();
      this.standards = await standardsRes.json();
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async generate(input: GeneratorInput): Promise<Playbook> {
    // Ensure data is loaded
    if (this.activities.length === 0) {
      await this.loadData();
    }

    const playbook: Playbook = {
      id: this.generateId(),
      title: this.generateTitle(input),
      overview: this.generateOverview(input),
      goals: this.generateGoals(input),
      lessons: this.generateLessons(input),
      metadata: {
        gradeLevel: input.gradeLevel,
        duration: input.duration,
        environment: input.environment,
        standards: input.standards,
        equipmentLevel: input.equipmentLevel || 'standard'
      },
      createdAt: new Date().toISOString()
    };

    return playbook;
  }

  private generateId(): string {
    return `pb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTitle(input: GeneratorInput): string {
    const gradeName = input.gradeLevel;
    const focusAreas = this.getStandardNames(input.standards);
    return `${gradeName} ${input.environment === 'outdoor' ? 'Outdoor' : 'Indoor'} PE: ${focusAreas.join(' & ')}`;
  }

  private generateOverview(input: GeneratorInput): string {
    const weeks = input.duration === 60 ? '2 weeks' : '1 week';
    const focusAreas = this.getStandardNames(input.standards);
    return `This ${weeks} playbook for grades ${input.gradeLevel} focuses on ${focusAreas.join(', ')} in an ${input.environment} setting. Each lesson builds progressively on skills while maintaining engagement through varied activities.`;
  }

  private generateGoals(input: GeneratorInput): string[] {
    const goals: string[] = [];
    
    // Standard-based goals
    input.standards.forEach(stdId => {
      const standard = this.standards.find(s => s.id === stdId);
      if (standard) {
        goals.push(`Develop ${standard.name.toLowerCase()} skills`);
      }
    });

    // Grade-specific goals
    if (input.gradeLevel === 'K-2') {
      goals.push('Build fundamental movement patterns');
      goals.push('Develop spatial awareness and body control');
    } else if (input.gradeLevel === '3-5') {
      goals.push('Refine movement skills and combinations');
      goals.push('Introduce strategic thinking in activities');
    } else {
      goals.push('Apply skills in complex game situations');
      goals.push('Develop leadership and teamwork abilities');
    }

    // Activity preference goals
    if (input.activityPreferences?.teamBased) {
      goals.push('Foster collaboration and communication');
    }
    if (input.activityPreferences?.competitive) {
      goals.push('Build healthy competition and sportsmanship');
    }
    if (input.activityPreferences?.creative) {
      goals.push('Encourage creative movement and expression');
    }

    return goals.slice(0, 5); // Limit to 5 goals
  }

  private generateLessons(input: GeneratorInput): LessonBlock[] {
    const numLessons = input.duration === 60 ? 10 : 5;
    const lessons: LessonBlock[] = [];

    for (let i = 0; i < numLessons; i++) {
      lessons.push(this.generateLesson(input, i + 1));
    }

    return lessons;
  }

  private generateLesson(input: GeneratorInput, lessonNumber: number): LessonBlock {
    const warmUpActivities = this.filterActivities('warmup', input);
    const mainActivities = this.filterActivities('main', input);
    const skillActivities = this.filterActivities('skill', input);

    // Select random activities
    const warmUp = this.selectRandom(warmUpActivities);
    const mainActivity = this.selectRandom(mainActivities);
    const skills = this.selectMultiple(skillActivities, 3);

    const lesson: LessonBlock = {
      title: `Lesson ${lessonNumber}: ${this.getLessonFocus(input, lessonNumber)}`,
      warmUp: {
        description: warmUp?.description || 'Dynamic stretching and light jogging around the space',
        duration: Math.floor(input.duration * 0.15),
        equipment: warmUp?.equipment || []
      },
      skillFocus: {
        description: this.generateSkillDescription(skills, input),
        duration: Math.floor(input.duration * 0.25),
        skills: skills.map(s => s.name)
      },
      mainActivity: {
        name: mainActivity?.name || 'Team Activity',
        description: mainActivity?.description || 'Engaging group activity focusing on lesson objectives',
        duration: Math.floor(input.duration * 0.4),
        rules: mainActivity?.rules || [
          'Respect all participants',
          'Follow safety guidelines',
          'Rotate positions fairly',
          'Encourage teammates'
        ],
        equipment: mainActivity?.equipment || ['cones', 'balls']
      },
      differentiation: {
        easier: this.generateEasierModification(input, mainActivity),
        harder: this.generateHarderModification(input, mainActivity)
      },
      closure: {
        description: 'Group reflection circle discussing today\'s achievements and challenges',
        duration: Math.floor(input.duration * 0.1),
        reflection: this.generateReflectionQuestion(input, lessonNumber)
      },
      assessment: {
        formative: 'Teacher observation of skill execution and peer interaction',
        summative: 'Skill demonstration and self-assessment rubric'
      },
      safety: this.generateSafetyConsiderations(input, mainActivity),
      socialEmotional: this.generateSELFocus(lessonNumber)
    };

    return lesson;
  }

  private filterActivities(type: string, input: GeneratorInput): any[] {
    return this.activities.filter(activity => {
      // Filter by type
      if (type === 'warmup' && activity.type !== 'warmup') return false;
      if (type === 'main' && !['game', 'activity'].includes(activity.type)) return false;
      if (type === 'skill' && activity.type !== 'skill') return false;

      // Filter by grade level
      if (activity.gradeLevel && !activity.gradeLevel.includes(input.gradeLevel)) return false;

      // Filter by environment
      if (activity.environment && activity.environment !== input.environment) return false;

      // Filter by equipment level
      if (input.equipmentLevel === 'minimal' && activity.equipment?.length > 2) return false;
      if (input.equipmentLevel === 'standard' && activity.equipment?.length > 5) return false;

      return true;
    });
  }

  private selectRandom<T>(array: T[]): T | null {
    if (array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  private selectMultiple<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  private getStandardNames(standardIds: string[]): string[] {
    return standardIds.map(id => {
      const standard = this.standards.find(s => s.id === id);
      return standard?.name || id;
    });
  }

  private getLessonFocus(_input: GeneratorInput, lessonNumber: number): string {
    const focuses = [
      'Building Foundations',
      'Skill Development',
      'Application Practice',
      'Game Strategies',
      'Assessment & Review'
    ];
    
    const cycleLength = focuses.length;
    return focuses[(lessonNumber - 1) % cycleLength];
  }

  private generateSkillDescription(skills: any[], _input: GeneratorInput): string {
    if (skills.length === 0) {
      return 'Practice fundamental movement skills through structured activities';
    }
    
    const skillNames = skills.map(s => s.name).join(', ');
    return `Students will practice ${skillNames} through progressive drills and partner activities`;
  }

  private generateEasierModification(_input: GeneratorInput, _activity: any): string {
    const modifications = [
      'Reduce distance or playing area',
      'Allow additional touches or attempts',
      'Use lighter or softer equipment',
      'Pair with a skilled partner for support',
      'Simplify rules or scoring system'
    ];
    
    return this.selectRandom(modifications) || modifications[0];
  }

  private generateHarderModification(_input: GeneratorInput, _activity: any): string {
    const modifications = [
      'Increase distance or expand playing area',
      'Add time constraints or speed requirements',
      'Introduce defensive pressure',
      'Require specific techniques or form',
      'Add complex scoring or bonus challenges'
    ];
    
    return this.selectRandom(modifications) || modifications[0];
  }

  private generateReflectionQuestion(_input: GeneratorInput, lessonNumber: number): string {
    const questions = [
      'What skill did you improve most today?',
      'How did you help your teammates succeed?',
      'What strategy worked best in the main activity?',
      'What would you do differently next time?',
      'How did you show good sportsmanship today?'
    ];
    
    return questions[(lessonNumber - 1) % questions.length];
  }

  private generateSafetyConsiderations(input: GeneratorInput, activity: any): string[] {
    const safety: string[] = [];
    
    if (input.environment === 'outdoor') {
      safety.push('Check playing surface for hazards');
      safety.push('Ensure adequate hydration breaks');
    }
    
    if (activity?.equipment?.includes('balls')) {
      safety.push('Maintain safe spacing during throwing activities');
    }
    
    safety.push('Proper warm-up before intense activity');
    safety.push('Monitor for signs of fatigue or overexertion');
    
    return safety.slice(0, 3);
  }

  private generateSELFocus(lessonNumber: number): string {
    const selFocuses = [
      'Building confidence through skill mastery',
      'Developing empathy by supporting classmates',
      'Practicing emotional regulation during competition',
      'Fostering resilience through challenging activities',
      'Cultivating teamwork and communication skills'
    ];
    
    return selFocuses[(lessonNumber - 1) % selFocuses.length];
  }
}