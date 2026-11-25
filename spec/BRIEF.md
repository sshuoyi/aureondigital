# BRIEF — Site dynamique « Plateforme de coopération numérique sino-mauritanienne · RIMU + Contenu IA + Calcul national »

> 本文件是团队协作的总纲。所有 annexe 规格必须服从本 Brief；Lead 负责最终合并为 `web/PLAN_v1.md`。
> 日期：2026-11-09 · 项目：AUREON DIGITAL · 语言：方案文档用中文，网页显示文案以法语为主、中文为切换语言。

## 0. 源材料（只读，不得修改）
- 全文抽取文本：`/Users/liuxd/Documents/aureon-digital/rimu_source_text.txt`（117 行，法语完整稿，含表格）
- 原始 docx 逐字副本：`/Users/liuxd/.dsh/attachments/v1/files/d9/d931a53baab31dae87712c6f2afc171af8934a6ac49dfbbdbc6177818d472e54/Plateforme_cooperation_numerique_sino-mauritanienne_RIMU_AI_version_francaise_enrichie.docx`；工作区副本 `rimu_source.docx`
- 品牌参考（只读）：`README.md` 第 2、8 节；`presentation/index.html` 顶部 CSS 品牌变量；`assets/logo-mark.svg`；`export/AUREON_SONEF_Proposition_Cooperation_Strategique_FR.pdf`（版式气质）
- 只写自己任务 write scope 内的文件；不改源文件、不改既有成品。

## 1. 我们要交付什么
用户要的是**一个动态网页的完整设计方案**（不是马上写页面）：
网页要在一屏/一次浏览内让人看懂「中毛数字合作平台 + RIMU 超级应用 + 国家 AI 算力中心」是什么、各业务如何咬合、最终能达到什么效果；**每个业务板块可点击，点击后出现该业务的详细说明**；要有动态效果与数据可视化；数据要大而合理。
最终 Lead 交付：`web/PLAN_v1.md`（完整方案）+ 自检后的 `web/PLAN_v2_optimisation.md`（优化方案）。附件规格作为 PLAN 的附录/依据。

## 2. 目标读者与三种阅读模式
1. **毛里塔尼亚政府/部委（3 分钟）**：被引导式「Mode Pitch」带着走完 6 个关键场景，一眼看懂诉求与政绩。
2. **中方合作伙伴/投资方（15–30 分钟）**：自由探索，点开每个业务看细节、数据、风险与路线图。
3. **会议/打印（A4 横向 PDF）**：同一套内容可打印成提案册，扫码回到网页。
读者核心疑问（网页必须逐条回答）：
- 这是什么？为什么是现在？谁在做？
- 业务全景与相互咬合关系是什么？（资金/货物/支付/数据/注意力五类流）
- 点开每个业务，具体做什么、怎么做、谁参与、什么阶段、多少数据？
- 最终效果：2031 年用户、支付、收入、就业、区域枢纽、GDP 贡献？
- 需要国家/合作方支持什么？风险如何兜底？

## 3. 叙事主线（5 幕）
1. **Le constat（为什么）**：注意力被外国平台拿走、现金经济不可审计、数据与模型在境外、依赖矿石单一出口。
2. **La réponse（是什么）**：一个官方双边入口 + 一个国民超级应用 + 一个算力主权底座 = 架构三支柱。
3. **Le système（怎么咬合）**：六大业务线 / RIMU 模块 / 四层架构 / 五类流关系网络。
4. **La trajectoire（何时）**：双边三步 + RIMU 五年曲线（2027–2031）+ 算力三期。
5. **L'impact & la décision（效果与请求）**：2031 数据、国家收益、西非枢纽、五项国家支持、风险保障、下一步。
候选主标语（FR，可打磨）：
- « Une plateforme. Trois souverainetés. »（注意力 / 货币流通 / 数据与算力）
- « Relier la Chine et l'Afrique de l'Ouest, depuis Nouakchott. »
- « Ce que nous construisons, et ce que cela change. »

## 4. 信息架构（14 个区块，可微调但必须全覆盖）
| # | 区块 | 作用 | 必须出现的内容/交互 |
|---|---|---|---|
| 00 | Hero | 3 秒定位 | 动态中毛连线/数据粒子背景；主标语；三支柱；4 个滚动 KPI；CTA「Visite guidée 3 min」「Voir les chiffres 2031」 |
| 01 | Constat | 制造必要性 | 4 个问题卡片 + 前后对比动效；一句转折「la réponse」 |
| 02 | Vue système | 一屏看懂全局 | 三支柱 + 六大业务 + 四层架构总图；可点击进入业务详情；点节点高亮关联连线 |
| 03 | 架构三支柱 | 三个入口 | Plateforme bilatérale / RIMU / Centre de calcul 三张主卡，点击展开总览抽屉 |
| 04 | 六大业务线 | 双边合作实体业务 | Projets & investissements（矿山/能源/基建/农渔加工）、Commerce de gros、Biens de consommation & hub Afrique de l'Ouest、Finance & RIMP、Formation & talents、Santé & télémédecine；每卡含一句话价值、3 个指标、状态标签（mature / pré-étude / pilote） |
| 05 | RIMU 超级应用 | 国民级产品 | 手机 mockup（4 个 tab：For You / Abonnements / À proximité / Marché），Live、Studio créateurs、RIMU Shop+RIMP、Jobs/formation、comptes vérifiés、创作者经济、未成年人保护、内容主权；模块可点击 |
| 06 | Contenu IA & Calcul | 技术底座 | 四层架构可交互（expérience / middleware / intelligent / infrastructure）；AI 用例（内容生产、生活服务、行业/行政）；算力三期（~100 GPU/1MW → 2–3MW → 20–50MW 绿电）；数据不出境 |
| 07 | Relations | 咬合关系可视化 | 关系网络图，五类流可筛选：Capital / Marchandises / Paiements / Données / Attention；hover 显示流量说明，click 节点打开业务详情；「聚焦」模式 |
| 08 | Feuille de route | 时间可信度 | 2026–2031 时间轴，三条轨道可切换：Plateforme bilatérale（3 步）/ RIMU（5 年 MAU-DAU-时长）/ Calcul（3 期）；里程碑点击展开 |
| 09 | Chiffres 2031 | 数据冲击 | 仪表盘：2,5 M MAU · 800 k DAU · 40 min/j · 2,8 M portefeuilles · 150–220 M USD 收入（1,3–1,9 % PIB）· 30–40 k 就业；收入构成图；「scénario ambitieux」口径标注 + 方法学入口 |
| 10 | Bénéfices & transformation | 国家/区域收益 | 毛里塔尼亚短/中/长期收益卡；西非区域枢纽地图（Nouakchott → Sénégal/Mali/Guinée/Côte d'Ivoire/Gambie 动态流向）；结构性转型 before/after |
| 11 | Ce que nous demandons à l'État | 行动诉求 | 五项支持（组织与政策 / 场地与项目清单 / 资金 / 金融与规则 / 外交与数据），做成可展开的决策清单，附「6 个月首个交付物」 |
| 12 | Risques & garanties | 可信度 | 5 类风险（支付互操作、宗教/未成年人、电力/沙尘、跨境数据/云依赖、人才）配缓解措施手风琴 |
| 13 | Next steps & contact | 转化 | 下一步 30/90 天；预约会议/下载 PDF；AUREON 简介与联系方式；页脚数据来源与方法学 |

## 5. 交互模型（必须实现的三层深度）
- **L1 总览**：一屏系统图 / 卡片矩阵，5 秒建立全局。
- **L2 业务详情抽屉**：点击任一业务/支柱/模块 → 右侧 480–560 px 抽屉（移动端 92 vh 底部抽屉）。抽屉固定 6 个 tab：Aperçu / Fonctionnement / Chiffres clés / Acteurs & flux / Feuille de route / Risques。背景压暗但保留上下文，关联节点高亮；Esc/返回关闭；URL hash 深链（如 `#/business/rimu`）可分享；浏览器后退可关闭。
- **L3 抽屉内下钻**：每个 tab 内可再展开子模块（手风琴/子卡片），不再跳新页面。
- **关系图**：SVG/Canvas 力导向或手工布局，五类流分色；hover tooltip、click 打开抽屉、筛选、isolate；动画沿路径流动的数据点。
- **引导模式（Mode Pitch）**：3 分钟自动巡游 6–8 个关键场景，带章节进度、暂停/继续/退出；可分享 `?tour=1`；这是「一下就能明白」的核心武器。
- **RIMU 手机演示**：手机 mockup 内 tab 可点；可自动演示 8 秒（滑动信息流 → Marché → Live commerce → 支付成功）；hover 暂停。
- **数据动画**：计数器（locale 格式 FR：「2,5 M」「800 000」，千位不换行空格；ZH：「250 万」）、图表 draw-on、进度环、数字滚动只在进入视口时触发一次（回看可重播）。
- **其他**：语言切换 FR/中文（阿语 RTL 预留）；打印模式（@media print → A4 横向提案册）；低带宽模式（自动/手动关闭粒子与 WebGL）；reduced-motion 降级；键盘可达；分享/OG 卡片。
- 禁止：无意义 3D 炫技、自动播放声音、点击后全屏跳转丢失上下文。

## 6. 视觉方向（AUREON 品牌延续 + 国家数字基础设施气质）
- **基底**：深海军蓝 `#071C36` / `#0B1F3A`，象牙白 `#F6F0E4`，香槟金 `#C9A25E`（描边、数据高亮、章节序号），深金 `#9C7A38`（浅底文字）。**信号绿** `#00A86B`（毛里塔尼亚绿）仅用于正向数据/地图流向，面积 ≤10%。
- **字体**：法文展示 Didot（品牌）→ 网页回退 Playfair Display / Cormorant；法文正文 Avenir Next → 回退 Nunito Sans / Inter；中文展示 Noto Serif SC，中文正文 Noto Sans SC（必须做字体子集与 unicode-range 切片）；数据/标签用等宽数字特性。
- **节奏**：深色沉浸（Hero/系统图/数据）与象牙白编辑式（业务详情/收益/诉求）交替；金色细线、1px 网格、坐标刻度延续「国家文件/安全印刷」语言，但用动态数据赋予科技感。
- **禁止**：通用 SaaS 渐变紫、圆角玻璃卡片堆叠、emoji 图标、廉价 3D 地球。
- **图片/插画**：优先 SVG 线稿地图、手机线框、层级示意图；可用现有素材 `assets/logo-mark.svg`、地图素材；不使用无授权照片。

## 7. 数据基线（来自源文件，不得篡改；派生数据必须标注）
### 7.1 源文件硬数据
- 2031：MAU 2,5 M；DAU 800 k；日均 40 min；RIMP 钱包 2,8 M；三块收入 150–220 M USD（≈ PIB 的 1,3–1,9 %），构成：RIMU 30–50 M、RIMP 90–140 M、算力 30–40 M。
- 五年路径：2027 250k/80k/28min → 2028 700k/200k/32 → 2029 1,2M/360k/36 → 2030 1,8M/550k/38 → 2031 2,5M/800k/40。
- 双边：三步（启动 → 资源匹配 → 六类活动并行 + 算力预研）；首批 5–8 个项目、800 M–1,2 Md USD 投资意向；批发撮合 300–800 M USD；首年消费品试单 80–150 M USD；培训 1 000–3 000 人；远程医疗 8–15 个点；短期直接/关联就业 2 000–4 000。
- 中长期：经毛里塔尼亚流转的西非货物 800 M–2 Md USD/年；8 000–15 000 个关联就业；绿电算力一期 20–50 MW、年服务收入数千万至 1 亿 USD；在 4,5 % 增速上再 +0,8–1,5 个百分点；五年直接+生态就业 30 000–40 000；成人数字账户 <20 % → 约 50 %；占当时网民 60 %+。
- 算力：Phase 1 ~18 个月、~100 张加速卡、~1 MW；Phase 2 ~36 个月、2–3 MW；Phase 3 模块化扩展 + 绿电合同。
- RIMU：4 tab；15–60 s 短视频 + 3 min 中视频 + 图文；默认 360p/480p、夜间预缓存；Live；Studio créateurs；Shop+RIMP；Jobs/培训；认证机构号；创作者经济（广告/打赏/电商）；多语（hassaniya、peul、soninké、wolof + FR/EN/AR）；未成年人默认关闭个性化推荐/无限滚动/直播打赏/陌生人私信；本地音乐版权库。
- 四层架构：体验层 / 中间件层（身份、内容、支付 RIMP、风控、商户）/ 智能层（推荐、多语内容安全、语音转写、行业模型）/ 基础设施层（Tier III 数据中心 + GPU 集群 + edge + 绿电）。
- 五项国家支持：组织与政策；场地/土地/项目清单；资金与预算；金融与规则；外交、海关与数据规则。
- 五类风险：钱包互操作、宗教/部落内容与未成年人、电力/沙尘/网络、跨境数据与云依赖、人才与项目连续性。

### 7.2 允许的派生数据（须在方法学中写公式）
- 日均播放量：800 k DAU × 40 次观看/日（40 min ÷ 平均 60 s 停留）≈ 3 200 万次/日 ≈ 117 亿次/年。
- 网民数：2,5 M ÷ 60 % ≈ 420 万（2031）。
- 支付流量：RIMP 收入 90–140 M ÷ 综合费率 0,5–0,7 % ≈ 130–280 亿美元/年；对外统一口径建议取「约 150–250 亿美元/年」并注明假设。
- 创作者：MAU 2,5 M × 2 % ≈ 5 万活跃创作者；其中 20 % 变现 ≈ 1 万人（标注为假设）。
- 电商 GMV：2,5 M 用户 × 年均 80–120 USD ≈ 2–3 亿美元（标注为假设）。
### 7.3 必须修正/统一的口径问题（在数据模型里列「QA」）
1. 源文件「年支付流量数百亿美元」与「RIMP 收入 90–140 M USD」不自洽（费率会低到 0,05 % 以下）——建议统一为 150–250 亿美元/年，或解释为「数百亿乌吉亚」。
2. 源文件「2,8 M 钱包 ≈ 成年人口一半」与毛里塔尼亚人口规模不符——建议改为「≈ 全国人口一半 / ≈ 成年人 80–85 %」，或把 2,8 M 定义为账户数（含多账户）。
3. 就业三组数字（2–4 k / 8–15 k / 30–40 k）需明确口径分层（直接短期 / 关联中长期 / 五年累计生态），避免并列展示时互相打脸。
4. 「60 %+ 网民」与 MAU 2,5 M 需绑定同一年（2031）与同一网民口径。
所有派生/假设数字在网页上必须有「Méthodologie」入口与标签（Source / Dérivé / Hypothèse），不得伪装成官方数据。

## 8. 语言与文案
- 网页默认 **法语**，提供 **中文** 切换；阿语 RTL 预留（第二期）。
- 方案文档用中文；法语文案要地道（数字用不换行空格、逗号小数、书名号规范、避免中式法语）。
- 每个数据必须带单位、年份、口径；修饰词克制（« scénario ambitieux » 而非「一定会」）。

## 9. 技术约束（供 tech-architecture 使用）
- 静态优先、可离线/CDN；首屏 3G 目标 <3 s，首包 gzip <1,5 MB（字体除外，需子集）；不强制 WebGL，3D 只做渐进增强。
- 推荐栈（可论证替代）：Astro 或纯静态 HTML + 内容 JSON；GSAP + ScrollTrigger（动效）、Lenis（平滑滚动）、ECharts 或手写 SVG（图表）、原生 IntersectionObserver；i18n 用 JSON 词典；打印样式表复用同一 DOM；部署 Cloudflare Pages / Vercel / 本地镜像。
- 响应式：桌面 1440 优先，移动 390 宽必须可用（抽屉 → 底部 sheet，系统图纵向重排，关系图可缩放/列表替代）。
- 无障碍：对比度 AA、键盘可达、focus trap、prefers-reduced-motion、语义化标题结构。
- 可维护：所有业务内容与数据抽成 JSON（`content.functions` / `content.business-lines` / `data.kpis`），文案与代码分离；新增业务不改组件。
- 埋点：区块到达率、业务点击、抽屉停留、tour 完成率、PDF 下载（可选，隐私友好）。

## 10. 附件分工与验收
### T1 content-analyst → `web/spec/content-model.md` + `web/spec/data-model.md` + `web/spec/data-model.json`
- 把源文件拆成可上线的内容模型：14 个区块逐块给出「标题 / 副标题 / 正文 FR 建议 / 中文对照 / 数据引用 / 来源行号」；六大业务线每条给：定义、子模块 3–6 个、参与方、五类流（in/out）、3 个 KPI、阶段标签、风险 1–2 条、FR 一句话。
- 单独做 KPI 数据表（数值、单位、年份、类型 Source/Dérivé/Hypothèse、公式、展示格式、图表建议），并写 QA 修正清单（见 7.3）。
- data-model.json 供后续页面直接读取（结构自定，但必须是合法 JSON，含 i18n FR/ZH 字段、业务 id、关系边）。
### T2 experience-designer → `web/spec/interaction-motion.md` + `web/spec/visual-system.md`
- 逐区块写交互与动效规格：触发、元素、属性、duration、easing、stagger、结束状态、移动端降级、reduced-motion 替代；包括业务抽屉、关系图、手机 mockup、Mode Pitch、时间轴、地图、图表、计数器。
- visual-system：色彩 token、字体栈与字号阶梯（桌面/移动）、栅格间距、组件清单（卡片/抽屉/tab/tooltip/时间轴/图例/按钮）、图标风格、暗/亮节奏、打印版式规则（A4 横向，沿用 presentation/index.html 品牌语言）。
- 输出必须能直接给前端执行，禁止「要有科技感」这类空话。
### T3 web-engineer → `web/spec/tech-architecture.md`
- 栈选型对比与推荐（Astro vs Next vs vanilla）、目录结构、内容/数据 JSON schema、i18n 方案、动效与图表库取舍与体积预算、性能预算与降级策略、打印/PDF 方案、部署与域名、SEO/OG、分析、可访问性、测试与验收清单、两周/四周实施排期与人力。
- 给出「最小可行版本（MVP）」与「完整体验版」的功能切分，方便客户先上线再看效果。

## 11. 质量红线
- 每个区块方案必须同时写清：**布局 / 内容 / 数据 / 交互 / 动效 / 移动端 / 降级**，缺一不可。
- 所有数字可溯源或标注假设；所有交互有状态与返回路径；所有动效有 prefers-reduced-motion 方案。
- 不与源文件事实冲突；发现冲突写进 QA 而不是悄悄改。
- 法语文案需准确（可参考源文件原文术语：plateforme bilatérale、point d'entrée、souveraineté、RIMP、calcul vert、hassaniya 等）。
- 交付文件 UTF-8 Markdown / JSON，路径固定，便于 Lead 合并。
