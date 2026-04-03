import type { ApduObjectDefinition } from "@/types";

const objectDefinitions: ApduObjectDefinition[] = [
  {
    id: "4F",
    name: "AID",
    category: "standard",
    valueType: "aid",
    description: "Application Identifier",
  },
  {
    id: "50",
    name: "Application Label",
    category: "standard",
    valueType: "ascii",
  },
  { id: "5F2F", name: "ICC Effective Date", category: "standard" },
  {
    id: "61",
    name: "Application Template",
    category: "standard",
    valueType: "tlv",
  },
  {
    id: "6F",
    name: "FCI Template",
    category: "standard",
    valueType: "tlv",
    description: "File Control Information",
  },
  {
    id: "73",
    name: "Discretionary Data Template",
    category: "standard",
    valueType: "tlv",
  },
  {
    id: "79",
    name: "Coexistent Tag Allocation Authority",
    category: "standard",
    valueType: "tlv",
  },
  {
    id: "7E",
    name: "Interindustry Template",
    category: "standard",
    valueType: "tlv",
  },
  { id: "84", name: "DF Name", category: "standard", valueType: "aid" },
  {
    id: "A5",
    name: "FCI Proprietary Template",
    category: "standard",
    valueType: "tlv",
  },
  {
    id: "80",
    name: "Response Message Template (Format 1)",
    category: "standard",
  },
  { id: "83", name: "Command Template", category: "standard" },
  { id: "8A", name: "Life Cycle Status", category: "standard" },
  { id: "8C", name: "Compact Security Attribute", category: "standard" },
  { id: "91", name: "Card Public Key Data", category: "standard" },
  { id: "99", name: "Proprietary Data Element", category: "proprietary" },
  { id: "9A", name: "Proprietary Data Element", category: "proprietary" },
  { id: "9B", name: "Proprietary Data Element", category: "proprietary" },
  { id: "9C", name: "Proprietary Data Element", category: "proprietary" },
  { id: "9D", name: "Proprietary Data Element", category: "proprietary" },
  { id: "9E", name: "Proprietary Data Element", category: "proprietary" },
  { id: "9F65", name: "Maximum Length of Data", category: "application" },
  { id: "9F6E", name: "Third Party Data", category: "application" },
  {
    id: "9F7F",
    name: "CPLC (Card Production Life Cycle Data)",
    category: "application",
    description: "Card production and lifecycle information",
  },
  {
    id: "A0",
    name: "Security Attribute Template Expanded",
    category: "standard",
    valueType: "tlv",
  },
  {
    id: "A1",
    name: "Security Attribute Template Compact",
    category: "standard",
    valueType: "tlv",
  },
  {
    id: "E2",
    name: "Card Descriptor",
    category: "application",
    valueType: "tlv",
  },
  {
    id: "DF30",
    name: "Vendor Specific Data",
    category: "proprietary",
    description: "Vendor-specific data object",
  },
  { id: "DF39", name: "Vendor Counter", category: "proprietary" },
  {
    id: "FFF302",
    name: "Proprietary Object",
    category: "proprietary",
    description: "Vendor-specific proprietary object",
  },
  { id: "FFF305", name: "Proprietary Object", category: "proprietary" },
  { id: "FFF30A", name: "Proprietary Object", category: "proprietary" },
  { id: "FFF30B", name: "Proprietary Object", category: "proprietary" },
  { id: "FFF301", name: "Proprietary Object", category: "proprietary" },
  { id: "FFF30D", name: "Proprietary Object", category: "proprietary" },
  {
    id: "FF8180",
    name: "Vendor Key Object",
    category: "proprietary",
    valueType: "tlv",
  },
  {
    id: "FF8181",
    name: "Vendor Key Object",
    category: "proprietary",
    valueType: "tlv",
  },
  {
    id: "FF840B",
    name: "Vendor Application Object",
    category: "proprietary",
    valueType: "tlv",
  },
];

export function getObjectDefinition(
  tag: string,
): ApduObjectDefinition | undefined {
  const upper = tag.toUpperCase();
  return objectDefinitions.find((d) => d.id.toUpperCase() === upper);
}

export function getObjectName(tag: string): string {
  const def = getObjectDefinition(tag);
  if (def) return def.name;

  const upper = tag.toUpperCase();
  if (upper.startsWith("FFF3")) return "Proprietary Object";
  if (upper.startsWith("FF81")) return "Vendor Key Object";
  if (upper.startsWith("FF84")) return "Vendor Application Object";
  if (upper.startsWith("DF")) return "Vendor Specific";

  return "Unknown";
}

export function getObjectCategory(
  tag: string,
): "standard" | "proprietary" | "application" | "unknown" {
  const def = getObjectDefinition(tag);
  if (def?.category) return def.category;

  const upper = tag.toUpperCase();
  if (upper.startsWith("FF") || upper.startsWith("DF")) return "proprietary";

  const firstByte = Number.parseInt(upper.substring(0, 2), 16);
  if (firstByte >= 0x9f) return "application";

  return "unknown";
}
