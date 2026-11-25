# web/spec/tech-architecture.md — 技术架构与性能方案（T3）

> **版本**：v1.1 · 2026-11-09 · 负责人：web-engineer（T3）— v1.1 在 T1 `data-model.json`、T2 `visual-system.md` 交付后完成对齐复核（差异与待统一项见 §15）
> **依据**：`web/spec/BRIEF.md`（下文 BRIEF）、`rimu_source_text.txt`（下文 src，行号为 1-based）、`web/PLAN_v1.md`（PLAN）、`web/spec/content-model.md`（CM）、`web/spec/interaction-motion.md`（IM）、`README.md` §2/§3/§8、`presentation/index.html` 顶部 CSS、`render/render_deck.js`（既有 PDF 管线）
> **本文件定位**：可执行的技术契约。前端照此实现；Lead 合并为 PLAN 的技术附录。
> **冲突优先级**：数据口径以 T1 的 `data-model.json` 为准；交互与降级行为以 IM 为准；视觉 token 以 T2 的 `visual-system.md` 为准；三者未覆盖或互相矛盾处，以本文件 ADR 为准。
> **标注体系**：`Source`＝源文件直接数字；`Dérivé`＝按公式派生；`Hypothèse`＝工程假设；**实测**＝2026-11-09 本机测量（命令与原始结果见附录 A）。页面文案统一从 JSON 的 `displayFR`/`displayZH` 读取（CM §0.3），前端不得二次格式化。

---

## 0. 阅读指南与硬约束

### 0.1 谁怎么用本文件

| 读者 | 需要的章节 | 产出动作 |
|---|---|---|
| 前端开发 | §2–§8、§10、§11 | 按目录树、schema、预算与验收开发 |
| 设计（T2） | §3.4、§8、§10.2、§11.3 | 确认体积预算与打印分页、对比度修正 |
| 内容/编辑 | §5.7、§6.4 | 按格式更新 JSON、法语文案规则 |
| Lead / 客户 | §1、§2.4、§9、§12、§13 | 拍板选型、上线节奏、域名与访问策略 |
| 运维/值班 | §9.5–§9.8、§13 | 发布、回滚、备份、监控 |

### 0.2 硬约束（不可违背）

| # | 约束 | 来源 |
|---|---|---|
| C1 | 首屏 3G（1,6 Mbps / 300 ms RTT）可交互 < 3 s；首包 gzip < 1,5 MB（字体除外，须子集） | BRIEF §9、§7 |
| C2 | 静态优先、可离线/CDN；不依赖后端与数据库；构建产物可整体拷入 U 盘本地演示 | BRIEF §9、PLAN §9.1 |
| C3 | 不强制 WebGL；3D 仅渐进增强（本项目结论：不做 3D 主视觉） | BRIEF §9、PLAN §10.4 |
| C4 | 打印：同一 DOM → A4 横向提案册；二维码回网页 | BRIEF §5、§4；IM A-09 |
| C5 | 文案与代码分离；业务/数据全部 JSON；新增业务不改组件 | BRIEF §9、§10 |
| C6 | FR 默认 + ZH 切换 + AR RTL 预留（第二期） | BRIEF §8、CM AD-8 |
| C7 | WCAG 2.2 AA：键盘可达、focus trap、对比度、reduced-motion、语义化 | BRIEF §9、IM §1.6–1.7 |
| C8 | 所有数字可溯源或标注 Source/Dérivé/Hypothèse；矛盾只记录不改数 | BRIEF §7.3、§11 |
| C9 | 不运行修改工作区的构建脚本（本文件只写 Markdown；POC 命令均为只读测量或 /tmp） | 本任务约束 |

### 0.3 版本基线（2026-11-09 查询 npm registry / 官方文档，生产须 pin + lockfile）

| 类别 | 依赖 | 版本 | 是否首发引入 | 说明 |
|---|---|---|---|---|
| 框架 | `astro` | 7.4.7 | 是（dev） | SSG 输出，默认零客户端 JS |
| 类型/校验 | `typescript` | 7.0.2 | 是（dev） | 严格模式 |
| 内容校验 | `zod` | 4.6.7 | 是（dev） | 构建期校验 JSON；导出 JSON Schema 供编辑器补全 |
| 图片 | `sharp` | 0.35.5 | 是（dev） | Astro 图像管线；OG 图合成 |
| SVG | `svgo` | 4.1.0 | 是（dev） | 构建期压缩 |
| 站点 | `@astrojs/sitemap` | 3.7.4 | 是（dev） | sitemap + hreflang |
| 测试 | `@playwright/test`、`playwright-core` | 1.65.0 | 是（dev） | E2E、打印 PDF、视觉回归 |
| 性能 | `@lhci/cli`、`size-limit` | 0.16.0 / 14.3.0 | 是（dev） | 预算 CI |
| 二维码 | `qrcode` | 1.5.4 | 是（dev） | 构建期生成 SVG（MIT） |
| 动效 | `gsap`（core + ScrollTrigger） | 3.15.1 | 条件（运行时懒加载） | **已对所有人免费**（gsap.com/pricing，2026-11 核对） |
| 平滑滚动 | `lenis` | 1.3.27 | 条件（运行时懒加载） | MIT；仅桌面 full motion |
| 图表 | `echarts` | 6.1.0 | **否**（默认不引入） | 体积过大，见 §3.3 |
| 运行时 | Node | 24.14.1（本机）/ Pages 构建 pin 22 LTS | — | 以 Astro 7 官方 Node 要求为准 |

### 0.4 术语

| 术语 | 含义 |
|---|---|
| SSG | 构建期生成 HTML；本项目无服务端渲染需求 |
| 同一 DOM 打印 | 不复制内容，用 `@media print` 重排同一份 DOM（+1 个专用打印路由，复用同一 JSON/组件） |
| sheet | 打印页 = 297 × 210 mm（A4 横向）的固定版心 |
| 关键路径 | LCP 前必须下载/执行的内容（HTML、关键 CSS、Hero 字体、首屏 JS） |
| 三档模式 | `full`（完整动效）/ `standard`（默认）/ `lite`（无 JS，单列） |

---

## 1. 决策摘要（ADR，Lead 合并时逐条确认）

| # | 决策 | 结论 | 一句理由 | 主要影响 |
|---|---|---|---|---|
| ADR-01 | 框架 | **Astro 7 SSG + 原生 TypeScript 增强层**；不引入 React/Vue 运行时 | 内容型页面零状态需求；默认 0 客户端 JS，首包最小；内容 JSON + Zod 校验天然适合「非技术编辑」 | §4、§7 |
| ADR-02 | 内容/数据 | 单一 JSON 内容层（§5）+ 构建期 Zod 校验；T1 `data-model.json` 为数据唯一源 | 防止同一数字在 Hero/09/抽屉出现不一致；CI 可拦截 | §5 |
| ADR-03 | 路由/交互 | 单实例抽屉 + hash 路由（照 IM A-01），原生 `popstate`/`hashchange` | 静态托管零配置；深链可分享；返回键可关抽屉 | §4.3、§6.1 |
| ADR-04 | 动效 | **GSAP core + ScrollTrigger 懒加载**（45,4 KB gzip 实测），Lenis 只桌面 full motion（5,3 KB），CSS/IntersectionObserver 作兜底与低带宽路径 | IM 的 SCRUB/quickTo/timeline 语义用 GSAP 最省实现成本；按需加载不阻塞 LCP；全部有降级 | §3.1–3.2 |
| ADR-05 | 图表 | **手写 SVG**（折线/柱/环形/堆叠/时间轴/地图/关系图），不引入 ECharts | 实测 ECharts full 360,4 KB / simple 165,7 KB gzip；手写图表总量可压到 ≤25 KB 且打印友好 | §3.3 |
| ADR-06 | 字体 | **自托管 woff2 子集**：FR 4 文件 ≤96 KB；ZH 仅在 `/zh/` 加载 ≤800 KB；**不用 Google Fonts，不依赖系统字体** | `presentation/index.html` 无 `@font-face`、依赖 Didot/Avenir Next（仅 macOS），跨设备不可复现；第三方字体 CDN 在部分地区不可达 | §7.2、§6.4 |
| ADR-07 | i18n | FR 在根路径（`/`），ZH 在 `/zh/`，AR 在 `/ar/` 预留（`noindex` 至第二期）；文案/数据分离；`Intl` 格式化 + 构建期冻结展示串 | SEO 与分享链接最短；避免客户端格式化差异；阿语二期改 `dir` 与字体即可 | §6 |
| ADR-08 | 打印/PDF | **双保险**：①主页面 `@media print` 直接 A4 横向（BRIEF「同一 DOM」合规，零 JS）；②`/fr/dossier/`、`/zh/dossier/` 专用打印视图（同一 JSON/组件、固定 sheet、15–18 页），CI 用 Playwright 生成 PDF | 浏览器打印版式不可控；专用视图保证提案册质量；两者都不复制文案 | §8 |
| ADR-09 | 部署 | **Cloudflare Pages 主站**（免费计划：500 builds/月、20 000 文件、25 MiB/文件）；不做中国大陆 CDN/ICP；中国访问以镜像与 PDF/PPT 兜底 | Cloudflare China Network 需 Enterprise + ICP（官方文档 2026-04）；ICP 对毛里塔尼亚主体不可行 | §9.1–9.4 |
| ADR-10 | 分析 | Cloudflare Web Analytics + 自建 Cloudflare Worker 事件端点（`sendBeacon`，无 cookie、无 PII） | 隐私友好、无需 Cookie 横幅；可统计抽屉/Tour/PDF 等 IM §1.11 事件 | §9.7 |
| ADR-11 | 性能预算 | 首屏关键路径 ≤220 KB gzip；整页 ≤500 KB（FR 含字体）/ ≤1,3 MB（ZH 含字体）；JS ≤180 KB（PLAN 上限），实施目标 ≤115 KB | 3G 数学推导见 §7.1；远低于 BRIEF 1,5 MB 硬上限 | §7 |
| ADR-12 | 节奏 | **2 周 MVP（10 工作日）先上线核心叙事 + 抽屉 + 数据**；4 周完整体验版 | 客户可先看叙事效果再投入动效/关系图；PDF 管线复用 `render/@render_deck.js` 已验证的 Chrome+Playwright 方案 | §12 |

---

## 2. 选型对比与推荐

### 2.1 候选方案定义

| 代号 | 方案 | 说明 |
|---|---|---|
| A | **Astro 7（SSG）+ 原生 TS** | 构建期生成 14 区块 HTML；交互 = 1 个原生 ESM 入口 + 按需 chunk；内容 = JSON + Zod |
| B | **Next.js 16（App Router，`output: 'export'`）** | 静态导出可行；需 React/RSC 运行时；i18n 与深链要自己实现 |
| C | **纯静态 HTML + JSON + 自写 Node SSG** | 约 300–500 行模板/生成脚本；无框架依赖；所有能力自建 |
| D | 纯静态 HTML 手写 + 客户端 fetch JSON 渲染 | 反例：首屏空壳、SEO 差、低带宽下白屏，不采用 |

### 2.2 需求 → 权重（依据 BRIEF §2/§9 与目标读者）

| 维度 | 权重 | 说明 |
|---|---|---|
| 首屏性能 / 低带宽 | 20 % | 毛里塔尼亚移动网络（ISOC：46 % 渗透率、移动均值 44,21 Mbps，但覆盖与资费不均；数据成本约 1,47 % GNI/3G 套餐）；含中国跨境访问 |
| 可打印 / PDF | 15 % | A4 提案册是三大阅读模式之一 |
| i18n（FR 默认 + ZH + AR 预留） | 15 % | 双语内容全部 JSON 化 |
| 内容维护 / 非技术编辑 | 15 % | 客户要能改文案与数字 |
| 后续扩展（新增业务/数据层） | 10 % | 不改组件即可加内容 |
| 交付周期（2 周 MVP） | 10 % | 赶会议节点 |
| 部署/运维成本 | 10 % | 无后端、无值班 |
| 可访问性 / 可测试性 | 5 % | WCAG 2.2 AA、回归测试 |

### 2.3 评分矩阵（1–5，5 = 最优；加权总分 = Σ权重 × 分数）

| 维度（权重） | A Astro | B Next.js | C 自写 SSG | D 客户端渲染 |
|---|---|---|---|---|
| 首屏性能 / 低带宽（20 %） | 5 | 3 | 5 | 2 |
| 可打印 / PDF（15 %） | 5 | 4 | 5 | 2 |
| i18n（15 %） | 4 | 4 | 2 | 3 |
| 内容维护（15 %） | 5 | 4 | 2 | 2 |
| 扩展性（10 %） | 5 | 5 | 2 | 2 |
| 交付周期（10 %） | 4 | 3 | 2 | 4 |
| 运维成本（10 %） | 5 | 3 | 4 | 4 |
| 可访问性/可测试性（5 %） | 5 | 4 | 4 | 2 |
| **加权总分** | **4,70** | **3,70** | **3,55** | **2,45** |

计算示例（A）：0,20×5 + 0,15×5 + 0,15×4 + 0,15×5 + 0,10×5 + 0,10×4 + 0,10×5 + 0,05×5 = 4,70。

### 2.4 推荐结论：A（Astro 7 SSG + 原生 TS）

1. **首屏与低带宽**：Astro 输出纯 HTML，默认 0 客户端 JS；交互层是一个约 20–30 KB gzip 的原生 ESM 入口，动效/图表按需 chunk。相对 Next.js 省去 React/RSC 运行时（估算 45–90 KB gzip，**Hypothèse**：以官方 static export 实测校准），在 3G 下等于 0,2–0,5 s 的可交互时间优势。
2. **可打印**：同一 DOM 与固定尺寸 sheet 在 Astro 里都是纯 CSS 任务；Next 的 hydration 对打印没有帮助，反而引入打印态与 React 状态不一致的风险。
3. **内容维护**：`content/` JSON + Zod 在构建期校验（重复 id、断引用、缺译、缺来源直接 fail），比自写 SSG 的 300–500 行胶水代码更长期可靠；编辑器可拿到导出的 JSON Schema 做自动补全。
4. **i18n**：Astro 内置 i18n 路由配置 + 我们自己的 `i18n/ui.json` 词典；ZH 与 AR 各自静态路由，hreflang 可直接写在 layout 里。
5. **交付周期**：脚手架、图片管线、字体子集、sitemap、构建缓存开箱即用；MVP 10 个工作日可行。
6. **可退出性**：Astro 产物就是静态 HTML/CSS/JS；若未来换框架，内容 JSON、字体子集、打印 CSS、PDF 管线全部可复用（迁移成本 ≈ 布局层重写，内容零迁移）。

### 2.5 何时改选（触发条件写进项目风险登记）

| 触发条件 | 改选 | 代价 |
|---|---|---|
| 团队完全没有 Node 构建经验且长期无人维护 | C（自写 SSG，把验证脚本减到 100 行） | 内容校验与 i18n 能力下降；预计 +3–5 人日 |
| 客户要求服务端渲染、实时数据、后台 CMS 同一代码库 | B（Next.js） | 首包 +React 运行时；性能预算需重算 |
| 需要真正的文档站文档化（多页文档、搜索） | A + Starlight（Astro 官方文档主题） | 仅新增页面，不影响现有契约 |
| 客户 IT 只允许上传 HTML 到老旧共享主机 | C 或 A 的 `dist/` 直接静态上传（无需 Node 运行时） | 两者产物都是静态文件，A 也满足 |

### 2.6 为什么不选 B/C/D（要点）

- **B**：功能过剩；应用状态几乎只有「抽屉开/关 + tab + 语言」，用 React 运行时换不来收益；静态导出后仍带 hydration JS。
- **C**：所有能力（i18n、图片、校验、sitemap、增量构建、HMR）都要自建，2 周 MVP 风险高；唯一优势是无框架依赖，但产物同样是静态文件，用 A 已获得该优势。
- **D**：首屏是空壳，LCP 依赖 JSON 与 JS 执行，3G 下必然 >3 s；SEO 与无 JS 用户不可用，违反 C1/C5。

## 3. 动效与图表技术取舍（含实测体积）

### 3.1 运行时库实测体积（2026-11-09，jsDelivr dist 拉取 → 本地 gzip -9 / brotli-11）

| 库（版本） | 原始 KB | gzip KB | brotli KB | 结论 |
|---|---|---|---|---|
| gsap 3.15.1 core | 71,6 | 27,8 | 25,2 | 采用（懒加载） |
| gsap ScrollTrigger 3.15.1 | 43,6 | 17,6 | 15,9 | 采用（懒加载） |
| lenis 1.3.27 | 18,4 | 5,3 | 4,7 | 桌面 full motion 条件加载 |
| echarts 6.1.0 full | 1 095,6 | 360,4 | 291,8 | 不采用 |
| echarts 6.1.0 common | 698,3 | 234,8 | 195,4 | 不采用 |
| echarts 6.1.0 simple | 488,6 | 165,7 | 139,9 | 不采用（即使 simple 也远大于手写） |
| motion 14.10.1 | 179,6 | 60,0 | 53,1 | 不采用（GSAP 语义更贴近 IM；二选一即可） |
| 手写 SVG 图表（本项目） | — | 0（库）+ 8–12（业务代码） | 同左 | 采用 |

> 测量对象是 CDN 分发的 `.min.js` 构建；自托管 + 我方打包会略小（gzip 再小 5–10 %），预算按实测值保守取整。命令与原始输出见附录 A.1。

### 3.2 动效技术决策：GSAP 为主，CSS/IO 兜底

| 层 | 技术 | 加载策略 | 预算（gzip） |
|---|---|---|---|
| 首屏 LCP 元素（Hero H1、KPI 终值） | **纯 CSS keyframes**（clip-path/translate/opacity），SSR 终值可读 | CSS 随首包 | 0 JS |
| 区块进入（IM M2） | IntersectionObserver + CSS `.is-inview` | app.js 内 | ≈2 KB |
| 计数器（IM M7） | 原生 rAF + `Intl.NumberFormat`；区间值不做假计数（PLAN §7.5） | app.js 内 | ≈2 KB |
| 抽屉/手风琴/Tab（M5/M6/M13） | CSS transition + 状态机 | app.js 内 | ≈4 KB |
| SVG 绘制/装配/粒子/时间轴/地图（M1、M3、M8、M10–M12、M14） | GSAP timeline + ScrollTrigger（懒 chunk） | 见 3.2.1 | 45,4（GSAP+ST） |
| 平滑滚动 | Lenis（懒 chunk） | 仅桌面 full motion | 5,3 |

#### 3.2.1 懒加载与「不阻塞 LCP / 不白屏」规则（必须实现）

1. `<head>` 内联 1 行脚本：`document.documentElement.classList.add('js')`（≤30 B）；**不为动效隐藏 LCP 元素**。
2. Hero H1/KPI 入场用 CSS keyframes 立即执行；KPI 先 SSR 显示终值，GSAP 到达后才做 0→终值计数（用户首屏看到的就是最终数字，动效是增强）。
3. 动效 chunk：`import('./motion.js')` 在 `DOMContentLoaded` + `document.fonts.ready` + `requestIdleCallback`（超时 800 ms 兜底）后加载；**加载失败或 1,5 s 内未完成不阻塞任何内容**。
4. 加载条件（任一不满足则不加载 GSAP/Lenis）：`matchMedia('(prefers-reduced-motion: no-preference)')`、`html[data-bw!="low"]`、`html[data-motion!="reduced"]`、非 print、`navigator.connection?.saveData !== true`、`effectiveType` 不为 `slow-2g/2g`。
5. 桌面 Lenis：仅 `(hover:hover) and (pointer:fine)`；抽屉打开时 `lenis.stop()`；键盘 Tab 导航时销毁；不与 CSS `scroll-behavior:smooth` 同时启用。
6. 禁止 scroll-jacking：不做 `pin`（IM 02 区块已明确不 pin）；视差只在 Hero，≤80 px 且移动端关闭（IM §1.2 SCRUB 约束）。
7. 打印态（`@media print`）与无 JS 态：所有动画直接呈现终态；计数器显示终值；`data-state` 复位为 open/closed 稳定状态；打印前用 `beforeprint` 展开手风琴与 tab（见 §8.3）。

#### 3.2.2 IM 动效目录 → 实现映射

| IM 编号 | 动效 | 实现 | 归属 chunk | 降级 |
|---|---|---|---|---|
| M1 | Hero 标题揭示 | CSS keyframes（clip-path + translateY） | 首包 CSS | reduced：无位移，200 ms fade |
| M2 | 区块入场 | IO + CSS（`--enter-delay` stagger） | app.js + CSS | reduced/low：直接显示 |
| M3 | 系统图装配 | GSAP timeline + SVG stroke-dashoffset | motion.js | 静态全显 |
| M4 | 卡片 hover | CSS transform | CSS | 触屏无 hover |
| M5 | 抽屉开合 | CSS transition + JS 状态机 | CSS + app.js | reduced：1 ms |
| M6/M13 | Tab/手风琴 | CSS grid-template-rows / 交叉淡入 | CSS + app.js | reduced：瞬时 |
| M7 | KPI 计数 | rAF + Intl.NumberFormat | app.js | reduced/low/no-JS：SSR 终值 |
| M8 | 图表绘制 | 手写 SVG + GSAP/WAAPI 或 CSS dash | charts.js | 静态图 |
| M9 | 手机演示 | JS 状态机 + CSS 过渡 | phone-demo.js | 静态首帧；low 不自动播放 |
| M10/M12 | 流点/路线 | SVG `animateMotion` 或 rAF + path 采样 | relations.js / 内联 | 静态线 |
| M11 | 时间轴绘制 | GSAP 或 CSS | charts.js | 静态 |
| M14 | Mode Pitch | GSAP ScrollTo + 状态机 | tour.js | 直接跳章节 |

### 3.3 图表决策：手写 SVG（默认）vs ECharts（备选）

| 需求（PLAN/IM） | 形态 | 手写 SVG 成本 | ECharts 成本 | 备注 |
|---|---|---|---|---|
| 09 MAU/DAU 五年曲线 | 折线 + 数据点 + tooltip | 1,5 人日 | 0,5 人日 | 打印静态化容易 |
| 09 收入构成 | 环形/堆叠条 | 1 人日 | 0,5 人日 | 区间中点仅用于面积（CM AD-3） |
| 08 时间轴 + sparkline | 手工布局 | 2 人日 | 1 人日 | 需要与事件交互 |
| 07 关系图 12 节点/35 边 | 手工坐标（IM A-05） | 3 人日 | 2 人日（力导向不稳定） | **手工坐标是设计决策，ECharts 反而更贵** |
| 10 西非地图 5 国 | 简化 SVG 线稿 | 2 人日 | 地图 GeoJSON + 注册 ≈2 人日 | 需自备 GeoJSON 并简化 |
| 06 四层架构/三期 | 纯布局 | 1 人日 | 不适用 | 不是图表 |
| **合计（估算，Hypothèse）** | — | **≈10,5 人日** | **≈9 人日 + 165–360 KB JS** | 手写更符合打印/低带宽/可控性 |

**结论：手写 SVG**。理由：
1. **体积**：ECharts 即使 `simple` 包也 165,7 KB gzip，占掉 PLAN 180 KB JS 预算的 92 %；手写图表代码 8–12 KB。
2. **打印**：IM 要求打印时图表转静态 SVG 并配数据表；手写 SVG 天然同源（打印样式直接生效），ECharts Canvas 需额外 `getDataURL` 或 SVG renderer 分支。
3. **可访问性**：手写 SVG 可逐元素加 `<title>`/`aria-label` 并输出隐藏数据表；ECharts canvas 需 `aria` 插件与额外配置。
4. **i18n/口径**：数字来自 `displayFR/displayZH`，图例/单位/tooltip 均为我方 DOM，不受图表库 locale 影响。
5. **维护**：6 张图 + 1 关系图 + 1 地图是封闭集合；组件化后复用轴/刻度/tooltip 基元。

**触发改选 ECharts 的条件**（写入风险登记 R-07）：客户追加「可缩放多序列时间轴 / 地图钻取 / 20+ 图 / 专业图表交互（brush、联动）」→ 改用 `echarts/core` + Line/Bar/Pie + `SVGRenderer` 的按需自定义构建（目标 ≤150 KB gzip，懒加载，仅图表区），仍不使用 full/simple 成品包。

> POC 任务（0,5 人日，MVP 前完成）：MAU 折线 draw-on、收入堆叠条、环形图、sparkline、关系图静态快照，验证 4 张图 ≤14 KB JS 与打印 CSS。

### 3.4 JS chunk 体积归属预算

| chunk | 内容 | gzip 预算 | 加载时机 |
|---|---|---|---|
| `app.js` | 路由/抽屉/tab/focus trap/IO 入场/计数器/格式化/i18n 切换/降级开关 | 14–18 KB | 首包 `defer` |
| `motion.js` | GSAP core + ScrollTrigger + Lenis 封装（3.2.1 条件） | 46–52 KB | 加载后 idle |
| `charts.js` | 09/08 图表、sparkline（可再拆 08/09） | 10–14 KB | 区块进入视口前 200 % 预取 |
| `relations.js` | 关系图交互/筛选/tooltip/键盘 | 6–9 KB | 07 区块接近视口 |
| `phone-demo.js` | RIMU 手机 4 屏演示状态机 | 3–5 KB | 05 区块进入 |
| `tour.js` | Mode Pitch 控制器 | 5–8 KB | 用户点击 CTA 时 |
| `analytics.js` | 事件队列 + sendBeacon | 1–2 KB | idle |
| **初始 JS（首屏）** | 仅 `app.js` | **≤18 KB** | — |
| **整站 JS 上限** | 全部 | **≤115 KB**（PLAN 180 KB 上限内） | — |

### 3.5 降级优先级（实现层，与 IM §0.6/§1.8 一致）

`print > reduced-motion > low-bandwidth > full`。实现载体：
- `html[data-motion="reduced|full"]`、`html[data-bw="low|normal"]`、`html[data-lang]` 由 `app.js` 在首帧前（内联脚本）根据 `matchMedia`/`localStorage`/`URLSearchParams` 写入，避免闪动；
- CSS 以 `html[data-motion="reduced"]` 统一压掉位移/滚动动画；JS 中 `isMotionAllowed()` 为唯一判断源；
- 关闭动画时**不改变 DOM 结构**，只改变时长/呈现方式，保证打印与截图一致。

## 4. 工程结构与构建流程

### 4.1 目录树（新建 `site/` 工程，与既有品牌物料分离）

```
site/
├─ astro.config.mjs / package.json / tsconfig.json / .nvmrc
├─ README.md              # 开发说明（技术）
├─ CONTENT-GUIDE.md      # 非技术编辑手册（§5.7，法语版另出）
├─ RUNBOOK.md            # 发布/回滚/备份/故障处理（§9.8）
├─ src/
│  ├─ pages/
│  │  ├─ index.astro            # FR 主页（14 区块 + 打印模式）
│  │  ├─ zh/index.astro         # ZH 主页
│  │  ├─ fr/dossier.astro       # FR 打印视图（固定 sheet，PDF 源，ADR-08）
│  │  ├─ zh/dossier.astro       # ZH 打印视图
│  │  ├─ methodologie.astro     # 方法学（可分享独立页 + 抽屉复用）
│  │  ├─ 404.astro
│  │  └─ ar/index.astro         # 第二期占位（noindex）
│  ├─ layouts/BaseLayout.astro  # html lang/dir、meta、字体、skip link、Header/Footer
│  ├─ components/
│  │  ├─ chrome/   Header, SectionRail, Footer, LangSwitch, PrintCta
│  │  ├─ sections/ S00Hero … S13NextSteps（14 个）
│  │  ├─ overlays/ Drawer, Backdrop, Spotlight, MethodoDrawer, TourOverlay
│  │  ├─ ui/       KpiCard, Counter, StatusBadge, SourceBadge, TabList, Accordion,
│  │  │            PhaseBar, Timeline, FlowChip, QrCode, Figure, DataTableFallback, LinkArrow
│  │  ├─ viz/      LineChart, RevenueMix, Sparklines, RelationsGraph,
│  │  │            WestAfricaMap, LayersStack, ComputePhases, PhoneMockup
│  │  └─ print/    Sheet, PrintCover, PrintSection, PrintFooter
│  ├─ scripts/     app.ts router.ts drawer.ts focusTrap.ts reveal.ts counter.ts
│  │               tabs.ts accordion.ts format.ts i18n.ts lofi.ts motion.ts
│  │               charts.ts relations.ts phoneDemo.ts tour.ts analytics.ts print.ts
│  ├─ content/     site.json sections.json business-lines.json pillars.json
│  │               relations.json roadmap.json risks.json demands.json methodo.json
│  ├─ data/        data-model.json（T1 交付，构建时同步）relations-layout.json
│  ├─ i18n/        ui.json
│  ├─ lib/         content.ts schema.ts format.ts routes.ts constants.ts
│  ├─ styles/      tokens.css base.css layout.css components.css themes.css print.css
│  └─ assets/      img/（源图）、fonts-src/（源字体，不入 dist）
├─ public/        fonts/*.woff2, og/*.png, favicon/*, robots.txt, _headers, _redirects
├─ scripts/       subset-fonts.mjs build-og.mjs build-qr.mjs build-pdf.mjs
│                 validate-content.mjs check-typography.mjs check-links.mjs
├─ tests/         e2e/ a11y/ print/ visual/
└─ dist/          # 构建产物（不提交；CI 存档 dist.zip）
```

### 4.2 区块 → 组件映射（14 区块，前端按此拆分与验收）

| # | 区块（id 见 IM §1.1） | 主组件 | 复用子组件 | 依赖 chunk |
|---|---|---|---|---|
| 00 | `hero` | S00Hero | Counter, KpiCard, HeroVisual（内联 SVG） | app + CSS |
| 01 | `constat` | S01Constat | ProblemCard, RevealLine | app |
| 02 | `vue-systeme` | S02SystemMap | SystemDiagram（内联 SVG）, NodeButton | app + motion |
| 03 | `piliers` | S03Pillars | PillarCard, KpiCard, SourceBadge | app |
| 04 | `lignes` | S04BusinessLines | BusinessCard, StatusBadge, FlowChip | app |
| 05 | `rimu` | S05Rimu | PhoneMockup, ModuleChip, TabList | app + phone-demo |
| 06 | `calcul` | S06AiCompute | LayersStack, AiUsesTabs, ComputePhases | app + motion |
| 07 | `relations` | S07Relations | RelationsGraph, FlowLegend, MatrixFallback | app + relations |
| 08 | `feuille-de-route` | S08Roadmap | TimelineTracks, MilestoneCard, Sparklines | app + charts |
| 09 | `chiffres-2031` | S09Figures | Counter（区间滑入）, RevenueMix, JobsLayers | app + charts |
| 10 | `benefices` | S10Benefits | BenefitColumn, WestAfricaMap | app + motion |
| 11 | `demande` | S11Demands | Accordion, SixMonthCard | app |
| 12 | `risques` | S12Risks | RiskCard, GovernanceBar | app |
| 13 | `prochaines-etapes` | S13NextSteps | Actions30_90, CtaCard, QrCode, ContactBlock | app |

全局：`Header`（语言 / Mode Pitch / Imprimer / Contact）、`SectionRail`（14 刻度进度，IM §1.3）、`Footer`（来源 / 方法学 / 版本号）、`Drawer`（全站唯一实例，IM §1.4）、`TourOverlay`、`MethodoDrawer`。

### 4.3 交互脚本职责（原生 TS，无框架）

| 模块 | 职责 | 对外 API | 依赖 |
|---|---|---|---|
| `router.ts` | 解析 `#/` 路由（表见 IM §1.1）；push/replace/popstate；`scrollRestoration` | `openRoute()`、`closeDrawer()`、`onRoute()` | — |
| `drawer.ts` | 单实例抽屉渲染（按 type/id 取数）、6 tab、焦点管理、spotlight 高亮 | `open({type,id,tab,from})`、`close()`、`setTab()` | router, focusTrap, content |
| `focusTrap.ts` | Tab 循环、Esc、焦点还原、背景 `inert` | `trap(el)` → `unlock()` | — |
| `reveal.ts` | IO 入场/stagger/一次性重播（IM A-08） | `observe(root)` | — |
| `counter.ts` | 单值计数、区间滑入、Intl 格式化、reduced/no-JS 终值 | `animate(el, value)` | format |
| `tabs.ts` / `accordion.ts` | WAI-ARIA Tabs / Disclosure 键盘与状态 | 组件内 init | — |
| `motion.ts` | GSAP/Lenis 能力判断与懒加载；唯一 `isMotionAllowed()` | `initMotion()` | 条件 import |
| `charts.ts` | 09/08 图表绘制与 tooltip；首次进入才初始化（IM §1.4） | `initChart(id)` | 数据内联 |
| `relations.ts` | 07 图：筛选/isolate/tooltip/键盘节点遍历/矩阵降级 | `initRelations()` | 内联 SVG |
| `phoneDemo.ts` | 05 手机 4 屏演示（8 s，hover 暂停，离开视口暂停） | `demo.play()`、`demo.pause()` | — |
| `tour.ts` | Mode Pitch：场景表、滚动定位、字幕、进度、暂停/Esc、`#/tour/n` | `tour.start(n)` | router, motion |
| `lofi.ts` | 三档模式开关（`?bw=low`、saveData 自动、localStorage 持久化） | `setLow()` | — |
| `analytics.ts` | 事件队列 + `sendBeacon`、DNT 尊重、失败静默 | `track(name, payload)` | — |
| `print.ts` | `beforeprint` 展开折叠内容、`?print=1` 预处理、`window.print()` | — | — |

### 4.4 构建流程

```
content/*.json + data/*.json + i18n/ui.json
        │ (1) validate-content.mjs（Zod + 引用完整性 + 口径规则）
        ▼
src/** ──Astro build (SSG)──► dist/
        │ (2) 图像 sharp → AVIF/WebP/srcset；SVG svgo
        │ (3) 关键 CSS 内联 ≤14 KB；其余 CSS 合并 1 文件
        │ (4) 字体：subset-fonts.mjs（抽取用字 → pyftsubset → woff2）
        │ (5) OG/QR：build-og.mjs（1200×630 PNG/WebP）、build-qr.mjs（SVG）
        │ (6) HTML 后处理：注入版本号；生成 sitemap/hreflang
        ▼
dist/ ──(7) 预算校验──► size-limit + 自定义 gzip 脚本（失败即 CI fail）
        │ (8) Playwright：E2E + a11y + 打印 PDF（/fr/dossier → export/pdf/）
        ▼
Cloudflare Pages（main → production；PR → preview）
```

关键点：
1. **内容校验先于构建**：断引用/缺来源/缺译直接 fail，不允许「先上线后补」。
2. **字体子集在构建期完成**：扫描 HTML 可见文本 + 内容 JSON 生成字符集 → `pyftsubset` → woff2；缺字回退系统字体栈并告警（§7.2）。
3. **HTML 即最终态**：数字/文案/图表初始 SVG 全在 HTML 内，JS 只增强，无 JS 可完整阅读。
4. **打印 PDF 由 CI 生成**并随版本存档（版式可复现，不依赖访客浏览器）。

### 4.5 package.json scripts（建议）

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "node scripts/validate-content.mjs && astro build && node scripts/subset-fonts.mjs && node scripts/build-og.mjs && node scripts/build-qr.mjs",
    "preview": "astro preview",
    "check:content": "node scripts/validate-content.mjs --strict",
    "check:type": "astro check && tsc --noEmit",
    "check:fr": "node scripts/check-typography.mjs",
    "check:links": "node scripts/check-links.mjs",
    "check:size": "size-limit",
    "test:e2e": "playwright test tests/e2e",
    "test:a11y": "playwright test tests/a11y",
    "test:print": "playwright test tests/print",
    "pdf": "node scripts/build-pdf.mjs",
    "verify": "npm run check:type && npm run check:content && npm run check:fr && npm run build && npm run check:size && npm run test:e2e && npm run test:a11y && npm run test:print",
    "lighthouse": "lhci autorun"
  }
}
```

### 4.6 CI 关卡（GitHub Actions；任一失败阻塞合并/发布）

| Job | 命令 | 失败条件 |
|---|---|---|
| content | `check:content` | 断引用、重复 id、缺 `fr`、KPI 缺 `kind/source`、业务线缺 6 tab、口径规则触发 |
| type | `check:type` | TS/Astro 类型错误 |
| typography | `check:fr` | 法语排版规则违规（§6.4：直引号、缺不换行空格、hyphen 代替 en dash 等） |
| build | `build` | 构建失败、字体子集缺字告警未处理 |
| budget | `check:size` | 单文件/总量超预算（§7.1 表） |
| e2e | `test:e2e` | 14 区块缺失、抽屉/深链/返回键失败、Tour 失败 |
| a11y | `test:a11y` | axe critical/serious；键盘路径失败 |
| print | `test:print` | PDF 页数越界、内容溢出 sheet、字体未嵌入 |
| lighthouse | `lhci autorun` | 性能 <85（mobile 3G 预设）、a11y <95、SEO <95 |
| deploy | Cloudflare Pages | 以上全部通过；main 自动生产，PR 出预览链接 |

### 4.7 配置与约定

| 项 | 约定 |
|---|---|
| 环境变量 | `PUBLIC_SITE_URL=https://www.aureondigital.mr`；`PUBLIC_ANALYTICS_ENDPOINT`；`PUBLIC_QR_BASE`；无 secret 进前端 |
| TS | `strict: true`；无 `any`；JSON 导入统一经 Zod `parse` |
| CSS | 原生 CSS + 变量；只用逻辑属性（`margin-inline`、`inset-inline-start`）为 AR 预留；`!important` 只允许出现在 `print.css` |
| 类名/状态 | BEM-lite + `data-*` 状态（IM §0.5）；不引入 utility 框架 |
| 第三方 | 运行时第三方脚本 = 0（分析走自建端点）；runtime 依赖 ≤12 个（含 GSAP/Lenis） |
| 浏览器基线 | Chrome/Edge ≥120、Safari/iOS ≥17、Firefox ≥128、微信内置浏览器（iOS WKWebView / Android X5）、Samsung Internet 最新（§11.3） |
| 时间/时区 | 站点时间基准 Africa/Nouakchott（UTC+0）；日期显示用 `Intl.DateTimeFormat`（§6.3） |

### 4.8 预算守门配置（size-limit 示例）

```json
[
  { "name": "initial JS", "path": "dist/_astro/*.js", "limit": "30 KB", "gzip": true },
  { "name": "motion chunk", "path": "dist/_astro/motion.*.js", "limit": "55 KB", "gzip": true },
  { "name": "charts chunk", "path": "dist/_astro/charts.*.js", "limit": "16 KB", "gzip": true },
  { "name": "CSS total", "path": "dist/_astro/*.css", "limit": "35 KB", "gzip": true },
  { "name": "HTML FR", "path": "dist/index.html", "limit": "80 KB", "gzip": true }
]
```

### 4.9 工程原则（写进 README，供后续接手）

1. **无框架状态**：全站只有一个抽屉实例、一个路由表、一个 i18n 词典；禁止再引入状态库。
2. **内容源唯一**：文案只在 `content/`，数字只在 `data/kpis.json`；HTML 里不出现裸数字/裸文案。
3. **降级即功能**：新增任何交互必须同时提交 reduced-motion、low-bandwidth、print、no-JS 四种呈现（IM §1.8 矩阵）。
4. **可打印优先**：组件默认语义化 HTML；避免 canvas-only、固定像素高度、仅 hover 可见的信息。
5. **可分享**：任何 L2 抽屉必须可由 `#/` 深链直接打开（IM §1.1 规则 5）。

## 5. 内容与数据模型

### 5.1 设计原则

1. **单一数据源**：所有数字只在 `data-model.json` 出现一次（含 `displayFR/displayZH` 冻结串）；所有文案只在 `content/` 或 `data-model.json` 出现一次。组件与 HTML 中不允许裸数字/裸文案。
2. **构建期校验**：JSON 不符合 schema → 构建失败；引用不存在 → 构建失败；KPI 缺来源 → 构建失败。
3. **i18n 字段内联**：短文案用 `{ fr, zh }` 对象；长文（> 240 字符）可用可选 `md` 扩展（受限 Markdown：粗体/斜体/链接），构建时渲染并消毒。
4. **枚举唯一**：`stage`、`flow`、`kind`、`locale`、`section id`、`drawer type`、`tab id` 全部用固定枚举，禁止自由字符串（保证 CSS/路由/统计稳定）。
5. **与 T1 文件的关系**：`web/spec/data-model.json`（T1）是数据的权威交付；本文件定义**前端消费契约**。若 T1 实际字段名不同，在 `site/src/lib/content.ts` 写 ≤40 行 adapter 映射到本契约，**不修改 T1 内容**（BRIEF §11 不许悄悄改数）。

### 5.2 文件清单与责任

| 文件 | 内容 | 责任方 | 校验 |
|---|---|---|---|
| `src/data/data-model.json` | T1 实际顶层：`meta / kpis / pillars / businessLines / relations（35 条有向边） / regions / rimuModules / aiUseCases / layers / roadmap / risks / stateSupports / transformations / qa / assumptions / sources` | T1 交付；前端直接导入 | Zod + V01–V12 |
| `src/content/blocks.json` | 14 区块的 kicker/title/subtitle/卡片文案/CTA；区块 id 对齐 T1 `meta.blockIds`（`00-hero`…`13-next-steps`） | T1 + 前端 | Zod + 引用 id |
| `src/content/site.json` | 站点元数据：URL、OG、版本、CTA、打印配置（联系信息复用 T1 `meta.contact`） | 前端 | Zod |
| `src/i18n/ui.json` | 界面词典：按钮、tab、aria-label、空态、Tour 字幕、错误提示 | 前端 + T1 译文 | FR/ZH 键一致 |

### 5.3 通用类型（`src/lib/schema.ts` 的 Zod 定义摘要）

```ts
// 枚举 —— 唯一合法值
export const LOCALES = ["fr", "zh"] as const;              // ar 第二期加入，先不产出路由
export const RESERVED_LOCALES = ["ar"] as const;
export const KINDS = ["Source", "Dérivé", "Hypothèse"] as const;    // T1 kpi.type 原值；页面徽章用小写归一
export const FLOWS = ["capital", "marchandises", "paiements", "donnees", "attention"] as const;
export const STAGES = ["mature", "pilote", "pré-étude"] as const;   // T1 原值；展示文案取 stageLabelFR/ZH
export const DRAWER_TYPES = ["business", "pillar", "module", "layer", "flow", "methodo"] as const;
export const TABS = ["apercu", "fonctionnement", "chiffres", "acteurs", "feuille-route", "risques"] as const;

export type Locale = (typeof LOCALES)[number];
export type Kind = (typeof KINDS)[number];
export type Flow = (typeof FLOWS)[number];

// 本地化文本：fr 必填；zh 在 MVP 完成前允许缺失并告警（--strict 时 fail）
export interface LocalizedText { fr: string; zh?: string; ar?: string }

// 来源引用：所有 KPI/关键数字必填
export interface SourceRef {
  kind: Kind;
  file: "rimu_source_text.txt";
  lines?: number[];          // 1-based，如 [72, 78]
  excerpt?: string;          // 原文摘录 ≤160 字符，便于审校核对
  formula?: string;          // kind=derive 时必填，如 "800k DAU × 40 vues/jour"
  inputs?: string[];         // 公式引用的 kpi id，供机器校验
  note?: string;             // 口径备注（页面 ⓘ 展示）
  verifiedAt: string;        // ISO 日期（数据复核日期）
}
```

> **T1 实际本地化写法（v1.1 复核）**：T1 采用平铺字段 `xxxFR / xxxZH`（`nameFR/nameZH`、`labelFR/labelZH`、`displayFR/displayZH`、`detailFR/detailZH`…），本文件 §5.4 的 `{fr, zh}` 写法仅表达**归一后的内部契约**；`src/lib/content.ts` 的 adapter 负责平铺 → `LocalizedText`，**不修改 T1 文件**。

### 5.4 核心 schema 与示例

#### 5.4.1 KPI（`data-model.json → kpis[]`）

> **T1 实际字段（v1.1 复核）**：`id`（带命名空间，如 `kpi.mau_2031`）、`nameFR/nameZH`、`valueType`（`number|range|series`）、`value/range/series`、`unitFR/unitZH`、`year`、`type`（`Source|Dérivé|Hypothèse`）、`confidence`、`formula`、`assumption`、`displayFR/displayZH`、`displayLongFR/displayLongZH`、`chart`（`counter|line|donut|bar`…）、`component`、`animation`、`surfaces`、`sourceLines`、`sourceRef`、`notes`。本节 TS/JSON 为归一后的内部契约，映射见 §5.6。

```ts
export interface Kpi {
  id: string;                  // 稳定 id，全站引用：mau_2031 / revenue_total_2031 / wallets_2031 …
  label: LocalizedText;
  kind: Kind;
  source: SourceRef;
  value?: number;              // 单值（与 range 二选一）
  range?: [number, number];    // 区间（收入、就业等；展示区间，不做假计数）
  unit: "count" | "usd_m" | "usd_b" | "percent" | "minutes" | "months" | "mw" | "cards" | "jobs" | "text";
  year?: number;               // 口径年份（2031 / 2027…）
  scope?: LocalizedText;       // 口径说明，如 "cumul 5 ans" / "scénario ambitieux"
  displayFR: string;           // 构建期冻结展示串（CM §0.3 第 5 条）
  displayZH: string;
  animate: "count" | "slide" | "none";  // 单值 count；区间 slide（PLAN §7.5）
  chart?: { type: "line" | "bar" | "donut" | "stack" | "spark"; seriesId?: string; order?: number };
  qa?: string[];               // 关联 T1 qa[].id（QA-1…QA-7）
}
```

```json
{
  "id": "mau_2031",
  "label": { "fr": "Utilisateurs actifs mensuels", "zh": "月活跃用户" },
  "kind": "source",
  "source": {
    "kind": "source",
    "file": "rimu_source_text.txt",
    "lines": [72, 58],
    "excerpt": "MAU RIMU : 2,5 millions.",
    "verifiedAt": "2026-11-09"
  },
  "value": 2500000,
  "unit": "count",
  "year": 2031,
  "scope": { "fr": "scénario ambitieux", "zh": "雄心情景" },
  "displayFR": "2,5 M",
  "displayZH": "250 万",
  "animate": "count",
  "chart": { "type": "line", "seriesId": "mau", "order": 1 }
}
```

#### 5.4.2 时间序列（`series[]`）

> **T1 实际结构**：无独立 `series[]`；序列是 `kpis[]` 中 `valueType:"series"` 的条目（如 `kpi.series.mau`，含 `series:[{year,value}]` 与 `chart:"line"`）。adapter 展开为内部 `Series`。

```json
{
  "id": "mau",
  "label": { "fr": "MAU RIMU (2027–2031)", "zh": "RIMU 月活（2027–2031）" },
  "unit": "count",
  "points": [
    { "year": 2027, "value": 250000 },
    { "year": 2028, "value": 700000 },
    { "year": 2029, "value": 1200000 },
    { "year": 2030, "value": 1800000 },
    { "year": 2031, "value": 2500000 }
  ],
  "source": { "kind": "source", "file": "rimu_source_text.txt", "lines": [52, 59], "verifiedAt": "2026-11-09" }
}
```

#### 5.4.3 业务线（`businessLines[]`，6 条，字段对应 CM Annexe A 与 6 tab）

> **T1 实际结构（v1.1 复核）**：`id` 即关系图节点 id（`b.projets` / `b.commerce-gros` / `b.biens-conso` / `b.finance-rimp` / `b.formation` / `b.sante`）；`stage ∈ {mature, pilote, pré-étude}` 且自带 `stageLabelFR/ZH`；文案平铺（`nameFR/ZH`、`taglineFR/ZH`、`definitionFR/ZH`）；`subModules[]`、`actorsFR/actorsZH[]`、`flowIn/flowOut`（按五类流分组，含 `textFR/ZH` 与 `relationIds`）、`kpiIds[]`、`risks[]`（内联 riskFR/ZH + mitigation）、`surfaceIds[]`、`pillarIds[]`、`tags/tagsZH`。6 tab 由这些字段组合渲染，**无需 T1 另造 drawer 对象**。

```ts
export interface BusinessLine {
  id: "projets-investissements" | "commerce-gros" | "biens-consommation"
    | "finance-rimp" | "formation-talents" | "sante-telemedecine";
  nodeId: string;              // 关系图节点 id：b.projets / b.commerce-gros / b.biens-conso / b.finance-rimp / b.formation / b.sante
  order: number;               // 1–6
  title: LocalizedText;
  oneLiner: LocalizedText;
  stage: "mature" | "pilote" | "pre-etude";   // CM AD-2
  kpiIds: string[];            // 卡片 3 个（也用于 Hero/03 摘要，保持一致）
  related: string[];           // 其他业务线 id
  drawer: {
    apercu: { definition: LocalizedText; why: LocalizedText; objectives: LocalizedText[]; values: LocalizedText[] };
    fonctionnement: { steps: Step[]; modules: Module[]; mechanisms?: LocalizedText[] };
    chiffres: { kpiIds: string[]; note?: LocalizedText };
    acteurs: { actors: Actor[]; flowIn: Flow[]; flowOut: Flow[]; nodeIds: string[] };
    "feuille-route": { phases: Phase[] };
    risques: { riskIds: string[] };
  };
  print: { sheet: string; order: number };
}
```

```json
{
  "id": "finance-rimp",
  "nodeId": "b.finance-rimp",
  "order": 4,
  "title": { "fr": "Finance & RIMP", "zh": "金融与 RIMP" },
  "oneLiner": {
    "fr": "Portefeuilles, encaissement marchand et paiements transfrontaliers, sur des rails nationaux interopérables.",
    "zh": "钱包、商户收单与跨境支付，建立在可互操作的国家铁轨上。"
  },
  "stage": "pilote",
  "kpiIds": ["wallets_2031", "revenue_rimp_2031", "payment_flow_2031"],
  "related": ["projets-investissements", "biens-consommation"],
  "drawer": {
    "apercu": {
      "definition": { "fr": "Le paiement RIMP est l'infrastructure de règlement de RIMU et de la plateforme bilatérale.", "zh": "RIMP 是 RIMU 与双边平台的结算基础设施。" },
      "why": { "fr": "Transformer une économie de cash non traçable en circulation numérique auditée.", "zh": "把不可追踪的现金经济转化为可审计的数字流通。" },
      "objectives": [{ "fr": "Interopérer banques, opérateurs et wallets existants.", "zh": "打通银行、运营商与既有钱包。" }],
      "values": [{ "fr": "Commissions marchands et transfrontalières, microfinance, canaux administratifs et B2B.", "zh": "商户与跨境佣金、微贷、行政与 B2B 渠道。" }]
    },
    "fonctionnement": {
      "steps": [{ "n": 1, "title": { "fr": "Encaissement marchand", "zh": "商户收单" }, "text": { "fr": "QR marchands déployés nationalement des 2029.", "zh": "2029 年起全国部署商户 QR。" } }],
      "modules": [{ "id": "wallet", "title": { "fr": "Portefeuille RIMP", "zh": "RIMP 钱包" }, "text": { "fr": "Comptes, KYC, plafonds, historique.", "zh": "账户、KYC、限额、流水。" }, "kpiIds": ["wallets_2031"] }]
    },
    "chiffres": { "kpiIds": ["wallets_2031", "revenue_rimp_2031", "payment_flow_2031"], "note": { "fr": "Flux dérivé de la méthode 0,5–0,7 %.", "zh": "流量按 0,5–0,7 % 费率派生。" } },
    "acteurs": {
      "actors": [
        { "name": { "fr": "Banque centrale de Mauritanie", "zh": "毛里塔尼亚中央银行" }, "role": { "fr": "Interopérabilité, règles", "zh": "互操作与规则" } },
        { "name": { "fr": "Banques & opérateurs", "zh": "银行与运营商" }, "role": { "fr": "Rails, KYC, liquidité", "zh": "清算轨道、KYC、流动性" } }
      ],
      "flowIn": ["capital", "donnees"],
      "flowOut": ["paiements"],
      "nodeIds": ["p.rimu", "b.finance-rimp"]
    },
    "feuille-route": {
      "phases": [{ "id": "ph1", "label": { "fr": "2027–2028", "zh": "2027–2028" }, "bullets": [{ "fr": "Pilote de portefeuille et marchands.", "zh": "钱包与商户试点。" }] }]
    },
    "risques": { "riskIds": ["R-01"] }
  },
  "print": { "sheet": "p10", "order": 4 }
}
```

> 注：上面 `oneLiner` 的 FR 为语法示例，最终文案从 T1 内容模型取并交法语母语审校（CM 已提供 6 条业务线完整文案）。业务线的 6 个 tab **必须全部有内容**；缺失时 tab 显示空态文案（IM §1.4 状态表），不得隐藏 tab（IM A-02）。

#### 5.4.4 关系网络（`relations`：节点 + 边，CM 称共 35 条边）

> **T1 实际结构（v1.1 复核）**：`relations` 是 **35 条有向边的平铺数组**（部分成对出现双向），字段 `id/from/to/flow/direction/labelFR/labelZH/detailFR/detailZH/strength/animation/kpiIds/sourceLines`；**节点由 `pillars[]` + `businessLines[]` + `regions[]` 派生**（14 个节点用于图；`r.nouakchott` 只出现在地图）。**T1 不含 x/y**：手工坐标由前端维护在 `src/data/relations-layout.json`，不写回 T1（IM A-05）。下方示例为归一后的 `{nodes,edges}` 视图。

```ts
export interface RelationNode {
  id: string;                 // p.plateforme / p.rimu / p.calcul / b.* / x.etat / x.banques / x.afrique-ouest
  kind: "pillar" | "business" | "external";
  label: LocalizedText;
  short?: LocalizedText;
  x: number; y: number;       // 手工坐标（IM A-05：固定布局，便于讲解/打印）
  drawer?: { type: "pillar" | "business"; id: string };
  kpiId?: string;             // hover 显示 1 个关键数字
}
export interface RelationEdge {
  id: string;                 // e.rimu-rimp
  from: string; to: string;   // 节点 id
  flow: "capital" | "marchandises" | "paiements" | "donnees" | "attention";
  label: LocalizedText;       // tooltip 一句说明（≤120 字符）
  kpiId?: string;             // 可选：边上的数字引用
  strength?: number;          // 0–1，仅用于视觉线宽（Hypothèse）
}
```

```json
{
  "nodes": [
    { "id": "p.rimu", "kind": "pillar", "label": { "fr": "RIMU", "zh": "RIMU" }, "x": 480, "y": 180, "drawer": { "type": "pillar", "id": "rimu" }, "kpiId": "mau_2031" },
    { "id": "b.finance-rimp", "kind": "business", "label": { "fr": "Finance & RIMP", "zh": "金融与 RIMP" }, "x": 680, "y": 320, "drawer": { "type": "business", "id": "finance-rimp" } },
    { "id": "x.banques", "kind": "external", "label": { "fr": "Banques & opérateurs", "zh": "银行与运营商" }, "x": 840, "y": 320 }
  ],
  "edges": [
    { "id": "e.rimu-rimp", "from": "p.rimu", "to": "b.finance-rimp", "flow": "paiements", "label": { "fr": "RIMU Shop et live commerce réglés via RIMP.", "zh": "RIMU 商城与直播带货经 RIMP 结算。" }, "kpiId": "payment_flow_2031" },
    { "id": "e.rimp-banques", "from": "b.finance-rimp", "to": "x.banques", "flow": "paiements", "label": { "fr": "Interopérabilité des portefeuilles et des banques.", "zh": "钱包与银行互操作。" } }
  ]
}
```

#### 5.4.5 区块文案（`content/blocks.json`，14 项）

```ts
export interface Block {
  id: "hero" | "constat" | "vue-systeme" | "piliers" | "lignes" | "rimu" | "calcul"
    | "relations" | "feuille-de-route" | "chiffres-2031" | "benefices" | "demande" | "risques" | "prochaines-etapes";
  order: number;                 // 0–13
  tone: "dark" | "light";
  kicker?: LocalizedText;
  title: LocalizedText;
  subtitle?: LocalizedText;
  cta?: { label: LocalizedText; href: string; variant: "primary" | "secondary" | "link" }[];
  items?: { id: string; title: LocalizedText; text: LocalizedText; kpiIds?: string[]; href?: string }[];
  print?: { sheet: string };
}
```

#### 5.4.6 界面词典（`i18n/ui.json`）

```json
{
  "meta": { "defaultLocale": "fr", "locales": ["fr", "zh"], "fallback": "fr" },
  "fr": {
    "nav.tour": "Visite guidée · 3 min",
    "nav.print": "Dossier PDF",
    "nav.lang": "Changer de langue",
    "tab.apercu": "Aperçu",
    "tab.fonctionnement": "Fonctionnement",
    "tab.chiffres": "Chiffres clés",
    "tab.acteurs": "Acteurs & flux",
    "tab.feuille-route": "Feuille de route",
    "tab.risques": "Risques",
    "drawer.close": "Fermer",
    "drawer.copyLink": "Copier le lien",
    "stage.mature": "Mature",
    "stage.pilote": "Pilote",
    "stage.pre-etude": "Pré-étude",
    "kind.source": "Source",
    "kind.derive": "Dérivé",
    "kind.hypothese": "Hypothèse",
    "state.empty": "Information non disponible à ce stade.",
    "state.notFound": "Contenu introuvable — retour à la vue d'ensemble.",
    "lofi.on": "Mode économie de données",
    "motion.reduced": "Réduire les animations"
  },
  "zh": {
    "nav.tour": "3 分钟引导",
    "nav.print": "提案册 PDF",
    "nav.lang": "切换语言",
    "tab.apercu": "概览",
    "tab.fonctionnement": "运行方式",
    "tab.chiffres": "关键数字",
    "tab.acteurs": "参与方与流向",
    "tab.feuille-route": "路线图",
    "tab.risques": "风险",
    "drawer.close": "关闭",
    "drawer.copyLink": "复制链接",
    "stage.mature": "成熟",
    "stage.pilote": "试点",
    "stage.pre-etude": "预研",
    "kind.source": "来源",
    "kind.derive": "派生",
    "kind.hypothese": "假设",
    "state.empty": "该信息阶段未公开。",
    "state.notFound": "内容不存在，已返回总览。",
    "lofi.on": "省流量模式",
    "motion.reduced": "减少动效"
  }
}
```

#### 5.4.7 口径 QA：T1 `qa[]`（QA-1…QA-7）与技术侧执行清单（TQA）

> **v1.1 复核**：T1 已在 `data-model.json → qa[]` 交付 **7 条**口径矛盾（QA-1…QA-7，含 `uiRuleFR/ZH`、`affectedKpiIds`、`sourceLines`）；`assumptions[]` 独立记录假设（如 AS-1 人口）。前端**不新建 qa 文件**，直接消费 T1 字段。下方 TQA 清单是技术侧执行映射（JSON 为 QA 视图示意，内容以 T1 为准）。

```json
{
  "items": [
    {
      "id": "TQA-01",
      "title": "RIMP 年支付流量与 RIMP 收入不自洽",
      "source": { "lines": [74, 80] },
      "issue": "原文「centaines de milliards de dollars」与 RIMP 收入 90–140 M USD 隐含费率 <0,05 %；BRIEF §7.3-1 建议统一为约 150–250 亿美元/年（Dérivé）。",
      "decision": "采用 data-model.json 的既有决策（CM AD-6）；页面必须显示 Dérivé 徽章与公式，不得伪装 Source。",
      "owner": "Lead + T1",
      "status": "open"
    },
    {
      "id": "TQA-02",
      "title": "2,8 M 钱包与「成年人口一半」不符",
      "source": { "lines": [73] },
      "issue": "世界银行 2025 年 15–64 岁人口 289 万（SP.POP.1564.TO，附录 A.4）；2,8 M / 289 万 = 96,9 %，而 2,8 M / 全国人口 531,5 万 = 52,7 %。",
      "decision": "采用 CM AD-5：按「累计账户（含多账户）」定义，或改写为「≈ 全国人口一半」；不得写「成年人口一半」。",
      "owner": "Lead + T1",
      "status": "open"
    },
    {
      "id": "TQA-03",
      "title": "算力 20–50 MW 与一期 1 MW 口径冲突",
      "source": { "lines": [61, 62, 91] },
      "issue": "L61 写 Phase 1 ≈1 MW（~100 卡）；L91 写「première phase de calcul vert de 20–50 MW」。两者差 20–50 倍。",
      "decision": "CM §06 已给出页面注释（QA-5）：20–50 MW = 绿电项目/园区供电规模；1 MW = 一期 IT 负载。方法学抽屉必须解释，禁止并列展示不加口径。",
      "owner": "Lead + 客户",
      "status": "open"
    },
    {
      "id": "TQA-04",
      "title": "收入分项合计 150–230 ≠ 源文件总计 150–220",
      "source": { "lines": [79, 80, 81, 82] },
      "issue": "30–50 + 90–140 + 30–40 = 150–230 M USD；源文件合计写 150–220。",
      "decision": "展示以源文件总计为准；环形图面积用中点（CM AD-3），方法学注明区间与四舍五入导致不闭合（PLAN §7.4-5）。CI 对 `qa` 关联做提示而非报错。",
      "owner": "T1 + Lead",
      "status": "open"
    },
    {
      "id": "TQA-05",
      "title": "60 %+ 网民口径需与 MAU 同年同口径",
      "source": { "lines": [58, 98] },
      "issue": "2,5 M MAU ÷ 60 % ⇒ 2031 网民约 417 万；世界银行 2024 年互联网用户 45,78 %（≈237 万）。增长需假设，不能在页面并列 2024 渗透率与 2031 份额。",
      "decision": "仅以 Dérivé 展示（公式 2,5 M ÷ 60 %），并标注「2031 假设」；不与 2024 年渗透率同屏对比。",
      "owner": "T1",
      "status": "open"
    },
    {
      "id": "TQA-06",
      "title": "就业三组数字不可并列相加",
      "source": { "lines": [88, 91, 97] },
      "issue": "2–4 k（短期直接/关联）、8–15 k（中长期关联）、30–40 k（五年累计直接+生态）口径不同。",
      "decision": "主数字用 30–40 k（Source）；其余两层在 09/10 分层说明并标口径（BRIEF §7.3-3、PLAN §7.4-3）。",
      "owner": "T1 + T2",
      "status": "open"
    },
    {
      "id": "TQA-07",
      "title": "「数百亿美元」法语原文与统一口径的用词差异",
      "source": { "lines": [74] },
      "issue": "法语原文 « centaines de milliards de dollars » 字面为数千亿美元量级；中文方案采用「约 150–250 亿美元/年」。任何对外法语页面必须用法语统一口径，不能直译原文。",
      "decision": "法语页面统一写 « de l'ordre de 15–25 Md USD/an (dérivé) »，并附方法学；不得保留原文表述。",
      "owner": "T1 + 法语审校",
      "status": "open"
    }
  ]
}
```

#### 5.4.8 TQA ↔ T1 QA 映射（技术执行口径）

| TQA（技术侧） | T1 QA | 技术执行 | 页面呈现 |
|---|---|---|---|
| TQA-01 支付流量 | QA-1 | 统一 `kpi.payment_flow_2031` 派生口径，禁原文表述 | 方法学 + Dérivé 徽章 |
| TQA-02 钱包覆盖 | QA-2 | `kpi.wallets_2031` = 累计账户；渗透率类 KPI 单独显示 | 卡片 + 方法学 |
| TQA-03 算力 MW | QA-5 | 1 MW（一期 IT 负载）与 20–50 MW（绿电项目）分卡 | 06 两卡分开 + 口径注 |
| TQA-04 收入合计 | QA-6 | 图形用中点、显示用区间、禁止两端相加 | 09 图注 + 方法学 |
| TQA-05 网民 60 % | QA-4 | 2,5 M ÷ 60 % = Dérivé，可点方法学 | 09 / 方法学 |
| TQA-06 就业三层 | QA-3 | 三层分卡、不可相加 | 09 / 10 分层标签 |
| TQA-07 算力收入 vs 长期服务收入 | QA-7 | 09 用 2031 收入、10 用长期服务收入，不同屏、不相加 | 两处分别注 |
| TQA-08 人口参考值 | AS-1（≈4,9 M 假设） | 世界银行 2025 为 5,315 M；仅影响渗透率展示，页面不显示人口基数 | 方法学「hypothèse」 |

> 说明：AS-1 的人口假设（≈4,9 M）与世界银行 2025（5,315 M）不一致。若页面展示「钱包 ≈ 全国人口一半」的推导，必须选一个数字并注明来源；建议 T1 更新 AS-1 或改用「账户数」表述（§15 待统一项 U-3）。

### 5.5 校验规则（`validate-content.mjs` / Zod refine；全部为构建期硬失败）

| # | 规则 | 失败信息（给编辑看） |
|---|---|---|
| V01 | 所有 `id` 在同类实体内唯一；跨实体引用（`kpiIds`/`riskIds`/`nodeIds`/`from`/`to`/`seriesId`）必须存在 | « Référence introuvable : kpi.id=xxx » |
| V02 | 每个 KPI 必有 `kind` 与 `source.file/lines`；`kind=derive` 必有 `formula`，且 `inputs[]` 中的 kpi id 存在 | « KPI xxx : source manquante » |
| V03 | 每个 KPI 至少有 `value` 或 `range` 之一；单值 `animate=count`，区间 `animate=slide` | « KPI xxx : valeur manquante » |
| V04 | `displayFR` / `displayZH` 必填且通过格式检查（FR：小数逗号、千位不换行空格、`M/Md/USD` 规范；ZH：万/亿） | « Format FR invalide : 2,500,000 » |
| V05 | 6 条业务线全部存在，`order` 1–6，`stage ∈ {mature, pilote, pré-étude}`；6 tab 所需字段齐全：`definition` / `subModules` / `actorsFR` / `flowIn/flowOut` / `kpiIds` / `risks` | « business-line xxx : tab risques vide » |
| V06 | `businessLines[].id` 与 `pillars[].id` 构成图节点集合；`relations` 中 from/to 必须落在该集合 ∪ `regions[].id` 内；`pillarIds` 引用存在 | « relation node manquant » |
| V07 | `relations` 35 条：`from/to` 合法、`flow` ∈ 五类枚举、`labelFR/labelZH` 非空、`kpiIds` 引用存在；与 CM 的 35 条数量一致（差异需在 qa 中说明） | « edge xxx : flow inconnu » |
| V08 | 14 个区块全部存在且 `order` 0–13 无重复；每个区块 `title` 非空（FR 必填） | « bloc manquant : relations » |
| V09 | `i18n/ui.json` 的 FR 与 ZH 键集合一致（MVP 宽限：ZH 缺失键 ≤5 且带 TODO 标记） | « clé zh manquante : tab.risques » |
| V10 | `qa[]` 的 id 唯一；`assumptions[].affectedKpiIds` 必须存在；页面 QA 徽章引用的 `kpi.*` 存在 | « qa inconnue » |
| V11 | 数字一致性护栏：`kpi.revenue_total_2031` 与三个分项按 QA-6 的展示规则（不把区间两端相加）；`kpi.revenue_gdp_share_2031` 与 `kpi.gdp_current_implied` 一致（150–220 M USD ÷ 11,68 Md USD = 1,28–1,88 %，附录 A.4）；`kpi.wallets_2031` 不与「成年人口一半」绑定（QA-2） | « incohérence numérique : revenue_total » |
| V12 | 法语排版检查（§6.4）：直引号 `"`、缺 `U+00A0/U+202F` 的 `: ; ! ?« »`、hyphen 代 en dash、`N°` 粘连、`%` 前缺空格 | « typographie FR : ligne 42 » |

> 放宽机制：只允许 `--allow-missing-zh`（MVP 前 5 天）与 `--allow-open-qa`（TQA 未决）两个显式开关，且 CI 日志必须打印警告数；不允许绕过 V01–V08、V11。

### 5.6 与 T1 `data-model.json` 的接口映射

| 本文件契约 | T1 实际字段（已交付 `data-model.json`） | 处理方式（adapter） |
|---|---|---|
| `kpis[]` | `kpis[]`：`id`(=`kpi.*`)、`nameFR/ZH`、`valueType`、`value/range/series`、`unitFR/ZH`、`year`、`type`、`displayFR/ZH`、`displayLongFR/ZH`、`chart`、`component`、`animation`、`surfaces`、`sourceLines`、`sourceRef`、`notes` | 直接消费；删除自造的 `kind/source` 结构（映射 `type→kind`、`sourceLines→source.lines`） |
| `series[]` | `kpis[]` 中 `valueType:"series"` 的 `kpi.series.*` | 按 `series:[{year,value}]` 展开 |
| `businessLines[]` | 6 条：`id`（即节点 id）、`stage/stageLabelFR/ZH`、`nameFR/ZH`、`taglineFR/ZH`、`definitionFR/ZH`、`subModules`、`actorsFR/ZH`、`flowIn/flowOut`、`kpiIds`、`risks`、`surfaceIds`、`pillarIds` | 6 tab 由字段组合；无 drawer 对象 |
| `relations` | 35 条有向边（扁平） | 节点由 pillars/businessLines/regions 派生；坐标见 §5.4.4 |
| `roadmap` | `{period, noteFR/ZH, tracks:[{id,nameFR/ZH,colorToken,milestones[]}]}` | 三轨一致；里程碑含 `titleFR/ZH/descriptionFR/ZH/deliverablesFR/ZH` |
| `rimuModules / aiUseCases / risks / stateSupports / layers / transformations` | 同名实体（均平铺 FR/ZH 字段） | 直接消费 |
| `regions` | 6 个（含 `r.nouakchott`） | 地图 + 关系图外部节点 |
| `qa[] / assumptions[] / sources[]` | 7 条 QA、假设、16 条来源 | 方法学抽屉与 ⓘ 展示；**不新建 qa.json** |
| 区块文案 | T1 `meta.blockIds` + CM §2 逐块表格 | 生成 `content/blocks.json`（脚本或人工录入，**不手抄两遍**） |
| `meta.routes` | `#/system`、`#/business/{id}`、`#/pillar/{id}`、`#/rimu/{id}`、`?tour=1`、`?track={id}` | 与 IM §1.1 不完全一致，**以 IM 为准**（§15 待统一项 U-1） |

### 5.7 内容更新流程（非技术编辑可执行）

#### 5.7.1 编辑器方案对比

| 方案 | 成本 | 适合阶段 | 说明 |
|---|---|---|---|
| **A. JSON + GitHub PR + 预览链接**（推荐 MVP） | 0 | 首发–半年 | 编辑改 JSON，CI 校验 + 自动预览；数据负责人审阅合并；法语审校走 PR 评论 |
| **B. Sveltia CMS / Decap CMS（Git-based）** | 0（OAuth Worker ≈0） | 完整体验版后 | 法语界面表单编辑 JSON；字段级校验；需 GitHub OAuth 代理（Cloudflare Worker） |
| C. Google Sheets → JSON 构建脚本 | 低 | 仅数字表 | 表格适合 KPI 复核，不适合长文案；需人工导出，易漂移 |
| D. 传统 CMS（Directus/Strapi） | 中高（服务器/运维） | 不推荐 | 违背 C2（无后端）且本项目内容量小 |

**结论**：MVP 用 A；若客户明确要求「自己在网页后台改」，第二阶段上 B（后端零服务器，内容仍是 Git 里的 JSON，可回滚）。任何情况下 Git 是唯一事实源。

#### 5.7.2 更新工作流

```
编辑改 JSON/表单
   → 提交分支/PR（自动预览链接 https://<hash>.<project>.pages.dev）
   → CI：schema 校验（V01–V12）+ 法语排版 + 截图差异
   → 审阅：数据负责人（数字/来源）+ 法语审校（文案）
   → 合并 main → Cloudflare Pages 自动发布 → 重新生成 PDF（CI，版本号更新）
   → 页脚与 PDF 封面显示「Version 2026-11-09 · contenu v1.2.0」
```

#### 5.7.3 五个常见操作（写进 CONTENT-GUIDE.md，配截图）

| # | 操作 | 改动文件 | 预计耗时 | 注意 |
|---|---|---|---|---|
| 1 | 改一句话（标题/副标题/卡片文案） | `content/blocks.json` 或 `data-model.json` | 5 分钟 + CI | FR 必填；改完看法语排版 CI |
| 2 | 改一个数字（含 2031 KPI） | `data-model.json → kpis[]` | 10 分钟 | 必带 `source.lines`/`verifiedAt`；改 `displayFR/displayZH`；跑 `check:content` |
| 3 | 改业务线抽屉某 tab | `data-model.json → businessLines[].drawer` | 15 分钟 | 6 tab 不得删；空内容走空态 |
| 4 | 换 PDF/OG/联系信息 | `content/site.json`、重新生成 `public/og/` | 15 分钟 | OG 1200×630 ≤140 KB；联系方式公开前确认（CM AD-7） |
| 5 | 新增一条业务线 | `businessLines` + `kpis` + `relations` + `blocks` | 2–4 小时 | id/枚举固定；需设计评审布局；组件不改（BRIEF §9） |

#### 5.7.4 内容冻结与版本

- **内容冻结（D1）**：MVP 开发前锁定 14 区块 FR 终稿 + 6 业务线 6 tab + 全部 KPI；冻结后数字只能走「来源补正 + QA 记录」流程。
- **版本号**：构建时注入 `contentVersion`（package.json 版本 + git short SHA + 日期），页脚与 PDF 封面显示；每次发布记 `CHANGELOG.md`。
- **复核周期**：Source 类数字随源文件版本复核；Hypothèse 类每季度复核（PLAN §9.5）；页脚显示「Dernière mise à jour」。

## 6. i18n、locale 格式与 RTL 预留

### 6.1 语言与路由策略

| 项 | 决策 | 理由 |
|---|---|---|
| 默认语言 | **FR 在根路径 `/`**；`/fr/` 301 → `/`` | 最短分享链接；OG/二维码稳定；法语是政府与投资方主语言 |
| 第二语言 | **ZH 在 `/zh/`**；语言切换保留 `location.hash` 与 `search` | IM §1.1 规则 7：切换不丢抽屉/区块上下文 |
| 阿语 | `/ar/` 占位（`<meta name="robots" content="noindex">`），第二期上线 | BRIEF §8「第二期」；README §3 无官方阿语名称 |
| 自动跳转 | **不做** Accept-Language 自动重定向；仅首次访问可显示一次性语言条（可关闭，不遮内容） | 自动跳转破坏分享链接与 SEO；政府场景常为双语混用 |
| hreflang | `fr` ↔ `zh` ↔ `x-default`（FR）；AR 上线后追加 | sitemap 同步输出 alternates |
| canonical | 每语言自我 canonical（`https://www.aureondigital.mr/`、`…/zh/`） | 避免重复内容 |
| 客户端切换实现 | 首选「**原地切换**」：按需 fetch `/_data/{locale}/*.json`（≈25–40 KB gzip）→ 更新文本/数字/aria → 更新 `html lang`；失败则回退整页导航到对应语言路由 | 保留抽屉状态（IM 规则 7），同时不把双语内容全塞进首包 |
| §title 动态 | 抽屉打开时更新 `document.title`：`{name} · AUREON × RIMU`（IM 规则 10），关闭还原 | 分享/历史记录可读 |

### 6.2 文本、数字、界面词典三分离

| 层 | 位置 | 示例 | 谁维护 |
|---|---|---|---|
| 内容文案（叙述） | `data-model.json` / `content/blocks.json` 内的 `{fr,zh}` | 区块标题、业务线 6 tab 文案 | T1 + 法语审校 |
| 数据（数字 + 冻结展示串） | `data-model.json → kpis[]` 的 `value/range + displayFR/displayZH` | `2,5 M` / `250 万` | T1 + 数据负责人 |
| 界面词典（按钮/标签/aria/空态） | `i18n/ui.json` | `Fermer` / `关闭` | 前端 + T1 译文 |

**禁止**：前端用字符串拼接生成句子（语序在 FR/ZH 不同）；需要变量时用词典占位符 `{name}` 并在 `i18n.ts` 统一替换；数字一律用冻结串，禁止 `value.toLocaleString()` 直接上线。

### 6.3 locale 数字/日期格式（生产规范 + 实测 Intl 输出）

| 项目 | FR（fr-FR） | ZH（zh-CN） | 说明 |
|---|---|---|---|
| 千位分隔 | U+202F（窄不换行空格） | 中文万/亿单位（不分组） | `2 500 000` → `2,5 M` / `250 万` |
| 小数 | 逗号 `,` | 点 `.` | `1,3 %` / `1.3%` |
| 区间 | en dash `–`（无空格） | en dash `–` | `150–220 M USD` / `1.5–2.2 亿美元` |
| 百分号 | 前置 U+202F：`1,3 %` | 紧跟：`1.3%` | 避免换行断行 |
| 货币 | `150–220 M USD`（M=百万，Md=十亿） | `1.5–2.2 亿美元` | 币种后置；MRU 用 `ouguiya` 或 `MRU` |
| 日期 | `9 novembre 2026`（月小写） | `2026年11月9日` | 用 `Intl.DateTimeFormat` 生成 |
| 年份区间 | `2026–2031` | `2026–2031`（可加「年」在后） | 不与「年」粘在单年上 |
| 时长 | `40 min/jour` | `日均 40 分钟` | 词典化 |
| 短式大数 | `2,5 M` / `800 k` / `1,2 Md` | `250 万` / `80 万` / `12 亿` | 冻结串；不现场换算 |

**代码规范（构建期生成 display 串 + 客户端仅动画格式化）**

```ts
// src/lib/format.ts
const CACHE = new Map<string, Intl.NumberFormat>();
function nf(locale: "fr" | "zh", opts: Intl.NumberFormatOptions) {
  const key = locale + JSON.stringify(opts);
  if (!CACHE.has(key)) CACHE.set(key, new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "zh-CN", opts));
  return CACHE.get(key)!;
}
// 客户侧：计数器动画帧使用（最终帧必须替换为 JSON 冻结串）
export function formatCount(value: number, locale: "fr" | "zh"): string {
  if (locale === "zh") {
    if (value >= 1e8) return (value / 1e8).toFixed(2).replace(/\.?0+$/, "") + " 亿";
    if (value >= 1e4) return (value / 1e4).toFixed(1).replace(/\.0$/, "") + " 万";
    return nf("zh", { maximumFractionDigits: 0 }).format(value);
  }
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, "").replace(".", ",") + " Md";
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, "").replace(".", ",") + " M";
  return nf("fr", { maximumFractionDigits: 0 }).format(value); // fr-FR 千位为 U+202F
}
```

> 生成规则：`displayFR/displayZH` 由 `scripts/gen-display.mjs` 从 `value/range/unit/year` 生成一次并写入 JSON；CI 校验两者与数值一致（V04）。客户端计数器只在动画中用 `formatCount`，结束帧替换为冻结串，确保与 PDF/共享卡片完全一致。
> 排版：数字区域 `font-variant-numeric: tabular-nums`；法语文本启用 `hyphens: auto`（需正确 `lang="fr"`），标题禁用连字符换行。

### 6.4 法语排版生产规则（CI 可检查）

依据 `research/french_copy.md` 既有规则 + CM §0.3，写进 `check-typography.mjs`：

| # | 规则 | 错误示例 | 正确 |
|---|---|---|---|
| F01 | 直引号 `"` 禁止，法语用 « »（内侧 U+00A0） | `"exemple"` | `« exemple »` |
| F02 | 撇号用 `’`（U+2019） | `l'Afrique` | `l’Afrique` |
| F03 | `: ; ! ?` 前用不换行空格（U+202F，兼容 U+00A0） | `Tél :` 错粘 | `Tél. :` |
| F04 | `%` 与数字间用 U+202F | `1,3%` | `1,3 %` |
| F05 | 千位用 U+202F；不用逗号/点分组 | `2,500,000` | `2 500 000` |
| F06 | 区间用 en dash `–`，不用 hyphen | `150-220` | `150–220` |
| F07 | `n°` 小写 n + 上标 o + 不换行空格 | `N°32B` | `n° 32B` |
| F08 | 大写带重音；`numérique` 不用 `digital`；`sino-mauritanien` 小写 | `SOUVERAINETE` | `SOUVERAINETÉ` |
| F09 | 不用直角引号/双空格/行尾空格；标点后单空格 | `a  b` | `a b` |
| F10 | 专名保留：RIMU / RIMP / RIMU Shop / hassaniya / peul / soninké / wolof / Nouakchott | — | — |

### 6.5 阿拉伯语 RTL 预留（第二期，成本 +20–25 %）

**现在就要做的（零成本）**：
1. CSS 只用逻辑属性：`margin-inline-start`、`padding-inline`、`inset-inline-end`、`border-inline-start`；禁止 `left/right` 硬编码（打印样式除外）。
2. `<html lang dir>` 始终输出；`dir="ltr"` 显式声明。
3. 图标/箭头方向用 `[dir="rtl"] .icon-arrow { transform: scaleX(-1) }` 预留。
4. 字体 token 预留 `--font-ar`（二期加载 Noto Naskh Arabic 子集，估 90–150 KB woff2）。
5. 排版时间轴/关系图方向可镜像（数据不变，仅渲染方向），在组件里预留 `data-dir`。
6. 翻译流程：宣誓译员（README §3）；阿语名称未定前不上线；`/ar/` 保持 `noindex`。

**二期任务清单（估算）**：阿语字库与排版 3 人日；RTL 镜像与回归 4 人日；翻译与审校 5 人日；QA 2 人日 ≈ 14 人日（与 PLAN 决策 #1 的 +25 % 一致）。

### 6.6 SEO / 分享元数据（i18n 维度）

| 项 | FR | ZH | 规则 |
|---|---|---|---|
| `<title>` | `Plateforme de coopération numérique sino-mauritanienne — AUREON × RIMU` | `中毛数字合作平台 — RIMU · AUREON` | ≤60 字符（FR）|
| `description` | 1 句，含三支柱与 2031 关键数字（来自冻结串） | 对应中文 | ≤160 字符 |
| `og:locale` | `fr_FR` | `zh_CN` | `og:locale:alternate` 互指 |
| `og:image` | `/og/fr-default.png` 1200×630 | `/og/zh-default.png` | ≤140 KB；另有业务线变体（IM 规则 10） |
| JSON-LD | `Organization` + `WebSite`（AUREON DIGITAL SARL，联系信息取 README §3 并标注待确认） | 同 | 不用 `GovernmentOrganization` 假装官方；不用虚假 rating |

---

## 7. 性能预算、字体与降级

### 7.1 预算表（gzip；BRIEF 硬上限 1,5 MB 为 JS+CSS+HTML+图，字体另计）

| 资源 | 预算（gzip） | 依据 / 现状 |
|---|---|---|
| HTML（FR 主页，含 14 区块与 SSR 数字） | ≤80 KB | 估算（Hypothèse）：内容约 2,5–3 万字符 + 标记；构建后实测 |
| CSS（1 文件，关键内联 ≤14 KB） | ≤35 KB | 设计 token + 组件 + 打印样式（打印 CSS 单独异步加载不影响首屏） |
| 初始 JS（app.js） | ≤18 KB | 路由/抽屉/IO/计数器/词典（原生 TS） |
| 动效 chunk（GSAP+ST+Lenis） | ≤55 KB | 实测 45,4 + 5,3 + 封装 |
| 图表 chunk（09/08） | ≤16 KB | 手写 SVG |
| 关系图 chunk | ≤10 KB | 手写 + 内联坐标 |
| 字体（FR，5 文件子集） | ≤120 KB woff2 | §7.2 + T2 visual-system §4 |
| 图片（首屏） | ≤30 KB | Hero 背景/线稿为 SVG；无位图照片 |
| 图片（整页） | ≤160 KB | 地图 SVG ≤45 KB + 手机 mockup（DOM 绘制）+ OG 不在页面加载 |
| 第三方脚本 | 0 KB（分析端点约 1–2 KB 自托管） | IM §1.11 |
| **首屏关键路径合计** | **≤220 KB** | HTML+CSS+首屏字体+app.js+首屏 SVG |
| **整页首次访问（FR 含字体）** | **≤500 KB** | 远低于 BRIEF 1,5 MB 上限 |
| **整页首次访问（ZH 含字体）** | **≤750 KB**（启用可选正文子集时 ≤950 KB） | ZH 字库仅在 `/zh/` 加载（§7.2） |

### 7.2 字体策略：自托管 + 构建期子集 + 条件加载

**实测基线（Google Fonts CSS 全量 woff2，2026-11-09，附录 A.2）**

| 字体 | 全量 woff2 | 切片数 | 覆盖码点 | 推导单字成本 |
|---|---|---|---|---|
| Noto Sans SC 400 | 2,30 MB | 101 | 16 283 | ≈148 B/字 |
| Noto Serif SC 400 | 3,03 MB | 101 | 16 283 | ≈195 B/字 |
| Inter 400/600（含全部子集） | 437 KB | 14 | 5 014 | latin 每字重 ≈47 KB |
| Playfair Display 400/600 | 179 KB | 8 | 3 532 | latin 每字重 ≈37,5 KB |

**结论与预算（Dérivé：按实际用字子集估算，构建后以实测替换）**

| 语言包 | 文件 | 子集策略 | 预算 |
|---|---|---|---|
| FR | Playfair Display 400/500 + italic 400（展示/引文）、Nunito Sans 400/600（正文/UI，Inter 为回退）；每字重 1 个 latin+latin-ext woff2 | `pyftsubset --text-file=fr-charset.txt --flavor=woff2`（含数字、« »、–—、`€ %`、法语重音与 œ） | **≤120 KB**（T2 visual-system §4 预算；实测 latin 每字重 18–24 KB 子集） |
| ZH | Noto Serif SC 500 子集（标题/引句用字 ≤450 字）+ 正文走系统 CJK 字体栈（PingFang SC / 微软雅黑 / Noto CJK，不下载）；可选高频正文字集（≤1 500 字）作一致性增强 | 标题字集从 `content/blocks.json` 抽取；`pyftsubset` 保留字体特性 | 标题 **≤90 KB**；可选正文 +180 KB；**仅 `/zh/` 加载** |
| AR（二期） | Noto Naskh Arabic 子集 | 独立加载 `--font-ar` | ≤150 KB |

**实施规则**：
1. 不用 Google Fonts / 任何第三方字体 CDN（大陆访问不稳定且为额外第三方；BRIEF C1 首包可控）。
2. **系统字体只作本机增强**：T2 字体栈把 Didot / Avenir Next / Minion Pro 放在首位（Mac 用户首屏更快看到品牌字体），但**跨设备一致性由 webfont 保证**。依据：现有 `presentation/index.html` **没有任何 `@font-face`**（实测 0 处），依赖 macOS 字体 → Windows/Android/微信内回退不可控，网页与 PDF 必须统一 webfont（ADR-06）。
3. `font-display: swap` + `size-adjust`/`ascent-override` 校准 fallback，CLS 目标 0；Hero 标题字体 `preload`（仅 1 个文件），其余 `preload` 禁止。
4. 中文采用 `font-family: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`；缺字回退可见但不破版。
5. 构建脚本 `subset-fonts.mjs` 输出 `fonts/{locale}-{family}-{weight}-{hash}.woff2` 与对应 `@font-face` CSS（`font-display: swap`、`unicode-range` 精准）；字数超预算 → CI fail 并提示「内容增长导致字体超预算」。
6. **不做 CJK 全量字体**：实测 Noto Sans SC 全量 2,30 MB / 16 283 码点证明全量不可行；ZH 采用「标题子集 + 系统正文」；若客户要求 ZH 在所有设备像素级一致，再加可选高频正文字集（≤180 KB），ZH 页面预算上调至 ≤950 KB（仍在 FR 的 2 倍以内）。

### 7.3 图片、SVG 与媒体

| 类型 | 规范 |
|---|---|
| 图片 | MVP 不用照片（BRIEF §6 禁止无授权照片）；RIMU 手机界面用 DOM/SVG 绘制（IM A-06）；如客户提供授权照片，转 AVIF（主）+ WebP（备）+ `srcset`/`sizes`，单张 ≤80 KB，全部 `loading="lazy" decoding="async"` |
| 背景 | 用 CSS 渐变/radial/repeating + 极淡 guilloche SVG（≤10 KB），**禁止**把 `assets/bg/*.png`（3,6–4,1 MB/张，实测）直接上网页 |
| Logo | `assets/logo-mark.svg` 原始 83,8 KB / 346 path / gzip 31,4 KB（实测）；网页版用 SVGO 简化 + 去冗余 path 目标 ≤12 KB gzip；用 `<symbol>` sprite 引用一次，**不内联 32 次**（presentation 实测重复 32 次导致 HTML 2,84 MB） |
| 地图 | 5 国简化 GeoJSON → SVG（≤45 KB gzip），手工简化海岸线；提供列表替代 |
| 图标 | 1,5 px 线性 SVG，合并为 1 个 sprite（≤15 KB） |
| OG 图 | 1200×630 PNG（微信/WhatsApp/Slack 通用）+ WebP 变体；≤140 KB；构建期合成（sharp + 品牌字体子集） |
| favicon | `icon.svg` + `apple-touch-icon` 180×180 + `theme-color` #071C36（≤10 KB） |

### 7.4 加载与三档模式

| 模式 | 触发 | 差异 |
|---|---|---|
| `full` | 默认 + `prefers-reduced-motion: no-preference` + 非 saveData + 视口 ≥1024 | 全部动效、Lenis、手机自动演示、关系图粒子 |
| `standard` | 移动端 / `hardwareConcurrency ≤4` / 弱网 | 无粒子、无 Lenis、手机演示不自动播放、SVG 静态 |
| `lite` | `?lite=1` 或 `saveData` 或 `effectiveType∈{slow-2g,2g}` | 不加载 GSAP/Lenis/图表 JS；单列布局；图表静态 SVG；字体仅加载 1 个 FR 字重；页面 ≤150 KB gzip；提供切换按钮 |
| 手动开关 | 页脚「Réduire les animations」「Mode économie de données」 | 写 `localStorage` 与 `html[data-*]`，IM §0.6 |

**通用加载规则**：`<script defer>` 首包只含 app.js；`preload` 只给 Hero 字体与关键 CSS；`prefetch` 在 `requestIdleCallback` 中预热 charts/relations chunk；图片/图表的占位容器固定宽高比防 CLS；`content-visibility: auto` 用于首屏以下区块（配 `contain-intrinsic-size`）。

### 7.5 Core Web Vitals 与 3G 数学

**3G 档定义（预算口径）**：下行 1,6 Mbps（=200 KB/s）、上行 750 kbps、RTT 300 ms、冷缓存 —— 即 Chrome DevTools「Slow 4G」档，作为 BRIEF「3G <3 s」的工程化定义。

**首屏预算推导（Dérivé）**：
- 关键路径 220 KB ÷ 200 KB/s ≈ 1,1 s 传输
- 3 个 RTT（HTML/CSS/字体+JS 并行算 2–3 次）≈ 0,9 s
- 服务端 TTFB（Cloudflare 边缘）≤0,2 s；解析+首帧 ≤0,3 s
- **LCP ≈ 2,2–2,5 s；可交互（app.js 执行）≈ 2,6–2,9 s < 3 s** ✅
- 若启用 lite 模式（≤150 KB，无 GSAP）：≈2,0–2,3 s。

| 指标 | 目标（lab，移动 3G 档） | 目标（field p75） | 监控 |
|---|---|---|---|
| LCP | **< 3 s**（BRIEF 硬指标）；目标 <2,5 s | <2,5 s | Cloudflare Web Analytics CWV / Lighthouse CI |
| INP | < 200 ms | <200 ms | RUM（自建事件端点可选上报 web-vitals 轻量库；或仅 lab 验收） |
| CLS | < 0,05（字体/图表占位） | <0,1 | Lighthouse CI |
| TTFB | < 0,8 s | <0,8 s | UptimeRobot + CF 分析 |
| FCP | < 1,8 s | — | Lighthouse CI |
| Lighthouse mobile | 性能 ≥85；a11y ≥95；最佳实践 ≥95；SEO ≥95 | — | CI 门禁 |
| 主线程长任务 | 无 >50 ms（IM §1.10） | — | PerformanceObserver（仅 full 模式审计） |

### 7.6 低带宽与省流量细节（毛里塔尼亚现场）

1. **数据成本**：ISOC Pulse 2026 显示 3G 低消费套餐约 1,47 % GNI（2025），移动均值 44,21 Mbps 但覆盖与资费不均；页面必须对「1 GB 月流量用户」友好：首访 ≤500 KB（FR），ZH 用户首次切中文才加载字库。
2. **默认 360p/480p**（RIMU 产品叙事）不在网页加载任何视频；手机演示为 DOM/CSS。
3. **省流量模式**：隐藏所有非必要装饰 SVG（guilloche 纹理）、图表不绘制动画、字体只加载 1 字重、不加载 charts.js（图表已是静态 SVG）。
4. **离线/U 盘演示**：整个 `dist/` 可本地 `file://` 打开（无绝对路径、无 fetch 依赖；抽屉数据用构建期内联或相对路径 fetch），支持会议无网场景（PLAN §9.1）。注意：`file://` 下 fetch 受 CORS 限制 → drawer 数据必须内联在 HTML 或经 `<script type="application/json">` 提供，见 §8.2。

## 8. 打印 / PDF：同一 DOM 的 A4 横向提案册

### 8.1 路径选择

| 方案 | 版式可控 | 成本 | 适用 | 决策 |
|---|---|---|---|---|
| 浏览器 `Ctrl/Cmd+P`（主页面 `@media print`） | 中（分页流动） | 0 | 访客自行打印、后备 | **保留**（满足 BRIEF「同一 DOM」） |
| 专用打印视图 `/fr/dossier/`（固定 sheet，屏幕可预览） | 高 | 1–2 人日 | 客户/会议正式提案册 | **采用**（ADR-08，与 PLAN §9.1 的 dossier 路由一致） |
| 访客浏览器生成 PDF | 低（字体/背景依赖本机） | 0 | 不采用 | 仅兜底 |
| CI 用 Playwright 生成 PDF | **最高且可复现** | 0（复用既有 Chrome+Playwright） | 官网下载的正式 PDF | **采用** |
| 服务端按需 PDF（Worker + Browser Rendering） | 高 | 付费 + 冷启动 | 个性化定制（二期） | 本期不做（§8.6） |

> 结论：**同一份 JSON/组件 + 两种呈献**：① 主页面 `@media print` 直接打印；② `/fr/dossier/` 固定版心视图，由 CI 渲染为 PDF，页面「Dossier PDF」按钮直接下载。两者都不复制文案（BRIEF §5、IM A-09）。

### 8.2 主页面打印模式（`@media print`，零 JS 可用）

规则（写入 `src/styles/print.css`，异步加载，不影响屏幕首屏）：
1. `@page { size: A4 landscape; margin: 0; }`；所有交互外壳（header/rail/drawer/tour/CTA/返回顶部/语言切换）`display:none`。
2. 每个区块 `break-before: page`；卡片/表格/图表 `break-inside: avoid`；标题 `break-after: avoid`；避免孤行寡行（`orphans/widows: 3`）。
3. 所有折叠内容强制展开：`details[open]` 语义 + JS `beforeprint` 钩子把 `[data-state="closed"]` 置为展开态；打印完成后恢复（`afterprint`）。
4. 暗色区块打印转「象牙白底 + 深蓝字 + 金色线」，仅封面/章节页保留深色（省墨、办公室打印机友好）。用 `print-color-adjust: exact` 保证背景色打印（浏览器需勾选「背景图形」，页面提示）。
5. 图表输出终态静态 SVG；tooltip 内容转脚注编号（IM 打印要求）；每页页脚由 CSS `position: fixed` 重复「AUREON DIGITAL · 文档非合同 · Source/Méthode」。
6. 链接不展开 URL（`a::after { content: none }`），改用二维码回网页（§8.4）。
7. 抽屉当前 tab 的内容：若打印时抽屉打开，仅打印其内容到附录（IM §3.10）；默认打印不包含抽屉。

### 8.3 专用打印视图 `/fr/dossier/`（固定 sheet，18 页）

屏幕预览：`?print=1` 显示等比缩放的 sheet（便于客户在浏览器里「翻册」）；打印/PDF：每 sheet 297×210 mm、`overflow: hidden`、`break-after: page`（**沿用 `presentation/index.html` 已验证的固定页模型**：`@page size 297mm 210mm`、`.page width/height + overflow hidden + page-break-after`，实测 14 页 PDF 由 `render/render_deck.js` 生成）。

| sheet | 内容 | 来源区块 | 备注 |
|---|---|---|---|
| p01 | 封面：主标语 + 三支柱 + 日期版本 + QR | Hero | 深色 |
| p02 | 摘要：三支柱 + 4 个 2031 KPI + 五幕目录 | 00–02 | 深色 |
| p03 | Le constat：4 问题 + 前后对比 | 01 | 象牙白 |
| p04 | Vue système：三支柱+六业务+四层总图 | 02 | 深色 |
| p05 | Trois piliers：3 卡 + 每卡 3 KPI | 03 | 象牙白 |
| p06–p07 | Six filières：6 卡（每页 3 卡）+ 状态徽章 | 04 | 象牙白 |
| p08–p09 | RIMU：产品界面 + 8 模块 + 治理徽章 | 05 | 深色 |
| p10 | Quatre couches + AI 用例（3 组全展开） | 06 | 深色 |
| p11 | 算力三期 + 电力/主权 + QA-5 口径注 | 06 | 深色 |
| p12 | Cinq flux：关系图 + 图例 + 流说明表 | 07 | 深色 |
| p13 | Feuille de route：三轨时间轴 | 08 | 象牙白 |
| p14 | Chiffres 2031：7 KPI + 收入图 + 就业三层 + 方法学脚注 | 09 | 深色 |
| p15 | Bénéfices：短/中长/结构 + 西非地图 + 8 国流向 | 10 | 象牙白 |
| p16 | Cinq soutiens à l'État + 6 个月交付 | 11 | 象牙白 |
| p17 | Risques & garanties + 治理 | 12 | 象牙白 |
| p18 | Next steps 30/90 天 + 联系 + 二维码 + 来源声明 | 13 | 深色 |

分页验收：每 sheet 的 FR 文案上限约 90–120 词（设计稿给定），CI 用溢出检测（§8.5）；页数 18 ± 0（MVP 的浏览器打印自然流式版本允许 18–24 页）。

### 8.4 二维码（构建期生成）

- 工具：`qrcode` 1.5.4（MIT，devDependency）→ 输出 SVG（≤4 KB/个）。
- 目标：封面 1 个总入口 + 每张业务线 sheet 1 个深链（`…/?src=pdf#/business/{id}`），共 ≤8 个；页脚统一放小号总入口。
- 规格：边长 22–26 mm、纠错等级 M、静区 4 模块、深蓝 `#071C36` 码点 + 象牙白底、**不反白**；最短 URL（去掉多余路径）；打印后手机 30 cm 可扫（验收 §11.3）。
- 扫码归因：`?src=pdf` 由 `analytics.ts` 作为来源参数上报（聚合、无 cookie）。

### 8.5 PDF 生成管线（复用既有 Playwright/Chrome）

```js
// scripts/build-pdf.mjs（要点；结构与 render/render_deck.js 一致）
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1122, height: 794 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:4321/fr/dossier/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);            // 字体就绪再出 PDF
const overflow = await page.evaluate(() => [...document.querySelectorAll('.sheet')]
  .map((s, i) => ({ i, o: s.scrollHeight > s.clientHeight + 1 || s.scrollWidth > s.clientWidth + 1 }))
  .filter((x) => x.o));                                     // 溢出检测 → CI fail
await page.pdf({
  path: 'export/pdf/AUREON_RIMU_Proposition_A4_FR.pdf',
  width: '297mm', height: '210mm',
  printBackground: true, preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  tagged: true,                                             // 可访问 PDF（Playwright 1.65 支持）
});
```

- **页码**：固定 sheet 模型 → 构建期在每 sheet 页脚写死「03 / 18」，不依赖浏览器页边距框（Chromium 不支持 @page margin boxes；Playwright `footerTemplate` 无法使用品牌字体，因此不用）。
- **PDF 规格**：A4 横向（297×210 mm）、≤6 MB、字体子集嵌入、文档标题/语言元数据来自 HTML；中文版单独生成 `/zh/dossier/`。
- **发布**：构建产物放 `public/proposition-aureon-rimu.pdf`（固定文件名便于印刷/转发），版本化副本 `/pdf/v{version}/…pdf` 保留 12 个月；页脚版本号与 PDF 一致。
- **CI 验收**：页数 = 18；每 sheet 无溢出；关键 sheet 截图与基线 diff（阈值 0,2 %）；QR 解码测试（`jsQR` 读回 URL 等于预期）；字体嵌入检查（`pdffonts` 可用时）。

### 8.6 可选服务端 PDF（二期评估，不阻塞本期）

- 场景：客户在现场输入机构名生成定制封面 PDF。
- 方案：Cloudflare Worker + Browser Rendering（付费）或 GitHub Action 定时生成；冷启动 3–8 s，需排队与缓存。
- 结论：本期用 CI 生成的静态 PDF 即可满足「下载/打印/扫码回网页」三种需求；定制 PDF 列入 v2 需求池。

### 8.7 与 `presentation/index.html` 的经验对齐

| 项 | 既有 deck（实测） | 本方案改进 |
|---|---|---|
| 页面模型 | 14 页固定 297×210，`overflow:hidden`、`page-break-after`、`print-color-adjust: exact` | 沿用；新增 `tagged` PDF、页脚版本、CI 溢出门禁 |
| 字体 | 无 `@font-face`，依赖 macOS Didot/Avenir Next（跨设备不可复现） | 统一 webfont 子集，屏幕与 PDF 同形 |
| HTML 体积 | 2,84 MB 原始 / gzip 1 037 KB / brotli 41,5 KB；logo 路径重复 32 次 | logo 外链 sprite（≤12 KB gzip）；HTML 目标 ≤80 KB gzip |
| 生成方式 | `render/render_deck.js`：Chrome + Playwright，297×210、`preferCSSPageSize`、`fonts.ready`+600 ms | 复用同一模式，改为 `build-pdf.mjs` + 溢出/页数/QR 自动验收 |
| 二维码 | 无 | 封面 + 每业务线 sheet + 页脚 |

---

## 9. 部署与运维

### 9.1 托管选型

| 平台 | 免费额度（2026-11 官方口径） | 优势 | 结论 |
|---|---|---|---|
| **Cloudflare Pages** | 500 builds/月、20 000 文件、单文件 25 MiB、构建 20 min 超时、100 自定义域名；静态请求不限量（以官方计费页为准） | 全球 CDN、自动 Brotli/HTTP3、部署历史一键回滚、预览部署、免费 SSL | **采用** |
| Vercel | 100 GB/月带宽；商业用途免费计划限制条款 | 体验好 | 备选（迁移成本 1 人日） |
| Netlify | 100 GB/月 | 表单/身份功能 | 不需要 |
| GitHub Pages | 100 GB/月软限、1 GB 仓库 | 零成本 | 无预览部署/无自定义 headers 不足 |
| 阿里云 OSS / 腾讯 COS | 按量（香港/新加坡区无需 ICP） | 中国访问可能更快 | 仅作镜像备选（§9.4） |

### 9.2 域名 / DNS / HTTPS

| 项 | 决策 |
|---|---|
| 主域名 | `www.aureondigital.mr`（README §3 既有）；apex `aureondigital.mr` 301 → `www` |
| 注册商 | 由客户现有 `.mr` 注册商（NIC.MR/Mauritel 渠道）管理；本方案不改注册商，只改 DNS |
| DNS | Cloudflare（免费）；开启 DNSSEC；域名到期提醒（提前 60/30/7 天） |
| HTTPS | Cloudflare Universal SSL（边缘证书）；TLS 1.2+；HSTS `max-age=31536000; includeSubDomains`（稳定 3 个月后再加 `preload`）；CAA 限制签发 |
| 邮件 | 保持现状（Gmail/企业邮箱不动 MX，避免影响现有通信）；如需公司邮箱另立项 |
| 预览环境 | PR 自动预览（`<hash>.<project>.pages.dev`）；不索引（`X-Robots-Tag: noindex`） |
| 安全头 | §9.6 |

### 9.3 毛里塔尼亚访问

- Cloudflare 最近 PoP 为卡萨布兰卡/达喀尔/拉各斯等（Hypothèse：从努瓦克肖特 RTT 约 30–80 ms，需实测）。ACE 海缆与三家移动运营商（Mauritel / Chinguitel / Mattel）覆盖；页面需在 3G 与高延迟下验证（WebPageTest 卡萨布兰卡/达喀尔节点 + 真机）。
- 静态资源 `immutable` 长缓存 + HTML 短缓存；第二次访问 ≤50 KB（仅 HTML 与版本指针）。
- 移动端优先：390×844 为验收基准（IM §0.3）；避免 `100vh` 陷阱，使用 `svh/dvh` + `visualViewport`。

### 9.4 中国访问策略（必须提前告知客户）

**事实**：
1. Cloudflare 免费/Pro 计划**没有中国大陆节点**；要进大陆必须 Cloudflare China Network 套餐（需 Enterprise + 中国网络许可，官方文档 2026-04-17 核对）。
2. 中国大陆 CDN 需要 **ICP 备案**，备案主体须为中国境内企业/组织；AUREON 为毛里塔尼亚 SARL，不具备条件。
3. 第三方资源（Google Fonts 等）在大陆不可靠 → 本方案已全部自托管（ADR-06）。

**结论**：不做大陆节点，不承诺大陆访问速度。分层兜底：
| 层级 | 措施 | 成本 |
|---|---|---|
| L1（默认） | 页面 ≤500 KB、无第三方脚本、HTTP3/Brotli；PDF 可直接微信转发 | 0 |
| L2（可选镜像） | CI 每次发布同步 `dist/` 到腾讯 EdgeOne Pages / 阿里云 OSS **香港或新加坡** 区域，域名 `cn.aureondigital.mr`（无需 ICP，因为非大陆节点）；主站页脚提供「镜像入口」，**不做自动跳转** | ≈0–50 元/月 |
| L3（会议/客户场景） | PDF + PPTX 离线包 + 微信文件传输；二维码指向主站（境外可访问） | 0 |
| L4（若客户坚持大陆原生） | 需中方合作方主体备案 + 大陆云托管（超出本期范围，另立项） | 高 |

> 验收：从北京/上海/深圳各测 3 次（17ce/boce + 真机），记录 TTFB/LCP；若 p75 LCP >5 s，启用 L2 镜像。此策略写入 RUNBOOK 与客户沟通材料。

### 9.5 发布、版本与回滚

1. 分支模型：`main` = 生产；功能/内容走 PR；内容编辑也可直接在 GitHub 网页改 JSON（小改动）→ PR → CI → 预览 → 合并。
2. 发布检查单（10 项）：CI 全绿、法语审校签字、数据负责人确认、PDF 重新生成且页数 18、OG 图更新、sitemap/hreflang、404、隐私声明、版本号/日期、客户确认链接。
3. 版本：`v1.0.0` 起 tag；页脚显示 `Version 2026-11-09 · contenu v1.2.0`；`CHANGELOG.md` 记录。
4. 回滚：Cloudflare Pages 部署历史一键回滚（秒级）；同时 `git revert` 保证源码一致；回滚后自动重发 PDF。
5. 产物存档：每次发布把 `dist.zip` + PDF + `git bundle` 上传 Cloudflare R2（或客户指定网盘），保留 12 个月；每日内容 JSON 已在 Git 中，无需数据库备份。

### 9.6 缓存与安全头（`public/_headers` 示例）

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'sha256-REPLACE_IN_BUILD'; connect-src 'self' https://analytics.aureondigital.mr; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/index.html
  Cache-Control: public, max-age=0, must-revalidate
```

- CSP 的 inline script 哈希由构建脚本生成并替换（Astro 内联 JSON/主题脚本）；MVP 若 hash 维护成本高，允许 `style-src 'unsafe-inline'`（Astro 内联样式）但 `script-src` 必须严格；记入技术债。
- `public/_redirects`：`/fr/* /:splat 301`、`/dossier.pdf /proposition-aureon-rimu.pdf 302`、旧路径 → 新路由。
- 不做 PWA/Service Worker（MVP）：避免「客户看到旧版本」的缓存事故；静态 CDN 已满足离线阅读的 90 % 场景（§7.6 的 U 盘包另行提供）。

### 9.7 分析、隐私与合规

| 项 | 方案 |
|---|---|
| 页面分析 | Cloudflare Web Analytics（免费、无 cookie、无指纹、提供 CWV），domain 绑定；不采集跨站 |
| 事件分析 | 自建 Cloudflare Worker 端点 + Analytics Engine 数据集 `aureon_events`；`navigator.sendBeacon` 发送；字段见下表；保留 90 天；采样 100 %（量小） |
| 事件 schema | `{ e: string, p: object, lang: "fr"|"zh", lite: boolean, v: string, t: number }`；无 IP/UA/用户 id；服务端不落 IP |
| 事件清单 | IM §1.11：`section_view / drawer_open / drawer_tab / tour_start / tour_scene / tour_complete / tour_exit / flow_filter / print_click / pdf_download / lang_switch / bw_toggle / motion_toggle + qr_src` |
| 隐私 | 无 Cookie → 无需 Cookie 同意横幅（以法务确认 CNIL 豁免条件为准）；页脚「Confidentialité」说明；尊重 `DNT` |
| 合规 | 毛里塔尼亚数据法按客户法务意见执行；站点不收集个人数据、不做用户账户、无表单（仅 `mailto`/WhatsApp 链接）；如加联系表单 → Cloudflare Turnstile（隐私友好）+ 明确告知 |

### 9.8 监控、备份与 Runbook（要点，全文写入 `RUNBOOK.md`）

| 项 | 频率 | 工具/动作 |
|---|---|---|
| 可用性 | 1 分钟 | UptimeRobot 免费版：主站 + `cn.` 镜像（如启用） |
| 证书/域名到期 | 每月 | Cloudflare 证书告警 + 域名到期邮件（注册商开启） |
| 链接/拼写 | 每次发布 | `check:links` + `check:fr` |
| 性能 | 每周 | Lighthouse CI 定时 + Cloudflare CWV 面板 |
| 备份 | 每次发布 + 每周 | R2 `aureon-backups`（dist.zip/PDF/git bundle）；每月导出 DNS zone |
| 故障处理 | 事件驱动 | 回滚步骤（3 步）、DNS 切换步骤、联系人清单（域名/DNS/CF 账户持有人、客户技术对接人） |
| 账户安全 | 持续 | Cloudflare/GitHub/域名账户 2FA、最少权限、离职移交清单 |

## 10. 可访问性（WCAG 2.2 AA）

### 10.1 目标与验收口径

| 项 | 目标 | 验证 |
|---|---|---|
| 标准 | WCAG 2.2 AA（含 2.2 新增：焦点不被遮挡、目标 ≥24×24、拖拽有替代、帮助一致） | axe-core（Playwright）0 critical/serious；人工键盘走查 |
| 键盘 | 全站核心路径可完成：导航 → 打开抽屉 → 切 6 tab → 打开 L3 → 关闭 → Tour → 打印 | 键盘走查脚本（§11.2 A01–A05） |
| 屏幕阅读器 | VoiceOver（iOS Safari + macOS Safari）、NVDA（Chrome/Windows）各跑 1 次冒烟 | 人工，记录问题单 |
| 对比度 | 正文 ≥4,5:1；大字（≥24 px 或 18,66 px 粗体）≥3:1；非文字（焦点环、图标）≥3:1 | 见 §10.2 实测 |
| 动效 | `prefers-reduced-motion: reduce` 与手动开关均生效（IM §1.8） | 自动化 + 人工 |
| 缩放 | 200 % 缩放无横向滚动、内容不重叠；不禁止双指缩放 | 浏览器 200 % + 390 px 模拟 |

### 10.2 品牌色对比度实测（WCAG 2.x 公式，2026-11-09 计算，附录 A.3）

| 前景 / 背景 | 对比度 | AA 判定 | 使用规则 |
|---|---|---|---|
| 象牙白 #F6F0E4 / 深蓝 #071C36 | **15,06:1** | ✅ 正文 | 深底正文首选 |
| 香槟金 #C9A25E / 深蓝 #071C36 | **7,17:1** | ✅ 正文 | 深底小标签/数字可用 |
| 深金 #9C7A38 / 象牙白 #F6F0E4 | 3,52:1 | ❌ 正文（≥24 px 大字可用） | 仅线条/大字/打印（T2 `--gold`） |
| 深金 #7C5F2B（T2 `--c-gold-800`）/ 象牙白 | **5,24:1** | ✅ | 浅底小字/图标（T2 已落地 `--gold-text`） |
| 香槟金 #C9A25E / 象牙白 #F6F0E4 | 2,10:1 | ❌ 任何文字 | 只做装饰线，**不得作浅底文字** |
| 信号绿 #00A86B / 深蓝 #071C36 | **5,55:1** | ✅ | 深底正向数据可用 |
| 信号绿 #00A86B / 象牙白 #F6F0E4 | 2,72:1 | ❌ | 浅底正向文字用 T2 `--c-green-600 #00794D`（4,82:1 ✅） |
| 石板 #33415A / 象牙白 | **9,05:1** | ✅ | 浅底正文 |
| 雾灰 #7C8798 / 象牙白 | 3,20:1 | ❌ | presentation `.spec` 不可照搬；T2 用 `--c-ink-500 #5E6B7E`（4,77:1 ✅） |
| 暖灰 #8C8478 / 象牙白 | 3,25:1 | ❌ | T2 定为 `--c-ink-300`，仅装饰/folio、非信息 |
| 小字灰 #6A7688 / 象牙白 | 4,06:1 | ❌ 正文（≥3:1 图形可用） | T2 定为 `--c-ink-400`，仅图形/大字 |
| 象牙白 72 % / 深蓝 | 8,28:1 | ✅ | 深底次要文字 |
| 象牙白 62 % / 深蓝 | 6,41:1 | ✅ | 深底最小建议值 |
| 象牙白 50 % / 深蓝 | 4,64:1 | ✅（临界） | 仅 ≥14 px 正文使用 |

**与 T2 `visual-system.md` 的复核（v1.1）**：T2 已落地修正 token，本表用于验收复核：`--c-gold-800 #7C5F2B`（象牙白 5,24:1 ✅，浅底小字）、`--c-green-600 #00794D`（4,82:1 ✅，浅底正向）、`--c-ink-500 #5E6B7E`（4,77:1 ✅，次要文字）、`--c-ink-400 #6A7688`（4,06:1，仅图形/大字）、`--c-ink-300 #8C8478`（3,25:1，仅装饰/folio，非信息）；`--gold`=`--c-gold-700 #9C7A38`（3,52:1）仅线条/大字/打印；`--focus-ring` 深底 `#C9A25E`（7,17:1）、浅底 `#9C7A38`（3,52:1，非文字 ≥3:1 达标）。注意：`--c-green-500 #00A86B`（2,72:1 on ivory）不得作浅底文字。

### 10.3 语义化结构（模板级）

```html
<a class="skip-link" href="#main">Aller au contenu</a>
<header>…<nav aria-label="Navigation principale">…</nav></header>
<main id="main">
  <section id="hero" aria-labelledby="hero-title">
    <h1 id="hero-title">Une plateforme. Trois souverainetés.</h1>
    …
  </section>
  <section id="chiffres-2031" aria-labelledby="s09-title">
    <h2 id="s09-title">2031 : ce que cela représente.</h2>
    <figure aria-describedby="s09-desc">
      <svg role="img" aria-labelledby="s09-chart-title">…</svg>
      <figcaption id="s09-desc">…</figcaption>
      <table class="sr-only">…data fallback…</table>
    </figure>
  </section>
</main>
```

规则：每页 1 个 `<h1>`；区块 `<h2>`、卡片 `<h3>` 不跳级；装饰 SVG `aria-hidden="true"`；仅图标按钮必须有 `aria-label`；表格有 `<caption>`；语言切换按钮 `aria-pressed`；外链标注新窗口（如适用）。

### 10.4 关键组件无障碍要求

| 组件 | 要求 |
|---|---|
| 抽屉（L2） | 优先原生 `<dialog>`（`showModal` 自带 focus 限制与 Esc）；补齐 Tab 循环与关闭后焦点还原（IM §1.4）；`aria-labelledby` 指向标题；背景 `inert`（不支持时 `aria-hidden` + 手动 trap）；打开时 `aria-live="polite"` 播报「{Nom} — panneau de détail ouvert」 |
| Tabs | WAI-ARIA Tabs：`role=tablist/tab/tabpanel`、`aria-selected`、`aria-controls`、roving tabindex、←/→/Home/End |
| 手风琴 | `<button aria-expanded aria-controls>` + region；高度动画不改变可访问状态 |
| 关系图 | 默认提供「矩阵/列表」替代（IM §2.7）；图容器 `role="group"` + 说明；节点用 `<button>`；边说明在列表视图中可达；不依赖颜色单独传达五类流（线型/形状/文字标签三重编码，见 T2 visual-system §11.2） |
| 地图 | 国家用 `<button>` 或列表；提供文本替代；装饰流线 `aria-hidden` |
| 计数器 | SSR 终值；`aria-live="off"`；动画不改变布局宽度（tabular-nums + 固定宽度）；reduced-motion 直接终值 |
| Tour | 开始前焦点移到控制条；`aria-live="polite"` 播报场景；Space 暂停/继续、←/→ 切换、Esc 退出；自动播放可被任何交互暂停；reduced-motion 不自动滚动（IM §1.8） |
| 图表 tooltip | 键盘可聚焦数据点（focus 即显示 tooltip）；tooltip 内容同时存在于隐藏数据表 |
| 打印按钮 | 真实 `<button>`；打印后焦点回到按钮；提供「PDF 下载」为普通链接（可右键另存） |
| 语言切换 | `aria-pressed` / `aria-current`；切换后 `document.title` 与 `html lang` 同步更新；焦点不丢 |

### 10.5 WCAG 2.2 新增项对照

| 2.2 准则 | 本项目落实 |
|---|---|
| 2.4.11 焦点不被遮挡 | sticky header/footer 高度计入 `scroll-padding`；抽屉打开时焦点在抽屉内 |
| 2.5.7 拖拽替代 | 抽屉下滑关闭有按钮替代；关系图拖拽有键盘/列表替代；时间轴拖动有按钮 |
| 2.5.8 目标尺寸 ≥24×24 | 全部可点元素 ≥44×44（移动）/32×32（桌面），图节点命中区 ≥48 px（IM §1.6） |
| 3.2.6 一致的帮助 | 页脚固定「Aide / Accessibilité」入口 |
| 3.3.7 冗余输入 | 无表单（仅 mailto），不适用；若加表单则自动填充 |

---

## 11. 测试与验收

### 11.1 测试金字塔

| 层 | 工具 | 覆盖 | 频率 |
|---|---|---|---|
| 单元 | `vitest`（或 `node:test`） | `format.ts`（FR/ZH 精确串、U+202F）、`routes.ts` 解析、内容 schema | 每次提交 |
| 内容校验 | `validate-content.mjs` + `check-typography.mjs` | V01–V12、法语排版 | 每次提交 |
| E2E | Playwright | 14 区块、抽屉 6 tab、深链、返回键、Tour、语言切换、lite 模式、404 | 每次 PR |
| A11y | Playwright + axe-core | 全页 + 抽屉内 + 打印视图；键盘脚本 | 每次 PR |
| 视觉回归 | Playwright 截图 | 1440/768/390 × 关键区块 + 打印 sheet | 每次 PR |
| 性能 | Lighthouse CI + size-limit + 自定义 gzip 脚本 | §7.1 预算 | 每次 PR + 每周定时 |
| 打印 | Playwright PDF + 溢出检测 + QR 解码 | 18 页、无溢出、字体嵌入 | 每次发布 |
| 真机/人工 | 设备矩阵 + 屏幕阅读器 | §11.2 B/A 组 | 发布前 |

### 11.2 QA 清单（发布前必须逐项勾选；写进 QA 报告模板）

**A. 可访问性（A01–A12）**
- A01 键盘仅用 Tab/Shift+Tab/Enter/Space/Esc/方向键可完成：导航 → 抽屉 → 6 tab → L3 → 关闭 → Tour → 打印。
- A02 焦点可见且不被遮挡（sticky header 下不丢焦点）。
- A03 打开抽屉焦点进入、关闭后回到触发元素；Tab 循环不逃出。
- A04 axe 全页 0 critical/serious；抽屉打开态再跑一次。
- A05 标题层级正确（1×h1，无跳级）；landmark 完整。
- A06 图片/SVG 有替代文本或 aria-hidden；图表有隐藏数据表。
- A07 对比度（§10.2）：所有新 token 通过；#C9A25E 未用于浅底文字。
- A08 reduced-motion：无位移动画、无自动滚动、无计数动画；Tour 不自动播放。
- A09 200 % 缩放无横向滚动；屏幕阅读器语音顺序正常。
- A10 语言切换后 `lang`/标题/aria 文案同步；ZH 页面读屏中文发音正确（VoiceOver 中文语音）。
- A11 打印视图可访问（PDF `tagged`；阅读顺序 = DOM 顺序）。
- A12 无仅 hover 可见的信息（触屏与键盘可达）。

**F. 功能（F01–F15）**
- F01 14 区块按 00–13 顺序出现，无控制台错误。
- F02 6 业务线卡片：点击打开抽屉、6 tab 均有内容、空态文案正确。
- F03 三支柱/四层/RIMU 模块/算力三期/五类流均可打开对应抽屉。
- F04 深链 `#/business/finance-rimp/chiffres` 冷启动直接打开；刷新可复现。
- F05 浏览器返回逐层关闭；Esc/遮罩/关闭按钮均可关。
- F06 抽屉内「Voir aussi」替换内容且可后退；不产生超 2 层嵌套。
- F07 Mode Pitch：启动/暂停/继续/上一场/下一场/Esc 退出；`?tour=1` 可分享；reduced-motion 不自动滚。
- F08 关系图：五类流筛选、isolate、hover tooltip、点击节点开抽屉、矩阵视图可用；移动端默认矩阵。
- F09 手机演示：自动 8 s 循环、hover 暂停、离开视口暂停、可重播；low 模式不自动播放。
- F10 时间轴三轨切换、里程碑展开、URL/状态保持。
- F11 计数器只在进入视口播放一次，可重播；区间值不假计数。
- F12 方法学入口可打开（每 KPI ⓘ），内容含类型/年份/公式/来源行号。
- F13 语言切换保留 hash 与抽屉状态；`?lang=zh` 生效。
- F14 lite/reduced/lofi 开关生效并持久化；四种组合下页面可读。
- F15 404 页面友好、返回主站链接有效。

**I. i18n（I01–I08）**
- I01 FR/ZH 键 100 % 对齐（CI）；无回退到 FR 的裸文案。
- I02 数字格式：`2,5 M / 250 万`、`800 000 / 80 万`、`150–220 M USD / 1.5–2.2 亿美元` 精确匹配冻结串。
- I03 FR 排版规则（§6.4）零违规。
- I04 专名保留（RIMU/RIMP/hassaniya/Nouakchott）。
- I05 hreflang/canonical/sitemap 正确；FR/ZH OG 区分。
- I06 阿语路由 noindex 且不出现未翻译入口。
- I07 ZH 字体子集无缺字（构建告警清零）。
- I08 打印 PDF FR/ZH 各自版本均生成。

**D. 内容与数据（D01–D10）**
- D01 14 区块无 lorem、无 TODO、无占位图。
- D02 每个大数字有 Source/Dérivé/Hypothèse 徽章与 ⓘ。
- D03 5 项口径修正（BRIEF §7.3 + TQA-01…07）在页面有对应处理，无矛盾表述。
- D04 就业三组不并列相加；收入分项与总数口径注存在。
- D05 方法学页/抽屉含更新日期与版本。
- D06 法语母语审校签字（记录在 PR/QA 报告）。
- D07 联系信息与 README §3 一致且客户确认公开范围。
- D08 页脚「Scénario ambitieux · document non contractuel」存在。
- D09 无未授权图片/logo。
- D10 源文件行号引用可核对（抽取 5 个抽样）。

**P. 性能（P01–P08）**
- P01 3G 档（1,6 Mbps/300 ms）LCP <3 s、可交互 <3 s（WebPageTest + Lighthouse 模拟双验证）。
- P02 首包 gzip（HTML+CSS+JS+图，不含字体）<1,5 MB（BRIEF），实际 ≤500 KB。
- P03 JS gzip ≤115 KB；初始 JS ≤30 KB（size-limit）。
- P04 FR 字体 ≤96 KB；ZH 字体 ≤800 KB 且仅 /zh/ 加载。
- P05 CLS <0,1（field）/ <0,05（lab）；字体 swap 不引起跳动。
- P06 主线程无 >50 ms 长任务；滚动 60 fps（低端机 ≥30 fps）。
- P07 二访缓存命中：HTML 请求数 ≤1、静态资源 304/immutable。
- P08 无第三方请求（除自有分析端点）。

**B. 跨浏览器/设备（B01–B08）**
- B01 Chrome/Edge 最新（Win/macOS/Android）。
- B02 Safari 17+（macOS）与 iOS 17+（含 100vh/滚动/打印）。
- B03 Firefox 最新。
- B04 微信内置浏览器（iOS WKWebView / Android X5）：抽屉、字体、无自动播放、PDF 下载提示。
- B05 Samsung Internet（如可获取）。
- B06 390×844 移动端无横向滚动；触摸目标 ≥44 px。
- B07 平板 768 与桌面 1440/1920 布局正常。
- B08 低端安卓（4 核/3 GB）lite 模式可用、无崩溃。

**PR. 打印（PR01–PR10）**
- PR01 `@media print` 主页面：A4 横向、无交互外壳、折叠内容全展开、无截断。
- PR02 `/fr/dossier/` 18 页；每页无溢出（CI）、页码正确。
- PR03 PDF A4 横向 297×210、≤6 MB、字体子集嵌入、标题/语言元数据正确。
- PR04 暗色页打印后文字可读（背景图形开启与关闭两种情况）。
- PR05 QR：解码 URL 正确、22–26 mm、30 cm 可扫、无静区遮挡。
- PR06 图表终态、无 tooltip 残留、图例可辨。
- PR07 页脚 Source/Méthode/版本/日期齐全。
- PR08 ZH 版 PDF 无缺字（□）。
- PR09 tagged PDF 基本结构（标题/阅读顺序）可用。
- PR10 客户打印机实测 1 次（黑白 + 彩色）。

**S. 安全/隐私（S01–S06）**
- S01 CSP 生效（无 inline script 报错）；控制台无安全警告。
- S02 无第三方脚本/字体/CDN 请求。
- S03 分析事件不含 IP/UA/个人字段；DNT 生效。
- S04 依赖漏洞扫描（`npm audit`）无 high/critical。
- S05 无 secret 进入仓库/前端（grep 检查）。
- S06 HTTPS/HSTS 生效；http 自动跳转。

### 11.3 验收标准（Definition of Done，可量化）

| # | 标准 | 验证方式 |
|---|---|---|
| DoD-1 | 14 区块 FR 全量上线；6 业务线各 6 tab 有内容；深链可分享 | E2E + 人工 |
| DoD-2 | ZH 核心内容 100 %、全部数字/导航 100 %（完整版：全部文案） | I01–I02 |
| DoD-3 | 每个数字可溯源（ⓘ 到源文件行号或公式）；0 处口径矛盾 | D02–D04 + QA 报告 |
| DoD-4 | 3G LCP <3 s、首包 <1,5 MB、JS ≤115 KB | P01–P03 |
| DoD-5 | Lighthouse mobile：性能 ≥85、a11y ≥95、最佳实践 ≥95、SEO ≥95 | CI 报告 |
| DoD-6 | axe 0 critical/serious；键盘全流程通过；对比度修正 token 落地 | A01–A07 |
| DoD-7 | A4 横向 PDF 18 页、无溢出、二维码可扫；浏览器打印可用 | PR01–PR09 |
| DoD-8 | reduced-motion / lofi / lite / 无 JS 四种模式可读可导航 | F14 + 人工 |
| DoD-9 | 微信内置浏览器与 iOS/Android 主流浏览器通过 | B01–B07 |
| DoD-10 | 分析事件按 §9.7 上报；无 Cookie、无第三方 | S03 |
| DoD-11 | 5 人可用性测试中 ≥4 人能复述三支柱与 3 个 2031 数字 | PLAN §10.3 用户测试 |
| DoD-12 | 交付文档齐全（README/CONTENT-GUIDE/RUNBOOK/QA 报告/源码/JSON/PDF） | §14 |

### 11.4 可用性测试（5 人，发布前 1 天）

- 人群：2 名政府/公共部门背景、2 名投资/商务背景、1 名法语母语普通用户。
- 任务（每人 ≤20 分钟，出声思考）：① 用 3 分钟说明这是什么；② 找到「Biens de consommation」并说出 2 个数字；③ 找到 2031 年收入与占 GDP；④ 打开任一张图并说出五类流；⑤ 下载 PDF 并扫码回网页。
- 记录：任务完成率、时间、误解点；通过线：① ≥4/5 能复述三支柱 + 3 个数字；②–⑤ 完成率 ≥80 %。
- 输出：可用性报告 1 页 + 问题优先级（P0 上线前修 / P1 两周内 / P2 观察）。

### 11.5 QA 报告格式（交付物之一）

包含：版本/日期/环境（浏览器、网络档、设备）、执行清单勾选、失败项截图与复现步骤、性能数据（Lighthouse/WebPageTest JSON 附件）、打印样张缩略图、未解决项与风险接受签字（Lead + 客户对接人）。

## 12. 排期、人力与交付切分

### 12.1 功能切分：MVP（2 周）vs 完整体验版（4 周）

| 功能 | MVP（10 工作日） | 完整体验版（+10 工作日） | 验收关联 |
|---|---|---|---|
| 14 区块布局（桌面 1440 / 移动 390 / 平板 768） | ✅ FR 全量 | 打磨（1920/超宽、打印微调） | F01、B06–B07 |
| 六业务线 + 三支柱 + 四层 + RIMU 模块抽屉（6 tab） | ✅（含深链/返回/Esc/focus trap） | L3 子模块丰富、空态完善 | F02–F06 |
| 2031 数据：7 KPI + MAU 折线 + 收入构成 + 计数动画 | ✅（静态 SVG + 基础计数） | 图表交互增强、重播、tooltip 精修 | F11–F12 |
| 方法学抽屉/页（全部 KPI ⓘ、公式、来源行号） | ✅ | 法务/审校终稿 | D02–D05 |
| 关系图（07） | ✅ 矩阵/列表视图（IM 允许） | ✅ 完整交互图（筛选/isolate/粒子/键盘） | F08、A11 |
| RIMU 手机演示 | ✅ 静态 4 屏 + 点击切换 | ✅ 8 s 自动演示 + hover 暂停 + 重播 | F09 |
| Mode Pitch 3 分钟 | ✅ 简化 8 步（滚动定位 + 字幕 + 退出） | ✅ 7 场景精修、进度、暂停/继续、`?tour=1` | F07 |
| 动效 | ✅ CSS 入场/抽屉/计数；reduced-motion | ✅ GSAP timeline（M3/M8/M10–M12/M14）+ Lenis | §3.2、A08 |
| 时间轴（08） | ✅ 三轨切换 + 里程碑静态卡 | ✅ sparkline、拖拽/键盘定位 | F10 |
| 地图（10） | ✅ 静态 SVG + 国家标签 | ✅ 三类流向切换动画 | F08 邻 |
| i18n | ✅ FR 全量；ZH 导航 + 核心区块 + 全部数字 | ✅ ZH 全量 + 法语审校闭环 | I01–I08 |
| 打印 | ✅ 浏览器打印模式 + FR 18 页 dossier + PDF | ✅ 精修版式 + ZH PDF + tagged PDF + QR 全铺 | PR01–PR09 |
| SEO/OG/深链/404 | ✅ 基础（title/desc/OG/hreflang/sitemap） | ✅ 6 业务线 + 方法学独立落地页、JSON-LD | §6.6 |
| 分析 | ✅ Cloudflare Web Analytics + 基础事件 | ✅ 全部 IM §1.11 事件 + 面板 | §9.7 |
| a11y | ✅ 键盘/对比度/axe 通过 | ✅ SR 双端走查、WCAG 2.2 全项 | A01–A12 |
| 真机矩阵/回归基线 | 冒烟 | ✅ 完整视觉回归 + 设备矩阵 | §11.1 |
| 中国镜像 | 评估（测量为主） | 可选部署 | §9.4 |

### 12.2 人力与工作量估算（人日；Hypothèse，按 1 名资深前端计价）

| 角色 | MVP | 完整体验版增量 | 合计 | 说明 |
|---|---|---|---|---|
| 前端 | 10 | +10 | 20 | 核心交付；熟悉 Astro/TS/CSS |
| 设计（T2 规格落地 + 视觉 QA） | 4 | +3 | 7 | 已有 visual-system 与 interaction-motion，主要是走查与打印排版 |
| 内容/数据（T1 维护 + 数字复核） | 3 | +2 | 5 | 内容冻结后以改稿/QA 为主 |
| 法语审校 | 1 | +1,5 | 2,5 | 母语审校（可复用 research/french_copy.md 流程） |
| QA/PM（Lead 兼任或 0,2 FTE） | 2 | +2,5 | 4,5 | 测试执行、客户沟通、发布 |
| **合计** | **20 人日** | **+19 人日** | **39 人日** | MVP = 10 工作日 × 平均 2 人并行；完整版 = 4 周 × 约 2 人 |

工期假设：工作日、无重大需求变更、内容 D1 冻结、法语审校按 2 个工作日周转。若只有 1 名前端且无第二人力，MVP 需 3 周（需客户选择先上精简版或延后）。

### 12.3 里程碑（相对日期，D1 = 启动日）

| 阶段 | 时间 | 交付 | 通过标准 |
|---|---|---|---|
| M0 启动 | D1 | 仓库、CI、token、内容冻结、域名/DNS 权限确认 | 内容 D1 冻结；账号可用 |
| M1 骨架 | D2–D3 | Astro 工程、字体管线、14 区块静态 FR、Header/Footer/Rail | 桌面/移动布局评审通过 |
| M2 交互 | D4–D6 | 抽屉（6 tab）＋路由＋深链＋focus trap；业务线数据接入 | F02–F06 通过 |
| M3 数据/打印 | D7–D8 | 09/08 图表、计数器、方法学、打印 CSS + FR PDF | D02–D05、PR01–PR03 |
| M4 上线 MVP | D9–D10 | ZH 核心、a11y/perf 修复、OG/SEO/分析、生产发布 | DoD-1…DoD-10（核心项） |
| M5 完整版（W3） | D11–D15 | 关系图交互、手机演示、Tour 精修、时间轴/地图动效、GSAP 全套 | F07–F10 |
| M6 完整版（W4） | D16–D18 | ZH 全量、打印 18 页精修 + ZH PDF、SEO 落地页、视觉回归基线 | DoD-2/7/9 |
| M7 验收发布 | D19–D20 | 真机矩阵、可用性测试（5 人）、QA 报告、客户验收 | DoD-11/12；签字 |
| 观察期 | +30 天 | CWV/RUM、内容复盘、二期决策 | 无 P0 故障；月度报告 |

**关键路径**：内容冻结 → 布局 → 抽屉 → 数据 → 打印/PDF → 发布。ZH 全量翻译与法语审校可并行，但必须留 2 个工作日缓冲。

### 12.4 依赖与客户侧配合（写进合同/启动会）

| # | 依赖 | 需要客户 | 截止 |
|---|---|---|---|
| 1 | 域名/DNS/Cloudflare 账户权限（或委托人） | 是 | D1 |
| 2 | 数据口径 5 项决策（TQA-01…07） | 是 | D2 |
| 3 | FR 文案终稿与术语表 | 是（T1/客户） | D1–D2 |
| 4 | 联系方式公开范围确认（README §3） | 是 | D9 |
| 5 | 法语母语审校人 | 是 | D3 |
| 6 | 可授权图片/logo（若有） | 可选 | D5 |
| 7 | 打印机/PDF 用途确认（黑白或彩色） | 是 | D7 |
| 8 | 分析端点域名与法务意见 | 是 | D8 |

### 12.5 上线后 30/60/90 天

- **30 天**：CWV/RUM 周报、错误与 404 清零、内容错字热修（≤30 分钟流程）。
- **60 天**：客户使用反馈、PDF 打印反馈、内容季度复核启动（Hypothèse 类数字）。
- **90 天**：二期决策（阿语 RTL、CMS、ECharts 触发条件、中国镜像、定制 PDF）。

---

## 13. 风险登记册（技术侧）

| # | 风险 | 概率 | 影响 | 缓解 | 触发信号 | Owner |
|---|---|---|---|---|---|---|
| R-01 | 内容/文案延迟，阻塞布局与打印 | 高 | 高 | D1 内容冻结；先以 T1 模型占位；每日 15 min 对齐 | 冻结日仍缺 6 tab 内容 | Lead |
| R-02 | 数据口径未决（TQA 五项） | 高 | 中 | 页面统一标「Scénario ambitieux」+ 方法学；不阻塞开发 | 客户会前未拍板 | Lead/T1 |
| R-03 | 法语审校排期紧 | 中 | 中 | 预审 + 发布前 2 天终审；CI 排版规则兜底 | 审校人不可用 | 内容 |
| R-04 | 字体子集缺字/超预算 | 中 | 中 | 构建期告警；ZH 可变字体；预算 800 KB 上限；CI fail 提醒 | 构建告警 >0 或 size-limit 超 | 前端 |
| R-05 | 中国访问慢/不稳定 | 高 | 中 | 不承诺大陆速度；L2 镜像按需；PDF/PPT 兜底（§9.4） | 大陆实测 p75 LCP >5 s | Lead/客户 |
| R-06 | 打印版式溢出/分页难看 | 中 | 高 | 固定 sheet + CI 溢出检测 + 样张确认；文案上限 90–120 词/页 | CI 溢出或客户样张否决 | 前端/设计 |
| R-07 | 图表范围膨胀（要求 ECharts 级交互） | 中 | 中 | 手写 SVG 封闭清单；改选条件明确（≤150 KB 自定义构建） | 新增 >3 张图或要求 brush 联动 | Lead/前端 |
| R-08 | 动效与性能冲突（低端机掉帧） | 中 | 中 | 三档模式；运行时帧率自检降级（IM §1.10）；预算门禁 | 低端机 <30 fps | 前端 |
| R-09 | iOS/微信内置浏览器兼容（100vh、dialog、字体） | 中 | 中 | 真机矩阵；svh/dvh + visualViewport；dialog 降级方案 | 微信打开异常 | 前端 |
| R-10 | 域名/DNS 权限不在我方 → 无法上线 | 中 | 高 | D1 确认权限/委托人；提供 DNS 变更清单 | 权限未到位 | Lead |
| R-11 | 素材授权（照片/logo） | 低 | 中 | 默认全 SVG 线稿，无授权素材不上；客户提供授权书 | 客户临时要求真实照片 | 设计/客户 |
| R-12 | 分析/隐私合规 | 低 | 中 | 无 cookie、无 PII；法务确认；可一键关闭分析 | 法务提出异议 | Lead |
| R-13 | 人员连续性/交接 | 中 | 高 | README/CONTENT-GUIDE/RUNBOOK + 录屏；代码评审；账号清单 | 关键人不可用 | Lead |
| R-14 | 源文件事实矛盾被客户当场发现 | 中 | 高 | 提前把 TQA 清单作为「方法论的一部分」呈现（体现严谨而非隐瞒）；法语文案统一口径 | 客户质疑数字 | Lead/T1 |

---

## 14. 交付物清单与移交

1. **源码仓库**（私有 Git）：`site/` 工程、内容 JSON、脚本、测试、CI 配置、`CHANGELOG.md`。
2. **构建产物**：`dist.zip`（静态站点，可离线/U 盘）、生产 URL。
3. **PDF**：FR 18 页 A4 横向、ZH 18 页、版本化副本（latest + v{version}）。
4. **品牌资产**：网页版 SVG（优化后 logo/图标/地图）、WOFF2 子集、OG 图（FR/ZH/业务线变体）、QR SVG。
5. **文档**：`README.md`（开发）、`CONTENT-GUIDE.md`（非技术编辑，含 5 个常见操作）、`RUNBOOK.md`（发布/回滚/备份/监控/故障）、`QA-REPORT.md`（§11.5）、本文件 `tech-architecture.md`。
6. **数据契约**：`data-model.json` + 本文件的 schema/校验脚本（V01–V12）。
7. **账号移交清单**：Cloudflare（Pages/DNS/Analytics）、GitHub、域名注册商、分析 Worker、R2 备份桶；2FA 与最小权限。
8. **培训**：1 小时（内容编辑 30 min + 发布/回滚 30 min），录屏存档。

**验收会（D19–D20）议程**：演示 3 条路径（3 分钟 Tour / 自由探索一个业务 / 打印 PDF）→ 对照 DoD 逐项勾选 → 客户签字 → 移交账号与文档 → 启动 30 天观察期。

---

## 15. 与 T1/T2 交付的对齐复核（v1.1，2026-11-09）

复核对象：`web/spec/data-model.json`（T1 已交付，189 KB：58 个 KPI、6 条业务线、35 条关系边、7 条 QA、16 条来源、6 个区域、4 层架构）、`web/spec/visual-system.md`（T2 已交付，47 KB）、`web/spec/interaction-motion.md`（T2 已交付）。

### 15.1 已对齐（无需 Lead 处理）

| 项 | 结论 |
|---|---|
| 数据实体 | §5.6 已按 T1 实际字段更新；前端 adapter 归一，**T1 文件不改** |
| 关系图 | 节点由 pillars/businessLines/regions 派生；35 条边、手工坐标由前端维护（§5.4.4） |
| QA 口径 | 技术侧 TQA-01…08 映射 T1 QA-1…QA-7（§5.4.8）；不新建 qa.json |
| 字体预算 | 与 T2 §4 一致：拉丁 ≤120 KB、CJK 标题子集 ≤90 KB、低带宽不下载 CJK（§7.2） |
| 对比度 token | 与 T2 §3 一致：gold-800 5,24:1 / green-600 4,82:1 / ink-500 4,77:1（§10.2） |
| 打印 | T2 §11 打印规则与本文件 §8 固定 sheet 方案一致；同一 JSON/组件 |
| 区块 id | 数据层用 T1 `meta.blockIds`（`00-hero`…`13-next-steps`），页面锚点沿用 IM slug（见 U-2） |

### 15.2 待 Lead 统一（3 项，建议裁决）

| # | 冲突 | 建议裁决 |
|---|---|---|
| U-1 | T1 `meta.routes`（`#/system`、`#/business/{id}`、`#/pillar/{id}`、`#/rimu/{id}`，无 tab 子路由）vs IM §1.1 路由表（`#/business/{id}/{tab}`、`#/module/{id}`、`#/layer/{id}`、`#/flow/{id}`、`#/methodo`、`#/s/{sectionId}`） | **以 IM 为准**（更完整、含 history 策略）；T1 的 routes 字段忽略或由 Lead 更新 |
| U-2 | 区块 id 前缀：T1 用 `00-hero`…`13-next-steps`；IM 锚点用 `hero`/`chiffres-2031`、路由 `#/s/chiffres-2031` | 统一为：**数据层用 T1 带前缀 id，路由/锚点用 IM 无前缀 slug**；adapter 去前缀（`00-hero`→`hero`） |
| U-3 | 人口参考：T1 `AS-1` 假设 ≈4,9 M；世界银行 2025 为 5,315 M（附录 A.4） | 建议 T1 更新 AS-1 为世界银行值或改用「账户数」表述；页面不显示人口基数，仅方法学引用 |

## 附录 A · 实测数据与来源（2026-11-09 核对）

### A.1 JS 库体积（jsDelivr 拉取 dist → 本地 node zlib）

测量方法：`curl -sSL <jsdelivr-url> -o lib.js`，再用 Node `zlib.gzipSync(buf,{level:9})` 与 `zlib.brotliCompressSync(buf,{quality:11})` 计算。

| 文件 | 原始 B | gzip-9 B | brotli-11 B |
|---|---|---|---|
| gsap@3.15.1/dist/gsap.min.js | 73 357 | 27 818 | 25 152 |
| gsap@3.15.1/dist/ScrollTrigger.min.js | 44 683 | 17 617 | 15 905 |
| lenis@1.3.27/dist/lenis.min.js | 18 815 | 5 264 | 4 712 |
| echarts@6.1.0/dist/echarts.min.js | 1 121 883 | 360 397 | 291 776 |
| echarts@6.1.0/dist/echarts.common.min.js | 715 020 | 234 778 | 195 393 |
| echarts@6.1.0/dist/echarts.simple.min.js | 500 315 | 165 653 | 139 917 |
| motion@14.10.1/dist/motion.min.js | 183 875 | 60 023 | 53 122 |

### A.2 字体（Google Fonts CSS + woff2 全量下载统计）

| 字体 | @font-face 数 | woff2 总量 | 覆盖码点 | 平均 B/字 |
|---|---|---|---|---|
| Noto Sans SC 400（css2, display=swap） | 101 | 2 410 336 B（2,30 MB） | 16 283 | 148,0 |
| Noto Serif SC 400 | 101 | 3 182 264 B（3,03 MB） | 16 283 | 195,4 |
| Inter 400;600 | 14 | 437 776 B | 5 014 | latin ≈47 KB/字重 |
| Playfair Display 400;600 | 8 | 179 280 B | 3 532 | latin ≈37,5 KB/字重 |

来源：`https://fonts.googleapis.com/css2?family=…`（UA 伪装 Chrome 124 获取 woff2 分片），逐个下载后统计。**本方案不使用该 CDN，仅用于推导子集体积。**

### A.3 对比度（WCAG 2.x 相对亮度公式）

对 12 组品牌色两两计算：关键结论见 §10.2；计算脚本为 Node 实现的 sRGB 线性化 + (L1+0,05)/(L2+0,05)。
关键值：象牙白/深蓝 15,06；香槟金/深蓝 7,17；深金/象牙白 3,52（不合格）；#85642A/象牙白 4,80（合格）；#00A86B/象牙白 2,72（不合格）；#007A52/象牙白 4,74（合格）。

### A.4 世界银行指标（API 查询，Mauritania = MR）

| 指标 | 2024 | 2025 | 用途 |
|---|---|---|---|
| SP.POP.TOTL（人口） | 5 169 000 | 5 315 000 | 校验 2,8 M 钱包占比（52,7 % 全国人口；96,9 % 的 15–64 岁人口） |
| SP.POP.1564.TO（15–64 岁人口） | 2 795 000 | 2 890 000 | 同上；说明「成年人口一半」不成立 |
| IT.NET.USER.ZS（互联网用户 %） | 45,78 % | — | 与「2031 网民 60 %+」口径分离；2024 网民 ≈237 万 |
| NY.GDP.MKTP.CD（GDP，现价美元） | 10,88 Md | 11,68 Md | 校验 150–220 M USD = 1,28–1,88 % PIB（与源文件 1,3–1,9 % 一致） |
| IT.CEL.SETS.P2（每百人移动订阅） | 92,07 | — | 移动优先依据 |

### A.5 毛里塔尼亚网络（ISOC Pulse 国家报告，2026-11-09 访问）

- 互联网渗透率 46 %（2024，非洲均值 40 %）；人口 5 315 065（UN 分类：最不发达国家）。
- 平均下载：移动 44,21 Mbps（2026，300 用户样本）、宽带 59,65 Mbps。
- 3G 低消费套餐成本 ≈1,47 % GNI（2025，ITU 口径）。
- 4G/5G 覆盖率 79 % 设备可达；5G <1 %。
- 互联网韧性评分 43 %（中等）。
> 用途：解释为什么「移动均值很高但仍须按 1,6 Mbps/300 ms 的 3G 档做预算」，以及为什么默认低带宽模式与省流量是产品需求。

### A.6 既有 deck 基线（`presentation/index.html` / `render/render_deck.js`）

| 指标 | 实测 |
|---|---|
| HTML 原始 / gzip-9 / brotli-11 | 2 910 782 B / 1 037,2 KB / 41,5 KB |
| 内联 `<svg>` 数 / logo path 重复次数 | 31 / 32 |
| `assets/logo-mark.svg` | 83 984 B、346 path、gzip 31,4 KB |
| 页数 | 14（`section.page`） |
| `@page` | `size: 297mm 210mm; margin: 0` |
| 字体 | `@font-face` 计数 = 0（依赖 macOS Didot/Avenir Next） |
| PDF 管线 | Chrome + playwright-core；`width/height: 297mm/210mm`、`printBackground`、`preferCSSPageSize`、`document.fonts.ready` |
| 既有导出 PDF | 34 页 SONEF 提案 PDF 4,66 MB（可作版式气质参考） |

### A.7 平台事实来源

- Cloudflare Pages 限制（官方文档，更新 2026-09-05）：免费 500 builds/月、20 000 文件、单文件 25 MiB、构建超时 20 min、100 自定义域名。
- Cloudflare China Network（官方文档，更新 2026-04-17）：需 Enterprise + China Network 附加订阅 + ICP 及域名内容审核。
- GSAP 授权（gsap.com/pricing，2026-11）：官方声明「GSAP is now free for everyone」。
- Playwright `page.pdf`（1.65 类型声明）：支持 `displayHeaderFooter/footerTemplate/preferCSSPageSize/tagged`（tagged = 可访问 PDF）。

### A.8 npm 版本查询

`curl -s https://registry.npmjs.org/<pkg>/latest | jq -r .version`：astro 7.4.7、next 16.4.5、gsap 3.15.1、echarts 6.1.0、lenis 1.3.27、motion 14.10.1、zod 4.6.7、typescript 7.0.2、sharp 0.35.5、svgo 4.1.0、@astrojs/sitemap 3.7.4、@playwright/test 1.65.0、@lhci/cli 0.16.0、size-limit 14.3.0、qrcode 1.5.4。

### A.9 源文件行号索引（本文件引用的关键段落）

| 行号 | 内容 | 用于 |
|---|---|---|
| L6–L14 | 三支柱定位、RIMU 定位、四战略目标 | §2、§6 |
| L16–L24 | 四层架构表 | §4 组件、§10 |
| L25–L32 | RIMU 四 tab 与模块 | 抽屉 schema |
| L34–L43 | 内容 AI 能力与用例 | 内容实体 |
| L45–L49 | 双边三步 | roadmap |
| L50–L59 | 五年表（MAU/DAU/时长/里程碑） | series、KPI |
| L60–L64 | 算力三期（1 MW / 2–3 MW / 扩展） | TQA-03 |
| L66–L69 | 西非消费品与内容协同 | 10 区块 |
| L72–L74 | 2031 MAU/钱包/支付流量 | KPI、TQA-01/02 |
| L75–L83 | 收入表与 PIB 占比 | KPI、TQA-04 |
| L84–L99 | 短中长期收益、就业、账户 | KPI、TQA-05/06 |
| L100–L102 | 西非区域收益 | 地图/关系 |
| L104–L109 | 五项国家支持 | 11 区块 |
| L110–L115 | 五类风险与缓解 | 12 区块、schema |

---

## 附录 B · 待决问题（Open Questions，Lead/客户拍板）

| # | 问题 | 默认决策（若无人拍板） | 影响 |
|---|---|---|---|
| OQ-01 | 域名与 Cloudflare 账户持有人/权限 | 沿用 `www.aureondigital.mr`，客户持有，我方代配 | 上线阻塞 |
| OQ-02 | 联系方式公开范围（CM AD-7） | 仅公开 README §3 中客户确认的字段 | 13 区块 |
| OQ-03 | 五项数据口径是否按 BRIEF §7.3 采纳 | 采纳 BRIEF 推荐 + TQA 处理 | 全站数字 |
| OQ-04 | 打印册页数（18 页）与是否要 ZH PDF | 18 页 FR + ZH | §8.3 |
| OQ-05 | ZH 全量翻译由谁执行、何时交付 | 客户指定译者，D14 交稿 | 完整版 |
| OQ-06 | 阿语是否第二期首发 | 第二期，本期仅 `noindex` 占位 | 预算 +20–25 % |
| OQ-07 | 中国镜像是否启用（L2） | 先测量（大陆 3 城 ×3 次），超阈值再启用 | §9.4 |
| OQ-08 | 分析端点域名与法务意见 | 默认 `analytics.aureondigital.mr`（Worker） | §9.7 |
| OQ-09 | CMS 是否二期上线（Sveltia） | 二期评估，MVP 用 Git PR | §5.7 |
| OQ-10 | 是否有可授权照片/合作方 logo | 无则全 SVG 线稿（BRIEF §6） | 素材 |
| OQ-11 | 是否需要 U 盘离线包 | 建议提供（dist.zip + PDF） | §7.6 |
| OQ-12 | 发布节奏：先 MVP 还是直接完整版 | Lead 建议先 2 周 MVP | §12.1 |

---

> **文档结束** · `web/spec/tech-architecture.md` v1.1 · 2026-11-09 · T3 web-engineer
> 与本文件配套：`web/spec/BRIEF.md`、`web/spec/content-model.md`（T1）、`web/spec/interaction-motion.md`（T2）、`web/spec/visual-system.md`（T2）、`web/PLAN_v1.md`（Lead）。
> 所有实测命令与原始数据见附录 A；预算类数字凡未实测者均标 Hypothèse，构建首周以 CI 实测替换。








