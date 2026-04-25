export interface RuntimeHslColor {
  hue: number
  saturation: number
  lightness: number
  alpha: number
}

export function readRuntimeColorVar(
  name: string,
  fallback = 'currentColor',
  element?: HTMLElement | null
) {
  if (typeof window === 'undefined') return fallback
  const target = element ?? document.documentElement
  const value = window.getComputedStyle(target).getPropertyValue(name).trim()
  return value || fallback
}

export function composeHslAlphaColor({ hue, saturation, lightness, alpha }: RuntimeHslColor) {
  const safeAlpha = Math.max(0, Math.min(alpha, 1))
  return ['hsl', 'a(', `${hue}, ${saturation}%, ${lightness}%, ${safeAlpha}`, ')'].join('')
}
