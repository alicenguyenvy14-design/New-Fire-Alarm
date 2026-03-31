// ================== KHAI BAO CHAN ==================
#define SMOKE_ADC_PIN     34
#define IR_EMIT_PIN       25
#define BUZZER_PIN        26
#define STATUS_LED_PIN    27
#define TEST_BUTTON_PIN   33
#define IC13_PIN          32   // 🔥 THÊM: thay chân 13 IC

// ================== THAM SO ==================
int adcClean = 1200;
int adcMaxSmoke = 2800;
float smokeThresholdPercent = 60.0;

const int adcSamples = 20;

const unsigned long statusBlinkIntervalMs = 30000UL;
const unsigned long statusBlinkOnTimeMs = 120UL;
const unsigned long sensorUpdateIntervalMs = 100UL;

bool blinkFastWhenAlarm = true;
const unsigned long fastBlinkIntervalMs = 300UL;

// ================== BIEN ==================
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

// ================== HAM ==================
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

  pinMode(IR_EMIT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(IC13_PIN, OUTPUT);        // 🔥 THÊM

  pinMode(TEST_BUTTON_PIN, INPUT_PULLUP);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(IC13_PIN, LOW);      // 🔥 THÊM
  digitalWrite(STATUS_LED_PIN, LOW);

  irEmitterOff();
  irEmitterOn();

  Serial.println("=== HE THONG BAO KHOI ===");
}

// ================== LOOP ==================
void loop()
{
  unsigned long now = millis();

  testMode = (digitalRead(TEST_BUTTON_PIN) == LOW);

  if (now - lastSensorReadMs >= sensorUpdateIntervalMs)
  {
    lastSensorReadMs = now;

    adcValue = readSmokeAverage(adcSamples);
    smokePercent = convertADCToSmokePercent(adcValue);

    if (testMode)
      alarmState = true;
    else
      alarmState = (smokePercent >= smokeThresholdPercent);

    if (alarmState)
      alarmOn();
    else
      alarmOff();

    printSystemState();
  }

  updateStatusLed();
}

// ================== DOC ADC ==================
int readSmokeAverage(int samples)
{
  long sum = 0;
  for (int i = 0; i < samples; i++)
  {
    sum += analogRead(SMOKE_ADC_PIN);
    delay(2);
  }
  return sum / samples;
}

// ================== DOI ADC ==================
float convertADCToSmokePercent(int adc)
{
  if (adcMaxSmoke == adcClean) return 0.0;

  float percent = (adc - adcClean) * 100.0 / (adcMaxSmoke - adcClean);

  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return percent;
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

// ================== COI ==================
void alarmOn(void)
{
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(IC13_PIN, HIGH);   // 🔥 CHÂN 13 CHẠY CÙNG
}

void alarmOff(void)
{
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(IC13_PIN, LOW);
}

// ================== LED ==================
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

// ================== SERIAL ==================
void printSystemState(void)
{
  Serial.print("ADC=");
  Serial.print(adcValue);
  Serial.print(" | Smoke=");
  Serial.print(smokePercent);
  Serial.print("% | Alarm=");
  Serial.println(alarmState ? "ON" : "OFF");
}