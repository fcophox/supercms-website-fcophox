import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
    title: 'Servicios | fcoPhox',
    description: 'Soluciones de diseño y desarrollo digital para potenciar tu negocio: Desarrollo Web, UX/UI, Análisis de Datos, y Consultoría estratégica.',
    openGraph: {
        title: 'Servicios | fcoPhox',
        description: 'Soluciones de diseño y desarrollo digital para potenciar tu negocio: Desarrollo Web, UX/UI, Análisis de Datos, y Consultoría estratégica.',
        url: 'https://fcophox.com/services',
        siteName: 'fcoPhox',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function ServicesPage() {
    return <ServicesClient />;
}
