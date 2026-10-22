# V2 前端代码评审报告 (review-report-v2.md)

> 评审范围：V2 扩展（T9~T12）改动后的 index.html / style.css / script.js
> 评审日期：2026-10-22
> 评审结论：**2 处问题已修复，0 遗留，通过**

---

## 审查维度结果

| # | 维度 | 结论 | 说明 |
|---|------|------|------|
| 1 | 变量命名 | ✅ 通过 | `trapActive / trapTimer / spawnWrongBall / showFloatText` 语义明确，风格与 V1 统一 |
| 2 | 代码可读性 | ✅ 通过 | 函数职责单一（activateTrapBall / randomPosition / spawnWrongBall 各司其职），注释到位 |
| 3 | JS 事件机制 | ✅ 通过 | 仍保持 game-area 单监听器事件委托，`e.target` 三分支判断，无重复绑定、无冒泡误伤 |
| 4 | CSS 冗余 | ⚠️→✅ | 发现 1 处死代码（M2），已修复 |
| 5 | Flex/Grid 布局 | ✅ 通过 | 错误球 💀 用 flex 居中，语义正确；无滥用 |
| 6 | 代码可维护性 | ⚠️→✅ | 发现 1 处显隐机制不一致（M1），已修复 |

---

## 已修复问题

### M1 — 两球显隐机制不一致（可维护性）

- **位置**：[script.js](file:///d:/gj/script.js) `spawnBall()` / `endGame()`
- **问题**：正确球用 `style.display='block'/'none'` 内联样式控制显隐，错误球用 `hidden` 属性——同一语义两套机制，后续维护容易改一处漏一处
- **修复**：统一为 `hidden` 属性。`.ball` 的 CSS 无 display 声明，浏览器默认 `[hidden]{display:none}` 生效，行为完全不变
- **改动**：`spawnBall()` 改 `removeAttribute('hidden')`；`endGame()` 改 `setAttribute('hidden','')`

### M2 — `.float-text` 基础 transform 死代码（CSS 冗余）

- **位置**：[style.css](file:///d:/gj/style.css) `.float-text`
- **问题**：基础声明 `transform: translate(-50%,-50%)` 与 `floatUp` 动画 0% 帧完全相同，动画立即执行，基础声明永远不生效
- **修复**：删除该行，定位完全由关键帧承担

---

## 已确认不改的设计决策

| 项 | 说明 |
|----|------|
| `padding = 4` 硬编码 | V1 复盘已记录，两球共用 `randomPosition()` 后只在一处出现，影响可控 |
| 危险阈值 `<= 10` 字面量 | 与 `TRAP_DELAY: 10` 语义不同（登场时机 vs 警告时机），刻意不共用配置，防止改一误二 |
| 错误球不脉动 | spec 明确要求的视觉区分设计 |

---

## 亮点记录

1. **`activateTrapBall()` 双重守卫**：status 非 playing + 剩余时间不足双重判断，配合 `endGame/restartGame` 双处清 timer，竞态无死角
2. **点击刷新顺序**：先 `spawnBall()` 再 `spawnWrongBall()`，距离保护基于最新蓝球位置，逻辑严密
3. **`classList.toggle('danger', cond)`**：一行实现双向切换，restart 无需额外清理
4. **飘字 `animationend` 自动 remove**：无 DOM 泄漏风险
