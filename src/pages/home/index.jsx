import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import clickEffect from '@/components/setMouse'

import './index.scss'

export default function Home() {

  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    clickEffect(true)
    return () => {
      clickEffect(false)
    }
  }, [])

  const toPath = () => {
    this.props.history.push('/main')
  }
  const showModalFun = ()=>{
    setShowModal(!showModal)
  }
  return (
    <div className={'HomeWrap'} >
      <p className={"title"} onClick={toPath} >hello word</p>
      <p className={"title"} >Welcome to my blog</p>
      <div className="toggle">
        <div className="toggle_body" onClick={showModalFun} style={showModal ?{transform:'scale(.8,.8)'}:{}}>
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i}>1</div>
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
      >

      </Modal>
    </div>
  )
}





