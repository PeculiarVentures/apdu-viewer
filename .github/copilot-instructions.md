# APDU Viewer — Copilot Instructions

## Project Overview

This is a TypeScript + React application for parsing, analyzing, and visualizing APDU (Application Protocol Data Unit) traces from smart card interactions. Built with Vite, using Biome for linting/formatting, Vitest for testing, and i18next for localization (EN/RU/UK).

## Architecture

The project follows a layered architecture with strict separation of concerns:

1. **Types** (`src/types/`) — All shared interfaces and type definitions.
2. **Parsers** (`src/parsers/`) — Input format detection and parsing via a registry pattern.
3. **Analyzers** (`src/analyzers/`) — APDU command parsing, TLV decoding.
4. **Registries** (`src/registries/`) — Semantic knowledge: command names, status word meanings, TLV object definitions.
5. **i18n** (`src/i18n/`) — Localization resources for EN, RU, and UK.
6. **Components** (`src/components/`) — React UI layer.
7. **Tests** (`src/test/`) — Unit and integration tests.

## Code Quality Rules
- Use **Biome** for linting and formatting. Run `npm run lint` and `npm run format`.
- Use **Vitest** for all tests. Run `npm test`.
- All public interfaces must have TypeScript types.
- Business logic must NOT be mixed into React components.
- Parser and registry modules must be independently testable.
- Use path aliases (`@/`) for imports from `src/`.
- All user-visible strings must use i18n translation keys.
- System codes (hex values, APDU codes) are never translated.
- SVG icons are imported as React components via `vite-plugin-svgr` with `?react` suffix and named with `Icon` postfix.

## Commands
- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm test` — Run tests
- `npm run lint` — Check code with Biome
- `npm run lint:fix` — Auto-fix lint issues
- `npm run typecheck` — TypeScript type checking
- `npm run storybook` — Start Storybook

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/). All commit messages must use this format:

```
<type>(<scope>): <description>
```

### Types
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Formatting (no logic change)
- `refactor` — Code restructuring
- `test` — Adding/updating tests
- `chore` — Build, tooling, config
- `ci` — CI/CD changes

### Rules
- Use English for commit messages
- Use lowercase, imperative mood ("add", not "added")
- Do not end with a period
- Keep first line under 72 characters
- Optional scope: `parsers`, `analyzers`, `registries`, `i18n`, `ui`

### Examples
```
feat(parsers): add PCSC log format parser
fix(analyzers): handle extended length TLV correctly
test: add integration tests for status registry
docs: update README with deployment instructions
ci: add code coverage to CI pipeline
```

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide.

## Detailed Instructions

See `.github/instructions/` for topic-specific guidelines:
- [React Components](.github/instructions/frontend/react.instructions.md)
- [Parsers](.github/instructions/frontend/parsers.instructions.md)
- [Registries](.github/instructions/frontend/registries.instructions.md)
- [Testing](.github/instructions/testing/unit-tests.instructions.md)
