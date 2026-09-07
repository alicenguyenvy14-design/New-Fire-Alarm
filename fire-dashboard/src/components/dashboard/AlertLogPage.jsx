import { useState } from "react";
import { AlertIcon, BellIcon, CameraIcon, SettingsIcon, WifiIcon } from "./Icons";
import { Badge, Button } from "./Ui";

const eventTypes = [
  { value: "all", label: "Tất cả sự kiện" },
  { value: "ALERT", label: "Cảnh báo" },
  { value: "ACTION", label: "Thao tác" },
  { value: "NETWORK", label: "Kết nối mạng" },
  { value: "SYSTEM", label: "Hệ thống" },
];

const typeMeta = {
  ALERT: { label: "Cảnh báo", tone: "danger", status: "Cần xem xét", statusTone: "warning" },
  ACTION: { label: "Thao tác", tone: "neutral", status: "Đã ghi nhận", statusTone: "safe" },
  NETWORK: { label: "Mạng", tone: "caution", status: "Đã ghi nhận", statusTone: "safe" },
  SYSTEM: { label: "Hệ thống", tone: "safe", status: "Hoàn tất", statusTone: "safe" },
};

function StatItem({ title, value, description, icon: Icon, tone = "slate" }) {
  const iconClass = tone === "danger" ? "bg-red-100 text-red-600" : tone === "warning" ? "bg-amber-50 text-amber-700" : tone === "safe" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700";
  return <section className="dashboard-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-sm text-slate-500">{description}</p></div><div className={`rounded-xl p-2.5 ${iconClass}`}>{Icon({ className: "h-5 w-5" })}</div></div></section>;
}

function EventDetailModal({ item, onClose }) {
  const meta = typeMeta[item.type] || typeMeta.SYSTEM;
  const title = item.type === "ALERT" ? "Cảnh báo cháy" : `Chi tiết ${meta.label.toLowerCase()}`;

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="presentation">
    <section role="dialog" aria-modal="true" aria-labelledby="event-detail-title" className="dashboard-panel w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4"><div><h3 id="event-detail-title" className="text-lg font-bold text-slate-900">{title}</h3><p className="mt-1 text-sm text-slate-500">Thời gian ghi nhận: {item.time}</p></div><button type="button" onClick={onClose} aria-label="Đóng chi tiết sự kiện" className="rounded-lg px-3 py-1 text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">X</button></header>
      <div className="space-y-5 p-5">
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">Chưa có video ghi hình cho sự kiện này</div>
        <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hình ảnh chụp phát hiện</p><div className="mt-2 flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-700"><CameraIcon className="h-7 w-7" /></div><p className="mt-3 font-medium text-slate-900">Chưa có ảnh chụp</p><p className="mt-1 text-sm text-slate-500">Camera AI chưa gửi ảnh cho sự kiện này.</p></div></div>
        <dl className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">Loại sự kiện</dt><dd className="mt-1"><Badge tone={meta.tone}>{meta.label}</Badge></dd></div><div><dt className="text-slate-500">Trạng thái</dt><dd className="mt-1"><Badge tone={meta.statusTone}>{meta.status}</Badge></dd></div><div className="sm:col-span-2"><dt className="text-slate-500">Nội dung</dt><dd className="mt-1 font-medium text-slate-800">{item.detail}</dd></div></dl>
      </div>
      <footer className="grid grid-cols-1 gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"><Button variant="outline" disabled>Cập nhật trạng thái</Button><Button onClick={onClose}>Đóng</Button></footer>
    </section>
  </div>;
}

export function AlertLogPage({ styles, history }) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const filteredHistory = selectedType === "all" ? history : history.filter((item) => item.type === selectedType);
  const alertCount = history.filter((item) => item.type === "ALERT").length;
  const actionCount = history.filter((item) => item.type === "ACTION").length;
  const networkCount = history.filter((item) => item.type === "NETWORK").length;

  return <div className="space-y-6">
    <section className={`${styles.panel} ${styles.section}`}><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-slate-500">Theo dõi toàn bộ sự kiện trong phiên dashboard hiện tại</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Nhật ký cảnh báo cháy</h2></div><Badge>{history.length} SỰ KIỆN</Badge></div></section>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatItem title="Tổng sự kiện" value={history.length} description="Trong phiên hiện tại" icon={BellIcon} />
      <StatItem title="Cảnh báo" value={alertCount} description="Cần theo dõi" icon={AlertIcon} tone="danger" />
      <StatItem title="Thao tác" value={actionCount} description="Từ người dùng" icon={SettingsIcon} tone="safe" />
      <StatItem title="Kết nối" value={networkCount} description="Sự kiện mạng" icon={WifiIcon} tone="warning" />
    </div>

    <section className={`${styles.panel} ${styles.section}`}>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="history-type">Lọc loại sự kiện</label>
          <select id="history-type" value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className={styles.input} style={{ width: "220px" }}>
            {eventTypes.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <Button variant="outline" onClick={() => setSelectedType("all")}>Xóa bộ lọc</Button>
        </div>
        <p className="text-sm text-slate-500">Hiển thị {filteredHistory.length} / {history.length} sự kiện</p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-[780px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">STT</th><th className="px-4 py-3">Thời gian</th><th className="px-4 py-3">Loại sự kiện</th><th className="px-4 py-3">Nội dung</th><th className="px-4 py-3">Trạng thái</th></tr></thead>
          <tbody>{filteredHistory.length > 0 ? filteredHistory.map((item, index) => {
            const meta = typeMeta[item.type] || typeMeta.SYSTEM;
            return <tr key={`${item.time}-${index}`} onClick={() => setSelectedEvent(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedEvent(item); }} tabIndex="0" role="button" className="cursor-pointer border-t border-slate-200 bg-white transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-900"><td className="px-4 py-4 font-medium text-slate-600">{index + 1}</td><td className="px-4 py-4 text-slate-600">{item.time}</td><td className="px-4 py-4"><Badge tone={meta.tone}>{meta.label}</Badge></td><td className="max-w-xl px-4 py-4 text-slate-800">{item.detail}</td><td className="px-4 py-4"><Badge tone={meta.statusTone}>{meta.status}</Badge></td></tr>;
          }) : <tr><td colSpan="5" className="px-4 py-12 text-center text-slate-500">Không có sự kiện phù hợp với bộ lọc.</td></tr>}</tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">Lịch sử hiện được lưu trong bộ nhớ của trình duyệt và sẽ mất khi tải lại trang.</p>
    </section>
    {selectedEvent ? <EventDetailModal item={selectedEvent} onClose={() => setSelectedEvent(null)} /> : null}
  </div>;
}
