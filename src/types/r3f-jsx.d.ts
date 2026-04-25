// 全局 JSX 元素声明：与 @react-three/fiber 的 IntrinsicElements 做交叉扩展，
// 仅补充项目中需要但库类型未覆盖的标签。
import type { ThreeElements } from '@react-three/fiber'

declare global {
  namespace JSX {
    // 交叉扩展而非重写，避免覆盖 R3F 已有类型（mesh/group/instancedMesh 等）。
    interface IntrinsicElements extends ThreeElements {
      // 额外补充项目中使用到但可能未显式列出的标签
      primitive?: unknown
      line?: unknown
      lineBasicMaterial?: unknown
      bufferGeometry?: unknown
      bufferAttribute?: unknown
      icosahedronGeometry?: unknown
      // three 基础光源/雾，确保在某些版本下可识别
      ambientLight?: unknown
      directionalLight?: unknown
      fog?: unknown
      // 后期处理占位（@react-three/postprocessing）——统一使用 unknown
      EffectComposer?: unknown
      Bloom?: unknown
      TiltShift2?: unknown
      Vignette?: unknown
      ChromaticAberration?: unknown
      Noise?: unknown
      DepthOfField?: unknown
      ToneMapping?: unknown
    }
  }
}

export {}
