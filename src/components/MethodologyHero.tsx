"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import FadeInUp from "./FadeInUp";

export default function MethodologyHero() {
    const { t } = useLanguage();
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Only cycle if we are likely on mobile (window width check is optional, but css hides/shows anyway)
            // Even if it runs on desktop, the translation is disabled via CSS md:!transform-none
            setActiveImage((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="mb-32">

            {/* Back Link */}
            <FadeInUp>
                <Link href="/" className="inline-flex items-center gap-2 text-muted mb-12 no-underline text-sm opacity-70 hover:opacity-100 transition-opacity">
                    <ArrowLeft size={16} /> {t("common.backHome")}
                </Link>
            </FadeInUp>

            {/* Main Header */}
            <FadeInUp delay={0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 mb-16 items-start">
                    <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-light text-white leading-[1.1] tracking-tight max-w-[12em]">
                        {t("methodology.hero.title")}
                    </h1>

                    <p className="text-[#A1A1AA] text-lg leading-relaxed max-w-[50ch]">
                        {t("methodology.hero.description").split(". ").map((sentence, index, array) => (
                            <span key={index}>
                                {sentence}{index < array.length - 1 ? ". " : ""}
                                {index === 0 && <><br /><br /></>}
                            </span>
                        ))}
                    </p>
                </div>
            </FadeInUp>

            {/* Image Grid (Desktop) / Carousel (Mobile) */}
            <div className="mb-24 relative overflow-hidden md:overflow-visible">
                <div
                    className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 transition-transform duration-700 ease-in-out md:!transform-none"
                    style={{ transform: `translateX(calc(-${activeImage * 100}% - ${activeImage * 1}rem))` }}
                >
                    {/* Image 1: Computer/Creative */}
                    <FadeInUp delay={0.2} className="w-full shrink-0 md:w-auto h-full">
                        <div className="rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/5] relative bg-[#222] group h-full cursor-grab active:cursor-grabbing md:cursor-auto">
                            <Image
                                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
                                alt="Creative Workspace"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                        </div>
                    </FadeInUp>

                    {/* Image 2: Sketches/Wireframes */}
                    <FadeInUp delay={0.3} className="w-full shrink-0 md:w-auto h-full">
                        <div className="rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/5] relative bg-[#222] group h-full cursor-grab active:cursor-grabbing md:cursor-auto">
                            <Image
                                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop"
                                alt="Wireframing"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                        </div>
                    </FadeInUp>

                    {/* Image 3: Collaboration */}
                    <FadeInUp delay={0.4} className="w-full shrink-0 md:w-auto h-full">
                        <div className="rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/5] relative bg-[#222] group h-full cursor-grab active:cursor-grabbing md:cursor-auto">
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                alt="Team meeting"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                        </div>
                    </FadeInUp>
                </div>

                {/* Mobile Pagination Dots */}
                <div className="flex md:hidden justify-center gap-2 mt-6">
                    {[0, 1, 2].map((index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`transition-all duration-300 rounded-full h-1.5 ${activeImage === index ? "w-6 bg-white" : "w-1.5 bg-white/20"
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Chronicle Section */}
            <FadeInUp delay={0.2}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-end">
                    {/* Left: Button */}
                    <div className="relative group inline-block">
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-full text-white/50 no-underline font-medium transition-all duration-200 bg-transparent cursor-not-allowed"
                        >
                            <Download size={18} />
                            {t("methodology.hero.downloadCV")}
                        </a>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                            {t("methodology.hero.downloadCV.tooltip")}
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#18181b]"></div>
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl font-light text-white leading-tight">
                            {t("methodology.hero.chronicleTitle")}
                        </h2>
                        <p className="text-[#A1A1AA] text-lg leading-relaxed">
                            {t("methodology.hero.chronicleDesc").split(". ").map((sentence, index, array) => (
                                <span key={index}>
                                    {sentence}{index < array.length - 1 ? ". " : ""}
                                    {index === 1 && <><br /><br /></>}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
            </FadeInUp>

        </section>
    );
}
