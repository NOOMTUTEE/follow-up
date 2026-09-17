export type QueueSlot = "morning" | "afternoon" | "overdue";

export interface QueueChannel {
  icon: string;
  iconClass: string;
  text: string;
  strong?: boolean;
}

export interface QueueButton {
  label: string;
  icon: string;
}

export interface QueueItem {
  id: string;
  name: string;
  company: string;
  topic: string;
  topicPill: string;
  bar: string;
  avatar?: string;
  avatarAlt?: string;
  initials?: string;
  initialsClass?: string;
  channels: QueueChannel[];
  timeIcon: string;
  time: string;
  badge: string;
  noteIcon: string;
  noteIconClass: string;
  note: string;
  actions: QueueButton[];
  doneAction: QueueButton & { gray?: boolean };
  slot: QueueSlot;
}

export interface StatusSlice {
  label: string;
  count: number;
  percent: number;
  barClass: string;
  dotClass: string;
}

export interface ActivityItem {
  icon: string;
  iconBg: string;
  lead: string;
  rest: string;
  time: string;
}

export const queueItems: QueueItem[] = [
  {
    id: "q1",
    name: "วราพร พัฒนพงศ์",
    company: "บริษัท เทควิชั่น จำกัด",
    topic: "รอตอบรับใบเสนอราคา",
    topicPill: "text-on-error-container bg-error-container",
    bar: "bg-error",
    avatar: "/images/portrait-woman.png",
    avatarAlt: "วราพร พัฒนพงศ์",
    channels: [
      { icon: "call", iconClass: "text-primary", text: "081-234-5678" },
      {
        icon: "mail",
        iconClass: "text-secondary",
        text: "waraporn@techvision.co",
      },
    ],
    timeIcon: "alarm",
    time: "10:30 น. (วันนี้)",
    badge: "ด่วนพิเศษ",
    noteIcon: "sticky_note_2",
    noteIconClass: "text-primary",
    note: "ลูกค้าขอส่วนลด 5% หากเซ็นสัญญาภายในเดือนนี้ โทรคอนเฟิร์มเงื่อนไขและสรุปสัญญาสุดท้าย",
    actions: [
      { label: "โทรออก", icon: "call" },
      { label: "ส่งอีเมล", icon: "mail" },
      { label: "เลื่อนนัด", icon: "edit_calendar" },
    ],
    doneAction: { label: "ทำเครื่องหมายว่าเสร็จสิ้น", icon: "check_circle" },
    slot: "morning",
  },
  {
    id: "q2",
    name: "สุทธิดา เจริญพร",
    company: "ลีดจากแบบฟอร์มเว็บไซต์",
    topic: "ติดต่อกลับลีดใหม่",
    topicPill: "text-on-primary-fixed-variant bg-primary-fixed",
    bar: "bg-error",
    initials: "สธ",
    initialsClass: "bg-primary-fixed text-on-primary-fixed",
    channels: [
      { icon: "call", iconClass: "text-primary", text: "089-111-2233" },
      { icon: "mail", iconClass: "text-secondary", text: "suttida@example.com" },
    ],
    timeIcon: "alarm",
    time: "09:00 น. (วันนี้)",
    badge: "เกินกำหนด",
    noteIcon: "sticky_note_2",
    noteIconClass: "text-primary",
    note: "ลีดใหม่จากแบบฟอร์มเว็บไซต์ ยังไม่เคยติดต่อ ควรโทรแนะนำตัวก่อนเที่ยง",
    actions: [
      { label: "โทรออก", icon: "call" },
      { label: "ส่งอีเมล", icon: "mail" },
    ],
    doneAction: { label: "ทำเครื่องหมายว่าเสร็จสิ้น", icon: "check_circle" },
    slot: "overdue",
  },
  {
    id: "q3",
    name: "นภดล สุวรรณเวช",
    company: "ดีพเวลลอปเมนท์ กรุ๊ป",
    topic: "นัดสาธิตระบบ (Demo)",
    topicPill: "text-on-secondary-container bg-secondary-fixed",
    bar: "bg-secondary",
    avatar: "/images/portrait-man.png",
    avatarAlt: "นภดล สุวรรณเวช",
    channels: [
      {
        icon: "chat",
        iconClass: "text-tertiary",
        text: "LINE Official (@nop_deepdev)",
      },
    ],
    timeIcon: "schedule",
    time: "13:45 น. (วันนี้)",
    badge: "บ่ายวันนี้",
    noteIcon: "swipe_vertical",
    noteIconClass: "text-secondary",
    note: "เตรียมสไลด์ฟีเจอร์ Multi-user & API integration สำหรับทีม dev และฝ่ายความปลอดภัย",
    actions: [
      { label: "เปิดแชท LINE", icon: "forum" },
      { label: "ลิงก์ห้องพรีเซนต์", icon: "video_call" },
    ],
    doneAction: { label: "เสร็จสิ้น", icon: "check_circle" },
    slot: "afternoon",
  },
  {
    id: "q4",
    name: "ชิดชนก นิมิตรชัย",
    company: "บจก. สยามอินโนเวชั่น",
    topic: "เจรจาต่อรอง",
    topicPill: "text-on-primary-fixed-variant bg-primary-fixed",
    bar: "bg-primary-container",
    initials: "ชน",
    initialsClass: "bg-primary-fixed text-on-primary-fixed",
    channels: [
      {
        icon: "video_camera_front",
        iconClass: "text-primary",
        text: "Google Meet",
      },
    ],
    timeIcon: "event_available",
    time: "15:00 น. (วันนี้)",
    badge: "การประชุมหลัก",
    noteIcon: "gavel",
    noteIconClass: "text-primary",
    note: "ตรวจทานสัญญาฉบับร่างร่วมกับฝ่ายกฎหมายของลูกค้า ข้อกังวลเรื่อง SLA และ Support Window",
    actions: [
      { label: "เข้าห้องประชุม", icon: "meet" },
      { label: "บันทึกสรุป", icon: "note_add" },
    ],
    doneAction: { label: "เลื่อนเวลา", icon: "pending", gray: true },
    slot: "afternoon",
  },
  {
    id: "q5",
    name: "ธนกฤต อัครเดช",
    company: "พีคโลจิสติกส์",
    topic: "แนะนำตัวเบื้องต้น",
    topicPill: "text-on-tertiary-fixed-variant bg-tertiary-fixed",
    bar: "bg-tertiary-fixed-dim",
    initials: "ธก",
    initialsClass: "bg-secondary-fixed text-on-secondary-fixed",
    channels: [
      {
        icon: "message",
        iconClass: "text-tertiary",
        text: "WhatsApp (+66 89 765 4321)",
      },
    ],
    timeIcon: "schedule",
    time: "16:30 น. (วันนี้)",
    badge: "ลีดใหม่",
    noteIcon: "inventory_2",
    noteIconClass: "text-on-surface-variant",
    note: "ติดตามเรื่องความต้องการระบบจัดการคลังสินค้าระยะที่ 2 พร้อมส่งโบรชัวร์ฟีเจอร์ Barcode Scanner",
    actions: [
      { label: "เปิด WhatsApp", icon: "send" },
      { label: "ส่งโบรชัวร์", icon: "description" },
    ],
    doneAction: { label: "เสร็จสิ้น", icon: "check_circle" },
    slot: "afternoon",
  },
  {
    id: "q6",
    name: "อรอนงค์ ศรีสุข",
    company: "บจก. ไทยฟู้ดส์",
    topic: "ส่งใบเสนอราคา V.2",
    topicPill: "text-on-secondary-container bg-secondary-fixed",
    bar: "bg-secondary",
    initials: "อร",
    initialsClass: "bg-secondary-fixed text-on-secondary-fixed",
    channels: [
      {
        icon: "mail",
        iconClass: "text-secondary",
        text: "oronong@thaifoods.co",
      },
    ],
    timeIcon: "schedule",
    time: "11:30 น. (วันนี้)",
    badge: "ช่วงเช้า",
    noteIcon: "sticky_note_2",
    noteIconClass: "text-secondary",
    note: "ลูกค้าขอปรับเงื่อนไขการชำระเงินเป็น 30 วัน ส่งใบเสนอราคา V.2 ให้ก่อนเที่ยง",
    actions: [
      { label: "ส่งอีเมล", icon: "mail" },
      { label: "โทรออก", icon: "call" },
    ],
    doneAction: { label: "เสร็จสิ้น", icon: "check_circle" },
    slot: "morning",
  },
];

export const statusDistribution: StatusSlice[] = [
  {
    label: "รอลีดใหม่ (New Lead)",
    count: 21,
    percent: 14,
    barClass: "bg-secondary-container",
    dotClass: "bg-secondary-container",
  },
  {
    label: "กำลังประสานงาน (In Progress)",
    count: 42,
    percent: 28,
    barClass: "bg-secondary",
    dotClass: "bg-secondary",
  },
  {
    label: "รอการตัดสินใจ (Pending Decision)",
    count: 20,
    percent: 14,
    barClass: "bg-primary-container",
    dotClass: "bg-primary-container",
  },
  {
    label: "ปิดการขายแล้ว (Closed Won)",
    count: 65,
    percent: 44,
    barClass: "bg-tertiary-container",
    dotClass: "bg-tertiary-container",
  },
];

export const activities: ActivityItem[] = [
  {
    icon: "event_available",
    iconBg: "bg-tertiary-fixed text-on-tertiary-fixed",
    lead: "ธนกฤต",
    rest: "ตอบรับนัดหมายวันที่ 25 ต.ค.",
    time: "15 นาทีที่แล้ว",
  },
  {
    icon: "mark_email_read",
    iconBg: "bg-secondary-fixed text-on-secondary-fixed",
    lead: "วราพร",
    rest: "เปิดอ่านอีเมลใบเสนอราคา V.2",
    time: "1 ชั่วโมงที่แล้ว",
  },
  {
    icon: "person_add",
    iconBg: "bg-surface-container-highest text-primary",
    lead: "สุทธิดา เจริญพร",
    rest: "เพิ่มผู้ติดต่อใหม่ จากแบบฟอร์มเว็บไซต์",
    time: "3 ชั่วโมงที่แล้ว",
  },
];
