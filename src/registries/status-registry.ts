import type { StatusDescription } from "@/types";

interface StatusEntry {
  hex: string;
  name: string;
  description: string;
  i18nKey: string;
  severity: "info" | "success" | "warning" | "error";
}

const statusEntries: StatusEntry[] = [
  {
    hex: "9000",
    name: "Success",
    description: "Command executed successfully",
    i18nKey: "apdu.status.9000",
    severity: "success",
  },
  {
    hex: "6A80",
    name: "Wrong data",
    description: "Incorrect parameters in the command data field",
    i18nKey: "apdu.status.6A80",
    severity: "error",
  },
  {
    hex: "6A82",
    name: "File not found",
    description: "Application/file not found",
    i18nKey: "apdu.status.6A82",
    severity: "error",
  },
  {
    hex: "6A86",
    name: "Incorrect P1 P2",
    description: "Incorrect parameters P1-P2",
    i18nKey: "apdu.status.6A86",
    severity: "error",
  },
  {
    hex: "6881",
    name: "Logical channel not supported",
    description: "Function not supported: logical channel",
    i18nKey: "apdu.status.6881",
    severity: "error",
  },
  {
    hex: "6D00",
    name: "INS not supported",
    description: "Instruction code not supported or invalid",
    i18nKey: "apdu.status.6D00",
    severity: "error",
  },
  {
    hex: "6E00",
    name: "CLA not supported",
    description: "Class not supported",
    i18nKey: "apdu.status.6E00",
    severity: "error",
  },
];

export function decodeStatus(sw: string): StatusDescription | undefined {
  const upper = sw.toUpperCase();
  const entry = statusEntries.find((e) => e.hex === upper);
  if (entry) {
    return {
      name: entry.name,
      description: entry.description,
      i18nKey: entry.i18nKey,
      severity: entry.severity,
    };
  }

  // Pattern matching for ranges
  if (upper.startsWith("61")) {
    return {
      name: "More data available",
      description: `${Number.parseInt(upper.substring(2), 16)} bytes remaining`,
      i18nKey: "apdu.status.61xx",
      severity: "info",
    };
  }

  if (upper.startsWith("6C")) {
    return {
      name: "Wrong Le field",
      description: `Correct Le is ${Number.parseInt(upper.substring(2), 16)}`,
      i18nKey: "apdu.status.6Cxx",
      severity: "warning",
    };
  }

  return undefined;
}

export function getStatusSeverity(
  sw1: number,
  _sw2: number,
): "success" | "warning" | "error" | "info" {
  if (sw1 === 0x90) return "success";
  if (sw1 === 0x61) return "info";
  if (sw1 === 0x62 || sw1 === 0x63) return "warning";
  return "error";
}
