import { Bot, Cpu, Globe, Smartphone, Terminal } from 'lucide-react';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { SiNotion } from 'react-icons/si';
import { ContactItem, EducationItem, ExperienceItem, Project, SkillCategory, SocialLink, Song, StackInsightItem, TestimonialItem } from './types';

export const SOCIAL_LINKS: SocialLink[] = [
    {
        icon: FaLinkedinIn,
        href: "https://www.linkedin.com/in/alexandephilia/",
        label: "LinkedIn",
        // Gray gradient button with thick shadow, LinkedIn blue icon
        buttonStyle: "bg-gradient-to-b from-white via-gray-100 to-gray-200 border border-gray-300/60 shadow-[0_4px_0_#d1d5db,0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] text-[#0A66C2] hover:shadow-[0_2px_0_#d1d5db,0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] hover:translate-y-[2px] active:shadow-[0_0px_0_#d1d5db,inset_0_2px_4px_rgba(0,0,0,0.1)] active:translate-y-[4px]"
    },
    {
        icon: FaWhatsapp,
        href: "https://wa.me/6285959300787",
        label: "WhatsApp",
        // Gray gradient button with thick shadow, WhatsApp green icon
        buttonStyle: "bg-gradient-to-b from-white via-gray-100 to-gray-200 border border-gray-300/60 shadow-[0_4px_0_#d1d5db,0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] text-[#16a34a] hover:shadow-[0_2px_0_#d1d5db,0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] hover:translate-y-[2px] active:shadow-[0_0px_0_#d1d5db,inset_0_2px_4px_rgba(0,0,0,0.1)] active:translate-y-[4px]",
        iconSize: 20
    },
    {
        icon: SiNotion,
        href: "https://dub.sh/vR17sbt",
        label: "Notion",
        // Gray gradient button with thick shadow, Notion dark icon
        buttonStyle: "bg-gradient-to-b from-white via-gray-100 to-gray-200 border border-gray-300/60 shadow-[0_4px_0_#d1d5db,0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] text-gray-800 hover:shadow-[0_2px_0_#d1d5db,0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] hover:translate-y-[2px] active:shadow-[0_0px_0_#d1d5db,inset_0_2px_4px_rgba(0,0,0,0.1)] active:translate-y-[4px]"
    },
];

export const PROJECTS: Project[] = [
    {
        id: "1",
        category: "Works",
        title: "Tenant Customer Service",
        description: "Migrated a mobile application legacy with rule-based chatbot to AI-powered conversational system for multi-tenant hospitality mobile application built with Flutter. I also use Figma to revamping the entire workflow of board Tenant app design to integrate with  Gemini 2.5 Flash.",
        icon: Smartphone,
        iconColor: "bg-blue-600",
        imageUrl: "/Work_1.jpg",
        status: "Live",
        linkUrl: "#",
        company: "Realta Chakradarma",
        date: "2024 - 2025",
        stack: ["Flutter", "Figma", "NPM", "Rule-based Chatbot"]
    },
    {
        id: "2",
        category: "Works",
        title: "Telegram Crypto Intelligence Bot",
        description: "Developed modular multi-chain cryptocurrency monitoring system with real-time transaction tracking. Features WebSocket-based monitoring, event-driven subscription management, and automated alert distribution for distributed user communities.",
        icon: Bot,
        iconColor: "bg-emerald-600",
        imageUrl: "/Work_2.jpg",
        status: "Live",
        linkUrl: "#",
        company: "RnD (Remote)",
        date: "2025",
        stack: ["WebSocket", "Telegraf.Js", "Docker", "REST APIs"]
    },
    {
        id: "3",
        category: "Works",
        title: "Web3 DeFAI Collaboration",
        description: "Collaborated as Research and Development on DeFAI (Decentralized Finance AI) for stablecoin cross-chain by leveraging AI solutions. Working with a multi cross nations teams via Discord to coordinate globally distributed development.",
        icon: Globe,
        iconColor: "bg-blue-600",
        imageUrl: "/Work_3.jpg",
        status: "Live",
        linkUrl: "#",
        isRedacted: true,
        company: "Discord",
        date: "2024 - 2025",
        stack: ["Next.JS", "Stablecoin", "Cross-chain", "AI Solutions"]
    },
    {
        id: "5",
        category: "Personal",
        title: "Zeta Platform",
        description: "A modern, seamless AI platform featuring advanced animations powered by Framer Motion. Orchestrates multi-AI providers (Groq, Gemini, OpenRouter, RouteAway) and integrates Exa Search for web intelligence. Includes multi-modal capabilities like image/document uploading with PDF parsing, human-like TTS expressions, and persistent chat history.",
        icon: Cpu,
        iconColor: "bg-purple-600",
        imageUrl: "/Work_5.jpg",
        status: "Live",
        linkUrl: "https://zetaai-pink.vercel.app/",
        stack: ["Vite", "Framer Motion", "Exa Search", "Eleven Labs"]
    },
    {
        id: "4",
        category: "Personal",
        title: "Electron-based LLMs Suite",
        description: "Created a cross-platform solution for accessing multiple AI services (Grok, ChatGPT, Claude, Deepseek, Manus, and Perplexity) through a single, convenient application packaged as a Linux AppImage using Electron.",
        icon: Terminal,
        iconColor: "bg-slate-700",
        imageUrl: "/Work_4.jpg",
        status: "Live",
        linkUrl: "https://github.com/alexandephilia/ChatGPT-x-DeepSeek-x-Grok-x-Claude-x-Perplexity-Linux-APP",
        stack: ["Electron", "NPM", "Wrappers", "Node.js", "AppImage"]
    },
    {
        id: "c1",
        category: "Components",
        title: "Luminous Budget Dashboard",
        description: "A premium, dark-mode budget dashboard featuring volumetric lighting effects and fluid animations.",
        icon: Smartphone,
        iconColor: "bg-blue-500",
        imageUrl: "/Work_1.jpg",
        status: "UI-Kit",
        linkUrl: "/components/card_1/index.html",
        stack: ["Framer Motion", "React", "Lucide Icons"]
    },
    {
        id: "c2",
        category: "Components",
        title: "Webcore Builder UI",
        description: "A high-fidelity implementation of a web builder interface featuring complex radial gradients, segmented controls, and a neumorphic-inspired aesthetic.",
        icon: Terminal,
        iconColor: "bg-purple-500",
        imageUrl: "/Work_2.jpg",
        status: "UI-Kit",
        linkUrl: "/components/dashboard_1/index.html",
        stack: ["3D Transforms", "Framer Motion", "React"]
    }
];

export const EXPERIENCE: ExperienceItem[] = [
    {
        id: "1",
        company: "RnD Remote | Dubai Based",
        role: "Founding Engineer",
        description: "Architected a multi-chain crypto intelligence platform and Telegram bot handling real-time analytics for 6+ networks. Built automated Docker infrastructure, high-performance data pipelines, and a Next.js admin dashboard with 3D analytics.",
        period: "2025"
    },
    {
        id: "2",
        company: "Realta Chakradarma",
        role: "Front End Developer",
        description: "Led frontend modernization by migrating legacy systems to Next.js & TypeScript, improving performance by 35%. Implemented atomic design systems, integrated AI workflows, and enhanced user engagement with Framer Motion and GSAP animations.",
        period: "2021 - 2025"
    },
    {
        id: "3",
        company: "Realta Chakradarma",
        role: "Software Implementation (Bumame)",
        description: "Served as technical liaison for pandemic-era healthcare IT solutions with Bumame Pharmachy as both partnership and customer. Implemented accurate lab testing workflows with zero downtime and facilitated seamless communication between client stakeholders and engineering teams.",
        period: "2020 - 2021"
    },
    {
        id: "4",
        company: "Realta Chakradarma",
        role: "Software Quality Control",
        description: "Managed quality assurance for enterprise systems using Selenium & Cypress, reducing critical bugs by 30%. Analyzed business workflows and authored technical documentation aligned with ISO 9001 standards.",
        period: "2017 - 2020"
    },
    {
        id: "5",
        company: "Tokio Marine Insurance Group",
        role: "Sales Agent",
        description: "Achieved sales targets within the first month as part of the inaugural agent cohort through consultative relationship building and product knowledge mastery.",
        period: "2016 - 2017"
    }
];

export const EDUCATION: EducationItem[] = [
    {
        id: "1",
        degree: "Technology of Information System",
        institution: "Binus University · Drop out · 2012 – 2015",
        period: "2012 – 2015"
    }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
    {
        title: "Engineering",
        skills: [

            "React.js",
            "Next.js",
            "TypeScript",
            "JavaScript",
            "Node.js",
            "Python",
            "Vue.js",
            "HTML/CSS",
            "Markdown",
        ]
    },
    {
        title: "Frontend",
        skills: [
            "Tailwind CSS",
            "Shadcn UI",
            "TanStack",
            "Framer Motion",
            "Cult UI",
            "Headless UI",
            "21st",
            "GSAP",
            "Three.js",
        ]
    },
    {
        title: "Backend",
        skills: [
            "PostgreSQL",
            "WebSocket",
            "Prisma",
            "MongoDB",
            "Supabase",
            "Redis",
            "Railway",
            "Blockchain",
            "REST API",
        ]
    },
    {
        title: "Deployment",
        skills: [
            "Docker",
            "Git/GitHub",
            "Vercel",
            "Netlify",
            "Puppeteer",
            "GitHub",
            "Cloudflare",
            "AWS",
            "Nginx"
        ]
    },
    {
        title: "Tools",
        skills: [
            "Cursor IDE",
            "Windsurf",
            "Claude Code",
            "Warp Terminal",
            "MCP Integration",
            "Kiro",
            "Bun",
            "npm/Yarn",
            "ESLint/Prettier",
        ]
    }
];

export const STACK_INSIGHTS: StackInsightItem[] = [
    {
        id: "1",
        title: "Claude the Magnum Opus",
        text: "My second brain. It helps me explore every possible way to solve a problem until the best one becomes clear. It’s not just for generating code; it’s a partner that helps me think through every detail and find the best way to build something great.",
        category: "The Co-Brain"
    },
    {
        id: "2",
        title: "Cursor the Multi-Editor",
        text: "The command center for every project. It's more than just a place to type. it's a tool that helps me both design and build software at the speed of thought. It takes the friction out of coding, letting me turn complex ideas into working products without getting stuck.",
        category: "The Editor"
    },
    {
        id: "3",
        title: "Motion the Physics of the Web",
        text: "The physics of the web. I use it to make digital movements feel real—adding weight and life to every interaction. It ensures that clicking, dragging, and scrolling feels as natural as moving something in the physical world.",
        category: "The Motion"
    }
];

export const CONTACT_INFO: ContactItem[] = [
    { label: "Email", value: "4lexander31@gmail.com", href: "mailto:4lexander31@gmail.com" },
    { label: "LinkedIn", value: "/in/Alexandephilia", href: "https://www.linkedin.com/in/alexandephilia/" },
    { label: "GitHub", value: "Alexandephilia", href: "https://github.com/alexandephilia" },
];

export const BEYOND_WORK_IMAGES = [
    "/beyond/beyond_1.jpeg",
    "/beyond/beyond_2.jpeg",
    "/beyond/beyond_3.jpeg",
    "/beyond/beyond_4.jpeg",
    "/beyond/beyond_5.jpeg",
    "/beyond/beyond_6.jpeg",
    "/beyond/beyond_7.jpeg",
    "/beyond/beyond_8.jpeg",
    "/beyond/beyond_9.jpeg",
    "/beyond/beyond_10.jpeg",
    "/beyond/beyond_11.jpeg",
    "/beyond/beyond_12.jpeg",
];

export const SONGS: Song[] = [
    {
        id: "1",
        title: "Hungry Cat",
        artist: "Cat Songs",
        url: "/songs/hungry cat.mp3",
        coverUrl: "/songs/hungrycat.jpeg"
    },
    {
        id: "2",
        title: "Jelly Belly",
        artist: "Cat Songs",
        url: "/songs/jelly belly.mp3",
        coverUrl: "/songs/beancat.jpeg"
    },
    {
        id: "3",
        title: "Silly Cat",
        artist: "Cat Songs",
        url: "/songs/silly cat.mp3",
        coverUrl: "/songs/sillycat.gif"
    }
];

export const TESTIMONIALS: TestimonialItem[] = [
    {
        id: "1",
        text: "Working with Garry is like watching a master clockmaker at work. He doesn't just build features; he architects entire ecosystems with a level of precision that is rare in this industry. His async-first approach transformed our distributed team's velocity during the Zeta platform development.",
        name: "Marcus Thorne",
        role: "Head of Engineering, Realta Group"
    },
    {
        id: "2",
        text: "He has this uncanny ability to bridge the gap between abstract design and rigid logic. When we were migrating our legacy healthcare lab systems, Garry owned the entire pipeline with zero downtime. He's not just a developer; he's a technical steward who understands the gravity of the mission.",
        name: "Sarah Chen",
        role: "CTO, Bumame Pharmacy"
    },
    {
        id: "3",
        text: "Garry's integration of AI tooling into his workflow isn't just about efficiency—it's about expanding what's possible. He treats every line of code with intentionality, ensuring that the architecture is as robust as the UI is beautiful. He truly understands that code is poetry.",
        name: "David Varkov",
        role: "Senior Lead, Digital Dubai"
    }
];
