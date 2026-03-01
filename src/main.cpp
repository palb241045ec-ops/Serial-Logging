#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHTesp.h>

#define DHTPIN 4
DHTesp dht;

const char* ssid = "xyz";
const char* password = "xyz";
const char* url = "http://192.168.xxx.xxx";

// put function declarations here:
void postdata() {

  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;

  String endpoint = "http://" + String(url) + "/data"; // adjust path

  http.begin(endpoint);
  http.addHeader("Content-Type", "application/json");

  float temp = dht.getTemperature();
  float humd = dht.getHumidity();

  if (isnan(temp) || isnan(humd)) {
    Serial.println("Sensor read failed");
    return;
  }
  String json = "{";
  json += "\"temperature\":" + String(temp) + ",";
  json += "\"humidity\":" + String(humd);
  json += "}";

  int code = http.POST(json);

  Serial.print("HTTP code: ");
  Serial.println(code);

  http.end();
}


unsigned long lastSend = 0;
const unsigned long interval = 3000; // 3 seconds

void setup() {
  Serial.begin(115200);
  dht.setup(DHTPIN, DHTesp::DHT11);
  delay(2000);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected");

  // Initialize DHT sensor
}

void loop() {

  unsigned long now = millis();

  if (now - lastSend >= interval) {
    lastSend = now;
    postdata();
  }
}