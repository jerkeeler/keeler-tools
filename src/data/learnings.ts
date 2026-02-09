export interface Learning {
    id: string;
    date: string; // ISO 8601 format (YYYY-MM-DD)
    title: string;
    description: string;
}

export const learnings: Learning[] = [
    {
        id: 'ai-harness-matters',
        date: '2026-02-09',
        title: 'Not All AI Harnesses Are Created Equal',
        description:
            "Same model, same prompts, same sub-agent architecture—different results. I ran the exact same QR code creator implementation plan through both Cursor and Claude Code. Claude Code one-shot the entire QR encoding engine (a self-contained Reed-Solomon encoder from scratch). Cursor took multiple attempts and more hand-holding to get there. The harness—how the IDE orchestrates tool calls, manages context, and sequences sub-agent work—matters just as much as the underlying model. It's a good reminder that evaluating AI coding tools isn't just about which LLM they use; the surrounding infrastructure makes or breaks the experience.",
    },
    {
        id: 'ai-self-correction-tradeoffs',
        date: '2026-02-09',
        title: "AI Doesn't Always Get It Right—But It Self-Corrects in Surprising Ways",
        description:
            "While building a QR code encoder from scratch, the AI introduced subtle bugs in the Reed-Solomon error correction and format info placement that made the output unscannable. When I reported the problem, it autonomously installed a third-party QR library, compared its own output against the reference implementation module-by-module, identified the exact bugs, fixed them, and then uninstalled the package—all without asking. Smart debugging strategy, but also a reminder that AI will sometimes reach for external dependencies on its own. It's a double-edged sword: impressive problem-solving instinct, but you need to watch what gets added to your project, even temporarily.",
    },
    {
        id: 'ai-layout-vs-ambition',
        date: '2026-02-07',
        title: 'AI Stumbles on Layout but Unlocks Ambition',
        description:
            "Claude Code can struggle with surprisingly basic CSS—centering a div or picking the right max-width took more back-and-forth than writing the entire tool. But here's the trade-off I keep coming back to: with firm guidance and active oversight, it lets me tackle projects I'd never attempt on my own due to time constraints. The AI handles the tedious scaffolding while I steer the ship. It's not autopilot, but it's a hell of a co-pilot.",
    },
    {
        id: 'mobile-ai-development',
        date: '2026-01-05',
        title: 'AI Development From Anywhere',
        description:
            "There's something magical about having an idea while out and about, kicking off Claude Code from my phone, and picking up where I left off later. The friction between thought and implementation has never been lower. Now I'm wondering: do I want to set this up on my Mac mini server and really lean into the remote development workflow? The rabbit hole beckons.",
    },
    {
        id: 'ai-performance-blind-spots',
        date: '2026-01-04',
        title: "AI Doesn't Understand Performance (Yet)",
        description:
            "The initial version of this site had gorgeous, dreamy blur effects—massive 120px CSS blurs layered on top of each other. Looked stunning in Chrome. In Safari? Completely unusable. The AI optimized for aesthetics without considering cross-browser performance implications. It's not even a design choice I would have made myself, but when you're pair-programming with AI, you're living in its world. Lesson learned: always test in Safari before shipping.",
    },
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
