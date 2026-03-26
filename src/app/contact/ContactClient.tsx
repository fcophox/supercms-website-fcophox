"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Send, Mail, User, MessageSquare, ArrowLeft, Check, MessageCircle, Users, ClipboardCheck } from "lucide-react";
import FadeInUp from "@/components/FadeInUp";
import { Switch } from "@/components/ui/Switch";
import { supabase } from "@/lib/supabaseClient";

import { usePageTitle } from "@/hooks/usePageTitle";

export default function ContactClient() {
    const { t } = useLanguage();
    usePageTitle("nav.contact");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        budget: 1150,
        estimatedTime: "",
        targetUrl: "",
        meetingDate: "",
        meetingTime: ""
    });
    const [budgetMin, setBudgetMin] = useState(500);
    const [budgetMax, setBudgetMax] = useState(1500);
    const [messageType, setMessageType] = useState<"message" | "consulting" | "diagnostic" | null>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [hasBudget, setHasBudget] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);
    const [restrictedDays, setRestrictedDays] = useState<number[]>([]); // Sin valores por defecto
    const [dailyRestrictions, setDailyRestrictions] = useState<Record<string, string[]>>({});
    const [currentStep, setCurrentStep] = useState(0); // 0: Select Type, 1: Form
    const [animationDirection, setAnimationDirection] = useState(1); // 1 for forward, -1 for backward

    useEffect(() => {
        const fetchAvailability = async () => {
            const { data, error } = await supabase
                .from("availability_settings")
                .select("*")
                .order('updated_at', { ascending: false })
                .limit(1);
            
            if (error) {
                console.error("Error fetching availability settings:", error);
            }
            if (!error && data && data.length > 0) {
                const settings = data[0];
                setRestrictedDays(settings.restricted_days || []);
                setDailyRestrictions(settings.daily_slot_restrictions || {});
            }
        };
        fetchAvailability();
    }, []);

    useEffect(() => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 is Sunday
        const startDate = new Date(today);
        
        // Para empezar el lunes: si hoy es domingo (0), retrocedemos 6 días. Si no, retrocedemos currentDay - 1 días.
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
        startDate.setDate(today.getDate() - diffToMonday);
        
        const days: Date[] = [];
        for (let i = 0; i < 14; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            days.push(d);
        }
        setCalendarDays(days);
    }, []);

    useEffect(() => {
        let typingInterval: NodeJS.Timeout;
        let timer: NodeJS.Timeout;

        if (messageType) {
            setIsThinking(true);
            setDisplayedText("");

            const fullText = messageType === 'message' ? t("contact.form.quote.message") :
                messageType === 'consulting' ? t("contact.form.quote.consulting") :
                    messageType === 'diagnostic' ? t("contact.form.quote.diagnostic") : "";

            timer = setTimeout(() => {
                setIsThinking(false);

                let i = 0;
                typingInterval = setInterval(() => {
                    setDisplayedText(fullText.slice(0, i + 1));
                    i++;
                    if (i >= fullText.length) {
                        clearInterval(typingInterval);
                    }
                }, 20); // Velocidad de tipeo en milisegundos
            }, 1200); // Tiempos de los puntitos
        }

        return () => {
            clearTimeout(timer);
            clearInterval(typingInterval);
        };
    }, [messageType, t]);

    // Icons Mapping
    const typeIcons = {
        message: MessageCircle,
        consulting: Users,
        diagnostic: ClipboardCheck
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            const finalMessage = hasBudget
                ? `[Rango Inversión: $${budgetMin} - $${budgetMax} USD]\n${formData.message}`
                : formData.message;

            const payload = {
                ...formData,
                message: finalMessage,
                messageType,
                budget: hasBudget ? budgetMax : null
            };

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setStatus("success");
            setFormData({ name: "", email: "", message: "", budget: 1150, estimatedTime: "", targetUrl: "", meetingDate: "", meetingTime: "" });

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

            <main className="flex-1 p-8 max-w-6xl mx-auto w-full pt-36 pb-12">

                {/* Back Link */}
                {currentStep === 0 && (
                    <FadeInUp duration={0.5}>
                        <Link href="/" className="inline-flex items-center gap-2 text-muted mb-12 no-underline text-sm opacity-70">
                            <ArrowLeft size={16} /> {t("common.backHome")}
                        </Link>
                    </FadeInUp>
                )}

                {/* Contact Form Container */}
                <div className="mt-8">
                    <div className="relative min-h-[800px] flex items-start justify-center">
                        {/* Background decoration */}
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none z-0" />

                        <div className="relative z-10 w-full">
                            <AnimatePresence mode="wait">
                                {currentStep === 0 ? (
                                    <motion.div
                                        key="step0"
                                        initial={{ opacity: 0, y: animationDirection === 1 ? 80 : -80 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: animationDirection === 1 ? -80 : 80 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full max-w-6xl mx-auto"
                                    >
                                        {/* Header Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-start">
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

                                        {/* Question - Now outside the main form box */}
                                        <div className="flex flex-col gap-8 mb-12 max-w-4xl mx-auto">
                                            <label className="text-white text-3xl font-light text-center block w-full">
                                                {t("contact.form.question")}
                                            </label>
                                            <div className="grid grid-cols-3 gap-3 md:gap-6">
                                                {(["message", "consulting", "diagnostic"] as const).map(type => {
                                                    const isBlocked = false; // "Agendar reunión" is now available
                                                    return (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            disabled={isBlocked}
                                                            onClick={() => {
                                                                if (!isBlocked) {
                                                                    setAnimationDirection(1);
                                                                    setMessageType(type);
                                                                    setCurrentStep(1);
                                                                }
                                                            }}
                                                            className={`group relative flex flex-col p-4 sm:p-6 md:p-8 rounded-xl transition-all duration-500 border text-left h-full ${isBlocked
                                                                ? "bg-white/[0.01] border-white/[0.03] opacity-40 cursor-not-allowed select-none"
                                                                : messageType === type
                                                                    ? "bg-[#5b4eff]/10 border-[#5b4eff] shadow-[0_0_40px_rgba(91,78,255,0.2)] ring-1 ring-[#5b4eff]/50 scale-[1.02]"
                                                                    : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1"
                                                                }`}
                                                        >
                                                            {/* Badge / Indicator */}
                                                            {isBlocked ? (
                                                                <div className="absolute top-6 right-6 px-3 py-1 bg-[#5b4eff]/10 rounded-full border border-[#5b4eff]/20">
                                                                    <span className="text-[10px] font-bold text-[#5b4eff] uppercase tracking-widest leading-none">
                                                                        {t("contact.form.badge.soon")}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${messageType === type
                                                                    ? "bg-[#5b4eff] border-[#5b4eff]"
                                                                    : "border-white/20"
                                                                    }`}>
                                                                    {messageType === type && <Check size={14} className="text-white" strokeWidth={3} />}
                                                                </div>
                                                            )}

                                                            {/* Icon container */}
                                                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 ${isBlocked
                                                                ? "bg-white/5 text-white/20"
                                                                : messageType === type
                                                                    ? "bg-[#5b4eff] text-white"
                                                                    : "bg-white/5 text-[#a1a1aa] group-hover:bg-white/10 group-hover:text-white"
                                                                }`}>
                                                                {React.createElement(typeIcons[type], { size: 20 })}
                                                            </div>

                                                            <h4 className={`text-xs sm:text-base md:text-xl font-medium mb-1 sm:mb-3 transition-colors duration-300 ${isBlocked
                                                                ? "text-white/40"
                                                                : messageType === type ? "text-white" : "text-white/80"
                                                                }`}>
                                                                {t(`contact.form.type.${type}`)}
                                                            </h4>

                                                            <p className={`hidden sm:block text-[0.85rem] md:text-[0.95rem] leading-relaxed transition-colors duration-300 ${isBlocked
                                                                ? "text-white/20"
                                                                : messageType === type ? "text-white/70" : "text-[#a1a1aa]"
                                                                }`}>
                                                                {t(`contact.form.help.${type}`)}
                                                            </p>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: animationDirection === 1 ? 80 : -80 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: animationDirection === 1 ? -80 : 80 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full flex flex-col items-center"
                                    >
                                        <div className="flex items-center justify-between w-full max-w-2xl mb-12">
                                            {messageType && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#5b4eff]/20 flex items-center justify-center text-[#5b4eff]">
                                                        {React.createElement(typeIcons[messageType], { size: 22 })}
                                                    </div>
                                                    <h3 className="text-white text-2xl font-light">
                                                        {t("contact.form.type." + messageType)}
                                                    </h3>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setAnimationDirection(-1);
                                                    setCurrentStep(0);
                                                }}
                                                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                                            >
                                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                                {t("common.back")}
                                            </button>
                                        </div>

                                        {/* Main Form Box - Appears when selection is made */}
                                        {messageType && (
                                            <div className="p-0 w-full">
                                                <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl mx-auto w-full">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Name Input */}
                                            <div className="flex flex-col gap-2.5">
                                                <label htmlFor="name" className="text-white/70 !font-light text-[0.9rem] ml-1">
                                                    {t("contact.form.name")}
                                                </label>
                                                <div className="relative">
                                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none" />
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="input-field !pl-12 !h-14 !bg-white/[0.03] !border-white/5 focus:!border-[#5b4eff]/50 focus:!bg-white/[0.05]"
                                                        placeholder={t("contact.form.namePlaceholder")}
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Email Input */}
                                            <div className="flex flex-col gap-2.5">
                                                <label htmlFor="email" className="text-white/70 !font-light text-[0.9rem] ml-1">
                                                    {t("contact.form.email")}
                                                </label>
                                                <div className="relative">
                                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none" />
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="input-field !pl-12 !h-14 !bg-white/[0.03] !border-white/5 focus:!border-[#5b4eff]/50 focus:!bg-white/[0.05]"
                                                        placeholder={t("contact.form.emailPlaceholder")}
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Fields Base on messageType */}

                                        {/* Message Field - Used in 'message' and 'consulting' */}
                                        {(messageType === 'message' || messageType === 'consulting') && (
                                            <div className="flex flex-col gap-2.5">
                                                <label htmlFor="message" className="text-white/70 !font-light text-[0.9rem] ml-1">
                                                    {t("contact.form.message")}
                                                </label>
                                                <div className="relative">
                                                    <MessageSquare size={18} className="absolute left-4 top-5 text-[#52525b] pointer-events-none" />
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        className="input-field !pl-12 resize-y min-h-[180px] !bg-white/[0.03] !border-white/5 focus:!border-[#5b4eff]/50 focus:!bg-white/[0.05]"
                                                        placeholder={messageType === 'message' ? t("contact.form.messagePlaceholder") : `${t(`contact.form.type.${messageType}`)}: ${t("contact.form.messagePlaceholder")}`}
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        rows={6}
                                                        required={messageType === 'message' || messageType === 'consulting'}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Consulting UX Fields */}
                                        {messageType === 'consulting' && (
                                            <div className="grid grid-cols-1 gap-8 fade-in duration-300">
                                                <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl p-5">
                                                    <div>
                                                        <h4 className="text-white text-[1.05rem] font-medium mb-1">{t("contact.form.budget.title")}</h4>
                                                        <p className="text-white/50 text-sm">{t("contact.form.budget.desc")}</p>
                                                    </div>
                                                    <Switch checked={hasBudget} onChange={setHasBudget} />
                                                </div>

                                                {hasBudget && (
                                                    <div className="flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                                        <div className="flex flex-col gap-1">
                                                            <label htmlFor="budgetMin" className="flex justify-between text-white/70 !font-light text-[0.9rem] ml-1">
                                                                <span>{t("contact.form.budget.range")}</span>
                                                                <span className="text-[#5b4eff] font-medium">${budgetMin} - ${budgetMax} USD</span>
                                                            </label>
                                                            <p className="text-white/40 text-[0.8rem] ml-1">{t("contact.form.budget.hint")}</p>
                                                        </div>
                                                        <div className="relative w-full h-6 flex items-center mt-2 mb-2 group">
                                                            {/* Track Background */}
                                                            <div className="absolute w-full h-1.5 bg-white/10 rounded-lg pointer-events-none" />
                                                            {/* Range Fill */}
                                                            <div
                                                                className="absolute h-1.5 bg-[#5b4eff] rounded-lg pointer-events-none transition-all duration-75"
                                                                style={{ left: `${((budgetMin - 100) / 2900) * 100}%`, right: `${100 - ((budgetMax - 100) / 2900) * 100}%` }}
                                                            />
                                                            {/* Min Slider */}
                                                            <input
                                                                type="range"
                                                                min="100"
                                                                max="3000"
                                                                step="50"
                                                                value={budgetMin}
                                                                onChange={(e) => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 100))}
                                                                className="absolute w-full h-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#5b4eff] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 active:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto z-20"
                                                            />
                                                            {/* Max Slider */}
                                                            <input
                                                                type="range"
                                                                min="100"
                                                                max="3000"
                                                                step="50"
                                                                value={budgetMax}
                                                                onChange={(e) => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 100))}
                                                                className="absolute w-full h-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#5b4eff] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 active:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto z-30"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="flex flex-col gap-2.5">
                                                        <label htmlFor="estimatedTime" className="text-white/70 !font-light text-[0.9rem] ml-1">
                                                            {t("contact.form.consulting.devTime")}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="estimatedTime"
                                                            name="estimatedTime"
                                                            className="input-field !pl-4 !h-14 !bg-white/[0.03] !border-white/5 focus:!border-[#5b4eff]/50 focus:!bg-white/[0.05]"
                                                            placeholder={t("contact.form.consulting.devTimePlaceholder")}
                                                            value={formData.estimatedTime}
                                                            onChange={handleChange}
                                                            required={messageType === 'consulting'}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2.5">
                                                        <label htmlFor="targetUrl" className="text-white/70 !font-light text-[0.9rem] ml-1">
                                                            {t("contact.form.consulting.urlTitle")} <span className="text-white/30 text-xs ml-1">{t("contact.form.consulting.optional")}</span>
                                                        </label>
                                                        <input
                                                            type="url"
                                                            id="targetUrl"
                                                            name="targetUrl"
                                                            className="input-field !pl-4 !h-14 !bg-white/[0.03] !border-white/5 focus:!border-[#5b4eff]/50 focus:!bg-white/[0.05]"
                                                            placeholder="https://tuweb.com"
                                                            value={formData.targetUrl}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Meeting Fields */}
                                        {messageType === 'diagnostic' && (
                                            <div className="flex flex-col gap-6 fade-in duration-300">
                                                
                                                {/* Date Selection */}
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-white/70 !font-light text-[0.9rem] ml-1">
                                                        {t("contact.form.diagnostic.dateLabel") || "Fecha de reunión"}
                                                    </label>
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-sm">
                                                        <div className="grid grid-cols-7 gap-1 text-center mb-3">
                                                            {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map(day => (
                                                                <div key={day} className="text-[0.65rem] font-semibold text-[#a1a1aa] uppercase tracking-wider">{day}</div>
                                                            ))}
                                                        </div>
                                                        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                                                            {calendarDays.map((date, idx) => {
                                                                const dayStr = date.toISOString().split('T')[0];
                                                                const isSelected = formData.meetingDate === dayStr;
                                                                
                                                                const today = new Date();
                                                                today.setHours(0,0,0,0);
                                                                const btnDate = new Date(date);
                                                                btnDate.setHours(0,0,0,0);
                                                                const isPast = btnDate < today;
                                                                const isRestricted = restrictedDays.includes(date.getDay());
                                                                const isDisabled = isPast || isRestricted;
                                                                const isToday = btnDate.getTime() === today.getTime();
                                                                
                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        type="button"
                                                                        disabled={isDisabled}
                                                                        onClick={() => setFormData(prev => ({ ...prev, meetingDate: dayStr }))}
                                                                        className={`relative w-9 h-9 mx-auto flex items-center justify-center rounded-full text-[0.9rem] transition-all duration-300 font-medium ${
                                                                            isSelected 
                                                                                ? "bg-[#5b4eff] text-white shadow-[0_0_15px_rgba(91,78,255,0.4)] ring-4 ring-[#5b4eff]/10" 
                                                                                : isDisabled 
                                                                                    ? "text-[#52525b] cursor-not-allowed opacity-50 bg-[#1a1a1c]/50" 
                                                                                    : "text-white/80 hover:bg-[#5b4eff]/10 hover:text-[#5b4eff]"
                                                                        }`}
                                                                    >
                                                                        {date.getDate()}
                                                                        {isToday && !isSelected && (
                                                                            <span className="absolute bottom-1 w-[4px] h-[4px] bg-[#5b4eff] rounded-full"></span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                <label className="text-white/70 !font-light text-[0.9rem] ml-1">
                                                    {t("contact.form.diagnostic.meetingLabel")}
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {[
                                                        "18:30 - 18:45 hrs",
                                                        "18:45 - 19:00 hrs",
                                                        "19:00 - 19:15 hrs",
                                                        "19:15 - 19:30 hrs",
                                                        "19:30 - 19:45 hrs",
                                                        "19:45 - 20:00 hrs",
                                                        "20:00 - 20:15 hrs",
                                                        "20:15 - 20:30 hrs",
                                                        "20:30 - 20:45 hrs",
                                                        "20:45 - 21:00 hrs"
                                                    ].map((slot) => {
                                                        // Check if this specific slot is restricted for the selected day
                                                        const selectedDate = formData.meetingDate ? new Date(formData.meetingDate + 'T00:00:00') : null;
                                                        const dayIndex = selectedDate ? selectedDate.getDay() : null;
                                                        const isSlotBlocked = dayIndex !== null && dailyRestrictions[dayIndex.toString()]?.includes(slot);

                                                        return (
                                                            <button
                                                                key={slot}
                                                                type="button"
                                                                disabled={isSlotBlocked}
                                                                onClick={() => setFormData(prev => ({ ...prev, meetingTime: slot }))}
                                                                className={`p-3 rounded-xl border text-[0.85rem] transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
                                                                    isSlotBlocked
                                                                        ? "bg-white/[0.01] border-white/[0.03] opacity-30 cursor-not-allowed select-none"
                                                                        : formData.meetingTime === slot
                                                                            ? "bg-[#5b4eff]/20 border-[#5b4eff] text-white shadow-[0_0_15px_rgba(91,78,255,0.2)] ring-1 ring-[#5b4eff]/50 scale-[1.02]"
                                                                            : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/[0.08] hover:border-white/20 hover:text-white"
                                                                }`}
                                                            >
                                                                {slot}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-xs text-white/40 mt-1 ml-1">{t("contact.form.diagnostic.meetingNote")}</p>
                                            </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className={`w-full bg-white text-black rounded-2xl flex items-center justify-center gap-3 px-8 py-5 text-[1.1rem] font-semibold transition-all duration-300 hover:bg-[#5b4eff] hover:text-white hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2`}
                                            disabled={
                                                status === "sending" ||
                                                status === "success" ||
                                                !formData.name ||
                                                !formData.email ||
                                                (messageType === "message" && !formData.message) ||
                                                (messageType === "consulting" && (!formData.message || !formData.estimatedTime)) ||
                                                (messageType === "diagnostic" && (!formData.meetingDate || !formData.meetingTime))
                                            }
                                        >
                                            {status === "sending" ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                                    {t("contact.form.sending")}
                                                </>
                                            ) : status === "success" ? (
                                                <>
                                                    <Check size={20} />
                                                    {t("contact.form.success")}
                                                </>
                                            ) : status === "error" ? (
                                                <span className="text-red-500">Error</span>
                                            ) : (
                                                <>
                                                    {t("contact.form.submit")} <Send size={20} />
                                                </>
                                            )}
                                        </button>

                                        <div className="flex flex-row items-start justify-start gap-4 w-full mt-8 fade-in">
                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                <div className="w-full h-full rounded-full border-[2px] border-white/10 overflow-hidden relative shadow-lg bg-[#1a1a1c]">
                                                    <Image
                                                        src="/francisco-avatar.png"
                                                        alt="Francisco Hormazábal"
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050505] shadow-sm"></div>
                                            </div>
                                            <div className="bg-white/[0.01] border border-white/[0.0] p-4 rounded-2xl rounded-tl-sm shadow-xl relative inline-flex items-start min-h-[60px] max-w-2xl">
                                                {isThinking ? (
                                                    <div className="flex gap-1.5 items-center h-full pt-2 px-1 animate-in fade-in duration-300">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-[bounce_1s_infinite]" style={{ animationDelay: "0ms" }}></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-[bounce_1s_infinite]" style={{ animationDelay: "150ms" }}></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-[bounce_1s_infinite]" style={{ animationDelay: "300ms" }}></div>
                                                    </div>
                                                ) : (
                                                    <p className="text-white/70 text-[0.9rem] leading-relaxed text-left min-h-[1.5rem]">
                                                        {displayedText}
                                                        {displayedText && messageType && displayedText.length < (messageType === 'message' ? t("contact.form.quote.message") : messageType === 'consulting' ? t("contact.form.quote.consulting") : t("contact.form.quote.diagnostic")).length && (
                                                            <span className="inline-block w-[2px] h-[1em] bg-white/70 ml-0.5 animate-pulse align-middle"></span>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                                </form>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>



            </main>

            <Footer />
        </div >
    );
}
