import React, { useEffect, useRef, useState } from 'react'
import File from '../../components/showFile';

import './index.scss';

export default function Resume() {
  useEffect(() => {
  }, [])
  return (
    <div className={'resumeWrap'}>
      <File src={'./test.pdf'} />
    </div>
  )
}




