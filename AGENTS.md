# AGENTS.md

## What this repo is

- Static course project for 《高级网页设计》: vanilla HTML/CSS/ES6, no framework, no package manager.
- `index.html` — 2-minute click-the-ball game. `iconfont-1.html` — Font Awesome (webfont). `iconfont-2.html` — Lucide (inline SVG). `cdn/` — vendored offline assets.
- Requirements live in `spec.md`; task breakdown and manual acceptance criteria in `plan.md`. Review/retrospective files are history, not current instructions.

## Build, run, verify

- There is no build, lint, typecheck, or automated test command. Do not invent npm scripts.
- Run pages by opening the HTML directly (`file://` is supported); verify in a browser and check the console. Use the manual acceptance steps in `plan.md`.
- Everything must work offline: never replace local `cdn/` references with remote URLs.
- Shell is Windows PowerShell 5.1: no `&&` / `||` chaining.

## Project conventions (non-default)

- Before executing any user prompt, append it to `lwj_prompt.md` with time, model, and content. Append only; never overwrite.
- New CSS classes, IDs, and JS variables use the `lwj_` prefix. Existing game code predates this rule — do not rename its identifiers opportunistically because `spec.md`/review reports reference them. Library names (`fa-*`, `data-lucide`) are exempt.
- Every new HTML page must link back to `index.html`; existing icon pages put this link in the footer.
- User-facing copy and code comments are Chinese. Keep that voice.
- Game CSS stays in `style.css`. Icon pages keep their styles inline in `<style>` on purpose (single-file pages); do not extract shared CSS.
- Git remote is Gitee, branch is `master`, commit messages use the `lwj_` prefix. Commit/push only when asked; the submission procedure is in `.trae/skills/submit-project/SKILL.md`.

## Game architecture (`script.js`)

- `GAME_CONFIG` holds all tunables (duration, sizes, scores, trap delay/distance). Change values there, not as scattered literals.
- `gameState` is an `idle -> playing -> ended` state machine holding score/time/timers/trap state; guard actions by status.
- One delegated `click` listener on `#game-area` distinguishes `e.target`: `.ball` +2, `.wrong-ball` -3, blank -1. Do not add per-ball listeners or `stopPropagation`.
- Balls are absolutely positioned via `top`/`left`; visibility is controlled only by the `hidden` attribute for both balls.
- On any click, refresh the correct ball first, then the trap ball. `spawnWrongBall()` enforces an 80px center distance with a retry cap.
- Float text must be positioned with `e.clientX - areaRect.left` (not `offsetX`) and removed on `animationend` to avoid DOM leaks.
- Countdown danger styling is `timeLeft <= 10` via `classList.toggle('danger', ...)`. This threshold is intentionally separate from `TRAP_DELAY`, even though both are 10.

## Icon pages and CDN

- `iconfont-1.html` uses the Font Awesome webfont (`cdn/fontawesome/css/all.min.css`) with `<i class="fa-solid fa-...">`.
- `iconfont-2.html` uses Lucide UMD (`cdn/lucide/lucide.min.js`): markup is `<i data-lucide="...">`, then `lucide.createIcons()` converts it to inline `<svg>`. Preserve this flow.
- Fonts load through `cdn/fonts/fonts.css` (local woff2 files). Do not add Google Fonts or other remote links.
- The two icon pages are intentionally stylistically different (FA paper type-specimen vs Lucide blueprint), not the game palette. Reuse each page's existing tokens (`--fa-*`, `--bp-*`).
- `spec.md` section 12's icon list is not an exact match for the implemented pages; treat the HTML as the source of truth for icon names and counts.
