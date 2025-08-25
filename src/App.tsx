import type { ReactNode } from "react";
import AppLayout from "@/AppLayout";
import "./App.css";

interface Props {
  children: ReactNode;
}

function App({ children }: Props) {
  return <AppLayout>{children}</AppLayout>;
}

export default App;
