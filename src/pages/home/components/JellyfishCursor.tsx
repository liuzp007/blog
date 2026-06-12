import { useEffect, useRef } from 'react'

/* ------------------------------------------------------------------ */
/*  JellyfishCursor — 水母光标组件                                      */
/*  Canvas 两层：小圆点（实心）+ 水母外环（静止后渐入）                    */
/* ------------------------------------------------------------------ */

/** 颜色池 */
const JELLYFISH_COLORS = [
  '#4fc3f7',
  '#ab47bc',
  '#26c6da',
  '#66bb6a',
  '#ef5350',
  '#ff7043',
  '#7e57c2',
  '#29b6f6'
]

/** hover 目标选择器 */
const HOVER_SELECTOR = 'a, button, .work-card, [data-hover]'

/** 尺寸常量 */
const DOT_RADIUS = 4
const DOT_COLOR = '#fbbf24'
const JELLYFISH_BASE_RADIUS = 28
const JELLYFISH_HOVER_RADIUS = 28
const IDLE_THRESHOLD_MS = 300
const ANIMATION_DURATION_MS = 400

/** hex → { r, g, b } */
function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/** 随机选取颜色（排除上一次） */
function pickColor(prev: string): string {
  const pool = JELLYFISH_COLORS.filter(c => c !== prev)
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function JellyfishCursor(): null {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    /* -------- 移动端检测 -------- */
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) return

    /* -------- 创建 Canvas -------- */
    const canvas = document.createElement('canvas')
    canvasRef.current = canvas
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '9999'
    } as CSSStyleDeclaration)
    document.body.appendChild(canvas)

    /* 隐藏原生 cursor */
    document.documentElement.classList.add('jellyfish-cursor-active')

    const ctx = canvas.getContext('2d')!

    /* -------- 尺寸管理 -------- */
    let dpr = window.devicePixelRatio || 1
    function resize() {
      dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    /* -------- 状态 -------- */
    let mouseX = -100
    let mouseY = -100
    let smoothX = -100
    let smoothY = -100
    let isIdle = false
    let idleTimer: ReturnType<typeof setTimeout> | null = null
    let isHovering = false
    let isClicking = false
    let clickReleaseTimer: ReturnType<typeof setTimeout> | null = null

    let jellyAnim = 0
    let dotScale = 1
    let currentColor = JELLYFISH_COLORS[0]
    let prevColor = currentColor
    let jellyfishTime = 0
    let tentacleSeed = Math.random() * 1000

    /* -------- 事件 -------- */
    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (isIdle) {
        isIdle = false
        prevColor = currentColor
      }
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (!isIdle) {
          isIdle = true
          currentColor = pickColor(prevColor)
          tentacleSeed = Math.random() * 1000
          jellyfishTime = 0
        }
      }, IDLE_THRESHOLD_MS)
    }

    function onMouseDown() {
      isClicking = true
      if (clickReleaseTimer) clearTimeout(clickReleaseTimer)
    }
    function onMouseUp() {
      clickReleaseTimer = setTimeout(() => {
        isClicking = false
      }, 120)
    }

    function checkHover() {
      const el = document.elementFromPoint(mouseX, mouseY)
      if (!el) {
        isHovering = false
        return
      }
      isHovering = el.closest(HOVER_SELECTOR) !== null
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    /* -------- 绘制函数 -------- */

    function drawDot(x: number, y: number, scale: number) {
      if (scale < 0.01) return
      const r = DOT_RADIUS * scale
      ctx.beginPath()
      ctx.arc(x * dpr, y * dpr, r * dpr, 0, Math.PI * 2)
      ctx.fillStyle = DOT_COLOR
      ctx.fill()
    }

    function drawJellyfish(x: number, y: number, anim: number) {
      if (anim < 0.01) return

      const clickScale = isClicking ? 0.7 : 1
      const hoverScale = isHovering ? JELLYFISH_HOVER_RADIUS / JELLYFISH_BASE_RADIUS : 1
      const baseR = JELLYFISH_BASE_RADIUS * hoverScale * clickScale
      const { r, g, b } = hexToRgb(currentColor)
      const cx = x * dpr
      const cy = y * dpr
      const time = jellyfishTime

      ctx.save()
      ctx.globalAlpha = anim

      // 有机圆形基底（bell）
      const bellR = baseR * dpr
      const breathe = 1 + Math.sin(time * 2.0) * 0.06
      const actualR = bellR * breathe

      const grad = ctx.createRadialGradient(cx, cy - 2 * dpr, 0, cx, cy, actualR)
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`)
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.35)`)
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.12)`)

      ctx.beginPath()
      const segments = 12
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const wobble =
          Math.sin(angle * 3 + time * 1.5) * 0.08 + Math.sin(angle * 5 + time * 2.3) * 0.04
        const rr = actualR * (1 + wobble)
        const px = cx + Math.cos(angle) * rr
        const py = cy + Math.sin(angle) * rr
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          const prevAngle = ((i - 0.5) / segments) * Math.PI * 2
          const prevWobble =
            Math.sin(prevAngle * 3 + time * 1.5) * 0.08 +
            Math.sin(prevAngle * 5 + time * 2.3) * 0.04
          const cpx = cx + Math.cos(prevAngle) * actualR * (1 + prevWobble) * 1.05
          const cpy = cy + Math.sin(prevAngle) * actualR * (1 + prevWobble) * 1.05
          ctx.quadraticCurveTo(cpx, cpy, px, py)
        }
      }
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()

      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`
      ctx.shadowBlur = 15 * dpr
      ctx.fill()
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0

      // 螺旋触手
      drawTentacles(cx, cy, actualR, r, g, b, time)

      ctx.restore()
    }

    function drawTentacles(
      cx: number,
      cy: number,
      bellR: number,
      r: number,
      g: number,
      b: number,
      time: number
    ) {
      const tentacleCount = 4
      for (let t = 0; t < tentacleCount; t++) {
        const side = t < tentacleCount / 2 ? -1 : 1
        const idx = t % (tentacleCount / 2)
        const baseAngle = side * (Math.PI * 0.35 + idx * 0.25)
        const startAngle = baseAngle + Math.sin(time * 0.8 + tentacleSeed + t) * 0.15

        const startX = cx + Math.cos(startAngle) * bellR * 0.85
        const startY = cy + Math.sin(startAngle) * bellR * 0.85

        const length = bellR * (1.2 + idx * 0.4)
        const spiralTightness = 3 + idx
        const alpha = 0.3 - idx * 0.08

        ctx.beginPath()
        ctx.moveTo(startX, startY)

        const steps = 30
        for (let s = 1; s <= steps; s++) {
          const progress = s / steps
          const dist = progress * length
          const spiralAngle =
            startAngle +
            side * progress * spiralTightness +
            Math.sin(time * 1.2 + tentacleSeed + t * 2 + progress * 4) * 0.4
          const waveOffset = Math.sin(progress * 6 + time * 2 + tentacleSeed) * bellR * 0.08

          const tx =
            startX + Math.cos(spiralAngle) * dist + waveOffset * Math.cos(spiralAngle + Math.PI / 2)
          const ty =
            startY + Math.sin(spiralAngle) * dist + waveOffset * Math.sin(spiralAngle + Math.PI / 2)
          ctx.lineTo(tx, ty)
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.lineWidth = Math.max(1, 2.5 - idx * 0.5) * dpr
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      // 下方垂下的短触须
      const fringeCount = 5
      for (let f = 0; f < fringeCount; f++) {
        const angleOff = ((f - (fringeCount - 1) / 2) / fringeCount) * Math.PI * 0.6
        const startX = cx + Math.cos(Math.PI / 2 + angleOff) * bellR * 0.7
        const startY = cy + Math.sin(Math.PI / 2 + angleOff) * bellR * 0.7
        const fringeLen = bellR * (0.4 + Math.sin(tentacleSeed + f) * 0.15)

        ctx.beginPath()
        ctx.moveTo(startX, startY)

        const fringeSteps = 15
        for (let s = 1; s <= fringeSteps; s++) {
          const p = s / fringeSteps
          const sway = Math.sin(p * 5 + time * 2.5 + tentacleSeed + f * 1.3) * bellR * 0.06
          const fx = startX + sway
          const fy = startY + p * fringeLen
          ctx.lineTo(fx, fy)
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`
        ctx.lineWidth = Math.max(1, 1.5) * dpr
        ctx.lineCap = 'round'
        ctx.stroke()
      }
    }

    /* -------- 动画循环 -------- */
    let rafId = 0

    function loop() {
      rafId = requestAnimationFrame(loop)

      smoothX += (mouseX - smoothX) * 0.6
      smoothY += (mouseY - smoothY) * 0.6

      checkHover()

      const dt = 1 / 60
      jellyfishTime += dt

      if (isIdle) {
        jellyAnim = Math.min(1, jellyAnim + dt * (1000 / ANIMATION_DURATION_MS))
      } else {
        jellyAnim = Math.max(0, jellyAnim - dt * (1000 / ANIMATION_DURATION_MS) * 2)
      }

      const targetDotScale = isHovering && jellyAnim < 0.3 ? 0 : 1
      dotScale += (targetDotScale - dotScale) * 0.15

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawJellyfish(smoothX, smoothY, jellyAnim)
      drawDot(smoothX, smoothY, dotScale)
    }

    loop()

    return () => {
      cancelAnimationFrame(rafId)
      if (idleTimer) clearTimeout(idleTimer)
      if (clickReleaseTimer) clearTimeout(clickReleaseTimer)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.documentElement.classList.remove('jellyfish-cursor-active')
      canvas.remove()
    }
  }, [])

  return null
}
