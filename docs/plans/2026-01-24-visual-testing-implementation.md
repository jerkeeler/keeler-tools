# Visual Testing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Playwright visual regression tests with a `/visual-test` skill to catch UI breakage during development.

**Architecture:** Playwright tests capture full-page screenshots at mobile (390×844) and desktop (1280×720) viewports. Each tool has its own test file with mocked time/geolocation. A skill orchestrates running tests, updating baselines, and fixing failures.

**Tech Stack:** Playwright Test, TypeScript

---

## Task 1: Install Playwright

**Files:**

- Modify: `package.json`

**Step 1: Install Playwright as dev dependency**

Run:

```bash
npm install -D @playwright/test
```

**Step 2: Install Chromium browser**

Run:

```bash
npx playwright install chromium
```

**Step 3: Verify installation**

Run:

```bash
npx playwright --version
```

Expected: Version number output (e.g., `1.50.0`)

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install Playwright for visual testing"
```

---

## Task 2: Create Playwright Configuration

**Files:**

- Create: `playwright.config.ts`

**Step 1: Create configuration file**

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/visual',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:4321',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'mobile',
            use: {
                ...devices['iPhone 13'],
            },
        },
        {
            name: 'desktop',
            use: {
                viewport: { width: 1280, height: 720 },
            },
        },
    ],
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.002,
        },
    },
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:4321',
        reuseExistingServer: !process.env.CI,
    },
});
```

**Step 2: Commit**

```bash
git add playwright.config.ts
git commit -m "chore: add Playwright configuration with mobile and desktop projects"
```

---

## Task 3: Add npm Scripts and Update .gitignore

**Files:**

- Modify: `package.json`
- Modify: `.gitignore`

**Step 1: Add visual test scripts to package.json**

Add to the `scripts` section in `package.json`:

```json
"test:visual": "playwright test",
"test:visual:update": "playwright test --update-snapshots"
```

**Step 2: Add test-results to .gitignore**

Add to `.gitignore`:

```
# Playwright test artifacts
test-results/
playwright-report/
```

**Step 3: Commit**

```bash
git add package.json .gitignore
git commit -m "chore: add visual test npm scripts and gitignore entries"
```

---

## Task 4: Create Test Directory Structure

**Files:**

- Create: `tests/visual/.gitkeep`

**Step 1: Create test directory**

Run:

```bash
mkdir -p tests/visual
touch tests/visual/.gitkeep
```

**Step 2: Commit**

```bash
git add tests/
git commit -m "chore: create visual tests directory"
```

---

## Task 5: Create Sun Angle Compass Visual Test

**Files:**

- Create: `tests/visual/sun-angle-compass.spec.ts`

**Step 1: Create test file**

Create `tests/visual/sun-angle-compass.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: sun-angle-compass', async ({ page, context }) => {
    await context.setGeolocation({ latitude: 40.7128, longitude: -74.006 });
    await context.grantPermissions(['geolocation']);

    await page.goto('/tools/sun-angle-compass/');
    await page.waitForLoadState('networkidle');

    // Wait for any canvas rendering to complete
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('sun-angle-compass.png', {
        fullPage: true,
    });
});
```

**Step 2: Run test to generate baseline (will fail first time)**

Run:

```bash
npm run test:visual:update -- --grep "sun-angle-compass"
```

Expected: Test passes and creates baseline screenshots in `tests/visual/sun-angle-compass.spec.ts-snapshots/`

**Step 3: Verify baselines exist**

Run:

```bash
ls tests/visual/sun-angle-compass.spec.ts-snapshots/
```

Expected: `sun-angle-compass-mobile.png` and `sun-angle-compass-desktop.png`

**Step 4: Commit**

```bash
git add tests/visual/
git commit -m "test: add visual test for sun-angle-compass"
```

---

## Task 6: Create Random Picker Visual Test

**Files:**

- Create: `tests/visual/random-picker.spec.ts`

**Step 1: Create test file**

Create `tests/visual/random-picker.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: random-picker', async ({ page }) => {
    await page.goto('/tools/random-picker/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('random-picker.png', {
        fullPage: true,
    });
});
```

**Step 2: Generate baseline**

Run:

```bash
npm run test:visual:update -- --grep "random-picker"
```

**Step 3: Commit**

```bash
git add tests/visual/
git commit -m "test: add visual test for random-picker"
```

---

## Task 7: Create Days Until Calculator Visual Test

**Files:**

- Create: `tests/visual/days-until-calculator.spec.ts`

**Step 1: Create test file**

Create `tests/visual/days-until-calculator.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: days-until-calculator', async ({ page }) => {
    await page.goto('/tools/days-until-calculator/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('days-until-calculator.png', {
        fullPage: true,
    });
});
```

**Step 2: Generate baseline**

Run:

```bash
npm run test:visual:update -- --grep "days-until-calculator"
```

**Step 3: Commit**

```bash
git add tests/visual/
git commit -m "test: add visual test for days-until-calculator"
```

---

## Task 8: Create Mini Piano Visual Test

**Files:**

- Create: `tests/visual/mini-piano.spec.ts`

**Step 1: Create test file**

Create `tests/visual/mini-piano.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: mini-piano', async ({ page }) => {
    await page.goto('/tools/mini-piano/');
    await page.waitForLoadState('networkidle');

    // Wait for keyboard to render
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('mini-piano.png', {
        fullPage: true,
    });
});
```

**Step 2: Generate baseline**

Run:

```bash
npm run test:visual:update -- --grep "mini-piano"
```

**Step 3: Commit**

```bash
git add tests/visual/
git commit -m "test: add visual test for mini-piano"
```

---

## Task 9: Create Chromatic Tuner Visual Test

**Files:**

- Create: `tests/visual/chromatic-tuner.spec.ts`

**Step 1: Create test file**

Create `tests/visual/chromatic-tuner.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: chromatic-tuner', async ({ page }) => {
    await page.goto('/tools/chromatic-tuner/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('chromatic-tuner.png', {
        fullPage: true,
    });
});
```

**Step 2: Generate baseline**

Run:

```bash
npm run test:visual:update -- --grep "chromatic-tuner"
```

**Step 3: Commit**

```bash
git add tests/visual/
git commit -m "test: add visual test for chromatic-tuner"
```

---

## Task 10: Create Tools Coverage Meta-Test

**Files:**

- Create: `tests/visual/tools-coverage.spec.ts`

**Step 1: Create meta-test file**

Create `tests/visual/tools-coverage.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { tools } from '../../src/data/tools';
import * as fs from 'fs';
import * as path from 'path';

test('every tool in tools.ts has a visual test', () => {
    const testDir = path.join(__dirname);

    for (const tool of tools) {
        const specFile = path.join(testDir, `${tool.id}.spec.ts`);
        const exists = fs.existsSync(specFile);
        expect(exists, `Missing visual test for tool: ${tool.id}`).toBe(true);
    }
});
```

**Step 2: Run meta-test to verify it passes**

Run:

```bash
npm run test:visual -- --grep "every tool"
```

Expected: PASS

**Step 3: Commit**

```bash
git add tests/visual/
git commit -m "test: add meta-test ensuring all tools have visual tests"
```

---

## Task 11: Run All Visual Tests

**Step 1: Run full visual test suite**

Run:

```bash
npm run test:visual
```

Expected: All tests pass (10 tests: 5 tools × 2 viewports + 1 meta-test × 2 projects, though meta-test runs same on both)

**Step 2: Verify baseline screenshot count**

Run:

```bash
find tests/visual -name "*.png" | wc -l
```

Expected: 10 screenshots (5 tools × 2 viewports)

---

## Task 12: Create /visual-test Skill

**Files:**

- Create: `.claude/skills/visual-test/SKILL.md`

**Step 1: Create skill directory and file**

Create `.claude/skills/visual-test/SKILL.md`:

````markdown
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
````

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

- Tests run against mobile (iPhone 13, 390×844) and desktop (1280×720) viewports
- Time is mocked to June 15, 2026 at 2:00 PM for deterministic screenshots
- Baseline screenshots are stored in `tests/visual/{tool}.spec.ts-snapshots/`
- Test artifacts (actual, diff images) go to `test-results/` (gitignored)

````

**Step 2: Commit**

```bash
git add .claude/skills/visual-test/
git commit -m "feat: add /visual-test skill for visual regression testing"
````

---

## Task 13: Update /add-tool Skill

**Files:**

- Modify: `.claude/skills/add-tool/SKILL.md`

**Step 1: Add visual test creation to the skill**

In `.claude/skills/add-tool/SKILL.md`, add after step 6 (Update manifest.json):

```markdown
### 7. Create Visual Test

Create `tests/visual/{tool-id}.spec.ts`:

\`\`\`typescript
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
\`\`\`

### 8. Generate Initial Baseline

Run:

\`\`\`bash
npm run test:visual:update -- --grep "{tool-id}"
\`\`\`

This creates the initial baseline screenshots for the new tool.
```

Update step numbers for "Confirm Success" (now step 9) and update the success message to include:

```markdown
- tests/visual/{tool-id}.spec.ts (created)
- tests/visual/{tool-id}.spec.ts-snapshots/ (baseline screenshots)
```

**Step 2: Commit**

```bash
git add .claude/skills/add-tool/
git commit -m "feat: update /add-tool skill to create visual tests"
```

---

## Task 14: Update CLAUDE.md

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Add visual test commands**

Add to the Commands section in `CLAUDE.md`:

```markdown
npm run test:visual # Run visual regression tests
npm run test:visual:update # Update baseline screenshots
```

**Step 2: Add visual testing section**

Add a new section after "Adding a New Tool":

```markdown
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
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add visual testing documentation to CLAUDE.md"
```

---

## Task 15: Final Verification

**Step 1: Run all visual tests one more time**

Run:

```bash
npm run test:visual
```

Expected: All tests pass

**Step 2: Verify skill invocation**

Test that `/visual-test` skill exists:

```bash
ls .claude/skills/visual-test/SKILL.md
```

Expected: File exists

**Step 3: Format and final commit**

Run:

```bash
npm run format
git add -A
git status
```

If any uncommitted changes, commit them:

```bash
git commit -m "chore: format and finalize visual testing setup"
```

---

## Summary

After completing all tasks, you will have:

1. Playwright installed and configured for mobile + desktop viewports
2. Visual tests for all 5 existing tools
3. A meta-test ensuring coverage for all tools
4. `/visual-test` skill for Claude to use after tool changes
5. Updated `/add-tool` skill that creates visual tests for new tools
6. Updated CLAUDE.md documentation
