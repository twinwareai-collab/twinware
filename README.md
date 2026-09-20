# TWINWARE – Cinematic Agency Website

Agenturwebsite für TWINWARE: heller Papiergrund, Orange als einziger Akzent,
Archivo über zwei Breitenachsen, 2px-Linien statt Kartenschatten. Der Hero ist
eine Three.js-Szene (Bildschirm, Tablet, Handy), dazu GSAP/ScrollTrigger, Lenis
und ein interaktiver Ideen-Check.

Ab 980px abwärts sind Hero, Story und Reel bewusst **keine** Scroll-Choreografien
mehr, sondern normale Sektionen – auf dem Handy lädt die WebGL-Szene ohnehin
nicht, und gestapelte Inhalte lesen sich dort besser als eine Sticky-Strecke.
Die Navigation liegt auf Mobil in einem eigenen Panel (`.mobile-menu`) statt in
einem umgebauten Desktop-Menü.

Mit Maus ersetzt ein Ring den Systemzeiger (`.cursor-ring`) und wächst über
allem Anklickbaren; auf Touch-Geräten und bei `prefers-reduced-motion` bleibt
er aus. Zeiger und Hero-Parallaxe teilen sich einen Frame-Loop.

Leistungsfokus: Websites, Webapps, Apps und maßgeschneiderte Softwarelösungen.

## Schnell ansehen

Ohne Installation:

`preview/index.html`

Die Preview ist bewusst eigenständig und verwendet keine externen CDNs; sie bildet den Hero mit einer Canvas-2D-Variante ab. Der produktive Astro-Quellcode enthält den echten Three.js-Hero.

> Die Preview ist eine Kopie und muss bei Änderungen an `src/` von Hand mitgezogen werden (`preview/styles.css` entspricht `src/styles/global.css` ohne die Tailwind-Zeile).

## Lokal entwickeln

```bash
npm install
cp .env.example .env
npm run dev
```

Production-Build lokal testen (inkl. Kontakt-Function):

```bash
cp .dev.vars.example .dev.vars   # Secrets fuer die lokale Function
npm run preview                  # Build + wrangler pages dev
```

## Resend

Lokal in `.dev.vars` (fuer die Pages Function), in Produktion als Secrets im
Cloudflare-Dashboard:

```env
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=kontakt@deinedomain.de
CONTACT_FROM_EMAIL=Twinware Website <website@deine-verifizierte-domain.de>
```

## Deployment (Cloudflare Pages)

Die Seite wird statisch gebaut; nur `/api/contact` laeuft als Pages Function.

Projekt-Einstellungen im Cloudflare-Dashboard:

| Einstellung | Wert |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Compatibility flags | `nodejs_compat` |

Environment variables (Settings > Environment variables):

- `PUBLIC_SITE_URL` – **Build**-Variable, setzt Canonical-URLs, Sitemap und robots.txt
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` – als **Secret**, zur Laufzeit von der Function gelesen

Ohne die drei Resend-Werte antwortet das Formular bewusst mit HTTP 503
("Kontaktversand ist noch nicht konfiguriert.") statt zu scheitern.

Alternativ direkt aus der Konsole: `npm run deploy`.

## Wichtige Dateien

- `src/components/hero/Hero.astro` – cinematic Hero
- `src/scripts/three-scene.ts` – Three.js Szene (Bildschirm / Tablet / Handy)
- `src/components/sections/Showcase.astro` – gepinnte Story
- `src/components/sections/Reel.astro` – große Tilt/Rotate Scroll-Sequenz
- `src/components/sections/Estimator.astro` – Ideen-Check
- `functions/api/contact.ts` – Kontaktformular als Cloudflare Pages Function (Resend)
- `public/_headers` – Security-Header (CSP etc.) und Cache-Control
- `src/components/ui/Header.astro` – Kopfzeile inkl. eigenem Panel für Mobil
- `src/components/sections/Signature.astro` – Marken-Moment vor dem Kontakt
- `src/scripts/vortex.ts` – kreisende Typografie auf Canvas 2D, wird erst
  nachgeladen, wenn die Sektion in Sichtweite kommt
- `src/styles/global.css` – komplettes Designsystem / Responsive / Motion Fallbacks
- `ASSETS.md` – generierte Bildassets
- `LEGAL_TODO.md` – vor Veröffentlichung zu ergänzende Daten

## Preise

Es wurden keine TWINWARE-Preise erfunden. Echte Budgetrahmen können später zentral in `src/config/site.ts` hinterlegt werden.

## Vor Veröffentlichung

`LEGAL_TODO.md` abarbeiten und Rechtstexte individuell prüfen lassen.
