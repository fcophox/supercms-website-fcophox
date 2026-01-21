"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation dictionary for static text
const translations: Record<string, Record<Language, string>> = {
    "nav.home": { es: "Inicio", en: "Home" },
    "nav.about": { es: "Sobre mí", en: "About" },
    "nav.services": { es: "Servicios", en: "Services" },
    "nav.blog": { es: "Blog", en: "Blog" },
    "nav.contact": { es: "Contacto", en: "Contact" },
    "nav.methodology": { es: "Metodología", en: "Methodology" },

    "hero.title.line1": { es: "Optimización de", en: "Optimizing" },
    "hero.title.highlight1": { es: "experiencias", en: "Digital" },
    "hero.title.highlight2": { es: "digitales", en: "Experiences" },
    "hero.description": { es: "Estrategia, estética y usabilidad combinada para optimizar experiencias digitales que conectan personas con lo digital.", en: "Strategy, aesthetics, and usability combined to optimize digital experiences that connect people with the digital world." },
    "hero.buttons.projects": { es: "Ver proyectos", en: "View Projects" },

    "home.blog.title": { es: "Artículos sobre diseño, tecnología y tendencias que moldean el futuro digital.", en: "Articles on design, technology, and trends shaping the digital future." },
    "home.blog.viewAll": { es: "Ver todos", en: "View all" },

    "home.logos.title": { es: "Experiencia respaldada por el conocimiento", en: "Experience backed by knowledge" },
    "home.logos.link": { es: "Revisa los estudios", en: "Check qualifications" },

    "common.backHome": { es: "Volver al Inicio", en: "Back to Home" },
    "common.readMore": { es: "Leer más", en: "Read more" },
    "common.loading": { es: "Cargando...", en: "Loading..." },
    "common.error": { es: "Error", en: "Error" },

    "blog.title": { es: "Blog", en: "Blog" },
    "blog.subtitle": { es: "Aquí comparto mis conocimientos, reflexiones y aprendizajes sobre diseño, tecnología y desarrollo de productos digitales.", en: "Here I share my knowledge, reflections, and learnings about design, technology, and digital product development." },
    "blog.readArticle": { es: "Leer artículo", en: "Read article" },
    "blog.empty": { es: "No hay artículos publicados aún.", en: "No articles published yet." },
    "blog.back": { es: "Volver al Blog", en: "Back to Blog" },

    "services.title": { es: "Servicios", en: "Services" },
    "services.subtitle": { es: "Soluciones diseñadas para potenciar tu producto digital y estrategia de negocio.", en: "Solutions designed to enhance your digital product and business strategy." },
    "services.empty": { es: "No hay servicios disponibles.", en: "No services available." },
    "services.view": { es: "Ver servicio", en: "View service" },
    "services.back": { es: "Volver a Servicios", en: "Back to Services" },

    "cases.title": { es: "Casos de Estudio", en: "Case Studies" },
    "cases.subtitle": { es: "Proyectos reales donde hemos aplicado nuestras metodologías para resolver problemas complejos.", en: "Real projects where we have applied our methodologies to solve complex problems." },
    "cases.readCase": { es: "Leer caso", en: "Read case" },
    "cases.empty": { es: "No hay casos publicados aún.", en: "No case studies published yet." },
    "cases.back": { es: "Volver a Casos", en: "Back to Case Studies" },

    "footer.rights": { es: "Todos los derechos reservados", en: "All rights reserved" },

    "about.title": { es: "La experiencia como el resultado", en: "Experience as the outcome" },
    "about.description": { es: "He recorrido un camino de evolución constante: aprendiendo, certificándome y colaborando con grandes profesionales.", en: "I have traveled a path of constant evolution: learning, earning certifications, and collaborating with great professionals." },
    "about.imageAlt": { es: "Espacio de trabajo", en: "Workspace" },

    "about.history1.title": { es: "Diseñando experiencias desde 2015", en: "Designing experiences since 2015" },
    "about.history1.desc": { es: "Desde mis inicios, combino creatividad y estrategia para que cada proyecto sea útil, humano y memorable.", en: "From the beginning, I combine creativity and strategy to make every project useful, human, and memorable." },

    "about.history2.title": { es: "Una historia que evoluciona", en: "A story that evolves" },
    "about.history2.desc": { es: "De pequeñas consultorías y prototipos en cafeterías a proyectos de alto impacto, siempre en búsqueda de aprender, compartir y crecer.", en: "From small consultancies and prototypes in coffee shops to high-impact projects, always seeking to learn, share, and grow." },

    "about.services.title": { es: "Contrátame para", en: "Hire me for" },
    "about.services.web": { es: "Desarrollo Web", en: "Web Development" },
    "about.services.data": { es: "Análisis de Datos", en: "Data Analysis" },
    "about.services.networks": { es: "Administración de Redes", en: "Network Administration" },
    "about.services.uiux": { es: "Diseño UI/UX", en: "UI/UX Design" },
    "about.services.support": { es: "Soporte Técnico", en: "Technical Support" },

    "about.bio.title": { es: "Biografía", en: "Biography" },
    "about.bio.certification": { es: "Certificado UX-PM en los 3 niveles en Experiencia de usuarios por Ayer Viernes y la UX Alliance.", en: "Certified UX-PM in three levels in User Experience by Ayer Viernes and UX Alliance." },
    "about.bio.role": { es: "Consultor en investigación, optimización y medición de experiencia para productos digitales basadas en datos, diseño e inteligencia artificial.", en: "Consultant in research, optimization, and measurement of experience for digital products based on data, design, and artificial intelligence." },
    "about.bio.mission": { es: "Colaboro con equipos, emprendedores y start-up en la creación, evaluación y mejora continua de productos digitales, asegurando que cada decisión tenga impacto medible en experiencia y usabilidad para el negocio.", en: "Collaborate with teams, entrepreneurs, and start-ups in the creation, evaluation, and continuous improvement of digital products, ensuring that each decision has measurable impact on experience and usability for the business." },
    "about.bio.linkedin": { es: "Visita mi LinkedIn", en: "Visit my LinkedIn" },
    "about.bio.github": { es: "GitHub", en: "GitHub" },

    "contact.title": { es: "Hablemos", en: "Let's Talk" },
    "contact.subtitle": { es: "¿Tienes un proyecto en mente? Envíame un mensaje y te responderé lo antes posible.", en: "Have a project in mind? Send me a message and I'll get back to you as soon as possible." },
    "contact.form.name": { es: "Nombre", en: "Name" },
    "contact.form.email": { es: "Correo electrónico", en: "Email" },
    "contact.form.message": { es: "Mensaje", en: "Message" },
    "contact.form.submit": { es: "Enviar mensaje", en: "Send Message" },
    "contact.form.sending": { es: "Enviando...", en: "Sending..." },
    "contact.form.success": { es: "Mensaje enviado correctamente.", en: "Message sent successfully." },
    "contact.form.error": { es: "Hubo un error al enviar el mensaje.", en: "There was an error sending the message." },
    "contact.form.namePlaceholder": { es: "Tu nombre", en: "Your name" },
    "contact.form.emailPlaceholder": { es: "tu@correo.com", en: "you@email.com" },
    "contact.form.messagePlaceholder": { es: "Cuéntame sobre tu proyecto...", en: "Tell me about your project..." },
    "about.accordion.title": { es: "Evolución a lo largo del tiempo", en: "Evolution over time" },
    "about.accordion.desc": { es: "He pasado por diversas etapas, desde el diseño gráfico hasta el liderazgo en UX, siempre buscando resolver problemas reales y aportar valor a través del diseño.", en: "I have gone through various stages, from graphic design to UX leadership, always seeking to solve real problems and provide value through design." },
    "about.areas.title": { es: "Áreas en las que he colaborado", en: "Areas where I have collaborated" },

    // Methodology Page
    "methodology.hero.title": { es: "Metodología y formación profesional", en: "Methodology and professional training." },
    "methodology.hero.description": { es: "Decisiones de diseño aplicadas, mejoras medibles y experiencias usables que den valor a los productos digitales y faciliten el uso, es el sentido del conocimiento, busco resolver problemáticas reales de los negocios, pensando en los usuarios.", en: "Design decisions applied, measurable improvements and usable experiences that add value to digital products and facilitate use, is the sense of knowledge, I seek to solve real business problems, thinking about users." },
    "methodology.hero.videoOverlay": { es: "Proceso de trabajo", en: "Work Process" },
    "methodology.hero.downloadCV": { es: "Descargar CV", en: "Download CV" },
    "methodology.hero.downloadCV.tooltip": { es: "😜 Pronto, en creación...", en: "😜 Coming soon, in creation..." },
    "methodology.hero.chronicleTitle": { es: "Diseñar con método, criterio y visión de impacto", en: "Designing with Method, Judgment, and Impact Vision" },
    "methodology.hero.chronicleDesc": { es: "Mi enfoque metodológico no es rígido ni dogmático. Combino la base del UX con prácticas modernas de Product Discovery, Product Delivery y UX Engineering, adaptándolos al contexto real de cada organización, equipo o producto. Trabajo desde la hipótesis hasta la validación, integrando negocio, tecnología y experiencia para reducir fricción, acelerar decisiones y maximizar valor.", en: "My methodological approach is neither rigid nor dogmatic. I combine the foundation of UX with modern Product Discovery, Product Delivery, and UX Engineering practices, adapting them to the real context of each organization, team, or product. I work from hypothesis to validation, integrating business, technology, and experience to reduce friction, accelerate decisions, and maximize value." },
    "methodology.certifications.title": { es: "Estudios y certificaciones", en: "Studies and Certifications" },
    "methodology.certifications.filter.all": { es: "Mostrar Todos", en: "Show All" },
    "methodology.certifications.filter.certification": { es: "Certificaciones", en: "Certifications" },
    "methodology.certifications.filter.diploma": { es: "Diplomados", en: "Diplomas" },
    "methodology.certifications.filter.course": { es: "Cursos & Bootcamps", en: "Courses & Bootcamps" },

    "footer.sitemap": { es: "Mapa del sitio", en: "Sitemap" },
    "footer.socials": { es: "Redes sociales", en: "Socials" },
    "footer.role": { es: "Sr. Product Designer | UX & CRO Consultant | UX Engineer", en: "Sr. Product Designer | UX & CRO Consultant | UX Engineer" },
    "footer.cta.text": { es: "¿Tienes un proyecto en mente?", en: "Have a project in mind?" },
    "footer.cta.button": { es: "Contáctame", en: "Contact me" },
    "methodology.process.caption": {
        es: "Este proceso creado desde la experiencia empírica y de manera autónoma, tras años de experiencias en Consultoria en UX y usabilidad, abordando diferentes proyectos con diferentes profesionales y diferentes clientes. Product Experience Optimization Engineer (PEOE), tiene un enfoque disciplinado y cíclico que combina, la investigación, los datos, el desarrollo de prototipos y codificación, y medición de experiencias, todo desde un mismo perfil, con la experiencias, la visión y expertise del Product Designer.", en: "This process, created from empirical experience and independently, after years of experience in UX and usability consulting, tackling different projects with different professionals and different clients, is called Product Experience Optimization Engineer (PEOE). It has a disciplined and cyclical approach that combines research, data, prototype development and coding, and experience measurement, all from the same profile, with the experience, vision, and expertise of the Product Designer."
    },

    "contact.cta.title": { es: "Estemos en contacto", en: "Contact us" },
    "contact.cta.desc": { es: "¿Interesado en colaborar? Estamos listos para impulsar tu próximo proyecto tecnológico.", en: "Interested in collaborating? We are ready to boost your next tech project." },
    "contact.cta.button": { es: "Estemos en contacto", en: "Get in touch" },

    "like.title": { es: "¿Te parece interesante este contenido?", en: "Do you find this content interesting?" },
    "like.description": { es: "Envía un aplauso si te parece interesante, con tu apoyo seguiré creando contenido.", en: "Send a clap if you find it interesting; with your support, I will continue creating content." },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('es');

    useEffect(() => {
        const storedLang = localStorage.getItem('app_language') as Language;
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        localStorage.setItem('app_language', newLang);
    };

    const t = (key: string): string => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
