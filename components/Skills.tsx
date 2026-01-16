import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import React from 'react';
import { SKILL_CATEGORIES } from '../constants';
import { SkillCategory } from '../types';
import {
    antiFlickerStyle,
    dailyDriverCardVariants,
    dailyDriverContentVariants,
    dailyDriverPillsVariants,
    popRevealVariants,
    sectionHeaderVariants,
    staggerContainerVariants,
    staggerItemVariants,
} from './animations';

export const Skills: React.FC = () => {
    return (
        <motion.section
            layout
            variants={staggerContainerVariants}
            className="p-6 md:p-8 border-b border-dashed border-gray-200 bg-[#FAFAFA]"
            style={antiFlickerStyle}
        >
            <PhilosophySection />

            <motion.h2
                variants={sectionHeaderVariants}
                className="text-[10px] md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase mb-6"
            >
                Skills
            </motion.h2>

            <motion.div
                layout="position"
                variants={staggerContainerVariants}
                className="flex flex-col gap-8"
            >
                {/* Render All Categories */}
                {SKILL_CATEGORIES.map((category, index) => (
                    <KeyboardGroup key={index} category={category} index={index} />
                ))}
            </motion.div>

            <MacMiniSection />
        </motion.section>
    );
};

const PhilosophySection: React.FC = () => {
    return (
        <motion.div
            id="philosophy"
            variants={staggerItemVariants}
            className="mb-10 flex flex-col gap-8 w-full"
        >
            <motion.h2
                variants={sectionHeaderVariants}
                className="text-[10px] md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase"
            >
                Philosophy
            </motion.h2>

            <div className="
                relative
                w-full
                rounded-2xl md:rounded-[24px]
                bg-transparent
                border border-dashed border-gray-300
                group
            ">
                {/* Decorative Quote Icons */}
                <div className="absolute -top-4 -left-4 z-20 p-2 bg-[#FAFAFA] rounded-full border border-dashed border-gray-300 shadow-sm">
                    <Quote size={18} className="text-gray-400 fill-gray-100 rotate-180" />
                </div>
                <div className="absolute -bottom-4 -right-4 z-20 p-2 bg-[#FAFAFA] rounded-full border border-dashed border-gray-300 shadow-sm">
                    <Quote size={18} className="text-gray-400 fill-gray-100" />
                </div>

                <div className="relative z-10 w-full overflow-hidden rounded-[inherit]">
                    <div className="relative w-full aspect-3/2 bg-white">
                        <img
                            src="/philosophy.png"
                            alt="Thinking Philosophy"
                            className="w-full h-full object-cover select-none grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                            draggable={false}
                        />
                        <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] pointer-events-none" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const KeyboardGroup: React.FC<{ category: SkillCategory; index: number }> = ({ category, index }) => {
    return (
        <motion.div
            variants={staggerItemVariants}
            className="flex flex-col gap-3 items-start w-full"
        >
            {/* Category Header - Transparent with Dashed Border */}
            <div className="ml-1">
                <h3 className="
            inline-flex items-center justify-center
            px-3 py-1 md:py-0.5
            rounded-[6px]
            bg-transparent
            border border-dashed border-gray-300
            text-[8px] md:text-[9px] font-bold font-mono text-gray-500 uppercase tracking-widest
            select-none
          ">
                    {category.title}
                </h3>
            </div>

            {/* The Keyboard Chassis */}
            <div className="
        relative
        p-4 md:p-4
        rounded-xl md:rounded-xl
        bg-gradient-to-b from-white to-gray-100
        border border-gray-200
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,1)]
        w-full md:max-w-4xl
      ">
                {/* Decorative Screws */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 w-2 h-2 rounded-full bg-gray-300 border border-gray-400/30 shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] flex items-center justify-center">
                    <div className="w-[1px] h-full bg-gray-400/50 transform rotate-45" />
                    <div className="h-[1px] w-full bg-gray-400/50 absolute transform rotate-45" />
                </div>
                <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 rounded-full bg-gray-300 border border-gray-400/30 shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] flex items-center justify-center">
                    <div className="w-[1px] h-full bg-gray-400/50 transform rotate-45" />
                    <div className="h-[1px] w-full bg-gray-400/50 absolute transform rotate-45" />
                </div>
                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-2 h-2 rounded-full bg-gray-300 border border-gray-400/30 shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] flex items-center justify-center">
                    <div className="w-[1px] h-full bg-gray-400/50 transform rotate-45" />
                    <div className="h-[1px] w-full bg-gray-400/50 absolute transform rotate-45" />
                </div>
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-2 h-2 rounded-full bg-gray-300 border border-gray-400/30 shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] flex items-center justify-center">
                    <div className="w-[1px] h-full bg-gray-400/50 transform rotate-45" />
                    <div className="h-[1px] w-full bg-gray-400/50 absolute transform rotate-45" />
                </div>

                {/* Keys Container */}
                <motion.div
                    variants={staggerContainerVariants}
                    className="flex flex-wrap gap-1.5 md:gap-2 relative z-10 px-1 py-1"
                >
                    {category.skills.map((skill: string, idx: number) => (
                        <Keycap key={idx} label={skill} />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}

const AUDIO_POOL_SIZE = 5;
const audioPool = (typeof Audio !== 'undefined')
    ? Array.from({ length: AUDIO_POOL_SIZE }, () => {
        const a = new Audio('/click.mp3');
        a.preload = 'auto';
        return a;
    })
    : [];
let poolIndex = 0;

const playClick = () => {
    if (audioPool.length === 0) return;
    const sound = audioPool[poolIndex];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => { });
        poolIndex = (poolIndex + 1) % AUDIO_POOL_SIZE;
    }
};

const Keycap: React.FC<{ label: string }> = ({ label }) => {
    return (
        <motion.button
            variants={staggerItemVariants}
            onMouseDown={playClick}
            onTouchStart={(e) => {
                // Prevent double triggering on some mobile browsers
                e.preventDefault();
                playClick();
            }}
            className="
                group relative
                /* Responsive Layout */
                h-7 md:h-8 px-2 md:px-3
                min-w-[max-content]
                flex-grow
                flex items-center justify-center

                /* Social Button Style Adoption */
                bg-gradient-to-b from-white via-gray-100 to-gray-200
                border border-gray-300/60
                rounded-[6px] md:rounded-[6px]

                /* Shadow & 3D Depth (Matches Social Buttons) */
                shadow-[0_4px_0_#d1d5db,0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]
                md:shadow-[0_3px_0_#d1d5db,0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]

                /* Typography (Kept Mono for Keyboard feel) */
                text-gray-600 font-mono text-[8px] md:text-[10px] font-bold uppercase tracking-wide

                /* Transitions */
                transition-transform duration-100 ease-out

                /* Hover Effects - Slight Depress */
                hover:shadow-[0_2px_0_#d1d5db,0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]
                hover:translate-y-[2px]
                md:hover:shadow-[0_1.5px_0_#d1d5db,0_1.5px_3px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]
                md:hover:translate-y-[1.5px]

                /* Active / Pressed State - Full Depress */
                active:shadow-[0_0px_0_#d1d5db,inset_0_2px_4px_rgba(0,0,0,0.1)]
                active:translate-y-[4px]
                md:active:translate-y-[3px]

                /* Focus - Clean Focus */
                outline-none
            "
        >
            {label}
        </motion.button>
    )
}

const dailyDriverViewport = {
    once: true,
    amount: 0.25 as const,
};

const MacMiniSection: React.FC = () => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={dailyDriverViewport}
            variants={staggerContainerVariants}
            className="mt-12 md:mt-16 flex flex-col gap-6 items-center w-full"
        >
            <motion.div variants={staggerItemVariants} className="relative pb-6">
                <motion.h3
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, ease: 'easeOut' },
                        },
                    }}
                    className="
                        font-serif italic
                        text-4xl md:text-5xl
                        text-gray-500
                        tracking-wide
                        transform -rotate-3
                        select-none
                        relative z-10
                    "
                >
                    My Daily Driver
                </motion.h3>

                <svg
                    className="absolute w-full h-8 md:h-6 bottom-0 md:bottom-1 left-0 text-[rgb(74,108,196)] z-0 pointer-events-none transform -rotate-3"
                    viewBox="0 0 182 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        variants={{
                            hidden: { pathLength: 0, opacity: 0 },
                            visible: {
                                pathLength: 1,
                                opacity: 1,
                                transition: {
                                    duration: 1.5,
                                    delay: 0.5,
                                    ease: 'easeInOut',
                                },
                            },
                        }}
                        d="M2 7.5C15 2 30 13 45 7.5C60 2 75 13 90 7.5C105 2 120 13 135 7.5C150 2 165 13 180 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.div>

            <motion.div
                variants={dailyDriverCardVariants}
                className="
                    relative
                    w-full
                    p-0
                    rounded-2xl md:rounded-[24px]
                    bg-gradient-to-b from-white to-[#F5F5F7]
                    border border-gray-200
                    shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(0,0,0,0.03)]
                    overflow-hidden
                    group
                    flex flex-col md:flex-row items-center
                "
            >
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                    }}
                />

                <motion.div
                    variants={popRevealVariants}
                    className="w-full md:w-5/12 p-8 pb-0 md:pb-8 flex items-center justify-center relative z-10"
                >
                    <div className="relative w-[240px] md:w-[320px] aspect-square flex items-center justify-center">
                        <div className="absolute inset-x-2 bottom-6 h-6 bg-black/20 blur-xl rounded-[100%] transform scale-x-75 group-hover:scale-x-90 group-hover:bg-black/25 transition-transform duration-500" />

                        <img
                            src="/mac_mini.png"
                            alt="Mac Mini M4"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] select-none scale-[1.14] md:scale-[1.20] transition-transform duration-500"
                            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    variants={dailyDriverContentVariants}
                    className="w-full md:w-7/12 p-6 pt-2 md:pt-4 md:pl-4 text-center md:text-left flex flex-col justify-center gap-4 relative z-10"
                >
                    <motion.div variants={dailyDriverContentVariants}>
                        <motion.div
                            variants={dailyDriverContentVariants}
                            className="flex items-center justify-center md:justify-start gap-3 mb-1"
                        >
                            <motion.h4
                                variants={staggerItemVariants}
                                className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight"
                            >
                                Mac mini
                            </motion.h4>
                            <motion.span
                                variants={staggerItemVariants}
                                className="px-2 py-0.5 bg-gradient-to-br from-slate-800 via-slate-600 to-slate-900 rounded text-[10px] font-bold text-white border border-black uppercase tracking-wide"
                            >
                                M4
                            </motion.span>
                        </motion.div>
                        <motion.p
                            variants={staggerItemVariants}
                            className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest"
                        >
                            It's my personal station!
                        </motion.p>
                    </motion.div>

                    <motion.p
                        variants={staggerItemVariants}
                        className="text-[11px] md:text-xs text-gray-600 font-medium leading-relaxed max-w-sm mx-auto md:mx-0 text-center md:text-left"
                    >
                        Compact yet incredibly powerful. This little machine handles my entire development stack from Backend to heavy frontend builds silently and efficiently. I also use multi-screen setup which allow me to do rapid prototyping and testing.
                    </motion.p>

                    <motion.div
                        variants={dailyDriverPillsVariants}
                        className="flex flex-wrap gap-2 justify-center md:justify-start mt-2 md:mt-2"
                    >
                        <SpecBadge>Apple Silicon</SpecBadge>
                        <SpecBadge>16GB Unified</SpecBadge>
                        <SpecBadge>512GB SSD</SpecBadge>
                        <SpecBadge>Remote Access</SpecBadge>
                        <SpecBadge>mac OS Tahoe</SpecBadge>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

const SpecBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.span
        variants={staggerItemVariants}
        className="
        px-2 py-0.5
        rounded-[5px]
        /* Premium Gradient & Board */
        bg-linear-to-b from-white via-gray-100 to-gray-200
        border border-gray-300/60
        /* Typography - Micro Scale */
        text-[7.5px] md:text-[8.5px] font-bold text-gray-500 uppercase tracking-widest
        /* Softened 3D Depth */
        shadow-[0_1px_0_#d1d5db,0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]
    ">
        {children}
    </motion.span>
)
