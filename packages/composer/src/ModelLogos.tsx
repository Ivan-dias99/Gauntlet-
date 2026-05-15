// ModelLogos — minimal, recognizable provider marks rendered inline as
// SVG so they inherit `currentColor` and respect Aether v4 motion.
// Drawn from scratch (not copied bitmaps) so the cápsula can colour
// them via the cyan accent on selection without re-exporting assets.
//
// Four provider families today:
//   * anthropic — stylized 4-point burst (Claude family)
//   * openai    — concentric petals knot (gpt-oss family)
//   * meta      — interlinked infinity (Llama family)
//   * alibaba   — calligraphic Q (Qwen family)
//
// `getProviderFamily(model_id)` is the single mapping point. Adding a
// new provider means: extend the union, add a logo component, and
// extend the switch. The selector grid never special-cases a model id.

export type ProviderFamily = 'anthropic' | 'openai' | 'meta' | 'alibaba' | 'unknown';

export interface ModelLogoProps {
  size?: number;
  title?: string;
}

export function getProviderFamily(modelId: string): ProviderFamily {
  if (modelId.startsWith('claude-')) return 'anthropic';
  if (modelId.startsWith('openai/') || modelId.startsWith('gpt-')) return 'openai';
  if (modelId.startsWith('llama-') || modelId.startsWith('meta/')) return 'meta';
  if (modelId.startsWith('qwen/') || modelId.startsWith('alibaba/')) return 'alibaba';
  return 'unknown';
}

export function getProviderLabel(family: ProviderFamily): string {
  switch (family) {
    case 'anthropic': return 'Anthropic';
    case 'openai':    return 'OpenAI';
    case 'meta':      return 'Meta';
    case 'alibaba':   return 'Alibaba';
    default:          return 'Provider';
  }
}

export function ModelLogo({ family, size = 18, title }: ModelLogoProps & { family: ProviderFamily }) {
  switch (family) {
    case 'anthropic': return <AnthropicMark size={size} title={title} />;
    case 'openai':    return <OpenAIMark    size={size} title={title} />;
    case 'meta':      return <MetaMark      size={size} title={title} />;
    case 'alibaba':   return <AlibabaMark   size={size} title={title} />;
    default:          return <UnknownMark   size={size} title={title} />;
  }
}

// Anthropic — stylized 4-point burst. Echoes the official asterisk
// without copying its precise path geometry.
function AnthropicMark({ size = 18, title }: ModelLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={title ?? 'Anthropic'}
      fill="currentColor"
    >
      {title && <title>{title}</title>}
      <path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z" />
    </svg>
  );
}

// OpenAI — three interlocking petals around a center. Geometric
// reference to the official knot without reproducing its path.
function OpenAIMark({ size = 18, title }: ModelLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={title ?? 'OpenAI'}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    >
      {title && <title>{title}</title>}
      <ellipse cx="12" cy="12" rx="8" ry="3.4" />
      <ellipse cx="12" cy="12" rx="8" ry="3.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8" ry="3.4" transform="rotate(120 12 12)" />
    </svg>
  );
}

// Meta — infinity ribbon (Llama family). Two looped circles share the
// same baseline; mirrors the Meta brand silhouette.
function MetaMark({ size = 18, title }: ModelLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={title ?? 'Meta'}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
    >
      {title && <title>{title}</title>}
      <path d="M3 12 C 3 7.5, 6.5 6.5, 9 9.5 C 11 12, 13 16, 15 17 C 18 18.5, 21 16.5, 21 12 C 21 7.5, 18 5.5, 15 7 C 13 8, 11 12, 9 14.5 C 6.5 17.5, 3 16.5, 3 12 Z" />
    </svg>
  );
}

// Alibaba (Qwen) — calligraphic Q with a confident curl. Distinctive
// from the geometric marks above so the row reads at a glance.
function AlibabaMark({ size = 18, title }: ModelLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={title ?? 'Alibaba Qwen'}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title && <title>{title}</title>}
      <circle cx="11" cy="12" r="6.5" />
      <path d="M14.5 15.5 L19 20" />
      <path d="M11 8.5 C 12.6 8.5, 14 10, 14 12" />
    </svg>
  );
}

// Fallback — a neutral diamond so unknown ids render rather than blank.
function UnknownMark({ size = 18, title }: ModelLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={title ?? 'Provider'}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      {title && <title>{title}</title>}
      <rect x="6" y="6" width="12" height="12" rx="2" transform="rotate(45 12 12)" />
    </svg>
  );
}
