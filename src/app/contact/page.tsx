import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contacto',
    description: 'Contáctame para discutir proyectos, colaboraciones o consultorías en diseño de producto y experiencia de usuario UX.',
    openGraph: {
        title: 'Contacto',
        description: 'Contáctame para discutir proyectos, colaboraciones o consultorías en diseño de producto y experiencia de usuario UX.',
        url: 'https://fcophox.com/contact',
        siteName: 'fcoPhox',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
