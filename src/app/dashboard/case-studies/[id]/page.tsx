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
    const params = useParams() as { id: string };
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

    // Downloadable Resource State
    const [downloadTitle, setDownloadTitle] = useState("");
    const [downloadDescription, setDownloadDescription] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [downloadType, setDownloadType] = useState<"banner" | "material">("material");
    const [isUploading, setIsUploading] = useState(false);

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

                // Load Download Data
                setDownloadTitle(data.download_title || "");
                setDownloadDescription(data.download_description || "");
                setDownloadUrl(data.download_url || "");
                setDownloadType(data.download_type || "material");
            }
            setLoading(false);
        };

        if (id) {
            fetchData(id);
        }
    }, [id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `case_studies/${fileName}`;

        setIsUploading(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            setDownloadUrl(data.publicUrl);
        } catch (error: unknown) {
            console.error('Error uploading file:', error);
            const message = error instanceof Error ? error.message : "Unknown error";
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error de Carga',
                content: `No se pudo subir el archivo: ${message}`
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Auto-save logic
    useEffect(() => {
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
                        published_at: publishedAt || null,

                        // New fields
                        download_title: downloadTitle,
                        download_description: downloadDescription,
                        download_url: downloadUrl,
                        download_type: downloadType
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

        if (loading) return;

        const timer = setTimeout(async () => {
            if (id) {
                await autoSave();
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [id, loading, title, content, slug, titleEn, contentEn, slugEn, imageUrl, tags, publishedAt, category, downloadTitle, downloadDescription, downloadUrl, downloadType]);

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
                    published_at: publishedAt || null,

                    // New fields
                    download_title: downloadTitle,
                    download_description: downloadDescription,
                    download_url: downloadUrl,
                    download_type: downloadType
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
        } catch (err: unknown) {
            console.error("Unexpected error:", err);
            const message = err instanceof Error ? err.message : "Ocurrió un error desconocido";
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error Inesperado',
                content: message
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
            content: 'Se traducirá el contenido del español al inglés automáticamente. El contenido actual en inglés será sobrescrito. ¿Desea continuar?'
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

        } catch (error: unknown) {
            console.error("Translation error:", error);
            const message = error instanceof Error ? error.message : "Unknown error";
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error de Traducción',
                content: message
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
        } catch (err: unknown) {
            console.error("Unexpected error:", err);
            const message = err instanceof Error ? err.message : "Ocurrió un error desconocido";
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error Inesperado',
                content: message
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
        <div className="max-w-[900px] mx-auto">
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                actions={renderModalActions()}
            >
                {modal.content}
            </Modal>

            <header className="mb-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/case-studies" className="text-[var(--text-muted)] flex items-center text-xl p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Editar Caso de Estudio
                        </h1>
                        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                            {isSaving ? (
                                <span className="text-yellow-500">Guardando cambios...</span>
                            ) : lastSaved ? (
                                <span className="text-green-500">Guardado a las {lastSaved.toLocaleTimeString()}</span>
                            ) : (
                                <span>Cambios guardados</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={confirmDelete}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center justify-center hover:bg-red-500/20"
                        disabled={isSaving}
                        title="Eliminar Caso"
                    >
                        🗑️
                    </button>
                    <button
                        className="btn-primary bg-transparent border border-[var(--border)]"
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

            <div className="flex flex-col gap-6">

                {/* Language Switcher */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                        <button
                            onClick={() => setLanguage('es')}
                            className={`px-4 py-2 rounded-md border-none cursor-pointer font-medium transition-all ${language === 'es' ? 'bg-[var(--primary)] text-white' : 'bg-transparent text-[var(--text-muted)] hover:text-white'
                                }`}
                        >
                            Español
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-4 py-2 rounded-md border-none cursor-pointer font-medium transition-all ${language === 'en' ? 'bg-[var(--primary)] text-white' : 'bg-transparent text-[var(--text-muted)] hover:text-white'
                                }`}
                        >
                            English
                        </button>
                    </div>

                    {language === 'en' && (
                        <button
                            onClick={confirmTranslate}
                            className="px-4 py-2 rounded-md border border-[var(--primary)] bg-violet-500/10 text-[var(--primary)] cursor-pointer text-sm hover:bg-violet-500/20"
                        >
                            ✨ Traducir desde Español
                        </button>
                    )}
                </div>

                {/* Shared Image Section */}
                <div className="glass-panel p-6 rounded-xl">
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                    />
                </div>

                {/* Dynamic Content Section */}
                <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">

                    {language === 'es' ? (
                        <>
                            <input
                                type="text"
                                placeholder="Título del Caso..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent border-none text-4xl font-bold text-white outline-none placeholder:text-white/20"
                            />
                            <div className="flex flex-col gap-2">
                                <label className="text-[var(--text-muted)] text-sm">Slug (Español)</label>
                                <input
                                    type="text"
                                    placeholder="url-amigable"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="input-field bg-black/20 border-none p-3 rounded-lg text-white"
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
                                className="w-full bg-transparent border-none text-4xl font-bold text-white outline-none placeholder:text-white/20"
                            />
                            <div className="flex flex-col gap-2">
                                <label className="text-[var(--text-muted)] text-sm">Slug (English)</label>
                                <input
                                    type="text"
                                    placeholder="friendly-url"
                                    value={slugEn}
                                    onChange={(e) => setSlugEn(e.target.value)}
                                    className="input-field bg-black/20 border-none p-3 rounded-lg text-white"
                                />
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                        <div className="flex flex-col gap-2">
                            <label className="text-[var(--text-muted)] text-sm">Categoría (Compartida)</label>
                            <input
                                type="text"
                                placeholder="Ej: E-commerce, SaaS"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input-field bg-black/20 border-none p-3 rounded-lg text-white"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[var(--text-muted)] text-sm">Fecha de Publicación</label>
                            <input
                                type="date"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                                className="input-field bg-black/20 border-none p-3 rounded-lg text-white dark:[color-scheme:dark]"
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

                {/* Downloadable Resource Section */}
                <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>📥</span> Recurso Descargable (PDF)
                    </h3>

                    <div className="flex flex-col gap-2">
                        <label className="text-[var(--text-muted)] text-sm">Tipo de Recurso</label>
                        <div className="flex gap-4 bg-black/20 p-2 rounded-lg">
                            <label className="flex items-center gap-2 cursor-pointer text-white">
                                <input
                                    type="radio"
                                    name="downloadType"
                                    value="material"
                                    checked={downloadType === 'material'}
                                    onChange={(e) => setDownloadType(e.target.value as "material" | "banner")}
                                />
                                Material
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-white">
                                <input
                                    type="radio"
                                    name="downloadType"
                                    value="banner"
                                    checked={downloadType === 'banner'}
                                    onChange={(e) => setDownloadType(e.target.value as "material" | "banner")}
                                />
                                Banner
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[var(--text-muted)] text-sm">Título del Documento</label>
                        <input
                            type="text"
                            placeholder="Ej: Guía del Proyecto"
                            value={downloadTitle}
                            onChange={(e) => setDownloadTitle(e.target.value)}
                            className="input-field bg-black/20 border-none p-3 rounded-lg text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[var(--text-muted)] text-sm">Descripción Corta</label>
                        <input
                            type="text"
                            placeholder="Breve descripción del contenido del PDF..."
                            value={downloadDescription}
                            onChange={(e) => setDownloadDescription(e.target.value)}
                            className="input-field bg-black/20 border-none p-3 rounded-lg text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[var(--text-muted)] text-sm">Archivo PDF</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-lg cursor-pointer text-[var(--text-muted)] transition-all hover:bg-white/10 hover:border-white/40">
                                <span>📄 Examinar...</span>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                    disabled={isUploading}
                                />
                            </label>
                            {isUploading && <span className="text-[var(--primary)] text-sm">Subiendo...</span>}
                            {downloadUrl && (
                                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-md">
                                    <span className="text-green-500 text-sm">✓ Archivo cargado</span>
                                    <button
                                        onClick={() => setDownloadUrl("")}
                                        className="bg-none border-none text-red-500 cursor-pointer ml-2 hover:text-red-400"
                                        title="Eliminar archivo"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                        {downloadUrl && (
                            <div className="text-xs text-[var(--text-muted)] break-all">
                                URL: {downloadUrl}
                            </div>
                        )}
                    </div>
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
