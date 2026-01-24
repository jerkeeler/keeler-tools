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
