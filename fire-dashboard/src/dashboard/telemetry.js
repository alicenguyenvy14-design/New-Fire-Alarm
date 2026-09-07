export const formatTime = (date = new Date()) =>
  date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const getStatus = ({ temperature, smoke, flame }) => {
  if (flame || temperature >= 60 || smoke >= 600) return { label: "NGUY HIỂM", tone: "danger", level: 3 };
  if ((temperature >= 50 && smoke >= 350) || smoke >= 500) return { label: "NGUY CƠ CHÁY", tone: "warning", level: 2 };
  if (temperature >= 40 || smoke >= 250) return { label: "CẢNH BÁO SỚM", tone: "caution", level: 1 };
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

export function normalizeIncomingData(payload) {
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

export function runLogicTests() {
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
    { input: { mode: "manual", connected: "offline" }, expected: { mode: "manual", online: false } },
    { input: "not-json", expected: null },
  ];

  return (
    statusCases.every((testCase) => getStatus(testCase.input).level === testCase.expected) &&
    parseCases.every((testCase) => JSON.stringify(normalizeIncomingData(testCase.input)) === JSON.stringify(testCase.expected))
  );
}

export const initialHistory = [
  { time: formatTime(), type: "SYSTEM", detail: "Hệ thống khởi động thành công" },
  { time: formatTime(), type: "NETWORK", detail: "Chế độ mặc định đang là mô phỏng" },
];

export const seedData = Array.from({ length: 12 }).map((_, index) => ({
  time: `10:${String(index * 2).padStart(2, "0")}`,
  temperature: 30 + Math.round(Math.random() * 5),
  smoke: 120 + Math.round(Math.random() * 50),
}));
