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
            <section className="w-full max-w-[1200px] mx-auto px-8 py-16">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </section>
        );
    }
    if (articles.length === 0) return null;

    return (
        <section className="w-full max-w-[1200px] mx-auto px-8 py-16">
            {/* Header */}
            <FadeInUp>
                <div className="flex justify-between items-end mb-12 gap-8 flex-wrap">
                    <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-extralight text-white max-w-[700px] leading-tight text-left">
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
                        <FadeInUp key={article.id} delay={0.2 + (index * 0.1)} className="h-full">
                            <div
                                className="h-full"
                                onMouseEnter={() => setIsHoveringCard(true)}
                                onMouseLeave={() => setIsHoveringCard(false)}
                            >
                                <Link href={`/blog/${slug}`} className="no-underline group h-full block cursor-none">
                                    <article className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 ease-out group-hover:bg-white/5 group-hover:border-white/20 group-hover:-translate-y-1">
                                        {/* Image Cover */}
                                        <div
                                            className="aspect-video bg-[#222] bg-cover bg-center relative"
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

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col text-left">
                                            <h3 className="text-white text-[clamp(1.1rem,2.5vw,1.4rem)] font-medium mb-4 leading-snug transition-colors duration-200">
                                                {title}
                                            </h3>

                                            <div className="flex items-center gap-4 font-mono text-[0.9rem] text-zinc-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>

                                                {article.category && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                                                        <span>{article.category}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-[#a1a1aa] text-[0.95rem] leading-relaxed flex-1 line-clamp-3">
                                                {getExcerpt(content)}
                                            </p>
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
