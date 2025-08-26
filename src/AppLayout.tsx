import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <div>navbar</div>
      <div className="content">{children}</div>
      <div>footer</div>
    </>
  );
}
