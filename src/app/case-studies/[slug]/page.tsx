
import type { Metadata } from 'next';
import CaseStudyClient from './CaseStudyClient';
import { supabase } from '@/lib/supabaseClient';

type Props = {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const slug = params.slug

    const { data: caseStudy } = await supabase
        .from('case_studies')
        .select('title, title_en, image_url, content')
        .or(`slug.eq.${slug},slug_en.eq.${slug}`)
        .single()

    if (!caseStudy) {
        return {
            title: 'Caso de Estudio no encontrado | fcoPhox',
        }
    }

    const title = caseStudy.title;
    const description = caseStudy.content ? caseStudy.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : '';

    return {
        title: `${title} | Casos de Estudio fcoPhox`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://fcophox.com/case-studies/${slug}`,
            siteName: 'fcoPhox',
            images: caseStudy.image_url ? [
                {
                    url: caseStudy.image_url,
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

export default function CaseStudyPage() {
    return <CaseStudyClient />;
}
