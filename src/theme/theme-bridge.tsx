import { useEffect } from 'react'
import { useAppSelector } from '@/store'
import { USER_PREFERENCE_THEME_DATASET } from '@/store/userPreferences'

export default function ThemeBridge(): null {
  const theme = useAppSelector(state => state.userPreferences.theme)
  const fontSize = useAppSelector(state => state.userPreferences.fontSize)
  const reducedMotion = useAppSelector(state => state.userPreferences.reducedMotion)
  const highContrast = useAppSelector(state => state.userPreferences.highContrast)

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
