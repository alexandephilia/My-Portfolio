import { motion } from 'motion/react';
import ProgressiveText from './ProgressiveText';
import { dailyDriverContentVariants, dailyDriverPillsVariants, popRevealVariants, staggerContainerVariants, staggerItemVariants } from './animations';

const SpecBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.span
        variants={staggerItemVariants}
        className="
            relative
            px-2.5 py-1
            rounded-lg
            bg-gray-100/50
            border border-gray-200/50
            text-[7px] md:text-[8px] font-black text-gray-500/90 tracking-[0.12em] uppercase
            shadow-[
                0_1px_1px_rgba(255,255,255,1),
                inset_0_1px_2px_rgba(0,0,0,0.1),
                inset_0_2px_4px_rgba(0,0,0,0.05)
            ]
            inline-flex items-center justify-center
            overflow-hidden
            whitespace-nowrap
            group
        "
        style={{ willChange: "transform, opacity, filter" }}
    >
        {/* The 'Recessed' Bottom Layer */}
        <div className="absolute inset-0 bg-linear-to-b from-gray-200 to-gray-50 opacity-40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />

        {/* The Raised Content Pill - Sitting inside of the well */}
        <div className="
            absolute inset-[1px]
            rounded-[7px]
            bg-linear-to-b from-white to-[#f8f8f8]
            shadow-[
                0_1.5px_1px_rgba(0,0,0,0.05),
                inset_0_1px_0_rgba(255,255,255,1)
            ]
        " />

        <span className="relative z-10">{children}</span>
    </motion.span>
);

const MacMiniSection: React.FC = () => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
            className="mt-20 md:mt-24 flex flex-col gap-10 items-center w-full"
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
                        text-4xl md:text-6xl
                        text-gray-900
                        tracking-wide
                        transform -rotate-3
                        select-none
                        relative z-10
                    "
                >
                    My Daily Driver
                </motion.h3>

                <svg
                    className="absolute w-full h-8 md:h-10 -bottom-2 md:-bottom-4 left-0 text-[rgb(74,108,196)] z-0 pointer-events-none transform -rotate-3"
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
                                transition: { duration: 1.5, delay: 0.5, ease: 'easeInOut' },
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
                variants={staggerItemVariants}
                className="
                    relative
                    w-full
                    rounded-[32px] md:rounded-[48px]
                    bg-linear-to-b from-white to-[#F5F5F7]
                    border border-gray-200
                    shadow-[inset_0_1.5px_1px_rgba(255,255,255,1),0_4px_12px_rgba(0,0,0,0.03)]
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
                    <div className="relative w-[280px] md:w-[380px] aspect-square flex items-center justify-center">
                        <div className="absolute inset-x-4 bottom-8 h-8 bg-black/20 blur-2xl rounded-[100%] transform scale-x-75" />
                        <motion.img
                            src="/mac_mini.png"
                            alt="Mac Mini M4"
                            draggable={false}
                            className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] select-none scale-[1.14] md:scale-[1.25]"
                        />
                    </div>
                </motion.div>

                <motion.div
                    variants={dailyDriverContentVariants}
                    className="w-full md:w-7/12 p-8 md:p-12 text-center md:text-left flex flex-col justify-center gap-6 relative z-10"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <h4 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                                Mac mini
                            </h4>
                            <span className="px-3 py-1 bg-linear-to-br from-slate-800 to-slate-900 rounded-lg text-[12px] font-black text-white border border-black shadow-lg uppercase tracking-widest">
                                M4
                            </span>
                        </div>
                        <p className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            It's my personal station!
                        </p>
                    </div>

                    <ProgressiveText className="text-[12px] md:text-[14px] text-gray-600 font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                        Compact yet incredibly powerful. This little machine handles my entire development stack from Backend to heavy frontend builds silently and efficiently. I use a multi-screen setup which allows me to do rapid prototyping and testing.
                    </ProgressiveText>

                    <motion.div
                        variants={dailyDriverPillsVariants}
                        className="flex flex-wrap gap-1.5 justify-center md:justify-start"
                    >
                        <SpecBadge>Apple Silicon</SpecBadge>
                        <SpecBadge>16GB Unified</SpecBadge>
                        <SpecBadge>512GB SSD</SpecBadge>
                        <SpecBadge>Remote Access</SpecBadge>
                        <SpecBadge>macOS Tahoe</SpecBadge>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default MacMiniSection;
