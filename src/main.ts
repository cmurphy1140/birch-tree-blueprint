import './styles/app.css';
import { GeneratorUI } from './ui/generator';

console.log('Main.ts loaded');

// Initialize app immediately (Vite loads modules after DOM is ready)
const app = document.querySelector<HTMLDivElement>('#app');
console.log('App element found:', app);

if (app) {
  console.log('Initializing GeneratorUI...');
  const generatorUI = new GeneratorUI(app);
  (window as any).generatorUI = generatorUI;
  console.log('GeneratorUI initialized');
} else {
  console.error('App element #app not found!');
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.log('Service Worker registration failed:', err);
  });
}