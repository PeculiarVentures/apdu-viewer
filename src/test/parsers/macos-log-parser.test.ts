import { macosLogParser } from "@/parsers/macos-log-parser";
import { describe, expect, it } from "vitest";
import { sampleMacosLog } from "../fixtures/sample-log";

describe("macosLogParser", () => {
  it("should detect macOS log format with high confidence", () => {
    const score = macosLogParser.canParse(sampleMacosLog);
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it("should not detect non-log text", () => {
    const score = macosLogParser.canParse("hello world\nfoo bar");
    expect(score).toBe(0);
  });

  it("should parse sample log and extract transactions", () => {
    const result = macosLogParser.parse(sampleMacosLog);

    expect(result.format).toBe("macos-log-show-apdu");
    expect(result.trace.transactions.length).toBeGreaterThan(0);
    expect(result.stats.commandCount).toBeGreaterThan(0);
    expect(result.stats.responseCount).toBeGreaterThan(0);
  });

  it("should pair command and response correctly", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    const firstTx = result.trace.transactions[0]!;

    expect(firstTx.command).toBeDefined();
    expect(firstTx.response).toBeDefined();
    expect(firstTx.command?.direction).toBe("command");
    expect(firstTx.response?.direction).toBe("response");
  });

  it("should extract timestamp from log lines", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    const firstTx = result.trace.transactions[0]!;

    expect(firstTx.startedAt).toContain("2026-04-01");
    expect(firstTx.completedAt).toContain("2026-04-01");
  });

  it("should extract hex bytes correctly", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    const firstTx = result.trace.transactions[0]!;

    expect(firstTx.command?.bytes[0]).toBe(0x81);
    expect(firstTx.command?.bytes[1]).toBe(0xcb);
  });

  it("should extract status word from response", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    const firstTx = result.trace.transactions[0]!;

    expect(firstTx.status).toBeDefined();
    expect(firstTx.status?.sw1).toBe(0x90);
    expect(firstTx.status?.sw2).toBe(0x00);
    expect(firstTx.status?.hex).toBe("9000");
  });

  it("should handle error status words", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    // Find a transaction with 6A80 status
    const errorTx = result.trace.transactions.find(
      (tx) => tx.status?.hex === "6A80",
    );

    expect(errorTx).toBeDefined();
    expect(errorTx?.status?.sw1).toBe(0x6a);
    expect(errorTx?.status?.sw2).toBe(0x80);
  });

  it("should skip header and filter lines", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    expect(result.stats.skippedLines).toBeGreaterThan(0);
  });

  it("should analyze SELECT command", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    const selectTx = result.trace.transactions.find(
      (tx) => tx.analysis?.command?.name === "SELECT",
    );

    expect(selectTx).toBeDefined();
    expect(selectTx?.analysis?.command?.ins).toBe(0xa4);
  });

  it("should analyze GET DATA command", () => {
    const result = macosLogParser.parse(sampleMacosLog);
    const getDataTx = result.trace.transactions.find(
      (tx) => tx.analysis?.command?.name === "GET DATA",
    );

    expect(getDataTx).toBeDefined();
    expect(
      getDataTx?.analysis?.command?.ins === 0xca ||
        getDataTx?.analysis?.command?.ins === 0xcb,
    ).toBe(true);
  });
});
