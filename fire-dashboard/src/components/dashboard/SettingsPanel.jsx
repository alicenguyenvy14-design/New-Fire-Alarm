import { Badge, Toggle } from "./Ui";

export function SettingsPanel({ styles, online, lastUpdate, modeAuto, onModeAutoChange, sourceMode, wsState, wsUrl, testsPassed }) {
  const sourceBadgeTone = sourceMode === "live" ? (wsState === "connected" ? "safe" : wsState === "connecting" ? "caution" : "neutral") : "neutral";

  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <section className={`${styles.panel} ${styles.section}`}><div className="flex items-center justify-between"><p className="text-sm font-medium">Kết nối thiết bị</p><Badge tone={online ? "safe" : "neutral"}>{online ? "Online" : "Offline"}</Badge></div><p className="mt-3 text-sm text-slate-500">Cập nhật cuối: {lastUpdate}</p></section>
    <section className={`${styles.panel} ${styles.section}`}><div className="flex items-center justify-between"><p className="text-sm font-medium">Chế độ tự động</p><Toggle checked={modeAuto} onChange={onModeAutoChange} /></div><p className="mt-3 text-sm text-slate-500">{modeAuto ? "Hệ thống tự xử lý cảnh báo" : "Điều khiển thủ công"}</p></section>
    <section className={`${styles.panel} ${styles.section}`}><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">Nguồn dữ liệu</p><Badge tone={sourceBadgeTone}>{sourceMode === "live" ? wsState.toUpperCase() : "SIM"}</Badge></div><p className="mt-3 break-all text-sm text-slate-500">{sourceMode === "live" ? wsUrl : "Đang dùng dữ liệu mô phỏng"}</p></section>
    <section className={`${styles.panel} ${styles.section}`}><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">Kiểm tra logic</p><Badge tone={testsPassed ? "safe" : "danger"}>{testsPassed ? "PASS" : "FAIL"}</Badge></div><p className="mt-3 text-sm text-slate-500">12 self-check cho phân loại cảnh báo và parser telemetry</p></section>
  </div>;
}
