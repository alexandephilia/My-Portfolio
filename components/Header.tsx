import { motion } from 'motion/react';
import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { antiFlickerStyle, staggerContainerVariants, staggerItemVariants } from './animations';

export const Header: React.FC = () => {
    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
            style={antiFlickerStyle}
            className="flex justify-between items-center p-6 md:p-10 bg-[#FAFAFA]"
        >
            <motion.div variants={staggerItemVariants} className="flex flex-col gap-1">
                {/* Branding Logo - Using 14px blur via staggerItemVariants */}
                <img
                    src="/name.png"
                    alt="alex.exit(0)"
                    className="h-6 md:h-8 w-auto object-contain"
                />

                {/* Availability Pill - Below the name */}
                <motion.div variants={staggerItemVariants} className="flex items-center ml-4 md:ml-6">
                    <div className="
                        inline-flex items-center gap-1 md:gap-1.5
                        px-1 py-[1px] md:px-2 md:py-0.5
                        bg-linear-to-b from-white via-emerald-50 to-emerald-100/60
                        rounded-full
                        border border-emerald-200/60
                        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_2px_rgba(16,185,129,0.1)]
                        relative overflow-hidden
                    ">
                        {/* Shine overlay */}
                        <div className="absolute inset-x-0 top-0 h-[50%] bg-linear-to-b from-white/80 to-transparent pointer-events-none mix-blend-overlay" />
                        <span className="relative flex items-center justify-center h-[6px] w-[6px] md:h-3 md:w-3">
                            <span className="animate-ping absolute inline-flex h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-emerald-400/60 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1 w-1 md:h-1.5 md:w-1.5 bg-emerald-500 shadow-[0_0_3px_rgba(16,185,129,0.5)]"></span>
                        </span>
                        <span className="font-mono text-[6px] md:text-[8px] font-semibold text-emerald-700 uppercase tracking-[0.06em] whitespace-nowrap leading-none">
                            Available to Work
                        </span>
                    </div>
                </motion.div>
            </motion.div>
            <motion.div
                variants={staggerContainerVariants}
                className="flex gap-1.5 md:gap-2"
            >
                {SOCIAL_LINKS.map((link, i) => (
                    <motion.a
                        key={i}
                        variants={staggerItemVariants}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className={`
                            flex items-center justify-center
                            w-7 h-7 md:w-8 md:h-8
                            rounded-md md:rounded-lg
                            transition-transform duration-150
                            ${link.buttonStyle}
                        `}
                    >
                        <link.icon className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.a>
                ))}
            </motion.div>
        </motion.header>
    );
};
