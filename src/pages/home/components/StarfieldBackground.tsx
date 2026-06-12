import { useEffect, useRef } from 'react'

/**
 * 星点数据结构
 */
interface Star {
  /** 归一化 x 坐标 (0-1)，相对于 canvas 宽度 */
  x: number
  /** 归一化 y 坐标 (0-1)，相对于 canvas 高度 */
  y: number
  /** 半径 px (0.5-2) */
  r: number
  /** 基础透明度 */
  baseAlpha: number
  /** 漂移速度 x (每帧) */
  dx: number
  /** 漂移速度 y (每帧) */
  dy: number
  /** 闪烁速度 (rad/s)，0 表示不闪烁 */
  twinkleSpeed: number
  /** 闪烁相位偏移 */
  twinklePhase: number
  /** 视差深度层 (0-1)，越大越靠前、视差越大 */
  depth: number
}

interface StarfieldBackgroundProps {
  /** 是否启用动画 */
  enabled?: boolean
  /** 星点数量 */
  starCount?: number
}

/** 线性插值 */
function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor
}

/** 随机范围 */
function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/** 创建单个星点 */
function createStar(): Star {
  const hasTwinkle = Math.random() < 0.35
  return {
    x: Math.random(),
    y: Math.random(),
    r: rand(0.5, 2),
    baseAlpha: rand(0.3, 1),
    dx: rand(-0.00003, 0.00003),
    dy: rand(-0.00003, 0.00003),
    twinkleSpeed: hasTwinkle ? rand(0.5, 2.0) : 0,
    twinklePhase: rand(0, Math.PI * 2),
    depth: rand(0.2, 1)
  }
}

/** 创建全部星点 */
function createStars(count: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push(createStar())
  }
  return stars
}

/**
 * 星空粒子背景 — Canvas fixed 全屏覆盖，z-index 最底层
 *
 * 特性：
 * - ~200 颗随机分布的星点，不同大小(0.5-2px)和亮度
 * - 星点缓慢漂移动画
 * - 鼠标移动视差位移（反方向，lerp 平滑跟随）
 * - 部分星点微弱闪烁（opacity 缓慢正弦变化）
 * - pointer-events: none 不阻挡交互
 */
export default function StarfieldBackground({
  enabled = true,
  starCount = 200
}: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

    // 星点数据
    const stars = createStars(starCount)

    // 鼠标位置（归一化 -1 ~ 1）
    const mouseTarget = { x: 0, y: 0 }
    const mouseCurrent = { x: 0, y: 0 }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMouseMove = (e: MouseEvent) => {
      // 归一化到 -1 ~ 1
      mouseTarget.x = (e.clientX / width - 0.5) * 2
      mouseTarget.y = (e.clientY / height - 0.5) * 2
    }

    const onMouseLeave = () => {
      mouseTarget.x = 0
      mouseTarget.y = 0
    }

    const draw = (time: number) => {
      if (!running) return

      ctx.clearRect(0, 0, width, height)

      // 背景
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)

      // lerp 平滑跟随鼠标
      mouseCurrent.x = lerp(mouseCurrent.x, mouseTarget.x, 0.02)
      mouseCurrent.y = lerp(mouseCurrent.y, mouseTarget.y, 0.02)

      const timeSeconds = time * 0.001

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // 漂移
        star.x += star.dx
        star.y += star.dy

        // 边界环绕
        if (star.x < -0.05) star.x = 1.05
        if (star.x > 1.05) star.x = -0.05
        if (star.y < -0.05) star.y = 1.05
        if (star.y > 1.05) star.y = -0.05

        // 视差偏移（反方向，幅度根据 depth 缩放）
        const parallaxStrength = 15
        const px = star.x * width - mouseCurrent.x * parallaxStrength * star.depth
        const py = star.y * height - mouseCurrent.y * parallaxStrength * star.depth

        // 闪烁
        let alpha = star.baseAlpha
        if (star.twinkleSpeed > 0) {
          const twinkle = Math.sin(timeSeconds * star.twinkleSpeed + star.twinklePhase)
          // twinkle 在 -1~1，映射到 0.5~1.0 的范围，避免完全消失
          alpha = star.baseAlpha * (0.5 + 0.5 * twinkle)
        }

        // 绘制星点
        ctx.beginPath()
        ctx.arc(px, py, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()

        // 较大/较亮的星点添加微弱辉光
        if (star.r > 1.2 && alpha > 0.6) {
          ctx.beginPath()
          ctx.arc(px, py, star.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    // 初始化
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [enabled, starCount])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}
