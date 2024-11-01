#include "esp_camera.h"
#include <WiFi.h>
#include<WebServer.h>
#include<Arduino.h>
#include <ESPmDNS.h>

const int LEDPin = 4;
#define CAMERA_MODEL_AI_THINKER // Has PSRAM
#include "camera_pins.h"

// ===========================
// Enter your WiFi credentials
// ===========================
const char* ssid = "your_WiFi_SSID";
const char* password = "your_Wifi_Password";

WebServer server(80);

void startCameraServer();
//void setupLedFlash(int pin);
static bool ledState = false;

const int pwmChannel = 0;
const int pwmFreq = 5000; // PWM frequency
const int pwmResolution = 8; // 8-bit resolution (values between 0 and 255)

void addCorsHeaders() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "*");
}


// Function to handle root URL
void handleRoot() {
  server.send(200, "text/html", "<h1>ESP32-CAM LED Control</h1><button onclick=\"location.href='/toggleLED'\">Toggle LED</button>");
}

void handleGetIP() {
    addCorsHeaders();
    String ip = WiFi.localIP().toString();
    server.send(200, "text/plain", ip);
}

// Function to handle LED toggle
void handleToggleLED() {
  ledState = !ledState;
  if(ledState){
    ledcWrite(pwmChannel,40);
  }else{
    ledcWrite(pwmChannel,0);//Turn it off
  }
//  digitalWrite(LEDPin, ledState);
  server.send(200, "text/plain", ledState ? "LED is ON" : "LED is OFF");
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

 // Initialize LED pin
  pinMode(LEDPin, OUTPUT);
//  digitalWrite(LEDPin, LOW);

  // Set up PWM on the LED pin
  // channel: 0, freq: 5000 Hz, resolution: 8-bit (0-255)
   ledcSetup(pwmChannel, pwmFreq, pwmResolution);
  // Attach the LED pin to the PWM channel
   ledcAttachPin(LEDPin, pwmChannel);

  // Set initial brightness (0-255)
//  ledcWrite(0, 128); // 128 is about 50% intensity
  
  camera_config_t config;
//  config.ledc_channel = LEDC_CHANNEL_0;
//  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG; // for streaming
  //config.pixel_format = PIXFORMAT_RGB565; // for face detection/recognition
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;
  
  // if PSRAM IC present, init with UXGA resolution and higher JPEG quality
  //                      for larger pre-allocated frame buffer.
  if(config.pixel_format == PIXFORMAT_JPEG){
    if(psramFound()){
      config.jpeg_quality = 10;
      config.fb_count = 2;
      config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
      // Limit the frame size when PSRAM is not available
      config.frame_size = FRAMESIZE_SVGA;
      config.fb_location = CAMERA_FB_IN_DRAM;
    }
  } else {
    // Best option for face detection/recognition
    config.frame_size = FRAMESIZE_240X240;
#if CONFIG_IDF_TARGET_ESP32S3
    config.fb_count = 2;
#endif
  }

#if defined(CAMERA_MODEL_ESP_EYE)
  pinMode(13, INPUT_PULLUP);
  pinMode(14, INPUT_PULLUP);
#endif

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t * s = esp_camera_sensor_get();
  // initial sensors are flipped vertically and colors are a bit saturated
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1); // flip it back
    s->set_brightness(s, 1); // up the brightness just a bit
    s->set_saturation(s, -2); // lower the saturation
  }
  // drop down frame size for higher initial frame rate
  if(config.pixel_format == PIXFORMAT_JPEG){
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

#if defined(CAMERA_MODEL_M5STACK_WIDE) || defined(CAMERA_MODEL_M5STACK_ESP32CAM)
  s->set_vflip(s, 1);
  s->set_hmirror(s, 1);
#endif

#if defined(CAMERA_MODEL_ESP32S3_EYE)
  s->set_vflip(s, 1);
#endif

  WiFi.begin(ssid, password);
  WiFi.setSleep(false);
  WiFi.mode(WIFI_STA); // SETS TO STATION MODE!
  

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  startCameraServer();

  // Set the hostname to "esp32cam"
   if (!MDNS.begin("esp32cam")) {  
    Serial.println("Error setting up MDNS responder!");
    while (1) {
      delay(1000);
    }
  }
  Serial.println("MDNS responder started");

  server.on("/", handleRoot);
  server.on("/get_ip", handleGetIP);
  server.begin();

  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");
}

void loop() {
  server.handleClient();
}