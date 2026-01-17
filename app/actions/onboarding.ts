"use server"

import { generateBaselineWelcome } from "@/lib/ai"

/**
 * Note: This is a client-side wrapper for the AI utility.
 * In a real app, you'd make this a server action.
 */
export async function getWelcomeSnippet(birthDate: string) {
    return await generateBaselineWelcome(birthDate)
}
