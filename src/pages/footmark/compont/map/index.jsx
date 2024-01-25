import { useCallback, useEffect, useState } from "react";
import { Button, Card, Radio } from "antd";
import styles from "./index.scss";
import AMapLoader from "@amap/amap-jsapi-loader";
import locationIcon from "./locationIcon.svg";
const KEY = "2ee0a07df33ee8425d4d165ece6c56fe";

const MAPSTYLELIST = [
  { key: "normal", value: "默认" },
  { key: "dark", value: "幻影黑" },
  { key: "light", value: "月光银" },
  { key: "whitesmoke", value: "远山黛" },
  { key: "fresh", value: "草色青" },
  { key: "grey", value: "雅士灰" },
  { key: "graffiti", value: "涂鸦" },
  { key: "macaron", value: "马卡龙" },
  { key: "blue", value: "靛青蓝" },
  { key: "darkblue", value: "极夜蓝" },
  { key: "wine", value: "酱籽" },
];
const INITSTYLE = "normal";
const longitudeAndLatitude = [
  {
    title: "岚县",
    longitude: 111.795807,
    latitude: 38.372999,
  },
  {
    title: "太原",
    longitude: 112.549248,
    latitude: 37.857012,
  },
  {
    title: "新余",
    longitude: 114.935906,
    latitude: 27.803472,
  },
  {
    title: "长沙",
    longitude: 112.982279,
    latitude: 28.19409,
  },
  {
    title: "株洲",
    longitude: 113.13909,
    latitude: 27.827603,
  },
  {
    title: "杭州",
    longitude: 120.153576,
    latitude: 30.287459,
  },
  {
    title: "石家庄",
    longitude: 114.499577,
    latitude: 38.042303,
  },
  {
    title: "武汉",
    longitude: 114.3162,
    latitude: 30.581084,
  },
  {
    title: "苏州",
    longitude: 120.619903,
    latitude: 31.299906,
  },
  {
    title: "上海",
    longitude: 121.473701,
    latitude: 31.230416,
  },
  {
    title: "南昌",
    longitude: 115.893525,
    latitude: 28.689578,
  },
  {
    title: "衢州",
    longitude: 118.875842,
    latitude: 28.956918,
  },
  {
    title: "南通",
    longitude: 121.050755,
    latitude: 32.087552,
  },
  {
    title: "朔州",
    longitude: 112.437211,
    latitude: 39.332122,
  },
  {
    title: "海口",
    longitude: 110.33123,
    latitude: 20.031971,
  },
  {
    title: "湛江",
    longitude: 110.359377,
    latitude: 21.270708,
  },
  {
    title: "珠海",
    longitude: 113.562447,
    latitude: 22.25691,
  },
  {
    title: "郑州",
    longitude: 113.665412,
    latitude: 34.757975,
  },
  {
    title: "烟台",
    longitude: 121.309555,
    latitude: 37.536572,
  },
  {
    title: "招远",
    longitude: 120.38,
    latitude: 37.35,
  },
  {
    title: "阜阳",
    longitude: 115.819729,
    latitude: 32.901215,
  },
  {
    title: "菏泽",
    longitude: 115.480656,
    latitude: 35.23375,
  },
  {
    title: "青岛",
    longitude: 120.38,
    latitude: 36.07,
  },
  {
    title: "济南",
    longitude: 117.000923,
    latitude: 36.675807,
  },
  {
    title: "广州",
    longitude: 113.280637,
    latitude: 23.125178,
  },
  {
    title: "深圳",
    longitude: 114.057963,
    latitude: 22.543095,
  },
  {
    title: "中山",
    longitude: 113.3823,
    latitude: 22.52126,
  },
  {
    title: "乌鲁木齐",
    longitude: 87.616858,
    latitude: 43.79918,
  },
  {
    title: "北京",
    longitude: 116.407851,
    latitude: 39.904501,
  },
  {
    title: "泰安",
    longitude: 117.02644,
    latitude: 36.188071,
  },
  {
    title: "南京",
    longitude: 118.76741,
    latitude: 32.041544,
  },
  {
    title: "合肥",
    longitude: 117.227239,
    latitude: 31.820585,
  },
  {
    title: "赣州",
    longitude: 114.935906,
    latitude: 25.83166,
  },
  {
    title: "阳泉",
    longitude: 113.591015,
    latitude: 37.870515,
  },
  {
    title: "鄂尔多斯",
    longitude: 109.781327,
    latitude: 39.608266,
  },
  {
    title: "天津",
    longitude: 117.200983,
    latitude: 39.084157,
  },
  {
    title: "大连",
    longitude: 121.61468,
    latitude: 38.914003,
  },
];
export default function MapContainer() {
  const [mapStyle,setMapStyle] = useState(INITSTYLE)
  let map = null;
  let marker = null;
  let lineArr = [];

  const haveBeenTo = (AMap) => {
    const icon = new AMap.Icon({
      size: new AMap.Size(6, 6), //图标尺寸
      image:
        "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png", //Icon 的图像
    });
    const content = `<div class="custom-content-marker">
    <img src="${locationIcon}"/>
    </div>`;
    const markers = longitudeAndLatitude.map((item) => {
      const marker = new AMap.Marker({
        position: new AMap.LngLat(item.longitude, item.latitude), //点标记的位置
        offset: new AMap.Pixel(-10, -18), //偏移量
        icon: icon, //添加 Icon 实例
        title: item.title,
        zooms: [4, 6], //点标记显示的层级范围，超过范围不显示
        content: content, //自定义点标记覆盖物内容
      });
      // 点击标记事件
      //   const   infoWindow = new AMap.InfoWindow({
      //     isCustom: true,  //使用自定义窗体
      //     content: '<div>12</div>',
      //     offset: new AMap.Pixel(16, -45)
      // })
      // marker.on('click',  function (e) {
      //   infoWindow.open(map, marker.getPosition());
      // });
      return marker;
    });
    map.add(markers);
  };
  const init = async (style = INITSTYLE, flag = false) => {
    destroy();
    const AMap = await AMapLoader.load({
      key: KEY,
      version: "2.0",
      // plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    });

    map = new AMap.Map("container", {
      // 设置地图容器id
      viewMode: "3D", // 是否为3D地图模式
      zoom: 5, // 初始化地图级别
      center: [116.397428, 40.22077], // 初始化地图中心点位置
      mapStyle: `amap://styles/${style}`,
    });
    if (flag) {
      track(AMap);
    } else {
      haveBeenTo(AMap);
    }
  };
  const destroy = () => {
    map?.destroy();
    marker = null;
  };
  useEffect(() => {
    init();
    return () => {
      destroy();
    };
  }, []);
  const changeMapStyle = (e) => {
    const style = e.target.value
    destroy();
    init(style);
    setMapStyle(style)
  };

  const track = (AMap) => {
    AMap.plugin("AMap.MoveAnimation", async function () {
      lineArr = longitudeAndLatitude.flatMap((item) => [
        [item.longitude, item.latitude],
      ]);
      const map = new AMap.Map("container", {
        resizeEnable: true,
        center: [111.795807, 38.372999],
        zoom: 5,
      });

      marker = new AMap.Marker({
        map: map,
        position: [111.795807, 38.372999],
        icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
        offset: new AMap.Pixel(-13, -26),
      });

      // 绘制轨迹
      const polyline = new AMap.Polyline({
        map: map,
        path: lineArr,
        showDir: true,
        strokeColor: "#28F", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        strokeStyle: "solid", //线样式
      });

      const passedPolyline = new AMap.Polyline({
        map: map,
        strokeColor: "#AF5", //线颜色
        strokeWeight: 6, //线宽
      });
      const sleep = (time = 2) =>
        new Promise((resolve) => setTimeout(resolve, time * 1000));
      await sleep();
      marker.moveAlong(lineArr, {
        duration: 1000,
        autoRotation: true,
      });

      marker.on("moving", function (e) {
        passedPolyline.setPath(e.passedPath);
        map.setCenter(e.target.getPosition(), true);
      });
      map.setFitView();
    });
  };

  const start = () => {
    console.log(mapStyle,'style');
    destroy();
    init(mapStyle, true);
  };
  return (
    <>
      <div
        id="container"
        className={styles.container}
        style={{ height: "800px" }}
      ></div>
      <Card className="input-card">
        <Radio.Group onChange={changeMapStyle} defaultValue={INITSTYLE}>
          {MAPSTYLELIST.map((item) => (
            <Radio value={item.key} key={item.key}>
              {item.value}
            </Radio>
          ))}
        </Radio.Group>
      </Card>
      <div className="input-card-input-card">
        <h4>我的足迹</h4>
        <div className="btns">
          <Button onClick={start}>开始</Button>
        </div>
      </div>
    </>
  );
}
