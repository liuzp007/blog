import { useEffect, useState } from 'react'

export type ThemePreference = 'cyberpunk' | 'minimal' | 'vibrant' | 'dark' | 'light'
export type FontSizePreference = 'small' | 'medium' | 'large'

export interface UserPreferences {
  theme: ThemePreference
  fontSize: FontSizePreference
  reducedMotion: boolean
  highContrast: boolean
}

type StoredUserPreferences = Omit<UserPreferences, 'reducedMotion'> & {
  reducedMotion?: boolean
}

export const USER_PREFERENCE_THEME_DATASET: Record<ThemePreference, string> = {
  cyberpunk: 'cyberpunk',
  dark: 'dark',
  minimal: 'minimal',
  vibrant: 'vibrant',
  light: 'light'
}

const PREFERENCES_STORAGE_KEY = 'persist:blog-user-preferences'
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'cyberpunk',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false
}

function readSystemReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && value in USER_PREFERENCE_THEME_DATASET
}

function isFontSizePreference(value: unknown): value is FontSizePreference {
  return value === 'small' || value === 'medium' || value === 'large'
}

function readStoredPreferences(): StoredUserPreferences {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES

  try {
    const rawValue = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (!rawValue) return { ...DEFAULT_USER_PREFERENCES, reducedMotion: undefined }

    const storedValue = JSON.parse(rawValue) as Partial<Record<keyof UserPreferences, unknown>>
    return {
      theme: isThemePreference(storedValue.theme) ? storedValue.theme : 'cyberpunk',
      fontSize: isFontSizePreference(storedValue.fontSize) ? storedValue.fontSize : 'medium',
      reducedMotion:
        typeof storedValue.reducedMotion === 'boolean' ? storedValue.reducedMotion : undefined,
      highContrast: typeof storedValue.highContrast === 'boolean' ? storedValue.highContrast : false
    }
  } catch {
    return { ...DEFAULT_USER_PREFERENCES, reducedMotion: undefined }
  }
}

export default function useUserPreferences(): UserPreferences {
  const [storedPreferences, setStoredPreferences] = useState(readStoredPreferences)
  const [systemReducedMotion, setSystemReducedMotion] = useState(readSystemReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setSystemReducedMotion(media.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PREFERENCES_STORAGE_KEY) setStoredPreferences(readStoredPreferences())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    ...storedPreferences,
    reducedMotion: storedPreferences.reducedMotion ?? systemReducedMotion
  }
}
