# Visual Testing with Playwright

## Overview

Add Playwright visual regression tests to catch UI breakage (especially on mobile) during Claude Code's development loop. Tests run after every tool change, before declaring work complete.

## Goals

- Catch visual breakage early, especially mobile layout issues
- Detect regressions across tools
- Provide Claude Code with a feedback loop during development
- Auto-accept intentional changes, attempt fixes for unexpected diffs

## Playwright Setup

**Dependencies:**

- `@playwright/test` (dev dependency)
- Chromium browser (installed via Playwright)

**Configuration (`playwright.config.ts`):**

- Two projects: `mobile` (390×844, iPhone 13) and `desktop` (1280×720)
- Base URL: `localhost:4321`
- Screenshot comparison with 0.2% pixel diff tolerance
- Snapshots stored in `tests/visual/__snapshots__/`

**npm scripts:**

- `npm run test:visual` - run all visual tests
- `npm run test:visual:update` - update baseline screenshots

## Directory Structure

```
tests/
  visual/
    sun-angle-compass.spec.ts
    random-picker.spec.ts
    days-until-calculator.spec.ts
    mini-piano.spec.ts
    chromatic-tuner.spec.ts
    tools-coverage.spec.ts    # meta-test ensuring all tools have tests
    __snapshots__/            # baseline screenshots (checked into git)
test-results/                 # test artifacts (gitignored)
```

## Test File Pattern

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: tool-name', async ({ page, context }) => {
    // Tool-specific mocking (e.g., geolocation)
    await context.setGeolocation({ latitude: 40.7128, longitude: -74.006 });

    await page.goto('/tools/tool-name/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('tool-name.png', {
        fullPage: true,
    });
});
```

## Mocking Strategy

| Tool                  | Mocking Required   |
| --------------------- | ------------------ |
| Sun Angle Compass     | Time + Geolocation |
| Days Until Calculator | Time               |
| Random Picker         | Time only          |
| Mini Piano            | Time only          |
| Chromatic Tuner       | Time only          |

## Meta-Test (tools-coverage.spec.ts)

- Imports tools array from `src/data/tools.ts`
- Verifies every tool ID has a corresponding `.spec.ts` file
- Fails build if coverage gap exists

## `/visual-test` Skill Workflow

1. **Ensure dev server running** - Start if localhost:4321 is down
2. **Run visual tests** - `npm run test:visual` for changed tool(s)
3. **Interpret results:**
    - All pass → Report success
    - Failures → Continue to classification
4. **Classify failure:**
    - Intentional UI change → Update baselines, commit
    - Unexpected diff → Attempt fix
5. **Fix loop (max 2 attempts):**
    - Examine diff image in `test-results/`
    - Identify and fix the issue
    - Re-run test
    - If still failing → Escalate to user with diff images

## Integration

**`/add-tool` updates:**

- Generate test file from template when creating new tools
- Invoke `/visual-test` to create initial baselines

**`CLAUDE.md` updates:**

- Document visual test commands
- Note that baselines are checked into git
- Instruct to run visual tests after tool modifications

## Baseline Screenshots

10 total baselines (5 tools × 2 viewports):

- `{tool-name}-mobile.png`
- `{tool-name}-desktop.png`

## Initial Setup Steps

1. Install Playwright: `npm install -D @playwright/test`
2. Install browsers: `npx playwright install chromium`
3. Create `playwright.config.ts`
4. Create test files for all 5 existing tools
5. Add `test-results/` to `.gitignore`
6. Generate initial baselines: `npm run test:visual:update`
7. Commit config, tests, and snapshots
