import { analyzeTransaction } from "@/analyzers/apdu-analyzer";
import type {
  ApduTransaction,
  ParseResult,
  TraceError,
  TraceParser,
  TraceRecord,
  TraceWarning,
} from "@/types";

const LOG_LINE_REGEX =
  /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+[+-]\d{4})\s+\S+\s+\S+\s+\S+\s+\d+\s+\d+\s+\S+\s+\([^)]+\)\s+\[[^\]]+\]\s+APDU\s+(->|<-)\s+(.+)$/;

const HEADER_REGEX = /^Timestamp\s+Thread\s+Type/;
const FILTER_REGEX = /^Filtering the log data/;
const SKIP_REGEX = /^Skipping info and debug/;
const ACTIVITY_REGEX = /^Activity\s/;

function parseHexString(hex: string): number[] {
  return hex
    .trim()
    .split(/\s+/)
    .filter((s) => s.length > 0)
    .map((s) => Number.parseInt(s, 16));
}

export const macosLogParser: TraceParser = {
  id: "macos-log-show-apdu",
  name: "macOS Unified Log (APDU)",
  description: "Parser for macOS `log show` output filtered for APDU messages",

  canParse(input: string): number {
    const lines = input.split("\n").slice(0, 20);
    let score = 0;
    for (const line of lines) {
      if (FILTER_REGEX.test(line) || HEADER_REGEX.test(line)) score += 20;
      if (LOG_LINE_REGEX.test(line)) score += 30;
    }
    return Math.min(score, 100);
  },

  parse(input: string): ParseResult {
    const lines = input.split("\n");
    const records: TraceRecord[] = [];
    const warnings: TraceWarning[] = [];
    const errors: TraceError[] = [];
    let parsedLines = 0;
    let skippedLines = 0;
    let errorLines = 0;
    let recordIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!.trim();
      if (
        !line ||
        HEADER_REGEX.test(line) ||
        FILTER_REGEX.test(line) ||
        SKIP_REGEX.test(line) ||
        ACTIVITY_REGEX.test(line)
      ) {
        skippedLines++;
        continue;
      }

      const match = LOG_LINE_REGEX.exec(lines[i]!);
      if (!match) {
        // Try to see if this line has APDU at all
        if (lines[i]!.includes("APDU")) {
          errorLines++;
          errors.push({
            line: i + 1,
            message: "Could not parse APDU log line",
            context: lines[i]!.substring(0, 120),
          });
        } else {
          skippedLines++;
        }
        continue;
      }

      parsedLines++;
      const timestamp = match[1]!;
      const direction = match[2] === "->" ? "command" : "response";
      const hexPayload = match[3]!;
      const bytes = parseHexString(hexPayload);

      records.push({
        id: `rec-${recordIndex++}`,
        timestamp,
        direction,
        rawLine: lines[i]!,
        rawHex: hexPayload.trim(),
        bytes,
      });
    }

    // Pairing
    const transactions: ApduTransaction[] = [];
    let txIndex = 0;
    let pendingCommand: TraceRecord | undefined;

    for (const record of records) {
      if (record.direction === "command") {
        if (pendingCommand) {
          // Previous command had no response = orphan
          const tx: ApduTransaction = {
            id: `tx-${txIndex}`,
            index: txIndex++,
            startedAt: pendingCommand.timestamp,
            command: pendingCommand,
          };
          tx.analysis = analyzeTransaction(tx);
          if (tx.analysis?.severity) {
            // keep it
          }
          transactions.push(tx);
          warnings.push({
            message: "Command without response (orphan)",
            context: pendingCommand.rawHex,
          });
        }
        pendingCommand = record;
      } else {
        // response
        if (pendingCommand) {
          const sw1 = record.bytes[record.bytes.length - 2];
          const sw2 = record.bytes[record.bytes.length - 1];
          const tx: ApduTransaction = {
            id: `tx-${txIndex}`,
            index: txIndex++,
            startedAt: pendingCommand.timestamp,
            completedAt: record.timestamp,
            command: pendingCommand,
            response: record,
            status:
              sw1 !== undefined && sw2 !== undefined
                ? {
                    sw1,
                    sw2,
                    hex: `${sw1.toString(16).padStart(2, "0").toUpperCase()}${sw2.toString(16).padStart(2, "0").toUpperCase()}`,
                  }
                : undefined,
          };
          tx.analysis = analyzeTransaction(tx);
          transactions.push(tx);
          pendingCommand = undefined;
        } else {
          // Orphan response
          const sw1 = record.bytes[record.bytes.length - 2];
          const sw2 = record.bytes[record.bytes.length - 1];
          const tx: ApduTransaction = {
            id: `tx-${txIndex}`,
            index: txIndex++,
            startedAt: record.timestamp,
            response: record,
            status:
              sw1 !== undefined && sw2 !== undefined
                ? {
                    sw1,
                    sw2,
                    hex: `${sw1.toString(16).padStart(2, "0").toUpperCase()}${sw2.toString(16).padStart(2, "0").toUpperCase()}`,
                  }
                : undefined,
          };
          tx.analysis = analyzeTransaction(tx);
          transactions.push(tx);
          warnings.push({
            message: "Response without command (orphan)",
            context: record.rawHex,
          });
        }
      }
    }

    // Flush pending command
    if (pendingCommand) {
      const tx: ApduTransaction = {
        id: `tx-${txIndex}`,
        index: txIndex++,
        startedAt: pendingCommand.timestamp,
        command: pendingCommand,
      };
      tx.analysis = analyzeTransaction(tx);
      transactions.push(tx);
      warnings.push({
        message: "Command without response (orphan)",
        context: pendingCommand.rawHex,
      });
    }

    const commandCount = records.filter(
      (r) => r.direction === "command",
    ).length;
    const responseCount = records.filter(
      (r) => r.direction === "response",
    ).length;

    return {
      format: "macos-log-show-apdu",
      trace: {
        id: `trace-${Date.now()}`,
        sourceFormat: "macos-log-show-apdu",
        transactions,
        records,
        warnings,
        errors,
      },
      errors,
      warnings,
      stats: {
        totalLines: lines.length,
        parsedLines,
        skippedLines,
        errorLines,
        commandCount,
        responseCount,
        transactionCount: transactions.length,
      },
    };
  },
};
