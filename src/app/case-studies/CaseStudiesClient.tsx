"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowUpRight, ArrowLeft } from "lucide-react";
import FadeInUp from "@/components/FadeInUp";
import { useLanguage } from "@/context/LanguageContext";
import { CardSkeleton } from "@/components/Skeleton";

import { usePageTitle } from "@/hooks/usePageTitle";

interface CaseStudy {
    id: string;
    title: string;
    title_en?: string;
    slug: string;
    slug_en?: string;
    content: string;
    content_en?: string;
    image_url: string;
    created_at: string;
    status: string;
    category?: string;
    tags?: string[];
    published_at?: string;
}

export default function CaseStudiesClient() {
    const { t, language } = useLanguage();
    usePageTitle("cases.title");
    const [cases, setCases] = useState<CaseStudy[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [isLoading, setIsLoading] = useState(true);

    const fetchCases = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Error fetching case studies:", error);
        } else {
            const fetched = (data as CaseStudy[]) || [];
            setCases(fetched);

            const uniqueCategories = Array.from(new Set(fetched.map(a => a.category).filter((c): c is string => !!c && c.trim() !== "")));
            setCategories(uniqueCategories);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => fetchCases());
    }, [fetchCases]);

    const filteredCases = selectedCategory === "All"
        ? cases
        : cases.filter(c => c.category === selectedCategory);



    const getExcerpt = (html: string, length: number = 120) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || "";
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-6xl mx-auto w-full pt-36">

                <FadeInUp>
                    <Link href="/" className="inline-flex items-center gap-2 text-[#a1a1aa] mb-12 no-underline text-[0.9rem] opacity-70 hover:opacity-100 transition-opacity">
                        <ArrowLeft size={16} /> {t("common.backHome")}
                    </Link>
                </FadeInUp>

                <FadeInUp delay={0.1}>
                    <div className="mb-16">
                        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extralight text-white mb-4">
                            {t("cases.title")}
                        </h1>
                        <p className="text-[#a1a1aa] text-[1.1rem] max-w-[880px] opacity-70">
                            {t("cases.subtitle")}
                        </p>
                    </div>
                </FadeInUp>

                <FadeInUp delay={0.2}>
                    <div className="flex gap-3 mb-12 overflow-x-auto scrollbar-hide w-full">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`shrink-0 px-5 py-2 rounded-full font-medium transition-all duration-200 border ${selectedCategory === "All"
                                ? "bg-[#3333ee] text-white border-transparent"
                                : "bg-white/5 text-[#a1a1aa] border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`shrink-0 px-5 py-2 rounded-full font-medium transition-all duration-200 border ${selectedCategory === category
                                    ? "bg-[#3333ee] text-white border-transparent"
                                    : "bg-white/5 text-[#a1a1aa] border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </FadeInUp>

                {isLoading ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8">
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredCases.length === 0 ? (
                    <div className="text-[#a1a1aa] p-16 text-center">{t("cases.empty")}</div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8">
                        {filteredCases.map((caseStudy, index) => {
                            const title = language === 'en' && caseStudy.title_en ? caseStudy.title_en : caseStudy.title;
                            const content = language === 'en' && caseStudy.content_en ? caseStudy.content_en : caseStudy.content;
                            const slug = language === 'en' && caseStudy.slug_en ? caseStudy.slug_en : caseStudy.slug;

                            return (
                                <FadeInUp key={caseStudy.id} delay={0.2 + (index % 4) * 0.1} className="h-full">
                                    <Link href={`/case-studies/${slug}`} className="no-underline h-full block group">
                                        <article className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:bg-white/[0.05] hover:border-[#333] hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">

                                            <div
                                                className="aspect-video bg-[#222] bg-cover bg-center relative"
                                                style={{ backgroundImage: caseStudy.image_url ? `url(${caseStudy.image_url})` : "none" }}
                                            >
                                                {!caseStudy.image_url && (
                                                    <div className="absolute inset-0 flex items-center justify-center text-[#444]">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <h2 className="text-white group-hover:text-[#3333ee] transition-colors text-[clamp(1rem,3vw,1.2rem)] font-normal mb-4 leading-[1.4]">
                                                    {title}
                                                </h2>

                                                <div className="flex items-center gap-2 text-[#a1a1aa] text-[0.7rem] mb-3 font-mono opacity-50">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        <span>{new Date(caseStudy.published_at || caseStudy.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>

                                                    {caseStudy.category && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-0.5 h-0.5 rounded-full bg-current opacity-50"></span>
                                                            <span>{caseStudy.category}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {caseStudy.tags && caseStudy.tags.length > 0 && (
                                                    <div className="flex gap-2 flex-wrap mb-4">
                                                        {caseStudy.tags.map(tag => (
                                                            <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#18181b] text-[0.7rem] text-[#e4e4e7] border border-[#27272a]">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className="text-[#a1a1aa] text-[clamp(0.8rem,4vw,0.8rem)] leading-relaxed mb-6 flex-1 line-clamp-3">
                                                    {getExcerpt(content)}
                                                </p>

                                                <div className="flex items-center gap-2 text-[#a1a1aa] text-[0.8rem] font-medium mt-auto">
                                                    {t("cases.readCase")} <ArrowUpRight size={16} />
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </FadeInUp>
                            )
                        })}
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
