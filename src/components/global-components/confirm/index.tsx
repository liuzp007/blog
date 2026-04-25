import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import './index.css'
import SvgSuccess from './svg/svg-success'
import SvgError from './svg/svg-error'
import SvgWarning from './svg/svg-warning'
import { Button } from 'antd'

//类型
const types = {
  Success: 'success',
  Error: 'error',
  Warning: 'warning'
}

//svg
const iconSvg: Record<string, React.ComponentType> = {
  [types.Success]: SvgSuccess,
  [types.Error]: SvgError,
  [types.Warning]: SvgWarning
}

//message提示默认持续时间
const DurationTime = 3000

interface HintPopOptions {
  title?: string
  content?: string
  isCancel?: boolean
  type?: string
  cancelText?: string
  okText?: string
  close?: () => void
  cancel?: () => void
  sure?: () => void
  zIndex?: number
}

function HintPop(options: HintPopOptions) {
  const {
    title = '标题',
    content = '内容',
    isCancel = false,
    type,
    cancelText = '取消',
    okText = '确定',
    close,
    cancel,
    sure,
    zIndex = 999999999
  } = options
  const Icon = iconSvg[type!]
  const submit = (submitType: string) => {
    if (submitType === 'cancel') {
      cancel && cancel()
    } else {
      sure && sure()
    }
    close && close()
  }
  return (
    <div className="confirm-mask" style={{ zIndex }}>
      <div className="confirm-dialog">
        <div className="confirm-dialog__title">{title}</div>
        <div className="confirm-dialog__body">
          <div className="confirm-dialog__body-inner">
            <span className="confirm-dialog__icon">{Icon && <Icon />}</span>
            <p className="confirm-dialog__text">{content}</p>
          </div>
        </div>
        <div className="confirm-dialog__footer">
          {isCancel ? (
            <>
              <Button
                className="confirm-dialog__action ui-button-secondary"
                onClick={() => submit('cancel')}
              >
                {cancelText}
              </Button>
              <Button
                type="primary"
                className="confirm-dialog__action ui-button-primary"
                onClick={() => submit('sure')}
              >
                {okText}
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              className="confirm-dialog__action ui-button-primary"
              onClick={() => submit('sure')}
            >
              {okText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

class Hint {
  div: HTMLDivElement
  root: Root | null = null
  constructor() {
    this.div = document.createElement('div')
    this.root = null
  }
  //打开确认框
  show = (options: HintPopOptions) => {
    document.body.appendChild(this.div)
    if (!this.root) {
      this.root = createRoot(this.div)
    }
    this.root.render(<HintPop {...options} close={this.close} />)
  }
  //关闭确认框
  close = () => {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
    if (this.div.parentNode) {
      this.div.parentNode.removeChild(this.div)
    }
  }
}

/**
 *
 * @content 要提示的内容
 * @duration 提示持续时间
 */
interface MessagePopOptions {
  content?: string
  type?: string
}

function MessagePop(options: MessagePopOptions) {
  const { content = '', type } = options
  const Icon = iconSvg[type!]
  return (
    <div className="confirm-toast">
      <span className="confirm-toast__icon">{Icon && <Icon />}</span>
      <p className="confirm-toast__text">{content}</p>
    </div>
  )
}

class Message {
  div: HTMLDivElement
  root: Root | null = null
  options: MessagePopOptions
  timer: NodeJS.Timeout | null = null
  constructor() {
    this.div = document.createElement('div')
    this.options = {}
    this.root = null
  }
  //打开吐司
  show = () => {
    this.clearTimer()
    this.div.style.position = 'absolute'
    if (!this.div.parentNode) {
      document.body.appendChild(this.div)
    }

    if (!this.root) {
      this.root = createRoot(this.div)
    }
    this.root.render(<MessagePop {...this.options} />)
    this.countDownRemove()
  }
  //吐司关闭倒计时
  countDownRemove = () => {
    const opts = this.options as MessagePopOptions & { duration?: number }
    const duration = opts.duration ?? DurationTime
    this.timer = setTimeout(() => {
      this.close()
      this.timer = null
    }, duration)
  }
  clearTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
  //关闭吐司方法
  close = () => {
    this.clearTimer()
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
    if (this.div.parentNode) {
      this.div.parentNode.removeChild(this.div)
    }
  }
  //配置
  setOptions = (type: string, content: string, duration?: number) => {
    this.options.type = type
    this.options.content = content
    ;(this.options as MessagePopOptions & { duration?: number }).duration = duration
    this.show()
  }
  //成功的吐司
  mesSuccess = (content: string, duration?: number) => {
    this.setOptions(types.Success, content, duration)
  }
  //失败的吐司
  mesError = (content: string, duration?: number) => {
    this.setOptions(types.Error, content, duration)
  }
  //警告的吐司
  mesWarning = (content: string, duration?: number) => {
    this.setOptions(types.Warning, content, duration)
  }
}

const m = new Message()
const h = new Hint()

// New export style
const message = {
  success: (content: string, duration?: number) => m.mesSuccess(content, duration),
  error: (content: string, duration?: number) => m.mesError(content, duration),
  warning: (content: string, duration?: number) => m.mesWarning(content, duration)
}

const hint = h.show

export { message, hint }
export default {
  hint,
  message
}
