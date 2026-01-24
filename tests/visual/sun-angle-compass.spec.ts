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
