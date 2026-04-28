# Kotofit FAQ Page + Logo Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sixth sub-page (`faq.html`) with categorized FAQs sourced from kotofit.com/faqs, and add the existing `assets/logo.png` next to the "KOTOFIT" wordmark in the nav + footer of every page.

**Architecture:** Two cross-cutting changes plus one new page. The logo + FAQ-link addition touches every existing HTML file's shared chrome (nav, mobile menu, footer). The new FAQ page follows the established sub-page pattern (shared assets, `<body data-page="faq">`, `renderFaqPage()` invoked via the existing page-init guard).

**Tech Stack:** HTML5, vanilla CSS, vanilla JS, Inter from Google Fonts, real Unsplash photography. No build, no dependencies.

**Spec:** [docs/superpowers/specs/2026-04-27-kotofit-faq-page-design.md](../specs/2026-04-27-kotofit-faq-page-design.md)

---

## File Structure

```
/
├── index.html, locations.html, memberships.html, coaching.html,
│   events.html, stringing.html       (modified — logo + FAQ link)
├── faq.html                          (new)
├── assets/
│   ├── styles.css                    (modified — logo + faq-page rules)
│   ├── data.js                       (modified — FAQS additions + CONTACT_INFO)
│   ├── app.js                        (modified — renderFaqPage)
│   └── logo.png                      (already exists)
```

---

## Task 1: Cross-page chrome — add logo image AND FAQ link to all 6 existing pages

**Files:**
- Modify: `assets/styles.css`
- Modify: `index.html`, `locations.html`, `memberships.html`, `coaching.html`, `events.html`, `stringing.html`

This task touches the same three blocks (nav, mobile menu, footer) on all 6 existing pages. Do them in one pass — same edit pattern for each file.

- [ ] **Step 1: Add logo image CSS to `assets/styles.css`**

Append at the very end of `assets/styles.css`:

```css
/* === LOGO IMAGE === */
.nav-logo { display: inline-flex; align-items: center; gap: 10px; }
.nav-logo img { height: 28px; width: auto; display: block; }
.footer .brand .logo { display: inline-flex; align-items: center; gap: 12px; }
.footer .brand .logo img { height: 32px; width: auto; display: block; }
```

- [ ] **Step 2: Update each of the 6 existing HTML files**

For EACH file (`index.html`, `locations.html`, `memberships.html`, `coaching.html`, `events.html`, `stringing.html`), apply these three edits:

**Edit 2a — Nav logo: add `<img>` before "KOTOFIT" text**

Find:
```html
<a href="..." class="nav-logo">KOTOFIT</a>
```
(The `href` value differs per page: `index.html` uses `href="#top"`; sub-pages use `href="index.html"`.)

Change the inner content to include the image — preserve the existing `href`:
```html
<a href="..." class="nav-logo"><img src="assets/logo.png" alt="" />KOTOFIT</a>
```

**Edit 2b — Nav links: add FAQ link after Stringing**

Find:
```html
<ul class="nav-links">
  <li><a href="locations.html">Locations</a></li>
  <li><a href="memberships.html">Memberships</a></li>
  <li><a href="coaching.html">Coaching</a></li>
  <li><a href="events.html">Events</a></li>
  <li><a href="stringing.html">Stringing</a></li>
</ul>
```
(Note: `index.html` may use the same hrefs after the recent fix; if they differ, just add the FAQ link in the same style.)

Add a new `<li>` after Stringing:
```html
<ul class="nav-links">
  <li><a href="locations.html">Locations</a></li>
  <li><a href="memberships.html">Memberships</a></li>
  <li><a href="coaching.html">Coaching</a></li>
  <li><a href="events.html">Events</a></li>
  <li><a href="stringing.html">Stringing</a></li>
  <li><a href="faq.html">FAQ</a></li>
</ul>
```

**Edit 2c — Mobile menu: add FAQ link after Stringing**

Find the mobile-menu `<nav>` block. It looks like (sub-pages):
```html
<nav>
  <a href="locations.html">Locations</a>
  <a href="memberships.html">Memberships</a>
  <a href="coaching.html">Coaching</a>
  <a href="events.html">Events</a>
  <a href="stringing.html">Stringing</a>
</nav>
```
(`index.html`'s mobile menu also includes a `<a href="#top">Reserve</a>` line in the middle — leave that alone.)

Add an FAQ link after Stringing:
```html
<nav>
  <a href="locations.html">Locations</a>
  <a href="memberships.html">Memberships</a>
  <a href="coaching.html">Coaching</a>
  <a href="events.html">Events</a>
  <a href="stringing.html">Stringing</a>
  <a href="faq.html">FAQ</a>
</nav>
```

**Edit 2d — Footer brand block: add `<img>` before "KOTOFIT" text**

Find:
```html
<div class="logo">KOTOFIT</div>
```

Change to:
```html
<div class="logo"><img src="assets/logo.png" alt="" />KOTOFIT</div>
```

**Edit 2e — Footer "Play" column: add FAQ link**

Find the footer Play column (slightly different on each page but always:
```html
<h4>Play</h4>
<ul>
  <li><a href="locations.html">Locations</a></li>
  <li><a href="...">Reserve</a></li>
  <li><a href="memberships.html">Memberships</a></li>
  <li><a href="stringing.html">Stringing</a></li>
</ul>
```

Add an FAQ entry as the last item:
```html
<h4>Play</h4>
<ul>
  <li><a href="locations.html">Locations</a></li>
  <li><a href="...">Reserve</a></li>
  <li><a href="memberships.html">Memberships</a></li>
  <li><a href="stringing.html">Stringing</a></li>
  <li><a href="faq.html">FAQ</a></li>
</ul>
```

- [ ] **Step 3: Verify**

For each file, confirm:
- `class="nav-logo"` now contains an `<img>` followed by "KOTOFIT" text
- `<ul class="nav-links">` has 6 items ending in FAQ
- Mobile-menu `<nav>` has the FAQ link
- Footer brand `.logo` div contains an `<img>` followed by "KOTOFIT" text
- Footer "Play" column has 5 items ending in FAQ

- [ ] **Step 4: Commit**

```bash
git add assets/styles.css *.html
git commit -m "feat(chrome): add logo image and FAQ nav link across all pages"
```

---

## Task 2: Extend `assets/data.js` with new FAQS categories and CONTACT_INFO

**Files:**
- Modify: `assets/data.js`

- [ ] **Step 1: Append to the existing `FAQS` object**

In `assets/data.js`, find the existing `FAQS` declaration. It currently has `memberships`, `coaching`, and `stringing` keys. Add four new keys to the SAME object — either by directly editing the object literal to include them, or by appending `FAQS.general = [...]; FAQS.booking = [...]; ...` AFTER the existing declaration.

Easiest approach: after the closing `};` of the `FAQS = { ... };` block, append:

```javascript
FAQS.general = [
  { q: 'What is Kotofit?', a: 'Kotofit operates multiple sports facilities in Jersey City and Long Island City, with indoor courts for badminton, pickleball, and table tennis across four locations — each with its own hours and amenities.' },
  { q: 'Tell me about the new Long Island City facility.', a: 'Our newest facility is at 47-10 10th Street in Long Island City — twelve courts open until 11PM, with street parking around the building. See the Locations page for the full address and hours.' },
  { q: 'Is parking available at Kotofit facilities?', a: 'Parking varies by location. Jersey City facilities offer street parking and free lot parking with time restrictions. Long Island City has street parking available around the building.' },
];

FAQS.booking = [
  { q: 'How can I book reservations?', a: 'Create a free account on the reservation platform, choose "Book full court / find a partner," select your time slot, and you\'ll receive a pin code via email confirmation for facility entry.' },
  { q: 'Do I have to be a paid member to play?', a: 'No — we offer free memberships as well. Free members can book courts and open plays up to two weeks in advance.' },
  { q: 'Can I extend my time?', a: 'Yes, additional time can be reserved if slots are available. Exceeding your reservation without booking the extension triggers automatic charges.' },
  { q: 'How do cancellations work?', a: 'Jersey City: free cancellations 48+ hours before; $5 penalty 12-48 hours before (credited to your account). Long Island City: full refunds outside 24 hours. Coaching sessions are non-refundable across all locations.' },
];

FAQS.hours = [
  { q: 'What are peak and off-peak hours at Jersey City locations?', a: 'Peak hours run weekdays 5:30PM-11PM and weekends 7AM-11PM. Off-peak times are weekday mornings, weekday late nights, and weekend early mornings or late nights.' },
  { q: 'What are peak and off-peak hours at Long Island City?', a: 'Peak hours run weekdays 5PM-10PM and weekends 7AM-11PM. Off-peak includes weekday daytime, late nights, and weekend early or late times.' },
];

FAQS.courts = [
  { q: 'How long can I stay at the facility?', a: 'You can access the court from 10 minutes before your reservation to 5 minutes after. Past that window, the next booking takes the court.' },
  { q: 'Can I bring friends?', a: 'Yes — up to six people per court booking. Any additional players are charged at $12 per hour.' },
  { q: 'Do I need to bring my own equipment?', a: 'No — we provide badminton racquets, pickleball paddles, and table tennis paddles plus balls. All free with your booking.' },
  { q: 'What is my skill level?', a: 'Skill levels are split into Beginner, Intermediate, and Advanced for badminton. For pickleball, we have a reference video at the front desk and on our community channels — ask any coach if you\'re not sure where to start.' },
  { q: 'Can Kotofit help me find partners to play with?', a: 'Yes — the reservation platform has a "Find a Partner" feature that matches players by proficiency. Member events and mixers are great ways to meet regulars at your home court too.' },
];

const CONTACT_INFO = {
  whatsappNumber: '+1 551 328 7867',
  whatsappUrl: 'https://wa.me/15513287867',
  wechatId: 'kotofit1',
};
```

- [ ] **Step 2: Verify**

Read `data.js` and confirm:
- The original `FAQS` object with `memberships`, `coaching`, `stringing` is unchanged
- Four new keys are attached: `FAQS.general`, `FAQS.booking`, `FAQS.hours`, `FAQS.courts`
- `CONTACT_INFO` is defined at module scope

- [ ] **Step 3: Commit**

```bash
git add assets/data.js
git commit -m "feat(data): add FAQ categories (general, booking, hours, courts) and contact info"
```

---

## Task 3: Add `renderFaqPage` to `assets/app.js` + small CSS for the contact + closing-CTA blocks

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/styles.css`

- [ ] **Step 1: Append CSS for the FAQ page's contact block + closing CTA strip**

Append at the end of `assets/styles.css`:

```css
/* === FAQ PAGE — contact card === */
.contact-card { background: var(--surface); border: 1px solid var(--elevated); padding: clamp(28px, 4vw, 40px); display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; }
@media (max-width: 720px) { .contact-card { grid-template-columns: 1fr; gap: 20px; } }
.contact-card .label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mute); margin-bottom: 8px; }
.contact-card .value { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--bone); margin-bottom: 14px; word-break: break-all; }
.contact-card .btn { padding: 12px 18px; font-size: 11px; }
.contact-card .copy-hint { font-size: 11px; color: var(--mute); margin-top: 8px; }

/* === FAQ PAGE — closing CTA === */
.faq-cta { background: var(--surface); border: 1px solid var(--elevated); padding: clamp(32px, 5vw, 56px); text-align: center; }
.faq-cta h3 { font-size: clamp(24px, 3vw, 32px); font-weight: 800; letter-spacing: -0.02em; margin: 10px 0 12px; }
.faq-cta h3 em { font-style: normal; color: var(--cobalt); }
.faq-cta p { color: var(--mute); font-size: 14px; line-height: 1.55; margin: 0 auto 24px; max-width: 480px; }
.faq-cta .btns { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
```

- [ ] **Step 2: Append `renderFaqPage` to `assets/app.js`**

In `assets/app.js`, find the `// === PAGE INIT ===` block. Immediately BEFORE it, append:

```javascript
// === FAQ PAGE ===
function renderFaqPage() {
  // Each category gets its own accordion via the existing renderFaq helper.
  if (typeof FAQS !== 'undefined') {
    renderFaq('faq-general',  FAQS.general);
    renderFaq('faq-booking',  FAQS.booking);
    renderFaq('faq-hours',    FAQS.hours);
    renderFaq('faq-courts',   FAQS.courts);
  }

  // Contact card buttons + copy hint
  const wechatBtn = document.getElementById('faq-wechat-copy');
  if (wechatBtn && typeof CONTACT_INFO !== 'undefined') {
    wechatBtn.addEventListener('click', () => {
      const id = CONTACT_INFO.wechatId;
      navigator.clipboard?.writeText(id).then(() => {
        const hint = document.getElementById('faq-wechat-hint');
        if (hint) {
          hint.textContent = 'Copied!';
          setTimeout(() => { hint.textContent = 'Click to copy WeChat ID'; }, 1500);
        }
      }).catch(() => {
        // Clipboard API unavailable — fallback: select the visible text
        const hint = document.getElementById('faq-wechat-hint');
        if (hint) hint.textContent = 'Copy manually: ' + id;
      });
    });
  }
}
```

- [ ] **Step 3: Add the page-init guard for `renderFaqPage`**

In `assets/app.js`, find the `// === PAGE INIT ===` block's `DOMContentLoaded` listener. It already has guards like:
```javascript
if (typeof renderLocationsPage === 'function') renderLocationsPage();
if (typeof renderMembershipsPage === 'function') renderMembershipsPage();
...
```

Add a new line in the same group:
```javascript
if (typeof renderFaqPage === 'function') renderFaqPage();
```

(Place it after the `renderStringingPage` guard line so the order matches the nav order.)

- [ ] **Step 4: Verify**

- `renderFaqPage` is defined before `// === PAGE INIT ===`
- The page-init block calls `renderFaqPage` with a `typeof` guard
- New CSS rules appended at end of `styles.css`

- [ ] **Step 5: Commit**

```bash
git add assets/app.js assets/styles.css
git commit -m "feat(faq): add renderFaqPage with contact card + closing CTA styles"
```

---

## Task 4: Build `faq.html`

**Files:**
- Create: `faq.html`

- [ ] **Step 1: Create `faq.html` at the project root**

Exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FAQ — Kotofit</title>
  <meta name="description" content="Common questions about Kotofit — booking, hours, courts, equipment, and how to get in touch." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body data-page="faq">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo"><img src="assets/logo.png" alt="" />KOTOFIT</a>
      <ul class="nav-links">
        <li><a href="locations.html">Locations</a></li>
        <li><a href="memberships.html">Memberships</a></li>
        <li><a href="coaching.html">Coaching</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="stringing.html">Stringing</a></li>
        <li><a href="faq.html">FAQ</a></li>
      </ul>
      <a href="index.html#top" class="nav-cta">Reserve Court →</a>
      <button class="nav-burger" aria-label="Open menu"><span></span></button>
    </div>
  </nav>

  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <button class="close" id="mm-close" aria-label="Close menu">×</button>
    <nav>
      <a href="locations.html">Locations</a>
      <a href="memberships.html">Memberships</a>
      <a href="coaching.html">Coaching</a>
      <a href="events.html">Events</a>
      <a href="stringing.html">Stringing</a>
      <a href="faq.html">FAQ</a>
    </nav>
    <a href="index.html#top" class="mm-cta">Reserve a court →</a>
  </div>

  <main>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">▸ Frequently asked</span>
        <h1 class="display-l">Got questions?</h1>
        <p class="lede">Quick answers about how Kotofit works — booking, hours, courts, equipment, and getting in touch.</p>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ General</div>
          <h2>About Kotofit.</h2>
        </div>
        <div class="faq" id="faq-general"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Booking & memberships</div>
          <h2>Reserving a court.</h2>
        </div>
        <div class="faq" id="faq-booking"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Hours</div>
          <h2>When we're open.</h2>
        </div>
        <div class="faq" id="faq-hours"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Courts & equipment</div>
          <h2>While you play.</h2>
        </div>
        <div class="faq" id="faq-courts"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Contact</div>
          <h2>How to reach us.</h2>
        </div>
        <div class="contact-card">
          <div>
            <div class="label">▸ WhatsApp</div>
            <div class="value">+1 551 328 7867</div>
            <a class="btn btn-primary" href="https://wa.me/15513287867" target="_blank" rel="noopener">Open WhatsApp →</a>
          </div>
          <div>
            <div class="label">▸ WeChat ID</div>
            <div class="value">kotofit1</div>
            <button class="btn btn-ghost" id="faq-wechat-copy">Copy ID</button>
            <div class="copy-hint" id="faq-wechat-hint">Click to copy WeChat ID</div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="faq-cta">
          <span class="eyebrow">▸ Still have questions?</span>
          <h3>We're a text or call <em>away.</em></h3>
          <p>Hit us on WhatsApp or WeChat — usually back within an hour during open hours.</p>
          <div class="btns">
            <a class="btn btn-primary" href="https://wa.me/15513287867" target="_blank" rel="noopener">WhatsApp →</a>
            <button class="btn btn-ghost" onclick="document.getElementById('faq-wechat-copy')?.click()">Copy WeChat ID</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <section class="ready-strip">
    <div class="container inner">
      <div>
        <h3>Ready when you <em>are.</em></h3>
        <div class="ready-meta">Reservations take 30 seconds.</div>
      </div>
      <a href="index.html#top" class="btn btn-primary">Reserve a court →</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <div class="logo"><img src="assets/logo.png" alt="" />KOTOFIT</div>
          <p>America's home for badminton, pickleball, and indoor sports. Four locations across NJ and NY, growing.</p>
        </div>
        <div>
          <h4>Play</h4>
          <ul>
            <li><a href="locations.html">Locations</a></li>
            <li><a href="index.html#top">Reserve</a></li>
            <li><a href="memberships.html">Memberships</a></li>
            <li><a href="stringing.html">Stringing</a></li>
            <li><a href="faq.html">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Learn</h4>
          <ul>
            <li><a href="coaching.html">Coaching</a></li>
            <li><a href="coaching.html">Clinics</a></li>
            <li><a href="coaching.html">Youth</a></li>
            <li><a href="events.html">Events</a></li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="https://wa.me/15513287867" target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">WeChat</a></li>
            <li><a href="faq.html">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 Kotofit</div>
        <div>NJ · NY · Brooklyn (soon) · Queens (soon)</div>
      </div>
    </div>
  </footer>

  <script src="assets/data.js"></script>
  <script src="assets/app.js"></script>
</body>
</html>
```

(Note the small inline `onclick` on the closing-CTA's "Copy WeChat ID" button — it just delegates to the contact card's button handler, so the same copy logic runs from either spot. This is a deliberate small exception to the "no inline onclick" pattern because the click target is wired by JS in `renderFaqPage` anyway.)

- [ ] **Step 2: Verify**

- `faq.html` exists at the project root
- `<body data-page="faq">` is set
- All 5 category sections render their accordion target IDs
- Contact section has both WhatsApp button (linking to `https://wa.me/15513287867`) and WeChat copy button
- Closing CTA strip is below the contact section
- Ready-to-play strip + footer present

- [ ] **Step 3: Commit**

```bash
git add faq.html
git commit -m "feat(faq): build faq.html with categorized accordions and contact card"
```

---

## Task 5: Final smoke check

**Files:** verification only, no edits expected unless issues are found.

- [ ] **Step 1: Cross-link sweep**

Run from project root:
```bash
grep -hoE 'href="[a-z][^"#]*\.html[^"]*"' *.html | sort -u
```

Every href value should resolve to an existing file at the project root: `index.html`, `locations.html`, `memberships.html`, `coaching.html`, `events.html`, `stringing.html`, `faq.html`. No typos, no broken paths.

- [ ] **Step 2: Verify FAQ link is on every page**

```bash
grep -l 'href="faq.html"' *.html
```

Should list all 7 HTML files (including `faq.html` itself, which links to itself in nav).

- [ ] **Step 3: Verify logo image is on every page**

```bash
grep -l 'logo.png' *.html
```

Should list all 7 HTML files.

- [ ] **Step 4: Verify the logo file actually exists**

```bash
ls -la assets/logo.png
```

Should exist (it does — confirmed before this task).

- [ ] **Step 5: Spot-check no inline `<style>` or `<script>` content blocks were introduced**

```bash
grep -l '<script>' *.html
grep -l '<style>' *.html
```

Both should return zero matches (only `<script src>` and `<link rel="stylesheet">` exist). The single inline `onclick` on the closing CTA's "Copy WeChat ID" button is the one deliberate exception.

- [ ] **Step 6: Commit final marker (or skip if nothing to fix)**

```bash
git add -u
git commit --allow-empty -m "polish(faq): final QA — link sweep, logo + FAQ link verification"
```

---

## Self-review notes

The plan covers:

| Spec section | Plan task |
|--------------|-----------|
| Add `faq.html` page with 5 category sections + contact + closing CTA | Task 4 |
| New FAQS keys: general, booking, hours, courts | Task 2 |
| `CONTACT_INFO` constant with WhatsApp + WeChat | Task 2 |
| `renderFaqPage()` function with category renders + WeChat copy | Task 3 |
| Page-init guard for `renderFaqPage` | Task 3 |
| Add FAQ link to nav, mobile menu, footer Play column on all 6 existing pages | Task 1 |
| `<body data-page="faq">` for active-nav highlight | Task 4 |
| WhatsApp link → `https://wa.me/15513287867` | Tasks 2 + 4 |
| WeChat ID `kotofit1` shown as copyable text | Tasks 3 + 4 |
| Closing CTA "Still have questions?" with WhatsApp + WeChat buttons | Task 4 |

User-added requirement (after spec approval):
| Requirement | Plan task |
|-------------|-----------|
| Add `assets/logo.png` next to KOTOFIT wordmark in nav + footer brand on every page | Task 1 |

Function and identifier names used consistently:
- `renderFaqPage` (added Task 3, called Task 3, target IDs `faq-general` / `faq-booking` / `faq-hours` / `faq-courts` defined Task 4)
- `renderFaq(elementId, items)` (existing helper, reused — no changes)
- `CONTACT_INFO` (defined Task 2, consumed Task 3)
- `FAQS.general` / `FAQS.booking` / `FAQS.hours` / `FAQS.courts` (defined Task 2, consumed Task 3)
- `faq-wechat-copy` (button id, defined Task 4, listener attached Task 3)
- `faq-wechat-hint` (label id, defined Task 4, content updated Task 3)

No placeholders. All steps include actual code or verifiable commands.
