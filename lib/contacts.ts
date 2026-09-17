export type ContactStatus = "new" | "talking" | "closed";
export type ContactChannel = "phone" | "email" | "line" | "meet";

/** รูปร่างแถว contact ที่ API ส่งมา (ตรงกับ Prisma Contact) */
export interface ContactRecord {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  line: string | null;
  channel: string;
  interests: string;
  topic: string;
  status: string;
  followUpDate: string;
  followUpTime: string;
  note: string;
  noteMeta: string;
}

export interface QueueDisplayContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  line?: string;
  channel: ContactChannel;
  interests: string;
  topic: string;
  pill: string;
  dot: string;
  status: ContactStatus;
  followUpDate: string;
  followUpTime: string;
  dateText: string;
  dateIcon: string;
  dateIconClass: string;
  dateTextClass?: string;
  dateLabel: string;
  dateLabelClass: string;
  note: string;
  noteMeta: string;
  noteMetaError?: boolean;
  avatarInitials: string;
  avatarBg: string;
  quickActionIcon: string;
  quickActionTitle: string;
}

export const STATUS_LABEL: Record<ContactStatus, string> = {
  new: "รายการใหม่",
  talking: "กำลังคุย",
  closed: "ปิดงาน",
};

export const CHANNEL_LABEL: Record<ContactChannel, string> = {
  phone: "เบอร์โทรศัพท์",
  email: "อีเมล",
  line: "LINE Official",
  meet: "นัดพบ (On-site / Meet)",
};

const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

/** วันที่ปัจจุบัน (YYYY-MM-DD) เขต Asia/Bangkok */
export function todayStrBangkok(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** ส่วนวันที่ (UTC) ของ ISO string -> YYYY-MM-DD */
export function datePartUTC(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function formatThaiDateUTC(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${THAI_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear() + 543}`;
}

const PILL_BY_STATUS: Record<ContactStatus, { pill: string; dot: string }> = {
  new: { pill: "bg-sky-50 text-sky-800", dot: "bg-sky-600" },
  talking: { pill: "bg-amber-50 text-amber-800", dot: "bg-amber-600" },
  closed: { pill: "bg-emerald-50 text-emerald-800", dot: "bg-emerald-600" },
};

const AVATAR_BY_STATUS: Record<ContactStatus, string> = {
  new: "bg-surface-container-highest text-primary",
  talking: "bg-primary-fixed text-on-primary-fixed",
  closed: "bg-tertiary-fixed text-on-tertiary-fixed",
};

const QUICK_ACTION: Record<ContactChannel, { icon: string; title: string }> = {
  phone: { icon: "phone", title: "โทรด่วน" },
  email: { icon: "mail", title: "ส่งอีเมล" },
  line: { icon: "chat", title: "เปิดแชท" },
  meet: { icon: "videocam", title: "วิดีโอคอล" },
};

function asStatus(s: string): ContactStatus {
  return s === "talking" || s === "closed" ? s : "new";
}

function asChannel(s: string): ContactChannel {
  return s === "email" || s === "line" || s === "meet" ? s : "phone";
}

function initialsOf(name: string): string {
  return name.replace(/^คุณ/, "").trim().slice(0, 2);
}

export function toDisplay(
  r: ContactRecord,
  todayStr: string,
): QueueDisplayContact {
  const status = asStatus(r.status);
  const channel = asChannel(r.channel);
  const datePart = datePartUTC(r.followUpDate);
  const diff =
    Math.round(
      (Date.parse(`${datePart}T00:00:00Z`) - Date.parse(`${todayStr}T00:00:00Z`)) /
        86400000,
    );
  const overdue = diff < 0;
  const timeSuffix = r.followUpTime ? ` • ${r.followUpTime} น.` : "";
  const rel =
    diff === 0
      ? "วันนี้"
      : diff === 1
        ? "พรุ่งนี้"
        : diff < 0
          ? `เกินกำหนด ${Math.abs(diff)} วัน`
          : `ใน ${diff} วัน`;
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    phone: r.phone,
    email: r.email,
    line: r.line ?? undefined,
    channel,
    interests: r.interests,
    topic: r.topic || STATUS_LABEL[status],
    pill: PILL_BY_STATUS[status].pill,
    dot: PILL_BY_STATUS[status].dot,
    status,
    followUpDate: datePart,
    followUpTime: r.followUpTime,
    dateText: formatThaiDateUTC(r.followUpDate),
    dateIcon: overdue ? "notification_important" : "event",
    dateIconClass: overdue ? "text-error" : "text-primary",
    dateTextClass: overdue ? "text-error" : undefined,
    dateLabel: `${rel}${timeSuffix}`,
    dateLabelClass: overdue
      ? "bg-error text-on-error"
      : diff === 0
        ? "bg-primary-fixed text-on-primary-fixed"
        : "bg-surface-container-high text-on-surface-variant",
    note: r.note,
    noteMeta: r.noteMeta || "เพิ่มผ่านฟอร์ม",
    noteMetaError: overdue,
    avatarInitials: initialsOf(r.name),
    avatarBg: AVATAR_BY_STATUS[status],
    quickActionIcon: QUICK_ACTION[channel].icon,
    quickActionTitle: QUICK_ACTION[channel].title,
  };
}
