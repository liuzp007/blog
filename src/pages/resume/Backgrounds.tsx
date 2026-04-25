import { useMemo, useRef, Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function readRootCssVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function StandardGeometry() {
  const group = useRef<THREE.Group>(null)
  const gridColor = useMemo(() => readRootCssVar('--color-success-strong', 'lime'), [])

  const boxes = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      key: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number]
    }))
  }, [])

  useFrame(state => {
    if (!group.current) return
    const time = state.clock.elapsedTime
    group.current.rotation.x = Math.sin(time * 0.2) * 0.2
    group.current.rotation.y = Math.cos(time * 0.3) * 0.2
  })

  return (
    <group ref={group}>
      {boxes.map(box => (
        <mesh key={box.key} position={box.position} rotation={box.rotation}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={gridColor} wireframe transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export function StandardBackground() {
  const standardBg = useMemo(() => readRootCssVar('--raw-slate-950', 'black'), [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: standardBg
      }}
    >
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <fog attach="fog" args={[new THREE.Color(standardBg), 5, 30]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <StandardGeometry />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </Suspense>
    </div>
  )
}
