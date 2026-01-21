import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        // 1. Insert into Supabase
        // We assume a 'contact_messages' table exists.
        const { error: dbError } = await supabase
            .from('contact_messages')
            .insert([{ name, email, message }]);

        if (dbError) {
            console.error('Supabase error:', dbError);
            return NextResponse.json({ error: 'Failed to save message to database' }, { status: 500 });
        }

        // 2. Send Email
        // Only attempt if API Key is present.
        if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
            const { error: emailError } = await resend.emails.send({
                from: 'onboarding@resend.dev', // Default sender for testing. User should update if they have a domain.
                to: process.env.CONTACT_EMAIL,
                subject: `New Contact Form Submission from ${name}`,
                html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">New Contact Message</h1>
              <p>You have received a new message from your website contact form.</p>
              
              <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; margin-top: 5px; color: #555;">${message}</p>
              </div>
            </div>
          `,
            });

            if (emailError) {
                console.error('Resend error:', emailError);
                // We continue to return success because the DB save worked.
            }
        } else {
            console.warn('Email not sent: RESEND_API_KEY or CONTACT_EMAIL not set');
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
