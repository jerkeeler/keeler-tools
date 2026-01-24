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
