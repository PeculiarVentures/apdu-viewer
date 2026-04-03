import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
} from "@peculiar/react-components";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SAMPLE_TRACE } from "../data/sample-trace";

interface InputDialogProps {
  open: boolean;
  onLoadTrace: (text: string) => void;
  onClose: () => void;
}

export function InputDialog({ open, onLoadTrace, onClose }: InputDialogProps) {
  const { t } = useTranslation();
  const [inputMode, setInputMode] = useState("trace");
  const [traceText, setTraceText] = useState("");
  const [manualCommand, setManualCommand] = useState("");
  const [manualResponse, setManualResponse] = useState("");
  const [dropActive, setDropActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = useCallback(() => {
    if (inputMode === "trace") {
      onLoadTrace(traceText);
    } else if (inputMode === "sample") {
      onLoadTrace(SAMPLE_TRACE);
    } else {
      const input = manualResponse
        ? `${manualCommand}\n${manualResponse}`
        : manualCommand;
      onLoadTrace(input);
    }
  }, [inputMode, traceText, manualCommand, manualResponse, onLoadTrace]);

  const handleFilePick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setTraceText(reader.result);
        }
      };
      reader.readAsText(file);
    },
    [],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setTraceText(reader.result);
        }
      };
      reader.readAsText(file);
      return;
    }
    const text = e.dataTransfer.getData("text/plain");
    if (text) {
      setTraceText(text);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropActive(false);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} size="large">
      <DialogTitle>{t("input.openTrace")}</DialogTitle>

      <Tabs value={inputMode} onChange={(_e, value) => setInputMode(value)}>
        <Tab id="trace">{t("input.traceTab")}</Tab>
        <Tab id="manual">{t("input.manualTab")}</Tab>
        <Tab id="sample">{t("input.sampleTab")}</Tab>
      </Tabs>

      <DialogContent>
        {inputMode === "trace" ? (
          <>
            <div
              className={`drop-zone ${dropActive ? "active" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleFilePick}
              onKeyDown={() => {}}
            >
              {dropActive ? t("input.dropzoneActive") : t("input.dropzone")}
            </div>
            <textarea
              className="trace-textarea"
              placeholder={t("input.placeholder")}
              value={traceText}
              onChange={(e) => setTraceText(e.target.value)}
              rows={10}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.log"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </>
        ) : inputMode === "manual" ? (
          <div className="manual-input-group">
            <TextField
              label={t("input.manualCommand")}
              placeholder={t("input.manualCommandPlaceholder")}
              value={manualCommand}
              onChange={(e) => setManualCommand(e.target.value)}
            />
            <TextField
              label={t("input.manualResponse")}
              placeholder={t("input.manualResponsePlaceholder")}
              value={manualResponse}
              onChange={(e) => setManualResponse(e.target.value)}
            />
          </div>
        ) : (
          <div className="sample-trace-section">
            <p className="sample-description">{t("input.sampleDescription")}</p>
            <pre className="sample-preview">
              {SAMPLE_TRACE.substring(0, 300)}...
            </pre>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t("input.cancel")}
        </Button>
        <Button variant="contained" color="primary" onClick={handleAnalyze}>
          {t("input.parse")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
