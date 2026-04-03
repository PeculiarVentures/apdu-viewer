---
name: add-decoder
description: 'Add new APDU command decoders, status word definitions, or TLV data object definitions to the registry modules.'
---
# Add New APDU Decoder

## When to Use

When adding support for new APDU commands, status words, or TLV data objects.

## Adding a Command

1. Add entry to `commandEntries` in `src/registries/command-registry.ts`
2. Add i18n key in `src/i18n/en.json` under `apdu.command.*`
3. Add i18n key in `src/i18n/ru.json` under `apdu.command.*`
4. Add i18n key in `src/i18n/uk.json` under `apdu.command.*`
5. Add test in `src/test/registries/command-registry.test.ts`

## Adding a Status Word

1. Add entry to `statusEntries` in `src/registries/status-registry.ts`
2. Add i18n keys in all language files under `apdu.status.*`
3. Add test in `src/test/registries/status-registry.test.ts`

## Adding a TLV Object

1. Add entry to `objectDefinitions` in `src/registries/object-registry.ts`
2. Optionally add i18n key for description

## Checklist

- [ ] Added to correct registry
- [ ] i18n keys added in EN, RU, and UK
- [ ] Test added and passing
- [ ] No UI changes needed (registries are auto-discovered)
