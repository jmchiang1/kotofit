// assets/app.js
// All Kotofit page interactions. Each render*() checks for its target element
// and no-ops if absent, so this file is safe to load on any page.

// === HELPERS ===
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Returns true if the location is open at `now` (defaults to current time).
// schedule rules use HH:MM strings; when close <= open, the close time is
// treated as the next day (e.g. 6AM → 2AM).
function isLocationOpenNow(loc, now) {
  now = now || new Date();
  if (loc.status === "soon" || !loc.schedule) return false;
  const dow = now.getDay();
  const isWeekend = dow === 0 || dow === 6;
  const today = isWeekend ? loc.schedule.weekends : loc.schedule.weekdays;
  const yesterdayDow = (dow + 6) % 7;
  const yesterdayIsWeekend = yesterdayDow === 0 || yesterdayDow === 6;
  const yesterday = yesterdayIsWeekend
    ? loc.schedule.weekends
    : loc.schedule.weekdays;
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const inRange = (rule) => {
    if (!rule) return false;
    const [oh, om] = rule[0].split(":").map(Number);
    const [ch, cm] = rule[1].split(":").map(Number);
    const open = oh * 60 + om;
    let close = ch * 60 + cm;
    if (close <= open) close += 24 * 60;
    return nowMins >= open && nowMins < close;
  };

  if (inRange(today)) return true;

  // Yesterday's schedule that wraps past midnight into today
  if (yesterday) {
    const [oh, om] = yesterday[0].split(":").map(Number);
    const [ch, cm] = yesterday[1].split(":").map(Number);
    if (ch * 60 + cm <= oh * 60 + om) {
      if (nowMins < ch * 60 + cm) return true;
    }
  }
  return false;
}

// === MODAL ===
function openModal(html) {
  let backdrop = document.getElementById("modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "modal-backdrop";
    backdrop.className = "modal-backdrop";
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }
  backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true">
    <button class="modal-close" aria-label="Close">×</button>
    ${html}
  </div>`;
  backdrop.querySelector(".modal-close").addEventListener("click", closeModal);
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const backdrop = document.getElementById("modal-backdrop");
  if (backdrop) backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

// === LOCATIONS ===
function renderLocations() {
  const grid = document.getElementById("loc-grid");
  if (!grid) return;
  const openLocs = LOCATIONS.filter((l) => l.status !== "soon");
  const soonLocs = LOCATIONS.filter((l) => l.status === "soon");

  grid.innerHTML = openLocs
    .map((loc) => {
      const isOpen = isLocationOpenNow(loc);
      const badgeClass = isOpen ? "open" : "closed";
      const badgeLabel = isOpen ? "Open" : "Closed";
      return `
    <button class="loc-card" data-loc-id="${escapeHtml(loc.id)}">
      <div class="loc-img${loc.img ? "" : " loc-img-empty"}"${
        loc.img ? ` style="background-image:url('${escapeHtml(loc.img)}')"` : ""
      }>
        <span class="badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="loc-body">
        <div class="city">${escapeHtml(loc.city)}</div>
        <div class="name">${escapeHtml(loc.name)}</div>
        <div class="meta">
          <div class="meta-hours">${escapeHtml(loc.hours)}</div>
        </div>
      </div>
    </button>
  `;
    })
    .join("");
  grid.querySelectorAll(".loc-card").forEach((card) => {
    card.addEventListener("click", () => openLocationModal(card.dataset.locId));
  });

  const soonRow = document.getElementById("loc-grid-soon");
  if (soonRow) {
    soonRow.innerHTML = soonLocs
      .map(
        (loc) => `
      <button class="loc-card-soon" data-loc-id="${escapeHtml(loc.id)}">
        <div class="soon-text">
          <div class="city">${escapeHtml(loc.city)}</div>
          <div class="name">Coming this season</div>
        </div>
        <span class="soon-cta">Notify me →</span>
      </button>
    `
      )
      .join("");
    soonRow.querySelectorAll(".loc-card-soon").forEach((card) => {
      card.addEventListener("click", () => {
        const loc = LOCATIONS.find((l) => l.id === card.dataset.locId);
        if (loc) openWaitlistModal(loc);
      });
    });
  }
}

function openLocationModal(id) {
  const loc = LOCATIONS.find((l) => l.id === id);
  if (!loc) return;
  const isSoon = loc.status === "soon";
  openModal(`
    ${
      loc.img
        ? `<div class="modal-img" style="background-image:url('${escapeHtml(
            loc.img
          )}')"></div>`
        : ""
    }
    <span class="eyebrow">${escapeHtml(loc.city)}</span>
    <h3 class="display-m">${escapeHtml(loc.name)}</h3>
    <p class="modal-meta">${
      isSoon
        ? "Coming this season — get notified when we open."
        : `${isLocationOpenNow(loc) ? "Open now" : "Closed now"} · ${escapeHtml(
            loc.hours
          )}`
    }</p>
    ${
      isSoon
        ? ""
        : `<div class="modal-courts">${(loc.courtMix || [])
            .map(
              (c) => `<span class="modal-court-chip">${escapeHtml(c)}</span>`
            )
            .join("")}</div>`
    }
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="loc-modal-primary">${
        isSoon ? "Notify me" : "Reserve here →"
      }</button>
    </div>
  `);
  document
    .getElementById("loc-modal-primary")
    ?.addEventListener("click", () => {
      closeModal();
      if (isSoon) {
        openWaitlistModal(loc);
      } else {
        window.location.href = "index.html#top";
      }
    });
}

function openWaitlistModal(loc) {
  openModal(`
    <span class="eyebrow">▸ ${escapeHtml(loc.city)}</span>
    <h3 class="display-m">Get notified.</h3>
    <p class="modal-meta">We'll email you the moment ${escapeHtml(
      loc.city.split(" · ")[0]
    )} opens.</p>
    <div class="form-row"><label>Email</label><input type="email" id="waitlist-email" placeholder="alex@example.com" /></div>
    <button class="btn btn-primary" id="waitlist-submit" style="width:100%;justify-content:center;margin-top:8px">Add me to the list</button>
  `);
  document.getElementById("waitlist-submit")?.addEventListener("click", () => {
    const email = document.getElementById("waitlist-email")?.value.trim();
    if (!email) {
      document.getElementById("waitlist-email")?.focus();
      return;
    }
    openModal(`
      <span class="eyebrow">▸ You're on the list</span>
      <h3 class="display-m">See you when ${escapeHtml(
        loc.city.split(" · ")[0]
      )} opens.</h3>
      <p class="modal-meta">Confirmation sent to ${escapeHtml(email)}.</p>
      <button class="btn btn-primary" id="waitlist-done">Done</button>
    `);
    document
      .getElementById("waitlist-done")
      ?.addEventListener("click", closeModal);
  });
}

// === BOOKING ===
function initBooking() {
  if (!document.getElementById("check-courts")) return;
  const BOOKING_OPTIONS = {
    sport: ["Badminton", "Pickleball", "Ping Pong"],
    location: [
      "3rd Street · JC",
      "Brunswick · JC",
      "Summit Ave · JC",
      "10th Street · LIC",
    ],
    date: ["Today", "Tomorrow", "Sat, May 2", "Sun, May 3", "Mon, May 4"],
    time: ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"],
  };
  document.querySelectorAll("[data-bf]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      document
        .querySelectorAll(".b-dropdown.open")
        .forEach((d) => d.classList.remove("open"));
      const field = btn.dataset.bf;
      let dd = btn.parentElement.querySelector(".b-dropdown");
      if (!dd) {
        dd = document.createElement("div");
        dd.className = "b-dropdown";
        dd.innerHTML = BOOKING_OPTIONS[field]
          .map(
            (opt) =>
              `<button data-opt="${escapeHtml(opt)}">${escapeHtml(
                opt
              )}</button>`
          )
          .join("");
        btn.parentElement.appendChild(dd);
        dd.querySelectorAll("button").forEach((opt) => {
          opt.addEventListener("click", (e) => {
            btn.querySelector("[data-val]").textContent = opt.dataset.opt;
            dd.classList.remove("open");
            e.stopPropagation();
          });
        });
      }
      dd.classList.toggle("open");
    });
  });
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".b-dropdown.open")
      .forEach((d) => d.classList.remove("open"));
  });

  document.getElementById("check-courts").addEventListener("click", () => {
    const sport = document.querySelector(
      '[data-bf="sport"] [data-val]'
    ).textContent;
    const location = document.querySelector(
      '[data-bf="location"] [data-val]'
    ).textContent;
    const date = document.querySelector(
      '[data-bf="date"] [data-val]'
    ).textContent;
    const time = document.querySelector(
      '[data-bf="time"] [data-val]'
    ).textContent;
    openCourtModal({ sport, location, date, time });
  });
}

function openCourtModal({ sport, location, date, time }) {
  const slots = [
    { time, court: "Court 1", avail: true },
    { time, court: "Court 2", avail: false },
    { time, court: "Court 3", avail: true },
    { time, court: "Court 4", avail: true },
    { time, court: "Court 5", avail: false },
    { time, court: "Court 6", avail: true },
    { time, court: "Court 7", avail: false },
    { time, court: "Court 8", avail: true },
    { time, court: "Court 9", avail: true },
  ];
  openModal(`
    <span class="eyebrow">▸ Available courts</span>
    <h3 class="display-m">${escapeHtml(sport)} · ${escapeHtml(location)}</h3>
    <p class="modal-meta">${escapeHtml(date)} at ${escapeHtml(time)}</p>
    <div class="court-grid">
      ${slots
        .map(
          (s) => `
        <button class="court-slot ${s.avail ? "avail" : "booked"}" ${
            s.avail ? `data-court="${escapeHtml(s.court)}"` : "disabled"
          }>
          <span class="slot-time">${escapeHtml(s.time)}</span>
          <span class="slot-court">${escapeHtml(s.court)}</span>
        </button>
      `
        )
        .join("")}
    </div>
    <p class="body" style="font-size:12px">${
      slots.filter((s) => s.avail).length
    } of ${slots.length} courts available.</p>
  `);
  document.querySelectorAll(".court-slot.avail").forEach((slot) => {
    slot.addEventListener("click", () => {
      openConfirmModal({
        sport,
        location,
        date,
        time,
        court: slot.dataset.court,
      });
    });
  });
}

function openConfirmModal({ sport, location, date, time, court }) {
  const num = "KF-" + Math.floor(1000 + Math.random() * 9000);
  openModal(`
    <span class="eyebrow">▸ You're booked</span>
    <div class="confirm-num">${num}</div>
    <h3 class="display-m">${escapeHtml(sport)} · ${escapeHtml(court)}</h3>
    <p class="modal-meta">${escapeHtml(location)} · ${escapeHtml(
    date
  )} at ${escapeHtml(time)}</p>
    <p class="body" style="font-size:13px;margin-bottom:24px">Confirmation sent to your email. See you on the court.</p>
    <button class="btn btn-primary" id="confirm-done">Done</button>
  `);
  document
    .getElementById("confirm-done")
    ?.addEventListener("click", closeModal);
}

// === PLAY TILES ===
function renderPlay() {
  const grid = document.getElementById("play-grid");
  if (!grid) return;
  grid.innerHTML = SPORTS.map(
    (s) => `
    <button class="play-tile" data-sport="${escapeHtml(s.id)}">
      <div class="play-tile-bg" style="background-image:url('${escapeHtml(
        s.img
      )}')"></div>
      <div class="num">— ${escapeHtml(s.num)}</div>
      <div>
        <h3>${escapeHtml(s.name)}</h3>
        <div class="read">${escapeHtml(s.read)}</div>
      </div>
    </button>
  `
  ).join("");
  grid.querySelectorAll(".play-tile").forEach((tile) => {
    tile.addEventListener("click", () => openSportModal(tile.dataset.sport));
  });
}

function openSportModal(id) {
  const s = SPORTS.find((x) => x.id === id);
  if (!s) return;
  openModal(`
    <div class="modal-img" style="background-image:url('${escapeHtml(
      s.img
    )}')"></div>
    <span class="eyebrow">▸ ${escapeHtml(s.name)}</span>
    <h3 class="display-m">${escapeHtml(s.name)} at Kotofit</h3>
    <p class="body" style="margin-bottom:24px">${escapeHtml(s.desc)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="sport-modal-primary">Reserve a court →</button>
      <button class="btn btn-ghost" id="sport-modal-close">Close</button>
    </div>
  `);
  document
    .getElementById("sport-modal-primary")
    ?.addEventListener("click", () => {
      closeModal();
      window.location.href = "index.html#top";
    });
  document
    .getElementById("sport-modal-close")
    ?.addEventListener("click", closeModal);
}

// === MEMBERSHIPS ===
// Find a tier across both locations: returns { tier, locationKey } or null.
function findTier(tierId) {
  for (const key of Object.keys(MEMBERSHIPS)) {
    const tier = MEMBERSHIPS[key].tiers.find((t) => t.id === tierId);
    if (tier) return { tier, locationKey: key };
  }
  return null;
}

function renderTierPriceBlock(tier) {
  if (tier.priceMo === 0) {
    return `<div class="price">$0<small>free tier</small></div>`;
  }
  const monthly =
    tier.priceMo != null
      ? `<div class="price">$${tier.priceMo}<small>/mo</small></div>`
      : "";
  const quarterly =
    tier.priceQ != null
      ? tier.priceMo != null
        ? `<div class="price-alt">or <strong>$${tier.priceQ}</strong> / quarter</div>`
        : `<div class="price">$${tier.priceQ}<small>/quarter</small></div>`
      : "";
  return monthly + quarterly;
}

function renderMembershipCards(containerId, locationKey) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const loc = MEMBERSHIPS[locationKey];
  if (!loc) return;
  grid.dataset.tierCount = loc.tiers.length;
  grid.innerHTML = loc.tiers
    .map(
      (t) => `
    <div class="mem-card ${t.featured ? "featured" : ""}">
      ${
        t.limitedOffer
          ? `<div class="limited-pill">Limited time offer</div>`
          : ""
      }
      <div class="tier">${escapeHtml(t.name)}</div>
      <div class="tier-tag">${escapeHtml(t.tagline)}</div>
      <div class="price-block">${renderTierPriceBlock(t)}</div>
      <ul>${t.perks.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
      <button class="mem-cta" data-tier="${escapeHtml(t.id)}">${escapeHtml(
        t.cta
      )}</button>
    </div>
  `
    )
    .join("");
  grid.querySelectorAll("[data-tier]").forEach((btn) => {
    btn.addEventListener("click", () => openJoinModal(btn.dataset.tier));
  });
  // Children inserted after initReveal() observed the parent never get the reveal
  // animation — motion.dev's inView fires once per element. Force them visible.
  if (typeof forceRevealChildren === "function") forceRevealChildren(grid);
}

function renderComparisonTable(containerId, locationKey) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  const loc = MEMBERSHIPS[locationKey];
  if (!loc) return;
  const headers = loc.tiers
    .map(
      (t) => `
    <th class="col-tier ${t.featured ? "featured" : ""}">${escapeHtml(
        t.name
      )}</th>
  `
    )
    .join("");
  const body = loc.rows
    .map((row) => {
      const cells = loc.tiers
        .map((t) => {
          const v = t.cells[row.key];
          const isDash = v === "—" || v == null;
          return `<td class="cell-val ${isDash ? "cell-no" : ""}">${escapeHtml(
            v ?? "—"
          )}</td>`;
        })
        .join("");
      const sub = row.sub
        ? `<div class="row-sub">${escapeHtml(row.sub)}</div>`
        : "";
      return `<tr><td class="row-label">${escapeHtml(
        row.label
      )}${sub}</td>${cells}</tr>`;
    })
    .join("");
  wrap.innerHTML = `
    <table class="mem-table">
      <thead><tr><th>Feature</th>${headers}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

// Build segmented NJ/LIC toggle, wire it to re-render cards (+ optional table).
// Returns a controller with getActive() so callers can read the current selection.
function renderMembershipsLocationToggle(
  toggleId,
  cardsId,
  tableId,
  initialKey,
  onChange
) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return null;
  const keys = Object.keys(MEMBERSHIPS);
  toggle.innerHTML = keys
    .map(
      (k) => `
    <button class="mem-toggle-btn ${
      k === initialKey ? "active" : ""
    }" data-loc="${k}">
      ${escapeHtml(MEMBERSHIPS[k].label)}
    </button>
  `
    )
    .join("");
  let active = initialKey;
  let firstRender = true;
  let busy = false;
  const SWAP_MS = 220;

  const doRender = (key) => {
    renderMembershipCards(cardsId, key);
    if (tableId) renderComparisonTable(tableId, key);
  };

  const apply = (key) => {
    if (busy && key !== active) return;
    if (key === active && !firstRender) return;
    active = key;
    toggle.querySelectorAll(".mem-toggle-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.loc === key);
    });

    if (firstRender) {
      doRender(key);
      firstRender = false;
      if (typeof onChange === "function") onChange(key);
      return;
    }

    // Subsequent toggles: crossfade.
    busy = true;
    const targets = [
      document.getElementById(cardsId),
      tableId ? document.getElementById(tableId) : null,
    ].filter(Boolean);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      doRender(key);
      busy = false;
      if (typeof onChange === "function") onChange(key);
      return;
    }

    targets.forEach((el) => el.classList.add("mem-swapping"));
    setTimeout(() => {
      doRender(key);
      requestAnimationFrame(() => {
        targets.forEach((el) => el.classList.remove("mem-swapping"));
        busy = false;
      });
      if (typeof onChange === "function") onChange(key);
    }, SWAP_MS);
  };

  toggle.querySelectorAll(".mem-toggle-btn").forEach((b) => {
    b.addEventListener("click", () => apply(b.dataset.loc));
  });
  apply(active);
  return { getActive: () => active };
}

// Homepage entry point: toggle (if present) + cards. No table on homepage.
// Memberships page handles its own render via renderMembershipsPage().
function renderMemberships() {
  if (document.body.dataset.page === "memberships") return;
  const grid = document.getElementById("mem-grid");
  if (!grid) return;
  if (document.getElementById("mem-toggle-home")) {
    renderMembershipsLocationToggle("mem-toggle-home", "mem-grid", null, "nj");
  } else {
    renderMembershipCards("mem-grid", "nj");
  }
}

function openJoinModal(tierId) {
  const found = findTier(tierId);
  if (!found) return;
  const { tier, locationKey } = found;
  const locDef = MEMBERSHIPS[locationKey];
  const eligibleLocations = LOCATIONS.filter(
    (l) => l.status === "open" && locDef.locationIds.includes(l.id)
  );
  const priceLine =
    tier.priceMo === 0
      ? `${tier.name} · Free`
      : tier.priceMo != null
      ? `${tier.name} · $${tier.priceMo}/mo${
          tier.priceQ != null ? ` (or $${tier.priceQ}/quarter)` : ""
        }`
      : `${tier.name} · $${tier.priceQ}/quarter`;
  let step = 1;
  let chosenLoc = null;
  const render = () => {
    if (step === 1) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 1 of 3 · Choose your home court</span>
        <h3 class="display-m">Where will you play?</h3>
        <p class="modal-meta">${escapeHtml(tier.name)} is a ${escapeHtml(
        locDef.label
      )} membership.</p>
        <div class="step-pick">${eligibleLocations
          .map(
            (l) =>
              `<button data-loc="${escapeHtml(l.id)}">${escapeHtml(
                l.name
              )} · ${escapeHtml(l.city)}</button>`
          )
          .join("")}</div>
      `);
      document.querySelectorAll(".step-pick [data-loc]").forEach((b) => {
        b.addEventListener("click", () => {
          chosenLoc = b.dataset.loc;
          step = 2;
          render();
        });
      });
    } else if (step === 2) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 2 of 3 · Your details</span>
        <h3 class="display-m">Create your account</h3>
        <p class="modal-meta">${escapeHtml(priceLine)}</p>
        <div class="form-row"><label>Full name</label><input type="text" id="join-name" placeholder="Alex Player" /></div>
        <div class="form-row"><label>Email</label><input type="email" id="join-email" placeholder="alex@example.com" /></div>
        <div class="form-row"><label>Password</label><input type="password" id="join-pw" placeholder="••••••••" /></div>
        <button class="btn btn-primary" id="join-next" style="width:100%;justify-content:center;margin-top:8px">Continue →</button>
      `);
      document.getElementById("join-next")?.addEventListener("click", () => {
        const name = document.getElementById("join-name")?.value.trim();
        if (!name) {
          document.getElementById("join-name")?.focus();
          return;
        }
        step = 3;
        render();
      });
    } else {
      const num = "KF-MEM-" + Math.floor(1000 + Math.random() * 9000);
      const locName =
        (LOCATIONS.find((l) => l.id === chosenLoc) || {}).name || locDef.label;
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div></div>
        <span class="eyebrow">▸ You're in</span>
        <div class="confirm-num">${num}</div>
        <h3 class="display-m">Welcome to ${escapeHtml(tier.name)}</h3>
        <p class="modal-meta">Home court: ${escapeHtml(
          locName
        )}. Confirmation sent.</p>
        <p class="body" style="font-size:13px;margin-bottom:24px">Your member booking window opens immediately. Open the app or stop by the front desk to lock in your first session.</p>
        <button class="btn btn-primary" id="join-done">Done</button>
      `);
      document
        .getElementById("join-done")
        ?.addEventListener("click", closeModal);
    }
  };
  render();
}

// === COACHING (HOMEPAGE) ===
function renderCoachesHomepage() {
  const grid = document.getElementById("coach-grid");
  if (!grid) return;
  const feature = COACHES.find((c) => c.feature) || COACHES[0];
  const others = COACHES.filter((c) => c !== feature);
  grid.innerHTML = `
    <div class="coach-feature" data-coach-id="${escapeHtml(
      feature.id
    )}" role="button" tabindex="0" aria-label="View ${escapeHtml(
    feature.name
  )}'s bio">
      <div class="coach-bg" style="background-image:url('${escapeHtml(
        feature.img
      )}')"></div>
      <div>
        <div class="role">${escapeHtml(feature.role)}</div>
        <div class="name">${escapeHtml(feature.name)}</div>
        <p class="desc">${escapeHtml(feature.desc)}</p>
      </div>
    </div>
    <div class="coach-side">
      ${others
        .map(
          (c) => `
        <div class="coach-mini" data-coach-id="${escapeHtml(
          c.id
        )}" role="button" tabindex="0" aria-label="View ${escapeHtml(
            c.name
          )}'s bio">
          <div class="coach-bg" style="background-image:url('${escapeHtml(
            c.img
          )}')"></div>
          <div>
            <div class="role">${escapeHtml(c.role)}</div>
            <div class="name">${escapeHtml(c.name)}</div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
  grid.querySelectorAll("[data-coach-id]").forEach((el) => {
    el.addEventListener("click", () => openCoachBioModal(el.dataset.coachId));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCoachBioModal(el.dataset.coachId);
      }
    });
  });
}

// === EVENTS (HOMEPAGE — shows 4) ===
// Type-specific SVG icons for event cards. Authored inline so they stroke with
// currentColor (themes via --cobalt) and stay sharp at any thumbnail size.
const EVENT_ICONS = {
  mixer:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1"/><path d="M14 16v-1a3 3 0 0 1 3-3 3 3 0 0 1 3 3v1"/></svg>',
  tournament:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10v6a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><path d="M9 20h6M12 16v4"/></svg>',
  camp:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 2 2.5 3.5 6 3.5s6-1.5 6-3.5v-5"/><path d="M22 9v5"/></svg>',
  clinic:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2"/><path d="M12 7v7"/><path d="M5 11l7-2 7 2"/><path d="M9 21l3-7 3 7"/></svg>',
  openplay:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5l6 6"/><path d="M9 5v8M5 9h8"/></svg>',
  ladder:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M14 21V3"/><path d="M5 17h9M5 13h9M5 9h9M5 5h9"/></svg>',
  final:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 22V4"/><path d="M5 4h13l-2.5 4 2.5 4H5"/></svg>',
  appreciation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12,2.5 14.5,9 21.5,9.5 16,13.5 17.8,20.5 12,16.7 6.2,20.5 8,13.5 2.5,9.5 9.5,9"/></svg>',
};

function getEventType(event) {
  if (event.type) return event.type;
  const n = (event.name || '').toLowerCase();
  if (n.includes('mixer'))        return 'mixer';
  if (n.includes('tournament'))   return 'tournament';
  if (n.includes('camp'))         return 'camp';
  if (n.includes('clinic'))       return 'clinic';
  if (n.includes('ladder'))       return 'ladder';
  if (n.includes('final'))        return 'final';
  if (n.includes('appreciation')) return 'appreciation';
  if (n.includes('open play'))    return 'openplay';
  return 'openplay';
}

function renderEventsHomepage() {
  const list = document.getElementById("events-list");
  if (!list) return;
  list.innerHTML = EVENTS.slice(0, 4)
    .map((e) => {
      const icon = EVENT_ICONS[getEventType(e)] || EVENT_ICONS.openplay;
      return `
    <div class="event-row">
      <div class="event-img" data-event-type="${escapeHtml(getEventType(e))}">${icon}</div>
      <div class="date"><div class="day">${escapeHtml(e.day)}</div><div class="mo">${escapeHtml(e.mo)}</div></div>
      <div class="info"><div class="name">${escapeHtml(e.name)}</div><div class="meta">${escapeHtml(e.meta)}</div></div>
      <button class="rsvp" data-event="${escapeHtml(e.id)}">RSVP</button>
    </div>
  `;
    })
    .join("");
  list.querySelectorAll("[data-event]").forEach((btn) => {
    btn.addEventListener("click", () => openRsvpModal(btn.dataset.event));
  });
}

function openRsvpModal(id) {
  const ev = EVENTS.find((e) => e.id === id);
  if (!ev) return;
  openModal(`
    <span class="eyebrow">▸ You're in</span>
    <h3 class="display-m">${escapeHtml(ev.name)}</h3>
    <p class="modal-meta">${escapeHtml(ev.day)} ${escapeHtml(
    ev.mo
  )} · ${escapeHtml(ev.meta)}</p>
    <p class="body" style="font-size:13px;margin-bottom:24px">A confirmation has been sent to your inbox. Add it to your calendar so you don't forget.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="rsvp-done">Got it</button>
      <button class="btn btn-ghost" id="rsvp-cal">Add to calendar</button>
    </div>
  `);
  document.getElementById("rsvp-done")?.addEventListener("click", closeModal);
  document.getElementById("rsvp-cal")?.addEventListener("click", closeModal);
}

// === MOBILE MENU ===
function initMobileMenu() {
  const burger = document.querySelector(".nav-burger");
  const mm = document.getElementById("mobile-menu");
  const mmClose = document.getElementById("mm-close");
  if (!mm) return;
  const openMm = () => {
    mm.classList.add("open");
    mm.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeMm = () => {
    mm.classList.remove("open");
    mm.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  burger?.addEventListener("click", openMm);
  mmClose?.addEventListener("click", closeMm);
  mm.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMm));
}

// === REVEAL (motion.dev) ===
function initReveal() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const M = window.Motion;
  const showAll = () => {
    document.querySelectorAll(".reveal, .reveal-stagger > *").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  };

  // Fallback: no Motion library, missing API, or reduced-motion preference → show everything immediately.
  if (reduceMotion || !M || !M.inView || !M.animate) {
    showAll();
    return;
  }

  // Per-element fallback: motion.dev's IntersectionObserver callbacks can throw synchronously
  // during option construction (e.g. unsupported spring configs in M.spring). Without a per-call
  // try/catch the element stays at opacity:0 forever. Build options inside the try; on failure
  // force the element visible so content never sticks invisible.
  const showOne = (el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  };
  const showMany = (els) => els.forEach(showOne);

  try {
    // Singleton reveal — single elements spring up.
    // Note: Motion.inView passes an IntersectionObserverEntry, NOT the element. Use entry.target.
    M.inView(
      ".reveal",
      (entry) => {
        const el = entry.target;
        try {
          M.animate(
            el,
            { opacity: [0, 1], y: [24, 0] },
            { duration: 0.7, ease: "ease-out" }
          );
        } catch (e) {
          showOne(el);
        }
      },
      { amount: 0.2 }
    );

    // Stagger reveal — direct children of a container animate in sequence.
    M.inView(
      ".reveal-stagger",
      (entry) => {
        const children = Array.from(
          entry.target.querySelectorAll(":scope > *")
        );
        if (!children.length) return;
        try {
          M.animate(
            children,
            { opacity: [0, 1], y: [24, 0] },
            {
              delay: M.stagger ? M.stagger(0.05) : 0,
              duration: 0.6,
              ease: "ease-out",
            }
          );
        } catch (e) {
          showMany(children);
        }
      },
      { amount: 0.2 }
    );
  } catch (err) {
    console.warn(
      "motion.dev integration error, falling back to immediate-show:",
      err
    );
    showAll();
  }
}

// Force-show direct children of a .reveal-stagger container that was re-rendered dynamically
// after initReveal() already observed it (motion.dev's inView fires once per element).
function forceRevealChildren(container) {
  if (!container) return;
  Array.from(container.children).forEach((c) => {
    c.style.opacity = "1";
    c.style.transform = "none";
  });
}

// === HERO LOAD ===
function initHero() {
  requestAnimationFrame(() => {
    document.querySelector(".hero")?.classList.add("loaded");
  });
}

// === HERO IMAGERY TOGGLE ===
function initHeroToggle() {
  const hero = document.querySelector(".hero");
  const btn = document.getElementById("hero-toggle");
  if (!hero || !btn) return;
  const STORAGE_KEY = "kotofit-hero-imagery-hidden";
  const labelEl = btn.querySelector(".hero-toggle-label");

  const apply = (hidden) => {
    hero.classList.toggle("players-hidden", hidden);
    if (labelEl) labelEl.textContent = hidden ? "Show imagery" : "Hide imagery";
    btn.setAttribute("aria-pressed", String(hidden));
  };

  let initial = false;
  try {
    initial = localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {}
  apply(initial);

  btn.addEventListener("click", () => {
    const next = !hero.classList.contains("players-hidden");
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch (e) {}
  });
}

// === ACTIVE NAV HIGHLIGHT ===
function initNavHighlight() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll(".nav-links a, .mobile-menu nav a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (
      href === `${page}.html` ||
      (page === "home" && (href === "index.html" || href === "/"))
    ) {
      a.setAttribute("aria-current", "page");
    }
  });
}

// === LOCATIONS PAGE ===
function renderLocationsPage() {
  const grid = document.getElementById("loc-grid-page");
  if (!grid) return;

  const filters = { sport: "all", service: "all" };

  const matchesFilters = (loc) => {
    if (loc.status === "soon") return true;
    if (filters.sport !== "all" && !loc.sports.includes(filters.sport))
      return false;
    if (filters.service !== "all" && !loc.services.includes(filters.service))
      return false;
    return true;
  };

  const render = () => {
    const visible = LOCATIONS.filter(matchesFilters);
    grid.innerHTML = visible
      .map((loc) => {
        const isSoon = loc.status === "soon";
        const isOpen = !isSoon && isLocationOpenNow(loc);
        const badgeClass = isSoon ? "soon" : isOpen ? "open" : "closed";
        const badgeLabel = isSoon
          ? "Coming this season"
          : isOpen
          ? "Open"
          : "Closed";
        const sportTags = loc.sports
          .map((s) => {
            const sport = SPORTS.find((x) => x.id === s);
            return sport
              ? `<span class="tag-chip">${escapeHtml(sport.name)}</span>`
              : "";
          })
          .join("");
        const serviceTags = loc.services
          .map(
            (s) =>
              `<span class="tag-chip">${escapeHtml(
                s.charAt(0).toUpperCase() + s.slice(1)
              )}</span>`
          )
          .join("");
        return `
        <article class="loc-card-page" data-loc-id="${escapeHtml(loc.id)}" tabindex="0" role="button" aria-label="View ${escapeHtml(loc.name)} details">
          <div class="img${loc.img ? "" : " img-empty"}"${
          loc.img
            ? ` style="background-image:url('${escapeHtml(loc.img)}')"`
            : ""
        }>
            <span class="badge ${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="body">
            <div class="city">${escapeHtml(loc.city)}</div>
            <h3 class="name">${escapeHtml(loc.name)}</h3>
            <div class="addr">${escapeHtml(loc.address)}</div>
            ${
              isSoon
                ? ""
                : `<div class="meta"><span class="meta-hours">${escapeHtml(
                    loc.hours
                  )}</span></div>`
            }
            ${
              isSoon ? "" : `<div class="tags">${sportTags}${serviceTags}</div>`
            }
          </div>
        </article>
      `;
      })
      .join("");

    grid.querySelectorAll(".loc-card-page").forEach((card) => {
      const open = () => {
        const loc = LOCATIONS.find((l) => l.id === card.dataset.locId);
        if (!loc) return;
        if (loc.status === "soon") openWaitlistModal(loc);
        else openLocationModal(loc.id);
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    // Re-rendered children inherit opacity:0 from .reveal-stagger > * but never
    // trigger motion's inView fade-in (it only fires once per element). Force them visible.
    if (typeof forceRevealChildren === "function") forceRevealChildren(grid);
  };

  const chipsEl = document.getElementById("loc-filter-chips");
  if (chipsEl) {
    chipsEl.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const dim = chip.dataset.filter;
        chipsEl
          .querySelectorAll(`.chip[data-filter="${dim}"]`)
          .forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
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
  el.innerHTML = items
    .map(
      (it, i) => `
    <div class="faq-row" data-faq-i="${i}">
      <button class="faq-q" aria-expanded="false"><span>${escapeHtml(
        it.q
      )}</span><span class="icon">+</span></button>
      <div class="faq-a-wrap"><div class="faq-a">${escapeHtml(it.a)}</div></div>
    </div>
  `
    )
    .join("");
  const closeRow = (r) => {
    const w = r.querySelector(".faq-a-wrap");
    const b = r.querySelector(".faq-q");
    if (!w || !r.classList.contains("open")) return;
    w.style.maxHeight = w.scrollHeight + "px";
    void w.offsetHeight;
    r.classList.remove("open");
    if (b) b.setAttribute("aria-expanded", "false");
    requestAnimationFrame(() => {
      w.style.maxHeight = "0px";
    });
  };
  const openRow = (r) => {
    const w = r.querySelector(".faq-a-wrap");
    const b = r.querySelector(".faq-q");
    if (!w) return;
    r.classList.add("open");
    if (b) b.setAttribute("aria-expanded", "true");
    w.style.maxHeight = w.scrollHeight + "px";
    const onEnd = (e) => {
      if (e.propertyName !== "max-height") return;
      w.removeEventListener("transitionend", onEnd);
      if (r.classList.contains("open")) w.style.maxHeight = "none";
    };
    w.addEventListener("transitionend", onEnd);
  };
  el.querySelectorAll(".faq-row").forEach((row) => {
    const btn = row.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const wasOpen = row.classList.contains("open");
      el.querySelectorAll(".faq-row.open").forEach((r) => {
        if (r !== row) closeRow(r);
      });
      if (wasOpen) closeRow(row);
      else openRow(row);
    });
  });
}

// === MEMBERSHIPS PAGE ===
function renderMembershipsPage() {
  if (document.body.dataset.page !== "memberships") return;

  const ctaBlurb = document.getElementById("join-cta-blurb");
  const updateCtaBlurb = (key) => {
    if (!ctaBlurb) return;
    ctaBlurb.textContent =
      key === "nj"
        ? "Most NJ players go with Open Play Elite — $35/mo, 30% off open play, 21-day advance booking."
        : "Most LIC players start with Silver — $49/mo, 20% off open play, plus 1 free UBR/DUPR session each month.";
  };

  const controller = renderMembershipsLocationToggle(
    "mem-toggle-page",
    "mem-grid",
    "mem-table-wrap",
    "nj",
    updateCtaBlurb
  );

  renderFaq(
    "faq-memberships",
    typeof FAQS !== "undefined" ? FAQS.memberships : []
  );

  document.getElementById("join-cta")?.addEventListener("click", () => {
    const activeKey = controller ? controller.getActive() : "nj";
    const featured =
      MEMBERSHIPS[activeKey].tiers.find((t) => t.featured) ||
      MEMBERSHIPS[activeKey].tiers[0];
    openJoinModal(featured.id);
  });
}

// === COACHING PAGE ===
const CLINICS_SAMPLE = [
  {
    id: "cl1",
    day: "03",
    mo: "May",
    name: "Beginner Badminton Fundamentals",
    coach: "Wei Chen",
    location: "Brunswick",
    sport: "badminton",
    level: "Beginner",
    spots: 4,
  },
  {
    id: "cl2",
    day: "07",
    mo: "May",
    name: "Intermediate Pickleball Drills",
    coach: "Maria Lopez",
    location: "3rd Street",
    sport: "pickleball",
    level: "Intermediate",
    spots: 2,
  },
  {
    id: "cl3",
    day: "10",
    mo: "May",
    name: "Doubles Strategy Workshop",
    coach: "Aisha Khan",
    location: "LIC",
    sport: "badminton",
    level: "Advanced",
    spots: 6,
  },
  {
    id: "cl4",
    day: "14",
    mo: "May",
    name: "Junior Foundations",
    coach: "Jordan Park",
    location: "Brunswick",
    sport: "badminton",
    level: "Beginner",
    spots: 8,
  },
  {
    id: "cl5",
    day: "17",
    mo: "May",
    name: "Pickleball Skills Lab",
    coach: "Maria Lopez",
    location: "LIC",
    sport: "pickleball",
    level: "Intermediate",
    spots: 3,
  },
  {
    id: "cl6",
    day: "21",
    mo: "May",
    name: "Match-Prep Singles",
    coach: "David Kim",
    location: "Summit Ave",
    sport: "badminton",
    level: "Advanced",
    spots: 1,
  },
];

function renderCoachingPage() {
  const programsEl = document.getElementById("programs-grid");
  const coachesEl = document.getElementById("coaches-roster");
  const clinicsEl = document.getElementById("clinics-list");
  if (!programsEl && !coachesEl && !clinicsEl) return;

  if (programsEl && typeof PROGRAMS !== "undefined") {
    programsEl.innerHTML = PROGRAMS.map(
      (p) => `
      <article class="package-card${
        p.featured ? " featured" : ""
      }" data-program-id="${escapeHtml(p.id)}">
        ${p.featured ? '<div class="package-badge">Most popular</div>' : ""}
        <div class="package-head">
          <div class="package-audience">${escapeHtml(p.audience)}</div>
          <h3 class="package-name">${escapeHtml(p.name)}</h3>
        </div>
        <div class="package-price">
          <span class="amount">${escapeHtml(p.priceLabel)}</span>
          <span class="unit">${escapeHtml(p.priceUnit)}</span>
        </div>
        <ul class="package-specs">
          <li><span class="k">Format</span><span class="v">${escapeHtml(
            p.ratio
          )}</span></li>
          <li><span class="k">Total</span><span class="v">${escapeHtml(
            p.sessions
          )}</span></li>
          <li><span class="k">Session</span><span class="v">${escapeHtml(
            p.sessionLength
          )}</span></li>
        </ul>
        <ul class="package-perks">
          ${p.perks.map((perk) => `<li>${escapeHtml(perk)}</li>`).join("")}
        </ul>
        <button class="btn ${
          p.featured ? "btn-primary" : "btn-ghost"
        } package-cta" data-action="register-package">${escapeHtml(
        p.cta
      )} →</button>
      </article>
    `
    ).join("");
    programsEl
      .querySelectorAll('[data-action="register-package"]')
      .forEach((btn) => {
        const card = btn.closest("[data-program-id]");
        btn.addEventListener("click", () => {
          const program = PROGRAMS.find((p) => p.id === card.dataset.programId);
          if (program?.contactOnly) {
            openPrivateContactModal(program);
          } else {
            openProgramModal(card.dataset.programId);
          }
        });
      });
  }

  if (coachesEl) {
    coachesEl.innerHTML = COACHES.map(
      (c) => `
      <article class="coach-card" data-coach-id="${escapeHtml(c.id)}">
        <div class="coach-card-bg" style="background-image:url('${escapeHtml(
          c.img
        )}')"></div>
        <div class="coach-card-overlay" aria-hidden="true"></div>
        <div class="coach-card-content">
          <div class="role">${escapeHtml(c.role)}</div>
          <div class="name">${escapeHtml(c.name)}</div>
          ${
            c.specialty
              ? `<div class="specialty">${escapeHtml(c.specialty)}</div>`
              : ""
          }
        </div>
        <button class="coach-card-book" data-action="book-coach" aria-label="Book with ${escapeHtml(
          c.name
        )}">
          Book with ${escapeHtml(c.name.split(" ")[0])} →
        </button>
      </article>
    `
    ).join("");

    // Card click → bio modal. Book button click → private contact flow.
    // The book button stops propagation so card click doesn't fire too.
    coachesEl.querySelectorAll(".coach-card").forEach((card) => {
      card.addEventListener("click", () =>
        openCoachBioModal(card.dataset.coachId)
      );
    });
    coachesEl.querySelectorAll('[data-action="book-coach"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest("[data-coach-id]");
        const privateProgram = PROGRAMS.find((p) => p.id === "private");
        if (privateProgram)
          openPrivateContactModal(privateProgram, card.dataset.coachId);
      });
    });
  }

  if (clinicsEl) {
    clinicsEl.innerHTML = CLINICS_SAMPLE.map(
      (c) => `
      <div class="clinic-row" data-clinic-id="${escapeHtml(c.id)}">
        <div class="date"><div class="day">${escapeHtml(
          c.day
        )}</div><div class="mo">${escapeHtml(c.mo)}</div></div>
        <div class="info">
          <div class="name">${escapeHtml(c.name)}</div>
          <div class="meta">${escapeHtml(c.location)} · ${escapeHtml(
        c.coach
      )} · ${escapeHtml(c.level)}</div>
        </div>
        <div class="spots"><strong>${c.spots}</strong> spots</div>
        <button class="rsvp" data-action="rsvp-clinic">RSVP</button>
      </div>
    `
    ).join("");
    clinicsEl.querySelectorAll('[data-action="rsvp-clinic"]').forEach((btn) => {
      const row = btn.closest("[data-clinic-id]");
      const clinic = CLINICS_SAMPLE.find((c) => c.id === row.dataset.clinicId);
      btn.addEventListener("click", () => openClinicRsvpModal(clinic));
    });
  }

  renderFaq("faq-coaching", typeof FAQS !== "undefined" ? FAQS.coaching : []);
}

function openProgramModal(programId, opts = {}) {
  const program =
    typeof PROGRAMS !== "undefined"
      ? PROGRAMS.find((p) => p.id === programId)
      : null;
  if (!program) return;
  let step = opts.coachId ? 2 : 1;
  const chosen = { coachId: opts.coachId || null, location: null };
  const render = () => {
    if (step === 1) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 1 of 3 · Pick a coach</span>
        <h3 class="display-m">Who would you like to work with?</h3>
        <div class="step-pick">${COACHES.map(
          (c) =>
            `<button data-coach="${escapeHtml(
              c.id
            )}"><div style="font-weight:700">${escapeHtml(
              c.name
            )}</div><div style="font-size:11px;color:var(--mute);margin-top:2px">${escapeHtml(
              c.specialty || c.role
            )}</div></button>`
        ).join("")}</div>
      `);
      document.querySelectorAll("[data-coach]").forEach((b) =>
        b.addEventListener("click", () => {
          chosen.coachId = b.dataset.coach;
          step = 2;
          render();
        })
      );
    } else if (step === 2) {
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div></div>
        <span class="eyebrow">▸ Step 2 of 3 · Pick a location</span>
        <h3 class="display-m">Where should the session happen?</h3>
        <div class="step-pick">${LOCATIONS.filter((l) => l.status === "open")
          .map(
            (l) =>
              `<button data-loc="${escapeHtml(l.id)}">${escapeHtml(
                l.name
              )} · ${escapeHtml(l.city)}</button>`
          )
          .join("")}</div>
      `);
      document.querySelectorAll(".step-pick [data-loc]").forEach((b) =>
        b.addEventListener("click", () => {
          chosen.location = b.dataset.loc;
          step = 3;
          render();
        })
      );
    } else {
      const num = "KF-COACH-" + Math.floor(1000 + Math.random() * 9000);
      const coach = COACHES.find((c) => c.id === chosen.coachId);
      const loc = LOCATIONS.find((l) => l.id === chosen.location);
      const priceLine = program.priceLabel
        ? `${program.priceLabel} ${program.priceUnit || ""}`.trim()
        : "";
      openModal(`
        <div class="step-row"><div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div></div>
        <span class="eyebrow">▸ Registered</span>
        <div class="confirm-num">${num}</div>
        <h3 class="display-m">${escapeHtml(program.name)} · ${escapeHtml(
        coach.name
      )}</h3>
        <p class="modal-meta">${escapeHtml(loc.name)} · ${escapeHtml(
        loc.city
      )}${priceLine ? " · " + escapeHtml(priceLine) : ""}</p>
        ${
          program.sessions
            ? `<p class="body" style="font-size:13px;margin-bottom:8px"><strong>${escapeHtml(
                program.sessions
              )}</strong> · ${escapeHtml(
                program.sessionLength || ""
              )} · ${escapeHtml(program.ratio || "")}</p>`
            : ""
        }
        <p class="body" style="font-size:13px;margin-bottom:24px">${escapeHtml(
          coach.name
        )} will email you within 24 hours to confirm your start date and weekly slot.</p>
        <button class="btn btn-primary" id="program-done">Done</button>
      `);
      document
        .getElementById("program-done")
        ?.addEventListener("click", closeModal);
    }
  };
  render();
}

function openPrivateContactModal(program, coachId) {
  const coach = coachId ? COACHES.find((c) => c.id === coachId) : null;
  const contact =
    typeof CONTACT_INFO !== "undefined"
      ? CONTACT_INFO
      : { whatsappNumber: "", whatsappUrl: "#", wechatId: "" };
  openModal(`
    <span class="eyebrow">▸ ${escapeHtml(program.name)}</span>
    <h3 class="display-m">${
      coach
        ? `Book privates with ${escapeHtml(coach.name.split(" ")[0])}.`
        : "Let's set up your sessions."
    }</h3>
    <p class="modal-meta">${
      coach ? escapeHtml(coach.specialty || coach.role) + " · " : ""
    }1:1 or 1:2 — message us and we'll match you with a coach and schedule.</p>
    <div class="contact-options">
      <a class="btn btn-primary" href="${escapeHtml(
        contact.whatsappUrl
      )}" target="_blank" rel="noopener">WhatsApp ${escapeHtml(
    contact.whatsappNumber
  )} →</a>
      ${
        contact.wechatId
          ? `<div class="contact-aside">Or WeChat ID <strong>${escapeHtml(
              contact.wechatId
            )}</strong></div>`
          : ""
      }
    </div>
    <div class="contact-divider"><span>or send us a quick note</span></div>
    <div class="form-row"><label>Email</label><input type="email" id="contact-email" placeholder="alex@example.com" /></div>
    <div class="form-row"><label>What are you looking for?</label><input type="text" id="contact-note" placeholder="e.g., 1:1 sessions, focus on smashes" /></div>
    <button class="btn btn-ghost" id="contact-submit" style="width:100%;justify-content:center;margin-top:8px">Send →</button>
  `);
  document.getElementById("contact-submit")?.addEventListener("click", () => {
    const email = document.getElementById("contact-email")?.value.trim();
    if (!email) {
      document.getElementById("contact-email")?.focus();
      return;
    }
    openModal(`
      <span class="eyebrow">▸ Got it</span>
      <h3 class="display-m">We'll be in touch.</h3>
      <p class="modal-meta">A coach will reply to ${escapeHtml(
        email
      )} within 24 hours${
      coach
        ? ` to set up your sessions with ${escapeHtml(
            coach.name.split(" ")[0]
          )}`
        : ""
    }.</p>
      <button class="btn btn-primary" id="contact-done">Done</button>
    `);
    document
      .getElementById("contact-done")
      ?.addEventListener("click", closeModal);
  });
}

function openCoachBioModal(id) {
  const c = COACHES.find((x) => x.id === id);
  if (!c) return;
  const firstName = c.name.split(" ")[0];
  openModal(`
    <div class="modal-img" style="background-image:url('${escapeHtml(
      c.img
    )}')"></div>
    <span class="eyebrow">▸ ${escapeHtml(c.role)}</span>
    <h3 class="display-m">${escapeHtml(c.name)}</h3>
    ${c.specialty ? `<p class="modal-meta">${escapeHtml(c.specialty)}</p>` : ""}
    <p class="body" style="font-size:14px;line-height:1.7;margin-bottom:18px">${escapeHtml(
      c.desc
    )}</p>
    ${
      Array.isArray(c.awards) && c.awards.length
        ? `
      <div class="awards" style="margin-bottom:24px">
        <div class="awards-label">Highlights</div>
        <ul>${c.awards.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
      </div>
    `
        : ""
    }
    ${
      c.rate
        ? `<p class="modal-meta" style="margin-bottom:18px"><strong style="color:var(--cobalt)">$${c.rate}</strong>/hr · privates</p>`
        : ""
    }
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="coach-bio-book">Book with ${escapeHtml(
        firstName
      )} →</button>
      <button class="btn btn-ghost" id="coach-bio-close">Close</button>
    </div>
  `);
  document.getElementById("coach-bio-book")?.addEventListener("click", () => {
    closeModal();
    const privateProgram =
      typeof PROGRAMS !== "undefined"
        ? PROGRAMS.find((p) => p.id === "private")
        : null;
    if (privateProgram) openPrivateContactModal(privateProgram, id);
  });
  document
    .getElementById("coach-bio-close")
    ?.addEventListener("click", closeModal);
}

function openClinicRsvpModal(clinic) {
  if (!clinic) return;
  openModal(`
    <span class="eyebrow">▸ You're in</span>
    <h3 class="display-m">${escapeHtml(clinic.name)}</h3>
    <p class="modal-meta">${escapeHtml(clinic.day)} ${escapeHtml(
    clinic.mo
  )} · ${escapeHtml(clinic.location)} · Coach ${escapeHtml(clinic.coach)}</p>
    <p class="body" style="font-size:13px;margin-bottom:24px">Confirmation sent to your inbox. ${
      clinic.spots
    } spots remained when you booked — see you on the court.</p>
    <button class="btn btn-primary" id="clinic-rsvp-done">Got it</button>
  `);
  document
    .getElementById("clinic-rsvp-done")
    ?.addEventListener("click", closeModal);
}

// === EVENTS PAGE (private events inquiry) ===
function renderEventsPage() {
  const form = document.getElementById("inquiry-form");
  if (!form) return;

  // Populate the location dropdown from LOCATIONS data. Soon-locations stay
  // selectable — a Brooklyn/Queens inquiry is a lead worth keeping.
  const locSelect = form.querySelector("[data-locations]");
  if (locSelect) {
    locSelect.innerHTML = LOCATIONS.map((l) => {
      const label =
        l.status === "soon"
          ? `${l.city.split(" · ")[0]} — opening soon`
          : `${l.name} · ${l.city}`;
      return `<option value="${escapeHtml(l.id)}">${escapeHtml(
        label
      )}</option>`;
    }).join("");
  }

  // Event-type cards — clicking one pre-selects the dropdown and scrolls to the form.
  const typeSelect = form.querySelector("#iq-type");
  document.querySelectorAll("[data-event-type]").forEach((card) => {
    card.addEventListener("click", () => {
      if (typeSelect) typeSelect.value = card.dataset.eventType;
      document
        .getElementById("inquire")
        ?.scrollIntoView({ behavior: "smooth" });
      typeSelect?.focus({ preventScroll: true });
    });
  });

  // Form submit — minimal validation, confirmation modal with reference number.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#iq-name")?.value.trim();
    const email = form.querySelector("#iq-email")?.value.trim();
    const type = form.querySelector("#iq-type")?.value;
    const location = form.querySelector("#iq-location")?.value;

    if (!name) {
      form.querySelector("#iq-name")?.focus();
      return;
    }
    if (!email) {
      form.querySelector("#iq-email")?.focus();
      return;
    }

    const typeLabel =
      form.querySelector(`#iq-type option[value="${type}"]`)?.textContent ||
      type;
    const locObj = LOCATIONS.find((l) => l.id === location);
    const locLabel = locObj ? `${locObj.name} · ${locObj.city}` : location;
    const num = "KF-EV-" + Math.floor(1000 + Math.random() * 9000);

    openModal(`
      <span class="eyebrow">▸ Inquiry received</span>
      <div class="confirm-num">${num}</div>
      <h3 class="display-m">Thanks, ${escapeHtml(name.split(" ")[0])}.</h3>
      <p class="modal-meta">${escapeHtml(typeLabel)} · ${escapeHtml(
      locLabel
    )}</p>
      <p class="body" style="font-size:13px;margin-bottom:24px">We'll text or call you back within 24 hours. If it's urgent, hit us on WhatsApp at +1 551 328 7867.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="inquiry-done">Done</button>
        <a class="btn btn-ghost" href="https://wa.me/15513287867" target="_blank" rel="noopener">WhatsApp now →</a>
      </div>
    `);
    document.getElementById("inquiry-done")?.addEventListener("click", () => {
      closeModal();
      form.reset();
    });
  });
}

// === STRINGING PAGE ===
function renderToggleCatalog({
  root,
  items,
  categories,
  cardMarkup,
  gridClass,
}) {
  if (!root) return;
  const groups = categories
    .map((cat) => ({ cat, list: items.filter((it) => it.category === cat.id) }))
    .filter((g) => g.list.length > 0);

  if (!groups.length) {
    root.innerHTML = "";
    return;
  }

  const tabs = groups
    .map(
      (g, i) => `
    <button class="cat-tab ${
      i === 0 ? "is-active" : ""
    }" type="button" role="tab"
            data-cat="${escapeHtml(g.cat.id)}"
            aria-selected="${i === 0 ? "true" : "false"}">
      ${escapeHtml(g.cat.tabLabel || g.cat.label)}
    </button>
  `
    )
    .join("");

  const panels = groups
    .map(
      (g, i) => `
    <div class="cat-panel ${i === 0 ? "is-active" : ""}" data-cat="${escapeHtml(
        g.cat.id
      )}" role="tabpanel">
      <p class="cat-desc">${escapeHtml(g.cat.desc)}</p>
      <div class="cat-grid ${escapeHtml(gridClass)}">
        ${g.list.map(cardMarkup).join("")}
      </div>
    </div>
  `
    )
    .join("");

  root.innerHTML = `
    <div class="cat-toggle">
      <div class="cat-tabs" role="tablist">${tabs}</div>
      <div class="cat-panels">${panels}</div>
    </div>
  `;

  const tabEls = root.querySelectorAll(".cat-tab");
  const panelEls = root.querySelectorAll(".cat-panel");
  tabEls.forEach((tab) => {
    tab.addEventListener("click", () => {
      const cat = tab.dataset.cat;
      tabEls.forEach((t) => {
        const active = t.dataset.cat === cat;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      panelEls.forEach((p) =>
        p.classList.toggle("is-active", p.dataset.cat === cat)
      );
    });
  });
}

function renderStringingPage() {
  const catalog = document.getElementById("strings-catalog");
  const racketsCatalog = document.getElementById("rackets-catalog");
  if (!catalog && !racketsCatalog) return;

  const dot = (n, max = 5) =>
    Array.from(
      { length: max },
      (_, i) => `<span class="dot ${i < n ? "on" : ""}"></span>`
    ).join("");

  const DEFAULT_STRING_IMG =
    "https://images.unsplash.com/photo-1570953233426-4e235751c6f3?q=80&w=1200&auto=format&fit=crop";

  const stringCardMarkup = (s) => `
    <article class="string-card" data-string-id="${escapeHtml(s.id)}">
      <div class="card-img" style="background-image:url('${escapeHtml(
        s.img || DEFAULT_STRING_IMG
      )}')"></div>
      <div class="card-body">
        <div class="gauge">${escapeHtml(s.gauge || "")}</div>
        <h3 class="name">${escapeHtml(s.name)}</h3>
        <div class="ratings">
          <div class="rating-row"><span class="rlabel">Durability</span><div class="dots">${dot(
            s.durability
          )}</div></div>
          <div class="rating-row"><span class="rlabel">Control</span><div class="dots">${dot(
            s.control
          )}</div></div>
          <div class="rating-row"><span class="rlabel">Power</span><div class="dots">${dot(
            s.power
          )}</div></div>
        </div>
        <div class="meta-row">
          <span class="playstyle">${escapeHtml(s.playstyle || "")}</span>
          <span class="price">$${s.price}<small>/restring</small></span>
        </div>
      </div>
    </article>
  `;

  if (catalog && typeof STRING_CATEGORIES !== "undefined") {
    renderToggleCatalog({
      root: catalog,
      items: STRINGS,
      categories: STRING_CATEGORIES,
      cardMarkup: stringCardMarkup,
      gridClass: "strings-grid",
    });
  }

  const DEFAULT_RACKET_IMG = "assets/badminton-racket.jpg";

  const racketCardMarkup = (r) => `
    <article class="racket-card" data-racket-id="${escapeHtml(r.id)}">
      <div class="card-img" style="background-image:url('${escapeHtml(
        r.img || DEFAULT_RACKET_IMG
      )}')"></div>
      <div class="card-body">
        <span class="rlevel">${escapeHtml(r.level || "")}</span>
        <h3 class="rname">${escapeHtml(r.name)}</h3>
        <div class="rspecs">
          <div><span class="rlabel">Weight</span><strong>${escapeHtml(
            r.weight || ""
          )}</strong></div>
          <div><span class="rlabel">Balance</span><strong>${escapeHtml(
            r.balance || ""
          )}</strong></div>
          <div><span class="rlabel">Flex</span><strong>${escapeHtml(
            r.flex || ""
          )}</strong></div>
        </div>
        <div class="rprice">$${r.price}</div>
      </div>
    </article>
  `;

  if (
    racketsCatalog &&
    typeof RACKET_CATEGORIES !== "undefined" &&
    typeof RACKETS !== "undefined"
  ) {
    renderToggleCatalog({
      root: racketsCatalog,
      items: RACKETS,
      categories: RACKET_CATEGORIES,
      cardMarkup: racketCardMarkup,
      gridClass: "rackets-grid",
    });
  }

  renderFaq("faq-stringing", typeof FAQS !== "undefined" ? FAQS.stringing : []);

  initProshopCarousel();
  initStringQuiz();

  document
    .getElementById("open-spec-primer")
    ?.addEventListener("click", openSpecPrimerModal);
  document
    .getElementById("open-tension-guide")
    ?.addEventListener("click", openTensionGuideModal);
}

const SPEC_PRIMER_SLIDES = [
  {
    num: "01",
    title: "Weight (3U / 4U / 5U)",
    body: "The lower the U, the heavier the frame. <strong>3U (85–89g)</strong> swings heavier and hits harder. <strong>4U (80–84g)</strong> is lighter and faster — most adult players land here. <strong>5U (75–79g)</strong> is junior or beginner-friendly.",
    svg: `
      <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <ellipse cx="60"  cy="78" rx="26" ry="32"/>
          <line   x1="60"  y1="110" x2="60"  y2="160"/>
          <ellipse cx="140" cy="82" rx="22" ry="28"/>
          <line   x1="140" y1="110" x2="140" y2="160"/>
          <ellipse cx="220" cy="86" rx="18" ry="24"/>
          <line   x1="220" y1="110" x2="220" y2="160"/>
        </g>
        <g font-size="13" font-weight="800" letter-spacing="0.1em" text-anchor="middle" fill="currentColor">
          <text x="60"  y="183">3U</text>
          <text x="140" y="183">4U</text>
          <text x="220" y="183">5U</text>
        </g>
      </svg>`,
  },
  {
    num: "02",
    title: "Balance",
    body: "<strong>Head-heavy</strong> rewards smashes — power players and back-court attackers. <strong>Even</strong> balance plays everywhere — the safe pick if you're not sure. <strong>Head-light</strong> moves fastest — front-court doubles, drives, defense.",
    svg: `
      <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <ellipse cx="65" cy="80" rx="28" ry="22"/>
          <line   x1="93" y1="80" x2="240" y2="80"/>
          <line   x1="240" y1="74" x2="240" y2="86"/>
        </g>
        <g fill="currentColor">
          <polygon points="140,100 130,120 150,120"/>
        </g>
        <g font-size="11" font-weight="800" letter-spacing="0.12em" text-anchor="middle" fill="currentColor">
          <text x="80"  y="158">HEAD-HEAVY</text>
          <text x="140" y="158">EVEN</text>
          <text x="210" y="158">HEAD-LIGHT</text>
        </g>
        <g fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" opacity="0.4">
          <line x1="80"  y1="135" x2="80"  y2="100"/>
          <line x1="140" y1="135" x2="140" y2="120"/>
          <line x1="210" y1="135" x2="210" y2="86"/>
        </g>
      </svg>`,
  },
  {
    num: "03",
    title: "Flex",
    body: "<strong>Stiff</strong> shafts return energy fast and reward clean technique — advanced. <strong>Medium</strong> is forgiving and adds free power on slower swings — intermediate. <strong>Flexible</strong> is most forgiving — beginners and players with arm issues.",
    svg: `
      <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line  x1="60"  y1="40"  x2="60"  y2="160"/>
          <path  d="M 140 40 Q 152 100 140 160"/>
          <path  d="M 220 40 Q 248 100 220 160"/>
        </g>
        <g font-size="11" font-weight="800" letter-spacing="0.12em" text-anchor="middle" fill="currentColor">
          <text x="60"  y="183">STIFF</text>
          <text x="140" y="183">MEDIUM</text>
          <text x="220" y="183">FLEXIBLE</text>
        </g>
      </svg>`,
  },
  {
    num: "04",
    title: "Level",
    body: "Manufacturers tag every frame for a target player. <strong>Beginner</strong> = forgiving, light, flexible. <strong>Intermediate</strong> = balanced, builds technique. <strong>Advanced</strong> = stiff, demanding, rewards clean swings — punishes bad ones.",
    svg: `
      <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="currentColor" opacity="0.85">
          <rect x="50"  y="120" width="40" height="40" rx="3"/>
          <rect x="120" y="80"  width="40" height="80" rx="3"/>
          <rect x="190" y="40"  width="40" height="120" rx="3"/>
        </g>
        <g font-size="11" font-weight="800" letter-spacing="0.12em" text-anchor="middle" fill="currentColor">
          <text x="70"  y="183">BEGINNER</text>
          <text x="140" y="183">INTERMEDIATE</text>
          <text x="210" y="183">ADVANCED</text>
        </g>
      </svg>`,
  },
];

function openSpecPrimerModal() {
  let i = 0;

  const renderSlide = () => {
    const total = SPEC_PRIMER_SLIDES.length;
    const s = SPEC_PRIMER_SLIDES[i];
    openModal(`
      <div class="primer">
        <span class="eyebrow">▸ Spec primer · ${String(i + 1).padStart(
          2,
          "0"
        )} / ${String(total).padStart(2, "0")}</span>
        <div class="primer-img">${s.svg}</div>
        <h3 class="primer-title">${escapeHtml(s.title)}</h3>
        <p class="primer-body">${s.body}</p>
        <div class="primer-controls">
          <button class="primer-arrow" type="button" data-action="prev" aria-label="Previous">‹</button>
          <div class="primer-dots" role="tablist">
            ${SPEC_PRIMER_SLIDES.map(
              (_, n) => `
              <button class="primer-dot ${
                n === i ? "is-active" : ""
              }" type="button" role="tab" data-i="${n}" aria-label="Slide ${
                n + 1
              }"></button>
            `
            ).join("")}
          </div>
          <button class="primer-arrow" type="button" data-action="next" aria-label="Next">›</button>
        </div>
      </div>
    `);

    const backdrop = document.getElementById("modal-backdrop");
    backdrop
      .querySelector('[data-action="prev"]')
      .addEventListener("click", () => {
        i = (i - 1 + SPEC_PRIMER_SLIDES.length) % SPEC_PRIMER_SLIDES.length;
        renderSlide();
      });
    backdrop
      .querySelector('[data-action="next"]')
      .addEventListener("click", () => {
        i = (i + 1) % SPEC_PRIMER_SLIDES.length;
        renderSlide();
      });
    backdrop.querySelectorAll(".primer-dot").forEach((d) => {
      d.addEventListener("click", () => {
        i = parseInt(d.dataset.i, 10);
        renderSlide();
      });
    });
  };

  renderSlide();
}

function openTensionGuideModal() {
  openModal(`
    <span class="eyebrow">▸ Tension guide</span>
    <h3 class="display-m" style="margin:8px 0 6px">What feel are you after?</h3>
    <p class="modal-meta">Lower tension is softer, more forgiving, and adds power. Higher tension is crisper, more controlled, and demands clean technique.</p>
    <div class="tension-guide" style="margin-top:8px">
      <div class="tension-bar"></div>
      <div class="tension-marks">
        <div class="tension-mark"><div class="lbs">22 lbs</div><div class="feel">Soft feel</div></div>
        <div class="tension-mark recommended"><div class="lbs">24 lbs</div><div class="feel">Recommend</div></div>
        <div class="tension-mark"><div class="lbs">26 lbs</div><div class="feel">Crisp control</div></div>
        <div class="tension-mark"><div class="lbs">28 lbs</div><div class="feel">Pro level</div></div>
      </div>
    </div>
  `);
}

const STRING_QUIZ_QUESTIONS = [
  {
    id: "level",
    title: "What's your level?",
    options: [
      { value: "beginner", label: "Beginner", desc: "First season or two" },
      {
        value: "intermediate",
        label: "Intermediate",
        desc: "Comfortable rallies, working on placement",
      },
      {
        value: "advanced",
        label: "Advanced",
        desc: "Competitive matches and tournaments",
      },
    ],
  },
  {
    id: "freq",
    title: "How often do you play?",
    options: [
      { value: "low", label: "1–2x per week", desc: "Recreational pace" },
      { value: "mid", label: "3–4x per week", desc: "Regular player" },
      { value: "high", label: "5+x per week", desc: "Daily or near-daily" },
    ],
  },
  {
    id: "style",
    title: "What's your play style?",
    options: [
      {
        value: "defensive",
        label: "Defensive",
        desc: "Consistent rallies, retrieve everything",
      },
      {
        value: "allround",
        label: "All-around",
        desc: "Mix of attack and defense",
      },
      {
        value: "attacking",
        label: "Attacking",
        desc: "Smashes and clears, power game",
      },
      {
        value: "control",
        label: "Tactical",
        desc: "Placement, drops, deception",
      },
    ],
  },
  {
    id: "priority",
    title: "What matters most to you?",
    options: [
      {
        value: "durability",
        label: "Durability",
        desc: "Strings that don't break",
      },
      { value: "power", label: "Power", desc: "Explosive smashes and clears" },
      { value: "control", label: "Control", desc: "Precision and feel" },
      {
        value: "feel",
        label: "Comfort",
        desc: "Softer string, easier on the arm",
      },
    ],
  },
];

function initStringQuiz() {
  const root = document.getElementById("string-quiz");
  if (!root) return;

  let step = 0;
  const answers = {};

  const scoreString = (s) => {
    let v = 0;
    if (answers.level === "beginner") v += s.durability * 1.5;
    if (answers.level === "intermediate")
      v += (s.durability + s.control + s.power) * 0.4;
    if (answers.level === "advanced") v += (s.control + s.power) * 0.9;

    if (answers.freq === "low") v += (s.power + s.control) * 0.3;
    if (answers.freq === "mid")
      v += (s.durability + s.control + s.power) * 0.15;
    if (answers.freq === "high") v += s.durability * 1.2;

    if (answers.style === "defensive") v += (s.durability + s.control) * 0.7;
    if (answers.style === "allround")
      v += (s.durability + s.control + s.power) * 0.35;
    if (answers.style === "attacking") v += s.power * 1.5;
    if (answers.style === "control") v += s.control * 1.5;

    if (answers.priority === "durability") v += s.durability * 2;
    if (answers.priority === "power") v += s.power * 2;
    if (answers.priority === "control") v += s.control * 2;
    if (answers.priority === "feel") {
      // "Feel" rewards low-durability/high-spec strings (thinner gauge = more sensation)
      // and explicitly favors the comfort multifilament — Nanogy 95 is the one
      // string positioned around softness, so it gets a strong bonus.
      const feel =
        6 - s.durability + s.control + (s.id === "yonex-nano95" ? 4 : 0);
      v += feel * 1.1;
    }
    return v;
  };

  const traitsOf = (s) => {
    const t = [];
    if (s.durability >= 4) t.push("durability");
    if (s.control >= 4) t.push("control");
    if (s.power >= 4) t.push("repulsion");
    return t.length ? t.join(", ") : "a balanced feel";
  };

  const dot = (n, max = 5) =>
    Array.from(
      { length: max },
      (_, i) => `<span class="dot ${i < n ? "on" : ""}"></span>`
    ).join("");

  const renderQuestion = (i) => {
    const q = STRING_QUIZ_QUESTIONS[i];
    const dots = STRING_QUIZ_QUESTIONS.map(
      (_, n) => `<div class="quiz-dot ${n <= i ? "active" : ""}"></div>`
    ).join("");
    root.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress">${dots}</div>
        <span class="eyebrow">▸ Question ${i + 1} of ${
      STRING_QUIZ_QUESTIONS.length
    }</span>
        <h3 class="quiz-q">${escapeHtml(q.title)}</h3>
        <div class="quiz-options">
          ${q.options
            .map(
              (o) => `
            <button class="quiz-option" type="button" data-value="${escapeHtml(
              o.value
            )}">
              <span class="quiz-option-label">${escapeHtml(o.label)}</span>
              <span class="quiz-option-desc">${escapeHtml(o.desc)}</span>
            </button>
          `
            )
            .join("")}
        </div>
        ${
          i > 0 ? '<button class="quiz-back" type="button">← Back</button>' : ""
        }
      </div>
    `;
    root.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[q.id] = btn.dataset.value;
        step = i + 1;
        if (step < STRING_QUIZ_QUESTIONS.length) renderQuestion(step);
        else renderResult();
      });
    });
    root.querySelector(".quiz-back")?.addEventListener("click", () => {
      step = i - 1;
      renderQuestion(step);
    });
  };

  const renderResult = () => {
    const ranked = STRINGS.map((s) => ({ s, score: scoreString(s) })).sort(
      (a, b) => b.score - a.score
    );
    const top = ranked[0].s;
    const alt = ranked[1].s;

    root.innerHTML = `
      <div class="quiz-card quiz-result">
        <span class="eyebrow">▸ Your match</span>
        <h3 class="quiz-result-name">${escapeHtml(top.name)}</h3>
        <p class="quiz-result-why">Picked for ${escapeHtml(
          traitsOf(top)
        )} — matched against your level, frequency, and play style.</p>
        <div class="quiz-result-stats">
          <div><span class="rlabel">Durability</span><div class="dots">${dot(
            top.durability
          )}</div></div>
          <div><span class="rlabel">Control</span><div class="dots">${dot(
            top.control
          )}</div></div>
          <div><span class="rlabel">Power</span><div class="dots">${dot(
            top.power
          )}</div></div>
          <div><span class="rlabel">Price</span><strong class="quiz-price">$${
            top.price
          }</strong></div>
        </div>
        <p class="quiz-result-desc">${escapeHtml(top.desc)}</p>
        <div class="quiz-result-alt">
          <span class="rlabel">Runner-up</span>
          <strong>${escapeHtml(alt.name)}</strong>
          <span class="alt-meta">— if you want more ${escapeHtml(
            traitsOf(alt)
          )}</span>
        </div>
        <div class="quiz-result-actions">
          <button class="btn btn-primary" type="button" data-action="see">See in catalog ↓</button>
          <button class="btn btn-ghost" type="button" data-action="restart">Retake quiz</button>
        </div>
      </div>
    `;
    root.querySelector('[data-action="see"]')?.addEventListener("click", () => {
      const card = document.querySelector(
        `.string-card[data-string-id="${top.id}"]`
      );
      if (!card) return;
      document
        .querySelectorAll(".string-card.is-recommended")
        .forEach((c) => c.classList.remove("is-recommended"));
      card.classList.add("is-recommended");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => card.classList.remove("is-recommended"), 4000);
    });
    root
      .querySelector('[data-action="restart"]')
      ?.addEventListener("click", () => {
        Object.keys(answers).forEach((k) => delete answers[k]);
        step = 0;
        renderQuestion(0);
      });
  };

  renderQuestion(0);
}

function initProshopCarousel() {
  const root = document.getElementById("proshop-carousel");
  if (!root) return;
  const slides = Array.from(root.querySelectorAll(".proshop-slide"));
  const dots = Array.from(root.querySelectorAll(".proshop-dot"));
  const prev = root.querySelector(".proshop-prev");
  const next = root.querySelector(".proshop-next");
  if (slides.length < 2) return;

  let index = 0;
  let timer = 0;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const active = n === index;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach((d, n) => {
      const active = n === index;
      d.classList.toggle("is-active", active);
      d.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  const stepBy = (delta) => {
    show(index + delta);
    restart();
  };

  const start = () => {
    timer = window.setInterval(() => show(index + 1), 5500);
  };
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = 0;
    }
  };
  const restart = () => {
    stop();
    start();
  };

  prev?.addEventListener("click", () => stepBy(-1));
  next?.addEventListener("click", () => stepBy(1));
  dots.forEach((d, n) =>
    d.addEventListener("click", () => {
      show(n);
      restart();
    })
  );

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  start();
}

// === FAQ PAGE ===
function renderFaqPage() {
  // Each category gets its own accordion via the existing renderFaq helper.
  if (typeof FAQS !== "undefined") {
    renderFaq("faq-general", FAQS.general);
    renderFaq("faq-booking", FAQS.booking);
    renderFaq("faq-hours", FAQS.hours);
    renderFaq("faq-courts", FAQS.courts);
  }

  // WeChat copy button — copies the WeChat ID to clipboard with a hint.
  const wechatBtn = document.getElementById("faq-wechat-copy");
  if (wechatBtn && typeof CONTACT_INFO !== "undefined") {
    wechatBtn.addEventListener("click", () => {
      const id = CONTACT_INFO.wechatId;
      navigator.clipboard
        ?.writeText(id)
        .then(() => {
          const hint = document.getElementById("faq-wechat-hint");
          if (hint) {
            hint.textContent = "Copied!";
            setTimeout(() => {
              hint.textContent = "Click to copy WeChat ID";
            }, 1500);
          }
        })
        .catch(() => {
          const hint = document.getElementById("faq-wechat-hint");
          if (hint) hint.textContent = "Copy manually: " + id;
        });
    });
  }
}

function initAnnounceBar() {
  const bar = document.getElementById("announce-bar");
  if (!bar) return;
  if (sessionStorage.getItem("kotofit-announce-dismissed") === "1") {
    bar.classList.add("dismissed");
    document.body.classList.add("announce-dismissed");
  }
  document.getElementById("announce-close")?.addEventListener("click", () => {
    bar.classList.add("dismissed");
    document.body.classList.add("announce-dismissed");
    sessionStorage.setItem("kotofit-announce-dismissed", "1");
  });
}

// === THEME TOGGLE ===
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("kotofit-theme", next);
    } catch (e) {
      /* ignore */
    }
  });
}

// === PAGE INIT ===
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initAnnounceBar();
  initHero();
  initHeroToggle();
  initNavHighlight();
  initMobileMenu();
  renderLocations();
  initBooking();
  renderPlay();
  renderMemberships();
  renderCoachesHomepage();
  renderEventsHomepage();
  // Page-specific renderers (no-ops if their target elements don't exist):
  if (typeof renderLocationsPage === "function") renderLocationsPage();
  if (typeof renderMembershipsPage === "function") renderMembershipsPage();
  if (typeof renderCoachingPage === "function") renderCoachingPage();
  if (typeof renderEventsPage === "function") renderEventsPage();
  if (typeof renderStringingPage === "function") renderStringingPage();
  if (typeof renderFaqPage === "function") renderFaqPage();
  initReveal();
});
