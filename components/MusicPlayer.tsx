import { Pause, Play, Repeat, Repeat1, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { SONGS } from '../constants';
import type { AudioState } from './TransformDock';

const MAX_TITLE_CHARS = 12;

interface MusicPlayerProps {
    audioState: AudioState;
}

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
                        border-[3px] border-white/20 ring-1 ring-black/10
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
                        <button onClick={() => setIsRepeatOne(!isRepeatOne)} className={`p-1 ${isRepeatOne ? 'text-[rgb(74,108,196)]' : 'text-gray-300'}`}>
                            {isRepeatOne ? <Repeat1 size={12} /> : <Repeat size={12} />}
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
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
                </div>
            </div>
        </div>
    );
};
