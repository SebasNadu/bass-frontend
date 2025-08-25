import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/router/AppRouter";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppRouter />
    </App>
  </StrictMode>,
);
