import type { ReactNode } from "react";
import AppNavbar from "@/components/navbar/Navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <AppNavbar />
      <div className="content">{children}</div>
    </>
  );
}
