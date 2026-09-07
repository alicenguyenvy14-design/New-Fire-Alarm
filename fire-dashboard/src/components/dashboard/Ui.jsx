import { toneClasses } from "../../dashboard/constants";

export function Badge({ children, tone = "neutral", className = "" }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone].badge} ${className}`}>{children}</span>;
}

export function Button({ children, onClick, variant = "solid", className = "", type = "button", disabled = false }) {
  const variantClass = variant === "outline" ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-800";
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}>{children}</button>;
}

export function Toggle({ checked, onChange, disabled = false }) {
  return <button type="button" onClick={() => !disabled && onChange(!checked)} disabled={disabled} aria-pressed={checked} className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${checked ? "bg-slate-900" : "bg-slate-300"} ${disabled ? "opacity-50" : ""}`}><span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`} /></button>;
}

export function ProgressBar({ value }) {
  const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${safeValue}%` }} /></div>;
}

export function MiniLineChart({ data, dataKey, maxValue, stroke = "#0f172a", fill = "rgba(15,23,42,0.08)" }) {
  const width = 760;
  const height = 240;
  const pad = 24;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const values = data.map((item) => item[dataKey]);
  const max = Math.max(maxValue || 0, ...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const points = data.map((item, index) => [pad + (index * innerW) / Math.max(data.length - 1, 1), pad + innerH - ((item[dataKey] - min) / range) * innerH]);
  const linePath = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${pad + innerW} ${pad + innerH} L ${pad} ${pad + innerH} Z`;

  return <div className="w-full overflow-hidden"><svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full"><rect x="0" y="0" width={width} height={height} fill="white" />{[0, 1, 2, 3].map((tick) => { const y = pad + (tick * innerH) / 3; return <line key={tick} x1={pad} y1={y} x2={pad + innerW} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />; })}<path d={areaPath} fill={fill} /><path d={linePath} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3" fill={stroke} />)}{data.map((item, index) => <text key={index} x={pad + (index * innerW) / Math.max(data.length - 1, 1)} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748b">{item.time}</text>)}</svg></div>;
}

export function StatCard({ title, value, subtitle, icon, tone = "neutral" }) {
  return <div className={`dashboard-card rounded-2xl border bg-white p-5 shadow-sm ${toneClasses[tone].card}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium opacity-80">{title}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs opacity-80">{subtitle}</p></div><div className="rounded-2xl border border-white/60 bg-white/70 p-3">{icon({ className: "w-5 h-5" })}</div></div></div>;
}

export function SensorRow({ name, value, unit, status, percent, icon }) {
  return <div className="dashboard-card rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">{icon({ className: "w-4 h-4" })}</div><div><p className="font-medium text-slate-900">{name}</p><p className="text-xs text-slate-500">Trạng thái: {status}</p></div></div><div className="text-right"><p className="text-lg font-bold text-slate-900">{value} {unit}</p></div></div><div className="mt-3"><ProgressBar value={percent} /></div></div>;
}
