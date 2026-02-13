"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Switch } from "@/components/ui/Switch";

interface CaseStudy {
    id: string;
    title: string;
    image_url?: string;
    status: string;
    created_at: string;
}

export default function CaseStudiesPage() {
    const [items, setItems] = useState<CaseStudy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { caseStudiesVisible, updateSetting } = useSiteSettings();

    useEffect(() => {
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

        fetchItems();
    }, []);



    return (
        <div>
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Casos de Estudio
                    </h1>
                    <p className="text-[var(--text-muted)]">Administra tus casos de éxito y proyectos.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 py-2 px-4 rounded-lg border border-white/10">
                        <Switch
                            checked={caseStudiesVisible}
                            onChange={(checked) => updateSetting("case_studies_visible", checked)}
                            label={caseStudiesVisible ? "Visible en web" : "Oculto en web"}
                        />
                    </div>
                    <Link href="/dashboard/case-studies/new" className="btn-primary py-2 px-4 text-sm">
                        + Nuevo Caso
                    </Link>
                </div>
            </header>

            {isLoading ? (
                <div className="text-[var(--text-muted)] text-center p-16">Cargando casos de estudio...</div>
            ) : items.length === 0 ? (
                <div className="glass-panel py-16 px-8 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mb-6 text-3xl">
                        💼
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        No hay casos de estudio aún
                    </h3>
                    <p className="text-[var(--text-muted)] max-w-[400px] mb-8">
                        Comienza documentando tu primer caso de éxito.
                    </p>
                    <Link href="/dashboard/case-studies/new" className="btn-primary">
                        Crear primer Caso
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                    {items.map((item) => (
                        <Link
                            href={`/dashboard/case-studies/${item.id}`}
                            key={item.id}
                            className="glass-panel rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer no-underline group"
                        >
                            <div
                                className="h-[180px] bg-[#2d2d35] bg-cover bg-center flex items-center justify-center"
                                style={{
                                    backgroundImage: item.image_url ? `url(${item.image_url})` : "none",
                                }}
                            >
                                {!item.image_url && <span className="text-3xl">🖼️</span>}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                    {item.title}
                                </h3>
                                <div className="mt-auto flex justify-between items-center">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${item.status === 'published'
                                        ? "bg-cyan-400/10 text-cyan-300"
                                        : "bg-white/10 text-[var(--text-muted)]"
                                        }`}>
                                        {item.status === 'published' ? 'Publicado' : 'Borrador'}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)]">
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
