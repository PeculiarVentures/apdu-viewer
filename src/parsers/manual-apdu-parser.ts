import { analyzeTransaction } from "@/analyzers/apdu-analyzer";
import type {
  ApduTransaction,
  ParseResult,
  TraceParser,
  TraceRecord,
} from "@/types";

function parseHexInput(input: string): number[] {
  const cleaned = input.replace(/[^0-9a-fA-F\s]/g, "").trim();
  if (!cleaned) return [];

  // Check if space-separated hex bytes
  if (cleaned.includes(" ")) {
    return cleaned
      .split(/\s+/)
      .filter((s) => s.length > 0)
      .map((s) => Number.parseInt(s, 16));
  }

  // Continuous hex string
  const bytes: number[] = [];
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes.push(Number.parseInt(cleaned.substring(i, i + 2), 16));
  }
  return bytes;
}

function bytesToHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ");
}

export const manualApduParser: TraceParser = {
  id: "manual-apdu",
  name: "Manual APDU Input",
  description: "Parser for manually entered APDU command/response hex strings",

  canParse(input: string): number {
    const trimmed = input.trim();
    // Must be short (manual input), all hex chars or spaces
    if (trimmed.length > 2000) return 0;
    const lines = trimmed.split("\n").filter((l) => l.trim());
    if (lines.length > 4) return 0;

    // Check if lines look like hex data (no timestamps, no "APDU ->" markers)
    let hexLineCount = 0;
    for (const line of lines) {
      const cleaned = line.trim().replace(/\s+/g, "");
      if (/^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length >= 4) {
        hexLineCount++;
      }
    }
    return hexLineCount > 0 ? 40 : 0;
  },

  parse(input: string): ParseResult {
    const lines = input
      .trim()
      .split("\n")
      .filter((l) => l.trim());
    const records: TraceRecord[] = [];
    const transactions: ApduTransaction[] = [];
    let txIndex = 0;

    // Interpret first line as command, second as response (if any)
    const commandLine = lines[0];
    const responseLine = lines[1];

    if (commandLine) {
      const commandBytes = parseHexInput(commandLine);
      if (commandBytes.length >= 4) {
        const commandRecord: TraceRecord = {
          id: "rec-0",
          direction: "command",
          rawLine: commandLine.trim(),
          rawHex: bytesToHex(commandBytes),
          bytes: commandBytes,
        };
        records.push(commandRecord);

        if (responseLine) {
          const responseBytes = parseHexInput(responseLine);
          if (responseBytes.length >= 2) {
            const responseRecord: TraceRecord = {
              id: "rec-1",
              direction: "response",
              rawLine: responseLine.trim(),
              rawHex: bytesToHex(responseBytes),
              bytes: responseBytes,
            };
            records.push(responseRecord);

            const sw1 = responseBytes[responseBytes.length - 2]!;
            const sw2 = responseBytes[responseBytes.length - 1]!;
            const tx: ApduTransaction = {
              id: `tx-${txIndex}`,
              index: txIndex++,
              command: commandRecord,
              response: responseRecord,
              status: {
                sw1,
                sw2,
                hex: `${sw1.toString(16).padStart(2, "0").toUpperCase()}${sw2.toString(16).padStart(2, "0").toUpperCase()}`,
              },
            };
            tx.analysis = analyzeTransaction(tx);
            transactions.push(tx);
          }
        } else {
          const tx: ApduTransaction = {
            id: `tx-${txIndex}`,
            index: txIndex++,
            command: commandRecord,
          };
          tx.analysis = analyzeTransaction(tx);
          transactions.push(tx);
        }
      }
    }

    return {
      format: "manual-apdu",
      trace: {
        id: `trace-manual-${Date.now()}`,
        sourceFormat: "manual-apdu",
        transactions,
        records,
        warnings: [],
        errors: [],
      },
      errors: [],
      warnings: [],
      stats: {
        totalLines: lines.length,
        parsedLines: records.length,
        skippedLines: 0,
        errorLines: 0,
        commandCount: records.filter((r) => r.direction === "command").length,
        responseCount: records.filter((r) => r.direction === "response").length,
        transactionCount: transactions.length,
      },
    };
  },
};
