import { motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

interface DraggableStickerProps {
    id: string;
    src: string;
    className?: string; // Standard tailwind for initial positioning
    peelFrom?: 'top' | 'right' | 'bottom' | 'left';
    rotate?: number;
    duration?: number;
}

export const DraggableSticker: React.FC<DraggableStickerProps> = ({ 
    id, 
    src, 
    className = "", 
    peelFrom = 'top',
    rotate = 20,
    duration = 2
}) => {
    const stickerRef = useRef<HTMLDivElement>(null);
    const pointLightRef = useRef<SVGFEPointLightElement>(null);
    const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isPlacing, setIsPlacing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsPlacing(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!stickerRef.current || !pointLightRef.current || !pointLightFlippedRef.current) return;
            
            const rect = stickerRef.current.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
            
            pointLightRef.current.setAttribute("x", relativeX.toString());
            pointLightRef.current.setAttribute("y", relativeY.toString());
            
            // Flipped light depends on peel direction
            if (peelFrom === 'top' || peelFrom === 'bottom') {
                pointLightFlippedRef.current.setAttribute("x", relativeX.toString());
                pointLightFlippedRef.current.setAttribute("y", (rect.height - relativeY).toString());
            } else {
                pointLightFlippedRef.current.setAttribute("x", (rect.width - relativeX).toString());
                pointLightFlippedRef.current.setAttribute("y", relativeY.toString());
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [peelFrom]);

    // Directional logic helpers
    const p = 'var(--sticker-p)';
    const start = 'calc(-1 * ' + p + ')';
    const end = 'calc(100% + ' + p + ')';
    const h = 'var(--sticker-peelback-hover)';
    const a = 'var(--sticker-peelback-active)';
    const i = 'var(--sticker-peelback-initial)';

    const getClipPaths = (state: 'default' | 'hover' | 'active' | 'initial') => {
        const dist = state === 'initial' ? i : state === 'active' ? a : state === 'hover' ? h : start;
        
        if (peelFrom === 'top') {
            return `polygon(${start} ${dist}, ${end} ${dist}, ${end} ${end}, ${start} ${end})`;
        }
        if (peelFrom === 'bottom') {
            const side = `calc(100% - ${dist === start ? start : dist})`;
            return `polygon(${start} ${start}, ${end} ${start}, ${end} ${side}, ${start} ${side})`;
        }
        if (peelFrom === 'right') {
            const side = `calc(100% - ${dist === start ? start : dist})`;
            return `polygon(${start} ${start}, ${side} ${start}, ${side} ${end}, ${start} ${end})`;
        }
        if (peelFrom === 'left') {
            return `polygon(${dist} ${start}, ${end} ${start}, ${end} ${end}, ${dist} ${end})`;
        }
        return `polygon(${start} ${start}, ${end} ${start}, ${end} ${end}, ${start} ${end})`;
    };

    const getFlapClipPaths = (state: 'default' | 'hover' | 'active' | 'initial') => {
        const dist = state === 'initial' ? i : state === 'active' ? a : state === 'hover' ? h : start;

        if (peelFrom === 'top') {
            return `polygon(${start} ${start}, ${end} ${start}, ${end} ${dist}, ${start} ${dist})`;
        }
        if (peelFrom === 'bottom') {
            const side = `calc(100% - ${dist === start ? start : dist})`;
            return `polygon(${start} ${side}, ${end} ${side}, ${end} ${end}, ${start} ${end})`;
        }
        if (peelFrom === 'right') {
            const side = `calc(100% - ${dist === start ? start : dist})`;
            return `polygon(${side} ${start}, ${end} ${start}, ${end} ${end}, ${side} ${end})`;
        }
        if (peelFrom === 'left') {
            return `polygon(${start} ${start}, ${dist} ${start}, ${dist} ${end}, ${start} ${end})`;
        }
        return `polygon(${start} ${start}, ${end} ${start}, ${end} ${start}, ${start} ${start})`;
    };

    const getFlapPosition = (state: 'default' | 'hover' | 'active' | 'initial') => {
        const dist = state === 'initial' ? i : state === 'active' ? a : state === 'hover' ? h : start;

        if (peelFrom === 'top') {
            const pos = `calc(-100% + 2 * ${dist} - 1px)`;
            return { 
                top: state === 'default' ? `calc(-100% - 2 * ${p})` : pos,
                left: 0
            };
        }
        if (peelFrom === 'bottom') {
            const pos = `calc(100% - 2 * ${dist} + 1px)`;
            return { 
                top: state === 'default' ? `calc(100% + 2 * ${p})` : pos,
                left: 0
            };
        }
        if (peelFrom === 'right') {
            const pos = `calc(100% - 2 * ${dist} + 1px)`;
            return { 
                left: state === 'default' ? `calc(100% + 2 * ${p})` : pos,
                top: 0
            };
        }
        if (peelFrom === 'left') {
            const pos = `calc(-100% + 2 * ${dist} - 1px)`;
            return { 
                left: state === 'default' ? `calc(-100% - 2 * ${p})` : pos,
                top: 0
            };
        }
        return {};
    };

    const flapTransform = peelFrom === 'top' || peelFrom === 'bottom' ? 'scaleY(-1)' : 'scaleX(-1)';

    return (
        <>
            <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
                <defs>
                    <filter id={`dropShadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                        <feOffset dx="2" dy="4" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.2" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id={`pointLight-${id}`}>
                        <feDiffuseLighting result="diffuse" lightingColor="#ffffff" surfaceScale="0.8">
                            <fePointLight ref={pointLightRef} x="100" y="100" z="80" />
                        </feDiffuseLighting>
                        <feComposite in="SourceGraphic" in2="diffuse" operator="arithmetic" k1="0.5" k2="0.6" k3="0" k4="0" />
                    </filter>

                    <filter id={`pointLightFlipped-${id}`}>
                        <feDiffuseLighting result="diffuse" lightingColor="#ffffff" surfaceScale="2">
                            <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="50" />
                        </feDiffuseLighting>
                        <feComposite in="SourceGraphic" in2="diffuse" operator="arithmetic" k1="1" k2="0.3" k3="0" k4="0" />
                    </filter>

                    <filter id={`expandAndFill-${id}`}>
                        <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicker" />
                        <feFlood floodColor="white" result="white" />
                        <feComposite in="white" in2="thicker" operator="in" />
                    </filter>
                </defs>
            </svg>

            <motion.div
                drag
                dragMomentum={false}
                ref={stickerRef}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                onTouchStart={() => setIsActive(true)}
                onTouchEnd={() => setIsActive(false)}
                className={`draggable absolute z-100 cursor-grab active:cursor-grabbing touch-none p-4 ${className}`}
                style={{
                    ['--sticker-p' as any]: '10px',
                    ['--sticker-rotate' as any]: `${rotate}deg`,
                    ['--sticker-peelback-initial' as any]: '80%',
                    ['--sticker-peelback-hover' as any]: isMobile ? '0%' : '30%',
                    ['--sticker-peelback-active' as any]: '60%',
                    ['--sticker-peel-hover-easing' as any]: `${duration / 2}s cubic-bezier(0.22, 1, 0.36, 1)`,
                    ['--sticker-peel-easing' as any]: `${duration}s cubic-bezier(0.22, 1, 0.36, 1)`,
                    ['--sticker-start' as any]: 'calc(-1 * var(--sticker-p))',
                    ['--sticker-end' as any]: 'calc(100% + var(--sticker-p))',
                    rotate: `${rotate}deg`,
                }}
                initial={{ opacity: 0, scale: 1.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.5 // Start after initial page blur animations
                }}
            >
                <div className={`sticker-container ${isHovered ? 'hover' : ''} ${isActive ? 'active' : ''} relative select-none touch-none w-[120px] md:w-[150px]`}>
                   
                    <div className="absolute top-4 left-2 w-full h-full blur-md brightness-0 opacity-10 pointer-events-none">
                         <img 
                            src={src}
                            alt="" 
                            className="w-full rotate-(--sticker-rotate)"
                        />
                    </div>

                    <div 
                        className="sticker-main relative"
                        style={{
                            clipPath: getClipPaths(isActive ? 'active' : isHovered ? 'hover' : isPlacing ? 'initial' : 'default'),
                            transition: `clip-path ${isHovered ? 'var(--sticker-peel-hover-easing)' : 'var(--sticker-peel-easing)'}`,
                            filter: `url(#dropShadow-${id})`
                        }}
                    >
                        <div className="sticker-lighting" style={{ filter: isHovered ? `url(#pointLight-${id})` : 'none', transition: 'filter 0.3s ease' }}>
                            <img 
                                src={src}
                                alt="sticker" 
                                draggable={false}
                                className="sticker-image w-full"
                            />
                        </div>
                    </div>

                    <div 
                        className="flap absolute w-full h-full pointer-events-none"
                        style={{
                            ...getFlapPosition(isActive ? 'active' : isHovered ? 'hover' : isPlacing ? 'initial' : 'default'),
                            clipPath: getFlapClipPaths(isActive ? 'active' : isHovered ? 'hover' : isPlacing ? 'initial' : 'default'),
                            transform: flapTransform,
                            transition: `all ${isHovered ? 'var(--sticker-peel-hover-easing)' : 'var(--sticker-peel-easing)'}`
                        }}
                    >
                        <div className="flap-lighting" style={{ filter: `url(#pointLightFlipped-${id})` }}>
                             <img 
                                src={src}
                                alt="" 
                                draggable={false}
                                className="flap-image w-full opacity-80"
                                style={{ filter: `url(#expandAndFill-${id})` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .sticker-main, .flap {
                    will-change: clip-path, transform, top, left, bottom;
                }
            `}</style>
        </>
    );
};
