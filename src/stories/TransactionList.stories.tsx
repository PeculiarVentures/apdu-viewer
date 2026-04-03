import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { ApduTransaction } from "../types";

function TransactionListDemo({
  transactions,
}: { transactions: ApduTransaction[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      style={{ maxWidth: 600, border: "1px solid #e0e0e0", borderRadius: 8 }}
    >
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className={`transaction-item ${selected === tx.id ? "selected" : ""}`}
          onClick={() => setSelected(tx.id)}
          onKeyDown={() => {}}
        >
          <span className="tx-index">{tx.index + 1}</span>
          <span className="tx-command">
            {tx.analysis?.command?.name ?? "Unknown"}
          </span>
          <span className="tx-summary">{tx.analysis?.summary?.text ?? ""}</span>
          {tx.status && (
            <span
              className={`tx-status severity-${tx.analysis?.severity ?? "info"}`}
            >
              {tx.status.hex}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const sampleTransactions: ApduTransaction[] = [
  {
    id: "tx-0",
    index: 0,
    startedAt: "2026-04-01 11:47:15.015",
    completedAt: "2026-04-01 11:47:15.025",
    command: {
      id: "rec-0",
      direction: "command",
      rawLine: "",
      rawHex: "00 a4 04 00 07 a0 00 00 03 08 00 00",
      bytes: [
        0x00, 0xa4, 0x04, 0x00, 0x07, 0xa0, 0x00, 0x00, 0x03, 0x08, 0x00, 0x00,
      ],
    },
    response: {
      id: "rec-1",
      direction: "response",
      rawLine: "",
      rawHex: "90 00",
      bytes: [0x90, 0x00],
    },
    status: { sw1: 0x90, sw2: 0x00, hex: "9000" },
    analysis: {
      command: {
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
        name: "SELECT",
        lc: 7,
        data: [0xa0, 0x00, 0x00, 0x03, 0x08, 0x00, 0x00],
      },
      summary: { text: "SELECT application A000000308000" },
      severity: "success",
    },
  },
  {
    id: "tx-1",
    index: 1,
    command: {
      id: "rec-2",
      direction: "command",
      rawLine: "",
      rawHex: "00 cb 3f ff 05 5c 03 ff f3 02 00",
      bytes: [0x00, 0xcb, 0x3f, 0xff, 0x05, 0x5c, 0x03, 0xff, 0xf3, 0x02, 0x00],
    },
    response: {
      id: "rec-3",
      direction: "response",
      rawLine: "",
      rawHex: "6a 80",
      bytes: [0x6a, 0x80],
    },
    status: { sw1: 0x6a, sw2: 0x80, hex: "6A80" },
    analysis: {
      command: { cla: 0x00, ins: 0xcb, p1: 0x3f, p2: 0xff, name: "GET DATA" },
      summary: { text: "GET DATA (FFF302)" },
      severity: "error",
    },
  },
  {
    id: "tx-2",
    index: 2,
    command: {
      id: "rec-4",
      direction: "command",
      rawLine: "",
      rawHex: "81 cb df 39 04",
      bytes: [0x81, 0xcb, 0xdf, 0x39, 0x04],
    },
    analysis: {
      command: { cla: 0x81, ins: 0xcb, p1: 0xdf, p2: 0x39, name: "GET DATA" },
      summary: { text: "GET DATA (DF39)" },
      severity: "warning",
    },
  },
];

const meta: Meta<typeof TransactionListDemo> = {
  title: "Components/TransactionList",
  component: TransactionListDemo,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TransactionListDemo>;

export const Default: Story = {
  args: {
    transactions: sampleTransactions,
  },
};

export const Empty: Story = {
  args: {
    transactions: [],
  },
};

export const SingleSuccess: Story = {
  args: {
    transactions: [sampleTransactions[0]!],
  },
};

export const SingleError: Story = {
  args: {
    transactions: [sampleTransactions[1]!],
  },
};
