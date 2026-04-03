import { decodeCommand } from "@/registries/command-registry";
import type { ParsedApduCommand } from "@/types";
import { describe, expect, it } from "vitest";

function makeCmd(
  ins: number,
  cla = 0x00,
  p1 = 0x00,
  p2 = 0x00,
): ParsedApduCommand {
  return { cla, ins, p1, p2, rawBytes: [cla, ins, p1, p2] };
}

describe("command-registry", () => {
  it("should decode SELECT (INS=A4)", () => {
    const result = decodeCommand(makeCmd(0xa4));
    expect(result?.name).toBe("SELECT");
  });

  it("should decode GET DATA (INS=CA)", () => {
    const result = decodeCommand(makeCmd(0xca));
    expect(result?.name).toBe("GET DATA");
  });

  it("should decode GET DATA (INS=CB)", () => {
    const result = decodeCommand(makeCmd(0xcb));
    expect(result?.name).toBe("GET DATA");
  });

  it("should decode VERIFY (INS=20)", () => {
    const result = decodeCommand(makeCmd(0x20));
    expect(result?.name).toBe("VERIFY");
  });

  it("should decode PUT DATA (INS=DA)", () => {
    const result = decodeCommand(makeCmd(0xda));
    expect(result?.name).toBe("PUT DATA");
  });

  it("should return command analysis even for unknown INS", () => {
    const result = decodeCommand(makeCmd(0xff));
    expect(result).toBeDefined();
    expect(result?.ins).toBe(0xff);
    expect(result?.name).toBeUndefined();
  });

  it("should preserve CLA, P1, P2 in analysis", () => {
    const result = decodeCommand(makeCmd(0xa4, 0x80, 0x04, 0x0c));
    expect(result?.cla).toBe(0x80);
    expect(result?.p1).toBe(0x04);
    expect(result?.p2).toBe(0x0c);
  });
});
