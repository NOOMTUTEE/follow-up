import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "Follow-up Board",
  description: "จัดการรายชื่อผู้ติดต่อ สถานะ และวันติดตาม",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full">
        <Sidebar />
        <div className="flex min-h-screen flex-col bg-background pl-0 lg:pl-64">
          <Topbar />
          {children}
        </div>
      </body>
    </html>
  );
}
