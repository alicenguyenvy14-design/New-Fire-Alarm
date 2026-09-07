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

export default function App() {
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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("fire-dashboard-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const appendHistory = (type, detail) => {
    setHistory((previous) => {
      const entry = { time: formatTime(), type, detail };
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
