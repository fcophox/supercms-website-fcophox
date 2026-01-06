"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { supabase } from "@/lib/supabaseClient";
import ImageUploader from "@/components/ImageUploader";
import Modal from "@/components/Modal";
import TagInput from "@/components/TagInput";

export default function EditCaseStudyPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    // Spanish / Default State
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");

    // English State
    const [titleEn, setTitleEn] = useState("");
    const [slugEn, setSlugEn] = useState("");
    const [contentEn, setContentEn] = useState("");

    // Shared State
    const [imageUrl, setImageUrl] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [publishedAt, setPublishedAt] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<'es' | 'en'>('es');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'translate' | 'delete' | 'error';
        title: string;
        content: string;
    }>({
        isOpen: false,
        type: 'translate',
        title: '',
        content: ''
    });

    useEffect(() => {
        if (id) {
            fetchData(id as string);
        }
    }, [id]);

    const fetchData = async (itemId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .eq('id', itemId)
            .single();

        if (error) {
            console.error("Error fetching case study:", error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                content: `Error al cargar o caso no encontrado: ${error.message}`
            });
        } else if (data) {
            // Load ES data
            setTitle(data.title || "");
            setSlug(data.slug || "");
            setCategory(data.category || "");
            setContent(data.content || "");

            // Load EN data
            setTitleEn(data.title_en || "");
            setSlugEn(data.slug_en || "");
            setContentEn(data.content_en || "");

            setImageUrl(data.image_url || "");
            setTags(data.tags || []);
            setPublishedAt(data.published_at ? data.published_at.split('T')[0] : "");
        }
        setLoading(false);
    };

    // Auto-save logic
    useEffect(() => {
        if (loading) return;

        const timer = setTimeout(async () => {
            if (id) {
                await autoSave();
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [title, content, slug, titleEn, contentEn, slugEn, imageUrl]);

    const autoSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('case_studies')
                .update({
                    title,
                    content,
                    slug,
                    title_en: titleEn,
                    content_en: contentEn,
                    slug_en: slugEn,
                    image_url: imageUrl,
                    updated_at: new Date(),
                    category,
                    tags: tags,
                    published_at: publishedAt || null
                })
                .eq('id', id);

            if (error) {
                console.error("Auto-save error:", error);
            } else {
                setLastSaved(new Date());
            }
        } catch (err) {
            console.error("Auto-save unexpected error:", err);
        } finally {
            setIsSaving(false);
        }
    }

    const handleSave = async (status: 'published' | 'draft') => {
        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('case_studies')
                .update({
                    title,
                    content,
                    status,
                    image_url: imageUrl,
                    slug,
                    title_en: titleEn,
                    content_en: contentEn,
                    slug_en: slugEn,
                    updated_at: new Date(),
                    category,
                    tags: tags,
                    published_at: publishedAt || null
                })
                .eq('id', id);

            if (error) {
                console.error("Error saving case study:", error);
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Error al Guardar',
                    content: error.message
                });
            } else {
                router.push("/dashboard/case-studies");
            }
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error Inesperado',
                content: err.message || "Ocurrió un error desconocido"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const [isTranslating, setIsTranslating] = useState(false);

    const confirmTranslate = () => {
        setModal({
            isOpen: true,
            type: 'translate',
            title: 'Confirmar Traducción',
            content: 'Esto utilizará un servicio automatizado para traducir el contenido del español al inglés. El contenido actual en inglés será sobrescrito. ¿Desea continuar?'
        });
    };

    const executeTranslate = async () => {
        setIsTranslating(true);
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    slug,
                    text: content
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la traducción');
            }

            const data = await response.json();

            setTitleEn(data.title);
            setSlugEn(data.slug);
            setContentEn(data.content);

            closeModal();

        } catch (error: any) {
            console.error("Translation error:", error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error de Traducción',
                content: error.message
            });
        } finally {
            setIsTranslating(false);
        }
    };

    const confirmDelete = () => {
        setModal({
            isOpen: true,
            type: 'delete',
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar este caso de estudio? Esta acción no se puede deshacer.'
        });
    }

    const executeDelete = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('case_studies')
                .delete()
                .eq('id', id);

            if (error) {
                console.error("Error deleting case study:", error);
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Error al Eliminar',
                    content: error.message
                });
            } else {
                router.push("/dashboard/case-studies");
            }
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error Inesperado',
                content: err.message || "Ocurrió un error desconocido"
            });
        } finally {
            setIsSaving(false);
            closeModal();
        }
    };

    const closeModal = () => {
        if (isTranslating) return;
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    const renderModalActions = () => {
        if (modal.type === 'translate') {
            return (
                <>
                    <button
                        onClick={closeModal}
                        disabled={isTranslating}
                        style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: isTranslating ? 'not-allowed' : 'pointer', opacity: isTranslating ? 0.5 : 1 }}>
                        Cancelar
                    </button>
                    <button
                        onClick={executeTranslate}
                        className="btn-primary"
                        disabled={isTranslating}
                        style={{ padding: '0.5rem 1rem', cursor: isTranslating ? 'not-allowed' : 'pointer', opacity: isTranslating ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isTranslating ? (
                            <>
                                <span className="animate-spin">⏳</span> Traduciendo...
                            </>
                        ) : (
                            'Continuar'
                        )}
                    </button>
                </>
            );
        } else if (modal.type === 'delete') {
            return (
                <>
                    <button onClick={closeModal} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={executeDelete} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer' }}>Eliminar</button>
                </>
            );
        } else {
            return (
                <button onClick={closeModal} className="btn-primary" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cerrar</button>
            );
        }
    };


    if (loading) {
        return <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Cargando caso de estudio...</div>;
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                actions={renderModalActions()}
            >
                {modal.content}
            </Modal>

            <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/dashboard/case-studies" style={{
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.25rem',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)'
                    }}>
                        ←
                    </Link>
                    <div>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>
                            Editar Caso de Estudio
                        </h1>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isSaving ? (
                                <span style={{ color: '#eab308' }}>Guardando cambios...</span>
                            ) : lastSaved ? (
                                <span style={{ color: '#22c55e' }}>Guardado a las {lastSaved.toLocaleTimeString()}</span>
                            ) : (
                                <span>Cambios guardados</span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={confirmDelete}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        disabled={isSaving}
                        title="Eliminar Caso"
                    >
                        🗑️
                    </button>
                    <button
                        className="btn-primary"
                        style={{ background: 'transparent', border: '1px solid var(--border)' }}
                        onClick={() => handleSave('draft')}
                        disabled={isSaving}
                    >
                        Borrador
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => handleSave('published')}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Language Switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '8px' }}>
                        <button
                            onClick={() => setLanguage('es')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: 'none',
                                background: language === 'es' ? 'var(--primary)' : 'transparent',
                                color: language === 'es' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Español
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: 'none',
                                background: language === 'en' ? 'var(--primary)' : 'transparent',
                                color: language === 'en' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            English
                        </button>
                    </div>

                    {language === 'en' && (
                        <button
                            onClick={confirmTranslate}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid var(--primary)',
                                background: 'rgba(139, 92, 246, 0.1)',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            ✨ Traducir desde Español
                        </button>
                    )}
                </div>

                {/* Shared Image Section */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                    />
                </div>

                {/* Dynamic Content Section */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {language === 'es' ? (
                        <>
                            <input
                                type="text"
                                placeholder="Título del Caso..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Slug (Español)</label>
                                <input
                                    type="text"
                                    placeholder="url-amigable"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="input-field"
                                    style={{ background: 'rgba(0,0,0,0.2)', border: 'none', padding: '0.75rem', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Case Study Title..."
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Slug (English)</label>
                                <input
                                    type="text"
                                    placeholder="friendly-url"
                                    value={slugEn}
                                    onChange={(e) => setSlugEn(e.target.value)}
                                    className="input-field"
                                    style={{ background: 'rgba(0,0,0,0.2)', border: 'none', padding: '0.75rem', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: "1rem", borderTop: "1px solid var(--glass-border)", paddingTop: "1rem" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Categoría (Compartida)</label>
                            <input
                                type="text"
                                placeholder="Ej: E-commerce, SaaS"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input-field"
                                style={{ background: 'rgba(0,0,0,0.2)', border: 'none', padding: '0.75rem', borderRadius: '8px', color: 'white' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fecha de Publicación</label>
                            <input
                                type="date"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                                className="input-field"
                                style={{
                                    background: 'rgba(0,0,0,0.2)',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    color: 'white',
                                    colorScheme: 'dark'
                                }}
                            />
                        </div>
                    </div>

                    <TagInput
                        tags={tags}
                        onChange={setTags}
                        placeholder="Escribe una etiqueta y presiona Enter..."
                        label="Etiquetas Asociadas"
                    />
                </div>

                {/* Editor */}
                {language === 'es' ? (
                    <TiptapEditor
                        key="editor-es" // Force re-render on switch
                        content={content}
                        onChange={setContent}
                    />
                ) : (
                    <TiptapEditor
                        key="editor-en"
                        content={contentEn}
                        onChange={setContentEn}
                    />
                )}
            </div>
        </div>
    );
}
