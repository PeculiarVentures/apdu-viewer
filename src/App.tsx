import { Button, TextField, Typography } from "@peculiar/react-components";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import AttentionCircleIcon from "./assets/icons/attention_circle_20.svg?react";
import CheckCircleIcon from "./assets/icons/check_circle_20.svg?react";
import CrossCircleIcon from "./assets/icons/cross_circle_20.svg?react";
import GearIcon from "./assets/icons/gear_20.svg?react";
import InfoCircleIcon from "./assets/icons/info_circle_20.svg?react";
import { InputDialog } from "./components/InputDialog";
import { TransactionDetailsView } from "./components/TransactionDetailsView";
import { SAMPLE_TRACE } from "./data/sample-trace";
import { manualApduParser } from "./parsers/manual-apdu-parser";
import { getParser } from "./parsers/registry";
import type { ApduTransaction, NormalizedTrace, ParseStats } from "./types";

type StatusFilter = "all" | "success" | "error" | "warning";

const LANGUAGES = ["en", "ru", "uk"] as const;

export default function App() {
  const { t, i18n } = useTranslation();
  const [trace, setTrace] = useState<NormalizedTrace | null>(null);
  const [stats, setStats] = useState<ParseStats | null>(null);
  const [selectedTx, setSelectedTx] = useState<ApduTransaction | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLoadTrace = useCallback((text: string) => {
    // Try structured parser first, fall back to manual
    const parser = getParser(text);
    if (parser) {
      const result = parser.parse(text);
      setTrace(result.trace);
      setStats(result.stats);
      setSelectedTx(null);
    } else {
      const result = manualApduParser.parse(text);
      setTrace(result.trace);
      setStats(result.stats);
      setSelectedTx(result.trace.transactions[0] ?? null);
    }
    setShowInputDialog(false);
  }, []);

  const handleClear = useCallback(() => {
    setTrace(null);
    setStats(null);
    setSelectedTx(null);
    setSearchText("");
    setStatusFilter("all");
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!trace) return [];
    let txs = trace.transactions;
    if (statusFilter !== "all") {
      txs = txs.filter((tx) => tx.analysis?.severity === statusFilter);
    }
    if (searchText) {
      const lower = searchText.toLowerCase();
      txs = txs.filter(
        (tx) =>
          tx.command?.rawHex.toLowerCase().includes(lower) ||
          tx.response?.rawHex.toLowerCase().includes(lower) ||
          tx.analysis?.summary?.text.toLowerCase().includes(lower) ||
          tx.analysis?.command?.name?.toLowerCase().includes(lower) ||
          tx.status?.hex.toLowerCase().includes(lower),
      );
    }
    return txs;
  }, [trace, statusFilter, searchText]);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-title">
          <Typography variant="h4" color="black">
            {t("app.title")}
          </Typography>
          <Typography variant="b3" color="gray-9">
            {t("app.subtitle")}
          </Typography>
        </div>
        <div className="app-header-actions">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setShowInputDialog(true)}
          >
            {t("input.openTrace")}
          </Button>
          {trace && (
            <Button variant="outlined" size="small" onClick={handleClear}>
              {t("input.clear")}
            </Button>
          )}
          <div className="settings-wrapper">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowSettings(!showSettings)}
            >
              <GearIcon />
            </Button>
            {showSettings && (
              <div className="settings-dropdown">
                <Typography variant="c1" color="gray-9">
                  {t("settings.language")}
                </Typography>
                <div className="settings-languages">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`lang-option ${i18n.language === lang ? "active" : ""}`}
                      onClick={() => {
                        i18n.changeLanguage(lang);
                        setShowSettings(false);
                      }}
                    >
                      {t(`language.${lang}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Input Dialog */}
      <InputDialog
        open={showInputDialog}
        onLoadTrace={handleLoadTrace}
        onClose={() => setShowInputDialog(false)}
      />

      <div className="app-main">
        {/* Left sidebar: Transaction list */}
        <div className="app-sidebar">
          {/* Summary */}
          {trace && stats && (
            <div className="trace-summary">
              <div className="summary-stats">
                <span className="summary-chip">
                  {stats.transactionCount} {t("summary.transactions")}
                </span>
                {trace.warnings.length > 0 && (
                  <span className="summary-chip severity-warning">
                    {trace.warnings.length} {t("summary.warnings")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Warnings */}
          {trace && trace.warnings.length > 0 && (
            <details className="warnings-panel">
              <summary>
                {trace.warnings.length} {t("summary.warnings")}
              </summary>
              <ul className="warnings-list">
                {trace.warnings.map((w, i) => (
                  <li key={`w-${w.message}-${i}`}>
                    {w.message}
                    {w.context && (
                      <code className="warning-context">
                        {w.context.substring(0, 60)}
                      </code>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* Filter */}
          {trace && (
            <div className="filter-bar">
              <TextField
                placeholder={t("filter.search")}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                className="filter-search"
              />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="filter-select"
              >
                <option value="all">{t("filter.allStatuses")}</option>
                <option value="success">{t("filter.success")}</option>
                <option value="error">{t("filter.error")}</option>
                <option value="warning">{t("filter.warning")}</option>
              </select>
            </div>
          )}

          {/* Transaction list */}
          <div className="transaction-list">
            {!trace && (
              <div className="empty-state">
                <Typography variant="b2" color="gray-7">
                  {t("transaction.noData")}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowInputDialog(true)}
                  style={{ marginTop: 12 }}
                >
                  {t("input.openTrace")}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleLoadTrace(SAMPLE_TRACE)}
                  style={{ marginTop: 8 }}
                >
                  {t("input.loadSample")}
                </Button>
              </div>
            )}
            {filteredTransactions.map((tx) => (
              <TransactionListItem
                key={tx.id}
                tx={tx}
                selected={selectedTx?.id === tx.id}
                onClick={() => setSelectedTx(tx)}
              />
            ))}
          </div>
        </div>

        {/* Right: Transaction details */}
        <div className="app-content">
          {selectedTx ? (
            <TransactionDetailsView tx={selectedTx} />
          ) : (
            <div className="details-empty">
              <Typography variant="b2" color="gray-7">
                {t("transaction.noSelection")}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TransactionListItem({
  tx,
  selected,
  onClick,
}: {
  tx: ApduTransaction;
  selected: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const severity = tx.analysis?.severity ?? "info";
  const commandName = tx.analysis?.command?.name ?? t("transaction.unknown");
  const dataHint = getTxDataHint(tx);

  return (
    <div
      className={`transaction-item ${selected ? "selected" : ""}`}
      onClick={onClick}
      onKeyDown={() => {}}
    >
      <SeverityIcon severity={severity} />
      <span className="tx-index">{tx.index + 1}</span>
      <span className="tx-command">{commandName}</span>
      {dataHint && <span className="tx-data-hint">{dataHint}</span>}
      {tx.status && (
        <span className={`tx-status severity-${severity}`}>
          {tx.status.hex}
        </span>
      )}
      {!tx.response && (
        <span className="tx-status severity-warning">
          {t("transaction.orphanCommand")}
        </span>
      )}
    </div>
  );
}

/** Get a compact data hint for the transaction list */
function getTxDataHint(tx: ApduTransaction): string {
  const cmd = tx.analysis?.command;
  if (!cmd) return "";
  if (cmd.ins === 0xa4 && cmd.data) {
    return cmd.data.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  if (cmd.ins === 0xca || cmd.ins === 0xcb) {
    return `${cmd.p1.toString(16).padStart(2, "0")}${cmd.p2.toString(16).padStart(2, "0")}`.toUpperCase();
  }
  if (cmd.ins === 0xb0) {
    const offset = (cmd.p1 << 8) | cmd.p2;
    return `@${offset}`;
  }
  return "";
}

function SeverityIcon({ severity }: { severity: string }) {
  const className = "tx-severity-icon";
  switch (severity) {
    case "success":
      return (
        <CheckCircleIcon className={`${className} severity-icon-success`} />
      );
    case "error":
      return <CrossCircleIcon className={`${className} severity-icon-error`} />;
    case "warning":
      return (
        <AttentionCircleIcon className={`${className} severity-icon-warning`} />
      );
    default:
      return <InfoCircleIcon className={`${className} severity-icon-info`} />;
  }
}
