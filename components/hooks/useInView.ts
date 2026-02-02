import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight in-view hook using IntersectionObserver.
 * Defaults are tuned to start slightly before the element enters view.
 */
export const useInView = <T extends Element>(
    rootMargin: string = '0px',
    threshold: number = 0.1
) => {
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { root: null, rootMargin, threshold }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [rootMargin, threshold]);

    return { ref, inView };
};
