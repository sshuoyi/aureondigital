# RIMU × 中毛数字合作平台 · 动态网页方案（工作目录）

> 基于法语源文件 `Plateforme_cooperation_numerique_sino-mauritanienne_RIMU_AI_version_francaise_enrichie.docx` 设计的动态提案网页完整方案。
> 日期：2026-11-09 · 项目：AUREON DIGITAL · 网页默认法语（FR），可切中文（ZH），阿语 RTL 预留第二期。

## 已实现的网站（5 周完整体验版）
> 用户已拍板：FR 默认 + ZH 切换、主品牌「Plateforme de coopération」+ RIMU · RIMP · IA、接受 7 条数据口径修正、默认 Synthèse、Mode Pitch 不自动弹、会议包、直接 5 周完整体验版。以下站点已按此实现并通过集成 QA。

| 入口 | 内容 | 运行/说明 |
|---|---|---|
| [`site/index.html`](site/index.html) | 9 章动态单页：业务抽屉、关系图/流故事、RIMU 手机演示、2031 数据、Mode Pitch、演讲者模式、方法学、FR/ZH | `cd web/site && python3 -m http.server 4173` → http://127.0.0.1:4173/ |
| [`site/dossier.html`](site/dossier.html) | A4 横向 18 页方案册：9 章摘要 + 6 张业务单页 + 决策摘要；`?lang=zh` 中文 | 浏览器打印 / `Imprimer / PDF` |
| [`site/dossier_FR.pdf`](site/dossier_FR.pdf) · [`site/dossier_ZH.pdf`](site/dossier_ZH.pdf) | 已生成 PDF：18 页 A4 横向，FR 1.19 MB / ZH 3.85 MB | 会议材料，含二维码 |
| [`site/README.md`](site/README.md) | 站点结构、功能、数据口径、已知占位、维护说明 | 交付文档 |
| [site/cinema.html](site/cinema.html) | **C · Cinematic 品牌版**：8 个全屏场景（Ouverture / Constat / Architecture / **Le modèle vivant：4 个写实子场景** / RIMU / Socle / 2031 / Décision），FR/ZH，进度轨 + 键盘翻页；入口在首页 Hero「Version cinématique」 | 同一静态服务器：http://127.0.0.1:4173/cinema.html |
| [Film & démo](site/screenshots/media-strip.png) | **主站新增**：3 min 48 介绍影片（Range seek 模态播放器）+ v0.app 系统演示预览/外链 | 同站：http://127.0.0.1:4173/（用 `python3 serve.py 4173` 启动以支持视频拖动） |
| 截图 | [Hero](site/screenshots/final-hero.png) · [RIMU 手机轮播](site/screenshots/final-ch-rimu-full.png) · [业务抽屉](site/screenshots/final-drawer.png) · [关系图](site/screenshots/final-ch-flux.png) · [2031 数据](site/screenshots/final-ch-impact.png) · [移动端](site/screenshots/final-mobile-hero.png) · [PDF 内页](site/screenshots/dossier/p03.png) | 验收/分享 |

## 先看这三个（方案文档）
| 文件 | 内容 | 用途 |
|---|---|---|
| [`PLAN_v1.md`](PLAN_v1.md) | **完整方案 v1.0**：目标/读者/叙事/14 区块逐块设计/三层点击/数据体系/动效/技术/排期/验收/待确认决策 | 给客户/团队看的方案主文件 |
| [`PLAN_v2_optimisation.md`](PLAN_v2_optimisation.md) | **优化方案 v2.0**：8 个评审发现 + P0/P1/P2 升级（9 章叙事、双层阅读、流故事、三赢、数据护栏、演讲者模式） | 回答「是否需要优化」 |
| [`wireframes/overview.png`](wireframes/overview.png) | 9 章 Storyboard 总览图（1800×2200 @2x） | 会议/微信快速讲清整体结构 |

## 附件规格（可执行到设计/前端）
| 文件 | 内容 | 负责人 |
|---|---|---|
| [`spec/BRIEF.md`](spec/BRIEF.md) | 团队总纲、数据基线、IA/交互/视觉/技术约束 | Lead |
| [`spec/content-model.md`](spec/content-model.md) | 14 区块逐块内容 + 六大业务线完整字段 + RIMU/AI/架构/路线图/收益/风险 + FR 文案 | content-analyst |
| [`spec/data-model.md`](spec/data-model.md) · [`spec/data-model.json`](spec/data-model.json) | 58 条 KPI 字典、10 条派生公式、7 条口径 QA、可直接读取的 JSON | content-analyst |
| [`spec/interaction-motion.md`](spec/interaction-motion.md) | 逐区块交互/动效规格、抽屉/关系图/手机/Mode Pitch、状态与降级 | experience-designer |
| [`spec/visual-system.md`](spec/visual-system.md) | 色彩/字体/栅格/组件/动效 token/打印版式 | experience-designer |
| [`spec/tech-architecture.md`](spec/tech-architecture.md) | Astro 7 SSG 选型、内容 schema、i18n、性能预算、打印 PDF、部署、排期、测试 | web-engineer |

## 关键结论（先读）
- **定位**：「Une plateforme. Trois souverainetés.」+「Relier deux pays. Équiper une nation.」——双边合作入口 + RIMU 超级应用 + 国家 AI 算力中心。RIMU 首批语言：**法语、阿拉伯语、英语**（本地语言二期）。
- **交互**：L1 一屏系统 → L2 业务抽屉（6 tab：Aperçu / Fonctionnement / Chiffres clés / Acteurs & flux / Feuille de route / Risques）→ L3 抽屉内下钻；URL 深链可分享、浏览器返回可关闭。
- **数据**：2031 年 2,5 M MAU、800 k DAU、2,8 M RIMP 账户、150–220 M USD 收入（占当前 GDP 1,3–1,9 %）、30–40 k 就业；所有数字带 Source / Dérivé / Hypothèse 徽章与方法学。
- **已验证口径矛盾（7 条）**：支付流量「数百亿美元」与 RIMP 收入不自洽、2,8 M 钱包与成年人口口径冲突、就业三层不可相加、60 %+ 网民循环依赖、算力两个 Phase 1、收入分项合计不闭合、2031 算力收入与长期服务收入重叠。页面展示用推荐统一口径，方法学保留差异说明。
- **优化建议（已采纳并实现）**：14 → 9 章 + Synthèse/Complet 双模式；关系图 3 段流故事；Impact 加 Mauritanie / Chine / Afrique de l'Ouest 三赢 tab；数据护栏（徽章 + 方法学）；会议包（演讲者模式 + 6 张业务单页 + 一页决策摘要）。

## 实施状态
- **已交付 5 周完整体验版**（静态站点 + 18 页 PDF），见上方「已实现的网站」。
- **C · Cinematic 已交付**：独立 cinema.html（8 场景，含 Le modèle vivant 4 个写实子场景，使用 4 段 8 秒无声循环 / FR-ZH / 动效 / 响应式），主站 Hero 提供入口；完整信息仍在主站与打印册。
- **Film & démo 已整合进主站**：Hero 下方 Film & Démo 区块，影片 3 min 48 + v0.app 演示；本地用 serve.py 以支持 HTTP Range 视频拖动。
- 后续迭代建议：真实域名/邮箱/二维码替换、母语法语终审、客户授权照片、可选阿语 RTL（第二期）。

## 版权与素材
- 视觉沿用 AUREON 品牌（深海军蓝 #071C36 / #0B1F3A、香槟金 #C9A25E、象牙白 #F6F0E4；Didot / Avenir Next 气质）。
- 未使用未授权照片；默认线稿地图 + 抽象图形。联系信息上线前需确认公开范围（见 README §3 / data-model AD-7）。
