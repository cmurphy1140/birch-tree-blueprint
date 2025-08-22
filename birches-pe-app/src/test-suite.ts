// Comprehensive Test Suite for Birches PE App
import type { GeneratorInput } from './types';
import { DeterministicGenerator } from './lib/generator';

export class TestSuite {
  private results: { name: string; passed: boolean; error?: string }[] = [];
  
  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Comprehensive Test Suite\n');
    
    // Test 1: Data Loading
    await this.testDataLoading();
    
    // Test 2: Generator Initialization
    await this.testGeneratorInit();
    
    // Test 3: Basic Generation
    await this.testBasicGeneration();
    
    // Test 4: Form Data Collection
    await this.testFormDataCollection();
    
    // Test 5: Navigation
    await this.testNavigation();
    
    // Print results
    this.printResults();
  }
  
  private async testDataLoading() {
    console.log('📊 Test 1: Data Loading');
    
    try {
      // Test standards loading
      const standardsRes = await fetch('/data/standards.json');
      const standards = await standardsRes.json();
      
      if (!Array.isArray(standards)) {
        throw new Error('Standards is not an array');
      }
      
      if (standards.length === 0) {
        throw new Error('Standards array is empty');
      }
      
      if (!standards[0].id || !standards[0].name) {
        throw new Error('Standards missing required fields');
      }
      
      this.addResult('Standards data structure', true);
      console.log(`✅ Loaded ${standards.length} standards`);
      
      // Test activities loading
      const activitiesRes = await fetch('/data/activities.json');
      const activities = await activitiesRes.json();
      
      if (!activities.activities || !Array.isArray(activities.activities)) {
        throw new Error('Activities not properly structured');
      }
      
      this.addResult('Activities data structure', true);
      console.log(`✅ Loaded ${activities.activities.length} activities`);
      
    } catch (error: any) {
      this.addResult('Data loading', false, error?.message || 'Unknown error');
      console.error('❌ Data loading failed:', error);
    }
  }
  
  private async testGeneratorInit() {
    console.log('\n🔧 Test 2: Generator Initialization');
    
    try {
      new DeterministicGenerator();
      
      // Wait for data to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.addResult('Generator initialization', true);
      console.log('✅ Generator initialized');
      
    } catch (error: any) {
      this.addResult('Generator initialization', false, error?.message || 'Unknown error');
      console.error('❌ Generator init failed:', error);
    }
  }
  
  private async testBasicGeneration() {
    console.log('\n⚡ Test 3: Basic Playbook Generation');
    
    try {
      const generator = new DeterministicGenerator();
      
      const testInput: GeneratorInput = {
        gradeLevel: 'K-2',
        duration: 45,
        environment: 'indoor',
        standards: ['S1', 'S2'],
        equipmentLevel: 'standard',
        activityPreferences: {
          teamBased: true,
          competitive: false,
          creative: true
        }
      };
      
      console.log('📝 Test input:', testInput);
      
      const playbook = await generator.generate(testInput);
      
      if (!playbook) {
        throw new Error('No playbook returned');
      }
      
      if (!playbook.id || !playbook.title) {
        throw new Error('Playbook missing required fields');
      }
      
      if (!playbook.lessons || playbook.lessons.length === 0) {
        throw new Error('Playbook has no lessons');
      }
      
      this.addResult('Playbook generation', true);
      console.log('✅ Generated playbook:', {
        id: playbook.id,
        title: playbook.title,
        lessons: playbook.lessons.length
      });
      
      // Test lesson structure
      const lesson = playbook.lessons[0];
      if (!lesson.warmUp || !lesson.mainActivity || !lesson.closure) {
        throw new Error('Lesson missing required components');
      }
      
      this.addResult('Lesson structure', true);
      console.log('✅ Lesson structure valid');
      
    } catch (error: any) {
      this.addResult('Basic generation', false, error?.message || 'Unknown error');
      console.error('❌ Generation failed:', error);
    }
  }
  
  private async testFormDataCollection() {
    console.log('\n📋 Test 4: Form Data Collection');
    
    try {
      // Simulate form data
      const form = document.createElement('form');
      
      // Add grade level
      const gradeSelect = document.createElement('select');
      gradeSelect.name = 'gradeLevel';
      const option = document.createElement('option');
      option.value = 'K-2';
      option.selected = true;
      gradeSelect.appendChild(option);
      form.appendChild(gradeSelect);
      
      // Add duration
      const durationSelect = document.createElement('select');
      durationSelect.name = 'duration';
      const durationOption = document.createElement('option');
      durationOption.value = '45';
      durationOption.selected = true;
      durationSelect.appendChild(durationOption);
      form.appendChild(durationSelect);
      
      // Add environment
      const envRadio = document.createElement('input');
      envRadio.type = 'radio';
      envRadio.name = 'environment';
      envRadio.value = 'indoor';
      envRadio.checked = true;
      form.appendChild(envRadio);
      
      // Add standards
      const standardCheck1 = document.createElement('input');
      standardCheck1.type = 'checkbox';
      standardCheck1.name = 'standards';
      standardCheck1.value = 'S1';
      standardCheck1.checked = true;
      form.appendChild(standardCheck1);
      
      const standardCheck2 = document.createElement('input');
      standardCheck2.type = 'checkbox';
      standardCheck2.name = 'standards';
      standardCheck2.value = 'S2';
      standardCheck2.checked = true;
      form.appendChild(standardCheck2);
      
      // Test FormData collection
      const formData = new FormData(form);
      const standards = formData.getAll('standards');
      
      if (standards.length !== 2) {
        throw new Error(`Expected 2 standards, got ${standards.length}`);
      }
      
      this.addResult('Form data collection', true);
      console.log('✅ Form data collected correctly');
      
    } catch (error: any) {
      this.addResult('Form data collection', false, error?.message || 'Unknown error');
      console.error('❌ Form data collection failed:', error);
    }
  }
  
  private async testNavigation() {
    console.log('\n🧭 Test 5: Navigation');
    
    try {
      // Test if we can create a URL with state
      const playbook = {
        id: 'test-123',
        title: 'Test Playbook',
        lessons: []
      };
      
      const state = {
        playbook,
        userInput: {
          gradeLevel: 'K-2',
          duration: 45
        }
      };
      
      // Store in sessionStorage for page transition
      sessionStorage.setItem('currentPlaybook', JSON.stringify(state));
      
      // Test retrieval
      const stored = sessionStorage.getItem('currentPlaybook');
      if (!stored) {
        throw new Error('Failed to store playbook');
      }
      
      const retrieved = JSON.parse(stored);
      if (retrieved.playbook.id !== 'test-123') {
        throw new Error('Failed to retrieve playbook correctly');
      }
      
      this.addResult('Navigation state management', true);
      console.log('✅ Navigation state works');
      
    } catch (error: any) {
      this.addResult('Navigation', false, error?.message || 'Unknown error');
      console.error('❌ Navigation failed:', error);
    }
  }
  
  private addResult(name: string, passed: boolean, error?: string) {
    this.results.push({ name, passed, error });
  }
  
  private printResults() {
    console.log('\n=====================================');
    console.log('📊 TEST RESULTS');
    console.log('=====================================');
    
    let passed = 0;
    let failed = 0;
    
    this.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}${result.error ? ': ' + result.error : ''}`);
      
      if (result.passed) passed++;
      else failed++;
    });
    
    console.log('\n-------------------------------------');
    console.log(`Total: ${this.results.length} tests`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log('=====================================');
    
    // Return results for external use
    return {
      passed,
      failed,
      total: this.results.length,
      results: this.results
    };
  }
}

// Export for use in browser console
(window as any).TestSuite = TestSuite;