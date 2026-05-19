"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MethodologyCertifications from "@/components/MethodologyCertifications";
import MethodologyHero from "@/components/MethodologyHero";
import MethodologyFSEB from "@/components/MethodologyFSEB";
import MethodologyProcessSteps from "@/components/MethodologyProcessSteps";
import MethodologyPrinciples from "@/components/MethodologyPrinciples";
import Image from "next/image";
import FadeInUp from "@/components/FadeInUp";
import { useLanguage } from "@/context/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function MethodologyClient() {
    const { t } = useLanguage();
    usePageTitle("nav.methodology");

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-36 pb-20">
                <div className="max-w-6xl mx-auto px-8 w-full">
                    <MethodologyHero />
                    <MethodologyFSEB />
                </div>

                {/* Full width section */}
                <div className="w-full relative">
                    <MethodologyProcessSteps />
                </div>

                <div className="max-w-6xl mx-auto px-8 w-full">
                    <MethodologyPrinciples />

                    <FadeInUp delay={0.2}>
                        <div className="w-full mb-24 rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                            <Image
                                src="/methodology/methodology.png"
                                alt="Methodology Process"
                                width={1100}
                                height={600}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                        <p className="text-left text-based text-white/80 -mt-16 mb-24 mx-auto leading-relaxed">
                            {t("methodology.process.caption")}
                        </p>
                    </FadeInUp>

                    <MethodologyCertifications />
                </div>
            </main>

            <Footer />
        </div>
    );
}
