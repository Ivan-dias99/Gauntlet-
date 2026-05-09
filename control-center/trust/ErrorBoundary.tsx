import { Component, ReactNode, ErrorInfo } from "react";
import { fallbackCopy } from "../i18n/copy";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[gauntlet]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      const copy = fallbackCopy();
      return (
        <div
          data-error-panel
          data-error-severity="critical"
          data-error-boundary
          style={{
            height: "100vh",
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--sans)",
          }}
        >
          <div style={{ maxWidth: 480, padding: "0 32px" }}>
            <div
              data-error-kicker
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: "var(--cc-err)",
                textTransform: "uppercase",
                marginBottom: 20,
                fontFamily: "var(--mono)",
              }}
            >
              {copy.errorBoundaryKicker}
            </div>
            <div
              data-error-message
              style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}
            >
              {this.state.error.message}
            </div>
            <button
              onClick={() => this.setState({ error: null })}
              style={{
                marginTop: 24,
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: 11,
                letterSpacing: 2,
                padding: "10px 24px",
                cursor: "pointer",
                fontFamily: "var(--mono)",
                borderRadius: "var(--radius)",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-dim)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {copy.errorBoundaryRetry}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
