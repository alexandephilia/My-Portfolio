import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CONTACT_INFO } from '../constants';
import { antiFlickerStyle, blurOnlyVariants, viewportSettings } from './animations';
import { useDevice } from './hooks/useDevice';

export const Footer: React.FC = () => {
    // Fallback email if constant isn't found
    const email = CONTACT_INFO.find(c => c.label === "Email")?.value || "garry.alexander@email.com";
    const mailtoLink = `mailto:${email}`;

    const [showAlternate, setShowAlternate] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useDevice();

    // Responsive widths - idle needs to fit "LET'S BUILD AND SHIP TOGETHER" + icon
    const idleWidth = isMobile ? 200 : 295;
    const hoverWidth = isMobile ? 100 : 145;

    // Auto-repeating animation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setShowAlternate(prev => !prev);
        }, 2500); // Toggle every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative pt-8 md:pt-16 pb-0 bg-[#FAFAFA] border-t border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-between min-h-[350px] md:min-h-[500px]" style={antiFlickerStyle}>

            {/* Scroll Top Button (Visible on Mobile now) */}
            <motion.button
                onClick={scrollToTop}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.95 }}
                className="
            absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full
            bg-linear-to-b from-white to-gray-100
            border border-gray-200
            text-gray-400 hover:text-blue-600 hover:border-blue-200
            shadow-[inset_0_1px_0_rgba(255,255,255,1),0_4px_8px_rgba(0,0,0,0.05)]
            active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
            transition-colors duration-200 flex z-20"
                title="Scroll to top"
            >
                <ArrowUp size={20} />
            </motion.button>

            <div className="flex flex-col items-center z-10 w-full px-6 flex-1 justify-center pb-12 md:pb-24">

                {/* Large Italic Text with Catchy Super Text */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportSettings}
                    variants={blurOnlyVariants}
                    className="text-center mb-4 md:mb-8 relative mt-10 md:mt-10"
                >
                    <div className="relative inline-block px-4">
                        <span className="font-serif italic text-4xl md:text-6xl lg:text-7xl text-[rgb(74,108,196)] leading-none">
                            You've made it so far...
                        </span>

                        {/* Attribution Pill - Left Aligned */}
                        <div className="flex justify-start mt-0 mb-1 ml-1 opacity-70">
                            <span className="
                                px-1.5 md:px-2.5 py-0.5 rounded-[4px] md:rounded-[6px]
                                bg-[#FAFAFA]/90 backdrop-blur-sm
                                border border-dashed border-gray-300
                                shadow-sm
                                text-[8px] md:text-[10px] font-medium text-gray-500 tracking-wide
                                flex items-center gap-1 md:gap-1 select-none
                            ">
                                <span className="text-gray-500">Designed in</span>
                                <svg className="w-2.5 h-2.5 md:w-2.5 md:h-2.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
                                </svg>
                                <span className="w-px h-2 md:h-2.5 bg-gray-300 mx-0.1" />
                                <span className="text-gray-500">Code in React</span>
                            </span>
                        </div>

                        {/* Super text catchy element - Flat, Keyboard-feel, Stripped Border
                    Using a wrapper for positioning and entrance animation.
                */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: "-50%" }}
                            whileInView={{ opacity: 1, y: 0, x: "-50%" }}
                            viewport={{ once: true }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                delay: 0.3
                            }}
                            className="absolute -top-10 md:-top-10 left-1/2 z-10"
                        >
                            <motion.div
                                ref={containerRef}
                                data-is-hovered={showAlternate}
                                className="
                            relative
                            bg-[#FAFAFA]/90 backdrop-blur-sm
                            text-gray-500
                            rounded-[6px] md:rounded-[8px]
                            border border-dashed border-gray-300
                            select-none
                            shadow-sm
                            flex items-center justify-center
                            overflow-hidden
                            min-h-[24px] md:min-h-[32px]
                        "
                                // Animate width: use viewport-aware values
                                animate={{
                                    width: showAlternate ? hoverWidth : idleWidth,
                                    rotate: showAlternate ? -2 : 0,
                                    scale: showAlternate ? 1.05 : 1,
                                }}
                                transition={{
                                    width: {
                                        type: "spring",
                                        stiffness: 120,
                                        damping: 18,
                                        mass: 1.2,
                                    },
                                    rotate: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15,
                                        max: 360,
                                    },
                                    scale: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15,
                                    },
                                }}
                            >
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {showAlternate ? (
                                        <motion.span
                                            key="hover"
                                            initial={{ opacity: 0, y: 20, rotateX: 90 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                rotateX: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -20,
                                                rotateX: -90,
                                            }}
                                            transition={{
                                                duration: 0.42,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            style={{ transformPerspective: 600, transformOrigin: "center top" }}
                                            className="px-3 md:px-6 py-1.5 md:py-2.5 text-[8px] md:text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center whitespace-nowrap text-[rgb(74,108,196)] absolute"
                                        >
                                            Can we talk?
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="idle"
                                            initial={{ opacity: 0, y: -20, rotateX: -90 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                rotateX: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: 20,
                                                rotateX: 90,
                                            }}
                                            transition={{
                                                duration: 0.42,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            style={{ transformPerspective: 600, transformOrigin: "center bottom" }}
                                            className="px-3 md:px-6 py-1.5 md:py-2.5 text-[8px] md:text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 md:gap-3 whitespace-nowrap text-gray-400 absolute"
                                        >
                                            LET'S BUILD AND SHIP TOGETHER <Sparkles size={10} className="text-amber-400 md:w-[14px] md:h-[14px]" fill="currentColor" />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Interactive 'Let's talk!' Keyboard Button Container */}
                <div className="relative group z-10">
                    <motion.a
                        href={mailtoLink}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: 3 }}
                        whileTap={{ y: 6, scale: 0.98 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={antiFlickerStyle}
                        className="
                    relative inline-flex items-center justify-center
                    px-10 py-4 md:px-12 md:py-5
                    rounded-[20px] md:rounded-[24px]
                    text-2xl md:text-3xl font-bold font-serif italic text-gray-700
                    cursor-pointer select-none

                    /* Gradient Surface */
                    bg-linear-to-b from-white to-gray-50

                    /* Borders */
                    border border-gray-300 border-b-0

                    /* Realistic Keycap Shadows:
                       1. Highlight inset
                       2. Side/Depth shadow (Dark Grey)
                       3. Drop shadow - Tight & compact at rest
                    */
                    shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_0_#9ca3af,0_10px_15px_rgba(0,0,0,0.18)]

                    /* Shadow transitions are fine, but transform is now Framer-controlled */
                    transition-[box-shadow,background-color] duration-200 ease-out

                    /* Hover State - Shadow only */
                    hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_5px_0_#9ca3af,0_6px_10px_rgba(0,0,0,0.15)]

                    /* Active/Pressed State - Shadow/BG only */
                    active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_2px_0_#9ca3af,0_4px_4px_rgba(0,0,0,0.05)]
                    active:bg-linear-to-b active:from-gray-100 active:to-gray-200
                "
                    >
                        Let's talk!
                    </motion.a>
                </div>

                {/* DESKTOP Connecting Squiggle Arrow - Visible only on md+ */}
                <motion.svg
                    width="120"
                    height="100"
                    viewBox="0 0 120 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-1/2 ml-[40px] md:ml-[120px] top-1/2 -translate-y-[69px] hidden md:block text-[rgb(74,108,196)]/60 pointer-events-none"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <motion.path
                        d="M79,1 C60,10 90,30 90,50 C90,80 50,80 10,80"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        variants={{
                            hidden: { pathLength: 0, opacity: 0 },
                            visible: {
                                pathLength: 1,
                                opacity: 1,
                                transition: {
                                    pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
                                    opacity: { duration: 0.2, delay: 0.5 }
                                }
                            }
                        }}
                    />
                    <motion.path
                        d="M20,80 L10,90 L25,95"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="absolute left-1/2 ml-[40px] md:ml-[120px] top-1/2 -translate-y-[8.5px] -translate-x-[2px] hidden md:block text-[rgb(74,108,196)]/60 pointer-events-none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        variants={{
                            hidden: { pathLength: 0, opacity: 0 },
                            visible: {
                                pathLength: 1,
                                opacity: 1,
                                transition: {
                                    pathLength: { duration: 0.3, ease: "easeInOut", delay: 1.9 },
                                    opacity: { duration: 0.2, delay: 1.9 }
                                }
                            }
                        }}
                    />
                </motion.svg>

                {/* MOBILE Connecting Squiggle Arrow - Visible only on <md */}
                <motion.svg
                    width="80"
                    height="60"
                    viewBox="0 0 80 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-1/2 ml-[85px] top-1/2 -translate-y-[45px] block md:hidden text-[rgb(74,108,196)]/60 pointer-events-none"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                >
                    <motion.path
                        d="M30,5 C30,5 50,15 50,30 C50,45 35,50 15,50"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        variants={{
                            hidden: { pathLength: 0, opacity: 0 },
                            visible: {
                                pathLength: 1,
                                opacity: 1,
                                transition: {
                                    pathLength: { duration: 1.2, ease: "easeInOut", delay: 0.6 },
                                    opacity: { duration: 0.2, delay: 0.6 }
                                }
                            }
                        }}
                    />
                    <motion.path
                        d="M25,50 L15,55 L28,58"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="absolute left-1/2 ml-[85px] top-1/2 -translate-y-[4.2px] -translate-x-[4.0px] block md:hidden text-[rgb(74,108,196)]/60 pointer-events-none"
                        strokeLinejoin="round"
                        fill="none"
                        variants={{
                            hidden: { pathLength: 0, opacity: 0 },
                            visible: {
                                pathLength: 1,
                                opacity: 1,
                                transition: {
                                    pathLength: { duration: 0.3, ease: "easeInOut", delay: 1.8 },
                                    opacity: { duration: 0.2, delay: 1.8 }
                                }
                            }
                        }}
                    />
                </motion.svg>

                {/* Removed Last updated text */}
            </div>

            {/* THE END - Half Visible Footer Element */}
            <div className="w-full overflow-hidden flex justify-center pointer-events-none select-none relative h-[60px] md:h-[100px]">
                <h1 className="text-[120px] md:text-[200px] font-black text-gray-200/50 leading-[0.75] tracking-tighter absolute top-0 whitespace-nowrap">
                    THE END
                </h1>
            </div>

            
        </footer>
    );
};
