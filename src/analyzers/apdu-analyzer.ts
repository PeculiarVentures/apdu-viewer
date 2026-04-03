import { decodeCommand } from "@/registries/command-registry";
import { getObjectCategory, getObjectName } from "@/registries/object-registry";
import { decodeStatus, getStatusSeverity } from "@/registries/status-registry";
import type {
  ApduAnalysis,
  ApduTransaction,
  ParsedApduCommand,
  ResponseAnalysis,
  TlvNode,
} from "@/types";
import { parseTlv } from "./tlv-parser";

export function parseApduCommand(
  bytes: number[],
): ParsedApduCommand | undefined {
  if (bytes.length < 4) return undefined;

  const cla = bytes[0]!;
  const ins = bytes[1]!;
  const p1 = bytes[2]!;
  const p2 = bytes[3]!;

  if (bytes.length === 4) {
    return { cla, ins, p1, p2, rawBytes: bytes };
  }

  if (bytes.length === 5) {
    // Case 2S: Le only
    return { cla, ins, p1, p2, le: bytes[4], rawBytes: bytes };
  }

  const lc = bytes[4]!;

  if (lc === 0 && bytes.length >= 7) {
    // Extended length
    const extLc = (bytes[5]! << 8) | bytes[6]!;
    if (extLc > 0) {
      const data = bytes.slice(7, 7 + extLc);
      const le =
        bytes.length > 7 + extLc
          ? (bytes[7 + extLc]! << 8) | (bytes[8 + extLc] ?? 0)
          : undefined;
      return { cla, ins, p1, p2, lc: extLc, data, le, rawBytes: bytes };
    }
    // Extended Le
    const le = (bytes[5]! << 8) | bytes[6]!;
    return { cla, ins, p1, p2, le: le || 65536, rawBytes: bytes };
  }

  if (bytes.length === 5 + lc) {
    // Case 3S: Lc + Data, no Le
    return {
      cla,
      ins,
      p1,
      p2,
      lc,
      data: bytes.slice(5, 5 + lc),
      rawBytes: bytes,
    };
  }

  if (bytes.length === 6 + lc) {
    // Case 4S: Lc + Data + Le
    return {
      cla,
      ins,
      p1,
      p2,
      lc,
      data: bytes.slice(5, 5 + lc),
      le: bytes[5 + lc],
      rawBytes: bytes,
    };
  }

  // Best effort: treat remaining after header as data
  return {
    cla,
    ins,
    p1,
    p2,
    lc,
    data: bytes.slice(5, 5 + lc),
    le: bytes[5 + lc],
    rawBytes: bytes,
  };
}

function enrichTlvNodes(nodes: TlvNode[]): TlvNode[] {
  return nodes.map((node) => ({
    ...node,
    name: node.name || getObjectName(node.tag),
    category: node.category || getObjectCategory(node.tag),
    children: node.children ? enrichTlvNodes(node.children) : node.children,
  }));
}

export function analyzeTransaction(tx: ApduTransaction): ApduAnalysis {
  const analysis: ApduAnalysis = {};

  // Analyze command
  if (tx.command) {
    const parsed = parseApduCommand(tx.command.bytes);
    if (parsed) {
      analysis.command = decodeCommand(parsed);
    }
  }

  // Analyze response
  if (tx.response && tx.status) {
    const sw = tx.status.hex;
    const statusInfo = decodeStatus(sw);
    const responseData = tx.response.bytes.slice(0, -2);

    let tlvNodes: TlvNode[] | undefined;
    if (responseData.length > 0) {
      try {
        const parsed = parseTlv(responseData);
        if (parsed.length > 0) {
          tlvNodes = enrichTlvNodes(parsed);
        }
      } catch {
        // TLV parsing failed, skip
      }
    }

    const responseAnalysis: ResponseAnalysis = {
      data: responseData.length > 0 ? responseData : undefined,
      sw1: tx.status.sw1,
      sw2: tx.status.sw2,
      statusName: statusInfo?.name,
      statusDescription: statusInfo?.description,
      statusI18nKey: statusInfo?.i18nKey,
      severity:
        statusInfo?.severity ?? getStatusSeverity(tx.status.sw1, tx.status.sw2),
      tlv: tlvNodes,
    };
    analysis.response = responseAnalysis;
    analysis.severity = responseAnalysis.severity;
  }

  // Generate summary
  analysis.summary = generateSummary(analysis, tx);

  return analysis;
}

function generateSummary(
  analysis: ApduAnalysis,
  _tx: ApduTransaction,
): { text: string; i18nKey?: string; i18nParams?: Record<string, string> } {
  const cmdName = analysis.command?.name ?? "Unknown command";
  const statusName = analysis.response?.statusName;

  if (analysis.command?.ins === 0xa4 && analysis.command.data) {
    const aid = analysis.command.data
      .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
      .join("");
    return {
      text: `SELECT application ${aid}`,
      i18nKey: "apdu.summary.selectedAid",
      i18nParams: { aid },
    };
  }

  if (
    (analysis.command?.ins === 0xca || analysis.command?.ins === 0xcb) &&
    analysis.command.data
  ) {
    const tag = analysis.command.data
      .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
      .join("");
    return {
      text: `GET DATA ${tag}`,
      i18nKey: "apdu.summary.readObject",
      i18nParams: { tag },
    };
  }

  if (analysis.command?.ins === 0xca || analysis.command?.ins === 0xcb) {
    const p1p2 = `${analysis.command.p1.toString(16).padStart(2, "0").toUpperCase()}${analysis.command.p2.toString(16).padStart(2, "0").toUpperCase()}`;
    return {
      text: `GET DATA (${p1p2})`,
      i18nKey: "apdu.summary.readObject",
      i18nParams: { tag: p1p2 },
    };
  }

  const suffix = statusName ? ` → ${statusName}` : "";
  return { text: `${cmdName}${suffix}` };
}
