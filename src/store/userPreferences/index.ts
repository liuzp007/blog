import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemePreference = 'cyberpunk' | 'minimal' | 'vibrant' | 'dark' | 'light'
export type AnimationSpeedPreference = 'slow' | 'normal' | 'fast'
export type ParticleCountPreference = 'low' | 'medium' | 'high'
export type LanguagePreference = 'zh' | 'en'
export type FontSizePreference = 'small' | 'medium' | 'large'

export interface UserPreferencesState {
  theme: ThemePreference
  animationSpeed: AnimationSpeedPreference
  particleCount: ParticleCountPreference
  autoRotate: boolean
  postProcessing: boolean
  language: LanguagePreference
  soundEnabled: boolean
  reducedMotion: boolean
  highContrast: boolean
  fontSize: FontSizePreference
}

export const USER_PREFERENCE_THEME_DATASET: Record<ThemePreference, string> = {
  cyberpunk: 'cyberpunk',
  dark: 'dark',
  minimal: 'minimal',
  vibrant: 'vibrant',
  light: 'light'
}

export const PERSISTED_USER_PREFERENCE_KEYS: Array<keyof UserPreferencesState> = [
  'theme',
  'animationSpeed',
  'particleCount',
  'autoRotate',
  'postProcessing',
  'language',
  'soundEnabled',
  'reducedMotion',
  'highContrast',
  'fontSize'
]

export const initialUserPreferencesState: UserPreferencesState = {
  theme: 'cyberpunk',
  animationSpeed: 'normal',
  particleCount: 'high',
  autoRotate: true,
  postProcessing: true,
  language: 'zh',
  soundEnabled: true,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium'
}

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState: initialUserPreferencesState,
  reducers: {
    setTheme: (state, action: PayloadAction<UserPreferencesState['theme']>) => {
      state.theme = action.payload
    },
    setAnimationSpeed: (state, action: PayloadAction<UserPreferencesState['animationSpeed']>) => {
      state.animationSpeed = action.payload
    },
    setParticleCount: (state, action: PayloadAction<UserPreferencesState['particleCount']>) => {
      state.particleCount = action.payload
    },
    setAutoRotate: (state, action: PayloadAction<boolean>) => {
      state.autoRotate = action.payload
    },
    setPostProcessing: (state, action: PayloadAction<boolean>) => {
      state.postProcessing = action.payload
    },
    setLanguage: (state, action: PayloadAction<UserPreferencesState['language']>) => {
      state.language = action.payload
    },
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload
    },
    setHighContrast: (state, action: PayloadAction<boolean>) => {
      state.highContrast = action.payload
    },
    setFontSize: (state, action: PayloadAction<UserPreferencesState['fontSize']>) => {
      state.fontSize = action.payload
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferencesState>>) => {
      return { ...state, ...action.payload }
    },
    resetPreferences: _state => {
      return initialUserPreferencesState
    }
  }
})

export const userPreferencesReducer = userPreferencesSlice.reducer
export const {
  setTheme,
  setAnimationSpeed,
  setParticleCount,
  setAutoRotate,
  setPostProcessing,
  setLanguage,
  setSoundEnabled,
  setReducedMotion,
  setHighContrast,
  setFontSize,
  updatePreferences,
  resetPreferences
} = userPreferencesSlice.actions

// Default export for compatibility
export default userPreferencesReducer
