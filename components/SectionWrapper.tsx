import { motion } from 'motion/react';
import React from 'react';
import { antiFlickerStyle, staggerContainerVariants, viewportSettings } from './animations';

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string; // Allow passing classes for layout/styling
    id?: string;
    style?: React.CSSProperties;
    showPattern?: boolean;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className, id, style, showPattern = true }) => {
    return (
        <div id={id} className={`relative ${className || ''}`}>

            {/* 1. Animated Content Layer */}
            <motion.div
                style={{ ...antiFlickerStyle, ...style }}
                initial="hidden"
                whileInView="visible"
                viewport={viewportSettings}
                variants={staggerContainerVariants}
                className="relative z-10"
            >
                <div className="relative z-10">
                    {children}
                </div>


                {/* 3b. Crosshairs (Inside Context, Z-50) - Always visible markers */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen flex items-center justify-center pointer-events-none z-50"
                    aria-hidden="true"
                >
                    {/* Left Intersection Crosshair */}
                    <div
                        className="absolute flex items-center justify-center text-gray-500"
                        style={{ left: 'calc(50% - 370px)', transform: 'translate(-45%, 0px)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0V20M0 10H20" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>

                    {/* Right Intersection Crosshair */}
                    <div
                        className="absolute flex items-center justify-center text-gray-500"
                        style={{ left: 'calc(50% + 370px)', transform: 'translate(-50%, 0px)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0V20M0 10H20" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>
                </div>
            </motion.div>

            {/* 2. Background Pattern Layer (Sibling to Content, Z-0) */}
            {showPattern && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Left Side Pattern */}
                    <div
                        className="absolute inset-y-0 right-1/2 mr-[370px] w-screen opacity-50"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 10px,
                                rgba(200, 200, 200, 0.25) 10px,
                                rgba(200, 200, 200, 0.25) 11px
                            )`,
                            backgroundAttachment: 'local'
                        }}
                        aria-hidden="true"
                    />
                    {/* Right Side Pattern */}
                    <div
                        className="absolute inset-y-0 left-1/2 ml-[370px] w-screen opacity-50"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 10px,
                                rgba(200, 200, 200, 0.25) 10px,
                                rgba(200, 200, 200, 0.25) 11px
                            )`,
                            backgroundAttachment: 'local'
                        }}
                        aria-hidden="true"
                    />
                </div>
            )}
            {/* 3a. Global Section Divider Line (Absolute Bottom, Z-0) */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen flex items-center justify-center pointer-events-none z-0"
                aria-hidden="true"
            >
                <div className="w-full border-b border-dashed border-gray-300" />
            </div>
        </div>
    );
};
