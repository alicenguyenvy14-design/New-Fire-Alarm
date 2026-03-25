import React, { useEffect, useMemo, useRef, useState } from "react";

function FlameIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3s2 2.2 2 4.5c0 1.5-.7 2.5-1.4 3.3 2.6-.5 5.4 1.7 5.4 5 0 3.2-2.7 5.7-6 5.7s-6-2.5-6-5.7c0-2.7 1.6-4.3 3.3-5.8.9-.8 1.7-1.6 2.1-2.6.6-1.4.6-2.8.6-4.4Z" />
      <path d="M12 13.5c1.4 1 2.2 2 2.2 3.2A2.3 2.3 0 0 1 12 19a2.3 2.3 0 0 1-2.2-2.3c0-1.1.6-2 2.2-3.2Z" />
    </svg>
  );
}

function SmokeIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 16c-1.7 0-3-1.3-3-3s1.3-3 3-3c.3-2.6 2.5-4.5 5.2-4.5 2.3 0 4.3 1.3 5.1 3.3.4-.2.9-.3 1.4-.3 1.7 0 3.1 1.4 3.1 3.1S19.4 16 17.7 16H6Z" />
      <path d="M7 19c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
      <path d="M11 20c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
      <path d="M15 19c1 0 1.5-.5 1.5-1.4 0-1.2-1.2-1.4-1.2-2.6 0-.6.3-1 .8-1.4" />
    </svg>
  );
}

function ThermometerIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z" />
      <path d="M12 9v7" />
    </svg>
  );
}

function BellIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function LightIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1.1 1 1.8V18h6v-1.5c0-.7.4-1.4 1-1.8A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

function ShieldIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3l7 3v5c0 5-3.4 8.9-7 10-3.6-1.1-7-5-7-10V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7L14.8 10" />
    </svg>
  );
}

function WifiIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12.5a11 11 0 0 1 14 0" />
      <path d="M8.5 16a6 6 0 0 1 7 0" />
      <path d="M12 20h.01" />
      <path d="M2 9a16 16 0 0 1 20 0" />
    </svg>
  );
}

function WifiOffIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.8 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function ActivityIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}

function SettingsIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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

function PowerIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2v10" />
      <path d="M6.2 5.8A8 8 0 1 0 17.8 5.8" />
    </svg>
  );
}

const styles = {
  page: "min-h-screen bg-slate-100 p-4 md:p-6 text-slate-900",
  shell: "mx-auto max-w-7xl",
  layout: "grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]",
  panel: "rounded-3xl border border-slate-200 bg-white shadow-sm",
  side: "p-5",
  main: "space-y-6",
  section: "p-5",
  card: "rounded-2xl border border-slate-200 bg-white shadow-sm",
  mutedCard: "rounded-2xl border border-slate-200 bg-slate-50",
  badge: "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
  button: "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
  input: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500",
};

const formatTime = (date = new Date()) =>
  date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const getStatus = ({ temperature, smoke, flame }) => {
  if (flame || temperature >= 60 || smoke >= 600) {
    return { label: "NGUY HIỂM", tone: "danger", level: 3 };
  }
  if ((temperature >= 50 && smoke >= 350) || smoke >= 500) {
    return { label: "NGUY CƠ CHÁY", tone: "warning", level: 2 };
  }
  if (temperature >= 40 || smoke >= 250) {
    return { label: "CẢNH BÁO SỚM", tone: "caution", level: 1 };
  }
  return { label: "AN TOÀN", tone: "safe", level: 0 };
};

function parseBooleanLike(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "on", "yes", "online", "auto"].includes(normalized)) return true;
    if (["0", "false", "off", "no", "offline", "manual"].includes(normalized)) return false;
  }
  return null;
}

function normalizeIncomingData(payload) {
  let raw = payload;

  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!raw || typeof raw !== "object") return null;
  if (raw.data && typeof raw.data === "object") raw = raw.data;

  const toNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const normalized = {};

  const temperature = toNumber(raw.temperature ?? raw.temp ?? raw.t);
  const smoke = toNumber(raw.smoke ?? raw.smokeValue ?? raw.mq2 ?? raw.s);
  const flame = parseBooleanLike(raw.flame ?? raw.fire ?? raw.f);
  const buzzer = parseBooleanLike(raw.buzzer ?? raw.alarm ?? raw.bz);
  const warningLight = parseBooleanLike(raw.warningLight ?? raw.light ?? raw.led ?? raw.l);
  const online = parseBooleanLike(raw.online ?? raw.connected ?? raw.net);

  if (temperature !== null) normalized.temperature = Math.max(0, Math.min(200, temperature));
  if (smoke !== null) normalized.smoke = Math.max(0, Math.min(5000, smoke));
  if (flame !== null) normalized.flame = flame;
  if (buzzer !== null) normalized.buzzer = buzzer;
  if (warningLight !== null) normalized.warningLight = warningLight;
  if (online !== null) normalized.online = online;

  if (typeof raw.mode === "string") normalized.mode = raw.mode.toLowerCase() === "manual" ? "manual" : "auto";
  if (typeof raw.timestamp === "string" && raw.timestamp.trim()) normalized.timestamp = raw.timestamp.trim();

  return Object.keys(normalized).length > 0 ? normalized : null;
}

function runLogicTests() {
  const statusCases = [
    { input: { temperature: 30, smoke: 100, flame: false }, expected: 0 },
    { input: { temperature: 42, smoke: 100, flame: false }, expected: 1 },
    { input: { temperature: 35, smoke: 260, flame: false }, expected: 1 },
    { input: { temperature: 52, smoke: 360, flame: false }, expected: 2 },
    { input: { temperature: 45, smoke: 510, flame: false }, expected: 2 },
    { input: { temperature: 61, smoke: 150, flame: false }, expected: 3 },
    { input: { temperature: 31, smoke: 620, flame: false }, expected: 3 },
    { input: { temperature: 31, smoke: 120, flame: true }, expected: 3 },
  ];

  const parseCases = [
    {
      input: '{"temperature":36.5,"smoke":280,"flame":0,"online":1}',
      expected: { temperature: 36.5, smoke: 280, flame: false, online: true },
    },
    {
      input: { data: { temp: "41", mq2: "333", fire: "true", led: 1 } },
      expected: { temperature: 41, smoke: 333, flame: true, warningLight: true },
    },
    {
      input: { mode: "manual", connected: "offline" },
      expected: { mode: "manual", online: false },
    },
    {
      input: "not-json",
      expected: null,
    },
  ];

  const statusPassed = statusCases.every((testCase) => getStatus(testCase.input).level === testCase.expected);
  const parsePassed = parseCases.every((testCase) => {
    const actual = normalizeIncomingData(testCase.input);
    return JSON.stringify(actual) === JSON.stringify(testCase.expected);
  });

  return statusPassed && parsePassed;
}

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

const initialHistory = [
  { time: formatTime(), type: "SYSTEM", detail: "Hệ thống khởi động thành công" },
  { time: formatTime(), type: "NETWORK", detail: "Chế độ mặc định đang là mô phỏng" },
];

const seedData = Array.from({ length: 12 }).map((_, i) => ({
  time: `10:${String(i * 2).padStart(2, "0")}`,
  temperature: 30 + Math.round(Math.random() * 5),
  smoke: 120 + Math.round(Math.random() * 50),
}));

function Badge({ children, tone = "neutral", className = "" }) {
  return <span className={`${styles.badge} ${toneClasses[tone].badge} ${className}`}>{children}</span>;
}

function Button({ children, onClick, variant = "solid", className = "", type = "button", disabled = false }) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${styles.button} ${variantClass} ${className}`}>
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
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${checked ? "bg-slate-900" : "bg-slate-300"} ${disabled ? "opacity-50" : ""}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function ProgressBar({ value }) {
  const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}

function MiniLineChart({ data, dataKey, maxValue, stroke = "#0f172a", fill = "rgba(15,23,42,0.08)" }) {
  const width = 760;
  const height = 240;
  const pad = 24;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const values = data.map((item) => item[dataKey]);
  const max = Math.max(maxValue || 0, ...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const points = data.map((item, index) => {
    const x = pad + (index * innerW) / Math.max(data.length - 1, 1);
    const y = pad + innerH - ((item[dataKey] - min) / range) * innerH;
    return [x, y];
  });

  const linePath = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${pad + innerW} ${pad + innerH} L ${pad} ${pad + innerH} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
        <rect x="0" y="0" width={width} height={height} fill="white" />
        {[0, 1, 2, 3].map((tick) => {
          const y = pad + (tick * innerH) / 3;
          return <line key={tick} x1={pad} y1={y} x2={pad + innerW} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />;
        })}
        <path d={areaPath} fill={fill} />
        <path d={linePath} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="3" fill={stroke} />
        ))}
        {data.map((item, index) => {
          const x = pad + (index * innerW) / Math.max(data.length - 1, 1);
          return (
            <text key={index} x={x} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748b">
              {item.time}
            </text>
          );
        })}
      </svg>
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
        <div className="rounded-2xl border border-white/60 bg-white/70 p-3">
          <Icon className="w-5 h-5" />
        </div>
      </div>
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

export default function App() {
  const [sourceMode, setSourceMode] = useState("sim");
  const [wsUrl, setWsUrl] = useState("ws://192.168.4.1/ws");
  const [wsState, setWsState] = useState("disconnected");
  const [lastError, setLastError] = useState("");
  const [packetCount, setPacketCount] = useState(0);
  const [lastPacketAt, setLastPacketAt] = useState(0);

  const [online, setOnline] = useState(true);
  const [modeAuto, setModeAuto] = useState(true);
  const [buzzer, setBuzzer] = useState(false);
  const [warningLight, setWarningLight] = useState(false);
  const [manualEmergency, setManualEmergency] = useState(false);
  const [temperature, setTemperature] = useState(33);
  const [smokeValue, setSmokeValue] = useState(160);
  const [flameDetected, setFlameDetected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(formatTime());
  const [history, setHistory] = useState(initialHistory);
  const [chartData, setChartData] = useState(seedData);
  const [testsPassed] = useState(() => runLogicTests());

  const wsRef = useRef(null);
  const temperatureRef = useRef(temperature);
  const smokeRef = useRef(smokeValue);

  useEffect(() => {
    temperatureRef.current = temperature;
    smokeRef.current = smokeValue;
  }, [temperature, smokeValue]);

  const appendHistory = (type, detail) => {
    setHistory((prev) => {
      const entry = { time: formatTime(), type, detail };
      if (prev[0]?.detail === detail && prev[0]?.type === type) return prev;
      return [entry, ...prev].slice(0, 10);
    });
  };

  const pushChartPoint = (nextTemp, nextSmoke, timeText) => {
    setChartData((prev) => [
      ...prev.slice(-11),
      {
        time: timeText || formatTime(new Date()).slice(0, 5),
        temperature: nextTemp,
        smoke: nextSmoke,
      },
    ]);
  };

  const safeSend = (payload) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;
    wsRef.current.send(JSON.stringify(payload));
    return true;
  };

  const applyIncomingData = (payload) => {
    const normalized = normalizeIncomingData(payload);
    if (!normalized) return false;

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

    const uiTime = normalized.timestamp || formatTime();
    setLastUpdate(uiTime);
    setPacketCount((prev) => prev + 1);
    setLastPacketAt(Date.now());
    pushChartPoint(nextTemp, nextSmoke, formatTime(new Date()).slice(0, 5));

    return true;
  };

  const closeSocket = () => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
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
        const ok = applyIncomingData(event.data);
        if (!ok) {
          setLastError("Có gói tin không đúng định dạng JSON telemetry.");
        }
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

  const disconnectWebSocket = () => {
    closeSocket();
    setWsState("disconnected");
    setSourceMode("sim");
    setOnline(true);
    appendHistory("NETWORK", "Chuyển về chế độ mô phỏng");
  };

  useEffect(() => {
    if (sourceMode !== "sim") return undefined;

    const interval = setInterval(() => {
      setTemperature((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(24, Math.min(75, prev + delta));
      });

      setSmokeValue((prev) => {
        const delta = Math.floor(Math.random() * 70) - 25;
        return Math.max(50, Math.min(800, prev + delta));
      });

      setFlameDetected((prev) => {
        if (manualEmergency) return true;
        const chance = Math.random();
        if (chance > 0.96) return true;
        if (chance < 0.86) return false;
        return prev;
      });

      setOnline(true);
      setLastUpdate(formatTime());
    }, 2200);

    return () => clearInterval(interval);
  }, [manualEmergency, sourceMode]);

  useEffect(() => {
    if (sourceMode !== "live") return undefined;

    const interval = setInterval(() => {
      if (lastPacketAt && Date.now() - lastPacketAt > 8000) {
        setOnline(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [lastPacketAt, sourceMode]);

  useEffect(() => {
    if (sourceMode !== "sim") return undefined;

    const point = {
      time: formatTime(new Date()).slice(0, 5),
      temperature,
      smoke: smokeValue,
    };

    setChartData((prev) => [...prev.slice(-11), point]);

    const status = getStatus({
      temperature,
      smoke: smokeValue,
      flame: flameDetected || manualEmergency,
    });

    if (status.level >= 2) {
      setBuzzer(true);
      setWarningLight(true);
    }

    if (status.level === 1 && modeAuto) {
      setWarningLight(true);
    }

    if (status.level === 0 && modeAuto && !manualEmergency) {
      setBuzzer(false);
      setWarningLight(false);
    }

    if (status.level > 0) {
      const detailMap = {
        1: `Cảnh báo sớm: Temp ${temperature}°C, Smoke ${smokeValue} ppm`,
        2: `Nguy cơ cháy: Temp ${temperature}°C, Smoke ${smokeValue} ppm`,
        3:
          flameDetected || manualEmergency
            ? "Cháy xác nhận: phát hiện lửa hoặc kích hoạt khẩn cấp"
            : `Mức nguy hiểm cao: Temp ${temperature}°C, Smoke ${smokeValue} ppm`,
      };
      appendHistory("ALERT", detailMap[status.level]);
    }
  }, [temperature, smokeValue, flameDetected, manualEmergency, modeAuto, sourceMode]);

  useEffect(() => () => closeSocket(), []);

  const systemStatus = useMemo(
    () => getStatus({ temperature, smoke: smokeValue, flame: flameDetected || manualEmergency }),
    [temperature, smokeValue, flameDetected, manualEmergency]
  );

  const updateAutoMode = (nextValue) => {
    setModeAuto(nextValue);
    safeSend({ cmd: "set_mode", mode: nextValue ? "auto" : "manual" });
    appendHistory("ACTION", `Chuyển chế độ sang ${nextValue ? "AUTO" : "MANUAL"}`);
  };

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

  const menuItems = [
    ["Tổng quan", ActivityIcon],
    ["Cảm biến", ThermometerIcon],
    ["Cảnh báo", AlertIcon],
    ["Lịch sử", BellIcon],
    ["Cài đặt", SettingsIcon],
  ];

  const sourceBadgeTone =
    sourceMode === "live" ? (wsState === "connected" ? "safe" : wsState === "connecting" ? "caution" : "neutral") : "neutral";

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.layout}>
          <aside className={`${styles.panel} ${styles.side}`}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-red-100 p-3 text-red-600">
                <FlameIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Fire Dashboard</h1>
                <p className="text-sm text-slate-500">Hệ thống báo cháy thông minh</p>
              </div>
            </div>

            <div className="my-5 h-px bg-slate-200" />

            <nav className="space-y-2 text-sm">
              {menuItems.map(([label, Icon], idx) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                    idx === 0 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              ))}
            </nav>

            <div className="my-5 h-px bg-slate-200" />

            <div className="space-y-4">
              <div className={`${styles.mutedCard} p-4`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Kết nối thiết bị</p>
                  <Badge tone={online ? "safe" : "neutral"}>{online ? "Online" : "Offline"}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">Cập nhật cuối: {lastUpdate}</p>
              </div>

              <div className={`${styles.mutedCard} p-4`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Chế độ tự động</p>
                  <Toggle checked={modeAuto} onChange={updateAutoMode} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {modeAuto ? "Hệ thống tự xử lý cảnh báo" : "Điều khiển thủ công"}
                </p>
              </div>

              <div className={`${styles.mutedCard} p-4`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Nguồn dữ liệu</p>
                  <Badge tone={sourceBadgeTone}>{sourceMode === "live" ? wsState.toUpperCase() : "SIM"}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">{sourceMode === "live" ? wsUrl : "Đang dùng dữ liệu mô phỏng"}</p>
              </div>

              <div className={`${styles.mutedCard} p-4`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Kiểm tra logic</p>
                  <Badge tone={testsPassed ? "safe" : "danger"}>{testsPassed ? "PASS" : "FAIL"}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">12 self-check cho phân loại cảnh báo và parser telemetry</p>
              </div>
            </div>
          </aside>

          <main className={styles.main}>
            <div className={`${styles.panel} ${styles.section}`}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Giám sát thời gian thực</p>
                  <h2 className="text-2xl font-bold text-slate-900">Dashboard hệ thống cảnh báo cháy</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={systemStatus.tone} className="px-4 py-2 text-sm">
                    {systemStatus.label}
                  </Badge>
                  <Badge className="px-4 py-2 text-sm">{modeAuto ? "AUTO" : "MANUAL"}</Badge>
                  <Badge className="px-4 py-2 text-sm">{lastUpdate}</Badge>
                </div>
              </div>
            </div>

            <div className={`${styles.panel} ${styles.section}`}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold">Kết nối ESP8266 / ESP32 qua Wi-Fi</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Dashboard nhận telemetry qua WebSocket. STM32 gửi UART sang ESP, ESP bridge dữ liệu ra Web.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                    <input
                      value={wsUrl}
                      onChange={(e) => setWsUrl(e.target.value)}
                      className={styles.input}
                      placeholder="ws://192.168.4.1/ws"
                    />
                    <Button onClick={connectWebSocket} disabled={wsState === "connecting"}>
                      {wsState === "connected" ? "Kết nối lại" : wsState === "connecting" ? "Đang kết nối" : "Kết nối Live"}
                    </Button>
                    <Button variant="outline" onClick={disconnectWebSocket}>
                      Ngắt / về mô phỏng
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>Packets: {packetCount}</span>
                    <span>Mode: {sourceMode === "live" ? "Live WebSocket" : "Simulation"}</span>
                    <span>Socket: {wsState}</span>
                  </div>
                  {lastError ? <p className="mt-3 text-sm text-red-600">{lastError}</p> : null}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 xl:max-w-sm">
                  <p className="font-semibold text-slate-800">JSON telemetry mẫu</p>
                  <code className="mt-2 block whitespace-pre-wrap break-all text-xs">
                    {`{"temperature":36.5,"smoke":220,"flame":0,"buzzer":0,"warningLight":0,"online":1,"mode":"auto"}`}
                  </code>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Trạng thái hệ thống"
                value={systemStatus.label}
                subtitle={`Mức cảnh báo: ${systemStatus.level}`}
                icon={systemStatus.level >= 2 ? AlertIcon : ShieldIcon}
                tone={systemStatus.tone}
              />
              <StatCard
                title="Nhiệt độ hiện tại"
                value={`${temperature}°C`}
                subtitle="Ngưỡng cảnh báo từ 40°C"
                icon={ThermometerIcon}
                tone={temperature >= 50 ? "warning" : temperature >= 40 ? "caution" : "safe"}
              />
              <StatCard
                title="Mức khói"
                value={`${smokeValue} ppm`}
                subtitle="Ngưỡng cảnh báo từ 250 ppm"
                icon={SmokeIcon}
                tone={smokeValue >= 500 ? "warning" : smokeValue >= 250 ? "caution" : "safe"}
              />
              <StatCard
                title="Thiết bị / mạng"
                value={online ? "ONLINE" : "OFFLINE"}
                subtitle={sourceMode === "live" ? `Socket: ${wsState}` : "Chế độ mô phỏng"}
                icon={online ? WifiIcon : WifiOffIcon}
                tone={online ? "safe" : "neutral"}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
              <div className="space-y-6">
                <div className={`${styles.panel} ${styles.section}`}>
                  <h3 className="text-base font-semibold">Biểu đồ nhiệt độ theo thời gian</h3>
                  <div className="mt-4">
                    <MiniLineChart data={chartData} dataKey="temperature" maxValue={80} />
                  </div>
                </div>

                <div className={`${styles.panel} ${styles.section}`}>
                  <h3 className="text-base font-semibold">Biểu đồ nồng độ khói</h3>
                  <div className="mt-4">
                    <MiniLineChart data={chartData} dataKey="smoke" maxValue={800} stroke="#7c2d12" fill="rgba(124,45,18,0.08)" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`${styles.panel} ${styles.section}`}>
                  <h3 className="text-base font-semibold">Giám sát cảm biến</h3>
                  <div className="mt-4 space-y-4">
                    <SensorRow
                      name="Cảm biến nhiệt độ"
                      value={temperature}
                      unit="°C"
                      status={temperature >= 50 ? "Nguy hiểm" : temperature >= 40 ? "Cảnh báo" : "Bình thường"}
                      percent={Math.min((temperature / 80) * 100, 100)}
                      icon={ThermometerIcon}
                    />
                    <SensorRow
                      name="Cảm biến khói"
                      value={smokeValue}
                      unit="ppm"
                      status={smokeValue >= 500 ? "Nguy hiểm" : smokeValue >= 250 ? "Cảnh báo" : "Bình thường"}
                      percent={Math.min((smokeValue / 800) * 100, 100)}
                      icon={SmokeIcon}
                    />
                    <SensorRow
                      name="Cảm biến lửa"
                      value={flameDetected || manualEmergency ? "YES" : "NO"}
                      unit=""
                      status={flameDetected || manualEmergency ? "Phát hiện lửa" : "Chưa phát hiện"}
                      percent={flameDetected || manualEmergency ? 100 : 10}
                      icon={FlameIcon}
                    />
                  </div>
                </div>

                <div className={`${styles.panel} ${styles.section}`}>
                  <h3 className="text-base font-semibold">Điều khiển hệ thống</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-3">
                        <BellIcon className="w-5 h-5 text-slate-700" />
                        <div>
                          <p className="font-medium">Còi cảnh báo</p>
                          <p className="text-xs text-slate-500">Gửi lệnh qua WebSocket nếu đang live</p>
                        </div>
                      </div>
                      <Toggle checked={buzzer} onChange={updateBuzzer} />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-3">
                        <LightIcon className="w-5 h-5 text-slate-700" />
                        <div>
                          <p className="font-medium">Đèn cảnh báo</p>
                          <p className="text-xs text-slate-500">Gửi lệnh qua WebSocket nếu đang live</p>
                        </div>
                      </div>
                      <Toggle checked={warningLight} onChange={updateWarningLight} />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Button className="h-12" onClick={triggerEmergency}>
                        <PowerIcon className="w-4 h-4" />
                        Báo động khẩn cấp
                      </Button>
                      <Button variant="outline" className="h-12" onClick={resetSystem}>
                        Reset cảnh báo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className={`${styles.panel} ${styles.section}`}>
                  <h3 className="text-base font-semibold">Trạng thái chấp hành</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Còi</p>
                      <p className="mt-1 text-xl font-bold">{buzzer ? "ON" : "OFF"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Đèn</p>
                      <p className="mt-1 text-xl font-bold">{warningLight ? "ON" : "OFF"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.panel} ${styles.section}`}>
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
                      <Badge>{item.type}</Badge>
                    </div>
                    <div className="text-slate-800">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}