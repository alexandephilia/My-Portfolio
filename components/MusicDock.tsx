import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { GripVertical, Pause, Play, Repeat, Repeat1, SkipBack, SkipForward } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { SONGS } from '../constants';

// Max characters that fit without scrolling (based on ~100px container width at 10-11px uppercase font)
const MAX_TITLE_CHARS = 12;

export const MusicDock: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true); // Start minimized
    const [hasExpanded, setHasExpanded] = useState(false); // Track initial expansion
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

    const [showSpotlight, setShowSpotlight] = useState(false); // Spotlight onboarding state

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const constraintsRef = useRef<HTMLDivElement | null>(null);

    const currentSong = SONGS[currentSongIndex];



    // Simple reliable check: scroll if title exceeds character threshold
    const shouldScroll = currentSong.title.length > MAX_TITLE_CHARS;

    useEffect(() => {
        const visibilityTimer = setTimeout(() => setIsVisible(true), 800);
        // Expand after becoming visible
        const expandTimer = setTimeout(() => {
            setIsMinimized(false);
            setHasExpanded(true);
        }, 1200);

        // Auto-play attempt on mount (aggressive zero-volume start)
        const autoPlayTimer = setTimeout(() => {
            if (audioRef.current && isPlaying) {
                audioRef.current.volume = 0;
                audioRef.current.muted = false;
                audioRef.current.load();
                audioRef.current.play().catch(() => { });
            }
        }, 500);

        // Global interaction listener to "override" browser permission
        const handleFirstInteraction = () => {
            if (audioRef.current) {
                audioRef.current.volume = 1;
                audioRef.current.muted = false;
                if (isPlaying) {
                    audioRef.current.play().catch(() => { });
                }
            }
            // Remove listeners after first interaction
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('mousedown', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);
        window.addEventListener('keydown', handleFirstInteraction);
        window.addEventListener('mousedown', handleFirstInteraction);

        return () => {
            clearTimeout(visibilityTimer);
            clearTimeout(expandTimer);
            clearTimeout(autoPlayTimer);
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('mousedown', handleFirstInteraction);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        // Ensure unmuted and full volume when manually toggling
        audioRef.current.muted = false;
        audioRef.current.volume = 1;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
        setIsPlaying(true);
        // Play after React updates the audio src - use microtask to batch with state update
        setTimeout(() => {
            audioRef.current?.play().catch(e => console.error("Audio play failed on next:", e));
        }, 0);
    };

    const prevSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
        setIsPlaying(true);
        // Play after React updates the audio src
        setTimeout(() => {
            audioRef.current?.play().catch(e => console.error("Audio play failed on prev:", e));
        }, 0);
    };

    const toggleRepeat = () => setIsRepeatOne(!isRepeatOne);

    const handleEnded = () => {
        if (isRepeatOne && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else {
            nextSong();
        }
    };

    // Auto-dismiss spotlight after 3 seconds
    useEffect(() => {
        if (showSpotlight) {
            const timer = setTimeout(() => setShowSpotlight(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSpotlight]);

    return (
        <>
            {/* Audio Engine - Always present in DOM but decoupled from visibility logic */}
            <audio
                ref={audioRef}
                src={currentSong.url}
                onEnded={handleEnded}
                preload="auto"
                style={{ display: 'none' }}
            />

            {/* Drag constraints - full viewport */}
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[99]" />

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{
                            opacity: 1,
                            // Only animate position when NOT dragging to prevent fighting
                            x: isMinimized ? dragPosition.x : 0,
                            y: isMinimized ? dragPosition.y : 0,
                        }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                            opacity: { duration: 0.3 }
                        }}
                        drag={isMinimized}
                        dragConstraints={constraintsRef}
                        dragElastic={0.08}
                        dragMomentum={false}
                        dragTransition={{ bounceStiffness: 300, bounceDamping: 25 }}
                        onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                            // Only update position after drag ends to avoid fighting
                            setDragPosition(prev => ({
                                x: prev.x + info.offset.x,
                                y: prev.y + info.offset.y
                            }));
                        }}
                        whileDrag={{ scale: 1.03, zIndex: 150 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-100 touch-none select-none ${isMinimized ? 'cursor-grab active:cursor-grabbing' : ''}`}
                        style={{ touchAction: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ width: 64 }}
                            animate={{
                                width: isMinimized ? 64 : 'min(310px, calc(100vw - 64px))',
                            }}
                            transition={{
                                type: 'spring',
                                damping: 18, // Slightly softer spring
                                stiffness: 120,
                                mass: 1,
                                // Increased delay so content blur is clearly halfway done before width changes
                                delay: isMinimized ? 0.25 : 0
                            }}
                            style={{ willChange: 'width' }}
                            className="
                            relative
                            bg-white/40 backdrop-blur-3xl
                            border border-white/50
                            rounded-[18px] md:rounded-[20px]
                            shadow-[0_15px_35px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)]
                            overflow-hidden
                            transform-gpu
                        "
                        >
                            <div className="flex items-center p-1">
                                {/* Album Art - draggable area when minimized */}
                                <div className="relative shrink-0">
                                    {/* Gradient Frame Wrapper */}
                                    <div className="
                                        relative
                                        p-[1.5px] 
                                        bg-linear-to-b from-white to-gray-200
                                        rounded-[14px]
                                        shadow-[0_12px_30px_-6px_rgba(0,0,0,0.4),0_8px_16px_-8px_rgba(0,0,0,0.3)]
                                        transition-all duration-500
                                        overflow-hidden
                                        ${isPlaying && !isMinimized ? 'scale-[1.05]' : 'scale-100'}
                                    ">
                                        {/* Floating Album Art Container */}
                                        <div
                                            className="
                                                w-14 h-14
                                                flex items-center justify-center
                                                overflow-hidden
                                                rounded-[12.5px]
                                                relative
                                            "
                                        >
                                            <img
                                                src={currentSong.coverUrl}
                                                className="w-full h-full object-cover pointer-events-none select-none"
                                                alt={currentSong.title}
                                                draggable={false}
                                            />

                                            {/* Subtle depth mask */}
                                            <div className="absolute inset-0 bg-black/5 pointer-events-none" />

                                            {/* Playing Indicator */}
                                            <AnimatePresence>
                                                {isPlaying && isMinimized && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 h-2.5 px-1.5 rounded-full bg-black/40 backdrop-blur-md pointer-events-none ring-1 ring-white/10"
                                                    >
                                                        {[...Array(3)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                animate={{ height: [2, 7, 2] }}
                                                                transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1) }}
                                                                className="w-0.5 bg-white/90 rounded-full"
                                                            />
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Play/Pause button - Moved inside the rounded frame for perfect clipping */}
                                        {isMinimized && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePlay();
                                                }}
                                                onPointerDown={(e) => e.stopPropagation()}
                                                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 active:bg-black/50 backdrop-blur-[1px] transition-colors duration-150"
                                            >
                                                {isPlaying ? (
                                                    <Pause size={20} fill="white" className="text-white drop-shadow-md" />
                                                ) : (
                                                    <Play size={20} fill="white" className="text-white ml-0.5 drop-shadow-md" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Drag indicator when minimized - remains outside for separate opacity/UX */}
                                    {isMinimized && (
                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 opacity-30">
                                            <GripVertical size={10} className="text-gray-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Content revealed via AnimatePresence */}
                                <AnimatePresence mode="wait">
                                    {!isMinimized && (
                                        <motion.div
                                            key="expanded-content"
                                            initial={{ opacity: 0, filter: 'blur(10px)', x: -10 }}
                                            animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                                            exit={{ opacity: 0, filter: 'blur(10px)', x: -10 }}
                                            transition={{
                                                duration: 0.4,
                                                ease: [0.4, 0, 0.2, 1],
                                                // Wait for container to start opening
                                                delay: 0.1
                                            }}
                                            className="flex-1 flex items-center justify-between gap-3 pl-3 pr-2 overflow-hidden"
                                        >
                                            {/* Info Section */}
                                            <motion.div
                                                initial={{ opacity: 0, filter: 'blur(4px)' }}
                                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                                transition={{ delay: 0.2 }}
                                                className="min-w-[100px] flex flex-col gap-1"
                                            >
                                                <div className="flex flex-col">
                                                    <div
                                                        className="overflow-hidden whitespace-nowrap relative h-4 flex items-center w-[85px]"
                                                        style={shouldScroll ? {
                                                            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                                                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                                                        } : {}}
                                                    >
                                                        <motion.div
                                                            key={currentSong.id}
                                                            initial={{ x: 0 }}
                                                            animate={shouldScroll ? { x: "-50%" } : { x: 0 }}
                                                            transition={shouldScroll ? {
                                                                duration: currentSong.title.length * 0.4,
                                                                repeat: Infinity,
                                                                ease: "linear",
                                                                repeatType: "loop"
                                                            } : { duration: 0.3 }}
                                                            className="flex"
                                                        >
                                                            <span className="text-[10px] md:text-[11px] font-black text-gray-900 pr-8 tracking-tight uppercase whitespace-nowrap">
                                                                {currentSong.title}
                                                            </span>
                                                            {shouldScroll && (
                                                                <span className="text-[10px] md:text-[11px] font-black text-gray-900 pr-8 tracking-tight uppercase whitespace-nowrap">
                                                                    {currentSong.title}
                                                                </span>
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                    <span className="text-[7px] md:text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] opacity-80 truncate">
                                                        {currentSong.artist}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 h-4">
                                                    <div className="flex items-center gap-0.5 h-full">
                                                        {[...Array(6)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                animate={isPlaying ? { height: [2, 10, 4, 8, 2] } : { height: 1.5 }}
                                                                transition={{ repeat: Infinity, duration: 0.6 + (i * 0.1) }}
                                                                className={`w-0.5 rounded-full ${isPlaying ? 'bg-[rgb(74,108,196)]/60' : 'bg-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <button onClick={toggleRepeat} className={`p-1 ${isRepeatOne ? 'text-[rgb(74,108,196)]' : 'text-gray-300'}`}>
                                                        {isRepeatOne ? <Repeat1 size={12} /> : <Repeat size={12} />}
                                                    </button>
                                                </div>
                                            </motion.div>

                                            {/* Main Controls */}
                                            <motion.div
                                                initial={{ opacity: 0, filter: 'blur(4px)' }}
                                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center gap-1"
                                            >
                                                <button onClick={prevSong} className="text-gray-400 hover:text-gray-900 p-1.5 active:scale-90 transition-transform">
                                                    <SkipBack size={14} fill="currentColor" />
                                                </button>
                                                <button
                                                    onClick={togglePlay}
                                                    className="w-10 h-10 rounded-full bg-gradient-to-b from-white to-gray-100/80 border border-white/80 shadow-md flex items-center justify-center text-gray-900 hover:scale-105 active:scale-95 transition-transform"
                                                >
                                                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                                                </button>
                                                <button onClick={nextSong} className="text-gray-400 hover:text-gray-900 p-1.5 active:scale-90 transition-transform">
                                                    <SkipForward size={14} fill="currentColor" />
                                                </button>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Minimize/Expand Toggle - Outside the animated container */}
                        <button
                            onClick={() => {
                                if (!isMinimized) {
                                    // User is minimizing from expanded state - trigger spotlight onboarding
                                    setShowSpotlight(true);
                                } else {
                                    // Reset to center when expanding
                                    setDragPosition({ x: 0, y: 0 });
                                }
                                setIsMinimized(!isMinimized);
                            }}
                            className="absolute -top-1 -right-1 z-50 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md flex items-center justify-center text-gray-400 hover:text-gray-900 hover:scale-110 active:scale-95 transition-transform"
                        >
                            <span className="text-[10px] font-bold">{isMinimized ? '+' : '−'}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spotlight Onboarding Overlay */}
            <AnimatePresence>
                {showSpotlight && isMinimized && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }} // Composed entry delay
                        onClick={() => setShowSpotlight(false)}
                        className="fixed inset-0 z-98 cursor-pointer"
                        style={{
                            background: 'rgba(0, 0, 0, 0.65)',
                            backdropFilter: 'blur(5px)',
                            WebkitBackdropFilter: 'blur(5px)',
                            // Radial gradient mask with feathered edges
                            maskImage: 'radial-gradient(circle 48px at 50% calc(100% - 52px), transparent 0%, transparent 92%, black 100%)',
                            WebkitMaskImage: 'radial-gradient(circle 48px at 50% calc(100% - 52px), transparent 0%, transparent 92%, black 100%)',
                        }}
                    >
                        {/* Tooltip - Premium Technical Sequence */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{
                                delay: 0.9,
                                duration: 0.6,
                                type: "spring",
                                stiffness: 400,
                                damping: 15
                            }}
                            className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
                        >
                            <div className="
                                px-5 py-2
                                bg-linear-to-b from-white via-white to-gray-50/90
                                rounded-full
                                shadow-[0_12px_24px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]
                                border border-gray-200/80
                                flex items-center justify-center
                            ">
                                <span className="text-[11px] font-['Nunito',sans-serif] font-black text-gray-900 tracking-tight whitespace-nowrap">
                                    Drag to reposition!
                                </span>
                            </div>

                            {/* Unified Kinetic Squiggle + Arrow Design - Corrected Connectivity */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.4 }}
                                className="flex flex-col items-center -mt-1.5"
                            >
                                <svg width="24" height="65" viewBox="0 0 24 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                                    {/* The Squiggle Body */}
                                    <motion.path
                                        d="M12 0C12 0 20 12 12 24C4 36 12 42 12 42"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.8, ease: "easeInOut", delay: 1.4 }}
                                    />
                                    {/* The Integrated Arrow Head - Connected at exactly y=42 */}
                                    <motion.path
                                        d="M5 42L12 52L19 42"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.4, ease: "easeOut", delay: 2.1 }}
                                    />
                                </svg>

                                <motion.div
                                    animate={{ y: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                    className="-mt-4"
                                >

                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
