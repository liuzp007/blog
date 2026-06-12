import { useEffect, useState } from 'react'

/**
 * useScrollState — 监听页面滚动状态
 *
 * - 滚动时给 document.documentElement 添加 `is-scrolling` class
 * - 停止滚动 800ms 后移除该 class
 * - 返回 isScrolling boolean state
 * - 内置 throttle 避免过于频繁触发
 */
export function useScrollState(): boolean {
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      // 使用 rAF 做 throttle
      requestAnimationFrame(() => {
        ticking = false

        if (!isScrolling) {
          setIsScrolling(true)
        }

        // 清除上一次的定时器，重新计时
        if (timerId !== null) {
          clearTimeout(timerId)
        }

        timerId = setTimeout(() => {
          setIsScrolling(false)
        }, 800)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timerId !== null) {
        clearTimeout(timerId)
      }
    }
  }, [isScrolling])

  // 同步 class 到 document.documentElement（html 元素）
  useEffect(() => {
    const html = document.documentElement

    if (isScrolling) {
      html.classList.add('is-scrolling')
    } else {
      html.classList.remove('is-scrolling')
    }
  }, [isScrolling])

  return isScrolling
}
