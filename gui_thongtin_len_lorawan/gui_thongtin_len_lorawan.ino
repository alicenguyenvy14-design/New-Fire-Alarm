// =====================================================
// RAK3172 - SMOKE SENSOR + ALARM + LORAWAN JSON
// JSON gui:
// {"adc":583,"v":0.427,"smoke":65.0,"overTh":1,"alarm":0,"silence":0,"wait":38}
// =====================================================

// ================== PIN MAP ==================
#define SMOKE_ADC_PIN     PB2
#define IR_EMIT_PIN       PA10
#define BUZZER_PIN        PA8
#define STATUS_LED_PIN    PA9
#define TEST_BUTTON_PIN   PA1
#define IC13_PIN          PA15

// ================== LORAWAN OTAA ==================
// SUA LAI THEO CHIRPSTACK / TTN CUA BAN
uint8_t nodeDeviceEUI[8] = { 0xAC, 0x1F, 0x09, 0xFF, 0xFE, 0x13, 0x98, 0xAB };
uint8_t nodeAppEUI[8]    = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
uint8_t nodeAppKey[16]   = { 0xBB, 0xD8, 0x16, 0x44, 0x30, 0xAC, 0x2F, 0x10,
                             0xDC, 0x2C, 0x7C, 0x39, 0x12, 0xC7, 0x70, 0x56 };

// ================== THAM SO CAM BIEN ==================
int adcClean = 180;                  // ADC moi truong sach
int adcMaxSmoke = 800;               // ADC khoi dam dac
float smokeThresholdPercent = 30.0;  // Nguong bat bao dong
float smokeThresholdOffPercent = 25.0; // Nguong tat bao dong

const int adcSamples = 20;
const unsigned long sensorUpdateIntervalMs = 100UL;
const unsigned long smokeWarmupMs = 15000UL;
const float smokeFilterAlpha = 0.15;

// Dung 3.0V vi log cua ban cho thay 583 -> 0.427V
const float adcReferenceVoltage = 3.0;

// ================== THAM SO SILENCE / TEST ==================
const unsigned long silenceDurationMs = 60000UL;  // tat coi 60s
const unsigned long testAlarmDurationMs = 5000UL; // test coi 5s

// ================== THAM SO GUI LORA ==================
const unsigned long loraSendIntervalMs = 30000UL;
const uint8_t loraFPort = 2;

// ================== THAM SO LED / COI ==================
const unsigned long statusBlinkIntervalMs = 30000UL;
const unsigned long statusBlinkOnTimeMs = 120UL;
const unsigned long fastBlinkIntervalMs = 300UL;
bool blinkFastWhenAlarm = true;

// ================== THAM SO COI ==================
const unsigned int buzzerFreqHz = 4000;
const unsigned int buzzerDutyPercent = 50;
const bool buzzerActiveHigh = true;

// ================== BIEN HE THONG ==================
int adcValue = 0;
float sensorVoltage = 0.0;
float smokePercentRaw = 0.0;
float smokePercentFiltered = 0.0;
float smokePercent = 0.0;

bool overThreshold = false;
bool alarmState = false;     // trang thai coi dang keu hay khong
bool buzzerState = false;    // gui len payload
bool smokeSensorReady = false;

// silence / test
bool silenceMode = false;
bool testMode = false;
unsigned long silenceEndMs = 0;
unsigned long testEndMs = 0;
int waitSeconds = 0;

// button
bool lastButtonReading = HIGH;
bool buttonStableState = HIGH;
unsigned long lastDebounceMs = 0;
const unsigned long debounceDelayMs = 40;

// time
unsigned long smokeStartMs = 0;
unsigned long lastSensorReadMs = 0;
unsigned long lastLoraSendMs = 0;
unsigned long lastStatusBlinkMs = 0;
unsigned long statusLedTurnOffMs = 0;
unsigned long lastFastBlinkMs = 0;

bool statusLedPulseActive = false;
bool fastBlinkState = false;

// ================== BIEN PWM MEM CHO COI ==================
bool buzzerEnable = false;
bool buzzerOutputState = false;
unsigned long lastBuzzerToggleUs = 0;

// ================== KHAI BAO HAM ==================
int readSmokeAverage(int samples);
float convertADCToSmokePercent(int adc);
float lowPassFilter(float prevValue, float newValue, float alpha);

void irEmitterOn(void);
void irEmitterOff(void);

void alarmOn(void);
void alarmOff(void);

void buzzerPwmStart(void);
void buzzerPwmStop(void);
void buzzerPwmUpdate(void);

void updateStatusLed(void);
void printSystemState(void);

bool joinLoRaWAN(void);
void sendSmokeStatusJson(void);

void updateButtonLogic(void);
bool buttonPressedEvent(void);
void updateAlarmLogic(void);
void updateWaitSeconds(void);

// =====================================================
// SETUP
// =====================================================
void setup()
{
  Serial.begin(115200);
  delay(1000);

  pinMode(IR_EMIT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(IC13_PIN, OUTPUT);
  pinMode(TEST_BUTTON_PIN, INPUT_PULLUP);

  analogReadResolution(12);

  digitalWrite(IC13_PIN, LOW);
  digitalWrite(STATUS_LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, buzzerActiveHigh ? LOW : HIGH);

  irEmitterOff();
  delay(50);
  irEmitterOn();

  smokeStartMs = millis();

  Serial.println("======================================");
  Serial.println("RAK3172 SMOKE SENSOR + LORAWAN JSON");
  Serial.println("======================================");
  Serial.println("Dang warm-up cam bien khoi...");

  // Cau hinh LoRaWAN RUI3
  api.lorawan.deui.set(nodeDeviceEUI, 8);
  api.lorawan.appeui.set(nodeAppEUI, 8);
  api.lorawan.appkey.set(nodeAppKey, 16);

  api.lorawan.band.set(9);        // AS923-2
  api.lorawan.njm.set(1);         // OTAA
  api.lorawan.deviceClass.set(0); // Class A
  api.lorawan.adr.set(true);

  joinLoRaWAN();
}

// =====================================================
// LOOP
// =====================================================
void loop()
{
  unsigned long now = millis();

  updateButtonLogic();

  // Warm-up cam bien
  if (!smokeSensorReady)
  {
    if (now - smokeStartMs >= smokeWarmupMs)
    {
      smokeSensorReady = true;
      Serial.println("Cam bien khoi da san sang.");
    }
    else
    {
      updateStatusLed();
      buzzerPwmUpdate();
      return;
    }
  }

  // Doc cam bien
  if (now - lastSensorReadMs >= sensorUpdateIntervalMs)
  {
    lastSensorReadMs = now;

    adcValue = readSmokeAverage(adcSamples);
    sensorVoltage = ((float)adcValue * adcReferenceVoltage) / 4095.0;

    smokePercentRaw = convertADCToSmokePercent(adcValue);
    smokePercentFiltered = lowPassFilter(smokePercentFiltered, smokePercentRaw, smokeFilterAlpha);
    smokePercent = smokePercentFiltered;

    overThreshold = (smokePercent >= smokeThresholdPercent);

    updateAlarmLogic();
    updateWaitSeconds();
    printSystemState();
  }

  // Gui LoRa dinh ky
  if (now - lastLoraSendMs >= loraSendIntervalMs)
  {
    lastLoraSendMs = now;

    if (api.lorawan.njs.get() == 1)
    {
      sendSmokeStatusJson();
    }
    else
    {
      Serial.println("Chua join mang, thu join lai...");
      joinLoRaWAN();
    }
  }

  updateStatusLed();
  buzzerPwmUpdate();
}

// =====================================================
// BUTTON / DEBOUNCE
// =====================================================
void updateButtonLogic(void)
{
  bool reading = digitalRead(TEST_BUTTON_PIN);
  unsigned long now = millis();

  if (reading != lastButtonReading)
  {
    lastDebounceMs = now;
  }

  if ((now - lastDebounceMs) > debounceDelayMs)
  {
    if (reading != buttonStableState)
    {
      buttonStableState = reading;

      // Nhan nut
      if (buttonStableState == LOW)
      {
        if (overThreshold || alarmState)
        {
          // Dang bao dong -> silence
          silenceMode = true;
          silenceEndMs = now + silenceDurationMs;
          testMode = false;
          Serial.println("Silence mode ON");
        }
        else
        {
          // Khong bao dong -> test coi
          testMode = true;
          testEndMs = now + testAlarmDurationMs;
          silenceMode = false;
          Serial.println("Test mode ON");
        }
      }
    }
  }

  lastButtonReading = reading;
}

// =====================================================
// LOGIC BAO DONG
// =====================================================
void updateAlarmLogic(void)
{
  unsigned long now = millis();

  // Het test mode
  if (testMode && now >= testEndMs)
  {
    testMode = false;
  }

  // Het silence mode
  if (silenceMode && now >= silenceEndMs)
  {
    silenceMode = false;
    Serial.println("Silence mode OFF");
  }

  // Hysteresis cho muc vuot nguong
  static bool thresholdLatched = false;

  if (!thresholdLatched && smokePercent >= smokeThresholdPercent)
  {
    thresholdLatched = true;
  }
  else if (thresholdLatched && smokePercent <= smokeThresholdOffPercent)
  {
    thresholdLatched = false;
    silenceMode = false; // reset silence khi da het khoi
  }

  overThreshold = thresholdLatched;

  // Alarm logic
  if (testMode)
  {
    alarmState = true;
  }
  else if (overThreshold && !silenceMode)
  {
    alarmState = true;
  }
  else
  {
    alarmState = false;
  }

  if (alarmState)
    alarmOn();
  else
    alarmOff();
}

// =====================================================
// DOI THOI GIAN CHO
// =====================================================
void updateWaitSeconds(void)
{
  long remainMs = 0;

  if (silenceMode)
  {
    remainMs = (long)(silenceEndMs - millis());
  }
  else if (testMode)
  {
    remainMs = (long)(testEndMs - millis());
  }
  else
  {
    remainMs = 0;
  }

  if (remainMs < 0) remainMs = 0;
  waitSeconds = (int)(remainMs / 1000);
}

// =====================================================
// JOIN LORAWAN
// =====================================================
bool joinLoRaWAN(void)
{
  Serial.println("Dang join LoRaWAN...");
  api.lorawan.join();

  int retryCount = 0;
  while (api.lorawan.njs.get() == 0 && retryCount < 30)
  {
    Serial.println("Dang cho join...");
    delay(2000);
    retryCount++;
  }

  if (api.lorawan.njs.get() == 1)
  {
    Serial.println("Join LoRaWAN thanh cong!");
    return true;
  }
  else
  {
    Serial.println("Join LoRaWAN that bai!");
    return false;
  }
}

// =====================================================
// GUI JSON LEN GATEWAY
// =====================================================
// void sendSmokeStatusJson(void)
// {
//   char payload[160];

//   snprintf(payload, sizeof(payload),
//            "{\"adc\":%d,\"v\":%.3f,\"smoke\":%.1f,\"overTh\":%d,\"alarm\":%d,\"silence\":%d,\"wait\":%d}",
//            adcValue,
//            sensorVoltage,
//            smokePercent,
//            overThreshold ? 1 : 0,
//            alarmState ? 1 : 0,
//            silenceMode ? 1 : 0,
//            waitSeconds);

//   Serial.print("JSON gui: ");
//   Serial.println(payload);

//   bool sendResult = api.lorawan.send(strlen(payload), (uint8_t *)payload, loraFPort, false, 1);

//   if (sendResult)
//   {
//     Serial.println("Gui JSON qua LoRa thanh cong!");
//   }
//   else
//   {
//     Serial.println("Gui JSON qua LoRa that bai!");
//   }
// }

void sendSmokeStatusJson(void)
{
  char payload[96];

  snprintf(payload, sizeof(payload),
           "{\"a\":%d,\"v\":%.3f,\"s\":%.1f,\"o\":%d,\"al\":%d,\"si\":%d,\"w\":%d}",
           adcValue,
           sensorVoltage,
           smokePercent,
           overThreshold ? 1 : 0,
           alarmState ? 1 : 0,
           silenceMode ? 1 : 0,
           waitSeconds);

  Serial.print("JSON gui: ");
  Serial.println(payload);

  bool sendResult = api.lorawan.send(strlen(payload), (uint8_t *)payload, loraFPort, false, 1);

  if (sendResult)
  {
    Serial.println("Gui JSON qua LoRa thanh cong!");
  }
  else
  {
    Serial.println("Gui JSON qua LoRa that bai!");
  }
}

// =====================================================
// DOC ADC TRUNG BINH
// =====================================================
int readSmokeAverage(int samples)
{
  long sum = 0;

  for (int i = 0; i < samples; i++)
  {
    sum += analogRead(SMOKE_ADC_PIN);
    delay(2);
  }

  return (int)(sum / samples);
}

// =====================================================
// DOI ADC -> % KHOI
// =====================================================
float convertADCToSmokePercent(int adc)
{
  if (adcMaxSmoke == adcClean)
    return 0.0;

  float percent = (adc - adcClean) * 100.0 / (adcMaxSmoke - adcClean);

  if (percent < 0.0) percent = 0.0;
  if (percent > 100.0) percent = 100.0;

  return percent;
}

// =====================================================
// LOC MEM
// =====================================================
float lowPassFilter(float prevValue, float newValue, float alpha)
{
  return prevValue + alpha * (newValue - prevValue);
}

// =====================================================
// DIEU KHIEN IR
// =====================================================
void irEmitterOn(void)
{
  // Mach hien tai active-low
  digitalWrite(IR_EMIT_PIN, LOW);
}

void irEmitterOff(void)
{
  digitalWrite(IR_EMIT_PIN, HIGH);
}

// =====================================================
// PWM MEM CHO COI
// =====================================================
void buzzerPwmStart(void)
{
  buzzerEnable = true;
  buzzerState = true;
}

void buzzerPwmStop(void)
{
  buzzerEnable = false;
  buzzerOutputState = false;
  buzzerState = false;
  digitalWrite(BUZZER_PIN, buzzerActiveHigh ? LOW : HIGH);
}

void buzzerPwmUpdate(void)
{
  if (!buzzerEnable) return;

  const unsigned long periodUs = 1000000UL / buzzerFreqHz;
  const unsigned long highUs = (periodUs * buzzerDutyPercent) / 100;
  const unsigned long lowUs  = periodUs - highUs;

  unsigned long nowUs = micros();
  unsigned long intervalUs = buzzerOutputState ? highUs : lowUs;

  if (nowUs - lastBuzzerToggleUs >= intervalUs)
  {
    lastBuzzerToggleUs = nowUs;
    buzzerOutputState = !buzzerOutputState;

    if (buzzerActiveHigh)
      digitalWrite(BUZZER_PIN, buzzerOutputState ? HIGH : LOW);
    else
      digitalWrite(BUZZER_PIN, buzzerOutputState ? LOW : HIGH);
  }
}

// =====================================================
// BAO DONG
// =====================================================
void alarmOn(void)
{
  buzzerPwmStart();
  digitalWrite(IC13_PIN, HIGH);
}

void alarmOff(void)
{
  buzzerPwmStop();
  digitalWrite(IC13_PIN, LOW);
}

// =====================================================
// LED TRANG THAI
// =====================================================
void updateStatusLed(void)
{
  unsigned long now = millis();

  if (alarmState && blinkFastWhenAlarm)
  {
    if (now - lastFastBlinkMs >= fastBlinkIntervalMs)
    {
      lastFastBlinkMs = now;
      fastBlinkState = !fastBlinkState;
      digitalWrite(STATUS_LED_PIN, fastBlinkState);
    }
    return;
  }

  if (!statusLedPulseActive && (now - lastStatusBlinkMs >= statusBlinkIntervalMs))
  {
    lastStatusBlinkMs = now;
    statusLedTurnOffMs = now + statusBlinkOnTimeMs;
    statusLedPulseActive = true;
    digitalWrite(STATUS_LED_PIN, HIGH);
  }

  if (statusLedPulseActive && now >= statusLedTurnOffMs)
  {
    statusLedPulseActive = false;
    digitalWrite(STATUS_LED_PIN, LOW);
  }
}

// =====================================================
// SERIAL DEBUG
// =====================================================
void printSystemState(void)
{
  Serial.print("ADC=");
  Serial.print(adcValue);

  Serial.print(" | V=");
  Serial.print(sensorVoltage, 3);
  Serial.print("V");

  Serial.print(" | Smoke=");
  Serial.print(smokePercent, 1);
  Serial.print("%");

  Serial.print(" | OverTh=");
  Serial.print(overThreshold ? "YES" : "NO");

  Serial.print(" | Alarm=");
  Serial.print(alarmState ? "ON" : "OFF");

  Serial.print(" | Silence=");
  Serial.print(silenceMode ? "ON" : "OFF");

  Serial.print(" | Wait=");
  Serial.print(waitSeconds);
  Serial.println("s");
}