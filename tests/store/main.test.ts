import { describe, expect, it } from 'vitest'
import mainReducer, { setMenu, setOpenKeys, setSelectedKeys } from '@/store/main/reducer'

describe('Main Reducer 测试', () => {
  const initialState = {
    menu: [],
    selectedKeys: [],
    openKeys: []
  }

  it('应该返回初始状态', () => {
    expect(mainReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('应该设置菜单', () => {
    const menu = [
      { key: 'home', name: '首页', path: '/' },
      { key: 'blog', name: '博客', path: '/blog' }
    ]

    expect(mainReducer(initialState, setMenu(menu)).menu).toEqual(menu)
  })

  it('应该清空菜单', () => {
    const state = mainReducer(
      { ...initialState, menu: [{ key: 'home', name: '首页', path: '/' }] },
      setMenu([])
    )
    expect(state.menu).toEqual([])
  })

  it('应该设置选中键', () => {
    expect(mainReducer(initialState, setSelectedKeys(['blog'])).selectedKeys).toEqual(['blog'])
  })

  it('应该清空选中键', () => {
    const state = mainReducer({ ...initialState, selectedKeys: ['blog'] }, setSelectedKeys([]))
    expect(state.selectedKeys).toEqual([])
  })

  it('应该设置展开键', () => {
    expect(mainReducer(initialState, setOpenKeys(['main'])).openKeys).toEqual(['main'])
  })

  it('应该清空展开键', () => {
    const state = mainReducer({ ...initialState, openKeys: ['main'] }, setOpenKeys([]))
    expect(state.openKeys).toEqual([])
  })
})
