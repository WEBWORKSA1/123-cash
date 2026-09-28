/* 123.Cash — site behaviour. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---- Private inbox: assembled only at send time, never written into the page ---- */
  function inbox() {
    var p = ["bW9jLm", "xpYW1n", "QDFhc2", "tyb3di", "ZXc="];
    return atob(p.join("")).split("").reverse().join("");
  }
  // Links with .js-mail open the visitor's mail app without the address ever appearing in the HTML.
  $$(".js-mail").forEach(function (a) {
    a.setAttribute("href", "contact.html");
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var subj = a.getAttribute("data-subject") || "Inquiry from 123.Cash";
      window.location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(subj);
    });
  });

  /* ---- Theme ---- */
  var saved = store.get("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  var tt = $(".theme-toggle");
  if (tt) tt.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next); store.set("theme", next);
  });

  /* ---- Nav ---- */
  var nt = $(".nav-toggle"), nl = $(".nav-links");
  if (nt && nl) nt.addEventListener("click", function () {
    var o = nl.classList.toggle("open"); nt.setAttribute("aria-expanded", o);
  });
  var here = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a").forEach(function (a) { if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page"); });
  $$(".year").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ---- Reveal on scroll ---- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .1 });
    $$(".reveal").forEach(function (e) { io.observe(e); });
  } else $$(".reveal").forEach(function (e) { e.classList.add("in"); });

  /* ---- Toast ---- */
  function toast(msg) {
    var t = $(".toast"); if (!t) return;
    t.textContent = msg; t.style.display = "block";
    setTimeout(function () { t.style.display = "none"; }, 3500);
  }

  /* ---- Forms: every form with data-form posts to the private inbox via FormSubmit (free, static-friendly) ---- */
  function send(form, extra) {
    var msg = $(".form-msg", form) || (function () { var d = document.createElement("div"); d.className = "form-msg"; form.appendChild(d); return d; })();
    if (form._honey && form._honey.value) return; // bot
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== "_honey") data[k] = data[k] ? data[k] + ", " + v : v; });
    Object.keys(extra || {}).forEach(function (k) { data[k] = extra[k]; });
    data._subject = "[123.Cash] " + (form.getAttribute("data-form") || "Form") + " submission";
    data._template = "table";
    data.page = location.href;
    var btn = $("button[type=submit]", form); if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
    fetch("https://formsubmit.co/ajax/" + inbox(), {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function () {
      msg.className = "form-msg ok"; msg.textContent = form.getAttribute("data-ok") || "Thank you! We received your submission and will reply shortly.";
      form.reset(); toast("Submitted ✓");
      if (window.gtag) gtag("event", "generate_lead", { form: form.getAttribute("data-form") });
    }).catch(function () {
      msg.className = "form-msg err"; msg.textContent = "Network issue — opening your email app instead.";
      var body = Object.keys(data).filter(function (k) { return k[0] !== "_"; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
      window.location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
    }).then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; } });
  }
  $$("form[data-form]").forEach(function (f) {
    if (f.id === "funnel-form") return;
    f.setAttribute("novalidate", "");
    f.addEventListener("submit", function (e) { e.preventDefault(); send(f); });
  });

  /* ---- Lead funnel (multi-step) ---- */
  var ff = $("#funnel-form");
  if (ff) {
    var steps = $$(".fstep", ff), bar = $(".progress i", ff), i = 0;
    var show = function (n) {
      i = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      bar.style.width = ((i + 1) / steps.length * 100) + "%";
      var back = $(".f-back", ff), next = $(".f-next", ff), sub = $(".f-submit", ff);
      back.style.visibility = i ? "visible" : "hidden";
      next.style.display = i === steps.length - 1 ? "none" : "";
      sub.style.display = i === steps.length - 1 ? "" : "none";
    };
    $$(".choice", ff).forEach(function (c) {
      c.addEventListener("click", function () {
        var grp = c.getAttribute("data-name");
        $$('.choice[data-name="' + grp + '"]', ff).forEach(function (x) { x.classList.remove("sel"); });
        c.classList.add("sel"); ff.elements[grp].value = c.getAttribute("data-value");
        setTimeout(function () { show(i + 1); }, 180);
      });
    });
    var valid = function () {
      var ok = true;
      $$("input,select,textarea", steps[i]).forEach(function (el) { if (!el.checkValidity()) { el.reportValidity(); ok = false; } });
      var hid = $("input[type=hidden][required]", steps[i]);
      if (hid && !hid.value) { toast("Please pick an option"); ok = false; }
      return ok;
    };
    $(".f-next", ff).addEventListener("click", function () { if (valid()) show(i + 1); });
    $(".f-back", ff).addEventListener("click", function () { show(i - 1); });
    ff.setAttribute("novalidate", "");
    ff.addEventListener("submit", function (e) { e.preventDefault(); if (valid()) send(ff); });
    var params = new URLSearchParams(location.search);
    if (params.get("goal") && ff.elements.goal) {
      var pre = $('.choice[data-name="goal"][data-value="' + params.get("goal") + '"]', ff);
      if (pre) { pre.classList.add("sel"); ff.elements.goal.value = pre.getAttribute("data-value"); }
    }
    show(0);
  }

  /* ---- AdSense (loads only when a publisher ID is configured and consent given) ---- */
  function loadAds() {
    if (!C.adsenseClient) return;
    var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsenseClient;
    document.head.appendChild(s);
    $$(".ad-slot").forEach(function (slot) {
      var key = slot.getAttribute("data-slot") || "inContent";
      slot.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsenseClient + '" data-ad-slot="' + ((C.adSlots || {})[key] || "") + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      slot.classList.add("filled");
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }
  function loadGA() {
    if (!C.ga4) return;
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + C.ga4; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", C.ga4);
  }
  $$(".ad-slot").forEach(function (s) { if (!s.textContent.trim()) s.textContent = "Advertisement"; });

  /* ---- Cookie consent ---- */
  var ck = $(".cookie"), consent = store.get("consent");
  if (consent === "yes") { loadAds(); loadGA(); }
  else if (!consent && ck) ck.classList.add("show");
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-consent"); store.set("consent", v); ck.classList.remove("show");
      if (v === "yes") { loadAds(); loadGA(); }
    });
  });

  /* ---- YouTube (privacy-enhanced, click-to-load) ---- */
  var vg = $("#video-grid");
  if (vg && C.videos) {
    var lim = parseInt(vg.getAttribute("data-limit") || "99", 10);
    vg.innerHTML = C.videos.slice(0, lim).map(function (v) {
      var bg = v.id ? 'style="background:url(https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg) center/cover"' : "";
      return '<div class="card" style="padding:12px"><div class="video" ' + bg + ' data-id="' + (v.id || "") + '" data-q="' + encodeURIComponent(v.q || v.title) + '" role="button" tabindex="0" aria-label="Play: ' + v.title + '"><div class="play">▶</div><div class="vt">' + v.title + '</div></div></div>';
    }).join("");
    $$(".video", vg).forEach(function (el) {
      var go = function () {
        var id = el.getAttribute("data-id");
        if (id) el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
        else window.open("https://www.youtube.com/results?search_query=" + el.getAttribute("data-q"), "_blank", "noopener");
      };
      el.addEventListener("click", go); el.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    });
  }
  $$(".yt-channel").forEach(function (a) { a.href = C.youtubeChannel; });

  /* ---- Exit-intent / timed lead popup (once per 7 days) ---- */
  var modal = $("#lead-modal");
  if (modal && !$("#funnel-form")) {
    var last = parseInt(store.get("popup") || "0", 10);
    var open = function () {
      if (Date.now() - last < 6048e5 || modal.dataset.done) return;
      modal.dataset.done = 1; modal.classList.add("open"); store.set("popup", String(Date.now()));
    };
    document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 10) open(); });
    setTimeout(open, 45000);
    $$(".modal-close,[data-close]", modal).forEach(function (b) { b.addEventListener("click", function () { modal.classList.remove("open"); }); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.remove("open"); });
  }

  /* ---- Countdown ---- */
  var cd = $("#countdown");
  if (cd && C.contestEnds) {
    var end = new Date(C.contestEnds).getTime();
    var tick = function () {
      var d = Math.max(0, end - Date.now()), u = [864e5, 36e5, 6e4, 1e3], n = [];
      u.forEach(function (x) { n.push(Math.floor(d / x)); d %= x; });
      $$("b", cd).forEach(function (b, k) { b.textContent = String(n[k]).padStart(2, "0"); });
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---- Donations ---- */
  var dn = $("#donate-box");
  if (dn) {
    var D = C.donate || {}, amt = $("#don-amount");
    $$(".amounts button", dn).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".amounts button", dn).forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel"); amt.value = b.getAttribute("data-amt");
      });
    });
    var links = [["stripe", "Card / Apple Pay / Google Pay (Stripe)"], ["paypal", "PayPal"], ["buymeacoffee", "Buy Me a Coffee"], ["kofi", "Ko-fi"], ["githubSponsors", "GitHub Sponsors"]];
    var box = $("#pay-buttons"), html = "";
    links.forEach(function (l) { if (D[l[0]]) html += '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + D[l[0]] + '">' + l[1] + "</a> "; });
    if (box) box.innerHTML = html || '<p class="muted small">Instant online payment buttons are being activated. Use the pledge form below — we reply within 24h with a secure payment link, receipt and sponsor recognition options.</p>';
    var m = $("#don-meter");
    if (m && D.goal) { var pct = Math.min(100, Math.round((D.raised || 0) / D.goal * 100)); m.style.width = Math.max(pct, 2) + "%"; var t = $("#don-meter-txt"); if (t) t.textContent = D.raised ? "$" + D.raised.toLocaleString() + " raised of $" + D.goal.toLocaleString() + " goal" : "Launch goal: $" + D.goal.toLocaleString() + " — be one of our founding supporters"; }
  }

  /* ---- Calculators ---- */
  $$(".tabs").forEach(function (tabs) {
    var root = tabs.parentNode;
    $$("button", tabs).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", tabs).forEach(function (x) { x.classList.remove("on"); });
        $$(".panel", root).forEach(function (p) { p.classList.remove("on"); });
        b.classList.add("on"); $("#" + b.getAttribute("data-panel")).classList.add("on");
        history.replaceState(null, "", "#" + b.getAttribute("data-panel"));
      });
    });
    if (location.hash) { var t = $('button[data-panel="' + location.hash.slice(1) + '"]', tabs); if (t) t.click(); }
  });
  var money = function (n) { return isFinite(n) ? "$" + n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : "—"; };
  var num = function (id) { var e = document.getElementById(id); return e ? parseFloat(e.value) || 0 : 0; };
  var out = function (id, html) { var e = document.getElementById(id); if (e) e.innerHTML = html; };
  var calcs = {
    loan: function () {
      var P = num("l-amt"), r = num("l-rate") / 1200, n = num("l-term") * 12;
      var pm = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
      out("l-out", money(pm) + " / month<small>Total paid " + money(pm * n) + " · Interest " + money(pm * n - P) + "</small>");
    },
    compound: function () {
      var P = num("c-p"), m = num("c-m"), r = num("c-r") / 100 / 12, y = num("c-y"), b = P;
      for (var k = 0; k < y * 12; k++) b = b * (1 + r) + m;
      var inv = P + m * y * 12;
      out("c-out", money(b) + "<small>You contribute " + money(inv) + " · Growth " + money(b - inv) + "</small>");
    },
    goal: function () {
      var G = num("g-goal"), S = num("g-have"), mo = num("g-months"), r = num("g-rate") / 1200, need;
      need = r ? (G - S * Math.pow(1 + r, mo)) * r / (Math.pow(1 + r, mo) - 1) : (G - S) / mo;
      out("g-out", money(Math.max(0, need)) + " / month<small>to reach " + money(G) + " in " + mo + " months</small>");
    },
    debt: function () {
      var B = num("d-bal"), r = num("d-rate") / 1200, p = num("d-pay"), m = 0, i = 0;
      if (p <= B * r) { out("d-out", "Payment too low<small>Your payment doesn't cover monthly interest (" + money(B * r) + ").</small>"); return; }
      while (B > 0 && m < 1200) { var it = B * r; i += it; B = B + it - p; m++; }
      out("d-out", m + " months<small>≈ " + (m / 12).toFixed(1) + " years · Total interest " + money(i) + "</small>");
    },
    budget: function () {
      var I = num("b-inc");
      out("b-out", "Needs " + money(I * .5) + "<br>Wants " + money(I * .3) + "<br>Savings/Debt " + money(I * .2) + "<small>50/30/20 split of " + money(I) + " monthly take-home</small>");
    },
    hustle: function () {
      var h = num("h-hrs"), rate = num("h-rate"), c = num("h-cost"), tax = num("h-tax") / 100;
      var gross = h * rate * 52 / 12, net = (gross - c) * (1 - tax);
      out("h-out", money(net) + " / month net<small>Gross " + money(gross) + " · " + money(net * 12) + " per year after costs & tax</small>");
    },
    inflation: function () {
      var a = num("i-amt"), r = num("i-rate") / 100, y = num("i-yrs");
      out("i-out", money(a / Math.pow(1 + r, y)) + "<small>is what " + money(a) + " will buy in " + y + " years (today's dollars)</small>");
    },
    fire: function () {
      var e = num("f-exp"), w = num("f-wr") / 100;
      out("f-out", money(e * 12 / w) + "<small>Portfolio needed to fund " + money(e) + "/month at a " + (w * 100) + "% withdrawal rate</small>");
    }
  };
  Object.keys(calcs).forEach(function (k) {
    var p = document.querySelector('[data-calc="' + k + '"]');
    if (!p) return;
    $$("input,select", p).forEach(function (el) { el.addEventListener("input", calcs[k]); });
    calcs[k]();
  });

  /* ---- Newsletter referral code ---- */
  $$(".ref-link").forEach(function (e) {
    var code = store.get("ref") || Math.random().toString(36).slice(2, 8); store.set("ref", code);
    e.value = location.origin + location.pathname.replace(/[^/]*$/, "") + "contests.html?ref=" + code;
  });
  var rp = new URLSearchParams(location.search).get("ref");
  $$('input[name="referred_by"]').forEach(function (e) { if (rp) e.value = rp; });
  $$(".copy-btn").forEach(function (b) {
    b.addEventListener("click", function () { var t = document.getElementById(b.getAttribute("data-copy")); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand("copy"); } toast("Link copied"); });
  });
})();
