/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, ArrowUpRight } from "lucide-react";
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
            .limit(2);

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
        <section className="w-full max-w-6xl mx-auto px-8 py-16">
            {/* Header */}
            <FadeInUp>
                <div className="flex justify-between items-end mb-12 gap-8 flex-wrap">
                    <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-white leading-tight text-left w-full md:max-w-[750px]">
                        {t("home.blog.title")}
                    </h2>

                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-white no-underline font-medium text-[0.95rem] whitespace-nowrap border-b border-white/20 pb-[2px] transition-all duration-200 hover:opacity-80 hover:border-white"
                    >
                        {t("home.blog.viewAll")} <ArrowUpRight size={18} />
                    </Link>
                </div>
            </FadeInUp>

            {/* Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                {articles.map((article, index) => {
                    const title = language === 'en' && article.title_en ? article.title_en : article.title;
                    const content = language === 'en' && article.content_en ? article.content_en : article.content;
                    const slug = language === 'en' && article.slug_en ? article.slug_en : article.slug;

                    return (
                        <FadeInUp key={article.id} delay={0.2 + (index * 0.2)} className="h-full">
                            <div
                                className="h-full"
                                onMouseEnter={() => setIsHoveringCard(true)}
                                onMouseLeave={() => setIsHoveringCard(false)}
                            >
                                <Link href={`/blog/${slug}`} className="no-underline group h-full block cursor-none">
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
                        </FadeInUp>
                    )
                })}
            </div>

            {/* Custom Mouse Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-[70px] h-[70px] rounded-full bg-[#1e1e20] shadow-2xl flex items-center justify-center pointer-events-none z-[100] border border-white/10"
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
                <ArrowUpRight size={24} className="text-white" />
            </motion.div>
        </section>
    );
}
