/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import translate from 'google-translate-api-x';
import * as parse5 from 'parse5';

// Recursive function to walk the AST and collect text nodes
function collectTextNodes(node: any, textNodes: any[]) {
    // Skip script and style tags
    if (node.nodeName === 'script' || node.nodeName === 'style') {
        return;
    }

    if (node.nodeName === '#text') {
        // Only collect text nodes that actually have non-whitespace content to translate
        if (node.value.trim() !== '') {
            textNodes.push(node);
        }
    } else if (node.childNodes) {
        for (const child of node.childNodes) {
            collectTextNodes(child, textNodes);
        }
    }
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
                const titleRes: any = await translate(title, { to: 'en' });
                translatedTitle = titleRes.text;
            } catch (e) {
                console.error("Error translating title:", e);
                translatedTitle = title; // Fallback
            }
        }

        // Translate Content
        if (text) {
            try {
                // Parse the existing HTML
                const ast = parse5.parseFragment(text);
                const textNodes: any[] = [];

                // Collect all text nodes
                collectTextNodes(ast, textNodes);

                if (textNodes.length > 0) {
                    const textsToTranslate = textNodes.map(n => n.value);

                    // Translate the array of text nodes in one batch
                    const translations: any = await translate(textsToTranslate, { to: 'en' });

                    // google-translate-api-x returns an array if input is an array
                    const translationArray = Array.isArray(translations) ? translations : [translations];

                    // Put the translated values back into the AST
                    textNodes.forEach((node, index) => {
                        if (translationArray[index] && translationArray[index].text) {
                            const original = node.value;
                            let translated = translationArray[index].text;

                            // Preserve leading/trailing whitespace which can be stripped by the API
                            // This prevents inline tags from collapsing together (e.g., "word " + "word" -> "wordword")
                            const hasLeadingSpace = /^\s/.test(original);
                            const hasTrailingSpace = /\s$/.test(original);

                            if (hasLeadingSpace && !/^\s/.test(translated)) translated = ' ' + translated;
                            if (hasTrailingSpace && !/\s$/.test(translated)) translated = translated + ' ';

                            node.value = translated;
                        }
                    });
                }

                // Serialize back to HTML string
                translatedContent = parse5.serialize(ast);
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

