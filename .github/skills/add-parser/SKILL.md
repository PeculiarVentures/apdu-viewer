---
name: add-parser
description: 'Add support for a new APDU log format by creating a parser module with canParse/parse methods, registering it, and adding tests.'
---
# Add New Parser

## When to Use

When adding support for a new log format (e.g., PC/SC logs, custom token formats).

## Steps

1. **Create parser file** in `src/parsers/`:

   ```ts
   import type { TraceParser, ParseResult } from "@/types";

   export const myParser: TraceParser = {
     id: "my-format",
     name: "My Format",
     canParse(input: string): number {
       // Return 0-100 confidence score
       return 0;
     },
     parse(input: string): ParseResult {
       // Parse and return normalized trace
     },
   };
   ```

2. **Register** in `src/parsers/registry.ts`:

   ```ts
   import { myParser } from "./my-parser";
   // Add to parsers array
   ```

3. **Add tests** in `src/test/parsers/my-parser.test.ts`:
   - Test `canParse()` returns correct confidence
   - Test `parse()` returns valid structure
   - Test pairing logic
   - Test edge cases (empty input, malformed lines)

4. **Add test fixtures** in `src/test/fixtures/`
