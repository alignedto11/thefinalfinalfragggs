
# DEFRAG Engine → Renderer Contract (Stub)

The engine computes state from objective inputs (birth data + time). The renderer consumes a normalized payload.

## Output payload (renderer expects)
```json
{
  "user": { "id": "string", "glyphSeed": "string" },
  "state": {
    "mode": "SCATTER|FORMATION|MANDALA|PARKED",
    "coherence": 0.0,
    "tension": 0.0,
    "phase": 0.0,
    "velocity": 0.0
  },
  "visual": {
    "cyanIntensity": 0.0,
    "jitterHz": 0.0,
    "noiseAmp": 0.0,
    "parked01": 0.0
  },
  "family": [ { "id": "string", "state": { "...": "..." } } ],
  "collective": { "tiles": [ { "id": "anon", "state": { "...": "..." } } ] }
}
```

## Rules
- All scalar values normalized [0..1].
- Renderer never requests user self-report.
- Family is computed at full natal compute; collective is anonymous.
