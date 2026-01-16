import { Body, GeoVector, Ecliptic } from "astronomy-engine";

// Extracted from Defrag Engine Colab
const START_GATE_41_LONGITUDE = 359.84375;
const GATE_WIDTH_DEGREES = 5.625; // 360 / 64
const TOTAL_GATES = 64;

export interface PlanetaryPosition {
    name: string;
    longitude: number;
    gate: number;
    line: number;
    isRetrograde: boolean;
}

export function getGateInfo(eclipticLongitude: number): { gate: number; line: number } {
    const shiftedLongitude = (eclipticLongitude - START_GATE_41_LONGITUDE + 360) % 360;
    const gateIndex = Math.floor(shiftedLongitude / GATE_WIDTH_DEGREES);
    const gateNumber = ((41 - 1 + gateIndex) % TOTAL_GATES) + 1;

    const degreesInGate = shiftedLongitude % GATE_WIDTH_DEGREES;
    const lineIndex = Math.floor(degreesInGate / (GATE_WIDTH_DEGREES / 6));
    const lineNumber = lineIndex + 1;

    return { gate: gateNumber, line: lineNumber };
}

export function calculatePlanetaryPositions(date: Date): PlanetaryPosition[] {
    const bodies = [
        { name: "Sun", body: Body.Sun },
        { name: "Moon", body: Body.Moon },
        { name: "Mercury", body: Body.Mercury },
        { name: "Venus", body: Body.Venus },
        { name: "Mars", body: Body.Mars },
        { name: "Jupiter", body: Body.Jupiter },
        { name: "Saturn", body: Body.Saturn },
        { name: "Uranus", body: Body.Uranus },
        { name: "Neptune", body: Body.Neptune },
        { name: "Pluto", body: Body.Pluto },
    ];

    return bodies.map(b => {
        // Calculate Geocentric Vector
        const vec = GeoVector(b.body, date, true);
        // Convert to Ecliptic Coordinates (Longitude, Latitude)
        const ecl = Ecliptic(vec);
        const lon = ecl.elon; // Ecliptic Longitude

        const info = getGateInfo(lon);

        return {
            name: b.name,
            longitude: lon,
            gate: info.gate,
            line: info.line,
            isRetrograde: false // Retrograde logic requires comparing previous day's position
        };
    });
}
