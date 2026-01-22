# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build
npm run format       # Auto-format with Prettier
npm run format:check # Check formatting (runs on commit via Husky)
```

## Architecture

This is an Astro site hosting browser-only tools at tools.keeler.dev. Each tool is a self-contained page with vanilla JS—no heavy frameworks.

**Key files:**

- `src/data/tools.ts` - Tool registry (id, title, description, path, createdAt, emoji)
- `src/pages/tools/*.astro` - Individual tool pages
- `src/pages/index.astro` - Landing page (imports from tools.ts, sorted by createdAt)
- `src/layouts/Layout.astro` - Shared layout with Tailwind theme tokens (brand: #24d1f8)
- `src/components/ToolHeader.astro` - Standard tool page header
- `public/sw.js` - Service worker for PWA offline support
- `public/manifest.json` - PWA manifest with tool shortcuts

## Adding a New Tool

1. Create `src/pages/tools/your-tool.astro` using Layout and ToolHeader components
2. Add entry to `src/data/tools.ts` array
3. Update `public/sw.js`:
    - Add URL to `PRECACHE_URLS` array
    - Increment `CACHE_VERSION` (e.g., 'v11' → 'v12')
4. Add shortcut to `public/manifest.json`

## Tool Page Pattern

```astro
---
import Layout from '../../layouts/Layout.astro';
import ToolHeader from '../../components/ToolHeader.astro';
---

<Layout title="Tool Name | Keeler Tools" description="...">
    <ToolHeader title="Tool Name" description="..." tag="Category" />
    <main class="mx-auto max-w-4xl px-6 py-12">
        <!-- Tool UI -->
    </main>
</Layout>

<script>
    // Client-side logic (vanilla JS or small libraries like canvas-confetti)
</script>

<style>
    /* Component-scoped styles */
</style>
```

## Skills

After implementing a plan, run `/format-and-commit` to format code with Prettier and create a commit.

## Deployment

Netlify builds with `npm run build` and publishes `dist/`.
