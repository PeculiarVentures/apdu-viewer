import { decodeStatus } from "@/registries/status-registry";
import { describe, expect, it } from "vitest";

describe("status-registry", () => {
  it("should decode 9000 as success", () => {
    const result = decodeStatus("9000");
    expect(result).toBeDefined();
    expect(result?.name).toBe("Success");
    expect(result?.severity).toBe("success");
  });

  it("should decode 6A80 as wrong data", () => {
    const result = decodeStatus("6A80");
    expect(result).toBeDefined();
    expect(result?.name).toBe("Wrong data");
    expect(result?.severity).toBe("error");
  });

  it("should decode 6881 as not supported", () => {
    const result = decodeStatus("6881");
    expect(result).toBeDefined();
    expect(result?.severity).toBe("error");
  });

  it("should decode 6A82 as file not found", () => {
    const result = decodeStatus("6A82");
    expect(result).toBeDefined();
    expect(result?.name).toBe("File not found");
  });

  it("should decode 6A86 as incorrect P1 P2", () => {
    const result = decodeStatus("6A86");
    expect(result).toBeDefined();
  });

  it("should decode 61xx as more data available", () => {
    const result = decodeStatus("6111");
    expect(result).toBeDefined();
    expect(result?.severity).toBe("info");
  });

  it("should decode 6Cxx as wrong Le", () => {
    const result = decodeStatus("6C10");
    expect(result).toBeDefined();
    expect(result?.severity).toBe("warning");
  });

  it("should return undefined for unknown status", () => {
    const result = decodeStatus("FFFF");
    expect(result).toBeUndefined();
  });

  it("should be case insensitive", () => {
    expect(decodeStatus("9000")).toEqual(decodeStatus("9000"));
    expect(decodeStatus("6a80")).toBeDefined();
  });
});
