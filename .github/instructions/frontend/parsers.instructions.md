---
name: 'Parsers'
description: 'How to add or modify APDU log parsers'
applyTo: 'src/parsers/**'
---
# Parser Guidelines

## Adding a New Log Parser
1. Create a new file in `src/parsers/` implementing `TraceParser` interface.
2. Implement `canParse(input)` returning a confidence score (0-100).
3. Implement `parse(input)` returning a `ParseResult` with a `NormalizedTrace`.
4. Register it in `src/parsers/registry.ts`.
5. Add unit tests in `src/test/parsers/`.

## Conventions
- Parser and registry modules must be independently testable.
- All public interfaces must have TypeScript types.
