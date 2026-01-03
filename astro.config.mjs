// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Minimal Astro integration to generate a sitemap during the build.
 * This avoids the need for extra dependencies while keeping sitemap
 * generation automated from the current route list.
 */
const localSitemap = () => ({
    name: 'local-sitemap',
    hooks: {
        'astro:build:done': async ({ pages, dir, logger }) => {
            const siteUrl = new URL('https://tools.keeler.dev');

            const urls = pages
                .filter(({ pathname }) => pathname !== '/404')
                .map(({ pathname }) => new URL(pathname, siteUrl).toString());

            const sitemap =
                `<?xml version="1.0" encoding="UTF-8"?>\n` +
                `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
                urls.map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>\n`).join('') +
                `</urlset>\n`;

            const { writeFile } = await import('node:fs/promises');
            const { fileURLToPath } = await import('node:url');
            const { join } = await import('node:path');

            const outputPath = join(fileURLToPath(dir), 'sitemap.xml');

            await writeFile(outputPath, sitemap, 'utf-8');

            logger.info(`Generated sitemap with ${urls.length} entries.`);
        },
    },
});

// https://astro.build/config
export default defineConfig({
    site: 'https://tools.keeler.dev',
    integrations: [localSitemap()],
});
