import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Astro configuration for Project Phoenix (Astro + React islands + Tailwind)
export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ]
});