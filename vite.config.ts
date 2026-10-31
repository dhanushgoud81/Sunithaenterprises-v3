import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { generateGalleriesManifest } from './scripts/generate-galleries.mjs';

function galleryWatcherPlugin(): Plugin {
  return {
    name: 'gallery-watcher-plugin',
    configureServer(server) {
      const galleriesPath = path.resolve(__dirname, 'public/galleries');
      server.watcher.add(galleriesPath);
      let debounceTimeout: NodeJS.Timeout | null = null;
      const regenerate = (filePath: string) => {
        if (filePath.includes('galleries') && !filePath.includes('galleries-manifest.json')) {
          if (debounceTimeout) clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            try {
              generateGalleriesManifest();
              server.ws.send({ type: 'full-reload' });
            } catch (e) {
              console.error('Failed to regenerate galleries manifest:', e);
            }
          }, 300);
        }
      };
      server.watcher.on('add', regenerate);
      server.watcher.on('unlink', regenerate);
      server.watcher.on('addDir', regenerate);
      server.watcher.on('unlinkDir', regenerate);
    },
    buildStart() {
      generateGalleriesManifest();
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), galleryWatcherPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // keep Three.js in its own chunk so the first page load stays light
          manualChunks: { three: ['three', '@react-three/fiber'] },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
