/*
  ============================================================
  HE THONG BAO KHOI DUNG ESP32
  ------------------------------------------------------------
  Mapping chan:

  IC cu chan 1  -> 3V3 ESP32
  IC cu chan 16 -> GND ESP32
  IC cu chan 15 -> GPIO34 (ADC doc cam bien J1)
  IC cu chan 7  -> GPIO25 (dieu khien phat J2)
  IC cu chan 5  -> GPIO26 (coi)
  IC cu chan 6  -> GPIO27 (LED trang thai)
  IC cu chan 4  -> GPIO33 (nut test)

  Cach noi ngoai vi:
  - J1 thu:
      3.3V --- 10k ---+--- GPIO34
                      |
                     J1
                      |
                     GND

  - J2 phat:
      3.3V --- 220R --- J2 --- GPIO25

  - Coi:
      GPIO26 --- coi --- GND

  - LED trang thai:
      GPIO27 --- 220R --- LED --- GND

  - Nut test:
      GPIO33 --- nut --- GND
      (dung INPUT_PULLUP)

  Luu y:
  - GPIO25 keo LOW thi J2 phat sang
  - GPIO34 chi la input, dung rat hop cho ADC
  ============================================================
*/

// ================== KHAI BAO CHAN ==================
#define SMOKE_ADC_PIN     34   // Chan 15 IC cu - ADC doc cam bien khoi
#define IR_EMIT_PIN       25   // Chan 7  IC cu - phat J2
#define BUZZER_PIN        26   // Chan 5  IC cu - coi
#define STATUS_LED_PIN    27   // Chan 6  IC cu - LED nhap nhay dinh ky
#define TEST_BUTTON_PIN   33   // Chan 4  IC cu - nut test

// ================== THAM SO HE THONG ==================
// Gia tri ADC khi buong sach, khong co khoi
int adcClean = 1200;

// Gia tri ADC khi khoi day / che lap nhieu nhat ma ban coi la 100%
int adcMaxSmoke = 2800;

// Nguong bao dong theo phan tram khoi
float smokeThresholdPercent = 60.0;

// So mau dung de lay trung binh ADC
const int adcSamples = 20;

// LED nhap nhay dinh ky moi 30 giay
const unsigned long statusBlinkIntervalMs = 30000UL;

// Do rong xung nhay LED trang thai
const unsigned long statusBlinkOnTimeMs = 120UL;

// Chu ky cap nhat ADC
const unsigned long sensorUpdateIntervalMs = 100UL;

// Neu muon nhay nhanh khi bao dong thi dat = true
bool blinkFastWhenAlarm = true;

// Chu ky nhay nhanh khi bao dong
const unsigned long fastBlinkIntervalMs = 300UL;

// ================== BIEN TOAN CUC ==================
int adcValue = 0;
float smokePercent = 0.0;
bool alarmState = false;
bool testMode = false;

unsigned long lastSensorReadMs = 0;
unsigned long lastStatusBlinkMs = 0;
unsigned long statusLedTurnOffMs = 0;
unsigned long lastFastBlinkMs = 0;
bool statusLedPulseActive = false;
bool fastBlinkState = false;

// ================== CAC HAM KHAI BAO ==================
int readSmokeAverage(int samples);
float convertADCToSmokePercent(int adc);
void irEmitterOn(void);
void irEmitterOff(void);
void alarmOn(void);
void alarmOff(void);
void updateStatusLed(void);
void printSystemState(void);

// ================== SETUP ==================
void setup()
{
  Serial.begin(115200);
  delay(200);

  // Cau hinh chan output
  pinMode(IR_EMIT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);

  // Nut test dung keo len noi bo
  pinMode(TEST_BUTTON_PIN, INPUT_PULLUP);

  // ADC ESP32
  analogReadResolution(12);          // Gia tri tu 0 -> 4095
  analogSetAttenuation(ADC_11db);    // Doc on dinh tren dai dien ap rong hon

  // Trang thai ban dau
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(STATUS_LED_PIN, LOW);
  irEmitterOff();

  // Bat bo phat hong ngoai
  irEmitterOn();

  Serial.println("========================================");
  Serial.println("He thong bao khoi ESP32 bat dau");
  Serial.println("GPIO34: ADC doc khoi");
  Serial.println("GPIO25: Phat J2");
  Serial.println("GPIO26: Coi");
  Serial.println("GPIO27: LED trang thai");
  Serial.println("GPIO33: Nut test");
  Serial.println("========================================");
}

// ================== LOOP ==================
void loop()
{
  unsigned long now = millis();

  // Nut test: nhan giu la kich hoat bao dong gia
  testMode = (digitalRead(TEST_BUTTON_PIN) == LOW);

  // Doc cam bien theo chu ky
  if (now - lastSensorReadMs >= sensorUpdateIntervalMs)
  {
    lastSensorReadMs = now;

    adcValue = readSmokeAverage(adcSamples);
    smokePercent = convertADCToSmokePercent(adcValue);

    // Neu nhan nut test thi uu tien bao dong
    if (testMode)
    {
      alarmState = true;
    }
    else
    {
      alarmState = (smokePercent >= smokeThresholdPercent);
    }

    if (alarmState)
    {
      alarmOn();
    }
    else
    {
      alarmOff();
    }

    printSystemState();
  }

  // Cap nhat LED trang thai
  updateStatusLed();
}

// ================== DOC ADC TRUNG BINH ==================
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

// ================== DOI ADC SANG % KHOI ==================
// Truong hop mac dinh: ADC tang khi khoi tang
float convertADCToSmokePercent(int adc)
{
  // Bao ve tranh chia cho 0
  if (adcMaxSmoke == adcClean)
  {
    return 0.0;
  }

  float percent = (adc - adcClean) * 100.0f / (float)(adcMaxSmoke - adcClean);

  // Gioi han 0 -> 100%
  if (percent < 0.0f)   percent = 0.0f;
  if (percent > 100.0f) percent = 100.0f;

  return percent;
}

// ================== DIEU KHIEN BO PHAT J2 ==================
// Mach: 3.3V --- 220R --- J2 --- GPIO25
// Muon J2 sang thi keo chan GPIO25 xuong LOW
void irEmitterOn(void)
{
  digitalWrite(IR_EMIT_PIN, LOW);
}

void irEmitterOff(void)
{
  digitalWrite(IR_EMIT_PIN, HIGH);
}

// ================== DIEU KHIEN COI ==================
void alarmOn(void)
{
  digitalWrite(BUZZER_PIN, HIGH);
}

void alarmOff(void)
{
  digitalWrite(BUZZER_PIN, LOW);
}

// ================== LED TRANG THAI ==================
// - Binh thuong: nhay 1 xung ngan moi 30 giay
// - Bao dong: co the nhay nhanh neu blinkFastWhenAlarm = true
void updateStatusLed(void)
{
  unsigned long now = millis();

  if (alarmState && blinkFastWhenAlarm)
  {
    if (now - lastFastBlinkMs >= fastBlinkIntervalMs)
    {
      lastFastBlinkMs = now;
      fastBlinkState = !fastBlinkState;
      digitalWrite(STATUS_LED_PIN, fastBlinkState ? HIGH : LOW);
    }
    return;
  }

  // Neu khong bao dong thi LED nhay 1 xung ngan moi 30 giay
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

// ================== IN TRANG THAI RA SERIAL ==================
void printSystemState(void)
{
  Serial.print("ADC = ");
  Serial.print(adcValue);

  Serial.print(" | Smoke = ");
  Serial.print(smokePercent, 1);
  Serial.print("%");

  Serial.print(" | Threshold = ");
  Serial.print(smokeThresholdPercent, 1);
  Serial.print("%");

  Serial.print(" | Test = ");
  Serial.print(testMode ? "ON" : "OFF");

  Serial.print(" | Alarm = ");
  Serial.println(alarmState ? "ON" : "OFF");
}