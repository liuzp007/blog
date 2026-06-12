import { useCallback } from 'react'

const MARQUEE_TAGS = [
  '体系化架构',
  '可演进设计',
  '稳定优先',
  '数据驱动',
  '克制的产品力',
  '体验与效率',
  '长期主义'
]

interface HeroSectionProps {
  onScrollDown?: () => void
}

export default function HeroSection({ onScrollDown }: HeroSectionProps) {
  const handleScrollDown = useCallback(() => {
    if (onScrollDown) {
      onScrollDown()
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }, [onScrollDown])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6">
      {/* Avatar */}
      <div className="mb-8">
        <img
          src="https://picsum.photos/200"
          alt="Avatar"
          className="h-32 w-32 rounded-full border-2 border-white/10 bg-zinc-800/80 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)] ring-2 ring-white/5 ring-offset-2 ring-offset-[#0a0a0a]"
        />
      </div>

      {/* Title */}
      <h1
        className="animate-blur-reveal text-4xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl md:tracking-[-3.15px]"
        style={{ animationDelay: '0.2s' }}
      >
        ZHOUYI
      </h1>

      {/* Subtitle */}
      <p
        className="animate-blur-reveal mt-4 text-base tracking-wide text-zinc-500 sm:text-lg"
        style={{ animationDelay: '0.5s' }}
      >
        全栈开发 · 博客与项目笔记
      </p>

      {/* Scroll hint button */}
      <button
        className="mt-10 rounded-full border border-zinc-500/50 bg-transparent px-6 py-3 text-sm text-zinc-400 transition-all hover:border-zinc-400 hover:text-white"
        onClick={handleScrollDown}
        type="button"
      >
        继续往下看 ↓
      </button>

      {/* Marquee tags */}
      <div className="pointer-events-none absolute bottom-8 left-0 w-full overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap [--duration:40s] [--gap:2rem]">
          {[...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => (
            <span key={`${tag}-${i}`} className="mx-4 text-2xl font-bold text-white/20 md:text-4xl">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
