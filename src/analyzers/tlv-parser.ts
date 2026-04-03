import type { TlvNode } from "@/types";

export function parseTlv(bytes: number[], offset = 0): TlvNode[] {
  const nodes: TlvNode[] = [];
  let pos = offset;

  while (pos < bytes.length) {
    const startPos = pos;

    // Parse tag
    if (bytes[pos] === undefined) break;
    const tagBytes: number[] = [bytes[pos]!];
    const firstByte = bytes[pos]!;
    pos++;

    // Multi-byte tag: if lower 5 bits of first byte are all 1s
    if ((firstByte & 0x1f) === 0x1f) {
      while (pos < bytes.length) {
        const b = bytes[pos]!;
        tagBytes.push(b);
        pos++;
        if ((b & 0x80) === 0) break; // Last byte of tag
      }
    }

    const tag = tagBytes
      .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
      .join("");

    // Parse length
    if (pos >= bytes.length) {
      // Malformed: tag without length
      nodes.push({
        tag,
        tagBytes,
        length: 0,
        value: [],
        rawHex: bytesToHex(bytes.slice(startPos, pos)),
        category: "unknown",
      });
      break;
    }

    let length = bytes[pos]!;
    pos++;

    if (length === 0x81) {
      if (pos >= bytes.length) break;
      length = bytes[pos]!;
      pos++;
    } else if (length === 0x82) {
      if (pos + 1 >= bytes.length) break;
      length = (bytes[pos]! << 8) | bytes[pos + 1]!;
      pos += 2;
    } else if (length === 0x83) {
      if (pos + 2 >= bytes.length) break;
      length = (bytes[pos]! << 16) | (bytes[pos + 1]! << 8) | bytes[pos + 2]!;
      pos += 3;
    } else if (length > 0x83) {
      // Invalid length encoding
      nodes.push({
        tag,
        tagBytes,
        length: 0,
        value: [],
        rawHex: bytesToHex(bytes.slice(startPos, pos)),
        category: "unknown",
      });
      break;
    }

    const value = bytes.slice(pos, pos + length);
    pos += length;

    const isConstructed = (firstByte & 0x20) !== 0;
    let children: TlvNode[] | undefined;

    if (isConstructed && value.length > 0) {
      try {
        children = parseTlv(value);
        if (children.length === 0) children = undefined;
      } catch {
        children = undefined;
      }
    }

    nodes.push({
      tag,
      tagBytes,
      length,
      value,
      rawHex: bytesToHex(bytes.slice(startPos, pos)),
      children,
    });
  }

  return nodes;
}

function bytesToHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ");
}

export function tlvToString(nodes: TlvNode[], indent = 0): string {
  const lines: string[] = [];
  const prefix = "  ".repeat(indent);
  for (const node of nodes) {
    const valueHex = node.value
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
    const nameStr = node.name ? ` (${node.name})` : "";
    lines.push(`${prefix}${node.tag}${nameStr} [${node.length}]: ${valueHex}`);
    if (node.children) {
      lines.push(tlvToString(node.children, indent + 1));
    }
  }
  return lines.join("\n");
}
