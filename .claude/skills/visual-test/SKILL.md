---
name: visual-test
description: Run Playwright visual tests after modifying tools
---

# Visual Test

Run visual regression tests to catch UI breakage after modifying or creating tools.

## When to Use

- After completing any tool modification
- After creating a new tool (via /add-tool or manually)
- Before declaring work "done" to the user

## Workflow

### 1. Identify Changed Tools

Determine which tool(s) were modified. If unsure, run all tests.

### 2. Run Visual Tests

For a specific tool:

```bash
npm run test:visual -- --grep "{tool-id}"
```

For all tools:

```bash
npm run test:visual
```

### 3. Interpret Results

**All tests pass:** Report success and continue.

**Tests fail:** Continue to step 4.

### 4. Classify the Failure

Examine the failure output. Playwright shows:

- Expected screenshot path
- Actual screenshot path
- Diff image path (in `test-results/`)

**If you intentionally changed the UI:**

Update the baseline:

```bash
npm run test:visual:update -- --grep "{tool-id}"
```

Then commit the new baselines:

```bash
git add tests/visual/
git commit -m "test: update visual baselines for {tool-id}"
```

**If the change was unintentional:**

Continue to step 5.

### 5. Fix Loop (Max 2 Attempts)

1. Read the diff image from `test-results/` to identify the visual issue
2. Common issues:
    - Overflow on mobile (content wider than viewport)
    - Incorrect padding/margins
    - Missing responsive styles
    - Z-index issues
3. Make a fix to the tool's `.astro` file
4. Re-run the test: `npm run test:visual -- --grep "{tool-id}"`
5. If still failing after 2 attempts, escalate to the user

### 6. Escalate if Needed

If you cannot fix the visual issue after 2 attempts:

1. Describe the visual difference you observed
2. Share the path to the diff image in `test-results/`
3. Ask the user how they'd like to proceed

## Adding Tests for New Tools

When creating a new tool, also create its visual test:

1. Create `tests/visual/{tool-id}.spec.ts` using this template:

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

2. Generate initial baseline:

```bash
npm run test:visual:update -- --grep "{tool-id}"
```

3. Commit the test and baselines.

## Notes

- Tests run against mobile (iPhone 13, 390x844) and desktop (1280x720) viewports
- Time is mocked to June 15, 2026 at 2:00 PM for deterministic screenshots
- Baseline screenshots are stored in `tests/visual/{tool}.spec.ts-snapshots/`
- Test artifacts (actual, diff images) go to `test-results/` (gitignored)
