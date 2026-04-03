export interface NormalizedTrace {
  id: string;
  sourceFormat: string;
  transactions: ApduTransaction[];
  records: TraceRecord[];
  warnings: TraceWarning[];
  errors: TraceError[];
  metadata?: Record<string, unknown>;
}

export interface TraceRecord {
  id: string;
  timestamp?: string;
  direction: "command" | "response";
  rawLine: string;
  rawHex: string;
  bytes: number[];
}

export interface ApduTransaction {
  id: string;
  index: number;
  startedAt?: string;
  completedAt?: string;
  command?: TraceRecord;
  response?: TraceRecord;
  status?: ApduStatus;
  analysis?: ApduAnalysis;
}

export interface ApduStatus {
  sw1: number;
  sw2: number;
  hex: string;
}

export interface ApduAnalysis {
  command?: CommandAnalysis;
  response?: ResponseAnalysis;
  summary?: AnalysisSummary;
  tags?: string[];
  severity?: "info" | "success" | "warning" | "error";
}

export interface CommandAnalysis {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  lc?: number;
  data?: number[];
  le?: number;
  name?: string;
  description?: string;
  i18nKey?: string;
}

export interface ResponseAnalysis {
  data?: number[];
  sw1: number;
  sw2: number;
  statusName?: string;
  statusDescription?: string;
  statusI18nKey?: string;
  severity?: "info" | "success" | "warning" | "error";
  tlv?: TlvNode[];
}

export interface AnalysisSummary {
  text: string;
  i18nKey?: string;
  i18nParams?: Record<string, string>;
}

export interface TraceWarning {
  line?: number;
  message: string;
  context?: string;
}

export interface TraceError {
  line?: number;
  message: string;
  context?: string;
}

export interface TlvNode {
  tag: string;
  tagBytes: number[];
  length: number;
  value: number[];
  rawHex: string;
  children?: TlvNode[];
  name?: string;
  description?: string;
  category?: "standard" | "proprietary" | "application" | "unknown";
  decodedValue?: string;
}
