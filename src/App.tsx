import ErrorBoundary from "./trust/ErrorBoundary";
import { SpineProvider } from "./spine/SpineContext";
import Shell from "./shell/Shell";

export default function App() {
  return (
    <ErrorBoundary>
      <SpineProvider>
        <Shell />
      </SpineProvider>
    </ErrorBoundary>
  );
}
