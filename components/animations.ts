import { Variants } from 'motion/react';

// Optimized blur reveal - uses GPU-accelerated properties only
// Key insight: animate opacity and transform separately from filter
// to reduce compositing overhead during fast scroll
export const sectionHeaderVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: 'blur(8px)',
        y: 8,
        z: 0, // Force GPU layer
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        z: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            filter: { duration: 0.7, delay: 0.05 },
        }
    }
};

// Shared blur reveal for staggered children
export const staggerContainerVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
            when: "beforeChildren",
        }
    }
};

// Individual item blur reveal - optimized for fast scroll
export const staggerItemVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: 'blur(8px)',
        y: 6,
        z: 0,
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        z: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
            filter: { duration: 0.6, delay: 0.05 },
        }
    }
};

// Floating variant for Bookshelf - deeper slide from bottom
export const floatingStaggerItemVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: 'blur(8px)',
        y: 60,
        z: 0,
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        z: 0,
        transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1], // Quasi-spring "float" ease
            filter: { duration: 0.8, delay: 0.05 },
        }
    }
};

// Floating variant for Bookshelf (Top) - slide from top
export const floatingTopStaggerItemVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: 'blur(8px)',
        y: -60,
        z: 0,
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        z: 0,
        transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1], // Quasi-spring "float" ease
            filter: { duration: 0.8, delay: 0.05 },
        }
    }
};

// Viewport settings - increased margin to trigger earlier
// This prevents animations from starting when element is barely visible
export const viewportSettings = {
    once: true,
    amount: 0.1 as const, // Trigger when 10% visible (more reliable than margin)
};

// Anti-flicker styles for GPU compositing stability
// Apply to parent containers of animated elements
// Safari iOS requires stronger GPU hints to avoid repainting on blur→opacity changes
export const antiFlickerStyle: React.CSSProperties = {
    transform: 'translate3d(0, 0, 0)', // Stronger GPU hint than translateZ
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    perspective: 1000,
    WebkitPerspective: 1000,
    // Safari-specific: avoid willChange on filter to prevent repaint-on-blur-end
};

// Safari-safe variant: removes willChange at animation end to prevent
// secondary transitions (hover/active) from triggering repaints
export const safeStaggerItemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 6,
        z: 0,
        // No filter: blur on this variant - rely on opacity + transform only
    },
    visible: {
        opacity: 1,
        y: 0,
        z: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        }
    }
};

// Pop reveal for images (Daily Driver)
// Note: No baked-in delay so the parent container can fully control timing.
export const popRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.6,
        filter: 'blur(12px)',
        z: 0,
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        z: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 25,
            mass: 1.2,
            filter: { duration: 0.8 },
        }
    }
};

export const dailyDriverCardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 18,
        filter: 'blur(10px)',
        z: 0,
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        z: 0,
        transition: {
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            when: 'beforeChildren',
            staggerChildren: 0.08,
            delayChildren: 0.12,
            filter: { duration: 0.6, delay: 0.05 },
        },
    },
};

export const dailyDriverContentVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.09,
            delayChildren: 0.05,
        },
    },
};

export const dailyDriverPillsVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.11,
            delayChildren: 0.12,
        },
    },
};

// Blur-only variant (no scale/transform) for simpler animations
export const blurOnlyVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: 'blur(8px)',
        z: 0,
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        z: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
            filter: { duration: 0.6, delay: 0.05 },
        }
    }
};
