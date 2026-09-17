# Follow-up Board

Web App  สำหรับจัดการรายชื่อผู้ติดต่อ สถานะ และวันติดตาม

## Tech Stack
- Next.js
- Typescript
- prisma ใช้ PG Adaptor ด้วย ใช้ Clientด้วย
- Supabase PostgreSQL
- Better Auth
- vitest ใช้ ui ด้วย

## Setup Roles
- ใช้ Package เวอร์ชั่น Stable  ล่าสุด
- ห้ามใช้ Beta, Camary  หรือ Exprimental vesion
- หากจำเป็นต้องเพิ่ม Package ให้ตครวจสอบความเข้ากันได้กับ Next.js

## Working Rules
-  ทำเฉพาะงานที่ได้รับคำสั่งในแต่ละครั้ง
- ห้ามเพิ่ม Feature, Logic หรือ UI ที่ไม่ได้ระบุ
- ห้ามแก้ไขส่วนที่ไม่เกี่ยวข้องกับงานเดิมที่มีอยู่
- หากข้อมูลไม่พอหรือจำเป็นต้องขยายขอบเขตให้ถามก่อนทำ
- ไม่ต้อง npm run build จะทดสอบเอง

## Access
- จะเข้าดูข้อหน้าภายในได้ ต้องเป็น user ที่ล็อคอินอยู่
- ผู้ใช้ที่ดู เพิ่ม แก้ไข และลบด้เฉพาะข้อมูลของ contact ตัวเอง