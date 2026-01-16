import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing keys!");
    process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
    console.log("Testing connection to:", url);

    // 1. Try to fetch from 'gates' (checks if schema was run)
    const { data: gates, error: gatesError } = await supabase
        .from('gates')
        .select('id, name')
        .limit(1);

    if (gatesError) {
        if (gatesError.code === '42P01') { // undefined_table
            console.error("ERROR: Tables do not exist. User needs to run schema.sql.");
        } else if (gatesError.code === '401' || gatesError.code === '403') {
            console.error("ERROR: Auth/Permission denied. Check keys/RLS.", gatesError.message);
        } else {
            console.error("ERROR Fetching Gates:", gatesError.message, gatesError.code);
        }
    } else {
        console.log("SUCCESS: Gate Table found!", gates);
    }

    // 2. Check Auth Service
    const { data: authConfig, error: authError } = await supabase.auth.getSession();
    if (authError) {
        console.error("ERROR Auth:", authError.message);
    } else {
        console.log("SUCCESS: Auth Service reachable.");
    }
}

testConnection();
