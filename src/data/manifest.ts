/**
 * Manifest statements — content source-of-truth.
 *
 * These sentences are LOCKED per build brief §4:
 *   "Diese Sätze sind nicht verhandelbar. Du kannst die *Inszenierung*
 *    ändern (Animation, Typografie, Reveal-Pattern), aber nicht die
 *    *Substanz*."
 *
 * If text needs to change, edit /CONTENT.md first, then mirror here.
 */

export const HERO = {
  eyebrow: 'Jakob Bader Architektur · Maxvorstadt München · seit 2002',
  headlineLeft: 'Mut zum',
  headlineRight: 'Raum.',
  sub: 'Architektur ist die stärkste Form der Zivilisation.\nWir bauen sie.',
  quote:
    'Ich kann nur raten, dass man mutig sein sollte. Dass man Architektur voll und ganz lebt und versucht, alles rauszuholen, was in dem Objekt steckt.',
  quoteAttrib: 'Jakob Bader',
} as const;

export const DIAGNOSE = {
  eyebrow: 'Die Diagnose · 01',
  number: '82',
  numberUnit: 'Millionen Menschen in Deutschland',
  text: 'Die wenigsten wissen, was ein Architekt wirklich tut.',
  coda:
    'Das ist kein Versehen. Es ist eine Aufgabe. Wir nehmen sie an — im Bauwerk, im Vortrag, im Stadtraum. Architektur sichtbar zu machen ist Teil des Berufs, nicht sein Beiwerk.',
} as const;

export const MANIFEST_BANNERS = [
  {
    id: 'banner-1',
    placement: 'before-werk',
    lead: 'Der Architekt ist',
    bold: 'Bühnenbildner.',
    coda: 'Mensch. Raum. Atmosphäre.',
  },
  {
    id: 'banner-2',
    placement: 'before-akademie',
    lead: 'Wir folgen nicht.',
    bold: 'Wir führen.',
  },
  {
    id: 'banner-3',
    placement: 'before-person',
    lead: 'Moden sind uns egal.',
    bold: 'Tatsachen leiten uns.',
  },
  {
    id: 'banner-4',
    placement: 'before-dialog',
    lead: 'Architektur ist die',
    bold: 'Mutter aller Künste.',
  },
] as const;

export const NOT_FOUND = {
  headline: 'Auch im Verlust steckt eine Form.',
  attrib: 'Jakob Bader',
  body:
    'Diese Seite gibt es nicht (mehr). Vielleicht wurde sie nie gebaut. Vielleicht wurde sie reduziert. Wir bringen Sie zurück.',
  cta: 'Zur Startseite',
} as const;

export const CONTACT = {
  street: 'Amalienstraße 14a',
  city: '80799 München · Maxvorstadt',
  email: 'architektur@jakobbader.de',
  phone: null as string | null,
  bak: 'BAK Bayern Nr. 179675',
} as const;
