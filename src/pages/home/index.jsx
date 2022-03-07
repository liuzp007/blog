import React, { useState, useEffect } from 'react';
import { message, Modal, notification, Divider, Space, Button } from 'antd';
import clickEffect from '@/components/setMouse'
import {
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
} from '@ant-design/icons';
import './index.scss'

const Context = React.createContext({ name: 'Default' });

export default function Home({ history }) {

  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [play, setPlay] = useState(true);

  useEffect(() => {
    clickEffect(true)

    return () => {
      clickEffect(false)
    }
  }, [])

  const toPath = () => {
    history.push('/main')
  }
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
    const playPromise = myMusic.play(); //chrom 5.0 以上 play() 需要返回promise
    setPlay(play => {
      if (play&&playPromise !== null) {
        playPromise.then(() => {
          myMusic.play()
      }).catch(e=> {
        myMusic.play()
         throw(e)
      })
      } else {
        myMusic.pause();
      }
      return !play
    })



  }
  return (
    <div className={'HomeWrap'} id={'HomeWrap'} >
      <p className={"title"} onClick={autoPlay} >Hello world
        <audio controls="controls" height="100" width="100" id="myMusic">
          <source src="./music/suddenly.mp3" type="audio/mp3" />
          <embed height="100" width="100" src="./music/suddenly.mp3" />
          <source src="./music/suddenly.mp3" type="audio/ogg"></source>
        </audio>
      </p>
      <p className={"title"} onClick={toPath}  >Welcome to my blog</p>
      <div className="toggle">
        <div className="toggle_body" onClick={showModalFun} style={showModal ? { transform: 'scale(.8,.8)' } : {}}>
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
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i}>
                <svg version="1.1" x="0px" y="0px" width="72px" height="72px" viewBox="0 0 72 72">
                  <path d="M67.572,37.08L38.686,8.168c-1.476-1.534-3.892-1.534-5.368,0L4.428,37.08c-1.48,1.529-0.929,2.786,1.224,2.786h6.023V62.07	c0,1.603,0.068,2.912,2.966,2.912h14.022V42.706h14.67v22.276h14.72c2.211,0,2.272-1.307,2.272-2.912V39.866h6.019C68.493,39.866,69.048,38.613,67.572,37.08z"></path>
                </svg>
                <div className="after" onClick={() => { message.success("You're the best. I didn't think it when I said it, but I said it when I thought about it") }} >
                  you see what ? 👀

                  {/* <Context.Provider value={{ name: 'blog' }}>
                    {contextHolder}
                    <div onClick={(e) => openNotification('topRight',e)}>
                      you see what ? 👀
                    </div>
                  </Context.Provider> */}
                </div>
              </div>
            ))
          }
        </div>
      </Modal>
    </div>
  )
}





