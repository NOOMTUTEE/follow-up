"use client";

import { useState } from "react";

export default function QuickNote() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!note.trim()) return;
    setSaved(true);
    setNote("");
  };

  return (
    <div className="flex flex-col rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-on-surface-variant">
            edit_note
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            บันทึกช่วยจำด่วน (Quick Note)
          </h3>
        </div>
        <span className="inline-block h-2 w-2 rounded-full bg-tertiary"></span>
      </div>
      <p className="font-body-sm text-body-sm mb-space-sm text-on-surface-variant">
        จดโน้ตสั้นสำหรับการโทรติดตามงานวันนี้
      </p>
      <div className="relative">
        <textarea
          className="font-body-sm text-body-sm w-full resize-none rounded-lg bg-surface-container-low p-space-sm text-on-surface placeholder:text-outline focus:bg-surface-bright focus:outline-none"
          placeholder="พิมพ์บันทึกข้อตกลงด่วน หรือเงื่อนไขที่คุยค้างไว้..."
          rows={3}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
        ></textarea>
        <div className="mt-space-xs flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-outline">
            {saved ? "บันทึกแล้ว" : "บันทึกอัตโนมัติ"}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={!note.trim()}
            className="font-label-md text-label-md flex h-8 items-center gap-1 rounded-lg bg-primary-container px-3 text-on-primary transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-label-md">
              save
            </span>
            <span>บันทึกโน้ต</span>
          </button>
        </div>
      </div>
    </div>
  );
}
