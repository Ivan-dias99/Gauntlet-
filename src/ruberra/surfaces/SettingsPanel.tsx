// Ruberra — Settings Panel
// Runtime configuration for AI provider, API key, model, and endpoint.
// Persists to localStorage via runtime-fabric config API.
// No decorative waste. Every field has a consequence.

import { useState, useEffect } from "react";
import {
  getRuntimeConfig,
  setRuntimeConfig,
  clearRuntimeConfig,
  type ExecutionProvider,
  type RuntimeConfig,
} from "../spine/runtime-fabric";

const PROVIDERS: Array<{ id: ExecutionProvider; label: string; needsKey: boolean; defaultModel: string; defaultEndpoint?: string }> = [
  { id: "openai",    label: "OpenAI",        needsKey: true,  defaultModel: "gpt-4o" },
  { id: "anthropic", label: "Anthropic",      needsKey: true,  defaultModel: "claude-sonnet-4-20250514" },
  { id: "google",    label: "Google AI",      needsKey: true,  defaultModel: "gemini-2.0-flash" },
  { id: "groq",      label: "Groq",           needsKey: true,  defaultModel: "llama-3.3-70b-versatile" },
  { id: "ollama",    label: "Ollama (local)",  needsKey: false, defaultModel: "llama3.2", defaultEndpoint: "http://localhost:11434/v1/chat/completions" },
  { id: "lmstudio",  label: "LM Studio",      needsKey: false, defaultModel: "local-model", defaultEndpoint: "http://localhost:1234/v1/chat/completions" },
  { id: "vllm",      label: "vLLM",           needsKey: false, defaultModel: "local-model", defaultEndpoint: "http://localhost:8000/v1/chat/completions" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: Props) {
  const [provider, setProvider] = useState<ExecutionProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const config = getRuntimeConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey ?? "");
      setModel(config.model);
      setEndpoint(config.endpoint ?? "");
    }
  }, [open]);

  const providerInfo = PROVIDERS.find((p) => p.id === provider)!;

  function handleProviderChange(id: ExecutionProvider) {
    setProvider(id);
    const info = PROVIDERS.find((p) => p.id === id)!;
    setModel(info.defaultModel);
    setEndpoint(info.defaultEndpoint ?? "");
    setApiKey("");
    setSaved(false);
  }

  function handleSave() {
    const config: RuntimeConfig = {
      provider,
      model: model.trim() || providerInfo.defaultModel,
      ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
      ...(endpoint.trim() ? { endpoint: endpoint.trim() } : {}),
    };
    setRuntimeConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    clearRuntimeConfig();
    setProvider("openai");
    setApiKey("");
    setModel("");
    setEndpoint("");
    setSaved(false);
  }

  if (!open) return null;

  return (
    <div className="rb-settings-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rb-settings-panel">
        <div className="rb-settings-header">
          <h2 className="rb-settings-title">Runtime Configuration</h2>
          <button className="rb-settings-close" onClick={onClose} type="button">×</button>
        </div>

        <div className="rb-settings-body">
          <div className="rb-field-group">
            <label className="rb-field-label">Provider</label>
            <div className="rb-settings-provider-grid">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  className={`rb-settings-provider-btn${provider === p.id ? " active" : ""}`}
                  onClick={() => handleProviderChange(p.id)}
                  type="button"
                >
                  <span className="rb-settings-provider-name">{p.label}</span>
                  <span className="rb-settings-provider-hint">
                    {p.needsKey ? "API key" : "local"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {providerInfo.needsKey && (
            <div className="rb-field-group">
              <label className="rb-field-label">API Key</label>
              <div className="rb-settings-key-row">
                <input
                  className="rb-input rb-settings-key-input"
                  type={showKey ? "text" : "password"}
                  placeholder={`${providerInfo.label} API key`}
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setSaved(false); }}
                  autoComplete="off"
                />
                <button
                  className="rb-btn rb-settings-key-toggle"
                  onClick={() => setShowKey((v) => !v)}
                  type="button"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
              <div className="rb-settings-key-hint">
                Stored in browser localStorage. Never sent to our servers.
              </div>
            </div>
          )}

          <div className="rb-field-group">
            <label className="rb-field-label">Model</label>
            <input
              className="rb-input"
              placeholder={providerInfo.defaultModel}
              value={model}
              onChange={(e) => { setModel(e.target.value); setSaved(false); }}
            />
          </div>

          <div className="rb-field-group">
            <label className="rb-field-label">Endpoint (optional override)</label>
            <input
              className="rb-input"
              placeholder={providerInfo.defaultEndpoint ?? "default"}
              value={endpoint}
              onChange={(e) => { setEndpoint(e.target.value); setSaved(false); }}
            />
          </div>

          <div className="rb-settings-actions">
            <button className="rb-btn primary" onClick={handleSave} type="button">
              {saved ? "Saved" : "Save Configuration"}
            </button>
            <button className="rb-btn" onClick={handleClear} type="button">
              Clear / Reset
            </button>
          </div>

          <div className="rb-settings-status">
            {(() => {
              const config = getRuntimeConfig();
              if (!config) return <span className="rb-settings-status-off">No provider configured — simulation mode active</span>;
              return (
                <span className="rb-settings-status-on">
                  Active: {config.provider} · {config.model}
                  {config.apiKey ? " · key set" : ""}
                </span>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
