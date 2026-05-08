import { create } from 'zustand';

export type CursorVariant = 'default' | 'link' | 'image' | 'three' | 'hidden';

interface CursorState {
  variant: CursorVariant;
  setVariant: (v: CursorVariant) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  variant: 'default',
  setVariant: (variant) => set({ variant }),
}));
