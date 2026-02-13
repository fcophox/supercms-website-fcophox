"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { supabase } from "@/lib/supabaseClient";
import ImageUploader from "@/components/ImageUploader";
import Modal from "@/components/Modal";
import TagInput from "@/components/TagInput";

export default function NewServicePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [publishedAt, setPublishedAt] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Downloadable Resource State
    const [downloadTitle, setDownloadTitle] = useState("");
    const [downloadDescription, setDownloadDescription] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [downloadType, setDownloadType] = useState<"banner" | "material">("material");
    const [isUploading, setIsUploading] = useState(false);

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `services/${fileName}`;

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
        } catch (error: any) {
            console.error('Error uploading file:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error de Carga',
                content: `No se pudo subir el archivo: ${error.message}`
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('services')
                .insert([
                    {
                        title,
                        slug,
                        category,
                        content,
                        image_url: imageUrl,
                        tags: tags,
                        published_at: publishedAt || null,

                        // New fields
                        download_title: downloadTitle,
                        download_description: downloadDescription,
                        download_url: downloadUrl,
                        download_type: downloadType
                    }
                ]);

            if (error) {
                console.error("Error saving service:", error);
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Error al Guardar',
                    content: error.message
                });
            } else {
                router.push("/dashboard/services");
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
        <div className="max-w-[900px] mx-auto">
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                actions={<button onClick={closeModal} className="btn-primary px-4 py-2 cursor-pointer">Cerrar</button>}
            >
                {modal.content}
            </Modal>

            <header className="mb-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/services" className="text-[var(--text-muted)] flex items-center text-xl p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        ←
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        Crear Nuevo Servicio
                    </h1>
                </div>

                <button
                    className="btn-primary"
                    onClick={() => handleSave()}
                    disabled={isSaving}
                >
                    {isSaving ? 'Guardando...' : 'Guardar Servicio'}
                </button>
            </header>

            <div className="flex flex-col gap-6">
                {/* Title Input */}
                <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del Servicio..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent border-none text-4xl font-bold text-white outline-none placeholder:text-white/20"
                    />
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-[var(--text-muted)] text-sm">Slug</label>
                        <input
                            type="text"
                            placeholder="url-amigable"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="input-field bg-black/20 border-none p-3 rounded-lg text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[var(--text-muted)] text-sm">Categoría</label>
                            <input
                                type="text"
                                placeholder="Ej: Consultoría, Desarrollo, Auditoría"
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
                            placeholder="Ej: Brochure del Servicio"
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
                <TiptapEditor content={content} onChange={setContent} />
            </div>
        </div>
    );
}
