# Deployment — Cloudflare Workers (static assets, via Wrangler)

The marketing site is a fully static Astro build (`output: "static"`)
deployed to **Cloudflare Workers with static-asset uploads** via the
Wrangler CLI. Not Cloudflare Pages — Workers-with-assets is the modern
path Cloudflare is consolidating toward and matches how this repo was
configured before the brief detour through GitHub Pages.

The loop is:

```
edit → commit → push → `pnpm deploy:cf` → live
```

The deploy step is manual (one local command). No CI, no GitHub
Actions, no auto-build-on-push.

---

## Why Cloudflare Workers (not Pages, not GitHub Pages)

`vental.ai` is registered with Cloudflare Registrar, and Cloudflare
Registrar domains are locked to Cloudflare's nameservers — you can't
delegate DNS elsewhere without transferring the registrar. So the apex
site has to be on a Cloudflare-native host. GitHub Pages is ruled out
(needs to be authoritative for the apex's A records).

That leaves Cloudflare Pages or Cloudflare Workers. We use Workers
because:

- Workers-with-static-assets is Cloudflare's current direction; Pages
  is essentially in feature-parity-then-deprecation mode.
- Single CLI tool (`wrangler`) handles deploy, rollback, log tail,
  domain config — no separate dashboard click-flow for routine work.
- `wrangler.jsonc` is committed; the deploy is fully reproducible from
  source. Pages stores build config in its dashboard, not in the repo.

The actual app (`{tenant}.vental.ai`) lives on Render and resolves
through Cloudflare DNS via individual per-tenant CNAMEs. This repo
only serves the apex marketing site at `vental.ai` (and
`www.vental.ai`).

---

## Prerequisites

- Cloudflare account with Workers enabled (free tier is plenty for a
  static marketing site).
- DNS for `vental.ai` on Cloudflare (it is — Cloudflare Registrar +
  Cloudflare DNS, the standard combo).
- `pnpm install && pnpm build` succeeds locally with zero warnings.
- Node 20+ and pnpm 10.4+ locally (`package.json` declares both via
  `engines` and `packageManager`).
- `wrangler` installed via `pnpm install` (it's in `devDependencies`).

---

## One-time setup

### 1. Log in to Cloudflare from the CLI

```bash
pnpm cf:login
```

Opens a browser tab to authorize Wrangler against your Cloudflare
account. Sets up local credentials at `~/.config/.wrangler/`. One-time
per machine.

### 2. First deploy

```bash
pnpm deploy:cf
```

This runs `astro build` then `wrangler deploy`. On the very first
deploy Wrangler:

- Reads `wrangler.jsonc` (project name `vental-marketing-site`, asset
  directory `./dist`).
- Creates the Worker if it doesn't already exist.
- Uploads the contents of `dist/` as static assets.
- Prints the Worker's default URL, something like
  `https://vental-marketing-site.<your-subdomain>.workers.dev`.

Browse that URL to confirm the site is up.

### 3. Attach custom domains

Cloudflare dashboard → **Workers & Pages** → **vental-marketing-site**
→ **Settings** → **Domains & Routes** → **Add** → **Custom Domain** →
enter `vental.ai`. Cloudflare auto-creates the DNS record on your
`vental.ai` zone (since registrar + DNS are both Cloudflare) and
provisions the TLS certificate in seconds. Repeat for
`www.vental.ai`.

No manual DNS work required — the Custom Domain flow handles routing
internally.

### 4. (Optional) apex/www canonical redirect

If you want `https://www.vental.ai/*` to 301-redirect to
`https://vental.ai/*`:

- Cloudflare dashboard → `vental.ai` zone → **Rules** → **Redirect Rules**
  → **Create rule**
- When incoming requests match: `Hostname` equals `www.vental.ai`
- Then: Static redirect to URL `https://vental.ai${path}`, status `301`

Or drop a `public/_redirects` file in this repo with:

```
https://www.vental.ai/* https://vental.ai/:splat 301!
```

Either works. The Cloudflare Rule is friendlier to revert.

---

## DNS

The apex marketing site lives on Cloudflare DNS via the Workers
Custom Domain you attached in step 3. **No A or CNAME records to add
manually** — the Custom Domain flow injects what's needed.

For the rest of the zone (the actual app on Render), see the parent
project's deployment checklist (`DEPLOYMENT_CHECKLIST.md` in the
backend repo). Tenant subdomains use individual CNAMEs
(`demo.vental.ai`, `test.vental.ai`, etc.) pointing at
`vental-web.onrender.com`, not a wildcard.

> ⚠️ **Do NOT** point `*.vental.ai` (wildcard) at any Render service.
> Cloudflare Registrar + Cloudflare DNS + Render-via-Cloudflare-edge
> triggers Cloudflare Error 1000 ("DNS points to prohibited IP") on
> wildcards. Add per-tenant CNAMEs instead — one record per tenant at
> provisioning time.

---

## The deploy loop

After setup, deploys are one command:

```bash
pnpm deploy:cf
```

That's the whole flow. The script does `astro build && wrangler deploy`
and prints the new deployment's URL. Typical wall time: 10–30 seconds
for the build, another 10–30 for the upload.

### Preview deploys (test before promoting)

```bash
pnpm deploy:cf:preview
```

Runs `astro build && wrangler versions upload`. Uploads a new version
of the Worker without promoting it to production — Wrangler prints a
preview URL you can share. When you're ready to promote, the
production deploy (`pnpm deploy:cf`) replaces it.

### Watch logs in real time

```bash
pnpm wrangler tail
```

Streams request logs from the deployed Worker. Useful for debugging
404s, redirect rules, or whatever else.

---

## Rollback

Every deploy creates a new Wrangler "version". You can promote any
prior version back to production:

```bash
pnpm wrangler versions list
pnpm wrangler versions deploy <version-id>
```

Or via the dashboard: **Workers & Pages → vental-marketing-site →
Deployments → pick a previous version → Promote**.

Alternatively, `git revert` the offending commit and re-run
`pnpm deploy:cf`.

---

## Local sanity checklist before deploying

```bash
pnpm install   # if deps changed
pnpm build     # 0 warnings
pnpm preview   # spot-check at http://localhost:4321
```

`pnpm deploy:cf` runs `astro build` again under the hood, but doing it
once locally first catches build-time errors without a round-trip to
Cloudflare.

---

## Quick reference

| Concern                               | Where it lives                                            |
| ------------------------------------- | --------------------------------------------------------- |
| Build & deploy                        | `pnpm deploy:cf` (manual, local)                          |
| Deploy config                         | `wrangler.jsonc` (committed)                              |
| Custom domain                         | Workers project → Settings → Domains & Routes             |
| HTTPS                                 | Auto-issued by Cloudflare when custom domain attached     |
| DNS                                   | Cloudflare DNS (registrar + DNS both on Cloudflare)       |
| Rollback                              | `pnpm wrangler versions deploy <id>` OR dashboard Promote |
| Real-time logs                        | `pnpm wrangler tail`                                      |
| Tenant subdomain (`{slug}.vental.ai`) | **Separate stack on Render** — see backend repo           |
