import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import React, { useState } from 'react';
import { BudgetCardShowcase } from './showcases/BudgetCardShowcase';
import { WebcoreBuilderShowcase } from './showcases/WebcoreBuilderShowcase';

interface ShowcaseItem {
    id: string;
    name: string;
    description: string;
    stack: string[];
    hasThemeToggle?: boolean;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
    {
        id: 'budget-card',
        name: 'Monthly Budget Card',
        description: 'Premium budget card with volumetric lighting effects and fluid animations.',
        stack: ['React', 'Next.js', 'Vite', 'Tailwind CSS'],
        hasThemeToggle: true
    },
    {
        id: 'webcore-builder',
        name: 'Dashboard Skeuo-modern',
        description: 'High-fidelity web builder interface featuring complex radial gradients and neumorphic aesthetic.',
        stack: ['React', 'Next.js', 'Vite', 'Tailwind CSS']
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

export const ComponentShowcase: React.FC = () => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [budgetTheme, setBudgetTheme] = useState<'dark' | 'light'>('dark');

    const getComponent = (id: string) => {
        if (id === 'budget-card') {
            return <BudgetCardShowcase theme={budgetTheme} />;
        }
        if (id === 'webcore-builder') {
            return <WebcoreBuilderShowcase />;
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8 pb-24 md:pb-28">
            {SHOWCASE_ITEMS.map((item) => {
                const isHovered = hoveredId === item.id;

                return (
                    <motion.div
                        key={item.id}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="relative group w-full"
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ zIndex: isHovered ? 60 : 1 }}
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
                        <div className="w-full h-14 rounded-b-[20px] bg-[#FAFAFA] border-x border-b border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] px-6 flex items-center justify-between relative overflow-hidden">
                            {/* Stripped Lines Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                            <div className="absolute top-0 right-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                            <div className="absolute bottom-0 left-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />
                            <div className="absolute bottom-0 right-0 w-4 h-4 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 5px)' }} />

                            <div className="text-[9px] font-mono font-bold text-[rgb(74,108,196)] uppercase tracking-[0.2em] opacity-60 border-r border-gray-200 pr-6 h-4 flex items-center shrink-0 relative z-10">
                                Stack Insight
                            </div>

                            <div className="flex-1 min-w-0 flex flex-row items-center justify-start md:justify-center gap-4 px-4 overflow-x-auto no-scrollbar relative z-10">
                                {item.stack.map((tech, i) => (
                                    <span key={i} className="text-[10px] font-mono font-medium text-gray-500 whitespace-nowrap flex items-center gap-1.5 transition-colors duration-300 hover:text-gray-900">
                                        <span className="w-1 h-1 rounded-full bg-[rgb(74,108,196)]/30" />
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-1.5 text-[8px] font-mono text-[rgb(126,150,210)] font-bold uppercase border-l border-gray-200 pl-6 h-4 shrink-0 relative z-10">
                                UI Component
                            </div>
                        </div>
                        </motion.div>

                        {/* Ghost Card - Stack Insight (Mobile) */}
                        <motion.div
                            className="md:hidden absolute inset-x-2 z-0"
                            initial={{ y: 0, opacity: 0, scale: 0.98 }}
                            animate={{
                                y: isHovered ? 52 : 0,
                                opacity: isHovered ? 1 : 0,
                                scale: isHovered ? 1 : 0.98
                            }}
                            transition={{
                                type: "spring", stiffness: 450, damping: 18, mass: 0.8
                            }}
                            style={{ bottom: '0px' }}
                        >
                            <div className="w-full py-2 px-3 rounded-b-[16px] bg-[#FAFAFA] border-x border-b border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] overflow-hidden">
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

                        {/* Outer Rim Container */}
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="w-full rounded-[24px] p-[4px] backdrop-blur-md md:backdrop-blur-xl relative z-10"
                            style={{
                                background: `linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)`,
                                boxShadow: 'rgba(0, 0, 0, 0.13) 0px 8px 10px, rgba(0, 0, 0, 0.05) 0px 4px 4px'
                            }}
                        >
                            <div className="w-full bg-white rounded-[20px] overflow-hidden border border-[rgba(0,0,0,0.05)]">
                                <div className="relative w-full h-[280px] md:h-[500px] overflow-hidden">
                                    <div
                                        className="absolute inset-0 origin-top-left md:hidden"
                                        style={{ transform: 'scale(0.48)', transformOrigin: 'top left' }}
                                    >
                                        <div style={{ width: '208%', height: '208%' }}>
                                            {getComponent(item.id)}
                                        </div>
                                    </div>
                                    <div className="hidden md:block absolute inset-0">
                                        {getComponent(item.id)}
                                    </div>
                                </div>

                                <div className="p-4 md:p-5 bg-white border-t border-gray-100">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-sm md:text-base font-bold text-gray-900">{item.name}</h3>
                                                {item.hasThemeToggle && (
                                                    <button
                                                        onClick={() => setBudgetTheme(budgetTheme === 'dark' ? 'light' : 'dark')}
                                                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors duration-300 border"
                                                        style={{
                                                            background: budgetTheme === 'dark'
                                                                ? 'linear-gradient(180deg, rgba(38, 38, 38, 1) 0%, rgba(23, 23, 23, 1) 100%)'
                                                                : 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(245, 245, 245, 1) 100%)',
                                                            borderColor: budgetTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                                            boxShadow: budgetTheme === 'dark'
                                                                ? '0 1px 0 0 rgba(255, 255, 255, 0.1) inset, 0 2px 4px rgba(0, 0, 0, 0.2)'
                                                                : '0 1px 0 0 rgba(255, 255, 255, 1) inset, 0 2px 4px rgba(0, 0, 0, 0.08)'
                                                        }}
                                                    >
                                                        {budgetTheme === 'dark' ? (
                                                            <>
                                                                <Moon size={10} className="text-gray-300" />
                                                                <span className="text-gray-300">Dark</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sun size={10} className="text-gray-600" />
                                                                <span className="text-gray-600">Light</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed">{item.description}</p>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-1.5 p-px rounded-full overflow-hidden"
                                            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E5E7EB, #E5E7EB 1px, transparent 1px, transparent 3px)' }}>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-linear-to-b from-white to-gray-50/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] border border-transparent">
                                                <div className="w-1 h-1 rounded-full bg-[rgb(74,108,196)] opacity-50" />
                                                <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                                    Component
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
};
