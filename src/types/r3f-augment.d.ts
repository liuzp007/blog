// 通过模块扩展的方式，确保 JSX.IntrinsicElements 交叉包含 R3F 的 ThreeElements
import type { ThreeElements } from '@react-three/fiber'

declare module 'react' {
  // 扩展 React.JSX 命名空间（TS 5 的新 JSX 组织方式仍向后兼容）
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      primitive?: unknown
      line?: unknown
      lineBasicMaterial?: unknown
      bufferGeometry?: unknown
      bufferAttribute?: unknown
      icosahedronGeometry?: unknown
      ambientLight?: unknown
      directionalLight?: unknown
      fog?: unknown
      // postprocessing（以 unknown 承接）
      EffectComposer?: unknown
      Glitch?: unknown
      Bloom?: unknown
      TiltShift2?: unknown
    }
  }
}

export {}
