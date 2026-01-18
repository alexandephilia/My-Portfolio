import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import {
    SiDocker,
    SiReact,
    SiTailwindcss
} from 'react-icons/si';
import { antiFlickerStyle } from './animations';
import { useDevice } from './hooks/useDevice';

// Custom Vite icon with gradient
const ViteIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={size} height={size}>
        <defs>
            <linearGradient id="vite-a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(0 .937) scale(.3122)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#41d1ff" />
                <stop offset="1" stopColor="#bd34fe" />
            </linearGradient>
            <linearGradient id="vite-b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(0 .937) scale(.3122)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffea83" />
                <stop offset=".083" stopColor="#ffdd35" />
                <stop offset="1" stopColor="#ffa800" />
            </linearGradient>
        </defs>
        <path fill="url(#vite-a)" d="M124.766 19.52 67.324 122.238c-1.187 2.121-4.234 2.133-5.437.024L3.305 19.532c-1.313-2.302.652-5.087 3.261-4.622L64.07 25.187a3.09 3.09 0 0 0 1.11 0l56.3-10.261c2.598-.473 4.575 2.289 3.286 4.594Zm0 0" />
        <path fill="url(#vite-b)" d="M91.46 1.43 48.954 9.758a1.56 1.56 0 0 0-1.258 1.437l-2.617 44.168a1.563 1.563 0 0 0 1.91 1.614l11.836-2.735a1.562 1.562 0 0 1 1.88 1.836l-3.517 17.219a1.562 1.562 0 0 0 1.985 1.805l7.308-2.223c1.133-.344 2.223.652 1.985 1.812l-5.59 27.047c-.348 1.692 1.902 2.614 2.84 1.164l.625-.968 34.64-69.13c.582-1.16-.421-2.48-1.69-2.234l-12.185 2.352a1.558 1.558 0 0 1-1.793-1.965l7.95-27.562A1.56 1.56 0 0 0 91.46 1.43Zm0 0" />
    </svg>
);

// Custom Next.js icon
const NextjsIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={size} height={size}>
        <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z" />
    </svg>
);

// Custom Node.js icon
const NodejsIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={size} height={size}>
        <path fill="#83CD29" d="M112.771 30.334L68.674 4.729c-2.781-1.584-6.402-1.584-9.205 0L14.901 30.334C12.031 31.985 10 35.088 10 38.407v51.142c0 3.319 2.084 6.423 4.954 8.083l11.775 6.688c5.628 2.772 7.617 2.772 10.178 2.772 8.333 0 13.093-5.039 13.093-13.828v-50.49c0-.713-.371-1.774-1.071-1.774h-5.623C42.594 41 41 42.061 41 42.773v50.49c0 3.896-3.524 7.773-10.11 4.48L18.723 90.73c-.424-.23-.723-.693-.723-1.181V38.407c0-.482.555-.966.982-1.213l44.424-25.561c.415-.235 1.025-.235 1.439 0l43.882 25.555c.42.253.272.722.272 1.219v51.142c0 .488.183.963-.232 1.198l-44.086 25.576c-.378.227-.847.227-1.261 0l-11.307-6.749c-.341-.198-.746-.269-1.073-.086-3.146 1.783-3.726 2.02-6.677 3.043-.726.253-1.797.692.41 1.929l14.798 8.754a9.294 9.294 0 004.647 1.246c1.642 0 3.25-.426 4.667-1.246l43.885-25.582c2.87-1.672 4.23-4.764 4.23-8.083V38.407c0-3.319-1.36-6.414-4.229-8.073zM77.91 81.445c-11.726 0-14.309-3.235-15.17-9.066-.1-.628-.633-1.379-1.272-1.379h-5.731c-.709 0-1.279.86-1.279 1.566 0 7.466 4.059 16.512 23.453 16.512 14.039 0 22.088-5.455 22.088-15.109 0-9.572-6.467-12.084-20.082-13.886-13.762-1.819-15.16-2.738-15.16-5.962 0-2.658 1.184-6.203 11.374-6.203 9.105 0 12.461 1.954 13.842 8.091.118.577.645.991 1.24.991h5.754c.354 0 .692-.143.94-.396.24-.272.367-.613.335-.979-.891-10.568-7.912-15.493-22.112-15.493-12.631 0-20.166 5.334-20.166 14.275 0 9.698 7.497 12.378 19.622 13.577 14.505 1.422 15.633 3.542 15.633 6.395 0 4.955-3.978 7.066-13.309 7.066z" />
    </svg>
);

// Custom Framer Motion icon
const FramerMotionIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 12" width={size * (34 / 12)} height={size}>
        <path d="M 12.838 0 L 6.12 11.989 L 0 11.989 L 5.245 2.628 C 6.059 1.176 8.088 0 9.778 0 Z M 27.846 2.997 C 27.846 1.342 29.216 0 30.906 0 C 32.596 0 33.966 1.342 33.966 2.997 C 33.966 4.653 32.596 5.995 30.906 5.995 C 29.216 5.995 27.846 4.653 27.846 2.997 Z M 13.985 0 L 20.105 0 L 13.387 11.989 L 7.267 11.989 Z M 21.214 0 L 27.334 0 L 22.088 9.362 C 21.275 10.813 19.246 11.989 17.556 11.989 L 14.496 11.989 Z" fill="currentColor"></path>
    </svg>
);

// Custom Cursor AI icon - using local image
const CursorIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <img
        src="/cursor.png"
        alt="Cursor AI"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
    />
);

// Icon configurations for each hover word - positioned around text edges
const agnosticIcons = [
    { Icon: SiReact, color: '#61DAFB', position: 'bottom-left', to: { x: -28, y: 12 } },
    { Icon: NextjsIcon, color: '', position: 'top', to: { x: -70, y: -14 }, isCustom: true },
    { Icon: ViteIcon, color: '', position: 'bottom-right', to: { x: 18, y: 12 }, isCustom: true },
    { Icon: NodejsIcon, color: '', position: 'right', to: { x: 14, y: -37 }, isCustom: true },
];

const adaptiveIcons = [
    { Icon: SiTailwindcss, color: '#06B6D4', position: 'bottom-left', to: { x: -28, y: 12 } },
    { Icon: SiDocker, color: '#2496ED', position: 'top', to: { x: -30, y: -14 } },
    { Icon: CursorIcon, color: '', position: 'bottom-right', to: { x: 18, y: 12 }, isCustom: true },
    { Icon: FramerMotionIcon, color: '', position: 'right', to: { x: 24, y: -31 }, isCustom: true },
];

interface IconConfig {
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    color: string;
    position: string;
    to: { x: number; y: number };
    isCustom?: boolean;
}

interface IconScatterProps {
    children: React.ReactNode;
    icons: IconConfig[];
    externalOpen?: boolean;
}

const IconScatter: React.FC<IconScatterProps> = ({ children, icons, externalOpen = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const { isDesktop } = useDevice();
    const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Determine final open state
    const isOpen = isHovered || isTouched || externalOpen;

    // Responsive sizes
    const containerSize = isDesktop ? 'w-10 h-10' : 'w-7 h-7';
    const iconSize = isDesktop ? 20 : 14;
    const marginOffset = isDesktop ? '-20px' : '-14px';

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (touchTimeoutRef.current) {
                clearTimeout(touchTimeoutRef.current);
            }
        };
    }, []);

    // Handle touch - show icons for a duration then auto-hide
    const handleTouch = () => {
        if (isDesktop) return;

        // Clear any existing timeout
        if (touchTimeoutRef.current) {
            clearTimeout(touchTimeoutRef.current);
        }

        setIsTouched(true);

        // Auto-hide after 1.5 seconds
        touchTimeoutRef.current = setTimeout(() => {
            setIsTouched(false);
        }, 1500);
    };

    // Get starting position based on position name
    const getStartPosition = (position: string) => {
        switch (position) {
            case 'left': return { left: '0%', top: '50%' };
            case 'right': return { left: '100%', top: '50%' };
            case 'top': return { left: '50%', top: '0%' };
            case 'bottom': return { left: '50%', top: '100%' };
            case 'top-left': return { left: '20%', top: '0%' };
            case 'top-right': return { left: '80%', top: '0%' };
            case 'bottom-left': return { left: '20%', top: '100%' };
            case 'bottom-right': return { left: '80%', top: '100%' };
            default: return { left: '50%', top: '50%' };
        }
    };

    // Scale down positions for mobile
    const getScaledPosition = (to: { x: number; y: number }) => {
        if (isDesktop) return to;
        return { x: to.x * 0.6, y: to.y * 0.6 };
    };

    return (
        <span
            className="relative inline-block cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouch}
        >
            {/* Scattered icons */}
            {icons.map((item, idx) => {
                const startPos = getStartPosition(item.position);
                const scaledTo = getScaledPosition(item.to);
                return (
                    <motion.span
                        key={idx}
                        className="absolute pointer-events-none"
                        style={{
                            left: startPos.left,
                            top: startPos.top,
                            zIndex: 10,
                            marginLeft: marginOffset,
                            marginTop: marginOffset,
                        }}
                        initial={false}
                        animate={{
                            x: isOpen ? scaledTo.x : 0,
                            y: isOpen ? scaledTo.y : 0,
                            opacity: isOpen ? 1 : 0,
                            scale: isOpen ? 1 : 0.6,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: isOpen ? 350 : 280,
                            damping: isOpen ? 22 : 28,
                            mass: 1,
                            delay: isOpen ? idx * 0.04 : (icons.length - idx) * 0.02,
                        }}
                    >
                        <span
                            className={`flex items-center justify-center ${containerSize} rounded-full`}
                            style={{
                                background: 'linear-gradient(180deg, #ffffff 0%, #d4d4d4 100%)',
                                boxShadow: isDesktop
                                    ? '0 3px 10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
                                    : '0 2px 6px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                                padding: '2px',
                            }}
                        >
                            {item.isCustom ? (
                                <item.Icon size={iconSize} />
                            ) : (
                                <item.Icon size={iconSize} color={item.color} />
                            )}
                        </span>
                    </motion.span>
                );
            })}

            {/* Text - blue color */}
            <span className="font-serif italic font-normal text-[rgb(74,108,196)] relative z-0" style={{ fontSize: 'inherit' }}>
                {children}
            </span>
        </span>
    );
};


// Component to revealing text highlight without layout shift
// Uses the "Reserve & Overlay" pattern:
// 1. Static relative base reserves space
// 2. Absolute overlay animates in
const RevealHighlight: React.FC<{
    text: string;
    baseClassName?: string;
    overlayClassName?: string;
    delay?: number;
    duration?: number;
}> = ({ text, baseClassName = "", overlayClassName = "", delay = 0, duration = 0.8 }) => (
    <span className="relative inline-block whitespace-nowrap">
        <span className={`relative z-0 px-1 ${baseClassName}`}>
            {text}
        </span>
        <motion.span
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration, delay, ease: "circOut" }}
            className={`absolute inset-0 z-10 px-1 ${overlayClassName}`}
        >
            {text}
        </motion.span>
    </span>
);

export const Hero: React.FC = () => {
    const { isDesktop } = useDevice();
    const [revealSequence, setRevealSequence] = useState({ agnostic: false, adaptive: false });

    // Pointer tracking for parallax grid
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth transition for the parallax movement
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    // Transform mouse position to subtle grid shifts (Opposition move)
    const gridX = useTransform(smoothX, [0, 800], [15, -15]);
    const gridY = useTransform(smoothY, [0, 600], [15, -15]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDesktop) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    // Optimize: Single sequential execution for reveal logic
    useEffect(() => {
        let active = true;
        
        const trigger = async () => {
            await new Promise(r => setTimeout(r, 1200));
            if (!active) return;
            setRevealSequence(s => ({ ...s, agnostic: true }));
            
            await new Promise(r => setTimeout(r, 1200));
            if (!active) return;
            setRevealSequence(s => ({ ...s, agnostic: false, adaptive: true }));
            
            await new Promise(r => setTimeout(r, 1200));
            if (!active) return;
            setRevealSequence(s => ({ ...s, adaptive: false }));
        };

        trigger();
        return () => { active = false; };
    }, []);

    return (
        <div 
            className="p-6 md:p-10 border-b border-dashed border-gray-200 bg-[#FAFAFA] relative overflow-hidden group/hero"
            onMouseMove={handleMouseMove}
        >
            {/* Asymmetric Grid Layers */}
            <div className="absolute -inset-x-[10%] -inset-y-[10%] pointer-events-none z-0">
                {/* Base Grid - Constant Visibility */}
                <motion.div 
                    className="absolute inset-0 opacity-[0.15]"
                    style={{ x: gridX, y: gridY }}
                >
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hero-grid-base" width="50" height="50" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(74,108,196,0.5)" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hero-grid-base)" />
                    </svg>
                </motion.div>

                {/* Blue Ghost Trail Grid - Reactive to Pointer */}
                <motion.div 
                    className="absolute inset-0 opacity-80"
                    style={{ 
                        x: gridX, 
                        y: gridY,
                        maskImage: useTransform([smoothX, smoothY], ([x, y]: any) => 
                            `radial-gradient(400px circle at ${x}px ${y}px, black 0%, transparent 65%)`
                        ),
                        WebkitMaskImage: useTransform([smoothX, smoothY], ([x, y]: any) => 
                            `radial-gradient(400px circle at ${x}px ${y}px, black 0%, transparent 65%)`
                        ),
                    }}
                >
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hero-grid-ghost" width="50" height="50" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="2" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hero-grid-ghost)" />
                    </svg>
                </motion.div>
            </div>

            {/* Content Layer - ensuring it stays above background */}
            <div className="relative z-10 pointer-events-none md:pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, filter: 'blur(14px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="flex flex-wrap gap-2 md:gap-3 mb-6"
            >
                {['AI AUGMENTED DEV', 'FULL STACK FRAMEWORK', '8+ EXPERIENCE'].map((tag, i) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-linear-to-b from-[#f8f9fc] via-[#f0f2f7] to-[#e8ebf2] border border-gray-300/70 shadow-[0_4px_8px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] text-[7px] md:text-[9.5px] font-bold tracking-wider text-gray-600 uppercase"
                    >
                        {tag}
                    </span>
                ))}
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, filter: 'blur(14px)', y: 20 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
                className="text-[1.1rem] md:text-[1.875rem] lg:text-[2.25rem] font-bold text-gray-900 leading-none"
                style={{ maxWidth: isDesktop ? '35rem' : '277px' }}
            >
                I keep iterate and build across <span className="text-[rgb(74,108,196)]">Frontend</span> & <span className="text-[rgb(74,108,196)]">Backend Engineering</span>, embracing{' '}
                <IconScatter icons={agnosticIcons} externalOpen={revealSequence.agnostic}>
                    agnostic framework
                </IconScatter>
                {' '}principles and{' '}
                <IconScatter icons={adaptiveIcons} externalOpen={revealSequence.adaptive}>
                    adaptive approach
                </IconScatter>
                {' '} for any challenge!
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, filter: 'blur(14px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
                style={antiFlickerStyle}
                className="mt-5 max-w-[320px] md:max-w-136"
            >
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[rgb(74,108,196)] font-bold opacity-60">
                        Remote Integration Focus
                    </span>

                    <p className="text-gray-500 text-[10px] md:text-[14px] leading-[1.6]">
                        Garry Alexander here. I am currently prioritizing {' '}
                        <RevealHighlight
                            text="Full-time & Contract"
                            baseClassName="text-gray-900 font-semibold tracking-tight"
                            overlayClassName="bg-linear-to-b from-[#ffffec] to-[#f4f555] border border-[#e8e935]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] text-[#4c4d0f] font-semibold tracking-tight rounded-[4px]"
                            delay={0.8}
                        />
                        {' '} roles with a specialized focus on {' '}
                        <RevealHighlight
                            text="Async-First"
                            baseClassName="text-gray-800 font-bold"
                            overlayClassName="bg-linear-to-b from-[#ffffec] to-[#f4f555] border border-[#e8e935]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] text-[#4c4d0f] font-bold rounded-[4px]"
                            delay={1}
                            duration={1}
                        />.
                        My process is built for <span className="text-gray-800 font-medium italic">distributed team</span> velocity, leveraging years of agile huddle leadership for engineering excellence.
                    </p>
                </div>
            </motion.div>
            </div>
        </div>
    );
};
