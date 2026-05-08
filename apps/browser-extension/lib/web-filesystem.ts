// Web filesystem adapter — implements AmbientFilesystem on top of the
// browser's File API for visual + functional parity with the desktop
// shell's Tauri filesystem. The cápsula sees the SAME interface
// (pickFile + readTextFile + readFileBase64) regardless of where it
// runs; the operator never notices that on web there are no real
// paths, just blob references in an in-memory cache.
//
// Path proxies:
//   pickFile() returns { path: 'web://<uuid>', name: <real name> }
// readTextFile / readFileBase64 receive the proxy path and look it up
// in the cache. The "path" string is opaque to the cápsula — it just
// flows through to the chip, the prompt, and the apply handlers.
//
// Memory: each picked file lives in fileCache until the cápsula closes.
// Practical max sizes mirror the desktop caps: text 1 MB, binary 4 MB.
// Larger files are truncated with a head-marker on read.

const MAX_TEXT_BYTES = 1 * 1024 * 1024;
const MAX_BINARY_BYTES = 4 * 1024 * 1024;

const fileCache = new Map<string, File>();

function newPath(): string {
  // crypto.randomUUID is universal in chrome/firefox/edge MV3 contexts.
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `web://${uuid}`;
}

export async function pickFile(
  accept?: string[],
): Promise<{ path: string; name: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    if (accept && accept.length > 0) {
      // Browser accepts comma-separated list of extensions or MIME types.
      input.accept = accept.join(',');
    }
    let resolved = false;
    const cleanup = () => {
      if (input.parentNode) input.parentNode.removeChild(input);
    };
    input.onchange = () => {
      if (resolved) return;
      resolved = true;
      const file = input.files?.[0];
      cleanup();
      if (!file) {
        resolve(null);
        return;
      }
      const path = newPath();
      fileCache.set(path, file);
      resolve({ path, name: file.name });
    };
    // The 'cancel' event is firing in Chromium 113+; older versions
    // would leave the picker dangling without a resolve. We fall back
    // to resolving null on focus-back-to-window, which is the
    // historical workaround for "user closed the picker".
    input.oncancel = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(null);
    };
    document.body.appendChild(input);
    input.click();
    // Focus fallback for older browsers — if the operator switches
    // back to the page within 800ms without a change event, we treat
    // it as cancel.
    setTimeout(() => {
      if (resolved) return;
      const handler = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve(null);
        window.removeEventListener('focus', handler);
      };
      window.addEventListener('focus', handler, { once: true });
    }, 800);
  });
}

function fileFor(path: string): File {
  const file = fileCache.get(path);
  if (!file) {
    throw new Error(
      `web filesystem: path not found in cache (${path}). The picker reference may have expired.`,
    );
  }
  return file;
}

export async function readTextFile(path: string): Promise<string> {
  const file = fileFor(path);
  if (file.size > MAX_TEXT_BYTES) {
    const slice = file.slice(0, MAX_TEXT_BYTES);
    const head = await slice.text();
    return (
      head +
      `\n\n[truncated at ${MAX_TEXT_BYTES} bytes; original size: ${file.size}]`
    );
  }
  return await file.text();
}

export async function readFileBase64(
  path: string,
): Promise<{ base64: string; mime: string }> {
  const file = fileFor(path);
  const target =
    file.size > MAX_BINARY_BYTES ? file.slice(0, MAX_BINARY_BYTES) : file;
  const buf = await target.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // Chunked btoa so we don't blow the JS string-arg limit on big files.
  // Each chunk is 32 KB before base64 expansion.
  const chunk = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return {
    base64: btoa(binary),
    mime: file.type || 'application/octet-stream',
  };
}
