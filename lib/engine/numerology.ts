export interface NumerologyProfile {
    lifePathNumber: number;
    destinyNumber: number; // Based on full name
    soulUrgeNumber: number; // Vowels
    personalityNumber: number; // Consonants
}

// Reduce number to 1-9, 11, 22, 33 (Master Numbers)
function reduce(n: number): number {
    if (n === 11 || n === 22 || n === 33) return n;
    if (n < 10) return n;

    let sum = 0;
    let s = n.toString();
    for (let i = 0; i < s.length; i++) {
        sum += parseInt(s[i]);
    }
    return reduce(sum);
}

// Map letters to numbers (Pythagorean)
// 1: A, J, S
// 2: B, K, T
// 3: C, L, U
// 4: D, M, V
// 5: E, N, W
// 6: F, O, X
// 7: G, P, Y
// 8: H, Q, Z
// 9: I, R
const LETTER_MAP: Record<string, number> = {
    a: 1, j: 1, s: 1,
    b: 2, k: 2, t: 2,
    c: 3, l: 3, u: 3,
    d: 4, m: 4, v: 4,
    e: 5, n: 5, w: 5,
    f: 6, o: 6, x: 6,
    g: 7, p: 7, y: 7,
    h: 8, q: 8, z: 8,
    i: 9, r: 9
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']); // Y usually treated as vowel in Soul Urge if no other vowel

export function calculateDoB(date: Date): number {
    // Method: Sum each unit separately (Month, Day, Year) then reduce the sum
    // Standard method aligns with typical Numerology practice
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const y = date.getFullYear();

    const reducedM = reduce(m);
    const reducedD = reduce(d);
    const reducedY = reduce(y);

    return reduce(reducedM + reducedD + reducedY);
}

export function calculateName(fullName: string): { destiny: number, soulUrge: number, personality: number } {
    const diffName = fullName.toLowerCase().replace(/[^a-z]/g, '');

    let totalSum = 0;
    let vowelSum = 0;
    let consSum = 0;

    for (const char of diffName) {
        const val = LETTER_MAP[char] || 0;
        totalSum += val;
        if (VOWELS.has(char)) {
            vowelSum += val;
        } else {
            consSum += val;
        }
    }

    return {
        destiny: reduce(totalSum),
        soulUrge: reduce(vowelSum),
        personality: reduce(consSum)
    };
}

export function getNumerologyProfile(date: Date, fullName: string = ""): NumerologyProfile {
    const lifepath = calculateDoB(date);
    const nameStats = fullName ? calculateName(fullName) : { destiny: 0, soulUrge: 0, personality: 0 };

    return {
        lifePathNumber: lifepath,
        destinyNumber: nameStats.destiny,
        soulUrgeNumber: nameStats.soulUrge,
        personalityNumber: nameStats.personality
    };
}
