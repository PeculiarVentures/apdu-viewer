---
name: 'Unit Tests'
description: 'Testing conventions for the APDU Viewer project'
applyTo: 'src/test/**'
---
# Testing Guidelines

- Use **Vitest** for all tests. Run `npm test`.
- Parser and registry modules must be independently testable.
- Place tests in `src/test/` mirroring the source structure.
- Use `@testing-library/react` for component tests.
- Use `jsdom` environment for browser API tests.
