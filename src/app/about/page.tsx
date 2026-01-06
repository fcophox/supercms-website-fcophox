"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AboutHistory from "@/components/AboutHistory";
// import AboutServices from "@/components/AboutServices";
import AboutBio from "@/components/AboutBio";
import AboutAccordion from "@/components/AboutAccordion";
import AboutAreas from "@/components/AboutAreas";
import FadeInUp from "@/components/FadeInUp";

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#09090b" }}>
            <Navbar />

            <main style={{ flex: 1, padding: "2rem", maxWidth: "1100px", margin: "0 auto", width: "100%", paddingTop: "6rem" }}>

                {/* Back Link */}
                <FadeInUp duration={0.5}>
                    <Link href="/" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-muted)",
                        marginBottom: "3rem",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        opacity: 0.7,
                    }}>
                        <ArrowLeft size={16} /> {t("common.backHome")}
                    </Link>
                </FadeInUp>

                {/* Header Section */}
                <FadeInUp delay={0.1}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4rem",
                        marginBottom: "6rem",
                        alignItems: "start"
                    }}
                        className="about-header"
                    >
                        <style jsx>{`
                            @media (min-width: 768px) {
                                .about-header {
                                    grid-template-columns: 1fr 1fr;
                                }
                            }
                        `}</style>
                        <h1 style={{
                            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                            fontWeight: "200",
                            color: "white",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            maxWidth: "12em"
                        }}>
                            {t("about.title")}
                        </h1>

                        <p style={{
                            color: "#A1A1AA",
                            fontSize: "1.1rem",
                            lineHeight: 1.6,
                            maxWidth: "50ch"
                        }}>
                            {t("about.description")}
                        </p>
                    </div>
                </FadeInUp>

                {/* Featured Image */}
                <FadeInUp delay={0.2} className="animate-fade-in-up">
                    <div style={{
                        width: "100%",
                        aspectRatio: "21/9",
                        borderRadius: "24px",
                        overflow: "hidden",
                        position: "relative",
                        background: "#222"
                    }}>
                        <img
                            src="/about/desk.png"
                            alt={t("about.imageAlt")}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block"
                            }}
                        />
                    </div>
                </FadeInUp>

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
