import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen flex-col bg-background pl-0 lg:pl-64">
        <Topbar />
        {children}
      </div>
    </>
  );
}
