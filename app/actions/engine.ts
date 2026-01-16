"use server";

import { calculatePlanetaryPositions } from "@/lib/engine/astronomy";
import { computeMandalaState } from "@/lib/engine/vector";
import { GATE_KERNEL, GateInfo } from "@/lib/engine/human-design";
import { calculateDoB, getNumerologyProfile, NumerologyProfile } from "@/lib/engine/numerology";
import { MandalaState } from "@/lib/state";

export interface CosmicState {
    timestamp: string;
    mandala: MandalaState;
    planetaryPositions: {
        name: string;
        longitude: number;
        gate: number;
        line: number;
        info: GateInfo | null;
    }[];
    numerology: {
        universalDayNumber: number; // Sum of current date
    };
}

export async function getCosmicState(): Promise<CosmicState> {
    const now = new Date();

    // 1. Astronomy & Gates
    const rawPositions = calculatePlanetaryPositions(now);

    // 2. Enrich with Knowledge Base (HD/Gene Keys)
    const planetaryPositions = rawPositions.map(p => ({
        ...p,
        info: GATE_KERNEL[p.gate] || null
    }));

    // 3. Visual State
    const mandala = computeMandalaState(rawPositions);

    // 4. Numerology (Universal Day)
    const universalDayNumber = calculateDoB(now);

    return {
        timestamp: now.toISOString(),
        mandala,
        planetaryPositions,
        numerology: {
            universalDayNumber
        }
    };
}
