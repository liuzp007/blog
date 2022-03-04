import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './index.css';
//类型
const types = {
    'Success': 'success',
    'Error': 'error',
    'Warning': 'warning'
}
//svg
const iconSvg = {
    [types.Success]: require('./svg/SvgSuccess').default,
    [types.Error]: require('./svg/SvgError').default,
    [types.Warning]: require('./svg/SvgWarning').default
}

//message提示默认持续时间
const DurationTime = 3000;



/**
 * 
 * @content 要提示的内容
 * @duration 提示持续时间 
 * @type : string
 * @cancelText : string
 * @okText : string
 * @isCancel : function
 * @cancel : function
 * @sure : function
 * @zIndex : number
 * title 标题
 * content 内容
 * type 提示类型
 * cancelText 取消按钮的文字
 * okText 确定按钮的文字
 * isCancel 是否需求取消按钮
 * cancel 点击取消执行的函数
 * sure 点击确定执行的回调函数
 * zIndex 控制蒙层的定位显示层级
 */
function HintPop(options) {
    let { title = '标题', content = '内容', isCancel = false,
        type, cancelText = '取消', okText = '确定', close, cancel, sure,
        zIndex = 999999999 } = options;
    const Icon = iconSvg[type];
    const submit = (type) => {
        if (type === 'cancel') {
            cancel && cancel();
        } else {
            sure && sure();
        }
        close();
    }
    return <div className='hint_box_mask' style={{ zIndex }}>
        <div class="hint_content">
            <div class='title'>
                {title}
            </div>
            <div class="content">
                <div>
                    <span><Icon /></span>
                    <p>{content}</p>
                </div>
            </div>
            <div class="footer">
                {
                    isCancel ?
                        <>
                            <span onClick={() => submit('cancel')} class='cancel btn'>{cancelText}</span>
                            <span onClick={submit} class='i_see btn'>{okText}</span>
                        </> :
                        <span onClick={submit} class='i_see btn'>{okText}</span>
                }
            </div>
        </div>
    </div>
}


class Hint {
    constructor() {
        this.div = document.createElement('div');
    }
    //打开确认框
    show = (options) => {
        document.body.appendChild(this.div);
        ReactDom.render(
            <HintPop {...options} close={this.close} />,
            this.div
        )
    }
    //关闭确认框
    close = () => {
        const unmountResult = ReactDom.unmountComponentAtNode(this.div);
        if (unmountResult && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
        }
    }
}

/**
 * 
 * @content 要提示的内容
 * @duration 提示持续时间 
 */
function MessagePop(options) {
    const { content = '', type } = options;
    const Icon = iconSvg[type];
    return <div className='my_message_box'>
        <span><Icon /></span><p>{content}</p>
    </div>
}
class Message {
    constructor() {
        this.div = document.createElement('div');
        this.options = {};
    }
    //打开吐司
    show = () => {
        document.body.appendChild(this.div);
        console.log(this.options)
        ReactDom.render(
            <MessagePop {...this.options} />,
            this.div
        )
        this.countDownRemove();
    }
    //吐司关闭倒计时
    countDownRemove = () => {
        const timer = setTimeout(() => {
            this.close();
            clearTimeout(timer);
        }, this.options.duration);
    }
    //关闭吐司方法
    close = () => {
        const unmountResult = ReactDom.unmountComponentAtNode(this.div);
        if (unmountResult && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
        }
    }
    //配置
    setOptions = (type, content, duration) => {
        this.options.type = type;
        this.options.content = content;
        this.options.duration = duration;
        this.show();
    }
    //成功的吐司
    mesSuccess = (content, duration = DurationTime) => {
        this.setOptions(types.Success, content, duration)
    }
    //失败的吐司
    mesError = (content, duration = DurationTime) => {
        this.setOptions(types.Error, content, duration)
    }
    //警告的吐司
    mesWarning = (content, duration = DurationTime) => {
        this.setOptions(types.Warning, content, duration)
    }
}

const m = new Message();
const h = new Hint();
const message = (options)=>{
    m.setOptions(options.type,options.content,options.duration=DurationTime);
}
const hint = h.show;
Component.prototype.hint = hint;
Component.prototype.mesSuccess = m.mesSuccess;
Component.prototype.mesError = m.mesError;
Component.prototype.mesWarning = m.mesWarning;
export { message }
export default {
    hint,
    message
}