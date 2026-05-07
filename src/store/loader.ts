import { create } from 'zustand';

const SESSION_KEY = 'jba_loader_shown';

export type LoaderPhase =
  | 'idle' // before mount
  | 'svg-draw' // 0–0.6s: vector profile drawing
  | 'sweep' // 0.6–1.2s: rotating "construction"
  | 'reveal' // 1.2–1.8s: edges fade-in
  | 'fade-out' // 1.8–2.4s: overlay fades, hero revealed
  | 'done'; // hidden

interface LoaderState {
  shouldShow: boolean;
  phase: LoaderPhase;
  setPhase: (p: LoaderPhase) => void;
  markDone: () => void;
}

function readShown(): boolean {
  if (typeof sessionStorage === 'undefined') return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeShown(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore quota / privacy mode */
  }
}

export const useLoader = create<LoaderState>((set) => {
  const alreadyShown = readShown();
  return {
    shouldShow: !alreadyShown,
    phase: alreadyShown ? 'done' : 'idle',
    setPhase: (p) => set({ phase: p }),
    markDone: () => {
      writeShown();
      set({ phase: 'done', shouldShow: false });
    },
  };
});
