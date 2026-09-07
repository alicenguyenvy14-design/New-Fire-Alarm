import { AlertIcon, BellIcon, FlameIcon, LightIcon } from "./Icons";
import { Badge } from "./Ui";

export function AlertSummary({ styles, systemStatus, flameDetected, manualEmergency, buzzer, warningLight }) {
  const flameActive = flameDetected || manualEmergency;
  const items = [
    { label: "Mức cảnh báo", value: systemStatus.label, icon: AlertIcon, tone: systemStatus.tone },
    { label: "Phát hiện lửa", value: flameActive ? "ĐÃ PHÁT HIỆN" : "CHƯA PHÁT HIỆN", icon: FlameIcon, tone: flameActive ? "danger" : "safe" },
    { label: "Còi cảnh báo", value: buzzer ? "ĐANG BẬT" : "ĐANG TẮT", icon: BellIcon, tone: buzzer ? "warning" : "neutral" },
    { label: "Đèn cảnh báo", value: warningLight ? "ĐANG BẬT" : "ĐANG TẮT", icon: LightIcon, tone: warningLight ? "warning" : "neutral" },
  ];

  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map(({ label, value, icon, tone }) => <div key={label} className={`${styles.panel} p-5`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-sm font-bold text-slate-900">{value}</p></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">{icon({ className: "h-5 w-5" })}</div></div><Badge tone={tone} className="mt-4">{tone.toUpperCase()}</Badge></div>)}</div>;
}
