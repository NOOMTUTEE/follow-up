import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import { DELETE, PATCH } from "../../../app/api/contacts/[id]/route";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

vi.mock("@/lib/session", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    contact: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient,
}));

const mockUser = { id: "u1", name: "Test", email: "t@example.com" };
const ctx = { params: Promise.resolve({ id: "c1" }) };

function jsonRequest(body: unknown, method: string): Request {
  return new Request("http://localhost/api/contacts/c1", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/contacts/[id]", () => {
  it("401 เมื่อไม่ล็อกอิน", async () => {
    vi.mocked(requireUser).mockResolvedValue(null);
    const res = await PATCH(jsonRequest({ note: "x" }, "PATCH"), ctx);
    expect(res.status).toBe(401);
  });

  it("404 เมื่อไม่ใช่ของตัวเอง", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.findFirst).mockResolvedValue(null);
    const res = await PATCH(jsonRequest({ note: "hack" }, "PATCH"), ctx);
    expect(res.status).toBe(404);
    expect(prisma.contact.update).not.toHaveBeenCalled();
  });

  it("400 เมื่อชื่อว่างหรือสถานะผิด", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.findFirst).mockResolvedValue({ id: "c1" } as never);
    expect(
      (await PATCH(jsonRequest({ name: "  " }, "PATCH"), ctx)).status,
    ).toBe(400);
    expect(
      (await PATCH(jsonRequest({ status: "x" }, "PATCH"), ctx)).status,
    ).toBe(400);
    expect(prisma.contact.update).not.toHaveBeenCalled();
  });

  it("อัปเดตของตัวเองสำเร็จ", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.findFirst).mockResolvedValue({ id: "c1" } as never);
    vi.mocked(prisma.contact.update).mockResolvedValue({ id: "c1" } as never);
    const res = await PATCH(jsonRequest({ note: "updated" }, "PATCH"), ctx);
    expect(res.status).toBe(200);
    expect(prisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: "c1", userId: "u1" },
    });
  });
});

describe("DELETE /api/contacts/[id]", () => {
  const delCtx = { params: Promise.resolve({ id: "c1" }) };

  it("401 เมื่อไม่ล็อกอิน", async () => {
    vi.mocked(requireUser).mockResolvedValue(null);
    const res = await DELETE(
      new Request("http://localhost/api/contacts/c1", { method: "DELETE" }),
      delCtx,
    );
    expect(res.status).toBe(401);
  });

  it("404 เมื่อไม่ใช่ของตัวเอง", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.findFirst).mockResolvedValue(null);
    const res = await DELETE(
      new Request("http://localhost/api/contacts/c1", { method: "DELETE" }),
      delCtx,
    );
    expect(res.status).toBe(404);
    expect(prisma.contact.delete).not.toHaveBeenCalled();
  });

  it("ลบของตัวเองสำเร็จ", async () => {
    vi.mocked(requireUser).mockResolvedValue(mockUser as never);
    vi.mocked(prisma.contact.findFirst).mockResolvedValue({ id: "c1" } as never);
    const res = await DELETE(
      new Request("http://localhost/api/contacts/c1", { method: "DELETE" }),
      delCtx,
    );
    expect(res.status).toBe(200);
    expect(prisma.contact.delete).toHaveBeenCalledWith({
      where: { id: "c1" },
    });
  });
});
