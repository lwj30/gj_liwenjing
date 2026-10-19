# 抓小球小游戏 — 前端代码评审报告

> 项目阶段：T8 Code-Review
> 评审日期：2026-10-19
> 评审范围：index.html / style.css / script.js

---

## 评审总览

| 维度 | 评分 | 说明 |
|------|------|------|
| 变量命名 | ⭐⭐⭐⭐⭐ | 风格统一、语义清晰 |
| 代码可读性 | ⭐⭐⭐⭐⭐ | 分节清晰、JSDoc 完整、注释恰当 |
| JS 事件机制 | ⭐⭐⭐⭐⭐ | 事件委托正确、状态保护到位 |
| CSS 冗余 | ⭐⭐⭐⭐ | 2 处可消除的小冗余 |
| Flex/Grid 布局 | ⭐⭐⭐⭐⭐ | 规范、对齐正确、语义化 |
| 代码可维护性 | ⭐⭐⭐⭐⭐ | 配置集中、状态机清晰、DOM 缓存 |

**总体评价：✅ 通过，需修复 2 处 Medium 级别问题**

---

## 逐维度详情

### 1. ✅ 变量命名（优秀）

| 项目 | 评价 |
|------|------|
| 风格统一 | JS：GAME_CONFIG 大写下划线、gameState/DOM 驼峰；CSS：kebab-case（status-bar, game-area） |
| 语义清晰 | spawnBall / formatTime / updateCountdown 都是动词开头，一眼看懂 |
| 无模糊命名 | 无 `temp` / `data` / `val` 等模糊命名 |

### 2. ✅ 代码可读性（优秀）

- 代码分节清晰：配置对象 → 状态对象 → DOM 缓存 → 事件绑定 → 核心逻辑 → UI 辅助
- 每个函数有 JSDoc 注释
- 关键逻辑块有中文注释解释意图
- 缩进、空行一致

### 3. ✅ JS 事件机制（优秀）

| 检查项 | 状态 |
|--------|------|
| 事件委托合理性 | ✅ game-area 统一绑 click，通过 `e.target === DOM.ball` 区分命中/空白 |
| 事件冒泡处理 | ✅ 小球冒泡到 game-area 正是预期行为，只有一个监听器，无需 `stopPropagation()` |
| 绑定时机 | ✅ DOMContentLoaded 之后才 cacheDom + bindEvents |
| 监听器清理 | ✅ 本项目无动态解绑需求（只有两个 button 是永久绑定），无需 removeEventListener |

### 4. ⚠️ CSS 冗余（2 处 Medium）

#### 问题 M-1：body 和 game-area 的 overflow:hidden 重复

```css
/* style.css 第 21 行 */
body {
    overflow: hidden;   /* ← 整个 body 都 hidden */
}

/* style.css 第 89 行 */
.game-area {
    overflow: hidden;   /* ← 已经被 body 约束了，冗余 */
}
```

**建议**：移除 `.game-area` 上的 `overflow: hidden`（保留 body 的即可）

#### 问题 M-2：CSS 中 .ball 的硬编码默认 top/left

```css
/* style.css 第 97-98 行 */
.ball {
    top: 100px;    /* ← JS 的 spawnBall() 每次都会覆盖这两个值 */
    left: 200px;   /* ← 冗余 */
}
```

**建议**：移除这两个默认值，让 JS 完全控制小球位置

### 5. ✅ Flex 布局规范性（优秀）

| 检查项 | 状态 |
|--------|------|
| body flex-col + game-area flex:1 | ✅ 状态栏固定 + 游戏区自动填满 |
| status-bar justify-content: space-between | ✅ 左右均分 |
| status-item gap: 8px | ✅ 避免 margin 冲突 |
| overlay flex 居中 | ✅ justify-content + align-items 双轴居中 |
| overlay-card flex-col + gap: 20px | ✅ 比 margin-top 更整洁 |
| flex-shrink: 0 给 status-bar | ✅ 防止被压缩 |

### 6. ✅ 代码可维护性（优秀）

| 检查项 | 状态 |
|--------|------|
| GAME_CONFIG 集中配置 | ✅ 时长/尺寸/分值都在顶部，改一处生效 |
| 状态机保护 | ✅ idle/playing/ended 三态，阻止非法操作 |
| DOM 缓存 | ✅ cacheDom() 避免重复 getElementById |
| spawnBall 边界保护 | ✅ 计算 maxLeft/maxTop 后做 clamp，小屏不崩 |
| setInterval 清理 | ✅ endGame 和 restartGame 都清除，无内存泄漏 |

---

## Low 级别优化（可选）

| # | 建议 | 位置 | 说明 |
|---|------|------|------|
| L-1 | padding = 4 抽到 GAME_CONFIG | script.js spawnBall() | 让边界内边距也可配置 |
| L-2 | 分数为负时视觉提示 | style.css / JS | 负数时红色显示，体验更好 |

---

## 修复清单

| 级别 | # | 修复项 | 文件 | 状态 |
|------|---|--------|------|------|
| Medium | M-1 | 移除 `.game-area` 上 `overflow: hidden` | style.css 第 89 行 | 待修 |
| Medium | M-2 | 移除 `.ball` 的 `top: 100px; left: 200px;` | style.css 第 97-98 行 | 待修 |

---

## 评审结论

**代码整体质量优秀**，架构清晰、命名规范、事件机制正确、状态保护到位。仅 2 处 Medium 级别冗余需要清理（不影响功能但可以让代码更整洁）。

**评审结论：通过，建议修复 M-1 / M-2 后收尾**
