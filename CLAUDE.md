# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PassGen is a password generator web app built with Vue 3 (Composition API), Vite, and Tailwind CSS 4. It features interactive visual effects (WebGL2 shaders, Canvas particle systems, GSAP animations) and a glass morphism UI.

## Commands

```bash
bun run dev       # Start dev server (localhost:5173)
bun run build     # Production build to /dist
bun run preview   # Preview production build
bun run format    # Format with Prettier
```

Docker: `docker compose up -d` (serves on port 3000)

## Architecture

- **Entry:** `index.html` → `src/main.js` → Vue app with Router
- **Single route** (`/`) renders `HomeView.vue` which composes all components
- **Core logic:** `src/components/PasswordGen.vue` — password generation, character set toggles, cookie-based preference persistence, clipboard copy
- **Visual effect components:**
  - `MetallicPaint.vue` — WebGL2 shader with GLSL (depth mapping, liquid distortion)
  - `DotGrid.vue` — Canvas 2D interactive dot grid with GSAP InertiaPlugin physics
  - `DecryptedText.vue` — character scrambling/reveal text animation
  - `ElasticSlider.vue` — animated range slider

## Key Conventions

- All components use `<script setup>` with Composition API
- Props defined with TypeScript interfaces via `withDefaults(defineProps<...>())`
- Styling: Tailwind utilities + scoped CSS; primary accent color is `#27FF64`
- Formatting: no semicolons, single quotes, 100 char print width (see `.prettierrc.json`)
- Path alias: `@/` maps to `./src/`

## Production

`server.js` is a Bun HTTP server that serves `/dist` with SPA fallback. The Dockerfile uses multi-stage Bun builds.
