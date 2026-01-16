'use client';

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const SECTIONS_CONFIG = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Beyond Work' },
];

export const ScrollTimeline = () => {
    const { scrollYProgress } = useScroll();
    const [scrollValue, setScrollValue] = useState(0);
    const [sectionOffsets, setSectionOffsets] = useState<Record<string, number>>({});
    const [isRevealed, setIsRevealed] = useState(false);
    const mouseYProgress = useMotionValue(-1);

    // Smooth spring for the indicator move
    const smoothedProgress = useSpring(scrollYProgress, {
        damping: 30,
        stiffness: 200,
        restDelta: 0.001
    });

    // Calculate dynamic offsets based on actual element positions
    useEffect(() => {
        const calculateOffsets = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;

            const newOffsets: Record<string, number> = {};
            SECTIONS_CONFIG.forEach((section) => {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const absoluteTop = rect.top + scrollTop;
                    newOffsets[section.id] = Math.min(Math.max(absoluteTop / scrollHeight, 0), 1);
                }
            });
            setSectionOffsets(newOffsets);
        };

        calculateOffsets();
        window.addEventListener('resize', calculateOffsets);
        window.addEventListener('load', calculateOffsets);
        const timer = setTimeout(calculateOffsets, 1000);

        return () => {
            window.removeEventListener('resize', calculateOffsets);
            window.removeEventListener('load', calculateOffsets);
            clearTimeout(timer);
        };
    }, []);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setScrollValue(latest);
    });

    // No longer using global pointerup to auto-clear, as we want "Sticky Reveal" on mobile
    // and explicit dismissal via backdrop click.

    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 640;
    const isTablet = windowWidth < 1024;

    const ticks = Array.from({ length: 101 });

    return (
        <>
            {/* Dynamic Linear Blur Overlay with Dismissal Click */}
            <AnimatePresence>
                {isRevealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] pointer-events-auto cursor-pointer"
                        onClick={() => setIsRevealed(false)}
                        style={{
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            maskImage: 'linear-gradient(to left, black 0%, black 20%, transparent 60%)',
                            WebkitMaskImage: 'linear-gradient(to left, black 0%, black 20%, transparent 60%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="fixed right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-32 z-[100] flex flex-col items-end pointer-events-none group px-1 sm:px-2 lg:px-8">
                {/* The Rail Container */}
                <div
                    className="relative h-[calc(100%-14rem)] sm:h-[calc(100%-10rem)] flex flex-col items-end justify-between mt-16 mb-32 sm:mb-24 mr-0 sm:mr-1 lg:mr-2 pointer-events-auto w-full group/rail"
                    onPointerDown={(e) => {
                        // On mobile, only reveal on double-tap or if already revealed
                        // On desktop, single click reveals
                        if (typeof window !== 'undefined' && window.innerWidth < 640) {
                            // Mobile: require tap on the actual ticks, not the container
                            return;
                        }
                        e.stopPropagation();
                        if (!isRevealed) setIsRevealed(true);
                    }}
                    onPointerEnter={() => {
                        // For desktop hover only
                        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                            setIsRevealed(true);
                        }
                    }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = (e.clientY - rect.top) / rect.height;
                        mouseYProgress.set(Math.min(Math.max(y, 0), 1));
                    }}
                    onMouseLeave={() => {
                        // Desktop hover exit
                        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                            setIsRevealed(false);
                        }
                        mouseYProgress.set(-1);
                    }}
                >
                    {ticks.map((_, i) => {
                        const tickProgress = i / 100;
                        // Surgical fix: Map section to the single closest tick to prevent duplicates
                        const section = SECTIONS_CONFIG.find(s => {
                            const offset = sectionOffsets[s.id];
                            if (offset === undefined) return false;
                            const closestTickIdx = Math.round(offset * 100);
                            return closestTickIdx === i;
                        });
                        const isSection = !!section;

                        return <TickRow
                            key={i}
                            i={i}
                            tickProgress={tickProgress}
                            section={section}
                            isSection={isSection}
                            smoothedProgress={smoothedProgress}
                            mouseYProgress={mouseYProgress}
                            scrollValue={scrollValue}
                            isRevealed={isRevealed}
                            setIsRevealed={setIsRevealed}
                            isMobile={isMobile}
                            isTablet={isTablet}
                        />;
                    })}
                </div>
            </div>
        </>
    );
};

// Extracted Sub-component with isRevealed control
const TickRow = ({ i, tickProgress, section, isSection, smoothedProgress, mouseYProgress, scrollValue, isRevealed, setIsRevealed, isMobile, isTablet }: any) => {

    const distance = useTransform([smoothedProgress, mouseYProgress], ([scroll, mouse]: any) => {
        const scrollDist = Math.abs(tickProgress - (scroll as number));
        const mouseDist = mouse === -1 ? 1 : Math.abs(tickProgress - (mouse as number));
        return Math.min(scrollDist, mouseDist);
    });

    // Transform distance into visual properties (SOFT FADE-OUT WAVE)
    const width = useTransform(
        distance,
        [0, 0.05, 0.15],
        !isRevealed
            ? isMobile
                ? [isSection ? 12 : 6, isSection ? 8 : 4, isSection ? 6 : 2]
                : isTablet
                    ? [isSection ? 18 : 14, isSection ? 12 : 8, isSection ? 10 : 6]
                    : [isSection ? 42 : 32, isSection ? 32 : 16, isSection ? 28 : 12]
            : [isSection ? 42 : 32, isSection ? 32 : 16, isSection ? 28 : 12]
    );

    const opacity = useTransform(
        distance,
        [0, 0.05, 0.12, 0.2],
        [isSection ? 1 : 0.85, isSection ? 0.9 : 0.7, isSection ? 0.6 : 0.3, isSection ? 0.4 : 0.15]
    );

    const scaleY = useTransform(distance, [0, 0.08], [isSection ? 2 : 1, 1]);
    // Translation X - very subtle on mobile unless revealed
    const x = useTransform(
        distance,
        [0, 0.15],
        [isMobile && !isRevealed ? -2 : isTablet && !isRevealed ? -6 : -12, 0]
    );

    const isActive = Math.abs(tickProgress - scrollValue) < 0.0051;

    return (
        <div key={i} className="relative flex items-center justify-end w-full h-1 lg:h-1.5 group/tick-row">
            {/* Click Interaction Area */}
            <div className="absolute inset-y-[-4px] right-0 w-12 sm:w-16 lg:w-24 pointer-events-auto cursor-pointer z-30"
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isRevealed) {
                        // First tap: reveal everything
                        setIsRevealed(true);
                    } else {
                        // Second tap/tap-while-revealed: navigate
                        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                        if (scrollHeight > 0) {
                            window.scrollTo({ top: tickProgress * scrollHeight, behavior: 'smooth' });
                        }
                    }
                }}
            />

            {/* Decimal Value */}
            {isActive && !isSection && (
                <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: (!isMobile || isRevealed) ? 1 : 0, x: 0 }}
                    className="absolute right-14 lg:right-20 font-mono text-[11px] text-blue-600 font-bold tracking-tight pointer-events-none z-20"
                >
                    {scrollValue.toFixed(2)}
                </motion.span>
            )}

            {/* Section Label */}
            {isSection && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isMobile && !isRevealed) {
                            setIsRevealed(true);
                        } else {
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className={`absolute right-14 lg:right-20 flex items-center transition-all duration-300 transform cursor-pointer pointer-events-auto outline-none z-10
            ${isActive
                            ? `text-blue-600 font-bold translate-x-[-8px] lg:translate-x-[-12px] ${(!isMobile || isRevealed) ? 'opacity-100' : 'opacity-0'}`
                            : `text-gray-500 hover:text-gray-900 font-medium translate-x-2 ${isRevealed ? 'opacity-100' : 'opacity-0'} group-hover/rail:opacity-100 group-hover/rail:translate-x-0`
                        }`}
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                        {section.label}
                    </span>
                </button>
            )}

            {/* The Kinetic Tick */}
            <motion.div
                style={{
                    width,
                    opacity,
                    height: scaleY,
                    x,
                    backgroundColor: useTransform(distance, [0, 0.1], [isActive ? '#2563eb' : '#374151', '#9ca3af']),
                    boxShadow: useTransform(distance, [0, 0.05], [isActive ? '0 0 12px rgba(37,99,235,0.8)' : '0 0 0px rgba(0,0,0,0)', '0 0 0px rgba(0,0,0,0)'])
                }}
                className="transition-colors duration-300 pointer-events-none rounded-full z-0"
            />
        </div>
    );
};
