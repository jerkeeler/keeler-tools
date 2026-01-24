# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build
npm run format       # Auto-format with Prettier
npm run format:check # Check formatting (runs on commit via Husky)
npm run test:visual          # Run visual regression tests
npm run test:visual:update   # Update baseline screenshots
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

## Visual Testing

Visual regression tests catch UI breakage, especially on mobile.

**Running tests:**

- `npm run test:visual` - Run all visual tests
- `npm run test:visual -- --grep "tool-id"` - Run tests for specific tool
- `npm run test:visual:update` - Update baselines after intentional UI changes

**Test files:** `tests/visual/{tool-id}.spec.ts`
**Baselines:** `tests/visual/{tool-id}.spec.ts-snapshots/` (checked into git)
**Artifacts:** `test-results/` (gitignored)

**After modifying any tool:** Run `/visual-test` skill before declaring work complete.

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

## Tool ID Conventions

- Use kebab-case: `my-cool-tool`
- ID must match across: file name, tools.ts id, sw.js URL, manifest shortcut URL
- Example: `days-until-calculator` appears as:
    - File: `src/pages/tools/days-until-calculator.astro`
    - tools.ts: `id: 'days-until-calculator'`
    - sw.js: `'/tools/days-until-calculator/'`
    - manifest.json: `"url": "/tools/days-until-calculator"`

## LocalStorage Keys

Pattern: `keeler-{tool-id}-{purpose}`

Examples:

- `keeler-random-picker-items` - stored items for random picker
- `keeler-days-until-dates` - saved dates for countdown

## Skills

Available skills for development workflow:

- `/add-tool "Name" "Description" "emoji"` - Scaffold a new tool with all registrations
- `/validate-tools` - Check cross-file consistency (tools.ts ↔ sw.js ↔ manifest.json)
- `/sync-pwa` - Regenerate PWA files from tools.ts as source of truth
- `/format-and-commit` - Format code and create a commit (runs validation first)

## Tool Complexity Tiers

**Tier 1 - Simple** (Random Picker, Days Until)

- Local state only, no external APIs
- Single card layout

**Tier 2 - Medium** (Sun Angle)

- Browser APIs (geolocation, canvas)
- Calculations/math, multi-section layout

**Tier 3 - Complex** (Mini Piano)

- Web Audio/WebGL
- Multiple input handlers, custom layouts

## Deployment

Netlify builds with `npm run build` and publishes `dist/`.
