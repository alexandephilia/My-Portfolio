import { create } from 'zustand';

interface CursorStore {
    isHoveringButton: boolean;
    setHoveringButton: (isHovering: boolean) => void;
}

export const useCursorStore = create<CursorStore>((set) => ({
    isHoveringButton: false,
    setHoveringButton: (isHovering) => set({ isHoveringButton: isHovering }),
}));
