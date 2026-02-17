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
import { PostSkeleton } from "@/components/Skeleton";

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
    status: string;
    tags?: string[];
    published_at?: string;
    likes: number; // Added likes field
}

export default function BlogPostClient() {
    const { t, language } = useLanguage();
    const params = useParams();
    const { slug } = params;

    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchArticle = async (slugStr: string) => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .or(`slug.eq.${slugStr},slug_en.eq.${slugStr}`)
            .eq('status', 'published')
            .single();

        if (error) {
            console.error("Error fetching article:", error);
        } else {
            setArticle(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (slug) {
            fetchArticle(slug as string);
        }
    }, [slug]);



    useEffect(() => {
        if (article) {
            const currentTitle = language === 'en' && article.title_en ? article.title_en : article.title;
            document.title = `${currentTitle} | fcoPhox`;
        }
    }, [article, language]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full pt-24">
                    <PostSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center gap-4">
                    <h1 className="text-white">{t("common.error")}</h1>
                    <Link href="/blog" className="btn-primary">{t("blog.back")}</Link>
                </main>
                <Footer />
            </div>
        );
    }

    const title = language === 'en' && article.title_en ? article.title_en : article.title;
    const content = language === 'en' && article.content_en ? article.content_en : article.content;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full pt-24">
                <article>

                    {/* Back Link */}
                    <FadeInUp>
                        <Link href="/blog" className="inline-flex items-center gap-2 opacity-70 text-[#a1a1aa] mb-12 no-underline text-sm transition-colors duration-200 hover:text-white">
                            <ArrowLeft size={16} /> {t("blog.back")}
                        </Link>
                    </FadeInUp>

                    {/* Meta */}
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
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(article.published_at || article.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>

                            {article.tags && article.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {article.tags.map(tag => (
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

                    {/* Title */}
                    <FadeInUp delay={0.2}>
                        <h1 className="text-[clamp(2rem,5vw,2.8rem)] font-extralight text-white leading-[1.1] mb-8">
                            {title}
                        </h1>
                    </FadeInUp>

                    {/* Featured Image */}
                    {article.image_url && (
                        <FadeInUp delay={0.3}>
                            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-[#222]">
                                <img
                                    src={article.image_url}
                                    alt={title}
                                    className="w-full h-full object-cover"
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
                        <ArticleLikeSection articleId={article.id} initialLikes={article.likes || 0} />
                    </FadeInUp>
                </article>
            </main>

            <Footer />
        </div>
    );
}
