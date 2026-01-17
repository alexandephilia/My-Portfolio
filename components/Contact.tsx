import { motion } from 'motion/react';
import React from 'react';
import { CONTACT_INFO } from '../constants';
import { antiFlickerStyle, blurOnlyVariants, staggerContainerVariants, staggerItemVariants } from './animations';

const containerVariants = staggerContainerVariants;

export const Contact: React.FC = () => {
    return (
        <section className="p-6 md:p-8 bg-[#FAFAFA]" style={antiFlickerStyle}>
            <motion.h2
                variants={blurOnlyVariants}
                className="text-sm md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase mb-6"
            >
                Contact
            </motion.h2>

            <motion.div
                variants={staggerContainerVariants}
                className="flex flex-col gap-4 md:gap-4 w-full"
            >
                {CONTACT_INFO.map((item, index) => (
                    <motion.a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={staggerItemVariants}
                        className="group flex flex-row items-center justify-between py-1"
                    >
                        <span className="text-sm md:text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                            {item.label}
                        </span>
                        <span className="text-xs md:text-sm text-gray-400 group-hover:text-blue-600 transition-colors text-right">
                            {item.value}
                        </span>
                    </motion.a>
                ))}
            </motion.div>
        </section>
    );
};
