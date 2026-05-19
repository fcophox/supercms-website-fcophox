"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "./FadeInUp";

export default function MethodologyFSEB() {
    const { t } = useLanguage();

    const results = [
        t("methodology.fseb.result1"),
        t("methodology.fseb.result2"),
        t("methodology.fseb.result3"),
        t("methodology.fseb.result4"),
    ];

    return (
        <section className="mb-32">
            {/* Header section (Title/Subtitle) */}
            <div className="text-center max-w-3xl mx-auto mb-20 px-4">
                <FadeInUp>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium uppercase tracking-tighter mb-6">
                        {t("methodology.fseb.title")}
                    </div>
                    <h2 className="text-4xl font-light text-white leading-tight mb-8">
                        {t("methodology.fseb.subtitle")}
                    </h2>
                </FadeInUp>

                {/* Concept breakdown */}
                <FadeInUp delay={0.1}>

                    <p className="text-[#A1A1AA] text-lg leading-relaxed text-center">
                        {t("methodology.fseb.description")}
                    </p>
                </FadeInUp>
            </div>

            {/* Results section */}
            <FadeInUp delay={0.2}>
                <div className="w-full">
                    <div className="mb-10 text-center">
                        <span className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em]">
                            {t("methodology.fseb.results.title")}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {results.map((result, idx) => (
                            <div
                                key={idx}
                                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/40 transition-all duration-500 overflow-hidden"
                            >
                                {/* Subtle hover glow */}
                                <div className="absolute -inset-px bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative flex items-center gap-4 mb-12">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform duration-500">
                                        <Check className="text-secondary w-4 h-4" />
                                    </div>
                                </div>
                                <div className="relative flex items-center gap-4">

                                    <p className="text-white/90 font-light leading-snug">
                                        {result}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeInUp>
        </section>
    );
}
