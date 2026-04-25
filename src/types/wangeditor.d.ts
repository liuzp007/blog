declare module 'wangeditor' {
  export default class E {
    constructor(selector: string)
    config: {
      height: number
      placeholder: string
      zIndex: number
      focus: boolean
      onchange: (html: string) => void
      menus: string[]
      showFullScreen: boolean
      uploadImgAccept: string[]
      uploadImgMaxLength: number
      customUploadImg: (resultFiles: File[], insertImgFn: (url: string) => void) => void
      [key: string]: unknown
    }
    txt: {
      html(val?: string): string
      text(): string
      clear(): void
    }
    create(): void
    disable(): void
    enable(): void
    fullScreen(): void
    unFullScreen(): void
  }
}
