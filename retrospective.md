# 抓小球小游戏 — 项目复盘回顾 (retrospective.md)

> 项目阶段：Git + 项目收尾
> 日期：2026-10-19
> 技术栈：原生 HTML5 + CSS3 + JavaScript（无框架）
> 总耗时：约 1 小时

---

## 🎯 项目目标

开发一款 2 分钟限时的网页抓小球小游戏：
- 点击蓝色小球 +2 分，点击空白 -1 分
- 允许负数分数，每次点击刷新小球位置
- 结束时弹出遮罩，支持再来一局

---

## 📦 Git 提交历史

```
db6fe33  feat: add game state machine, countdown, random ball spawn, click scoring, and restart logic
c801137  feat: add yellow background, flex layout, blue ball style, and overlay modal
d3502d9  feat: add HTML page skeleton with status bar, game area, and overlay
f4d8214  docs: add spec.md requirements and plan.md task breakdown
```

**4 次提交**，干净的开发节奏：文档 → 结构 → 样式 → 逻辑。

---

## ✅ 做得好的 (What went well)

| # | 经验 | 说明 |
|---|------|------|
| 1 | **先写 spec 再写代码** | 7 项需求细节逐项确认，避免了中途改需求返工 |
| 2 | **配置集中管理** | `GAME_CONFIG` 把时长/分值/尺寸放在顶部，改一处生效 |
| 3 | **状态机保护** | idle/playing/ended 三态，杜绝倒计时结束后仍能点击计分的竞态 |
| 4 | **事件委托** | game-area 统一绑 click，通过 `e.target` 区分命中 vs 空白，代码量减半 |
| 5 | **边界保护** | `spawnBall()` 计算 maxLeft/maxTop 后做 clamp，小屏不崩 |
| 6 | **每任务独立可验证** | T1 到 T7 逐步叠加，每步都可以手动打开浏览器验收 |

---

## ⚠️ 可以改进的 (What could be better)

| # | 问题 | 改进方向 |
|---|------|---------|
| 1 | **小球初始 hidden → display: block 的过渡** | CSS 里先写了 `display: none`，后来为了让用户能看到 DOM 存在又改成可见，T2 验收清单需要调整 |
| 2 | **padding = 4 硬编码** | 应该抽到 GAME_CONFIG，让边界内边距也可配置 |
| 3 | **分数视觉反馈不足** | 点中/点错没有飘字或颜色变化，负数分数也没红色提示 |
| 4 | **无键盘快捷键** | 可以加空格键快速开始/再来一局 |
| 5 | **代码评审发现的 CSS 冗余** | body 已有 overflow:hidden，game-area 又写了一次，CSS 冗余应该一开始就注意 |

---

## 🛠️ 技术亮点备忘

### 事件委托 vs stopPropagation

```js
// 正确做法：只绑一个监听器，用 e.target 判断
DOM.gameArea.addEventListener('click', (e) => {
    if (e.target === DOM.ball) { score += 2; }
    else { score -= 1; }
    spawnBall();
});
```

**为什么不用 stopPropagation？** 因为只有 game-area 有监听器，小球的点击冒泡上来正是预期行为。用 `stopPropagation` 反而要在小球上再绑一个监听器，代码更多。

### 随机坐标的边界保护

```js
let maxLeft = areaRect.width - BALL_SIZE - padding;
if (maxLeft < padding) maxLeft = padding; // 小屏兜底
const randomLeft = Math.floor(Math.random() * (maxLeft - padding + 1)) + padding;
```

**为什么加 1？** `Math.random() * n` 产生 [0, n)，要让 maxLeft 也能被取到需要 `n + 1`。

---

## 📁 最终文件清单

```
d:\gj\
├── index.html          # HTML 结构
├── style.css           # CSS 样式（Flex 布局、小球圆形、遮罩）
├── script.js           # JS 逻辑（状态机、倒计时、事件委托）
├── spec.md             # 需求规格文档
├── plan.md             # 任务拆解清单
├── review-report.md    # 代码评审报告
└── retrospective.md    # 本文档
```

**代码量**：HTML 40 行 + CSS 157 行 + JS 228 行 ≈ **425 行**

---

## 🚀 后续扩展方向

| 方向 | 难度 | 说明 |
|------|------|------|
| 分数飘字动画 | ⭐ | 点中/点错时 +2/-1 飘字动画 |
| 难度分级 | ⭐⭐ | 小球存活时间或尺寸动态变化 |
| 最高分 localStorage | ⭐ | 刷新后保留最高分记录 |
| 音效反馈 | ⭐ | 点中清脆音、点错低沉音 |
| 响应式适配 | ⭐⭐ | 手机/平板触控优化 |
| Canvas 重写 | ⭐⭐⭐ | 用 Canvas 2D 重写，性能更好 |

---

## 📚 课程收获

本次作业完整实践了《高级网页设计》课程的 Superpowers 工程规范：

> **需求研讨 → 任务拆解 → 测试先行 → 代码评审 → 人工验证 → Git 收尾**

核心体会：**每一步都比预想的耗时少**，但每一步都让后续步骤更顺利。跳过任何一步都会在后面补回来。

---

## 🏁 结论

**项目状态：✅ 成功交付**

- 所有 7 个开发任务手动验收通过
- 代码评审发现并修复 2 处 CSS 冗余
- Git 提交历史清晰，4 次分阶段提交
- 技术栈规范：原生 HTML + CSS3 + ES6
- 代码总量约 425 行，结构清晰，可维护性高

---

# V2 扩展复盘（2026-10-22）

## 🎯 V2 目标

1. 视觉吸引力增强：正确球脉动 + 得分飘字 + 倒计时危险警告（A+B+D 组合）
2. 新增错误小球（陷阱球）：黑色💀、开局 10 秒后登场、点中 -3 分

## ✅ V2 做得好的

| # | 经验 | 说明 |
|---|------|------|
| 1 | **T9 只加静态元素不动 JS** | 错误球 hidden 先行，V1 玩法零风险，视觉先验证 |
| 2 | **飘字机制先行（T10）** | 先在已有两种点击上验证，T11 错误球直接复用 `.danger` 变体 |
| 3 | **显隐机制评审抓出** | 正确球 display / 错误球 hidden 两套机制被 T13 评审发现并统一 |
| 4 | **双保险清理** | trapTimer 在 endGame 和 restartGame 双处清理，activateTrapBall 内部双重守卫，竞态无死角 |

## ⚠️ V2 可以改进的

| # | 问题 | 改进方向 |
|---|------|---------|
| 1 | **plan.md 插入位置错误** | V2 任务初次插入到了 V1 的 T6/T7 之间，破坏了文档结构，需剪切到末尾——长文档编辑应先确认锚点上下文 |
| 2 | **hover 缩放与脉动冲突** | 脉动动画天然覆盖 :hover transform，被迫移除 hover 效果——未来可用"外层定位 + 内层动画"双层 DOM 规避 |
| 3 | **危险阈值字面量 10** | 与 TRAP_DELAY 语义不同但数值相同，易误读为同一配置——已在评审报告中显式记录决策 |

## 🛠️ V2 技术亮点备忘

### 两球距离保护

```js
// 先刷正确球，再刷错误球（距离校验基于最新蓝球位置）
spawnBall();
if (gameState.trapActive) spawnWrongBall();

// 中心距 < 80px 重随，50 次上限后放宽防死循环
const distance = Math.sqrt(dx * dx + dy * dy);
```

### 飘字坐标计算

```js
// e.offsetX 在点球时相对小球而非容器，统一用 clientX 换算
const clickX = e.clientX - areaRect.left;
const clickY = e.clientY - areaRect.top;
```

### classList.toggle 双向切换

```js
// 一行搞定危险样式加/减，restart 无需额外清理
DOM.timerDisplay.classList.toggle('danger', gameState.timeLeft <= 10);
```

## 📊 V2 最终数据

- 新增任务：5 个（T9~T13），全部手动验收通过
- 代码评审：2 处问题（显隐不一致 + CSS 死代码），全部修复
- 代码量：JS 228→337 行，CSS 157→200 行，HTML 40→41 行
- Git：V2 分阶段提交（docs → html/css → js → 收尾）

## 🚀 后续扩展方向（V3 候选）

| 方向 | 难度 |
|------|------|
| 音效反馈（命中/踩雷/结束） | ⭐⭐ |
| 最高分 localStorage | ⭐ |
| 多个错误球随时间递增 | ⭐⭐ |
| 错误球缓慢漂移追踪 | ⭐⭐⭐ |
