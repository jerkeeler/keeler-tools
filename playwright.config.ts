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
