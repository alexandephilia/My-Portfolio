import { GripVertical, BotMessageSquare, Music, X } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, PanInfo, useDragControls } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { SONGS } from '../constants';
import { AIChatFloat } from './AIChatFloat';
import { DotMatrixVisualizer, MusicPlayer } from './MusicPlayer';

type DockMode = 'music' | 'chat';

// Audio state interface for lifting to parent
export interface AudioState {
    isPlaying: boolean;
    currentSongIndex: number;
    isRepeatOne: boolean;
    togglePlay: () => void;
    nextSong: () => void;
    prevSong: () => void;
    setIsRepeatOne: (val: boolean) => void;
}

const springTransition = {
    type: 'spring' as const,
    damping: 25,
    stiffness: 250,
};

const popInTransition = {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300,
    delay: 0.8,
};

const snapBackTransition = {
    type: 'spring' as const,
    damping: 12,
    stiffness: 400,
    mass: 0.8,
};

// Elastic blur reveal for content - syncs with container bounce
const blurReveal = {
    initial: { opacity: 0, filter: 'blur(12px)', scale: 0.9 },
    animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
    exit: { opacity: 0, filter: 'blur(8px)', scale: 0.95 },
};

const contentTransition = {
    type: 'spring' as const,
    damping: 15,
    stiffness: 350,
    mass: 0.8,
};

export const TransformDock: React.FC = () => {
    const [activeMode, setActiveMode] = useState<DockMode>('music');
    const [isExpanded, setIsExpanded] = useState(false);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [isResetting, setIsResetting] = useState(false);
    const constraintsRef = useRef<HTMLDivElement | null>(null);
    const dragControls = useDragControls();

    // [!] LIFTED AUDIO STATE - persists across mode switches and collapse
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isRepeatOneRef = useRef(isRepeatOne);

    // Keep ref in sync with state for use in event handlers
    useEffect(() => {
        isRepeatOneRef.current = isRepeatOne;
    }, [isRepeatOne]);

    const currentSong = SONGS[currentSongIndex];

    // Handle autoplay after song change (waits for src to update)
    useEffect(() => {
        if (shouldAutoPlay && audioRef.current) {
            audioRef.current.play().catch(console.error);
            setShouldAutoPlay(false);
        }
    }, [currentSongIndex, shouldAutoPlay]);

    // Audio element lives at parent level - never unmounts
    useEffect(() => {
        const audioEl = audioRef.current;
        const handleFirstInteraction = () => {
            if (audioEl) {
                audioEl.volume = 1;
                audioEl.muted = false;
            }
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        // Sync state with actual audio events (crucial for mobile persistence)
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        if (audioEl) {
            audioEl.addEventListener('play', handlePlay);
            audioEl.addEventListener('pause', handlePause);
        }

        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);
        return () => {
            if (audioEl) {
                audioEl.removeEventListener('play', handlePlay);
                audioEl.removeEventListener('pause', handlePause);
            }
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = false;
        audioRef.current.volume = 1;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(console.error);
        }
        // State is handled by event listeners in useEffect
    };

    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
        setIsPlaying(true);
        setShouldAutoPlay(true);
    };

    const prevSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
        setIsPlaying(true);
        setShouldAutoPlay(true);
    };

    const handleEnded = () => {
        // Use ref to get current value, not stale closure
        if (isRepeatOneRef.current && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
        } else {
            nextSong();
        }
    };

    // Audio state object to pass down
    const audioState: AudioState = {
        isPlaying,
        currentSongIndex,
        isRepeatOne,
        togglePlay,
        nextSong,
        prevSong,
        setIsRepeatOne,
    };

    const dockItems = [
        { id: 'music' as DockMode, icon: Music, label: 'Music' },
        { id: 'chat' as DockMode, icon: BotMessageSquare, label: 'AI Chat' },
    ];

    const handleExpand = (mode: DockMode) => {
        setActiveMode(mode);
        setIsExpanded(true);
    };

    const handleCollapse = () => {
        setIsResetting(true);
        setIsExpanded(false);
        setDragPosition({ x: 0, y: 0 });
        // Reset the flag after animation completes
        setTimeout(() => setIsResetting(false), 300);
    };

    // Handler for when drag starts from the chat header
    const handleChatDragStart = React.useCallback((e: any) => {
        dragControls.start(e);
    }, [dragControls]);

    // Shared layoutId for the container morph
    const containerLayoutId = "dock-container";

    return (
        <LayoutGroup>
            {/* [!] PERSISTENT AUDIO ELEMENT - lives at parent, never unmounts */}
            <audio
                ref={audioRef}
                src={currentSong.url}
                onEnded={handleEnded}
                preload="auto"
                style={{ display: 'none' }}
            />

            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-99" />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.5 }}
                animate={{
                    opacity: 1,
                    y: dragPosition.y,
                    scale: 1,
                    x: dragPosition.x,
                }}
                transition={isResetting ? snapBackTransition : popInTransition}
                drag
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                    setDragPosition(prev => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y
                    }));
                }}
                whileDrag={{ scale: 1.02 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 touch-none select-none"
                style={{ touchAction: 'none' }}
                onTouchStart={(e) => {
                    // Prevent page scroll when touching the dock
                    if (isExpanded) {
                        e.stopPropagation();
                    }
                }}
                onTouchMove={(e) => {
                    // Prevent page scroll during drag or when expanded
                    e.stopPropagation();
                }}
            >
                {/* Close button - OUTSIDE the overflow container so it doesn't get clipped */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: 1,
                                scale: [0.5, 1.12, 1],
                                transition: {
                                    opacity: {
                                        duration: 0.65,
                                        delay: 0.08,
                                        ease: 'easeOut',
                                    },
                                    scale: {
                                        duration: 0.4,
                                        delay: 0.18,
                                        ease: [0.34, 1.56, 0.64, 1],
                                    }
                                }
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.5,
                                transition: {
                                    duration: 0.01,
                                    ease: 'easeIn'
                                }
                            }}
                            onClick={handleCollapse}
                            className="absolute -top-0.5 -right-1 z-50 w-5 h-5 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:scale-110 active:scale-95 pointer-events-auto"
                        >
                            <X size={10} strokeWidth={2.5} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* The morphing container - layoutId handles the size/position morph */}
                <motion.div
                    layoutId={containerLayoutId}
                    layout
                    className="
                        relative
                        backdrop-blur-3xl backdrop-saturate-150
                        border border-white/40
                        overflow-hidden
                    "
                    style={{
                        borderRadius: 28,
                        boxShadow: `
                        0 0 0 1px rgba(255,255,255,0.4),
                        0 8px 16px -4px rgba(0,0,0,0.1),
                        0 20px 40px -8px rgba(0,0,0,0.12),
                        inset 0 1px 1px rgba(255,255,255,0.8),
                        inset 0 -10px 20px -5px rgba(255,255,255,0.9),
                        inset 0 -1px 0 rgba(255,255,255,1)
                    `,
                        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0.7) 100%)'
                    }}
                    transition={springTransition}
                >
                    {/* Inner highlight - top edge glow */}
                    <div
                        className="absolute inset-x-0 top-0 h-px pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 80%, transparent 100%)'
                        }}
                    />

                    {/* Subtle noise texture */}
                    <div
                        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat'
                        }}
                    />

                    {/* [!] CRITICAL: mode="popLayout" prevents the exit animation from blocking layout */}
                    <AnimatePresence mode="popLayout" initial={false}>
                        {!isExpanded ? (
                            /* COLLAPSED STATE */
                            <motion.div
                                key="collapsed"
                                {...blurReveal}
                                transition={contentTransition}
                                className="flex items-center gap-0.5 p-1 cursor-grab active:cursor-grabbing"
                                layout="position"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.4 }}
                                    transition={{ delay: 0.05 }}
                                    className="px-0.5"
                                >
                                    <GripVertical size={10} className="text-gray-500" />
                                </motion.div>

                                {dockItems.map((item, i) => (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.15, delay: i * 0.03 }}
                                        onClick={() => handleExpand(item.id)}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative w-9 h-9 rounded-[12px] flex items-center justify-center hover:bg-white/80 hover:shadow-md overflow-hidden"
                                    >
                                        <item.icon
                                            size={18}
                                            className="text-gray-600 relative z-10"
                                        />
                                        {item.id === 'music' && audioState.isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                                                <DotMatrixVisualizer isPlaying={true} rows={12} />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            /* EXPANDED STATE - layout="position" prevents stretch on content */
                            <motion.div
                                key={`expanded-${activeMode}`}
                                {...blurReveal}
                                transition={contentTransition}
                                className="w-[min(310px,calc(100vw-64px))] relative overscroll-contain"
                                layout="position"
                                onTouchMove={(e) => e.stopPropagation()}
                            >
                                {/* Content area - isolated from layout animation */}
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={activeMode}
                                        initial={{ opacity: 0, filter: 'blur(6px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, filter: 'blur(6px)' }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        {activeMode === 'music' ? (
                                            <>
                                                {/* Music mode header */}
                                                <motion.div
                                                    className="flex gap-1 p-2 pb-1 relative z-30 cursor-grab active:cursor-grabbing"
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.08 }}
                                                    onPointerDown={(e) => dragControls.start(e)}
                                                >
                                                    {dockItems.map((item) => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => setActiveMode(item.id)}
                                                            className={`
                                                                relative p-2 rounded-full overflow-hidden
                                                                ${activeMode === item.id
                                                                    ? 'bg-linear-to-b from-gray-700 to-gray-900 text-white shadow-lg'
                                                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                                }
                                                            `}
                                                            style={activeMode === item.id ? {
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                                                            } : undefined}
                                                        >
                                                            <item.icon size={14} strokeWidth={2.5} className="relative z-10" />
                                                            {item.id === 'music' && audioState.isPlaying && activeMode !== 'music' && (
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                                                                    <DotMatrixVisualizer isPlaying={true} rows={12} />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                                <MusicPlayer audioState={audioState} />
                                            </>
                                        ) : (
                                            <AIChatFloat
                                                activeMode={activeMode}
                                                setActiveMode={setActiveMode}
                                                onDragStart={handleChatDragStart}
                                                isPlaying={audioState.isPlaying}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </LayoutGroup>
    );
};
