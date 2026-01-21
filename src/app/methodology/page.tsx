import type { Metadata } from 'next';
import MethodologyClient from './MethodologyClient';

export const metadata: Metadata = {
    title: 'Metodología y Certificaciones',
    description: 'Conoce mi metodología de trabajo y certificaciones profesionales. Un enfoque basado en datos, UX Research y diseño centrado en el usuario.',
    openGraph: {
        title: 'Metodología y Certificaciones',
        description: 'Conoce mi metodología de trabajo y certificaciones profesionales. Un enfoque basado en datos, UX Research y diseño centrado en el usuario.',
        url: 'https://fcophox.com/methodology',
        siteName: 'fcoPhox',
        images: [
            {
                url: '/methodology/methodology.png',
                width: 1200,
                height: 630,
                alt: 'Metodología de trabajo fcoPhox',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
};

export default function MethodologyPage() {
    return <MethodologyClient />;
}
