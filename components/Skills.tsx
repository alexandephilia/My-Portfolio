import { Code2, Database, Layers, Rocket, Wrench } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { lazy, Suspense, memo, useState, useCallback, useMemo } from 'react';
import { SKILL_CATEGORIES } from '../constants';
import { SkillCategory } from '../types';
import {
    antiFlickerStyle,
    sectionHeaderVariants,
    staggerContainerVariants,
    staggerItemVariants
} from './animations';

// Lazy load heavy sections - code splitting for better performance
const PhilosophySection = lazy(() => import('./SkillsPhilosophySection'));
const MacMiniSection = lazy(() => import('./SkillsMacMiniSection'));

// Premium shared transition config
const FOLDER_SPRING = {
    type: "spring" as const,
    damping: 28,
    stiffness: 260,
    mass: 1
};

// Mobile-optimized transition - simpler and faster
const MOBILE_SPRING = {
    type: "spring" as const,
    damping: 25,
    stiffness: 300,
    mass: 0.8
};

// Hook to detect mobile device and prefer reduced motion
const useMobileOptimizations = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        // Listen for media query changes
        const mediaQueryListener = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        mediaQuery.addEventListener('change', mediaQueryListener);

        return () => {
            window.removeEventListener('resize', checkMobile);
            mediaQuery.removeEventListener('change', mediaQueryListener);
        };
    }, []);

    return { isMobile, prefersReducedMotion };
};

// Memoized icon URLs - prevents recreation on every render
const TECH_ICON_URLS: Record<string, string> = {
    // Engineering
    "JavaScript": "https://static.vecteezy.com/system/resources/thumbnails/048/332/149/small/js-icon-transparent-background-free-png.png",
    "TypeScript": "https://cdn3d.iconscout.com/3d/free/thumb/free-typescript-3d-icon-png-download-7577992.png?f=webp",
    "Node.js": "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/2/nodejs-icon-alt-c9winwkuvxhsx1mkbcex8.png/nodejs-icon-alt-htav2s8jaxvvaonoj27yz.png?_a=DATAg1AAZAA0",
    "Python": "https://www.svgrepo.com/show/452091/python.svg",
    "React.js": "https://www.svgrepo.com/show/452092/react.svg",
    "Next.js": "https://marcbruederlin.gallerycdn.vsassets.io/extensions/marcbruederlin/next-icons/0.1.0/1723747598319/Microsoft.VisualStudio.Services.Icons.Default",
    "Vue.js": "https://www.svgrepo.com/show/452130/vue.svg",
    "HTML/CSS": "https://www.svgrepo.com/show/452228/html-5.svg",
    "Markdown": "https://www.svgrepo.com/show/330890/markdown.svg",

    // Frontend
    "Tailwind CSS": "https://www.svgrepo.com/show/374118/tailwind.svg",
    "Shadcn UI": "https://images.seeklogo.com/logo-png/51/2/shadcn-ui-logo-png_seeklogo-519786.png",
    "TanStack": "https://tanstack.com/images/logos/splash-light.png",
    "Framer Motion": "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/vector-icons/brand-framer-motion-pk1mas1m7u9hi06fqzq77f.png/brand-framer-motion-nuunolaqtcs7zlblwkjs.png?_a=DATAg1AAZAA0",
    "Cult UI": "https://www.cult-ui.com/favicon.ico",
    "Headless UI": "https://images.seeklogo.com/logo-png/43/2/headless-ui-logo-png_seeklogo-434970.png",
    "21st": "https://ph-files.imgix.net/2aaadbb9-5b71-4869-ac7e-29405103a368.png?auto=format",
    "GSAP": "https://gsap.com/community/uploads/monthly_2020_03/tweenmax.png.cf27916e926fbb328ff214f66b4c8429.png",
    "Three.js": "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/three-js-icon.png",

    // Backend
    "PostgreSQL": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/960px-Postgresql_elephant.svg.png",
    "Blockchain": "https://png.pngtree.com/png-vector/20250324/ourmid/pngtree-blockchain-web3-logo-vector-png-image_15850717.png",
    "Prisma": "https://www.svgrepo.com/show/354210/prisma.svg",
    "REST API": "https://www.opc-router.de/wp-content/uploads/2020/05/REST_socialmedia.jpg",
    "WebSocket": "https://www.outsystems.com/Forge_BL/rest/ComponentThumbnail/GetURL_ComponentThumbnail?ProjectImageId=17523",
    "MongoDB": "https://www.svgrepo.com/show/373845/mongo.svg",
    "Supabase": "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/4/supabase-icon-kpjasdqlnu8exakst6f44r.png/supabase-icon-5uqgeeqeknngv9las8zeef.png?_a=DATAg1AAZAA0",
    "Redis": "https://www.svgrepo.com/show/354272/redis.svg",
    "Railway": "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/railway-infrastructure-platform-icon.png",

    // Deployment
    "Docker": "https://www.svgrepo.com/show/373553/docker.svg",
    "Git/GitHub": "https://www.svgrepo.com/show/452210/git.svg",
    "Vercel": "https://pipedream.com/s.v0/app_XaLh2x/logo/orig",
    "Netlify": "https://www.svgrepo.com/show/354110/netlify.svg",
    "Puppeteer": "https://www.svgrepo.com/show/354228/puppeteer.svg",
    "GitHub": "https://cdn.worldvectorlogo.com/logos/github-icon-2.svg",
    "Cloudflare": "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/cloudflare-icon.png",
    "AWS": "https://www.svgrepo.com/show/376356/aws.svg",
    "Nginx": "https://www.svgrepo.com/show/373924/nginx.svg",

    // Tools
    "Cursor IDE": "https://custom.typingmind.com/assets/models/cursor.png",
    "Windsurf": "https://exafunction.github.io/public/brand/windsurf-black-symbol.png",
    "Claude Code": "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude-color.png",
    "Bun": "https://icon.icepanel.io/Technology/svg/Bun.svg",
    "npm/Yarn": "https://www.svgrepo.com/show/452077/npm.svg",
    "ESLint/Prettier": "https://icon.icepanel.io/Technology/svg/ESLint.svg",
    "Warp Terminal": "https://mvolkmann.github.io/blog/assets/warp-logo.png?v=1.1.1",
    "MCP Integration": "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/mcp.png",
    "Kiro": "https://kiro.dev/icon.svg?fe599162bb293ea0",
    "Vite": "https://www.svgrepo.com/show/374167/vite.svg",
};

// Memoized skill icon component for better performance
const SkillIcon = memo(({ iconUrl, skill, className, layoutId }: { iconUrl: string | null; skill: string; className?: string; layoutId?: string }) => {
    if (!iconUrl) {
        return <div className="w-full h-full bg-gray-50/50" />;
    }

    return (
        <motion.img
            layoutId={layoutId}
            src={iconUrl}
            alt={skill}
            loading="lazy"
            className={className}
            style={{
                willChange: 'transform',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
            }}
        />
    );
});

SkillIcon.displayName = 'SkillIcon';

// Loading fallback for lazy-loaded components
const SectionLoadingFallback = () => (
    <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="text-gray-400 text-sm">Loading...</div>
    </div>
);

export const Skills: React.FC = () => {
    const [expandedFolder, setExpandedFolder] = useState<number | null>(null);
    const { isMobile, prefersReducedMotion } = useMobileOptimizations();

    // Memoize viewport config to prevent recreation
    const viewportConfig = useMemo(() => ({
        once: true,
        amount: 0.1
    }), []);

    // Memoize transition based on device
    const transition = useMemo(() => 
        isMobile || prefersReducedMotion ? MOBILE_SPRING : FOLDER_SPRING,
        [isMobile, prefersReducedMotion]
    );

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainerVariants}
            className="p-6 md:p-8 border-b border-dashed border-gray-200 bg-[#FAFAFA] relative overflow-visible"
            style={antiFlickerStyle}
        >
            <Suspense fallback={<SectionLoadingFallback />}>
                <PhilosophySection />
            </Suspense>

            <motion.h2
                variants={sectionHeaderVariants}
                className="text-[10px] md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase mb-8"
            >
                Skills Stack
            </motion.h2>

            {/* Premium Wrapped Tray for Folders */}
            <motion.div
                variants={staggerContainerVariants}
                className="
                    flex flex-wrap md:flex-nowrap items-start justify-center
                    gap-x-8 gap-y-12 md:gap-x-12
                    relative z-10 w-full mb-20
                "
            >
                {SKILL_CATEGORIES.map((category, index) => (
                    <FolderIcon
                        key={index}
                        category={category}
                        index={index}
                        isExpanded={expandedFolder === index}
                        isOtherExpanded={expandedFolder !== null && expandedFolder !== index}
                        onExpand={useCallback(() => setExpandedFolder(index), [index])}
                        onClose={useCallback(() => setExpandedFolder(null), [])}
                        isMobile={isMobile}
                        prefersReducedMotion={prefersReducedMotion}
                        transition={transition}
                    />
                ))}
            </motion.div>

            <Suspense fallback={<SectionLoadingFallback />}>
                <MacMiniSection />
            </Suspense>
        </motion.section>
    );
};

interface FolderIconProps {
    category: SkillCategory;
    index: number;
    isExpanded: boolean;
    isOtherExpanded: boolean;
    onExpand: (index: number) => void;
    onClose: () => void;
    isMobile: boolean;
    prefersReducedMotion: boolean;
    transition: any;
}

const FolderIcon: React.FC<FolderIconProps> = memo(({ 
    category, 
    index, 
    isExpanded, 
    isOtherExpanded, 
    onExpand, 
    onClose,
    isMobile,
    prefersReducedMotion,
    transition
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Optimized event handlers with useCallback
    const handleOpen = useCallback(() => {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'hidden';
            onExpand(index);
        }
    }, [onExpand, index]);

    const handleClose = useCallback(() => {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'unset';
            onClose();
        }
    }, [onClose]);

    // Skip hover effects on mobile
    const handleMouseEnter = useCallback(() => {
        if (!isMobile) {
            setIsHovered(true);
        }
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (!isMobile) {
            setIsHovered(false);
        }
    }, [isMobile]);

    const shouldBlur = isOtherExpanded && !isHovered && !isMobile;

    // Skip expensive animations on mobile
    const animateProps = useMemo(() => {
        if (prefersReducedMotion) {
            return {
                opacity: 1,
                scale: 1
            };
        }

        return shouldBlur ? {
            filter: 'blur(5px)',
            opacity: 0.5,
            scale: 0.95,
        } : {
            filter: 'blur(0px)',
            opacity: 1,
            scale: 1,
        };
    }, [shouldBlur, prefersReducedMotion]);

    const whileHoverProps = useMemo(() => {
        if (isMobile || prefersReducedMotion || isExpanded || isOtherExpanded) {
            return {};
        }
        return { scale: 1.03, y: -4 };
    }, [isMobile, prefersReducedMotion, isExpanded, isOtherExpanded]);

    return (
        <>
            <motion.div
                layoutId={`folder-${index}`}
                onClick={handleOpen}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                whileHover={whileHoverProps}
                transition={transition}
                animate={animateProps}
                variants={!shouldBlur && !prefersReducedMotion ? staggerItemVariants : undefined}
                className="flex flex-col items-center gap-5 cursor-pointer group shrink-0"
                style={{
                    willChange: "transform, opacity",
                    zIndex: shouldBlur ? 0 : 10
                }}
            >
                <div className={`
                    relative overflow-hidden
                    p-1 md:p-1.5
                    bg-linear-to-b from-white via-white/40 to-gray-200/50
                    rounded-[18px] md:rounded-[24px]
                    border border-white/80
                    shadow-[
                        0_8px_20px_-10px_rgba(0,0,0,0.1),
                        inset_0_1px_1px_rgba(255,255,255,1),
                        inset_0_-1px_1px_rgba(0,0,0,0.05)
                    ]
                    ${!isOtherExpanded && !isMobile ? 'group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300' : ''}
                `}>
                    {/* Skip shine effect on mobile for better performance */}
                    {!isMobile && !prefersReducedMotion && (
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                    )}

                    <div className="
                        relative
                        w-16 h-16 md:w-21 md:h-21
                        rounded-[12px] md:rounded-[18px]
                        bg-linear-to-br from-white/95 via-white/80 to-gray-50/50
                        backdrop-blur-xl
                        border border-white
                        shadow-[
                            0_12px_30px_-5px_rgba(0,0,0,0.08),
                            inset_0_1.5px_1px_rgba(255,255,255,1),
                            inset_0_-1px_2px_rgba(0,0,0,0.02)
                        ]
                        flex items-center justify-center
                        p-1.5 md:p-1
                        overflow-hidden
                    ">
                        {/* Internal Rim Light - skip on mobile */}
                        {!isMobile && !prefersReducedMotion && (
                            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent opacity-80" />
                        )}
                        <div className="grid grid-cols-2 gap-1.5 w-full h-full p-0.5">
                            {/* 3 Main Icons (Top-Left, Top-Right, Bottom-Left) */}
                            {[0, 1, 2].map((i) => {
                                const skill = category.skills[i];
                                const iconUrl = skill ? TECH_ICON_URLS[skill] : null;

                                return (
                                    <motion.div
                                        key={i}
                                        layoutId={`${category.title}-${skill}-icon-container`}
                                        className="aspect-square w-full rounded-[10px] md:rounded-[12px] bg-linear-to-b from-gray-50 to-gray-200/50 border border-black/5 flex items-center justify-center overflow-hidden relative shadow-sm"
                                        style={{ opacity: 1 }}
                                    >
                                        <SkillIcon
                                            iconUrl={iconUrl}
                                            skill={skill}
                                            layoutId={`${category.title}-${skill}-icon`}
                                            className={`object-contain ${(skill === "REST API" || skill === "Blockchain")
                                                ? "w-full h-full scale-115"
                                                : "w-[90%] h-[90%]"
                                                }`}
                                        />
                                    </motion.div>
                                );
                            })}

                            {/* Mini Grid for Remaining Icons (Bottom-Right) - Individual Icons */}
                            <div className="aspect-square w-full grid grid-cols-2 gap-1">
                                {[3, 4, 5, 6].map((i) => {
                                    const skill = category.skills[i];
                                    const iconUrl = skill ? TECH_ICON_URLS[skill] : null;

                                    return (
                                        <motion.div
                                            key={i}
                                            layoutId={`${category.title}-${skill}-icon-container`}
                                            className="aspect-square w-full rounded-[4px] md:rounded-[5px] bg-linear-to-b from-gray-50 to-gray-200/50 border border-black/5 flex items-center justify-center shadow-xs overflow-hidden"
                                        >
                                            <SkillIcon
                                                iconUrl={iconUrl}
                                                skill={skill}
                                                layoutId={`${category.title}-${skill}-icon`}
                                                className="w-[90%] h-[90%] object-contain"
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <motion.span
                    layoutId={`title-${index}`}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[9px] md:text-[11px] font-black text-gray-400 group-hover:text-gray-900 uppercase tracking-widest text-center"
                    transition={transition}
                    style={{
                        WebkitFontSmoothing: 'antialiased',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                    }}
                >
                    {category.title}
                </motion.span>
            </motion.div>

            {/* Expanded Folder Overlay - Self-contained per folder */}
            <AnimatePresence>
                {isExpanded && (
                    <div className="fixed inset-0 z-110 flex items-center justify-center pointer-events-none p-4">
                        <div
                            className="absolute inset-0 pointer-events-auto"
                            onClick={handleClose}
                        />

                        {/* Premium Outer Ring - Wrapper Div */}
                        <motion.div
                            layoutId={`folder-${index}`}
                            className="
                                relative
                                p-1.5 md:p-2
                                bg-linear-to-b from-white/20 via-white/5 to-white/10
                                backdrop-blur-3xl
                                rounded-[46px] md:rounded-[54px]
                                shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)]
                                pointer-events-auto
                                overflow-hidden
                            "
                            transition={transition}
                        >
                            <div className="
                                relative
                                w-full max-w-[360px] md:max-w-[420px]
                                bg-linear-to-b from-white via-gray-50/98 to-gray-100
                                rounded-[40px] md:rounded-[48px]
                                shadow-[inset_0_2px_1px_rgba(255,255,255,1)]
                                border border-white/80
                                flex flex-col
                            ">
                                <div className="px-10 py-8 md:px-14 md:py-14 flex flex-col gap-6">
                                    <div className="flex items-center justify-center">
                                        <motion.h3
                                            layoutId={`title-${index}`}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-xl md:text-2xl font-black text-gray-900 tracking-tight"
                                            transition={transition}
                                            style={{
                                                WebkitFontSmoothing: 'antialiased',
                                                backfaceVisibility: 'hidden',
                                                transform: 'translateZ(0)'
                                            }}
                                        >
                                            {category.title}
                                        </motion.h3>
                                    </div>

                                    {/* iOS Grid Layout - Compact Icons */}
                                    <div className="grid grid-cols-3 gap-y-10 gap-x-6">
                                        {category.skills.map((skill, i) => {
                                            const iconUrl = TECH_ICON_URLS[skill];
                                            const isTracked = i < 7;

                                            // Skip complex animations on mobile
                                            if (isMobile || prefersReducedMotion) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex flex-col items-center gap-2"
                                                    >
                                                        <div className="
                                                            w-12 h-12 md:w-16 md:h-16
                                                            rounded-full
                                                            bg-linear-to-br from-white via-white to-gray-50
                                                            border border-gray-100/30
                                                            shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08),0_4px_8px_-2px_rgba(0,0,0,0.04),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.02)]
                                                            flex items-center justify-center
                                                            p-2 md:p-2.5
                                                        ">
                                                            <SkillIcon
                                                                iconUrl={iconUrl}
                                                                skill={skill}
                                                                className={`object-contain ${(skill === "REST API" || skill === "Blockchain" || skill === "JavaScript")
                                                                    ? "w-full h-full scale-125"
                                                                    : "w-[85%] h-[85%] scale-110"
                                                                    }`}
                                                            />
                                                        </div>
                                                        <span
                                                            className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-tighter text-center leading-tight"
                                                        >
                                                            {skill}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <motion.div
                                                    key={i}
                                                    layoutId={isTracked ? `${category.title}-${skill}-icon-container` : undefined}
                                                    initial={!isTracked ? { opacity: 0, scale: 0.8, filter: 'blur(8px)' } : false}
                                                    animate={isTracked ? {
                                                        opacity: 1,
                                                        scale: [1, 1.1, 1],
                                                        filter: ["blur(0px)", "blur(6px)", "blur(0px)"],
                                                    } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                                    exit={isTracked ? {
                                                        scale: [1, 1.1, 1],
                                                        filter: ["blur(0px)", "blur(6px)", "blur(0px)"],
                                                        transition: { duration: 0.4 }
                                                    } : {}}
                                                    transition={isTracked ? {
                                                        ...transition,
                                                        filter: { duration: 0.4, times: [0, 0.4, 1] },
                                                        scale: { duration: 0.4, times: [0, 0.4, 1] }
                                                    } : { ...transition, delay: 0.15 + (i * 0.03) }}
                                                    className="flex flex-col items-center gap-2 group/app"
                                                    style={{ willChange: "transform" }}
                                                >
                                                    <div className="
                                                        w-12 h-12 md:w-16 md:h-16
                                                        rounded-full
                                                        bg-linear-to-br from-white via-white to-gray-50
                                                        border border-gray-100/30
                                                        shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08),0_4px_8px_-2px_rgba(0,0,0,0.04),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.02)]
                                                        flex items-center justify-center
                                                        p-2 md:p-2.5
                                                    ">
                                                        <SkillIcon
                                                            iconUrl={iconUrl}
                                                            skill={skill}
                                                            layoutId={isTracked ? `${category.title}-${skill}-icon` : undefined}
                                                            className={`object-contain ${(skill === "REST API" || skill === "Blockchain" || skill === "JavaScript")
                                                                ? "w-full h-full scale-125"
                                                                : "w-[85%] h-[85%] scale-110"
                                                                }`}
                                                        />
                                                    </div>
                                                    <motion.span
                                                        layoutId={isTracked ? `${category.title}-${skill}-text` : undefined}
                                                        initial={!isTracked ? { opacity: 0, y: 5 } : false}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={transition}
                                                        className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-tighter text-center leading-tight"
                                                    >
                                                        {skill}
                                                    </motion.span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
});

FolderIcon.displayName = 'FolderIcon';
