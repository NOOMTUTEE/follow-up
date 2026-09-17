"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={signOut}
      title="ออกจากระบบ"
      aria-label="ออกจากระบบ"
      className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-error"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
    </button>
  );
}
