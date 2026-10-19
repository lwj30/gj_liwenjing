/* =============================================
   抓小球小游戏 — 交互逻辑
   ============================================= */

'use strict';

/* ---------- 配置对象 ---------- */
const GAME_CONFIG = {
    GAME_DURATION_SECONDS: 120,   // 2 分钟
    BALL_SIZE: 60,                // 小球直径 px
    SCORE_HIT: 2,                 // 点中小球得分
    SCORE_MISS: -1                // 点击空白得分
};

/* ---------- 游戏状态对象 ---------- */
const gameState = {
    status: 'idle',      // 'idle' | 'playing' | 'ended'
    score: 0,
    timeLeft: GAME_CONFIG.GAME_DURATION_SECONDS,
    countdownTimer: null // setInterval 引用，用于清理
};

/* ---------- DOM 缓存对象 ---------- */
const DOM = {};

/* ---------- 初始化：等待 DOM 加载完毕后绑定 ---------- */
document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    bindEvents();
});

/**
 * 缓存所有需要操作的 DOM 元素
 * 避免每次操作都重新 getElementById
 */
function cacheDom() {
    DOM.scoreDisplay  = document.getElementById('score-display');
    DOM.timerDisplay  = document.getElementById('timer-display');
    DOM.startBtn      = document.getElementById('start-btn');
    DOM.restartBtn    = document.getElementById('restart-btn');
    DOM.gameArea      = document.getElementById('game-area');
    DOM.ball          = document.getElementById('ball');
    DOM.overlay       = document.getElementById('overlay');
    DOM.finalScore    = document.getElementById('final-score');
}

/**
 * 绑定事件监听
 */
function bindEvents() {
    DOM.startBtn.addEventListener('click', startGame);
    DOM.restartBtn.addEventListener('click', restartGame);

    // 游戏区域点击：用事件委托统一处理
    // 小球和空白都冒泡到 game-area，通过 e.target 区分
    DOM.gameArea.addEventListener('click', onGameAreaClick);
}

/**
 * 游戏区域点击处理（事件委托统一入口）
 * 利用事件冒泡机制，点小球或空白都触发此函数
 * 通过 e.target 判断点到了谁
 * @param {MouseEvent} e
 */
function onGameAreaClick(e) {
    // 状态保护：只有 playing 状态才计分
    if (gameState.status !== 'playing') return;

    // 判断点击目标是否是小球
    if (e.target === DOM.ball) {
        // 命中小球：+2 分
        gameState.score += GAME_CONFIG.SCORE_HIT;
    } else {
        // 点到空白：-1 分（允许负数）
        gameState.score += GAME_CONFIG.SCORE_MISS;
    }

    // 更新分数显示
    updateScore();

    // 无论命中与否，都刷新小球位置
    spawnBall();
}

/* ---------- 核心游戏逻辑 ---------- */

/**
 * 开始游戏
 */
function startGame() {
    // 状态保护：只有 idle 才能开始
    if (gameState.status !== 'idle') return;

    // 初始化状态
    gameState.status   = 'playing';
    gameState.score    = 0;
    gameState.timeLeft = GAME_CONFIG.GAME_DURATION_SECONDS;

    // 更新 UI
    updateScore();
    updateTimerDisplay();

    // 禁用开始按钮
    DOM.startBtn.disabled = true;
    DOM.startBtn.textContent = '游戏中...';

    // 随机位置生成小球
    spawnBall();

    // 启动倒计时（每秒递减）
    gameState.countdownTimer = setInterval(updateCountdown, 1000);
}

/**
 * 在游戏区域内随机位置生成小球
 * 边界保护：确保小球完整落在可视区域内，不被截断
 */
function spawnBall() {
    const areaRect = DOM.gameArea.getBoundingClientRect();
    const padding = 4; // 内边距，避免小球紧贴边界

    // 计算小球可出现的坐标范围
    // left 最小值 = 0 + padding
    // left 最大值 = 区域宽度 - 小球直径 - padding
    // top  最小值 = 0 + padding
    // top  最大值 = 区域高度 - 小球直径 - padding
    let maxLeft = areaRect.width - GAME_CONFIG.BALL_SIZE - padding;
    let maxTop  = areaRect.height - GAME_CONFIG.BALL_SIZE - padding;

    // 边界保护：如果可用空间过小，退化为 0（保证不报错）
    if (maxLeft < padding) maxLeft = padding;
    if (maxTop  < padding) maxTop  = padding;

    // 生成随机坐标 [padding, maxLeft/maxTop]
    const randomLeft = Math.floor(Math.random() * (maxLeft - padding + 1)) + padding;
    const randomTop  = Math.floor(Math.random() * (maxTop  - padding + 1)) + padding;

    // 应用到小球
    DOM.ball.style.left = randomLeft + 'px';
    DOM.ball.style.top  = randomTop  + 'px';
    DOM.ball.style.display = 'block';
}

/**
 * 倒计时回调：每秒触发一次
 */
function updateCountdown() {
    gameState.timeLeft--;
    updateTimerDisplay();

    if (gameState.timeLeft <= 0) {
        endGame();
    }
}

/**
 * 结束游戏
 */
function endGame() {
    gameState.status = 'ended';

    // 清除倒计时
    if (gameState.countdownTimer) {
        clearInterval(gameState.countdownTimer);
        gameState.countdownTimer = null;
    }

    // 隐藏小球
    DOM.ball.style.display = 'none';

    // 更新最终得分文本
    DOM.finalScore.textContent = gameState.score;

    // 显示结束遮罩
    DOM.overlay.removeAttribute('hidden');
}

/**
 * 再来一局：重置所有状态并重新开始
 */
function restartGame() {
    // 重置状态机
    gameState.status   = 'idle';
    gameState.score    = 0;
    gameState.timeLeft = GAME_CONFIG.GAME_DURATION_SECONDS;

    // 隐藏遮罩
    DOM.overlay.setAttribute('hidden', '');

    // 恢复开始按钮
    DOM.startBtn.disabled = false;
    DOM.startBtn.textContent = '开始游戏';

    // 更新 UI
    updateScore();
    updateTimerDisplay();

    // 立即开始新一局
    startGame();
}

/* ---------- UI 更新辅助函数 ---------- */

/**
 * 更新分数显示
 */
function updateScore() {
    DOM.scoreDisplay.textContent = gameState.score;
}

/**
 * 更新倒计时显示（格式 MM:SS）
 */
function updateTimerDisplay() {
    DOM.timerDisplay.textContent = formatTime(gameState.timeLeft);
}

/**
 * 秒数 → MM:SS 格式字符串
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    // 两位数补零
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
