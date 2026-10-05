import { AdminSahifa } from "./_components/AdminSahifa";
import { StatKarta } from "./_components/StatKarta";

/** A1 yuklanmoqda holati — skelet raqamlar (admin-tz.md), sahifa tuzilishi sakramaydi. */
export default function BoshqaruvYuklanmoqda() {
  return (
    <AdminSahifa sarlavha="Boshqaruv paneli">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatKarta nomi="Bugungi yangi foydalanuvchilar" belgi="user-plus" yuklanmoqda />
        <StatKarta nomi="Kunlik faol" belgi="activity" yuklanmoqda />
        <StatKarta nomi="Bugungi skanlar" belgi="scan-line" yuklanmoqda />
        <StatKarta nomi="Faol PRO obunalar" belgi="crown" yuklanmoqda />
      </div>
    </AdminSahifa>
  );
}
