# Security notes

Für den finalen Host sind mindestens folgende Header zu setzen und an die tatsächliche Deployment-Umgebung anzupassen:

- `Content-Security-Policy`: mindestens `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (oder CSP frame-ancestors)
- HSTS erst nach korrekter HTTPS-Konfiguration aktivieren

Die Resend API-Keys gehören nur in Server-Umgebungsvariablen und nie in Client-Code oder Repository.
