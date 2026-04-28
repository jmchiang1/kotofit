# Kotofit motion.dev Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing CSS + IntersectionObserver scroll-reveal with motion.dev (UMD via CDN) — spring-eased fade-up on `.reveal` elements and staggered fade-up on grid children via `.reveal-stagger`. No new flourishes.

**Architecture:** Add one `<script src>` for motion.dev to each HTML file's `<head>`. Replace `.fade-up` CSS with `.reveal` and `.reveal-stagger > *` rules (+ updated `prefers-reduced-motion` block). Replace `initScrollReveal()` in `app.js` with `initReveal()` that uses `Motion.inView` + `Motion.animate` + `Motion.spring` + `Motion.stagger`. Apply the new classes to the right HTML elements across all 7 pages.

**Tech Stack:** Motion v11 (UMD build via jsdelivr CDN), vanilla CSS, vanilla JS.

**Spec:** [docs/superpowers/specs/2026-04-27-kotofit-motion-dev-design.md](../specs/2026-04-27-kotofit-motion-dev-design.md)

---

## File Structure

```
/
├── *.html (7 files)            (modified — add motion.dev <script>, add .reveal classes)
├── assets/
│   ├── styles.css              (modified — replace .fade-up with .reveal/.reveal-stagger rules)
│   └── app.js                  (modified — replace initScrollReveal with initReveal)
```

No new files. No removals.

---

## Task 1: Add motion.dev CDN script tag to all 7 HTML files

**Files:**
- Modify: `index.html`, `locations.html`, `memberships.html`, `coaching.html`, `events.html`, `stringing.html`, `faq.html`

- [ ] **Step 1: For each of the 7 HTML files, add the motion.dev script tag in `<head>`**

In each file's `<head>`, find the line:
```html
<link rel="stylesheet" href="assets/styles.css" />
```

Insert a new line IMMEDIATELY BEFORE it:
```html
<script src="https://cdn.jsdelivr.net/npm/motion@11/dist/motion.js"></script>
```

The final two consecutive lines should look like:
```html
<script src="https://cdn.jsdelivr.net/npm/motion@11/dist/motion.js"></script>
<link rel="stylesheet" href="assets/styles.css" />
```

Do this in all 7 files.

- [ ] **Step 2: Verify**

Run from project root:
```bash
grep -c 'cdn.jsdelivr.net/npm/motion@11' *.html
```
Expected: every file reports `1`.

- [ ] **Step 3: Commit**

```bash
git add *.html
git commit -m "feat(motion): load motion.dev v11 via CDN on all pages"
```

---

## Task 2: Replace `.fade-up` CSS with `.reveal` + `.reveal-stagger`

**Files:**
- Modify: `assets/styles.css`

- [ ] **Step 1: Locate the existing `.fade-up` rules**

In `assets/styles.css`, find these existing rules (they live in the `/* === MOTION === */` section near the bottom):

```css
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 700ms var(--ease-out), transform 700ms var(--ease-out); }
.fade-up.in { opacity: 1; transform: translateY(0); }
```

And the existing reduced-motion block:

```css
@media (prefers-reduced-motion: reduce) {
  .fade-up { opacity: 1; transform: none; transition: none; }
  .hero.loaded .hero-bg { transform: none; transition: none; }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: Replace the `.fade-up` rules with `.reveal` + `.reveal-stagger` rules**

Replace the two `.fade-up` declarations from Step 1 with:

```css
.reveal { opacity: 0; transform: translateY(24px); }
.reveal-stagger > * { opacity: 0; transform: translateY(24px); }
```

(`.reveal` and `.reveal-stagger > *` only set the initial-hidden state. Motion.dev handles the actual animation via inline styles when in-view; CSS no longer carries the transition.)

- [ ] **Step 3: Update the reduced-motion block**

Replace the existing reduced-motion media block with:

```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-stagger > * { opacity: 1; transform: none; }
  .hero.loaded .hero-bg { transform: none; transition: none; }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 4: Verify**

Read `assets/styles.css` and confirm:
- No `.fade-up` rules remain (use `grep -n "fade-up" assets/styles.css` — should return zero matches)
- `.reveal { opacity: 0; ... }` and `.reveal-stagger > * { opacity: 0; ... }` present
- Reduced-motion block lists `.reveal, .reveal-stagger > *`

- [ ] **Step 5: Commit**

```bash
git add assets/styles.css
git commit -m "refactor(motion): replace .fade-up CSS with .reveal/.reveal-stagger initial states"
```

---

## Task 3: Replace `initScrollReveal()` with `initReveal()` in `assets/app.js`

**Files:**
- Modify: `assets/app.js`

- [ ] **Step 1: Locate the existing `initScrollReveal` function**

In `assets/app.js`, find the entire function (in the `// === SCROLL REVEAL ===` block):

```javascript
// === SCROLL REVEAL ===
function initScrollReveal() {
  const targets = document.querySelectorAll('.section-head, .play-tile, .mem-card, .loc-card, .coach-feature, .coach-mini, .event-row, .stringing, .program-card, .coach-row, .clinic-row, .string-card');
  if (!targets.length) return;
  targets.forEach(el => el.classList.add('fade-up'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  targets.forEach(el => observer.observe(el));
}
```

- [ ] **Step 2: Replace the entire function with `initReveal`**

Replace the `// === SCROLL REVEAL ===` block (everything from the comment through the closing `}`) with:

```javascript
// === REVEAL (motion.dev) ===
function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const M = window.Motion;

  // Fallback: no Motion library, or reduced-motion preference → show everything immediately.
  if (reduceMotion || !M) {
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Singleton reveal — single elements fade-up with a spring.
  M.inView('.reveal', (el) => {
    M.animate(el, { opacity: [0, 1], y: [24, 0] }, {
      duration: 0.7,
      easing: M.spring({ stiffness: 100, damping: 20 }),
    });
  }, { amount: 0.2 });

  // Stagger reveal — direct children of a container fade-up in sequence.
  M.inView('.reveal-stagger', (el) => {
    const children = el.querySelectorAll(':scope > *');
    if (!children.length) return;
    M.animate(children, { opacity: [0, 1], y: [24, 0] }, {
      delay: M.stagger(0.05),
      duration: 0.6,
      easing: M.spring({ stiffness: 100, damping: 22 }),
    });
  }, { amount: 0.2 });
}
```

- [ ] **Step 3: Update the page-init `DOMContentLoaded` listener**

Find the `// === PAGE INIT ===` block. It currently has a line like:

```javascript
initScrollReveal();
```

The line is in the middle of the init block, alongside the other `init*`/`render*` calls.

Two changes:
1. Rename the call from `initScrollReveal()` to `initReveal()`
2. Move it to the VERY END of the listener (after every `render*Page` guard line) so it runs after grids are populated

Concretely, the bottom of the page-init block should look like (showing the last few lines):

```javascript
  if (typeof renderLocationsPage === 'function') renderLocationsPage();
  if (typeof renderMembershipsPage === 'function') renderMembershipsPage();
  if (typeof renderCoachingPage === 'function') renderCoachingPage();
  if (typeof renderEventsPage === 'function') renderEventsPage();
  if (typeof renderStringingPage === 'function') renderStringingPage();
  if (typeof renderFaqPage === 'function') renderFaqPage();
  initReveal();
});
```

- [ ] **Step 4: Verify**

- `grep -n initScrollReveal assets/app.js` returns ZERO matches (function is fully replaced)
- `grep -n initReveal assets/app.js` returns at least 2 matches (definition + call)
- The `initReveal()` call sits AFTER all `render*Page` guards in the `DOMContentLoaded` listener

- [ ] **Step 5: Commit**

```bash
git add assets/app.js
git commit -m "feat(motion): replace initScrollReveal with motion.dev-powered initReveal"
```

---

## Task 4: Apply `.reveal` / `.reveal-stagger` classes across all 7 HTML pages

**Files:**
- Modify: `index.html`, `locations.html`, `memberships.html`, `coaching.html`, `events.html`, `stringing.html`, `faq.html`

This is the largest task — class additions only, across multiple files. No removals, no other changes.

**Naming guide:**
- Use `class="existing-class reveal"` (append, don't replace)
- For grid containers, use `class="existing-class reveal-stagger"`
- Skip the `.hero` and `.page-hero` blocks (above the fold)
- Skip the sticky nav, mobile menu, footer, ready-strip (chrome)

### `index.html`

- [ ] **Step 1: Add `.reveal` to `<header class="section-head">` (5 places)**

Find each occurrence of `<header class="section-head">` in `index.html`. There are five (one per non-hero section: locations, play, memberships, coaching, events).

Change each to:
```html
<header class="section-head reveal">
```

- [ ] **Step 2: Add `.reveal-stagger` to grid containers (5 places)**

Make these class additions:
- `<div class="loc-grid" id="loc-grid">` → `<div class="loc-grid reveal-stagger" id="loc-grid">`
- `<div class="play-grid" id="play-grid">` → `<div class="play-grid reveal-stagger" id="play-grid">`
- `<div class="mem-grid" id="mem-grid">` → `<div class="mem-grid reveal-stagger" id="mem-grid">`
- `<div class="coach-grid" id="coach-grid">` → `<div class="coach-grid reveal-stagger" id="coach-grid">`
- `<div class="events-list" id="events-list">` → `<div class="events-list reveal-stagger" id="events-list">`

- [ ] **Step 3: Add `.reveal` to `<blockquote class="testimonial">` and `<div class="stringing">`**

```html
<blockquote class="testimonial reveal">
```
```html
<div class="stringing reveal">
```

(The outer `<section id="stringing">` is the section anchor; the inner `<div class="stringing">` is the visual block.)

### `locations.html`

- [ ] **Step 4: Add `.reveal` to `<div class="section-title">` if present and `.reveal-stagger` to `.loc-grid-page`**

Add `.reveal` to any `<div class="section-title">` blocks (locations.html may not have one — only sub-pages with multiple sections do). Add `.reveal-stagger` to:
```html
<div class="loc-grid-page reveal-stagger" id="loc-grid-page">
```

### `memberships.html`

- [ ] **Step 5: Add `.reveal` to `<div class="section-title">` (3 instances) and `<table class="mem-table">`. Add `.reveal-stagger` to `<div class="mem-grid">` and to `<div class="faq" id="faq-memberships">`.**

```html
<div class="section-title reveal">      (×3 — one per non-hero section)
<div class="mem-grid reveal-stagger" id="mem-grid">
<table class="mem-table reveal">
<div class="faq reveal-stagger" id="faq-memberships">
```

### `coaching.html`

- [ ] **Step 6: Add classes to coaching page**

```html
<div class="section-title reveal">                     (×4 — programs, roster, clinics, FAQ)
<div class="programs-grid reveal-stagger" id="programs-grid">
<div class="coaches-roster reveal-stagger" id="coaches-roster">
<div class="clinics-list reveal-stagger" id="clinics-list">
<div class="faq reveal-stagger" id="faq-coaching">
```

### `events.html`

- [ ] **Step 7: Add classes to events page**

```html
<div class="events-list reveal-stagger" id="events-list-page">
```

(The events page has filter chips that are already visible when the user lands — they don't need reveal animation. The events list does. The page-hero is intentionally excluded.)

### `stringing.html`

- [ ] **Step 8: Add classes to stringing page**

```html
<div class="section-title reveal">                     (×4 — process, catalog, tension, FAQ)
<div class="process-grid reveal-stagger">
<div class="strings-catalog reveal-stagger" id="strings-catalog">
<div class="tension-guide reveal">
<div class="faq reveal-stagger" id="faq-stringing">
```

### `faq.html`

- [ ] **Step 9: Add classes to FAQ page**

```html
<div class="section-title reveal">                     (×5 — general, booking, hours, courts, contact)
<div class="faq reveal-stagger" id="faq-general">
<div class="faq reveal-stagger" id="faq-booking">
<div class="faq reveal-stagger" id="faq-hours">
<div class="faq reveal-stagger" id="faq-courts">
<div class="contact-card reveal">
<div class="faq-cta reveal">
```

(The closing CTA's `.faq-cta` block sits inside its own `<section>`. Don't add `.section-title reveal` to a section that doesn't have a `.section-title` — only the 5 categorized sections have one.)

- [ ] **Step 10: Verify across all 7 files**

Run from project root:
```bash
grep -c 'class="[^"]*\breveal\b' *.html
```
Each file should report ≥ 1 (homepage will be ~10, sub-pages 4-10 each).

```bash
grep -c 'class="[^"]*\breveal-stagger\b' *.html
```
Each file should report ≥ 1 (homepage ~5, sub-pages 1-4 each).

Quick sanity check — none of the page-hero or hero blocks should have these classes:
```bash
grep -E 'class="[^"]*(page-hero|hero)[^"]*\breveal' *.html
```
Expected: zero matches.

- [ ] **Step 11: Commit**

```bash
git add *.html
git commit -m "feat(motion): apply .reveal and .reveal-stagger classes across all pages"
```

---

## Task 5: Final QA — visual verification + fallback checks

**Files:** verification only.

- [ ] **Step 1: Open each page in a browser and watch a scroll**

The user (not the subagent — the subagent has no browser) opens each of the 7 HTML pages and verifies:
- Above the fold: hero / page-hero is visible immediately. No opacity-0 flash.
- Scrolling down: section headers and grid cards spring-fade-up; grid children come in sequence with a small delay between each.
- Console: no errors. `Motion` is defined (typeable in DevTools console).

Subagents should perform these checks (in absence of browser access):
- `grep -c 'cdn.jsdelivr.net/npm/motion' *.html` → 7 (each file loads motion.dev once)
- `grep -c 'reveal\|reveal-stagger' *.html` → every file ≥ 1
- `grep -n 'fade-up' assets/styles.css assets/app.js *.html` → ZERO matches anywhere
- `grep -n 'initScrollReveal' assets/app.js` → ZERO
- `grep -n 'function initReveal' assets/app.js` → 1 (definition)
- `grep -n 'initReveal()' assets/app.js` → 1 call (in the page-init listener), placed AFTER all `render*Page` guards

- [ ] **Step 2: Verify CDN URL responds 200**

```bash
curl -sI -o /dev/null -w "%{http_code}\n" "https://cdn.jsdelivr.net/npm/motion@11/dist/motion.js"
```
Expected: `200`.

If the URL returns 404 or 5xx, motion.dev won't load. Verify the package version on jsdelivr; if `motion@11` is gone, fall back to `motion@latest` (slightly less stable but always resolves).

- [ ] **Step 3: Commit (if anything fixed) or skip**

```bash
git add -u
git commit --allow-empty -m "polish(motion): final QA — script load + class application verified"
```

---

## Self-review notes

The plan covers every spec section:

| Spec section | Plan task |
|--------------|-----------|
| Load motion.dev via CDN on all 7 pages | Task 1 |
| Two utility classes `.reveal` / `.reveal-stagger` (CSS) | Task 2 |
| `initReveal()` replaces `initScrollReveal()`, runs LAST in page-init | Task 3 |
| Class application across 7 HTML pages, including JS-rendered grid containers | Task 4 |
| Reduced-motion fallback (skip Motion calls + show everything) | Task 3 step 2 |
| CDN-failure fallback (Motion undefined → show everything) | Task 3 step 2 |
| Hero / page-hero excluded from `.reveal` | Task 4 (explicitly noted, not added to any hero block) |
| `.fade-up` removed from CSS, JS, and HTML | Tasks 2, 3, and (implicit in Task 4 — `.fade-up` was only added by JS at runtime, not in static HTML, so nothing to remove from HTML) |

Function and identifier names used consistently: `initReveal`, `Motion.inView`, `Motion.animate`, `Motion.spring`, `Motion.stagger`, `.reveal`, `.reveal-stagger`, `:scope > *`. No drift.

No placeholders. All steps include actual code or verifiable commands.

The largest single task (Task 4) touches 7 files. If a subagent struggles with that breadth, it can be split per-file. For now it's a single task with explicit per-file substeps.
