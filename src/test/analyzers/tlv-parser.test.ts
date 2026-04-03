import { parseTlv } from "@/analyzers/tlv-parser";
import { describe, expect, it } from "vitest";

describe("parseTlv", () => {
  it("should parse simple TLV", () => {
    // 4F 06 00 00 10 00 01 00  → tag 4F, length 6, value 000010000100
    const bytes = [0x4f, 0x06, 0x00, 0x00, 0x10, 0x00, 0x01, 0x00];
    const nodes = parseTlv(bytes);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.tag).toBe("4F");
    expect(nodes[0]?.length).toBe(6);
    expect(nodes[0]?.value).toHaveLength(6);
  });

  it("should parse multi-byte tag", () => {
    // 9F7F 2A ... → tag 9F7F, length 42
    const data = new Array(42).fill(0x00);
    const bytes = [0x9f, 0x7f, 0x2a, ...data];
    const nodes = parseTlv(bytes);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.tag).toBe("9F7F");
    expect(nodes[0]?.length).toBe(42);
  });

  it("should parse nested constructed TLV", () => {
    // 61 08 4F 06 00 00 10 00 01 00
    const bytes = [0x61, 0x08, 0x4f, 0x06, 0x00, 0x00, 0x10, 0x00, 0x01, 0x00];
    const nodes = parseTlv(bytes);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.tag).toBe("61");
    expect(nodes[0]?.children).toBeDefined();
    expect(nodes[0]?.children).toHaveLength(1);
    expect(nodes[0]?.children?.[0]?.tag).toBe("4F");
  });

  it("should parse extended length (0x81)", () => {
    const data = new Array(200).fill(0xaa);
    const bytes = [0x4f, 0x81, 200, ...data];
    const nodes = parseTlv(bytes);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.length).toBe(200);
    expect(nodes[0]?.value).toHaveLength(200);
  });

  it("should parse extended length (0x82)", () => {
    const data = new Array(300).fill(0xbb);
    const bytes = [0x4f, 0x82, 0x01, 0x2c, ...data];
    const nodes = parseTlv(bytes);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.length).toBe(300);
  });

  it("should parse multiple TLV sibling nodes", () => {
    // Two nodes: 4F 02 AA BB, 50 03 CC DD EE
    const bytes = [0x4f, 0x02, 0xaa, 0xbb, 0x50, 0x03, 0xcc, 0xdd, 0xee];
    const nodes = parseTlv(bytes);

    expect(nodes).toHaveLength(2);
    expect(nodes[0]?.tag).toBe("4F");
    expect(nodes[1]?.tag).toBe("50");
  });

  it("should handle empty input", () => {
    expect(parseTlv([])).toHaveLength(0);
  });

  it("should handle real APDU response TLV data", () => {
    // From the log: 61 11 4F 06 00 00 10 00 01 00 79 07 4F 05 A0 00 00 03 08
    const bytes = [
      0x61, 0x11, 0x4f, 0x06, 0x00, 0x00, 0x10, 0x00, 0x01, 0x00, 0x79, 0x07,
      0x4f, 0x05, 0xa0, 0x00, 0x00, 0x03, 0x08,
    ];
    const nodes = parseTlv(bytes);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.tag).toBe("61");
    expect(nodes[0]?.children).toBeDefined();
  });
});
