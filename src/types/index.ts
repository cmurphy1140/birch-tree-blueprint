// Core Types for Birches PE Playbook Generator

export interface GeneratorInput {
  gradeLevel: 'K-2' | '3-5' | '6-8';
  duration: 30 | 45 | 60;
  environment: 'indoor' | 'outdoor';
  standards: string[];
  activityType: 'games' | 'fitness' | 'dance' | 'cooperative' | 'individual' | 'mixed';
  equipment: 'full' | 'basic' | 'minimal' | 'none';
  funOptions: Array<'music' | 'themes' | 'challenges' | 'stations'>;
}

export interface LessonBlock {
  name: string;
  duration: string;
  description: string;
  instructions: string[];
  equipment?: string[];
  modifications?: string[];
  safetyNotes?: string[];
}

export interface Playbook {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  input: GeneratorInput;
  gradeLevel: string;
  duration: number;
  environment: string;
  standards: Standard[];
  objective: string;
  materials: string[];
  warmup: LessonBlock;
  skillFocus: LessonBlock;
  mainActivity: LessonBlock[];
  cooldown: LessonBlock;
  assessments: string[];
  differentiation: {
    advanced: string[];
    support: string[];
    ell: string[];
  };
  socialEmotional: string[];
  crossCurricular: string[];
  takeHome?: string;
  safetyConsiderations: string[];
  metadata: {
    generated: 'deterministic' | 'ai' | 'blend';
    version: string;
    favorite?: boolean;
  };
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  gradeLevel: string[];
  environment: string[];
  equipment: string[];
  duration: number;
  description: string;
  instructions: string[];
  variations: string[];
  standards: string[];
  keywords: string[];
}

export interface Standard {
  id: string;
  category: string;
  name: string;
  description: string;
  gradeLevel: string[];
  indicators: string[];
}

export interface AppSettings {
  aiProvider: 'anthropic' | 'openai' | 'none';
  apiKey?: string;
  generationMode: 'deterministic' | 'ai' | 'blend';
  blendRatio?: number;
  theme: 'light' | 'dark' | 'high-contrast';
  reducedMotion: boolean;
  autoSave: boolean;
}

export interface DiagnosticsData {
  serviceWorker: {
    status: 'active' | 'inactive' | 'error';
    cacheVersion: string;
    cacheSize: number;
  };
  storage: {
    playbooksCount: number;
    storageUsed: number;
    storageAvailable: number;
  };
  data: {
    activitiesLoaded: boolean;
    standardsLoaded: boolean;
    activitiesCount: number;
    standardsCount: number;
  };
  exports: {
    pdfSupported: boolean;
    docxSupported: boolean;
    lastExportStatus: string;
  };
  ai: {
    configured: boolean;
    provider: string;
    lastGenerationStatus: string;
  };
  performance: {
    bundleSize: number;
    loadTime: number;
    renderTime: number;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'markdown' | 'csv' | 'json';
  includeMetadata?: boolean;
  includeAssessments?: boolean;
  includeModifications?: boolean;
}