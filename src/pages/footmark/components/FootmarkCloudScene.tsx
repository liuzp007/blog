import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import cloudTexture from '../img/cloud.png'

interface FootmarkCloudSceneProps {
  progress: number
  quality: 'desktop' | 'mobile'
}

function readElementCssVar(element: HTMLElement, name: string, fallback: string) {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return value || fallback
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function easeInOut(value: number) {
  const n = clamp01(value)
  return n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2
}

export default function FootmarkCloudScene({ progress, quality }: FootmarkCloudSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(progress)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 1, 2200)
    camera.position.set(0, 0, 560)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'mobile' ? 1.5 : 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const textureLoader = new THREE.TextureLoader()
    const cloudMap = textureLoader.load(cloudTexture)

    const fogColor = new THREE.Color(
      readElementCssVar(mount, '--footmark-text-accent-soft', 'lightskyblue')
    )
    const backgroundStartColor = new THREE.Color(
      readElementCssVar(mount, '--raw-slate-900', 'midnightblue')
    )
    const backgroundEndColor = new THREE.Color(
      readElementCssVar(mount, '--footmark-text-accent-soft', 'steelblue')
    )
    const backgroundMixColor = new THREE.Color()
    scene.fog = new THREE.Fog(fogColor, 80, 1500)

    const clouds = new THREE.Group()
    scene.add(clouds)

    const cloudCount = quality === 'mobile' ? 180 : 340
    for (let i = 0; i < cloudCount; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.12 + Math.random() * 0.16,
        depthWrite: false
      })
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(180 + Math.random() * 150, 120 + Math.random() * 80),
        material
      )
      mesh.position.set(
        (Math.random() - 0.5) * 560,
        (Math.random() - 0.5) * 320,
        -920 + Math.random() * 1840
      )
      mesh.rotation.z = Math.random() * Math.PI * 2
      mesh.rotation.x = 0.08
      clouds.add(mesh)
    }

    const backGlow = new THREE.Mesh(
      new THREE.SphereGeometry(520, 28, 28),
      new THREE.MeshBasicMaterial({
        color: 0x9fc1df,
        transparent: true,
        opacity: 0.14
      })
    )
    backGlow.position.set(0, -40, -840)
    scene.add(backGlow)

    const resize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    let rafId = 0
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      const sceneProgress = easeInOut(progressRef.current)

      const startZ = 520
      const endZ = -260
      camera.position.z = startZ + (endZ - startZ) * sceneProgress
      camera.position.x = Math.sin(elapsed * 0.18) * 18
      camera.position.y = Math.cos(elapsed * 0.14) * 10

      backgroundMixColor.lerpColors(backgroundStartColor, backgroundEndColor, sceneProgress)
      renderer.setClearColor(backgroundMixColor, 0.8)

      const cloudChildren = clouds.children
      for (let i = 0; i < cloudChildren.length; i += 1) {
        const mesh = cloudChildren[i] as THREE.Mesh
        const drift = 0.08 + i * 0.00015
        mesh.position.x += Math.sin(elapsed * drift + i) * 0.08
        mesh.position.y += Math.cos(elapsed * drift * 1.2 + i) * 0.04
        mesh.rotation.z += 0.00032
        const material = mesh.material as THREE.MeshBasicMaterial
        material.opacity = 0.08 + sceneProgress * 0.16
      }

      const glowMaterial = backGlow.material as THREE.MeshBasicMaterial
      glowMaterial.opacity = 0.08 + sceneProgress * 0.06
      backGlow.scale.setScalar(1 + sceneProgress * 0.24)

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('resize', resize, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      scene.traverse(object => {
        const typedObject = object as THREE.Object3D & {
          geometry?: { dispose?: () => void }
          material?: { dispose?: () => void } | Array<{ dispose?: () => void }>
        }
        if (typedObject.geometry) {
          typedObject.geometry.dispose?.()
        }
        if (typedObject.material) {
          const material = typedObject.material
          if (Array.isArray(material)) {
            material.forEach(item => item.dispose?.())
          } else {
            material?.dispose?.()
          }
        }
      })
      mount.removeChild(renderer.domElement)
    }
  }, [quality])

  return (
    <div
      className="footmark-cosmos__sceneLayer footmark-cosmos__sceneLayer--cloud"
      ref={mountRef}
    />
  )
}
