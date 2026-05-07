#!/usr/bin/env bash
# Bulk-Download aller Bader-Projektbilder von jakobbader.de
# Ausführen aus dem Projekt-Root: bash fetch-bader-assets.sh
set -euo pipefail

BASE="https://www.jakobbader.de/assets/images"
DEST="public"

mkdir -p "$DEST"/{portraits,projekte/{p48,akpl22,lupo,hausw,t61,vs15}}

dl() {
  # $1 = source URL (vom Bader-Server)
  # $2 = Zielpfad relativ zu DEST
  echo "→ $2"
  curl -sSL --fail "$1" -o "$DEST/$2" || echo "  ✗ FAILED: $1"
}

# ── P48 (Hero-Projekt, Doppelzwiebel, Fassadenpreis 2025) ────────────
dl "$BASE/f/P48-67-Titel-Fassadenpreis-eya252xfxk8qtb2.jpg" "projekte/p48/p48-01-hero.jpg"
dl "$BASE/v/P48-56-5gxz2p77xjds5mw.jpg"                     "projekte/p48/p48-02.jpg"
dl "$BASE/g/P48-93-jahwrae4bfx0dzn.jpg"                     "projekte/p48/p48-03.jpg"
dl "$BASE/d/P48-80-txchrz5sftt94ze.jpg"                     "projekte/p48/p48-04.jpg"
dl "$BASE/a/P48-18-n97ret71ndypscr.jpg"                     "projekte/p48/p48-05.jpg"
dl "$BASE/y/P48-44-fbxd4mph6c1w6mj.jpg"                     "projekte/p48/p48-06.jpg"
dl "$BASE/d/P48-39-k5dkckxe4n22380.jpg"                     "projekte/p48/p48-07.jpg"
dl "$BASE/9/P48-48-dk1s7cqsfdf0wpx.jpg"                     "projekte/p48/p48-08.jpg"
dl "$BASE/0/P48-40-6x9kq0j6pnwry8k.jpg"                     "projekte/p48/p48-09.jpg"
dl "$BASE/s/20260204%20Planzeichnung%20Grundriss%20DG%20P48-dpk0bewdh87vrb3.jpg" "projekte/p48/p48-grundriss-dg.jpg"
dl "$BASE/w/20260217%20Planzeichnungen%20Ansicht%20Schnitt%20P48-bm2kf1wx94nx6y5.jpg" "projekte/p48/p48-schnitt.jpg"

# ── AKPL2.2 (Schwabinger Wohnung, Brillux-Story, Mailand-Feeling) ─────
dl "$BASE/k/AKP2-20%20Kopie-twrk2e6qv77vv5r.jpg"            "projekte/akpl22/akpl22-01.jpg"
dl "$BASE/k/AKP2-26%20Kopie-xp0gm3g61zjrz8t.jpg"            "projekte/akpl22/akpl22-02.jpg"
dl "$BASE/m/AKP2-12%20Kopie-hjkmpjv9r98b4az.jpg"            "projekte/akpl22/akpl22-03.jpg"
dl "$BASE/j/AKP2-13%20Kopie-mb2xab6e4strcqx.jpg"            "projekte/akpl22/akpl22-04.jpg"
dl "$BASE/7/AKP2-5%20Kopie-13cdfrfmxjceec7.jpg"             "projekte/akpl22/akpl22-05.jpg"
dl "$BASE/j/AKP2-37%20Kopie-5s3def7d48wgarq.jpg"            "projekte/akpl22/akpl22-06.jpg"
dl "$BASE/j/AKP2-35%20Kopie-ehxw829y2brb1nn.jpg"            "projekte/akpl22/akpl22-07.jpg"
dl "$BASE/c/AKP2-63%20Kopie-07b5qgzspwgj7cs.jpg"            "projekte/akpl22/akpl22-08.jpg"
dl "$BASE/s/AKP2-69%20Kopie-rttkr2xp9dz75r2.jpg"            "projekte/akpl22/akpl22-09.jpg"
dl "$BASE/b/20251104%20Grundriss%20AKPL%202.2-jd6kbcqfhzmzff8.jpg" "projekte/akpl22/akpl22-grundriss.jpg"

# ── LuPo (Stadtpark-Interventionen, konzeptionell, Visionäres) ────────
dl "$BASE/a/20240212%20Wasser%2BPavillon%20LuPo-rm7t666a9r90wwz.jpg"      "projekte/lupo/lupo-01.jpg"
dl "$BASE/j/20230619%20Pavillon%20LuPo-9tnwxdjkee23wdm.jpg"               "projekte/lupo/lupo-02.jpg"
dl "$BASE/j/20240212%20Pavillon%20zugeschnitten%20LuPo-0js0qe1wfyztw6a.jpg" "projekte/lupo/lupo-03.jpg"

# ── Haus W (Berlin-Villa, Schinkel/Farnsworth-Linie) ─────────────────
dl "$BASE/f/_MG_6061-k0behq1hf0qjm7p.jpg"                   "projekte/hausw/hausw-01.jpg"
dl "$BASE/4/_MG_6085a-jgheh5h983375ht.jpg"                  "projekte/hausw/hausw-02.jpg"
dl "$BASE/g/_MG_6640-y7s8aabp044reye.jpg"                   "projekte/hausw/hausw-03.jpg"
dl "$BASE/v/_MG_6613-x4axd0eqq2hv77v.jpg"                   "projekte/hausw/hausw-04.jpg"
dl "$BASE/x/_MG_6650-ta93qpmq9ne2fg9.jpg"                   "projekte/hausw/hausw-05.jpg"

# ── T61 (Denkmalvilla München-Gern, Restauration als Kunst) ──────────
dl "$BASE/m/T61%200001-f12nzrah4sr859n.jpg"                 "projekte/t61/t61-01.jpg"
dl "$BASE/0/DSC_9695%20Kopie-xrjjv12tbwgkhwd.jpg"           "projekte/t61/t61-02.jpg"
dl "$BASE/a/Tizianstr_27-em12n6v4hr4vza0.jpg"               "projekte/t61/t61-03.jpg"
dl "$BASE/a/Tizianstr_15-q8v19tz6a1ekeym.jpg"               "projekte/t61/t61-04.jpg"
dl "$BASE/m/Tizianstr_35-107rgnq2xz0561h.jpg"               "projekte/t61/t61-05.jpg"
dl "$BASE/r/Tizianstr_45-jp8ry3sr3jn6x1k.jpg"               "projekte/t61/t61-06.jpg"
dl "$BASE/7/DSC_0525-9r6kv500chkg5cb.jpg"                   "projekte/t61/t61-07.jpg"

# ── VS15 (5-Zimmer-Familienwohnung, Pariser Bauherrin) ───────────────
dl "$BASE/n/DSCF3942-q5cfkb23zqmm3n2.jpg"                   "projekte/vs15/vs15-01.jpg"
dl "$BASE/k/DSCF4002-hhpqyr4sb9axx4c.jpg"                   "projekte/vs15/vs15-02.jpg"
dl "$BASE/b/DSCF3987-gdsy1xgbpvv3sm9.jpg"                   "projekte/vs15/vs15-03.jpg"
dl "$BASE/d/DSCF3961-j2aaymgc09x335e.jpg"                   "projekte/vs15/vs15-04.jpg"
dl "$BASE/g/DSCF3947-hqdg69dbekqva8x.jpg"                   "projekte/vs15/vs15-05.jpg"

echo ""
echo "✓ Fertig. Strukturcheck:"
find "$DEST" -type f | sort
