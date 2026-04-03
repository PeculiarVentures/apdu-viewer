import { parseApduCommand } from "@/analyzers/apdu-analyzer";
import { describe, expect, it } from "vitest";

describe("parseApduCommand", () => {
  it("should parse minimal 4-byte APDU (case 1)", () => {
    const cmd = parseApduCommand([0x00, 0xa4, 0x04, 0x00]);
    expect(cmd).toBeDefined();
    expect(cmd?.cla).toBe(0x00);
    expect(cmd?.ins).toBe(0xa4);
    expect(cmd?.p1).toBe(0x04);
    expect(cmd?.p2).toBe(0x00);
    expect(cmd?.lc).toBeUndefined();
    expect(cmd?.data).toBeUndefined();
  });

  it("should parse 5-byte APDU with Le (case 2S)", () => {
    const cmd = parseApduCommand([0x00, 0xca, 0x9f, 0x7f, 0x2d]);
    expect(cmd).toBeDefined();
    expect(cmd?.ins).toBe(0xca);
    expect(cmd?.le).toBe(0x2d);
  });

  it("should parse APDU with Lc + Data (case 3S)", () => {
    const cmd = parseApduCommand([
      0x00, 0xa4, 0x04, 0x00, 0x07, 0xa0, 0x00, 0x00, 0x03, 0x08, 0x00, 0x00,
    ]);
    expect(cmd?.lc).toBe(7);
    expect(cmd?.data).toHaveLength(7);
    expect(cmd?.data?.[0]).toBe(0xa0);
  });

  it("should parse APDU with Lc + Data + Le (case 4S)", () => {
    const cmd = parseApduCommand([
      0x00, 0xcb, 0x3f, 0xff, 0x05, 0x5c, 0x03, 0xff, 0xf3, 0x02, 0x00,
    ]);
    expect(cmd?.lc).toBe(5);
    expect(cmd?.data).toHaveLength(5);
    expect(cmd?.le).toBe(0x00);
  });

  it("should return undefined for too-short input", () => {
    expect(parseApduCommand([0x00])).toBeUndefined();
    expect(parseApduCommand([0x00, 0xa4])).toBeUndefined();
    expect(parseApduCommand([])).toBeUndefined();
  });

  it("should identify SELECT by INS", () => {
    const cmd = parseApduCommand([0x00, 0xa4, 0x04, 0x00]);
    expect(cmd?.ins).toBe(0xa4);
  });

  it("should identify GET DATA by INS", () => {
    const cmd = parseApduCommand([0x00, 0xca, 0x00, 0x00]);
    expect(cmd?.ins).toBe(0xca);
  });
});
