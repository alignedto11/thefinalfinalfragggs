import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

async function deploy() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase environment variables!')
        process.exit(1)
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Deploying schema to:', supabaseUrl)

    // 1. Create Tables (approximate check)
    // Since we can't run raw SQL strings easily with types through the client for everything,
    // we will at least ensure the 'gates' data is inserted.

    // For raw SQL in Supabase via JS client, we usually use RPC or just direct table inserts.
    // We'll insert the gates data since that's what's missing and blocking.

    const gates = [
        { id: 1, name: 'The Creative', shadow: 'Entropy', gift: 'Freshness', siddhi: 'Beauty', circuitry: 'Individual' },
        { id: 2, name: 'The Receptive', shadow: 'Dislocation', gift: 'Orientation', siddhi: 'Unity', circuitry: 'Individual' },
        { id: 3, name: 'Difficulty at the Beginning', shadow: 'Chaos', gift: 'Innovation', siddhi: 'Innocence', circuitry: 'Individual' },
        { id: 4, name: 'Youthful Folly', shadow: 'Intolerance', gift: 'Understanding', siddhi: 'Forgiveness', circuitry: 'Collective' },
        { id: 5, name: 'Waiting', shadow: 'Impatience', gift: 'Patience', siddhi: 'Timelessness', circuitry: 'Collective' },
        { id: 6, name: 'Conflict', shadow: 'Conflict', gift: 'Diplomacy', siddhi: 'Peace', circuitry: 'Tribal' },
        { id: 7, name: 'The Army', shadow: 'Division', gift: 'Guidance', siddhi: 'Virtue', circuitry: 'Collective' },
        { id: 8, name: 'Holding Together', shadow: 'Mediocrity', gift: 'Style', siddhi: 'Exquisiteness', circuitry: 'Individual' },
        { id: 9, name: 'The Taming Power of the Small', shadow: 'Inertia', gift: 'Determination', siddhi: 'Invincibility', circuitry: 'Collective' },
        { id: 10, name: 'Treading', shadow: 'Self-Obsession', gift: 'Naturalness', siddhi: 'Being', circuitry: 'Individual' },
        { id: 11, name: 'Peace', shadow: 'Obscurity', gift: 'Idealism', siddhi: 'Light', circuitry: 'Collective' },
        { id: 12, name: 'Standstill', shadow: 'Vanity', gift: 'Discrimination', siddhi: 'Purity', circuitry: 'Individual' },
        { id: 13, name: 'Fellowship with Men', shadow: 'Discord', gift: 'Discernment', siddhi: 'Empathy', circuitry: 'Collective' },
        { id: 14, name: 'Possession in Great Measure', shadow: 'Compromise', gift: 'Competence', siddhi: 'Bounteousness', circuitry: 'Individual' },
        { id: 15, name: 'Modesty', shadow: 'Dullness', gift: 'Magnetism', siddhi: 'Florescence', circuitry: 'Collective' },
        { id: 16, name: 'Enthusiasm', shadow: 'Indifference', gift: 'Versatility', siddhi: 'Mastery', circuitry: 'Collective' },
        { id: 17, name: 'Following', shadow: 'Opinion', gift: 'Far-Sightedness', siddhi: 'Omniscience', circuitry: 'Collective' },
        { id: 18, name: 'Work on What Has Been Spoiled', shadow: 'Judgment', gift: 'Integrity', siddhi: 'Perfection', circuitry: 'Collective' },
        { id: 19, name: 'Approach', shadow: 'Co-Dependence', gift: 'Sensitivity', siddhi: 'Sacrifice', circuitry: 'Tribal' },
        { id: 20, name: 'Contemplation', shadow: 'Superficiality', gift: 'Self-Assurance', siddhi: 'Presence', circuitry: 'Integration' },
        { id: 21, name: 'Biting Through', shadow: 'Control', gift: 'Authority', siddhi: 'Valour', circuitry: 'Tribal' },
        { id: 22, name: 'Grace', shadow: 'Dishonour', gift: 'Graciousness', siddhi: 'Grace', circuitry: 'Individual' },
        { id: 23, name: 'Splitting Apart', shadow: 'Complexity', gift: 'Simplicity', siddhi: 'Quintessence', circuitry: 'Individual' },
        { id: 24, name: 'Return', shadow: 'Addiction', gift: 'Invention', siddhi: 'Silence', circuitry: 'Individual' },
        { id: 25, name: 'Innocence', shadow: 'Constriction', gift: 'Acceptance', siddhi: 'Universal Love', circuitry: 'Individual' },
        { id: 26, name: 'The Taming Power of the Great', shadow: 'Pride', gift: 'Artfulness', siddhi: 'Invisibility', circuitry: 'Tribal' },
        { id: 27, name: 'The Corners of the Mouth', shadow: 'Selfishness', gift: 'Altruism', siddhi: 'Selflessness', circuitry: 'Tribal' },
        { id: 28, name: 'Preponderance of the Great', shadow: 'Purposelessness', gift: 'Totality', siddhi: 'Immortality', circuitry: 'Individual' },
        { id: 29, name: 'The Abysmal', shadow: 'Half-Heartedness', gift: 'Commitment', siddhi: 'Devotion', circuitry: 'Collective' },
        { id: 30, name: 'The Clinging Fire', shadow: 'Desire', gift: 'Lightness', siddhi: 'Rapture', circuitry: 'Collective' },
        { id: 31, name: 'Influence', shadow: 'Arrogance', gift: 'Leadership', siddhi: 'Humility', circuitry: 'Collective' },
        { id: 32, name: 'Duration', shadow: 'Failure', gift: 'Preservation', siddhi: 'Veneration', circuitry: 'Tribal' },
        { id: 33, name: 'Retreat', shadow: 'Forgetting', gift: 'Mindfulness', siddhi: 'Revelation', circuitry: 'Collective' },
        { id: 34, name: 'The Power of the Great', shadow: 'Force', gift: 'Strength', siddhi: 'Majesty', circuitry: 'Integration' },
        { id: 35, name: 'Progress', shadow: 'Hunger', gift: 'Adventure', siddhi: 'Boundlessness', circuitry: 'Collective' },
        { id: 36, name: 'Darkening of the Light', shadow: 'Turbulence', gift: 'Humanity', siddhi: 'Compassion', circuitry: 'Collective' },
        { id: 37, name: 'The Family', shadow: 'Weakness', gift: 'Equality', siddhi: 'Tenderness', circuitry: 'Tribal' },
        { id: 38, name: 'Opposition', shadow: 'Struggle', gift: 'Perseverance', siddhi: 'Honour', circuitry: 'Individual' },
        { id: 39, name: 'Obstruction', shadow: 'Provocation', gift: 'Dynamism', siddhi: 'Liberation', circuitry: 'Individual' },
        { id: 40, name: 'Deliverance', shadow: 'Exhaustion', gift: 'Resolve', siddhi: 'Divine Will', circuitry: 'Tribal' },
        { id: 41, name: 'Decrease', shadow: 'Fantasy', gift: 'Anticipation', siddhi: 'Emanation', circuitry: 'Collective' },
        { id: 42, name: 'Increase', shadow: 'Expectation', gift: 'Detachment', siddhi: 'Celebration', circuitry: 'Collective' },
        { id: 43, name: 'Breakthrough', shadow: 'Deafness', gift: 'Insight', siddhi: 'Epiphany', circuitry: 'Individual' },
        { id: 44, name: 'Coming to Meet', shadow: 'Interference', gift: 'Teamwork', siddhi: 'Synarchy', circuitry: 'Tribal' },
        { id: 45, name: 'Gathering Together', shadow: 'Dominance', gift: 'Synergy', siddhi: 'Communion', circuitry: 'Tribal' },
        { id: 46, name: 'Pushing Upward', shadow: 'Seriousness', gift: 'Delight', siddhi: 'Ecstasy', circuitry: 'Collective' },
        { id: 47, name: 'Oppression', shadow: 'Oppression', gift: 'Transmutation', siddhi: 'Transfiguration', circuitry: 'Collective' },
        { id: 48, name: 'The Well', shadow: 'Inadequacy', gift: 'Resourcefulness', siddhi: 'Wisdom', circuitry: 'Collective' },
        { id: 49, name: 'Revolution', shadow: 'Reaction', gift: 'Revolution', siddhi: 'Rebirth', circuitry: 'Tribal' },
        { id: 50, name: 'The Cauldron', shadow: 'Corruption', gift: 'Equilibrium', siddhi: 'Harmony', circuitry: 'Tribal' },
        { id: 51, name: 'The Arousing', shadow: 'Agitation', gift: 'Initiative', siddhi: 'Awakening', circuitry: 'Individual' },
        { id: 52, name: 'Keeping Still', shadow: 'Stress', gift: 'Restraint', siddhi: 'Stillness', circuitry: 'Collective' },
        { id: 53, name: 'Development', shadow: 'Immaturity', gift: 'Expansion', siddhi: 'Superabundance', circuitry: 'Collective' },
        { id: 54, name: 'The Marrying Maiden', shadow: 'Greed', gift: 'Aspiration', siddhi: 'Ascension', circuitry: 'Tribal' },
        { id: 55, name: 'Abundance', shadow: 'Victimisation', gift: 'Freedom', siddhi: 'Freedom', circuitry: 'Individual' },
        { id: 56, name: 'The Wanderer', shadow: 'Distraction', gift: 'Enrichment', siddhi: 'Intoxication', circuitry: 'Collective' },
        { id: 57, name: 'The Gentle', shadow: 'Unease', gift: 'Intuition', siddhi: 'Clarity', circuitry: 'Individual' },
        { id: 58, name: 'The Joyous', shadow: 'Dissatisfaction', gift: 'Vitality', siddhi: 'Bliss', circuitry: 'Collective' },
        { id: 59, name: 'Dispersion', shadow: 'Dishonesty', gift: 'Intimacy', siddhi: 'Transparency', circuitry: 'Tribal' },
        { id: 60, name: 'Limitation', shadow: 'Limitation', gift: 'Realism', siddhi: 'Justice', circuitry: 'Individual' },
        { id: 61, name: 'Inner Truth', shadow: 'Psychosis', gift: 'Inspiration', siddhi: 'Sanctity', circuitry: 'Individual' },
        { id: 62, name: 'Preponderance of the Small', shadow: 'Intellect', gift: 'Precision', siddhi: 'Impeccability', circuitry: 'Collective' },
        { id: 63, name: 'After Completion', shadow: 'Doubt', gift: 'Inquiry', siddhi: 'Truth', circuitry: 'Collective' },
        { id: 64, name: 'Before Completion', shadow: 'Confusion', gift: 'Imagination', siddhi: 'Illumination', circuitry: 'Collective' },
    ]

    // Create the table if it's really missing (this might fail if already exists but we'll try)
    // Note: we can't easily run the full CREATE TABLE without RPC or raw SQL.
    // We'll assume the user needs to run the SQL in the Supabase Dashboard, 
    // but we can try to insert data which will reveal if the table exists.

    try {
        const { error: insertError } = await supabase.from('gates').upsert(gates)

        if (insertError) {
            if (insertError.code === 'PGRST204' || insertError.message.includes('not find the table')) {
                console.error('Table "gates" does not exist. Please run the SQL in supabase/setup_full.sql in your Supabase SQL Editor.')
            } else {
                console.error('Error inserting gates:', insertError)
            }
        } else {
            console.log('SUCCESS: Gates table seeded with 64 hexagrams.')
        }
    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

deploy()
