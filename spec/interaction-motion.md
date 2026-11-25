# 交互与动效规格（Interaction & Motion Spec）

> 项目：AUREON DIGITAL · « Plateforme de coopération numérique sino-mauritanienne · RIMU + Contenu IA + Calcul national »
> 版本：v1.1 · 2026-11-09（已与 T1 data-model v1 / T3 tech-architecture v1 对齐：id、路由、6 tab、hero KPI；对齐清单见 §4.6） · 作者：experience-designer（T2）· 状态：待 Lead 合并进 `web/PLAN_v1.md`
> 上游依据：`web/spec/BRIEF.md`（§4 信息架构 / §5 交互模型 / §7 数据基线 / §9 技术约束）、`rimu_source_text.txt`（117 行，本文引用记法 `src:L##`）
> 同级接口：`web/spec/content-model.md`（T1，文案与 id）、`web/spec/data-model.json`（T1，数据键）、`web/spec/tech-architecture.md`（T3，实现与性能）
> 配套文件：`web/spec/visual-system.md`（token、组件、字体、打印版式）。本文出现的颜色、字号、时长、缓动 token 一律引用 visual-system §3/§4/§7 的命名，不在此重复定义数值。

## 目录

- 0. 阅读指南与通用约定
- 1. 全局交互框架（路由 / L1-L2-L3 / 输入模型 / 降级 / 状态）
- 2. 区块规格 00–13（逐块施工图）
- 3. 复杂交互组件深度规格（关系图 / 手机演示 / Mode Pitch / 时间轴 / 地图 / 计数器 / 图表 / 打印 / 低带宽）
- 4. 验收、QA 与假设

---

## 0. 阅读指南与通用约定

### 0.1 谁怎么用这份文件

| 角色 | 用法 |
|---|---|
| 前端 | §1 是全局系统（只实现一次）；§2 是 14 个区块的施工图（逐块实现）；§3 是复杂组件的详细状态机与参数；所有动效参数有 token 名，直接映射 CSS 变量 / GSAP 配置 |
| 设计师 | Figma 画板顺序 = §2 的 00→13；组件规格 = visual-system §8；每个区块的交互态至少画 default / hover / active / open / disabled 五态 |
| Lead | 合并 PLAN 时用 §4.1 覆盖核对表、§4.2 验收清单、§4.3 QA 清单；与 T1/T3 的接口契约见 §4.5 |

### 0.2 引用、数据分级与记号

| 记号 | 含义 |
|---|---|
| `src:L74` | `rimu_source_text.txt` 第 74 行（1-based，读取日期 2026-11-09）。只在关键数字/事实处标注 |
| `BRIEF:§7.1` | `web/spec/BRIEF.md` 对应小节 |
| **Source** | 源文件直接给的数据，网页上不得改动 |
| **Dérivé** | 按 BRIEF §7.2 公式计算出的数据，必须带方法学入口 |
| **Hypothèse** | 我方假设（如筛选默认值、状态标签映射），页面不显示，但文档里必须标出供 Lead/客户确认 |
| `QA-xx` | 数据/事实矛盾或口径风险，见 §4.3；**发现矛盾只记录，不悄悄改数** |
| `A-xx` | 设计假设，见 §0.7；Lead 合并时统一拍板 |
| `DV-x` | 视觉系统的扩展决策（如分类数据色），见 visual-system §3.4，需 Lead 确认 |

### 0.3 断点与设备基线

| Token | 宽度 | 用途 | 布局基准 |
|---|---|---|---|
| `bp-m` | 0–479 | 手机（验收基准 **390×844**） | 4 列 / 20px 页边 / 16px 沟槽 |
| `bp-ml` | 480–767 | 大手机 / 小竖屏 | 4 列 / 24px |
| `bp-t` | 768–1023 | 平板（iPad 竖） | 8 列 / 32px 页边 / 20px 沟槽 |
| `bp-l` | 1024–1439 | 笔记本（基准 1280） | 12 列 / 48px 页边 / 24px 沟槽 |
| `bp-xl` | ≥1440 | 桌面（**设计母版 1440**） | 12 列 / 内容最大 1280 / 居中 |
| `bp-wide` | ≥1920 | 宽屏 | 内容最大 1600，两侧留白，不放大字号 |

高度基准：桌面首屏 900px（1440×900）；移动 844px。触摸最小命中区 44×44px，鼠标 32×32px。全部使用逻辑属性（`margin-inline`、`inset-inline-start`），为阿语 RTL 预留（BRIEF §8，二期）。

### 0.4 三层交互深度（BRIEF §5）

| 层 | 范围 | 目标 | 交互手段 |
|---|---|---|---|
| **L1 总览** | 00 Hero → 01 → 02 系统图，以及 04–13 各区块的卡片矩阵 | 5 秒建立全局：三支柱 + 六业务 + 四层 | 滚动叙事、hover/focus 关联高亮、点击下钻、区块导航 |
| **L2 抽屉** | 任意业务 / 支柱 / RIMU 模块 / 架构层 / 五类流 / 方法学 | 不离开上下文看细节 | 右侧 480–560px 抽屉（移动 92svh 底部 sheet），固定 6 tab，URL 深链，浏览器返回可关 |
| **L3 抽屉内下钻** | tab 内的子模块、流程步骤、指标明细 | 再深一层仍不丢上下文 | 手风琴 / 子卡片 / 二级条目，不跳新页面；L3 状态不进 URL（A-04） |

禁止（BRIEF §5）：无意义 3D、自动播放声音、点击后全屏跳转丢上下文、超 2 层嵌套抽屉（抽屉里再开抽屉禁止；用内容替换 + 返回）。

### 0.5 交互状态命名（统一状态机）

所有可交互组件必须实现下列状态中的相关子集，命名一致便于 CSS class / data 属性：

| 状态 | data 属性 / class | 触发 | 必现反馈 |
|---|---|---|---|
| closed | `data-state="closed"` | 初始 | 无 |
| opening | `data-state="opening"` | 打开动作 | 入场动画中，输入可中断 |
| open | `data-state="open"` | 动画结束 | 内容可聚焦、可滚动 |
| closing | `data-state="closing"` | 关闭动作 | 退场动画中，禁止再次触发 |
| hover | `:hover`（仅 `(hover:hover) and (pointer:fine)`） | 指针悬停 | 边框/金色线/亮度变化，≤240ms |
| focus-visible | `:focus-visible` | 键盘/辅助技术聚焦 | 2px 金色焦点环，offset 2px，不允许 outline:none 无替代 |
| active | `:active` | 按下 | 位移 1px 或亮度 -6%，≤120ms |
| selected | `aria-selected="true"` / `aria-pressed="true"` | 选择态 | 金色下划线 + 文字提亮（不新增强调色） |
| disabled | `aria-disabled="true"` | 数据缺失/不可用 | 40% 不透明度 + `cursor:not-allowed` + 说明性 tooltip |
| loading | `data-state="loading"` | 异步数据（仅关系图 JSON、图表） | 金色细线进度或静态占位，不用骨架屏闪烁 |
| empty / error | `data-state="empty"/"error"` | 见 §1.9 | 文字说明 + 恢复路径按钮 |

### 0.6 三态降级开关（DOM 约定）

```
html[data-lang="fr"|"zh"]        语言（默认 fr）
html[data-motion="full"|"reduced"]  动效（默认跟随 prefers-reduced-motion）
html[data-bw="normal"|"low"]     带宽模式（默认 normal，saveData/2G 自动进入 low）
section[data-tone="dark"|"light"]   区块明暗节奏（见 visual-system §9）
@media print                      打印态（最高优先级）
```

优先级：**print > reduced-motion > low-bandwidth > full**。任意组合下页面必须可读、可导航、数据完整。
手动开关（页脚与 13 区块）：`Réduire les animations`（aria-pressed）、`Mode économie de données`。持久化到 `localStorage`：`aureon.motion`、`aureon.bw`、`aureon.lang`；URL 参数 `?lang=zh`、`?bw=low`、`?motion=reduced` 优先于 localStorage，便于演示与 QA。

### 0.7 设计假设（A-01…A-10，供 Lead 合并时确认）

| # | 假设 | 理由 / 影响 |
|---|---|---|
| A-01 | 路由用 **hash 模式**（如 `#/business/finance-rimp`、`#/pillar/rimu`、`#/rimu/live`；见 §1.1 与 T1 `meta.routes`），静态托管无需服务端重写；原生锚点（`#09-chiffres-2031`）与 hash 路由共存，路由只接管以 `#/` 开头的 hash | BRIEF §5 明确要求可分享 hash；Cloudflare Pages 无需配置；业务/支柱/模块 id 以 T1 去前缀 slug 为准（§4.6） |
| A-02 | **所有抽屉类型统一固定 6 tab**（业务 / 支柱 / RIMU 模块 / 层级 / 流；与 T1 `pillars[].drawerTabs` 一致）：`Aperçu / Fonctionnement / Chiffres clés / Acteurs & flux / Feuille de route / Risques`；某类型无对应内容时该 tab 仍显示、内容为「信息未公开」空态 | 遵守 BRIEF §5「抽屉固定 6 个 tab」；保持结构一致，新增业务/支柱不改组件 |
| A-03 | 方法学入口 = 独立小抽屉（2 章：Définitions & formules / Sources & limites），不进 6 tab 模板 | BRIEF 只要求「方法学入口」；避免污染业务抽屉 tab 一致性 |
| A-04 | L3 手风琴状态不写入 URL（v1）；tab 层级写入 | 避免 URL 爆炸；L3 深度内容可通过「Copier le lien」落到对应 tab |
| A-05 | 关系图采用**手工坐标布局**（非力导向），每个 flow 视图 1 套坐标 | 稳定、可打印、Tour 可预测；力导向每次结果不同，不利于讲解 |
| A-06 | RIMU 手机演示用 **DOM/SVG 搭屏**，不用视频 | 可本地化、可打印、低带宽可用、体积小 |
| A-07 | Mode Pitch 固定 7 个场景 / 180 秒（见 §3.5），进度按场景分段 | BRIEF 要求 6–8 个场景 / 3 分钟 |
| A-08 | 计数器默认只播 1 次/页面会话；仪表盘组提供「Rejouer」按钮；进入 `hidden` 状态 8 秒后重新武装（仅 Hero 与 09 允许） | BRIEF「进入视口触发一次（回看可重播）」的折中，兼顾庄重与可控 |
| A-09 | 打印附录（6 页业务详情 + 方法学）由构建期用同一 JSON 生成 print-only 节；屏幕不加载这些节点 | 满足「打印成提案册」且不重复维护文案；需 T3 在构建脚本支持 |
| A-10 | 五类流使用分类色（包括钢蓝、赭铜各 1 色），仅用于数据可视化，不用于 UI 装饰；绿色面积 ≤10% | 满足 5 类可区分 + BRIEF 的色彩配额；见 visual-system §3.4 / DV-1 |

---

## 1. 全局交互框架

### 1.1 路由与深链

#### 路由表

| Pattern | 示例 | 触发 | 行为 | History 策略 |
|---|---|---|---|---|
| `#/` | — | 关闭抽屉 / 首页 | 关闭 L2，回 L1 | 若当前有抽屉 → `history.back()`；否则 replace |
| `#/business/{id}` | `#/business/finance-rimp` | 04 卡片、02 节点、07 节点、Tour | 打开业务抽屉，tab=Aperçu | pushState |
| `#/business/{id}/{tab}` | `#/business/rimu/chiffres` | 抽屉 tab 点击 / L2 分享 | 切换 tab，内容交叉淡入 | replaceState |
| `#/pillar/{id}` | `#/pillar/calcul` | 03 支柱卡、00 支柱、02 支柱节点 | 支柱抽屉（默认 Aperçu） | pushState |
| `#/rimu/{id}` | `#/rimu/live-commerce` | 05 RIMU 模块卡、手机 tab 长按「Voir le détail」 | 模块抽屉 | pushState |
| `#/layer/{id}` | `#/layer/middleware` | 06 四层架构带 | 架构层抽屉 | pushState |
| `#/flow/{id}` | `#/flow/paiements` | 07 关系图连线点击 | 流抽屉（Acteurs & flux 优先） | pushState |
| `#/relations/{flowId}` | `#/relations/attention` | 分享筛选后的关系图 | 滚动至 07 并预设筛选 | replaceState |
| `#/methodo` | — | 09 方法学入口、页脚 | 方法学小抽屉 | pushState |
| `#/tour` / `#/tour/{1–7}` | `#/tour/3` | CTA「Visite guidée 3 min」/ 进程 | 启动 / 定位 Mode Pitch 场景 | 启动 push，场景推进 replace |
| `#/s/{sectionId}` | `#/s/09-chiffres-2031` | 顶部导航、手机菜单、页脚 | 平滑滚动到区块，关闭抽屉 | replaceState |
| `#/print` | — | 导航「Imprimer」 | 打开打印准备态 → `window.print()` → replace `#/` | replaceState |
| 原生锚点 `#chiffres-2031` | — | 打印册二维码 / 外部链接 | 浏览器原生滚动；路由器不接管 | 不动 |

固定 slug 表（与 T1 content-model 对齐；**Lead 合并时以 T1 文件为准，若 T1 不同则以 T1 覆盖本表**）：

| 类型 | ids（以 T1 data-model 为准；公共路由去掉内部前缀） |
|---|---|
| 业务 lines（04） | `projets` / `commerce-gros` / `biens-conso` / `finance-rimp` / `formation` / `sante` |
| 支柱（03） | `plateforme` / `rimu` / `calcul` |
| 架构层（06） | `experience` / `middleware` / `intelligent` / `infrastructure` |
| 五类流（07） | `capital` / `marchandises` / `paiements` / `donnees` / `attention` |
| 抽屉 tab | `apercu` / `fonctionnement` / `chiffres` / `acteurs` / `feuille-route` / `risques` |
| 区块锚点（`#/s/{blockId}`） | `00-hero` / `01-constat` / `02-vue-systeme` / `03-piliers` / `04-business-lines` / `05-rimu` / `06-contenu-calcul` / `07-relations` / `08-roadmap` / `09-chiffres-2031` / `10-benefices` / `11-soutiens-etat` / `12-risques` / `13-next-steps`（= T1 `meta.blockIds`） |
| RIMU 模块（05） | `live` / `studio` / `creation` / `shop` / `jobs` / `verifie` / `mineurs` / `souverainete`（= T1 `rimuModules` 去 `rimu.` 前缀） |

**路由实现规则**

1. 路由器只响应 `hashchange` / `popstate` 中 `#/` 前缀的 hash；否则交给浏览器原生锚点。
2. **打开抽屉必须 pushState**（带 `{ drawer: {type, id, tab}, from: 入口元素 id }` 状态）；关闭抽屉时：若 `history.state.drawer` 存在且 `history.length > 1` → `history.back()`；否则 `replaceState('#/')`。禁止直接 `replaceState('#/')` 造成「返回键跳到上一个站点」。
3. **tab 切换用 replaceState**，不产生额外历史（否则浏览器返回要点 6 次才关掉）。
4. 抽屉内跳转到另一个节点（「Voir aussi」）→ pushState，内容区 160ms 交叉淡入（不重放打开动画）；后退逐层返回。
5. 冷启动命中深链：等 `DOMContentLoaded` + `document.fonts.ready` + 1 帧后打开抽屉；**保留入场动画**（reduced-motion 时直接呈现）；不滚动页面。
6. 未知 id：抽屉不打开；`replaceState('#/')`；右下角 toast「Contenu introuvable — retour à la vue d'ensemble」3 秒自动消失。
7. 语言、带宽、动效偏好：`?lang=` 等 query 参数优先；切换语言不改变 hash，不关闭抽屉，只重渲染文案与数字（`html[lang]` 切换 + 200ms 交叉淡入）。
8. `history.scrollRestoration = 'manual'`；关闭抽屉后回到打开前的滚动位置（记录 `scrollY`，用 `behavior:'instant'` 还原，禁止平滑滚动回跳）。
9. 抽屉 header 的「Copier le lien」复制 `location.origin + location.pathname + location.hash`，toast「Lien copié」，键盘可触发。
10. 分享 / OG：每类抽屉可生成静态 OG 变体（T3 构建期）：`/og/business-{id}.png` 1200×630；页面 `<title>` 随抽屉切换更新为「{Nom} · AUREON × RIMU」。

### 1.2 动效触发与编排规则

#### 触发类型（所有动效必须声明其一）

| Trigger | 定义 | 实现 | 默认参数 |
|---|---|---|---|
| `LOAD` | 首屏加载完成（字体就绪后） | JS 时间线 | 见各区块 |
| `ENTER` | 元素进入视口 ≥35% 首次 | IntersectionObserver, `threshold:[0,0.35,1]` | 一次；A-08 例外可重新武装 |
| `SCRUB` | 滚动进度驱动（**仅允许 Hero 背景做 0–0.15 视差**） | ScrollTrigger scrub:0.5 / scroll-linked rAF | 移动端关闭 |
| `HOVER` / `FOCUS` | 指针悬停 / 键盘聚焦 | CSS 或 GSAP quickTo | ≤240ms |
| `PRESS` | 按下 | CSS `:active` | ≤120ms |
| `OPEN` / `CLOSE` | 抽屉、手风琴、菜单、Tour | 状态机 + GSAP | 见 §1.4 / §3 |
| `STATE` | tab 切换、筛选、轨道切换 | 状态机 + 交叉淡入 | 160–280ms |
| `AUTO` | 定时循环（手机演示 8s、Hero 粒子、地图粒子） | rAF/时间线，页面隐藏时暂停 | 仅装饰，必须可暂停 |
| `TOUR` | Mode Pitch 强制编排 | Tour 控制器调用组件 API | 见 §3.5 |

#### 全局编排规则（前端按此执行，设计按此画分镜）

1. **进入动效三件套**：opacity 0→1 + translateY 24px→0（永远从下方来）；duration 640ms；easing `--ease-out`（visual-system §7）；stagger 70ms；同屏同时运动元素 ≤6 个；结束态必须精确等于静态设计稿（无残留 transform/opacity）。
2. 层级顺序：先背景/线（0ms），再标题（+80ms），再正文/卡片（+160ms 起 stagger），最后数据/计数器（+240ms 起）。一个区块的总入场时间 ≤900ms。
3. 不在入场动画里做 `filter`、`box-shadow`、`width/height` 动画；只动 `transform`/`opacity`；手风琴高度动画例外（`height:auto` 用 FLIP 或 grid-template-rows 0fr→1fr，280ms）。
4. 字体未就绪不启动计数器与宽度依赖动画（`document.fonts.ready.then(...)`），避免数字/文本宽度跳动。
5. `document.hidden` 或 `IntersectionObserver` 不可见 → 暂停所有 AUTO 循环与粒子；恢复时从暂停点继续（不得重新计时）。
6. 页面滚动期间，同一时刻只允许一个区块的入场时间线运行；上一个区块动画未完成时，新进入的区块延迟到下一帧启动。
7. 所有 `once` 动效在 `reduced-motion` 下变成：**opacity 0→1，120ms，无位移、无 stagger**（或直接呈现，见 §1.8）。在 `print` 下变成：**直接呈现**。
8. 移动端（`bp-m`）：取消视差、取消 stagger 超过 4 个、位移从 24px 降到 12px；复杂 SVG 动画降级为「静态 + 单次淡入」。
9. 交互反馈不得排队：快速连续 hover 以最后一次为准（GSAP `quickTo`，避免 tween 堆积）。
10. 所有动效可被 `data-motion=reduced` 与 `prefers-reduced-motion: reduce` 同时关闭（二选一即触发）。

### 1.3 L1 总览层

- **构成**：00 Hero（定位 + 4 KPI + 双 CTA）→ 01 Constat（为什么）→ 02 Vue système（一屏全球图）；04–13 属于「自由探索」，但保持同一导航与进度反馈。
- **全局导航（sticky header）**：左 logo（`assets/logo-mark.svg`，高 22px）；中段区块进度（桌面显示 14 个刻度 + 当前标签；移动显示进度条 `aria-hidden`）；右侧：`FR / 中文` 切换、`Imprimer`、`Visite guidée`。滚动向下隐藏（translateY -100%，240ms），向上或停在顶部显示；键盘聚焦时始终显示。
- **阅读进度**：页面顶部 2px 金色线，`transform: scaleX(progress)`，rAF 节流；reduced-motion 下仍保留（进度是信息，不是装饰），但更新频率降为每秒 1 次。
- **区块导航（移动端菜单）**：全屏 sheet，14 个区块按 5 幕分组（BRIEF §3），点击后关闭菜单并滚动，焦点移到目标区块标题（`tabindex="-1"`）。
- **L1 交互原则**：hover/focus 只做「关联高亮」，不做位移；点击一律进入 L2 或滚动，不做全屏切换。
- **5 秒可读性验收**：视口 1440×900，首屏必须同时出现：主标语、三支柱名称、至少 2 个 KPI、1 个 CTA。移动 390×844 首屏：主标语、三支柱（紧凑行）、1 个 CTA、滚动提示。

### 1.4 L2 业务详情抽屉（全局唯一实例）

> 全站只挂载一个抽屉 DOM（`#drawer`），所有入口通过路由器打开同一实例，避免多个抽屉叠层。内容由 `data-model.json` 按类型注入。6 tab 的内容结构见 §3.2。

#### 结构与栅格（桌面）

```
┌──────────────────────── viewport ────────────────────────┐
│ 页面（滚动锁定，压暗 + 关联节点聚光）                        │
│                                        ┌── drawer 480–560 ─┐│
│                                        │ header (sticky)   ││
│                                        │ title / meta / X  ││
│                                        │ tablist (sticky)  ││
│                                        │ scroll region     ││
│                                        │  ... L3 内容 ...   ││
│                                        └───────────────────┘│
└──────────────────────────────────────────────────────────┘
```

| 项 | 规格 |
|---|---|
| 宽度 | `clamp(480px, 38vw, 560px)`；`inset-block:0`；`inset-inline-end:0` |
| 背景 | 象牙白 `--surface-ivory`（浅色编辑式）；与当前区块明暗无关（抽屉永远是纸质感浅色，形成「文件」比喻） |
| 边框 | 左侧 1px 金色 `--line-gold`；无圆角（桌面） |
| 层级 | backdrop `z-index:200`；drawer `201`；spotlight 层 `202`；toast `400` |
| header | 高 96px 起，滚动后压缩到 72px（280ms）；含 kicker（type + id）、H2 标题、状态徽章、关闭按钮 44×44 |
| tablist | 6 等分；移动端横向滚动，两侧金色渐隐遮罩；高 48px；下划线 2px 金色 |
| 内容 | 上下 padding 40px / 32px；正文 measure ≤ 68ch；底部 48px + safe-area |
| 滚动 | 抽屉内部滚动（`overscroll-behavior: contain`）；body 锁定 |

#### 打开 / 关闭动画（桌面）

| 阶段 | 元素 | 属性 | 参数 |
|---|---|---|---|
| 1 | backdrop | opacity 0→1，背景 `rgba(5,18,31,.58)` | 240ms `--ease-out` |
| 2 | panel | `translateX(100%)`→`translateX(0)` | 420ms `--ease-drawer`（cubic-bezier(0.32,0.72,0,1)） |
| 3 | header 内容（kicker/title/meta） | opacity 0→1，y 12px→0，stagger 40ms | 起始 160ms，每个 280ms |
| 4 | tablist + 正文首屏 | opacity 0→1，y 8px→0 | 起始 260ms，300ms |
| 关闭 1 | panel | translateX(0)→100% | 280ms `--ease-in` |
| 关闭 2 | backdrop | opacity 1→0 | 200ms，延迟 80ms |
| 关闭 3 | 焦点 | 回到触发元素（`from` 记录） | 动画结束后立即 |

移动端（`bp-m`）：backdrop 200ms；sheet `translateY(100%)`→0，380ms `--ease-drawer`；关闭 280ms。reduced-motion：时长统一 1ms（直接呈现），backdrop 仍淡入 120ms（避免突变）。

#### 背景压暗与关联节点高亮

1. 打开时给 `<main>` 加 `inert`（不支持时 `aria-hidden="true"`），并锁定滚动：`overflow:hidden` + `scrollbar-gutter: stable` 或 padding 补偿，防止页面横跳。
2. **spotlight 层**：抽屉打开瞬间读取当前入口节点（以及 data-model 里该节点的 `relatedNodes`）在视口中的 `getBoundingClientRect()`，在 spotlight 层（fixed, z 202, `pointer-events:none`）绘制：金色 1px 描边框（外扩 8px）+ 12×12 金色角标 + 节点名 chip（背景 `--navy-900`，文字象牙白，11px uppercase）。最多高亮 3 个节点；若入口在视口外则不画。滚动已锁定，无需持续同步；仅在 `resize`（debounce 150ms）与字体加载完成后重算。
3. 高亮变化：进入时 opacity 0→1 240ms（延迟 200ms，与抽屉同步）；关闭时 160ms 淡出。reduced-motion：直接显示。
4. 视觉替代（若 spotlight 实现成本高）：让相关卡片在遮罩之上重新绘制一份「ghost 轮廓」；禁止用 `filter: brightness` 压暗整页（会破坏 fixed 子层）。**前端可先实现 ghost 轮廓，二期再做透窗**（A-11，低风险）。

#### 焦点与无障碍

- `role="dialog"` `aria-modal="true"` `aria-labelledby="drawer-title"`。
- 打开后聚焦 `.drawer__title`（`tabindex="-1"`）；Tab 在抽屉内循环（首尾闭环）；`Shift+Tab` 到 header 关闭按钮不跳出。
- `Esc` 关闭（等同关闭按钮）；关闭后焦点回到触发元素；若触发元素已不在 DOM（如 Tour 打开），焦点落到该区块标题。
- tablist 使用 ARIA Tabs 模式：`role="tablist"`、`role="tab"`、`aria-controls`、`aria-selected`；`←/→` 移动、`Home/End`、`Enter/Space` 激活；roving tabindex。
- 内容区 `role="region"` `tabindex="0"` `aria-label="{tab 名}"`，支持键盘滚动（PageUp/Down）。
- 屏幕阅读器公告：打开时 `aria-live="polite"` 播报「{Nom} — panneau de détail ouvert」；tab 切换播报「{tab 名}」。
- 对比度：抽屉浅底文字使用 `--ink`/`--ink-muted`（≥7:1 / ≥4.5:1）；金色只做线与小标签（≥4.5:1 用 `--gold-deep`）。

#### Tab 切换

- 点击/键盘激活 → 内容交叉淡入：旧内容 opacity 1→0 / y 0→-6px（120ms），新内容 opacity 0→1 / y 8px→0（起始 120ms，220ms）；下划线 `translateX` 定位 240ms `--ease-out`；tablist 不重排。
- 每个 tab 首次进入才初始化其图表/计数器（懒初始化），切换回来保持状态（滚动位置重置到 tab 顶部，除非同 tab 内 L3 定位）。
- URL `replaceState`；若用户按住 `Ctrl/Cmd` 点击 tab → 新标签页打开深链（`target` 行为由原生 `<a>` 承载，tab 用 `<a href="#/business/{id}/{tab}">` + preventDefault）。

#### 关闭路径（全部必须实现）

| 路径 | 行为 | History |
|---|---|---|
| 关闭按钮 / `Esc` | 播放关闭动画 → 关 | 见 1.1 规则 2 |
| 点击 backdrop（桌面） | 同关闭按钮 | 同上 |
| 移动端下滑（drag-to-dismiss） | 见下 | 同上 |
| 浏览器返回 | popstate → 直接播放关闭动画 | 浏览器已处理 |
| 浏览器前进到抽屉 URL | popstate → 打开（无入场动画，160ms 淡入） | 浏览器已处理 |
| 导航到其他区块（#/s/） | 先关抽屉，再滚动 | replace |
| 打印 | 不关闭；打印时隐藏抽屉外壳，只打印当前 tab 内容到附录（见 §3.10） | 不变 |
| 语言切换 | 不关闭，内容重渲染 | 不变 |

移动端 drag-to-dismiss 规格：仅在内容区滚动到顶部（`scrollTop===0`）时允许向下拖拽面板；跟手位移 `translateY = max(0, dy)`，超过 120px 后阻尼系数 0.4；松手时 `dy > 120` 或速度 > 0.5px/ms → 关闭，否则弹簧回位（240ms `--ease-out`）；拖拽中 backdrop opacity 按 `1 - min(dy/600, .6)` 变化；拖拽手柄 36×4px（`--gold`，圆角 2px，距顶 8px）。reduced-motion：无跟手动画，仅按钮关闭。

#### 状态与错误

| 情况 | 表现 |
|---|---|
| id 存在、tab 有数据 | 正常 |
| tab 无数据 | tab 仍显示；内容区显示空态（visual-system §8.20）：「Cette section sera complétée en phase de pré-étude.」+ 关联链接（跳到有内容的 tab）+ Source 标注 |
| 整个 id 无数据 | 打开失败：replace `#/`，toast「Contenu introuvable」 |
| 数据 JSON 加载失败 | 使用 SSG 内联的首屏数据；后台重试 1 次；仍失败则隐藏图表，显示「Données indisponibles」+ 打印按钮 |
| 关闭动画中再次点击入口 | 忽略新打开请求，直到 `closed`（状态机保护）；URL 以最终状态为准 |

### 1.5 L3 抽屉内下钻

- **组件**：手风琴（单开，允许 0 个展开），或子卡片网格（若内容为并列的 3–6 项）。同一 tab 内两种都不得再嵌套第三层可点击展开。
- **动画**：高度动画 280ms `--ease-out`（`grid-template-rows: 0fr→1fr` 或 JS FLIP）；图标旋转 90°，240ms；内容 opacity 0→1 延迟 80ms。reduced-motion：无高度动画（瞬时开合），图标不旋转。
- **状态**：`aria-expanded`、`aria-controls`；默认全部收起；同组只允许一个展开（再次点击收起）。tab 切换后重置收起状态。
- **键盘**：`Enter/Space` 开合，`↑/↓` 在标题间移动，`Home/End` 首尾。
- **滚动**：展开后若内容超出视口，抽屉内容区滚动使展开项标题保持可见（`scrollIntoView({block:'start'})`，行为 `smooth` 仅 full motion）。
- **L3 内容类型**（与 T1 对齐）：
  - 子模块卡（`business.modules[]`）
  - 流程步骤（`business.workflow[]`，1–5 步，竖向带金色连接线）
  - KPI 明细表（`business.kpis[]` + source 标注）
  - 参与方列表（`business.actors[]`，角色 + 中文对照）
  - 风险条目（`business.risks[]`，严重度 1–3）
- **禁止**：L3 内再打开抽屉；L3 内跳转其他业务用「Voir aussi」卡片 → 直接替换当前抽屉内容（pushState，见 1.4 规则 4）。

### 1.6 指针 / 触控 / 键盘输入模型

| 输入 | 规则 |
|---|---|
| 鼠标 hover | 仅 `@media (hover:hover) and (pointer:fine)` 生效；触屏不出现粘滞 hover；hover 反馈 ≤240ms；离开立即回退（不延迟） |
| 鼠标点击 | 节点/卡片整块可点（`<a>` 或 `<button>` 包住可点区域）；卡片内独立链接（如「Voir la méthodologie」）用 `event.stopPropagation()` |
| 触控 tap | 首次 tap 即触发（不做「hover 预览」）；命中区 ≥44px；图谱节点命中区 ≥48px（不可见透明外扩） |
| 触控滑动 | 垂直滚动优先；抽屉下滑关；图谱在「增强模式」下可拖拽平移；不做左右滑动切 tab（避免与横滚混叠） |
| 双指缩放 | 关系图（移动增强模式）允许 1×–2.5×；页面其余区域禁止 `user-scalable=no`（保持浏览器默认可缩放，满足 WCAG） |
| 键盘 | 全站可完成：导航、打开/关闭抽屉、切 tab、开合 L3、启动/暂停 Tour、关系图（节点 tab 顺序 + 列表替代）、时间轴、地图（列表替代）、打印 |
| 辅助技术 | 语义化标题层级；所有装饰 SVG `aria-hidden="true"`；复杂图提供文本等价物（表格/列表），视觉隐藏但可聚焦展开 |
| 指针形状 | 默认 `default`；可点 `pointer`；图谱拖拽 `grab/grabbing`；禁用状态 `not-allowed`；文本可选 |

### 1.7 键盘地图

| 作用域 | 键 | 行为 |
|---|---|---|
| 全局 | `Tab / Shift+Tab` | 正常焦点顺序；首个 Tab 出现「Aller au contenu / Aller à la navigation」skip links |
| 全局 | `Esc` | 关闭最上层：Tour > 抽屉 > 菜单 > toast；逐层关闭，不一次全关 |
| 抽屉 | `Tab` 循环 | focus trap 闭环（关闭按钮 → header 链接 → tablist → 内容 → 回到关闭按钮） |
| 抽屉 tablist | `← / → / Home / End` | 移动焦点；`Enter/Space` 激活（自动激活模式，移动即激活可选，推荐自动激活） |
| 抽屉内容 | `PageUp/PageDown` `Space` | 滚动内容区（当焦点在 region 上） |
| L3 手风琴 | `Enter/Space` / `↑↓` / `Home/End` | 开合 / 移动 / 首尾 |
| 关系图 | `Tab` 顺序遍历可见节点；`Enter/Space` 打开抽屉；`I` 切换 isolate（聚焦模式）；`Esc` 退出聚焦 | 图容器 `role="application"` 仅在增强模式下使用；默认提供列表视图保证可达 |
| 时间轴 | `← / →` 切换轨道（roving tabindex）；`Enter/Space` 展开里程碑 | 轨道控件为 `role="tablist"` |
| 地图 | `Tab` 逐国；`Enter` 展开信息卡；`Esc` 收起 | 另有列表视图 |
| Tour | `Space` 暂停/继续；`← / →` 上一/下一场景；`Esc` 退出；`Home/End` 首尾场景 | 焦点限制在 Tour 控制条内；场景切换通过 `aria-live="polite"` 播报 |
| 语言切换 | `Enter/Space` | 切换并更新 `html[lang]`；按钮 `aria-pressed` |
| 打印 | `Ctrl/Cmd+P` | 走原生打印，`beforeprint` 钩子展开所有内容（见 §3.10） |

### 1.8 降级矩阵（必须逐项实现）

| 组件 | full motion | reduced-motion | low-bandwidth | print | no-JS |
|---|---|---|---|---|---|
| Hero 粒子/连线 | Canvas 60–90 点 + 3 条流线，30–60fps | **静态 SVG**：3 条金色弧线 + 点阵纹理 | 静态 SVG（同 reduced） | 静态 SVG 作背景（封面页） | 静态 SVG（SSR 内联） |
| 进入动效 | y24 + fade + stagger | 仅 fade 120ms / 或直接呈现 | 仅 fade 160ms | 直接呈现 | 直接呈现 |
| 计数器 | 1400ms 滚动 | 直接显示最终值+SR 文案 | 直接显示最终值 | 最终值 | 最终值（SSR） |
| 关系图粒子 | 沿路径运动 | 静态虚线 + 箭头 | 静态虚线 | 静态虚线（灰度可辨） | 静态 SVG/列表 |
| 手机 mockup 演示 | 8s 自动循环 | 手动 4 帧切换，无自动 | 静态合成图（4 tab 拼图） | 静态首帧 + tab 列表 | 静态 SVG 首帧 |
| Mode Pitch | 自动滚动 + callout 动效 | 可用，但场景淡入 120ms、无平滑滚动（瞬时定位） | 不自动播放；显示「引导需要完整版」入口，可手动逐场景 | 不打印（仅打印 CTA 二维码） | 隐藏入口；提供「阅读顺序」编号 |
| 时间轴绘制 | 轨道/里程碑依次出现 | 直接呈现 | 直接呈现 | 直接呈现 | SSR 直接呈现 |
| 地图流向 | 粒子 + 弧线 draw | 静态弧线 | 静态弧线 | 静态 | 静态（SSR） |
| 抽屉动画 | 420ms 滑入 | 1ms 呈现 | 200ms 淡入 | 隐藏外壳 | 占位链接出现（详情章节） |
| 图表 draw-on | 900ms | 直接呈现 | 直接呈现 | 直接呈现 | SSR 直接呈现 |
| 视差（仅 Hero 背景） | 0–80px | 关闭 | 关闭 | 关闭 | 关闭 |
| 平滑滚动（Lenis） | 启用（桌面） | 关闭（原生滚动） | 关闭 | 关闭 | 原生 |

### 1.9 加载、空态、错误态

| 场景 | 规格 |
|---|---|
| 页面加载 | SSR/SSG 首屏直接出现内容；不设全屏 loader；字体 200ms 内未就绪用 fallback 栈先渲染（`font-display: swap`），就绪后不重排（metrics override，见 visual-system §4.2） |
| 关系图数据 | 静态 HTML 先渲染手工 SVG（构建期生成）；仅交互增强依赖 JSON；JSON 失败 → 保留静态 SVG、禁用粒子/筛选并显示「Mode simplifié」小标签 |
| 图表 | 容器先占位（固定宽高比，防 CLS）；数据为空 → 隐藏图形，显示说明 + 「Voir la méthodologie」按钮；数据错误 → 同上 + `console.warn`（不向用户暴露技术错误） |
| 抽屉未知/无数据 | 见 §1.4 状态表 |
| Tour 不可用 | 若 motion=reduced 仍可用（瞬时）；若 JS 失败 → 隐藏 CTA，保留「阅读 Ordre de lecture」编号（区块序号 00–13） |
| 空态统一文案 | FR: « Information non disponible à ce stade. » / « Donnée à confirmer — phase de pré-étude. »；ZH：「该信息阶段未公开 / 待可研确认」。**不出现「Coming soon」等营销词** |
| 离线 | 静态资源缓存后应可浏览；离线时隐藏实时交互（无后端依赖） |

### 1.10 动效性能预算

| 指标 | 预算 | 测量方法 |
|---|---|---|
| 首屏 JS 执行 | ≤ 120ms（中端安卓） | Lighthouse / Performance |
| 首屏动效（LOAD 序列） | ≤ 2.2s 完成，不阻塞可交互（LCP 元素不参与位移） | PerformanceObserver |
| 同屏动画元素 | ≤ 6 个；粒子总数 ≤ 120（Hero 90 + 图 20 + 地图 10） | 代码审查 |
| 粒子 fps | 60fps 目标；连续 2s <45fps 自动降级为静态（运行时自检，`requestAnimationFrame` 计时） | 运行时降级 |
| 绘制层 | 只用 transform/opacity；SVG 粒子 ≤ 30 节点同时动画 | 代码审查 |
| 图片/视频 | 本页面无视频；所有插画为 SVG；OG 图静态 | — |
| 主线程长任务 | 无 >50ms 长任务（字体/图表初始化分片执行） | PerformanceObserver |
| 内存 | 关闭抽屉后释放图表实例与 spotlight 节点引用 | 手测 |

### 1.11 埋点（可选，隐私友好，无 cookie）

| 事件名 | 触发 | 载荷（非个人） |
|---|---|---|
| `section_view` | 区块进入 ≥50% 停留 ≥2s | sectionId |
| `drawer_open` / `drawer_tab` | 抽屉打开 / 切 tab | type, id, tab |
| `tour_start` / `tour_scene` / `tour_complete` / `tour_exit` | Tour | sceneIndex, elapsed |
| `flow_filter` | 关系图筛选 | flowId |
| `print_click` / `pdf_download` | 打印 / PDF | lang |
| `lang_switch` | 语言切换 | from, to |
| `bw_toggle` / `motion_toggle` | 降级开关 | value |

实现：`navigator.sendBeacon` 到 Cloudflare Analytics 或自建轻量端点；尊重 Do Not Track；不采集 IP 明文（T3 决定）。埋点失败不得影响页面（`try/catch`）。


---

## 2. 区块规格 00–13

> 每块固定 9 小节：布局结构 / 内容层级 / 进入与滚动动效 / 交互状态 / 点击行为与深链 / 移动端（390）/ 降级 / 数据与空态 / 验收要点。
> 动效参数：`t` = 时长 ms，`e` = 缓动，`d` = 延迟 ms，`s` = stagger ms。缓动默认 `--ease-out`（visual-system §7）。所有表格中「结束态」= 动画完成后必须与静态设计稿像素一致。

### 2.0 区块 00 · Hero — « Une plateforme. Trois souverainetés. »

**定位**：3 秒说清「是什么 / 给谁 / 凭什么」；BRIEF §4 区块 00。

#### 布局结构

- `<section id="hero" data-tone="dark" data-section="00">`，高 `100svh`（≥768 用 `min(100svh, 900px)`），深海军蓝渐变底 `--bg-hero`，内容最大宽度 1280 居中。
- 层级：`z0` 背景画布（连线/粒子，见 visual-system §8.16）→ `z1` 安全印刷纹理层（guilloche 弧线 + 1px 网格，opacity ≤0.10，`pointer-events:none`）→ `z2` 内容栅格 → `z3` 底部 KPI 条 → 全局 header 独立于区块之上。
- 内容栅格（桌面 12 列）：左侧 `cols 1–7`：kicker → H1（3 行）→ 副标语 → 三支柱 chips 行；右侧 `cols 9–12`：竖向「03 · 14」目录刻度 + 一个 320px 的圆形标志几何（logo 双环线稿，极低透明度，作为构图锚点）。KPI 条贴底，4 等分横排，上方 1px 金色分割线。
- 移动（390）：单列，左右 20px；H1 44px/1.02；三支柱 chips 改为 3 行紧凑列表（金色左轨 1px + 名称 + 一句话）；CTA 上下堆叠全宽；KPI 2×2 网格贴底；隐藏右侧几何。

#### 内容层级（FR 建议 / ZH 对照）

1. kicker：`DOSSIER DE COOPÉRATION · 2026`（11px uppercase，金色，字距 .22em）
2. H1：`Une plateforme.\nTrois souverainetés.`（Didot/Playfair，96px 桌面 / 44px 移动；ZH：「一个平台，三重主权。」）
3. 副标语（≤120 字符）：`Le point d'entrée officiel de la coopération sino-mauritanienne : une plateforme bilatérale, une super-application nationale, un socle de calcul souverain.`（ZH：「中毛合作官方入口：双边平台、国民级超级应用、主权算力底座。」）
4. 三支柱 chips：Plateforme bilatérale / RIMU / Centre de calcul IA（各带 12px 一行注释）
5. CTA：主 `Visite guidée · 3 min`；次 `Voir les chiffres 2031`
6. KPI 条 4 项（2031，**Source**；与 T1 `data-model.json → meta.heroKpis` 对齐，DAU/时长保留在 09 仪表盘）：
   - `2,5 M` utilisateurs actifs mensuels — src:L72
   - `150–220 M USD` de revenus annuels — src:L82
   - `2,8 M` comptes portefeuille RIMP — src:L73（QA-02）
   - `30–40 k` emplois directs + écosystème sur 5 ans — src:L97（QA-03）
7. 微标注（10px，象牙白 42%）：`Scénario ambitieux · données projetées 2031 · méthodologie`（链到 `#/methodo`）

#### 进入与滚动动效

| # | 元素 | trigger | 属性 | from → to | t | e | d | s | 结束态 |
|---|---|---|---|---|---|---|---|---|---|
| H1 | 背景画布 | LOAD | opacity；AUTO 流线 | 0 → 1；粒子循环 | 1200 | linear | 0 | — | 粒子常驻 |
| H2 | kicker | LOAD | opacity, y | 0/16px → 1/0 | 500 | ease-out | 200 | — | 静态 |
| H3 | H1 每行（3 行，`overflow:hidden` 包裹） | LOAD | 内层 y | 100% → 0 | 700 | `--ease-editorial` | 300 | 90 | 无裁切残留 |
| H4 | 副标语 | LOAD | opacity, y | 0/16 → 1/0 | 600 | ease-out | 700 | — | 静态 |
| H5 | 三支柱 chips | LOAD | opacity, y | 0/12 → 1/0 | 480 | ease-out | 900 | 80 | 静态 |
| H6 | CTA 行 | LOAD | opacity, y | 0/12 → 1/0 | 480 | ease-out | 1050 | — | 静态 |
| H7 | KPI 数字（4 个） | LOAD | 数值滚动（§3.8） | 0 → 目标 | 1400 | `--ease-out` | 1200 | 100 | 最终值 |
| H8 | KPI 标签/分割线 | LOAD | opacity, scaleX | 0 → 1 | 600 | ease-out | 1400 | 60 | 静态 |
| H9 | 滚动提示（`Défiler`） | AUTO | opacity, y | 0.2→0.9→0.2；y 0→6px | 2400 循环 | ease-in-out | — | — | 循环；进入 01 后隐藏 |
| H10 | 背景视差 | SCRUB | y | 0 → -80px（滚动 0–100vh） | 滚动 | linear | — | — | 无累积位移 |

- H1 仅在 full motion 下做行裁切揭示；reduced-motion 改为整体 fade 300ms。
- 计数器触发条件：字体就绪 + section 进入视口；仅一次/会话（A-08）。
- 滚动离开首屏：内容层整体 opacity 1→0.35（0–60vh，scrub 仅桌面 full motion），避免与 01 叠底；移动端不做。

#### 交互状态

| 组件 | hover | focus-visible | active | 备注 |
|---|---|---|---|---|
| 主 CTA | 背景 `--gold` 提亮 6%，箭头右移 4px（200ms） | 2px 金色环 + 2px offset | scale(0.99) 120ms | 高度 48px，padding-inline 28px |
| 次 CTA | 下划线由 0→100% 宽（240ms），文字提亮 | 同上 | 同上 | 无边框 |
| 支柱 chip | 左边框 2px 金色；名称提亮；右侧箭头出现 4px | 整行金色环 | — | 整行可点，命中高 ≥48px |
| KPI 项 | 显示 tooltip：口径、年份、Source 标签、方法学链接 | 同 hover（`focus-within`） | — | tooltip 用 §3.8 规范 |
| 滚动提示 | 无 hover | 可聚焦按钮，Enter=滚动到 01 | — | `aria-label="Faire défiler vers le constat"` |

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 主 CTA | 启动 Mode Pitch（§3.5），进入前先显示启动卡（用户手势启动） | `#/tour/1`（push） |
| 次 CTA | 平滑滚动至 09，焦点移到区块标题 | `#/s/09-chiffres-2031` |
| 支柱 chip | 打开支柱抽屉 Aperçu | `#/pillar/{id}` |
| KPI 项 | 打开 09 区块并定位到对应 KPI？**不**：只显示 tooltip；点击 KPI 打开方法学抽屉 | `#/methodo` |
| logo | 回到页面顶部（不滚动动画，reduced 即时） | `#/` |
| 滚动提示 | 滚动到 01 | — |

#### 移动端（390）

- 首屏 100svh 但内容可轻微溢出：顺序为 kicker → H1（3 行）→ 副标语（3 行内）→ 三支柱列表 → CTA 堆叠 → KPI 2×2 → 滚动提示；总高 ≤ 844px，若溢出允许页面滚动（不出现内部滚动）。
- 背景：静态 SVG（3 条弧线 + 点阵），无 Canvas、无视差；reduced 同。
- KPI 数字 32px，FR 紧凑格式「2,5 M」，ZH「250 万」；2×2 网格，行间距 16px。
- 手势：垂直滚动为主；无横滑。

#### 降级

- **reduced-motion**：H1 整体 fade 300ms；背景静态；KPI 直接最终值；滚动提示静态；无视差。
- **low-bandwidth**：静态 SVG；无 Canvas；字体仅 FR 子集；KPI 直接最终值；无 prefetch。
- **print**：整个 Hero 印刷为封面页（见 §3.10 / visual-system §11）：背景改为深蓝满版 + 静态金色弧线；KPI 打印最终值；隐藏 CTA 与滚动提示；右下角加 QR + 网址。

#### 数据与空态

- 数据键：`data.kpis.hero[4]`（id: `mau`, `dau`, `time`, `revenue`）；每个含 `value`, `displayFR`, `displayZH`, `unit`, `year`, `type`, `source`。
- 若某项缺失：隐藏该项并重排 3 项等分；若 <2 项：只显示标题与副标语，不显示 KPI 条（不留空框）。
- 数字格式由 `Intl.NumberFormat` + 自定义紧凑规则（§3.8），禁止硬编码空格字符。

#### 验收要点

1. 1440×900 首屏无滚动即见：H1、副标语、3 支柱、1 CTA、≥2 KPI。
2. 390×844 首屏无横向滚动；H1 不超 3 行；CTA 命中区 ≥48px。
3. `prefers-reduced-motion` 下无位移/滚动数字/视差；截图与 full 模式静态帧一致（除背景）。
4. 所有 KPI 点击/聚焦出现 Source 与年份；无 tooltip 时页面不解释数字（方法学入口在旁）。
5. 打印封面页与屏幕 Hero 的信息一致（不丢 KPI）。

---

### 2.1 区块 01 · Constat — « Pourquoi maintenant »

**定位**：用 4 个问题制造必要性，再以一句转折引出「la réponse」；BRIEF §3 第 1 幕。

#### 布局结构

- `<section id="constat" data-tone="light" data-section="01">`；ivory 底；上 padding 160 / 下 120（桌面）。
- 头部栅格：`cols 1–5`：kicker `01 · LE CONSTAT`、H2 `Quatre verrous à lever`、lead 一段；`cols 7–12`：一条金色细线 + 一个「档案编号」式微标注（`DOSSIER 01 / 04`）——编辑式留白。
- 4 张问题卡：桌面 2×2（每张 `cols 1–6 / 7–12`），卡高自适应，间距 24px；卡内结构：编号（Didot 24px 金）→ 线性图标 28px → H3 → 描述（2–3 行）→ 「Aujourd'hui / Avec la plateforme」对比块（两行 + 金色箭头）→ 底部链接。
- 转折带：全宽，深色底（`--navy-900`）条带，高 ≥ 240px，居中：金色小标签 `LA RÉPONSE` + Didot 引句 + 3 个支柱 chips（可点进抽屉）。

#### 内容层级（问题 4 条，FR 建议）

| # | H3 | 描述要点 | 「Aujourd'hui」微数据 | 「Avec la plateforme」 | 跳转 |
|---|---|---|---|---|---|
| 01 | L'attention des jeunes est captée ailleurs | 外国平台拿走注意力，本地语言内容缺位 | —（定性） | RIMU 本土化推荐与创作者经济 | 05 |
| 02 | Une économie encore largement en cash | 支付不可审计，补贴与工资有流失 | `< 20 %` des adultes ont un compte numérique（src:L98，2026 基线） | RIMP 可追溯的支付轨道 | 04 finance-rimp |
| 03 | Les données et les modèles restent à l'étranger | 云依赖 + 无本地算力 | —（定性） | 国家算力中心 + 数据不出境 | 06 |
| 04 | Une dépendance aux minerais bruts | 单一出口价格风险 | —（定性） | 加工/物流/数字服务多元出口 | 04 projets |

- FR 引句：`La réponse tient en trois piliers : une porte d'entrée bilatérale, une super-application, un socle de calcul.`（ZH：「答案是三根支柱：一个双边入口、一个超级应用、一个算力底座。」）
- 每个问题的「Avec la plateforme」都必须给出去向链接（可点），让「问题 → 答案」形成闭环。

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 头部 kicker/H2/lead | ENTER | opacity, y | 0/24 → 1/0 | 640 | ease-out | 0 | 80 |
| 卡片 | ENTER | opacity, y；每张 | 0/24 → 1/0 | 560 | ease-out | 120 | 90 |
| 对比箭头 | ENTER（卡片入场后） | scaleX | 0 → 1（origin left） | 400 | ease-out | 240 | 120 |
| 「Après」行 | ENTER | opacity | 0 → 0.9 | 480 | ease-out | 320 | 120 |
| 转折带标签 | ENTER | opacity, letter-spacing？ | 0 → 1（不动字距） | 480 | ease-out | 0 | — |
| 转折引句 | ENTER | 行内遮罩揭示（每行） | y 100% → 0 | 700 | `--ease-editorial` | 120 | 80 |
| 转折带支柱 chips | ENTER | opacity, y | 0/12 → 1/0 | 400 | ease-out | 520 | 60 |

reduced-motion：全部直接呈现（或整体 fade 120ms），箭头与引句不揭示。
卡片 hover 额外动效（非进入）：金色箭头右移 6px 并加长 8px（240ms）；无位移卡片本身。

#### 交互状态

| 组件 | hover | focus | active | 展开/收起 |
|---|---|---|---|---|
| 问题卡 | 边框 `--line-gold-soft`；编号变金；箭头动；卡内「Après」行透明度 0.9→1 | 卡片整体金色环（2px，offset 4px） | — | 无展开（信息已静态展开，避免 hover 才可见） |
| 「Voir la réponse」链接 | 下划线 0→100% | 环 | — | — |
| 转折带支柱 chip | 下划线 + 箭头 | 环 | — | — |

> 决定：对比信息**不放在 hover 里**（移动与打印不可达），hover 只做强调。

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 问题卡整块 / 「Voir la réponse」 | 平滑滚动到对应区块（05 / 04 / 06），滚动后焦点到目标区块标题 | `#/s/{sectionId}` |
| 转折带支柱 chip | 打开支柱抽屉 | `#/pillar/{id}` |
| 02 的「< 20 %」数字 | 打开方法学抽屉（含基线来源） | `#/methodo` |

#### 移动端（390）

- 卡片 1 列；卡间距 16px；对比块保持两行（不折叠）；箭头在移动端仅静态显示（无 hover 强调）。
- 头部与转折带 padding 减为 72/64；转折引句 26px/1.2，最多 4 行。
- 点击问题卡后使用 `scrollIntoView({block:'start'})`，顶部预留 header 高度 64px（`scroll-margin-top`）。

#### 降级

- reduced-motion：无遮罩揭示、无箭头绘制；其余同。
- low-bandwidth：无额外网络资源；同 reduced 的动效策略。
- print：4 卡排 2×2 单页；转折带作为页面下方深色条（墨量控制：可用浅底 + 金色线替代满版深色，见 visual-system §11.2）；隐藏「Voir」箭头？保留文字链接但在 PDF 中显示为附注编号。

#### 数据与空态

- 数据键：`data.kpis.digitalAccounts`（<20 %，src:L98）；`content.sections[01].problems[4]`，每项含 `id, titleFR, titleZH, bodyFR, bodyZH, todayValue?, responseFR, targetRoute`。
- 无对比数据的问题（01/03/04）：`todayValue` 省略，对比块只显示文字「Aujourd'hui」定性描述；不得编造百分比。
- 空态：若 `targetRoute` 目标区块不可用 → 降级为不跳转文本（仍保留信息）。

#### 验收要点

1. 4 张问题卡各自的「Après」去向可点击且落点正确。
2. 转折句在 1440 下不超 2 行，390 下不超 4 行。
3. 无 hover 也能读到全部对比信息（触屏可用）。
4. 基线「<20 %」带年份与 Source，点击可达方法学。

---

### 2.2 区块 02 · Vue système — « Le système en un coup d'œil »

**定位**：一屏总图：三支柱 + 六大业务 + 四层架构，节点可点、悬停高亮关联；BRIEF §4 区块 02 + §5 L1。**深度交互见 §3.1。**

#### 布局结构

- `<section id="02-vue-systeme" data-tone="dark" data-section="02">`；深色；上 padding 120 / 下 120；内容最大宽 1280。
- 头部：左 kicker `02 · VUE SYSTÈME` + H2 `Trois piliers, six lignes, quatre couches`；右侧 lead 2 行 + 操作提示 `Cliquez un nœud pour ouvrir le dossier`（带鼠标/键盘图标）。
- **主图（桌面 ≥1024）**：固定 1200×800 设计画布（`aspect-ratio: 3/2`），整体按容器宽度等比缩放（`transform: scale(w/1200)`）。画布内三区：
  - 上区 y 0–180：三支柱节点横排（各 320×96），下方连接线汇聚到「系统总线」（y 220 一条金色 1px 横线）。
  - 中区 y 260–520：六业务节点 3×2（各 300×88），与总线用垂直短线相连；两两之间有极细虚线表示「流」（01→04 资金、02→03 货物、05→04 人才…），静态默认 opacity .18。
  - 下区 y 560–780：四层架构堆叠条（每层 1160×40，间距 8），自下而上为 infrastructure → intelligent → middleware → experience。
  - 左侧竖排坐标刻度（`00 / 01 / 02 / 03`）+ 右侧竖排标签 `COUCHE / LIGNE / PILIER`（10px，字距 .22em，金色）。
- 底部图例条：三组计数 `3 piliers · 6 lignes · 4 couches` + 操作提示 `Entrée = ouvrir · Échap = fermer`。
- 移动（<1024 或 <768）：改为 DOM 竖排「système」：三支柱行（每行：编号 + 名称 + 箭头）→ 金色竖脊 → 六业务 2 列网格 → 竖脊 → 四层条（自下而上显示）；无连线 SVG（仅 CSS 竖脊与分支短线）；点击打开底部 sheet。

#### 内容层级

1. H2 + lead（1 句：`La plateforme bilatérale ouvre le canal ; RIMU produit l'attention ; le calcul sert les deux.`）
2. 主图（信息顺序：支柱 → 业务 → 层级，从上到下 = 从入口到地基）
3. 图例与操作提示
4. 微标注：`Schéma interactif — cliquez pour ouvrir le dossier détaillé`

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 背景网格 | ENTER | opacity | 0 → 0.08 | 800 | linear | 0 | — |
| 总线 + 竖直连接线 | ENTER | scaleX / path draw | 0 → 1 | 900 | `--ease-out` | 300 | — |
| 三支柱节点 | ENTER | opacity, y | 0/-16 → 1/0 | 560 | ease-out | 200 | 80 |
| 六业务节点 | ENTER | opacity, y | 0/24 → 1/0 | 520 | ease-out | 560 | 60 |
| 四层条 | ENTER | opacity, y | 0/16 → 1/0（自下而上） | 480 | ease-out | 780 | 70 |
| 业务间虚线流 | ENTER | opacity | 0 → 0.18 | 700 | linear | 1000 | — |
| 图例 | ENTER | opacity | 0 → 1 | 400 | ease-out | 1100 | — |

- 无 pin、无 scrub：本区块不做滚动绑定装配（理由：深链、Tour、打印需要稳定坐标；A-12）。仅保留总线 draw 一次。
- reduced-motion：全部直接呈现，bus 不绘制；节点 opacity 0→1 120ms（若必须动）。

#### 交互状态

| 元素 | hover / focus | 关联高亮 | active | 说明 |
|---|---|---|---|---|
| 支柱节点 | 描边金色 1.5px + 底部节点名变金；出现 tooltip（名称 + 1 句 + 「Ouvrir le dossier」） | 与其相连的总线 + 6 业务节点 → 100%，其余节点/线 opacity .35（240ms） | scale(0.99) | 整块可点 |
| 业务节点 | 同上 | 与该业务相连的支柱 + 层级 + 业务间流高亮；其余 .35 | 同上 | 点击打开业务抽屉 |
| 层条 | 层条上移 2px、叠加金色 1px 顶线；tooltip 显示 3–5 个组成 chips | 高亮该层与「支撑」的支柱关系 | — | 点击打开层级抽屉 |
| 空白区 | 无 | 无 | 点击空白取消所有高亮 | — |

- 节点 focus 顺序严格按「支柱 1–3 → 业务 1–6 → 层 1–4」阅读顺序；`Tab` 逐个，`Enter/Space` 打开，`Esc` 关闭抽屉并归还焦点。
- 高亮使用 `data-related` 关系表（每个节点在 T1 data-model 中声明关联），不靠运行时猜测。

#### 点击行为与深链

| 类型 | URL | 抽屉默认 tab |
|---|---|---|
| 支柱 | `#/pillar/{id}` | Aperçu（固定 6 tab） |
| 业务 | `#/business/{id}` | Aperçu（固定 6 tab） |
| 层 | `#/layer/{id}` | Aperçu（固定 6 tab，内容按层适配） |
| 图例「6 lignes」 | 滚动到 04 | `#/s/04-business-lines` |

#### 移动端（390）

- 顺序：H2 → lead → 3 支柱行 → 竖脊 → 6 业务（2 列，每格 165×96：编号、名称、状态徽章）→ 竖脊 → 4 层条（竖向，每层 56px 高）→ 图例。
- 点击节点 → 底部 sheet（`#drawer` 移动形态），无 spotlight；关闭后回到原位置。
- 不提供缩放画布版本（避免 390 上不可读）；<1024 一律用 DOM 竖排。
- 手势：无横向手势；业务格 2 列，命中区 ≥ 72px 高。

#### 降级

- reduced-motion：静态呈现，无高亮位移（hover 高亮保留，只淡入 120ms）。
- low-bandwidth：不加载额外 SVG 滤镜/粒子；节点与线以内联 SVG 静态呈现；高亮仍可用。
- print：整图打印为一页（1200×800 缩放至 277×185mm 安全区），关闭 hover 样式；节点名称与编号保留；交互提示隐藏；追加图例。
- no-JS：静态 SVG 内联，节点为 `<a href="#/business/{id}">` 也可点击（若支持 hash）。

#### 数据与空态

- 数据键：`data.pillars[3]`、`data.businessLines[6]`、`data.layers[4]`、`data.relations[]`（含关联关系，用于高亮）。
- 节点缺失：不渲染该节点；其相关内容从其他节点关联中剔除；布局按 3/6/4 的标准坑位保留（缺失位置显示虚线占位 + 「À confirmer」），不重排导致连错线。
- 若某业务无状态标签：徽章显示 `—`，tooltip「Statut à confirmer」。

#### 验收要点

1. 1440 下整图一屏可见（含图例），无需滚动即理解 3/6/4 结构。
2. 任一节点 hover/focus 时关联线/节点高亮，其余降透明度 ≤0.35，240ms 完成。
3. 节点点击进入对应抽屉且 URL 正确；Esc 关闭后焦点回到该节点。
4. 390 下无横向滚动、无缩放画布；2 列业务格文字不截断（最多 2 行，超出省略 + 抽屉看全文）。
5. 打印页的连线与节点名清晰（最小 6pt）。

---

### 2.3 区块 03 · Les trois piliers — « Trois portes d'entrée »

**定位**：三张主卡说明「双边平台 / RIMU / 算力中心」各自是什么、给谁、点击看总览抽屉；BRIEF §4 区块 03。

#### 布局结构

- `<section id="03-piliers" data-tone="light" data-section="03">`；ivory 底；padding 160/120。
- 头部单列左对齐（最大 720px）：kicker `03 · ARCHITECTURE`、H2 `Trois piliers, une même architecture`、lead 2 行。
- 三张卡横排：`cols 1–4 / 5–8 / 9–12`（桌面），间距 24px；卡高一致（≥ 480px），结构：
  - 顶部：罗马数字 `I / II / III`（Didot 28px 金）+ 右侧状态徽章（`En lancement` / `Pilote` / `Pré-étude`，Hypothèse 映射，见 §4.4）
  - H3 名称（FR + ZH 小字对照）
  - 一句话定位（≤90 字符）
  - 3 条能力 bullet（线性图标 16px + 文本）
  - 线稿示意图（120×72）：双边平台 = 两个交叠圆环 + 箭头；RIMU = 手机轮廓 + 4 格；算力 = 机柜堆叠 + GPU 网格
  - 底部：1 个数字指标（大号）+ 标签 + `Ouvrir le dossier →`
- 卡底与区块底之间留 80px 金色细线，作为「档案页脚」。

#### 内容层级

| 支柱 | H3 FR | 定位一句话 | 3 条 bullet | 底部指标 |
|---|---|---|---|---|
| I | Plateforme bilatérale | `Le point d'entrée officiel de la coopération sino-mauritanienne.` | Projets & financements / Commerce de gros / Biens de consommation vers l'Afrique de l'Ouest | `5–8` premiers projets · `800 M – 1,2 Md USD`（src:L86） |
| II | RIMU | `Le système d'exploitation du quotidien des Mauritaniens.` | Découverte & création / Paiement RIMP / Emploi, formation, services | `2,5 M` MAU en 2031（src:L72） |
| III | Centre de calcul IA | `Le socle souverain du contenu et de la donnée.` | Inférence souveraine / Modération & langues locales / Énergie verte | `~1 MW` Phase 1 · `~100` accélérateurs（src:L61） |

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 头部 | ENTER | opacity, y | 0/24 → 1/0 | 640 | ease-out | 0 | 80 |
| 卡片 | ENTER | opacity, y；顶部金线 scaleX（origin left） | 0/28 → 1/0；0 → 1 | 600 / 480 | ease-out | 120 | 100 |
| 示意图 | ENTER | path draw（可选，≤3 条线） | 0 → 1 | 900 | ease-out | 400 | 80 |
| 底部指标 | ENTER | opacity, y | 0/12 → 1/0 | 480 | ease-out | 620 | 60 |
| hover 顶部金线 | HOVER | scaleX | 0.35 → 1 | 320 | ease-out | — | — |

reduced：不画线、不位移，整体 fade 120ms；hover 金线仅 opacity 切换。

#### 交互状态

| 组件 | hover | focus | active | open（抽屉） |
|---|---|---|---|---|
| 整卡 | 背景 `#FFFDF8`；边框由 `--line-soft` 变 `--line-gold-soft`；顶部金线 0.35→1；箭头右移 4px；示意图线宽 1→1.25 | 整卡金色 2px 环（offset -2px，内描边） | scale(0.995) 160ms | 打开支柱抽屉（Aperçu），URL push |
| `Ouvrir le dossier` 链接 | 下划线 | 环 | — | 同整卡 |
| 状态徽章 | 无 | tooltip 解释标签定义 | — | — |

- 卡片整块 `<a>` 语义（`<a href="#/pillar/id">`），内部无二级链接；避免嵌套交互。
- 三卡 hover 时其余卡 opacity 0.85（180ms，仅桌面）——形成聚焦，但不得低于 0.75 影响可读。

#### 点击行为与深链

- 点击卡片 → `#/pillar/{id}`（pushState），抽屉默认 Aperçu；**固定 6 tab**（`Aperçu / Fonctionnement / Chiffres clés / Acteurs & flux / Feuille de route / Risques`，缺失内容显示空态，A-02）。
- 长按/右键：无自定义菜单（保持原生）。
- 语言切换后 URL 不变，抽屉保持打开。

#### 移动端（390）

- 单列卡片；卡高自适应（约 420px）；三张卡顺序 I→II→III；卡内示意图缩至 104×64 并右对齐以免压文字。
- 点击打开底部 sheet（92svh）；sheet 关闭后回到卡片位置。
- 手指 hover 不存在：卡片默认显示顶部金线 0.35；无「其余卡变暗」逻辑（`@media (hover:none)` 禁用）。

#### 降级

- reduced-motion：无位移/绘制；hover 只改颜色。
- low-bandwidth：示意图用静态 SVG（同 full），无额外资源；字体子集。
- print：三卡一排（每卡 89mm 宽）打印为一页；状态徽章保留；示意图打印为单色线稿（金/墨）；链接文字保留但显示为脚注 URL 简写（见 visual-system §11.6）。
- no-JS：卡片为普通链接，静态内容完整。

#### 数据与空态

- 数据键：`data.pillars[3]`，含 `id, numeral, nameFR/ZH, taglineFR/ZH, bullets[3], kpiIds[1], status, drawerTabs`。
- 指标缺失 → 卡片底部改为「Voir le dossier」单行，不占位大数字。
- 状态标签映射（Hypothèse，待 T1/客户确认）：plateforme = `En lancement`（src:L104「sur le point d'être lancée」）；RIMU = `Pilote`（2027 邀请制，src:L54）；calcul = `Pré-étude`（src:L49「pré-étude du calcul vert」）。

#### 验收要点

1. 三卡等高、示意图不挤压文字；1440 下卡宽 ≥ 380px。
2. 任意卡 hover 其余卡透明度 0.85 且文字对比度仍 ≥ 4.5:1。
3. 点击任一卡进入对应支柱抽屉，tab 数为 6、URL 正确。
4. 390 下单列无溢出，卡片点击区完整（不是只有链接可点）。
5. 打印页 3 卡同页、指标可读（≥ 8pt）。

---

### 2.4 区块 04 · Les six lignes de business

**定位**：把双边合作拆成 6 条可点击业务线，每卡一句话价值 + 3 个指标 + 状态；BRIEF §4 区块 04。

#### 布局结构

- `<section id="04-business-lines" data-tone="light" data-section="04">`；ivory 底；padding 160/120。
- 头部：左 kicker `04 · LIGNES DE BUSINESS` + H2 `Six lignes, un même canal`；右侧 lead + 一个「statut」图例（3 个小徽章，解释 mature / pré-étude / pilote）。
- 卡片网格：桌面 3 列 × 2 行（间距 24px，行距 24px）；平板 2 列；移动 1 列。
- 卡片（`<a class="biz-card">`）：高自适应（最小 360px），内边距 32px；结构自上而下：
  1. 顶部行：编号 `01–06`（Didot 20px 金）+ 状态徽章（右对齐）
  2. H3 业务名（FR 24–28px；ZH 版本对应中文名）
  3. 一句话价值（≤ 90 字符，2 行）
  4. 3 个指标区：3 列小网格（每列：数值 20px 等宽数字 + 标签 11px 灰 + Source 点）
  5. 底部：`Ouvrir le dossier →` + 微标签（五类流中的主要 in/out，最多 2 个 chip）
- 6 张等宽卡（A-13），不做宽卡节奏。

#### 内容层级（6 条业务线，id 以 T1 为准）

| # | id | H3 FR（建议） | 一句话价值（FR 草稿） | 指标示例（T1 定稿为准） |
|---|---|---|---|---|
| 01 | `projets` | Projets & investissements | `Mines, énergies nouvelles, infrastructures et transformation agro-halieutique : un portefeuille de projets matures, listés et mis en relation.` | 5–8 projets · 800 M–1,2 Md USD（src:L86）· 6 catégories d'activités（src:L49） |
| 02 | `commerce-gros` | Commerce de gros | `Mettre en relation l'offre chinoise et les acheteurs ouest-africains, en lots et en contrats.` | 300–800 M USD de mises en relation（src:L87）· 5 pays ciblés（Dérivé src:L66）· 2 modes : vrac / conteneur（Hypothèse） |
| 03 | `biens-conso` | Biens de consommation & hub Afrique de l'Ouest | `Un showroom permanent à Nouakchott et un canal en ligne vers le Sahel : sélectionner, échantillonner, distribuer.` | 80–150 M USD de commandes d'essai an 1（src:L87）· 800 M–2 Md USD de transit/an（src:L90）· 5+ pays（src:L66） |
| 04 | `finance-rimp` | Finance & RIMP | `Un rail de paiement national et des financements de projet : transformer le cash en flux auditables.` | 90–140 M USD de revenus 2031（src:L80）· 2,8 M comptes（src:L73，QA-02）· < 20 % → ~50 % de comptes adultes（src:L98） |
| 05 | `formation` | Formation & talents | `Former aux métiers du numérique et aux usages productifs, via mobile et présentiel.` | 1 000–3 000 personnes formées（src:L88）· classes commandées（src:L115）· tutorat apprentis locaux（src:L115） |
| 06 | `sante` | Santé & télémédecine | `8 à 15 points de télémédecine et des contenus de santé publique diffusés par RIMU.` | 8–15 points（src:L88）· consultations à distance（src:L41）· alertes santé（src:L41） |

- 状态徽章映射（以 T1 `businessLines[].stage / stageLabelFR` 为准；下表为设计占位）：01 mature / 02 mature / 03 pré-étude / 04 pilote / 05 mature / 06 pré-étude。
- 每个指标必须带年份或口径（如「2031」「an 1」），Source 点 hover 显示 `Source: dossier RIMU, src:L86`。

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 头部 | ENTER | opacity, y | 0/24 → 1/0 | 640 | ease-out | 0 | 80 |
| 卡片 | ENTER | opacity, y | 0/28 → 1/0 | 560 | ease-out | 120 | 70 |
| 卡片顶部金线 | ENTER | scaleX（origin left） | 0 → 0.35 | 480 | ease-out | 240 | 70 |
| 指标数字 | ENTER | opacity, y | 0/8 → 1/0（数字不滚动，保持静态可读） | 360 | ease-out | 360 | 40 |
| 状态徽章 | ENTER | opacity | 0 → 1 | 320 | ease-out | 480 | 30 |

- 本区块数字**不做滚动计数**（6×3 = 18 个数字同时滚动会廉价且难读）；只有 00 / 09 的 KPI 做滚动计数。
- hover：卡片整块 | 顶部金线 0.35→1（320ms）| 背景 `#FFFDF8` | 箭头右移 4px；其余卡不变暗（6 张同权，避免干扰）。

#### 交互状态

| 组件 | hover | focus-visible | active | 说明 |
|---|---|---|---|---|
| 卡片 | 边框变 `--line-soft`→金；金线满；箭头动；`Ouvrir le dossier` 文字变金 | 卡片 2px 金环（offset -2px） | scale(0.995) | 整卡 `<a>` |
| 状态徽章 | tooltip：`Mature = projet en cours / Pré-étude = faisabilité / Pilote = première phase` | 同 hover（focusable 时） | — | 徽章本身不点击 |
| 指标 Source 点 | tooltip：来源行 + 年份 + 口径 | 同 hover | — | 14×14 命中 24px |
| 五类流 chip | tooltip：该业务的主要流「in/out」；不跳转 | — | — | 装饰性信息，不进 tab 顺序（aria-hidden + 可读文本在卡描述中） |

#### 点击行为与深链

- 整卡点击 → `#/business/{id}`，抽屉默认 Aperçu；按 `Ctrl/Cmd+点击` → 新标签页打开深链（原生 `<a href>` 行为）。
- 卡片内 **没有** 其他链接（Source 点、chip 均非链接），避免点击区冲突。
- 深链进入时：不滚动页面；若从外部进入，默认滚动到 04 并居中该卡（`scroll-margin-top`），不播放滚动动画。
- 抽屉关闭后焦点回到该卡；URL 回 `#/`（history.back）。

#### 移动端（390）

- 单列卡片：内边距 24px；H3 22px；指标区 3 列（值 16px / 标签 10px），允许标签 2 行；若 3 个指标文字过长 → 指标区改为纵向 3 行，由内容自适应，禁止横向滚动。
- 卡片间距 16px；整卡高度自适应，目标 ≤ 420px。
- 点击 → 底部 sheet；`Ouvrir le dossier` 文案在移动端改为 `Voir le dossier`（省空间）。
- 无 hover 强调；按下态显示背景 `#F1E9DA`。

#### 降级

- reduced-motion：卡片整体 fade 120ms；金线直接 0.35；无箭头动效。
- low-bandwidth：无额外资源；6 张卡为纯 HTML/CSS。
- print：6 卡排 3×2 一页（或 2 页，每页 3 张竖排）；状态徽章以文字形式保留；Source 点打印为脚注编号；每卡底部给出对应 PDF 附录页码（见 §3.10）。
- no-JS：卡片为普通 `<a href="#/business/id">`；内容完整可读。

#### 数据与空态

- 数据键：`data.businessLines[6]`，每项 `{id, order, nameFR/ZH, taglineFR/ZH, stage, kpiIds[3], flowIn[], flowOut[], route}`；指标通过 `kpiIds` 关联 `data.kpis[]`。
- 每个 KPI：`{id, displayFR, displayZH, unitFR/ZH, year, type: Source|Dérivé|Hypothèse, sourceRef}`。
- **不足 3 个指标**：第 3 格显示定性能力 chip（如 `Tutorat local`），并标注 `—` 而非编造数字；不得空框。
- 状态缺失：徽章 `—` + tooltip「Statut à confirmer」；排序保持 01–06 固定。
- 空态：若整条业务数据缺失 → 卡片保留占位（标题 + 「Dossier en préparation」+ 禁用态），不可点击。

#### 验收要点

1. 1440 下 6 卡 3×2 一屏内基本可见；卡片等高。
2. 任意卡片点击进入正确抽屉；`Ctrl/Cmd+点击` 新标签可打开深链。
3. 每张卡至少 1 个可溯源数字；Source 点可显示来源；无编造数字。
4. 390 下指标区不横向滚动、不截断关键数字；卡片宽度 = 350px。
5. 打印页 6 卡完整、状态与数字可读。

---

### 2.5 区块 05 · RIMU — « Le système d'exploitation du quotidien »

**定位**：国民级超级应用：手机 mockup 自动演示 + 8 个可点模块（T1 `rimuModules`）；BRIEF §4 区块 05。**手机交互深度规格见 §3.4。**

#### 布局结构

- `<section id="05-rimu" data-tone="dark" data-section="05">`；深色；padding 160/120。
- 桌面两栏：左 `cols 1–6`（文案区），右 `cols 8–12`（手机 mockup 舞台）。
  - 文案区：kicker `05 · RIMU`；H2 `RIMU, le système d'exploitation du quotidien`；副标语；四个 tab 说明列表（For You / Abonnements / À proximité / Marché，每项：名称 + 一行说明 + 可点击切到手机对应 tab）；下方：`Voir la démo complète`（8 s）控制 + 数据标注。
  - 手机舞台：360×740 外框（实际渲染 340×700，外框线 1px 金 + 24px 圆角 + 内部屏幕），下方 4 个演示章节点 + `Démo auto` 播放/暂停按钮 + 一句 `Survolez pour mettre en pause`。
- 下方全宽模块区：8 张模块卡 4 列 × 2 行（平板 2 列、移动 2 列）；每卡：线性图标 24px + 名称 + 一行描述 + 箭头；点击打开模块抽屉（`#/rimu/{id}`）。
- 主权与保护条带（全宽，深一档背景）：左侧 `Données, modèles et modération restent sur le territoire national`（src:L8）；右侧 3 条未成年人默认限制（个性化推荐 / 无限滚动与直播打赏 / 陌生人私信，src:L36）+ `En savoir plus`（打开 `#/rimu/mineurs`）。

#### 内容层级

1. H2 + 副标语：`Une application nationale, pensée pour la faible bande passante et les langues locales.`（src:L8/L27/L35）
2. 4 个 tab（产品结构，src:L26）：For You / Abonnements / À proximité / Marché
3. 手机演示（视觉主体）
4. 8 个模块（与 T1 `rimuModules` 对齐）：Live & live commerce / Studio créateurs / Économie des créateurs / RIMU Shop + RIMP / Jobs & formation / Comptes vérifiés / Protection des mineurs / Souveraineté & modération
5. 主权与保护条带
6. 数据标注：`2,5 M MAU · 800 k DAU · 40 min/j en 2031（scénario ambitieux）`（src:L72）+ 方法学链接

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 文案区 | ENTER | opacity, y | 0/24 → 1/0 | 640 | ease-out | 0 | 80 |
| 手机外框 | ENTER | opacity, y | 0/40 → 1/0；**不做 3D 倾斜** | 700 | ease-out | 120 | — |
| 屏幕首帧（For You） | ENTER | opacity | 0 → 1 | 480 | ease-out | 300 | — |
| 手机金色外框线 | ENTER | path draw / scaleY | 0 → 1 | 900 | ease-out | 200 | — |
| 演示控制条 | ENTER | opacity | 0 → 1 | 320 | ease-out | 800 | — |
| 模块卡 | ENTER | opacity, y | 0/20 → 1/0 | 520 | ease-out | 200 | 60 |
| 主权条带 | ENTER | opacity, y | 0/16 → 1/0 | 560 | ease-out | 400 | — |

- 自动演示启动条件：手机完整进入视口（≥60%）且 `document.visibilityState === 'visible'` 且 motion=full 且 bw=normal；否则停在首帧并显示播放按钮。
- 8 秒循环与 hover 暂停见 §3.4。

#### 交互状态

| 组件 | hover | focus | active | open |
|---|---|---|---|---|
| 手机 tab（屏幕内 4 个） | 底部图标提亮 + 标签出现 | 金色焦点环（屏幕上 2px） | 缩放 0.96 | 切换屏幕内容（非抽屉） |
| 模块卡 | 图标变金、金线 0.35→1、箭头动 | 2px 金环 | scale(0.99) | 打开模块抽屉 |
| 演示控制 | 播放按钮背景亮 6% | 环 | — | 播放/暂停、点击章节点跳转 |
| 手机舞台 | 暂停自动演示（`pointerenter`） | 聚焦手机时也暂停 | — | 离开 400ms 后恢复 |
| 主权条带链接 | 下划线 | 环 | — | 打开 `#/rimu/mineurs` |

- 手机屏幕内为演示内容，**不是**可交互产品：tab 可切换用于展示；屏幕内卡片/按钮不可点（`pointer-events:none`），避免「假交互」。
- 屏幕内容 DOM 对辅助技术隐藏（`aria-hidden="true"`），另提供文字版演示说明（可展开 `Décrire la démo`）。

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 4 个 tab 文案 / 屏幕 tab | 切到对应屏幕，暂停自动演示 10s | 无 URL |
| 模块卡 | 打开模块抽屉 | `#/rimu/{id}` |
| `Voir la démo complète` | 从第 1 章重播 8s；reduced-motion → 手动逐帧 | — |
| 主权条带 `En savoir plus` | 打开 mineurs 模块抽屉 | `#/rimu/mineurs` |
| 数据标注「méthodologie」 | 打开方法学抽屉 | `#/methodo` |

#### 移动端（390）

- 单列：H2 → 副标语 → 手机（280×580，居中，外框 16px 圆角）→ 演示章节点与控制（按钮 44px）→ 4 tab 文案折叠为横向 chip 行可滚动（不换行）→ 8 模块卡 2 列 → 主权条带（竖排）。
- **移动端不自动播放** 8s 演示（省电/省流），默认静态首帧 + 播放按钮；点击播放后才循环，触屏任意处 tap 暂停。
- 模块卡 2 列，每格 165×120：图标 20px、名称 2 行内、无描述（描述进抽屉）。
- 手势：无横滑；tap 切 tab；播放按钮命中 48px。

#### 降级

- reduced-motion：不自动播放、无过渡滑屏（直接切帧）；章节点与播放按钮仍在；无手机外框绘制动画。
- low-bandwidth：手机显示静态合成图（4 tab 拼贴 SVG，≤40KB）；8 模块用内联 SVG；无自动演示。
- print：手机打印为静态首帧（For You 屏）+ 4 tab 标签列表 + 8 模块两列清单；主权条带保留；打印页 1–2 页。
- no-JS：手机为静态 SVG 首帧；模块卡为 8 个链接（无抽屉则指向附录页锚点）；主权文案完整。

#### 数据与空态

- 数据键：`data.rimu.tabs[4]`（产品 tab）、`data.rimuModules[8]`、`data.rimu.demoFrames[4]`（每帧：屏幕标题、1–2 条内容、对应产品能力、sourceRef）、`data.rimu.minorsRestrictions[3]`。
- 演示帧内容用「示意数据」，不得冒充真实使用数据；屏幕内数字为设计示意（如 `1,2 k vues`），并标注 `Démo`。
- 模块缺失：卡片显示禁用态（`aria-disabled`）与「Dossier à venir」，不打开抽屉。
- 若 W1 无产品截图：手机屏幕全部用线框 + 色块示意（visual-system §8.17），禁止第三方 app 截图。

#### 验收要点

1. 1440 下手机完整可见（不裁切），自动演示 8s 循环 4 帧，hover 暂停、离开 400ms 恢复。
2. 点击 4 个 tab 能切屏且演示暂停 10s；章节点可跳帧。
3. 8 个模块卡均打开正确抽屉；键盘顺序符合阅读顺序。
4. 390 下不自动播放；手机宽度 280 不溢出；模块卡 2 列文字不截断。
5. reduced-motion / 低带宽 / 打印三种情况下手机均为静态且信息完整。

---

### 2.6 区块 06 · Contenu IA & Calcul — « Le socle souverain »

**定位**：四层架构可交互 + AI 用例 + 算力三期；数据不出境；BRIEF §4 区块 06。

#### 布局结构

- `<section id="06-contenu-calcul" data-tone="dark" data-section="06">`；深色；padding 160/120。
- 头部：kicker `06 · CONTENU IA & CALCUL`、H2 `Le socle : quatre couches, trois phases, une souveraineté`、lead。
- 上部两栏（桌面）：左 `cols 1–6`：四层架构交互堆叠（自下而上 infrastructure / intelligent / middleware / experience，每层条 64px 高，间距 8px；hover/焦点时该层展开显示 3–5 个组成 chips，并显示「Valeur nationale」小字；点击打开层级抽屉）。右侧 `cols 7–12`：AI 用例区（3 个分组 tab：Production de contenu / Services du quotidien / Usages professionnels & administratifs），每组 3–4 张子卡（点击展开 L3 详情，不打开抽屉）。
- 中部：算力三期步骤条：3 个阶段横向排列，用金色箭头连接；每期卡：Phase 1 `~18 mois` · `~100 accélérateurs` · `~1 MW`（src:L61）；Phase 2 `~36 mois` · `2–3 MW` · séparation entraînement/inférence（src:L62）；Phase 3 `extension modulaire` · contrat d'électricité verte（src:L63）。**20–50 MW 的口径见 QA-04，不在主步骤条展示，放入 Phase 3 的「绿电扩展」注解并标 Hypothèse/QA**。
- 下部：主权条带：`Les données, les poids des modèles et la modération restent sur le territoire national.`（src:L8、src:L114）+ 3 个小标签：`Inférence rapatriée` / `Grand livre local` / `Entraînement hybride possible`。
- 移动：四层变手风琴（单开）；AI 用例分组变 3 个折叠组；算力三期竖排，箭头改为向下。

#### 内容层级

1. H2 + lead
2. 四层架构（交互）
3. AI 用例（3 组，来自 src:L38–43）
4. 算力三期（src:L60–64）
5. 主权条带
6. 微标注：`Architecture cible — phases indicatives`

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 层条 | ENTER | opacity, y | 0/20 → 1/0（自下而上） | 520 | ease-out | 0 | 80 |
| 层间金色连接线 | ENTER | scaleY | 0 → 1 | 600 | ease-out | 300 | — |
| 层展开（hover/focus） | HOVER | height（0fr→1fr）、chips opacity | 收 → 展 | 280 | ease-out | — | — |
| AI 分组 tab | ENTER | opacity | 0 → 1 | 320 | ease-out | 500 | — |
| 用例子卡 | STATE（切组时） | opacity, y | 0/12 → 1/0 | 360 | ease-out | 0 | 40 |
| 三期卡 | ENTER | opacity, y；连接箭头 draw | 0/24 → 1/0 | 560 | ease-out | 200 | 100 |
| 主权条带 | ENTER | opacity | 0 → 1；金色下划线 scaleX | 560 | ease-out | 600 | — |

reduced：全部直接呈现；层展开无高度动画（瞬时）；切组无淡入（瞬时）。

#### 交互状态

| 组件 | hover / focus | active | click | 说明 |
|---|---|---|---|---|
| 层条 | 上移 2px + 金色 1px 顶线；展开组成 chips；非当前层透明度 0.7 | — | 打开层级抽屉 `#/layer/{id}`（固定 6 tab；内容按层可用性填空态） | 键盘 ↑↓ 在层间移动（按钮列表） |
| 用例子卡 | 背景提亮、箭头；展开 L3 详情（3–5 行 + 例子） | — | 展开/收起 | 不打开抽屉（A-14） |
| 分组 tab | 金色下划线滑动 | — | 切组 | ARIA tablist |
| 三期卡 | 边框金色、背景提亮；箭头右移 | — | 展开 L3：该期详细组成、时间、依赖条件（内联） | 不进入 08 时间轴 |
| 主权条带 | 无 hover | — | 无 | 信息性 |

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 层条 | 层级抽屉（固定 6 tab，内容按层适配） | `#/layer/{id}` |
| 用例子卡 | L3 内联展开（不跳转） | — |
| 三期卡 | L3 内联展开 | — |
| 主权条带微标签 | tooltip：解释术语（`inférence rapatriée` 等） | — |

#### 移动端（390）

- 四层手风琴：每层 56px 标题行 + 展开内容；单开；点击标题展开，不打开抽屉（移动端把抽屉入口放在展开内容底部「Ouvrir le dossier」按钮，避免误触）。
- AI 用例：3 个折叠组，组内子卡纵向；取消 tab（窄屏难操作）。
- 三期：竖排卡片 + 向下箭头；Phase 3 的绿电注解以「À confirmer」标签显示。
- padding 72/64；层条命中区 ≥ 56px。

#### 降级

- reduced-motion：无层展开高度动画、无箭头 draw；切组瞬时。
- low-bandwidth：层与用例全部静态展开；不加载图标字体。
- print：四层架构打印为单色堆叠图 + 组成文字；AI 用例 3 组全展开列印；算力三期横向步骤条；主权条带保留；2 页。
- no-JS：四层为静态列表；AI 用例全展开；三期静态。

#### 数据与空态

- 数据键：`data.layers[4]`（id、nameFR/ZH、composition[3–5]、valueFR/ZH）、`data.aiUseCases[3]`、`data.computePhases[3]`（含 `qaNote`；T1 映射见 §4.6.4）。
- 四层任何一层缺失 → 该层占位「Couche à confirmer」禁用；其余层保持顺序。
- 三期数据缺失 → 隐藏该期，剩余期等宽重排；Phase 3 无数据不显示 20–50 MW 数字（QA-04）。
- AI 用例为空 → 显示空态文案「Cas d'usage en cours de cadrage」+ 链接 `#/methodo`。

#### 验收要点

1. 四层交互：hover 展开、离开收起；键盘可达；点击进入正确层级抽屉（6 tab）。
2. AI 三组切换不改变区块高度导致跳动（容器高度固定或平滑过渡）。
3. 三期数字与 src:L61–63 一致；20–50 MW 仅出现在 Phase 3 注解并带 QA/置信标签。
4. 390 下四层手风琴单开、无横向溢出。
5. 打印页四层与三期为静态可读图形（≥ 7pt）。

---

### 2.7 区块 07 · Relations — « Cinq flux, un système »

**定位**：五类流关系网络图：筛选 / isolate / hover tooltip / 流动粒子 / 点击开抽屉；BRIEF §4 区块 07 + §5。**实现细节见 §3.3。**

#### 布局结构

- `<section id="07-relations" data-tone="dark" data-section="07">`（全站最深底色 `#05121F`）；padding 120/96；内容最大宽 1440（图谱可出血到 1280 内容宽）。
- 头部：左 kicker `07 · RELATIONS` + H2 `Cinq flux relient les trois piliers et les six lignes`；右侧：筛选 chips（Tous + 5 flow）+ `Focus` 按钮 + `Version liste` 开关。
- 主图：16:9 画布（1280×720 设计坐标），入口节点在左（Plateforme bilatérale / RIMU / Centre de calcul IA），业务与外部参与方在右与中；5 类流用不同颜色 + 线型（visual-system §3.4）。图下方图例行（5 项 + 说明）。
- 右侧信息栏（桌面 ≥1280）：hover 节点/边时显示 360px 常驻信息面板（名称、类型、1 句说明、相关流量标签、`Ouvrir le dossier` 按钮）；无 hover 时显示「Sélectionnez un flux」提示。窄屏改为浮动 tooltip。
- 图谱下方：`Version liste`（可展开的表格，行 = 每类流；列 = De → Vers / 说明 / 数据标签），默认折叠，键盘/读屏可用。
- 移动：默认列表；可切图视图（350×420，可拖拽平移、双指缩放 1×–2.5×）。见 §3.3。

#### 内容层级

1. H2 + lead（`Le capital, les marchandises, les paiements, les données et l'attention circulent entre les mêmes nœuds.`）
2. 筛选（Tous / Capital / Marchandises / Paiements / Données / Attention）
3. 图谱
4. 图例 + 数据标签（`Épaisseur = ordre de grandeur ; Source / Dérivé / Hypothèse`）
5. 列表替代
6. 微标注：`Schéma qualitatif — les volumes sont indicatifs`

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 画布网格/刻度 | ENTER | opacity | 0 → 0.08 | 800 | linear | 0 | — |
| 节点 | ENTER | opacity, scale | 0/0.92 → 1/1 | 480 | ease-out | 160 | 50 |
| 边（路径） | ENTER | stroke-dashoffset（draw） | 全长 → 0 | 900 | ease-out | 300 | 30 |
| 粒子 | ENTER（延迟 1.4s 后） | 沿路径位移 | 循环 | — | linear | 1400 | — |
| 头部/筛选 | ENTER | opacity, y | 0/16 → 1/0 | 480 | ease-out | 0 | 60 |
| 图例 | ENTER | opacity | 0 → 1 | 400 | ease-out | 1000 | — |

reduced：无 draw、无粒子；节点直接呈现。

#### 交互状态（详见 §3.3）

| 元素 | hover | focus | active | click |
|---|---|---|---|---|
| 节点 | 描边金色、相关边高亮、信息面板更新、其余节点 opacity .35 | 同 hover（键盘） | — | 打开对应抽屉 |
| 边 | 线宽 +0.5px、粒子加速 1.5×、tooltip 显示说明 | 同 hover | — | 打开流抽屉 `#/flow/{id}` |
| 筛选 chip | 下划线/描边；点击后该流独占高亮（其他流 opacity .12） | 环 | — | 切换筛选 |
| Focus 模式 | — | Enter 进入；Esc 退出 | — | 隐藏其他节点与无关边，画布放大 1.08× |
| 列表开关 | 下划线 | 环 | — | 图表/列表切换（`aria-expanded`） |

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 节点 | 打开业务/支柱/层级抽屉（按节点类型） | `#/business/{id}` 等 |
| 边 | 打开流抽屉（tab=Acteurs），内容 = 该流的 from/to、载体、数据、风险 | `#/flow/{id}` |
| 筛选后分享 | 复制链接按钮：`#/relations/{flowId}` | replaceState |
| 直接访问 `#/relations/attention` | 滚动至 07，筛选 Attention，聚焦图 | replaceState |

#### 移动端（390）

- 默认**列表视图**：5 个流分组，每组 2–5 行「De → Vers」；点行展开说明与数据标签；顶部筛选 chips 横排可滚动。
- 切到图视图：画布 350×420，初始 scale 使全图可见（节点文字 ≥ 9px，否则隐藏次要标签），可拖拽/双指缩放；tap 节点打开底部 sheet；tap 边显示底部信息条；提供「Recentrer」按钮。
- 不播粒子（性能与流量）；弧线静态。
- 手势：拖拽平移、双指缩放、双击复位。

#### 降级

- reduced-motion：无粒子、无 draw；hover 高亮 120ms 淡入；Focus 模式无缩放动画。
- low-bandwidth：静态 SVG + 列表默认展开；不加载粒子脚本；筛选仍可用。
- print：图谱打印为静态灰阶/双色线稿（五类流用线型 + 端点形状区分，见 visual-system §11.2）+ 一页流说明表；粒子与交互提示隐藏。
- no-JS：内联静态 SVG + 列表表格（始终可见），节点为普通链接到附录锚点。

#### 数据与空态

- 数据键：`data.pillars / businessLines`（节点来源）、`data.relations[]`（`{id, from, to, flow, strength, labelFR/ZH, detailFR/ZH, kpiIds, sourceLines}`）、`data.relations.flows[5]` 派生。
- 边的 `strength`（T1：数值 1–3）映射线宽/粒子数（3→huge, 2→medium, 1→small），不代表精确数值；tooltip 出现数字必须带 dataType 与来源。
- 缺失节点/边：跳过渲染；若某类流只剩 1 条边，仍显示但图例标注 `Flux partiel`。
- 筛选无结果：不隐藏画布，显示中央空态文字「Aucune relation renseignée pour ce flux」+ 「Réinitialiser」按钮。

#### 验收要点

1. 5 类流颜色/线型可区分（线型 + 端点形状双重编码）。
2. hover 节点 240ms 内高亮关联边；点击节点/边打开正确抽屉/流抽屉。
3. 筛选、Focus、列表切换均可用键盘完成。
4. 移动端默认列表性能良好（无 Canvas），图视图可缩放平移。
5. reduced / low-bw / print 下无粒子且信息不丢失。

---

### 2.8 区块 08 · Feuille de route — « Trois trajectoires, une même horloge »

**定位**：2026–2031 时间轴，三轨可切换：Plateforme bilatérale（3 步）/ RIMU（5 年）/ Calcul（3 期）；里程碑点击展开；BRIEF §4 区块 08。

#### 布局结构

- `<section id="08-roadmap" data-tone="light" data-section="08">`；ivory 底；padding 160/120。
- 头部：左 kicker `08 · FEUILLE DE ROUTE` + H2 `2026–2031 : trois trajectoires synchronisées`；右侧 lead + 轨道切换 segmented control（3 项，`role="tablist"`）。
- 时间轴（桌面）：横向轨道，宽 100%（最大 1200），左留 160px 放轨道名；上方年份刻度 2026–2031（Didot 13px，金色刻度线 1px 高 12px）；轨道高 96px，基线 1px 金线。
- 三条轨道（T1 `roadmap.tracks`：`track.bilateral / track.rimu / track.calcul`）：
  - Plateforme（3 步，src:L47–49）：`Lancement officiel` → `Mise en correspondance des ressources` → `Six catégories en parallèle + pré-étude calcul`。**源文件称三步「menées en parallèle」，与顺序呈现冲突，见 QA-05；视觉上三步节点横向错开 60px 并加「en parallèle」标签，不画单向箭头。**
  - RIMU（5 年，src:L54–58）：2027 / 2028 / 2029 / 2030 / 2031，每节点显示 MAU（250 k → 2,5 M）；点击展开详情卡（DAU、时长、jalons）。
  - Calcul（3 期，src:L61–63）：Phase 1（~18 mois，~100 加速卡，~1 MW）→ Phase 2（~36 mois，2–3 MW）→ Phase 3（extension modulaire + contrat électricité verte）。用相对时长条（18 个月 / 36 个月 / 开放终点），不与日历年强行对齐。
- 里程碑详情面板：点击节点后，轨道下方展开 1200×220 详情卡；同轨道同时只展开 1 个。
- 移动：纵向时间轴：左侧竖线 + 年份 chips（sticky）；每条轨道独立折叠（默认只展开当前选中轨道）；里程碑为行，点击展开 L3 详情；轨道切换用 chip 行。

#### 内容层级

1. H2 + lead（`La plateforme ouvre le canal en 2026–2027 ; RIMU et le calcul suivent un plan quinquennal.`）
2. 轨道切换（3）
3. 时间轴 + 里程碑
4. 里程碑详情
5. 微标注：`Scénario ambitieux — jalons indicatifs, à confirmer par le calendrier officiel.`

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 年份刻度 | ENTER | opacity | 0 → 1 | 400 | ease-out | 0 | 30 |
| 轨道基线 | ENTER | scaleX（origin left） | 0 → 1 | 900 | ease-out | 100 | — |
| 里程碑节点 | ENTER | opacity, scale | 0/0.6 → 1/1 | 360 | ease-out（回弹禁止） | 500 | 60 |
| 选中轨道 | STATE | opacity, x | 0/16 → 1（其他轨道 opacity .25） | 280 | ease-out | 0 | — |
| 详情面板 | OPEN | height 0→auto / opacity | 收 → 展 | 280 | ease-out | 0 | — |
| hover 节点 | HOVER | scale 1→1.25，金色 ring | — | 180 | ease-out | — | — |

reduced：无 draw、无缩放；切轨直接显示；详情面板瞬时展开。

#### 交互状态

| 组件 | hover | focus | active/selected | click |
|---|---|---|---|---|
| 轨道 tab | 文字提亮 | 金色环 | 金色下划线 + 文字全亮 | 切换轨道（`arrow keys` 切换，自动激活） |
| 里程碑节点 | scale 1.25 + tooltip（年份/标题） | 金色环 + tooltip | 选中：节点填充金色 + 详情展开 | 展开/收起详情 |
| 详情卡内链接 | 下划线 | 环 | — | 打开对应抽屉 |
| 「Tout voir」 | 下划线 | 环 | — | 展开全部轨道 |

- 键盘：轨道 `←/→`；里程碑 `Tab` 顺序，`Enter/Space` 展开；`Esc` 收起详情。
- 轨道切换时保留滚动位置；已展开详情自动收起并聚焦新轨道第一个节点。

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 轨道切换 | 切换轨道（local state） | 不写 hash；可分享 `?track=track.rimu` |
| 里程碑「Ouvrir le dossier」 | 打开对应抽屉（business/rimu/calcul） | push |
| 深链 `#/s/08-roadmap` | 滚动到本区块，默认选中 RIMU 轨道 | — |

#### 移动端（390）

- 轨道切换：3 个 chip 横排，当前 chip 金底墨字。
- 纵向时间轴：左边线 1px 金，节点圆点 10px；每行左侧年份（14px 等宽），右侧标题 + 一行摘要 + 展开箭头。
- 默认仅展开选中轨道；同屏最多 1 个展开详情；无横向滚动。
- 手势：垂直滚动；点击行展开；无横滑切轨。

#### 降级

- reduced-motion：基线直接显示；切轨无移动；详情直接展开。
- low-bandwidth：纯 CSS/HTML 静态呈现；里程碑详情用 `<details>`。
- print：三条轨道**全部展开**，纵向排列为 3 组，打印 1–2 页；里程碑只保留标题 + 年份 + 1 行详情。
- no-JS：使用 `<details>` 结构，全部轨道可见。

#### 数据与空态

- 数据键：`data.roadmap.tracks[3].milestones[]`，每项 `{id, period/year, titleFR/ZH, descriptionFR/ZH, deliverables[], kpiIds[], sourceLines}`。
- Plateforme 轨道的「并行」表述用 `parallel: true` 标记，渲染为并列节点组而非顺序箭头（QA-05）。
- RIMU 轨道数据必须与 09 区块同源（都引用 `data.kpis.series.mau`），避免 2031 数字不一致。
- 空态：某轨道无里程碑 → 显示「Jalons à confirmer」+ 轨道名；不画空轴。

#### 验收要点

1. 3 条轨道切换流畅（≤280ms），键盘 `←/→` 可用。
2. 里程碑点击展开详情、再次点击收起；同轨只展开 1 个。
3. RIMU 轨道 5 年数字与 09 / T1 `kpis.series` 完全一致。
4. Plateforme 轨道以并列方式呈现「三步并行」，不误导为串行。
5. 390 下纵向时间轴无横向溢出；打印时 3 轨全部可见。

---

### 2.9 区块 09 · Chiffres 2031 — « Ce que cela change, en chiffres »

**定位**：数据冲击：6 个 KPI + 收入构成图 + 5 年 MAU 曲线 + 方法学；BRIEF §4 区块 09 + §7.1。**计数器与图表规格见 §3.8 / §3.9。**

#### 布局结构

- `<section id="09-chiffres-2031" data-tone="dark" data-section="09">`；深色；padding 160/120；内容最大宽 1280。
- 头部：左 kicker `09 · CHIFFRES 2031` + H2 `Ce que cela change, en chiffres`；右侧：口径徽章 `Scénario ambitieux`（金色描边小徽章）+ `Méthodologie` 链接 + `Rejouer` 按钮（A-08）。
- KPI 仪表盘：桌面 3 列 × 2 行（6 块）；每块：标签（11px uppercase）→ 数值（Didot 56–64px）→ 单位/口径（12px）→ Source 点；块间 1px 金色分割线。
  - `2,5 M` utilisateurs actifs mensuels（2031，src:L72）
  - `800 000` utilisateurs actifs quotidiens（2031，src:L72）
  - `40 min` temps passé par jour（2031，src:L72）
  - `2,8 M` comptes portefeuille RIMP（2031，src:L73，**QA-02**）
  - `150–220 M USD` revenus annuels（2031，src:L82，**QA-06**）
  - `1,3–1,9 % du PIB`（2031，src:L82；PIB 基年口径见 **QA-07**）
- 第二行：左侧 `Répartition des revenus` 收入构成图（范围条，§3.9），右侧 `Trajectoire MAU 2027–2031` 折线/面积图（数据 src:L54–58）。
- 底部：就业条带 `30–40 k emplois directs + écosystème sur 5 ans`（src:L97，QA-03）+ 小字口径注 + Source/Dérivé/Hypothèse 图例 + 方法学入口。

#### 内容层级

1. H2 + 口径徽章
2. 6 KPI（月活/日活/时长/钱包/收入/PIB 占比）
3. 收入构成图
4. 5 年 MAU 曲线
5. 就业条带（30–40 k，标注「5 年累计，直接 + 生态」）
6. 方法学 + 数据分级图例

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 头部 | ENTER | opacity, y | 0/20 → 1/0 | 520 | ease-out | 0 | — |
| KPI 块 | ENTER | opacity, y | 0/16 → 1/0 | 480 | ease-out | 100 | 60 |
| KPI 数字 | ENTER | 数值滚动（§3.8） | 0 → 目标 | 1400 | `--ease-out` | 200 | 120 |
| 收入构成条 | ENTER | scaleX（origin left），标签延迟 | 0 → 1 | 900 | ease-out | 300 | 120 |
| MAU 曲线 | ENTER | path draw（stroke-dashoffset） | 全长 → 0 | 1100 | ease-out | 400 | — |
| MAU 数据点 | ENTER | scale 0→1 | — | 240 | ease-out | 600 | 70 |
| 就业条带 | ENTER | opacity, y | 0/12 → 1/0 | 480 | ease-out | 700 | — |
| 方法学入口 | ENTER | opacity | 0 → 1 | 320 | ease-out | 900 | — |

- `Rejouer` 按钮：重放当前可见分组（KPI + 图表）一次；reduced-motion 下禁用。
- 计数器与图表只在首次进入时初始化；回看重新武装规则见 A-08。

#### 交互状态

| 组件 | hover | focus | click | 说明 |
|---|---|---|---|---|
| KPI 块 | 数字提亮 4%；显示 tooltip（口径、年份、公式、Source） | 同上 + 金色环 | 打开方法学抽屉并定位到该 KPI 条目 | 不做数字放大动画 |
| 收入构成分段 | 该段提亮；显示 tooltip；其余段 opacity .55 | 同上 | 打开方法学抽屉定位 | 分段可聚焦 |
| MAU 数据点 | 显示 tooltip（年份、MAU、DAU、时长） | 同上 | — | 移动端 tap 显示 |
| `Méthodologie` | 下划线 | 环 | 打开 `#/methodo` | — |
| `Rejouer` | 图标旋转 360°（300ms 一次） | 环 | 重放 | reduced 下禁用 |

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| Méthodologie / KPI / 图段 | 打开方法学抽屉（KPI 定位锚点） | `#/methodo` |
| 就业条带 | tooltip 解释三层就业口径 + 链接到 10 | `#/s/10-benefices` |
| 深链 `#/s/09-chiffres-2031` | 滚动到区块 | — |

#### 移动端（390）

- KPI 改为 2 列 × 3 行；数值 36–40px；标签 10px；«150–220 M USD» 允许换行两行（数字与单位不断行）。
- 收入构成图改为竖向堆叠条（每段一行）；MAU 曲线全宽 350×160，仅保留 2027/2029/2031 三个标签。
- 就业条带纵排；方法学链接独立一行（44px 高）。
- 无横向滚动。

#### 降级

- reduced-motion：数字直接最终值；图表直接呈现；Rejouer 禁用。
- low-bandwidth：数字直接显示；图表用构建期静态 SVG；tooltip 简化。
- print：所有 KPI 最终值（完整 FR 格式），收入构成图与 MAU 曲线静态打印；工具提示内容不打印，改在页脚列出来源（见 visual-system §11.4）。
- no-JS：SSR 输出最终数字与静态图；无 tooltip（由页脚来源表承载）。

#### 数据与空态

- 数据键：`data.kpis[]` 中过滤 `surfaces/component`（仪表盘/收入分项/MAU 系列/就业）+ `meta.heroKpis` + 方法学 `qa[]`。
- 收入构成：RIMU 30–50 M；RIMP 90–140 M；Calcul 30–40 M（src:L79–81）。**总口径 150–220 M（src:L82）与分部上限相加 230 M 不一致 → QA-06；图表显示区间条并以虚线标注「Total affiché : 150–220 M」，方法学抽屉说明差异，不修改任何数字。**
- 就业 30–40 k：标签必须写 `5 ans · directs + écosystème`（src:L97），禁止与 2–4 k / 8–15 k 并排展示（QA-03）。
- 空态：任一 KPI 缺失 → 该块显示「—」+ 「Donnée à confirmer」；图表缺数据 → 隐藏图，显示「Graphique indisponible」+ 方法学链接。

#### 验收要点

1. 6 个 KPI + 就业条带完整，数字与 src 一致；FR/ZH 格式正确（§3.8 测试用例）。
2. 计数动画进入视口只播一次；Rejouer 可用（full motion）。
3. 收入构成图能看出三段范围与总口径差异（QA-06 方法学解释）。
4. MAU 曲线 5 点与 08 轨道、T1 `kpis.series` 完全一致。
5. 390 下 2×3 KPI 不溢出；打印时全部为最终值。

---

### 2.10 区块 10 · Bénéfices & transformation — « Ce que la Mauritanie y gagne »

**定位**：短/中/长期收益卡 + 西非区域枢纽地图（动态流向）+ 结构性转型 before/after；BRIEF §4 区块 10。**地图规格见 §3.7。**

#### 布局结构

- `<section id="10-benefices" data-tone="light" data-section="10">`；ivory 底；padding 160/120。
- 头部：kicker `10 · BÉNÉFICES & TRANSFORMATION` + H2 `Trois horizons de bénéfices, un hub régional` + lead。
- 收益三卡：桌面 3 列（Court terme / Moyen terme / Long terme），每卡：期限标签 + 3–4 条收益 bullet（数值 + 说明 + Source 点）；数据来自 src:L84–99 / T1 `kpis`。
- 地图面板：全宽深色内嵌面板（`data-tone="dark"` 的 inset card），高 520px；左侧地图（Nouakchott → Sénégal / Mali / Guinée / Côte d'Ivoire / Gambie 五条弧线），右侧 240px 信息栏。
- 结构性转型：`D'un transit subi à un hub de services`；左右两栏「Avant / Après」（T1 `transformations[]` 4–5 组对比），中间金色竖线；切换按钮 `Avant / Après` 驱动整组交叉淡入。
- 移动：三卡纵向；地图改为「流向清单」（5 行）+ 简化静态地图（350×260）；结构性转型上下两组。

#### 内容层级

1. H2 + lead
2. 三期限收益卡（Court / Moyen / Long terme）
3. 地图面板（西非枢纽）
4. 结构性转型对比
5. 微标注：`Bénéfices estimés — scénario ambitieux ; les emplois relèvent de périmètres différents (voir méthodologie).`

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 收益卡 | ENTER | opacity, y | 0/24 → 1/0 | 560 | ease-out | 0 | 90 |
| 地图面板 | ENTER | opacity, y + 面板金线 draw | 0/24 → 1/0 | 640 | ease-out | 120 | — |
| 国家弧线 | ENTER（地图进入后） | stroke-dashoffset draw | 全长 → 0 | 900 | ease-out | 300 | 120 |
| 流向粒子 | AUTO（延迟 1.6s） | 沿弧线位移 | 循环 | — | linear | 1600 | — |
| 国家标签 | ENTER | opacity | 0 → 1 | 400 | ease-out | 700 | 60 |
| 结构性转型对 | ENTER | opacity, y | 0/16 → 1/0 | 480 | ease-out | 240 | 80 |
| 「Après」列 | STATE（切换） | opacity, x | 0/12 → 1 | 320 | ease-out | 80 | 60 |

reduced：弧线静态、无粒子、无绘制；切换瞬时交叉淡入 120ms。

#### 交互状态

| 组件 | hover | focus | click | 说明 |
|---|---|---|---|---|
| 收益卡 | 顶部金线 0.35→1；Source 点 tooltip | 卡 2px 金环 | 打开对应业务抽屉 | 整卡可点 |
| 地图国家 | 该国弧线提亮 + 信息栏更新；其余弧线 opacity .35 | 同 hover；国家列表项可聚焦 | 信息栏「Voir la fiche」→ 打开业务抽屉 | 数据来自 `data.regions[]` |
| 地图空白 | 恢复默认说明 | — | 复位 | — |
| 转型切换 | 按钮下划线 | 环 | 切换 Avant/Après | segmented，`aria-pressed` |
| 转型对比对 | 行提亮 | 环（若可点） | 无（信息性） | — |

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 收益卡 | 打开相关业务抽屉 | push |
| 地图国家信息栏「Voir la fiche」 | 打开相关业务抽屉（如 Sénégal → `biens-conso`） | push |
| 转型对比 | 无跳转 | — |
| 深链 `#/s/10-benefices` | 滚动到区块 | — |

#### 移动端（390）

- 三卡纵排，每条 bullet 两行内；数值 18px。
- 地图：默认显示流向清单（5 行，每行：国家 + 方向 + 1 个数据标签 + 箭头），可切换「Voir la carte」显示 350×260 静态 SVG（无粒子、可 tap 国家高亮）；地图面板高度 360px。
- 结构性转型：上下两栏（Avant 上、Après 下），切换按钮置于顶部。
- 手势：无横滑；地图可 tap。

#### 降级

- reduced-motion：地图弧线静态；无粒子；切换瞬时。
- low-bandwidth：静态 SVG 地图 + 清单默认展开；不加载地图粒子脚本。
- print：收益三卡 + 地图（单色线稿 + 5 条弧线）+ 转型对比（左右两栏同时打印）共 2 页；粒子与切换按钮隐藏。
- no-JS：静态地图与全量对比信息完整输出。

#### 数据与空态

- 数据键：`data.kpis[]` 过滤收益（short/medium/long）；`data.regions[6]`（country, role, flowKinds, copyFR/ZH, relationIds）；`data.transformations[5]`（dimension, beforeFR/ZH, afterFR/ZH）。
- 地图国家数据缺失 → 该弧线不画，清单行显示「—」。
- 收益数字必须带期限/年份与来源；中长期的「20–50 MW」不得与 06 的 Phase 1 混排（QA-04）。
- 空态：整组缺失 → 显示区块级空态「Bénéfices en cours d'estimation」+ 方法学链接。

#### 验收要点

1. 三期限收益卡信息不互相矛盾；就业数字按口径分层（QA-03）。
2. 地图 5 个方向弧线、5 个清单行一一对应；hover/键盘均能更新信息栏。
3. 转型对比 Avant/Après 均可见（不依赖 hover）。
4. 390 下地图清单优先、可切静态地图；无横向溢出。
5. 打印页地图与转型对比清晰（线稿 ≥ 0.25pt）。

---

### 2.11 区块 11 · Ce que nous demandons à l'État — « Cinq décisions, six mois »

**定位**：五项国家支持做成可展开决策清单 + 6 个月首个交付物；BRIEF §4 区块 11。

#### 布局结构

- `<section id="11-soutiens-etat" data-tone="light" data-section="11">`；ivory 底；padding 160/120。
- 头部：kicker `11 · DÉCISIONS ATTENDUES` + H2 `Cinq décisions ouvrent le canal` + lead（`Aucune avance budgétaire majeure n'est requise à ce stade.`，src:L104）。
- 决策清单：5 行手风琴（每行高 88px 收起），左侧编号 `01–05` + 标题 + 一句摘要；右侧展开图标；展开后内容分 3 列（桌面）：`Ce qui est demandé` / `Pourquoi` / `Premier livrable (6 mois)`。
- 右侧粘性总结卡（桌面 ≥1280，宽 320）：`Six premiers mois` 时间线（S1–S6 两个小节点）+ `Imprimer cette liste` + `Copier`。
- 底部 CTA 条：`Télécharger la note de décision (PDF)` + `Demander une réunion`。
- 移动：清单单列，总结卡移到清单下方；底部 CTA 为 sticky bar（高 64px，加 `padding-bottom` 防遮挡）。

#### 内容层级（5 项，来自 T1 `stateSupports[]` / src:L105–109）

| # | 标题 FR | 关键诉求（摘要） | 6 个月首个交付物 |
|---|---|---|---|
| 01 | Organisation & politiques | 指定部委牵头 + 双方联络人；数字转型部明确授权；跨部门数据/内容规则协调 | 官方任务书 + 联络人名单 |
| 02 | Sites, terrains & listes de projets | 首批 5 类产业谈判清单；showroom 场地；港口仓储/保税通道；工业用地 | 场地确认函 + 首批项目清单 |
| 03 | Financement & budget | 有限启动资金（showroom、样品、培训、远程医疗试点）；优先项目有限配套 | 启动预算与拨付流程 |
| 04 | Finance & règlements | 央行/商业银行/保险/中非基金对话；贸易融资与信用证；6 个月内完成算力预研与绿电专线机制 | 算力预研初版 + 绿电专线机制 |
| 05 | Diplomatie, douanes & données | 西非商会与进口商邀请；展品/样品/转关/分销规则统一；可追溯与数据留在境内 | 区域邀请名单 + 规则澄清文件 |

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 行 | ENTER | opacity, y | 0/20 → 1/0 | 480 | ease-out | 0 | 60 |
| 行内编号 | ENTER | opacity | 0 → 1 | 320 | ease-out | 200 | 40 |
| 展开内容 | OPEN | height 0→auto + opacity | 收 → 展 | 300 | ease-out | 0 | — |
| 展开图标 | OPEN | rotate 0→45° | — | 240 | ease-out | — | — |
| 总结卡 | ENTER | opacity, x | 0/16 → 1/0 | 520 | ease-out | 200 | — |

reduced：无位移；手风琴高度瞬时。

#### 交互状态

| 组件 | hover | focus | active | 说明 |
|---|---|---|---|---|
| 决策行 | 背景 `#FBF6EC`→`#FFFDF8`；标题变金；编号下划线 | 2px 金环 | — | 点击展开 |
| 已展开行 | 顶部金线 1px；背景保持 `#FFFDF8` | — | — | **允许全部展开**（决策清单需要整体阅读与打印） |
| 复制按钮 | 下划线 | 环 | — | 复制结构化文本，toast「Liste copiée」 |
| CTA 主按钮 | 提亮 | 环 | — | 打印 / mailto |
| 总结卡 | — | — | — | 信息性 |

- 键盘：`Tab` 到行 → `Enter/Space` 展开；展开后内容可 Tab 进入；`Esc` 保留给全局抽屉/菜单，行不响应 Esc。

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 行展开 | 展开/收起（本地状态） | — |
| `Télécharger la note` | 打印准备态 → 系统打印/另存 PDF（A-15） | `#/print` → 打印后回 `#/` |
| `Demander une réunion` | `mailto:contact@aureondigital.mr?subject=...`（正式邮箱待客户确认，A-16） | — |
| `Copier la liste` | 复制纯文本清单到剪贴板 | — |

#### 移动端（390）

- 手风琴单列；每行 72px 收起；展开内容 1 列；`Premier livrable` 用金色左轨强调。
- 底部 sticky CTA bar：主按钮「Demander une réunion」+ 次按钮「Imprimer」；内容底部留 88px。
- 总结卡不 sticky，置于清单后。

#### 降级

- reduced-motion：手风琴瞬时开合，无图标旋转。
- low-bandwidth：无额外资源；纯 HTML。
- print：5 项**全部展开**，2 列排版打印 1–2 页；底部附二维码与联系方式；sticky 元素隐藏。
- no-JS：`<details>` 原生可开合；内容完整。

#### 数据与空态

- 数据键：`data.stateSupports[5]`，每项 `{id, order, titleFR/ZH, askFR/ZH, detailsFR/ZH, firstSixMonthsFR/ZH, sourceLines}`；`data.asks.sixMonths` 可由 content-model 13 派生。
- 缺失项：保留编号占位「À confirmer」并禁用展开；不隐藏（五项是叙事完整性）。
- 空态：整组缺失 → 区块级说明 + 联系 CTA。

#### 验收要点

1. 5 项均可展开且默认收起（打印前 JS 全部展开）。
2. 每项都能看到 `Premier livrable (6 mois)`。
3. 移动端 sticky CTA 不遮挡最后一项内容。
4. 打印页 5 项完整、2 列可读、含联系方式。

---

### 2.12 区块 12 · Risques & garanties — « Ce qui peut échouer, et comment nous le couvrons »

**定位**：5 类风险 + 缓解措施手风琴，建立可信度；BRIEF §4 区块 12。

#### 布局结构

- `<section id="12-risques" data-tone="light" data-section="12">`；ivory 底；padding 160/120；内容最大宽 1080（阅读型区块，收窄）。
- 头部：kicker `12 · RISQUES & GARANTIES` + H2 `Cinq risques, cinq réponses` + lead（`Les risques sont documentés, pas dissimulés.`）。
- 5 行手风琴（全宽，收起 96px）：左：风险编号 + 等级标签（`Élevé / Moyen / Suivi`，Hypothèse 映射）→ 标题；右：展开图标。展开内容：左右两栏：`Risque`（2–4 行）| `Garanties`（2–4 行缓解措施，带金色竖线）；底部：`Indicateur de suivi` + `Responsable`（Hypothèse）。
- 右侧竖排「风险矩阵」小图（桌面 ≥1280，200×200）：5 个点（概率 × 影响），点击点滚动并展开对应行；reduced/移动隐藏矩阵，用列表替代。

#### 内容层级（5 风险，T1 `risks[]` / src:L111–115）

| # | 风险 | 等级（Hypothèse） | 缓解要点 |
|---|---|---|---|
| 01 | Interopérabilité et résistance des portefeuilles / opérateurs existants | Élevé | 央行强制互联时间表；国家补贴/工资优先走互联轨道（src:L111） |
| 02 | Controverses religieuses / tribales et protection des mineurs | Élevé | 宗教顾问机制 + 产品默认严格限制 + 快速下架；本地化治理规则（src:L112） |
| 03 | Électricité, sable et fluctuations du réseau | Moyen | 2N + 柴油 + 光伏 + 电池；绿电合同（src:L113） |
| 04 | Données transfrontalières et dépendance au cloud | Moyen | 本地账本与模型；训练可混合、推理回流（src:L114） |
| 05 | Talents et continuité du projet | Suivi | 高校定向班、本地学徒；数据/支付互操作立法义务（src:L115） |

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 头部 | ENTER | opacity, y | 0/16 → 1/0 | 480 | ease-out | 0 | — |
| 行 | ENTER | opacity, y | 0/16 → 1/0 | 440 | ease-out | 100 | 50 |
| 等级标签 | ENTER | opacity | 0 → 1 | 320 | ease-out | 300 | 30 |
| 展开 | OPEN | height + opacity | 收 → 展 | 280 | ease-out | 0 | — |
| 风险矩阵点 | ENTER | scale 0→1 | — | 360 | ease-out | 500 | 60 |

reduced：无位移；展开瞬时。

#### 交互状态

| 组件 | hover | focus | click |
|---|---|---|---|
| 风险行 | 标题提亮；等级标签描边；背景 `#FFFDF8` | 2px 金环 | 展开/收起（允许多个展开） |
| 矩阵点 | tooltip 风险名；相关行金线高亮 | 环 | 滚动到该行并展开 |
| 缓解措施内的术语 | tooltip 名词解释 | 环 | — |

- 等级标签不使用新色：金色实心/描边/灰描边 + 文字区分；图例说明。
- 键盘：行 `Enter/Space` 开合；`Tab` 遍历；矩阵点可聚焦。

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| 展开 | 本地状态 | — |
| 深链 `#/s/12-risques` | 滚动到区块 | — |
| 矩阵点 | 滚动并展开（同页内） | — |

#### 移动端（390）

- 单列手风琴；收起行 88px；展开内容上下两栏（Risque / Garanties）；矩阵隐藏。
- 等级标签保持可见；点击行命中 44px；无 hover。

#### 降级

- reduced-motion：瞬时开合。
- low-bandwidth：静态 HTML；无矩阵脚本。
- print：5 项全部展开，1 页 2 列；矩阵打印为静态小图；来源脚注。
- no-JS：`<details>` 原生可开合；内容完整。

#### 数据与空态

- 数据键：`data.risks[5]`，每项 `{id, order, titleFR/ZH, riskFR/ZH, guaranteesFR/ZH, sourceLines}`；等级为设计 Hypothèse（源文件未分级），页面只显示文字等级 + 图例；方法学抽屉说明分级依据。
- 空态：缺失风险 → 不显示占位（避免「没有风险」的误导），改为区块级注释「Liste en cours de consolidation」。

#### 验收要点

1. 5 项风险与缓解一一对应，来源可溯。
2. 等级仅用金/灰与文字区分，不引入第六种颜色。
3. 移动端与打印完整；打印 1 页内。
4. 无 hover 也能读到风险矩阵的信息（列表等价物）。

---

### 2.13 区块 13 · Next steps & contact — « Prochaines étapes »

**定位**：转化：30/90 天下一步、预约会议、下载 PDF、AUREON 简介与联系方式；BRIEF §4 区块 13。

#### 布局结构

- `<section id="13-next-steps" data-tone="dark" data-section="13">`；深色收束；padding 160/80；内容最大宽 1280。
- 上部两栏：左 `cols 1–7`：kicker `13 · PROCHAINES ÉTAPES` + H2 `Trente jours pour décider, quatre-vingt-dix pour livrer` + lead；两个下一步卡（30 天 / 90 天，各 3 条）。
- 右 `cols 8–12`：CTA 组（垂直）：主 `Demander une réunion`（mailto）、次 `Télécharger la présentation (A4)`（打印/PDF）、`Revoir la visite guidée`（Tour）、`Copier l'adresse e-mail`。
- 下部：AUREON 简介条（logo + 2 行定位 + 联系方式三列：电话 / 邮箱 / 网址）。
- 页脚（全宽，深一档）：左侧 `Sources & méthodologie` 链接组（Methodologie、Data sources、Mentions légales、语言切换、Imprimer、Mode économie de données）；中间数据来源声明；右侧版权 © 2026 AUREON DIGITAL SARL · Nouakchott。
- 回到顶部按钮（右下角，滚动 >1.2 屏后出现，44px，金色描边）。

#### 内容层级

1. H2 + lead
2. 30 / 90 天卡
3. CTA 组
4. AUREON 简介 + 联系
5. 页脚（sources/methodo/legal）
6. 数据来源声明与版权

#### 联系信息与隐私（重要）

- 网页公开联系建议：`contact@aureondigital.mr`、`+222 22 66 51 08`、`www.aureondigital.mr`、Nouakchott。
- **不给网页默认发布**个人微信 / 中国手机 / 个人 Gmail（README §3 的名片信息用于印刷品）：网页版需客户确认后由 T1 提供（A-16）。若客户要求一致，则按名片内容发布，并在页脚加隐私说明。
- 邮箱使用 `mailto:` 且带预填主题：`Demande de réunion — Plateforme sino-mauritanienne`；正文预填 3 行模板。

#### 进入与滚动动效

| 元素 | trigger | 属性 | from → to | t | e | d | s |
|---|---|---|---|---|---|---|---|
| 头部 | ENTER | opacity, y | 0/20 → 1/0 | 520 | ease-out | 0 | — |
| 30/90 卡 | ENTER | opacity, y | 0/20 → 1/0 | 520 | ease-out | 120 | 80 |
| CTA 组 | ENTER | opacity, x | 0/16 → 1/0 | 480 | ease-out | 240 | 60 |
| AUREON 条 | ENTER | opacity | 0 → 1 | 480 | ease-out | 360 | — |
| 页脚 | ENTER | opacity | 0 → 1 | 400 | ease-out | 480 | — |
| 回到顶部按钮 | SCROLL（>1.2 屏） | opacity, y | 0/8 → 1/0 | 240 | ease-out | — | — |

reduced：无位移；直接呈现。

#### 交互状态

| 组件 | hover | focus | active | 说明 |
|---|---|---|---|---|
| 主 CTA | 背景提亮 6%，箭头右移 | 金环 | scale(.99) | 高 52px |
| 次 CTA | 下划线 | 环 | — | 高 48px |
| 联系方式 | 下划线 + 复制图标出现 | 环 | 点击复制（toast） | 电话/邮箱可复制 |
| 页脚链接 | 下划线 | 环 | — | — |
| 回到顶部 | 上移 8px | 环 | — | 点击平滑滚动（reduced 瞬时） |

#### 点击行为与深链

| 触发 | 行为 | URL |
|---|---|---|
| Demander une réunion | `mailto:` 打开邮件客户端（无后端） | — |
| Télécharger la présentation | 打印准备态 → 打印/另存 PDF；若构建期已生成静态 PDF 则直接下载（T3 决定） | `#/print` |
| Revoir la visite guidée | 启动 Tour | `#/tour/1` |
| Sources & méthodologie | 方法学抽屉 | `#/methodo` |
| 语言切换 | fr/zh | `?lang=`（replace） |
| Mode économie de données | 切换 low-bw | `?bw=low`（replace）+ localStorage |
| Mentions légales | 静态页/抽屉（简版） | `#/legal`（扩展路由，A-18） |

#### 移动端（390）

- 单列：30 天卡 → 90 天卡 → CTA 组（全宽按钮，主 CTA 置顶且 52px）→ AUREON 简介 → 联系方式（3 行，每行 44px）→ 页脚（链接 2 列，版权 1 行）。
- 回到顶部按钮固定在右下 16px，bottom 24px，不与页脚重叠。
- 无 hover；按下态背景变化。

#### 降级

- reduced-motion：无位移。
- low-bandwidth：不做邮件预填以外的网络请求；PDF 链接若存在则直接下载。
- print：作为最后一页，打印 AUREON 简介 + 联系 + QR 码（QR 白底，留白 ≥4 模块）；页脚来源声明；隐藏 CTA 按钮样式，保留文字与邮箱。
- no-JS：mailto 与静态 PDF 链接可用；Tour 入口隐藏。

#### 数据与空态

- 数据键：`data.nextSteps.d30[3]` / `d90[3]`、`data.contact`、`data.legal`（content-model 13 + 项目配置）。
- 联系数据缺失：显示「Contact à confirmer」；mailto 不出现在 DOM（防止无效点击）。
- 若静态 PDF 未生成：按钮文案改为 `Imprimer / Enregistrer en PDF`，并在点击前显示 1 行说明。
- 空态：30/90 卡缺项 → 隐藏该卡，保留另一张并居中。

#### 验收要点

1. 30/90 天内容与 11 区块「6 个月」衔接不矛盾。
2. 三个 CTA 均可用：mailto、打印/PDF、Tour。
3. 页脚包含：方法学、来源声明、语言、打印、低带宽、版权。
4. 390 下 CTA 全宽、联系方式可复制、无横向滚动。
5. 打印尾页 QR 可扫、白底、留白足够。

---

## 3. 复杂交互组件深度规格

### 3.1 L1 总览：三支柱 / 六业务 / 四层架构统一交互模型

> 适用于 00 支柱 chips、02 系统图、03 支柱卡、06 四层架构。统一状态机与数据属性，前端只实现一套「节点交互增强」逻辑。

#### 3.1.1 节点类型与数据契约

| 类型 | `data-node-type` | 数量 | 点击落点 | 抽屉 tab 结构 |
|---|---|---|---|---|
| 支柱 | `pillar` | 3 | `#/pillar/{id}` | 6 tab（§3.2；T1 `drawerTabs` 同） |
| 业务线 | `business` | 6 | `#/business/{id}` | 6 tab（§3.2） |
| 架构层 | `layer` | 4 | `#/layer/{id}` | 6 tab（同模板；内容按层适配） |
| RIMU 模块 | `module` | 8 | `#/rimu/{id}` | 6 tab（同模板；Protection & données 内容进 Fonctionnement / Acteurs） |
| 五类流 | `flow` | 5 | `#/flow/{id}` | 6 tab（同模板；Acteurs & flux 优先） |

统一字段（构建期写入 DOM `data-*`，运行期只读）：`data-node-id`、`data-node-type`、`data-related="id1 id2 …"`（1 跳关联，用于高亮）、`data-route`、`data-label`。

#### 3.1.2 状态机

```
idle ──hover/focus──▶ highlighted ──leave/blur──▶ idle
idle ──click/Enter──▶ opening(drawer) ──closed──▶ idle
highlighted ──click/Enter──▶ opening
focus-mode: idle ──F/按钮──▶ isolated ──Esc/按钮──▶ idle
```

| 状态 | 视觉 | 其他节点/边 | 恢复 |
|---|---|---|---|
| idle | 1px `--line-soft` 描边；文字 100% | 100% | — |
| highlighted | 1.5px 金色描边 + 轻金色外发光（≤ 12px 柔和）；文字全亮 | 关联 1 跳节点/边 → 100%（金线加粗 0.5px）；无关 → opacity .35，240ms | 指针离开/焦点离开立即（tween 240ms） |
| isolated（Focus 模式） | 画布 1.08× 居中；只保留 1 跳子图 | 子图外全部 opacity 0（仍在 DOM，供读屏列表） | Esc 或「Quitter le focus」；无缩放动画（reduced） |
| opening | 点击节点出现 1 帧金色脉冲（200ms，仅 full motion） | 页面压暗 | 抽屉关闭后回到 idle |

- 高亮**不做位移**，避免坐标抖动；仅描边、透明度、发光。
- 焦点顺序固定：支柱 → 业务 → 层（02）；模块按阅读顺序（05）；层按自下而上（06）。
- 读屏：每个节点 `aria-label="{名称} — {类型}，ouvrir le dossier"`；容器 `role="group"`；Focus 模式按钮带 `aria-pressed`。

#### 3.1.3 工具提示（统一组件）

- 触发：hover 延迟 80ms 显示 / 聚焦立即显示；离开立即隐藏。
- 位置：指针右侧 12px，空间不足自动翻转；键盘触发时锚定节点包围盒右侧。
- 尺寸：最大 320px，内边距 12×16；背景 `--navy-900`，文字象牙白；1px 金色描边；无阴影或极轻阴影。
- 内容：类型标签（10px uppercase 金）→ 名称（15px）→ 一行说明（13px，≤2 行）→ 操作提示「Ouvrir le dossier ↗」。
- 可访问性：`role="tooltip"`；触发元素 `aria-describedby`；tooltip 不接收焦点；移动端不用 hover tooltip。
- 禁止 tooltip 内放可点击链接；需要操作时由节点本身承载。

#### 3.1.4 移动端统一规则（<1024）

- 系统图/架构图不缩放呈现：改为 DOM 竖排（02 竖排系统图；06 四层手风琴）。
- 支柱 chips 与业务卡：tap 直接打开底部 sheet，无 hover、无 tooltip。
- 「Focus / Isolate」在移动端仅关系图提供（列表视图优先）。
- 所有节点命中区 ≥ 48px；相邻节点间距 ≥ 8px。

#### 3.1.5 打印与静态降级

- 打印：所有节点为静态 SVG/HTML，无发光；关联高亮不打印；图例保留；02 一页，06 一页。
- 低带宽：不加载高亮/提示脚本增强模块；点击仍可通过普通链接实现。
- reduced-motion：高亮仅 120ms 淡入；Focus 无缩放；脉冲反馈取消。

---

### 3.2 L2 业务详情抽屉：6 tab 内容结构

> 抽屉组件与动画见 §1.4。本节定义每个 tab 的信息架构、组件、动画与数据键。**所有抽屉类型（业务 / 支柱 / RIMU 模块 / 层级 / 流）共享同一 6 tab 模板**；tab 顺序不可变；某 tab 无数据时显示空态（§3.2.9），不得隐藏或改序。

#### 3.2.1 抽屉通用结构

```
header: kicker(type · 0X / 06) · H2 名称 · 状态徽章 · [Copier le lien] [Fermer]
meta row: 一句话定位 · 主要参与方 chips · 五类流 chips（in/out）
tablist: Aperçu | Fonctionnement | Chiffres clés | Acteurs & flux | Feuille de route | Risques
scroll region: 当前 tab 内容，L3 手风琴
sticky footer (optional): « Voir la source / Méthodologie » + « Imprimer cette fiche »
```

#### 3.2.2 tab 1 · Aperçu

| 区块 | 内容 | 数据键 | 动效 |
|---|---|---|---|
| 摘要 | 80–120 词的业务定义（FR；ZH 对照） | `business.definitionFR/ZH` | 打开时 fade-up 280ms，stagger 40 |
| 三个关键数字 | 3 个 KPI 小方块（值 + 单位 + 年份） | `business.kpiIds[0..2]` → `kpis[]` | 数字不滚动；透明度渐入 |
| « Ce que ça change » | 3 条收益/影响 bullet | `business.impact[3]` | 逐条 60ms |
| 流向摘要 | 五类流 in/out chips | `business.flowIn/out[]` | chips fade 200ms |
| 关联 | 「Voir aussi」2–3 张迷你卡 | `business.related[]` | hover 时箭头动；点击替换抽屉内容（push） |
| 来源 | 底部：`Source : dossier RIMU — section II / IV` + 方法学链接 | `business.sourceLines[]` | 静态 |

#### 3.2.3 tab 2 · Fonctionnement

| 区块 | 内容 | 数据键 | 动画 |
|---|---|---|---|
| 业务流程 | 3–5 步竖向步骤 | `business.workflow[]` | 金色连接线 draw 600ms；步骤 stagger 80ms（仅首次进入） |
| 子模块 | 3–6 个子模块卡（L3 手风琴，单开） | `business.subModules[]` | 高度 280ms；图标旋转 |
| 关键机制 | 2–3 条机制说明 | `business.mechanisms[]` | 静态 |
| 依赖 | 依赖的国家/合作方条件（chips） | `business.dependencies[]` | 静态 |

#### 3.2.4 tab 3 · Chiffres clés

| 区块 | 内容 | 数据键 | 动画 |
|---|---|---|---|
| KPI 网格 | 3–6 个数字块 | `business.kpiIds[]` | 滚动 1200ms（仅该 tab 首次进入；reduced 直接最终值） |
| 小型图表 | 1 个支持性图表（bar / range / sparkline） | `business.chart` | draw-on 800ms；reduced 直接呈现 |
| 口径说明 | 每图下方 1 行：`Chiffres projetés 2031 — scénario ambitieux` | `business.kpisMeta` | 静态 |
| 方法学 | 「Voir la méthodologie」→ 内容替换为方法学（同一抽屉实例 + 返回按钮，push `#/methodo`），禁止嵌套抽屉 | — | 交叉淡入 160ms |

#### 3.2.5 tab 4 · Acteurs & flux

| 区块 | 内容 | 数据键 | 动画 |
|---|---|---|---|
| 参与方列表 | 3–6 个参与方（État / Entreprise / Banque / Opérateur / Créateur / Partenaire chinois） | `business.actorsFR/ZH[]` | 逐条 fade-up 60ms |
| 流向表 | 五类流 in/out 表：流类型 / 方向 / 说明 / 数据标签 | `business.flowIn/out[]`、`data.relations[]` | 静态（表格可滚动） |
| 迷你关系图 | 320×240 子图：本业务 1 跳节点 + 五类流边 | `data.relations` 子集 | 边 draw 500ms；无粒子 |
| 缺口说明 | 某类流无数据：「Non chiffré à ce stade」 | — | 静态 |

#### 3.2.6 tab 5 · Feuille de route

| 区块 | 内容 | 数据键 | 动画 |
|---|---|---|---|
| 迷你时间轴 | 2–3 个阶段点（纵向） | `business.roadmap[]` / `data.roadmap` | 轴 draw 400ms；节点 stagger 80ms |
| 依赖/前置 | 1–3 条前置条件 | `business.prerequisites[]` | 静态 |
| 关联 | 「Voir la feuille de route complète」→ 关闭抽屉并滚动到 08 | — | — |

#### 3.2.7 tab 6 · Risques

| 区块 | 内容 | 数据键 | 动画 |
|---|---|---|---|
| 风险 1–2 条 | 等级标签 + 风险描述 + 缓解措施（金色竖线）+ 来源 | `business.risks[]` / `data.risks[]` | 展开/收起 L3（280ms） |
| 兜底链接 | 「Voir les garanties du programme」→ 关闭抽屉并滚动到 12 | — | — |
| 空态 | 「Pas de risque spécifique identifié — voir les risques transverses（§12）」 | — | 静态 |

#### 3.2.8 抽屉 footer（全 tab 固定）

- 左：`Source : dossier RIMU · section {II/IV/V}` + `Méthodologie` 链接（内容替换，见上）。
- 右：`Imprimer cette fiche`（打印时只打印当前 fiche 的附录取代页；见 §3.10）。
- 底部内边距 32px + safe-area。

#### 3.2.9 6 tab 的空态矩阵

| Tab | 有数据 | 无数据表现 |
|---|---|---|
| Aperçu | 完整 | 只显示摘要占位 + 「Dossier en préparation」（若摘要也无 → 不打开抽屉） |
| Fonctionnement | 完整 | 「Le détail opérationnel sera précisé en phase de cadrage.」+ 返回 Aperçu |
| Chiffres clés | 完整 | 隐藏图表；显示 3 个「—」占位 + 「Données à confirmer」+ 方法学 |
| Acteurs & flux | 完整 | 参与方列表显示「À identifier」；流向表为空则隐藏，保留一句说明 |
| Feuille de route | 完整 | 「Jalons à confirmer」+ 通用阶段（Étude / Pilote / Déploiement）灰阶示意 |
| Risques | 完整 | 指向 12 区块的横向风险 |

#### 3.2.10 验收要点

1. 6 tab 对所有抽屉类型都存在且顺序一致；tab 间切换 ≤300ms，无内容跳动。
2. 每个 tab 的数据都能追溯到 T1 `data-model.json` 键；无硬编码文案。
3. 方法学从抽屉进入时是内容替换 + 返回按钮，不产生嵌套抽屉。
4. `Tab` 可完整遍历抽屉内所有控件；`Esc` 关闭；焦点归还。
5. 4 个入口（02 节点 / 04 卡片 / 07 节点 / Tour）打开同一业务时内容完全一致。

---

### 3.3 五类流关系网络图（区块 07）

#### 3.3.1 数据模型与图结构

- 节点 13 个（设计坐标 1280×720；公共 id 去 T1 前缀）：

| id | 类型 | 名称 | x, y | 入口 |
|---|---|---|---|---|
| `plateforme` | pillar | Plateforme bilatérale | 170, 150 | `#/pillar/plateforme` |
| `rimu` | pillar | RIMU | 170, 360 | `#/pillar/rimu` |
| `calcul` | pillar | Centre de calcul IA | 170, 570 | `#/pillar/calcul` |
| `projets` | business | Projets & investissements | 520, 90 | `#/business/projets` |
| `commerce-gros` | business | Commerce de gros | 520, 270 | `#/business/commerce-gros` |
| `biens-conso` | business | Biens de consommation | 520, 450 | `#/business/biens-conso` |
| `finance-rimp` | business | Finance & RIMP | 520, 630 | `#/business/finance-rimp` |
| `formation` | business | Formation & talents | 880, 180 | `#/business/formation` |
| `sante` | business | Santé & télémédecine | 880, 360 | `#/business/sante` |
| `partenaires-chinois` | actor | Partenaires chinois & bailleurs | 1170, 90 | `#/flow/capital` |
| `acheteurs-ouest-africains` | actor | Acheteurs ouest-africains | 1170, 270 | `#/flow/marchandises` |
| `utilisateurs-createurs` | actor | Utilisateurs & créateurs | 1170, 450 | `#/flow/attention` |
| `administrations-operateurs` | actor | Administrations & opérateurs | 1170, 630 | `#/flow/paiements` |

- 边来自 T1 `relations[35]`（示例；完整列表以 T1 为准；每条边声明 flow 与 strength）：

| flow | from → to | 说明（tooltip 用） | strength |
|---|---|---|---|
| capital | partenaires-chinois → plateforme | 投资意向与项目融资的官方通道 | 3 |
| capital | plateforme → projets | 项目清单与尽调后的资金匹配 | 3 |
| capital | plateforme → biens-conso | showroom / 样品 / 首单的启动资金 | 2 |
| marchandises | partenaires-chinois → commerce-gros | 批发与装备供货 | 3 |
| marchandises | commerce-gros → acheteurs-ouest-africains | 经 Nouakchott 分拨的货物 | 3 |
| marchandises | biens-conso → acheteurs-ouest-africains | 消费品集散与转口 | 3 |
| paiements | utilisateurs-createurs → rimu | 打赏、订阅、直播打赏（in） | 2 |
| paiements | rimu → finance-rimp | 平台交易结算进入 RIMP | 3 |
| paiements | finance-rimp → administrations-operateurs | 税费、水电、市政缴费的可审计通道 | 2 |
| données | rimu → calcul | 推荐/审核/转写的推理请求 | 3 |
| données | calcul → rimu | 本地模型返回（数据不出境） | 2 |
| données | administrations-operateurs → calcul | 行政与行业数据服务 | 1 |
| attention | utilisateurs-createurs → rimu | 观看、创作、直播 | 3 |
| attention | rimu → biens-conso | 内容到货架（Marché / live commerce） | 2 |
| attention | rimu → formation | 培训与就业内容分发 | 1 |
| attention | rimu → sante | 健康科普与远程医疗服务入口 | 1 |

- 边几何：三次贝塞尔曲线；同向多条流按 12px 偏移；箭头 marker 8px；粒子沿路径运动。
- 图例：5 行（颜色 + 线型 + 名称 FR/ZH + 1 行示例），右下角固定；色值见 visual-system §3.4。

#### 3.3.2 五类流的视觉编码

| flow | 颜色 | 线型 | 粒子形状 | 权重→粒子数 |
|---|---|---|---|---|
| Capital | `--flow-capital` 香槟金 | 实线 1.5px | 菱形 4px | 3→4 / 2→2 / 1→1 |
| Marchandises | `--flow-marchandises` 象牙金 | 实线 1.5px + 短划线 6 4 | 方形 4px | 同上 |
| Paiements | `--flow-paiements` 信号绿 | 实线 1.5px | 圆点 4px | 同上 |
| Données | `--flow-donnees` 钢蓝 | 实线 1.5px + 点线 1 4 | 圆环 5px | 同上 |
| Attention | `--flow-attention` 赭铜 | 实线 1.5px | 三角 4px | 同上 |

双重编码（颜色 + 线型 + 端点形状）保证色觉障碍下可区分。

#### 3.3.3 交互状态机

```
idle ─hover edge────▶ edge-hover ─leave─▶ idle
idle ─hover node────▶ node-hover ─leave─▶ idle
idle ─click chip────▶ filtered(flow) ─click "Tous"─▶ idle
node-hover ─I / 按钮─▶ isolate(node) ─Esc─▶ filtered/idle
filtered(flow) ─click node─▶ drawer open（筛选保持）
```

| 状态 | 边 | 节点 | 面板 |
|---|---|---|---|
| idle | 全部 opacity 0.85；粒子运行 | 100% | 「Sélectionnez un flux」 |
| edge-hover | 该边 2.5px + 粒子 1.5×；其余边 opacity .3 | 两端节点 100%，其余 .5 | 流说明卡 |
| node-hover | 关联边 100%、粒子；无关边 .15 | 该节点金色描边；1 跳节点 100%，其余 .35 | 节点信息 + 「Ouvrir le dossier」 |
| filtered(flow) | 该流边 100%，其余 .12；图例高亮 | 该流节点 100%，其余 .4 | 流总览 + 「Isoler ce flux」 |
| isolate(node) | 只保留 1 跳子图；其他 opacity 0（保留 DOM） | 子图节点可交互 | 「Quitter le focus」；画布 1.08× |
| drawer open | 保持打开前高亮 | — | 抽屉内容；关闭后恢复 |

- 点击空白：清除 hover/filter/isolate，**但不关闭抽屉**。
- 筛选与 isolate 可叠加；Esc 逐层退出（先 isolate，再 filter）。

#### 3.3.4 Tooltip 与信息面板

- 桌面 ≤1279：跟随指针 tooltip（最大 340px）：流标签（金）→ 名称 → 说明（≤2 行）→ 数据标签 → 操作提示。
- 桌面 ≥1280：右侧 360px 常驻面板（不跟随指针）；hover 离开后 400ms 恢复默认。
- 移动：tap 节点 → 底部信息条（固定底部 120px）→ 点按钮打开 sheet；tap 边 → 流说明。
- 键盘：focus 节点/边时信息面板显示；`Enter` 打开抽屉或流抽屉。
- 数据标签：任何数字必须带 `Source/Dérivé/Hypothèse` 与来源行；无数字时显示「Volume non chiffré」。

#### 3.3.5 流动粒子实现

- 粒子数量按 strength：3→4、2→2、1→1；总粒子数 ≤30；直径 3–5px；速度 42px/s（1.5× 时 63px/s），沿路径线性循环。
- 实现：`getTotalLength/getPointAtLength` + 统一 rAF ticker；位置写 `transform: translate3d`；`will-change` 仅运行时加。
- 门控：页面 hidden 暂停；图不可见暂停；reduced/low-bw 不创建；连续 2s <45fps 自动降级为静态虚线。

#### 3.3.6 键盘与列表替代

- 节点可 Tab（顺序 = 节点 1–13）；边不进入 Tab（避免 35 条边打断），通过「Version liste」表格行（可聚焦，Enter 打开）可达。
- 「Version liste」：5 组折叠表；行 = from → to / 说明 / 数据标签。
- 读屏：图 `aria-describedby` 指向图例与列表开关；节点 `aria-label="{名称}，{类型}，{k} flux liés"`。

#### 3.3.7 移动端

- 默认列表：顶部 5 个 flow chip（横排可滚动）；5 组折叠；点击行展开数据标签与「Ouvrir le dossier」。
- 图模式：350×420，初始 scale 适配；节点文字 ≥9px 才显示；单指拖拽、双指缩放 1–2.5×；双击复位；无粒子。
- 性能：按需渲染；退出销毁粒子/rAF。

#### 3.3.8 降级与打印

- reduced：无粒子/无 draw；高亮 120ms；isolate 无缩放。
- low-bw：默认列表；不加载图增强脚本；静态 SVG 可点。
- print：静态双色线稿（五类流用线型 + 端点形状）；附一页流说明表；粒子、tooltip、筛选隐藏。
- no-JS：SSR 静态 SVG + 列表表格。

#### 3.3.9 验收要点

1. 13 节点、≥16 条边在 1280×720 内无重叠遮挡。
2. hover 节点/边 240ms 内完成高亮；tooltip 不遮挡当前节点。
3. 5 类流在灰阶打印测试中仍可区分。
4. reduced 下无粒子、无位移；视图切换不丢信息。
5. 移动端列表默认、图模式可缩放平移；无横向滚动。

---

### 3.4 RIMU 手机 mockup 自动演示

#### 3.4.1 结构与尺寸

| 部件 | 规格 |
|---|---|
| 外框 | 340×700 px（设计基准）；圆角 28px；1px 金色描边 + 内 1px 深金；顶部 24px 状态栏；底部 24px home indicator |
| 屏幕 | 340×652，内圆角 26px；`overflow:hidden`；背景 `#0B1F3A → #071C36` |
| 产品 UI | 屏幕内元素用 DOM（非图片）：顶部 tab bar（4 tab）、内容区、底部 tab bar（For You / Abonnements / À proximité / Marché） |
| 舞台 | 手机下方 40px：4 个章节点（12px）+ 播放/暂停按钮（44px）+ 进度线（1px 金，8s 内从左到右） |
| 标签 | 角落固定微标 `Démo — données illustratives`（9px，象牙白 40%） |

#### 3.4.2 8 秒循环分解（每帧 2000ms）

| 时间 | 阶段 | 屏幕内容 | 动画 | 对应能力（src） |
|---|---|---|---|---|
| 0–2s | 1 · For You | 竖屏信息流：头像/账号、2 行标题、右侧点赞/评论/收藏、底部进度条；慢慢上滑 | 内容列表 `translateY 0 → -90px`，2000ms linear（首 200ms ease-out） | 短视频 + 推荐（src:L26–27） |
| 2–4s | 2 · Marché | 商品网格 2×3：价格、距离、RIMP 角标；顶部「À proximité」筛选 chip | 网格卡 stagger 90ms fade-up；RIMP chip 高亮 1 次 | Shop/支付/附近（src:L26、L30） |
| 4–6s | 3 · Live commerce | 直播画面（抽象渐变 + 商品卡浮层）、评论滚动、`+ Panier` 按钮 | 评论 3 条依次上移；购物车按钮脉冲 1 次（scale 1→1.04→1，600ms） | Live + live commerce（src:L28） |
| 6–8s | 4 · Paiement RIMP | 底部支付 sheet：金额、收款方、RIMP 标志；成功勾画 + «Paiement confirmé» | sheet 上滑 320ms；勾 `stroke-dashoffset` 400ms；成功文案 fade 200ms；停留到 8s | RIMP 结算（src:L30） |

- 8s 结束后回到帧 1 循环；帧切换：屏幕内容 320ms 滑动或 240ms 淡入（reduced）。帧内不与用户交互（`pointer-events:none`）。
- 进度线每帧 0→1 线性，帧切换归零。

#### 3.4.3 自动演示状态机

```
idle ──进入视口 60% + 可见页──▶ playing(0→8s 循环)
playing ──hover/pointerenter / focusin──▶ paused（记录 t）
paused ──离开 400ms / focusout──▶ playing（从 t 继续）
playing ──tab 点击 / 章节点 / 播放暂停按钮──▶ manual（暂停；用户控制）
manual ──播放按钮──▶ playing（从当前帧开始）
any ──document.hidden / IO<60% / reduced / low-bw──▶ suspended（停在当前帧）
```

- reduced-motion：永不自动播放；显示静态帧 1 + 4 个章节点（点击逐帧）+ 隐藏播放按钮。
- low-bandwidth：显示单张静态合成 SVG（4 帧拼贴，≤40KB）；无循环。
- 触屏移动端：默认不自动播放；用户 tap 播放按钮后才循环；任意 tap 屏幕暂停。

#### 3.4.4 交互与可访问性

- 手机屏幕 `aria-hidden="true"`；手机下方提供 `<details><summary>Décrire la démo</summary>` 文字版 4 段描述。
- 4 个外层 tab 文案可点击，`aria-controls` 手机演示区；`aria-live="polite"` 仅在用户手动切换时播报「Démo : {帧名}」。
- 播放/暂停按钮：`aria-label="Mettre la démo en pause / Lire la démo"`、`aria-pressed`；键盘可操作。
- 章节点为 4 个按钮（`role="tab"`），`←/→` 切换。
- 鼠标 hover 暂停，离开 400ms 恢复；键盘 focus 进入手机区也暂停。

#### 3.4.5 移动端

- 手机 280×580（屏幕 280×540），居中；外框圆角 24px。
- 屏幕内文字最小 9px；不自动播放；章节点 4 个 32px（次要控制），主播放按钮 48px。
- 4 帧内容全部可由章节点到达。

#### 3.4.6 降级汇总

| 场景 | 表现 |
|---|---|
| reduced-motion | 静态帧 1，手动逐帧；无过渡动画；进度线隐藏 |
| low-bandwidth | 静态合成 SVG；无 DOM 动画 |
| print | 帧 1 静态线框图 + 4 tab 名称与 8 模块清单；标注「Démo visuelle — voir le site pour l'animation」；不打印进度控件 |
| no-JS | 服务端输出帧 1 静态 SVG；章节点为锚点；文字描述可见 |
| 运行中掉帧/页面隐藏 | 暂停并停在当前帧；恢复可见后从停点继续 |

#### 3.4.7 验收要点

1. 自动演示 8s 循环准确（误差 <100ms/帧）；hover 暂停、离开 400ms 恢复。
2. 4 帧内容分别对应短视频/商城/直播/支付，且与 src 能力一一对应。
3. reduced / low-bw / 移动端均不自动播放且信息可读。
4. 屏幕内容不接收点击（无假交互）；外层 4 tab 可控。
5. 打印后手机为静态图，不出现空白屏幕或缺失文字。

---

### 3.5 Mode Pitch — « Visite guidée · 3 minutes »

#### 3.5.1 目标与原则

- 对象：毛里塔尼亚政府/部委（BRIEF §2 第 1 类读者）；目标：**3 分钟内**走完 7 个关键场景并形成闭环。
- 原则：**由用户手势启动**；全程可暂停、可退出、可重播；退出后保留当前滚动位置；全程无声音。
- 7 个场景 / 180 秒（A-07）：24 + 24 + 30 + 32 + 26 + 30 + 14 = 180 秒。

#### 3.5.2 场景脚本

| # | 时间 | 区块 | 叙事（FR 要点） | 自动动作 | Callout 内容 |
|---|---|---|---|---|---|
| 1 | 0:00–0:24 | 00 Hero | « Une plateforme, trois souverainetés : l'attention, la monnaie, les données. » | 滚动到 Hero 顶部；触发 LOAD 时间线（或直接最终态）；H1 高亮 | 主标语 + 3 支柱名称 |
| 2 | 0:24–0:48 | 01 Constat | « Quatre verrous : attention captée ailleurs, cash non audité, données hors du territoire, dépendance aux minerais bruts. » | 滚动到 01；依次高亮 4 张卡（每张 3s） | 4 个问题编号 + 1 行摘要 |
| 3 | 0:48–1:18 | 02 Vue système | « La réponse : trois piliers, six lignes, quatre couches. Un seul système. » | 滚动到 02；节点依次高亮（支柱→业务→层，每类 3s）；最后高亮总线 | 3/6/4 计数 + 「Cliquez un nœud pour ouvrir un dossier」 |
| 4 | 1:18–1:50 | 05 RIMU | « RIMU : le système d'exploitation du quotidien — vidéo, marché, live, paiement. » | 滚动到 05；手机演示播放 8s；随后打开模块抽屉 `#/rimu/live` 停留 8s 并关闭 | 4 个 tab 名称 + « 8 s de démo » |
| 5 | 1:50–2:16 | 06 Calcul | « Le socle : quatre couches, une inférence souveraine, trois phases. » | 滚动到 06；四层依次展开（每层 2s）；三期条带高亮 | « Données, modèles, modération restent sur le territoire » |
| 6 | 2:16–2:46 | 09 Chiffres 2031 | « 2,5 M d'utilisateurs, 2,8 M de comptes, 150–220 M USD de revenus : un scénario ambitieux, chiffré et sourcé. » | 滚动到 09；重播计数器；收入构成图 draw；高亮 «Scénario ambitieux» | 3 个关键数字 + « Méthodologie disponible » |
| 7 | 2:46–3:00 | 08 → End card | « 2026–2031 : le canal s'ouvre maintenant ; les six premiers mois sont décisifs. » | 滚动到 08；选中 RIMU 轨道；高亮 2031 节点；3s 后浮出结束卡 | « Ce que nous demandons : 5 décisions · 6 mois » + CTA |

- 每场景进入前 200ms 显示场景编号与章节名；结束前 400ms 淡出 callout。
- 场景切换：淡出 callout（160ms）→ 平滑滚动（≤900ms）→ 进入动效/高亮；总切换 ≤1.6s，不占用场景时长。
- 场景 4 的抽屉打开与关闭由 Tour 控制器完成；用户此时按 Esc：退出 Tour，抽屉保留（用户可自行关闭）。
- 结束卡：居中 560×≥360，深底 + 金线；logo、`Merci`、3 个数字摘要、5 项决策一句话、3 个 CTA（Demander une réunion / Explorer librement / Rejouer la visite）、可选二维码。`Esc` 或「Explorer librement」退出。

#### 3.5.3 控制条 UI

- 位置：桌面底部居中，宽 720px，高 72px，固定（z 300），背景 `--navy-900` 95% + 1px 金边；距底 24px。
- 内容：左播放/暂停（44px）；中 7 段进度（按时长比例 24/24/30/32/26/30/14）+ 当前时间 + 章节名；右上一场景 / 下一场景 / 退出（44px ×3）。
- 进度段：当前段金色填充；已完成 60%；未开始 20%；段间 2px 间隙；顶部 2px 金色总进度线替代阅读进度。
- 键盘焦点默认播放/暂停；`Tab` 在控制条内循环；页面其余部分 `inert`。
- 无障碍：`role="toolbar"`、`aria-label="Visite guidée"`；`aria-live="polite"` 播报「Scène 3 sur 7 — Le système」；时间不加 live。

#### 3.5.4 状态机

```
closed ─启动(CTA / ?tour=1 / #/tour/N)─▶ start-card
start-card ─Commencer─▶ playing(scene 1)
start-card ─Explorer librement / Esc─▶ closed
playing ─Space / 播放按钮─▶ paused
paused ─Space / 播放按钮─▶ playing（从暂停点继续）
playing ─←/→ / 上一/下一─▶ playing(新场景，从 0 开始)
playing ─Esc / 退出─▶ exiting（关闭自动打开的抽屉、清高亮、恢复滚动）─▶ closed
playing ─场景结束─▶ 下一场景（7 后结束卡）
playing ─用户滚动/触摸页面─▶ paused + 提示「Reprendre la main ?」（3s 后消失）
结束卡 ─Rejouer─▶ playing(scene 1) ／ ─Explorer / Esc─▶ closed
```

- 「Reprendre la main」提示：小条「Vous avez repris la main — Continuer la visite / Quitter」；点击「Continuer」从当前场景起点恢复；3 秒无操作消失并保持 paused。
- Tour 期间禁止：用户打开抽屉（Tour 自动动作除外）、切换语言、打印；低带宽模式提示「引导模式需要完整版」。
- 退出恢复：记录启动前 `scrollY` 与抽屉状态；退出时关闭自动打开的抽屉、清除高亮；不强行回跳（以用户最后滚动位置为准）。

#### 3.5.5 URL 与深链

| 状态 | URL | history |
|---|---|---|
| 启动（点 CTA） | push `#/tour/1` | push |
| 冷启动 `?tour=1` | 展示 start-card；不自动开始 | replace 为 `#/tour/1` |
| 场景推进 | replace `#/tour/{n}` | replace |
| 刷新在 `#/tour/3` | 展示 start-card 并标注「Reprendre à la scène 3」 | 不自动播放 |
| 结束卡 | replace `#/tour/7` | replace |
| 退出 | replace `#/s/{当前区块}` 或 `#/` | replace（避免返回键重入 Tour） |
| 分享 `?tour=1` | 客户端读到参数展示 start-card | — |

#### 3.5.6 移动端

- 控制条：底部固定，高 88px（含 safe-area），两行：进度 + 时间；播放/暂停 + 上/下 + 退出（44px，间距 8px）。
- Callout：改为底部信息卡（控制条上方 12px），最大宽 100%−32px，最多 3 行；无连接线；滚动目标预留 `scroll-margin-bottom: 200px`。
- 场景 4 的 8s 手机演示：Tour 中允许播放一次（用户已通过「Commencer」手势授权）；reduced / low-bw 则静态。
- 场景 3 的节点依次高亮在移动端改为「竖排系统图逐段高亮」。
- 手势：上滑/下滑 = 暂停并出现「Reprendre la main」提示；点击控制条 = 暂停/继续。

#### 3.5.7 降级

| 场景 | 表现 |
|---|---|
| reduced-motion | 滚动瞬时定位；callout 淡入 120ms；无高亮脉冲；手机/图表直接呈现；总时长不变 |
| low-bandwidth | 不自动播放 Tour（显示说明卡 + 「Lire le parcours en 7 étapes」文字版）；不加载粒子 |
| 打印 | 不打印 Tour；二维码若出现在结束卡也不参与打印 |
| no-JS | 无 Tour 入口；提供「Parcours de lecture」章节编号（00–13）作为静态替代 |
| 页面隐藏 | 自动暂停；恢复可见显示「Reprendre」 |

#### 3.5.8 验收要点

1. 7 场景总时长 180s ±2s；每场景可单独跳转。
2. 暂停后继续从暂停点恢复；退出后页面可继续浏览（无 inert、无遮罩残留）。
3. 键盘：Space 暂停/继续、←/→ 切换、Esc 退出；焦点限制在控制条；读屏能听到场景名。
4. `?tour=1` 打开后显示 start-card；刷新 `#/tour/3` 显示「从第 3 场景继续」。
5. reduced / low-bw / 移动端三种情况均不会自动播放未经手势的动画。

---

### 3.6 三轨时间轴实现参数（区块 08 补充）

- 画布：桌面 `width=1200, height=300` 的 SVG 坐标；左 160px 为轨道名区，右侧 1040px 为时间区；年份刻度 2026–2031 均匀分布（6 个刻度），x = 160 + (year−2026)/5 × 1040。
- 轨道基线 y：Plateforme = 80；RIMU = 160；Calcul = 240；轨道名在 `x=0` 左对齐，14px Didot。
- 里程碑：
  - Plateforme 三步：x 分别在 2026.75 / 2027.25 / 2027.75 位置，同 y ± 16px 交错以避免标签重叠；用「并列」括号把后两步包在一起（`en parallèle` 标签 10px）。
  - RIMU 五年：x = 2027…2031 对应位置；节点下显示 MAU 紧凑值（`250 k`、`700 k`、`1,2 M`、`1,8 M`、`2,5 M`，src:L54–58）。
  - Calcul 三期：不按日历年，按相对时长条：Phase 1 条 18 个月宽、Phase 2 条 36 个月宽（从 Phase 1 末端开始）、Phase 3 开放末端（虚线延伸 + 箭头）。条带 y=240，高 8px；Phase 标签在条上。
- 交互：轨道切换时仅显示当前轨道（其他轨道 `opacity:0; pointer-events:none`，不改变布局高度）；里程碑详情面板高度 220px，内容替换不重排页面（固定高度避免 CLS）。
- 数据一致性契约（与 T1/T3）：`data.kpis.series.mau` 同时驱动 08 里程碑与 09 曲线；任何一处修改必须同时更新两处渲染；构建期加断言（JSON 值唯一来源）。
- reduced/low/print 见 §2.8 与 §1.8。

---

### 3.7 西非地图流向（区块 10）

#### 3.7.1 画布与几何

- 设计画布 640×520（SVG viewBox `0 0 640 520`）；简化线稿地图（西非区域轮廓 + 5 国边界虚线 + 海岸线），**明确标注** `Schéma indicatif — non à l'échelle`（10px，右下角）。
- 起点 Nouakchott 标记：金色圆点 6px + 双环 16px + 标签 `Nouakchott`（12px uppercase）；位于 (250, 180)。
- 5 条流向弧线（从 Nouakchott 出发，二次贝塞尔，控制点上抬 40–80px）：
  - Sénégal → (215, 265)
  - Gambie → (200, 300)
  - Mali → (420, 240)
  - Guinée → (305, 400)
  - Côte d'Ivoire → (520, 395)
- 所有坐标均为示意，不用于地理测量；国家标签沿弧线末端放置，避免重叠（Gambie/Sénégal 上下错开 20px）。
- 数据标签：全局一条 `800 M – 2 Md USD de biens transitant par la Mauritanie / an`（src:L90，**Source**）显示在地图左下；单国流量源文件未给 → 单国 tooltip 只写「Destination des flux de biens — volume non chiffré par pays」（Hypothèse/未定），**禁止编造单国数字**。

#### 3.7.2 交互

| 触发 | 行为 |
|---|---|
| hover/focus 国家弧线/标签 | 该弧线 2.5px + 粒子加速；其余弧线 opacity .3；信息栏显示国家名、方向（`Exportation / distribution`）、1 行说明、数据标签、「Voir la fiche」 |
| 点击国家 | 信息栏「Voir la fiche」→ 打开相关业务抽屉（Sénégal/Gambie/Mali/Guinée/CI → `#/business/biens-conso`；可配置） |
| 点击空白 | 恢复默认信息（`Nouakchott, point d'arrêt régulier des acheteurs ouest-africains`，src:L93） |
| 键盘 | 国家为 5 个可聚焦按钮（DOM 覆盖层，透明）→ Tab 顺序；Enter 打开；`Esc` 收起信息 |
| 列表替代 | 地图右侧或下方：5 行列表（国家 / 方向 / 说明 / 查看），默认折叠在 `<details>` 中；移动端默认展开 |

#### 3.7.3 动效

- 进入：地图轮廓 `opacity 0→0.18`（600ms）；国界虚线 draw 400ms（stagger 60）；5 条弧线 draw 900ms（stagger 120，起始 300ms）；国家标签 fade 400ms（起始 700ms）。
- 粒子：每条弧线 2 个（共 10），速度 36px/s，颜色 `--flow-marchandises`（象牙金）；AUTO 循环；页面隐藏/不可见暂停；reduced 不创建。
- hover 弧线：线宽 1.5→2.5px，240ms；粒子 1.5×。
- reduced：全部静态；hover 仅颜色/透明度。
- 低带宽：不加载粒子；静态地图。
- 打印：单色线稿（金线 + 墨色标签），无粒子；标注 `Schéma indicatif`；地图与收益卡同页或次页。

#### 3.7.4 移动端（390）

- 默认「流向列表」：5 行（国家 + 箭头 + 1 行说明），每行 56px；tap 展开信息与「Voir la fiche」。
- 「Voir la carte」切换：静态 SVG 350×260，无粒子；tap 国家高亮 + 底部信息条（不遮挡地图）。
- 地图面板高度 360px；列表模式高度自适应。
- 无横滑；地图不缩放（示意足够）。

#### 3.7.5 验收要点

1. 5 国流向与 src:L66 名单一致（Sénégal / Mali / Guinée / Côte d'Ivoire / Gambie）。
2. 全局流量数字 800 M–2 Md USD（src:L90）带 Source/年份，单国不出现编造数字。
3. hover/键盘都能更新信息栏；移动端列表可完成同样信息获取。
4. reduced / low-bw / print 下地图均无粒子且标签清晰。
5. 地图明确标注「示意、非比例」。

---

### 3.8 KPI 计数器与 FR/ZH 数字格式

#### 3.8.1 数字格式规则（必须逐条测试）

| 规则 | FR | ZH |
|---|---|---|
| 小数分隔 | 逗号 `,`（`2,5`） | 小数点 `.`（`2.5`） |
| 千位分隔 | 窄不换行空格 U+202F（`800 000`）；若不支持则 U+00A0 | 中文习惯：`800000` 或「80 万」；≥1 万用万/亿 |
| 大数缩写 | `k` / `M` / `Md`：`250 k`、`2,5 M`、`1,2 Md`（金额） | 万 / 亿：`25 万`、`250 万`、`1.2 亿`（数字与万/亿之间保留 1 个半角空格，示例见 BRIEF §5） |
| 区间 | 短横线（en dash）无空格：`150–220 M USD` | `1.5–2.2 亿美元` |
| 百分比 | 数字与 `%` 之间为不换行空格：`1,3–1,9 %` | `1.3–1.9%`（中文紧随，无空格） |
| 单位 | 数字与单位不换行：`40 min`、`2,8 M comptes` | `40 分钟`、`280 万账户` |
| 年份 | `2031` 不缩写；不写 `31` | 同 |
| 货币 | `USD` 大写、在数字后；`150–220 M USD` | `1.5–2.2 亿美元`（不写 USD） |
| 不换行保护 | 所有「数字+单位」组包在 `white-space:nowrap` 的 `span` 内；使用 `&nbsp;`/`\u00A0` 连接 | 同 |

**测试用例（前端必须有一个快照测试文件覆盖）**

| 输入 | FR 显示（hero 紧凑） | FR 显示（正文完整） | ZH 显示（紧凑） |
|---|---|---|---|
| 2500000 | `2,5 M` | `2 500 000` | `250 万` |
| 800000 | `800 000` | `800 000` | `80 万` |
| 40 | `40 min` | `40 minutes` | `40 分钟` |
| 2800000 | `2,8 M` | `2 800 000` | `280 万` |
| 150000000–220000000 | `150–220 M USD` | `150–220 millions USD` | `1.5–2.2 亿美元` |
| 1.3–1.9 % | `1,3–1,9 %` | `1,3–1,9 % du PIB` | `GDP 的 1.3–1.9%` |
| 30000–40000 | `30–40 k` | `30 000–40 000` | `3–4 万` |
| 250000（2027 MAU） | `250 k` | `250 000` | `25 万` |

#### 3.8.2 实现约定

- 使用 `Intl.NumberFormat(locale, { maximumFractionDigits, minimumFractionDigits })` 生成基础数值，再做「紧凑化」映射（M/k/万/亿）；**禁止手写 `toLocaleString` 结果字符串再做 split/join 替换**（会破坏不换行空格）。
- 数值来源：`data-model.json` 的 `displayFR` / `displayZH` 字段优先（T1 已按规则生成）；前端只做兜底格式化，两者必须一致（构建期断言）。
- 切换语言：取消进行中的动画，直接写目标 locale 的最终值（不重播滚动），避免中途重排。
- 大数字滚动：见 3.8.3。

#### 3.8.3 滚动动画

- 触发：仅 LOAD（Hero，延迟 1200ms）与 ENTER（09 仪表盘，进入 ≥40% 视口）；每会话一次（A-08）；09 的「Rejouer」可手动重播。
- 时长 1400ms；缓动 `--ease-out`（先快后慢）；从 0（或从 60% 起始值）到目标值；小数位按目标值精度固定（如 `2,5 M` 保持 1 位小数）。
- 防抖动：
  - 每个字符位包 `<span class="digit" aria-hidden="true">`，CSS `display:inline-block; width:0.62ch; text-align:center`（等宽特性优先 `font-variant-numeric: tabular-nums`）；千位分隔符用固定宽度的 `<span class="sep">`（不可换行）。
  - 数字容器固定 `min-width` 或按目标文本测量后预留宽度，避免布局位移（CLS=0）。
- 可访问性：动画层 `aria-hidden="true"`；旁边提供 `sr-only` 最终文本「2,5 millions d'utilisateurs actifs mensuels en 2031 — source : dossier RIMU」；动画完成后不重复播报。
- reduced-motion：直接显示最终值（无滚动），无 Rejouer。
- 低带宽：直接最终值。
- 打印：最终值（`beforeprint` 强制写入最终文本）。

#### 3.8.4 验收要点

1. 上述 8 个测试用例在 FR/ZH 下与截图逐字符一致（含不换行空格）。
2. 滚动时数字宽度不抖动、容器不位移（CLS 0）。
3. 读屏读到最终值+口径，不读到中间值。
4. 语言切换后无动画重播、无「半程数字」残留。
5. reduced / print / low-bw 三种情况均为最终值。

---

### 3.9 收入构成图（区块 09）

#### 3.9.1 数据与口径

| 分项 | 范围（M USD/an，2031） | 来源 | 类型 |
|---|---|---|---|
| Vidéos courtes RIMU | 30–50 | src:L79 | Source |
| Paiement RIMP | 90–140 | src:L80 | Source |
| Centre de calcul IA | 30–40 | src:L81 | Source |
| **Total des trois** | **150–220** | src:L82 | Source |
| 备注 | 分部上限之和为 230，与 220 不一致 | — | **QA-06** |

- 图表展示：3 条范围条（min–max）+ 1 条总计范围条；右侧数值标签；x 轴 0–240 M USD，刻度 0/50/100/150/200/240。
- 总计条与分部条之间用 1px 金色虚线分隔；总计条标注 `Total affiché : 150–220`；在图注写明「Les bornes hautes des composantes (230) dépassent le total retenu (220) — voir méthodologie」，方法学抽屉展开 QA-06 说明。**不改数字**。
- 数据标签：图中每项都标 `Source`；图注给出来源行号（网页可见为「Dossier RIMU — section IV」）。

#### 3.9.2 几何与布局

- 桌面：520×300；左标签列 160px（分项名 + 类型点），右绘图区 360px；行高 52px，条高 18px（圆角 0）；总计行与上面距 16px + 虚线。
- 数值标签：条右侧 8px，13px 等宽数字；范围条两端画 1px 垂直端帽（tick）表明 min/max；中点位置画 8px 菱形（`--gold`）表示区间中值（Dérivé，图注说明「repère central = milieu de fourchette」）。
- 移动：纵向列表；每行：名称 + 范围条 240px + 数值；总计行独立，虚线分隔；无 x 轴（保留 0/最大 刻度参考线）。

#### 3.9.3 动效与交互

- 进入：每条 scaleX 0→1（origin left，900ms，stagger 120ms，起始 300ms）；端帽/菱形 fade 200ms（延迟 = 条完成 + 100ms）；数值标签 fade 200ms。
- hover/focus 条：该条提亮（+6%）、其余 opacity .55；tooltip：分项名、范围、中值、来源/类型、1 行说明。
- 点击条：打开方法学抽屉并定位到该分项（替换抽屉内容，带返回）。
- reduced：直接呈现；无 draw。
- low-bw / print：静态呈现；打印整数格式（FR 完整格式，如「30–50 millions USD」）。

#### 3.9.4 验收要点

1. 3 条分项 + 1 条总计齐全；数值与 src:L79–82 一致；QA-06 在图注与方法学中可见。
2. 范围条两端与数值标签对齐（端帽位置误差 ≤1px）。
3. hover/键盘均可读 tooltip；点击进入方法学对应条目。
4. 移动端纵向布局不溢出、数值不换行。
5. 打印页图表为静态、灰阶下仍可读（用明度/纹理区分，不仅靠颜色）。


---

### 3.10 打印模式（A4 横向提案册）

> 目标：同一套 DOM 直接打印成 **A4 横向（297×210mm）** 提案册（BRIEF §2 第 3 类读者 / §5 打印模式），沿用 `presentation/index.html` 的品牌语言（深海军蓝 #071C36 / #0B1F3A、香槟金 #C9A25E、象牙白 #F6F0E4、Didot / Avenir Next；版式细则见 visual-system §11）。

#### 3.10.1 两种打印范围

| 入口 | `data-print-scope` | 输出 |
|---|---|---|
| 顶部导航 / 区块 11 / 区块 13 的「Imprimer / Télécharger (PDF)」 | `all` | 完整提案册（约 28–30 页，含附录：6 张业务 fiche + 方法学） |
| 抽屉 footer 的「Imprimer cette fiche」 | `fiche` | 仅当前抽屉对应的 1 页 fiche（附页眉：titre du dossier + QR 回链） |

实现：点击时先设置 `document.documentElement.dataset.printScope`，再调用 `window.print()`；`afterprint` 恢复原值并清理。

#### 3.10.2 打印前预处理（`beforeprint` / 点击时同步执行）

1. 记录当前状态快照：抽屉是否打开、所有 `<details>` 的 open 状态、Tour 是否运行、当前 tab、语言、当前 filter。
2. 停止所有动画与粒子：`data-print="1"`；移除 canvas；清除 GSAP tweens；取消 rAF。
3. 计数器、进度、图表写入**最终值/最终状态**（不依赖动画）。
4. 展开所有手风琴（11 / 12 / L3）与所有 `<details>`；显示全部 tab 内容？**不**：附录 fiche 由构建期静态生成（A-09），DOM 中已包含隐藏的 `.print-only` 章节，打印时显示、屏幕隐藏；业务六页不依赖交互状态。
5. 关闭抽屉与 Tour（`all` 模式）；`fiche` 模式只显示对应 fiche 的 `.print-only` 页。
6. 若语言为 ZH：打印中文版（页眉/页脚/字体使用 ZH 字体栈；数字格式按 ZH）；不混排。
7. `afterprint`：恢复快照（重开抽屉、重开原来的 details、恢复 Tour？**不恢复 Tour**，Tour 退出后不自动重入；其他状态恢复）。

#### 3.10.3 页面版式基础（与 presentation/index.html 对齐）

- `@page { size: 297mm 210mm; margin: 0; }`；每个 `.page` 固定 297×210mm，`overflow:hidden`，`page-break-after:always`。
- 页边距 18mm；底部 10mm 放 folio；顶部 13.5mm 放 kicker 与 brandline（与品牌册一致）。
- 字体尺寸直接采用品牌册的 pt 体系（打印专用，不沿用屏幕 px）：

| 角色 | 打印规格（参照 presentation/index.html） |
|---|---|
| H1（封面/章节） | Didot 46pt / 1.0 |
| H2 | Didot 27pt / 1.06 |
| H3 | Didot 15pt / 1.15 |
| Lead（斜体） | Minion Pro Italic 10pt / 1.45（回退 Cormorant Garamond Italic） |
| Body | Avenir Next 7.6pt / 1.55 |
| Small | 6.2pt / 1.5 |
| Label/kicker | Avenir Next 600 5.6pt，字距 .22em，大写 |
| Micro/来源 | 5.4pt（≥ 4pt 底线） |
| 线 | 金色线 0.25pt；表格分隔线 0.2pt |

- 颜色：`print-color-adjust: exact`；金色在浅底用 `#9C7A38`，深底用 `#C9A25E`；深底文字 `#F6F0E4`；浅底正文 `#33415A`、标题 `#0B1F3A`。绿色在打印中降为 `#00794D`（仅正向数据），面积 ≤ 5%。
- 墨量控制：深色满版页仅限 **封面 + 附录分隔页**（2 页）；其余页面浅底（`#F6F0E4` / `#FBF6EC`）。深色区块（02/05/06/07/09/13）打印为「浅底 + 深蓝标题 + 金色线 + 关键数字深蓝」的编辑式版本，避免整页满版深蓝耗墨与套印问题（与品牌册封面策略一致）。
- 阴影、模糊、半透明叠加全部移除；图形用实线/虚线 + 明度区分。

#### 3.10.4 页序与分页表（`all` 模式）

| 页 | 内容 | 版式要点 | 交互替代 |
|---|---|---|---|
| 1 | 封面：Hero | 深蓝满版 + 静态金色弧线 + 主标语 + 3 支柱 + 4 KPI + QR + 年份 | 粒子→静态弧线；CTA→QR |
| 2 | 01 Constat | 4 卡 2×2 + 转折条（浅底金字） | hover 箭头→静态 |
| 3 | 02 Vue système（图） | 总图缩放至安全区 261×174mm | hover→无；节点名保留 |
| 4 | 02 说明 | 3/6/4 结构文字 + 图例 + 「lire le schéma」 | tooltip→脚注编号 |
| 5 | 03 三支柱 | 3 卡一排 89mm 宽 | 抽屉→「fiche» 附录页码 |
| 6–7 | 04 六业务线 | 每页 3 张，横向排；指标 + 状态 | 抽屉→附录页码 |
| 8–9 | 05 RIMU | 手机静态帧 + 4 tab + 8 模块清单；第 9 页主权与保护 | 演示→静态帧 |
| 10–11 | 06 Contenu IA & Calcul | 四层图 + AI 用例 3 组 + 三期步骤；第 11 页主权条带 | 展开→全展开 |
| 12–13 | 07 Relations | 第 12 页静态网络图（双色线型）；第 13 页五类流说明表 | 粒子→无；tooltip→表 |
| 14 | 08 Feuille de route | 三条轨道全部展开 + 里程碑文字 | 切轨→三条并列 |
| 15–16 | 09 Chiffres 2031 | 6 KPI + 收入构成图；第 16 页 MAU 曲线 + 就业条带 + 方法学注 | 计数器→最终值 |
| 17–18 | 10 Bénéfices | 三期限卡 + 西非地图；第 18 页转型对比 | 粒子→静态；切换→两列并列 |
| 19 | 11 Demande | 5 项决策全部展开，2 列 | 手风琴→全展开 |
| 20 | 12 Risques | 5 项全展开，2 列 + 矩阵小图 | 手风琴→全展开 |
| 21 | 13 Next steps | 30/90 天 + 联系 + QR | CTA→文字+邮箱 |
| 22 | 附录分隔页（深底） | `Annexes — Dossiers détaillés` + 目录 | — |
| 23–28 | 附录 A–F：6 张业务 fiche | 每页一个业务：6 tab 压缩为 6 条带（Aperçu / Fonctionnement / Chiffres / Acteurs / Roadmap / Risques），每条约 3–5 行 | 抽屉→整页 fiche |
| 29 | 附录 G：Méthodologie & sources | 公式、Source/Dérivé/Hypothèse 表、QA 说明（QA-01…QA-06 可见） | 方法学抽屉→整页 |
| 30 | 封底 | 深底 + logo + 联系方式 + QR + « Construire la souveraineté numérique » | — |

- 页数合计 30 页；若内容压缩目标为 24–26 页：合并 3+4、12+13、15+16 为 3 页（每页 2 栏）；但业务 fiche 6 页不可省（客户提案需要）。
- 分页规则：`h2 { break-after: avoid; }`；卡片 `break-inside: avoid`；表格 `thead` 每页重复；避免孤行（`widows:2; orphans:2`）；图片/图与图注不跨页。

#### 3.10.5 打印专用元素

| 元素 | 规格 |
|---|---|
| 页眉 kicker | 左上 18mm/13.5mm：`{NN} · {SECTION}`，5.6pt 大写金色 |
| 页眉 brandline | 右上：`AUREON DIGITAL — PLATEFORME SINO-MAURITANIENNE`，5.4pt 灰色 |
| 页脚 folio | 右下：`{page} / 30`，5.6pt |
| 页脚左 | `{document title} · Novembre 2026`，5.4pt 大写 |
| 来源脚注 | 每页底部 5.4pt：`Source : dossier RIMU, section IV — projections 2031 (scénario ambitieux).` 目标页码/章节而非内部行号 |
| QR | 封面右下 + 封底；白底、静区 ≥4 模块、最小 22×22mm；目标 URL：`https://aureondigital.mr/…?from=print`（域名待定，A-19） |
| 附录 fiche 页眉 | 右上 `FICHE {A–F}` + 业务名小字；页脚给回网站深链短码（如 `aureondigital.mr/#/business/rimu`，5.4pt） |

#### 3.10.6 打印降级与无 JS

- JS 可用（默认）：`beforeprint` 完成全部展开与静态化。
- JS 不可用：CSS 兜底：
  ```css
  @media print {
    details > *:not(summary) { display: block !important; }
    .js-only, canvas, video, .drawer, .tour-bar, .toast { display: none !important; }
    .print-only { display: block !important; }
    .counter__sr { position: static; }
  }
  ```
  注意：`details` 内容强制显示在部分浏览器需实测；T3 需在验收时覆盖「禁用 JS 打印」场景，必要时用构建期 `<details open>` 的打印副本替代。
- reduced-motion：打印本身无动画，无需额外处理。
- 低带宽：打印不依赖网络（字体已加载；若未加载则回退系统字体，版式仍成立，见 visual-system §4.2）。

#### 3.10.7 打印验收清单

1. Chrome / Safari 下 A4 横向导出为 30 页（或压缩版 24–26 页），无内容裁切、无空白页。
2. 深色仅 2 页满版；其他页无大面积深色（墨量可控）。
3. 所有图表/地图/手机/网络图在打印中为静态且信息完整（无 tooltip 依赖）。
4. 数字为最终值（无「—」或动画中间值）；FR/ZH 按当前语言，不混排。
5. 页眉/页脚/页码连续；二维码可扫；业务 fiche 页与屏幕抽屉内容一致。
6. 禁用 JS 时仍能打印主要内容（至少文字与静态图）。
7. PDF 文件大小目标 ≤ 8MB（字体子集 + SVG）；文件名建议 `AUREON_Plateforme_Sino-Mauritanienne_FR_2026.pdf`。

---

### 3.11 低带宽模式（Mode économie de données）

#### 3.11.1 判定与开关

| 来源 | 规则 |
|---|---|
| 自动 | `navigator.connection.saveData === true` → 开启；`effectiveType` 为 `slow-2g` / `2g` → 开启；`3g` 不自动开启（BRIEF 首屏 3G 目标） |
| 手动 | 页脚 / 13 区块开关「Mode économie de données」（aria-pressed）；localStorage `aureon.bw=low` |
| URL | `?bw=low` / `?bw=full` 优先（演示模式） |
| 提示 | 首次自动开启时显示底部条（3s 后可关闭）：「Mode économie de données activé — Afficher l'expérience complète」 |

#### 3.11.2 行为矩阵

| 能力 | normal | low-bandwidth |
|---|---|---|
| Hero 粒子/连线 | Canvas | 静态 SVG（内联，≤ 8KB） |
| 平滑滚动（Lenis） | 启用 | 关闭（原生滚动） |
| 关系图粒子 | 30 个 | 0（静态虚线 + 箭头） |
| 地图粒子 | 10 个 | 0 |
| 手机演示 | 8s 自动循环 | 静态合成图（4 帧拼贴 SVG） |
| Mode Pitch | 完整 | 不自动播放；显示 7 段文字版「Parcours de lecture」 |
| 计数器 | 滚动 1400ms | 直接最终值 |
| 图表 | 动画 draw | 静态 SVG/预渲染 |
| 字体 | FR 子集 + ZH 子集 | 只加载当前语言子集；CJK 用系统字体回退（避免下载） |
| 图片 | 无第三方照片；插画 SVG | 同（不变） |
| 预加载/prefetch | 下屏关键资源 | 关闭 |
| 分析脚本 | 可选 | 不加载 |
| 视频/音频 | 无 | 无 |
| 过渡动画 | 标准 | 120ms 以内或瞬时 |

- 实现：`html[data-bw="low"]` 属性 + JS 门控（增强模块 dynamic import）；CSS 用属性选择器隐藏 canvas 容器、显示静态层。切换不需要刷新页面；从 low → normal 时按需加载增强模块（不重复加载）。
- 性能预算（low）：首屏 HTML+CSS ≤ 80KB gzip、JS ≤ 40KB、字体 ≤ 120KB（当前语言）、总首包 ≤ 250KB（不含 OG 图）。
- 无障碍：切换按钮 44px、`aria-pressed`、状态即时播报（`aria-live="polite"`）。
- 埋点：`bw_toggle`（value: low/full），仅统计，不采集网络细节。

#### 3.11.3 验收要点

1. 模拟 `saveData` / 2G 时自动进入 low，且不下载 Canvas 粒子脚本。
2. low 模式下无任何 >120ms 的动画；手机/关系图/地图/图表均为静态且信息完整。
3. low → full 切换后增强能力恢复，无需刷新。
4. 刷新后 localStorage 记住选择；URL 参数优先。
5. 低带宽下首包体积达标（Lighthouse 3G 模拟 LCP <3s）。

---

## 4. 验收、QA 与假设

### 4.1 14 区块覆盖核对表

| # | 区块 | 布局 | 内容层级 | 进入/滚动动效 | 状态（hover/active/open） | 深链 | 移动 390 | 三态降级 | 数据/空态 | 验收要点 | 章节 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 00 | Hero | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.0 |
| 01 | Constat | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.1 |
| 02 | Vue système | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.2 / §3.1 |
| 03 | 三支柱 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.3 |
| 04 | 六业务线 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.4 |
| 05 | RIMU | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.5 / §3.4 |
| 06 | Contenu IA & Calcul | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.6 |
| 07 | Relations | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.7 / §3.3 |
| 08 | Feuille de route | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.8 / §3.6 |
| 09 | Chiffres 2031 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.9 / §3.8 / §3.9 |
| 10 | Bénéfices | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.10 / §3.7 |
| 11 | Demande à l'État | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.11 |
| 12 | Risques | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.12 |
| 13 | Next steps | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | §2.13 |

全局交互（§1）：路由 L1/L2/L3、抽屉 6 tab（§3.2）、键盘、降级矩阵、打印（§3.10）、低带宽（§3.11）、性能预算。

### 4.2 全局验收清单（可交给 QA 逐条执行）

1. 14 个区块在 1440×900、1280×800、768×1024、390×844 四个尺寸下均无横向滚动、无文字裁切。
2. 所有抽屉入口（02/04/05/06/07/Tour）均可打开、关闭、深链、后退关闭；焦点归还正确。
3. 抽屉 6 tab 全部存在且可键盘切换；tab 状态写 URL；刷新后保持。
4. 关系图五类流可筛选、isolate、hover、点击；列表替代完整。
5. Tour 7 场景可暂停/继续/退出/重播；退出后页面无残留遮罩、无 inert。
6. 手机演示 8s 循环、hover 暂停、4 章节点可用；移动端不自动播放。
7. 所有计数器仅在进入视口播放一次；`Rejouer` 可用；FR/ZH 格式逐字符正确。
8. 每个数字都有 Source / Dérivé / Hypothèse 标签与来源入口；§4.3 的 QA 清单（含与 T1 `qa[]` 的编号映射）在方法学或对应位置可见。
9. `prefers-reduced-motion: reduce` 下无位移、无滚动数字、无粒子、无自动循环；所有信息仍可达。
10. `data-bw="low"` 下无 Canvas、无粒子、无自动演示；首包体积达标。
11. 打印（Chrome/Safari）A4 横向 30 页（或 24–26 页压缩版）无空白页、无裁切；深色仅 2 页；二维码可扫。
12. 键盘：全站不使用鼠标可完成浏览、开抽屉、切 tab、开合 L3、切换轨道、筛选关系图、启动 Tour、打印。
13. 屏幕阅读器：标题层级正确（每区块一个 H2）；抽屉 role/aria 正确；图表有文本等价物；装饰元素 aria-hidden。
14. 对比度：正文 ≥4.5:1，大标题 ≥3:1，金色小字在浅底用 `--gold-deep`（≥4.5:1）；焦点环清晰可见。
15. 语言切换 FR↔ZH：文案、数字格式、字体栈同时切换；无布局溢出；URL 不丢失。
16. 所有移动端命中区 ≥44×44px；抽屉下滑关闭可用；无粘滞 hover。
17. 所有动效 ≤ 预算（§1.10）；关闭动画中无点击穿透；快速连点不产生多个抽屉。
18. 数据缺失时显示空态而非破图/空白；JSON 失败时静态内容仍完整。
19. OG/分享：每类抽屉有静态 OG 变体；`<title>` 随抽屉更新；分享链接可直达。
20. 埋点失败不影响页面；无 cookie 弹窗（不采集个人信息）。

### 4.3 数据与事实矛盾（QA 清单）

> 原则：**只记录，不悄悄改数**。网页展示层使用 BRIEF §7.3 建议口径或加注，最终由 Lead/客户确认。以下编号被正文引用（体验层编号 QA-01…QA-11）；T1 `data-model.json → qa[]` 使用 QA-1…QA-7，映射见本节末表，**Lead 合并时统一为 T1 编号**。

| # | 问题 | 涉及数据 | 来源 | 严重度 | 建议处理（网页展示） |
|---|---|---|---|---|---|
| QA-01 | 「年支付流量数百亿美元」与 RIMP 年收入 90–140 M USD 不自洽（隐含费率 <0.05%，远低于 0.5–0.7%） | 支付流量 / RIMP 收入 | src:L74、src:L80；BRIEF §7.3-1 | 高 | 关系图 paiements 边不显示流量数字，只显示定性「flux »；如必须显示，用 BRIEF §7.2 建议口径「≈150–250 Md USD/an」并标 **Dérivé + Hypothèse**（方法学写公式） |
| QA-02 | 「2,8 M comptes ≈ 毛里塔尼亚成年人口一半」与人口规模不符（成年人口约 2.9–3.2 M，一半约 1.5–1.6 M） | 2,8 M 钱包 | src:L73；BRIEF §7.3-2 | 高 | KPI 标签改为「2,8 M comptes portefeuille RIMP（2031）」，副注「≈ 全国人口 57 %（Hypothèse）」或按客户确认口径；**不写「一半成年人口」** |
| QA-03 | 三组就业数字口径不同（2–4 k 短期直接/关联；8–15 k 关联中长期；30–40 k 五年直接+生态），并列会互相打脸 | 就业 | src:L88、src:L91、src:L97；BRIEF §7.3-3 | 高 | 每组必须带期限与口径标签；09 / 10 不并列展示；方法学给分层表 |
| QA-04 | 算力「Phase 1 ~1 MW / ~100 卡」与「绿电算力一期 20–50 MW」不一致（量级差 20–50 倍） | 算力功率 | src:L61、src:L91；BRIEF §7.1 | 高 | 主步骤条只显示 1 MW → 2–3 MW → 扩展；「20–50 MW」仅作为 Phase 3/绿电扩展的注解，标 **QA-04 / 待确认**；06 / 10 不并排显示 |
| QA-05 | 源文件称双边「trois étapes menées en parallèle」，BRIEF/时间轴按「启动 → 资源匹配 → 六类并行」顺序呈现 | 双边三步 | src:L45、src:L47–49 | 中 | 08 时间轴用「并列节点组 + en parallèle 标签」；文案不写「第 1 步完成后再第 2 步」 |
| QA-06 | 三块收入 150–220 M USD，但分部上限相加 = 50+140+40 = 230 M | 收入构成 | src:L79–82；BRIEF §7.1 | 高 | 图表显示分部范围 + 总计 150–220，图注说明「bornes hautes (230) ≠ total retenu (220)」；方法学 QA-06 展开；不改任何数字 |
| QA-07 | 「1,3–1,9 % du PIB actuel」的 PIB 基年未写明（按反推约 11,5–11,9 Md USD） | PIB 占比 | src:L82 | 中 | KPI 注「% du PIB — base 2025–2026, à confirmer」；方法学列出反推 |
| QA-08 | 「约 60 %+ 的网民」与 MAU 2,5 M 绑定同一年/同一网民口径未定义（反推网民约 4,2 M，渗透率约 85 %） | MAU vs 网民 | src:L58、src:L72；BRIEF §7.3-4 | 中 | 08/09 只写「2,5 M MAU（2031）」；「60 %+ des internautes」放 08 里程碑说明并标 Hypothèse，不与 MAU 并排 |
| QA-09 | 货物价值三组数字范围不同：消费品首年 80–150 M；批发撮合 300–800 M；经毛中转 800 M–2 Md（/an），文案易被误读为同一口径 | 货物价值 | src:L87、src:L90 | 中 | 每处必须带「首年 / 撮合 / 年流转」标签；10 地图只显示 800 M–2 Md（/an）全局口径 |
| QA-10 | RIMU 收入含「e-commerce local」，而 BRIEF §7.2 的 GMV 2–3 亿美元为 Hypothèse，两者不可混用（收入 vs GMV） | RIMU 收入 / GMV | src:L79；BRIEF §7.2 | 低 | 收入图只显示收入；GMV 若出现必须标 Hypothèse 与「GMV ≠ revenu」 |
| QA-11 | BRIEF §5 示例深链写 `#/business/rimu`，但 T1 模型里 RIMU 是支柱（p.rimu）+ 模块集合（rimu.*），不存在 `business/rimu` | 路由 / 产品模型 | BRIEF §5；T1 `meta.routes`（`#/rimu/{id}`） | 中 | 以 T1 路由为准；服务端/前端为 `#/business/rimu` 配置 redirect → `#/rimu`（或 `#/pillar/rimu`）；BRIEF 属早期示意 |

**与 T1 QA 编号映射**

| 本文 | T1 `qa[]` | 主题 |
|---|---|---|
| QA-01 | QA-1 | 支付流量 vs RIMP 收入 |
| QA-02 | QA-2 | 2,8 M 钱包 vs 成年人口 |
| QA-03 | QA-3 | 就业口径分层 |
| QA-04 | QA-5 | 算力两个「一期」功率 |
| QA-05 | —（T1 未列） | 双边三步「并行」表述 |
| QA-06 | QA-6 | 收入分项 230 ≠ 总 220 |
| QA-07 | —（T1 未列） | PIB 基年 |
| QA-08 | QA-4 | 60%+ 网民 vs MAU |
| QA-09 | —（T1 未列） | 货物价值三口径 |
| QA-10 | —（T1 未列；与 QA-7 相邻） | RIMU 收入 vs GMV |
| QA-11 | —（新增） | BRIEF `#/business/rimu` 与模型不一致 |

### 4.4 补充假设（A-11…A-19）

| # | 假设 | 影响 / 待确认 |
|---|---|---|
| A-11 | 抽屉「关联节点聚光」v1 用 ghost 轮廓实现，二期再评估 clip-path 透窗 | 视觉细节略降，功能不受影响 |
| A-12 | 02 系统图不做 pin + scrub 装配动画 | 保障深链、Tour、打印稳定；若客户坚持，T3 需额外评估 |
| A-13 | 04 六卡等宽 3×2，不做宽卡节奏 | 移动重排稳定 |
| A-14 | 06 AI 用例点击为 L3 内联展开，不打开抽屉 | 控制抽屉类型数量 |
| A-15 | 不做服务端 PDF 生成；「下载 PDF」= 打印对话框或构建期静态 PDF | 若需真下载，T3 增加构建期 PDF 产物 |
| A-16 | 网页联系方式默认用公司邮箱/电话；个人微信、中国手机、个人 Gmail（README §3）不默认发布 | 发布前需客户确认；涉及隐私 |
| A-17 | 08 轨道状态不写 URL（可用 `?track=` 分享） | 降低路由复杂度 |
| A-18 | 扩展路由 `#/legal`（mentions légales）、`#/methodo` | 法务文案待 T1/客户提供 |
| A-19 | 域名/URL 待定（README 显示 www.aureondigital.mr）；QR 与 OG 用最终域名 | 上线前替换 |

### 4.5 与 T1 / T3 的接口契约

| 对象 | 契约 |
|---|---|
| T1 content-model / data-model | 业务 id、pillar/module/layer/flow id 按 §1.1 表；每个 14 区块文案键；6 tab 内容键（§3.2）；KPI 的 `displayFR/displayZH`、`type`、`sourceRef`；六业务线 `status`（Hypothèse 映射需 T1 确认）；关系图 nodes/edges。**Lead 合并时以 T1 文件为准，如有冲突以 T1 覆盖本文的 id 表**，并回写本文件 |
| T3 tech-architecture | 动效栈（GSAP + ScrollTrigger / Lenis / IO）；路由实现（hash + history 状态）；抽屉组件；Tour 控制器 API（§3.5）；打印附录构建（A-09）；关系图渲染方式（SVG 手工坐标 + rAF 粒子）；字体子集与 unicode-range；低带宽开关；OG 变体；性能预算（§1.10）；测试清单（§4.2） |
| 设计资产 | 需要输出：西非线稿地图 SVG、手机线框 SVG、四层/系统图 SVG、5 类流图标、8 模块图标、guilloche 纹理 SVG；均须遵循 visual-system §10 图标规则与 §3.4 数据色 |
| 事件命名 | 埋点事件见 §1.11；Tour 控制器与组件 API：`tour.start()/pause()/resume()/exit()/goTo(n)`；抽屉 API：`openDrawer(route)` / `closeDrawer()` / `setTab(tab)` |

### 4.6 与 T1 / T3 的对齐清单（合并前必须统一）

> 本文件 v1.1 已按 T1 `data-model.json` 与 T3 `tech-architecture.md` 校正；以下为合并时仍需 Lead 拍板/确认的点。所有冲突**以 T1 为内容与 id 的单一事实源**，以 T3 为实现事实源。

#### 4.6.1 id 与路由

| 本文旧写法 | canonical（T1 / 最终） | 说明 |
|---|---|---|
| `#/business/projets` | `#/business/projets` | T1 `b.projets` |
| `#/business/biens-conso` | `#/business/biens-conso` | T1 `b.biens-conso` |
| `#/business/formation` | `#/business/formation` | T1 `b.formation` |
| `#/business/sante` | `#/business/sante` | T1 `b.sante` |
| `#/business/finance-rimp` | 不变 | T1 `b.finance-rimp` |
| `#/pillar/plateforme` | `#/pillar/plateforme` | T1 `p.plateforme` |
| `#/pillar/calcul` | `#/pillar/calcul` | T1 `p.calcul` |
| `#/rimu/{id}` | `#/rimu/{id}` | T1 `meta.routes.rimuModule = #/rimu/{id}`；模块 id 见 §1.1 slug 表 |
| `#/s/{旧 slug}` | `#/s/{T1 blockId}` | 见 §1.1 区块锚点行 |
| `#/business/rimu`（BRIEF 示例） | redirect → `#/rimu` | 见 QA-11 |

#### 4.6.2 Hero KPI（区块 00）

| 本文 v1.0 | 本文 v1.1（= T1 `meta.heroKpis`） | 来源 |
|---|---|---|
| MAU / DAU / 40 min / 收入 | `kpi.mau_2031` / `kpi.revenue_total_2031` / `kpi.wallets_2031` / `kpi.jobs_5y` | T1 data-model；DAU 与 40 min 保留在 09 仪表盘（无损） |

#### 4.6.3 抽屉 tab 结构

- 统一 **6 tab**（T1 `pillars[].drawerTabs` 与 BRIEF §5 一致）：`apercu / fonctionnement / chiffres / acteurs / feuille-route / risques`。
- 本文 v1.0 对「支柱 3 tab / 层级 3 tab / 模块 3 tab」的精简方案**已撤回**（A-02 已更新）。
- 空态规则：缺数据的 tab 不隐藏，显示「Information non disponible à ce stade.」（§3.2.9）。

#### 4.6.4 数据键映射（本文示意键 → T1 `data-model.json`）

| 本文引用 | T1 实际字段 |
|---|---|
| `data.kpis.hero[4]` | `meta.heroKpis` → `kpis[]` |
| `data.kpis.dashboard[6]` / `data.kpis.employment` / `data.kpis.series.mau[5]` | `kpis[]`（按 `surfaces`/`component` 过滤；系列在 `kpis[].series`） |
| `data.revenueComposition[3]` | `kpis[]` 收入分项 |
| `data.businessLines[6]` | `businessLines[]`（KPI 通过 `kpiIds` 关联 `kpis[]`） |
| `data.pillars[3]` / `data.system.pillars` | `pillars[]` |
| `data.system.businesses` | `businessLines[]` |
| `data.system.layers` / `data.architecture.layers[4]` | `layers[]` |
| `data.rimu.tabs[4]` | 4 tab 为产品结构（content-model 05）；`data.rimu.modules[8]` = `rimuModules[]` |
| `data.aiUseCases.groups[3]` | `aiUseCases[]` |
| `data.computePhases[3]` | `roadmap.tracks[]` 中 `track.calcul` |
| `data.roadmap.tracks[3]` | `roadmap.tracks[]`（`track.bilateral` / `track.rimu` / `track.calcul`） |
| `data.relations.nodes[] / edges[]` | `relations[]`（`from/to/flow/strength/animation`；无独立 nodes 列表，节点由 pillars/businessLines 派生） |
| `data.map.flows[5]` | `regions[]`（`relationIds` 指向 `relations[]`） |
| `data.benefits.short/medium/long` | `kpis[]` + content-model 10 |
| `data.transformation.pairs[4]` | `transformations[]`（T1 为 5 组，以 T1 为准） |
| `data.asks[5]` | `stateSupports[]` |
| `data.risks[5]` | `risks[]` |
| `data.nextSteps` / `data.contact` / `data.legal` | content-model 13 + 项目配置（T1 未入 JSON） |
| 计数器参数（§3.8） | `meta.animationPresets.countUp`（T1：1200ms / power2.out / stagger 80ms；本文 1400ms 的差异见 T3 动效映射，以 T3 实现为准并回写） |

#### 4.6.5 T3 已采用的对齐点（供 Lead 核对）

- T3 路由：`#/business/finance-rimp/chiffres`、`#/tour/n`、`popstate`、`history.state`（与本文 §1.1 一致）。
- T3 动效：GSAP + ScrollTrigger + 原生 IO；视差仅 Hero ≤80px 且移动端关闭（与 §1.2 一致）。
- T3 打印：图表转静态 SVG + 数据表（与 §3.10 一致）。
- T3 抽屉：全站唯一实例（与 §1.4 一致）。
- 仍需一致的点：本文 §3.8 计数器 1400ms vs T1 `countUp.durationMs=1200`；建议以 T3 最终实现为准并同步 T1/本文（不阻塞设计）。

### 4.7 版本记录

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.0 | 2026-11-09 | 初稿：全局交互框架、14 区块规格、11 个复杂组件深挖、打印/低带宽、QA 与接口契约 |
| v1.1 | 2026-11-09 | 与 T1 data-model / T3 tech-architecture 对齐：业务/支柱/模块 id、`#/rimu` 路由、6 tab 统一、blockIds 锚点、hero KPI、QA 编号映射、新增 §4.6 对齐清单与 QA-11 |

---

> 文件结束。配套视觉规格见 `web/spec/visual-system.md`；数据键与文案以 `web/spec/content-model.md` / `web/spec/data-model.json` 为准；实现选型以 `web/spec/tech-architecture.md` 为准。
