// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

/** Serve pagefind files from dist/ during dev */
function pagefindDevPlugin() {
  let basePath = '/';
  return {
    name: 'pagefind-dev-server',
    configResolved(config) {
      basePath = config.base || '/';
    },
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          const prefix = basePath + 'pagefind/';
          if (req.url?.startsWith(prefix)) {
            const relPath = req.url.slice(basePath.length);
            const distPath = resolve('dist', relPath);
            if (existsSync(distPath)) {
              const content = readFileSync(distPath);
              const ext = relPath.split('.').pop();
              const types = {
                js: 'application/javascript',
                css: 'text/css',
                json: 'application/json',
                wasm: 'application/wasm',
              };
              res.setHeader(
                'Content-Type',
                types[ext] || 'application/octet-stream',
              );
              res.end(content);
              return;
            }
          }
          next();
        });
      };
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/formation-ia/',
  output: 'static',
  vite: {
    plugins: [tailwindcss(), pagefindDevPlugin()],
  },
  integrations: [mdx(), react()],
});
