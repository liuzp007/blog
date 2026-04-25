import { useRef, useState, useEffect, useCallback } from 'react'

const readRootCssVar = (name: string, fallback = 'currentColor') => {
  if (typeof window === 'undefined') return fallback
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export interface MousePosition {
  x: number
  y: number
  velocityX: number
  velocityY: number
}

export interface InteractionEffect {
  id: number
  x: number
  y: number
  time: number
  type: 'click' | 'hover' | 'pulse'
}

// --- Module-level singleton for mouse tracking (client-event-listeners) ---
type MouseListener = (pos: MousePosition) => void
const mouseListeners = new Set<MouseListener>()
let singletonMousePos: MousePosition = { x: 0, y: 0, velocityX: 0, velocityY: 0 }
let prevPos = { x: 0, y: 0 }
let mouseInited = false

function ensureMouseListener() {
  if (mouseInited || typeof window === 'undefined') return
  mouseInited = true

  window.addEventListener(
    'mousemove',
    e => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      const velocityX = x - prevPos.x
      const velocityY = y - prevPos.y
      const pos = { x, y, velocityX, velocityY }
      singletonMousePos = pos
      prevPos = { x, y }
      mouseListeners.forEach(fn => fn(pos))
    },
    { passive: true }
  )
}

// ---

export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>(() => singletonMousePos)

  const [interactions, setInteractions] = useState<InteractionEffect[]>([])
  const interactionIdRef = useRef(0)
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // advanced-event-handler-refs: handler ref 避免订阅重建
  const listenerRef = useRef<MouseListener>(pos => setMousePosition(pos))
  listenerRef.current = pos => setMousePosition(pos)

  useEffect(() => {
    ensureMouseListener()
    const fn: MouseListener = pos => listenerRef.current(pos)
    mouseListeners.add(fn)
    return () => {
      mouseListeners.delete(fn)
    }
  }, [])

  const addInteraction = useCallback((type: InteractionEffect['type']) => {
    const pos = singletonMousePos
    const interaction: InteractionEffect = {
      id: interactionIdRef.current++,
      x: pos.x,
      y: pos.y,
      time: Date.now(),
      type
    }

    setInteractions(prev => [...prev, interaction])

    const tid = setTimeout(
      () => setInteractions(prev => prev.filter(item => item.id !== interaction.id)),
      type === 'pulse' ? 2000 : 1000
    )
    timeoutIdsRef.current.push(tid)
  }, [])

  // click / touch / keydown 仍需 addInteraction，但依赖稳定
  useEffect(() => {
    const handleClick = () => addInteraction('click')

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const x = (touch.clientX / window.innerWidth) * 2 - 1
        const y = -(touch.clientY / window.innerHeight) * 2 + 1
        singletonMousePos = { x, y, velocityX: 0, velocityY: 0 }
        mouseListeners.forEach(fn => fn(singletonMousePos))
        addInteraction('click')
      }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        addInteraction('pulse')
      }
    }

    // client-passive-event-listeners: touchmove/touchstart 标记 passive
    window.addEventListener('click', handleClick)
    window.addEventListener('touchmove', handleTouch, { passive: true })
    window.addEventListener('touchstart', handleTouch, { passive: true })
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('keydown', handleKeyPress)
      timeoutIdsRef.current.forEach(clearTimeout)
      timeoutIdsRef.current = []
    }
  }, [addInteraction])

  return {
    mousePosition,
    interactions,
    addInteraction
  }
}

interface ParticleFollowOptions {
  particleCount?: number
  mousePosition: MousePosition
  interactions: InteractionEffect[]
}

// 粒子跟随效果
export const useParticleFollow = ({
  particleCount = 100,
  mousePosition,
  interactions
}: ParticleFollowOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const mousePositionRef = useRef(mousePosition)
  const interactionsRef = useRef(interactions)
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      targetX: number
      targetY: number
      size: number
      color: string
      velocity: { x: number; y: number }
      life: number
    }>
  >([])
  const isVisibleRef = useRef(true)

  useEffect(() => {
    mousePositionRef.current = mousePosition
  }, [mousePosition])

  useEffect(() => {
    interactionsRef.current = interactions
  }, [interactions])

  // 初始化粒子
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cw = (canvas.width = window.innerWidth)
    const ch = (canvas.height = window.innerHeight)

    const particlePalette = [
      readRootCssVar('--color-ambient-cyan'),
      readRootCssVar('--color-ambient-pink'),
      readRootCssVar('--color-ambient-purple')
    ]
    const canvasTrail = readRootCssVar('--black-alpha-10')
    const paletteLen = particlePalette.length

    // 创建粒子
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      targetX: Math.random() * cw,
      targetY: Math.random() * ch,
      size: Math.random() * 3 + 1,
      color: particlePalette[i % paletteLen],
      velocity: { x: 0, y: 0 },
      life: 1
    }))
    particlesRef.current = particles

    // IntersectionObserver: 不可见时暂停绘制
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    // prefers-reduced-motion 动态监听
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reducedMotionRef = { current: motionQuery.matches }
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    motionQuery.addEventListener('change', handleMotionChange)

    const animate = () => {
      // js-cache-property-access: 缓存循环内高频属性
      const currentW = canvas.width
      const currentH = canvas.height

      if (!isVisibleRef.current || reducedMotionRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.fillStyle = canvasTrail
      ctx.fillRect(0, 0, currentW, currentH)

      const mp = mousePositionRef.current
      const targetX = ((mp.x + 1) * currentW) / 2
      const targetY = ((-mp.y + 1) * currentH) / 2

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = targetX - p.x
        const dy = targetY - p.y
        const distSq = dx * dx + dy * dy

        if (distSq < 40000) {
          const distance = Math.sqrt(distSq)
          const force = (200 - distance) / 200
          const safeDistance = Math.max(distance, 1)
          p.velocity.x += (dx / safeDistance) * force * 0.5
          p.velocity.y += (dy / safeDistance) * force * 0.5
        }

        p.velocity.x *= 0.95
        p.velocity.y *= 0.95
        p.x += p.velocity.x
        p.y += p.velocity.y

        if (p.x < 0 || p.x > currentW) p.velocity.x *= -1
        if (p.y < 0 || p.y > currentH) p.velocity.y *= -1

        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 处理交互涟漪效果
      const currentInteractions = interactionsRef.current
      for (let i = 0; i < currentInteractions.length; i++) {
        const interaction = currentInteractions[i]
        const ix = ((interaction.x + 1) * currentW) / 2
        const iy = ((-interaction.y + 1) * currentH) / 2
        const age = (Date.now() - interaction.time) / 1000
        const radius = age * 100

        ctx.strokeStyle = particlePalette[0]
        ctx.lineWidth = 2
        ctx.globalAlpha = Math.max(0, 1 - age / 2)
        ctx.beginPath()
        ctx.arc(ix, iy, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      observer.disconnect()
      motionQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      canvas.width = 0
      canvas.height = 0
    }
  }, [particleCount])

  return canvasRef
}
