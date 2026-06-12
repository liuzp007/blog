import { useCallback, useEffect, useState } from 'react'

/**
 * ScrollProgress — 右下角滚动进度环
 *
 * - 45px 圆形毛玻璃按钮
 * - SVG 进度环显示滚动百分比
 * - 点击平滑回到顶部
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const pct = docHeight > 0 ? Math.min(Math.round((scrollTop / docHeight) * 100), 100) : 0
    setProgress(pct)
    setVisible(scrollTop > 200)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [updateProgress])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // SVG 环参数
  const radius = 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <button
      onClick={scrollToTop}
      aria-label="回到顶部"
      className={`group fixed bottom-6 right-6 z-[999] flex cursor-pointer items-center justify-center rounded-full bg-neutral-900/90 text-neutral-200 shadow-lg backdrop-blur-lg transition-opacity hover:opacity-90 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ width: 45, height: 45 }}
    >
      <div className="relative flex items-center justify-center" style={{ width: 39, height: 39 }}>
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* 底层灰色圆 */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke="rgba(107, 114, 128, 0.4)"
            strokeWidth="2"
          />
          {/* 进度圆 */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.15s ease' }}
          />
        </svg>
        {/* 百分比文字 */}
        <span className="text-[10px] font-medium tabular-nums text-neutral-200 transition-opacity duration-200 group-hover:opacity-0">
          {progress}%
        </span>
        {/* hover 时显示箭头 */}
        <svg
          className="absolute inset-0 m-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </div>
    </button>
  )
}
