# web/spec/data-model.md — KPI 数据字典、派生公式与口径 QA

> **2026-11-09 更新（拍板后）**：`kpi.languages_content` 口径调整为 **3 langues au lancement（français, arabe, anglais）**；本地语言（hassaniya, peul, soninké, wolof）列为 phase 2。站点 `web/site/assets/js/data.js` 已同步；本文该 KPI 的旧值保留为历史设计稿。

> 版本 v1.0 · 2026-11-09 · 负责人：content-analyst（T1）
> 依据：`web/spec/BRIEF.md` §7（数据基线）、`rimu_source_text.txt`（117 行，Lxx 为行号）、`README.md` §3。
> 配套：`web/spec/data-model.json`（机器可读，页面直接读取；本文件是其人读版本）、`web/spec/content-model.md`（区块内容与 KPI 引用关系）。
> 用途：单一数据事实源。页面所有数字必须来自 `data-model.json → kpis[]`，禁止在组件里硬编码或二次四舍五入。

---

## 0. 元信息

| 项 | 值 |
|---|---|
| 项目 | Plateforme de coopération numérique sino-mauritanienne — RIMU + Contenu IA + Calcul national |
| 客户 / 品牌 | AUREON DIGITAL SARL · Nouakchott, Mauritanie |
| 文档日期 | 2026-11-09 |
| 数据基线 | 源文件 2026-11 版（法语全文，117 行）；BRIEF §7.1 硬数据、§7.2 允许派生、§7.3 待修正口径 |
| 语言 | FR 默认 / ZH 切换；AR 预留（第二期） |
| 未来扩展 | 所有 KPI 带 `id`、`type`、`sourceLines`，新增数据只加条目、不改组件 |

**三类数字的页面可见标签（强制）**：`Source`（源文件明示）/ `Dérivé`（按公式换算）/ `Hypothèse`（待验证假设）。每枚徽章必须可点击打开方法学抽屉，显示公式或假设来源。2031 区块必须出现 `Scénario ambitieux` 徽章（源文 L50、L75）。

---

## 1. 数字格式化规则（FR / ZH）

| 规则 | FR | ZH |
|---|---|---|
| 小数 | 逗号 `2,5` | 点 `2.5` |
| 千位 | 不换行空格（U+202F，生产环境） | 万/亿单位 |
| 大数缩写 | `M` = million，`Md` = milliard | `万` / `亿` |
| 范围 | en dash `150–220`；长文 `de 150 à 220 M USD` | `150–220` |
| 百分号 | 前留不换行空格 `1,3 %` | `1.3%` |
| 百分点 | `+0,8–1,5 pt` | `+0.8–1.5 个百分点` |
| 币种 | 后置 `150–220 M USD` | 中文常用「1.5–2.2 亿美元」 |
| 年份 | `2031`；区间 `2027–2031` | `2031 年` |
| 计数 | `5–8 projets`、`800 k`、`2,8 M comptes` | `5–8 个项目`、`80 万`、`280 万账户` |

规则落地：JSON 中每条 KPI 已含 `displayFR` / `displayZH`（短格式，用于卡片与计数器）与 `displayLongFR` / `displayLongZH`（长格式，用于正文与 tooltip）。前端只做拼接，不做换算。

**动画触发字段约定**：`animation.trigger` 默认 `viewport`（进入视口触发一次，回看可重播）；`animation.preset` 取值 `countUp` / `countUpRange` / `drawLine` / `donutDraw` / `barGrow` / `mapFlow` / `timelineReveal` / `staticReveal`；`animation.delayMs` 控制 stagger；`prefers-reduced-motion` 一律退化为 `staticReveal`（直接显示终值）。

---

## 2. KPI 字典

> 「来源」列 `Lxx` 指 `rimu_source_text.txt` 行号；「类型」列严格三选一。区间 KPI 不得只显示中点；图表需要面积时用中点并另注区间（见 QA-6）。

### 2.1 2031 核心数字（区块 00 / 03 / 09 / 10）

| ID | 名称 FR / ZH | 数值 | 单位 · 年份 | 类型 | 来源 | 公式 / 假设 | 展示 FR / ZH | 组件 · 动画 |
|---|---|---|---|---|---|---|---|---|
| `kpi.mau_2031` | Utilisateurs actifs mensuels / 月活用户 | 2 500 000 | utilisateurs · 2031 | Source | L58, L72 | — | `2,5 M` / `250 万` | KpiCounter · countUp |
| `kpi.dau_2031` | Utilisateurs actifs quotidiens / 日活用户 | 800 000 | utilisateurs · 2031 | Source | L58 | — | `800 k` / `80 万` | KpiCounter · countUp |
| `kpi.daily_minutes_2031` | Temps passé / 日均时长 | 40 | min/jour · 2031 | Source | L58 | — | `40 min/jour` / `40 分钟/日` | KpiCounter · countUp |
| `kpi.wallets_2031` | Comptes portefeuille RIMP / RIMP 钱包账户 | 2 800 000 | comptes · 2031 | Source | L73 | 定义为累计账户（含多账户），见 QA-2 | `2,8 M comptes` / `280 万账户` | KpiCounter · countUp |
| `kpi.revenue_total_2031` | Revenus annuels totaux / 年收入合计 | 150–220 | M USD/an · 2031 | Source | L82 | — | `150–220 M USD` / `1.5–2.2 亿美元` | KpiCounter range · countUpRange |
| `kpi.revenue_rimu_2031` | Revenus RIMU / RIMU 收入 | 30–50 | M USD/an · 2031 | Source | L79 | — | `30–50 M USD` / `0.3–0.5 亿美元` | Donut slice · donutDraw |
| `kpi.revenue_rimp_2031` | Revenus RIMP / RIMP 收入 | 90–140 | M USD/an · 2031 | Source | L80 | — | `90–140 M USD` / `0.9–1.4 亿美元` | Donut slice · donutDraw |
| `kpi.revenue_compute_2031` | Revenus centre de calcul / 算力收入 | 30–40 | M USD/an · 2031 | Source | L81 | — | `30–40 M USD` / `0.3–0.4 亿美元` | Donut slice · donutDraw |
| `kpi.revenue_gdp_share_2031` | Part du PIB / 占 GDP 比重 | 1,3–1,9 | % · 2031 | Source | L82 | 源文口径为「% du PIB actuel」，不得改称 2031 年 PIB | `1,3–1,9 % du PIB (actuel)` / `占当前 GDP 的 1.3–1.9%` | KpiCounter range · countUpRange |
| `kpi.jobs_5y` | Emplois directs + écosystème (5 ans) / 五年直接与生态就业 | 30–40 | milliers · 2031 | Source | L97 | — | `30–40 k` / `3–4 万` | KpiCounter range · countUpRange |
| `kpi.stickiness_dau_mau_2031` | Ratio DAU/MAU / 用户粘性 | 32 | % · 2031 | Dérivé | L58 | `800 000 ÷ 2 500 000 = 0,32` | `32 %` / `32%` | Gauge · staticReveal |
| `kpi.internet_users_2031` | Internautes estimés / 估算网民数 | ≈ 4 166 667 | internautes · 2031 | Dérivé | L58 | `2 500 000 ÷ 60 % = 4 166 667`；见 QA-4（循环依赖） | `≈ 4,2 M` / `约 420 万` | KpiCounter · countUp（仅方法学/注释） |
| `kpi.netizen_share_2031` | Part des internautes / 占网民比例 | 60+ | % · 2031 | Source | L58 | — | `60 %+` / `60%+` | Badge · staticReveal |
| `kpi.adult_accounts_2031` | Comptes numériques adultes / 成年人数字账户 | ≈ 50 | % · 2031 | Source | L98 | — | `≈ 50 %` / `约 50%` | Gauge · staticReveal |
| `kpi.adult_accounts_before` | Comptes numériques adultes — avant / 成年人数字账户（基线） | < 20 | % · 2026 | Source | L98 | 源文「moins de 20 %」，上限取 20 | `< 20 %` / `< 20%` | Gauge baseline · staticReveal |
| `kpi.revenue_mix_midpoint` | Répartition des revenus (milieux de fourchette) / 收入构成（区间中点） | RIMU 40 / RIMP 115 / Calcul 35 / total 190 | M USD · 2031 | Dérivé | L79–L82 | `(30+50)/2=40` ; `(90+140)/2=115` ; `(30+40)/2=35` ; total 190；仅用于图形面积，不替换 150–220 | `40 / 115 / 35 M USD` / `0.4 / 1.15 / 0.35 亿美元` | Donut · donutDraw |
| `kpi.gdp_current_implied` | PIB actuel implicite / 隐含当前 GDP | ≈ 11,5–11,6 | Md USD · 2026 | Dérivé | L82 | `150 ÷ 1,3 % = 11,54 Md` ; `220 ÷ 1,9 % = 11,58 Md`；仅方法学，不上页面主视觉 | `≈ 11,5 Md USD (implicite)` / `约 115 亿美元（隐含）` | Table · staticReveal（methodology only） |

### 2.2 RIMU 五年曲线（区块 05 / 08，源文 L52–L59 表）

| ID | 名称 FR / ZH | 数值 | 单位 · 年份 | 类型 | 来源 | 公式 / 假设 | 展示 FR / ZH | 组件 · 动画 |
|---|---|---|---|---|---|---|---|---|
| `kpi.series.mau` | MAU 2027–2031 / 月活五年曲线 | 250k / 700k / 1,2 M / 1,8 M / 2,5 M | utilisateurs · 2027–2031 | Source | L54–L58 | — | `2,5 M`（2031 端点） / `250 万` | LineChart · drawLine |
| `kpi.series.dau` | DAU 2027–2031 / 日活五年曲线 | 80k / 200k / 360k / 550k / 800k | utilisateurs · 2027–2031 | Source | L54–L58 | — | `800 k`（2031 端点） / `80 万` | LineChart · drawLine |
| `kpi.series.minutes` | Temps passé 2027–2031 / 日均时长曲线 | 28 / 32 / 36 / 38 / 40 | min/jour · 2027–2031 | Source | L54–L58 | — | `40 min/jour`（2031 端点） / `40 分钟/日` | LineChart · drawLine |
| `kpi.series.stickiness` | DAU/MAU 2027–2031 / 粘性曲线 | 32 % / 28,6 % / 30 % / 30,6 % / 32 % | % · 2027–2031 | Dérivé | L54–L58 | `DAU_y ÷ MAU_y`：80/250=32 % ; 200/700=28,6 % ; 360/1 200=30 % ; 550/1 800=30,6 % ; 800/2 500=32 % | `32 %` / `32%` | Sparkline · drawLine |
| `kpi.series.mau_yoy` | Croissance MAU YoY / 月活同比增速 | — / 180 % / 71,4 % / 50 % / 38,9 % | % · 2028–2031 | Dérivé | L54–L58 | `MAU_y ÷ MAU_{y-1} − 1` | `+180 %` / `+180%` | BarChart · barGrow |

### 2.3 双边短期收益（区块 04 / 08 / 10，源文 L86–L88）

| ID | 名称 FR / ZH | 数值 | 单位 · 年份 | 类型 | 来源 | 公式 / 假设 | 展示 FR / ZH | 组件 · 动画 |
|---|---|---|---|---|---|---|---|---|
| `kpi.projects_first_wave` | Première vague de projets / 首批项目数 | 5–8 | projets · 0–24 mois | Source | L86 | — | `5–8 projets` / `5–8 个项目` | KpiCounter range · countUpRange |
| `kpi.investment_intentions` | Intentions d'investissement / 投资意向 | 800 M–1,2 Md | USD · 0–24 mois | Source | L86 | — | `800 M–1,2 Md USD` / `8–12 亿美元` | KpiCounter range · countUpRange |
| `kpi.wholesale_matching` | Mises en relation commerce de gros / 批发撮合额 | 300–800 | M USD · 0–24 mois | Source | L87 | — | `300–800 M USD` / `3–8 亿美元` | KpiCounter range · countUpRange |
| `kpi.consumer_trial_orders_y1` | Commandes d'essai biens de consommation / 消费品首年试单 | 80–150 | M USD · Y1 | Source | L87 | — | `80–150 M USD` / `0.8–1.5 亿美元` | KpiCounter range · countUpRange |
| `kpi.training_people` | Personnes formées / 受训人数 | 1 000–3 000 | personnes · 0–24 mois | Source | L88 | — | `1 000–3 000` / `1000–3000 人` | KpiCounter range · countUpRange |
| `kpi.telemedicine_points` | Points de télémédecine / 远程医疗点 | 8–15 | points · 0–24 mois | Source | L88 | — | `8–15 points` / `8–15 个点` | KpiCounter range · countUpRange |
| `kpi.direct_jobs_short_term` | Emplois directs et connexes — vague 1 / 首波直接与关联就业 | 2–4 | milliers · 0–24 mois | Source | L88 | 口径 = 短期直接 + 关联；见 QA-3 | `2–4 k` / `2000–4000` | KpiCounter range · countUpRange |
| `kpi.showroom_count` | Showroom / site d'exposition / 展贸中心 | 1 | site · 2026–2027 | Dérivé | L66 | 源文「showroom permanent ou semaines d'exposition」计为 1 个线下载体 | `1 showroom` / `1 个展贸中心` | Badge · staticReveal |

### 2.4 中长期与区域（区块 10，源文 L90–L92、L101–L102）

| ID | 名称 FR / ZH | 数值 | 单位 · 年份 | 类型 | 来源 | 公式 / 假设 | 展示 FR / ZH | 组件 · 动画 |
|---|---|---|---|---|---|---|---|---|
| `kpi.wa_goods_transit` | Biens transitant via la Mauritanie / 经毛过境西非货值 | 800 M–2 Md | USD/an · 中長期 | Source | L90 | — | `800 M–2 Md USD/an` / `8–20 亿美元/年` | KpiCounter range + map · countUpRange / mapFlow |
| `kpi.related_jobs_mlt` | Emplois connexes moyen-long terme / 中长期关联就业 | 8–15 | milliers · 3–5 ans | Source | L91 | 含物流；见 QA-3 | `8–15 k` / `0.8–1.5 万` | KpiCounter range · countUpRange |
| `kpi.compute_green_program_mw` | Programme d'électricité verte — phase 1 / 绿电算力一期规模 | 20–50 | MW · 中长期 | Source | L91 | 与 Phase 1 的 ≈1 MW（IT 负载）不同口径，见 QA-5 | `20–50 MW` / `20–50 兆瓦` | Gauge/Bar · barGrow |
| `kpi.compute_services_revenue_lt` | Revenus de service — calcul vert / 绿电算力年服务收入（长期） | plusieurs dizaines à ~100 | M USD/an · 长期 | Source | L91 | 源文为「数千万至一亿」量级；与 2031 年 30–40 M 不同口径，见 QA-7 | `plusieurs dizaines à ~100 M USD/an` / `数千万至约 1 亿美元/年` | KpiCounter range · countUpRange |
| `kpi.gdp_growth_baseline` | Croissance de base / 基线增速 | 4,5 | % · 基线 | Source | L92 | — | `4,5 %` / `4.5%` | KpiCounter · countUp |
| `kpi.gdp_growth_uplift` | Gain de croissance / 增长拉动 | +0,8–1,5 | pt · 2031+ | Source | L92 | — | `+0,8–1,5 pt` / `+0.8–1.5 个百分点` | KpiCounter range · countUpRange |
| `kpi.gdp_growth_projected` | Croissance projetée / 预计增速 | 5,3–6,0 | % · 2031+ | Dérivé | L92 | `4,5 % + 0,8–1,5 pt = 5,3–6,0 %` | `5,3–6,0 %` / `5.3–6.0%` | KpiCounter range · countUpRange |
| `kpi.wa_countries` | Pays acheteurs ciblés / 目标买家国 | 5 | pays · 2026–2031 | Dérivé | L66 | 计数：Sénégal、Mali、Guinée、Côte d'Ivoire、Gambie | `5 pays` / `5 国` | Map labels · mapFlow |

### 2.5 算力三期（区块 06 / 08，源文 L61–L64、L108）

| ID | 名称 FR / ZH | 数值 | 单位 · 年份 | 类型 | 来源 | 公式 / 假设 | 展示 FR / ZH | 组件 · 动画 |
|---|---|---|---|---|---|---|---|---|
| `kpi.compute_phase1_duration_months` | Durée phase 1 / 一期时长 | ≈ 18 | mois · Phase 1 | Source | L61 | — | `≈ 18 mois` / `约 18 个月` | Timeline · timelineReveal |
| `kpi.compute_phase1_cards` | Cartes accélératrices phase 1 / 一期加速卡 | ≈ 100 | cartes · Phase 1 | Source | L61 | — | `≈ 100 cartes` / `约 100 张加速卡` | KpiCounter · countUp |
| `kpi.compute_phase1_mw` | Puissance phase 1 / 一期功率 | ≈ 1 | MW · Phase 1 | Source | L61 | IT 负载口径；与 20–50 MW 项目规模不同，见 QA-5 | `≈ 1 MW` / `约 1 兆瓦` | Gauge · staticReveal |
| `kpi.compute_phase2_duration_months` | Durée phase 2 / 二期时长 | ≈ 36 | mois · Phase 2 | Source | L62 | — | `≈ 36 mois` / `约 36 个月` | Timeline · timelineReveal |
| `kpi.compute_phase2_mw` | Puissance phase 2 / 二期功率 | 2–3 | MW · Phase 2 | Source | L62 | — | `2–3 MW` / `2–3 兆瓦` | Bar · barGrow |
| `kpi.first_deliverable_months` | Premier livrable — pré-étude / 首个交付节点 | 6 | mois · 2026–2027 | Source | L108 | 源文「在六个月内完成算力预研第一版」 | `6 mois` / `6 个月` | Badge · staticReveal |

### 2.6 RIMU 产品参数与派生（区块 00 / 05 / 07 / 09）

| ID | 名称 FR / ZH | 数值 | 单位 · 年份 | 类型 | 来源 | 公式 / 假设 | 展示 FR / ZH | 组件 · 动画 |
|---|---|---|---|---|---|---|---|---|
| `kpi.rimu_tabs` | Onglets RIMU / RIMU 标签页 | 4 | onglets · produit | Source | L26 | For You / Abonnements / À proximité / Marché | `4 onglets` / `4 个 tab` | Tab strip · staticReveal |
| `kpi.short_video_seconds` | Vidéo courte / 短视频时长 | 15–60 | s · produit | Source | L27 | — | `15–60 s` / `15–60 秒` | Range chip · staticReveal |
| `kpi.medium_video_seconds` | Vidéo moyenne / 中视频时长 | 180 | s · produit | Source | L27 | 3 min | `3 min` / `3 分钟` | Range chip · staticReveal |
| `kpi.default_bitrate` | Débit par défaut / 默认码率 | 360p / 480p | résolution · produit | Source | L27 | 默认低码率 + 夜间预缓存 | `360p/480p` / `360p/480p` | Badge · staticReveal |
| `kpi.content_formats` | Formats de contenu / 内容形态数 | 3 | formats · produit | Dérivé | L27 | vidéo courte 15–60 s + vidéo moyenne 3 min + notes texte-image = 3 | `3 formats` / `3 种形态` | IconRow · staticReveal |
| `kpi.languages_content` | Langues de contenu / 内容语言数 | 6 | langues · produit | Dérivé | L8, L29 | 计数：hassaniya（阿语）、peul、soninké、wolof、français、anglais | `6 langues` / `6 种语言` | Icon row · staticReveal |
| `kpi.daily_views_2031` | Vues quotidiennes / 日均播放量 | 32 000 000 | vues/jour · 2031 | Dérivé | L58 + BRIEF §7.2 | `DAU × vues/jour`；vues/jour = `40 min × 60 s ÷ 60 s = 40`；`800 000 × 40 = 32 M` | `32 M/jour` / `3200 万次/日` | KpiCounter · countUp |
| `kpi.annual_views_2031` | Vues annuelles / 年播放量 | 11 680 000 000 | vues/an · 2031 | Dérivé | 同上 | `32 000 000 × 365 = 11,68 Md` | `≈ 11,7 Md/an` / `约 117 亿次/年` | KpiCounter · countUp（secondary） |
| `kpi.creators_active_2031` | Créateurs actifs / 活跃创作者 | 50 000 | créateurs · 2031 | Hypothèse | L32 + BRIEF §7.2 | `MAU × 2 % = 2 500 000 × 0,02`；假设，需验证 | `50 k` / `5 万` | KpiCounter · countUp |
| `kpi.creators_monetized_2031` | Créateurs monétisés / 变现创作者 | 10 000 | créateurs · 2031 | Hypothèse | 同上 | `50 000 × 20 %`；假设，需验证 | `10 k` / `1 万` | KpiCounter · countUp |
| `kpi.ecommerce_gmv_2031` | GMV e-commerce / 电商 GMV | 200–300 | M USD/an · 2031 | Hypothèse | L30 + BRIEF §7.2 | `2 500 000 × 80–120 USD = 200–300 M USD`；假设客单价，需验证 | `200–300 M USD` / `2–3 亿美元` | KpiCounter range · countUpRange |
| `kpi.payment_flow_2031` | Flux de paiement annuels / 年支付流量 | 15–25 | Md USD/an · 2031 | Dérivé | L74, L80 + BRIEF §7.2 / §7.3-1 | `revenus RIMP ÷ taux` : 90–140 M ÷ 0,5–0,7 % = 12,9–28 Md → fourchette de pilotage retenue **15–25 Md**；见 QA-1 | `15–25 Md USD/an` / `150–250 亿美元/年` | KpiCounter range + flow · countUpRange |
| `kpi.payment_fee_rate` | Taux de commission mixte / 综合费率 | 0,5–0,7 | % · hypothèse | Hypothèse | BRIEF §7.2 | 参数假设（商户 + 跨境 + 微贷 + 行政 + B2B 混合）；需按实际定价验证 | `0,5–0,7 %` / `0.5–0.7%` | Methodology table · staticReveal |
| `kpi.wallet_penetration_total_pop` | Pénétration portefeuille / 钱包人口渗透 | ≈ 57 | % · 2031 | Hypothèse | L73 + 外部人口假设 | `2,8 M ÷ population ≈ 4,9 M`；人口基数不在源文件内，仅方法学展示，不上海报主视觉；见 QA-2 | `≈ 57 % (hypothèse)` / `约 57%（假设）` | Methodology table · staticReveal |

**KPI 数量自检**：2031 核心 17 + 五年曲线 5 + 双边短期 8 + 中长期与区域 8 + 算力 6 + RIMU 产品与派生 14 = **58 条**（含仅方法学可见的 4 条：`kpi.gdp_current_implied`、`kpi.internet_users_2031`、`kpi.payment_fee_rate`、`kpi.wallet_penetration_total_pop`）。

---

## 3. 图表与组件建议

| 图表 / 组件 | 用于区块 | 数据 | 关键规则 |
|---|---|---|---|
| `KpiTicker`（4 个大数） | 00 Hero | `kpi.mau_2031` / `kpi.revenue_total_2031` / `kpi.wallets_2031` / `kpi.jobs_5y` | 进入视口 count-up 一次；range KPI 显示两端 |
| `KpiCounterGrid`（7 个大数） | 09 Chiffres 2031 | 2031 核心 7 条 | 每个数字带类型徽章；点击开方法学 |
| `LineChart`（三轴或三线） | 05 / 08 | `kpi.series.mau` / `dau` / `minutes` | 同横轴 2027–2031；可切换显示；不截断 Y 轴误导 |
| `DonutChart` | 09 | `kpi.revenue_mix_midpoint`（面积）+ 区间标签 | 不能只显示中点；图例保留区间；见 QA-6 |
| `NestedBars`（就业三层） | 09 / 10 | `direct_jobs_short_term` / `related_jobs_mlt` / `jobs_5y` | 三层嵌套/并列均可，但必须显示「ne pas additionner」 |
| `FlowGraph` | 02 / 07 | `relations[]`（35 条） | 五类流分色；筛选/isolate；移动端列表替代 |
| `Timeline` | 08 | `roadmap.tracks` + series | 三轨道可切换；里程碑点击内联展开；算力用相对月数 |
| `WestAfricaMap` | 10 | `regions[]` + `kpi.wa_goods_transit` | Nouakchott 为 hub；流向只表达类型，不编造分国强度 |
| `ComputePhases` | 06 / 08 | 算力 6 条 KPI | Phase 1 的 ≈1 MW 与 20–50 MW 分开展示（QA-5） |
| `MethodologyDrawer` | 全局 | 所有 KPI 的 `type/formula/sourceLines` | 固定三段：Source / Dérivé / Hypothèse + 公式 + 源文行号 |

---

## 4. 派生公式清单（F1–F10）

| 编号 | 公式 | 结果 | 用于 KPI |
|---|---|---|---|
| F1 | `DAU ÷ MAU` | 800 000 ÷ 2 500 000 = 32 % | `kpi.stickiness_dau_mau_2031`、`kpi.series.stickiness` |
| F2 | `MAU ÷ part des internautes` | 2 500 000 ÷ 0,60 = 4 166 667 ≈ 4,2 M | `kpi.internet_users_2031`（QA-4 循环依赖） |
| F3 | `vues/jour = minutes/jour × 60 ÷ durée moyenne` | 40 × 60 ÷ 60 = 40 vues/jour | `kpi.daily_views_2031` |
| F4 | `vues/an = vues/jour × 365` | 32 000 000 × 365 = 11,68 Md | `kpi.annual_views_2031` |
| F5 | `flux de paiement = revenus RIMP ÷ taux de commission` | 90–140 M ÷ 0,5–0,7 % = 12,9–28 Md → 统一 15–25 Md | `kpi.payment_flow_2031`（QA-1） |
| F6 | `créateurs actifs = MAU × 2 %` | 2 500 000 × 0,02 = 50 000 | `kpi.creators_active_2031`（Hypothèse） |
| F7 | `créateurs monétisés = créateurs × 20 %` | 50 000 × 0,20 = 10 000 | `kpi.creators_monetized_2031`（Hypothèse） |
| F8 | `GMV = MAU × panier annuel` | 2 500 000 × 80–120 = 200–300 M USD | `kpi.ecommerce_gmv_2031`（Hypothèse） |
| F9 | `croissance projetée = baseline + uplift` | 4,5 % + 0,8–1,5 pt = 5,3–6,0 % | `kpi.gdp_growth_projected` |
| F10 | `part du PIB = revenus ÷ PIB actuel`；反向 `PIB = revenus ÷ part` | 150–220 M ÷ 1,3–1,9 % ≈ 11,5–11,6 Md | `kpi.revenue_gdp_share_2031`、`kpi.gdp_current_implied` |

**派生规则**：任何派生必须同时满足 ①公式写在本文件与 JSON `formula` 字段；②页面显示 `Dérivé` 徽章；③不覆盖 Source 原值；④不把假设参数写成事实（如费率、客单价、人口基数）。

---

## 5. QA 修正清单（源文件口径矛盾与推荐统一口径）

> BRIEF §7.3 四项 + 本轮新发现的 3 项。处理原则：**不改源文件、不悄悄改数**；页面按「推荐统一口径」显示，并在方法学中说明差异。

### QA-1 · 年支付流量「数百亿美元」与 RIMP 收入不自洽

- **源文位置**：L74（`volume annuel des flux de paiement de l'ordre de centaines de milliards de dollars`）vs L80（RIMP 年收入 90–140 M USD）。
- **问题**：若按 90–140 M USD 收入、0,5–0,7 % 综合费率反推，年流量应为 13–28 Md USD，而非「数百亿至数百亿美元」（centaines de milliards = 100+ Md）。源文数字量级差约 10 倍。
- **推荐统一口径（FR）**：`Flux de paiement annuels : 15–25 Md USD/an (150–250 milliards USD)`，标注类型 `Dérivé`（假设综合费率 0,5–0,7 %）。
- **前端处理**：只显示 15–25 Md USD/an；方法学抽屉说明：「源文提及『数百亿美元』，与 RIMP 收入反推的 13–28 Md 不一致；上线采用 BRIEF §7.2 推荐的 15–25 Md 区间，待客户确认是否原意为『数千亿乌吉亚』。」不得原文照抄「centaines de milliards de dollars」。
- **影响 KPI**：`kpi.payment_flow_2031`、`kpi.payment_fee_rate`。

### QA-2 · 「2,8 M 钱包 ≈ 成年人口一半」与人口规模、成人账户 ≈50 % 三处不自洽

- **源文位置**：L73（`2,8 M comptes, couvrant environ la moitié de la population adulte`）vs L98（`comptes numériques adultes passant de moins de 20 % à environ la moitié`）。
- **问题**：若 2,8 M ≈ 成年人口一半，则成年人口需 5,6 M，已超过毛里塔尼亚全国人口量级；同时 L98 说成人数字账户 2031 年约 50 %，按该口径成人账户仅约 1,4–1,6 M，与 2,8 M 冲突。三处不能同屏并列。
- **推荐统一口径（FR）**：① `2,8 M comptes portefeuille RIMP — comptes cumulés, multi-comptes et comptes inactifs inclus`（Source L73 的账户数，不换算成年人口比例）；② 成人数字账户 ≈50 % 作为**独立指标**（Source L98），不写「≈ 成年人口一半」。若必须给人口占比，用方法学标注「≈ 57 % de la population totale（hypothèse démographique externe, à valider）」。
- **前端处理**：09 与 03 只显示「2,8 M comptes」+ 徽章 `Source`；「≈ 50 %」单独一行带 `Source`；方法学说明两者口径不同。禁止出现「couramment la moitié de la population adulte」。
- **影响 KPI**：`kpi.wallets_2031`、`kpi.adult_accounts_2031`、`kpi.wallet_penetration_total_pop`。

### QA-3 · 就业三组数字并列会互相打脸

- **源文位置**：L88（2 000–4 000 短期直接+关联）、L91（8 000–15 000 中长期关联，含物流）、L97（30 000–40 000 五年直接+生态累计）。
- **问题**：三组未标时间与口径，若同页并列且无解释，读者会以为互相矛盾或简单相加。
- **推荐统一口径（FR）**：三层标签固定为 ① `2–4 k — emplois directs et connexes, première vague (0–24 mois)`；② `8–15 k — emplois connexes, moyen et long terme (logistique incluse)`；③ `30–40 k — cumul direct + écosystème sur cinq ans`。三行之间加注 `Ne pas additionner — horizons et périmètres différents`。
- **前端处理**：用嵌套条或三张独立标签卡，禁止堆叠相加；tooltip 显示口径；2031 主视觉只用一个（建议 30–40 k，标「5 ans, cumul」）。
- **影响 KPI**：`kpi.direct_jobs_short_term`、`kpi.related_jobs_mlt`、`kpi.jobs_5y`。

### QA-4 · 「60 %+ 网民」与 MAU 2,5 M 的循环依赖

- **源文位置**：L58（`environ 60 %+ des internautes de l'époque`）vs L72（MAU 2,5 M）。
- **问题**：两个数字必须绑定同一年（2031）与同一网民口径；若网页同时显示「2,5 M MAU」和「60 %+ 网民」，隐含网民 4,2 M，但 4,2 M 本身是由 2,5 M ÷ 60 % 反推，属循环论证。
- **推荐统一口径（FR）**：显示 `≈ 60 % des internautes de 2031`，方法学注明「base : ≈ 4,2 M internautes (dérivé de 2,5 M ÷ 60 %, hypothèse)」；不得把 4,2 M 当作独立的官方网民数。
- **前端处理**：`kpi.internet_users_2031` 只在方法学抽屉出现；主视觉不上「4,2 M 网民」大数字。
- **影响 KPI**：`kpi.netizen_share_2031`、`kpi.internet_users_2031`。

### QA-5 · 算力「Phase 1」两个功率口径（≈1 MW vs 20–50 MW）

- **源文位置**：L61（Phase 1：`puissance d'environ 1 MW`）vs L91（`première phase de calcul vert de 20–50 MW`）。
- **问题**：两个「Phase 1」都被表述为一期，但功率差 20–50 倍；若并列会显得数据错误。
- **推荐统一口径（FR）**：区分两个指标 —— ① `Phase 1 — charge informatique : ≈ 1 MW (≈100 cartes)`（L61）；② `Programme d'électricité verte : 20–50 MW (capacité site / horizon post-phase 1)`（L91）。页面分开呈现，不放在同一张卡片同一行。
- **前端处理**：06 算力三期卡只放 ≈1 MW / 2–3 MW；20–50 MW 放「中长期绿电项目」独立卡片并标注方法学；08 时间轴不把 20–50 MW 放入 Phase 1 节点。
- **影响 KPI**：`kpi.compute_phase1_mw`、`kpi.compute_green_program_mw`。

### QA-6 · 收入三分项上限相加 230 M ≠ 总数 220 M

- **源文位置**：L78–L83（RIMU 30–50 / RIMP 90–140 / Calcul 30–40 / Total 150–220 M USD）。
- **问题**：低端相加 30+90+30 = 150 ✓；高端相加 50+140+40 = 230 ≠ 220。三个分项区间与总数区间不可能同时取满。
- **推荐统一口径（FR）**：保留 Source 总数 `150–220 M USD` 为唯一官方总数；分项只显示各自区间；环形图面积用中点（40/115/35，合计 190）并注 `Milieux de fourchette utilisés pour la surface ; le total affiché reste 150–220 M USD (Source)`。
- **前端处理**：环形图不得自动求和成 230；图例显示区间；hover 显示「区间与总数非严格可加」；方法学说明。
- **影响 KPI**：`kpi.revenue_total_2031`、`kpi.revenue_rimu_2031`、`kpi.revenue_rimp_2031`、`kpi.revenue_compute_2031`、`kpi.revenue_mix_midpoint`。

### QA-7 · 算力收入 2031（30–40 M）与绿电一期服务收入（数千万–1 亿）口径重叠

- **源文位置**：L81（2031 年算力收入 30–40 M USD）vs L91（一期绿电算力投运后年服务收入「数千万至 1 亿 USD」）。
- **问题**：两个数字可能指同一业务的不同时点，若在同页并列且不标注年份，读者会重复计算或以为矛盾。
- **推荐统一口径（FR）**：2031 展示只用 `30–40 M USD/an (2031)`（Source L81，归入 150–220 总数）；`plusieurs dizaines à ~100 M USD/an` 作为「中长期潜力（horizon non daté）」单独标注，不与 2031 数字相加。
- **前端处理**：09 环形图只用 30–40 M；10 中长期卡显示潜力区间并带 `horizon non daté` 标签；两处不得同时出现在同一数字组。
- **影响 KPI**：`kpi.revenue_compute_2031`、`kpi.compute_services_revenue_lt`。

---

## 6. `data-model.json` 结构说明（供前端/T3）

| 顶层键 | 类型 | 内容 |
|---|---|---|
| `meta` | object | 项目、客户、日期、语言、`heroKpis`、格式化规则、动画预设、品牌参考、联系方式、方法学文案、免责声明 |
| `kpis` | array | 58 条 KPI，字段见下 |
| `pillars` | array | 三支柱（id、FR/ZH 名称、承诺、bullets、kpiIds、drawer 概览） |
| `businessLines` | array | 六大业务线（id、nameFR/ZH、stage、tags、kpiIds、flowIn/flowOut、subModules、actors、risks、tagline、定义、来源） |
| `relations` | array | 35 条关系边，五类流：`capital / marchandises / paiements / donnees / attention` |
| `regions` | array | Nouakchott hub + 5 个西非国家（id、名称、流向类型、说明） |
| `rimuModules` | array | RIMU 8 个模块 |
| `aiUseCases` | array | AI 用例（3 组 8 条） |
| `layers` | array | 四层架构 |
| `roadmap` | object | `tracks[]`：双边三步 / RIMU 五年 / 算力三期 |
| `risks` | array | 五类风险与缓解 |
| `stateSupports` | array | 五项国家支持 |
| `transformations` | array | 结构性转型 before/after |
| `qa` | array | 7 条 QA（本文件 §5 的机器可读版） |
| `assumptions` | array | 工作假设（人口、费率、客单价、启动时间等） |
| `sources` | array | 源文件与参考文件索引（含行号） |

**`kpis[]` 单条字段**：

```
id (string)                 // 唯一，kpi.*
nameFR / nameZH (string)
valueType (string)          // number | range | series | object | percent
value (number|null)         // 单值
range ([number, number]|null)
series ([{year:number, value:number}]|null)
unitFR / unitZH (string)
year (string)               // '2031' | '2027–2031' | 'Phase 1' ...
type (string)               // Source | Dérivé | Hypothèse
confidence (string)         // élevée | moyenne | à valider
formula (string|null)
assumption (string|null)
displayFR / displayZH (string)
displayLongFR / displayLongZH (string|null)
chart (string)              // 建议图表
component (string)          // 建议组件
animation ({trigger, preset, delayMs})
surfaces ([string])         // 出现的区块 id
sourceLines ([number])      // 源文行号
sourceRef (string)          // sources[] 的 id
notes (string|null)
```

**校验命令**（只读，不修改工作区）：

```bash
node -e "const d=require('./web/spec/data-model.json'); console.log('kpis',d.kpis.length,'lines',d.businessLines.length,'relations',d.relations.length,'qa',d.qa.length)"
```

预期：`kpis 58 lines 6 relations 35 qa 7`。

---

## 7. 数字追溯矩阵（源文行号 → KPI）

| 源文行 | 内容 | 对应 KPI |
|---|---|---|
| L26–L32 | RIMU 模块与四 tab | `rimu_tabs`、`short_video_seconds`、`medium_video_seconds`、`default_bitrate`、`languages_content` |
| L34–L37 | AI 内容能力、未成年人保护 | 无 KPI（定性，见 content-model 05/06） |
| L40–L43 | AI 用例 | 无 KPI（定性） |
| L47–L49 | 双边三步 | `projects_first_wave` 等短期 KPI 的叙事来源 |
| L54–L58 | 五年曲线 | `series.mau/dau/minutes`、`mau_2031`、`dau_2031`、`daily_minutes_2031`、`netizen_share_2031` |
| L61–L62 | 算力 Phase 1/2 | `compute_phase1_duration_months`、`compute_phase1_cards`、`compute_phase1_mw`、`compute_phase2_duration_months`、`compute_phase2_mw` |
| L66 | 西非五国与展贸 | `wa_countries`、`showroom_count` |
| L72–L74 | 2031 MAU / 钱包 / 支付流量 | `mau_2031`、`wallets_2031`、`payment_flow_2031`（QA-1） |
| L79–L83 | 收入三分项与总数 | `revenue_rimu/rimp/compute/total_2031`、`revenue_gdp_share_2031`、`revenue_mix_midpoint`（QA-6） |
| L86 | 首批项目与投资意向 | `projects_first_wave`、`investment_intentions` |
| L87 | 批发撮合与消费品试单 | `wholesale_matching`、`consumer_trial_orders_y1` |
| L88 | 培训 / 远程医疗 / 短期就业 | `training_people`、`telemedicine_points`、`direct_jobs_short_term` |
| L90–L91 | 过境货值 / 关联就业 / 绿电算力 | `wa_goods_transit`、`related_jobs_mlt`、`compute_green_program_mw`、`compute_services_revenue_lt`（QA-5/7） |
| L92 | 4,5 % 基线 + 0,8–1,5 pt | `gdp_growth_baseline`、`gdp_growth_uplift`、`gdp_growth_projected` |
| L97 | 30–40 k 就业 | `jobs_5y`（QA-3） |
| L98 | 成人数字账户 <20 % → ≈50 % | `adult_accounts_before`、`adult_accounts_2031`（QA-2） |
| L108 | 六个月内算力预研第一版 | `first_deliverable_months` |
| BRIEF §7.2 | 允许派生清单 | `daily_views_2031`、`annual_views_2031`、`internet_users_2031`、`creators_*`、`ecommerce_gmv_2031`、`payment_flow_2031` |
| BRIEF §7.3 | 四项口径修正 | QA-1 ~ QA-4 |
| README §3 | 联系人 / 职位 / 联系方式 | `meta.contact`（非 KPI） |

---

## 8. 自检结果

- [x] 58 条 KPI 全部有 id、FR/ZH 名称、数值、单位、年份、类型、来源行号、展示格式、组件/动画字段。
- [x] 所有 Dérivé 均有公式（F1–F10），所有 Hypothèse 均有假设说明；Source 不写公式。
- [x] BRIEF §7.3 四项口径冲突全部进入 QA 清单（QA-1 ~ QA-4），并新增 QA-5（算力双 Phase 1 功率）、QA-6（收入分项相加 230 ≠ 220）、QA-7（算力收入两个口径）共 7 条。
- [x] 未修改源文件任何数字；推荐口径均标注「BRIEF §7.2/§7.3 推荐」或「本轮建议，待客户确认」。
- [x] 区间 KPI 均禁止只显示中点；环形图规则见 QA-6；就业三层见 QA-3。
- [x] JSON 结构说明与校验命令同步 `data-model.json`；页面可 `JSON.parse` 后直接渲染。
- [x] 数字格式化规则覆盖 FR（逗号小数、不换行空格、en dash）与 ZH（万/亿）。

---

> 文件结束。配套：`web/spec/content-model.md`（14 区块内容）、`web/spec/data-model.json`（机器可读数据）。