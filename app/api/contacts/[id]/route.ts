import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const STATUSES = ["new", "talking", "closed"];
const CHANNELS = ["phone", "email", "line", "meet"];

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function owned(id: string, userId: string) {
  return prisma.contact.findFirst({ where: { id, userId } });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) return bad("กรุณาเข้าสู่ระบบ", 401);
  const { id } = await params;
  const existing = await owned(id, user.id);
  if (!existing) return bad("ไม่พบข้อมูล", 404);

  const body = (await request.json()) as Record<string, unknown>;
  const data: Record<string, string | Date | null> = {};
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return bad("กรุณากรอกชื่อ");
    data.name = name;
  }
  for (const key of [
    "role",
    "phone",
    "email",
    "interests",
    "topic",
    "followUpTime",
    "note",
    "noteMeta",
  ]) {
    if (body[key] !== undefined) data[key] = String(body[key]);
  }
  if (body.line !== undefined) data.line = String(body.line) || null;
  if (body.status !== undefined) {
    if (!STATUSES.includes(String(body.status))) return bad("สถานะไม่ถูกต้อง");
    data.status = String(body.status);
  }
  if (body.channel !== undefined) {
    if (!CHANNELS.includes(String(body.channel)))
      return bad("ช่องทางติดต่อไม่ถูกต้อง");
    data.channel = String(body.channel);
  }
  if (body.followUpDate !== undefined) {
    const dateStr = String(body.followUpDate).trim();
    if (!dateStr) return bad("วันที่ไม่ถูกต้อง");
    const followUpDate = new Date(`${dateStr}T00:00:00Z`);
    if (Number.isNaN(followUpDate.getTime())) return bad("วันที่ไม่ถูกต้อง");
    data.followUpDate = followUpDate;
  }

  const contact = await prisma.contact.update({ where: { id }, data });
  return NextResponse.json({ contact });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) return bad("กรุณาเข้าสู่ระบบ", 401);
  const { id } = await params;
  const existing = await owned(id, user.id);
  if (!existing) return bad("ไม่พบข้อมูล", 404);
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ deleted: 1 });
}
