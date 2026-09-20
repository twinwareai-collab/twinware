import { Resend } from 'resend';
import { z } from 'zod';

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

const payloadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional().default(''),
  consent: z.union([z.literal('on'), z.literal('true'), z.literal(true)]),
});

// Best-effort-Drosselung pro Isolate. Cloudflare verteilt Requests auf viele
// Isolates, das Limit greift also nicht global - es bremst nur grobe Schleifen.
const attempts = new Map<string, number[]>();
function rateLimited(key: string) {
  const now = Date.now(); const windowMs = 15 * 60 * 1000; const limit = 5;
  const valid = (attempts.get(key) || []).filter((t) => now - t < windowMs);
  valid.push(now); attempts.set(key, valid); return valid.length > limit;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return Response.json({ message: 'Ungültige Anfrage.' }, { status: 403 });

  const clientAddress = request.headers.get('CF-Connecting-IP');
  if (rateLimited(clientAddress || 'unknown')) return Response.json({ message: 'Bitte später erneut versuchen.' }, { status: 429 });

  let raw: unknown;
  try { raw = await request.json(); } catch { return Response.json({ message:'Ungültige Daten.' }, { status:400 }); }
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) return Response.json({ message:'Bitte prüfen Sie Ihre Angaben.' }, { status:400 });
  if (parsed.data.website) return Response.json({ ok:true });

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return Response.json({ message:'Kontaktversand ist noch nicht konfiguriert.' }, { status:503 });

  const resend = new Resend(apiKey);
  const escape = (s:string) => s.replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c] || c));
  const { name, email, company, message } = parsed.data;
  const result = await resend.emails.send({
    from, to, replyTo: email, subject: `Neue Twinware-Anfrage von ${name}`,
    html: `<h1>Neue Website-Anfrage</h1><p><strong>Name:</strong> ${escape(name)}</p><p><strong>E-Mail:</strong> ${escape(email)}</p><p><strong>Unternehmen:</strong> ${escape(company || '-')}</p><p><strong>Nachricht:</strong></p><p>${escape(message).replace(/\n/g,'<br>')}</p>`,
  });
  if (result.error) return Response.json({ message:'Versand fehlgeschlagen.' }, { status:502 });
  return Response.json({ ok:true });
};
