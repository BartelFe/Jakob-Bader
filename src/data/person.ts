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
