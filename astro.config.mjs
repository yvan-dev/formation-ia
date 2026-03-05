// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/formation-ia/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), react()],
});
