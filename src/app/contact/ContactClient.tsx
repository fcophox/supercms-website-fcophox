"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Send, Mail, User, MessageSquare, ArrowLeft, Check, Calendar, Briefcase } from "lucide-react";
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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full pt-24 pb-24">

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
                    <div className="">
                        {/* Background decoration */}
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none z-0" />

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10">
                            <div className="lg:col-span-2 flex flex-col justify-start">
                                <div className="flex flex-col gap-6">
                                    {/* <h3 className="text-xl font-light text-white mb-2">{t("contact.cta.title")}</h3> */}

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <p className="text-[#a1a1aa] leading-relaxed text-sm">
                                            {t("contact.reason1")}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <p className="text-[#a1a1aa] leading-relaxed text-sm">
                                            {t("contact.reason2")}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <p className="text-[#a1a1aa] leading-relaxed text-sm">
                                            {t("contact.reason3")}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <p className="text-[#a1a1aa] leading-relaxed text-sm">
                                            {t("contact.reason4")}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <p className="text-[#a1a1aa] leading-relaxed text-sm">
                                            {t("contact.reason5")}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <p className="text-[#a1a1aa] leading-relaxed text-sm">
                                            {t("contact.reason6")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-3 mx-auto w-full">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

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

                {/* Extended Contact Options */}
                <FadeInUp delay={0.3}>
                    <div className="mt-24">
                        <h2 className="text-2xl font-light text-white mb-10 text-center">{t("contact.extended.title")}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
        </div>
    );
}
