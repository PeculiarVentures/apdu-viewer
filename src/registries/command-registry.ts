import type { CommandAnalysis, ParsedApduCommand } from "@/types";

interface CommandEntry {
  ins: number;
  name: string;
  i18nKey: string;
  description?: string;
  matchCla?: (cla: number) => boolean;
}

const commandEntries: CommandEntry[] = [
  {
    ins: 0xa4,
    name: "SELECT",
    i18nKey: "apdu.command.select",
    description: "Select file or application",
  },
  {
    ins: 0xca,
    name: "GET DATA",
    i18nKey: "apdu.command.getData",
    description: "Retrieve a data object",
  },
  {
    ins: 0xcb,
    name: "GET DATA",
    i18nKey: "apdu.command.getData",
    description: "Retrieve a data object (odd INS)",
  },
  {
    ins: 0xb0,
    name: "READ BINARY",
    i18nKey: "apdu.command.readBinary",
    description: "Read binary data",
  },
  {
    ins: 0xb2,
    name: "READ RECORD",
    i18nKey: "apdu.command.readRecord",
    description: "Read record(s)",
  },
  {
    ins: 0x20,
    name: "VERIFY",
    i18nKey: "apdu.command.verify",
    description: "Verify PIN/password",
  },
  {
    ins: 0x24,
    name: "CHANGE REFERENCE DATA",
    i18nKey: "apdu.command.changeReferenceData",
    description: "Change PIN/password",
  },
  {
    ins: 0x2a,
    name: "PERFORM SECURITY OPERATION",
    i18nKey: "apdu.command.performSecurityOp",
    description: "Compute digital signature / encipher / decipher",
  },
  {
    ins: 0x84,
    name: "GET CHALLENGE",
    i18nKey: "apdu.command.getChallenge",
    description: "Get a random challenge",
  },
  {
    ins: 0x82,
    name: "EXTERNAL AUTHENTICATE",
    i18nKey: "apdu.command.externalAuth",
    description: "External authenticate / mutual authenticate",
  },
  {
    ins: 0x88,
    name: "INTERNAL AUTHENTICATE",
    i18nKey: "apdu.command.internalAuth",
    description: "Internal authenticate",
  },
  {
    ins: 0xc0,
    name: "GET RESPONSE",
    i18nKey: "apdu.command.getResponse",
    description: "Get response data",
  },
  {
    ins: 0xe0,
    name: "CREATE FILE",
    i18nKey: "apdu.command.createFile",
    description: "Create file/DF",
  },
  {
    ins: 0xda,
    name: "PUT DATA",
    i18nKey: "apdu.command.putData",
    description: "Store a data object",
  },
  {
    ins: 0xdb,
    name: "PUT DATA",
    i18nKey: "apdu.command.putData",
    description: "Store a data object (odd INS)",
  },
];

export function decodeCommand(
  cmd: ParsedApduCommand,
): CommandAnalysis | undefined {
  const entry = commandEntries.find((e) => {
    if (e.ins !== cmd.ins) return false;
    if (e.matchCla && !e.matchCla(cmd.cla)) return false;
    return true;
  });

  return {
    cla: cmd.cla,
    ins: cmd.ins,
    p1: cmd.p1,
    p2: cmd.p2,
    lc: cmd.lc,
    data: cmd.data,
    le: cmd.le,
    name: entry?.name,
    description: entry?.description,
    i18nKey: entry?.i18nKey,
  };
}
