// Skills & Daily Driver Section
import { Code2, Database, Layers, Quote, Rocket, Wrench } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../constants';
import { SkillCategory } from '../types';
import {
    antiFlickerStyle,
    dailyDriverContentVariants,
    dailyDriverPillsVariants,
    popRevealVariants,
    sectionHeaderVariants,
    staggerContainerVariants,
    staggerItemVariants
} from './animations';
import ProgressiveText from './ProgressiveText';
import { RetroComputer } from './RetroComputer';

// Mapping categories to their hero icons
const CATEGORY_ICONS: Record<string, any> = {
    "Engineering": Code2,
    "Frontend": Layers,
    "Backend": Database,
    "Deployment": Rocket,
    "Tools": Wrench
};

// Premium shared transition config
const FOLDER_SPRING = {
    type: "spring" as const,
    damping: 28,
    stiffness: 260,
    mass: 1
};

// Mapping specific skills to image URLs (easy to customize)
// Add your own SVG URLs or local paths here
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
    "Prisma": "https://iconape.com/wp-content/files/xs/85603/svg/prisma-3.svg",
    "REST API": "https://www.opc-router.de/wp-content/uploads/2020/05/REST_socialmedia.jpg",
    "WebSocket": "https://www.outsystems.com/Forge_BL/rest/ComponentThumbnail/GetURL_ComponentThumbnail?ProjectImageId=17523", // Add your URL
    "MongoDB": "https://www.svgrepo.com/show/373845/mongo.svg",
    "Supabase": "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/4/supabase-icon-kpjasdqlnu8exakst6f44r.png/supabase-icon-5uqgeeqeknngv9las8zeef.png?_a=DATAg1AAZAA0",
    "Redis": "https://www.svgrepo.com/show/354272/redis.svg",
    "Railway": "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/railway-infrastructure-platform-icon.png", // Add your URL

    // Deployment
    "Docker": "https://www.svgrepo.com/show/373553/docker.svg",
    "Git/GitHub": "https://www.svgrepo.com/show/452210/git.svg",
    "Vercel": "https://pipedream.com/s.v0/app_XaLh2x/logo/orig",
    "Netlify": "https://www.svgrepo.com/show/354110/netlify.svg",
    "Puppeteer": "https://www.svgrepo.com/show/354228/puppeteer.svg",
    "GitHub": "https://cdn.worldvectorlogo.com/logos/github-icon-2.svg",
    "Cloudflare": "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/cloudflare-icon.png",
    "AWS": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png",
    "Unit Testing": "https://dashboard.snapcraft.io/site_media/appmedia/2024/01/Bash_Logo_Colored.png",

    // Tools
    "Cursor IDE": "https://custom.typingmind.com/assets/models/cursor.png", // Add your URL
    "Windsurf": "https://exafunction.github.io/public/brand/windsurf-black-symbol.png", // Add your URL
    "Claude Code": "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude-color.png", // Add your URL
    "Bun": "https://icon.icepanel.io/Technology/svg/Bun.svg",
    "npm/Yarn": "https://www.svgrepo.com/show/452077/npm.svg",
    "ESLint/Prettier": "https://icon.icepanel.io/Technology/svg/ESLint.svg",
    "Warp Terminal": "https://mvolkmann.github.io/blog/assets/warp-logo.png?v=1.1.1", // Add your URL
    "MCP Integration": "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/mcp.png", // Add your URL
    "Kiro": "https://kiro.dev/icon.svg?fe599162bb293ea0", // Add your URL
    "Vite": "https://www.svgrepo.com/show/374167/vite.svg",
};

export const Skills: React.FC = () => {
    const [expandedFolder, setExpandedFolder] = useState<number | null>(null);

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainerVariants}
            className="p-6 md:p-8 border-b border-dashed border-gray-200 bg-[#FAFAFA] relative overflow-visible"
            style={antiFlickerStyle}
        >
            <InspirationSection />

            <ProgressiveText
                as="h2"
                variants={sectionHeaderVariants}
                className="text-[10px] md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase mb-8"
            >
                Skills Stack
            </ProgressiveText>

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
                        onExpand={(index) => setExpandedFolder(index)}
                        onClose={() => setExpandedFolder(null)}
                    />
                ))}
            </motion.div>

            <MacMiniSection />
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
}

const FolderIcon: React.FC<FolderIconProps> = React.memo(({ category, index, isExpanded, isOtherExpanded, onExpand, onClose }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Optimized event handlers
    const handleOpen = () => {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'hidden';
            onExpand(index);
        }
    };

    const handleClose = () => {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'unset';
            onClose();
        }
    };

    const shouldBlur = isOtherExpanded && !isHovered;

    return (
        <>
            <motion.div
                layoutId={`folder-${index}`}
                onClick={handleOpen}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={!isExpanded && !isOtherExpanded ? { scale: 1.03, y: -4 } : {}}
                transition={{
                    ...FOLDER_SPRING,
                    filter: { duration: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.3, ease: "easeOut" },
                    scale: { duration: 0.3, ease: "easeOut" }
                }}
                animate={shouldBlur ? {
                    filter: 'blur(5px)',
                    opacity: 0.5,
                    scale: 0.95,
                } : {
                    filter: 'blur(0px)',
                    opacity: 1,
                    scale: 1,
                }}
                variants={!shouldBlur ? staggerItemVariants : undefined}
                className="flex flex-col items-center gap-5 cursor-pointer group shrink-0"
                style={{
                    willChange: "transform, opacity, filter",
                    zIndex: shouldBlur ? 0 : 10
                }}
            >
                <div className={`
                    relative overflow-hidden
                    p-1 md:p-1.5
                    bg-linear-to-b from-gray-200 to-gray-100
                    rounded-[18px] md:rounded-[24px]
                    border border-white/60
                    shadow-[
                        /* External Dropshadow */
                        0_20px_40px_-10px_rgba(0,0,0,0.2),
                        0_10px_20px_-5px_rgba(0,0,0,0.1),
                        /* Top Bevel Highlight */
                        inset_0_1px_0_rgba(255,255,255,1),
                        /* Tip Shine (Smooth Gradient Fade Out) */
                        inset_0_1px_40px_-5px_rgba(255,255,255,0.8)
                    ]
                    ${!isOtherExpanded ? 'group-hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25),0_15px_30px_-8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,1),inset_0_1px_40px_-5px_rgba(255,255,255,0.9)] transition-shadow duration-300' : ''}
                `}>
                    {/* The 'Shine' Glint Animation - Smoother & Wider */}
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.7)_45%,transparent_60%)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.2s] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none" />

                    <div className="
                        relative
                        w-20 h-20 md:w-21 md:h-21
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
                        {/* Internal Rim Light */}
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent opacity-80" />
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
                                        {iconUrl ? (
                                            <motion.img
                                                layoutId={`${category.title}-${skill}-icon`}
                                                src={iconUrl}
                                                alt={skill}
                                                className={`object-contain ${(skill === "REST API" || skill === "Blockchain")
                                                    ? "w-full h-full scale-115"
                                                    : "w-[90%] h-[90%]"
                                                    }`}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50/50" />
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Mini Grid for Remaining Icons (Bottom-Right) - Individual Icons */}
                            <div className="aspect-square w-full grid grid-cols-2 gap-0.5 md:gap-1">
                                {[3, 4, 5, 6].map((i) => {
                                    const skill = category.skills[i];
                                    const iconUrl = skill ? TECH_ICON_URLS[skill] : null;

                                    return (
                                        <motion.div
                                            key={i}
                                            layoutId={`${category.title}-${skill}-icon-container`}
                                            className="aspect-square w-full rounded-[4px] md:rounded-[5px] bg-linear-to-b from-gray-50 to-gray-200/50 border border-black/5 flex items-center justify-center shadow-xs overflow-hidden"
                                        >
                                            {iconUrl ? (
                                                <motion.img
                                                    layoutId={`${category.title}-${skill}-icon`}
                                                    src={iconUrl}
                                                    alt={skill}
                                                    className="w-full h-full p-0 md:p-0.5 object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-50/50" />
                                            )}
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
                    transition={FOLDER_SPRING}
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
                            transition={FOLDER_SPRING}
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
                                        <ProgressiveText
                                            as="h3"
                                            layoutId={`title-${index}`}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-xl md:text-2xl font-black text-gray-900 tracking-tight"
                                            transition={FOLDER_SPRING}
                                            style={{
                                                WebkitFontSmoothing: 'antialiased',
                                                backfaceVisibility: 'hidden',
                                                transform: 'translateZ(0)'
                                            }}
                                        >
                                            {category.title}
                                        </ProgressiveText>
                                    </div>

                                    {/* iOS Grid Layout - Compact Icons */}
                                    <div className="grid grid-cols-3 gap-y-10 gap-x-6">
                                        {category.skills.map((skill, i) => {
                                            const iconUrl = TECH_ICON_URLS[skill];
                                            const isTracked = i < 7;

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
                                                        ...FOLDER_SPRING,
                                                        filter: { duration: 0.4, times: [0, 0.4, 1] },
                                                        scale: { duration: 0.4, times: [0, 0.4, 1] }
                                                    } : { ...FOLDER_SPRING, delay: 0.15 + (i * 0.03) }}
                                                    className="flex flex-col items-center gap-2 group/app"
                                                    style={{ willChange: "transform, filter" }}
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
                                                        {iconUrl ? (
                                                            <motion.img
                                                                layoutId={isTracked ? `${category.title}-${skill}-icon` : undefined}
                                                                src={iconUrl}
                                                                alt={skill}
                                                                className={`object-contain ${(skill === "REST API" || skill === "Blockchain" || skill === "JavaScript")
                                                                    ? "w-full h-full scale-125"
                                                                    : "w-[85%] h-[85%] scale-110"
                                                                    }`}
                                                                animate={isTracked ? {
                                                                    filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                                                                } : {}}
                                                                exit={isTracked ? {
                                                                    filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                                                                    transition: { duration: 0.4 }
                                                                } : {}}
                                                                transition={FOLDER_SPRING}
                                                                style={{ willChange: "transform, filter" }}
                                                            />
                                                        ) : (
                                                            <div className="w-2 h-2 rounded-full bg-gray-200" />
                                                        )}
                                                    </div>
                                                    <motion.span
                                                        layoutId={isTracked ? `${category.title}-${skill}-text` : undefined}
                                                        initial={!isTracked ? { opacity: 0, y: 5 } : false}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={FOLDER_SPRING}
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

const InspirationSection: React.FC = () => {
    return (
        <motion.div
            id="inspiration"
            variants={staggerItemVariants}
            className="mb-20 flex flex-col gap-8 w-full"
        >
            <ProgressiveText
                as="h2"
                variants={sectionHeaderVariants}
                className="text-[10px] md:text-[12px] font-bold text-[rgb(74,108,196)] tracking-wider uppercase"
            >
                Inspiration
            </ProgressiveText>

            <motion.div
                variants={staggerItemVariants}
                className="
                    relative
                    w-full
                    max-w-4xl
                    mx-auto
                    min-h-0 md:min-h-[480px]
                    bg-[#F2EFE9] 
                    rounded-sm
                    shadow-[
                        0_25px_50px_-12px_rgba(0,0,0,0.15),
                        inset_0_0_80px_rgba(255,255,255,0.4)
                    ]
                    border border-gray-400/30
                    p-6 md:p-14
                    flex flex-col md:flex-row
                    gap-2 md:gap-16
                    overflow-visible
                    sm:rotate-1
                    hover:rotate-0 transition-transform duration-700
                "
            >
                {/* Heavy Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
                
                {/* Postcard Center Line */}
                <div className="absolute left-1/2 top-10 bottom-10 w-[2px] bg-gray-400/20 hidden md:block" />

                {/* Left Section: Message Side */}
                <div className="flex-[1.2] flex flex-col justify-center relative z-10">
                    <div className="mb-2 md:mb-6 opacity-30">
                        <Quote className="text-gray-900 w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                        <p className="font-serif text-2xl md:text-2xl lg:text-3xl text-gray-900 leading-tight tracking-tight antialiased">
                            “The people who are crazy enough to think they can change the world, are the ones who do.”
                        </p>
                        <p className="font-serif italic text-base md:text-lg text-gray-700 leading-relaxed opacity-80 decoration-gray-400">
                            Here's to the crazy ones. The misfits. The rebels. The troublemakers. The round pegs in the square holes. The ones who see things differently.
                        </p>
                    </div>
                </div>

                {/* Right Section: Address & Stamp Side */}
                <div className="flex-1 flex flex-col justify-end md:justify-between relative z-10 pt-2 md:pt-0">
                    <div className="flex flex-row md:flex-col items-end md:items-stretch gap-6 md:gap-0">
                        {/* Stamp Area - Realized as a physical object */}
                        <div className="relative md:absolute md:-top-6 md:-right-6 w-24 h-28 md:w-24 md:h-28 bg-[#F9F7F2] border border-gray-300 shadow-md p-1 transform rotate-6 hover:rotate-2 transition-transform duration-500 order-1 md:order-none shrink-0 mb-4 md:mb-0">
                            <div className="w-full h-full border border-dashed border-gray-400 flex flex-col items-center justify-center text-center p-1 bg-white">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 text-[#2B6CB0] opacity-80 mb-1">
                                    <path fill="currentColor" d="M17.057 12.783c.032 2.592 2.23 3.447 2.257 3.459-.017.065-.35 1.198-1.155 2.373-.695 1.016-1.417 2.029-2.541 2.05-1.103.018-1.458-.65-2.72-.65-1.261 0-1.652.631-2.701.67-1.088.04-1.921-1.087-2.619-2.096-1.428-2.063-2.52-5.83-1.05-8.375.727-1.263 2.029-2.064 3.445-2.083 1.074-.015 2.083.722 2.741.722.657 0 1.889-.9 3.149-.773.53.023 2.016.213 2.973 1.611-.077.047-1.776 1.033-1.758 3.092zM15.428 5.765c.571-.692.955-1.654.85-2.615-.826.033-1.826.549-2.418 1.24-.531.61-.995 1.59-.87 2.531.92.071 1.867-.464 2.438-1.156z" />
                                </svg>
                                <span className="text-[6px] md:text-[7px] font-mono font-bold text-gray-400 uppercase leading-none">CUPERTINO<br/>CALIFORNIA</span>
                            </div>
                            {/* Overlapping Stamp - High Fidelity Distressed Rubber Mark */}
                            <div className="absolute -bottom-16 -left-16 md:-bottom-16 md:-left-16 w-44 h-44 md:w-48 md:h-48 opacity-[0.18] pointer-events-none select-none">
                                <svg viewBox="0 0 160 160" className="w-full h-full text-[#1A365D] fill-current" style={{ filter: 'url(#distress-filter)' }}>
                                    <defs>
                                        <filter id="distress-filter">
                                            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                                        </filter>
                                    </defs>
                                    <g transform="rotate(-15 80 80)">
                                        <circle cx="80" cy="80" r="42" fill="none" stroke="currentColor" strokeWidth="1.2" />
                                        <circle cx="80" cy="80" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                        <path d="M 125,60 Q 140,55 155,60 M 125,70 Q 140,65 155,70 M 125,80 Q 140,75 155,80 M 125,90 Q 140,85 155,90 M 125,100 Q 140,95 155,100" 
                                              fill="none" stroke="currentColor" strokeWidth="0.8" />
                                        <text x="80" y="75" textAnchor="middle" className="text-[7px] font-black tracking-widest uppercase">CUPERTINO</text>
                                        <line x1="55" y1="80" x2="105" y2="80" stroke="currentColor" strokeWidth="0.5" />
                                        <text x="80" y="92" textAnchor="middle" className="text-[9px] font-black uppercase">JAN 24 1984</text>
                                        <path id="stamp-arch" d="M 45,80 A 35,35 0 0,1 115,80" fill="none" />
                                        <text className="text-[5px] font-bold">
                                            <textPath href="#stamp-arch" startOffset="50%" textAnchor="middle">• FIRST EDITION •</textPath>
                                        </text>
                                    </g>
                                </svg>
                            </div>
                        </div>

                        {/* Address Lines (For Signature) */}
                        <div className="flex-1 md:mt-32 space-y-6 md:space-y-8 order-2 md:order-none">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-px bg-gray-400/30 w-full relative">
                                    {i === 2 && (
                                        <div className="absolute -top-12 md:-top-14 left-0 w-full text-right pr-10 md:pr-4">
                                            <span className="font-serif italic text-5xl md:text-6xl text-gray-900 opacity-90 tracking-tighter block transform -rotate-2 whitespace-nowrap">
                                                ― Steve Jobs
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="text-[8px] font-mono text-gray-400 opacity-60 tracking-widest mt-8">
                        NO. 001 // MACINTOSH INSPIRATION // SYSTEM SEVEN
                    </div>
                </div>

                {/* Subtle Aging Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-white/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-black/5 to-transparent pointer-events-none" />
            </motion.div>
        </motion.div>
    );
};

const MacMiniSection: React.FC = () => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
            className="mt-20 md:mt-24 flex flex-col gap-10 items-center w-full"
        >
            <motion.div variants={staggerItemVariants} className="relative pb-2 overflow-visible">
                <ProgressiveText
                    as="h3"
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, ease: 'easeOut' },
                        },
                    }}
                    className="
                        font-serif italic
                        text-4xl md:text-6xl
                        text-gray-900
                        tracking-wide
                        transform -rotate-3
                        select-none
                        relative z-10
                        pt-6 pb-6
                    "
                >
                    My Daily Driver
                </ProgressiveText>

                <svg
                    className="absolute w-full h-8 md:h-10 bottom-0 left-0 text-[rgb(160,168,187)] z-0 pointer-events-none transform -rotate-3"
                    viewBox="0 0 182 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        variants={{
                            hidden: { pathLength: 0, opacity: 0 },
                            visible: {
                                pathLength: 1,
                                opacity: 1,
                                transition: { duration: 1.5, delay: 0.5, ease: 'easeInOut' },
                            },
                        }}
                        d="M2 7.5C15 2 30 13 45 7.5C60 2 75 13 90 7.5C105 2 120 13 135 7.5C150 2 165 13 180 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.div>

            <motion.div
                variants={staggerItemVariants}
                className="
                    relative
                    w-full
                    flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16
                "
            >
                <motion.div
                    variants={popRevealVariants}
                    className="w-full md:w-1/2 flex items-center justify-center relative z-10 h-[220px] md:h-[400px] md:translate-x-10"
                >
                    <RetroComputer />
                </motion.div>

                <motion.div
                    variants={dailyDriverContentVariants}
                    className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center gap-4 md:gap-6 relative z-20"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <ProgressiveText as="h4" className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                                Mac mini
                            </ProgressiveText>
                            <span className="px-3 py-1 bg-linear-to-br from-slate-800 to-slate-900 rounded-lg text-[12px] font-black text-white 
                             border-black shadow-lg uppercase tracking-widest">
                                M4
                            </span>
                        </div>
                        <ProgressiveText as="p" className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            It's my personal station!
                        </ProgressiveText>
                    </div>

                    <ProgressiveText className="text-[12px] md:text-[14px] text-gray-600 font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                        Compact yet incredibly powerful. This little machine handles my entire development stack from Backend to heavy frontend builds silently and efficiently. I use a multi-screen setup which allows me to do rapid prototyping and testing.
                    </ProgressiveText>

                    <motion.div
                        variants={dailyDriverPillsVariants}
                        className="flex flex-wrap gap-1.5 justify-center md:justify-start"
                    >
                        <SpecBadge>Apple Silicon</SpecBadge>
                        <SpecBadge>16GB Unified</SpecBadge>
                        <SpecBadge>512GB SSD</SpecBadge>
                        <SpecBadge>Remote Access</SpecBadge>
                        <SpecBadge>macOS Tahoe</SpecBadge>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};


const SpecBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.span
        variants={staggerItemVariants}
        className="
            relative
            px-2.5 py-1
            rounded-lg
            bg-gray-100/50
            border border-gray-200/50
            text-[7px] md:text-[8px] font-black text-gray-500/90 tracking-[0.12em] uppercase
            shadow-[
                0_1px_1px_rgba(255,255,255,1),
                inset_0_1px_2px_rgba(0,0,0,0.1),
                inset_0_2px_4px_rgba(0,0,0,0.05)
            ]
            inline-flex items-center justify-center
            overflow-hidden
            whitespace-nowrap
            group
        "
        style={{ willChange: "transform, opacity, filter" }}
    >
        {/* The 'Recessed' Bottom Layer */}
        <div className="absolute inset-0 bg-linear-to-b from-gray-200 to-gray-50 opacity-40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />

        {/* The Raised Content Pill - Sitting inside the well */}
        <div className="
            absolute inset-[1px]
            rounded-[7px]
            bg-linear-to-b from-white to-[#f8f8f8]
            shadow-[
                0_1.5px_1px_rgba(0,0,0,0.05),
                inset_0_1px_0_rgba(255,255,255,1)
            ]
        " />

        <span className="relative z-10">{children}</span>
    </motion.span>
);
