// Wave P-36 — Chamber error boundary.
//
// React component errors below a chamber root used to surface as the
// browser's blank-screen + console stacktrace. This boundary catches
// any render-time exception inside a chamber, logs it for observability,
// and renders a full-bleed <ErrorState severity="full" /> with a retry
// button that resets the boundary so the chamber can re-mount cleanly.
//
// Wrapped per-chamber (not at the shell root) so a crash inside Insight
// doesn't take Surface down with it; the operator can tab away and the
// shell stays alive.

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "./states";

interface Props {
  /** Human-readable chamber label, used in the error title ("erro · core"). */
  chamber: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ChamberErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Keep the original stack visible in the console; the UI surface is
    // intentionally terse so this is the operator's only diagnostic.
    // eslint-disable-next-line no-console
    console.error(
      `[chamber:${this.props.chamber}] render error`,
      error,
      info.componentStack,
    );
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        data-chamber-error-boundary={this.props.chamber}
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-4)",
        }}
      >
        <ErrorState
          severity="full"
          title={this.props.chamber}
          message="A câmara cruzou com um erro inesperado."
          detail={error.message || error.name}
          onRetry={this.reset}
          retryLabel="recarregar câmara"
        />
      </div>
    );
  }
}
