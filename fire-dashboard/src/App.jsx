
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertHistory } from "./components/dashboard/AlertHistory";
import { AlertLogPage } from "./components/dashboard/AlertLogPage";
import { AlertSummary } from "./components/dashboard/AlertSummary";
import { CameraAiPanel } from "./components/dashboard/CameraAiPanel";
import { ConnectionPanel } from "./components/dashboard/ConnectionPanel";
import { DashboardHeader } from "./components/dashboard/DashboardHeader";
import { DashboardSidebar } from "./components/dashboard/DashboardSidebar";
import { OverviewCards, TrendCharts } from "./components/dashboard/SensorOverview";
import { SettingsPanel } from "./components/dashboard/SettingsPanel";
import { ActuatorControls, SensorMonitor, SystemControls } from "./components/dashboard/SystemControls";
import { styles } from "./dashboard/constants";
import { formatTime, getStatus, initialHistory, normalizeIncomingData, runLogicTests, seedData } from "./dashboard/telemetry";

// import React, { useEffect, useMemo, useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getDatabase, onValue, ref, set } from "firebase/database";
// import icon from "./assets/icon.png";

// // ================================
// // FIREBASE CONFIG
// // Thay bằng config Firebase thật của em
// // ================================
// const firebaseConfig = {
//   apiKey: "AIzaSyDCqENbA55iQQWUObM5UCV_29s80vb-39A",
//   authDomain: "firealarm-77a2c.firebaseapp.com",
//   databaseURL: "https://firealarm-77a2c-default-rtdb.firebaseio.com",
//   projectId: "firealarm-77a2c",
//   storageBucket: "firealarm-77a2c.firebasestorage.app",
//   messagingSenderId: "617075055573",
//   appId: "1:617075055573:web:3e584ba0a27d6274683b5c",
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getDatabase(firebaseApp);

// function FlameIcon({ className = "w-5 h-5" }) {
//   return (
//     // <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//     //   <path d="M12 3s2 2.2 2 4.5c0 1.5-.7 2.5-1.4 3.3 2.6-.5 5.4 1.7 5.4 5 0 3.2-2.7 5.7-6 5.7s-6-2.5-6-5.7c0-2.7 1.6-4.3 3.3-5.8.9-.8 1.7-1.6 2.1-2.6.6-1.4.6-2.8.6-4.4Z" />
//     //   <path d="M12 13.5c1.4 1 2.2 2 2.2 3.2A2.3 2.3 0 0 1 12 19a2.3 2.3 0 0 1-2.2-2.3c0-1.1.6-2 2.2-3.2Z" />
//     // </svg>
//     <div className="rounded-2xl bg-white p-2 shadow-sm">
//   <img
//     src={icon}
//     alt="icon"
//     className="w-12 h-12 object-contain rounded-xl"
//   />
// </div>
//   );
// }

// function SmokeIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M6 16c-1.7 0-3-1.3-3-3s1.3-3 3-3c.3-2.6 2.5-4.5 5.2-4.5 2.3 0 4.3 1.3 5.1 3.3.4-.2.9-.3 1.4-.3 1.7 0 3.1 1.4 3.1 3.1S19.4 16 17.7 16H6Z" />
//       <path d="M7 19c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
//       <path d="M11 20c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
//       <path d="M15 19c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
//     </svg>
//   );
// }

// function BellIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M6 8a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" />
//       <path d="M10 20a2 2 0 0 0 4 0" />
//     </svg>
//   );
// }

// function LightIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M9 18h6" />
//       <path d="M10 22h4" />
//       <path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1.1 1 1.8V18h6v-1.5c0-.7.4-1.4 1-1.8A7 7 0 0 0 12 2Z" />
//     </svg>
//   );
// }

// function ShieldIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M12 3l7 3v5c0 5-3.4 8.9-7 10-3.6-1.1-7-5-7-10V6l7-3Z" />
//       <path d="m9.5 12 1.7 1.7L14.8 10" />
//     </svg>
//   );
// }

// function WifiIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M5 12.5a11 11 0 0 1 14 0" />
//       <path d="M8.5 16a6 6 0 0 1 7 0" />
//       <path d="M12 20h.01" />
//       <path d="M2 9a16 16 0 0 1 20 0" />
//     </svg>
//   );
// }

// function WifiOffIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M2 9a16 16 0 0 1 7-3.6" />
//       <path d="M10.7 5.1A16 16 0 0 1 22 9" />
//       <path d="M5 12.5a11 11 0 0 1 4.4-2.2" />
//       <path d="M14.4 10.5a11 11 0 0 1 4.6 2" />
//       <path d="M8.5 16a6 6 0 0 1 2.6-1.3" />
//       <path d="M15.5 16A6 6 0 0 0 14 15.2" />
//       <path d="M12 20h.01" />
//       <path d="M2 2l20 20" />
//     </svg>
//   );
// }

// function AlertIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M12 9v4" />
//       <path d="M12 17h.01" />
//       <path d="M10.3 3.8 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
//     </svg>
//   );
// }

// function ActivityIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M3 12h4l2-5 4 10 2-5h6" />
//     </svg>
//   );
// }

// function SettingsIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M12 3v2" />
//       <path d="M12 19v2" />
//       <path d="m4.9 4.9 1.4 1.4" />
//       <path d="m17.7 17.7 1.4 1.4" />
//       <path d="M3 12h2" />
//       <path d="M19 12h2" />
//       <path d="m4.9 19.1 1.4-1.4" />
//       <path d="m17.7 6.3 1.4-1.4" />
//       <circle cx="12" cy="12" r="3.5" />
//     </svg>
//   );
// }

// function PowerIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <path d="M12 2v10" />
//       <path d="M6.2 5.8A8 8 0 1 0 17.8 5.8" />
//     </svg>
//   );
// }

// function BatteryIcon({ className = "w-5 h-5" }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
//       <rect x="2" y="7" width="18" height="10" rx="2" />
//       <path d="M22 10v4" />
//       <path d="M6 10h8" />
//     </svg>
//   );
// }

// const styles = {
//   page: "min-h-screen bg-slate-100 p-4 md:p-6 text-slate-900",
//   shell: "mx-auto max-w-7xl",
//   layout: "grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]",
//   panel: "rounded-3xl border border-slate-200 bg-white shadow-sm",
//   side: "p-5",
//   main: "space-y-6",
//   section: "p-5",
//   card: "rounded-2xl border border-slate-200 bg-white shadow-sm",
//   mutedCard: "rounded-2xl border border-slate-200 bg-slate-50",
//   badge: "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
//   button: "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
// };

// const formatTime = (date = new Date()) =>
//   date.toLocaleTimeString("vi-VN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });

// const estimateEnergy = ({
//   smoke = 0,
//   online = true,
//   buzzer = false,
//   warningLight = false,
// }) => {
//   const controllerBase = online ? 0.55 : 0.2;
//   const smokeSensorBase = 0.28;
//   const smokeFactor = Math.max(0, smoke) * 0.002;
//   const buzzerPower = buzzer ? 1.35 : 0;
//   const warningLightPower = warningLight ? 0.45 : 0;

//   return Number(
//     (
//       controllerBase +
//       smokeSensorBase +
//       smokeFactor +
//       buzzerPower +
//       warningLightPower
//     ).toFixed(2)
//   );
// };

// const getStatus = ({ smoke }) => {
//   if (smoke >= 0.3) {
//     return { label: "NGUY HIỂM", tone: "danger", level: 3 };
//   }
//   if (smoke >= 0.15) {
//     return { label: "NGUY CƠ CHÁY", tone: "warning", level: 2 };
//   }
//   if (smoke >= 0.1) {
//     return { label: "CẢNH BÁO SỚM", tone: "caution", level: 1 };
//   }
//   return { label: "AN TOÀN", tone: "safe", level: 0 };
// };

// function runLogicTests() {
//   const statusCases = [
//     { input: { smoke: 100 }, expected: 0 },
//     { input: { smoke: 260 }, expected: 1 },
//     { input: { smoke: 510 }, expected: 2 },
//     { input: { smoke: 620 }, expected: 3 },
//   ];
//   return statusCases.every((testCase) => getStatus(testCase.input).level === testCase.expected);
// }

// const toneClasses = {
//   safe: {
//     card: "border-emerald-200 bg-emerald-50 text-emerald-700",
//     badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
//   },
//   caution: {
//     card: "border-amber-200 bg-amber-50 text-amber-700",
//     badge: "border-amber-200 bg-amber-50 text-amber-700",
//   },
//   warning: {
//     card: "border-orange-200 bg-orange-50 text-orange-700",
//     badge: "border-orange-200 bg-orange-50 text-orange-700",
//   },
//   danger: {
//     card: "border-red-200 bg-red-50 text-red-700",
//     badge: "border-red-200 bg-red-50 text-red-700",
//   },
//   neutral: {
//     card: "border-slate-200 bg-slate-50 text-slate-700",
//     badge: "border-slate-200 bg-slate-50 text-slate-700",
//   },
// };

// const getBatteryTone = (battery) => {
//   if (battery <= 20) return "danger";
//   if (battery <= 50) return "warning";
//   return "safe";
// };

// const initialHistory = [
//   { time: formatTime(), type: "SYSTEM", detail: "Hệ thống khởi động thành công" },
//   { time: formatTime(), type: "NETWORK", detail: "Đã chuyển sang Firebase Realtime Database" },
// ];

// const seedData = Array.from({ length: 12 }).map((_, i) => {
//   const smoke = 120 + Math.round(Math.random() * 50);
//   const buzzer = false;
//   const warningLight = false;
//   const online = true;

//   return {
//     time: `10:${String(i * 2).padStart(2, "0")}`,
//     smoke,
//     buzzer,
//     warningLight,
//     energy: estimateEnergy({
//       smoke,
//       online,
//       buzzer,
//       warningLight,
//     }),
//   };
// });

// function Badge({ children, tone = "neutral", className = "" }) {
//   return <span className={`${styles.badge} ${toneClasses[tone].badge} ${className}`}>{children}</span>;
// }

// function Button({ children, onClick, variant = "solid", className = "", type = "button", disabled = false }) {
//   const variantClass =
//     variant === "outline"
//       ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
//       : "bg-slate-900 text-white hover:bg-slate-800";

//   return (
//     <button type={type} onClick={onClick} disabled={disabled} className={`${styles.button} ${variantClass} ${className}`}>
//       {children}
//     </button>
//   );
// }

// function Toggle({ checked, onChange, disabled = false }) {
//   return (
//     <button
//       type="button"
//       onClick={() => !disabled && onChange(!checked)}
//       disabled={disabled}
//       aria-pressed={checked}
//       className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${checked ? "bg-slate-900" : "bg-slate-300"} ${disabled ? "opacity-50" : ""}`}
//     >
//       <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`} />
//     </button>
//   );
// }

// function ProgressBar({ value }) {
//   const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
//   return (
//     <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
//       <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${safeValue}%` }} />
//     </div>
    
//   );
// }

// function MiniLineChart({ data, dataKey, maxValue, stroke = "#7c2d12", fill = "rgba(124,45,18,0.08)" }) {
//   const width = 760;
//   const height = 240;
//   const pad = 24;
//   const innerW = width - pad * 2;
//   const innerH = height - pad * 2;
//   const values = data.map((item) => item[dataKey] ?? 0);
//   const max = Math.max(maxValue || 0, ...values, 1);
//   const min = Math.min(...values, 0);
//   const range = Math.max(max - min, 1);

//   const points = data.map((item, index) => {
//     const value = item[dataKey] ?? 0;
//     const x = pad + (index * innerW) / Math.max(data.length - 1, 1);
//     const y = pad + innerH - ((value - min) / range) * innerH;
//     return [x, y];
//   });

//   const linePath = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
//   const areaPath = `${linePath} L ${pad + innerW} ${pad + innerH} L ${pad} ${pad + innerH} Z`;

//   return (
//     <div className="w-full overflow-hidden">
//       <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
//         <rect x="0" y="0" width={width} height={height} fill="white" />
//         {[0, 1, 2, 3].map((tick) => {
//           const y = pad + (tick * innerH) / 3;
//           return <line key={tick} x1={pad} y1={y} x2={pad + innerW} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />;
//         })}
//         <path d={areaPath} fill={fill} />
//         <path d={linePath} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
//         {points.map(([x, y], index) => (
//           <circle key={index} cx={x} cy={y} r="3" fill={stroke} />
//         ))}
//         {data.map((item, index) => {
//           const x = pad + (index * innerW) / Math.max(data.length - 1, 1);
//           return (
//             <text key={index} x={x} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748b">
//               {item.time}
//             </text>
//           );
//         })}
//       </svg>
//     </div>
//   );
// }

// function StatCard({ title, value, subtitle, icon: Icon, tone = "neutral" }) {
//   return (
//     <div className={`${styles.card} ${toneClasses[tone].card} p-5`}>
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-sm font-medium opacity-80">{title}</p>
//           <p className="mt-2 text-2xl font-bold">{value}</p>
//           <p className="mt-1 text-xs opacity-80">{subtitle}</p>
//         </div>
//         {Icon ? (
//           <div className="rounded-2xl border border-white/60 bg-white/70 p-3">
//             <Icon className="w-5 h-5" />
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// function SensorRow({ name, value, unit, status, percent, icon: Icon }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="flex items-center justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">
//             <Icon className="w-4 h-4" />
//           </div>
//           <div>
//             <p className="font-medium text-slate-900">{name}</p>
//             <p className="text-xs text-slate-500">Trạng thái: {status}</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-lg font-bold text-slate-900">
//             {value} {unit}
//           </p>
//         </div>
//       </div>
//       <div className="mt-3">
//         <ProgressBar value={percent} />
//       </div>
//     </div>
//   );
// }

// function MenuButton({ active, icon: Icon, label, onClick, badge }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
//         active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
//       }`}
//     >
//       <span className="flex items-center gap-3">
//         <Icon className="w-4 h-4" />
//         <span>{label}</span>
//       </span>
//       {badge ? <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? "bg-white/15 text-white" : "bg-red-100 text-red-700"}`}>{badge}</span> : null}
//     </button>
//   );
// }

// function SectionHeader({ title, description, actions }) {
//   return (
//     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//       <div>
//         <h3 className="text-base font-semibold">{title}</h3>
//         {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
//       </div>
//       {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
//     </div>
//   );
// }

// function OverviewPage({
//   systemStatus,
//   modeAuto,
//   lastUpdate,
//   smokeValue,
//   batteryLevel,
//   online,
//   setActivePage,
//   packetCount,
//   lastError,
// }) {
//   return (
//     <>
//       <div className={`${styles.panel} ${styles.section}`}>
//         <SectionHeader
//           title="Dashboard hệ thống cảnh báo khói"
//           description="Trang tổng quan hiển thị trạng thái tức thời, kết nối thiết bị và chỉ số khói quan trọng nhất."
//           actions={
//             <>
//               <Badge tone={systemStatus.tone} className="px-4 py-2 text-sm">
//                 {systemStatus.label}
//               </Badge>
//               <Badge className="px-4 py-2 text-sm">{modeAuto ? "AUTO" : "MANUAL"}</Badge>
//               <Badge className="px-4 py-2 text-sm">{lastUpdate}</Badge>
//             </>
//           }
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Trạng thái hệ thống"
//           value={systemStatus.label}
//           subtitle={`Mức cảnh báo: ${systemStatus.level}`}
//           icon={systemStatus.level >= 2 ? AlertIcon : ShieldIcon}
//           tone={systemStatus.tone}
//         />
//         <StatCard
//           title="Nồng độ khói"
//           value={`${smokeValue} dB/m`}
//           // subtitle="Ngưỡng cảnh báo từ 0.3 dB/m"
//           icon={SmokeIcon}
//           tone={smokeValue >= 0.3 ? "warning" : smokeValue >= 0.05? "caution" : "safe"}
//         />
//         <StatCard
//           title="Pin thiết bị"
//           value="17%"
//           // subtitle={batteryLevel <= 20 ? "Pin yếu, cần sạc/thay" : batteryLevel <= 50 ? "Pin trung bình" : "Pin ổn định"}
//           // icon={BatteryIcon}
//           tone={getBatteryTone(batteryLevel)}
//         />
//         <StatCard
//           title="Thiết bị / mạng"
//           value={online ? "ONLINE" : "OFFLINE"}
//           subtitle="Nguồn dữ liệu: Firebase Realtime Database"
//           icon={online ? WifiIcon : WifiOffIcon}
//           tone={online ? "safe" : "neutral"}
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
//         <div className={`${styles.panel} ${styles.section}`}>
//           <SectionHeader
//             title="Kết nối dữ liệu"
//             description="Dữ liệu đang được đồng bộ realtime từ Firebase."
//             actions={
//               <>
//                 <Button variant="outline" onClick={() => setActivePage("settings")}>
//                   Mở cài đặt
//                 </Button>
//                 <Button onClick={() => setActivePage("sensors")}>Xem cảm biến</Button>
//               </>
//             }
//           />
//           <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             <div className="flex flex-wrap gap-3 text-xs text-slate-500">
//               <span>Packets: {packetCount}</span>
//               <span>Mode: Firebase Live</span>
//               <span>Path: firealarm/current</span>
//               <Badge tone="safe">CONNECTED</Badge>
//             </div>
//             {lastError ? <p className="mt-3 text-sm text-red-600">{lastError}</p> : null}
//           </div>
//         </div>

//         <div className={`${styles.panel} ${styles.section}`}>
//           <SectionHeader title="Điều hướng nhanh" description="Các trang menu giờ liên kết qua lại trực tiếp." />
//           <div className="mt-4 space-y-3">
//             <Button className="w-full justify-start" variant="outline" onClick={() => setActivePage("alerts")}>
//               Mở trung tâm cảnh báo
//             </Button>
//             <Button className="w-full justify-start" variant="outline" onClick={() => setActivePage("history")}>
//               Xem lịch sử gần nhất
//             </Button>
//             <Button className="w-full justify-start" variant="outline" onClick={() => setActivePage("sensors")}>
//               Theo dõi cảm biến
//             </Button>
//             <Button className="w-full justify-start" variant="outline" onClick={() => setActivePage("settings")}>
//               Cài đặt hệ thống
//             </Button>
//           </div>
//           {/* <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
//             <p className="font-semibold text-slate-800">JSON dữ liệu mẫu</p>
//             <code className="mt-2 block whitespace-pre-wrap break-all text-xs">
//               {`{"smoke":220,"buzzer":false,"warningLight":false,"online":true,"mode":"auto","battery":82,"energy":1.27,"timestamp":"14:25:10"}`}
//             </code>
//           </div> */}
//         </div>
//       </div>
//     </>
//   );
// }

// function SensorsPage({ smokeValue, batteryLevel, chartData, setActivePage }) {
//   const latestEnergy = chartData[chartData.length - 1]?.energy ?? 0;

//   return (
//     <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
//       <div className="space-y-6">
//         <div className={`${styles.panel} ${styles.section}`}>
//           <SectionHeader
//             title="Biểu đồ nồng độ khói"
//             description="Theo dõi biến động nồng độ khói theo thời gian."
//             actions={
//               <>
//                 <Button variant="outline" onClick={() => setActivePage("overview")}>
//                   Về tổng quan
//                 </Button>
//                 <Button onClick={() => setActivePage("alerts")}>Sang cảnh báo</Button>
//               </>
//             }
//           />
//           <div className="mt-4">
//             <MiniLineChart data={chartData} dataKey="smoke" maxValue={800} />
//           </div>
//         </div>

//         <div className={`${styles.panel} ${styles.section}`}>
//           <SectionHeader
//             title="Biểu đồ tiêu thụ năng lượng toàn thiết bị báo cháy"
//             description="Bao gồm mạch điều khiển, cảm biến khói, còi báo động, đèn cảnh báo và trạng thái kết nối."
//           />
//           <div className="mt-4">
//             <MiniLineChart
//               data={chartData}
//               dataKey="energy"
//               maxValue={5}
//               stroke="#1d4ed8"
//               fill="rgba(29,78,216,0.10)"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6">
//         <div className={`${styles.panel} ${styles.section}`}>
//           <SectionHeader title="Giám sát cảm biến khói" description="Tình trạng realtime của cảm biến khói và thiết bị." />
//           <div className="mt-4 space-y-4">
//             <SensorRow
//               name="Cảm biến khói"
//               value={smokeValue}
//               unit="dB/m"
//               status={smokeValue >= 0.15 ? "Nguy hiểm" : smokeValue >= 0.05 ? "Cảnh báo" : "Bình thường"}
//               // percent={Math.min((smokeValue / 0.8) * 100, 100)}
//               icon={SmokeIcon}
//             />

//             <SensorRow
//               name="Pin thiết bị"
//               value={batteryLevel}
//               unit="%"
//               status={batteryLevel <= 20 ? "Pin yếu" : batteryLevel <= 50 ? "Trung bình" : "Tốt"}
//               percent={batteryLevel}
//               icon={BatteryIcon}
//             />
//           </div>
//         </div>

//         <div className={`${styles.panel} ${styles.section}`}>
//           <SectionHeader title="Thông số năng lượng" description="Giá trị tiêu thụ hiện tại của toàn bộ thiết bị báo cháy." />
//           <div className="mt-4 grid grid-cols-1 gap-3">
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <p className="text-sm text-slate-500">Công suất toàn hệ thống hiện tại</p>
//               <p className="mt-1 text-2xl font-bold text-slate-900">{latestEnergy} W</p>
//             </div>
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <p className="text-sm text-slate-500">Dung lượng pin còn lại</p>
//               <p className="mt-1 text-2xl font-bold text-slate-900">{batteryLevel}%</p>
//             </div>
//           </div>
//         </div>

//         <div className={`${styles.panel} ${styles.section}`}>
//           <SectionHeader title="Dữ liệu gần nhất" description="Bảng log nhanh từ cảm biến và thiết bị cảnh báo." />
//           <div className="mt-4 overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="border-b border-slate-200 text-left text-slate-500">
//                   <th className="px-3 py-2">Thời gian</th>
//                   <th className="px-3 py-2">Khói</th>
//                   <th className="px-3 py-2">Còi</th>
//                   <th className="px-3 py-2">Đèn</th>
//                   <th className="px-3 py-2">Energy</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {chartData
//                   .slice()
//                   .reverse()
//                   .map((item, index) => (
//                     <tr key={index} className="border-b border-slate-100">
//                       <td className="px-3 py-2">{item.time}</td>
//                       <td className="px-3 py-2">{item.smoke} dB/m</td>
//                       <td className="px-3 py-2">{item.buzzer ? "ON" : "OFF"}</td>
//                       <td className="px-3 py-2">{item.warningLight ? "ON" : "OFF"}</td>
//                       <td className="px-3 py-2">{item.energy ?? 0} W</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AlertsPage({ buzzer, warningLight, updateBuzzer, updateWarningLight, triggerEmergency, resetSystem, systemStatus, alertRows, setActivePage }) {
//   return (
//     <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
//       <div className={`${styles.panel} ${styles.section}`}>
//         <SectionHeader title="Điều khiển hệ thống" description="Các lệnh điều khiển được ghi trực tiếp vào Firebase." />
//         <div className="mt-4 space-y-4">
//           <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
//             <div className="flex items-center gap-3">
//               <BellIcon className="w-5 h-5 text-slate-700" />
//               <div>
//                 <p className="font-medium">Còi cảnh báo</p>
//                 <p className="text-xs text-slate-500">Ghi trạng thái buzzer vào Firebase</p>
//               </div>
//             </div>
//             <Toggle checked={buzzer} onChange={updateBuzzer} />
//           </div>

//           <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
//             <div className="flex items-center gap-3">
//               <LightIcon className="w-5 h-5 text-slate-700" />
//               <div>
//                 <p className="font-medium">Đèn cảnh báo</p>
//                 <p className="text-xs text-slate-500">Ghi trạng thái warning light vào Firebase</p>
//               </div>
//             </div>
//             <Toggle checked={warningLight} onChange={updateWarningLight} />
//           </div>

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <Button className="h-12" onClick={triggerEmergency}>
//               <PowerIcon className="w-4 h-4" />
//               Báo động khẩn cấp
//             </Button>
//             <Button variant="outline" className="h-12" onClick={resetSystem}>
//               Reset cảnh báo
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className={`${styles.panel} ${styles.section}`}>
//         <SectionHeader
//           title="Trạng thái chấp hành"
//           description="Tổng hợp trạng thái còi, đèn và mức nguy cơ hiện tại."
//           actions={<Button variant="outline" onClick={() => setActivePage("history")}>Mở lịch sử</Button>}
//         />
//         <div className="mt-4 grid grid-cols-2 gap-3">
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             <p className="text-sm text-slate-500">Còi</p>
//             <p className="mt-1 text-xl font-bold">{buzzer ? "ON" : "OFF"}</p>
//           </div>
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             <p className="text-sm text-slate-500">Đèn</p>
//             <p className="mt-1 text-xl font-bold">{warningLight ? "ON" : "OFF"}</p>
//           </div>
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             <p className="text-sm text-slate-500">Mức nguy cơ</p>
//             <p className="mt-1 text-xl font-bold">{systemStatus.level}</p>
//           </div>
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             <p className="text-sm text-slate-500">Trạng thái</p>
//             <p className="mt-1 text-xl font-bold">{systemStatus.label}</p>
//           </div>
//         </div>

//         <div className="mt-5 rounded-2xl border border-slate-200 p-4">
//           <p className="text-sm font-semibold text-slate-800">Sự kiện cảnh báo gần nhất</p>
//           <div className="mt-3 space-y-3">
//             {alertRows.length === 0 ? (
//               <p className="text-sm text-slate-500">Chưa có cảnh báo mới.</p>
//             ) : (
//               alertRows.map((item, idx) => (
//                 <div key={`${item.time}-${idx}`} className="rounded-2xl bg-slate-50 p-3">
//                   <div className="flex items-center justify-between gap-3">
//                     <Badge tone={item.type === "MANUAL" ? "warning" : "danger"}>{item.type}</Badge>
//                     <span className="text-xs text-slate-500">{item.time}</span>
//                   </div>
//                   <p className="mt-2 text-sm text-slate-800">{item.detail}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function HistoryPage({ history, setActivePage }) {
//   return (
//     <div className={`${styles.panel} ${styles.section}`}>
//       <SectionHeader
//         title="Lịch sử cảnh báo gần nhất"
//         description="Danh sách log hệ thống, cảnh báo, hành động tay và trạng thái mạng."
//         actions={
//           <>
//             <Button variant="outline" onClick={() => setActivePage("alerts")}>
//               Về cảnh báo
//             </Button>
//             <Button onClick={() => setActivePage("overview")}>Về tổng quan</Button>
//           </>
//         }
//       />
//       <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
//         <div className="grid grid-cols-[120px_120px_minmax(0,1fr)] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
//           <div>Thời gian</div>
//           <div>Loại</div>
//           <div>Chi tiết</div>
//         </div>
//         {history.map((item, idx) => (
//           <div key={`${item.time}-${idx}`} className="grid grid-cols-[120px_120px_minmax(0,1fr)] border-t border-slate-200 bg-white px-4 py-3 text-sm">
//             <div className="text-slate-600">{item.time}</div>
//             <div>
//               <Badge tone={item.type === "ALERT" || item.type === "MANUAL" ? "danger" : "neutral"}>{item.type}</Badge>
//             </div>
//             <div className="text-slate-800">{item.detail}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function SettingsPage({ online, lastUpdate, modeAuto, updateAutoMode, testsPassed, setActivePage }) {
//   return (
//     <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
//       <div className={`${styles.panel} ${styles.section}`}>
//         <SectionHeader title="Cấu hình kết nối" description="Hệ thống đang dùng Firebase Realtime Database làm nguồn dữ liệu." />
//         <div className="mt-4 space-y-4">
//           <div className={`${styles.mutedCard} p-4`}>
//             <div className="flex items-center justify-between gap-2">
//               <p className="text-sm font-medium">Nguồn dữ liệu</p>
//               <Badge tone="safe">FIREBASE LIVE</Badge>
//             </div>
//             <p className="mt-2 text-xs text-slate-500">Path đọc dữ liệu: firealarm/current</p>
//           </div>

//           <div className={`${styles.mutedCard} p-4`}>
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium">Kết nối thiết bị</p>
//               <Badge tone={online ? "safe" : "neutral"}>{online ? "Online" : "Offline"}</Badge>
//             </div>
//             <p className="mt-2 text-xs text-slate-500">Cập nhật cuối: {lastUpdate}</p>
//           </div>

//           <div className={`${styles.mutedCard} p-4`}>
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium">Chế độ tự động</p>
//               <Toggle checked={modeAuto} onChange={updateAutoMode} />
//             </div>
//             <p className="mt-2 text-xs text-slate-500">{modeAuto ? "Hệ thống tự xử lý cảnh báo" : "Điều khiển thủ công"}</p>
//           </div>
//         </div>
//       </div>

//       <div className={`${styles.panel} ${styles.section}`}>
//         {/* <SectionHeader title="Kiểm tra logic" description="Tự test cho bộ phân loại cảnh báo từ khói." />
//         <div className="mt-4 space-y-4">
//           <div className={`${styles.mutedCard} p-4`}>
//             <div className="flex items-center justify-between gap-2">
//               <p className="text-sm font-medium">Self-check</p>
//               <Badge tone={testsPassed ? "safe" : "danger"}>{testsPassed ? "PASS" : "FAIL"}</Badge>
//             </div>
//             <p className="mt-2 text-xs text-slate-500">Kiểm tra logic cảnh báo theo mức khói</p>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
//             <p className="font-semibold text-slate-800">Menu đã liên kết</p>
//             <p className="mt-2">Sidebar và các nút trong từng trang đều chuyển qua lại giữa Tổng quan, Cảm biến, Cảnh báo, Lịch sử, Cài đặt.</p>
//           </div>

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <Button variant="outline" onClick={() => setActivePage("overview")}>
//               Trang tổng quan
//             </Button>
//             <Button onClick={() => setActivePage("sensors")}>Trang cảm biến</Button>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   const [activePage, setActivePage] = useState("overview");

//   const [packetCount, setPacketCount] = useState(0);
//   const [lastError, setLastError] = useState("");

//   const [online, setOnline] = useState(false);
//   const [modeAuto, setModeAuto] = useState(true);
//   const [buzzer, setBuzzer] = useState(false);
//   const [warningLight, setWarningLight] = useState(false);
//   const [smokeValue, setSmokeValue] = useState(0);
//   const [batteryLevel, setBatteryLevel] = useState(100);
//   const [lastUpdate, setLastUpdate] = useState(formatTime());
//   const [history, setHistory] = useState(initialHistory);
//   const [chartData, setChartData] = useState(seedData);
//   const [testsPassed] = useState(() => runLogicTests());

//   const appendHistory = (type, detail) => {
//     setHistory((prev) => {
//       const entry = { time: formatTime(), type, detail };
//       if (prev[0]?.detail === detail && prev[0]?.type === type) return prev;
//       return [entry, ...prev].slice(0, 12);
//     });
//   };

//   // useEffect(() => {
//   //   const currentRef = ref(db, "firealarm/current");

//   //   const unsubscribe = onValue(
//   //     currentRef,
//   //     (snapshot) => {
//   //       const value = snapshot.val();
//   //       if (!value) return;

//   //       const nextSmoke = Number(value.smoke ?? 0);
//   //       const nextBuzzer = !!value.buzzer;
//   //       const nextLight = !!value.warningLight;
//   //       const nextOnline = !!value.online;
//   //       const nextBattery = Number(value.battery ?? 87);
//   //       const nextModeAuto = (value.mode ?? "auto") === "auto";
//   //       const nextTimestamp = value.timestamp ?? formatTime();
//   //       const nextEnergy = Number(
//   //         value.energy ??
//   //           estimateEnergy({
//   //             smoke: nextSmoke,
//   //             online: nextOnline,
//   //             buzzer: nextBuzzer,
//   //             warningLight: nextLight,
//   //           })
//   //       );

//   //       setSmokeValue(nextSmoke);
//   //       setBuzzer(nextBuzzer);
//   //       setWarningLight(nextLight);
//   //       setOnline(nextOnline);
//   //       setBatteryLevel(nextBattery);
//   //       setModeAuto(nextModeAuto);
//   //       setLastUpdate(nextTimestamp);

//   //       setChartData((prev) => [
//   //         ...prev.slice(-11),
//   //         {
//   //           time: formatTime(new Date()).slice(0, 5),
//   //           smoke: nextSmoke,
//   //           buzzer: nextBuzzer,
//   //           warningLight: nextLight,
//   //           energy: nextEnergy,
//   //         },
//   //       ]);

//   //       setPacketCount((prev) => prev + 1);

//   //       const status = getStatus({ smoke: nextSmoke });
//   //       if (status.level > 0) {
//   //         const detailMap = {
//   //           1: `Cảnh báo sớm: Smoke ${nextSmoke} dB/m`,
//   //           2: `Nguy cơ cháy: Smoke ${nextSmoke} dB/m`,
//   //           3: `Mức nguy hiểm cao: Smoke ${nextSmoke} dB/m`,
//   //         };
//   //         appendHistory("ALERT", detailMap[status.level]);
//   //       }

//   //       setLastError("");
//   //     },
//   //     (error) => {
//   //       setLastError(error.message || "Không đọc được dữ liệu từ Firebase");
//   //     }
//   //   );

//   //   return () => unsubscribe();
//   // }, []);
//   useEffect(() => {
//   const currentRef = ref(db, "firealarm/current");
 

//   const unsubscribe = onValue(
//     currentRef,
//     (snapshot) => {
//       const value = snapshot.val();
//       if (!value) return;

//       // Chỉ nhận dữ liệu từ thiết bị báo khói
//       const deviceName = String(
//         value.deviceName ||
//         value.device_name ||
//         value.name ||
//         value.deviceInfo?.deviceName ||
//         ""
//       ).toLowerCase();

//       const isBaoKhoi =
//         deviceName === "Bao khoi" ||
//         deviceName === "Bao_khoi" ||
//         deviceName === "báo khói" ||
//         deviceName === "baokhoi";

//       // Nếu dữ liệu không phải từ Bao khoi thì bỏ qua, không cập nhật smoke
//       if (!isBaoKhoi) {
//         console.log("Bỏ qua dữ liệu không phải Bao khoi:", deviceName);
//         return;
//       }

//       const nextSmoke = Number(value.smoke ?? value.value ?? value.mq2 ?? 0);
//       const nextOnline = value.online !== undefined ? !!value.online : true;
//       const nextBattery = Number(value.battery ?? batteryLevel);
//       const nextTimestamp = value.timestamp ?? formatTime();

//       const nextEnergy = Number(
//         value.energy ??
//           estimateEnergy({
//             smoke: nextSmoke,
//             online: nextOnline,
//             buzzer,
//             warningLight,
//           })
//       );

//       // Chỉ cập nhật phần khói của Báo khói
//       setSmokeValue(nextSmoke);
//       setOnline(nextOnline);
//       setBatteryLevel(nextBattery);
//       setLastUpdate(nextTimestamp);

//       setChartData((prev) => [
//         ...prev.slice(-11),
//         {
//           time: formatTime(new Date()).slice(0, 5),
//           smoke: nextSmoke,
//           buzzer,
//           warningLight,
//           energy: nextEnergy,
//         },
//       ]);

//       setPacketCount((prev) => prev + 1);

//       const status = getStatus({ smoke: nextSmoke });
//       if (status.level > 0) {
//         const detailMap = {
//           1: `Cảnh báo sớm: Smoke ${nextSmoke} dB/m`,
//           2: `Nguy cơ cháy: Smoke ${nextSmoke} dB/m`,
//           3: `Mức nguy hiểm cao: Smoke ${nextSmoke} dB/m`,
//         };
//         appendHistory("ALERT", detailMap[status.level]);
//       }

//       setLastError("");
//     },
//     (error) => {
//       setLastError(error.message || "Không đọc được dữ liệu từ Firebase");
//     }
//   );

//   return () => unsubscribe();
// }, [batteryLevel, buzzer, warningLight]);

//   const systemStatus = useMemo(
//     () => getStatus({ smoke: smokeValue }),
//     [smokeValue]
//   );

//   const updateAutoMode = async (nextValue) => {
//     try {
//       setModeAuto(nextValue);
//       await set(ref(db, "firealarm/current/mode"), nextValue ? "auto" : "manual");
//       await set(ref(db, "firealarm/current/timestamp"), formatTime());
//       appendHistory("ACTION", `Chuyển chế độ sang ${nextValue ? "AUTO" : "MANUAL"}`);
//     } catch (error) {
//       setLastError(error.message || "Không cập nhật được mode");
//     }
//   };

//   const updateBuzzer = async (nextValue) => {
//     try {
//       setBuzzer(nextValue);
//       await set(ref(db, "firealarm/current/buzzer"), nextValue);
//       await set(ref(db, "firealarm/current/timestamp"), formatTime());
//       appendHistory("ACTION", `${nextValue ? "Bật" : "Tắt"} còi cảnh báo`);
//     } catch (error) {
//       setLastError(error.message || "Không cập nhật được buzzer");
//     }
//   };

//   const updateWarningLight = async (nextValue) => {
//     try {
//       setWarningLight(nextValue);
//       await set(ref(db, "firealarm/current/warningLight"), nextValue);
//       await set(ref(db, "firealarm/current/timestamp"), formatTime());
//       appendHistory("ACTION", `${nextValue ? "Bật" : "Tắt"} đèn cảnh báo`);
//     } catch (error) {
//       setLastError(error.message || "Không cập nhật được đèn cảnh báo");
//     }
//   };

//   const resetSystem = async () => {
//     try {
//       setBuzzer(false);
//       setWarningLight(false);
//       await Promise.all([
//         set(ref(db, "firealarm/current/buzzer"), false),
//         set(ref(db, "firealarm/current/warningLight"), false),
//         set(ref(db, "firealarm/current/timestamp"), formatTime()),
//       ]);
//       appendHistory("ACTION", "Người dùng reset cảnh báo");
//     } catch (error) {
//       setLastError(error.message || "Không reset được hệ thống");
//     }
//   };

//   const triggerEmergency = async () => {
//     try {
//       setBuzzer(true);
//       setWarningLight(true);
//       await Promise.all([
//         set(ref(db, "firealarm/current/smoke"), 650),
//         set(ref(db, "firealarm/current/buzzer"), true),
//         set(ref(db, "firealarm/current/warningLight"), true),
//         set(ref(db, "firealarm/current/timestamp"), formatTime()),
//       ]);
//       appendHistory("MANUAL", "Kích hoạt báo động thủ công");
//       setActivePage("alerts");
//     } catch (error) {
//       setLastError(error.message || "Không kích hoạt được báo động");
//     }
//   };

//   const menuItems = [
//     { id: "overview", label: "Tổng quan", icon: ActivityIcon },
//     { id: "sensors", label: "Cảm biến", icon: SmokeIcon },
//     { id: "alerts", label: "Cảnh báo", icon: AlertIcon, badge: systemStatus.level > 0 ? String(systemStatus.level) : "" },
//     { id: "history", label: "Lịch sử", icon: BellIcon },
//     { id: "settings", label: "Cài đặt", icon: SettingsIcon },
//   ];

//   const pageTitleMap = {
//     overview: "Tổng quan hệ thống",
//     sensors: "Theo dõi cảm biến khói",
//     alerts: "Điều phối cảnh báo",
//     history: "Nhật ký sự kiện",
//     settings: "Cấu hình vận hành",
//   };

//   const alertRows = history.filter((item) => item.type === "ALERT" || item.type === "MANUAL").slice(0, 6);

//   const renderPage = () => {
//     if (activePage === "sensors") {
//       return (
//         <SensorsPage
//           smokeValue={smokeValue}
//           batteryLevel={batteryLevel}
//           chartData={chartData}
//           setActivePage={setActivePage}
//         />
//       );
//     }

//     if (activePage === "alerts") {
//       return (
//         <AlertsPage
//           buzzer={buzzer}
//           warningLight={warningLight}
//           updateBuzzer={updateBuzzer}
//           updateWarningLight={updateWarningLight}
//           triggerEmergency={triggerEmergency}
//           resetSystem={resetSystem}
//           systemStatus={systemStatus}
//           alertRows={alertRows}
//           setActivePage={setActivePage}
//         />
//       );
//     }

//     if (activePage === "history") {
//       return <HistoryPage history={history} setActivePage={setActivePage} />;
//     }

//     if (activePage === "settings") {
//       return (
//         <SettingsPage
//           online={online}
//           lastUpdate={lastUpdate}
//           modeAuto={modeAuto}
//           updateAutoMode={updateAutoMode}
//           testsPassed={testsPassed}
//           setActivePage={setActivePage}
//         />
//       );
//     }

//     return (
//       <OverviewPage
//         systemStatus={systemStatus}
//         modeAuto={modeAuto}
//         lastUpdate={lastUpdate}
//         smokeValue={smokeValue}
//         batteryLevel={batteryLevel}
//         online={online}
//         setActivePage={setActivePage}
//         packetCount={packetCount}
//         lastError={lastError}
//       />
//     );
//   };

//   return (
//     <div className={styles.page}>
//       <div className={styles.shell}>
//         <div className={styles.layout}>
//           <aside className={`${styles.panel} ${styles.side}`}>
//             <div className="flex items-center gap-3">
//               <div className="rounded-2xl bg-red-100 p-3 text-red-600">
//                 <FlameIcon className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-slate-900">Fire Dashboard</h1>
//                 <p className="text-sm text-slate-500">Hệ thống báo khói thông minh</p>
//               </div>
//             </div>

//             <div className="my-5 h-px bg-slate-200" />

//             <nav className="space-y-2 text-sm">
//               {menuItems.map((item) => (
//                 <MenuButton
//                   key={item.id}
//                   active={activePage === item.id}
//                   icon={item.icon}
//                   label={item.label}
//                   badge={item.badge}
//                   onClick={() => setActivePage(item.id)}
//                 />
//               ))}
//             </nav>

//             <div className="my-5 h-px bg-slate-200" />

//             <div className="space-y-4">
//               <div className={`${styles.mutedCard} p-4`}>
//                 <div className="flex items-center justify-between gap-2">
//                   <p className="text-sm font-medium">Trang hiện tại</p>
//                   <Badge>{pageTitleMap[activePage]}</Badge>
//                 </div>
//                 <p className="mt-2 text-xs text-slate-500"> </p>
//               </div>

//               <div className={`${styles.mutedCard} p-4`}>
//                 <div className="flex items-center justify-between gap-2">
//                   <p className="text-sm font-medium">Mức cảnh báo</p>
//                   <Badge tone={systemStatus.tone}>{systemStatus.label}</Badge>
//                 </div>
//                 <p className="mt-2 text-xs text-slate-500">Level hiện tại: {systemStatus.level}</p>
//               </div>
//             </div>
//           </aside>

//           <main className={styles.main}>
//             <div className={`${styles.panel} ${styles.section}`}>
//               <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500">Giám sát thời gian thực</p>
//                   <h2 className="text-2xl font-bold text-slate-900">{pageTitleMap[activePage]}</h2>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-3">
//                   <Button variant="outline" onClick={() => setActivePage("overview")}>
//                     Tổng quan
//                   </Button>
//                   <Button variant="outline" onClick={() => setActivePage("sensors")}>
//                     Cảm biến
//                   </Button>
//                   <Button variant="outline" onClick={() => setActivePage("alerts")}>
//                     Cảnh báo
//                   </Button>
//                   <Button variant="outline" onClick={() => setActivePage("history")}>
//                     Lịch sử
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {renderPage()}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";

// ================================
// FIREBASE CONFIG
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyDCqENbA55iQQWUObM5UCV_29s80vb-39A",
  authDomain: "firealarm-77a2c.firebaseapp.com",
  databaseURL: "https://firealarm-77a2c-default-rtdb.firebaseio.com",
  projectId: "firealarm-77a2c",
  storageBucket: "firealarm-77a2c.firebasestorage.app",
  messagingSenderId: "617075055573",
  appId: "1:617075055573:web:3e584ba0a27d6274683b5c",
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ================================
// ICONS
// ================================
function IconWrap({ children }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-3">
      {children}
    </div>
  );
}

function FlameIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3s2 2.2 2 4.5c0 1.5-.7 2.5-1.4 3.3 2.6-.5 5.4 1.7 5.4 5 0 3.2-2.7 5.7-6 5.7s-6-2.5-6-5.7c0-2.7 1.6-4.3 3.3-5.8.9-.8 1.7-1.6 2.1-2.6.6-1.4.6-2.8.6-4.4Z" />
      <path d="M12 13.5c1.4 1 2.2 2 2.2 3.2A2.3 2.3 0 0 1 12 19a2.3 2.3 0 0 1-2.2-2.3c0-1.1.6-2 2.2-3.2Z" />
    </svg>
  );
}

function SmokeIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 16c-1.7 0-3-1.3-3-3s1.3-3 3-3c.3-2.6 2.5-4.5 5.2-4.5 2.3 0 4.3 1.3 5.1 3.3.4-.2.9-.3 1.4-.3 1.7 0 3.1 1.4 3.1 3.1S19.4 16 17.7 16H6Z" />
      <path d="M7 19c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
      <path d="M11 20c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
      <path d="M15 19c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
    </svg>
  );
}

function BellIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function LightIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1.1 1 1.8V18h6v-1.5c0-.7.4-1.4 1-1.8A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

function WifiIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12.5a11 11 0 0 1 14 0" />
      <path d="M8.5 16a6 6 0 0 1 7 0" />
      <path d="M12 20h.01" />
      <path d="M2 9a16 16 0 0 1 20 0" />
    </svg>
  );
}

function WifiOffIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 9a16 16 0 0 1 7-3.6" />
      <path d="M10.7 5.1A16 16 0 0 1 22 9" />
      <path d="M5 12.5a11 11 0 0 1 4.4-2.2" />
      <path d="M14.4 10.5a11 11 0 0 1 4.6 2" />
      <path d="M8.5 16a6 6 0 0 1 2.6-1.3" />
      <path d="M15.5 16A6 6 0 0 0 14 15.2" />
      <path d="M12 20h.01" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

function AlertIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.8 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function BatteryIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 10v4" />
      <path d="M6 10h8" />
    </svg>
  );
}

function SettingsIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="m4.9 19.1 1.4-1.4" />
      <path d="m17.7 6.3 1.4-1.4" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

// ================================
// HELPER
// ================================
const styles = {
  page: "min-h-screen bg-slate-100 p-4 md:p-6 text-slate-900",
  shell: "mx-auto max-w-7xl",
  panel: "rounded-3xl border border-slate-200 bg-white shadow-sm",
  card: "rounded-2xl border border-slate-200 bg-white shadow-sm",
  button:
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
};

const formatTime = (date = new Date()) =>
  date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const estimateEnergy = ({
  smoke = 0,
  online = true,
  buzzer = false,
  warningLight = false,
}) => {
  const controllerBase = online ? 0.55 : 0.2;
  const smokeSensorBase = 0.28;
  const smokeFactor = Math.max(0, smoke) * 0.002;
  const buzzerPower = buzzer ? 1.35 : 0;
  const warningLightPower = warningLight ? 0.45 : 0;

  return Number(
    (
      controllerBase +
      smokeSensorBase +
      smokeFactor +
      buzzerPower +
      warningLightPower
    ).toFixed(2)
  );
};

const getStatus = (smoke, alarmState, alarmRaw) => {
  if (alarmState === "ALARM ON" || alarmRaw === 1 || smoke >= 0.3) {
    return { label: "NGUY HIỂM", tone: "danger", level: 3 };
  }

  if (smoke >= 0.15) {
    return { label: "NGUY CƠ CHÁY", tone: "warning", level: 2 };
  }

  if (smoke >= 0.1) {
    return { label: "CẢNH BÁO SỚM", tone: "caution", level: 1 };
  }

  return { label: "AN TOÀN", tone: "safe", level: 0 };
};

const toneClasses = {
  safe: {
    card: "border-emerald-200 bg-emerald-50 text-emerald-700",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  caution: {
    card: "border-amber-200 bg-amber-50 text-amber-700",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  warning: {
    card: "border-orange-200 bg-orange-50 text-orange-700",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
  },
  danger: {
    card: "border-red-200 bg-red-50 text-red-700",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
  neutral: {
    card: "border-slate-200 bg-slate-50 text-slate-700",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
  },
};

const getBatteryTone = (battery) => {
  if (battery <= 20) return "danger";
  if (battery <= 50) return "warning";
  return "safe";
};

function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone].badge} ${className}`}
    >
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = "solid",
  className = "",
  type = "button",
  disabled = false,
}) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      aria-pressed={checked}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
        checked ? "bg-slate-900" : "bg-slate-300"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ProgressBar({ value }) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number.isFinite(value) ? value : 0)
  );

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-slate-900 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, tone = "neutral" }) {
  return (
    <div className={`${styles.card} ${toneClasses[tone].card} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs opacity-80">{subtitle}</p>
        </div>

        {Icon ? (
          <IconWrap>
            <Icon className="w-5 h-5" />
          </IconWrap>
        ) : null}
      </div>
    </div>
  );
}

function MiniLineChart({ data, dataKey, maxValue = 5 }) {
  const width = 760;
  const height = 240;
  const pad = 24;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const values = data.map((item) => Number(item[dataKey] ?? 0));
  const max = Math.max(maxValue, ...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const points = data.map((item, index) => {
    const value = Number(item[dataKey] ?? 0);
    const x = pad + (index * innerW) / Math.max(data.length - 1, 1);
    const y = pad + innerH - ((value - min) / range) * innerH;
    return [x, y];
  });

  const linePath = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L ${pad + innerW} ${pad + innerH} L ${pad} ${
    pad + innerH
  } Z`;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
        <rect x="0" y="0" width={width} height={height} fill="white" />

        {[0, 1, 2, 3].map((tick) => {
          const y = pad + (tick * innerH) / 3;
          return (
            <line
              key={tick}
              x1={pad}
              y1={y}
              x2={pad + innerW}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
          );
        })}

        <path d={areaPath} fill="rgba(124,45,18,0.08)" />
        <path
          d={linePath}
          fill="none"
          stroke="#7c2d12"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="3" fill="#7c2d12" />
        ))}

        {data.map((item, index) => {
          const x = pad + (index * innerW) / Math.max(data.length - 1, 1);
          return (
            <text
              key={index}
              x={x}
              y={height - 6}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
            >
              {item.time}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function SensorRow({ name, value, unit, status, percent, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{name}</p>
            <p className="text-xs text-slate-500">Trạng thái: {status}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">
            {value} {unit}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={percent} />
      </div>
    </div>
  );
}
>>>>>>> Stashed changes

// ================================
// MAIN APP
// ================================
export default function App() {
<<<<<<< Updated upstream
  const [activeSection, setActiveSection] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("fire-dashboard-theme") === "dark";
  });
  const [sourceMode, setSourceMode] = useState("sim");
  const [wsUrl, setWsUrl] = useState("ws://192.168.4.1/ws");
  const [wsState, setWsState] = useState("disconnected");
  const [lastError, setLastError] = useState("");
  const [packetCount, setPacketCount] = useState(0);
  const [lastPacketAt, setLastPacketAt] = useState(0);
  const [online, setOnline] = useState(true);
=======
  const [activePage, setActivePage] = useState("overview");

  const [packetCount, setPacketCount] = useState(0);
  const [lastError, setLastError] = useState("");

  const [online, setOnline] = useState(false);
>>>>>>> Stashed changes
  const [modeAuto, setModeAuto] = useState(true);
  const [buzzer, setBuzzer] = useState(false);
  const [warningLight, setWarningLight] = useState(false);

  const [smokeValue, setSmokeValue] = useState(0);
  const [smokeK, setSmokeK] = useState(0);
  const [adc, setAdc] = useState(0);
  const [alarmState, setAlarmState] = useState("UNKNOWN");
  const [alarmRaw, setAlarmRaw] = useState(0);

  const [batteryLevel, setBatteryLevel] = useState(100);
  const [lastUpdate, setLastUpdate] = useState(formatTime());
  const [deviceName, setDeviceName] = useState("Bao_khoi");
  const [devEui, setDevEui] = useState("");
  const [rssi, setRssi] = useState(null);
  const [snr, setSnr] = useState(null);

  const [history, setHistory] = useState([
    {
      time: formatTime(),
      type: "SYSTEM",
      detail: "Dashboard khởi động thành công",
    },
  ]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("fire-dashboard-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const appendHistory = (type, detail) => {
    setHistory((previous) => {
      const entry = { time: formatTime(), type, detail };
<<<<<<< Updated upstream
      if (previous[0]?.detail === detail && previous[0]?.type === type) return previous;
      return [entry, ...previous].slice(0, 10);
    });
  };

  const pushChartPoint = (nextTemp, nextSmoke, timeText) => {
    setChartData((previous) => [
      ...previous.slice(-11),
      { time: timeText || formatTime(new Date()).slice(0, 5), temperature: nextTemp, smoke: nextSmoke },
    ]);
  };
=======
      if (prev[0]?.detail === detail && prev[0]?.type === type) return prev;
      return [entry, ...prev].slice(0, 20);
    });
  };

  useEffect(() => {
    const currentRef = ref(db, "firealarm/current");
>>>>>>> Stashed changes

    const unsubscribe = onValue(
      currentRef,
      (snapshot) => {
        const value = snapshot.val();

        console.log("Firebase current:", value);

<<<<<<< Updated upstream
    const nextTemp = normalized.temperature ?? temperatureRef.current;
    const nextSmoke = normalized.smoke ?? smokeRef.current;

    if (typeof normalized.temperature === "number") setTemperature(normalized.temperature);
    if (typeof normalized.smoke === "number") setSmokeValue(normalized.smoke);
    if (typeof normalized.flame === "boolean") setFlameDetected(normalized.flame);
    if (typeof normalized.buzzer === "boolean") setBuzzer(normalized.buzzer);
    if (typeof normalized.warningLight === "boolean") setWarningLight(normalized.warningLight);
    if (typeof normalized.online === "boolean") setOnline(normalized.online);
    if (normalized.mode === "manual") setModeAuto(false);
    if (normalized.mode === "auto") setModeAuto(true);

    setLastUpdate(normalized.timestamp || formatTime());
    setPacketCount((previous) => previous + 1);
    setLastPacketAt(Date.now());
    pushChartPoint(nextTemp, nextSmoke, formatTime(new Date()).slice(0, 5));
    return true;
  };

  const closeSocket = () => {
    if (!wsRef.current) return;
    wsRef.current.onopen = null;
    wsRef.current.onmessage = null;
    wsRef.current.onerror = null;
    wsRef.current.onclose = null;
    wsRef.current.close();
    wsRef.current = null;
  };

  const connectWebSocket = () => {
    if (typeof window === "undefined" || typeof window.WebSocket === "undefined") {
      setLastError("Trình duyệt này không hỗ trợ WebSocket.");
      setWsState("error");
      return;
    }

    try {
      closeSocket();
      setLastError("");
      setWsState("connecting");
      setSourceMode("live");

      const socket = new WebSocket(wsUrl.trim());
      wsRef.current = socket;
      socket.onopen = () => {
        setWsState("connected");
        setOnline(true);
        setLastPacketAt(Date.now());
        appendHistory("NETWORK", `Đã kết nối WebSocket tới ${wsUrl.trim()}`);
      };
      socket.onmessage = (event) => {
        if (!applyIncomingData(event.data)) setLastError("Có gói tin không đúng định dạng JSON telemetry.");
      };
      socket.onerror = () => {
        setWsState("error");
        setLastError("Không thể kết nối tới endpoint WebSocket.");
      };
      socket.onclose = () => {
        setWsState("disconnected");
        setOnline(false);
        appendHistory("NETWORK", "WebSocket đã ngắt kết nối");
      };
    } catch (error) {
      setWsState("error");
      setLastError(error?.message || "Lỗi tạo kết nối WebSocket.");
    }
  };
=======
        if (!value) {
          setOnline(false);
          setLastError("Chưa có dữ liệu tại firealarm/current");
          return;
        }

        const nextSmoke = Number(
          value.smoke_dbm ??
            value.smoke_dbm ??
            value.smoke_dBm ??
            value.smoke_DBM ??
            0
        );

        const nextSmokeK = Number(value.smoke_k ?? 0);
        const nextAdc = Number(value.adc ?? 0);
        const nextAlarmRaw = Number(value.alarm_raw ?? 0);
>>>>>>> Stashed changes

        const nextAlarmState =
          value.alarm_state ??
          (nextAlarmRaw === 1 ? "ALARM ON" : "ALARM OFF");

<<<<<<< Updated upstream
  useEffect(() => {
    if (sourceMode !== "sim") return undefined;
    const interval = setInterval(() => {
      setTemperature((previous) => Math.max(24, Math.min(75, previous + Math.floor(Math.random() * 5) - 2)));
      setSmokeValue((previous) => Math.max(50, Math.min(800, previous + Math.floor(Math.random() * 70) - 25)));
      setFlameDetected((previous) => {
        if (manualEmergency) return true;
        const chance = Math.random();
        if (chance > 0.96) return true;
        if (chance < 0.86) return false;
        return previous;
      });
      setOnline(true);
      setLastUpdate(formatTime());
    }, 2200);
    return () => clearInterval(interval);
  }, [manualEmergency, sourceMode]);

  useEffect(() => {
    if (sourceMode !== "live") return undefined;
    const interval = setInterval(() => {
      if (lastPacketAt && Date.now() - lastPacketAt > 8000) setOnline(false);
    }, 2000);
    return () => clearInterval(interval);
  }, [lastPacketAt, sourceMode]);

  useEffect(() => {
    if (sourceMode !== "sim") return undefined;
    const timeout = setTimeout(() => {
      pushChartPoint(temperature, smokeValue, formatTime(new Date()).slice(0, 5));
      const status = getStatus({ temperature, smoke: smokeValue, flame: flameDetected || manualEmergency });

      if (status.level >= 2) {
        setBuzzer(true);
        setWarningLight(true);
      }
      if (status.level === 1 && modeAuto) setWarningLight(true);
      if (status.level === 0 && modeAuto && !manualEmergency) {
        setBuzzer(false);
        setWarningLight(false);
      }
      if (status.level > 0) {
        const details = {
          1: `Cảnh báo sớm: Temp ${temperature}°C, Smoke ${smokeValue} ppm`,
          2: `Nguy cơ cháy: Temp ${temperature}°C, Smoke ${smokeValue} ppm`,
          3: flameDetected || manualEmergency ? "Cháy xác nhận: phát hiện lửa hoặc kích hoạt khẩn cấp" : `Mức nguy hiểm cao: Temp ${temperature}°C, Smoke ${smokeValue} ppm`,
        };
        appendHistory("ALERT", details[status.level]);
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [temperature, smokeValue, flameDetected, manualEmergency, modeAuto, sourceMode]);

  useEffect(() => () => closeSocket(), []);
=======
        const nextBuzzer = !!value.buzzer;
        const nextLight = !!value.warningLight;
        const nextOnline = value.online !== undefined ? !!value.online : true;
        const nextBattery = Number(value.battery ?? 100);
        const nextModeAuto = (value.mode ?? "auto") === "auto";
        const nextTimestamp = value.timestamp ?? formatTime();

        const nextEnergy = Number(
          value.energy ??
            estimateEnergy({
              smoke: nextSmoke,
              online: nextOnline,
              buzzer: nextBuzzer,
              warningLight: nextLight,
            })
        );

        setSmokeValue(nextSmoke);
        setSmokeK(nextSmokeK);
        setAdc(nextAdc);
        setAlarmState(nextAlarmState);
        setAlarmRaw(nextAlarmRaw);

        setBuzzer(nextBuzzer);
        setWarningLight(nextLight);
        setOnline(nextOnline);
        setBatteryLevel(nextBattery);
        setModeAuto(nextModeAuto);
        setLastUpdate(nextTimestamp);

        setDeviceName(value.deviceName ?? "Bao_khoi");
        setDevEui(value.devEui ?? "");
        setRssi(value.rssi ?? null);
        setSnr(value.snr ?? null);

        setChartData((prev) => [
          ...prev.slice(-11),
          {
            time: formatTime(new Date()).slice(0, 5),
            smoke: nextSmoke,
            energy: nextEnergy,
            buzzer: nextBuzzer,
            warningLight: nextLight,
          },
        ]);

        setPacketCount((prev) => prev + 1);

        const status = getStatus(nextSmoke, nextAlarmState, nextAlarmRaw);

        if (status.level > 0) {
          appendHistory(
            "ALERT",
            `${nextAlarmState}: Khói ${nextSmoke} dB/m, ADC ${nextAdc}`
          );
        }

        setLastError("");
      },
      (error) => {
        console.error("Firebase read error:", error);
        setLastError(error.message || "Không đọc được dữ liệu từ Firebase");
      }
    );

    return () => unsubscribe();
  }, []);
>>>>>>> Stashed changes

  const systemStatus = useMemo(
    () => getStatus(smokeValue, alarmState, alarmRaw),
    [smokeValue, alarmState, alarmRaw]
  );

  const latestEnergy = chartData[chartData.length - 1]?.energy ?? 0;

  const updateAutoMode = async (nextValue) => {
    try {
      setModeAuto(nextValue);
      await set(ref(db, "firealarm/current/mode"), nextValue ? "auto" : "manual");
      await set(ref(db, "firealarm/current/timestamp"), formatTime());
      appendHistory("ACTION", `Chuyển chế độ sang ${nextValue ? "AUTO" : "MANUAL"}`);
    } catch (error) {
      setLastError(error.message || "Không cập nhật được mode");
    }
  };
<<<<<<< Updated upstream
  const updateBuzzer = (nextValue) => {
    setBuzzer(nextValue);
    safeSend({ cmd: "set_buzzer", value: nextValue ? 1 : 0 });
    appendHistory("ACTION", `${nextValue ? "Bật" : "Tắt"} còi cảnh báo`);
  };
  const updateWarningLight = (nextValue) => {
    setWarningLight(nextValue);
    safeSend({ cmd: "set_light", value: nextValue ? 1 : 0 });
    appendHistory("ACTION", `${nextValue ? "Bật" : "Tắt"} đèn cảnh báo`);
  };
  const resetSystem = () => {
    setManualEmergency(false);
    setFlameDetected(false);
    setBuzzer(false);
    setWarningLight(false);
    safeSend({ cmd: "reset_alarm" });
    appendHistory("ACTION", "Người dùng reset cảnh báo");
  };
  const triggerEmergency = () => {
    setManualEmergency(true);
    setBuzzer(true);
    setWarningLight(true);
    safeSend({ cmd: "manual_alarm", value: 1 });
    appendHistory("MANUAL", "Kích hoạt báo động thủ công");
  };

  const headerProps = {
    styles,
    systemStatus,
    modeAuto,
    lastUpdate,
    isDarkMode,
    onToggleTheme: () => setIsDarkMode((previous) => !previous),
  };
  const controlProps = {
    styles,
    temperature,
    smokeValue,
    flameDetected,
    manualEmergency,
    buzzer,
    warningLight,
    onBuzzerChange: updateBuzzer,
    onWarningLightChange: updateWarningLight,
    onTriggerEmergency: triggerEmergency,
    onReset: resetSystem,
  };

  let sectionContent;
  if (activeSection === "sensors") {
    sectionContent = <>
      <DashboardHeader {...headerProps} title="Theo dõi cảm biến" subtitle="Nhiệt độ, khói và phát hiện lửa" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]"><TrendCharts styles={styles} chartData={chartData} /><SensorMonitor {...controlProps} /></div>
    </>;
  } else if (activeSection === "alerts") {
    sectionContent = <>
      <DashboardHeader {...headerProps} title="Trung tâm cảnh báo" subtitle="Theo dõi sự cố và điều khiển phản ứng" />
      <AlertSummary styles={styles} systemStatus={systemStatus} flameDetected={flameDetected} manualEmergency={manualEmergency} buzzer={buzzer} warningLight={warningLight} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]"><AlertHistory styles={styles} history={history} /><ActuatorControls {...controlProps} /></div>
    </>;
  } else if (activeSection === "history") {
    sectionContent = <AlertLogPage styles={styles} history={history} />;
  } else if (activeSection === "camera") {
    sectionContent = <>
      <DashboardHeader {...headerProps} title="Camera AI" subtitle="Giám sát hình ảnh và phát hiện sự cố bằng trí tuệ nhân tạo" />
      <CameraAiPanel styles={styles} />
    </>;
  } else if (activeSection === "settings") {
    sectionContent = <>
      <DashboardHeader {...headerProps} title="Cài đặt hệ thống" subtitle="Quản lý kết nối, nguồn dữ liệu và chế độ vận hành" />
      <SettingsPanel styles={styles} online={online} lastUpdate={lastUpdate} modeAuto={modeAuto} onModeAutoChange={updateAutoMode} sourceMode={sourceMode} wsState={wsState} wsUrl={wsUrl} testsPassed={testsPassed} />
    </>;
  } else {
    sectionContent = <>
      <DashboardHeader {...headerProps} />
      <ConnectionPanel styles={styles} wsUrl={wsUrl} onWsUrlChange={setWsUrl} wsState={wsState} onConnect={connectWebSocket} onDisconnect={disconnectWebSocket} sourceMode={sourceMode} packetCount={packetCount} lastError={lastError} />
      <OverviewCards systemStatus={systemStatus} temperature={temperature} smokeValue={smokeValue} online={online} sourceMode={sourceMode} wsState={wsState} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]"><TrendCharts styles={styles} chartData={chartData} /><SystemControls {...controlProps} /></div>
      <AlertHistory styles={styles} history={history} />
    </>;
  }

  return <div className={styles.page}><div className={styles.shell}><div className={styles.layout}>
    <DashboardSidebar styles={styles} activeSection={activeSection} onSectionChange={setActiveSection} />
    <main className={styles.main} key={activeSection}>{sectionContent}</main>
  </div></div></div>;
}
=======

  const updateBuzzer = async (nextValue) => {
    try {
      setBuzzer(nextValue);
      await set(ref(db, "firealarm/current/buzzer"), nextValue);
      await set(ref(db, "firealarm/current/timestamp"), formatTime());
      appendHistory("ACTION", `${nextValue ? "Bật" : "Tắt"} còi cảnh báo`);
    } catch (error) {
      setLastError(error.message || "Không cập nhật được buzzer");
    }
  };

  const updateWarningLight = async (nextValue) => {
    try {
      setWarningLight(nextValue);
      await set(ref(db, "firealarm/current/warningLight"), nextValue);
      await set(ref(db, "firealarm/current/timestamp"), formatTime());
      appendHistory("ACTION", `${nextValue ? "Bật" : "Tắt"} đèn cảnh báo`);
    } catch (error) {
      setLastError(error.message || "Không cập nhật được đèn cảnh báo");
    }
  };

  const resetSystem = async () => {
    try {
      setBuzzer(false);
      setWarningLight(false);

      await Promise.all([
        set(ref(db, "firealarm/current/buzzer"), false),
        set(ref(db, "firealarm/current/warningLight"), false),
        set(ref(db, "firealarm/current/manualAlarm"), false),
        set(ref(db, "firealarm/current/timestamp"), formatTime()),
      ]);

      appendHistory("ACTION", "Người dùng reset cảnh báo");
    } catch (error) {
      setLastError(error.message || "Không reset được hệ thống");
    }
  };

  const triggerEmergency = async () => {
    try {
      setBuzzer(true);
      setWarningLight(true);

      await Promise.all([
        set(ref(db, "firealarm/current/buzzer"), true),
        set(ref(db, "firealarm/current/warningLight"), true),
        set(ref(db, "firealarm/current/manualAlarm"), true),
        set(ref(db, "firealarm/current/timestamp"), formatTime()),
      ]);

      appendHistory("MANUAL", "Kích hoạt báo động thủ công");
      setActivePage("alerts");
    } catch (error) {
      setLastError(error.message || "Không kích hoạt được báo động");
    }
  };

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: FlameIcon },
    { id: "sensors", label: "Cảm biến", icon: SmokeIcon },
    { id: "alerts", label: "Cảnh báo", icon: AlertIcon },
    { id: "history", label: "Lịch sử", icon: BellIcon },
    { id: "settings", label: "Cài đặt", icon: SettingsIcon },
  ];

  const pageTitleMap = {
    overview: "Tổng quan hệ thống",
    sensors: "Theo dõi cảm biến khói",
    alerts: "Điều phối cảnh báo",
    history: "Nhật ký sự kiện",
    settings: "Cấu hình vận hành",
  };

  const renderOverview = () => (
    <>
      <div className={`${styles.panel} p-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">
              Dashboard hệ thống cảnh báo khói
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Đọc realtime từ Firebase tại path{" "}
              <span className="font-semibold">firealarm/current</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge tone={systemStatus.tone} className="px-4 py-2 text-sm">
              {systemStatus.label}
            </Badge>
            <Badge className="px-4 py-2 text-sm">
              {modeAuto ? "AUTO" : "MANUAL"}
            </Badge>
            <Badge className="px-4 py-2 text-sm">{lastUpdate}</Badge>
          </div>
        </div>

        {lastError ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {lastError}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Trạng thái hệ thống"
          value={systemStatus.label}
          subtitle={`Mức cảnh báo: ${systemStatus.level}`}
          icon={systemStatus.level >= 2 ? AlertIcon : FlameIcon}
          tone={systemStatus.tone}
        />

        <StatCard
          title="Nồng độ khói"
          value={`${smokeValue} dB/m`}
          subtitle={`ADC: ${adc}`}
          icon={SmokeIcon}
          tone={systemStatus.tone}
        />

        <StatCard
          title="Pin thiết bị"
          value={`${batteryLevel}%`}
          subtitle={
            batteryLevel <= 20
              ? "Pin yếu"
              : batteryLevel <= 50
              ? "Pin trung bình"
              : "Pin ổn định"
          }
          icon={BatteryIcon}
          tone={getBatteryTone(batteryLevel)}
        />

        <StatCard
          title="Thiết bị / mạng"
          value={online ? "ONLINE" : "OFFLINE"}
          subtitle={`Packets: ${packetCount}`}
          icon={online ? WifiIcon : WifiOffIcon}
          tone={online ? "safe" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className={`${styles.panel} p-5`}>
          <h3 className="text-base font-semibold">Biểu đồ nồng độ khói</h3>
          <p className="mt-1 text-sm text-slate-500">
            Đơn vị hiển thị: dB/m.
          </p>

          <div className="mt-4">
            {chartData.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Chưa có dữ liệu biểu đồ.
              </div>
            ) : (
              <MiniLineChart data={chartData} dataKey="smoke" maxValue={5} />
            )}
          </div>
        </div>

        <div className={`${styles.panel} p-5`}>
          <h3 className="text-base font-semibold">Thông tin thiết bị</h3>

          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-500">Tên thiết bị</p>
              <p className="mt-1 font-bold">{deviceName}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-500">DevEUI</p>
              <p className="mt-1 break-all font-bold">{devEui || "Chưa có"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-500">RSSI</p>
                <p className="mt-1 font-bold">{rssi ?? "N/A"} dBm</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-500">SNR</p>
                <p className="mt-1 font-bold">{snr ?? "N/A"} dB</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-500">Trạng thái từ node</p>
              <p className="mt-1 font-bold">{alarmState}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderSensors = () => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
      <div className={`${styles.panel} p-5`}>
        <h3 className="text-base font-semibold">Biểu đồ cảm biến khói</h3>
        <p className="mt-1 text-sm text-slate-500">
          Theo dõi biến động khói realtime.
        </p>

        <div className="mt-4">
          {chartData.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Chưa có dữ liệu.
            </div>
          ) : (
            <MiniLineChart data={chartData} dataKey="smoke" maxValue={5} />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className={`${styles.panel} p-5`}>
          <h3 className="text-base font-semibold">Giám sát cảm biến</h3>

          <div className="mt-4 space-y-4">
            <SensorRow
              name="Cảm biến khói"
              value={smokeValue}
              unit="dB/m"
              status={systemStatus.label}
              percent={Math.min((smokeValue / 5) * 100, 100)}
              icon={SmokeIcon}
            />

            <SensorRow
              name="ADC"
              value={adc}
              unit=""
              status="Giá trị analog"
              percent={Math.min((adc / 4095) * 100, 100)}
              icon={SmokeIcon}
            />

            <SensorRow
              name="Pin thiết bị"
              value={batteryLevel}
              unit="%"
              status={
                batteryLevel <= 20
                  ? "Pin yếu"
                  : batteryLevel <= 50
                  ? "Trung bình"
                  : "Tốt"
              }
              percent={batteryLevel}
              icon={BatteryIcon}
            />
          </div>
        </div>

        <div className={`${styles.panel} p-5`}>
          <h3 className="text-base font-semibold">Thông số phụ</h3>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Hệ số k</p>
              <p className="mt-1 text-2xl font-bold">{smokeK}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Alarm raw</p>
              <p className="mt-1 text-2xl font-bold">{alarmRaw}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Công suất ước tính</p>
              <p className="mt-1 text-2xl font-bold">{latestEnergy} W</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
      <div className={`${styles.panel} p-5`}>
        <h3 className="text-base font-semibold">Điều khiển cảnh báo</h3>
        <p className="mt-1 text-sm text-slate-500">
          Các lệnh này ghi vào Firebase tại firealarm/current.
        </p>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <BellIcon className="w-5 h-5 text-slate-700" />
              <div>
                <p className="font-medium">Còi cảnh báo</p>
                <p className="text-xs text-slate-500">Field: buzzer</p>
              </div>
            </div>
            <Toggle checked={buzzer} onChange={updateBuzzer} />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <LightIcon className="w-5 h-5 text-slate-700" />
              <div>
                <p className="font-medium">Đèn cảnh báo</p>
                <p className="text-xs text-slate-500">Field: warningLight</p>
              </div>
            </div>
            <Toggle checked={warningLight} onChange={updateWarningLight} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button className="h-12" onClick={triggerEmergency}>
              Báo động khẩn cấp
            </Button>

            <Button variant="outline" className="h-12" onClick={resetSystem}>
              Reset cảnh báo
            </Button>
          </div>
        </div>
      </div>

      <div className={`${styles.panel} p-5`}>
        <h3 className="text-base font-semibold">Trạng thái hiện tại</h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Còi</p>
            <p className="mt-1 text-xl font-bold">{buzzer ? "ON" : "OFF"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Đèn</p>
            <p className="mt-1 text-xl font-bold">
              {warningLight ? "ON" : "OFF"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Mức nguy cơ</p>
            <p className="mt-1 text-xl font-bold">{systemStatus.level}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Alarm state</p>
            <p className="mt-1 text-xl font-bold">{alarmState}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className={`${styles.panel} p-5`}>
      <h3 className="text-base font-semibold">Lịch sử cảnh báo gần nhất</h3>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-[120px_120px_minmax(0,1fr)] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <div>Thời gian</div>
          <div>Loại</div>
          <div>Chi tiết</div>
        </div>

        {history.map((item, idx) => (
          <div
            key={`${item.time}-${idx}`}
            className="grid grid-cols-[120px_120px_minmax(0,1fr)] border-t border-slate-200 bg-white px-4 py-3 text-sm"
          >
            <div className="text-slate-600">{item.time}</div>
            <div>
              <Badge
                tone={
                  item.type === "ALERT" || item.type === "MANUAL"
                    ? "danger"
                    : "neutral"
                }
              >
                {item.type}
              </Badge>
            </div>
            <div className="text-slate-800">{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
      <div className={`${styles.panel} p-5`}>
        <h3 className="text-base font-semibold">Cấu hình kết nối</h3>

        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Nguồn dữ liệu</p>
              <Badge tone="safe">FIREBASE LIVE</Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Path đọc dữ liệu: firealarm/current
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Kết nối thiết bị</p>
              <Badge tone={online ? "safe" : "neutral"}>
                {online ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Cập nhật cuối: {lastUpdate}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Chế độ tự động</p>
              <Toggle checked={modeAuto} onChange={updateAutoMode} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {modeAuto
                ? "Hệ thống tự xử lý cảnh báo"
                : "Điều khiển thủ công"}
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.panel} p-5`}>
        <h3 className="text-base font-semibold">Debug Firebase</h3>

        <pre className="mt-4 max-h-[380px] overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100">
{JSON.stringify(
  {
    path: "firealarm/current",
    deviceName,
    devEui,
    smoke: smokeValue,
    smoke_k: smokeK,
    adc,
    alarm_state: alarmState,
    alarm_raw: alarmRaw,
    battery: batteryLevel,
    online,
    buzzer,
    warningLight,
    rssi,
    snr,
    lastUpdate,
  },
  null,
  2
)}
        </pre>
      </div>
    </div>
  );

  const renderPage = () => {
    if (activePage === "sensors") return renderSensors();
    if (activePage === "alerts") return renderAlerts();
    if (activePage === "history") return renderHistory();
    if (activePage === "settings") return renderSettings();
    return renderOverview();
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`${styles.panel} p-5`}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-red-100 p-3 text-red-600">
                <FlameIcon className="w-6 h-6" />
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Fire Dashboard
                </h1>
                <p className="text-sm text-slate-500">
                  Hệ thống báo khói LoRaWAN
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-slate-200" />

            <nav className="space-y-2 text-sm">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                      activePage === item.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>

                    {item.id === "alerts" && systemStatus.level > 0 ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          activePage === item.id
                            ? "bg-white/15 text-white"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {systemStatus.level}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="my-5 h-px bg-slate-200" />

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Trạng thái</p>
                  <Badge tone={systemStatus.tone}>{systemStatus.label}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Smoke: {smokeValue} dB/m
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Kết nối</p>
                  <Badge tone={online ? "safe" : "neutral"}>
                    {online ? "ONLINE" : "OFFLINE"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Packets: {packetCount}
                </p>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className={`${styles.panel} p-5`}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Giám sát thời gian thực
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {pageTitleMap[activePage]}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" onClick={() => setActivePage("overview")}>
                    Tổng quan
                  </Button>
                  <Button variant="outline" onClick={() => setActivePage("sensors")}>
                    Cảm biến
                  </Button>
                  <Button variant="outline" onClick={() => setActivePage("alerts")}>
                    Cảnh báo
                  </Button>
                  <Button variant="outline" onClick={() => setActivePage("history")}>
                    Lịch sử
                  </Button>
                </div>
              </div>
            </div>

            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
>>>>>>> Stashed changes
