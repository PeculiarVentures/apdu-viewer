import type { ApduTransaction } from "@/types";
import { Typography } from "@peculiar/react-components";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "../assets/icons/check_20.svg?react";
import CopyIcon from "../assets/icons/copy_20.svg?react";
import { TlvTreeView } from "./TlvTreeView";

interface TransactionDetailsViewProps {
  tx: ApduTransaction;
}

export function TransactionDetailsView({ tx }: TransactionDetailsViewProps) {
  const { t } = useTranslation();

  const commandDataHex = tx.analysis?.command?.data
    ?.map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");

  return (
    <div className="transaction-details">
      {/* Header with command name + status */}
      <div className="details-header">
        <Typography variant="h5" color="black">
          #{tx.index + 1}{" "}
          {tx.analysis?.command?.name ?? t("transaction.unknown")}
        </Typography>
        {tx.status && (
          <span
            className={`details-status-badge severity-${tx.analysis?.severity ?? "info"}`}
          >
            {tx.status.hex}
            {tx.analysis?.response?.statusName &&
              ` — ${tx.analysis.response.statusName}`}
          </span>
        )}
      </div>

      {/* Summary */}
      {tx.analysis?.summary && (
        <div className="details-summary-banner">
          <Typography variant="b2">{tx.analysis.summary.text}</Typography>
        </div>
      )}

      {/* APDU Fields — prominent */}
      {tx.analysis?.command && (
        <div className="details-section">
          <Typography variant="s2" color="gray-9" className="section-title">
            {t("transaction.apduFields")}
          </Typography>
          <div className="apdu-fields-grid">
            <div className="apdu-field">
              <span className="apdu-field-label">CLA</span>
              <span className="apdu-field-value">
                {formatHex(tx.analysis.command.cla)}
              </span>
            </div>
            <div className="apdu-field apdu-field-highlight">
              <span className="apdu-field-label">INS</span>
              <span className="apdu-field-value">
                {formatHex(tx.analysis.command.ins)}
                {tx.analysis.command.name && (
                  <span className="apdu-field-hint">
                    {tx.analysis.command.name}
                  </span>
                )}
              </span>
            </div>
            <div className="apdu-field">
              <span className="apdu-field-label">P1</span>
              <span className="apdu-field-value">
                {formatHex(tx.analysis.command.p1)}
              </span>
            </div>
            <div className="apdu-field">
              <span className="apdu-field-label">P2</span>
              <span className="apdu-field-value">
                {formatHex(tx.analysis.command.p2)}
              </span>
            </div>
            {tx.analysis.command.lc !== undefined && (
              <div className="apdu-field">
                <span className="apdu-field-label">Lc</span>
                <span className="apdu-field-value">
                  {tx.analysis.command.lc}
                </span>
              </div>
            )}
            {tx.analysis.command.le !== undefined && (
              <div className="apdu-field">
                <span className="apdu-field-label">Le</span>
                <span className="apdu-field-value">
                  {tx.analysis.command.le}
                </span>
              </div>
            )}
          </div>
          {tx.analysis.command.data && (
            <div className="apdu-data-block">
              <span className="apdu-field-label">{t("transaction.data")}</span>
              <HexDisplayWithCopy text={commandDataHex!} />
            </div>
          )}
        </div>
      )}

      {/* Status Word — prominent */}
      {tx.status && tx.analysis?.response && (
        <div className="details-section">
          <Typography variant="s2" color="gray-9" className="section-title">
            {t("transaction.sw")}
          </Typography>
          <div
            className={`status-word-display severity-${tx.analysis.response.severity ?? "info"}`}
          >
            <span className="sw-value">{tx.status.hex}</span>
            {tx.analysis.response.statusName && (
              <span className="sw-name">{tx.analysis.response.statusName}</span>
            )}
            {tx.analysis.response.statusDescription && (
              <span className="sw-description">
                {tx.analysis.response.statusDescription}
              </span>
            )}
          </div>
        </div>
      )}

      {/* TLV Tree — collapsible */}
      {tx.analysis?.response?.tlv && tx.analysis.response.tlv.length > 0 && (
        <details className="details-section" open>
          <summary className="section-title-collapsible">
            <Typography variant="s2" color="gray-9">
              {t("transaction.tlvTree")}
            </Typography>
          </summary>
          <div className="tlv-tree">
            <TlvTreeView nodes={tx.analysis.response.tlv} />
          </div>
        </details>
      )}

      {/* Raw data — collapsible */}
      <details className="details-section">
        <summary className="section-title-collapsible">
          <Typography variant="s2" color="gray-9">
            {t("transaction.rawData")}
          </Typography>
        </summary>
        {tx.command && (
          <div className="raw-data-block">
            <Typography variant="c1" color="gray-9">
              {t("transaction.rawRequest")}
            </Typography>
            <HexDisplayWithCopy text={tx.command.rawHex} />
            {tx.command.timestamp && (
              <span className="raw-timestamp">{tx.command.timestamp}</span>
            )}
          </div>
        )}
        {tx.response && (
          <div className="raw-data-block">
            <Typography variant="c1" color="gray-9">
              {t("transaction.rawResponse")}
            </Typography>
            <HexDisplayWithCopy text={tx.response.rawHex} />
            {tx.response.timestamp && (
              <span className="raw-timestamp">{tx.response.timestamp}</span>
            )}
          </div>
        )}
      </details>
    </div>
  );
}

function formatHex(value: number): string {
  return `0x${value.toString(16).padStart(2, "0").toUpperCase()}`;
}

function HexDisplayWithCopy({ text }: { text: string }) {
  return (
    <div className="hex-display-wrapper">
      <div className="hex-display">{text}</div>
      <CopyButton text={text} />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);

  return (
    <button
      type="button"
      className="copy-button"
      onClick={handleCopy}
      title={t("action.copy")}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
