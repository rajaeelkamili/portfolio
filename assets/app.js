(function () {
  "use strict";
  var D = window.I18N, P = window.PROJECTS, S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lang = store.get("lang") || ((navigator.language || "en").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
  var filter = "all", query = "", current = null;

  var ICONS = {
    agent: '<circle cx="12" cy="9" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/><path d="M12 2v2M3 9h2M19 9h2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6M11 8v6"/>',
    pipeline: '<rect x="2" y="8" width="5" height="8" rx="1"/><rect x="9.5" y="8" width="5" height="8" rx="1"/><rect x="17" y="8" width="5" height="8" rx="1"/><path d="M7 12h2.5M14.5 12H17"/>',
    text: '<path d="M4 6h16M4 11h16M4 16h10"/><path d="M17 15l2 2 3-4"/>',
    xray: '<path d="M12 3v18"/><path d="M12 8c-3-3-7-1-7 4 0 4 2 7 5 7M12 8c3-3 7-1 7 4 0 4-2 7-5 7"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    ship: '<path d="M3 17l2 3h14l2-3-9-3z"/><path d="M12 14V4l6 8"/>',
    wave: '<path d="M2 12h3l2-6 3 12 3-9 2 3h7"/>',
    mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    radio: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    factory: '<path d="M3 21V10l6 4V10l6 4V6h6v15z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="m12 8 3 2-1 4h-4l-1-4z"/><path d="M12 3v5M15 10l5-2M14 14l3 5M10 14l-3 5M9 10 4 8"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/><path d="M7 12h3l1.5-3 2 5 1.5-2h2"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    workflow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M9 6h6M6 9v3h12V9M12 12v3"/>',
    building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5l-5.5 5.5M12 11.5l5.5 5.5"/>',
    search2: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  };
  function icon(n, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || ICONS.grid) + "</svg>"; }
  function tx(o) { return o && typeof o === "object" && !Array.isArray(o) && ("en" in o || "fr" in o) ? o[lang] || o.en : o; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function set(id, html) { var e = document.getElementById(id); if (e) e.innerHTML = html; }

  /* ---------- render ---------- */
  function render() {
    var t = D[lang];
    document.documentElement.lang = lang;
    document.title = lang === "fr"
      ? "Rajae Elkamili · Étudiante ingénieure IA/ML · IA agentique & MLOps"
      : "Rajae Elkamili · AI/ML Engineering Student · Agentic AI & MLOps";
    set("nav", [["about", "about"], ["projects", "projects"], ["experience", "experience"], ["skills", "skills"], ["contact", "contact"]]
      .map(function (n) { return '<a href="#' + n[0] + '" data-nav="' + n[0] + '">' + t.nav[n[1]] + "</a>"; }).join(""));
    $("#lang").textContent = lang === "fr" ? "EN" : "FR";
    var dark = document.documentElement.dataset.theme !== "light";
    $("#theme").innerHTML = icon(dark ? "sun" : "moon", 2);

    set("h-badge", t.hero.badge); set("h-eyebrow", t.hero.eyebrow); set("h-t1", t.hero.title1 + " "); set("h-t2", t.hero.title2);
    set("h-lede", t.hero.lede); set("h-c1", t.hero.cta1 + " ↓"); set("h-c2", t.hero.cta2); set("h-c3", t.hero.cta3);
    $("#h-c2").href = S.cv; $("#c-cv").href = S.cv;
    set("fig-cap", lang === "fr" ? "Projet privé : architecture présentée à haut niveau." : "Private project: architecture shown at a high level.");

    var counts = [P.length].concat(t.stats.slice(1).map(function (s) { return s.n; }));
    set("stats", t.stats.map(function (s, i) {
      return '<div class="stat"><b data-n="' + counts[i] + '" data-s="' + s.s + '">' + counts[i] + s.s + "</b><span>" + s.l + "</span></div>";
    }).join(""));

    var a = t.about;
    set("a-eyebrow", a.eyebrow.replace(/^(\d+)/, "<b>$1</b>")); set("a-title", a.title);
    set("a-p1", a.p1); set("a-p2", a.p2); set("a-p3", a.p3); set("a-focus-t", a.focusTitle);
    set("a-focus", a.focus.map(function (f) { return '<div class="mini"><h4>' + f[0] + "</h4><p>" + f[1] + "</p></div>"; }).join(""));
    set("a-edu-t", a.eduTitle);
    set("a-edu", a.edu.map(function (e) { return "<div><small>" + e[0] + "</small><b>" + e[1] + "</b><span>" + e[2] + "</span></div>"; }).join(""));
    set("a-lang-t", a.langTitle);
    set("a-lang", a.langs.map(function (l) { return '<div class="lang"><div><span>' + l[0] + "</span><small>" + l[1] + '</small></div><i><b data-w="' + l[2] + '"></b></i></div>'; }).join(""));

    var p = t.projects;
    set("p-eyebrow", p.eyebrow.replace(/^(\d+)/, "<b>$1</b>")); set("p-title", p.title); set("p-intro", p.intro);
    set("p-more-t", p.moreTitle); set("p-more", p.moreText); set("p-more-l", p.links.more + " ↗");
    renderFilters(); renderGrid();

    var e = t.exp;
    set("e-eyebrow", e.eyebrow.replace(/^(\d+)/, "<b>$1</b>")); set("e-title", e.title);
    set("tl", e.items.map(function (j) {
      return '<article class="job reveal"><div class="date">' + j.date + "</div><div><h3>" + j.role + '</h3><p class="org">' + j.org + "</p><ul>" +
        j.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") + '</ul><div class="tags">' + j.tags.map(function (g) { return "<span>" + g + "</span>"; }).join("") + "</div></div></article>";
    }).join(""));

    var s = t.skills;
    set("s-eyebrow", s.eyebrow.replace(/^(\d+)/, "<b>$1</b>")); set("s-title", s.title);
    set("sk", s.groups.map(function (g) { return '<div class="grp reveal"><h3>' + g[0] + '</h3><div class="tags">' + g[1].map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div></div>"; }).join(""));
    set("s-cert-t", s.certTitle); set("s-learn-t", s.learnTitle);
    set("certs", s.certs.map(function (c) { return '<div class="cert"><b>' + c[0] + "</b><span>" + c[1] + "</span></div>"; }).join(""));
    set("learn", s.learn.map(function (x) { return "<li>" + x + "</li>"; }).join(""));

    var c = t.contact;
    set("c-eyebrow", c.eyebrow.replace(/^(\d+)/, "<b>$1</b>")); set("c-title", c.title); set("c-text", c.text);
    set("c-mail", c.mail + " ↗"); set("c-copy", c.copy); set("c-cv", t.hero.cta2);
    set("f-note", t.footer); set("f-top", t.top + " ↑"); set("year", new Date().getFullYear());
    observe();
    if (current) openProject(current, true);
  }

  function visible() {
    var q = query.trim().toLowerCase();
    return P.filter(function (p) {
      if (filter !== "all" && p.cats.indexOf(filter) < 0) return false;
      if (!q) return true;
      var hay = [tx(p.title), tx(p.tag), p.stack.join(" "), tx(p.org || "")].join(" ").toLowerCase();
      return hay.indexOf(q) >= 0;
    });
  }
  function renderFilters() {
    var t = D[lang].projects.filters, keys = ["all", "agentic", "ml", "fullstack", "mobile", "iot"];
    set("filters", keys.map(function (k) {
      var n = k === "all" ? P.length : P.filter(function (p) { return p.cats.indexOf(k) >= 0; }).length;
      return '<button data-f="' + k + '" class="' + (k === filter ? "on" : "") + '" aria-pressed="' + (k === filter) + '">' + t[k] + '<span class="count">' + n + "</span></button>";
    }).join("") + '<label class="search">' + icon("search2", 2) + '<input id="q" type="search" placeholder="' + esc(D[lang].projects.search) + '" value="' + esc(query) + '" aria-label="' + esc(D[lang].projects.search) + '"></label>');
    $$("#filters button").forEach(function (b) { b.onclick = function () { filter = b.dataset.f; renderFilters(); renderGrid(); }; });
    var qi = $("#q");
    qi.oninput = function () { query = qi.value; renderGrid(); };
  }
  function renderGrid() {
    var t = D[lang].projects, list = visible();
    set("grid", list.length ? list.map(function (p, i) {
      var shot = p.gallery && !p.galleryWide ? '<img loading="lazy" src="' + p.gallery[0] + '" alt="">' : "";
      return '<button class="card" data-id="' + p.id + '" style="animation-delay:' + (i * 40) + 'ms" aria-label="' + esc(tx(p.title)) + '">' +
        '<div class="thumb"><span class="pill ' + p.status + '">' + t.status[p.status] + "</span>" + (p.featured ? '<span class="star">★</span>' : "") + icon(p.icon, 1.3) + shot + "</div>" +
        '<div class="body"><small>' + esc(p.year + (p.org ? " · " + tx(p.org) : "")) + "</small><h3>" + esc(tx(p.title)) + "</h3><p>" + esc(tx(p.tag)) + '</p><div class="tags">' +
        p.stack.slice(0, 4).map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div></div></button>";
    }).join("") : '<p class="none">' + t.none + "</p>");
    $$("#grid .card").forEach(function (b) { b.onclick = function () { openProject(b.dataset.id); }; });
  }

  /* ---------- modal ---------- */
  var lastFocus = null;
  function openProject(id, silent) {
    var p = P.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var t = D[lang].projects, L = t.labels;
    current = id;
    var h = '<button class="x" aria-label="' + t.close + '" id="xbtn">✕</button><div class="sh-head"><div class="row"><span class="pill public" style="position:static">' + t.status[p.status] + "</span>" +
      '<span class="pill" style="position:static">' + esc(p.year + (p.org ? " · " + tx(p.org) : "")) + '</span></div><h3 id="m-title">' + esc(tx(p.title)) + "</h3><p>" + esc(tx(p.tag)) + "</p></div><div class=\"sh-body\">";
    if (p.problem) h += "<div><h4>" + L.problem + "</h4><p>" + esc(tx(p.problem)) + "</p></div>";
    if (p.approach) h += "<div><h4>" + L.approach + "</h4><ul>" + tx(p.approach).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    if (p.chart) {
      var c = p.chart, span = c.max - c.min;
      h += '<div class="chart"><b>' + esc(tx(c.title)) + "</b>" + c.data.map(function (d, i) {
        return '<div class="bar-row' + (i === c.hi ? " hi" : "") + '"><span>' + esc(d[0]) + '</span><i><u data-w="' + Math.round(((d[1] - c.min) / span) * 100) + '"></u></i><em>' + d[1].toFixed(1) + "%</em></div>";
      }).join("") + "<small>" + (lang === "fr" ? "L'axe commence à " : "Axis starts at ") + c.min + "%</small></div>";
    }
    if (p.results) h += "<div><h4>" + L.results + "</h4><ul>" + tx(p.results).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    if (p.gallery) h += "<div><h4>" + L.gallery + '</h4><div class="gal' + (p.galleryWide ? " wide" : "") + '">' + p.gallery.map(function (g) { return '<img loading="lazy" src="' + g + '" alt="' + esc(tx(p.title)) + '">'; }).join("") + "</div></div>";
    h += "<div><h4>" + L.stack + '</h4><div class="tags">' + p.stack.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div></div>";
    if (p.notes) h += '<div class="note">' + esc(tx(p.notes)) + "</div>";
    if (p.links) {
      h += '<div class="links">' + (p.links.repo ? '<a class="btn solid" target="_blank" rel="noreferrer" href="' + p.links.repo + '">' + t.links.repo + " ↗</a>" : "") +
        (p.links.demo ? '<a class="btn plain" target="_blank" rel="noreferrer" href="' + p.links.demo + '">' + t.links.demo + " ↗</a>" : "") + "</div>";
    }
    h += "</div>";
    set("sheet", h);
    var ov = $("#overlay");
    if (!silent) lastFocus = document.activeElement;
    ov.classList.add("open"); document.body.style.overflow = "hidden"; ov.scrollTop = 0;
    $("#xbtn").onclick = closeProject;
    if (!silent) { try { history.replaceState(null, "", "#project=" + id); } catch (e) {} $("#xbtn").focus(); }
    setTimeout(function () { $$(".bar-row u").forEach(function (u) { u.style.width = u.dataset.w + "%"; }); }, 60);
  }
  function closeProject() {
    $("#overlay").classList.remove("open"); document.body.style.overflow = ""; current = null;
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $("#overlay").addEventListener("click", function (e) { if (e.target.id === "overlay") closeProject(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && current) closeProject();
    if (e.key === "Tab" && current) {
      var f = $$("#sheet a,#sheet button"); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- UI wiring ---------- */
  $("#lang").onclick = function () { lang = lang === "fr" ? "en" : "fr"; store.set("lang", lang); render(); };
  $("#theme").onclick = function () {
    var next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next; store.set("theme", next);
    $('meta[name="theme-color"]').content = next === "light" ? "#f7f8f4" : "#090b0a"; render();
  };
  $("#menu").onclick = function () { var o = $("#nav").classList.toggle("open"); this.setAttribute("aria-expanded", String(o)); };
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("#nav a")) { $("#nav").classList.remove("open"); } });
  $("#c-copy").onclick = function () {
    var b = this, done = function () { var o = b.textContent; b.textContent = D[lang].contact.copied + " ✓"; setTimeout(function () { b.textContent = D[lang].contact.copy; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(S.email).then(done, function () {}); else done();
  };

  /* progress bar + active nav */
  var prog = $("#progress");
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    var cur = "";
    ["about", "projects", "experience", "skills", "contact"].forEach(function (id) {
      var el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 140) cur = id;
    });
    $$("#nav a").forEach(function (a) { a.classList.toggle("active", a.dataset.nav === cur); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* reveal + counters + bars */
  var io = null;
  function observe() {
    if (!("IntersectionObserver" in window) || reduce) {
      $$(".reveal").forEach(function (e) { e.classList.add("show"); });
      $$(".lang b").forEach(function (b) { b.style.width = b.dataset.w + "%"; });
      return;
    }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var el = x.target; io.unobserve(el);
        if (el.classList.contains("reveal")) el.classList.add("show");
        if (el.classList.contains("lang")) { var b = $("b", el); b.style.width = b.dataset.w + "%"; }
        if (el.classList.contains("stat")) count($("b", el));
      });
    }, { threshold: 0.15 });
    $$(".reveal,.lang,.stat").forEach(function (e) { io.observe(e); });
  }
  function count(b) {
    var n = +b.dataset.n, s = b.dataset.s, start = null;
    function step(ts) { if (!start) start = ts; var k = Math.min((ts - start) / 1100, 1); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + (k === 1 ? s : ""); if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  /* typed roles */
  var ti = 0, ci = 0, del = false, tm;
  function typed() {
    var el = $("#typed"), words = D[lang].hero.roles, w = words[ti % words.length];
    if (reduce) { el.textContent = words.join(" · "); return; }
    ci += del ? -1 : 1; el.textContent = w.slice(0, ci);
    var d = del ? 35 : 75;
    if (!del && ci === w.length) { del = true; d = 1400; } else if (del && ci === 0) { del = false; ti++; d = 350; }
    clearTimeout(tm); tm = setTimeout(typed, d);
  }

  /* hero network canvas */
  function net() {
    var cv = $("#net"); if (!cv || reduce) return;
    var ctx = cv.getContext("2d"), W, H, pts = [], mx = -999, my = -999, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, (W * H) / 18000)); pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 });
    }
    size(); window.addEventListener("resize", size);
    cv.parentElement.addEventListener("mousemove", function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    cv.parentElement.addEventListener("mouseleave", function () { mx = my = -999; });
    var on = true; document.addEventListener("visibilitychange", function () { on = !document.hidden; if (on) loop(); });
    function color() { return getComputedStyle(document.documentElement).getPropertyValue("--green").trim() || "#a3e635"; }
    function loop() {
      if (!on) return;
      ctx.clearRect(0, 0, W, H); var g = color();
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        var dm = Math.hypot(p.x - mx, p.y - my);
        if (dm < 140) { p.x += (p.x - mx) * 0.004; p.y += (p.y - my) * 0.004; }
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fillStyle = g; ctx.globalAlpha = 0.8; ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) { ctx.globalAlpha = (1 - d / 120) * 0.35; ctx.strokeStyle = g; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* init */
  render(); onScroll(); typed(); net();
  var m = location.hash.match(/^#project=([\w-]+)/);
  if (m) openProject(m[1]);
})();
