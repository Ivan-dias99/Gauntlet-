// Wave P-36 — Backend-unreachable state.
//
// Specialisation of <ErrorState /> that interprets a
// `BackendUnreachableError` (or its `reason` string) into a friendly
// cause + actionable fix, instead of dumping the raw error message.
//
// The reason → cause/fix table mirrors the legacy
// BackendUnreachableBanner inside Terminal so chambers can drop the
// duplicated component and converge on one primitive.

import type { CSSProperties } from "react";
import ErrorState, { type ErrorSeverity } from "./ErrorState";
import { isBackendUnreachable } from "../../lib/signalApi";

interface Props {
  /** Either the typed error or just its `reason` string. */
  error?: unknown;
  /** Override the reason string explicitly (for callers that only have it). */
  reason?: string | null;
  /** Raw edge detail to surface verbatim. */
  detail?: string | null;
  /** Severity. Defaults to "banner" — the common case. */
  severity?: ErrorSeverity;
  /** Retry handler (re-fetches the failed call). */
  onRetry?: () => void;
  style?: CSSProperties;
}

interface Interpreted {
  cause: string;
  fix: string | null;
}

function interpret(reason: string | null): Interpreted {
  switch (reason) {
    case "backend_url_not_configured":
      return {
        cause: "URL do backend não configurado.",
        fix: "Define SIGNAL_BACKEND_URL nas variáveis de ambiente e refaz o deploy.",
      };
    case "network_error":
      return {
        cause: "Edge não conseguiu alcançar o backend.",
        fix: "Verifica que o serviço Railway está de pé e o URL não tem typo.",
      };
    case "timeout":
      return {
        cause: "Backend respondeu fora do tempo permitido.",
        fix: "Vê os logs do Railway por boot lento ou pedidos pendurados.",
      };
    case "upstream_fetch_failed":
      return {
        cause: "Edge fetch falhou com excepção não classificada.",
        fix: "O detalhe abaixo carrega a causa literal do runtime.",
      };
    case null:
    case undefined:
      return { cause: "Backend inalcançável.", fix: null };
    default:
      // Edge codes (e.g. "edge:503") and unknown reasons fall through.
      return {
        cause: `Backend inalcançável (${reason}).`,
        fix: null,
      };
  }
}

export default function BackendUnreachableState({
  error,
  reason,
  detail,
  severity = "banner",
  onRetry,
  style,
}: Props) {
  // Pull reason/detail from the typed error when not overridden.
  let resolvedReason: string | null = reason ?? null;
  let resolvedDetail: string | null = detail ?? null;
  if (isBackendUnreachable(error)) {
    if (resolvedReason == null) resolvedReason = error.reason;
    if (resolvedDetail == null) resolvedDetail = error.detail;
  }

  const { cause, fix } = interpret(resolvedReason);
  const message = fix ? `${cause} ${fix}` : cause;

  return (
    <ErrorState
      severity={severity}
      title="backend inalcançável"
      message={message}
      detail={resolvedDetail}
      onRetry={onRetry}
      style={style}
    />
  );
}
