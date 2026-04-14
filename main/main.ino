#include <Arduino.h>

// ================== RAK3172 PIN MAP ==================
#define SMOKE_ADC_PIN     PB2
#define IR_EMIT_PIN       PA10
#define BUZZER_PIN        PA8
#define STATUS_LED_PIN    PA9
#define TEST_BUTTON_PIN   PA1
#define IC13_PIN          PA15

// ================== LORAWAN OTAA KEYS ==================
uint8_t nodeDeviceEUI[8] = { 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00 };
uint8_t nodeAppEUI[8]    = { 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00 };
uint8_t nodeAppKey[16]   = { 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
                             0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00 };

// ================== THAM SO TOI UU PIN ==================
const uint32_t sleepIntervalMs = 15000;
const int adcSamples = 10;
int smokeAdcThreshold = 650;

const uint8_t smokeConfirmCount = 4;
const uint32_t reAlarmSendMs = 300000UL;

const uint32_t buttonLongPressMs = 2000UL;
const uint32_t buttonDebounceMs  = 50UL;

// ===== THAM SO COI PWM =====
const unsigned int buzzerFreqHz = 4000;
const unsigned int buzzerDutyPercent = 50;
const bool buzzerActiveHigh = true;

// ===== DEBUG =====
const bool enableDebugSerial = false;

// ================== BIEN ==================
int adcValue = 0;
bool smokeDetected = false;
bool alarmState = false;
bool silenceMode = false;

uint8_t smokeCount = 0;
bool joined = false;
uint32_t lastAlarmSendMs = 0;

// ===== BIEN NUT =====
bool buttonLastStableState = HIGH;
bool buttonLastReading = HIGH;
uint32_t buttonLastChangeMs = 0;
uint32_t buttonPressedStartMs = 0;
bool buttonLongPressHandled = false;

// ===== BIEN PWM COI =====
bool buzzerEnable = false;
bool buzzerOutputState = false;
uint32_t lastBuzzerToggleUs = 0;

// ================== HAM ==================
int readSmokeAverage(int samples);
void irEmitterOn(void);
void irEmitterOff(void);

void buzzerPwmStart(void);
void buzzerPwmStop(void);
void buzzerPwmUpdate(void);

void alarmOn(void);
void alarmOff(void);

void updateButton(void);
void enterSleep(void);
void restorePinsAfterWake(void);
void printSystemState(void);

bool setupLoRaWAN(void);
bool ensureJoin(void);
bool sendAlarmPacket(uint16_t adc, uint8_t confirmCount);

// ================== SETUP ==================
void setup()
{
  pinMode(IR_EMIT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(IC13_PIN, OUTPUT);
  pinMode(TEST_BUTTON_PIN, INPUT_PULLUP);
  analogReadResolution(12);

  digitalWrite(IR_EMIT_PIN, HIGH);
  digitalWrite(BUZZER_PIN, buzzerActiveHigh ? LOW : HIGH);
  digitalWrite(STATUS_LED_PIN, LOW);
  digitalWrite(IC13_PIN, LOW);

  api.system.lpm.set(1);

  if (enableDebugSerial)
  {
    Serial.begin(115200);
    delay(200);
    Serial.println("=== SMOKE ALARM LOW POWER ===");
  }

  setupLoRaWAN();
}

// ================== LOOP ==================
void loop()
{
  // sau moi lan wake, khoi phuc cac chan can dung lai
  restorePinsAfterWake();

  updateButton();

  irEmitterOn();
  delay(15);
  adcValue = readSmokeAverage(adcSamples);
  irEmitterOff();

  smokeDetected = (adcValue >= smokeAdcThreshold);

  if (smokeDetected)
  {
    if (smokeCount < 255) smokeCount++;
  }
  else
  {
    smokeCount = 0;
    alarmState = false;
    silenceMode = false;
  }

  if (smokeCount >= smokeConfirmCount)
  {
    alarmState = true;
  }

  if (alarmState)
  {
    if (!silenceMode)
    {
      alarmOn();
      digitalWrite(STATUS_LED_PIN, HIGH);
      digitalWrite(IC13_PIN, HIGH);
    }
    else
    {
      alarmOff();
      digitalWrite(STATUS_LED_PIN, LOW);
      digitalWrite(IC13_PIN, LOW);
    }

    if (lastAlarmSendMs == 0)
    {
      if (ensureJoin())
      {
        sendAlarmPacket((uint16_t)adcValue, smokeCount);
      }
      lastAlarmSendMs = millis();
    }
    else if (millis() - lastAlarmSendMs >= reAlarmSendMs)
    {
      if (ensureJoin())
      {
        sendAlarmPacket((uint16_t)adcValue, smokeCount);
      }
      lastAlarmSendMs = millis();
    }

    while (alarmState)
    {
      updateButton();
      buzzerPwmUpdate();

      irEmitterOn();
      delay(15);
      adcValue = readSmokeAverage(adcSamples);
      irEmitterOff();

      smokeDetected = (adcValue >= smokeAdcThreshold);

      if (!smokeDetected)
      {
        if (smokeCount > 0) smokeCount--;
      }
      else
      {
        if (smokeCount < 255) smokeCount++;
      }

      if (smokeCount == 0)
      {
        alarmState = false;
        silenceMode = false;
        lastAlarmSendMs = 0;
        alarmOff();
        digitalWrite(STATUS_LED_PIN, LOW);
        digitalWrite(IC13_PIN, LOW);
        break;
      }

      if (!silenceMode)
      {
        digitalWrite(STATUS_LED_PIN, HIGH);
        digitalWrite(IC13_PIN, HIGH);
      }
      else
      {
        digitalWrite(STATUS_LED_PIN, LOW);
        digitalWrite(IC13_PIN, LOW);
      }

      printSystemState();
      delay(200);
    }
  }
  else
  {
    alarmOff();
    digitalWrite(STATUS_LED_PIN, LOW);
    digitalWrite(IC13_PIN, LOW);

    printSystemState();
    enterSleep();
  }
}

// ================== ADC ==================
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

// ================== IR ==================
void irEmitterOn(void)
{
  digitalWrite(IR_EMIT_PIN, LOW);
}

void irEmitterOff(void)
{
  digitalWrite(IR_EMIT_PIN, HIGH);
}

// ================== NUT NHAN ==================
void updateButton(void)
{
  uint32_t now = millis();
  bool reading = digitalRead(TEST_BUTTON_PIN);

  if (reading != buttonLastReading)
  {
    buttonLastChangeMs = now;
    buttonLastReading = reading;
  }

  if ((now - buttonLastChangeMs) >= buttonDebounceMs)
  {
    if (reading != buttonLastStableState)
    {
      buttonLastStableState = reading;

      if (buttonLastStableState == LOW)
      {
        buttonPressedStartMs = now;
        buttonLongPressHandled = false;
      }
      else
      {
        buttonPressedStartMs = 0;
      }
    }
  }

  if (buttonLastStableState == LOW && !buttonLongPressHandled)
  {
    if ((now - buttonPressedStartMs) >= buttonLongPressMs)
    {
      silenceMode = true;
      buttonLongPressHandled = true;

      if (enableDebugSerial)
      {
        Serial.println(">> HOLD 2s: SILENCE");
      }
    }
  }
}

// ================== COI PWM ==================
void buzzerPwmStart(void)
{
  buzzerEnable = true;
}

void buzzerPwmStop(void)
{
  buzzerEnable = false;
  buzzerOutputState = false;
  digitalWrite(BUZZER_PIN, buzzerActiveHigh ? LOW : HIGH);
}

void buzzerPwmUpdate(void)
{
  if (!buzzerEnable) return;

  const uint32_t periodUs = 1000000UL / buzzerFreqHz;
  const uint32_t highUs = (periodUs * buzzerDutyPercent) / 100;
  const uint32_t lowUs  = periodUs - highUs;

  uint32_t nowUs = micros();
  uint32_t intervalUs = buzzerOutputState ? highUs : lowUs;

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

// ================== BAO DONG ==================
void alarmOn(void)
{
  buzzerPwmStart();
}

void alarmOff(void)
{
  buzzerPwmStop();
}

// ================== KHOI PHUC CHAN SAU KHI WAKE ==================
void restorePinsAfterWake(void)
{
  pinMode(IR_EMIT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(IC13_PIN, OUTPUT);

  digitalWrite(IR_EMIT_PIN, HIGH);
  digitalWrite(BUZZER_PIN, buzzerActiveHigh ? LOW : HIGH);
  digitalWrite(STATUS_LED_PIN, LOW);
  digitalWrite(IC13_PIN, LOW);
}

// ================== SLEEP ==================
void enterSleep(void)
{
  alarmOff();

  // tat het muc logic truoc
  digitalWrite(STATUS_LED_PIN, LOW);
  digitalWrite(IC13_PIN, LOW);
  digitalWrite(IR_EMIT_PIN, HIGH);
  digitalWrite(BUZZER_PIN, buzzerActiveHigh ? LOW : HIGH);

  // dua cac chan ve INPUT de giam dong ro
  pinMode(STATUS_LED_PIN, INPUT);   // PA9 LED
  pinMode(IC13_PIN, INPUT);
  pinMode(IR_EMIT_PIN, INPUT);
  pinMode(BUZZER_PIN, INPUT);

  api.system.sleep.all(sleepIntervalMs);
}

// ================== LORAWAN ==================
bool setupLoRaWAN(void)
{
  if (!api.lorawan.nwm.set()) return false;
  if (!api.lorawan.njm.set(1)) return false;
  if (!api.lorawan.band.set(9)) return false;
  if (!api.lorawan.deviceClass.set(0)) return false;

  api.lorawan.deui.set(nodeDeviceEUI, 8);
  api.lorawan.appeui.set(nodeAppEUI, 8);
  api.lorawan.appkey.set(nodeAppKey, 16);

  return true;
}

bool ensureJoin(void)
{
  if (api.lorawan.njs.get() == 1)
  {
    joined = true;
    return true;
  }

  api.lorawan.join();
  uint32_t t0 = millis();

  while ((millis() - t0) < 30000UL)
  {
    if (api.lorawan.njs.get() == 1)
    {
      joined = true;
      return true;
    }
    delay(500);
  }

  joined = false;
  return false;
}

bool sendAlarmPacket(uint16_t adc, uint8_t confirmCount)
{
  uint8_t payload[4];
  payload[0] = 0xA1;
  payload[1] = (uint8_t)(adc >> 8);
  payload[2] = (uint8_t)(adc & 0xFF);
  payload[3] = confirmCount;

  return api.lorawan.send(sizeof(payload), payload, 2, false);
}

// ================== DEBUG ==================
void printSystemState(void)
{
  if (!enableDebugSerial) return;

  Serial.print("ADC=");
  Serial.print(adcValue);
  Serial.print(" | Detect=");
  Serial.print(smokeDetected ? "YES" : "NO");
  Serial.print(" | Count=");
  Serial.print(smokeCount);
  Serial.print(" | Alarm=");
  Serial.print((alarmState && !silenceMode) ? "ON" : "OFF");
  Serial.print(" | Silence=");
  Serial.println(silenceMode ? "ON" : "OFF");
}