import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-15T14:00:00'));
});

test('visual: qr-code-creator', async ({ page }) => {
    await page.goto('/tools/qr-code-creator/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('qr-code-creator.png', {
        fullPage: true,
    });
});
