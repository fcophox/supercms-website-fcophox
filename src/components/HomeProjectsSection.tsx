"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { ArrowUpRight, ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "@/components/FadeInUp";

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
    // We might want to add a short description field in the future
    // using title for now as the main hook
}

export default function HomeProjectsSection() {
    const { t, language } = useLanguage();
    const [projects, setProjects] = useState<CaseStudy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Drag to scroll logic
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchProjects = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error("Error fetching projects:", error);
        } else {
            setProjects(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);



    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        setIsDown(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDown(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDown || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        sliderRef.current.scrollLeft = scrollLeft - walk;
        if (Math.abs(walk) > 5) setIsDragging(true);
    };

    const handleScroll = () => {
        if (!sliderRef.current) return;
        const scrollPosition = sliderRef.current.scrollLeft;
        // The first child is style tag, second is empty div spacer, third is first item
        // Actually children logic might be tricky due to mapped items. 
        // Let's rely on scrollWidth and clientWidth to estimate or just item width logic
        // Better: calculate based on assumed item width + gap

        // Let's try to find the item width dynamically
        // The items are mapped, so we can iterate childNodes
        const container = sliderRef.current;
        // We have a spacer first
        // Let's just assume rough width or try to get it from the first card element
        // Since we have variable widths (85vw or fixed px), exact index is tricky.
        // Let's use a simplified approach: scrollPercentage * (totalItems - 1)

        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) return;

        const scrollRatio = scrollPosition / maxScroll;
        const index = Math.round(scrollRatio * (projects.length - 1));
        setActiveIndex(Math.min(Math.max(0, index), projects.length - 1));
    };

    const scrollToProject = (index: number) => {
        if (!sliderRef.current) return;

        // Special case for first item to maintain the "spacer" alignment
        if (index === 0) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }

        const children = sliderRef.current.children;
        // Children: <style> <spacer> <project0> ...
        // So project index i is at children[i + 2]

        const targetElement = children[index + 2] as HTMLElement;

        if (targetElement) {
            const container = sliderRef.current;
            const containerLeft = container.getBoundingClientRect().left;
            const targetElementRect = targetElement.getBoundingClientRect();
            // If the element is null (which shouldn't happen if logic is correct), safe check
            if (!targetElementRect) return;

            const targetLeft = targetElementRect.left;
            const offset = targetLeft - containerLeft + container.scrollLeft;

            container.scrollTo({
                left: offset - 32, // 32px padding (px-8)
                behavior: 'smooth'
            });
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!sliderRef.current) return;
        const scrollAmount = sliderRef.current.offsetWidth * 0.8; // Scroll 80% of width
        sliderRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (!isLoading && projects.length === 0) return null;

    return (
        <section className="w-full py-16 overflow-hidden select-none">
            <FadeInUp>
                <div className="max-w-[1200px] mx-auto px-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-white leading-tight text-left w-full md:max-w-[750px]">
                        {language === 'es'
                            ? "Selección de algunos proyectos digitales desde 2018 hasta hoy"
                            : "Selection of digital projects from 2018 to today"}
                    </h2>
                    <Link
                        href="/case-studies"
                        className="flex items-center gap-4 text-white no-underline font-semibold text-sm border-b border-white/20 pb-2 w-full md:w-auto justify-between md:justify-start transition-all duration-200 hover:border-white hover:opacity-80 group"
                    >
                        {language === 'es' ? "Ver todos" : "Check all"}
                        <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </FadeInUp>

            {/* Slider Container */}
            <FadeInUp delay={0.2}>
                <div
                    ref={sliderRef}
                    className="overflow-x-auto flex gap-6 px-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-12 scrollbar-hide"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onScroll={handleScroll}
                >

                    {/* Responsive Spacer to align first item with centered header on large screens */}
                    <div className="shrink-0 w-[calc(max(0px,calc((100vw-1260px)/2)))]" />

                    {isLoading ? (
                        // Skeleton Logic
                        [...Array(3)].map((_, index) => (
                            <div key={`skeleton-${index}`} className="snap-center lg:snap-align-none shrink-0 first:pl-0">
                                <div className="w-[85vw] md:w-[600px] lg:w-[630px]">
                                    <div className="bg-[#121214] border border-white/5 rounded-[1.4rem] overflow-hidden flex flex-col md:flex-row h-auto min-h-[500px] md:min-h-0 md:h-[320px] animate-pulse">
                                        {/* Left Content Skeleton */}
                                        <div className="p-6 md:p-8 flex flex-col justify-center items-start w-full md:w-[45%] z-10 release shrink-0">
                                            <div className="w-24 h-6 bg-white/10 rounded-full mb-4"></div>
                                            <div className="w-full h-8 bg-white/10 rounded mb-2"></div>
                                            <div className="w-2/3 h-8 bg-white/10 rounded mb-6"></div>

                                            <div className="mt-auto pt-6 border-t border-white/10 w-full">
                                                <div className="flex gap-2">
                                                    <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                                                    <div className="w-20 h-6 bg-white/10 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Right Image Skeleton */}
                                        <div className="w-full md:w-[55%] flex-1 md:flex-auto md:h-full bg-white/5"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        projects.map((project, index) => {
                            const title = language === 'en' && project.title_en ? project.title_en : project.title;
                            const slug = language === 'en' && project.slug_en ? project.slug_en : project.slug;

                            return (
                                <div key={project.id} onClickCapture={handleClick} className="snap-center lg:snap-align-none shrink-0 first:pl-0">
                                    <Link
                                        href={`/case-studies/${slug}`}
                                        className="block relative group no-underline draggable-link w-[85vw] md:w-[580px] lg:w-[670px]"
                                        draggable={false}
                                    >
                                        <div className="bg-[#121214] border border-white/5 rounded-[1.4rem] overflow-hidden flex flex-col md:flex-row h-auto min-h-[500px] md:min-h-0 md:h-[320px] transition-all duration-500 hover:border-white/20">

                                            {/* Left Content */}
                                            <div className="p-6 md:p-8  flex flex-col justify-center items-start w-full md:w-[45%] z-10 relative shrink-0">
                                                {project.category && (
                                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold bg-white/5 text-[0.7rem] text-zinc-400 tracking-wider">
                                                        {project.category}
                                                    </div>
                                                )}

                                                <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-normal text-white mb-6 leading-tight group-hover:text-primary transition-colors text-left">
                                                    {title}
                                                </h3>

                                                <div className="mt-auto pt-6 border-t border-white/10 w-full">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tags?.slice(0, 3).map(tag => (
                                                            <span key={tag} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Image */}
                                            <div className="w-full md:w-[55%] flex-1 md:flex-auto md:h-full relative overflow-hidden order-last md:order-last min-h-[200px]">
                                                {project.image_url ? (
                                                    <div className="absolute inset-0 md:top-10 md:bottom-10 md:left-10 md:-right-20 transition-transform duration-500 ease-out group-hover:md:translate-x-[-20px]">
                                                        <Image
                                                            src={project.image_url}
                                                            alt={title}
                                                            fill
                                                            className="object-cover object-top md:object-left-top md:rounded-l-[1.2rem] border-t md:border-t md:border-l md:border-b border-white/10 md:shadow-2xl pointer-events-none select-none transition-transform duration-500 ease-out group-hover:rotate-[-6deg]"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                                        No Preview
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>


                                </div>
                            );
                        })
                    )}

                    <div className="w-[5vw] shrink-0" />
                </div>
            </FadeInUp>

            {/* Controls */}
            {!isLoading && (
                <div className="max-w-[1200px] mx-auto px-8 mt-8 flex justify-between items-center">
                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex gap-2">
                        {projects.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToProject(index)}
                                className={`transition-all duration-300 rounded-full ${activeIndex === index
                                    ? "w-8 h-2 bg-white"
                                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`Go to project ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
