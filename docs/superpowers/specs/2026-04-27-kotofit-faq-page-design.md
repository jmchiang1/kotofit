# Kotofit FAQ Page — Design Spec

**Date:** 2026-04-27
**Owner:** jonathanchiang7@gmail.com
**Status:** Approved (brainstorming complete)
**Extends:** [docs/superpowers/specs/2026-04-27-kotofit-multipage-expansion-design.md](2026-04-27-kotofit-multipage-expansion-design.md)

## Project

Add a sixth sub-page — `faq.html` — populated with content sourced from the live Kotofit FAQ page at https://www.kotofit.com/faqs. The new page reuses the existing shared assets (nav, footer, page-hero, ready-strip, FAQ accordion CSS).

## Scope

**In scope:**
- One new HTML file: `faq.html` at the project root
- A new top-level `FAQ_PAGE` data structure on the existing `FAQS` object — five new keys, each holding the q/a pairs for one category
- New `renderFaqPage()` function in `assets/app.js`
- Add "FAQ" link to nav, mobile menu, and footer across **all six existing pages** plus the new `faq.html`
- "Still have questions?" closing CTA with WhatsApp + WeChat contact links

**Out of scope:**
- Search / live filter (the page is short enough that grouping is sufficient)
- Editing or expanding existing topic-specific FAQs on memberships/coaching/stringing pages
- Real WhatsApp/WeChat integration — links use the actual numbers from the source page (WhatsApp +1 551 328 7867, WeChat ID `kotofit1`) but open in new tabs / `https://wa.me/` URLs without further chat persistence

## Page Structure

### 1. Page hero
- Eyebrow: "▸ Frequently asked"
- Headline: "Got questions?"
- Lede: "Quick answers about how Kotofit works — booking, hours, courts, equipment, and getting in touch."

### 2. Five category sections (top to bottom)

Each category gets a `.section-title` block (with a Cobalt eyebrow + headline) plus a `.faq` accordion. Click any question → expand answer; only one open at a time per category.

**Category A — General** (`FAQS.general`)
- What is Kotofit?
- Tell me about the new Long Island City facility
- Is parking available across Kotofit facilities?

**Category B — Booking & Memberships** (`FAQS.booking`)
- How can I book reservations?
- Do I have to be a paid member to play?
- Can I extend my time?
- How do cancellations work?

**Category C — Hours** (`FAQS.hours`)
- Peak and off-peak hours at Jersey City locations
- Peak and off-peak hours at Long Island City

**Category D — Courts & Equipment** (`FAQS.courts`)
- How long can I stay at the facility?
- Can I bring friends?
- Do I need to bring my own equipment?
- What is my skill level?
- Can Kotofit help me find partners?

**Category E — Contact**
- Rendered as a flat block (not an accordion) since it's a single piece of contact info
- WhatsApp button → `https://wa.me/15513287867`
- WeChat block showing the WeChat ID `kotofit1` (no deep link — WeChat doesn't support https deep links cleanly; show the ID as copy-friendly text)

### 3. "Still have questions?" CTA strip
- Eyebrow + headline + brief copy ("We're a text or call away.")
- Two buttons: WhatsApp (Cobalt primary), WeChat (ghost)
- Sits between the FAQ content and the ready-strip

### 4. Ready-to-play strip + footer
Same shared components as other sub-pages.

## Cross-Page Updates

### Nav (all 7 pages: index.html, locations.html, memberships.html, coaching.html, events.html, stringing.html, faq.html)

Current nav links: Locations · Memberships · Coaching · Events · Stringing
Updated nav links: Locations · Memberships · Coaching · Events · Stringing · **FAQ**

The "Reserve Court →" CTA stays as-is (rightmost element).

### Mobile menu

Add `<a href="faq.html">FAQ</a>` to the mobile menu's `<nav>` block on every page (currently lists Locations / Memberships / Coaching / Events / Stringing — adds FAQ after Stringing).

### Footer

The existing "Connect" column in the footer has WhatsApp / Instagram / WeChat / Contact entries. Add an FAQ link to the "Play" column (after Stringing) on every page.

### Active-nav highlight

`faq.html` body gets `data-page="faq"`. Existing `initNavHighlight` logic in `app.js` already matches `href="faq.html"` against `body.dataset.page === "faq"` — no JS change needed beyond the page tag.

## Data shape

Add to `assets/data.js` inside the existing `FAQS` object:

```javascript
FAQS.general = [
  { q: 'What is Kotofit?', a: '...' },
  ...
];
FAQS.booking = [...];
FAQS.hours = [...];
FAQS.courts = [...];
```

Keep existing `FAQS.memberships`, `FAQS.coaching`, `FAQS.stringing` unchanged — they remain in use on their respective topic pages.

## Tech architecture

- `faq.html` follows the same pattern as the other sub-pages (link to shared `styles.css`, scripts to `data.js` + `app.js`, shared nav / mobile menu / footer / ready-strip)
- One new function in `app.js`: `renderFaqPage()` — calls `renderFaq('faq-general', FAQS.general)`, `renderFaq('faq-booking', FAQS.booking)`, etc., and wires the WhatsApp/WeChat buttons in the contact block + closing CTA
- `DOMContentLoaded` listener gets `if (typeof renderFaqPage === 'function') renderFaqPage();` added alongside the existing page-specific guards

## Risks & Assumptions

- **Source content fidelity:** the answers from the source page have been lightly normalized (trailing periods, sentence case, em-dashes) so they read consistently with the rest of the prototype's voice. No factual claims invented.
- **WhatsApp deep link:** `https://wa.me/15513287867` opens the WhatsApp web/app installed on the user's device. If neither is installed, browsers fall back to a "Get WhatsApp" page. Acceptable for a prototype.
- **WeChat:** no clean public deep link for ID-based add-friend; the page shows the ID as copyable text instead.

## Success criteria

The prototype succeeds when:
1. `faq.html` loads with all 13+ FAQ questions grouped under their categories.
2. Each accordion row expands/collapses; only one open at a time within a category.
3. The FAQ link appears in the sticky nav / mobile menu / footer on every page and is highlighted (Cobalt underline) when on `faq.html`.
4. The WhatsApp button opens `https://wa.me/15513287867`.
5. Visual style is indistinguishable from the other five sub-pages.
