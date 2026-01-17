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

// Elemental Mappings for Gates
const ELEMENTAL_GATES = {
    FIRE: [1, 14, 25, 51, 21, 51, 26, 40, 36, 22, 37, 6, 49, 55, 30],
    WATER: [48, 57, 44, 50, 32, 28, 18, 34, 5, 14, 29, 59, 9, 3, 42, 27],
    AIR: [64, 61, 63, 47, 24, 4, 17, 43, 11, 62, 23, 56, 12, 45, 35, 16, 20, 31, 8, 33],
    EARTH: [58, 38, 54, 53, 60, 52, 19, 39, 41, 1, 13, 25, 46, 2, 15, 10, 7]
};

export function computeMandalaState(positions: PlanetaryPosition[]): MandalaState {
    const activeGates = new Set(positions.map(p => p.gate));

    // 1. Core State Vectors
    const headCount = GATES_BY_CENTER.HEAD.filter(g => activeGates.has(g)).length;
    const rootCount = GATES_BY_CENTER.ROOT.filter(g => activeGates.has(g)).length;
    const pressure = Math.min(1.0, (headCount * 1.5 + rootCount * 0.8) / 5);

    const ajnaCount = GATES_BY_CENTER.AJNA.filter(g => activeGates.has(g)).length;
    const spleenCount = GATES_BY_CENTER.SPLEEN.filter(g => activeGates.has(g)).length;
    const clarity = Math.min(1.0, (ajnaCount + spleenCount) / 5);

    const sacralCount = GATES_BY_CENTER.SACRAL.filter(g => activeGates.has(g)).length;
    const solarCount = GATES_BY_CENTER.SOLAR_PLEXUS.filter(g => activeGates.has(g)).length;
    const heartCount = GATES_BY_CENTER.HEART.filter(g => activeGates.has(g)).length;
    const velocity = Math.min(1.0, (rootCount * 0.5 + sacralCount * 1.2 + solarCount * 0.8 + heartCount * 1.0) / 8);

    let channelMatches = 0;
    for (const [a, b] of CHANNELS) {
        if (activeGates.has(a) && activeGates.has(b)) channelMatches++;
    }
    const coherence = Math.min(1.0, 0.3 + (channelMatches * 0.2));

    // 2. Elemental Dominance (Deterministic)
    const fireCount = ELEMENTAL_GATES.FIRE.filter(g => activeGates.has(g)).length;
    const waterCount = ELEMENTAL_GATES.WATER.filter(g => activeGates.has(g)).length;
    const airCount = ELEMENTAL_GATES.AIR.filter(g => activeGates.has(g)).length;
    const earthCount = ELEMENTAL_GATES.EARTH.filter(g => activeGates.has(g)).length;

    const maxElem = Math.max(fireCount, waterCount, airCount, earthCount);

    // 3. Archetype & Shape Assignment
    let archetypeId: 'A' | 'B' | 'C' | 'D' = 'A';
    let shapeFamily: 'orb' | 'petal' | 'star' | 'lattice' | 'wave' = 'orb';
    let symmetry = 8;
    let colors = ["#00ffff", "#0088ff", "#ffffff"]; // Fallback

    if (fireCount === maxElem) {
        archetypeId = 'B';
        shapeFamily = 'star';
        symmetry = 10 + (fireCount % 5);
        colors = ["#ff3300", "#ffcc00", "#ff00ff"]; // Fire palette
    } else if (airCount === maxElem) {
        archetypeId = 'C';
        shapeFamily = 'lattice';
        symmetry = 12 + (airCount % 6);
        colors = ["#00ffff", "#ffff00", "#ffffff"]; // Air palette
    } else if (waterCount === maxElem) {
        archetypeId = 'A';
        shapeFamily = 'petal';
        symmetry = 8 + (waterCount % 4);
        colors = ["#008080", "#40e0d0", "#fff5ee"]; // Water palette
    } else {
        archetypeId = 'A'; // Default to cellular earth
        shapeFamily = 'orb';
        symmetry = 6 + (earthCount % 4);
        colors = ["#228b22", "#ffbf00", "#8b4513"]; // Earth palette
    }

    // Velocity Shift to Waveform
    if (velocity > 0.75) {
        shapeFamily = 'wave';
        archetypeId = 'D';
        colors = ["#ff00ff", "#ffff00", "#00ffff"]; // Neon oscillatory
    }

    // 4. Motion State
    let motionState: 'calm' | 'focused' | 'activated' | 'transformative' = 'calm';
    if (velocity > 0.7) motionState = 'activated';
    else if (pressure > 0.7 && clarity > 0.7) motionState = 'focused';
    else if (coherence < 0.4) motionState = 'transformative';

    return {
        pressure,
        clarity,
        velocity,
        coherence,
        archetypeId,
        shapeFamily,
        symmetry,
        layers: 2 + Math.floor(coherence * 6),
        colors,
        motionState
    };
}

