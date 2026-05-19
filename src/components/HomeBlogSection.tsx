/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "@/components/FadeInUp";
import { CardSkeleton } from "@/components/Skeleton";
import { motion, useMotionValue } from "framer-motion";

interface Article {
    id: string;
    title: string;
    title_en?: string;
    slug: string;
    slug_en?: string;
    content: string;
    content_en?: string;
    image_url: string;
    created_at: string;
    published_at?: string;
    status: string;
    category?: string;
}

export default function HomeBlogSection() {
    const { t, language } = useLanguage();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Drag to scroll logic
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Custom cursor state for cards
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHoveringCard, setIsHoveringCard] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 35); // 35 is half of 70px width
            cursorY.set(e.clientY - 35); // 35 is half of 70px height
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [cursorX, cursorY]);

    const fetchArticles = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error("Error fetching articles:", error);
        } else {
            setArticles(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchArticles();
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
        const container = sliderRef.current;

        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) return;

        const scrollRatio = scrollPosition / maxScroll;
        const index = Math.round(scrollRatio * (articles.length - 1));
        setActiveIndex(Math.min(Math.max(0, index), articles.length - 1));
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!sliderRef.current) return;
        const scrollAmount = sliderRef.current.offsetWidth * 0.8;
        sliderRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const scrollToArticle = (index: number) => {
        if (!sliderRef.current) return;

        if (index === 0) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }

        const children = sliderRef.current.children;
        // Adjusted for the spacer div
        const targetElement = children[index + 1] as HTMLElement;

        if (targetElement) {
            const container = sliderRef.current;
            const containerLeft = container.getBoundingClientRect().left;
            const targetElementRect = targetElement.getBoundingClientRect();
            if (!targetElementRect) return;

            const targetLeft = targetElementRect.left;
            const offset = targetLeft - containerLeft + container.scrollLeft;

            container.scrollTo({
                left: offset - 32,
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



    const getExcerpt = (html: string, length: number = 120) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || "";
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    if (isLoading) {
        return (
            <section className="w-full max-w-6xl mx-auto px-8 py-16">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </section>
        );
    }
    if (articles.length === 0) return null;

    return (
        <section className="w-full py-16 overflow-hidden select-none">
            {/* Header */}
            <FadeInUp>
                <div className="max-w-6xl mx-auto px-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-white leading-tight text-left w-full md:max-w-[750px]">
                        {t("home.blog.title")}
                    </h2>

                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-white no-underline font-medium text-[0.95rem] whitespace-nowrap border-b border-white/20 pb-[2px] transition-all duration-200 hover:opacity-80 hover:border-white mb-2"
                    >
                        {t("home.blog.viewAll")} <ArrowUpRight size={18} />
                    </Link>
                </div>
            </FadeInUp>

            {/* Slider Container */}
            <FadeInUp delay={0.2}>
                <div
                    ref={sliderRef}
                    className="overflow-x-auto flex gap-6 px-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-6 md:pb-12 scrollbar-hide"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onScroll={handleScroll}
                >
                    {/* Responsive Spacer */}
                    <div className="shrink-0 w-[calc(max(0px,calc((100vw-1210px)/2)))]" />

                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="snap-center lg:snap-align-none shrink-0 first:pl-0">
                                <div className="w-[85vw] md:w-[480px] lg:w-[520px] h-[300px] bg-zinc-900 animate-pulse rounded-2xl" />
                            </div>
                        ))
                    ) : (
                        articles.map((article, index) => {
                            const title = language === 'en' && article.title_en ? article.title_en : article.title;
                            const content = language === 'en' && article.content_en ? article.content_en : article.content;
                            const slug = language === 'en' && article.slug_en ? article.slug_en : article.slug;

                            return (
                                <div
                                    key={article.id}
                                    onClickCapture={handleClick}
                                    className="snap-center lg:snap-align-none shrink-0 first:pl-0"
                                    onMouseEnter={() => setIsHoveringCard(true)}
                                    onMouseLeave={() => setIsHoveringCard(false)}
                                >
                                    <Link href={`/blog/${slug}`} className="no-underline group block cursor-none w-[85vw] md:w-[480px] lg:w-[520px]" draggable={false}>
                                        <article className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden group/card transition-all duration-300 ease-out hover:-translate-y-1 border border-white/10 hover:border-white/20">
                                            {/* Background Image */}
                                            <div
                                                className="absolute inset-0 bg-[#222] bg-cover bg-center transition-transform duration-700 ease-out group-hover/card:scale-105"
                                                style={{
                                                    backgroundImage: article.image_url ? `url(${article.image_url})` : "none",
                                                }}
                                            >
                                                {!article.image_url && (
                                                    <div className="absolute inset-0 flex items-center justify-center text-[#444]">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent border-t border-white/5 opacity-80 group-hover/card:opacity-90 transition-opacity duration-300" />

                                            {/* Content */}
                                            <div className="absolute inset-0 p-8 pb-12 flex flex-col justify-end text-left z-10">
                                                <div className="transform translate-y-3 group-hover/card:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                                    {/* Meta */}
                                                    <div className="flex items-center gap-2 font-mono text-[0.85rem] text-zinc-300 mb-2">
                                                        <Calendar size={14} className="text-zinc-400" />
                                                        <span>{new Date(article.published_at || article.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>

                                                        {article.category && (
                                                            <>
                                                                <span className="opacity-40">•</span>
                                                                <span>{article.category}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-white text-[clamp(1.1rem,2.5vw,1.2rem)] font-light leading-[1.3] m-0 drop-shadow-md">
                                                        {title}
                                                    </h3>

                                                    {/* Description Wrapper (Expands on Hover) */}
                                                    <div className="grid grid-rows-[0fr] group-hover/card:grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-0 group-hover/card:opacity-100 mt-0 group-hover/card:mt-3">
                                                        <div className="overflow-hidden">
                                                            <p className="text-[#a1a1aa] text-[0.95rem] leading-relaxed line-clamp-2 m-0">
                                                                {getExcerpt(content, 100)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </div>
                            );
                        })
                    )}
                    <div className="w-[5vw] shrink-0" />
                </div>
            </FadeInUp>

            {/* Controls */}
            {!isLoading && articles.length > 0 && (
                <div className="max-w-6xl mx-auto px-8 mt-4 flex justify-between items-center">
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
                        {articles.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToArticle(index)}
                                className={`transition-all duration-300 rounded-full ${activeIndex === index
                                    ? "w-8 h-2 bg-white"
                                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`Go to article ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Mouse Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-[70px] h-[70px] rounded-full bg-white shadow-2xl flex items-center justify-center pointer-events-none z-[100] border border-white/10"
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
                <ArrowUpRight size={24} className="text-black" />
            </motion.div>
        </section>
    );
}
