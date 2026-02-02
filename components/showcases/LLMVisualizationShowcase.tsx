import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';

// --- TYPES ---
interface Point {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
}

interface Stick {
    p0: Point;
    p1: Point;
    length: number;
}

type NodeState = 'WAITING' | 'MOVING';

interface NodeEntity {
    id: number;
    color: string;
    baseY: number;
    state: NodeState;
    minX: number;
    maxX: number;
    currentX: number;
    targetX: number;
    startX: number;
    startTime: number;
    duration: number;
    waitDuration: number;
    ropePoints: Point[];
    ropeSticks: Stick[];
    anchorSwingX?: number;
    anchorSwingVel?: number;
    prevX?: number;
}

// --- PHYSICS CONSTANTS ---
const GRAVITY = 0.15; // Lightened to reduce sag
const FRICTION = 0.95;     // Higher = more momentum, keeps swinging
const NUM_ITERATIONS = 15;  // Much fewer = very loose rope
const ROPE_SEGMENTS = 25;

const COLORS = [
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#00FF00', // Lime
    '#FFFF00', // Yellow
    '#FACC15', // Bright Yellow
    '#4ADE80', // Vibrant Green
];

// Custom ease: seamless slow start, spring-like pull acceleration
// Custom ease: WALK -> ACCELERATE
const easeSnapMove = (x: number): number => {
    // Higher-order power curve (x^4.2) for snappier "pressure build-up"
    // Nodes linger at the start/peaks then decisively accelerate
    const ease = Math.pow(x, 4.2);
    
    // Tiny micro-spring at the very end
    if (x > 0.9) {
        const t = (x - 0.9) / 0.1;
        const wobble = Math.sin(t * Math.PI * 2) * 0.006 * (1 - t);
        return Math.min(1, ease + wobble);
    }
    
    return ease;
};

// --- TOKEN STREAM DATA ---
// Use unique tokens to avoid any duplication issues
const TOKEN_SEQUENCE = [
    { token: "Hello", prob: 0.94 },
    { token: "alex", prob: 0.89 },
    { token: "!", prob: 0.97 },
    { token: "How", prob: 0.82 },
    { token: "can", prob: 0.91 },
    { token: "I", prob: 0.96 },
    { token: "help", prob: 0.88 },
    { token: "you", prob: 0.93 },
    { token: "today", prob: 0.85 },
    { token: "?", prob: 0.98 },
];

const TokenStreamHUD: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % TOKEN_SEQUENCE.length);
                setIsVisible(true);
            }, 150);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const current = TOKEN_SEQUENCE[currentIndex];

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-[10px] text-cyan-400 font-mono font-bold"
                >
                    {current.token}
                </motion.span>
            )}
        </AnimatePresence>
    );
};

const HangingVisualization: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { ref: containerRef, inView } = useInView<HTMLDivElement>('200px 0px', 0.01);
    const rafRef = useRef<number | null>(null);
    const isActiveRef = useRef(false);
    const startRef = useRef<() => void>(() => {});
    const stopRef = useRef<() => void>(() => {});

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth;
        let height = container.clientHeight;
        const dpr = window.devicePixelRatio || 1;

        const setCanvasSize = () => {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };
        setCanvasSize();

        // --- Initialization ---
        const nodes: NodeEntity[] = [];
        const numNodes = 10;

        // Bounds definitions (Percentage based)
        const getBounds = (w: number) => ({
            minX: w * 0.12,
            maxX: w * 0.88
        });

        const { minX: initialMinX, maxX: initialMaxX } = getBounds(width);

        // Responsive padding - more padding on mobile to push nodes down
        const isMobile = width < 400;
        const paddingTop = isMobile ? height * 0.18 : height * 0.12;
        const nodeZoneHeight = isMobile ? height * 0.52 : height * 0.58;
        const rowHeight = nodeZoneHeight / numNodes;

        // Unified Anchor Point (Top Center)
        const anchorX = width / 2;
        const anchorY = isMobile ? -20 : -40; // Closer anchor on mobile

        // CALCULATE UNIFIED ROPE CONFIG
        const maxPossibleWidth = initialMaxX;
        const FIXED_SLACK = height * 0.25; // Drastically reduced for tighter lines

        // Center squeeze point where all ropes converge (tangled)
        const squeezeX = width / 2;
        const squeezeY = height * 0.38;

        for (let i = 0; i < numNodes; i++) {
            const baseY = paddingTop + (i * rowHeight);
            const color = COLORS[i % COLORS.length];

            // Randomize Start Position (Left/Right) - nodes start at edges
            const startSide = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
            const startX = startSide === 'LEFT' ? initialMinX : initialMaxX;

            // Rope Setup
            const ropePoints: Point[] = [];

            const dx = maxPossibleWidth - anchorX;
            const dy = baseY - anchorY;
            const cornerDist = Math.sqrt(dx * dx + dy * dy);

            const totalRopeLength = cornerDist + FIXED_SLACK;
            const segmentLength = totalRopeLength / ROPE_SEGMENTS;

            // Initialize all points at the squeeze point, except anchor and node endpoints
            // The physics will naturally spread them out
            for (let j = 0; j <= ROPE_SEGMENTS; j++) {
                let px: number, py: number;

                if (j === 0) {
                    // Anchor point at top
                    px = anchorX;
                    py = anchorY;
                } else if (j === ROPE_SEGMENTS) {
                    // Node endpoint at edge
                    px = startX;
                    py = baseY;
                } else {
                    // ALL middle points start at a noisy squeeze point
                    // Increased chaos for "tangled" effect
                    const noiseX = (Math.random() - 0.5) * 40;
                    const noiseY = (Math.random() - 0.5) * 40;
                    px = squeezeX + noiseX;
                    py = squeezeY + noiseY;
                }

                // Add tiny random velocity to kickstart the untangling effectively
                const vx = (Math.random() - 0.5) * 10;
                const vy = (Math.random() - 0.5) * 10;

                ropePoints.push({ x: px, y: py, oldX: px - vx, oldY: py - vy });
            }

            const ropeSticks: Stick[] = [];
            for (let j = 0; j < ROPE_SEGMENTS; j++) {
                ropeSticks.push({ p0: ropePoints[j], p1: ropePoints[j + 1], length: segmentLength });
            }

            nodes.push({
                id: i,
                color,
                baseY,
                minX: initialMinX,
                maxX: initialMaxX,
                state: 'WAITING',
                currentX: startX,
                startX: startX,
                targetX: startX,
                startTime: performance.now(),
                duration: 1400 + Math.random() * 600,
                waitDuration: 400 + Math.random() * 1200,
                ropePoints,
                ropeSticks,
                prevX: startX
            });
        }

        const startTime = performance.now();
        const RELEASE_DURATION = 400; // Just release duration
        const TOTAL_INIT = RELEASE_DURATION;

        // --- Render Loop ---
        const render = (time: number) => {
            if (!isActiveRef.current) return;
            const globalElapsed = time - startTime;
            const releaseProgress = Math.min(1, globalElapsed / RELEASE_DURATION);
            const isReleasing = releaseProgress < 1;
            const initComplete = globalElapsed >= TOTAL_INIT;

            // 1. CLEAR
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // 2. DYNAMIC RECALCULATION
            const currentMinX = width * 0.12;
            const currentMaxX = width * 0.88;
            const currentAnchorX = width / 2;

            // Draw Rails (Background Grid)
            ctx.lineWidth = 1;

            nodes.forEach(node => {
                node.minX = currentMinX;
                node.maxX = currentMaxX;

                ctx.strokeStyle = '#222222';
                ctx.beginPath();
                ctx.moveTo(node.minX, node.baseY);
                ctx.lineTo(node.maxX, node.baseY);
                ctx.stroke();

                ctx.fillStyle = '#333333';
                ctx.fillRect(node.minX - 1, node.baseY - 2, 2, 4);
                ctx.fillRect(node.maxX - 1, node.baseY - 2, 2, 4);
            });

            // Update & Draw Nodes
            nodes.forEach(node => {
                const elapsed = time - node.startTime;

                // --- STATE MACHINE (only after init complete) ---
                if (!initComplete) {
                    // During init, nodes stay at their starting positions
                    // Do nothing - keep currentX as is
                } else if (node.state === 'WAITING') {
                    const distToMin = Math.abs(node.currentX - node.minX);
                    const distToMax = Math.abs(node.currentX - node.maxX);
                    if (distToMin < distToMax) {
                        node.currentX = node.minX;
                    } else {
                        node.currentX = node.maxX;
                    }

                    if (elapsed > node.waitDuration) {
                        node.state = 'MOVING';
                        node.startTime = time;

                        const dMin = Math.abs(node.currentX - node.minX);
                        const dMax = Math.abs(node.currentX - node.maxX);

                        if (dMin < dMax) {
                            node.targetX = node.maxX;
                        } else {
                            node.targetX = node.minX;
                        }

                        node.startX = node.currentX;
                        // "WALKING -> ACCELERATE" - Slower overall to see the stages
                        node.duration = 1600 + Math.random() * 800; 
                    }
                }
                else if (node.state === 'MOVING') {
                    if (elapsed < node.duration) {
                        const t = elapsed / node.duration;
                        const ease = easeSnapMove(t);
                        node.currentX = node.startX + (node.targetX - node.startX) * ease;
                    } else {
                        // SNAPPING - Calculate final velocity impact
                        const finalVel = node.currentX - (node.prevX || node.currentX);
                        
                        // Inject whiplash into the top 40% of the rope points
                        if (Math.abs(finalVel) > 0.5) {
                            const whiplashForce = finalVel * 1.5;
                            const affectedCount = Math.floor(node.ropePoints.length * 0.4);
                            for (let j = 1; j < affectedCount; j++) {
                                // Distribute impulse: stronger at top, fading down
                                const strength = 1 - (j / affectedCount);
                                node.ropePoints[j].oldX = node.ropePoints[j].x - (whiplashForce * strength);
                            }
                        }

                        node.currentX = node.targetX;
                        node.state = 'WAITING';
                        node.startTime = time;
                        // "BREATHING" - Longer waits to see the idle sway
                        node.waitDuration = 800 + Math.random() * 1200; 
                    }
                }

                node.prevX = node.currentX;

                // --- PHYSICS (VERLET) ---
                const points = node.ropePoints;
                const squeezeX = width / 2;
                const squeezeY = height * 0.38;

                if (isReleasing) {
                    // Quick release - faster ease out
                    const easeOut = 1 - Math.pow(1 - releaseProgress, 1.2);

                    for (let i = 1; i < points.length - 1; i++) {
                        const p = points[i];
                        const vx = (p.x - p.oldX) * FRICTION * easeOut;
                        const vy = (p.y - p.oldY) * FRICTION * easeOut;
                        p.oldX = p.x;
                        p.oldY = p.y;
                        p.x += vx;
                        p.y += vy;
                        p.y += GRAVITY * easeOut;

                        // Pull back toward squeeze point (decreasing quickly)
                        const pullStrength = 1 - easeOut;
                        p.x = p.x + (squeezeX - p.x) * pullStrength * 0.2;
                        p.y = p.y + (squeezeY - p.y) * pullStrength * 0.2;
                    }
                } else {
                    // Normal physics with more realistic rope behavior
                    for (let i = 1; i < points.length - 1; i++) {
                        const p = points[i];
                        const vx = (p.x - p.oldX) * FRICTION;
                        const vy = (p.y - p.oldY) * FRICTION;

                        // Add slight random turbulence for organic feel
                        const turbulence = (Math.random() - 0.5) * 0.3;

                        p.oldX = p.x;
                        p.oldY = p.y;
                        p.x += vx + turbulence;
                        p.y += vy;
                        p.y += GRAVITY;
                    }
                }

                // --- CONSTRAINTS ---
                // Make anchor swing with momentum based on weighted average of top rope points
                // This creates a much more "connected" and heavy feel for the whole chain
                let weightedPull = 0;
                let totalWeight = 0;
                const lookaheadCount = 6;
                for (let j = 1; j <= lookaheadCount; j++) {
                    const weight = 1 - (j / (lookaheadCount + 1));
                    weightedPull += (points[j].x - currentAnchorX) * weight;
                    totalWeight += weight;
                }
                
                const avgPull = weightedPull / totalWeight;
                const targetPull = avgPull * 0.45; // Slightly increased sensitivity

                // Store anchor swing state on the node
                if (!node.anchorSwingX) node.anchorSwingX = 0;
                if (!node.anchorSwingVel) node.anchorSwingVel = 0;

                // Spring physics for anchor swing (more reactive)
                const springForce = (targetPull - node.anchorSwingX) * 0.12;
                node.anchorSwingVel += springForce;
                node.anchorSwingVel *= 0.90; // Slightly less damping for more "swing"
                node.anchorSwingX += node.anchorSwingVel;

                points[0].x = currentAnchorX + node.anchorSwingX;
                points[0].y = anchorY;

                const lastIndex = points.length - 1;
                // --- BREATHING & JITTER ---
                // Global breathing phase (vertical)
                const breathingOffset = Math.sin(time * 0.0015 + node.id) * 3;
                // Idle micro-jitter
                const jitterX = node.state === 'WAITING' ? (Math.random() - 0.5) * 0.4 : 0;
                
                const finalX = node.currentX + jitterX;
                const finalY = node.baseY + breathingOffset;

                points[lastIndex].x = finalX;
                points[lastIndex].y = finalY;

                // --- STICKS (with variable elasticity) ---
                const iterations = isReleasing ? Math.max(2, Math.floor(NUM_ITERATIONS * releaseProgress)) : NUM_ITERATIONS;
                for (let iter = 0; iter < iterations; iter++) {
                    node.ropeSticks.forEach((stick, stickIndex) => {
                        const dx = stick.p1.x - stick.p0.x;
                        const dy = stick.p1.y - stick.p0.y;
                        const dist = Math.hypot(dx, dy);
                        if (dist < 0.001) return;

                        // Variable stiffness: tighter overall to reduce sag
                        const ropePosition = stickIndex / node.ropeSticks.length;
                        const stiffness = 0.45 + ropePosition * 0.35; // 0.45 at top, 0.8 at bottom

                        const diff = stick.length - dist;
                        const percent = (diff / dist) / 2 * stiffness;
                        const offsetX = dx * percent;
                        const offsetY = dy * percent;

                        if (stick.p0 !== points[0]) {
                            stick.p0.x -= offsetX;
                            stick.p0.y -= offsetY;
                        }
                        if (stick.p1 !== points[lastIndex]) {
                            stick.p1.x += offsetX;
                            stick.p1.y += offsetY;
                        }
                    });
                }

                // --- DRAWING ---
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }
                const last = points[points.length - 1];
                const secondLast = points[points.length - 2];
                ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);

                ctx.strokeStyle = node.color;
                ctx.globalAlpha = 0.5;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Node
                ctx.shadowBlur = 15;
                ctx.shadowColor = node.color;
                ctx.fillStyle = node.color;
                ctx.globalAlpha = 1.0;

                ctx.beginPath();
                ctx.arc(finalX, finalY, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            if (!isActiveRef.current) return;
            rafRef.current = requestAnimationFrame(render);
        };

        const start = () => {
            if (isActiveRef.current) return;
            isActiveRef.current = true;
            rafRef.current = requestAnimationFrame(render);
        };

        const stop = () => {
            isActiveRef.current = false;
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };

        startRef.current = start;
        stopRef.current = stop;

        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                width = containerRef.current.clientWidth;
                height = containerRef.current.clientHeight;
                setCanvasSize();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            stop();
        };
    }, []);

    useEffect(() => {
        const shouldRun = inView && !document.hidden;
        if (shouldRun) {
            startRef.current();
        } else {
            stopRef.current();
        }
    }, [inView]);

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.hidden) {
                stopRef.current();
                return;
            }
            if (inView) {
                startRef.current();
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, [inView]);

    return (
        <div ref={containerRef} className="w-full h-full relative group font-sans">
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* COMPACT HUD */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-zinc-950/90 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] rounded-b-[26px]">

                {/* Left: LLM Indicator */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse"></div>
                    <span className="text-[10px] bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent font-mono tracking-widest font-bold uppercase">Text to Text</span>
                </div>

                {/* Right: Processing & Token Stream */}
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Thinking pill with depth */}
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-linear-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)]">
                        <span className="text-[9px] text-zinc-400 font-mono tracking-wider">PROCESSING</span>
                        {/* Vertical separator */}
                        <div className="w-px h-3 bg-zinc-700/60"></div>
                        <div className="flex gap-0.5 items-center">
                            <motion.div
                                animate={{ height: [4, 10, 4] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                                className="w-0.5 bg-cyan-500/60 rounded-full"
                            />
                            <motion.div
                                animate={{ height: [6, 4, 10] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
                                className="w-0.5 bg-cyan-500/60 rounded-full"
                            />
                            <motion.div
                                animate={{ height: [10, 6, 4] }}
                                transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
                                className="w-0.5 bg-cyan-500/60 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Token pill with blue accent */}
                    <div className="w-[60px] flex items-center justify-center px-2.5 py-1 rounded-full bg-linear-to-b from-cyan-950/40 via-cyan-950/20 to-black/40 border border-cyan-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]">
                        <TokenStreamHUD />
                    </div>
                </div>
            </div>

            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10"></div>
        </div>
    );
};

// Full showcase with hardware chassis frame
export const LLMVisualizationShowcase: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background with blur */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105 brightness-100"
                style={{
                    backgroundImage: "url('https://r2.flowith.net/gemini-proxy-go/1767216998347/7809a892-bd23-42cd-a57d-ff4d78003fdd.jpg')"
                }}
            />
            {/* The "Hardware" Chassis */}
            <div className="relative w-full max-w-sm h-[380px] md:h-[420px] rounded-[32px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 p-[1px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)]">

                {/* Inner Bezel/Rim - The "Machined" Edge */}
                <div className="w-full h-full bg-zinc-950 rounded-[31px] p-1.5 ring-1 ring-white/5 ring-inset relative">

                    {/* The Screen Container - Deep Inset Look */}
                    <div className="relative w-full h-full bg-black rounded-[26px] overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,1)] ring-1 ring-white/5 isolate">

                        {/* The Visualization */}
                        <div className="absolute inset-0 z-10">
                            <HangingVisualization />
                        </div>

                        {/* Screen Reflection/Glare */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20 opacity-30"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
