# Abschlussbericht – TWINWARE Cinematic Agency Website v2

## Ergebnis

Kompletter Neuaufbau der TWINWARE-Startseite in einer deutlich cineastischeren Richtung, orientiert an den bereitgestellten Video-Referenzen: große räumliche Einstiege, schwebende Layer, gepinnte Scroll-Sequenzen, ein rotierender Showcase-Canvas und hochwertige schwarz/orange Produktinszenierung. Kein Hosting und kein Deployment.

## Tech Stack

- Astro
- TypeScript strict
- Tailwind CSS Build-Basis + eigenes Designsystem
- GSAP + ScrollTrigger
- Lenis
- Three.js
- Resend
- Zod
- Astro Node Adapter

## Zentrale Motion-/Visual-Funktionen

- echter Three.js Hero mit 3D-Boxen, Glas-/Metallmaterialien, Licht, Fog, Partikeln und generierter Textur
- Scroll-gesteuerte Three.js Kamera-/Objektbewegung
- DOM-Tiefenebenen im Hero als zusätzliche 2.5D-Schicht
- 420svh gepinnte Story-Sequenz mit vier austauschenden Produktphasen
- 260svh rotierender Showcase-Canvas: Tilt → Flat → Zoom/Exit, angelehnt an die starke Karten-/Canvas-Bewegung der Referenzvideos
- GSAP Reveals, Bild-Parallax und Process-Stagger
- subtile Magnetic Buttons auf Desktop
- Lenis nur auf geeigneten Desktop-Geräten
- reduzierte Motion / statische Fallbacks

## Ideen-Check

- lokale, regelbasierte Einordnung ohne Übertragung an externe Dienste
- Website / Webapp / App / internes Tool / maßgeschneiderte Software
- mögliche Funktionen
- Projektumfang
- Demo-Zeitrahmen
- Budget bleibt ohne echte TWINWARE-Preisvorgaben bewusst „nach kurzer Rücksprache“
- sichtbarer Hinweis, dass Architektur, Datenhaltung und Schnittstellen individuell geplant werden

## Resend / Kontakt

- serverseitige API-Route
- Zod-Validierung
- Honeypot
- Same-Origin-Prüfung
- Basis-Rate-Limit
- `.env.example`, keine echten Secrets

## Assets

Mehrere visuelle TWINWARE-Konzeptbilder wurden in dieser Sitzung generiert, zugeschnitten und als WebP in die Website integriert. Zusätzlich existiert ein 1200×630 OpenGraph-Bild. Details siehe `ASSETS.md`.

## SEO / GEO / AEO

- Title / Description / Canonical
- OpenGraph + Social Preview
- Organization / WebSite / Service JSON-LD
- robots.txt
- sitemap.xml
- 404
- llms.txt
- sichtbares FAQ
- klare, antwortorientierte Leistungs- und Prozessinhalte

## Accessibility

- semantische Sections / Überschriften
- Skip-Link
- Tastatur- und Focus-Styles
- echte Labels / aria-live Status
- Reduced Motion
- Touch-Ziele
- mobile reduzierte Motion und vereinfachte Layouts
- WebGL ist dekorativ; Kerninhalt bleibt normales HTML

## Prüfstatus

- TypeScript-Syntaxprüfung via lokal vorhandenem TypeScript `transpileModule`: erfolgreich für die wesentlichen `.ts`-Dateien
- Secret-Suche: vor ZIP-Erstellung durchgeführt
- `npm install`: in dieser Sandbox zweimal wegen Zeitüberschreitung nicht abgeschlossen
- daher kein echter Astro Production Build in dieser Umgebung möglich
- statische, eigenständig öffnbare Preview unter `preview/index.html` erstellt; sie bildet Layout und Interaktionen ab, während der eigentliche Astro-Code zusätzlich die Three.js-Version enthält
- automatischer Sandbox-Browser-Screenshot war durch die Browser-/Netzwerkrestriktionen der Laufzeit nicht zuverlässig möglich

## Deployment

- Public Preview URL: not deployed
- Deployment status: not deployed by request
- Three.js used: Yes
- Legal review required: Yes
