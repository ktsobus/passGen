# PassGen

A password generator with a heavily animated, glassmorphic UI built with Vue 3 and Vite.

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **Vite 7** — Build tooling
- **Tailwind CSS v4** — Utility-first styling
- **GSAP** — Animation engine with spring physics
- **WebGL2** — Custom fragment/vertex shaders for visual effects
- **Bun** — Runtime and package manager

## Features

- Configurable password generation with character type toggles and constraints
- Spring-physics slider for password length
- Copy-to-clipboard with user preference persistence via cookies
- Animated password history list
- Interactive particle background (Canvas API)
- Metallic paint WebGL shader effect on logo
- Text scramble/reveal animations
- macOS-style dock navigation with switchable backgrounds

## Setup

```sh
bun install
```

### Development

```sh
bun dev
```

### Production Build

```sh
bun run build
```

### Format

```sh
bun run format
```

### Docker

```sh
docker build -t passgen .
docker run -p 80:80 passgen
```
