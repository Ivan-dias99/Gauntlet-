import { SpineProvider } from "./spine/SpineContext";
import Shell from "./shell/Shell";

export default function App() {
  return (
    <SpineProvider>
      <Shell />
    </SpineProvider>
  );
}
