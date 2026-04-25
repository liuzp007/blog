import { useEffect, useRef } from 'react'

interface SignalWaveOverlayProps {
  enabled: boolean
}

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

export default function SignalWaveOverlay({ enabled }: SignalWaveOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let raf = 0
    let running = true

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawWave = (
      time: number,
      amplitude: number,
      speed: number,
      color: string,
      offset: number
    ) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      for (let x = 0; x <= width; x += 10) {
        const dist = Math.abs(x - pointer.current.x)
        const focus = Math.max(0, 1 - dist / 260)
        const y =
          height * 0.48 +
          Math.sin(x * 0.01 + time * speed + offset) * (amplitude + focus * 14) +
          Math.cos(x * 0.003 + time * 0.002 + offset) * 18
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    const render = (now: number) => {
      if (!running) return
      const t = now * 0.001
      ctx.clearRect(0, 0, width, height)

      drawWave(t, 12, 0.8, readHomeCssVar('--home-signal-wave-primary', 'cyan'), 0)
      drawWave(t, 16, 1.12, readHomeCssVar('--home-signal-wave-secondary', 'gold'), 1.4)
      drawWave(t, 9, 1.36, readHomeCssVar('--home-signal-wave-accent', 'coral'), 2.2)
      raf = requestAnimationFrame(render)
    }

    const onMove = (event: MouseEvent) => {
      pointer.current.x = event.clientX
      pointer.current.y = event.clientY
    }

    const onVisibilityChange = () => {
      running = !document.hidden
      if (running) raf = requestAnimationFrame(render)
      else cancelAnimationFrame(raf)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    raf = requestAnimationFrame(render)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled])

  return <canvas ref={canvasRef} className="signal-wave-overlay" />
}
