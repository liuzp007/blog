import { useEffect, useRef, useState } from 'react'
import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* eslint-disable react/no-unknown-property */

function readCssVar(element: HTMLElement | null, name: string, fallback = 'currentColor') {
  if (typeof window === 'undefined') return fallback
  const target = element ?? document.documentElement
  const value = window.getComputedStyle(target).getPropertyValue(name).trim()
  return value || fallback
}

function getHomeRootElement() {
  if (typeof document === 'undefined') return null
  return document.querySelector('.HomeWrap') as HTMLElement | null
}

function readHomeCssVar(name: string, fallback = 'currentColor') {
  return readCssVar(getHomeRootElement(), name, fallback)
}

export default function HeroCore() {
  const coreRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Group>(null)
  const [palette, setPalette] = useState(() => ({
    keyLight: 'gold',
    fillLight: 'cyan',
    emissive: 'navy',
    surface: 'white'
  }))

  useEffect(() => {
    setPalette({
      keyLight: readHomeCssVar('--home-accent-gold', 'gold'),
      fillLight: readHomeCssVar('--home-accent-cyan', 'cyan'),
      emissive: readHomeCssVar('--home-hero-core-emissive', 'navy'),
      surface: readHomeCssVar('--home-hero-core-surface', 'white')
    })
  }, [])

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.26
      coreRef.current.rotation.y = t * 0.48
      coreRef.current.position.x = pointer.x * 0.72
      coreRef.current.position.y = pointer.y * 0.5
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.34
      ringRef.current.rotation.x = Math.sin(t * 0.6) * 0.24
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * 0.2
      orbitRef.current.rotation.z = Math.sin(t * 0.4) * 0.08
    }
  })

  return (
    <group position={[0, 0.2, 0]}>
      <ambientLight intensity={0.7} />
      <pointLight intensity={2.2} position={[3, 3, 3]} color={palette.keyLight} />
      <pointLight intensity={1.8} position={[-3, -2, 2]} color={palette.fillLight} />
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.46, 2]} />
          <meshPhysicalMaterial
            roughness={0.14}
            metalness={0.66}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive={palette.emissive}
            color={palette.surface}
          />
        </mesh>
      </Float>
      <mesh ref={ringRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[2.24, 0.02, 24, 180]} />
        <meshStandardMaterial
          color={palette.fillLight}
          emissive={palette.fillLight}
          emissiveIntensity={0.6}
        />
      </mesh>
      <group ref={orbitRef}>
        {new Array(5).fill(0).map((_, index) => {
          const angle = (index / 5) * Math.PI * 2
          const radius = 2.68 + (index % 2) * 0.36
          const orbitColor = index % 2 === 0 ? palette.keyLight : palette.fillLight
          return (
            <mesh
              key={`node-${index}`}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.36,
                Math.sin(angle) * 0.8
              ]}
            >
              <sphereGeometry args={[0.08 + index * 0.012, 18, 18]} />
              <meshStandardMaterial
                color={orbitColor}
                emissive={orbitColor}
                emissiveIntensity={0.42}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
