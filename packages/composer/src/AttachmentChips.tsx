// AttachmentChips — strip of currently-attached files / screenshots
// rendered above the textarea. Pure presentational; useAttachments
// owns the list and the removeAttachment callback.

import { type Attachment } from './types';

export interface AttachmentChipsProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentChips({ attachments, onRemove }: AttachmentChipsProps) {
  if (attachments.length === 0) return null;
  return (
    <div className="gauntlet-capsule__attachments" aria-label="Anexos">
      {attachments.map((a) => (
        <span
          key={a.id}
          className={`gauntlet-capsule__attachment gauntlet-capsule__attachment--${a.kind}`}
          title={a.path ?? a.name}
        >
          <span className="gauntlet-capsule__attachment-icon" aria-hidden>
            {a.kind === 'image' ? '◫' : '⌥'}
          </span>
          <span className="gauntlet-capsule__attachment-name">{a.name}</span>
          <span className="gauntlet-capsule__attachment-size">
            {formatBytes(a.bytes)}
          </span>
          <button
            type="button"
            className="gauntlet-capsule__attachment-remove"
            onClick={() => onRemove(a.id)}
            aria-label={`Remover ${a.name}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
