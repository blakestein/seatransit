import * as messaging from "messaging";
import { settingsStorage } from "settings";
import * as msg from "../common/msg";
import * as api from "./api";

console.log("Companion Started");

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`Companion received: ${JSON.stringify(evt)}`);
  if (evt.data.hasOwnProperty('api') && api[evt.data.api]) {
    api[evt.data.api]();
  }
};

// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  msg.send(data);
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      msg.send(data);
    }
  }
}
