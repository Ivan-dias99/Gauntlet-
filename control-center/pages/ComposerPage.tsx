// Wave 1 — /composer route entry. Thin wrapper so the router stays
// symmetric with the existing /control sub-routes; the layout itself
// lives in src/composer/ComposerLayout.tsx.

import ComposerLayout from "../composer/ComposerLayout";

export default function ComposerPage() {
  return <ComposerLayout />;
}
