import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Modal } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import * as THREE from 'three'
import TiltCard from '@/components/ui/tilt-card'
import SectionNav from '@/components/section-nav'
import { composeHslAlphaColor } from '@/utils/color-runtime'
import { useAppSelector } from '@/store'
import '@/styles/themes/about-pages.css'
import './index.css'

type PerformanceTier = 'low' | 'medium' | 'high'

function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('high')
  const reducedMotion = useAppSelector(s => s.userPreferences.reducedMotion)

  useEffect(() => {
    const check = () => {
      if (reducedMotion) {
        setTier('low')
        return
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        setTier('low')
        return
      }

      const deviceMemory = (navigator as any).deviceMemory as number | undefined
      const connection = (navigator as any).connection as { effectiveType?: string } | undefined
      const isMobile =
        /iphone|ipad|ipod|android|mobile/.test(navigator.userAgent.toLowerCase()) ||
        window.innerWidth < 768

      if (
        (deviceMemory !== undefined && deviceMemory < 4) ||
        (connection && connection.effectiveType === 'slow-2g') ||
        (isMobile && deviceMemory !== undefined && deviceMemory < 8)
      ) {
        setTier('low')
      } else if (
        (deviceMemory !== undefined && deviceMemory < 8) ||
        (connection && connection.effectiveType === '3g') ||
        isMobile
      ) {
        setTier('medium')
      } else {
        setTier('high')
      }
    }

    check()

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => check()
    media.addEventListener('change', handler)
    window.addEventListener('resize', handler)
    window.addEventListener('online', handler)
    window.addEventListener('offline', handler)

    return () => {
      media.removeEventListener('change', handler)
      window.removeEventListener('resize', handler)
      window.removeEventListener('online', handler)
      window.removeEventListener('offline', handler)
    }
  }, [reducedMotion])

  return tier
}

interface AboutMeProps extends RouteComponentProps {}

interface NavItem {
  id: string
  label: string
}

interface SkillItem {
  name: string
  percent: number
}

interface SkillCategory {
  title: string
  items: SkillItem[]
}

interface ProjectCard {
  title: string
  desc: string
  tags: string[]
  experiencePath?: string
  detailTitle: string
  detailSummary: string
  highlights: string[]
}

interface BlogCard {
  date: string
  title: string
  excerpt: string
  badge: string
  path: string
}

const CONTACT_EMAIL = 'roc.liu.sx.work@gmail.com'

const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '作品' },
  { id: 'blog', label: '文章' }
]

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: '前端开发',
    items: [
      { name: 'JavaScript / TypeScript', percent: 95 },
      { name: 'React', percent: 95 },
      { name: 'Vue', percent: 85 },
      { name: 'JQ', percent: 88 }
    ]
  },
  {
    title: '创意设计',
    items: [
      { name: '生成艺术', percent: 92 },
      { name: '交互设计', percent: 88 },
      { name: '动态图形', percent: 80 },
      { name: '数据可视化', percent: 85 }
    ]
  },
  {
    title: '技术栈',
    items: [
      { name: 'Node.js ', percent: 82 },
      { name: 'GLSL Shaders', percent: 78 },
      { name: 'AI / ML Basics', percent: 70 },
      { name: '物理模拟', percent: 75 }
    ]
  }
]

const PROJECTS: ProjectCard[] = [
  {
    title: '流体形态',
    desc: '基于 WebGL 的实时流体模拟，探索自然界的流动美学。',
    tags: ['WebGL', 'Generative Art'],
    experiencePath: '/fluid-form',
    detailTitle: '流体形态 / 实时流动实验',
    detailSummary:
      '这个作品聚焦于流动、扩散与色彩层叠的视觉关系。我把它当成一个偏生成艺术方向的实验，让画面在持续变化中保持节奏和呼吸感。',
    highlights: [
      '用连续变化的径向色团模拟流体扩散感',
      '强调暖色系叠加后的空间深度与透明感',
      '适合延展成更完整的 WebGL 交互作品'
    ]
  },
  {
    title: '数字花园',
    desc: '交互式 3D 植物生态系统，用户行为会持续影响生长形态。',
    tags: ['Three.js', 'Interactive'],
    experiencePath: '/digital-garden',
    detailTitle: '数字花园 / 空间生长装置',
    detailSummary:
      '这个作品更偏空间表达。我希望它不是单纯的场景展示，而是一种会因为用户进入、停留、操作而慢慢长出层次的数字花园。',
    highlights: [
      '把植物式生长逻辑和 3D 场景组合到一起',
      '强调用户行为对形态演变的持续影响',
      '适合作为更完整的沉浸式空间叙事入口'
    ]
  },
  {
    title: '声波可视化',
    desc: '实时音频频谱可视化，把音乐与视觉反馈压缩到同一个舞台里。',
    tags: ['Canvas', 'Audio Visualizer'],
    experiencePath: '/sound-visualizer',
    detailTitle: '声波可视化 / 听觉转译实验',
    detailSummary:
      '这个作品关注的是声音如何转成视觉节奏。我想把频谱、脉冲、动态波形这些元素组织成一种既可读又有表演感的视觉反馈。',
    highlights: [
      '用纵向脉冲和节奏条表现声音能量变化',
      '让视觉反馈跟随时间形成可观看的律动',
      '适合扩展到音乐互动或实时音频舞台场景'
    ]
  },
  {
    title: '分形宇宙',
    desc: 'GPU 感的分形图形生成器，持续拉出层层递进的空间细节。',
    tags: ['GLSL', 'Shader Art'],
    experiencePath: '/fractal-cosmos',
    detailTitle: '分形宇宙 / 无限细节生成器',
    detailSummary:
      '这个作品偏向图形系统本身的秩序感。我把递归、旋转、波动和轨迹叠在一起，让画面持续生成一种像宇宙构型一样的层级细节。',
    highlights: [
      '通过重复与扰动生成具有秩序感的复杂图形',
      '画面会持续推进，形成"越看越深"的空间感',
      '适合继续发展成完整的 shader art 系列作品'
    ]
  }
]

const BLOGS: BlogCard[] = [
  {
    date: '2024年12月',
    title: '用 Canvas 创建粒子系统：从入门到精通',
    excerpt: '深入探讨 Canvas 粒子系统的优化技巧与创意应用。',
    badge: 'CANVAS',
    path: '/blog'
  },
  {
    date: '2024年11月',
    title: 'WebGL 着色器艺术：光的舞蹈',
    excerpt: '探索 GLSL 着色器的更多可能，创造更具有氛围感的视觉效果。',
    badge: 'WEBGL',
    path: '/blog'
  },
  {
    date: '2024年10月',
    title: '生成艺术中的随机性与秩序',
    excerpt: '如何在算法中平衡控制与偶然，让结果既有结构也有惊喜。',
    badge: 'VIDEO',
    path: '/blog'
  }
]

const CONTACT_LINKS = [
  { label: 'G', href: `mailto:${CONTACT_EMAIL}`, title: '发邮件联系' },
  { label: 'B', href: '/blog', title: '进入博客' },
  { label: 'H', href: '/', title: '返回首页' },
  { label: 'P', href: '/test.pdf', title: '查看 PDF 简历' }
]

// rerender-hoist-jsx: 静态数据映射函数提取到模块级
const TAG_TONES = ['ui-tag--tone-coral', 'ui-tag--tone-gold', 'ui-tag--tone-mint'] as const
const getTagToneClass = (index: number) => TAG_TONES[index % TAG_TONES.length]

const getBlogBadgeTone = (badge: string) => {
  const key = badge.trim().toLowerCase()
  if (key.includes('canvas')) return 'ui-tag--tone-coral'
  if (key.includes('webgl')) return 'ui-tag--tone-gold'
  return 'ui-tag--tone-mint'
}

// rendering-hoist-jsx: 静态 JSX 提取到模块级
const LOW_TIER_GRADIENT_FALLBACK = (
  <div
    className="fixed inset-0 -z-10"
    style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)'
    }}
  />
)

// rerender-no-inline-components: DemoParticle 提取到 effect 外部
class DemoParticle {
  x = 0
  y = 0
  vx = 0
  vy = 0
  radius = 0
  hue = 0

  constructor(
    private getWidth: () => number,
    private getHeight: () => number
  ) {
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.getWidth()
    this.y = Math.random() * this.getHeight()
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.radius = Math.random() * 3 + 1
    this.hue = Math.random() * 40 + 20
  }

  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 100) {
      const force = (100 - dist) / 100
      this.vx += dx * force * 0.01
      this.vy += dy * force * 0.01
    }

    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.99
    this.vy *= 0.99

    if (this.x < 0 || this.x > this.getWidth() || this.y < 0 || this.y > this.getHeight()) {
      this.reset()
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3)
    gradient.addColorStop(
      0,
      composeHslAlphaColor({
        hue: this.hue,
        saturation: 80,
        lightness: 60,
        alpha: 0.8
      })
    )
    gradient.addColorStop(
      1,
      composeHslAlphaColor({
        hue: this.hue,
        saturation: 80,
        lightness: 60,
        alpha: 0
      })
    )
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }
}

export default withRouter(function AboutMe({ history: _history }: AboutMeProps) {
  const perfTier = usePerformanceTier()
  const pageRef = useRef<HTMLDivElement>(null)
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const demoCanvasRef = useRef<HTMLCanvasElement>(null)
  const projectCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const blogCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const [activeProject, setActiveProject] = useState<ProjectCard | null>(null)

  const readPageCssVar = useCallback((name: string, fallback = 'currentColor') => {
    const root = pageRef.current
    if (!root) return fallback
    return getComputedStyle(root).getPropertyValue(name).trim() || fallback
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const offset = window.innerWidth <= 768 ? 88 : 96
    const top = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  const navItems = useMemo(
    () =>
      NAV_ITEMS.map(item => ({
        ...item,
        href: `#${item.id}`,
        onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault()
          scrollToSection(item.id)
          window.history.replaceState(
            null,
            '',
            `${window.location.pathname}${window.location.search}#${item.id}`
          )
        }
      })),
    [scrollToSection]
  )

  // cursor-glow
  useEffect(() => {
    const glow = cursorGlowRef.current
    if (!glow) return

    if (perfTier === 'low') {
      glow.style.display = 'none'
      return undefined
    }

    glow.style.display = ''

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let glowX = mouseX
    let glowY = mouseY
    let rafId = 0

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
    }

    const animate = () => {
      glowX += (mouseX - glowX) * 0.1
      glowY += (mouseY - glowY) * 0.1
      // js-batch-dom-css: 一次写入 transform 替代分别写 left/top
      glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`
      rafId = window.requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMove, { passive: true })
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMove)
      window.cancelAnimationFrame(rafId)
    }
  }, [perfTier])

  // bgCanvas (Three.js particle background)
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return

    if (perfTier === 'low') {
      canvas.style.display = 'none'
      return undefined
    }
    canvas.style.display = ''

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: perfTier === 'high',
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const particlesCount = perfTier === 'high' ? 2000 : 800
    const gridDivisions = perfTier === 'high' ? 30 : 15
    const positions = new Float32Array(particlesCount * 3)
    const gridSize = 20

    for (let i = 0; i < particlesCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe87a3d,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.3
    })

    const lines: THREE.Line[] = []

    for (let i = 0; i <= gridDivisions; i += 1) {
      const y = (i / gridDivisions - 0.5) * gridSize
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-gridSize / 2, y, -5),
        new THREE.Vector3(gridSize / 2, y, -5)
      ])
      const line = new THREE.Line(geometry, lineMaterial)
      lines.push(line)
      scene.add(line)
    }

    for (let i = 0; i <= gridDivisions; i += 1) {
      const x = (i / gridDivisions - 0.5) * gridSize
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -gridSize / 2, -5),
        new THREE.Vector3(x, gridSize / 2, -5)
      ])
      const line = new THREE.Line(geometry, lineMaterial)
      lines.push(line)
      scene.add(line)
    }

    camera.position.z = 10

    // js-cache-property-access: 缓存 lines 数组长度
    const linesLen = lines.length
    let rafId = 0
    const animate = () => {
      rafId = window.requestAnimationFrame(animate)
      const time = Date.now() * 0.0005
      particles.rotation.y = time * 0.1
      particles.rotation.x = Math.sin(time) * 0.1
      for (let i = 0; i < linesLen; i += 1) {
        lines[i].position.y = Math.sin(time + i * 0.1) * 0.3
      }
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    animate()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(rafId)
      particleGeometry.dispose()
      particleMaterial.dispose()
      lineMaterial.dispose()
      for (let i = 0; i < linesLen; i += 1) lines[i].geometry.dispose()
      renderer.dispose()
    }
  }, [perfTier])

  // demoCanvas (2D interactive particles)
  useEffect(() => {
    const canvas = demoCanvasRef.current
    if (!canvas) return

    if (perfTier === 'low') {
      canvas.style.display = 'none'
      return undefined
    }
    canvas.style.display = ''

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const demoFade = readPageCssVar('--about-demo-canvas-fade', 'transparent')
    const demoLink = readPageCssVar('--about-demo-canvas-link', 'transparent')

    let width = 0
    let height = 0
    let rafId = 0
    let mouseX = 0
    let mouseY = 0

    const getWidth = () => width
    const getHeight = () => height

    let particles: DemoParticle[] = []

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mouseX = width / 2
      mouseY = height / 2
      const demoParticleCount = perfTier === 'high' ? 100 : 50
      particles = Array.from(
        { length: demoParticleCount },
        () => new DemoParticle(getWidth, getHeight)
      )
    }

    const handleMove = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect()
      mouseX = event.clientX - bounds.left
      mouseY = event.clientY - bounds.top
    }

    const animate = () => {
      ctx.fillStyle = demoFade
      ctx.fillRect(0, 0, width, height)
      const particlesLen = particles.length
      for (let i = 0; i < particlesLen; i += 1) {
        particles[i].update(mouseX, mouseY)
        particles[i].draw(ctx)
      }
      ctx.strokeStyle = demoLink
      ctx.lineWidth = 0.5
      for (let i = 0; i < particlesLen; i += 1) {
        for (let j = i + 1; j < particlesLen; j += 1) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          if (dx * dx + dy * dy < 6400) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      rafId = window.requestAnimationFrame(animate)
    }

    resize()
    animate()
    canvas.addEventListener('mousemove', handleMove)
    window.addEventListener('resize', resize)

    return () => {
      canvas.removeEventListener('mousemove', handleMove)
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(rafId)
    }
  }, [readPageCssVar, perfTier])

  // project & blog card mini-canvases
  useEffect(() => {
    if (perfTier === 'low') return undefined

    const cleanups: Array<() => void> = []
    const projectCanvasBg = readPageCssVar('--about-project-canvas-bg', 'black')
    const blogCanvasBg = readPageCssVar('--about-blog-canvas-bg', 'black')
    const projectCanvasLineSoft = readPageCssVar('--about-project-canvas-line-soft', 'transparent')
    const projectCanvasLine = readPageCssVar('--about-project-canvas-line', 'orange')
    const projectCanvasLineStrong = readPageCssVar('--about-project-canvas-line-strong', 'orange')
    const projectFluidColor = (index: number, alpha: number) =>
      composeHslAlphaColor({ hue: 20 + index * 3, saturation: 70, lightness: 50, alpha })
    const projectBloomColor = (index: number) =>
      composeHslAlphaColor({ hue: 30 + index * 5, saturation: 70, lightness: 50, alpha: 0.8 })
    const projectFractalColor = (index: number) =>
      composeHslAlphaColor({
        hue: 30 + index * 8,
        saturation: 70,
        lightness: 50,
        alpha: 0.8 - index * 0.1
      })
    const blogPulseColor = (index: number) =>
      composeHslAlphaColor({ hue: 25 + index * 2, saturation: 70, lightness: 55, alpha: 0.8 })
    const blogWaveColor = (index: number) =>
      composeHslAlphaColor({
        hue: 35 - index * 5,
        saturation: 70,
        lightness: 50,
        alpha: 0.5 - index * 0.1
      })

    const initCanvas = (
      canvas: HTMLCanvasElement | null,
      type: number,
      mode: 'project' | 'blog'
    ) => {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let width = 0
      let height = 0
      let rafId = 0
      const isMedium = perfTier === 'medium'
      let lastFrame = 0
      const minFrameInterval = isMedium ? 1000 / 24 : 0

      const resize = () => {
        const bounds = canvas.getBoundingClientRect()
        width = bounds.width
        height = bounds.height
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      const animate = () => {
        if (isMedium) {
          const now = performance.now()
          if (now - lastFrame < minFrameInterval) {
            rafId = window.requestAnimationFrame(animate)
            return
          }
          lastFrame = now
        }

        const now = Date.now() * (mode === 'project' ? 0.001 : 0.00075)
        ctx.fillStyle = mode === 'project' ? projectCanvasBg : blogCanvasBg
        ctx.fillRect(0, 0, width, height)

        if (mode === 'project' && type === 1) {
          const halfW = width / 2
          const halfH = height / 2
          for (let i = 0; i < 20; i += 1) {
            const x = halfW + Math.sin(now + i * 0.5) * 50
            const y = halfH + Math.cos(now * 0.7 + i * 0.5) * 30
            const radius = 20 + Math.sin(now + i) * 10
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
            gradient.addColorStop(0, projectFluidColor(i, 0.3))
            gradient.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.fill()
          }
        } else if (mode === 'project' && type === 2) {
          const halfW = width / 2
          const halfH = height / 2
          ctx.strokeStyle = projectCanvasLine
          for (let i = 0; i < 8; i += 1) {
            const angle = (i / 8) * Math.PI * 2 + now
            const length = 30 + Math.sin(now * 2 + i) * 20
            const x = halfW + Math.cos(angle) * length
            const y = halfH + Math.sin(angle) * length
            ctx.beginPath()
            ctx.moveTo(halfW, halfH)
            ctx.lineTo(x, y)
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.fillStyle = projectBloomColor(i)
            ctx.fill()
          }
        } else if (mode === 'project' && type === 3) {
          const halfH = height / 2
          ctx.strokeStyle = projectCanvasLineStrong
          for (let i = 0; i < 40; i += 1) {
            const x = (i / 40) * width
            const pulse = Math.sin(now * 3 + i * 0.3) * 30 + Math.sin(now * 5 + i * 0.5) * 20
            ctx.beginPath()
            ctx.moveTo(x, halfH - pulse)
            ctx.lineTo(x, halfH + pulse)
            ctx.lineWidth = 3
            ctx.stroke()
          }
        } else if (mode === 'project' && type === 4) {
          const halfW = width / 2
          const halfH = height / 2
          for (let i = 0; i < 6; i += 1) {
            const angle = now + (i / 6) * Math.PI * 2
            const radius = 40 + i * 10
            ctx.strokeStyle = projectFractalColor(i)
            ctx.lineWidth = 1
            ctx.beginPath()
            for (let j = 0; j <= 360; j += 10) {
              const a = (j / 180) * Math.PI
              const r = radius + Math.sin(a * 6 + now * 2) * 15
              const x = halfW + Math.cos(a + angle) * r
              const y = halfH + Math.sin(a + angle) * r
              if (j === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.stroke()
          }
        } else if (mode === 'blog' && type === 1) {
          const halfH = height / 2
          for (let i = 0; i < 30; i += 1) {
            const x = (i / 30) * width + Math.sin(now + i) * 10
            const y = halfH + Math.sin(now * 2 + i * 0.5) * 40
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fillStyle = blogPulseColor(i)
            ctx.fill()
          }
        } else if (mode === 'blog' && type === 2) {
          ctx.strokeStyle = projectCanvasLineSoft
          for (let i = 0; i < 10; i += 1) {
            for (let j = 0; j < 6; j += 1) {
              const x = i * 20 + 10
              const y = j * 20 + 10
              const size = 8 + Math.sin(now + i + j) * 4
              ctx.strokeRect(x - size / 2, y - size / 2, size, size)
            }
          }
        } else if (mode === 'blog' && type === 3) {
          for (let i = 0; i < 3; i += 1) {
            ctx.beginPath()
            ctx.strokeStyle = blogWaveColor(i)
            ctx.lineWidth = 2
            for (let x = 0; x <= width; x += 5) {
              const y = height / 2 + Math.sin(x * 0.05 + now + i) * (20 - i * 5)
              if (x === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.stroke()
          }
        }

        rafId = window.requestAnimationFrame(animate)
      }

      resize()
      animate()
      window.addEventListener('resize', resize)
      cleanups.push(() => {
        window.removeEventListener('resize', resize)
        window.cancelAnimationFrame(rafId)
      })
    }

    projectCanvasRefs.current.forEach((canvas, index) => initCanvas(canvas, index + 1, 'project'))
    blogCanvasRefs.current.forEach((canvas, index) => initCanvas(canvas, index + 1, 'blog'))

    return () => {
      cleanups.forEach(cleanup => cleanup())
    }
  }, [readPageCssVar, perfTier])

  // IntersectionObserver reveals
  useEffect(() => {
    const root = pageRef.current
    if (!root) return

    const reveals = root.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => {
        for (let i = 0; i < entries.length; i += 1) {
          const entry = entries[i]
          if (!entry.isIntersecting) continue
          entry.target.classList.add('active')
          const skillFills = entry.target.querySelectorAll<HTMLElement>('.skill-fill')
          for (let j = 0; j < skillFills.length; j += 1) {
            skillFills[j].style.width = `${skillFills[j].dataset.width || 0}%`
          }
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -12% 0px' }
    )

    reveals.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="aboutHtmlPage" ref={pageRef}>
      <div className="cursor-glow" ref={cursorGlowRef}></div>
      {perfTier === 'low' && LOW_TIER_GRADIENT_FALLBACK}
      <canvas id="bg-canvas" ref={bgCanvasRef}></canvas>

      <SectionNav
        className="about-nav fixed left-0 top-0 z-[100] flex w-full items-center justify-between px-16 py-6 max-md:px-8 max-md:py-4"
        homeButtonClassName="logo"
        linksClassName="nav-links hidden items-center gap-10 md:flex"
        linkButtonClassName="nav-links__button"
        homeTo="/"
        items={navItems}
      />

      <main className="relative z-10">
        <section
          id="about"
          className="flex min-h-screen flex-col justify-center px-[8vw] pb-0 pt-[100px] max-md:px-[5vw] max-md:py-20"
        >
          <div className="section-header reveal mb-16">
            <div className="section-tag ui-eyebrow">About</div>
            <h2 className="section-title section-title--hero ui-display-title">关于我</h2>
          </div>
          <div className="about-grid grid grid-cols-2 items-center gap-16 max-md:grid-cols-1">
            <div className="about-text reveal">
              <p className="ui-lead-text">
                数字与物理的边界正在消融，而我就在那里。从CS（计算机科学）出发，我游走在设计、艺术与代码的边缘。
              </p>
              <p className="ui-body-text">
                我不把代码仅仅看作工具，它本身就是一种创作材料。在逻辑与美感的碰撞中，我试图挖掘代码的可能性，去创造那些能让人停顿一下的交互体验。
              </p>
              <div className="about-stats mt-8 grid grid-cols-2 gap-8">
                <div className="stat-item rounded-lg p-6">
                  <div className="stat-number">{new Date().getFullYear() - 2020}+</div>
                  <div className="stat-label">年开发经验</div>
                </div>
                <div className="stat-item rounded-lg p-6">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">项目级组件开发</div>
                </div>
                <div className="stat-item rounded-lg p-6">
                  <div className="stat-number">2+</div>
                  <div className="stat-label">年团队管理经验</div>
                </div>
                <div className="stat-item rounded-lg p-6">
                  <div className="stat-number">∞</div>
                  <div className="stat-label">探索热情</div>
                </div>
              </div>
            </div>
            <div className="demo-canvas-container reveal relative aspect-square w-full overflow-hidden rounded-xl">
              <canvas id="demo-canvas" ref={demoCanvasRef} className="h-full w-full"></canvas>
              {perfTier !== 'low' ? (
                <div className="demo-hint ui-caption absolute bottom-4 left-1/2 -translate-x-1/2 rounded-[20px] px-4 py-2">
                  移动鼠标互动
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section
          id="skills"
          className="flex min-h-screen flex-col justify-center px-[8vw] pb-0 pt-[100px] max-md:px-[5vw] max-md:py-20"
        >
          <div className="section-header reveal mb-16">
            <div className="section-tag ui-eyebrow">Skills</div>
            <h2 className="section-title ui-section-title">专业技能</h2>
          </div>
          <div className="skills-grid grid grid-cols-3 gap-8 max-[1024px]:grid-cols-2 max-md:grid-cols-1">
            {SKILL_CATEGORIES.map(category => (
              <div key={category.title} className="skill-category reveal rounded-xl p-8">
                <h3 className="ui-card-title">{category.title}</h3>
                {category.items.map(item => (
                  <div key={item.name} className="skill-item mb-6 last:mb-0">
                    <div className="skill-header mb-2 flex items-center justify-between text-[0.9rem]">
                      <span className="skill-name">{item.name}</span>
                      <span className="skill-percent">{item.percent}%</span>
                    </div>
                    <div className="skill-bar h-1 overflow-hidden rounded-[2px]">
                      <div className="skill-fill" data-width={item.percent}></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section
          id="projects"
          className="flex min-h-screen flex-col justify-center px-[8vw] pb-0 pt-[100px] max-md:px-[5vw] max-md:py-20"
        >
          <div className="section-header reveal mb-16">
            <div className="section-tag ui-eyebrow">Projects</div>
            <h2 className="section-title ui-section-title">精选作品</h2>
          </div>
          <div className="projects-grid grid grid-cols-2 gap-8 max-md:grid-cols-1">
            {PROJECTS.map((project, index) => (
              <div key={project.title} className="reveal">
                <TiltCard
                  as="div"
                  className="project-card ui-card ui-card--media-split ui-card--interactive"
                  maxTilt={8}
                  scale={1.02}
                  lift={6}
                >
                  <div className="project-media ui-card__media relative h-[200px] w-full overflow-hidden">
                    <canvas
                      id={`project-canvas-${index + 1}`}
                      className="h-full w-full"
                      ref={node => {
                        projectCanvasRefs.current[index] = node
                      }}
                    ></canvas>
                    <div className="project-overlay"></div>
                  </div>
                  <div className="project-info ui-card__body gap-3">
                    <div className="project-tags mb-4 flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={`${project.title}-${tag}`}
                          className={`project-tag ui-tag ui-tag--sm ui-tag--soft ${getTagToneClass(tagIndex)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="project-title ui-card-title">{project.title}</h3>
                    <p className="project-desc ui-body-text">{project.desc}</p>
                    <div className="project-actions flex flex-wrap items-center gap-4">
                      <Button
                        type="link"
                        className="project-link ui-button-ghost ui-button-sm"
                        onClick={() => setActiveProject(project)}
                      >
                        查看详情 <ArrowRightOutlined />
                      </Button>
                      {project.experiencePath ? (
                        <Link
                          to={project.experiencePath as string}
                          className="project-link project-link--secondary ui-button-ghost ui-button-sm"
                        >
                          进入体验 <ArrowRightOutlined />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </section>

        <section
          id="blog"
          className="flex min-h-screen flex-col justify-center px-[8vw] pb-0 pt-[100px] max-md:px-[5vw] max-md:py-20"
        >
          <div className="section-header reveal mb-16">
            <div className="section-tag ui-eyebrow">Blog</div>
            <h2 className="section-title ui-section-title">最新文章</h2>
          </div>
          <div className="blog-grid grid grid-cols-3 gap-8 max-[1024px]:grid-cols-2 max-md:grid-cols-1">
            {BLOGS.map((blog, index) => (
              <div
                key={blog.title}
                className="blog-card ui-card ui-card--media-split ui-card--interactive reveal"
              >
                <div className="blog-media ui-card__media relative h-40 w-full overflow-hidden">
                  <canvas
                    id={`blog-canvas-${index + 1}`}
                    className="h-full w-full"
                    ref={node => {
                      blogCanvasRefs.current[index] = node
                    }}
                  ></canvas>
                  <span
                    className={`media-badge ui-tag ui-tag--badge ${getBlogBadgeTone(blog.badge)}`}
                  >
                    {blog.badge}
                  </span>
                </div>
                <div className="blog-content ui-card__body">
                  <div className="blog-date ui-meta-text">{blog.date}</div>
                  <h3 className="blog-title ui-card-title">{blog.title}</h3>
                  <p className="blog-excerpt ui-body-text">{blog.excerpt}</p>
                  <Link to={blog.path} className="project-link ui-button-ghost ui-button-sm">
                    进入博客 <ArrowRightOutlined />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="flex min-h-screen flex-col justify-center px-[8vw] pb-0 pt-[100px] text-center max-md:px-[5vw] max-md:py-20"
        >
          <div className="contact-content reveal mx-auto max-w-[600px]">
            <h2 className="contact-title ui-display-title">开始对话</h2>
            <p className="contact-desc ui-lead-text">
              无论是项目合作、技术探讨还是艺术交流，我都很期待与你建立连接。
            </p>
            <div className="contact-links mb-12 flex flex-wrap justify-center gap-8 max-md:gap-4">
              {CONTACT_LINKS.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="contact-link ui-button-ghost ui-button-icon ui-button-lg"
                  title={item.title}
                  target={item.href.startsWith('/test.pdf') ? '_blank' : undefined}
                  rel={item.href.startsWith('/test.pdf') ? 'noreferrer' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email ui-meta-text">
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>Crafted with passion at the intersection of code and art</p>
      </footer>

      <Modal
        open={!!activeProject}
        footer={null}
        onCancel={() => setActiveProject(null)}
        centered
        width={720}
        className="project-detail-modal"
        title={activeProject?.detailTitle || activeProject?.title}
      >
        {activeProject ? (
          <div className="project-detail">
            <p className="project-detail__summary ui-muted-text">{activeProject.detailSummary}</p>
            <div className="project-detail__meta mb-5 flex flex-wrap gap-3">
              {activeProject.tags.map((tag, tagIndex) => (
                <span
                  key={`${activeProject.title}-${tag}`}
                  className={`project-detail__tag ui-tag ui-tag--soft ${getTagToneClass(tagIndex)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="project-detail__section mb-5">
              <h4 className="ui-card-title">项目亮点</h4>
              <ul>
                {activeProject.highlights.map(item => (
                  <li key={`${activeProject.title}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="project-detail__section mb-5">
              <h4 className="ui-card-title">一句话说明</h4>
              <p className="ui-muted-text">{activeProject.desc}</p>
            </div>
            {activeProject.experiencePath ? (
              <div className="project-detail__footer mt-6 flex justify-end">
                <Link
                  to={activeProject.experiencePath as string}
                  className="project-detail__cta ui-button-primary ui-button-md"
                >
                  进入相关体验
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  )
})
