"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import './styles.css'
import { useRef, useState } from 'react'

const ToolbarButton = ({
    onClick,
    isActive,
    children
}: {
    onClick: () => void,
    isActive?: boolean,
    children: React.ReactNode
}) => (
    <button
        type="button"
        onClick={onClick}
        className={isActive ? 'is-active' : ''}
        style={{
            padding: '0.4rem',
            borderRadius: '6px',
            border: 'none',
            background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: isActive ? 'hsl(var(--primary))' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
        }}
    >
        {children}
    </button>
)

export default function TiptapEditor({ content, onChange }: { content?: string, onChange?: (html: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState("");
    const [altText, setAltText] = useState("");
    const [caption, setCaption] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Escribe algo increíble...',
            }),
            Image,
        ],
        immediatelyRender: false,
        content: content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert focus:outline-none',
                style: 'min-height: 400px; padding: 1rem; color: #e2e8f0;'
            },
        },
    })

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !editor) return

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('article-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('article-images').getPublicUrl(filePath)

            if (data) {
                setTempImageUrl(data.publicUrl);
                setShowImageModal(true);
            }
        } catch (error: any) {
            alert(`Error uploading image: ${error.message}`)
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    const insertImage = () => {
        if (editor && tempImageUrl) {
            editor.chain().focus().setImage({ src: tempImageUrl, alt: altText }).run();

            if (caption) {
                editor.chain().focus().createParagraphNear().insertContent(caption).toggleItalic().run();
            }
        }
        closeModal();
    }

    const closeModal = () => {
        setShowImageModal(false);
        setTempImageUrl("");
        setAltText("");
        setCaption("");
    }

    if (!editor) {
        return null
    }

    return (
        <div className="glass-panel" style={{ borderRadius: '12px', position: 'relative' }}>

            {/* Image Details Modal */}
            {showImageModal && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', width: '440px', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#18181b' }}>
                        <h3 style={{ fontWeight: 'bold', color: 'white' }}>Detalles de la Imagen</h3>

                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Texto Alternativo (Opcional)</label>
                            <input
                                type="text"
                                className="input-field"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Describe la imagen..."
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Pie de foto (Opcional)</label>
                            <input
                                type="text"
                                className="input-field"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Pie de foto..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={closeModal} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={insertImage} className="btn-primary" style={{ flex: 1, padding: '0.5rem', cursor: 'pointer' }}>Insertar Imagen</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Toolbar */}
            <div style={{
                padding: '0.75rem',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                gap: '0.25rem',
                flexWrap: 'wrap',
                background: '#09090b', // Solid background to hide content scrolling behind
                position: 'sticky',
                top: '100px', // Adjusted offset for fixed Navbar
                zIndex: 40,
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
            }}>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                >
                    <Strikethrough size={18} />
                </ToolbarButton>

                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                >
                    <Heading3 size={18} />
                </ToolbarButton>

                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <List size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                >
                    <ListOrdered size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                >
                    <Quote size={18} />
                </ToolbarButton>

                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

                <ToolbarButton
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon size={18} />
                </ToolbarButton>

            </div>

            {/* Editor Content */}
            <div style={{ padding: '0.5rem' }}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
