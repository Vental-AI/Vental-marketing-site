# Deployment — Cloudflare Pages (direct upload)

The marketing site is a fully static Astro build (`output: "static"`), so
Cloudflare Pages serves `dist/` directly. No Cloudflare adapter, no
Workers, no edge functions, no Git integration.

The loop is:

```
edit → pnpm build → upload dist/ → live
```

That's the whole pipeline. This doc covers the one-time setup, then the
two-command deploy loop after that.

---

## Prerequisites

- A Cloudflare account.
- `vental.ai` already on Cloudflare DNS (so custom-domain setup is one
  click).
- `pnpm build` succeeds locally with zero warnings.
- Node 20+ and pnpm 10.4+ locally (`package.json` declares both via
  `engines` and `packageManager`).

---

## First deploy — dashboard drag-and-drop

Easiest possible first deploy. No CLI, no auth setup, takes < 60 seconds.

1. Build locally:
   ```bash
   pnpm install
   pnpm build
   ```
2. In the Cloudflare dashboard: **Workers & Pages → Create application →
   Pages → Upload assets**.
3. Project name: `vental-marketing-site` (this becomes the
   `<project>.pages.dev` URL).
4. Drag the `dist/` folder into the upload box.
5. Click **Deploy site**.

When the deploy finishes, Cloudflare hands back a `<project>.pages.dev`
URL — open it, spot-check the site looks right, then move to **Custom
domains** below.

---

## Subsequent deploys — Wrangler CLI

After the project exists, future deploys go straight from your shell.

### One-time CLI setup

```bash
# install wrangler as a dev dependency
pnpm add -D wrangler

# authenticate once (opens a browser tab)
pnpm exec wrangler login
```

### The deploy command

```bash
pnpm build
pnpm exec wrangler pages deploy dist --project-name=vental-marketing-site
```

Wrangler uploads `dist/`, creates an atomic deployment, and prints the
production URL when it's done. ~10 seconds for a typical deploy.

### Optional: add a `deploy` script

To make it a single command, add this to `package.json` under `scripts`:

```jsonc
"deploy": "astro build && wrangler pages deploy dist --project-name=vental-marketing-site"
```

Then just:

```bash
pnpm deploy
```

### Preview deploys

By default Wrangler creates a production deploy. For a preview (separate
URL, doesn't replace prod):

```bash
pnpm exec wrangler pages deploy dist \
  --project-name=vental-marketing-site \
  --branch=preview
```

Each `--branch=<name>` gets its own stable URL — useful for sharing a
work-in-progress version with someone before promoting.

---

## Attach the custom domains

One-time, in the Cloudflare dashboard:

**Pages project → Custom domains → Set up a custom domain.**

1. Enter `vental.ai`. Cloudflare detects you own the zone, writes a
   CNAME-flattened record at the apex (`@ → <project>.pages.dev`), and
   asks you to Activate. Click activate.
2. Repeat for `www.vental.ai`.

CNAME flattening on the apex is Cloudflare-only magic — no `A`/`ALIAS`
gymnastics, no manual DNS edits. Activation is effectively instant.

> ⚠️ **Do NOT** point `*.vental.ai` (wildcard) at this Pages project.
> The actual app lives at `{tenant}.vental.ai` on a separate stack —
> leave that DNS record alone. Pages only owns `vental.ai` and
> `www.vental.ai`. Cloudflare's setup respects this automatically (it
> only writes records for names you explicitly add), but worth a sanity
> check in DNS once you're live.

---

## Redirect `www → apex` (recommended)

Pick one:

### Option A — Cloudflare Bulk Redirect (cleanest, doesn't touch code)

**Rules → Redirect Rules → Create rule:**

- **When**: `(http.host eq "www.vental.ai")`
- **Then**: Dynamic redirect →
  `concat("https://vental.ai", http.request.uri.path)`
- **Status**: 301
- **Preserve query string**: yes

The redirect happens at Cloudflare's edge — never reaches Pages.

### Option B — `public/_redirects` (lives with the code)

Create `public/_redirects` with:

```
https://www.vental.ai/* https://vental.ai/:splat 301!
```

Either works; the Cloudflare Rule is slightly faster but requires
re-editing in the dashboard if you ever change it.

---

## Security + cache headers (optional)

Create `public/_headers` to ship sensible defaults:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

The `_astro/` rule caches Astro's content-hashed asset bundle (JS, CSS,
optimized images) effectively forever. Hashes change on every build, so
it's safe to be aggressive.

---

## Rollback

Cloudflare keeps deploy history regardless of how each one was uploaded.

**Pages project → Deployments → pick a previous deploy → Manage deployment
→ Rollback to this deployment.**

One click. Instant. The previous version is live again.

---

## Local sanity checklist before every deploy

```bash
pnpm install        # clean install (only if deps changed)
pnpm build          # 0 warnings
pnpm preview        # spot-check the built site at http://localhost:4321
```

If those are clean, the upload will be clean — there's no Cloudflare
build step that could disagree with your local environment.

---

## Quick reference

| Concern                                 | Where it lives                                  |
| --------------------------------------- | ----------------------------------------------- |
| First deploy                            | Dashboard drag-and-drop of `dist/`              |
| Recurring deploys                       | `pnpm build && wrangler pages deploy dist …`    |
| Custom domains                          | Pages project → Custom domains                  |
| `www → apex` redirect                   | Cloudflare Redirect Rule OR `public/_redirects` |
| Cache + security headers                | `public/_headers`                               |
| Rollback                                | Pages project → Deployments → Manage            |
| Tenant subdomain (`{slug}.vental.ai`)   | **Separate stack** — leave its DNS alone        |
