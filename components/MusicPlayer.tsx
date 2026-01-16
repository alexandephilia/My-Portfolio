import { Pause, Play, Repeat, Repeat1, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useId, useMemo } from 'react';
import { SONGS } from '../constants';
import type { AudioState } from './TransformDock';

const MAX_TITLE_CHARS = 12;

// Dot matrix configuration
const MATRIX_COLS = 8;

interface MusicPlayerProps {
    audioState: AudioState;
}

// CSS Keyframes for dot animation - injected once
const DOT_ANIMATION_STYLES = `
@keyframes dotPulse {
    0%, 100% {
        opacity: 0.3;
        transform: scale(0.7);
        background-color: rgba(30, 58, 138, 0.4);
    }
    50% {
        opacity: var(--dot-intensity, 0.9);
        transform: scale(1);
        background-color: rgba(59, 130, 246, 0.95);
    }
}
`;

// Dot Matrix Visualizer Component - CSS animation based for mobile reliability
export const DotMatrixVisualizer: React.FC<{ isPlaying: boolean; rows?: number }> = ({
    isPlaying,
    rows = 4
}) => {
    const instanceId = useId();

    // Generate animation patterns for each dot
    const dotPatterns = useMemo(() => {
        return Array.from({ length: MATRIX_COLS * rows }, (_, i) => {
            const col = i % MATRIX_COLS;
            const row = Math.floor(i / MATRIX_COLS);
            const baseDelay = col * 0.08;
            const centerRow = (rows - 1) / 2;
            const rowOffset = Math.abs(row - centerRow) * 0.05;
            const maxDistance = Math.max(centerRow, rows - 1 - centerRow) || 1;
            const normalizedDistance = Math.abs(row - centerRow) / maxDistance;
            const intensity = 1 - normalizedDistance * 0.4;
            return {
                delay: baseDelay + rowOffset,
                duration: 0.4 + Math.random() * 0.3,
                intensity,
            };
        });
    }, [rows]);

    return (
        <>
            <style>{DOT_ANIMATION_STYLES}</style>
            <div
                className="grid gap-[1.5px]"
                style={{
                    gridTemplateColumns: `repeat(${MATRIX_COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
            >
                {dotPatterns.map((pattern, i) => (
                    <div
                        key={`${instanceId}-dot-${i}`}
                        className="w-[3px] h-[3px] rounded-full"
                        style={{
                            '--dot-intensity': pattern.intensity,
                            animation: isPlaying
                                ? `dotPulse ${pattern.duration}s ease-in-out ${pattern.delay}s infinite`
                                : 'none',
                            opacity: isPlaying ? undefined : 0.4,
                            transform: isPlaying ? undefined : 'scale(0.7)',
                            backgroundColor: isPlaying ? undefined : 'rgba(100, 116, 139, 0.5)',
                            willChange: isPlaying ? 'transform, opacity' : 'auto',
                        } as React.CSSProperties}
                    />
                ))}
            </div>
        </>
    );
};

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioState }) => {
    const { isPlaying, currentSongIndex, isRepeatOne, togglePlay, nextSong, prevSong, setIsRepeatOne } = audioState;

    const currentSong = SONGS[currentSongIndex];
    const shouldScroll = currentSong.title.length > MAX_TITLE_CHARS;

    return (
        <div className="p-3">
            <div className="flex items-center gap-4">
                {/* Album Art */}
                <div className="relative flex-shrink-0">
                    <div className={`
                        w-12 h-12 bg-gray-900 rounded-xl
                        flex items-center justify-center
                        shadow-lg overflow-hidden
                        border border-blue-500/10 ring-1 ring-blue-900/5
                        transition-transform duration-300
                        ${isPlaying ? 'scale-[1.05]' : 'scale-100'}
                    `}>
                        <img
                            src={currentSong.coverUrl}
                            className={`w-full h-full object-cover transition-transform duration-1000 pointer-events-none select-none ${isPlaying ? 'scale-110' : 'scale-100'}`}
                            alt={currentSong.title}
                            draggable={false}
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
                            }}
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex flex-col">
                        <div
                            className="overflow-hidden whitespace-nowrap relative h-4 flex items-center w-full"
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
                                <span className="text-[10px] md:text-[11px] font-black text-blue-900 pr-8 tracking-tight uppercase whitespace-nowrap">
                                    {currentSong.title}
                                </span>
                                {shouldScroll && (
                                    <span className="text-[10px] md:text-[11px] font-black text-blue-900 pr-8 tracking-tight uppercase whitespace-nowrap">
                                        {currentSong.title}
                                    </span>
                                )}
                            </motion.div>
                        </div>
                        <span className="text-[7px] md:text-[8px] text-blue-500/60 font-bold uppercase tracking-[0.2em] truncate">
                            {currentSong.artist}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 h-4 mt-0.5">
                        <DotMatrixVisualizer isPlaying={isPlaying} />
                        <button
                            onClick={() => setIsRepeatOne(!isRepeatOne)}
                            className={`transition-colors active:scale-90 ${isRepeatOne ? 'text-blue-600' : 'text-blue-300'}`}
                        >
                            {isRepeatOne ? <Repeat1 size={10} /> : <Repeat size={10} />}
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5 pr-1">
                    <button onClick={prevSong} className="p-1.5 active:scale-90 transition-transform group">
                        <SkipBack size={13} className="stroke-gray-400 fill-gray-400 group-hover:stroke-gray-600 group-hover:fill-gray-600 transition-colors" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-gradient-to-b from-white to-gray-50 flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all border border-blue-50/50"
                        style={{
                            boxShadow: `
                                0 4px 10px -2px rgba(30,58,138,0.1),
                                inset 0 1.5px 0px rgba(255,255,255,1),
                                inset 0 -2px 3px rgba(30,58,138,0.04),
                                0 0 0 1px rgba(30,58,138,0.02)
                            `
                        }}
                    >
                        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button onClick={nextSong} className="p-1.5 active:scale-90 transition-transform group">
                        <SkipForward size={13} className="stroke-gray-400 fill-gray-400 group-hover:stroke-gray-600 group-hover:fill-gray-600 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};
