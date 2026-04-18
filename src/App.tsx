import ErrorBoundary from "./trust/ErrorBoundary";
import { TweaksProvider } from "./tweaks/TweaksContext";
import { SpineProvider } from "./spine/SpineContext";
import Shell from "./shell/Shell";

export default function App() {
  return (
    <ErrorBoundary>
      <TweaksProvider>
        <SpineProvider>
          <Shell />
        </SpineProvider>
      </TweaksProvider>
    </ErrorBoundary>
  );
}
