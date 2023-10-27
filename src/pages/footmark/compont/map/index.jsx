import React from "react";
import  { Map, Marker } from "react-amap";
import "./index.scss";
const FootprintMap = () => {
  const mapCenter = { longitude: 116.404, latitude: 39.928 };
  // 创建地图图层配置，包括卫星图层

  return (
    <div className="map-wrap">
      <Map
        amapkey={"e3e913b73e8e1884832dbcbaef010ee5"}
        center={mapCenter}
        zoom={4}
        version="1.4.15"
        plugins={["ToolBar"]}
        viewMode="3D"
        expandZoomRange={true}
      >
        {/* 添加足迹点 */}
        {/* <Marker
          position={{ longitude: pointLongitude, latitude: pointLatitude }}
        > */}
        {/* <div>Point 1</div> */}
        {/* </Marker> */}
        {/* 添加更多足迹点 */}
      </Map>
    </div>
  );
};

export default FootprintMap;
