import { Pause, Play, Repeat, Repeat1, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { SONGS } from '../constants';
import type { AudioState } from './TransformDock';

const MAX_TITLE_CHARS = 12;

// Dot matrix configuration
const MATRIX_COLS = 8;
const MATRIX_ROWS = 3;

interface MusicPlayerProps {
    audioState: AudioState;
}

// Dot Matrix Visualizer Component
const DotMatrixVisualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
    // Generate random animation patterns for each dot
    const dotPatterns = useMemo(() => {
        return Array.from({ length: MATRIX_COLS * MATRIX_ROWS }, (_, i) => {
            const col = i % MATRIX_COLS;
            const row = Math.floor(i / MATRIX_COLS);
            // Create wave-like pattern based on column position
            const baseDelay = col * 0.08;
            const rowOffset = Math.abs(row - 1) * 0.05; // Center rows animate first
            return {
                delay: baseDelay + rowOffset,
                duration: 0.4 + Math.random() * 0.3,
                // Higher probability of being "on" for center rows
                intensity: 1 - Math.abs(row - 2) * 0.2,
            };
        });
    }, []);

    return (
        <div
            className="grid gap-[2px]"
            style={{
                gridTemplateColumns: `repeat(${MATRIX_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${MATRIX_ROWS}, 1fr)`,
            }}
        >
            {dotPatterns.map((pattern, i) => (
                <motion.div
                    key={i}
                    className="w-[3px] h-[3px] rounded-full"
                    animate={isPlaying ? {
                        opacity: [0.3, pattern.intensity, 0.3],
                        scale: [0.7, 1, 0.7],
                        backgroundColor: [
                            'rgba(30, 58, 138, 0.4)',
                            'rgba(59, 130, 246, 0.95)',
                            'rgba(30, 58, 138, 0.4)',
                        ],
                    } : {
                        opacity: 0.4,
                        scale: 0.7,
                        backgroundColor: 'rgba(100, 116, 139, 0.5)',
                    }}
                    transition={isPlaying ? {
                        repeat: Infinity,
                        duration: pattern.duration,
                        delay: pattern.delay,
                        ease: 'easeInOut',
                    } : {
                        duration: 0.3,
                    }}
                />
            ))}
        </div>
    );
};

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioState }) => {
    const { isPlaying, currentSongIndex, isRepeatOne, togglePlay, nextSong, prevSong, setIsRepeatOne } = audioState;

    const currentSong = SONGS[currentSongIndex];
    const shouldScroll = currentSong.title.length > MAX_TITLE_CHARS;

    return (
        <div className="p-2">
            <div className="flex items-center gap-3">
                {/* Album Art */}
                <div className="relative flex-shrink-0">
                    <div className={`
                        w-14 h-14 bg-gray-900 rounded-[14px]
                        flex items-center justify-center
                        shadow-lg overflow-hidden
                        border-[3px] border-blue-500/20 ring-1 ring-blue-900/10
                        transition-transform duration-300
                        ${isPlaying ? 'scale-[1.02]' : 'scale-100'}
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
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, transparent 50%, rgba(255,255,255,0.05) 80%, rgba(255,255,255,0.15) 100%)',
                            }}
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="min-w-[100px] flex flex-col gap-1">
                    <div className="flex flex-col">
                        <div
                            className="overflow-hidden whitespace-nowrap relative h-4 flex items-center w-[100px]"
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

                    <div className="flex items-center gap-3 h-5">
                        {/* Dot Matrix Visualizer */}
                        <DotMatrixVisualizer isPlaying={isPlaying} />

                        <button onClick={() => setIsRepeatOne(!isRepeatOne)} className={`p-1 ${isRepeatOne ? 'text-blue-600' : 'text-blue-300'}`}>
                            {isRepeatOne ? <Repeat1 size={12} /> : <Repeat size={12} />}
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                    <button onClick={prevSong} className="p-1.5 active:scale-90 transition-transform group">
                        <SkipBack size={14} className="stroke-gray-400 fill-gray-400 group-hover:stroke-gray-600 group-hover:fill-gray-600 transition-colors" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-gradient-to-b from-white to-blue-50/80 border border-blue-200/80 shadow-md flex items-center justify-center text-blue-900 hover:scale-105 active:scale-95 transition-transform"
                    >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button onClick={nextSong} className="p-1.5 active:scale-90 transition-transform group">
                        <SkipForward size={14} className="stroke-gray-400 fill-gray-400 group-hover:stroke-gray-600 group-hover:fill-gray-600 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};
