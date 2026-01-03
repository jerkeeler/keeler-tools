# Keeler Tools

Small browser-only tools that live at tools.keeler.dev. This repo is a playground for vibe coding and AI-assisted development in a fun, exploratory way.

## Project structure

- `src/pages/index.astro` is the hand-edited tool index.
- `src/pages/tools/` holds one page per tool, isolated and browser-only.
- `src/layouts/Layout.astro` is the shared layout and metadata.
- `src/styles/global.css` defines global Tailwind layers and base styles.
- `tailwind.config.mjs` contains theme tokens (brand colors, fonts).

## Commands

All commands run from the repo root.

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
