import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const STATUSES = ["new", "talking", "closed"];
const CHANNELS = ["phone", "email", "line", "meet"];

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const user = await requireUser();
  if (!user) return bad("กรุณาเข้าสู่ระบบ", 401);
  const contacts = await prisma.contact.findMany({
    where: { userId: user.id },
    orderBy: { followUpDate: "asc" },
  });
  return NextResponse.json({ contacts });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return bad("กรุณาเข้าสู่ระบบ", 401);
  const body = (await request.json()) as Record<string, unknown>;

  const name = String(body.name ?? "").trim();
  if (!name) return bad("กรุณากรอกชื่อ");
  const status = String(body.status ?? "new");
  if (!STATUSES.includes(status)) return bad("สถานะไม่ถูกต้อง");
  const channel = String(body.channel ?? "phone");
  if (!CHANNELS.includes(channel)) return bad("ช่องทางติดต่อไม่ถูกต้อง");

  const dateStr = String(body.followUpDate ?? "").trim();
  const followUpDate = dateStr ? new Date(`${dateStr}T00:00:00Z`) : new Date();
  if (Number.isNaN(followUpDate.getTime())) return bad("วันที่ไม่ถูกต้อง");

  const contact = await prisma.contact.create({
    data: {
      userId: user.id,
      name,
      role: String(body.role ?? ""),
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      line: String(body.line ?? "") || null,
      channel,
      interests: String(body.interests ?? ""),
      topic: String(body.topic ?? "") || "รายการใหม่",
      status,
      followUpDate,
      followUpTime: String(body.followUpTime ?? ""),
      note: String(body.note ?? ""),
      noteMeta: "เพิ่มผ่านฟอร์ม",
    },
  });
  return NextResponse.json({ contact }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await requireUser();
  if (!user) return bad("กรุณาเข้าสู่ระบบ", 401);
  const body = (await request.json()) as Record<string, unknown>;
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string")
    : [];
  if (ids.length === 0) return bad("ไม่ได้เลือกรายการ");
  const result = await prisma.contact.deleteMany({
    where: { id: { in: ids }, userId: user.id },
  });
  return NextResponse.json({ deleted: result.count });
}
