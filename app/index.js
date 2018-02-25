import document from "document";
import * as messaging from "messaging";

import * as util from "./util";
import * as msg from "../common/msg";

console.log("App Started");

let main = document.getElementById("main");

let nearby = document.getElementById("nearby");

nearby.onactivate = function(evt) {
  console.log("Activated!");
  msg.send({
    "api": "nearby"
  });
}

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = util.stripQuotes(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    main.style.fill = color;
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};

