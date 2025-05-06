import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    postcss: {
      plugins: []
    }
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      VITE_WIDGET_VERSION: JSON.stringify(process.env.npm_package_version)
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'NNIA',
      formats: ['umd', 'es'],
      fileName: (format) => `nia-chat-widget.${format === 'es' ? 'mjs' : 'umd.js'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'axios'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'axios': 'axios'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'nia-style.css';
          return assetInfo.name;
        },
        manualChunks: undefined
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    minify: 'terser',
    sourcemap: true,
    target: 'es2015'
  },
  publicDir: 'public',
  server: {
    port: 3000,
    strictPort: true,
    cors: true
  }
}); 