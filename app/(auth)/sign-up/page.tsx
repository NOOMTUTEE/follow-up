"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const INPUT =
  "w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest";
const LABEL =
  "font-label-md text-label-md mb-1 block text-on-surface-variant";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message ?? "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Image
            alt="Follow-up Board Logo"
            src="/images/logo.png"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
          />
          <span className="font-headline-sm text-headline-sm tracking-tight text-primary">
            Follow-up Board
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg mt-4 text-center tracking-tight text-on-surface">
          สร้างสมาชิกใหม่
        </h1>
        <p className="font-body-md text-body-md mt-1 text-center text-on-surface-variant">
          สมัครด้วยอีเมลและรหัสผ่านเพื่อเริ่มใช้งาน
        </p>

        <form onSubmit={submit} className="mt-space-md flex flex-col gap-space-sm">
          {error && (
            <p className="font-body-md text-body-md rounded-lg bg-error-container/40 px-3 py-2.5 text-on-error-container">
              {error}
            </p>
          )}
          <label className="block">
            <span className={LABEL}>ชื่อ</span>
            <input
              className={INPUT}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อของคุณ"
              required
            />
          </label>
          <label className="block">
            <span className={LABEL}>อีเมล</span>
            <input
              className={INPUT}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.co"
              required
            />
          </label>
          <label className="block">
            <span className={LABEL}>รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)</span>
            <input
              className={INPUT}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <label className="block">
            <span className={LABEL}>ยืนยันรหัสผ่าน</span>
            <input
              className={INPUT}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="font-title-md text-title-md mt-1 flex h-11 items-center justify-center rounded-lg bg-primary-container text-on-primary transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="font-body-md text-body-md mt-space-md text-center text-on-surface-variant">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-primary hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
