"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeInUp from "@/components/FadeInUp";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight, Sparkles, Search, PenTool, Terminal, Rocket } from "lucide-react";

export default function HomeBentoSection() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3" | "tab4">("tab1");
    const [activeStep, setActiveStep] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab((prev) => {
                if (prev === "tab1") return "tab2";
                if (prev === "tab2") return "tab3";
                if (prev === "tab3") return "tab4";
                return "tab1";
            });
        }, 4000); // 4 seconds carousel

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 3000); // 3 seconds per step
        return () => clearInterval(stepInterval);
    }, []);

    return (
        <section className="w-full py-16 px-6 sm:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_70%)]" />

            <div className="max-w-[1200px] mx-auto w-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">

                    {/* Top Left Card - Strategy */}
                    <FadeInUp
                        delay={0.1}
                        className="col-span-1 md:col-span-2 bg-[#09090b]/50 text-left border border-white/5 hover:border-white/10 transition-colors duration-300 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between min-h-[300px] relative overflow-hidden group"
                    >
                        {/* Background SVG decoration */}
                        <div className="absolute inset-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none z-0 opacity-40">
                            <Image
                                src="/methodology/bg-card-1.svg"
                                alt="Background card decoration"
                                fill
                                className="object-cover object-center -translate-y-1 translate-x-1 scale-[1.15] group-hover:scale-[1.20] transition-transform duration-1000 ease-in-out"
                            />
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                            <h3 className="text-[clamp(1.4rem,3vw,1.6rem)] font-light text-white leading-tight text-left w-full max-w-[650px]">
                                {t("home.bento.strategy.title")}
                            </h3>
                            <p className="text-[#a1a1aa] leading-relaxed max-w-[50ch] text-[0.9rem]">
                                {t("home.bento.strategy.desc")}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 mb-12 mt-12 relative z-10 w-full group/steps">
                            {/* Connecting Line Base (Desktop) */}
                            <div className="hidden sm:block absolute top-[31px] left-[32px] right-[32px] h-[1px] bg-white/10 border-t border-[#2a2b36] -z-10"></div>

                            {/* Connecting Line Highlight (Desktop) */}
                            <div
                                className="hidden sm:block absolute top-[31px] left-[32px] h-[1px] bg-[#5b4eff] -z-10 transition-all duration-1000 ease-in-out shadow-[0_0_10px_#5b4eff]"
                                style={{ width: `calc(${activeStep * 33.33}% - ${activeStep === 0 ? 0 : 32}px)` }}
                            ></div>

                            {/* Connecting Line Base (Mobile) */}
                            <div className="block sm:hidden absolute left-[31px] top-[32px] bottom-[32px] w-[1px] bg-white/10 border-r border-[#2a2b36] -z-10"></div>

                            {/* Connecting Line Highlight (Mobile) */}
                            <div
                                className="block sm:hidden absolute left-[31px] top-[32px] w-[1px] bg-[#5b4eff] -z-10 transition-all duration-1000 ease-in-out shadow-[0_0_10px_#5b4eff]"
                                style={{ height: `calc(${activeStep * 33.33}% - ${activeStep === 0 ? 0 : 32}px)` }}
                            ></div>

                            {[
                                { id: "step1", index: 0, icon: Search },
                                { id: "step2", index: 1, icon: PenTool },
                                { id: "step3", index: 2, icon: Terminal },
                                { id: "step4", index: 3, icon: Rocket }
                            ].map((step) => {
                                const isActive = step.index <= activeStep;
                                const isCurrent = step.index === activeStep;
                                const Icon = step.icon;
                                return (
                                    <div key={step.id} className="flex flex-row sm:flex-col items-center justify-start gap-4 sm:gap-3 relative transition-all duration-500 w-full sm:w-auto">
                                        <div className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-all duration-500 ${isActive
                                            ? 'bg-[#1a1b24] border border-[#5b4eff] shadow-[0_0_30px_rgba(91,78,255,0.4)]'
                                            : 'bg-[#13141c] border border-[#2a2b36]'
                                            }`}>
                                            <Icon className={`w-7 h-7 transition-colors duration-500 ${isActive ? 'text-[#5b4eff]' : 'text-white/40'
                                                }`} strokeWidth={1.5} />
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full border text-[0.7rem] whitespace-nowrap transition-all duration-500 ${isCurrent
                                            ? 'bg-[#5b4eff]/10 border-[#5b4eff]/50 text-white shadow-[0_0_10px_rgba(91,78,255,0.2)]'
                                            : isActive
                                                ? 'bg-white/5 border-white/20 text-white/40'
                                                : 'bg-white/0 border-white/10 text-white/30'
                                            }`}>
                                            {t(`home.bento.strategy.${step.id}`)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* <div className="flex justify-end mt-8 relative z-10">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white text-sm hover:bg-white/5 transition-all w-fit"
                            >
                                <div className="w-6 h-3.5 border-[1.5px] border-white/80 rounded-full flex items-center px-0.5">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                                {t("home.bento.strategy.btn")}
                            </Link>
                        </div> */}
                    </FadeInUp>

                    {/* Top Right Card - AI / Framework */}
                    <FadeInUp
                        delay={0.2}
                        className="col-span-1 bg-[#09090b]/50 text-left border border-white/5 hover:border-white/10 transition-colors duration-300 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between min-h-[400px] relative overflow-hidden group"
                    >
                        {/* Background SVG decoration */}
                        <div className="absolute inset-0 group-hover:opacity-60 transition-opacity duration-5000 pointer-events-none z-0">
                            <Image
                                src="/methodology/bg-card-ia.png"
                                alt="Background card decoration"
                                fill
                                className="object-cover object-center -translate-y-1 translate-x-1 scale-[1.15] group-hover:scale-[1.40] transition-transform duration-1000 ease-in-out"
                            />
                        </div>

                        <h3 className="text-[clamp(1.4rem,3vw,1.4rem)] font-light text-white leading-tight text-left w-full max-w-[650px]">
                            {t("home.bento.tools.text")}
                        </h3>

                        <div className="mt-auto flex flex-col gap-8 relative z-10">
                            {/* <Sparkles className="text-white w-8 h-8 opacity-90 transition-transform group-hover:scale-110 duration-300" strokeWidth={1.5} /> */}

                            <Link href="/blog" className="inline-flex items-center gap-2 text-white/90 text-[0.95rem] font-medium hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-0.5 w-fit">
                                {t("home.bento.tools.link")} <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </FadeInUp>

                    {/* Bottom Left Card - Evolution / Services */}
                    <FadeInUp
                        delay={0.3}
                        className="col-span-1 bg-[#09090b]/50 border border-white/5 hover:border-white/10 transition-colors duration-300 rounded-[2rem] p-8 md:p-10 flex flex-col max-h-[440px] relative overflow-hidden group"
                    >
                        {/* Background SVG decoration */}
                        <div className="absolute inset-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none z-0">
                            <Image
                                src="/methodology/bg-card-3.svg"
                                alt="Background card decoration"
                                fill
                                className="object-cover object-center -translate-y-1 translate-x-1 scale-[1.15]"
                            />
                        </div>

                        <h3 className="text-[clamp(1.4rem,3vw,1.6rem)] font-light text-white leading-tight text-left w-full max-w-[650px]">
                            {t("home.bento.services.title")}
                        </h3>

                        <div className="relative flex-1 -mx-8 sm:-mx-10 overflow-hidden flex flex-col justify-start [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] pt-2 top-4 -left-4 [transform:perspective(110px)_rotateY(-7deg)_rotate(9deg)_scale(1.1)] transition-transform duration-1000 ease-out">
                            <div className="flex flex-col gap-3 pb-3 animate-vertical-scroll px-8 sm:px-10 hover:[animation-play-state:paused]">
                                {[
                                    "home.bento.services.item1",
                                    "home.bento.services.item2",
                                    "home.bento.services.item3",
                                    "home.bento.services.item4",
                                    "home.bento.services.item5",
                                    "home.bento.services.item6",
                                    "home.bento.services.item7",
                                    "home.bento.services.item8",
                                    // Duplicate for infinite scroll seamless loop
                                    "home.bento.services.item1",
                                    "home.bento.services.item2",
                                    "home.bento.services.item3",
                                    "home.bento.services.item4",
                                    "home.bento.services.item5",
                                    "home.bento.services.item6",
                                    "home.bento.services.item7",
                                    "home.bento.services.item8"
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="w-fit border border-white/10 rounded-xl px-4 py-2 text-[0.75rem] text-[#a1a1aa] bg-white/5 whitespace-normal leading-tight"
                                    >
                                        {t(item)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <style>{`
                            @keyframes verticalScroll {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(-50%); }
                            }
                            .animate-vertical-scroll {
                                animation: verticalScroll 10s linear infinite;
                            }
                            @keyframes fadeInTab {
                                from { opacity: 0; transform: translateY(4px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            .animate-fade-in-tab {
                                animation: fadeInTab 0.4s ease-out forwards;
                            }
                        `}</style>
                    </FadeInUp>

                    {/* Bottom Right Card - Methodology */}
                    <FadeInUp
                        delay={0.4}
                        className="col-span-1 overflow-hidden  md:col-span-2 bg-[#09090b]/50 border text-left border-white/5 hover:border-white/10 transition-colors duration-300 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between"
                    >
                        <div className="flex flex-col gap-4 mb-10">
                            <h3 className="text-[clamp(1.4rem,3vw,1.6rem)] font-light text-white leading-tight text-left w-full max-w-[650px]">
                                {t("home.bento.methodology.title")}
                            </h3>
                            <p className="text-[#a1a1aa] leading-relaxed max-w-[50ch] text-[0.9rem]">
                                {t("home.bento.methodology.desc")}
                            </p>
                        </div>

                        <div className="bg-[#18181b]/50 border border-white/5 rounded-2xl p-6 pr-16 relative overflow-hidden left-20 -bottom-12 pb-10">
                            <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10 ">
                                {(["tab1", "tab2", "tab3", "tab4"] as const).map(tab => {
                                    const isActive = activeTab === tab;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${isActive
                                                ? "border-[#5b4eff] text-white"
                                                : "border-white/20 text-[#a1a1aa] hover:border-white/40 hover:text-white"
                                                }`}
                                        >
                                            <div className={`w-6 h-3 border-[1.5px] rounded-full flex items-center px-[1px] ${isActive ? "border-[#5b4eff]" : "border-white/50"
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? "bg-[#5b4eff] ml-0" : "bg-white/50 ml-0"
                                                    }`}></div>
                                            </div>
                                            {t(`home.bento.methodology.${tab}`)}
                                        </button>
                                    );
                                })}
                            </div>

                            <p key={activeTab} className="text-[#A1A1AA] text-[0.95rem] mb-6 relative z-10 min-h-[2.8rem] animate-fade-in-tab">
                                {t(`home.bento.methodology.${activeTab}.desc`)}
                            </p>

                            <div className="flex items-center justify-between relative z-10">
                                <Link href="/methodology" className="inline-flex items-center gap-2 text-white/90 text-sm font-medium hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-0.5 w-fit">
                                    {t("home.bento.methodology.more")} <ArrowUpRight size={14} />
                                </Link>

                                <div className="flex items-center gap-2 mr-6">
                                    {(["tab1", "tab2", "tab3", "tab4"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`h-1.5 rounded-full transition-all duration-500 hover:bg-white/50 ${activeTab === tab
                                                ? "w-4 bg-white"
                                                : "w-1.5 bg-white/20"
                                                }`}
                                            aria-label={`Go to ${tab}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Background gradient for the nested card */}
                            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </FadeInUp>

                </div>
            </div>
        </section>
    );
}
