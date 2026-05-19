"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "@/components/FadeInUp";
import { motion, useScroll, useTransform, useMotionValue, useInView } from "framer-motion";

interface CaseStudy {
    id: string;
    title: string;
    title_en?: string;
    slug: string;
    slug_en?: string;
    image_url: string;
    created_at: string;
    published_at?: string;
    category?: string;
    tags?: string[];
    // Mock fields for the new design
    description?: string;
    stats?: { label: string; value: string }[];
}

export default function HomeProjectsSectionB() {
    const { language } = useLanguage();
    const [projects, setProjects] = useState<CaseStudy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Custom cursor state for cards
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHoveringCard, setIsHoveringCard] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 35); // 35 is half of 70px width
            cursorY.set(e.clientY - 35); // 35 is half of 70px height
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [cursorX, cursorY]);

    const fetchProjects = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
        } else {
            // Add mock data for the A/B test version if description is missing
            const enhancedData = (data || []).map((p, index) => ({
                ...p,
                description: p.description || (language === 'es'
                    ? "Automatizamos procesos estratégicos y diseño de interfaces innovadoras para potenciar el crecimiento digital y la eficiencia operativa."
                    : "We automate strategic processes and design innovative interfaces to drive digital growth and operational efficiency.")
            }));
            setProjects(enhancedData);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, [language]);

    if (!isLoading && projects.length === 0) return null;

    return (
        <section ref={containerRef} className="w-full pt-24 bg-background relative overflow-visible">
            <div className="stack-boundary">
                <div className="max-w-6xl mx-auto px-8 mb-16 md:mb-24 sticky top-20 z-0">
                    <FadeInUp>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-background py-12 -ml-4 pl-4 rounded-r-xl">
                            <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-white leading-tight text-left w-full md:max-w-[700px]">
                                {language === 'es' ? "Selección de casos de estudio desde el 2018 hasta ahora" : "Selection of case studies from 2018 to now"}
                            </h2>
                            <Link
                                href="/case-studies"
                                className="group flex items-center gap-2 text-white border-b border-white/20 pb-1 hover:border-white transition-all whitespace-nowrap mb-2"
                            >
                                <span className="text-sm font-medium tracking-tight">
                                    {language === 'es' ? "Ver todos" : "View all"}
                                </span>
                                <ArrowUpRight size={22} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </div>
                    </FadeInUp>
                </div>

                <div className="max-w-6xl mx-auto px-1 md:px-1 relative pb-24">
                    {/* Vertical Indicator - Floating Outside */}
                    <div className="hidden xl:block absolute -left-20 top-0 bottom-0 w-4 shrink-0">
                        <div className="sticky top-[45vh] flex flex-col gap-3">
                            {projects.map((_, i) => (
                                <div
                                    key={i}
                                    className={`transition-all duration-500 rounded-full ${activeIndex === i
                                        ? "h-8 w-2 bg-primary"
                                        : "h-2 w-2 bg-foreground/20"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-0">
                        {isLoading ? (
                            // Skeleton
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="w-full h-[500px] bg-card/50 rounded-[2rem] mb-8 animate-pulse" />
                            ))
                        ) : (
                            projects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    total={projects.length}
                                    language={language}
                                    setIsHoveringCard={setIsHoveringCard}
                                    setActiveIndex={setActiveIndex}
                                    containerScrollYProgress={scrollYProgress}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>


            {/* Custom Mouse Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-[70px] h-[70px] rounded-full bg-foreground shadow-2xl flex items-center justify-center pointer-events-none z-[100] border border-border"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: isHoveringCard ? 1 : 0,
                    opacity: isHoveringCard ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
                <ArrowUpRight size={24} className="text-background" />
            </motion.div>
        </section>
    );
}

function ProjectCard({ project, index, total, language, setIsHoveringCard, setActiveIndex, containerScrollYProgress }: { project: CaseStudy, index: number, total: number, language: string, setIsHoveringCard: (v: boolean) => void, setActiveIndex: (v: number) => void, containerScrollYProgress: any }) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Create useScroll for this specific card's progress
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "start start"]
    });

    // Scale down the card as it gets covered by the next one
    // Each card sticks at a top position, and we want to scale it slightly 
    // as more cards scroll over it. 
    // For simplicity with CSS sticky, we can just use CSS sticky for stacking.

    const inView = useInView(cardRef, { margin: "-45% 0px -45% 0px" });

    // Scale effect based on container scroll
    // Limit min scale to avoid cards becoming too tiny if there are many
    const start = index / total;
    const scale = useTransform(containerScrollYProgress, [start, 1], [1, 1 - Math.min((total - index), 4) * 0.05]);

    // Fade out first card when reaching the last one
    // Adjusted range so it finishes fading by the time the last card starts its sticky phase
    const fadeStart = total > 1 ? (total - 2) / total : 0;
    const fadeEnd = total > 1 ? (total - 1) / total : 1;
    const firstCardOpacity = useTransform(containerScrollYProgress, [Math.max(0, fadeStart), Math.max(0, fadeEnd)], [1, 0]);

    useEffect(() => {
        if (inView) {
            setActiveIndex(index);
        }
    }, [inView, index, setActiveIndex]);
    const title = language === 'en' && project.title_en ? project.title_en : project.title;
    const slug = language === 'en' && project.slug_en ? project.slug_en : project.slug;


    return (
        <Link
            href={`/case-studies/${slug}`}
            className="block cursor-none no-underline sticky top-72 w-full mb-[8vh]"
            style={{
                zIndex: index,
                paddingTop: `${index * 12}px`
            }}
            onMouseEnter={() => setIsHoveringCard(true)}
            onMouseLeave={() => setIsHoveringCard(false)}
        >
            <div
                ref={cardRef}
            >
                <motion.div
                    className="w-full bg-[#111] border border-border/50 rounded-[1rem] overflow-hidden flex flex-col md:flex-row h-auto shadow-2xl origin-top"
                    style={{
                        scale,
                        opacity: index === 0 ? firstCardOpacity : undefined
                    }}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                >
                    {/* Left Content */}
                    <div className="p-8 md:p-10 flex flex-col justify-between w-full md:w-[50%] items-start text-left">
                        <div className="space-y-6">
                            {project.category && (
                                <span className="text-muted text-sm font-medium tracking-wide">
                                    {project.category}
                                </span>
                            )}
                            <h3 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-white leading-tight">
                                {title}
                            </h3>
                            <p className="text-muted text-lg max-w-md leading-relaxed">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-auto pt-8">
                            {project.tags?.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[0.8rem] text-white/70 font-medium tracking-wide transition-colors hover:bg-white/10"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="w-full md:w-[50%] flex items-center justify-center p-6 md:p-10">
                        <div className="relative w-full aspect-square rounded-[1rem] overflow-hidden group border border-white/5">
                            {/* Project Image */}

                            {/* Action Component */}
                            <div
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 z-10"
                            >
                                <ArrowUpRight size={20} />
                            </div>

                            {/* Subtle pattern or image overlay */}
                            {project.image_url ? (
                                <Image
                                    src={project.image_url}
                                    alt={title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-800 text-xs">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </Link>
    );
}
