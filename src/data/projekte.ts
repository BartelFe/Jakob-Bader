/**
 * Projekte — six built positions, locked content per brief §7.3.
 * Slugs match /public/projekte/<slug>/ folder names.
 */

export type ProjektSlug = 'p48' | 'akpl22' | 'lupo' | 'hausw' | 't61' | 'vs15';

export interface Projekt {
  slug: ProjektSlug;
  code: string;
  years: string;
  location: string;
  tags: string[];
  name: string;
  nameSplit: { lead: string; emphasis: string };
  short: string;
  description: string;
  prize?: { label: string; href: string };
  hero: string;
  images: string[];
  plans?: string[];
  treatment: 'editorial' | 'gallery' | 'before-after' | 'split-view' | 'detail-cards' | 'typographic';
}

export const PROJEKTE: Projekt[] = [
  {
    slug: 'p48',
    code: 'P48',
    years: '2020–2025',
    location: 'München · Wiesnviertel',
    tags: ['Denkmalpflege', 'Dachneubau', 'Fassadenpreis 2025'],
    name: 'Wohnhaus, Doppelzwiebel.',
    nameSplit: { lead: 'Wohnhaus,', emphasis: 'Doppelzwiebel.' },
    short: 'Doppelzwiebel zurückgebracht. Fassadenpreis München 2025.',
    description:
      'Ein denkmalgeschütztes Eckhaus von 1890 — Architekt Ludwig Kracher, Stil Neorenaissance. Über Jahrzehnte hatte das Gebäude Details verloren; die ursprüngliche Doppelzwiebel des Eckturms war von Westwinden umgestoßen und nach und nach zu einem plumpen Kegel reduziert worden. Wir haben sie zurückgebracht — den originalen Helm rekonstruiert, das Tragwerk so ertüchtigt, dass er den Winden an dieser Stelle dauerhaft standhält. Im Dach zwei großzügige Wohnungen mit Wohnhalle, Galerie, Turmstube und Sicht bis zur Frauenkirche.',
    prize: {
      label: 'Fassadenpreis München 2025',
      href: 'https://stadt.muenchen.de/dam/jcr:3f23a516-b1de-4074-b014-f5a259a98db2/fassadenpreis2025__broschuere_.pdf',
    },
    hero: '/projekte/p48/p48-01-hero.jpg',
    images: [
      '/projekte/p48/p48-02.jpg',
      '/projekte/p48/p48-03.jpg',
      '/projekte/p48/p48-04.jpg',
      '/projekte/p48/p48-05.jpg',
      '/projekte/p48/p48-06.jpg',
      '/projekte/p48/p48-07.jpg',
      '/projekte/p48/p48-08.jpg',
      '/projekte/p48/p48-09.jpg',
    ],
    plans: ['/projekte/p48/p48-grundriss-dg.jpg', '/projekte/p48/p48-schnitt.jpg'],
    treatment: 'editorial',
  },
  {
    slug: 'akpl22',
    code: 'AKPL2.2',
    years: '2024',
    location: 'München-Schwabing',
    tags: ['Denkmalpflege', 'Innenraum', 'Brillux-Homestory'],
    name: 'Wohnung im Ernst-Barth-Bau.',
    nameSplit: { lead: 'Wohnung im', emphasis: 'Ernst-Barth-Bau.' },
    short: 'Mailand-Feeling, Fischgrät, dezent farbig.',
    description:
      'Eine mondäne Stadtwohnung in Alt-Schwabing, 2025 unter Denkmalschutz gestellt. Wir wählten eine denkmalpflegerische Herangehensweise — kleine Veränderungen, die die Wohnung in „die beste Version ihrer selbst" verwandeln. Mailand-Feeling, Fischgrät, dezent farbig.',
    hero: '/projekte/akpl22/akpl22-01.jpg',
    images: [
      '/projekte/akpl22/akpl22-02.jpg',
      '/projekte/akpl22/akpl22-03.jpg',
      '/projekte/akpl22/akpl22-04.jpg',
      '/projekte/akpl22/akpl22-05.jpg',
      '/projekte/akpl22/akpl22-06.jpg',
      '/projekte/akpl22/akpl22-07.jpg',
      '/projekte/akpl22/akpl22-08.jpg',
      '/projekte/akpl22/akpl22-09.jpg',
    ],
    plans: ['/projekte/akpl22/akpl22-grundriss.jpg'],
    treatment: 'gallery',
  },
  {
    slug: 'lupo',
    code: 'LuPo',
    years: '2024',
    location: 'Luitpoldpark München',
    tags: ['Stadtraum', 'Vision', 'Pavillon'],
    name: 'Stadtraum, weitergedacht.',
    nameSplit: { lead: 'Stadtraum,', emphasis: 'weitergedacht.' },
    short: 'Architektur als gesellschaftlicher Beitrag.',
    description:
      'Ein Vorschlag, der die ursprünglich angedachte Pracht-Achse des Luitpoldparks wieder aufnimmt: ein zentrales Wasserbecken, ein leichter Stahlpavillon auf dem Schuttberg, ein klarer Endpunkt der Blickachse. Architektur als gesellschaftlicher Beitrag.',
    hero: '/projekte/lupo/lupo-01.jpg',
    images: ['/projekte/lupo/lupo-02.jpg', '/projekte/lupo/lupo-03.jpg'],
    treatment: 'before-after',
  },
  {
    slug: 'hausw',
    code: 'Haus W',
    years: 'Berlin · Neubau',
    location: 'Berlin',
    tags: ['Neubau', 'Villa', 'Schinkel-Linie'],
    name: 'Villa für einen Geschichtsprofessor.',
    nameSplit: { lead: 'Villa für einen', emphasis: 'Geschichtsprofessor.' },
    short: 'Pate standen Schinkel und das Farnsworth House.',
    description:
      'In einem grünen Berliner Vorort. Standpunkt frontal auf die Kirche im Kreisverkehr — gegen den Widerstand der Behörde, denen es zu feudal erschien. Pate standen Schinkel und das Farnsworth House. Tessenow oder Loos hätten ihn ebenso entwerfen können.',
    hero: '/projekte/hausw/hausw-01.jpg',
    images: [
      '/projekte/hausw/hausw-02.jpg',
      '/projekte/hausw/hausw-03.jpg',
      '/projekte/hausw/hausw-04.jpg',
      '/projekte/hausw/hausw-05.jpg',
    ],
    treatment: 'split-view',
  },
  {
    slug: 't61',
    code: 'T61',
    years: 'München-Gern · 1913 / saniert',
    location: 'München-Gern',
    tags: ['Denkmal', 'Restauration', 'Paul Böhmer'],
    name: 'Restauration als Kunst.',
    nameSplit: { lead: 'Restauration als', emphasis: 'Kunst.' },
    short: 'Stuck, Türen, Holztreppe, Heizkörper minutiös rekonstruiert.',
    description:
      'Eine Villa von Paul Böhmer, Schüler Friedrich von Thierschs. Nach Krieg und Purifizierung war kaum Originalsubstanz übrig. Wir haben Stuck, Türen, Holztreppe, Heizkörper minutiös rekonstruiert — bis hin zu im Ruhrgebiet eigens gegossenen Gliederheizkörpern.',
    hero: '/projekte/t61/t61-01.jpg',
    images: [
      '/projekte/t61/t61-02.jpg',
      '/projekte/t61/t61-03.jpg',
      '/projekte/t61/t61-04.jpg',
      '/projekte/t61/t61-05.jpg',
      '/projekte/t61/t61-06.jpg',
      '/projekte/t61/t61-07.jpg',
    ],
    treatment: 'detail-cards',
  },
  {
    slug: 'vs15',
    code: 'VS15',
    years: 'Schwabing · 5-Zimmer-Familie',
    location: 'München-Schwabing',
    tags: ['Wohnung', 'Umbau', 'Familie'],
    name: '3 + 1 = 5.',
    nameSplit: { lead: '3 + 1 =', emphasis: '5.' },
    short: 'Pariser Bauherrin. Rosmaringrünes Linoleum.',
    description:
      'Aus einer 3-Zimmer-Wohnung und einem 1-Zimmer-Apartment wird eine funktionale 5-Zimmer-Wohnung. Die Pariser Bauherrin brachte Möbel mit, das Grün der Luxembourg-Parkstühle wurde zum rosmaringrünen Linoleum.',
    hero: '/projekte/vs15/vs15-01.jpg',
    images: [
      '/projekte/vs15/vs15-02.jpg',
      '/projekte/vs15/vs15-03.jpg',
      '/projekte/vs15/vs15-04.jpg',
      '/projekte/vs15/vs15-05.jpg',
    ],
    treatment: 'typographic',
  },
];

export const PROJEKTE_BY_SLUG: Record<ProjektSlug, Projekt> = Object.fromEntries(
  PROJEKTE.map((p) => [p.slug, p]),
) as Record<ProjektSlug, Projekt>;

export const HERO_PROJEKT = PROJEKTE_BY_SLUG.p48;
