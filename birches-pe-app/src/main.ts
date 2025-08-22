import './styles/app.css';
import { GeneratorUI } from './ui/generator';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (app) {
    const generatorUI = new GeneratorUI(app);
    (window as any).generatorUI = generatorUI;
  }

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('Service Worker registration failed:', err);
    });
  }
});