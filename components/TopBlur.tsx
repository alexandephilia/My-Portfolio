import React from 'react';

/**
 * TopBlur Component
 *
 * Implements a high-fidelity progressive blur at the top of the viewport.
 * Optimized: 3 layers instead of 8 for significantly reduced GPU compositing cost
 * while maintaining the same visual quality.
 */
export const TopBlur: React.FC = () => {
    return (
        <div
            className="hidden md:block fixed left-0 right-0 h-32 z-40 pointer-events-none select-none overflow-hidden"
            style={{
                top: 0,
                height: '8rem',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translate3d(0, 0, 0)',
                margin: 0,
                padding: 0,
            }}
        >
            <div className="relative w-full h-full bg-none">
                {/* Layer 1: Subtle blur (bottom portion) */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    backdropFilter: 'blur(0.5px)', WebkitBackdropFilter: 'blur(0.5px)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 65%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 65%)'
                }} />
                {/* Layer 2: Medium blur (middle portion) */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 90%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 90%)'
                }} />
                {/* Layer 3: Heavy blur (top portion) */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 3,
                    backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)'
                }} />
            </div>
        </div>
    );
};
