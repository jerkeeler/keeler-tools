import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: json-formatter', async ({ page }) => {
    await page.goto('/tools/json-formatter/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('json-formatter.png', {
        fullPage: true,
    });
});
