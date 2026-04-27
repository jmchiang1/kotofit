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
  const useFullPerks = opts.full === true;
  grid.innerHTML = TIERS.map(t => {
    const perksList = useFullPerks ? t.fullPerks : t.perks;
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

// === COACHING (HOMEPAGE) ===
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

// === EVENTS (HOMEPAGE — shows 4) ===
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

// === STRINGING (HOMEPAGE) ===
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
