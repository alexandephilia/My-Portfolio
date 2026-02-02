import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { useCursorStore } from './hooks/useCursorStore';

// Crosshairs corner bracket component
const CrosshairCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const rotations = { tl: 0, tr: 90, bl: -90, br: 180 };
    const positions = {
        tl: { top: -24, left: -24 },
        tr: { top: -24, right: -24 },
        bl: { bottom: -24, left: -24 },
        br: { bottom: -24, right: -24 },
    };

    return (
        <div
            className="absolute w-3 h-3 pointer-events-none"
            style={{ ...positions[position] }}
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ transform: `rotate(${rotations[position]}deg)` }}
            >
                <path
                    d="M1 11V1H11"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                />
            </svg>
        </div>
    );
};

export const CustomCursor = () => {
    const [isPointer, setIsPointer] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const lastTargetRef = useRef<HTMLElement | null>(null);
    const lastIsPointerRef = useRef(false);

    const springConfig = { damping: 25, stiffness: 450 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const { isHoveringButton, mode } = useCursorStore();

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement | null;
            if (!target) return;

            if (target !== lastTargetRef.current) {
                const isClickable =
                    target.closest('button') ||
                    target.closest('a') ||
                    target.closest('[role="button"]') ||
                    window.getComputedStyle(target).cursor === 'pointer';

                lastTargetRef.current = target;
                if (lastIsPointerRef.current !== !!isClickable) {
                    lastIsPointerRef.current = !!isClickable;
                    setIsPointer(!!isClickable);
                }
            }
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    const isCrosshairs = mode === 'crosshairs';
    const isHidden = mode === 'hidden' || isHoveringButton;

    return (
        <AnimatePresence>
            {!isHidden && (
                isCrosshairs ? (
                    // Crosshairs mode - transforms into corner brackets
                    <motion.div
                        key="crosshairs"
                        className="fixed top-0 left-0 pointer-events-none z-[9999]"
                        style={{
                            translateX: cursorXSpring,
                            translateY: cursorYSpring,
                        }}
                    >
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                            transition={{ 
                                type: 'spring', 
                                damping: 25, 
                                stiffness: 400,
                                mass: 0.8 
                            }}
                        >
                            <CrosshairCorner position="tl" />
                            <CrosshairCorner position="tr" />
                            <CrosshairCorner position="bl" />
                            <CrosshairCorner position="br" />
                        </motion.div>
                    </motion.div>
                ) : (
                    // Default dot cursor
                    <motion.div
                        key="default"
                        className="fixed top-0 left-0 w-3 h-3 bg-black rounded-full pointer-events-none z-[9999] hidden md:block shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: 1, 
                            scale: isPointer ? [1.5, 1.6, 1.5] : [1, 1.2, 1] 
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={{
                            translateX: cursorXSpring,
                            translateY: cursorYSpring,
                            left: -6,
                            top: -6,
                        }}
                        transition={{
                            scale: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                            default: {
                                type: 'spring',
                                damping: 25,
                                stiffness: 400,
                                mass: 0.8
                            }
                        }}
                    />
                )
            )}
        </AnimatePresence>
    );
};
