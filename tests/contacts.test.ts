import { describe, expect, it } from "vitest";
import {
  datePartUTC,
  formatThaiDateUTC,
  toDisplay,
  todayStrBangkok,
  type ContactRecord,
} from "../lib/contacts";

const TODAY = "2026-09-17";

function record(overrides: Partial<ContactRecord> = {}): ContactRecord {
  return {
    id: "c1",
    name: "คุณวราพร พัฒนพงศ์",
    role: "VP of Techvision Co., Ltd.",
    phone: "081-234-5678",
    email: "waraporn@techvision.co",
    line: null,
    channel: "phone",
    interests: "ส่วนลดสัญญารายปี",
    topic: "รอตอบรับใบเสนอราคา",
    status: "talking",
    followUpDate: "2026-09-17T00:00:00.000Z",
    followUpTime: "10:30",
    note: "ขอส่วนลด 5%",
    noteMeta: "โทรศัพท์คุย",
    ...overrides,
  };
}

describe("todayStrBangkok", () => {
  it("คืนวันที่รูปแบบ YYYY-MM-DD", () => {
    expect(todayStrBangkok()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("datePartUTC", () => {
  it("ตัดเวลาออกเหลือแค่วันที่", () => {
    expect(datePartUTC("2026-09-17T15:30:00.000Z")).toBe("2026-09-17");
  });
});

describe("formatThaiDateUTC", () => {
  it("แสดงวัน/เดือน/ปี พ.ศ.", () => {
    expect(formatThaiDateUTC("2024-10-24T00:00:00.000Z")).toBe(
      "24 ต.ค. 2567",
    );
    expect(formatThaiDateUTC("2026-09-17T00:00:00.000Z")).toBe(
      "17 ก.ย. 2569",
    );
  });
});

describe("toDisplay", () => {
  it("รายการวันนี้แสดงป้าย วันนี้ + เวลา", () => {
    const d = toDisplay(record(), TODAY);
    expect(d.dateText).toBe("17 ก.ย. 2569");
    expect(d.dateLabel).toBe("วันนี้ • 10:30 น.");
    expect(d.dateLabelClass).toContain("bg-primary-fixed");
    expect(d.noteMetaError).toBeFalsy();
  });

  it("รายการเกินกำหนดแสดงป้ายแดง", () => {
    const d = toDisplay(
      record({ followUpDate: "2026-09-16T00:00:00.000Z", followUpTime: "" }),
      TODAY,
    );
    expect(d.dateLabel).toBe("เกินกำหนด 1 วัน");
    expect(d.dateLabelClass).toContain("bg-error");
    expect(d.dateIcon).toBe("notification_important");
    expect(d.noteMetaError).toBe(true);
  });

  it("รายการพรุ่งนี้และอนาคต", () => {
    expect(
      toDisplay(record({ followUpDate: "2026-09-18T00:00:00.000Z" }), TODAY)
        .dateLabel,
    ).toBe("พรุ่งนี้ • 10:30 น.");
    expect(
      toDisplay(record({ followUpDate: "2026-09-21T00:00:00.000Z" }), TODAY)
        .dateLabel,
    ).toBe("ใน 4 วัน • 10:30 น.");
  });

  it("สีกำกับตามสถานะ", () => {
    expect(toDisplay(record({ status: "new" }), TODAY).pill).toContain(
      "bg-sky-50",
    );
    expect(toDisplay(record({ status: "talking" }), TODAY).pill).toContain(
      "bg-amber-50",
    );
    expect(toDisplay(record({ status: "closed" }), TODAY).pill).toContain(
      "bg-emerald-50",
    );
  });

  it("สถานะที่ไม่รู้จักตกลงเป็น รายการใหม่", () => {
    const d = toDisplay(record({ status: "weird" }), TODAY);
    expect(d.status).toBe("new");
  });

  it("หัวข้อว่างใช้ชื่อสถานะแทน", () => {
    const d = toDisplay(record({ topic: "", status: "closed" }), TODAY);
    expect(d.topic).toBe("ปิดงาน");
  });

  it("ชื่อย่อตัดคำนำหน้า คุณ ออก", () => {
    expect(toDisplay(record({ name: "คุณวราพร พัฒนพงศ์" }), TODAY).avatarInitials).toBe(
      "วร",
    );
    expect(toDisplay(record({ name: "John Doe" }), TODAY).avatarInitials).toBe(
      "Jo",
    );
  });

  it("ปุ่มด่วนเปลี่ยนตามช่องทาง", () => {
    expect(toDisplay(record({ channel: "phone" }), TODAY).quickActionIcon).toBe(
      "phone",
    );
    expect(toDisplay(record({ channel: "line" }), TODAY).quickActionIcon).toBe(
      "chat",
    );
    expect(
      toDisplay(record({ channel: "carrier-pigeon" }), TODAY).quickActionIcon,
    ).toBe("phone");
  });
});
