# Kotofit Homepage Redesign — Design Spec

**Date:** 2026-04-26
**Owner:** jonathanchiang7@gmail.com
**Status:** Approved (brainstorming complete)

## Project

Redesign the homepage of [kotofit.com](https://www.kotofit.com/) — a NY/NJ badminton & pickleball facility chain (Jersey City, Long Island City, expanding to Brooklyn / Queens). The current site is on Squarespace and feels dated: too many colors, too many buttons, weak hierarchy.

This deliverable is a **high-fidelity clickable prototype**, not a production site. It exists to demonstrate a modern design direction to stakeholders before any platform commitment.

## Scope

**In scope:**
- A single homepage at near-production fidelity
- Real photography (Unsplash) embedded throughout
- Simulated interactivity for booking widget, location chooser, mobile nav, and modal flows — all running client-side with no backend
- Responsive layout (mobile, tablet, desktop)

**Out of scope:**
- Other pages (Memberships detail, Coaching, Events, Stringing, FAQ, Contact, About, per-location pages) — homepage first; other pages are a possible follow-up
- Real authentication, real booking persistence, real payment, real CMS
- Backend, build tooling, framework migration
- Accessibility audit beyond reasonable defaults (semantic HTML, focus states, alt text)

## Visual System

### Direction
**Athletic Premium** — dark, bold, cinematic. Reference brands: Equinox, Nike, Barry's. Restraint over ornament. Photography and typography do most of the work.

### Color
| Token | Hex | Use |
|-------|-----|-----|
| Ink | `#0A0A0A` | Page background |
| Surface | `#18181B` | Cards, containers |
| Elevated | `#27272A` | Borders, hover states |
| Bone | `#FFFFFF` | Primary text |
| Mute | `#A1A1AA` | Secondary text, labels |
| Cobalt | `#2563EB` | The single accent — CTAs, eyebrows, hover, key numerals |

One accent color. Everything else lives on the black/white scale.

### Typography
**Inter** (Google Fonts), single family, weights 400/600/700/800/900.
- **Display XL** (84px / 900 / -0.04em / uppercase) — hero headline only
- **Display L** (44px / 800 / -0.03em) — section headlines
- **Display M** (22px / 700 / -0.02em) — card titles
- **Body** (15px / 400 / 1.6 line-height) — paragraph text
- **Eyebrow** (11px / 700 / 0.2em tracking / uppercase / Cobalt) — section kickers and labels

### Motion
Subtle and restrained. Hero photo slow Ken-Burns zoom on load. Section headlines fade-up on scroll-in. Buttons: 150ms color shift. Location and play tiles: gentle lift on hover. **No carousels, no parallax, no bounce easing.**

### Component principles
- Hard-edge rectangles (no rounded corners) for buttons, cards, inputs
- 1px borders in Elevated grey for separation, not drop shadows
- Generous whitespace — `padding: 80px 32px` for full-width sections
- Imagery: gradient-tinted toward the dark palette so photography never blows out the type

## Page Structure

Ten sections, top to bottom. Each section's role and key content is fixed; the visual treatment is locked in by the wireframe approved during brainstorming (`.superpowers/brainstorm/.../homepage-wireframe.html`).

### 1. Sticky nav
- Logo (KOTOFIT, left)
- Links (center): Locations · Memberships · Coaching · Events · Stringing
- Primary CTA (right): "Reserve Court →"
- Background: `rgba(10,10,10,0.7)` + 8px backdrop blur
- Bottom border: 1px Elevated
- Mobile: hamburger → fullscreen overlay menu

### 2. Hero
- Full-bleed background image (Unsplash badminton/pickleball action shot), 60–85% black gradient overlay
- Min-height: 480px desktop, ~80vh on larger screens
- Eyebrow: "▸ AMERICA'S HOME FOR INDOOR SPORTS"
- Headline: "Built for game day." — last word in Cobalt
- Bottom row: location chooser chip ("Playing in Jersey City ▾") + primary Cobalt CTA "Reserve a court →"

### 3. Locations strip
- Section eyebrow: "▸ FIVE OPEN. THREE COMING."
- Headline: "Find your court."
- Description (right-aligned on desktop): "Five locations across NJ and NY today. Brooklyn and Queens land this season."
- Five cards in a horizontal grid: 3rd Street (JC), Brunswick (JC), Summit Ave (JC), 10th Street (LIC), and a "Coming Soon" Brooklyn card
- Each card: 4:3 image, badge ("Open" or "Soon"), city eyebrow, name, court count + hours
- Cards lift on hover; clicking opens a location detail modal (simulated — basic info, photo, hours, "Reserve here" button)

### 4. Booking widget
- Section eyebrow: "▸ BOOK IN 30 SECONDS"
- Headline: "Reserve a court."
- Inline widget on Surface background: four select fields (Sport, Location, Date, Time) + Cobalt "CHECK COURTS →" button
- Clicking each field opens a small dropdown with mock options
- Clicking the CTA opens a modal showing fake court availability (a 3×3 grid of time slots, some "Available" Cobalt, some "Booked" greyed out) → clicking an available slot opens a confirmation modal: "Court booked · Confirmation #KF-2842"
- All client-side; no persistence

### 5. What you can play
- Eyebrow: "▸ THREE GAMES, ONE HOUSE"
- Headline: "Pick your sport."
- Three large 4:5 tiles: Badminton · Pickleball · Ping Pong
- Each tile: numbered ("— 01"), gradient-tinted sport photo, sport name in Display L, "Open play, leagues, clinics →" link

### 6. Memberships
- Eyebrow: "▸ MEMBER PERKS"
- Headline: "Play more. Pay less."
- Three pricing tier cards: Drop-in ($0/mo) · Go Koto ($49/mo, **featured in Cobalt**) · All-Access ($129/mo)
- Each card: tier name, large price, four-bullet feature list (em-dash bullets), full-width CTA button at bottom
- "Become a member" CTA opens a multi-step modal: pick tier → pick location → "create account" form (email/password, fake-validate) → confirmation

### 7. Coaching
- Eyebrow: "▸ LEARN FROM CHAMPIONS"
- Headline: "Coaching."
- Asymmetric 3-column grid: one large feature coach card (5:6, photo + name + role + bio) + four smaller mini cards stacked in two columns
- All coach names/photos are placeholder (real Kotofit staff to be swapped in later)

### 8. Community & events
- Eyebrow: "▸ THIS SEASON"
- Headline: "Show up. Belong."
- Two-column layout:
  - **Left:** Three upcoming event rows, each with date block (large day number + Cobalt month abbreviation), event name, meta (location · time · price), outline RSVP button
  - **Right:** Member testimonial card with Cobalt left border, large pull-quote, attribution
- RSVP buttons open simple confirmation modals

### 9. Stringing
- Two-column section on Surface background
- **Left:** Eyebrow "▸ PROFESSIONAL STRINGING" + headline "Strung in 24 hours." + paragraph describing the service + Cobalt "Book Stringing →" CTA
- **Right:** Image (racquet stringing close-up)
- CTA opens a modal: select racquet type → tension → string → drop-off location → confirmation

### 10. Footer
- Four-column grid: Brand block (logo + 1-paragraph mission), Play (Locations / Reserve / Memberships / Stringing), Learn (Coaching / Clinics / Youth / Events), Connect (WhatsApp / Instagram / WeChat / Contact)
- Bottom: copyright + locations summary

## Interaction Simulations

All flows live entirely in the browser. No persistence between page loads. Confirmation numbers are randomly generated client-side.

| Trigger | Behavior |
|---------|----------|
| Hero location chip click | Dropdown of all five locations + "Coming soon" greyed entries |
| Hero "Reserve a court" CTA | Smooth-scroll to booking widget |
| Booking widget field click | Dropdown of mock options |
| Booking widget submit | Modal: court availability grid → click slot → confirmation |
| Location card click | Modal: location detail (photo, hours, address, "Reserve here") |
| Sport tile click | Modal: brief overview of programs for that sport (text + image) |
| Membership tier CTA | Multi-step join modal |
| Event RSVP | Modal: "You're in! Confirmation sent to your email." (no real email) |
| Stringing CTA | Multi-step stringing-order modal |
| Mobile hamburger | Fullscreen overlay menu |
| Nav links | Smooth-scroll to corresponding section |

All modals: Cobalt accent, dark Surface background, ESC-key close + backdrop click close, focus trap.

## Tech Architecture

**Single HTML file:** `index.html` at the project root. Opens by double-clicking — no build, no server, no `npm install`.

- All CSS inline in a single `<style>` block in `<head>`
- All JS inline in a single `<script>` block before `</body>`
- Inter loaded via Google Fonts `<link>`
- All images via direct Unsplash URLs (`https://images.unsplash.com/photo-...`) with appropriate query params for size
- Mock data (locations, courts, events, coaches, testimonials) defined as plain JS objects at the top of the script block
- Vanilla DOM APIs for interactions; no jQuery, no framework
- CSS custom properties (`--ink`, `--cobalt`, etc.) drive the theme so palette tweaks are one-line edits

**Responsive breakpoints:**
- Mobile: < 640px (single column, stacked sections, hamburger nav)
- Tablet: 640–1024px (2-column grids where applicable)
- Desktop: > 1024px (full multi-column layouts as wireframed)

## Risks & Assumptions

- **Unsplash hotlinking** is acceptable for a prototype but not for production. The spec assumes Kotofit will swap in their own photography before any real launch.
- **Real coach names, real prices, real event details** are placeholders. The prototype is structurally correct; content is illustrative.
- **CourtReserve integration** is not in scope. The current site uses CourtReserve for actual booking; the prototype's booking widget is purely visual demonstration.
- **Browser support:** modern evergreen browsers only (Chrome, Safari, Firefox, Edge — last 2 versions). No IE/legacy.

## Success Criteria

The prototype succeeds when:
1. A stakeholder can open `index.html`, scroll the homepage, and immediately understand the new design language vs. the current site.
2. They can click through the booking flow, location selection, and at least one membership/event/stringing flow without hitting a dead end.
3. The page works at mobile, tablet, and desktop widths without obvious layout breaks.
4. Visual polish matches Athletic Premium reference brands (Equinox, Nike) — restrained palette, bold type, cinematic photography.
