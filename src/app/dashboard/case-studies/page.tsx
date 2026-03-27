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
        <div className="pb-8 max-w-full">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-normal text-neutral-100 mb-1">
                        Casos de Estudio
                    </h1>
                    <p className="text-sm text-neutral-400">Administra tus casos de éxito y proyectos.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-[#0a0a0a] py-3 px-4 rounded-full border border-neutral-800">
                        <Switch
                            checked={caseStudiesVisible}
                            onChange={(checked) => updateSetting("case_studies_visible", checked)}
                            label={caseStudiesVisible ? "Visible en web" : "Oculto en web"}
                        />
                    </div>
                    <Link href="/dashboard/case-studies/new" className="btn-primary py-2 px-6 text-sm">
                        + Crear
                    </Link>
                </div>
            </header>

            {isLoading ? (
                <div className="text-sm text-neutral-400 text-center p-16">Cargando casos de estudio...</div>
            ) : items.length === 0 ? (
                <div className="border border-neutral-800 bg-[#0a0a0a] py-16 px-8 rounded-lg flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 text-2xl opacity-80">
                        💼
                    </div>
                    <h3 className="text-lg font-normal text-neutral-100 mb-2">
                        No hay casos de estudio aún
                    </h3>
                    <p className="text-sm text-neutral-400 max-w-[400px] mb-8">
                        Comienza documentando tu primer caso de éxito.
                    </p>
                    <Link href="/dashboard/case-studies/new" className="btn-primary py-2 px-6 text-sm">
                        Crear primer Caso
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
                    {items.map((item) => (
                        <Link
                            href={`/dashboard/case-studies/${item.id}`}
                            key={item.id}
                            className="border border-neutral-800 bg-[#0a0a0a] rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:border-neutral-700 cursor-pointer no-underline group"
                        >
                            <div
                                className="h-[120px] bg-neutral-900 border-b border-neutral-800 bg-cover bg-center flex items-center justify-center"
                                style={{
                                    backgroundImage: item.image_url ? `url(${item.image_url})` : "none",
                                }}
                            >
                                {!item.image_url && <span className="text-3xl opacity-30">🖼️</span>}
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-sm font-medium text-neutral-200 mb-4 line-clamp-2">
                                    {item.title}
                                </h3>
                                <div className="mt-auto flex justify-between items-center">
                                    <span className={`text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider font-medium ${item.status === 'published'
                                        ? "bg-neutral-800 text-neutral-300"
                                        : "bg-transparent border border-neutral-800 text-neutral-500"
                                        }`}>
                                        {item.status === 'published' ? 'Publicado' : 'Borrador'}
                                    </span>
                                    <span className="text-xs text-neutral-500">
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
