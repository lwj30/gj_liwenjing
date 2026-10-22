---
name: submit-project
description: Commit current project state and push to the configured Gitee remote. Use when the user asks to submit project, commit and push, or deploy to the Gitee repository. Do not use for reverting history or for creating tags.
---

# Submit Project

Commit the current working tree and push to the project's Gitee remote.

## Remote

Target URL (fixed for this project):

```
https://gitee.com/ocean-of-flowers/24001011030---li-wenjing
```

Default branch: `master`.

## Procedure

Run each step as a **separate PowerShell command**. Do **not** chain steps with `&&`, `;`, or any shell connector. If any step fails, stop and report before proceeding.

### 1. Inspect state first

```powershell
git status --short
git remote -v
git branch
```

Show the user what is dirty, what untracked files exist, and whether a remote is already configured. If there are unexpected data or cache files, confirm with the user before staging.

### 2. Stage

Stage files that are part of the deliverable. Do **not** blindly `git add -A` when the working tree contains local config or runtime artifacts.

```powershell
git add <paths or patterns that belong in the commit>
```

If the user explicitly says "commit everything", `git add .` is acceptable.

### 3. Commit

Use the `lwj_` prefix for commit messages per project convention. Keep the first line under 72 characters.

```powershell
git commit -m "lwj_<short description>"
```

If the commit fails with "nothing to commit", report that and skip to push.

### 4. Configure or verify remote

Check whether `origin` already points at the target URL. If not, set it:

```powershell
git remote remove origin
git remote add origin https://gitee.com/ocean-of-flowers/24001011030---li-wenjing
```

Skip this step when `git remote -v` already shows the correct URL as `origin`.

### 5. Push

```powershell
git push -u origin master
```

For first-time push, the upstream may need explicit binding. If the remote repo is empty and the push fails because of branch name, try `main` instead and reconcile.

## Common failure patterns

| Symptom | Likely fix |
|---------|-----------|
| `remote contains work that you do not have` | Pull with rebase first: `git pull --rebase origin master`, then push again |
| `src refspec master does not match any` | There is no commit yet — commit before pushing |
| Authentication error | Gitee credentials not configured. Stop and tell the user to log in or set up SSH keys |
| Branch name mismatch (`master` vs `main`) | Check `git branch -a` and push the actual branch name |

## PowerShell 5 notes

- No `&&` or `\|\|` chaining — run commands one at a time
- No `echo |` piping to git — use `-m` flag directly
- CRLF warnings on Windows are harmless; do not change `autocrlf` globally
