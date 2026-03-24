// test_supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Testing Supabase Insert...");
    const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([{ 
            name: "Test User", 
            email: "test@test.com", 
            message: "Test msg", 
            message_type: "message",
        }]);
    
    if (insertError) {
        console.error("Insert Error:", insertError);
    } else {
        console.log("Insert successful!");
    }

    console.log("Testing Supabase Select...");
    const { data, error: selectError } = await supabase
        .from('contact_messages')
        .select('*')
        .limit(1);
    
    if (selectError) {
        console.error("Select Error:", selectError);
    } else {
        console.log("Select returned data:", data);
    }
}

test();
