import { geolocation } from "geolocation";
import global from "../settings/global";
import * as msg from "../common/msg";

export function nearby() {
  geolocation.getCurrentPosition(getNearby, locationError);
}

function locationError(error) {
  console.log(`Error: ${error.code}\nMessage: ${error.message}`);
}

function getNearby(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(`Latitude: ${lat}\nLongitude: ${lon}`);
  // OneBusAway Docs - http://developer.onebusaway.org/modules/onebusaway-application-modules/1.1.14/api/where/index.html
  const url = `https://api.pugetsound.onebusaway.org/api/where/stops-for-location.xml?key=${global.apiKey}&lat=${lat}&lon=${lon}`;
  console.log(url);
  fetch(url, {
    method: "GET"
  })
  .then(function(res) {
    return res.text();
  })
  .then(function(text) {
    const xml = new DOMParser().parseFromString(text, "text/xml");
    console.log(xml);
    const stops = getStops(xml);
    //const routes = getRoutes(xml);
  })
  .catch(err => console.log('[FETCH]: ' + err));
}

function getStops(xml) {
  const stops = xml.getElementsByTagName('stop');
  let data = {};
  Array.from(stops).forEach((el, i) => {
    let id = el.getElementsByTagName('id')[0].textContent;
    data[id] = {
      'name': el.getElementsByTagName('name')[0].textContent,
      'id': id,
      'routes': Array.from(el.getElementsByTagName('routeIds')[0].children).map(el => {
        return el.textContent;
      }),
    };
  });
  console.log(JSON.stringify(data));
  return data;
}

function getRoutes(xml) {
  const stops = xml.getElementsByTagName('route');
  let data = [];
  Array.from(stops).forEach((el, i) => {
    let id = el.getElementsByTagName('id')[0].textContent;
    data[id] = {
      'name': el.getElementsByTagName('shortName')[0].textContent,
      'id': id,
    };
  });
  return data;
}
