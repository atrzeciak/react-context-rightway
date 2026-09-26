import { createRoot } from "react-dom/client";

import App from "@/app/App.tsx";
import "@/index.css";

const rootElement = document.querySelector("#root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

// StrictMode is left off so each render flashes once.
createRoot(rootElement).render(<App />);
