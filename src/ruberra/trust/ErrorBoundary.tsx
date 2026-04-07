// Ruberra — Error Boundary. A failing surface must never white-screen the shell.

import { Component, ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.warn("[ruberra] surface failed:", this.props.label, error);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="rb-unavail">
          <strong>{this.props.label} — surface failed</strong>
          {this.state.error.message}
          <div style={{ marginTop: 10 }}>
            <button
              className="rb-btn"
              onClick={() => this.setState({ error: null })}
            >
              Retry surface
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
