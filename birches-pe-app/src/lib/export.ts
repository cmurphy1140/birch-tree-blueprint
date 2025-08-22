import type { Playbook } from '../types';

export class ExportManager {
  async toPdf(_playbook: Playbook): Promise<void> {
    // Use browser print functionality
    window.print();
  }

  async toDocx(playbook: Playbook): Promise<Blob> {
    // Simplified DOCX generation (would normally use a library like docx)
    const content = this.generateDocxContent(playbook);
    return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }

  async toMarkdown(playbook: Playbook): Promise<Blob> {
    const markdown = this.generateMarkdown(playbook);
    return new Blob([markdown], { type: 'text/markdown' });
  }

  async toCsv(playbook: Playbook): Promise<Blob> {
    const csv = this.generateCsv(playbook);
    return new Blob([csv], { type: 'text/csv' });
  }

  private generateDocxContent(playbook: Playbook): string {
    // Simple text output for now (real implementation would use docx library)
    let content = `${playbook.title}\n\n`;
    content += `Grade Level: ${playbook.metadata.gradeLevel}\n`;
    content += `Duration: ${playbook.metadata.duration} minutes\n`;
    content += `Environment: ${playbook.metadata.environment}\n\n`;
    content += `Overview:\n${playbook.overview}\n\n`;
    content += `Goals:\n${playbook.goals.map(g => `- ${g}`).join('\n')}\n\n`;
    
    playbook.lessons.forEach((lesson, i) => {
      content += `\nLesson ${i + 1}: ${lesson.title}\n`;
      content += `\nWarm-up (${lesson.warmUp.duration} min):\n${lesson.warmUp.description}\n`;
      content += `\nSkill Focus (${lesson.skillFocus.duration} min):\n${lesson.skillFocus.description}\n`;
      content += `Skills: ${lesson.skillFocus.skills.join(', ')}\n`;
      content += `\nMain Activity (${lesson.mainActivity.duration} min): ${lesson.mainActivity.name}\n`;
      content += `${lesson.mainActivity.description}\n`;
      content += `Rules:\n${lesson.mainActivity.rules.map(r => `- ${r}`).join('\n')}\n`;
      content += `\nDifferentiation:\n`;
      content += `Easier: ${lesson.differentiation.easier}\n`;
      content += `Harder: ${lesson.differentiation.harder}\n`;
      content += `\nClosure (${lesson.closure.duration} min):\n${lesson.closure.description}\n`;
      content += `Reflection: ${lesson.closure.reflection}\n`;
      content += `\nAssessment:\n`;
      content += `Formative: ${lesson.assessment.formative}\n`;
      content += `Summative: ${lesson.assessment.summative}\n`;
      if (lesson.safety.length > 0) {
        content += `\nSafety:\n${lesson.safety.map(s => `- ${s}`).join('\n')}\n`;
      }
      if (lesson.socialEmotional) {
        content += `\nSocial-Emotional Learning:\n${lesson.socialEmotional}\n`;
      }
    });
    
    return content;
  }

  private generateMarkdown(playbook: Playbook): string {
    let md = `# ${playbook.title}\n\n`;
    md += `## Metadata\n\n`;
    md += `- **Grade Level:** ${playbook.metadata.gradeLevel}\n`;
    md += `- **Duration:** ${playbook.metadata.duration} minutes\n`;
    md += `- **Environment:** ${playbook.metadata.environment}\n`;
    md += `- **Standards:** ${playbook.metadata.standards.join(', ')}\n\n`;
    
    md += `## Overview\n\n${playbook.overview}\n\n`;
    md += `## Goals\n\n${playbook.goals.map(g => `- ${g}`).join('\n')}\n\n`;
    
    playbook.lessons.forEach((lesson, i) => {
      md += `## Lesson ${i + 1}: ${lesson.title}\n\n`;
      
      md += `### Warm-up (${lesson.warmUp.duration} min)\n\n`;
      md += `${lesson.warmUp.description}\n\n`;
      if (lesson.warmUp.equipment.length > 0) {
        md += `**Equipment:** ${lesson.warmUp.equipment.join(', ')}\n\n`;
      }
      
      md += `### Skill Focus (${lesson.skillFocus.duration} min)\n\n`;
      md += `${lesson.skillFocus.description}\n\n`;
      md += `**Skills:** ${lesson.skillFocus.skills.join(', ')}\n\n`;
      
      md += `### Main Activity (${lesson.mainActivity.duration} min): ${lesson.mainActivity.name}\n\n`;
      md += `${lesson.mainActivity.description}\n\n`;
      md += `**Rules:**\n${lesson.mainActivity.rules.map(r => `- ${r}`).join('\n')}\n\n`;
      if (lesson.mainActivity.equipment.length > 0) {
        md += `**Equipment:** ${lesson.mainActivity.equipment.join(', ')}\n\n`;
      }
      
      md += `### Differentiation\n\n`;
      md += `- **Easier:** ${lesson.differentiation.easier}\n`;
      md += `- **Harder:** ${lesson.differentiation.harder}\n\n`;
      
      md += `### Closure (${lesson.closure.duration} min)\n\n`;
      md += `${lesson.closure.description}\n\n`;
      md += `**Reflection:** ${lesson.closure.reflection}\n\n`;
      
      md += `### Assessment\n\n`;
      md += `- **Formative:** ${lesson.assessment.formative}\n`;
      md += `- **Summative:** ${lesson.assessment.summative}\n\n`;
      
      if (lesson.safety.length > 0) {
        md += `### Safety Considerations\n\n`;
        md += `${lesson.safety.map(s => `- ${s}`).join('\n')}\n\n`;
      }
      
      if (lesson.socialEmotional) {
        md += `### Social-Emotional Learning\n\n`;
        md += `${lesson.socialEmotional}\n\n`;
      }
    });
    
    return md;
  }

  private generateCsv(playbook: Playbook): string {
    const rows: string[][] = [];
    
    // Header
    rows.push(['Playbook Title', playbook.title]);
    rows.push(['Grade Level', playbook.metadata.gradeLevel]);
    rows.push(['Duration', playbook.metadata.duration.toString()]);
    rows.push(['Environment', playbook.metadata.environment]);
    rows.push(['Standards', playbook.metadata.standards.join('; ')]);
    rows.push([]);
    
    // Lessons
    rows.push(['Lesson', 'Component', 'Duration', 'Description', 'Details']);
    
    playbook.lessons.forEach((lesson, i) => {
      rows.push([
        `Lesson ${i + 1}`,
        'Warm-up',
        lesson.warmUp.duration.toString(),
        lesson.warmUp.description,
        lesson.warmUp.equipment.join(', ')
      ]);
      
      rows.push([
        '',
        'Skill Focus',
        lesson.skillFocus.duration.toString(),
        lesson.skillFocus.description,
        lesson.skillFocus.skills.join(', ')
      ]);
      
      rows.push([
        '',
        'Main Activity',
        lesson.mainActivity.duration.toString(),
        lesson.mainActivity.name,
        lesson.mainActivity.description
      ]);
      
      rows.push([
        '',
        'Closure',
        lesson.closure.duration.toString(),
        lesson.closure.description,
        lesson.closure.reflection
      ]);
    });
    
    // Convert to CSV string
    return rows.map(row => 
      row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }
}