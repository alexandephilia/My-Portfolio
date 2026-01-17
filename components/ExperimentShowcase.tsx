import { motion } from 'motion/react';
import React, { useState } from 'react';
import { LLMVisualizationShowcase } from './showcases/LLMVisualizationShowcase';
import { NebulaNodesShowcase } from './showcases/NebulaNodesShowcase';

interface ExperimentItem {
    id: string;
    name: string;
    description: string;
    component: React.ReactNode;
    stack: string[];
}

const EXPERIMENT_ITEMS: ExperimentItem[] = [
    {
        id: 'llm-visualization',
        name: 'LLM Token Stream',
        description: 'Physics-based visualization of token processing with verlet integration and rope dynamics.',
        component: <LLMVisualizationShowcase />,
        stack: ['Canvas API', 'Verlet Physics', 'React', 'TypeScript']
    },
    {
        id: 'llm-image-generation',
        name: 'LLM Image generation',
        description: '3D multi-node simulation visualizing latent space diffusion and text-to-image synthesis.',
        component: <NebulaNodesShowcase />,
        stack: ['3D Web Graphics', 'Physics Engine', 'React', 'TypeScript']
    }
];

const cardVariants = {
    hidden: {
        opacity: 0,
        filter: 'blur(14px)',
        y: 12
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as const,
            filter: { duration: 0.5 }
        }
    }
};

export const ExperimentShowcase: React.FC = () => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">
            {EXPERIMENT_ITEMS.map((item) => {
                const isHovered = hoveredId === item.id;

                return (
                    <motion.div
                        key={item.id}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        style={{
                            willChange: 'opacity, filter, transform',
                            zIndex: isHovered ? 20 : 1
                        }}
                        className="relative group w-full"
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Ghost Card - Stack Insight (Desktop) */}
                        <motion.div
                            className="hidden md:block absolute inset-x-6 bottom-0 z-0"
                            initial={{ y: 0, opacity: 0, scale: 0.98 }}
                            animate={{
                                y: isHovered ? 44 : 0,
                                opacity: isHovered ? 1 : 0,
                                scale: isHovered ? 1 : 0.98
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 18,
                                mass: 0.8
                            }}
                        >
                            <div className="w-full h-14 rounded-b-[20px] bg-[#FAFAFA] border-x border-b border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] px-6 flex items-center justify-between relative">
                                {/* Stripped Lines Corners */}
                                <div className="absolute top-0 left-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                                <div className="absolute top-0 right-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                                <div className="absolute bottom-0 left-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                                <div className="absolute bottom-0 right-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />

                                {/* Stack Insight Label */}
                                <div className="text-[9px] font-mono font-bold text-[rgb(74,108,196)] uppercase tracking-[0.2em] opacity-60 border-r border-gray-200 pr-6 h-4 flex items-center shrink-0 relative z-10">
                                    Stack Insight
                                </div>

                                {/* Centered Tech Stack */}
                                <div className="flex-1 min-w-0 flex flex-row items-center justify-center gap-4 px-4 relative z-10 overflow-x-auto no-scrollbar">
                                    {item.stack.map((tech, i) => (
                                        <span key={i} className="text-[10px] font-mono font-medium text-gray-500 whitespace-nowrap flex items-center gap-1.5 transition-colors duration-300 hover:text-gray-900">
                                            <span className="w-1 h-1 rounded-full bg-[rgb(74,108,196)]/30" />
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Experiment Tag */}
                                <div className="flex items-center gap-1.5 text-[8px] font-mono text-emerald-500 font-bold uppercase relative z-10 border-l border-gray-200 pl-6 h-4 shrink-0">
                                    Experiment
                                </div>
                            </div>
                        </motion.div>

                        {/* Ghost Card - Stack Insight (Mobile) */}
                        <motion.div
                            className="md:hidden absolute inset-x-2 z-0"
                            style={{ bottom: 'calc(var(--spacing) * 2)' }}
                            initial={{ y: 0, opacity: 0, scale: 0.98 }}
                            animate={{
                                y: isHovered ? 52 : 0,
                                opacity: isHovered ? 1 : 0,
                                scale: isHovered ? 1 : 0.98
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 18,
                                mass: 0.8
                            }}
                        >
                            <div className="w-full py-2 px-3 rounded-b-[16px] bg-[#FAFAFA] border-x border-b border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
                                <div className="text-[8px] font-mono font-bold text-[rgb(74,108,196)] uppercase tracking-[0.15em] opacity-60 mb-1.5 text-center">
                                    Stack Insight
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                                    {item.stack.map((tech, i) => (
                                        <span key={i} className="text-[8px] font-mono font-medium text-gray-500 whitespace-nowrap flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-[rgb(74,108,196)]/30" />
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Outer Rim Container - matching ProjectCard style */}
                        <div
                            className="w-full rounded-[24px] p-[4px] backdrop-blur-[25px] transition-transform duration-300 group-hover:-translate-y-1 relative z-10"
                            style={{
                                background: `linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)`,
                                boxShadow: 'rgba(0, 0, 0, 0.13) 0px 8px 10px, rgba(0, 0, 0, 0.05) 0px 4px 4px'
                            }}
                        >
                            <div className="w-full bg-white rounded-[20px] overflow-hidden border border-[rgba(0,0,0,0.05)]">
                                {/* Component Container - Responsive scaling */}
                                <div className="relative w-full h-[320px] md:h-[540px] overflow-hidden showcase-no-ring">
                                    {/* Scale wrapper for mobile */}
                                    <div
                                        className="absolute inset-0 origin-top-left md:hidden"
                                        style={{
                                            transform: 'scale(0.52)',
                                            transformOrigin: 'top left',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '192%',
                                                height: '192%',
                                            }}
                                        >
                                            {item.component}
                                        </div>
                                    </div>
                                    {/* Desktop - no scaling */}
                                    <div className="hidden md:block absolute inset-0">
                                        {item.component}
                                    </div>
                                </div>

                                {/* Info Footer */}
                                <div className="p-4 md:p-5 bg-white border-t border-gray-100">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed">{item.description}</p>
                                        </div>
                                        {/* Category badge */}
                                        <div className="shrink-0 flex items-center gap-1.5 p-px rounded-full overflow-hidden"
                                            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E5E7EB, #E5E7EB 1px, transparent 1px, transparent 3px)' }}>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-linear-to-b from-white to-gray-50/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08),inset_0_-1px_1px_rgba(255,255,255,0.8)] border border-transparent">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-70" />
                                                <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                                    Experiment
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
