import React, { Component, forwardRef } from 'react'
// Legacy editor dependency is optional in current runtime; keep import for compatibility.
// eslint-disable-next-line import/no-unresolved
import E from 'wangeditor'
import './index.css'
import { uploadImgAccept, highConfig, middleConfig, lowConfig } from './config'
import { FolderEnum, uploadFile } from '@/api/uploadFile'
import { message } from '@/components/global-components/confirm'

interface EditorProps {
  html?: string
  height?: number
  isFocus?: boolean
  placeholder?: string
  oss?: any
  maxCount?: number
  zIndex?: number
  uploadImgMaxLength?: number
  isStat?: boolean
  montedNode: string
  disabled?: boolean
  configList?: any
  value?: string
  onChange?: (val: string) => void
  isBlur?: boolean
  blur?: (val: boolean) => void
  style?: React.CSSProperties
}

interface EditorState {
  count: number
  isOut: boolean
  html: string
}

type EditorWindow = Window & {
  $$imgSrc?: (path: string) => string
}

function resolveUploadedImageUrl(fpName: string) {
  if (/^(blob:|data:|https?:)/.test(fpName)) return fpName
  const imgBuilder = (window as EditorWindow).$$imgSrc
  if (typeof imgBuilder === 'function') {
    return imgBuilder(fpName)
  }
  return fpName
}

export default class Editor extends Component<EditorProps, EditorState> {
  state: EditorState = {
    count: 0,
    isOut: false,
    html: ''
  }

  editor: any = null
  client: any = null

  static defaultProps = {
    html: '',
    height: 500,
    isFocus: false,
    placeholder: '',
    maxCount: 5000,
    uploadImgMaxLength: 5,
    isStat: false
  }

  componentDidMount() {
    this.init()
    if (this.props.isBlur) {
      document.addEventListener('mousedown', this.packup)
    }
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (this.props.oss && this.props.oss !== prevProps.oss) {
      this.client = this.props.oss
    }

    if (this.props.isBlur !== prevProps.isBlur) {
      if (this.props.isBlur) {
        document.addEventListener('mousedown', this.packup)
      } else {
        document.removeEventListener('mousedown', this.packup)
      }
    }

    const prevValue = prevProps.html ?? prevProps.value ?? ''
    const nextValue = this.props.html ?? this.props.value ?? ''
    if (prevValue !== nextValue) {
      this.setValue(nextValue)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.packup)
  }

  packup = (e: MouseEvent) => {
    const editorElement = document.getElementById(this.props.montedNode)
    if (editorElement && editorElement.parentNode && editorElement.parentNode.parentNode) {
      const myEditor = editorElement.parentNode.parentNode
      if (e.target === myEditor || myEditor.contains(e.target as Node)) {
        return
      }
      this.props.isBlur && this.props.blur && this.props.blur(true)
    }
  }
  //change
  change = (currentCount: number, maxCount: number, html: string) => {
    currentCount > maxCount
      ? this.setState({ isOut: true, count: currentCount, html })
      : this.setState({ isOut: false, count: currentCount, html })
  }

  //设置内容
  setValue(val: string) {
    if (this.editor) {
      this.editor.txt.html(val) //设置富文本内容
    }
  }

  //初始化
  init = () => {
    const {
      html,
      height,
      isFocus = true,
      placeholder,
      zIndex,
      configList = highConfig,
      maxCount = 5000,
      value,
      onChange,
      uploadImgMaxLength,
      montedNode,
      disabled
    } = this.props
    const editor = new E(`#${montedNode}`) //获取富文本实例
    this.editor = editor
    editor.config.height = height!
    editor.config.placeholder = placeholder!
    zIndex && (editor.config.zIndex = zIndex)
    editor.config.focus = isFocus
    editor.config.onchange = (html: string) => {
      const l = editor.txt
        .text()
        .trim()
        .replace(/&nbsp;/gi, '').length
      const v = html.trim()
      onChange && onChange(v)
      this.change(l, maxCount, v)
    }
    // this.setClient();
    editor.config.menus = configList.menu //配置菜单
    editor.config.showFullScreen = configList.isFullScreen //配置是否可以全屏
    editor.config.uploadImgAccept = uploadImgAccept //可上传图片的文件类型
    editor.config.uploadImgMaxLength = uploadImgMaxLength! //限制一次能上传几张图片
    editor.config.customUploadImg = async (
      resultFiles: File[],
      insertImgFn: (url: string) => void
    ) => {
      for (const file of Array.from(resultFiles)) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('folder', FolderEnum.US)
          const { fpName } = await uploadFile(formData)
          insertImgFn(resolveUploadedImageUrl(fpName))
        } catch (error) {
          console.error('Editor image upload failed:', error)
          message.error('图片上传失败', 2000)
        }
      }
    }
    editor.create()
    this.setValue(html ? html : value ? value : '')
    disabled && this.editor.disable()
  }
  //清空富文本内容
  clear = () => {
    this.editor.txt.clear()
  }
  //全屏
  fullScreen = () => {
    this.editor.fullScreen()
  }
  //取消全屏
  unFullScreen = () => {
    this.editor.unFullScreen()
  }
  //禁用
  disable = () => {
    this.editor.disable()
  }
  //接触禁用
  enable = () => {
    this.editor.enable()
  }

  render() {
    const { count } = this.state
    const { maxCount = 5000, isStat, montedNode, style } = this.props
    return (
      <div className="legacy-editor" style={style}>
        <div id={montedNode} style={{ resize: 'both' }}></div>
        {isStat ? (
          <div className="legacy-editor__count">
            <span
              className={
                count > maxCount
                  ? 'legacy-editor__count-value legacy-editor__count-value--danger'
                  : 'legacy-editor__count-value'
              }
            >
              {count}
            </span>
            /{maxCount}
          </div>
        ) : null}
      </div>
    )
  }
}

type EditorRef = Editor | null
type EditorFCProps = React.ComponentProps<typeof Editor>

export const HighEditor = forwardRef<EditorRef, EditorFCProps>((props, ref) => {
  return <Editor {...props} ref={ref} configList={highConfig} />
})
HighEditor.displayName = 'HighEditor'

export const MiddleEditor = forwardRef<EditorRef, EditorFCProps>((props, ref) => {
  return <Editor {...props} ref={ref} configList={middleConfig} />
})
MiddleEditor.displayName = 'MiddleEditor'

export const LowEditor = forwardRef<EditorRef, EditorFCProps>((props, ref) => {
  return <Editor {...props} ref={ref} configList={lowConfig} />
})
LowEditor.displayName = 'LowEditor'
