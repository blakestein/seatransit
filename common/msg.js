import * as messaging from "messaging";

// Send data to device using Messaging API
export function send(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}