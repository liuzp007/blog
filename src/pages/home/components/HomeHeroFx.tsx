import { Canvas } from '@react-three/fiber'
import HeroCore from './HeroCore'

interface HomeHeroFxProps {
  enabled: boolean
}

export default function HomeHeroFx({ enabled }: HomeHeroFxProps) {
  if (!enabled) return null

  return (
    <div className="canvas-container canvas-container--active">
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 44 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <HeroCore />
      </Canvas>
    </div>
  )
}
