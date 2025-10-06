import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { redwood } from 'rwsdk/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  optimizeDeps: {
    include: ['zod'],
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    cloudflare({
      viteEnvironment: { name: 'worker' },
    }),
    redwood(),
    tailwindcss(),
  ],
});
