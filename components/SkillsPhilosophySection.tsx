import { Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { sectionHeaderVariants, staggerItemVariants } from './animations';

const PhilosophySection: React.FC = () => {
    return (
        <motion.div
            id="philosophy"
            variants={staggerItemVariants}
            className="mb-14 flex flex-col gap-8 w-full"
        >
            <motion.h2
                variants={sectionHeaderVariants}
                className="text-[10px] md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase"
            >
                Philosophy
            </motion.h2>

            <motion.div
                variants={staggerItemVariants}
                className="
                    relative
                    w-full
                    rounded-2xl md:rounded-[32px]
                    bg-transparent
                    border border-dashed border-gray-200/60
                    group
                    overflow-visible
                "
            >
                <div className="absolute -top-4 -left-4 z-20 p-2.5 bg-[#FAFAFA] rounded-full border border-dashed border-gray-300 shadow-sm">
                    <Quote size={20} className="text-gray-400 fill-gray-100 rotate-180" />
                </div>
                <div className="absolute -bottom-4 -right-4 z-20 p-2.5 bg-[#FAFAFA] rounded-full border border-dashed border-gray-300 shadow-sm">
                    <Quote size={20} className="text-gray-400 fill-gray-100" />
                </div>

                <div className="relative z-10 w-full overflow-hidden rounded-[inherit]">
                    <div className="relative w-full aspect-3/2 bg-white">
                        <img
                            src="/philosophy.png"
                            alt="Thinking Philosophy"
                            className="w-full h-full object-cover select-none rounded-[inherit]"
                            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                            draggable={false}
                        />
                        <div className="absolute inset-0 shadow-[inset_0_2px_15px_rgba(0,0,0,0.05)] pointer-events-none rounded-[inherit]" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PhilosophySection;
