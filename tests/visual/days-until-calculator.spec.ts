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
