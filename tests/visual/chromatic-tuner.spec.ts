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
