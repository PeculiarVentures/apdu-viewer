---
name: 'React Components'
description: 'Guidelines for React component development'
applyTo: 'src/components/**/*.tsx,src/App.tsx'
---
# React Component Guidelines

- Use functional components with hooks.
- Business logic must NOT be mixed into React components.
- All user-visible strings must use i18n translation keys via `useTranslation()`.
- System codes (hex values, APDU codes) are never translated.
- Use `@peculiar/react-components` for UI primitives (Button, Typography, TextField, Dialog, Tabs).
- SVG icons are imported as React components via `vite-plugin-svgr` with `?react` suffix and named with `Icon` postfix.
- Use path aliases (`@/`) for imports from `src/`.
