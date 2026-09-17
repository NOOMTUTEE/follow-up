"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/contacts", label: "Contacts", icon: "group" },
  { href: "#", label: "Pipeline Board", icon: "view_kanban" },
  { href: "#", label: "Schedule / Calendar", icon: "calendar_today" },
  { href: "#", label: "Settings", icon: "settings" },
];

const BASE_LINK =
  "flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-50 hidden h-full w-64 flex-col justify-between bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:flex">
      <div className="flex flex-col">
        <div className="flex h-16 items-center gap-space-sm px-space-md">
          <Image
            alt="Follow-up Board Logo"
            src="/images/logo.png"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
          <span className="font-headline-sm text-headline-sm tracking-tight text-primary">
            Follow-up Board
          </span>
        </div>
        <nav className="flex flex-col gap-space-xs px-space-sm pt-space-md">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? `${BASE_LINK} bg-surface-container font-bold text-primary`
                    : `${BASE_LINK} font-title-md text-title-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface`
                }
              >
                <span className="material-symbols-outlined text-title-md">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-space-md">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-space-sm">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
              Follow-ups Due
            </span>
            <span className="font-headline-sm text-headline-sm text-error">
              3 ค้างติดตาม
            </span>
          </div>
          <span className="material-symbols-outlined text-error">
            notification_important
          </span>
        </div>
      </div>
    </aside>
  );
}
