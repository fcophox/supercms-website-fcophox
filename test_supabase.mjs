import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Testing Supabase Select...");
    const { data, error: selectError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
    
    if (selectError) {
        console.error("Select Error:", selectError);
    } else {
        console.log("Select returned data length:", data ? data.length : 0);
        console.log("First row:", data ? data[0] : null);
    }
}

test();
