"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { supabase } from "@/lib/supabaseClient";
import ImageUploader from "@/components/ImageUploader";
import Modal from "@/components/Modal";
import TagInput from "@/components/TagInput";

export default function NewCaseStudyPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [publishedAt, setPublishedAt] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'error';
        title: string;
        content: string;
    }>({
        isOpen: false,
        type: 'error',
        title: '',
        content: ''
    });

    const handleSave = async (status: 'published' | 'draft') => {
        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('case_studies')
                .insert([
                    {
                        title,
                        slug,
                        category,
                        content,
                        status,
                        image_url: imageUrl,
                        tags: tags,
                        published_at: publishedAt || null
                    }
                ]);

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

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                actions={<button onClick={closeModal} className="btn-primary" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cerrar</button>}
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
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>
                        Crear Nuevo Caso de Estudio
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                        {isSaving ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Title Input */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Slug</label>
                        <input
                            type="text"
                            placeholder="url-amigable"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="input-field"
                            style={{ background: 'rgba(0,0,0,0.2)', border: 'none', padding: '0.75rem', borderRadius: '8px', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Categoría</label>
                            <input
                                type="text"
                                placeholder="Ej: E-commerce, SaaS, Branding"
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
                <TiptapEditor content={content} onChange={setContent} />
            </div>
        </div>
    );
}
