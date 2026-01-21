"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Switch } from "@/components/ui/Switch";

export default function CaseStudiesPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { caseStudiesVisible, updateSetting } = useSiteSettings();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching case studies:", error);
        } else {
            setItems(data || []);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
                        Casos de Estudio
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>Administra tus casos de éxito y proyectos.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                        <Switch
                            checked={caseStudiesVisible}
                            onChange={(checked) => updateSetting("case_studies_visible", checked)}
                            label={caseStudiesVisible ? "Visible en web" : "Oculto en web"}
                        />
                    </div>
                    <Link href="/dashboard/case-studies/new" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                        + Nuevo Caso
                    </Link>
                </div>
            </header>

            {isLoading ? (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "4rem" }}>Cargando casos de estudio...</div>
            ) : items.length === 0 ? (
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
                        💼
                    </div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
                        No hay casos de estudio aún
                    </h3>
                    <p style={{ color: "var(--text-muted)", maxWidth: "400px", marginBottom: "2rem" }}>
                        Comienza documentando tu primer caso de éxito.
                    </p>
                    <Link href="/dashboard/case-studies/new" className="btn-primary">
                        Crear primer Caso
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {items.map((item) => (
                        <Link href={`/dashboard/case-studies/${item.id}`} key={item.id} className="glass-panel" style={{
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
                                backgroundImage: item.image_url ? `url(${item.image_url})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                {!item.image_url && <span style={{ fontSize: "2rem" }}>🖼️</span>}
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
                                    {item.title}
                                </h3>
                                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{
                                        fontSize: "0.75rem",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "20px",
                                        background: item.status === 'published' ? "rgba(6, 182, 212, 0.1)" : "rgba(255, 255, 255, 0.1)",
                                        color: item.status === 'published' ? "#67e8f9" : "var(--text-muted)",
                                        fontWeight: 500
                                    }}>
                                        {item.status === 'published' ? 'Publicado' : 'Borrador'}
                                    </span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                        {new Date(item.created_at).toLocaleDateString()}
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
