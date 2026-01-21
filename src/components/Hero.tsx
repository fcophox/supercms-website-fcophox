"use client";

import Link from "next/link";
import { Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "@/components/FadeInUp";

export default function Hero() {
    const { t } = useLanguage();

    return (
        <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-8 min-h-[60vh] lg:min-h-[60vh] flex flex-col justify-center text-left">
            <FadeInUp>
                <div className="mb-8">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-transparent">
                        <img
                            src="/francisco-avatar.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </FadeInUp>

            <FadeInUp delay={0.1}>
                <h1 className="text-[clamp(2.2rem,8vw,4.5rem)] font-light mb-6 leading-[1.1] text-white tracking-[-0.02em]">
                    {t("hero.title.line1")} <br />
                    <span className="text-[#5b4eff]">{t("hero.title.highlight1")} </span>
                    <span className="text-[#5b4eff]">{t("hero.title.highlight2")}</span>
                </h1>
            </FadeInUp>

            <FadeInUp delay={0.2}>
                <p className="text-[clamp(1rem,4vw,1.25rem)] text-[#a1a1aa] mb-12 leading-[1.6] max-w-[600px]">
                    {t("hero.description")}
                </p>
            </FadeInUp>

            <FadeInUp delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Link href="/case-studies" className="bg-primary rounded-full flex items-center gap-2 px-[1.25rem] py-[0.6rem] text-white no-underline text-[0.9rem] font-normal transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(72,59,252,0.4)]"
                    >
                        {t("hero.buttons.projects")}
                    </Link>

                    <Link
                        href="https://www.linkedin.com/in/fcophox/"
                        target="_blank"
                        className="bg-white/10 border border-white/5 rounded-full flex items-center gap-2 px-[1.25rem] py-[0.6rem] text-white no-underline text-[0.9rem] font-normal transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
                    >
                        <Linkedin size={20} />
                        <span>{t("about.bio.linkedin")}</span>
                    </Link>
                </div>
            </FadeInUp>
        </div>
    );
}
