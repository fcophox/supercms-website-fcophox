"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowUpRight, ArrowLeft } from "lucide-react";
import FadeInUp from "@/components/FadeInUp";
import { useLanguage } from "@/context/LanguageContext";
import { CardSkeleton } from "@/components/Skeleton";

import { usePageTitle } from "@/hooks/usePageTitle";

interface Service {
    id: string;
    title: string;
    title_en?: string;
    slug: string;
    slug_en?: string;
    content: string;
    content_en?: string;
    image_url: string;
    created_at: string;
    category?: string;
    tags?: string[];
    published_at?: string;
}

export default function ServicesClient() {
    const { t, language } = useLanguage();
    usePageTitle("nav.services");
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [isLoading, setIsLoading] = useState(true);

    const fetchServices = async () => {
        setIsLoading(true);
        // Services table usually doesn't have 'status' based on previous context, 
        // if it does in future, add .eq('status', 'published')
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Error fetching services:", error);
        } else {
            const fetched = data || [];
            setServices(fetched);

            const uniqueCategories = Array.from(new Set(fetched.map((a: any) => a.category).filter((c: any) => c && c.trim() !== "")));
            setCategories(uniqueCategories as string[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredServices(services);
        } else {
            setFilteredServices(services.filter(s => s.category === selectedCategory));
        }
    }, [selectedCategory, services]);



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

                <FadeInUp delay={0.1}>
                    <div style={{ marginBottom: "4rem", }}>
                        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "200", color: "white", marginBottom: "1rem" }}>
                            {t("services.title")}
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "880px", opacity: 0.7 }}>
                            {t("services.subtitle")}
                        </p>
                    </div>
                </FadeInUp>

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

                {isLoading ? (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                        gap: "2rem"
                    }}>
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div style={{ color: "var(--text-muted)", padding: "4rem", textAlign: "center" }}>{t("services.empty")}</div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                        gap: "2rem"
                    }}>
                        {filteredServices.map((service, index) => {
                            const title = language === 'en' && service.title_en ? service.title_en : service.title;
                            const content = language === 'en' && service.content_en ? service.content_en : service.content;
                            const slug = language === 'en' && service.slug_en ? service.slug_en : service.slug;

                            return (
                                <FadeInUp key={service.id} delay={0.2 + (index % 4) * 0.1} className="h-full">
                                    <Link href={`/services/${slug}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
                                        <article style={{
                                            background: "#111",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            border: "1px solid #222",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            transition: "transform 0.2s, box-shadow 0.2s",
                                        }} className="blog-card">

                                            <div style={{
                                                aspectRatio: "16/9",
                                                background: "#222",
                                                backgroundImage: service.image_url ? `url(${service.image_url})` : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                position: "relative"
                                            }}>
                                                {!service.image_url && (
                                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                                <h2 style={{
                                                    color: "white",
                                                    fontSize: "clamp(1.2rem, 4vw, 2.2rem)",
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
                                                        <span>{new Date(service.published_at || service.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>

                                                    {service.category && (
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "currentColor", opacity: 0.5 }}></span>
                                                            <span>{service.category}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {service.tags && service.tags.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                        {service.tags.map(tag => (
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
                                                    fontSize: "0.95rem",
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
                                                    {t("services.view")} <ArrowUpRight size={16} />
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
                .blog-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                    border-color: #333 !important;
                }
                .blog-card:hover h2 {
                    color: hsl(var(--primary)) !important;
                }
            `}</style>
        </div>
    );
}
