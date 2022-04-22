import React, {Component} from 'react';
import BeautifyCode, { BeautifyCodeList } from '../../../../components/beautifyCode';
const list = {

  B: ` componentDidMount 生命周期函数 
    ·在DOM挂载结束后执行（在render（）执行后立即执行） 
    ·在这一步 虚拟DOM转换成真实DOM   
    一般在这个函数内 做一些消息订阅发布，开启定时器，开始网络请求等操作 可以使用 setState() 方法触发重新渲染 (re-render)
    且只会执行一次
    `,
  C: ` componentWillUnmount 生命周期函数 
  ·在组件卸载(unmounted)或销毁(destroyed)之前执行
  ·做一些清理操作，比如无效的timers、interval，或者取消网络请求，
  ·清理在componentDidMount()中创建的DOM元素(elements);
  `,
}
export default function WillMount(props) {
  return (
    <div>
      <h2 className='titles'>componentWillMount</h2>
      <BeautifyCodeList list={list} />
    </div>
  )
}


