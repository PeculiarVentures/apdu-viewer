import type { TraceParser } from "@/types";
import { macosLogParser } from "./macos-log-parser";
import { manualApduParser } from "./manual-apdu-parser";

const parsers: TraceParser[] = [macosLogParser, manualApduParser];

export function getParser(input: string): TraceParser | undefined {
  let bestParser: TraceParser | undefined;
  let bestScore = 0;
  for (const parser of parsers) {
    const score = parser.canParse(input);
    if (score > bestScore) {
      bestScore = score;
      bestParser = parser;
    }
  }
  return bestParser;
}

export function getAllParsers(): TraceParser[] {
  return [...parsers];
}

export function registerParser(parser: TraceParser): void {
  parsers.push(parser);
}
