const int triggerPin = 7;
const int echoPin = 6;
unsigned int distance = 0;
const int numReadings = 10;
int readings[numReadings];
int readIndex = 0;
int total = 0;
int average = 0;

void setup() {
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
  for (int thisReading = 0; thisReading < numReadings; thisReading++)
  {
    readings[thisReading] = 0;
  }
}

void loop() {
  distance = getDistance();
  distance = smoothThis(distance);
  Serial.print("Jarak : ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(1);
}

int getDistance() {
  digitalWrite(triggerPin, LOW);
  delayMicroseconds (2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds (10);
  digitalWrite(triggerPin, LOW);
  unsigned int duration = pulseIn(echoPin, HIGH);
  unsigned int rawDistance = (duration / 2) / 28.5;
  return rawDistance;
}

int smoothThis(int rawDistance)
{
  total = total - readings[readIndex];
  readings[readIndex] = rawDistance;
  total = total + readings[readIndex];
  readIndex = readIndex + 1;

  if (readIndex >= numReadings)
  {
    readIndex = 0;
  }

  average = total / numReadings;
  return average;
}
