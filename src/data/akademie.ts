/**
 * Akademie — JBA Salon program. Locked dates per stage-0 content + brief §7.4.
 *
 * Status is computed at render time via dateISO comparison — no manual
 * "is-past" flags. That keeps the list correct after refresh without
 * editing data.
 */

export type AkademieTopic =
  | 'werkbericht'
  | 'reisebericht'
  | 'stadtdiskurs'
  | 'architekturgeschichte'
  | 'gast';

export type AkademieFormat = 'salon' | 'extern';

export interface AkademieEvent {
  slug: string;
  dateISO: string; // YYYY-MM-DD
  dateLabel: string; // dd.mm.yyyy
  title: string;
  titleEmphasis?: string; // italic part rendered separately
  speaker: string;
  isGuest: boolean;
  topic: AkademieTopic;
  format: AkademieFormat;
  venue: string; // "JBA, Amalienstr. 14a" or external
  city?: string;
  time?: string; // "19 Uhr"
  related?: string[]; // related projekt slugs
}

export const AKADEMIE_EVENTS: AkademieEvent[] = [
  {
    slug: 'aero-reinraum',
    dateISO: '2026-04-23',
    dateLabel: '23.04.2026',
    title: 'AERO, der Reinraum',
    titleEmphasis: 'AERO,',
    speaker: 'Jakob Bader',
    isGuest: false,
    topic: 'werkbericht',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
    time: '19 Uhr',
  },
  {
    slug: 'ernst-barth-iii',
    dateISO: '2026-03-26',
    dateLabel: '26.03.2026',
    title: 'Ernst Barth, Meisterarchitekt der Moderne III',
    titleEmphasis: 'Meisterarchitekt der Moderne III',
    speaker: 'Karl-Heinz Röpke',
    isGuest: true,
    topic: 'architekturgeschichte',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
  },
  {
    slug: 'ernst-barth-ii',
    dateISO: '2026-03-19',
    dateLabel: '19.03.2026',
    title: 'Ernst Barth, Meisterarchitekt der Moderne II',
    titleEmphasis: 'Meisterarchitekt der Moderne II',
    speaker: 'Martin Rössler',
    isGuest: true,
    topic: 'architekturgeschichte',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
  },
  {
    slug: 'stadt-und-auto',
    dateISO: '2026-03-05',
    dateLabel: '05.03.2026',
    title: 'Die Stadt und das Auto',
    titleEmphasis: 'Stadt',
    speaker: 'Jakob Bader',
    isGuest: false,
    topic: 'stadtdiskurs',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
  },
  {
    slug: 'pinakothek-werkbericht',
    dateISO: '2026-02-26',
    dateLabel: '26.02.2026',
    title: 'Pinakothek der Moderne — Werkbericht',
    titleEmphasis: 'Werkbericht',
    speaker: 'Stephan Braunfels',
    isGuest: true,
    topic: 'gast',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
  },
  {
    slug: 'doppelzwiebel-baugeschichte',
    dateISO: '2025-12-11',
    dateLabel: '11.12.2025',
    title: 'Die Doppelzwiebel — eine Baugeschichte',
    titleEmphasis: 'Doppelzwiebel',
    speaker: 'Jakob Bader',
    isGuest: false,
    topic: 'werkbericht',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
    related: ['p48'],
  },
  {
    slug: 'haus-leinz-familienbau',
    dateISO: '2025-10-08',
    dateLabel: '08.10.2025',
    title: 'Haus Leinz — eine Familien- und Baugeschichte',
    titleEmphasis: 'Familien- und Baugeschichte',
    speaker: 'Jakob Bader',
    isGuest: false,
    topic: 'werkbericht',
    format: 'extern',
    venue: 'ZEL Heidelberg',
    city: 'Heidelberg',
  },
  {
    slug: 'ernst-barth-i',
    dateISO: '2025-09-18',
    dateLabel: '18.09.2025',
    title: 'Ernst Barth, Meisterarchitekt der Moderne I',
    titleEmphasis: 'Meisterarchitekt der Moderne I',
    speaker: 'Jakob Bader',
    isGuest: false,
    topic: 'architekturgeschichte',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
  },
  {
    slug: 'genua-hafenstadt',
    dateISO: '2025-07-24',
    dateLabel: '24.07.2025',
    title: 'Genua, Hafenstadt der Paläste',
    titleEmphasis: 'Genua,',
    speaker: 'Jakob Bader',
    isGuest: false,
    topic: 'reisebericht',
    format: 'salon',
    venue: 'JBA, Amalienstr. 14a',
    city: 'München',
  },
];

export interface AkademieGuest {
  name: string;
  role: string;
  bio: string;
}

export const STAMMGAST: AkademieGuest = {
  name: 'Stephan Braunfels',
  role: 'Architekt der Pinakothek der Moderne',
  bio: 'Stammgast der JBA-Akademie. Architekt, Stadtdenker, Werkberichter — eine fortlaufende Konversation über die europäische Stadt und das Bauwerk als kulturelle Tat.',
};

/** Returns the next upcoming event (or null if archive only). */
export function nextEvent(now: Date = new Date()): AkademieEvent | null {
  const today = now.toISOString().slice(0, 10);
  const upcoming = AKADEMIE_EVENTS.filter((e) => e.dateISO >= today).sort((a, b) =>
    a.dateISO.localeCompare(b.dateISO),
  );
  return upcoming[0] ?? null;
}

/** Splits events into upcoming + past at runtime, sorted descending each. */
export function partitionEvents(now: Date = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const upcoming = AKADEMIE_EVENTS.filter((e) => e.dateISO >= today).sort((a, b) =>
    a.dateISO.localeCompare(b.dateISO),
  );
  const past = AKADEMIE_EVENTS.filter((e) => e.dateISO < today).sort((a, b) =>
    b.dateISO.localeCompare(a.dateISO),
  );
  return { upcoming, past };
}
