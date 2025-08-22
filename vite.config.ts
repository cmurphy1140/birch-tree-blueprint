import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        playbook: resolve(__dirname, 'playbook.html')
      }
    }
  },
  publicDir: 'public'
});