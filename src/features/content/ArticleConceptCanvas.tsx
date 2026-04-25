import { useEffect, useMemo, useRef, useState, memo } from 'react'
import { composeHslAlphaColor, readRuntimeColorVar } from '@/utils/color-runtime'
import type { ContentMeta } from './contentCatalog'

export type ArticleVisualScene =
  | 'git-flow'
  | 'vite-stream'
  | 'module-graph'
  | 'reactivity-field'
  | 'react-lanes'
  | 'space-orbit'
  | 'signal-grid'

interface ArticleConceptCanvasProps {
  item: ContentMeta
  enabled: boolean
  className?: string
}

interface DerivedParams {
  seed: number
  density: number
  layers: number
  pulse: number
  velocity: number
  titleWeight: number
  summaryWeight: number
  tagWeight: number
}

interface ScenePalette {
  background: string
  panel: string
  primary: string
  secondary: string
  accent: string
  grid: string
  clear: string
  nodeFillStrong: string
  nodeFillSoft: string
  moduleLink: string
}

const SCENES: ArticleVisualScene[] = [
  'git-flow',
  'vite-stream',
  'module-graph',
  'reactivity-field',
  'react-lanes',
  'space-orbit',
  'signal-grid'
]

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

function withOpacity(color: string, opacity: number) {
  if (!color.startsWith('#')) return color
  const alpha = Math.round(Math.max(0, Math.min(opacity, 1)) * 255)
    .toString(16)
    .padStart(2, '0')
  return `${color}${alpha}`
}

const hashString = (input: string) => {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return Math.abs(hash >>> 0)
}

const normalize = (value: number, divisor: number, fallback = 0.5) => {
  if (!divisor) return fallback
  return clamp(value / divisor, 0, 1)
}

const resolveVisualScene = (item: ContentMeta): ArticleVisualScene => {
  if (item.visualScene && SCENES.includes(item.visualScene as ArticleVisualScene)) {
    return item.visualScene as ArticleVisualScene
  }

  const category = (item.category || '').toLowerCase()
  const tags = item.tags.map(tag => tag.toLowerCase())
  const text = `${item.title} ${item.summary} ${tags.join(' ')}`.toLowerCase()

  if (category === 'git' || tags.includes('git')) return 'git-flow'
  if (category === 'vite' || tags.includes('vite')) return 'vite-stream'
  if (category === 'webpack' || tags.includes('webpack')) return 'module-graph'
  if (
    category === 'vue2' ||
    category === 'vue3' ||
    text.includes('响应式') ||
    text.includes('scheduler')
  )
    return 'reactivity-field'
  if (text.includes('react') || text.includes('concurrency') || text.includes('fiber'))
    return 'react-lanes'
  if (tags.includes('r3f') || tags.includes('three') || tags.includes('webgl')) return 'space-orbit'
  return 'signal-grid'
}

const getScenePalette = (
  scene: ArticleVisualScene,
  seed: number,
  element: HTMLElement | null
): ScenePalette => {
  const twist = seed % 24
  const sharedPalette = {
    clear: readRuntimeColorVar('--article-concept-clear', 'transparent', element),
    nodeFillStrong: readRuntimeColorVar(
      '--article-concept-node-fill-strong',
      'transparent',
      element
    ),
    nodeFillSoft: readRuntimeColorVar('--article-concept-node-fill-soft', 'transparent', element),
    moduleLink: readRuntimeColorVar('--article-concept-module-link', 'currentColor', element)
  }

  switch (scene) {
    case 'git-flow':
      return {
        background: readRuntimeColorVar(
          '--article-concept-git-background',
          'currentColor',
          element
        ),
        panel: composeHslAlphaColor({
          hue: 26 + twist,
          saturation: 70,
          lightness: 16,
          alpha: 0.96
        }),
        primary: composeHslAlphaColor({ hue: 30 + twist, saturation: 84, lightness: 64, alpha: 1 }),
        secondary: readRuntimeColorVar('--article-concept-git-secondary', 'currentColor', element),
        accent: readRuntimeColorVar('--article-concept-git-accent', 'currentColor', element),
        grid: readRuntimeColorVar('--article-concept-git-grid', 'transparent', element),
        ...sharedPalette
      }
    case 'vite-stream':
      return {
        background: readRuntimeColorVar(
          '--article-concept-vite-background',
          'currentColor',
          element
        ),
        panel: composeHslAlphaColor({
          hue: 184 + twist,
          saturation: 60,
          lightness: 16,
          alpha: 0.96
        }),
        primary: readRuntimeColorVar('--article-concept-vite-primary', 'currentColor', element),
        secondary: readRuntimeColorVar('--article-concept-vite-secondary', 'currentColor', element),
        accent: composeHslAlphaColor({ hue: 42 + twist, saturation: 90, lightness: 64, alpha: 1 }),
        grid: readRuntimeColorVar('--article-concept-vite-grid', 'transparent', element),
        ...sharedPalette
      }
    case 'module-graph':
      return {
        background: readRuntimeColorVar(
          '--article-concept-module-background',
          'currentColor',
          element
        ),
        panel: composeHslAlphaColor({
          hue: 214 + twist,
          saturation: 44,
          lightness: 15,
          alpha: 0.96
        }),
        primary: readRuntimeColorVar('--article-concept-module-primary', 'currentColor', element),
        secondary: readRuntimeColorVar(
          '--article-concept-module-secondary',
          'currentColor',
          element
        ),
        accent: composeHslAlphaColor({
          hue: 42 + twist,
          saturation: 86,
          lightness: 62,
          alpha: 0.94
        }),
        grid: readRuntimeColorVar('--article-concept-module-grid', 'transparent', element),
        ...sharedPalette
      }
    case 'reactivity-field':
      return {
        background: readRuntimeColorVar(
          '--article-concept-reactivity-background',
          'currentColor',
          element
        ),
        panel: composeHslAlphaColor({
          hue: 194 + twist,
          saturation: 40,
          lightness: 15,
          alpha: 0.96
        }),
        primary: readRuntimeColorVar(
          '--article-concept-reactivity-primary',
          'currentColor',
          element
        ),
        secondary: readRuntimeColorVar(
          '--article-concept-reactivity-secondary',
          'currentColor',
          element
        ),
        accent: composeHslAlphaColor({
          hue: 32 + twist,
          saturation: 92,
          lightness: 66,
          alpha: 0.96
        }),
        grid: readRuntimeColorVar('--article-concept-reactivity-grid', 'transparent', element),
        ...sharedPalette
      }
    case 'react-lanes':
      return {
        background: readRuntimeColorVar(
          '--article-concept-react-background',
          'currentColor',
          element
        ),
        panel: composeHslAlphaColor({
          hue: 244 + twist,
          saturation: 38,
          lightness: 15,
          alpha: 0.96
        }),
        primary: readRuntimeColorVar('--article-concept-react-primary', 'currentColor', element),
        secondary: readRuntimeColorVar(
          '--article-concept-react-secondary',
          'currentColor',
          element
        ),
        accent: composeHslAlphaColor({
          hue: 34 + twist,
          saturation: 90,
          lightness: 66,
          alpha: 0.96
        }),
        grid: readRuntimeColorVar('--article-concept-react-grid', 'transparent', element),
        ...sharedPalette
      }
    case 'space-orbit':
      return {
        background: readRuntimeColorVar(
          '--article-concept-space-background',
          'currentColor',
          element
        ),
        panel: composeHslAlphaColor({
          hue: 210 + twist,
          saturation: 50,
          lightness: 12,
          alpha: 0.98
        }),
        primary: readRuntimeColorVar('--article-concept-space-primary', 'currentColor', element),
        secondary: readRuntimeColorVar(
          '--article-concept-space-secondary',
          'currentColor',
          element
        ),
        accent: composeHslAlphaColor({
          hue: 28 + twist,
          saturation: 94,
          lightness: 68,
          alpha: 0.96
        }),
        grid: readRuntimeColorVar('--article-concept-space-grid', 'transparent', element),
        ...sharedPalette
      }
    default:
      return {
        background: readRuntimeColorVar(
          '--article-concept-signal-background',
          'currentColor',
          element
        ),
        panel: composeHslAlphaColor({
          hue: 196 + twist,
          saturation: 26,
          lightness: 15,
          alpha: 0.98
        }),
        primary: readRuntimeColorVar('--article-concept-signal-primary', 'currentColor', element),
        secondary: readRuntimeColorVar(
          '--article-concept-signal-secondary',
          'currentColor',
          element
        ),
        accent: composeHslAlphaColor({
          hue: 42 + twist,
          saturation: 88,
          lightness: 68,
          alpha: 0.96
        }),
        grid: readRuntimeColorVar('--article-concept-signal-grid', 'transparent', element),
        ...sharedPalette
      }
  }
}

const deriveParams = (item: ContentMeta): DerivedParams => {
  const seed = hashString(`${item.slug}:${item.title}:${item.summary}`)
  const titleWeight = normalize(item.title.length, 48)
  const summaryWeight = normalize(item.summary.length, 180, 0.42)
  const tagWeight = normalize(item.tags.length, 6, 0.36)

  return {
    seed,
    density: 18 + (seed % 10) + Math.round(tagWeight * 10),
    layers: 3 + (seed % 3),
    pulse: 0.72 + summaryWeight * 1.28,
    velocity: 0.56 + titleWeight * 1.14,
    titleWeight,
    summaryWeight,
    tagWeight
  }
}

const drawBackdrop = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: ScenePalette,
  scene: ArticleVisualScene,
  time: number
) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, palette.background)
  gradient.addColorStop(1, palette.panel)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const halo = ctx.createRadialGradient(
    width * 0.76,
    height * 0.24,
    0,
    width * 0.76,
    height * 0.24,
    width * 0.6
  )
  halo.addColorStop(0, palette.grid.replace(/0\.\d+\)$/, '0.22)'))
  halo.addColorStop(1, palette.clear)
  ctx.fillStyle = halo
  ctx.fillRect(0, 0, width, height)

  const bandOffset = (time * 18) % 48
  ctx.strokeStyle = palette.grid
  ctx.lineWidth = scene === 'signal-grid' ? 1 : 0.8
  for (let y = -48; y < height + 48; y += 24) {
    ctx.beginPath()
    ctx.moveTo(0, y + bandOffset * 0.18)
    ctx.lineTo(width, y + bandOffset * 0.18)
    ctx.stroke()
  }
}

const drawGitFlow = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: ScenePalette,
  params: DerivedParams
) => {
  const branches = 3 + Math.round(params.tagWeight * 3)
  const amplitude = 18 + params.summaryWeight * 26

  for (let i = 0; i < branches; i += 1) {
    const baseY = height * (0.26 + i * (0.52 / Math.max(1, branches - 1)))
    ctx.beginPath()
    ctx.lineWidth = i === 1 ? 2.6 : 1.4
    ctx.strokeStyle = i === 1 ? palette.primary : palette.secondary
    for (let x = 0; x <= width; x += 6) {
      const wave =
        Math.sin(x * 0.024 + time * params.velocity * 1.3 + i * 1.6) *
        amplitude *
        (i === 1 ? 0.32 : 0.18)
      const merge = Math.sin(x * 0.008 + i + time * 0.4) * 12
      const y = baseY + wave + merge
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    const commits = 5 + i + Math.round(params.titleWeight * 4)
    for (let j = 0; j < commits; j += 1) {
      const progress = (time * 0.1 * (i + 1) + j / commits + (params.seed % 17) * 0.01) % 1
      const x = progress * width
      const y =
        baseY +
        Math.sin(x * 0.024 + time * params.velocity * 1.3 + i * 1.6) *
          amplitude *
          (i === 1 ? 0.32 : 0.18)
      ctx.beginPath()
      ctx.arc(x, y, j % 2 === 0 ? 3.4 : 2.4, 0, Math.PI * 2)
      ctx.fillStyle = j % 2 === 0 ? palette.accent : palette.secondary
      ctx.fill()
    }
  }
}

const drawViteStream = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: ScenePalette,
  params: DerivedParams
) => {
  const streams = 10 + params.layers * 2
  for (let i = 0; i < streams; i += 1) {
    const y = (i / streams) * height
    const speed = params.velocity * (0.8 + (i % 4) * 0.24)
    ctx.beginPath()
    ctx.lineWidth = i % 3 === 0 ? 2 : 1
    ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.accent
    for (let x = -40; x <= width + 40; x += 12) {
      const nx = x + ((time * 60 * speed + i * 8) % 60)
      const wave = Math.sin(nx * 0.018 + i + time * speed) * (8 + params.summaryWeight * 12)
      const yy = y + wave + Math.cos(nx * 0.006 + i) * 10
      if (x === -40) ctx.moveTo(nx, yy)
      else ctx.lineTo(nx, yy)
    }
    ctx.stroke()
  }

  const pulses = 7 + params.density / 4
  for (let i = 0; i < pulses; i += 1) {
    const progress = (time * 0.18 * (1 + (i % 3) * 0.2) + i / pulses) % 1
    const x = progress * width
    const y = height * (0.18 + (i % 5) * 0.14) + Math.sin(progress * Math.PI * 4 + time) * 16
    ctx.beginPath()
    ctx.arc(x, y, 2.2 + (i % 3), 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? palette.secondary : palette.accent
    ctx.fill()
  }
}

const drawModuleGraph = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: ScenePalette,
  params: DerivedParams
) => {
  const cols = 4 + Math.round(params.titleWeight * 3)
  const rows = 3 + Math.round(params.tagWeight * 3)
  const nodes: Array<{ x: number; y: number; size: number }> = []

  for (let col = 0; col < cols; col += 1) {
    for (let row = 0; row < rows; row += 1) {
      const x = (col + 0.5) * (width / cols) + Math.sin(time * 0.8 + row + col) * 10
      const y = (row + 0.5) * (height / rows) + Math.cos(time * 0.6 + row * 0.7 + col) * 10
      const size = 18 + ((params.seed + col * 13 + row * 7) % 22)
      nodes.push({ x, y, size })

      ctx.fillStyle = col % 2 === 0 ? palette.nodeFillStrong : palette.nodeFillSoft
      ctx.strokeStyle = col % 2 === 0 ? palette.primary : palette.accent
      ctx.lineWidth = 1.1
      ctx.beginPath()
      ctx.roundRect(x - size, y - size * 0.6, size * 2, size * 1.2, 8)
      ctx.fill()
      ctx.stroke()
    }
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.hypot(dx, dy)
      if (dist > (width / cols) * 1.35) continue
      ctx.beginPath()
      ctx.moveTo(nodes[i].x, nodes[i].y)
      ctx.lineTo(nodes[j].x, nodes[j].y)
      ctx.strokeStyle = withOpacity(palette.moduleLink, clamp(1 - dist / 180, 0.04, 0.22))
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }
}

const drawReactivityField = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: ScenePalette,
  params: DerivedParams
) => {
  const cx = width * 0.5
  const cy = height * 0.52
  const rings = 3 + params.layers

  for (let i = 0; i < rings; i += 1) {
    const radius = 22 + i * 18 + Math.sin(time * params.pulse + i) * 4
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.accent
    ctx.lineWidth = i === 0 ? 2 : 1.2
    ctx.stroke()
  }

  const nodes = 10 + params.density / 3
  for (let i = 0; i < nodes; i += 1) {
    const angle = (i / nodes) * Math.PI * 2 + time * 0.22
    const radius = 26 + (i % 4) * 20 + params.summaryWeight * 18
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius * 0.7
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.strokeStyle = palette.grid
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? palette.secondary : palette.accent
    ctx.fill()
  }
}

const drawReactLanes = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: ScenePalette,
  params: DerivedParams
) => {
  const lanes = 4 + params.layers
  for (let i = 0; i < lanes; i += 1) {
    const y = height * (0.18 + i * (0.62 / Math.max(1, lanes - 1)))
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.grid
    ctx.lineWidth = i === 0 ? 2 : 1.1
    ctx.stroke()

    const packets = 2 + (i % 3)
    for (let j = 0; j < packets; j += 1) {
      const progress = (time * 0.18 * (1 + i * 0.08) + j / packets + (params.seed % 11) * 0.01) % 1
      const x = progress * width
      ctx.fillStyle = j % 2 === 0 ? palette.accent : palette.secondary
      ctx.beginPath()
      ctx.roundRect(x - 10, y - 6, 20, 12, 6)
      ctx.fill()
    }
  }

  for (let i = 0; i < 3; i += 1) {
    const x = width * (0.24 + i * 0.24) + Math.sin(time * 0.7 + i) * 10
    ctx.beginPath()
    ctx.moveTo(x, height * 0.22)
    ctx.lineTo(x, height * 0.78)
    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 1.4
    ctx.stroke()
  }
}

const drawSpaceOrbit = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: ScenePalette,
  params: DerivedParams
) => {
  const cx = width * 0.52
  const cy = height * 0.54
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.18)
  core.addColorStop(0, palette.secondary)
  core.addColorStop(0.3, palette.accent)
  core.addColorStop(1, palette.clear)
  ctx.fillStyle = core
  ctx.fillRect(0, 0, width, height)

  for (let i = 0; i < 4 + params.layers; i += 1) {
    const orbitRadius = 24 + i * 16 + Math.sin(time * 0.6 + i) * 4
    ctx.beginPath()
    ctx.ellipse(
      cx,
      cy,
      orbitRadius * 1.4,
      orbitRadius * 0.7,
      time * 0.12 + i * 0.18,
      0,
      Math.PI * 2
    )
    ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.grid
    ctx.lineWidth = 1
    ctx.stroke()

    const angle = time * params.velocity * 0.3 + i * 1.4
    const x = cx + Math.cos(angle) * orbitRadius * 1.4
    const y = cy + Math.sin(angle) * orbitRadius * 0.7
    ctx.beginPath()
    ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? palette.accent : palette.secondary
    ctx.fill()
  }
}

const drawSignalGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: ScenePalette,
  params: DerivedParams
) => {
  const cell = Math.max(22, 34 - params.tagWeight * 8)
  for (let x = 0; x <= width; x += cell) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.strokeStyle = palette.grid
    ctx.lineWidth = 1
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += cell) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.strokeStyle = palette.grid
    ctx.lineWidth = 1
    ctx.stroke()
  }

  const sweepX = ((time * 80 * params.velocity) % (width + 80)) - 40
  const sweep = ctx.createLinearGradient(sweepX, 0, sweepX + 80, 0)
  sweep.addColorStop(0, palette.clear)
  sweep.addColorStop(0.5, palette.primary.replace(/0?\.?\d*\)$/g, '0.24)'))
  sweep.addColorStop(1, palette.clear)
  ctx.fillStyle = sweep
  ctx.fillRect(0, 0, width, height)

  const points = 12 + params.density
  for (let i = 0; i < points; i += 1) {
    const x = ((params.seed % 37) + i * 29) % Math.max(cell, width)
    const y = ((params.seed % 53) + i * 17) % Math.max(cell, height)
    const pulse = Math.abs(Math.sin(time * 1.4 + i))
    ctx.beginPath()
    ctx.arc(x, y, 1.5 + pulse * 2.2, 0, Math.PI * 2)
    ctx.fillStyle = i % 3 === 0 ? palette.accent : palette.secondary
    ctx.fill()
  }
}

export default memo(function ArticleConceptCanvas({
  item,
  enabled,
  className = ''
}: ArticleConceptCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [inView, setInView] = useState(false)
  const scene = useMemo(() => resolveVisualScene(item), [item])
  const params = useMemo(() => deriveParams(item), [item])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        setInView(Boolean(entries[0]?.isIntersecting))
      },
      { threshold: 0.12, rootMargin: '140px 0px' }
    )

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rootElement = canvas.parentElement as HTMLElement | null
    const palette = getScenePalette(scene, params.seed, rootElement)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reducedMotionHandler = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches
      if (!reducedMotion && enabled && inView) {
        raf = window.requestAnimationFrame(render)
      }
    }
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', reducedMotionHandler)
    let width = 0
    let height = 0
    let raf = 0

    const resize = () => {
      width = canvas.clientWidth || 300
      height = canvas.clientHeight || 210
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawScene = (time: number) => {
      drawBackdrop(ctx, width, height, palette, scene, time)

      switch (scene) {
        case 'git-flow':
          drawGitFlow(ctx, width, height, time, palette, params)
          break
        case 'vite-stream':
          drawViteStream(ctx, width, height, time, palette, params)
          break
        case 'module-graph':
          drawModuleGraph(ctx, width, height, time, palette, params)
          break
        case 'reactivity-field':
          drawReactivityField(ctx, width, height, time, palette, params)
          break
        case 'react-lanes':
          drawReactLanes(ctx, width, height, time, palette, params)
          break
        case 'space-orbit':
          drawSpaceOrbit(ctx, width, height, time, palette, params)
          break
        default:
          drawSignalGrid(ctx, width, height, time, palette, params)
      }
    }

    const render = (now: number) => {
      drawScene(now * 0.001)
      if (enabled && inView && !reducedMotion) {
        raf = window.requestAnimationFrame(render)
      }
    }

    resize()
    const resizeObserver = new ResizeObserver(() => {
      resize()
      drawScene(0)
    })
    resizeObserver.observe(canvas)
    render(0)

    return () => {
      window.cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      motionQuery.removeEventListener('change', reducedMotionHandler)
      canvas.width = 0
      canvas.height = 0
    }
  }, [enabled, inView, item, params, scene])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
})
