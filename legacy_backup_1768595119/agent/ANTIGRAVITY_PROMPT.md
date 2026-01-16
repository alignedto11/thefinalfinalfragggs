
You are building DEFRAG, a highly polished web + iOS app experience. Use this package as ground truth. Do not drift from the canonical sequence or the non-negotiables.

GOAL
Deliver a production-ready DEFRAG app consisting of:
1) A cinematic entry animation (first login/sign-up) that establishes the DEFRAG space and identity glyph.
2) A floor/dashboard showing a checkerboard of mandala tiles representing live computed user states in real time.
3) Interactions: tile selection, natal overlays, gift↔shadow cube, family overlay, spiral timeline, share.
4) Tiered curriculum (3–7 day arc) gated by Stripe (capabilities gated; no feed UI).

CANONICAL ENTRY SEQUENCE (MUST MATCH)
VOID → ONION WHEEL (planetary wheel) → rotate into vertical axis → SPRING (spiral journal) → fly down Axis Mundi → fade to black → cymatic mandala shifts and SNAPS into final form → mandala becomes user glyph → pull back to FLOOR (A/B/C staging: user → family → collective).

NON-NEGOTIABLE VISUAL LAW
- True black background, monochrome base palette.
- Single accent hue: electric cyan only (intensity/phase shifts OK).
- Iridescence allowed only on: user input, titles, snap-to-form.
- Gold allowed only during "The Bow" closure.
- No self-report state. No mood picker. No feed UI.

DATA & STATE (ENGINE-DRIVEN)
State is computed by the DEFRAG engine from birth data (DOB/time/location) + current time. Renderer maps state → motion/appearance:
- Calm/coherent: stable symmetry, low jitter, higher cyan intensity.
- Erratic: higher jitter, unstable form, lower cyan intensity.
- Parked: low contrast, near-zero motion.
- Tension: represent via motion dynamics and intensity (do NOT add red; stay within cyan/mono law).

FLOOR CONCEPT
Checkerboard/dance floor of many tiles where each tile is a live-state mandala. The floor represents a relational mesh, "no parking on the dance floor." Provide camera pan/tilt/zoom to reveal scale and alternate perspectives (vortex, axis, spiral-time).

INTERACTION REQUIREMENTS
- Tap/click tile: overlay natal chart as wireframe relational geometry.
- Show vector cube overlay with continuous slider from gift→shadow (geometry transform, not color shift).
- Family overlay: computed family members arranged as system rings; dynamics shown via distance/dash/line pressure.
- Timeline: SPIRAL_TIME view, helix extrusion with bead nodes and contextual metadata (no list feed as primary).

DELIVERABLES
- Web app: production-ready build (Vite/Three or integrated into React/Next), modular renderer.
- iOS app: RealityKit + Metal/MetalKit to match visuals; same state mapping, performance budgets.
- Documentation: build/run steps, configuration, engine integration contract, QA checklist.
- Visual polish: motion easing, LOD, anti-alias, tone mapping consistent with void aesthetic.

USE THIS PACKAGE
- /web contains a runnable prototype with entry objects and choreography; evolve it to production polish.
- /docs contains the authoritative spec and acceptance criteria. Follow them exactly.

OUTPUT STANDARDS
- Maintain high performance with adaptive LOD and tile budget.
- Respect accessibility reduce motion.
- Ensure privacy (anonymous tiles; optional initials).
Proceed to build the full polished product from this starting point without introducing new color schemes or alternative sequences.
