import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ondys.dev',
  output: 'static',
  build: {
    format: 'directory'
  },
  integrations: [
    tailwind()
  ]
});
