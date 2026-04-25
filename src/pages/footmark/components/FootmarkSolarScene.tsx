import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import planetList from '../const'
import starImg from '../img/star.jpg'
import universeImg from '../img/universe.jpg'

interface FootmarkSolarSceneProps {
  progress: number
  quality: 'desktop' | 'mobile'
}

interface PlanetMesh {
  mesh: THREE.Mesh
  orbit: number
  speed: number
  angle: number
  baseY: number
  name: string
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function easeOutCubic(value: number) {
  const n = clamp01(value)
  return 1 - Math.pow(1 - n, 3)
}

export default function FootmarkSolarScene({ progress, quality }: FootmarkSolarSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(progress)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      48,
      mount.clientWidth / mount.clientHeight,
      0.1,
      6000
    )
    camera.position.set(0, 210, 860)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'mobile' ? 1.5 : 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xb9d7ff, 1.2)
    const pointLight = new THREE.PointLight(0xffd596, 2.6, 0, 1.8)
    pointLight.position.set(0, 0, 0)
    scene.add(ambientLight, pointLight)

    const textureLoader = new THREE.TextureLoader()
    const backgroundTexture = textureLoader.load(universeImg)
    scene.background = backgroundTexture

    const starGeometry = new THREE.BufferGeometry()
    const starCount = quality === 'mobile' ? 1600 : 3200
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 3600
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1800
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 3600
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({
      size: quality === 'mobile' ? 5 : 7,
      map: textureLoader.load(starImg),
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    const starField = new THREE.Points(starGeometry, starMaterial)
    scene.add(starField)

    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd27f,
      map: textureLoader.load(planetList[0].mapImg)
    })
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(58, 48, 48), sunMaterial)
    scene.add(sunMesh)

    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(76, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffca72,
        transparent: true,
        opacity: 0.24
      })
    )
    scene.add(sunGlow)

    const orbitLineMaterial = new THREE.LineBasicMaterial({
      color: 0x8ab7ff,
      transparent: true,
      opacity: 0.18
    })

    const planets: PlanetMesh[] = []
    const selectedPlanets = planetList.slice(1, quality === 'mobile' ? 6 : 8)
    const scale = quality === 'mobile' ? 0.11 : 0.13

    selectedPlanets.forEach((planet, index) => {
      const orbit = Math.max(120, planet.position[0] * scale)
      const radius = Math.max(index > 3 ? 10 : 12, planet.size * 0.12)
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 40, 40),
        new THREE.MeshStandardMaterial({
          map: textureLoader.load(planet.mapImg),
          roughness: 0.9,
          metalness: 0.05
        })
      )
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, orbit, orbit * 0.38, 0, Math.PI * 2, false, 0)
          .getPoints(160)
          .map(point => new THREE.Vector3(point.x, 0, point.y))
      )
      const orbitLine = new THREE.LineLoop(lineGeometry, orbitLineMaterial)
      orbitLine.rotation.x = Math.PI * 0.21
      scene.add(orbitLine)
      scene.add(mesh)
      planets.push({
        mesh,
        orbit,
        speed: Math.abs(planet.revolution) * 24,
        angle: index * 0.72,
        baseY: (index - 2) * 4,
        name: planet.name
      })
    })

    const earthPlanet = planets.find(item => item.name === '地球') || planets[2]
    const earthHalo = new THREE.Mesh(
      new THREE.SphereGeometry(
        earthPlanet ? earthPlanet.mesh.geometry.boundingSphere?.radius || 20 : 20,
        32,
        32
      ),
      new THREE.MeshBasicMaterial({
        color: 0x6ad7ff,
        transparent: true,
        opacity: 0.22
      })
    )
    scene.add(earthHalo)

    let rafId = 0
    const clock = new THREE.Clock()
    const earthPosition = new THREE.Vector3()
    const lookAtTarget = new THREE.Vector3()
    const startPos = new THREE.Vector3(0, 210, 860)
    const endPosOffset = new THREE.Vector3(90, 38, 150)
    const endPos = new THREE.Vector3()
    const lookAtOrigin = new THREE.Vector3(0, 0, 0)

    const resize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      const sceneProgress = easeOutCubic(progressRef.current)

      starField.rotation.y = elapsed * 0.015
      starMaterial.opacity = 0.88 - sceneProgress * 0.34
      sunMesh.rotation.y += 0.0014
      sunGlow.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.035)

      earthPosition.set(0, 0, 0)
      for (let i = 0; i < planets.length; i += 1) {
        const planet = planets[i]
        planet.angle += 0.001 + planet.speed * 0.0007
        const lift = Math.sin(elapsed * 0.35 + i) * 6
        const x = Math.cos(planet.angle) * planet.orbit
        const z = Math.sin(planet.angle) * planet.orbit * 0.42
        const y = planet.baseY + lift
        planet.mesh.position.set(x, y, z)
        planet.mesh.rotation.y += 0.003 + i * 0.00045
        if (planet.name === '地球') {
          earthPosition.copy(planet.mesh.position)
        }
      }

      earthHalo.position.copy(earthPosition)
      earthHalo.scale.setScalar(1 + sceneProgress * 0.38)
      const earthHaloMaterial = earthHalo.material as THREE.MeshBasicMaterial
      earthHaloMaterial.opacity = 0.18 + sceneProgress * 0.22

      endPos.copy(earthPosition).add(endPosOffset)
      camera.position.lerpVectors(startPos, endPos, sceneProgress)
      lookAtTarget.copy(earthPosition).lerp(lookAtOrigin, 1 - sceneProgress)
      camera.lookAt(lookAtTarget)

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
      className="footmark-cosmos__sceneLayer footmark-cosmos__sceneLayer--solar"
      ref={mountRef}
    />
  )
}
