import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Artículos, reflexiones y recursos sobre diseño de producto, UX, tecnología y desarrollo web. Comparatiendo aprendizajes del mundo digital.',
    openGraph: {
        title: 'Blog',
        description: 'Artículos, reflexiones y recursos sobre diseño de producto, UX, tecnología y desarrollo web. Comparatiendo aprendizajes del mundo digital.',
        url: 'https://fcophox.com/blog',
        siteName: 'fcoPhox',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function BlogPage() {
    return <BlogClient />;
}
