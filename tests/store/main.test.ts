import { describe, it, expect } from 'vitest'
import mainReducer, {
  setMenu,
  setSelectedKeys,
  setOpenKeys,
  setLoading,
  setError,
  clearError
} from '@/store/main/reducer'

// Mock MenuItem type
interface MenuItem {
  key: string
  name: string
  path: string
}

describe('Main Reducer 测试', () => {
  const initialState = {
    menu: [],
    selectedKeys: [],
    openKeys: [],
    loading: false,
    error: null
  }

  it('应该返回初始状态', () => {
    expect(mainReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('setMenu action', () => {
    it('应该设置菜单', () => {
      const mockMenu: MenuItem[] = [
        { key: '1', name: '首页', path: '/' },
        { key: '2', name: '博客', path: '/blog' }
      ]

      const action = setMenu(mockMenu)
      const state = mainReducer(initialState, action)

      expect(state.menu).toEqual(mockMenu)
      expect(state.menu.length).toBe(2)
    })

    it('应该清空菜单', () => {
      const stateWithMenu = {
        ...initialState,
        menu: [{ key: '1', name: 'Test', path: '/test' }] as MenuItem[]
      }
      const action = setMenu([])
      const state = mainReducer(stateWithMenu, action)

      expect(state.menu).toEqual([])
    })
  })

  describe('setSelectedKeys action', () => {
    it('应该设置选中的键', () => {
      const action = setSelectedKeys(['1', '2'])
      const state = mainReducer(initialState, action)

      expect(state.selectedKeys).toEqual(['1', '2'])
    })

    it('应该清空选中的键', () => {
      const stateWithKeys = { ...initialState, selectedKeys: ['1', '2', '3'] }
      const action = setSelectedKeys([])
      const state = mainReducer(stateWithKeys, action)

      expect(state.selectedKeys).toEqual([])
    })

    it('应该设置单个选中键', () => {
      const action = setSelectedKeys(['blog'])
      const state = mainReducer(initialState, action)

      expect(state.selectedKeys).toEqual(['blog'])
    })
  })

  describe('setOpenKeys action', () => {
    it('应该设置打开的键', () => {
      const action = setOpenKeys(['sub1', 'sub2'])
      const state = mainReducer(initialState, action)

      expect(state.openKeys).toEqual(['sub1', 'sub2'])
    })

    it('应该清空打开的键', () => {
      const stateWithOpenKeys = { ...initialState, openKeys: ['sub1', 'sub2', 'sub3'] }
      const action = setOpenKeys([])
      const state = mainReducer(stateWithOpenKeys, action)

      expect(state.openKeys).toEqual([])
    })
  })

  describe('setLoading action', () => {
    it('应该设置loading为true', () => {
      const action = setLoading(true)
      const state = mainReducer(initialState, action)

      expect(state.loading).toBe(true)
    })

    it('应该设置loading为false', () => {
      const stateWithLoading = { ...initialState, loading: true }
      const action = setLoading(false)
      const state = mainReducer(stateWithLoading, action)

      expect(state.loading).toBe(false)
    })
  })

  describe('setError action', () => {
    it('应该设置错误信息', () => {
      const action = setError('网络错误')
      const state = mainReducer(initialState, action)

      expect(state.error).toBe('网络错误')
      expect(state.loading).toBe(false)
    })

    it('应该清空错误信息（设置为null）', () => {
      const stateWithError = { ...initialState, error: '之前错误', loading: true }
      const action = setError(null)
      const state = mainReducer(stateWithError, action)

      expect(state.error).toBe(null)
      expect(state.loading).toBe(false)
    })

    it('应该保持其他状态不变', () => {
      const stateWithData = {
        ...initialState,
        menu: [{ key: '1', name: 'Test', path: '/test' }] as MenuItem[],
        selectedKeys: ['1'],
        openKeys: ['sub1']
      }
      const action = setError('新错误')
      const state = mainReducer(stateWithData, action)

      expect(state.menu).toEqual(stateWithData.menu)
      expect(state.selectedKeys).toEqual(stateWithData.selectedKeys)
      expect(state.openKeys).toEqual(stateWithData.openKeys)
      expect(state.error).toBe('新错误')
    })
  })

  describe('clearError action', () => {
    it('应该清空错误信息', () => {
      const stateWithError = { ...initialState, error: '测试错误' }
      const action = clearError()
      const state = mainReducer(stateWithError, action)

      expect(state.error).toBe(null)
    })

    it('应该保持其他状态不变', () => {
      const stateWithData = {
        ...initialState,
        menu: [{ key: '1', name: 'Test', path: '/test' }] as MenuItem[],
        selectedKeys: ['1'],
        openKeys: ['sub1'],
        error: '测试错误'
      }
      const action = clearError()
      const state = mainReducer(stateWithData, action)

      expect(state.menu).toEqual(stateWithData.menu)
      expect(state.selectedKeys).toEqual(stateWithData.selectedKeys)
      expect(state.openKeys).toEqual(stateWithData.openKeys)
      expect(state.error).toBe(null)
    })
  })

  describe('边界条件测试', () => {
    it('应该处理空菜单数组', () => {
      const action = setMenu([])
      const state = mainReducer(initialState, action)

      expect(state.menu).toEqual([])
      expect(Array.isArray(state.menu)).toBe(true)
    })

    it('应该处理空字符串错误', () => {
      const action = setError('')
      const state = mainReducer(initialState, action)

      expect(state.error).toBe('')
    })

    it('应该处理重复的键设置', () => {
      const action = setSelectedKeys(['1', '1', '2', '2'])
      const state = mainReducer(initialState, action)

      expect(state.selectedKeys).toEqual(['1', '1', '2', '2'])
    })

    it('应该处理大量菜单项', () => {
      const largeMenu = Array.from({ length: 100 }, (_, i) => ({
        key: `item-${i}`,
        name: `Item ${i}`,
        path: `/path-${i}`
      })) as MenuItem[]

      const action = setMenu(largeMenu)
      const state = mainReducer(initialState, action)

      expect(state.menu.length).toBe(100)
      expect(state.menu[99].key).toBe('item-99')
    })
  })
})
