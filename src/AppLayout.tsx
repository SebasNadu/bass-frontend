import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div>navbar</div>

        <div className="flex justify-center items-center p-4">{children}</div>

        <div>footer</div>
      </div>
    </>
  );
}
