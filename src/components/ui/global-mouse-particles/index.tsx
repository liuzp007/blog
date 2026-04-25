import { useEffect, useState } from 'react'

function readRootCssVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export default function GlobalMouseParticles(): null {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const interactiveViewport = window.matchMedia(
      '(min-width: 769px) and (hover: hover) and (pointer: fine)'
    )
    return !reduceMotion.matches && interactiveViewport.matches
  })

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const interactiveViewport = window.matchMedia(
      '(min-width: 769px) and (hover: hover) and (pointer: fine)'
    )
    const updateEnabled = () => setEnabled(!reduceMotion.matches && interactiveViewport.matches)

    updateEnabled()
    reduceMotion.addEventListener('change', updateEnabled)
    interactiveViewport.addEventListener('change', updateEnabled)
    return () => {
      reduceMotion.removeEventListener('change', updateEnabled)
      interactiveViewport.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.className =
      'global-mouse-particles pointer-events-none fixed inset-0 z-[120] h-full w-full'
    canvas.setAttribute('aria-hidden', 'true')
    document.body.appendChild(canvas)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      decay: number
      size: number
      color: string
    }> = []

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particleColors = [
      readRootCssVar('--color-accent-gold', 'goldenrod'),
      readRootCssVar('--color-accent-cyan', 'mediumturquoise')
    ]
    let raf = 0
    let running = true
    let drawing = false
    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const scheduleDraw = () => {
      if (!running || drawing) return
      drawing = true
      raf = window.requestAnimationFrame(draw)
    }

    const spawn = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          life: 1,
          decay: 0.02 + Math.random() * 0.018,
          size: 1.6 + Math.random() * 2.4,
          color: particleColors[Math.random() > 0.5 ? 0 : 1]
        })
      }
      scheduleDraw()
    }

    const onMove = (event: MouseEvent) => spawn(event.clientX, event.clientY)
    const onPointerDown = (event: PointerEvent) => spawn(event.clientX, event.clientY, 12)

    const onVisibilityChange = () => {
      running = !document.hidden
      if (running && particles.length) {
        scheduleDraw()
        return
      }

      drawing = false
      window.cancelAnimationFrame(raf)
    }

    const draw = () => {
      drawing = false
      if (!running) return

      ctx.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i]
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= particle.decay

        if (particle.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.life * 0.48
        ctx.fill()
        ctx.globalAlpha = 1
      }

      if (particles.length > 120) particles.splice(0, particles.length - 120)
      if (particles.length) scheduleDraw()
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      running = false
      drawing = false
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.remove()
    }
  }, [enabled])

  return null
}
