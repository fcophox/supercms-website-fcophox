"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "./FadeInUp";

const principles = [
    {
        titleKey: "methodology.principles.p1.title",
        descKey: "methodology.principles.p1.desc",
    },
    {
        titleKey: "methodology.principles.p2.title",
        descKey: "methodology.principles.p2.desc",
    },
    {
        titleKey: "methodology.principles.p3.title",
        descKey: "methodology.principles.p3.desc",
    },
    {
        titleKey: "methodology.principles.p4.title",
        descKey: "methodology.principles.p4.desc",
    },
    {
        titleKey: "methodology.principles.p5.title",
        descKey: "methodology.principles.p5.desc",
    },
];

export default function MethodologyPrinciples() {
    const { t } = useLanguage();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % principles.length);
        setProgress(0);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + principles.length) % principles.length);
        setProgress(0);
    }, []);

    // Auto-play logic
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    nextSlide();
                    return 0;
                }
                return prev + 0.5; // Controls speed of each slide (approx 5-6s)
            });
        }, 30);

        return () => clearInterval(timer);
    }, [isPaused, nextSlide]);

    return (
        <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <FadeInUp className="space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded-sm shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Principles
                        </span>
                    </div>

                    <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-light text-foreground leading-[1.1] tracking-tight">
                        Nuestro ADN de <br />
                        <span className="text-primary">trabajo</span>
                    </h2>

                    <p className="text-muted text-lg leading-relaxed max-w-[45ch]">
                        {t("methodology.principles.intro")}
                    </p>

                    <button className="group flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-foreground/5 hover:bg-foreground/10 transition-all duration-300">
                        <span className="text-sm font-medium">Hablemos del proceso</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </FadeInUp>

                {/* Right Carousel Card */}
                <FadeInUp delay={0.2}>
                    <div
                        className="relative h-[650px]  rounded-2xl  overflow-hidden group/card bg-card border border-border"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Background Image Placeholder */}
                        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                            {/* The user will add an image here later. Using a placeholder for now */}
                            <div className="w-full h-full bg-primary/5" />
                        </div>

                        {/* Top Story Bars */}
                        <div className="absolute top-8 left-8 right-8 z-20 flex gap-2">
                            {principles.map((_, idx) => (
                                <div key={idx} className="h-1 flex-1 bg-foreground/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-100 ease-linear"
                                        style={{
                                            width: idx === current ? `${progress}%` : idx < current ? "100%" : "0%"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Slide Content */}
                        <div className="h-full flex flex-col justify-end p-12 relative z-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="space-y-6"
                                >
                                    <div className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 inline-block">
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                            Principle {current + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-light text-foreground leading-tight">
                                        {t(principles[current].titleKey)}
                                    </h3>
                                    <p className="text-muted text-lg leading-relaxed max-w-[40ch]">
                                        {t(principles[current].descKey)}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Carousel Controls */}
                            <div className="mt-12 flex items-center gap-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={prevSlide}
                                        className="p-3 rounded-full bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="p-3 rounded-full bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="p-3 rounded-full bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors ml-auto"
                                >
                                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </FadeInUp>
            </div>
        </section>
    );
}
