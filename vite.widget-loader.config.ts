import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/widget-loader.js'),
      name: 'NNIALoader',
      fileName: (format) => `widget-loader.${format === 'es' ? 'mjs' : 'umd.js'}`
    },
    rollupOptions: {
      output: {
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'nia-chat-widget.css';
          return assetInfo.name;
        }
      }
    }
  }
}); 