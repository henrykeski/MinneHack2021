int led1 = D7;
int servoPin = D0;
int waterLevelPin = A5;
int flowVolumePin = A4;
int rainPos = 150;
int mainPos = 20;
int defaultPos = mainPos;

double waterLevel=0.0;
String waterSource="main";


double timeElapsed=0.0;
double volumeElapsed=0.0;

Servo myServo;


void setup()
{
  // register the cloud function
  Particle.function("photonHandle", photonHandle);
  Particle.function("resetValues", resetValues);
  
  Particle.variable("waterLevel", waterLevel);
  Particle.variable("waterSource", waterSource);
  Particle.variable("timeElapsed", timeElapsed);
  Particle.variable("volumeElapsed", volumeElapsed);


  RGB.control(true);


  pinMode(led1, OUTPUT);
  pinMode(waterLevelPin, INPUT);
  pinMode(flowVolumePin, INPUT);
  myServo.attach(servoPin);
  myServo.write(defaultPos);
  RGB.color(0, 0, 255);



}

double getVolume(){
    double raw = analogRead(flowVolumePin);
    return (raw/4095)/2; // max flow rate is .5L/sec
}

void loop()
{
  digitalWrite(led1, HIGH);
  delay(500);
  digitalWrite(led1, LOW);
  delay(500);
  waterLevel = analogRead(waterLevelPin);
  volumeElapsed += getVolume();
  timeElapsed += 1;
}

int resetValues(String command)
{
  Particle.publish("Resetting volume and time elapsed values");
  volumeElapsed = 0;
  timeElapsed = 0;
  return 1;
}

// this function automagically gets called upon a matching POST request
int photonHandle(String command)
{
  // look for the matching argument "coffee" <-- max of 64 characters long
  Particle.publish("Handling command:", command);
  if(command == "rain")
  {
    RGB.color(0, 255, 0);
    myServo.write(rainPos);
    waterSource = "rain";
    return 1;
  }
  else if (command == "main"){
    RGB.color(0, 0, 255);
    myServo.write(mainPos);
    waterSource = "main";
    return 1;
  }
  else{
    RGB.color(255, 0, 0);
    return 0;
  }
}
