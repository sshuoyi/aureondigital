# Cinematic · 写实版业务模型「4 个子场景」— 方案与效果图（待确认）

> 方向：不做矢量世界，改用提供影片中的写实人物/港口/手机/市场画面作为主视觉，叠加极简信息图形。
> 四个子场景放进新的 Scene 03 (« Le modèle »)；本轮只出效果图与方案，不改 cinema 页面代码。

## 1. 四个子场景

### 01 Capital · 会议室

![Real capital](web/wireframes/real-capital.png)

- 用影片中中毛双方会议画面
- 人物、项目、就业、回报
- 数据：800 M–1,2 Md USD 投资意向；5–8 个项目；30–40 k 就业

### 02 Marchandises · 港口/卡车

![Real port](web/wireframes/real-port.png)

- 港口吊机、集装箱、工人、卡车
- 路径：Cargos → Port/Douane → Camions/Hub → Afrique de l'Ouest
- 数据：800 M–2 Md USD/an；5 个市场；1 个 Nouakchott hub

### 03 Showroom · RIMU

![Real showroom](web/wireframes/real-showroom.png)

- 市场/展台人物 + 手机中的 RIMU Shop
- 路径：Acheteur → Showroom → RIMU → RIMP
- 数据：15–60 s；FR/AR/EN；Live · Shop · Jobs

### 04 Paiements · 收入回路

![Real payment](web/wireframes/real-payment.png)

- 人物使用手机的真实画面
- 右侧共同账本：RIMU 30–50 / RIMP 90–140 / Calcul 30–40 M；合计 150–220 M USD
- 数据：2,5 M MAU；2,8 M comptes RIMP；40 min/jour

> 这四张是 photo-based 效果稿，用影片截帧 + 信息图形叠加制作；人物和场景来自用户提供的影片，不是矢量重绘。

---

## 2. 在 Cinematic 里的组织方式

建议在 Architecture 与 RIMU 之间新增 Scene 03 · Le modèle，内部由 4 个子场景组成：

| 时间 | 子场景 | 镜头 |
|---|---|---|
| 0–10s | Capital | 会议室慢推 + 金色路径从投资方流向项目 |
| 10–20s | Marchandises | 港口画面 + 卡车/集装箱信息层；路径横移 |
| 20–30s | Showroom | 市场人物 + RIMU 手机界面浮出；商品/价格/支付节点 |
| 30–40s | Paiements | 手机人物 + 金币回流 + 收入条 / 共同账本 |
| 40–45s | 收束 | 四场景缩略/总账定格；可重播 |

- 场景总数 7 → 8，顶部指示 00–07。
- 子场景可自动播放，也可点 4 个 tab 切换。
- 进入场景才播放；离开暂停。
- 底部加 « Essayer la démo → » 直接打开 v0.app。
- reduced-motion 下四张静态图 + 数字全部可见。

---

## 3. 写实程度方案

| 方案 | 素材 | 动效 | 工期 |
|---|---|---|---|
| A · 剧照 + 信息层（推荐先做） | 4 张影片截帧，电影调色 | 2.5D 轻推、路径、数字、金币、手机 UI 浮出 | 2–3 天 |
| B · 短循环视频 + 信息层 | 从影片剪 4 段 6–8 秒无声循环 | 人物/卡车/吊机真实运动 + overlay | 3–4 天 |
| C · 重新拍摄/生成写实素材 | 新拍摄或新生成 | 完全可控的写实镜头 | 不在此次范围 |

建议先做 A。四张效果图已经能看出方向；确认后再决定是否把其中 2–3 个镜头换成 B 的短循环视频，更有“活着”的感觉。

---

## 4. 技术实现

- 剧照用 WebP/JPEG；CSS 做电影调色、暗角、轻微 Ken Burns。
- 信息层用 HTML/CSS/SVG：路径、节点、金币、手机 UI 卡片。
- 可选 B：用 avconvert 从现有 MP4 剪 4 段 720p 6–8 秒无声循环；场景进入后再加载，离开暂停。
- 不引入 Three.js/外部库；移动端 4 段纵向切换；性能可控。

---

## 5. 风险 / 需要提前确认

1. 影片是 AI 生成的写实素材：人物、港口、市场是示意性写实，不是真实现场；需客户确认可用于对外发布。
2. 影片中没有真正的 Mauritanian showroom；Showroom 子场景用电子市场 + 平板/手机画面代替，需确认是否接受，或后续补拍/补生成。
3. 剧照 720p 全屏会有轻微软化；电影调色/暗角可掩盖，但大屏 4K 需要更高分辨率素材。
4. 人物出现涉及肖像/版权：影片为用户提供，需确认素材权利。

---

## 6. 需要确认

1. 这 4 个子场景和顺序是否认可？
2. 选 A（剧照 + 信息层，推荐）还是 B（短循环视频）？
3. Showroom 用电子市场 + RIMU 手机代替是否可行？
4. 新增第 8 个场景 + 自动 40–45 秒、4 个 tab，是否接受？
5. 场景里是否加「Essayer la démo →」？

> 已确认并实现：Scene 03 « Le modèle vivant » 已加入 cinema.html（8 场景）；4 个写实子场景、自动 10s/页 + 4 tab、暂停/重播、FR/ZH、reduced-motion 降级。
> 后续升级：4 张剧照已替换为从影片剪出的 4 段 8 秒无声循环（assets/video/cinema/*.mp4，muted/loop），并保留海报 fallback。
