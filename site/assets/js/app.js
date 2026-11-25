/* ============================================================
   app.js — page rendering, i18n, router, drawer, pitch, presenter
   Lead-owned. Depends on content.js, data.js, viz.js.
   ============================================================ */
(function () {
  "use strict";

  var D = window.RIMU_DATA || {};
  var C = window.RIMU_CONTENT || { fr: {}, zh: {} };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var NBSP = "\u202F";

  var state = {
    lang: (function () {
      var migrationKey = "rimu-lang-default-fr-v1";
      var stored = localStorage.getItem("rimu-lang");
      if (!localStorage.getItem(migrationKey)) {
        localStorage.setItem(migrationKey, "1");
        localStorage.setItem("rimu-lang", "fr");
        return "fr";
      }
      return stored === "zh" ? "zh" : "fr";
    })(),
    mode: (localStorage.getItem("rimu-mode") === "complet") ? "complet" : "synthese",
    track: "track.bilateral",
    milestone: null,
    aiGroup: 0,
    winTab: 0,
    drawer: { open: false, entityId: null, tab: "apercu", pushed: false },
    pitch: { open: false, index: 0, playing: false, timer: null },
    presenter: { on: false, black: false, timer: null, seconds: 0 },
    selectedFlow: null,
    phoneIndex: 0,
    phoneTimer: null,
    phonePaused: false,
    phoneHover: false,
    phoneCaption: "",
    flowStory: { id: "", step: 0, count: 0, paused: false, finished: false },
    media: { open: false, trigger: null }
  };

  var EXTRA = {
    fr: {
      before: "Aujourd'hui", after: "Avec la plateforme · 2031",
      flowLabel: "Flux", filiere: "Filière", pilier: "Pilier", couche: "Couche",
      close: "Fermer", all: "Tout afficher", reset: "Réinitialiser", isolate: "Isoler",
      graph: "Graphe", matrix: "Matrice", replay: "Rejouer", pause: "Pause", play: "Lire",
      next: "Suivant", prev: "Précédent", skip: "Passer", exit: "Quitter",
      chapter: "Chapitre", of: "sur", source: "Source", derived: "Dérivé", hypothesis: "Hypothèse",
      stageMature: "Mature", stagePilote: "Pilote", stagePreEtude: "Pré-étude",
      inLabel: "Entrées", outLabel: "Sorties", deliverables: "Livrables",
      phase: "Phase", duration: "Durée", months: "mois", cards: "Cartes accélératrices", power: "Puissance",
      beforeLabel: "Avant", afterLabel: "Après", transformation: "Transformation",
      previous: "Précédent", following: "Suivant", playStory: "Lire l'histoire",
      storyPause: "Pause", storyReplay: "Rejouer", copyLink: "Copier le lien", copied: "Lien copié",
      contactButton: "Demander une réunion", downloadDossier: "Télécharger le dossier",
      mailto: "contact@aureondigital.mr", web: "www.aureondigital.mr",
      protagonist: "Acteurs", kpiCount: "indicateurs", methodoTitle: "Méthodologie",
      methodoIntro: "Toutes les valeurs affichées proviennent du document de référence (novembre 2026) ou sont dérivées selon une formule explicite. Les fourchettes ne sont pas strictement additives.",
      qaLabel: "Points de vigilance", lastUpdate: "Dernière mise à jour", value: "Valeur", type: "Type",
      formula: "Formule / source", year: "Année", tagline: "Fiche", share: "Partager", seeConnections: "Voir les connexions", seeRoadmap: "Voir la feuille de route",
      phone: { feed: "Pour toi", proximite: "À proximité", marche: "Marché", live: "Live", shop: "RIMU Shop", jobs: "Jobs", sante: "Santé" },
      win: ["Mauritanie", "Chine", "Afrique de l'Ouest"],
      pitchDone: "Visite terminée", startTour: "Lancer la visite", closeTour: "Quitter",
      stageLabel: "Étape", typeLabel: "Type"
    },
    zh: {
      before: "今天", after: "有平台后 · 2031",
      flowLabel: "流量", filiere: "业务", pilier: "支柱", couche: "层级",
      close: "关闭", all: "全部显示", reset: "重置", isolate: "聚焦",
      graph: "关系图", matrix: "矩阵", replay: "重播", pause: "暂停", play: "播放",
      next: "下一步", prev: "上一步", skip: "跳过", exit: "退出",
      chapter: "章节", of: "/", source: "来源", derived: "派生", hypothesis: "假设",
      stageMature: "成熟", stagePilote: "试点", stagePreEtude: "预研",
      inLabel: "输入", outLabel: "输出", deliverables: "交付物",
      phase: "阶段", duration: "时长", months: "个月", cards: "加速卡", power: "功率",
      beforeLabel: "之前", afterLabel: "之后", transformation: "结构性转型",
      previous: "上一步", following: "下一步", playStory: "播放故事",
      storyPause: "暂停", storyReplay: "重播", copyLink: "复制链接", copied: "链接已复制",
      contactButton: "预约会议", downloadDossier: "下载方案册",
      mailto: "contact@aureondigital.mr", web: "www.aureondigital.mr",
      protagonist: "参与方", kpiCount: "指标", methodoTitle: "方法学",
      methodoIntro: "页面所有数字均来自参考文件（2026 年 11 月）或按明确公式推导；区间不可严格相加。",
      qaLabel: "口径提示", lastUpdate: "最后更新", value: "数值", type: "类型",
      formula: "公式 / 来源", year: "年份", tagline: "业务卡", share: "分享", seeConnections: "查看关联", seeRoadmap: "查看路线图",
      phone: { feed: "推荐", proximite: "附近", marche: "市场", live: "直播", shop: "RIMU 商城", jobs: "招聘", sante: "健康" },
      win: ["毛里塔尼亚", "中国", "西非"],
      pitchDone: "引导结束", startTour: "开始引导", closeTour: "退出",
      stageLabel: "阶段", typeLabel: "类型"
    }
  };

  var CHAPTERS = [
    { id: "ch-hero", key: "hero" },
    { id: "ch-pourquoi", key: "pourquoi" },
    { id: "ch-systeme", key: "systeme" },
    { id: "ch-rimu", key: "rimu" },
    { id: "ch-ia", key: "ia" },
    { id: "ch-flux", key: "flux" },
    { id: "ch-trajectoire", key: "trajectoire" },
    { id: "ch-impact", key: "impact" },
    { id: "ch-decision", key: "decision" }
  ];

  // ---------- i18n + data helpers ----------
  function getPath(obj, path) {
    if (!obj) return undefined;
    return path.split(".").reduce(function (acc, k) {
      return (acc && acc[k] !== undefined) ? acc[k] : undefined;
    }, obj);
  }
  function t(path, fallback) {
    var v = getPath(C[state.lang], path);
    if (v === undefined || v === "") v = getPath(C.fr, path);
    if (v === undefined || v === "") v = fallback;
    return v === undefined ? "" : v;
  }
  function tc(path, fallback) {
    var v = t(path, null);
    if (Array.isArray(v)) return v;
    return Array.isArray(fallback) ? fallback : [];
  }
  function x(key) {
    var v = getPath(EXTRA[state.lang], key);
    if (v === undefined) v = getPath(EXTRA.fr, key);
    return v === undefined ? key : v;
  }
  function L(obj, base) {
    if (!obj) return "";
    var suffix = state.lang === "fr" ? "FR" : "ZH";
    return obj[base + suffix] || obj[base + "FR"] || "";
  }
  var SHORT = window.RIMU_SHORT || { fr: {}, zh: {} };
  var ICONS = window.RIMU_ICON_PATHS || {};
  function S(path, fallback) {
    var v = getPath(SHORT[state.lang], path);
    if (v === undefined || v === "") v = getPath(SHORT.fr, path);
    if (v === undefined || v === "") v = fallback;
    return v === undefined ? "" : v;
  }
  function ic(name, cls) {
    var p = ICONS[name];
    if (!p) return "";
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + "</svg>";
  }
  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function html(parts) { return parts.filter(Boolean).join(""); }
  function kpiMap() {
    var map = {};
    (D.kpis || []).forEach(function (k) { map[k.id] = k; });
    return map;
  }
  var KPIS = kpiMap();
  function kpi(id) { return KPIS[id] || null; }
  function kpiDisplay(id) {
    var k = kpi(id);
    if (!k) return "";
    return state.lang === "fr" ? (k.displayFR || "") : (k.displayZH || "");
  }
  function kpiName(id) {
    var k = kpi(id);
    if (!k) return "";
    return L(k, "name") || id;
  }
  function typeLabel(type) {
    var map = { "Source": "source", "Dérivé": "derived", "Hypothèse": "hypothesis" };
    return x(map[type] || "source");
  }
  function badge(type) {
    var cls = { "Source": "badge-source", "Dérivé": "badge-derived", "Hypothèse": "badge-hypo" }[type] || "badge-source";
    return '<span class="badge ' + cls + '">' + esc(typeLabel(type)) + "</span>";
  }
  function rangeAttr(k) {
    if (!k) return "";
    return ' data-display-fr="' + esc(k.displayFR || "") + '" data-display-zh="' + esc(k.displayZH || "") + '"';
  }
  function kpiValueHTML(id, sizeClass) {
    var k = kpi(id);
    if (!k) return "";
    var cls = sizeClass || "";
    if (typeof k.value === "number") {
      var compact = (k.value >= 1000000) ? "compact" : (k.value >= 100000 ? "k" : "raw");
      return '<span class="count ' + cls + '" data-to="' + k.value + '" data-format="' + compact + '">' + esc(kpiDisplay(id)) + "</span>";
    }
    return '<span class="range ' + cls + '"' + rangeAttr(k) + '>' + esc(kpiDisplay(id)) + "</span>";
  }
  function kpiLine(id) {
    var k = kpi(id);
    if (!k) return "";
    return '<div class="metric"><span class="metric-value">' + kpiValueHTML(id) + '</span><span class="metric-label">' + esc(L(k, "name")) + "</span>" + badge(k.type) + "</div>";
  }
  function stageLabel(b) {
    var map = { "mature": ["stageMature", "Mature"], "pilote": ["stagePilote", "Pilote"], "pré-étude": ["stagePreEtude", "Pré-étude"], "pre-etude": ["stagePreEtude", "Pré-étude"] };
    var m = map[b.stage] || map["pilote"];
    return x(m[0]) || (b.stageLabelFR || m[1]);
  }
  function stageClass(b) {
    return "stage-" + String(b.stage || "pilote").replace(/[^a-z]/g, "");
  }

  // ---------- i18n application ----------
  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.documentElement.setAttribute("data-lang", state.lang);
    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var txt = t(key, el.textContent);
      if (txt !== undefined && txt !== "") el.textContent = txt;
    });
    document.title = state.lang === "fr"
      ? "Plateforme de coopération — RIMU · RIMP · IA | AUREON DIGITAL"
      : "中毛数字合作平台 — RIMU · RIMP · IA | AUREON DIGITAL";
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", state.lang === "fr"
      ? "Une plateforme. Trois souverainetés. Le point d'entrée officiel de la coopération sino-mauritanienne : plateforme bilatérale, super-application RIMU, paiement RIMP et centre national de calcul IA."
      : "一个平台，三重主权。中毛数字合作官方入口：双边平台、RIMU 超级应用、RIMP 支付与国家 AI 算力中心。");
    $$("[data-short-key]").forEach(function (el) {
      var v = S(el.getAttribute("data-short-key"), "");
      if (v) el.textContent = v;
    });
    var mediaPoster = $(".media-poster");
    if (mediaPoster) mediaPoster.setAttribute("aria-label", t("media.filmLabel", "Film de présentation"));
    var mediaDemo = $(".media-demo-card");
    if (mediaDemo) mediaDemo.setAttribute("aria-label", t("media.demoTitle", "Démo interactive"));
    // language button shows the other language
    var langBtn = $("#btn-lang .lang-current");
    if (langBtn) langBtn.textContent = state.lang === "fr" ? "中文" : "FR";
    var langBtnEl = $("#btn-lang");
    if (langBtnEl) langBtnEl.setAttribute("aria-label", state.lang === "fr" ? "Changer de langue : chinois" : "切换语言：法语");
    var modeBtn = $("#btn-mode .btn-mode-label");
    if (modeBtn) modeBtn.textContent = state.mode === "synthese" ? t("ui.modeComplet", "Complet") : t("ui.modeSynthese", "Synthèse");
    $("#btn-mode").setAttribute("aria-label", t("ui.modeAria", "Niveau de détail"));
    $("#scenario-badge").textContent = t("ui.scenario", "Scénario ambitieux");
    $("#pitch-close").setAttribute("aria-label", t("ui.exit", "Quitter"));
  }

  function applyMode() {
    document.documentElement.setAttribute("data-mode", state.mode);
    localStorage.setItem("rimu-mode", state.mode);
    var modeBtn = $("#btn-mode .btn-mode-label");
    if (modeBtn) modeBtn.textContent = state.mode === "synthese" ? t("ui.modeComplet", "Complet") : t("ui.modeSynthese", "Synthèse");
  }

  // ---------- generic renderers ----------
  function renderStaticLists() {
    renderHero();
    renderProblems();
    renderSysteme();
    renderRimu();
    renderIA();
    renderFluxChrome();
    renderTrajectoire();
    renderImpact();
    renderDecision();
    renderFooter();
    renderMethodoBody();
  }

  function renderChapterRail() {
    var rail = $("#chapter-rail");
    if (!rail) return;
    rail.innerHTML = CHAPTERS.map(function (ch, i) {
      var title = i === 0 ? t("hero.title2", "Trois souverainetés.") : t("chapters." + ch.key + ".title", ch.key);
      var kicker = i === 0 ? t("hero.kicker", "Plateforme") : t("chapters." + ch.key + ".kicker", "0" + i);
      return '<button class="rail-item' + (i === state.chapter ? " is-active" : "") + '" data-chapter="' + i + '" data-target="' + ch.id + '" type="button" aria-label="' + esc(kicker + " — " + title) + '"><span class="rail-num">0' + i + '</span><span class="rail-label">' + esc(title) + "</span></button>";
    }).join("");
  }

  function renderFooter() {
    var nav = $("#footer-nav");
    if (!nav) return;
    nav.innerHTML = CHAPTERS.map(function (ch, i) {
      var label = i === 0 ? t("hero.title1", "Une plateforme") : t("chapters." + ch.key + ".kicker", "0" + i);
      return '<button class="footer-link" type="button" data-chapter="' + i + '">' + esc(label) + "</button>";
    }).join("");
  }

  // ---------- hero ----------
  function renderHero() {
    var chips = $("#hero-pillar-chips");
    if (chips) {
      var pillars = tc("hero.pillars", []);
      if (!pillars.length) {
        pillars = (D.pillars || []).map(function (p) { return { id: p.id, label: L(p, "name"), note: L(p, "tagline").slice(0, 60) + "…" }; });
      }
      chips.innerHTML = pillars.map(function (p) {
        return '<button class="pillar-chip" type="button" data-entity="' + esc(p.id) + '"><span class="chip-label">' + esc(p.label) + '</span><span class="chip-note">' + esc(p.note || "") + "</span></button>";
      }).join("");
    }
    var kpis = $("#hero-kpis");
    if (kpis) {
      var heroKpis = tc("hero.kpis", []);
      if (!heroKpis.length && D.meta && D.meta.heroKpis) {
        heroKpis = D.meta.heroKpis.map(function (id) { return { id: id, label: kpiName(id) }; });
      }
      kpis.innerHTML = heroKpis.slice(0, 4).map(function (item) {
        var k = kpi(item.id);
        return '<div class="kpi-mini"><span class="kpi-mini-value">' + kpiValueHTML(item.id) + '</span><span class="kpi-mini-label">' + esc(item.label || kpiName(item.id)) + "</span>" + (k ? badge(k.type) : "") + "</div>";
      }).join("");
    }
  }

  // ---------- 01 pourquoi ----------
  function renderProblems() {
    var grid = $("#problems-grid");
    if (!grid) return;
    var problems = tc("problems", []);
    var problemIcons = { attention: "attention", argent: "cash", donnees: "data", "mono-export": "export" };
    grid.innerHTML = problems.map(function (p, i) {
      var key = String(p.id || "").replace(/-/g, "_");
      var shortText = S("problems." + key + ".short", p.body || "");
      var stat = S("problems." + key + ".stat", "");
      var statLabel = S("problems." + key + ".statLabel", "");
      return '<article class="problem-card vf-problem reveal" tabindex="0" role="link" data-jump="' + esc(p.link || "#ch-rimu") + '">' +
        '<span class="problem-no">0' + (i + 1) + '</span>' +
        '<span class="vf-problem-icon">' + ic(problemIcons[p.id] || "attention") + '</span>' +
        '<h3 class="problem-title">' + esc(p.title) + "</h3>" +
        (stat ? '<span class="vf-stat">' + esc(stat) + '</span>' : '') +
        (statLabel ? '<span class="vf-stat-label">' + esc(statLabel) + '</span>' : '') +
        '<p class="problem-summary vf-short synthese-only">' + esc(shortText) + '</p>' +
        '<p class="problem-body long-only">' + esc(p.body) + '</p>' +
        '<p class="problem-change long-only"><span class="problem-change-label">' + esc(t("ui.openFiche", "Ce que nous changeons")) + " →</span> " + esc(p.change || "") + "</p>" +
        '<span class="vf-arrow" aria-hidden="true">→</span>' +
        "</article>";
    }).join("");
    // avant / après
    var aa = $("#avant-apres");
    if (aa) {
      aa.innerHTML =
        '<div class="aa-item aa-before"><span class="aa-label">' + esc(x("before")) + '</span><span class="aa-value">' + kpiDisplay("kpi.adult_accounts_before") + '</span><span class="aa-note">' + esc(kpiName("kpi.adult_accounts_before")) + "</span></div>" +
        '<div class="aa-item aa-after"><span class="aa-label">' + esc(x("after")) + '</span><span class="aa-value">' + kpiDisplay("kpi.adult_accounts_2031") + '</span><span class="aa-note">' + esc(kpiName("kpi.adult_accounts_2031")) + "</span></div>";
    }
  }

  // ---------- 02 systeme ----------
  function renderSysteme() {
    renderSystemVisual();
    var stageLegend = $("#stage-legend");
    if (stageLegend) {
      stageLegend.innerHTML = ["mature", "pilote", "pré-étude"].map(function (s) {
        return '<span class="stage-badge ' + stageClass({ stage: s }) + '">' + esc(stageLabel({ stage: s })) + "</span>";
      }).join("");
    }
    var pg = $("#pillar-grid");
    if (pg) {
      pg.innerHTML = (D.pillars || []).map(function (p, i) {
        var kpis = (p.kpiIds || []).slice(0, 3).map(kpiLine).join("");
        return '<button class="pillar-card reveal" type="button" data-entity="' + esc(p.id) + '">' +
          '<span class="pillar-kicker">' + esc(L(p, "kicker") || "0" + (i + 1)) + "</span>" +
          '<span class="pillar-name">' + esc(L(p, "name")) + "</span>" +
          '<span class="pillar-tagline">' + esc(L(p, "tagline")) + "</span>" +
          '<span class="pillar-kpis">' + kpis + "</span>" +
          '<span class="card-cta">' + esc(t("ui.openFiche", "Explorer le pilier")) + "</span></button>";
      }).join("");
    }
    var bg = $("#business-grid");
    if (bg) {
      bg.innerHTML = (D.businessLines || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).map(function (b, i) {
        var kpis = (b.kpiIds || []).slice(0, 3).map(function (id) {
          return '<span class="business-metric"><span class="business-metric-value">' + kpiValueHTML(id) + '</span><span class="business-metric-label">' + esc(kpiName(id)) + "</span></span>";
        }).join("");
        return '<button class="business-card reveal" type="button" data-entity="' + esc(b.id) + '">' +
          '<span class="business-top"><span class="business-num">0' + (i + 1) + '</span><span class="stage-badge ' + stageClass(b) + '">' + esc(stageLabel(b)) + "</span></span>" +
          '<span class="business-name">' + esc(L(b, "name")) + "</span>" +
          '<span class="business-tagline">' + esc(L(b, "tagline")) + "</span>" +
          '<span class="business-metrics">' + kpis + "</span>" +
          '<span class="card-cta">' + esc(t("ui.openFiche", "Voir la fiche")) + "</span></button>";
      }).join("");
    }
    var ls = $("#layer-stack");
    if (ls) {
      ls.innerHTML = (D.layers || []).map(function (l) {
        return '<button class="layer-row reveal" type="button" data-entity="' + esc(l.id) + '">' +
          '<span class="layer-index">0' + (l.order || 1) + "</span>" +
          '<span class="layer-content"><span class="layer-name">' + esc(L(l, "name")) + '</span><span class="layer-comp">' + esc(L(l, "composition")) + "</span></span>" +
          '<span class="layer-value">' + esc(L(l, "value")) + "</span></button>";
      }).join("");
    }
  }

  function renderSystemVisual() {
    var host = $("#system-visual");
    if (!host) return;
    var pillarIcons = { "p.plateforme": "entry", "p.rimu": "rimu", "p.calcul": "compute" };
    var businessIcons = {
      "b.projets": "projects", "b.commerce-gros": "trade", "b.biens-conso": "consumer",
      "b.finance-rimp": "finance", "b.formation": "training", "b.sante": "health"
    };
    var layerIcons = {
      "layer.experience": "experience", "layer.middleware": "middleware",
      "layer.intelligent": "intelligence", "layer.infrastructure": "infrastructure"
    };
    function metric(d) {
      var id = (d.kpiIds || [])[0];
      return id ? kpiDisplay(id) : "";
    }
    var pillars = (D.pillars || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var businesses = (D.businessLines || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var layers = (D.layers || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var html = '<div class="sv-row sv-pillars">' + pillars.map(function (p) {
      var label = L(p, "name");
      return '<button class="sv-node sv-pillar" type="button" data-entity="' + esc(p.id) + '" aria-label="' + esc(label) + '">' +
        '<span class="sv-icon">' + ic(pillarIcons[p.id] || "entry") + '</span>' +
        '<span class="sv-name">' + esc(label) + '</span>' +
        '<span class="sv-metric">' + esc(metric(p)) + '</span></button>';
    }).join("") + "</div>";
    html += '<div class="sv-spine" aria-hidden="true"></div><div class="sv-row sv-businesses">';
    html += businesses.map(function (b) {
      var label = L(b, "name");
      return '<button class="sv-node sv-business" type="button" data-entity="' + esc(b.id) + '" aria-label="' + esc(label) + '">' +
        '<span class="sv-icon">' + ic(businessIcons[b.id] || "projects") + '</span>' +
        '<span class="sv-name">' + esc(label) + '</span>' +
        '<span class="sv-metric">' + esc(metric(b)) + '</span></button>';
    }).join("") + "</div>";
    html += '<div class="sv-spine" aria-hidden="true"></div><div class="sv-row sv-layers">';
    html += layers.map(function (l) {
      var label = L(l, "name");
      return '<button class="sv-node sv-layer" type="button" data-entity="' + esc(l.id) + '" aria-label="' + esc(label) + '">' +
        '<span class="sv-icon">' + ic(layerIcons[l.id] || "experience") + '</span>' +
        '<span class="sv-name">' + esc(label) + '</span></button>';
    }).join("") + "</div>";
    html += '<p class="sv-hint">' + (state.lang === "fr"
      ? "Cliquez un nœud pour ouvrir sa fiche ; les flux liés s’allument."
      : "点击节点打开详情，关联流会点亮。") + "</p>";
    host.innerHTML = html;
  }

  // ---------- 03 RIMU ----------
  var PHONE_SLIDES = [
    { key: "feed", img: "assets/img/rimu/01-pour-toi.webp", fr: "Pour toi", zh: "推荐", descFR: "Le fil personnalisé : vidéos courtes, lives et produits.", descZH: "个性化推荐流：短视频、直播与商品。" },
    { key: "marche", img: "assets/img/rimu/02-marche.webp", fr: "Marché", zh: "市场", descFR: "Recherche, catégories et produits du quotidien.", descZH: "搜索、分类与日常商品。" },
    { key: "produit", img: "assets/img/rimu/03-produit.webp", fr: "Fiche produit", zh: "商品详情", descFR: "Prix, livraison, vendeur et paiement RIMP.", descZH: "价格、配送、卖家与 RIMP 支付。" },
    { key: "live", img: "assets/img/rimu/04-live.webp", fr: "Live", zh: "直播", descFR: "Lancer un live et vendre en direct.", descZH: "发起直播与直播带货。" },
    { key: "messages", img: "assets/img/rimu/05-messages.webp", fr: "Messages", zh: "消息", descFR: "Notifications, commandes et échanges.", descZH: "通知、订单与沟通。" },
    { key: "compte", img: "assets/img/rimu/06-compte.webp", fr: "Mon compte", zh: "我的", descFR: "Commandes, favoris, portefeuille et revenus créateur.", descZH: "订单、收藏、钱包与创作者收益。" }
  ];
  var MODULE_SLIDE = { "rimu.live": 3, "rimu.studio": 0, "rimu.creation": 5, "rimu.shop": 2, "rimu.jobs": 0, "rimu.verifie": 5, "rimu.mineurs": 5, "rimu.souverainete": 0 };
  var DAY_SLIDE = { feed: 0, proximite: 1, marche: 1, live: 3, shop: 2, jobs: 0, sante: 4 };

  function renderRimu() {
    var chips = $("#module-chips");
    if (chips) {
      var modules = tc("rimu.modules", []);
      if (!modules.length) modules = (D.rimuModules || []).map(function (m) { return { id: m.id, title: L(m, "name"), body: L(m, "desc") }; });
      chips.innerHTML = modules.map(function (m, i) {
        return '<button class="module-chip" type="button" data-module="' + esc(m.id) + '"><span class="module-chip-idx">0' + (i + 1) + '</span><span class="module-chip-label">' + esc(m.title) + "</span></button>";
      }).join("");
    }
    var trust = $("#rimu-trust");
    if (trust) {
      var items = tc("rimu.trust", []);
      var trustIcons = ["shield", "wallet", "check"];
      trust.innerHTML = items.map(function (it, i) {
        return '<div class="trust-item"><span class="trust-icon">' + ic(trustIcons[i] || "shield") + '</span><span class="trust-title">' + esc(it.title) + '</span><span class="trust-body">' + esc(it.body) + "</span></div>";
      }).join("");
    }
    var facts = $("#rimu-facts");
    if (facts) {
      var factsData = state.lang === "fr" ? [
        { v: "15–60 s", t: "vidéos courtes, 3 min et format texte-image" },
        { v: "360p / 480p", t: "par défaut, pré-cache nocturne, faible bande passante" },
        { v: "FR · AR · EN", t: "langues au lancement — langues locales en phase 2" },
        { v: "Live · Shop · Jobs", t: "une seule application, un seul compte" }
      ] : [
        { v: "15–60 秒", t: "短视频、3 分钟与图文格式" },
        { v: "360p / 480p", t: "默认画质、夜间预缓存、低带宽" },
        { v: "法语 · 阿语 · 英语", t: "首批支持——本地语言二期" },
        { v: "直播 · 商城 · 招聘", t: "一个应用，一个账户" }
      ];
      facts.innerHTML = factsData.map(function (f) {
        return '<div class="rimu-fact"><span class="rimu-fact-value">' + esc(f.v) + '</span><span class="rimu-fact-label">' + esc(f.t) + "</span></div>";
      }).join("");
    }
    renderPhoneCarousel();
    var day = $("#day-timeline");
    if (day) {
      var scenes = tc("rimu.day", []);
      day.innerHTML = scenes.map(function (sc, i) {
        return '<button class="day-step" type="button" data-day="' + i + '"><span class="day-time">' + esc(sc.time) + '</span><span class="day-dot"></span><span class="day-title">' + esc(sc.title) + "</span></button>";
      }).join("");
    }
  }

  function renderPhoneCarousel() {
    var track = $("#phone-track");
    if (!track) return;
    track.innerHTML = PHONE_SLIDES.map(function (sl, i) {
      var label = state.lang === "fr" ? sl.fr : sl.zh;
      var alt = label + " — " + (state.lang === "fr" ? sl.descFR : sl.descZH);
      return '<figure class="phone-slide' + (i === state.phoneIndex ? " is-active" : "") + '" data-slide="' + i + '" aria-hidden="' + (i === state.phoneIndex ? "false" : "true") + '"><img src="' + sl.img + '" alt="' + esc(alt) + '" loading="' + (i === 0 ? "eager" : "lazy") + '" decoding="async"></figure>';
    }).join("");
    var dots = $("#phone-dots");
    if (dots) {
      dots.innerHTML = PHONE_SLIDES.map(function (sl, i) {
        return '<button class="phone-dot' + (i === state.phoneIndex ? " is-active" : "") + '" type="button" role="tab" data-phone-dot="' + i + '" aria-selected="' + (i === state.phoneIndex ? "true" : "false") + '" aria-label="' + esc(state.lang === "fr" ? sl.fr : sl.zh) + '"></button>';
      }).join("");
    }
    updatePhoneUI();
  }

  function updatePhoneUI() {
    var sl = PHONE_SLIDES[state.phoneIndex];
    if (!sl) return;
    $$("#phone-track .phone-slide").forEach(function (el, i) {
      el.classList.toggle("is-active", i === state.phoneIndex);
      el.setAttribute("aria-hidden", i === state.phoneIndex ? "false" : "true");
    });
    $$("#phone-dots .phone-dot").forEach(function (el, i) {
      el.classList.toggle("is-active", i === state.phoneIndex);
      el.setAttribute("aria-selected", i === state.phoneIndex ? "true" : "false");
    });
    var cap = $("#phone-caption");
    if (cap) cap.textContent = state.phoneCaption || (state.lang === "fr" ? sl.descFR : sl.descZH);
    var count = $("#phone-count");
    if (count) count.textContent = ("0" + (state.phoneIndex + 1)).slice(-2) + " / 0" + PHONE_SLIDES.length;
    var note = $("#phone-demo-note");
    if (note) note.textContent = state.lang === "fr"
      ? "Aperçu de l'interface de démonstration — écrans issus de la maquette produit."
      : "演示界面预览——来自产品原型截图。";
    var toggle = $("#phone-toggle");
    if (toggle) toggle.textContent = state.phonePaused ? x("play") : x("pause");
    var screen = $("#phone-screen");
    if (screen) screen.setAttribute("aria-label", (state.lang === "fr" ? "Aperçu de l'interface RIMU" : "RIMU 界面预览") + " — " + (state.lang === "fr" ? sl.fr : sl.zh));
    var eyebrow = $("#phone-eyebrow");
    if (eyebrow) eyebrow.textContent = state.lang === "fr" ? "Aperçu de l'application · 6 écrans" : "应用界面 · 6 个界面";
  }

  function showPhoneSlide(index, opts) {
    opts = opts || {};
    var n = PHONE_SLIDES.length;
    state.phoneIndex = ((index % n) + n) % n;
    state.phoneCaption = (opts.caption === undefined) ? "" : opts.caption;
    updatePhoneUI();
    if (opts.fromUser) {
      state.phonePaused = true;
      updatePhoneUI();
    }
  }

  function switchPhoneScreen(screen, opts) {
    var index = DAY_SLIDE[screen];
    if (index === undefined) index = 0;
    showPhoneSlide(index, opts);
  }

  function startPhoneAuto() {
    if (state.phoneTimer) clearInterval(state.phoneTimer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("lite")) return;
    state.phoneTimer = setInterval(function () {
      var phone = $("#phone");
      if (!phone) return;
      if (state.phonePaused || state.phoneHover || document.hidden) return;
      var rect = phone.getBoundingClientRect();
      if (rect.bottom < 80 || rect.top > (window.innerHeight || 800) - 40) return;
      showPhoneSlide(state.phoneIndex + 1);
    }, 3600);
  }

  // ---------- 04 IA & calcul ----------
  function renderAIShort() {
    var host = $("#ai-short");
    if (!host) return;
    var groups = tc("ia.groups", []).slice(0, 3);
    var icons = ["spark", "users", "chart"];
    host.innerHTML = groups.map(function (g, i) {
      var title = g.title || (D.aiUseCases && D.aiUseCases[i] ? L(D.aiUseCases[i], "name") : "");
      var shortText = S("ia.groups." + i + ".short", "");
      return '<div class="ai-short-card">' +
        '<span class="ai-short-icon">' + ic(icons[i] || "spark") + '</span>' +
        '<span class="ai-short-title">' + esc(title) + '</span>' +
        '<span class="ai-short-text">' + esc(shortText) + '</span>' +
        '</div>';
    }).join("");
  }
  function renderIA() {
    renderAIShort();
    var stack = $("#layer-3d");
    if (stack) {
      var layerIcons = { "layer.experience": "experience", "layer.middleware": "middleware", "layer.intelligent": "intelligence", "layer.infrastructure": "infrastructure" };
      var layerKeys = { "layer.experience": "experience", "layer.middleware": "middleware", "layer.intelligent": "intelligent", "layer.infrastructure": "infrastructure" };
      stack.innerHTML = (D.layers || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).map(function (l) {
        var kw = S("layers." + (layerKeys[l.id] || "experience") + ".keywords", []);
        return '<button class="layer-plate" type="button" data-entity="' + esc(l.id) + '">' +
          '<span class="layer-plate-icon">' + ic(layerIcons[l.id] || "experience") + '</span>' +
          '<span class="layer-plate-name">' + esc(L(l, "name")) + '</span>' +
          '<span class="layer-plate-keywords synthese-only">' + esc((kw || []).join(" · ")) + '</span>' +
          '<span class="layer-plate-comp">' + esc(L(l, "composition")) + "</span></button>";
      }).join("");
    }
    var tabs = $("#ai-tabs");
    var groups = tc("ia.groups", []);
    var dataGroups = D.aiUseCases || [];
    if (!groups.length) {
      groups = dataGroups.map(function (g) { return { id: g.id, title: L(g, "name"), items: (g.items || []).map(function (it) { return L(it, "name") + " — " + L(it, "desc"); }) }; });
    }
    if (tabs) {
      tabs.innerHTML = groups.map(function (g, i) {
        return '<button class="ai-tab' + (i === state.aiGroup ? " is-active" : "") + '" type="button" data-ai="' + i + '">' + esc(g.title) + "</button>";
      }).join("");
    }
    renderAIPanel();
    var phases = $("#compute-phases");
    if (phases) {
      var track = (D.roadmap && D.roadmap.tracks || []).filter(function (tr) { return tr.id === "track.calcul"; })[0];
      var ms = track ? track.milestones : [];
      var cPhases = tc("ia.phases", []);
      phases.innerHTML = ms.map(function (m, i) {
        var meta = [];
        if (m.durationMonths) meta.push(m.durationMonths + " " + x("months"));
        if (m.cards) meta.push("~" + m.cards + " " + x("cards"));
        if (m.powerMW) meta.push("≈" + (Array.isArray(m.powerMW) ? m.powerMW.join("–") : m.powerMW) + " MW");
        var contentPhase = cPhases[i] || {};
        return '<button class="phase-card" type="button" data-entity="p.calcul"><span class="phase-no">0' + (i + 1) + '</span><span class="phase-title">' + esc(L(m, "title")) + '</span><span class="phase-meta">' + esc(meta.join(" · ")) + '</span><p class="phase-body">' + esc(contentPhase.body || L(m, "description")) + "</p></button>";
      }).join("");
    }
    var sov = $("#sovereignty");
    if (sov) {
      var s = t("ia.sovereignty", null) || {};
      sov.innerHTML = '<span class="callout-label">' + esc(t("chapters.ia.kicker", "Souveraineté")) + '</span><h3 class="callout-title">' + esc(s.title || "Données, modèles et grand livre restent sur le territoire.") + '</h3><p class="callout-body">' + esc(s.body || "") + "</p>";
    }
  }
  function renderAIPanel() {
    var panel = $("#ai-panel");
    if (!panel) return;
    var groups = tc("ia.groups", []);
    var dataGroups = D.aiUseCases || [];
    var group = groups[state.aiGroup] || (dataGroups[state.aiGroup] ? { items: (dataGroups[state.aiGroup].items || []).map(function (it) { return L(it, "name") + " — " + L(it, "desc"); }) } : null);
    if (!group) { panel.innerHTML = ""; return; }
    var items = group.items || [];
    panel.innerHTML = items.map(function (it) {
      var title = typeof it === "string" ? it : (it.title || "");
      var desc = typeof it === "string" ? "" : (it.body || it.desc || "");
      return '<div class="ai-item"><span class="ai-item-title">' + esc(title) + "</span>" + (desc ? '<span class="ai-item-desc">' + esc(desc) + "</span>" : "") + "</div>";
    }).join("");
  }

  // ---------- 05 flux chrome ----------
  var FLOWS = ["capital", "marchandises", "paiements", "donnees", "attention"];
  function renderFluxChrome() {
    var legend = $("#flow-legend");
    if (legend) {
      legend.innerHTML = FLOWS.map(function (f) {
        return '<button class="flow-check is-on flow-' + f + '" type="button" data-flow="' + f + '" aria-pressed="true"><span class="flow-check-box"></span><span class="flow-check-label">' + esc(t("ui.flows." + f, f)) + "</span></button>";
      }).join("");
    }
    var controls = $("#flow-controls");
    if (controls) {
      controls.innerHTML = '<button class="btn btn-ghost btn-sm" type="button" data-flow-action="reset">' + esc(x("all")) + "</button>" +
        '<button class="btn btn-ghost btn-sm" type="button" data-flow-action="isolate">' + esc(x("isolate")) + "</button>" +
        '<button class="btn btn-ghost btn-sm is-active" type="button" data-flow-view="graph">' + esc(x("graph")) + "</button>" +
        '<button class="btn btn-ghost btn-sm" type="button" data-flow-view="matrix">' + esc(x("matrix")) + "</button>";
    }
    var stories = $("#story-chips");
    if (stories) {
      var list = tc("flux.stories", []);
      stories.innerHTML = list.map(function (s) {
        return '<button class="story-chip" type="button" data-story="' + esc(s.id) + '"><span class="story-chip-title">' + esc(s.title) + '</span><span class="story-chip-sub">' + esc(s.subtitle || "") + "</span></button>";
      }).join("");
    }
    var cap = $("#story-caption");
    if (cap) cap.textContent = t("chapters.flux.hint", "");
    var dragHint = $("#flow-drag-hint");
    if (dragHint) dragHint.textContent = state.lang === "fr" ? "Glissez horizontalement pour explorer le graphe ou la matrice." : "横向滑动浏览关系图或矩阵。";
    var matrixNote = $("#flow-matrix-note");
    if (matrixNote) matrixNote.textContent = state.lang === "fr"
      ? "Version matricielle — même information, sans animation, pensée pour le faible débit."
      : "矩阵版——信息相同、无动画，适合低带宽。";
    if (state.flowStory && state.flowStory.id) renderStoryHUD();
  }

  // ---------- flow story HUD / progress ----------
  function renderStoryProgress(container, step, count, finished) {
    var el = typeof container === "string" ? $(container) : container;
    if (!el) return;
    if (!count) { el.innerHTML = ""; return; }
    var html = "";
    for (var i = 0; i < count; i++) {
      var cls = "story-progress-seg";
      if (finished || i < step) cls += " is-done";
      if (!finished && i === step) cls += " is-on";
      html += '<span class="' + cls + '"></span>';
    }
    el.innerHTML = html;
  }
  function renderStoryHUD() {
    var st = state.flowStory || {};
    var hud = $("#flow-story-hud");
    if (!hud) return;
    var active = !!st.id;
    hud.hidden = !active;
    renderStoryProgress("#story-progress", active ? st.step : 0, active ? st.count : 0, !!st.finished);
    renderStoryProgress("#flow-story-hud-progress", active ? st.step : 0, active ? st.count : 0, !!st.finished);
    if (!active) return;
    var kicker = hud.querySelector(".hud-kicker");
    if (kicker) kicker.textContent = st.finished
      ? (state.lang === "fr" ? "Récit terminé" : "故事结束")
      : (state.lang === "fr" ? "Récit de flux" : "流故事");
    var bPause = hud.querySelector('[data-hud="pause"]');
    if (bPause) {
      bPause.hidden = !!st.finished;
      bPause.textContent = st.paused ? t("ui.resume", "Reprendre") : t("ui.pause", "Pause");
    }
    var bReplay = hud.querySelector('[data-hud="replay"]');
    if (bReplay) bReplay.textContent = t("ui.replay", "Rejouer");
    var bClose = hud.querySelector('[data-hud="close"]');
    if (bClose) bClose.setAttribute("aria-label", t("ui.exit", "Quitter"));
  }
  function onFlowStoryState(st) {
    state.flowStory = st || { id: "", step: 0, count: 0, paused: false, finished: false };
    var fluxSection = $("#ch-flux");
    if (fluxSection) fluxSection.classList.toggle("story-active", !!state.flowStory.id);
    renderStoryHUD();
    if (state.flowStory.id && !state.flowStory.finished) setTimeout(panStoryIntoView, 90);
  }
  function panStoryIntoView() {
    if (window.innerWidth > 1080) return;
    var canvas = $("#flow-canvas");
    if (!canvas || canvas.scrollWidth <= canvas.clientWidth + 4) return;
    var node = canvas.querySelector(".viz-node.is-story-current");
    if (!node) return;
    var cr = canvas.getBoundingClientRect(), nr = node.getBoundingClientRect();
    var margin = 60;
    if (nr.left < cr.left + margin || nr.right > cr.right - margin) {
      var delta = (nr.left + nr.right) / 2 - (cr.left + cr.right) / 2;
      canvas.scrollTo({ left: Math.max(0, canvas.scrollLeft + delta), behavior: "smooth" });
    }
  }
  function scrollStoryIntoView() {
    if (window.innerWidth > 1080) return;
    var hud = $("#flow-story-hud");
    if (hud && !hud.hidden) hud.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- 06 trajectoire ----------
  var TRACK_POS = {
    "track.bilateral": function (m) { return m.period === "2026" ? 2 : (m.period === "2026–2027" ? 17 : 33); },
    "track.rimu": function (m) { return m.year ? Math.max(4, Math.min(100, ((m.year - 2026) / 5) * 100)) : 50; },
    "track.calcul": function (m, i) { return [4, 38, 70][i] || 50; }
  };
  function renderTrajectoire() {
    var tabs = $("#track-tabs");
    var tracks = (D.roadmap && D.roadmap.tracks) || [];
    if (tabs) {
      tabs.innerHTML = tracks.map(function (tr) {
        return '<button class="track-tab' + (tr.id === state.track ? " is-active" : "") + '" type="button" data-track="' + esc(tr.id) + '">' + esc(L(tr, "name")) + "</button>";
      }).join("");
    }
    var axis = $("#timeline-axis");
    if (axis) {
      var years = [2026, 2027, 2028, 2029, 2030, 2031];
      axis.innerHTML = years.map(function (y, i) {
        return '<span class="timeline-year" style="left:' + (i / 5 * 100) + '%">' + y + "</span>";
      }).join("");
    }
    renderTimeline();
  }
  function currentTrack() {
    var tracks = (D.roadmap && D.roadmap.tracks) || [];
    return tracks.filter(function (tr) { return tr.id === state.track; })[0] || tracks[0];
  }
  function renderTimeline() {
    var host = $("#timeline");
    var track = currentTrack();
    if (!host || !track) return;
    var ms = track.milestones || [];
    if (!state.milestone || !ms.some(function (m) { return m.id === state.milestone; })) state.milestone = ms[0] ? ms[0].id : null;
    host.innerHTML = ms.map(function (m, i) {
      var pos = TRACK_POS[track.id] ? TRACK_POS[track.id](m, i) : 50;
      var label = m.period || (m.year ? String(m.year) : "Phase " + (i + 1));
      return '<button class="timeline-milestone' + (m.id === state.milestone ? " is-active" : "") + '" type="button" data-ms="' + esc(m.id) + '" style="left:' + pos + '%"><span class="ms-dot"></span><span class="ms-label">' + esc(label) + "</span></button>";
    }).join("");
    renderMilestoneDetail();
  }
  function renderMilestoneDetail() {
    var host = $("#timeline-detail");
    var track = currentTrack();
    if (!host || !track) return;
    var m = (track.milestones || []).filter(function (x) { return x.id === state.milestone; })[0];
    if (!m) { host.innerHTML = ""; return; }
    var deliver = [];
    if (m.deliverablesFR || m.deliverablesZH) {
      deliver = (state.lang === "fr" ? m.deliverablesFR : m.deliverablesZH) || m.deliverablesFR || [];
    }
    var kpis = (m.kpiIds || []).slice(0, 3).map(function (id) {
      return '<span class="milestone-kpi">' + kpiValueHTML(id) + " <em>" + esc(kpiName(id)) + "</em></span>";
    }).join("");
    host.innerHTML = '<div class="milestone-card"><span class="milestone-kicker">' + esc(m.period || (m.year ? String(m.year) : "Phase " + m.phase)) + '</span><h4 class="milestone-title">' + esc(L(m, "title")) + '</h4><p class="milestone-body">' + esc(L(m, "description")) + "</p>" +
      (deliver.length ? '<ul class="milestone-list">' + deliver.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" : "") +
      (kpis ? '<div class="milestone-kpis">' + kpis + "</div>" : "") + "</div>";
  }

  // ---------- 07 impact ----------
  function renderImpact() {
    var host = $("#impact-kpis");
    if (host) {
      var ids = ["kpi.mau_2031", "kpi.revenue_total_2031", "kpi.wallets_2031", "kpi.jobs_5y"];
      var labels = tc("hero.kpis", []);
      var labelById = {};
      labels.forEach(function (l) { labelById[l.id] = l.label; });
      host.innerHTML = ids.map(function (id) {
        var k = kpi(id);
        return '<div class="kpi-big">' + kpiValueHTML(id, "kpi-big-value") + '<span class="kpi-big-label">' + esc(labelById[id] || kpiName(id)) + "</span>" + (k ? badge(k.type) : "") + "</div>";
      }).join("");
    }
    var winTabs = $("#win-tabs");
    if (winTabs) {
      var tabs = tc("impact.tabs", []);
      winTabs.innerHTML = tabs.map(function (tb, i) {
        return '<button class="win-tab' + (i === state.winTab ? " is-active" : "") + '" type="button" data-win="' + esc(tb.id) + '">' + esc(tb.label) + "</button>";
      }).join("");
    }
    renderWinPanel();
    var trans = $("#transformation");
    if (trans) {
      trans.innerHTML = (D.transformations || []).map(function (tr) {
        return '<div class="trans-item"><span class="trans-dim">' + esc(L(tr, "dimension")) + '</span><div class="trans-row"><span class="trans-before"><em>' + esc(x("beforeLabel")) + '</em>' + esc(L(tr, "before")) + '</span><span class="trans-arrow">→</span><span class="trans-after"><em>' + esc(x("afterLabel")) + '</em>' + esc(L(tr, "after")) + "</span></div></div>";
      }).join("");
    }
  }
  function renderWinPanel() {
    var panel = $("#win-panel");
    if (!panel) return;
    var tabs = tc("impact.tabs", []);
    var tab = tabs[state.winTab];
    if (!tab) { panel.innerHTML = ""; return; }
    var winShort = S("impact.tabs." + state.winTab + ".short", "");
    panel.innerHTML = (winShort ? '<p class="win-short synthese-only">' + esc(winShort) + "</p>" : "") +
      (tab.items || []).map(function (it) {
        return '<div class="benefit-item long-only"><span class="benefit-title">' + esc(it) + "</span></div>";
      }).join("");
  }

  // ---------- 08 decision ----------
  function renderDecisionTiles() {
    var host = $("#decision-tiles");
    if (!host) return;
    var keys = { "support.organisation": "organisation", "support.sites": "sites", "support.financement": "financement", "support.finance": "finance_regles", "support.diplomatie": "diplomatie" };
    var icons = ["gov", "land", "funding", "rules", "diplomacy"];
    var list = (D.stateSupports || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    host.innerHTML = list.map(function (s, i) {
      var key = keys[s.id] || "organisation";
      var unlock = S("decision.supports." + key + ".unlock", "");
      var status = S("decision.supports." + key + ".status", state.lang === "fr" ? "À clarifier" : "待明确");
      var iconName = S("decision.supports." + key + ".icon", icons[i] || "gov");
      return '<div class="decision-tile">' +
        '<span class="dt-no">0' + (i + 1) + '</span>' +
        '<span class="dt-icon">' + ic(iconName) + '</span>' +
        '<span class="dt-title">' + esc(L(s, "title")) + '</span>' +
        '<span class="dt-unlock">' + esc(unlock || L(s, "ask")) + '</span>' +
        '<span class="dt-status">' + esc(status) + '</span>' +
        "</div>";
    }).join("");
  }
  function renderRiskGauges() {
    var host = $("#risk-gauges");
    if (!host) return;
    var keys = { "risk.interop": "interop", "risk.contenu": "contenu", "risk.energie": "electricite", "risk.donnees": "donnees", "risk.talents": "talents" };
    var icons = ["risk_wallet", "risk_religion", "risk_power", "risk_cloud", "risk_talent"];
    var list = (D.risks || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    host.innerHTML = list.map(function (r, i) {
      var key = keys[r.id] || "interop";
      var status = S("decision.risks." + key + ".status", state.lang === "fr" ? "Mécanisme prévu" : "机制已列");
      var iconName = S("decision.risks." + key + ".icon", icons[i] || "shield");
      return '<div class="risk-gauge">' +
        '<span class="rg-icon">' + ic(iconName) + '</span>' +
        '<span class="rg-label">' + esc(L(r, "title")) + '</span>' +
        '<span class="rg-status">' + esc(status) + '</span>' +
        '<span class="rg-bar" aria-hidden="true"><i></i></span>' +
        "</div>";
    }).join("");
  }
  function renderDecision() {
    renderDecisionTiles();
    renderRiskGauges();
    var supports = $("#supports");
    if (supports) {
      supports.innerHTML = (D.stateSupports || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).map(function (s, i) {
        var details = ((state.lang === "fr" ? s.detailsFR : s.detailsZH) || s.detailsFR || []).map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("");
        return '<div class="support-row"><button class="support-head" type="button" aria-expanded="false"><span class="support-no">0' + (i + 1) + '</span><span class="support-title">' + esc(L(s, "title")) + '</span><span class="support-ask">' + esc(L(s, "ask")) + '</span><span class="support-chevron">+</span></button><div class="support-body">' + (details ? '<ul class="support-details">' + details + "</ul>" : "") + (s.firstSixMonthsFR ? '<p class="support-result"><em>' + esc(t("chapters.decision.nextLabel", "6 mois")) + " :</em> " + esc(state.lang === "fr" ? s.firstSixMonthsFR : (s.firstSixMonthsZH || s.firstSixMonthsFR)) + "</p>" : "") + "</div></div>";
      }).join("");
    }
    var risks = $("#risks");
    if (risks) {
      risks.innerHTML = (D.risks || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).map(function (r, i) {
        var g = ((state.lang === "fr" ? r.guaranteesFR : r.guaranteesZH) || r.guaranteesFR || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
        return '<div class="risk-card"><button class="risk-title" type="button" aria-expanded="false"><span class="risk-no">0' + (i + 1) + '</span><span>' + esc(L(r, "title")) + '</span><span class="risk-chevron">+</span></button><div class="risk-body"><p class="risk-desc">' + esc(L(r, "risk")) + '</p><ul class="risk-guarantees">' + g + "</ul></div></div>";
      }).join("");
    }
    var ctas = $("#cta-cards");
    if (ctas) {
      var cards = tc("decision.ctas", []);
      ctas.innerHTML = cards.map(function (c) {
        return '<div class="cta-card"><span class="cta-kicker">' + esc(c.kicker || "") + '</span><h4 class="cta-title">' + esc(c.title) + '</h4><p class="cta-body">' + esc(c.body || "") + '</p><button class="btn btn-gold cta-action" type="button" data-cta="' + esc(c.id) + '">' + esc(c.button || x("contactButton")) + " →</button></div>";
      }).join("");
    }
    var next = $("#next-steps");
    if (next) {
      var steps = tc("decision.next", []);
      next.innerHTML = steps.map(function (s) {
        return '<div class="next-step"><span class="next-period">' + esc(s.period) + '</span><ul class="next-list">' + (s.items || []).map(function (it) { return "<li>" + esc(it) + "</li>"; }).join("") + "</ul></div>";
      }).join("");
    }
    var contact = $("#contact");
    if (contact) {
      var c = t("decision.contact", null) || {};
      contact.innerHTML = '<div class="contact-inner"><span class="contact-kicker">AUREON DIGITAL</span><h3 class="contact-title">' + esc(c.title || "Parlons de la prochaine étape.") + '</h3><p class="contact-body">' + esc(c.body || "Nouakchott, Mauritanie · Bâtisseur de la souveraineté numérique.") + '</p><div class="contact-actions"><a class="btn btn-gold" href="mailto:' + esc(x("mailto")) + '">' + esc(c.button || x("contactButton")) + '</a><a class="btn btn-ghost" href="https://' + esc(x("web")) + '" target="_blank" rel="noopener">' + esc(x("web")) + "</a></div></div>";
    }
  }

  // ---------- methodology ----------
  function renderMethodoBody() {
    var host = $("#methodo-body");
    if (!host) return;
    var m = t("methodo", null) || {};
    var ids = ["kpi.mau_2031", "kpi.dau_2031", "kpi.daily_minutes_2031", "kpi.wallets_2031", "kpi.revenue_total_2031", "kpi.revenue_rimu_2031", "kpi.revenue_rimp_2031", "kpi.revenue_compute_2031", "kpi.jobs_5y"];
    var rows = ids.map(function (id) {
      var k = kpi(id);
      if (!k) return "";
      return "<tr><td>" + esc(L(k, "name")) + "</td><td>" + esc(kpiDisplay(id)) + "</td><td>" + esc(k.type) + "</td><td>" + esc(k.year || "") + "</td><td>" + esc(k.formula || (k.sourceLines ? "src. L" + k.sourceLines.join(", L") : "—")) + "</td></tr>";
    }).join("");
    var qa = (D.qa || []).map(function (q) {
      return '<div class="qa-item"><span class="qa-code">' + esc(q.id) + '</span><div><strong class="qa-title">' + esc(state.lang === "fr" ? q.topicFR : (q.topicZH || q.topicFR)) + '</strong><p class="qa-decision">' + esc(state.lang === "fr" ? q.recommendedFR : (q.recommendedZH || q.recommendedFR)) + "</p></div></div>";
    }).join("");
    var updated = (D.meta && D.meta.methodology && D.meta.methodology.lastUpdate) || "2026-11-09";
    host.innerHTML = '<p class="methodo-intro">' + esc(m.intro || x("methodoIntro")) + "</p>" +
      '<div class="methodo-scroll"><table class="methodo-table"><thead><tr><th>' + esc(x("value")) + "</th><th>" + esc(x("value")) + "</th><th>" + esc(x("type")) + "</th><th>" + esc(x("year")) + "</th><th>" + esc(x("formula")) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>" +
      '<h3 class="methodo-sub">' + esc(m.qaTitle || x("qaLabel")) + '</h3><div class="methodo-qa">' + qa + "</div>" +
      '<p class="methodo-note">' + esc(m.note || "") + "<br>" + esc(x("lastUpdate")) + " : " + esc(updated) + "</p>";
  }

  // ---------- entity helpers ----------
  function findEntity(id) {
    var p = (D.pillars || []).filter(function (x) { return x.id === id; })[0];
    if (p) return { type: "pillar", data: p };
    var b = (D.businessLines || []).filter(function (x) { return x.id === id; })[0];
    if (b) return { type: "business", data: b };
    var l = (D.layers || []).filter(function (x) { return x.id === id; })[0];
    if (l) return { type: "layer", data: l };
    return null;
  }
  function typeLabelOf(type) { return x(type === "pillar" ? "pilier" : (type === "business" ? "filiere" : "couche")); }
  function extraFor(id) {
    var c = C[state.lang] || {};
    var e = (c.drawerExtra && c.drawerExtra[id]) || (C.fr && C.fr.drawerExtra && C.fr.drawerExtra[id]) || null;
    return e;
  }
  function entityName(type, d) { return L(d, "name") || d.id; }
  function entityTagline(type, d) {
    if (type === "layer") return L(d, "composition");
    return L(d, "tagline") || "";
  }
  function entityKpis(d) { return (d.kpiIds || []).slice(0, 3); }
  function relFor(id) {
    return (D.relations || []).filter(function (r) { return r.from === id || r.to === id; });
  }
  function trackForEntity(type, d) {
    if (type === "pillar") {
      if (d.id === "p.rimu") return "track.rimu";
      if (d.id === "p.calcul") return "track.calcul";
      return "track.bilateral";
    }
    if (type === "layer") return "track.calcul";
    var pids = d.pillarIds || [];
    if (pids.indexOf("p.rimu") !== -1) return "track.rimu";
    if (pids.indexOf("p.calcul") !== -1) return "track.calcul";
    return "track.bilateral";
  }
  function milestoneTrack(trackId) {
    return ((D.roadmap && D.roadmap.tracks) || []).filter(function (tr) { return tr.id === trackId; })[0];
  }

  // ---------- drawer ----------
  function renderDrawer() {
    var ent = findEntity(state.drawer.entityId);
    if (!ent) return;
    var d = ent.data;
    $("#drawer-kicker").textContent = typeLabelOf(ent.type) + " · " + (d.order ? "0" + d.order : "");
    $("#drawer-title").textContent = entityName(ent.type, d);
    $("#drawer-tagline").textContent = entityTagline(ent.type, d);
    var stageEl = $("#drawer-stage");
    if (ent.type === "business") {
      stageEl.className = "stage-badge " + stageClass(d);
      stageEl.textContent = stageLabel(d);
      stageEl.hidden = false;
    } else { stageEl.hidden = true; stageEl.textContent = ""; }
    $("#drawer-type").textContent = typeLabelOf(ent.type);
    // kpis
    var kpis = entityKpis(d);
    var host = $("#drawer-kpis");
    if (kpis.length) {
      host.hidden = false;
      host.innerHTML = kpis.map(function (id) {
        var k = kpi(id);
        return '<div class="drawer-kpi"><span class="drawer-kpi-value">' + kpiValueHTML(id) + '</span><span class="drawer-kpi-label">' + esc(kpiName(id)) + "</span>" + (k ? badge(k.type) : "") + "</div>";
      }).join("");
    } else { host.hidden = true; host.innerHTML = ""; }
    // tabs
    var tabKeys = ["apercu", "fonctionnement", "chiffres", "acteurs", "roadmap", "risques"];
    var labels = { apercu: t("ui.tabs.apercu", "Aperçu"), fonctionnement: t("ui.tabs.fonctionnement", "Fonctionnement"), chiffres: t("ui.tabs.chiffres", "Chiffres clés"), acteurs: t("ui.tabs.acteurs", "Acteurs & flux"), roadmap: t("ui.tabs.roadmap", "Feuille de route"), risques: t("ui.tabs.risques", "Risques") };
    $("#drawer-tabs").innerHTML = tabKeys.map(function (k) {
      return '<button class="drawer-tab' + (k === state.drawer.tab ? " is-active" : "") + '" type="button" role="tab" aria-selected="' + (k === state.drawer.tab) + '" data-drawer-tab="' + k + '">' + esc(labels[k]) + "</button>";
    }).join("");
    renderDrawerBody();
  }

  function renderDrawerBody() {
    var ent = findEntity(state.drawer.entityId);
    if (!ent) return;
    var d = ent.data, id = d.id, tab = state.drawer.tab, ex = extraFor(id) || {};
    var body = $("#drawer-body");
    var out = "";
    if (tab === "apercu") {
      var paras = (ex.apercu || []).slice();
      if (!paras.length) {
        if (ent.type === "business") paras = [L(d, "definition")];
        else if (ent.type === "pillar") paras = [L(d, "tagline")].concat((state.lang === "fr" ? d.bulletsFR : d.bulletsZH) || []);
        else paras = [L(d, "composition"), L(d, "value")];
      }
      out = '<div class="drawer-paragraphs">' + paras.filter(Boolean).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
      if (ent.type === "business" && (d.tags || []).length) {
        out += '<div class="drawer-entity-chips">' + (state.lang === "fr" ? d.tags : (d.tagsZH || d.tags)).map(function (tg) { return '<span class="tag">' + esc(tg) + "</span>"; }).join("") + "</div>";
      }
    } else if (tab === "fonctionnement") {
      var fn = ex.fonctionnement || {};
      out = '<div class="drawer-block">';
      if (fn.intro) out += '<p class="drawer-lead">' + esc(fn.intro) + "</p>";
      if (fn.steps && fn.steps.length) {
        out += '<ol class="drawer-steps">' + fn.steps.map(function (st) { return "<li><strong>" + esc(st.title || "") + "</strong><span>" + esc(st.body || "") + "</span></li>"; }).join("") + "</ol>";
      }
      if (ent.type === "business" && (d.subModules || []).length) {
        out += '<h4 class="drawer-section-title">' + esc(t("ui.tabs.fonctionnement", "Modules")) + '</h4><div class="drawer-modules">' + d.subModules.map(function (m) {
          return '<div class="drawer-module"><span class="drawer-module-name">' + esc(L(m, "name")) + '</span><span class="drawer-module-desc">' + esc(L(m, "desc")) + "</span></div>";
        }).join("") + "</div>";
      }
      if (ent.type === "pillar") {
        out += '<ul class="drawer-list">' + (((state.lang === "fr" ? d.bulletsFR : d.bulletsZH) || [])).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>";
      }
      if (ent.type === "layer") {
        out += '<p class="drawer-paragraph">' + esc(L(d, "composition")) + '</p><p class="drawer-paragraph">' + esc(L(d, "value")) + "</p>";
      }
      out += "</div>";
      if (!fn.intro && !(fn.steps || []).length && ent.type === "layer") out = '<div class="drawer-paragraphs"><p>' + esc(L(d, "composition")) + "</p><p>" + esc(L(d, "value")) + "</p></div>";
    } else if (tab === "chiffres") {
      var ids = d.kpiIds || [];
      if (ids.length) {
        out = '<div class="drawer-kpi-grid">' + ids.map(function (kid) {
          var k = kpi(kid);
          if (!k) return "";
          return '<div class="drawer-kpi-card"><span class="drawer-kpi-value">' + kpiValueHTML(kid) + '</span><span class="drawer-kpi-name">' + esc(L(k, "name")) + "</span>" + badge(k.type) + '<button class="drawer-kpi-info" type="button" data-methodo="1" aria-label="' + esc(x("methodoTitle")) + '">ⓘ</button></div>';
        }).join("") + "</div>";
      } else { out = '<p class="drawer-note">' + esc(t("chapters.impact.lead", "")) + "</p>"; }
    } else if (tab === "acteurs") {
      var flows = FLOWS;
      var flowLabels = { capital: t("ui.flows.capital", "Capital"), marchandises: t("ui.flows.marchandises", "Marchandises"), paiements: t("ui.flows.paiements", "Paiements"), donnees: t("ui.flows.donnees", "Données"), attention: t("ui.flows.attention", "Attention") };
      if (ent.type === "business" && d.flowIn) {
        out = '<div class="drawer-flow-cols"><div><h4 class="drawer-section-title">' + esc(x("inLabel")) + "</h4>" + flows.map(function (f) {
          var v = d.flowIn[f];
          if (!v) return "";
          return '<div class="drawer-flow-row flow-' + f + '"><span class="flow-dot"></span><span class="flow-name">' + esc(flowLabels[f]) + '</span><span class="flow-text">' + esc(state.lang === "fr" ? v.textFR : (v.textZH || v.textFR)) + "</span></div>";
        }).join("") + '</div><div><h4 class="drawer-section-title">' + esc(x("outLabel")) + "</h4>" + flows.map(function (f) {
          var v = d.flowOut && d.flowOut[f];
          if (!v) return "";
          return '<div class="drawer-flow-row flow-' + f + '"><span class="flow-dot"></span><span class="flow-name">' + esc(flowLabels[f]) + '</span><span class="flow-text">' + esc(state.lang === "fr" ? v.textFR : (v.textZH || v.textFR)) + "</span></div>";
        }).join("") + "</div></div>";
        if ((d.actorsFR || d.actorsZH || []).length) {
          out += '<h4 class="drawer-section-title">' + esc(x("protagonist")) + '</h4><ul class="drawer-list">' + ((state.lang === "fr" ? d.actorsFR : (d.actorsZH || d.actorsFR)) || []).map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>";
        }
      } else {
        var rel = relFor(id).slice(0, 8);
        out = '<div class="drawer-paragraphs"><p>' + esc(L(d, "tagline") || L(d, "composition") || "") + "</p></div>";
        if (rel.length) {
          out += '<h4 class="drawer-section-title">' + esc(x("seeConnections")) + "</h4>" + rel.map(function (r) {
            var other = r.from === id ? r.to : r.from;
            var oe = findEntity(other);
            var name = oe ? entityName(oe.type, oe.data) : other;
            return '<div class="drawer-flow-row flow-' + r.flow + '"><span class="flow-dot"></span><span class="flow-name">' + esc(t("ui.flows." + r.flow, r.flow)) + '</span><span class="flow-text">' + esc(L(r, "label")) + " · " + esc(name) + "</span></div>";
          }).join("");
        }
      }
    } else if (tab === "roadmap") {
      var trackId = trackForEntity(ent.type, d);
      var track = milestoneTrack(trackId);
      var ms = (track && track.milestones) || [];
      out = '<div class="drawer-timeline">' + ms.map(function (m) {
        return '<div class="drawer-timeline-item"><span class="drawer-timeline-dot"></span><span class="drawer-timeline-period">' + esc(m.period || (m.year ? String(m.year) : "Phase " + m.phase)) + '</span><div class="drawer-timeline-content"><strong>' + esc(L(m, "title")) + "</strong><p>" + esc(L(m, "description")) + "</p></div></div>";
      }).join("") + "</div>";
    } else if (tab === "risques") {
      var list = [];
      if (ent.type === "business" && (d.risks || []).length) {
        list = d.risks.map(function (r) { return { title: L(r, "risk"), body: L(r, "mitigation") }; });
      } else {
        list = (D.risks || []).slice(0, 2).map(function (r) { return { title: L(r, "title"), body: (state.lang === "fr" ? (r.guaranteesFR || []) : (r.guaranteesZH || r.guaranteesFR || [])).join(" · ") }; });
      }
      out = list.map(function (r) { return '<div class="drawer-risk"><strong>' + esc(r.title) + "</strong><p>" + esc(r.body) + "</p></div>"; }).join("");
    }
    body.innerHTML = out;
    $$("#drawer-tabs .drawer-tab").forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-drawer-tab") === tab); });
  }

  function openEntity(id, tab, opts) {
    opts = opts || {};
    var ent = findEntity(id);
    if (!ent) return;
    state.drawer.open = true;
    state.drawer.entityId = id;
    state.drawer.tab = tab || "apercu";
    renderDrawer();
    var root = $("#drawer-root");
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    if (!opts.fromHistory) {
      var url = routeForEntity(ent.type, ent.data.id, state.drawer.tab);
      if (opts.push !== false) {
        history.pushState({ drawer: id }, "", url);
        state.drawer.pushed = true;
      } else {
        history.replaceState({ drawer: id }, "", url);
      }
    }
    setTimeout(function () { $("#drawer-close").focus(); }, 40);
    if (window.RIMU_VIZ && RIMU_VIZ.focusNode) { try { RIMU_VIZ.focusNode(id); } catch (e) {} }
  }
  function closeDrawer(fromHistory) {
    if (!state.drawer.open) return;
    var root = $("#drawer-root");
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
    state.drawer.open = false;
    if (!fromHistory && state.drawer.pushed && location.hash.indexOf("#/") === 0) {
      history.back();
    } else if (!fromHistory && location.hash.indexOf("#/") === 0) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    state.drawer.pushed = false;
  }
  function routeForEntity(type, id, tab) {
    var slug = id.replace(/^b\./, "").replace(/^p\./, "").replace(/^layer\./, "");
    var prefix = type === "business" ? "business" : (type === "pillar" ? "pillar" : "layer");
    var base = "#/" + prefix + "/" + slug;
    return (tab && tab !== "apercu") ? base + "/" + tab : base;
  }

  // ---------- pitch ----------
  function pitchScenes() {
    var scenes = tc("pitch.scenes", []);
    if (scenes.length) return scenes;
    return CHAPTERS.slice(1).map(function (c, i) {
      return { id: "scene-" + i, chapterId: c.id, title: t("chapters." + c.key + ".title", c.key), caption: t("chapters." + c.key + ".lead", "") };
    });
  }
  function startPitch() {
    state.pitch.open = true;
    state.pitch.index = 0;
    state.pitch.playing = true;
    $("#pitch-root").classList.add("is-open");
    $("#pitch-root").setAttribute("aria-hidden", "false");
    document.body.classList.add("pitch-open");
    renderPitch();
    schedulePitch();
  }
  function schedulePitch() {
    clearTimeout(state.pitch.timer);
    if (!state.pitch.open || !state.pitch.playing) return;
    state.pitch.timer = setTimeout(function () { nextPitch(1, true); }, 22000);
  }
  function renderPitch() {
    var scenes = pitchScenes();
    var sc = scenes[state.pitch.index];
    if (!sc) return;
    $("#pitch-scene-no").textContent = "0" + (state.pitch.index + 1) + " / 0" + scenes.length;
    $("#pitch-title").textContent = sc.title || "";
    $("#pitch-caption").textContent = sc.caption || "";
    $("#pitch-progress").innerHTML = scenes.map(function (s, i) {
      return '<span class="pitch-seg' + (i < state.pitch.index ? " is-done" : (i === state.pitch.index ? " is-on" : "")) + '"></span>';
    }).join("");
    $("#pitch-controls").innerHTML =
      '<button class="btn btn-ghost btn-sm" type="button" data-pitch-action="prev">' + esc(t("ui.prev", "Précédent")) + "</button>" +
      '<button class="btn btn-gold btn-sm" type="button" data-pitch-action="toggle">' + esc(state.pitch.playing ? t("ui.pause", "Pause") : t("ui.resume", "Reprendre")) + "</button>" +
      '<button class="btn btn-ghost btn-sm" type="button" data-pitch-action="next">' + esc(t("ui.next", "Suivant")) + "</button>" +
      '<button class="btn btn-ghost btn-sm" type="button" data-pitch-action="exit">' + esc(t("ui.exit", "Quitter")) + "</button>";
    if (sc.chapterId) {
      var idx = CHAPTERS.map(function (c) { return c.id; }).indexOf(sc.chapterId);
      if (idx >= 0) scrollToChapter(idx, true);
    }
    schedulePitch();
  }
  function nextPitch(dir, auto) {
    var scenes = pitchScenes();
    var next = state.pitch.index + dir;
    if (next >= scenes.length) {
      if (auto) { exitPitch(); return; }
      next = scenes.length - 1;
    }
    state.pitch.index = Math.max(0, next);
    renderPitch();
  }
  function togglePitch() {
    state.pitch.playing = !state.pitch.playing;
    renderPitch();
    if (!state.pitch.playing) clearTimeout(state.pitch.timer); else schedulePitch();
  }
  function exitPitch() {
    state.pitch.open = false;
    state.pitch.playing = false;
    clearTimeout(state.pitch.timer);
    $("#pitch-root").classList.remove("is-open");
    $("#pitch-root").setAttribute("aria-hidden", "true");
    document.body.classList.remove("pitch-open");
  }

  // ---------- presenter ----------
  function togglePresenter(force) {
    state.presenter.on = (force !== undefined) ? force : !state.presenter.on;
    document.body.classList.toggle("presenter-mode", state.presenter.on);
    var bar = $("#presenter-bar");
    bar.setAttribute("aria-hidden", state.presenter.on ? "false" : "true");
    if (state.presenter.on) {
      state.presenter.seconds = 0;
      updatePresenterChapter();
      clearInterval(state.presenter.timer);
      state.presenter.timer = setInterval(function () {
        state.presenter.seconds += 1;
        var m = Math.floor(state.presenter.seconds / 60), s = state.presenter.seconds % 60;
        $("#presenter-timer").textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
      }, 1000);
      window.scrollTo({ top: 0, behavior: "auto" });
      scrollToChapter(0, true);
    } else {
      clearInterval(state.presenter.timer);
      state.presenter.black = false;
      document.body.classList.remove("presenter-black");
    }
  }
  function updatePresenterChapter() {
    var el = $("#presenter-chapter");
    if (el) el.textContent = String(state.chapter + 1) + " / " + CHAPTERS.length + " · " + t("chapters." + (CHAPTERS[state.chapter] || {}).key + ".title", "");
  }

  // ---------- navigation ----------
  function scrollToChapter(index, instant) {
    var ch = CHAPTERS[index];
    if (!ch) return;
    var el = document.getElementById(ch.id);
    if (!el) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || instant;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    state.chapter = index;
    updateRail(index);
    updatePresenterChapter();
  }
  function scrollToSelector(sel) {
    var el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function updateRail(index) {
    $$("#chapter-rail .rail-item").forEach(function (b) { b.classList.toggle("is-active", Number(b.getAttribute("data-chapter")) === index); });
    var pct = (index / (CHAPTERS.length - 1)) * 100;
    var prog = $("#scroll-progress .bar");
    if (prog) prog.style.width = Math.max(2, pct) + "%";
  }
  function onScroll() {
    var doc = document.documentElement;
    var top = window.scrollY || doc.scrollTop;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, (top / max) * 100) : 0;
    var prog = $("#scroll-progress .bar");
    if (prog) prog.style.width = pct + "%";
    $("#site-header").classList.toggle("is-scrolled", top > 24);
    if (state.presenter.on) updatePresenterChapter();
  }

  // ---------- toast / modal / misc ----------
  function showToast(msg) {
    var existing = $(".toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add("is-on"); }, 20);
    setTimeout(function () { el.classList.remove("is-on"); setTimeout(function () { el.remove(); }, 300); }, 2200);
  }
  function openMethodo() {
    var root = $("#methodo-root");
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(function () { var b = $(".modal-head .btn"); if (b) b.focus(); }, 40);
  }
  function closeMethodo() {
    var root = $("#methodo-root");
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  // ---------- film / démo ----------
  var DEMO_URL = "https://v0-project-iota-ecru.vercel.app/";

  function openMedia(kind, trigger) {
    var root = $("#media-root");
    if (!root) return;
    state.media.open = true;
    state.media.trigger = trigger || document.activeElement;
    var title = $("#media-modal-title");
    var body = $("#media-modal-body");
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (kind === "demo") {
      if (title) title.textContent = t("media.demoTitle", "Démo interactive");
      body.innerHTML = '<div class="media-demo-preview"><img src="assets/img/demo-preview.jpg" alt="' + esc(t("media.demoTitle", "Démo interactive")) + '"><span class="media-demo-preview-label">v0.app</span></div>' +
        '<div class="media-demo-actions"><p class="media-demo-note">' + esc(t("media.demoNote", "")) + '</p><a class="media-demo-open" href="' + DEMO_URL + '" target="_blank" rel="noopener">' + esc(t("media.demoOpen", "Ouvrir dans un nouvel onglet")) + " →</a></div>";
    } else {
      if (title) title.textContent = t("media.videoTitle", "Le film de la plateforme");
      body.innerHTML = '<video id="media-video" controls playsinline preload="metadata" poster="assets/img/video-poster.jpg"><source src="assets/video/plateforme-intro.mp4" type="video/mp4"></video>' +
        '<p class="media-modal-caption">' + esc(t("media.videoCaption", "")) + '</p>' +
        '<div class="media-demo-actions"><p class="media-demo-note">' + esc(t("media.note", "")) + '</p><a class="media-demo-open" href="' + DEMO_URL + '" target="_blank" rel="noopener">' + esc(t("media.demoCta", "Ouvrir la démo")) + " →</a></div>";
      var video = $("#media-video");
      if (video) { try { video.play().catch(function () {}); } catch (e) {} }
    }
    var close = $(".media-modal-close", root);
    if (close) close.focus();
  }

  function closeMedia() {
    var root = $("#media-root");
    if (!root || !state.media.open) return;
    var video = $("#media-video");
    if (video) { try { video.pause(); } catch (e) {} }
    var frame = $("iframe", root);
    if (frame) frame.src = "about:blank";
    var body = $("#media-modal-body");
    if (body) body.innerHTML = "";
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    state.media.open = false;
    if (state.media.trigger && state.media.trigger.focus) {
      try { state.media.trigger.focus(); } catch (e) {}
    }
    state.media.trigger = null;
  }

  // ---------- language / mode ----------
  function revealAfterRerender() {
    /* Les listes dynamiques (problèmes, piliers, filières, couches…) sont
       recréées au changement de langue : elles perdent .is-in et resteraient
       invisibles (.reveal { opacity: 0 }) car l'IntersectionObserver ne les
       connaît pas. On les révèle directement après le re-render. */
    $$(".reveal:not(.is-in)").forEach(function (el) { el.classList.add("is-in"); });
  }
  function setLang(lang) {
    if (state.media.open) closeMedia();
    state.lang = lang === "zh" ? "zh" : "fr";
    localStorage.setItem("rimu-lang", state.lang);
    state.phoneCaption = "";
    applyI18n();
    renderChapterRail();
    renderFooter();
    renderStaticLists();
    revealAfterRerender();
    renderDrawerIfOpen();
    if (state.pitch.open) renderPitch();
    if (window.RIMU_VIZ && RIMU_VIZ.updateLang) { try { RIMU_VIZ.updateLang(); } catch (e) {} }
  }
  function renderDrawerIfOpen() { if (state.drawer.open) renderDrawer(); }
  function toggleMode() {
    state.mode = state.mode === "synthese" ? "complet" : "synthese";
    applyMode();
  }

  // ---------- hash routing ----------
  var SLUG = {};
  (D.pillars || []).forEach(function (p) { SLUG["pillar/" + p.id.replace(/^p\./, "")] = p.id; });
  (D.businessLines || []).forEach(function (b) { SLUG["business/" + b.id.replace(/^b\./, "")] = b.id; });
  (D.layers || []).forEach(function (l) { SLUG["layer/" + l.id.replace(/^layer\./, "")] = l.id; });
  function parseHash() {
    var h = location.hash || "";
    if (h.indexOf("#/") !== 0) { if (state.drawer.open) closeDrawer(true); return; }
    var parts = h.slice(2).split("/");
    var key = parts[0] + "/" + (parts[1] || "");
    var id = SLUG[key];
    if (id) {
      openEntity(id, parts[2] || "apercu", { fromHistory: true });
    } else if (parts[0] === "business" && parts[1] === "rimu") {
      openEntity("p.rimu", "apercu", { fromHistory: true });
    } else if (state.drawer.open) {
      closeDrawer(true);
    }
  }

  // ---------- events ----------
  function setupEvents() {
    // language / mode / pitch / presenter / pdf / menu
    $("#btn-lang").addEventListener("click", function () { setLang(state.lang === "fr" ? "zh" : "fr"); });
    $("#btn-mode").addEventListener("click", toggleMode);
    $("#btn-pitch").addEventListener("click", startPitch);
    $("#btn-pitch-hero").addEventListener("click", startPitch);
    $("#btn-present").addEventListener("click", function () { togglePresenter(); });
    $("#btn-menu").addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      $("#btn-menu").setAttribute("aria-expanded", open ? "true" : "false");
    });
    $("#btn-pdf").addEventListener("click", function (e) { e.preventDefault(); window.open("dossier.html" + (state.lang === "zh" ? "?lang=zh" : ""), "_blank"); });

    // film & démo modal
    document.addEventListener("click", function (e) {
      var mediaTrigger = e.target.closest("[data-media]");
      if (mediaTrigger) { e.preventDefault(); openMedia(mediaTrigger.getAttribute("data-media"), mediaTrigger); return; }
      var mediaClose = e.target.closest("[data-media-close]");
      if (mediaClose) { e.preventDefault(); closeMedia(); return; }
    });

    // chapter navigation (rail, footer, any data-chapter)
    document.addEventListener("click", function (e) {
      var chap = e.target.closest("[data-chapter]");
      if (chap && !chap.classList.contains("chapter")) { e.preventDefault(); scrollToChapter(Number(chap.getAttribute("data-chapter"))); document.body.classList.remove("menu-open"); return; }
      var jump = e.target.closest("[data-jump]");
      if (jump) { e.preventDefault(); scrollToSelector(jump.getAttribute("data-jump")); return; }
      var ent = e.target.closest("[data-entity]");
      if (ent) { e.preventDefault(); openEntity(ent.getAttribute("data-entity"), "apercu"); return; }
      var meth = e.target.closest("[data-methodo]");
      if (meth) { e.preventDefault(); openMethodo(); return; }
      var closeModal = e.target.closest("[data-close-modal]");
      if (closeModal) { closeMethodo(); return; }
      var drawerTab = e.target.closest("[data-drawer-tab]");
      if (drawerTab) { state.drawer.tab = drawerTab.getAttribute("data-drawer-tab"); renderDrawerBody(); var url = routeForEntity(findEntity(state.drawer.entityId).type, state.drawer.entityId, state.drawer.tab); history.replaceState({ drawer: state.drawer.entityId }, "", url); return; }
      var hudBtn = e.target.closest("[data-hud]");
      if (hudBtn && window.RIMU_VIZ) {
        var hudAct = hudBtn.getAttribute("data-hud");
        if (hudAct === "pause" && RIMU_VIZ.pauseStory) RIMU_VIZ.pauseStory();
        else if (hudAct === "replay" && RIMU_VIZ.playStory) RIMU_VIZ.playStory((state.flowStory && state.flowStory.id) || "capital");
        else if (hudAct === "close" && RIMU_VIZ.stopStory) RIMU_VIZ.stopStory();
        return;
      }
      var flow = e.target.closest("[data-flow]");
      if (flow) {
        var on = flow.classList.toggle("is-on");
        flow.setAttribute("aria-pressed", on ? "true" : "false");
        if (window.RIMU_VIZ && RIMU_VIZ.setFlowFilter) {
          var active = $$("#flow-legend .flow-check.is-on").map(function (b) { return b.getAttribute("data-flow"); });
          try { RIMU_VIZ.setFlowFilter(active); } catch (err) {}
        }
        return;
      }
      var fa = e.target.closest("[data-flow-action]");
      if (fa && window.RIMU_VIZ) {
        var act = fa.getAttribute("data-flow-action");
        if (act === "reset" && RIMU_VIZ.resetFilters) { try { RIMU_VIZ.resetFilters(); } catch (err) {} }
        if (act === "isolate" && RIMU_VIZ.isolateSelection) { try { RIMU_VIZ.isolateSelection(); } catch (err) {} }
        return;
      }
      var fv = e.target.closest("[data-flow-view]");
      if (fv && window.RIMU_VIZ && RIMU_VIZ.setView) {
        var viewId = fv.getAttribute("data-flow-view");
        $$("#flow-controls [data-flow-view]").forEach(function (b) { b.classList.toggle("is-active", b === fv); });
        try { RIMU_VIZ.setView(viewId); } catch (err) {}
        return;
      }
      var story = e.target.closest("[data-story]");
      if (story) {
        $$("#story-chips .story-chip").forEach(function (b) { b.classList.remove("is-active"); });
        story.classList.add("is-active");
        if (window.RIMU_VIZ && RIMU_VIZ.playStory) { try { RIMU_VIZ.playStory(story.getAttribute("data-story")); } catch (err) {} }
        setTimeout(function () { if (state.flowStory && state.flowStory.id) scrollStoryIntoView(); }, 420);
        return;
      }
      var ai = e.target.closest("[data-ai]");
      if (ai) { state.aiGroup = Number(ai.getAttribute("data-ai")); $$("#ai-tabs .ai-tab").forEach(function (b, i) { b.classList.toggle("is-active", i === state.aiGroup); }); renderAIPanel(); return; }
      var win = e.target.closest("[data-win]");
      if (win) { var tabs = tc("impact.tabs", []); state.winTab = Math.max(0, tabs.map(function (x) { return x.id; }).indexOf(win.getAttribute("data-win"))); $$("#win-tabs .win-tab").forEach(function (b, i) { b.classList.toggle("is-active", i === state.winTab); }); renderWinPanel(); return; }
      var track = e.target.closest("[data-track]");
      if (track) { state.track = track.getAttribute("data-track"); state.milestone = null; $$("#track-tabs .track-tab").forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-track") === state.track); }); renderTimeline(); return; }
      var ms = e.target.closest("[data-ms]");
      if (ms) { state.milestone = ms.getAttribute("data-ms"); $$("#timeline .timeline-milestone").forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-ms") === state.milestone); }); renderMilestoneDetail(); return; }
      var day = e.target.closest("[data-day]");
      if (day) {
        var scenes = tc("rimu.day", []);
        var idx = Number(day.getAttribute("data-day"));
        var sc = scenes[idx];
        $$("#day-timeline .day-step").forEach(function (b) { b.classList.toggle("is-active", b === day); });
        if (sc) { showPhoneSlide(DAY_SLIDE[sc.screen] === undefined ? 0 : DAY_SLIDE[sc.screen], { fromUser: true, caption: sc.body || "" }); }
        return;
      }
      var dot = e.target.closest("[data-phone-dot]");
      if (dot) { showPhoneSlide(Number(dot.getAttribute("data-phone-dot")), { fromUser: true }); return; }
      var module = e.target.closest("[data-module]");
      if (module) {
        var mid = module.getAttribute("data-module");
        $$("#module-chips .module-chip").forEach(function (b) { b.classList.toggle("is-active", b === module); });
        showPhoneSlide(MODULE_SLIDE[mid] || 0, { fromUser: true, caption: (function () { var mods = tc("rimu.modules", []); var mod = mods.filter(function (m) { return m.id === mid; })[0]; return mod ? (mod.body || mod.title || "") : ""; })() });
        return;
      }
      var support = e.target.closest(".support-head");
      if (support) { var row = support.closest(".support-row"); var open = row.classList.toggle("is-open"); support.setAttribute("aria-expanded", open ? "true" : "false"); return; }
      var risk = e.target.closest(".risk-title");
      if (risk) { var card = risk.closest(".risk-card"); var openR = card.classList.toggle("is-open"); risk.setAttribute("aria-expanded", openR ? "true" : "false"); return; }
      var cta = e.target.closest("[data-cta]");
      if (cta) {
        var id = cta.getAttribute("data-cta");
        if (id === "investisseurs") { window.open("dossier.html" + (state.lang === "zh" ? "?lang=zh" : ""), "_blank"); }
        else { scrollToSelector("#contact"); }
        return;
      }
      var pitchAction = e.target.closest("[data-pitch-action]");
      if (pitchAction) {
        var act2 = pitchAction.getAttribute("data-pitch-action");
        if (act2 === "prev") nextPitch(-1);
        else if (act2 === "next") nextPitch(1);
        else if (act2 === "toggle") togglePitch();
        else if (act2 === "exit") exitPitch();
        return;
      }
    });

    // close drawer / pitch
    $("#drawer-close").addEventListener("click", function () { closeDrawer(); });
    $("#drawer-overlay").addEventListener("click", function () { closeDrawer(); });
    $("#drawer-share").addEventListener("click", function () {
      var url = location.href;
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { showToast(x("copied")); }, function () { showToast(url); });
      else showToast(url);
    });
    $("#drawer-connections").addEventListener("click", function () { closeDrawer(); scrollToChapter(5); });
    $("#drawer-roadmap").addEventListener("click", function () {
      var ent = findEntity(state.drawer.entityId);
      var trackId = ent ? trackForEntity(ent.type, ent.data) : "track.bilateral";
      closeDrawer(); state.track = trackId; state.milestone = null;
      setTimeout(function () { scrollToChapter(6); renderTrajectoire(); }, 260);
    });
    $("#pitch-close").addEventListener("click", exitPitch);
    $("#phone-toggle").addEventListener("click", function () {
      state.phonePaused = !state.phonePaused;
      updatePhoneUI();
    });
    $("#phone-prev").addEventListener("click", function () { state.phonePaused = true; showPhoneSlide(state.phoneIndex - 1, { fromUser: true }); });
    $("#phone-next").addEventListener("click", function () { state.phonePaused = true; showPhoneSlide(state.phoneIndex + 1, { fromUser: true }); });
    $("#phone").addEventListener("mouseenter", function () { state.phoneHover = true; });
    $("#phone").addEventListener("mouseleave", function () { state.phoneHover = false; });
    var phoneScreen = $("#phone-screen");
    if (phoneScreen) {
      var swipeX = null;
      phoneScreen.addEventListener("pointerdown", function (e) { swipeX = e.clientX; });
      phoneScreen.addEventListener("pointerup", function (e) {
        if (swipeX === null) return;
        var dx = e.clientX - swipeX;
        swipeX = null;
        if (Math.abs(dx) > 36) { state.phonePaused = true; showPhoneSlide(state.phoneIndex + (dx < 0 ? 1 : -1), { fromUser: true }); }
      });
      phoneScreen.addEventListener("pointercancel", function () { swipeX = null; });
      phoneScreen.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); state.phonePaused = true; showPhoneSlide(state.phoneIndex + 1, { fromUser: true }); }
        if (e.key === "ArrowLeft") { e.preventDefault(); state.phonePaused = true; showPhoneSlide(state.phoneIndex - 1, { fromUser: true }); }
      });
    }
    $("#presenter-prev").addEventListener("click", function () { scrollToChapter(Math.max(0, state.chapter - 1)); });
    $("#presenter-next").addEventListener("click", function () { scrollToChapter(Math.min(CHAPTERS.length - 1, state.chapter + 1)); });
    $("#presenter-black").addEventListener("click", function () { state.presenter.black = !state.presenter.black; document.body.classList.toggle("presenter-black", state.presenter.black); });
    $("#presenter-exit").addEventListener("click", function () { togglePresenter(false); });
    window.addEventListener("hashchange", parseHash);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeydown);
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      if (state.media.open) { closeMedia(); return; }
      if (state.presenter.black) { state.presenter.black = false; document.body.classList.remove("presenter-black"); return; }
      if ($("#methodo-root").classList.contains("is-open")) { closeMethodo(); return; }
      if (state.pitch.open) { exitPitch(); return; }
      if (state.drawer.open) { closeDrawer(); return; }
      if (state.presenter.on) { togglePresenter(false); return; }
    }
    if (state.pitch.open) {
      if (e.key === " ") { e.preventDefault(); togglePitch(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); nextPitch(1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); nextPitch(-1); return; }
    }
    if (state.presenter.on && !state.presenter.black) {
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToChapter(Math.min(CHAPTERS.length - 1, state.chapter + 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollToChapter(Math.max(0, state.chapter - 1)); }
      if (e.key === "b" || e.key === "B") { state.presenter.black = !state.presenter.black; document.body.classList.toggle("presenter-black", state.presenter.black); }
    }
    if (state.media.open && e.key === "Tab") {
      var mediaDialog = $(".media-dialog");
      if (!mediaDialog) return;
      var mFocus = $$('button, [href], video, iframe, [tabindex]:not([tabindex="-1"])', mediaDialog).filter(function (el) { return el.offsetParent !== null; });
      if (!mFocus.length) return;
      var mFirst = mFocus[0], mLast = mFocus[mFocus.length - 1];
      if (e.shiftKey && document.activeElement === mFirst) { e.preventDefault(); mLast.focus(); }
      else if (!e.shiftKey && document.activeElement === mLast) { e.preventDefault(); mFirst.focus(); }
    }
    if (state.drawer.open && e.key === "Tab") {
      var drawer = $("#drawer");
      var focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  // ---------- scroll spy ----------
  function setupObservers() {
    var sections = $$("main .chapter");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var idx = sections.indexOf(en.target);
            if (idx >= 0 && idx !== state.chapter) { state.chapter = idx; updateRail(idx); if (state.presenter.on) updatePresenterChapter(); }
          }
        });
      }, { rootMargin: "-42% 0px -50% 0px", threshold: 0 });
      sections.forEach(function (s) { io.observe(s); });
      var reveals = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); reveals.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      $$(".reveal").forEach(function (el) { reveals.observe(el); });
    } else {
      $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    }
    updateRail(0);
    onScroll();
  }

  // ---------- init ----------
  function init() {
    if (state.lang !== "fr") document.documentElement.lang = state.lang;
    applyMode();
    applyI18n();
    renderChapterRail();
    renderFooter();
    renderStaticLists();
    setupEvents();
    setupObservers();
    startPhoneAuto();
    if (new URLSearchParams(location.search).get("lite") === "1" || (navigator.connection && navigator.connection.saveData)) {
      document.documentElement.classList.add("lite");
    }
    if (window.RIMU_VIZ && RIMU_VIZ.init) { try { RIMU_VIZ.init(); } catch (e) { console.warn("viz init failed", e); } }
    parseHash();
    if (new URLSearchParams(location.search).get("tour") === "1") setTimeout(startPitch, 500);
    if (new URLSearchParams(location.search).get("present") === "1") setTimeout(function () { togglePresenter(true); }, 300);
  }

  window.APP = {
    get lang() { return state.lang; },
    get mode() { return state.mode; },
    get data() { return D; },
    t: t,
    openEntity: openEntity,
    closeDrawer: closeDrawer,
    scrollToChapter: scrollToChapter,
    setStoryCaption: function (html) {
      var cap = $("#story-caption"); if (cap) cap.innerHTML = html;
      var hudCap = $("#flow-story-hud-caption"); if (hudCap) hudCap.innerHTML = html;
    },
    onFlowStoryState: onFlowStoryState,
    openMethodo: openMethodo,
    showToast: showToast,
    kpi: kpi,
    kpiDisplay: kpiDisplay,
    getState: function () { return state; }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
