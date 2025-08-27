import type { ReactNode } from "react";
import AppLayout from "@/AppLayout";
import "./App.css";

interface Props {
  children: ReactNode;
}

function App({ children }: Props) {
  return (
    <main className="dark text-foreground bg-background page-layout min-h-screen min-w-screen">
      <AppLayout>{children}</AppLayout>
    </main>
  );
}

export default App;
