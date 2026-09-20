import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  const text = `# Twinware

Twinware entwickelt Websites, Web-Apps, Apps und maßgeschneiderte Software für kleine und mittelständische Unternehmen. Wir arbeiten deutschlandweit und betreuen die Lösungen nach dem Start weiter.

## Leistungen
- Webseiten und Relaunches, suchmaschinenoptimiert
- Web-Apps, Kundenportale und interne Werkzeuge
- Apps für iOS und Android
- Maßgeschneiderte Software für individuelle Abläufe
- Digitalisierung von Geschäftsprozessen, inklusive ERP
- Wartung, Updates, Sicherheit und Support nach dem Launch
- Beratung im Rahmen laufender Projekte

## Für wen
Inhaber und Selbständige mit Betrieben von einem bis rund zwanzig Mitarbeitern, die bisher keine oder eine veraltete Website haben und online besser gefunden werden wollen. Technisches Vorwissen ist nicht nötig.

## Typische Anliegen
- Sichtbarkeit bei Google und in KI-Assistenten
- Mehr Anfragen und neue Kunden gewinnen
- Bekanntheit über die Region hinaus steigern
- Leistungen und Sortiment verständlich präsentieren
- Abläufe aus Excel und Papier in eine Software überführen

## Ablauf
Kostenloses und unverbindliches Erstgespräch, danach Einordnung, Entwurf, Umsetzung und laufende Betreuung. Ein fester Ansprechpartner über das gesamte Projekt.

## Kontakt
${url.origin}/#kontakt

## Hinweis
Preise hängen vom Umfang ab und werden nach dem Erstgespräch als Spanne genannt. Technische Architektur und konkrete Umsetzung werden für jedes Projekt individuell geplant.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
