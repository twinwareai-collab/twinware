# ASSETS – TWINWARE

Die Seite arbeitet mit zwei Aufnahmen; alles Weitere entsteht aus
Typografie, Linien und Farbe des Designsystems.

## Schrift

Archivo (Variable, Achsen `wdth` 62–125 und `wght` 100–900) wird über
`@fontsource-variable/archivo` als npm-Abhängigkeit **selbst ausgeliefert**.

Kein Aufruf an Google-Server: Die Content-Security-Policy in `public/_headers`
erlaubt nur eigene Quellen (`font-src 'self'`), und ohne externe Anfrage
entfällt die datenschutzrechtliche Diskussion um Google Fonts.

Die Achse `wdth` trägt das Designsystem: Überschriften laufen auf 114–118,
Fließtext auf 100. Wird die Schrift nicht geladen, greift eine System-Sans –
dann fehlt die Breitenachse und das Schriftbild verliert seinen Charakter.

## Hero

Die Hero-Szene arbeitet ohne Rasterbild: Bildschirm, Tablet und Handy werden
in Three.js aufgebaut, die Bildschirminhalte zur Laufzeit als Canvas-Textur
gezeichnet. Unterhalb von 980px wird die Szene nicht geladen; der Hero ist
dort eine normale Sektion.

## Bildmaterial

Zwei Aufnahmen, bewusst sparsam eingesetzt. Beide liegen als WebP in zwei
Breiten vor (800 / 1600) und werden über `srcset` ausgeliefert.

### `szenen/arbeitsplatz-daemmerung.webp`
- Abendlicher Arbeitsplatz, Laptop mit geöffnetem Editor, Stadt im Hintergrund
- Steht in der Reel-Sektion neben „Erst muss die Idee funktionieren."
- Trägt links einen Verlauf in den Kartengrund, damit die Textkante nicht
  hart abbricht; auf Mobil läuft der Verlauf nach unten statt nach links

### `szenen/lichtflaechen.webp`
- Helle Flächen- und Netzkomposition
- Liegt im Ideen-Check als ruhiger Grund auf der rechten Hälfte, per Maske
  ausgeblendet und auf halbe Deckkraft gesetzt – rein atmosphärisch

## Flächen statt Fotos

Alles andere entsteht aus Typografie, Linien und Farbe:

| Stelle | Umsetzung |
| --- | --- |
| `Principles` | Markenzeichen, Claim und feines Raster auf dunklem Grund |
| `Showcase` | Vier CSS-Skizzen als Andeutung von Phasen |
| `Contact` | Offene Feldzeilen auf dunklem Grund, kein Formularkasten |

## Social

### `public/images/twinware/social/og.jpg`
- 1200×630, das Vorschaubild beim Teilen
- Gesetzt aus Markenzeichen, Headline und Leistungszeile – dieselbe Schrift
  und dieselben Farben wie die Seite
- Erzeugt durch Rendern einer HTML-Vorlage; bei Textänderungen neu rendern
