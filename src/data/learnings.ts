export interface Learning {
    id: string;
    date: string; // ISO 8601 format (YYYY-MM-DD)
    title: string;
    description: string;
}

export const learnings: Learning[] = [
    {
        id: 'tailwind-v4-migration',
        date: '2026-01-03',
        title: 'Tailwind v3 Import Issues',
        description:
            "AI doesn't always use the latest and greatest techniques. Started with Tailwind v3 that wasn't properly imported, preventing tree-shaking and causing slow page loads. Migrated to Tailwind v4 with @theme directive for proper bundling.",
    },
];
