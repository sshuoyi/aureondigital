# BUILD CONTRACT — Site dynamique « Plateforme de coopération » (RIMU · RIMP · IA)

> 版本：v1.0 · 2026-11-09 · 决策已拍板，进入 5 周完整体验版构建。  
> 目标：在 `web/site/` 产出一个可直接打开/部署的法语优先、中文切换的单页动态网站；含 9 章叙事、业务抽屉、数据可视化、Mode Pitch、演讲者模式、A4 打印/PDF、低带宽降级。

## 0. 已拍板决策（不可再问）
1. 语言：**FR 默认 + ZH 切换**；不做阿语首发，保留 `dir="rtl"` 能力。
2. 品牌：页面主品牌 = **Plateforme de coopération**，副品牌 **RIMU · RIMP · IA**；AUREON 作为建设方签名（Header 小字 + Footer）。
3. 数据：接受 7 条 QA 修正；页面数字一律来自 `data.js`（由 `web/spec/data-model.json` 生成），带 Source/Dérivé/Hypothèse 徽章 + 方法学。
4. 首次访问默认 **Synthèse**；Mode Pitch 不自动弹出（Hero 主 CTA / Header 按钮 / `?tour=1` 显式触发）。
5. 会议包：**演讲者模式 + 6 张业务单页 + 一页决策摘要**。
6. 交付：**5 周完整体验版**（9 章全功能）。

## 1. 文件 ownership（只写自己的文件）
| 负责人 | 文件 | 说明 |
|---|---|---|
| lead | `web/site/index.html`, `assets/css/layout.css`, `assets/js/app.js`, `assets/js/data.js`, `assets/img/*`, `README.md` | 页面结构、渲染、路由、抽屉、Pitch、Presenter、i18n、集成 |
| content-builder | `web/site/assets/js/content.js`（+ 可选 `CONTENT_NOTES.md`） | 全部双语文案（FR/ZH），严格按 §3 schema |
| viz-builder | `web/site/assets/js/viz.js` + `assets/css/viz.css` | Hero canvas、计数器、3 张图、关系图/流故事、西非地图 |
| visual-builder | `web/site/assets/css/theme.css` | 设计 token、字体、组件、动效、响应式（不含 section 级栅格，见 §5） |
| print/QA-builder（后启动） | `dossier.html`, `assets/css/print.css`, `assets/js/dossier.js` | A4 横向打印册 + 6 业务单页 + 决策摘要 + PDF |
不自作主张改他人文件；需要接口变更时在文件顶部注释说明并通知 Lead。

## 2. 页面结构（9 章）
| # | section id | tone | 内容 |
|---|---|---|---|
| 0 | `#ch-hero` | dark | 背景 canvas、kicker/H1/lead、三支柱 chips、4 KPI、双 CTA |
| 1 | `#ch-pourquoi` | light | 4 问题卡 + Aujourd'hui/2031 对比 + 转折句 |
| 2 | `#ch-systeme` | dark | 3 支柱 + 6 业务卡 + 4 层架构（可点击 → 抽屉） |
| 3 | `#ch-rimu` | dark | 手机 mockup（自动/手动 7 场景）、8 模块、3 信任点 |
| 4 | `#ch-ia` | light | 四层 2.5D、3 组 AI 用例 tabs、算力三期、主权 callout |
| 5 | `#ch-flux` | dark | 3 段流故事 + 关系图（5 类流筛选/isolate）+ 矩阵降级 |
| 6 | `#ch-trajectoire` | light | 3 轨切换 + 2026–2031 时间轴 + 里程碑详情 |
| 7 | `#ch-impact` | dark | 4 大计数器 + MAU 曲线 + 收入构成 + 3 赢 tabs + 西非地图 |
| 8 | `#ch-decision` | light | 5 项国家支持手风琴 + 5 风险 + 3 类 CTA + 30/90 天 + 联系 |

全局：`header#site-header`、`nav#chapter-rail`、`#scroll-progress`、`#drawer-root`、`#pitch-root`、`#methodo-root`、`#presenter-bar`、`footer#site-footer`。

### 关键 DOM hooks（Lead 提供，teammates 依赖）
- Hero：`#hero-canvas`（canvas）、`.hero-kpis [data-kpi-id]`、`#hero-pillar-chips [data-entity]`
- 系统图：`#pillar-grid`、`#business-grid`、`#layer-stack`；卡片 `[data-entity="p.plateforme"]` 等
- RIMU：`#phone`、`#phone-screen`、`#phone-tabs [data-screen]`、`#module-chips [data-module]`、`#day-timeline [data-day]`
- IA：`#ai-tabs [data-group]`、`#ai-panel`、`#compute-phases`
- 流：`#flow-canvas`（viz 注入 SVG）、`#flow-legend [data-flow]`、`#story-chips [data-story]`、`#story-caption`、`#flow-matrix`、`#flow-controls`
- 路线：`#track-tabs [data-track]`、`#timeline`、`#timeline-detail`
- 影响：`#impact-kpis [data-count]`、`#chart-mau`、`#chart-revenue`、`#win-tabs [data-win]`、`#win-panel`、`#map-canvas`
- 决策：`#supports`、`#risks`、`#cta-cards`、`#next-steps`
- 抽屉：`#drawer-root`、`#drawer`、`#drawer-body`、`#drawer-close`
- Pitch：`#pitch-root`、`#pitch-progress`、`#pitch-caption`、`#pitch-controls`
- 方法学：`#methodo-root`、`#methodo-body`
- 所有可点业务/支柱/层：`data-entity="<id>"`，点击由 app.js 打开抽屉。

## 3. content.js schema（content-builder 严格实现）
文件格式：
```js
window.RIMU_CONTENT = {
  fr: { /* keys below */ },
  zh: { /* same keys, translated */ }
};
```
必须包含以下 keys（数组长度固定标注）：
- `ui`：见 §3.1
- `brand`: { name, sub, signature, tagline }
- `hero`: { kicker, title1, title2, lead, subline, ctaPitch, ctaExplore, ctaPdf, scroll, kpis:[4]{id,label}, pillars:[3]{id,label,note}, network:{china,mauritania,hub,westAfrica} }
- `chapters`: 9 个对象：`pourquoi, systeme, rimu, ia, flux, trajectoire, impact, decision` + `hero` 不在此；每个含 `kicker,title,lead`，另可加 `body`/`hint`/`labels`。
- `problems`: 4 × { id, title, body, change, link }（link 为章节 id，如 `#ch-rimu`）
- `rimu`: { modulesLabel, modules:[8]{id,title,body}, dayLabel, dayHint, day:[7]{time,title,body,screen}, trust:[3]{title,body} }；screen 取值：`feed|proximite|marche|live|shop|jobs|sante`（手机 UI 由 app 画）
- `ia`: { groupsLabel, groups:[3]{id,title,items:[3-4 strings]}, phasesLabel, phases:[3]{id,title,body,value}, sovereignty:{title,body} }
- `flux`: { legendLabel, storyLabel, hint, matrixHint, stories:[3]{id:"capital"|"marchandises"|"attention",title,subtitle,captions:[5-7 strings],outcome:{value,label}}, matrixRowLabels:[5] }
- `trajectoire`: { note, today, trackHint, milestoneLabel, deliverablesLabel }
- `impact`: { scenarioLabel, chartMauTitle, chartRevenueTitle, revenueLegend:[3], winLabel, mapLabel, mapLead, transformationLabel, tabs:[3]{id:"mauritanie"|"chine"|"afrique",label,items:[4-6 strings]} }
- `decision`: { supportsLabel, supportsLead, risksLabel, risksLead, ctaLabel, ctas:[3]{id:"gouvernement"|"investisseurs"|"afrique",kicker,title,body,button}, nextLabel, next:[3]{period,items:[2-3]}, contact:{title,body,button}, disclaimer }
- `drawerExtra`: 仅 6 业务 + 3 支柱的补充长文（其他 tab 由 data.js 自动生成）：
  `{ "<entityId>": { apercu:[2-3 paragraphs], fonctionnement:{intro, steps:[{title,body}]} } }`  
  至少覆盖 `b.projets, b.commerce-gros, b.biens-conso, b.finance-rimp, b.formation, b.sante, p.plateforme, p.rimu, p.calcul`。
- `methodo`: { title, intro, note, qa:[7]{code,title,decision}, close }
- `pitch`: { title, subtitle, scenes:[7]{id,chapterId,title,caption}, controls:{start,pause,resume,next,prev,exit,skip} }
- `presenter`: { hint, timer, exit, black }
- `footer`: { sources, version, legal, contactTitle, navTitle }
- 所有文本必须 FR/ZH 双份；FR 为准，ZH 为对应翻译；数字用 data.js 的 display 字段，不手写（除正文叙述引用时需一致）。
- 不允许 lorem/TODO/占位符；长文控制在网页可读长度（抽屉每 tab ≤220 字 FR）。

### 3.1 `ui` 必填 keys
`langLabel, langAria, modeSynthese, modeComplet, modeAria, pitch, present, pdf, close, next, prev, pause, resume, exit, skip, chapter, of, methodology, scenario, updated, source, derived, hypothesis, openFiche, seeConnections, seeRoadmap, tabs:{apercu,fonctionnement,chiffres,acteurs,roadmap,risques}, flows:{capital,marchandises,paiements,donnees,attention}, in, out, stage:{mature,pilote,preEtude}, graph, matrix, all, reset, isolate, replay, pauseStory, playStory, tourStart, tourDone, tourRestart, presenterHint, timer, menu, top, share, copied, view, pages, sourceDoc, backToTop, closeModal, print, footerNav`

## 4. data.js schema（Lead 已生成，只读）
`window.RIMU_DATA` = 由 `web/spec/data-model.json` 直接生成（含 `meta, kpis[58], pillars[3], businessLines[6], layers[4], relations[35], regions[6], rimuModules[8], aiUseCases[3], roadmap{tracks[3]}, risks[5], stateSupports[5], transformations[5], qa[7], sources`）。
- KPI 实体：`{id, displayFR, displayZH, type, value, range, unitFR, unitZH, ...}`
- 业务实体：`{id, nameFR/ZH, taglineFR/ZH, definitionFR/ZH, subModules, actorsFR/ZH, flowIn, flowOut, risks, kpiIds, stage, stageLabelFR/ZH, pillarIds}`
- 关系：`{id, from, to, flow, labelFR/ZH, detailFR/ZH, kpiIds}`
- 路线：3 tracks，bilateral 用 `period`，rimu 用 `year`+`mau/dau/minutes`，calcul 用 `phase/durationMonths/cards/powerMW`。

## 5. 样式分工
- `theme.css`（visual-builder）：设计 token、字体栈、基础排版、按钮/徽章/tab/卡片/抽屉/手风琴/时间轴/手机/pitch/modal/header/rail/footer 组件、动效 keyframes、reduced-motion、响应式组件行为。**不写 section 级 grid/columns**（交给 layout.css）。
- `layout.css`（Lead）：9 章各自的 grid/columns/spacing、Hero 布局、各 section 内容排布、移动端重排。
- `viz.css`（viz-builder）：图表/关系图/地图/hero canvas 专用样式（SVG 内样式可内联）。
- 视觉依据：`web/spec/visual-system.md`（色 token、字号、间距、暗亮节奏、组件）。品牌色：navy #071C36 / #0B1F3A，ivory #F6F0E4，gold #C9A25E / #9C7A38，green #00A86B；字体 FR Didot/Playfair + Avenir/Nunito 回退，ZH Noto Serif/Sans SC 回退，系统字体优先（不依赖外网）。
- 断点：1280 / 900 / 640；移动 390 必须无横向滚动；reduced-motion 与 `.lite` 关闭位移/粒子。

## 6. viz.js 契约
`window.RIMU_VIZ = { init(), updateLang(), refresh() }`（app.js 在内容渲染后调用 `init()`，语言切换调用 `updateLang()`）。
- `initHeroCanvas()`：渲染 `#hero-canvas` 粒子/连线（China → Nouakchott → West Africa），≤120 粒子，reduced/lite 时静态。
- `initCounters()`：`.count[data-to]`（单值）与 `[data-display-fr][data-display-zh]`（区间值滑入）；FR 千位用 U+202F，小数逗号；ZH 用万/亿。
- `renderCharts()`：`#chart-mau`（折线：MAU+DAU，2027–2031）、`#chart-revenue`（2027–2031 路径或 2031 收入堆叠，数据来自 RIMU_DATA.kpis 的 series/收入）、收入图例 `#revenue-legend`。
- `renderFlowGraph()`：`#flow-canvas` 内生成 SVG：13 节点（3 支柱 + 6 业务 + État/Banques/Afrique de l'Ouest 或 regions）+ 35 条关系（五类流色）；`[data-flow]` 筛选、`[data-story]` 播放 3 段故事（逐节点高亮 + 字幕回调 `window.APP.setStoryCaption(html)` + outcome）、节点点击 `window.APP.openEntity(id)`；`#flow-matrix` 渲染矩阵表；支持 `isolate`/reset。
- `renderMap()`：`#map-canvas` 内生成风格化西非节点-路线图（Nouakchott 中心 + Sénégal/Mali/Guinée/Côte d'Ivoire/Gambie + 中国抽象节点），动画流点；hover tooltip；reduced 静态。
- 所有渲染需支持语言切换（读 `window.APP.lang` 与 `RIMU_DATA` 的 FR/ZH 字段）；不依赖外部库；≤90KB gzip；不阻塞首屏。

## 7. 运行与验收
- 本地：`cd web/site && python3 -m http.server 4173`（不要 npm/构建，纯静态）。
- 验收：Chrome 打开 `http://localhost:4173/`；FR 默认、ZH 切换、Synthèse/Complet、抽屉 6 tab、深链、Pitch、Presenter、reduced-motion、390px、打印预览（打印由后续 dossier 负责）。
- 禁止：外部字体/图片/CDN 依赖；console error；lorem；破坏其他文件；未授权照片。
- 完成后向 Lead 报告：文件、关键决策、未完成项、如何验证。

## 8. 视觉/内容依据（只读）
- `web/spec/visual-system.md`（token/组件/字体/打印）
- `web/spec/interaction-motion.md`（逐区块交互/动效/降级）
- `web/spec/content-model.md`（FR/ZH 文案与 14 区块内容；本构建合并为 9 章）
- `web/spec/data-model.json`（唯一数据源）
- `web/PLAN_v2_optimisation.md`（9 章、双层模式、流故事、三赢等）
