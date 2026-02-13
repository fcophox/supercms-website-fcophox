"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "@/components/FadeInUp";

export default function HomeLogosSection() {
    const { t } = useLanguage();

    // List of logos based on the user's reference image
    // Using placeholder services for now to mock the visual
    const logos = [
        { name: "Duoc UC", src: "/studies/DuocUC.svg" },
        { name: "Finis Terrae", src: "/studies/Finisterrae.svg" },
        { name: "UNIR", src: "/studies/Unir.svg" },
        { name: "PUC", src: "/studies/Puc.svg" },
        { name: "UDD", src: "/studies/UDD.svg" },
        { name: "Google", src: "/studies/Google.svg" },
        { name: "Microsoft", src: "/studies/Microsoft.svg" },
        { name: "Coursera", src: "/studies/Coursera.svg" },
        { name: "Aprende UX", src: "/studies/AprendeUX.svg" },
        { name: "AyerViernes", src: "/studies/Ayerviernes.svg" },
        { name: "UX Alliance", src: "/studies/UXAlliance.svg" },
    ];

    return (
        <section className="w-full max-w-[1200px] mx-auto px-8 py-16 mb-16">
            {/* Header */}
            <FadeInUp>
                <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-extralight text-white mb-12 text-left">
                    {t("home.logos.title")}
                </h2>
            </FadeInUp>

            {/* Grid */}
            <FadeInUp delay={0.2}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-8 mb-12 items-center justify-items-start">
                    {logos.map((logo) => (
                        <div
                            key={logo.name}
                            className="transition-all duration-300 grayscale brightness-[1.9] cursor-default hover:opacity-100 hover:grayscale-0 hover:brightness-100 relative h-[60px] w-full"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.name}
                                fill
                                className="object-contain object-left"
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            </FadeInUp>

            {/* Footer Link */}
            <FadeInUp delay={0.4}>
                <div className="text-left">
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 text-white no-underline font-medium text-[0.95rem] border-b border-white/20 pb-[2px] transition-all duration-200 hover:opacity-80 hover:border-white"
                    >
                        {t("home.logos.link")} <ArrowUpRight size={18} />
                    </Link>
                </div>
            </FadeInUp>
        </section>
    );
}
