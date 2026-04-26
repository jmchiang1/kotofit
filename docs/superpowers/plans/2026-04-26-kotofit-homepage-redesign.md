# Kotofit Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file, high-fidelity, clickable homepage prototype for Kotofit (badminton/pickleball facility chain) that demonstrates a modern Athletic Premium dark design direction with simulated client-side interactions.

**Architecture:** One HTML file at the project root (`index.html`). All CSS in a single `<style>` block, all JS in a single `<script>` block, all data as plain JS objects. No build, no server, no dependencies (except Inter from Google Fonts and Unsplash images via direct URL). Built top-to-bottom by section so each commit is visually verifiable.

**Tech Stack:** HTML5, vanilla CSS (Custom Properties, Grid, Flexbox), vanilla JS (ES2020), Inter from Google Fonts, real Unsplash photography.

**Spec:** [docs/superpowers/specs/2026-04-26-kotofit-homepage-redesign-design.md](../specs/2026-04-26-kotofit-homepage-redesign-design.md)

---

## File Structure

A deliberately minimal layout — this is a one-file prototype, not a project skeleton.

- **Create:** `index.html` — the entire deliverable. Contains:
  - `<head>`: meta, Google Fonts link, single inline `<style>` block with all CSS
  - `<body>`: 10 semantic `<section>` elements, one per page section
  - End of `<body>`: single inline `<script>` block with all data + interactions

No external CSS/JS files. No build artifacts. The whole thing must work by double-clicking the file.

## Verification Approach

For a static visual prototype there are no automated tests; verification per task is **open `index.html` in a browser, scroll to the affected area, and confirm the listed criteria.** Where interactions are added, the criteria include click-and-observe steps. The implementer should keep `index.html` open in a browser tab and reload after each task.

## Implementation Order

1. Foundation (HTML scaffold, CSS variables, base type)
2. Sections top-to-bottom (nav → hero → ... → footer) — each with its own commit
3. Per-section interactions added in the same task that builds the section
4. Final polish: responsive pass, motion, image swap, smoke test

---

## Task 1: Scaffold and base styles

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create the HTML scaffold**

Create `index.html` with this exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kotofit — America's Home for Badminton & Indoor Sports</title>
  <meta name="description" content="Five locations across NJ and NY. Reserve a court for badminton, pickleball, or ping pong in seconds." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <style>
    /* === DESIGN TOKENS === */
    :root {
      --ink: #0a0a0a;
      --surface: #18181b;
      --elevated: #27272a;
      --line: #3f3f46;
      --bone: #ffffff;
      --mute: #a1a1aa;
      --cobalt: #2563eb;
      --cobalt-hover: #1d4ed8;

      --max-w: 1280px;
      --pad-x: clamp(20px, 4vw, 48px);
      --section-py: clamp(56px, 9vw, 96px);

      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* === RESET === */
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      background: var(--ink);
      color: var(--bone);
      font-size: 15px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    img { display: block; max-width: 100%; height: auto; }
    button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
    a { color: inherit; text-decoration: none; }
    ul { list-style: none; padding: 0; margin: 0; }

    /* === LAYOUT === */
    .container { max-width: var(--max-w); margin: 0 auto; padding-left: var(--pad-x); padding-right: var(--pad-x); }

    /* === TYPOGRAPHY === */
    .display-xl { font-size: clamp(48px, 9vw, 96px); line-height: 0.92; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; margin: 0; }
    .display-l  { font-size: clamp(32px, 5vw, 48px); line-height: 1; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
    .display-m  { font-size: clamp(20px, 2.5vw, 24px); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
    .body { font-size: 15px; line-height: 1.6; color: var(--mute); }
    .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cobalt); }
    .label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mute); }

    /* === BUTTONS === */
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 22px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; transition: all 150ms var(--ease-out); cursor: pointer; }
    .btn-primary { background: var(--cobalt); color: var(--bone); }
    .btn-primary:hover { background: var(--cobalt-hover); }
    .btn-ghost { background: transparent; color: var(--bone); border: 1px solid var(--bone); }
    .btn-ghost:hover { background: var(--bone); color: var(--ink); }

    /* === SECTION === */
    section { padding: var(--section-py) 0; border-top: 1px solid var(--elevated); }
    .section-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; margin-bottom: 40px; }
    .section-head .desc { color: var(--mute); font-size: 14px; max-width: 360px; line-height: 1.6; }
  </style>
</head>
<body>
  <main></main>
  <script>
    // === MOCK DATA === (added in later tasks)

    // === INTERACTIONS === (added in later tasks)
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `index.html` by double-clicking it (or `start index.html` on Windows / `open index.html` on macOS).
Expected: blank black page, no console errors. The Inter font should be loading (visible only when text appears).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(homepage): scaffold index.html with design tokens and base styles"
```

---

## Task 2: Sticky nav

**Files:**
- Modify: `index.html` — add nav HTML inside `<body>` before `<main>`, add nav CSS in `<style>`

- [ ] **Step 1: Add nav CSS**

Append inside the `<style>` block (after the section CSS):

```css
    /* === NAV === */
    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10, 10, 10, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--elevated); }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
    .nav-logo { font-size: 18px; font-weight: 900; letter-spacing: -0.03em; }
    .nav-links { display: flex; gap: 28px; }
    .nav-links a { font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--mute); transition: color 150ms; }
    .nav-links a:hover { color: var(--bone); }
    .nav-cta { padding: 10px 16px; background: var(--cobalt); color: var(--bone); font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; transition: background 150ms; }
    .nav-cta:hover { background: var(--cobalt-hover); }
    .nav-burger { display: none; width: 40px; height: 40px; align-items: center; justify-content: center; }
    .nav-burger span { width: 22px; height: 2px; background: var(--bone); position: relative; }
    .nav-burger span::before, .nav-burger span::after { content: ''; position: absolute; left: 0; right: 0; height: 2px; background: var(--bone); }
    .nav-burger span::before { top: -7px; }
    .nav-burger span::after { top: 7px; }
    @media (max-width: 768px) {
      .nav-links, .nav-cta { display: none; }
      .nav-burger { display: flex; }
    }
    body { padding-top: 64px; }
```

- [ ] **Step 2: Add nav HTML**

Inside `<body>`, immediately before `<main>`, insert:

```html
  <nav class="nav">
    <div class="container nav-inner">
      <a href="#top" class="nav-logo">KOTOFIT</a>
      <ul class="nav-links">
        <li><a href="#locations">Locations</a></li>
        <li><a href="#memberships">Memberships</a></li>
        <li><a href="#coaching">Coaching</a></li>
        <li><a href="#events">Events</a></li>
        <li><a href="#stringing">Stringing</a></li>
      </ul>
      <a href="#booking" class="nav-cta">Reserve Court →</a>
      <button class="nav-burger" aria-label="Open menu"><span></span></button>
    </div>
  </nav>
```

- [ ] **Step 3: Verify**

Reload the page. Expected: a sticky black-translucent bar pinned to the top, with KOTOFIT logo on the left, five nav links centered, and a Cobalt "Reserve Court →" pill on the right. Resize the window below 768px — nav links should hide and the hamburger icon should appear.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add sticky nav with hamburger fallback"
```

---

## Task 3: Hero section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add hero CSS**

Append inside `<style>`:

```css
    /* === HERO === */
    .hero { position: relative; min-height: calc(100vh - 64px); padding: 0; border-top: 0; overflow: hidden; display: flex; flex-direction: column; }
    .hero-bg { position: absolute; inset: 0; background-image: linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.85) 100%), url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=2000&q=80&auto=format&fit=crop'); background-size: cover; background-position: center; z-index: 0; transform: scale(1); transition: transform 8s ease-out; }
    .hero.loaded .hero-bg { transform: scale(1.06); }
    .hero-inner { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding-top: clamp(64px, 12vw, 128px); padding-bottom: clamp(40px, 6vw, 64px); }
    .hero-top .eyebrow { display: inline-block; }
    .hero-top h1 { margin-top: 18px; max-width: 920px; }
    .hero-top h1 em { font-style: normal; color: var(--cobalt); }
    .hero-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .where-chip { display: inline-flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.08); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); padding: 12px 18px; border: 1px solid rgba(255,255,255,0.18); cursor: pointer; transition: all 150ms; }
    .where-chip:hover { background: rgba(255,255,255,0.14); }
    .where-chip .lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--mute); font-weight: 700; }
    .where-chip .city { font-size: 14px; font-weight: 700; }
    .where-chip .caret { color: var(--mute); }
    .hero-cta { font-size: 13px; padding: 16px 26px; }
```

- [ ] **Step 2: Add hero HTML**

Inside `<main>`, add:

```html
    <section class="hero" id="top">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-inner">
        <div class="hero-top">
          <span class="eyebrow">▸ America's home for indoor sports</span>
          <h1 class="display-xl">Built for<br/>game <em>day.</em></h1>
        </div>
        <div class="hero-bottom">
          <button class="where-chip" data-action="open-locations">
            <div>
              <div class="lbl">Playing in</div>
              <div class="city">Jersey City <span class="caret">▾</span></div>
            </div>
          </button>
          <a href="#booking" class="btn btn-primary hero-cta">Reserve a court →</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Add Ken-Burns load class**

Inside the `<script>` block (replace the placeholder comments with this initial JS):

```javascript
    // === HERO ===
    requestAnimationFrame(() => {
      document.querySelector('.hero')?.classList.add('loaded');
    });
```

- [ ] **Step 4: Verify**

Reload the page. Expected:
- Full-bleed badminton/pickleball action photo with dark gradient overlay covers the viewport below the nav
- Cobalt eyebrow "▸ AMERICA'S HOME FOR INDOOR SPORTS"
- Massive uppercase headline "BUILT FOR / GAME DAY." with "DAY." in Cobalt
- Bottom-left: location chip ("Playing in Jersey City ▾") with frosted background
- Bottom-right: large Cobalt "Reserve a court →" button
- Slow Ken-Burns zoom on the background image after page load

If the Unsplash hero image fails to load, the gradient still renders and the page is usable. Real image swap is verified in Task 15.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add hero section with Ken-Burns photo and primary CTA"
```

---

## Task 4: Locations strip + location modal

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add locations CSS**

Append inside `<style>`:

```css
    /* === LOCATIONS === */
    .loc-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .loc-card { background: var(--surface); border: 1px solid var(--elevated); display: flex; flex-direction: column; cursor: pointer; transition: transform 200ms var(--ease-out), border-color 200ms; text-align: left; }
    .loc-card:hover { transform: translateY(-4px); border-color: var(--cobalt); }
    .loc-img { aspect-ratio: 4/3; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding: 12px; }
    .loc-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,10,10,0.7) 100%); pointer-events: none; }
    .loc-img .badge { position: relative; z-index: 1; background: var(--cobalt); padding: 4px 8px; font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bone); }
    .loc-img .badge.soon { background: var(--bone); color: var(--ink); }
    .loc-body { padding: 16px; }
    .loc-body .city { font-size: 9px; color: var(--mute); text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; }
    .loc-body .name { font-size: 18px; font-weight: 800; margin: 4px 0; letter-spacing: -0.02em; color: var(--bone); }
    .loc-body .meta { font-size: 11px; color: var(--mute); }
    @media (max-width: 1024px) { .loc-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 540px)  { .loc-grid { grid-template-columns: 1fr; } }

    /* === MODAL (shared) === */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); z-index: 200; display: none; align-items: center; justify-content: center; padding: 24px; }
    .modal-backdrop.open { display: flex; }
    .modal { background: var(--surface); border: 1px solid var(--elevated); max-width: 560px; width: 100%; max-height: 90vh; overflow: auto; padding: 32px; position: relative; }
    .modal-close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--mute); font-size: 20px; transition: color 150ms; }
    .modal-close:hover { color: var(--bone); }
    .modal h3 { margin: 0 0 8px; }
    .modal .modal-meta { color: var(--mute); font-size: 13px; margin-bottom: 24px; }
    .modal .modal-img { aspect-ratio: 16/9; background-size: cover; background-position: center; margin: -32px -32px 24px; }
```

- [ ] **Step 2: Add locations section HTML**

Inside `<main>`, append after the hero section:

```html
    <section id="locations">
      <div class="container">
        <header class="section-head">
          <div>
            <span class="eyebrow">▸ Five open. Three coming.</span>
            <h2 class="display-l" style="margin-top:10px">Find your court.</h2>
          </div>
          <p class="desc">Five locations across NJ and NY today. Brooklyn and Queens land this season.</p>
        </header>
        <div class="loc-grid" id="loc-grid"></div>
      </div>
    </section>
```

- [ ] **Step 3: Add locations data and rendering JS**

In the `<script>` block, before the `// === HERO ===` line, add:

```javascript
    // === DATA ===
    const LOCATIONS = [
      { id: 'jc-3rd',     city: 'Jersey City · NJ',       name: '3rd Street',    courts: 8,  hours: 'Open until 11PM', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80&auto=format&fit=crop', status: 'open' },
      { id: 'jc-bruns',   city: 'Jersey City · NJ',       name: 'Brunswick',     courts: 10, hours: 'Open until 11PM', img: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=800&q=80&auto=format&fit=crop', status: 'open' },
      { id: 'jc-summit',  city: 'Jersey City · NJ',       name: 'Summit Ave',    courts: 6,  hours: 'Open until 10PM', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80&auto=format&fit=crop', status: 'open' },
      { id: 'lic-10th',   city: 'Long Island City · NY',  name: '10th Street',   courts: 12, hours: 'Open until 11PM', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80&auto=format&fit=crop', status: 'open' },
      { id: 'bk-soon',    city: 'Brooklyn · NY',          name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: 'https://images.unsplash.com/photo-1542293787938-c9e299b88052?w=800&q=80&auto=format&fit=crop', status: 'soon' },
    ];
```

After the `// === HERO ===` block, add:

```javascript
    // === LOCATIONS ===
    function renderLocations() {
      const grid = document.getElementById('loc-grid');
      grid.innerHTML = LOCATIONS.map(loc => `
        <button class="loc-card" data-loc-id="${loc.id}">
          <div class="loc-img" style="background-image:url('${loc.img}')">
            <span class="badge ${loc.status === 'soon' ? 'soon' : ''}">${loc.status === 'soon' ? 'Soon' : 'Open'}</span>
          </div>
          <div class="loc-body">
            <div class="city">${loc.city}</div>
            <div class="name">${loc.name}</div>
            <div class="meta">${loc.courts ? loc.courts + ' courts · ' : ''}${loc.hours}</div>
          </div>
        </button>
      `).join('');
      grid.querySelectorAll('.loc-card').forEach(card => {
        card.addEventListener('click', () => openLocationModal(card.dataset.locId));
      });
    }
    renderLocations();
```

- [ ] **Step 4: Add modal infrastructure JS**

Append inside the `<script>` block (after the locations rendering):

```javascript
    // === MODAL ===
    function openModal(html) {
      let backdrop = document.getElementById('modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'modal-backdrop';
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
      }
      backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Close">×</button>
        ${html}
      </div>`;
      backdrop.querySelector('.modal-close').addEventListener('click', closeModal);
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      const backdrop = document.getElementById('modal-backdrop');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function openLocationModal(id) {
      const loc = LOCATIONS.find(l => l.id === id);
      if (!loc) return;
      const isSoon = loc.status === 'soon';
      openModal(`
        <div class="modal-img" style="background-image:url('${loc.img}')"></div>
        <span class="eyebrow">${loc.city}</span>
        <h3 class="display-m" style="margin-top:6px">${loc.name}</h3>
        <p class="modal-meta">${isSoon ? 'Coming this season — get notified when we open.' : `${loc.courts} courts · ${loc.hours}`}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="closeModal();document.getElementById('booking').scrollIntoView({behavior:'smooth'})">${isSoon ? 'Notify me' : 'Reserve here →'}</button>
          <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        </div>
      `);
    }
```

- [ ] **Step 5: Verify**

Reload the page. Scroll past the hero. Expected:
- Section eyebrow "▸ FIVE OPEN. THREE COMING." in Cobalt
- Headline "Find your court."
- Right-aligned descriptive paragraph
- Five horizontal cards with images, "Open" Cobalt badges (4 of them) and "Soon" white badge (1)
- Cards lift on hover and the border turns Cobalt
- Click any card → modal opens with location detail, image, "Reserve here →" CTA
- ESC key or backdrop click closes the modal
- At < 1024px width cards collapse to 2 columns; below 540px to 1 column

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add locations strip with detail modal"
```

---

## Task 5: Booking widget UI

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add booking CSS**

Append inside `<style>`:

```css
    /* === BOOKING === */
    .booking { background: var(--surface); padding: 32px; border: 1px solid var(--elevated); }
    .booking-row { display: grid; grid-template-columns: repeat(4, 1fr) auto; gap: 12px; align-items: end; }
    .b-field label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--mute); font-weight: 700; display: block; margin-bottom: 8px; }
    .b-field .input { background: var(--ink); border: 1px solid var(--elevated); padding: 14px; font-size: 14px; color: var(--bone); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: border-color 150ms; width: 100%; text-align: left; }
    .b-field .input:hover { border-color: var(--cobalt); }
    .b-field .input .arrow { color: var(--mute); }
    .booking-cta { padding: 14px 24px; background: var(--cobalt); color: var(--bone); font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; height: 50px; transition: background 150ms; }
    .booking-cta:hover { background: var(--cobalt-hover); }
    @media (max-width: 900px) { .booking-row { grid-template-columns: 1fr 1fr; } .booking-cta { grid-column: 1 / -1; } }
    @media (max-width: 540px) { .booking-row { grid-template-columns: 1fr; } }

    /* === DROPDOWN === */
    .b-field { position: relative; }
    .b-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: var(--surface); border: 1px solid var(--elevated); margin-top: 4px; z-index: 50; max-height: 240px; overflow: auto; display: none; }
    .b-dropdown.open { display: block; }
    .b-dropdown button { width: 100%; padding: 12px 14px; text-align: left; font-size: 13px; color: var(--bone); transition: background 150ms; }
    .b-dropdown button:hover { background: var(--elevated); }
```

- [ ] **Step 2: Add booking HTML**

Inside `<main>`, append:

```html
    <section id="booking">
      <div class="container">
        <header class="section-head">
          <div>
            <span class="eyebrow">▸ Book in 30 seconds</span>
            <h2 class="display-l" style="margin-top:10px">Reserve a court.</h2>
          </div>
        </header>
        <div class="booking">
          <div class="booking-row">
            <div class="b-field">
              <label>Sport</label>
              <button class="input" data-bf="sport"><span data-val>Badminton</span><span class="arrow">▾</span></button>
            </div>
            <div class="b-field">
              <label>Location</label>
              <button class="input" data-bf="location"><span data-val>Brunswick · JC</span><span class="arrow">▾</span></button>
            </div>
            <div class="b-field">
              <label>Date</label>
              <button class="input" data-bf="date"><span data-val>Sat, May 2</span><span class="arrow">▾</span></button>
            </div>
            <div class="b-field">
              <label>Time</label>
              <button class="input" data-bf="time"><span data-val>7:00 PM</span><span class="arrow">▾</span></button>
            </div>
            <button class="booking-cta" id="check-courts">Check courts →</button>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Add booking dropdown logic**

Append inside `<script>`:

```javascript
    // === BOOKING ===
    const BOOKING_OPTIONS = {
      sport:    ['Badminton', 'Pickleball', 'Ping Pong'],
      location: ['3rd Street · JC', 'Brunswick · JC', 'Summit Ave · JC', '10th Street · LIC'],
      date:     ['Today', 'Tomorrow', 'Sat, May 2', 'Sun, May 3', 'Mon, May 4'],
      time:     ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'],
    };
    document.querySelectorAll('[data-bf]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.b-dropdown.open').forEach(d => d.classList.remove('open'));
        const field = btn.dataset.bf;
        let dd = btn.parentElement.querySelector('.b-dropdown');
        if (!dd) {
          dd = document.createElement('div');
          dd.className = 'b-dropdown';
          dd.innerHTML = BOOKING_OPTIONS[field].map(opt => `<button data-opt="${opt}">${opt}</button>`).join('');
          btn.parentElement.appendChild(dd);
          dd.querySelectorAll('button').forEach(opt => {
            opt.addEventListener('click', e => {
              btn.querySelector('[data-val]').textContent = opt.dataset.opt;
              dd.classList.remove('open');
              e.stopPropagation();
            });
          });
        }
        dd.classList.toggle('open');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.b-dropdown.open').forEach(d => d.classList.remove('open'));
    });
```

- [ ] **Step 4: Verify**

Reload. Scroll to "Reserve a court." Expected:
- Section appears with eyebrow + headline
- Booking widget on Surface background with four select-style buttons (Sport, Location, Date, Time) + a Cobalt "Check courts →" button
- Click any field → dropdown appears below it with options
- Click an option → label updates, dropdown closes
- Click outside any dropdown → closes
- At < 900px width fields stack 2-up; below 540px stack 1-up

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add booking widget UI with dropdown selectors"
```

---

## Task 6: Booking widget — court availability + confirmation modal

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add booking modal CSS**

Append inside `<style>`:

```css
    /* === COURT GRID (in modal) === */
    .court-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 16px 0 24px; }
    .court-slot { padding: 14px 8px; text-align: center; font-size: 12px; font-weight: 700; border: 1px solid var(--elevated); cursor: pointer; transition: all 150ms; }
    .court-slot.avail { border-color: var(--cobalt); color: var(--cobalt); }
    .court-slot.avail:hover { background: var(--cobalt); color: var(--bone); }
    .court-slot.booked { color: var(--mute); cursor: not-allowed; opacity: 0.5; }
    .court-slot .slot-time { display: block; font-size: 14px; }
    .court-slot .slot-court { display: block; font-size: 9px; font-weight: 600; opacity: 0.7; margin-top: 2px; letter-spacing: 0.1em; text-transform: uppercase; }

    .confirm-num { font-size: 28px; font-weight: 900; letter-spacing: -0.02em; color: var(--cobalt); margin: 8px 0 4px; }
```

- [ ] **Step 2: Add booking modal logic**

Append inside `<script>` (after the booking dropdown logic):

```javascript
    document.getElementById('check-courts').addEventListener('click', () => {
      const sport    = document.querySelector('[data-bf="sport"] [data-val]').textContent;
      const location = document.querySelector('[data-bf="location"] [data-val]').textContent;
      const date     = document.querySelector('[data-bf="date"] [data-val]').textContent;
      const time     = document.querySelector('[data-bf="time"] [data-val]').textContent;
      openCourtModal({ sport, location, date, time });
    });

    function openCourtModal({ sport, location, date, time }) {
      const slots = [
        { time, court: 'Court 1', avail: true },
        { time, court: 'Court 2', avail: false },
        { time, court: 'Court 3', avail: true },
        { time, court: 'Court 4', avail: true },
        { time, court: 'Court 5', avail: false },
        { time, court: 'Court 6', avail: true },
        { time, court: 'Court 7', avail: false },
        { time, court: 'Court 8', avail: true },
        { time, court: 'Court 9', avail: true },
      ];
      openModal(`
        <span class="eyebrow">▸ Available courts</span>
        <h3 class="display-m" style="margin-top:6px">${sport} · ${location}</h3>
        <p class="modal-meta">${date} at ${time}</p>
        <div class="court-grid">
          ${slots.map((s, i) => `
            <button class="court-slot ${s.avail ? 'avail' : 'booked'}" ${s.avail ? `data-court="${s.court}"` : 'disabled'}>
              <span class="slot-time">${s.time}</span>
              <span class="slot-court">${s.court}</span>
            </button>
          `).join('')}
        </div>
        <p class="body" style="font-size:12px">${slots.filter(s=>s.avail).length} of ${slots.length} courts available.</p>
      `);
      document.querySelectorAll('.court-slot.avail').forEach(slot => {
        slot.addEventListener('click', () => {
          openConfirmModal({ sport, location, date, time, court: slot.dataset.court });
        });
      });
    }

    function openConfirmModal({ sport, location, date, time, court }) {
      const num = 'KF-' + Math.floor(1000 + Math.random() * 9000);
      openModal(`
        <span class="eyebrow">▸ You're booked</span>
        <div class="confirm-num">${num}</div>
        <h3 class="display-m">${sport} · ${court}</h3>
        <p class="modal-meta">${location} · ${date} at ${time}</p>
        <p class="body" style="font-size:13px;margin-bottom:24px">Confirmation sent to your email. See you on the court.</p>
        <button class="btn btn-primary" onclick="closeModal()">Done</button>
      `);
    }
```

- [ ] **Step 3: Verify**

Reload. Click "Check courts →". Expected:
- Modal opens showing "Available courts" with chosen sport · location · date · time as the heading
- 3×3 grid of court slots; some Cobalt-bordered (available), some greyed out (booked)
- Click any available slot → modal updates to confirmation: large Cobalt confirmation number (KF-NNNN), sport · court, location · date · time, "Done" button
- ESC closes both modals

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add simulated court-availability and confirmation modals"
```

---

## Task 7: Play tiles (sports)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add play tiles CSS**

Append inside `<style>`:

```css
    /* === PLAY TILES === */
    .play-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .play-tile { aspect-ratio: 4/5; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; cursor: pointer; transition: transform 250ms var(--ease-out); text-align: left; color: var(--bone); }
    .play-tile:hover { transform: translateY(-4px); }
    .play-tile-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 600ms var(--ease-out); z-index: 0; }
    .play-tile:hover .play-tile-bg { transform: scale(1.05); }
    .play-tile::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%); z-index: 1; }
    .play-tile > * { position: relative; z-index: 2; }
    .play-tile .num { font-size: 11px; color: var(--cobalt); font-weight: 700; letter-spacing: 0.15em; }
    .play-tile h3 { font-size: clamp(28px, 4vw, 40px); font-weight: 900; letter-spacing: -0.03em; margin: 0 0 8px; text-transform: uppercase; }
    .play-tile .read { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mute); }
    @media (max-width: 768px) { .play-grid { grid-template-columns: 1fr; } .play-tile { aspect-ratio: 16/9; } }
```

- [ ] **Step 2: Add play HTML**

Inside `<main>`, append:

```html
    <section id="play">
      <div class="container">
        <header class="section-head">
          <div>
            <span class="eyebrow">▸ Three games, one house</span>
            <h2 class="display-l" style="margin-top:10px">Pick your sport.</h2>
          </div>
        </header>
        <div class="play-grid" id="play-grid"></div>
      </div>
    </section>
```

- [ ] **Step 3: Add sports data and rendering**

In `<script>`, add to the data block (after `LOCATIONS`):

```javascript
    const SPORTS = [
      { id: 'badminton',  num: '01', name: 'Badminton',  read: 'Open play, leagues, clinics →', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80&auto=format&fit=crop', desc: 'The fastest racquet sport in the world. Open play sessions, member leagues, and clinics for every level — from first racquet to tournament prep.' },
      { id: 'pickleball', num: '02', name: 'Pickleball', read: 'All levels, mixers, tournaments →', img: 'https://images.unsplash.com/photo-1687204209659-3bded6aecd79?w=1200&q=80&auto=format&fit=crop', desc: 'America\'s fastest-growing sport. Drop-in mixers every week, ladder leagues, and weekend tournaments. Easy to learn, hard to put down.' },
      { id: 'pingpong',   num: '03', name: 'Ping Pong',  read: 'Drop in, tables ready →',          img: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=1200&q=80&auto=format&fit=crop', desc: 'Tables ready at every location. No reservation needed — drop in, grab a paddle, and play.' },
    ];
```

After the booking modal logic, add:

```javascript
    // === PLAY TILES ===
    function renderPlay() {
      const grid = document.getElementById('play-grid');
      grid.innerHTML = SPORTS.map(s => `
        <button class="play-tile" data-sport="${s.id}">
          <div class="play-tile-bg" style="background-image:url('${s.img}')"></div>
          <div class="num">— ${s.num}</div>
          <div>
            <h3>${s.name}</h3>
            <div class="read">${s.read}</div>
          </div>
        </button>
      `).join('');
      grid.querySelectorAll('.play-tile').forEach(tile => {
        tile.addEventListener('click', () => openSportModal(tile.dataset.sport));
      });
    }
    renderPlay();

    function openSportModal(id) {
      const s = SPORTS.find(x => x.id === id);
      if (!s) return;
      openModal(`
        <div class="modal-img" style="background-image:url('${s.img}')"></div>
        <span class="eyebrow">▸ ${s.name}</span>
        <h3 class="display-m" style="margin-top:6px">${s.name} at Kotofit</h3>
        <p class="body" style="margin-bottom:24px">${s.desc}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="closeModal();document.getElementById('booking').scrollIntoView({behavior:'smooth'})">Reserve a court →</button>
          <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        </div>
      `);
    }
```

- [ ] **Step 4: Verify**

Reload. Scroll past booking. Expected:
- "Pick your sport." section
- Three large 4:5 tiles side-by-side: Badminton, Pickleball, Ping Pong
- Each tile has gradient-tinted sport photo, "— 01/02/03" Cobalt number, sport name in massive type, "Open play..." link
- Hover tile: lifts + image gently zooms
- Click tile: modal with sport image, description, "Reserve a court →" CTA (which scrolls to booking)
- Below 768px tiles stack to single column with 16:9 aspect

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add sport tiles with sport-overview modal"
```

---

## Task 8: Memberships + multi-step join modal

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add memberships CSS**

Append inside `<style>`:

```css
    /* === MEMBERSHIPS === */
    .mem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .mem-card { background: var(--surface); border: 1px solid var(--elevated); padding: 32px; display: flex; flex-direction: column; }
    .mem-card.featured { background: var(--cobalt); border-color: var(--cobalt); }
    .mem-card .tier { font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mute); }
    .mem-card.featured .tier { color: var(--bone); opacity: 0.9; }
    .mem-card .price { font-size: 56px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; margin: 12px 0 4px; }
    .mem-card .price small { font-size: 14px; font-weight: 600; color: var(--mute); }
    .mem-card.featured .price small { color: var(--bone); opacity: 0.85; }
    .mem-card ul { margin: 24px 0; font-size: 13px; line-height: 1.9; color: var(--mute); }
    .mem-card.featured ul { color: var(--bone); }
    .mem-card li::before { content: '— '; color: var(--cobalt); margin-right: 4px; }
    .mem-card.featured li::before { color: var(--bone); }
    .mem-cta { margin-top: auto; padding: 14px 18px; background: transparent; border: 1px solid var(--bone); width: 100%; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--bone); cursor: pointer; transition: all 150ms; }
    .mem-cta:hover { background: var(--bone); color: var(--ink); }
    .mem-card.featured .mem-cta { background: var(--bone); color: var(--ink); border-color: var(--bone); }
    .mem-card.featured .mem-cta:hover { background: rgba(255,255,255,0.85); }
    @media (max-width: 900px) { .mem-grid { grid-template-columns: 1fr; } }

    /* === JOIN STEPS === */
    .step-row { display: flex; gap: 6px; margin-bottom: 20px; }
    .step-dot { flex: 1; height: 3px; background: var(--elevated); }
    .step-dot.active { background: var(--cobalt); }
    .form-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    .form-row label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--mute); font-weight: 700; }
    .form-row input { background: var(--ink); border: 1px solid var(--elevated); padding: 12px 14px; color: var(--bone); font-size: 14px; font-family: inherit; }
    .form-row input:focus { outline: none; border-color: var(--cobalt); }
    .step-pick { display: grid; grid-template-columns: 1fr; gap: 8px; margin: 12px 0 24px; }
    .step-pick button { padding: 14px; background: var(--ink); border: 1px solid var(--elevated); color: var(--bone); text-align: left; cursor: pointer; transition: all 150ms; font-family: inherit; }
    .step-pick button:hover, .step-pick button.selected { border-color: var(--cobalt); background: rgba(37,99,235,0.08); }
```

- [ ] **Step 2: Add memberships HTML**

Inside `<main>`, append:

```html
    <section id="memberships">
      <div class="container">
        <header class="section-head">
          <div>
            <span class="eyebrow">▸ Member perks</span>
            <h2 class="display-l" style="margin-top:10px">Play more. Pay less.</h2>
          </div>
          <p class="desc">Early booking windows, free events, member-only clinics, and racquet stringing discounts.</p>
        </header>
        <div class="mem-grid" id="mem-grid"></div>
      </div>
    </section>
```

- [ ] **Step 3: Add memberships data and rendering**

In `<script>`, add to the data block:

```javascript
    const TIERS = [
      { id: 'dropin',     name: 'Drop-in',                price: 0,   featured: false, perks: ['Pay per court', 'Standard booking window', 'Public events'], cta: 'Book one-off' },
      { id: 'go-koto',    name: 'Go Koto · Most popular', price: 49,  featured: true,  perks: ['72-hour early booking', 'Free monthly events', '10% off clinics + stringing', 'Guest passes'], cta: 'Become a member' },
      { id: 'all-access', name: 'All-Access',             price: 129, featured: false, perks: ['14-day early booking', 'All clinics included', 'Free stringing (2/mo)', 'Unlimited guest passes'], cta: 'Go All-Access' },
    ];
```

After play tiles logic:

```javascript
    // === MEMBERSHIPS ===
    function renderMemberships() {
      const grid = document.getElementById('mem-grid');
      grid.innerHTML = TIERS.map(t => `
        <div class="mem-card ${t.featured ? 'featured' : ''}">
          <div class="tier">${t.name}</div>
          <div class="price">$${t.price}<small>/mo</small></div>
          <ul>${t.perks.map(p => `<li>${p}</li>`).join('')}</ul>
          <button class="mem-cta" data-tier="${t.id}">${t.cta}</button>
        </div>
      `).join('');
      grid.querySelectorAll('[data-tier]').forEach(btn => {
        btn.addEventListener('click', () => openJoinModal(btn.dataset.tier));
      });
    }
    renderMemberships();

    function openJoinModal(tierId) {
      const tier = TIERS.find(t => t.id === tierId);
      if (!tier) return;
      let step = 1;
      let chosenLoc = null;

      const render = () => {
        if (step === 1) {
          openModal(`
            <div class="step-row"><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div></div>
            <span class="eyebrow">▸ Step 1 of 3 · Choose your home court</span>
            <h3 class="display-m" style="margin-top:6px">Where will you play most?</h3>
            <div class="step-pick">${LOCATIONS.filter(l => l.status === 'open').map(l => `<button data-loc="${l.id}">${l.name} · ${l.city}</button>`).join('')}</div>
          `);
          document.querySelectorAll('.step-pick [data-loc]').forEach(b => {
            b.addEventListener('click', () => {
              chosenLoc = b.dataset.loc;
              step = 2; render();
            });
          });
        } else if (step === 2) {
          openModal(`
            <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div></div>
            <span class="eyebrow">▸ Step 2 of 3 · Your details</span>
            <h3 class="display-m" style="margin-top:6px">Create your account</h3>
            <p class="modal-meta">${tier.name} · $${tier.price}/mo</p>
            <div class="form-row"><label>Full name</label><input type="text" id="join-name" placeholder="Alex Player" /></div>
            <div class="form-row"><label>Email</label><input type="email" id="join-email" placeholder="alex@example.com" /></div>
            <div class="form-row"><label>Password</label><input type="password" id="join-pw" placeholder="••••••••" /></div>
            <button class="btn btn-primary" id="join-next" style="width:100%;justify-content:center;margin-top:8px">Continue →</button>
          `);
          document.getElementById('join-next').addEventListener('click', () => { step = 3; render(); });
        } else {
          const num = 'KF-MEM-' + Math.floor(1000 + Math.random() * 9000);
          openModal(`
            <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div></div>
            <span class="eyebrow">▸ You're in</span>
            <div class="confirm-num">${num}</div>
            <h3 class="display-m">Welcome to ${tier.name.split(' · ')[0]}</h3>
            <p class="modal-meta">Confirmation sent. Your member booking window is open.</p>
            <p class="body" style="font-size:13px;margin-bottom:24px">Open the app or come by your home court to get your first session in.</p>
            <button class="btn btn-primary" onclick="closeModal()">Done</button>
          `);
        }
      };
      render();
    }
```

- [ ] **Step 4: Verify**

Reload. Scroll to "Play more. Pay less." Expected:
- Three pricing cards: Drop-in $0, Go Koto $49 (Cobalt featured), All-Access $129
- Each card: tier name, big price, em-dash bullet list, full-width CTA at bottom
- Featured card visually pops in Cobalt
- Click any CTA → 3-step modal: pick home location → enter name/email/password → confirmation with KF-MEM-NNNN number
- ESC closes modal at any step
- Below 900px cards stack 1-up

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add membership tiers with 3-step join flow"
```

---

## Task 9: Coaching section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add coaching CSS**

Append inside `<style>`:

```css
    /* === COACHING === */
    .coach-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 12px; }
    .coach-feature { aspect-ratio: 5/6; padding: 28px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; color: var(--bone); }
    .coach-feature .coach-bg, .coach-mini .coach-bg { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 0; }
    .coach-feature::after, .coach-mini::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(10,10,10,0.85) 100%); z-index: 1; }
    .coach-feature > *, .coach-mini > * { position: relative; z-index: 2; }
    .coach-feature .role, .coach-mini .role { font-size: 10px; color: var(--cobalt); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; }
    .coach-feature .name { font-size: 32px; font-weight: 900; letter-spacing: -0.02em; margin-top: 6px; }
    .coach-feature .desc { font-size: 13px; color: var(--mute); margin-top: 8px; line-height: 1.5; max-width: 320px; }
    .coach-side { display: flex; flex-direction: column; gap: 12px; }
    .coach-mini { flex: 1; padding: 18px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; }
    .coach-mini .name { font-size: 18px; font-weight: 800; margin-top: 4px; }
    @media (max-width: 900px) {
      .coach-grid { grid-template-columns: 1fr; }
      .coach-side { flex-direction: row; }
      .coach-mini { aspect-ratio: 1; flex: 1; }
    }
    @media (max-width: 540px) { .coach-side { flex-direction: column; } }
```

- [ ] **Step 2: Add coaching HTML**

Inside `<main>`, append:

```html
    <section id="coaching">
      <div class="container">
        <header class="section-head">
          <div>
            <span class="eyebrow">▸ Learn from champions</span>
            <h2 class="display-l" style="margin-top:10px">Coaching.</h2>
          </div>
          <p class="desc">Group clinics, private lessons, and youth programs led by national-level coaches.</p>
        </header>
        <div class="coach-grid" id="coach-grid"></div>
      </div>
    </section>
```

- [ ] **Step 3: Add coaches data and rendering**

In `<script>` data block:

```javascript
    const COACHES = [
      { id: 'c1', role: 'Head coach',  name: 'Wei Chen',     desc: 'Former national singles champion. Head of badminton clinics across all locations.', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=80&auto=format&fit=crop', feature: true },
      { id: 'c2', role: 'Pickleball',  name: 'Maria Lopez',  desc: '', img: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=600&q=80&auto=format&fit=crop' },
      { id: 'c3', role: 'Youth',       name: 'Jordan Park',  desc: '', img: 'https://images.unsplash.com/photo-1542293787938-c9e299b88052?w=600&q=80&auto=format&fit=crop' },
      { id: 'c4', role: 'Doubles',     name: 'Aisha Khan',   desc: '', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80&auto=format&fit=crop' },
      { id: 'c5', role: 'Private',     name: 'David Kim',    desc: '', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80&auto=format&fit=crop' },
    ];
```

After memberships logic:

```javascript
    // === COACHING ===
    function renderCoaches() {
      const grid = document.getElementById('coach-grid');
      const feature = COACHES.find(c => c.feature);
      const others = COACHES.filter(c => !c.feature);
      grid.innerHTML = `
        <div class="coach-feature">
          <div class="coach-bg" style="background-image:url('${feature.img}')"></div>
          <div>
            <div class="role">${feature.role}</div>
            <div class="name">${feature.name}</div>
            <p class="desc">${feature.desc}</p>
          </div>
        </div>
        <div class="coach-side">
          ${others.slice(0, 2).map(c => `
            <div class="coach-mini">
              <div class="coach-bg" style="background-image:url('${c.img}')"></div>
              <div>
                <div class="role">${c.role}</div>
                <div class="name">${c.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="coach-side">
          ${others.slice(2, 4).map(c => `
            <div class="coach-mini">
              <div class="coach-bg" style="background-image:url('${c.img}')"></div>
              <div>
                <div class="role">${c.role}</div>
                <div class="name">${c.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    renderCoaches();
```

- [ ] **Step 4: Verify**

Reload. Scroll to "Coaching." Expected:
- Section eyebrow + headline + descriptive paragraph
- Three-column grid: large feature coach card on the left (5:6 with photo, role in Cobalt, name in big type, bio paragraph), and two columns of smaller coach mini-cards on the right (2 each, 4 total)
- All coach cards have photo backgrounds with bottom gradient and white role/name overlay
- Below 900px the layout collapses (feature stacks above the side columns)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add coaching section with feature + mini coach cards"
```

---

## Task 10: Community & events + RSVP modal

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add events/testimonial CSS**

Append inside `<style>`:

```css
    /* === COMMUNITY & EVENTS === */
    .comm-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 32px; align-items: start; }
    .events-list { display: flex; flex-direction: column; }
    .event-row { display: grid; grid-template-columns: 80px 1fr auto; gap: 20px; padding: 22px 0; border-bottom: 1px solid var(--elevated); align-items: center; }
    .event-row:first-child { border-top: 1px solid var(--elevated); }
    .event-row .date { text-align: center; }
    .event-row .date .day { font-size: 32px; font-weight: 900; line-height: 1; letter-spacing: -0.02em; }
    .event-row .date .mo { font-size: 10px; color: var(--cobalt); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
    .event-row .info .name { font-size: 16px; font-weight: 700; color: var(--bone); }
    .event-row .info .meta { font-size: 11px; color: var(--mute); margin-top: 4px; }
    .event-row .rsvp { padding: 8px 14px; border: 1px solid var(--bone); font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bone); cursor: pointer; transition: all 150ms; }
    .event-row .rsvp:hover { background: var(--bone); color: var(--ink); }

    .testimonial { background: var(--surface); padding: 32px; border-left: 3px solid var(--cobalt); }
    .testimonial .quote { font-size: 22px; font-weight: 600; line-height: 1.35; letter-spacing: -0.01em; color: var(--bone); }
    .testimonial .who { margin-top: 24px; font-size: 12px; color: var(--mute); }
    .testimonial .who strong { color: var(--bone); }

    @media (max-width: 900px) { .comm-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Add events HTML**

Inside `<main>`, append:

```html
    <section id="events">
      <div class="container">
        <header class="section-head">
          <div>
            <span class="eyebrow">▸ This season</span>
            <h2 class="display-l" style="margin-top:10px">Show up. Belong.</h2>
          </div>
        </header>
        <div class="comm-grid">
          <div class="events-list" id="events-list"></div>
          <blockquote class="testimonial">
            <p class="quote">"A fun place where I have made great friends and meaningful relationships."</p>
            <div class="who"><strong>Maya R.</strong> · Member since 2023</div>
          </blockquote>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Add events data, rendering, and RSVP modal**

In `<script>` data block:

```javascript
    const EVENTS = [
      { id: 'e1', day: '02', mo: 'May', name: 'Beginner Pickleball Mixer', meta: 'Brunswick · 6:00 PM · Free for members' },
      { id: 'e2', day: '09', mo: 'May', name: 'Spring Doubles Tournament', meta: '3rd Street · 10:00 AM · $25 entry' },
      { id: 'e3', day: '15', mo: 'May', name: 'Junior Badminton Camp',     meta: 'LIC · All week · Ages 8–14' },
      { id: 'e4', day: '23', mo: 'May', name: 'Late-Night Open Play',      meta: 'Summit Ave · 10:00 PM · Members only' },
    ];
```

After coaching logic:

```javascript
    // === EVENTS ===
    function renderEvents() {
      const list = document.getElementById('events-list');
      list.innerHTML = EVENTS.map(e => `
        <div class="event-row">
          <div class="date"><div class="day">${e.day}</div><div class="mo">${e.mo}</div></div>
          <div class="info"><div class="name">${e.name}</div><div class="meta">${e.meta}</div></div>
          <button class="rsvp" data-event="${e.id}">RSVP</button>
        </div>
      `).join('');
      list.querySelectorAll('[data-event]').forEach(btn => {
        btn.addEventListener('click', () => openRsvpModal(btn.dataset.event));
      });
    }
    renderEvents();

    function openRsvpModal(id) {
      const ev = EVENTS.find(e => e.id === id);
      if (!ev) return;
      openModal(`
        <span class="eyebrow">▸ You're in</span>
        <h3 class="display-m" style="margin-top:6px">${ev.name}</h3>
        <p class="modal-meta">${ev.day} ${ev.mo} · ${ev.meta}</p>
        <p class="body" style="font-size:13px;margin-bottom:24px">A confirmation has been sent to your inbox. Add it to your calendar so you don't forget.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="closeModal()">Got it</button>
          <button class="btn btn-ghost" onclick="closeModal()">Add to calendar</button>
        </div>
      `);
    }
```

- [ ] **Step 4: Verify**

Reload. Scroll to "Show up. Belong." Expected:
- Two-column layout
- Left: list of 4 upcoming events. Each row has a date block (big day number + Cobalt month), event name in bold, meta line in muted, outline RSVP button on the right
- Right: testimonial card with Cobalt left border, large pull-quote, "Maya R. · Member since 2023" attribution
- Click RSVP → modal opens "You're in" with event details and two CTAs ("Got it", "Add to calendar")
- Below 900px columns stack

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add events list with RSVP modal and testimonial"
```

---

## Task 11: Stringing section + multi-step stringing modal

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add stringing CSS**

Append inside `<style>`:

```css
    /* === STRINGING === */
    .stringing { display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; background: var(--surface); border: 1px solid var(--elevated); }
    .stringing-text { padding: clamp(28px, 5vw, 56px); display: flex; flex-direction: column; justify-content: center; }
    .stringing-text h3 { margin: 16px 0 14px; }
    .stringing-text p { color: var(--mute); font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
    .stringing-img { aspect-ratio: 4/3; background-size: cover; background-position: center; }
    .stringing-text .stringing-cta { width: fit-content; }
    @media (max-width: 768px) { .stringing { grid-template-columns: 1fr; } .stringing-img { aspect-ratio: 16/9; } }
```

- [ ] **Step 2: Add stringing HTML**

Inside `<main>`, append:

```html
    <section id="stringing">
      <div class="container">
        <div class="stringing">
          <div class="stringing-text">
            <span class="eyebrow">▸ Professional stringing</span>
            <h3 class="display-l">Strung in 24 hours.</h3>
            <p>Drop your racquet at any location. Choose your tension, your string, your timing. We'll text you when it's ready.</p>
            <button class="btn btn-primary stringing-cta" id="stringing-cta">Book stringing →</button>
          </div>
          <div class="stringing-img" style="background-image:url('https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=1200&q=80&auto=format&fit=crop')"></div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Add stringing modal logic**

In `<script>` data block:

```javascript
    const STRINGS = [
      { id: 'yonex-bg65',  name: 'Yonex BG65',     desc: 'Durable all-round string', price: 22 },
      { id: 'yonex-bg80',  name: 'Yonex BG80',     desc: 'Power and repulsion',     price: 28 },
      { id: 'ashaway-zm',  name: 'Ashaway Zymax',  desc: 'Pro tour favorite',       price: 32 },
    ];
    const TENSIONS = ['22 lbs · Soft feel', '24 lbs · Balanced (recommended)', '26 lbs · Crisp control', '28 lbs · Pro level'];
```

After events logic:

```javascript
    // === STRINGING ===
    document.getElementById('stringing-cta').addEventListener('click', openStringingModal);

    function openStringingModal() {
      let step = 1;
      let chosen = { string: null, tension: null, location: null };

      const render = () => {
        if (step === 1) {
          openModal(`
            <div class="step-row"><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div><div class="step-dot"></div></div>
            <span class="eyebrow">▸ Step 1 of 4 · Pick a string</span>
            <h3 class="display-m" style="margin-top:6px">Which string?</h3>
            <div class="step-pick">${STRINGS.map(s => `<button data-string="${s.id}"><div style="font-weight:700">${s.name}</div><div style="font-size:11px;color:var(--mute);margin-top:2px">${s.desc} · $${s.price}</div></button>`).join('')}</div>
          `);
          document.querySelectorAll('[data-string]').forEach(b => b.addEventListener('click', () => { chosen.string = b.dataset.string; step = 2; render(); }));
        } else if (step === 2) {
          openModal(`
            <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div></div>
            <span class="eyebrow">▸ Step 2 of 4 · Tension</span>
            <h3 class="display-m" style="margin-top:6px">String tension</h3>
            <div class="step-pick">${TENSIONS.map(t => `<button data-tension="${t}">${t}</button>`).join('')}</div>
          `);
          document.querySelectorAll('[data-tension]').forEach(b => b.addEventListener('click', () => { chosen.tension = b.dataset.tension; step = 3; render(); }));
        } else if (step === 3) {
          openModal(`
            <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div></div>
            <span class="eyebrow">▸ Step 3 of 4 · Drop-off location</span>
            <h3 class="display-m" style="margin-top:6px">Where will you drop it off?</h3>
            <div class="step-pick">${LOCATIONS.filter(l => l.status === 'open').map(l => `<button data-loc="${l.id}">${l.name} · ${l.city}</button>`).join('')}</div>
          `);
          document.querySelectorAll('[data-loc]').forEach(b => b.addEventListener('click', () => { chosen.location = b.dataset.loc; step = 4; render(); }));
        } else {
          const num = 'KF-STR-' + Math.floor(1000 + Math.random() * 9000);
          const stringObj = STRINGS.find(s => s.id === chosen.string);
          const locObj = LOCATIONS.find(l => l.id === chosen.location);
          openModal(`
            <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div></div>
            <span class="eyebrow">▸ Order placed</span>
            <div class="confirm-num">${num}</div>
            <h3 class="display-m">${stringObj.name} · ${chosen.tension.split(' · ')[0]}</h3>
            <p class="modal-meta">Drop off at ${locObj.name} · We'll text you in 24 hours.</p>
            <p class="body" style="font-size:13px;margin-bottom:24px">Bring your racquet to the front desk. Show this number.</p>
            <button class="btn btn-primary" onclick="closeModal()">Done</button>
          `);
        }
      };
      render();
    }
```

- [ ] **Step 4: Verify**

Reload. Scroll to the stringing section. Expected:
- Two-column block on Surface background, bordered
- Left: eyebrow + "Strung in 24 hours." headline + paragraph + Cobalt CTA
- Right: stringing close-up image
- Click "Book stringing →" → 4-step modal: pick string → tension → drop-off location → confirmation with KF-STR-NNNN number
- Below 768px columns stack

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add stringing service with 4-step booking modal"
```

---

## Task 12: Footer

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add footer CSS**

Append inside `<style>`:

```css
    /* === FOOTER === */
    .footer { padding: 64px 0 28px; border-top: 1px solid var(--elevated); }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; padding-bottom: 40px; border-bottom: 1px solid var(--elevated); }
    .footer h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--mute); font-weight: 700; margin: 0 0 16px; }
    .footer ul li { font-size: 13px; padding: 6px 0; }
    .footer ul li a:hover { color: var(--cobalt); }
    .footer .brand .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; }
    .footer .brand p { color: var(--mute); font-size: 13px; line-height: 1.6; max-width: 360px; margin: 12px 0 0; }
    .footer-bottom { display: flex; justify-content: space-between; padding-top: 24px; font-size: 11px; color: var(--mute); flex-wrap: wrap; gap: 12px; }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 540px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } }
```

- [ ] **Step 2: Add footer HTML**

After the `</main>` close, before the `<script>` tag, insert:

```html
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <div class="logo">KOTOFIT</div>
          <p>America's home for badminton, pickleball, and indoor sports. Five locations across NJ and NY, growing.</p>
        </div>
        <div>
          <h4>Play</h4>
          <ul>
            <li><a href="#locations">Locations</a></li>
            <li><a href="#booking">Reserve</a></li>
            <li><a href="#memberships">Memberships</a></li>
            <li><a href="#stringing">Stringing</a></li>
          </ul>
        </div>
        <div>
          <h4>Learn</h4>
          <ul>
            <li><a href="#coaching">Coaching</a></li>
            <li><a href="#coaching">Clinics</a></li>
            <li><a href="#coaching">Youth</a></li>
            <li><a href="#events">Events</a></li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="#">WhatsApp</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">WeChat</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 Kotofit</div>
        <div>NJ · NY · Brooklyn (soon) · Queens (soon)</div>
      </div>
    </div>
  </footer>
```

- [ ] **Step 3: Verify**

Reload. Scroll to bottom. Expected:
- Footer with four columns: Brand block (logo + paragraph), Play (4 links), Learn (4 links), Connect (4 links)
- Border above and below the column grid
- Bottom row: "© 2026 Kotofit" left, "NJ · NY · Brooklyn (soon) · Queens (soon)" right
- Footer links scroll to their corresponding sections; "Connect" links are placeholders
- Below 768px footer collapses to 2 columns; below 540px to 1 column

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add footer with sitemap and brand summary"
```

---

## Task 13: Mobile responsive pass + hamburger menu

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add mobile nav overlay CSS**

Append inside `<style>`:

```css
    /* === MOBILE NAV === */
    .mobile-menu { position: fixed; inset: 0; background: var(--ink); z-index: 150; display: none; flex-direction: column; padding: 80px 24px 32px; }
    .mobile-menu.open { display: flex; }
    .mobile-menu .close { position: absolute; top: 18px; right: 24px; font-size: 24px; color: var(--bone); width: 40px; height: 40px; }
    .mobile-menu nav { display: flex; flex-direction: column; gap: 4px; }
    .mobile-menu nav a { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; padding: 10px 0; color: var(--bone); }
    .mobile-menu .mm-cta { margin-top: auto; padding: 18px; background: var(--cobalt); color: var(--bone); text-align: center; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }

    /* === Section padding tighten on small screens === */
    @media (max-width: 540px) {
      .section-head { margin-bottom: 28px; }
      .booking { padding: 20px; }
      .mem-card { padding: 24px; }
    }
```

- [ ] **Step 2: Add mobile menu HTML**

Inside `<body>`, after the `</nav>` closing tag, insert:

```html
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <button class="close" id="mm-close" aria-label="Close menu">×</button>
    <nav>
      <a href="#locations">Locations</a>
      <a href="#booking">Reserve</a>
      <a href="#memberships">Memberships</a>
      <a href="#coaching">Coaching</a>
      <a href="#events">Events</a>
      <a href="#stringing">Stringing</a>
    </nav>
    <a href="#booking" class="mm-cta">Reserve a court →</a>
  </div>
```

- [ ] **Step 3: Add mobile menu JS**

Append inside `<script>` (after the stringing logic):

```javascript
    // === MOBILE MENU ===
    const burger = document.querySelector('.nav-burger');
    const mm = document.getElementById('mobile-menu');
    const mmClose = document.getElementById('mm-close');
    burger?.addEventListener('click', () => { mm.classList.add('open'); document.body.style.overflow = 'hidden'; });
    mmClose?.addEventListener('click', () => { mm.classList.remove('open'); document.body.style.overflow = ''; });
    mm?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mm.classList.remove('open'); document.body.style.overflow = ''; }));
```

- [ ] **Step 4: Verify across viewport widths**

Reload. Open browser dev tools device toolbar. Walk through these widths and verify:

- **375px (iPhone SE):** nav burger visible. All sections single-column. Locations/sports/memberships stack 1-up. Booking widget fields stack. Footer 1-col. No horizontal scroll anywhere.
- **414px (iPhone Pro):** same as above.
- **768px (tablet):** locations 2-col, sports 1-col, memberships 1-col, booking 2-up + full-width CTA, coaching collapses, footer 2-col.
- **1024px:** locations 2-col, sports 3-col, memberships 1-col → 3-col threshold at 900px, coaching 3-col.
- **1440px (desktop):** full layout as designed.

Click the burger on mobile → fullscreen overlay menu opens with stacked links + Reserve CTA at the bottom. Click any link → smooth-scrolls and the menu closes.

If any section overflows or visually breaks, capture which width and which section, fix the offending grid/breakpoint inline, then re-verify.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(homepage): mobile menu + responsive pass across all sections"
```

---

## Task 14: Motion — fade-up on scroll, headline reveals

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add fade-up CSS**

Append inside `<style>`:

```css
    /* === MOTION === */
    .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 700ms var(--ease-out), transform 700ms var(--ease-out); }
    .fade-up.in { opacity: 1; transform: translateY(0); }
    @media (prefers-reduced-motion: reduce) {
      .fade-up { opacity: 1; transform: none; transition: none; }
      .hero.loaded .hero-bg { transform: none; }
    }
```

- [ ] **Step 2: Add fade-up JS**

Append inside `<script>` (after mobile menu logic):

```javascript
    // === SCROLL REVEAL ===
    document.querySelectorAll('.section-head, .play-tile, .mem-card, .loc-card, .coach-feature, .coach-mini, .event-row, .stringing').forEach(el => el.classList.add('fade-up'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
```

- [ ] **Step 3: Verify**

Reload. Scroll slowly from top to bottom. Expected:
- Section headers, location cards, sport tiles, membership cards, coach cards, event rows, and the stringing block fade up gently as they enter the viewport
- Each element animates once and stays visible
- The hero already has its Ken-Burns zoom from Task 3
- Test reduced-motion: in dev tools, emulate `prefers-reduced-motion: reduce` and reload — animations disable, content visible immediately

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(homepage): add scroll-reveal motion with reduced-motion fallback"
```

---

## Task 15: Final QA — image swap, copy review, smoke test

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Verify every Unsplash URL loads**

Open `index.html` in a browser. Open dev tools Network panel and reload. Filter to images. Expected: every Unsplash URL returns 200 OK and displays an appropriate image (badminton/pickleball/sports/people/courts).

If any image returns 404 or shows an obviously-wrong subject (e.g., a kitten where a court should be), find a replacement: visit `https://unsplash.com/s/photos/badminton` (or `pickleball`, `racquet`, `gym-interior`), pick a relevant photo, copy its image URL by right-clicking the displayed image and choosing "Copy image address," and replace the URL in the corresponding `LOCATIONS` / `SPORTS` / `COACHES` / `.hero-bg` / `.stringing-img` reference.

If a particular topic refuses to load nice options, fall back to a plausible substitute (e.g., generic indoor sports court photo for a missing badminton card). The key is that **no broken images appear** and every photo is at least topically appropriate.

- [ ] **Step 2: Smoke-test every interaction**

Walk through this checklist with `index.html` open in a browser. Check off each as you go:

- [ ] Nav links smooth-scroll to their sections
- [ ] Hero "Reserve a court →" scrolls to booking widget
- [ ] Hero location chip → opens a dropdown or modal (currently logged as `data-action="open-locations"` placeholder — for the prototype, ensure a click does *something* visible. If not yet wired, add a one-liner that opens a simple location-list modal.)
- [ ] Each of the 5 location cards opens the location detail modal
- [ ] Booking widget: each of the 4 fields opens a dropdown; selecting an option updates the displayed value
- [ ] Booking widget "Check courts →" opens court-availability modal
- [ ] Available court → confirmation modal with KF-NNNN number
- [ ] Each of the 3 sport tiles opens a sport-overview modal; "Reserve a court →" inside it scrolls to booking
- [ ] Each of the 3 membership tier CTAs opens the 3-step join flow; flow completes with KF-MEM-NNNN
- [ ] Each of the 4 RSVP buttons opens the RSVP modal
- [ ] "Book stringing →" opens the 4-step stringing flow; completes with KF-STR-NNNN
- [ ] ESC key and backdrop click close any open modal
- [ ] Mobile burger opens fullscreen menu; links inside close menu and scroll
- [ ] No console errors at any point

If the hero location chip currently has no handler (search for `data-action="open-locations"`), add this snippet to the `<script>` block (inside the `// === HERO ===` section):

```javascript
    document.querySelector('.where-chip')?.addEventListener('click', () => {
      openModal(`
        <span class="eyebrow">▸ Choose your court</span>
        <h3 class="display-m" style="margin-top:6px">Where are you playing?</h3>
        <div class="step-pick" style="margin-top:16px">
          ${LOCATIONS.map(l => `
            <button onclick="document.querySelector('.where-chip .city').firstChild.textContent='${l.name} ';closeModal();" ${l.status==='soon'?'disabled style=\"opacity:0.5\"':''}>
              ${l.name} · ${l.city}${l.status==='soon'?' (Soon)':''}
            </button>
          `).join('')}
        </div>
      `);
    });
```

- [ ] **Step 3: Copy review**

Re-read the page top to bottom. Hunt for typos, broken links, awkward line breaks at common viewport widths (375, 768, 1280). Fix anything that reads off.

- [ ] **Step 4: Lighthouse / quick perf sanity**

In Chrome dev tools → Lighthouse → run a desktop audit. Target: Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 90. The biggest perf hit will be Unsplash images — that's acceptable for a prototype but note any flagged issues in the commit message if scores fall short.

- [ ] **Step 5: Final commit**

```bash
git add index.html
git commit -m "polish(homepage): image QA, hero-chip wiring, smoke test, copy pass"
```

---

## Self-review notes

The plan covers all 10 sections and all interactions named in the spec. Image fallback strategy is specified (gradients render even if photos fail, Task 15 swaps in working URLs). All confirmation-number prefixes (`KF-`, `KF-MEM-`, `KF-STR-`) are unique per flow so a stakeholder can tell which simulated transaction generated which number. Responsive breakpoints are stated per section and re-verified holistically in Task 13. Motion is gated on `prefers-reduced-motion`. Accessibility basics (semantic headings, button elements, ARIA on modal, keyboard close) are wired into the relevant tasks rather than batched at the end.
