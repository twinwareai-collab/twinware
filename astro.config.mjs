import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Canonical-URL zur Build-Zeit. Auf Cloudflare Pages als Umgebungsvariable
// (Settings > Environment variables) setzen, sonst greift der Fallback.
const site = process.env.PUBLIC_SITE_URL || 'https://twinware.pages.dev';

export default defineConfig({
  // Alle Seiten sind statisch; nur /api/contact laeuft als Pages Function.
  output: 'static',
  site,
  vite: {
    plugins: [tailwindcss()],
  },
  compressHTML: true,
});
