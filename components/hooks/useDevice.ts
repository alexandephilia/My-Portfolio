import { useState, useEffect } from 'react';

/**
 * Optimized viewport detection hook.
 * Uses a single listener per component, or can be extended for a layout-level provider.
 */
export const useDevice = () => {
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return false;
    });

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return true;
    });

    const [isTablet, setIsTablet] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 640 && window.innerWidth < 1024;
        }
        return false;
    });

    useEffect(() => {
        const check = () => {
            const width = window.innerWidth;
            setIsDesktop(width >= 768);
            setIsMobile(width < 768);
            setIsTablet(width >= 640 && width < 1024);
        };

        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return { isDesktop, isMobile, isTablet };
};
