# Kotofit Multi-Page Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing single-file Kotofit homepage prototype into a six-page clickable site by extracting shared CSS/JS into `assets/` and building five sibling pages — Locations, Memberships, Coaching, Events, Stringing — that reuse the same nav, footer, modals, and design system.

**Architecture:** One-time refactor of `index.html` to externalize all CSS/data/JS into `assets/styles.css`, `assets/data.js`, `assets/app.js`. Each new page is a standalone HTML file at the project root that links those three shared assets and renders its own page-specific content via `app.js` functions that are no-ops if their target DOM elements don't exist.

**Tech Stack:** HTML5, vanilla CSS (Custom Properties, Grid, Flexbox), vanilla JS (ES2020), Inter from Google Fonts, real Unsplash photography. No build, no bundler, no dependencies.

**Spec:** [docs/superpowers/specs/2026-04-27-kotofit-multipage-expansion-design.md](../specs/2026-04-27-kotofit-multipage-expansion-design.md)

**Important context for the implementer:**
- The homepage currently uses inline `<style>` and `<script>` blocks. After Tasks 1–3, those blocks become `<link>` and `<script src>` references.
- Browsers may block `<script src>` from `file://` for some Chrome flags. The user can run `python -m http.server` or `npx serve .` from the project root if double-clicking stops working post-refactor.
- All dynamic interpolations into innerHTML must use the existing `escapeHtml(...)` helper.
- Every modal action button must use a stable `id` + `addEventListener` pattern, never inline `onclick`.

---

## File Structure

After this plan completes, the project root looks like:

```
/
├── index.html                                  (modified — links assets/)
├── locations.html                              (new)
├── memberships.html                            (new)
├── coaching.html                               (new)
├── events.html                                 (new)
├── stringing.html                              (new)
├── assets/
│   ├── styles.css                              (new — extracted + new rules)
│   ├── data.js                                 (new — extracted + new arrays)
│   └── app.js                                  (new — extracted + new functions)
├── docs/superpowers/                           (existing)
└── .gitignore                                  (existing)
```

**Responsibilities:**
- `index.html` — homepage with embedded booking widget hero
- `assets/styles.css` — every visual rule for every page
- `assets/data.js` — `LOCATIONS`, `SPORTS`, `TIERS`, `COACHES`, `EVENTS`, `STRINGS`, `TENSIONS`, plus new `PROGRAMS` and `FAQS`
- `assets/app.js` — `escapeHtml`, modal infrastructure, all `open*Modal` functions, all `render*` functions, mobile menu wiring, scroll-reveal observer, hero load class. Each `render*` checks for its target element and no-ops if absent.
- Each new `*.html` page — only page-specific HTML markup; styling and behavior come from the shared assets.

---

## Verification Approach

For a static visual prototype there are no automated tests; verification per task is **load the affected page in a browser and confirm the listed criteria.** The implementer should keep two browser tabs open: `index.html` (regression target) and whichever new page is being built.

If `file://` scripts fail to load, run `python -m http.server 8080` from the project root and use `http://localhost:8080/` instead.

---

## Task 1: Extract CSS into `assets/styles.css`

**Files:**
- Create: `assets/styles.css`
- Modify: `index.html`

- [ ] **Step 1: Create the assets directory**

```bash
mkdir -p "assets"
```

- [ ] **Step 2: Create `assets/styles.css`**

Open `index.html` and locate the `<style>` block (starts on the line `<style>` inside `<head>`, ends on `</style>`). Copy every line BETWEEN those tags (not the tags themselves) into a new file at `assets/styles.css`. The file should start with the `/* === DESIGN TOKENS === */` comment and end with the last CSS rule (currently the scroll-reveal `@media (prefers-reduced-motion: reduce)` block).

Do not modify any rules. Pure copy.

- [ ] **Step 3: Replace the inline `<style>` in `index.html` with a stylesheet link**

In `index.html`, replace the entire `<style>...</style>` block (including the opening and closing tags) with this single line, placed in the same location inside `<head>`:

```html
  <link rel="stylesheet" href="assets/styles.css" />
```

- [ ] **Step 4: Verify in browser**

Reload `index.html` in a browser. Expected: the page looks visually identical to before. Hero, locations, sport tiles, memberships, coaching, events, stringing, footer all render with the correct typography, colors, and layout. If anything renders un-styled, the link path is wrong or the copy missed content.

- [ ] **Step 5: Commit**

```bash
git add assets/styles.css index.html
git commit -m "refactor(homepage): extract CSS to assets/styles.css"
```

---

## Task 2: Extract JS data arrays into `assets/data.js`

**Files:**
- Create: `assets/data.js`
- Modify: `index.html`

- [ ] **Step 1: Create `assets/data.js`**

In `index.html`, locate the `<script>` block (just before `</body>`). Inside it, find every `const NAME = [...]` declaration. Currently those are: `LOCATIONS`, `SPORTS`, `TIERS`, `COACHES`, `EVENTS`, `STRINGS`, `TENSIONS`, plus the `BOOKING_OPTIONS` object inside the booking section.

Note: `BOOKING_OPTIONS` is defined inside the booking widget logic block, not at the top with the other arrays. Leave it where it is — only extract the page-level data arrays.

Create `assets/data.js` with this exact content (the same arrays from the homepage, with no changes):

```javascript
// assets/data.js
// Shared data used by every Kotofit page. No DOM access — pure data.

const LOCATIONS = [
  { id: 'jc-3rd',     city: 'Jersey City · NJ',       name: '3rd Street',    courts: 8,  hours: 'Open until 11PM',   img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '123 3rd Street, Jersey City, NJ 07302',
    sports: ['badminton', 'pickleball', 'pingpong'],
    services: ['coaching', 'stringing'] },
  { id: 'jc-bruns',   city: 'Jersey City · NJ',       name: 'Brunswick',     courts: 10, hours: 'Open until 11PM',   img: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '189 New Brunswick Street, Jersey City, NJ 07302',
    sports: ['badminton', 'pickleball'],
    services: ['coaching', 'stringing', 'events'] },
  { id: 'jc-summit',  city: 'Jersey City · NJ',       name: 'Summit Ave',    courts: 6,  hours: 'Open until 10PM',   img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '440 Summit Avenue, Jersey City, NJ 07306',
    sports: ['badminton', 'pingpong'],
    services: ['stringing'] },
  { id: 'lic-10th',   city: 'Long Island City · NY',  name: '10th Street',   courts: 12, hours: 'Open until 11PM',   img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '47-10 10th Street, Long Island City, NY 11101',
    sports: ['badminton', 'pickleball', 'pingpong'],
    services: ['coaching', 'stringing', 'events'] },
  { id: 'bk-soon',    city: 'Brooklyn · NY',          name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80&auto=format&fit=crop', status: 'soon',
    address: 'Brooklyn — exact address coming soon',
    sports: [],
    services: [] },
  { id: 'qns-soon',   city: 'Queens · NY',            name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: 'https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=800&q=80&auto=format&fit=crop', status: 'soon',
    address: 'Queens — exact address coming soon',
    sports: [],
    services: [] },
];

const SPORTS = [
  { id: 'badminton',  num: '01', name: 'Badminton',  read: 'Open play, leagues, clinics →',  img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80&auto=format&fit=crop', desc: 'The fastest racquet sport in the world. Open play sessions, member leagues, and clinics for every level — from first racquet to tournament prep.' },
  { id: 'pickleball', num: '02', name: 'Pickleball', read: 'All levels, mixers, tournaments →', img: 'https://images.unsplash.com/photo-1659318006095-4d44845f3a1b?w=1200&q=80&auto=format&fit=crop', desc: "America's fastest-growing sport. Drop-in mixers every week, ladder leagues, and weekend tournaments. Easy to learn, hard to put down." },
  { id: 'pingpong',   num: '03', name: 'Ping Pong',  read: 'Drop in, tables ready →',          img: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=1200&q=80&auto=format&fit=crop', desc: 'Tables ready at every location. No reservation needed — drop in, grab a paddle, and play.' },
];

const TIERS = [
  { id: 'dropin',     name: 'Drop-in',                price: 0,   featured: false, perks: ['Pay per court', 'Standard booking window', 'Public events'], cta: 'Book one-off',
    fullPerks: ['Pay $20–$30 per court hour', 'Book 48 hours in advance', 'Public events open to all', 'No commitment, no monthly fee', 'Walk-in pricing for ping pong'] },
  { id: 'go-koto',    name: 'Go Koto · Most popular', price: 49,  featured: true,  perks: ['72-hour early booking', 'Free monthly events', '10% off clinics + stringing', 'Guest passes'], cta: 'Become a member',
    fullPerks: ['72-hour early booking window', '$15/hr member court rate', 'Free monthly member events', '10% off clinics and stringing', '2 guest passes per month', 'Freeze for up to 3 months/year', 'Member-only mixers'] },
  { id: 'all-access', name: 'All-Access',             price: 129, featured: false, perks: ['14-day early booking', 'All clinics included', 'Free stringing (2/mo)', 'Unlimited guest passes'], cta: 'Go All-Access',
    fullPerks: ['14-day early booking window', '$10/hr member court rate', 'All group clinics included', '2 free stringings per month', 'Unlimited guest passes', 'Family add-on at 50% off', 'Priority on tournament entries', 'Personal locker at home court'] },
];

const COACHES = [
  { id: 'c1', role: 'Head coach',  name: 'Wei Chen',     desc: 'Former national singles champion. Head of badminton clinics across all locations.',                       img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=80&auto=format&fit=crop', feature: true,
    specialty: 'Badminton singles & doubles', rate: 95 },
  { id: 'c2', role: 'Pickleball',  name: 'Maria Lopez',  desc: 'PPA-certified pro coach with 8 years competitive play and a passion for getting beginners on the court.', img: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=600&q=80&auto=format&fit=crop',
    specialty: 'Pickleball — beginner & intermediate', rate: 75 },
  { id: 'c3', role: 'Youth',       name: 'Jordan Park',  desc: 'Junior development specialist. Built youth programs at three clubs before joining Kotofit.',              img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80&auto=format&fit=crop',
    specialty: 'Junior badminton (ages 8–17)', rate: 70 },
  { id: 'c4', role: 'Doubles',     name: 'Aisha Khan',   desc: 'Doubles strategist. Former regional doubles champion, now coaching pairs through advanced rotations.',     img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80&auto=format&fit=crop',
    specialty: 'Badminton doubles', rate: 85 },
  { id: 'c5', role: 'Private',     name: 'David Kim',    desc: 'Private-lessons specialist. 1-on-1 coaching focused on technical refinement and match prep.',              img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80&auto=format&fit=crop',
    specialty: 'Privates — all levels', rate: 110 },
];

const EVENTS = [
  { id: 'e1',  day: '02', mo: 'May', name: 'Beginner Pickleball Mixer',  meta: 'Brunswick · 6:00 PM · Free for members',           sport: 'pickleball', location: 'jc-bruns',  month: 'May', price: 'free' },
  { id: 'e2',  day: '09', mo: 'May', name: 'Spring Doubles Tournament',  meta: '3rd Street · 10:00 AM · $25 entry',               sport: 'badminton',  location: 'jc-3rd',     month: 'May', price: 'paid' },
  { id: 'e3',  day: '15', mo: 'May', name: 'Junior Badminton Camp',      meta: 'LIC · All week · Ages 8–14',                       sport: 'badminton',  location: 'lic-10th',   month: 'May', price: 'paid' },
  { id: 'e4',  day: '23', mo: 'May', name: 'Late-Night Open Play',       meta: 'Summit Ave · 10:00 PM · Members only',             sport: 'badminton',  location: 'jc-summit',  month: 'May', price: 'free' },
  { id: 'e5',  day: '30', mo: 'May', name: 'Pickleball Skills Clinic',   meta: 'Brunswick · 7:00 PM · $30',                        sport: 'pickleball', location: 'jc-bruns',   month: 'May', price: 'paid' },
  { id: 'e6',  day: '06', mo: 'Jun', name: 'Summer Kickoff Mixer',       meta: 'LIC · 5:00 PM · Free',                             sport: 'badminton',  location: 'lic-10th',   month: 'Jun', price: 'free' },
  { id: 'e7',  day: '13', mo: 'Jun', name: 'Ping Pong Ladder Night',     meta: '3rd Street · 8:00 PM · $10 entry',                 sport: 'pingpong',   location: 'jc-3rd',     month: 'Jun', price: 'paid' },
  { id: 'e8',  day: '20', mo: 'Jun', name: 'Pickleball Open Tournament', meta: 'Brunswick · 9:00 AM · $40',                        sport: 'pickleball', location: 'jc-bruns',   month: 'Jun', price: 'paid' },
  { id: 'e9',  day: '27', mo: 'Jun', name: 'Member Appreciation Night',  meta: 'All locations · 7:00 PM · Members only',           sport: 'badminton',  location: 'all',        month: 'Jun', price: 'free' },
  { id: 'e10', day: '04', mo: 'Jul', name: 'Independence Day Open Play', meta: 'LIC · All day · Free for members',                 sport: 'badminton',  location: 'lic-10th',   month: 'Jul', price: 'free' },
  { id: 'e11', day: '11', mo: 'Jul', name: 'Junior Pickleball Camp',     meta: 'Brunswick · All week · Ages 10–16 · $250',         sport: 'pickleball', location: 'jc-bruns',   month: 'Jul', price: 'paid' },
  { id: 'e12', day: '18', mo: 'Jul', name: 'Summer Doubles League Final',meta: '3rd Street · 6:00 PM · Spectators welcome',        sport: 'badminton',  location: 'jc-3rd',     month: 'Jul', price: 'free' },
];

const STRINGS = [
  { id: 'yonex-bg65',  name: 'Yonex BG65',     desc: 'Durable all-round string. Best for beginners and high-frequency players who break strings often.', price: 22, gauge: '0.70mm', durability: 5, control: 3, power: 3 },
  { id: 'yonex-bg80',  name: 'Yonex BG80',     desc: 'Power and repulsion. The choice of attacking players who want every smash to feel explosive.',     price: 28, gauge: '0.68mm', durability: 4, control: 3, power: 5 },
  { id: 'ashaway-zm',  name: 'Ashaway Zymax',  desc: 'Pro tour favorite. Crisp control with surprising durability — equally at home in singles and doubles.', price: 32, gauge: '0.66mm', durability: 4, control: 5, power: 4 },
];

const TENSIONS = ['22 lbs · Soft feel', '24 lbs · Balanced (recommended)', '26 lbs · Crisp control', '28 lbs · Pro level'];

const PROGRAMS = [
  { id: 'group',    name: 'Group Clinics',   img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&q=80&auto=format&fit=crop',
    desc: 'Small-group sessions (4–8 players) led by Kotofit coaches. Drills, match play, and feedback. All levels.',
    priceRange: '$30–$45 per session', cta: 'Book a clinic' },
  { id: 'private',  name: 'Private Lessons', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900&q=80&auto=format&fit=crop',
    desc: '1-on-1 coaching focused on your goals. Technical refinement, match prep, footwork, strategy.',
    priceRange: '$70–$110 per hour', cta: 'Book a lesson' },
  { id: 'junior',   name: 'Junior Academy',  img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80&auto=format&fit=crop',
    desc: 'Year-round development for ages 8–17. Skill streams from beginner introduction to tournament-ready.',
    priceRange: '$250 per week (camps) / $40 per drop-in', cta: 'Enroll' },
];

const FAQS = {
  memberships: [
    { q: 'Can I freeze my membership?', a: 'Go Koto and All-Access members can freeze for up to 3 months per calendar year. Drop-in does not require freezing — pay only when you play.' },
    { q: 'Can I share my membership with family?', a: 'All-Access includes a 50%-off family add-on for one additional adult at the same address. Children play at junior rates regardless of plan.' },
    { q: 'What if I cancel?', a: 'Memberships are month-to-month with no commitment. Cancel anytime from your account; access continues through the end of the current billing cycle.' },
    { q: 'When does my booking window open?', a: 'Drop-in: 48 hours before tee time. Go Koto: 72 hours. All-Access: 14 days. Booking opens at midnight Eastern.' },
    { q: 'Are guest passes capped?', a: 'Go Koto: 2 guest passes per month, unused passes do not roll over. All-Access: unlimited guest passes (subject to court availability).' },
    { q: 'Do members get discounts on clinics and stringing?', a: 'Go Koto: 10% off both. All-Access: clinics included in membership; 2 free stringings per month, additional at member rate.' },
  ],
  coaching: [
    { q: 'What level are clinics for?', a: 'Most clinics are split into Beginner, Intermediate, and Advanced cohorts. The schedule lists the level for each session.' },
    { q: 'Are private lessons 1-on-1 only?', a: 'Yes by default, but two-player privates can be booked at a reduced per-person rate. Ask the coach when booking.' },
    { q: 'Can I cancel a booked session?', a: 'Cancel up to 24 hours before the session for a full refund. Within 24 hours: 50% credit toward a future booking.' },
    { q: "What's included in a clinic?", a: 'Coach instruction, court time, on-site shuttlecocks/balls. Bring your own racquet and grip.' },
    { q: 'Do I need my own racquet?', a: 'Yes, bring your own. The front desk has a small loaner pool ($5/session) but availability is not guaranteed.' },
  ],
  stringing: [
    { q: 'Can I bring my own string?', a: 'Yes — labor only is $15 if you supply the string. Drop the racquet and string together at the front desk.' },
    { q: 'How often should I restring?', a: 'Rule of thumb: as many times per year as you play per week. Weekly players: once a year. Daily players: 6+ times.' },
    { q: 'Do you offer same-day stringing?', a: 'Same-day on weekdays if dropped off before noon, $10 rush fee. Weekend drops are turned around by Monday end-of-day.' },
    { q: 'When can I pick up?', a: 'Pickup hours are tied to each location\'s open hours. We text when ready; bring your confirmation number to the front desk.' },
  ],
};
```

- [ ] **Step 2: Remove the data declarations from `index.html`**

In `index.html`'s `<script>` block, find each of these constants and DELETE them (the entire `const NAME = [...]` declaration including the closing `;`):
- `LOCATIONS`
- `SPORTS`
- `TIERS`
- `COACHES`
- `EVENTS`
- `STRINGS`
- `TENSIONS`

Leave `BOOKING_OPTIONS` in place — it stays inside the booking widget logic block.

- [ ] **Step 3: Add the data script tag to `index.html`**

Just before the existing `<script>` block (the one with all the JS code), add a new line:

```html
  <script src="assets/data.js"></script>
  <script>
    // (existing inline script content remains here for now — extracted in Task 3)
```

The existing `<script>` block stays; we're just sourcing the data first.

- [ ] **Step 4: Verify**

Reload `index.html`. Expected: page renders identically to before. Locations grid shows 6 cards, sport tiles show 3 cards, memberships show 3 tiers, coaching shows 5 coaches, events show 4 rows, stringing modal works.

If anything renders empty (e.g., locations grid is blank), the data file isn't loading — check browser console for 404 on `assets/data.js`.

- [ ] **Step 5: Commit**

```bash
git add assets/data.js index.html
git commit -m "refactor(homepage): extract data arrays to assets/data.js"
```

---

## Task 3: Extract app code into `assets/app.js`

**Files:**
- Create: `assets/app.js`
- Modify: `index.html`

- [ ] **Step 1: Create `assets/app.js`**

In `index.html`, the remaining `<script>` block now contains:
- `BOOKING_OPTIONS` (object)
- `escapeHtml` helper
- Hero load class (`requestAnimationFrame(...)`)
- `renderLocations`
- `openModal`, `closeModal`, `openLocationModal`
- Booking dropdown wiring + `openCourtModal` + `openConfirmModal`
- `renderPlay`, `openSportModal`
- `renderMemberships`, `openJoinModal`
- `renderCoaches`
- `renderEvents`, `openRsvpModal`
- Stringing CTA wiring + `openStringingModal`
- Mobile menu wiring (`openMm`, `closeMm`)
- Scroll-reveal observer

Move the entire script content into a new file `assets/app.js`, but wrap every render-call (lines like `renderLocations();`, `renderPlay();`, etc.) so they only fire if the target element exists.

Create `assets/app.js` with this structure (begin with the helpers, then modal infrastructure, then each section's render+modal, then page-init at bottom):

```javascript
// assets/app.js
// All Kotofit page interactions. Each render*() checks for its target element
// and no-ops if absent, so this file is safe to load on any page.

// === HELPERS ===
function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

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

// === LOCATIONS ===
function renderLocations() {
  const grid = document.getElementById('loc-grid');
  if (!grid) return;
  grid.innerHTML = LOCATIONS.map(loc => `
    <button class="loc-card" data-loc-id="${escapeHtml(loc.id)}">
      <div class="loc-img" style="background-image:url('${escapeHtml(loc.img)}')">
        <span class="badge ${loc.status === 'soon' ? 'soon' : ''}">${loc.status === 'soon' ? 'Soon' : 'Open'}</span>
      </div>
      <div class="loc-body">
        <div class="city">${escapeHtml(loc.city)}</div>
        <div class="name">${escapeHtml(loc.name)}</div>
        <div class="meta">${loc.courts ? escapeHtml(loc.courts) + ' courts · ' : ''}${escapeHtml(loc.hours)}</div>
      </div>
    </button>
  `).join('');
  grid.querySelectorAll('.loc-card').forEach(card => {
    card.addEventListener('click', () => openLocationModal(card.dataset.locId));
  });
}

function openLocationModal(id) {
  const loc = LOCATIONS.find(l => l.id === id);
  if (!loc) return;
  const isSoon = loc.status === 'soon';
  openModal(`
    <div class="modal-img" style="background-image:url('${escapeHtml(loc.img)}')"></div>
    <span class="eyebrow">${escapeHtml(loc.city)}</span>
    <h3 class="display-m">${escapeHtml(loc.name)}</h3>
    <p class="modal-meta">${isSoon ? 'Coming this season — get notified when we open.' : `${escapeHtml(loc.courts)} courts · ${escapeHtml(loc.hours)}`}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="loc-modal-primary">${isSoon ? 'Notify me' : 'Reserve here →'}</button>
      <button class="btn btn-ghost" id="loc-modal-close">Close</button>
    </div>
  `);
  document.getElementById('loc-modal-primary')?.addEventListener('click', () => {
    closeModal();
    if (isSoon) { openWaitlistModal(loc); }
    else { window.location.href = 'index.html#top'; }
  });
  document.getElementById('loc-modal-close')?.addEventListener('click', closeModal);
}

// New in this expansion: waitlist modal for "soon" locations
function openWaitlistModal(loc) {
  openModal(`
    <span class="eyebrow">▸ ${escapeHtml(loc.city)}</span>
    <h3 class="display-m">Get notified.</h3>
    <p class="modal-meta">We'll email you the moment ${escapeHtml(loc.city.split(' · ')[0])} opens.</p>
    <div class="form-row"><label>Email</label><input type="email" id="waitlist-email" placeholder="alex@example.com" /></div>
    <button class="btn btn-primary" id="waitlist-submit" style="width:100%;justify-content:center;margin-top:8px">Add me to the list</button>
  `);
  document.getElementById('waitlist-submit')?.addEventListener('click', () => {
    const email = document.getElementById('waitlist-email')?.value.trim();
    if (!email) { document.getElementById('waitlist-email')?.focus(); return; }
    openModal(`
      <span class="eyebrow">▸ You're on the list</span>
      <h3 class="display-m">See you when ${escapeHtml(loc.city.split(' · ')[0])} opens.</h3>
      <p class="modal-meta">Confirmation sent to ${escapeHtml(email)}.</p>
      <button class="btn btn-primary" id="waitlist-done">Done</button>
    `);
    document.getElementById('waitlist-done')?.addEventListener('click', closeModal);
  });
}

// === BOOKING ===
function initBooking() {
  if (!document.getElementById('check-courts')) return;
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
        dd.innerHTML = BOOKING_OPTIONS[field].map(opt => `<button data-opt="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`).join('');
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

  document.getElementById('check-courts').addEventListener('click', () => {
    const sport    = document.querySelector('[data-bf="sport"] [data-val]').textContent;
    const location = document.querySelector('[data-bf="location"] [data-val]').textContent;
    const date     = document.querySelector('[data-bf="date"] [data-val]').textContent;
    const time     = document.querySelector('[data-bf="time"] [data-val]').textContent;
    openCourtModal({ sport, location, date, time });
  });
}

function openCourtModal({ sport, location, date, time }) {
  const slots = [
    { time, court: 'Court 1', avail: true  }, { time, court: 'Court 2', avail: false }, { time, court: 'Court 3', avail: true  },
    { time, court: 'Court 4', avail: true  }, { time, court: 'Court 5', avail: false }, { time, court: 'Court 6', avail: true  },
    { time, court: 'Court 7', avail: false }, { time, court: 'Court 8', avail: true  }, { time, court: 'Court 9', avail: true  },
  ];
  openModal(`
    <span class="eyebrow">▸ Available courts</span>
    <h3 class="display-m">${escapeHtml(sport)} · ${escapeHtml(location)}</h3>
    <p class="modal-meta">${escapeHtml(date)} at ${escapeHtml(time)}</p>
    <div class="court-grid">
      ${slots.map(s => `
        <button class="court-slot ${s.avail ? 'avail' : 'booked'}" ${s.avail ? `data-court="${escapeHtml(s.court)}"` : 'disabled'}>
          <span class="slot-time">${escapeHtml(s.time)}</span>
          <span class="slot-court">${escapeHtml(s.court)}</span>
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
    <h3 class="display-m">${escapeHtml(sport)} · ${escapeHtml(court)}</h3>
    <p class="modal-meta">${escapeHtml(location)} · ${escapeHtml(date)} at ${escapeHtml(time)}</p>
    <p class="body" style="font-size:13px;margin-bottom:24px">Confirmation sent to your email. See you on the court.</p>
    <button class="btn btn-primary" id="confirm-done">Done</button>
  `);
  document.getElementById('confirm-done')?.addEventListener('click', closeModal);
}

// === PLAY TILES ===
function renderPlay() {
  const grid = document.getElementById('play-grid');
  if (!grid) return;
  grid.innerHTML = SPORTS.map(s => `
    <button class="play-tile" data-sport="${escapeHtml(s.id)}">
      <div class="play-tile-bg" style="background-image:url('${escapeHtml(s.img)}')"></div>
      <div class="num">— ${escapeHtml(s.num)}</div>
      <div>
        <h3>${escapeHtml(s.name)}</h3>
        <div class="read">${escapeHtml(s.read)}</div>
      </div>
    </button>
  `).join('');
  grid.querySelectorAll('.play-tile').forEach(tile => {
    tile.addEventListener('click', () => openSportModal(tile.dataset.sport));
  });
}

function openSportModal(id) {
  const s = SPORTS.find(x => x.id === id);
  if (!s) return;
  openModal(`
    <div class="modal-img" style="background-image:url('${escapeHtml(s.img)}')"></div>
    <span class="eyebrow">▸ ${escapeHtml(s.name)}</span>
    <h3 class="display-m">${escapeHtml(s.name)} at Kotofit</h3>
    <p class="body" style="margin-bottom:24px">${escapeHtml(s.desc)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="sport-modal-primary">Reserve a court →</button>
      <button class="btn btn-ghost" id="sport-modal-close">Close</button>
    </div>
  `);
  document.getElementById('sport-modal-primary')?.addEventListener('click', () => {
    closeModal();
    window.location.href = 'index.html#top';
  });
  document.getElementById('sport-modal-close')?.addEventListener('click', closeModal);
}

// === MEMBERSHIPS ===
function renderMemberships(opts = {}) {
  const grid = document.getElementById('mem-grid');
  if (!grid) return;
  const usefullPerks = opts.full === true;
  grid.innerHTML = TIERS.map(t => {
    const perksList = usefullPerks ? t.fullPerks : t.perks;
    return `
      <div class="mem-card ${t.featured ? 'featured' : ''}">
        <div class="tier">${escapeHtml(t.name)}</div>
        <div class="price">$${t.price}<small>/mo</small></div>
        <ul>${perksList.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
        <button class="mem-cta" data-tier="${escapeHtml(t.id)}">${escapeHtml(t.cta)}</button>
      </div>
    `;
  }).join('');
  grid.querySelectorAll('[data-tier]').forEach(btn => {
    btn.addEventListener('click', () => openJoinModal(btn.dataset.tier));
  });
}

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
        <h3 class="display-m">Where will you play most?</h3>
        <div class="step-pick">${LOCATIONS.filter(l => l.status === 'open').map(l => `<button data-loc="${escapeHtml(l.id)}">${escapeHtml(l.name)} · ${escapeHtml(l.city)}</button>`).join('')}</div>
      `);
      document.querySelectorAll('.step-pick [data-loc]').forEach(b => {
        b.addEventListener('click', () => { chosenLoc = b.dataset.loc; step = 2; render(); });
      });
    } else if (step === 2) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 2 of 3 · Your details</span>
        <h3 class="display-m">Create your account</h3>
        <p class="modal-meta">${escapeHtml(tier.name)} · $${tier.price}/mo</p>
        <div class="form-row"><label>Full name</label><input type="text" id="join-name" placeholder="Alex Player" /></div>
        <div class="form-row"><label>Email</label><input type="email" id="join-email" placeholder="alex@example.com" /></div>
        <div class="form-row"><label>Password</label><input type="password" id="join-pw" placeholder="••••••••" /></div>
        <button class="btn btn-primary" id="join-next" style="width:100%;justify-content:center;margin-top:8px">Continue →</button>
      `);
      document.getElementById('join-next')?.addEventListener('click', () => {
        const name = document.getElementById('join-name')?.value.trim();
        if (!name) { document.getElementById('join-name')?.focus(); return; }
        step = 3; render();
      });
    } else {
      const num = 'KF-MEM-' + Math.floor(1000 + Math.random() * 9000);
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div></div>
        <span class="eyebrow">▸ You're in</span>
        <div class="confirm-num">${num}</div>
        <h3 class="display-m">Welcome to ${escapeHtml(tier.name.split(' · ')[0])}</h3>
        <p class="modal-meta">Confirmation sent. Your member booking window is open.</p>
        <p class="body" style="font-size:13px;margin-bottom:24px">Open the app or come by your home court to get your first session in.</p>
        <button class="btn btn-primary" id="join-done">Done</button>
      `);
      document.getElementById('join-done')?.addEventListener('click', closeModal);
    }
  };
  render();
}

// === COACHING ===
function renderCoachesHomepage() {
  const grid = document.getElementById('coach-grid');
  if (!grid) return;
  const feature = COACHES.find(c => c.feature);
  const others = COACHES.filter(c => !c.feature);
  grid.innerHTML = `
    <div class="coach-feature">
      <div class="coach-bg" style="background-image:url('${escapeHtml(feature.img)}')"></div>
      <div>
        <div class="role">${escapeHtml(feature.role)}</div>
        <div class="name">${escapeHtml(feature.name)}</div>
        <p class="desc">${escapeHtml(feature.desc)}</p>
      </div>
    </div>
    <div class="coach-side">
      ${others.slice(0, 2).map(c => `
        <div class="coach-mini">
          <div class="coach-bg" style="background-image:url('${escapeHtml(c.img)}')"></div>
          <div>
            <div class="role">${escapeHtml(c.role)}</div>
            <div class="name">${escapeHtml(c.name)}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="coach-side">
      ${others.slice(2, 4).map(c => `
        <div class="coach-mini">
          <div class="coach-bg" style="background-image:url('${escapeHtml(c.img)}')"></div>
          <div>
            <div class="role">${escapeHtml(c.role)}</div>
            <div class="name">${escapeHtml(c.name)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// === EVENTS (homepage — shows 4) ===
function renderEventsHomepage() {
  const list = document.getElementById('events-list');
  if (!list) return;
  list.innerHTML = EVENTS.slice(0, 4).map(e => `
    <div class="event-row">
      <div class="date"><div class="day">${escapeHtml(e.day)}</div><div class="mo">${escapeHtml(e.mo)}</div></div>
      <div class="info"><div class="name">${escapeHtml(e.name)}</div><div class="meta">${escapeHtml(e.meta)}</div></div>
      <button class="rsvp" data-event="${escapeHtml(e.id)}">RSVP</button>
    </div>
  `).join('');
  list.querySelectorAll('[data-event]').forEach(btn => {
    btn.addEventListener('click', () => openRsvpModal(btn.dataset.event));
  });
}

function openRsvpModal(id) {
  const ev = EVENTS.find(e => e.id === id);
  if (!ev) return;
  openModal(`
    <span class="eyebrow">▸ You're in</span>
    <h3 class="display-m">${escapeHtml(ev.name)}</h3>
    <p class="modal-meta">${escapeHtml(ev.day)} ${escapeHtml(ev.mo)} · ${escapeHtml(ev.meta)}</p>
    <p class="body" style="font-size:13px;margin-bottom:24px">A confirmation has been sent to your inbox. Add it to your calendar so you don't forget.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="rsvp-done">Got it</button>
      <button class="btn btn-ghost" id="rsvp-cal">Add to calendar</button>
    </div>
  `);
  document.getElementById('rsvp-done')?.addEventListener('click', closeModal);
  document.getElementById('rsvp-cal')?.addEventListener('click', closeModal);
}

// === STRINGING ===
function initStringing() {
  document.getElementById('stringing-cta')?.addEventListener('click', openStringingModal);
}

function openStringingModal() {
  let step = 1;
  const chosen = { string: null, tension: null, location: null };
  const render = () => {
    if (step === 1) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 1 of 4 · Pick a string</span>
        <h3 class="display-m">Which string?</h3>
        <div class="step-pick">${STRINGS.map(s => `<button data-string="${escapeHtml(s.id)}"><div style="font-weight:700">${escapeHtml(s.name)}</div><div style="font-size:11px;color:var(--mute);margin-top:2px">${escapeHtml(s.desc)} · $${s.price}</div></button>`).join('')}</div>
      `);
      document.querySelectorAll('[data-string]').forEach(b => b.addEventListener('click', () => { chosen.string = b.dataset.string; step = 2; render(); }));
    } else if (step === 2) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 2 of 4 · Tension</span>
        <h3 class="display-m">String tension</h3>
        <div class="step-pick">${TENSIONS.map(t => `<button data-tension="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}</div>
      `);
      document.querySelectorAll('[data-tension]').forEach(b => b.addEventListener('click', () => { chosen.tension = b.dataset.tension; step = 3; render(); }));
    } else if (step === 3) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 3 of 4 · Drop-off location</span>
        <h3 class="display-m">Where will you drop it off?</h3>
        <div class="step-pick">${LOCATIONS.filter(l => l.status === 'open').map(l => `<button data-loc="${escapeHtml(l.id)}">${escapeHtml(l.name)} · ${escapeHtml(l.city)}</button>`).join('')}</div>
      `);
      document.querySelectorAll('.step-pick [data-loc]').forEach(b => b.addEventListener('click', () => { chosen.location = b.dataset.loc; step = 4; render(); }));
    } else {
      const num = 'KF-STR-' + Math.floor(1000 + Math.random() * 9000);
      const stringObj = STRINGS.find(s => s.id === chosen.string);
      const locObj = LOCATIONS.find(l => l.id === chosen.location);
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div></div>
        <span class="eyebrow">▸ Order placed</span>
        <div class="confirm-num">${num}</div>
        <h3 class="display-m">${escapeHtml(stringObj.name)} · ${escapeHtml(chosen.tension.split(' · ')[0])}</h3>
        <p class="modal-meta">Drop off at ${escapeHtml(locObj.name)} · We'll text you in 24 hours.</p>
        <p class="body" style="font-size:13px;margin-bottom:24px">Bring your racquet to the front desk. Show this number.</p>
        <button class="btn btn-primary" id="stringing-done">Done</button>
      `);
      document.getElementById('stringing-done')?.addEventListener('click', closeModal);
    }
  };
  render();
}

// === MOBILE MENU ===
function initMobileMenu() {
  const burger = document.querySelector('.nav-burger');
  const mm = document.getElementById('mobile-menu');
  const mmClose = document.getElementById('mm-close');
  if (!mm) return;
  const openMm = () => { mm.classList.add('open'); mm.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const closeMm = () => { mm.classList.remove('open'); mm.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  burger?.addEventListener('click', openMm);
  mmClose?.addEventListener('click', closeMm);
  mm.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMm));
}

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

// === HERO LOAD ===
function initHero() {
  requestAnimationFrame(() => {
    document.querySelector('.hero')?.classList.add('loaded');
  });
}

// === ACTIVE NAV HIGHLIGHT ===
function initNavHighlight() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('.nav-links a, .mobile-menu nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === `${page}.html` || (page === 'home' && (href === 'index.html' || href === '/'))) {
      a.setAttribute('aria-current', 'page');
    }
  });
}

// === PAGE INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initNavHighlight();
  initMobileMenu();
  renderLocations();
  initBooking();
  renderPlay();
  renderMemberships();
  renderCoachesHomepage();
  renderEventsHomepage();
  initStringing();
  initScrollReveal();
  // Page-specific renderers (no-ops if their target elements don't exist):
  if (typeof renderLocationsPage === 'function') renderLocationsPage();
  if (typeof renderMembershipsPage === 'function') renderMembershipsPage();
  if (typeof renderCoachingPage === 'function') renderCoachingPage();
  if (typeof renderEventsPage === 'function') renderEventsPage();
  if (typeof renderStringingPage === 'function') renderStringingPage();
});
```

The page-specific renderers (`renderLocationsPage`, etc.) are added later in this plan as their pages are built. The `typeof X === 'function'` guards make it safe for them to not exist yet.

- [ ] **Step 2: Replace the `<script>` block in `index.html`**

In `index.html`, find the inline `<script>` block (it currently contains `BOOKING_OPTIONS`, `escapeHtml`, all the functions, etc.). Replace the entire block with:

```html
  <script src="assets/data.js"></script>
  <script src="assets/app.js"></script>
```

(If Step 3 of Task 2 already added the `<script src="assets/data.js"></script>` line, just keep that one and add `<script src="assets/app.js"></script>` immediately after, then delete the inline `<script>...</script>` block entirely.)

- [ ] **Step 3: Verify in browser**

Reload `index.html`. Smoke-test every flow:
- Hero booking widget: click each field, pick options, click "Check courts →", click an available slot, see confirmation
- Location card click → modal with "Reserve here →"
- Sport tile click → modal with "Reserve a court →"
- Membership tier click → 3-step join flow
- Event RSVP click → confirmation modal
- Stringing CTA → 4-step flow
- Mobile menu toggle (resize browser to <768px)
- Scroll reveal on sections

Open dev tools console — should see no errors.

- [ ] **Step 4: Commit**

```bash
git add assets/app.js index.html
git commit -m "refactor(homepage): extract JS to assets/app.js, scope renderers"
```

---

## Task 4: Add shared "Ready to play?" strip + active-nav highlight CSS

**Files:**
- Modify: `assets/styles.css`

- [ ] **Step 1: Append shared cross-page rules**

Open `assets/styles.css` and append the following at the bottom (after the existing scroll-reveal motion block):

```css
    /* === ACTIVE NAV HIGHLIGHT === */
    .nav-links a[aria-current="page"], .mobile-menu nav a[aria-current="page"] { color: var(--bone); position: relative; }
    .nav-links a[aria-current="page"]::after { content: ''; position: absolute; left: 0; right: 0; bottom: -22px; height: 2px; background: var(--cobalt); }

    /* === PAGE HERO (used by sub-pages, smaller than the homepage hero) === */
    .page-hero { position: relative; overflow: hidden; padding: clamp(64px, 9vw, 120px) 0 clamp(48px, 6vw, 80px); border-top: 0; min-height: 280px; display: flex; align-items: center; }
    .page-hero::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,10,0) 0%, var(--ink) 100%), radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.18), transparent 70%); z-index: 0; }
    .page-hero .container { position: relative; z-index: 1; text-align: center; }
    .page-hero h1 { margin: 14px auto 16px; max-width: 18ch; }
    .page-hero p.lede { font-size: clamp(15px, 1.4vw, 18px); color: var(--mute); max-width: 640px; margin: 0 auto; line-height: 1.55; }

    /* === READY TO PLAY STRIP (above footer on every sub-page) === */
    .ready-strip { background: var(--surface); border-top: 1px solid var(--elevated); border-bottom: 1px solid var(--elevated); padding: 36px 0; }
    .ready-strip .inner { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
    .ready-strip h3 { font-size: clamp(20px, 2.4vw, 28px); font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .ready-strip h3 em { font-style: normal; color: var(--cobalt); }
    .ready-strip .ready-meta { color: var(--mute); font-size: 13px; }

    /* === FILTER CHIPS (used by locations + events) === */
    .filter-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; align-items: center; }
    .filter-chips .chip-group { display: inline-flex; gap: 4px; padding: 4px; background: var(--surface); border: 1px solid var(--elevated); border-radius: 999px; }
    .filter-chips .chip { padding: 8px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mute); cursor: pointer; border-radius: 999px; transition: all 150ms; }
    .filter-chips .chip:hover { color: var(--bone); }
    .filter-chips .chip.active { background: var(--cobalt); color: var(--bone); }
    .filter-chips .chip-label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mute); margin-right: 6px; }

    /* === FAQ ACCORDION === */
    .faq { display: flex; flex-direction: column; }
    .faq-row { border-bottom: 1px solid var(--elevated); }
    .faq-row:first-child { border-top: 1px solid var(--elevated); }
    .faq-q { width: 100%; padding: 22px 0; display: flex; justify-content: space-between; align-items: center; gap: 16px; font-size: 16px; font-weight: 700; color: var(--bone); cursor: pointer; text-align: left; transition: color 150ms; }
    .faq-q:hover { color: var(--cobalt); }
    .faq-q .icon { font-size: 18px; color: var(--cobalt); transition: transform 200ms; flex: 0 0 auto; }
    .faq-row.open .faq-q .icon { transform: rotate(45deg); }
    .faq-a { display: none; padding: 0 0 22px; color: var(--mute); font-size: 14px; line-height: 1.6; max-width: 720px; }
    .faq-row.open .faq-a { display: block; }

    /* === LOCATIONS PAGE — expanded card === */
    .loc-grid-page { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media (min-width: 1100px) { .loc-grid-page { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 640px)  { .loc-grid-page { grid-template-columns: 1fr; } }
    .loc-card-page { background: var(--surface); border: 1px solid var(--elevated); display: flex; flex-direction: column; transition: transform 200ms var(--ease-out), border-color 200ms; }
    .loc-card-page:hover { transform: translateY(-4px); border-color: var(--cobalt); }
    .loc-card-page .img { aspect-ratio: 16/10; background-size: cover; background-position: center; position: relative; }
    .loc-card-page .img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(10,10,10,0.7) 100%); pointer-events: none; }
    .loc-card-page .img .badge { position: absolute; top: 14px; left: 14px; z-index: 1; background: var(--cobalt); padding: 5px 10px; font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bone); }
    .loc-card-page .img .badge.soon { background: var(--bone); color: var(--ink); }
    .loc-card-page .body { padding: 22px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
    .loc-card-page .city { font-size: 10px; color: var(--mute); text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; }
    .loc-card-page .name { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .loc-card-page .addr { font-size: 13px; color: var(--mute); line-height: 1.5; }
    .loc-card-page .meta { font-size: 12px; color: var(--mute); display: flex; gap: 14px; flex-wrap: wrap; }
    .loc-card-page .meta strong { color: var(--bone); }
    .loc-card-page .tags { display: flex; flex-wrap: wrap; gap: 4px; }
    .loc-card-page .tag-chip { font-size: 9px; padding: 3px 8px; background: var(--elevated); color: var(--bone); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; }
    .loc-card-page .actions { margin-top: auto; display: flex; gap: 8px; padding-top: 6px; }
    .loc-card-page .actions .btn { padding: 11px 16px; font-size: 11px; }

    /* === MEMBERSHIPS PAGE — comparison table === */
    .mem-table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    .mem-table th, .mem-table td { padding: 16px; text-align: left; border-bottom: 1px solid var(--elevated); font-size: 13px; }
    .mem-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--mute); font-weight: 700; }
    .mem-table th.col-tier { text-align: center; color: var(--bone); font-size: 12px; }
    .mem-table th.col-tier.featured { color: var(--cobalt); }
    .mem-table td.cell-yes { text-align: center; color: var(--cobalt); font-weight: 800; }
    .mem-table td.cell-no { text-align: center; color: var(--mute); }
    .mem-table td.cell-val { text-align: center; font-weight: 700; color: var(--bone); }
    .mem-table tr:hover td { background: var(--surface); }

    /* === COACHING PAGE === */
    .programs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 900px) { .programs-grid { grid-template-columns: 1fr; } }
    .program-card { background: var(--surface); border: 1px solid var(--elevated); overflow: hidden; display: flex; flex-direction: column; transition: transform 200ms, border-color 200ms; }
    .program-card:hover { transform: translateY(-4px); border-color: var(--cobalt); }
    .program-card .img { aspect-ratio: 16/10; background-size: cover; background-position: center; }
    .program-card .body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .program-card .name { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .program-card .desc { color: var(--mute); font-size: 14px; line-height: 1.55; }
    .program-card .price { font-size: 11px; color: var(--cobalt); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; }
    .program-card .cta { margin-top: auto; padding-top: 12px; }

    .coaches-roster { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media (max-width: 720px) { .coaches-roster { grid-template-columns: 1fr; } }
    .coach-row { display: grid; grid-template-columns: 140px 1fr; gap: 18px; padding: 18px; background: var(--surface); border: 1px solid var(--elevated); align-items: center; }
    .coach-row .img { width: 140px; height: 140px; background-size: cover; background-position: center; flex: 0 0 140px; }
    .coach-row .info .role { font-size: 10px; color: var(--cobalt); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; }
    .coach-row .info .name { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 4px 0 8px; }
    .coach-row .info .desc { font-size: 13px; color: var(--mute); line-height: 1.5; margin: 0 0 10px; }
    .coach-row .info .specialty { font-size: 12px; color: var(--bone); margin-bottom: 4px; }
    .coach-row .info .rate { font-size: 12px; color: var(--mute); margin-bottom: 12px; }
    .coach-row .info .rate strong { color: var(--cobalt); font-weight: 800; }
    .coach-row .info .book { font-size: 10px; padding: 8px 12px; }

    .clinics-list { display: flex; flex-direction: column; }
    .clinic-row { display: grid; grid-template-columns: 80px 1fr auto auto; gap: 20px; padding: 20px 0; border-bottom: 1px solid var(--elevated); align-items: center; }
    .clinic-row:first-child { border-top: 1px solid var(--elevated); }
    .clinic-row .date { text-align: center; }
    .clinic-row .date .day { font-size: 28px; font-weight: 900; line-height: 1; letter-spacing: -0.02em; }
    .clinic-row .date .mo { font-size: 10px; color: var(--cobalt); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
    .clinic-row .info .name { font-size: 16px; font-weight: 700; color: var(--bone); }
    .clinic-row .info .meta { font-size: 11px; color: var(--mute); margin-top: 4px; }
    .clinic-row .spots { font-size: 11px; color: var(--mute); font-weight: 700; }
    .clinic-row .spots strong { color: var(--cobalt); }
    .clinic-row .rsvp { padding: 8px 14px; border: 1px solid var(--bone); font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bone); cursor: pointer; transition: all 150ms; background: transparent; }
    .clinic-row .rsvp:hover { background: var(--bone); color: var(--ink); }
    @media (max-width: 640px) { .clinic-row { grid-template-columns: 60px 1fr; gap: 16px; } .clinic-row .spots, .clinic-row .rsvp { grid-column: 2; } }

    /* === EVENTS PAGE === */
    .events-results-meta { font-size: 12px; color: var(--mute); margin: 12px 0 24px; letter-spacing: 0.05em; }

    /* === STRINGING PAGE === */
    .process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 768px) { .process-grid { grid-template-columns: 1fr; } }
    .process-card { background: var(--surface); border: 1px solid var(--elevated); padding: 28px; }
    .process-card .num { font-size: 56px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: var(--cobalt); margin-bottom: 16px; }
    .process-card h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
    .process-card p { color: var(--mute); font-size: 14px; line-height: 1.55; margin: 0; }

    .strings-catalog { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 900px) { .strings-catalog { grid-template-columns: 1fr; } }
    .string-card { background: var(--surface); border: 1px solid var(--elevated); padding: 28px; cursor: pointer; transition: transform 200ms, border-color 200ms; text-align: left; display: flex; flex-direction: column; gap: 14px; }
    .string-card:hover { transform: translateY(-4px); border-color: var(--cobalt); }
    .string-card .name { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .string-card .gauge { font-size: 11px; color: var(--cobalt); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; }
    .string-card .desc { color: var(--mute); font-size: 13px; line-height: 1.55; margin: 0; }
    .string-card .ratings { display: flex; flex-direction: column; gap: 6px; }
    .string-card .rating-row { display: grid; grid-template-columns: 80px 1fr; gap: 12px; align-items: center; font-size: 11px; }
    .string-card .rating-row .rlabel { color: var(--mute); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; }
    .string-card .rating-row .dots { display: flex; gap: 3px; }
    .string-card .rating-row .dots .dot { width: 8px; height: 8px; background: var(--elevated); border-radius: 50%; }
    .string-card .rating-row .dots .dot.on { background: var(--cobalt); }
    .string-card .price { font-size: 24px; font-weight: 900; letter-spacing: -0.02em; margin-top: auto; }
    .string-card .price small { font-size: 13px; color: var(--mute); font-weight: 600; }

    .tension-guide { padding: 32px; background: var(--surface); border: 1px solid var(--elevated); }
    .tension-bar { position: relative; height: 6px; background: linear-gradient(90deg, #1e3a8a 0%, var(--cobalt) 100%); margin: 28px 0 16px; border-radius: 999px; }
    .tension-marks { display: grid; grid-template-columns: repeat(4, 1fr); }
    .tension-mark { text-align: center; }
    .tension-mark .lbs { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; color: var(--bone); }
    .tension-mark.recommended .lbs { color: var(--cobalt); }
    .tension-mark .feel { font-size: 10px; color: var(--mute); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; margin-top: 4px; }

    /* === SECTION TITLE-ONLY (sub-pages reuse this without the right-side desc) === */
    .section-title { margin-bottom: 28px; }
    .section-title .e { font-size: 11px; color: var(--cobalt); font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }
    .section-title h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin: 8px 0 0; }
```

- [ ] **Step 2: Verify**

Reload `index.html`. Expected: still renders identically — these new rules don't apply to anything on the homepage, so it should look unchanged. Test the active-nav highlight does not yet appear on the homepage (we'll set `data-page="home"` on `index.html` in Task 5).

- [ ] **Step 3: Commit**

```bash
git add assets/styles.css
git commit -m "feat(shared): add cross-page styles for sub-pages and shared components"
```

---

## Task 5: Build `locations.html`

**Files:**
- Create: `locations.html`
- Modify: `assets/app.js` — append `renderLocationsPage` function

- [ ] **Step 1: Create `locations.html`**

Create `locations.html` at the project root with this exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Locations — Kotofit</title>
  <meta name="description" content="Four Kotofit locations across NJ and NY today, with Brooklyn and Queens opening this season." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body data-page="locations">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">KOTOFIT</a>
      <ul class="nav-links">
        <li><a href="locations.html">Locations</a></li>
        <li><a href="memberships.html">Memberships</a></li>
        <li><a href="coaching.html">Coaching</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="stringing.html">Stringing</a></li>
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
    </nav>
    <a href="index.html#top" class="mm-cta">Reserve a court →</a>
  </div>

  <main>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">▸ Four open. Two coming.</span>
        <h1 class="display-l">Find your court.</h1>
        <p class="lede">Four Kotofit locations across NJ and NY today. Brooklyn and Queens land this season.</p>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="filter-chips" id="loc-filter-chips">
          <span class="chip-label">Sport</span>
          <div class="chip-group">
            <button class="chip active" data-filter="sport" data-value="all">All</button>
            <button class="chip" data-filter="sport" data-value="badminton">Badminton</button>
            <button class="chip" data-filter="sport" data-value="pickleball">Pickleball</button>
            <button class="chip" data-filter="sport" data-value="pingpong">Ping Pong</button>
          </div>
          <span class="chip-label" style="margin-left:14px">Service</span>
          <div class="chip-group">
            <button class="chip active" data-filter="service" data-value="all">All</button>
            <button class="chip" data-filter="service" data-value="coaching">Coaching</button>
            <button class="chip" data-filter="service" data-value="stringing">Stringing</button>
            <button class="chip" data-filter="service" data-value="events">Events</button>
          </div>
        </div>
        <div class="loc-grid-page" id="loc-grid-page"></div>
      </div>
    </section>
  </main>

  <section class="ready-strip">
    <div class="container inner">
      <div>
        <h3>Ready to <em>play?</em></h3>
        <div class="ready-meta">Court reservations take 30 seconds. We'll have a court waiting.</div>
      </div>
      <a href="index.html#top" class="btn btn-primary">Reserve a court →</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <div class="logo">KOTOFIT</div>
          <p>America's home for badminton, pickleball, and indoor sports. Four locations across NJ and NY, growing.</p>
        </div>
        <div>
          <h4>Play</h4>
          <ul>
            <li><a href="locations.html">Locations</a></li>
            <li><a href="index.html#top">Reserve</a></li>
            <li><a href="memberships.html">Memberships</a></li>
            <li><a href="stringing.html">Stringing</a></li>
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

  <script src="assets/data.js"></script>
  <script src="assets/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Append `renderLocationsPage` to `assets/app.js`**

Open `assets/app.js`. Find the comment `// === ACTIVE NAV HIGHLIGHT ===` (or any predictable anchor near the bottom). Immediately BEFORE the `// === PAGE INIT ===` comment, append:

```javascript
// === LOCATIONS PAGE ===
function renderLocationsPage() {
  const grid = document.getElementById('loc-grid-page');
  if (!grid) return;

  const filters = { sport: 'all', service: 'all' };

  const matchesFilters = (loc) => {
    if (loc.status === 'soon') return filters.sport === 'all' && filters.service === 'all';
    if (filters.sport !== 'all' && !loc.sports.includes(filters.sport)) return false;
    if (filters.service !== 'all' && !loc.services.includes(filters.service)) return false;
    return true;
  };

  const render = () => {
    const visible = LOCATIONS.filter(matchesFilters);
    grid.innerHTML = visible.map(loc => {
      const isSoon = loc.status === 'soon';
      const sportTags = loc.sports.map(s => {
        const sport = SPORTS.find(x => x.id === s);
        return sport ? `<span class="tag-chip">${escapeHtml(sport.name)}</span>` : '';
      }).join('');
      const serviceTags = loc.services.map(s => `<span class="tag-chip">${escapeHtml(s.charAt(0).toUpperCase() + s.slice(1))}</span>`).join('');
      return `
        <article class="loc-card-page" data-loc-id="${escapeHtml(loc.id)}">
          <div class="img" style="background-image:url('${escapeHtml(loc.img)}')">
            <span class="badge ${isSoon ? 'soon' : ''}">${isSoon ? 'Coming this season' : 'Open'}</span>
          </div>
          <div class="body">
            <div class="city">${escapeHtml(loc.city)}</div>
            <h3 class="name">${escapeHtml(loc.name)}</h3>
            <div class="addr">${escapeHtml(loc.address)}</div>
            ${isSoon ? '' : `<div class="meta"><span><strong>${escapeHtml(loc.courts)}</strong> courts</span><span>${escapeHtml(loc.hours)}</span></div>`}
            ${isSoon ? '' : `<div class="tags">${sportTags}${serviceTags}</div>`}
            <div class="actions">
              ${isSoon
                ? `<button class="btn btn-primary" data-action="notify" data-loc-id="${escapeHtml(loc.id)}">Get notified →</button>`
                : `<a class="btn btn-primary" href="index.html#top">Reserve here →</a>
                   <button class="btn btn-ghost" data-action="details" data-loc-id="${escapeHtml(loc.id)}">Details</button>`
              }
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Wire actions
    grid.querySelectorAll('[data-action="notify"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const loc = LOCATIONS.find(l => l.id === btn.dataset.locId);
        if (loc) openWaitlistModal(loc);
      });
    });
    grid.querySelectorAll('[data-action="details"]').forEach(btn => {
      btn.addEventListener('click', () => openLocationModal(btn.dataset.locId));
    });

    document.querySelector('[data-results-count]')?.replaceChildren(document.createTextNode(`${visible.length} location${visible.length === 1 ? '' : 's'}`));
  };

  // Wire filter chips
  const chipsEl = document.getElementById('loc-filter-chips');
  if (chipsEl) {
    chipsEl.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const dim = chip.dataset.filter;
        chipsEl.querySelectorAll(`.chip[data-filter="${dim}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filters[dim] = chip.dataset.value;
        render();
      });
    });
  }

  render();
}
```

- [ ] **Step 3: Verify in browser**

Open `locations.html`. Expected:
- Sticky nav with "LOCATIONS" highlighted (Cobalt underline)
- Page hero with eyebrow + headline + lede
- Filter chip rows for Sport and Service, each with "All" active
- Grid of 6 location cards: 4 open + 2 soon. Each shows photo, badge, city, name, address, court count + hours, sport + service tags, "Reserve here →" + "Details" buttons (open) or "Get notified →" (soon)
- Click a sport chip (e.g., "Pickleball") → grid filters to only locations with pickleball; badge "Coming this season" hides from soon cards because they have no sports listed
- Click "All" → grid restores
- Click "Get notified →" on a soon card → waitlist modal opens, type email, submit → confirmation
- Click "Details" on an open card → location modal with "Reserve here →" button
- "Reserve Court →" in nav navigates to `index.html#top`
- Footer renders, "Ready to play?" strip renders
- Mobile burger toggles overlay menu

- [ ] **Step 4: Commit**

```bash
git add locations.html assets/app.js
git commit -m "feat(locations): build locations.html with filter chips and waitlist"
```

---

## Task 6: Build `memberships.html`

**Files:**
- Create: `memberships.html`
- Modify: `assets/app.js` — append `renderMembershipsPage` function

- [ ] **Step 1: Create `memberships.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Memberships — Kotofit</title>
  <meta name="description" content="Three Kotofit membership tiers — Drop-in, Go Koto, and All-Access. Play more, pay less." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body data-page="memberships">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">KOTOFIT</a>
      <ul class="nav-links">
        <li><a href="locations.html">Locations</a></li>
        <li><a href="memberships.html">Memberships</a></li>
        <li><a href="coaching.html">Coaching</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="stringing.html">Stringing</a></li>
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
    </nav>
    <a href="index.html#top" class="mm-cta">Reserve a court →</a>
  </div>

  <main>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">▸ Member perks</span>
        <h1 class="display-l">Play more. Pay less.</h1>
        <p class="lede">Early booking windows, free events, member-only clinics, racquet stringing discounts, and a community that shows up. Pick the tier that fits how often you play.</p>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="mem-grid" id="mem-grid"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Compare side by side</div>
          <h2>What's included.</h2>
        </div>
        <table class="mem-table">
          <thead>
            <tr>
              <th>Perk</th>
              <th class="col-tier">Drop-in</th>
              <th class="col-tier featured">Go Koto</th>
              <th class="col-tier">All-Access</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Booking window</td><td class="cell-val">48 hr</td><td class="cell-val">72 hr</td><td class="cell-val">14 days</td></tr>
            <tr><td>Court rate per hour</td><td class="cell-val">$20–30</td><td class="cell-val">$15</td><td class="cell-val">$10</td></tr>
            <tr><td>Free monthly events</td><td class="cell-no">—</td><td class="cell-yes">✓</td><td class="cell-yes">✓</td></tr>
            <tr><td>Clinics included</td><td class="cell-no">—</td><td class="cell-no">10% off</td><td class="cell-yes">All included</td></tr>
            <tr><td>Free stringing</td><td class="cell-no">—</td><td class="cell-no">10% off</td><td class="cell-val">2/mo</td></tr>
            <tr><td>Guest passes</td><td class="cell-no">—</td><td class="cell-val">2/mo</td><td class="cell-yes">Unlimited</td></tr>
            <tr><td>Membership freeze</td><td class="cell-no">—</td><td class="cell-yes">3 mo/yr</td><td class="cell-yes">3 mo/yr</td></tr>
            <tr><td>Family add-on</td><td class="cell-no">—</td><td class="cell-no">—</td><td class="cell-val">50% off</td></tr>
            <tr><td>Personal locker</td><td class="cell-no">—</td><td class="cell-no">—</td><td class="cell-yes">✓</td></tr>
            <tr><td>Priority on tournaments</td><td class="cell-no">—</td><td class="cell-no">—</td><td class="cell-yes">✓</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Frequently asked</div>
          <h2>Common questions.</h2>
        </div>
        <div class="faq" id="faq-memberships"></div>
      </div>
    </section>

    <section>
      <div class="container" style="text-align:center">
        <span class="eyebrow">▸ Ready to belong?</span>
        <h2 class="display-l" style="max-width:18ch;margin:14px auto">Join the home court.</h2>
        <p class="lede" style="margin:0 auto 28px">Most popular tier: Go Koto. $49/mo, 72-hour early booking, free monthly events.</p>
        <button class="btn btn-primary" id="join-cta">Become a member →</button>
      </div>
    </section>
  </main>

  <section class="ready-strip">
    <div class="container inner">
      <div>
        <h3>Want to test the courts <em>first?</em></h3>
        <div class="ready-meta">Drop in tonight — no membership required.</div>
      </div>
      <a href="index.html#top" class="btn btn-primary">Reserve a court →</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <div class="logo">KOTOFIT</div>
          <p>America's home for badminton, pickleball, and indoor sports. Four locations across NJ and NY, growing.</p>
        </div>
        <div><h4>Play</h4><ul><li><a href="locations.html">Locations</a></li><li><a href="index.html#top">Reserve</a></li><li><a href="memberships.html">Memberships</a></li><li><a href="stringing.html">Stringing</a></li></ul></div>
        <div><h4>Learn</h4><ul><li><a href="coaching.html">Coaching</a></li><li><a href="coaching.html">Clinics</a></li><li><a href="coaching.html">Youth</a></li><li><a href="events.html">Events</a></li></ul></div>
        <div><h4>Connect</h4><ul><li><a href="#">WhatsApp</a></li><li><a href="#">Instagram</a></li><li><a href="#">WeChat</a></li><li><a href="#">Contact</a></li></ul></div>
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

- [ ] **Step 2: Append `renderMembershipsPage` and shared `renderFaq` helper to `assets/app.js`**

Append BEFORE the `// === PAGE INIT ===` block:

```javascript
// === FAQ ACCORDION (shared by memberships, coaching, stringing) ===
function renderFaq(elementId, items) {
  const el = document.getElementById(elementId);
  if (!el || !Array.isArray(items)) return;
  el.innerHTML = items.map((it, i) => `
    <div class="faq-row" data-faq-i="${i}">
      <button class="faq-q"><span>${escapeHtml(it.q)}</span><span class="icon">+</span></button>
      <div class="faq-a">${escapeHtml(it.a)}</div>
    </div>
  `).join('');
  el.querySelectorAll('.faq-row').forEach(row => {
    row.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = row.classList.contains('open');
      el.querySelectorAll('.faq-row.open').forEach(r => r.classList.remove('open'));
      if (!wasOpen) row.classList.add('open');
    });
  });
}

// === MEMBERSHIPS PAGE ===
function renderMembershipsPage() {
  const grid = document.getElementById('mem-grid');
  // The shared renderMemberships() already targets #mem-grid; we just need the
  // full perks list here, plus the FAQ and the bottom CTA.
  if (grid) renderMemberships({ full: true });
  renderFaq('faq-memberships', FAQS.memberships);
  document.getElementById('join-cta')?.addEventListener('click', () => openJoinModal('go-koto'));
}
```

Note: this means on the homepage, `renderMemberships()` runs with `full: false` (short perk list); on memberships.html, `renderMembershipsPage()` re-runs `renderMemberships({ full: true })` AFTER it, overriding with the long list. The page-init order in Task 3 calls `renderMemberships()` (no opts) first, then `renderMembershipsPage()`, so the second call wins. Verify the long perk list shows on memberships.html in step 3.

- [ ] **Step 3: Verify in browser**

Open `memberships.html`. Expected:
- Nav with "MEMBERSHIPS" highlighted
- Page hero with eyebrow + headline + lede
- Three tier cards with the FULL perk list (5–8 bullets each)
- Comparison table with 10 perk rows, Go Koto column accented in Cobalt
- FAQ accordion with 6 rows; click one → expands; click another → previous closes, this one opens
- Bottom CTA ("Become a member →") opens the 3-step join modal pre-filled to Go Koto
- Ready-to-play strip + footer
- "Reserve Court" in nav goes to `index.html#top`

- [ ] **Step 4: Commit**

```bash
git add memberships.html assets/app.js
git commit -m "feat(memberships): build memberships page with comparison table and FAQ"
```

---

## Task 7: Build `coaching.html`

**Files:**
- Create: `coaching.html`
- Modify: `assets/app.js` — append `renderCoachingPage`, `openProgramModal`

- [ ] **Step 1: Create `coaching.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Coaching — Kotofit</title>
  <meta name="description" content="Group clinics, private lessons, and youth programs led by national-level coaches." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body data-page="coaching">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">KOTOFIT</a>
      <ul class="nav-links">
        <li><a href="locations.html">Locations</a></li>
        <li><a href="memberships.html">Memberships</a></li>
        <li><a href="coaching.html">Coaching</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="stringing.html">Stringing</a></li>
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
    </nav>
    <a href="index.html#top" class="mm-cta">Reserve a court →</a>
  </div>

  <main>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">▸ Learn from champions</span>
        <h1 class="display-l">Coach with us.</h1>
        <p class="lede">Group clinics, private lessons, and a year-round junior academy — led by national-level coaches across all four Kotofit locations.</p>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Programs</div>
          <h2>Pick how you want to learn.</h2>
        </div>
        <div class="programs-grid" id="programs-grid"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Meet the coaches</div>
          <h2>The roster.</h2>
        </div>
        <div class="coaches-roster" id="coaches-roster"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Upcoming clinics</div>
          <h2>What's on the calendar.</h2>
        </div>
        <div class="clinics-list" id="clinics-list"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Frequently asked</div>
          <h2>Common questions.</h2>
        </div>
        <div class="faq" id="faq-coaching"></div>
      </div>
    </section>
  </main>

  <section class="ready-strip">
    <div class="container inner">
      <div>
        <h3>Ready to <em>level up?</em></h3>
        <div class="ready-meta">Book a private with any coach above, or jump into a clinic this week.</div>
      </div>
      <a href="index.html#top" class="btn btn-primary">Reserve a court →</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <div class="logo">KOTOFIT</div>
          <p>America's home for badminton, pickleball, and indoor sports. Four locations across NJ and NY, growing.</p>
        </div>
        <div><h4>Play</h4><ul><li><a href="locations.html">Locations</a></li><li><a href="index.html#top">Reserve</a></li><li><a href="memberships.html">Memberships</a></li><li><a href="stringing.html">Stringing</a></li></ul></div>
        <div><h4>Learn</h4><ul><li><a href="coaching.html">Coaching</a></li><li><a href="coaching.html">Clinics</a></li><li><a href="coaching.html">Youth</a></li><li><a href="events.html">Events</a></li></ul></div>
        <div><h4>Connect</h4><ul><li><a href="#">WhatsApp</a></li><li><a href="#">Instagram</a></li><li><a href="#">WeChat</a></li><li><a href="#">Contact</a></li></ul></div>
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

- [ ] **Step 2: Append `renderCoachingPage` and modal helpers to `assets/app.js`**

Append BEFORE the `// === PAGE INIT ===` block:

```javascript
// === COACHING PAGE ===
const CLINICS_SAMPLE = [
  { id: 'cl1', day: '03', mo: 'May', name: 'Beginner Badminton Fundamentals', coach: 'Wei Chen',    location: 'Brunswick',    sport: 'badminton',  level: 'Beginner',     spots: 4 },
  { id: 'cl2', day: '07', mo: 'May', name: 'Intermediate Pickleball Drills',  coach: 'Maria Lopez', location: '3rd Street',   sport: 'pickleball', level: 'Intermediate', spots: 2 },
  { id: 'cl3', day: '10', mo: 'May', name: 'Doubles Strategy Workshop',       coach: 'Aisha Khan',  location: 'LIC',          sport: 'badminton',  level: 'Advanced',     spots: 6 },
  { id: 'cl4', day: '14', mo: 'May', name: 'Junior Foundations',              coach: 'Jordan Park', location: 'Brunswick',    sport: 'badminton',  level: 'Beginner',     spots: 8 },
  { id: 'cl5', day: '17', mo: 'May', name: 'Pickleball Skills Lab',           coach: 'Maria Lopez', location: 'LIC',          sport: 'pickleball', level: 'Intermediate', spots: 3 },
  { id: 'cl6', day: '21', mo: 'May', name: 'Match-Prep Singles',              coach: 'David Kim',   location: 'Summit Ave',   sport: 'badminton',  level: 'Advanced',     spots: 1 },
];

function renderCoachingPage() {
  const programsEl = document.getElementById('programs-grid');
  const coachesEl  = document.getElementById('coaches-roster');
  const clinicsEl  = document.getElementById('clinics-list');
  if (!programsEl && !coachesEl && !clinicsEl) return;

  if (programsEl) {
    programsEl.innerHTML = PROGRAMS.map(p => `
      <article class="program-card" data-program-id="${escapeHtml(p.id)}">
        <div class="img" style="background-image:url('${escapeHtml(p.img)}')"></div>
        <div class="body">
          <div class="price">${escapeHtml(p.priceRange)}</div>
          <h3 class="name">${escapeHtml(p.name)}</h3>
          <p class="desc">${escapeHtml(p.desc)}</p>
          <div class="cta">
            <button class="btn btn-primary" data-action="book-program">${escapeHtml(p.cta)} →</button>
          </div>
        </div>
      </article>
    `).join('');
    programsEl.querySelectorAll('[data-action="book-program"]').forEach(btn => {
      const card = btn.closest('[data-program-id]');
      btn.addEventListener('click', () => openProgramModal(card.dataset.programId));
    });
  }

  if (coachesEl) {
    coachesEl.innerHTML = COACHES.map(c => `
      <article class="coach-row" data-coach-id="${escapeHtml(c.id)}">
        <div class="img" style="background-image:url('${escapeHtml(c.img)}')"></div>
        <div class="info">
          <div class="role">${escapeHtml(c.role)}</div>
          <h3 class="name">${escapeHtml(c.name)}</h3>
          <p class="desc">${escapeHtml(c.desc)}</p>
          <div class="specialty">${escapeHtml(c.specialty || '')}</div>
          ${c.rate ? `<div class="rate"><strong>$${c.rate}</strong>/hr (privates)</div>` : ''}
          <button class="btn btn-ghost book" data-action="book-coach">Book with ${escapeHtml(c.name.split(' ')[0])} →</button>
        </div>
      </article>
    `).join('');
    coachesEl.querySelectorAll('[data-action="book-coach"]').forEach(btn => {
      const card = btn.closest('[data-coach-id]');
      btn.addEventListener('click', () => openProgramModal('private', { coachId: card.dataset.coachId }));
    });
  }

  if (clinicsEl) {
    clinicsEl.innerHTML = CLINICS_SAMPLE.map(c => `
      <div class="clinic-row" data-clinic-id="${escapeHtml(c.id)}">
        <div class="date"><div class="day">${escapeHtml(c.day)}</div><div class="mo">${escapeHtml(c.mo)}</div></div>
        <div class="info">
          <div class="name">${escapeHtml(c.name)}</div>
          <div class="meta">${escapeHtml(c.location)} · ${escapeHtml(c.coach)} · ${escapeHtml(c.level)}</div>
        </div>
        <div class="spots"><strong>${c.spots}</strong> spots</div>
        <button class="rsvp" data-action="rsvp-clinic">RSVP</button>
      </div>
    `).join('');
    clinicsEl.querySelectorAll('[data-action="rsvp-clinic"]').forEach(btn => {
      const row = btn.closest('[data-clinic-id]');
      const clinic = CLINICS_SAMPLE.find(c => c.id === row.dataset.clinicId);
      btn.addEventListener('click', () => openClinicRsvpModal(clinic));
    });
  }

  renderFaq('faq-coaching', FAQS.coaching);
}

function openProgramModal(programId, opts = {}) {
  const program = PROGRAMS.find(p => p.id === programId);
  if (!program) return;
  let step = 1;
  const chosen = { coachId: opts.coachId || null, location: null, time: null };
  const render = () => {
    if (step === 1 && !chosen.coachId) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 1 of 3 · Pick a coach</span>
        <h3 class="display-m">Who would you like to work with?</h3>
        <div class="step-pick">${COACHES.map(c => `<button data-coach="${escapeHtml(c.id)}"><div style="font-weight:700">${escapeHtml(c.name)}</div><div style="font-size:11px;color:var(--mute);margin-top:2px">${escapeHtml(c.specialty || c.role)}</div></button>`).join('')}</div>
      `);
      document.querySelectorAll('[data-coach]').forEach(b => b.addEventListener('click', () => { chosen.coachId = b.dataset.coach; step = 2; render(); }));
    } else if (step <= 2) {
      step = 2;
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 2 of 3 · Pick a location</span>
        <h3 class="display-m">Where should the session happen?</h3>
        <div class="step-pick">${LOCATIONS.filter(l => l.status === 'open').map(l => `<button data-loc="${escapeHtml(l.id)}">${escapeHtml(l.name)} · ${escapeHtml(l.city)}</button>`).join('')}</div>
      `);
      document.querySelectorAll('.step-pick [data-loc]').forEach(b => b.addEventListener('click', () => { chosen.location = b.dataset.loc; step = 3; render(); }));
    } else {
      const num = 'KF-COACH-' + Math.floor(1000 + Math.random() * 9000);
      const coach = COACHES.find(c => c.id === chosen.coachId);
      const loc = LOCATIONS.find(l => l.id === chosen.location);
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div></div>
        <span class="eyebrow">▸ Booked</span>
        <div class="confirm-num">${num}</div>
        <h3 class="display-m">${escapeHtml(program.name)} · ${escapeHtml(coach.name)}</h3>
        <p class="modal-meta">${escapeHtml(loc.name)} · ${escapeHtml(loc.city)}</p>
        <p class="body" style="font-size:13px;margin-bottom:24px">${escapeHtml(coach.name)} will be in touch within 24 hours to confirm a time slot.</p>
        <button class="btn btn-primary" id="program-done">Done</button>
      `);
      document.getElementById('program-done')?.addEventListener('click', closeModal);
    }
  };
  render();
}

function openClinicRsvpModal(clinic) {
  if (!clinic) return;
  openModal(`
    <span class="eyebrow">▸ You're in</span>
    <h3 class="display-m">${escapeHtml(clinic.name)}</h3>
    <p class="modal-meta">${escapeHtml(clinic.day)} ${escapeHtml(clinic.mo)} · ${escapeHtml(clinic.location)} · Coach ${escapeHtml(clinic.coach)}</p>
    <p class="body" style="font-size:13px;margin-bottom:24px">Confirmation sent to your inbox. ${clinic.spots} spots remained when you booked — see you on the court.</p>
    <button class="btn btn-primary" id="clinic-rsvp-done">Got it</button>
  `);
  document.getElementById('clinic-rsvp-done')?.addEventListener('click', closeModal);
}
```

- [ ] **Step 3: Verify in browser**

Open `coaching.html`. Expected:
- Nav with "COACHING" highlighted
- Page hero
- Programs grid: 3 cards (Group Clinics, Private Lessons, Junior Academy) — each opens a 3-step modal (pick coach → location → confirmation)
- Coaches roster: 5 cards with photo, role, name, bio, specialty, rate, "Book with [first name] →" button
- Upcoming clinics: 6 rows with date, name, meta, spots, RSVP
- Click any RSVP → confirmation modal
- Click "Book with Wei →" on a coach card → 2-step modal (coach pre-selected → location → confirmation)
- FAQ with 5 rows, accordion behavior
- Ready-to-play strip + footer
- Mobile burger works

- [ ] **Step 4: Commit**

```bash
git add coaching.html assets/app.js
git commit -m "feat(coaching): build coaching page with programs, coaches, clinics"
```

---

## Task 8: Build `events.html`

**Files:**
- Create: `events.html`
- Modify: `assets/app.js` — append `renderEventsPage`

- [ ] **Step 1: Create `events.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Events — Kotofit</title>
  <meta name="description" content="Tournaments, mixers, ladder leagues, and member events at Kotofit. Filter by sport, location, month, or price." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body data-page="events">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">KOTOFIT</a>
      <ul class="nav-links">
        <li><a href="locations.html">Locations</a></li>
        <li><a href="memberships.html">Memberships</a></li>
        <li><a href="coaching.html">Coaching</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="stringing.html">Stringing</a></li>
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
    </nav>
    <a href="index.html#top" class="mm-cta">Reserve a court →</a>
  </div>

  <main>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">▸ This season</span>
        <h1 class="display-l">What's on.</h1>
        <p class="lede">Tournaments, mixers, ladder leagues, and member-only events. Filter by sport, location, month, or price to find your next match.</p>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="filter-chips" id="events-filter-chips">
          <span class="chip-label">Sport</span>
          <div class="chip-group">
            <button class="chip active" data-filter="sport" data-value="all">All</button>
            <button class="chip" data-filter="sport" data-value="badminton">Badminton</button>
            <button class="chip" data-filter="sport" data-value="pickleball">Pickleball</button>
            <button class="chip" data-filter="sport" data-value="pingpong">Ping Pong</button>
          </div>
          <span class="chip-label" style="margin-left:14px">Month</span>
          <div class="chip-group">
            <button class="chip active" data-filter="month" data-value="all">All</button>
            <button class="chip" data-filter="month" data-value="May">May</button>
            <button class="chip" data-filter="month" data-value="Jun">Jun</button>
            <button class="chip" data-filter="month" data-value="Jul">Jul</button>
          </div>
          <span class="chip-label" style="margin-left:14px">Price</span>
          <div class="chip-group">
            <button class="chip active" data-filter="price" data-value="all">All</button>
            <button class="chip" data-filter="price" data-value="free">Free</button>
            <button class="chip" data-filter="price" data-value="paid">Paid</button>
          </div>
        </div>
        <div class="events-results-meta" data-events-count></div>
        <div class="events-list" id="events-list-page"></div>
      </div>
    </section>
  </main>

  <section class="ready-strip">
    <div class="container inner">
      <div>
        <h3>Want to host your <em>own</em> event?</h3>
        <div class="ready-meta">Member-organized meetups, leagues, and tournaments — let us know.</div>
      </div>
      <a href="index.html#top" class="btn btn-primary">Reserve a court →</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <div class="logo">KOTOFIT</div>
          <p>America's home for badminton, pickleball, and indoor sports. Four locations across NJ and NY, growing.</p>
        </div>
        <div><h4>Play</h4><ul><li><a href="locations.html">Locations</a></li><li><a href="index.html#top">Reserve</a></li><li><a href="memberships.html">Memberships</a></li><li><a href="stringing.html">Stringing</a></li></ul></div>
        <div><h4>Learn</h4><ul><li><a href="coaching.html">Coaching</a></li><li><a href="coaching.html">Clinics</a></li><li><a href="coaching.html">Youth</a></li><li><a href="events.html">Events</a></li></ul></div>
        <div><h4>Connect</h4><ul><li><a href="#">WhatsApp</a></li><li><a href="#">Instagram</a></li><li><a href="#">WeChat</a></li><li><a href="#">Contact</a></li></ul></div>
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

- [ ] **Step 2: Append `renderEventsPage` to `assets/app.js`**

Append BEFORE the `// === PAGE INIT ===` block:

```javascript
// === EVENTS PAGE ===
function renderEventsPage() {
  const list = document.getElementById('events-list-page');
  if (!list) return;

  const filters = { sport: 'all', month: 'all', price: 'all' };

  const matches = (e) => {
    if (filters.sport !== 'all' && e.sport !== filters.sport) return false;
    if (filters.month !== 'all' && e.month !== filters.month) return false;
    if (filters.price !== 'all' && e.price !== filters.price) return false;
    return true;
  };

  const render = () => {
    const visible = EVENTS.filter(matches);
    list.innerHTML = visible.map(e => `
      <div class="event-row">
        <div class="date"><div class="day">${escapeHtml(e.day)}</div><div class="mo">${escapeHtml(e.mo)}</div></div>
        <div class="info"><div class="name">${escapeHtml(e.name)}</div><div class="meta">${escapeHtml(e.meta)}</div></div>
        <button class="rsvp" data-event="${escapeHtml(e.id)}">RSVP</button>
      </div>
    `).join('') || `<p class="body" style="padding:32px 0">No events match those filters. Try clearing one.</p>`;
    list.querySelectorAll('[data-event]').forEach(btn => {
      btn.addEventListener('click', () => openRsvpModal(btn.dataset.event));
    });
    const meta = document.querySelector('[data-events-count]');
    if (meta) meta.textContent = `${visible.length} event${visible.length === 1 ? '' : 's'} matching`;
  };

  // Wire chips
  const chipsEl = document.getElementById('events-filter-chips');
  if (chipsEl) {
    chipsEl.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const dim = chip.dataset.filter;
        chipsEl.querySelectorAll(`.chip[data-filter="${dim}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filters[dim] = chip.dataset.value;
        render();
      });
    });
  }

  render();
}
```

- [ ] **Step 3: Verify in browser**

Open `events.html`. Expected:
- Nav with "EVENTS" highlighted
- Page hero
- Three filter chip rows: Sport, Month, Price (each with "All" active by default)
- "12 events matching" caption above the list
- 12 event rows with date, name, meta, RSVP buttons
- Click "Pickleball" → list filters to ~3 pickleball events; caption updates
- Click "Free" + "May" → list shows only free May events
- Click any RSVP → confirmation modal
- Empty-state message appears if filters narrow to zero
- Reset to "All" chips → 12 events return
- Ready-to-play strip + footer

- [ ] **Step 4: Commit**

```bash
git add events.html assets/app.js
git commit -m "feat(events): build events page with multi-dimension filtering"
```

---

## Task 9: Build `stringing.html`

**Files:**
- Create: `stringing.html`
- Modify: `assets/app.js` — append `renderStringingPage`, `openStringDetailModal`

- [ ] **Step 1: Create `stringing.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Stringing — Kotofit</title>
  <meta name="description" content="Professional racquet stringing in 24 hours. Choose your tension, your string, your timing — at any Kotofit location." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body data-page="stringing">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">KOTOFIT</a>
      <ul class="nav-links">
        <li><a href="locations.html">Locations</a></li>
        <li><a href="memberships.html">Memberships</a></li>
        <li><a href="coaching.html">Coaching</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="stringing.html">Stringing</a></li>
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
    </nav>
    <a href="index.html#top" class="mm-cta">Reserve a court →</a>
  </div>

  <main>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">▸ Professional stringing</span>
        <h1 class="display-l">Strung in 24 hours.</h1>
        <p class="lede">Drop your racquet at any Kotofit location. Choose your tension, your string, your timing. We'll text when it's ready.</p>
        <div style="margin-top:24px">
          <button class="btn btn-primary" id="stringing-cta">Book stringing →</button>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ How it works</div>
          <h2>Three steps.</h2>
        </div>
        <div class="process-grid">
          <div class="process-card">
            <div class="num">01</div>
            <h3>Drop off</h3>
            <p>Bring your racquet to the front desk at any Kotofit location. Tell us your timing and any string preference.</p>
          </div>
          <div class="process-card">
            <div class="num">02</div>
            <h3>Choose</h3>
            <p>Pick your string from our catalog (or bring your own — labor only) and your preferred tension. We string on-site.</p>
          </div>
          <div class="process-card">
            <div class="num">03</div>
            <h3>Pick up</h3>
            <p>We text you when it's ready. Standard turnaround is 24 hours. Same-day available for $10 rush fee.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ String catalog</div>
          <h2>Pick your string.</h2>
        </div>
        <div class="strings-catalog" id="strings-catalog"></div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Tension guide</div>
          <h2>What feel are you after?</h2>
        </div>
        <div class="tension-guide">
          <div class="tension-bar"></div>
          <div class="tension-marks">
            <div class="tension-mark"><div class="lbs">22 lbs</div><div class="feel">Soft feel</div></div>
            <div class="tension-mark recommended"><div class="lbs">24 lbs</div><div class="feel">★ Recommended</div></div>
            <div class="tension-mark"><div class="lbs">26 lbs</div><div class="feel">Crisp control</div></div>
            <div class="tension-mark"><div class="lbs">28 lbs</div><div class="feel">Pro level</div></div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-title">
          <div class="e">▸ Frequently asked</div>
          <h2>Common questions.</h2>
        </div>
        <div class="faq" id="faq-stringing"></div>
      </div>
    </section>
  </main>

  <section class="ready-strip">
    <div class="container inner">
      <div>
        <h3>Racquet feeling <em>tired?</em></h3>
        <div class="ready-meta">Drop it off at the front desk on your next visit.</div>
      </div>
      <button class="btn btn-primary" id="stringing-strip-cta">Book stringing →</button>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <div class="logo">KOTOFIT</div>
          <p>America's home for badminton, pickleball, and indoor sports. Four locations across NJ and NY, growing.</p>
        </div>
        <div><h4>Play</h4><ul><li><a href="locations.html">Locations</a></li><li><a href="index.html#top">Reserve</a></li><li><a href="memberships.html">Memberships</a></li><li><a href="stringing.html">Stringing</a></li></ul></div>
        <div><h4>Learn</h4><ul><li><a href="coaching.html">Coaching</a></li><li><a href="coaching.html">Clinics</a></li><li><a href="coaching.html">Youth</a></li><li><a href="events.html">Events</a></li></ul></div>
        <div><h4>Connect</h4><ul><li><a href="#">WhatsApp</a></li><li><a href="#">Instagram</a></li><li><a href="#">WeChat</a></li><li><a href="#">Contact</a></li></ul></div>
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

- [ ] **Step 2: Append `renderStringingPage` and `openStringDetailModal` to `assets/app.js`**

Append BEFORE the `// === PAGE INIT ===` block:

```javascript
// === STRINGING PAGE ===
function renderStringingPage() {
  const catalog = document.getElementById('strings-catalog');
  if (!catalog) return;

  const dot = (n, max = 5) => Array.from({ length: max }, (_, i) => `<span class="dot ${i < n ? 'on' : ''}"></span>`).join('');

  catalog.innerHTML = STRINGS.map(s => `
    <button class="string-card" data-string-id="${escapeHtml(s.id)}">
      <div class="gauge">${escapeHtml(s.gauge || '')}</div>
      <h3 class="name">${escapeHtml(s.name)}</h3>
      <p class="desc">${escapeHtml(s.desc)}</p>
      <div class="ratings">
        <div class="rating-row"><span class="rlabel">Durability</span><div class="dots">${dot(s.durability)}</div></div>
        <div class="rating-row"><span class="rlabel">Control</span><div class="dots">${dot(s.control)}</div></div>
        <div class="rating-row"><span class="rlabel">Power</span><div class="dots">${dot(s.power)}</div></div>
      </div>
      <div class="price">$${s.price}<small>/restring</small></div>
    </button>
  `).join('');
  catalog.querySelectorAll('.string-card').forEach(card => {
    card.addEventListener('click', () => openStringDetailModal(card.dataset.stringId));
  });

  // Hero CTA + ready-strip CTA both open the same flow
  document.getElementById('stringing-strip-cta')?.addEventListener('click', openStringingModal);

  renderFaq('faq-stringing', FAQS.stringing);
}

function openStringDetailModal(id) {
  const s = STRINGS.find(x => x.id === id);
  if (!s) return;
  openModal(`
    <span class="eyebrow">▸ ${escapeHtml(s.gauge || 'String')}</span>
    <h3 class="display-m">${escapeHtml(s.name)}</h3>
    <p class="modal-meta">$${s.price} per restring · Durability ${s.durability}/5 · Control ${s.control}/5 · Power ${s.power}/5</p>
    <p class="body" style="font-size:14px;line-height:1.6;margin-bottom:24px">${escapeHtml(s.desc)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="string-book-this">Book this string →</button>
      <button class="btn btn-ghost" id="string-detail-close">Close</button>
    </div>
  `);
  document.getElementById('string-book-this')?.addEventListener('click', () => {
    closeModal();
    openStringingModal();
  });
  document.getElementById('string-detail-close')?.addEventListener('click', closeModal);
}
```

- [ ] **Step 3: Verify in browser**

Open `stringing.html`. Expected:
- Nav with "STRINGING" highlighted
- Page hero with "Book stringing →" CTA → opens 4-step stringing modal flow
- Three-step process cards (Drop off / Choose / Pick up)
- String catalog with 3 cards: name, gauge, description, durability/control/power dot ratings, price
- Click any string card → detail modal with "Book this string →" (which closes detail and opens the stringing flow) and "Close"
- Tension guide visual: 4 marks across a Cobalt gradient bar, 24 lbs marked "★ Recommended" in Cobalt
- FAQ with 4 rows, accordion behavior
- Ready-to-play strip with "Book stringing →" button (also opens stringing flow)
- Footer

- [ ] **Step 4: Commit**

```bash
git add stringing.html assets/app.js
git commit -m "feat(stringing): build stringing page with catalog, tension guide, FAQ"
```

---

## Task 10: Add `data-page="home"` to `index.html` for active-nav highlight

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Set the body data attribute**

In `index.html`, find:
```html
<body>
```

Replace with:
```html
<body data-page="home">
```

- [ ] **Step 2: Update homepage nav links from anchors to filenames**

The homepage's nav currently uses anchor links (`#locations`, `#memberships`, etc.) that pointed to on-page sections that no longer exist as standalone sections (since the user picked V3 hero, the booking section is gone, but Locations / Memberships / Coaching / Events / Stringing are all on-page sections of the homepage).

Decision: keep the homepage nav links pointing to ON-PAGE anchors (so clicking a nav item from the homepage smooth-scrolls within the page), but change them to point to the corresponding section anchors that DO exist on the homepage. The homepage already has `#locations`, `#memberships` (Note: `#play` exists, but the nav doesn't link to it), `#coaching`, `#events`, `#stringing`. So the existing anchor links are still valid for the homepage.

Verify by opening `index.html` and clicking each nav link — they should smooth-scroll to the matching section. No changes needed if all anchors still resolve.

If any anchor links are broken, update them to the corresponding sub-page filename instead (e.g., `href="memberships.html"`).

- [ ] **Step 3: Verify**

Open `index.html`. Expected:
- The active-nav rule does NOT highlight any nav item (because no nav link is `home.html` and the active-nav code only matches `${page}.html`). Acceptable — the homepage doesn't visually need self-highlighting.
- Click each nav link, confirm they smooth-scroll to the matching on-page section.
- All previous homepage flows (booking widget, location modals, etc.) still work.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "chore(homepage): tag body for active-nav consistency"
```

---

## Task 11: Final QA — cross-link verification, image swap, smoke test

**Files:**
- Modify: any of the new HTML files / `assets/app.js` / `assets/styles.css` based on findings

- [ ] **Step 1: Verify every Unsplash URL across all pages**

Run from project root:
```bash
grep -hroE 'https://images\.unsplash\.com/[^'"'"')]+' . --include='*.html' --include='*.js' | sort -u > /tmp/unsplash-urls.txt
while read url; do
  echo -n "$(echo $url | grep -oE 'photo-[^?]+'): "
  curl -sI -o /dev/null -w "%{http_code}\n" "$url"
done < /tmp/unsplash-urls.txt
```

Note any URLs that return non-200. For each broken one, swap to a verified replacement (use the curated list from Task 15 of the homepage plan, or any verified Unsplash photo ID). Commit replacements as they happen.

- [ ] **Step 2: Click-through smoke test**

In a browser, walk this exact path and check off each step:

- [ ] Open `index.html` — homepage loads correctly, hero booking widget works
- [ ] Click nav "Locations" → `locations.html` loads
- [ ] On locations page: filter chips work (try "Pickleball" then "All"), location card "Reserve here →" navigates to `index.html#top`, soon-card "Get notified" → waitlist modal → email submit → confirmation
- [ ] Click nav "Memberships" → `memberships.html` loads, three tier cards show full perk lists, comparison table renders, FAQ rows expand one at a time, "Become a member →" opens 3-step join modal
- [ ] Click nav "Coaching" → `coaching.html` loads, 3 program cards work, 5 coach cards work, 6 clinics list works, FAQ works
- [ ] Click nav "Events" → `events.html` loads, 12 events listed, filter chips narrow the list (test sport + month combination), RSVP works
- [ ] Click nav "Stringing" → `stringing.html` loads, hero CTA opens stringing flow, string catalog cards open detail modals, tension guide renders, FAQ works
- [ ] On any page, click logo → navigates to `index.html`
- [ ] On any page, click "Reserve Court →" in nav → navigates to `index.html#top`
- [ ] Mobile menu burger works on all 6 pages (resize browser to <768px)
- [ ] Active-nav highlight (Cobalt underline) appears on the matching nav item for each sub-page
- [ ] Footer renders identically on all 6 pages
- [ ] Console: zero errors on any page

- [ ] **Step 3: Lighthouse audit (desktop)**

In Chrome DevTools, run a Lighthouse desktop audit on `locations.html` (representative sub-page). Target: Performance ≥ 75, Accessibility ≥ 90, Best Practices ≥ 90. Note any flagged issues but only fix them if they're trivial — full-perf tuning is out of scope for a prototype.

- [ ] **Step 4: Commit smoke-test fixes**

If Steps 1–3 surfaced any fixes (URL swaps, missing wirings, broken links), commit them in one bundle:
```bash
git add -u
git commit -m "polish(multipage): final QA fixes — image swaps, broken-link fixes"
```

---

## Self-review notes

The plan covers all spec sections:

| Spec section | Plan task |
|--------------|-----------|
| Refactor `index.html` to externalize CSS | Task 1 |
| Refactor `index.html` to externalize data | Task 2 |
| Refactor `index.html` to externalize app code | Task 3 |
| Active-nav highlight logic | Task 3 (`initNavHighlight`) + Task 4 (CSS) |
| Page-hero, ready-strip, filter-chips, FAQ accordion, comparison table, programs grid, coaches roster, string catalog, tension guide CSS | Task 4 |
| `locations.html` | Task 5 |
| `memberships.html` | Task 6 (uses shared `renderFaq` helper added there) |
| `coaching.html` | Task 7 |
| `events.html` | Task 8 |
| `stringing.html` | Task 9 |
| Homepage `data-page="home"` | Task 10 |
| Cross-link verification, image swap, smoke test | Task 11 |
| `openWaitlistModal`, `openProgramModal`, `openClinicRsvpModal`, `openStringDetailModal` | Tasks 3, 7, 9 |
| `PROGRAMS`, `FAQS`, extended `LOCATIONS` (address, sports, services), extended `EVENTS` (sport, location, month, price), extended `COACHES` (specialty, rate), extended `TIERS` (fullPerks), extended `STRINGS` (gauge, durability, control, power) | Task 2 (data.js) |

All function names are consistent: `escapeHtml`, `openModal`/`closeModal`, `openLocationModal`/`openSportModal`/`openCourtModal`/`openConfirmModal`/`openJoinModal`/`openRsvpModal`/`openStringingModal`/`openWaitlistModal`/`openProgramModal`/`openClinicRsvpModal`/`openStringDetailModal`, `renderLocations`/`renderPlay`/`renderMemberships`/`renderCoachesHomepage`/`renderEventsHomepage`/`renderLocationsPage`/`renderMembershipsPage`/`renderCoachingPage`/`renderEventsPage`/`renderStringingPage`/`renderFaq`, plus init helpers.

CSS class names are consistent across HTML and CSS rule definitions.

The "Past events / results" subsection on `events.html` flagged as optional in the spec is omitted from the plan to keep scope tight; can be added in a follow-up.

`renderMemberships` is enhanced in Task 3 to accept `{ full: boolean }` so the homepage gets short perks and `memberships.html` gets long perks via the same renderer — keeps DRY.

Risk noted in spec: `file://` may break external script loading on some Chrome configs. The implementer should mention to the user how to start a local server if double-clicking stops working post-Task 3.
