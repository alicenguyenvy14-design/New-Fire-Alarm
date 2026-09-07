import { AlertIcon, CameraIcon, ShieldIcon } from "./Icons";
import { Badge } from "./Ui";

export function CameraAiPanel({ styles }) {
  return <div className="space-y-6">
    <section className={`${styles.panel} p-3`}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-medium text-slate-700">Khu vực giám sát</span>
        <span className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-600">1 luồng hiển thị</span>
        <Badge tone="safe" className="px-3 py-2">TRỰC TIẾP</Badge>
        <Badge className="px-3 py-2">DEMO</Badge>
        <span className="ml-auto hidden text-xs text-slate-500 md:inline">Camera chưa được cấu hình</span>
      </div>
    </section>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
      <section className={`${styles.panel} ${styles.section}`}>
        <div className="flex items-start justify-between gap-4"><div><h3 className="text-base font-semibold">Giám sát camera</h3><p className="mt-1 text-sm text-slate-500">Luồng hình ảnh cho khu vực đang giám sát.</p></div><Badge>0/1 ONLINE</Badge></div>
        <article className="relative mt-5 aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1220] p-4 text-slate-200">
          <div className="flex items-center justify-between gap-2"><span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">Khu vực giám sát</span><span className="h-2 w-2 rounded-full bg-slate-500" title="Chưa kết nối" /></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"><div className="rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-300"><CameraIcon className="h-7 w-7" /></div><p className="mt-3 text-sm font-semibold text-white">Chưa có luồng hình ảnh</p><p className="mt-1 text-xs text-slate-400">Đang chờ kết nối camera của khu vực</p></div>
          <span className="absolute bottom-3 left-4 text-xs text-slate-500">Đang chờ kết nối camera</span>
        </article>
      </section>

      <section className={`${styles.panel} ${styles.section} flex min-h-[420px] flex-col`}>
        <div className="flex items-center gap-3"><div className="rounded-xl bg-slate-100 p-2 text-slate-700"><AlertIcon className="h-5 w-5" /></div><div><h3 className="text-base font-semibold">Lịch sử hệ thống</h3><p className="text-sm text-slate-500">Sự kiện từ Camera AI</p></div></div>
        <div className="flex flex-1 flex-col items-center justify-center text-center"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-500"><ShieldIcon className="h-8 w-8" /></div><p className="mt-4 font-medium text-slate-900">Chưa có hoạt động ghi nhận</p><p className="mt-2 max-w-xs text-sm text-slate-500">Kết quả phát hiện khói, lửa hoặc các sự kiện từ camera sẽ được ghi tại đây.</p></div>
      </section>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <section className={`${styles.panel} p-4`}><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái hệ thống</p><p className="mt-2 text-lg font-bold text-emerald-700">Sẵn sàng tích hợp</p><p className="mt-1 text-sm text-slate-500">Chưa có stream camera</p></section>
      <section className={`${styles.panel} p-4`}><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI phát hiện</p><p className="mt-2 text-lg font-bold text-slate-900">0 sự kiện</p><p className="mt-1 text-sm text-slate-500">Mô hình chưa cấu hình</p></section>
      <section className={`${styles.panel} p-4`}><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cảnh báo camera</p><p className="mt-2 text-lg font-bold text-slate-900">Không có cảnh báo</p><p className="mt-1 text-sm text-slate-500">Sẽ đồng bộ vào mục Cảnh báo</p></section>
    </div>
  </div>;
}
