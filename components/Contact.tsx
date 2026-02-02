import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants';
import { antiFlickerStyle, blurOnlyVariants, staggerContainerVariants, staggerItemVariants } from './animations';
import { useCursorStore } from './hooks/useCursorStore';
import ProgressiveText from './ProgressiveText';

const ContactLink: React.FC<{ item: any; index: number }> = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState({ x: 0, y: 0 });
    const { setHoveringButton } = useCursorStore();

    // Mapping for cursor snap
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 30, stiffness: 500, mass: 0.8 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Magnetic pull for the background
    const overlayX = useTransform(springX, [-100, 100], [-8, 8]);
    const overlayY = useTransform(springY, [-40, 40], [-4, 4]);

    // Magnetic pull for the text
    const textX = useTransform(springX, [-100, 100], [-3, 3]);
    const textY = useTransform(springY, [-40, 40], [-1.5, 1.5]);

    // Color logic for the Tab-style premium overlay
    const getOverlayStyles = () => {
        if (item.label === 'Email') {
            return {
                bg: 'bg-gradient-to-b from-[rgba(16,185,129,0.05)] to-[rgba(16,185,129,0.15)]',
                border: 'border-[rgba(16,185,129,0.3)]',
                shadow: 'shadow-[0_2px_4px_rgba(16,185,129,0.15),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]',
                text: 'text-[rgb(16,185,129)]'
            };
        }
        if (item.label === 'LinkedIn') {
            return {
                bg: 'bg-gradient-to-b from-[rgba(10,102,194,0.05)] to-[rgba(10,102,194,0.15)]',
                border: 'border-[rgba(10,102,194,0.3)]',
                shadow: 'shadow-[0_2px_4px_rgba(10,102,194,0.15),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]',
                text: 'text-[rgb(10,102,194)]'
            };
        }
        if (item.label === 'GitHub') {
            return {
                bg: 'bg-gradient-to-b from-[rgba(240,80,50,0.05)] to-[rgba(240,80,50,0.15)]',
                border: 'border-[rgba(240,80,50,0.3)]',
                shadow: 'shadow-[0_2px_4px_rgba(240,80,50,0.15),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]',
                text: 'text-[rgb(240,80,50)]'
            };
        }
        return {
            bg: 'bg-gradient-to-b from-[rgba(0,0,0,0.03)] to-[rgba(0,0,0,0.08)]',
            border: 'border-gray-200',
            shadow: 'shadow-sm',
            text: 'text-gray-900'
        };
    };

    const styles = getOverlayStyles();

    const calculateDirection = (e: React.MouseEvent, rect: DOMRect) => {
        const x = e.clientX - rect.left - (rect.width / 2);
        const y = e.clientY - rect.top - (rect.height / 2);
        
        // Quad detection with better normalization
        if (Math.abs(x) > Math.abs(y)) {
            return { x: x > 0 ? 10 : -10, y: 0 };
        } else {
            return { x: 0, y: y > 0 ? 15 : -15 };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDirection(calculateDirection(e, rect));
        setIsHovered(true);
        setHoveringButton(true);
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDirection(calculateDirection(e, rect));
        setIsHovered(false);
        setHoveringButton(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div className="flex flex-row items-center justify-between py-1.5 w-full relative group/item">
            {/* Static Label */}
            <span className={`text-sm md:text-sm font-bold transition-colors duration-300 ${isHovered ? styles.text : 'text-gray-900 group-hover/item:text-[rgb(74,108,196)]'}`}>
                {item.label}
            </span>

            {/* Interactive Value (Link Text) */}
            <motion.a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={staggerItemVariants}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative px-5 py-2 -mr-5 rounded-xl transition-colors duration-300 overflow-hidden text-right min-w-[160px] flex justify-end items-center"
            >
                {/* Fluid Directional Snap Overlay - Tab Style Aesthetic */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ 
                                x: direction.x, 
                                y: direction.y,
                                opacity: 0,
                                scale: 0.95
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1
                            }}
                            style={{
                                x: overlayX,
                                y: overlayY,
                            }}
                            exit={{ 
                                x: direction.x, 
                                y: direction.y,
                                opacity: 0,
                                scale: 0.95
                            }}
                            className={`absolute inset-0 z-0 border ${styles.bg} ${styles.border} ${styles.shadow} pointer-events-none rounded-xl`}
                            transition={{
                                type: 'spring',
                                damping: 32,
                                stiffness: 400,
                                opacity: { duration: 0.15 }
                            }}
                        />
                    )}
                </AnimatePresence>

                <motion.span 
                    style={{ x: textX, y: textY }}
                    className={`text-xs md:text-sm font-mono font-bold relative z-10 transition-colors duration-300 ${isHovered ? styles.text : 'text-gray-400 group-hover:text-[rgb(74,108,196)]'}`}
                >
                    {item.value}
                </motion.span>
            </motion.a>
        </div>
    );
};

export const Contact: React.FC = () => {
    return (
        <section className="p-6 md:p-8 bg-[#FAFAFA]" style={antiFlickerStyle}>
            <ProgressiveText
                as="h2"
                variants={blurOnlyVariants}
                className="text-sm md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase mb-6"
            >
                Contact
            </ProgressiveText>

            <motion.div
                variants={staggerContainerVariants}
                className="flex flex-col gap-2 w-full"
            >
                {CONTACT_INFO.map((item, index) => (
                    <ContactLink key={index} item={item} index={index} />
                ))}
            </motion.div>
        </section>
    );
};
