import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import { DELETE, GET, POST } from "../../app/api/contacts/route";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

vi.mock("@/lib/session", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    contact: {
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  } as unknown as PrismaClient,
}));

const mockUser = { id: "u1", name: "Test", email: "t@example.com" };

function jsonRequest(body: unknown, method = "POST"): Request {
  return new Request("http://localhost/api/contacts", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/contacts", () => {
  it("401 เมื่อไม่ล็อกอิน", async () => {
    vi.mocked(requireUser).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("ดึงเฉพาะ contact ของตัวเอง", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.findMany).mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(prisma.contact.findMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
      orderBy: { followUpDate: "asc" },
    });
  });
});

describe("POST /api/contacts", () => {
  const valid = {
    name: "คุณทดสอบ",
    status: "new",
    channel: "phone",
    followUpDate: "2026-09-18",
  };

  it("401 เมื่อไม่ล็อกอิน", async () => {
    vi.mocked(requireUser).mockResolvedValue(null);
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(401);
    expect(prisma.contact.create).not.toHaveBeenCalled();
  });

  it("400 เมื่อไม่กรอกชื่อ", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    const res = await POST(jsonRequest({ ...valid, name: "  " }));
    expect(res.status).toBe(400);
  });

  it("400 เมื่อสถานะ/ช่องทาง/วันที่ผิด", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    expect((await POST(jsonRequest({ ...valid, status: "x" }))).status).toBe(
      400,
    );
    expect((await POST(jsonRequest({ ...valid, channel: "x" }))).status).toBe(
      400,
    );
    expect(
      (await POST(jsonRequest({ ...valid, followUpDate: "xx" }))).status,
    ).toBe(400);
    expect(prisma.contact.create).not.toHaveBeenCalled();
  });

  it("201 และผูก userId ตอนสร้าง", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.create).mockResolvedValue({ id: "c1" } as never);
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(201);
    expect(prisma.contact.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "u1", name: "คุณทดสอบ" }),
    });
  });
});

describe("DELETE /api/contacts (bulk)", () => {
  it("401 เมื่อไม่ล็อกอิน", async () => {
    vi.mocked(requireUser).mockResolvedValue(null);
    const res = await DELETE(jsonRequest({ ids: ["c1"] }, "DELETE"));
    expect(res.status).toBe(401);
  });

  it("400 เมื่อไม่ส่ง ids", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    const res = await DELETE(jsonRequest({ ids: [] }, "DELETE"));
    expect(res.status).toBe(400);
  });

  it("ลบเฉพาะของตัวเอง", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.deleteMany).mockResolvedValue({ count: 2 });
    const res = await DELETE(jsonRequest({ ids: ["c1", "c2"] }, "DELETE"));
    expect(res.status).toBe(200);
    expect(prisma.contact.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["c1", "c2"] }, userId: "u1" },
    });
  });
});
