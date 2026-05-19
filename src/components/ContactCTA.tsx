"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "@/components/FadeInUp";

export default function ContactCTA() {
    const { t } = useLanguage();

    return (
        <section className="w-full max-w-6xl mx-auto px-8 pb-16">
            <FadeInUp>
                <div className="relative rounded-3xl overflow-hidden bg-card min-h-[350px] flex flex-col items-center justify-center text-center p-8 border border-border shadow-2xl">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 w-full h-full z-0"
                        style={{
                            backgroundImage: `url('/brand/footerbackfb.svg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 1
                        }}
                    />

                    {/* Gradient Overlay for better text readability if needed, though SVG might be enough */}
                    <div className="absolute inset-0 bg-background/20 z-0" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl px-4">
                        <h2 className="text-2xl md:text-3xl font-normal text-foreground tracking-tight">
                            {t("contact.cta.title")}
                        </h2>
                        <p className="text-muted text-lg md:text-xl font-light leading-relaxed">
                            {t("contact.cta.desc")}
                        </p>
                        <Link
                            href="/contact"
                            className="bg-foreground text-background px-8 py-4 rounded-full font-medium inline-flex items-center gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] mt-2"
                        >
                            {t("contact.cta.button")}
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                </div>
            </FadeInUp>
        </section>
    )
}
