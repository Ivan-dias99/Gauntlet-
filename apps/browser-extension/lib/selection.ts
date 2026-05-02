// Selection helpers. Kept tiny — the capsule should never need to know
// about ranges or anchor nodes, just the resulting text + page metadata.

export interface SelectionSnapshot {
  text: string;
  url: string;
  pageTitle: string;
}

export function readSelectionSnapshot(): SelectionSnapshot {
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';
  return {
    text,
    url: window.location.href,
    pageTitle: document.title,
  };
}
