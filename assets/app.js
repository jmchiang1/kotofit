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

// === LOCATIONS PAGE ===
function renderLocationsPage() {
  const grid = document.getElementById('loc-grid-page');
  if (!grid) return;

  const filters = { sport: 'all', service: 'all' };

  const matchesFilters = (loc) => {
    if (loc.status === 'soon') return true;
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

    grid.querySelectorAll('[data-action="notify"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const loc = LOCATIONS.find(l => l.id === btn.dataset.locId);
        if (loc) openWaitlistModal(loc);
      });
    });
    grid.querySelectorAll('[data-action="details"]').forEach(btn => {
      btn.addEventListener('click', () => openLocationModal(btn.dataset.locId));
    });
  };

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
  if (grid && document.body.dataset.page === 'memberships') {
    // Re-run renderMemberships with full perk list (overrides the homepage default)
    renderMemberships({ full: true });
  }
  renderFaq('faq-memberships', typeof FAQS !== 'undefined' ? FAQS.memberships : []);
  document.getElementById('join-cta')?.addEventListener('click', () => openJoinModal('go-koto'));
}

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

  if (programsEl && typeof PROGRAMS !== 'undefined') {
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

  renderFaq('faq-coaching', typeof FAQS !== 'undefined' ? FAQS.coaching : []);
}

function openProgramModal(programId, opts = {}) {
  const program = (typeof PROGRAMS !== 'undefined') ? PROGRAMS.find(p => p.id === programId) : null;
  if (!program) return;
  let step = opts.coachId ? 2 : 1;
  const chosen = { coachId: opts.coachId || null, location: null };
  const render = () => {
    if (step === 1) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 1 of 3 · Pick a coach</span>
        <h3 class="display-m">Who would you like to work with?</h3>
        <div class="step-pick">${COACHES.map(c => `<button data-coach="${escapeHtml(c.id)}"><div style="font-weight:700">${escapeHtml(c.name)}</div><div style="font-size:11px;color:var(--mute);margin-top:2px">${escapeHtml(c.specialty || c.role)}</div></button>`).join('')}</div>
      `);
      document.querySelectorAll('[data-coach]').forEach(b => b.addEventListener('click', () => { chosen.coachId = b.dataset.coach; step = 2; render(); }));
    } else if (step === 2) {
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

// === EVENTS PAGE ===
function renderEventsPage() {
  const list = document.getElementById('events-list-page');
  if (!list) return;

  const filters = { sport: 'all', location: 'all', month: 'all', price: 'all' };

  const matches = (e) => {
    if (filters.sport !== 'all' && e.sport !== filters.sport) return false;
    if (filters.location !== 'all' && e.location !== filters.location && e.location !== 'all') return false;
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

  // Hero CTA + ready-strip CTA both open the same flow.
  // Note: initStringing() already wires #stringing-cta on the homepage.
  // On this page #stringing-cta also exists in the hero, so initStringing() handles it.
  // We only need to wire the ready-strip CTA here.
  document.getElementById('stringing-strip-cta')?.addEventListener('click', openStringingModal);

  renderFaq('faq-stringing', typeof FAQS !== 'undefined' ? FAQS.stringing : []);
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
