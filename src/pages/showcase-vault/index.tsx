import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftOutlined,
  CompassOutlined,
  ReloadOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { Alert, Button, Progress, Slider, Tag } from 'antd'
import { Link } from 'react-router-dom'
import { clamp, readCssVar, withOpacity } from '@/utils/canvasDraw'
import thrDeb from '@/utils/thrDeb'
import './index.css'

type MissionPhase = 'idle' | 'hunting' | 'clear' | 'depleted'

interface SonarTarget {
  id: string
  name: string
  kind: string
  hint: string
  color: string
  x: number
  y: number
  depth: number
  found: boolean
}

interface RippleWave {
  id: number
  x: number
  y: number
  radius: number
  life: number
  strength: number
}

interface EchoGlow {
  id: number
  x: number
  y: number
  life: number
  strength: number
  color: string
}

interface OceanParticle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  drift: number
  alpha: number
}

const FULL_ENERGY = 100
const TARGET_COUNT = 3
const PHASE_TAG_MAP: Record<MissionPhase, { label: string; color: string }> = {
  idle: { label: '待机中', color: 'default' },
  hunting: { label: '搜索中', color: 'processing' },
  clear: { label: '目标锁定', color: 'success' },
  depleted: { label: '能量见底', color: 'warning' }
}

const TARGET_LIBRARY = [
  {
    name: '遗迹圆塔',
    kind: '古代遗迹',
    hint: '像石塔一样稳，回波轮廓厚重。',
    color: '--sonar-target-ruins'
  },
  {
    name: '蓝鳍迁群',
    kind: '生物群',
    hint: '回声会轻微游移，边缘比较柔。',
    color: '--sonar-target-school'
  },
  {
    name: '下潜信标',
    kind: '信标装置',
    hint: '脉冲命中后会有规整闪点。',
    color: '--sonar-target-beacon'
  },
  {
    name: '热泉花园',
    kind: '海底热泉',
    hint: '亮度偏暖，回波会带一点上升感。',
    color: '--sonar-target-thermal'
  },
  {
    name: '玻璃水母群',
    kind: '荧光生物',
    hint: '信号边缘轻，亮斑像漂浮伞面。',
    color: '--sonar-target-jelly'
  }
]

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createMissionTargets() {
  const picks = [...TARGET_LIBRARY].sort(() => Math.random() - 0.5).slice(0, TARGET_COUNT)

  return picks.map((item, index) => ({
    id: `${item.name}-${index}-${Math.round(Math.random() * 9999)}`,
    name: item.name,
    kind: item.kind,
    hint: item.hint,
    color: item.color,
    x: randomRange(0.16, 0.84),
    y: randomRange(0.2, 0.78),
    depth: randomRange(0.2, 0.92),
    found: false
  })) as SonarTarget[]
}

function createParticles() {
  return Array.from({ length: 42 }, (_, index) => ({
    id: index,
    x: Math.random(),
    y: Math.random(),
    size: randomRange(1, 3.4),
    speed: randomRange(0.02, 0.09),
    drift: randomRange(-0.18, 0.18),
    alpha: randomRange(0.18, 0.72)
  })) as OceanParticle[]
}

export default function ShowcaseVaultBreaker() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointerRef = useRef({ x: 0.5, y: 0.5 })
  const ripplesRef = useRef<RippleWave[]>([])
  const echoesRef = useRef<EchoGlow[]>([])
  const chargingRef = useRef(false)
  const chargeStartRef = useRef(0)
  const chargeVisualRef = useRef(0.18)
  const energyRef = useRef(FULL_ENERGY)
  const gainRef = useRef(58)
  const phaseRef = useRef<MissionPhase>('idle')
  const targetsRef = useRef<SonarTarget[]>(createMissionTargets())
  const rippleIdRef = useRef(0)

  const [targets, setTargets] = useState<SonarTarget[]>(() => createMissionTargets())
  const [energy, setEnergy] = useState(FULL_ENERGY)
  const [gain, setGain] = useState(58)
  const [phase, setPhase] = useState<MissionPhase>('idle')
  const [pings, setPings] = useState(0)
  const [charge, setCharge] = useState(18)
  const [message, setMessage] = useState('点击或长按海域，发出第一道声呐。')
  const [logs, setLogs] = useState<string[]>(['深海舱门已开启，等待第一道脉冲。'])

  const particles = useMemo(() => createParticles(), [])
  const foundTargets = useMemo(() => targets.filter(item => item.found), [targets])
  const missionPercent = useMemo(
    () => Math.round((foundTargets.length / TARGET_COUNT) * 100),
    [foundTargets.length]
  )
  const chargeText = useMemo(() => {
    if (charge >= 85) return '满功率脉冲'
    if (charge >= 55) return '中强脉冲'
    return '轻脉冲'
  }, [charge])

  const appendLog = useCallback((line: string) => {
    setLogs(prev => [line, ...prev].slice(0, 6))
  }, [])

  useEffect(() => {
    energyRef.current = energy
    gainRef.current = gain
    phaseRef.current = phase
    targetsRef.current = targets
  }, [energy, gain, phase, targets])

  const resetMission = useCallback(() => {
    const nextTargets = createMissionTargets()
    targetsRef.current = nextTargets
    ripplesRef.current = []
    echoesRef.current = []
    energyRef.current = FULL_ENERGY
    phaseRef.current = 'idle'
    chargingRef.current = false
    chargeVisualRef.current = 0.18
    pointerRef.current = { x: 0.5, y: 0.5 }
    setTargets(nextTargets)
    setEnergy(FULL_ENERGY)
    setGain(58)
    setPhase('idle')
    setPings(0)
    setCharge(18)
    setMessage('新一轮搜索已部署，按住海域可蓄力。')
    setLogs(['任务重置：未知回波已重新分布。'])
  }, [])

  const emitPing = useCallback(
    (chargeLevel?: number, forcedX?: number, forcedY?: number) => {
      const currentPhase = phaseRef.current
      if (currentPhase === 'clear') {
        setMessage('三枚目标都已锁定，可以重开一局。')
        return
      }

      const actualCharge = clamp(chargeLevel ?? chargeVisualRef.current, 0.18, 1)
      const currentEnergy = energyRef.current
      const cost = Math.round(8 + actualCharge * 18 + gainRef.current * 0.08)

      if (currentEnergy < cost) {
        setPhase('depleted')
        phaseRef.current = 'depleted'
        setMessage('能量不足，无法继续发射声呐。')
        appendLog('能量耗尽：本次海域搜索结束。')
        return
      }

      const nextEnergy = clamp(currentEnergy - cost, 0, FULL_ENERGY)
      energyRef.current = nextEnergy
      setEnergy(nextEnergy)
      setPings(prev => prev + 1)

      if (currentPhase === 'idle') {
        setPhase('hunting')
        phaseRef.current = 'hunting'
        appendLog('第一道声呐已发出，注意回波波峰。')
      }

      const centerX = forcedX ?? pointerRef.current.x
      const centerY = forcedY ?? pointerRef.current.y
      const pingRadius = 0.18 + gainRef.current / 360 + actualCharge * 0.34
      const pingStrength = 0.54 + actualCharge * 0.7

      ripplesRef.current.push({
        id: rippleIdRef.current++,
        x: centerX,
        y: centerY,
        radius: pingRadius,
        life: 1,
        strength: pingStrength
      })

      let newFindCount = 0
      let strongestEcho = 0
      let echoSummary = '这一击没有扫出清晰轮廓。'

      const nextTargets = targetsRef.current.map(target => {
        const dx = target.x - centerX
        const dy = target.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const depthPenalty = 0.78 - target.depth * 0.24
        const effectiveRadius = pingRadius * (1.08 - target.depth * 0.22)
        const echoStrength = clamp(
          (1 - distance / effectiveRadius) * pingStrength * depthPenalty,
          0,
          1
        )

        if (echoStrength > 0.16) {
          echoesRef.current.push({
            id: rippleIdRef.current++,
            x: target.x,
            y: target.y,
            life: clamp(0.34 + echoStrength * 0.7, 0.24, 1),
            strength: echoStrength,
            color: readCssVar(rootRef.current, target.color, target.color)
          })
        }

        if (echoStrength > strongestEcho) {
          strongestEcho = echoStrength
          echoSummary = `最近的一次强回波来自 ${target.kind} 方位。`
        }

        if (!target.found && echoStrength > 0.62) {
          newFindCount += 1
          return { ...target, found: true }
        }

        return target
      })

      targetsRef.current = nextTargets
      setTargets(nextTargets)

      const foundCount = nextTargets.filter(item => item.found).length

      if (newFindCount > 0) {
        setMessage(`捕获到 ${newFindCount} 个清晰目标，继续补扫剩余区域。`)
        appendLog(`锁定成功：新增 ${newFindCount} 个目标。`)
      } else if (strongestEcho > 0.28) {
        setMessage('出现弱回波，换个角度再压近一点。')
        appendLog(echoSummary)
      } else {
        setMessage('回波太弱了，试试长按蓄力或扩大扫描增益。')
        appendLog('本次只有背景噪声，没有形成可靠轮廓。')
      }

      if (foundCount >= TARGET_COUNT) {
        setPhase('clear')
        phaseRef.current = 'clear'
        setMessage('全部目标锁定，海底地图已经点亮。')
        appendLog('任务完成：三类目标已全部确认。')
        return
      }

      if (nextEnergy <= 0) {
        setPhase('depleted')
        phaseRef.current = 'depleted'
        setMessage('能量见底，暂时失去继续搜索能力。')
        appendLog('最后一道脉冲已发出，舱体进入节能模式。')
      }
    },
    [appendLog]
  )

  const launchIntroPing = useCallback(() => {
    emitPing(0.36, 0.5, 0.56)
  }, [emitPing])

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    pointerRef.current = {
      x: clamp((clientX - rect.left) / rect.width, 0.06, 0.94),
      y: clamp((clientY - rect.top) / rect.height, 0.08, 0.92)
    }
  }, [])

  const handleStagePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (phaseRef.current === 'clear' || phaseRef.current === 'depleted') return
      updatePointer(event.clientX, event.clientY)
      chargingRef.current = true
      chargeStartRef.current = performance.now()
      chargeVisualRef.current = 0.18
      setCharge(18)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [updatePointer]
  )

  const handleStagePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      updatePointer(event.clientX, event.clientY)
    },
    [updatePointer]
  )

  const releaseCharge = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!chargingRef.current) return
      chargingRef.current = false
      updatePointer(event.clientX, event.clientY)
      const holdDuration = performance.now() - chargeStartRef.current
      const nextCharge = clamp(0.18 + holdDuration / 900, 0.18, 1)
      chargeVisualRef.current = nextCharge
      setCharge(Math.round(nextCharge * 100))
      emitPing(nextCharge)
      window.setTimeout(() => {
        chargeVisualRef.current = 0.18
        setCharge(18)
      }, 180)
      event.currentTarget.releasePointerCapture(event.pointerId)
    },
    [emitPing, updatePointer]
  )

  const cancelCharge = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!chargingRef.current) return
    chargingRef.current = false
    chargeVisualRef.current = 0.18
    setCharge(18)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  useEffect(() => {
    let raf = 0

    const tick = () => {
      if (chargingRef.current) {
        const held = performance.now() - chargeStartRef.current
        const nextCharge = clamp(0.18 + held / 900, 0.18, 1)
        chargeVisualRef.current = nextCharge
        setCharge(prev => {
          const next = Math.round(nextCharge * 100)
          return Math.abs(prev - next) > 2 ? next : prev
        })
      }
      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [])

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

    const resolveTargetColor = (token: string) => readCssVar(rootRef.current, token, token)
    const palette = {
      bgTop: readCssVar(rootRef.current, '--sonar-canvas-bg-top'),
      bgMid: readCssVar(rootRef.current, '--sonar-canvas-bg-mid'),
      bgBottom: readCssVar(rootRef.current, '--sonar-canvas-bg-bottom'),
      glowA: readCssVar(rootRef.current, '--sonar-canvas-glow-a'),
      glowB: readCssVar(rootRef.current, '--sonar-canvas-glow-b'),
      backdropRing: readCssVar(rootRef.current, '--sonar-canvas-backdrop-ring'),
      contour: readCssVar(rootRef.current, '--sonar-canvas-contour'),
      particle: readCssVar(rootRef.current, '--sonar-canvas-particle'),
      ripplePrimary: readCssVar(rootRef.current, '--sonar-canvas-ripple-primary'),
      rippleSecondary: readCssVar(rootRef.current, '--sonar-canvas-ripple-secondary'),
      targetOutline: readCssVar(rootRef.current, '--sonar-canvas-target-outline'),
      aimFocus: readCssVar(rootRef.current, '--sonar-canvas-aim-focus'),
      crosshair: readCssVar(rootRef.current, '--sonar-canvas-crosshair')
    }

    const drawBackdrop = (time: number) => {
      const bg = ctx.createLinearGradient(0, 0, 0, height)
      bg.addColorStop(0, palette.bgTop)
      bg.addColorStop(0.48, palette.bgMid)
      bg.addColorStop(1, palette.bgBottom)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      const glowA = ctx.createRadialGradient(
        width * 0.18,
        height * 0.2,
        0,
        width * 0.18,
        height * 0.2,
        width * 0.42
      )
      glowA.addColorStop(0, withOpacity(palette.glowA, 0.16))
      glowA.addColorStop(1, withOpacity(palette.glowA, 0))
      ctx.fillStyle = glowA
      ctx.fillRect(0, 0, width, height)

      const glowB = ctx.createRadialGradient(
        width * 0.76,
        height * 0.72,
        0,
        width * 0.76,
        height * 0.72,
        width * 0.48
      )
      glowB.addColorStop(0, withOpacity(palette.glowB, 0.14))
      glowB.addColorStop(1, withOpacity(palette.glowB, 0))
      ctx.fillStyle = glowB
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.translate(width * 0.5, height * 0.84)
      ctx.scale(1.2, 0.42)
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath()
        ctx.strokeStyle = withOpacity(palette.backdropRing, 0.1 - i * 0.015)
        ctx.lineWidth = 1
        ctx.arc(0, 0, width * (0.18 + i * 0.11), 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()

      for (let line = 0; line < 8; line += 1) {
        const y = height * (0.16 + line * 0.1) + Math.sin(time * 0.8 + line) * 4
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(width * 0.24, y - 18, width * 0.76, y + 18, width, y - 2)
        ctx.strokeStyle = withOpacity(palette.contour, 0.06)
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    const render = (now: number) => {
      const time = now * 0.001
      drawBackdrop(time)

      for (let pi = 0; pi < particles.length; pi += 1) {
        const particle = particles[pi]
        const x = (particle.x + particle.drift * Math.sin(time * 0.4 + particle.id)) * width
        const y = ((particle.y + time * particle.speed) % 1) * height
        ctx.beginPath()
        ctx.fillStyle = withOpacity(palette.particle, particle.alpha)
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ripplesRef.current = ripplesRef.current.filter(item => item.life > 0.04)
      const currentRipples = ripplesRef.current
      for (let ri = 0; ri < currentRipples.length; ri += 1) {
        const item = currentRipples[ri]
        item.life *= 0.972
        item.radius += 0.008 + item.strength * 0.004
        const radius = Math.min(width, height) * item.radius

        ctx.beginPath()
        ctx.arc(item.x * width, item.y * height, radius, 0, Math.PI * 2)
        ctx.strokeStyle = withOpacity(palette.ripplePrimary, item.life * 0.42)
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(item.x * width, item.y * height, radius * 0.66, 0, Math.PI * 2)
        ctx.strokeStyle = withOpacity(palette.rippleSecondary, item.life * 0.24)
        ctx.lineWidth = 1
        ctx.stroke()
      }

      echoesRef.current = echoesRef.current.filter(item => item.life > 0.03)
      const currentEchoes = echoesRef.current
      for (let ei = 0; ei < currentEchoes.length; ei += 1) {
        const item = currentEchoes[ei]
        item.life *= 0.955
        const x = item.x * width
        const y = item.y * height
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 28 + item.strength * 42)
        glow.addColorStop(0, `${item.color}cc`)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, 24 + item.strength * 32, 0, Math.PI * 2)
        ctx.fill()
      }

      const currentTargets = targetsRef.current
      for (let ti = 0; ti < currentTargets.length; ti += 1) {
        const target = currentTargets[ti]
        const index = ti
        const x = target.x * width
        const y = target.y * height
        const targetColor = resolveTargetColor(target.color)

        if (target.found) {
          const bob = Math.sin(time * 1.1 + index) * 4
          const markerSize = 9 + (1 - target.depth) * 8
          ctx.beginPath()
          ctx.fillStyle = withOpacity(targetColor, 0.9)
          ctx.moveTo(x, y - markerSize + bob)
          ctx.lineTo(x + markerSize * 0.72, y + bob)
          ctx.lineTo(x, y + markerSize + bob)
          ctx.lineTo(x - markerSize * 0.72, y + bob)
          ctx.closePath()
          ctx.fill()

          ctx.beginPath()
          ctx.strokeStyle = withOpacity(palette.targetOutline, 0.72)
          ctx.lineWidth = 1
          ctx.arc(x, y + bob, 16 + (1 - target.depth) * 16, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      const aimX = pointerRef.current.x * width
      const aimY = pointerRef.current.y * height
      const focusRadius = 28 + chargeVisualRef.current * 26

      ctx.beginPath()
      ctx.arc(aimX, aimY, focusRadius, 0, Math.PI * 2)
      ctx.strokeStyle = withOpacity(palette.aimFocus, chargingRef.current ? 0.92 : 0.56)
      ctx.lineWidth = chargingRef.current ? 2.4 : 1.4
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(aimX - 22, aimY)
      ctx.lineTo(aimX + 22, aimY)
      ctx.moveTo(aimX, aimY - 22)
      ctx.lineTo(aimX, aimY + 22)
      ctx.strokeStyle = withOpacity(palette.crosshair, 0.34)
      ctx.lineWidth = 1
      ctx.stroke()

      raf = window.requestAnimationFrame(render)
    }

    resize()
    const debouncedResize = thrDeb.debounce(resize, 200)
    window.addEventListener('resize', debouncedResize, { passive: true })
    raf = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [particles])

  const statusAlertType = phase === 'clear' ? 'success' : phase === 'depleted' ? 'warning' : 'info'

  return (
    <div ref={rootRef} className="sonar-depth">
      <div className="sonar-depth__noise" />
      <div className="sonar-depth__beams" />

      <main className="relative z-[1] mx-auto w-[min(1240px,calc(100%-32px))] pb-[42px] pt-[34px] max-[720px]:w-[min(100%-20px,100%)] max-[720px]:pb-7 max-[720px]:pt-[22px]">
        <header className="sonar-depth__hero flex items-start justify-between gap-5 rounded-[28px] px-[26px] py-6 max-[1024px]:flex-col max-[720px]:rounded-[24px] max-[720px]:px-[18px] max-[720px]:py-5 border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
          <div>
            <p className="inline-flex items-center min-h-[34px] m-0 px-3.5 rounded-[999px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_16%,transparent)] bg-[var(--white-alpha-04)] text-[var(--sonar-color-cyan)] text-[12px] tracking-[0.18em] uppercase font-[var(--font-family-tech)]">
              作品展 / 04
            </p>
            <h1 className="m-[10px_0_0] font-[var(--font-family-tech)] text-[clamp(38px,5vw,72px)] leading-[0.94] tracking-[0.06em] text-transparent bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sonar-color-cyan)_76%,white),var(--sonar-color-cyan)_40%,var(--sonar-color-mint)_100%)] bg-clip-text [-webkit-background-clip:text] [filter:drop-shadow(0_0_18px_color-mix(in_srgb,var(--sonar-color-cyan)_18%,transparent))]">
              深海声呐
            </h1>
            <p className="m-4_0_0 max-w-[700px] text-[15px] leading-[1.8] text-[var(--sonar-text-soft)]">
              先发出第一道声呐，再根据回波强弱决定下一次扫描的位置。你的目标是在有限能量里找出遗迹、生物群和信标。
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Tag color="cyan" className="ui-tag">
                点击即玩
              </Tag>
              <Tag color="blue" className="ui-tag">
                长按蓄力
              </Tag>
              <Tag color="green" className="ui-tag">
                深海回波
              </Tag>
            </div>
          </div>

          <div className="flex max-w-[480px] flex-wrap justify-end gap-2.5 max-[1024px]:max-w-none max-[1024px]:justify-start max-[720px]:w-full">
            <Button
              className="border-none text-[var(--sonar-text-inverse)] bg-[linear-gradient(120deg,var(--sonar-color-cyan),var(--sonar-color-mint))] ui-button-cta max-[720px]:basis-full"
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={launchIntroPing}
              disabled={phase === 'clear' || phase === 'depleted'}
            >
              发出第一道声呐
            </Button>
            <Button
              className="border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_22%,transparent)] bg-[var(--white-alpha-04)] text-[var(--sonar-text-primary)] ui-button-cta max-[720px]:basis-full"
              icon={<ReloadOutlined />}
              onClick={resetMission}
            >
              重新部署
            </Button>
            <Link
              to="/"
              className="border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_22%,transparent)] bg-[var(--white-alpha-04)] text-[var(--sonar-text-primary)] ui-button-secondary ui-button-cta max-[720px]:basis-full"
            >
              <ArrowLeftOutlined aria-hidden="true" />
              返回首页
            </Link>
          </div>
        </header>

        <section className="mt-4 grid grid-cols-3 gap-[14px] max-[720px]:grid-cols-1">
          <article className="rounded-[22px] px-[18px] pb-4 pt-[18px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
            <span className="m-0 text-[color-mix(in_srgb,var(--sonar-text-soft)_92%,transparent)] text-[12px] tracking-[0.16em] uppercase font-[var(--font-family-tech)]">
              已发现目标
            </span>
            <strong className="block m-[10px_0_14px] font-[var(--font-family-tech)] text-[clamp(26px,4vw,42px)] leading-[1]">
              {foundTargets.length}/{TARGET_COUNT}
            </strong>
            <Progress
              percent={missionPercent}
              showInfo={false}
              strokeColor="var(--sonar-color-cyan)"
              trailColor="var(--white-alpha-10)"
            />
          </article>
          <article className="rounded-[22px] px-[18px] pb-4 pt-[18px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
            <span className="m-0 text-[color-mix(in_srgb,var(--sonar-text-soft)_92%,transparent)] text-[12px] tracking-[0.16em] uppercase font-[var(--font-family-tech)]">
              剩余能量
            </span>
            <strong className="block m-[10px_0_14px] font-[var(--font-family-tech)] text-[clamp(26px,4vw,42px)] leading-[1]">
              {energy}%
            </strong>
            <Progress
              percent={energy}
              showInfo={false}
              strokeColor="var(--sonar-color-mint)"
              trailColor="var(--white-alpha-10)"
            />
          </article>
          <article className="rounded-[22px] px-[18px] pb-4 pt-[18px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
            <span className="m-0 text-[color-mix(in_srgb,var(--sonar-text-soft)_92%,transparent)] text-[12px] tracking-[0.16em] uppercase font-[var(--font-family-tech)]">
              当前阶段
            </span>
            <strong className="block m-[10px_0_14px] font-[var(--font-family-tech)] text-[clamp(26px,4vw,42px)] leading-[1]">
              {PHASE_TAG_MAP[phase].label}
            </strong>
            <p className="m-2.5_0_0 text-[13px] text-[color-mix(in_srgb,var(--sonar-text-soft)_88%,transparent)]">
              {phase === 'idle' ? '等待发出第一道扫描脉冲。' : message}
            </p>
          </article>
        </section>

        <section className="mt-4 grid items-start gap-[14px] min-[1025px]:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="rounded-[26px] p-[18px] max-[720px]:rounded-[20px] max-[720px]:p-[14px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
            <div className="mb-[14px] flex items-start justify-between gap-4 max-[1024px]:flex-col">
              <div>
                <h2 className="m-0 flex items-center gap-2.5 text-[22px]">
                  <CompassOutlined /> 海域扫描台
                </h2>
                <p className="m-2_0_0 text-[color-mix(in_srgb,var(--sonar-text-soft)_88%,transparent)] text-[14px]">
                  点一下海域发轻脉冲，长按再松手就是蓄力扫。先摸区，再补扫，会更容易锁定目标。
                </p>
              </div>
            </div>

            <div
              ref={stageRef}
              className="sonar-depth__stage relative h-[clamp(420px,66vh,720px)] overflow-hidden rounded-[24px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_14%,transparent)] bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--color-black)_22%,transparent)_100%),color-mix(in_srgb,var(--sonar-bg-0)_82%,var(--sonar-bg-1))] touch-none select-none"
              onPointerDown={handleStagePointerDown}
              onPointerMove={handleStagePointerMove}
              onPointerUp={releaseCharge}
              onPointerLeave={cancelCharge}
              onPointerCancel={cancelCharge}
            >
              <canvas ref={canvasRef} className="w-full h-full block" />
              <div className="absolute left-4 right-4 top-4 flex flex-wrap justify-between gap-2.5 pointer-events-none max-[720px]:left-2.5 max-[720px]:right-2.5">
                <div className="p-2_3 rounded-[999px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_20%,transparent)] bg-[color-mix(in_srgb,var(--sonar-bg-0)_72%,transparent)] text-[var(--sonar-text-primary)] text-[12px] tracking-[0.08em] backdrop-blur-[10px]">
                  声呐 {pings} 次
                </div>
                <div className="p-2_3 rounded-[999px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_20%,transparent)] bg-[color-mix(in_srgb,var(--sonar-bg-0)_72%,transparent)] text-[var(--sonar-text-primary)] text-[12px] tracking-[0.08em] backdrop-blur-[10px]">
                  增益 {gain}
                </div>
                <div className="p-2_3 rounded-[999px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_20%,transparent)] bg-[color-mix(in_srgb,var(--sonar-bg-0)_72%,transparent)] text-[var(--sonar-text-primary)] text-[12px] tracking-[0.08em] backdrop-blur-[10px]">
                  {chargeText}
                </div>
                <div className="p-2_3 rounded-[999px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_20%,transparent)] bg-[color-mix(in_srgb,var(--sonar-bg-0)_72%,transparent)] text-[var(--sonar-text-primary)] text-[12px] tracking-[0.08em] backdrop-blur-[10px]">
                  剩余 {TARGET_COUNT - foundTargets.length} 个
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2.5 pointer-events-none max-[720px]:left-2.5 max-[720px]:right-2.5 max-[720px]:flex-col max-[720px]:items-start">
                <span className="text-[color-mix(in_srgb,var(--sonar-text-primary)_82%,transparent)] text-[13px]">
                  点击即发射
                </span>
                <span className="text-[color-mix(in_srgb,var(--sonar-text-primary)_82%,transparent)] text-[13px]">
                  长按可蓄力
                </span>
              </div>
            </div>
          </div>

          <aside className="grid gap-[14px]">
            <div className="rounded-[20px] p-[18px] max-[720px]:p-[14px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
              <div className="mb-[14px] grid gap-1.5">
                <h3 className="m-0 text-[18px]">扫描设置</h3>
                <span className="text-[color-mix(in_srgb,var(--sonar-text-soft)_86%,transparent)] text-[13px] leading-[1.7]">
                  调高增益更容易扫到远处，但每次更耗能。
                </span>
              </div>
              <div className="grid gap-2.5">
                <span className="text-[color-mix(in_srgb,var(--sonar-text-primary)_82%,transparent)] text-[13px]">
                  扫描增益
                </span>
                <Slider
                  min={28}
                  max={88}
                  value={gain}
                  onChange={(value: number | [number, number]) => {
                    if (typeof value === 'number') {
                      setGain(value)
                    }
                  }}
                />
              </div>
              <div className="mt-4 grid gap-2.5">
                <span className="text-[color-mix(in_srgb,var(--sonar-text-primary)_82%,transparent)] text-[13px]">
                  当前蓄力
                </span>
                <Progress
                  percent={charge}
                  showInfo={false}
                  strokeColor={{
                    '0%': 'var(--sonar-color-cyan)',
                    '100%': 'var(--sonar-color-mint)'
                  }}
                  trailColor="var(--white-alpha-08)"
                />
              </div>
            </div>

            <div className="rounded-[20px] p-[18px] max-[720px]:p-[14px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
              <div className="mb-[14px] grid gap-1.5">
                <h3 className="m-0 text-[18px]">搜索回报</h3>
                <span className="text-[color-mix(in_srgb,var(--sonar-text-soft)_86%,transparent)] text-[13px] leading-[1.7]">
                  先用轻脉冲摸区，再用长按补扫最稳。
                </span>
              </div>
              <Alert
                type={statusAlertType}
                showIcon
                message={message}
                className="rounded-[16px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_14%,transparent)] bg-[color-mix(in_srgb,var(--sonar-bg-1)_74%,transparent)]"
              />
            </div>

            <div className="rounded-[20px] p-[18px] max-[720px]:p-[14px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
              <div className="mb-[14px] grid gap-1.5">
                <h3 className="m-0 text-[18px]">目标清单</h3>
                <span className="text-[color-mix(in_srgb,var(--sonar-text-soft)_86%,transparent)] text-[13px] leading-[1.7]">
                  找到以后会点亮名称和特征。
                </span>
              </div>
              <div className="grid gap-2.5">
                {targets.map(target => (
                  <article
                    key={target.id}
                    className={`grid grid-cols-[12px_minmax(0,1fr)] items-start gap-3 rounded-[18px] p-[14px] border border-solid ${target.found ? 'border-[color-mix(in_srgb,var(--sonar-color-cyan)_24%,transparent)] -translate-y-px' : 'border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)]'} bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]`}
                  >
                    <div
                      className="w-3 h-3 rounded-[999px] mt-1.25 shadow-[0_0_18px_currentColor]"
                      style={{
                        background: target.found
                          ? `var(${target.color})`
                          : 'var(--sonar-target-unfound)'
                      }}
                    />
                    <div>
                      <strong className="block text-[15px]">
                        {target.found ? target.name : '未识别目标'}
                      </strong>
                      <p className="m-1.5_0_0 text-[color-mix(in_srgb,var(--sonar-text-soft)_86%,transparent)] text-[13px] leading-[1.7]">
                        {target.found
                          ? `${target.kind} · ${target.hint}`
                          : '等待更清晰的声呐回波。'}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] p-[18px] max-[720px]:p-[14px] border border-solid border-[color-mix(in_srgb,var(--sonar-line-base)_100%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sonar-color-cyan)_8%,transparent),color-mix(in_srgb,var(--color-white)_2%,transparent)),var(--sonar-surface-panel)] shadow-[0_22px_48px_color-mix(in_srgb,var(--color-black)_28%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-white)_3%,transparent)] backdrop-blur-[18px]">
              <div className="mb-[14px] grid gap-1.5">
                <h3 className="m-0 text-[18px]">脉冲记录</h3>
                <span className="text-[color-mix(in_srgb,var(--sonar-text-soft)_86%,transparent)] text-[13px] leading-[1.7]">
                  最近几次扫描的回声摘要。
                </span>
              </div>
              <div className="grid gap-2.5">
                {logs.map((line, index) => (
                  <p
                    key={`${line}-${index}`}
                    className="m-0 p-3_3.5 rounded-[14px] border border-solid border-[color-mix(in_srgb,var(--sonar-color-cyan)_10%,transparent)] bg-[var(--white-alpha-03)] text-[color-mix(in_srgb,var(--sonar-text-soft)_88%,transparent)] text-[13px] leading-[1.7]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
