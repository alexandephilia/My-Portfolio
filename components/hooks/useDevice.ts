import { useSyncExternalStore } from 'react';

type DeviceState = {
    isDesktop: boolean;
    isMobile: boolean;
    isTablet: boolean;
};

const getDeviceState = (): DeviceState => {
    if (typeof window === 'undefined') {
        return { isDesktop: false, isMobile: true, isTablet: false };
    }
    const width = window.innerWidth;
    return {
        isDesktop: width >= 768,
        isMobile: width < 768,
        isTablet: width >= 640 && width < 1024,
    };
};

let currentState: DeviceState = getDeviceState();
const listeners = new Set<() => void>();
let resizeListenerAttached = false;
let rafId: number | null = null;

const notifyIfChanged = () => {
    const next = getDeviceState();
    if (
        next.isDesktop === currentState.isDesktop &&
        next.isMobile === currentState.isMobile &&
        next.isTablet === currentState.isTablet
    ) {
        return;
    }
    currentState = next;
    listeners.forEach((listener) => listener());
};

const scheduleUpdate = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
        rafId = null;
        notifyIfChanged();
    });
};

const ensureListener = () => {
    if (resizeListenerAttached || typeof window === 'undefined') return;
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    resizeListenerAttached = true;
};

const removeListener = () => {
    if (!resizeListenerAttached || typeof window === 'undefined') return;
    window.removeEventListener('resize', scheduleUpdate as EventListener);
    resizeListenerAttached = false;
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    ensureListener();
    scheduleUpdate();
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            removeListener();
        }
    };
};

const getSnapshot = () => currentState;
const getServerSnapshot = () => ({ isDesktop: false, isMobile: true, isTablet: false });

export const useDevice = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
