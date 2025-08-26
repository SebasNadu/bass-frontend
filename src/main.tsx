import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.tsx";
import { HeroUIProvider } from "@heroui/react";
import { AppRouter } from "@/router/AppRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <main className="dark text-foreground bg-background full min-h-screen min-w-screen">
        <App>
          <AppRouter />
        </App>
      </main>
    </HeroUIProvider>
  </StrictMode>,
);
