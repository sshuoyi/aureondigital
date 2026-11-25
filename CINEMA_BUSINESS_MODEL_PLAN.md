# Cinematic · 新增「整体业务模型」动画场景 — 方案（待确认）

> 目标：在现有 7 场景的 Version cinématique 中，新增一个专门解释「这套业务如何运行、如何产生收入」的动画场景。
> 本轮只出方案 + Storyboard，不改 cinema.html / cinema.js / cinema.css。

![Storyboard 提案](web/wireframes/cinema-business-model.png)

---

## 1. 建议位置与结构

**新增 Scene 03 · « Le modèle » / « 业务模型 »，位于 Scene 02 Architecture 之后、Scene 03 RIMU 之前。**

叙事逻辑：

1. Constat → 为什么需要系统；
2. Architecture → 系统由什么组成；
3. **Le modèle → 系统如何运转、如何赚钱**；
4. RIMU → 落到每一天的使用；
5. Socle → 算力与主权底座；
6. 2031 → 结果；
7. Décision → 要做的选择。

**影响**：场景数由 7 → **8**；顶部指示从 00–06 改为 **00–07**；右侧 rail 增加一项。其他场景内容不变。

---

## 2. 一张图：三条业务回路 + 一个共同账本

不用「Business Model Canvas 九宫格」这种文字型框架，而用**可动的业务流向图**：

### 三条回路

| 回路 | 颜色 | 路径 | 说明 |
|---|---|---|---|
| **01 Capital** | 香槟金 | Chine investisseurs → Plateforme → Projets → Chantiers / emplois → Retour → réinvestissement | 投资进入项目，项目产生能力与回报 |
| **02 Marchandises** | 铜色 | Clusters Chine → Hub Nouakchott → Afrique de l'Ouest → RIMP | 货物经毛里塔尼亚分拨，支付走 RIMP |
| **03 Attention** | 绿色 | Contenus FR/AR/EN → RIMU audience → Créateurs → Live commerce → RIMP | 内容变成注意力，注意力变成交易和创作者收入 |

### 两个横向能力（作为底层轨道，不单独占一条主回路）

- **Paiements**：RIMP 是三条回路的共同收银台；
- **Données / IA**：Calcul 是推荐、审核、转译与交易风控的底座。

### 一个共同账本（右侧核心面板）

- RIMU · RIMP · Calcul 三个收入中心；
- 2031 总收入 **150–220 M USD**；
- 拆分 **RIMU 30–50 M / RIMP 90–140 M / Calcul 30–40 M**；
- 三个回路最终汇入同一个「caisse commune / 共同账本」，再回流到内容、项目和基础设施。

> 这样既表达“业务运行”，也避免把 5 条流硬塞成 5 条平行线；支付和数据作为横向能力被看见，但不抢叙事。

---

## 3. 动画时间线（自动循环 30–35 秒）

| 时间 | 画面 | 动效 |
|---|---|---|
| 0–4s | 进入场景，三条回路淡入，中心 RIMU/RIMP/Calcul 亮起 | 标题、路径描边、中心脉冲 |
| 4–12s | **Capital 回路**逐节点点亮 | 金色粒子从 Chine 流向 Plateforme → Projets → emplois → retour；数字逐步出现 |
| 12–20s | **Marchandises 回路**点亮 | 铜色粒子从 clusters → Nouakchott → Afrique de l'Ouest → RIMP；货物量/就业数字出现 |
| 20–28s | **Attention 回路**点亮 | 绿色粒子从 contenus → audience → créateurs → live commerce → RIMP；2,5 M MAU 等出现 |
| 28–33s | 三条回路同时流动，汇入右侧共同账本 | 粒子汇聚、150–220 M 计数器、三段收入条生长 |
| 33–35s | 短暂停留，回到 0 或等待用户 | 可暂停 / 重播 / 选回路 |

> 实际实现不必严格 35s；以「三条回路各约 7 秒 + 汇总 5 秒」为准，可按客户节奏调。

---

## 4. 交互

- **自动播放**只在场景进入视口时启动，离开暂停；不自动跳场景。
- **三个回路 tab**：Capital / Marchandises / Attention；点击只高亮该回路，其他淡化。
- **悬停节点**：显示 tooltip（名称 + 1 个数字 + 1 句说明），不打开抽屉。
- **暂停 / 重播**：底部小控制条；键盘可访问。
- **下一场景**：保留现有箭头/滚动；不强制滚动劫持。
- **reduced-motion**：直接显示完整静态图 + 三条回路图例 + 收入拆分，无粒子。
- **移动端**：三条回路改为**纵向三段**，每段横向滑动/点按切换；右侧账本折叠到下方；不使用横向溢出。

---

## 5. 数据与文案

- 所有数字只使用现有 data.js / 内容模型：2,5 M MAU、150–220 M USD、30–50 / 90–140 / 30–40 M、800 M–2 Md USD 货值、800 M–1,2 Md USD 投资意向、30–40 k 就业等。
- 不新增、不推导未经验证的「成本/利润率/市场份额」数字。
- 文案双语（FR / 中文），每节点 2–8 词；不出长句。
- 页脚保留「scénario ambitieux, chiffres non contractuels」的提示。

---

## 6. 技术实现（可行性高）

- 纯前端，无新依赖：内联 SVG + CSS + 原生 JS。
- 粒子沿 SVG path 运动可用：
  - CSS stroke-dashoffset 画路径；
  - SVG animateMotion 或 requestAnimationFrame 驱动小圆点；
  - 中心计数器/收入条用 CSS transform。
- 在 cinema.js 增加一个 scene 函数 + 数据数组；cinema.css 增加场景样式；rail / counter 从 7 改 8。
- 性能预算：SVG 节点 < 20，粒子 < 30；移动端降低粒子数；不会影响首屏。
- 打印/主站不受影响。

---

## 7. 三种落地方案

| 方案 | 内容 | 工期 | 评价 |
|---|---|---|---|
| **A · 新增 Scene 03（推荐）** | 8 场景，三条回路 + 共同账本，独立 30–35s 动画 | **1.5–2 天** | 叙事最清楚，最像“整体业务模型”；推荐 |
| B · 融入现有 Architecture | 不新增场景，在现有装配图上叠粒子与收入条 | 0.5–1 天 | 改动小，但 7 场景节奏不变，业务模型不够突出 |
| C · Business Model Canvas 九宫格 | 9 个模块 + 连线 + 动画 | 2–3 天 | 信息全，但文字多、偏咨询，不够 cinematic |

**建议选 A。** 如果担心场景变多，可先做 A 的静态 storyboard（本轮已给），确认后再投入 1.5–2 天实现。

---

## 8. 验收口径

- 新增 Scene 03 不影响原有 7 场景的内容、动画、语言切换。
- 1440 / 1024 / 390 无横向滚动；三条回路在移动端可读。
- 自动播放 30–35s，可暂停 / 重播 / 切换回路；离开场景暂停。
- reduced-motion 下静态图完整、无信息丢失。
- 数字与主站/data.js 一致；无新造数字。
- 0 console error；无外部请求。

---

## 9. 需要确认

1. 选 **A（新增第 8 场景，推荐）**、B（融入 Architecture）还是 C（Canvas）？
2. 三条回路用 **Capital / Marchandises / Attention** 是否准确？还是希望把 **Paiements / Données** 各拆成单独回路（5 条线，画面会更复杂）？
3. 自动循环 **30–35 秒**是否合适？
4. 是否需要在场景底部加「Voir le modèle complet → 主站 05 LES FLUX」的链接？
5. 移动端采用**纵向三段**（推荐）还是横向滑动？

> 确认后我再改 cinema.html / cinema.js / cinema.css；本轮没有改代码。
