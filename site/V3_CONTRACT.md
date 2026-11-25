# V3_CONTRACT — Visual-first 优化实施契约

> 决策：按建议执行 **B · Visual-first v3**（先完成 Quick Win 信息分层，再六个区块视觉化）。
> 默认 **Synthèse 隐藏长文本**，Complet / 抽屉 / 方法学 / 打印册保留全部信息。
> 本契约定义三个并行交付物的文件与接口；Lead 负责 index.html / app.js 集成，不改他人文件。

## 文件 ownership

| 负责人 | 文件 | 内容 |
|---|---|---|
| copy-shortener | `web/site/assets/js/short-copy.js` | 新增 `window.RIMU_SHORT = {fr:{...},zh:{...}}` 短文案层 |
| icon-illustrator | `web/site/assets/js/icons.js` | 新增 `window.RIMU_ICON_PATHS = {name:"<path .../>"}` 线性图标库 |
| visual-designer | `web/site/assets/css/visual-first.css` | 新组件样式 / 模式隐藏 / 动效 / 响应式 / 打印 |
| lead | `index.html`, `app.js`, 其他既有文件 | 集成、渲染、模式、动效、验收 |

不修改 `content.js`, `data.js`, `theme.css`, `layout.css`, `viz.js`；若发现需改，报告 Lead。

## 1. 短文案 short-copy.js schema（严格镜像 FR/ZH）

```js
window.RIMU_SHORT = {
  fr: {
    hero: { lead: "..." },                       // ≤ 140 字符
    chapters: {
      pourquoi: { lead: "..." },                 // 每个 ≤ 120 字符
      systeme: { lead: "..." },
      rimu: { lead: "..." },
      ia: { lead: "..." },
      flux: { lead: "..." },
      trajectoire: { lead: "..." },
      impact: { lead: "..." },
      decision: { lead: "..." }
    },
    problems: {
      attention: { short: "...", stat: "< 20 %", statLabel: "..." },
      argent:    { short: "...", stat: "≈ 50 %", statLabel: "..." },
      donnees:   { short: "...", stat: "0", statLabel: "..." },
      mono_export:{ short: "...", stat: "1", statLabel: "..." }
    },
    pillars: {
      plateforme: { short: "..." }, rimu: { short: "..." }, calcul: { short: "..." }
    },
    businesses: {
      projets: { short: "..." }, commerce_gros: { short: "..." },
      biens_conso: { short: "..." }, finance_rimp: { short: "..." },
      formation: { short: "..." }, sante: { short: "..." }
    },
    layers: {
      experience: { keywords: ["...", "...", "..."] },
      middleware: { keywords: ["...", "...", "..."] },
      intelligent: { keywords: ["...", "...", "..."] },
      infrastructure: { keywords: ["...", "...", "..."] }
    },
    rimu: {
      trust: [ { short: "..." }, { short: "..." }, { short: "..." } ]
    },
    ia: {
      groups: [ { short: "..." }, { short: "..." }, { short: "..." } ],
      phases: [ { short: "..." }, { short: "..." }, { short: "..." } ]
    },
    impact: {
      tabs: [ { short: "..." }, { short: "..." }, { short: "..." } ]
    },
    decision: {
      supports: {
        organisation: { unlock: "...", status: "À clarifier", icon: "gov" },
        sites:        { unlock: "...", status: "À clarifier", icon: "land" },
        financement:  { unlock: "...", status: "À clarifier", icon: "funding" },
        finance_regles:{ unlock: "...", status: "À clarifier", icon: "rules" },
        diplomatie:   { unlock: "...", status: "À clarifier", icon: "diplomacy" }
      },
      risks: {
        interop:  { status: "...", icon: "risk_wallet" },
        contenu:  { status: "...", icon: "risk_religion" },
        electricite: { status: "...", icon: "risk_power" },
        donnees:  { status: "...", icon: "risk_cloud" },
        talents:  { status: "...", icon: "risk_talent" }
      }
    }
  },
  zh: { /* 完全镜像所有 key */ }
};
```

要求：
- 角色：**短、事实性、可直接上线**；FR 术语与源文件一致（plateforme bilatérale, RIMU, RIMP, calcul, souveraineté, hassaniya 等）。
- 数字只能引用页面已有数据（data.js / 内容模型），不得发明；无数字的用定性短句。
- 每个 `short` ≤ 70 字符（FR）/ 32 字（ZH）；`lead` ≤ 120 字符（FR）/ 52 字（ZH）；`unlock` ≤ 90 字符 / 40 字。
- `status` 只用短标签（如 « À clarifier », « Mécanisme prévu » / 「待明确」「机制已列」），不伪造绩效数据。
- FR/ZH key 完全镜像；语法合法；文件只包含 `window.RIMU_SHORT = ...;`。

## 2. 图标 icons.js schema

```js
window.RIMU_ICON_PATHS = {
  entry: '<path d="..."/>',
  rimu: '<path .../>',
  // ...
};
```
- 24×24 viewBox；路径使用 `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"` 由 Lead 外壳统一设置（文件内只放内部元素，不包 `<svg>`）。
- 风格：AUREON 金色线性图标，几何、无 emoji、无渐变、无外部依赖。
- 必须包含名称：
  `entry, rimu, compute, projects, trade, consumer, finance, training, health,
   attention, cash, data, export, experience, middleware, intelligence, infrastructure,
   gov, land, funding, rules, diplomacy, risk_wallet, risk_religion, risk_power, risk_cloud, risk_talent,
   arrow, check, play, pause, replay, close, chart, users, wallet, map, shield, spark, globe`
- 每个图标在 24×24 内留 2px 边距；视觉重量一致；能与 1.5px 金色描边、深蓝底、象牙白底兼容。

## 3. visual-first.css 组件契约

Lead 将生成以下 DOM；CSS 负责样式、动效、响应式、打印。所有颜色/字号沿用 `theme.css` 变量，不新增外链字体。

### 3.1 模式工具类
- `.lead-short` / `.lead-long`：Synthèse 显示 short，Complet 显示 long。
- `.short-only` / `.long-only`：同上。
- 规则：`html[data-mode="synthese"] .long-only, html[data-mode="synthese"] .complet-only { display:none!important }`；Complet 反向；打印强制显示 long、隐藏 short。

### 3.2 问题卡（Pourquoi）
Lead 生成：
```html
<article class="problem-card vf-problem reveal" data-jump="#ch-..." tabindex="0" role="link">
  <span class="problem-no">01</span>
  <span class="vf-problem-icon">[svg.icon]</span>
  <h3 class="problem-title">...</h3>
  <span class="vf-stat">...</span>
  <span class="vf-stat-label">...</span>
  <p class="problem-body long-only">...</p>
  <p class="problem-change long-only">...</p>
  <span class="vf-arrow">→</span>
</article>
```
CSS：4 列桌面 / 2 列平板 / 1 列移动；卡片有图标圆环、金色细线、hover 上浮 + 金色描边；`.long-only` 由模式规则隐藏。可加 `.vf-problem:hover .vf-problem-icon` 发光。

### 3.3 系统总图（Système）
Lead 生成：
```html
<div id="system-visual" class="system-visual reveal">
  <div class="sv-row sv-pillars">
    <button class="sv-node sv-pillar" data-entity="p.plateforme">
      <span class="sv-icon">[svg]</span><span class="sv-name">...</span><span class="sv-metric">...</span>
    </button> ×3
  </div>
  <div class="sv-spine"></div>
  <div class="sv-row sv-businesses">
    <button class="sv-node sv-business" data-entity="b.projets">...</button> ×6
  </div>
  <div class="sv-spine"></div>
  <div class="sv-row sv-layers">
    <button class="sv-layer" data-entity="layer.experience">...</button> ×4
  </div>
  <p class="sv-hint">...</p>
</div>
```
CSS：桌面三行；中间竖向金线 / 分支线（`.sv-spine::before` 等）；节点 hover 金色描边 + 微光；`.sv-layer` 横向四格；移动端纵向堆叠；`.is-in` 时节点按 60–80ms 错峰浮入；`.system-groups` 在 Synthèse 隐藏（由 Lead 标记 `.complet-only`），Complet 隐藏 `.system-visual`。

### 3.4 决策瓦片 + 风险仪表（Décision）
Lead 生成：
```html
<div id="decision-tiles" class="decision-tiles"></div>
<!-- .decision-tile: icon / dt-no / dt-title / dt-unlock / dt-status -->
<div id="risk-gauges" class="risk-gauges"></div>
<!-- .risk-gauge: rg-icon / rg-label / rg-status / rg-bar>i -->
```
CSS：5 张决策瓦片桌面 5 列或 3+2，平板 2 列，移动 1 列；状态徽章颜色区分 « À clarifier / Mécanisme prévu »；风险仪表 5 行，金色/红色小条不做假百分比，用 3 段状态条。默认 Synthèse 显示瓦片/仪表，`#supports` / `#risks` 标记 `.complet-only`。

### 3.5 模式隐藏清单（Lead 会加 `.long-only`，CSS 可兜底）
在 `html[data-mode="synthese"]` 下隐藏：
- `.chapter-lead.lead-long`, `.hero-lead.lead-long`
- `.pillar-tagline`, `.business-tagline`, `.layer-comp`
- `.problem-body`, `.problem-change`
- `.trust-body`, `.rimu-fact-label`, `.day-hint`
- `.layer-plate-comp`, `.ai-item-desc`, `.phase-body`
- `.milestone-body`, `.milestone-list`, `.roadmap .note`
- `#transformation`, `.map-copy p`, `#win-panel .benefit-item:nth-child(n+3)`
- `.support-ask`, `.support-body`, `.risk-desc`, `.risk-guarantees`, `.cta-body`, `.next-list`
（如果 Lead 已加 `.long-only`，由通用规则处理；此清单可避免遗漏。）
- 打印时恢复：`@media print { .long-only, .complet-only { display: revert !important } .short-only, .synthese-only { display:none!important } }`

### 3.6 动效
- 只新增：问题卡 hover 微光、系统图`.is-in`装配、决策瓦片/风险仪表入场、数字/进度微动。
- 遵守 `prefers-reduced-motion`、`html.lite`；只用 transform/opacity。
- 不覆盖 existing reveal system；不新增 scroll-jacking。

### 3.7 响应式
1280 / 1080 / 640 / 390：
- 问题卡 4→2→1；
- 系统图三行→纵向堆叠；
- 决策瓦片 5→3/2→1；风险仪表保持单列；
- 图标 20–24px，不随文字放大。

### 3.8 验收
- 1440/1024/390 无横向滚动；
- 图标清晰、节点不重叠、长文本在 Synthèse 隐藏、Complet 可见；
- 0 外部请求；
- 不修改他人文件。

## 4. 验收与提交
- 各 teammate 完成后自测（node --check / CSS 可被 Chrome 解析 / 截图可选），向 Lead 报文件、关键决策、未完成项。
- Lead 合并后统一跑 Playwright：模式切换、FR/ZH、抽屉、移动端、console error、文字量对比。
