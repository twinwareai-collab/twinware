// Alle redaktionellen Inhalte der Website an einer Stelle.
// Texte hier ändern – das Markup muss dafür nicht angefasst werden.

export const site = {
  name: "Twinware",
  legalName: "Twinware GbR", // TODO: exakte Firmierung aus dem Gesellschaftsvertrag
  tagline: "Websites, Webapps und Wartung aus Schwäbisch Hall",
  description:
    "Twinware baut Websites und Webapps für mittelständische Unternehmen – von der ersten Skizze bis zum laufenden Betrieb, inklusive Wartung danach.",
  city: "Schwäbisch Hall",
  street: "Musterstraße 1", // TODO
  postalCode: "74523", // TODO
  email: "hallo@twinware.de", // TODO
  phone: "+49 791 0000000", // TODO
  founded: "2026",
  url: "https://twinware.de",
} as const;

export const nav = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Ablauf", href: "#ablauf" },
  { label: "Über uns", href: "#ueber-uns" },
] as const;

export type Sparte = {
  kicker: string;
  title: string;
  body: string;
  items: { title: string; text: string }[];
};

export const sparten: Sparte[] = [
  {
    kicker: "Sparte eins",
    title: "Web & Anwendungen",
    body: "Alles, was im Browser oder auf dem Telefon läuft. Wir bauen es von Hand, ohne Baukasten und ohne Theme, das man nach zwei Jahren nicht mehr aktualisiert bekommt.",
    items: [
      {
        title: "Unternehmenswebsites",
        text: "Schnell, gepflegt, für Google und für Menschen lesbar.",
      },
      {
        title: "Buchung und Reservierung",
        text: "Termine, Tische, Fahrzeuge – Anfragen laufen direkt ins System statt ans Telefon.",
      },
      {
        title: "Kundenportale und Webapps",
        text: "Login, Daten, Dokumente. Für Abläufe, die heute noch per E-Mail laufen.",
      },
      {
        title: "Mobile Apps",
        text: "Eine Codebasis für iOS und Android, wenn eine Website nicht reicht.",
      },
    ],
  },
  {
    kicker: "Sparte zwei",
    title: "Wartung & Betrieb",
    body: "Eine Website, die einmal gebaut und dann nie wieder angefasst wird, veraltet. Wir betreuen, was wir gebaut haben, auch danach – technisch und inhaltlich.",
    items: [
      {
        title: "Updates & Sicherheit",
        text: "Software, Plugins und Zertifikate bleiben aktuell, ohne dass Sie daran denken müssen.",
      },
      {
        title: "Backups & Monitoring",
        text: "Tägliche Sicherungen und ein Auge auf die Erreichbarkeit – auch nachts und am Wochenende.",
      },
      {
        title: "Fester Ansprechpartner",
        text: "Keine Ticket-Warteschlange. Sie erreichen die Person, die Ihre Seite gebaut hat.",
      },
    ],
  },
];

export type Leistung = {
  tag: string;
  title: string;
  text: string;
  size: "wide" | "tall" | "normal";
};

export const leistungen: Leistung[] = [
  {
    tag: "Neubau",
    title: "Website von Grund auf",
    text: "Struktur, Text, Gestaltung und Technik aus einer Hand. Sie bekommen kein Template, sondern eine Seite, die zu Ihrem Betrieb passt und die man in fünf Jahren noch anfassen kann.",
    size: "wide",
  },
  {
    tag: "Ablösung",
    title: "Raus aus dem Baukasten",
    text: "Bestehende Seite umziehen, ohne Rankings zu verlieren.",
    size: "normal",
  },
  {
    tag: "Anwendung",
    title: "Software für einen Ablauf, den es nur bei Ihnen gibt",
    text: "Wenn die Standardlösung nicht passt, bauen wir das Werkzeug. Meist als Webapp, damit nichts installiert werden muss.",
    size: "tall",
  },
  {
    tag: "Schnittstellen",
    title: "Systeme miteinander reden lassen",
    text: "Shop, Buchhaltung, Kalender, Lager. Daten wandern automatisch statt per Copy-and-paste.",
    size: "normal",
  },
  {
    tag: "Wartung",
    title: "Pflege statt Stillstand",
    text: "Sicherheitsupdates, Backups und Monitoring im Hintergrund. Sie merken davon nur, dass nichts passiert.",
    size: "normal",
  },
  {
    tag: "Betrieb",
    title: "Danach nicht allein",
    text: "Updates, Backups, Erreichbarkeit, kleine Änderungen. Fester Monatsbetrag, keine Überraschungen. Wer eine Website baut und dann verschwindet, hat sie nicht zu Ende gebaut.",
    size: "wide",
  },
];

export const ablauf = [
  {
    title: "Gespräch",
    text: "30 Minuten, kostenlos, ohne Präsentation. Sie erzählen, was hakt. Wir sagen ehrlich, ob wir die Richtigen dafür sind.",
    meta: "Woche 1",
  },
  {
    title: "Angebot",
    text: "Ein Dokument mit Umfang, Festpreis und Termin. Was nicht drinsteht, wird auch nicht berechnet.",
    meta: "Woche 1–2",
  },
  {
    title: "Umsetzung",
    text: "Jede Woche ein Stand, den Sie im Browser anschauen können. Änderungen sind während der Arbeit billiger als danach.",
    meta: "Woche 2–8",
  },
  {
    title: "Übergabe",
    text: "Zugänge, Dokumentation, Einweisung. Danach optional Wartung – oder Sie machen selbst weiter, der Code gehört Ihnen.",
    meta: "Ab Tag 1 danach",
  },
] as const;

export const gruender = [
  {
    name: "[GRÜNDER 1]", // TODO
    role: "Anwendungen & Architektur",
    text: "Hauptberuflich seit Jahren in großen Java- und Spring-Systemen unterwegs. Weiß, wie Software aussieht, die zehn Jahre laufen muss – und baut sie deshalb auch für kleine Betriebe so.",
  },
  {
    name: "[GRÜNDER 2]", // TODO
    role: "Web & Betrieb",
    text: "Kümmert sich um alles, was der Kunde sieht, und darum, dass es danach zuverlässig weiterläuft. Von der ersten Skizze bis zur laufenden Wartung.",
  },
] as const;
