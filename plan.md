# 抓小球小游戏 — 任务拆解清单 (plan.md)

> 项目阶段：Writing-Plans 任务拆解
> 生成日期：2026-10-19
> 前置依赖：spec.md 已确认
> 开发模式：串行，一次只推进一个任务，每个任务完成后等待手动验证通过再进入下一个

---

## 总览

```
T1 (HTML 骨架) → T2 (CSS 基础布局) → T3 (CSS 小球样式) →
T4 (JS 状态 + 倒计时) → T5 (JS 小球随机生成) → T6 (JS 点击计分 + 刷新) →
T7 (JS 结束遮罩 + 再来一局) → T8 (代码评审 + 收尾)
```

---

## T1 — 搭建 HTML 页面骨架

**目标**：创建 `index.html`，包含完整页面结构但不含任何样式和脚本

**交付文件**：`d:\gj\index.html`

**HTML 结构要求**：
- `<!DOCTYPE html>` + `<html lang="zh-CN">`
- `<head>`：`<meta charset="UTF-8">`、`<meta name="viewport">`、`<title>抓小球小游戏</title>`、外链 `style.css`
- `<body>` 包含三大区块：
  - 顶部状态栏 `<header class="status-bar">`：分数显示区、倒计时显示区、开始按钮
  - 游戏区域 `<main class="game-area">`：点击空白扣分的主区域（内部放小球）
  - 结束遮罩 `<div class="overlay" hidden>`：标题、最终得分、再来一局按钮（初始隐藏）
- 小球 `<div class="ball">` 放在 game-area 内部（初始不显示或显示为隐藏）
- 底部外链 `script.js`

**验收标准**（人工验证）：
1. 在浏览器打开 `index.html`，页面有顶部状态栏、游戏区域、结束遮罩（隐藏）三大区域结构
2. 无 CSS 时元素按默认样式排列，无 JS 时按钮点击无反应
3. 浏览器控制台无 HTML 解析错误

**前置任务**：无

---

## T2 — CSS 基础布局

**目标**：创建 `style.css`，实现页面整体布局、浅黄色背景、状态栏 Flex 布局、遮罩半透明黑色覆盖

**交付文件**：`d:\gj\style.css`

**CSS 实现要点**：
- `body`：margin 0，min-height 100vh，flex 纵向布局
- `.status-bar`：flex 横向排列，顶部固定，有内边距和边框底，浅色背景
- `.game-area`：flex 剩余空间铺满，`background-color: #FFF8DC`（Cornsilk 浅黄色），`position: relative`（为小球绝对定位做准备），光标 `pointer`
- `.overlay`：`position: fixed` 全屏覆盖，`background: rgba(0,0,0,0.6)` 半透明黑色，flex 居中，默认 `display: none`（或用 `hidden` 属性 + `[hidden] { display: none }`）
- 遮罩内部弹窗卡片：白色背景、圆角、居中、内边距、flex 纵向排列

**验收标准**（人工验证）：
1. 页面背景为浅黄色，占满整个视口
2. 顶部状态栏在顶部横向排列（分数 / 倒计时 / 按钮）
3. 游戏区域占据状态栏下方所有剩余空间
4. 手动去掉遮罩的 hidden 属性时，半透明黑色遮罩覆盖全屏，中间有白色弹窗卡片
5. 浏览器全屏/缩小窗口时布局不崩

**前置任务**：T1

---

## T3 — CSS 小球样式

**目标**：完善小球的视觉样式和状态栏文字样式

**交付文件**：修改 `d:\gj\style.css`

**CSS 实现要点**：
- `.ball`：`width: 60px; height: 60px; border-radius: 50%; background-color: #1E90FF; position: absolute; cursor: pointer;`，可加 `box-shadow` 增加立体感
- `.ball` 初始状态：`display: none` 或配合 JS 控制
- 状态栏数字加粗、字号醒目（分数和倒计时要容易看清）
- 开始按钮 / 再来一局按钮：`cursor: pointer`、hover 效果、圆角、内边距

**验收标准**（人工验证）：
1. 手动给 `.ball` 加 `style="display:block; top:100px; left:200px;"` 时，显示为 60px 蓝色圆形，在游戏区域内
2. 小球可以被鼠标悬停（光标变手型）
3. 状态栏数字和按钮样式清晰可读

**前置任务**：T2

---

## T4 — JS 状态管理 + 倒计时

**目标**：创建 `script.js`，实现游戏状态机（idle / playing / ended）和 2 分钟倒计时

**交付文件**：`d:\gj\script.js`

**JS 实现要点**：
- 配置对象 `GAME_CONFIG`：`GAME_DURATION_SECONDS: 120`、`BALL_SIZE: 60`、`SCORE_HIT: 2`、`SCORE_MISS: -1`
- 状态对象 `gameState`：`status: 'idle' | 'playing' | 'ended'`、`score: 0`、`timeLeft: 120`、定时器引用
- DOM 缓存对象 `DOM`：缓存所有需要操作的 DOM 元素（避免每次 getElementById）
- `startGame()`：初始化状态、启动倒计时、显示小球、按钮禁用
- `updateCountdown()`：每秒递减、更新显示、归零时调用 `endGame()`
- `formatTime(seconds)`：秒数转 `MM:SS` 字符串
- `endGame()`：状态置 ended、清除定时器、隐藏小球、显示遮罩

**验收标准**（人工验证）：
1. 点击"开始游戏"按钮，倒计时从 `02:00` 开始每秒递减
2. 倒计时到 `00:00` 时自动弹出结束遮罩
3. 结束后遮罩上"再来一局"按钮可点击，点击后倒计时重置为 `02:00` 并重新开始
4. 浏览器控制台无 JS 错误
5. 游戏未开始时点击游戏区域不触发任何逻辑（状态 idle 保护）

**前置任务**：T3

---

## T5 — JS 小球随机坐标生成

**目标**：实现小球在游戏区域内的随机坐标计算和渲染

**交付文件**：修改 `d:\gj\script.js`

**JS 实现要点**：
- `spawnBall()` 函数：计算游戏区域可用空间，生成随机 top/left 坐标，设置小球位置并显示
- 边界保护：可用空间 = 游戏区域尺寸 − 小球直径 − 内边距；若可用空间过小则做 clamp
- 每次调用都生成不同的随机位置（用 `Math.random()`）
- 小球坐标使用 `position: absolute` + `top`/`left`（T2 已设置 game-area 为 relative）

**验收标准**（人工验证）：
1. 每次 `spawnBall()` 调用后，小球都出现在游戏区域内的不同位置
2. 小球完整显示在浅黄色背景内，不会被顶部状态栏遮挡、不会溢出边界
3. 连续调用 10 次，小球每次位置都不同

**前置任务**：T4

---

## T6 — JS 点击计分 + 小球刷新

**目标**：实现点击小球 +2 分、点击空白 -1 分，每次点击都刷新小球位置

**交付文件**：修改 `d:\gj\script.js`

**JS 实现要点**：
- `.ball` 点击事件：`score += 2`，调用 `spawnBall()`
- `.game-area` 点击事件：用事件委托区分——如果点击目标是 `.ball`，走上面逻辑；否则 `score -= 1`，调用 `spawnBall()`
- 注意 **事件冒泡**：小球点击不要冒泡到 game-area 导致重复扣分（小球事件里 `e.stopPropagation()` 或判断 `e.target`）
- 分数允许负数，直接显示
- 每次分数变化更新 `DOM.scoreDisplay.textContent`

**验收标准**（人工验证）：
1. 游戏进行中，点击蓝色小球 → 分数 +2，小球消失并在新位置出现
2. 游戏进行中，点击游戏区域空白 → 分数 -1，小球消失并在新位置出现
3. 快速连续点击 5 次小球，分数正确累加（+10）
4. 分数可以变成负数（比如初始 0 连点空白 3 次 → -3）
5. 游戏结束（ended 状态）后，无论点哪里分数都不再变化

## T7 — JS 结束遮罩 + 再来一局

**目标**：完善游戏结束遮罩逻辑和"再来一局"功能

**交付文件**：修改 `d:\gj\script.js`

**JS 实现要点**：
- `endGame()` 里设置遮罩显示、更新最终得分文本、隐藏小球、清除倒计时
- `restartGame()`：重置分数为 0、重置倒计时 120、隐藏遮罩、调用 `startGame()`
- "再来一局"按钮绑定 `restartGame()`

**验收标准**（人工验证）：
1. 倒计时归零后，遮罩覆盖全屏，弹窗显示"游戏结束"和"最终得分: XX"
2. 结束时小球消失，分数冻结
3. 点击"再来一局"按钮，遮罩关闭、分数重置 0、倒计时重置 02:00、新小球出现
4. 可以连续游玩多局，每局之间完全重置

**前置任务**：T6

---

## T8 — 代码评审 + 收尾

**目标**：执行前端专项代码审查，修复发现的问题，输出评审报告

**审查维度**：
1. ✅ 变量命名（有意义、统一风格）
2. ✅ 代码可读性（函数职责单一、注释合理）
3. ✅ JS 事件机制（冒泡处理、绑定时机、事件委托合理性）
4. ✅ CSS 冗余（无重复规则、选择器不过度）
5. ✅ Flex 布局规范性（语义化、对齐正确）
6. ✅ 代码可维护性（配置集中、DOM 缓存、状态机清晰）

**交付物**：
- `review-report.md`（评审报告）
- 必要的代码修正（如有问题）

**前置任务**：T7

---

## 任务依赖关系图

```
T1 ──▶ T2 ──▶ T3 ──▶ T4 ──▶ T5 ──▶ T6 ──▶ T7 ──▶ T8
 HTML骨架   CSS布局  CSS小球  JS状态   JS小球   JS点击   JS遮罩   评审收尾
```

---

## 开发约束

- ✅ 每个任务完成后，**暂停等待你手动验证通过**，再进入下一个任务
- ✅ 每个任务独立可测试（即使后续功能未实现，当前任务的功能也能单独验证）
- ✅ 全程原生 HTML/CSS/JS，不引入任何框架或库
- ✅ 文件最终结构：`index.html` + `style.css` + `script.js`（三份）

---

## 待确认

> 请阅读以上任务拆解清单，如无异议请回复"确认"，我将从 **T1** 开始执行。
> 如需调整任务粒度、合并或拆分任务，请直接指出。

---

# V2 扩展任务拆解（2026-10-22，前置：spec.md 第 11 节已确认 + V1 全部完成）

## V2 总览

```
T9 (HTML+CSS 错误球元素 + 正确球脉动) → T10 (JS+CSS 得分飘字) →
T11 (JS 错误球生成 + 计分 + 距离保护) → T12 (JS+CSS 倒计时危险警告) →
T13 (代码评审 + 手动验证 + Git 收尾)
```

---

## T9 — 错误球 DOM/样式 + 正确球脉动动画

**目标**：在 HTML 中加入错误球元素并写好全部样式；给正确球加脉动动画。本任务**不改 JS 逻辑**（错误球默认隐藏，不影响现有玩法）

**交付文件**：修改 `d:\gj\index.html`、`d:\gj\style.css`

**实现要点**：
- `index.html`：在 `.ball` 后面加 `<div class="wrong-ball" id="wrongBall" hidden>💀</div>`
- `style.css`：
  - `.wrong-ball`：60px 圆形、`background: #2F4F4F`、`position: absolute`、flex 居中显示 💀（font-size 28px）、`cursor: pointer`、与 `.ball` 同级阴影；`[hidden]` 时 `display: none`
  - 正确球脉动：`@keyframes ballPulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.15) } }`，`.ball` 上 `animation: ballPulse 1.2s ease-in-out infinite`
  - 错误球**不加**脉动（视觉区分）

**验收标准**（人工验证）：
1. F5 刷新，蓝色小球有缓慢的放大缩小脉动效果
2. 页面上看不到错误球（hidden 生效）
3. DevTools 删掉 `#wrongBall` 的 `hidden` 属性 → 出现黑色圆形 + 居中 💀，且**不脉动**
4. 现有玩法不受影响：开始游戏、点小球 +2、点空白 -1、倒计时归零弹遮罩全部正常
5. Console 无 error

**前置任务**：V1 T1~T8 已完成

---

## T10 — 得分飘字（+2 绿 / -1 橙）

**目标**：实现点击位置的飘字反馈。本任务只接**现有两种点击**（正确球 +2、空白 -1），错误球的 -3 在 T11 接入

**交付文件**：修改 `d:\gj\style.css`、`d:\gj\script.js`

**实现要点**：
- `style.css`：`.float-text` 基础样式（`position: absolute`、`font-size: 24px`、`font-weight: bold`、`pointer-events: none`、z-index 高于小球）+ `.float-text.plus` 绿色 `#228B22` / `.float-text.minus` 橙色 `#FF8C00`；`@keyframes floatUp`：translateY(0)→translateY(-60px)、opacity 1→0，时长 0.8s
- `script.js`：新增 `showFloatText(x, y, text, type)` 函数——在 game-area 内创建 `.float-text` 元素，用点击的 `offsetX/offsetY` 定位，监听 `animationend` 后 `remove()`
- 在现有点击处理里调用：命中球 → `showFloatText(..., '+2', 'plus')`；空白 → `showFloatText(..., '-1', 'minus')`
- 注意：点击事件拿坐标用 `e.offsetX / e.offsetY`（相对 game-area），点在小球上时用事件冒泡到 game-area 的坐标或用 `e.clientX - areaRect.left`

**验收标准**（人工验证）：
1. 点开始游戏 → 点蓝色小球 → 点击位置飘出绿色 `+2`，上升并淡出消失
2. 点空白 → 飘出橙色 `-1`
3. 连点 10 次，每次都有飘字且不堆积（旧飘字自动消失）
4. DevTools → Elements 观察：飘字动画结束后 DOM 中无残留 `.float-text`
5. 分数逻辑不变（球 +2 / 空白 -1），Console 无 error

**前置任务**：T9

---

## T11 — 错误球生成逻辑 + 点击 -3 + 距离保护

**目标**：错误球在开局 10 秒后登场，点它扣 3 分（红色飘字），任何点击后两球一起刷新

**交付文件**：修改 `d:\gj\script.js`

**实现要点**：
- `GAME_CONFIG` 增加：`TRAP_DELAY: 10`（秒）、`TRAP_PENALTY: 3`、`MIN_BALL_DISTANCE: 80`、`MAX_SPAWN_RETRY: 50`
- 状态增加 `trapActive: false`；`startGame()` 里启动一个 10 秒 `setTimeout` → 若仍在 playing 且剩余时间 ≥10s → `trapActive = true` + `spawnWrongBall()`
- `spawnWrongBall()`：随机坐标 → 计算与正确球中心距，< 80px 重随，最多 50 次后放宽；写入 left/top，移除 `hidden`
- 点击处理改为三分支：`e.target === ball` → +2 绿飘字；`e.target === wrongBall` → -3 红飘字（`.float-text.danger`，`#DC143C`）；否则 → -1 橙飘字。三分支都调用 `spawnBall()` + `if (trapActive) spawnWrongBall()`
- `endGame()`：错误球加回 `hidden`，清除 10 秒 timeout（防结束后冒出）
- `restartGame()`：`trapActive = false`，错误球 hidden，重新走 startGame 流程
- 剩余时间 < 10 秒时不激活错误球（timeout 回调里判断 `timeLeft >= 10`）

**验收标准**（人工验证）：
1. 开始游戏后前 10 秒：只有蓝球，无黑球
2. 约第 10 秒：黑色💀球出现，且与蓝球明显分开（不重叠不贴边）
3. 点黑球 → 分数 -3，红色 `-3` 飘字，**两球都**跳到新位置
4. 点蓝球/空白 → 两球同样都刷新
5. 连续观察 20 次刷新：两球从不重叠（肉眼无接触）
6. 结束遮罩出现时黑球消失；再来一局后前 10 秒同样无黑球
7. Console 跑 `endGame()` 提前结束，黑球不会再冒出来；Console 无 error

**前置任务**：T10

---

## T12 — 倒计时危险警告（≤10 秒红色闪烁）

**目标**：剩余时间 ≤10 秒时倒计时变红并闪烁，时间充裕时保持正常

**交付文件**：修改 `d:\gj\style.css`、`d:\gj\script.js`

**实现要点**：
- `style.css`：`.timer.danger` → `color: #DC143C` + `@keyframes timerBlink { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }` 1s 无限循环
- `script.js`：倒计时 tick 里（或 `updateTimerDisplay()`）判断 `timeLeft <= 10` → `timerDisplay.classList.add('danger')`，否则移除；`restartGame()` 里确保移除

**验收标准**（人工验证）：
1. 开始游戏，倒计时 > 10 秒时颜色正常（不红不闪）
2. 到 00:10 瞬间：倒计时变红并开始闪烁
3. 归零弹遮罩后，再来一局 → 倒计时恢复 02:00 正常颜色不闪烁
4. Console 无 error

**前置任务**：T11

---

## T13 — V2 代码评审 + 手动全链路验证 + Git 收尾

**目标**：前端专项代码评审（命名/可读性/事件机制/CSS 冗余/Flex 规范/可维护性），输出评审报告并修复问题；全链路手动验证；Git 分阶段提交；更新 retrospective.md

**交付文件**：`review-report-v2.md`（或追加到 review-report.md）、修改后的代码、更新的 `retrospective.md`

**验收标准**：
1. 评审报告输出，问题全部修复
2. 完整游戏流程手动测试通过（开局热身 10 秒 → 黑球加入 → 混合点击 → 危险倒计时 → 结束 → 再来一局 ×2）
3. Git 分阶段提交完成（docs → html/css → js 逻辑 → 收尾）
4. retrospective.md 追加 V2 复盘

**前置任务**：T12

---

## V2 待确认

> 请阅读 V2 任务拆解（T9~T13），如无异议请回复"确认"，我将从 **T9** 开始执行。
