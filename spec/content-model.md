# web/spec/content-model.md — 内容模型（14 区块 + 可复用内容实体）

> **2026-11-09 更新（拍板后）**：RIMU 产品语言首期调整为 **法语、阿拉伯语、英语**；hassaniya、peul、soninké、wolof 等本地语言列入二期。站点实现以 `web/site/assets/js/content.js` 与 `data.js` 为准（已同步更新，本文部分 RIMU 语言描述保留为历史设计稿）。

> 版本 v1.0 · 2026-11-09 · 负责人：content-analyst（T1）
> 依据：`web/spec/BRIEF.md`；`rimu_source_text.txt`（117 行法语全文，含三处表格：L18–24 四层架构、L52–59 五年曲线、L77–83 收入构成）；`README.md` §2/§3/§8；`presentation/index.html` 顶部 CSS 品牌语言。
> 配套文件：`web/spec/data-model.md`（KPI 字典 + 口径 QA）、`web/spec/data-model.json`（页面直接读取）。
> 本文件只定义「内容与数据引用」；像素级布局、动效参数、组件状态由 T2 `interaction-motion.md` / `visual-system.md` 补全。所有 KPI id 均可在 data-model.json 中按 id 检索；所有 `Lxx` 指 `rimu_source_text.txt` 行号。
> 语言策略：页面默认法语，中文为切换语言；阿语 RTL 第二期预留（BRIEF §8）。本文法语文案均可直接上线，中文为对照译文。

---

## 0. 使用与执行约定

### 0.1 文件定位与阅读路径

- Lead 合并 `web/PLAN_v1.md` 时，本篇 = 「内容层」附录；区块 00–13 的标题、正文、KPI 引用、交互意图均以本篇为准。
- 前端执行顺序：先读 `data-model.json` 取数与 i18n 文案 → 再读本篇取区块叙事与卡片文案 → 视觉/动效细节读 T2 文件。
- 同一内容不要在页面手写两遍：业务线、RIMU 模块、AI 用例、风险、国家支持等均在 JSON 中有结构化镜像（`businessLines` / `rimuModules` / `aiUseCases` / `risks` / `stateSupports`），组件只渲染 JSON。

### 0.2 数据标注体系（页面可见）

| 标签 | 含义 | 页面用法 | 视觉建议（T2 细化） |
|---|---|---|---|
| **Source** | 源文件明示数字，未做任何换算 | 数字后跟小徽章 `Source`，hover/点击显示「Document de référence, novembre 2026」 | 香槟金细描边徽章 |
| **Dérivé** | 由 Source 数字按公式换算 | 徽章 `Dérivé` + 点击打开公式（Méthodologie） | 信号绿 `#00A86B` 仅用于正向数据，面积 ≤10%，此徽章用金色描边+绿点 |
| **Hypothèse** | 工作假设，待客户/市场验证 | 徽章 `Hypothèse`，必须配「à valider」字样 | 象牙白虚线描边，不用绿色 |

强制规则：任何数字不得无标签上线；区间数字不得只显示中点而不显示区间（例：收入必须显示「150–220 M USD」，不得只显示 185 M）；「scénario ambitieux」必须出现在 2031 数据区块的标题或徽章中（源文 L50、L75 均标注）。

### 0.3 法语排版与数字格式（生产规则）

1. 小数用逗号：`2,5 M`、`1,3 %`；千位分隔用不换行空格（生产环境 U+202F NARROW NO-BREAK SPACE，本文档为可读性示意为普通空格）。
2. 范围用 en dash（–）不用 hyphen：`150–220 M USD`、`2 000–4 000`；口语化长文可写 `de 800 millions à 1,2 milliard USD`。
3. 百分号前留不换行空格：`1,3–1,9 %`；百分点缩写 `pt`（`+0,8–1,5 pt`）。
4. 币种后置：`150–220 M USD`、`800 M–1,2 Md USD`（M = million，Md = milliard）；不写 `USD 150M`。
5. 页面数字一律从 `data-model.json` 的 `displayFR` / `displayZH` 读取，禁止前端手写或二次四舍五入。
6. 中文格式：万/亿（`250 万`、`1.5–2.2 亿美元`、`150–250 亿美元`）；百分比小数用点；区间用 –。
7. 年份区间用 –：`2027–2031`；单年不写「年」后缀（`2031`），中文可写「2031 年」。

### 0.4 假设与决策记录（AD = Assumption / Decision）

| 编号 | 决策 | 理由与依据 | 影响范围 |
|---|---|---|---|
| AD-1 | Hero 主标语采用 **« Une plateforme. Trois souverainetés. »**，副标语承载中毛与西非关系 | BRIEF §3 候选 1，最短、最可记、直接对应三支柱；候选 2 降级为社交分享 OG 描述 | 00 Hero、og:description |
| AD-2 | 六大业务线 stage 指派：Projets **mature** / Commerce de gros **mature** / Biens de consommation **pré-étude** / Finance & RIMP **pilote** / Formation **mature** / Santé **pilote** | 源文 L7 明示现有合作清单（mines、commerce de gros、formation 等已存在）；L7 明示 biens de consommation 与 hub 为「pré-étude」；L88 首批远程医疗为试点性质；L56–57 支付仍处互操作化前阶段 | 04、各业务抽屉、data-model.json |
| AD-3 | 2031 收入构成环形图用「区间中点」（RIMU 40 / RIMP 115 / Calcul 35 M USD，合计 190 M），图上同时保留区间标签 | 三个区间直接相加无法对齐 Source 总数 150–220（见 QA-6），中点只用于图形面积，不替换 Source 数字 | 09 环形图、data-model.json chart |
| AD-4 | 算力时间轴用「相对月数 + 假设起点 2026-H2」，不写死绝对年份 | 源文只给 ≈18 / ≈36 个月（L61–62），未给启动日期；写死年份是虚构精度 | 08 算力轨道 |
| AD-5 | 2,8 M 钱包按「累计账户（含多账户）」处理，不与「成年人口一半」绑定；成人数字账户 ≈50 % 为独立指标 | 源文 L73 与 L98 的口径冲突需拆开（QA-2）；BRIEF §7.3-2 给出「定义为账户数（含多账户）」的推荐路径 | 03、05、09、10 |
| AD-6 | 支付流量统一采用 BRIEF §7.2 推荐口径 **« 15–25 Md USD/an »（150–250 亿美元）** | 源文 L74「centaines de milliards de dollars」与 RIMP 收入 90–140 M USD 不自洽（QA-1）；BRIEF §7.3-1 给出推荐 | 07、09、10、data-model.json |
| AD-7 | 联系方式沿用 README §3（Benjamin LIU / Vice-président / 电话 / 邮箱 / 微信 / 官网），标注「上线前确认」 | 本任务不向用户提问；README §3 已提醒个人联系方式公开前需确认 | 13 Next steps |
| AD-8 | 本期不做阿语 RTL，不做官方阿语译名 | BRIEF §8「第二期」；README §3 明确「源文件中没有官方阿语名称，阿语版本应由宣誓译员另行制作」 | 全局 i18n |
| AD-9 | 西非地图取 5 国（Sénégal / Mali / Guinée / Côte d'Ivoire / Gambie），流向只用类型不用编造流量 | 国别清单来自 L66；流量强度源文只给总量（L90、L101），不给分国数据 | 10 地图 |
| AD-10 | Hero 四个滚动 KPI 选 MAU / 总收入 / RIMP 钱包 / 五年就业，不选西非转运额 | 西非转运额是中长期间接口径，放 Hero 会与 2031 数据混用时间轴 | 00 Hero |

---

## 1. 叙事主线 → 14 区块映射

| 幕 | 区块 | 一句话作用 | 主 CTA / 出口 |
|---|---|---|---|
| I. Le constat | 00 Hero + 01 Constat | 3 秒定位 + 制造必要性 | `Visite guidée 3 min` |
| II. La réponse | 02 Vue système + 03 三支柱 | 一屏看懂「一个入口 + 一个超级应用 + 一个算力底座」 | 点击节点进抽屉 |
| III. Le système | 04 六大业务 + 05 RIMU + 06 Contenu IA & Calcul + 07 Relations | 业务如何咬合、五类流如何循环 | 业务/模块抽屉 |
| IV. La trajectoire | 08 Feuille de route | 时间可信度：双边三步 / RIMU 五年 / 算力三期 | 切换轨道 |
| V. L'impact & la décision | 09 Chiffres 2031 + 10 Bénéfices + 11 Soutiens + 12 Risques + 13 Next steps | 数据冲击 → 国家收益 → 诉求 → 兜底 → 转化 | `Voir les chiffres 2031` / 预约会议 |

**五幕主标语建议**（转场页与 Mode Pitch 章节标题复用）：
1. `I. Le constat — Pourquoi maintenant` / 现状——为什么是现在
2. `II. La réponse — Un point d'entrée, une super-application, un socle` / 答案——一个入口、一个超级应用、一个底座
3. `III. Le système — Six filières, cinq flux` / 系统——六条业务线、五类流
4. `IV. La trajectoire — 2026–2031` / 轨迹——2026–2031
5. `V. L'impact — Ce que cela change` / 效果——它改变了什么

---

## 2. 区块规格（00–13）

### 00 · Hero — 3 秒定位

**目标**：3 秒回答「这是什么 / 谁在做 / 多大」；为 Mode Pitch（`?tour=1`）与 2031 数据页制造入口；主标语与三支柱一屏可见。

**布局要点**
- 100 vh 深海军蓝（`#071C36`）沉浸式；左 56 % 文案，右 44 % 动态「中国—毛里塔尼亚—西非」连线与数据粒子；金色细线网格与坐标刻度做底纹。
- 顶部：左品牌字标 `AUREON DIGITAL`；右语言切换 `FR / 中文`（阿语置灰预留）。
- 中部：kicker → H1 → 副标题 → 双 CTA。
- H1 下方：三支柱迷你条（三个等宽 `Point d'entrée bilatéral / Super-application RIMU / Centre national de calcul IA`）。
- 底部：4 个滚动 KPI（等宽数字 + 金色竖分隔线 + 标签），左端滚动提示 `Faire défiler — 5 actes`。
- 移动端：粒子降级为静态 SVG 路线；KPI 2×2；CTA 纵向全宽。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 kicker | `Nouakchott · 2026–2031 · Chine — Mauritanie` | 努瓦克肖特 · 2026–2031 · 中国—毛里塔尼亚 |
| H1 | `Une plateforme. Trois souverainetés.` | 一个平台，三重主权。 |
| 副标题 | `La plateforme de coopération numérique sino-mauritanienne est le point d'entrée officiel commun aux deux pays : projets, commerce, finance, formation et santé, reliés à une super-application nationale et à un socle de calcul IA souverain.` | 中毛数字合作平台是两国共同的官方入口：把项目、贸易、金融、培训、卫生，接到一个国民级超级应用与一个主权 AI 算力底座上。 |
| 三支柱条 1 | `Point d'entrée bilatéral` | 双边合作入口 |
| 三支柱条 2 | `Super-application RIMU` | RIMU 超级应用 |
| 三支柱条 3 | `Centre national de calcul IA` | 国家 AI 算力中心 |
| KPI 1 标签 | `Utilisateurs actifs mensuels · 2031`（值：**2,5 M**） | 月活用户 · 2031（250 万） |
| KPI 2 标签 | `Revenus annuels · 2031`（值：**150–220 M USD**） | 年收入 · 2031（1.5–2.2 亿美元） |
| KPI 3 标签 | `Portefeuilles RIMP`（值：**2,8 M**） | RIMP 钱包账户（280 万） |
| KPI 4 标签 | `Emplois directs + écosystème · 5 ans`（值：**30–40 k**） | 直接与生态就业 · 5 年（3–4 万） |
| CTA 主 | `Visite guidée 3 min` | 3 分钟引导参观 |
| CTA 次 | `Voir les chiffres 2031` | 查看 2031 数据 |
| 滚动提示 | `Faire défiler — 5 actes` | 向下滚动 — 五幕 |
| 语言切换 aria | `Changer de langue : français / chinois` | 切换语言：法语 / 中文 |
| OG 描述（社交） | `Relier la Chine et l'Afrique de l'Ouest, depuis Nouakchott : un point d'entrée bilatéral, une super-application nationale, un socle de calcul IA souverain.` | 从努瓦克肖特连接中国与西非：一个双边入口、一个国民超级应用、一个主权 AI 算力底座。 |

**数据引用**：`kpi.mau_2031`、`kpi.revenue_total_2031`、`kpi.wallets_2031`、`kpi.jobs_5y`；三支柱条分别绑定节点 `p.plateforme` / `p.rimu` / `p.calcul`（点击进入 03 或直接打开对应抽屉）。

**交互要点**
- CTA 主 → 启动 Mode Pitch（3 分钟 6–8 场景，见 BRIEF §5）；CTA 次 → 平滑滚动到 09。
- 粒子沿「Beijing → Nouakchott → Dakar/Bamako/Conakry/Abidjan/Banjul」路径流动，8 s 循环，低带宽自动关闭。
- KPI 进入视口触发一次 count-up；回看可重播（IntersectionObserver 释放后再次进入）。
- 三支柱条 hover 高亮，点击打开对应 L2 抽屉；键盘 Tab 可达。
- 无自动播放声音；首屏不依赖 WebGL。

**响应式与降级**：移动端 390 px 单列，H1 降为 2 行内；粒子/流动动画关闭为静态 SVG；`prefers-reduced-motion` 下无流动、无 count-up，直接显示终值。

**来源**：L6（三支柱定位）、L7–L8（三支柱内容）、L14（四个战略目标）、L72（MAU）、L73（钱包）、L82（收入）、L97（就业）；BRIEF §3 候选标语、§4 区块 00、§6 视觉方向。

---

### 01 · Constat — 制造必要性

**目标**：先用 4 个「今天的问题」建立紧迫感，再用一句转折引出「答案不是网站，是系统」；承接 Hero 的 3 秒定位进入「为什么是现在」。

**布局要点**
- 象牙白编辑式（`#F6F0E4`）反色过渡；左标题 + 右 4 张问题卡（2×2 网格）；每卡：一个 6–9 词标题、一句后果、一条细金线。
- 区块底部一条横向分割线 + 居中转折句；转折句下方为「Aujourd'hui / Avec la plateforme」前后对比条（同一指标、两种状态）。
- 移动端：4 卡单列；对比条改为纵向两行。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `01 · Le constat` | 01 · 现状 |
| 标题 | `Ce qui bloque aujourd'hui` | 今天，卡在哪里 |
| 副标题 | `Quatre blocages structurels — et une réponse qui n'est pas un site de plus.` | 四道结构性堵点——而答案不是再做一网站。 |
| 问题卡 1 | **`L'attention s'exporte`** — `Les plateformes étrangères captent le temps d'écran des jeunes ; aucune règle nationale ne pilote la recommandation.` | **注意力在出口**——外国平台拿走年轻人的屏幕时间，推荐规则不在本国手里。 |
| 问题卡 2 | **`L'argent circule hors circuit`** — `Moins de 20 % des adultes disposent d'un compte numérique ; l'économie de cash reste difficile à auditer.` | **钱在账外循环**——不到 20 % 的成年人有数字账户，现金经济难以审计。 |
| 问题卡 3 | **`Les données restent ailleurs`** — `Données, modèles et modération sont hébergés à l'étranger : ni les poids ni la recommandation ne sont maîtrisés.` | **数据留在别处**——数据、模型与审核托管在境外，权重与推荐都不受控。 |
| 问题卡 4 | **`Une économie mono-export`** — `Minerais bruts et captures non transformées portent les recettes ; la croissance (4,5 %) dépend d'un seul prix.` | **单一出口经济**——原矿与未加工渔获撑起收入，4.5 % 的增长系于一个价格。 |
| 对比条左 | `Aujourd'hui : comptes numériques adultes < 20 %` | 今天：成年人数字账户 < 20 % |
| 对比条右 | `Avec la plateforme : ≈ 50 % à l'horizon 2031` | 有平台后：2031 年前后约 50 % |
| 转折句 | `La réponse n'est pas un site de plus. C'est un système : un point d'entrée bilatéral, une super-application, un socle de calcul.` | 答案不是再做一个网站，而是一套系统：一个双边入口、一个超级应用、一个算力底座。 |
| 对比切换标签 | `Aujourd'hui` / `Avec la plateforme (2031)` | 今天 / 有平台（2031） |
| 引导按钮 | `Voir la réponse →` | 看答案 → |

**数据引用**：`kpi.adult_accounts_before`（<20 %）、`kpi.adult_accounts_2031`（≈50 %）、`kpi.gdp_growth_baseline`（4,5 %）、`kpi.gdp_growth_uplift`（+0,8–1,5 pt）。四个问题卡中只有第 2、4 张带数字；第 1、3 张为定性（不造数，避免伪精确）。

**交互要点**
- 卡片 hover 时问题标题由金色转深蓝并显示「conséquence」下划线；点击卡片不跳页，而在原位展开一句更长的后果说明（L3 下钻，避免 L2 抽屉过重）。
- 前后对比条：可拖动中轴切换 Aujourd'hui / 2031 两种状态；切换时数字 count-up。
- 转折句「Voir la réponse →」平滑滚动到 02。
- `prefers-reduced-motion`：对比条直接切换终值，无过渡。

**响应式与降级**：390 px 单列卡片；对比条纵向两行；印刷版（A4 横向）保留 4 卡一行 + 转折句单独一栏。

**来源**：L10（外国平台影响、内容主权）、L14（四个战略目标）、L92（4,5 % 基线）、L96（单一矿价依赖）、L98（成年人数字账户 <20 % → ≈50 %）、L99（数据/模型/账本留在境内）；BRIEF §3 第 1 幕、§4 区块 01。

---

### 02 · Vue système — 一屏看懂全局

**目标**：L1 总览层：5 秒建立「三支柱 + 六业务 + 四层架构 + 五类流」的全局心智；作为所有 L2 抽屉的导航中枢。

**布局要点**
- 全屏深色；纵向三层：顶部三支柱（横向 3 卡）→ 中部六业务线（3×2 或环形布局，节点可点）→ 底部四层架构横条（4 段，可展开）。
- 右上角五类流图例（Capital / Marchandises / Paiements / Données / Attention）；左下角模式切换：`Explorer libre` / `Mode Pitch`。
- 连线为金色 1 px，流动粒子用五类流分色（金色系为主，信号绿仅用于正向数据流）；hover 节点时其他节点降透明度至 40 %。
- 移动端：纵向重排为「三支柱 → 六业务（2 列卡）→ 四层」；关系图替换为按五类流分组的可折叠列表。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `02 · Le système` | 02 · 系统 |
| 标题 | `Un système, pas une somme de projets.` | 一套系统，而非项目拼盘。 |
| 副标题 | `Trois piliers, six filières, quatre couches. Cliquez un nœud : le détail s'ouvre, les flux liés s'allument.` | 三支柱、六业务线、四层架构。点击任一节点打开详情，关联流即时高亮。 |
| 图例 Capital | `Capital — financements, intentions d'investissement, capital humain` | 资本——融资、投资意向、人力资本 |
| 图例 Marchandises | `Marchandises — biens de consommation, équipements, électricité verte` | 货物——消费品、设备、绿电 |
| 图例 Paiements | `Paiements — RIMP, encaissement marchand, transfrontalier` | 支付——RIMP、商户收单、跨境 |
| 图例 Données | `Données — contenus, données sectorielles, modèles et inférence` | 数据——内容、行业数据、模型与推理 |
| 图例 Attention | `Attention — temps d'écran, audiences, visibilité institutionnelle` | 注意力——屏幕时间、受众、机构曝光 |
| 操作提示 | `Cliquez un nœud pour ouvrir le détail` / `Isoler un flux` / `Tout afficher` | 点击节点打开详情 / 只看某类流 / 全部显示 |
| 模式切换 | `Explorer libre` / `Mode Pitch 3 min` | 自由探索 / 3 分钟引导模式 |
| 底层标签 | `Couche expérience · middleware · intelligente · infrastructure` | 体验层 · 中间件层 · 智能层 · 基础设施层 |

**数据引用**：三支柱 KPI 摘要（见 03）；六业务线 `stage` 与节点 id（`b.projets`、`b.commerce-gros`、`b.biens-conso`、`b.finance-rimp`、`b.formation`、`b.sante`）；关系边来自 `data-model.json → relations`（共 35 条，五类流）；四层架构文案见 06 / annexe C。

**交互要点**
- 节点 click → 打开 L2 抽屉（6 个固定 tab，BRIEF §5）；抽屉打开时背景压暗但保留系统图上下文，关联节点高亮。
- 关系图：hover 节点高亮所有关联边并显示 tooltip（边标签 + 一句流量说明）；图例点击筛选某类流；`Isoler` 只保留选中流；Esc / 返回关闭抽屉。
- URL hash 深链：`#/system`；抽屉 `#/business/rimu`、`#/pillar/calcul`（BRIEF §5 L2 规则）。
- Mode Pitch 可在本区块进入第 2 幕（自动巡游到 03→04→07）。
- 键盘：节点可 Tab + Enter；图例筛选为按钮组。

**响应式与降级**：移动端关系图不可用时，用「按五类流分组的列表 + 每条关系一行」替代；低带宽关闭粒子；reduced-motion 下连线为静态虚线。

**来源**：L6（三支柱）、L13（整合逻辑：平台/RIMU/算力如何咬合）、L16–24（四层架构）、L46–49（六类活动）、L26–32（RIMU 模块）；BRIEF §4 区块 02、§5 L1/L2。

---

### 03 · 架构三支柱 — 三个入口

**目标**：把「一个官方双边入口 + 一个国民超级应用 + 一个算力主权底座」分别讲清：是什么、为什么现在、谁参与、现状如何。

**布局要点**
- 三张纵向等高主卡（桌面 3 列，移动端单列）：顶部大序号（01/02/03）+ kicker + 标题 + 一句话承诺；中部 3 条 `—` bullets；底部 1 行 3 个 KPI + 「Ouvrir le dossier →」。
- 点击卡片 → 右侧 480–560 px 抽屉（移动端 92 vh 底部 sheet），抽屉固定 6 tab：`Aperçu / Fonctionnement / Chiffres clés / Acteurs & flux / Feuille de route / Risques`。
- 三卡用金色细线分隔；current pillar 的序号用实心金底。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `03 · Les trois piliers` | 03 · 三大支柱 |
| 标题 | `Trois entrées, une même architecture.` | 三个入口，同一套架构。 |
| 副标题 | `Un point d'entrée bilatéral pour les projets, une super-application pour les usages, un socle de calcul pour la souveraineté.` | 一个面向项目的双边入口，一个面向日常使用的超级应用，一个支撑主权的算力底座。 |
| 支柱 1 kicker | `01 · Point d'entrée` | 01 · 入口 |
| 支柱 1 标题 | `La plateforme bilatérale` | 双边合作平台 |
| 支柱 1 一句话 | `Le canal officiel unique où les deux États, les entreprises et les bailleurs publient projets, marchandises, besoins de financement et capacités.` | 两国政府、企业与出资方发布项目、商品、融资需求与产能的唯一官方渠道。 |
| 支柱 1 bullets | `Regroupe les coopérations existantes : mines, énergies nouvelles, infrastructures, transformation agro-halieutique, commerce, finance, formation, santé.` / `Trois canaux maîtrisés par l'État : financement de projets, distribution de biens de consommation vers l'Afrique de l'Ouest, monétisation de l'électricité verte.` / `Ne remplace pas les mines et pêcheries existantes : elle ajoute un canal.` | 汇聚既有合作：矿业、新能源、基建、农渔加工、贸易、金融、培训、卫生。/ 国家掌握的三个渠道：项目融资、面向西非的消费品分销、绿电变现。/ 不取代现有矿山与渔场，而是新增一个渠道。 |
| 支柱 2 kicker | `02 · Super-application` | 02 · 超级应用 |
| 支柱 2 标题 | `RIMU` | RIMU |
| 支柱 2 一句话 | `Le point d'entrée du système d'exploitation de la vie quotidienne : contenus, biens, emplois et services publics.` | 日常生活操作系统的入口：内容、商品、就业与公共服务。 |
| 支柱 2 bullets | `Quatre onglets : For You / Abonnements / À proximité / Marché.` / `Langues locales : hassaniya, peul, soninké, wolof, plus français et anglais.` / `Faible bande passante, protection des mineurs, monétisation des créateurs en ouguiyas.` | 四个 tab：For You / 订阅 / 附近 / 市场。/ 本地语言：哈桑尼亚、富拉、索宁克、沃洛夫，另加法语和英语。/ 低带宽、未成年人保护、创作者以乌吉亚变现。 |
| 支柱 3 kicker | `03 · Souveraineté` | 03 · 主权 |
| 支柱 3 标题 | `Le centre national de calcul IA` | 国家 AI 算力中心 |
| 支柱 3 一句话 | `Le socle qui garde les données, les modèles et la modération sur le territoire national.` | 把数据、模型与内容审核留在本国领土的底座。 |
| 支柱 3 bullets | `Extension du centre Tier III de Nouakchott : cluster GPU + nœuds edge + priorité à l'électricité verte.` / `Phase 1 : inférence et modération des deux plateformes (~100 cartes, ~1 MW, ~18 mois).` / `Inférence rapatriée ; grand livre et modèles centraux locaux ; entraînement possiblement hybride.` | 扩建努瓦克肖特 Tier III 数据中心：GPU 集群 + 边缘节点 + 优先绿电。/ 一期：两平台推理与审核（约 100 张加速卡、约 1 MW、约 18 个月）。/ 推理回流本国；账本与核心模型本地；训练可混合。 |
| 抽屉 tab 标签 | `Aperçu / Fonctionnement / Chiffres clés / Acteurs & flux / Feuille de route / Risques` | 概览 / 运作方式 / 关键数据 / 参与方与流 / 路线图 / 风险 |

**数据引用**：
- `p.plateforme` → `kpi.projects_first_wave`、`kpi.investment_intentions`、`kpi.wholesale_matching`
- `p.rimu` → `kpi.mau_2031`、`kpi.dau_2031`、`kpi.daily_minutes_2031`
- `p.calcul` → `kpi.compute_phase1_cards`、`kpi.compute_phase1_mw`、`kpi.revenue_compute_2031`

**交互要点**
- 卡片 click → L2 抽屉；抽屉打开后 Esc / 返回 / 浏览器后退可关闭（BRIEF §5）。
- 抽屉「Aperçu」顶部固定显示所属支柱关系（与 02 系统图联动高亮）。
- `Chiffres clés` tab 内每个数字带 Source / Dérivé / Hypothèse 徽章，点击打开方法学。
- 移动端：三卡单列，抽屉变 92 vh 底部 sheet。

**响应式与降级**：桌面三列等高；移动端单列；reduced-motion 下无卡片入场动画。

**来源**：L6（三支柱总述）、L7（双边平台定位与三渠道）、L8（RIMU 定位与内容主权）、L13（整合逻辑）、L61–64（算力三期）、L72–83（2031 数据）；BRIEF §4 区块 03。

---

### 04 · 六大业务线 — 双边合作实体业务

**目标**：以业务卡矩阵讲清「六条线分别做什么、多大、到哪一步」；作为 L2 业务抽屉的总入口。

**布局要点**
- 3×2 卡片网格（桌面 3 列 × 2 行；移动端单列）；象牙白底 + 金色细线；卡左上序号 01–06，右上 stage 徽章。
- 每卡：标题（FR + ZH 切换）→ 一句价值主张（≤18 词）→ 3 个 KPI（等宽数字一行）→ 底部 `Voir le détail →`。
- 顶部：标题 + 副标题 + stage 图例（mature / pilote / pré-étude）+ 筛选 chip（`Toutes` / 三个 stage）。
- 卡片 hover 上浮 2 px、金线变实；点击打开 L2 抽屉（6 tab）。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `04 · Six filières` | 04 · 六条业务线 |
| 标题 | `Six filières, un même point d'entrée.` | 六条业务线，同一个入口。 |
| 副标题 | `Trois niveaux de maturité : mature (coopération existante à numériser), pilote (première vague 12–24 mois), pré-étude (cadre à valider).` | 三级成熟度：成熟（既有合作数字化）、试点（12–24 个月首波）、预研（待确认框架）。 |
| 图例 mature | `Mature` | 成熟 |
| 图例 pilote | `Pilote` | 试点 |
| 图例 pré-étude | `Pré-étude` | 预研 |
| 卡片 01 | **`Projets & investissements`** — `Transformer les intentions d'investissement en projets traçables et bancables.` | **项目与投资**——把投资意向变成可追溯、可融资的项目。 |
| 卡片 02 | **`Commerce de gros`** — `Acheter chinois, livrer ouest-africain : un guichet, des règles écrites.` | **批发贸易**——买中国、卖西非：一个窗口、一套成文规则。 |
| 卡片 03 | **`Biens de consommation & hub Afrique de l'Ouest`** — `Des usines chinoises aux acheteurs ouest-africains : un hub, deux canaux — physique et en ligne.` | **消费品与西非枢纽**——从中国工厂到西非买家：一个枢纽、线上与线下两条渠道。 |
| 卡片 04 | **`Finance & RIMP`** — `Faire passer la valeur du cash au circuit numérique audité.` | **金融与 RIMP**——让价值从现金转入可审计的数字回路。 |
| 卡片 05 | **`Formation & talents`** — `Transformer chaque formation en vidéo courte et chaque compétence en emploi.` | **培训与人才**——把每场培训变成短视频，把每项技能变成就业。 |
| 卡片 06 | **`Santé & télémédecine`** — `Un spécialiste à distance, une prévention dans chaque poche.` | **卫生与远程医疗**——专家远程可达，预防装进每个人的口袋。 |
| 卡片 KPI 标签（01） | `5–8 projets` · `800 M–1,2 Md USD` · `2–4 k emplois` | 5–8 个项目 · 8–12 亿美元 · 2000–4000 就业 |
| 卡片 KPI 标签（02） | `300–800 M USD` · `800 M–2 Md USD/an` · `5 pays` | 3–8 亿美元 · 8–20 亿美元/年 · 5 国 |
| 卡片 KPI 标签（03） | `80–150 M USD` · `800 M–2 Md USD/an` · `5 pays` | 0.8–1.5 亿美元 · 8–20 亿美元/年 · 5 国 |
| 卡片 KPI 标签（04） | `2,8 M comptes` · `90–140 M USD` · `15–25 Md USD/an` | 280 万账户 · 0.9–1.4 亿美元 · 150–250 亿美元/年 |
| 卡片 KPI 标签（05） | `1 000–3 000 formés` · `8–15 k emplois connexes` · `30–40 k emplois cumulés` | 1000–3000 人受训 · 0.8–1.5 万关联就业 · 3–4 万累计就业 |
| 卡片 KPI 标签（06） | `8–15 points` · `6 langues` · `2,5 M MAU` | 8–15 个点 · 6 种语言 · 250 万月活 |
| 卡片 CTA | `Voir le détail →` | 查看详情 → |

**数据引用**：每卡 3 个 KPI 已在 data-model.json 绑定（见各业务线 `kpiIds`）；完整字段（定义 / 子模块 / 参与方 / 五类流 / 风险）见 **Annexe A**。stage 值见 AD-2。

**交互要点**
- 点击卡片 → L2 抽屉（6 tab）；抽屉 URL：`#/business/projets`、`#/business/commerce-gros`、`#/business/biens-conso`、`#/business/finance-rimp`、`#/business/formation`、`#/business/sante`。
- stage 筛选 chip 可多选；筛选时卡片有 200 ms 重排过渡（T2 定参数）。
- KPI hover 显示工具提示（含单位、年份、类型徽章）；点击进入方法学。
- 键盘：卡片为 `<a>` 或 button，Enter 打开；抽屉内 Tab 循环。

**响应式与降级**：桌面 3×2 → 平板 2×3 → 移动单列；移动端 stage 筛选改为横向滚动 chip；抽屉变底部 sheet。

**来源**：L7（现有合作清单与三类新增渠道）、L47–49（双边三步与六类活动）、L65–69（消费品 hub 与批发规则）、L86–88（短期效益）、L90–91（中长期效益）；BRIEF §4 区块 04、§10-T1。

### 05 · RIMU 超级应用 — 国民级产品

**目标**：让人相信 RIMU 是「国民级产品」而非「本地化 TikTok」：四 tab、八模块、内容治理与创作者经济一屏可感；手机 mockup 是可点的产品证据。

**布局要点**
- 左 40 % 文案（标题 + 三个差异化 + 数据条），右 60 % 手机 mockup（深色背景居中，手机金色描边）；mockup 内为真实可点的 4 tab。
- 手机右侧/下方：8 个模块卡片（横向 4×2 网格），点击模块 → 手机内高亮对应区域 + 打开 L2 抽屉（模块详情）。
- 底部三枚治理徽章：`Protection des mineurs` / `Souveraineté des contenus` / `Économie des créateurs`。
- 移动端：手机 mockup 置顶（宽度 86 %），模块卡片单列/两列，数据条横向滚动。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `05 · RIMU` | 05 · RIMU |
| 标题 | `RIMU : le système d'exploitation du quotidien.` | RIMU：日常生活的操作系统。 |
| 副标题 | `Ce n'est pas un TikTok localisé. C'est le point d'entrée vers les contenus, les biens, les emplois et les services publics — en langues locales, à faible bande passante, sous règles mauritaniennes.` | 这不是本地化的 TikTok，而是通往内容、商品、就业与公共服务的入口——本地语言、低带宽、毛里塔尼亚规则。 |
| Tab 1 `For You` | `Pour vous — 15–60 s de vidéo courte, 3 min de vidéo moyenne, notes texte-image ; 360p/480p par défaut, pré-cache nocturne.` | 为你推荐——15–60 秒短视频、3 分钟中视频、图文笔记；默认 360p/480p，夜间预缓存。 |
| Tab 2 `Abonnements` | `Abonnements — les créateurs et institutions que vous suivez, sans défilement infini pour les mineurs.` | 订阅——你关注的创作者与机构；未成年人无无限滚动。 |
| Tab 3 `À proximité` | `À proximité — marchés, débarquements de pêche, alertes météo et tempêtes de sable, services municipaux.` | 附近——集市、渔获上岸、天气与沙尘暴预警、市政服务。 |
| Tab 4 `Marché` | `Marché — RIMU Shop, paiement RIMP, paiement à la livraison ou prépaiement.` | 市场——RIMU Shop，RIMP 支付，货到付款或预付。 |
| 模块 01 `Live` | `Mariages, marchés, débarquements de pêche, conférences religieuses certifiées, live commerce.` | 婚礼、集市、渔获上岸、认证宗教讲座、直播带货。 |
| 模块 02 `Studio créateurs` | `Bibliothèque de droits musicaux locaux signée avec les associations de musiciens, modèles, transcription et sous-titres automatiques AR/FR/hassaniya/EN.` | 创作者工作室——与本地音乐人协会签署的本地音乐版权库、模板、自动转写与字幕（阿/法/哈桑尼亚/英）。 |
| 模块 03 `Économie des créateurs` | `Publicité, dons en live et commerce : des revenus en ouguiyas, dans le circuit national.` | 创作者经济——广告、直播打赏与电商：以乌吉亚计的收入，留在本国回路。 |
| 模块 04 `RIMU Shop + RIMP` | `Catalogue, commande, paiement à la livraison ou prépaiement, règlement via RIMP.` | 商店 + RIMP——目录、下单、货到付款或预付、通过 RIMP 结算。 |
| 模块 05 `RIMU Jobs & formation` | `Offres d'emploi, formations courtes en compétences, contenus de formation professionnelle.` | 就业与培训——职位、技能短训、职业培训内容。 |
| 模块 06 `Comptes vérifiés administratifs` | `Éducation, Santé, paiements municipaux, alertes météo et tempêtes de sable.` | 认证政务号——教育、卫生、市政缴费、天气与沙尘暴预警。 |
| 模块 07 `Protection des mineurs` | `Désactivation par défaut : recommandation personnalisée, défilement infini, dons en live, messages privés avec des inconnus.` | 未成年人保护——默认关闭个性化推荐、无限滚动、直播打赏、陌生人私信。 |
| 模块 08 `Souveraineté des contenus` | `Vérification, modération et recommandation sous contrôle mauritanien ; priorisation transparente et signalement, sans censure arbitraire.` | 内容主权——验证、审核与推荐由毛里塔尼亚掌控；透明优先与举报机制，无任意审查。 |
| 数据条 | `2,5 M MAU · 800 k DAU · 40 min/jour · 6 langues` | 250 万月活 · 80 万日活 · 40 分钟/日 · 6 种语言 |
| 治理徽章 1 | `Protection des mineurs — par défaut` | 未成年人保护——默认生效 |
| 治理徽章 2 | `Souveraineté des contenus — règles mauritaniennes` | 内容主权——毛里塔尼亚规则 |
| 治理徽章 3 | `Économie des créateurs — revenus en ouguiyas` | 创作者经济——乌吉亚收入 |

**数据引用**：`kpi.mau_2031`、`kpi.dau_2031`、`kpi.daily_minutes_2031`、`kpi.languages_content`、`kpi.daily_views_2031`、`kpi.creators_active_2031`、`kpi.creators_monetized_2031`、`kpi.ecommerce_gmv_2031`；五年曲线 `kpi.series.mau` / `kpi.series.dau` / `kpi.series.minutes`。

**交互要点**
- 手机 mockup：4 tab 可点；自动演示 8 秒（信息流 → Marché → live commerce → 支付成功），hover 暂停，离开恢复；提供 `Rejouer la démo` 按钮。
- 8 个模块卡：hover 高亮手机内对应区域；click 打开 L2 抽屉（模块级，L3 为功能点列表）。
- 数据条滚动进入视口时 count-up 一次；点击 MAU 可选看五年曲线。
- URL：`#/rimu`；模块抽屉 `#/rimu/live` 等。
- 键盘：tab 可用方向键切换（roving tabindex），模块卡可 Tab。

**响应式与降级**：移动端手机构图简化（去掉阴影叠层）；演示动画在 reduced-motion 下改为 3 张静态帧（信息流 / 市场 / 支付成功）；低带宽关闭手机内视频粒子。

**来源**：L8–12（RIMU 定位、内容主权、教育/宗教用途）、L26–32（四 tab 与全部模块）、L34–37（AI 内容能力与未成年人保护）、L54–58（五年曲线）、L73（钱包）；BRIEF §4 区块 05。

---

### 06 · Contenu IA & Calcul — 技术底座

**目标**：讲清「内容 AI 能力 + 四层架构 + 算力三期 + 数据不出境」如何支撑前三个区块；技术叙事必须可被政府与投资方同时听懂。

**布局要点**
- 上：标题 + 一句「四层、三期、一条铁律」。
- 中：四层架构竖向堆叠（体验层在最上，基础设施层在最下），每层可点击展开该层模块清单；层与层之间用金色细线 + 向上箭头表示能力支撑。
- 下：左 2/3 为 AI 用例三 tab（内容生产 / 日常服务 / 行业与行政）；右 1/3 为算力三期时间条（横向 3 段，标注月数、卡数、MW）。
- 底部一条通栏引用：数据与模型留在境内（L114）。
- 移动端：四层改手风琴；AI 用例 tab 保留；算力三期纵向。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `06 · Contenu IA & calcul` | 06 · 内容 AI 与算力 |
| 标题 | `Le socle : contenu IA, calcul souverain.` | 底座：内容 AI 与主权算力。 |
| 副标题 | `Quatre couches, trois phases, une règle : les données et les modèles restent sur le territoire national.` | 四层、三期、一条铁律：数据与模型留在本国。 |
| 层 1 体验层 | `Couche expérience — application RIMU, web léger, mode faible bande passante ; point d'entrée projets / biens / formation de la plateforme bilatérale.` | 体验层——RIMU 应用、轻量网页、低带宽模式；双边平台的项目/商品/培训入口。 |
| 层 2 中间件层 | `Couche middleware — comptes et identité numérique, middleware contenu, middleware paiement (RIMP), middleware risque, middleware commerçants.` | 中间件层——账户与数字身份、内容中间件、支付中间件（RIMP）、风控中间件、商户中间件。 |
| 层 3 智能层 | `Couche intelligente — recommandation, sécurité de contenu multilingue, transcription vocale, modèles sectoriels (pêche, mines, agriculture).` | 智能层——推荐、多语内容安全、语音转写、行业模型（渔业、矿业、农业）。 |
| 层 4 基础设施层 | `Couche infrastructure — extension du centre Tier III de Nouakchott : cluster GPU, nœuds edge, priorité à l'électricité verte.` | 基础设施层——扩建努瓦克肖特 Tier III：GPU 集群、边缘节点、优先绿电。 |
| AI tab 1 | `Production de contenu RIMU` | 内容生产 |
| AI 1-1 | `Sous-titres automatiques, transcription voix-texte, traduction multilingue (arabe, français, anglais).` | 自动字幕、语音转写、多语翻译（阿语、法语、英语）。 |
| AI 1-2 | `Assistance à la préparation de vidéos de formation, de compétences techniques ou de contenus religieux certifiés.` | 辅助制作培训、技术技能、认证宗教内容的视频。 |
| AI tab 2 | `Services du quotidien` | 日常服务 |
| AI 2-1 | `Support aux consultations médicales à distance ; alertes précoces en cas de tempête de sable.` | 远程医疗咨询支持；沙尘暴提前预警。 |
| AI 2-2 | `Rappels automatisés pour le paiement de l'eau et de l'électricité ; vidéos d'information sur les prix du poisson et des produits agricoles.` | 水电缴费自动提醒；鱼价与农产品价格信息视频。 |
| AI tab 3 | `Usages professionnels et administratifs` | 行业与行政 |
| AI 3-1 | `Rappels d'entretien des machines dans les mines et les ports ; enregistrement des débarquements de pêche.` | 矿山与港口设备维护提醒；渔获上岸登记。 |
| AI 3-2 | `Aide aux commerçants pour l'encaissement et l'évaluation de crédit ; envoi automatisé d'informations gouvernementales.` | 帮助商户收单与信用评估；自动推送政府信息。 |
| 算力 Phase 1 | `Phase 1 · ~18 mois — inférence, moderation et contrôle des risques des deux plateformes ; ~100 cartes accélératrices ; ~1 MW.` | 一期 · 约 18 个月——推理、两平台审核与风控；约 100 张加速卡；约 1 MW。 |
| 算力 Phase 2 | `Phase 2 · ~36 mois — séparation entraînement / inférence ; 2–3 MW ; ouverture éventuelle d'interfaces d'inférence régionales ouest-africaines.` | 二期 · 约 36 个月——训练/推理分离；2–3 MW；视情况开放西非区域推理接口。 |
| 算力 Phase 3 | `Phase 3 — extension modulaire supplémentaire, liée à un contrat d'électricité verte et à un accord national sur l'électricité.` | 三期——模块化扩建，绑定绿电合同与国家电力协议。 |
| 铁律引用 | `Grand livre et modèles centraux locaux ; entraînement possiblement hybride, inférence rapatriée.` | 账本与核心模型本地；训练可混合，推理回流本国。 |
| 页脚注 | `Alimentation 2N + diesel + photovoltaïque + batteries ; capacité nouvelle et ligne dédiée, sans empiéter sur la consommation résidentielle.` | 2N + 柴油 + 光伏 + 电池供电；新增容量与专线，不挤占居民用电。 |
| 方法学提示（QA-5） | `20–50 MW = programme d'électricité verte ; 1 MW = charge informatique de la phase 1. Voir Méthodologie.` | 20–50 MW 为绿电项目规模；1 MW 为一期 IT 负载。见方法学。 |

**数据引用**：`kpi.compute_phase1_duration_months`、`kpi.compute_phase1_cards`、`kpi.compute_phase1_mw`、`kpi.compute_phase2_duration_months`、`kpi.compute_phase2_mw`、`kpi.compute_green_program_mw`、`kpi.revenue_compute_2031`、`kpi.compute_services_revenue_lt`。

**交互要点**
- 四层可点：展开该层「模块清单」手风琴（L3，不跳页）；展开时上层保持不变，下层下移。
- AI 用例 tab 切换 3 组；每组 4 条，逐条可展开一句示例（T2 补文案位）。
- 算力三期：横向时间条可点每期显示卡片；hover 显示「月数 / 卡数 / MW」；与 08 算力轨道联动（同一数据源）。
- 「Méthodologie」链接打开抽屉，说明 Phase 1 与 20–50 MW 的口径差异（QA-5）。
- 移动端：四层手风琴 + AI tab 横向滚动；算力三期纵向卡。

**响应式与降级**：桌面四层纵向全展开 + AI 用例并排；移动端全部手风琴；reduced-motion 下无层间箭头动画。

**来源**：L16–24（四层架构表）、L34–43（AI 内容能力与具体用例）、L61–64（算力三期与供电）、L81（算力收入）、L91（20–50 MW 绿电项目）、L113–114（电力与数据风险缓解）；BRIEF §4 区块 06、§7.1。

---

### 07 · Relations — 咬合关系可视化

**目标**：回答「这些业务如何互相咬合」：用五类流把三支柱、六业务、西非目的地连成一张可筛选的关系网络；这是本方案与普通「项目清单」的分水岭。

**布局要点**
- 全屏深色；中央力导向/手工布局关系图（桌面推荐手工分层布局，避免力导向随机性影响叙事：三支柱在上、六业务在中、西非国家在右/下）。
- 顶部标题 + 一句导语；左/顶部五类流筛选 chip（分色）；右侧「Mode focus」开关；底部图例 + 当前筛选说明。
- 边为 1 px 金线；粒子沿边流动；hover 边显示 tooltip（一句流量说明 + 数据引用）；click 节点打开 L2 抽屉。
- 移动端：关系图替换为「按五类流分组的关系列表」（每条：从 → 到 + 一句说明），可展开为节点列表。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `07 · Les flux` | 07 · 五类流 |
| 标题 | `Cinq flux, un même circuit.` | 五类流，同一个回路。 |
| 副标题 | `Capital, marchandises, paiements, données, attention : cliquez un flux pour isoler ses relations ; cliquez un nœud pour ouvrir son détail.` | 资本、货物、支付、数据、注意力：点选一类流只看相关关系；点击节点打开详情。 |
| 导语（源文 L13 意译） | `La plateforme bilatérale met en relation projets, commerce, financements, formation et santé ; RIMU produit l'attention, l'écosystème des créateurs et les pistes commerciales, et se connecte au paiement RIMP ; le centre de calcul sert les deux plateformes et fournit des capacités aux secteurs minier, halieutique, agricole et à l'administration.` | 双边平台连接项目、贸易、融资、培训与卫生；RIMU 生产注意力、创作者生态与商业线索并接入 RIMP 支付；算力中心同时服务两个平台，并向矿业、渔业、农业与行政部门提供能力。 |
| 图例 Capital | `Capital — financements, intentions d'investissement, capital humain` | 资本——融资、投资意向、人力资本 |
| 图例 Marchandises | `Marchandises — biens de consommation, équipements, électricité verte` | 货物——消费品、设备、绿电 |
| 图例 Paiements | `Paiements — RIMP, encaissement marchand, transfrontalier` | 支付——RIMP、商户收单、跨境 |
| 图例 Données | `Données — contenus, données sectorielles, modèles et inférence` | 数据——内容、行业数据、模型与推理 |
| 图例 Attention | `Attention — temps d'écran, audiences, visibilité institutionnelle` | 注意力——屏幕时间、受众、机构曝光 |
| Mode focus | `Mode focus : n'afficher que le flux sélectionné` | 聚焦模式：只显示所选流 |
| 全显示 | `Tout afficher` | 全部显示 |
| Tooltip 示例 1 | `RIMP : commissions marchands et transfrontalières, microfinance, canaux administratifs et B2B.` | RIMP：商户与跨境佣金、微贷、行政与 B2B 渠道。 |
| Tooltip 示例 2 | `Du contenu aux modèles : les données locales servent l'inférence, les modèles reviennent aux usages.` | 从内容到模型：本地数据用于推理，模型回到应用。 |
| Tooltip 示例 3 | `Nouakchott — hub : les biens chinois s'arrêtent, se stockent, se répartissent vers cinq pays.` | 努瓦克肖特枢纽：中国商品在此停留、仓储、分拨到五国。 |

**数据引用**：`kpi.payment_flow_2031`（15–25 Md USD/an）、`kpi.wa_goods_transit`（800 M–2 Md USD/an）、`kpi.daily_views_2031`（≈32 M/jour，注意力规模）、`kpi.ecommerce_gmv_2031`；关系边与节点定义见 `data-model.json → relations`（35 条，五类流）与 `businessLines[].flowIn/flowOut`。

**交互要点**
- 图例 chip 筛选：单选/多选；选中时其他流边降透明度 15 %；`Mode focus` 隐藏未选中节点（度数为 0 的节点淡出）。
- hover 节点：高亮所有关联边 + 其他节点降透明；hover 边：tooltip 显示流类型、方向、一句说明、数据引用。
- click 节点 → L2 抽屉；click 空白处清除筛选；Esc 清除筛选（若未打开抽屉）。
- 移动端：关系列表按五类流分组，每组标题可折叠；提供「查看关系图（需横屏）」可选入口。
- 键盘：图例 chip 可 Tab；节点可用方向键在节点间移动（T2 定）。

**响应式与降级**：低带宽关闭粒子，只保留静态箭头；reduced-motion 时边无流动；颜色不单独承载信息（同时有文字图例）。

**来源**：L13（三平台咬合逻辑）、L20–23（四层分工）、L30–32（Shop 与 RIMP、创作者经济）、L41–42（AI 日常与行业用例）、L49（六类活动并行）、L67（线上与 RIMU tab 连接）、L101–102（西非区域扩展）；BRIEF §4 区块 07、§5 关系图。

---

### 08 · Feuille de route — 时间可信度

**目标**：用三条可切换轨道证明「时间表是认真的」：双边三步、RIMU 五年曲线、算力三期；每个里程碑可展开，数据与 09 区块一致。

**布局要点**
- 顶部标题 + 三轨道切换 tab（`Plateforme bilatérale` / `RIMU + contenu IA` / `Calcul vert`）。
- 中部 2026–2031 横向时间轴；每个里程碑为金色节点，节点 hover 显示摘要，click 展开内联详情卡（L3，不跳页）。
- RIMU 轨道：时间轴上方叠加 MAU / DAU / temps passé 三条 sparkline（同一横轴），鼠标 hover 显示当年三值。
- 算力轨道：横向三段条（Phase 1 / 2 / 3），标注月数、卡数、MW；Phase 3 以虚线表示「模块化、未定额」。
- 移动端：时间轴转纵向；三轨道切换保留；详情卡默认收起。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `08 · La trajectoire` | 08 · 轨迹 |
| 标题 | `2026–2031 : trois trajectoires, un même calendrier.` | 2026–2031：三条轨道，同一张日历。 |
| 副标题 | `La plateforme bilatérale en trois étapes, RIMU en cinq ans, le calcul en trois phases — les trois se déroulent en parallèle.` | 双边平台三步、RIMU 五年、算力三期——三条并行推进。 |
| 轨道 tab 1 | `Plateforme bilatérale` | 双边平台 |
| 轨道 tab 2 | `RIMU + contenu IA` | RIMU + 内容 AI |
| 轨道 tab 3 | `Calcul vert` | 绿色算力 |
| 双边步骤 1 | `Lancement officiel — l'État désigne un ministère chef de file et un point de contact de chaque côté ; administrations et entreprises publient projets, marchandises, biens de consommation et besoins de financement.` | 正式启动——国家指定牵头部委与双方联络人；政府与企业发布项目、商品、消费品与融资需求。 |
| 双边步骤 2 | `Mise en correspondance des ressources — la partie mauritanienne fournit titres et produits miniers, ports et terrains industriels, sites d'exposition, hôpitaux et lieux de formation ; la partie chinoise met en relation commandes, équipements, EPC, financements, cursus et télémédecine.` | 资源匹配——毛方提供矿权与矿产品、港口与工业用地、展贸场地、医院与培训场所；中方对接订单、设备、EPC、融资、课程与远程医疗。 |
| 双边步骤 3 | `Avancement simultané des six catégories d'activités + pré-étude du calcul — projets, commerce de gros, biens de consommation vers l'Afrique de l'Ouest, finance, formation et santé ; sélection de site et pré-étude du calcul vert en parallèle.` | 六类活动并行 + 算力预研——项目、批发、面向西非的消费品、金融、培训、卫生；同步开展选址与绿电算力预研。 |
| RIMU 2027 | `Invitation ; pré-installation et forfaits sans data avec les opérateurs ; mise en service de la phase 1 du calcul.` | 邀请制；与运营商做预装与免流量包；算力一期投运。 |
| RIMU 2028 | `Ouverture publique ; lancement du fonds créateurs.` | 公开上线；创作者基金启动。 |
| RIMU 2029 | `Paiements administratifs prioritaires ; déploiement national des QR marchands.` | 优先行政缴费；全国商户 QR 部署。 |
| RIMU 2030 | `Pilote de produits de crédit.` | 信贷产品试点。 |
| RIMU 2031 | `≈ 60 %+ des internautes de l'époque ; extension des packs de contenu vers la zone francophone d'Afrique de l'Ouest.` | 约占当年网民 60 %+；内容包扩展至西非法语区。 |
| 算力注释 | `Durées relatives à la source ; le démarrage est une hypothèse de séquencement (2026-H2), non une date contractuelle.` | 时长取自源文件；启动时间为排期假设（2026 下半年），非合同日期。 |
| 时间轴图例 | `Année · Jalon · KPI` | 年份 · 里程碑 · 指标 |

**数据引用**：`kpi.series.mau`、`kpi.series.dau`、`kpi.series.minutes`（2027–2031）；`kpi.projects_first_wave`、`kpi.investment_intentions`、`kpi.consumer_trial_orders_y1` 等双边短期 KPI；`kpi.compute_phase1_duration_months`、`kpi.compute_phase1_cards`、`kpi.compute_phase1_mw`、`kpi.compute_phase2_duration_months`、`kpi.compute_phase2_mw`；里程碑结构化数据见 `data-model.json → roadmap`。

**交互要点**
- 三轨道切换：保留横轴，切换时内容交叉淡化 200 ms（T2 定）；URL 参数 `?track=rimu`（可分享）。
- 里程碑 click → 内联详情卡展开（含来源行号与 KPI）；再次 click 收起；同一时间只展开一个。
- RIMU 轨道叠加三条 sparkline，可单独隐藏（`MAU / DAU / Temps` 三个 toggle）。
- 年轴可拖动/点击年份定位；移动端纵向时间轴 + 顶部年份 sticky。
- reduced-motion：切换无过渡；sparkline 直接绘制终态。

**响应式与降级**：桌面横向时间轴；平板可横向滚动；移动端纵向；低带宽不加载 sparkline 动画，只显示端点值。

**来源**：L45（总起）、L46–49（双边三步）、L50–59（五年表 Y1–Y5）、L60–64（算力三期）、L86–88（短期效益）；BRIEF §4 区块 08、§7.1。

---

### 09 · Chiffres 2031 — 数据冲击

**目标**：全站数据高潮：一屏给出 2031 的 7 个核心数字 + 收入构成 + 就业口径 + 方法学入口；所有数字可溯源、可解释、不伪装成官方统计。

**布局要点**
- 深色沉浸式仪表盘：左上标题 + 「Scénario ambitieux」徽章 + 方法学链接；中部 7 个 KPI 大数字（2 行 4 列，最后 1 个跨列或单独一行）；右下收入构成环形图（RIMU / RIMP / Calcul）；左下就业口径分层条（三段嵌套，不可相加）。
- 数字字号 ≥ 88 px（桌面），等宽数字特性；单位与年份用金色小字；每个数字下方一枚类型徽章（Source / Dérivé / Hypothèse）。
- 底部通栏一行：`Source : document de référence, novembre 2026 · Dérivé : formule affichée · Hypothèse : à valider`。
- 移动端：KPI 2×2；环形图全宽；就业分层条纵向。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `09 · Chiffres 2031` | 09 · 2031 数据 |
| 标题 | `2031 : ce que cela représente.` | 2031：这意味着什么。 |
| 副标题 | `Scénario ambitieux — chiffres étiquetés source, dérivé ou hypothèse. Chaque valeur s'ouvre sur sa méthode.` | 雄心情景——每个数字标注来源类型，点击查看算法。 |
| 徽章 | `Scénario ambitieux` | 雄心情景 |
| KPI 1 | `Utilisateurs actifs mensuels` — **2,5 M** | 月活用户——250 万 |
| KPI 2 | `Utilisateurs actifs quotidiens` — **800 k** | 日活用户——80 万 |
| KPI 3 | `Temps passé` — **40 min/jour** | 日均时长——40 分钟/日 |
| KPI 4 | `Portefeuilles RIMP` — **2,8 M comptes** | RIMP 钱包——280 万账户 |
| KPI 5 | `Revenus annuels` — **150–220 M USD** | 年收入——1.5–2.2 亿美元 |
| KPI 6 | `Part du PIB` — **1,3–1,9 %** (PIB actuel) | 占 GDP——1.3–1.9 %（当前 GDP） |
| KPI 7 | `Emplois directs + écosystème` — **30–40 k** (5 ans) | 直接与生态就业——3–4 万（5 年） |
| 收入图标题 | `Composition des revenus 2031` | 2031 收入构成 |
| 收入图图例 | `Vidéos courtes RIMU 30–50 M USD` / `Paiement RIMP 90–140 M USD` / `Centre de calcul IA 30–40 M USD` | RIMU 短视频 0.3–0.5 亿美元 / RIMP 支付 0.9–1.4 亿美元 / AI 算力 0.3–0.4 亿美元 |
| 收入图注释 | `Les milieux de fourchette servent à la surface du graphique ; le total affiché reste 150–220 M USD (Source).` | 区间中点仅用于图形面积；总数仍以 150–220 M USD（Source）为准。 |
| 就业口径标题 | `Emplois : trois couches, ne pas additionner` | 就业：三个层次，不可相加 |
| 就业层 1 | `2 000–4 000 — première vague, emplois directs et connexes` | 2000–4000——首波，直接与关联就业 |
| 就业层 2 | `8 000–15 000 — emplois connexes, moyen et long terme (logistique incluse)` | 8000–1.5 万——中长期关联就业（含物流） |
| 就业层 3 | `30 000–40 000 — cumul direct + écosystème sur cinq ans` | 3–4 万——五年直接 + 生态累计 |
| 方法学抽屉标题 | `Méthodologie` | 方法学 |
| 方法学正文 | `Source : document de référence (novembre 2026). Dérivé : calcul à partir des chiffres source, formule affichée. Hypothèse : paramètre de travail à valider (ex. taux de commission, panier annuel).` | 来源：参考文件（2026 年 11 月）。派生：由源数字按公式计算，公式可见。假设：待验证的工作参数（如费率、年客单价）。 |
| 方法学链接 | `Voir la méthode de chaque chiffre` | 查看每个数字的算法 |

**数据引用**：`kpi.mau_2031`、`kpi.dau_2031`、`kpi.daily_minutes_2031`、`kpi.wallets_2031`、`kpi.revenue_total_2031`、`kpi.revenue_gdp_share_2031`、`kpi.jobs_5y`、`kpi.revenue_rimu_2031`、`kpi.revenue_rimp_2031`、`kpi.revenue_compute_2031`、`kpi.revenue_mix_midpoint`、`kpi.direct_jobs_short_term`、`kpi.related_jobs_mlt`；派生详见 data-model.md §4。

**交互要点**
- 每个 KPI click / focus → 方法学抽屉：显示类型徽章、公式、来源行号、口径备注；抽屉内可跳转对应源文件行。
- 收入环形图：hover 显示区间与中点；点击扇区 → 方法学；图例可开关。
- 就业分层条：hover 显示「ne pas additionner」提示；点击展开每层定义。
- 「Scénario ambitieux」徽章 hover 显示一句：「hypothèse de croissance, non une prévision officielle」。
- 数字进入视口 count-up 一次；打印模式输出表格版（A4 横向）。

**响应式与降级**：移动端 2×2 KPI + 全宽环形图；reduced-motion 直接显示终值；低带宽不加载环形图动画。

**来源**：L70–74（2031 用户与支付规模）、L75–83（收入表与 PIB 占比）、L97（就业 30–40 k）、L98（成人账户 ≈50 %）；BRIEF §4 区块 09、§7.1、§7.3。

### 10 · Bénéfices & transformation — 国家与区域收益

**目标**：把「数字」翻译成「国家收益」：毛里塔尼亚短/中/长期收益、西非区域枢纽、结构性转型前后对比；回答政府读者「这对我们意味着什么」。

**布局要点**
- 上部：标题 + 毛里塔尼亚三列收益卡（Court terme / Moyen terme / Long terme），每列 3–4 条带数字的收益（数字带类型徽章）。
- 中部：西非区域地图（象牙白底 + 金色海岸线），Nouakchott 为光源，动态流向 Sénégal / Mali / Guinée / Côte d'Ivoire / Gambie；图例区分货物 / 支付 / 内容（注意力）三类流向；hover 国家显示一行收益说明。
- 下部：结构性转型 before/after 对照表（5 行：出口结构 / 收入结构 / 金融 / 注意力 / 数据），左「Aujourd'hui」右「2031」。
- 移动端：三列纵向卡片 → 地图横屏提示/静态图 → 对照表逐行展开。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `10 · Bénéfices & transformation` | 10 · 收益与转型 |
| 标题 | `Ce que la Mauritanie y gagne. Ce que la région y gagne.` | 毛里塔尼亚得到什么，区域得到什么。 |
| 副标题 | `Trois horizons pour la Mauritanie ; cinq pays pour le hub ouest-africain ; cinq bascules structurelles.` | 毛里塔尼亚三个时间尺度；西非枢纽五国；五条结构性转变。 |
| 短期卡标题 | `Court terme · 0–24 mois` | 短期 · 0–24 个月 |
| 短期条 1 | `Première vague de 5–8 projets en phase substantielle : 800 M–1,2 Md USD d'intentions d'investissement.` | 首批 5–8 个项目进入实质阶段：8–12 亿美元投资意向。 |
| 短期条 2 | `Mises en relation de commerce de gros : 300–800 M USD ; commandes d'essai de biens de consommation : 80–150 M USD la première année.` | 批发撮合 3–8 亿美元；消费品首年试单 0.8–1.5 亿美元。 |
| 短期条 3 | `1 000–3 000 personnes formées ; 8–15 points de télémédecine ; 2 000–4 000 emplois directs et connexes.` | 1000–3000 人受训；8–15 个远程医疗点；2000–4000 直接与关联就业。 |
| 中期卡标题 | `Moyen terme · 3–5 ans` | 中期 · 3–5 年 |
| 中期条 1 | `800 M–2 Md USD de biens transitant par an via la Mauritanie vers l'Afrique de l'Ouest.` | 每年 8–20 亿美元货物经毛里塔尼亚流向西非。 |
| 中期条 2 | `8 000–15 000 emplois connexes, logistique incluse ; première phase de calcul vert : 20–50 MW, revenus de service de plusieurs dizaines à une centaine de millions USD.` | 0.8–1.5 万关联就业（含物流）；绿电算力一期 20–50 MW，年服务收入数千万至 1 亿美元。 |
| 中期条 3 | `+0,8–1,5 point de croissance sur une base de 4,5 % ; Nouakchott devient un point d'arrêt régulier des acheteurs ouest-africains.` | 在 4.5 % 基准上再加 0.8–1.5 个百分点；努瓦克肖特成为西非采购商的固定停留点。 |
| 长期卡标题 | `Long terme · 5 ans et au-delà` | 长期 · 5 年及以后 |
| 长期条 1 | `30 000–40 000 emplois directs + écosystème sur cinq ans (créateurs, points agents, digitalisation des commerçants).` | 五年 3–4 万直接 + 生态就业（创作者、代理点、商户数字化岗位）。 |
| 长期条 2 | `Comptes numériques adultes : de moins de 20 % à environ la moitié ; subventions et salaires via un circuit traçable réduisant les fuites.` | 成年人数字账户从 <20 % 到约一半；补贴与工资走可追溯回路，减少漏损。 |
| 长期条 3 | `Données, clés, poids des modèles de recommandation et grand livre des paiements conservés sur le territoire national.` | 数据、密钥、推荐模型权重与支付账本留在本国领土。 |
| 地图标题 | `De point de transit à hub de services et de distribution.` | 从过境点到服务与分拨枢纽。 |
| 地图说明 | `Les acheteurs ouest-africains réduisent leurs déplacements vers l'Asie en s'arrêtant à Nouakchott pour voir, sélectionner et répartir les marchandises chinoises.` | 西非买家不必再远赴亚洲：在努瓦克肖特看货、选货、分拨中国商品。 |
| 地图国家 tooltip 模板 | `{Pays} — flux de marchandises / paiements / contenus` | {国家}——货物 / 支付 / 内容流 |
| 区域扩展说明 | `Les contenus RIMU en arabe et en français se diffusent dans la zone francophone et arabophone ; RIMP et l'inférence IA s'étendent progressivement vers le Sénégal, le Mali et les voisins.` | RIMU 的阿语与法语内容自然扩散到法语区和阿语区；RIMP 与 AI 推理逐步扩展到塞内加尔、马里及邻国。 |
| 转型表 & 行标签 | `Ce qui change` / `Aujourd'hui` / `2031` | 改变了什么 / 今天 / 2031 |
| 转型行 1 | `Exportations : minerais bruts et captures non transformées → produits transformés, traçables, accords de long terme, services numériques exportables.` | 出口：原矿与未加工渔获 → 加工、可追溯产品、长期协议、可出口的数字服务。 |
| 转型行 2 | `Revenus : dépendance à un seul prix des minerais → stockage, douane, transit, paiement et services numériques.` | 收入：依赖单一矿价 → 仓储、关税、过境、支付与数字服务。 |
| 转型行 3 | `Finance : cash difficile à auditer → comptes traçables, subventions et salaires sur circuit traçable.` | 金融：难以审计的现金 → 可追溯账户，补贴与工资走可追溯回路。 |
| 转型行 4 | `Attention : plateformes étrangères → règles mauritaniennes, contenus en langues locales (hassaniya, peul, soninké, wolof).` | 注意力：外国平台 → 毛里塔尼亚规则，本地语言内容（哈桑尼亚、富拉、索宁克、沃洛夫）。 |
| 转型行 5 | `Données : modèles à l'étranger → données, clés et poids des modèles sur le territoire.` | 数据：模型在境外 → 数据、密钥与模型权重留在本国。 |

**数据引用**：短期 `kpi.projects_first_wave`、`kpi.investment_intentions`、`kpi.wholesale_matching`、`kpi.consumer_trial_orders_y1`、`kpi.training_people`、`kpi.telemedicine_points`、`kpi.direct_jobs_short_term`；中期 `kpi.wa_goods_transit`、`kpi.related_jobs_mlt`、`kpi.compute_green_program_mw`、`kpi.compute_services_revenue_lt`、`kpi.gdp_growth_baseline`、`kpi.gdp_growth_uplift`、`kpi.gdp_growth_projected`；长期 `kpi.jobs_5y`、`kpi.adult_accounts_before`、`kpi.adult_accounts_2031`；区域 `kpi.wa_countries`、`regions[]`。

**交互要点**
- 三列收益卡：hover 数字显示徽章与来源；click 打开方法学/抽屉（对应业务线）。
- 地图：Nouakchott 光源脉冲 + 流向动画；国家 hover 显示 tooltip；click 国家 → 高亮相关业务线（如 Sénégal → 商业/支付/内容）；提供「Voir les flux」跳转 07。
- 转型表：切换 `Aujourd'hui / 2031` 时逐行交叉淡化；打印版并列两栏。
- 移动端：地图可横向滚动/缩放；无 WebGL。
- reduced-motion：流向为静态箭头；地图脉冲关闭。

**响应式与降级**：桌面三列 + 地图 + 对照表；平板三列变 2+1；移动端单列 + 静态地图；低带宽不加载地图动画。

**来源**：L84–99（毛里塔尼亚短/中/长期收益与结构转型）、L100–102（西非区域收益）、L92（增长 +0,8–1,5 pt）；BRIEF §4 区块 10。

---

### 11 · Ce que nous demandons à l'État — 行动诉求

**目标**：把方案变成「可决策的清单」：五项支持各自是什么、为什么需要、6 个月内能交付什么；强调「不是要预算，而是开通道」。

**布局要点**
- 象牙白编辑式；标题 + 一句前提（源文 L104 意译）+ 五个可展开手风琴（纵向编号 01–05）。
- 每个手风琴：标题 + 一行「要求」+ 展开后「为什么 / 首个 6 个月交付物 / 对应源文」；内容 3–5 条 bullets。
- 手风琴下方固定一条金色「6 个月首个交付物」条（4 项）。
- 移动端：手风琴全宽；交付物条纵向。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `11 · Ce que nous demandons` | 11 · 我们的诉求 |
| 标题 | `Ce que nous demandons à l'État.` | 我们对国家的请求。 |
| 副标题 | `Cinq décisions à clarifier en même temps — sans avance budgétaire importante, sans confirmation préalable de montants déjà conclus.` | 五项需同步明确的决定——无需大额预算垫付，也无需预先确认已谈成的金额。 |
| 手风琴 01 标题 | `Organisation et politiques` | 组织与政策 |
| 01 要求 | `Désigner un ministère chef de file, un point de contact, et des correspondants dans les fenêtres clés.` | 指定牵头部委、联络人，以及关键窗口的对接人。 |
| 01 展开 | `Correspondants : Investissement, Mines, Énergie, Douanes, Finances / Banque centrale, Affaires étrangères, Santé. Traitement parallèle ou engagement de délais pour les projets prioritaires. Inscrire le centre d'exposition, la distribution en transit et la pré-étude du calcul vert dans un langage politique communicable. Autorisation claire du ministère de la Transformation numérique, coordination sur les règles de données, le contrôle des contenus et l'interministérialité.` | 对接人：投资、矿业、能源、海关、财政/央行、外交、卫生。优先项目并行处理或承诺时限。把展贸中心、过境分拨、绿电算力预研写入可对外沟通的政策表述。数字转型部明确授权并协调数据规则、内容管控与跨部门。 |
| 手风琴 02 标题 | `Sites, terrains et listes de projets` | 场地、土地与项目清单 |
| 02 要求 | `Établir les premières listes de négociation selon cinq catégories industrielles ; sécuriser le site d'exposition.` | 按五类产业建立首批谈判清单；落实展贸场地。 |
| 02 展开 | `Showroom permanent ou semaines d'exposition à Nouakchott ou dans un port désigné (location ou aménagement d'un bâtiment existant). Guichets portuaires pour entreposage, zone franche ou apurement des importations temporaires d'échantillons. Terrains industriels pour énergies nouvelles, transformation, chaîne du froid et pré-étude du calcul.` | 在努瓦克肖特或指定港口设常设展贸中心或展贸周（租赁或改造既有建筑）。港口窗口用于仓储、自由区或样品临时进口核销。为新能源、加工、冷链与算力预研预留工业用地。 |
| 手风琴 03 标题 | `Financement et budget` | 资金与预算 |
| 03 要求 | `Fonds d'amorçage limités et statistiques séparées des droits de douane, frais portuaires et revenus d'entreposage.` | 有限种子资金；关税、港口费与仓储收入单独统计。 |
| 03 展开 | `Amorçage : aménagement du showroom, entrée des premiers échantillons, ouverture des formations, pilotes de télémédecine. Accompagnement limité pour les projets prioritaires après due diligence : avantage de loyer foncier, exonération limitée de taxes locales, subvention à la formation ou petite contrepartie d'amorçage.` | 种子资金：展贸中心装修、首批样品进口、培训开班、远程医疗试点。优先项目通过尽调后有限支持：地租优惠、地方税费有限豁免、培训补贴或小额启动配套。 |
| 手风琴 04 标题 | `Finance et règlements` | 金融与规则 |
| 04 要求 | `Maintenir le dialogue avec la Banque centrale et les banques ; séparer le financement des petites commandes de celui des minerais en vrac.` | 保持与央行及银行的对话；把小额订单融资与大宗矿产品融资分开。 |
| 04 展开 | `Dialogue : Finances / Banque centrale, banques d'import-export, fonds Chine-Afrique, assurance-crédit, banques commerciales. Protocoles à moyen-long terme et assurance-crédit pour exportations minières et halieutiques ; lettres de crédit, virements et financement commercial court terme séparés pour les petites commandes. Lettres de confort ou rehaussement de crédit limité pour les projets prioritaires. Finaliser dans les six mois une première version de la pré-étude de calcul et clarifier la ligne dédiée d'électricité verte et le mécanisme tarifaire.` | 对话：财政/央行、进出口银行、中非基金、信用保险、商业银行。矿业与渔业出口的中长期协议与信用保险；小额订单单独使用信用证、汇款与短期贸易融资。优先项目可给安慰函或有限信用增级。六个月内完成算力预研第一版，明确绿电专线与电价机制。 |
| 手风琴 05 标题 | `Diplomatie, douanes et règles de données` | 外交、海关与数据规则 |
| 05 要求 | `Inviter les acheteurs ouest-africains et clarifier une fois pour toutes les règles d'entrée, d'apurement, de transit et de distribution.` | 邀请西非买家；一次性厘清入境、核销、过境与分销规则。 |
| 05 展开 | `Invitations aux chambres de commerce et importateurs d'Afrique de l'Ouest et des pays voisins pour « voir les produits chinois en Mauritanie ». Clarification unique : entrée des produits d'exposition, apurement des échantillons, transit et distribution à l'importation. Discussion : traçabilité des produits miniers, certification des captures, contrôle qualité des biens de consommation, données de commandes maintenues sur le territoire national.` | 邀请西非及邻国商会与进口商「来毛里塔尼亚看中国商品」。一次性明确：展品入境、样品核销、过境与进口分销。讨论：矿产品可追溯、渔获认证、消费品质量控制、订单数据留在本国。 |
| 6 个月条 | `En 6 mois : version 1 de la pré-étude de calcul, ligne dédiée d'électricité verte et mécanisme tarifaire clarifiés, premières listes de projets publiées, site du showroom identifié.` | 6 个月内：算力预研第一版、绿电专线与电价机制明确、首批项目清单发布、展贸场地选址确定。 |

**数据引用**：`kpi.first_deliverable_months`（6 个月，Source L108）；支持项本身无数字，避免虚增；「6 个月交付物」为对源文的归纳（Dérivé de L106–L108，标注 Proposition）。

**交互要点**
- 五个手风琴默认全部收起（便于打印时展开/收起控制）；支持单选展开（可配置多开）。
- 展开时显示「6 个月交付物」高亮；「Copier la demande」按钮（复制该条法语全文，便于邮件/会议记录）。
- 打印模式：全部展开，每条一页分区。
- 移动端：手风琴全宽，交付物条 sticky 在底部。

**响应式与降级**：桌面两列手风琴或单列大卡（T2 定）；移动端单列；无动效依赖。

**来源**：L103–104（总起与前提）、L105（组织与政策）、L106（场地与清单）、L107（资金与预算）、L108（金融与规则、6 个月预研）、L109（外交、海关与数据规则）；BRIEF §4 区块 11。

---

### 12 · Risques & garanties — 可信度

**目标**：主动摆出五类风险与对应缓解机制，用「写下来的机制」替代「相信我们」；这是投资方与政府共同的尽调入口。

**布局要点**
- 深海军蓝编辑式；标题 + 副标题；五行手风琴（编号 01–05），每行左侧风险标题 + 右侧「Garantie」标签。
- 展开后两栏：`Risque`（一句风险 + 触发信号）| `Garantie`（2–3 条缓解）。
- 每行尾部标注来源行号（L111–L115）。
- 移动端：单列手风琴，两栏变上下。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `12 · Risques & garanties` | 12 · 风险与保障 |
| 标题 | `Cinq risques, cinq garanties.` | 五类风险，五项保障。 |
| 副标题 | `Aucun projet de cette taille n'est sans risque ; chaque risque a un mécanisme écrit, pas une promesse.` | 这个体量的项目不可能没有风险；每个风险都有书面机制，而不是口头承诺。 |
| 风险 1 标题 | `Interopérabilité et résistance des portefeuilles / opérateurs existants` | 钱包互操作与现有运营商阻力 |
| 风险 1 信号 | `Canaux fermés, commissions opaques, adoption lente.` | 通道不开放、费率不透明、普及缓慢。 |
| 风险 1 保障 | `Calendrier d'interconnexion obligatoire de la Banque centrale ; subventions et salaires de l'État versés en priorité sur les rails interconnectés.` | 央行强制互操作时间表；国家补贴与工资优先走已互操作通道。 |
| 风险 2 标题 | `Contenus religieux / tribaux et protection des mineurs` | 宗教/部落内容与未成年人保护 |
| 风险 2 信号 | `Contenus controversés, pression communautaire, exposition des mineurs.` | 争议内容、社群压力、未成年人暴露。 |
| 风险 2 保障 | `Conseil religieux ; restrictions strictes par défaut au niveau produit ; retrait rapide ; règles de modération et de recommandation mauritaniennes.` | 宗教顾问机制；产品层默认严格限制；快速下架；毛里塔尼亚审核与推荐规则。 |
| 风险 3 标题 | `Électricité, sable et fluctuations du réseau` | 电力、沙尘与电网波动 |
| 风险 3 信号 | `Coupures, surchauffe, ensablement des équipements.` | 断电、过热、设备积沙。 |
| 风险 3 保障 | `Alimentation 2N + diesel + photovoltaïque + batteries, liée à un contrat d'électricité verte ; capacité nouvelle et ligne dédiée.` | 2N + 柴油 + 光伏 + 电池，绑定绿电合同；新增容量与专线。 |
| 风险 4 标题 | `Données transfrontalières et dépendance au cloud` | 跨境数据与云依赖 |
| 风险 4 信号 | `Pression de fournisseurs étrangers, localisation incertaine des sauvegardes, modèles non auditables.` | 外国供应商压力、备份位置不明、模型不可审计。 |
| 风险 4 保障 | `Grand livre et modèles centraux locaux ; entraînement possiblement hybride mais inférence rapatriée ; données de commandes maintenues sur le territoire.` | 账本与核心模型本地；训练可混合但推理回流；订单数据留在本国。 |
| 风险 5 标题 | `Talents et continuité du projet` | 人才与项目连续性 |
| 风险 5 信号 | `Pénurie d'ingénieurs, départs, rupture de la maintenance.` | 工程师短缺、人员流失、运维中断。 |
| 风险 5 保障 | `Classes commandées dans les universités ; apprentis locaux ; obligations législatives d'interopérabilité des données et des paiements.` | 大学定向班；本地学徒；以立法确立数据与支付互操作义务。 |
| 区块尾注 | `Chaque garantie est un livrable contractuel à documenter dans le plan d'exécution.` | 每项保障都应在执行计划中落成合同交付物。 |

**数据引用**：无新增数字；与 11 的「6 个月交付物」和 08 的算力三期联动；风险对应 KPI：风险 1 → `kpi.wallets_2031`；风险 4 → 数据主权相关（方法学说明，不设 KPI）。

**交互要点**
- 五行手风琴；展开时风险与保障左右分栏；「Voir la garantie liée」可选跳转 11 对应支持项。
- 手风琴默认第一条展开（让读者看到「机制」长什么样）。
- 打印模式全部展开。
- 移动端单列，风险/保障上下排列。

**响应式与降级**：无动画依赖；reduced-motion 无过渡；键盘可展开/收起。

**来源**：L110–115（五类风险与缓解机制）；BRIEF §4 区块 12、§7.1。

---

### 13 · Next steps & contact — 转化

**目标**：把「看懂」转成「行动」：30/90 天明确动作、预约会议、下载 PDF、回到引导模式；页脚完成数据来源与方法学的合规交代。

**布局要点**
- 深色收尾；上半 30/90/180 天三步时间条（三卡）；中部双 CTA（预约会议 / 下载 PDF）；下半 AUREON 简介 + 联系方式 + 双二维码（网页 / 微信，T2 生成）。
- 页脚四栏：`Méthodologie` / `Sources` / `Mentions` / `Langue`；版权与版本号。
- 移动端：时间条纵向；CTA 全宽；二维码并排。

**展示文案**

| 元素 | 法语（建议直接上线） | 中文对照 |
|---|---|---|
| 眉标 | `13 · Prochaines étapes` | 13 · 下一步 |
| 标题 | `Prochaine étape : ouvrir le canal.` | 下一步：打开通道。 |
| 副标题 | `30 jours pour nommer, 90 jours pour publier, 6 mois pour la première version de la pré-étude.` | 30 天定人，90 天发布，6 个月拿出预研第一版。 |
| 时间条 J+30 | `J+30 — Désignation du ministère chef de file et des points de contact ; périmètre du MVP de la plateforme ; première liste des cinq catégories industrielles.` | 第 30 天——指定牵头部委与联络人；确定平台 MVP 范围；五类产业首份清单。 |
| 时间条 J+60 | `J+60 — Publication des premières listes ; sélection du site du showroom ; cadrage RIMU avec les opérateurs.` | 第 60 天——发布首批清单；选定展贸场地；与运营商敲定 RIMU 方案。 |
| 时间条 J+90 | `J+90 — Termes de référence de 5–8 projets ; protocole d'interconnexion RIMP ; lancement de la pré-étude de calcul.` | 第 90 天——5–8 个项目工作说明书；RIMP 互操作协议；启动算力预研。 |
| 时间条 J+180 | `J+180 — Version 1 de la pré-étude de calcul, ligne verte et tarif clarifiés, premiers échantillons, formations ouvertes.` | 第 180 天——算力预研第一版、绿电与电价明确、首批样品、培训开班。 |
| CTA 主 | `Solliciter une réunion de travail` | 预约工作会议 |
| CTA 次 | `Télécharger le dossier (PDF, A4 paysage)` | 下载方案册（PDF，A4 横向） |
| CTA 三 | `Revoir la visite guidée 3 min` | 重看 3 分钟引导 |
| AUREON 简介 | `AUREON DIGITAL SARL — Bâtisseur de la souveraineté numérique. Nouakchott, Mauritanie. RIMU · RIMP · Calcul IA national.` | AUREON DIGITAL SARL——数字主权建设者。努瓦克肖特，毛里塔尼亚。RIMU · RIMP · 国家 AI 算力。 |
| 联系人 | `Benjamin LIU, Vice-président — Tél. +222 22 66 51 08 · Chine +86 134 5413 3191 · WeChat liuxd6 · ccliuxd@gmail.com · www.aureondigital.mr`（上线前确认） | Benjamin LIU，副总裁——电话……（上线前确认） |
| 页脚源声明 | `Données : Source / Dérivé / Hypothèse — voir Méthodologie. Document de référence : novembre 2026.` | 数据：来源 / 派生 / 假设——见方法学。参考文件：2026 年 11 月。 |
| 页脚链接 | `Méthodologie · Sources · Mentions légales · Français / 中文` | 方法学 · 来源 · 法律声明 · 法语 / 中文 |

**数据引用**：30/90/180 天为**Proposition（排期假设）**，不来自源文件；6 个月预研来自 `kpi.first_deliverable_months`（Source L108）；联系方式来自 README §3（AD-7）。

**交互要点**
- 预约会议：mailto 或外链表单（T3 定）；下载 PDF：静态 PDF / 打印样式导出；「Revoir la visite guidée」启动 Mode Pitch。
- 二维码 hover 显示用途说明；移动端点击放大。
- 页脚方法学链接打开全局方法学抽屉；语言切换保留当前滚动位置。
- 打印模式：本区块单独成最后一页，二维码可扫回网页（BRIEF §2 打印模式）。

**响应式与降级**：移动端时间条纵向卡片；CTA 全宽；二维码 2 列。

**来源**：L103–109（前提与 6 个月交付）、L108（六个月内预研）；README §3（联系方式与职位）、§8（品牌气质）；BRIEF §2（打印 + 扫码回网页）、§4 区块 13。30/90/180 天序列为内容侧提案（Hypothèse de séquencement），Lead 可调但不要伪装成源文数据。

---

## 3. 内容实体库（可复用，供组件与 JSON 直接读取）

### Annexe A · 六大业务线完整字段

> 以下六条对应 `data-model.json → businessLines[]`，id 即抽屉 URL 与关系图节点 id。stage 依据见 AD-2。每条含：定义 / 子模块 3–6 个 / 参与方 / 五类流 in · out / 3 KPI / 风险 1–2 条与缓解 / 法语一句话 / 来源。

#### A.1 Projets & investissements — `b.projets` — **mature**

- **定义 FR**：`Le canal officiel qui regroupe les coopérations sino-mauritaniennes existantes — mines, énergies nouvelles, infrastructures, transformation agro-halieutique — et publie les projets matures comme les besoins de financement, avec des interfaces réservées à la pré-étude du centre de calcul vert.`
- **定义 ZH**：把中毛既有合作（矿业、新能源、基础设施、农渔加工）汇聚到官方渠道，发布成熟项目与融资需求，并为绿电算力预研预留接口。
- **子模块**：

| id | 模块 FR | 模块 ZH | 内容 | 来源 |
|---|---|---|---|---|
| `projets.mines` | Mines & titres miniers | 矿业与矿权 | 矿权/矿产品发布、可追溯性、长期协议、避免单一矿价依赖 | L48, L96, L109 |
| `projets.energies` | Énergies nouvelles & électricité verte | 新能源与绿电 | 新能源项目、算力专线与绿电合同、容量新增 | L7, L64, L108 |
| `projets.infrastructures` | Infrastructures & EPC | 基础设施与 EPC | 港口、工业用地、工程总承包、设备与融资对接 | L48 |
| `projets.agro-halieutique` | Transformation agro-halieutique | 农渔加工 | 渔获加工、冷链、认证、可追溯产品出口 | L7, L106, L109 |
| `projets.financement` | Financement & due diligence | 融资与尽调 | 融资需求发布、信用证/保险、优先项目信贷增级 | L47–48, L108 |
| `projets.interface-calcul` | Interface pré-étude calcul vert | 绿电算力预研接口 | 选址、电力方案、预研对接（预留接口） | L7, L49 |

- **参与方**：国家（牵头部委）、矿业/能源/渔业/农业等部委、毛方国企与私企、中方 EPC/设备/融资方、中国—非洲基金、商业银行与信用保险机构、AUREON（平台运营）。
- **五类流**：

| 流 | in（进入本业务） | out（由本业务流出） |
|---|---|---|
| Capital | 平台引导的投资意向与融资（`rel.capital.plateforme-projets`） | 可融资项目清单与融资需求（`rel.capital.projets-plateforme`） |
| Marchandises | 中方设备、EPC、工业投入品 | 矿产品、加工品、认证渔获（经平台展示与撮合） |
| Paiements | 银行结算为主；小额订单/过境可用 RIMP（Hypothèse） | 关税、港口费、仓储收入（要求单列统计，L107） |
| Données | 矿权、产能、港口与场地、项目清单（L48） | 项目跟踪、可追溯与海关单列统计（L109） |
| Attention | 对中方与国际投资方的官方曝光（`rel.attention.plateforme-projets`） | 面向西非买家的项目与产能可见度 |

- **3 KPI**：`kpi.projects_first_wave`（5–8 个项目）、`kpi.investment_intentions`（800 M–1,2 Md USD）、`kpi.direct_jobs_short_term`（2–4 k 就业，与 Formation 共享，展示时注明「vague 1」）。
- **风险与缓解**：① **流程被大宗矿产品卡住**（L69、L108）→ 小额订单与散矿流程分离、并行处理/时限承诺（L105、L108）；② **单一矿价依赖**（L96）→ 加工、可追溯、长期协议与多元收入（L96–L97）。
- **法语一句话**：`Transformer les intentions d'investissement en projets traçables et bancables.`
- **来源**：L7, L47–49, L86, L96, L106, L108–L109。

#### A.2 Commerce de gros — `b.commerce-gros` — **mature**

- **定义 FR**：`La mise en relation des acheteurs ouest-africains et des clusters industriels chinois via la plateforme : listes de marchandises, prix, quantités minimales, délais, demandes de devis et de commandes, suivi logistique, règles de dédouanement et de règlement inscrites dans la plateforme.`
- **定义 ZH**：通过平台连接西非买家与中国产业集群：商品清单、价格、起订量、交期、询价/下单、物流跟踪，并把清关与结算规则写进平台。
- **子模块**：

| id | 模块 FR | 模块 ZH | 内容 | 来源 |
|---|---|---|---|---|
| `gros.catalogue` | Catalogue & appels d'offres | 目录与询价 | 品类、价格、MOQ、交期、在线询价/下单 | L67 |
| `gros.sourcing` | Sourcing clusters chinois | 中国产业集群采购 | 五金、日用品、纺织、小家电、建材、摩托及配件；按西非气候/电压/包装/价格带筛选 | L68 |
| `gros.logistique` | Logistique & suivi | 物流与跟踪 | 运输、仓储、转运、状态跟踪 | L67 |
| `gros.dedouanement` | Dédouanement & règlement | 清关与结算 | 清关规则、结算规则写入平台；与散矿流程隔离 | L69, L108 |
| `gros.showroom` | Showroom & semaines d'exposition | 展贸中心与展贸周 | 线下看样、买家邀请（西非五国） | L66 |
| `gros.b2b` | Espace B2B acheteurs | 买家 B2B 空间 | 报价请求、订单历史、信用与物流状态 | L67（Hypothèse 细化为模块） |

- **参与方**：西非进口商/批发商（Sénégal、Mali、Guinée、Côte d'Ivoire、Gambie）、中国产业集群与贸易商、毛里塔尼亚海关与港口、货代与物流商、银行与信用保险、双边平台。
- **五类流**：

| 流 | in | out |
|---|---|---|
| Capital | 小额贸易融资、信用证、信用保险（L108） | 交易佣金/服务费（Hypothèse：平台商业模式，源文未给比例） |
| Marchandises | 中国产业集群货源（外部） | 经 Nouakchott 分拨至西非五国（`rel.marchandises.commerce-biens`） |
| Paiements | 买方付款、跨境结算（`rel.paiements.commerce-rimp`） | 货款支付给中方供应商（银行/信用证） |
| Données | 询价、订单、物流、清关数据（L67、L109） | 品类需求与价格趋势（脱敏后） |
| Attention | RIMU B2B 受众与展贸周流量（`rel.attention.rimu-commerce`） | 买家线索与复购 |

- **3 KPI**：`kpi.wholesale_matching`（300–800 M USD）、`kpi.wa_goods_transit`（800 M–2 Md USD/an，中长期间接）、`kpi.wa_countries`（5 国）。
- **风险与缓解**：① **被大宗矿产品流程阻塞**（L69）→ 清关/结算规则单列、独立窗口（L108–L109）；② **入境/过境/分销规则不清**（L106、L109）→ 国家一次性 clarification（L109）。
- **法语一句话**：`Acheter chinois, livrer ouest-africain : un guichet, des règles écrites.`
- **来源**：L7, L48, L66–69, L87, L90, L101, L106, L108–L109。

#### A.3 Biens de consommation & hub Afrique de l'Ouest — `b.biens-conso` — **pré-étude**

- **定义 FR**：`Le hub de distribution de biens de consommation chinois vers l'Afrique de l'Ouest : un showroom permanent ou des semaines d'exposition à Nouakchott ou dans un port désigné, et une zone en ligne dédiée sur la plateforme — descriptions, prix, quantités minimales, délais, devis, suivi logistique — connectée aux onglets « À proximité / Marché » et au live commerce de RIMU.`
- **定义 ZH**：面向西非的中国消费品分拨枢纽：努瓦克肖特或指定港口的常设展贸中心/展贸周 + 平台线上专区（描述、价格、起订量、交期、询价、物流跟踪），并与 RIMU 的「附近/市场」及直播带货打通。
- **子模块**：

| id | 模块 FR | 模块 ZH | 内容 | 来源 |
|---|---|---|---|---|
| `conso.showroom` | Showroom permanent / semaines d'exposition | 常设展贸 / 展贸周 | 租赁或改造既有建筑；邀请西非五国买家 | L66 |
| `conso.online` | Zone en ligne biens de consommation | 消费品线上专区 | 描述、价格、MOQ、交期、询价/下单、物流跟踪 | L67 |
| `conso.sourcing` | Sourcing adapté | 适配性采购 | 按气候、电压、包装、价格带筛选中国货源 | L68 |
| `conso.rimu` | Connexion RIMU | 与 RIMU 打通 | 连接「À proximité / Marché」与 live commerce | L67 |
| `conso.transit` | Transit, zone franche, apurement | 过境、自由区与核销 | 港口窗口、样品临时进口核销、自由区 | L106 |
| `conso.paiement` | Paiement & règlement | 支付与结算 | RIMP、货到付款/预付、银行结算 | L30, L69 |

- **参与方**：中国产业集群与贸易商、西非五国进口商/买家、毛里塔尼亚海关与港务、物流与仓储商、RIMU/RIMP、AUREON。
- **五类流**：

| 流 | in | out |
|---|---|---|
| Capital | 展贸中心装修与首批样品种子资金（L107）、贸易融资 | 服务费/仓储与过境收益（要求单列统计，L107） |
| Marchandises | 中国消费品、样品、设备 | 经 hub 分拨至五国（`rel.marchandises.biens-senegal` 等 5 条）与 RIMU Shop 线上（`rel.marchandises.biens-rimu`） |
| Paiements | 买方付款（`rel.paiements.biens-rimp`） | 供应商货款、关税与港口费（单列） |
| Données | 商品目录、订单、物流、样品核销（L67、L106、L109） | 需求数据（脱敏后）反哺选品 |
| Attention | RIMU 受众与直播（`rel.attention.rimu-biens`）、展贸周邀请 | 品牌曝光与复购 |

- **3 KPI**：`kpi.consumer_trial_orders_y1`（80–150 M USD）、`kpi.wa_goods_transit`（800 M–2 Md USD/an）、`kpi.wa_countries`（5 国）。
- **风险与缓解**：① **场地与关税制度未落定**（L106、L109）→ 国家决策 + 一次性规则 clarification；② **消费品质量控制**（L109）→ 质量控制 + 可追溯 + 供应商筛选（L68）。
- **法语一句话**：`Des usines chinoises aux acheteurs ouest-africains : un hub, deux canaux — physique et en ligne.`
- **来源**：L7, L30, L65–69, L87, L90, L101, L106–L109。

#### A.4 Finance & RIMP — `b.finance-rimp` — **pilote**

- **定义 FR**：`Le rail de paiement RIMP, interconnecté aux portefeuilles et opérateurs existants, monétisé par les commissions marchands et transfrontalières, la microfinance, les canaux administratifs et le B2B ; il porte aussi les instruments de financement commercial (lettres de crédit, assurance-crédit) nécessaires aux flux de biens.`
- **定义 ZH**：RIMP 支付轨道，与既有钱包/运营商互操作，通过商户与跨境佣金、微贷、行政渠道与 B2B 变现；同时承载商品流所需贸易融资工具（信用证、信用保险）。
- **子模块**：

| id | 模块 FR | 模块 ZH | 内容 | 来源 |
|---|---|---|---|---|
| `rimp.portefeuille` | Portefeuille & comptes RIMP | 钱包与账户 | 2,8 M 累计账户目标；KYC/账户体系 | L73 |
| `rimp.marchand` | Paiements marchands & QR | 商户收单与 QR | 全国商户 QR 部署（2029） | L56 |
| `rimp.administratif` | Paiements administratifs | 行政缴费 | 水电、市政、优先行政缴费（2029） | L41, L56 |
| `rimp.transfrontalier` | Transferts transfrontaliers | 跨境汇款 | 向 Sénégal/Mali 等扩展 | L80, L102 |
| `rimp.credit` | Microfinance & crédit | 微贷与信贷 | 信贷产品试点（2030）；商户信用评估 | L42, L57 |
| `rimp.interoperabilite` | Interopérabilité & rails | 互操作与轨道 | 央行强制互操作时间表；国家补贴/工资优先走互操作轨道 | L111 |

- **参与方**：毛里塔尼亚央行、商业银行、电信运营商与钱包机构、商户、国家（补贴/工资）、小微金融机构、RIMU、AUREON。
- **五类流**：

| 流 | in | out |
|---|---|---|
| Capital | 微贷资金、贸易融资（L108） | 信贷投放与垫资（Hypothèse：产品设计待定） |
| Marchandises | 被支付的商品流（作为支付的反向流） | 贸易结算指令（信用证/汇款） |
| Paiements | RIMU Shop/直播打赏/订阅（`rel.paiements.rimu-rimp`）、批发与消费品结算（`rel.paiements.commerce-rimp`、`rel.paiements.biens-rimp`） | 回传支付结果给 RIMU（`rel.paiements.rimp-rimu`）；向 Sénégal/Mali 扩展（`rel.paiements.rimp-senegal`、`rel.paiements.rimp-mali`） |
| Données | 交易、商户、信用数据（L42、L99） | 信用评分、风控信号（本地账本，L114） |
| Attention | RIMU 受众 → 开户转化（`rel.attention.rimu-rimp`） | 支付成功页/权益（Hypothèse） |

- **3 KPI**：`kpi.wallets_2031`（2,8 M 账户）、`kpi.revenue_rimp_2031`（90–140 M USD）、`kpi.payment_flow_2031`（15–25 Md USD/an，统一口径，见 QA-1）。
- **风险与缓解**：① **互操作阻力**（L111）→ 央行强制时间表 + 国家支付优先走互操作轨道；② **云依赖/跨境数据**（L114）→ 本地账本与核心模型、推理回流。
- **法语一句话**：`Faire passer la valeur du cash au circuit numérique audité.`
- **来源**：L30, L32, L41–42, L56–57, L73–74, L80, L98–99, L102, L108, L111, L114。

#### A.5 Formation & talents — `b.formation` — **mature**

- **定义 FR**：`Transformer les formations professionnelles, les conseils de santé publique, les techniques agricoles et pastorales et les informations gouvernementales en vidéos courtes accessibles, avec RIMU Jobs et des formations courtes ; objectif : 1 000–3 000 personnes formées en première vague et un vivier de talents pour le calcul, les mines, la pêche et l'administration.`
- **定义 ZH**：把职业培训、公共卫生建议、农牧技术、政府信息转成可访问的短视频，配合 RIMU Jobs 与短训；首批培训 1,000–3,000 人，为算力、矿业、渔业与行政输送人才。
- **子模块**：

| id | 模块 FR | 模块 ZH | 内容 | 来源 |
|---|---|---|---|---|
| `formation.rimu-jobs` | RIMU Jobs & formation courte | 就业与短训 | 职位、技能短训、培训内容 | L31 |
| `formation.videos` | Vidéos de formation professionnelle | 职业培训视频 | 培训、农牧技术、公共卫生内容短视频化 | L11 |
| `formation.cursus` | Cursus & partenariats chinois | 中方课程与合作 | 课程、师资、远程医疗培训对接 | L48 |
| `formation.universites` | Classes commandées & apprentis | 大学定向班与学徒 | 面向算力/运维/数字岗位的定向培养 | L115 |
| `formation.certification` | Certification des compétences | 技能认证 | 认证体系与雇主对接（Hypothèse 细化） | L11（推断） |

- **参与方**：高等教育与职业培训部、大学与职校、企业雇主、中方院校/企业课程方、RIMU、AUREON、算力中心（用人方）。
- **五类流**：

| 流 | in | out |
|---|---|---|
| Capital | 培训补贴（L107）、合作办学投入（Hypothèse） | 人力资本输出至算力中心（`rel.capital.formation-calcul`）与各业务线 |
| Marchandises | 教学设备与实训器材（Hypothèse） | 认证人才（非货物，归入人力资本） |
| Paiements | 培训费用/RIMP 支付（Hypothèse：小额课程付费） | 讲师与创作者分成（Hypothèse） |
| Données | 课程、题库、技能画像（本地存储，L99） | 就业匹配数据、培训效果数据 |
| Attention | 通过 RIMU 分发的受众（`rel.attention.rimu-formation`） | 培训内容进入 RIMU 内容库（`rel.attention.formation-rimu`） |

- **3 KPI**：`kpi.training_people`（1 000–3 000 人）、`kpi.related_jobs_mlt`（8–15 k 关联就业）、`kpi.jobs_5y`（30–40 k 累计）；三项就业/培训口径不同，页面必须注明「ne pas additionner」（QA-3）。
- **风险与缓解**：① **人才短缺与流失**（L115）→ 大学定向班、本地学徒、创作者在乌吉亚变现以留住年轻人（L32）；② **培训与岗位错配**（Hypothèse）→ 与算力中心/企业签订用人需求后再开班。
- **法语一句话**：`Transformer chaque formation en vidéo courte et chaque compétence en emploi.`
- **来源**：L11, L31, L32, L48, L88, L97, L107, L115。

#### A.6 Santé & télémédecine — `b.sante` — **pilote**

- **定义 FR**：`L'ouverture de 8–15 points de télémédecine en première vague, appuyés par les capacités chinoises et par l'IA — support aux consultations à distance, alertes sanitaires et météo — avec diffusion de contenus de santé publique certifiés via RIMU.`
- **定义 ZH**：首批开设 8–15 个远程医疗点，依托中方能力与 AI 支持（远程会诊辅助、卫生与气象预警），并通过 RIMU 传播认证公共卫生内容。
- **子模块**：

| id | 模块 FR | 模块 ZH | 内容 | 来源 |
|---|---|---|---|---|
| `sante.points` | Points de télémédecine | 远程医疗点 | 8–15 个点，设备与网络 | L88 |
| `sante.consultation` | Consultations à distance | 远程会诊 | 中方/毛方医生对接；AI 转写与辅助 | L41, L48 |
| `sante.contenus` | Contenus de santé publique | 公共卫生内容 | 预防、母婴、营养等短视频 | L11 |
| `sante.comptes` | Comptes vérifiés Santé | 认证卫生机构号 | 认证医院/卫生部账号 | L31 |
| `sante.alertes` | Alertes sanitaires & météo | 卫生与气象预警 | 沙尘暴、疫情、极端天气 | L41 |
| `sante.formation` | Formation médicale continue | 继续医学教育 | 面向基层医护的短训（Hypothèse） | L11（推断） |

- **参与方**：卫生部、医院与基层卫生点、中方医院/医生、RIMU、算力中心（AI 支持）、电信运营商、AUREON。
- **五类流**：

| 流 | in | out |
|---|---|---|
| Capital | 远程医疗点设备与合作投入（Hypothèse，源文只给点数） | 公共卫生效率收益（定性） |
| Marchandises | 医疗设备与耗材（Hypothèse） | 无（服务型） |
| Paiements | 诊疗支付/RIMP（Hypothèse）+ 公共财政 | 医生与机构结算（Hypothèse） |
| Données | AI 辅助（`rel.donnees.calcul-sante`）：转写、分诊辅助、预警 | 健康数据留在境内（L99、L114），仅脱敏统计 |
| Attention | 通过 RIMU 触达的受众（`rel.attention.rimu-sante`） | 认证健康内容进入 RIMU（`rel.attention.sante-rimu`） |

- **3 KPI**：`kpi.telemedicine_points`（8–15 个点）、`kpi.languages_content`（6 种语言覆盖）、`kpi.mau_2031`（2,5 M 受众触达）。
- **风险与缓解**：① **健康数据主权**（L99、L114）→ 本地存储、推理回流、脱敏；② **偏远点电力/网络不稳**（L113）→ 2N+柴油+光伏+电池，低带宽内容。
- **法语一句话**：`Un spécialiste à distance, une prévention dans chaque poche.`
- **来源**：L11, L31, L41, L48, L88, L99, L113–L114。

---

### Annexe B · RIMU 模块清单与 AI 用例

> 结构化镜像：`data-model.json → rimuModules` 与 `aiUseCases`。RIMU 全部模块必须在 05 区块可点，每个模块对应一个 L2/L3 抽屉。

| id | 模块 FR | 模块 ZH | 一句话内容 | 来源 |
|---|---|---|---|---|
| `rimu.live` | Live | 直播 | 婚礼、集市、渔获上岸、认证宗教讲座、直播带货 | L28 |
| `rimu.studio` | Studio créateurs | 创作者工作室 | 本地音乐版权库、模板、自动转写与字幕（AR/FR/hassaniya/EN） | L29 |
| `rimu.creation` | Économie des créateurs | 创作者经济 | 广告、直播打赏、电商；乌吉亚收入留在本国回路 | L32 |
| `rimu.shop` | RIMU Shop + RIMP | 商店 + RIMP | 目录、下单、货到付款/预付、RIMP 结算 | L30 |
| `rimu.jobs` | RIMU Jobs & formation | 就业与培训 | 职位、技能短训、职业培训内容 | L31 |
| `rimu.verifie` | Comptes vérifiés administratifs | 认证政务号 | 教育、卫生、市政缴费、天气/沙尘暴预警 | L31 |
| `rimu.mineurs` | Protection des mineurs | 未成年人保护 | 默认关闭个性化推荐、无限滚动、直播打赏、陌生人私信 | L36 |
| `rimu.souverainete` | Souveraineté des contenus | 内容主权 | 验证/审核/推荐由本国掌控；透明优先与举报，无任意审查 | L10, L112 |

**AI 用例**（结构化镜像 `aiUseCases`）：

| 组 | id | 用例 FR | 用例 ZH | 来源 |
|---|---|---|---|---|
| Production de contenu | `ai.contenu.soustitres` | Sous-titres automatiques, transcription, traduction AR/FR/EN | 自动字幕、转写、阿/法/英互译 | L40 |
| Production de contenu | `ai.contenu.formation` | Assistance à la préparation de vidéos de formation et de contenus religieux certifiés | 辅助制作培训视频与认证宗教内容 | L40 |
| Services du quotidien | `ai.quotidien.sante` | Support aux consultations médicales à distance | 远程医疗会诊支持 | L41 |
| Services du quotidien | `ai.quotidien.alertes` | Alertes précoces tempête de sable ; rappels de paiement eau/électricité | 沙尘暴预警；水电缴费提醒 | L41 |
| Services du quotidien | `ai.quotidien.prix` | Vidéos d'information sur les prix du poisson et des produits agricoles | 鱼价与农产品价格信息视频 | L41 |
| Usages professionnels | `ai.pro.mines` | Rappels d'entretien des machines (mines, ports) ; enregistrement des débarquements de pêche | 矿山/港口设备维护提醒；渔获上岸登记 | L42 |
| Usages professionnels | `ai.pro.commercants` | Aide à l'encaissement et à l'évaluation de crédit des commerçants | 商户收单与信用评估辅助 | L42 |
| Usages professionnels | `ai.pro.etat` | Envoi automatisé d'informations gouvernementales | 政府信息自动推送 | L42 |

**治理流程文案（05 / 06 共用）**：`Pré-modération par modèle → mots-clés / empreinte vocale → contrôle humain → réponse rapide aux signalements.`（L34）
中文：模型预审 → 关键词/声纹 → 人工复核 → 举报快速响应。

---

### Annexe C · 四层架构（源文 L18–24 表）

| # | 层 FR | 层 ZH | 组成（FR） | 国家价值（ZH 归纳） | 来源 |
|---|---|---|---|---|---|
| 1 | Couche expérience | 体验层 | Application RIMU / web léger / mode faible bande passante ; point d'entrée projets/biens/formation de la plateforme bilatérale | 覆盖智能机与功能机，统一中毛合作入口 | L20 |
| 2 | Couche middleware | 中间件层 | Comptes et identité numérique, middleware contenu, middleware paiement (RIMP), middleware risque, middleware commerçants | 一次建设、多应用复用 | L21 |
| 3 | Couche intelligente | 智能层 | Recommandation, sécurité de contenu multilingue, transcription vocale, modèles sectoriels (pêche/mines/agriculture) | 把算力变成日常决策与内容生产工具 | L22 |
| 4 | Couche infrastructure | 基础设施层 | Extension du centre Tier III de Nouakchott + cluster GPU + nœuds edge + priorité électricité verte | 数字主权、低时延、能源变现 | L23 |

---

### Annexe D · 路线图数据集（供 08 时间轴与 data-model.json → roadmap）

**D.1 双边平台三步（L47–L49；无明确年份，按 2026 启动假设）**

| 步 | 里程碑 FR | 里程碑 ZH | 关键交付 | 来源 |
|---|---|---|---|---|
| 1 | Lancement officiel | 正式启动 | 指定牵头部委与双方联络人；政府/企业发布项目、商品、消费品与融资需求 | L47 |
| 2 | Mise en correspondance des ressources | 资源匹配 | 毛方提供矿权与矿产品、港口与工业用地、展贸场地、医院与培训场所；中方对接订单、设备、EPC、融资、课程与远程医疗 | L48 |
| 3 | Six catégories en parallèle + pré-étude du calcul | 六类活动并行 + 算力预研 | 项目、批发、消费品、金融、培训、卫生并行；同步选址与绿电算力预研 | L49 |

**D.2 RIMU 五年曲线（L52–L59，Source）**

| 年 | MAU | DAU | 日均时长 | 关键里程碑 FR |
|---|---|---|---|---|
| 2027 | 250 000 | 80 000 | 28 min | Invitation ; pré-installation / forfaits sans data avec opérateurs ; phase 1 du calcul en service |
| 2028 | 700 000 | 200 000 | 32 min | Ouverture publique ; fonds créateurs |
| 2029 | 1 200 000 | 360 000 | 36 min | Paiements administratifs prioritaires ; QR marchands national |
| 2030 | 1 800 000 | 550 000 | 38 min | Pilote de produits de crédit |
| 2031 | 2 500 000 | 800 000 | 40 min | ≈ 60 %+ des internautes ; packs de contenu vers zone francophone |

**D.3 算力三期（L61–L64；时长 Source，起始为假设）**

| 期 | 时长 | 功率 | 算力 | 重点 FR | 来源 |
|---|---|---|---|---|---|
| Phase 1 | ≈18 mois | ≈1 MW | ≈100 cartes accélératrices | Inférence ; modération et contrôle des risques des deux plateformes | L61 |
| Phase 2 | ≈36 mois | 2–3 MW | 未给 | Séparation entraînement / inférence ; interfaces d'inférence régionales ouest-africaines (éventuel) | L62 |
| Phase 3 | 未给 | 模块化 | 未给 | Extension modulaire ; contrat d'électricité verte ; accord national sur l'électricité | L63 |

补充：供电以「容量新增 + 专线」保障，不挤占居民用电（L64）；绿电项目规模 20–50 MW 与 Phase 1 的 1 MW 是不同口径（见 QA-5）。

---

### Annexe E · 国家支持、五类风险与结构性转型（速查表）

**E.1 五项国家支持（L105–L109）**

| # | 支持 FR | 支持 ZH | 关键动作 | 首个 6 个月交付物 | 来源 |
|---|---|---|---|---|---|
| 1 | Organisation et politiques | 组织与政策 | 牵头部委 + 联络人 + 七个窗口对接人；优先项目并行处理/时限；数字转型部明确授权 | 联络人名单与授权函 | L105 |
| 2 | Sites, terrains et listes de projets | 场地、土地与项目清单 | 五类产业首批清单；展贸场地；港口窗口；工业用地 | 首批项目清单 + 场地候选 | L106 |
| 3 | Financement et budget | 资金与预算 | 有限种子资金；优先项目有限支持；关税/港口费/仓储收入单列 | 种子预算与统计口径 | L107 |
| 4 | Finance et règlements | 金融与规则 | 央行/银行/基金/信用保险对话；小额订单融资与散矿分离；绿电专线与电价 | 算力预研第一版 + 电价机制 | L108 |
| 5 | Diplomatie, douanes et règles de données | 外交、海关与数据规则 | 邀请西非买家；一次性澄清入境/核销/过境/分销；数据留在境内 | 买家邀请与规则说明 | L109 |

**E.2 五类风险与缓解（L111–L115）**

| # | 风险 FR | 风险 ZH | 缓解机制 | 来源 |
|---|---|---|---|---|
| 1 | Interopérabilité et résistance des portefeuilles/opérateurs | 钱包互操作与运营商阻力 | 央行强制互操作时间表；国家补贴/工资优先走互操作轨道 | L111 |
| 2 | Controverses religieuses/tribales et protection des mineurs | 宗教/部落争议与未成年人保护 | 宗教顾问机制；产品层默认严格限制；快速下架；本国审核规则 | L112 |
| 3 | Électricité, sable et fluctuations du réseau | 电力、沙尘与电网波动 | 2N + 柴油 + 光伏 + 电池；绿电合同；新增容量与专线 | L113 |
| 4 | Données transfrontalières et dépendance au cloud | 跨境数据与云依赖 | 本地账本与核心模型；训练可混合、推理回流 | L114 |
| 5 | Talents et continuité du projet | 人才与项目连续性 | 大学定向班；本地学徒；数据与支付互操作立法义务 | L115 |

**E.3 结构性转型 before/after（L96–L99）**

| 维度 | Aujourd'hui（源文） | 2031（源文） |
|---|---|---|
| 出口 | 原矿与未加工渔获为主 | 加工、可追溯产品、长期协议、西非商业枢纽、可出口数字服务；降低单一矿价依赖 |
| 收入 | 依赖单一矿价 | 仓储、关税、过境、支付与数字服务收入 |
| 金融 | 现金难审计 | 成年人数字账户 <20 % → ≈50 %；补贴与工资可追溯，减少漏损 |
| 注意力 | 外国平台主导 | 本国规则与本地语言内容（hassaniya、peul、soninké、wolof） |
| 数据 | 模型/权重在境外 | 数据、密钥、推荐模型权重、支付账本留在境内 |

---

### Annexe F · 法语文案术语表（FR ↔ ZH，供 i18n 词典）

| FR | ZH | 说明 |
|---|---|---|
| plateforme bilatérale | 双边平台 | 官方合作入口，不译「双边网站」 |
| point d'entrée | 入口 | 全站核心隐喻，统一译「入口」 |
| super-application | 超级应用 | RIMU 的定位词 |
| RIMU | RIMU（国民短视频与社交平台） | 保留字母，不音译 |
| RIMP | RIMP（支付钱包与结算轨道） | 保留字母，不音译 |
| calcul vert | 绿色算力 | 不用「绿色计算」 |
| souveraineté numérique | 数字主权 | BRIEF 与品牌统一用语 |
| hassaniya | 哈桑尼亚阿拉伯语 | 毛里塔尼亚通行阿拉伯语变体 |
| peul / soninké / wolof | 富拉语 / 索宁克语 / 沃洛夫语 | 民族语言 |
| créateurs | 创作者 | 不用「网红」 |
| compte vérifié | 认证账号 | 政务/机构认证 |
| tiers de confiance | 可信第三方 | 支付/认证语境 |
| interopérabilité | 互操作（性） | 支付与数据语境 |
| grand livre | 账本 | 支付总账 |
| inférence | 推理 | AI 算力语境 |
| poids des modèles | 模型权重 | 主权语境核心词 |
| nœuds edge | 边缘节点 | 基础设施层 |
| Tier III | Tier III 数据中心 | 可用性等级 |
| zone franche | 自由区 | 过境/仓储语境 |
| apurement | 核销（清关核销） | 样品临时进口语境 |
| lettre de crédit | 信用证 | 贸易融资 |
| rehaussement de crédit | 信用增级 | 优先项目融资 |
| assurance-crédit | 信用保险 | 出口语境 |
| EPC | 工程总承包 | 基建语境 |
| transformation agro-halieutique | 农渔加工 | 源文术语 |
| mono-export | 单一出口 | 结构性问题 |
| scénario ambitieux | 雄心情景 | 不得写成「预测」 |
| circuit traçable | 可追溯回路 | 补贴/工资/支付语境 |

---

### Annexe G · 前端执行交接与自检

**G.1 内容 → 组件映射（建议）**

| 区块 | 组件 | 数据源 |
|---|---|---|
| 00 | `Hero` + `KpiTicker` + `ParticleRoute` | `kpis`（heroKpis）、`brand` |
| 01 | `ProblemCardGrid` + `BeforeAfterToggle` | `kpis` |
| 02 | `SystemOverview`（节点/边来自 JSON） | `pillars`、`businessLines`、`relations`、`layers` |
| 03 | `PillarCard×3` + `Drawer` | `pillars` |
| 04 | `BusinessCardGrid` + `StageFilter` + `Drawer` | `businessLines` |
| 05 | `PhoneMockup` + `ModuleGrid` | `rimuModules`、`kpis` |
| 06 | `LayerStack` + `AiUseCaseTabs` + `ComputePhases` | `layers`、`aiUseCases`、`kpis` |
| 07 | `FlowGraph` + `FlowLegend` | `relations` |
| 08 | `TrackTimeline` | `roadmap`、`kpi.series.*` |
| 09 | `KpiDashboard` + `RevenueDonut` + `JobsLayers` | `kpis` |
| 10 | `BenefitColumns` + `WestAfricaMap` + `TransformationTable` | `kpis`、`regions`、`transformations` |
| 11 | `SupportAccordion` | `stateSupports` |
| 12 | `RiskAccordion` | `risks` |
| 13 | `NextSteps` + `ContactBlock` | `meta.contact`、`meta.methodology` |

**G.2 交付前自检清单（本文件）**

- [x] 14 个区块（00–13）逐一覆盖：目标 / 布局要点 / 展示文案 FR+ZH / 数据引用 / 交互要点 / 响应式与降级 / 来源。
- [x] 三支柱（03）、RIMU 全部模块与 AI 用例（05、Annexe B）、四层架构（06、Annexe C）、路线图三条轨道（08、Annexe D）、2031 效益（09、10）、五项国家支持（11、Annexe E.1）、五类风险（12、Annexe E.2）、西非区域收益与结构性转型（10、Annexe E.3）全部覆盖。
- [x] 六大业务线每条给全：定义 / 3–6 子模块 / 参与方 / 五类流 in·out / 3 KPI / stage / 1–2 风险与缓解 / 法语一句话 / 来源（Annexe A）。
- [x] 所有数字引用 data-model.json 的 KPI id；未在源文件出现的数字均标注 Hypothèse 或 Proposition（如 30/90/180 天）。
- [x] 发现的口径冲突写入 data-model.md「QA 修正清单」，未在本文件悄悄改数（涉及 QA-1、QA-2、QA-3、QA-5、QA-6）。
- [x] 法语文案可直接上线；中文为对照译文；术语与源文件一致（plateforme bilatérale、point d'entrée、RIMU、RIMP、calcul vert、hassaniya 等）。
- [x] 每区块均有移动端方案与降级路径（粒子/WebGL/动画可关闭）。
- [x] 本文件未修改任何源文件、BRIEF 或他人文件；仅写 `web/spec/content-model.md`（及配套 data-model.md / data-model.json）。

**G.3 待 Lead 决断的 3 个点**

1. 主标语是否采用 « Une plateforme. Trois souverainetés. »（AD-1），或改用 « Ce que nous construisons, et ce que cela change. » 作 H1。
2. 13 区块联系方式是否上线前替换为公司域名邮箱（README §3 提醒个人联系方式公开风险）。
3. 30/90/180 天序列（13 区块）是否保留为提案；若客户已有既定时间表，以此覆盖即可。

---

> 文件结束。配套阅读：`web/spec/data-model.md`（KPI 字典、公式、QA 修正清单）、`web/spec/data-model.json`（页面读取数据）。