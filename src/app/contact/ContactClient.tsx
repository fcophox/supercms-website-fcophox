"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Send, Mail, User, MessageSquare, ArrowLeft } from "lucide-react";
import FadeInUp from "@/components/FadeInUp";

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

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setStatus("success");
            setFormData({ name: "", email: "", message: "" });

            // Reset status after 3 seconds
            setTimeout(() => {
                setStatus("idle");
            }, 3000);
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus("error");
            // Reset status after 3 seconds so user can try again
            setTimeout(() => {
                setStatus("idle");
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-[1100px] mx-auto w-full pt-24 pb-24">

                {/* Back Link */}
                <FadeInUp duration={0.5}>
                    <Link href="/" className="inline-flex items-center gap-2 text-muted mb-12 no-underline text-sm opacity-70">
                        <ArrowLeft size={16} /> {t("common.backHome")}
                    </Link>
                </FadeInUp>

                {/* Header Section */}
                <FadeInUp delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16 items-start">
                        <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extralight text-white leading-[1.1] tracking-tight max-w-[12em]">
                            {t("contact.title")}
                        </h1>

                        <p className="text-[#A1A1AA] text-lg leading-relaxed max-w-[50ch]">
                            {t("contact.subtitle")}
                        </p>
                    </div>
                </FadeInUp>

                {/* Contact Form Container */}
                <FadeInUp delay={0.2}>
                    <div className="glass-panel w-full p-8 rounded-3xl relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none z-0" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">

                            <div className="lg:col-span-2 mx-auto w-full">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name Input */}
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="name" className="text-white font-medium text-[0.95rem] ml-1">
                                                {t("contact.form.name")}
                                            </label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    className="input-field !pl-12"
                                                    placeholder={t("contact.form.namePlaceholder")}
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Email Input */}
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="email" className="text-white font-medium text-[0.95rem] ml-1">
                                                {t("contact.form.email")}
                                            </label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="input-field !pl-12"
                                                    placeholder={t("contact.form.emailPlaceholder")}
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Input */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="message" className="text-white font-medium text-[0.95rem] ml-1">
                                            {t("contact.form.message")}
                                        </label>
                                        <div className="relative">
                                            <MessageSquare size={18} className="absolute left-3 top-3.5 text-muted pointer-events-none" />
                                            <textarea
                                                id="message"
                                                name="message"
                                                className="input-field !pl-12 resize-y min-h-[120px]"
                                                placeholder={t("contact.form.messagePlaceholder")}
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={5}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className={`bg-primary rounded-full flex items-center justify-center gap-2 px-[1.25rem] py-[0.6rem] text-white no-underline text-[0.9rem] font-normal transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(72,59,252,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4 w-fit self-end`}
                                        disabled={status === "sending" || status === "success"}
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {t("contact.form.sending")}
                                            </>
                                        ) : status === "success" ? (
                                            t("contact.form.success")
                                        ) : status === "error" ? (
                                            <span className="text-red-500">Error</span>
                                        ) : (
                                            <>
                                                {t("contact.form.submit")} <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </FadeInUp>

            </main>

            <Footer />
        </div>
    );
}
