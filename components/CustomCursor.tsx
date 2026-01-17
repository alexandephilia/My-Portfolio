import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useCursorStore } from './hooks/useCursorStore';

export const CustomCursor = () => {
    const [isPointer, setIsPointer] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 450 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const { isHoveringButton } = useCursorStore();

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Check if the current element or its parent is a link or button
            const target = e.target as HTMLElement;
            const isClickable = 
                target.closest('button') || 
                target.closest('a') || 
                target.closest('[role="button"]') ||
                window.getComputedStyle(target).cursor === 'pointer';
            
            setIsPointer(!!isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    return (
        <AnimatePresence>
            {!isHoveringButton && (
                <motion.div
                    className="fixed top-0 left-0 w-3 h-3 bg-black rounded-full pointer-events-none z-[9999] hidden md:block shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ 
                        opacity: 1, 
                        scale: isPointer ? 1.5 : [1, 1.3, 1] 
                    }}
                    exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.1 } }}
                    style={{
                        translateX: cursorXSpring,
                        translateY: cursorYSpring,
                        left: -6,
                        top: -6,
                    }}
                    transition={{
                        scale: isPointer 
                            ? { type: 'spring', damping: 20, stiffness: 300 }
                            : { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.2 }
                    }}
                />
            )}
        </AnimatePresence>
    );
};
