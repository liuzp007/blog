import { useEffect, useRef } from 'react'

type RevealEffect = 'rotate3d' | 'diagonal' | 'fade-up'

interface UseScrollRevealOptions {
  effect?: RevealEffect
  threshold?: number
  rootMargin?: string
  staggerMs?: number
}

/**
 * useScrollReveal — IntersectionObserver 驱动的入场动画
 *
 * effect:
 *   'rotate3d'  — Z 轴 90° 旋转到 0°（卡片从垂直变平行）
 *   'diagonal'  — 从左下 translate(-40px, 40px) 滑入到原位
 *   'fade-up'   — 从下方 translateY(30px) 淡入
 *
 * staggerMs: 子元素之间的延迟（毫秒），默认 100
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const {
    effect = 'rotate3d',
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    staggerMs = 100
  } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = Array.from(container.children) as HTMLElement[]
    if (children.length === 0) return

    // 设置初始状态
    children.forEach(child => {
      child.style.transition = 'none'
      child.style.willChange = 'transform, opacity'

      switch (effect) {
        case 'rotate3d':
          child.style.transform = 'perspective(1000px) rotateX(90deg)'
          child.style.opacity = '0'
          break
        case 'diagonal':
          child.style.transform = 'translate(-40px, 40px)'
          child.style.opacity = '0'
          break
        case 'fade-up':
          child.style.transform = 'translateY(30px)'
          child.style.opacity = '0'
          break
      }
    })

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const idx = children.indexOf(el)
          const delay = idx * staggerMs

          setTimeout(() => {
            el.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease'
            el.style.transform = 'perspective(1000px) rotateX(0deg) translate(0, 0) translateY(0)'
            el.style.opacity = '1'
          }, delay)

          observer.unobserve(el)
        })
      },
      { threshold, rootMargin }
    )

    children.forEach(child => observer.observe(child))

    return () => observer.disconnect()
  }, [effect, threshold, rootMargin, staggerMs])

  return ref
}
