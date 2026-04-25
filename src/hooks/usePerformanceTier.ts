import { useMemo } from 'react'

export type PerformanceTier = 'low' | 'medium' | 'high'

export function usePerformanceTier(): PerformanceTier {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'low'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low'

    const cores = navigator.hardwareConcurrency ?? 2
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4
    const score = cores * 2 + memory

    if (score >= 14 && window.innerWidth > 1200) return 'high'
    if (score >= 6) return 'medium'
    return 'low'
  }, [])
}
