import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import useUserPreferences from '@/hooks/useUserPreferences'

const STORAGE_KEY = 'persist:blog-user-preferences'

describe('useUserPreferences', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('应返回默认偏好', () => {
    const { result } = renderHook(() => useUserPreferences())

    expect(result.current).toEqual({
      theme: 'cyberpunk',
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false
    })
  })

  it('应兼容读取 redux-persist 旧数据', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: 'light',
        fontSize: 'large',
        reducedMotion: true,
        highContrast: true,
        _persist: { version: -1, rehydrated: true }
      })
    )

    const { result } = renderHook(() => useUserPreferences())

    expect(result.current).toEqual({
      theme: 'light',
      fontSize: 'large',
      reducedMotion: true,
      highContrast: true
    })
  })

  it('非法存储数据应回退到默认值', () => {
    window.localStorage.setItem(STORAGE_KEY, '{invalid-json')

    const { result } = renderHook(() => useUserPreferences())

    expect(result.current.theme).toBe('cyberpunk')
    expect(result.current.fontSize).toBe('medium')
  })

  it('应响应其他标签页更新偏好', () => {
    const { result } = renderHook(() => useUserPreferences())

    act(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: 'light' }))
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify({ theme: 'light' })
        })
      )
    })

    expect(result.current.theme).toBe('light')
  })
})
