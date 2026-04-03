import type { Meta, StoryObj } from "@storybook/react";
import type { TlvNode } from "../types";

function TlvTreeDemo({ nodes }: { nodes: TlvNode[] }) {
  return (
    <div className="tlv-tree" style={{ padding: 16 }}>
      {nodes.map((node, i) => (
        <TlvNodeDemo key={`${node.tag}-${i}`} node={node} />
      ))}
    </div>
  );
}

function TlvNodeDemo({ node }: { node: TlvNode }) {
  const valueHex = node.value
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");

  return (
    <div className="tlv-node">
      <div className="tlv-node-header">
        <span className="tlv-tag">{node.tag}</span>
        {node.name && <span className="tlv-name">{node.name}</span>}
        <span className="tlv-length">[{node.length}]</span>
        {node.category && node.category !== "unknown" && (
          <span
            className={`tlv-category severity-${node.category === "standard" ? "success" : "warning"}`}
          >
            {node.category}
          </span>
        )}
        {!node.children && <span className="tlv-value">{valueHex}</span>}
      </div>
      {node.children && (
        <div className="tlv-children">
          {node.children.map((child, i) => (
            <TlvNodeDemo key={`${child.tag}-${i}`} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

const sampleTlvNodes: TlvNode[] = [
  {
    tag: "6F",
    tagBytes: [0x6f],
    length: 20,
    value: [],
    rawHex: "6F 14 ...",
    name: "FCI Template",
    category: "standard",
    children: [
      {
        tag: "84",
        tagBytes: [0x84],
        length: 8,
        value: [0xa0, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00],
        rawHex: "84 08 A0 00 00 00 03 00 00 00",
        name: "DF Name",
        category: "standard",
      },
      {
        tag: "A5",
        tagBytes: [0xa5],
        length: 6,
        value: [],
        rawHex: "A5 06 ...",
        name: "FCI Proprietary Template",
        category: "standard",
        children: [
          {
            tag: "9F65",
            tagBytes: [0x9f, 0x65],
            length: 1,
            value: [0xff],
            rawHex: "9F 65 01 FF",
            name: "Maximum Length of Data",
            category: "application",
          },
        ],
      },
    ],
  },
];

const meta: Meta<typeof TlvTreeDemo> = {
  title: "Components/TlvTree",
  component: TlvTreeDemo,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TlvTreeDemo>;

export const Default: Story = {
  args: {
    nodes: sampleTlvNodes,
  },
};

export const Empty: Story = {
  args: {
    nodes: [],
  },
};

export const FlatNodes: Story = {
  args: {
    nodes: [
      {
        tag: "4F",
        tagBytes: [0x4f],
        length: 6,
        value: [0x00, 0x00, 0x10, 0x00, 0x01, 0x00],
        rawHex: "4F 06 00 00 10 00 01 00",
        name: "AID",
        category: "standard",
      },
      {
        tag: "9F7F",
        tagBytes: [0x9f, 0x7f],
        length: 4,
        value: [0x40, 0x90, 0x00, 0x39],
        rawHex: "9F 7F 04 40 90 00 39",
        name: "CPLC (Card Production Life Cycle Data)",
        category: "application",
      },
    ],
  },
};
