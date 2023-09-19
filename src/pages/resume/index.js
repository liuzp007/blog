import React, { useEffect, useRef, useState } from 'react'
import File from '../../components/showFile';

import { Upload, Button, Icon } from 'antd';
import './index.scss';

export default function Resume() {
  const [url, setURL] = useState('../../assets/test.pdf')
  const fileRef = useRef(null)
  useEffect(() => {
  }, [])
  return (
    <div className={'resumeWrap'}>
      <File src={'./test.pdf'} />
    </div>
  )
}




