import { motion } from 'motion/react';
import React from 'react';
import { EDUCATION } from '../constants';
import { antiFlickerStyle, staggerContainerVariants, staggerItemVariants, viewportSettings } from './animations';
import ProgressiveText from './ProgressiveText';

export const Education: React.FC = () => {
    return (
        <section className="p-6 md:p-8 border-b border-dashed border-gray-200 bg-[#FAFAFA]" style={antiFlickerStyle}>
            <motion.div
                variants={staggerContainerVariants}
                className="mb-6"
            >
                <ProgressiveText as="h2" variants={staggerItemVariants} className="text-[10px] md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase">Education</ProgressiveText>
            </motion.div>

            <motion.div
                variants={staggerContainerVariants}
                className="flex flex-col gap-8 md:gap-8"
            >
                {EDUCATION.map((edu) => (
                    <motion.div
                        key={edu.id}
                        variants={staggerItemVariants}
                        className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-1 md:gap-8"
                    >
                        <motion.div variants={staggerItemVariants} className="flex flex-col gap-0.5 md:gap-0.5">
                            <ProgressiveText as="h3" variants={staggerItemVariants} className="text-[11px] md:text-sm font-semibold text-gray-900">
                                {edu.degree} <span className="text-gray-400 font-normal">at</span> {edu.institution.split(' · ')[0]}
                            </ProgressiveText>
                            <ProgressiveText as="p" variants={staggerItemVariants} className="text-gray-500 text-[10px] md:text-xs leading-relaxed max-w-xl">
                                {edu.institution.split(' · ').slice(1).join(' · ')}
                            </ProgressiveText>
                        </motion.div>
                        <ProgressiveText as="div" variants={staggerItemVariants} className="text-[8px] md:text-[11px] font-medium text-gray-400 uppercase tracking-wide pt-0.5 md:pt-1">
                            {edu.period}
                        </ProgressiveText>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};
