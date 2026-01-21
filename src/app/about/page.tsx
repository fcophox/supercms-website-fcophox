import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'Sobre Mí',
    description: 'Conoce mi trayectoria como Product Designer y Consultor UX. Experiencia en rediseños, estrategia de producto y optimización de experiencias digitales.',
    openGraph: {
        title: 'Sobre Mí',
        description: 'Conoce mi trayectoria como Product Designer y Consultor UX. Experiencia en rediseños, estrategia de producto y optimización de experiencias digitales.',
        url: 'https://fcophox.com/about',
        siteName: 'fcoPhox',
        images: [
            {
                url: '/about/desk.png',
                width: 1200,
                height: 630,
                alt: 'Espacio de trabajo de fcoPhox',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
