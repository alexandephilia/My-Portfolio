import { motion } from 'motion/react';
import React, { useState } from 'react';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';
import { antiFlickerStyle, sectionHeaderVariants, staggerContainerVariants, staggerItemVariants, viewportSettings } from './animations';

export const Testimonials: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string>(TESTIMONIALS[0].id);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section className="p-6 md:p-10 bg-[#FAFAFA]" style={antiFlickerStyle}>
            <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={viewportSettings}
                variants={sectionHeaderVariants}
                className="text-[10px] md:text-sm font-bold text-[rgb(74,108,196)] tracking-wider uppercase mb-8"
            >
                Testimonials
            </motion.h2>

            <motion.div
                layout
                initial="hidden"
                whileInView="visible"
                viewport={viewportSettings}
                variants={staggerContainerVariants}
                className="flex flex-col md:flex-row gap-4 h-[400px] md:h-[420px]"
            >
                {TESTIMONIALS.map((testimonial) => {
                    const isExpanded = expandedId === testimonial.id;
                    const isHovered = hoveredId === testimonial.id && !isExpanded;
                    const flexValue = isExpanded ? 3 : (isHovered ? 1.2 : 1);

                    return (
                        <motion.div
                            layout
                            key={testimonial.id}
                            animate={{ flex: flexValue }}
                            variants={staggerItemVariants}
                            transition={{
                                layout: { duration: 0.4, ease: "circOut" },
                                flex: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
                                opacity: { duration: 0.4 }
                            }}
                            onClick={() => setExpandedId(testimonial.id)}
                            onMouseEnter={() => setHoveredId(testimonial.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`relative rounded-[32px] cursor-pointer overflow-hidden flex-shrink-0 group basis-auto min-w-0 w-full md:w-auto ${!isExpanded ? 'hover:bg-gray-50' : ''
                                }`}
                            style={{
                                background: `linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)`,
                                boxShadow: isExpanded
                                    ? 'rgba(0, 0, 0, 0.13) 0px 8px 10px, rgba(0, 0, 0, 0.05) 0px 4px 4px'
                                    : 'rgba(0, 0, 0, 0.05) 0px 2px 4px, rgba(0, 0, 0, 0.02) 0px 1px 2px',
                                padding: '5px'
                            }}
                        >
                            <div className="w-full h-full bg-white rounded-[28px] overflow-hidden relative border border-transparent transition-shadow duration-500 flex flex-col">

                                <div className="relative md:absolute md:inset-0 w-full md:w-[380px] p-3 md:p-8 flex flex-col justify-between gap-2 md:gap-0 h-full">

                                    <div className="flex-1 relative">
                                        {/* Quote Overlay */}
                                        <Quote 
                                            size={40} 
                                            className={`absolute -bottom-2 -right-2 md:right-8 text-[rgb(74,108,196)]/10 rotate-180 transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} 
                                        />
                                        
                                        <p className={`
                        text-[11px] md:text-lg font-medium leading-relaxed text-gray-700 transition-opacity duration-500
                        max-w-[240px] md:max-w-[280px] text-left
                        ${isExpanded ? 'opacity-100' : 'opacity-70 blur-[0.5px] group-hover:opacity-90 group-hover:blur-0'}
                      `}>
                                            {testimonial.text}
                                        </p>
                                    </div>

                                    <div className="relative z-20 flex flex-col gap-1 pt-4 md:pt-6 mt-1 md:mt-2 border-t border-gray-50 bg-white">
                                        <div className="flex flex-col min-w-0">
                                            <span className={`font-bold truncate transition-colors duration-300 text-[11px] md:text-base ${isExpanded ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {testimonial.name}
                                            </span>
                                            <span className={`truncate transition-colors duration-300 text-[9px] md:text-sm ${isExpanded ? 'text-[rgb(74,108,196)]' : 'text-gray-300'}`}>
                                                {testimonial.role}
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                {!isExpanded && (
                                    <>
                                        {/* Desktop overlay: vertical gradient from right */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none md:block hidden z-10"
                                        />
                                        {/* Mobile overlay: horizontal gradient from bottom */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none md:hidden block z-10"
                                        />
                                    </>
                                )}

                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};
