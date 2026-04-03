# APDU Viewer

A web-based tool for parsing, analyzing, and visualizing APDU (Application Protocol Data Unit) traces from smart card interactions.

**[Live Demo](https://peculiarventures.github.io/apdu-viewer/)**

## Features

- Parse macOS CryptoTokenKit APDU logs
- Manual APDU command/response input
- Built-in sample trace for quick demo
- APDU field breakdown (CLA, INS, P1, P2, Lc, Le, Data)
- TLV (Tag-Length-Value) tree with collapsible nodes
- Status word lookup with human-readable descriptions
- Severity indicators (success, warning, error)
- Copy-to-clipboard for hex data blocks
- Localization: English, Russian, Ukrainian
- Responsive layout

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173/apdu-viewer/](http://localhost:5173/apdu-viewer/) in your browser.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint & Format

```bash
npm run lint        # Check with Biome
npm run lint:fix    # Auto-fix
npm run format      # Format
```

### Type Check

```bash
npm run typecheck
```

### Storybook

```bash
npm run storybook
```

## Publishing a New Version

To publish a new version to GitHub Pages:

```bash
npm version patch   # or minor, major
git push && git push --tags
```

GitHub Actions will automatically build and deploy to gh-pages when a version tag is pushed.

## Tech Stack

- **React 18** + **TypeScript** — UI framework
- **Vite 6** — Build tool
- **@peculiar/react-components** — UI component library
- **i18next** — Internationalization
- **Biome** — Linting & formatting
- **Vitest** — Testing
- **Storybook** — Component development
- **vite-plugin-svgr** — SVG as React components

## License

MIT
