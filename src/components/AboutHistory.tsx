"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import FadeInUp from "./FadeInUp";

export default function AboutHistory() {
    const { t } = useLanguage();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6rem", marginTop: "6rem" }}>



            {/* Item 2: Text Left, Image Right */}
            <FadeInUp>
                <div className="history-item-reverse">
                    <style jsx>{`
                        .history-item-reverse {
                            display: grid;
                            grid-template-columns: 1fr;
                            gap: 2rem;
                            align-items: center;
                        }
                        /* Mobile: Image first (by reordering or just natural flow if we swap grid columns?) 
                           Usually in mobile we want Text then Image or Image then Text consistently. 
                           The provided image shows layout. Let's stack them naturally.
                           If we want Text TOP on mobile for the second item, we can just use normal flow.
                           But usually designs keep Image Top or Bottom consistent.
                           Let's stick to the grid. On desktop it swaps.
                        */
                        @media (min-width: 768px) {
                            .history-item-reverse {
                                grid-template-columns: 1fr 1fr;
                                gap: 4rem;
                            }
                        }
                    `}</style>

                    {/* On Desktop this should be on the Left (col 1). On Mobile it's naturally 1st div. */}
                    <div className="text-content">
                        <h2 style={{
                            fontSize: "2rem",
                            fontWeight: "200",
                            color: "white",
                            marginBottom: "1rem"
                        }}>
                            {t("about.history2.title")}
                        </h2>
                        <p style={{
                            color: "var(--text-muted)",
                            fontSize: "1.1rem",
                            lineHeight: 1.6,
                            opacity: 0.9,
                        }}>
                            {t("about.history2.desc")}
                        </p>
                    </div>

                    <div className="image-content" style={{
                        width: "100%",
                        aspectRatio: "4/2",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "#222",
                        position: "relative"
                    }}>
                        <Image
                            src="/about/cowork.png"
                            alt="Sticky notes on glass"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Reordering for Desktop to put Text Left, Image Right. 
                         Wait, keyframe: 
                         Div1 (Text) | Div2 (Image) -> This IS Text Left, Image Right by DOM order.
                         So in CSS Grid 1fr 1fr, Div1 is left, Div2 is right.
                         This matches the screenshot for the second row.
                         
                         For the FIRST row (Item 1), we have:
                         Div1 (Image) | Div2 (Text) -> Image Left, Text Right.
                         
                         So standard DOM order works for both if we want that layout.
                         
                         Mobile behavior:
                         Item 1: Image then Text.
                         Item 2: Text then Image.
                         This seems acceptable.
                     */}
                </div>
            </FadeInUp>

            {/* Item 1: Image Left, Text Right */}
            <FadeInUp delay={0.2}>
                <div className="history-item">
                    <style jsx>{`
                        .history-item {
                            display: grid;
                            grid-template-columns: 1fr;
                            gap: 2rem;
                            align-items: center;
                        }
                        @media (min-width: 768px) {
                            .history-item {
                                grid-template-columns: 1fr 1fr;
                                gap: 4rem;
                            }
                        }
                    `}</style>

                    <div style={{
                        width: "100%",
                        aspectRatio: "4/2",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "#222",
                        position: "relative"
                    }}>
                        <Image
                            src="/about/coffeeshop.png"
                            alt="Laptop on desk"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <h2 style={{
                            fontSize: "2rem",
                            fontWeight: "200",
                            color: "white",
                            marginBottom: "1rem"
                        }}>
                            {t("about.history1.title")}
                        </h2>
                        <p style={{
                            color: "var(--text-muted)",
                            fontSize: "1.1rem",
                            lineHeight: 1.6,
                            opacity: 0.9,
                        }}>
                            {t("about.history1.desc")}
                        </p>
                    </div>
                </div>
            </FadeInUp>

        </div>
    );
}
