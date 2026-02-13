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

export default function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    useEffect(() => {
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
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-[4px] animate-fade-in"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="glass-panel w-[90%] max-w-[450px] p-0 rounded-2xl border border-[var(--glass-border)] shadow-2xl animate-slide-up bg-[#18181b]"
            >
                {/* Header */}
                <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white m-0">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer p-1 rounded hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-slate-200 leading-relaxed">
                    {children}
                </div>

                {/* Footer */}
                {actions && (
                    <div className="p-4 bg-black/20 border-t border-[var(--glass-border)] flex justify-end gap-3 rounded-b-2xl">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
