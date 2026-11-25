(function () {
  "use strict";

  var state = {
    lang: (function () {
      var migrationKey = "rimu-lang-default-fr-v1";
      var stored = localStorage.getItem("cinema-lang");
      var main = localStorage.getItem("rimu-lang");
      if (!localStorage.getItem(migrationKey)) {
        localStorage.setItem(migrationKey, "1");
        localStorage.setItem("rimu-lang", "fr");
        localStorage.setItem("cinema-lang", "fr");
        return "fr";
      }
      if (stored === "zh" || stored === "fr") return stored;
      return main === "zh" ? "zh" : "fr";
    })(),
    active: 0,
    ready: false,
    modele: { index: 0, timer: null, paused: false, reduced: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches }
  };
  if (state.lang !== "fr" && state.lang !== "zh") state.lang = "fr";
  var MODELE_VIDEOS = [
    "assets/video/cinema/capital.mp4",
    "assets/video/cinema/port.mp4",
    "assets/video/cinema/showroom.mp4",
    "assets/video/cinema/payment.mp4"
  ];
  var MODELE_POSTERS = [
    "assets/img/cinema/capital.jpg",
    "assets/img/cinema/port.jpg",
    "assets/img/cinema/showroom.jpg",
    "assets/img/cinema/payment.jpg"
  ];


  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function icon(name) {
    var paths = window.RIMU_ICON_PATHS || {};
    var p = paths[name];
    if (!p) return "";
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + "</svg>";
  }
  function L(obj) { return obj[state.lang] || obj.fr; }

  var COPY = {
    fr: {
      ui: { lang: "中文", site: "Site complet", pdf: "Dossier PDF", scroll: "Défiler" },
      rail: ["Ouverture", "Constat", "Système", "Le modèle", "RIMU", "Socle", "2031", "Décision"],
      hero: {
        kicker: "NOUAKCHOTT · 2026–2031 · CHINE — MAURITANIE",
        title1: "Deux pays",
        title2: "Une plateforme",
        sub: "Un canal officiel, une super-application, un socle de calcul souverain. Une même architecture pour relier la Chine et l'Afrique de l'Ouest.",
        cta: "Entrer dans le récit",
        site: "Voir le site complet",
        net: { china: "Chine", mauritania: "Mauritanie", hub: "Nouakchott", africa: "Afrique de l'Ouest" },
        stats: [
          { value: "2,5 M", label: "utilisateurs actifs mensuels · 2031" },
          { value: "150–220 M", label: "USD de revenus annuels · 2031" },
          { value: "30–40 k", label: "emplois directs et écosystème · 5 ans" }
        ]
      },
      constat: {
        kicker: "01 · LE CONSTAT",
        title1: "Quatre blocages",
        title2: "Une réponse système",
        lead: "Le problème n'est pas le manque de projets. C'est l'absence d'un système qui relie les flux, les règles et les usages.",
        line: "La réponse n'est pas un site de plus. C'est un système.",
        beforeLabel: "Aujourd'hui",
        beforeValue: "< 20 %",
        beforeDesc: "comptes numériques adultes",
        afterLabel: "Avec la plateforme · 2031",
        afterValue: "≈ 50 %",
        afterDesc: "comptes numériques adultes"
      },
      systeme: {
        kicker: "02 · L'ARCHITECTURE",
        title1: "Trois piliers",
        title2: "Six filières, quatre couches",
        lead: "Un seul système, pas une somme de projets : une porte d'entrée bilatérale, une super-application, un socle de calcul souverain.",
        line: "Tout se tient. Tout se relie."
      },
        modele: {
        kicker: "03 · LE MODÈLE VIVANT",
        lead: "Quatre scènes pour voir comment le système tourne.",
        tabs: ["Capital", "Marchandises", "Showroom", "Paiements"],
        pause: "Pause",
        resume: "Reprendre",
        replay: "Rejouer",
        revKicker: "REVENUS 2031 · CAISSE COMMUNE",
        revTotal: "TOTAL",
        revTotalVal: "150–220 M USD",
        slides: [
          {
            no: "01 / 04", kicker: "CAPITAL", title1: "Le capital entre", title2: "dans le système",
            lead: "Des investisseurs aux projets, des projets aux emplois : la première boucle finance la capacité du pays.",
            tag: "CAPITAL", img: "../img/cinema/capital.jpg", pos: "center 46%",
            metrics: [
              { v: "800 M–1,2 Md", l: "USD d'intentions d'investissement" },
              { v: "5–8", l: "projets en phase substantielle" },
              { v: "30–40 k", l: "emplois directs + écosystème · 5 ans" }
            ],
            nodes: [
              { x: 7, t: "CHINE", b: "Investisseurs" },
              { x: 32, t: "PLATEFORME", b: "Projets bancables" },
              { x: 58, t: "MAURITANIE", b: "Chantiers · emplois" },
              { x: 84, t: "RETOUR", b: "Capacité · réinvestissement" }
            ]
          },
          {
            no: "02 / 04", kicker: "MARCHANDISES", title1: "Du navire", title2: "au camion",
            lead: "Le port de Nouakchott devient le hub : conteneurs, douane, camions, circulation vers le showroom et la sous-région.",
            tag: "MARCHANDISES", img: "../img/cinema/port.jpg", pos: "center 48%",
            metrics: [
              { v: "800 M–2 Md", l: "USD/an de biens transitent par le pays" },
              { v: "5 pays", l: "marchés desservis depuis le hub" },
              { v: "1 hub", l: "Nouakchott · stockage · répartition" }
            ],
            nodes: [
              { x: 7, t: "CARGOS", b: "Conteneurs" },
              { x: 32, t: "PORT", b: "Douane · déchargement" },
              { x: 58, t: "CAMIONS", b: "Hub Nouakchott" },
              { x: 84, t: "AFRIQUE DE L'OUEST", b: "Acheteurs" }
            ]
          },
          {
            no: "03 / 04", kicker: "SHOWROOM · RIMU", title1: "On voit", title2: "On commande",
            lead: "Un showroom physique et une boutique dans la poche : produits, prix, vendeurs, commande — le même parcours.",
            tag: "SHOWROOM · RIMU", img: "../img/cinema/showroom.jpg", pos: "center 46%",
            phone: "assets/img/rimu/02-marche.webp", price: "PRODUITS · PRIX · VENDEUR", coin: "RIMP · paiement",
            metrics: [
              { v: "15–60 s", l: "vidéos courtes · formats légers" },
              { v: "FR · AR · EN", l: "langues au lancement" },
              { v: "Live · Shop · Jobs", l: "un seul compte" }
            ],
            nodes: [
              { x: 7, t: "ACHETEUR", b: "Voit · compare" },
              { x: 32, t: "SHOWROOM", b: "Vendeur · produits" },
              { x: 58, t: "RIMU", b: "Commande · mobile" },
              { x: 84, t: "RIMP", b: "Paiement" }
            ]
          },
          {
            no: "04 / 04", kicker: "PAIEMENTS · REVENUS", title1: "L'argent revient", title2: "dans le circuit",
            lead: "Chaque commande, contenu et paiement alimente un même registre : les revenus restent en ouguiyas et financent la suite.",
            tag: "PAIEMENTS · REVENUS", img: "../img/cinema/payment.jpg", pos: "center 42%",
            metrics: [
              { v: "2,5 M", l: "utilisateurs actifs mensuels · 2031" },
              { v: "2,8 M", l: "comptes RIMP" },
              { v: "40 min/j", l: "temps passé quotidien" }
            ],
            nodes: [
              { x: 7, t: "CRÉATEURS", b: "Contenus · audience" },
              { x: 32, t: "COMMERÇANTS", b: "Ventes · commandes" },
              { x: 58, t: "RIMP", b: "Paiements" },
              { x: 84, t: "CAISSE COMMUNE", b: "Revenus · réinvestissement" }
            ],
            revenue: [
              { n: "RIMU · contenus", v: "30–50 M" },
              { n: "RIMP · paiements", v: "90–140 M" },
              { n: "Calcul · IA", v: "30–40 M" }
            ]
          }
        ]
      },
    rimu: {
        kicker: "04 · LE QUOTIDIEN",
        title1: "Une journée",
        title2: "Une application",
        lead: "Contenus, biens, emplois et services publics : RIMU relie les usages du quotidien dans une seule expérience.",
        line: "Le système d'exploitation du quotidien.",
        facts: [
          { value: "FR · AR · EN", label: "langues au lancement" },
          { value: "15–60 s", label: "vidéos courtes et formats légers" },
          { value: "Live · Shop · Jobs", label: "un seul compte" }
        ]
      },
      ia: {
        kicker: "05 · LE SOCLE",
        title1: "Les données",
        title2: "Restent au pays",
        lead: "Quatre couches, trois phases, une règle : les données, les modèles et le grand livre restent sur le territoire national.",
        statement1: "Une règle.",
        statement2: "Les données et les modèles restent au pays.",
        phases: [
          { year: "2026", name: "Inférence et modération", fig: "18 mois · ≈ 1 MW" },
          { year: "2027–29", name: "Entraînement / inférence", fig: "36 mois · ≈ 2–3 MW" },
          { year: "2030–31", name: "Extension modulaire", fig: "≈ 2–3 MW" }
        ],
        stats: [
          { value: "≈ 100", label: "cartes accélératrices · phase 1" },
          { value: "≈ 1 MW", label: "puissance · phase 1" },
          { value: "30–40 M", label: "USD de revenus calcul · 2031" }
        ]
      },
      impact: {
        kicker: "06 · 2031",
        title1: "Ce que cela",
        title2: "change",
        lead: "Un scénario ambitieux, tracé de bout en bout : utilisateurs, revenus, comptes, emplois. Chaque chiffre a une source ou une hypothèse.",
        line: "De point de transit à hub de services.",
        hub: { name: "Nouakchott", sub: "hub ouest-africain" },
        note: "Scénario ambitieux · chiffres non contractuels · méthodologie disponible sur le site complet."
      },
      decision: {
        kicker: "07 · LA DÉCISION",
        title1: "Cinq décisions",
        title2: "Un canal",
        lead: "Sans avance budgétaire importante et sans confirmer des montants déjà conclus : cinq points à clarifier en même temps.",
        line: "Ouvrir le canal, maintenant.",
        contact: "AUREON DIGITAL · Nouakchott, Mauritanie",
        email: "contact@aureondigital.mr"
      }
    },
    zh: {
      ui: { lang: "FR", site: "完整网站", pdf: "方案册 PDF", scroll: "滚动" },
      rail: ["开篇", "现状", "系统", "业务模型", "RIMU", "底座", "2031", "决策"],
      hero: {
        kicker: "努瓦克肖特 · 2026–2031 · 中国 — 毛里塔尼亚",
        title1: "两国",
        title2: "一个平台",
        sub: "一条官方通道、一个超级应用、一座主权算力底座。用同一套架构连接中国与西非。",
        cta: "进入叙事",
        site: "打开完整网站",
        net: { china: "中国", mauritania: "毛里塔尼亚", hub: "努瓦克肖特", africa: "西非" },
        stats: [
          { value: "250 万", label: "2031 年月活用户" },
          { value: "1.5–2.2 亿", label: "2031 年美元年收入" },
          { value: "3–4 万", label: "5 年直接与生态就业" }
        ]
      },
      constat: {
        kicker: "01 · 现状",
        title1: "四道堵点",
        title2: "一个系统性答案",
        lead: "问题不是缺少项目，而是缺少一套把流、规则与使用连接起来的系统。",
        line: "答案不是多一个网站，而是一套系统。",
        beforeLabel: "今天",
        beforeValue: "不足 20%",
        beforeDesc: "成年人数字账户",
        afterLabel: "平台建成后 · 2031",
        afterValue: "约 50%",
        afterDesc: "成年人数字账户"
      },
      systeme: {
        kicker: "02 · 架构",
        title1: "三支柱",
        title2: "六业务线，四层",
        lead: "一套系统，而非项目拼盘：双边入口、超级应用、主权算力底座。",
        line: "彼此相连，才成系统。"
      },
        modele: {
        kicker: "03 · 业务模型",
        lead: "四个子场景，看懂系统如何运转。",
        tabs: ["资本", "货物", "展厅", "支付"],
        pause: "暂停",
        resume: "继续",
        replay: "重播",
        revKicker: "2031 年收入 · 共同账本",
        revTotal: "合计",
        revTotalVal: "1.5–2.2 亿美元",
        slides: [
          {
            no: "01 / 04", kicker: "资本", title1: "资本进入", title2: "系统",
            lead: "从投资人到项目，从项目到就业：第一条回路为国家的产能融资。",
            tag: "资本", img: "../img/cinema/capital.jpg", pos: "center 46%",
            metrics: [
              { v: "8–12 亿", l: "美元投资意向" },
              { v: "5–8", l: "实质性推进项目" },
              { v: "3–4 万", l: "5 年直接与生态就业" }
            ],
            nodes: [
              { x: 7, t: "中国", b: "投资人" },
              { x: 32, t: "平台", b: "可融资项目" },
              { x: 58, t: "毛里塔尼亚", b: "工地 · 就业" },
              { x: 84, t: "回报", b: "产能 · 再投资" }
            ]
          },
          {
            no: "02 / 04", kicker: "货物", title1: "从货轮", title2: "到卡车",
            lead: "努瓦克肖特港成为枢纽：集装箱、清关、卡车，向展厅与次区域分拨。",
            tag: "货物", img: "../img/cinema/port.jpg", pos: "center 48%",
            metrics: [
              { v: "8–20 亿", l: "美元/年货物经本国中转" },
              { v: "5 国", l: "从枢纽覆盖的市场" },
              { v: "1 个枢纽", l: "努瓦克肖特 · 仓储 · 分拨" }
            ],
            nodes: [
              { x: 7, t: "货轮", b: "集装箱" },
              { x: 32, t: "港口", b: "清关 · 卸货" },
              { x: 58, t: "卡车", b: "努瓦克肖特枢纽" },
              { x: 84, t: "西非", b: "买家" }
            ]
          },
          {
            no: "03 / 04", kicker: "展厅 · RIMU", title1: "看见", title2: "下单",
            lead: "线下展厅 + 口袋里的商店：商品、价格、卖家、下单，同一个路径。",
            tag: "展厅 · RIMU", img: "../img/cinema/showroom.jpg", pos: "center 46%",
            phone: "assets/img/rimu/02-marche.webp", price: "商品 · 价格 · 卖家", coin: "RIMP · 支付",
            metrics: [
              { v: "15–60 秒", l: "短视频 · 轻量格式" },
              { v: "法 · 阿 · 英", l: "首批上线语言" },
              { v: "直播 · 商城 · 招聘", l: "一个账户" }
            ],
            nodes: [
              { x: 7, t: "买家", b: "看 · 比较" },
              { x: 32, t: "展厅", b: "卖家 · 商品" },
              { x: 58, t: "RIMU", b: "下单 · 手机" },
              { x: 84, t: "RIMP", b: "支付" }
            ]
          },
          {
            no: "04 / 04", kicker: "支付 · 收入", title1: "资金回到", title2: "回路",
            lead: "每笔订单、内容与支付都进入同一本账：收入以乌吉亚留在本国，继续支持下一步。",
            tag: "支付 · 收入", img: "../img/cinema/payment.jpg", pos: "center 42%",
            metrics: [
              { v: "250 万", l: "2031 年月活用户" },
              { v: "280 万", l: "RIMP 账户" },
              { v: "40 分钟/日", l: "日均使用时长" }
            ],
            nodes: [
              { x: 7, t: "创作者", b: "内容 · 受众" },
              { x: 32, t: "商家", b: "销售 · 订单" },
              { x: 58, t: "RIMP", b: "支付" },
              { x: 84, t: "共同账本", b: "收入 · 再投资" }
            ],
            revenue: [
              { n: "RIMU · 内容", v: "0.3–0.5 亿" },
              { n: "RIMP · 支付", v: "0.9–1.4 亿" },
              { n: "算力 · AI", v: "0.3–0.4 亿" }
            ]
          }
        ]
      },
    rimu: {
        kicker: "04 · 日常",
        title1: "一天",
        title2: "一个应用",
        lead: "内容、商品、就业与公共服务：RIMU 把日常使用装进同一个体验。",
        line: "日常生活的操作系统。",
        facts: [
          { value: "法 · 阿 · 英", label: "首批上线语言" },
          { value: "15–60 秒", label: "短视频与轻量格式" },
          { value: "直播 · 商城 · 招聘", label: "一个账户" }
        ]
      },
      ia: {
        kicker: "05 · 底座",
        title1: "数据与模型",
        title2: "留在本国",
        lead: "四层、三期、一条规则：数据、模型与总账留在本国领土。",
        statement1: "一条规则。",
        statement2: "数据与模型，留在本国。",
        phases: [
          { year: "2026", name: "推理与审核", fig: "18 个月 · 约 1 MW" },
          { year: "2027–29", name: "训练 / 推理", fig: "36 个月 · 约 2–3 MW" },
          { year: "2030–31", name: "模块化扩展", fig: "约 2–3 MW" }
        ],
        stats: [
          { value: "约 100", label: "一期加速卡" },
          { value: "约 1 MW", label: "一期功率" },
          { value: "0.3–0.4 亿", label: "2031 年算力收入（美元）" }
        ]
      },
      impact: {
        kicker: "06 · 2031",
        title1: "这意味着",
        title2: "什么",
        lead: "一个可追溯的雄心情景：用户、收入、账户、就业。每个数字都有来源或假设。",
        line: "从过境点，到服务与分销枢纽。",
        hub: { name: "努瓦克肖特", sub: "西非枢纽" },
        note: "雄心情景 · 数字非合同承诺 · 完整方法学见网站。"
      },
      decision: {
        kicker: "07 · 决策",
        title1: "五项决策",
        title2: "一条通道",
        lead: "不需要大额预算前置，也不确认任何已谈定金额：五个问题，同时明确。",
        line: "现在，打开通道。",
        contact: "AUREON DIGITAL · 毛里塔尼亚 努瓦克肖特",
        email: "contact@aureondigital.mr"
      }
    }
  };

  function t(key) {
    var parts = key.split(".");
    var node = COPY[state.lang];
    var fallback = COPY.fr;
    var i;
    for (i = 0; i < parts.length; i++) {
      node = node && node[parts[i]];
      fallback = fallback && fallback[parts[i]];
    }
    return node != null ? node : fallback;
  }

  var PROBLEMS = [
    { icon: "attention", value: "0", fr: { label: "règle nationale sur la recommandation", text: "Le temps d'écran des jeunes s'exporte, sans règle nationale." }, zh: { label: "国家推荐规则", text: "年轻人的屏幕时间在外流，本国没有规则。" } },
    { icon: "cash", value: "< 20 %", fr: { label: "comptes numériques adultes", text: "Le cash circule hors circuit et reste difficile à auditer." }, zh: { label: "成年人数字账户", text: "现金在账外循环，难以审计。" } },
    { icon: "data", value: "0", fr: { label: "modèle central hébergé au pays", text: "Données, modèles et modération sont hébergés à l'étranger." }, zh: { label: "境内核心模型", text: "数据、模型与审核都托管在境外。" } },
    { icon: "export", value: "1", fr: { label: "prix porte la croissance (4,5 %)", text: "Minerais et captures non transformées portent les recettes." }, zh: { label: "单一价格支撑增长（4.5%）", text: "原矿与未加工渔获撑起收入。" } }
  ];

  var PILLARS = [
    { icon: "entry", fr: "Plateforme bilatérale", zh: "双边合作平台", frV: "5–8 projets", zhV: "5–8 个项目" },
    { icon: "rimu", fr: "RIMU", zh: "RIMU", frV: "2,5 M d'utilisateurs", zhV: "250 万用户" },
    { icon: "compute", fr: "Calcul IA", zh: "AI 算力中心", frV: "≈ 100 cartes", zhV: "约 100 张加速卡" }
  ];

  var BUSINESSES = [
    { icon: "projects", fr: "Projets & investissements", zh: "项目与投资", frV: "5–8 projets", zhV: "5–8 个项目" },
    { icon: "trade", fr: "Commerce de gros", zh: "批发贸易", frV: "300–800 M USD", zhV: "3–8 亿美元" },
    { icon: "consumer", fr: "Biens de consommation", zh: "消费品与枢纽", frV: "80–150 M USD", zhV: "0.8–1.5 亿美元" },
    { icon: "finance", fr: "Finance & RIMP", zh: "金融与 RIMP", frV: "2,8 M comptes", zhV: "280 万账户" },
    { icon: "training", fr: "Formation & talents", zh: "培训与人才", frV: "1 000–3 000", zhV: "1000–3000 人" },
    { icon: "health", fr: "Santé & télémédecine", zh: "卫生与远程医疗", frV: "8–15 points", zhV: "8–15 个点" }
  ];

  var LAYERS = [
    { icon: "experience", fr: "Couche expérience", zh: "体验层", frK: "RIMU · Web léger · Faible bande passante", zhK: "RIMU · 轻量网页 · 低带宽" },
    { icon: "middleware", fr: "Couche middleware", zh: "中间件层", frK: "Identité · Contenu · Paiement RIMP", zhK: "身份 · 内容 · RIMP 支付" },
    { icon: "intelligence", fr: "Couche intelligente", zh: "智能层", frK: "Recommandation · Modération · Transcription", zhK: "推荐 · 审核 · 转写" },
    { icon: "infrastructure", fr: "Couche infrastructure", zh: "基础设施层", frK: "Tier III · GPU · Électricité verte", zhK: "Tier III · GPU · 绿电" }
  ];

  var PHONES = [
    { src: "assets/img/rimu/01-pour-toi.webp", fr: "Le fil", frT: "Vidéos courtes et lives", zh: "信息流", zhT: "短视频与直播" },
    { src: "assets/img/rimu/03-produit.webp", fr: "Le produit", frT: "Voir, choisir, commander", zh: "商品详情", zhT: "查看、选择、下单" },
    { src: "assets/img/rimu/02-marche.webp", fr: "Le marché", frT: "Acheter, vendre, payer", zh: "市场", zhT: "买卖与支付" }
  ];

  var IMPACT = [
    { fr: "2,5 M", zh: "250 万", frL: "utilisateurs actifs mensuels · 2031", zhL: "2031 年月活用户" },
    { fr: "150–220 M", zh: "1.5–2.2 亿", frL: "USD de revenus annuels · 2031", zhL: "2031 年美元年收入" },
    { fr: "2,8 M", zh: "280 万", frL: "comptes RIMP", zhL: "RIMP 账户" },
    { fr: "30–40 k", zh: "3–4 万", frL: "emplois directs + écosystème · 5 ans", zhL: "5 年直接与生态就业" }
  ];

  var HUB = [
    { cls: "c-china", fr: "Chine", zh: "中国" },
    { cls: "c-senegal", fr: "Sénégal", zh: "塞内加尔" },
    { cls: "c-mali", fr: "Mali", zh: "马里" },
    { cls: "c-civ", fr: "Côte d'Ivoire", zh: "科特迪瓦" },
    { cls: "c-africa", fr: "Afrique de l'Ouest", zh: "西非" }
  ];

  var DECISIONS = [
    { icon: "gov", fr: "Organisation et politiques", zh: "组织与政策", frS: "À clarifier", zhS: "待明确" },
    { icon: "land", fr: "Sites et listes de projets", zh: "场地与项目清单", frS: "À clarifier", zhS: "待明确" },
    { icon: "funding", fr: "Financement et budget", zh: "资金与预算", frS: "À clarifier", zhS: "待明确" },
    { icon: "rules", fr: "Finance et règlements", zh: "金融与规则", frS: "À clarifier", zhS: "待明确" },
    { icon: "diplomacy", fr: "Diplomatie et données", zh: "外交与数据", frS: "À clarifier", zhS: "待明确" }
  ];

  function heroArt() {
    return '<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs>' +
      '<radialGradient id="cglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#C9A25E" stop-opacity=".28"/><stop offset="100%" stop-color="#C9A25E" stop-opacity="0"/></radialGradient>' +
      '<pattern id="cgrid" width="54" height="54" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#C9A25E" opacity=".12"/></pattern>' +
      '</defs>' +
      '<rect width="1440" height="900" fill="url(#cgrid)"/>' +
      '<ellipse cx="770" cy="630" rx="280" ry="220" fill="url(#cglow)" class="hero-glow"/>' +
      '<g>' +
      '<path class="arc" d="M1115 168 C 1050 320 910 480 740 630"/>' +
      '<path class="arc a2" d="M1175 208 C 1010 390 870 505 760 640"/>' +
      '<path class="arc a3" d="M1180 520 C 1010 555 865 585 760 640"/>' +
      '<path class="arc a4" d="M980 780 C 880 735 810 690 760 640"/>' +
      '<path class="arc a4" d="M1210 830 C 1040 780 900 700 760 640"/>' +
      '<path class="arc a3" d="M520 790 C 600 740 680 690 750 640"/>' +
      '</g>' +
      '<g>' +
      '<circle class="node" cx="1115" cy="168" r="3"/><circle class="node" cx="1175" cy="208" r="2.4"/><circle class="node" cx="1090" cy="240" r="2"/><circle class="node" cx="1220" cy="150" r="2"/><circle class="node dim" cx="1050" cy="120" r="1.8"/><circle class="node dim" cx="1240" cy="260" r="1.8"/>' +
      '<circle class="node" cx="1180" cy="520" r="2.6"/><circle class="node" cx="980" cy="780" r="2.4"/><circle class="node" cx="1210" cy="830" r="2.4"/><circle class="node" cx="520" cy="790" r="2.4"/>' +
      '<circle class="node" cx="760" cy="640" r="5"/><circle class="node" cx="760" cy="640" r="12" opacity=".18"/><circle class="node" cx="760" cy="640" r="22" opacity=".08"/>' +
      '</g>' +
      '</svg>';
  }

  function sceneHead(c) {
    return '<header class="scene-head">' +
      '<p class="scene-kicker anim" style="--d:0ms">' + esc(c.kicker) + '</p>' +
      '<h2 class="scene-title anim" style="--d:80ms"><span>' + esc(c.title1) + '</span><span class="accent">' + esc(c.title2) + '</span></h2>' +
      '<p class="scene-lead anim" style="--d:160ms">' + esc(c.lead) + '</p>' +
      '</header>';
  }

  function heroScene() {
    var c = COPY[state.lang].hero;
    var stats = c.stats.map(function (s, i) {
      return '<div class="hero-stat anim" style="--d:' + (320 + i * 90) + 'ms"><span class="hero-stat-value">' + esc(s.value) + '</span><span class="hero-stat-label">' + esc(s.label) + '</span></div>';
    }).join("");
    return '<section class="scene scene-hero" id="scene-0" data-scene="0" data-tone="dark">' +
      '<div class="hero-art">' + heroArt() + '</div>' +
      '<div class="scene-inner hero-inner">' +
      '<p class="scene-kicker anim" style="--d:0ms">' + esc(c.kicker) + '</p>' +
      '<h1 class="hero-title anim" style="--d:80ms"><span>' + esc(c.title1) + '</span><span class="accent">' + esc(c.title2) + '</span></h1>' +
      '<p class="hero-lead anim" style="--d:170ms">' + esc(c.sub) + '</p>' +
      '<div class="hero-ctas anim" style="--d:260ms"><a class="cbtn cbtn-gold" href="#scene-1">' + esc(c.cta) + '</a><a class="cbtn" href="index.html">' + esc(c.site) + '</a></div>' +
      '<div class="hero-stats">' + stats + '</div>' +
      '</div>' +
      '<span class="net-label net-china">' + esc(c.net.china) + '</span>' +
      '<span class="net-label net-mauritania">' + esc(c.net.mauritania) + '</span>' +
      '<span class="net-label net-hub">' + esc(c.net.hub) + '</span>' +
      '<span class="net-label net-africa">' + esc(c.net.africa) + '</span>' +
      '<a class="scroll-cue" href="#scene-1">' + esc(COPY[state.lang].ui.scroll) + '</a>' +
      '</section>';
  }

  function constatScene() {
    var c = COPY[state.lang].constat;
    var cards = PROBLEMS.map(function (p, i) {
      var d = L(p);
      return '<article class="constat-card anim" style="--d:' + (120 + i * 90) + 'ms">' +
        '<span class="constat-icon">' + icon(p.icon) + '</span>' +
        '<span class="constat-value">' + esc(p.value) + '</span>' +
        '<span class="constat-label">' + esc(d.label) + '</span>' +
        '<span class="constat-text">' + esc(d.text) + '</span></article>';
    }).join("");
    return '<section class="scene" id="scene-1" data-scene="1" data-tone="light">' +
      '<div class="scene-inner">' + sceneHead(c) +
      '<div class="constat-grid">' + cards + '</div>' +
      '<div class="transform-band anim" style="--d:520ms">' +
      '<div class="transform-side"><small>' + esc(c.beforeLabel) + '</small><strong>' + esc(c.beforeValue) + '</strong><small>' + esc(c.beforeDesc) + '</small></div>' +
      '<span class="transform-arrow">→</span>' +
      '<div class="transform-side after"><small>' + esc(c.afterLabel) + '</small><strong>' + esc(c.afterValue) + '</strong><small>' + esc(c.afterDesc) + '</small></div>' +
      '</div>' +
      '<p class="scene-line anim" style="--d:620ms">' + esc(c.line) + '</p>' +
      '</div></section>';
  }

  function systemeScene() {
    var c = COPY[state.lang].systeme;
    var pillars = PILLARS.map(function (p, i) {
      return '<div class="arch-node anim" style="--d:' + (120 + i * 80) + 'ms"><span class="arch-icon">' + icon(p.icon) + '</span><span class="arch-name">' + esc(L(p)) + '</span><span class="arch-value">' + esc(state.lang === "fr" ? p.frV : p.zhV) + '</span></div>';
    }).join("");
    var businesses = BUSINESSES.map(function (b, i) {
      return '<div class="arch-node anim" style="--d:' + (280 + i * 55) + 'ms"><span class="arch-icon">' + icon(b.icon) + '</span><span class="arch-name">' + esc(L(b)) + '</span><span class="arch-value">' + esc(state.lang === "fr" ? b.frV : b.zhV) + '</span></div>';
    }).join("");
    var layers = LAYERS.map(function (l, i) {
      return '<div class="arch-node anim" style="--d:' + (520 + i * 55) + 'ms"><span class="arch-icon">' + icon(l.icon) + '</span><span class="arch-name">' + esc(L(l)) + '</span></div>';
    }).join("");
    return '<section class="scene" id="scene-2" data-scene="2" data-tone="dark">' +
      '<div class="scene-inner">' + sceneHead(c) +
      '<div class="arch">' +
      '<div class="arch-row arch-pillars">' + pillars + '</div><div class="arch-spine"></div>' +
      '<div class="arch-row arch-businesses">' + businesses + '</div><div class="arch-spine"></div>' +
      '<div class="arch-row arch-layers">' + layers + '</div>' +
      '</div>' +
      '<p class="scene-line anim" style="--d:700ms">' + esc(c.line) + '</p>' +
      '</div></section>';
  }

  function modeleScene() {
    var c = COPY[state.lang].modele;
    var slides = c.slides.map(function (s, i) {
      var nodes = s.nodes.map(function (n) {
        return '<div class="modele-node"' + ' style="left:' + n.x + '%"><b>' + esc(n.t) + '</b><span>' + esc(n.b) + '</span></div>';
      }).join("");
      var metrics = s.metrics.map(function (m) {
        return '<div class="modele-metric"><b>' + esc(m.v) + '</b><span>' + esc(m.l) + '</span></div>';
      }).join("");
      var extra = "";
      if (s.phone) {
        extra += '<div class="modele-phone"><img src="' + esc(s.phone) + '" alt=""></div>' +
          '<div class="modele-pricetag">' + esc(s.price || "") + '</div>' +
          '<div class="modele-coin"><i></i>' + esc(s.coin || "") + '</div>';
      }
      if (s.revenue) {
        var rows = s.revenue.map(function (r) {
          return '<div class="modele-rev-row"><span>' + esc(r.n) + '</span><b>' + esc(r.v) + '</b></div>';
        }).join("");
        extra += '<div class="modele-rev"><div class="modele-rev-k">' + esc(c.revKicker) + '</div>' + rows +
          '<div class="modele-rev-total"><span>' + esc(c.revTotal) + '</span><b>' + esc(c.revTotalVal) + '</b></div></div>' +
          '<div class="modele-mobile-total">' + esc(c.revTotalVal) + '</div>';
      }
      var video = '<video class="modele-video" muted loop playsinline preload="metadata" poster="' + esc(MODELE_POSTERS[i]) + '"><source src="' + esc(MODELE_VIDEOS[i]) + '" type="video/mp4"></video>';
      return '<div class="modele-slide' + (i === state.modele.index ? ' is-active' : '') + '" data-mslide="' + i + '" style="--photo:url(' + esc(s.img) + ');--photo-pos:' + esc(s.pos || "center") + '">' +
        '<div class="modele-photo"></div>' + video + '<div class="modele-shade"></div><div class="modele-grain"></div>' +
        '<div class="modele-content"><div class="modele-kicker">' + esc(s.no) + ' · ' + esc(s.kicker) + '</div>' +
        '<h2 class="modele-title"><span>' + esc(s.title1) + '</span><span class="accent">' + esc(s.title2) + '</span></h2>' +
        '<p class="modele-lead">' + esc(s.lead) + '</p><div class="modele-tag">' + esc(s.tag) + '</div>' + extra + '</div>' +
        '<div class="modele-flow">' + nodes + '</div><div class="modele-metrics">' + metrics + '</div></div>';
    }).join("");
    var tabs = c.tabs.map(function (label, i) {
      return '<button class="modele-tab' + (i === state.modele.index ? ' is-active' : '') + '" type="button" role="tab" aria-selected="' + (i === state.modele.index ? "true" : "false") + '" data-modele="' + i + '">' + esc(label) + '</button>';
    }).join("");
    return '<section class="scene scene-modele" id="scene-3" data-scene="3" data-tone="dark">' +
      '<div class="modele-stage"><p class="modele-scene-label">' + esc(c.kicker) + '</p>' + slides +
      '<div class="modele-controls"><div class="modele-tabs" role="tablist" aria-label="' + esc(c.kicker) + '">' + tabs + '</div>' +
      '<div class="modele-actions"><button type="button" class="modele-action" data-modele-action="pause">' + esc(state.modele.paused ? c.resume : c.pause) + '</button><button type="button" class="modele-action" data-modele-action="replay">' + esc(c.replay) + '</button></div></div>' +
      '</div></section>';
  }

  function showModele(index, restart) {
    var c = COPY[state.lang].modele;
    index = ((index % 4) + 4) % 4;
    var changed = index !== state.modele.index || restart;
    state.modele.index = index;
    $$(".modele-slide").forEach(function (slide, i) { slide.classList.toggle("is-active", i === index); });
    $$(".modele-tab").forEach(function (tab, i) {
      tab.classList.toggle("is-active", i === index);
      tab.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    var pause = $('[data-modele-action="pause"]');
    if (pause) pause.textContent = state.modele.paused ? c.resume : c.pause;
    if (changed) {
      var activeVideo = $(".modele-slide.is-active .modele-video");
      if (activeVideo) {
        try { activeVideo.currentTime = 0; } catch (err) {}
      }
    }
    if (restart) {
      state.modele.paused = false;
      restartModeleAuto();
    }
    syncModeleVideos();
  }

  function stopModeleAuto() {
    if (state.modele.timer) { clearInterval(state.modele.timer); state.modele.timer = null; }
  }

  function startModeleAuto() {
    stopModeleAuto();
    if (state.active !== 3 || state.modele.paused || state.modele.reduced) return;
    state.modele.timer = setInterval(function () {
      showModele(state.modele.index + 1, false);
    }, 10000);
  }

  function restartModeleAuto() {
    startModeleAuto();
  }

  function syncModeleVideos() {
    $$(".modele-slide").forEach(function (slide, i) {
      var video = slide.querySelector(".modele-video");
      if (!video) return;
      var shouldPlay = i === state.modele.index && state.active === 3 && !state.modele.paused && !state.modele.reduced && !document.hidden;
      if (shouldPlay) {
        if (video.paused) {
          video.muted = true;
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        }
      } else if (!video.paused) {
        video.pause();
      }
    });
  }

  function rimuScene() {
    var c = COPY[state.lang].rimu;
    var phones = PHONES.map(function (ph, i) {
      var cap = state.lang === "fr" ? ph.fr : ph.zh;
      var sub = state.lang === "fr" ? ph.frT : ph.zhT;
      return '<figure class="phone-card anim" style="--d:' + (180 + i * 100) + 'ms"><img src="' + ph.src + '" alt="' + esc(cap + " — " + sub) + '" loading="lazy" width="828" height="1634"><figcaption class="phone-cap"><b>' + esc(cap) + '</b><span>' + esc(sub) + '</span></figcaption></figure>';
    }).join("");
    var facts = c.facts.map(function (f) {
      return '<div class="rimu-fact"><b>' + esc(f.value) + '</b><span>' + esc(f.label) + '</span></div>';
    }).join("");
    return '<section class="scene" id="scene-4" data-scene="4" data-tone="dark">' +
      '<div class="scene-inner">' + sceneHead(c) +
      '<div class="phone-stage">' + phones + '</div>' +
      '<div class="rimu-facts anim" style="--d:560ms">' + facts + '</div>' +
      '<p class="scene-line anim" style="--d:640ms">' + esc(c.line) + '</p>' +
      '</div></section>';
  }

  function iaScene() {
    var c = COPY[state.lang].ia;
    var layers = LAYERS.map(function (l, i) {
      return '<div class="stack-layer anim" style="--i:' + i + ';--d:' + (120 + i * 80) + 'ms"><span class="stack-icon">' + icon(l.icon) + '</span><span class="stack-name">' + esc(L(l)) + '</span><span class="stack-kw">' + esc(state.lang === "fr" ? l.frK : l.zhK) + '</span></div>';
    }).join("");
    var phases = c.phases.map(function (p) {
      return '<div class="phase-item anim"><span class="phase-year">' + esc(p.year) + '</span><span class="phase-name">' + esc(p.name) + '</span><span class="phase-fig">' + esc(p.fig) + '</span></div>';
    }).join("");
    var stats = c.stats.map(function (s) {
      return '<div class="ia-stat"><b>' + esc(s.value) + '</b>' + esc(s.label) + '</div>';
    }).join("");
    return '<section class="scene" id="scene-5" data-scene="5" data-tone="light">' +
      '<div class="scene-inner">' + sceneHead(c) +
      '<div class="sovereign-grid">' +
      '<div class="stack">' + layers + '</div>' +
      '<div class="phases">' + phases + '</div>' +
      '</div>' +
      '<p class="big-statement anim" style="--d:520ms">' + esc(c.statement1) + '<br><em>' + esc(c.statement2) + '</em></p>' +
      '<div class="ia-stats anim" style="--d:600ms">' + stats + '</div>' +
      '</div></section>';
  }

  function hubArt(c) {
    var chips = HUB.map(function (h) {
      return '<span class="hub-chip ' + h.cls + '">' + esc(L(h)) + '</span>';
    }).join("");
    return '<div class="hub">' +
      '<svg class="hub-lines" viewBox="0 0 500 500" aria-hidden="true">' +
      '<circle cx="250" cy="250" r="190"/><circle class="inner" cx="250" cy="250" r="120"/>' +
      '<path d="M250 250 C 300 160 345 105 395 70"/>' +
      '<path d="M250 250 C 345 245 390 250 435 260"/>' +
      '<path d="M250 250 C 180 200 135 165 115 135"/>' +
      '<path d="M250 250 C 325 330 370 380 410 410"/>' +
      '<path d="M250 250 C 190 320 145 360 85 385"/>' +
      '</svg>' +
      '<div class="hub-core"><b>' + esc(c.hub.name) + '</b><span>' + esc(c.hub.sub) + '</span></div>' + chips + '</div>';
  }

  function impactScene() {
    var c = COPY[state.lang].impact;
    var stats = IMPACT.map(function (s, i) {
      return '<div class="impact-stat anim" style="--d:' + (120 + i * 80) + 'ms"><span class="impact-value">' + esc(state.lang === "fr" ? s.fr : s.zh) + '</span><span class="impact-label">' + esc(state.lang === "fr" ? s.frL : s.zhL) + '</span></div>';
    }).join("");
    return '<section class="scene" id="scene-6" data-scene="6" data-tone="dark">' +
      '<div class="scene-inner">' + sceneHead(c) +
      '<div class="impact-layout">' +
      '<div class="impact-stats">' + stats + '</div>' +
      '<div class="anim" style="--d:420ms">' + hubArt(c) + '</div>' +
      '</div>' +
      '<p class="scene-line anim" style="--d:560ms">' + esc(c.line) + '</p>' +
      '<p class="impact-note anim" style="--d:640ms">' + esc(c.note) + '</p>' +
      '</div></section>';
  }

  function decisionScene() {
    var c = COPY[state.lang].decision;
    var choices = DECISIONS.map(function (d, i) {
      return '<div class="choice anim" style="--d:' + (120 + i * 80) + 'ms"><span class="choice-no">0' + (i + 1) + '</span><span class="choice-icon">' + icon(d.icon) + '</span><span class="choice-title">' + esc(L(d)) + '</span><span class="choice-status">' + esc(state.lang === "fr" ? d.frS : d.zhS) + '</span></div>';
    }).join("");
    return '<section class="scene" id="scene-7" data-scene="7" data-tone="dark">' +
      '<div class="scene-inner">' + sceneHead(c) +
      '<div class="decision-layout">' +
      '<div class="cinema-choices">' + choices + '</div>' +
      '<div class="closing">' +
      '<p class="closing-line anim" style="--d:220ms">' + esc(c.line) + '</p>' +
      '<div class="closing-actions anim" style="--d:320ms"><a class="cbtn cbtn-gold" href="index.html">' + esc(COPY[state.lang].ui.site) + '</a><a class="cbtn" href="dossier.html" target="_blank" rel="noopener">' + esc(COPY[state.lang].ui.pdf) + '</a></div>' +
      '<div class="contact-mini anim" style="--d:420ms"><b>' + esc(c.contact) + '</b><br><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></div>' +
      '</div></div></div></section>';
  }

  function render() {
    document.documentElement.lang = state.lang;
    document.documentElement.setAttribute("data-lang", state.lang);
    document.body.setAttribute("data-lang", state.lang);
    document.title = state.lang === "fr"
      ? "Version cinématique — Plateforme de coopération · RIMU · RIMP · IA"
      : "沉浸版 — 中毛数字合作平台 · RIMU · RIMP · IA";
    var langButton = $("#cinema-lang");
    if (langButton) langButton.setAttribute("aria-label", state.lang === "fr" ? "Passer en chinois" : "切换到法语");
    var scroll = $("#cinema-scroll");
    if (!scroll) return;
    scroll.innerHTML = heroScene() + constatScene() + systemeScene() + modeleScene() + rimuScene() + iaScene() + impactScene() + decisionScene();
    var langBtn = $("#cinema-lang");
    if (langBtn) langBtn.textContent = state.lang === "fr" ? "中文" : "FR";
    buildRail();
    setupScenes();
    updateCounter();
  }

  function buildRail() {
    var rail = $("#cinema-rail");
    if (!rail) return;
    var labels = t("rail");
    rail.innerHTML = labels.map(function (label, i) {
      return '<button class="rail-item' + (i === state.active ? " is-active" : "") + '" type="button" data-target="scene-' + i + '"><span class="rail-label">' + esc(label) + '</span><span class="rail-no">0' + i + '</span></button>';
    }).join("");
  }

  var scenes = [];
  function setupScenes() {
    scenes = $$(".scene");
    var rail = $("#cinema-rail");
    if (rail) {
      rail.onclick = function (e) {
        var btn = e.target.closest("[data-target]");
        if (!btn) return;
        var target = document.getElementById(btn.getAttribute("data-target"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    }
    if (!state.ready) {
      state.ready = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      document.addEventListener("keydown", onKey);
      var langBtn = $("#cinema-lang");
      if (langBtn) langBtn.addEventListener("click", function () {
        state.lang = state.lang === "fr" ? "zh" : "fr";
        localStorage.setItem("cinema-lang", state.lang);
        localStorage.setItem("rimu-lang", state.lang);
        var current = state.active;
        render();
        var target = document.getElementById("scene-" + current);
        if (target) target.scrollIntoView({ block: "nearest" });
        setActive(current, true);
      });
      document.addEventListener("visibilitychange", syncModeleVideos);
      document.addEventListener("click", function (e) {
        var tab = e.target.closest("[data-modele]");
        if (tab) {
          e.preventDefault();
          state.modele.paused = false;
          showModele(Number(tab.getAttribute("data-modele")), true);
          return;
        }
        var act = e.target.closest("[data-modele-action]");
        if (act) {
          e.preventDefault();
          var a = act.getAttribute("data-modele-action");
          if (a === "pause") {
            state.modele.paused = !state.modele.paused;
            if (state.modele.paused) stopModeleAuto(); else startModeleAuto();
            showModele(state.modele.index, false);
          } else if (a === "replay") {
            showModele(0, true);
          }
        }
      });
    }
    updateScroll();
  }

  function updateCounter() {
    var indicator = $("#cinema-scene-indicator");
    if (indicator) {
      var label = (t("rail") || [])[state.active] || "";
      indicator.textContent = "0" + state.active + " / 07 · " + label;
    }
  }

  function setActive(index, force) {
    index = Math.max(0, Math.min(scenes.length - 1, index));
    if (!force && index === state.active) {
      updateCounter();
      return;
    }
    state.active = index;
    scenes.forEach(function (scene, i) {
      scene.classList.toggle("is-active", i === index);
    });
    var current = scenes[index];
    if (current) document.body.setAttribute("data-tone", current.getAttribute("data-tone") || "dark");
    $$(".rail-item").forEach(function (item, i) {
      item.classList.toggle("is-active", i === index);
      item.setAttribute("aria-current", i === index ? "step" : "false");
    });
    updateCounter();
    if (index === 3) startModeleAuto(); else stopModeleAuto();
    syncModeleVideos();
  }

  function updateScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var bar = $("#cinema-progress-bar");
    if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
    var idx = 0;
    for (var i = 0; i < scenes.length; i++) {
      var top = scenes[i].getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.46) idx = i;
    }
    setActive(idx);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      updateScroll();
    });
  }

  function onKey(e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON" || e.target.tagName === "A")) return;
    var next = state.active + 1;
    var prev = state.active - 1;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      if (next < scenes.length) { e.preventDefault(); scenes[next].scrollIntoView({ behavior: "smooth", block: "start" }); }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (prev >= 0) { e.preventDefault(); scenes[prev].scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
  }

  function init() {
    render();
    // set active first scene after DOM built
    requestAnimationFrame(function () {
      setActive(0, true);
      var target = window.location.hash && document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ block: "start" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
