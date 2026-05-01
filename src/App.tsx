import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./trust/ErrorBoundary";
import { TweaksProvider } from "./tweaks/TweaksContext";
import { SpineProvider } from "./spine/SpineContext";
import AppRoutes from "./router";

export default function App() {
  return (
    <ErrorBoundary>
      <TweaksProvider>
        <SpineProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SpineProvider>
      </TweaksProvider>
    </ErrorBoundary>
  );
}
