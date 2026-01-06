"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TimelineItem {
    id: number;
    date: string;
    role: string;
    description: string;
}

const timelineDataEs: TimelineItem[] = [
    {
        id: 1,
        date: "Abril de 2024 hasta la fecha",
        role: "Head of UX & UX Manager",
        description: "Lidero el área de Experiencia de Usuario, gestionando equipos multidisciplinarios y definiendo la estrategia UX de proyectos digitales a gran escala. Mi enfoque está en potenciar la productividad, garantizar procesos de diseño eficientes y fortalecer la cultura de innovación dentro de la organización, siempre con una visión centrada en el usuario y en la mejora continua."
    },
    {
        id: 2,
        date: "Abril de 2021 a enero de 2023",
        role: "Product Designer & UX Strategy",
        description: "Colaboré en el diseño de interfaces y flujos de interacción enfocados en la usabilidad y accesibilidad. Contribuí en la creación de sistemas de diseño, asegurando consistencia visual y funcionalidad en productos digitales, además de participar en procesos de testeo con usuarios."
    },
    {
        id: 3,
        date: "Marzo de 2020 a marzo de 2021",
        role: "UX Designer & UI Designer",
        description: "Colaboré en el diseño de interfaces y flujos de interacción enfocados en la usabilidad y accesibilidad. Contribuí en la creación de sistemas de diseño, asegurando consistencia visual y funcionalidad en productos digitales, además de participar en procesos de testeo con usuarios."
    },
    {
        id: 4,
        date: "Marzo de 2019 a diciembre de 2019",
        role: "Docent UX/UI & Mentor",
        description: "Encabecé la planificación y ejecución de proyectos UX, desde la investigación hasta la entrega de productos finales. Coordiné equipos de diseño y desarrollo, asegurando la alineación entre stakeholders, objetivos de negocio y la experiencia del usuario final."
    },
    {
        id: 5,
        date: "Marzo de 2018 a febrero de 2020",
        role: "Lead UX Designer & UX Manager",
        description: "Encabecé la planificación y ejecución de proyectos UX, desde la investigación hasta la entrega de productos finales. Coordiné equipos de diseño y desarrollo, asegurando la alineación entre stakeholders, objetivos de negocio y la experiencia del usuario final."
    },
    {
        id: 6,
        date: "Septiembre de 2014 a marzo de 2018",
        role: "Director de arte & Director de proyectos digitales",
        description: "Dirigí equipos creativos en el diseño y ejecución de proyectos digitales, integrando identidad visual con estrategias tecnológicas. Lideré la gestión de proyectos, controlando tiempos, recursos y entregables para asegurar calidad e innovación en cada iniciativa."
    },
    {
        id: 7,
        date: "Junio de 2011 a abril de 2014",
        role: "Diseñador gráfico",
        description: "Inicié mi trayectoria profesional en el diseño gráfico, desarrollando identidades visuales, piezas publicitarias y materiales digitales. Esta etapa consolidó mi base creativa, estética y técnica, que luego evolucionó hacia el ámbito de UX y producto digital."
    }
];

const timelineDataEn: TimelineItem[] = [
    {
        id: 1,
        date: "April 2024 to present",
        role: "Head of UX & UX Manager",
        description: "I lead the User Experience area, managing multidisciplinary teams and defining the UX strategy for large-scale digital projects. My focus is on boosting productivity, ensuring efficient design processes, and strengthening the culture of innovation within the organization, always with a user-centered vision and continuous improvement."
    },
    {
        id: 2,
        date: "April 2021 to January 2023",
        role: "Product Designer & UX Strategy",
        description: "I collaborated on the design of interfaces and interaction flows focused on usability and accessibility. I contributed to the creation of design systems, ensuring visual consistency and functionality in digital products, in addition to participating in user testing processes."
    },
    {
        id: 3,
        date: "March 2020 to March 2021",
        role: "UX Designer & UI Designer",
        description: "I collaborated on the design of interfaces and interaction flows focused on usability and accessibility. I contributed to the creation of design systems, ensuring visual consistency and functionality in digital products, in addition to participating in user testing processes."
    },
    {
        id: 4,
        date: "March 2019 to December 2019",
        role: "Docent UX/UI & Mentor",
        description: "I spearheaded the planning and execution of UX projects, from research to the delivery of final products. I coordinated design and development teams, ensuring alignment between stakeholders, business objectives, and the end-user experience."
    },
    {
        id: 5,
        date: "March 2018 to February 2020",
        role: "Lead UX Designer & UX Manager",
        description: "I spearheaded the planning and execution of UX projects, from research to the delivery of final products. I coordinated design and development teams, ensuring alignment between stakeholders, business objectives, and the end-user experience."
    },
    {
        id: 6,
        date: "September 2014 to March 2018",
        role: "Art Director & Digital Project Manager",
        description: "I directed creative teams in the design and execution of digital projects, integrating visual identity with technological strategies. I led project management, controlling times, resources, and deliverables to ensure quality and innovation in every initiative."
    },
    {
        id: 7,
        date: "June 2011 to April 2014",
        role: "Graphic Designer",
        description: "I started my professional career in graphic design, developing visual identities, advertising pieces, and digital materials. This stage consolidated my creative, aesthetic, and technical foundation, which later evolved into the field of UX and digital product."
    }
];

import FadeInUp from "./FadeInUp";

export default function AboutAccordion() {
    const { t, language } = useLanguage();
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const timelineData = language === 'en' ? timelineDataEn : timelineDataEs;

    return (
        <section style={{ marginTop: "8rem", marginBottom: "8rem" }}>
            <FadeInUp>
                <div className="accordion-layout">
                    <style jsx>{`
                        .accordion-layout {
                            display: grid;
                            grid-template-columns: 1fr;
                            gap: 4rem;
                        }
                        @media (min-width: 1024px) {
                            .accordion-layout {
                                grid-template-columns: 1fr 1.5fr;
                            }
                        }
                    `}</style>

                    {/* Left Column: Title & Description */}
                    <div>
                        <h2 style={{
                            fontSize: "clamp(2rem, 4vw, 2.5rem)",
                            fontWeight: "100",
                            color: "white",
                            marginBottom: "1.5rem",
                            lineHeight: 1.2
                        }}>
                            {t("about.accordion.title")}
                        </h2>
                        <p style={{
                            color: "#a1a1aa",
                            fontSize: "1.1rem",
                            lineHeight: 1.6,
                            maxWidth: "90%"
                        }}>
                            {t("about.accordion.desc")}
                        </p>
                    </div>

                    {/* Right Column: Accordion List */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {timelineData.map((item, index) => (
                            <FadeInUp key={item.id} delay={index * 0.05} yOffset={20}>
                                <div
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                                        cursor: "pointer",
                                        transition: "background 0.3s ease"
                                    }}
                                >
                                    <div style={{
                                        padding: "2rem 0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: "1rem"
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <span style={{
                                                display: "block",
                                                color: "var(--text-muted)",
                                                fontWeight: "300",
                                                fontSize: "0.9rem",
                                                marginBottom: "0.5rem",
                                                opacity: 0.4
                                            }}>
                                                {item.date}
                                            </span>
                                            <h3 style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "500",
                                                color: hoveredId === item.id ? "white" : "#e5e5e5",
                                                transition: "color 0.2s"
                                            }}>
                                                {item.role}
                                            </h3>

                                            <div style={{
                                                display: "grid",
                                                gridTemplateRows: hoveredId === item.id ? "1fr" : "0fr",
                                                transition: "grid-template-rows 0.4s ease-out",
                                                opacity: hoveredId === item.id ? 1 : 0,
                                            }}>
                                                <div style={{ overflow: "hidden" }}>
                                                    <p style={{
                                                        color: "#a1a1aa",
                                                        fontSize: "1rem",
                                                        lineHeight: 1.6,
                                                        marginTop: "1rem",
                                                        maxWidth: "90%"
                                                    }}>
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronDown
                                            size={20}
                                            color="white"
                                            style={{
                                                transform: hoveredId === item.id ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.4s ease",
                                                opacity: 0.5,
                                                marginTop: "1.5rem"
                                            }}
                                        />
                                    </div>
                                </div>
                            </FadeInUp>
                        ))}
                    </div>
                </div>
            </FadeInUp>
        </section>
    );
}
