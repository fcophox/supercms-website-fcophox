"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import FadeInUp from "./FadeInUp";

interface TimelineItem {
    id: number;
    date: string;
    role: string;
    description: string;
    skills: string[];
    image?: string;
}

const timelineDataEs: TimelineItem[] = [
    {
        id: 1,
        date: "Abril de 2024 hasta la fecha",
        role: "Head of UX & UX Manager",
        description: "Lidero el área de Experiencia de Usuario, gestionando equipos multidisciplinarios y definiendo la estrategia UX de proyectos digitales a gran escala. Mi enfoque está en potenciar la productividad, garantizar procesos de diseño eficientes y fortalecer la cultura de innovación dentro de la organización, siempre con una visión centrada en el usuario y en la mejora continua.",
        skills: ["Estrategia UX", "Gestión de equipos", "Liderazgo en diseño", "Product Discovery"],
        // image: "/projects/fcophox/mockups/1.png"
    },
    {
        id: 2,
        date: "Abril de 2021 a enero de 2023",
        role: "Product Designer & UX Strategy",
        description: "Colaboré en el diseño de interfaces y flujos de interacción enfocados en la usabilidad y accesibilidad. Contribuí en la creación de sistemas de diseño, asegurando consistencia visual y funcionalidad en productos digitales, además de participar en procesos de testeo con usuarios.",
        skills: ["Sistemas de diseño", "Accesibilidad", "Testeo con usuarios", "Prototipado"]
    },
    {
        id: 3,
        date: "Marzo de 2020 a marzo de 2021",
        role: "UX Designer & UI Designer",
        description: "Colaboré en el diseño de interfaces y flujos de interacción enfocados en la usabilidad y accesibilidad. Contribuí en la creación de sistemas de diseño, asegurando consistencia visual y funcionalidad en productos digitales, además de participar en procesos de testeo con usuarios.",
        skills: ["Diseño de interacción", "Diseño visual", "Validación UX"]
    },
    {
        id: 4,
        date: "Marzo de 2019 a diciembre de 2019",
        role: "Docente UX/UI & Mentor",
        description: "Enseñé a estudiantes de Informática los fundamentos de UX/UI, demostrando los beneficios de comprender la experiencia de usuario y la usabilidad. Hice gran énfasis en la importancia de cómo se sienten los usuarios al interactuar con entornos digitales, guiándolos para integrar una visión centrada en el ser humano dentro del desarrollo de software.",
        skills: ["Mentoría", "Enseñanza", "Evaluación de proyectos"]
    },
    {
        id: 5,
        date: "Marzo de 2018 a febrero de 2020",
        role: "Lead UX Designer & UX Manager",
        description: "Encabecé la planificación y ejecución de proyectos UX, desde la investigación hasta la entrega de productos finales. Coordiné equipos de diseño y desarrollo, asegurando la alineación entre stakeholders, objetivos de negocio y la experiencia del usuario final.",
        skills: ["Coordinación de equipos", "Alineación de negocio", "Investigación UX"]
    },
    {
        id: 6,
        date: "Septiembre de 2014 a marzo de 2018",
        role: "Director de arte & Director de proyectos digitales",
        description: "Dirigí equipos creativos en el diseño y ejecución de proyectos digitales, integrando identidad visual con estrategias tecnológicas. Lideré la gestión de proyectos, controlando tiempos, recursos y entregables para asegurar calidad e innovación en cada iniciativa.",
        skills: ["Dirección de arte", "Gestión de proyectos", "Identidad visual"]
    },
    {
        id: 7,
        date: "Junio de 2011 a abril de 2014",
        role: "Diseñador gráfico",
        description: "Inicié mi trayectoria profesional en el diseño gráfico, desarrollando identidades visuales, piezas publicitarias y materiales digitales. Esta etapa consolidó mi base creativa, estética y técnica, que luego evolucionó hacia el ámbito de UX y producto digital.",
        skills: ["Diseño gráfico", "Publicidad", "Manejo de identidad"]
    }
];

const timelineDataEn: TimelineItem[] = [
    {
        id: 1,
        date: "April 2024 to present",
        role: "Head of UX & UX Manager",
        description: "I lead the User Experience area, managing multidisciplinary teams and defining the UX strategy for large-scale digital projects. My focus is on boosting productivity, ensuring efficient design processes, and strengthening the culture of innovation within the organization, always with a user-centered vision and continuous improvement.",
        skills: ["UX Strategy", "Team Management", "Design Leadership", "Product Discovery"],
        // image: "/projects/fcophox/mockups/1.png"
    },
    {
        id: 2,
        date: "April 2021 to January 2023",
        role: "Product Designer & UX Strategy",
        description: "I collaborated on the design of interfaces and interaction flows focused on usability and accessibility. I contributed to the creation of design systems, ensuring visual consistency and functionality in digital products, in addition to participating in user testing processes.",
        skills: ["Design Systems", "Accessibility", "User Testing", "Prototyping"]
    },
    {
        id: 3,
        date: "March 2020 to March 2021",
        role: "UX Designer & UI Designer",
        description: "I collaborated on the design of interfaces and interaction flows focused on usability and accessibility. I contributed to the creation of design systems, ensuring visual consistency and functionality in digital products, in addition to participating in user testing processes.",
        skills: ["Interaction Design", "Visual Design", "UX Validation"]
    },
    {
        id: 4,
        date: "March 2019 to December 2019",
        role: "Docent UX/UI & Mentor",
        description: "I taught Informatics students the fundamentals of UX/UI, demonstrating the benefits of understanding user experience and usability. I placed great emphasis on the importance of how users feel when interacting with digital environments, guiding them to integrate a human-centered vision into software development.",
        skills: ["Mentoring", "Teaching", "Project Evaluation"]
    },
    {
        id: 5,
        date: "March 2018 to February 2020",
        role: "Lead UX Designer & UX Manager",
        description: "I spearheaded the planning and execution of UX projects, from research to the delivery of final products. I coordinated design and development teams, ensuring alignment between stakeholders, business objectives, and the end-user experience.",
        skills: ["Team Coordination", "Business Alignment", "UX Research"]
    },
    {
        id: 6,
        date: "September 2014 to March 2018",
        role: "Art Director & Digital Project Manager",
        description: "I directed creative teams in the design and execution of digital projects, integrating visual identity with technological strategies. I led project management, controlling times, resources, and deliverables to ensure quality and innovation in every initiative.",
        skills: ["Art Direction", "Project Management", "Visual Identity"]
    },
    {
        id: 7,
        date: "June 2011 to April 2014",
        role: "Graphic Designer",
        description: "I started my professional career in graphic design, developing visual identities, advertising pieces, and digital materials. This stage consolidated my creative, aesthetic, and technical foundation, which later evolved into the field of UX and digital product.",
        skills: ["Graphic Design", "Advertising", "Brand Identity"]
    }
];

export default function AboutAccordion() {
    const { t, language } = useLanguage();

    const timelineData = language === 'en' ? timelineDataEn : timelineDataEs;
    const [activeId, setActiveId] = useState<number>(timelineData[0].id);

    // Create refs for continuous scrolling detection
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = Number(entry.target.getAttribute("data-id"));
                        if (id) setActiveId(id);
                    }
                });
            },
            {
                rootMargin: "-30% 0px -40% 0px",
                threshold: 0
            }
        );

        // Allow DOM to settle before observing
        const timer = setTimeout(() => {
            itemRefs.current.forEach((ref) => {
                if (ref) observer.observe(ref);
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [timelineData]);

    const handleScrollTo = (id: number) => {
        setActiveId(id);
        const element = itemRefs.current.find(ref => Number(ref?.getAttribute("data-id")) === id);
        if (element) {
            // Adjust offset to avoid overriding navbar or scrolling too much
            const y = element.getBoundingClientRect().top + window.scrollY - 150;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <section className="mt-32 mb-32">
            <FadeInUp>

                <div className="flex flex-col gap-8 max-w-4xl">
                    <div className="sticky top-[120px] flex flex-col gap-8">
                        <div>
                            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-thin text-white mb-6 leading-tight">
                                {t("about.accordion.title")}
                            </h2>
                            <p className="text-[#a1a1aa] text-[1.1rem] leading-relaxed max-w-[90%]">
                                {t("about.accordion.desc")}
                            </p>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start pt-16">
                    {/* Left Column: Title & Description & Roles List (Sticky) */}
                    <div className="hidden lg:flex sticky top-[120px] flex-col gap-8">
                        {/* Roles List */}
                        <div className="flex flex-col gap-4 mt-4 max-h-[60vh] overflow-y-auto pr-4">
                            {timelineData.map((item) => {
                                const isActive = activeId === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleScrollTo(item.id)}
                                        className={`flex items-center gap-4 bg-transparent border-none cursor-pointer text-left transition-colors duration-300 py-2 text-[0.95rem] ${isActive ? "text-white font-medium" : "text-zinc-500 font-normal"}`}
                                    >
                                        <div
                                            className={`h-0.5 rounded-full transition-all duration-300 shrink-0 ${isActive ? "w-6 bg-[#5b4eff]" : "w-1 h-1 bg-zinc-600 rounded-full"}`}
                                        />
                                        <span>{item.role}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Scrolling Experience Timeline */}
                    <div className="flex flex-col gap-24">
                        {timelineData.map((item, index) => {
                            const isActive = activeId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    data-id={item.id}
                                    ref={(el) => { itemRefs.current[index] = el; }}
                                    className={`transition-opacity  mb-12 duration-500 ${isActive ? "opacity-100" : "opacity-100"}`}
                                >
                                    <span className="inline-block text-[#5b4eff] font-medium text-[0.7rem] tracking-wider mb-6 bg-[#5b4eff]/10 px-4 py-1.5 rounded-full border border-[#5b4eff]/20">
                                        {item.date}
                                    </span>
                                    <h3 className="text-[clamp(1.4rem,3vw,1rem)] font-light text-white leading-tight mb-6">
                                        {item.role}
                                    </h3>

                                    {item.image && (
                                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-white/10 group">
                                            <Image
                                                src={item.image}
                                                alt={`${item.role} mockup`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    <p className="text-white opacity-60 text-[1rem] leading-relaxed mb-10">
                                        {item.description}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {item.skills.map((skill, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-[#5b4eff] mt-0.5 shrink-0" strokeWidth={1.5} />
                                                <span className="text-[#e5e5e5] text-[0.95rem] leading-snug">
                                                    {skill}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </FadeInUp>
        </section>
    );
}
