import { NextResponse } from 'next/server';
const translate = require('google-translate-api-x');

export async function POST(request: Request) {
    try {
        const { text, title } = await request.json();

        if (!text && !title) {
            return NextResponse.json(
                { error: 'Content or title is required' },
                { status: 400 }
            );
        }

        console.log("Translating article using Google Translate (Free)...");

        let translatedTitle = "";
        let translatedContent = "";

        // Translate Title
        if (title) {
            try {
                // @ts-ignore
                const titleRes = await translate(title, { to: 'en' });
                translatedTitle = titleRes.text;
            } catch (e) {
                console.error("Error translating title:", e);
                translatedTitle = title; // Fallback
            }
        }

        // Translate Content
        if (text) {
            try {
                // @ts-ignore
                const contentRes = await translate(text, { to: 'en' });
                translatedContent = contentRes.text;
            } catch (e) {
                console.error("Error translating content:", e);
                translatedContent = text; // Fallback
            }
        }

        // Generate Slug from translated title
        let translatedSlug = "";
        if (translatedTitle) {
            translatedSlug = translatedTitle
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // Remove non-word chars
                .replace(/[\s_-]+/g, '-') // Replace spaces with -
                .replace(/^-+|-+$/g, ''); // Trim -
        }

        console.log("Translation complete");

        return NextResponse.json({
            title: translatedTitle,
            slug: translatedSlug,
            content: translatedContent
        });

    } catch (error: any) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { error: error.message || 'Error occurred during translation' },
            { status: 500 }
        );
    }
}
