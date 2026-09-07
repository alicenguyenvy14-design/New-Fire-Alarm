import { BellIcon, FlameIcon, LightIcon, PowerIcon, SmokeIcon, ThermometerIcon } from "./Icons";
import { Button, SensorRow, Toggle } from "./Ui";

export function SensorMonitor({ styles, temperature, smokeValue, flameDetected, manualEmergency }) {
  const flameActive = flameDetected || manualEmergency;
  return <div className={`${styles.panel} ${styles.section}`}>
    <h3 className="text-base font-semibold">Giám sát cảm biến</h3>
    <div className="mt-4 space-y-4">
      <SensorRow name="Cảm biến nhiệt độ" value={temperature} unit="°C" status={temperature >= 50 ? "Nguy hiểm" : temperature >= 40 ? "Cảnh báo" : "Bình thường"} percent={Math.min((temperature / 80) * 100, 100)} icon={ThermometerIcon} />
      <SensorRow name="Cảm biến khói" value={smokeValue} unit="ppm" status={smokeValue >= 500 ? "Nguy hiểm" : smokeValue >= 250 ? "Cảnh báo" : "Bình thường"} percent={Math.min((smokeValue / 800) * 100, 100)} icon={SmokeIcon} />
      <SensorRow name="Cảm biến lửa" value={flameActive ? "YES" : "NO"} unit="" status={flameActive ? "Phát hiện lửa" : "Chưa phát hiện"} percent={flameActive ? 100 : 10} icon={FlameIcon} />
    </div>
  </div>;
}

export function ActuatorControls({ styles, buzzer, warningLight, onBuzzerChange, onWarningLightChange, onTriggerEmergency, onReset }) {
  return <div className="space-y-6">
    <div className={`${styles.panel} ${styles.section}`}>
      <h3 className="text-base font-semibold">Điều khiển hệ thống</h3>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><BellIcon className="w-5 h-5 text-slate-700" /><div><p className="font-medium">Còi cảnh báo</p><p className="text-xs text-slate-500">Gửi lệnh qua WebSocket nếu đang live</p></div></div><Toggle checked={buzzer} onChange={onBuzzerChange} /></div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><LightIcon className="w-5 h-5 text-slate-700" /><div><p className="font-medium">Đèn cảnh báo</p><p className="text-xs text-slate-500">Gửi lệnh qua WebSocket nếu đang live</p></div></div><Toggle checked={warningLight} onChange={onWarningLightChange} /></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Button className="h-12" onClick={onTriggerEmergency}><PowerIcon className="w-4 h-4" />Báo động khẩn cấp</Button><Button variant="outline" className="h-12" onClick={onReset}>Reset cảnh báo</Button></div>
      </div>
    </div>
    <div className={`${styles.panel} ${styles.section}`}><h3 className="text-base font-semibold">Trạng thái chấp hành</h3><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Còi</p><p className="mt-1 text-xl font-bold">{buzzer ? "ON" : "OFF"}</p></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Đèn</p><p className="mt-1 text-xl font-bold">{warningLight ? "ON" : "OFF"}</p></div></div></div>
  </div>;
}

export function SystemControls(props) {
  return <div className="space-y-6"><SensorMonitor {...props} /><ActuatorControls {...props} /></div>;
}
