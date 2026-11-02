# AGENTS.md

## 本仓库是什么

- 《高级网页设计》课程静态项目：原生 HTML/CSS/ES6，无框架、无包管理器。
- `index.html` — 两分钟抓小球小游戏。`iconfont-1.html` — Font Awesome（字体图标）。`iconfont-2.html` — Lucide（内联 SVG）。`cdn/` — 已本地化的离线依赖资源。
- 需求文档见 `spec.md`；任务拆解与人工验收标准见 `plan.md`。评审/复盘文件仅作历史记录，不是当前执行指令。

## 构建、运行、验证

- 本项目无构建、Lint、类型检查或自动化测试命令。不要发明 npm 脚本。
- 直接双击 HTML 即可运行（支持 `file://` 协议）；在浏览器中验证并查看控制台。按 `plan.md` 中的人工验收步骤检查。
- 所有资源必须离线可用：不要把本地 `cdn/` 引用替换为远程 URL。
- Shell 环境为 Windows PowerShell 5.1：不支持 `&&` / `||` 串联。

## 项目约定（非默认）

- 每次执行用户提示前，先将提示词追加写入 `lwj_prompt.md`，记录时间、模型和提示词内容。只追加，不覆盖。
- 新建 CSS 类名、ID、JS 变量统一使用 `lwj_` 前缀。已有游戏代码不受此规则约束——不要随意改名，因为 `spec.md`/评审报告中引用了这些标识符。库自带类名（`fa-*`、`data-lucide`）不受约束。
- 每个新建 HTML 页面必须包含返回 `index.html` 的超链接；现有 icon 页面将此链接置于页脚。
- 用户可见文案与代码注释一律使用中文，保持这个风格。
- 游戏 CSS 集中在 `style.css`。icon 页面的样式故意内联在 `<style>` 中（单页文件风格），不要抽成公共 CSS。
- **新建 HTML 文件必须包含规范注释**：每个新建的 HTML 页面顶部添加文件头注释；JS 部分的每个主要函数/模块必须添加功能注释。注释模板见下方。
  - **HTML 文件头注释**（放在 `<!DOCTYPE html>` 之后、`<html>` 之前）：
    ```html
    <!--
      作者：李汶静
      创建时间：YYYY-MM-DD HH:MM
      使用模型：Trae-Proprietary
      功能：<一句话简介本页用途>
    -->
    ```
  - **JS 函数注释**（放在每个 `function xxx()` 或箭头函数定义上方）：
    ```js
    /**
     * [功能名称]
     * @desc <一句话说明这个函数做什么、为什么存在>
     * @param {类型} 参数名 - 参数说明（如果有参数）
     * @returns {类型} 返回值说明（如果有返回值）
     * @author 李汶静
     * @created YYYY-MM-DD
     */
    ```
  - 注释语言为中文；已有的老文件不回溯补注释，仅对新建文件生效。
- Git 远程为 Gitee，主分支为 `master`，commit 消息使用 `lwj_` 前缀。仅在用户明确要求时执行 commit/push；提交流程详见 `.trae/skills/submit-project/SKILL.md`。

## 游戏架构（`script.js`）

- `GAME_CONFIG` 集中存放所有可调参数（时长、尺寸、分数、陷阱延迟/距离）。修改数值时改这里，不要散落在代码各处。
- `gameState` 为 `idle -> playing -> ended` 三态状态机，维护分数/时间/计时器/陷阱状态；所有操作需根据状态做防护。
- `#game-area` 上只绑定一个委托式 `click` 监听器，通过 `e.target` 区分：点中 `.ball` +2 分、点中 `.wrong-ball` -3 分、空白处 -1 分。不要给每个球单独绑监听器，也不要调用 `stopPropagation`。
- 小球通过 `top`/`left` 绝对定位；两种球的可见性都只用 `hidden` 属性控制。
- 任何点击事件触发后，先刷新正确球，再刷新陷阱球。`spawnWrongBall()` 内置 80px 中心距校验与重试上限，保证两球不重叠。
- 飘字必须用 `e.clientX - areaRect.left` 定位（不要用 `offsetX`），并在 `animationend` 时移除，防止 DOM 泄漏。
- 倒计时危险样式通过 `timeLeft <= 10` 判定并用 `classList.toggle('danger', ...)` 切换。此阈值与 `TRAP_DELAY` 恰好同为 10，但二者相互独立、故意分开配置。

## Icon 页面与 CDN

- `iconfont-1.html` 使用 Font Awesome 字体图标（`cdn/fontawesome/css/all.min.css`），写法为 `<i class="fa-solid fa-...">`。
- `iconfont-2.html` 使用 Lucide UMD（`cdn/lucide/lucide.min.js`）：HTML 标记为 `<i data-lucide="...">`，再由 `lucide.createIcons()` 转换为内联 `<svg>`。必须保留这个流程。
- 字体通过 `cdn/fonts/fonts.css` 加载（本地 woff2 文件）。不要添加 Google Fonts 或其他远程链接。
- 两个 icon 页面刻意采用不同的视觉风格（Font Awesome 纸张活字标本册 vs Lucide 蓝图草稿），不要混用游戏的配色。复用各自已有的 CSS 变量（`--fa-*`、`--bp-*`）。
- `spec.md` 第 12 节的图标清单与实际实现不完全一致；icon 名称和数量以 HTML 文件为准。
