# ASSETS – TWINWARE v2

Die visuellen Rasterassets dieser Version wurden für das TWINWARE-Konzept in dieser Arbeitssitzung generiert und anschließend gezielt zugeschnitten/optimiert. Es werden keine externen Stockbilder oder fremden Markenassets benötigt.

## Hero / Three.js

Die Hero-Szene arbeitet ohne Rasterbild: Bildschirm, Tablet und Handy werden in Three.js aufgebaut, die Bildschirminhalte werden zur Laufzeit als Canvas-Textur gezeichnet (dasselbe Layout in drei Formaten – Responsive-Anspielung).

### `public/images/twinware/generated/hero-texture.webp`
- Aktuell nicht mehr im Frontend eingebunden (vormals Hero-Panel-Textur)
- Bleibt als austauschbares Asset unter stabilem Pfad liegen

## Leistungen

### `studio.webp`
- Zweck: Website-Servicekarte
- Motiv: hochwertige dunkle Architektur / Arbeitsumgebung, warme Lichtstimmung
- Format: WebP

### `interface.webp`
- Zweck: Webapp-Servicekarte und Story-Produktphase
- Motiv: dunkle UI-/Panel-Komposition mit orangefarbenem Fokuspunkt
- Format: WebP

### `service-work.webp`
- Zweck: großer rotierender Showcase-Canvas
- Motiv: generierte TWINWARE-Leistungs-/Produktinszenierung
- Format: WebP
- Besonderheit: wird in einer großen perspektivischen Scroll-Transition verwendet

## Agentur / CTA

### `portal.webp`
- Zweck: große Bildhälfte im Abschnitt „Warum TWINWARE“
- Motiv: dunkles Portal/Monolith-Motiv mit warmem orangefarbenem Licht
- Format: WebP

### `cta-backdrop.webp`
- Zweck: atmosphärischer Hintergrund im Kontakt-CTA
- Motiv: dunkle Berg-/Landschaftsinszenierung mit orangefarbenem Licht
- Format: WebP

## Konzeptbilder

### `generated-concept-1.webp`, `generated-concept-2.webp`
- Zweck: interne visuelle Referenz / Konzeptstand
- Nicht zwingend im sichtbaren Frontend eingesetzt

## Social

### `public/images/twinware/social/og.jpg`
- 1200 × 630 px
- OpenGraph / Social Preview
- basiert auf dem generierten Hero-Motiv und dem TWINWARE-Farbsystem

## Konsistenz

- Primärfarben: Off-White/Papier, Ink (#14161a) als Anker, TWINWARE Orange (#e8532a)
- Die Website ist hell gehalten; die dunklen Bildmotive werden in hellen Flächen als Kontrastpunkte eingesetzt (Servicekarten, Agentur-Split, abgeschwächt im Kontakt-Backdrop)
- Bildsprache: ruhig, technisch, räumlich, keine Neon-/Cyberpunk-Ästhetik
- Austauschbare Assets besitzen stabile Pfade; Animationslogik hängt nicht von Dateiabmessungen einzelner Bilder ab.
