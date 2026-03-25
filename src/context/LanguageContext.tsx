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

    "home.bento.strategy.title": { es: "Estrategia, diseño y código para resolver problemas digitales", en: "Strategy, design and code to solve digital problems" },
    "home.bento.strategy.desc": { es: "Una visión global del ciclo de vida de un producto, resolviendo problemas reales a través del diseño.", en: "A global vision of the product lifecycle, solving real problems through design." },
    "home.bento.strategy.step1": { es: "Discovery & Research", en: "Discovery & Research" },
    "home.bento.strategy.step2": { es: "Diseño & Prototipado", en: "Design & Prototyping" },
    "home.bento.strategy.step3": { es: "MVP & Código", en: "MVP & Code" },
    "home.bento.strategy.step4": { es: "Entrega del producto", en: "Product Delivery" },
    "home.bento.strategy.btn": { es: "Get in touch", en: "Get in touch" },

    "home.bento.tools.text": { es: "Integro IA para investigar en profundidad, decidir con datos y optimizar experiencias digitales.", en: "I integrate AI to research in depth, decide with data, and optimize digital experiences." },
    "home.bento.tools.link": { es: "Ver artículo", en: "View article" },

    "home.bento.evolution.title": { es: "Evolución a lo largo del tiempo", en: "Evolution over time" },
    "home.bento.services.title": { es: "Servicios enfocados en optimización", en: "Services focused on optimization" },
    "home.bento.services.item1": { es: "Investigación de la experiencia del usuario", en: "User experience research" },
    "home.bento.services.item2": { es: "Diseño de interfaz", en: "Interface design" },
    "home.bento.services.item3": { es: "Prototipado Vibe Coding de MVP", en: "MVP Vibe Coding prototyping" },
    "home.bento.services.item4": { es: "Facilitación de talleres de UX", en: "UX workshops facilitation" },
    "home.bento.services.item5": { es: "Desarrollo de productos digitales", en: "Digital products development" },
    "home.bento.services.item6": { es: "Revisión de la arquitectura de la información", en: "Information architecture review" },
    "home.bento.services.item7": { es: "Consultoría de IA e Innovación", en: "AI & Innovation consulting" },
    "home.bento.services.item8": { es: "Implementación del Design System", en: "Design system implementation" },

    "home.bento.methodology.title": { es: "La metodología", en: "The methodology" },
    "home.bento.methodology.desc": { es: "Trabajo con una metodología iterativa que conecta investigación, diseño, datos y tecnología para optimizar experiencias reales, no solo interfaces.", en: "I work with an iterative methodology that connects research, design, data and technology to optimize real experiences, not just interfaces." },
    "home.bento.methodology.tab1": { es: "Idear", en: "Ideate" },
    "home.bento.methodology.tab2": { es: "Ejecutar", en: "Execute" },
    "home.bento.methodology.tab3": { es: "Medir", en: "Measure" },
    "home.bento.methodology.tab4": { es: "Liberar", en: "Delivery" },
    "home.bento.methodology.tab1.desc": { es: "Descubrir oportunidades reales y delinear la estrategia base.", en: "Discover real opportunities and outline the core strategy." },
    "home.bento.methodology.tab2.desc": { es: "Codificar y llevar a cabo las soluciones planeadas.", en: "Code and bring the planned solutions to life." },
    "home.bento.methodology.tab3.desc": { es: "Analizar el impacto y mejorar iterativamente.", en: "Analyze the impact and iteratively improve." },
    "home.bento.methodology.tab4.desc": { es: "Llevar la solución a producción asegurando calidad y rendimiento sostenido.", en: "Bring the solution to production ensuring quality and sustained performance." },
    "home.bento.methodology.more": { es: "Ver más información", en: "View more information" },

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

    "contact.title.line1": { es: "Construyamos lo que ", en: "Let's build what's " },
    "contact.title.highlight": { es: "sigue", en: "next" },
    "contact.intro.title": { es: "¡Iniciemos la comunicación!", en: "Let's start the communication!" },
    "contact.intro.text": { es: "Si tienes una pregunta, una idea de negocio o un proyecto en mente, contáctame y comencemos a construir juntos algo impactante.", en: "If you have a question, a business idea or a project in mind, contact me and let's start building something impactful together." },
    "contact.form.name": { es: "Nombre", en: "Name" },
    "contact.form.email": { es: "Correo electrónico", en: "Email" },
    "contact.form.message": { es: "Mensaje", en: "Message" },
    "contact.form.question": { es: "¿Cómo puedo ayudarte?", en: "How can I help you?" },
    "contact.form.type.message": { es: "Enviar mensaje", en: "Send message" },
    "contact.form.type.consulting": { es: "Consultoría UX", en: "UX Consulting" },
    "contact.form.type.diagnostic": { es: "Agendar reunión", en: "Schedule meeting" },
    "contact.form.type.disabledTooltip": { es: "Pronto, una nueva manera de comunicarnos", en: "Soon, a new way to communicate" },
    "contact.form.submit": { es: "Enviar", en: "Send" },
    "contact.form.sending": { es: "Enviando...", en: "Sending..." },
    "contact.form.success": { es: "Mensaje enviado correctamente.", en: "Message sent successfully." },
    "contact.form.error": { es: "Hubo un error al enviar el mensaje.", en: "There was an error sending the message." },
    "contact.form.namePlaceholder": { es: "Tu nombre", en: "Your name" },
    "contact.form.emailPlaceholder": { es: "tu@correo.com", en: "you@email.com" },
    "contact.form.messagePlaceholder": { es: "Cuéntame sobre tu proyecto...", en: "Tell me about your project..." },
    "contact.form.help.message": { es: "Cuéntame en qué estás trabajando o qué necesitas mejorar.", en: "Tell me what you are working on or what you need to improve." },
    "contact.form.help.consulting": { es: "Reserva una sesión conmigo y revisemos tu producto en profundidad.", en: "Book a session with me to review your product in depth." },
    "contact.form.help.diagnostic": { es: "Elige un horario disponible y conversemos directamente.", en: "Choose an available time and let's talk directly." },
    "contact.form.quote.message": { es: "Te responderé personalmente en el menor tiempo posible.", en: "I will respond personally as soon as possible." },
    "contact.form.quote.consulting": { es: "Te llevarás recomendaciones claras, accionables y basadas en experiencia real.", en: "You will get clear, actionable recommendations based on real experience." },
    "contact.form.quote.diagnostic": { es: "Será un espacio breve para entender tu necesidad y ver cómo puedo ayudarte.", en: "It will be a brief space to understand your need and see how I can help you." },
    "contact.form.budget.title": { es: "¿Tienes un presupuesto inicial?", en: "Do you have an initial budget?" },
    "contact.form.budget.desc": { es: "Actívalo si ya cuentas con una idea inicial de inversión.", en: "Activate it if you already have an initial investment idea." },
    "contact.form.budget.range": { es: "Rango de inversión inicial", en: "Initial investment range" },
    "contact.form.budget.hint": { es: "Es importante cuidar los recursos, esto ayudará a ajustar entregables en tiempo y forma. (Es solo una referencia)", en: "It is important to manage resources, this will help adapt deliverables in time and scope. (It is just a reference)" },
    "contact.form.consulting.devTime": { es: "Tiempo estimado de desarrollo", en: "Estimated development time" },
    "contact.form.consulting.devTimePlaceholder": { es: "Ej. 2 meses", en: "E.g. 2 months" },
    "contact.form.consulting.urlTitle": { es: "URL a consultar", en: "Target URL to analyze" },
    "contact.form.consulting.optional": { es: "(Opcional)", en: "(Optional)" },
    "contact.form.diagnostic.dateLabel": { es: "Selecciona el día para agendar", en: "Select the day to schedule" },
    "contact.form.diagnostic.meetingLabel": { es: "Horario de reunión (15 mins)", en: "Meeting time (15 mins)" },
    "contact.form.diagnostic.meetingOption0": { es: "Selecciona un horario disponible...", en: "Select an available time..." },
    "contact.form.diagnostic.meetingOption1": { es: "Hoy a las 10:00 AM", en: "Today at 10:00 AM" },
    "contact.form.diagnostic.meetingOption2": { es: "Hoy a las 11:30 AM", en: "Today at 11:30 AM" },
    "contact.form.diagnostic.meetingOption3": { es: "Hoy a las 2:15 PM", en: "Today at 2:15 PM" },
    "contact.form.diagnostic.meetingOption4": { es: "Mañana a las 4:00 PM", en: "Tomorrow at 4:00 PM" },
    "contact.form.diagnostic.meetingOption5": { es: "Mañana a las 5:45 PM", en: "Tomorrow at 5:45 PM" },
    "contact.form.diagnostic.meetingNote": { es: "Reunión de contacto por Teams o Google Meet.", en: "Contact meeting via Teams or Google Meet." },
    "contact.form.badge.soon": { es: "Pronto", en: "Soon" },

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

    "contact.reason1": { es: "Asesoría experta en Producto Digital", en: "Expert advice on Digital Product" },
    "contact.reason2": { es: "Diseño centrado en resultados", en: "Results-focused design" },
    "contact.reason3": { es: "Respuesta rápida y personalizada", en: "Fast and personalized response" },
    "contact.reason4": { es: "Soluciones escalables y mantenibles", en: "Scalable and maintainable solutions" },
    "contact.reason5": { es: "Metodología probada", en: "Proven methodology" },
    "contact.reason6": { es: "Compromiso con la calidad", en: "Commitment to quality" },

    "like.title": { es: "¿Te parece interesante este contenido?", en: "Do you find this content interesting?" },
    "like.description": { es: "Dale un like si te parece interesante, con tu apoyo seguiré creando contenido.", en: "Give it a like if you find it interesting; with your support, I will continue creating content." },

    "contact.extended.title": { es: "Otras formas de conectar", en: "Other ways to connect" },
    "contact.card.schedule.title": { es: "Agenda Virtual", en: "Virtual Agenda" },
    "contact.card.schedule.desc": { es: "Agenda una reunión virtual directamente en mi calendario disponible.", en: "Schedule a virtual meeting directly on my available calendar." },
    "contact.card.schedule.button": { es: "Agendar reunión", en: "Schedule meeting" },
    "contact.card.schedule.soon": { es: "Pronto estará disponible", en: "Coming soon" },
    "contact.card.cases.title": { es: "Casos de Estudio", en: "Case Studies" },
    "contact.card.cases.desc": { es: "Conoce mis Casos de estudio y cómo he resuelto problemas complejos.", en: "Explore my Case Studies and see how I've solved complex problems." },
    "contact.card.cases.button": { es: "Ver Casos", en: "View Cases" },

    "contact.error.invalidEmail": { es: "Por favor ingresa un correo electrónico válido.", en: "Please enter a valid email address." },
    "contact.error.spamDetected": { es: "Mensaje no enviado. Se ha detectado contenido sospechoso.", en: "Message not sent. Suspicious content detected." },
    "contact.error.invalidName": { es: "Por favor ingresa un nombre válido.", en: "Please enter a valid name." },

    "cases.prev": { es: "Caso Anterior", en: "Previous Case" },
    "cases.next": { es: "Siguiente Caso", en: "Next Case" },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('es');

    useEffect(() => {
        const storedLang = localStorage.getItem('app_language') as Language;
        if (storedLang) {
            // eslint-disable-next-line
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
