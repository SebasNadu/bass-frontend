import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.tsx";
import { HeroUIProvider } from "@heroui/react";
import { AppRouter } from "@/router/AppRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <App>
        <AppRouter />
      </App>
    </HeroUIProvider>
  </StrictMode>
);
