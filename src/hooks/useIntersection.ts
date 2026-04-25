import { useEffect, useRef, useState } from 'react'

const DEFAULT_OPTS: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 0.1 }

export function useIntersection<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  const optionsRef = useRef(options)

  // 每次渲染同步 ref，无额外开销
  if (options) optionsRef.current = options

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        const e = entries[0]
        if (e && e.isIntersecting) setVisible(true)
      },
      { ...DEFAULT_OPTS, ...(optionsRef.current || {}) }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, visible } as const
}
