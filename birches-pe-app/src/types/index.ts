// Core Types for PE Playbook Generator

// Main Input Types
export interface GeneratorInput {
  gradeLevel: 'K-2' | '3-5' | '6-8';
  duration: 30 | 45 | 60;
  environment: 'indoor' | 'outdoor';
  standards: string[];
  equipmentLevel?: 'minimal' | 'standard' | 'full';
  activityPreferences?: {
    teamBased?: boolean;
    competitive?: boolean;
    creative?: boolean;
  };
}

export interface LessonBlock {
  title: string;
  warmUp: {
    description: string;
    duration: number;
    equipment: string[];
  };
  skillFocus: {
    description: string;
    duration: number;
    skills: string[];
  };
  mainActivity: {
    name: string;
    description: string;
    duration: number;
    rules: string[];
    equipment: string[];
  };
  differentiation: {
    easier: string;
    harder: string;
  };
  closure: {
    description: string;
    duration: number;
    reflection: string;
  };
  assessment: {
    formative: string;
    summative: string;
  };
  safety: string[];
  socialEmotional?: string;
}

export interface Playbook {
  id: string;
  title: string;
  overview: string;
  goals: string[];
  lessons: LessonBlock[];
  metadata: {
    gradeLevel: string;
    duration: number;
    environment: string;
    standards: string[];
    equipmentLevel: string;
  };
  createdAt: string;
  modifiedAt?: string;
}

export interface Activity {
  id: string;
  name: string;
  category: 'warmup' | 'skill' | 'game' | 'cooldown';
  equipment: string[];
  duration: number; // minutes
  participants: {
    min: number;
    max: number;
  };
  ageGroup: string[];
  skills: string[];
  description: string;
  instructions: string[];
  variations: string[];
  safetyNotes: string[];
  standards: string[];
}

export interface PEStandard {
  id: string;
  category: string;
  subcategory: string;
  grade: string;
  description: string;
  keywords: string[];
}

export interface PlaybookConfig {
  duration: number; // total session duration in minutes
  participants: number;
  ageGroup: string;
  focus: string[];
  equipment: string[];
  space: 'indoor' | 'outdoor' | 'gymnasium' | 'field';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  objectives: string[];
}

export interface GeneratedPlaybook {
  id: string;
  config: PlaybookConfig;
  activities: Activity[];
  warmup: Activity[];
  main: Activity[];
  cooldown: Activity[];
  totalDuration: number;
  equipmentList: string[];
  standards: PEStandard[];
  generatedAt: Date;
  generationMode: 'deterministic' | 'ai';
  aiPrompt?: string;
  metadata: {
    difficulty: string;
    focus: string[];
    participantCount: number;
    estimatedPrep: number;
  };
}

export interface StoredPlaybook extends Playbook {
  name: string;
  tags: string[];
  favorite?: boolean;
}

export interface AIProvider {
  name: 'claude' | 'openai';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface AIGenerationRequest {
  provider: AIProvider;
  prompt: string;
  config: PlaybookConfig;
  availableActivities: Activity[];
  standards: PEStandard[];
}

export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'csv' | 'json';
  includeInstructions: boolean;
  includeStandards: boolean;
  includeEquipment: boolean;
  templateStyle: 'detailed' | 'summary' | 'lesson-plan';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultDuration: number;
  defaultParticipants: number;
  favoriteActivities: string[];
  aiProvider: AIProvider | null;
  autoSave: boolean;
  offlineMode: boolean;
}

export interface DiagnosticInfo {
  version: string;
  buildDate: string;
  environment: 'development' | 'production';
  serviceWorkerStatus: 'active' | 'inactive' | 'error';
  storageStatus: {
    available: boolean;
    used: number;
    quota: number;
  };
  cacheStatus: {
    installed: boolean;
    version: string;
    size: number;
  };
  lastSync: Date | null;
  errorLog: Array<{
    timestamp: Date;
    level: 'error' | 'warning' | 'info';
    message: string;
    stack?: string;
  }>;
}

export interface GenerationProgress {
  stage: 'analyzing' | 'selecting' | 'optimizing' | 'finalizing' | 'complete';
  progress: number; // 0-100
  message: string;
  estimatedTime?: number;
}

// Event Types
export type AppEvent = 
  | { type: 'playbook-generated'; data: GeneratedPlaybook }
  | { type: 'playbook-saved'; data: StoredPlaybook }
  | { type: 'playbook-deleted'; data: string }
  | { type: 'settings-updated'; data: Partial<AppSettings> }
  | { type: 'export-started'; data: { format: string; id: string } }
  | { type: 'export-completed'; data: { format: string; id: string; success: boolean } }
  | { type: 'error'; data: { message: string; code?: string } };

// Utility Types
export type ActivityCategory = Activity['category'];
export type AgeGroup = 'elementary' | 'middle' | 'high-school' | 'adult';
export type SkillFocus = 'cardiovascular' | 'strength' | 'flexibility' | 'coordination' | 'teamwork' | 'strategy';
export type Space = PlaybookConfig['space'];
export type Difficulty = PlaybookConfig['difficulty'];

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}

// Component Props Types
export interface PlaybookCardProps {
  playbook: StoredPlaybook;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string, format: ExportOptions['format']) => void;
}

export interface ActivityCardProps {
  activity: Activity;
  selected?: boolean;
  onSelect?: (id: string) => void;
  showFullDetails?: boolean;
}

export interface ConfigFormProps {
  config: Partial<PlaybookConfig>;
  onChange: (config: Partial<PlaybookConfig>) => void;
  onGenerate: (mode: 'deterministic' | 'ai') => void;
  isGenerating: boolean;
  progress?: GenerationProgress;
}