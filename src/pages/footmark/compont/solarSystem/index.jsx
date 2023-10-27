import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //鼠标控制
import planetList from "../../const"; //导入星球数据
import universeImg from "../../img/universe.jpg"; //宇宙
import starImg from "../../img/star.jpg"; //星辰
import venusAtmosphereImg from "../../img/venusAtmosphere.jpg"; //金星大气
import moonImg from "../../img/moon.jpg"; //月球
import earthNormalImg from "../../img/earthNormal.jpg"; //法线贴图
import earthCloudsImg from "../../img/earthClouds.jpg"; //地球云层

import "./index.scss";
let scene = null; //场景
let camera = null; //相机
let orbitControls = null; //鼠标控件
let renderer = null; // 渲染器
let isRevolution = true; // 公转状态
let isRotation = true; // 自传状态
let anId = null; // 动画id
function Footmark(props) {
  const { callBack } = props;
  const planetDivRef = useRef(null);
  const [raycaster, setRaycaster] = useState(new THREE.Raycaster()); //光点投射器
  const [mouse, setMouse] = useState(new THREE.Vector2()); // 鼠标点击的平面
  const [clickPlanet, setClickPlanet] = useState(null); //当前点击的星球
  useEffect(() => {
    init();
    return destroyScene;
  }, []);

  const destroyScene = () => {
    cancelAnimationFrame(anId);
    renderer.forceContextLoss();
    renderer.dispose();
    scene.clear();
    scene = null;
    camera = null;
    orbitControls = null;
    planetDivRef.current.innerHTML = "";
    renderer = null;
  };

  const init = () => {
    if (!planetDivRef) return;
    const dom = planetDivRef.current;
    let width = dom.clientWidth;
    let height = dom.clientHeight;
    scene = new THREE.Scene(); //场景场景
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 50000); //创建透视相机(视场、长宽比、近面、远面)
    camera.position.set(0, 500, 2700); //设置相机位置
    camera.lookAt(0, 0, 0);
    //创建渲染器
    const newRenderer = new THREE.WebGLRenderer({
      antialias: true, //抗锯齿
      alpha: true, //透明
    });
    newRenderer.setClearColor(0x000000, 0.1); //设置场景透明度
    newRenderer.setSize(width, height); //设置渲染区域尺寸
    dom.appendChild(newRenderer.domElement); //将渲染器添加到dom中形成canvas
    renderer = newRenderer;

    createUniverse(); //创建宇宙
    createStars(); //创建星辰
    createLight(); //创建光源
    //遍历行星数据生成星球及其轨道
    planetList.forEach((e) => {
      createSphere(e);
      createTrack(e);
    });
    createOrbitControls(); //创建鼠标控制器
    render(); //渲染
  };

  //创建宇宙(球形宇宙)
  const createUniverse = () => {
    let universeGeometry = new THREE.SphereGeometry(7000, 100, 100);
    let universeMaterial = new THREE.MeshLambertMaterial({
      //高光材质
      map: new THREE.TextureLoader().load(universeImg),
      side: THREE.DoubleSide, //双面显示
    });
    //宇宙网格
    let universeMesh = new THREE.Mesh(universeGeometry, universeMaterial);
    universeMesh.name = "宇宙";
    scene.add(universeMesh);
  };

  const createStars = () => {
    const positions = [];
    const colors = [];
    const starsGeometry = new THREE.BufferGeometry();
    for (let i = 0; i < 10000; i++) {
      const vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      positions.push(vertex.x, vertex.y, vertex.z);
      const color = new THREE.Color();
      color.setRGB(255, 255, 255);
      colors.push(color.r, color.g, color.b);
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    starsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    const starsMaterial = new THREE.PointsMaterial({
      map: new THREE.TextureLoader().load(starImg),
      size: 5,
      blending: THREE.AdditiveBlending,
      fog: true,
      depthTest: false,
    });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    starsMesh.scale.set(7000, 7000, 7000);
    scene.add(starsMesh);
  };

  const createLight = () => {
    const ambient = new THREE.AmbientLight(new THREE.Color(0xffffff));
    scene.add(ambient);
    const pointLight = new THREE.PointLight(new THREE.Color(0xffffff), 2, 1, 0);
    pointLight.visible = true;
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
  };

  const createSphere = (data) => {
    if (data.name === "太阳") {
      createSun(data);
    } else if (data.name === "地球") {
      createEarth(data);
    } else if (data.name === "金星") {
      createVenus(data);
    } else if (data.name === "土星") {
      createSaturn(data);
    } else {
      const sphereGeometry = new THREE.SphereGeometry(data.size, 100, 100);
      const sphereMaterial = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(data.mapImg),
      });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.name = data.name;
      sphereMesh.planetMsg = data;
      sphereMesh.isPlanet = true;
      sphereMesh.angle = 0;
      sphereMesh.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
      );
      scene.add(sphereMesh);
    }
  };
  // 创建太阳
  const createSun = (data) => {
    let sunGroup = new THREE.Group(); //太阳的组
    let sunGeometry = new THREE.SphereGeometry(data.size, 100, 100); //太阳几何体
    let sunMaterial = new THREE.MeshLambertMaterial({
      //太阳材质
      color: new THREE.Color(0xffffff),
      map: new THREE.TextureLoader().load(data.mapImg),
    });
    let sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sunMesh);
    //太阳大气几何体
    let sunAtmosphereGeometry = new THREE.SphereGeometry(
      data.size + 8,
      100,
      100
    );
    let sunAtmosphereMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.2,
    });
    let sunAtmosphereMesh = new THREE.Mesh(
      sunAtmosphereGeometry,
      sunAtmosphereMaterial
    );
    sunGroup.add(sunAtmosphereMesh);
    sunGroup.name = data.name; //网格名字
    sunGroup.planetMsg = data;
    sunGroup.isPlanet = true; //标识为星球
    sunGroup.angle = 0; //添加初始角度
    //球体位置
    sunGroup.position.set(data.position[0], data.position[1], data.position[2]);
    scene.add(sunGroup);
  };
  //创建地球
  const createEarth = (data) => {
    let earthGroup = new THREE.Group(); //地球的组
    let earthGeometry = new THREE.SphereGeometry(data.size, 100, 100); //地球几何体
    //地球材质
    let earthMaterial = new THREE.MeshPhysicalMaterial({
      map: new THREE.TextureLoader().load(data.mapImg),
      normalScale: new THREE.Vector2(10, 10), //凹凸深度
      normalMap: new THREE.TextureLoader().load(earthNormalImg), //法线贴图
    });
    let earthMesh = new THREE.Mesh(earthGeometry, earthMaterial); //地球网格
    earthGroup.add(earthMesh); //将地球网格添加到地球组中
    //地球云层几何体
    let earthCloudsGeometry = new THREE.SphereGeometry(
      data.size + 2,
      100,
      1000
    );
    //地球云层材质
    let earthCloudsMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.4,
      map: new THREE.TextureLoader().load(earthCloudsImg),
    });
    //地球云层网格
    let earthCloudsMesh = new THREE.Mesh(
      earthCloudsGeometry,
      earthCloudsMaterial
    );
    earthGroup.add(earthCloudsMesh); //将地球云层网格添加到地球组中

    //创建月球轨道
    let moonTrackGeometry = new THREE.RingBufferGeometry( //圆环几何体
      data.size + 40,
      data.size + 40.2,
      100
    );
    let moonTrackMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    let moonTrackMesh = new THREE.Mesh(moonTrackGeometry, moonTrackMaterial);
    moonTrackMesh.rotation.set(0.5 * Math.PI, 0, 0);
    earthGroup.add(moonTrackMesh);

    //创建月球
    let moonGeometry = new THREE.SphereGeometry(10, 100, 100);
    let moonMaterial = new THREE.MeshPhysicalMaterial({
      map: new THREE.TextureLoader().load(moonImg),
      normalScale: new THREE.Vector2(10, 10), //凹凸深度
    });
    let moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(data.size + 40, 0, 0);
    earthGroup.add(moonMesh);

    earthGroup.name = data.name; //网格名字
    earthGroup.planetMsg = data;
    earthGroup.isPlanet = true; //标识为星球
    earthGroup.angle = 0; //添加初始角度
    //球体位置
    earthGroup.position.set(
      data.position[0],
      data.position[1],
      data.position[2]
    );
    scene.add(earthGroup);
  };
  // 创建金星
  const createVenus = (data) => {
    let venusGroup = new THREE.Group(); //金星的组
    let venusGeometry = new THREE.SphereGeometry(data.size, 100, 100); //金星几何体
    //金星材质
    let venusMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0xffffff),
      map: new THREE.TextureLoader().load(data.mapImg),
    });
    let venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
    venusGroup.add(venusMesh);
    //金星大气几何体
    let venusAtmosphereGeometry = new THREE.SphereGeometry(
      data.size + 2,
      100,
      100
    );
    //金星大气材质
    let venusAtmosphereMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.5,
      map: new THREE.TextureLoader().load(venusAtmosphereImg),
    });
    let venusAtmosphereMesh = new THREE.Mesh(
      venusAtmosphereGeometry,
      venusAtmosphereMaterial
    );
    venusGroup.add(venusAtmosphereMesh); //将大气添加到组中
    venusGroup.name = data.name; //网格名字
    venusGroup.planetMsg = data;
    venusGroup.isPlanet = true; //标识为星球
    venusGroup.angle = 0; //添加初始角度
    //球体位置
    venusGroup.position.set(
      data.position[0],
      data.position[1],
      data.position[2]
    );
    scene.add(venusGroup);
  };
  // 创建土星
  const createSaturn = (data) => {
    let saturnGroup = new THREE.Group(); //土星的组
    let saturnGeometry = new THREE.SphereGeometry(data.size, 100, 100); //土星几何体
    let saturnMaterial = new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader().load(data.mapImg), //土星材质
    });
    let saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial); //土星网格
    saturnGroup.add(saturnMesh); //将土星网格添加到地球组中
    //创建土星环1
    let saturnTrackGeometry1 = new THREE.RingBufferGeometry( //圆环几何体
      data.size + 10,
      data.size + 25,
      100
    );
    let saturnTrackMaterial1 = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.8,
      color: 0xc0ad87,
      side: THREE.DoubleSide,
    });
    let saturnTrackMesh1 = new THREE.Mesh(
      saturnTrackGeometry1,
      saturnTrackMaterial1
    );
    saturnTrackMesh1.rotation.set(0.5 * Math.PI, 0, 0);
    //创建土星环2
    let saturnTrackGeometry2 = new THREE.RingBufferGeometry( //圆环几何体
      data.size + 26,
      data.size + 30,
      100
    );
    let saturnTrackMaterial2 = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.5,
      color: 0xc0ad87,
      side: THREE.DoubleSide,
    });
    let saturnTrackMesh2 = new THREE.Mesh(
      saturnTrackGeometry2,
      saturnTrackMaterial2
    );
    saturnTrackMesh2.rotation.set(0.5 * Math.PI, 0, 0);
    //创建土星环3
    let saturnTrackGeometry3 = new THREE.RingBufferGeometry( //圆环几何体
      data.size + 30.1,
      data.size + 32,
      100
    );
    let saturnTrackMaterial3 = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.3,
      color: 0xc0ad87,
      side: THREE.DoubleSide,
    });
    let saturnTrackMesh3 = new THREE.Mesh(
      saturnTrackGeometry3,
      saturnTrackMaterial3
    );
    saturnTrackMesh3.rotation.set(0.5 * Math.PI, 0, 0);
    saturnGroup.add(saturnTrackMesh1); //将网格添加到组中
    saturnGroup.add(saturnTrackMesh2);
    saturnGroup.add(saturnTrackMesh3);
    saturnGroup.name = data.name; //网格名字
    saturnGroup.planetMsg = data;
    saturnGroup.isPlanet = true; //标识为星球
    saturnGroup.angle = 0; //添加初始角度
    //球体位置
    saturnGroup.position.set(
      data.position[0],
      data.position[1],
      data.position[2]
    );
    scene.add(saturnGroup);
  };

  const createTrack = (data) => {
    if (data.name == "太阳") {
      //去除太阳中心由圆环形成的圆形
      return;
    }
    //创建轨迹
    let trackGeometry = new THREE.RingBufferGeometry( //圆环几何体
      data.position[0],
      data.position[0] + 2,
      1000
    );
    //圆环材质
    let trackMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
    trackMesh.position.set(0, 0, 0); //轨道位置
    trackMesh.rotation.set(0.5 * Math.PI, 0, 0); //旋转轨道至水平
    scene.add(trackMesh);
  };

  //球体公转
  const sphereRevolution = (data) => {
    scene.children.forEach((e) => {
      //过滤出星球
      if (e.isPlanet) {
        let planetData = data.filter((d) => d.name == e.name)[0]; //获取球体数据
        e.angle =
          e.angle + planetData.revolution >= 2 * Math.PI
            ? 0
            : e.angle + planetData.revolution;
        e.position.set(
          planetData.position[0] * Math.sin(e.angle),
          0,
          planetData.position[0] * Math.cos(e.angle)
        );
      }
    });
  };
  //球体自转
  const sphereRotation = (data) => {
    scene.children.forEach((e) => {
      //过滤出星球
      if (e.isPlanet) {
        let planetData = data.filter((d) => d.name == e.name)[0];
        if (e.name == "土星") {
          e.rotation.x = 0.05 * 2 * Math.PI;
          // return;
        }
        //天王星自转轴特殊
        if (e.name == "天王星") {
          e.rotation.z =
            e.rotation.z + planetData.rotation >= 2 * Math.PI
              ? 0
              : e.rotation.z + planetData.rotation;
          return;
        }
        e.rotation.y =
          e.rotation.y + planetData.rotation >= 2 * Math.PI
            ? 0
            : e.rotation.y + planetData.rotation;
      }
    });
  };
  //飞向对象(旧相机位置，旧对象位置，新相机位置，新对象位置，动画时间，回调)
  function flyTo(oldP, oldT, newP, newT, time, callBack) {
    if (TWEEN) {
      let tween = new TWEEN.Tween({
        x1: oldP.x, // 相机x
        y1: oldP.y, // 相机y
        z1: oldP.z, // 相机z
        x2: oldT.x, // 控制点的中心点x
        y2: oldT.y, // 控制点的中心点y
        z2: oldT.z, // 控制点的中心点z
      });
      tween.to(
        {
          x1: newP.x,
          y1: newP.y,
          z1: newP.z,
          x2: newT.x,
          y2: newT.y,
          z2: newT.z,
        },
        time
      );
      tween.onUpdate(function (object) {
        camera.position.set(object.x1, object.y1, object.z1);
        orbitControls.target.x = object.x2;
        orbitControls.target.y = object.y2;
        orbitControls.target.z = object.z2;
        orbitControls?.update();
      });
      tween.onComplete(function () {
        callBack?.();
      });
      tween.easing(TWEEN.Easing.Cubic.InOut);
      tween.start();
    }
  }

  // 过渡完成 回调
  const overTransition = (flag) => {
    return () => {
      if (!flag) return;
      callBack?.();
      console.log("???");
    };
  };

  //双击事件
  function handleDblclick(e) {
    if (!planetDivRef) return;
    const dom = planetDivRef.current;
    const width = dom.clientWidth; //窗口宽度
    const height = dom.clientHeight; //窗口高
    //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标
    const x = (e.offsetX / width) * 2 - 1;
    const y = -(e.offsetY / height) * 2 + 1;
    setMouse({
      x,
      y,
    });
    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    raycaster.setFromCamera({ x, y }, camera);
    //生成星球网格列表
    let palnetMeshList = [];
    scene.children.forEach((p) => {
      if (p.name !== "") {
        palnetMeshList.push(p);
      }
    });
    // 获取raycaster直线和星球网格列表相交的集合
    let intersects = raycaster.intersectObjects(palnetMeshList);
    //判断是否点击到虚无的太空
    if (intersects.length == 0) {
      return;
    }
    let newClickPlanet = {};
    //判断是否是行星
    if (intersects[0].object.isPlanet) {
      newClickPlanet = intersects[0].object;
    } else {
      newClickPlanet = intersects[0].object.parent;
    }
    setClickPlanet(newClickPlanet);
    //获取球体半径
    let planetR = "";
    planetList.forEach((e) => {
      if (e.name == newClickPlanet.name) {
        planetR = e.size;
      }
    });
    //相机新位置
    let newP = {
      x: newClickPlanet.position.x,
      y: newClickPlanet.position.y + planetR,
      z: newClickPlanet.position.z + 2.5 * planetR,
    };
    let flyTime = 2000;
    //双击到星球需要停止公转（双击虚空需反转公转状态）
    if (newClickPlanet.type !== "Scene") {
      isRevolution = isRotation = false;
      flyTo(
        camera.position,
        orbitControls.target,
        newP,
        newClickPlanet.position,
        flyTime,
        overTransition(newClickPlanet.name === "地球")
      );
    } else {
      isRevolution = isRotation = !isRotation;
    }
  }

  const createOrbitControls = () => {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enablePan = false; //右键平移拖拽
    orbitControls.enableZoom = true; //鼠标缩放
    orbitControls.enableDamping = true; //滑动阻尼
    orbitControls.dampingFactor = 0.05; //(默认.25)
    orbitControls.minDistance = 200; //相机距离目标最小距离
    orbitControls.maxDistance = 2700; //相机距离目标最大距离
    orbitControls.autoRotate = true; //自转(相机)
    orbitControls.autoRotateSpeed = 0; //自转速度
  };

  const render = () => {
    //请求动画帧，屏幕每刷新一次调用一次，绑定屏幕刷新频率
    anId = requestAnimationFrame(render); //记录下动画id可用于销毁场景
    orbitControls?.update(); //鼠标控件实时更新
    renderer.render(scene, camera);
    //控制公转
    if (isRevolution) {
      sphereRevolution(planetList); //球体公转
    }
    if (isRotation) {
      sphereRotation(planetList); //球体自转
    }
    //监听画布双击事件
    document.getElementById("planetDiv") &&
      document
        .getElementById("planetDiv")
        .addEventListener("dblclick", handleDblclick, false);
    TWEEN?.update(); //更新动画
  };

  return (
    <div className="container">
      <div id="planetDiv" ref={planetDivRef}></div>
    </div>
  );
}

export default Footmark;
