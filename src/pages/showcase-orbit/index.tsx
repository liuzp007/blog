import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftOutlined,
  CompassOutlined,
  ReloadOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { Alert, Button, Progress, Segmented, Slider, Tag } from 'antd'
import { Link } from 'react-router-dom'
import './index.css'

type FieldKey = 'midnight' | 'teal' | 'ember'
type GameStatus = 'idle' | 'aiming' | 'flying' | 'success' | 'failed'

interface Planet {
  x: number
  y: number
  radius: number
  mass: number
  tone: number
  depth: number
}

interface RingGate {
  id: number
  x: number
  y: number
  rx: number
  ry: number
  depth: number
  hit: boolean
  pulse: number
}

interface Mission {
  name: string
  planets: Planet[]
  rings: RingGate[]
}

interface StarParticle {
  x: number
  y: number
  size: number
  depth: number
  alpha: number
}

interface BurstParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

interface FieldPalette {
  label: string
  bgTop: string
  bgBottom: string
  nebula: string
  ring: string
  trail: string
  hud: string
  lineMedium: string
  lineSoft: string
  canvasWhite: string
  canvasPlanetShadow: string
  canvasPlanetFade: string
  canvasLaunchShadow: string
  planetShades: [string, string, string]
}

interface CometState {
  x: number
  y: number
  vx: number
  vy: number
  bornAt: number
  shotHits: number
  trail: Array<{ x: number; y: number; life: number }>
}

const WORLD_WIDTH = 1000
const WORLD_HEIGHT = 620
const TOTAL_SHOTS = 6
const TARGET_RINGS = 3
const LAUNCH_PAD = { x: 150, y: 512 }

function readCssVar(element: HTMLElement | null, name: string, fallback = 'currentColor') {
  if (typeof window === 'undefined') return fallback
  const target = element ?? document.documentElement
  const value = window.getComputedStyle(target).getPropertyValue(name).trim()
  return value || fallback
}

const FIELD_PRESETS: Record<
  FieldKey,
  {
    label: string
    bgTop: string
    bgBottom: string
    nebula: string
    ring: string
    trail: string
    hud: string
    lineMedium: string
    lineSoft: string
    canvasWhite: string
    canvasPlanetShadow: string
    canvasPlanetFade: string
    canvasLaunchShadow: string
    planetShades: [string, string, string]
  }
> = {
  midnight: {
    label: '极夜航道',
    bgTop: '--orbit-bg-top',
    bgBottom: '--orbit-bg-bottom',
    nebula: '--orbit-color-nebula',
    ring: '--orbit-color-ring',
    trail: '--orbit-color-trail',
    hud: '--orbit-color-hud',
    lineMedium: '--orbit-line-medium',
    lineSoft: '--orbit-line-soft',
    canvasWhite: '--orbit-canvas-white',
    canvasPlanetShadow: '--orbit-canvas-planet-shadow',
    canvasPlanetFade: '--orbit-canvas-planet-fade',
    canvasLaunchShadow: '--orbit-canvas-launch-shadow',
    planetShades: ['--orbit-planet-a', '--orbit-planet-b', '--orbit-planet-c']
  },
  teal: {
    label: '青潮跃迁',
    bgTop: '--orbit-bg-top',
    bgBottom: '--orbit-bg-bottom',
    nebula: '--orbit-color-nebula',
    ring: '--orbit-color-ring',
    trail: '--orbit-color-trail',
    hud: '--orbit-color-hud',
    lineMedium: '--orbit-line-medium',
    lineSoft: '--orbit-line-soft',
    canvasWhite: '--orbit-canvas-white',
    canvasPlanetShadow: '--orbit-canvas-planet-shadow',
    canvasPlanetFade: '--orbit-canvas-planet-fade',
    canvasLaunchShadow: '--orbit-canvas-launch-shadow',
    planetShades: ['--orbit-planet-a', '--orbit-planet-b', '--orbit-planet-c']
  },
  ember: {
    label: '日珥热层',
    bgTop: '--orbit-bg-top',
    bgBottom: '--orbit-bg-bottom',
    nebula: '--orbit-color-nebula',
    ring: '--orbit-color-ring',
    trail: '--orbit-color-trail',
    hud: '--orbit-color-hud',
    lineMedium: '--orbit-line-medium',
    lineSoft: '--orbit-line-soft',
    canvasWhite: '--orbit-canvas-white',
    canvasPlanetShadow: '--orbit-canvas-planet-shadow',
    canvasPlanetFade: '--orbit-canvas-planet-fade',
    canvasLaunchShadow: '--orbit-canvas-launch-shadow',
    planetShades: ['--orbit-planet-a', '--orbit-planet-b', '--orbit-planet-c']
  }
}

function resolveFieldPalette(
  element: HTMLElement | null,
  preset: (typeof FIELD_PRESETS)[FieldKey]
): FieldPalette {
  return {
    label: preset.label,
    bgTop: readCssVar(element, preset.bgTop),
    bgBottom: readCssVar(element, preset.bgBottom),
    nebula: readCssVar(element, preset.nebula),
    ring: readCssVar(element, preset.ring),
    trail: readCssVar(element, preset.trail),
    hud: readCssVar(element, preset.hud),
    lineMedium: readCssVar(element, preset.lineMedium),
    lineSoft: readCssVar(element, preset.lineSoft),
    canvasWhite: readCssVar(element, preset.canvasWhite),
    canvasPlanetShadow: readCssVar(element, preset.canvasPlanetShadow),
    canvasPlanetFade: readCssVar(element, preset.canvasPlanetFade),
    canvasLaunchShadow: readCssVar(element, preset.canvasLaunchShadow),
    planetShades: [
      readCssVar(element, preset.planetShades[0]),
      readCssVar(element, preset.planetShades[1]),
      readCssVar(element, preset.planetShades[2])
    ]
  }
}

const MISSION_LAYOUTS: Mission[] = [
  {
    name: '月弧走廊',
    planets: [
      { x: 430, y: 242, radius: 52, mass: 11800, tone: 0, depth: 0.2 },
      { x: 688, y: 354, radius: 74, mass: 19000, tone: 1, depth: 0.55 }
    ],
    rings: [
      { id: 1, x: 534, y: 146, rx: 48, ry: 18, depth: 0.18, hit: false, pulse: 0 },
      { id: 2, x: 770, y: 206, rx: 54, ry: 20, depth: 0.4, hit: false, pulse: 0 },
      { id: 3, x: 830, y: 438, rx: 58, ry: 24, depth: 0.62, hit: false, pulse: 0 }
    ]
  },
  {
    name: '潮汐拱门',
    planets: [
      { x: 388, y: 188, radius: 46, mass: 9800, tone: 1, depth: 0.15 },
      { x: 620, y: 286, radius: 68, mass: 17600, tone: 2, depth: 0.42 },
      { x: 826, y: 402, radius: 58, mass: 13200, tone: 0, depth: 0.64 }
    ],
    rings: [
      { id: 1, x: 524, y: 126, rx: 44, ry: 17, depth: 0.14, hit: false, pulse: 0 },
      { id: 2, x: 732, y: 284, rx: 50, ry: 19, depth: 0.42, hit: false, pulse: 0 },
      { id: 3, x: 870, y: 190, rx: 60, ry: 22, depth: 0.22, hit: false, pulse: 0 }
    ]
  },
  {
    name: '碎星回廊',
    planets: [
      { x: 470, y: 326, radius: 78, mass: 21200, tone: 2, depth: 0.45 },
      { x: 750, y: 182, radius: 56, mass: 12000, tone: 0, depth: 0.18 }
    ],
    rings: [
      { id: 1, x: 342, y: 166, rx: 48, ry: 18, depth: 0.12, hit: false, pulse: 0 },
      { id: 2, x: 634, y: 122, rx: 52, ry: 19, depth: 0.1, hit: false, pulse: 0 },
      { id: 3, x: 882, y: 344, rx: 62, ry: 24, depth: 0.55, hit: false, pulse: 0 }
    ]
  }
]

const STATUS_LABEL: Record<GameStatus, string> = {
  idle: '待发射',
  aiming: '瞄准中',
  flying: '飞行中',
  success: '任务完成',
  failed: '任务失败'
}

const STATUS_COLOR: Record<GameStatus, string> = {
  idle: 'processing',
  aiming: 'blue',
  flying: 'gold',
  success: 'green',
  failed: 'red'
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function withOpacity(color: string, opacity: number) {
  if (!color.startsWith('#')) return color
  const alpha = Math.round(clamp(opacity, 0, 1) * 255)
    .toString(16)
    .padStart(2, '0')
  return `${color}${alpha}`
}

function createMission(seed: number) {
  const layout = MISSION_LAYOUTS[seed % MISSION_LAYOUTS.length]
  return {
    name: layout.name,
    planets: layout.planets.map(planet => ({ ...planet })),
    rings: layout.rings.map(ring => ({ ...ring }))
  }
}

function createStarField(seed: number) {
  const stars: StarParticle[] = []
  let value = seed * 17 + 23
  for (let index = 0; index < 80; index += 1) {
    value = (value * 9301 + 49297) % 233280
    const rx = value / 233280
    value = (value * 9301 + 49297) % 233280
    const ry = value / 233280
    value = (value * 9301 + 49297) % 233280
    const rz = value / 233280
    stars.push({
      x: rx * WORLD_WIDTH,
      y: ry * WORLD_HEIGHT,
      size: 0.8 + rz * 2.1,
      depth: 0.25 + rz * 0.9,
      alpha: 0.18 + rz * 0.58
    })
  }
  return stars
}

function getViewport(width: number, height: number) {
  const scale = Math.min(width / WORLD_WIDTH, height / WORLD_HEIGHT)
  return {
    scale,
    offsetX: (width - WORLD_WIDTH * scale) / 2,
    offsetY: (height - WORLD_HEIGHT * scale) / 2
  }
}

export default function ShowcaseOrbit() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fieldRef = useRef<FieldPalette>(resolveFieldPalette(null, FIELD_PRESETS.midnight))
  const gravityRef = useRef(62)
  const thrustRef = useRef(72)
  const missionRef = useRef<Mission>(createMission(0))
  const starsRef = useRef<StarParticle[]>(createStarField(0))
  const cometRef = useRef<CometState | null>(null)
  const burstRef = useRef<BurstParticle[]>([])
  const pointerRef = useRef({ x: LAUNCH_PAD.x, y: LAUNCH_PAD.y, active: false })
  const aimRef = useRef({
    active: false,
    pointerId: -1,
    x: LAUNCH_PAD.x,
    y: LAUNCH_PAD.y
  })
  const shotsLeftRef = useRef(TOTAL_SHOTS)
  const ringsHitRef = useRef(0)
  const bestChainRef = useRef(0)
  const statusRef = useRef<GameStatus>('idle')
  const missionSeedRef = useRef(0)

  const [fieldKey, setFieldKey] = useState<FieldKey>('midnight')
  const [gravityStrength, setGravityStrength] = useState(62)
  const [thrustPower, setThrustPower] = useState(72)
  const [shotsLeft, setShotsLeft] = useState(TOTAL_SHOTS)
  const [ringsHit, setRingsHit] = useState(0)
  const [bestChain, setBestChain] = useState(0)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [message, setMessage] = useState(
    '按住左下角彗星拖拽，再松手发射，借行星引力穿过 3 个光环。'
  )
  const [missionName, setMissionName] = useState(missionRef.current.name)
  const [ringStatus, setRingStatus] = useState(missionRef.current.rings.map(() => false))
  const activeField = resolveFieldPalette(rootRef.current, FIELD_PRESETS[fieldKey])

  const focusStage = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return

    window.requestAnimationFrame(() => {
      stage.focus({ preventScroll: true })
    })
  }, [])

  const progressPercent = useMemo(() => Math.round((ringsHit / TARGET_RINGS) * 100), [ringsHit])

  const fieldOptions = useMemo(
    () => [
      { label: FIELD_PRESETS.midnight.label, value: 'midnight' },
      { label: FIELD_PRESETS.teal.label, value: 'teal' },
      { label: FIELD_PRESETS.ember.label, value: 'ember' }
    ],
    []
  )

  useEffect(() => {
    fieldRef.current = resolveFieldPalette(rootRef.current, FIELD_PRESETS[fieldKey])
  }, [fieldKey])

  useEffect(() => {
    gravityRef.current = gravityStrength
  }, [gravityStrength])

  useEffect(() => {
    thrustRef.current = thrustPower
  }, [thrustPower])

  const applyMission = useCallback((seed: number) => {
    missionSeedRef.current = seed
    const nextMission = createMission(seed)
    missionRef.current = nextMission
    starsRef.current = createStarField(seed)
    cometRef.current = null
    burstRef.current = []
    aimRef.current.active = false
    setMissionName(nextMission.name)
    setRingStatus(nextMission.rings.map(() => false))
  }, [])

  const resetMission = useCallback(
    (seed = missionSeedRef.current) => {
      applyMission(seed)
      shotsLeftRef.current = TOTAL_SHOTS
      ringsHitRef.current = 0
      bestChainRef.current = 0
      statusRef.current = 'idle'
      setShotsLeft(TOTAL_SHOTS)
      setRingsHit(0)
      setBestChain(0)
      setStatus('idle')
      setMessage('拖拽左下角彗星，或聚焦舞台后用方向键瞄准、回车发射，借行星引力穿过 3 个光环。')
    },
    [applyMission]
  )

  const reshuffleMission = useCallback(() => {
    const nextSeed = missionSeedRef.current + 1
    resetMission(nextSeed)
    focusStage()
  }, [focusStage, resetMission])

  const handleResetClick = useCallback(() => {
    resetMission()
    focusStage()
  }, [focusStage, resetMission])

  const handleFieldChange = useCallback((value: string | number) => {
    setFieldKey(value as FieldKey)
  }, [])

  useEffect(() => {
    resetMission(0)
  }, [resetMission])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let raf = 0
    let viewport = getViewport(0, 0)

    const syncCanvasSize = () => {
      const rect = stage.getBoundingClientRect()
      width = rect.width
      height = rect.height
      viewport = getViewport(width, height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const screenToWorld = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect()
      return {
        x: clamp((clientX - rect.left - viewport.offsetX) / viewport.scale, 0, WORLD_WIDTH),
        y: clamp((clientY - rect.top - viewport.offsetY) / viewport.scale, 0, WORLD_HEIGHT)
      }
    }

    const pushBurst = (x: number, y: number, color: string, spread = 1) => {
      for (let index = 0; index < 16; index += 1) {
        const angle = (Math.PI * 2 * index) / 16 + Math.random() * 0.32
        const speed = (34 + Math.random() * 46) * spread
        burstRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.7 + Math.random() * 0.4,
          color
        })
      }
    }

    const setUiStatus = (nextStatus: GameStatus, nextMessage: string) => {
      statusRef.current = nextStatus
      setStatus(nextStatus)
      setMessage(nextMessage)
    }

    const endShot = (reason: string) => {
      const currentComet = cometRef.current
      if (!currentComet) return
      const shotHits = currentComet.shotHits
      cometRef.current = null
      aimRef.current.active = false

      if (ringsHitRef.current >= TARGET_RINGS) {
        setUiStatus('success', `漂亮，三道光环已全部穿越，${missionRef.current.name} 任务完成。`)
        pushBurst(currentComet.x, currentComet.y, fieldRef.current.ring, 1.35)
        return
      }

      if (shotsLeftRef.current <= 0) {
        setUiStatus('failed', `本轮推进器耗尽。${reason}，点击“重置任务”再来一局。`)
        return
      }

      if (shotHits > 0) {
        setUiStatus('idle', `这一发连过 ${shotHits} 环。${reason}，继续下一发。`)
      } else {
        setUiStatus('idle', `${reason}，调整角度再试一次。`)
      }
    }

    const launchComet = () => {
      if (
        !aimRef.current.active ||
        statusRef.current === 'success' ||
        statusRef.current === 'failed'
      ) {
        aimRef.current.active = false
        return
      }

      const pullX = LAUNCH_PAD.x - aimRef.current.x
      const pullY = LAUNCH_PAD.y - aimRef.current.y
      const pullLength = Math.hypot(pullX, pullY)
      if (pullLength < 18) {
        aimRef.current.active = false
        setUiStatus('idle', '拖远一点再松手，才会有足够的推进力。')
        return
      }

      const limited = clamp(pullLength, 0, 130)
      const normalizedX = pullX / pullLength
      const normalizedY = pullY / pullLength
      const force = (1.7 + thrustRef.current / 65) * limited

      shotsLeftRef.current -= 1
      setShotsLeft(shotsLeftRef.current)

      cometRef.current = {
        x: LAUNCH_PAD.x,
        y: LAUNCH_PAD.y,
        vx: normalizedX * force,
        vy: normalizedY * force,
        bornAt: performance.now(),
        shotHits: 0,
        trail: []
      }

      pushBurst(LAUNCH_PAD.x, LAUNCH_PAD.y, fieldRef.current.hud, 0.8)
      setUiStatus('flying', '已发射，观察引力牵引并寻找最佳弹弓轨迹。')
      aimRef.current.active = false
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (statusRef.current === 'success' || statusRef.current === 'failed' || cometRef.current)
        return
      const point = screenToWorld(event.clientX, event.clientY)
      pointerRef.current = { ...point, active: true }
      const distance = Math.hypot(point.x - LAUNCH_PAD.x, point.y - LAUNCH_PAD.y)
      if (distance > 34) return
      aimRef.current = {
        active: true,
        pointerId: event.pointerId,
        x: point.x,
        y: point.y
      }
      setUiStatus('aiming', '拖拽决定初始方向与力度，松手后进入弹弓轨道。')
      stage.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const point = screenToWorld(event.clientX, event.clientY)
      pointerRef.current = { ...point, active: true }
      if (!aimRef.current.active) return
      aimRef.current.x = clamp(point.x, LAUNCH_PAD.x - 140, LAUNCH_PAD.x + 48)
      aimRef.current.y = clamp(point.y, LAUNCH_PAD.y - 140, LAUNCH_PAD.y + 80)
    }

    const handlePointerUp = (event: PointerEvent) => {
      pointerRef.current.active = false
      if (!aimRef.current.active) return
      if (aimRef.current.pointerId !== -1) {
        try {
          stage.releasePointerCapture(aimRef.current.pointerId)
        } catch (error) {
          void error
        }
      }
      if (event.pointerId !== aimRef.current.pointerId && aimRef.current.pointerId !== -1) return
      launchComet()
    }

    const activateKeyboardAim = () => {
      if (statusRef.current === 'success' || statusRef.current === 'failed' || cometRef.current)
        return

      if (!aimRef.current.active) {
        aimRef.current = {
          active: true,
          pointerId: -1,
          x: LAUNCH_PAD.x - 72,
          y: LAUNCH_PAD.y - 40
        }
      }

      pointerRef.current = {
        x: aimRef.current.x,
        y: aimRef.current.y,
        active: true
      }
      setUiStatus('aiming', '键盘瞄准已开启，方向键微调，回车或空格发射。')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event
      const isArrowKey = key.startsWith('Arrow')
      const isLaunchKey = key === 'Enter' || key === ' '
      const isCancelKey = key === 'Escape'

      if (!isArrowKey && !isLaunchKey && !isCancelKey) return

      event.preventDefault()

      if (isCancelKey) {
        if (!aimRef.current.active) return

        aimRef.current.active = false
        aimRef.current.pointerId = -1
        pointerRef.current.active = false
        setUiStatus('idle', '已取消当前瞄准，重新调整后再发射。')
        return
      }

      if (isLaunchKey) {
        if (event.repeat) return
        if (!aimRef.current.active) {
          activateKeyboardAim()
          return
        }

        pointerRef.current.active = false
        launchComet()
        return
      }

      if (statusRef.current === 'success' || statusRef.current === 'failed' || cometRef.current)
        return

      if (!aimRef.current.active) {
        activateKeyboardAim()
      }

      const step = event.shiftKey ? 18 : 10
      let nextX = aimRef.current.x
      let nextY = aimRef.current.y

      if (key === 'ArrowLeft') nextX -= step
      if (key === 'ArrowRight') nextX += step
      if (key === 'ArrowUp') nextY -= step
      if (key === 'ArrowDown') nextY += step

      aimRef.current.active = true
      aimRef.current.pointerId = -1
      aimRef.current.x = clamp(nextX, LAUNCH_PAD.x - 140, LAUNCH_PAD.x + 48)
      aimRef.current.y = clamp(nextY, LAUNCH_PAD.y - 140, LAUNCH_PAD.y + 80)
      pointerRef.current = {
        x: aimRef.current.x,
        y: aimRef.current.y,
        active: true
      }
      setUiStatus('aiming', '键盘瞄准中，方向键微调，回车或空格发射。')
    }

    const drawPlanet = (planet: Planet, time: number) => {
      const palette = fieldRef.current.planetShades
      const shadowY = planet.y + planet.radius * (0.82 + planet.depth * 0.22)
      ctx.beginPath()
      ctx.ellipse(
        planet.x,
        shadowY,
        planet.radius * 1.22,
        planet.radius * (0.24 + planet.depth * 0.08),
        0,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = fieldRef.current.canvasPlanetShadow
      ctx.fill()

      const gradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.24,
        planet.y - planet.radius * 0.36,
        planet.radius * 0.12,
        planet.x,
        planet.y,
        planet.radius * 1.24
      )
      gradient.addColorStop(0, fieldRef.current.canvasWhite)
      gradient.addColorStop(0.18, palette[planet.tone])
      gradient.addColorStop(1, fieldRef.current.canvasPlanetFade)
      ctx.beginPath()
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(planet.x, planet.y, planet.radius * 1.08, 0, Math.PI * 2)
      ctx.strokeStyle = `${palette[planet.tone]}44`
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(
        planet.x,
        planet.y + Math.sin(time * 0.8 + planet.depth * 6) * 2,
        planet.radius * 1.6,
        planet.radius * 0.42,
        time * 0.14 + planet.depth,
        0,
        Math.PI * 2
      )
      ctx.strokeStyle = fieldRef.current.lineMedium
      ctx.lineWidth = 1
      ctx.stroke()
    }

    const drawRing = (ring: RingGate, time: number) => {
      const glowAlpha = ring.hit ? 0.5 : 0.16 + Math.sin(time * 2.2 + ring.id) * 0.06
      ctx.beginPath()
      ctx.ellipse(ring.x, ring.y, ring.rx, ring.ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = ring.hit
        ? `${fieldRef.current.ring}cc`
        : withOpacity(fieldRef.current.canvasWhite, glowAlpha)
      ctx.lineWidth = ring.hit ? 4 : 2
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(
        ring.x,
        ring.y + ring.depth * 10,
        ring.rx * 1.14,
        ring.ry * 0.72,
        0,
        0,
        Math.PI * 2
      )
      ctx.strokeStyle = ring.hit ? `${fieldRef.current.hud}66` : fieldRef.current.lineSoft
      ctx.lineWidth = 1
      ctx.stroke()

      if (ring.pulse > 0.02) {
        ctx.beginPath()
        ctx.ellipse(
          ring.x,
          ring.y,
          ring.rx + (1 - ring.pulse) * 24,
          ring.ry + (1 - ring.pulse) * 12,
          0,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = withOpacity(fieldRef.current.canvasWhite, ring.pulse * 0.42)
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const drawProjectedPath = () => {
      if (!aimRef.current.active) return
      const pullX = LAUNCH_PAD.x - aimRef.current.x
      const pullY = LAUNCH_PAD.y - aimRef.current.y
      const pullLength = Math.hypot(pullX, pullY)
      if (pullLength < 10) return

      const velocityScale = (1.7 + thrustRef.current / 65) * clamp(pullLength, 0, 130)
      let ghostX = LAUNCH_PAD.x
      let ghostY = LAUNCH_PAD.y
      let ghostVx = (pullX / pullLength) * velocityScale
      let ghostVy = (pullY / pullLength) * velocityScale

      ctx.save()
      ctx.setLineDash([4, 10])
      ctx.beginPath()
      ctx.moveTo(ghostX, ghostY)
      for (let index = 0; index < 48; index += 1) {
        missionRef.current.planets.forEach(planet => {
          const dx = planet.x - ghostX
          const dy = planet.y - ghostY
          const distanceSq = Math.max(
            dx * dx + dy * dy,
            (planet.radius + 24) * (planet.radius + 24)
          )
          const force = (gravityRef.current * 0.23 * planet.mass) / distanceSq
          const distance = Math.sqrt(distanceSq)
          ghostVx += (dx / distance) * force * 0.2
          ghostVy += (dy / distance) * force * 0.2
        })
        ghostX += ghostVx * 0.028
        ghostY += ghostVy * 0.028
        ctx.lineTo(ghostX, ghostY)
      }
      ctx.strokeStyle = withOpacity(fieldRef.current.canvasWhite, 0.34)
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
    }

    const drawLaunchPad = (time: number) => {
      const hoverDistance = Math.hypot(
        pointerRef.current.x - LAUNCH_PAD.x,
        pointerRef.current.y - LAUNCH_PAD.y
      )
      const activeBoost = aimRef.current.active || hoverDistance < 32
      const pulse = activeBoost
        ? 0.95 + Math.sin(time * 6) * 0.05
        : 0.74 + Math.sin(time * 3) * 0.04

      ctx.beginPath()
      ctx.ellipse(LAUNCH_PAD.x, LAUNCH_PAD.y + 18, 70, 18, 0, 0, Math.PI * 2)
      ctx.fillStyle = fieldRef.current.canvasLaunchShadow
      ctx.fill()

      ctx.beginPath()
      ctx.arc(LAUNCH_PAD.x, LAUNCH_PAD.y, 18, 0, Math.PI * 2)
      ctx.fillStyle = fieldRef.current.trail
      ctx.fill()

      ctx.beginPath()
      ctx.arc(LAUNCH_PAD.x, LAUNCH_PAD.y, 28 + pulse * 8, 0, Math.PI * 2)
      ctx.strokeStyle = withOpacity(fieldRef.current.canvasWhite, 0.16 + pulse * 0.2)
      ctx.lineWidth = 2
      ctx.stroke()

      if (aimRef.current.active) {
        ctx.beginPath()
        ctx.moveTo(LAUNCH_PAD.x, LAUNCH_PAD.y)
        ctx.lineTo(aimRef.current.x, aimRef.current.y)
        ctx.strokeStyle = `${fieldRef.current.hud}cc`
        ctx.lineWidth = 3
        ctx.stroke()
      }
    }

    const render = (now: number) => {
      const time = now * 0.001
      ctx.clearRect(0, 0, width, height)

      ctx.save()
      ctx.translate(viewport.offsetX, viewport.offsetY)
      ctx.scale(viewport.scale, viewport.scale)

      const background = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT)
      background.addColorStop(0, fieldRef.current.bgTop)
      background.addColorStop(1, fieldRef.current.bgBottom)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

      const nebula = ctx.createRadialGradient(780, 140, 30, 780, 140, 340)
      nebula.addColorStop(0, `${fieldRef.current.nebula}66`)
      nebula.addColorStop(0.42, `${fieldRef.current.nebula}18`)
      nebula.addColorStop(1, 'transparent')
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

      starsRef.current.forEach((star, index) => {
        const parallaxX = (pointerRef.current.x - WORLD_WIDTH * 0.5) * 0.01 * star.depth
        const twinkle = 0.75 + Math.sin(time * (0.8 + star.depth) + index) * 0.25
        ctx.beginPath()
        ctx.arc(star.x + parallaxX, star.y, star.size * twinkle, 0, Math.PI * 2)
        ctx.fillStyle = withOpacity(fieldRef.current.canvasWhite, star.alpha)
        ctx.fill()
      })

      ctx.strokeStyle = withOpacity(fieldRef.current.canvasWhite, 0.05)
      ctx.lineWidth = 1
      for (let index = 1; index <= 5; index += 1) {
        const y = WORLD_HEIGHT - index * 78
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(WORLD_WIDTH, y)
        ctx.stroke()
      }

      missionRef.current.rings.forEach(ring => {
        ring.pulse *= 0.94
        drawRing(ring, time)
      })

      missionRef.current.planets.forEach(planet => {
        drawPlanet(planet, time)
      })

      drawProjectedPath()
      drawLaunchPad(time)

      const comet = cometRef.current
      if (comet) {
        const delta = 1 / 60
        missionRef.current.planets.forEach(planet => {
          const dx = planet.x - comet.x
          const dy = planet.y - comet.y
          const distanceSq = Math.max(
            dx * dx + dy * dy,
            (planet.radius + 16) * (planet.radius + 16)
          )
          const distance = Math.sqrt(distanceSq)
          const force = (gravityRef.current * 0.23 * planet.mass) / distanceSq
          comet.vx += (dx / distance) * force * delta
          comet.vy += (dy / distance) * force * delta
        })

        comet.x += comet.vx * delta
        comet.y += comet.vy * delta
        comet.trail.unshift({ x: comet.x, y: comet.y, life: 1 })
        comet.trail = comet.trail
          .slice(0, 24)
          .map(item => ({ ...item, life: item.life * 0.92 }))
          .filter(item => item.life > 0.08)

        missionRef.current.rings.forEach((ring, index) => {
          if (ring.hit) return
          const dx = (comet.x - ring.x) / ring.rx
          const dy = (comet.y - ring.y) / ring.ry
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance <= 1.08 && distance >= 0.72) {
            ring.hit = true
            ring.pulse = 1
            comet.shotHits += 1
            ringsHitRef.current += 1
            bestChainRef.current = Math.max(bestChainRef.current, comet.shotHits)
            setRingsHit(ringsHitRef.current)
            setBestChain(bestChainRef.current)
            setRingStatus(prev => {
              const next = [...prev]
              next[index] = true
              return next
            })
            pushBurst(ring.x, ring.y, fieldRef.current.ring, 1.05)
            if (ringsHitRef.current >= TARGET_RINGS) {
              endShot('最终光环已点亮')
            } else {
              setMessage(`命中第 ${ringsHitRef.current} 个光环，继续借势滑行。`)
            }
          }
        })

        const hitPlanet = missionRef.current.planets.some(
          planet => Math.hypot(comet.x - planet.x, comet.y - planet.y) <= planet.radius
        )
        const outOfWorld =
          comet.x < -80 ||
          comet.x > WORLD_WIDTH + 80 ||
          comet.y < -80 ||
          comet.y > WORLD_HEIGHT + 80
        const slowDown = now - comet.bornAt > 1200 && Math.hypot(comet.vx, comet.vy) < 28
        const timeout = now - comet.bornAt > 9000

        if (hitPlanet) {
          endShot('彗星被引力井吞没')
        } else if (outOfWorld) {
          endShot('彗星滑出了观测边界')
        } else if (slowDown || timeout) {
          endShot('推进能量已经耗尽')
        }

        comet.trail.forEach((dot, index) => {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, 7 - index * 0.22, 0, Math.PI * 2)
          ctx.fillStyle = withOpacity(fieldRef.current.canvasWhite, dot.life * 0.22)
          ctx.fill()
        })

        const cometGlow = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 26)
        cometGlow.addColorStop(0, fieldRef.current.trail)
        cometGlow.addColorStop(0.28, fieldRef.current.hud)
        cometGlow.addColorStop(1, withOpacity(fieldRef.current.canvasWhite, 0))
        ctx.beginPath()
        ctx.arc(comet.x, comet.y, 26, 0, Math.PI * 2)
        ctx.fillStyle = cometGlow
        ctx.fill()

        ctx.beginPath()
        ctx.arc(comet.x, comet.y, 7, 0, Math.PI * 2)
        ctx.fillStyle = fieldRef.current.canvasWhite
        ctx.fill()
      }

      burstRef.current = burstRef.current.filter(burst => burst.life > 0.02)
      burstRef.current.forEach(burst => {
        burst.x += burst.vx * (1 / 60)
        burst.y += burst.vy * (1 / 60)
        burst.vx *= 0.985
        burst.vy *= 0.985
        burst.life *= 0.94
        ctx.beginPath()
        ctx.arc(burst.x, burst.y, 2 + burst.life * 4, 0, Math.PI * 2)
        ctx.globalAlpha = clamp(burst.life, 0, 1)
        ctx.fillStyle = burst.color
        ctx.fill()
        ctx.globalAlpha = 1
      })

      ctx.restore()
      raf = requestAnimationFrame(render)
    }

    syncCanvasSize()
    window.addEventListener('resize', syncCanvasSize, { passive: true })
    stage.addEventListener('pointerdown', handlePointerDown)
    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerup', handlePointerUp)
    stage.addEventListener('pointerleave', handlePointerUp)
    stage.addEventListener('pointercancel', handlePointerUp)
    stage.addEventListener('keydown', handleKeyDown)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', syncCanvasSize)
      stage.removeEventListener('pointerdown', handlePointerDown)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerup', handlePointerUp)
      stage.removeEventListener('pointerleave', handlePointerUp)
      stage.removeEventListener('pointercancel', handlePointerUp)
      stage.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div ref={rootRef} className={`orbit-slinger orbit-slinger--${fieldKey}`}>
      <div className="mx-auto w-[min(1320px,calc(100%-40px))] pt-[34px] pb-[42px] max-[1120px]:w-[calc(100%-28px)] max-[1120px]:pt-6 max-[768px]:pt-[22px] max-[768px]:pb-[30px]">
        <main>
          <section className="grid items-start gap-6 min-[1121px]:grid-cols-[minmax(320px,390px)_minmax(0,1fr)] max-[768px]:gap-[18px]">
            <div className="border border-solid border-[var(--orbit-line-medium)] bg-[var(--orbit-surface-glass)] backdrop-blur-[14px] shadow-[var(--orbit-shadow-panel)] rounded-[28px] p-[28px_26px] sticky top-6">
              <p className="inline-flex items-center min-h-[34px] m-0 px-3.5 rounded-[999px] border border-solid border-[var(--orbit-line-strong)] bg-[var(--orbit-surface-chip)] text-[12px] tracking-[0.18em] uppercase font-[var(--font-family-tech)] text-[var(--orbit-text-label)]">
                作品展 / 03
              </p>
              <h1 className="m-[16px_0_0] font-[var(--font-family-tech)] text-[clamp(44px,7vw,72px)] leading-[0.96] tracking-[0.06em] uppercase text-[var(--orbit-text-strong)] [text-shadow:0_0_24px_color-mix(in_srgb,var(--orbit-color-ring)_26%,transparent)]">
                引力弹弓
              </h1>
              <p className="m-[20px_0_0] max-w-[26ch] leading-[1.92] text-[var(--orbit-text-muted)]">
                拖拽左下角的彗星发射器，借行星重力转向，穿过三道光环完成一次漂亮的空间借力飞行。
              </p>
              <div className="mt-[18px] flex flex-wrap gap-2.5">
                <Tag color="geekblue" className="ui-tag">
                  拖拽发射
                </Tag>
                <Tag color="cyan" className="ui-tag">
                  引力转向
                </Tag>
                <Tag color="gold" className="ui-tag">
                  伪 3D 空间
                </Tag>
              </div>
              <div className="mt-[18px] flex flex-wrap gap-2.5 max-[768px]:grid max-[768px]:gap-3">
                <Button
                  className="border-transparent text-[var(--orbit-text-inverse)] bg-[var(--orbit-button-bg)] ui-button-cta max-[768px]:w-full"
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={handleResetClick}
                >
                  开始试玩
                </Button>
                <Button
                  className="border-[var(--orbit-line-strong)] bg-[var(--orbit-surface-chip)] text-[var(--orbit-text-panel)] ui-button-cta max-[768px]:w-full"
                  icon={<ThunderboltOutlined />}
                  onClick={reshuffleMission}
                >
                  刷新星图
                </Button>
                <Link
                  to="/"
                  className="border-[var(--orbit-line-strong)] bg-[var(--orbit-surface-chip)] text-[var(--orbit-text-panel)] ui-button-secondary ui-button-cta max-[768px]:w-full"
                >
                  <ArrowLeftOutlined aria-hidden="true" />
                  返回首页
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3 min-[769px]:grid-cols-3 max-[768px]:grid-cols-1">
                <article className="border border-solid border-[var(--orbit-line-medium)] bg-[var(--orbit-surface-glass)] backdrop-blur-[14px] shadow-[var(--orbit-shadow-panel)] rounded-[20px] p-[18px]">
                  <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase text-[var(--orbit-text-label-soft)]">
                    当前星图
                  </span>
                  <strong className="block mt-2.5 font-[var(--font-family-tech)] text-[28px] tracking-[0.04em]">
                    {missionName}
                  </strong>
                </article>
                <article className="border border-solid border-[var(--orbit-line-medium)] bg-[var(--orbit-surface-glass)] backdrop-blur-[14px] shadow-[var(--orbit-shadow-panel)] rounded-[20px] p-[18px]">
                  <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase text-[var(--orbit-text-label-soft)]">
                    剩余推进
                  </span>
                  <strong className="block mt-2.5 font-[var(--font-family-tech)] text-[28px] tracking-[0.04em]">
                    {shotsLeft}
                  </strong>
                </article>
                <article className="border border-solid border-[var(--orbit-line-medium)] bg-[var(--orbit-surface-glass)] backdrop-blur-[14px] shadow-[var(--orbit-shadow-panel)] rounded-[20px] p-[18px]">
                  <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase text-[var(--orbit-text-label-soft)]">
                    最佳连过
                  </span>
                  <strong className="block mt-2.5 font-[var(--font-family-tech)] text-[28px] tracking-[0.04em]">
                    {bestChain}
                  </strong>
                </article>
              </div>

              <div
                className="orbit-slinger__stage relative min-h-[690px] overflow-hidden rounded-[34px] border border-solid border-[var(--orbit-line-strong)] bg-[var(--orbit-surface-stage)] [box-shadow:inset_0_1px_0_var(--white-alpha-06),var(--orbit-shadow-stage)] max-[768px]:min-h-[480px] max-[768px]:rounded-3xl"
                ref={stageRef}
                tabIndex={0}
                aria-label="引力弹弓互动舞台，可使用拖拽或键盘完成发射"
                aria-describedby="orbit-slinger-stage-hint"
              >
                <canvas ref={canvasRef} className="block h-full w-full" />
                <div
                  className="absolute bottom-[18px] right-[18px] w-[min(280px,calc(100%-36px))] rounded-[20px] border border-solid border-[var(--orbit-line-strong)] bg-[var(--orbit-surface-hint)] backdrop-blur-[14px] p-[14px_16px] pointer-events-none max-[768px]:static max-[768px]:w-auto max-[768px]:m-3.5"
                  id="orbit-slinger-stage-hint"
                >
                  <span className="inline-block text-[11px] tracking-[0.24em] uppercase text-[color-mix(in_srgb,var(--orbit-color-ring)_88%,white)]">
                    玩法
                  </span>
                  <p className="mt-2 text-[var(--orbit-text-soft)] leading-[1.7]">
                    拖拽左下角亮点发射，或先聚焦舞台再用方向键瞄准、回车发射。轨迹虚线会提前告诉你这发大概会飞到哪里。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-[18px] min-[1121px]:grid-cols-3 max-[1120px]:grid-cols-1">
            <div className="border border-solid border-[var(--orbit-line-medium)] bg-[var(--orbit-surface-glass)] backdrop-blur-[14px] shadow-[var(--orbit-shadow-panel)] rounded-[26px] p-5">
              <span className="inline-flex items-center gap-2 m-0 text-[12px] tracking-[0.16em] uppercase font-[var(--font-family-tech)] text-[var(--orbit-text-label-soft)]">
                <CompassOutlined /> 任务状态
              </span>
              <div className="m-4_0_3.5 flex items-center justify-between gap-3">
                <Tag color={STATUS_COLOR[status]} className="ui-tag">
                  {STATUS_LABEL[status]}
                </Tag>
                <strong className="font-[var(--font-family-tech)] text-[20px] text-[var(--orbit-text-strong)]">
                  {ringsHit}/{TARGET_RINGS} 环
                </strong>
              </div>
              <Progress
                percent={progressPercent}
                showInfo={false}
                strokeColor={activeField.hud}
                trailColor={activeField.lineSoft}
              />
              <Alert
                className="mt-4 rounded-[18px] border border-solid border-[var(--orbit-line-soft)] bg-[var(--orbit-surface-chip)]"
                type={status === 'failed' ? 'error' : status === 'success' ? 'success' : 'info'}
                showIcon
                message={message}
              />
            </div>

            <div className="border border-solid border-[var(--orbit-line-medium)] bg-[var(--orbit-surface-glass)] backdrop-blur-[14px] shadow-[var(--orbit-shadow-panel)] rounded-[26px] p-5">
              <span className="inline-flex items-center gap-2 m-0 text-[12px] tracking-[0.16em] uppercase font-[var(--font-family-tech)] text-[var(--orbit-text-label-soft)]">
                星域风格
              </span>
              <Segmented
                block
                value={fieldKey}
                options={fieldOptions}
                onChange={handleFieldChange}
              />
              <div className="mt-4 grid gap-2.5">
                {ringStatus.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-3 p-[12px_14px] rounded-[18px] border border-solid ${item ? 'border-[color-mix(in_srgb,var(--orbit-color-ring)_35%,transparent)] bg-[var(--orbit-surface-hit)]' : 'border-[var(--orbit-line-soft)] bg-[var(--orbit-surface-chip-soft)]'} text-[var(--orbit-text-soft)]`}
                  >
                    <span className="text-[13px] text-[color-mix(in_srgb,var(--orbit-text-strong)_92%,white)]">
                      光环 {index + 1}
                    </span>
                    <strong className="text-[13px] text-[color-mix(in_srgb,var(--orbit-text-strong)_92%,white)]">
                      {item ? '已穿越' : '待命中'}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-solid border-[var(--orbit-line-medium)] bg-[var(--orbit-surface-glass)] backdrop-blur-[14px] shadow-[var(--orbit-shadow-panel)] rounded-[26px] p-5">
              <span className="inline-flex items-center gap-2 m-0 text-[12px] tracking-[0.16em] uppercase font-[var(--font-family-tech)] text-[var(--orbit-text-label-soft)]">
                飞行调校
              </span>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[color-mix(in_srgb,var(--orbit-text-primary)_82%,transparent)]">
                    引力强度
                  </span>
                  <strong className="font-[var(--font-family-tech)] text-[20px] text-[var(--orbit-text-strong)]">
                    {gravityStrength}
                  </strong>
                </div>
                <Slider
                  min={42}
                  max={86}
                  value={gravityStrength}
                  onChange={(value: number | [number, number]) =>
                    typeof value === 'number' && setGravityStrength(value)
                  }
                />
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[color-mix(in_srgb,var(--orbit-text-primary)_82%,transparent)]">
                    推进倍率
                  </span>
                  <strong className="font-[var(--font-family-tech)] text-[20px] text-[var(--orbit-text-strong)]">
                    {thrustPower}
                  </strong>
                </div>
                <Slider
                  min={50}
                  max={92}
                  value={thrustPower}
                  onChange={(value: number | [number, number]) =>
                    typeof value === 'number' && setThrustPower(value)
                  }
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
