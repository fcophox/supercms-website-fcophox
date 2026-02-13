"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutServices() {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);

    const services = [
        {
            id: "web",
            translationKey: "about.services.web",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" // Coding
        },
        {
            id: "data",
            translationKey: "about.services.data",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" // Data charts
        },
        {
            id: "networks",
            translationKey: "about.services.networks",
            image: "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=2071&auto=format&fit=crop" // Server/Networks
        },
        {
            id: "uiux",
            translationKey: "about.services.uiux",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop" // Design sticky notes
        },
        {
            id: "support",
            translationKey: "about.services.support",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" // Support/Meeting
        }
    ];

    return (
        <div className="my-32">
            <h3 className="text-[#a1a1aa] text-[1.2rem] font-light mb-12 opacity-70">
                {t("about.services.title")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                {/* List Column */}
                <div className="flex flex-col">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`text-[clamp(2rem,4vw,2.4rem)] font-light cursor-pointer transition-all duration-300 mb-4 leading-tight text-white hover:opacity-100 hover:translate-x-2.5 ${activeIndex === index ? "opacity-100" : "opacity-40"
                                }`}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            {t(service.translationKey)}
                        </div>
                    ))}
                </div>

                {/* Image Column */}
                <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#222] relative">
                    {services.map((service, index) => (
                        <Image
                            key={service.id}
                            src={service.image}
                            alt={t(service.translationKey)}
                            fill
                            className={`object-cover transition-opacity duration-500 ease-in-out grayscale ${activeIndex === index ? "opacity-100" : "opacity-0"
                                }`}
                            unoptimized
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
