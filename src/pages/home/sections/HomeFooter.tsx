import { useCallback, useEffect, useRef, useState } from 'react'

/** 站点起始日期（占位） */
const SITE_START_DATE = new Date('2026-01-01T00:00:00')

/** 格式化运行时间 */
function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  if (days > 0) {
    return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`
  }
  if (hours > 0) {
    return `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`
  }
  return `${pad(minutes)}m ${pad(secs)}s`
}

export default function HomeFooter() {
  const [uptime, setUptime] = useState('')
  const rafRef = useRef(0)
  const lastTickRef = useRef(0)

  const tick = useCallback(() => {
    const now = Date.now()
    // 每秒更新一次
    if (now - lastTickRef.current < 1000) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    lastTickRef.current = now
    setUptime(formatUptime(now - SITE_START_DATE.getTime()))
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    // 立即显示一次
    setUptime(formatUptime(Date.now() - SITE_START_DATE.getTime()))
    lastTickRef.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tick])

  return (
    <footer
      className="relative overflow-hidden border-t border-white/5 pb-12 pt-20"
      style={{ background: '#0a0a0a' }}
    >
      {/* 品牌大字水印 — 装饰性背景层 */}
      <div
        className="pointer-events-none select-none text-center font-black uppercase tracking-[0.12em] text-white/[0.04] sm:text-7xl md:text-8xl lg:text-[10rem]"
        aria-hidden="true"
      >
        ZHOUYI
      </div>

      {/* 运行时间 + 浏览数 + 版权 */}
      <div className="relative mt-16 flex flex-col items-center gap-4 text-sm text-white/40">
        {/* 运行时间计数器 */}
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>
            本站已运行 <span className="font-mono text-white/60">{uptime}</span>
          </span>
        </div>

        {/* 浏览数（占位） */}
        <div>
          累计访问 <span className="font-mono text-white/60">12,345</span> 次
        </div>

        {/* 版权 */}
        <div className="text-white/25">
          &copy; {new Date().getFullYear()} <span className="text-amber-400/80">ZHOUYI</span>{' '}
          &middot; 以好奇心持续构建
        </div>
      </div>
    </footer>
  )
}
