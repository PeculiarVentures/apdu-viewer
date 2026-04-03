---
name: 'Registries'
description: 'How to add commands, status words, and TLV definitions'
applyTo: 'src/registries/**'
---
# Registry Guidelines

## Adding a New Command Decoder
1. Add an entry to `commandEntries` array in `src/registries/command-registry.ts`.
2. Add corresponding i18n keys in `src/i18n/en.json`, `src/i18n/ru.json`, and `src/i18n/uk.json`.
3. Add a test case in `src/test/registries/command-registry.test.ts`.

## Adding a New Status Word
1. Add an entry to `statusEntries` array in `src/registries/status-registry.ts`.
2. Add i18n keys in all language files.
3. Add a test case in `src/test/registries/status-registry.test.ts`.

## Adding a New TLV Object Definition
1. Add an entry to `objectDefinitions` array in `src/registries/object-registry.ts`.
