/// <reference types="vite/client" />

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
