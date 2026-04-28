# Kotofit Motion (motion.dev) Integration — Design Spec

**Date:** 2026-04-27
**Owner:** jonathanchiang7@gmail.com
**Status:** Approved (brainstorming complete)
**Extends:** [docs/superpowers/specs/2026-04-27-kotofit-multipage-expansion-design.md](2026-04-27-kotofit-multipage-expansion-design.md)

## Project

Replace the current CSS + IntersectionObserver scroll-reveal with [motion.dev](https://motion.dev) — a JavaScript animation library — and add stagger so grid children animate in sequence. One unified animation system instead of CSS-only.

Restraint stays. No new flourishes (no page transitions, parallax, magnetic buttons, stat counters, modal springs). Just spring-driven scroll-reveal and stagger.

## Scope

**In scope:**
- Load motion.dev via CDN (UMD build) on all 7 HTML pages
- Two new utility classes (`.reveal`, `.reveal-stagger`) replace `.fade-up`
- New `initReveal()` function in `assets/app.js` replaces the existing `initScrollReveal()`
- New CSS initial-hidden states + `prefers-reduced-motion` fallback
- Class application updates across the 7 HTML pages and inside JS-rendered HTML (where dynamic markup currently doesn't carry `.fade-up` either, but should now carry `.reveal-stagger > *` semantics by virtue of being grid children)

**Out of scope:**
- Page-to-page transitions
- Hero parallax or scroll-linked animations on the hero photo
- Modal entrance/exit animations
- Magnetic / springy buttons
- Number-counter animations on stats
- Touch / gesture-driven motion

## Architecture

### Library inclusion

Add this `<script>` tag to the `<head>` of all 7 HTML files (after the Google Fonts stylesheet, before the existing app stylesheet — placement is flexible, just needs to load before `app.js` runs):

```html
<script src="https://cdn.jsdelivr.net/npm/motion@11/dist/motion.js"></script>
```

UMD build exposes a global `Motion` namespace (`Motion.animate`, `Motion.inView`, `Motion.stagger`, `Motion.spring`). No ESM `import`, no `type="module"`, no build step.

If the CDN is unreachable (offline, blocked, or 404), `window.Motion` is undefined; `initReveal()` detects this and immediately makes all `.reveal` / `.reveal-stagger > *` elements visible by setting `opacity: 1` and `transform: none`. Content always renders.

### Two utility classes

**`.reveal`** — single-element scroll-in animation.
- Initial CSS: `opacity: 0; transform: translateY(24px);`
- On in-view (20% threshold): `Motion.animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, easing: Motion.spring({ stiffness: 100, damping: 20 }) })`
- Triggers once, then unobserved.

**`.reveal-stagger`** — grid container that animates its direct children in sequence.
- Initial CSS: `.reveal-stagger > * { opacity: 0; transform: translateY(24px); }`
- On in-view (20% threshold): `Motion.animate(children, { opacity: [0, 1], y: [24, 0] }, { delay: Motion.stagger(0.05), duration: 0.6, easing: Motion.spring({ stiffness: 100, damping: 22 }) })`
- Triggers once, then unobserved. Stagger delay is 50ms per child.

### `initReveal()` in `assets/app.js`

Replaces `initScrollReveal()`. Pseudocode:

```javascript
function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const M = window.Motion;

  if (reduceMotion || !M) {
    // Fallback: make everything visible immediately
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  M.inView('.reveal', (el) => {
    M.animate(el, { opacity: [0, 1], y: [24, 0] }, {
      duration: 0.7,
      easing: M.spring({ stiffness: 100, damping: 20 }),
    });
  }, { amount: 0.2 });

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

The `inView` callback receives the element as its first argument; the third arg `{ amount: 0.2 }` mirrors the IntersectionObserver `threshold: 0.2` from the old code.

The page-init `DOMContentLoaded` listener calls `initReveal()` LAST, after all `render*` functions have populated grids. Order matters: stagger needs the children to exist in the DOM before it observes them.

### Class application

**In static HTML (the 7 page files):**
- `.section-head` (existing class on the homepage) → add `.reveal`
- `.section-title` (sub-page section headers) → add `.reveal`
- `.testimonial` (homepage events block) → add `.reveal`
- `.stringing` (homepage stringing block) → add `.reveal`
- `.faq-cta` (faq.html closing CTA) → add `.reveal`
- `.contact-card` (faq.html contact section) → add `.reveal`
- `.process-grid` (stringing.html three-step process) → add `.reveal-stagger`
- `.tension-guide` (stringing.html) → add `.reveal`
- `.mem-table` (memberships.html comparison table) → add `.reveal`

**Explicitly NOT given `.reveal`:**
- `.hero` and `.page-hero` blocks — they're above the fold on initial page load. Animating them would mean an opacity-0 flash before JS runs. The page-hero / hero must paint immediately.
- The sticky nav, footer, mobile menu, ready-strip — chrome that should be present, not animated in.

**In JS-rendered HTML (containers themselves declared in static HTML; their children are added by `render*` functions):**
- `.loc-grid`, `.loc-grid-page` → add `.reveal-stagger` to the container
- `.play-grid` → add `.reveal-stagger`
- `.mem-grid` → add `.reveal-stagger`
- `.coach-grid` (homepage) → add `.reveal-stagger`
- `.coaches-roster` (coaching page) → add `.reveal-stagger`
- `.programs-grid` (coaching page) → add `.reveal-stagger`
- `.events-list` (homepage and events page) → add `.reveal-stagger`
- `.clinics-list` (coaching page) → add `.reveal-stagger`
- `.strings-catalog` (stringing page) → add `.reveal-stagger`
- Each `.faq` accordion block on faq.html (4 instances) and on memberships/coaching/stringing pages → add `.reveal-stagger`

### CSS changes

In `assets/styles.css`:

1. **Remove or replace** the existing `.fade-up` and `.fade-up.in` rules.
2. **Add** new initial-hidden states:
   ```css
   .reveal { opacity: 0; transform: translateY(24px); }
   .reveal-stagger > * { opacity: 0; transform: translateY(24px); }
   @media (prefers-reduced-motion: reduce) {
     .reveal, .reveal-stagger > * { opacity: 1; transform: none; }
   }
   ```

The existing `@media (prefers-reduced-motion: reduce)` block in styles.css already disables `.fade-up` and the hero Ken-Burns scale. Update it to add the new selectors and remove the now-defunct `.fade-up` references.

## What stays unchanged

- **Hero Ken-Burns zoom** — CSS-only `.hero.loaded .hero-bg` transition remains. One-shot load animation, no benefit from Motion.
- **Hover effects** — `.loc-card:hover`, `.play-tile:hover .play-tile-bg`, `.btn-primary:hover`, etc. All CSS-only. Motion overkill for hover-only states.
- **Modal open/close** — instant. Scope-A explicitly excluded modal flourishes.
- **Smooth-scroll behavior** — `html { scroll-behavior: smooth }` stays.
- **Existing data flow** — `render*` functions, modal infrastructure, `escapeHtml`, etc. unchanged.

## Risks & Assumptions

- **CDN dependency.** First viewing requires internet to fetch motion.dev. Stakeholders viewing offline see the page without scroll-reveal animations (content still visible — no broken state).
- **CDN URL stability.** `https://cdn.jsdelivr.net/npm/motion@11/dist/motion.js` is the public jsdelivr mirror. Major version pinned to `@11`. If motion.dev publishes a breaking change in the patch range, animations could regress. Acceptable for a prototype.
- **Initial render flash.** Between HTML parse and `Motion.inView` callbacks running, `.reveal` elements are `opacity: 0`. Above-the-fold content (hero) doesn't carry `.reveal` (only scroll-in stuff does), so the hero renders immediately. Below-fold content is hidden until scrolled-to anyway, so the flash isn't visible.
- **JS-rendered grid children.** `render*` functions paint grid children via `innerHTML`. The children are direct children of `.reveal-stagger` containers, so the `:scope > *` selector matches them. Order of operations: `render*` populates → `initReveal()` runs `inView('.reveal-stagger', ...)` → on scroll-in, `:scope > *` is queried and animated. Verified design.
- **Page-init order.** `initReveal()` MUST run after the page-specific `render*Page()` calls so that the rendered children exist when `inView` callbacks attach. The plan will specify the exact placement.

## Success criteria

The integration succeeds when:
1. Every page loads motion.dev via CDN without console errors.
2. Scrolling down any page triggers spring-eased fade-up reveals on `.reveal` elements.
3. Grid children (location cards, sport tiles, membership tiers, coaches, events, clinics, strings, FAQ rows) animate in sequence with a noticeable but quick stagger (~50ms gaps).
4. `prefers-reduced-motion: reduce` skips all animations and shows content immediately.
5. CDN unreachability does not break the page — content renders without animations.
6. Hover effects, hero Ken-Burns, and modal flows continue to behave exactly as before.
