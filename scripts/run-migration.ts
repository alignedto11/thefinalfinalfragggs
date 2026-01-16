import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const PROJECT_REF = 'tsanodlfvrrqwkcozeix';
const DB_PASSWORD = 'Xz5czo6SsbVrGxTA';
const CONNECTION_STRING = `postgres://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`;

async function runMigration() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
        ssl: { rejectUnauthorized: false } // Required for Supabase in some envs
    });

    try {
        console.log("Connecting to Database...");
        await client.connect();
        console.log("Connected.");

        const schemaPath = path.join(process.cwd(), 'supabase/schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Running Schema Migration...");
        await client.query(sql);
        console.log("Migration Success!");

    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
