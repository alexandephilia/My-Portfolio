import { AnimatePresence, motion, useMotionValue, useTransform, animate, useSpring } from 'motion/react';
import { CheckCircle2, Download, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useDevice } from './hooks/useDevice';
import { useCursorStore } from './hooks/useCursorStore';

interface DownloadButtonProps {
    href: string;
    fileName?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ href, fileName = "resume.pdf" }) => {
    const [state, setState] = useState<'idle' | 'holding' | 'success'>('idle');
    const [isHovered, setIsHovered] = useState(false);
    const { setHoveringButton } = useCursorStore();
    const stateRef = useRef(state);
    
    // Sync ref with state
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const { isMobile } = useDevice();
    const progress = useMotionValue(0);
    // Magnetic logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const buttonX = useTransform(springX, [-100, 100], [-3, 3]);
    const buttonY = useTransform(springY, [-40, 40], [-2, 2]);

    const overlayX = useTransform(springX, [-100, 100], [-8, 8]);
    const overlayY = useTransform(springY, [-40, 40], [-4, 4]);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        setHoveringButton(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveringButton(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    // Path length for SVG border
    const pathLength = useTransform(progress, [0, 1], [0, 1]);
    const animationControls = useRef<any>(null);

    const triggerDownload = () => {
        setState('success');
        
        // Trigger actual download
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset after success
        setTimeout(() => {
            setState('idle');
            // Reset progress value smoothly
            animate(progress, 0, { duration: 0.5, ease: "easeOut" });
        }, 3000);
    };

    const startHolding = (e: React.PointerEvent) => {
        if (state !== 'idle') return;
        
        setState('holding');
        
        // Clear any existing animation
        if (animationControls.current) animationControls.current.stop();
        
        animationControls.current = animate(progress, 1, {
            duration: 1.5,
            ease: "linear",
            onComplete: () => {
                if (stateRef.current === 'holding') {
                    triggerDownload();
                }
            }
        });
    };

    const stopHolding = () => {
        if (state !== 'holding') return;
        
        const currentProgress = progress.get();
        if (currentProgress < 1) {
            if (animationControls.current) animationControls.current.stop();
            setState('idle');
            // Smoothly animate back to 0
            animate(progress, 0, {
                duration: 0.4,
                ease: "easeOut"
            });
        }
    };

    const idleWidth = isMobile ? 105 : 125;
    const holdWidth = isMobile ? 115 : 135;
    const successWidth = isMobile ? 78 : 92;

    return (
        <motion.button
            onPointerDown={startHolding}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            disabled={state === 'success'}
            style={{ x: buttonX, y: buttonY }}
            animate={{
                width: state === 'idle' ? idleWidth : (state === 'holding' ? holdWidth : successWidth),
                scale: state === 'holding' ? 0.96 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                mass: 1.2
            }}
            className="group relative h-7 md:h-7 rounded-lg text-[8px] md:text-[10px] font-medium active:translate-y-px disabled:cursor-default flex items-center justify-center
                       bg-linear-to-b from-[#f8f9fc] via-[#f0f2f7] to-[#e8ebf2] border border-gray-300/40
                       shadow-[0_4px_8px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
                       hover:shadow-[0_6px_12px_rgba(0,0,0,0.12),0_3px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]
                       touch-none select-none overflow-visible cursor-none"
        >
            {/* SVG Border Progress */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx="8"
                        fill="none"
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth="1.5"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <motion.rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx="8"
                        fill="none"
                        stroke={state === 'success' ? '#10b981' : 'rgb(74,108,196)'}
                        strokeWidth="1.5"
                        pathLength="1"
                        initial={{ pathLength: 0 }}
                        style={{ 
                            pathLength: pathLength
                        }}
                    />
                </svg>
            </div>

            {/* Clipping Vessel - Background Effects */}
            <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {/* Idle Hover Snap - Neutral Black */}
                    {isHovered && state === 'idle' && (
                        <motion.span 
                            layoutId="resume-btn-snap"
                            initial={{ opacity: 0, scale: 0.8, borderRadius: '50%', width: 12, height: 12 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                borderRadius: '8px',
                                width: '100%',
                                height: '100%',
                                left: 0,
                                top: 0
                            }}
                            exit={{ opacity: 0, scale: 0.8, borderRadius: '50%' }}
                            className="absolute z-0 bg-black/95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] pointer-events-none"
                            style={{ x: overlayX, y: overlayY }}
                            transition={{ 
                                type: 'spring', 
                                damping: 30, 
                                stiffness: 400,
                                borderRadius: { duration: 0.2 },
                                width: { duration: 0.2 },
                                height: { duration: 0.2 }
                            }}
                        />
                    )}

                    {/* Active Holding State - Signature Blue Gradient (LO-FI SUBTLE) */}
                    {state === 'holding' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-linear-to-b from-[rgba(74,108,196,0.15)] to-[rgba(74,108,196,0.25)] border-b border-white/20 z-0"
                        />
                    )}

                    {/* Success State - Emerald Green (LOW-OPACITY GLASS) */}
                    {state === 'success' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] z-0"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Content Layer */}
            <div className="relative z-30 flex items-center justify-center w-full">
                <AnimatePresence mode="popLayout" initial={false}>
                    {state === 'idle' && (
                        <motion.div
                            key="idle-txt"
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2.5 whitespace-nowrap transition-colors duration-200 ${isHovered ? 'text-white' : 'text-gray-600'}`}
                        >
                            <Download size={11} className={`${isHovered ? 'text-white' : 'text-gray-500'} transition-colors`} />
                            <span className="text-[7px] md:text-[10px] font-semibold tracking-tight">
                                Download Resume
                            </span>
                        </motion.div>
                    )}
                    {state === 'holding' && (
                        <motion.div
                            key="holding-txt"
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2.5 whitespace-nowrap"
                        >
                            <Loader2 size={10} className="text-[rgb(74,108,196)] animate-spin" />
                            <span className="text-[7px] md:text-[10px] text-[rgb(74,108,196)] font-semibold tracking-tight">
                                Downloading
                            </span>
                        </motion.div>
                    )}
                    {state === 'success' && (
                        <motion.div
                            key="success-txt"
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2.5 whitespace-nowrap"
                        >
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            <span className="text-[7px] md:text-[10px] text-emerald-700 font-semibold tracking-tight">
                                Success
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
};
