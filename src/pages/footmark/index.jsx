import React, { useState } from "react";
import SolarSystem from "./compont/solarSystem";
import CloudScene from "./compont/cloundScene";
import Map from "./compont/map";
import "./index.scss";

function Footmark() {
  const [showSolar, setShowSolar] = useState(true);
  const [showCloud, setShowCloud] = useState(false);
  const [showMap, setMap] = useState(false);
  const solarToCloud = () => {
    setShowSolar(false);
    setShowCloud(true);
  };
  const cloudToMap = () => {
    setShowCloud(false);
    setMap(true);
  };

  return (
    <div className="footmark">
      {showSolar ? <SolarSystem callBack={solarToCloud} /> : ""}
      {showCloud ? <CloudScene callBack={cloudToMap} /> : ""}
      {showMap ? <Map /> : ""}
    </div>
  );
}

export default Footmark;
