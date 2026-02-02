import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { useEffect, useState } from 'react';
import { BeyondWork } from './components/BeyondWork';
import { BottomBlur } from './components/BottomBlur';
import { ComponentShowcase } from './components/ComponentShowcase';
import { Contact } from './components/Contact';
import { CustomCursor } from './components/CustomCursor';
import { DraggableSticker } from './components/DraggableSticker';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { ExperimentShowcase } from './components/ExperimentShowcase';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectCard } from './components/ProjectCard';
import { ScrollTimeline } from './components/ScrollTimeline';
import { SectionWrapper } from './components/SectionWrapper';
import { Skills } from './components/Skills';
import { StackInsights } from './components/StackInsights';
import { Tabs } from './components/Tabs';
import { TopBlur } from './components/TopBlur';
import { TransformDock } from './components/TransformDock';
import { Writings } from './components/Writings';
import { PROJECTS } from './constants';

export default function App() {
    const [activeTab, setActiveTab] = useState('Personal');
    // Check sessionStorage synchronously to avoid flash
    const [hasVisited] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('hasVisited') === 'true';
        }
        return true; // Default to no animations on SSR
    });

    useEffect(() => {
        // Check for admin key in URL and store it
        const params = new URLSearchParams(window.location.search);
        const key = params.get('key');
        if (key) {
            sessionStorage.setItem('adminKey', key);
            // Clean URL without reload
            window.history.replaceState({}, '', window.location.pathname);
        }

        // Force scroll to top on refresh
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Mark as visited for next time
        sessionStorage.setItem('hasVisited', 'true');
    }, []);



    // Global Animation Variants
    const sectionVariants = {
        hidden: { opacity: 0, filter: 'blur(14px)', y: 20, z: 0, willChange: "transform, opacity, filter" },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            z: 0,
            transition: { duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    // Instant variant for subsequent visits
    const instantVariants = {
        hidden: { opacity: 1, filter: 'blur(0px)', y: 0 },
        visible: { opacity: 1, filter: 'blur(0px)', y: 0 }
    };

    // Simplified Staggered Reveal Variants
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            filter: 'blur(14px)',
            y: 20,
            z: 0,
            scale: 0.98,
            willChange: "transform, opacity, filter"
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            z: 0,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    // Only apply animations if it's the first load of the session
    const isFirstLoad = !hasVisited;

    // Initialize Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        });
        const lenisAny = lenis as unknown as { start?: () => void; stop?: () => void };

        let rafId: number | null = null;
        let isActive = true;

        const raf = (time: number) => {
            if (!isActive) return;
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        const start = () => {
            if (isActive) return;
            isActive = true;
            lenisAny.start?.();
            rafId = requestAnimationFrame(raf);
        };

        const stop = () => {
            isActive = false;
            lenisAny.stop?.();
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const onVisibilityChange = () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        };

        rafId = requestAnimationFrame(raf);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            stop();
            lenis.destroy();
        };
    }, []);

    const displayProjects = PROJECTS.filter(project => project.category === activeTab);

    return (
        <>
            <div
                className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans relative overflow-x-hidden"
                style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
            >
                <div className="relative z-10 max-w-[740px] mx-auto border-x border-dashed border-gray-300 bg-[#FAFAFA] min-h-screen flex flex-col">

                    <motion.div
                        variants={isFirstLoad ? containerVariants : {}}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col"
                    >
                        <motion.div variants={isFirstLoad ? itemVariants : {}}>
                            <SectionWrapper id="header" className="z-50" showPattern={false}>
                                <Header />
                            </SectionWrapper>
                        </motion.div>

                        <main className="flex flex-col">
                            <SectionWrapper id="hero" className="z-40">
                                <Hero />
                            </SectionWrapper>

                            <SectionWrapper id="projects" className="z-30" showPattern={false}>
                                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                            </SectionWrapper>

                            <SectionWrapper className="relative z-29">
                                <section className="overflow-visible">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="overflow-visible"
                                            variants={{
                                                hidden: {
                                                    opacity: 0,
                                                    filter: 'blur(14px)',
                                                    y: 15,
                                                    scale: 0.98,
                                                    willChange: "transform, opacity, filter"
                                                },
                                                visible: {
                                                    opacity: 1,
                                                    filter: 'blur(0px)',
                                                    y: 0,
                                                    scale: 1,
                                                    transition: {
                                                        staggerChildren: 0.15,
                                                        delayChildren: 0.1,
                                                        duration: 0.6,
                                                        ease: [0.16, 1, 0.3, 1]
                                                    }
                                                },
                                                exit: {
                                                    opacity: 0,
                                                    filter: 'blur(8px)',
                                                    y: -10,
                                                    transition: {
                                                        duration: 0.3,
                                                        ease: "easeIn"
                                                    }
                                                }
                                            }}
                                            style={{ willChange: 'opacity, filter, transform' }}
                                        >
                                            {activeTab === 'Writings' ? (
                                                <div>
                                                    <Writings />
                                                </div>
                                            ) : activeTab === 'Components' ? (
                                                <div>
                                                    <ComponentShowcase />
                                                </div>
                                            ) : activeTab === 'Experiment' ? (
                                                <div>
                                                    <ExperimentShowcase />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-6 p-6 md:p-8 pb-24 md:pb-28 overflow-visible">
                                                    {displayProjects.length > 0 ? (
                                                        displayProjects.map((project) => (
                                                            <ProjectCard key={project.id} project={project} />
                                                        ))
                                                    ) : (
                                                        <motion.div
                                                            variants={{
                                                                hidden: { opacity: 0, y: 10 },
                                                                visible: { opacity: 1, y: 0 }
                                                            }}
                                                            className="py-20 text-center text-gray-400 bg-white rounded-[32px] border border-gray-100"
                                                        >
                                                            <p>No projects found in this category yet.</p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </section>
                            </SectionWrapper>

                            <SectionWrapper id="experience" className="z-25" showPattern={false}>
                                <Experience />
                            </SectionWrapper>
                            <SectionWrapper id="education" className="z-24">
                                <Education />
                            </SectionWrapper>
                            <SectionWrapper id="skills" className="z-23" showPattern={false}>
                                <Skills />
                            </SectionWrapper>
                            <SectionWrapper className="z-22">
                                <StackInsights />
                            </SectionWrapper>
                            <SectionWrapper id="contact" className="z-21" showPattern={false}>
                                <Contact />
                            </SectionWrapper>
                            <SectionWrapper className="z-20">
                                <BeyondWork />
                            </SectionWrapper>
                        </main>

                        <SectionWrapper className="z-10" showPattern={false}>
                            <Footer />
                        </SectionWrapper>
                    </motion.div>
                    <DraggableSticker
                        id="global-sticker-1"
                        src="/sticker_1.png"
                        className="bottom-70 right-60 md:bottom-35 md:-right-[-32rem]"
                        peelFrom="top"
                    />
                </div>

                {/* Transform Dock - Music + AI Chat */}
                <TransformDock />

                {/* Progressive Viewport Blur */}
                <TopBlur />
                <BottomBlur />

                {/* Custom Cursor */}
                <CustomCursor />

                {/* Global Progressive Timeline */}
                <ScrollTimeline />
            </div>
        </>
    );
}
