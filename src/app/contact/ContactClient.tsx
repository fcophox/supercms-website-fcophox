"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Send, Mail, User, MessageSquare } from "lucide-react";

import { usePageTitle } from "@/hooks/usePageTitle";

export default function ContactClient() {
    const { t } = useLanguage();
    usePageTitle("nav.contact");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            setFormData({ name: "", email: "", message: "" });

            // Reset status after 3 seconds
            setTimeout(() => {
                setStatus("idle");
            }, 3000);
        }, 1500);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#09090b" }}>
            <Navbar />

            <main style={{
                flex: 1,
                padding: "4rem 2rem",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "4rem", maxWidth: "600px" }}>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: "700",
                        marginBottom: "1rem",
                        background: "linear-gradient(to right, #fff, #94a3b8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        {t("contact.title")}
                    </h1>
                    <p style={{
                        color: "var(--text-muted)",
                        fontSize: "1.125rem",
                        lineHeight: 1.6
                    }}>
                        {t("contact.subtitle")}
                    </p>
                </div>

                {/* Contact Form Container */}
                <div className="glass-panel" style={{
                    width: "100%",
                    maxWidth: "600px",
                    padding: "3rem",
                    borderRadius: "24px",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: "absolute",
                        top: "-50%",
                        left: "-50%",
                        width: "200%",
                        height: "200%",
                        background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.03), transparent 70%)",
                        pointerEvents: "none",
                        zIndex: 0
                    }} />

                    <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                        {/* Name Input */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="name" style={{ color: "white", fontWeight: 500, fontSize: "0.95rem", marginLeft: "0.25rem" }}>
                                {t("contact.form.name")}
                            </label>
                            <div style={{ position: "relative" }}>
                                <User size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="input-field"
                                    placeholder={t("contact.form.namePlaceholder")}
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ paddingLeft: "3rem" }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="email" style={{ color: "white", fontWeight: 500, fontSize: "0.95rem", marginLeft: "0.25rem" }}>
                                {t("contact.form.email")}
                            </label>
                            <div style={{ position: "relative" }}>
                                <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="input-field"
                                    placeholder={t("contact.form.emailPlaceholder")}
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ paddingLeft: "3rem" }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Message Input */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="message" style={{ color: "white", fontWeight: 500, fontSize: "0.95rem", marginLeft: "0.25rem" }}>
                                {t("contact.form.message")}
                            </label>
                            <div style={{ position: "relative" }}>
                                <MessageSquare size={18} style={{ position: "absolute", left: "1rem", top: "1rem", color: "var(--text-muted)" }} />
                                <textarea
                                    id="message"
                                    name="message"
                                    className="input-field"
                                    placeholder={t("contact.form.messagePlaceholder")}
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    style={{ paddingLeft: "3rem", resize: "vertical", minHeight: "120px" }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={status === "sending" || status === "success"}
                            style={{
                                marginTop: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                opacity: status === "sending" ? 0.7 : 1
                            }}
                        >
                            {status === "sending" ? (
                                <>
                                    <div style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTopColor: "white",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite"
                                    }} />
                                    {t("contact.form.sending")}
                                </>
                            ) : status === "success" ? (
                                t("contact.form.success")
                            ) : (
                                <>
                                    {t("contact.form.submit")} <Send size={18} />
                                </>
                            )}
                        </button>

                        <style jsx>{`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </form>
                </div>

            </main>

            <Footer />
        </div>
    );
}
