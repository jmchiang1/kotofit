# Kotofit Multi-Page Expansion — Design Spec

**Date:** 2026-04-27
**Owner:** jonathanchiang7@gmail.com
**Status:** Approved (brainstorming complete)
**Extends:** [docs/superpowers/specs/2026-04-26-kotofit-homepage-redesign-design.md](2026-04-26-kotofit-homepage-redesign-design.md)

## Project

Expand the Kotofit homepage prototype into a 6-page clickable site. The homepage (`index.html`) already exists in Athletic Premium dark direction. This spec adds five sibling pages — Locations, Memberships, Coaching, Events, Stringing — and refactors shared CSS / JS / data out of `index.html` so all pages share one source of truth.

Still a prototype. Still no backend. All flows simulated client-side.

## Scope

**In scope:**
- Five new HTML pages at the project root: `locations.html`, `memberships.html`, `coaching.html`, `events.html`, `stringing.html`
- One-time refactor of `index.html` to externalize shared assets to `assets/styles.css`, `assets/data.js`, and `assets/app.js`
- Shared sticky nav + footer reused across all six pages
- Shared booking-related modals + helpers (so any "Reserve" button on any page triggers the same flow)
- Each page gets a "Ready to play?" CTA strip above the footer that links to the homepage hero
- Real Unsplash photography on each new page
- Responsive across mobile / tablet / desktop

**Out of scope:**
- Per-location detail pages (e.g., `locations/jersey-city-3rd-street.html`) — index page only
- Per-coach profile pages
- Per-event detail pages — RSVP modal stays the deepest level
- Real authentication, payment, CMS, calendar integration, or email send
- Build tooling (still no npm install, no bundler — open by double-clicking)
- Accessibility audit beyond reasonable defaults

## Architecture

### File layout

```
/
├── index.html                      (existing — refactored)
├── locations.html                  (new)
├── memberships.html                (new)
├── coaching.html                   (new)
├── events.html                     (new)
├── stringing.html                  (new)
├── assets/
│   ├── styles.css                  (extracted from index.html)
│   ├── data.js                     (LOCATIONS, SPORTS, TIERS, COACHES, EVENTS, STRINGS, TENSIONS)
│   └── app.js                      (escapeHtml, openModal, closeModal, all modal opener fns, mobile menu, scroll reveal, hero load)
└── docs/                           (existing specs/plans)
```

Each page links the three shared assets and contains only its own page-specific HTML + any page-specific `<style>` block (kept minimal — most styles come from `styles.css`).

### Shared chrome

Every page renders the same:
- **Sticky nav** at the top — logo (links to `index.html`), six nav links, "Reserve Court →" CTA (links to `index.html#top`)
- **Mobile menu overlay** with the same six links + Reserve CTA
- **"Ready to play?" strip** above the footer — single-line callout with "Reserve a court →" button linking to `index.html#top`
- **Footer** — same four-column sitemap + brand block + bottom row

The current page is highlighted in the nav via `aria-current="page"` on the matching `<a>`, styled with a Cobalt underline.

### Shared modals

`app.js` exposes the same modal infrastructure (`openModal`, `closeModal`) and all opener functions (`openLocationModal`, `openSportModal`, `openCourtModal`, `openConfirmModal`, `openJoinModal`, `openRsvpModal`, `openStringingModal`, plus the new `openWaitlistModal` for "coming soon" locations). Pages wire their own buttons but reuse the openers.

### Cross-page navigation

| Trigger | Behavior |
|---------|----------|
| Logo click (any page) | Navigate to `index.html` |
| Nav link click | Navigate to that page's `.html` |
| "Reserve Court →" CTA in nav | Navigate to `index.html#top` |
| Any "Reserve a court" button on a non-home page | Navigate to `index.html#top` |
| Page hero CTAs | Page-specific (see per-page section below) |
| Modal open | Stays on current page (no nav) |

## Per-Page Content

### `locations.html` — Find your court

1. **Page hero** — eyebrow "▸ FOUR OPEN. TWO COMING.", headline "Find your court.", short lede, no widget. Smaller than home hero (~360px tall).
2. **Filter chips** — Sport (Badminton / Pickleball / Ping Pong), Service (Coaching / Stringing / Events) — visual filtering of the grid below; multi-select.
3. **Locations grid** — 6 expanded cards (4 open + 2 soon), one card per location:
   - Open card: 4:3 photo, "Open" badge, city eyebrow, name, full address line, hours by day, court count by sport, "Reserve here →" button (links to `index.html#top`)
   - Soon card: 4:3 photo (different visual treatment), "Coming this season" badge, city + planned name, "Get notified →" button (opens `openWaitlistModal` — email field → confirmation)
4. **Ready-to-play strip** + footer

### `memberships.html` — Play more. Pay less.

1. **Page hero** — eyebrow "▸ MEMBER PERKS", headline "Play more. Pay less.", short lede.
2. **Tier cards** — three cards (Drop-in / Go Koto featured / All-Access). Same as homepage but with full perk lists (5–7 bullets each instead of 3–4) and "Become a member" CTAs that open `openJoinModal`.
3. **Feature comparison table** — rows are perks (early booking window, free events, clinic discounts, stringing discount, guest passes, freeze-membership option, family add-on, etc.), columns are the three tiers. Cells show ✓ / — / specific values (e.g., "72 hours", "Unlimited"). Cobalt accent for "yes" cells.
4. **FAQ accordion** — 5–7 questions (Can I freeze? Can I share? What if I cancel? When does my booking window open? Are guest passes capped? etc.). Click row → expand answer.
5. **Final CTA strip** — "Ready to belong?" + "Become a member" button (opens `openJoinModal` defaulted to Go Koto tier)
6. **Ready-to-play strip** + footer

### `coaching.html` — Learn from champions.

1. **Page hero** — eyebrow "▸ LEARN FROM CHAMPIONS", headline, short lede.
2. **Programs grid** — three large cards: Group Clinics · Private Lessons · Junior Academy. Each card has photo, description, price range, "Book a clinic / lesson / camp" button (opens a `openCoachingBookingModal` — pick program → location → time → confirmation).
3. **Coaches roster** — all 5 coaches as cards: photo, name, role, bio (2–3 sentences), specialty (badminton / pickleball / both), hourly rate for privates, "Book with [name]" button.
4. **Upcoming clinics list** — table or list, ~6 entries, each row: date, sport, level (Beginner / Intermediate / Advanced), coach, location, spots left, RSVP button (reuses `openRsvpModal`).
5. **FAQ accordion** — 4–5 questions (What level are clinics for? Are privates 1-on-1 only? Can I cancel? What's included? Bring my own racquet?).
6. **Ready-to-play strip** + footer

### `events.html` — What's on this season.

1. **Page hero** — eyebrow "▸ THIS SEASON", headline, short lede.
2. **Filter strip** — Sport (All / Badminton / Pickleball / Ping Pong), Location (All / each location), Month (All / specific months), Price (All / Free / Paid). Filters apply live to the list below; selecting filters narrows visible events.
3. **Events list** — ~12 events (vs homepage's 4). Same row layout as homepage: date block + name + meta + RSVP. Each row gets a sport-color tag (Badminton blue, Pickleball cyan, Ping Pong cobalt — but stay within the brand palette so all three are blues at different values).
4. **Past events / results** (optional, can cut) — small section below the list with 3 recent tournament results: "Spring Doubles Tournament — Mar 28 — Winners: Wei Chen / Jordan Park"
5. **Ready-to-play strip** + footer

### `stringing.html` — Strung in 24 hours.

1. **Page hero** — eyebrow "▸ PROFESSIONAL STRINGING", headline, short lede, "Book stringing →" CTA (opens `openStringingModal` — same as homepage).
2. **Three-step process** — three numbered cards: 01 Drop off → 02 Choose tension + string → 03 Pick up. Each card has icon/illustration placeholder, brief description.
3. **String catalog** — all strings (3+ entries) as cards: photo, name, gauge (e.g., "0.65mm"), durability rating (3/5 dots), control rating (4/5 dots), power rating (3/5 dots), price. Click card → mini detail modal with longer description.
4. **Tension guide** — horizontal slider visual: 22 lbs (Soft feel) — 24 lbs (Balanced ★ recommended) — 26 lbs (Crisp control) — 28 lbs (Pro level). Static visual, no interaction needed.
5. **FAQ accordion** — 4 questions (Can I bring my own string? How often should I restring? Same-day? Pickup hours?).
6. **Ready-to-play strip** + footer

## Visual System

Inherited entirely from the homepage spec — same Cobalt #2563EB accent, Inter typography, hard-edge rectangles, same modal styling. Each new page follows the same `section { padding: var(--section-py) 0 }` rhythm.

**Page-level hero variant:** the homepage hero is a full-bleed photo with embedded booking widget. Sub-page heroes are smaller (~360px tall), use a flat dark background or a much shorter photo strip, and never embed the booking widget. They establish the page topic and lead into content.

**New shared rule** (added to `styles.css`): `.page-hero` — `min-height: 360px`, padding-top to clear the sticky nav, single column centered text by default.

## Interaction Simulations

All new client-side flows:

| Trigger | Behavior |
|---------|----------|
| Locations filter chip click | Toggle chip "active" state; filter the locations grid (hide non-matching cards via `display: none`) |
| Locations "Get notified →" on soon card | `openWaitlistModal({ city })` → email input → "You're on the list" confirmation |
| Memberships FAQ row click | Expand/collapse the answer (accordion: only one open at a time) |
| Memberships comparison-table row hover | Subtle row highlight (no click action) |
| Coaching "Book a clinic / lesson / camp" | `openCoachingBookingModal({ program })` → 3 steps: location → time slot → confirmation |
| Coaching "Book with [coach]" | Same modal, prefilled coach name |
| Coaching clinic RSVP | Reuses `openRsvpModal` |
| Events filter strip | Filter the events list live (Sport ∩ Location ∩ Month ∩ Price); update count |
| Events RSVP | Reuses `openRsvpModal` |
| Stringing string-card click | `openStringDetailModal({ string })` — longer description, "Book this string" CTA |
| Any page "Reserve a court" button | `window.location.href = 'index.html#top'` |
| Any nav link or logo click | Native anchor navigation |

All modals retain ESC + backdrop-click close, focus trap to modal scope.

## Tech Architecture

### Files

- `assets/styles.css` — every CSS rule from the existing `index.html` `<style>` block, verbatim, plus new rules for page-hero, filter-chips, FAQ accordion, comparison table, ready-to-play strip, programs grid, coaches roster, string catalog cards, and tension guide.
- `assets/data.js` — `LOCATIONS`, `SPORTS`, `TIERS`, `COACHES`, `EVENTS`, `STRINGS`, `TENSIONS` arrays. Plus three new shapes: `PROGRAMS` (for coaching), `FAQS` (keyed by page, e.g., `FAQS.memberships = [...]`), and a small extension to `EVENTS` so each event carries `sport`, `location`, `month`, `price` fields for filter logic.
- `assets/app.js` — every JS function from the existing `<script>` block, plus new functions: `openWaitlistModal`, `openCoachingBookingModal`, `openStringDetailModal`, plus filter-chip logic, FAQ accordion logic, events-list filtering. Page-specific render calls (`renderLocations`, `renderEvents`, etc.) live in `app.js` and check whether their target element exists before rendering, so each page only triggers what it needs.

### How each new page links assets

```html
<head>
  <link rel="stylesheet" href="assets/styles.css">
  <!-- minimal page-specific <style> if absolutely needed -->
</head>
<body>
  <!-- shared nav (copy of index.html's nav) -->
  <main>
    <!-- page-specific content -->
  </main>
  <!-- shared "Ready to play?" strip -->
  <!-- shared footer -->
  <!-- shared mobile menu overlay -->
  <script src="assets/data.js"></script>
  <script src="assets/app.js"></script>
</body>
```

### Active-page nav highlight

Each page sets `<body data-page="locations">` (or `memberships`, etc.) and `app.js` adds `aria-current="page"` to the matching nav link on load.

## Risks & Assumptions

- **Asset extraction must not regress the homepage.** The refactor of `index.html` to use external `styles.css` / `data.js` / `app.js` is the highest-risk change. Smoke test the homepage end-to-end after extraction before building any new page.
- **Browser file:// loading caveat.** Loading `index.html` directly from disk works for inline CSS/JS but some browsers (Chrome) block external `<script src>` from `file://` due to CORS. Test on `file://` early; if blocked, document the workaround (use a local server like `python -m http.server` or `npx serve`).
- **No real coach photos.** Same caveat as homepage — Unsplash placeholders.
- **Filter logic is purely client-side.** No URL state, no shareable filtered views.

## Success Criteria

The expanded prototype succeeds when:
1. All six pages link to one another via the sticky nav and load in any modern browser.
2. Each page's primary interaction (filtering, RSVP, modal flows) works end-to-end without dead ends.
3. The visual system reads as one coherent site, not five disjointed ones.
4. A stakeholder can click into any of the five new pages and get a clear sense of what content / functionality that section of the real site would carry.
5. The homepage continues to work exactly as it did before the refactor.
