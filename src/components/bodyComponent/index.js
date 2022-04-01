import React ,{useState, Component} from 'react';
import {BeautifyCode, BeautifyCodeList} from '../beautifyCode';
export default function bodyComponent({title='标题',data={}}) {
  return (
    <div>
      <h2 className='titles'>{title}</h2>
      <BeautifyCodeList list={data}/>
    </div>
  )
}









