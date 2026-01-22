---
name: sync-pwa
description: Regenerate PWA files (sw.js and manifest.json) from tools.ts as source of truth
---

# Sync PWA

Use this skill to automatically synchronize the service worker and PWA manifest with the tools registry. This treats `src/data/tools.ts` as the single source of truth.

## What This Skill Does

1. **Reads** `src/data/tools.ts` to get the authoritative list of tools
2. **Regenerates** `PRECACHE_URLS` in `public/sw.js`
3. **Auto-increments** `CACHE_VERSION` in `public/sw.js`
4. **Regenerates** shortcuts in `public/manifest.json`

## Steps

### 1. Read tools.ts

Parse `src/data/tools.ts` to extract all tool entries with their:

- id
- title
- description
- path

### 2. Update sw.js PRECACHE_URLS

Replace the `PRECACHE_URLS` array in `public/sw.js` with:

```javascript
const PRECACHE_URLS = [
    '/',
    '/learnings/',
    // All tool URLs from tools.ts (with trailing slash)
    '/tools/sun-angle-compass/',
    '/tools/random-picker/',
    '/tools/days-until-calculator/',
    '/tools/mini-piano/',
    // ... any new tools
    OFFLINE_PAGE,
    '/favicon.svg',
    '/favicon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-maskable.png',
];
```

**Important**:

- Keep static URLs (/, /learnings/, OFFLINE_PAGE, favicon/icons)
- Add tool URLs in the order they appear in tools.ts
- Use trailing slashes for tool URLs

### 3. Increment CACHE_VERSION

Find the current version (e.g., `'v11'`) and increment to `'v12'`.

Pattern: `const CACHE_VERSION = 'v{N}';` → `const CACHE_VERSION = 'v{N+1}';`

### 4. Update manifest.json shortcuts

Replace the `shortcuts` array in `public/manifest.json` with entries for each tool:

```json
"shortcuts": [
    {
        "name": "{tool.title}",
        "short_name": "{truncated to 12 chars}",
        "description": "{tool.description}",
        "url": "{tool.path}",
        "icons": [
            {
                "src": "/icon-192.png",
                "sizes": "192x192"
            }
        ]
    }
    // ... for each tool
]
```

**Short name rules**:

- Use full title if <= 12 characters
- Otherwise, create a sensible abbreviation (e.g., "Sun Angle Compass" → "Sun Compass")

### 5. Report Changes

Display what was updated:

```
PWA files synchronized from tools.ts

tools.ts has 4 tools:
  1. sun-angle-compass
  2. random-picker
  3. days-until-calculator
  4. mini-piano

public/sw.js:
  - CACHE_VERSION: v11 → v12
  - PRECACHE_URLS: Updated with 4 tool URLs

public/manifest.json:
  - shortcuts: Updated with 4 entries

All PWA files are now in sync!
```

## When to Use

- After manually editing tools.ts
- When you suspect PWA files are out of sync
- As part of cleanup after multiple tool additions
- Before deploying to ensure consistency

## Notes

- This overwrites the shortcuts array - any manual customizations will be lost
- The tool order in manifest.json will match tools.ts order
- Always run `/validate-tools` after to confirm everything is correct
- Consider running `npm run build` to verify the build still succeeds
