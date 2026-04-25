/// <reference types="vite/client" />

// 第三方库最小类型声明占位（避免隐式 any）
declare module 'animejs' {
  interface AnimeInstance {
    pause(): void
    play(): void
    restart(): void
    add(params: AnimeParams, offset?: number): AnimeInstance
  }
  interface AnimeParams {
    targets?: any
    [key: string]: any
  }
  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance
    timeline(params?: AnimeParams): AnimeInstance
    set(targets: any, params: Record<string, unknown>): void
    stagger(val: number): (el: any, i: number, l: number) => number
  }
  const anime: AnimeStatic
  export default anime
}

// PrismJS 动态组件最小声明
declare module 'prismjs/components/prism-javascript' {
  const v: unknown
  export default v
}
declare module 'prismjs/components/prism-typescript' {
  const v: unknown
  export default v
}
declare module 'prismjs/components/prism-tsx' {
  const v: unknown
  export default v
}

// redux-logger 类型声明
declare module 'redux-logger' {
  import { Middleware } from '@reduxjs/toolkit'
  const createLogger: () => Middleware
  export default createLogger
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.ico' {
  const content: string
  export default content
}

declare module '*.bmp' {
  const content: string
  export default content
}
