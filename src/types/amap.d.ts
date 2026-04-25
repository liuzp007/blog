// 最小 AMap 类型声明（仅覆盖项目中用到的结构，避免全面 any）
// 声明为全局命名空间，配合 AMapLoader 返回的对象使用

export as namespace AMap

declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, opts?: any)
    destroy(): void
    setCenter(center: any, immediately?: boolean): void
    setFitView(): void
  }

  class Marker {
    constructor(opts?: any)
    on(type: string, handler: (e: any) => void): void
    moveAlong(path: Array<[number, number]>, opts?: any): void
    getPosition(): any
  }

  class Polyline {
    constructor(opts?: any)
    setPath(path: any): void
  }

  class Icon {
    constructor(opts?: any)
  }
  class Pixel {
    constructor(x: number, y: number)
  }
  class LngLat {
    constructor(lng: number, lat: number)
  }

  function plugin(name: string | string[], cb: () => void): void
}

declare module 'AMap' {
  export = AMap
}
