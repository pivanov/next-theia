import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import postcssImport from 'postcss-import';

// Check if preloader exists, and create a fallback if necessary
const preloaderPath = path.resolve(__dirname, '../node_modules/@theia/core/lib/browser/preloader.js');
if (!fs.existsSync(preloaderPath)) {
  fs.writeFileSync(preloaderPath, 'export default {};');
}

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport({
          resolve(id, basedir, importOptions) {
            console.log('@@@@ id', id);
            if (id.startsWith('~')) {
              return path.resolve(__dirname, '../node_modules', id.slice(1));
            }
            return id;
          }
        }),
        require('autoprefixer')()
      ]
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../public/theia/assets'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src-gen/frontend/index.ts'),
      output: {
        entryFileNames: 'index.js',
      },
      external: [
        'es6-promise/auto',
        'reflect-metadata',
        'setimmediate',
        'inversify',
        '@phosphor/widgets/style/index.css',
        '@phosphor/widgets/style/widget.css',
        '@phosphor/widgets/style/commandpalette.css',
        '@phosphor/widgets/style/dockpanel.css',
        '@phosphor/widgets/style/menu.css',
        '@phosphor/widgets/style/menubar.css',
        '@phosphor/widgets/style/scrollbar.css',
        '@phosphor/widgets/style/splitpanel.css',
        '@phosphor/widgets/style/tabbar.css',
        '@phosphor/widgets/style/tabpanel.css'
      ]
    }
  },
  resolve: {
    alias: {
      '@theia': path.resolve(__dirname, '../node_modules/@theia'),
      'font-awesome': path.resolve(__dirname, '../node_modules/font-awesome'),
      'widget': path.resolve(__dirname, '../node_modules/widget'),
      '~@phosphor/widgets': path.resolve(__dirname, '../node_modules/@phosphor/widgets')
    },
    extensions: ['.ts', '.js']
  }
});
