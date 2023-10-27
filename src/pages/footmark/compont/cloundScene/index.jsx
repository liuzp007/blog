import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import cloud from '../../img/cloud.png';
import './index.scss'
const Session5 = (props) => {
  const {callBack} = props
  const session5 = useRef(null);
  const StartTime = Date.now();
  let camera, scene, renderer, mesh;

  const CloudCount = 1000;
  const perCloudZ = 15;
  const cameraPositionZ = CloudCount * perCloudZ;
  const RandomPositionX = 80;
  const RandomPositionY = 120;
  const BackGroundColor = '#1e4877';

  const pageWidth = window.innerWidth;
  const pageHeight = window.innerHeight;

  const init = () => {
    camera = new THREE.PerspectiveCamera(70, pageWidth / pageHeight, 1, 1000);
    camera.position.x = Math.floor(RandomPositionX / 2);
    camera.position.z = cameraPositionZ;

    const fog = new THREE.Fog(BackGroundColor, 1, 1000);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(BackGroundColor);

    const texture = new THREE.TextureLoader().load(cloud);
    const geometry = new THREE.PlaneGeometry(126, 126);
    const geometries = [];

    const vShader = `
      varying vec2 vUv;
      void main()
      {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;
    const fShader = `
      uniform sampler2D map;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      varying vec2 vUv;
      void main()
      {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor = texture2D(map, vUv );
        gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          type: 't',
          value: texture
        },
        fogColor: {
          type: 'c',
          value: fog.color
        },
        fogNear: {
          type: 'f',
          value: fog.near
        },
        fogFar: {
          type: 'f',
          value: fog.far
        },
      },
      vertexShader: vShader,
      fragmentShader: fShader,
      transparent: true
    });

    for (var i = 0; i < CloudCount; i++) {
      const instanceGeometry = geometry.clone();
      instanceGeometry.translate(Math.random() * RandomPositionX, -Math.random() * RandomPositionY, i * perCloudZ);
      geometries.push(instanceGeometry);
    }

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);

    mesh = new THREE.Mesh(mergedGeometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(pageWidth, pageHeight);

    session5.current.appendChild(renderer.domElement);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    camera.position.z = cameraPositionZ - (((Date.now() - StartTime) * 0.24) % cameraPositionZ);
    renderer.render(scene, camera);
  };

  useEffect(() => {
    init();
    animate();
    setTimeout(() => {
      callBack?.()
    }, 4000);
  }, []);

  return (
    <div className="session5" ref={session5}>
    </div>
  );
};

export default Session5;
