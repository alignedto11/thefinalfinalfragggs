import { PlanetaryPosition } from "./astronomy";
import { MandalaState } from "../state";

// Mapping of Gates to Centers (Simplified for Heuristic)
const GATES_BY_CENTER = {
    HEAD: [64, 61, 63],
    ROOT: [58, 38, 54, 53, 60, 52, 19, 39, 41],
    AJNA: [47, 24, 4, 17, 43, 11],
    SPLEEN: [48, 57, 44, 50, 32, 28, 18],
    SOLAR_PLEXUS: [36, 22, 37, 6, 49, 55, 30],
    SACRAL: [34, 5, 14, 29, 59, 9, 3, 42, 27],
    THROAT: [62, 23, 56, 12, 45, 35, 16, 20, 31, 8, 33],
    G: [1, 13, 25, 46, 2, 15, 10, 7],
    HEART: [21, 51, 26, 40]
};

// Known Channels (Pairs of Gates)
const CHANNELS: [number, number][] = [
    [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31], [9, 52], [10, 20],
    [10, 34], [10, 57], [11, 56], [12, 22], [13, 33], [16, 48], [17, 62], [18, 58],
    [19, 49], [20, 34], [20, 57], [21, 45], [23, 43], [24, 61], [25, 51], [26, 44],
    [27, 50], [28, 38], [29, 46], [30, 41], [32, 54], [34, 57], [35, 36], [37, 40],
    [39, 55], [42, 53], [47, 64]
];

export function computeMandalaState(positions: PlanetaryPosition[]): MandalaState {
    const activeGates = new Set(positions.map(p => p.gate));

    // 1. Pressure: Activation of Head and Root Gates
    const headCount = GATES_BY_CENTER.HEAD.filter(g => activeGates.has(g)).length;
    const rootCount = GATES_BY_CENTER.ROOT.filter(g => activeGates.has(g)).length;
    // Normalize: Head max 3, Root max 9. Typical transit has ~10 planets.
    // Weighted Pressure.
    const pressureRaw = (headCount * 1.5 + rootCount * 0.8) / 5;
    const pressure = Math.min(1.0, Math.max(0.0, pressureRaw));

    // 2. Clarity: Activation of Awareness Centers (Ajna, Spleen, Solar Plexus - emotional clarity?)
    // Let's use Ajna + Spleen for "Mental/Physical Clarity".
    const ajnaCount = GATES_BY_CENTER.AJNA.filter(g => activeGates.has(g)).length;
    const spleenCount = GATES_BY_CENTER.SPLEEN.filter(g => activeGates.has(g)).length;
    const clarityRaw = (ajnaCount + spleenCount) / 5;
    const clarity = Math.min(1.0, Math.max(0.0, clarityRaw));

    // 3. Velocity: Activation of Motor Centers (Root, Sacral, Solar Plexus, Heart)
    // Roots are already Pressure, but also Motors.
    const sacralCount = GATES_BY_CENTER.SACRAL.filter(g => activeGates.has(g)).length;
    const solarCount = GATES_BY_CENTER.SOLAR_PLEXUS.filter(g => activeGates.has(g)).length;
    const heartCount = GATES_BY_CENTER.HEART.filter(g => activeGates.has(g)).length;
    const velocityRaw = (rootCount * 0.5 + sacralCount * 1.2 + solarCount * 0.8 + heartCount * 1.0) / 8;
    const velocity = Math.min(1.0, Math.max(0.0, velocityRaw));

    // 4. Coherence: Defined Channels
    let channelMatches = 0;
    for (const [a, b] of CHANNELS) {
        if (activeGates.has(a) && activeGates.has(b)) {
            channelMatches++;
        }
    }
    // Coherence boosts if channels are defined.
    // Base coherence 0.3 + 0.15 per channel.
    const coherenceRaw = 0.3 + (channelMatches * 0.2);
    const coherence = Math.min(1.0, Math.max(0.0, coherenceRaw));

    return {
        pressure,
        clarity,
        velocity,
        coherence
    };
}
