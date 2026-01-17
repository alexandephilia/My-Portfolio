'use client';

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { useDevice } from './hooks/useDevice';

const SECTIONS_CONFIG = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Beyond Work' },
];

export const ScrollTimeline = () => {
    const { scrollYProgress } = useScroll();
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

    const { isMobile, isTablet } = useDevice();

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
                    onPointerEnter={() => {
                        // Desktop only - hover to reveal
                        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                            setIsRevealed(true);
                        }
                    }}
                    onMouseMove={(e) => {
                        // Desktop only
                        if (typeof window === 'undefined' || window.innerWidth < 1024) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = (e.clientY - rect.top) / rect.height;
                        mouseYProgress.set(Math.min(Math.max(y, 0), 1));
                    }}
                    onMouseLeave={() => {
                        // Desktop only - hover exit
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
                            scrollYProgress={scrollYProgress}
                            isRevealed={isRevealed}
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
const TickRow = ({ i, tickProgress, section, isSection, smoothedProgress, mouseYProgress, scrollYProgress, isRevealed, isMobile, isTablet }: any) => {

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

    // [!] Deriving active state via transform to avoid re-renders
    const isActiveValue = useTransform(scrollYProgress, (scroll: any) => {
        return Math.abs(tickProgress - (scroll as number)) < 0.0051;
    });

    return (
        <div key={i} className="relative flex items-center justify-end w-full h-1 lg:h-1.5 group/tick-row">
            {/* Click Interaction Area - Desktop only */}
            {!isMobile && (
                <div className="absolute inset-y-[-4px] right-0 w-12 lg:w-24 pointer-events-auto cursor-pointer z-30"
                    onClick={(e) => {
                        e.stopPropagation();
                        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                        if (scrollHeight > 0) {
                            window.scrollTo({ top: tickProgress * scrollHeight, behavior: 'smooth' });
                        }
                    }}
                />
            )}

            {/* Decimal Value - Desktop only - Now reacts to MotionValue */}
            {!isSection && !isMobile && (
                <ScrollValueLabel tickProgress={tickProgress} scrollYProgress={scrollYProgress} />
            )}

            {/* Section Label - Desktop only */}
            {isSection && !isMobile && (
                <SectionLabel 
                    section={section} 
                    tickProgress={tickProgress} 
                    scrollYProgress={scrollYProgress} 
                    isRevealed={isRevealed} 
                />
            )}

            {/* The Kinetic Tick */}
            <motion.div
                style={{
                    width,
                    opacity,
                    height: scaleY,
                    x,
                    backgroundColor: useTransform([distance, scrollYProgress], ([d, s]: any) => {
                        const active = Math.abs(tickProgress - (s as number)) < 0.0051;
                        if (active) return '#2563eb';
                        return d < 0.1 ? '#374151' : '#9ca3af';
                    }),
                    boxShadow: useTransform([distance, scrollYProgress], ([d, s]: any) => {
                        const active = Math.abs(tickProgress - (s as number)) < 0.0051;
                        if (active && (d as number) < 0.05) return '0 0 12px rgba(37,99,235,0.8)';
                        return '0 0 0px rgba(0,0,0,0)';
                    })
                }}
                className="pointer-events-none rounded-full z-0"
            />
        </div>
    );
};

// Small isolated component for the scroll percentage to avoid parent re-renders
const ScrollValueLabel = ({ tickProgress, scrollYProgress }: any) => {
    const [localValue, setLocalValue] = useState<string | null>(null);

    useMotionValueEvent(scrollYProgress, "change", (latest: any) => {
        const value = latest as number;
        const isActive = Math.abs(tickProgress - value) < 0.0051;
        if (isActive) {
            setLocalValue(value.toFixed(2));
        } else if (localValue !== null) {
            setLocalValue(null);
        }
    });

    if (localValue === null) return null;

    return (
        <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-14 lg:right-20 font-mono text-[11px] text-blue-600 font-bold tracking-tight pointer-events-none z-20"
        >
            {localValue}
        </motion.span>
    );
};

// Small isolated component for the section label
const SectionLabel = ({ section, tickProgress, scrollYProgress, isRevealed }: any) => {
    const [isActive, setIsActive] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (latest: any) => {
        const active = Math.abs(tickProgress - (latest as number)) < 0.0051;
        if (active !== isActive) setIsActive(active);
    });

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`absolute right-14 lg:right-20 flex items-center transform cursor-pointer pointer-events-auto outline-none z-10 transition-all duration-200
            ${isActive
                    ? `text-blue-600 font-bold translate-x-[-8px] lg:translate-x-[-12px] opacity-100`
                    : `text-gray-500 hover:text-gray-900 font-medium translate-x-2 ${isRevealed ? 'opacity-100' : 'opacity-0'} group-hover/rail:opacity-100 group-hover/rail:translate-x-0`
                }`}
        >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                {section.label}
            </span>
        </button>
    );
};

