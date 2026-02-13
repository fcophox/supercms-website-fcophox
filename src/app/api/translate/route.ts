import { NextResponse } from 'next/server';
// @ts-ignore
import translate from 'google-translate-api-x';

interface TranslateResponse {
    text: string;
    from: {
        language: {
            didYouMean: boolean;
            iso: string;
        };
        text: {
            autoCorrected: boolean;
            value: string;
            didYouMean: boolean;
        };
    };
    raw: string;
}

export async function POST(request: Request) {
    try {
        const { text, title, slug } = await request.json();

        if (!text && !title) {
            return NextResponse.json(
                { error: 'Content or title is required' },
                { status: 400 }
            );
        }

        console.log("Translating content...");

        let translatedTitle = "";
        let translatedContent = "";

        // Translate Title
        if (title) {
            try {
                // @ts-ignore
                const titleRes = await translate(title, { to: 'en' }) as TranslateResponse;
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
                const contentRes = await translate(text, { to: 'en' }) as TranslateResponse;
                translatedContent = contentRes.text;
            } catch (e) {
                console.error("Error translating content:", e);
                translatedContent = text; // Fallback
            }
        }

        // Generate Slug from translated title if current slug is empty or we have a new title
        let translatedSlug = "";
        if (translatedTitle) {
            translatedSlug = translatedTitle
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // Remove non-word chars
                .replace(/[\s_-]+/g, '-') // Replace spaces with -
                .replace(/^-+|-+$/g, ''); // Trim -
        } else if (slug) {
            // Fallback to existing slug if translation failed for title but we have a slug
            translatedSlug = slug;
        }

        return NextResponse.json({
            title: translatedTitle,
            slug: translatedSlug,
            content: translatedContent
        });

    } catch (error: unknown) {
        console.error('Translation API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error occurred during translation';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
