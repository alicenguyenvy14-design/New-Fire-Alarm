import { ActivityIcon, AlertIcon, BellIcon, CameraIcon, FlameIcon, SettingsIcon, ThermometerIcon } from "./Icons";

const menuItems = [
  { id: "overview", label: "Tổng quan", icon: ActivityIcon, description: "Trạng thái hệ thống" },
  { id: "sensors", label: "Cảm biến", icon: ThermometerIcon, description: "Nhiệt độ, khói và lửa" },
  { id: "alerts", label: "Cảnh báo", icon: AlertIcon, description: "Báo động và chấp hành" },
  { id: "history", label: "Lịch sử", icon: BellIcon, description: "Sự kiện gần nhất" },
  { id: "camera", label: "Camera AI", icon: CameraIcon, description: "Giám sát hình ảnh" },
  { id: "settings", label: "Cài đặt", icon: SettingsIcon, description: "Kết nối và hệ thống" },
];

export function DashboardSidebar({ styles, activeSection, onSectionChange }) {
  return <aside className={`${styles.panel} ${styles.side} app-sidebar rounded-none self-start lg:-mt-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto`}>
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-red-100 p-3 text-red-600"><FlameIcon className="w-6 h-6" /></div>
      <div><h1 className="text-lg font-bold text-slate-900">Fire Dashboard</h1><p className="text-sm text-slate-500">Hệ thống báo cháy thông minh</p></div>
    </div>
    <div className="my-5 h-px bg-slate-200" />
    <nav className="space-y-2" aria-label="Điều hướng dashboard">
      {menuItems.map(({ id, label, icon, description }) => {
        const isActive = activeSection === id;
        return <button key={id} type="button" onClick={() => onSectionChange(id)} aria-current={isActive ? "page" : undefined} title={description} className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${isActive ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"}`}>
          <span className={`rounded-xl p-2 transition-transform duration-200 ${isActive ? "bg-white/15" : "bg-slate-100 group-hover:scale-110 group-hover:bg-white"}`}>{icon({ className: "h-4 w-4" })}</span>
          <span className="min-w-0"><span className="block font-semibold">{label}</span><span className={`mt-0.5 block truncate text-xs ${isActive ? "text-slate-300" : "text-slate-400"}`}>{description}</span></span>
        </button>;
      })}
    </nav>
  </aside>;
}
