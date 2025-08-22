import './styles/app.css';
import { GeneratorUI } from './ui/generator';

console.log('Generator.ts loaded');

// Initialize generator app
const app = document.querySelector<HTMLDivElement>('#generator-app');
console.log('Generator app element found:', app);

if (app) {
  console.log('Initializing GeneratorUI...');
  const generatorUI = new GeneratorUI(app);
  (window as any).generatorUI = generatorUI;
  console.log('GeneratorUI initialized');
} else {
  console.error('Generator app element #generator-app not found!');
}