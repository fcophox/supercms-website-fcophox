"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Send, Mail, User, MessageSquare, ArrowLeft, Check, Calendar, Briefcase, MessageCircle, Users, ClipboardCheck } from "lucide-react";
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
    const [messageType, setMessageType] = useState<"message" | "consulting" | "diagnostic" | null>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    // Icons Mapping
    const typeIcons = {
        message: <MessageCircle size={18} />,
        consulting: <Users size={18} />,
        diagnostic: <ClipboardCheck size={18} />
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const validateForm = () => {
        // Regex for simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Anti-spam patterns based on user request

        // 1. Suspicious emails with many dots: "c.eci.z.er.u.keme.4.4@gmail.com"
        // Pattern: 3 or more dots in the local part of the email
        const manyDotsRegex = /^([^@]*\.){3,}[^@]*@/;

        // 2. Suspicious mixed case/random text messages: "pLIWvjWfYNHybUPtiE"
        // Pattern: Long string (e.g. >15 chars) with no spaces, or high density of mixed case letters without spaces
        const randomTextRegex = /\b[a-zA-Z0-9]{15,}\b/;

        // 3. Suspicious names: "xDXOlPOnWxNJnAKliLHM"
        // Pattern: Long single word name with mixed case
        const suspiciousNameRegex = /^[a-zA-Z0-9]{15,}$/;

        if (!emailRegex.test(formData.email)) {
            alert(t("contact.error.invalidEmail"));
            return false;
        }

        if (manyDotsRegex.test(formData.email)) {
            console.warn("Suspicious email detected (too many dots)");
            alert(t("contact.error.spamDetected"));
            return false;
        }

        if (suspiciousNameRegex.test(formData.name)) {
            console.warn("Suspicious name detected (pattern)");
            alert(t("contact.error.invalidName"));
            return false;
        }

        if (randomTextRegex.test(formData.message)) {
            console.warn("Suspicious message detected (random text)");
            alert(t("contact.error.spamDetected"));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
        <div className="min-h-[100dvh] flex flex-col bg-[#09090b]">
            <Navbar />

            <main className="flex-1 p-8 max-w-6xl mx-auto w-full pt-24 pb-12">

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
                            {t("contact.title.line1")} <span className="text-[#5b4eff]">{t("contact.title.highlight")}</span>
                        </h1>

                        <div className="max-w-[50ch] mt-4">
                            <h3 className="text-white text-[1.15rem] font-bold mb-3 tracking-wide">
                                {t("contact.intro.title")}
                            </h3>
                            <p className="text-[#A1A1AA] text-[1.05rem] leading-relaxed">
                                {t("contact.intro.text")}
                            </p>
                        </div>
                    </div>
                </FadeInUp>

                {/* Contact Form Container */}
                <FadeInUp delay={0.2}>
                    <div className="relative overflow-hidden rounded-[1.5rem]">
                        {/* Background decoration */}
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none z-0" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <div className="w-full bg-[#121214] border border-white/5 rounded-[1.5rem] p-8 lg:p-10">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                                    {/* Question */}
                                    <div className="flex flex-col gap-4">
                                        <label className="text-white text-lg font-light">
                                            {t("contact.form.question")}
                                        </label>
                                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                            {(["message", "consulting", "diagnostic"] as const).map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setMessageType(type)}
                                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border text-center flex items-center justify-center gap-3 ${messageType === type
                                                        ? "bg-[#5b4eff] text-white border-[#5b4eff] shadow-[0_0_20px_rgba(91,78,255,0.4)] scale-[1.02]"
                                                        : "bg-transparent text-[#a1a1aa] border-white/10 hover:border-white/30 hover:text-white"
                                                        }`}
                                                >
                                                    {typeIcons[type]}
                                                    {t(`contact.form.type.${type}`)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Revealed Form Fields */}
                                    {messageType && (
                                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <hr className="border-white/10 my-2" />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Name Input */}
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="name" className="text-white !font-light text-[0.95rem] ml-1">
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
                                                    <label htmlFor="email" className="text-white !font-light text-[0.95rem] ml-1">
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
                                                <label htmlFor="message" className="text-white !font-light text-[0.95rem] ml-1">
                                                    {t("contact.form.message")}
                                                </label>
                                                <div className="relative">
                                                    <MessageSquare size={18} className="absolute left-3 top-3.5 text-muted pointer-events-none" />
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        className="input-field !pl-12 resize-y min-h-[200px]"
                                                        placeholder={messageType === 'message' ? t("contact.form.messagePlaceholder") : `${t(`contact.form.type.${messageType}`)}: ${t("contact.form.messagePlaceholder")}`}
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        rows={8}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                className={`w-full bg-white/5 border border-white/10 rounded-full flex items-center justify-center gap-2 px-8 py-4 text-white no-underline text-[1.1rem] font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6`}
                                                disabled={status === "sending" || status === "success" || !formData.name || !formData.email || !formData.message}
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
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Dynamic Help Text */}
                        {messageType && (
                            <FadeInUp delay={0.3}>
                                <div className="max-w-2xl mx-auto px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0 animate-pulse" />
                                        <div className="flex flex-col gap-1">
                                            {/* <span className="text-white text-sm font-semibold uppercase tracking-wider">
                                                    {t(`contact.form.type.${messageType}`)}
                                                </span> */}
                                            <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-[60ch]">
                                                {t(`contact.form.help.${messageType}`)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeInUp>
                        )}
                    </div>
                </FadeInUp>

                {/* Extended Contact Options */}
                <FadeInUp delay={0.3}>
                    <div className="mt-24">
                        <h2 className="text-2xl font-light text-white mb-10 text-center">{t("contact.extended.title")}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                            {/* Agenda Card - DISABLED */}
                            <div
                                className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center opacity-50 cursor-not-allowed select-none grayscale-[0.5]"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
                                    <Calendar size={24} />
                                </div>
                                <h3 className="text-xl text-white font-medium mb-3">{t("contact.card.schedule.title")}</h3>
                                <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6 max-w-[30ch]">
                                    {t("contact.card.schedule.desc")}
                                </p>
                                <span className="text-white/70 text-sm font-semibold pb-0.5">
                                    {t("contact.card.schedule.soon")}
                                </span>
                            </div>

                            {/* Case Studies Card */}
                            <Link
                                href="/case-studies"
                                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-1 hover:border-white/20 flex flex-col items-center text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase size={24} />
                                </div>
                                <h3 className="text-xl text-white font-medium mb-3">{t("contact.card.cases.title")}</h3>
                                <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6 max-w-[30ch]">
                                    {t("contact.card.cases.desc")}
                                </p>
                                <span className="text-white text-sm font-semibold border-b border-white/30 pb-0.5 group-hover:border-white transition-colors">
                                    {t("contact.card.cases.button")}
                                </span>
                            </Link>
                        </div>
                    </div>
                </FadeInUp>

            </main>

            <Footer />
        </div >
    );
}
