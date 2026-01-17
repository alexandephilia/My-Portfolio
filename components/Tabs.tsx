import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { antiFlickerStyle, staggerContainerVariants, staggerItemVariants, viewportSettings } from './animations';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TABS = ['Works', 'Personal', 'Components', 'Experiment', 'Writings'];

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftFade(scrollLeft > 10);
            setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            checkScroll();
            scrollElement.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    return (
        <div className="relative p-6 md:py-6 md:px-8 border-b border-dashed border-gray-200 bg-[#FAFAFA]">
            <motion.div
                ref={scrollRef}
                initial="hidden"
                whileInView="visible"
                viewport={viewportSettings}
                variants={staggerContainerVariants}
                style={{
                    ...antiFlickerStyle,
                    WebkitMaskImage: `linear-gradient(to right, 
                        ${showLeftFade ? 'transparent' : 'black'} 0%, 
                        black ${showLeftFade ? '40px' : '0px'}, 
                        black ${showRightFade ? 'calc(100% - 40px)' : '100%'}, 
                        ${showRightFade ? 'transparent' : 'black'} 100%)`,
                    maskImage: `linear-gradient(to right, 
                        ${showLeftFade ? 'transparent' : 'black'} 0%, 
                        black ${showLeftFade ? '40px' : '0px'}, 
                        black ${showRightFade ? 'calc(100% - 40px)' : '100%'}, 
                        ${showRightFade ? 'transparent' : 'black'} 100%)`
                }}
                className="flex gap-4 md:gap-3 overflow-x-auto no-scrollbar items-center p-2 -ml-2 transition-[mask-image, -webkit-mask-image] duration-300 isolate"
            >
                {TABS.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <motion.button
                            key={tab}
                            variants={staggerItemVariants}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                relative px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-xs md:text-[13px] font-bold transition-colors duration-300 whitespace-nowrap border border-transparent
                                ${isActive ? 'text-[rgb(74,108,196)]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
                            `}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-[rgba(74,108,196,0.05)] to-[rgba(74,108,196,0.15)] border border-[rgba(74,108,196,0.3)] shadow-[0_2px_4px_rgba(74,108,196,0.15),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
                                    transition={{
                                        type: "spring",
                                        bounce: 0.2,
                                        duration: 0.6
                                    }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
};

