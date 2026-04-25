import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftOutlined,
  BgColorsOutlined,
  ReloadOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { Button, Modal, Progress, Slider, Switch, Tag } from 'antd'
import { Link } from 'react-router-dom'
import { clamp, readCssVar, withOpacity } from '@/utils/canvasDraw'
import './index.css'

type PaletteKey = 'prism' | 'sunset' | 'lagoon'
type RoundResult = 'won' | 'failed' | null

interface PaletteConfig {
  label: string
  bgA: string
  bgB: string
  beam: string
  glow: string
  crystalA: string
  crystalB: string
  accent: string
  lineSoft: string
  canvasWhite: string
  canvasShadow: string
  canvasPrismShadow: string
}

interface CrystalSeed {
  id: number
  x: number
  y: number
  size: number
  depth: number
}

interface CrystalState extends CrystalSeed {
  charge: number
  lit: boolean
}

const STORAGE_KEY = 'showcase-signal-best-score'
const ROUND_SECONDS = 42
const BASE_CRYSTALS: CrystalSeed[] = [
  { id: 1, x: 0.18, y: 0.28, size: 28, depth: 0.8 },
  { id: 2, x: 0.34, y: 0.18, size: 24, depth: 1.1 },
  { id: 3, x: 0.52, y: 0.36, size: 34, depth: 1.3 },
  { id: 4, x: 0.66, y: 0.2, size: 25, depth: 0.95 },
  { id: 5, x: 0.82, y: 0.34, size: 30, depth: 1.2 }
]

const PALETTES: Record<PaletteKey, PaletteConfig> = {
  prism: {
    label: '霓虹棱镜',
    bgA: '--signal-bg-a',
    bgB: '--signal-bg-b',
    beam: '--signal-color-beam',
    glow: '--signal-color-glow',
    crystalA: '--signal-crystal-a',
    crystalB: '--signal-crystal-b',
    accent: '--signal-color-accent',
    lineSoft: '--signal-line-soft',
    canvasWhite: '--signal-canvas-white',
    canvasShadow: '--signal-canvas-shadow',
    canvasPrismShadow: '--signal-canvas-prism-shadow'
  },
  sunset: {
    label: '晚霞折射',
    bgA: '--signal-bg-a',
    bgB: '--signal-bg-b',
    beam: '--signal-color-beam',
    glow: '--signal-color-glow',
    crystalA: '--signal-crystal-a',
    crystalB: '--signal-crystal-b',
    accent: '--signal-color-accent',
    lineSoft: '--signal-line-soft',
    canvasWhite: '--signal-canvas-white',
    canvasShadow: '--signal-canvas-shadow',
    canvasPrismShadow: '--signal-canvas-prism-shadow'
  },
  lagoon: {
    label: '海湾电蓝',
    bgA: '--signal-bg-a',
    bgB: '--signal-bg-b',
    beam: '--signal-color-beam',
    glow: '--signal-color-glow',
    crystalA: '--signal-crystal-a',
    crystalB: '--signal-crystal-b',
    accent: '--signal-color-accent',
    lineSoft: '--signal-line-soft',
    canvasWhite: '--signal-canvas-white',
    canvasShadow: '--signal-canvas-shadow',
    canvasPrismShadow: '--signal-canvas-prism-shadow'
  }
}

function resolvePaletteConfig(element: HTMLElement | null, preset: PaletteConfig): PaletteConfig {
  return {
    ...preset,
    bgA: readCssVar(element, preset.bgA),
    bgB: readCssVar(element, preset.bgB),
    beam: readCssVar(element, preset.beam),
    glow: readCssVar(element, preset.glow),
    crystalA: readCssVar(element, preset.crystalA),
    crystalB: readCssVar(element, preset.crystalB),
    accent: readCssVar(element, preset.accent),
    lineSoft: readCssVar(element, preset.lineSoft),
    canvasWhite: readCssVar(element, preset.canvasWhite),
    canvasShadow: readCssVar(element, preset.canvasShadow),
    canvasPrismShadow: readCssVar(element, preset.canvasPrismShadow)
  }
}

function createCrystals(seed: number): CrystalState[] {
  return BASE_CRYSTALS.map((item, index) => {
    const wave = Math.sin(seed * 0.0017 + index * 1.83)
    const drift = Math.cos(seed * 0.0011 + index * 2.17)
    return {
      ...item,
      x: clamp(item.x + wave * 0.028, 0.14, 0.86),
      y: clamp(item.y + drift * 0.03, 0.14, 0.62),
      size: item.size + Math.round((wave + 1) * 2.4),
      charge: 0,
      lit: false
    }
  })
}

export default function ShowcaseSignal() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const paletteRef = useRef<PaletteConfig>(PALETTES.prism)
  const crystalsRef = useRef<CrystalState[]>(createCrystals(Date.now()))
  const targetAngleRef = useRef(0)
  const currentAngleRef = useRef(0)
  const pulseUntilRef = useRef(0)
  const roundStartRef = useRef(0)
  const scoreRef = useRef(0)
  const litCountRef = useRef(0)
  const comboRef = useRef(0)
  const lastLitAtRef = useRef(0)
  const bestScoreRef = useRef(0)
  const statusRef = useRef<'ready' | 'playing' | Exclude<RoundResult, null>>('ready')
  const [paletteKey, setPaletteKey] = useState<PaletteKey>('prism')
  const [beamWidth, setBeamWidth] = useState(56)
  const [chargeSpeed, setChargeSpeed] = useState(68)
  const [assistMode, setAssistMode] = useState(true)
  const [litCount, setLitCount] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [bestScore, setBestScore] = useState(0)
  const [result, setResult] = useState<RoundResult>(null)
  const [pulseStamp, setPulseStamp] = useState(0)
  const [roundStarted, setRoundStarted] = useState(false)

  const focusStage = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return

    window.requestAnimationFrame(() => {
      stage.focus({ preventScroll: true })
    })
  }, [])

  const palette = useMemo(() => {
    const preset = PALETTES[paletteKey]
    const resolved = resolvePaletteConfig(rootRef.current, preset)
    paletteRef.current = resolved
    return resolved
  }, [paletteKey, pulseStamp])
  const completion = useMemo(
    () => Math.round((litCount / crystalsRef.current.length) * 100),
    [litCount]
  )
  const pulseActive = useMemo(() => Date.now() - pulseStamp < 1800, [pulseStamp, timeLeft])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const nextBest = stored ? Number(stored) : 0
    if (!Number.isNaN(nextBest)) {
      setBestScore(nextBest)
      bestScoreRef.current = nextBest
    }
  }, [])

  useEffect(() => {
    const preset = PALETTES[paletteKey]
    paletteRef.current = resolvePaletteConfig(rootRef.current, preset)
  }, [paletteKey])

  const finishRound = useCallback((nextResult: Exclude<RoundResult, null>) => {
    if (statusRef.current !== 'playing') return
    statusRef.current = nextResult
    setResult(nextResult)
    setRoundStarted(false)

    if (
      nextResult === 'won' &&
      scoreRef.current > bestScoreRef.current &&
      typeof window !== 'undefined'
    ) {
      bestScoreRef.current = scoreRef.current
      setBestScore(scoreRef.current)
      window.localStorage.setItem(STORAGE_KEY, String(scoreRef.current))
    }
  }, [])

  const resetRound = useCallback((seed = Date.now(), autoStart = false) => {
    crystalsRef.current = createCrystals(seed)
    targetAngleRef.current = 0
    currentAngleRef.current = 0
    pulseUntilRef.current = 0
    scoreRef.current = 0
    litCountRef.current = 0
    comboRef.current = 0
    lastLitAtRef.current = 0
    roundStartRef.current = autoStart ? performance.now() : 0
    statusRef.current = autoStart ? 'playing' : 'ready'
    setLitCount(0)
    setScore(0)
    setCombo(0)
    setTimeLeft(ROUND_SECONDS)
    setResult(null)
    setPulseStamp(0)
    setRoundStarted(autoStart)
  }, [])

  const beginRound = useCallback(() => {
    if (statusRef.current !== 'ready') return
    roundStartRef.current = performance.now()
    statusRef.current = 'playing'
    setTimeLeft(ROUND_SECONDS)
    setRoundStarted(true)
  }, [])

  const triggerPulse = useCallback(() => {
    if (statusRef.current === 'ready') {
      beginRound()
    }
    pulseUntilRef.current = Math.max(pulseUntilRef.current, performance.now() + 1800)
    setPulseStamp(Date.now())
  }, [beginRound])

  const shuffleRound = useCallback(() => {
    resetRound(Date.now())
    focusStage()
  }, [focusStage, resetRound])

  useEffect(() => {
    resetRound(Date.now())
  }, [resetRound])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resolvePalette = () => {
      const preset = PALETTES[paletteKey]
      paletteRef.current = resolvePaletteConfig(rootRef.current, preset)
      return paletteRef.current
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let width = 0
    let height = 0
    let latestSecond = ROUND_SECONDS

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const updateTargetAngle = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect()
      const nx = (clientX - rect.left) / rect.width
      const ny = (clientY - rect.top) / rect.height
      const dx = nx - 0.5
      const dy = 0.84 - ny
      targetAngleRef.current = clamp(Math.atan2(dx, Math.max(dy, 0.08)), -1.02, 1.02)
    }

    const handlePointerMove = (event: PointerEvent) => {
      updateTargetAngle(event.clientX, event.clientY)
    }

    const handlePointerDown = (event: PointerEvent) => {
      updateTargetAngle(event.clientX, event.clientY)
      if (statusRef.current === 'ready') {
        beginRound()
      }
      if (event.pointerType === 'touch') {
        triggerPulse()
      }
    }

    const handlePointerLeave = () => {
      if (assistMode) {
        targetAngleRef.current = 0
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event
      const isArrowKey =
        key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown'
      const isActivateKey = key === 'Enter' || key === ' ' || key === 'Spacebar'
      const isEscapeKey = key === 'Escape'

      if (!isArrowKey && !isActivateKey && !isEscapeKey) return

      event.preventDefault()

      if (isActivateKey) {
        if (event.repeat) return

        if (statusRef.current === 'playing') {
          triggerPulse()
          return
        }

        if (statusRef.current === 'ready') {
          beginRound()
          return
        }

        resetRound(Date.now(), true)
        return
      }

      if (isEscapeKey) {
        targetAngleRef.current = 0
        return
      }

      if (statusRef.current !== 'playing' && statusRef.current !== 'ready') return

      const step = event.shiftKey ? 0.18 : 0.1
      const fineStep = event.shiftKey ? 0.09 : 0.05
      let nextAngle = targetAngleRef.current

      if (key === 'ArrowLeft') nextAngle -= step
      if (key === 'ArrowRight') nextAngle += step
      if (key === 'ArrowUp') {
        const towardCenter = targetAngleRef.current > 0 ? -fineStep : fineStep
        nextAngle += towardCenter
      }
      if (key === 'ArrowDown') {
        const awayFromCenter = targetAngleRef.current >= 0 ? fineStep : -fineStep
        nextAngle += awayFromCenter
      }

      targetAngleRef.current = clamp(nextAngle, -1.02, 1.02)
    }

    const drawGrid = (time: number) => {
      const activePalette = paletteRef.current
      ctx.save()
      ctx.translate(width * 0.5, height * 0.72)
      ctx.strokeStyle = activePalette.lineSoft
      ctx.lineWidth = 1

      for (let i = -8; i <= 8; i += 1) {
        ctx.beginPath()
        ctx.moveTo(i * 46, 0)
        ctx.lineTo(i * 140, height * 0.35)
        ctx.stroke()
      }

      for (let i = 0; i < 9; i += 1) {
        const y = i * 24 + ((time * 40) % 24)
        ctx.beginPath()
        ctx.moveTo(-width * 0.48, y)
        ctx.lineTo(width * 0.48, y)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawCrystal = (
      x: number,
      y: number,
      size: number,
      depth: number,
      charge: number,
      lit: boolean,
      index: number
    ) => {
      const activePalette = paletteRef.current
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(1, 1 + depth * 0.08)

      const glowRadius = size * (1.25 + charge * 0.8)
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius)
      halo.addColorStop(0, lit ? `${activePalette.glow}d8` : `${activePalette.beam}55`)
      halo.addColorStop(0.45, lit ? `${activePalette.crystalA}66` : `${activePalette.glow}20`)
      halo.addColorStop(1, 'transparent')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2)
      ctx.fill()

      if (assistMode && !lit) {
        ctx.beginPath()
        ctx.strokeStyle = withOpacity(activePalette.canvasWhite, 0.16)
        ctx.lineWidth = 1.5
        ctx.arc(0, 0, size * 1.1, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.ellipse(0, size * 1.25, size * 0.92, size * 0.28, 0, 0, Math.PI * 2)
      ctx.fillStyle = activePalette.canvasShadow
      ctx.fill()

      const gem = ctx.createLinearGradient(-size, -size, size, size)
      gem.addColorStop(0, lit ? activePalette.crystalB : activePalette.crystalA)
      gem.addColorStop(0.5, activePalette.canvasWhite)
      gem.addColorStop(1, lit ? activePalette.accent : activePalette.glow)
      ctx.fillStyle = gem
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.lineTo(size * 0.88, -size * 0.1)
      ctx.lineTo(size * 0.52, size * 0.92)
      ctx.lineTo(-size * 0.52, size * 0.92)
      ctx.lineTo(-size * 0.88, -size * 0.1)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(0, -size * 0.86)
      ctx.lineTo(size * 0.42, -size * 0.08)
      ctx.lineTo(0, size * 0.18)
      ctx.lineTo(-size * 0.42, -size * 0.08)
      ctx.closePath()
      ctx.fillStyle = withOpacity(activePalette.canvasWhite, 0.46)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(0, 0, size * (0.24 + charge * 0.18), 0, Math.PI * 2)
      ctx.fillStyle = lit ? activePalette.accent : withOpacity(activePalette.canvasWhite, 0.22)
      ctx.fill()

      ctx.fillStyle = withOpacity(activePalette.canvasWhite, 0.68)
      ctx.font = "600 14px 'IBM Plex Sans SC', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillText(`${index + 1}`, 0, size * 1.75)
      ctx.restore()
    }

    const drawPrism = (x: number, y: number, angle: number, overload: number) => {
      const activePalette = paletteRef.current
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle * 0.38)
      ctx.scale(1, 1.05)

      const prismGlow = ctx.createRadialGradient(0, -6, 4, 0, -6, 54 + overload * 24)
      prismGlow.addColorStop(0, `${activePalette.glow}a8`)
      prismGlow.addColorStop(0.4, `${activePalette.beam}40`)
      prismGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = prismGlow
      ctx.beginPath()
      ctx.arc(0, 0, 54 + overload * 24, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(0, -54)
      ctx.lineTo(44, 22)
      ctx.lineTo(-44, 22)
      ctx.closePath()
      ctx.fillStyle = withOpacity(activePalette.canvasWhite, 0.18)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(-44, 22)
      ctx.lineTo(0, 46)
      ctx.lineTo(44, 22)
      ctx.lineTo(0, -4)
      ctx.closePath()
      const bodyGradient = ctx.createLinearGradient(-36, -24, 36, 36)
      bodyGradient.addColorStop(0, activePalette.crystalA)
      bodyGradient.addColorStop(0.48, activePalette.canvasWhite)
      bodyGradient.addColorStop(1, activePalette.crystalB)
      ctx.fillStyle = bodyGradient
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(0, -4)
      ctx.lineTo(44, 22)
      ctx.lineTo(0, 46)
      ctx.closePath()
      ctx.fillStyle = withOpacity(activePalette.canvasWhite, 0.22)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(-44, 22)
      ctx.lineTo(0, -4)
      ctx.lineTo(0, 46)
      ctx.closePath()
      ctx.fillStyle = activePalette.canvasPrismShadow
      ctx.fill()

      ctx.restore()
    }

    const render = (now: number) => {
      const activePalette = resolvePalette()
      const time = now * 0.001
      const overload = clamp((pulseUntilRef.current - now) / 1800, 0, 1)
      const currentTarget = assistMode
        ? targetAngleRef.current
        : clamp(targetAngleRef.current, -1.02, 1.02)
      currentAngleRef.current += (currentTarget - currentAngleRef.current) * 0.12

      ctx.clearRect(0, 0, width, height)

      const background = ctx.createLinearGradient(0, 0, width, height)
      background.addColorStop(0, activePalette.bgA)
      background.addColorStop(1, activePalette.bgB)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, width, height)

      const topGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.18,
        0,
        width * 0.5,
        height * 0.18,
        width * 0.48
      )
      topGlow.addColorStop(0, `${activePalette.glow}33`)
      topGlow.addColorStop(0.38, `${activePalette.beam}1a`)
      topGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = topGlow
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < 36; i += 1) {
        const starX = (((i * 127.13) % 1000) / 1000) * width
        const starY = (((i * 71.37) % 580) / 580) * height * 0.48
        const twinkle = 0.35 + Math.sin(time * 2.4 + i) * 0.3
        ctx.beginPath()
        ctx.arc(starX, starY, 1.1 + (i % 3) * 0.45, 0, Math.PI * 2)
        ctx.fillStyle = withOpacity(activePalette.canvasWhite, twinkle)
        ctx.fill()
      }

      drawGrid(time)

      const prismX = width * 0.5
      const prismY = height * 0.8
      const angle = currentAngleRef.current
      const beamVector = {
        x: Math.sin(angle),
        y: -Math.cos(angle)
      }
      const beamLength = Math.max(width, height) * 1.08
      const beamSpread = 12 + beamWidth * 0.23 + overload * 18
      const sideSpread = (beamWidth / 100) * 0.18 + overload * 0.08

      const paths = [0, sideSpread, -sideSpread]
      for (let pathIdx = 0; pathIdx < paths.length; pathIdx += 1) {
        const offset = paths[pathIdx]
        const index = pathIdx
        const offsetVector = {
          x: Math.sin(angle + offset),
          y: -Math.cos(angle + offset)
        }
        const gradient = ctx.createLinearGradient(
          prismX,
          prismY,
          prismX + offsetVector.x * beamLength,
          prismY + offsetVector.y * beamLength
        )
        gradient.addColorStop(0, `${activePalette.beam}00`)
        gradient.addColorStop(0.06, `${activePalette.beam}f2`)
        gradient.addColorStop(
          0.55,
          `${index === 0 ? activePalette.glow : activePalette.crystalA}85`
        )
        gradient.addColorStop(1, withOpacity(activePalette.canvasWhite, 0))
        ctx.strokeStyle = gradient
        ctx.lineWidth = index === 0 ? beamSpread : beamSpread * 0.45
        ctx.lineCap = 'round'
        ctx.shadowBlur = 28 + overload * 14
        ctx.shadowColor = index === 0 ? activePalette.glow : activePalette.beam
        ctx.beginPath()
        ctx.moveTo(prismX, prismY)
        ctx.lineTo(prismX + offsetVector.x * beamLength, prismY + offsetVector.y * beamLength)
        ctx.stroke()
      }
      ctx.shadowBlur = 0

      const nextLitIds: number[] = []

      const currentCrystals = crystalsRef.current
      for (let ci = 0; ci < currentCrystals.length; ci += 1) {
        const crystal = currentCrystals[ci]
        const index = ci
        const bob =
          Math.sin(time * (0.9 + crystal.depth * 0.25) + index * 1.7) * (8 + crystal.depth * 3)
        const sway = Math.cos(time * (0.7 + crystal.depth * 0.16) + index) * (6 + crystal.depth * 2)
        const x = crystal.x * width + sway
        const y = crystal.y * height + bob
        const size = crystal.size * (0.86 + crystal.depth * 0.12)

        const projection = (x - prismX) * beamVector.x + (y - prismY) * beamVector.y
        const beamDistance = Math.abs((x - prismX) * beamVector.y - (y - prismY) * beamVector.x)
        const hit =
          projection > 0 &&
          projection < beamLength &&
          beamDistance < size * 0.95 + beamSpread * 0.45
        const chargeDelta = (chargeSpeed / 100) * (overload > 0 ? 0.05 : 0.036)

        crystal.charge = clamp(crystal.charge + (hit ? chargeDelta : -0.018), 0, 1)

        if (!crystal.lit && crystal.charge >= 1) {
          crystal.lit = true
          nextLitIds.push(crystal.id)
        }

        drawCrystal(x, y, size, crystal.depth, crystal.charge, crystal.lit, index)

        if (crystal.lit) {
          ctx.beginPath()
          ctx.strokeStyle = withOpacity(activePalette.canvasWhite, 0.22)
          ctx.lineWidth = 1
          ctx.moveTo(x, y + size * 1.2)
          ctx.lineTo(x, height * 0.82)
          ctx.stroke()
        }
      }

      drawPrism(prismX, prismY, angle, overload)

      if (statusRef.current === 'playing' && roundStartRef.current > 0) {
        const elapsed = (now - roundStartRef.current) / 1000
        const nextLeft = Math.max(0, Math.ceil(ROUND_SECONDS - elapsed))

        if (nextLeft !== latestSecond) {
          latestSecond = nextLeft
          setTimeLeft(nextLeft)
        }

        if (nextLeft <= 0) {
          finishRound('failed')
        }
      }

      if (nextLitIds.length > 0 && statusRef.current === 'playing') {
        for (let ni = 0; ni < nextLitIds.length; ni += 1) {
          const nowTime = performance.now()
          comboRef.current = nowTime - lastLitAtRef.current < 2200 ? comboRef.current + 1 : 1
          lastLitAtRef.current = nowTime
          litCountRef.current += 1
          scoreRef.current += 120 + comboRef.current * 28 + timeLeft * 3
        }

        setCombo(comboRef.current)
        setLitCount(litCountRef.current)
        setScore(scoreRef.current)

        if (litCountRef.current >= crystalsRef.current.length) {
          finishRound('won')
        }
      }

      raf = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerdown', handlePointerDown)
    stage.addEventListener('pointerleave', handlePointerLeave)
    stage.addEventListener('keydown', handleKeyDown)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerdown', handlePointerDown)
      stage.removeEventListener('pointerleave', handlePointerLeave)
      stage.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    assistMode,
    beamWidth,
    beginRound,
    chargeSpeed,
    finishRound,
    paletteKey,
    resetRound,
    triggerPulse
  ])

  const modalTitle = result === 'won' ? '全水晶点亮' : '本轮未完成'
  const modalDesc =
    result === 'won'
      ? '你已经把整组浮空水晶全部激活，棱镜场域进入稳定辉光。'
      : '差一点就完成了。调一调分光范围，再来一局会更顺手。'

  return (
    <div ref={rootRef} className={`signal-reactor signal-reactor--${paletteKey}`}>
      <div className="signal-reactor__noise" />
      <div className="signal-reactor__aurora signal-reactor__aurora--left" />
      <div className="signal-reactor__aurora signal-reactor__aurora--right" />

      <main className="relative z-[1] mx-auto w-[min(1320px,calc(100%-48px))] min-h-[100dvh] pt-10 pb-[34px] max-[1100px]:w-[calc(100%-28px)] max-[1100px]:min-h-auto max-[1100px]:pt-6">
        <section className="grid items-center gap-[30px] min-[1101px]:grid-cols-[minmax(320px,430px)_minmax(0,1fr)] max-[768px]:gap-[18px]">
          <div className="relative z-[2]">
            <p className="inline-flex items-center min-h-[34px] m-0 px-3.5 rounded-[999px] border border-solid border-[var(--signal-line-strong)] bg-[var(--signal-surface-glass)] text-[12px] tracking-[0.18em] uppercase font-[var(--font-family-tech)] text-[var(--signal-text-label)]">
              作品展 / 01
            </p>
            <h1 className="m-[14px_0_0] font-[var(--font-family-wide)] text-[clamp(46px,7.8vw,92px)] leading-[0.92] tracking-[-0.06em]">
              霓虹棱镜
            </h1>
            <p className="max-w-[33ch] m-[18px_0_0] text-[var(--signal-text-muted)] text-[16px] leading-[1.9]">
              先开始这一局，再拖动舞台里的棱镜，让激光扫过 5
              颗浮空水晶。水晶会持续充能，全部点亮前不要让时间先归零。
            </p>
            <div className="mt-[18px] flex flex-wrap gap-2.5">
              <Tag color="magenta" className="ui-tag">
                拖动折射
              </Tag>
              <Tag color="cyan" className="ui-tag">
                短时过载
              </Tag>
              <Tag color="gold" className="ui-tag">
                限时点亮
              </Tag>
            </div>
            <div className="mt-[26px] flex flex-wrap gap-2.5 max-[768px]:grid max-[768px]:gap-3">
              <Button
                className="border-none text-[var(--signal-text-inverse)] bg-[linear-gradient(135deg,var(--signal-color-beam),color-mix(in_srgb,var(--signal-color-accent)_52%,white))] shadow-[0_14px_28px_var(--black-alpha-20)] ui-button-cta max-[768px]:w-full"
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={() => {
                  if (roundStarted) {
                    triggerPulse()
                  } else {
                    resetRound(Date.now(), true)
                    focusStage()
                  }
                }}
              >
                {roundStarted ? '触发过载' : '开始挑战'}
              </Button>
              <Button
                className="border border-solid border-[var(--signal-line-medium)] text-[var(--signal-text-panel)] bg-[var(--signal-surface-glass-soft)] ui-button-cta max-[768px]:w-full"
                icon={<ReloadOutlined />}
                onClick={shuffleRound}
              >
                重新布场
              </Button>
              <Link
                to="/"
                className="border border-solid border-[var(--signal-line-medium)] text-[var(--signal-text-panel)] bg-[var(--signal-surface-glass-soft)] ui-button-secondary ui-button-cta max-[768px]:w-full"
              >
                <ArrowLeftOutlined aria-hidden="true" />
                返回首页
              </Link>
            </div>
          </div>

          <div className="grid gap-[14px]">
            <div className="grid gap-[14px] min-[769px]:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] max-[768px]:grid-cols-1">
              <div className="p-[18px_20px] rounded-[24px] border border-solid border-[var(--signal-line-medium)] bg-[var(--signal-surface-base)] backdrop-blur-[18px] shadow-[var(--signal-shadow-panel)]">
                <span className="inline-flex items-center gap-2 mb-2.5 text-[var(--signal-text-soft)] text-[12px] tracking-[0.16em] uppercase">
                  玩法提示
                </span>
                <strong
                  id="signal-reactor-stage-help"
                  className="block text-[15px] leading-[1.7] text-[var(--signal-text-strong)]"
                >
                  {roundStarted
                    ? '移动鼠标/手指，或聚焦舞台后用方向键调角度，空格触发过载。'
                    : '先点开始挑战，或聚焦舞台后按回车开始。'}
                </strong>
              </div>
              <div className="p-[18px_20px] rounded-[24px] border border-solid border-[var(--signal-line-medium)] bg-[var(--signal-surface-base)] backdrop-blur-[18px] shadow-[var(--signal-shadow-panel)]">
                <span className="inline-flex items-center gap-2 mb-2.5 text-[var(--signal-text-soft)] text-[12px] tracking-[0.16em] uppercase">
                  完成度
                </span>
                <Progress
                  percent={completion}
                  showInfo={false}
                  strokeColor={palette.beam}
                  trailColor={palette.lineSoft}
                />
              </div>
            </div>

            <div className="grid gap-3 min-[769px]:grid-cols-3 max-[768px]:grid-cols-1">
              <article className="p-[16px_18px] rounded-[20px] border border-solid border-[var(--signal-line-soft)] bg-[var(--signal-surface-panel)]">
                <span className="block m-0 text-[var(--signal-text-stat)] text-[11px] tracking-[0.14em] uppercase">
                  已点亮
                </span>
                <strong className="block mt-2 text-[28px] leading-[1] text-[var(--signal-text-strong)]">
                  {litCount}/5
                </strong>
              </article>
              <article className="p-[16px_18px] rounded-[20px] border border-solid border-[var(--signal-line-soft)] bg-[var(--signal-surface-panel)]">
                <span className="block m-0 text-[var(--signal-text-stat)] text-[11px] tracking-[0.14em] uppercase">
                  当前分数
                </span>
                <strong className="block mt-2 text-[28px] leading-[1] text-[var(--signal-text-strong)]">
                  {score}
                </strong>
              </article>
              <article className="p-[16px_18px] rounded-[20px] border border-solid border-[var(--signal-line-soft)] bg-[var(--signal-surface-panel)]">
                <span className="block m-0 text-[var(--signal-text-stat)] text-[11px] tracking-[0.14em] uppercase">
                  剩余时间
                </span>
                <strong className="block mt-2 text-[28px] leading-[1] text-[var(--signal-text-strong)]">
                  {roundStarted ? `${timeLeft}s` : '待开始'}
                </strong>
              </article>
            </div>

            <div
              className="signal-reactor__stage"
              ref={stageRef}
              tabIndex={0}
              aria-label="霓虹棱镜互动舞台，方向键调节折射角，回车或空格开始挑战或触发过载，Escape 回正角度"
              aria-describedby="signal-reactor-stage-help"
            >
              <canvas ref={canvasRef} className="signal-reactor__canvas" />

              <div className={`signal-reactor__pulse-badge ${pulseActive ? 'is-active' : ''}`}>
                <ThunderboltOutlined />
                <span>{pulseActive ? '过载中' : roundStarted ? '等待过载' : '等待开始'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 px-0 pb-10 min-[1101px]:grid-cols-[300px_minmax(0,1fr)] max-[1100px]:grid-cols-1">
          <div>
            <p className="inline-flex items-center m-0 text-[12px] tracking-[0.22em] font-[var(--font-family-tech)] uppercase text-[var(--signal-text-label-soft)]">
              这局怎么赢
            </p>
            <ul className="m-[16px_0_0] pl-[18px] text-[var(--signal-rules-text)] leading-[1.9]">
              <li>把激光停留在水晶上，水晶会慢慢充能并被点亮。</li>
              <li>过载会暂时放宽光束范围，适合扫过中间密集区。</li>
              <li>连续点亮会叠连击，越快完成，得分越高。</li>
            </ul>
          </div>

          <div className="grid gap-[18px] min-[769px]:grid-cols-2 max-[768px]:grid-cols-1">
            <div>
              <span className="inline-flex items-center gap-2 mb-2 text-[var(--signal-text-soft)] text-[12px] tracking-[0.16em] uppercase">
                分光范围
              </span>
              <Slider
                min={32}
                max={88}
                value={beamWidth}
                onChange={(value: number | [number, number]) =>
                  typeof value === 'number' && setBeamWidth(value)
                }
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 mb-2 text-[var(--signal-text-soft)] text-[12px] tracking-[0.16em] uppercase">
                充能速率
              </span>
              <Slider
                min={42}
                max={92}
                value={chargeSpeed}
                onChange={(value: number | [number, number]) =>
                  typeof value === 'number' && setChargeSpeed(value)
                }
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 mb-0 text-[var(--signal-text-soft)] text-[12px] tracking-[0.16em] uppercase">
                <BgColorsOutlined /> 场景色板
              </span>
              <div className="mt-[18px] flex flex-wrap gap-2.5">
                {(Object.keys(PALETTES) as PaletteKey[]).map(key => (
                  <Button
                    key={key}
                    className={`rounded-[999px] border border-solid border-[var(--signal-line-strong)] text-[var(--signal-palette-text)] bg-[var(--signal-surface-glass-soft)] ${key === paletteKey ? 'text-[var(--signal-text-inverse)] border-transparent bg-[linear-gradient(135deg,var(--signal-color-beam),color-mix(in_srgb,var(--signal-color-accent)_56%,white))]' : ''}`}
                    onClick={() => setPaletteKey(key)}
                  >
                    {PALETTES[key].label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--signal-text-soft)] text-[12px] tracking-[0.16em] uppercase">
                引导光圈
              </span>
              <Switch checked={assistMode} onChange={setAssistMode} />
            </div>
            <div className="grid gap-3 min-[769px]:grid-cols-2 max-[768px]:grid-cols-1">
              <article className="p-[16px_18px] rounded-[20px] border border-solid border-[var(--signal-line-soft)] bg-[var(--signal-surface-panel)]">
                <span className="block m-0 text-[var(--signal-text-stat)] text-[11px] tracking-[0.14em] uppercase">
                  当前连击
                </span>
                <strong className="block mt-2 text-[28px] leading-[1] text-[var(--signal-text-strong)]">
                  {combo}
                </strong>
              </article>
              <article className="p-[16px_18px] rounded-[20px] border border-solid border-[var(--signal-line-soft)] bg-[var(--signal-surface-panel)]">
                <span className="block m-0 text-[var(--signal-text-stat)] text-[11px] tracking-[0.14em] uppercase">
                  最高分
                </span>
                <strong className="block mt-2 text-[28px] leading-[1] text-[var(--signal-text-strong)]">
                  {bestScore}
                </strong>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Modal
        open={Boolean(result)}
        footer={null}
        centered
        onCancel={() => {
          setResult(null)
          focusStage()
        }}
        className="signal-reactor__modal"
      >
        <div>
          <p className="inline-flex items-center min-h-[34px] m-0 px-3.5 rounded-[999px] border border-solid border-[var(--signal-line-strong)] bg-[var(--signal-surface-glass)] text-[12px] tracking-[0.18em] uppercase font-[var(--font-family-tech)] text-[var(--signal-text-label)]">
            {result === 'won' ? '任务完成' : '继续挑战'}
          </p>
          <h2 className="m-[14px_0_0] font-[var(--font-family-wide)] text-[clamp(28px,5vw,40px)] tracking-[-0.04em]">
            {modalTitle}
          </h2>
          <p className="m-[14px_auto_0] max-w-[26ch] leading-[1.8] text-[var(--signal-result-copy)]">
            {modalDesc}
          </p>
          <div className="mt-[22px] grid gap-3 min-[769px]:grid-cols-2 max-[768px]:grid-cols-1">
            <article className="p-[16px_18px] rounded-[20px] border border-solid border-[var(--signal-line-soft)] bg-[var(--signal-surface-panel)]">
              <span className="block m-0 text-[var(--signal-text-stat)] text-[11px] tracking-[0.14em] uppercase">
                本轮分数
              </span>
              <strong className="block mt-2 text-[28px] leading-[1] text-[var(--signal-text-strong)]">
                {score}
              </strong>
            </article>
            <article className="p-[16px_18px] rounded-[20px] border border-solid border-[var(--signal-line-soft)] bg-[var(--signal-surface-panel)]">
              <span className="block m-0 text-[var(--signal-text-stat)] text-[11px] tracking-[0.14em] uppercase">
                最高分
              </span>
              <strong className="block mt-2 text-[28px] leading-[1] text-[var(--signal-text-strong)]">
                {bestScore}
              </strong>
            </article>
          </div>
          <Button
            className="mt-[22px] border-none text-[var(--signal-text-inverse-strong)] bg-[linear-gradient(135deg,var(--signal-color-beam),color-mix(in_srgb,var(--signal-color-accent)_60%,white))] ui-button-cta"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={shuffleRound}
          >
            再来一局
          </Button>
        </div>
      </Modal>
    </div>
  )
}
