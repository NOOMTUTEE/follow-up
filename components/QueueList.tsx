"use client";

import Image from "next/image";
import { useState } from "react";
import { queueItems, type QueueSlot } from "@/lib/mock-data";

type TabId = "all" | QueueSlot;

const TABS: { id: TabId; label: string; error?: boolean }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "morning", label: "ช่วงเช้า" },
  { id: "afternoon", label: "ช่วงบ่าย" },
  { id: "overdue", label: "เกินกำหนด", error: true },
];

const ACTIVE_TAB =
  "px-3 py-1 rounded-md text-primary bg-surface-container-lowest shadow-sm font-label-md text-label-md transition-colors";
const IDLE_TAB =
  "px-3 py-1 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors";
const IDLE_TAB_ERROR =
  "px-3 py-1 rounded-md text-error hover:bg-error-container/40 font-label-md text-label-md transition-colors";

export default function QueueList() {
  const [tab, setTab] = useState<TabId>("all");
  const [doneIds, setDoneIds] = useState<string[]>([]);

  const counts: Record<TabId, number> = {
    all: queueItems.length,
    morning: queueItems.filter((i) => i.slot === "morning").length,
    afternoon: queueItems.filter((i) => i.slot === "afternoon").length,
    overdue: queueItems.filter((i) => i.slot === "overdue").length,
  };

  const visible =
    tab === "all" ? queueItems : queueItems.filter((i) => i.slot === tab);

  const toggleDone = (id: string) =>
    setDoneIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex flex-col justify-between gap-space-sm pb-space-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary-container">
            schedule
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            รายการที่ต้องติดตามวันนี้ (Today&apos;s Queue)
          </h2>
        </div>
        <div className="inline-flex gap-1 self-start rounded-lg bg-surface-container-low p-1 sm:self-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id ? ACTIVE_TAB : t.error ? IDLE_TAB_ERROR : IDLE_TAB
              }
            >
              {t.label} ({counts[t.id]})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-space-sm space-y-space-sm">
        {visible.map((item) => {
          const done = doneIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="group relative flex flex-col space-y-space-sm overflow-hidden rounded-xl bg-surface-bright p-space-md shadow-sm transition-all hover:bg-surface-container-low"
            >
              <div
                className={`absolute top-0 bottom-0 left-0 w-1.5 ${item.bar}`}
              ></div>
              <div className="flex flex-col justify-between gap-space-sm sm:flex-row sm:items-start">
                <div className="flex items-start gap-space-sm">
                  {item.avatar ? (
                    <Image
                      className="mt-0.5 h-11 w-11 rounded-full object-cover shadow-sm"
                      src={item.avatar}
                      alt={item.avatarAlt ?? item.name}
                      width={44}
                      height={44}
                    />
                  ) : (
                    <div
                      className={`font-headline-sm text-headline-sm mt-0.5 flex h-11 w-11 items-center justify-center rounded-full ${item.initialsClass}`}
                    >
                      {item.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                        {item.name}
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="font-title-md text-title-md text-on-surface-variant">
                        {item.company}
                      </span>
                      <span
                        className={`font-label-sm text-label-sm inline-flex items-center rounded-full px-2 py-0.5 ${item.topicPill}`}
                      >
                        {item.topic}
                      </span>
                      {done && (
                        <span className="font-label-sm text-label-sm inline-flex items-center rounded-full bg-tertiary-fixed px-2 py-0.5 text-on-tertiary-fixed-variant">
                          เสร็จสิ้นแล้ว
                        </span>
                      )}
                    </div>
                    <div className="font-body-sm text-body-sm mt-1 flex flex-wrap items-center gap-space-md text-on-surface-variant">
                      {item.channels.map((c) => (
                        <span
                          key={c.text}
                          className="inline-flex items-center gap-1"
                        >
                          <span
                            className={`material-symbols-outlined text-body-sm ${c.iconClass}`}
                          >
                            {c.icon}
                          </span>
                          {c.text}
                        </span>
                      ))}
                      <span
                        className={`font-title-md inline-flex items-center gap-1 ${item.timeIcon === "alarm" ? "text-error" : "text-on-surface"}`}
                      >
                        <span
                          className={`material-symbols-outlined text-body-sm ${item.timeIcon === "alarm" ? "" : "text-primary"}`}
                        >
                          {item.timeIcon}
                        </span>
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm self-start rounded-md bg-surface-container-high px-2 py-1 uppercase text-on-surface-variant">
                  {item.badge}
                </span>
              </div>
              <div className="font-body-sm text-body-sm flex items-start gap-2 rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-on-surface-variant">
                <span
                  className={`material-symbols-outlined text-body-md mt-0.5 ${item.noteIconClass}`}
                >
                  {item.noteIcon}
                </span>
                <span>
                  <strong>บันทึกล่าสุด:</strong> {item.note}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  {item.actions.map((action, i) => (
                    <button
                      key={action.label}
                      type="button"
                      className={
                        i === 0
                          ? "font-label-md text-label-md flex h-8 items-center gap-1 rounded-lg bg-primary-container px-3 text-on-primary transition-colors hover:bg-primary"
                          : "font-label-md text-label-md flex h-8 items-center gap-1 rounded-lg bg-surface-container-low px-3 text-on-surface transition-colors hover:bg-surface-container"
                      }
                    >
                      <span className="material-symbols-outlined text-label-md">
                        {action.icon}
                      </span>
                      {action.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => toggleDone(item.id)}
                  className={
                    item.doneAction.gray
                      ? "font-label-md text-label-md flex h-8 items-center gap-1 rounded-lg bg-surface-container-low px-3 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                      : done
                        ? "font-label-md text-label-md flex h-8 items-center gap-1 rounded-lg bg-tertiary-fixed px-3 text-on-tertiary-fixed-variant transition-colors"
                        : "font-label-md text-label-md flex h-8 items-center gap-1 rounded-lg bg-tertiary-container px-3 text-on-tertiary transition-opacity hover:opacity-90"
                  }
                >
                  <span className="material-symbols-outlined text-label-md">
                    {item.doneAction.gray && !done
                      ? item.doneAction.icon
                      : "check_circle"}
                  </span>
                  {done && !item.doneAction.gray
                    ? "เสร็จสิ้นแล้ว"
                    : item.doneAction.label}
                </button>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="font-body-md text-body-md rounded-xl border border-dashed border-outline-variant p-6 text-center text-on-surface-variant">
            ไม่มีรายการในช่วงนี้
          </div>
        )}
      </div>
    </div>
  );
}
