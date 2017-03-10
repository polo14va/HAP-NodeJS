var Humidity = 0.0;
// MQTT Setup
var mqtt = require('mqtt');
console.log("Connecting to MQTT broker...");
var mqtt = require('mqtt');
var options = {
  port: 1883,
  host: '192.168.0.67',
  clientId: 'Humedad1'
};
var client = mqtt.connect(options);
console.log("Humidity Sensor Connected to MQTT broker");
client.subscribe('Humedad1');
client.on('message', function(topic, message) {
  console.log(parseFloat(message));
  Humidity = parseFloat(message);
});

var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;



// Generate a consistent UUID for our Temperature Sensor Accessory that will remain the same
// even when restarting our server. We use the `uuid.generate` helper function to create
// a deterministic UUID based on an arbitrary "namespace" and the string "humidity-sensor".
var sensorUUID = uuid.generate('hap-nodejs:accessories:humedad1');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake lock.
var sensor = exports.accessory = new Accessory('Sensor Humedad 1', sensorUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
sensor.username = "63:5F:9A:FE:5E:AA";
sensor.pincode = "031-45-154";

// Add the actual HumiditySensor Service.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
sensor
  .addService(Service.HumiditySensor, "Humidity")
  .getCharacteristic(Characteristic.CurrentRelativeHumidity)
  .on('get', function(callback) {
    
    // return our current value
    callback(null, Humidity);
  });

setInterval(function() {
  
  
  // update the characteristic value so interested iOS devices can get notified
  sensor
    .getService(Service.HumiditySensor)
    .setCharacteristic(Characteristic.CurrentRelativeHumidity, Humidity);
  
}, 5000);
