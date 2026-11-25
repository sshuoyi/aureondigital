/* ==========================================================================
   viz.js — Visualisation data-driven (window.RIMU_VIZ)
   Owner: viz-builder · Contrat : web/site/CONTRACT.md §4 / §6
   Contenu : #hero-canvas (canvas réseau), compteurs, #chart-mau,
   #chart-revenue + #revenue-legend, #flow-canvas (13 nœuds / 35 relations,
   filtres 5 flux, isolate, 3 récits de flux, matrice), #map-canvas (Afrique
   de l'Ouest), tooltips partagés. FR/ZH via window.APP.lang + RIMU_DATA.
   Aucune dépendance externe ; aucun console.error ; rendu non bloquant.
   API : window.RIMU_VIZ = { init(), updateLang(), refresh(), status() }
   ========================================================================== */
(function () {
  "use strict";

  var VIZ = window.RIMU_VIZ = window.RIMU_VIZ || {};
  var NS = "http://www.w3.org/2000/svg";
  var FLOWS = ["capital", "marchandises", "paiements", "donnees", "attention"];
  var EASE = "cubic-bezier(.22,.61,.36,1)";

  var state = {
    lang: "fr",
    flow: "all",
    activeFlows: null,
    selected: "",
    view: "graph",
    isolate: "",
    pickingIsolate: false,
    focusNode: "",
    hoverNode: "",
    story: "",
    step: 0,
    stepCount: 0,
    paused: false,
    finished: false,
    timer: null,
    heroRaf: 0,
    heroVisible: true
  };
  var refs = {
    charts: {},
    flow: null,
    map: null,
    hero: null,
    tooltip: null,
    counterIO: null,
    heroIO: null,
    flowSVG: null,
    ownLegend: false,
    ownStories: false,
    ownControls: false,
    drawn: { mau: false, rev: false }
  };
  var boundGlobal = false;
  var uid = 0;

  /* ------------------------------------------------------------------ */
  /* Utils                                                               */
  /* ------------------------------------------------------------------ */
  function guard(fn) {
    try {
      return fn();
    } catch (err) {
      if (window.__VIZ_DEBUG) window.console && console.warn("[viz]", err);
      return null;
    }
  }

  function D() {
    return window.RIMU_DATA || null;
  }

  function $(sel, root) {
    try {
      return (root || document).querySelector(sel);
    } catch (e) {
      return null;
    }
  }

  function $$(sel, root) {
    try {
      return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    } catch (e) {
      return [];
    }
  }

  function curLang() {
    var app = window.APP;
    if (app && app.lang === "zh") return "zh";
    if (app && app.lang === "fr") return "fr";
    var attr = document.documentElement.getAttribute("data-lang");
    return attr === "zh" ? "zh" : "fr";
  }

  function L(fr, zh) {
    return curLang() === "zh" ? zh : fr;
  }

  function C() {
    var c = window.RIMU_CONTENT;
    if (!c) return null;
    return c[curLang()] || c.fr || null;
  }

  function cget(path) {
    var o = C();
    if (!o) return null;
    var p = String(path).split(".");
    for (var i = 0; i < p.length; i++) {
      if (o == null) return null;
      o = o[p[i]];
    }
    return o;
  }

  function ct(path, fr, zh) {
    var v = cget(path);
    if (typeof v === "string" && v) return v;
    return L(fr, zh);
  }

  function pick(obj, base) {
    if (!obj) return "";
    var zh = curLang() === "zh";
    var v = obj[base + (zh ? "ZH" : "FR")];
    if (v == null) v = obj[base + (zh ? "FR" : "ZH")];
    return v == null ? "" : v;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function attr(o) {
    var out = "";
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      if (o[k] == null) continue;
      out += " " + k + '="' + esc(o[k]) + '"';
    }
    return out;
  }

  function tag(name, a, content) {
    return "<" + name + attr(a) + ">" + (content == null ? "" : content) + "</" + name + ">";
  }

  function isReduced() {
    try {
      return !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function isLite() {
    var html = document.documentElement;
    var body = document.body;
    if (html && (html.getAttribute("data-bw") === "low" || html.classList.contains("lite"))) return true;
    if (body && body.classList.contains("lite")) return true;
    try {
      var conn = navigator.connection;
      if (conn && conn.saveData) return true;
      if (conn && conn.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return true;
    } catch (e) {}
    return false;
  }

  function still() {
    return isReduced() || isLite();
  }

  function animateOK() {
    if (still()) return false;
    try {
      if (navigator && navigator.webdriver) return false;
      if (navigator && /HeadlessChrome/.test(navigator.userAgent || "")) return false;
    } catch (e) {}
    return true;
  }

  function kpiById(id) {
    var d = D();
    if (!d || !d.kpis) return null;
    for (var i = 0; i < d.kpis.length; i++) if (d.kpis[i].id === id) return d.kpis[i];
    return null;
  }

  function kpiDisplay(k, lang) {
    if (!k) return "";
    var v = k[lang === "zh" ? "displayZH" : "displayFR"];
    if (v == null) v = k.displayFR;
    return v == null ? "" : v;
  }

  function typeLabel(k) {
    var d = D();
    var legend = d && d.meta && d.meta.typeLegend;
    var t = legend && k && k.type && legend[k.type];
    if (t) return pick(t, "label");
    return "";
  }

  function kpiSourceLabel(k) {
    var d = D();
    var src = d && d.sources;
    if (k && src && k.sourceRef) {
      for (var i = 0; i < src.length; i++) if (src[i].id === k.sourceRef) return pick(src[i], "title");
    }
    return L("Dossier RIMU", "RIMU 资料");
  }

  /* ----- nombres : FR U+202F + virgule / ZH 万·亿 ----- */
  function groupFR(intStr) {
    return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
  }

  function trimNum(x, dec, lang) {
    var s = x.toFixed(dec == null ? 2 : dec);
    if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    if (lang !== "zh") s = s.replace(".", ",");
    return s;
  }

  function fmtNumber(x, lang, dec) {
    var a = Math.abs(x);
    var s = dec == null || dec === 0 ? String(Math.round(a)) : a.toFixed(dec);
    if (lang === "zh") {
      var zh = dec == null || dec === 0 ? String(Math.round(a)) : a.toFixed(dec);
      if (dec) zh = zh.replace(/\.$/, "").replace(/0+$/, "").replace(/\.$/, "");
      return (x < 0 ? "−" : "") + zh;
    }
    var parts = s.split(".");
    parts[0] = groupFR(parts[0]);
    return (x < 0 ? "−" : "") + parts.join(",");
  }

  function fmtCompact(n, lang, opts) {
    opts = opts || {};
    if (n == null || isNaN(n)) return "";
    var compact = opts.compact !== false;
    var dec = opts.decimals;
    var a = Math.abs(n);
    var out;
    if (lang === "zh") {
      if (compact && a >= 1e8) out = trimNum(a / 1e8, dec == null ? 2 : dec, lang) + "\u00A0亿";
      else if (compact && a >= 1e4) out = trimNum(a / 1e4, dec == null ? 2 : dec, lang) + "\u00A0万";
      else out = fmtNumber(a, lang, dec);
    } else {
      if (compact && a >= 1e9) out = trimNum(a / 1e9, dec == null ? 2 : dec, lang) + "\u00A0Md";
      else if (compact && a >= 1e6) out = trimNum(a / 1e6, dec == null ? 1 : dec, lang) + "\u00A0M";
      else if (compact && a >= 1e4) out = trimNum(a / 1e3, dec == null ? 1 : dec, lang) + "\u00A0k";
      else out = fmtNumber(a, lang, dec);
    }
    return (n < 0 ? "−" : "") + out;
  }

  function fmtSigned(v, lang) {
    return v;
  }

  function easeOut(p) {
    return 1 - Math.pow(1 - p, 3);
  }

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  function num(v, fb) {
    var n = parseFloat(String(v == null ? "" : v).replace(/[^0-9.,\-−]/g, "").replace(",", "."));
    return isNaN(n) ? fb : n;
  }

  function emptyBox() {
    return '<p class="viz-empty">' + esc(L("Données non disponibles à ce stade.", "该阶段数据暂不可用。")) + "</p>";
  }

  /* ------------------------------------------------------------------ */
  /* Tooltip partagé                                                     */
  /* ------------------------------------------------------------------ */
  function tipEl() {
    if (!refs.tooltip || !document.body.contains(refs.tooltip)) {
      var t = document.createElement("div");
      t.className = "viz-tooltip";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
      refs.tooltip = t;
    }
    return refs.tooltip;
  }

  function tipShow(html, x, y) {
    var t = tipEl();
    t.innerHTML = html;
    t.classList.add("is-on");
    var w = t.offsetWidth;
    var h = t.offsetHeight;
    var vw = window.innerWidth || 1200;
    var vh = window.innerHeight || 800;
    var left = x + 16;
    var top = y + 16;
    if (left + w > vw - 10) left = Math.max(10, x - w - 16);
    if (top + h > vh - 10) top = Math.max(10, y - h - 16);
    t.style.transform = "translate3d(" + Math.round(left) + "px," + Math.round(top) + "px,0)";
  }

  function tipHide() {
    if (refs.tooltip) refs.tooltip.classList.remove("is-on");
  }

  function tipRows(rows) {
    var out = "";
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r) continue;
      if (r.head) out += '<p class="viz-tip-head">' + r.head + "</p>";
      else out += '<p class="viz-tip-row"><span>' + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></p>";
    }
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* Compteurs                                                           */
  /* ------------------------------------------------------------------ */
  function counterTarget(el) {
    var to = el.getAttribute("data-to");
    if (to != null) return num(to, 0);
    var dc = el.getAttribute("data-count");
    if (dc != null) {
      if (dc.indexOf("kpi.") === 0) {
        var k = kpiById(dc);
        if (!k) return null;
        if (k.value != null) return k.value;
        if (k.range && k.range.length === 2) return (k.range[0] + k.range[1]) / 2;
        return null;
      }
      return num(dc, null);
    }
    return null;
  }

  function counterDisplay(el) {
    var lang = curLang();
    var attrV = el.getAttribute(lang === "zh" ? "data-display-zh" : "data-display-fr");
    if (attrV != null && attrV !== "") return attrV;
    var alt = el.getAttribute(lang === "zh" ? "data-display-fr" : "data-display-zh");
    if (alt != null && alt !== "") return alt;
    var dc = el.getAttribute("data-count");
    if (dc != null && dc.indexOf("kpi.") === 0) {
      var k = kpiById(dc);
      if (k) return kpiDisplay(k, lang);
    }
    var init = el.__vizInitial;
    if (init && init !== "0" && init !== "—" && el.getAttribute("data-to") != null) return init;
    var t = counterTarget(el);
    if (t != null) {
      var fmt = el.getAttribute("data-format");
      var compact = el.getAttribute("data-compact") !== "false" && fmt !== "raw";
      var dec = el.getAttribute("data-decimals");
      return fmtCompact(t, lang, { compact: compact, decimals: dec == null ? null : parseInt(dec, 10) });
    }
    return el.textContent;
  }

  function counterSuffix(el) {
    var init = el.__vizInitial || "";
    var m = /^[−–\-]?[\d\u202F\u00A0.,]+\s*(?:M|Md|k|万|亿)?/.exec(init);
    if (!m) return "";
    var tail = init.slice(m[0].length);
    if (!tail) return "";
    if (/^[%％]/.test(tail)) return "\u00A0" + tail;
    return " " + tail;
  }

  function stopCounter(el) {
    if (el && el.__vizStop) {
      try {
        el.__vizStop();
      } catch (e) {}
      el.__vizStop = null;
    }
  }

  function runCounter(el, instant) {
    if (!el || el.__vizDone) {
      if (el) stopCounter(el);
      return;
    }
    el.__vizDone = true;
    var lang = curLang();
    var target = counterTarget(el);
    var displayOnly = el.getAttribute("data-to") == null && el.getAttribute("data-count") == null;
    if (displayOnly || target == null || !animateOK() || instant) {
      el.textContent = counterDisplay(el);
      if (!isReduced()) el.classList.add("viz-in");
      return;
    }
    var duration = 1200;
    var delay = num(el.getAttribute("data-delay"), 0);
    if (el.closest && el.closest("#ch-hero")) delay = delay || 220;
    var stop = false;
    el.__vizStop = function () {
      stop = true;
      if (el.__vizFrame) cancelAnimationFrame(el.__vizFrame);
    };
    var startAt = 0;
    var startVal = 0;
    function frame(now) {
      if (stop) return;
      if (!startAt) startAt = now + delay;
      if (now < startAt) {
        el.__vizFrame = requestAnimationFrame(frame);
        return;
      }
      var p = clamp((now - startAt) / duration, 0, 1);
      var v = target * easeOut(p);
      if (target > 0) {
        var decimals = el.getAttribute("data-decimals");
        el.textContent = fmtCompact(v, lang, {
          compact: el.getAttribute("data-compact") !== "false" && el.getAttribute("data-format") !== "raw",
          decimals: decimals == null ? null : parseInt(decimals, 10)
        }) + (el.__vizSuffix == null ? (el.__vizSuffix = counterSuffix(el)) : el.__vizSuffix);
      }
      if (p < 1) {
        el.__vizFrame = requestAnimationFrame(frame);
      } else {
        el.textContent = counterDisplay(el);
      }
    }
    el.__vizFrame = requestAnimationFrame(frame);
    setTimeout(function () {
      if (stop) return;
      if (el.__vizDone) el.textContent = counterDisplay(el);
    }, delay + duration + 500);
  }

  function scanCounters(instant) {
    var list = $$(".count[data-to], [data-display-fr][data-display-zh], [data-count]");
    var fresh = [];
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.getAttribute("data-viz-counter") === "1") continue;
      el.setAttribute("data-viz-counter", "1");
      if (el.__vizInitial == null) el.__vizInitial = (el.textContent || "").replace(/\s+/g, " ").trim();
      el.setAttribute("data-viz-final", counterDisplay(el));
      fresh.push(el);
    }
    if (!fresh.length) return;
    if (!("IntersectionObserver" in window) || still() || instant) {
      for (var j = 0; j < fresh.length; j++) runCounter(fresh[j], instant);
      return;
    }
    if (refs.counterIO) refs.counterIO.disconnect();
    var io = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          io.unobserve(entries[k].target);
          runCounter(entries[k].target, instant);
        }
      }
    }, { threshold: 0.28 });
    refs.counterIO = io;
    for (var m = 0; m < fresh.length; m++) {
      io.observe(fresh[m]);
      if (inView(fresh[m])) {
        io.unobserve(fresh[m]);
        runCounter(fresh[m], false);
      }
    }
    setTimeout(function () {
      for (var q = 0; q < fresh.length; q++) {
        var c = fresh[q];
        if (c.__vizDone && !c.__vizStopped) c.textContent = counterDisplay(c);
      }
    }, 3200);
  }

  function updateCountersLang() {
    var list = $$("[data-viz-counter='1']");
    for (var i = 0; i < list.length; i++) {
      stopCounter(list[i]);
      list[i].textContent = counterDisplay(list[i]);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Helpers SVG                                                         */
  /* ------------------------------------------------------------------ */
  function niceStep(x) {
    if (x <= 0) return 1;
    var pow = Math.pow(10, Math.floor(Math.log(x) / Math.LN10));
    var f = x / pow;
    var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return n * pow;
  }

  function smoothPath(pts) {
    if (!pts.length) return "";
    var d = "M" + pts[0].x + " " + pts[0].y;
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6;
      var c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6;
      var c2y = p2.y - (p3.y - p1.y) / 6;
      d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
    }
    return d;
  }

  function wrapText(str, maxChars) {
    var words = String(str || "").split(/\s+/);
    var lines = [];
    var line = "";
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (!line) line = w;
      else if ((line + " " + w).length <= maxChars) line += " " + w;
      else {
        lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    if (lines.length > 3) {
      lines = lines.slice(0, 3);
      lines[2] = lines[2].replace(/\s*$/, "") + "…";
    }
    return lines;
  }

  function wrapZH(str, maxChars) {
    var chars = String(str || "").split("");
    var lines = [];
    var line = "";
    for (var i = 0; i < chars.length; i++) {
      if ((line + chars[i]).length > maxChars && line) {
        lines.push(line);
        line = chars[i];
      } else line += chars[i];
    }
    if (line) lines.push(line);
    if (lines.length > 2) {
      lines = lines.slice(0, 2);
      lines[1] = lines[1] + "…";
    }
    return lines;
  }

  function textLines(str, maxChars) {
    return curLang() === "zh" ? wrapZH(str, Math.max(4, Math.floor(maxChars * 0.9))) : wrapText(str, maxChars);
  }

  function svgText(cls, x, y, lines, lineH, extra) {
    var h = "";
    for (var i = 0; i < lines.length; i++) {
      h += "<tspan x=\"" + x + "\" y=\"" + (y + i * lineH) + "\">" + esc(lines[i]) + "</tspan>";
    }
    return tag("text", Object.assign({ "class": cls }, extra || {}), h);
  }

  /* ------------------------------------------------------------------ */
  /* Graphique MAU / DAU 2027–2031                                       */
  /* ------------------------------------------------------------------ */
  function renderMauChart() {
    var host = $("#chart-mau");
    if (!host) return;
    var kM = kpiById("kpi.series.mau");
    var kD = kpiById("kpi.series.dau");
    var kS = kpiById("kpi.series.stickiness");
    if (!kM || !kD || !kM.series || !kD.series) {
      host.innerHTML = emptyBox();
      return;
    }
    var lang = curLang();
    var seriesM = kM.series;
    var seriesD = kD.series;
    var years = seriesM.map(function (p) { return p.year; });
    var W = 560, H = 340, ml = 58, mr = 18, mt = 60, mb = 46;
    var iw = W - ml - mr, ih = H - mt - mb;
    var maxV = 0;
    for (var i = 0; i < seriesM.length; i++) maxV = Math.max(maxV, seriesM[i].value);
    var step = niceStep(maxV / 5);
    var yMax = Math.ceil(maxV / step) * step;
    var ticks = [];
    for (var t = 0; t <= yMax + 1; t += step) ticks.push(t);
    function xAt(idx) {
      return seriesM.length === 1 ? ml + iw / 2 : ml + (iw * idx) / (seriesM.length - 1);
    }
    function yAt(v) {
      return mt + ih - (v / yMax) * ih;
    }
    var gid = "vizgrad" + ++uid;
    var ptsM = seriesM.map(function (p, idx) { return { x: xAt(idx), y: yAt(p.value) }; });
    var ptsD = seriesD.map(function (p, idx) { return { x: xAt(idx), y: yAt(p.value) }; });
    var dM = smoothPath(ptsM);
    var dD = smoothPath(ptsD);
    var dArea = dM + " L" + ptsM[ptsM.length - 1].x + " " + (mt + ih) + " L" + ptsM[0].x + " " + (mt + ih) + " Z";

    var defs = '<defs><linearGradient id="' + gid + '" x1="0" y1="1" x2="0" y2="0">' +
      '<stop offset="0%" stop-color="var(--flow-capital,#C9A25E)" stop-opacity=".02"/>' +
      '<stop offset="100%" stop-color="var(--flow-capital,#C9A25E)" stop-opacity=".16"/>' +
      "</linearGradient></defs>";

    var grid = "";
    for (var g = 0; g < ticks.length; g++) {
      grid += tag("line", { "class": "viz-grid", x1: ml, y1: yAt(ticks[g]).toFixed(1), x2: ml + iw, y2: yAt(ticks[g]).toFixed(1) });
      grid += tag("text", { "class": "viz-axis-label", x: ml - 10, y: (yAt(ticks[g]) + 4).toFixed(1), "text-anchor": "end" }, esc(fmtCompact(ticks[g], lang)));
    }
    var axis = tag("line", { "class": "viz-axis", x1: ml, y1: mt + ih, x2: ml + iw, y2: mt + ih }) +
      tag("line", { "class": "viz-axis", x1: ml, y1: mt, x2: ml, y2: mt + ih });

    var xlabels = "";
    for (var xi = 0; xi < years.length; xi++) {
      xlabels += tag("text", { "class": "viz-axis-label", x: xAt(xi).toFixed(1), y: mt + ih + 24, "text-anchor": "middle" }, years[xi]);
    }

    var mName = "MAU";
    var dName = "DAU";
    var fullM = L("MAU · actifs mensuels", "MAU · 月活用户");
    var fullD = L("DAU · actifs quotidiens", "DAU · 日活用户");
    var lastMv = seriesM[seriesM.length - 1].value;
    var lastDv = seriesD[seriesD.length - 1].value;
    var legend = '<g class="viz-legend" transform="translate(' + (W - mr - 148) + ",20)\">" +
      '<line x1="0" y1="-6" x2="16" y2="-6" class="viz-legend-line is-mau"/><text x="22" y="-2" class="viz-legend-text">' + esc(mName + " · " + fmtCompact(lastMv, lang)) + "</text>" +
      '<line x1="0" y1="12" x2="16" y2="12" class="viz-legend-line is-dau"/><text x="22" y="16" class="viz-legend-text">' + esc(dName + " · " + fmtCompact(lastDv, lang)) + "</text></g>";

    var endLabels = tag("text", { "class": "viz-value-label", x: ptsM[ptsM.length - 1].x - 8, y: ptsM[ptsM.length - 1].y - 12, "text-anchor": "end" }, esc(fmtCompact(lastMv, lang))) +
      tag("text", { "class": "viz-value-label is-dau", x: ptsD[ptsD.length - 1].x - 8, y: ptsD[ptsD.length - 1].y - 12, "text-anchor": "end" }, esc(fmtCompact(lastDv, lang)));

    var points = "";
    for (var p1 = 0; p1 < ptsM.length; p1++) {
      points += tag("circle", { "class": "viz-point is-mau", cx: ptsM[p1].x.toFixed(1), cy: ptsM[p1].y.toFixed(1), r: 3.4 });
      points += tag("circle", { "class": "viz-point is-dau", cx: ptsD[p1].x.toFixed(1), cy: ptsD[p1].y.toFixed(1), r: 3.2 });
    }

    var hoverDots = '<g class="viz-hover-layer" opacity="0"><line class="viz-guide" x1="0" y1="' + mt + '" x2="0" y2="' + (mt + ih) + '"/>' +
      '<circle class="viz-point is-mau" r="5" cx="0" cy="0"/><circle class="viz-point is-dau" r="4.6" cx="0" cy="0"/></g>';

    var svg = tag("svg", {
      "class": "viz-svg viz-chart viz-mau-chart",
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label": L("Courbe MAU et DAU, 2027–2031", "2027–2031 年 MAU 与 DAU 曲线")
    }, defs + grid + axis + xlabels + tag("path", { "class": "viz-area", d: dArea, fill: "url(#" + gid + ")" }) +
      tag("path", { "class": "viz-line is-mau", d: dM }) +
      tag("path", { "class": "viz-line is-dau", d: dD }) +
      points + endLabels + legend +
      tag("rect", { "class": "viz-hit", x: ml, y: mt, width: iw, height: ih }) + hoverDots);

    var sr = '<p class="viz-sr">' + esc(L("Série 2027–2031. ", "2027–2031 年序列。")) +
      seriesM.map(function (p, idx) {
        return years[idx] + " : MAU " + fmtCompact(p.value, lang) + " ; DAU " + fmtCompact(seriesD[idx].value, lang);
      }).join(" · ") + "</p>";

    host.innerHTML = "";
    host.innerHTML = svg + sr;
    var svgEl = host.querySelector("svg");
    var hit = host.querySelector(".viz-hit");
    var guide = host.querySelector(".viz-guide");
    var hoverG = host.querySelector(".viz-hover-layer");
    function move(ev) {
      var box = svgEl.getBoundingClientRect();
      var idx = clamp(Math.round((((ev.clientX - box.left) / box.width) * W - ml) / iw * (seriesM.length - 1)), 0, seriesM.length - 1);
      var xx = xAt(idx);
      guide.setAttribute("x1", xx);
      guide.setAttribute("x2", xx);
      var cM = hoverG.querySelectorAll("circle")[0];
      var cD = hoverG.querySelectorAll("circle")[1];
      cM.setAttribute("cx", xx);
      cM.setAttribute("cy", ptsM[idx].y);
      cD.setAttribute("cx", xx);
      cD.setAttribute("cy", ptsD[idx].y);
      hoverG.setAttribute("opacity", "1");
      var stickVal = kS && kS.series ? kS.series[idx].value : null;
      var html = '<p class="viz-tip-head">' + years[idx] + "</p>" + tipRows([
        [fullM, fmtCompact(seriesM[idx].value, lang)],
        [fullD, fmtCompact(seriesD[idx].value, lang)]
      ].concat(stickVal != null ? [[L("DAU / MAU", "DAU / MAU"), fmtNumber(stickVal, lang, 1) + (lang === "zh" ? "%" : "\u00A0%")]] : []));
      tipShow(html, ev.clientX, ev.clientY);
    }
    hit.addEventListener("pointermove", move);
    hit.addEventListener("pointerenter", move);
    hit.addEventListener("pointerleave", function () {
      hoverG.setAttribute("opacity", "0");
      tipHide();
    });
    var lineM = host.querySelector(".viz-line.is-mau");
    var lineD = host.querySelector(".viz-line.is-dau");
    if (animateOK() && !refs.drawn.mau) {
      [lineM, lineD].forEach(function (ln) {
        if (!ln) return;
        var len = 0;
        try { len = ln.getTotalLength(); } catch (e) { len = 1600; }
        ln.style.strokeDasharray = len + " " + len;
        ln.style.strokeDashoffset = String(len);
      });
      var finalize = function () {
        [lineM, lineD].forEach(function (ln) {
          if (!ln) return;
          ln.style.transition = "none";
          ln.style.strokeDasharray = "none";
          ln.style.strokeDashoffset = "0";
        });
      };
      var draw = function () {
        [lineM, lineD].forEach(function (ln) {
          if (!ln) return;
          ln.style.transition = "stroke-dashoffset 1.6s " + EASE;
          ln.style.strokeDashoffset = "0";
        });
        setTimeout(finalize, 1900);
      };
      if (inView(host)) requestAnimationFrame(draw);
      else observeOnce(host, draw);
    }
    refs.drawn.mau = true;
  }

  function inView(el) {
    try {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      return r.top < vh * 0.92 && r.bottom > vh * 0.05 && r.height > 0;
    } catch (e) {
      return true;
    }
  }

  function observeOnce(el, fn) {
    if (!("IntersectionObserver" in window)) {
      fn();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          io.disconnect();
          fn();
        }
      }
    }, { threshold: 0.25 });
    io.observe(el);
  }

  /* ------------------------------------------------------------------ */
  /* Revenus 2031 : barres de fourchette + légende                       */
  /* ------------------------------------------------------------------ */
  function revenueRows() {
    var lang = curLang();
    var legend = cget("impact.revenueLegend");
    function cleanLabel(s) {
      var cut = String(s).search(/\s+[\d≈~]/);
      return cut > 2 ? String(s).slice(0, cut) : String(s);
    }
    function nm(i, fr, zh) {
      if (Array.isArray(legend) && typeof legend[i] === "string" && legend[i]) return cleanLabel(legend[i]);
      return L(fr, zh);
    }
    var rows = [
      { id: "rimu", kpi: kpiById("kpi.revenue_rimu_2031"), name: nm(0, "RIMU · vidéos courtes", "RIMU · 短视频"), color: "var(--flow-capital,#C9A25E)" },
      { id: "rimp", kpi: kpiById("kpi.revenue_rimp_2031"), name: nm(1, "RIMP · paiements", "RIMP · 支付"), color: "var(--flow-paiements,#00A86B)" },
      { id: "calcul", kpi: kpiById("kpi.revenue_compute_2031"), name: nm(2, "Calcul IA", "AI 算力"), color: "var(--flow-donnees,#7FA6C9)" }
    ];
    var total = kpiById("kpi.revenue_total_2031");
    return { lang: lang, rows: rows, total: total };
  }

  function renderRevenueChart() {
    var host = $("#chart-revenue");
    if (!host) return;
    var dat = revenueRows();
    var lang = dat.lang;
    var rows = dat.rows.filter(function (r) { return r.kpi && r.kpi.range; });
    if (!rows.length || !dat.total || !dat.total.range) {
      host.innerHTML = emptyBox();
      return;
    }
    var W = 660, H = 376, labelW = 198, plotX = labelW + 10, plotR = W - 126, rowH = 60, top = 34;
    var axisMax = 240;
    function xAt(v) {
      return plotX + (v / axisMax) * (plotR - plotX);
    }
    var totalRow = { id: "total", kpi: dat.total, name: L("Total affiché", "官方合计"), color: "var(--ivory,#F6F0E4)", isTotal: true };
    var all = rows.concat([totalRow]);
    var rowsY = [];
    var y = top;
    for (var i = 0; i < rows.length; i++) {
      rowsY.push(y);
      y += rowH;
    }
    y += 22;
    rowsY.push(y);
    var axisY = y + rowH - 6;
    var body = "";
    var hover = "";
    for (var r = 0; r < all.length; r++) {
      var row = all[r];
      var ry = rowsY[r];
      var midY = ry + 26;
      var rng = row.kpi.range;
      /* data.js porte les montants en USD : la géométrie est en millions USD */
      var lo = Math.min(rng[0], rng[1]) / 1e6;
      var hi = Math.max(rng[0], rng[1]) / 1e6;
      var mid = (lo + hi) / 2;
      if (row.isTotal) {
        body += tag("line", { "class": "viz-rev-sep", x1: plotX, y1: ry - 12, x2: plotR + 10, y2: ry - 12 });
      }
      var nameLines = limitLines(textLines(row.name, 21), 2);
      var nameY = midY - (nameLines.length - 1) * 8 - 3;
      body += '<g class="viz-rev-row" data-rev-row="' + r + '">' +
        svgText("viz-rev-name" + (row.isTotal ? " is-total" : ""), 4, nameY, nameLines, 15) +
        tag("text", { "class": "viz-rev-type", x: 4, y: midY + (nameLines.length - 1) * 8 + 19 }, esc(typeLabel(row.kpi))) +
        tag("rect", { "class": "viz-rev-track", x: plotX, y: midY - 9, width: plotR - plotX, height: 18 }) +
        tag("rect", {
          "class": "viz-rev-bar " + (row.isTotal ? "is-total" : "is-" + row.id),
          x: xAt(lo).toFixed(1), y: midY - 9, width: Math.max(2, (xAt(hi) - xAt(lo))).toFixed(1), height: 18
        }) +
        tag("line", { "class": "viz-rev-cap", x1: xAt(lo).toFixed(1), y1: midY - 14, x2: xAt(lo).toFixed(1), y2: midY + 14 }) +
        tag("line", { "class": "viz-rev-cap", x1: xAt(hi).toFixed(1), y1: midY - 14, x2: xAt(hi).toFixed(1), y2: midY + 14 }) +
        tag("polygon", {
          "class": "viz-rev-mid" + (row.isTotal ? " is-total" : ""),
          points: xAt(mid).toFixed(1) + "," + (midY - 6) + " " + (xAt(mid) + 6).toFixed(1) + "," + midY + " " +
            xAt(mid).toFixed(1) + "," + (midY + 6) + " " + (xAt(mid) - 6).toFixed(1) + "," + midY
        }) +
        tag("text", { "class": "viz-rev-value" + (row.isTotal ? " is-total" : ""), x: W - 6, y: midY + 5, "text-anchor": "end" }, esc(kpiDisplay(row.kpi, lang))) +
        "</g>";
      hover += tag("rect", { "class": "viz-rev-hit", x: 0, y: ry - 10, width: W, height: rowH - 2, "data-rev-hit": r });
    }
    var grid = "";
    for (var gv = 0; gv <= axisMax; gv += 50) {
      grid += tag("line", { "class": "viz-grid", x1: xAt(gv).toFixed(1), y1: top - 10, x2: xAt(gv).toFixed(1), y2: axisY });
      grid += tag("text", { "class": "viz-axis-label", x: xAt(gv).toFixed(1), y: axisY + 21, "text-anchor": "middle" }, esc(gv));
    }
    var unitLabel = tag("text", { "class": "viz-axis-unit", x: plotX, y: top - 14, "text-anchor": "start" }, "M USD / an");
    var note = tag("text", { "class": "viz-caption-note", x: 4, y: H - 10 },
      esc(L("Repère central = milieu de fourchette. Les bornes hautes des composantes (230 M) dépassent le total retenu (220 M) — voir méthodologie.",
        "中心标记 = 区间中点。分项上限之和（2.3 亿美元）高于官方合计（2.2 亿美元）——详见方法学。")));
    var svg = tag("svg", {
      "class": "viz-svg viz-chart viz-revenue-chart",
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label": L("Composition des revenus 2031 en fourchettes", "2031 年收入构成（区间）")
    }, grid + tag("line", { "class": "viz-axis", x1: plotX, y1: axisY, x2: plotR, y2: axisY }) +
      body + hover + unitLabel + note);
    var srRows = all.map(function (row) {
      return row.name + " : " + kpiDisplay(row.kpi, lang) + (row.isTotal ? "" : " (" + L("milieu", "中点") + " " + fmtCompact((row.kpi.range[0] + row.kpi.range[1]) / 2, lang) + ")");
    });
    var sr = '<p class="viz-sr">' + esc(L("Revenus annuels 2031. ", "2031 年收入。")) + esc(srRows.join(" · ")) + "</p>";
    host.innerHTML = "";
    host.innerHTML = svg + sr;
    refs.charts.rev = host;
    var hitEls = $$(".viz-rev-hit", host);
    hitEls.forEach(function (hit) {
      hit.addEventListener("pointermove", function (ev) {
        var idx = parseInt(hit.getAttribute("data-rev-hit"), 10);
        var row = all[idx];
        if (!row) return;
        var rng = row.kpi.range;
        var mid = (rng[0] + rng[1]) / 2;
        var html = '<p class="viz-tip-head">' + esc(row.name) + "</p>" + tipRows([
          [L("Fourchette", "区间"), kpiDisplay(row.kpi, lang)],
          [L("Milieu", "中点"), fmtCompact(mid, lang) + " USD"],
          [L("Type", "类型"), typeLabel(row.kpi)],
          [L("Source", "来源"), kpiSourceLabel(row.kpi)]
        ]);
        tipShow(html, ev.clientX, ev.clientY);
      });
      hit.addEventListener("pointerleave", function () { tipHide(); });
    });
    if (animateOK() && !refs.drawn.rev) {
      var svgEl = host.querySelector("svg");
      if (svgEl) {
        svgEl.classList.add("viz-bars-anim");
        $$(".viz-rev-bar", svgEl).forEach(function (bar, bi) {
          if (!bar.classList.contains("is-total")) bar.style.animationDelay = (bi * 90) + "ms";
        });
      }
    }
    refs.drawn.rev = true;
  }

  function renderRevenueLegend() {
    var host = $("#revenue-legend");
    if (!host) return;
    var dat = revenueRows();
    var lang = dat.lang;
    var total = dat.total;
    var items = dat.rows.map(function (row) {
      var mid = row.kpi && row.kpi.range ? (row.kpi.range[0] + row.kpi.range[1]) / 2 : null;
      return '<li class="viz-rev-legend-item"><span class="viz-rev-key" style="background:' + row.color + '"></span>' +
        '<span class="viz-rev-legend-name">' + esc(row.name) + "</span>" +
        '<span class="viz-rev-legend-val">' + esc(kpiDisplay(row.kpi, lang)) + "</span>" +
        '<span class="viz-rev-legend-mid">' + (mid != null ? esc(L("milieu ", "中点 ") + fmtCompact(mid, lang)) : "") + "</span></li>";
    });
    if (total && total.range) {
      items.push('<li class="viz-rev-legend-item is-total"><span class="viz-rev-key is-total"></span>' +
        '<span class="viz-rev-legend-name">' + esc(L("Total affiché", "官方合计")) + "</span>" +
        '<span class="viz-rev-legend-val">' + esc(kpiDisplay(total, lang)) + "</span>" +
        '<span class="viz-rev-legend-mid">' + esc(typeLabel(total)) + "</span></li>");
    }
    host.innerHTML = '<ul class="viz-rev-legend">' + items.join("") + "</ul>" +
      '<p class="viz-rev-note">' + esc(L("Fourchettes non additives : le total Source prime sur la somme des composantes (QA-06).",
        "区间不可相加：官方合计优先于分项之和（QA-06）。")) + "</p>";
  }

  function renderCharts() {
    renderMauChart();
    renderRevenueChart();
    renderRevenueLegend();
  }
/* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* Graphe des flux : 13 nœuds / 35 relations                            */
  /* ------------------------------------------------------------------ */
  var FLOW_FALLBACK = {
    capital: ["Capital", "资本"],
    marchandises: ["Marchandises", "货物"],
    paiements: ["Paiements", "支付"],
    donnees: ["Données", "数据"],
    attention: ["Attention", "注意力"]
  };
  var FLOW_SHAPE = { capital: "diamond", marchandises: "square", paiements: "circle", donnees: "ring", attention: "triangle" };
  var FLOW_LAYOUT = {
    "p.plateforme": { x: 156, y: 150, w: 216, h: 78 },
    "p.rimu": { x: 156, y: 370, w: 216, h: 78 },
    "p.calcul": { x: 156, y: 590, w: 216, h: 78 },
    "b.projets": { x: 570, y: 92, w: 268, h: 76 },
    "b.commerce-gros": { x: 570, y: 262, w: 268, h: 76 },
    "b.biens-conso": { x: 570, y: 432, w: 268, h: 76 },
    "b.finance-rimp": { x: 570, y: 602, w: 268, h: 76 },
    "b.formation": { x: 930, y: 180, w: 250, h: 76 },
    "b.sante": { x: 930, y: 368, w: 250, h: 76 },
    "r.senegal": { x: 1168, y: 104, w: 192, h: 66 },
    "r.mali": { x: 1168, y: 272, w: 192, h: 66 },
    "r.cote-ivoire": { x: 1168, y: 440, w: 192, h: 66 },
    "r.afrique": { x: 1168, y: 612, w: 196, h: 76 }
  };
  var STORY_SEQ = {
    capital: ["p.plateforme", "b.projets", "p.plateforme", "p.calcul", "b.formation", "p.plateforme"],
    marchandises: ["b.commerce-gros", "b.biens-conso", "p.rimu", "r.senegal", "r.mali", "r.afrique", "r.cote-ivoire"],
    attention: ["p.rimu", "b.biens-conso", "p.rimu", "b.finance-rimp", "p.rimu", "b.finance-rimp"]
  };

  function flowLabel(f) {
    var v = cget("ui.flows." + f);
    if (typeof v === "string" && v) return v;
    var fb = FLOW_FALLBACK[f] || [f, f];
    return L(fb[0], fb[1]);
  }

  function upTo(el, sel) {
    var node = el;
    while (node && node !== document) {
      if (node.matches && node.matches(sel)) return node;
      node = node.parentNode;
    }
    return null;
  }

  function limitLines(lines, max) {
    if (lines.length <= max) return lines;
    var out = lines.slice(0, max);
    out[max - 1] = out[max - 1].replace(/\s*$/, "") + "…";
    return out;
  }

  function buildFlowModel() {
    var d = D();
    if (!d) return null;
    var nodes = [];
    var nodeById = {};
    function add(n) {
      nodes.push(n);
      nodeById[n.id] = n;
    }
    d.pillars.forEach(function (p) {
      var lay = FLOW_LAYOUT[p.id];
      if (!lay) return;
      add({ id: p.id, kind: "pillar", entity: p.id, name: pick(p, "name"), kindLabel: L("Pilier", "支柱"), x: lay.x, y: lay.y, w: lay.w, h: lay.h, flowCount: {}, edgeCount: 0, ref: p });
    });
    d.businessLines.forEach(function (b) {
      var lay = FLOW_LAYOUT[b.id];
      if (!lay) return;
      add({ id: b.id, kind: "business", entity: b.id, name: pick(b, "name"), kindLabel: L("Filière", "业务线"), x: lay.x, y: lay.y, w: lay.w, h: lay.h, flowCount: {}, edgeCount: 0, ref: b });
    });
    var regMap = {};
    var regs = d.regions || [];
    var aggregate = [];
    regs.forEach(function (r) {
      if (r.id === "r.nouakchott") return;
      if (r.id === "r.guinee" || r.id === "r.gambie") {
        regMap[r.id] = "r.afrique";
        aggregate.push(r);
      } else regMap[r.id] = r.id;
    });
    regs.forEach(function (r) {
      if (r.id === "r.nouakchott") return;
      if (r.id === "r.guinee" || r.id === "r.gambie") return;
      var lay = FLOW_LAYOUT[r.id];
      if (!lay) return;
      add({ id: r.id, kind: "region", entity: "b.biens-conso", name: pick(r, "name"), kindLabel: L("Destination", "目的地"), x: lay.x, y: lay.y, w: lay.w, h: lay.h, flowCount: {}, edgeCount: 0, ref: r, regionCopy: pick(r, "copy"), flowKinds: r.flowKinds || [] });
    });
    if (aggregate.length) {
      var lay2 = FLOW_LAYOUT["r.afrique"];
      var agName = ct("hero.network.westAfrica", "Afrique de l'Ouest", "西非");
      var agSub = aggregate.map(function (r) { return pick(r, "name"); }).join(" · ");
      var agCopy = aggregate.map(function (r) { return pick(r, "copy"); }).filter(Boolean).join(" ");
      var kinds = [];
      aggregate.forEach(function (r) { (r.flowKinds || []).forEach(function (k) { if (kinds.indexOf(k) < 0) kinds.push(k); }); });
      add({ id: "r.afrique", kind: "region", entity: "b.biens-conso", name: agName, sub: agSub, kindLabel: L("Destination", "目的地"), x: lay2.x, y: lay2.y, w: lay2.w, h: lay2.h, flowCount: {}, edgeCount: 0, regionCopy: agCopy, flowKinds: kinds });
    }
    var edges = [];
    (d.relations || []).forEach(function (rel) {
      var from = rel.from.charAt(0) === "r" ? regMap[rel.from] : rel.from;
      var to = rel.to.charAt(0) === "r" ? regMap[rel.to] : rel.to;
      if (!from || !to || !nodeById[from] || !nodeById[to]) return;
      var e = { id: rel.id, flow: rel.flow, from: from, to: to, rel: rel, off: 0 };
      edges.push(e);
      nodeById[from].flowCount[rel.flow] = (nodeById[from].flowCount[rel.flow] || 0) + 1;
      nodeById[to].flowCount[rel.flow] = (nodeById[to].flowCount[rel.flow] || 0) + 1;
      nodeById[from].edgeCount++;
      nodeById[to].edgeCount++;
    });
    var pairGroups = {};
    edges.forEach(function (e) {
      var key = [e.from, e.to].sort().join("|");
      if (!pairGroups[key]) pairGroups[key] = [];
      pairGroups[key].push(e);
    });
    Object.keys(pairGroups).forEach(function (key) {
      var list = pairGroups[key];
      for (var i = 0; i < list.length; i++) list[i].off = (i - (list.length - 1) / 2) * 18;
    });
    return { nodes: nodes, edges: edges, nodeById: nodeById, arrowUid: ++uid };
  }

  function edgeCurve(a, b, off) {
    var dx = b.x - a.x, dy = b.y - a.y;
    var ax = a.x, ay = a.y, bx = b.x, by = b.y;
    var c1x, c1y, c2x, c2y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      c1x = ax + dx * 0.5; c1y = ay + (off || 0);
      c2x = bx - dx * 0.5; c2y = by + (off || 0);
    } else {
      c1x = ax + (off || 0); c1y = ay + dy * 0.5;
      c2x = bx + (off || 0); c2y = by - dy * 0.5;
    }
    return "M" + ax + " " + ay + " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + bx + " " + by;
  }

  function edgeLength(e, model) {
    var a = model.nodeById[e.from], b = model.nodeById[e.to];
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  function flowDefs(uidv) {
    var defs = "<defs>";
    FLOWS.forEach(function (f) {
      defs += '<marker id="vizArrow' + uidv + "-" + f + '" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" class="viz-arrow" data-flow="' + f + '"/></marker>';
    });
    defs += "</defs>";
    return defs;
  }

  function renderFlowGraph() {
    var host = $("#flow-canvas");
    if (!host) return;
    var model = buildFlowModel();
    if (!model || !model.nodes.length) {
      host.innerHTML = emptyBox();
      return;
    }
    refs.flow = model;
    var edgeHTML = "";
    for (var i = 0; i < model.edges.length; i++) {
      var e = model.edges[i];
      var a = model.nodeById[e.from], b = model.nodeById[e.to];
      var d = edgeCurve(a, b, e.off);
      edgeHTML += '<g class="viz-edge" data-edge="' + esc(e.rel.id) + '" data-flow="' + e.flow + '" data-from="' + e.from + '" data-to="' + e.to + '">' +
        '<path class="viz-edge-hit" d="' + d + '" fill="none"/>' +
        '<path class="viz-edge-line" d="' + d + '" fill="none" marker-end="url(#vizArrow' + model.arrowUid + "-" + e.flow + ')"/>' +
        "</g>";
    }
    var particleHTML = "";
    if (!still()) {
      var sorted = model.edges.slice().sort(function (x, y) {
        return edgeLength(x, model) - edgeLength(y, model);
      });
      var pack = sorted.slice(0, 30);
      for (var p = 0; p < pack.length; p++) {
        var pe = pack[p];
        var pa = model.nodeById[pe.from], pb = model.nodeById[pe.to];
        var pd = edgeCurve(pa, pb, pe.off);
        var dur = (4.2 + (p % 5) * 0.55).toFixed(2);
        var begin = (-(p * 0.37)).toFixed(2);
        particleHTML += '<circle class="viz-particle" data-flow="' + pe.flow + '" r="2.1"><animateMotion dur="' + dur + 's" begin="' + begin + 's" repeatCount="indefinite" path="' + pd + '"/></circle>';
      }
    }
    var nodeHTML = "";
    for (var n = 0; n < model.nodes.length; n++) nodeHTML += flowNodeMarkup(model.nodes[n]);
    var svg = '<svg class="viz-svg viz-flowgraph" viewBox="0 0 1280 720" role="group" aria-label="' +
      esc(L("Graphe des cinq flux : trois piliers, six filières, quatre destinations", "五类流关系图：三支柱、六业务线、四个目的地")) +
      '" data-nodes="' + model.nodes.length + '" data-edges="' + model.edges.length + '">' +
      flowDefs(model.arrowUid) +
      '<rect class="viz-flow-bg" x="0" y="0" width="1280" height="720"/>' +
      '<g class="viz-edges">' + edgeHTML + "</g>" +
      '<g class="viz-particles" aria-hidden="true">' + particleHTML + "</g>" +
      '<g class="viz-nodes">' + nodeHTML + "</g>" +
      "</svg>";
    host.innerHTML = svg;
    var svgEl = host.querySelector("svg");
    refs.flowSVG = svgEl;
    model.nodes.forEach(function (nn) { nn.el = svgEl.querySelector('[data-node="' + nn.id + '"]'); });
    model.edges.forEach(function (ee) { ee.el = svgEl.querySelector('[data-edge="' + esc(ee.rel.id) + '"]'); });
    bindFlowEvents(svgEl, model);
    syncLegend();
    syncStoryChips();
    syncControls();
    applyFlowState();
    var cap = $("#story-caption");
    if (cap && !cap.textContent.replace(/\s+/g, "")) {
      cap.textContent = ct("flux.hint", "Cliquez une histoire pour suivre le circuit ; cliquez un nœud pour ouvrir sa fiche.",
        "点击故事按路径点亮；点击节点打开详情。");
    }
  }

  function flowNodeMarkup(n) {
    var isZH = curLang() === "zh";
    var maxChars = isZH ? Math.floor((n.w - 44) / 14) : Math.floor((n.w - 50) / 7.3);
    var lines = limitLines(textLines(n.name, Math.max(4, maxChars)), 2);
    var lineH = 17;
    var blockH = (lines.length - 1) * lineH;
    var nameY = n.y + (n.kind === "region" ? -3 : 10) - blockH / 2 + (n.sub ? -5 : 0);
    var body = '<rect class="viz-node-bg" x="' + (n.x - n.w / 2) + '" y="' + (n.y - n.h / 2) + '" width="' + n.w + '" height="' + n.h + '" rx="' + (n.kind === "region" ? 30 : 10) + '"/>';
    if (n.kind === "pillar") {
      body += '<rect class="viz-node-accent" x="' + (n.x - n.w / 2 + 1) + '" y="' + (n.y - n.h / 2 + 14) + '" width="3" height="' + (n.h - 28) + '" rx="2"/>';
    }
    body += '<circle class="viz-node-dot" data-flow="' + (n.kind === "pillar" ? "capital" : n.kind === "region" ? "marchandises" : "donnees") + '" cx="' + (n.x - n.w / 2 + 16) + '" cy="' + (n.y - n.h / 2 + 17) + '" r="3.6"/>';
    if (n.kind !== "region") body += '<text class="viz-node-kind" x="' + (n.x - n.w / 2 + 27) + '" y="' + (n.y - n.h / 2 + 21) + '">' + esc(n.kindLabel) + "</text>";
    body += svgText("viz-node-name", n.x, nameY, lines, lineH, { "text-anchor": "middle" });
    if (n.sub) body += '<text class="viz-node-sub" x="' + n.x + '" y="' + (n.y + n.h / 2 - 11) + '" text-anchor="middle">' + esc(n.sub) + "</text>";
    var label = n.name + ", " + n.kindLabel + ", " + n.edgeCount + " " + L("relations liées", "条关联关系");
    return '<g class="viz-node" data-node="' + n.id + '" data-kind="' + n.kind + '" tabindex="0" role="button" aria-label="' + esc(label) + '">' + body + "</g>";
  }

  function bindFlowEvents(svgEl, model) {
    var moving = false;
    function targetOf(ev) {
      var nodeEl = upTo(ev.target, "[data-node]");
      if (nodeEl) return { type: "node", el: nodeEl, id: nodeEl.getAttribute("data-node") };
      var edgeEl = upTo(ev.target, "[data-edge]");
      if (edgeEl) return { type: "edge", el: edgeEl, id: edgeEl.getAttribute("data-edge") };
      return null;
    }
    function hoverON(ev) {
      var t = targetOf(ev);
      if (!t) return;
      if (state.hoverNode === t.id) return;
      state.hoverNode = t.id;
      flowHover(t.type === "node" ? t.id : "", t.type === "edge" ? t.id : "");
      refs.flowTip = t.type === "node" ? nodeTip(t.id) : edgeTip(t.id);
      tipShow(refs.flowTip, ev.clientX, ev.clientY);
      moving = true;
    }
    function hoverMove(ev) {
      if (!moving || !refs.flowTip) return;
      tipShow(refs.flowTip, ev.clientX, ev.clientY);
    }
    function hoverOFF(ev) {
      var t = targetOf(ev);
      var to = ev.relatedTarget;
      if (t && to && t.el.contains && t.el.contains(to)) return;
      moving = false;
      state.hoverNode = "";
      refs.flowTip = "";
      flowHover("", "");
      tipHide();
    }
    svgEl.addEventListener("pointerover", hoverON);
    svgEl.addEventListener("pointermove", hoverMove);
    svgEl.addEventListener("pointerout", hoverOFF);
    svgEl.addEventListener("click", function (ev) {
      var nodeEl = upTo(ev.target, "[data-node]");
      if (nodeEl) {
        var id = nodeEl.getAttribute("data-node");
        var nn = model.nodeById[id];
        if (!nn) return;
        if (state.pickingIsolate) {
          state.pickingIsolate = false;
          setIsolate(id);
          return;
        }
        if (ev.altKey || ev.metaKey) { setIsolate(id); return; }
        openFlowEntity(nn);
        return;
      }
      var edgeEl = upTo(ev.target, "[data-edge]");
      if (edgeEl) {
        var pe = null;
        for (var i = 0; i < model.edges.length; i++) if (model.edges[i].id === edgeEl.getAttribute("data-edge")) { pe = model.edges[i]; break; }
        if (pe) setFlow(pe.flow);
        return;
      }
      resetFlow();
    });
    svgEl.addEventListener("focusin", function (ev) {
      var nodeEl = upTo(ev.target, "[data-node]");
      if (!nodeEl) return;
      var id = nodeEl.getAttribute("data-node");
      flowHover(id, "");
      var rect = nodeEl.getBoundingClientRect();
      refs.flowTip = nodeTip(id);
      tipShow(refs.flowTip, rect.left + rect.width / 2, rect.top + rect.height);
    });
    svgEl.addEventListener("focusout", function () {
      refs.flowTip = "";
      flowHover("", "");
      tipHide();
    });
    svgEl.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") {
        resetFlow();
        return;
      }
      var nodeEl = upTo(ev.target, "[data-node]");
      if (!nodeEl) return;
      if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
        ev.preventDefault();
        var nn = model.nodeById[nodeEl.getAttribute("data-node")];
        if (nn) openFlowEntity(nn);
      }
    });
  }

  function flowHover(nodeId, edgeId) {
    var model = refs.flow;
    var svg = refs.flowSVG;
    if (!model || !svg) return;
    model.nodes.forEach(function (n) { if (n.el) n.el.classList.remove("is-linked", "is-hover"); });
    model.edges.forEach(function (e) { if (e.el) e.el.classList.remove("is-linked", "is-hover"); });
    if (nodeId) {
      var n = model.nodeById[nodeId];
      if (n && n.el) {
        n.el.classList.add("is-hover");
        model.edges.forEach(function (e) {
          if (e.from === nodeId || e.to === nodeId) {
            if (e.el) e.el.classList.add("is-linked");
            var other = model.nodeById[e.from === nodeId ? e.to : e.from];
            if (other && other.el) other.el.classList.add("is-linked");
          }
        });
      }
    } else if (edgeId) {
      model.edges.forEach(function (e) {
        if (e.id !== edgeId) return;
        if (e.el) e.el.classList.add("is-hover");
        var a = model.nodeById[e.from], b = model.nodeById[e.to];
        if (a && a.el) a.el.classList.add("is-linked");
        if (b && b.el) b.el.classList.add("is-linked");
      });
    }
    var on = !!(nodeId || edgeId);
    if (on) svg.setAttribute("data-hover", "1");
    else svg.removeAttribute("data-hover");
  }

  function nodeTip(id) {
    var model = refs.flow;
    var n = model && model.nodeById[id];
    if (!n) return "";
    var rows = [[L("Type", "类型"), n.kindLabel]];
    if (n.flowKinds && n.flowKinds.length) rows.push([L("Flux concernés", "涉及流"), n.flowKinds.map(flowLabel).join(" · ")]);
    rows.push([L("Relations", "关联关系"), String(n.edgeCount)]);
    if (n.regionCopy) rows.push([L("Note", "说明"), n.regionCopy]);
    return '<p class="viz-tip-head">' + esc(n.name) + "</p>" + tipRows(rows) +
      '<p class="viz-tip-hint">' + esc(n.kind === "region" ? L("Cliquez pour ouvrir la filière liée", "点击打开相关业务") : L("Cliquez pour ouvrir la fiche", "点击打开详情")) +
      (n.kind === "region" ? "" : " · " + esc(L("Alt + clic ou bouton Isoler", "Alt + 点击或「聚焦」"))) + "</p>";
  }

  function edgeTip(id) {
    var model = refs.flow;
    if (!model) return "";
    var e = null;
    for (var i = 0; i < model.edges.length; i++) if (model.edges[i].id === id) { e = model.edges[i]; break; }
    if (!e) return "";
    var a = model.nodeById[e.from], b = model.nodeById[e.to];
    var rows = [
      [L("Flux", "流"), flowLabel(e.flow)],
      [L("Sens", "方向"), a.name + " → " + b.name]
    ];
    var detail = pick(e.rel, "detail");
    if (detail) rows.push([L("Détail", "说明"), detail]);
    var k = e.rel.kpiIds && e.rel.kpiIds.length ? kpiById(e.rel.kpiIds[0]) : null;
    if (k) rows.push([L("Repère", "数据"), kpiDisplay(k, curLang()) + " · " + typeLabel(k)]);
    else rows.push([L("Volume", "规模"), L("Volume non chiffré à ce stade", "该阶段未量化")]);
    return '<p class="viz-tip-head"><span class="viz-tip-flow" data-flow="' + e.flow + '">' + esc(flowLabel(e.flow)) + "</span></p>" +
      '<p class="viz-tip-sub">' + esc(pick(e.rel, "label")) + "</p>" + tipRows(rows);
  }

  function openFlowEntity(n) {
    var id = n.entity || n.id;
    var app = window.APP;
    if (app && typeof app.openEntity === "function") {
      try { app.openEntity(id); return; } catch (e) {}
    }
    try {
      document.dispatchEvent(new CustomEvent("viz:open-entity", { detail: { id: id } }));
    } catch (e) {}
  }

  function activeFlowSet() {
    var out = {};
    var list = state.activeFlows;
    if (list && list.length) {
      for (var i = 0; i < list.length; i++) if (FLOWS.indexOf(list[i]) >= 0) out[list[i]] = 1;
      return out;
    }
    if (state.flow && state.flow !== "all" && FLOWS.indexOf(state.flow) >= 0) {
      out[state.flow] = 1;
      return out;
    }
    return null;
  }

  function applyFlowState() {
    var model = refs.flow;
    var svg = refs.flowSVG;
    if (!model || !svg) return;
    var active = activeFlowSet();
    var keys = active ? Object.keys(active) : [];
    svg.setAttribute("data-filter", active ? keys.join(" ") : "all");
    if (state.isolate) svg.setAttribute("data-isolate", state.isolate);
    else svg.removeAttribute("data-isolate");
    model.nodes.forEach(function (n) {
      if (!n.el) return;
      n.el.classList.remove("is-in-flow", "is-flow-dim", "is-focus", "is-adj", "is-selected", "is-story-done", "is-story-current");
      var inFlow = true;
      if (active) {
        inFlow = false;
        for (var f = 0; f < keys.length; f++) if (n.flowCount[keys[f]]) { inFlow = true; break; }
      }
      if (inFlow) {
        if (active) n.el.classList.add("is-in-flow");
      } else n.el.classList.add("is-flow-dim");
    });
    model.edges.forEach(function (e) {
      if (!e.el) return;
      e.el.classList.remove("is-focus-edge", "is-story-edge", "is-flow-dim", "is-selected-edge");
      if (active && !active[e.flow]) e.el.classList.add("is-flow-dim");
    });
    if (state.selected && model.nodeById[state.selected]) {
      var sel = model.nodeById[state.selected];
      if (sel.el) sel.el.classList.add("is-selected");
      model.edges.forEach(function (e) {
        if (e.from === state.selected || e.to === state.selected) {
          if (e.el) e.el.classList.add("is-selected-edge");
        }
      });
    }
    if (state.isolate) {
      var focus = model.nodeById[state.isolate];
      if (focus && focus.el) {
        focus.el.classList.add("is-focus");
        var near = {};
        model.edges.forEach(function (e) {
          if (active && !active[e.flow]) return;
          if (e.from === state.isolate) {
            near[e.to] = 1;
            if (e.el) e.el.classList.add("is-focus-edge");
          } else if (e.to === state.isolate) {
            near[e.from] = 1;
            if (e.el) e.el.classList.add("is-focus-edge");
          }
        });
        Object.keys(near).forEach(function (nid) {
          var nn = model.nodeById[nid];
          if (nn && nn.el) nn.el.classList.add("is-adj");
        });
      }
    }
    applyStoryClasses();
    syncAppLegend();
  }

  function syncAppLegend() {
    var btns = $$("#flow-legend .flow-check");
    if (!btns.length) return;
    var active = activeFlowSet();
    btns.forEach(function (b) {
      var f = b.getAttribute("data-flow");
      var on = !active || !!active[f];
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function applyStoryClasses() {
    var model = refs.flow;
    var svg = refs.flowSVG;
    if (!model || !svg) return;
    if (!state.story) {
      svg.removeAttribute("data-story");
      return;
    }
    svg.setAttribute("data-story", state.story);
    var seq = storySeq(state.story);
    var upto = state.finished ? seq.length - 1 : Math.min(state.step, seq.length - 1);
    for (var i = 0; i <= upto; i++) {
      var n = model.nodeById[seq[i]];
      if (n && n.el) n.el.classList.add("is-story-done");
    }
    if (!state.finished) {
      var cur = model.nodeById[seq[upto]];
      if (cur && cur.el) cur.el.classList.add("is-story-current");
    }
    var flow = storyFlow(state.story);
    for (var j = 1; j <= upto; j++) {
      for (var k = 0; k < model.edges.length; k++) {
        var e = model.edges[k];
        if (e.flow !== flow) continue;
        if ((e.from === seq[j - 1] && e.to === seq[j]) || (e.from === seq[j] && e.to === seq[j - 1])) {
          if (e.el) e.el.classList.add("is-story-edge");
          break;
        }
      }
    }
  }

  function setFlowFilter(flows) {
    if (state.story) stopStory();
    if (typeof flows === "string") flows = flows === "all" ? [] : [flows];
    if (!Array.isArray(flows)) flows = [];
    var valid = [];
    for (var i = 0; i < flows.length; i++) {
      if (FLOWS.indexOf(flows[i]) >= 0 && valid.indexOf(flows[i]) < 0) valid.push(flows[i]);
    }
    state.activeFlows = (valid.length === 0 || valid.length === FLOWS.length) ? null : valid;
    state.flow = state.activeFlows && state.activeFlows.length === 1 ? state.activeFlows[0] : "all";
    applyFlowState();
    syncLegend();
    updateFlowControls();
  }

  function setFlow(f) {
    if (f === "all") return setFlowFilter([]);
    var active = activeFlowSet();
    var sole = active && Object.keys(active).length === 1 && active[f];
    setFlowFilter(sole ? [] : [f]);
  }

  function setIsolate(id) {
    if (state.story) stopStory();
    state.pickingIsolate = false;
    state.isolate = state.isolate === id ? "" : id || "";
    state.focusNode = state.isolate;
    state.hoverNode = "";
    try { tipHide(); } catch (e) {}
    applyFlowState();
    updateFlowControls();
  }

  function isolateSelection() {
    if (state.isolate) {
      setIsolate("");
      return;
    }
    if (state.pickingIsolate) {
      state.pickingIsolate = false;
      updateFlowControls();
      return;
    }
    var target = state.focusNode || state.selected;
    if (target) {
      setIsolate(target);
      return;
    }
    /* Aucun nœud sélectionné : armer la sélection au prochain clic. */
    state.pickingIsolate = true;
    applyFlowState();
    updateFlowControls();
  }

  function focusNode(id) {
    if (!id || !refs.flow || !refs.flow.nodeById[id]) return;
    state.selected = id;
    state.focusNode = id;
    applyFlowState();
  }

  function setView(view) {
    state.view = view === "matrix" ? "matrix" : "graph";
    var section = $("#ch-flux");
    if (section) section.setAttribute("data-view", state.view);
    $$("#flow-controls [data-flow-view]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-flow-view") === state.view);
      b.setAttribute("aria-pressed", b.getAttribute("data-flow-view") === state.view ? "true" : "false");
    });
  }

  function playStory(id) {
    startStory(id, true);
  }

  function resetFlow() {
    stopStory();
    state.activeFlows = null;
    state.flow = "all";
    state.isolate = "";
    state.pickingIsolate = false;
    state.focusNode = "";
    state.selected = "";
    applyFlowState();
    syncLegend();
    updateFlowControls();
    setView("graph");
  }

  function syncLegend() {
    var host = $("#flow-legend");
    if (!host) return;
    if (host.querySelector(".flow-check")) {
      refs.ownLegend = false;
      syncAppLegend();
      return;
    }
    var btns = $$("[data-flow]", host);
    if (!btns.length || refs.ownLegend) {
      refs.ownLegend = true;
      var html = '<button class="viz-chip" type="button" data-flow="all" aria-pressed="' + (state.flow === "all" ? "true" : "false") + '">' +
        '<span class="viz-key is-all"></span><span class="viz-chip-label">' + esc(ct("ui.all", "Tout", "全部")) + "</span></button>";
      FLOWS.forEach(function (f) {
        html += '<button class="viz-chip" type="button" data-flow="' + f + '" aria-pressed="' + (state.flow === f ? "true" : "false") + '">' +
          '<span class="viz-key" data-shape="' + FLOW_SHAPE[f] + '"></span><span class="viz-chip-label">' + esc(flowLabel(f)) + "</span></button>";
      });
      host.innerHTML = html;
      btns = $$("[data-flow]", host);
    }
    btns.forEach(function (b) {
      var f = b.getAttribute("data-flow");
      b.setAttribute("aria-pressed", String((f === "all" && state.flow === "all") || f === state.flow));
    });
  }

  function storyList() {
    var v = cget("flux.stories");
    if (Array.isArray(v) && v.length) return v;
    return fallbackStories();
  }

  function fallbackStories() {
    var inv = kpiById("kpi.investment_intentions");
    var goods = kpiById("kpi.wa_goods_transit");
    var views = kpiById("kpi.daily_views_2031");
    var lang = curLang();
    return [
      {
        id: "capital",
        title: L("Le capital ouvre le canal", "资本打开通道"),
        subtitle: L("Financements, projets, capital humain", "融资、项目、人力资本"),
        captions: [
          L("Les bailleurs publient leurs intentions sur la plateforme bilatérale.", "出资方在双边平台发布投资意向。"),
          L("La plateforme canalise le financement vers les projets bancables.", "平台把资金引导到可融资项目。"),
          L("Les projets reviennent avec garanties et dossiers complets.", "项目带着担保与完整材料回流。"),
          L("La formation prépare le capital humain du centre de calcul.", "培训为算力中心储备人力资本。"),
          L("Le capital vert finance l'électricité dédiée au centre.", "绿色资本为算力中心提供电力。")
        ],
        outcome: { value: kpiDisplay(inv, lang), label: L("d'intentions d'investissement", "投资意向") }
      },
      {
        id: "marchandises",
        title: L("Les marchandises traversent Nouakchott", "货物经过努瓦克肖特"),
        subtitle: L("Sourcing, hub, répartition vers cinq pays", "采购、枢纽、分拨五国"),
        captions: [
          L("Le commerce de gros sélectionne et achemine les biens chinois.", "批发业务筛选并组织中国商品。"),
          L("Le hub de distribution stocke, dédouane et répartit.", "分拨枢纽负责仓储、清关与分拨。"),
          L("RIMU Shop et le live commerce ouvrent le canal en ligne.", "RIMU Shop 与直播带货打开线上渠道。"),
          L("Les acheteurs du Sénégal, du Mali et de la Côte d'Ivoire commandent.", "塞内加尔、马里与科特迪瓦买家下单。"),
          L("La Guinée et la Gambie rejoignent le circuit via Nouakchott.", "几内亚与冈比亚经努瓦克肖特加入回路。")
        ],
        outcome: { value: kpiDisplay(goods, lang), label: L("de biens transitant par la Mauritanie / an", "货物经毛里塔尼亚中转 / 年") }
      },
      {
        id: "attention",
        title: L("L'attention devient un revenu", "注意力转化为收入"),
        subtitle: L("Audience, créateurs, services", "受众、创作者、服务"),
        captions: [
          L("RIMU capte l'attention quotidienne avec des contenus locaux.", "RIMU 以本地内容吸引日常注意力。"),
          L("L'audience alimente le marché et le live commerce.", "受众转化为市场与直播带货。"),
          L("Les formations deviennent des vidéos courtes.", "培训内容变成短视频。"),
          L("Les contenus de santé certifiés touchent le public.", "认证健康内容触达公众。"),
          L("L'attention se convertit en comptes RIMP et en revenus.", "注意力转化为 RIMP 账户与收入。")
        ],
        outcome: { value: kpiDisplay(views, lang), label: L("de vues par jour en 2031", "2031 年日播放量") }
      }
    ];
  }

  function storyById(id) {
    var list = storyList();
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }

  function storyFlow(id) {
    return FLOWS.indexOf(id) >= 0 ? id : "capital";
  }

  function storySeq(id) {
    var model = refs.flow;
    var base = STORY_SEQ[id] || STORY_SEQ.capital;
    if (!model) return base;
    return base.filter(function (nid) { return !!model.nodeById[nid]; });
  }

  function syncStoryChips() {
    var host = $("#story-chips");
    if (!host) return;
    if (host.querySelector(".story-chip")) {
      refs.ownStories = false;
      $$("[data-story]", host).forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-story") === state.story);
      });
      return;
    }
    var stories = storyList();
    var btns = $$("[data-story]", host);
    if (!btns.length || refs.ownStories) {
      refs.ownStories = true;
      var html = '<span class="viz-story-label">' + esc(ct("flux.storyLabel", "Récits de flux", "流故事")) + "</span>";
      stories.forEach(function (s) {
        if (!s || !s.id) return;
        html += '<button class="viz-story-chip" type="button" data-story="' + esc(s.id) + '" aria-pressed="' + (state.story === s.id ? "true" : "false") + '">' +
          '<span class="viz-story-chip-title">' + esc(s.title || flowLabel(s.id)) + "</span>" +
          (s.subtitle ? '<span class="viz-story-chip-sub">' + esc(s.subtitle) + "</span>" : "") + "</button>";
      });
      host.innerHTML = html;
      btns = $$("[data-story]", host);
    }
    btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-story") === state.story)); });
  }

  function ensureStoryControls(host) {
    if (host.querySelector('[data-action="pause"]')) return;
    var html = '<button class="btn btn-ghost btn-sm viz-story-ctl" type="button" data-action="pause" hidden>' + esc(ct("ui.pause", "Pause", "暂停")) + "</button>" +
      '<button class="btn btn-ghost btn-sm viz-story-ctl" type="button" data-action="replay" hidden>' + esc(ct("ui.replay", "Rejouer", "重播")) + "</button>" +
      '<button class="btn btn-ghost btn-sm viz-story-ctl" type="button" data-action="exit" hidden>' + esc(ct("ui.exit", "Quitter", "退出")) + "</button>";
    host.insertAdjacentHTML("beforeend", html);
  }

  function syncControls() {
    var host = $("#flow-controls");
    if (!host) return;
    if (host.querySelector("[data-flow-action],[data-flow-view]")) {
      refs.ownControls = false;
      ensureStoryControls(host);
      updateFlowControls();
      return;
    }
    var btns = $$("[data-action]", host);
    if (!btns.length || refs.ownControls) {
      refs.ownControls = true;
      host.innerHTML =
        '<button class="btn btn-ghost btn-sm viz-btn" type="button" data-action="reset">' + esc(L("Tout afficher", "全部显示")) + "</button>" +
        '<button class="btn btn-ghost btn-sm viz-btn" type="button" data-action="isolate">' + esc(L("Isoler", "聚焦")) + "</button>" +
        '<button class="btn btn-ghost btn-sm viz-btn" type="button" data-action="pause">' + esc(L("Pause", "暂停")) + "</button>" +
        '<button class="btn btn-ghost btn-sm viz-btn" type="button" data-action="replay">' + esc(ct("ui.replay", "Rejouer", "重播")) + "</button>" +
        '<button class="btn btn-ghost btn-sm viz-btn" type="button" data-action="exit">' + esc(ct("ui.exit", "Quitter", "退出")) + "</button>";
    }
    updateFlowControls();
  }

  function updateFlowControls() {
    var host = $("#flow-controls");
    if (!host) return;
    var storyOn = !!state.story;
    function btn(action) { return host.querySelector('[data-action="' + action + '"],[data-flow-action="' + action + '"]'); }
    var bReset = btn("reset");
    if (bReset) bReset.textContent = state.flow === "all" && !state.isolate ? L("Tout afficher", "全部显示") : ct("ui.reset", "Réinitialiser", "重置");
    var bIso = btn("isolate");
    if (bIso) {
      bIso.textContent = state.isolate
        ? L("Quitter le focus", "退出聚焦")
        : state.pickingIsolate
          ? L("Choisir un nœud…", "选择节点…")
          : ct("ui.isolate", "Isoler", "聚焦");
      bIso.classList.toggle("is-active", !!state.isolate || !!state.pickingIsolate);
      bIso.setAttribute("aria-pressed", state.isolate ? "true" : "false");
      bIso.disabled = false;
      bIso.title = state.pickingIsolate
        ? L("Cliquez un nœud du graphe pour l'isoler", "点击关系图中的节点进行聚焦")
        : L("Isoler le nœud sélectionné ; sinon choisir un nœud", "聚焦当前节点；否则选择一个节点");
    }
    var flowSvg = $("#flow-canvas svg");
    if (flowSvg) {
      if (state.pickingIsolate) flowSvg.setAttribute("data-isolate-pick", "true");
      else flowSvg.removeAttribute("data-isolate-pick");
    }
    var bPause = btn("pause");
    if (bPause) {
      bPause.hidden = !storyOn;
      bPause.textContent = state.paused ? ct("ui.resume", "Reprendre", "继续") : ct("ui.pause", "Pause", "暂停");
    }
    var bReplay = btn("replay");
    if (bReplay) bReplay.hidden = !storyOn;
    var bExit = btn("exit");
    if (bExit) bExit.hidden = !storyOn;
  }

  function notifyStory() {
    var app = window.APP;
    if (app && typeof app.onFlowStoryState === "function") {
      try {
        app.onFlowStoryState({ id: state.story, step: state.step, count: state.stepCount, paused: state.paused, finished: state.finished });
      } catch (e) {}
    }
  }

  function applyChromeLang() {
    if (refs.ownLegend) syncLegend();
    if (refs.ownStories) syncStoryChips();
    if (refs.ownControls) syncControls();
  }

  function clearStoryTimer() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function setCaption(html) {
    var app = window.APP;
    if (app && typeof app.setStoryCaption === "function") {
      try { app.setStoryCaption(html); return; } catch (e) {}
    }
    var cap = $("#story-caption");
    if (cap) cap.innerHTML = html;
  }

  function storyCaptionHTML(story, step, finished) {
    var captions = (story && story.captions) || [];
    var n = captions.length || 1;
    var title = story && story.title ? story.title : flowLabel((story && story.id) || "capital");
    var html = '<span class="viz-cap-head"><span class="viz-cap-title">' + esc(title) +
      '</span><span class="viz-cap-count">' + (finished ? "✓" : step + 1 + " / " + n) + "</span></span>";
    if (!finished) html += '<span class="viz-cap-body">' + esc(captions[step] || "") + "</span>";
    if (finished && story && story.outcome) {
      html += '<span class="viz-cap-outcome"><span class="viz-cap-out-value">' + esc(story.outcome.value || "") + '</span><span class="viz-cap-out-label">' + esc(story.outcome.label || "") + "</span></span>";
    }
    return html;
  }

  function renderStoryStep() {
    var story = storyById(state.story);
    if (!story) return;
    setCaption(storyCaptionHTML(story, state.step, false));
  }

  function startStory(id, restart) {
    var story = storyById(id);
    if (!story) return;
    if (state.story === id && !restart && !state.finished) {
      togglePauseStory();
      return;
    }
    clearStoryTimer();
    state.story = id;
    state.step = 0;
    state.paused = false;
    state.finished = false;
    state.isolate = "";
    state.pickingIsolate = false;
    state.activeFlows = null;
    state.flow = "all";
    state.selected = "";
    state.stepCount = (story.captions && story.captions.length) || 0;
    if (still()) {
      /* reduced-motion / low-bandwidth : pas d'auto-lecture, on affiche
         directement la chaîne complète + le résultat (information complète). */
      state.step = Math.max(0, state.stepCount - 1);
      state.finished = true;
      setCaption(storyCaptionHTML(story, state.step, true));
      applyFlowState();
      syncStoryChips();
      syncLegend();
      updateFlowControls();
      notifyStory();
      return;
    }
    renderStoryStep();
    applyFlowState();
    syncStoryChips();
    syncLegend();
    updateFlowControls();
    notifyStory();
    if (!still()) {
      state.timer = setInterval(function () {
        if (!state.story || state.paused) return;
        if (state.step < state.stepCount - 1) {
          state.step++;
          renderStoryStep();
          applyFlowState();
          notifyStory();
        } else finishStory();
      }, 3200);
    }
  }

  function finishStory() {
    clearStoryTimer();
    var story = storyById(state.story);
    state.finished = true;
    state.step = Math.max(0, state.stepCount - 1);
    if (story) setCaption(storyCaptionHTML(story, state.step, true));
    applyStoryClasses();
    updateFlowControls();
    notifyStory();
  }

  function stopStory() {
    if (!state.story) return;
    clearStoryTimer();
    state.story = "";
    state.step = 0;
    state.paused = false;
    state.finished = false;
    setCaption(esc(ct("flux.hint", "Cliquez une histoire pour suivre le circuit ; cliquez un nœud pour ouvrir sa fiche.",
      "点击故事按路径点亮；点击节点打开详情。")));
    applyFlowState();
    syncStoryChips();
    updateFlowControls();
    notifyStory();
  }

  function togglePauseStory() {
    if (!state.story) return;
    state.paused = !state.paused;
    updateFlowControls();
    notifyStory();
  }

  function onDocClick(ev) {
    var t = ev.target;
    if (!t) return;
    var flowBtn = upTo(t, "#flow-legend [data-flow]");
    if (flowBtn) {
      if (!flowBtn.classList.contains("viz-chip")) return;
      ev.preventDefault();
      setFlow(flowBtn.getAttribute("data-flow"));
      return;
    }
    var act = upTo(t, "#flow-controls [data-action]");
    if (act) {
      if (!act.classList.contains("viz-btn") && !act.classList.contains("viz-story-ctl")) return;
      ev.preventDefault();
      var action = act.getAttribute("data-action");
      if (action === "reset") resetFlow();
      else if (action === "isolate") {
        if (state.isolate) setIsolate("");
        else if (state.focusNode) setIsolate(state.focusNode);
      } else if (action === "pause") togglePauseStory();
      else if (action === "replay") startStory(state.story || "capital", true);
      else if (action === "exit") stopStory();
      return;
    }
    var chip = upTo(t, "#story-chips [data-story]");
    if (chip) {
      if (!chip.classList.contains("viz-story-chip")) return;
      ev.preventDefault();
      startStory(chip.getAttribute("data-story"), false);
      return;
    }
    var mcell = upTo(t, "#flow-matrix [data-mcell]");
    if (mcell) {
      ev.preventDefault();
      setFlow(mcell.getAttribute("data-mflow"));
      return;
    }
    var mrow = upTo(t, "#flow-matrix [data-mnode]");
    if (mrow) {
      ev.preventDefault();
      setIsolate(mrow.getAttribute("data-mnode"));
    }
  }

  function renderMatrix() {
    var host = $("#flow-matrix");
    if (!host) return;
    var model = refs.flow || buildFlowModel();
    if (!model) {
      host.innerHTML = "";
      return;
    }
    var counts = {};
    model.edges.forEach(function (e) {
      var ko = e.from + "|" + e.flow;
      var ki = e.to + "|" + e.flow;
      counts[ko] = counts[ko] || { out: 0, in: 0 };
      counts[ki] = counts[ki] || { out: 0, in: 0 };
      counts[ko].out++;
      counts[ki].in++;
    });
    var rows = model.nodes.filter(function (n) { return n.kind === "business"; })
      .concat(model.nodes.filter(function (n) { return n.kind === "pillar"; }));
    var head = '<tr><th scope="col" class="viz-m-corner">' + esc(L("Nœud", "节点")) + "</th>" +
      FLOWS.map(function (f) {
        return '<th scope="col" data-mflow="' + f + '" class="viz-m-flow"><span class="viz-key" data-shape="' + FLOW_SHAPE[f] + '"></span><span>' + esc(flowLabel(f)) + "</span></th>";
      }).join("") + "</tr>";
    var body = rows.map(function (n) {
      var cells = FLOWS.map(function (f) {
        var c = counts[n.id + "|" + f] || { out: 0, in: 0 };
        var has = c.out || c.in;
        var val = has ? '<span class="viz-m-out" title="' + esc(ct("ui.out", "Sorties", "流出")) + '">' + c.out + '</span><span class="viz-m-slash">/</span><span class="viz-m-in" title="' + esc(ct("ui.in", "Entrées", "流入")) + '">' + c.in + "</span>" : '<span class="viz-m-zero">·</span>';
        return '<td data-mcell="' + n.id + "|" + f + '" data-mnode="' + n.id + '" data-mflow="' + f + '" class="' + (has ? "" : "is-empty") + '">' + val + "</td>";
      }).join("");
      return '<tr><th scope="row" data-mnode="' + n.id + '" tabindex="0" role="button" class="viz-m-rowhead"><span class="viz-m-kind">' + esc(n.kindLabel) + "</span>" + esc(n.name) + "</th>" + cells + "</tr>";
    }).join("");
    host.innerHTML = '<table class="viz-matrix-table"><caption>' +
      esc(ct("flux.matrixHint", "Relations sortantes / entrantes par flux. Cliquez un flux pour filtrer, un nœud pour isoler.",
        "按流分类的流出 / 流入关系数。点流筛选，点节点聚焦。")) +
      "</caption><thead>" + head + "</thead><tbody>" + body + "</tbody></table>" +
      '<p class="viz-matrix-legend">' + esc(L("Cellules : sortants / entrants. Les lignes sont aussi des boutons d'isolement.",
        "单元格：流出 / 流入。点击行标题可聚焦该节点。")) + "</p>";
  }

  /* ------------------------------------------------------------------ */
  /* Carte Afrique de l'Ouest                                            */
  /* ------------------------------------------------------------------ */
  var MAP_SHAPES = {
    "r.nouakchott": "M138 82 L330 66 L430 118 L432 188 L372 214 L300 230 L226 224 L168 190 L142 138 Z",
    "r.senegal": "M191 240 L246 236 L252 258 L238 280 L203 284 L188 264 Z",
    "r.gambie": "M194 292 L236 288 L238 298 L198 304 Z",
    "r.mali": "M338 146 L470 138 L506 214 L480 292 L404 304 L348 274 L322 210 Z",
    "r.guinee": "M252 356 L332 344 L358 380 L342 424 L282 436 L244 398 Z",
    "r.cote-ivoire": "M454 346 L540 336 L568 396 L548 452 L482 462 L450 414 Z"
  };
  var MAP_CENTERS = {
    "r.senegal": { x: 215, y: 265, ctrl: [204, 208], label: "below" },
    "r.gambie": { x: 200, y: 300, ctrl: [196, 234], label: "below" },
    "r.mali": { x: 420, y: 240, ctrl: [330, 172], label: "above" },
    "r.guinee": { x: 305, y: 400, ctrl: [292, 302], label: "below" },
    "r.cote-ivoire": { x: 520, y: 395, ctrl: [432, 252], label: "below" }
  };

  function renderMap() {
    var host = $("#map-canvas");
    if (!host) return;
    var d = D();
    if (!d || !d.regions) {
      host.innerHTML = emptyBox();
      return;
    }
    var regById = {};
    d.regions.forEach(function (r) { regById[r.id] = r; });
    var hub = { x: 250, y: 180 };
    var china = { x: 566, y: 62 };
    var W = 640, H = 520;

    var shapes = "";
    Object.keys(MAP_SHAPES).forEach(function (rid) {
      shapes += '<path class="viz-map-shape" data-region="' + rid + '" d="' + MAP_SHAPES[rid] + '"/>';
    });
    var coast = '<path class="viz-map-coast" d="M118 196 C146 248 156 298 190 342 C224 386 268 432 336 462 C428 496 546 490 626 474"/>';

    var routeData = [];
    var routesHTML = "";
    Object.keys(MAP_CENTERS).forEach(function (rid) {
      var c = MAP_CENTERS[rid];
      var reg = regById[rid];
      if (!reg) return;
      var kinds = reg.flowKinds || ["marchandises"];
      kinds.forEach(function (f, ki) {
        var off = (ki - (kinds.length - 1) / 2) * 12;
        var cx = c.ctrl[0] + off;
        var cy = c.ctrl[1] + off;
        var rd = "M" + hub.x + " " + hub.y + " Q" + cx + " " + cy + " " + c.x + " " + c.y;
        routeData.push({ region: rid, flow: f, d: rd });
        routesHTML += '<g class="viz-map-route" data-region="' + rid + '" data-flow="' + f + '">' +
          '<path class="viz-map-route-line" d="' + rd + '"/>' +
          '<path class="viz-map-route-hit" d="' + rd + '"/></g>';
      });
    });
    var chinaD = "M" + china.x + " " + china.y + " C480 58 366 96 250 180";
    routesHTML = '<g class="viz-map-route is-china" data-region="china" data-flow="marchandises"><path class="viz-map-route-line" d="' + chinaD + '"/><path class="viz-map-route-hit" d="' + chinaD + '"/></g>' + routesHTML;

    var particlesHTML = "";
    if (!still()) {
      var count = 0;
      for (var i = 0; i < routeData.length && count < 10; i++) {
        var r = routeData[i];
        count++;
        var dur = (5.4 + (i % 4) * 0.7).toFixed(2);
        var begin = (-(i * 0.9)).toFixed(2);
        particlesHTML += '<circle class="viz-map-particle" data-flow="' + r.flow + '" r="2.2"><animateMotion dur="' + dur + 's" begin="' + begin + 's" repeatCount="indefinite" path="' + r.d + '"/></circle>';
      }
    }

    var nodesHTML = "";
    Object.keys(MAP_CENTERS).forEach(function (rid) {
      var c = MAP_CENTERS[rid];
      var reg = regById[rid];
      if (!reg) return;
      var name = pick(reg, "name");
      var labelY = c.label === "above" ? c.y - 22 : c.y + 30;
      var tone = reg.mapTone === "gold" ? "gold" : "ivory";
      nodesHTML += '<g class="viz-map-node" data-region="' + rid + '" data-tone="' + tone + '" tabindex="0" role="button" aria-label="' + esc(name) + '">' +
        '<circle class="viz-map-hit" cx="' + c.x + '" cy="' + c.y + '" r="26"/>' +
        '<circle class="viz-map-dot" cx="' + c.x + '" cy="' + c.y + '" r="4.6"/>' +
        '<text class="viz-map-label" x="' + c.x + '" y="' + labelY + '" text-anchor="middle">' + esc(name) + "</text></g>";
    });

    var hubName = ct("hero.network.hub", "Nouakchott", "努瓦克肖特");
    var hubHTML = '<g class="viz-map-node is-hub" data-region="r.nouakchott" tabindex="0" role="button" aria-label="' + esc(hubName) + '">' +
      '<circle class="viz-map-hit" cx="' + hub.x + '" cy="' + hub.y + '" r="30"/>' +
      '<circle class="viz-map-ring" cx="' + hub.x + '" cy="' + hub.y + '" r="14"/>' +
      '<circle class="viz-map-ring is-outer" cx="' + hub.x + '" cy="' + hub.y + '" r="22"/>' +
      '<circle class="viz-map-dot is-hub" cx="' + hub.x + '" cy="' + hub.y + '" r="6"/>' +
      '<text class="viz-map-label is-hub" x="' + hub.x + '" y="' + (hub.y - 30) + '" text-anchor="middle">' + esc(hubName) + "</text></g>";

    var chinaName = ct("hero.network.china", "Chine", "中国");
    var chinaHTML = '<g class="viz-map-node is-china" data-region="china" tabindex="0" role="button" aria-label="' + esc(chinaName) + '">' +
      '<rect class="viz-map-china-box" x="' + (china.x - 44) + '" y="' + (china.y - 18) + '" width="88" height="34" rx="17"/>' +
      '<circle class="viz-map-dot" cx="' + (china.x - 30) + '" cy="' + china.y + '" r="4"/>' +
      '<text class="viz-map-label" x="' + (china.x + 6) + '" y="' + (china.y + 4) + '">' + esc(chinaName) + "</text></g>";

    var goods = kpiById("kpi.wa_goods_transit");
    var goodsTxt = goods ? kpiDisplay(goods, curLang()) : "";
    var globalHTML = '<g class="viz-map-global">' +
      '<text class="viz-map-global-value" x="12" y="' + (H - 22) + '">' + esc(goodsTxt) + "</text>" +
      '<text class="viz-map-global-label" x="12" y="' + (H - 8) + '">' + esc(L("de biens transitant par la Mauritanie / an — source dossier RIMU", "货物经毛里塔尼亚中转 / 年——来源：RIMU 资料")) + "</text>" +
      "</g>";
    var noteHTML = '<text class="viz-map-note" x="' + (W - 8) + '" y="' + (H - 8) + '" text-anchor="end">' + esc(L("Schéma indicatif — non à l'échelle", "示意图——非比例")) + "</text>";

    var svg = '<svg class="viz-svg viz-map" viewBox="0 0 ' + W + " " + H + '" role="group" aria-label="' +
      esc(L("Carte schématique : Nouakchott et cinq destinations ouest-africaines", "西非节点-路线示意图：努瓦克肖特与五个目的地")) + '">' +
      '<g class="viz-map-shapes">' + shapes + coast + "</g>" +
      '<g class="viz-map-routes">' + routesHTML + "</g>" +
      '<g class="viz-map-particles" aria-hidden="true">' + particlesHTML + "</g>" +
      '<g class="viz-map-nodes">' + nodesHTML + hubHTML + chinaHTML + "</g>" +
      globalHTML + noteHTML + "</svg>";
    host.innerHTML = svg;
    var svgEl = host.querySelector("svg");
    refs.map = { svg: svgEl, host: host, data: regById, hub: hub };
    bindMapEvents(svgEl);
  }

  function mapRegionInfo(id) {
    if (id === "china") {
      return {
        name: ct("hero.network.china", "Chine", "中国"),
        copy: L("Entrée abstraite des marchandises et des financements chinois vers Nouakchott.", "中国货物与资金进入努瓦克肖特的抽象入口。"),
        flows: ["marchandises"],
        isHub: false,
        isChina: true,
        entity: "b.commerce-gros"
      };
    }
    var d = D();
    var reg = null;
    if (refs.map && refs.map.data[id]) reg = refs.map.data[id];
    else if (d && d.regions) {
      for (var i = 0; i < d.regions.length; i++) if (d.regions[i].id === id) { reg = d.regions[i]; break; }
    }
    if (!reg) return null;
    var entity = "b.biens-conso";
    if (id === "r.nouakchott") entity = "b.biens-conso";
    if ((reg.flowKinds || []).indexOf("paiements") >= 0) entity = "b.finance-rimp";
    return {
      name: pick(reg, "name"),
      copy: pick(reg, "copy"),
      flows: reg.flowKinds || [],
      isHub: reg.role === "hub",
      isChina: false,
      entity: entity
    };
  }

  function bindMapEvents(svgEl) {
    var current = "";
    function regionOf(ev) {
      var g = upTo(ev.target, "[data-region]");
      return g ? g.getAttribute("data-region") : null;
    }
    function tipHTML(id) {
      var info = mapRegionInfo(id);
      if (!info) return "";
      var rows = [[L("Type", "类型"), info.isChina ? L("Entrée externe", "外部入口") : info.isHub ? L("Hub", "枢纽") : L("Destination", "目的地")]];
      if (info.flows.length) rows.push([L("Flux", "流"), info.flows.map(flowLabel).join(" · ")]);
      if (info.copy) rows.push([L("Note", "说明"), info.copy]);
      return '<p class="viz-tip-head">' + esc(info.name) + "</p>" + tipRows(rows) +
        '<p class="viz-tip-hint">' + esc(L("Cliquez pour ouvrir la filière liée", "点击打开相关业务")) + "</p>";
    }
    function enter(ev) {
      var id = regionOf(ev);
      if (!id || id === current) return;
      current = id;
      setMapHover(id);
      tipShow(tipHTML(id), ev.clientX, ev.clientY);
    }
    svgEl.addEventListener("pointerover", enter);
    svgEl.addEventListener("pointermove", function (ev) {
      if (!current) return;
      tipShow(tipHTML(current), ev.clientX, ev.clientY);
    });
    svgEl.addEventListener("pointerout", function (ev) {
      var to = ev.relatedTarget;
      if (to && svgEl.contains(to)) return;
      current = "";
      setMapHover("");
      tipHide();
    });
    svgEl.addEventListener("click", function (ev) {
      var id = regionOf(ev);
      if (!id) return;
      var info = mapRegionInfo(id);
      if (info && info.entity) openFlowEntity({ entity: info.entity });
    });
    svgEl.addEventListener("focusin", function (ev) {
      var g = upTo(ev.target, "[data-region]");
      if (!g) return;
      var id = g.getAttribute("data-region");
      setMapHover(id);
      var rect = g.getBoundingClientRect();
      tipShow(tipHTML(id), rect.left + rect.width / 2, rect.top);
    });
    svgEl.addEventListener("focusout", function () {
      setMapHover("");
      tipHide();
    });
    svgEl.addEventListener("keydown", function (ev) {
      var g = upTo(ev.target, "[data-region]");
      if (!g) return;
      if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
        ev.preventDefault();
        var info = mapRegionInfo(g.getAttribute("data-region"));
        if (info && info.entity) openFlowEntity({ entity: info.entity });
      }
    });
  }

  function setMapHover(id) {
    var map = refs.map;
    if (!map || !map.svg) return;
    var svg = map.svg;
    $$("[data-region]", svg).forEach(function (el) {
      if (id && el.getAttribute("data-region") === id) el.classList.add("is-linked");
      else el.classList.remove("is-linked");
    });
    if (id) svg.setAttribute("data-hover", "1");
    else svg.removeAttribute("data-hover");
  }

  /* ------------------------------------------------------------------ */
  /* Canvas Hero : réseau Chine / Mauritanie → Nouakchott → Afrique      */
  /* ------------------------------------------------------------------ */
  function initHeroCanvas() {
    var cv = $("#hero-canvas");
    if (!cv) return;
    var host = cv.parentElement || cv.parentNode;
    if (!host) return;
    if (refs.heroRaf) {
      cancelAnimationFrame(refs.heroRaf);
      refs.heroRaf = 0;
    }
    var hero = refs.hero = { cv: cv, host: host, ctx: null, w: 0, h: 0, dpr: 1, scene: null, t: 0, visible: true };
    function size() {
      var r = host.getBoundingClientRect();
      var w = Math.max(300, Math.round(r.width || cv.clientWidth || 900));
      var h = Math.max(280, Math.round(r.height || cv.clientHeight || 600));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      hero.w = w;
      hero.h = h;
      hero.dpr = dpr;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      var ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hero.ctx = ctx;
    }
    size();
    hero.scene = buildHeroScene(hero.w, hero.h);
    if (still()) {
      drawHero(0.35);
      return;
    }
    if (refs.heroIO) {
      try { refs.heroIO.disconnect(); } catch (e) {}
      refs.heroIO = null;
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries || !entries.length) return;
        hero.visible = !!entries[0].isIntersecting;
        if (hero.visible) startHero();
        else if (refs.heroRaf) {
          cancelAnimationFrame(refs.heroRaf);
          refs.heroRaf = 0;
        }
      }, { threshold: 0.02 });
      refs.heroIO = io;
      io.observe(cv);
    }
    startHero();
  }

  function heroRand(seed) {
    var x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  function heroBezier(r, p) {
    var mt = 1 - p;
    var x = mt * mt * mt * r.a.x + 3 * mt * mt * p * r.c1x + 3 * mt * p * p * r.c2x + p * p * p * r.b.x;
    var y = mt * mt * mt * r.a.y + 3 * mt * mt * p * r.c1y + 3 * mt * p * p * r.c2y + p * p * p * r.b.y;
    return { x: x, y: y };
  }

  function heroParticlePos(part, t) {
    return { x: part.hx + Math.cos(part.ph + t * part.sp * 6.2) * part.ax, y: part.hy + Math.sin(part.ph + t * part.sp * 5.1) * part.ay };
  }

  function buildHeroScene(w, h) {
    var scene = { clusters: [], routes: [], nodes: [], w: w, h: h };
    var hub = { x: w * 0.702, y: h * 0.62 };
    var china = { x: w * 0.856, y: h * 0.295 };
    var maur = { x: w * 0.652, y: h * 0.455 };
    var wa = [
      { x: w * 0.795, y: h * 0.735 },
      { x: w * 0.862, y: h * 0.815 },
      { x: w * 0.908, y: h * 0.700 },
      { x: w * 0.936, y: h * 0.800 },
      { x: w * 0.878, y: h * 0.905 }
    ];
    scene.nodes = [{ x: hub.x, y: hub.y, type: "hub" }, { x: china.x, y: china.y, type: "china" }, { x: maur.x, y: maur.y, type: "maur" }]
      .concat(wa.map(function (p) { return { x: p.x, y: p.y, type: "wa" }; }));
    function cluster(cx, cy, rx, ry, n, tone, seed0) {
      var list = [];
      for (var i = 0; i < n; i++) {
        var a = heroRand(seed0 + i * 3.7) * Math.PI * 2;
        var rad = Math.sqrt(heroRand(seed0 + i * 7.1));
        list.push({
          hx: cx + Math.cos(a) * rx * rad,
          hy: cy + Math.sin(a) * ry * rad,
          ax: rx * (0.18 + heroRand(seed0 + i * 1.3) * 0.22),
          ay: ry * (0.18 + heroRand(seed0 + i * 2.9) * 0.22),
          ph: heroRand(seed0 + i * 5.3) * Math.PI * 2,
          sp: 0.12 + heroRand(seed0 + i * 9.1) * 0.22,
          r: 0.8 + heroRand(seed0 + i * 4.7) * 1.2,
          tone: tone
        });
      }
      scene.clusters.push({ cx: cx, cy: cy, list: list, tone: tone });
    }
    cluster(china.x, china.y, w * 0.075, h * 0.105, 20, "gold", 11);
    cluster(maur.x, maur.y, w * 0.06, h * 0.085, 12, "ivory", 37);
    for (var i = 0; i < wa.length; i++) cluster(wa[i].x, wa[i].y, w * 0.022, h * 0.032, 3, "wa", 101 + i * 13);
    var ambient = [];
    for (var j = 0; j < 8; j++) {
      ambient.push({
        hx: w * (0.6 + heroRand(300 + j) * 0.38),
        hy: h * (0.16 + heroRand(400 + j) * 0.8),
        ax: w * 0.02,
        ay: h * 0.02,
        ph: heroRand(500 + j) * Math.PI * 2,
        sp: 0.05 + heroRand(600 + j) * 0.12,
        r: 0.7,
        tone: "ivory"
      });
    }
    scene.clusters.push({ cx: w * 0.8, cy: h * 0.55, list: ambient, tone: "ivory" });
    function route(a, b, lift, sp) {
      var mx = (a.x + b.x) / 2;
      var my = (a.y + b.y) / 2;
      var dx = b.x - a.x, dy = b.y - a.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / len, ny = dx / len;
      scene.routes.push({
        a: a,
        b: b,
        c1x: mx + nx * lift,
        c1y: my + ny * lift,
        c2x: mx + nx * lift * 0.55,
        c2y: my + ny * lift * 0.55,
        packetOff: (scene.routes.length * 0.27) % 1,
        packetSp: sp || 0.05
      });
    }
    route(china, hub, h * 0.10, 0.05);
    route(china, hub, h * 0.03, 0.042);
    route(maur, hub, h * 0.05, 0.06);
    route(maur, hub, h * 0.09, 0.055);
    for (var k = 0; k < wa.length; k++) route(hub, wa[k], h * (0.035 + (k % 3) * 0.02), 0.05);
    return scene;
  }

  function drawHero(t) {
    var hero = refs.hero;
    if (!hero || !hero.ctx) return;
    var ctx = hero.ctx;
    var scene = hero.scene;
    if (!scene) return;
    var w = hero.w;
    ctx.clearRect(0, 0, w, hero.h);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    var i;
    for (i = 0; i < scene.routes.length; i++) {
      var r = scene.routes[i];
      ctx.beginPath();
      ctx.moveTo(r.a.x, r.a.y);
      ctx.bezierCurveTo(r.c1x, r.c1y, r.c2x, r.c2y, r.b.x, r.b.y);
      ctx.strokeStyle = "rgba(201,162,94,0.13)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (var c = 0; c < scene.clusters.length; c++) {
      var cl = scene.clusters[c];
      var pts = [];
      for (var p = 0; p < cl.list.length; p++) pts.push(heroParticlePos(cl.list[p], t));
      var linkDist = cl.tone === "wa" ? 26 : 64;
      ctx.strokeStyle = cl.tone === "gold" ? "rgba(201,162,94,0.16)" : "rgba(246,240,228,0.08)";
      ctx.lineWidth = 0.7;
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var ddx = pts[a].x - pts[b].x;
          var ddy = pts[a].y - pts[b].y;
          if (ddx * ddx + ddy * ddy < linkDist * linkDist) {
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.stroke();
          }
        }
      }
      for (var q = 0; q < pts.length; q++) {
        var part = cl.list[q];
        var alpha = cl.tone === "gold" ? 0.55 : cl.tone === "wa" ? 0.5 : 0.42;
        ctx.beginPath();
        ctx.arc(pts[q].x, pts[q].y, part.r, 0, Math.PI * 2);
        ctx.fillStyle = cl.tone === "gold" ? "rgba(201,162,94," + alpha + ")" : "rgba(246,240,228," + alpha + ")";
        ctx.fill();
      }
    }
    for (i = 0; i < scene.routes.length; i++) {
      var rt = scene.routes[i];
      var pp = ((t * rt.packetSp + rt.packetOff) % 1 + 1) % 1;
      var pos = heroBezier(rt, pp);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201,162,94,0.85)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201,162,94,0.10)";
      ctx.fill();
    }
    for (i = 0; i < scene.nodes.length; i++) {
      var nd = scene.nodes[i];
      if (nd.type === "hub") {
        var grad = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, 46);
        grad.addColorStop(0, "rgba(201,162,94,0.30)");
        grad.addColorStop(1, "rgba(201,162,94,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 46, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,162,94,0.95)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201,162,94,0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (nd.type === "wa") {
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(246,240,228,0.72)";
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function startHero() {
    var hero = refs.hero;
    if (!hero || still()) return;
    if (refs.heroRaf) return;
    if (document.hidden || hero.visible === false) return;
    var last = 0;
    function frame(ts) {
      refs.heroRaf = 0;
      if (!refs.hero) return;
      if (document.hidden || refs.hero.visible === false) return;
      if (!last) last = ts;
      var dt = Math.min(64, ts - last);
      last = ts;
      refs.hero.t += dt / 1000;
      drawHero(refs.hero.t);
      refs.heroRaf = requestAnimationFrame(frame);
    }
    refs.heroRaf = requestAnimationFrame(frame);
  }

  function resizeHero() {
    var hero = refs.hero;
    if (!hero) return;
    var cv = hero.cv;
    var r = hero.host.getBoundingClientRect();
    var w = Math.max(300, Math.round(r.width || cv.clientWidth || 900));
    var h = Math.max(280, Math.round(r.height || cv.clientHeight || 600));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    hero.w = w;
    hero.h = h;
    hero.dpr = dpr;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    var ctx = cv.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hero.ctx = ctx;
    }
    hero.scene = buildHeroScene(w, h);
    if (still()) drawHero(0.35);
    else if (!refs.heroRaf) startHero();
  }

  /* ------------------------------------------------------------------ */
  /* Liaisons globales, langue, init                                     */
  /* ------------------------------------------------------------------ */
  var resizeTimer = 0;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeTimer = 0;
      guard(resizeHero);
    }, 160);
  }

  function onVisibility() {
    if (document.hidden) {
      if (refs.heroRaf) {
        cancelAnimationFrame(refs.heroRaf);
        refs.heroRaf = 0;
      }
      if (state.story && !state.paused) {
        state.paused = true;
        updateFlowControls();
      }
    } else {
      guard(startHero);
    }
  }

  function onKeydown(ev) {
    if (ev.key === "Escape") {
      var ae = document.activeElement;
      if (ae && (upTo(ae, "#flow-canvas") || upTo(ae, "#flow-controls") || upTo(ae, "#story-chips"))) {
        resetFlow();
      }
      return;
    }
    if (ev.key === "Enter") {
      var row = upTo(ev.target, "#flow-matrix [data-mnode]");
      if (row) {
        ev.preventDefault();
        setIsolate(row.getAttribute("data-mnode"));
      }
    }
  }

  function bindGlobal() {
    if (boundGlobal) return;
    boundGlobal = true;
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("load", function () {
      guard(function () {
        $$("[data-viz-counter='1']").forEach(function (el) {
          if (!el.__vizDone && inView(el)) runCounter(el, false);
        });
      });
    });
  }

  VIZ.init = function () {
    if (!document.body) return;
    if (document.readyState === "loading") {
      if (!VIZ.__waiting) {
        VIZ.__waiting = true;
        document.addEventListener("DOMContentLoaded", function () {
          VIZ.__waiting = false;
          VIZ.init();
        });
      }
      return;
    }
    document.documentElement.classList.add("viz-js");
    state.lang = curLang();
    bindGlobal();
    guard(initHeroCanvas);
    guard(scanCounters);
    guard(renderCharts);
    guard(renderFlowGraph);
    guard(renderMatrix);
    guard(renderMap);
    VIZ._inited = true;
  };

  VIZ.updateLang = function () {
    state.lang = curLang();
    guard(function () { scanCounters(true); });
    guard(updateCountersLang);
    guard(renderCharts);
    guard(renderFlowGraph);
    guard(renderMatrix);
    guard(renderMap);
    guard(syncAppLegend);
    applyChromeLang();
    guard(updateFlowControls);
    if (state.story) {
      var story = storyById(state.story);
      if (story) { setCaption(storyCaptionHTML(story, state.step, state.finished)); notifyStory(); }
    }
    tipHide();
  };

  VIZ.refresh = function () {
    state.lang = curLang();
    guard(function () { scanCounters(true); });
    guard(updateCountersLang);
    guard(renderCharts);
    guard(renderFlowGraph);
    guard(renderMatrix);
    guard(renderMap);
    guard(resizeHero);
  };

  VIZ.status = function () {
    var f = refs.flow;
    return {
      nodes: f ? f.nodes.length : 0,
      edges: f ? f.edges.length : 0,
      flows: FLOWS.length,
      flow: state.flow,
      isolate: state.isolate,
      story: state.story,
      step: state.step,
      chartMau: !!$("#chart-mau"),
      chartRevenue: !!$("#chart-revenue"),
      map: !!$("#map-canvas svg"),
      heroCanvas: !!$("#hero-canvas"),
      activeFlows: state.activeFlows,
      selected: state.selected,
      view: state.view,
      lang: curLang()
    };
  };

  /* API consommée par app.js (Lead). */
  VIZ.setFlowFilter = setFlowFilter;
  VIZ.resetFilters = resetFlow;
  VIZ.isolateSelection = isolateSelection;
  VIZ.focusNode = focusNode;
  VIZ.setView = setView;
  VIZ.playStory = playStory;
  VIZ.stopStory = stopStory;
  VIZ.pauseStory = togglePauseStory;
  VIZ.selectFlow = setFlow;
  VIZ.getState = function () {
    return { flow: state.flow, activeFlows: state.activeFlows, isolate: state.isolate, selected: state.selected, story: state.story, step: state.step, view: state.view };
  };

  /* Filet de sécurité si app.js n'appelle pas init(). */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (!VIZ._inited) guard(VIZ.init);
    });
  } else {
    setTimeout(function () {
      if (!VIZ._inited) guard(VIZ.init);
    }, 0);
  }
})();
