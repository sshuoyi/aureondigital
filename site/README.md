# Site dynamique — Plateforme de coopération · RIMU · RIMP · IA

> 5 周完整体验版 + v3 Visual-first 优化 + C · Cinematic 品牌版的静态站点。法语默认（FR），中文切换（ZH）；单页 9 章 + 业务抽屉 + 数据可视化 + Mode Pitch + 演讲者模式 + A4 打印册。
> v3 重点：默认 Synthèse 只保留「视觉 + 一个数字 + 一行结论」，长文收进 Complet / 抽屉 / 方法学；新增系统总图、决策瓦片、风险仪表、AI 用例卡、AUREON 线性图标库。
> 日期：2026-11-09 · AUREON DIGITAL · 素材与数据见 `../spec/` 与 `../PLAN_v1.md` / `../PLAN_v2_optimisation.md`。

## 运行

无需构建、无外部依赖（字体使用系统字体栈，不加载 CDN）：

```bash
cd web/site
python3 serve.py 4173
# 打开 http://127.0.0.1:4173/
```

> 视频拖动 / seek 需要 HTTP Range 支持：请用 `serve.py` 启动；`python3 -m http.server` 仍能打开站点，但视频可能无法拖动。

直接双击 `index.html` 也可离线打开（全部脚本为本地经典脚本，无 fetch）。推荐用本地服务器以获得稳定的相对路径行为。

## 页面与交互

- **9 章**：Hero / Pourquoi / Le système / RIMU / IA & Calcul / Flux / Trajectoire / Impact / Décision。
- **真实双层阅读**：默认 Synthèse 只显示短结论 / 视觉 / 关键数字，长段落、手风琴全文、方法学说明隐藏；Header「Complet」恢复全部内容。
- **v3 视觉优先组件**：Système 三行装配总图（3 支柱 / 6 业务 / 4 层）、Pourquoi 图标 + 大数字卡、Décision 5 瓦片 + 5 风险仪表、IA 四层堆叠 + 3 用例卡、RIMU 信任图标徽章；图标为本地 AUREON 线性 SVG（icons.js），短文案为独立 short-copy.js（FR/ZH）。
- **C · Cinematic 品牌版**：独立 `cinema.html`，8 个全屏场景（Ouverture / Constat / Architecture / **Le modèle vivant（4 个写实子场景）** / RIMU / Socle / 2031 / Décision），支持 FR/中文、进度轨、键盘翻页、顶部场景指示与 reduced-motion；入口在首页 Hero 的「Version cinématique / 沉浸版」。
- **Film & démo**：Hero 下方新增「La plateforme, en mouvement」：3 min 48 的影片（原生播放器、Range seek、全屏、声音）与 v0.app 交互式演示预览；影片/演示均用模态层打开，演示可跳转新标签页。
- **模式入口**：`?tour=1` 启动 3 分钟 Mode Pitch；`?present=1` 演讲者模式；`?lite=1` 低带宽模式。
- **业务抽屉**：点击支柱 / 六业务 / 四层 / 关系图节点 → 右侧抽屉（移动端底部 sheet），6 个 tab：Aperçu / Fonctionnement / Chiffres clés / Acteurs & flux / Feuille de route / Risques；URL 深链如 `#/business/projets`、`#/pillar/calcul`、`#/layer/middleware`；Esc / overlay / 浏览器返回关闭。
- **数据可视化**：Hero 粒子网络、MAU/DAU 曲线、2031 收入区间图、13 节点 / 35 边的五类流关系图、3 段流故事、西非地图、计数器（FR/ZH locale 格式）。
- **五类流播放**：Isoler 按钮在无选中节点时进入「选择节点」模式（按钮变「Choisir un nœud…」，图/矩阵光标提示，点节点后聚焦，再点退出）；3 段流故事，每步约 3.2 秒；播放时顶部出现 **HUD 播放条**（进度、暂停、重播、关闭），桌面与移动端一致；移动端点击故事会自动滚动到播放器，并随高亮节点**横向平移关系图**；关系图/矩阵视图互斥切换。
- **RIMU 手机轮播**：使用参考文件 `中毛数字平台+RIMU平台界面图.docx` 中的 **6 张手机界面截图**（已裁剪状态栏、转 WebP，`assets/img/rimu/`）；支持左右箭头、圆点、触摸滑动、键盘 ←/→、自动轮播与暂停；模块 chip 与「一天」场景会跳到对应截图；下方标注「Aperçu de l'interface de démonstration」。
- **语言**：站点界面 FR 默认，右上「中文」切换；`localStorage` 记忆选择。**RIMU 产品语言**：首批支持 **法语、阿拉伯语、英语**；哈桑尼亚、富拉、索宁克、沃洛夫等本地语言列入二期（页面文案、数据与方案册已同步）。
- **打印**：Header「Dossier PDF」→ `dossier.html`（A4 横向 18 页主册 + 6 张业务单页 + 决策摘要；FR/ZH 版本及 PDF 由 `dossier_FR.pdf` / `dossier_ZH.pdf` 提供）。
- **可分享**：OG 封面 `screenshots/og-cover.png`；深链复制；演讲者模式快捷键（←/→ 章节、B 黑屏、Esc 退出）。

## 文件结构

```
web/site/
├── index.html                 单页应用入口（9 章 + 抽屉 + Pitch + 方法学）
├── cinema.html                C · Cinematic 品牌版（8 个全屏场景）
├── serve.py                   静态服务器 + HTTP Range（视频 seek）
├── dossier.html               A4 横向打印册（由 print-builder 生成）
├── dossier_FR.pdf / ZH.pdf    打印 PDF（如已生成）
├── assets/
│   ├── css/theme.css          设计 token / 组件 / 响应式（visual-builder）
│   ├── css/layout.css         9 章 section 级栅格（Lead）
│   ├── css/viz.css            图表/关系图/地图专用样式（viz-builder）
│   ├── css/visual-first.css   v3 视觉优先组件 / 模式 / 动效 / 响应式（visual-builder）
│   ├── css/v3-integration.css v3 集成层：残留长文裁剪 / 图标排版 / 动画速度（Lead）
│   ├── css/cinema.css         C · 8 场景 / 进度轨 / 响应式 / 动效（Lead）
│   ├── css/media.css          影片 & 演示区块 / 模态层（Lead）
│   ├── css/print.css          A4 打印版式（print-builder）
│   ├── js/content.js          FR/ZH 全部文案（window.RIMU_CONTENT）
│   ├── js/short-copy.js       v3 Synthèse 短文案层（FR/ZH 镜像，window.RIMU_SHORT）
│   ├── js/icons.js            v3 AUREON 线性图标库（40 个，window.RIMU_ICON_PATHS）
│   ├── js/cinema.js           C · 8 场景渲染 / 导航 / FR-ZH / 动效（Lead）
│   ├── js/data.js             KPI/业务/关系/路线/风险数据（来自 spec/data-model.json）
│   ├── js/viz.js              Hero canvas / 计数器 / 3 图 / 关系图 / 地图（window.RIMU_VIZ）
│   ├── js/app.js              渲染 / i18n / 路由 / 抽屉 / Pitch / Presenter / 方法学
│   ├── js/dossier.js          打印册渲染
│   ├── img/logo-mark*.svg     AUREON 标志
│   ├── img/video-poster.jpg   影片封面（1280×720）
│   ├── img/demo-preview.jpg   交互式演示预览
│   ├── img/cinema/*.jpg       C · Le modèle vivant 的 4 张影片海报（video poster）
│   ├── img/rimu/*.webp        RIMU 手机界面截图（6 张，来自参考 docx，已裁剪/压缩）
│   ├── video/plateforme-intro.mp4  介绍影片（3 min 48，H.264）
│   └── video/cinema/*.mp4     C · Le modèle vivant 的 4 段 8 秒无声循环
└── screenshots/               验收截图（final-*.png、og-cover.png 等）
```

## v3 视觉分层与文字量（实测）

| 模式 | FR | ZH |
|---|---:|---:|
| Synthèse（默认） | 9 161 字符 / 1 541 词 | 3 860 字符 / 748 词 |
| Complet | 18 074 字符 / 2 886 词 | 6 538 字符 / 1 004 词 |

- 默认可见文字较旧版 **−49%（FR）/ −41%（ZH）**；减少的主要是段落式长文，保留的是标题、结论、数字、图例与操作标签。
- 长文没有删除：Complet、六 tab 抽屉、方法学、打印册仍保留全部原文。
- 低带宽 / reduced-motion 下动画关闭、内容直接显示；打印强制使用完整层。
- MAU 图 y 轴紧凑刻度已修复（500 k / 1 M / 1,5 M / 2 M / 2,5 M）。

## Film & démo（主站）

- **影片**：plateforme-intro.mp4（39 MB，1280×720，3 min 48，H.264/AAC）。点击影片卡或「Voir le film」打开模态播放器；关闭时暂停并清空播放器。
- **演示**：v0.app 地址 https://v0-project-iota-ecru.vercel.app/；主站以预览卡 + 模态层展示，外部应用无法可靠 iframe 时始终提供「Ouvrir dans un nouvel onglet」。
- **入口**：Hero 下方 Film & Démo 区块；海报卡、主 CTA、演示卡三处均可打开。
- **Range**：本地请用 serve.py；生产静态托管（Cloudflare/Vercel/Netlify）原生支持 Range，视频可拖动。

## C · Cinematic（品牌发布版）

- URL：cinema.html；8 个全屏场景，默认 FR，右上按钮切中文。
- 交互：右侧场景轨、顶部进度条、顶部场景指示、←/→ 与 PageUp/PageDown 翻页、滚轮/触控正常滚动；右上「Site complet」回主站。
- 视觉：自定义双大陆网络 Hero、四堵点大数字、三行系统装配图、**Le modèle vivant：4 个写实子场景（Capital / Marchandises / Showroom / Paiements；4 段 8s 无声循环，自动 10s/页 + 4 tab + 暂停/重播）**、3 台手机、四层主权堆叠、2031 数字 + 西非 hub、5 项决策收束。
- 素材：4 段 8 秒无声循环 assets/video/cinema/*.mp4（muted / loop）；4 张影片海报作 poster（assets/img/cinema/*.jpg）；Showroom 手机界面使用 RIMU Market 截图。
- 降级：prefers-reduced-motion / 无外部依赖；移动端 390 单列重排。
- 文字：8 场约 4 300 字符，是品牌叙事版，不是完整信息版；完整信息仍在主站 / Complet / 打印册。

## 数据与口径

- 所有数字来自 `../spec/data-model.json` 的 58 条 KPI；页面数字只读 `displayFR/displayZH`，不手写。
- 2031 数据为「scénario ambitieux」；Source / Dérivé / Hypothèse 徽章 + 方法学弹层（含 7 条口径 QA：支付流量统一 15–25 Md USD/an、2,8 M 钱包按累计账户、就业三层不可相加、60%+ 网民循环依赖、算力两个 Phase 1、收入分项合计不闭合、算力长期收入口径）。
- 外部人口/网民参考值仅在方法学出现，待客户最终确认。

## 已知占位/上线前确认

- **联系入口**：`mailto:contact@aureondigital.mr` 为占位（未验证），上线前替换为确认邮箱/表单；个人手机、微信、Gmail 不默认公开（见 `../spec/interaction-motion.md` A-16）。
- **二维码**：打印册中的二维码为占位（指向站点 URL），上线前用真实域名生成。
- **域名**：建议部署到 `platform.aureondigital.mr` 或客户指定域名；静态托管即可（Cloudflare Pages / Vercel / 本地服务器）。
- **照片/合作方 logo**：当前未使用未授权照片，采用线稿/抽象图形；如客户提供授权素材可替换 Hero/地图背景。
- **手机界面截图**：RIMU 轮播使用参考 docx 中的 6 张演示界面（英文/未本地化、含美元价格），已标注「interface de démonstration」；正式对外前建议替换为 RIMU 本地化（FR/AR）真实截图。
- **PMU**：AI 生成的法语文案已经过内部审校，正式对外前建议母语法律/传播审校。

## 验收

- Film & démo 截图：screenshots/media-strip.png、media-video-modal.png、media-demo-preview-modal.png、media-mobile.png、media-mobile-video2.png。
- C 截图：screenshots/cinema-final-hero.png、cinema-final-constat.png、cinema-final-systeme.png、cinema-modele-video-capital2.png、cinema-modele-video-port2.png、cinema-modele-video-showroom2.png、cinema-modele-video-payment2.png、cinema-modele-video-mobile.png、cinema-modele-video-zh.png、cinema-final-rimu.png、cinema-final-ia.png、cinema-final-impact.png、cinema-final-decision.png、cinema-final-390.png。

- v3 截图：screenshots/v3-final-hero.png、v3-final-pourquoi.png、v3-final-systeme.png、v3-final-ia.png、v3-final-impact2.png、v3-final-decision2.png、v3-final-mobile-rimu.png、v3-final-mobile-systeme.png、v3-final-mobile-decision.png。

- 0 console error；桌面 1440 / 移动 390 无横向滚动；抽屉 6 tab、深链、语言切换、Pitch/演讲者模式均可用。
- 性能预算：JS 约 55 KB gzip（app+content+data 之外 viz 约 28 KB），首屏资源 < 1 MB；无外部字体/CDN。
- 截图：`screenshots/final-hero.png`、`final-ch-systeme.png`、`final-drawer.png`、`final-ch-flux.png`、`final-ch-impact.png`、`final-mobile-hero.png`、`final-pitch.png` 等。

## 维护

1. 改文案：`assets/js/content.js`（FR/ZH 镜像键）。
2. 改数字：`assets/js/data.js`（从 `../spec/data-model.json` 生成，建议改源再重生成）。
3. 改视觉：`theme.css` token；改版式：`layout.css`；打印：`print.css`。
4. 新业务/新抽屉内容：`data.js` entity + `content.js drawerExtra`；无需改组件。
