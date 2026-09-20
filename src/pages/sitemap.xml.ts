import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ url }) => {
  const pages = ['/', '/datenschutz', '/impressum'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((p)=>`<url><loc>${new URL(p,url.origin).toString()}</loc></url>`).join('')}</urlset>`;
  return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
