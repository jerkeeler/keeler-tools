---
name: validate-tools
description: Check cross-file consistency for tools registry, service worker, and PWA manifest
---

# Validate Tools

Use this skill to verify that all tool registrations are consistent across files. This catches common errors like missing manifest shortcuts or service worker entries.

## Validation Checks

Perform these checks and report any issues found:

### 1. File Existence Check

- For each entry in `src/data/tools.ts`, verify the corresponding `.astro` file exists at `src/pages/tools/{id}.astro`

### 2. Service Worker Check

- For each tool in `tools.ts`, verify its URL is in `PRECACHE_URLS` array in `public/sw.js`
- URL format should be `/tools/{id}/` (with trailing slash)

### 3. Manifest Shortcuts Check

- For each tool in `tools.ts`, verify there's a matching shortcut in `public/manifest.json`
- Match by URL: `/tools/{id}`

### 4. ID Consistency Check

- Verify tool IDs are kebab-case (lowercase letters, numbers, hyphens only)
- Verify ID matches: filename, tools.ts id, sw.js URL, manifest URL

### 5. Date Format Check

- Verify `createdAt` values in tools.ts are valid ISO 8601 format

## Steps

1. **Read all source files**: Read `src/data/tools.ts`, `public/sw.js`, and `public/manifest.json`

2. **List tool page files**: Use glob to find all `src/pages/tools/*.astro` files

3. **Run each validation check**: Compare data across files

4. **Report results**: Display a summary like:

    ```
    Validation Results:
    - Tool files: OK (4/4 exist)
    - Service worker URLs: OK (4/4 registered)
    - Manifest shortcuts: ISSUE (3/4 - missing: days-until-calculator)
    - ID consistency: OK
    - Date formats: OK

    Overall: 1 issue found
    ```

5. **Provide fix suggestions**: For any issues, explain exactly what needs to be added/fixed

## Example Output

```
Running validation checks...

[PASS] All 4 tool .astro files exist
[PASS] All 4 tools registered in sw.js PRECACHE_URLS
[FAIL] Missing manifest.json shortcut for: days-until-calculator
[PASS] All tool IDs are valid kebab-case
[PASS] All createdAt dates are valid ISO 8601

Summary: 1 issue found

To fix:
1. Add shortcut to public/manifest.json for "days-until-calculator"
```

## Notes

- This skill only reads and reports - it does not modify files
- Use `/sync-pwa` to automatically fix missing sw.js and manifest.json entries
- Run this before committing to catch issues early
