import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import type { UseScrollOptions } from 'framer-motion'

type ScrollEffect = 'rotate3d' | 'diagonal'
type ScrollOffsetPoint = NonNullable<UseScrollOptions['offset']>[number]

interface UseScrollDrivenAnimationOptions {
  effect: ScrollEffect
  triggerRef?: React.RefObject<HTMLElement | null>
  start?: ScrollOffsetPoint
  end?: ScrollOffsetPoint
}

export function useScrollDrivenAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollDrivenAnimationOptions
) {
  const { effect, triggerRef, start = 'start end', end = 'start center' } = options
  const ref = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()
  const targetRef = triggerRef ?? ref
  const offset: UseScrollOptions['offset'] = [start, end]
  const { scrollYProgress } = useScroll({ target: targetRef, offset })

  const applyProgress = (progress: number) => {
    const element = ref.current
    if (!element) return

    if (effect === 'rotate3d') {
      element.style.transformOrigin = 'bottom center'
      element.style.backfaceVisibility = 'hidden'
      element.style.transform = `rotateX(${(1 - progress) * 90}deg)`
      element.style.filter = `brightness(${0.5 + progress * 0.5})`
    } else {
      element.style.transform = `translate3d(${-5 * (1 - progress)}%, ${5 * (1 - progress)}%, 0)`
      element.style.filter = ''
    }

    element.style.opacity = String(progress)
  }

  useEffect(() => {
    const element = ref.current
    const parent = element?.parentElement
    if (!element || prefersReducedMotion) return

    if (effect === 'rotate3d' && parent) parent.style.perspective = '1000px'
    applyProgress(scrollYProgress.get())

    return () => {
      if (parent) parent.style.perspective = ''
      element.style.transform = ''
      element.style.transformOrigin = ''
      element.style.backfaceVisibility = ''
      element.style.filter = ''
      element.style.opacity = ''
    }
  }, [effect, prefersReducedMotion, scrollYProgress])

  useMotionValueEvent(scrollYProgress, 'change', progress => {
    if (!prefersReducedMotion) applyProgress(progress)
  })

  return ref
}
