import { Component, ReactNode, ErrorInfo } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ruberra]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          height: "100vh",
          background: "#0c0c0c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{ maxWidth: 480, padding: "0 32px" }}>
            <div style={{
              fontSize: 10,
              letterSpacing: 3,
              color: "#7a2020",
              textTransform: "uppercase",
              marginBottom: 20,
            }}>
              ERRO INTERNO
            </div>
            <div style={{ fontSize: 13, color: "#4a4540", lineHeight: 1.7 }}>
              {this.state.error.message}
            </div>
            <button
              onClick={() => this.setState({ error: null })}
              style={{
                marginTop: 24,
                background: "none",
                border: "1px solid #2a2520",
                color: "#7a7060",
                fontSize: 11,
                letterSpacing: 2,
                padding: "10px 24px",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
