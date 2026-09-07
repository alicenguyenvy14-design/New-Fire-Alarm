import { AlertIcon, ShieldIcon, SmokeIcon, ThermometerIcon, WifiIcon, WifiOffIcon } from "./Icons";
import { MiniLineChart, StatCard } from "./Ui";

export function OverviewCards({ systemStatus, temperature, smokeValue, online, sourceMode, wsState }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard title="Trạng thái hệ thống" value={systemStatus.label} subtitle={`Mức cảnh báo: ${systemStatus.level}`} icon={systemStatus.level >= 2 ? AlertIcon : ShieldIcon} tone={systemStatus.tone} /><StatCard title="Nhiệt độ hiện tại" value={`${temperature}°C`} subtitle="Ngưỡng cảnh báo từ 40°C" icon={ThermometerIcon} tone={temperature >= 50 ? "warning" : temperature >= 40 ? "caution" : "safe"} /><StatCard title="Mức khói" value={`${smokeValue} ppm`} subtitle="Ngưỡng cảnh báo từ 250 ppm" icon={SmokeIcon} tone={smokeValue >= 500 ? "warning" : smokeValue >= 250 ? "caution" : "safe"} /><StatCard title="Thiết bị / mạng" value={online ? "ONLINE" : "OFFLINE"} subtitle={sourceMode === "live" ? `Socket: ${wsState}` : "Chế độ mô phỏng"} icon={online ? WifiIcon : WifiOffIcon} tone={online ? "safe" : "neutral"} /></div>;
}

export function TrendCharts({ styles, chartData }) {
  return <div className="space-y-6"><div className={`${styles.panel} ${styles.section}`}><h3 className="text-base font-semibold">Biểu đồ nhiệt độ theo thời gian</h3><div className="mt-4"><MiniLineChart data={chartData} dataKey="temperature" maxValue={80} /></div></div><div className={`${styles.panel} ${styles.section}`}><h3 className="text-base font-semibold">Biểu đồ nồng độ khói</h3><div className="mt-4"><MiniLineChart data={chartData} dataKey="smoke" maxValue={800} stroke="#7c2d12" fill="rgba(124,45,18,0.08)" /></div></div></div>;
}
