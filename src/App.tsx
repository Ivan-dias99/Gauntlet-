import ErrorBoundary from "./trust/ErrorBoundary";
import { ThemeProvider } from "./theme/ThemeContext";
import { SpineProvider } from "./spine/SpineContext";
import Shell from "./shell/Shell";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SpineProvider>
          <Shell />
        </SpineProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
