import type { NormalizedTrace, TraceError, TraceWarning } from "./trace";

export interface ParseResult {
  format: string;
  trace: NormalizedTrace;
  errors: TraceError[];
  warnings: TraceWarning[];
  stats: ParseStats;
}

export interface ParseStats {
  totalLines: number;
  parsedLines: number;
  skippedLines: number;
  errorLines: number;
  commandCount: number;
  responseCount: number;
  transactionCount: number;
}

export interface TraceParser {
  id: string;
  name: string;
  description?: string;
  canParse(input: string): number;
  parse(input: string): ParseResult;
}
