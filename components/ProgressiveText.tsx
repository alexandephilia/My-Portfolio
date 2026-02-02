import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, HTMLMotionProps } from 'motion/react';
import type { ElementType } from 'react';

interface ProgressiveTextProps<T extends ElementType = "div"> extends HTMLMotionProps<any> {
  as?: T;
  mode?: 'line' | 'diagonal';
  diagonalStrength?: number; // 0.5 - subtle, 1.5 - stronger (per-line offset slope)
  children: React.ReactNode;
  className?: string;
  triggerPoint?: string; // e.g., "0.9" (bottom 10% of screen)
  endPoint?: string;     // e.g., "0.5" (center of screen)
}

export default function ProgressiveText({ 
  as,
  mode,
  diagonalStrength = 0.75,
  children, 
  className = "", 
  triggerPoint = "0.9",
  endPoint = "0.6",
  style,
  ...props
}: ProgressiveTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [lineMetrics, setLineMetrics] = useState<{ css: string; px: number } | null>(null);
  const MotionTag = (motion as any)[as || "div"] || motion.div;

  const resolvedMode: 'line' | 'diagonal' = mode ?? 'diagonal';

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;
    const computed = window.getComputedStyle(el);
    let lh = computed.lineHeight;
    let lhPx = parseFloat(lh);
    if (lh === 'normal' || Number.isNaN(lhPx)) {
      const fontSize = parseFloat(computed.fontSize || '16');
      lhPx = fontSize * 1.2;
      lh = `${lhPx}px`;
    }
    setLineMetrics({ css: lh, px: lhPx });
  }, []);

  // Track scroll progress relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${triggerPoint}` as any, `end ${endPoint}` as any]
  });

  // Map scroll progress (0 to 1) to percentage string (0% to 100%)
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const tail = resolvedMode === 'diagonal' ? 20 : 12;
  const lineMask = useTransform(
    gradientPosition,
    (pos) => `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${pos}, rgba(0,0,0,0.35) calc(${pos} + ${tail * 0.6}%), rgba(0,0,0,0.12) calc(${pos} + ${tail}%), rgba(0,0,0,0.02) 100%)`
  );

  const diagonalAngle = 135 + (diagonalStrength - 1) * 12;
  const diagonalMask = useTransform(
    gradientPosition,
    (pos) => `linear-gradient(${diagonalAngle}deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${pos}, rgba(0,0,0,0.35) calc(${pos} + ${tail * 0.6}%), rgba(0,0,0,0.12) calc(${pos} + ${tail}%), rgba(0,0,0,0.02) 100%)`
  );
  
  const maskImage = resolvedMode === 'diagonal' ? diagonalMask : lineMask;
  const WebkitMaskImage = maskImage;

  return (
    <MotionTag 
      ref={containerRef as any} 
      className={className}
      style={{ 
        maskImage,
        WebkitMaskImage,
        maskSize: resolvedMode === 'diagonal' ? '100% 100%' : `100% ${lineMetrics?.css || '1.2em'}`,
        WebkitMaskSize: resolvedMode === 'diagonal' ? '100% 100%' : `100% ${lineMetrics?.css || '1.2em'}`,
        maskRepeat: resolvedMode === 'diagonal' ? 'no-repeat' : 'repeat-y',
        WebkitMaskRepeat: resolvedMode === 'diagonal' ? 'no-repeat' : 'repeat-y',
        maskPosition: '0 0',
        WebkitMaskPosition: '0 0',
        ...style
      }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
