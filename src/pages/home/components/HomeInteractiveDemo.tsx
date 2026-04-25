import React, { startTransition, useEffect, useRef, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

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

function usePageVisible() {
  const [visible, setVisible] = useState(() => {
    if (typeof document === 'undefined') return true
    return !document.hidden
  })

  useEffect(() => {
    const handleVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return visible
}

function useViewportActive<T extends Element>(
  ref: React.RefObject<T>,
  threshold = 0.1,
  rootMargin = '0px'
) {
  const pageVisible = usePageVisible()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        setInView(Boolean(entry?.isIntersecting))
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold])

  return pageVisible && inView
}

function withOpacity(color: string, opacity: number) {
  if (!color.startsWith('#')) return color
  const alpha = Math.round(Math.max(0, Math.min(opacity, 1)) * 255)
    .toString(16)
    .padStart(2, '0')
  return `${color}${alpha}`
}

export default function HomeInteractiveDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const active = useViewportActive(canvasRef, 0.18, '200px 0px')
  const [stats, setStats] = useState({ nodes: 0, links: 0, fps: 0 })
  const statsRef = useRef({ nodes: 0, links: 0, fps: 0 })
  const lastCommitRef = useRef(0)
  const frameCounterRef = useRef(0)
  const fpsStartRef = useRef(performance.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pointer = { x: -9999, y: -9999, active: false }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let raf = 0
    let rect = canvas.getBoundingClientRect()

    const nodes = Array.from({ length: 46 }).map(() => ({
      x: Math.random() * 1000,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: 1.6 + Math.random() * 2.8
    }))

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodes.forEach(n => {
        n.x = Math.min(Math.max(n.x, 0), width)
        n.y = Math.min(Math.max(n.y, 0), height)
      })
    }

    const onMove = (event: MouseEvent) => {
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }

    const onLeave = () => {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    const onClick = (event: MouseEvent) => {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      nodes.forEach(n => {
        const dx = n.x - x
        const dy = n.y - y
        const distance = Math.hypot(dx, dy) || 1
        const force = Math.max(0, 120 - distance) / 30
        n.vx += (dx / distance) * force
        n.vy += (dy / distance) * force
      })
    }

    const draw = () => {
      const backdrop = readHomeCssVar('--home-demo-backdrop', 'black')
      const linkColor = readHomeCssVar('--home-demo-link', 'cyan')
      const nodeActive = readHomeCssVar('--home-accent-gold', 'gold')
      const nodeIdle = readHomeCssVar('--home-demo-node-idle', 'white')

      ctx.fillStyle = backdrop
      ctx.fillRect(0, 0, width, height)

      let linkCount = 0
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i]
        node.x += node.vx
        node.y += node.vy
        node.vx *= 0.985
        node.vy *= 0.985

        if (node.x <= 0 || node.x >= width) node.vx *= -1
        if (node.y <= 0 || node.y >= height) node.vy *= -1

        if (pointer.active) {
          const dx = pointer.x - node.x
          const dy = pointer.y - node.y
          const dist = Math.hypot(dx, dy)
          if (dist < 220) {
            node.vx += (dx / (dist || 1)) * 0.02
            node.vy += (dy / (dist || 1)) * 0.02
          }
        }

        for (let j = i + 1; j < nodes.length; j += 1) {
          const other = nodes[j]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.hypot(dx, dy)
          if (dist < 124) {
            linkCount += 1
            const alpha = (1 - dist / 124) * 0.42
            ctx.beginPath()
            ctx.strokeStyle = withOpacity(linkColor, alpha)
            ctx.lineWidth = 1
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }

        ctx.beginPath()
        const glow = pointer.active ? withOpacity(nodeActive, 0.92) : withOpacity(nodeIdle, 0.88)
        ctx.fillStyle = glow
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fill()
      }

      frameCounterRef.current += 1
      const now = performance.now()
      let fps = statsRef.current.fps
      if (now - fpsStartRef.current > 500) {
        fps = Math.round((frameCounterRef.current * 1000) / (now - fpsStartRef.current))
        frameCounterRef.current = 0
        fpsStartRef.current = now
      }

      statsRef.current = { nodes: nodes.length, links: linkCount, fps }
      if (performance.now() - lastCommitRef.current > 240) {
        lastCommitRef.current = performance.now()
        const nextStats = statsRef.current
        startTransition(() => setStats(nextStats))
      }
      if (active) {
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    canvas.addEventListener('mousemove', onMove, { passive: true })
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('mouseenter', resize, { passive: true })
    canvas.addEventListener('click', onClick, { passive: true })
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', resize, { passive: true })
    draw()

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('mouseenter', resize)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', resize)
    }
  }, [active])

  return (
    <div className="demo-container home-demo">
      <div className="demo-header home-demo__header flex items-center justify-between">
        <span className="demo-title home-demo__title">信号游乐场</span>
        <div className="demo-controls home-demo__controls inline-flex items-center gap-2">
          <span className="demo-btn close home-demo__dot home-demo__dot--close" />
          <span className="demo-btn minimize home-demo__dot home-demo__dot--minimize" />
          <span className="demo-btn maximize home-demo__dot home-demo__dot--maximize" />
        </div>
      </div>
      <canvas ref={canvasRef} className="home-demo__canvas" />
      <div className="demo-footer home-demo__footer flex flex-wrap justify-between gap-[10px]">
        <span>粒子数量: {stats.nodes}</span>
        <span>
          {stats.links} 条连线 · {stats.fps} 帧
        </span>
      </div>
    </div>
  )
}
