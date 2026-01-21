import type { Metadata } from 'next';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata: Metadata = {
    title: 'Casos de Estudio',
    description: 'Explora una selección de mis proyectos más recientes en diseño de producto, UX y desarrollo web. Problemas complejos resueltos con estrategia y diseño.',
    openGraph: {
        title: 'Casos de Estudio',
        description: 'Explora una selección de mis proyectos más recientes en diseño de producto, UX y desarrollo web. Problemas complejos resueltos con estrategia y diseño.',
        url: 'https://fcophox.com/case-studies',
        siteName: 'fcoPhox',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function CaseStudiesPage() {
    return <CaseStudiesClient />;
}
