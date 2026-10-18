/* Tech Towhed — static site logic (content-driven, no backend) */
"use strict";

/* ---------- tiny helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- icon library ---------- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  badge: '<path d="M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4z"/><path d="m9 12 2 2 4-4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
  rocket: '<path d="M12 2c4 2 6 6 6 10l3 3-4 1c-1 2-3 4-5 5-1-2-2-3-2-5l-3-1 2-3c0-4 1-8 3-10z"/><circle cx="12" cy="10" r="1.6"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2z"/>',
  spark: '<path d="M12 2v6m0 8v6M2 12h6m8 0h6M5 5l4 4m6 6 4 4M19 5l-4 4M9 15l-4 4"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
  chat: '<path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/>',
  play: '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3V9z"/>',
  brief: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m5 19 5-5 3 3 3-3 3 3"/>',
};
const IC_COLORS = ["ic-purple", "ic-cyan", "ic-green"];
const svgIcon = (name, cls) =>
  `<span class="ic ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.spark}</svg></span>`;
// icon value can be an emoji or one of the built-in svg names above
const serviceIcon = (value, cls) => {
  const v = String(value || "").trim();
  if (!v) return svgIcon("spark", cls);
  if (ICONS[v]) return svgIcon(v, cls);
  return `<span class="ic ${cls}" style="font-size:1.6rem">${esc(v)}</span>`;
};

/* ---------- theme ---------- */
(function theme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("tt-theme");
  if (saved) root.setAttribute("data-theme", saved);
  const sync = () => {
    const dark = root.getAttribute("data-theme") !== "light";
    $("#iconMoon").style.display = dark ? "" : "none";
    $("#iconSun").style.display = dark ? "none" : "";
  };
  sync();
  $("#themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("tt-theme", next);
    sync();
  });
})();

/* ---------- header / nav ---------- */
const header = $("#siteHeader");
addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 24), { passive: true });

const mm = $("#mobileMenu");
$("#burger").addEventListener("click", () => mm.classList.add("open"));
$("#mmClose").addEventListener("click", () => mm.classList.remove("open"));
mm.addEventListener("click", (e) => { if (e.target === mm) mm.classList.remove("open"); });
$$(".mm-link", mm).forEach((a) => a.addEventListener("click", () => mm.classList.remove("open")));

// scroll-spy
const spySections = ["home", "services", "work", "reviews", "about", "contact"];
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      $$("#navLinks a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
      $$(".mm-link", mm).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
spySections.forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

// reveal on scroll
const revealer = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
  { threshold: 0.12 }
);
$$(".reveal").forEach((el) => revealer.observe(el));

/* ---------- ambient particles ---------- */
(function particles() {
  const c = $("#bg-canvas");
  if (!c) return;
  const ctx = c.getContext("2d");
  let W, H, pts = [];
  const resize = () => {
    W = c.width = innerWidth; H = c.height = innerHeight;
    pts = Array.from({ length: Math.min(70, W / 22) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      a: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? "124,92,252" : "54,217,255",
    }));
  };
  resize(); addEventListener("resize", resize);
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `rgba(${p.hue},${p.a})`; ctx.fill();
    }
    requestAnimationFrame(tick);
  })();
})();

/* ---------- content rendering ---------- */
const emptyState = (title, sub) =>
  `<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${ICONS.image}</svg><b>${esc(title)}</b><p>${esc(sub)}</p></div>`;

// Renders the brand name with the first word ("Tech") glowing.
// HTML-escapes everything first, so admin-set brand names stay XSS-safe.
function renderBrand(el, name) {
  if (!el) return;
  const parts = String(name || "Tech Towhed").split(/(\s+)/);
  let first = true;
  el.innerHTML = parts
    .map((p) => {
      if (!first || /^\s*$/.test(p)) return esc(p);
      first = false;
      return `<span class="glow-tech">${esc(p)}</span>`;
    })
    .join("");
}

async function loadJSON(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}
const asArray = (d, key) => (Array.isArray(d) ? d : (d && Array.isArray(d[key]) ? d[key] : []));

function renderSettings(s) {
  document.title = `${s.brandName || "Tech Towhed"} — ${s.tagline || "Digital Marketing"}`;
  renderBrand($("#brandName"), s.brandName);
  $("#brandTagline").textContent = s.tagline || "";
  if (s.logo) {
    const img = $("#brandLogo");
    img.src = s.logo; img.alt = (s.brandName || "Tech Towhed") + " logo"; img.style.display = "";
  }
  renderBrand($("#footBrand"), s.brandName);
  $("#footBrand2").textContent = s.brandName || "Tech Towhed";
  $("#footNote").textContent = s.tagline || "";
  $("#heroTitle").textContent = s.heroTitle || "";
  $("#heroSub").textContent = s.heroSubtitle || "";
  $("#heroCta1").textContent = s.heroCtaText || "Let's Work Together";
  $("#aboutHeading").textContent = s.aboutHeading || "";
  $("#aboutText").textContent = s.aboutText || "";
  if (s.profilePhoto) {
    $("#aboutPhotoPlaceholder").style.display = "none";
    let img = $("#aboutPhotoImg");
    if (!img) { img = document.createElement("img"); img.id = "aboutPhotoImg"; img.alt = "Profile photo"; $("#aboutPhoto").prepend(img); }
    img.src = s.profilePhoto;
  }
  // contact info rows
  const rows = [];
  if (s.email) rows.push(`<a class="info-row" href="mailto:${esc(s.email)}">${svgIcon("mail", "ic-purple")}<span><b>Email</b><small>${esc(s.email)}</small></span></a>`);
  if (s.whatsapp) {
    const wa = String(s.whatsapp).replace(/[^0-9+]/g, "");
    rows.push(`<a class="info-row" href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">${svgIcon("chat", "ic-green")}<span><b>WhatsApp</b><small>${esc(s.whatsapp)}</small></span></a>`);
  }
  $("#contactInfo").innerHTML = rows.join("") || `<p style="color:var(--text-3)">Add your email / WhatsApp in <b>/admin → Site Settings</b> and they will appear here.</p>`;
  // socials
  const socials = [
    [s.socialLinks && s.socialLinks.facebook, "Facebook", '<path d="M14 8h3V5h-3a4 4 0 0 0-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9a1 1 0 0 1 1-1z"/>'],
    [s.socialLinks && s.socialLinks.instagram, "Instagram", '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'],
    [s.socialLinks && s.socialLinks.linkedin, "LinkedIn", '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3"/>'],
    [s.socialLinks && s.socialLinks.youtube, "YouTube", '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3V9z"/>'],
  ].filter(([url]) => url && String(url).trim());
  $("#socials").innerHTML = socials.map(([url, label, path]) =>
    `<a class="icon-btn" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(label)}" title="${esc(label)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${path}</svg></a>`).join("");
  return s;
}

function renderServices(services) {
  const grid = $("#servicesGrid");
  if (!services.length) { grid.innerHTML = emptyState("Services coming soon", "Add services from /admin → Services."); return; }
  grid.innerHTML = services.map((s, i) => `
    <article class="card reveal in">
      ${serviceIcon(s.icon, IC_COLORS[i % 3])}
      <h3>${esc(s.title)}</h3>
      <p class="desc">${esc(s.description)}</p>
      <a class="btn btn-glass" href="#contact" data-service="${esc(s.title)}">Get This Service</a>
    </article>`).join("");
  $$("#servicesGrid [data-service]").forEach((a) => a.addEventListener("click", () => {
    const sel = $("#cfService");
    if (!sel) return;
    [...sel.options].forEach((o) => { if (o.text === a.dataset.service) sel.value = o.value; });
  }));
  const sel = $("#cfService");
  if (sel) sel.innerHTML = `<option value="">Select a service…</option>` + services.map((s) => `<option>${esc(s.title)}</option>`).join("");
}

let ALL_PROJECTS = [];
let activeTag = "All";

function renderProjectFilters() {
  const tags = ["All", ...new Set(ALL_PROJECTS.flatMap((p) => p.tags || []).filter(Boolean))];
  $("#filters").innerHTML = tags.map((t) =>
    `<button class="chip${t === activeTag ? " active" : ""}" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
  $$("#filters .chip").forEach((ch) => ch.addEventListener("click", () => {
    activeTag = ch.dataset.tag;
    $$("#filters .chip").forEach((x) => x.classList.toggle("active", x === ch));
    renderProjects();
  }));
}

function renderProjects() {
  const grid = $("#projectsGrid");
  const list = activeTag === "All" ? ALL_PROJECTS : ALL_PROJECTS.filter((p) => (p.tags || []).includes(activeTag));
  if (!list.length) {
    grid.innerHTML = emptyState("No projects here yet", activeTag === "All" ? "Add projects from /admin → Projects." : `Nothing tagged “${activeTag}” yet.`);
    return;
  }
  grid.innerHTML = list.map((p) => `
    <article class="card work-card">
      <div class="work-thumb">
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : ""}
        ${(p.tags && p.tags[0]) ? `<span class="cat">${esc(p.tags[0])}</span>` : ""}
      </div>
      <div class="work-body">
        <h3>${esc(p.title)}</h3>
        ${p.description ? `<p class="desc">${esc(p.description)}</p>` : ""}
        ${(p.tags && p.tags.length) ? `<div style="display:flex;gap:8px;flex-wrap:wrap">${p.tags.map((t) => `<span class="badge" style="font-size:.72rem;padding:5px 12px">${esc(t)}</span>`).join("")}</div>` : ""}
        ${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener" style="font-weight:600;color:var(--accent-2);font-size:.9rem">View project →</a>` : ""}
      </div>
    </article>`).join("");
}

let tstIdx = 0, tstTimer = null;
function renderTestimonials(ts) {
  const track = $("#tstTrack"), nav = $("#tstNav");
  if (!ts.length) {
    track.innerHTML = emptyState("Client stories coming soon", "Add testimonials from /admin → Testimonials.");
    nav.innerHTML = ""; return;
  }
  track.innerHTML = ts.map((t, i) => `
    <div class="tst-slide${i === 0 ? " active" : ""}">
      <div class="stars">★★★★★</div>
      <p class="tst-quote">${esc(t.text)}</p>
      <div class="tst-who">
        <span class="tst-avatar">${esc((t.name || "?").trim()[0] || "?").toUpperCase()}</span>
        <div><b>${esc(t.name)}</b><small>${esc(t.role || "")}</small></div>
      </div>
    </div>`).join("");
  nav.innerHTML = ts.map((_, i) => `<button class="tst-dot${i === 0 ? " active" : ""}" data-i="${i}" aria-label="Testimonial ${i + 1}"></button>`).join("");
  const go = (i) => {
    tstIdx = (i + ts.length) % ts.length;
    $$(".tst-slide", track).forEach((s, k) => s.classList.toggle("active", k === tstIdx));
    $$(".tst-dot", nav).forEach((d, k) => d.classList.toggle("active", k === tstIdx));
  };
  $$(".tst-dot", nav).forEach((d) => d.addEventListener("click", () => { go(+d.dataset.i); restart(); }));
  const restart = () => { clearInterval(tstTimer); tstTimer = setInterval(() => go(tstIdx + 1), 6000); };
  restart();
}

/* ---------- load all content ---------- */
let SETTINGS = {};
(async function load() {
  try {
    SETTINGS = await loadJSON("content/settings.json");
  } catch (e) {
    SETTINGS = {};
  }
  renderSettings(SETTINGS);

  try {
    renderServices(asArray(await loadJSON("content/services.json"), "services"));
  } catch (e) {
    $("#servicesGrid").innerHTML = emptyState("Couldn't load services", "Check that content/services.json exists and is valid JSON.");
  }

  try {
    const idx = await loadJSON("content/projects-index.json");
    const files = asArray(idx, "files");
    ALL_PROJECTS = (await Promise.all(files.map(async (f) => {
      try { return await loadJSON("content/" + f); } catch (e) { return null; }
    }))).filter(Boolean);
    // featured first
    ALL_PROJECTS.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } catch (e) {
    ALL_PROJECTS = [];
  }
  renderProjectFilters();
  renderProjects();

  try {
    renderTestimonials(asArray(await loadJSON("content/testimonials.json"), "testimonials"));
  } catch (e) {
    $("#tstTrack").innerHTML = emptyState("Couldn't load testimonials", "Check that content/testimonials.json exists and is valid JSON.");
  }
})();

/* ---------- contact form ---------- */
// Default: Netlify Forms handles the POST (zero config) when formEndpoint is empty.
// If formEndpoint is set in /admin → Site Settings, POST the form as JSON there instead.
$("#contactForm").addEventListener("submit", async (e) => {
  const endpoint = (SETTINGS.formEndpoint || "").trim();
  if (!endpoint) return; // let Netlify Forms handle it natively
  e.preventDefault();
  const btn = $("#cfSubmit"), msg = $("#cfMsg");
  msg.className = "form-msg"; msg.textContent = "";
  btn.disabled = true; btn.style.opacity = 0.7;
  const data = Object.fromEntries(new FormData(e.target).entries());
  delete data["bot-field"];
  try {
    const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error("The form endpoint returned an error (" + r.status + ").");
    msg.classList.add("ok"); msg.textContent = "Message sent! I'll get back to you soon.";
    e.target.reset();
  } catch (err) {
    msg.classList.add("err"); msg.textContent = "Couldn't send your message: " + err.message;
  } finally {
    btn.disabled = false; btn.style.opacity = 1;
  }
});
