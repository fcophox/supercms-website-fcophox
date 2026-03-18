import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message, messageType } = await request.json();

        // Map selection type to human readable label
        const typeLabels: Record<string, string> = {
            message: 'Consulta General',
            consulting: 'Consultoría',
            diagnostic: 'Diagnóstico'
        };
        const subjectType = typeLabels[messageType as keyof typeof typeLabels] || 'Nuevo Mensaje';

        // 1. Insert into Supabase
        const { error: dbError } = await supabase
            .from('contact_messages')
            .insert([{ name, email, message, message_type: messageType }]);

        if (dbError) {
            console.error('Supabase error:', dbError);
            // We'll continue because the email might work, but log it.
        }

        // 2. Send Email
        if (process.env.RESEND_API_KEY && (process.env.CONTACT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL)) {
            const recipient = process.env.CONTACT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
            const { error: emailError } = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: recipient as string,
                subject: `${subjectType} de ${name}`,
                html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #121214;">
              <div style="background: #5b4eff; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Nueva ${typeLabels[messageType] || 'Consulta'}</h1>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e1e1e1; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-bottom: 25px;">Has recibido una nueva solicitud a través del formulario de contacto:</p>
                
                <div style="background: #f8f8f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <p style="margin: 0 0 12px 0;"><strong style="color: #5b4eff;">Asunto:</strong> ${subjectType}</p>
                  <p style="margin: 0 0 12px 0;"><strong style="color: #5b4eff;">Nombre:</strong> ${name}</p>
                  <p style="margin: 0 0 12px 0;"><strong style="color: #5b4eff;">Email:</strong> ${email}</p>
                  <p style="margin: 0;"><strong style="color: #5b4eff;">Mensaje:</strong></p>
                  <p style="white-space: pre-wrap; margin-top: 10px; color: #3f3f46; line-height: 1.6; font-size: 15px;">${message}</p>
                </div>

                <div style="text-align: center; font-size: 12px; color: #a1a1aa; margin-top: 30px;">
                  Este mensaje fue enviado desde el formulario de contacto de tu sitio web.
                </div>
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
