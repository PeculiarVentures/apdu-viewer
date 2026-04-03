# Contributing

## Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring (no feature or fix) |
| `test` | Adding or updating tests |
| `chore` | Build, tooling, or auxiliary changes |
| `ci` | CI/CD pipeline changes |

### Scope (optional)

Use the module name as scope when the change is scoped to a specific area:

- `parsers` — Parser modules
- `analyzers` — APDU/TLV analysis
- `registries` — Command/status/object registries
- `i18n` — Localization
- `ui` — React components and styles

### Examples

```
feat: add PCSC log format parser
feat(registries): add GlobalPlatform command definitions
fix(parsers): handle malformed timestamp in macOS logs
test: add integration tests for TLV nested structures
docs: update README with new parser instructions
ci: add code coverage reporting to CI pipeline
style: fix formatting issues reported by Biome
refactor(analyzers): extract APDU case detection logic
chore: update dependencies to latest versions
```

### Rules

1. Use lowercase for the description
2. Do not end the description with a period
3. Use imperative mood ("add", not "added" or "adds")
4. Keep the first line under 72 characters
5. Reference issues when applicable: `fix: resolve crash on empty input (#42)`
