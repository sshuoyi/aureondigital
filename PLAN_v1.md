# RIMU × 中毛数字合作平台 · 动态网页完整方案 v1.0

> **项目**：Plateforme de coopération numérique sino-mauritanienne · RIMU + Contenu IA + Centre national de calcul  
> **交付**：面向政府/合作伙伴/投资方的动态提案网页（含 3 分钟引导、可点击业务详情、数据可视化、A4 打印孪生版）  
> **日期**：2026-11-09 · **版本**：v1.0（待评审）· **文档语言**：中文；网页默认法语，可切中文  
> **依据**：源文件 `Plateforme_cooperation_numerique_sino-mauritanienne_RIMU_AI_version_francaise_enrichie.docx`（法语完整稿，下称「源文件」）  
> **配套附件**：`web/spec/content-model.md`（内容模型）、`data-model.md/json`（数据字典）、`interaction-motion.md`（交互动效）、`visual-system.md`（视觉系统）、`tech-architecture.md`（技术架构）

---

## 0. 一页看懂（Executive summary）

**这个网页是什么：** 它不是一份被搬上网页的 PDF，而是一个**可被「走完」的系统演示**——用一条 5 幕故事线讲清「为什么做、做什么、怎么咬合、走到哪、最后得到什么」，用**三层点击深度**让不同读者各取所需。

**一句话叙事（FR，主标语 + 副标语）：**  
> **« Une plateforme. Trois souverainetés. »**  
> **« Relier deux pays. Équiper une nation. »** — 一个官方双边入口 + 一个国民级超级应用 RIMU + 一个算力主权底座：注意力主权、货币流通主权、数据与算力主权。

**四条设计主线：**
1. **一屏看懂系统**：三支柱（双边平台 / RIMU / 国家算力）× 六大业务线 × 四层架构，同屏出现、互相连线。
2. **点得下去**：任何业务卡/节点/模块点击后，右侧滑出「业务详情抽屉」，固定 6 个 tab（概览 / 运行方式 / 关键数字 / 参与方与流量 / 路线图 / 风险），支持 URL 深链和浏览器返回，上下文不丢失。
3. **数据即证据**：2031 年 2,5 M MAU、2,8 M 支付钱包、150–220 M USD 年收入（占 GDP 1,3–1,9 %）、30–40 k 就业；所有数字带年份与口径，源数据 / 派生 / 假设三级标注。
4. **动效为理解服务**：金色数据流、四层架构逐层装配、五年曲线绘制、手机内 RIMU 自动演示、3 分钟「Mode Pitch」——动效只在帮助理解时出现，尊重 reduced-motion，低带宽自动降级。

**14 个区块：** Hero → 现实问题 → 系统总图 → 三支柱 → 六大业务 → RIMU 超级应用 → AI 与算力 → 关系网络 → 路线图 → 2031 数字 → 国家与西非收益 → 对国家的五项请求 → 风险与保障 → 下一步与联系。

**三种阅读模式：** ① 3 分钟引导（政府/会议）② 自由探索（投资方/技术方）③ A4 横向打印/PDF（会后材料，二维码回网页）。

**成功标准（可验收）：**
- **理解度**：首次访问者 3 分钟内能说出「三支柱 + 3 个 2031 关键数字 + 1 个诉求」；目标 ≥ 80 %（5 人可用性测试）。
- **探索度**：平均访问打开 ≥ 2 个业务抽屉；抽屉平均停留 ≥ 45 s。
- **可信度**：0 个无来源数字暴露在页面上（全部可点开「Méthodologie」）；0 处下文 §7.4 的口径矛盾。
- **性能**：3G 首屏可交互 < 3 s，首包 gzip < 1,5 MB，移动端 390 px 无横向滚动。
- **转化**：CTA（预约会议 / 下载 PDF）点击率不低于访问量 8 %。

---

## 1. 目标、读者与成功标准

### 1.1 网页必须回答的 6 个问题
| 问题 | 回答位置 | 必须留下的一句话 |
|---|---|---|
| 这是什么？ | Hero / 系统总图 | 中毛数字合作的国家级统一入口 + 国民超级应用 + 算力底座 |
| 为什么是现在？ | 现实问题 | 注意力、现金、数据、单一矿产依赖，四件事必须同时解 |
| 各业务怎么咬合？ | 关系网络 / 六大业务 | 五类流：资本、货物、支付、数据、注意力 |
| 每个业务具体做什么？ | 业务抽屉（6 tab） | 定义、子模块、参与方、阶段、数字、风险 |
| 最终效果多大？ | 2031 数字 / 收益 | 2,5 M 用户、2,8 M 钱包、150–220 M USD、30–40 k 就业 |
| 需要谁做什么？ | 对国家的五项请求 / 下一步 | 五项支持，6 个月内出第一批可验证成果 |

### 1.2 读者画像与阅读场景
| 读者 | 场景 | 最关心 | 期望动作 | 进入方式 |
|---|---|---|---|---|
| 毛里塔尼亚部委/总理府 | 会议投屏、3 分钟汇报 | 国家收益、主权、就业、需要国家批什么 | 指定牵头部委、进入对接 | Mode Pitch + 打印册 |
| 中国合作伙伴/央企/投资方 | 尽调、内部评审 | 项目清单、资金流、风险、退出/回报 | 预约闭门会、提交意向 | 自由探索 + 下载 PDF |
| 西非进口商/商会 | 展会后、手机浏览 | 有什么货、怎么订、怎么付、物流多久 | 询价/登记 | 手机端 + RIMU Shop 演示 |
| 多边机构/媒体 | 快速了解 | 可信度、数据来源、区域影响 | 引用/报道 | 首页 + 2031 数字 |
| AUREON 内部/合作方 | 统一口径 | 最新叙事与数据 | 复用 | 全站 + 附件 |

### 1.3 设计目标（按优先级）
1. **3 分钟建立整体认知**（叙事 + 动效 + Mode Pitch）。
2. **每个业务可下钻且不迷路**（三层深度 + 抽屉 + 返回上下文）。
3. **数字可信、规模够大但不离谱**（源文件数据 + 明确派生公式 + 情景标签）。
4. **国家级质感，不像 SaaS 官网**（AUREON 品牌延续：海军蓝、香槟金、象牙白、Didot/Avenir）。
5. **在毛里塔尼亚真实网络环境下可用**（低带宽、移动优先、可打印、可分享）。

---

## 2. 核心叙事与语言策略

### 2.1 叙事骨架
> **主标语（H1）：« Une plateforme. Trois souverainetés. »**  
> **副标语 / 开场字幕：« Relier deux pays. Équiper une nation. »**  
> 一个平台，三种主权：**注意力主权**（年轻人留在国家平台上）、**货币流通主权**（现金变为可审计的数字流通）、**数据与算力主权**（数据、模型、支付账本留在境内）。由此长出一个**西非数字与商业枢纽**。

四句战略目标（源自源文件，网页作为 Hero 下方的四条滚动字幕）：
1. 把年轻人的注意力留在国家平台上；
2. 把现金经济转化为可审计的数字流通；
3. 把数据与模型保留在国家领土内；
4. 在矿业与渔业之外，创造可出口的数字服务与西非商业枢纽。

### 2.2 五幕剧本（页面即剧本）
| 幕 | 区块 | 情绪 | 页面上的「一句话」 |
|---|---|---|---|
| I. 现实 | 01 Constat | 紧迫 | 四件事正在同时发生，且互相拖累。 |
| II. 答案 | 02–03 系统/三支柱 | 清晰 | 一个入口、一个超级应用、一个算力底座。 |
| III. 系统 | 04–07 六业务/RIMU/AI/关系 | 信服 | 不是六件并列的事，而是一台互相供血的机器。 |
| IV. 轨迹 | 08 路线图 | 可信 | 2026 启动，2027–2031 五步走，算力三期。 |
| V. 效果 | 09–13 数字/收益/请求/风险/下一步 | 行动 | 到 2031 年，这些数字会变成国家能力。 |

### 2.3 语气与文案原则
- **法语为主**（官方、克制、可信），**中文切换**用于中方内部与中文会议；阿语 RTL 预留第二期。
- 动词优先、少形容词：用 « 2,5 M d'utilisateurs » 而不是 « une croissance spectaculaire »。
- 所有未来数字统一加**情景标签**：« scénario ambitieux »（对应源文件「scénario ambitieux」），避免被理解为承诺。
- 敏感议题（宗教内容、未成年人、数据主权）不回避，用「规则 + 机制 + 保障」三段式呈现，建立信任而非营销。
- 中文文案不直译法语，保留关键法文术语（RIMU、RIMP、calcul vert、hassaniya），确保跨语言会议可对齐。

---

## 3. 信息架构与浏览动线

### 3.1 三层深度模型（核心交互结构）
```
L1 总览层（一屏/一区块看懂系统）
   │  点击业务卡 / 系统图节点 / RIMU 模块
   ▼
L2 业务详情抽屉（右侧滑出，页面上下文保留，背景压暗 + 关联节点高亮）
   │  6 个 tab：Aperçu · Fonctionnement · Chiffres clés · Acteurs & flux · Feuille de route · Risques
   ▼
L3 抽屉内下钻（手风琴 / 子卡片 / 图表 tooltip / 里程碑展开，不再跳新页面）
```
- **所有 L2/L3 都是同一页面状态**，不刷新、不跳转；浏览器返回键 = 关闭当前层。
- **URL 深链**：`#/business/projets`、`#/rimu/{moduleId}`、`#/pillar/calcul`、`#/s/05-rimu`、`#/methodo`、`?tour=1`（路由规则见 `data-model.json → meta.routes`；旧 `#/business/rimu` 重定向到 `#/rimu`），方便会后微信/邮件直接发「RIMU 那一页」。
- **面包屑**：抽屉顶部显示 `Système / RIMU / RIMU Shop`，可逐级返回。

### 3.2 14 区块总览
| # | 区块（FR） | 作用 | L1 关键交互 | 核心数据 |
|---|---|---|---|---|
| 00 | Hero | 3 秒定位 + 情绪 | 粒子/连线背景、4 个滚动 KPI、双 CTA、滚动提示 | 2,5 M / 2,8 M / 150–220 M / 800 M–2 Md |
| 01 | Le constat | 制造必要性 | 4 张问题卡 hover 翻转「我们改变什么」 | 成人数字账户 <20 % 等 |
| 02 | Vue système | 一屏全局 | 三支柱 + 六业务 + 四层同屏；点节点→抽屉；hover 高亮连线 | 3 + 6 + 4 |
| 03 | Trois piliers | 三个入口 | 三张大卡；点击展开支柱抽屉 | 每支柱 3 个 KPI |
| 04 | Six filières | 实体业务全景 | 3×2 卡片；hover 显示流量条；点击开抽屉 | 首批 5–8 项目、300–800 M、80–150 M… |
| 05 | RIMU | 国民产品体验 | 手机 mockup 可点 tab；模块芯片点击联动手机 + 抽屉 | 4 tab、40 min、15–60 s… |
| 06 | IA & calcul | 技术底座 | 四层架构 hover/点击；AI 用例切换；算力三期 | ~100 GPU/1 MW → 2–3 MW → 20–50 MW |
| 07 | Relations | 咬合关系 | 五类流筛选、节点点击、isolate、tooltip | 流类型数量/说明 |
| 08 | Feuille de route | 时间可信度 | 三轨切换、时间轴拖拽、里程碑展开 | 2027–2031 用户/DAU/时长 |
| 09 | Chiffres 2031 | 数据冲击 | 计数器、收入构成图、情景切换、方法学 | 2,5 M / 800 k / 150–220 M / 1,3–1,9 % PIB |
| 10 | Bénéfices | 国家/区域收益 | 短中长三列、西非地图流向、Before/After | 800 M–2 Md、8–15 k、+0,8–1,5 pt |
| 11 | Demandes à l'État | 行动诉求 | 五项手风琴 + 决策清单 + 6 个月交付 | 5 项 |
| 12 | Risques | 可信度 | 5 类风险手风琴，风险/缓解/指标三列 | 5 |
| 13 | Next steps | 转化 | 30/90 天行动、预约、下载、二维码、联系方式 | 3 个 CTA |

### 3.3 三种阅读模式
| 模式 | 触发 | 行为 | 退出 |
|---|---|---|---|
| **Mode Pitch 3 min** | Header 按钮 / `?tour=1` / Hero CTA | 自动滚动+聚焦 8 个关键场景，底部字幕（FR/ZH），章节进度，暂停/继续/跳过 | Esc / 完成 / 关闭 |
| **Explore** | 默认 | 自由滚动 + 点击抽屉 + 关系图探索 | — |
| **Print / PDF** | Header「Dossier PDF」/ `?print=1` | 同一 DOM 切换为 A4 横向分页版式，隐藏交互控件，保留全部内容 | 打印返回 |

### 3.4 全局导航与骨架
```
┌──────────────────────────────────────────────────────────────┐
│ HEADER  [AUREON × RIMU] [当前章节名]   FR/中文  [Mode Pitch] [PDF] [Contact] │
├────┬─────────────────────────────────────────────────────────┤
│ C  │                                                         │
│ H  │   SECTION CONTENT — 12 栏栅格，max-width 1440 px        │
│ A  │   每屏一个主信息；上下留白 ≥ 96 px（桌面）              │
│ P  │                                                         │
│ T  │                                                         │
│ E  │                                                         │
│ R  │                                                         │
├────┴─────────────────────────────────────────────────────────┤
│ PROGRESS  01/14  ●●●○○○○○○○○○○○  ▓▓▓▓░░░░░░  ↑             │
└──────────────────────────────────────────────────────────────┘
```
- **左侧章节轨**（桌面 ≥ 1280 px）：14 个刻度 + 当前章节竖排名；hover 显示缩略标题；点击跳转；向下滚动时自动收窄为细线。
- **移动端**：章节轨改为顶部 sticky 细进度条 + 底部「章节抽屉」按钮；抽屉/弹层全屏化。
- **Header**：滚动后从透明变为深蓝毛玻璃；始终保留语言、Mode Pitch、PDF 三个动作。
- **页脚**：数据来源与方法学、AUREON 联系信息、隐私说明、版本号与更新日期。

---

## 4. 全局布局与视觉系统

### 4.1 视觉定位
延续 AUREON 的「国家文件 / 安全印刷」基因，但让**数据流动起来**：
- **底色**：深海军蓝 `#071C36` 与 `#0B1F3A`（沉浸、权威），象牙白 `#F6F0E4`（阅读、编辑感）。
- **金属**：香槟金 `#C9A25E`（描边、章节号、数据高亮），深金 `#9C7A38`（浅底文字），**金色永远以细线/小面积出现**，不做大面积渐变金。
- **信号绿**：`#00A86B`（毛里塔尼亚绿）只用于「正向增长、地图流向、风险已缓解」三类语义，面积 ≤ 10 %。
- **中性色**：石板灰 `#3E4C5E`、雾灰 `#8C97A8`、浅灰底 `#EDE7DB`。
- **质感**：1 px 金色细线、坐标刻度、编号（01–14）、微缩标注（如 « Source : document de référence, 2026 »），像一份会被反复翻阅的国家文件。

### 4.2 字体
| 用途 | 首选 | 网页回退 | 说明 |
|---|---|---|---|
| 法文展示标题 | Didot / Didot LT | **Playfair Display**（400/500） | 高对比衬线，国家级质感；字号大、字距紧 |
| 法文正文/UI | Avenir Next | **Nunito Sans**（400/600/700） | 几何人文无衬线，屏幕可读 |
| 中文展示 | — | **Noto Serif SC**（500/700） | 标题气质对齐 Didot |
| 中文正文 | — | **Noto Sans SC**（400/500/700） | 与 Nunito Sans 同气质 |
| 数据/等宽 | Avenir Next / SF Mono | **IBM Plex Mono**（数字） | KPI 大数字用 tabular-nums，防跳动 |

字号阶梯（桌面 / 移动，px）：Display 96/56 · H1 64/40 · H2 44/32 · H3 28/24 · Lead 22/19 · Body 16/16 · Small 13/13 · Micro 11/11。正文行高 1.6（法文 1.55），标题行高 1.02–1.1。

### 4.3 栅格与间距
- 12 栏栅格，容器 max 1440，边距桌面 64 / 平板 40 / 移动 20；栏距 24。
- 8 pt 基准间距：8/16/24/32/48/64/96/128；区块上下 padding 128（桌面）/ 72（移动）。
- 内容最大行宽：法文 68 字符、中文 36 字；数据卡可突破至全宽。

### 4.4 暗亮节奏（页面呼吸）
| 区域 | 底色 | 理由 |
|---|---|---|
| Hero / 系统图 / 关系图 / 2031 数字 / 风险 | 深海军蓝 | 沉浸、数据发光、会议投屏对比强 |
| 现实问题 / 六大业务 / 路线图 / 收益 / 请求 / 下一步 | 象牙白 | 长文阅读、打印友好、国家级文件感 |
| RIMU / AI 与算力 | 深蓝 + 象牙白分区（左深右浅或上深下浅） | 产品体验沉浸 + 技术解释清晰 |

### 4.5 图形语言
- **地图**：毛里塔尼亚 + 西非线稿地图（SVG），努瓦克肖特为发光节点；不用真实卫星图。
- **图标**：1.5 px 线性图标，几何、无圆角端点；不用 emoji。
- **手机**：线框 + 少量真实 UI 色块（RIMU 内容卡），屏幕内容用抽象色块而非假截图。
- **数据图形**：金色折线/柱、绿色增量、灰色基线；坐标轴细、网格弱；所有图表配「数据标签 + 口径」。
- **纹理**：极淡的 guilloche 同心弧线（来自 AUREON 标志）只做 3–5 % 透明度背景，避免干扰。
---

## 5. 逐区块详细设计（00–13）

> 每块均按「目标 / 布局 / 内容 / 数据 / 交互 / 动效 / 移动端 / 降级」给出。所有法语文案为工作稿，最终由法语母语审校（AUREON 已有 `copy/review_fr.md` 流程）。

### 00 · Hero — 「3 秒定位」
- **目标**：让任何人在 3 秒内知道这是「中毛国家级数字合作」而不是普通创业公司官网，并给两个动作：看 3 分钟引导 / 自己探索。
- **布局**：100svh 深蓝满屏。左侧 7 栏文案，右侧 5 栏为动态网络视觉；底部一行 4 个 KPI 计数器；右下滚动提示。
- **内容（FR）**：
  - Eyebrow：`Plateforme de coopération numérique sino-mauritanienne`
  - H1：`Une plateforme.\nTrois souverainetés.`
  - 副标语（Lead）：`Relier deux pays. Équiper une nation.`
  - Sub：`Un point d'entrée officiel, une super-application nationale, un socle de calcul souverain — pour retenir l'attention, digitaliser l'économie et garder les données au pays.`
  - 三支柱 chips：`Point d'entrée` · `RIMU` · `Calcul IA national`（点击滚动到 02/03）
  - CTA：主 `Visite guidée · 3 min`（播放 Mode Pitch）；次 `Explorer le système`（滚到 02）；文字链 `Dossier PDF`
  - KPI 条（4 项，2031，取自 T1 `meta.heroKpis`）：`2,5 M utilisateurs actifs mensuels` · `150–220 M USD de revenus annuels` · `2,8 M portefeuilles RIMP` · `30–40 k emplois directs + écosystème (5 ans)`；`800 k DAU` 与 `40 min/jour` 在 09 仪表盘出现。
- **数据**：4 个 KPI 均为源文件数字；每个 KPI 带 `ⓘ` → 方法学弹层（年份、类型、来源）。
- **交互**：chips → 平滑滚动；KPI ⓘ → Methodo modal；CTA 主按钮 → 启动 Mode Pitch；鼠标移动时网络视觉轻微视差（±6 px）。
- **动效**：H1 两行 clip-path 自下而上 0.9 s（stagger 0.12 s）；金色横线 0.6 s 展开；网络节点 1.2 s 内错峰浮现；KPI 计数器 1.6 s ease-out；滚动离开时内容淡出+上移 0.98 缩放。
- **移动端**：H1 40 px；网络粒子从 120 降到 40；KPI 2×2 网格；隐藏鼠标视差。
- **降级**：reduced-motion → 静态完成态、数字直接显示；低带宽 → 网络换成静态 SVG。

### 01 · Le constat — 「为什么必须现在做」
- **目标**：用四个结构性事实建立紧迫性，且每个问题都对应后文一个解法。
- **布局**：象牙白。左侧章节标题（固定 4 栏），右侧 2×2 问题卡；底部一条金色过渡线 → 02。
- **内容（FR 标题 + 中文解释）**：
  1. `Une jeunesse connectée, sans plateforme nationale` — 注意力被境外平台拿走，规则、推荐与内容安全不在自己手里。
  2. `Une économie de cash, difficile à auditer` — 成人数字账户 < 20 %；补贴与工资走现金，渗漏不可追踪。
  3. `Des données et des modèles hébergés ailleurs` — 数据、模型权重、支付账本在境外，云依赖 = 主权缺口。
  4. `Une économie exposée au seul prix du minerai` — 卖原矿与未加工渔获，价格一波动，全国承压。
  - 每卡 hover 翻出「Ce que nous changeons」：国家平台 / RIMP 数字流通 / 国家算力中心 / 西非商业与数字服务枢纽。
- **数据**：卡片 2 用源文件「成人数字账户 < 20 % → 约 50 %」的起点；其余为定性事实，不硬凑数字。
- **交互**：卡片 hover/tap 翻转（正面问题，背面解法 + 箭头跳 02）；点击卡片跳到对应区块（问题 1→05 RIMU，2→04 金融，3→06 算力，4→04 项目/贸易）。
- **动效**：四卡依次上浮 60 ms 错峰；hover 时图标线条自绘；过渡线滚动进入时从左到右展开。
- **移动端**：单列卡片，点按翻转；过渡线简化为分隔线。
- **降级**：无 hover 设备默认展示正面 + 「Voir la réponse」链接。

### 02 · Vue système — 「一屏看懂全局」
- **目标**：本页最重要的「理解引擎」：一张图同时呈现 3 支柱 + 6 业务 + 4 层，并暗示互相连接。
- **布局**：深蓝全屏。上部三支柱横排；中部六业务 3×2 网格；下部四层架构横条；三组之间用金色细线连接；左上角标题 + 一句解释；右下角图例「点击任一模块查看详情」。
- **内容**：
  - 标题：`Un système, pas une collection de projets.`（一个系统，而非项目拼盘）
  - 副标题：`Trois piliers, six filières, quatre couches — chaque brique alimente les autres.`
  - 节点标签用简短版：入口 / RIMU / 算力；Projets · Commerce · Consommation · Finance · Formation · Santé；Expérience · Middleware · Intelligence · Infrastructure。
- **数据**：节点上无数字，避免拥挤；hover tooltip 显示 1 个关键数字（如 RIMU 2,5 M、算力 1 MW→20–50 MW、项目 5–8）。
- **交互**：hover 节点 → 高亮其相连边、其余降透明度 30 %；点击 → 对应抽屉（L2）；「点击背景」清除选中；「Voir en plein écran」可选展开（隐藏标题，图占 90vh）。
- **动效**：入场分三拍——支柱 0→1（0.6 s）、六业务（0.8 s）、四层（1.0 s）；连线 stroke-dashoffset 绘制；待机时极缓的呼吸光。
- **移动端**：改为三组纵向手风琴（「三支柱」「六业务」「四层」），每组展开为列表卡；点击进入抽屉。
- **降级**：静态 SVG 全量可见；无 hover 高亮。

### 03 · Trois piliers — 「三个入口」
- **目标**：把「三合一架构」讲成三件可被记住的事。
- **布局**：象牙白；三列大卡（1/3 宽），每卡有巨大编号 01/02/03、线性图标、标题、一句话、3 个 KPI 小条、底部「Explorer le pilier →」；卡片整体可点。
- **内容**：
  1. **Point d'entrée de coopération** — `Un guichet unique pour les projets, le commerce, la finance, la formation et la santé.` KPI：5–8 个首批项目 / 800 M–1,2 Md USD 意向 / 6 类活动。
  2. **RIMU, super-application nationale** — `Le système d'exploitation du quotidien : contenus, commerce, emplois, services publics.` KPI：2,5 M MAU / 800 k DAU / 40 min/j。
  3. **Souveraineté du calcul** — `Un centre national de calcul IA : données, modèles et modération sur le territoire.` KPI：~100 GPU 一期 / 1 MW / 20–50 MW 绿电三期。
- **数据**：KPI 均来自源文件；数字小、标签大。
- **交互**：整卡点击 → 支柱抽屉（6 tab 同结构，内容为支柱级：组成、价值、KPI、参与者、路线、风险）；hover 卡片上浮 4 px、金线自左向右生长、KPI 小条变亮。
- **动效**：三卡 stagger 120 ms 进入；hover 时图标描线；KPI 数字进入视口计数一次。
- **移动端**：单列；卡片高度压缩，KPI 变两行。
- **降级**：无 hover 动效，链接常显。

### 04 · Six filières — 「双边合作的六条实体业务」
- **目标**：让政府/投资方看到「不是概念，是六类可落地的生意」，并能逐条点开。
- **布局**：象牙白；标题区右侧放阶段图例（`Mature` / `Pilote` / `Pré-étude`）；3×2 卡片网格；卡片之间用极淡 SVG 连接线表示关键依赖（消费品↔RIMP↔RIMU Marché；项目↔金融；培训↔RIMU Jobs；健康↔认证机构号）；hover 一张卡时，相连卡金色描边、其余降透明。
- **六卡内容（FR 标题 / 阶段 / 一句话 / 3 指标）**：
  1. **Projets & investissements**（Mature）— 矿山、新能源、基础设施、农渔加工;`5–8 projets` · `800 M–1,2 Md USD` · `6 filières`
  2. **Commerce de gros**（Mature）— 中国产业集群 ↔ 毛里塔尼亚进口商/西非;`300–800 M USD` 试单 · `6+ pays` · `dédouanement intégré`
  3. **Biens de consommation & hub Afrique de l'Ouest**（Pré-étude）— showroom + 线上专区 + live commerce;`80–150 M USD` 首年试单 · `800 M–2 Md USD/an` 中长期 · `5 marchés`
  4. **Finance & RIMP**（Pilote）— 钱包、商户收单、跨境与 B2B 支付;`2,8 M portefeuilles` · `90–140 M USD` · `interopérabilité banques/opérateurs`
  5. **Formation & talents**（Mature）— 职业短训、RIMU Jobs、大学订单班;`1 000–3 000 formés` · `8 000–15 000 emplois` · `30 000–40 000 écosystème`
  6. **Santé & télémédecine**（Pilote）— 远程会诊、健康短视频、公共预警;`8–15 points` · `couverture nationale` · `contenus certifiés`

> 注：阶段标签（Mature / Pilote / Pré-étude）为编辑判断，依据源文件 L7、L56–57、L88；上线前需 AUREON/毛方确认（见 `content-model.md` AD 记录）。

- **数据**：全部来自源文件；每个数字附年份/口径 tooltip。
- **交互**：点击卡片 → 业务抽屉；阶段徽章 hover 显示定义；「Voir les connexions」→ 07 关系图并 isolate 该业务。
- **动效**：卡片 stagger 60 ms；连接线滚动绘制；hover 时连接线上有金色小点流动；卡片底部金线出现。
- **移动端**：单列；隐藏连接线，改为每张卡底部「Lié à : RIMP · RIMU Marché」chips。
- **降级**：连接线静态；hover 效果变为点击态。

### 05 · RIMU — 「国民级超级应用」
- **目标**：把 RIMU 从「毛里塔尼亚版 TikTok」升级为「日常生活操作系统」，并让人相信它可被本地语言、低带宽与未成年人保护说服。
- **布局**：深蓝。左 6 栏叙事 + 模块芯片；右 6 栏手机 mockup（约 320×660，轻微 3D 透视 + 漂浮）；底部一条「主权与保护」信任带（三块：多语内容安全 / 未成年人默认保护 / 本地音乐版权）。
- **内容**：
  - H2：`RIMU, le système d'exploitation du quotidien.`
  - 模块芯片（可点，联动手机画面 + 打开抽屉）：`For You` · `Abonnements` · `À proximité` · `Marché` · `Live` · `Studio créateurs` · `RIMU Shop + RIMP` · `Jobs & formation` · `Comptes vérifiés`。
  - 说明：15–60 s 短视频 + 3 min 中视频 + 图文；默认 360p/480p、夜间预缓存；直播（婚礼、市场、渔获、认证宗教讲座、直播带货）；创作者工作室（本地音乐版权库、模板、语音转写与自动字幕 AR/FR/hassaniya/EN）；RIMU Shop 支持货到付款与预付；Jobs/短训；认证机构号（教育、卫生、市政缴费、风暴/沙尘预警）；创作者以乌吉亚变现（广告、打赏、电商）。
- **数据**：40 min/j、2,5 M MAU（2031）、15–60 s、360p/480p；创作者经济派生数字放在抽屉数据 tab，不在手机旁堆砌。
- **交互**：手机内 tab 可点（切换画面）；芯片点击 → 手机切到对应画面 + 抽屉打开对应 tab；手机默认自动演示 8 s 循环（信息流滑动 → Marché → Live 打赏 → 支付成功），hover/触摸暂停，配「Rejouer」；「Voir la démo complète」打开抽屉。
- **动效**：手机进入从右滑入 + 轻微 rotateY（3°）归位；屏幕切换 300 ms 滑入；Live 打赏有金色粒子；支付成功对勾路径绘制。
- **移动端**：手机移动到顶部（scale 0.9），芯片横向滚动；默认不自动播放（省流量），提供「Lancer la démo」。
- **降级**：静态手机 SVG + 关键画面截图式色块；无自动播放。

### 06 · IA & calcul — 「技术底座」
- **目标**：说明「算力不是空谈」：四层架构、三期路径、AI 的具体用途，以及数据主权如何落地。
- **布局**：深蓝。左 5 栏 2.5D 四层架构（CSS perspective 堆叠，悬停层抬升并显示 tooltip）；右 7 栏三组 AI 用例（tabs 或并排）；下方通栏算力三期时间条（18 个月 / 36 个月 / 扩展）+ 绿电与「不占用居民用电」说明 + 主权 callout。
- **内容**：
  - 四层：Expérience（RIMU app/轻网页/低带宽；双边平台入口）/ Middleware（身份、内容、支付 RIMP、风控、商户）/ Intelligence（推荐、多语内容安全、语音转写、行业模型）/ Infrastructure（Tier III + GPU 集群 + edge + 绿电）。
  - AI 用例三组：**Production de contenu**（字幕、转写、多语翻译、培训/技术/认证宗教内容辅助）；**Services du quotidien**（远程问诊支持、沙尘暴预警、水电缴费提醒、鱼价/农产品价格视频）；**Usages professionnels & administratifs**（矿山/港口设备保养提醒、渔获上岸登记、商户收单与信用评估、政府信息自动发布）。
  - 算力：Phase 1 ~18 个月、~100 张加速卡、~1 MW、服务两平台审核与风控；Phase 2 ~36 个月、2–3 MW、训练/推理分离、可向次区域开放推理接口；Phase 3 模块化扩展 + 绿电合同 + 国家电力协议；新容量与专线，不挤占居民用电。
  - 主权 callout：`Données, poids des modèles et grand livre des paiements restent sur le territoire.`
- **数据**：GPU 数、MW、18/36 个月、2–3 MW、20–50 MW、30–40 M USD 收入（后期）。
- **交互**：层 hover 抬升 + tooltip；点击层 → 架构抽屉；用例组 tab 切换（带图示）；三期卡片点击展开细节；callout 点击打开「主权与合规」抽屉。
- **动效**：四层随滚动逐层「装配」到位（translateY + rotateX，600 ms × 4，stagger 120 ms）；GPU 点阵呼吸；callout 金色边框绘制；三期进度条滚动填充。
- **移动端**：四层变纵向手风琴；三期卡片横向滑动；callout 全宽。
- **降级**：四层静态等距图；无点阵动画。

### 07 · Relations — 「它们如何互相供血」
- **目标**：回答「每个业务的相互关系和功能效果」——用一张可交互的五类流网络图，把「六件事」变成「一台机器」。
- **布局**：深蓝全屏。左侧 3 栏：标题 + 五类流图例（复选框：Capital / Marchandises / Paiements / Données / Attention）+ 「Tout afficher」；中部 9 栏：关系图（SVG/Canvas，约 70vh）；右下角选中节点小卡（名称、一句话、1 个数字、按钮「Ouvrir la fiche」）；底部提示「Cliquez sur un nœud · Filtrez les flux」。
- **节点（12 个）**：三支柱 + 六业务 + 3 个外部节点（État & régulateurs、Banques & opérateurs、Afrique de l'Ouest）。
- **边（五类流）**：
  - **Capital**（金）：投资 → 项目 → 收益 → 再投资；国家/银行/基金。
  - **Marchandises**（绿）：中国集群 → 毛港口/展厅 → 西非买家；本地加工品 → 出口。
  - **Paiements**（钢蓝）：RIMP 连接商户、平台、行政缴费、B2B；钱包 ↔ 银行/运营商。
  - **Données**（薄荷）：RIMU/平台/算力中心之间的数据与模型；本地留存。
  - **Attention**（陶土）：RIMU 内容 ↔ 创作者 ↔ 商户/机构；注意力转化为交易与就业。
- **交互**：图例勾选过滤；hover 节点/边 → tooltip（一句话解释 + 数字）；点击节点 → 抽屉；「Isoler」模式只显示该节点一跳关系；「Réinitialiser」；可切换「Vue flux / Vue matrice」（矩阵表格，移动端默认）。
- **动效**：布局稳定后静止（避免晕眩）；激活边上小点单向流动；选中时非关联元素降到 15 % 透明；图例切换 200 ms 淡入淡出。
- **移动端**：默认「Vue matrice」列表（业务 × 五类流），可切到可缩放图；节点点击打开底部抽屉。
- **降级**：静态图 + 图例；reduced-motion 关闭流动点。

### 08 · Feuille de route — 「什么时候发生」
- **目标**：时间可信度：双边三步、RIMU 五年、算力三期，可切换、可展开。
- **布局**：象牙白。顶部标题 + 三段式切换（Plateforme bilatérale / RIMU / Calcul）；中部水平时间轴 2026–2031（6 列）；下方内容面板随轨道切换；右上角「Aujourd'hui : 2026 · lancement」标记。
- **内容**：
  - 双边轨道：2026 启动（指定部委与联系人、发布项目/商品/融资需求）→ 2026–2027 资源匹配（毛方：矿权/矿产品、港口/工业用地、展馆、医院、培训场所；中方：订单、设备、EPC、融资、课程、远程医疗）→ 并行六类活动 + 算力预研（选址、绿电预研）。
  - RIMU 轨道：2027 Y1 250k/80k/28 min；2028 Y2 700k/200k/32；2029 Y3 1,2M/360k/36；2030 Y4 1,8M/550k/38；2031 Y5 2,5M/800k/40；里程碑：邀请/预装与零流量套餐、公开上线、创作者基金、行政缴费与商户 QR、信贷试点、内容包向西非法语区扩展。
  - 算力轨道：Phase 1 18 个月 ~100 GPU/1 MW；Phase 2 ~36 个月 2–3 MW；Phase 3 模块化 + 绿电合同（20–50 MW 一期绿电目标出现在收益部分）。
- **数据**：全部源文件；时间轴上年份与数字一一对应；「2026 启动」与源文件「plan quinquennal 2026–2031 / Y1 2027」对齐说明。
- **交互**：轨道切换 → 内容面板淡入淡出 + 时间轴高亮变化；里程碑点击 → 展开卡（标题、说明、责任方、指标）；移动端左右滑动。
- **动效**：进入时时间轴线绘制、节点弹入；切换时 250 ms 交叉淡入；进度点脉冲一次。
- **移动端**：纵向时间轴（年份为分组），轨道切换 sticky。
- **降级**：静态完整时间轴（三轨都展示）。

### 09 · Chiffres 2031 — 「数字冲击」
- **目标**：一屏给出「规模 + 收入 + 国家占比」，并让数字可信（口径、方法学）。
- **布局**：深蓝。顶部标签 `Horizon 2031 · Scénario ambitieux` + 标题 `Ce que cela représente.`；中部 4 个大计数器（2,5 M · 800 k · 2,8 M · 150–220 M USD）；下部左：2027–2031 MAU/DAU 增长折线 + 使用时长标注；右：收入构成横向堆叠条（RIMU 30–50 / RIMP 90–140 / Calcul 30–40）；底部 3 个小卡：1,3–1,9 % PIB · 30–40 k emplois · 60 %+ internautes；右上 `Méthodologie` 按钮。
- **数据**：源文件；收入合计与分项校验一致（30–50 + 90–140 + 30–40 = 150–230，源文件给 150–220，展示用源文件总计，分项标注 ranges，并注明「四舍五入与区间导致合计不等」或统一取中值；见 §7.4 QA）。
- **交互**：计数器进入视口计数一次；图表 hover tooltip（年份、数值、口径）；「Méthodologie」→ modal（公式、来源、类型、更新日期、QA 说明）；点击收入分项 → 打开对应业务抽屉。
- **动效**：计数器 1.6 s；折线 draw + 面积淡入；堆叠条从 0 宽度生长；数字变化时 tabular-nums 防抖。
- **移动端**：计数器 2×2；图表上下堆叠；收入条横向可滑。
- **降级**：数字直接显示；图表静态；reduced-motion 关闭。

### 10 · Bénéfices — 「国家与西非收益」
- **目标**：从「平台做了什么」转到「国家得到什么」，分短/中长/结构三层，并落到西非地图。
- **布局**：象牙白。上部三列时间尺度（Court terme / Moyen–long terme / Transformation structurelle），每列 3–4 条收益（带数字）；下部通栏西非地图（毛里塔尼亚 + 塞内加尔/马里/几内亚/科特迪瓦/冈比亚），努瓦克肖特发光，路线动画；右上角切换 `Marchandises / Services numériques / Paiements`。
- **内容**：
  - 短期：首批 5–8 项目进入实质阶段（800 M–1,2 Md USD 意向）；批发试单 300–800 M USD；首年消费品试单 80–150 M USD；培训 1 000–3 000 人；8–15 个远程医疗点；2 000–4 000 直接/关联就业。
  - 中长期：经毛里塔尼亚流转货物 800 M–2 Md USD/年；8 000–15 000 关联就业；绿电算力 20–50 MW 后年服务收入数千万至 1 亿 USD；在 4,5 % 增速上 +0,8–1,5 个百分点；努瓦克肖特成为西非买家固定停留点，仓储/关税/过境/支付收入留在境内。
  - 结构转型：原矿/未加工渔获 → 加工、可追溯产品与长期协议；降低单一矿价依赖；五年 30 000–40 000 直接+生态就业；成人数字账户 <20 % → 约 50 %；本地语言视频与手工艺被归档/变现；数据/密钥/模型/支付账本留在境内。
  - 西非：从「过境点」到「服务中心 + 分销枢纽」；买家减少赴亚洲、在努瓦克肖特看样分拨；RIMU 阿语/法语内容自然扩散；RIMP 与 AI 推理逐步扩展至塞内加尔、马里等。
- **交互**：三列 hover 高亮；地图切换动画（路线颜色/方向变化）；城市 hover tooltip；「Voir l'étude régionale」可选打开抽屉。
- **动效**：三列 stagger；地图路线 draw + 移动点；切换时路线淡出重绘。
- **移动端**：三列变手风琴；地图缩小 + 城市列表。
- **降级**：地图静态；路线不流动。

### 11 · Demandes à l'État — 「五项支持，打开通道」
- **目标**：明确「不需要先确认金额、不需要大额预算前置」，把请求做成可执行的决策清单。
- **布局**：象牙白。左侧 8 栏五行手风琴；右侧 4 栏 sticky 卡「Résultat à 6 mois」（首批项目清单、算力预研第一版、showroom、培训与远程医疗试点、绿电专线机制）。
- **内容**：五类（源文件）：
  1. **Organisation & politiques**：牵头部委 + 双方联系人；投资/矿业/能源/海关/财政-央行/外交/卫生对应人；优先项目并行处理或时限承诺；数字转型部明确授权与跨部门协调。
  2. **Sites, foncier & listes**：五类工业首批谈判清单；努瓦克肖特或指定港口展馆；港口仓储/自贸/样品临时进口窗口；新能源、加工、冷链、算力预研用地。
  3. **Financement & budget**：showroom、首批样品、培训、远程医疗试点的有限种子资金；通过尽调的优先项目有限支持（地租优惠、有限税收减免、培训补贴/小额启动配套）；海关/港口/仓储收入分账统计。
  4. **Finance & règlementation**：财政部/央行与进出口银行、中非基金、信用保险、商业银行对话；矿产/渔获出口中长期协议与信用保险、信用证、汇款、小额订单短期贸易融资分开；优先项目有限 comfort letter/增信；6 个月内完成算力预研第一版 + 绿电专线与电价机制。
  5. **Diplomatie, douanes & données**：邀请西非商会/进口商「到毛里塔尼亚看中国货」；展品入境、样品清关、过境、进口分销规则一次说清；矿产可追溯、渔获认证、消费品质量控制、订单数据留在境内。
- **交互**：手风琴展开/收起；hover 行左侧金线生长；「Résultat à 6 mois」卡内条目可点 → 对应路线图里程碑；底部 CTA「Demander une réunion」。
- **动效**：行进入 stagger；展开 300 ms 高度动画；金色序号描边。
- **移动端**：单列手风琴；sticky 卡变为底部 CTA。
- **降级**：全部展开的静态列表。

### 12 · Risques & garanties — 「先把难听的话说清楚」
- **目标**：可信度来自直面风险；每类风险有机制、有指标、有责任人。
- **布局**：深蓝。5 张卡片（可展开）：风险标题 + 一句描述 + 缓解机制 2–3 条 + 观察指标；底部「Gouvernance」条：宗教顾问机制、未成年人默认保护、内容审核与申诉、2N+柴油+光伏+电池、本地账本与模型。
- **内容**（源文件）：
  1. **Interopérabilité des portefeuilles** → 央行强制互联时间表 + 国家补贴/工资优先走互联轨道；指标：互联钱包覆盖率。
  2. **Contenus religieux/tribaux & mineurs** → 宗教顾问机制 + 产品默认严格限制 + 快速下架；指标：举报响应时长、违规率。
  3. **Électricité, sable & réseau** → 2N + 柴油 + 光伏 + 电池 + 绿电合同；指标：可用率、PUE。
  4. **Données transfrontalières & cloud** → 本地账本与模型，训练可混合、推理回流；指标：境内数据/推理占比。
  5. **Talents & continuité** → 大学订单班、本地学徒、数据/支付互操作立法义务；指标：本地岗位填补率。
- **交互**：卡片展开/收起；hover 显示「已有保障 / 待建立」状态；底部治理条点击打开完整治理抽屉。
- **动效**：卡片进入 stagger；展开时金色边框绘制；指标条填充。
- **移动端**：单列手风琴。
- **降级**：默认全部展开。

### 13 · Next steps & contact — 「下一步」
- **目标**：把浏览转化为会议/材料/对接。
- **布局**：最终屏（深蓝→象牙白渐变或深蓝）。三列「30 / 90 天」行动；右侧 CTA 卡（预约会议、下载 PDF、获取中文/法文摘要、二维码）；底部 AUREON 联系信息与数据来源声明。
- **内容**：
  - 30 天：确认牵头部委与双方联系人；锁定首批 5–8 项目清单；确定 showroom 选址与预算。
  - 90 天：算力预研第一版（选址、绿电、电价机制）；首批样品与试单；RIMU 预装/零流量套餐谈判；培训与远程医疗试点启动。
  - CTA：`Demander une réunion`（mailto/表单）、`Télécharger le dossier PDF`、`Recevoir la note de synthèse`（微信/WhatsApp/二维码）。
  - 页脚：数据来源（源文件 + 方法学）、版本/日期、`Scénario ambitieux — document non contractuel`、AUREON 标识与联系方式（默认只发布公司邮箱/表单；个人手机、微信、Gmail 上线前需客户书面确认，见 `interaction-motion.md` A-16 / `data-model` AD-7）。
- **交互**：CTA hover 金色描边 + 箭头位移；二维码 hover 放大；PDF 按钮打开展示打印视图或直接下载；表单字段最小化（姓名/机构/邮箱/关注业务）。
- **动效**：三列进入 stagger；CTA 卡片浮起；背景金色细线缓慢流动。
- **移动端**：CTA 置顶；二维码折叠。
- **降级**：全部静态可用。
---

## 6. 业务点击体系（核心需求）

### 6.1 什么可以被点击
| 点击对象 | 入口 | 层级 | 打开内容 |
|---|---|---|---|
| 三支柱 | 02 系统图节点 / 03 支柱卡 / 07 关系图节点 | L2 | 支柱抽屉（组成、价值、3 KPI、参与方、路线、风险） |
| 六大业务 | 02 / 04 卡片 / 07 节点 / 09 收入分项 | L2 | 业务抽屉（6 tab，见 6.3） |
| RIMU 模块 | 05 芯片 / 手机内 tab | L2 | RIMU 抽屉并定位到对应 tab |
| 四层架构 | 06 层 + tooltip | L2 | 架构层抽屉（定义、组件、服务对象、数据主权） |
| 算力三期 | 06 / 08 | L2 | 阶段抽屉或路线图里程碑 |
| AI 用例组 | 06 tab | L3 | 抽屉内展开子用例 |
| 关系图节点/边 | 07 | L2 / tooltip | 节点抽屉 / 边说明 |
| 地图城市 | 10 | tooltip | 城市与西非买家说明 |
| KPI ⓘ | Hero / 09 / 各区块 | modal | 方法学（数值、年份、类型、公式、来源） |

**可点击对象的视觉语言**：金色 1 px 底线 + 右上角小箭头 `↗`；hover 时底线变实、箭头位移 2 px；不可点内容不加此语言，避免「哪里都能点」的疲劳。

### 6.2 业务详情抽屉（L2）规格
- **桌面**：右侧滑出，宽 `min(560px, 42vw)`，高 100vh，深蓝底、象牙白文字；左侧页面压暗（overlay rgba(7,28,54,.55)）+ 关联节点金色高亮，形成「聚焦但不丢失上下文」。
- **移动**：底部 sheet，高 92vh，圆角 16 px 顶部，带 grab handle；下滑关闭；内容区可滚动，tab 横向滚动。
- **结构**：① 顶部：业务编号、标题 FR/ZH、阶段徽章、关闭按钮；② 一句话价值主张；③ 3 个迷你 KPI；④ 6 个 tab；⑤ 底部固定动作：「Voir les connexions」/「Feuille de route」/「Partager」。
- **6 个 tab 内容模板**：
  1. **Aperçu** — 定义（是什么）、为什么做（对应哪个问题）、阶段与目标、3–5 条核心价值。
  2. **Fonctionnement** — 参与方（谁做什么）、业务流程图（SVG 4–6 步）、子模块手风琴、关键机制（如 RIMP 互操作、海关规则）。
  3. **Chiffres clés** — 3–6 个指标卡（数值、年份、类型徽章、ⓘ）、趋势 mini chart（如有）。
  4. **Acteurs & flux** — 参与方列表 + 五类流 in/out（用 6.1 同一套颜色）；「Voir sur la carte des flux」按钮。
  5. **Feuille de route** — 该业务在 2026–2031 的时间线（复用 08 组件，过滤本业务）。
  6. **Risques** — 1–3 条风险 + 缓解 + 指标；链接到 12 风险区块。
- **状态与动画**：打开 320 ms `cubic-bezier(0.22,1,0.36,1)`（位移 40 px + 淡入 + 轻微 scale 0.99→1）；关闭 220 ms；tab 切换 180 ms 淡入 + 8 px 上移；Esc、点击 overlay、关闭按钮、浏览器返回都能关闭；打开时 focus trap，关闭后焦点回到触发元素；打开期间主页面滚动锁定。
- **URL 深链**：`#/business/{id}` / `#/rimu/{moduleId}` / `#/s/{blockId}`（示例 `#/business/finance-rimp/chiffres`）；打开抽屉时 pushState，关闭时回退；刷新后直接打开同一业务；分享链接自动带语言前缀。
- **性能**：抽屉内容按需渲染（JSON → 组件），首屏不加载全部详情；图片/图表懒加载。

### 6.3 示例：RIMU 抽屉内容（节选）
- **Aperçu**：`RIMU n'est pas une localisation de TikTok : c'est le point d'entrée du système d'exploitation du quotidien des Mauritaniens — contenus, biens, emplois et services publics.`
- **Fonctionnement**：4 onglets（For You / Abonnements / À proximité / Marché）；短视频 15–60 s + 中视频 3 min + 图文；默认 360p/480p 与夜间预缓存；Live（婚礼/市场/渔获/认证宗教讲座/直播带货）；Studio créateurs（本地音乐版权库、模板、语音转写与自动字幕）；Shop + RIMP；Jobs/短训；认证机构号；创作者经济（广告/打赏/电商，乌吉亚结算）。
- **Chiffres**：2,5 M MAU（2031）· 40 min/j · 15–60 s · 360p/480p · 60 %+ 网民（2031）· 创作者经济派生数据（标注 Hypothèse）。
- **Acteurs & flux**：创作者、用户、商户、机构号、RIMP、算力中心；Attention → Marché/Paiement；Données → 算力中心；Paiement → 创作者/商户。
- **Risques**：宗教/部落内容争议；未成年人保护；版权音乐；网络与带宽。

### 6.4 示例：Biens de consommation 抽屉内容（节选）
- **Aperçu**：从「毛里塔尼亚只是过境点」到「西非分销与服务中心」；线上专区 + 线下 showroom + live commerce。
- **Fonctionnement**：中国产业集群选品（五金、日用品、纺织、小家电、建材、摩托与配件；按西非气候/电压/包装/价格带）；线上：描述/价格/MOQ/交期/询价与订单/物流跟踪；线下：努瓦克肖特或指定港口常设 showroom + 展览周，邀请塞内加尔、马里、几内亚、科特迪瓦、冈比亚买家；清关与结算规则写入平台，避免被大宗矿产流程卡住。
- **Chiffres**：首年试单 80–150 M USD；中长期经毛流转 800 M–2 Md USD/年；5 个西非市场。
- **Flux**：Marchandises（中国→毛→西非）、Paiements（RIMP）、Données（订单留在境内）。

### 6.5 返回与上下文规则
- 抽屉不改变主页面滚动位置；关闭后回到原触发点。
- 若从 04 卡片进入，关闭后 04 保持 hover 高亮 1.5 s，帮助定位。
- 从关系图进入时，关闭后保留选中节点的连线高亮，直到用户点击空白。
- 跨区块跳转（如「Voir la feuille de route」）先关抽屉再平滑滚动，并在目标区块显示一个 2 s 的「来自 RIMU」面包屑提示。

---

## 7. 数据体系

### 7.1 三级数据可信度标签
| 类型 | 标签（FR） | 含义 | 展示 |
|---|---|---|---|
| Source | `Source : document de référence` | 直接来自源文件 | 正常显示 + ⓘ 指向源文件章节 |
| Dérivé | `Dérivé · méthode` | 由源数据按明确公式计算 | 显示公式（如 « 800 k DAU × 40 vues/jour »） |
| Hypothèse | `Hypothèse de scénario` | 规划假设（如创作者数、GMV） | 明确标注「hypothèse」，不进入主 KPI 大字 |

### 7.2 核心 KPI 表（网页直接读取）
> 完整 **58 条 KPI、10 条派生公式与 7 条口径 QA** 见 `web/spec/data-model.md` 与 `web/spec/data-model.json`；下表只列首屏/决策相关项。页面数字一律读 JSON 的 `displayFR/displayZH`，不手写。

| id | 指标 | 2031 值 | 类型 | 展示格式（FR / ZH） | 用途 |
|---|---|---|---|---|---|
| mau | MAU RIMU | 2,5 M | Source | `2,5 M` / `250 万` | Hero、09、08 |
| dau | DAU RIMU | 800 000 | Source | `800 000` / `80 万` | Hero、09、08 |
| usage | 日均使用时长 | 40 min | Source | `40 min/jour` / `日均 40 分钟` | 09、08 |
| wallets | RIMP 钱包 | 2,8 M | Source | `2,8 M` / `280 万` | Hero、09、04 |
| revenue | 三块合计年收入 | 150–220 M USD | Source | `150–220 M USD` / `1.5–2.2 亿美元` | Hero、09 |
| rev_rimu | RIMU 收入 | 30–50 M USD | Source | 同上 | 09、04 |
| rev_rimp | RIMP 收入 | 90–140 M USD | Source | 同上 | 09、04 |
| rev_compute | 算力收入 | 30–40 M USD | Source | 同上 | 09、06 |
| gdp | 占 GDP | 1,3–1,9 % | Source | `1,3–1,9 % du PIB` / `占 GDP 1.3–1.9%` | 09 |
| jobs_cum | 五年直接+生态就业 | 30 000–40 000 | Source | `30 000–40 000` / `3–4 万` | 09、10 |
| jobs_short | 短期直接/关联就业 | 2 000–4 000 | Source | — | 10 |
| jobs_mid | 中长期关联就业 | 8 000–15 000 | Source | — | 10 |
| internet_share | 占网民比例 | 60 %+ | Source（2031） | `60 %+` / `60%+` | 09 |
| projects | 首批项目 | 5–8 | Source | `5–8 projets` | 04、10 |
| invest | 首批投资意向 | 800 M–1,2 Md USD | Source | — | 04、10 |
| wholesale | 批发试单 | 300–800 M USD | Source | — | 04、10 |
| consumer_y1 | 消费品首年试单 | 80–150 M USD | Source | — | 04、10 |
| goods_flow | 西非货物年流转 | 800 M–2 Md USD | Source | — | 10 |
| compute_mw | 绿电算力（一期目标） | 20–50 MW | Source | — | 06、10 |
| gpu_p1 | 算力一期加速卡 | ~100 | Source | — | 06 |
| growth | 额外增长 | +0,8–1,5 pt | Source | — | 09、10 |
| views_day | 日播放量 | ≈ 3 200 万 | Dérivé | 公式标注 | 09 或 05 |
| internet_users | 网民数 | ≈ 420 万 | Dérivé | 2,5 M ÷ 60 % | 09 方法学 |
| pay_volume | RIMP 年支付流量 | ≈ 150–250 亿美元 | Dérivé | 90–140 M ÷ 0,5–0,7 % | 09 方法学（修正口径） |
| creators | 活跃创作者 | ≈ 5 万 | Hypothèse | 2,5 M × 2 % | 05/09 方法学 |
| gmv | RIMU Shop GMV | ≈ 2–3 亿美元 | Hypothèse | 2,5 M × 80–120 USD | 09 方法学 |

### 7.3 派生公式（写进方法学弹层）
- 日播放量 = 800 000 DAU × 40 次观看/日（40 min ÷ 平均 60 s）= 3 200 万次/日；年 ≈ 117 亿次。
- 网民数 = 2,5 M ÷ 60 % ≈ 420 万（2031）。
- 支付流量 = 90–140 M USD ÷ 综合费率 0,5–0,7 % ≈ 130–280 亿美元；对外统一取 ≈ 150–250 亿美元/年。
- 创作者 = 2,5 M × 2 % ≈ 5 万；变现 20 % ≈ 1 万（Hypothèse）。
- 电商 GMV = 2,5 M × 80–120 USD ≈ 2–3 亿美元（Hypothèse）。

### 7.4 口径修正清单（v1 必须处理，详见 `data-model.md`）
1. **支付流量**：源文件「年支付流量数百亿美元」与 RIMP 收入 90–140 M USD 不自洽（隐含费率 <0,05 %）。→ 统一为 **≈150–250 亿美元/年**（综合费率 0,5–0,7 %）；若坚持「数百亿美元」，则需上调 RIMP 收入假设。
2. **钱包覆盖**：源文件「2,8 M ≈ 成年人口一半」与人口规模不符。→ 统一按 **累计账户数（含多账户/非活跃账户）** 展示，不锚定成年人口；「成人数字账户 <20 % → ≈50 %」作为独立指标（见 `data-model.md` QA-2）。若需人口占比，只在方法学标注「≈53 % de la population totale（世行 2025 人口 ≈5,315 M，外部假设待核）」。
3. **就业三层**：2–4 k（短期直接/关联）、8–15 k（中长期关联）、30–40 k（五年累计直接+生态）必须加口径标签，不能并列展示；主数字用 30–40 k，其余在抽屉/收益区块分层说明。
4. **60 %+ 网民**：与 MAU 2,5 M 绑定同一年（2031）与同一网民口径（≈420 万）；若网民基数变化，按公式重算并更新方法学。
5. **收入分项合计**：30–50 + 90–140 + 30–40 = 150–230，源文件总计 150–220；展示用源文件总计，分项标 ranges，方法学注明「区间与四舍五入导致合计不闭合」。
6. **外部校验参考**：世界银行 2025 人口 ≈5,315 M、2024 网民 ≈2,37 M（见 `tech-architecture.md` 附录 A）。若采用：2,8 M 账户 ≈ 全国 53 %（非「成年人口一半」）；2,5 M MAU ≈ 2031 网民 60 % 的推导需以 2031 网民基数复核。外部数据只在方法学出现，不进主叙事。

### 7.5 展示与动画规则
- **格式化**：FR 用不换行空格千分位、逗号小数（`2,5 M`、`800 000`、`1,3–1,9 %`）；ZH 用万/亿（`250 万`、`80 万`、`1.5–2.2 亿`）；单位与年份永不小字到不可读（最小 11 px）。
- **区间值不做假计数**：单值计数（2,5 M / 800 000），区间值用遮罩滑入 + 数字稳定显示（避免低值→高值的误导动画）。
- **每个大数字都有 ⓘ**：点开显示「值 / 年份 / 类型 / 公式（如有）/ 来源段落 / 最后更新」。
- **一次性动画**：进入视口播放一次；用户回滚不重复计数（可用小按钮重播）。
- **打印模式**：所有 tooltip 内容展开为脚注；图表转静态 SVG；每页页脚显示「Source / Méthode」。

---

## 8. 动效系统

### 8.1 原则
1. **动效是解释，不是装饰**：每个动画必须对应一个理解动作（出现、连接、增长、切换、展开）。
2. **快**：UI 反馈 ≤ 250 ms；叙事动画 ≤ 1.2 s；用户不等。
3. **可打断**：滚动/点击可随时中断动画；不做 scroll-jacking。
4. **可降级**：reduced-motion、低带宽、低端机三种降级路径；离线也能读。
5. **一致性**：同一语义用同一动效（如「打开详情」永远是右侧滑出）。

### 8.2 Token
| Token | 值 |
|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--dur-micro` | 120 ms（hover、颜色） |
| `--dur-ui` | 240 ms（tab、手风琴） |
| `--dur-panel` | 320 ms（抽屉） |
| `--dur-narrative` | 600–1200 ms（入场、绘图） |
| `--dur-counter` | 1200–1400 ms（T1 countUp 1200 / T2 1400，以 T3 实现为准） |
| `--stagger` | 60–120 ms |
| `--rise` | 16 / 32 / 64 px |

### 8.3 动效目录（实现对照）
| # | 名称 | 触发 | 行为 | 实现 | 降级 |
|---|---|---|---|---|---|
| M1 | Hero 标题揭示 | 页面载入 | 两行 clip-path 自下而上，金线展开 | CSS + GSAP timeline | 静态 |
| M2 | 区块入场 | 进入视口 20 % | 元素上移 32 px + 淡入，60–120 ms 错峰 | IntersectionObserver + CSS | 静态 |
| M3 | 系统图装配 | 进入视口 | 支柱→业务→四层分三拍出现，连线绘制 | GSAP + SVG stroke-dashoffset | 静态全显 |
| M4 | 卡片 hover | hover/focus | 上浮 4 px、金线生长、关联节点高亮 | CSS transform + SVG class | 点击态 |
| M5 | 抽屉开合 | 点击 | 右侧滑入 320 ms / 关闭 220 ms，overlay 淡入 | CSS transform + JS focus trap | 即时显示 |
| M6 | Tab 切换 | 点击 | 内容淡入 + 8 px 上移 180 ms | CSS | 即时 |
| M7 | KPI 计数 | 进入视口 | 0 → 目标值 1,2–1,4 s，tabular-nums；区间值滑入 | GSAP counter | 直接显示 |
| M8 | 图表绘制 | 进入视口 | 折线 draw、面积淡入、堆叠条生长 | SVG/Canvas + GSAP | 静态图 |
| M9 | 手机演示 | 自动/点击 | 8 s 循环 4 屏；hover 暂停 | JS 状态机 + CSS 过渡 | 静态首屏 |
| M10 | 关系流动 | 选中/常驻 | 激活边小点单向流动 | SVG animateMotion / Canvas | 静态线 |
| M11 | 时间轴绘制 | 进入视口 | 金线绘制、节点弹入 | GSAP | 静态 |
| M12 | 地图路线 | 进入视口/切换 | 路线 draw + 移动点 | SVG path + animateMotion | 静态路线 |
| M13 | 手风琴 | 点击 | 高度 300 ms + 内容淡入 | CSS grid-template-rows | 即时 |
| M14 | Mode Pitch | 点击/URL | 8 场景自动滚动 + 聚焦 + 字幕 + 进度 | GSAP ScrollTo + 状态机 | 直接跳章节 |

### 8.4 性能与降级
- 只动画 `transform`/`opacity`；SVG 绘制用 `stroke-dashoffset`；避免 layout thrash。
- 同一时间最多 2 条 GSAP timeline；离开视口暂停；页面隐藏暂停。
- `prefers-reduced-motion: reduce`：关闭 M1–M3、M7–M12 的位移/计数/流动，保留 120 ms 淡入；Mode Pitch 改为静态分页。
- 低带宽模式（`navigator.connection.saveData` 或用户手动）：关闭粒子、力导向布局改静态坐标、图表懒加载、手机演示不自动播放。
- 低端机（`hardwareConcurrency ≤ 4` 或内存低）：粒子 ≤ 40、关闭 2.5D 透视、简化阴影。
- 性能预算：主线程长任务 < 50 ms；动画帧率目标 60 fps（低端机 ≥ 30 fps）；总 JS gzip ≤ 180 KB（不含按需图表）。

---

## 9. 技术实现方案（摘要，详见 `tech-architecture.md`）

### 9.1 推荐栈
- **框架**：Astro 静态站（或等价纯静态 HTML 模板），输出 `/fr/` 与 `/zh/` 两套静态路由；交互用原生 ES Modules + GSAP/ScrollTrigger（按需引入）；无需 React 运行时。
- **图表**：3 张核心图（MAU 曲线、收入构成、五年路径）用手写 SVG + CSS 动画（体积小、可控）；复杂 tooltip 用轻量 JS；不引入完整 ECharts（省 ~300 KB）。
- **平滑滚动**：Lenis（可选，reduced-motion 时禁用）。
- **内容**：`web/data/content.fr.json` / `content.zh.json` / `kpis.json` / `relations.json`；组件从 JSON 渲染，编辑改 JSON 不改代码。
- **样式**：CSS 变量 + 原生 CSS（或 Tailwind 可选）；设计 token 与 `visual-system.md` 一一对应。
- **字体**：本地 woff2 子集（FR：Playfair Display 400/500、Nunito Sans 400/600/700；ZH：Noto Serif SC / Noto Sans SC 子集，按 unicode-range 切片），避免 Google Fonts 在部分地区不可达。
- **部署**：Cloudflare Pages / Vercel 静态托管 + 自定义域名；构建产物可整体打包进 U 盘/本地服务器演示（无后端依赖）。
- **实测预算（来自 tech-architecture.md）**：GSAP core+ScrollTrigger ≈45 KB gzip（懒加载）、Lenis ≈5 KB（仅桌面）、ECharts simple 165 KB（弃用，改手写 SVG）；首屏 ≤220 KB、整页 FR ≤500 KB、JS ≤115 KB；3G 下 LCP ≈2,2–2,5 s；字体自托管子集（FR ≤120 KB，ZH 标题子集 ≤90 KB + 系统正文）。
- **打印**：同一 Web 内容提供 `/fr/dossier`、`/zh/dossier` 打印视图（A4 横向，主册 18 页 + 6 张业务 fiche + 1 页决策摘要，`@page`，分页控制），用现有 Chrome + Playwright 生成 PDF；页脚二维码回网页。

### 9.2 i18n 与内容结构
- 路由：`/fr` 默认（`/` 重定向）、`/zh`；语言切换保留当前锚点/业务深链。
- 文案全部走 JSON 词典（`ui.*`、`sections.*`、`business.*`）；数字展示格式按 locale 函数处理；阿拉伯语 RTL 预留 `dir="rtl"` 与字体策略（第二期）。
- 数据与文案分离：KPI 只在 `kpis.json` 定义一次，所有区块引用 id；避免「同一个数字在不同页面不一致」。

### 9.3 性能预算
- 首屏（3G Fast）：TTFB < 0.8 s，FCP < 1.8 s，LCP < 2.5 s，可交互 < 3 s；总传输 < 1,5 MB gzip（不含按需 PDF/视频）。
- 图片：全部 SVG/WebP，`loading="lazy"`，无大图；Hero 视觉用 SVG/Canvas 生成。
- 字体：子集 ≤ 180 KB（FR）+ 中文按需 unicode-range 切片，仅加载当前语言。
- JS：核心 ≤ 120 KB gzip（GSAP 按需 + 业务逻辑）；图表 ≤ 30 KB；Mode Pitch ≤ 15 KB。
- 缓存：静态资源 `immutable`，HTML `no-cache`；CDN。

### 9.4 可访问性与分享
- 语义化标题层级；所有交互可 Tab 到达；抽屉 focus trap、Esc 关闭；对比度 AA（金色小字在浅底改用深金 `#9C7A38`）。
- 键盘快捷键：`←/→` 上一/下一章节、`Esc` 关闭、`G` 启动 Mode Pitch、`L` 切换语言（需在帮助浮层提示）。
- SEO/OG：每语言独立 title/description；为 14 个章节生成 OG 图（深蓝 + 金标题 + 关键数字），会议分享链接有卡片预览。
- 分析：Cloudflare Web Analytics 或自托管 Plausible；事件：section_view、business_open、tab_view、tour_complete、pdf_download、meeting_click；不做跨站追踪。

### 9.5 维护
- 内容更新流程：JSON 修改 → 构建 → 预览 → 发布（1 天内可完成）。
- 数据季度复核：所有 Source 类数字引用源文件版本；Hypothèse 类必须复核。页面显示 `Dernière mise à jour : …`。
- 版本：v1.0 上线；后续若真实数据产生，新增「Réalisé」数据层（见优化方案 §12）。

---

## 10. 交付物、里程碑与验收

### 10.1 交付物清单
1. 14 区块单页网站（FR + ZH 双语；桌面/平板/移动响应式）。
2. 6-tab 业务详情抽屉系统 + URL 深链（3 支柱 / 6 业务 / 4 架构层 / RIMU 模块）。
3. 关系网络图（含矩阵降级视图）与五类流筛选。
4. 2031 数据仪表盘 + 方法学弹层（全部 KPI 可溯源）。
5. RIMU 手机交互演示（自动/手动）。
6. Mode Pitch 3 分钟引导（8 场景、进度、暂停、退出）。
7. 2026–2031 三轨时间轴。
8. 西非地图流向与收益区块。
9. A4 横向打印视图 + PDF（FR/ZH，主册 18 页 + 6 张业务 fiche + 1 页决策摘要）；OG 分享图。
10. 源码仓库、设计 token、内容/数据 JSON、部署与维护说明。
11. 可用性测试报告（5 人）+ 性能/无障碍/打印 QA 报告。

### 10.2 里程碑（4 周，可压缩为 2 周 MVP）
| 阶段 | 时间 | 产出 | 验收 |
|---|---|---|---|
| 0 内容冻结 | D1–D2 | 源文件→内容模型/数据字典确认；14 区块文案 FR 初稿 | 所有数字有来源/公式；口径 QA 决策 |
| 1 设计系统 + 骨架 | W1 | 视觉 token、组件、Hero、导航、页面骨架、Hero/系统图 | 品牌评审通过；桌面/移动布局确认 |
| 2 主体区块 | W2 | 01–13 区块静态 + 抽屉 + 数据绑定 + 图表 | 内容完整、点击可用、FR/ZH 切换 |
| 3 动效与体验 | W3 | 关系图、手机演示、Mode Pitch、时间轴、地图、移动端 | 关键动效 60 fps；降级路径可用 |
| 4 打磨与上线 | W4 | 法语审校、性能/无障碍/打印 QA、PDF、部署、埋点 | 验收标准全部通过；上线 |

**MVP（2 周；按 v2 优化建议为 2.5 周）**：14 区块 + 抽屉 + 关键数字 + 基础动效 + 打印 CSS；关系图用矩阵视图；手机演示用静态 4 屏；Mode Pitch 用简化 8 步。——先让客户看到完整叙事，再迭代关系图和高端动效。

### 10.3 验收标准
- **内容**：14 区块全覆盖；六大业务每条 6 tab 均有内容；0 处口径矛盾；法语母语审校通过。
- **交互**：任意业务 ≤ 2 次点击到达详情；抽屉可 Esc/返回关闭；深链刷新可复现；键盘可完成核心路径。
- **数据**：每个大数字有 ⓘ；Source/Dérivé/Hypothèse 标签齐全；打印版脚注完整。
- **性能**：3G 首屏可交互 < 3 s；Lighthouse Performance ≥ 85（移动）、Accessibility ≥ 95；移动端无横向滚动。
- **视觉**：品牌评审（AUREON 内部 + 客户）；打印样张确认。
- **可用性**：5 人测试中 ≥ 4 人能复述三支柱与 3 个关键数字。

### 10.4 不做什么（范围控制）
- 不做真实用户注册/支付/内容上传（只做演示与说明）。
- 不做后台 CMS（MVP 用 JSON；若需要再上轻量 CMS）。
- 不做实时数据接入（2031 为情景数据，未来可加「Réalisé」层）。
- 不做阿语 RTL 与音频旁白（列第二期）。
- 不做 3D 地球/WebGL 主视觉（只在 Hero 允许轻量 Canvas 粒子）。

---

## 11. 待确认的 7 个决策（请甲方/Lead 拍板）

1. **语言**：FR 默认 + ZH 切换是否足够？阿语是否必须首发（RTL 成本 +25 %）？
2. **品牌署名**：页面主品牌用「Plateforme de coopération」+ RIMU，还是以 RIMU 为主？AUREON 作为建设方放在页脚还是 Header 联合署名？是否有平台/部委 logo 可用？
3. **数据口径**：是否接受 §7.4 的五项修正（尤其支付流量改为 ≈150–250 亿美元/年、钱包改为「累计账户数」口径、人口假设统一为世行 ≈5,315 M）？所有未来值是否统一标「scénario ambitieux」？
4. **受众优先级**：Mode Pitch 是否设为首次访问自动弹出（可能打扰自由浏览）？建议：Header 明显按钮 + Hero 主 CTA，不自动。
5. **交付形态**：是否需要阿语版、离线 U 盘版、独立域名（建议 `platform.aureondigital.mr` 或新域）、PDF 双语册？
6. **素材**：努瓦克肖特/港口/数据中心/合作方照片与 logo 是否有授权素材？没有则用线稿地图 + 抽象图形（本方案默认）。
7. **上线节奏**：先 2 周 MVP 看叙事效果，还是直接 4 周完整体验版？

---

## 附录 A · 法语文案样例（Hero 与章节标题）
| 位置 | 法语（工作稿） |
|---|---|
| Hero eyebrow | `Plateforme de coopération numérique sino-mauritanienne` |
| Hero H1 | `Une plateforme.\nTrois souverainetés.` |
| Hero 副标语 | `Relier deux pays. Équiper une nation.` |
| Hero sub | `Un point d'entrée officiel, une super-application nationale, un socle de calcul souverain — pour retenir l'attention, digitaliser l'économie et garder les données au pays.` |
| 02 标题 | `Un système, pas une collection de projets.` |
| 05 标题 | `RIMU, le système d'exploitation du quotidien.` |
| 07 标题 | `Ce n'est pas six projets. C'est une machine.` |
| 09 标题 | `Ce que cela représente — horizon 2031.` |
| 11 标题 | `Cinq décisions ouvrent le canal.` |
| 页脚声明 | `Scénario ambitieux · document non contractuel · données et méthodes disponibles sur demande.` |

## 附录 B · 附件规格清单
| 文件 | 内容 | 负责人 |
|---|---|---|
| `web/spec/content-model.md` | 14 区块逐块内容、六业务字段、FR 文案、来源 | content-analyst |
| `web/spec/data-model.md` / `.json` | KPI 数据字典、派生公式、QA 修正、可读 JSON | content-analyst |
| `web/spec/interaction-motion.md` | 逐区块交互/动效规格、状态、降级 | experience-designer |
| `web/spec/visual-system.md` | 设计 token、字体、组件、暗亮节奏、打印版式 | experience-designer |
| `web/spec/tech-architecture.md` | 选型、schema、性能、i18n、打印、部署、排期 | web-engineer |
| `web/spec/BRIEF.md` | 团队总纲与数据基线 | Lead |

> 本方案 v1.0 的自我评审与优化建议见 `web/PLAN_v2_optimisation.md`。
