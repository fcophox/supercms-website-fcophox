"use client";

import { useState } from "react";
import { BookOpen, Award, GraduationCap, School, Calendar } from "lucide-react";
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
        type: "certification",
        logo: "/studies/Unir.svg"
    },
    {
        id: 2,
        title: "Certificación UX-PM (3 niveles)",
        title_en: "UX-PM Certification (3 levels)",
        institution: "Ayer Viernes - UX Alliance",
        year: "2018",
        type: "certification",
        logo: "/studies/UXAlliance.svg"
    },
    // Diplomados
    {
        id: 3,
        title: "Diplomado en Data-Driven Design",
        title_en: "Diploma in Data-Driven Design",
        institution: "Universidad del Desarrollo",
        year: "2022",
        type: "diploma",
        logo: "/studies/UDD.svg"
    },
    {
        id: 4,
        title: "Diplomado en ResearchOps",
        title_en: "Diploma in ResearchOps",
        institution: "Aprende UX",
        year: "2020",
        type: "diploma",
        logo: "/studies/AprendeUX.svg"
    },
    {
        id: 5,
        title: "Diplomado en Discovery UX",
        title_en: "Diploma in Discovery UX",
        institution: "Aprende UX",
        year: "2020",
        type: "diploma",
        logo: "/studies/AprendeUX.svg"
    },
    {
        id: 6,
        title: "Diplomado en UX Design",
        title_en: "Diploma in UX Design",
        institution: "Universidad Finis Terrae",
        year: "2019",
        type: "diploma",
        logo: "/studies/Finisterrae.svg"
    },
    {
        id: 7,
        title: "Diplomado en Gestión y Desarrollo de Proyectos Digitales",
        title_en: "Diploma in Digital Project Management and Development",
        institution: "Pontificia Universidad Católica",
        year: "2014",
        type: "diploma",
        logo: "/studies/Puc.svg"
    },
    {
        id: 8,
        title: "Diseño Gráfico",
        title_en: "Graphic Design",
        institution: "Duoc UC",
        year: "2010",
        type: "diploma",
        logo: "/studies/DuocUC.svg"
    },
    // Cursos & Bootcamps
    {
        id: 9,
        title: "Curso de UX Research con IA",
        title_en: "UX Research with AI Course",
        institution: "AyerViernes",
        year: "2024",
        type: "course",
        logo: "/studies/Ayerviernes.svg"
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
        institution: "Solmesz",
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
        type: "course",
        logo: "/studies/AprendeUX.svg"
    },
    {
        id: 16,
        title: "Arquitectura de la Información",
        title_en: "Information Architecture",
        institution: "Universidad de Chile",
        year: "2019",
        type: "course"
    },
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
        <section className="mb-32">
            <FadeInUp>
                <h2 className="text-[clamp(2rem,4vw,2rem)] font-extralight text-white mb-8">
                    {t("methodology.certifications.title")}
                </h2>
            </FadeInUp>

            {/* Filters */}
            <FadeInUp delay={0.1}>
                <div className="flex gap-8 mb-12 border-b border-white/10 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setFilter(cat.key)}
                            className={`pb-4 text-[0.95rem] font-medium transition-all duration-200 ease-in-out border-b whitespace-nowrap -mb-px ${filter === cat.key
                                ? "border-white text-white"
                                : "border-transparent text-white/50 hover:text-white/80"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </FadeInUp>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.map((item, index) => (
                    <FadeInUp key={item.id} delay={(index % 4) * 0.05} className="h-full">
                        <div className="h-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:bg-white/5 hover:border-white/20 hover:-translate-y-1">
                            <div>
                                {/* Logo if exists */}
                                {item.logo ? (
                                    <div className="mb-2 h-[60px] flex items-center">
                                        <img
                                            src={item.logo}
                                            alt={item.institution}
                                            className="max-h-full max-w-[150px] object-contain opacity-90"
                                        />
                                    </div>
                                ) : null}

                                <h3 className="text-white text-[1.1rem] font-extralight leading-snug mb-1 block pb-2">
                                    {language === 'en' && item.title_en ? item.title_en : item.title}
                                </h3>
                            </div>

                            <div className="mt-auto">
                                {/* <p className="font-mono text-sm text-zinc-600 mb-4 block">
                                    {item.year}
                                </p> */}
                                <div className="flex items-center gap-4 text-zinc-500 text-sm">
                                    <p className="flex items-center gap-2 font-mono text-sm text-zinc-600 block ">
                                        {/* <Calendar size={16} /> */}
                                        {item.year} -
                                    </p>
                                    <p className="flex items-center gap-2 font-mono text-sm text-zinc-600 block ">
                                        {/* <School size={16} /> */}
                                        {item.institution}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                ))}
            </div>
        </section>
    );
}
