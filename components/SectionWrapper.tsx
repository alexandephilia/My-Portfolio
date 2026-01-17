import { motion } from 'motion/react';
import React from 'react';
import { antiFlickerStyle, staggerContainerVariants, viewportSettings } from './animations';

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string; // Allow passing classes for layout/styling
    id?: string;
    style?: React.CSSProperties;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className, id, style }) => {
    return (
        <motion.div
            id={id}
            className={className}
            style={{ ...antiFlickerStyle, ...style }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainerVariants}
        >
            {children}
        </motion.div>
    );
};
