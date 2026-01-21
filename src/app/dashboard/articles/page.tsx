"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Switch } from "@/components/ui/Switch";

export default function ArticlesPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { articlesVisible, updateSetting } = useSiteSettings();

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching articles:", error);
        } else {
            setArticles(data || []);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
                        Artículos
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>Administra tus publicaciones y contenido.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                        <Switch
                            checked={articlesVisible}
                            onChange={(checked) => updateSetting("articles_visible", checked)}
                            label={articlesVisible ? "Visible en web" : "Oculto en web"}
                        />
                    </div>
                    <Link href="/dashboard/articles/new" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                        + Nuevo Artículo
                    </Link>
                </div>
            </header>

            {isLoading ? (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "4rem" }}>Cargando artículos...</div>
            ) : articles.length === 0 ? (
                <div className="glass-panel" style={{
                    padding: "4rem 2rem",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    minHeight: "400px"
                }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "rgba(139, 92, 246, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1.5rem",
                        fontSize: "2rem"
                    }}>
                        📝
                    </div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
                        No hay artículos aún
                    </h3>
                    <p style={{ color: "var(--text-muted)", maxWidth: "400px", marginBottom: "2rem" }}>
                        Comienza creando tu primer artículo. Aparecerá aquí una vez que publiques o guardes un borrador.
                    </p>
                    <Link href="/dashboard/articles/new" className="btn-primary">
                        Crear tu primer Artículo
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {articles.map((article) => (
                        <Link href={`/dashboard/articles/${article.id}`} key={article.id} className="glass-panel" style={{
                            borderRadius: "12px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            cursor: "pointer",
                            textDecoration: 'none'
                        }}>
                            <div style={{
                                height: "180px",
                                backgroundColor: "#2d2d35",
                                backgroundImage: article.image_url ? `url(${article.image_url})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                {!article.image_url && <span style={{ fontSize: "2rem" }}>🖼️</span>}
                            </div>

                            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                <h3 style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "bold",
                                    color: "white",
                                    marginBottom: "0.5rem",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}>
                                    {article.title}
                                </h3>
                                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{
                                        fontSize: "0.75rem",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "20px",
                                        background: article.status === 'published' ? "rgba(6, 182, 212, 0.1)" : "rgba(255, 255, 255, 0.1)",
                                        color: article.status === 'published' ? "#67e8f9" : "var(--text-muted)",
                                        fontWeight: 500
                                    }}>
                                        {article.status === 'published' ? 'Publicado' : 'Borrador'}
                                    </span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
