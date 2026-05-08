import styles from './Dialog.module.css';

/**
 * Schematic Maxvorstadt block — abstracted street grid + Kunstareal blocks.
 * Pin sits at Amalienstraße 14a (JBA office).
 *
 * Coordinate system: 400 × 300 viewBox.
 * North is up.
 *   • Ludwigstraße / Schellingstraße / Amalienstraße run vertically/horizontally
 *   • Pinakothek complex sits to the south-west
 *   • Königsplatz further south
 */
export function MaxvorstadtMap() {
  return (
    <svg
      className={styles.mapSvg}
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Schematische Karte Maxvorstadt mit JBA-Standort"
      role="img"
    >
      {/* ─── BLOCKS — building masses ─────────────────────────────── */}
      {/* Northern blocks */}
      <rect className="block" x="40" y="30" width="80" height="50" />
      <rect className="block" x="135" y="30" width="80" height="50" />
      <rect className="block" x="230" y="30" width="80" height="50" />

      {/* JBA block (Amalienstr 14a area) — accented */}
      <rect className="blockKunst" x="135" y="95" width="80" height="50" />

      <rect className="block" x="40" y="95" width="80" height="50" />
      <rect className="block" x="230" y="95" width="80" height="50" />

      {/* Kunstareal — Pinakothek complex, lower-left, accented */}
      <rect className="blockKunst" x="40" y="160" width="80" height="50" />
      <rect className="blockKunst" x="40" y="225" width="80" height="50" />

      <rect className="block" x="135" y="160" width="80" height="50" />
      <rect className="block" x="230" y="160" width="80" height="50" />
      <rect className="block" x="135" y="225" width="80" height="50" />
      <rect className="block" x="230" y="225" width="80" height="50" />

      {/* ─── STREETS ─────────────────────────────────────────────── */}
      {/* Vertical: Amalienstraße (passes through JBA), Türkenstraße, Ludwigstraße */}
      <line className="streetMain" x1="175" y1="0" x2="175" y2="300" />
      <line className="street" x1="80" y1="0" x2="80" y2="300" />
      <line className="street" x1="270" y1="0" x2="270" y2="300" />
      <line className="street" x1="360" y1="0" x2="360" y2="300" />

      {/* Horizontal: Schellingstr, Theresienstr (the JBA cross), Gabelsbergerstr */}
      <line className="street" x1="0" y1="80" x2="400" y2="80" />
      <line className="streetMain" x1="0" y1="125" x2="400" y2="125" />
      <line className="street" x1="0" y1="190" x2="400" y2="190" />
      <line className="street" x1="0" y1="245" x2="400" y2="245" />

      {/* ─── LABELS ─────────────────────────────────────────────── */}
      <text className="label" x="184" y="12">Amalienstraße ↑</text>
      <text className="label" x="6" y="76">Schellingstr.</text>
      <text className="label labelAccent" x="6" y="121">Theresienstr.</text>
      <text className="label" x="6" y="186">Gabelsbergerstr.</text>

      {/* Kunstareal label sits INSIDE the lower-left accented block,
          well below the Gabelsbergerstr. street label. */}
      <text className="label labelMain" x="48" y="246">Kunstareal</text>
      <text className="label" x="48" y="258">Pinakotheken</text>

      {/* ─── PIN at JBA · Amalienstr 14a ─────────────────────────── */}
      <g className={styles.mapPin} transform="translate(175 120)">
        <circle className="pulse" cx="0" cy="0" r="6" />
        <circle className="outer" cx="0" cy="0" r="14" />
        <circle className="inner" cx="0" cy="0" r="6" />
      </g>
      {/* Pin label moved further right so the pulse animation (extends
          to ~r=22 at peak) doesn't cover the leading "J". */}
      <text className="label labelAccent" x="200" y="118">JBA · 14a</text>

      {/* ─── Compass rose ───────────────────────────────────────── */}
      <g transform="translate(370 32)" opacity="0.42">
        <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(244,237,224,0.32)" strokeWidth="0.6" />
        <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(244,237,224,0.32)" strokeWidth="0.6" />
        <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(244,237,224,0.32)" strokeWidth="0.6" />
        <text className="label" x="-3" y="-16">N</text>
      </g>
    </svg>
  );
}
