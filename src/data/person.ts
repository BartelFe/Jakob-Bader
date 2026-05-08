/**
 * Jakob Bader — bio + timeline + intellectual lineage. Brief §7.5.
 */

export const BIO_PARAGRAPHS = [
  'Geboren 1973 in Heidelberg in einer Architektenfamilie, aus alter Münchner Linie. Lebt mit seiner Familie in Alt-Schwabing.',
  'Seit über zwanzig Jahren selbständiger und freier Architekt in München, mit eigenem Büro im Kunstareal Maxvorstadt. Studium an der TU München und der TU Delft, bei Ueli Zbinden und Felix Claus; Diplom 2000 bei Victor López Cotelo. Frühe Tätigkeit bei Muck Petzet und Peter Haimerl.',
  'Kurz nach dem Diplom baute er gegenüber der TU München einen Behelfsbau aus der Nachkriegszeit zu seinem ersten Büro um — dem Kulturkiosk Kanzler. Ein Jahr lang trafen sich dort an jedem Freitagabend Nachbarn, Freunde und Interessierte zu Vernissagen, Lesungen, Diskussionen, Film-, Musik- und Theateraufführungen. Es entstand ein politischer Salon, aufsehenerregend bis über die Stadtgrenze hinaus.',
  'Schon damals war ihm klar: Die Aufgabe des Architekten ist nicht nur die Hülle — vor allem ist es der Raum. Am Ende des Tages kommt es nicht auf das Materielle an. Wichtig sind Mensch, Raum und Atmosphäre.',
] as const;

export const TIMELINE = [
  { year: '1973', label: 'geboren · Heidelberg' },
  { year: '2000', label: 'Diplom · TU München' },
  { year: '2002', label: 'Bürogründung JBA' },
  { year: '2004', label: 'freier Architekt' },
  { year: '2025', label: 'Fassadenpreis München' },
] as const;

export const PERSON_PULL_QUOTE = {
  text: 'Architektur ist nicht nur eine Hülle, sondern vor allem Raum. Und ein Raum ist ohne den Menschen leer und sinnlos. Erst Menschen erfüllen ihn mit Leben.',
  emphasis: 'Raum',
} as const;

/**
 * Geistige Familie — names that count for Bader, with a tight reason.
 * Brief §7.5: "typografische Wand mit Hover-Reveal warum diese Namen
 * für Bader zählen". One-line reasons, no scholarship-essays.
 */
export const LINEAGE: { name: string; reason: string }[] = [
  { name: 'Vitruv', reason: 'Architektur als Mutter aller Künste — die Quelle.' },
  { name: 'Michelangelo', reason: 'Der Bildhauer, der baut. Bühnenbildner avant la lettre.' },
  { name: 'Karl Friedrich Schinkel', reason: 'Klassizismus als Haltung, nicht als Stil.' },
  { name: 'Ludwig Mies van der Rohe', reason: 'Less is more — als Disziplin, nicht als Pose.' },
  { name: 'Heinrich Tessenow', reason: 'Würde im Maßstab des Wohnens.' },
  { name: 'Adolf Loos', reason: 'Raum vor Ornament. Raum vor allem.' },
  { name: 'Walter Gropius', reason: 'Bauen als gesellschaftliche Aufgabe.' },
  { name: 'Ludwig Kracher', reason: 'Der Architekt der P48 — vor 135 Jahren.' },
];

export const MEMBERSHIPS = [
  { code: 'BAK Bayern', detail: 'Nr. 179675' },
  { code: 'Verband für Bauen im Bestand', detail: null },
  { code: 'Fassadenpreis München 2025', detail: 'P48 Doppelzwiebel' },
];

/**
 * Kanzler-Story — typographic micro-timeline of the Kulturkiosk Kanzler
 * (2000–2002), Bader's first office and political salon. Per Felix's
 * confirmation, no photographs available — typographic treatment only.
 */
export const KANZLER_TIMELINE: { year: string; tag: string; lead: string; em: string }[] = [
  {
    year: '2000',
    tag: 'Diplom',
    lead: 'TU München, bei',
    em: 'Victor López Cotelo',
  },
  {
    year: '2001',
    tag: 'Behelfsbau',
    lead: 'Nachkriegs-Kiosk gegenüber der TU wird zum',
    em: 'Kulturkiosk Kanzler',
  },
  {
    year: '2001 / 02',
    tag: 'Salon',
    lead: 'Jeden Freitagabend Vernissage, Lesung, Theater —',
    em: 'aufsehenerregend',
  },
  {
    year: '2002',
    tag: 'Bürogründung',
    lead: 'JBA in der',
    em: 'Maxvorstadt',
  },
];

export const PERSON_CROSS_LINKS = {
  brillux: {
    label: 'Brillux Homestory',
    note: 'Eine Wohnung als persönliche Ausstellung',
    href: 'https://www.brillux.de/farbe-raum/homestories/jakob-bader/',
  },
  fassadenpreis: {
    label: 'Fassadenpreis München 2025',
    note: 'Broschüre der Stadt München',
    href: 'https://stadt.muenchen.de/dam/jcr:3f23a516-b1de-4074-b014-f5a259a98db2/fassadenpreis2025__broschuere_.pdf',
  },
} as const;
