"use client";

import { useState } from "react";
import { BookOpen, Award, GraduationCap, School } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Category = "all" | "certification" | "diploma" | "course";

interface EducationItem {
    id: number;
    title: string;
    title_en?: string;
    institution: string;
    year: string;
    type: Category;
    logo?: string;
}

const educationData: EducationItem[] = [
    // Certificaciones
    {
        id: 1,
        title: "Programa Avanzado en CRO, UX & Analytics",
        title_en: "Advanced Program in CRO, UX & Analytics",
        institution: "Unir",
        year: "2021",
        type: "certification"
    },
    {
        id: 2,
        title: "Certificación UX-PM (3 niveles)",
        title_en: "UX-PM Certification (3 levels)",
        institution: "Ayer Viernes - UX Alliance",
        year: "2018",
        type: "certification"
    },
    // Diplomados
    {
        id: 3,
        title: "Diplomado en Data-Driven Design",
        title_en: "Diploma in Data-Driven Design",
        institution: "Universidad del Desarrollo",
        year: "2022",
        type: "diploma"
    },
    {
        id: 4,
        title: "Diplomado en ResearchOps",
        title_en: "Diploma in ResearchOps",
        institution: "Aprende UX",
        year: "2020",
        type: "diploma"
    },
    {
        id: 5,
        title: "Diplomado en Discovery UX",
        title_en: "Diploma in Discovery UX",
        institution: "Aprende UX",
        year: "2020",
        type: "diploma"
    },
    {
        id: 6,
        title: "Diplomado en UX Design",
        title_en: "Diploma in UX Design",
        institution: "Universidad Finis Terrae",
        year: "2019",
        type: "diploma"
    },
    {
        id: 7,
        title: "Diplomado en Gestión y Desarrollo de Proyectos Digitales",
        title_en: "Diploma in Digital Project Management and Development",
        institution: "Pontificia Universidad Católica",
        year: "2014",
        type: "diploma"
    },
    {
        id: 8,
        title: "Diseño Gráfico",
        title_en: "Graphic Design",
        institution: "Duoc UC",
        year: "2010",
        type: "diploma"
    },
    // Cursos & Bootcamps
    {
        id: 9,
        title: "Curso de UX Research con IA",
        title_en: "UX Research with AI Course",
        institution: "AyerViernes",
        year: "2024",
        type: "course"
    },
    {
        id: 10,
        title: "Design UX Essentials",
        institution: "Escuela de Postgrado y Educación Continua FCFM",
        year: "2023",
        type: "course"
    },
    {
        id: 11,
        title: "Curso de CRO",
        title_en: "CRO Course",
        institution: "Conviértete & Webpositer Academy",
        year: "2022",
        type: "course"
    },
    {
        id: 12,
        title: "Curso de Product Design",
        title_en: "Product Design Course",
        institution: "Soi Mesz",
        year: "2021",
        type: "course"
    },
    {
        id: 13,
        title: "Bootcamp en UX Writing",
        title_en: "UX Writing Bootcamp",
        institution: "DesignCore",
        year: "2021",
        type: "course"
    },
    {
        id: 14,
        title: "CX: Customer Experience",
        institution: "MEDU Escuela de Innovación",
        year: "2020",
        type: "course"
    },
    {
        id: 15,
        title: "Machine Learning en Contexto UX",
        title_en: "Machine Learning in UX Context",
        institution: "Aprende UX",
        year: "2020",
        type: "course"
    },
    {
        id: 16,
        title: "Arquitectura de la Información",
        title_en: "Information Architecture",
        institution: "Universidad de Chile",
        year: "2019",
        type: "course"
    }
];

import FadeInUp from "./FadeInUp";

export default function MethodologyCertifications() {
    const { t, language } = useLanguage();
    const [filter, setFilter] = useState<Category>("all");

    const filteredData = filter === "all"
        ? educationData
        : educationData.filter(item => item.type === filter);

    const categories: { key: Category; label: string }[] = [
        { key: "all", label: t("methodology.certifications.filter.all") },
        { key: "certification", label: t("methodology.certifications.filter.certification") },
        { key: "diploma", label: t("methodology.certifications.filter.diploma") },
        { key: "course", label: t("methodology.certifications.filter.course") },
    ];

    return (
        <section style={{ marginBottom: "8rem" }}>
            <FadeInUp>
                <h2 style={{
                    fontSize: "clamp(2rem, 4vw, 2rem)",
                    fontWeight: "200",
                    color: "white",
                    marginBottom: "2rem",
                }}>
                    {t("methodology.certifications.title")}
                </h2>
            </FadeInUp>

            {/* Filters */}
            <FadeInUp delay={0.1}>
                <div style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "3rem",
                    flexWrap: "wrap"
                }}>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setFilter(cat.key)}
                            style={{
                                padding: "0.75rem 1.5rem",
                                borderRadius: "9999px",
                                border: "none",
                                background: filter === cat.key ? "hsl(var(--primary))" : "#1f1f22",
                                color: filter === cat.key ? "white" : "#a1a1aa",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: "500",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </FadeInUp>

            {/* Grid */}
            <div className="edu-grid">
                <style jsx>{`
                    .edu-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    @media (min-width: 768px) {
                        .edu-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                    .edu-card {
                        background: rgba(255, 255, 255, 0.02);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 16px;
                        padding: 2rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        min-height: 200px;
                        transition: all 0.3s ease;
                    }
                    .edu-card:hover {
                        background: rgba(255, 255, 255, 0.05);
                        border-color: rgba(255, 255, 255, 0.2);
                        transform: translateY(-4px);
                    }
                `}</style>

                {filteredData.map((item, index) => (
                    <FadeInUp key={item.id} delay={(index % 4) * 0.05} className="h-full">
                        <div className="edu-card h-full">
                            <div>
                                {/* Placeholder Logo / Icon */}
                                <div style={{
                                    marginBottom: "1.5rem",
                                    color: "#52525b",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    fontFamily: "sans-serif",
                                    opacity: 0.5
                                }}>
                                    {item.institution.split(" ")[0]}
                                    {/* A simple text placeholder for logo logic */}
                                </div>

                                <h3 style={{
                                    color: "white",
                                    fontSize: "1.1rem",
                                    fontWeight: "200",
                                    lineHeight: 1.4,
                                    marginBottom: "1rem"
                                }}>
                                    {language === 'en' && item.title_en ? item.title_en : item.title}
                                </h3>
                            </div>

                            <div style={{ marginTop: "auto" }}>
                                <p style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.9rem",
                                    color: "#52525b",
                                    marginBottom: "1rem",
                                    display: "block"
                                }}>
                                    {item.year}
                                </p>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    color: "#71717a",
                                    fontSize: "0.9rem"
                                }}>
                                    <School size={16} />
                                    {item.institution}
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                ))}
            </div>
        </section>
    );
}
