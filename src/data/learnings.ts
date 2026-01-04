export interface Learning {
    id: string;
    date: string; // ISO 8601 format (YYYY-MM-DD)
    title: string;
    description: string;
}

export const learnings: Learning[] = [
    {
        id: 'pwa-implementation',
        date: '2026-01-04',
        title: 'Progressive Web Apps for Browser-Only Tools',
        description:
            "I've always been curious about Progressive Web Apps but never had the right use case—until now. Building browser-only tools with AI made me realize PWAs are perfect for this. Now I can access all my tools offline, even on my phone. Turns out, the technology was just waiting for the right project (and a sophisticated enough AI so that I didn't have to learn service worker lifecycle hooks and caching semantics!)",
    },
    {
        id: 'tailwind-v4-migration',
        date: '2026-01-03',
        title: 'Tailwind v3 Import Issues',
        description:
            "AI doesn't always use the latest and greatest techniques. Started with Tailwind v3 that wasn't properly imported, preventing tree-shaking and causing slow page loads. Migrated to Tailwind v4 with @theme directive for proper bundling.",
    },
];
