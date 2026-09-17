import QueueList from "@/components/QueueList";
import QuickNote from "@/components/QuickNote";
import { activities, statusDistribution } from "@/lib/mock-data";

export const metadata = {
  title: "Dashboard | Follow-up Board",
};

export default function DashboardPage() {
  return (
    <main className="w-full bg-background pt-16">
      <div className="flex w-full flex-col space-y-space-lg px-space-lg py-space-lg">
        {/* Top Level Header Bar */}
        <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
          <div>
            <div className="font-label-md text-label-md mb-1 flex items-center gap-space-xs uppercase tracking-wider text-on-surface-variant">
              <span>ภาพรวมระบบ CRM</span>
              <span className="text-outline-variant">•</span>
              <span>24 ตุลาคม 2024</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
              แดชบอร์ดภาพรวมการติดตาม
            </h1>
            <p className="font-body-md text-body-md mt-0.5 text-on-surface-variant">
              สรุปสถานะผู้ติดต่อและงานที่ต้องติดตามผลประจำวันนี้ 24 ตุลาคม 2024
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button className="font-title-md text-title-md flex h-10 items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md text-on-surface shadow-sm transition-all hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-body-lg text-on-surface-variant">
                file_download
              </span>
              <span>ส่งออกรายงาน</span>
            </button>
            <button className="font-title-md text-title-md flex h-10 items-center gap-space-xs rounded-lg bg-primary-container px-space-md text-on-primary shadow-sm transition-all hover:bg-primary">
              <span className="material-symbols-outlined text-body-lg">
                person_add
              </span>
              <span>+ เพิ่มผู้ติดต่อ</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Grid (4 Cards) */}
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Contacts */}
          <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface-variant">
                ผู้ติดต่อทั้งหมด
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-low text-primary">
                <span className="material-symbols-outlined text-headline-sm">
                  groups
                </span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-tabular-stat text-tabular-stat text-on-surface">
                  148
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  คน
                </span>
              </div>
              <div className="mt-space-xs flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm inline-flex items-center rounded-full bg-tertiary-fixed/30 px-1.5 py-0.5 text-tertiary">
                  <span className="material-symbols-outlined text-label-sm mr-0.5">
                    trending_up
                  </span>
                  +12%
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  เทียบจากเดือนที่แล้ว
                </span>
              </div>
            </div>
          </div>

          {/* Follow-up Today */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-error"></div>
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface-variant">
                ต้องติดตามวันนี้
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error-container/40 text-error">
                <span className="material-symbols-outlined text-headline-sm">
                  notification_important
                </span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-tabular-stat text-tabular-stat text-error">
                  8
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  คน
                </span>
              </div>
              <div className="mt-space-xs flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm inline-flex items-center rounded-full bg-error-container px-2 py-0.5 text-on-error-container">
                  เร่งด่วน 3 รายการ
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  ช่วงเช้า 5 คิว
                </span>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface-variant">
                กำลังติดต่อ / รอตอบกลับ
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-low text-secondary">
                <span className="material-symbols-outlined text-headline-sm">
                  pending_actions
                </span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-tabular-stat text-tabular-stat text-on-surface">
                  42
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  คน
                </span>
              </div>
              <div className="mt-space-xs flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm inline-flex items-center rounded-full bg-secondary-fixed px-2 py-0.5 text-on-secondary-container">
                  รอเจรจา 14 คิว
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  เฉลี่ยรอ 2 วัน
                </span>
              </div>
            </div>
          </div>

          {/* Closed / Won */}
          <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface-variant">
                ปิดการขายสำเร็จ
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-low text-tertiary">
                <span className="material-symbols-outlined text-headline-sm">
                  verified
                </span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-tabular-stat text-tabular-stat text-on-surface">
                  65
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  คน
                </span>
              </div>
              <div className="mt-space-xs flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm inline-flex items-center rounded-full bg-tertiary-fixed/40 px-2 py-0.5 text-tertiary">
                  +8 สัปดาห์นี้
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  มูลค่า ฿2.4M
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout (65% Left / 35% Right) */}
        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
          {/* Left Column: Queue & Follow-up Action Stream */}
          <div className="flex flex-col space-y-space-md lg:col-span-8">
            <QueueList />
          </div>

          {/* Right Column: Status Breakdown, Recent Activity & Quick Note */}
          <div className="flex flex-col space-y-space-md lg:col-span-4">
            {/* 1. Status Breakdown Card */}
            <div className="flex flex-col rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary">
                    pie_chart
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    การกระจายตัวตามสถานะ
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  148 รายการ
                </span>
              </div>
              <div className="bg-surface-container-high my-space-sm flex h-3 w-full overflow-hidden rounded-full">
                {statusDistribution.map((s) => (
                  <div
                    key={s.label}
                    className={`h-full ${s.barClass}`}
                    style={{ width: `${s.percent}%` }}
                    title={`${s.label} (${s.percent}%)`}
                  ></div>
                ))}
              </div>
              <div className="space-y-space-sm pt-space-xs">
                {statusDistribution.map((s) => (
                  <div
                    key={s.label}
                    className="text-body-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${s.dotClass}`}
                      ></span>
                      <span className="text-on-surface">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-on-surface">
                        {s.count} คน
                      </span>
                      <span className="font-label-sm w-10 text-right text-outline">
                        {s.percent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Recent Activity Feed Card */}
            <div className="flex flex-col rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary">
                    history
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    กิจกรรมล่าสุด
                  </h3>
                </div>
                <button className="font-label-md text-label-md text-primary hover:underline">
                  ดูทั้งหมด
                </button>
              </div>
              <div className="relative space-y-space-md pt-space-xs">
                <div className="bg-surface-container-high absolute top-3 bottom-3 left-3 z-0 w-0.5"></div>
                {activities.map((a) => (
                  <div
                    key={`${a.lead}-${a.time}`}
                    className="relative z-10 flex items-start gap-space-sm"
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${a.iconBg}`}
                    >
                      <span className="material-symbols-outlined text-label-md">
                        {a.icon}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="font-title-md text-body-sm text-on-surface">
                        <strong>{a.lead}</strong> {a.rest}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        {a.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Quick Note Widget */}
            <QuickNote />
          </div>
        </div>
      </div>
    </main>
  );
}
