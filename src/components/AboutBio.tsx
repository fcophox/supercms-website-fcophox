"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Linkedin, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import FadeInUp from "./FadeInUp";

export default function AboutBio() {
    const { t } = useLanguage();

    return (
        <section className="mt-32 mb-16">
            <FadeInUp>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16">

                    {/* Left Column: Title */}
                    <div>
                        <h3 className="text-muted text-xl font-light mb-12 opacity-70">
                            {t("about.bio.title")}
                        </h3>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex flex-col gap-8">

                        {/* Certification */}
                        <div className="flex gap-4 items-center">
                            <Image
                                src="/about/uxpm.svg"
                                alt="UXPM Certification"
                                width={48}
                                height={48}
                                className="shrink-0 h-auto w-12"
                                unoptimized
                            />
                            <p className="text-primary text-xl leading-relaxed font-normal">
                                {t("about.bio.certification")}
                            </p>
                        </div>

                        {/* Role Description */}
                        <p className="text-white text-lg leading-snug font-normal">
                            {t("about.bio.role")}
                        </p>

                        {/* Mission */}
                        <p className="text-white text-base opacity-60 leading-relaxed">
                            {t("about.bio.mission")}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4 flex-wrap mt-4">

                            <Link
                                href="https://www.linkedin.com/in/fcophox/"
                                target="_blank"
                                className="bg-primary rounded-full flex items-center gap-2 px-[1.25rem] py-[0.6rem] text-white no-underline text-[0.9rem] font-normal transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(72,59,252,0.4)]"
                            >
                                <Linkedin size={20} />
                                {t("about.bio.linkedin")}
                            </Link>

                            {/* Download CV (Placeholder for now) */}
                            <div className="relative group inline-block">
                                <span
                                    className="bg-white/5 border border-white/5 rounded-full flex items-center gap-2 px-[1.25rem] py-[0.6rem] text-white/50 cursor-not-allowed text-[0.9rem] font-normal transition-all duration-200"
                                >
                                    <Download size={20} />
                                    {t("about.bio.downloadCV")}
                                </span>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                                    {t("about.bio.downloadCV.tooltip")}
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#18181b]"></div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </FadeInUp>
        </section>
    );
}
