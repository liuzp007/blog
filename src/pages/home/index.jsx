import React, { useState, useEffect, Component, useCallback } from "react";
import { message, Modal, notification, Tooltip } from "antd";
import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";
import ParticleButton from "react-particle-effect-button";
// import clickEffect from "@/components/setMouse";
import ICON from "./svg";
import "./index.scss";
const { mesSuccess } = Component.prototype;
const ModalList = [
  {
    desc: "简历",
    path: "/resume",
  },
  {
    desc: "code",
    path: "/main",
  },
  {
    desc: "规范",
    path: "/standard",
  },
  {
    desc: '足迹',
    path: '/footmark',
  },
  {
    desc: null,
    path: null,
  },
  {
    desc: null,
    path: null,
  },
];
const particlesConfig =
  //粒子参数
  {
    background: {
      color: {
        value: "#232741",
      },
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover",
    },
    // 帧数，越低越卡,默认60
    fpsLimit: 120,
    fullScreen: {
      zIndex: -1,
      enable: true,
    },
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        push: {
          quantity: 3,
        },
        bubble: {
          distance: 200,
          duration: 2,
          opacity: 0.8,
          size: 20,
          divs: {
            distance: 200,
            duration: 0.4,
            mix: false,
            selectors: [],
          },
        },
        grab: {
          distance: 400,
        },
        //击退
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        //缓慢移动
        slow: {
          //移动速度
          factor: 1,
          //影响范围
          radius: 200,
        },
        //吸引
        attract: {
          distance: 100,
          duration: 0.4,
          easing: "ease-out-quad",
          factor: 3,
          maxSpeed: 50,
          speed: 1,
        },
      },
    },
    //  粒子的参数
    particles: {
      //粒子的颜色
      color: {
        value: "#ffffff",
      },
      //是否启动粒子碰撞
      collisions: {
        enable: true,
      },
      //粒子之间的线的参数
      links: {
        color: {
          value: "#ffffff",
        },
        distance: 150,
        enable: true,
        warp: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 7,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        //初始粒子数
        value: 160,
      },
      //透明度
      opacity: {
        value: 0.5,
        animation: {
          speed: 3,
          minimumValue: 0.1,
        },
      },
      //大小
      size: {
        random: {
          enable: true,
        },
        value: {
          min: 1,
          max: 3,
        },
        animation: {
          speed: 20,
          minimumValue: 0.1,
        },
      },
    },
  };

const Context = React.createContext({ name: "Default" });

export default function Home({ history }) {
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [, setStart] = useState(true);
  const [particleButtonHidden, setParticleButtonHidden] = useState(false);
  useEffect(() => {
    return () => {
    };
  }, []);


  const showModalFun = () => {
    setShowModal(!showModal);
  };
  const openNotification = (mes, e) => {
    e.stopPropagation();
    api.success({
      message: `ugly`,
      description: (
        <Context.Consumer>
          {({ name }) => `Welcome to my ${name}!`}
        </Context.Consumer>
      ),
      placement: "topRight",
      duration: 3,
      rtl: true,
      key: "updatable",
      onClose: () => {
        message.success(
          "You're the best. I didn't think it when I said it, but I said it when I thought about it"
        );
      },
    });
  };
  const autoPlay = () => {
    const myMusic = document.getElementById("myMusic");
    const playPromise = myMusic?.play(); //chrom 5.0 以上 start() 需要返回promise
    setStart((start) => {
      if (start && playPromise !== null) {
        playPromise
          .then(() => {
            myMusic.play();
          })
          .catch((e) => {
            myMusic.play();
            throw e;
          });
      } else {
        myMusic.pause();
      }
      return !start;
    });
  };
  const pushRouter = (path) => {
    if (!path) return mesSuccess("正在加急建设中。。。", 1500);
    history.push(path);
  };

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  return (
    <div className={"HomeWrap"} id={"HomeWrap"}>
      <p className={"title"} onClick={autoPlay} title="play music">
        <Tooltip title="播放音乐：忽然-李志">Hello world</Tooltip>
        <audio controls="controls" height="100" width="100" id="myMusic">
          <source src="./music/suddenly.mp3" type="audio/mp3" />
          <embed height="100" width="100" src="./music/suddenly.mp3" />
          <source src="./music/suddenly.mp3" type="audio/ogg"></source>
        </audio>
      </p>

      <div className="toggle">
        {ModalList.map((i, index) => {
          return i.desc ? (
            <ParticleButton
              color="#F5F6F7"
              hidden={particleButtonHidden === index}
              duration={1000}
              direction="left"
              particlesAmountCoefficient={5}
              oscillationCoefficient={20}
              onComplete={()=>pushRouter(i.path)}
              type="triangle"
            >
              <div
                key={index}
                onClick={() => {
                  setParticleButtonHidden(index);
                }}
              >
                <div className="after">
                  {ICON[index > 1 ? index % 2 : index]}
                  {i.desc ?? "you see what ? 👀"}
                </div>
              </div>
            </ParticleButton>
          ) : (
            ""
          );
        })}
      </div>

      <Particles init={particlesInit} options={particlesConfig} />
    </div>
  );
}
