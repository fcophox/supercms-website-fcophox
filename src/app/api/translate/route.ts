import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
    try {
        const { text, title } = await request.json();

        if (!text && !title) {
            return NextResponse.json(
                { error: 'Content or title is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not found' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({ apiKey });

        console.log("Translating article using OpenAI...");

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a professional translator and copywriter. 
                    Translate the following article title and HTML content from Spanish to English.
                    Maintain the original HTML structure exactly (do not remove tags).
                    Adapt the tone to be professional and engaging.
                    
                    Return ONLY a valid JSON object with the following structure:
                    {
                        "title": "Translated Title",
                        "content": "Translated HTML Content"
                    }`
                },
                {
                    role: "user",
                    content: JSON.stringify({ title, content: text })
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = completion.choices[0].message.content;
        if (!result) throw new Error("No response from OpenAI");

        const parsed = JSON.parse(result);
        const translatedTitle = parsed.title;
        const translatedContent = parsed.content;

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
