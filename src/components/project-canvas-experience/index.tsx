import { useEffect, useRef, useCallback, memo } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined, HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { composeHslAlphaColor, readRuntimeColorVar } from '@/utils/color-runtime'

export type ProjectCanvasVariant = 'fluid' | 'garden' | 'audio' | 'fractal'

export interface ProjectCanvasExperienceProps {
  eyebrow: string
  title: string
  summary: string
  tags: string[]
  variant: ProjectCanvasVariant
  highlights: string[]
  concept: string
}

export default memo(function ProjectCanvasExperience({
  eyebrow,
  title,
  summary,
  tags,
  variant,
  highlights,
  concept
}: ProjectCanvasExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isVisibleRef = useRef(true)

  const scrollToCanvas = useCallback(() => {
    document
      .getElementById('project-canvas-stage')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rootElement = rootRef.current
    const canvasPalette = {
      bg: readRuntimeColorVar('--project-canvas-canvas-bg', 'black', rootElement),
      warmLine: readRuntimeColorVar(
        '--project-canvas-canvas-warm-line',
        'currentColor',
        rootElement
      ),
      warmLineStrong: readRuntimeColorVar(
        '--project-canvas-canvas-warm-line-strong',
        'currentColor',
        rootElement
      )
    }

    const fluidGlow = (index: number, alpha: number) =>
      composeHslAlphaColor({ hue: 20 + index * 3, saturation: 70, lightness: 50, alpha })

    const bloomDot = (index: number) =>
      composeHslAlphaColor({ hue: 30 + index * 5, saturation: 70, lightness: 50, alpha: 0.8 })

    const fractalStroke = (index: number) =>
      composeHslAlphaColor({
        hue: 30 + index * 8,
        saturation: 70,
        lightness: 50,
        alpha: 0.8 - index * 0.1
      })

    let width = 0
    let height = 0
    let rafId = 0

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = Math.max(bounds.width, 1)
      height = Math.max(bounds.height, 1)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawFluid = (now: number) => {
      for (let i = 0; i < 20; i += 1) {
        const x = width / 2 + Math.sin(now + i * 0.5) * 50
        const y = height / 2 + Math.cos(now * 0.7 + i * 0.5) * 30
        const radius = 20 + Math.sin(now + i) * 10
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, fluidGlow(i, 0.3))
        gradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    const drawGarden = (now: number) => {
      ctx.strokeStyle = canvasPalette.warmLine
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2 + now
        const length = 30 + Math.sin(now * 2 + i) * 20
        const x = width / 2 + Math.cos(angle) * length
        const y = height / 2 + Math.sin(angle) * length
        ctx.beginPath()
        ctx.moveTo(width / 2, height / 2)
        ctx.lineTo(x, y)
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = bloomDot(i)
        ctx.fill()
      }
    }

    const drawAudio = (now: number) => {
      ctx.strokeStyle = canvasPalette.warmLineStrong
      for (let i = 0; i < 40; i += 1) {
        const x = (i / 40) * width
        const pulse = Math.sin(now * 3 + i * 0.3) * 30 + Math.sin(now * 5 + i * 0.5) * 20
        ctx.beginPath()
        ctx.moveTo(x, height / 2 - pulse)
        ctx.lineTo(x, height / 2 + pulse)
        ctx.lineWidth = 3
        ctx.stroke()
      }
    }

    const drawFractal = (now: number) => {
      for (let i = 0; i < 6; i += 1) {
        const angle = now + (i / 6) * Math.PI * 2
        const radius = 40 + i * 10
        ctx.strokeStyle = fractalStroke(i)
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let j = 0; j <= 360; j += 10) {
          const a = (j / 180) * Math.PI
          const r = radius + Math.sin(a * 6 + now * 2) * 15
          const x = width / 2 + Math.cos(a + angle) * r
          const y = height / 2 + Math.sin(a + angle) * r
          if (j === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }
    }

    const animate = () => {
      // Skip drawing when not visible to save CPU/GPU
      if (isVisibleRef.current) {
        const now = Date.now() * 0.001
        ctx.fillStyle = canvasPalette.bg
        ctx.fillRect(0, 0, width, height)

        if (variant === 'fluid') drawFluid(now)
        else if (variant === 'garden') drawGarden(now)
        else if (variant === 'audio') drawAudio(now)
        else if (variant === 'fractal') drawFractal(now)
      }
      rafId = window.requestAnimationFrame(animate)
    }

    // Visibility observer: pause canvas when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(rafId)
    }
  }, [variant])

  return (
    <div
      ref={rootRef}
      className={`projectCanvasExperience projectCanvasExperience--${variant} min-h-screen bg-[var(--project-canvas-page-bg)] text-[var(--text-primary)] [font-family:Segoe_UI,PingFang_SC,Microsoft_YaHei,sans-serif] [&_*]:box-border`}
    >
      <header className="projectCanvasExperience__nav sticky top-0 z-20 flex items-center justify-between border-b border-b-[var(--project-canvas-nav-border)] bg-[var(--project-canvas-nav-bg)] px-6 py-[18px] [backdrop-filter:blur(10px)] max-[640px]:px-3 max-[640px]:py-[14px]">
        <Link
          to="/aboutme"
          className="projectCanvasExperience__nav-btn ui-button-ghost inline-flex h-auto items-center justify-center gap-[var(--space-2)] border-none bg-transparent p-0 text-[var(--project-canvas-nav-text)] no-underline"
        >
          <ArrowLeftOutlined aria-hidden="true" />
          返回关于页
        </Link>
        <Link
          to="/"
          className="projectCanvasExperience__nav-btn ui-button-ghost inline-flex h-auto items-center justify-center gap-[var(--space-2)] border-none bg-transparent p-0 text-[var(--project-canvas-nav-text)] no-underline"
        >
          <HomeOutlined aria-hidden="true" />
          首页
        </Link>
      </header>

      <main className="projectCanvasExperience__main mx-auto w-[min(1220px,calc(100%-40px))] py-10 pb-20 max-[640px]:w-[min(100%-24px,1220px)] max-[640px]:py-6 max-[640px]:pb-14">
        <section className="projectCanvasExperience__hero grid items-center gap-8 [grid-template-columns:minmax(320px,420px)_minmax(0,1fr)] max-[900px]:grid-cols-1">
          <div className="projectCanvasExperience__copy grid gap-[18px]">
            <span className="projectCanvasExperience__eyebrow inline-flex w-fit rounded-full bg-[var(--project-canvas-eyebrow-bg)] px-3 py-2 text-[12px] uppercase tracking-[0.18em] text-[var(--project-canvas-eyebrow-text)]">
              {eyebrow}
            </span>
            <h1 className="m-0 text-[clamp(40px,5vw,72px)] leading-[1.02] tracking-[-0.04em] text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="m-0 text-[16px] leading-[1.9] text-[var(--project-canvas-copy-text)] max-[640px]:text-[15px]">
              {summary}
            </p>
            <div className="projectCanvasExperience__tags flex flex-wrap gap-[10px]">
              {tags.map(tag => (
                <span
                  key={`${title}-${tag}`}
                  className="inline-flex items-center rounded-full bg-[var(--project-canvas-tag-bg)] px-3 py-2 text-[13px] text-[var(--project-canvas-tag-text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="projectCanvasExperience__actions flex flex-wrap gap-3">
              <Link
                to="/aboutme#projects"
                className="projectCanvasExperience__primary ui-button-primary inline-flex h-11 items-center justify-center gap-[var(--space-2)] rounded-full border-none px-[18px] no-underline"
              >
                返回作品区
              </Link>
              <Button
                className="projectCanvasExperience__ghost inline-flex h-11 items-center justify-center gap-[var(--space-2)] rounded-full border-none bg-[var(--project-canvas-ghost-bg)] px-[18px] text-[var(--project-canvas-ghost-text)] shadow-[var(--project-canvas-ghost-ring)]"
                icon={<ArrowRightOutlined />}
                onClick={scrollToCanvas}
              >
                跳到画面
              </Button>
            </div>
          </div>

          <div
            className="projectCanvasExperience__panel relative min-h-[560px] overflow-hidden rounded-[28px] border border-[var(--project-canvas-panel-border)] bg-[var(--project-canvas-panel-bg)] shadow-[var(--project-canvas-panel-shadow)] max-[900px]:min-h-[420px] max-[640px]:min-h-[320px]"
            id="project-canvas-stage"
          >
            <canvas
              ref={canvasRef}
              className="projectCanvasExperience__canvas block min-h-[560px] h-full w-full max-[900px]:min-h-[420px] max-[640px]:min-h-[320px]"
            />
            <div className="projectCanvasExperience__hint absolute bottom-6 left-6 rounded-full bg-[var(--project-canvas-hint-bg)] px-[14px] py-[10px] text-[12px] text-[var(--project-canvas-hint-text)] max-[640px]:inset-x-3 max-[640px]:bottom-3 max-[640px]:left-auto max-[640px]:rounded-2xl">
              这是该作品的独立展示页，画面会持续自动演化。
            </div>
          </div>
        </section>

        <section className="projectCanvasExperience__content mt-8 grid gap-5 [grid-template-columns:repeat(2,minmax(0,1fr))] max-[900px]:grid-cols-1">
          <article className="projectCanvasExperience__card rounded-[24px] border border-[var(--project-canvas-card-border)] bg-[var(--project-canvas-card-bg)] p-[26px]">
            <h2 className="mb-3 mt-0 text-[22px] text-[var(--text-primary)]">作品概念</h2>
            <p className="m-0 leading-[1.9] text-[var(--project-canvas-copy-text)]">{concept}</p>
          </article>
          <article className="projectCanvasExperience__card rounded-[24px] border border-[var(--project-canvas-card-border)] bg-[var(--project-canvas-card-bg)] p-[26px]">
            <h2 className="mb-3 mt-0 text-[22px] text-[var(--text-primary)]">画面亮点</h2>
            <ul className="m-0 pl-[18px] leading-[1.9] text-[var(--project-canvas-copy-text)]">
              {highlights.map(item => (
                <li key={`${title}-${item}`}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  )
})
