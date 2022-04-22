import React, { useState, useEffect, Component } from 'react';
import {message, Modal, notification, Divider, Space, Button, Tooltip } from 'antd';
import clickEffect from '@/components/setMouse';
import ICON, { musicPlay } from './svg';
import './index.scss'
const {mesSuccess} = Component.prototype
const ModalList = [
  {
    desc: '简历',
    path: '/resume'
  },
  {
    desc: 'code',
    path: '/main'
  },
  {
    desc: null,
    path: null
  },
  {
    desc: null,
    path: null
  },
  {
    desc: null,
    path: null
  },
  {
    desc: null,
    path: null
  },
  {
    desc: null,
    path: null
  },
  {
    desc: null,
    path: null
  },
  {
    desc: null,
    path: null
  }
]

const Context = React.createContext({ name: 'Default' });

export default function Home({ history }) {

  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [, setStart] = useState(true);

  useEffect(() => {
    clickEffect(true)
    return () => {
      clickEffect(false)
    }
  }, [])

  // const toPath = () => {
  //   history.push('/main')
  // }
  const showModalFun = () => {
    setShowModal(!showModal)
  }
  const openNotification = (mes, e) => {
    e.stopPropagation();
    api.success({
      message: `ugly`,
      description: <Context.Consumer>{({ name }) => `Welcome to my ${name}!`}</Context.Consumer>,
      placement: 'topRight',
      duration: 3,
      rtl: true,
      key: 'updatable',
      onClose: () => {
        message.success("You're the best. I didn't think it when I said it, but I said it when I thought about it")
      }
    });
  };
  const autoPlay = () => {
    const myMusic = document.getElementById('myMusic')
    const playPromise = myMusic?.play(); //chrom 5.0 以上 start() 需要返回promise
    setStart(start => {
      if (start && playPromise !== null) {
        playPromise.then(() => {
          myMusic.play()
        }).catch(e => {
          myMusic.play()
          throw (e)
        })
      } else {
        myMusic.pause();
      }
      return !start
    })

  }
  const pushRouter = (path) => {
    return () => {
      if(!path) return mesSuccess('正在加急建设中。。。',1500)
      history.push(path);
    }

  }
  const HelloWorld = ' Hello world'
  const wellcome = 'wellcome my blog'
  return (
    <div className={'HomeWrap'} id={'HomeWrap'} >
      <p className={"title"} onClick={autoPlay} title="play music" >
        <Tooltip title="播放音乐：忽然-李志">
          Hello world
        </Tooltip>
        <audio controls="controls" height="100" width="100" id="myMusic">
          <source src="./music/suddenly.mp3" type="audio/mp3" />
          <embed height="100" width="100" src="./music/suddenly.mp3" />
          <source src="./music/suddenly.mp3" type="audio/ogg"></source>
        </audio>
      </p>
      <p className={"titleStyle"}  /* onClick={toPath} */  >
        {/* <span>W</span>
        <span>e</span>
        <span>l</span>
        <span>c</span>
        <span>o</span>
        <span>m</span>
        <span>e</span>
        <span></span>
        <span>m</span>
        <span>y</span>
        <span></span>
        <span>b</span>
        <span>l</span>
        <span>o</span>
        <span>g</span> */}
        {
          [...wellcome].map((v, i) => {
            return <span key={i} style={{ animationDelay: '1.2s' }} >{v.toLocaleLowerCase()}</span>

          })
        }
      </p>
      <div className="toggle">
        <div className={showModal ? "toggle_body showModalAndToggleBody" : 'toggle_body '} onClick={showModalFun} >
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i}></div>
            ))
          }
        </div>
      </div>
      <Modal
        title=""
        visible={showModal}
        onOk={showModalFun}
        onCancel={showModalFun}
        footer={''}
        closable={false}
        getContainer={() => document.getElementById('HomeWrap')}
        wrapClassName={'showModalBox'}
      >
        <div className={'modalCenter'}>
          {
            ModalList.map((i, index) => {
              return (
                <div key={index}>
                  {ICON[index > 1 ? index % 2 : index]}
                  <div className="after" onClick={pushRouter(i.path)} >
                    {i.desc ?? 'you see what ? 👀'}

                    {/* <Context.Provider value={{ name: 'blog' }}>
                      {contextHolder}
                      <div onClick={(e) => openNotification('topRight',e)}>
                        you see what ? 👀
                      </div>
                    </Context.Provider> */}
                  </div>
                </div>
              )
            })
          }
        </div>
      </Modal>
    </div>
  )
}





