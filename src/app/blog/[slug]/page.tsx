
import type { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';
import { supabase } from '@/lib/supabaseClient';

type Props = {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const slug = params.slug

    const { data: article } = await supabase
        .from('articles')
        .select('title, title_en, image_url, content') // select minimal needed fields
        .or(`slug.eq.${slug},slug_en.eq.${slug}`)
        .single()

    if (!article) {
        return {
            title: 'Artículo no encontrado | fcoPhox',
        }
    }

    // Default to Spanish for SEO metadata as URLs are unique path based (not language based in URL)
    const title = article.title;
    // Strip HTML from content for description, naive approach
    const description = article.content ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : '';

    return {
        title: `${title} | Blog fcoPhox`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://fcophox.com/blog/${slug}`,
            siteName: 'fcoPhox',
            images: article.image_url ? [
                {
                    url: article.image_url,
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

export default function BlogPostPage() {
    return <BlogPostClient />;
}
