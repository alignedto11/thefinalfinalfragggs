import fs from 'fs';
import path from 'path';
import { GATE_KERNEL } from '../lib/engine/human-design';

const outputPath = path.join(process.cwd(), 'supabase/seed.sql');

const sqlLines = [
    '-- Seed Data for Gates',
    'DELETE FROM gates;', // Clear existing table
];

Object.values(GATE_KERNEL).forEach(gate => {
    // Escape single quotes in text
    const name = gate.label.replace(/'/g, "''");
    const shadow = gate.shadow.replace(/'/g, "''");
    const gift = gate.gift.replace(/'/g, "''");
    const siddhi = gate.siddhi.replace(/'/g, "''");

    sqlLines.push(`INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (${gate.number}, '${name}', '${shadow}', '${gift}', '${siddhi}', '${gate.circuit}') ON CONFLICT (id) DO NOTHING;`);
});

fs.writeFileSync(outputPath, sqlLines.join('\n'));
console.log(`Generated seed.sql at ${outputPath}`);
