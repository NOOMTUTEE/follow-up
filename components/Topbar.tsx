import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function Topbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const name = session?.user?.name?.trim() || "ผู้ใช้";
  const initial = name.replace(/^คุณ/, "").trim().slice(0, 1) || "ผ";

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between bg-surface-container-lowest/90 px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-64">
      <div className="flex w-96 items-center gap-space-md">
        <div className="relative flex w-full items-center">
          <span className="material-symbols-outlined pointer-events-none absolute left-space-sm text-body-lg text-on-surface-variant">
            search
          </span>
          <input
            className="font-body-md text-body-md h-10 w-full rounded-lg bg-surface-container-low py-space-xs pr-space-md pl-10 text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none"
            placeholder="ค้นหาผู้ติดต่อ, บริษัท, ป้ายกำกับ..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <button className="font-title-md text-title-md hidden h-10 items-center gap-space-xs rounded-lg bg-primary-container px-space-md text-on-primary transition-colors hover:bg-primary sm:flex">
          <span className="material-symbols-outlined text-title-md">
            person_add
          </span>
          <span>+ เพิ่มผู้ติดต่อใหม่</span>
        </button>
        <button
          aria-label="การแจ้งเตือน"
          className="relative flex items-center justify-center rounded-lg p-space-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="font-label-sm text-label-sm absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error">
            3
          </span>
        </button>
        <div className="hidden items-center gap-space-sm pl-space-xs lg:flex">
          <span className="font-title-md flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-[13px] text-on-primary">
            {initial}
          </span>
          <div className="flex flex-col text-left">
            <span className="font-title-md text-title-md leading-tight text-on-surface">
              {name}
            </span>
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
              {session?.user?.email ?? ""}
            </span>
          </div>
          <SignOutButton />
        </div>
        <div className="lg:hidden">
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
