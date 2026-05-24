# Deployment — GitHub Pages (GitHub Actions)

The marketing site is a fully static Astro build (`output: "static"`),
deployed to GitHub Pages by a workflow that runs on every push to
`main`. No adapter, no edge functions, no manual upload step.

The loop is:

```
edit → commit → push → GitHub Actions builds & deploys → live
```

That's the whole pipeline. This doc covers the one-time setup, then
the zero-command deploy loop after that.

---

## Prerequisites

- Repo hosted on GitHub (this one: `Vental-AI/Vental-marketing-site`).
- Owner/admin access to the repo settings.
- DNS for `vental.ai` controllable at the registrar (or current DNS
  provider — see DNS section).
- `pnpm build` succeeds locally with zero warnings.
- Node 20+ and pnpm 10.4+ locally (`package.json` declares both via
  `engines` and `packageManager`).

---

## One-time GitHub setup

### 1. Enable Pages with GitHub Actions as the source

In the repo: **Settings → Pages → Build and deployment → Source:
GitHub Actions.**

That's it. The workflow at `.github/workflows/deploy.yml` will take
over from here.

### 2. Push to `main`

The first push to `main` (or a manual run via **Actions → Deploy to
GitHub Pages → Run workflow**) builds the site and publishes it. You
can find the deployment URL in the Actions run summary, under the
`deploy` job.

### 3. Attach the custom domain

In **Settings → Pages → Custom domain**, enter `vental.ai` and save.
GitHub will verify the apex `CNAME` file in the repo
([public/CNAME](public/CNAME)) and start provisioning a Let's Encrypt
certificate. Once that's done (usually < 15 min), tick **Enforce
HTTPS**.

> The `CNAME` file lives in `public/` so Astro copies it into `dist/`
> on every build. Without it, GitHub Pages would strip the custom
> domain after each deploy.

---

## DNS

Point `vental.ai` at GitHub Pages. The exact UI depends on your DNS
provider — the records are the same.

### Apex `vental.ai` — A records

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Apex `vental.ai` — AAAA records (IPv6, recommended)

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

### `www.vental.ai` — CNAME

```
www  CNAME  vental-ai.github.io
```

(Use `<org-or-user>.github.io`, not `<repo>.github.io`. For this repo
that's `vental-ai.github.io`.)

> ⚠️ **Do NOT** point `*.vental.ai` (wildcard) at GitHub Pages. The
> actual app lives at `{tenant}.vental.ai` on a separate stack —
> leave that DNS record alone.

### If Cloudflare is still your DNS provider

Set the records above as **DNS-only (gray cloud)**, at least until
GitHub finishes provisioning the cert. You can re-enable the orange
cloud (CDN/WAF proxy) afterward if desired.

---

## The deploy loop

After setup, deploys are automatic.

```bash
git add .
git commit -m "..."
git push origin main
```

The **Deploy to GitHub Pages** workflow runs in ~1–2 minutes. Watch it
in **Actions** or just refresh `vental.ai`.

### Manual deploy (no code change)

**Actions → Deploy to GitHub Pages → Run workflow → Run.**

Useful for re-deploying after a Settings change or to retry a flaky
build.

---

## Rollback

GitHub Pages keeps deploy history per environment.

**Settings → Environments → github-pages → Deployment history → pick a
previous deploy → "Re-run"** on the workflow that produced it.

Alternatively, `git revert` the offending commit and push — the next
deploy puts the prior version back.

---

## Local sanity checklist before pushing

```bash
pnpm install        # if deps changed
pnpm build          # 0 warnings
pnpm preview        # spot-check at http://localhost:4321
```

The Actions runner uses the same Node 20 + pnpm 10.4.1 + frozen
lockfile, so a clean local build means a clean CI build.

---

## Quick reference

| Concern                                 | Where it lives                                       |
| --------------------------------------- | ---------------------------------------------------- |
| Build & deploy                          | `.github/workflows/deploy.yml` (runs on push)        |
| Custom domain                           | `public/CNAME` + Settings → Pages → Custom domain    |
| HTTPS                                   | Settings → Pages → Enforce HTTPS (after cert issues) |
| DNS                                     | Registrar / DNS provider — A + AAAA + CNAME above    |
| Rollback                                | `git revert` + push, or re-run a prior workflow      |
| Tenant subdomain (`{slug}.vental.ai`)   | **Separate stack** — leave its DNS alone             |
