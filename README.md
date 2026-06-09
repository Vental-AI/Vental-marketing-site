# Vental Marketing Site

Marketing site for Vental, built with Astro, React, TypeScript, Tailwind CSS, and shadcn/ui.

Production site: https://vental.ai

## Tech Stack

- Astro 5
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui with Radix primitives
- Cloudflare Workers Static Assets via Wrangler

## Requirements

- Node.js 20 or newer
- pnpm 10.4.1

Install dependencies:

```bash
pnpm install
```

## Local Development

Start the dev server:

```bash
pnpm dev
```

Build the site:

```bash
pnpm build
```

Preview a production build locally:

```bash
pnpm preview
```

## Quality Checks

Run these before committing larger changes:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Format source files:

```bash
pnpm format
```

## Project Structure

```text
src/
  assets/        Images and brand assets
  data/          Shared content data
  layouts/       Astro layouts
  lib/           Shared utilities
  pages/         Site routes
  styles/        Global CSS and Tailwind theme
```

Key config files:

- `astro.config.mjs`: Astro, React, Tailwind, and site URL config.
- `components.json`: shadcn/ui config and aliases.
- `wrangler.jsonc`: Cloudflare Worker and static asset deploy config.

## shadcn/ui

This project uses shadcn/ui with the `@/components`, `@/components/ui`, and `@/lib/utils` aliases.

Add a component with:

```bash
pnpm dlx shadcn@latest add button
```

## Deployment

Production deploys are handled through the Cloudflare GitHub integration. Push to the production branch configured in Cloudflare, usually `main`, and Cloudflare will build and deploy the site.

Recommended Cloudflare build settings:

```text
Build command:
pnpm build

Deploy command:
pnpm exec wrangler deploy

Preview deploy command:
pnpm exec wrangler versions upload
```

To deploy manually from a local terminal, Wrangler must be authenticated with a Cloudflare user or API token that has Workers deploy permissions:

```bash
pnpm cf:login
pnpm deploy:cf
```

For preview uploads:

```bash
pnpm deploy:cf:preview
```

If local Wrangler reports an authentication error, check for stale Cloudflare environment variables before logging in again:

```bash
unset CLOUDFLARE_API_TOKEN CLOUDFLARE_API_KEY CLOUDFLARE_EMAIL CF_API_TOKEN CF_API_KEY CF_EMAIL
pnpm cf:login
```

The `account_id` in `wrangler.jsonc` is project configuration, not a secret. Do not commit Cloudflare API tokens, API keys, or `.env` files.

## Commit And Push

After validating the build:

```bash
git status
git add .
git commit -m "Update marketing site"
git push origin main
```
