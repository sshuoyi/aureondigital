# 视觉系统与组件库（Visual System & Component Library）

> 项目：AUREON DIGITAL · « Plateforme de coopération numérique sino-mauritanienne · RIMU + Contenu IA + Calcul national »
> 版本：v1.0 · 2026-11-09 · 作者：experience-designer（T2）· 状态：待 Lead 合并进 `web/PLAN_v1.md`
> 硬约束：`web/spec/BRIEF.md` §6 视觉方向（深海军蓝 / 象牙白 / 香槟金 / 信号绿；Didot / Avenir Next；禁止通用 SaaS 紫、玻璃卡片堆叠、emoji、廉价 3D 地球）。
> 品牌参考（只读）：`README.md` §2/§8；`presentation/index.html` 顶部 CSS 品牌变量；`assets/logo-mark.svg`。
> 配套文件：`web/spec/interaction-motion.md`（交互与动效状态机、路由、打印流程、低带宽行为）。本文的 token 名在交互规格中被引用。

## 目录

- 0. 定位、边界与和品牌的关系
- 1. 设计原则（可执行版）
- 2. Token 架构与命名规范
- 3. 色彩系统（原始色板 / 语义 token / 五类流数据色 / 对比度 / 用量配额）
- 4. 字体系统（字体栈 / 子集与加载 / 字号阶梯 / 数字与排版规则）
- 5. 栅格与空间（断点 / 栅格 / 间距 / 垂直节奏 / 行宽）
- 6. 线、圆角、阴影、材质、层级
- 7. 动效语言（token / 编排原则 / reduced-motion）
- 8. 组件库规格（20 类组件）
- 9. 暗 / 亮节奏编排（14 区块）
- 10. 图标与插画风格（含地图、手机、架构图、guilloche）
- 11. 打印 A4 横向版式规则
- 12. 可访问性与验收
- 13. 交付物与实施顺序
- 14. 决策记录、假设与版本

---

## 0. 定位、边界与和品牌的关系

### 0.1 本设计系统要解决的问题

1. 让「国家级数字基础设施 + 中毛合作入口」在屏幕上成立：**像一份国家文件一样可信，又有实时数据的科技感**——不是创业公司官网。
2. 同一套 token 同时服务：桌面网页（1440）、移动网页（390）、A4 横向打印册、低带宽静态版。
3. 让 6 条业务线、3 根支柱、4 层架构、5 类流、14 个区块的视觉语言完全同源，新增业务不新增样式。

### 0.2 品牌延续（来自 `presentation/index.html` 与 README §2/§8）

| 品牌资产 | 网页转译 |
|---|---|
| 深海军蓝 `#071C36` / `#0B1F3A` / 最深 `#05121F` | 沉浸式区块底色、指针、页脚 |
| 象牙白 `#F6F0E4` / 纸白 `#FBF6EC` | 编辑式区块底色、抽屉「文件纸」 |
| 香槟金 `#C9A25E`（深底）/ 深金 `#9C7A38`（浅底线）/ `#7C5F2B`（浅底小字） | 描边、数据高亮、章节序号、刻度、图标 |
| 信号绿 `#00A86B`（毛里塔尼亚绿） | 仅正向数据与地图流向；面积 ≤10% |
| Didot（展示）/ Avenir Next（正文、标签）/ Minion Pro Italic（引文） | FR 字体栈第一顺位；网页用 Playfair Display / Nunito Sans 回退；中文用 Noto Serif SC / Noto Sans SC |
| 安全印刷语言：细金线、1px 网格、坐标刻度、guilloche 弧线、档案编号 | 背景纹理、区块序号、图表刻度、页眉页脚 |
| 双环 logo（中国 × 毛里塔尼亚；环内弧线 = 信号/数据/话语流动） | 图形系统母题：所有关系图/地图弧线的曲率与端点语言与 logo 环线一致 |

### 0.3 明确不做（BRIEF §6 禁止项）

- 不做紫/蓝紫渐变 SaaS 风、玻璃拟态卡片堆叠、超大圆角、emoji 图标、廉价 3D 地球、无意义 3D 旋转卡片、自动播放声音。
- 不新增品牌主色；数据分类色（钢蓝/赭铜）仅用于图表与关系图，且必须同时有**线型/形状**的第二编码（见 §3.4、§10）。
- 不用第三方照片或未授权 app 截图；手机 mockup 用线框 + 色块示意。

---

## 1. 设计原则（可执行版）

| # | 原则 | 具体规则 |
|---|---|---|
| P1 | **纸张优先，屏幕第二** | 每个区块先能作为 A4 横向完整排版，再叠加动效；禁止只有 hover/动画才能读到的信息 |
| P2 | **金色是线，不是面** | 金色用于 1px 线、小面积数据点、序号、focus ring；单屏金色填充面积 ≤3%；数据信号绿 ≤10% |
| P3 | **一个区块一个主张** | 每区块只有一个 H2 + 一句 lead；数字 ≤6 个主次分明（06/09 例外），避免仪表盘轰炸 |
| P4 | **动效 = 解释关系** | 只动「层级、方向、因果」：揭示顺序 = 阅读顺序；不做与叙事无关的装饰动画 |
| P5 | **深色沉浸，浅色编辑** | 深色用于 Hero / 系统图 / 数据 / 关系；浅色用于业务详情 / 收益 / 诉求；边界用 1px 金线，不用渐变过渡带 |
| P6 | **数字必须有身份** | 每个数字配单位、年份、口径标签（Source/Dérivé/Hypothèse）与来源入口；样式统一为等宽数字 |
| P7 | **可降级即完成** | 任何组件在 reduced-motion / low-bandwidth / print / no-JS 四态下都有静态等价物（交互规格 §1.8） |
| P8 | **地图是示意图** | 所有地图、关系图必须标注「示意 / 非比例」；不追求地理精度，追求方向正确 |

---

## 2. Token 架构与命名规范

### 2.1 三层结构

```
Primitive（原始值，禁止在组件里直接用）  --navy-900 / --gold-500 / --sp-8 / --fs-h2
        ↓
Semantic（按角色，随明暗 tone 切换）      --bg / --text / --line / --gold / --surface
        ↓
Component（组件私有，仅在组件 CSS 内）    --btn-bg / --drawer-title-size / --card-pad
```

组件 CSS **只允许使用 semantic 与 component 变量**；primitive 仅出现在 token 定义文件与图表数据色中。

### 2.2 命名规范

| 类别 | 前缀 | 示例 | 说明 |
|---|---|---|---|
| 颜色 | `--c-`（原始）/ `--bg- --text- --line- --gold- --flow-`（语义） | `--c-navy-900`, `--text-muted`, `--flow-paiements` | 原始色板带色号；语义不带具体色相 |
| 字体 | `--ff-` | `--ff-display`, `--ff-body`, `--ff-num` | 按语言覆盖 |
| 字号 | `--fs-` | `--fs-display-1`, `--fs-h2`, `--fs-body`, `--fs-label` | 流体 clamp |
| 行高/字距 | `--lh-` / `--ls-` | `--lh-body`, `--ls-label` | — |
| 间距 | `--sp-` | `--sp-24` | 数值 = px，8pt 体系 |
| 圆角 | `--r-` | `--r-0`, `--r-sheet` | 默认 0 |
| 线宽 | `--bw-` | `--bw-hair`, `--bw-focus` | 屏幕 1px / 打印 0.25pt |
| 阴影 | `--sh-` | `--sh-drawer`, `--sh-tooltip` | 极克制 |
| 动效 | `--dur-` / `--ease-` | `--dur-base`, `--ease-out` | 与交互规格一致 |
| 层级 | `--z-` | `--z-header`, `--z-drawer` | 全站唯一阶梯 |

### 2.3 文件组织（建议给 T3）

```
src/styles/
  tokens.css        /* primitive + semantic + tone + print */
  base.css          /* reset、排版基础、a11y 工具类 */
  layout.css        /* 栅格、容器、区块节奏 */
  components/       /* 每个组件一份，遵循 §8 命名 */
  motion.css        /* 动效 token 与 reduced-motion 规则 */
  print.css         /* @media print（§11） */
```

禁止在组件中写十六进制颜色；禁止 `!important`（仅允许在 `@media print` 与 reduced-motion 覆盖中）。

---

## 3. 色彩系统

### 3.1 原始色板（Primitive）

| Token | Hex | 用途 | 备注 |
|---|---|---|---|
| `--c-navy-950` | `#05121F` | 最深背景（07 关系图、封面渐变端） | 品牌册封面渐变端色 |
| `--c-navy-900` | `#071C36` | 深色区块主背景 | BRIEF 指定 |
| `--c-navy-800` | `#0B1F3A` | 深色区块次背景、正文深蓝 | BRIEF 指定 |
| `--c-navy-700` | `#102A4C` | 深色卡片/悬浮层（不用玻璃） | 派生（+亮度） |
| `--c-navy-600` | `#17395F` | 深色描边/网格线 | 派生 |
| `--c-ivory-050` | `#FBF6EC` | 纸白（浅色区块卡片） | 品牌册 `section.paper` |
| `--c-ivory-100` | `#F6F0E4` | 象牙白（浅色区块背景） | BRIEF 指定 |
| `--c-ivory-200` | `#EFE6D6` | 浅色 hover / 次级面 | 派生 |
| `--c-ivory-300` | `#E4D6BB` | 象牙金（Marchandises 流、标签底） | 派生 |
| `--c-gold-500` | `#C9A25E` | 香槟金：深底描边/数据高亮 | BRIEF 指定；印刷对应 Pantone 871 C（烫金） |
| `--c-gold-600` | `#B08A46` | 金色 hover/次级 | 派生 |
| `--c-gold-700` | `#9C7A38` | 深金：浅底线条、大字、打印 | BRIEF 指定 |
| `--c-gold-800` | `#7C5F2B` | 深金文字：浅底小字（AA） | 派生（对比度需要） |
| `--c-gold-100` | `#E9D9B8` | 金色浅底（徽章/高亮行） | 派生 |
| `--c-green-500` | `#00A86B` | 信号绿：正向数据、地图流向 | BRIEF 指定 |
| `--c-green-600` | `#00794D` | 信号绿文字/打印（浅底 AA） | 派生 |
| `--c-steel-400` | `#7FA6C9` | Données 流（深底） | **DV-1 扩展数据色** |
| `--c-steel-600` | `#33627F` | Données 流（浅底/打印参考） | 派生 |
| `--c-copper-400` | `#D08A5C` | Attention 流（深底） | **DV-1 扩展数据色** |
| `--c-copper-600` | `#9A5230` | Attention 流（浅底/打印参考） | 派生 |
| `--c-ink-900` | `#16273F` | 浅底标题 | 品牌册正文色系 |
| `--c-ink-700` | `#33415A` | 浅底正文 | 品牌册 |
| `--c-ink-500` | `#5E6B7E` | 浅底次要文字（≥4.5:1） | 派生（品牌册 `#6A7688` 加深） |
| `--c-ink-400` | `#6A7688` | 微标注/图表轴（≥3:1 用于图形；小字仅配大字号） | 品牌册 `small` |
| `--c-ink-300` | `#8C8478` | 浅底装饰文字（非信息，打印 folio） | 品牌册 |
| `--c-white` | `#FFFFFF` | 视频/二维码底、正向数据点 | — |
| `--c-black` | `#000000` | 不使用（用 navy-950 代替） | — |

### 3.2 语义 token（按 tone 切换）

```css
:root {
  /* 默认浅色 tone；深色区块用 [data-tone="dark"] 覆盖 */
  --bg: var(--c-ivory-100);
  --bg-deep: var(--c-ivory-200);
  --surface: var(--c-ivory-050);
  --surface-raised: #ffffff;
  --text: var(--c-ink-900);
  --text-secondary: var(--c-ink-700);
  --text-muted: var(--c-ink-500);
  --text-faint: var(--c-ink-400);
  --line: rgba(11, 31, 58, 0.16);
  --line-soft: rgba(11, 31, 58, 0.10);
  --line-strong: rgba(11, 31, 58, 0.32);
  --gold: var(--c-gold-700);       /* 线条/大字 */
  --gold-text: var(--c-gold-800);  /* 浅底小字 */
  --gold-soft: rgba(156, 122, 56, 0.22);
  --gold-glow: rgba(201, 162, 94, 0.14);
  --positive: var(--c-green-600);
  --focus-ring: var(--c-gold-700);
  --scrim: rgba(5, 18, 31, 0.58);
  --grid-line: rgba(11, 31, 58, 0.06);
}

[data-tone="dark"] {
  --bg: var(--c-navy-900);
  --bg-deep: var(--c-navy-950);
  --surface: rgba(246, 240, 228, 0.04);
  --surface-raised: var(--c-navy-700);
  --text: var(--c-ivory-100);
  --text-secondary: rgba(246, 240, 228, 0.78);
  --text-muted: rgba(246, 240, 228, 0.58);
  --text-faint: rgba(246, 240, 228, 0.40); /* 仅装饰，不承载信息 */
  --line: rgba(246, 240, 228, 0.16);
  --line-soft: rgba(246, 240, 228, 0.09);
  --line-strong: rgba(246, 240, 228, 0.32);
  --gold: var(--c-gold-500);
  --gold-text: var(--c-gold-500);
  --gold-soft: rgba(201, 162, 94, 0.24);
  --gold-glow: rgba(201, 162, 94, 0.16);
  --positive: var(--c-green-500);
  --focus-ring: var(--c-gold-500);
  --scrim: rgba(5, 18, 31, 0.62);
  --grid-line: rgba(246, 240, 228, 0.07);
}

/* 抽屉/浮层永远是「纸」：强制浅色语义，不受当前区块 tone 影响 */
[data-surface="paper"] {
  --bg: var(--c-ivory-050);
  --surface: var(--c-ivory-050);
  --text: var(--c-ink-900);
  --text-secondary: var(--c-ink-700);
  --text-muted: var(--c-ink-500);
  --line: rgba(11, 31, 58, 0.16);
  --gold: var(--c-gold-700);
  --gold-text: var(--c-gold-800);
  --focus-ring: var(--c-gold-700);
}
```

规则：

1. 组件不得假设自己处于深/浅底：所有颜色通过 semantic token 取用，父级 `[data-tone]` 决定值。
2. 金色文字在浅底必须用 `--gold-text`（`#7C5F2B`，≥4.5:1）；`--gold`（`#9C7A38`）只用于线、大字（≥24px）与图形。
3. `--text-faint` 在深底为 40% 象牙白，**禁止**承载正文/数据/链接，只用于页码、装饰刻度。
4. 悬浮层（tooltip、抽屉、菜单）使用 `[data-surface="paper"]` 或 `[data-tone="dark"]` 显式声明，不继承页面。

### 3.3 透明度阶梯（统一使用，不随意写 rgba）

| Token | 深底用途 | 浅底用途 |
|---|---|---|
| `--a-04` (4%) | 卡片面、悬浮面 | 极浅分隔 |
| `--a-08` (8%) | hover 面 | hover 面 |
| `--a-12` (12%) | 边框（弱） | 边框（弱） |
| `--a-16` (16%) | 边框（默认） | 边框（默认） |
| `--a-24` (24%) | 金色软边 / 分割 | 金色软边 |
| `--a-40` (40%) | 装饰文字（禁用承载信息） | 装饰 |
| `--a-58` (58%) | — | 深色 scrim（`rgba(5,18,31,.58)`） |
| `--a-62` (62%) | scrim | — |

### 3.4 五类流数据色（DV-1，需 Lead 确认）

| 流 | 深底 token / 值 | 浅底 / 打印值 | 线型 | 端点形状 | 说明 |
|---|---|---|---|---|---|
| Capital 资本 | `--flow-capital: #C9A25E` | `#9C7A38` | 实线 | 菱形 | 品牌金，最重要 |
| Marchandises 货物 | `--flow-marchandises: #E4D6BB` | `#A8895E` | 实线 + 短划 `6 4` | 方形 | 象牙金，与 Capital 用线型区分 |
| Paiements 支付 | `--flow-paiements: #00A86B` | `#00794D` | 实线 | 圆点 | 信号绿；仅正向/流转语义 |
| Données 数据 | `--flow-donnees: #7FA6C9` | `#33627F` | 实线 + 点线 `1 4` | 圆环 | 钢蓝（海军蓝族延伸） |
| Attention 注意力 | `--flow-attention: #D08A5C` | `#9A5230` | 实线 | 三角 | 赭铜，仅图谱/图例 |

限制：DV-1 两类新色（钢蓝、赭铜）**只用于数据可视化**（关系图、图例、图表分类、地图流向说明），不得用于按钮、标签、背景、图标主色；绿色面积全页 ≤10%。

### 3.5 对比度矩阵（WCAG 2.1，实测参考值）

| 前景 | 背景 | 对比度 | 用途 | 结论 |
|---|---|---|---|---|
| `#F6F0E4` | `#071C36` | ≈15.1:1 | 深底正文/标题 | AAA |
| rgba(246,240,228,.78) | `#071C36` | ≈10.7:1 | 深底次要文字 | AAA |
| rgba(246,240,228,.58) | `#071C36` | ≈6.9:1 | 深底标签/轴 | AA（小字可用） |
| `#C9A25E` | `#071C36` | ≈7.2:1 | 深底金色小字/标签 | AAA |
| `#00A86B` | `#071C36` | ≈5.6:1 | 深底正向数据 | AA |
| `#16273F` | `#F6F0E4` | ≈13.4:1 | 浅底标题 | AAA |
| `#33415A` | `#F6F0E4` | ≈9.1:1 | 浅底正文 | AAA |
| `#5E6B7E` | `#F6F0E4` | ≈4.8:1 | 浅底次要文字 | AA |
| `#7C5F2B` | `#F6F0E4` | ≈5.2:1 | 浅底金色小字 | AA |
| `#9C7A38` | `#F6F0E4` | ≈3.5:1 | 浅底金线/大字/图形 | 仅大字/图形（≥3:1） |
| `#00794D` | `#F6F0E4` | ≈4.9:1 | 浅底绿色小字 | AA |
| `#FFFFFF` | `#071C36` | 18.6:1 | 二维码/纯白 | AAA |

> 数值用 WCAG 相对亮度公式计算（2026-11-09）；实际以浏览器取色 + axe DevTools 复核。焦点环颜色 `--focus-ring` 在对应底色上 ≥3:1。

### 3.6 用量配额与禁止

| 颜色 | 单屏面积上限 | 禁止 |
|---|---|---|
| 信号绿 | ≤10% | 背景大块、按钮主色、装饰线 |
| 香槟金 | 线/点为主，填充 ≤3% | 大面积金色卡片、金色文字墙 |
| 象牙白 | 可大面积 | — |
| 深海军蓝 | 可大面积（沉浸区块） | 浅色区块中使用深色卡片（除地图 inset） |
| 钢蓝/赭铜 | ≤5%，仅数据 | UI 控件、图标、标签背景 |

---

## 4. 字体系统

### 4.1 字体栈（按语言）

```css
:root {
  --ff-display: 'Didot', 'Playfair Display', 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --ff-body: 'Avenir Next', 'Nunito Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --ff-lead: 'Minion Pro', 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --ff-num: 'Avenir Next', 'Nunito Sans', 'Inter', system-ui, sans-serif;
  --ff-mono-num-feat: 'tnum' 1, 'lnum' 1; /* 数字等宽特性，用于数据/标签 */
}

html[lang="zh"] {
  --ff-display: 'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', 'Source Han Serif SC', serif;
  --ff-body: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Source Han Sans SC', sans-serif;
  --ff-lead: 'Noto Serif SC', 'Songti SC', serif;
  --ff-num: 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
}
```

| 角色 | 首选（品牌/本地） | 网页字体（必须加载） | 回退 | 用途 |
|---|---|---|---|---|
| FR display | Didot（macOS 系统字体） | Playfair Display 400/500 + italic 400 | Cormorant Garamond → Georgia | H1/H2/大数字/引句 |
| FR body | Avenir Next | Nunito Sans 400/600 | Inter → system sans | 正文、标签、按钮、UI |
| FR lead/引文 | Minion Pro Italic | Cormorant Garamond Italic 400（或 Playfair Italic） | Georgia Italic | lead 段落、转折引句 |
| FR 数据/标签 | Avenir Next | Nunito Sans + `tnum` | Inter/system | KPI、图表标签、表头 |
| ZH display | — | Noto Serif SC 500 | Songti SC/STSong/SimSun | 中文标题、引句 |
| ZH body | — | Noto Sans SC 400/500 | PingFang SC/Hiragino Sans GB/Microsoft YaHei | 中文正文、UI |
| ZH 数据 | — | Noto Sans SC + `tnum`（若字体支持） | system | 数字/标签 |

> 说明：Didot / Avenir Next / Minion Pro 为 macOS 系统字体，**不做网页分发**（授权与体积原因）；网页必须自带 Playfair Display / Nunito Sans / Noto 作为稳定回退，保证 Windows/Android 视觉一致。用户机器有系统字体时优先（体现品牌），无则回退（版式不变）。

### 4.2 加载策略与子集

| 项 | 规则 |
|---|---|
| 格式 | 仅 WOFF2；`font-display: swap`；关键字体 `preload`（Playfair Display 400、Nunito Sans 400） |
| 拉丁子集 | Playfair Display：latin + latin-ext（含 « » – ’ œ Œ à â ç é è ê ë î ï ô ù û ü ÿ）；Nunito Sans：latin + latin-ext + vietnamese？不需要越南语 → latin + latin-ext |
| 权重 | 只加载实际使用：display 400/500 + italic 400；body 400/600；不加载 700（用 600 代替，标题不加粗） |
| 中文 | **按页面实际用字生成子集**（i18n JSON 全量文案扫描 + 数字/标点/拉丁混排字符）；按 unicode-range 切成 2–3 个切片（如常用 3000 字 + 扩展），每片 ≤ 60KB；总 CJK ≤ 180KB（2 权重） |
| 中文回退 | 未覆盖字形按字体栈回退到系统（PingFang/Songti），不出现 tofu |
| 总预算 | 拉丁 ≤ 120KB、CJK ≤ 180KB；low-bandwidth 只加载当前语言且 CJK 用系统字体（不下载） |
| 度量覆盖 | 为回退字体建 `@font-face` metrics override（见下），减少 CLS；数值构建期用 font-metrics 工具测量后回填 |
| 打印 | 打印复用已加载字体；若未加载完，回退系统字体且版式不溢出（打印 CSS 设置固定字号与行高） |

```css
/* 拉丁示例（文件名由构建期生成） */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display-latin-400.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+2000-206F, U+20AC, U+2122, U+2212;
}
@font-face {
  font-family: 'Nunito Sans';
  src: url('/fonts/nunito-sans-latin-400.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+2000-206F;
}
/* 回退度量（构建期测量；以下为初始估值，需用 font-metrics 工具校准） */
@font-face {
  font-family: 'Nunito Sans Fallback';
  src: local('Arial'), local('Helvetica');
  size-adjust: 96%;
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
}
```

### 4.3 字号阶梯

| Token | 桌面 1440（px） | 移动 390（px） | 行高 | 字距 | 字体 | 用途 |
|---|---|---|---|---|---|---|
| `--fs-display-1` | 96（clamp 2.75–6rem） | 44 | 0.98 / 1.02 | -0.015em | display | Hero H1 |
| `--fs-display-2` | 72 | 36 | 1.0 | -0.01em | display | 章节封面数字/大引句 |
| `--fs-h1` | 56 | 32 | 1.05 / 1.08 | -0.005em | display | 区块 H2（14 个区块标题） |
| `--fs-h2` | 40 | 26 | 1.1 / 1.15 | 0 | display | 卡片组标题、抽屉 H2 |
| `--fs-h3` | 28 | 21 | 1.2 / 1.25 | 0 | display | 卡片标题 |
| `--fs-h4` | 22 | 18 | 1.3 | 0.005em | body 600 / display | 小标题、tab 标题 |
| `--fs-lead` | 20 | 17 | 1.5 / 1.55 | 0.005em | lead（italic）或 body | lead 段落 |
| `--fs-body` | 17 | 16 | 1.6 / 1.65 | 0.005em | body | 正文 |
| `--fs-body-s` | 15 | 14 | 1.55 | 0.01em | body | 次级正文、图注 |
| `--fs-label` | 12 | 11 | 1.3 | 0.22em（uppercase） | body 600 | kicker、标签、图例 |
| `--fs-micro` | 11 | 10.5 | 1.4 | 0.06em | body | 来源、页码、微标注 |
| `--fs-data-xl` | 64 | 40 | 1.0 | -0.01em | display/num | Hero KPI、09 KPI |
| `--fs-data-l` | 40 | 32 | 1.05 | 0 | num/display | 卡片大数字 |
| `--fs-data-m` | 28 | 24 | 1.1 | 0 | num | 中等数字 |
| `--fs-data-s` | 18 | 16 | 1.2 | 0.01em | num | 表格/图例数字 |

- 中文行高在 `html[lang="zh"]` 下 +0.1：正文 1.75、标题 1.12、display 1.08；中文标题字距 0.02em，正文 0.01em。
- 最小字号：正文 ≥ 14px（移动）/ 15px（桌面正文以下不用）；微标注 ≥ 10.5px；打印 ≥ 5.4pt。
- 字号只用 token，禁止组件内写 `font-size: 23px`。

### 4.4 流体字号（clamp）建议值

```css
--fs-display-1: clamp(2.75rem, 6.4vw, 6rem);
--fs-display-2: clamp(2.25rem, 4.4vw, 4.5rem);
--fs-h1: clamp(2rem, 3.6vw, 3.5rem);
--fs-h2: clamp(1.625rem, 2.6vw, 2.5rem);
--fs-h3: clamp(1.3125rem, 1.8vw, 1.75rem);
--fs-body: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem); /* 16 → 17 */
--fs-label: clamp(0.6875rem, 0.65rem + 0.15vw, 0.75rem); /* 11 → 12 */
```

- 320–479 用移动下限；≥1440 锁定上限；流体只作用于展示型字号，正文与表格字号用固定值避免抖动。
- 大标题使用 `text-wrap: balance`（标题）、`text-wrap: pretty`（正文）；法语长词用 `hyphens: auto; lang="fr"`。

### 4.5 数字与排版规则

#### 数字（FR / ZH）

| 规则 | FR | ZH |
|---|---|---|
| 小数 | 逗号 `2,5` | 点 `2.5` |
| 千位 | 窄不换行空格 U+202F（回退 U+00A0） | 万/亿缩写优先；完整数字可用千位空格 |
| 缩写 | `250 k` / `2,5 M` / `1,2 Md` | `25 万` / `250 万` / `1.2 亿` |
| 区间 | `150–220`（en dash 无空格） | `1.5–2.2` |
| 百分比 | `1,3–1,9 %`（数字与 % 之间不换行空格） | `1.3–1.9%`（无空格） |
| 单位 | `40 min`、`2,8 M comptes`（不换行） | `40 分钟`、`280 万账户` |
| 数字特性 | `font-feature-settings: 'tnum' 1, 'lnum' 1` | 同（若字体支持） |
| 不换行 | 数字+单位包 `<span class="nowrap">` | 同 |

#### 法语排版细则

- 使用弯引号 `« … »`（内嵌 `“…”`），撇号 `’`（不写 `'`）。
- 冒号、分号、问号、感叹号前为不换行空格：`« Trois piliers »`、`La réponse :`；百分号前不换行空格；货币符号/单位在数字后空格（`2,5 M USD`、`40 min`）。
- 破折号 `—` 两侧不换行空格；连接号 `-` 用于复合词；范围用 en dash `–`。
- 书名/文件题用斜体或引号；专有名词保留原拼写（Nouakchott、RIMU、RIMP、hassaniya、peul、soninké、wolof）。
- 禁止：中文式引号混入 FR、全角标点、双空格。

#### 中文排版细则

- 中文与拉丁/数字之间自动间距（`text-spacing` / 手动 0.1em 或使用 `font-variant-east-asian` 的标点压缩）；标题中文不加粗，用字重 500。
- 不在数字与单位/万/亿之间换行；破折号用 `——`；引号用「」/“”；省略号 `……`。
- 中英混排时英文用 FR body 字体（Nunito/Inter），中文用 Noto Sans SC；行高按中文。
- 中文标题不使用 letter-spacing 大写技巧；uppercase 类标签在中文下转为正常大小写（CSS `:lang(zh) .label { text-transform:none; letter-spacing:.08em; }`）。

### 4.6 字体验收

1. 禁用系统字体（Chrome 开发者工具模拟无 Didot）时，版式仍成立，标题不溢出。
2. 中文字体子集加载后无 tofu；生僻字（如「毛里塔尼亚」「努瓦克肖特」）覆盖。
3. 拉丁/CJK 字体切换无 FOUT 大幅跳动（CLS ≤0.02）。
4. 数字在所有组件中为 tabular；计数器滚动时宽度不抖动。
5. 打印 PDF 中字体嵌入/回退正确，无乱码。

---

## 5. 栅格与空间

### 5.1 断点与容器

| Token | 媒体查询 | 页边距 | 列数 | 沟槽 | 容器最大宽 |
|---|---|---|---|---|---|
| `--bp-m` | 0–479.98px | 20px（≤359px 时 16px） | 4 | 16px | 100% |
| `--bp-ml` | 480–767.98px | 24px | 4 | 20px | 100% |
| `--bp-t` | 768–1023.98px | 32px | 8 | 20px | 100% |
| `--bp-l` | 1024–1439.98px | 48px | 12 | 24px | 1280px |
| `--bp-xl` | ≥1440px | 80px | 12 | 24px | 1280px |
| `--bp-wide` | ≥1920px | auto | 12 | 24px | 1600px（`.container--wide`） |

```css
.container { width: 100%; max-width: 1280px; margin-inline: auto; padding-inline: 80px; }
.container--wide { max-width: 1600px; }
.container--narrow { max-width: 1080px; }
.bleed { width: 100vw; margin-inline: calc(50% - 50vw); }

@media (max-width: 1439.98px) { .container { padding-inline: 48px; } }
@media (max-width: 1023.98px) { .container { padding-inline: 32px; } }
@media (max-width: 767.98px)  { .container { padding-inline: 24px; } }
@media (max-width: 479.98px)  { .container { padding-inline: 20px; } }
@media (max-width: 359.98px)  { .container { padding-inline: 16px; } }
```

规则：

1. 14 个区块统一使用 `.container`；关系图/地图等需要更大的视觉面积时用 `.container--wide` 或 `.bleed`（内容仍受 1600 限制）。
2. 12 栅格实现使用 CSS Grid：`grid-template-columns: repeat(12, minmax(0,1fr)); gap: 24px`；移动 `repeat(4,minmax(0,1fr)); gap:16px`。
3. 组件跨列：Hero 文案 1–7 / 视觉 9–12；04 卡片 4 列；06 两栏 1–6 / 7–12；13 两栏 1–7 / 8–12。
4. 禁止用绝对定位做常规栅格（仅装饰与连接线允许）。

### 5.2 间距阶梯（8pt 体系，允许 4px 半步）

| Token | 值 | 典型用途 |
|---|---|---|
| `--sp-1` | 4px | 图标与文字间隙、hairline 偏移 |
| `--sp-2` | 8px | 标签内边距、紧凑行距 |
| `--sp-3` | 12px | 小卡片内边距、图表标签 |
| `--sp-4` | 16px | 卡片内间距（紧凑）、列表行 |
| `--sp-6` | 24px | 栅格沟槽、卡片内边距（移动） |
| `--sp-8` | 32px | 卡片内边距（桌面）、区块内段落间距 |
| `--sp-10` | 40px | 抽屉内边距、标题与内容 |
| `--sp-12` | 48px | 区块内子块间距 |
| `--sp-16` | 64px | 头部与内容、区块标题下 |
| `--sp-20` | 80px | 区块之间（移动） |
| `--sp-24` | 96px | 区块内大间距 |
| `--sp-30` | 128px | 区块 padding（桌面小） |
| `--sp-40` | 160px | 区块 padding（桌面标准） |
| `--sp-48` | 192px | Hero/封面特殊节奏 |

### 5.3 垂直节奏

| 区块 | 桌面 padding-block | 移动 padding-block | 区块头 → 内容间距 |
|---|---|---|---|
| 00 Hero | 0（100svh 内布局） | 0 | 32px |
| 01–13 标准 | 160px / 120px | 72px / 64px | 桌面 64px；移动 40px |
| 07 Relations（全屏图） | 120px / 96px | 64px / 48px | 40px |
| 13 + Footer | 160px / 80px | 72px / 56px | 48px |

- 相邻两个深色区块（02 → 06 → 07）之间用 1px 金色线分隔；深 → 浅边界用 1px `--line-strong`，不加阴影/渐变。
- 区块标题区最大宽 720px（编辑式阅读），右侧辅助信息（图例/操作）贴右。
- 移动端所有区块至少保留 64px 下边距，保证打印/截图呼吸感。

### 5.4 行宽与文本

| 内容 | 桌面 | 移动 |
|---|---|---|
| 正文（FR） | 60–72ch（≈ 620–720px） | 36–48ch（350px 容器） |
| 正文（ZH） | 30–38 字/行 | 18–24 字/行 |
| lead | 46–58ch | 28–36 字 |
| 标题 | 最多 2 行（H1 3 行） | 3 行内 |
| 表格 | 全宽，但单元格文本 ≤ 2 行 | 允许横向滚动（带渐隐提示）或改为卡片 |

- 使用 `max-width: 68ch` + `text-wrap: pretty`；法语长标题使用 `text-wrap: balance`。
- 段落间距 = 1em（17px）；列表项间距 0.75em。

---

## 6. 线、圆角、阴影、材质、层级

### 6.1 线宽

| Token | 屏幕 | 打印 | 用途 |
|---|---|---|---|
| `--bw-hair` | 1px | 0.25pt | 金色细线、网格、卡片描边、表格线 |
| `--bw-strong` | 2px | 0.5pt | 选中态、tab 下划线、图例强调 |
| `--bw-focus` | 2px + 2px offset | — | 焦点环（颜色 `--focus-ring`） |
| `--bw-chart` | 1px | 0.25pt | 坐标轴、网格线（透明度更低） |
| `--bw-data` | 1.5px | 0.5pt | 关系图/地图流线（hover 2.5px） |

- 屏幕 1px 线用颜色透明度区分强弱，不叠加 `box-shadow` 伪造。Retina 下 1px 即 1 物理像素线，保持「安全印刷」的克制感。
- 金色线在浅底用 `--c-gold-700`，深底用 `--c-gold-500`；不得用 4 色模拟金。

### 6.2 圆角

| Token | 值 | 用途 |
|---|---|---|
| `--r-0` | 0 | 默认：卡片、按钮、标签、tooltip、抽屉（桌面）、图表容器、表格 |
| `--r-1` | 2px | 小型状态点/徽章、进度条 |
| `--r-sheet` | 16px | 移动端底部 sheet 顶部两角 |
| `--r-phone` | 28px | 手机 mockup 外框（屏幕内 26px） |
| `--r-round` | 999px | 仅用于头像占位/圆点；禁止按钮/卡片使用 |

- 视觉基调是「方形纸面」：除手机与底部 sheet 外，一律直角。BRIEF 禁止「圆角玻璃卡片堆叠」。

### 6.3 阴影与发光

| Token | 值 | 用途 |
|---|---|---|
| `--sh-tooltip` | `0 12px 32px rgba(5,18,31,.28)` | tooltip、小浮层 |
| `--sh-drawer` | `0 24px 80px rgba(5,18,31,.35)` | 桌面抽屉 |
| `--sh-sheet` | `0 -16px 60px rgba(5,18,31,.40)` | 移动底部 sheet |
| `--sh-focus` | `0 0 0 2px var(--focus-ring)` | 焦点环（与 outline 二选一） |
| `--glow-gold` | `0 0 0 1px var(--gold), 0 0 24px var(--gold-glow)` | 节点高亮（克制，仅 1 层） |
| `--sh-card` | none | 卡片不使用阴影；用 1px 线与背景明度区分 |

- 禁止：多层大阴影、弥散彩色阴影、玻璃拟态、内阴影。手机 stage 底部可用极淡金色径向光（opacity ≤0.10）暗示悬浮，不用投影。

### 6.4 背景材质

| 材质 | 规格 | 用途 |
|---|---|---|
| Hero 渐变 | `linear-gradient(160deg, #0A2342 0%, #071C36 45%, #05121F 100%)` + 左上金色径向光 `radial-gradient(120mm 90mm at 86% 18%, rgba(201,162,94,.10), transparent 70%)` | 00 Hero、封面打印 |
| Guilloche 弧线 | `repeating-radial-gradient(circle at 108% 118%, transparent 0 12px, rgba(201,162,94,.06) 12px 12.5px)`，再叠加第二组圆心偏移 160px、opacity .04 | Hero、13、附录分隔页 |
| 1px 网格 | 竖线每 64px、横线每 64px，颜色 `--grid-line`；只用于深色图区（02/07）与图表背景 | 系统图、关系图、时间轴刻度 |
| 纸张 | 浅色区块纯色 `--c-ivory-100`；卡片 `--c-ivory-050` + 1px `--line`；**无噪点纹理**（性能与印刷考虑） | 01/03/04/08/10–12 |
| 深色面板 inset | `--c-navy-950` + 1px 金线 + 内边距 24px，不圆角 | 10 地图面板、13 CTA 区 |
| 章节编号水印 | Didot 数字（如 `07`）opacity 0.05，尺寸 200–280px，绝对定位于区块角落 | 深色区块（可选） |

### 6.5 z-index 阶梯

| Token | 值 | 用途 |
|---|---|---|
| `--z-base` | 0 | 普通内容 |
| `--z-sticky` | 100 | 区块内 sticky 元素（总结卡） |
| `--z-header` | 110 | 顶部导航 |
| `--z-progress` | 120 | 阅读进度条 |
| `--z-backdrop` | 200 | 抽屉遮罩 |
| `--z-drawer` | 201 | 抽屉面板 |
| `--z-spotlight` | 202 | 关联节点聚光层 |
| `--z-tour` | 300 | Mode Pitch 控制条/呼出卡 |
| `--z-toast` | 400 | toast |
| `--z-skip` | 500 | skip link |

- 全站只允许这 10 层，禁止组件内自定义 z-index 数字。

---

## 7. 动效语言

### 7.1 动效 token（与交互规格 §1.2 对齐）

| Token | 值 | 用途 |
|---|---|---|
| `--dur-instant` | 80ms | 按下反馈、hover 颜色 |
| `--dur-fast` | 160ms | 交叉淡入、tooltip |
| `--dur-base` | 240ms | hover 高亮、tab 下划线 |
| `--dur-slow` | 360ms | 手风琴、卡片强调 |
| `--dur-slower` | 520ms | 抽屉内容 stagger、区块头部 |
| `--dur-enter` | 640ms | 区块进入（默认） |
| `--dur-cinematic` | 800ms | Hero 背景、系统图连线 |
| `--dur-counter` | 1400ms | 数字滚动 |
| `--dur-drawer` | 420ms | 抽屉打开 |
| `--dur-drawer-close` | 280ms | 抽屉关闭 |

| Token | 值 | 用途 |
|---|---|---|
| `--ease-standard` | `cubic-bezier(.2,0,0,1)` | 通用 UI |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | 进入/揭示（默认） |
| `--ease-in` | `cubic-bezier(.7,0,.84,0)` | 退出/关闭 |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | 循环/呼吸 |
| `--ease-drawer` | `cubic-bezier(.32,.72,0,1)` | 抽屉/底部 sheet |
| `--ease-editorial` | `cubic-bezier(.33,0,.2,1)` | 标题行揭示、引句 |

| 其他 | 值 |
|---|---|
| 进入位移 | 桌面 24px（标题 40px 行揭示）；移动 12px |
| stagger | 默认 70ms；卡片 60–90ms；行 40–60ms；节点 40–80ms |
| 循环周期 | 粒子 6–10s；呼吸 2.4s；进度线 8s（手机演示） |
| 同时运动元素上限 | 6 个 / 屏 |
| 反馈延迟 | hover 0ms；tooltip 80ms；加载指示 ≤200ms 出现 |

### 7.2 编排原则

1. **阅读顺序 = 动效顺序**：背景/线 → 标题 → 正文 → 数据；区块进入总时长 ≤900ms。
2. 一个屏幕同层最多 6 个元素运动；超过则分组（标题组/卡片组/数据组）依次。
3. 只在 `transform` / `opacity` 上做动画；高度动画仅手风琴/抽屉内容（280–320ms），用 `grid-template-rows` 或 FLIP。
4. 进入动画结束态必须精确等于静态设计（无残余 transform），避免截图/打印错位。
5. 装饰循环（粒子、呼吸）必须：不可见暂停、页面隐藏暂停、reduced/low-bw 关闭、可被「暂停」按钮停止。
6. 交互反馈不得排队：hover 用 CSS transition 或 GSAP `quickTo`；连续触发以最后一次为准。
7. 动效不得触发滚动条变化、不得造成 CLS；数字/图表容器需预留尺寸。
8. 所有动效在浅色编辑式区块中更克制（位移 ≤16px）；深色沉浸区块可到 24–40px（标题遮罩揭示）。

### 7.3 reduced-motion 策略

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .parallax, .particles, .canvas-layer { display: none !important; }
  .static-fallback { display: block !important; }
}

html[data-motion="reduced"] { /* 手动开关，规则同上（通过类/属性复制一份） */ }
```

- 全局 CSS 兜底后，JS 仍需：不初始化 GSAP 时间线、不创建 Canvas/rAF、不自动滚动 Tour、计数器直接写最终值、图表直接终态。
- 提供 `data-motion="reduced"` 手动覆盖（页脚开关），优先级高于系统偏好。
- 减少动效 ≠ 没有层级：用静态的透明度/位置层级（淡背景、线框、序号）代替动画区分。
- 呼吸类循环（滚动提示）在 reduced 下静止在第 1 帧。

### 7.4 性能规则

- 粒子/Canvas：一个全局 rAF ticker；每帧只写 transform；粒子总数 ≤120；连续 2s <45fps 自动降级静态。
- SVG 路径 draw 使用 `stroke-dasharray/offset`（1 次性），不在每帧更新长路径。
- `will-change` 仅在动画开始前加、结束后移除；禁止全站常驻。
- 字体就绪后再启动依赖宽度的动画（尤其中文）。
- 打印/切后台/低电量（`navigator.getBattery?` 不强制）时暂停所有循环。
---

## 8. 组件库规格

> 每个组件给出：结构（anatomy）、尺寸/间距、token、状态、明暗变体、移动、打印、无障碍。组件 CSS 只使用 semantic token（§2.1）。
> 通用焦点样式（全站统一）：
> ```css
> :focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
> .on-dark :focus-visible { outline-color: var(--c-gold-500); }
> ```
> 禁止 `outline: none` 无替代。

### 8.1 按钮（Button）

| 变体 | 结构 | 尺寸 | 表情 | 状态 |
|---|---|---|---|---|
| Primary | 文字 + 可选图标（右箭头） | lg 56px 高 / 32px 内距；md 48 / 28；sm 40 / 20 | 金色填充 `--gold`，文字 `--c-navy-900`；方角（`--r-0`）；无阴影 | default → hover 金提亮（`--c-gold-600`）160ms → active y+1px / scale .995 → focus 2px 环 offset 2 |
| Secondary | 同 | 同上 | 透明底；1px `--line-strong` 描边；文字 `--text`；深底描边象牙白 32%，浅底描边 navy 32% | hover：描边变 `--gold`，文字不动 |
| Tertiary（文字 + 箭头） | 文字 15px 600 + 箭头 16px | 44px 高（命中区） | 无底无边；下划线 1px `--line`；箭头右移 4px | hover：下划线变 `--gold`；箭头动 200ms |
| Icon-only | 40×40 或 44×44 | 图标 20px 线性 | 1px 透明描边 | hover 背景 `--a-08`；active 缩放 .96 |

- 字号 15px（移动 16），字重 600，字距 0.01em；不使用大写（法语文案句子式），但 kicker/标签用大写。
- 禁用：opacity .40 + `cursor:not-allowed` + `aria-disabled`；不改变尺寸。
- loading：16px 旋转金环替换左侧图标，宽度锁定；文案保留。
- 深/浅底自动通过 semantic token；**不提供**「金色文字按钮」（金色文字只用于三级链接）。
- 移动：主 CTA 全宽、高 ≥52px；按钮间距 12px。
- 打印：按钮降级为文字链接，PDF 中不显示填充；如必须保留样式则用 1px 金框 + 文字（可读）。
- 无障碍：原生 `<button>` 或 `<a>`；外链图标带 `aria-label`（`s'ouvre dans un nouvel onglet`）。

### 8.2 链接与箭头（Link / Arrow）

- 正文链接：颜色继承，下划线 1px `--line-strong`，offset 3px；hover 下划线变金、颜色不变（不靠颜色单独传达）。
- 「箭头链接」（Voir le dossier →）：标签 15px 600 + 16px 箭头；箭头 `translateX(0)`；hover/focus 时箭头 `+4px`（200ms `--ease-out`）；下划线出现在文字下方。
- 外链：右上箭头 12px；PDF 链接：文档图标 14px；邮箱：复制图标（点击复制）。
- 打印：链接文字后括注 URL（仅关键链接，如 `aureondigital.mr`），脚注式 5.4pt。

### 8.3 筛选 Chip（Filter chip）

| 属性 | 规格 |
|---|---|
| 尺寸 | 高 36px（移动 40）、左右内距 14px；min-width 44px |
| 文字 | 13px / 500；FR 首字母大写，不整体大写 |
| 形状 | 方角（`--r-0`）；1px `--line` 描边；透明底 |
| 默认 | 文字 `--text-secondary` |
| hover | 描边 `--line-strong`；文字 `--text` |
| selected | 背景 `--gold-soft`（24% 金）；描边 `--gold`；文字 `--gold-text`（浅底）/ `--gold`（深底）+ 实心 6px 金点 |
| focus | 2px 环 |
| 禁用 | 40% opacity |

- 示例：关系图 5 类流筛选、时间轴 3 轨道、语言切换、章节快捷。
- 移动：横向滚动行，两侧 24px 渐隐遮罩；不换行。
- 打印：筛选状态不可见（打印全量），chip 仅出现在说明性图例中。

### 8.4 标签 / 状态徽章 / 来源标签（Tag / Badge）

| 类型 | 结构 | 规格 | 颜色 |
|---|---|---|---|
| 状态徽章（业务） | 6px 点 + 文字 | 高 24px；11px uppercase 600；字距 .12em；1px 描边；内距 0 8px | mature：实心金点 + 金描边 + 金文字；pilote：半实心点（外环+内点）+ 描边金；pré-étude：空心点 + 灰描边 + `--text-muted` |
| 来源标签 | 形状符号 + 文字 | 10px；字距 .08em；无边框；与 Source 点合用 | Source：实心点；Dérivé：半实心；Hypothèse：空心；颜色跟随 `--text-muted`，hover 显示解释 tooltip |
| 流 chip | 8px 形状（菱形/方/圆/环/三角）+ 名称 | 高 24；12px；透明底；1px `--line-soft` | 形状用 `--flow-*` 色；名称 `--text-secondary` |
| 年份/期限标签 | 文字 | 10px uppercase .12em | `--text-muted` |
| 分类标签（行业/国家） | 文字 | 11px；1px 描边；内距 6px 8px | `--line` + `--text-secondary` |

- 禁止：渐变徽章、圆角胶囊、emoji、彩色底大面积。
- 移动：字号不变（11px 可读），高度 24；点击 tooltip 命中区扩至 44px（透明外扩）。
- 打印：徽章以文字 + 线型打印（金/墨单色），不依赖颜色；状态文字保留。

### 8.5 业务卡（Business Card — 04）

```
┌──────────────────────────────────────────┐
│ 01                                   ● mature │  ← 编号 + 状态徽章
│ Projets & investissements                     │  ← H3 28/1.2
│ Mines, énergies nouvelles, infrastructures…   │  ← tagline 15/1.5（2 行）
│ ┌──────┬──────┬──────┐                        │
│ │ 5–8  │ 800 M–│ 6    │                        │  ← KPI 3 列：20px 等宽 + 11px 标签
│ │projets│1,2 Md│cats. │                        │
│ └──────┴──────┴──────┘                        │
│ Ouvrir le dossier →            ◇ capital ◇…   │  ← 箭头 + 流 chip
└──────────────────────────────────────────┘
```

| 属性 | 桌面 | 移动 |
|---|---|---|
| 尺寸 | 宽自适应（3 列），min-height 360px；高度随内容（grid auto-rows-fr 等高） | 全宽 350px，≤ 420px |
| 内边距 | 32px | 24px |
| 背景 | `--surface`（ivory-050） | 同 |
| 边框 | 1px `--line`；顶部 2px 透明轨道（hover 时金色 35%→100%） | 同 |
| 悬停 | 背景 `#FFFDF8`；边框 `--gold-soft`；箭头右移；**不位移卡片** | 无 hover |
| 指标 | 3 列 grid，列间 1px 竖线（`--line-soft`）；数值 `--fs-data-m` 等宽；标签 11px、最多 2 行 | 3 列 → 2 行自适应 |
| 字体 | H3 `--fs-h3` display；tagline body 15 | H3 22px |
| 打印 | 3 卡/页（或 2×3 一页），去掉 hover 金线，保留编号/状态/指标/来源脚注 | — |
| 无障碍 | 整卡 `<a>`；`aria-label` 含完整业务名；焦点环内描边 | — |

### 8.6 支柱卡（Pillar Card — 03）

| 属性 | 规格 |
|---|---|
| 尺寸 | 桌面 3 列（每列 ~389px），min-height 480px；平板 1 列宽卡 |
| 内边距 | 40px（桌面）/ 28px（移动） |
| 结构 | 罗马数字（display 28，金）+ 状态徽章 → H3（display 32/1.15）→ 定位句（body-s 15，2 行）→ 3 条 bullet（图标 16 + 文本 14，行距 8）→ 线稿示意（120×72，金色 1px，透明底）→ 底部指标（data-l 40 + 标签 11）→ 箭头链接 |
| 背景 | `--surface`；边框 1px `--line`；顶部 1px 金色线（0.35 默认，hover 到 1） |
| hover | 背景 `#FFFDF8`；描边 `--gold-soft`；示意线宽 1→1.25；其余卡 opacity .85（仅桌面） |
| 焦点 | 内描边 2px 环（offset -2px） |
| 移动 | 单列；示意缩至 104×64；整卡可点（≥ 420px 高）；无「其余变暗」 |
| 打印 | 3 卡一排（89mm 宽），金色线变深金 0.25pt；指标 ≥8pt；状态文字保留 |
| 无障碍 | `<a>` 整卡；卡片内无第二链接；状态徽章 `title` 解释 |

### 8.7 抽屉（Drawer — L2）

| 部分 | 规格 |
|---|---|
| 容器 | 桌面宽 `clamp(480px, 38vw, 560px)`，右侧贴合，全高，直角，左 1px 金线；背景 `--c-ivory-050`（`data-surface="paper"`）；`--sh-drawer` |
| header | 高 96px（滚动后 72px，280ms）；内距 24/32；kicker 10px uppercase 金（类型 · 编号）；H2 display 30/1.15（移动 24）；状态徽章；右上关闭按钮 44×44（1px 描边） |
| meta 行 | 一句话定位 15px；参与方/流 chips；与正文间距 20px |
| tablist | 高 48px；6 等分；sticky top（header 下）；底部 1px `--line`；选中项 2px 金下划线（滑动 240ms） |
| 内容 | padding 32px 32px 48px；`overscroll-behavior: contain`；行宽 68ch；L3 手风琴间距 8px；段落间距 16px |
| footer | sticky 底：来源 11px + 方法学链接 + 「Imprimer cette fiche」；背景 `--surface`；上边 1px `--line` |
| 打开/关闭 | 见交互规格 §1.4（420ms / 280ms） |
| 移动 | 底部 sheet，高 92svh，顶部圆角 16，拖拽把手 36×4（金，2px 圆角，顶部 8px）；header 72px；tablist 横向滚动（每项 min 96px，两侧 24px 渐隐）；内容 padding 24px 20px 96px（含 safe-area） |
| 打印 | 桌面抽屉外壳隐藏；当前 fiche 由 `.print-only` 附录页替代；不打印遮罩、关闭按钮、tablist |
| 无障碍 | role=dialog、aria-modal、焦点陷阱、Esc、焦点归还、tab 的 ARIA Tabs 模式（交互规格 §1.4/§1.7） |

### 8.8 Tab（Drawer Tab / Track Tab）

| 属性 | 抽屉 6 tab | 时间轴 3 轨 / 图表分组 tab |
|---|---|---|
| 高度 | 48px | 44px |
| 文字 | 13px / 600；FR 首字母大写；不缩写 | 14px / 600 |
| 布局 | 6 等分；下划线 2px 金，宽度 = 文字宽（非整格） | 自动宽度，间距 24px |
| 默认 | 文字 `--text-muted`；下划线透明 | 同 |
| hover | 文字 `--text` | 同 |
| selected | 文字 `--text`；下划线 `--gold`；`aria-selected="true"` | 同；切换时下划线 `translateX` 240ms |
| focus | 2px 环（在 tab 内偏移 4px） | 同 |
| 移动 | 横向滚动；不换行；两侧渐隐 24px；点击命中 ≥44px | 横排 chips（§8.3） |
| 打印 | 不打印 tab（附录 fiche 用 6 条带标题替代） | 打印全量轨道 |

### 8.9 手风琴 / L3 子卡（Accordion / Sub-card）

| 属性 | 规格 |
|---|---|
| 行高 | 桌面 88px（收起）/ 72px（移动）；内距 20px 0 |
| 结构 | 左侧编号/图标（20px）→ 标题（16px 600）→ 摘要（14px muted，收起时 1 行）→ 右侧 + 图标（20px，20ms 旋转 45° 表示展开） |
| 分隔 | 每行顶部 1px `--line`；最后一行底部 1px |
| 展开 | 内容 padding-bottom 24px；进入 `opacity 0→1` + `height auto`（280ms `--ease-out`）；图标旋转 240ms |
| 状态 | hover 背景 `--surface-raised`（浅底 `#FFFDF8`）；展开行顶部金线 1px；允许多开（11/12）或单开（L3、06 移动层） |
| 子卡 | L3 子卡：背景 `--c-ivory-100`、1px 线、内距 20px、标题 15px 600 + 描述 14px；hover 描边金；可整卡点击 |
| 移动 | 同；行内不显示摘要（省空间），只显示标题 + 箭头 |
| 打印 | 全部展开（JS beforeprint）；行高压缩到 36–48px，内容跟随；不打印 + 图标 |
| 无障碍 | `<details>/<summary>` 或 button + aria-expanded/aria-controls；键盘 Enter/Space、↑↓ |

### 8.10 Tooltip / Popover

| 属性 | 规格 |
|---|---|
| 容器 | 最大宽 340px；内距 12px 16px；背景 `--c-navy-900`；文字 `--c-ivory-100`；1px 金描边；直角；`--sh-tooltip`；无箭头（或 6px 金色三角） |
| 结构 | 标签 10px uppercase 金 → 标题 14px 600 → 正文 13px/1.5（≤3 行）→ 可选底部提示（11px muted） |
| 出现 | hover 延迟 80ms；focus 立即；消失 0ms；位移 y 4px + fade 160ms；reduced 瞬时 |
| 位置 | 指针右侧 12px，翻转逻辑；键盘锚定节点；不遮挡触发元素；滚动时关闭 |
| 移动 | 不使用 hover tooltip；改为固定底部信息条（高 ≤120px）或直接打开 sheet；图表可 tap 显示固定提示 |
| 打印 | 不打印 tooltip；其内容（来源/口径）进脚注 |
| 无障碍 | role="tooltip" + aria-describedby；不接收焦点；ESC 关闭（若可交互 popover 则焦点陷阱） |

### 8.11 时间轴（Timeline — 08）

| 属性 | 规格 |
|---|---|
| 轨道区 | 桌面 1200×300 设计坐标；左 160px 轨道名列（display 14px）；右侧时间区 1040px；年份刻度 6 个（2026–2031） |
| 轴线 | 1px `--gold`（浅底）水平基线；刻度竖线 1px、高 12px、`--line-strong`；年份标签 12px 等宽 |
| 里程碑 | 菱形 12×12（旋转 45° 方块），描边 1.5px 金、填充透明；选中：填充金 + 外环 4px `--gold-soft`；hover：scale 1.25（180ms） |
| 里程碑标签 | 标题 13px 600（节选）+ 年份 10px muted；与节点垂直距离 12px；交错防重叠 |
| RIMU 数据点 | 节点下方 `250 k`…`2,5 M`（12px 等宽金） |
| 三期条带 | 高 8px 金条（不透明度 .5）+ 虚线开放端；标签在条上方 10px uppercase |
| 详情面板 | 高 220px（固定，防 CLS）；背景 `--surface`；1px 金线；内距 24px；标题 + 3–5 行 + 链接 |
| 移动 | 纵轴 1px 金；节点圆点 10px；年份 chips 粘顶；行高 72px；详情展开 |
| 打印 | 全部轨道平铺（见交互规格 §3.10 页 14）；节点改为实心小方块；标签 ≥7pt |
| 无障碍 | 轨道 `role=tablist`；里程碑为按钮；`aria-expanded` |

### 8.12 图例（Legend）

| 属性 | 规格 |
|---|---|
| 布局 | 桌面水平 5 项；移动两列/可滚动；间距 24px |
| 单项 | 24px 线段（颜色 + 线型）+ 8px 端点形状 + 名称 12px + 可选计数 10px muted |
| 流图例 | 5 项固定顺序：Capital / Marchandises / Paiements / Données / Attention（与数据顺序一致） |
| 点击 | 图例项可点击 = 筛选切换（`aria-pressed`）；hover 高亮对应图形 |
| 打印 | 线段 + 端点 + 名称；颜色不可靠 → 线型 + 形状必须可辨；下方注明 `trait = flux, symbole = type` |
| 无障碍 | 列表结构 `ul`；色觉障碍测试（deuteranopia 模拟） |

### 8.13 KPI 块与计数器（KPI / Counter）

| 属性 | Hero 版 | 仪表盘版（09） |
|---|---|---|
| 结构 | 标签（11px uppercase .22em 金/灰）→ 数值（display 64px）→ 单位/口径（12px）→ Source 点 | 同，数值 56px；块间 1px 金分割线（浅底为 `--line`） |
| 数值 | 等宽数字（§4.5）；FR 紧凑格式；行高 1.0；不换行 | 同 |
| 标签 | 支持 2 行；全大写；字距 .18em | 同 |
| 口径行 | `2031 · scénario ambitieux` 11px muted；Source 标签 10px | 同 + 「Méthodologie」链接 |
| hover | 显示 tooltip（口径/公式/来源）；数字提亮 4% | 同；block 可点击 → 方法学抽屉 |
| 动画 | 滚动 1400ms（一次）；`aria-hidden` 动画层 + sr-only 最终值 | 同；Rejouer 按钮 |
| 打印 | 最终值 + 口径 + 来源脚注；无动画；数字 ≥14pt（打印） | 同 |
| 无障碍 | 读屏读最终值；tooltip 可聚焦触发（wrapper tabindex=0） | 同 |

### 8.14 图表容器（Chart）

| 属性 | 规格 |
|---|---|
| 容器 | 透明底；无边框（或顶部 1px `--line`）；内距 0；预留 `aspect-ratio` 防 CLS |
| 坐标轴 | 1px `--line`；刻度文字 11px `--text-muted` 等宽；单位标注 10px |
| 网格线 | 水平 1px `--grid-line`（深底）/ `rgba(11,31,58,.06)`（浅底）；不画竖网格（除非时间轴） |
| 数据系列 | 五类流用 §3.4 色；其他图表用 `--gold` / `--text-secondary` / `--positive` 三色以内；范围条用金色明度区分 |
| 标签 | 直接标注优先于图例（数据点少时）；标签 11–12px，不得遮挡线；碰撞时外移 |
| 来源脚注 | 图下方 10.5px muted：`Source : dossier RIMU · section IV · projections 2031` + 数据标签 |
| 动效 | draw-on 一次（900ms），reduced/print 直接终态；hover 只做 tooltip 与高亮，不重绘 |
| 移动 | 简化刻度（≤4 个）；标签不旋转；必要时改横向条形图/列表 |
| 打印 | 静态；灰阶可读（明度/线型/标签三重编码）；刻度 ≥6pt；图注在下方 |
| 无障碍 | `figure` + `figcaption`；提供隐藏数据表或「Voir les données」展开表；SVG `role="img"` + aria-label 概述 |

### 8.15 表格（Table）

| 属性 | 数据/流向表 | 打印表 |
|---|---|---|
| 表头 | 11px uppercase .12em，金色（浅底深金）；底边 1px `--line-strong`；内距 12px 16px | 6.2pt，字距 .12em |
| 行 | 高 ≥48px；底边 1px `--line-soft`；无斑马纹；hover 行背景 `--a-04`（桌面） | 行高 8mm；线 0.2pt |
| 单元格 | 14px body；数字右对齐等宽；长文本最多 2 行后省略（title 提示全文） | 7.2pt；行高 1.35 |
| 首列 | 名称左对齐；可 sticky（移动横向滚动时） | — |
| 移动 | 横向滚动容器 + 两侧渐隐；或改为卡片列表（>4 列时优先卡片） | — |
| 打印 | 表格不跨页；`thead` 重复；总宽 ≤261mm；单位在表头 | — |
| 无障碍 | `caption`（可视觉隐藏）；`scope="col/row"`；排序按钮（如需要）带 aria-sort | — |

### 8.16 地图面板（West Africa Map — 10）

| 属性 | 规格 |
|---|---|
| 面板 | 深色 inset：背景 `--c-navy-950`；1px 金线；内距 24px；高 520px（桌面）/ 360px（移动）；直角；不圆角不投影 |
| 地图线稿 | 海岸线 1.5px `rgba(246,240,228,.55)`；国界虚线 1px `rgba(246,240,228,.24)`；无填充/无地形/无地名海 |
| 起点 | Nouakchott：圆点 6px 金 + 双环 16px + 标签 12px uppercase 象牙白；下方 8px 副标签 `Point d'arrêt régional` |
| 流向弧线 | 1.5px、§3.4 颜色（此处用 Marchandises 象牙金）；端点三角 6px；方向外发；hover 2.5px |
| 国家标签 | 11px 象牙白；与弧线端点对齐；Gambie/Sénégal 上下错开 |
| 数据标签 | 左下：全局货值 800 M–2 Md USD/an（12px）；右下：`Schéma indicatif — non à l'échelle`（10px muted） |
| 信息栏 | 右侧 240px（桌面）：国家名 20px display + 方向 + 1 行说明 + 数据标签 + 「Voir la fiche」；移动为底部信息条 |
| 打印 | 单色线稿（金线 + 墨字）；弧线用不同虚线；标注示意；无粒子 |

### 8.17 手机 mockup（Phone Frame — 05）

| 部件 | 规格 |
|---|---|
| 外框 | 340×700（桌面）；圆角 28px；1.5px 金描边（`--c-gold-500`）+ 内 1px `rgba(201,162,94,.35)`；背景 `--c-navy-950`；无 3D 倾斜 |
| 屏幕 | 334×694（内边距 3px）；圆角 26px；背景渐变 `#0B1F3A → #071C36`；`overflow:hidden` |
| 状态栏 | 24px：时间 9:41（11px 600）、信号/wifi/电池线性图标 14px、象牙白 |
| 顶部 tab bar | 4 个名称（For You / Abonnements / À proximité / Marché），13px；选中金 + 2px 下划线；未选中 60% 象牙白 |
| 内容区 | 演示内容（交互规格 §3.4）；最小字号 9px；图片区用色块/线框 |
| 底部 tab bar | 高 56px；4 个图标 22px + 标签 10px；选中金；背景 `rgba(5,18,31,.92)` |
| 演示控制 | 手机下方 40px：4 章节点（12px 菱形/圆）+ 播放按钮 44px + 进度线 1px 金 |
| 移动 | 280×580；外框 24px；屏幕内字号 ≥9px；控制按钮 44px |
| 打印 | 静态帧 1（For You）+ 4 tab 名单 + 8 模块清单；无控件、无动效 |
| 无障碍 | 屏幕 `aria-hidden`；提供文字版演示描述；外层 tab 可操作 |

### 8.18 Hero 背景层（Hero Background）

| 层 | 规格 | 降级 |
|---|---|---|
| L0 渐变 | `linear-gradient(160deg,#0A2342,#071C36 45%,#05121F)` | 静态 CSS |
| L1 金色径向光 | `radial-gradient(120mm 90mm at 86% 18%, rgba(201,162,94,.10), transparent 70%)` | 静态 |
| L2 guilloche | 2 组 repeating-radial-gradient（§6.4），opacity .06/.04 | 静态 |
| L3 网格 | 1px 竖/横线每 64px，`--grid-line` | 静态 |
| L4 连线/粒子 | 3 条贝塞尔弧（中国 ↔ 毛里塔尼亚意象，抽象不画真实地图）+ 60–90 个小点；30fps 上限；粒子沿弧缓慢流动 | 静态 SVG：3 条金色弧 + 点阵；low-bw 同 |
| L5 暗角 | 底部 20% 渐隐到 `--c-navy-950`，保证 KPI 条可读 | 静态 |

- 粒子颜色：金 60%、象牙白 30%、绿 10%（不抢主标语）；禁止霓虹。
- 性能：一个 Canvas；DPR ≤2；页面隐藏/不可见暂停；reduced 不创建 Canvas。
- 打印：静态弧线 + 点阵，低透明度（0.10），印刷安全（无 CMYK 溢出风险）。

### 8.19 导航 / 页脚 / 语言切换 / 进度条

| 组件 | 规格 |
|---|---|
| Header（桌面） | 高 64px；背景：Hero 内透明、滚动后 `rgba(7,28,54,.92)` + 1px `--line`；左 logo 高 22px；中段导航 14px（6–8 项 + 「Plus」）；右：语言切换、打印图标、金色 CTA（Tour） |
| Header（移动） | 高 56px；logo 20px；右 hamburger 44px；菜单为全屏深色 sheet（内距 24px；14 区块列表 18px；底部语言/打印/低带宽开关） |
| 滚动行为 | 向下滚动隐藏（translateY -100%，240ms），向上显示；键盘聚焦强制显示 |
| 进度条 | 顶部 2px 金线；`scaleX`；reduced 下每秒更新一次；Tour 激活时由 Tour 进度替代 |
| 语言切换 | 两段 segmented：`FR` / `中文`；高 32px；选中金下划线 + 文字全亮；`aria-pressed`；移动放菜单内 |
| 页脚 | 深底；上 padding 80px；4 列（品牌/来源/法律/联系）；链接 13px；底部版权 11px muted；金色顶线 1px；QR（可选） |
| 打印 | Header/页脚/进度条全部隐藏，改用打印页眉页脚（§11） |
| 无障碍 | skip links（跳到内容/导航）；当前区块高亮 `aria-current="true"` |

### 8.20 Mode Pitch UI

| 部件 | 规格 |
|---|---|
| Start card | 居中 560px（移动 100%−40px）；深底 + 金线；kicker `VISITE GUIDÉE`；H2 32px；7 章列表（编号 + 名称 + 时长）；主按钮「Commencer · 3 min」；次链接「Explorer librement」；`Esc` 关闭 |
| Control bar | 桌面 720×72，距底 24px；深底 95% + 金线；播放/暂停 44px；7 段进度；时间 12px 等宽；上/下场景与退出 40px；焦点环 |
| Callout | 宽 320px；深底 + 金线；编号（10px 金）+ 标题 15px + 正文 13px（≤3 行）；金色连接线 1px（桌面）；无连接线（移动，改底部信息卡） |
| End card | 560px；logo + Merci + 3 数字 + 5 决策一句话 + 3 CTA + 可选 QR；`Esc`/「Explorer」关闭 |
| 移动 | 控制条全宽 88px（两行）；callout 为底部卡（max-width 100%−32px）；start/end card 全宽−40px |
| 打印 | 不打印 Tour；start card 与 end card 不出现在打印流 |
| 无障碍 | toolbar role；aria-live 场景播报；键盘 Space/←/→/Esc；焦点限制在控制条 |

### 8.21 空态 / 加载 / 错误态

| 状态 | 规格 |
|---|---|
| 空态 | 左对齐；金色竖线 2px×24px + 标题 15px 600 + 说明 14px muted（≤2 行）+ 可选次级链接；内距 24px；不画插画、不用 emoji |
| 加载 | 金色 1px 线进度（不确定态：从左到右 1.2s 循环，宽度 30%→70%）；或静态占位（图表区域：1px 边框 + 中央 `Chargement…` 12px）；**禁止骨架屏闪烁** |
| 错误 | 同空态 + 重试按钮（Secondary sm）+ 错误码可选（11px muted，如 `ERR-DATA-01`，便于 QA） |
| 数据缺失 | `—` + 「Donnée à confirmer」；不显示 0（0 是数据，— 是缺失） |
| 打印 | 空态文字保留；加载态替换为「Donnée non disponible au moment de l'impression」 |

### 8.22 打印页框（Print Page Frame）

- 见 §11：297×210mm、18mm 页边、kicker/brandline/folio、深色仅 2 页。
- 组件在打印中的统一替换规则：交互控件隐藏 → 内容全量展开 → 数字最终值 → 图表静态 → 链接脚注化。

---

## 9. 暗 / 亮节奏编排（14 区块）

| # | 区块 | Tone | 背景 token | 标题色 | 金色用途 | 与上一区块的边界 | 备注 |
|---|---|---|---|---|---|---|---|
| 00 | Hero | dark | `--c-navy-900` 渐变 | 象牙白 | 主标语描边/序号/KPI 单位 | 页面起点 | 唯一使用粒子背景 |
| 01 | Constat | light | `--c-ivory-100` | navy | 编号、箭头、转折引句线 | 深→浅：1px `--line-strong` | 编辑式留白最大 |
| 02 | Vue système | dark | `--c-navy-950` | 象牙白 | 节点描边、总线、坐标刻度 | 浅→深：1px 金线 | 图区网格 |
| 03 | Trois piliers | light | `--c-ivory-100` | navy | 罗马数字、卡顶线、指标 | 深→浅：1px 线 | 3 卡均衡 |
| 04 | Six lignes | light | `--c-ivory-050`（略浅纸白） | navy | 编号、状态点、卡顶线 | 同色：1px `--line` | 与 03 区分用底色微差 |
| 05 | RIMU | dark | `--c-navy-900` | 象牙白 | 手机外框、tab 选中、模块图标 | 浅→深：1px 金线 | 手机是唯一「亮屏」 |
| 06 | Contenu IA & Calcul | dark | `--c-navy-950` | 象牙白 | 四层线、三期箭头、主权下划线 | 同深：1px `--line` | 与 05 用更深底区分 |
| 07 | Relations | darkest | `--c-navy-950` + 更深渐变 | 象牙白 | 图例、流线金 | 同深：无边界（靠 padding） | 全站最深，粒子图 |
| 08 | Feuille de route | light | `--c-ivory-100` | navy | 轴、节点、选中 | 深→浅：1px 线 | 长横向内容 |
| 09 | Chiffres 2031 | dark | `--c-navy-900` | 象牙白 | KPI 分割线、图表、口径徽章 | 浅→深：1px 金线 | 数据密度最高 |
| 10 | Bénéfices | light | `--c-ivory-100` | navy | 地图面板（深色 inset）、收益卡线 | 深→浅：1px 线 | 深色 inset 地图形成对比 |
| 11 | Demande | light | `--c-ivory-100` | navy | 编号、展开金线、总结卡 | 同色：1px `--line` | 阅读型窄容器 |
| 12 | Risques | light | `--c-ivory-050` | navy | 等级标签、缓解措施竖线 | 同色：1px `--line` | 更收窄（1080） |
| 13 | Next steps + Footer | dark | `--c-navy-900` → footer `--c-navy-950` | 象牙白 | CTA、金线、QR | 浅→深：1px 金线 | 收束与转化 |

节奏原则：

1. 深色区块占比：00/02/05/06/07/09/13 = 7 个；浅色 7 个；整体明暗交替但允许 05–07 连续深色（沉浸三连：产品 → 底座 → 关系），其中 07 最深形成「数据核心」。
2. 连续深色区块之间必须有 96–120px 的空白节奏（padding），并用 1px `--line` 分隔，避免糊成一块。
3. 深色区块内部**不**使用浅色卡片（除 10 的 inset 地图，其内部再深一档）；浅色区块内部**不**使用深色卡片（除 CTA 条与地图面板的 inset）。
4. 金色在每个区块只承担一个主要角色（线/编号/数据/图标），不叠加。
5. 打印时深色区块转为浅底编辑式（封面与附录分隔页除外），见 §11.2。

---

## 10. 图标与插画风格

### 10.1 图标（UI Icons）

| 属性 | 规格 |
|---|---|
| 网格 | 24×24；安全区 2px（图形落在 20×20 内） |
| 线宽 | 1.5px（24px 下）；小尺寸 16px 时 1.25px（光学补偿） |
| 端点/转角 | `stroke-linecap: butt`；`stroke-linejoin: miter`；不圆角、不手绘抖动 |
| 填充 | 默认无填充；仅状态点/方向箭头可实心；数据流标记用几何形（§3.4） |
| 颜色 | 继承 `currentColor`；金色用于激活/强调，不双色 |
| 尺寸 | 16 / 20 / 24 / 28（禁止 22/18 等随意值） |
| 风格 | 「技术图纸」：直线为主，45°/90° 转折；曲线仅用于地图与 logo 环线 |

图标清单（首版 24 个，内联 SVG sprite）：

- 支柱：`pillar-bilateral`（双交叠环 + 箭头）、`pillar-rimu`（手机 + 四格）、`pillar-compute`（3 层机柜 + GPU 网格）
- 业务：`mining`（矿井轮廓）、`trade`（集装箱/秤）、`consumer-goods`（箱 + 箭头）、`finance`（圆环 + 支付点）、`training`（书本/毕业帽线稿，不用 emoji）、`health`（十字 + 信号波）
- 流：`flow-capital`（菱形）、`flow-goods`（方形）、`flow-payment`（圆点）、`flow-data`（圆环）、`flow-attention`（三角）
- UI：`arrow-right`、`arrow-up-right`、`chevron-down`、`close`、`plus`、`play`、`pause`、`print`、`globe`（语言）、`menu`、`copy`、`download`、`check`、`warning`、`map-pin`、`source-dot`（三态）

禁止：emoji、彩色多色图标、圆角粗线「SaaS 风」图标、写实 3D 图标、阴影图标。

### 10.2 地图与示意图（Illustration）

- 西非地图（10）：简化海岸线 + 5 国边界虚线；不画地形、不用真实卫星图；标注「非比例」；弧线曲率与 logo 环线一致（大半径、低压扁）。
- 系统图（02）：节点为矩形框（直角、1px 线），连接为直线 + 45° 折线；总线为 1px 金水平线；禁止箭头堆叠，方向靠流粒子。
- 四层架构（06）：水平条堆叠（非 isometric/等距 3D），层间短竖线连接；每层左侧序号 01–04。
- 双环 / 流线母题：所有曲线半径 ≥120px；金线 opacity .6；不画发光描边。
- guilloche 生成规则：同心圆/偏心圆弧族，半径步长 12px、线宽 0.75–1px、opacity .05–.08；两组圆心错位 ≥150px；避免摩尔纹（屏幕 1x 下测试）。
- 插画不使用人物照片/头像；如需「用户」意象，用抽象圆点 + 线框手机。

### 10.3 图形禁止清单

无 3D 地球、无发光霓虹、无玻璃、无 emoji、无彩色插画、无渐变紫、无无意义粒子雨、无旋转立方体、无股票 K 线装饰。
---

## 11. 打印 A4 横向版式规则

> 打印流程、beforeprint 钩子、页序与分页表见交互规格 §3.10；本节定义版式与视觉参数。

### 11.1 页面基础

| 项 | 规格 |
|---|---|
| 页面 | A4 横向：297×210mm；`@page { size: A4 landscape; margin: 0; }` |
| 页边距 | 18mm（四边）；底部 10mm 放 folio；顶部 13.5mm 放 kicker/brandline（与 `presentation/index.html` 一致） |
| 版心 | 261×174mm（297−36 / 210−36） |
| 栅格 | 12 列 / 沟槽 5mm；页边 18mm；列宽按 261mm 均分；允许跨列 |
| 底色 | 浅色页：`#F6F0E4` 或 `#FBF6EC`；深色页：`#071C36` / `#05121F` |
| 出血 | 数字 PDF 无需出血；若交印厂，加 3mm 出血（303×216mm），深色页必须出血 |

```css
@page { size: A4 landscape; margin: 0; }
@media print {
  html, body { width: 297mm; background: #F6F0E4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .site-header, .progress, .tour, .drawer, .scrim, .no-print, canvas, video { display: none !important; }
  .print-only { display: block !important; }
  .page { position: relative; width: 297mm; height: 210mm; padding: 18mm; overflow: hidden;
          page-break-after: always; break-after: page; background: #F6F0E4; }
  .page:last-child { page-break-after: auto; }
  .page.dark { background: #071C36; color: #F6F0E4; }
  .page.dark2 { background: #05121F; color: #F6F0E4; }
  .print-kicker { position: absolute; left: 18mm; top: 13.5mm; font: 600 5.6pt/1.4 'Avenir Next';
                  letter-spacing: .22em; text-transform: uppercase; color: #9C7A38; }
  .print-brandline { position: absolute; right: 18mm; top: 13.5mm; font: 500 5.4pt/1.4 'Avenir Next';
                     letter-spacing: .28em; text-transform: uppercase; color: #8C8478; text-align: right; }
  .print-folio { position: absolute; right: 18mm; bottom: 10mm; font: 500 5.6pt/1.2 'Avenir Next'; letter-spacing: .22em; color: #8C8478; }
  .print-foot { position: absolute; left: 18mm; bottom: 10mm; font: 500 5.4pt/1.2 'Avenir Next';
                letter-spacing: .20em; text-transform: uppercase; color: #8C8478; }
  .page.dark .print-kicker { color: #C9A25E; }
  .page.dark .print-brandline, .page.dark .print-folio, .page.dark .print-foot { color: rgba(246,240,228,.45); }
  h2, h3 { break-after: avoid; }
  .card, figure, table, .page-block { break-inside: avoid; }
  table { thead { display: table-header-group; } }
}
```

### 11.2 颜色与墨量

| 规则 | 规格 |
|---|---|
| 深色满版 | 仅封面（p1）与附录分隔页（p22）两页；其余深色区块转浅底编辑式 |
| 深色区块转浅 | 背景 `#F6F0E4`；标题 `#0B1F3A`；正文 `#33415A`；金色线 `#9C7A38` 0.25pt；数据点/图形用 navy 为主 |
| 金色 | 浅底深金 `#9C7A38`；深底香槟金 `#C9A25E`；**不使用四色模拟金色大面积**；若实物印刷，金色改为 Pantone 871 C 烫金/金属专色（README §4） |
| 深蓝 | 屏幕 RGB 直接用；实物印刷参考 Pantone 295 C，需打样确认（README §4） |
| 绿色 | 仅正向数据；浅底文字用 `#00794D`（≥4.5:1）；面积 ≤5% |
| 总墨量 | ≤300%（浅底页实际远低于此）；黑色小字 100% K（若实物印刷） |
| 阴影/模糊 | 全部移除；用 1px 线、明度、线型替代 |
| 透明度 | 打印中避免低透明度文字（<70% 油墨）承载信息；装饰可保留 40% |

### 11.3 页面模板

| 模板 | 结构 | 字号 |
|---|---|---|
| Cover（p1） | 深蓝满版渐变 + 静态金色弧线/点阵；左上 logo；kicker；主标语 H1 46pt（Didot）；副标语 10pt；三支柱一行；4 KPI 一行；右下 QR 22mm | H1 46pt / lead 10pt / KPI 数字 22pt / 标签 5.6pt |
| Section / Content（p2–21, 23–29） | 顶部 kicker（编号 + 章节名）+ brandline；标题 H2 27pt；lead 10pt；正文 7.6pt；图/表居中；页脚三行（左文档名 / 右页码 / 来源） | H2 27pt / H3 15pt / body 7.6pt / small 6.2pt / micro 5.4pt |
| Dark separator（p22 附录分隔） | 深底 + 大号「Annexes」+ 目录（6 业务 fiche + 方法学） | H1 40pt / 目录 8pt |
| Appendix fiche（p23–28） | 页眉：业务名 + FICHE A–F；6 条带（Aperçu / Fonctionnement / Chiffres / Acteurs / Roadmap / Risques），每带左标题列（38mm）+ 右内容（3–5 行）；页脚：深链短码 + 来源 | H3 13pt / body 6.8pt / 标签 5.4pt |
| Back cover（p30） | 深底 + logo + 联系（三列）+ QR + 口号 | 联系 8pt / 微标 4.8pt |

### 11.4 打印字号与行距（pt）

| 角色 | pt / 行高 | 字距 | 备注 |
|---|---|---|---|
| H1 | 46 / 1.0 | .005em | Didot；封面/章节 |
| H2 | 27 / 1.06 | .01em | Didot |
| H3 | 15 / 1.15 | 0 | Didot |
| Lead | 10 / 1.45 | .005em | Minion Pro Italic |
| Body | 7.6 / 1.55 | .005em | Avenir Next |
| Small | 6.2 / 1.5 | .01em | 图注、来源 |
| Label | 5.6 / 1.3 | .22em uppercase | kicker、表头 |
| Micro | 5.4 / 1.4 | .06em | 页脚、来源行、URL |
| 表格单元格 | 6.8–7.2 / 1.35 | — | 表格 |
| KPI 数字 | 20–24 / 1.0 | 0 | 等宽数字 |

> 最小字号 5.4pt（底部微标）；正文不低于 6.8pt；图注不低于 6pt。排版后必须在 100% 缩放下可读，不打折。

### 11.5 版式细节

1. **页眉**：左上 kicker（章节编号 + 名称，5.6pt 大写金色）；右上 brandline（`AUREON DIGITAL — PLATEFORME SINO-MAURITANIENNE`，5.4pt 灰）。封面与封底不显示 kicker/brandline。
2. **页脚**：左下文档名 + 日期（`Plateforme sino-mauritanienne · Novembre 2026`，5.4pt 大写灰）；右下 `{page} / 30`（5.6pt）。
3. **标题区**：H2 距页顶 30mm；lead 与标题距 6mm；金色细线（0.25pt）在 lead 下方 6mm、与内容距 8mm。
4. **双栏内容**：栏间距 10mm；栏宽 125.5mm；表格/大图跨双栏。
5. **图注**：图下方 2mm，6pt 灰；编号 `Figure 07 — Flux du système`；来源另起一行 5.4pt。
6. **表格**：表头 5.6pt 大写金色；行高 8mm；单元格 6.8pt；无斑马纹；单位在表头括号内；数字右对齐。
7. **附录 fiche**：6 条带之间 1px 金色线；左侧标题列大写 5.6pt 金；右侧 3–5 行 6.8pt；右下角 deep link（5.4pt 灰）。
8. **QR**：封面右下 / 封底左下；白底（`#FFFFFF`）静区 ≥4 模块；尺寸 22×22mm；下方 5.4pt 标签 `aureondigital.mr`。
9. **分页**：禁止标题在页底孤行；图表不与图注分页；表格不跨页；卡片不跨页；`widows:2; orphans:2`。
10. **页码与目录**：目录页（p22）列 6 个 fiche 页码；PDF 书签按 H2 层级生成（T3 构建时用 PDF 工具链）。

### 11.6 链接、来源与引用

- 打印链接不显示 URL 全串（除 QR 回链与封底）；正文关键链接以「Voir p. XX / fiche X」指向附录页。
- 数字来源统一为：`Source : dossier RIMU — section IV, projections 2031 (scénario ambitieux).`；源文件行号不打印（内部可用）。
- 数据标签图例在方法学页（p29）统一解释 Source / Dérivé / Hypothèse。
- 方法学页包含：收入构成 QA-06 说明、就业口径 QA-03、支付流量 QA-01、钱包 QA-02、算力功率 QA-04、PIB 基年 QA-07（本文沿用交互规格 §4.3 的体验层编号；与 T1 qa[] 的映射见交互规格 §4.3 末表 / §4.6.4）。

### 11.7 打印验收（视觉侧）

1. 297×210mm 导出 PDF 30 页，页面无裁切、无空白页、页码连续。
2. 深色仅 2 页；其余页无大面积深色；总墨量视觉可控。
3. 字号符合 §11.4；5.4pt 微标可读；标题/正文层级一眼可分。
4. 金色线条在打印预览中为细线（0.25pt），不糊不粗。
5. 图表/地图/关系图/手机均为静态且标注示意；灰阶测试可区分数据系列。
6. QR 可扫；页脚/页眉/页码与品牌册风格一致。
7. 中英文各打一版：中文页无豆腐块、字距正常、标点正确。

---

## 12. 可访问性与验收

### 12.1 硬性规则

| 项 | 规则 |
|---|---|
| 对比度 | 正文 ≥4.5:1；大标题（≥24px 或 ≥19px 粗）≥3:1；图形/焦点 ≥3:1（§3.5 矩阵） |
| 焦点 | 所有可交互元素 `:focus-visible` 2px 环 + 2px offset；不得移除 outline 无替代；焦点在深/浅底自动换色 |
| 键盘 | 全站可完成（交互规格 §1.7）；无键盘陷阱（除抽屉/Tour 的**受控**焦点陷阱） |
| 命中区 | 触控 ≥44×44px；鼠标 ≥32×32px；相邻可点元素间距 ≥8px |
| 文字 | 正文 ≥14px（移动）/15px（桌面）；微标 ≥10.5px；打印 ≥5.4pt |
| 缩放 | 200% 缩放不丢内容、不横向溢出（WCAG 1.4.4）；320px 宽可用（1.4.10） |
| 动效 | 遵循 prefers-reduced-motion + 手动开关；无闪烁（≤3 次/秒）；无自动播放声音 |
| 语义 | 每页一个 H1；区块 H2；卡片 H3；landmark（header/nav/main/footer）；跳过链接 |
| 语言 | `html lang="fr|zh"` 正确切换；中文页面字体栈切换；阿语 RTL 预留（二期） |
| 图表 | 每图有 `<figcaption>` 概述 + 可展开数据表；颜色有第二编码 |
| 地图/关系图 | 提供列表/表格等价物；节点/国家可键盘抵达 |
| 手势 | 不使用路径依赖手势（多点/绘制）；拖拽有按钮替代 |
| 高对比模式 | Windows 强制颜色模式下边框/焦点仍可见（使用系统色 fallback） |

### 12.2 焦点样式代码

```css
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: 0;
}
[data-tone="dark"] :focus-visible { outline-color: var(--c-gold-500); }
@media (forced-colors: active) {
  :focus-visible { outline: 2px solid Highlight; }
  .card, .btn, .drawer { border: 1px solid ButtonText; }
}
```

### 12.3 验收清单（设计/前端共用）

1. axe DevTools：0 个 critical / serious 问题（每个区块 + 抽屉 + Tour）。
2. Lighthouse Accessibility ≥95。
3. 键盘走查：Tab 顺序符合阅读顺序；抽屉/ Tour 焦点陷阱正确；Esc 行为符合层级。
4. VoiceOver（Safari）/ NVDA（Chrome）：KPI 读最终值；抽屉标题/角色正确；图表有替代描述。
5. 200% 缩放：无内容裁切；横向滚动仅表格/关系图容器内部。
6. 320×568：无横向滚动；主 CTA 可见；抽屉可关闭。
7. prefers-reduced-motion：无位移/无粒子/无自动 Tour；信息完整。
8. 色盲模拟（deuteranopia/protanopia）：五类流仍可区分；状态徽章不依赖颜色。
9. 打印：§11.7。
10. 对比度抽查：每个区块 5 组文字/背景；按钮/标签/链接/图表轴。
11. 高对比模式：焦点与边框可见。
12. 表单类（mailto 除外）无；复制按钮有 `aria-live` 成功提示。

### 12.4 常见错误（评审时直接打回）

- 金色小字用 `#C9A25E` 放在象牙白上（对比不足）→ 必须 `--gold-text`。
- 深底装饰文字 40% 承载信息 → 不通过。
- 图表只靠颜色区分系列 → 不通过。
- hover 才显示关键信息 → 不通过。
- 抽屉无焦点陷阱 / 关闭后焦点丢失 → 不通过。
- 计数器动画层未 `aria-hidden` → 读屏读中间值，不通过。
- 用 emoji 代替图标、用 3D/玻璃提升「科技感」→ 不通过。

---

## 13. 交付物与实施顺序

### 13.1 Figma 文件结构（设计师交付）

| 页面 | 内容 |
|---|---|
| 01 Foundations | 色板、tone（dark/light）、字体阶梯、间距、线/圆角/阴影、栅格、动效 token |
| 02 Components | 按钮、标签、卡片、tab、手风琴、tooltip、表格、KPI、图表、时间轴、图例、手机、导览 UI、空态；全部 Variant + 明暗两种 |
| 03 Blocks 00–13 | 14 个区块 × 4 尺寸（1440/1280/768/390） |
| 04 Drawer / L2-L3 | 6 tab × 1 业务样例（建议 Projets）+ 其余类型精简版；移动 sheet |
| 05 Print | 30 页 A4 横向模板（含 6 张 fiche） |
| 06 Prototypes | Mode Pitch 7 场景点击流；抽屉开合/返回；关系图筛选；打印入口 |
| 07 Assets | 图标 sprite、地图、手机、guilloche、logo 变体、OG 模板 |

命名规范：`block/04-business-card`、`comp/btn-primary-md`、`comp/tag-status-mature`；Variant 属性用英文（state=default/hover/focus/active/disabled；tone=dark/light；size=sm/md/lg）。

### 13.2 Token JSON（可交给 T3 生成 CSS）

```json
{
  "color": {
    "primitive": {
      "navy-900": "#071C36", "navy-950": "#05121F", "ivory-100": "#F6F0E4",
      "ivory-050": "#FBF6EC", "gold-500": "#C9A25E", "gold-700": "#9C7A38",
      "gold-800": "#7C5F2B", "green-500": "#00A86B", "green-600": "#00794D"
    },
    "semantic": {
      "light": { "bg": "{primitive.ivory-100}", "text": "#16273F", "line": "rgba(11,31,58,.16)", "gold": "{primitive.gold-700}", "gold-text": "{primitive.gold-800}" },
      "dark":  { "bg": "{primitive.navy-900}", "text": "{primitive.ivory-100}", "line": "rgba(246,240,228,.16)", "gold": "{primitive.gold-500}", "gold-text": "{primitive.gold-500}" }
    },
    "flow": { "capital": "#C9A25E", "marchandises": "#E4D6BB", "paiements": "#00A86B", "donnees": "#7FA6C9", "attention": "#D08A5C" }
  },
  "font": {
    "display-fr": ["Didot", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
    "body-fr": ["Avenir Next", "Nunito Sans", "Inter", "system-ui", "sans-serif"],
    "display-zh": ["Noto Serif SC", "Songti SC", "STSong", "SimSun", "serif"],
    "body-zh": ["Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "sans-serif"]
  },
  "space": { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px", "30": "128px", "40": "160px" },
  "radius": { "0": "0", "section": "0", "sheet": "16px", "phone": "28px" },
  "motion": {
    "dur": { "instant": "80ms", "fast": "160ms", "base": "240ms", "slow": "360ms", "enter": "640ms", "counter": "1400ms", "drawer": "420ms" },
    "ease": { "standard": "cubic-bezier(.2,0,0,1)", "out": "cubic-bezier(.16,1,.3,1)", "in": "cubic-bezier(.7,0,.84,0)", "drawer": "cubic-bezier(.32,.72,0,1)", "editorial": "cubic-bezier(.33,0,.2,1)" }
  }
}
```

### 13.3 资产清单（需设计与前端产出）

| 资产 | 格式 | 规格 |
|---|---|---|
| 图标 sprite | SVG（内联/符号） | 24×24；1.5px 描边；currentColor；共 24 个（§10.1） |
| 西非线稿地图 | SVG | 640×520 viewBox；无填充；简化边界；可打印 |
| 手机线框 | SVG/DOM | 340×700 设计；屏幕内容 DOM |
| 系统图/四层图 | SVG | 1200×800 / 1160×360；直角、1px 线 |
| logo 变体 | SVG | 正片（navy）/反白（ivory）/单金；来自 `assets/logo-mark.svg` |
| guilloche 纹理 | SVG pattern | 2 组；opacity .06/.04；≤8KB |
| 流端点形状 | SVG symbol | 菱形/方正/圆/环/三角（5 个） |
| OG 模板 | PNG 1200×630 | 每类抽屉 1 个变体 + 首页 1 个 |
| 打印模板 | Figma/PDF | 30 页 A4 横向；6 张 fiche |

### 13.4 实施顺序（与 T3 排期对齐）

1. **Token 与基础样式**（0.5 天）：tokens.css、base.css、字体加载与子集。
2. **布局与容器**（0.5 天）：栅格、区块节奏、明暗 tone。
3. **通用组件**（2 天）：按钮/标签/card/tab/accordion/tooltip/KPI/table/空态。
4. **区块 00–02**（1.5 天）：Hero、Constat、系统图。
5. **抽屉 + 路由 + 6 tab**（2 天）：L2/L3、深链、焦点管理。
6. **区块 03–06**（2 天）：支柱、业务卡、RIMU 手机、四层架构。
7. **区块 07 关系图**（2 天）：手工坐标、筛选、粒子、列表替代。
8. **区块 08–10**（2 天）：时间轴、数据仪表盘、地图与收益。
9. **区块 11–13 + 页脚**（1 天）：决策清单、风险、转化。
10. **图表与计数器**（1.5 天）：FR/ZH 格式、draw-on、tooltip。
11. **打印模式**（1.5 天）：print.css + 附录生成 + 30 页校对。
12. **Mode Pitch**（2 天）：7 场景、控制条、URL、结束卡。
13. **低带宽 / reduced-motion / 无 JS**（1 天）。
14. **可访问性与性能验收**（1.5 天）：axe、键盘、读屏、Lighthouse、打印测试。

总计 ≈ 20 个工作日（1 名前端 + 0.5 设计支持，视 T3 排期压缩）。

### 13.5 交接检查（每个组件交付前）

- [ ] 明/暗两种 tone 截图对照
- [ ] default / hover / focus / active / disabled 五态
- [ ] 1440 / 390 两尺寸截图
- [ ] reduced-motion / print 截图
- [ ] token 使用清单（无硬编码颜色/字号）
- [ ] 文案 FR/ZH 对照（含不换行空格）
- [ ] 无障碍说明（role/aria/键盘）

---

## 14. 决策记录、假设与版本

### 14.1 视觉系统扩展决策（DV，需 Lead/客户确认）

| # | 决策 | 理由 | 影响 |
|---|---|---|---|
| DV-1 | 五类流分类色新增 **钢蓝 #7FA6C9（Données）** 与 **赭铜 #D08A5C（Attention）**，仅用于数据可视化 | 5 类流需要可区分；海军蓝/金/象牙白/绿不足以区分 5 组 | 印刷/色盲依赖线型与端点形状；如客户拒绝，可改为纯金-灰单色系 + 线型（信息仍可读但识别变慢） |
| DV-2 | 不引入红色警示色（风险等级用金/灰 + 文字） | BRIEF §6 硬约束色彩体系 | 风险严重度靠文字与线型；若需更强的风险感知，可增设 `--alert: #9A3D2A` 仅用于错误态（默认关闭） |
| DV-3 | 浅底金色小字用 **#7C5F2B**，而非品牌 `#9C7A38` | `#9C7A38` 在象牙白上仅 ≈3.5:1，不满足 AA 小字 | 与品牌册小字略有明度差异，视觉上仍属深金 |
| DV-4 | 除手机/底部 sheet 外**全部直角**（圆角 0） | 延续「安全印刷/国家文件」语言，规避 SaaS 圆角卡片风 | 与常见网页组件库不同，需设计师遵守 |
| DV-5 | 中文字体按实际用字子集化（构建期），不整包引入 | 体积预算与首屏 3G <3s | 需 T3 构建流程支持（字形扫描 + 切片） |

### 14.2 视觉侧假设（VS）

| # | 假设 | 待确认 |
|---|---|---|
| VS-01 | Didot / Avenir Next / Minion Pro 不网页分发，仅本机优先 | 若客户要求在任意设备完全一致，需购买授权自托管（预算/法务） |
| VS-02 | 支持播放的浏览器均支持 `@media (prefers-reduced-motion)` 与 `clamp()`；IE 不支持（不在目标范围） | T3 确认浏览器基线（建议 Chrome/Safari/Edge 最近 2 年 + iOS 15+） |
| VS-03 | 不使用任何第三方照片；手机屏幕用抽象 UI 示意 | 若客户提供产品截图/摄影，需另做图片规范（裁切、色调、授权） |
| VS-04 | 明暗节奏按 §9；若客户希望「全浅色提案风」，保留 token 可一键切换，但 Hero/07 的沉浸感会减弱 | Lead/客户 |
| VS-05 | 打印 30 页为基准；可压到 24–26 页（合并页），PDF ≤8MB | 客户/印刷 |
| VS-06 | 阿语 RTL 二期预留（逻辑属性），一期不做阿语排版 | BRIEF §8 |

### 14.3 与交互规格的对应关系

| 本文 | 交互规格 |
|---|---|
| §3 色彩 token / §3.4 流色 | §3.3 关系图编码、§3.7 地图 |
| §4 字号 / §4.5 数字格式 | §3.8 计数器格式 |
| §7 动效 token / §7.3 reduced | §1.2 触发、§1.8 降级矩阵 |
| §8 组件 | §2 逐区块、§3.2 抽屉 6 tab |
| §9 暗亮节奏 | §2 每块 data-tone、§3.10 打印转浅 |
| §10 图标 | §2.2 系统图、§2.7 关系图 |
| §11 打印 | §3.10 打印流程与页序 |
| §12 可访问性 | §1.6–1.8、§4.2 验收 |

### 14.4 版本记录

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.0 | 2026-11-09 | 初稿：token 体系、色彩/字体/栅格/材质、动效语言、22 类组件、暗亮节奏、图标/插画、打印版式、可访问性、实施顺序 |
| v1.1 | 2026-11-09 | 与 T1 data-model v1 / T3 tech-architecture v1 对齐：抽屉统一 6 tab（A-02 修订）、术语采用 T1 实体名（businessLines / kpis / rimuModules / regions / stateSupports 等）、QA 编号映射引用交互规格 §4.3 / §4.6 |

---

> 文件结束。交互与动效状态机见 `web/spec/interaction-motion.md`；内容与数据键见 `web/spec/content-model.md` / `web/spec/data-model.json`；实现选型见 `web/spec/tech-architecture.md`。

