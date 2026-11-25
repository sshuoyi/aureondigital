/* ==========================================================================
   dossier.js — Dossier A4 paysage « Plateforme de coopération » (RIMU · RIMP · IA)
   Owner: print-builder. Renders the fixed 18-page dossier from window.RIMU_CONTENT
   (all FR/ZH copy) and window.RIMU_DATA (all figures, always via displayFR/displayZH).
   FR is the default language; add ?lang=zh for Chinese. URL: /dossier.html
   Dependencies: content.js, data.js (read-only), print.css, theme.css.
   No external font, image, CDN. QR code is generated inline (no library).
   ========================================================================== */
(function () {
  "use strict";

  var C = window.RIMU_CONTENT;
  var D = window.RIMU_DATA;
  var root = document.getElementById("dossier");
  if (!C || !D || !root) {
    if (root) root.innerHTML = '<p style="padding:40px;font:14px sans-serif">RIMU_CONTENT / RIMU_DATA introuvables.</p>';
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var isFR = params.get("lang") !== "zh";
  var LANG = isFR ? "fr" : "zh";
  document.documentElement.lang = LANG;
  var T = C[LANG];
  var TOTAL = 18;
  var SITE = "www.aureondigital.mr";
  var SITE_URL = "https://" + SITE;
  var FLOWS = ["capital", "marchandises", "paiements", "donnees", "attention"];
  var FLOW_COLOR = { capital: "#9C7A38", marchandises: "#A8895E", paiements: "#00794D", donnees: "#33627F", attention: "#9A5230" };
  var STORY_KPI = { capital: "kpi.investment_intentions", marchandises: "kpi.wa_goods_transit", attention: "kpi.mau_2031" };
  var FR_SHORT = {
    "p.plateforme": "Plateforme bilatérale",
    "p.rimu": "RIMU",
    "p.calcul": "Calcul IA",
    "b.projets": "Projets",
    "b.commerce-gros": "Commerce de gros",
    "b.biens-conso": "Biens de conso.",
    "b.finance-rimp": "Finance & RIMP",
    "b.formation": "Formation",
    "b.sante": "Santé"
  };
  var ZH_SHORT = {
    "p.plateforme": "双边平台",
    "p.rimu": "RIMU",
    "p.calcul": "AI 算力",
    "b.projets": "项目",
    "b.commerce-gros": "批发贸易",
    "b.biens-conso": "消费品",
    "b.finance-rimp": "金融 RIMP",
    "b.formation": "培训",
    "b.sante": "卫生"
  };

  /* ---------- generic helpers ---------- */

  function tx(o, base) { return o[base + (isFR ? "FR" : "ZH")]; }
  function kpi(id) { for (var i = 0; i < D.kpis.length; i++) { if (D.kpis[i].id === id) { return D.kpis[i]; } } return null; }
  function disp(k) { return k ? (isFR ? k.displayFR : k.displayZH) : ""; }
  function kname(k) { return k ? (isFR ? k.nameFR : k.nameZH) : ""; }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function f(n) { return String(Math.round(n * 100) / 100); }
  function typeKey(t) { return t === "Source" ? "source" : (t === "Dérivé" ? "derived" : "hypothesis"); }
  function typeLabel(t) { var l = D.meta.typeLegend[t]; return l ? (isFR ? l.labelFR : l.labelZH) : t; }
  function stageKey(b) { return b.stage === "pré-étude" ? "pre-etude" : b.stage; }
  function stageLabel(b) { return isFR ? b.stageLabelFR : b.stageLabelZH; }
  function shortName(id) { var m = isFR ? FR_SHORT : ZH_SHORT; return m[id] || id; }

  function esc(v) {
    return String(v == null ? "" : v)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;");
  }

  function el(name, attrs, inner) {
    var s = "<" + name;
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) { continue; }
        var v = attrs[k];
        if (v === null || v === undefined || v === false) { continue; }
        s += " " + k + '="' + esc(v) + '"';
      }
    }
    if (inner === null || inner === undefined) { return s + "/>"; }
    return s + ">" + inner + "</" + name + ">";
  }

  function pageHead(title, lead) {
    return el("div", { "class": "p-head-wrap" },
      el("div", { "class": "p-head" },
        el("h2", { "class": "p-title" }, title) +
        el("p", { "class": "p-lead" }, lead)) +
      el("div", { "class": "p-rule" }, ""));
  }

  function secHead(label, right) {
    return el("div", { "class": "p-sec-head" },
      el("span", { "class": "p-label" }, esc(label)) +
      el("span", { "class": "p-small" }, esc(right || ""))
    );
  }

  function kpiBlock(k, valClass, withType) {
    if (!k) { return ""; }
    var vc = "kpi-val" + (valClass ? " " + valClass : "");
    var html = el("div", { "class": "kpi" },
      el("div", { "class": vc }, esc(disp(k))) +
      el("div", { "class": "kpi-lab" }, esc(kname(k)))
    );
    if (withType) {
      html = el("div", { "class": "kpi" },
        el("div", { "class": vc }, esc(disp(k))) +
        el("div", { "class": "kpi-lab" }, esc(kname(k))) +
        el("div", { "class": "kpi-type" },
          '<span class="dot dot--' + typeKey(k.type) + '"></span>' + esc(typeLabel(k.type)))
      );
    }
    return html;
  }

  function chipStage(b) {
    return el("span", { "class": "chip chip--stage chip--" + stageKey(b) }, esc(stageLabel(b)));
  }

  function fmtAxis(v) {
    if (isFR) {
      if (v >= 1000000) { return String(Math.round(v / 100000) / 10).replace(".", ",") + " M"; }
      if (v >= 1000) { return String(Math.round(v / 100) / 10).replace(".", ",") + " k"; }
      return String(Math.round(v));
    }
    if (v >= 100000000) { return String(Math.round(v / 10000000) / 10) + " 亿"; }
    if (v >= 10000) { return String(Math.round(v / 1000) / 10) + " 万"; }
    return String(Math.round(v));
  }

  /* ---------- QR code (version 3, ECC M, byte mode, mask 0) ---------- */

  var QR = (function () {
    var SIZE = 29;
    var DATA_WORDS = 44;
    var EC_WORDS = 26;
    var GF_EXP = [];
    var GF_LOG = [];
    (function () {
      var x = 1;
      for (var i = 0; i < 255; i++) {
        GF_EXP[i] = x;
        GF_LOG[x] = i;
        x = x << 1;
        if (x & 0x100) { x = x ^ 0x11D; }
      }
      for (var j = 255; j < 512; j++) { GF_EXP[j] = GF_EXP[j - 255]; }
    })();
    function mul(a, b) { return (a === 0 || b === 0) ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]]; }
    function polyMul(a, b) {
      var out = new Array(a.length + b.length - 1);
      for (var i = 0; i < out.length; i++) { out[i] = 0; }
      for (var p = 0; p < a.length; p++) {
        for (var q = 0; q < b.length; q++) { out[p + q] ^= mul(a[p], b[q]); }
      }
      return out;
    }
    function generator(deg) {
      var poly = [1];
      for (var i = 0; i < deg; i++) { poly = polyMul(poly, [1, GF_EXP[i]]); }
      return poly;
    }
    function remainder(data, gen) {
      var res = data.slice();
      for (var z = 0; z < gen.length - 1; z++) { res.push(0); }
      for (var i = 0; i < data.length; i++) {
        var factor = res[i];
        if (factor !== 0) {
          for (var j = 0; j < gen.length; j++) { res[i + j] ^= mul(gen[j], factor); }
        }
      }
      return res.slice(data.length);
    }
    function make(text) {
      var bits = [];
      function push(val, len) {
        for (var i = len - 1; i >= 0; i--) { bits.push((val >> i) & 1); }
      }
      push(4, 4);
      push(text.length, 8);
      for (var c = 0; c < text.length; c++) { push(text.charCodeAt(c) & 0xFF, 8); }
      var cap = DATA_WORDS * 8;
      var term = Math.min(4, cap - bits.length);
      for (var tt = 0; tt < term; tt++) { bits.push(0); }
      while (bits.length % 8 !== 0) { bits.push(0); }
      var data = [];
      for (var bi = 0; bi < bits.length; bi += 8) {
        var b = 0;
        for (var bj = 0; bj < 8; bj++) { b = (b << 1) | bits[bi + bj]; }
        data.push(b);
      }
      var pads = [0xEC, 0x11];
      var pi = 0;
      while (data.length < DATA_WORDS) { data.push(pads[pi % 2]); pi++; }
      var ec = remainder(data, generator(EC_WORDS));
      var all = data.concat(ec);
      var stream = [];
      for (var w = 0; w < all.length; w++) {
        for (var wb = 7; wb >= 0; wb--) { stream.push((all[w] >> wb) & 1); }
      }

      var modules = [];
      var reserved = [];
      for (var r = 0; r < SIZE; r++) {
        modules.push(new Array(SIZE));
        reserved.push(new Array(SIZE));
        for (var c2 = 0; c2 < SIZE; c2++) { modules[r][c2] = false; reserved[r][c2] = false; }
      }
      function setFunc(x, y, v) {
        if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) { return; }
        modules[y][x] = !!v;
        reserved[y][x] = true;
      }
      function finder(cx, cy) {
        for (var dy = -1; dy <= 7; dy++) {
          for (var dx = -1; dx <= 7; dx++) {
            var d = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
            setFunc(cx + dx, cy + dy, d !== 4 && d !== 2);
          }
        }
      }
      finder(0, 0);
      finder(SIZE - 7, 0);
      finder(0, SIZE - 7);
      for (var t = 8; t < SIZE - 8; t++) {
        setFunc(t, 6, t % 2 === 0);
        setFunc(6, t, t % 2 === 0);
      }
      for (var ay = -2; ay <= 2; ay++) {
        for (var ax = -2; ax <= 2; ax++) {
          setFunc(22 + ax, 22 + ay, Math.max(Math.abs(ax), Math.abs(ay)) !== 1);
        }
      }
      var fmt = (function () {
        var bits15 = 0;
        var d = (0 << 10);
        for (var i = 14; i >= 10; i--) {
          if ((d >> i) & 1) { d ^= 0x537 << (i - 10); }
        }
        bits15 = d ^ 0x5412;
        return bits15;
      })();
      function bit(v, i) { return (v >> i) & 1; }
      for (var q = 0; q <= 5; q++) { setFunc(8, q, bit(fmt, q)); }
      setFunc(8, 7, bit(fmt, 6));
      setFunc(8, 8, bit(fmt, 7));
      setFunc(7, 8, bit(fmt, 8));
      for (var q2 = 9; q2 < 15; q2++) { setFunc(14 - q2, 8, bit(fmt, q2)); }
      for (var q3 = 0; q3 < 8; q3++) { setFunc(SIZE - 1 - q3, 8, bit(fmt, q3)); }
      for (var q4 = 8; q4 < 15; q4++) { setFunc(8, SIZE - 15 + q4, bit(fmt, q4)); }
      setFunc(8, SIZE - 8, true);

      var idx = 0;
      for (var right = SIZE - 1; right >= 1; right -= 2) {
        if (right === 6) { right = 5; }
        for (var vert = 0; vert < SIZE; vert++) {
          for (var jj = 0; jj < 2; jj++) {
            var xx = right - jj;
            var upward = ((right + 1) & 2) === 0;
            var yy = upward ? (SIZE - 1 - vert) : vert;
            if (!reserved[yy][xx] && idx < stream.length) {
              modules[yy][xx] = stream[idx] === 1;
              idx++;
            }
          }
        }
      }
      for (var my = 0; my < SIZE; my++) {
        for (var mx = 0; mx < SIZE; mx++) {
          if (!reserved[my][mx] && ((mx + my) % 2 === 0)) { modules[my][mx] = !modules[my][mx]; }
        }
      }
      var path = "";
      for (var py = 0; py < SIZE; py++) {
        var px = 0;
        while (px < SIZE) {
          if (modules[py][px]) {
            var len = 0;
            while (px + len < SIZE && modules[py][px + len]) { len++; }
            path += "M" + (px + 4) + " " + (py + 4) + "h" + len + "v1h-" + len + "z";
            px += len;
          } else {
            px++;
          }
        }
      }
      return { size: SIZE + 8, path: path };
    }
    return { make: make };
  })();

  var QR_CODE = QR.make(SITE_URL);

  function qrUse(cls) {
    return '<svg class="' + cls + '" viewBox="0 0 37 37" role="img" aria-hidden="true"><use href="#qr-code"/></svg>';
  }
  function qrDefs() {
    return '<svg width="0" height="0" aria-hidden="true" style="position:absolute;left:-9999px;top:0"><defs><g id="qr-code">' +
      '<rect width="37" height="37" fill="#FFFFFF"/>' +
      '<path fill="#071C36" d="' + QR_CODE.path + '"/>' +
      '</g></defs></svg>';
  }

  /* ---------- dossier-specific strings (content.js has no dossier chrome) ---------- */

  var X = isFR ? {
    brandline: "AUREON DIGITAL — PLATEFORME SINO-MAURITANIENNE",
    footDoc: "Plateforme sino-mauritanienne · Novembre 2026",
    footSrc: "Source / Méthode — projections 2031, scénario ambitieux",
    dossierLabel: "Dossier de présentation",
    dateLabel: "Novembre 2026",
    qrLabel: "Scannez pour ouvrir le site",
    sommaire: "Sommaire",
    sommaireLead: "Le constat, le système, six filières, la trajectoire, l'impact et la décision : dix-huit pages, un seul dossier.",
    chaptersLabel: "Neuf chapitres",
    fichesLabel: "Six fiches filières",
    howToRead: "Comment lire les chiffres",
    methodNote: "Méthode",
    fiche: "Fiche",
    filiere: "Filière",
    filieresTitle: "Six filières, un même canal",
    filieresDesc: "Projets, commerce de gros, biens de consommation, finance / RIMP, formation, santé : une fiche A4 par filière en fin de dossier.",
    seeFiche: "Fiche complète p. 12–17",
    ficheNote: "Chaque filière a sa page A4 : définition, sous-modules, acteurs, chiffres clés, cinq flux, feuille de route et risques.",
    definition: "Définition",
    submodules: "Sous-modules",
    actors: "Acteurs",
    keyFigures: "Chiffres clés",
    flows: "Cinq flux",
    roadmap: "Feuille de route",
    risks: "Risques",
    trust: "Trois garanties par défaut",
    target: "Cible 2031",
    totalRevenue: "Total 2031",
    fiveNumbers: "Cinq chiffres qui décident",
    matrixCols: ["Piliers ↔ Piliers", "Piliers ↔ Filières", "Filières ↔ Filières", "Filières ↔ Afrique de l'Ouest", "Piliers ↔ Afrique de l'Ouest"],
    flowCol: "Flux",
    graphGroups: ["Piliers", "Filières", "Afrique de l'Ouest"],
    minutesUnit: "min/jour",
    calendar: "Calendrier 2026–2031",
    phase: "Phase",
    approx: "≈",
    lanes: ["Trois étapes · 2026–2027", "Cinq ans · 2027–2031", "Trois phases · 2026–2031"],
    decisionKicker: "La décision · Synthèse exécutive",
    seeOnline: "Voir en ligne",
    sixMonths: "D'ici 6 mois",
    conditionsTitle: "Conditions de réussite",
    adminNote: "Cinq décisions à clarifier et cinq risques avec leurs garanties écrites.",
    chapterLabels: ["Le constat", "Le système", "Six filières", "RIMU", "IA & calcul", "Cinq flux", "Trajectoire", "Impact 2031", "Conditions de réussite"]
  } : {
    brandline: "AUREON DIGITAL — 中毛数字合作平台",
    footDoc: "中毛合作平台 · 2026 年 11 月",
    footSrc: "来源 / 方法 — 2031 预测，雄心情景",
    dossierLabel: "方案册",
    dateLabel: "2026 年 11 月",
    qrLabel: "扫码打开网站",
    sommaire: "目录",
    sommaireLead: "现状、系统、六条业务线、轨迹、影响与决策：十八页，一本方案册。",
    chaptersLabel: "九章",
    fichesLabel: "六张业务单页",
    howToRead: "如何阅读数字",
    methodNote: "方法",
    fiche: "业务单页",
    filiere: "业务线",
    filieresTitle: "六条业务线，同一通道",
    filieresDesc: "项目、批发、消费品、金融 / RIMP、培训、卫生：文末每条业务线一页 A4。",
    seeFiche: "完整单页见 12–17 页",
    ficheNote: "每条业务线一页 A4：定义、子模块、参与方、关键数字、五类流、路线图与风险。",
    definition: "定义",
    submodules: "子模块",
    actors: "参与方",
    keyFigures: "关键数字",
    flows: "五类流",
    roadmap: "路线图",
    risks: "风险",
    trust: "三项默认保障",
    target: "2031 目标",
    totalRevenue: "2031 年合计",
    fiveNumbers: "五个关键数字",
    matrixCols: ["支柱 ↔ 支柱", "支柱 ↔ 业务线", "业务线之间", "业务线 ↔ 西非", "支柱 ↔ 西非"],
    flowCol: "流",
    graphGroups: ["支柱", "业务线", "西非"],
    minutesUnit: "分钟/日",
    calendar: "时间表 2026–2031",
    phase: "期",
    approx: "约",
    lanes: ["三步 · 2026–2027", "五年 · 2027–2031", "三期 · 2026–2031"],
    decisionKicker: "决策 · 执行摘要",
    seeOnline: "在线查看",
    sixMonths: "6 个月内",
    conditionsTitle: "成功条件",
    adminNote: "五项待明确决定，五类风险及其书面保障。",
    chapterLabels: ["现状", "系统", "六条业务线", "RIMU", "AI 与算力", "五类流", "轨迹", "2031 影响", "成功条件"]
  };

  function chapterMetas() {
    var cp = T.chapters;
    return [
      { title: cp.pourquoi.title, desc: cp.pourquoi.lead, page: 3 },
      { title: cp.systeme.title, desc: cp.systeme.lead, page: 4 },
      { title: X.filieresTitle, desc: X.filieresDesc, page: 5 },
      { title: cp.rimu.title, desc: cp.rimu.lead, page: 6 },
      { title: cp.ia.title, desc: cp.ia.lead, page: 7 },
      { title: cp.flux.title, desc: cp.flux.lead, page: 8 },
      { title: cp.trajectoire.title, desc: cp.trajectoire.lead, page: 9 },
      { title: cp.impact.title, desc: cp.impact.lead, page: 10 },
      { title: X.conditionsTitle, desc: X.adminNote, page: 11 }
    ];
  }

  /* ---------- shared page chrome ---------- */

  function footer(num) {
    return el("div", { "class": "p-foot" },
      el("span", { "class": "f-doc" }, esc(X.footDoc)) +
      el("span", { "class": "f-src" }, esc(X.footSrc)) +
      el("span", { "class": "f-right" },
        el("span", { "class": "f-url" }, SITE) +
        qrUse("qr-mini") +
        el("span", { "class": "p-folio" }, pad2(num) + " / " + TOTAL)
      )
    );
  }

  function pageShell(num, dark, kicker, body, spread) {
    var cls = "sheet" + (dark ? " dark" : "") + (num === 1 ? " sheet--cover" : "") + (spread ? " sheet--spread" : "");
    var top = num === 1 ? "" : el("div", { "class": "p-top" },
      el("div", { "class": "p-kicker" }, esc(kicker)) +
      el("div", { "class": "p-brand" }, esc(X.brandline)));
    return el("section", { "class": cls, "data-page": num },
      top + el("div", { "class": "p-body" }, body) + footer(num));
  }

  function chapterKicker(idx) {
    return pad2(idx + 1) + " · " + X.chapterLabels[idx];
  }

  /* ---------- charts (inline SVG, mm units, data-driven) ---------- */

  function legendItem(color, text, dot) {
    var sw = dot
      ? '<span class="sw" style="background:' + color + ';border-radius:50%"></span>'
      : '<span class="sw" style="background:' + color + '"></span>';
    return el("span", { "class": "item" }, sw + esc(text));
  }

  function chartMau() {
    var mau = kpi("kpi.series.mau").series;
    var dau = kpi("kpi.series.dau").series;
    var W = 92, H = 46, L = 13, R = 3, T = 5, B = 9;
    var maxV = 0;
    for (var i = 0; i < mau.length; i++) { if (mau[i].value > maxV) { maxV = mau[i].value; } }
    var top = Math.ceil(maxV / 500000) * 500000;
    var PW = W - L - R;
    var PH = H - T - B;
    function px(i) { return L + PW * i / (mau.length - 1); }
    function py(v) { return T + PH * (1 - v / top); }
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + 'mm" height="' + H + 'mm" role="img">';
    for (var g = 0; g <= 5; g++) {
      var gv = top * g / 5;
      var gy = py(gv);
      svg += '<line x1="' + L + '" y1="' + f(gy) + '" x2="' + (W - R) + '" y2="' + f(gy) + '" stroke="#0B1F3A" stroke-opacity="0.10" stroke-width="0.12"/>';
      svg += '<text x="' + (L - 1.4) + '" y="' + f(gy + 0.9) + '" text-anchor="end" font-size="1.8" fill="#8C8478" font-family="Avenir Next, sans-serif">' + esc(fmtAxis(gv)) + '</text>';
    }
    for (var yr = 0; yr < mau.length; yr++) {
      svg += '<text x="' + f(px(yr)) + '" y="' + f(H - 2.4) + '" text-anchor="middle" font-size="1.8" fill="#8C8478" font-family="Avenir Next, sans-serif">' + mau[yr].year + '</text>';
    }
    function line(series, color) {
      var d = "";
      for (var s = 0; s < series.length; s++) {
        d += (s === 0 ? "M" : "L") + f(px(s)) + " " + f(py(series[s].value));
      }
      return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="0.55" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    function dots(series, color) {
      var s2 = "";
      for (var d2 = 0; d2 < series.length; d2++) {
        s2 += '<circle cx="' + f(px(d2)) + '" cy="' + f(py(series[d2].value)) + '" r="0.8" fill="#F6F0E4" stroke="' + color + '" stroke-width="0.32"/>';
      }
      return s2;
    }
    svg += line(dau, "#33627F") + line(mau, "#9C7A38") + dots(dau, "#33627F") + dots(mau, "#9C7A38");
    svg += "</svg>";
    return svg;
  }

  function chartMauLegend() {
    return el("div", { "class": "chart-legend" },
      legendItem("#9C7A38", "MAU · " + disp(kpi("kpi.mau_2031")), true) +
      legendItem("#33627F", "DAU · " + disp(kpi("kpi.dau_2031")), true)
    );
  }

  function chartRevenue() {
    var rimu = kpi("kpi.revenue_rimu_2031");
    var rimp = kpi("kpi.revenue_rimp_2031");
    var calc = kpi("kpi.revenue_compute_2031");
    var totalK = kpi("kpi.revenue_total_2031");
    function mid(k) { return (k.range[0] + k.range[1]) / 2; }
    var parts = [
      { v: mid(rimu), c: "#9C7A38" },
      { v: mid(rimp), c: "#00794D" },
      { v: mid(calc), c: "#33627F" }
    ];
    var sum = parts[0].v + parts[1].v + parts[2].v;
    var W = 92, H = 22;
    var x = 2, y = 5, h = 9, bw = W - 4;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + 'mm" height="' + H + 'mm" role="img">';
    var cx = x;
    for (var i = 0; i < parts.length; i++) {
      var w = bw * parts[i].v / sum;
      svg += '<rect x="' + f(cx) + '" y="' + y + '" width="' + f(w) + '" height="' + h + '" fill="' + parts[i].c + '"/>';
      if (w > 13) {
        svg += '<text x="' + f(cx + w / 2) + '" y="' + (y + h / 2 + 1) + '" text-anchor="middle" font-size="2.1" fill="#F6F0E4" font-family="Avenir Next, sans-serif">' + Math.round(parts[i].v / sum * 100) + ' %</text>';
      }
      cx += w;
    }
    svg += '<line x1="' + x + '" y1="' + (y + h + 2.2) + '" x2="' + (x + bw) + '" y2="' + (y + h + 2.2) + '" stroke="#0B1F3A" stroke-opacity="0.18" stroke-width="0.12"/>';
    svg += '<text x="' + (x + bw / 2) + '" y="' + (y + h + 5.4) + '" text-anchor="middle" font-size="1.9" fill="#5E6B7E" font-family="Avenir Next, sans-serif">' + esc(X.totalRevenue + " · " + disp(totalK)) + '</text>';
    svg += "</svg>";
    return svg;
  }

  function chartRevenueLegend() {
    return el("div", { "class": "chart-legend" },
      legendItem("#9C7A38", (isFR ? "RIMU" : "RIMU") + " · " + disp(kpi("kpi.revenue_rimu_2031"))) +
      legendItem("#00794D", "RIMP · " + disp(kpi("kpi.revenue_rimp_2031"))) +
      legendItem("#33627F", (isFR ? "Calcul IA" : "AI 算力") + " · " + disp(kpi("kpi.revenue_compute_2031")))
    );
  }

  /* ---------- five-flow graph + matrix (data.relations driven) ---------- */

  function flowNodes() {
    var nodes = {};
    function add(id, x, y, w, h, kind) { nodes[id] = { id: id, x: x, y: y, w: w, h: h, kind: kind }; }
    add("p.plateforme", 1, 9, 27, 9, "p");
    add("p.rimu", 1, 30, 27, 9, "p");
    add("p.calcul", 1, 51, 27, 9, "p");
    for (var i = 0; i < D.businessLines.length; i++) {
      add(D.businessLines[i].id, i % 2 === 0 ? 37 : 73, 8.2 + Math.floor(i / 2) * 21.6, 32, 9, "b");
    }
    for (var j = 0; j < D.regions.length; j++) {
      add(D.regions[j].id, 112, 5.6 + j * 11.6, 36, 8.2, "r");
    }
    return nodes;
  }

  function flowNodeLabel(id) {
    for (var i = 0; i < D.regions.length; i++) {
      if (D.regions[i].id === id) { return isFR ? D.regions[i].nameFR : D.regions[i].nameZH; }
    }
    return shortName(id);
  }

  function flowEdge(a, b) {
    var sx, sy, ex, ey;
    if (a.x + a.w <= b.x) {
      sx = a.x + a.w; sy = a.y + a.h / 2; ex = b.x; ey = b.y + b.h / 2;
    } else if (b.x + b.w <= a.x) {
      sx = a.x; sy = a.y + a.h / 2; ex = b.x + b.w; ey = b.y + b.h / 2;
    } else {
      sx = a.x + a.w / 2; sy = a.y + a.h; ex = b.x + b.w / 2; ey = b.y;
    }
    var dx = Math.max(5, Math.abs(ex - sx) * 0.45);
    var c1 = sx + (ex >= sx ? dx : -dx);
    var c2 = ex - (ex >= sx ? dx : -dx);
    return {
      d: "M" + f(sx) + " " + f(sy) + "C" + f(c1) + " " + f(sy) + " " + f(c2) + " " + f(ey) + " " + f(ex) + " " + f(ey),
      ex: ex, ey: ey
    };
  }

  function flowGraph() {
    var nodes = flowNodes();
    var ids = Object.keys(nodes);
    var W = 149, H = 74;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="149mm" height="74mm" role="img">';
    svg += '<text x="1" y="3.6" font-size="1.9" letter-spacing="0.1" fill="#9C7A38" font-family="Avenir Next, sans-serif">' + esc(X.graphGroups[0]) + '</text>';
    svg += '<text x="37" y="3.6" font-size="1.9" letter-spacing="0.1" fill="#9C7A38" font-family="Avenir Next, sans-serif">' + esc(X.graphGroups[1]) + '</text>';
    svg += '<text x="112" y="3.6" font-size="1.9" letter-spacing="0.1" fill="#9C7A38" font-family="Avenir Next, sans-serif">' + esc(X.graphGroups[2]) + '</text>';
    for (var r = 0; r < D.relations.length; r++) {
      var rel = D.relations[r];
      var a = nodes[rel.from];
      var b = nodes[rel.to];
      if (!a || !b) { continue; }
      var color = FLOW_COLOR[rel.flow];
      var e = flowEdge(a, b);
      svg += '<path d="' + e.d + '" fill="none" stroke="' + color + '" stroke-width="0.26" stroke-opacity="0.52"/>';
      svg += '<circle cx="' + f(e.ex) + '" cy="' + f(e.ey) + '" r="0.5" fill="' + color + '"/>';
    }
    for (var n = 0; n < ids.length; n++) {
      var node = nodes[ids[n]];
      var label = flowNodeLabel(node.id);
      var cx = node.x + node.w / 2;
      var ty = node.y + node.h / 2 + 0.72;
      if (node.kind === "p") {
        svg += '<rect x="' + node.x + '" y="' + node.y + '" width="' + node.w + '" height="' + node.h + '" rx="1.2" fill="#0B1F3A" stroke="#C9A25E" stroke-width="0.22"/>';
        svg += '<text x="' + f(cx) + '" y="' + f(ty) + '" text-anchor="middle" font-size="2.05" fill="#F6F0E4" font-family="Avenir Next, sans-serif">' + esc(label) + '</text>';
      } else if (node.kind === "b") {
        svg += '<rect x="' + node.x + '" y="' + node.y + '" width="' + node.w + '" height="' + node.h + '" rx="1" fill="#FBF6EC" stroke="rgba(11,31,58,0.35)" stroke-width="0.22"/>';
        svg += '<text x="' + f(cx) + '" y="' + f(ty) + '" text-anchor="middle" font-size="1.95" fill="#16273F" font-family="Avenir Next, sans-serif">' + esc(label) + '</text>';
      } else {
        svg += '<rect x="' + node.x + '" y="' + node.y + '" width="' + node.w + '" height="' + node.h + '" rx="4.1" fill="none" stroke="rgba(11,31,58,0.28)" stroke-width="0.22" stroke-dasharray="1 0.8"/>';
        svg += '<text x="' + f(cx) + '" y="' + f(ty) + '" text-anchor="middle" font-size="1.9" fill="#5E6B7E" font-family="Avenir Next, sans-serif">' + esc(label) + '</text>';
      }
    }
    svg += "</svg>";
    return svg;
  }

  function flowLegend() {
    return el("div", { "class": "flow-legend" },
      FLOWS.map(function (fl) {
        return '<span class="item"><span class="line" style="color:' + FLOW_COLOR[fl] + '"></span>' + esc(T.ui.flows[fl]) + '</span>';
      }).join("")
    );
  }

  function flowMatrix() {
    var KEYS = ["PP", "BP", "BB", "BR", "PR"];
    function grp(id) { return id.charAt(0) === "p" ? "P" : (id.charAt(0) === "b" ? "B" : "R"); }
    var counts = {};
    for (var i = 0; i < FLOWS.length; i++) { counts[FLOWS[i]] = [0, 0, 0, 0, 0]; }
    for (var r = 0; r < D.relations.length; r++) {
      var rel = D.relations[r];
      var g1 = grp(rel.from);
      var g2 = grp(rel.to);
      var pair = g1 < g2 ? g1 + g2 : g2 + g1;
      var idx = KEYS.indexOf(pair);
      if (idx >= 0 && counts[rel.flow]) { counts[rel.flow][idx]++; }
    }
    var head = "<thead><tr><th>" + esc(X.flowCol) + "</th>";
    for (var c = 0; c < X.matrixCols.length; c++) { head += "<th>" + esc(X.matrixCols[c]) + "</th>"; }
    head += "</tr></thead>";
    var rows = "";
    for (var f2 = 0; f2 < FLOWS.length; f2++) {
      var fl = FLOWS[f2];
      rows += "<tr><td class='p-flow-name'><span class='dot-mini' style='background:" + FLOW_COLOR[fl] + "'></span>" + esc(T.ui.flows[fl]) + "</td>";
      for (var n = 0; n < 5; n++) {
        var v = counts[fl][n];
        rows += "<td class='num" + (v ? "" : " zero") + "'>" + (v ? v : "—") + "</td>";
      }
      rows += "</tr>";
    }
    return "<table class='matrix'>" + head + "<tbody>" + rows + "</tbody></table>";
  }

  /* ---------- p01 cover ---------- */

  function pageCover() {
    var pillars = T.hero.pillars.map(function (p, i) {
      return el("div", { "class": "cv-pillar" },
        el("div", { "class": "n" }, pad2(i + 1)) +
        el("div", { "class": "t" }, esc(p.label)) +
        el("div", { "class": "s" }, esc(p.note)));
    }).join("");
    var kpis = T.hero.kpis.map(function (it) {
      return el("div", { "class": "kpi" },
        el("div", { "class": "kpi-val" }, esc(disp(kpi(it.id)))) +
        el("div", { "class": "kpi-lab" }, esc(it.label)));
    }).join("");
    var body =
      el("div", { "class": "cv-top" },
        '<img class="cv-logo" src="assets/img/logo-mark-reverse.svg" alt="AUREON DIGITAL">' +
        el("div", { "class": "cv-top-right" },
          el("div", { "class": "p-label" }, esc(X.dossierLabel)) +
          el("div", { "class": "p-small" }, esc(X.dateLabel)))) +
      el("div", { "class": "cv-main" },
        el("div", { "class": "cv-kicker" }, esc(T.hero.kicker)) +
        el("h1", { "class": "cv-h1" },
          "<span>" + esc(T.hero.title1) + '</span><span class="cv-h1-2">' + esc(T.hero.title2) + "</span>") +
        el("p", { "class": "cv-lead" }, esc(T.hero.lead)) +
        el("p", { "class": "cv-sub" }, esc(T.hero.subline)) +
        el("div", { "class": "cv-pillars" }, pillars) +
        el("div", { "class": "cv-kpis" }, kpis)) +
      el("div", { "class": "cv-version" }, esc(T.footer.version)) +
      el("div", { "class": "cv-qr" },
        el("div", { "class": "t" }, esc(X.qrLabel) + "<b>" + SITE + "</b>") +
        qrUse("qr-big"));
    return pageShell(1, true, "", body);
  }

  /* ---------- p02 sommaire ---------- */

  function pageSommaire() {
    var metas = chapterMetas();
    var rows = metas.map(function (m, i) {
      return el("div", { "class": "toc-row" },
        el("div", { "class": "toc-no" }, pad2(i + 1)) +
        el("div", null,
          el("div", { "class": "toc-t" }, esc(m.title)) +
          el("div", { "class": "toc-d" }, esc(m.desc))) +
        el("div", { "class": "toc-p" }, pad2(m.page)));
    }).join("");
    var fiches = D.businessLines.map(function (b, i) {
      return el("div", { "class": "toc-fiche" },
        el("div", { "class": "toc-no" }, String.fromCharCode(65 + i)) +
        el("div", { "class": "t" }, esc(tx(b, "name"))) +
        el("div", { "class": "p" }, pad2(12 + i)));
    }).join("");
    var legend = ["Source", "Dérivé", "Hypothèse"].map(function (t) {
      var l = D.meta.typeLegend[t];
      return el("div", { "class": "toc-legend-row" },
        el("span", { "class": "p-label" }, '<span class="dot dot--' + typeKey(t) + '"></span> ' + esc(isFR ? l.labelFR : l.labelZH)) +
        el("span", { "class": "p-small" }, esc(isFR ? l.descriptionFR : l.descriptionZH)));
    }).join("");
    var body = pageHead(esc(X.sommaire), esc(X.sommaireLead)) +
      el("div", { "class": "p-sec toc-layout" },
        el("div", { "class": "toc-chapters" },
          el("div", { "class": "p-label", "style": "margin-bottom:1.6mm" }, esc(X.chaptersLabel)) + rows) +
        el("div", { "class": "toc-aside" },
          el("div", { "class": "p-sec" }, secHead(X.fichesLabel) + fiches) +
          el("div", { "class": "p-sec" },
            secHead(X.howToRead) + legend +
            el("div", { "class": "toc-note p-small" }, esc(T.methodo.note))))
      );
    return pageShell(2, true, X.sommaire, body);
  }

  /* ---------- p03 Le constat ---------- */

  function pageConstat() {
    var cp = T.chapters.pourquoi;
    var cards = T.problems.map(function (p, i) {
      return el("article", { "class": "p-card problem-card" },
        el("div", { "class": "p-card-no" }, pad2(i + 1)) +
        el("h3", { "class": "p-card-title" }, esc(p.title)) +
        el("p", { "class": "p-card-body" }, esc(p.body)) +
        el("div", { "class": "p-card-change" }, "<b>&rarr;</b> " + esc(p.change)));
    }).join("");
    var rows = D.transformations.map(function (tr) {
      return el("div", { "class": "transfo-row" },
        el("div", { "class": "dim" }, esc(tx(tr, "dimension"))) +
        el("div", { "class": "before" }, esc(tx(tr, "before"))) +
        el("div", { "class": "arrow" }, "&rarr;") +
        el("div", { "class": "after" }, esc(tx(tr, "after"))));
    }).join("");
    var body = pageHead(esc(cp.title), esc(cp.lead)) +
      el("div", { "class": "p-sec" }, el("div", { "class": "g-4 problems" }, cards)) +
      el("div", { "class": "p-sec transfo" },
        el("div", { "class": "p-sec-head" },
          el("span", { "class": "p-label" }, esc(T.impact.transformationLabel))) +
        rows) +
      el("div", { "class": "p-callout" }, esc(cp.transition));
    return pageShell(3, false, chapterKicker(0), body, true);
  }

  /* ---------- p04 Le système ---------- */

  function pageSysteme() {
    var cp = T.chapters.systeme;
    var pillars = D.pillars.map(function (p) {
      return el("article", { "class": "p-card p-pillar-card" },
        el("div", { "class": "kicker" }, esc(tx(p, "kicker"))) +
        el("div", { "class": "name" }, esc(tx(p, "name"))) +
        el("div", { "class": "pillar-tag" }, esc(tx(p, "tagline"))) +
        el("ul", { "class": "pillar-bullets" }, (isFR ? p.bulletsFR : p.bulletsZH).slice(0, 2).map(function (bl) { return el("li", null, esc(bl)); }).join("")) +
        el("div", { "class": "pillar-kpis" },
          p.kpiIds.map(function (id) { var kk = kpi(id); return kpiBlock(kk, disp(kk).length > 12 ? "kpi-val--s" : "", false); }).join("")));
    }).join("");
    var filieres = D.businessLines.map(function (b, i) {
      return el("div", { "class": "filiere-mini" },
        el("div", { "class": "n" }, pad2(i + 1)) +
        el("div", { "class": "t" }, esc(tx(b, "name"))) +
        chipStage(b));
    }).join("");
    var layers = D.layers.map(function (l) {
      return el("div", { "class": "layer-cell" },
        el("div", { "class": "n" }, pad2(l.order)) +
        el("div", { "class": "t" }, esc(tx(l, "name"))) +
        el("div", { "class": "c" }, esc(tx(l, "composition"))) +
        el("div", { "class": "v" }, esc(tx(l, "value"))));
    }).join("");
    var body = pageHead(esc(cp.title), esc(cp.lead)) +
      el("div", { "class": "p-sec" }, secHead(cp.pillarsLabel) + el("div", { "class": "g-3" }, pillars)) +
      el("div", { "class": "p-sec" }, secHead(cp.businessesLabel, cp.hint) + el("div", { "class": "filieres-strip" }, filieres)) +
      el("div", { "class": "p-sec" }, secHead(cp.layersLabel) + el("div", { "class": "layers-stack" }, layers));
    return pageShell(4, false, chapterKicker(1), body, true);
  }

  /* ---------- p05 Six filières ---------- */

  function pageFilieres() {
    var cards = D.businessLines.map(function (b, i) {
      var tags = (isFR ? b.tags : b.tagsZH).slice(0, 4).map(function (tag) {
        return el("span", { "class": "chip" }, esc(tag));
      }).join("");
      var kpis = el("div", { "class": "filiere-kpis" }, b.kpiIds.map(function (id) {
        var k = kpi(id);
        return kpiBlock(k, disp(k).length > 12 ? "kpi-val--s" : "", false);
      }).join(""));
      return el("article", { "class": "p-card filiere-card" },
        el("div", { "class": "top" },
          el("span", { "class": "n" }, pad2(i + 1)) +
          el("span", { "class": "name" }, esc(tx(b, "name"))) +
          chipStage(b)) +
        el("p", { "class": "tagline" }, esc(tx(b, "tagline"))) +
        el("div", { "class": "tags" }, tags) +
        kpis);
    }).join("");
    var body = pageHead(esc(X.filieresTitle), esc(X.filieresDesc)) +
      el("div", { "class": "p-sec" }, el("div", { "class": "filieres-grid filieres-grid--2" }, cards)) +
      el("div", { "class": "fiche-note" },
        el("span", { "class": "p-small" }, esc(X.ficheNote)) +
        el("span", { "class": "p-label" }, esc(T.chapters.systeme.businessesLabel)));
    return pageShell(5, false, chapterKicker(2), body, true);
  }

  /* ---------- p06 RIMU ---------- */

  function pageRimu() {
    var cp = T.chapters.rimu;
    var rimuPillar = null;
    for (var i = 0; i < D.pillars.length; i++) { if (D.pillars[i].id === "p.rimu") { rimuPillar = D.pillars[i]; } }
    var kpiIds = rimuPillar ? rimuPillar.kpiIds : ["kpi.mau_2031", "kpi.dau_2031", "kpi.daily_minutes_2031"];
    var kpis = el("div", { "class": "rimu-kpis" }, kpiIds.map(function (id, n) {
      var k = kpi(id);
      var lab = n === 0 ? "MAU 2031" : (n === 1 ? "DAU 2031" : X.minutesUnit);
      return el("div", { "class": "kpi" },
        el("div", { "class": "kpi-val" }, esc(disp(k))) +
        el("div", { "class": "kpi-lab" }, esc(lab)));
    }).join(""));
    var modules = T.rimu.modules.map(function (m, n) {
      return el("div", { "class": "module-row" },
        el("div", { "class": "n" }, pad2(n + 1)) +
        el("div", null,
          el("div", { "class": "t" }, esc(m.title)) +
          el("div", { "class": "b" }, esc(m.body))));
    }).join("");
    var day = T.rimu.day.map(function (d) {
      return el("div", { "class": "day-row" },
        el("div", { "class": "h" }, esc(d.time)) +
        el("div", null,
          el("div", { "class": "t" }, esc(d.title)) +
          el("div", { "class": "b" }, esc(d.body))));
    }).join("");
    var trust = T.rimu.trust.map(function (t) {
      return el("div", { "class": "trust-card" },
        el("div", { "class": "t" }, esc(t.title)) +
        el("div", { "class": "b" }, esc(t.body)));
    }).join("");
    var rimuNums = ["kpi.rimu_tabs", "kpi.languages_content", "kpi.short_video_seconds", "kpi.default_bitrate"].map(function (id) {
      return kpiBlock(kpi(id), "", false);
    }).join("");
    var body = pageHead(esc(cp.title), esc(cp.lead)) + kpis +
      el("div", { "class": "p-kpi-strip" }, rimuNums) +
      el("div", { "class": "p-sec" },
        el("div", { "class": "rimu-layout" },
          el("div", { "class": "p-sec" }, secHead(T.rimu.modulesLabel) + el("div", { "class": "modules-grid" }, modules)) +
          el("div", { "class": "p-sec" }, secHead(T.rimu.dayLabel) + el("div", { "class": "day-list" }, day)))) +
      el("div", { "class": "p-sec" }, secHead(X.trust) + el("div", { "class": "trust-row" }, trust));
    return pageShell(6, false, chapterKicker(3), body, true);
  }

  /* ---------- p07 IA & calcul ---------- */

  function pageIa() {
    var cp = T.chapters.ia;
    var layers = D.layers.map(function (l) {
      return el("div", { "class": "p-layer-row" },
        el("div", { "class": "n" }, pad2(l.order)) +
        el("div", null,
          el("div", { "class": "t" }, esc(tx(l, "name"))) +
          el("div", { "class": "c" }, esc(tx(l, "composition"))) +
          el("div", { "class": "v" }, esc(tx(l, "value")))));
    }).join("");
    var groups = T.ia.groups.map(function (g) {
      return el("div", { "class": "ai-group" },
        el("div", { "class": "t" }, esc(g.title)) +
        el("ul", null, g.items.map(function (it) { return el("li", null, esc(it)); }).join("")));
    }).join("");
    var phases = T.ia.phases.map(function (p, n) {
      return el("div", { "class": "p-phase-card" },
        el("div", { "class": "n" }, pad2(n + 1)) +
        el("div", { "class": "t" }, esc(p.title)) +
        el("div", { "class": "v" }, esc(p.value)) +
        el("div", { "class": "b" }, esc(p.body)));
    }).join("");
    var computeNums = ["kpi.compute_phase1_cards", "kpi.compute_phase1_mw", "kpi.compute_phase1_duration_months", "kpi.compute_green_program_mw"].map(function (id) {
      return kpiBlock(kpi(id), "", false);
    }).join("");
    var body = pageHead(esc(cp.title), esc(cp.lead)) +
      el("div", { "class": "p-kpi-strip" }, computeNums) +
      el("div", { "class": "p-sec" },
        el("div", { "class": "ia-layout" },
          el("div", { "class": "p-sec" }, secHead(T.chapters.systeme.layersLabel) + el("div", { "class": "layer-stack" }, layers)) +
          el("div", { "class": "p-sec" }, secHead(T.ia.groupsLabel) + el("div", { "class": "ai-groups" }, groups)))) +
      el("div", { "class": "p-sec" }, secHead(T.ia.phasesLabel) + el("div", { "class": "p-phases" }, phases)) +
      el("div", { "class": "p-sovereignty" },
        el("div", { "class": "t" }, esc(T.ia.sovereignty.title)) +
        el("div", { "class": "b" }, esc(T.ia.sovereignty.body)));
    return pageShell(7, false, chapterKicker(4), body, true);
  }

  /* ---------- p08 Cinq flux ---------- */

  function pageFlux() {
    var cp = T.chapters.flux;
    var stories = T.flux.stories.map(function (st) {
      var k = kpi(STORY_KPI[st.id]);
      return el("div", { "class": "story" },
        el("div", { "class": "t" }, esc(st.title)) +
        el("div", { "class": "s" }, esc(st.subtitle)) +
        el("div", { "class": "out" },
          el("div", { "class": "kpi-val" }, esc(disp(k))) +
          el("div", { "class": "l" }, esc(st.outcome.label))));
    }).join("");
    var body = pageHead(esc(cp.title), esc(cp.lead)) +
      el("div", { "class": "p-sec" },
        el("div", { "class": "flux-layout" },
          el("div", null,
            el("div", { "class": "flow-graph" }, flowGraph()) +
            flowLegend()) +
          el("div", { "class": "p-sec" },
            secHead(T.flux.storyLabel) +
            el("div", { "class": "stories" }, stories)))) +
      el("div", { "class": "p-sec" },
        secHead(T.flux.legendLabel, T.flux.matrixHint) + flowMatrix());
    return pageShell(8, false, chapterKicker(5), body);
  }

  /* ---------- p09 Trajectoire ---------- */

  function msCell(p, v, t, d) {
    var inner = el("div", { "class": "p" }, esc(p));
    if (v) { inner += el("div", { "class": "v" }, esc(v)); }
    if (t) { inner += el("div", { "class": "t" }, esc(t)); }
    if (d) { inner += el("div", { "class": "d" }, esc(d)); }
    return el("div", { "class": "ms" }, inner);
  }

  function calcMeta(ms) {
    var bits = [];
    if (ms.durationMonths) { bits.push(X.approx + " " + ms.durationMonths + " " + (isFR ? "mois" : "个月")); }
    if (ms.cards) { bits.push(X.approx + " " + ms.cards + " " + (isFR ? "cartes" : "张卡")); }
    if (ms.powerMW) {
      bits.push(Array.isArray(ms.powerMW) ? ms.powerMW.join("–") + " MW" : ms.powerMW + " MW");
    }
    return bits.join(" · ");
  }

  function pageTrajectoire() {
    var cp = T.chapters.trajectoire;
    var years = [2026, 2027, 2028, 2029, 2030, 2031];
    var tracks = D.roadmap.tracks;
    var bilateral = tracks[0];
    var rimu = tracks[1];
    var calcul = tracks[2];
    var axis = el("div", { "class": "axis" },
      el("span", { "class": "p-label" }, esc(X.calendar)) +
      el("div", { "class": "axis-years" }, years.map(function (y) { return el("span", { "class": "axis-year" }, String(y)); }).join("")));
    var laneBilateral = el("div", { "class": "lane" },
      el("div", { "class": "lane-head" },
        el("div", { "class": "t" }, esc(tx(bilateral, "name"))) +
        el("div", { "class": "s" }, esc(X.lanes[0]))) +
      el("div", { "class": "lane-body" },
        el("div", { "class": "ms-row" }, bilateral.milestones.map(function (ms) {
          return msCell(ms.period, "", tx(ms, "title"), (isFR ? ms.deliverablesFR : ms.deliverablesZH)[0]);
        }).join(""))));
    var laneRimu = el("div", { "class": "lane" },
      el("div", { "class": "lane-head" },
        el("div", { "class": "t" }, esc(tx(rimu, "name"))) +
        el("div", { "class": "s" }, esc(X.lanes[1]))) +
      el("div", { "class": "lane-body" },
        el("div", { "class": "ms-row ms-row--5" }, rimu.milestones.map(function (ms) {
          return msCell(String(ms.year), fmtAxis(ms.mau), tx(ms, "title"), ms.minutes + " " + X.minutesUnit);
        }).join(""))));
    var laneCalcul = el("div", { "class": "lane" },
      el("div", { "class": "lane-head" },
        el("div", { "class": "t" }, esc(tx(calcul, "name"))) +
        el("div", { "class": "s" }, esc(X.lanes[2]))) +
      el("div", { "class": "lane-body" },
        el("div", { "class": "ms-row" }, calcul.milestones.map(function (ms) {
          return msCell(X.phase + " " + ms.phase, calcMeta(ms), tx(ms, "title"), tx(ms, "description"));
        }).join(""))));
    var body = pageHead(esc(cp.title), esc(cp.lead)) + axis + laneBilateral + laneRimu + laneCalcul +
      el("div", { "class": "roadmap-note" }, esc(isFR ? D.roadmap.noteFR : D.roadmap.noteZH));
    return pageShell(9, false, chapterKicker(6), body, true);
  }

  /* ---------- p10 Impact 2031 ---------- */

  function pageImpact() {
    var cp = T.chapters.impact;
    var ids = ["kpi.mau_2031", "kpi.revenue_total_2031", "kpi.wallets_2031", "kpi.jobs_5y", "kpi.payment_flow_2031", "kpi.wa_goods_transit"];
    var kpis = ids.map(function (id) {
      var k = kpi(id);
      return kpiBlock(k, disp(k).length > 11 ? "kpi-val--s" : "", false);
    }).join("");
    var winners = T.impact.tabs.map(function (tab) {
      return el("div", { "class": "winner" },
        el("div", { "class": "t" }, esc(tab.label)) +
        el("ul", null, tab.items.slice(0, 3).map(function (it) { return el("li", null, esc(it)); }).join("")));
    }).join("");
    var body = pageHead(esc(cp.title), esc(cp.lead)) +
      el("div", { "class": "p-impact-kpis" }, kpis) +
      el("div", { "class": "charts-row" },
        el("div", { "class": "chart-box" },
          el("div", { "class": "chart-title" }, esc(cp.chartMauTitle)) +
          chartMau() + chartMauLegend()) +
        el("div", { "class": "chart-box" },
          el("div", { "class": "chart-title" }, esc(cp.chartRevenueTitle)) +
          chartRevenue() + chartRevenueLegend())) +
      el("div", { "class": "p-sec" },
        secHead(cp.winLabel, cp.scenarioLabel) +
        el("div", { "class": "winners" }, winners));
    return pageShell(10, false, chapterKicker(7), body, true);
  }

  /* ---------- p11 Conditions de réussite ---------- */

  function pageConditions() {
    var dec = T.decision;
    var supports = D.stateSupports.map(function (s, i) {
      return el("div", { "class": "cond-row" },
        el("span", { "class": "n" }, pad2(i + 1)) +
        el("div", null,
          el("div", { "class": "t" }, esc(tx(s, "title"))) +
          el("div", { "class": "b" }, esc(tx(s, "ask"))) +
          el("div", { "class": "f" }, esc(X.sixMonths + " : " + tx(s, "firstSixMonths")))));
    }).join("");
    var risks = D.risks.map(function (r, i) {
      var guarantees = isFR ? r.guaranteesFR : r.guaranteesZH;
      return el("div", { "class": "cond-row" },
        el("span", { "class": "n" }, pad2(i + 1)) +
        el("div", null,
          el("div", { "class": "t" }, esc(tx(r, "title"))) +
          el("div", { "class": "risk" }, esc(tx(r, "risk"))) +
          el("div", { "class": "g" }, guarantees.slice(0, 2).map(function (gg) { return "&rarr; " + esc(gg); }).join("<br>"))));
    }).join("");
    var body = pageHead(esc(X.conditionsTitle), esc(dec.lead)) +
      el("div", { "class": "p-sec conditions-layout" },
        el("div", { "class": "p-sec" },
          secHead(dec.supportsLabel) + el("div", { "class": "cond-list" }, supports)) +
        el("div", { "class": "p-sec" },
          secHead(dec.risksLabel) + el("div", { "class": "cond-list" }, risks))) +
      el("div", { "class": "method-note" },
        el("span", { "class": "p-label" }, esc(X.methodNote)) +
        el("span", { "class": "p-small" }, esc(T.methodo.note)));
    return pageShell(11, false, chapterKicker(8), body);
  }

  /* ---------- business fiches (p12–p17) ---------- */

  function pillarName(id) {
    for (var i = 0; i < D.pillars.length; i++) { if (D.pillars[i].id === id) { return tx(D.pillars[i], "name"); } }
    return id;
  }

  function ficheRoadmap(b) {
    var bilateral = D.roadmap.tracks[0];
    var ms1 = bilateral.milestones[0];
    var ms2 = bilateral.milestones[2];
    var k = kpi(b.kpiIds[0]);
    var kYear = /^[0-9]{4}$/.test(String(k.year)) ? String(k.year) : (isFR ? "Cible" : "目标");
    return el("div", { "class": "fiche-roadmap" },
      msCell(ms1.period, "", tx(ms1, "title"), (isFR ? ms1.deliverablesFR : ms1.deliverablesZH)[0]) +
      msCell(ms2.period, "", tx(ms2, "title"), (isFR ? ms2.deliverablesFR : ms2.deliverablesZH)[0]) +
      msCell(kYear, disp(k), "", kname(k)));
  }

  function ficheFlows(b) {
    var rows = FLOWS.map(function (fl) {
      var color = "var(--flow-" + fl + ")";
      var pin = b.flowIn[fl];
      var pout = b.flowOut[fl];
      return el("div", { "class": "flow-tbl-row" },
        '<div class="p-flow-name" style="color:' + color + '"><span class="bar"></span>' + esc(T.ui.flows[fl]) + '</div>' +
        el("div", { "class": "flow-cell" }, esc(isFR ? pin.textFR : pin.textZH)) +
        el("div", { "class": "flow-cell" }, esc(isFR ? pout.textFR : pout.textZH)));
    }).join("");
    return el("div", { "class": "flow-tbl" },
      el("div", { "class": "flow-tbl-head" },
        "<span></span>" +
        el("span", null, esc(T.ui.in)) +
        el("span", null, esc(T.ui.out))) + rows);
  }

  function ficheRisks(b) {
    return el("div", { "class": "fiche-risks" }, b.risks.map(function (r) {
      return el("div", { "class": "risk-item" },
        el("div", { "class": "r" }, esc(isFR ? r.riskFR : r.riskZH)) +
        el("div", { "class": "m" }, "<b>&rarr;</b> " + esc(isFR ? r.mitigationFR : r.mitigationZH)));
    }).join(""));
  }

  function pageFiche(num, b, idx) {
    var letter = String.fromCharCode(65 + idx);
    var kicker = X.fiche + " " + letter + " · " + X.filiere + " " + pad2(idx + 1);
    var actors = (isFR ? b.actorsFR : b.actorsZH).map(function (a) { return esc(a); }).join('<span class="sep">·</span>');
    var head = el("div", { "class": "fiche-head" },
      el("div", null,
        el("h2", { "class": "p-title" }, esc(tx(b, "name"))) +
        el("p", { "class": "p-lead" }, esc(tx(b, "tagline")))) +
      el("div", { "class": "fiche-badges" },
        chipStage(b) +
        el("div", { "class": "p-micro" }, esc(b.pillarIds.map(pillarName).join(" · "))))) +
      el("div", { "class": "p-rule" }, "");
    var left = el("div", { "class": "fiche-col" },
      el("div", { "class": "p-sec" },
        secHead(X.definition) +
        el("p", { "class": "fiche-def" }, esc(tx(b, "definition")))) +
      el("div", { "class": "p-sec" },
        secHead(X.submodules) +
        el("div", { "class": "submods" }, b.subModules.map(function (m) {
          return el("div", { "class": "submod" },
            el("span", { "class": "t" }, esc(tx(m, "name"))) +
            el("span", { "class": "d" }, esc(tx(m, "desc"))));
        }).join(""))) +
      el("div", { "class": "p-sec" },
        secHead(X.actors) +
        el("p", { "class": "actors-line" }, actors)));
    var right = el("div", { "class": "fiche-col" },
      el("div", { "class": "p-sec" },
        secHead(X.keyFigures) +
        el("div", { "class": "fiche-kpis" }, b.kpiIds.map(function (id) { return kpiBlock(kpi(id), "", true); }).join(""))) +
      el("div", { "class": "p-sec" },
        secHead(X.flows) +
        ficheFlows(b)));
    var bottom = el("div", { "class": "fiche-bottom" },
      el("div", null, secHead(X.roadmap) + ficheRoadmap(b)) +
      el("div", null, secHead(X.risks) + ficheRisks(b)));
    var deeplink = el("div", { "class": "fiche-deeplink" },
      el("span", { "class": "url" }, "www.aureondigital.mr/#/business/" + b.id) +
      '<a class="p-micro" href="index.html#/business/' + esc(b.id) + '">' + esc(X.seeOnline) + " &rarr;</a>");
    var body = head + el("div", { "class": "fiche-grid" }, left + right) + bottom + deeplink;
    return pageShell(num, false, kicker, body);
  }

  /* ---------- p18 decision summary ---------- */

  function pageDecision() {
    var cp = T.chapters.decision;
    var dec = T.decision;
    var pillars = T.hero.pillars.map(function (p, i) {
      return el("div", { "class": "dec-pillar" },
        el("div", { "class": "n" }, pad2(i + 1)) +
        el("div", null,
          el("div", { "class": "t" }, esc(p.label)) +
          el("div", { "class": "s" }, esc(p.note))));
    }).join("");
    var ids = ["kpi.investment_intentions", "kpi.wa_goods_transit", "kpi.mau_2031", "kpi.revenue_total_2031", "kpi.jobs_5y"];
    var nums = ids.map(function (id) {
      var k = kpi(id);
      return kpiBlock(k, disp(k).length > 12 ? "kpi-val--s" : "", false);
    }).join("");
    var asks = D.stateSupports.map(function (s, i) {
      return el("div", { "class": "dec-ask" },
        el("div", { "class": "n" }, pad2(i + 1)) +
        el("div", { "class": "t" }, esc(tx(s, "title"))) +
        el("div", { "class": "b" }, esc(tx(s, "ask"))));
    }).join("");
    var next = T.decision.next;
    var box = function (item) {
      return el("div", { "class": "period" },
        el("div", { "class": "t" }, esc(item.period)) +
        el("ul", null, item.items.map(function (it) { return el("li", null, esc(it)); }).join("")));
    };
    var nextHtml = el("div", { "class": "dec-next" },
      el("div", { "class": "head" }, el("div", { "class": "p-label" }, esc(dec.nextLabel))) +
      box(next[0]) + box(next[1]) +
      el("div", { "class": "dec-contact" },
        el("div", { "class": "t" }, esc(dec.contact.title)) +
        el("div", { "class": "b" }, esc(dec.contact.body))));
    var ctas = dec.ctas.map(function (c) {
      return el("div", { "class": "dec-cta" },
        el("div", { "class": "k" }, esc(c.kicker)) +
        el("div", { "class": "t" }, esc(c.title)) +
        el("div", { "class": "b" }, esc(c.body)));
    }).join("");
    var body = pageHead(esc(cp.title), esc(cp.lead)) +
      el("div", { "class": "dec-pillars" }, pillars) +
      el("div", { "class": "p-label", "style": "margin-top:3.2mm" }, esc(X.fiveNumbers)) +
      el("div", { "class": "dec-numbers" }, nums) +
      el("div", { "class": "p-label", "style": "margin-top:3.4mm" }, esc(dec.supportsLabel)) +
      el("div", { "class": "dec-asks" }, asks) +
      nextHtml +
      el("div", { "class": "p-label", "style": "margin-top:3.2mm" }, esc(dec.ctaLabel)) +
      el("div", { "class": "dec-ctas" }, ctas) +
      el("div", { "class": "dec-disclaimer" }, esc(dec.disclaimer));
    return pageShell(18, false, X.decisionKicker, body, true);
  }

  /* ---------- render ---------- */

  var pages = [
    pageCover(), pageSommaire(), pageConstat(), pageSysteme(), pageFilieres(),
    pageRimu(), pageIa(), pageFlux(), pageTrajectoire(), pageImpact(), pageConditions()
  ];
  for (var fi = 0; fi < D.businessLines.length; fi++) {
    pages.push(pageFiche(12 + fi, D.businessLines[fi], fi));
  }
  pages.push(pageDecision());
  root.innerHTML = qrDefs() + pages.join("");

  /* toolbar */
  var links = document.querySelectorAll("[data-lang-link]");
  for (var li = 0; li < links.length; li++) {
    links[li].setAttribute("href", "?lang=" + links[li].getAttribute("data-lang-link"));
    if (links[li].getAttribute("data-lang-link") === LANG) {
      links[li].setAttribute("aria-current", "true");
    }
  }
  var printBtn = document.getElementById("print-btn");
  if (printBtn) {
    printBtn.textContent = isFR ? "Imprimer / PDF" : "打印 / PDF";
    printBtn.addEventListener("click", function () { window.print(); });
  }
  var sub = document.querySelector(".tb-sub");
  if (sub) { sub.textContent = isFR ? "Dossier · Plateforme de coopération — RIMU · RIMP · IA" : "方案册 · 中毛合作平台 — RIMU · RIMP · IA"; }
  var hint = document.querySelector(".tb-hint");
  if (hint) { hint.textContent = isFR ? "A4 paysage · 18 pages · FR / 中文" : "A4 横向 · 18 页 · FR / 中文"; }
  document.title = (isFR ? "Dossier de présentation" : "方案册") + " — " + T.brand.name + " · " + T.brand.sub;

  /* overflow self-check (build-time gate + visible console note) */
  window.setTimeout(function () {
    var bad = [];
    var sheets = root.querySelectorAll(".sheet");
    for (var i = 0; i < sheets.length; i++) {
      var b = sheets[i].querySelector(".p-body");
      if (!b) { continue; }
      var over = b.scrollHeight > b.clientHeight + 1 || b.scrollWidth > b.clientWidth + 1;
      if (over) { bad.push({ page: i + 1, sh: b.scrollHeight, ch: b.clientHeight, sw: b.scrollWidth, cw: b.clientWidth }); }
    }
    var missing = sheets.length !== TOTAL;
    window.__DOSSIER__ = { lang: LANG, sheets: sheets.length, overflow: bad, missing: missing };
    if (bad.length || missing) {
      window.console.warn("DOSSIER_OVERFLOW " + JSON.stringify(bad) + " sheets=" + sheets.length);
      document.documentElement.setAttribute("data-dossier-ready", "overflow");
    } else {
      window.console.log("DOSSIER_OK " + sheets.length + " sheets");
      document.documentElement.setAttribute("data-dossier-ready", "ok");
    }
  }, 150);
})();
