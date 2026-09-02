# Twinware – Website

Astro-Projekt für die Unternehmenswebsite von Twinware.
Statischer Build, gedacht für Cloudflare Pages.

## Starten

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # Ausgabe nach dist/
npm run preview  # Build lokal anschauen
```

Node 22 oder neuer.

## Aufbau

```
src/
  data/site.ts          Alle Texte, Leistungen, Referenzen, Ablauf
  styles/global.css     Design-Tokens (@theme) und Bausteine
  layouts/Base.astro    Kopf, Meta-Tags, JSON-LD, View Transitions
  components/           Eine Datei je Abschnitt der Startseite
  pages/                index, impressum, datenschutz, 404
```

Inhalte werden in `src/data/site.ts` gepflegt. Das Markup muss dafür nicht
angefasst werden.

## Design

- Anzeigeschrift: Anton (Wortmarke, Ziffern)
- Überschriften: Instrument Serif
- Fließtext: Inter Tight Variable
- Farben: Papier `#FAF9F7`, Tinte `#111111`, Akzent `#FF4B2E`, Nacht `#0E0E0E`

Alle Schriften liegen über Fontsource im eigenen Build – es geht keine
Anfrage an Google.

## Vor dem Livegang

Im Projekt sind die offenen Punkte mit `TODO` markiert:

- `src/data/site.ts`: Firmierung, Anschrift, Telefon, E-Mail, Gründernamen
- `src/pages/impressum.astro`: USt-IdNr., verantwortliche Person
- `src/pages/datenschutz.astro`: Hoster und Mailversender benennen, AVV
- Referenzbilder und Portraits ergänzen (siehe unten)
- `astro.config.mjs`: `site` auf die echte Domain setzen

## Bilder ergänzen

Bilder nach `src/assets/` legen und in `Referenzen.astro` bzw. `UeberUns.astro`
die Platzhalterflächen ersetzen:

```astro
---
import { Image } from "astro:assets";
import bild from "../assets/neumann.jpg";
---
<Image src={bild} alt="…" widths={[400, 800]} sizes="(min-width: 56rem) 33vw, 100vw" />
```

Dafür einmalig `npm install sharp`.

## Kontaktformular

Das Formular schickt einen POST an `/api/kontakt`. Für Cloudflare Pages eine
Function anlegen:

```
functions/api/kontakt.ts
```

Darin den Body entgegennehmen und über Resend verschicken. Der Endpunkt ist in
`src/components/Kontakt.astro` im Skript-Block kommentiert. Solange es die
Function nicht gibt, zeigt das Formular einen Fehlerhinweis mit der
E-Mail-Adresse an.

## Deploy auf Cloudflare Pages

1. Repository mit Pages verbinden
2. Build-Befehl `npm run build`, Ausgabeverzeichnis `dist`
3. Umgebungsvariable `RESEND_API_KEY` setzen, sobald das Formular live geht
4. Domain zuweisen, Nameserver auf Cloudflare zeigen lassen
