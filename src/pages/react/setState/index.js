import React from 'react';
import {BeautifyCode, BeautifyCodeList} from '../../../components/beautifyCode';


let renderObj = {
  A: `setState 是同步的还是异步的？`,
  B: `   在React中，如果是由React引发的事件处理（onClick等）或者是React的生命周期中，调用setState 不会立即更新this.state，所以感觉是异步的（如果想要在
这里拿到更新后的state 可以在setState(partialState,callback) 中的 callback拿到更新后的值 ,

因为在这里setState是批量更新的，会等这个函数执行到最后才会更新状态，避免重复渲染，消耗性能，
如果是原生的addEventLister 添加事件 或者是 setTimeout/setintervel  不需要等到函数执行完
`,
C: `底层实现原理：
在React的setStatel函数实现中,根据一个变量 isBatchingUpdates:判断是直接更新this.state还是放到队列中，isBatchingUpdates默认是false,也就表示 
setState会同步更新this.state, 但是,有一个函数 batchedUpdates,这个函数会把isBatchingUpdates修改为 true,而当React在调用事件处理函数之前就会调用batchedUpdates,
造成的后果,就是由React控制的事件处理 过程setState不会同步更新this.state.
`,
  D: `setStaet的‘异步’ 不是内部由异步代码实现的，本身的执行过程以及代码都是同步的，只是在合成事件和生命周期的调用顺序在更新之前，导致没法立即拿到更新后的值
`,
}

export default function setState(props) {
  return (
    <div>
      <h2 className='titles'>setState</h2>
      <BeautifyCodeList list={renderObj}/>
    </div>
  )
}

