import { motion, Variants, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { Project } from '../types';
import { useCursorStore } from './hooks/useCursorStore';
import ProgressiveText from './ProgressiveText';

interface ProjectCardProps {
    project: Project;
    index?: number;
}

// Simple card blur reveal - no child staggering for cleaner animation
export const projectCardVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: 'blur(14px)',
        y: 12
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            filter: { duration: 0.5 }
        }
    }
};

// Shimmer component for loading state
const Shimmer: React.FC = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
        style={{
            backgroundSize: '200% 100%',
        }}
    />
);

// Lazy image component with shimmer
const LazyImage: React.FC<{ src: string; alt: string; blur?: number }> = ({ src, alt, blur }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-[16px]">
            {/* Shimmer placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 overflow-hidden rounded-[16px]">
                    <Shimmer />
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-[16px]">
                    <span className="text-gray-400 text-xs text-center px-4">Image Unavailable</span>
                </div>
            )}

            {/* Actual image */}
            <motion.img
                src={src}
                alt={alt}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover object-top md:object-center select-none rounded-[16px]"
                style={{
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    filter: blur ? `blur(${blur}px)` : undefined,
                }}
            />

            {/* Static Glossy Film Overlay REMOVED based on request */}
        </div>
    );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const Icon = project.icon;
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const { setHoveringButton } = useCursorStore();

    // Magnetic Button Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Magnetic "Pull" for the button itself (Subtle)
    const buttonX = useTransform(springX, [-100, 100], [-4, 4]);
    const buttonY = useTransform(springY, [-40, 40], [-2, 2]);

    // The "Overlay" (The morphing cursor) logic
    const overlayX = useTransform(springX, [-100, 100], [-12, 12]);
    const overlayY = useTransform(springY, [-40, 40], [-6, 6]);

    const handleButtonMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleButtonMouseEnter = () => {
        setIsButtonHovered(true);
        setHoveringButton(true);
    };
    const handleButtonMouseLeave = () => {
        setIsButtonHovered(false);
        setHoveringButton(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            variants={projectCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{
                willChange: 'opacity, filter, transform',
                zIndex: isHovered ? 20 : 1 // Dynamic z-index prevents overlap
            }}
            className="relative group w-full md:w-full cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered(!isHovered)} // Toggle for mobile/touch
        >
            {/* Concept 2: The "Augmented Architecture" Ghost-Deck — Bottom Variety */}
            {project.stack && project.stack.length > 0 && (
                <>
                    {/* Desktop version - original layout */}
                    <motion.div
                        className="hidden md:block absolute inset-x-6 bottom-0 z-0"
                        initial={{ y: 0, opacity: 0, scale: 0.98 }}
                        animate={{
                            y: isHovered ? 44 : 0,
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0.98
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 18,
                            mass: 0.8
                        }}
                    >
                        <div className="w-full h-14 rounded-b-[20px] bg-[#FAFAFA] border-x border-b border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] px-6 flex items-center justify-between relative overflow-hidden">
                            {/* Stripped Lines Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                            <div className="absolute top-0 right-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                            <div className="absolute bottom-0 left-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                            <div className="absolute bottom-0 right-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />

                            {/* Stack Insight Label - Fixed Left */}
                            <div className="text-[9px] font-mono font-bold text-[rgb(74,108,196)] uppercase tracking-[0.2em] opacity-60 border-r border-gray-200 pr-6 h-4 flex items-center flex-shrink-0 relative z-10">
                                Stack Insight
                            </div>

                            {/* Centered Scrollable Tech Stack */}
                            <div className="flex-1 min-w-0 flex flex-row items-center justify-center gap-4 px-4 relative z-10 overflow-x-auto no-scrollbar">
                                {project.stack.map((item, i) => (
                                    <span key={i} className="text-[10px] font-mono font-medium text-gray-500 whitespace-nowrap flex items-center gap-1.5 transition-colors duration-300 hover:text-gray-900">
                                        <span className="w-1 h-1 rounded-full bg-[rgb(74,108,196)]/30" />
                                        {item}
                                    </span>
                                ))}
                            </div>

                            {/* Confidential Tag - Fixed Right */}
                            <div className="flex items-center gap-1.5 text-[8px] font-mono text-[rgb(126,150,210)] font-bold uppercase relative z-10 border-l border-gray-200 pl-6 h-4 flex-shrink-0">
                                Confidential
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile version - wrapping layout to show all items */}
                    <motion.div
                        className="md:hidden absolute inset-x-2 z-0"
                        style={{ bottom: 'calc(var(--spacing) * 2)' }}
                        initial={{ y: 0, opacity: 0, scale: 0.98 }}
                        animate={{
                            y: isHovered ? 52 : 0,
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0.98
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 18,
                            mass: 0.8
                        }}
                    >
                        <div className="w-full py-2 px-3 rounded-b-[16px] bg-[#FAFAFA] border-x border-b border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] overflow-hidden">
                            {/* Stack Insight Label */}
                            <div className="text-[8px] font-mono font-bold text-[rgb(74,108,196)] uppercase tracking-[0.15em] opacity-60 mb-1.5 text-center">
                                Stack Insight
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                                {project.stack.map((item, i) => (
                                    <span key={i} className="text-[8px] font-mono font-medium text-gray-500 whitespace-nowrap flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-[rgb(74,108,196)]/30" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Outer Rim Container */}
            <div
                className="w-full rounded-[24px] p-[4px] backdrop-blur-md md:backdrop-blur-[25px] transition-transform duration-300 group-hover:-translate-y-1 relative z-10 overflow-hidden"
                style={{
                    background: `linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)`,
                    boxShadow: 'rgba(0, 0, 0, 0.13) 0px 8px 10px, rgba(0, 0, 0, 0.05) 0px 4px 4px'
                }}
            >
                <div
                    className="w-full bg-white rounded-[20px] overflow-hidden flex flex-row border border-[rgba(0,0,0,0.05)] md:min-h-[240px]"
                >
                    {project.category === 'Components' ? (
                        <div className="w-full h-[400px] md:h-[420px] relative bg-gray-50">
                            <iframe
                                src={project.linkUrl}
                                className="w-full h-full border-none pointer-events-auto"
                                title={project.title}
                                scrolling="no"
                            />
                            {/* Protection overlay for scroll/interaction hijacking if needed, but keeping it interactive for now */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]" />
                        </div>
                    ) : (
                        <>
                            {/* Left Content (Text) */}
                            <div className="flex-1 p-3 md:p-6 flex flex-col items-start gap-1.5 md:gap-3 justify-center relative z-10 overflow-hidden">

                                {project.category !== 'Components' && (
                                    <div className="flex flex-col gap-1 md:gap-2 relative z-10">
                                        <div className="flex items-start justify-between gap-4 w-full relative z-10">
                                            <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight flex-1">
                                                {project.title}
                                            </h3>
                                            <div className="hidden md:flex shrink-0 items-center gap-1.5 p-px rounded-full relative group-hover:opacity-0 translate-x-0 group-hover:translate-x-2 mt-1 overflow-hidden"
                                                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E5E7EB, #E5E7EB 1px, transparent 1px, transparent 3px)' }}>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-linear-to-b from-white to-gray-50/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08),inset_0_-1px_1px_rgba(255,255,255,0.8)] border border-transparent">
                                                    <div className="w-1 h-1 rounded-full bg-gray-400 opacity-50 font-mono" />
                                                    <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                                        Hover Me
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Description with expandable on mobile */}
                                        <div className="relative">
                                            <ProgressiveText className={`text-gray-500 leading-relaxed text-[11px] md:text-xs md:line-clamp-none ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                {project.description}
                                            </ProgressiveText>
                                            {/* Fade gradient overlay when collapsed on mobile */}
                                            {!isExpanded && (
                                                <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white to-transparent pointer-events-none md:hidden" />
                                            )}
                                        </div>
                                        {/* Read more toggle - mobile only */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsExpanded(!isExpanded);
                                            }}
                                            className="flex items-center gap-0.5 text-[10px] text-[rgb(74,108,196)] font-medium mt-0.5 md:hidden"
                                        >
                                            {isExpanded ? 'Show less' : 'Read more'}
                                            <ChevronDown
                                                size={12}
                                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    </div>
                                )}

                                <div className="mt-1 pt-1 relative z-20">
                                    {project.category === 'Works' ? (
                                        <div className="flex flex-col gap-0.5">
                                            {project.company && (
                                                <div className="text-[10px] md:text-[11px] font-bold text-[rgb(74,108,196)] uppercase tracking-tight">
                                                    {project.company}
                                                </div>
                                            )}
                                            {project.date && (
                                                <div className="text-[8px] md:text-[9px] font-semibold text-gray-400 font-mono uppercase">
                                                    {project.date}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {project.isRedacted ? (
                                                <button
                                                    disabled
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] md:text-[11px] font-bold bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
                                                >
                                                    NDA Protected
                                                </button>
                                            ) : project.status === 'Live' ? (
                                                <motion.a
                                                    href={project.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onMouseEnter={handleButtonMouseEnter}
                                                    onMouseMove={handleButtonMouseMove}
                                                    onMouseLeave={handleButtonMouseLeave}
                                                    style={{ x: buttonX, y: buttonY }}
                                                    className="
                                                        relative flex items-center gap-1.5 px-3 py-1 rounded-md 
                                                        text-[10px] md:text-[11px] font-bold transition-all
                                                        bg-linear-to-b from-white to-gray-100 border border-gray-200 
                                                        shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]
                                                        text-gray-700 active:shadow-sm active:translate-y-px 
                                                        group/btn overflow-visible
                                                    "
                                                >
                                                    {/* The Morphing Black-Gradient Cursor Overlay */}
                                                    <AnimatePresence mode="popLayout">
                                                        {isButtonHovered && (
                                                            <motion.span 
                                                                layoutId={`btn-snap-${project.id}`}
                                                                initial={{ opacity: 0, scale: 0.8, borderRadius: '50%', width: 12, height: 12 }}
                                                                animate={{ 
                                                                    opacity: 1, 
                                                                    scale: 1, 
                                                                    borderRadius: '6px',
                                                                    width: 'calc(100% + 4px)',
                                                                    height: 'calc(100% + 4px)',
                                                                    left: -2,
                                                                    top: -2
                                                                }}
                                                                exit={{ opacity: 0, scale: 0.8, borderRadius: '50%' }}
                                                                className="absolute z-0 bg-black/95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] pointer-events-none"
                                                                style={{ 
                                                                    x: overlayX, 
                                                                    y: overlayY,
                                                                }}
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
                                                    </AnimatePresence>
                                                    
                                                    {/* Button Content - Color Inversion */}
                                                    <span className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${isButtonHovered ? 'text-white' : 'text-gray-700'}`}>
                                                        View Case Study
                                                        <motion.div
                                                            animate={isButtonHovered ? {
                                                                scale: [1, 1.15, 1],
                                                            } : { scale: 1 }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        >
                                                            <ArrowRight 
                                                                size={12} 
                                                                className={`transition-all duration-300 ${isButtonHovered ? 'translate-x-1 text-white' : 'text-gray-400'}`}
                                                                strokeWidth={isButtonHovered ? 3 : 2}
                                                            />
                                                        </motion.div>
                                                    </span>
                                                </motion.a>
                                            ) : (
                                                <span className="inline-block px-3 py-1.5 rounded-md border border-gray-200 text-gray-400 text-[10px] md:text-[11px] font-medium bg-gray-50 cursor-not-allowed">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Image Area - Width adjusted for mobile side-by-side */}
                            <div className="w-[35%] md:w-[45%] shrink-0 h-auto p-1 bg-gray-50 flex flex-col justify-center border-l border-gray-100">
                                <div className="w-full h-full md:min-h-full rounded-[16px] overflow-hidden relative shadow-[inset_0_4px_12px_rgba(0,0,0,0.18),inset_0_1px_3px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(255,255,255,0.7)] bg-gray-100 border border-black/5 flex items-center justify-center">
                                    {project.isRedacted ? (
                                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[16px] p-2">
                                            <div className="absolute inset-0 scale-110">
                                                <LazyImage src={project.imageUrl} alt={project.title} blur={10} />
                                                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                                            </div>

                                            <motion.div
                                                initial={{ rotate: -12, scale: 1.8, opacity: 0 }}
                                                animate={{ rotate: -15, scale: 1, opacity: 0.8 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 260,
                                                    damping: 20,
                                                    delay: 0.1
                                                }}
                                                className="relative z-10 w-full flex justify-center"
                                            >
                                                <div className="relative group/stamp max-w-full overflow-hidden">
                                                    {/* Stamp Body */}
                                                    <div className="px-2 py-1 md:px-6 md:py-3 border-2 md:border-4 border-gray-400/50 rounded-[2px] flex items-center justify-center">
                                                        <span className="text-[10px] sm:text-xs md:text-xl font-sans font-black text-gray-500 uppercase tracking-widest whitespace-nowrap select-none">
                                                            Under NDA
                                                        </span>
                                                    </div>

                                                    {/* Ink bleed effect (subtle glow) */}
                                                    <div className="absolute inset-0 border-2 md:border-4 border-gray-400/10 blur-[0.5px] -z-10" />
                                                </div>
                                            </motion.div>

                                        </div>
                                    ) : (
                                        <>
                                            <LazyImage src={project.imageUrl} alt={project.title} />
                                            {/* Inner shadow overlay */}
                                            <div className="absolute inset-0 pointer-events-none rounded-[16px] shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)]" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
