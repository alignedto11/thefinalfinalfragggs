"use server";

import { calculatePlanetaryPositions } from "@/lib/engine/astronomy";
import { computeMandalaState } from "@/lib/engine/vector";
import { MandalaState } from "@/lib/state";

export async function getDailyMandalaState(): Promise<MandalaState> {
    try {
        const now = new Date();
        const positions = calculatePlanetaryPositions(now);
        const state = computeMandalaState(positions);

        return {
            ...state,
            longitudes: positions.map(p => p.longitude * (Math.PI / 180)) // Convert to radians
        };
    } catch (error) {
        console.error("Failed to compute daily mandala state:", error);
        // Fallback to minimal state to avoid crash
        return {
            pressure: 0.5,
            clarity: 0.5,
            velocity: 0.5,
            coherence: 0.5
        };
    }
}
