import { create } from 'zustand';

export type CursorMode = 'default' | 'crosshairs' | 'hidden';

interface CursorStore {
    isHoveringButton: boolean;
    setHoveringButton: (isHovering: boolean) => void;
    mode: CursorMode;
    setMode: (mode: CursorMode) => void;
}

export const useCursorStore = create<CursorStore>((set) => ({
    isHoveringButton: false,
    setHoveringButton: (isHovering) => set({ isHoveringButton: isHovering }),
    mode: 'default',
    setMode: (mode) => set({ mode }),
}));
