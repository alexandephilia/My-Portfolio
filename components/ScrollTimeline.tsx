'use client';

import { AnimatePresence, motion, MotionValue, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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

    // Smooth spring for the indicator move (Physics Source)
    // Damping 25: Adds notable overshoot/bounce to the position itself
    const smoothedProgress = useSpring(scrollYProgress, {
        damping: 22,
        stiffness: 90,
        restDelta: 0.001
    });

    // --- PHYSICS ENGINE ---
    // 1. Get velocity of the spring (the "puck") rather than raw scroll for connected feel
    const velocity = useVelocity(smoothedProgress);

    // 2. Smooth the velocity for visual transforms (shear/scale) to avoid jitter
    const physicsVelocity = useSpring(velocity, {
        damping: 15,
        stiffness: 200,
        mass: 0.5
    });

    // 3. Wake Factor: Expands the "active zone" based on speed
    // At rest (0 speed) = 1 (normal size)
    // At high speed = higher divisor (larger active area)
    const wakeFactor = useTransform(physicsVelocity, (v) => 1 + Math.abs(v) * 0.5); // Tuned for impact

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

            <div className="fixed right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-32 z-[100] flex flex-col items-end pointer-events-none group">
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
                    {/* GLOBAL FLOATING INDICATOR */}
                    <FloatingScrollIndicator
                        progressValues={smoothedProgress} // Using SPRING physics
                        sectionOffsets={sectionOffsets}
                        isMobile={isMobile}
                    />

                    {ticks.map((_, i) => {
                        const tickProgress = i / 100;
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
                            // Physics Props
                            physicsVelocity={physicsVelocity}
                            wakeFactor={wakeFactor}
                        />;
                    })}
                </div>
            </div>
        </>
    );
};

// --- Components ---

// 1. Floating Scroll Indicator (ULTRA-ELASTIC JELLY)
// - Uses useVelocity to distort text based on speed
const FloatingScrollIndicator = ({ progressValues, sectionOffsets, isMobile }: any) => {
    if (isMobile) return null;

    const yPercent = useTransform(progressValues, [0, 1], ["0%", "100%"]);

    // 1. Calculate Velocity
    const velocity = useVelocity(progressValues);

    // 2. High-Oscillation Spring for "Wobble" Effect
    // OVERDRIVE: Lower damping (7) + High stiffness (220) = High energy "ringing" oscillation
    const smoothVelocity = useSpring(velocity, {
        damping: 7,
        stiffness: 220,
        mass: 0.5
    });

    // 3. Deformations (High G-Force Simulation)
    // Tamed Skew: Keeping text characters appearing "normal" (very subtle tilt)
    const skewY = useTransform(smoothVelocity, [-3, 3], [-6, 6]);

    // Extreme Stretch (ScaleY) and Squash (ScaleX)
    const scaleY = useTransform(smoothVelocity, (v) => 1 + Math.abs(v as number) * 1);
    const scaleX = useTransform(smoothVelocity, (v) => 1 / (1 + Math.abs(v as number) * 1.6));

    // Rotation: The primary source of the "Wavy" pull
    const rotate = useTransform(smoothVelocity, [-3, 3], [-32, 32]);

    // High-Intensity Lag
    const yLag = useTransform(smoothVelocity, [-3, 3], [22, -22]);
    const yCombined = useTransform(yLag, (lag) => `calc(-50% + ${lag}px)`);

    const numberRef = useRef<HTMLSpanElement>(null);

    useMotionValueEvent(progressValues, "change", (latest) => {
        if (numberRef.current) {
            numberRef.current.innerText = (latest as number).toFixed(2);
        }
    });

    const opacity = useTransform(progressValues, (current: number) => {
        let minDist = 1;
        const offsets = Object.values(sectionOffsets) as number[];
        for (let i = 0; i < offsets.length; i++) {
            const dist = Math.abs(current - offsets[i]);
            if (dist < minDist) minDist = dist;
        }
        if (minDist < 0.02) return 0;
        if (minDist < 0.05) return (minDist - 0.02) / 0.03;
        return 1;
    });

    return (
        <motion.div
            style={{
                top: yPercent,
                // Removed marginTop: '-50%' (CSS margin-top percent is relative to width, which was WRONG)
                // Use y transform instead for proper centering
                y: yCombined,
                opacity,
                skewY,
                scaleY,
                scaleX,
                rotate,
            }}
            className="absolute left-0 lg:left-0 pointer-events-none z-20 flex items-center justify-start pl-10 origin-left"
        >
            <span
                ref={numberRef}
                className="font-mono text-[11px] text-blue-600 font-bold tracking-tight bg-transparent block"
            >
                0.00
            </span>
        </motion.div>
    );
};


// 2. Tick Row
const TickRow = ({
    i,
    tickProgress,
    section,
    isSection,
    smoothedProgress,
    mouseYProgress,
    scrollYProgress,
    isRevealed,
    isMobile,
    isTablet,
    physicsVelocity, // Received from parent
    wakeFactor       // Received from parent (scaling factor > 1)
}: any) => {

    // PHYSICS-ENHANCED DISTANCE CALCULATION
    const distance = useTransform(
        [smoothedProgress, mouseYProgress, wakeFactor],
        ([scroll, mouse, wake]: any) => {
            const scrollDist = Math.abs(tickProgress - (scroll as number));
            const mouseDist = mouse === -1 ? 1 : Math.abs(tickProgress - (mouse as number));

            // "The Wake Effect": Divide actual distance by the wake factor.
            // If dragging fast, wake > 1, so effective distance becomes smaller,
            // causing the transforms (width/opacity) to activate further away.
            return Math.min(scrollDist, mouseDist) / (wake || 1);
        }
    );

    // PHYSICS-ENHANCED SHEAR
    // When expanding/moving fast, the ticks "shear" or tilt in the wind
    const skewY = useTransform(physicsVelocity || new MotionValue(0), [-2, 2], [30, -30]);

    // Stretch effect to maintain volume
    const scaleX = useTransform(physicsVelocity || new MotionValue(0), (v: any) => 1 - Math.abs(v || 0) * 0.1);

    const width = useTransform(distance, [0, 0.05, 0.15],
        !isRevealed
            ? isMobile
                ? [isSection ? 12 : 6, isSection ? 8 : 4, isSection ? 6 : 2]
                : isTablet
                    ? [isSection ? 18 : 14, isSection ? 12 : 8, isSection ? 10 : 6]
                    : [isSection ? 42 : 32, isSection ? 32 : 16, isSection ? 28 : 12]
            : [isSection ? 42 : 32, isSection ? 32 : 16, isSection ? 28 : 12]
    );

    const opacity = useTransform(distance, [0, 0.05, 0.12, 0.2],
        [isSection ? 1 : 0.85, isSection ? 0.9 : 0.7, isSection ? 0.6 : 0.3, isSection ? 0.4 : 0.15]
    );

    const scaleY = useTransform(distance, [0, 0.08], [isSection ? 2 : 1, 1]);
    const x = useTransform(distance, [0, 0.15],
        [isMobile && !isRevealed ? -2 : isTablet && !isRevealed ? -6 : -4, 0]
    );

    return (
        <div className="relative flex items-center justify-end w-full h-1 lg:h-1.5 group/tick-row">
            {!isMobile && (
                <div className="absolute inset-y-[-4px] right-0 w-12 lg:w-24 pointer-events-auto cursor-pointer z-30"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Smooth scroll
                        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                        if (scrollHeight > 0) window.scrollTo({ top: tickProgress * scrollHeight, behavior: 'smooth' });
                    }}
                />
            )}

            {isSection && !isMobile && (
                <SectionLabel
                    section={section}
                    distance={distance}
                    isRevealed={isRevealed}
                />
            )}

            <motion.div
                style={{
                    width,
                    opacity,
                    height: scaleY,
                    x,
                    skewY,   // Applied Physics
                    scaleX,  // Applied Physics
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
                className="pointer-events-none rounded-full z-0 origin-right transition-colors" // Added origin-right for proper shear anchoring
            />
        </div>
    );
};

// 3. Section Label (WAVY PHYSICS)
const SectionLabel = ({ section, distance, isRevealed }: { section: any, distance: MotionValue<number>, isRevealed: boolean }) => {
    const revealedMV = useMotionValue(isRevealed ? 1 : 0);

    useEffect(() => {
        revealedMV.set(isRevealed ? 1 : 0);
    }, [isRevealed, revealedMV]);

    const x = useTransform(distance, [0, 0.05, 0.25], [-35, -15, 0]);
    const scale = useTransform(distance, [0, 0.05], [1.2, 1]);
    const color = useTransform(distance, (d: number) => d < 0.02 ? '#2563eb' : '#6b7280');
    const weight = useTransform(distance, (d: number) => d < 0.02 ? 700 : 500);

    const opacity = useTransform([distance, revealedMV], ([d, r]) => {
        if ((r as number) > 0.5) return 1;
        return (d as number) < 0.03 ? 1 : 0;
    });

    return (
        <motion.button
            style={{ x, scale, opacity, color, fontWeight: weight }}
            onClick={(e) => {
                e.stopPropagation();
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="absolute right-0 lg:right-20 flex items-center justify-end transform cursor-pointer pointer-events-auto outline-none z-10 origin-right transition-colors"
        >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                {section.label}
            </span>
        </motion.button>
    );
};
