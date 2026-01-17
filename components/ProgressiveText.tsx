import { useRef } from 'react';
import { motion, useScroll, useTransform, HTMLMotionProps } from 'motion/react';

interface ProgressiveTextProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  triggerPoint?: string; // e.g., "0.9" (bottom 10% of screen)
  endPoint?: string;     // e.g., "0.5" (center of screen)
}

export default function ProgressiveText({ 
  children, 
  className = "", 
  triggerPoint = "0.9",
  endPoint = "0.6",
  style,
  ...props
}: ProgressiveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${triggerPoint}` as any, `end ${endPoint}` as any]
  });

  // Map scroll progress (0 to 1) to percentage string (0% to 100%)
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Create a motion template for the mask image
  const maskImage = useTransform(
    gradientPosition,
    (pos) => `linear-gradient(to bottom, rgba(0,0,0,1) ${pos}, rgba(0,0,0,0.15) calc(${pos} + 20%))`
  );
  
  const WebkitMaskImage = maskImage;

  return (
    <motion.div 
      ref={containerRef} 
      className={className}
      style={{ 
        maskImage,
        WebkitMaskImage,
        ...style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
