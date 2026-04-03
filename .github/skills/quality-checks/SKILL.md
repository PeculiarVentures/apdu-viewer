---
name: quality-checks
description: 'Run the full quality check pipeline: TypeScript type checking, Biome linting/formatting, Vitest tests, and production build.'
---
# Quality Checks

## Running All Checks

```bash
npm run typecheck    # TypeScript type checking
npm run lint         # Biome lint + format check
npm test             # Vitest test suite
npm run build        # Production build
```

## Before Committing

1. Run `npm run lint:fix` to auto-fix formatting
2. Run `npm test` to verify all tests pass
3. Run `npm run typecheck` to catch type errors
4. Run `npm run build` to verify production build

## Writing Tests

- Place tests in `src/test/` mirroring source structure
- Use `describe`/`it` from vitest
- Import from `@/` path aliases
- Test fixtures go in `src/test/fixtures/`
- Test both happy path and error cases

## CI Pipeline

GitHub Actions runs on every push/PR to main:

- Install → Typecheck → Lint → Test → Build
