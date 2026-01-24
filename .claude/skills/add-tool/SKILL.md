---
name: add-tool
description: Scaffold a new tool with all required registrations in one command
---

# Add Tool

Use this skill to create a new tool with all required file registrations. This automates the 5-step manual process and ensures nothing is missed.

## Invocation

```
/add-tool "Tool Name" "Short description" "emoji"
```

Example:

```
/add-tool "Color Picker" "Pick and convert colors between formats" "🎨"
```

## What This Skill Creates/Updates

1. **Creates** `src/pages/tools/{tool-id}.astro` - New tool page from template
2. **Updates** `src/data/tools.ts` - Adds entry to tools array
3. **Updates** `public/sw.js` - Adds URL to PRECACHE_URLS and increments CACHE_VERSION
4. **Updates** `public/manifest.json` - Adds shortcut entry
5. **Creates** `tests/visual/{tool-id}.spec.ts` - Visual test for the new tool

## Steps

### 1. Parse Arguments

Extract from the invocation:

- **title**: The tool name (e.g., "Color Picker")
- **description**: Short description
- **emoji**: Single emoji character

### 2. Generate Tool ID

Convert title to kebab-case:

- "Color Picker" → "color-picker"
- "Days Until Calculator" → "days-until-calculator"

### 3. Create Tool Page

Create `src/pages/tools/{tool-id}.astro` with this template:

```astro
---
import Layout from '../../layouts/Layout.astro';
import ToolHeader from '../../components/ToolHeader.astro';
---

<Layout title="{title} | Keeler Tools" description="{description}">
    <ToolHeader title="{title}" description="{description}" tag="Utility" />
    <main class="mx-auto max-w-4xl px-6 py-12">
        <!-- Tool UI goes here -->
        <div class="rounded-2xl bg-white p-8 shadow-xl">
            <p class="text-gray-600">Tool implementation coming soon...</p>
        </div>
    </main>
</Layout>

<script>
    // Client-side logic
</script>

<style>
    /* Component-scoped styles */
</style>
```

### 4. Add to tools.ts

Add entry to the `tools` array in `src/data/tools.ts`:

```typescript
{
    id: '{tool-id}',
    title: '{title}',
    description: '{description}',
    path: '/tools/{tool-id}',
    createdAt: '{ISO-8601-timestamp}',  // Use current time
    emoji: '{emoji}',
},
```

**Note**: Generate `createdAt` using current timestamp in ISO 8601 format with timezone, e.g., `2026-01-22T14:30:00-05:00`

### 5. Update sw.js

In `public/sw.js`:

- Add `'/tools/{tool-id}/'` to `PRECACHE_URLS` array (with trailing slash)
- Increment `CACHE_VERSION` (e.g., 'v11' → 'v12')

### 6. Update manifest.json

Add shortcut to `public/manifest.json` shortcuts array:

```json
{
    "name": "{title}",
    "short_name": "{short-name}", // Truncate if > 12 chars
    "description": "{description}",
    "url": "/tools/{tool-id}",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192"
        }
    ]
}
```

### 7. Create Visual Test

Create `tests/visual/{tool-id}.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: {tool-id}', async ({ page }) => {
    await page.goto('/tools/{tool-id}/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('{tool-id}.png', {
        fullPage: true,
    });
});
```

### 8. Generate Initial Baseline

Run:

```bash
npm run test:visual:update -- --grep "{tool-id}"
```

This creates the initial baseline screenshots for the new tool.

### 9. Confirm Success

Display summary:

```
Created new tool: {title}

Files created:
  - src/pages/tools/{tool-id}.astro
  - tests/visual/{tool-id}.spec.ts
  - tests/visual/{tool-id}.spec.ts-snapshots/ (baseline screenshots)

Files updated:
  - src/data/tools.ts (added entry)
  - public/sw.js (added to PRECACHE_URLS, version now v12)
  - public/manifest.json (added shortcut)

Next steps:
  1. Edit src/pages/tools/{tool-id}.astro to implement the tool
  2. Run `npm run dev` to test
  3. Run `/format-and-commit` when done
```

## Notes

- The tool page is a starter template - you'll need to implement the actual functionality
- Tool ID must be unique - check tools.ts first
- Always use kebab-case for tool IDs
- The "tag" in ToolHeader defaults to "Utility" - change as needed
