"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import imageCompression from 'browser-image-compression';

export default function ImageUploader({
    value,
    onChange,
    disabled
}: {
    value?: string,
    onChange: (url: string) => void,
    disabled?: boolean
}) {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];

            // Image compression options
            const options = {
                maxSizeMB: 0.8,          // Max size in MB
                maxWidthOrHeight: 1200,  // Max width or height
                useWebWorker: true,      // Use web worker for better performance
                initialQuality: 0.8,     // Initial quality
            };

            let uploadFile = file;

            try {
                // Only compress if it's an image
                if (file.type.startsWith('image/')) {
                    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
                    uploadFile = await imageCompression(file, options);
                    console.log(`Compressed size: ${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`);
                }
            } catch (error) {
                console.error("Image compression failed, uploading original file:", error);
            }

            const fileExt = uploadFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('article-images')
                .upload(filePath, uploadFile);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);

            if (data) {
                onChange(data.publicUrl);
            }

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert(`Error uploading image: ${message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cover Image</label>

            {value ? (
                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem', background: '#333' }}>
                    <Image
                        src={value}
                        alt="Cover"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <button
                        onClick={() => onChange("")}
                        style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div style={{
                    border: '2px dashed var(--glass-border)',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}>
                    {uploading ? (
                        <span style={{ color: 'var(--text-muted)' }}>Uploading...</span>
                    ) : (
                        <label style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📷</span>
                            <span style={{ color: 'var(--text-muted)' }}>Click to upload an image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={uploadImage}
                                disabled={disabled}
                                style={{ display: 'none' }}
                            />
                        </label>
                    )}
                </div>
            )}
        </div>
    );
}
