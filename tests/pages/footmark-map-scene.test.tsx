import { render, waitFor } from '@testing-library/react'
import { load as AMapLoad } from '@amap/amap-jsapi-loader'
import { describe, expect, it, vi } from 'vitest'
import FootmarkMapScene from '@/pages/footmark/components/FootmarkMapScene'

const mapInstances: Array<{ constructorOptions: Record<string, unknown> }> = []

vi.mock('@amap/amap-jsapi-loader', () => ({
  load: vi.fn()
}))

const createMapApi = () => ({
  Map: vi.fn(function Map(_, options) {
    const instance = {
      add: vi.fn(),
      destroy: vi.fn(),
      setFitView: vi.fn(),
      setLimitBounds: vi.fn(),
      setZoomAndCenter: vi.fn()
    }

    mapInstances.push({ constructorOptions: options })
    return instance
  }),
  Marker: vi.fn(function Marker() {
    return { setMap: vi.fn(), setContent: vi.fn() }
  }),
  Pixel: vi.fn(function Pixel() {
    return {}
  }),
  Polyline: vi.fn(function Polyline() {
    return { setMap: vi.fn() }
  })
})

describe('FootmarkMapScene', () => {
  it('应禁用地图缩放交互', async () => {
    vi.stubEnv('VITE_AMAP_KEY', 'test-key')
    vi.mocked(AMapLoad).mockResolvedValue(createMapApi() as never)

    render(<FootmarkMapScene progress={0.4} active quality="desktop" />)

    await waitFor(() => {
      expect(mapInstances).toHaveLength(1)
    })

    expect(mapInstances[0].constructorOptions.zoomEnable).toBe(false)
    expect(mapInstances[0].constructorOptions.scrollWheel).toBe(false)
    expect(mapInstances[0].constructorOptions.doubleClickZoom).toBe(false)
    expect(mapInstances[0].constructorOptions.touchZoom).toBe(false)
    expect(mapInstances[0].constructorOptions.keyboardEnable).toBe(false)
  })
})
