"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Award, Linkedin, Github } from "lucide-react";
import Link from "next/link";

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
                            <img src="/about/uxpm.svg" alt="UXPM Certification" className="w-12 shrink-0" />
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

                            <Link
                                href="https://github.com/fcophox"
                                target="_blank"
                                className="bg-white/10 border border-white/5 rounded-full flex items-center gap-2 px-[1.25rem] py-[0.6rem] text-white no-underline text-[0.9rem] font-normal transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
                            >
                                <Github size={20} />
                                {t("about.bio.github")}
                            </Link>

                        </div>

                    </div>
                </div>
            </FadeInUp>
        </section>
    );
}
