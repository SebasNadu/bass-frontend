import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.tsx";
import { HeroUIProvider } from "@heroui/react";
import { AppRouter } from "@/router/AppRouter";
import { AuthProvider } from "./context/AuthContext";

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <AuthProvider>
        <BrowserRouter>
          <App>
            <AppRouter />
          </App>
        </BrowserRouter>
      </AuthProvider>
    </HeroUIProvider>
  </StrictMode>
);
