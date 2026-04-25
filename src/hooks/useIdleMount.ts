import { useState, useEffect } from 'react'

interface IdleWindow {
  requestIdleCallback: (fn: () => void, opts: { timeout: number }) => number
  cancelIdleCallback: (id: number) => void
}

export function useIdleMount(delayMs = 200): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const cb = () => setReady(true)

    if ('requestIdleCallback' in window) {
      const win = window as unknown as IdleWindow
      const id = win.requestIdleCallback(() => setTimeout(cb, delayMs), { timeout: 3000 })
      return () => win.cancelIdleCallback(id)
    }

    const id = setTimeout(cb, delayMs + 200)
    return () => clearTimeout(id)
  }, [delayMs])

  return ready
}
