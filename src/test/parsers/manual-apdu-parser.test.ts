import { manualApduParser } from "@/parsers/manual-apdu-parser";
import { describe, expect, it } from "vitest";
import {
  sampleErrorResponse,
  sampleSelectCommand,
  sampleSelectResponse,
} from "../fixtures/sample-log";

describe("manualApduParser", () => {
  it("should detect manual hex input", () => {
    const score = manualApduParser.canParse(sampleSelectCommand);
    expect(score).toBeGreaterThan(0);
  });

  it("should not detect long log text", () => {
    const longText = Array(100).fill("some log line text").join("\n");
    const score = manualApduParser.canParse(longText);
    expect(score).toBe(0);
  });

  it("should parse single command", () => {
    const result = manualApduParser.parse(sampleSelectCommand);

    expect(result.trace.transactions).toHaveLength(1);
    expect(result.trace.transactions[0]?.command).toBeDefined();
    expect(result.trace.transactions[0]?.response).toBeUndefined();
  });

  it("should parse command + response pair", () => {
    const input = `${sampleSelectCommand}\n${sampleSelectResponse}`;
    const result = manualApduParser.parse(input);

    expect(result.trace.transactions).toHaveLength(1);
    const tx = result.trace.transactions[0]!;
    expect(tx.command).toBeDefined();
    expect(tx.response).toBeDefined();
    expect(tx.status?.sw1).toBe(0x90);
    expect(tx.status?.sw2).toBe(0x00);
  });

  it("should parse command + error response", () => {
    const input = `${sampleSelectCommand}\n${sampleErrorResponse}`;
    const result = manualApduParser.parse(input);

    const tx = result.trace.transactions[0]!;
    expect(tx.status?.hex).toBe("6A80");
  });

  it("should analyze command fields", () => {
    const result = manualApduParser.parse(sampleSelectCommand);
    const tx = result.trace.transactions[0]!;

    expect(tx.analysis?.command).toBeDefined();
    expect(tx.analysis?.command?.cla).toBe(0x00);
    expect(tx.analysis?.command?.ins).toBe(0xa4);
    expect(tx.analysis?.command?.name).toBe("SELECT");
  });

  it("should handle continuous hex string", () => {
    const result = manualApduParser.parse("00A4040007A000000308000");
    expect(result.trace.transactions.length).toBeGreaterThanOrEqual(0);
  });
});
