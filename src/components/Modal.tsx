"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    type?: 'info' | 'danger' | 'warning';
}

export default function Modal({ isOpen, onClose, title, children, actions, type = 'info' }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const modalContent = (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="glass-panel"
                style={{
                    width: '90%',
                    maxWidth: '450px',
                    padding: '0',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transform: 'translateY(0)',
                    animation: 'slideUp 0.3s ease-out',
                    background: '#18181b'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'white',
                        margin: 0
                    }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            borderRadius: '4px'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    {children}
                </div>

                {/* Footer */}
                {actions && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderTop: '1px solid var(--glass-border)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                        borderRadius: '0 0 16px 16px'
                    }}>
                        {actions}
                    </div>
                )}
            </div>
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );

    return createPortal(modalContent, document.body);
}
