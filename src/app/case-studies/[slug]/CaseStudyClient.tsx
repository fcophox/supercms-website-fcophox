"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "@/components/FadeInUp";
import ArticleLikeSection from "@/components/ArticleLikeSection";

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
    likes?: number;
}

export default function CaseStudyClient() {
    const { t, language } = useLanguage();
    const params = useParams();
    const { slug } = params;

    const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchCaseStudy(slug as string);
        }
    }, [slug]);

    const fetchCaseStudy = async (slugStr: string) => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .or(`slug.eq.${slugStr},slug_en.eq.${slugStr}`)
            .eq('status', 'published')
            .single();

        if (error) {
            console.error("Error fetching case study:", error);
        } else {
            setCaseStudy(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (caseStudy) {
            const currentTitle = language === 'en' && caseStudy.title_en ? caseStudy.title_en : caseStudy.title;
            document.title = `${currentTitle} | fcoPhox`;
        }
    }, [caseStudy, language]);

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                {t("common.loading")}
            </div>
        );
    }

    if (!caseStudy) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Navbar />
                <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
                    <h1 style={{ color: "white" }}>{t("common.error")}</h1>
                    <Link href="/case-studies" className="btn-primary">{t("cases.back")}</Link>
                </main>
                <Footer />
            </div>
        );
    }

    const title = language === 'en' && caseStudy.title_en ? caseStudy.title_en : caseStudy.title;
    const content = language === 'en' && caseStudy.content_en ? caseStudy.content_en : caseStudy.content;

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            <main style={{ flex: 1, padding: "2rem", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
                <article>

                    <FadeInUp>
                        <Link href="/case-studies" style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            opacity: 0.7,
                            color: "var(--text-muted)",
                            marginBottom: "3rem",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            transition: "color 0.2s"
                        }} className="hover:text-white">
                            <ArrowLeft size={16} /> {t("cases.back")}
                        </Link>
                    </FadeInUp>

                    <FadeInUp delay={0.1}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            fontFamily: "monospace",
                            fontSize: "0.9rem",
                            color: "white",
                            marginBottom: "1rem",
                            flexWrap: "wrap",
                            opacity: 0.5,
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Calendar size={16} />
                                <span>{new Date(caseStudy.published_at || caseStudy.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>

                            {caseStudy.category && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "currentColor" }}></span>
                                    <span>{caseStudy.category}</span>
                                </div>
                            )}

                            {caseStudy.tags && caseStudy.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {caseStudy.tags.map(tag => (
                                        <span key={tag} style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '999px',
                                            background: 'rgba(255,255,255,0.08)',
                                            fontSize: '0.8rem',
                                            color: 'rgba(255,255,255,0.9)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </FadeInUp>

                    <FadeInUp delay={0.2}>
                        <h1 style={{
                            fontSize: "clamp(2rem, 5vw, 2.8rem)",
                            fontWeight: "200",
                            color: "white",
                            lineHeight: 1.1,
                            marginBottom: "2rem"
                        }}>
                            {title}
                        </h1>
                    </FadeInUp>

                    {caseStudy.image_url && (
                        <FadeInUp delay={0.3}>
                            <div style={{
                                width: "100%",
                                aspectRatio: "21/9",
                                borderRadius: "16px",
                                overflow: "hidden",
                                marginBottom: "3rem",
                                border: "1px solid #222"
                            }}>
                                <img
                                    src={caseStudy.image_url}
                                    alt={title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        </FadeInUp>
                    )}

                    {/* Content */}
                    <FadeInUp delay={0.4}>
                        <div
                            className="prose text-[#a3a3a3] font-light max-w-[770px] mx-auto text-lg leading-[1.8]
                            [&_h2]:text-white [&_h2]:text-[1.75rem] [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4
                            [&_h3]:text-white [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
                            [&_p]:mb-6
                            [&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:list-disc [&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:list-decimal
                            [&_li]:mb-2
                            [&_strong]:text-white [&_strong]:font-semibold
                            [&_a]:text-[#a78bfa] [&_a]:underline [&_a]:underline-offset-4
                            [&_blockquote]:border-l-4 [&_blockquote]:border-[#a78bfa] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white [&_blockquote]:my-6
                            [&_img]:rounded-xl [&_img]:my-8 [&_img]:max-w-full [&_img]:h-auto [&_img]:block
                            [&_.caption]:text-center [&_.caption]:text-[#a1a1aa] [&_.caption]:text-sm [&_.caption]:italic [&_.caption]:-mt-6 [&_.caption]:mb-8
                            [&_figcaption]:text-center [&_figcaption]:text-[#a1a1aa] [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:-mt-6 [&_figcaption]:mb-8
                            [&_img+p]:text-center [&_img+p]:text-[#94a3b8] [&_img+p]:text-sm [&_img+p]:italic [&_img+p]:-mt-6 [&_img+p]:mb-8 [&_img+p]:opacity-80"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </FadeInUp>

                    {/* Like Section */}
                    <FadeInUp delay={0.5}>
                        <ArticleLikeSection articleId={caseStudy.id} initialLikes={caseStudy.likes || 0} tableName="case_studies" />
                    </FadeInUp>

                </article>
            </main>

            <Footer />
        </div>
    );
}
