import type { CommandAnalysis, TlvNode } from "./trace";

export interface ParsedApduCommand {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  lc?: number;
  data?: number[];
  le?: number;
  rawBytes: number[];
}

export interface DecodeContext {
  selectedAid?: string;
  previousCommands?: ParsedApduCommand[];
}

export interface StatusDescription {
  name: string;
  description: string;
  i18nKey: string;
  severity: "info" | "success" | "warning" | "error";
}

export interface DecodedObject {
  name: string;
  description?: string;
  i18nKey?: string;
  decodedValue?: string;
  category: "standard" | "proprietary" | "application" | "unknown";
}

export interface ApduObjectDefinition {
  id: string;
  name: string;
  i18nKey?: string;
  category?: "standard" | "proprietary" | "application";
  description?: string;
  valueType?: "hex" | "ascii" | "aid" | "tlv" | "integer";
}

export interface CommandDecoder {
  id: string;
  canDecode(command: ParsedApduCommand): boolean;
  decode(
    command: ParsedApduCommand,
    context: DecodeContext,
  ): CommandAnalysis | undefined;
}

export interface StatusDecoder {
  canDecode(sw: string): boolean;
  decode(sw: string): StatusDescription | undefined;
}

export interface DataObjectDecoder {
  canDecode(tag: string, context: DecodeContext): boolean;
  decode(node: TlvNode, context: DecodeContext): DecodedObject | undefined;
}
