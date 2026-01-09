
import type { Metadata } from 'next';
import ServiceClient from './ServiceClient';
import { supabase } from '@/lib/supabaseClient';

type Props = {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const slug = params.slug

    const { data: service } = await supabase
        .from('services')
        .select('title, title_en, image_url, content')
        .or(`slug.eq.${slug},slug_en.eq.${slug}`)
        .single()

    if (!service) {
        return {
            title: 'Servicio no encontrado | fcoPhox',
        }
    }

    const title = service.title;
    const description = service.content ? service.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : '';

    return {
        title: `${title} | Servicios fcoPhox`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://fcophox.com/services/${slug}`,
            siteName: 'fcoPhox',
            images: service.image_url ? [
                {
                    url: service.image_url,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ] : [],
            locale: 'es_ES',
            type: 'article',
        },
    }
}

export default function ServicePage() {
    return <ServiceClient />;
}
