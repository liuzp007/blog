export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function readCssVar(element: HTMLElement | null, name: string, fallback = 'currentColor') {
  if (typeof window === 'undefined') return fallback
  const target = element ?? document.documentElement
  const value = window.getComputedStyle(target).getPropertyValue(name).trim()
  return value || fallback
}

export function withOpacity(color: string, opacity: number) {
  if (!color.startsWith('#')) return color
  const alpha = Math.round(clamp(opacity, 0, 1) * 255)
    .toString(16)
    .padStart(2, '0')
  return `${color}${alpha}`
}
