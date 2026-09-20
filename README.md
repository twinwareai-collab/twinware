# TWINWARE – Cinematic Agency Website

Premium-Agenturwebsite für TWINWARE in einem hellen, ruhigen Off-White/Orange-Design mit Three.js Hero (Bildschirm, Tablet und Handy als Responsive-Anspielung), GSAP/ScrollTrigger, Lenis, scrollgesteuerter Story, rotierendem Showcase und interaktivem Ideen-Check.

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

Production:

```bash
npm run build
node ./dist/server/entry.mjs
```

## Resend

`.env`:

```env
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=kontakt@deinedomain.de
CONTACT_FROM_EMAIL=Twinware Website <website@deine-verifizierte-domain.de>
PUBLIC_SITE_URL=https://deinedomain.de
```

## Wichtige Dateien

- `src/components/hero/Hero.astro` – cinematic Hero
- `src/scripts/three-scene.ts` – Three.js Szene (Bildschirm / Tablet / Handy)
- `src/components/sections/Showcase.astro` – gepinnte Story
- `src/components/sections/Reel.astro` – große Tilt/Rotate Scroll-Sequenz
- `src/components/sections/Estimator.astro` – Ideen-Check
- `src/pages/api/contact.ts` – Resend API
- `src/styles/global.css` – komplettes Designsystem / Responsive / Motion Fallbacks
- `ASSETS.md` – generierte Bildassets
- `LEGAL_TODO.md` – vor Veröffentlichung zu ergänzende Daten

## Preise

Es wurden keine TWINWARE-Preise erfunden. Echte Budgetrahmen können später zentral in `src/config/site.ts` hinterlegt werden.

## Vor Veröffentlichung

`LEGAL_TODO.md` abarbeiten und Rechtstexte individuell prüfen lassen.
