import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === 'build' && {
      name: 'skip-locked-public-files',
      enforce: 'pre' as const,
      config() {
        return { publicDir: false };
      },
      closeBundle: {
        sequential: true,
        async handler() {
          const fs = await import('node:fs');
          const path = await import('node:path');
          const src = path.resolve('public');
          const dest = path.resolve('dist');
          for (const entry of fs.readdirSync(src)) {
            try {
              fs.cpSync(path.join(src, entry), path.join(dest, entry), { recursive: true });
            } catch {
              console.warn(`[skip-locked-files] skipped: ${entry}`);
            }
          }
        },
      },
    },
  ].filter(Boolean),
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
