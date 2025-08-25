import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <p>navbar</p>
      {children}
      <p>footer</p>
    </>
  );
}
