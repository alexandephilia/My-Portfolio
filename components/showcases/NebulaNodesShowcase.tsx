import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';

// --- TYPES ---
interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface NodeEntity {
    id: number;
    basePos: Vector3;
    currentPos: Vector3;
    driftOffsets: Vector3;
    motionModifiers: { speed: number; amp: number };
    ringIntensity: number;
    connections: number[];
    history: Vector3[];
    // Anchor swing state for rope physics
    anchorSwingX?: number;
    anchorSwingY?: number;
    anchorSwingVelX?: number;
    anchorSwingVelY?: number;
    prevPos?: Vector3;
}

interface RopeSegment {
    pos: Vector3;
    oldPos: Vector3;
}

interface RopeEntity {
    id: string;
    startNodeId: number;
    endNodeId: number;
    colorType: 'primary' | 'secondary';
    isStripped: boolean;
    segments: RopeSegment[];
}

interface SimulationState {
    nodes: NodeEntity[];
    ropes: RopeEntity[];
}

// --- CONSTANTS ---
const NODE_COUNT = 8;
const ROPE_SEGMENTS = 20; // More segments for smoother curves
const GRAVITY = 0.08; // Very light - underwater feel
const FRICTION = 0.96; // High friction keeps momentum/swing
const RELAXATION_ITERATIONS = 10; // Fewer iterations = looser rope
const ANCHOR_EASE = 0.35; // Higher = more responsive anchors
const DRIFT_SPEED = 0.0012;
const FOCAL_LENGTH = 800;
const Z_OFFSET = 600;
const TRAIL_LENGTH = 30;

const COLOR_PRIMARY = '#adff2f'; // Light Green (GreenYellow)
const COLOR_SECONDARY = '#a855f7'; // Purple (matching stippled line)
const COLOR_TRAIL = 'rgba(80, 80, 80, 0.4)';

// --- VECTOR MATH ---
const vecAdd = (v1: Vector3, v2: Vector3): Vector3 => ({ x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z });
const vecSub = (v1: Vector3, v2: Vector3): Vector3 => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z });
const vecMul = (v: Vector3, n: number): Vector3 => ({ x: v.x * n, y: v.y * n, z: v.z * n });
const vecDist = (v1: Vector3, v2: Vector3): number => {
    const dx = v1.x - v2.x, dy = v1.y - v2.y, dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const project3D = (v: Vector3, width: number, height: number) => {
    const scale = FOCAL_LENGTH / (FOCAL_LENGTH + v.z + Z_OFFSET);
    // Shift the center point up to show more content at top
    return { x: v.x * scale + width / 2, y: v.y * scale + height / 2 - 30, scale };
};

// --- SIMULATION ---
const initSimulation = (width: number, height: number): SimulationState => {
    const nodes: NodeEntity[] = [];
    const ropes: RopeEntity[] = [];

    // Responsive amplitude based on container size
    const isMobile = width < 400;
    const driftAmp = isMobile ? 60 : 80;

    // Much larger spread to keep nodes apart
    const spreadX = isMobile ? 350 : 500;
    const spreadY = isMobile ? 280 : 400;
    const spreadZ = isMobile ? 350 : 500;

    // Create nodes with deliberate spacing - not random clustering
    const positions: Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
        let basePos: Vector3;
        let attempts = 0;
        const minDistance = isMobile ? 120 : 180; // Minimum distance between nodes

        do {
            basePos = {
                x: (Math.random() - 0.5) * spreadX,
                y: (Math.random() - 0.5) * spreadY,
                z: (Math.random() - 0.5) * spreadZ,
            };
            attempts++;
            // Check distance from all existing nodes
            const tooClose = positions.some(p => {
                const dx = p.x - basePos.x;
                const dy = p.y - basePos.y;
                const dz = p.z - basePos.z;
                return Math.sqrt(dx * dx + dy * dy + dz * dz) < minDistance;
            });
            if (!tooClose || attempts > 50) break;
        } while (true);

        positions.push(basePos);
        nodes.push({
            id: i, basePos, currentPos: { ...basePos },
            driftOffsets: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 },
            motionModifiers: { speed: 0.6 + Math.random() * 0.5, amp: 0.5 + Math.random() * 0.8 }, // More varied heights
            ringIntensity: 0, connections: [], history: []
        });
    }

    // 2. Complete Graph + ENSURE SOLID PURPLE
    for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
            nodes[i].connections.push(j);
            nodes[j].connections.push(i);
            const segments: RopeSegment[] = [];
            const startPos = nodes[i].currentPos;
            const endPos = nodes[j].currentPos;
            for (let k = 0; k < ROPE_SEGMENTS; k++) {
                const t = k / (ROPE_SEGMENTS - 1);
                const pos = vecAdd(startPos, vecMul(vecSub(endPos, startPos), t));
                segments.push({ pos: { ...pos }, oldPos: { ...pos } });
            }
            // By default, half are purple, half are green
            ropes.push({
                id: `rope-${i}-${j}`,
                startNodeId: i,
                endNodeId: j,
                colorType: Math.random() > 0.5 ? 'secondary' : 'primary',
                isStripped: false,
                segments
            });
        }
    }

    // Create a path that connects all nodes (Hamiltonian Path) - STIPPLED PURPLE
    const nodeSequence = Array.from({ length: NODE_COUNT }, (_, i) => i);
    for (let i = nodeSequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodeSequence[i], nodeSequence[j]] = [nodeSequence[j], nodeSequence[i]];
    }

    for (let i = 0; i < nodeSequence.length - 1; i++) {
        const n1 = nodeSequence[i];
        const n2 = nodeSequence[i + 1];
        const id1 = Math.min(n1, n2);
        const id2 = Math.max(n1, n2);
        const rope = ropes.find(r => r.id === `rope-${id1}-${id2}`);
        if (rope) {
            rope.isStripped = true;
            rope.colorType = 'secondary';
        }
    }

    // ENSURE EVERY NODE HAS 2 SOLID PURPLE ROPES
    // (excluding stippled lines)
    for (let i = 0; i < NODE_COUNT; i++) {
        // Find existing solid purple ropes for this node
        let solidPurpleCount = ropes.filter(r =>
            (r.startNodeId === i || r.endNodeId === i) &&
            r.colorType === 'secondary' &&
            !r.isStripped
        ).length;

        // Add more if needed
        if (solidPurpleCount < 2) {
            const availableRopes = ropes.filter(r =>
                (r.startNodeId === i || r.endNodeId === i) &&
                (r.colorType !== 'secondary' || r.isStripped)
            );

            // Convert to solid purple
            for (let k = 0; k < (2 - solidPurpleCount) && k < availableRopes.length; k++) {
                availableRopes[k].colorType = 'secondary';
                availableRopes[k].isStripped = false;
            }
        }
    }

    return { nodes, ropes, _driftAmp: driftAmp } as SimulationState & { _driftAmp: number };
};

const updateSimulation = (state: SimulationState & { _driftAmp?: number }, time: number) => {
    const driftAmp = state._driftAmp || 80;

    // Global breathing phase - rhythmically sway the whole graph
    const breathPhase = time * 0.0008;
    const globalSwayX = Math.sin(breathPhase) * 35;
    const globalSwayY = Math.cos(breathPhase * 0.5) * 10;

    state.nodes.forEach(node => {
        node.history.unshift({ ...node.currentPos });
        if (node.history.length > TRAIL_LENGTH) node.history.pop();
        const prevY = node.currentPos.y;
        const t = time * DRIFT_SPEED;

        // Synchronized X movement
        const individualOffset = Math.sin(t * 0.3 + node.driftOffsets.x) * 6;
        const offsetX = globalSwayX + individualOffset;

        // Y movement: Symmetric "Building Pressure" at both peaks
        const phase = t * node.motionModifiers.speed + node.driftOffsets.y;
        const rawSine = Math.sin(phase); // -1 (top) to 1 (bottom)

        // Use a symmetric power curve that is extremely flat at both extremes (|rawSine|=1)
        // This ensures a "Slow build up" and "Linger" at both top and bottom
        const sign = rawSine >= 0 ? 1 : -1;
        const mag = Math.abs(rawSine);
        // Moderate power curve (x^2.8) for snappier buildup/takeoff
        const easedY = sign * (1 - Math.pow(1 - mag, 2.8));

        const offsetY = easedY * (driftAmp * node.motionModifiers.amp);
        const offsetZ = Math.cos(t * 0.5 + node.driftOffsets.z) * (driftAmp * 0.4);

        node.currentPos = {
            x: node.basePos.x + offsetX,
            y: node.basePos.y + offsetY + globalSwayY,
            z: node.basePos.z + offsetZ
        };

        // Calculate velocity for rope physics
        const dy = node.currentPos.y - prevY;
        const dx = node.currentPos.x - (node.prevPos?.x || node.currentPos.x);

        // Store velocity for rope swing
        (node as any)._velocityY = dy;
        (node as any)._velocityX = dx;

        // Base intensity from height (higher up = more intense)
        // normalized range roughly -200 (top) to 200 (bottom)
        const heightFactor = Math.max(0, (200 - node.currentPos.y) / 400);

        let targetIntensity = 0.2 + (heightFactor * 0.4); // Minimum baseline visibility

        if (dy < 0) {
            // Moving UP - increase intensity
            const speed = Math.abs(dy);
            targetIntensity += Math.min(speed / 1.5, 0.4);
        } else {
            // Moving Down - decrease slightly but keep baseline
            targetIntensity -= Math.min(dy / 2.0, 0.1);
        }

        node.ringIntensity += (Math.max(0.15, targetIntensity) - node.ringIntensity) * 0.08;
    });

    state.ropes.forEach(rope => {
        const startNode = state.nodes[rope.startNodeId];
        const endNode = state.nodes[rope.endNodeId];

        // Calculate anchor swing based on node movement (like LLMVisualizationShowcase)
        // This creates the "connected" heavy feel
        const calcAnchorSwing = (node: NodeEntity, targetPos: Vector3) => {
            if (!node.anchorSwingX) node.anchorSwingX = 0;
            if (!node.anchorSwingY) node.anchorSwingY = 0;
            if (!node.anchorSwingVelX) node.anchorSwingVelX = 0;
            if (!node.anchorSwingVelY) node.anchorSwingVelY = 0;

            // Calculate velocity from previous position
            const velX = node.prevPos ? (node.currentPos.x - node.prevPos.x) : 0;
            const velY = node.prevPos ? (node.currentPos.y - node.prevPos.y) : 0;

            // Spring physics for anchor swing
            const targetSwingX = velX * 0.8;
            const targetSwingY = velY * 0.5;

            const springForce = 0.1;
            node.anchorSwingVelX! += (targetSwingX - node.anchorSwingX!) * springForce;
            node.anchorSwingVelY! += (targetSwingY - node.anchorSwingY!) * springForce;
            node.anchorSwingVelX! *= 0.88; // Damping
            node.anchorSwingVelY! *= 0.88;
            node.anchorSwingX! += node.anchorSwingVelX!;
            node.anchorSwingY! += node.anchorSwingVelY!;

            return {
                x: targetPos.x + node.anchorSwingX!,
                y: targetPos.y + node.anchorSwingY!,
                z: targetPos.z
            };
        };

        // Store previous positions for velocity calculation
        startNode.prevPos = { ...startNode.currentPos };
        endNode.prevPos = { ...endNode.currentPos };

        for (let i = 0; i < rope.segments.length; i++) {
            const segment = rope.segments[i];
            if (i === 0 || i === rope.segments.length - 1) {
                const targetNode = i === 0 ? startNode : endNode;
                const swungTarget = calcAnchorSwing(targetNode, targetNode.currentPos);
                segment.pos.x += (swungTarget.x - segment.pos.x) * ANCHOR_EASE;
                segment.pos.y += (swungTarget.y - segment.pos.y) * ANCHOR_EASE;
                segment.pos.z += (swungTarget.z - segment.pos.z) * ANCHOR_EASE;
                segment.oldPos.x = segment.pos.x - (segment.pos.x - segment.oldPos.x) * 0.5;
                segment.oldPos.y = segment.pos.y - (segment.pos.y - segment.oldPos.y) * 0.5;
                segment.oldPos.z = segment.pos.z - (segment.pos.z - segment.oldPos.z) * 0.5;
                continue;
            }

            // Verlet integration with turbulence for organic feel
            const vx = (segment.pos.x - segment.oldPos.x) * FRICTION;
            const vy = (segment.pos.y - segment.oldPos.y) * FRICTION;
            const vz = (segment.pos.z - segment.oldPos.z) * FRICTION;

            // Add slight random turbulence (like LLMVisualizationShowcase)
            const turbulenceX = (Math.random() - 0.5) * 0.2;
            const turbulenceY = (Math.random() - 0.5) * 0.2;
            const turbulenceZ = (Math.random() - 0.5) * 0.15;

            segment.oldPos = { ...segment.pos };
            segment.pos.x += vx + turbulenceX;
            segment.pos.y += vy + GRAVITY + turbulenceY;
            segment.pos.z += vz + turbulenceZ;
        }

        const totalDist = vecDist(rope.segments[0].pos, rope.segments[rope.segments.length - 1].pos);
        const targetLength = Math.max(totalDist * 1.15, ROPE_SEGMENTS * 8); // Slightly more slack
        const segmentLen = targetLength / (ROPE_SEGMENTS - 1);

        // Constraint relaxation with VARIABLE STIFFNESS (like LLMVisualizationShowcase)
        for (let iter = 0; iter < RELAXATION_ITERATIONS; iter++) {
            for (let i = 0; i < rope.segments.length - 1; i++) {
                const segA = rope.segments[i];
                const segB = rope.segments[i + 1];
                const dist = vecDist(segA.pos, segB.pos);
                if (dist === 0) continue;

                // Variable stiffness: looser at top (near anchors), tighter in middle
                const ropePosition = i / (rope.segments.length - 1);
                // Bell curve: loose at ends (0.2), tight in middle (0.5)
                const stiffness = 0.2 + Math.sin(ropePosition * Math.PI) * 0.3;

                const error = dist - segmentLen;
                const percent = (error / dist / 2) * stiffness;
                const offsetX = (segB.pos.x - segA.pos.x) * percent;
                const offsetY = (segB.pos.y - segA.pos.y) * percent;
                const offsetZ = (segB.pos.z - segA.pos.z) * percent;
                if (i !== 0) { segA.pos.x += offsetX; segA.pos.y += offsetY; segA.pos.z += offsetZ; }
                if (i + 1 !== rope.segments.length - 1) { segB.pos.x -= offsetX; segB.pos.y -= offsetY; segB.pos.z -= offsetZ; }
            }
        }
    });
};

// --- HUD COMPONENT ---
const SpaceIndicatorHUD: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const MESSAGES = ["PIXEL", "COLOR", "CONTEXT", "TEXT"];

    useEffect(() => {
        const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % MESSAGES.length), 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] text-emerald-400 font-mono font-bold"
            >
                {MESSAGES[currentIndex]}
            </motion.span>
        </AnimatePresence>
    );
};


// --- MAIN VISUALIZATION (matches LLMVisualizationShowcase pattern exactly) ---
const NebulaVisualization: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { ref: containerRef, inView } = useInView<HTMLDivElement>('200px 0px', 0.01);
    const stateRef = useRef<(SimulationState & { _driftAmp?: number }) | null>(null);
    const startTimeRef = useRef<number>(Date.now());
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
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };
        setCanvasSize();

        // Initialize simulation with dimensions
        if (!stateRef.current) {
            stateRef.current = initSimulation(width, height);
        }

        const render = () => {
            if (!isActiveRef.current) return;
            const time = Date.now() - startTimeRef.current;
            if (!stateRef.current) return;
            updateSimulation(stateRef.current, time);

            // 1. CLEAR - exactly like LLMVisualizationShowcase
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // 2. Draw Trails
            ctx.save();
            ctx.setLineDash([2, 6]);
            ctx.lineWidth = 1;
            stateRef.current.nodes.forEach(node => {
                if (node.history.length < 2) return;
                ctx.beginPath();
                const p0 = project3D(node.history[0], width, height);
                ctx.moveTo(p0.x, p0.y);
                for (let i = 1; i < node.history.length; i++) {
                    const p = project3D(node.history[i], width, height);
                    ctx.lineTo(p.x, p.y);
                }
                ctx.strokeStyle = COLOR_TRAIL;
                ctx.stroke();
            });
            ctx.restore();

            // 3. Draw Ropes
            stateRef.current.ropes.forEach(rope => {
                // If it's the stripped rope, it's ALWAYS purple
                const color = rope.isStripped ? '#a855f7' : (rope.colorType === 'primary' ? COLOR_PRIMARY : COLOR_SECONDARY);

                ctx.beginPath();
                ctx.strokeStyle = color;

                // Align with LLMVisualizationShowcase: perceived 1.5px width
                // We use the start node's scale as a proxy for the rope's depth
                const representativeNode = stateRef.current!.nodes[rope.startNodeId];
                const { scale: ropeScale } = project3D(representativeNode.currentPos, width, height);
                ctx.lineWidth = (rope.isStripped ? 2.8 : 2.5) * ropeScale;

                ctx.globalAlpha = rope.isStripped ? 0.6 : 0.5;
                ctx.shadowBlur = 15; // Synced with LLM version
                ctx.shadowColor = color;

                // Make stripped rope dashed (stippled)
                if (rope.isStripped) {
                    ctx.setLineDash([4, 4]);
                } else {
                    ctx.setLineDash([]);
                }

                const startNode = stateRef.current!.nodes[rope.startNodeId];
                const endNode = stateRef.current!.nodes[rope.endNodeId];
                const pStart = project3D(startNode.currentPos, width, height);
                const pEnd = project3D(endNode.currentPos, width, height);
                const projectedSegments = rope.segments.map(s => project3D(s.pos, width, height));

                const all = [pStart, ...projectedSegments, pEnd];
                ctx.moveTo(all[0].x, all[0].y);
                for (let i = 0; i < all.length - 1; i++) {
                    const next = all[i + 1];
                    const midX = (all[i].x + next.x) / 2;
                    const midY = (all[i].y + next.y) / 2;
                    ctx.quadraticCurveTo(all[i].x, all[i].y, midX, midY);
                }
                ctx.lineTo(all[all.length - 1].x, all[all.length - 1].y);
                ctx.stroke();
                ctx.setLineDash([]); // Reset dash
            });

            // Reset state after ropes
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // 4. Draw Nodes
            const sorted = [...stateRef.current.nodes].sort((a, b) => b.currentPos.z - a.currentPos.z);
            sorted.forEach(node => {
                const { x, y, scale } = project3D(node.currentPos, width, height);

                // Align with LLMVisualizationShowcase: perceived 4px radius
                // 7.0 * 0.57 scale ≈ 4.0px
                const r = Math.max(2, 6.8 * scale);

                // Ring effect
                if (node.ringIntensity > 0.01) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * node.ringIntensity})`;
                    ctx.lineWidth = 1;
                    ctx.arc(x, y, r + (r * 3 * node.ringIntensity), 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Node core (with Glow)
                ctx.beginPath();
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ffffff';
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 1.0;
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
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
                    <span className="text-[10px] bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent font-mono tracking-widest font-bold uppercase">Text to Image</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)]">
                        <span className="text-[9px] text-zinc-400 font-mono tracking-wider uppercase">Processing</span>
                        <div className="w-px h-3 bg-zinc-700/60" />
                        <div className="flex gap-0.5">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [4, 10, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, delay: i * 0.1 }}
                                    className="w-0.5 bg-emerald-500/60 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-[80px] flex items-center justify-center px-2.5 py-1 rounded-full bg-gradient-to-b from-emerald-950/40 to-black/40 border border-emerald-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]">
                        <SpaceIndicatorHUD />
                    </div>
                </div>
            </div>

            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
        </div>
    );
};

// Full showcase with hardware chassis frame - EXACTLY like LLMVisualizationShowcase
export const NebulaNodesShowcase: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background with blur */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105 brightness-100"
                style={{
                    backgroundImage: "url('https://r2.flowith.net/gemini-proxy-go/1767217273701/2b4927ec-1b44-4d14-b252-5ca9ef17e5c0.jpg')"
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
                            <NebulaVisualization />
                        </div>

                        {/* Screen Reflection/Glare */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20 opacity-30" />
                    </div>
                </div>
            </div>
        </div>
    );
};
