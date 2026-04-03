import type { TlvNode } from "@/types";
import { useTranslation } from "react-i18next";
import BracketBottomIcon from "../assets/icons/bracket_bottom_20.svg?react";

interface TlvTreeViewProps {
  nodes: TlvNode[];
}

export function TlvTreeView({ nodes }: TlvTreeViewProps) {
  return (
    <>
      {nodes.map((node, i) => (
        <TlvNodeView key={`${node.tag}-${i}`} node={node} />
      ))}
    </>
  );
}

function TlvNodeView({ node }: { node: TlvNode }) {
  const { t } = useTranslation();
  const valueHex = node.value
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
  const asciiPreview = node.value
    .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
    .join("");

  const categoryLabel =
    node.category === "standard"
      ? t("tlv.standard")
      : node.category === "proprietary"
        ? t("tlv.proprietary")
        : node.category === "application"
          ? t("tlv.application")
          : null;

  const hasChildren = node.children && node.children.length > 0;

  const header = (
    <div className="tlv-node-header">
      {hasChildren && <BracketBottomIcon className="tlv-toggle-icon" />}
      <span className="tlv-tag">{node.tag}</span>
      {node.name ? (
        <span className="tlv-name">{node.name}</span>
      ) : (
        <span className="tlv-name tlv-name-unknown">
          {categoryLabel ?? t("tlv.unknown")}
        </span>
      )}
      <span className="tlv-length">[{node.length}]</span>
      {categoryLabel && node.category !== "unknown" && (
        <span
          className={`tlv-category severity-${node.category === "standard" ? "success" : node.category === "proprietary" ? "warning" : "info"}`}
        >
          {categoryLabel}
        </span>
      )}
      {!hasChildren && valueHex && (
        <span className="tlv-value" title={valueHex}>
          {valueHex}
        </span>
      )}
    </div>
  );

  if (hasChildren) {
    return (
      <details className="tlv-node-details" open>
        <summary className="tlv-node-summary">{header}</summary>
        <div className="tlv-children">
          <TlvTreeView nodes={node.children!} />
        </div>
      </details>
    );
  }

  return (
    <div className="tlv-node">
      {header}
      {node.value.length > 0 && node.value.length <= 32 && (
        <div className="tlv-ascii-preview" title="ASCII">
          {asciiPreview}
        </div>
      )}
    </div>
  );
}
