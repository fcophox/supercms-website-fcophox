"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowUpRight, ArrowLeft } from "lucide-react";
import FadeInUp from "@/components/FadeInUp";
import { useLanguage } from "@/context/LanguageContext";

import { usePageTitle } from "@/hooks/usePageTitle";

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
    category?: string;
    tags?: string[];
    published_at?: string;
}

export default function BlogClient() {
    const { t, language } = useLanguage();
    usePageTitle("nav.blog");
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [isLoading, setIsLoading] = useState(true);

    const fetchArticles = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('status', 'published') // Only show published articles
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Error fetching articles:", error);
        } else {
            const fetchedArticles = data || [];
            setArticles(fetchedArticles);

            // Extract unique non-empty categories
            const uniqueCategories = Array.from(new Set(fetchedArticles.map((a: any) => a.category).filter((c: any) => c && c.trim() !== "")));
            setCategories(uniqueCategories as string[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredArticles(articles);
        } else {
            setFilteredArticles(articles.filter(article => article.category === selectedCategory));
        }
    }, [selectedCategory, articles]);



    // Helper to strip HTML and get a snippet
    const getExcerpt = (html: string, length: number = 120) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || "";
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%", paddingTop: "6rem" }}>

                {/* Back Link */}
                <FadeInUp>
                    <Link href="/" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-muted)",
                        marginBottom: "3rem",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        opacity: 0.7,
                    }}>
                        <ArrowLeft size={16} /> {t("common.backHome")}
                    </Link>
                </FadeInUp>

                {/* Header */}
                <FadeInUp delay={0.1}>
                    <div style={{ marginBottom: "4rem", }}>
                        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "200", color: "white", marginBottom: "1rem" }}>
                            {t("blog.title")}
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "880px", opacity: 0.7 }}>
                            {t("blog.subtitle")}
                        </p>
                    </div>
                </FadeInUp>

                {/* Filters */}
                <FadeInUp delay={0.2}>
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "3rem", flexWrap: "wrap" }}>
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`tag-pill ${selectedCategory === "All" ? "active" : ""}`}
                            style={{
                                padding: "0.5rem 1.25rem",
                                borderRadius: "999px",
                                background: selectedCategory === "All" ? "hsl(var(--primary))" : "rgba(255,255,255,0.05)",
                                color: selectedCategory === "All" ? "white" : "var(--text-muted)",
                                border: selectedCategory === "All" ? "none" : "1px solid rgba(255,255,255,0.1)",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`tag-pill ${selectedCategory === category ? "active" : ""}`}
                                style={{
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: "999px",
                                    background: selectedCategory === category ? "hsl(var(--primary))" : "rgba(255,255,255,0.05)",
                                    color: selectedCategory === category ? "white" : "var(--text-muted)",
                                    border: selectedCategory === category ? "none" : "1px solid rgba(255,255,255,0.1)",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </FadeInUp>

                {/* Articles Grid */}
                {isLoading ? (
                    <div style={{ color: "var(--text-muted)", padding: "4rem", textAlign: "center" }}>{t("common.loading")}</div>
                ) : filteredArticles.length === 0 ? (
                    <div style={{ color: "var(--text-muted)", padding: "4rem", textAlign: "center" }}>{t("blog.empty")}</div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                        gap: "2rem"
                    }}>
                        {filteredArticles.map((article, index) => {
                            const title = language === 'en' && article.title_en ? article.title_en : article.title;
                            const content = language === 'en' && article.content_en ? article.content_en : article.content;
                            const slug = language === 'en' && article.slug_en ? article.slug_en : article.slug;

                            return (
                                <FadeInUp key={article.id} delay={0.2 + (index % 4) * 0.1} className="h-full">
                                    <Link href={`/blog/${slug}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
                                        <article className="blog-card">
                                            {/* Image Cover */}
                                            <div style={{
                                                aspectRatio: "16/9",
                                                background: "#222",
                                                backgroundImage: article.image_url ? `url(${article.image_url})` : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                position: "relative"
                                            }}>
                                                {!article.image_url && (
                                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                                <h2 style={{
                                                    color: "white",
                                                    fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                                                    fontWeight: "400",
                                                    marginBottom: "1rem",
                                                    lineHeight: 1.4
                                                }}>
                                                    {title}
                                                </h2>

                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    color: "var(--text-muted)",
                                                    fontSize: "0.80rem",
                                                    marginBottom: "0.75rem",
                                                    fontFamily: "monospace",
                                                    opacity: 0.5,
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                        <Calendar size={14} />
                                                        <span>{new Date(article.published_at || article.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>

                                                    {article.category && (
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "currentColor", opacity: 0.5 }}></span>
                                                            <span>{article.category}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {article.tags && article.tags.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                        {article.tags.map(tag => (
                                                            <span key={tag} style={{
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '8px',
                                                                background: '#18181b', // zinc-900 like
                                                                fontSize: '0.7rem',
                                                                color: '#e4e4e7', // zinc-200
                                                                border: '1px solid #27272a' // zinc-800
                                                            }}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p style={{
                                                    color: "#a1a1aa",
                                                    fontSize: "clamp(0.8rem, 4vw, 0.9rem)",
                                                    lineHeight: 1.6,
                                                    marginBottom: "1.5rem",
                                                    flex: 1,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}>
                                                    {getExcerpt(content)}
                                                </p>

                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    color: "var(--text-muted)",
                                                    fontSize: "0.9rem",
                                                    fontWeight: 500,
                                                    marginTop: "auto"
                                                }}>
                                                    {t("blog.readArticle")} <ArrowUpRight size={16} />
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
            <style jsx global>{`
                .blog-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                }
                .blog-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-4px);
                }
            `}</style>
        </div>
    );
}
