// Wave P-39c — chambers page owns the URL ↔ chamber binding.
//
// Reads the active chamber from the route param, validates it, and feeds
// Shell as a controlled `activeTab` prop. When Shell asks to switch (via
// ribbon click, Alt+1-5, palette pick, mission follow, or `signal:chamber`
// CustomEvent), we call navigate() — URL is now the single source of
// truth.
//
// The previous P-39b stopgap (CustomEvent dispatch as a URL → state
// bridge) is gone.

import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Shell from "../shell/Shell";
import { Chamber, normalizeChamberKey } from "../spine/types";

export default function ChambersPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  // Validate the URL param. `normalizeChamberKey` collapses unknown /
  // legacy values to "insight"; we only want to render the page when the
  // URL already matches the canonical key. Anything else redirects so the
  // address bar stays honest.
  const canonical: Chamber = useMemo(() => normalizeChamberKey(tab), [tab]);

  const onSwitchChamber = useCallback(
    (next: Chamber) => {
      navigate(`/chambers/${next}`);
    },
    [navigate],
  );

  if (tab !== canonical) {
    return <Navigate to={`/chambers/${canonical}`} replace />;
  }

  return <Shell activeTab={canonical} onSwitchChamber={onSwitchChamber} />;
}
