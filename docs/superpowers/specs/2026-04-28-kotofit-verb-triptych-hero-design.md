# Kotofit Verb Triptych Hero — Design Spec

**Date:** 2026-04-28
**Owner:** jonathanchiang7@gmail.com
**Status:** Approved (brainstorming complete)
**Replaces:** the V3 booking-first hero on `index.html` (the hero only — booking widget keeps its position, the rest of the page is unchanged).

## Project

Replace the homepage hero's single headline + photo backdrop with three stacked sport verbs (Smash · Dink · Spin), each labeled with its sport, that cycle through "lit" states one at a time. No photo. The booking widget stays.

## Why

The current hero shows one badminton player. Kotofit is a multi-sport facility (badminton + pickleball + sometimes ping pong). The hero should communicate "we do all three" without scattering equipment images across the screen. The verb triptych does this through language and motion: the sport identity is in the words and which one is currently lit, not in photography.

## Scope

**In scope:**
- Replace the homepage hero's headline block with the verb triptych
- Remove the existing full-bleed photo backdrop (the blurred badminton player) and the Ken-Burns load animation tied to it
- Add CSS keyframe animation that cycles which verb (and its sport label) is "lit"
- Reduced-motion fallback: all verbs and labels stay at opacity 1, no cycling

**Out of scope:**
- Sub-page hero changes (`page-hero` blocks on locations/memberships/etc. stay as-is)
- Booking widget changes (stays in place exactly as it is)
- Any nav, footer, or below-fold section changes
- New JS dependencies — pure CSS animation, no motion.dev required

## Visual + Motion

### Layout

The hero stack, top to bottom:
1. **Eyebrow** — "▸ Three games. One court." (Cobalt, existing `.eyebrow` rule)
2. **Verb triptych** — three rows, each:
   - Verb word (Display XL size, weight 900, uppercase, hard punctuation period)
   - Cobalt sport label inline to the right of the verb (smaller — ~9–10px, letter-spaced, uppercase)
3. **Booking widget** — unchanged

The verbs:
- `Smash. — BADMINTON`
- `Dink. — PICKLEBALL`
- `Spin. — PING PONG`

The block is left-aligned within a centered `.container`, max-width matched to the booking widget below (~980px) so the verbs visually align with the widget edges.

### Cycle animation

6-second loop, 2 seconds per verb. Animation flow per verb:
- 0%: dim (opacity 0.18 on verb, 0 on sport label)
- 3% (~0.18s): both at full opacity
- 30% (~1.8s): both at full opacity
- 33% (~2s): both fade back to dim
- 33%–100%: dim

`animation-delay` offsets each verb by 2s so they cycle in sequence:
- `.hero-verb-1`: delay 0s — lit at 0–2s
- `.hero-verb-2`: delay 2s — lit at 2–4s
- `.hero-verb-3`: delay 4s — lit at 4–6s

The sport label inside each verb gets the same animation but goes from opacity 0 (instead of 0.18) to 1 — so when the verb is dim its label is fully invisible, and when the verb is lit the label appears.

### Reduced motion

`@media (prefers-reduced-motion: reduce)`:
- All `.hero-verb` and `.hero-verb-sport` elements set to opacity 1, animation: none
- User sees all three verbs and all three sport labels at full opacity, no cycling

### Background

Pure flat dark. The hero gets a subtle vertical gradient from `var(--ink)` to slightly-lighter and back, just enough to give depth without competing with the type. No photo. No blur. No Ken-Burns.

## What changes

### `index.html`

The hero `<section>` markup changes inside `.hero-top`. Specifically:

Replace:
```html
<div class="hero-top">
  <!-- <span class="eyebrow">▸ Book in 30 seconds</span> -->
  <h1 class="display-xl">Built for<br/>game <em>day.</em></h1>
</div>
```

With:
```html
<div class="hero-top">
  <span class="eyebrow">▸ Three games. One court.</span>
  <div class="hero-verbs">
    <div class="hero-verb hero-verb-1">Smash.<span class="hero-verb-sport">— Badminton</span></div>
    <div class="hero-verb hero-verb-2">Dink.<span class="hero-verb-sport">— Pickleball</span></div>
    <div class="hero-verb hero-verb-3">Spin.<span class="hero-verb-sport">— Ping Pong</span></div>
  </div>
</div>
```

Also: remove the `<div class="hero-bg" aria-hidden="true"></div>` line just above `<div class="container hero-inner">` — no photo backdrop anymore.

### `assets/styles.css`

In the `/* === HERO === */` section:
- **Remove** the `.hero-bg` rule and the `.hero.loaded .hero-bg` rule (no photo, no Ken-Burns)
- **Update** the `.hero` rule to use a flat dark gradient instead of relying on `.hero-bg` for visuals
- **Update** `.hero-inner` to be left-aligned text with a centered max-width container for the verb stack
- **Remove** the `.hero-top h1` rule (no h1 anymore in the hero)
- **Add** new rules for `.hero-verbs`, `.hero-verb`, `.hero-verb-sport`, and the `@keyframes verbPulse` plus `@keyframes verbPulseSport`

In the `@media (prefers-reduced-motion: reduce)` block:
- **Remove** the `.hero.loaded .hero-bg { transform: none; transition: none; }` rule (no longer applies)
- **Add** `.hero-verb, .hero-verb-sport { opacity: 1 !important; animation: none !important; }` — `!important` ensures the keyframe doesn't override

### `assets/app.js`

The existing `initHero()` function adds a `.loaded` class to the hero on load (for the Ken-Burns zoom). With the photo gone the class does nothing visible, but the call still runs. **Leave the function alone** — it's harmless. Removing it would be a separate cleanup task.

## Risks & assumptions

- **Pure CSS animation runs even with motion.dev disabled.** This hero doesn't depend on the new motion.dev integration — if Motion fails to load, the verb cycle still works.
- **The `display-xl` font size (`clamp(48px, 9vw, 96px)`) is used for the verbs.** On narrow viewports the three verbs may stack tightly; line-height is `0.92` so they overlap visually. The spec assumes that's acceptable since it's already the existing hero h1's behavior. If it looks cramped on mobile, a follow-up adjustment can reduce verb size at small viewports.
- **No backdrop photo** is a deliberate aesthetic choice — the user said the photo-driven hero felt single-sport. If after seeing this live they want some atmospheric backdrop (low-opacity court pattern, abstract gradient), it can be a follow-up.

## Success criteria

The change succeeds when:
1. Loading `index.html` shows three large verbs in sequence: Smash → Dink → Spin, each with its sport label appearing alongside as it lights up.
2. The eyebrow reads "▸ Three games. One court." in Cobalt.
3. The booking widget renders unchanged below the verbs.
4. No photo backdrop is visible behind the hero.
5. `prefers-reduced-motion: reduce` shows all three verbs + labels at full opacity, no cycling.
6. The rest of the site (sub-pages, scroll-reveal, nav, footer, modals) is unaffected.
