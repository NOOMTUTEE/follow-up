"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  datePartUTC,
  toDisplay,
  todayStrBangkok,
  type ContactRecord,
  type QueueDisplayContact,
} from "@/lib/contacts";
import {
  ContactDetailsModal,
  ContactFormModal,
  DeleteConfirmModal,
  emptyForm,
  toForm,
  type ContactFormValue,
} from "@/components/ContactModals";

type StatusFilter = "all" | "new" | "talking" | "closed" | "overdue";
type DateFilter = "all" | "today" | "week" | "overdue" | "month";
type SortKey = "nearest" | "name" | "company";

const SELECT =
  "appearance-none h-9 pl-3 pr-8 bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md rounded-lg focus:outline-none cursor-pointer";
const SELECT_ICON =
  "material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none";

function FilterSelect({
  value,
  onChange,
  children,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        className={SELECT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      <span className={SELECT_ICON}>expand_more</span>
    </div>
  );
}

export default function ContactsBoard() {
  const { data: session } = authClient.useSession();
  const [contacts, setContacts] = useState<QueueDisplayContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<StatusFilter>("all");
  const [channelF, setChannelF] = useState<string>("all");
  const [dateF, setDateF] = useState<DateFilter>("all");
  const [sort, setSort] = useState<SortKey>("nearest");
  const [selected, setSelected] = useState<string[]>([]);
  const [menuId, setMenuId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formInitial, setFormInitial] = useState<ContactFormValue>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [details, setDetails] = useState<QueueDisplayContact | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const todayStr = useMemo(() => todayStrBangkok(), []);

  const reload = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { contacts: ContactRecord[] };
      setContacts(data.contacts.map((r) => toDisplay(r, todayStr)));
    } catch {
      setLoadError("โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรชหน้าอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/contacts");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { contacts: ContactRecord[] };
        if (!cancelled) {
          setContacts(data.contacts.map((r) => toDisplay(r, todayStr)));
        }
      } catch {
        if (!cancelled) {
          setLoadError("โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรชหน้าอีกครั้ง");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [todayStr]);

  const metrics = useMemo(() => {
    const today = contacts.filter((c) => c.followUpDate === todayStr).length;
    const overdue = contacts.filter((c) => c.followUpDate < todayStr).length;
    const talking = contacts.filter((c) => c.status === "talking").length;
    const closed = contacts.filter(
      (c) => c.status === "closed" && c.followUpDate.startsWith(todayStr.slice(0, 7)),
    ).length;
    return { today, overdue, talking, closed };
  }, [contacts, todayStr]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = contacts.filter((c) => {
      if (
        q &&
        ![c.name, c.role, c.phone, c.email, c.note]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (statusF === "overdue") {
        if (!(c.followUpDate < todayStr)) return false;
      } else if (statusF !== "all" && c.status !== statusF) return false;
      if (channelF !== "all" && c.channel !== channelF) return false;
      const d = Math.round(
        (Date.parse(`${c.followUpDate}T00:00:00Z`) -
          Date.parse(`${todayStr}T00:00:00Z`)) /
          86400000,
      );
      if (dateF === "today" && d !== 0) return false;
      if (dateF === "week" && (d < 0 || d > 7)) return false;
      if (dateF === "overdue" && d >= 0) return false;
      if (dateF === "month" && !c.followUpDate.startsWith(todayStr.slice(0, 7)))
        return false;
      return true;
    });
    return [...rows].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "th");
      if (sort === "company") return a.role.localeCompare(b.role, "en");
      return a.followUpDate.localeCompare(b.followUpDate);
    });
  }, [contacts, search, statusF, channelF, dateF, sort, todayStr]);

  const toggleSelect = (id: string) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((s) => s !== id) : [...p, id],
    );

  const allChecked =
    filtered.length > 0 && filtered.every((c) => selected.includes(c.id));

  const toggleAll = () =>
    setSelected((p) =>
      allChecked
        ? p.filter((id) => !filtered.some((c) => c.id === id))
        : [...new Set([...p, ...filtered.map((c) => c.id)])],
    );

  const openAdd = () => {
    setFormTitle("เพิ่มผู้ติดต่อใหม่");
    setFormInitial(emptyForm);
    setEditingId(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (c: QueueDisplayContact) => {
    setFormTitle("แก้ไขผู้ติดต่อ");
    setFormInitial(toForm(c));
    setEditingId(c.id);
    setFormError(null);
    setFormOpen(true);
    setMenuId(null);
    setDetails(null);
  };

  const saveForm = async (v: ContactFormValue) => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        ...v,
        followUpDate: v.followUpDate || datePartUTC(new Date().toISOString()),
      };
      const res = editingId
        ? await fetch(`/api/contacts/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setFormError(data?.error ?? "บันทึกไม่สำเร็จ กรุณาลองใหม่");
        return;
      }
      await reload();
      setFormOpen(false);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteIds) return;
    if (deleteIds.length === 1) {
      await fetch(`/api/contacts/${deleteIds[0]}`, { method: "DELETE" });
    } else {
      await fetch("/api/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: deleteIds }),
      });
    }
    setDeleteIds(null);
    setMenuId(null);
    await reload();
  };

  const ownerName = session?.user?.name?.trim() || "ผู้ใช้";
  const ownerInitial =
    ownerName.replace(/^คุณ/, "").trim().slice(0, 1) || "ผ";

  const channelMain = (c: QueueDisplayContact): [string, string] => {
    if (c.channel === "line") return ["chat", c.line || "LINE"];
    if (c.channel === "email") return ["mail", c.email || "-"];
    if (c.channel === "meet") return ["videocam", "นัดพบ / Meet"];
    return ["call", c.phone || "-"];
  };
  const channelSub = (c: QueueDisplayContact): [string, string] => {
    if (c.channel === "phone") return ["mail", c.email || "-"];
    return ["call", c.phone || "-"];
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-space-lg px-margin py-space-xl">
      {/* Title header */}
      <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
              รายชื่อผู้ติดต่อทั้งหมด (All Contacts)
            </h1>
            <span className="font-label-md text-label-md rounded-full bg-surface-container-high px-2.5 py-0.5 text-primary">
              {contacts.length} รายชื่อ
            </span>
          </div>
          <p className="font-body-md text-body-md mt-1 text-on-surface-variant">
            จัดการ ค้นหา ติดตามสถานะ และบันทึกข้อมูลลูกค้าทั้งหมดในระบบอย่างแม่นยำ
          </p>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            className="font-title-md text-title-md flex h-10 items-center gap-2 rounded-lg bg-surface-container-lowest px-4 text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">
              file_upload
            </span>
            <span>นำเข้าข้อมูล (Import)</span>
          </button>
          <button
            type="button"
            className="font-title-md text-title-md flex h-10 items-center gap-2 rounded-lg bg-surface-container-lowest px-4 text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">
              file_download
            </span>
            <span>ส่งออก (Export)</span>
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="font-title-md text-title-md flex h-10 items-center gap-2 rounded-lg bg-primary-container px-4 text-on-primary shadow-sm transition-all hover:bg-primary"
          >
            <span className="material-symbols-outlined text-[20px]">
              person_add
            </span>
            <span>+ เพิ่มผู้ติดต่อใหม่</span>
          </button>
        </div>
      </div>

      {/* Metric Pulse Bar */}
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              ต้องติดตามวันนี้
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-tabular-stat text-tabular-stat text-primary">
                {metrics.today}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                คิวประชุม & โทร
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-primary">
            <span className="material-symbols-outlined">schedule</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              เกินกำหนดติดตาม
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-tabular-stat text-tabular-stat text-error">
                {metrics.overdue}
              </span>
              <span className="font-label-md text-label-md text-error">
                ต้องการความเร่งด่วน
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-container text-on-error-container">
            <span className="material-symbols-outlined">warning</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              กำลังคุย
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-tabular-stat text-tabular-stat text-secondary">
                {metrics.talking}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                รายการที่กำลังเจรจา
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed text-on-secondary-fixed">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              ปิดงานเดือนนี้
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-tabular-stat text-tabular-stat text-tertiary">
                {metrics.closed}
              </span>
              <span className="font-label-md text-label-md text-on-tertiary-container">
                ปิดงานสำเร็จ
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-fixed text-on-tertiary-fixed">
            <span className="material-symbols-outlined">verified</span>
          </div>
        </div>
      </div>

      {/* Filter & Control Toolbar */}
      <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="flex flex-col items-stretch justify-between gap-space-md lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[20px] text-on-surface-variant">
              search
            </span>
            <input
              className="font-body-md text-body-md h-10 w-full rounded-lg bg-surface-container-low pr-4 pl-11 text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none"
              placeholder="ค้นหาด้วยชื่อ, บริษัท, เบอร์โทร, อีเมล หรือหมายเหตุ..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center self-end rounded-lg bg-surface-container-low p-1 lg:self-center">
            <button
              type="button"
              className="font-title-md text-title-md flex items-center gap-1.5 rounded bg-surface-container-lowest px-3 py-1.5 text-primary shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                table_rows
              </span>
              <span>ตาราง</span>
            </button>
            <button
              type="button"
              className="font-title-md text-title-md flex items-center gap-1.5 rounded px-3 py-1.5 text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">
                view_kanban
              </span>
              <span>คัมบังบอร์ด</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm pt-2">
          <div className="font-label-md text-label-md mr-1 flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">
              filter_list
            </span>
            <span>ตัวกรอง:</span>
          </div>
          <FilterSelect
            ariaLabel="กรองตามสถานะ"
            value={statusF}
            onChange={(v) => setStatusF(v as StatusFilter)}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="new">รายการใหม่</option>
            <option value="talking">กำลังคุย</option>
            <option value="closed">ปิดงาน</option>
            <option value="overdue">เกินกำหนดติดตาม</option>
          </FilterSelect>
          <FilterSelect
            ariaLabel="กรองตามช่องทางติดต่อ"
            value={channelF}
            onChange={setChannelF}
          >
            <option value="all">ช่องทางติดต่อ: ทั้งหมด</option>
            <option value="phone">เบอร์โทรศัพท์ (Phone)</option>
            <option value="email">อีเมล (Email)</option>
            <option value="line">LINE Official</option>
            <option value="meet">นัดพบ (On-site / Meet)</option>
          </FilterSelect>
          <FilterSelect
            ariaLabel="กรองตามกำหนดติดตาม"
            value={dateF}
            onChange={(v) => setDateF(v as DateFilter)}
          >
            <option value="all">กำหนดติดตาม: ทั้งหมด</option>
            <option value="today">วันนี้ (Today)</option>
            <option value="week">สัปดาห์นี้ (This week)</option>
            <option value="overdue">เกินกำหนด (Overdue)</option>
            <option value="month">เดือนนี้ (This month)</option>
          </FilterSelect>
          <div className="ml-auto flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              เรียงตาม:
            </span>
            <div className="relative">
              <select
                aria-label="เรียงตาม"
                className={SELECT}
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                <option value="nearest">วันที่ติดตามใกล้สุด</option>
                <option value="name">ชื่อ ก - ฮ</option>
                <option value="company">ชื่อ บริษัท A - Z</option>
              </select>
              <span className={SELECT_ICON}>unfold_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <div
        className={`${selected.length > 0 ? "flex" : "hidden"} items-center justify-between rounded-xl bg-surface-container p-space-md text-on-surface shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <span className="font-label-sm text-label-sm flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary">
            {selected.length}
          </span>
          <span className="font-title-md text-title-md">
            รายการที่เลือกไว้ในตาราง
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            className="font-label-md text-label-md flex h-9 items-center gap-1.5 rounded-lg bg-surface-container-lowest px-3 text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>ส่งอีเมลเป็นกลุ่ม</span>
          </button>
          <button
            type="button"
            onClick={() => setDeleteIds(selected)}
            className="font-label-md text-label-md flex h-9 items-center gap-1.5 rounded-lg bg-error-container px-3 text-on-error-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              delete
            </span>
            <span>ลบที่เลือก</span>
          </button>
          <button
            type="button"
            aria-label="ยกเลิกการเลือก"
            onClick={() => setSelected([])}
            className="rounded p-1.5 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">
              close
            </span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="font-label-sm text-label-sm h-11 tracking-wider text-on-surface-variant uppercase bg-surface-container-low/70">
                <th className="w-12 px-4 py-2 text-center">
                  <input
                    className="h-4 w-4 cursor-pointer rounded accent-primary"
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="เลือกทั้งหมด"
                  />
                </th>
                <th className="px-4 py-2">ผู้ติดต่อ และ บริษัท</th>
                <th className="px-4 py-2">ช่องทางติดต่อ</th>
                <th className="px-4 py-2">สถานะ</th>
                <th className="px-4 py-2">กำหนดติดตามถัดไป</th>
                <th className="px-4 py-2">หมายเหตุล่าสุด</th>
                <th className="px-4 py-2">ผู้รับผิดชอบ</th>
                <th className="px-4 py-2 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface">
              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="font-body-md text-body-md px-4 py-10 text-center text-on-surface-variant"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((c) => {
                  const overdue = c.followUpDate < todayStr;
                  const [mainIcon, mainText] = channelMain(c);
                  const [subIcon, subText] = channelSub(c);
                  return (
                    <tr
                      key={c.id}
                      className={
                        overdue
                          ? "group bg-error-container/10 transition-colors hover:bg-error-container/20"
                          : "group transition-colors hover:bg-surface-container-low/40"
                      }
                    >
                      <td className="px-4 py-3.5 text-center">
                        <input
                          className="h-4 w-4 cursor-pointer rounded accent-primary"
                          type="checkbox"
                          checked={selected.includes(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          aria-label={`เลือก ${c.name}`}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`font-headline-sm text-headline-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${c.avatarBg}`}
                          >
                            {c.avatarInitials}
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="font-title-md text-title-md truncate font-bold text-on-surface">
                              {c.name}
                            </span>
                            <span className="font-label-md text-label-md truncate text-on-surface-variant">
                              {c.role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <div className="font-body-sm text-body-sm flex items-center gap-1.5 text-on-surface">
                            <span className="material-symbols-outlined text-[15px] text-primary">
                              {mainIcon}
                            </span>
                            <span className="max-w-[150px] truncate">
                              {mainText}
                            </span>
                          </div>
                          <div className="font-label-sm text-label-sm flex items-center gap-1.5 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[15px]">
                              {subIcon}
                            </span>
                            <span className="max-w-[150px] truncate">
                              {subText}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`font-label-sm text-label-sm inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${c.pill}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${c.dot}`}
                          ></span>
                          <span>{c.topic}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <div
                            className={`font-title-md text-title-md flex items-center gap-1.5 ${c.dateTextClass ?? "text-on-surface"}`}
                          >
                            <span
                              className={`material-symbols-outlined text-[16px] ${c.dateIconClass}`}
                            >
                              {c.dateIcon}
                            </span>
                            <span>{c.dateText}</span>
                          </div>
                          <span
                            className={`font-label-sm text-label-sm mt-0.5 inline-block w-max rounded px-1.5 py-0.5 ${c.dateLabelClass}`}
                          >
                            {c.dateLabel}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-[220px] px-4 py-3.5">
                        <p
                          className="font-body-sm text-body-sm truncate text-on-surface"
                          title={c.note}
                        >
                          {c.note || "-"}
                        </p>
                        <span
                          className={`font-label-sm text-label-sm ${c.noteMetaError ? "text-error" : "text-outline"}`}
                        >
                          {c.noteMeta}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="font-label-sm text-label-sm flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed font-bold text-on-secondary-fixed">
                            {ownerInitial}
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            {ownerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title={c.quickActionTitle}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              overdue
                                ? "text-error hover:bg-error-container"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {c.quickActionIcon}
                            </span>
                          </button>
                          <button
                            type="button"
                            title="แก้ไข"
                            onClick={() => openEdit(c)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              title="เพิ่มเติม"
                              onClick={() =>
                                setMenuId(menuId === c.id ? null : c.id)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                more_vert
                              </span>
                            </button>
                            {menuId === c.id && (
                              <div className="absolute right-0 z-30 w-44 rounded-xl bg-surface-container-lowest py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDetails(c);
                                    setMenuId(null);
                                  }}
                                  className="font-body-md text-body-md flex w-full items-center gap-2 px-3 py-2 text-left text-on-surface hover:bg-surface-container-low"
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    visibility
                                  </span>
                                  ดูรายละเอียด
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteIds([c.id])}
                                  className="font-body-md text-body-md flex w-full items-center gap-2 px-3 py-2 text-left text-error hover:bg-error-container/30"
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    delete
                                  </span>
                                  ลบ
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {!loading && !loadError && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="font-body-md text-body-md px-4 py-10 text-center text-on-surface-variant"
                  >
                    {contacts.length === 0
                      ? "ยังไม่มีผู้ติดต่อ กด + เพิ่มผู้ติดต่อใหม่ เพื่อเริ่มใช้งาน"
                      : "ไม่พบผู้ติดต่อที่ตรงกับเงื่อนไข"}
                  </td>
                </tr>
              )}
              {loadError && (
                <tr>
                  <td
                    colSpan={8}
                    className="font-body-md text-body-md px-4 py-10 text-center text-error"
                  >
                    {loadError}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 bg-surface-container-lowest px-space-md py-space-sm sm:flex-row">
          <div className="font-body-sm text-body-sm flex items-center gap-2 text-on-surface-variant">
            <span>
              แสดง{" "}
              <strong className="font-semibold text-on-surface">
                1 - {filtered.length}
              </strong>{" "}
              จากทั้งหมด{" "}
              <strong className="font-semibold text-on-surface">
                {contacts.length}
              </strong>{" "}
              รายชื่อ
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-outline-variant"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              className="font-label-md text-label-md flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary"
            >
              1
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {formOpen && (
        <ContactFormModal
          title={formTitle}
          initial={formInitial}
          serverError={formError}
          onClose={() => {
            if (saving) return;
            setFormOpen(false);
            setEditingId(null);
          }}
          onSave={saveForm}
        />
      )}
      {details && (
        <ContactDetailsModal
          contact={details}
          onClose={() => setDetails(null)}
          onEdit={() => openEdit(details)}
        />
      )}
      {deleteIds && (
        <DeleteConfirmModal
          count={deleteIds.length}
          onClose={() => setDeleteIds(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
