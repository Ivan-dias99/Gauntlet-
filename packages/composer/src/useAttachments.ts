// useAttachments — operator-driven attachment surface for the Capsule.
//
// Doctrine: the dialog IS the consent gate. Every attachment originates
// from a `pickFile`, `pickSavePath` or `captureScreen` call the
// operator triggered explicitly. The backend never synthesises a path,
// and the hook never reads from disk on its own initiative.
//
// The hook owns:
//   * attachments         — the list rendered in the chip strip
//   * attachError         — last error message from a failed attach
//   * savedToDiskFlash    — transient banner after a successful save
//
// Plus the operator-facing actions:
//   * attachLocalFile             — pick a file and ingest text or image
//   * attachScreenCapture         — capture screen and ingest as image
//   * removeAttachment(id)        — drop a chip
//   * saveComposeToDisk           — write the current compose to a file
//   * composeUserInputWithAttachments(raw) — inline text attachments
//                                    inside <file> tags before submit
//                                    (image attachments travel via
//                                    metadata.attachments in buildCapture)

import { useCallback, useState } from 'react';
import { type Ambient } from './ambient';
import { type Attachment, type SelectionSnapshot } from './types';

function newAttachmentId(): string {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface UseAttachmentsArgs {
  ambient: Ambient;
  snapshot: SelectionSnapshot;
}

export interface UseAttachmentsResult {
  attachments: Attachment[];
  attachError: string | null;
  savedToDiskFlash: string | null;
  attachLocalFile: () => Promise<void>;
  attachScreenCapture: () => Promise<void>;
  removeAttachment: (id: string) => void;
  // Caller passes the current compose at click time so this hook
  // doesn't need to track the streaming-plan state itself.
  saveComposeToDisk: (compose: string | null | undefined) => Promise<void>;
  composeUserInputWithAttachments: (raw: string) => string;
}

export function useAttachments({
  ambient,
  snapshot,
}: UseAttachmentsArgs): UseAttachmentsResult {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [savedToDiskFlash, setSavedToDiskFlash] = useState<string | null>(null);

  // A1 — operator-driven anexar. The dialog plugin (desktop) is the
  // consent gate; on web `ambient.filesystem` is undefined and the
  // buttons that call this never render in the first place.
  const attachLocalFile = useCallback(async () => {
    const fs = ambient.filesystem;
    if (!fs) return;
    setAttachError(null);
    try {
      const picked = await fs.pickFile();
      if (!picked) return; // operator cancelled
      const lowerName = picked.name.toLowerCase();
      const isImage = /\.(png|jpe?g|gif|webp|svg)$/.test(lowerName);
      if (isImage) {
        const { base64, mime } = await fs.readFileBase64(picked.path);
        const bytes = Math.ceil((base64.length * 3) / 4);
        setAttachments((prev) => [
          ...prev,
          {
            id: newAttachmentId(),
            kind: 'image',
            name: picked.name,
            mime,
            bytes,
            base64,
            path: picked.path,
          },
        ]);
      } else {
        const text = await fs.readTextFile(picked.path);
        setAttachments((prev) => [
          ...prev,
          {
            id: newAttachmentId(),
            kind: 'text',
            name: picked.name,
            mime: 'text/plain',
            bytes: new TextEncoder().encode(text).length,
            text,
            path: picked.path,
          },
        ]);
      }
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : String(err));
    }
  }, [ambient]);

  const attachScreenCapture = useCallback(async () => {
    const cap = ambient.screenshot?.captureScreen;
    if (!cap) return;
    setAttachError(null);
    try {
      const got = await cap();
      if (!got) {
        setAttachError('Captura de ecrã indisponível neste sistema.');
        return;
      }
      const bytes = Math.ceil((got.base64.length * 3) / 4);
      setAttachments((prev) => [
        ...prev,
        {
          id: newAttachmentId(),
          kind: 'image',
          name: `ecrã-${new Date().toISOString().slice(11, 19)}.png`,
          mime: 'image/png',
          bytes,
          base64: got.base64,
          path: got.path,
        },
      ]);
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : String(err));
    }
  }, [ambient]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // A2 — operator-driven save. The dialog IS the consent gate. We
  // suggest a filename derived from the snapshot title (sanitised) and
  // default the extension to .md since the cápsula's compose tends to
  // be markdown. The operator can change either in the dialog.
  const saveComposeToDisk = useCallback(async (compose: string | null | undefined) => {
    const fs = ambient.filesystem;
    if (!fs?.pickSavePath || !fs.writeTextFile) return;
    const composeText = compose ?? '';
    if (!composeText.trim()) return;
    setAttachError(null);
    try {
      const titleSeed = (snapshot.pageTitle || 'gauntlet-compose')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'gauntlet-compose';
      const suggested = `${titleSeed}.md`;
      const path = await fs.pickSavePath(suggested, ['md', 'txt', 'json']);
      if (!path) return; // operator cancelled
      const bytes = await fs.writeTextFile(path, composeText);
      setSavedToDiskFlash(
        `${path.split(/[\\/]/).pop() ?? 'ficheiro'} (${
          bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} KB`
        })`,
      );
      window.setTimeout(() => setSavedToDiskFlash(null), 2500);
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : String(err));
    }
  }, [ambient, snapshot.pageTitle]);

  // Compose user_input with attachment blocks. Text files are inlined
  // verbatim inside <file name="..."> tags so the agent can read them
  // without backend changes. Image attachments travel as multimodal
  // content blocks via `metadata.attachments` and DO NOT show up in
  // user_input — the agent literally sees the picture, no placeholder
  // needed (when the provider supports images; on Groq/Gemini the
  // backend logs `images_dropped` and the operator sees the chip).
  const composeUserInputWithAttachments = useCallback(
    (raw: string): string => {
      if (attachments.length === 0) return raw;
      const blocks: string[] = [];
      for (const a of attachments) {
        if (a.kind === 'text' && a.text != null) {
          blocks.push(
            `<file name="${a.name}" path="${a.path ?? ''}">\n${a.text}\n</file>`,
          );
        }
        // image attachments handled via metadata.attachments — see
        // buildCapture + backend's _collect_image_blocks.
      }
      if (blocks.length === 0) return raw;
      return `${blocks.join('\n\n')}\n\n${raw}`;
    },
    [attachments],
  );

  return {
    attachments,
    attachError,
    savedToDiskFlash,
    attachLocalFile,
    attachScreenCapture,
    removeAttachment,
    saveComposeToDisk,
    composeUserInputWithAttachments,
  };
}
