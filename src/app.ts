import axios from "axios";
import sqlite3 from "sqlite3";

//3600 242620 RS
//3600 296584 SC

interface Coordinates {
  lat: number;
  lon: number;
}

var db = new sqlite3.Database(
  "/home/jadson/Área de trabalho/distance-between-cities/distance.db",
  (error) => {
    if (error) console.log(error);
  }
);

const Brasil = 3600000000;
const RS = 242620;
const SC = 296584;

start().finally(() => {
  db.close();
});
async function start() {
  const dataRS = await getData(Brasil + SC);

  if (dataRS != false) {
    db.serialize(() => {
      var stmt = db.prepare("INSERT INTO cities VALUES (?,?,?,?)");
      for (let i = 0; i < dataRS.length; i++) {
        console.log(i);
        stmt.run(
          dataRS[i].id,
          dataRS[i].lat,
          dataRS[i].lon,
          dataRS[i].name,
          (error: any) => {
            if (error) console.log("error:", i, dataRS[i], error);
          }
        );
      }
      stmt.finalize();
    });
  }
}

async function getData(idArea: number) {
  const apiUrl = "https://overpass.kumi.systems/api/interpreter/";
  const query = `
    [out:json];
    area(${idArea})->.a;
    (
    node[place~"city|town|village"](area.a);
    );
    out body;
    >;
    out skel qt;
    `;

  try {
    const response = await axios.get(apiUrl, {
      params: {
        data: query,
      },
    });

    if (response.statusText == "OK") {
      return response.data.elements.map((e: any) => {
        if (e.tags.name) {
          return { id: e.id, lat: e.lat, lon: e.lon, name: e.tags.name };
        }
      });
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getDistance(destinations: Coordinates, origins: Coordinates) {
  const apiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  try {
    const response = await axios.get(apiUrl, {
      params: {
        destinations: `${destinations.lat},${destinations.lon}`,
        origins: `${origins.lat},${origins.lon}`,
        key: "YOUR_API_KEY",
      },
    });

    console.log(response)
    if (response.statusText == "OK") {

    }else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
