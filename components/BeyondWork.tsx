import { motion, useInView, AnimatePresence } from 'motion/react';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { BEYOND_WORK_IMAGES } from '../constants';
import { antiFlickerStyle, sectionHeaderVariants, staggerContainerVariants, staggerItemVariants } from './animations';
import { Bookshelf } from './Bookshelf';
import { useCursorStore } from './hooks/useCursorStore';
import ProgressiveText from './ProgressiveText';

// Local CrosshairCorner for the image frame effect
const CrosshairCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const rotations = { tl: 0, tr: 90, bl: -90, br: 180 };
    // Position corners slightly outside the container
    const positions = {
        tl: { top: -6, left: -6 },
        tr: { top: -6, right: -6 },
        bl: { bottom: -6, left: -6 },
        br: { bottom: -6, right: -6 },
    };

    return (
        <motion.div
            className="absolute z-50 pointer-events-none"
            style={{ ...positions[position] }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ transform: `rotate(${rotations[position]}deg)` }}
            >
                <path
                    d="M2 22V2H22"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                />
            </svg>
        </motion.div>
    );
};

export const BeyondWork: React.FC = () => {
    const [isPaused, setIsPaused] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const setMode = useCursorStore((s) => s.setMode);

    // Memoize duplicated images to prevent recreation on every render
    const images = useMemo(() => [...BEYOND_WORK_IMAGES, ...BEYOND_WORK_IMAGES], []);

    // Stable callbacks to prevent child re-renders
    const handleTouchStart = useCallback((idx: number) => {
        setIsPaused(true);
        setActiveIndex(idx);
    }, []);

    const handleTouchEnd = useCallback(() => {
        setIsPaused(false);
        setActiveIndex(null);
    }, []);

    const handleMarqueeMouseEnter = useCallback(() => {
        setIsPaused(true);
    }, []);

    const handleMarqueeMouseLeave = useCallback(() => {
        setIsPaused(false);
    }, []);

    // Cursor mode handlers for image hover - Hide global cursor so local frame takes over
    const handleImageMouseEnter = useCallback(() => {
        setMode('hidden');
    }, [setMode]);

    const handleImageMouseLeave = useCallback(() => {
        setMode('default');
    }, [setMode]);

    return (
        <section className="py-10 border-t border-dashed border-gray-200 bg-[#FAFAFA] overflow-hidden" style={antiFlickerStyle}>
            <div className="px-6 md:px-10 mb-8">
                <ProgressiveText
                    as="h2"
                    variants={sectionHeaderVariants}
                    className="text-sm font-bold text-[rgb(74,108,196)] tracking-wider uppercase"
                >
                    Beyond Work
                </ProgressiveText>
            </div>

            <motion.div
                variants={staggerContainerVariants}
                className="relative w-full"
                onMouseEnter={handleMarqueeMouseEnter}
                onMouseLeave={handleMarqueeMouseLeave}
            >
                <div
                    className="flex gap-4 md:gap-6 w-max pl-6 pb-8 md:pb-10 marquee-track"
                    style={{
                        animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                >
                    {images.map((src, idx) => (
                        <LazyImage
                            key={`${idx}-${src}`}
                            src={src}
                            index={idx}
                            isActive={activeIndex === idx}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onMouseEnter={handleImageMouseEnter}
                            onMouseLeave={handleImageMouseLeave}
                        />
                    ))}
                </div>

                {/* CSS for marquee animation - GPU accelerated, no layout thrash */}
                <style>{`
                    .marquee-track {
                        animation: marquee 40s linear infinite;
                        transform: translate3d(0, 0, 0);
                        backface-visibility: hidden;
                    }
                    @keyframes marquee {
                        0% { transform: translate3d(0, 0, 0); }
                        100% { transform: translate3d(-50%, 0, 0); }
                    }
                `}</style>
            </motion.div>

            {/* Interactive Bookshelf */}
            <div className="mt-8 px-6 md:px-10">
                <motion.div
                    variants={sectionHeaderVariants}
                    className="mb-8"
                >
                    <ProgressiveText as="h3" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reading List</ProgressiveText>
                    <ProgressiveText as="p" className="text-gray-500 text-sm">Curated collection of thoughts and inspirations.</ProgressiveText>
                </motion.div>
                <Bookshelf />
            </div>
        </section>
    );
};

interface LazyImageProps {
    src: string;
    index: number;
    isActive: boolean;
    onTouchStart: (idx: number) => void;
    onTouchEnd: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const LazyImage: React.FC<LazyImageProps> = React.memo(({ 
    src, 
    index, 
    isActive, 
    onTouchStart, 
    onTouchEnd,
    onMouseEnter,
    onMouseLeave 
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { margin: "50% 0px 50% 0px", once: true });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleTouchStart = useCallback(() => onTouchStart(index), [onTouchStart, index]);
    const handleLoad = useCallback(() => setIsLoaded(true), []);
    const preventContext = useCallback((e: React.MouseEvent) => e.preventDefault(), []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        onMouseEnter();
    }, [onMouseEnter]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        onMouseLeave();
    }, [onMouseLeave]);

    return (
        <motion.div
            ref={ref}
            variants={staggerItemVariants}
            className={`group relative w-[200px] h-[200px] md:w-[220px] md:h-[220px] shrink-0 rounded-[16px] p-[3px] shadow-[0_8px_10px_rgba(0,0,0,0.13),0_4px_4px_rgba(0,0,0,0.05)] ${isActive ? 'shadow-xl' : ''}`}
            style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                cursor: 'none' // Ensure system cursor is hidden
            }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence>
                {isHovered && (
                    <>
                        <CrosshairCorner position="tl" />
                        <CrosshairCorner position="tr" />
                        <CrosshairCorner position="bl" />
                        <CrosshairCorner position="br" />
                    </>
                )}
            </AnimatePresence>

            {/* Inner Container */}
            <div className="w-full h-full bg-white rounded-[14px] p-1.5 border border-[rgba(0,0,0,0.05)]">
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-gray-100 relative">
                    {isInView && (
                        <img
                            src={src}
                            alt="Beyond work photography"
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            onContextMenu={preventContext}
                            onLoad={handleLoad}
                            className={`w-full h-full object-cover select-none grayscale group-hover:grayscale-0 ${isActive ? 'grayscale-0' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                            style={{ 
                                WebkitTouchCallout: 'none', 
                                WebkitUserSelect: 'none',
                                transition: 'opacity 0.5s ease-out, filter 0.3s ease-out, transform 0.3s ease-out',
                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                            }}
                        />
                    )}
                    {/* Inset shadow overlay */}
                    <div className="absolute inset-0 rounded-[10px] pointer-events-none shadow-[inset_0_2px_8px_rgba(0,0,0,0.15),inset_0_-1px_2px_rgba(0,0,0,0.05)]" />
                </div>
            </div>
        </motion.div>
    );
});
