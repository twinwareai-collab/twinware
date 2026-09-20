import { siteConfig } from '@/config/site';

type Category = 'website' | 'webapp' | 'app' | 'internal' | 'software';
type Size = 'small' | 'medium' | 'extensive';

const catalog: Record<Category, { label: string; title: string; features: string[] }> = {
  website: {
    label: 'Website', title: 'Ein klarer digitaler Auftritt',
    features: ['Leistungsseiten', 'Kontaktanfrage', 'Suchmaschinen-Basis', 'Referenzen / Projekte', 'Responsive Darstellung', 'Redaktionelle Inhalte'],
  },
  webapp: {
    label: 'Webapp', title: 'Ein zentraler Ablauf im Browser',
    features: ['Benutzerkonten', 'Rollen & Rechte', 'Dashboard', 'Datenverwaltung', 'Datei-Upload', 'Status & Benachrichtigungen'],
  },
  app: {
    label: 'App', title: 'Eine mobile Anwendung für den direkten Zugriff',
    features: ['Benutzerkonto', 'Mobile Navigation', 'Push-Benachrichtigungen', 'Medien / Kamera', 'Favoriten / Verlauf', 'Synchronisierte Daten'],
  },
  internal: {
    label: 'Internes Tool', title: 'Ein Werkzeug für Ihren eigenen Ablauf',
    features: ['Mitarbeiter-Login', 'Aufgaben / Vorgänge', 'Rollen & Freigaben', 'Dokumente', 'Suche & Filter', 'Protokoll / Historie'],
  },
  software: {
    label: 'Maßgeschneiderte Software', title: 'Eine Lösung genau für Ihren Ablauf',
    features: ['Individuelle Datenstruktur', 'Rollen & Rechte', 'Automatisierte Abläufe', 'Auswertungen & Reports', 'Anbindung bestehender Systeme', 'Erweiterbare Architektur'],
  },
};

const keywordMap: Record<Category, string[]> = {
  website: ['website','homepage','landingpage','seo','firma','agentur','restaurant','verein','leistungen','referenzen','präsentation'],
  webapp: ['webapp','portal','dashboard','kundenbereich','login','buchung','verwaltung','upload','workflow','plattform','galerie','event'],
  app: ['app','iphone','ios','android','push','kamera','gps','mobil'],
  internal: ['intern','mitarbeiter','excel','freigabe','auftrag','lager','prozess','workflow','rollen','verwaltung'],
  software: ['software','individuell','maßgeschneidert','massgeschneidert','system','automatis','schnittstelle','erp','crm','datenbank','abrechnung','kalkulation'],
};

const extraFeatures: Array<[RegExp,string]> = [
  [/qr[- ]?code/i,'QR-Code / Schnellzugang'], [/foto|bild/i,'Foto-Upload & Galerie'], [/video/i,'Video-Upload'], [/zahlung|paypal|stripe|bezahlen/i,'Zahlungsablauf'],
  [/termin|buchung|reserv/i,'Termin / Buchung'], [/passwort|geschützt/i,'Geschützter Bereich'], [/download/i,'Sammel-Download'], [/moderation|freigabe/i,'Moderation / Freigabe'],
  [/schnittstelle|api|erp|crm/i,'Anbindung bestehender Systeme'], [/mehrsprach|englisch|sprache/i,'Mehrsprachigkeit'],
];

function scoreCategory(text: string): Category {
  const lower = text.toLowerCase();
  const scores = Object.entries(keywordMap).map(([cat, words]) => [cat, words.reduce((sum,w) => sum + (lower.includes(w) ? 1 : 0), 0)] as [Category,number]);
  scores.sort((a,b) => b[1]-a[1]);
  return scores[0][1] === 0 ? 'webapp' : scores[0][0];
}

function estimateSize(text:string, featureCount:number): Size {
  const complexityHits = (text.match(/zahlung|schnittstelle|api|rollen|mehrsprach|video|offline|push|moderation|freigabe|mehrere|mandant/gi) || []).length;
  if (text.length > 320 || complexityHits >= 4 || featureCount >= 9) return 'extensive';
  if (text.length > 130 || complexityHits >= 2 || featureCount >= 6) return 'medium';
  return 'small';
}

export function analyzeIdea(text: string) {
  const category = scoreCategory(text);
  const base = catalog[category];
  const detected = extraFeatures.filter(([rx]) => rx.test(text)).map(([,label]) => label);
  const features = Array.from(new Set([...detected, ...base.features])).slice(0, 8);
  const size = estimateSize(text, features.length);
  const sizeLabel = { small:'Klein', medium:'Mittel', extensive:'Umfangreich' }[size];
  const timeframe = { small:'ca. 2–5 Wochen', medium:'ca. 4–8 Wochen', extensive:'ca. 8–16 Wochen' }[size];
  const configuredBudget = siteConfig.budgetRanges[size];
  const budget = configuredBudget || 'nach kurzer Rücksprache';
  return { category, label: base.label, title: base.title, features, size, sizeLabel, timeframe, budget };
}
