"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AboutHistory from "@/components/AboutHistory";
// import AboutServices from "@/components/AboutServices";
import AboutBio from "@/components/AboutBio";
import AboutAccordion from "@/components/AboutAccordion";
import AboutAreas from "@/components/AboutAreas";
// import AboutLogoHover from "@/components/AboutLogoHover";
import FadeInUp from "@/components/FadeInUp";

import { usePageTitle } from "@/hooks/usePageTitle";

export default function AboutClient() {
    const { t } = useLanguage();
    usePageTitle("nav.about");

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-6xl mx-auto w-full pt-36">

                {/* Back Link */}
                <FadeInUp duration={0.5}>
                    <Link href="/" className="inline-flex items-center gap-2 text-[#a1a1aa] mb-12 no-underline text-[0.9rem] opacity-70 hover:opacity-100 transition-opacity">
                        <ArrowLeft size={16} /> {t("common.backHome")}
                    </Link>
                </FadeInUp>

                {/* Header Section */}
                <FadeInUp delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-start">
                        <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extralight text-white leading-[1.1] tracking-tight max-w-[12em]">
                            {t("about.title")}
                        </h1>

                        <p className="text-[#A1A1AA] text-[1.1rem] leading-relaxed max-w-[50ch]">
                            {t("about.description")}
                        </p>
                    </div>
                </FadeInUp>

                {/* Featured Image */}
                <FadeInUp delay={0.2} className="animate-fade-in-up">
                    <div className="w-full aspect-[21/9] rounded-[24px] overflow-hidden relative bg-[#222]">
                        <Image
                            src="/about/desk.png"
                            alt={t("about.imageAlt")}
                            fill
                            className="object-cover"
                        />
                    </div>
                </FadeInUp>

                {/* Logo Hover Effect */}
                {/* <FadeInUp delay={0.3}>
                    <AboutLogoHover />
                </FadeInUp> */}

                <AboutHistory />

                <AboutBio />

                <AboutAccordion />

                {/* <AboutServices /> */}

                <AboutAreas />

            </main>

            <Footer />
        </div>
    );
}
