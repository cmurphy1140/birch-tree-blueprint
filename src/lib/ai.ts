import type { GeneratorInput, Playbook } from '../types';

export interface AIConfig {
  apiKey: string;
  provider: string;
}

export class AIGenerator {
  async generate(_input: GeneratorInput, _config: AIConfig): Promise<Playbook> {
    // For now, throw an error indicating AI is not yet implemented
    // This will be replaced with actual AI implementation later
    throw new Error('AI generation not yet implemented. Please use deterministic mode.');
  }
}