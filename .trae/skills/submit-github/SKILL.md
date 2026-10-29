---
name: submit-github
description: Commit current project state and push to the configured GitHub remote using SSH. Use when the user asks to submit to GitHub, push to github.com, or mirror the repo to GitHub. Do not use for Gitee or any other remote.
---

# Submit GitHub

Commit the current working tree and push to the project's GitHub remote over SSH.

## Remotes

| Name | URL | Purpose |
|------|-----|---------|
| `origin` | `https://gitee.com/ocean-of-flowers/24001011030---li-wenjing` | Gitee primary (managed by submit-project skill) |
| `github` | `git@github.com:lwj30/gj_liwenjing.git` | GitHub mirror (managed by this skill) |

Always keep both remotes configured. Do **not** replace `origin`.

SSH identity file: `C:\Users\25672\.ssh\id_ed25519` (already generated).

## Procedure

Run each step as a **separate PowerShell command**. No `&&` / `;` chaining. Stop and report if any step fails.

### 1. Inspect state

```powershell
git status --short
git remote -v
git branch
```

Confirm the working tree, existing remotes, and current branch before touching anything.

### 2. Stage

```powershell
git add <paths>
```

Do **not** `git add -A` when the tree contains runtime artifacts. If the user says "commit everything", `git add .` is allowed.

### 3. Commit

Use the `lwj_` prefix per project convention. Keep first line ≤ 72 characters.

```powershell
git commit -m "lwj_<short description>"
```

Report "nothing to commit" and skip to step 4 if the working tree is clean.

### 4. Configure or verify the `github` remote

Check whether `github` already points at `git@github.com:lwj30/gj_liwenjing.git`. If missing or wrong:

```powershell
git remote remove github
git remote add github git@github.com:lwj30/gj_liwenjing.git
```

Verify:

```powershell
git remote -v
```

Should show both `origin` (gitee) and `github` (SSH).

### 5. Push

```powershell
git push -u github master
```

For subsequent pushes (upstream already bound), `git push github` suffices.

### 6. Verify SSH works (if push fails with auth)

```powershell
ssh -T git@github.com -i "$env:USERPROFILE\.ssh\id_ed25519"
```

Expected: a welcome message like `Hi lwj30! You've successfully authenticated...`
If it says `Permission denied (publickey)`, the SSH key has not been added to the GitHub account. Stop and tell the user to add the public key at https://github.com/settings/keys.

## Common failure patterns

| Symptom | Likely fix |
|---------|-----------|
| `Permission denied (publickey)` | Add `id_ed25519.pub` contents to https://github.com/settings/keys, then retry |
| `Repository not found` at push | The repo `lwj30/gj_liwenjing` does not exist or is private under a different account. Create it first on github.com |
| `remote contains work that you do not have` | `git pull --rebase github master`, then push again |
| `src refspec master does not match any` | No commits yet — commit first |
| Branch name mismatch (`master` vs `main`) | Check `git branch -a`, push the actual branch name |

## SSH public key reference

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBaVx5HopF8XZt0HO7KPL4d/ABnjh7ulhHUbxjAtbfJQ gj@trae-20261029
```

Path: `C:\Users\25672\.ssh\id_ed25519.pub`
