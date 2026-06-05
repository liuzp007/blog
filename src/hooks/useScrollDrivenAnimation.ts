import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ScrollEffect = 'rotate3d' | 'diagonal'

interface UseScrollDrivenAnimationOptions {
  effect: ScrollEffect
  /** 触发元素，默认为动画元素自身 */
  triggerRef?: React.RefObject<HTMLElement | null>
  start?: string
  end?: string
}

export function useScrollDrivenAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollDrivenAnimationOptions
) {
  const { effect, triggerRef, start = 'top 100%', end = 'top 35%' } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const parent = el.parentElement
    const triggerEl = triggerRef?.current || el

    let setup: (() => void) | undefined
    let cleanup: (() => void) | undefined

    switch (effect) {
      case 'rotate3d':
        setup = () => {
          el.style.transformOrigin = 'bottom center'
          el.style.backfaceVisibility = 'hidden'
          if (parent) parent.style.perspective = '1000px'
        }
        cleanup = () => {
          if (parent) parent.style.perspective = ''
        }
        gsap.set(el, { rotateX: 90, opacity: 0, filter: 'brightness(0.5)' })
        gsap.to(el, {
          rotateX: 0,
          opacity: 1,
          filter: 'brightness(1)',
          ease: 'none',
          scrollTrigger: { trigger: triggerEl, start, end, scrub: true }
        })
        break

      case 'diagonal':
        gsap.set(el, { xPercent: -5, yPercent: 5, opacity: 0 })
        gsap.to(el, {
          xPercent: 0,
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: triggerEl, start, end, scrub: true }
        })
        break
    }

    setup?.()

    return () => {
      cleanup?.()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === triggerEl) st.kill()
      })
    }
  }, [effect, triggerRef, start, end])

  return ref
}
