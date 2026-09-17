import { useEffect } from 'react'
import useUserPreferences, { USER_PREFERENCE_THEME_DATASET } from '@/hooks/useUserPreferences'

export default function ThemeBridge(): null {
  const { theme, fontSize, reducedMotion, highContrast } = useUserPreferences()

  useEffect(() => {
    const root = document.documentElement
    const resolvedTheme =
      USER_PREFERENCE_THEME_DATASET[theme] ?? USER_PREFERENCE_THEME_DATASET.cyberpunk

    root.dataset.theme = resolvedTheme
    root.dataset.fontSize = fontSize
    root.dataset.reducedMotion = String(reducedMotion)
    root.dataset.highContrast = String(highContrast)
    root.style.colorScheme = resolvedTheme === 'light' ? 'light' : 'dark'
  }, [fontSize, highContrast, reducedMotion, theme])

  return null
}
