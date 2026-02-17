# passGen

A sleek, web-based password generator built with Vue 3 and Vite. Generate secure passwords directly in your browser.

## Tech Stack

- **Frontend:** Vue 3 (Composition API) + Vite
- **Package Manager:** Bun
- **Deployment:** Docker & Docker Compose
- **Code Style:** Prettier

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js

### Installation

```bash
git clone https://github.com/BurgiSimon/passGen.git
cd passGen
bun install
```

### Development

```bash
bun dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Production Build

```bash
bun run build
```

## Docker

Run the app in a container using Docker Compose:

```bash
docker compose up -d
```

Or build and run manually:

```bash
docker build -t passgen .
docker run -d -p 3000:3000 passgen
```

## Project Structure

```
passGen/
├── public/             # Static assets
├── src/                # Vue application source
├── server.js           # Production server
├── Dockerfile          # Container image definition
├── docker-compose.yml  # Docker Compose config
├── vite.config.js      # Vite configuration
└── index.html          # Entry HTML
```

## IDE Setup

[VS Code](https://code.visualstudio.com/) with the [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension is recommended.

## License

This project is open source.
