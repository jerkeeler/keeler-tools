# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Keeler Tools is a collection of browser-only tools built with Astro and Tailwind CSS. This is a playground for vibe coding and AI-assisted development - exploratory, fun, and focused on small, isolated tools.

**Site:** https://tools.keeler.dev

## Commands

| Command                | Purpose                            |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start dev server at localhost:4321 |
| `npm run build`        | Build production site to ./dist/   |
| `npm run preview`      | Preview production build locally   |
| `npm run format`       | Format all files with Prettier     |
| `npm run format:check` | Check formatting without changes   |

## Architecture

### Page Structure

Each tool is a self-contained Astro page in `src/pages/tools/`. Tools are browser-only with all logic in `<script>` tags - no server-side processing or backend dependencies.

- `src/pages/index.astro` - Hand-edited tool index (manually add new tools here)
- `src/pages/tools/*.astro` - Individual tool pages
- `src/layouts/Layout.astro` - Shared layout with meta tags and footer
- `src/components/ToolHeader.astro` - Reusable tool page header component

### Styling

- `src/styles/global.css` - Tailwind imports and global base styles
- `tailwind.config.mjs` - Theme configuration with brand colors (#24d1f8 and #1b96b4)
- Uses system font stack (system-ui) throughout

### Build Integration

The project includes a custom Astro integration (`localSitemap`) defined in `astro.config.mjs` that automatically generates a sitemap during build. This avoids external dependencies for sitemap generation.

### Tool Pattern

When creating a new tool:

1. Create a new `.astro` file in `src/pages/tools/`
2. Import and use the `Layout` and `ToolHeader` components
3. Implement all functionality in a `<script>` tag with client-side JavaScript
4. Keep everything browser-native - no API calls or server dependencies
5. Use localStorage for persistence if needed (see random-picker.astro:151)
6. Manually add the tool to `src/pages/index.astro` with appropriate styling

### Dependencies

- **astro**: SSG framework
- **tailwindcss**: Utility-first CSS
- **canvas-confetti**: Used for visual effects (see random-picker)
- **prettier** + **prettier-plugin-astro**: Code formatting
- **husky**: Git hooks (prepare script)

Small JavaScript libraries that add delight are acceptable additions.
