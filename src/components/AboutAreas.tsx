"use client";

import { useLanguage } from "@/context/LanguageContext";

import FadeInUp from "./FadeInUp";

export default function AboutAreas() {
    const { t, language } = useLanguage();

    const areasEs = [
        {
            id: 1,
            title: "Retail & E-commerce",
            description: "Creación de experiencias de compra fluidas y optimizadas para la conversión, enfocadas en la retención y lealtad del cliente."
        },
        {
            id: 2,
            title: "Fintech & banca",
            description: "Diseño de interfaces financieras seguras, claras y confiables que simplifican la gestión del dinero para los usuarios."
        },
        {
            id: 3,
            title: "Salud & bienestar",
            description: "Soluciones digitales centradas en el paciente, priorizando la accesibilidad y la claridad en la información médica."
        },
        {
            id: 4,
            title: "Educación & tecnología",
            description: "Plataformas de aprendizaje intuitivas que facilitan el acceso al conocimiento y mejoran la experiencia educativa."
        },
        {
            id: 5,
            title: "SaaS & productividad",
            description: "Herramientas eficientes diseñadas para optimizar flujos de trabajo y aumentar la productividad de los equipos."
        },
        {
            id: 6,
            title: "Seguros & asuntos legales",
            description: "Simplificación de procesos complejos a través de diseño claro, generando confianza y transparencia en el usuario."
        },
    ];

    const areasEn = [
        {
            id: 1,
            title: "Retail & E-commerce",
            description: "Creating seamless shopping experiences optimized for conversion, focused on customer retention and loyalty."
        },
        {
            id: 2,
            title: "Fintech & Banking",
            description: "Design of secure, clear, and reliable financial interfaces that simplify money management for users."
        },
        {
            id: 3,
            title: "Health & Wellness",
            description: "Patient-centered digital solutions, prioritizing accessibility and clarity in medical information."
        },
        {
            id: 4,
            title: "Education & Technology",
            description: "Intuitive learning platforms that facilitate access to knowledge and improve the educational experience."
        },
        {
            id: 5,
            title: "SaaS & Productivity",
            description: "Efficient tools designed to optimize workflows and increase team productivity."
        },
        {
            id: 6,
            title: "Insurance & Legal Affairs",
            description: "Simplification of complex processes through clear design, generating trust and transparency for the user."
        },
    ];

    const areas = language === 'en' ? areasEn : areasEs;

    return (
        <section style={{ marginBottom: "8rem" }}>
            <FadeInUp>
                <h2 style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: "400",
                    color: "white",
                    marginBottom: "3rem",
                    textAlign: "center"
                }}>
                    {t("about.areas.title")}
                </h2>
            </FadeInUp>

            <div className="areas-grid">
                <style jsx>{`
                    .areas-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    @media (min-width: 640px) {
                        .areas-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                    @media (min-width: 1024px) {
                        .areas-grid {
                            grid-template-columns: repeat(3, 1fr);
                        }
                    }
                    .area-card {
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        padding: 1.7rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        min-height: 320px;
                        background: rgba(255, 255, 255, 0.02);
                        transition: all 0.3s ease;
                    }
                    .area-card:hover {
                        background: rgba(255, 255, 255, 0.05);
                        border-color: rgba(255, 255, 255, 0.2);
                        transform: translateY(-4px);
                    }
                    .card-number {
                        font-family: monospace;
                        font-size: 0.9rem;
                        color: #52525b; /* Zinc 600 */
                        margin-bottom: 1rem;
                        display: block;
                    }
                    .card-title {
                        color: white;
                        font-size: 1.2rem;
                        font-weight: 200;
                        line-height: 1.2;
                        margin-bottom: auto; /* Pushes content below down */
                        padding-bottom: 2rem;
                    }
                    .card-desc {
                        color: #a1a1aa;
                        font-size: 0.9rem;
                        line-height: 1.6;
                    }
                `}</style>

                {areas.map((area, index) => (
                    <FadeInUp key={area.id} delay={index * 0.1} yOffset={30}>
                        <div className="area-card">
                            <div>
                                <span className="card-number">
                                    {area.id.toString().padStart(2, '0')}
                                </span>
                                <h3 className="card-title">
                                    {area.title}
                                </h3>
                            </div>

                            <p className="card-desc">
                                {area.description}
                            </p>
                        </div>
                    </FadeInUp>
                ))}
            </div>
        </section>
    );
}
