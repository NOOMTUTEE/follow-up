"use client";

import { useState } from "react";
import {
  CHANNEL_LABEL,
  STATUS_LABEL,
  type ContactChannel,
  type ContactStatus,
  type QueueDisplayContact,
} from "@/lib/contacts";

export interface ContactFormValue {
  name: string;
  role: string;
  phone: string;
  email: string;
  line: string;
  channel: ContactChannel;
  interests: string;
  topic: string;
  status: ContactStatus;
  followUpDate: string;
  followUpTime: string;
  note: string;
}

export const emptyForm: ContactFormValue = {
  name: "",
  role: "",
  phone: "",
  email: "",
  line: "",
  channel: "phone",
  interests: "",
  topic: "",
  status: "new",
  followUpDate: "",
  followUpTime: "",
  note: "",
};

export function toForm(c: QueueDisplayContact): ContactFormValue {
  return {
    name: c.name,
    role: c.role,
    phone: c.phone,
    email: c.email,
    line: c.line ?? "",
    channel: c.channel,
    interests: c.interests,
    topic: c.topic,
    status: c.status,
    followUpDate: c.followUpDate,
    followUpTime: c.followUpTime,
    note: c.note,
  };
}

const INPUT =
  "w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest";
const LABEL =
  "font-label-md text-label-md mb-1 block text-on-surface-variant";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

export function ContactFormModal({
  title,
  initial,
  serverError,
  onClose,
  onSave,
}: {
  title: string;
  initial: ContactFormValue;
  serverError: string | null;
  onClose: () => void;
  onSave: (v: ContactFormValue) => void;
}) {
  const [v, setV] = useState(initial);
  const set = (k: keyof ContactFormValue, val: string) =>
    setV((p) => ({ ...p, [k]: val }));
  const valid = v.name.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/45 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-space-md grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          {serverError && (
            <p className="font-body-md text-body-md rounded-lg bg-error-container/40 px-3 py-2.5 text-on-error-container sm:col-span-2">
              {serverError}
            </p>
          )}
          <Field label="ชื่อ">
            <input
              className={INPUT}
              value={v.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="เช่น คุณวราพร พัฒนพงศ์"
            />
          </Field>
          <Field label="บริษัทหรือองค์กร">
            <input
              className={INPUT}
              value={v.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="ตำแหน่ง, บริษัท"
            />
          </Field>
          <Field label="เบอร์โทรศัพท์">
            <input
              className={INPUT}
              value={v.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="08x-xxx-xxxx"
            />
          </Field>
          <Field label="อีเมล">
            <input
              className={INPUT}
              type="email"
              value={v.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="name@company.co"
            />
          </Field>
          <Field label="ช่องทางติดต่อ">
            <select
              className={`${INPUT} cursor-pointer`}
              value={v.channel}
              onChange={(e) => set("channel", e.target.value)}
            >
              {(Object.keys(CHANNEL_LABEL) as ContactChannel[]).map((c) => (
                <option key={c} value={c}>
                  {CHANNEL_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="LINE ID (ถ้ามี)">
            <input
              className={INPUT}
              value={v.line}
              onChange={(e) => set("line", e.target.value)}
              placeholder="@line_id"
            />
          </Field>
          <Field label="สิ่งที่สนใจ">
            <input
              className={INPUT}
              value={v.interests}
              onChange={(e) => set("interests", e.target.value)}
              placeholder="เช่น ส่วนลดสัญญารายปี"
            />
          </Field>
          <Field label="หัวข้อที่ติดตาม">
            <input
              className={INPUT}
              value={v.topic}
              onChange={(e) => set("topic", e.target.value)}
              placeholder="เช่น รอตอบรับใบเสนอราคา"
            />
          </Field>
          <Field label="สถานะ">
            <select
              className={`${INPUT} cursor-pointer`}
              value={v.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {(Object.keys(STATUS_LABEL) as ContactStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="วันที่ต้อง Follow-up">
            <input
              className={INPUT}
              type="date"
              value={v.followUpDate}
              onChange={(e) => set("followUpDate", e.target.value)}
            />
          </Field>
          <Field label="เวลา (ถ้ามี)">
            <input
              className={INPUT}
              type="time"
              value={v.followUpTime}
              onChange={(e) => set("followUpTime", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="หมายเหตุ">
              <textarea
                className="font-body-md text-body-md w-full resize-none rounded-lg bg-surface-container-low p-3 text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none"
                rows={3}
                value={v.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="บันทึกเพิ่มเติม..."
              />
            </Field>
          </div>
        </div>
        <div className="mt-space-md flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="font-title-md text-title-md h-10 rounded-lg border border-outline-variant px-4 text-on-surface-variant hover:bg-surface-container-low"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => valid && onSave(v)}
            className="font-title-md text-title-md h-10 rounded-lg bg-primary-container px-4 text-on-primary hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactDetailsModal({
  contact,
  onClose,
  onEdit,
}: {
  contact: QueueDisplayContact;
  onClose: () => void;
  onEdit: () => void;
}) {
  const rows: [string, string][] = [
    ["ชื่อ", contact.name],
    ["บริษัทหรือองค์กร", contact.role],
    ["อีเมล", contact.email || "-"],
    ["เบอร์โทรศัพท์", contact.phone || "-"],
    ["ช่องทางติดต่อ", CHANNEL_LABEL[contact.channel]],
    ["สิ่งที่สนใจ", contact.interests || "-"],
    ["สถานะ", STATUS_LABEL[contact.status]],
    ["วันที่ต้อง Follow-up", contact.dateText],
    ["หมายเหตุ", contact.note || "-"],
  ];
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            รายละเอียดผู้ติดต่อ
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <dl className="mt-space-md flex flex-col divide-y divide-surface-container-low">
          {rows.map(([k, val]) => (
            <div key={k} className="flex gap-4 py-2">
              <dt className="font-label-md text-label-md w-36 shrink-0 text-on-surface-variant">
                {k}
              </dt>
              <dd className="font-body-md text-body-md text-on-surface">{val}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-space-md flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="font-title-md text-title-md flex h-10 items-center gap-1.5 rounded-lg bg-primary-container px-4 text-on-primary hover:bg-primary"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            แก้ไข
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({
  count,
  onClose,
  onConfirm,
}: {
  count: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 text-error">
          <span className="material-symbols-outlined">warning</span>
          ยืนยันการลบ
        </h2>
        <p className="font-body-md text-body-md mt-2 text-on-surface-variant">
          ต้องการลบผู้ติดต่อ {count} รายการใช่หรือไม่
        </p>
        <div className="mt-space-md flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="font-title-md text-title-md h-10 rounded-lg border border-outline-variant px-4 text-on-surface-variant hover:bg-surface-container-low"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="font-title-md text-title-md h-10 rounded-lg bg-error px-4 text-on-error hover:opacity-90"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}
