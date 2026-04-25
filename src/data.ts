export type MainPageId = string

export interface MenuItem {
  name: string
  path: string
  pageId?: MainPageId
  comparison?: ComparisonItem[]
  children?: ChildrenItem[]
  icon?: React.ReactNode
  type?: 'folder' | 'file' | 'app' | 'settings'
  badge?: number
  disabled?: boolean
  hidden?: boolean
  group?: string
  exact?: boolean
}

export interface ComparisonItem {
  name: string
  path: string
  pageId?: MainPageId
  list?: ListItem[]
  disabled?: boolean
  hidden?: boolean
  exact?: boolean
}

export interface ChildrenItem {
  name: string
  path: string
  pageId?: MainPageId
  icon?: React.ReactNode
  disabled?: boolean
  badge?: number
  hidden?: boolean
  exact?: boolean
}

export interface ListItem {
  name: string
  path: string
  pageId: MainPageId
  disabled?: boolean
  hidden?: boolean
  exact?: boolean
}

export interface MainRouteEntry {
  name: string
  path: string
  pageId: MainPageId
  exact?: boolean
}

export interface MainMenuState {
  selectedKeys: string[]
  openKeys: string[]
}

function normalizeRouteFragment(path: string) {
  if (!path.startsWith('/')) {
    return `/${path}`
  }

  return path
}

function registerRouteEntry(
  entries: MainRouteEntry[],
  seenPaths: Set<string>,
  source: {
    name: string
    path: string
    pageId?: MainPageId
    exact?: boolean
    disabled?: boolean
    hidden?: boolean
  },
  sourceLabel: string
) {
  if (source.disabled || source.hidden || !source.pageId) {
    return
  }

  const path = normalizeRouteFragment(source.path)

  if (seenPaths.has(path)) {
    throw new Error(`[menu-route] duplicated route fragment "${path}" from ${sourceLabel}`)
  }

  seenPaths.add(path)
  entries.push({
    name: source.name,
    path,
    pageId: source.pageId,
    exact: source.exact
  })
}

export function getMainRouteEntries(menu: MenuItem[] = Menu): MainRouteEntry[] {
  const entries: MainRouteEntry[] = []
  const seenPaths = new Set<string>()

  menu.forEach(item => {
    registerRouteEntry(entries, seenPaths, item, `menu item "${item.name}"`)

    item.children?.forEach(child => {
      registerRouteEntry(entries, seenPaths, child, `child item "${item.name} > ${child.name}"`)
    })

    item.comparison?.forEach(comparison => {
      registerRouteEntry(
        entries,
        seenPaths,
        comparison,
        `group item "${item.name} > ${comparison.name}"`
      )

      comparison.list?.forEach(listItem => {
        registerRouteEntry(
          entries,
          seenPaths,
          listItem,
          `list item "${item.name} > ${comparison.name} > ${listItem.name}"`
        )
      })
    })
  })

  return entries
}

export function getMainMenuState(menu: MenuItem[] = Menu, targetPath: string): MainMenuState {
  const normalizedTargetPath = normalizeRouteFragment(targetPath)

  for (const item of menu) {
    if (
      !item.disabled &&
      !item.hidden &&
      item.pageId &&
      normalizeRouteFragment(item.path) === normalizedTargetPath
    ) {
      return {
        selectedKeys: [normalizedTargetPath],
        openKeys: []
      }
    }

    for (const child of item.children ?? []) {
      if (
        !child.disabled &&
        !child.hidden &&
        normalizeRouteFragment(child.path) === normalizedTargetPath
      ) {
        return {
          selectedKeys: [normalizedTargetPath],
          openKeys: [normalizeRouteFragment(item.path)]
        }
      }
    }

    for (const comparison of item.comparison ?? []) {
      if (
        !comparison.disabled &&
        !comparison.hidden &&
        comparison.pageId &&
        normalizeRouteFragment(comparison.path) === normalizedTargetPath
      ) {
        return {
          selectedKeys: [normalizedTargetPath],
          openKeys: [normalizeRouteFragment(item.path)]
        }
      }

      for (const listItem of comparison.list ?? []) {
        if (
          !listItem.disabled &&
          !listItem.hidden &&
          normalizeRouteFragment(listItem.path) === normalizedTargetPath
        ) {
          return {
            selectedKeys: [normalizedTargetPath],
            openKeys: [normalizeRouteFragment(item.path), normalizeRouteFragment(comparison.path)]
          }
        }
      }
    }
  }

  return {
    selectedKeys: [],
    openKeys: []
  }
}

export const Menu: MenuItem[] = [
  {
    name: 'React',
    path: '/react',
    pageId: 'code/react',
    comparison: [
      {
        name: 'React 原理',
        path: '/react-principles',
        list: [
          {
            name: '渲染原理',
            path: '/rendering',
            pageId: 'code/react/rendering'
          },
          {
            name: 'diff 算法',
            path: '/diff',
            pageId: 'code/react/diff'
          },
          {
            name: 'setState',
            path: '/setState',
            pageId: 'code/react/setState'
          }
        ]
      },
      {
        name: '类式组件',
        path: '/react-class-components',
        list: [
          {
            name: 'componentWillMount',
            path: '/willMount',
            pageId: 'code/react/willMount'
          },
          {
            name: 'render',
            path: '/render',
            pageId: 'code/react/render'
          },
          {
            name: 'componentDidMount',
            path: '/didMount',
            pageId: 'code/react/didMount'
          },
          {
            name: 'Memo',
            path: '/memo',
            pageId: 'code/react/memo'
          }
        ]
      },
      {
        name: '函数式 Hooks',
        path: '/react-hooks',
        list: [
          {
            name: 'useEffect',
            path: '/useEffect',
            pageId: 'code/react/useEffect'
          },
          {
            name: 'useMemo',
            path: '/useMemo',
            pageId: 'code/react/useMemo'
          },
          {
            name: 'useCallback',
            path: '/useCallback',
            pageId: 'code/react/useCallback'
          },
          {
            name: 'useReducer',
            path: '/useReducer',
            pageId: 'code/react/useReducer'
          },
          {
            name: 'useRef',
            path: '/useRef',
            pageId: 'code/react/useRef'
          },
          {
            name: 'useImperativeHandle',
            path: '/useImperativeHandle',
            pageId: 'code/react/useImperativeHandle'
          },
          {
            name: 'useLayoutEffect',
            path: '/useLayoutEffect',
            pageId: 'code/react/useLayoutEffect'
          },
          {
            name: '自定义 Hooks',
            path: '/customHooks',
            pageId: 'code/react/customHooks'
          }
        ]
      },
      {
        name: 'React 19+',
        path: '/react-19-plus',
        list: [
          {
            name: 'use Hook',
            path: '/use',
            pageId: 'code/react/use'
          },
          {
            name: 'useActionState',
            path: '/useActionState',
            pageId: 'code/react/useActionState'
          },
          {
            name: '并发特性',
            path: '/concurrency',
            pageId: 'code/react/concurrency'
          }
        ]
      },
      {
        name: '进阶话题',
        path: '/react-advanced',
        list: [
          {
            name: 'Context',
            path: '/context',
            pageId: 'code/react/context'
          },
          {
            name: 'Suspense',
            path: '/suspense',
            pageId: 'code/react/suspense'
          },
          {
            name: 'Error Boundary',
            path: '/errorBoundary',
            pageId: 'code/react/errorBoundary'
          },
          {
            name: 'Portals',
            path: '/portals',
            pageId: 'code/react/portals'
          },
          {
            name: 'Profiler',
            path: '/profiler',
            pageId: 'code/react/profiler'
          },
          {
            name: 'StrictMode',
            path: '/strictMode',
            pageId: 'code/react/strictMode'
          }
        ]
      }
    ]
  },
  {
    name: 'Vue',
    path: '/vue',
    pageId: 'code/vue',
    comparison: [
      {
        name: '核心基础',
        path: '/vue-fundamentals',
        list: [
          {
            name: '基础入门',
            path: '/basics',
            pageId: 'code/vue/basics'
          },
          {
            name: '生命周期',
            path: '/lifecycle',
            pageId: 'code/vue/lifecycle'
          },
          {
            name: '计算属性',
            path: '/computed',
            pageId: 'code/vue/computed'
          },
          {
            name: '侦听器',
            path: '/watch',
            pageId: 'code/vue/watch'
          },
          {
            name: '响应式原理',
            path: '/reactivity',
            pageId: 'code/vue/reactivity'
          },
          {
            name: '组件设计',
            path: '/components',
            pageId: 'code/vue/components'
          }
        ]
      },
      {
        name: 'Vue 2 专题',
        path: '/vue-2-special',
        list: [
          {
            name: 'Vue2 生命周期',
            path: '/vue2-lifecycle',
            pageId: 'code/vue/vue2-lifecycle'
          },
          {
            name: 'Vue2 响应式',
            path: '/vue2-reactivity',
            pageId: 'code/vue/vue2-reactivity'
          },
          {
            name: 'Vue2 指令',
            path: '/vue2-directive',
            pageId: 'code/vue/vue2-directive'
          },
          {
            name: 'Vue2 通信',
            path: '/vue2-communication',
            pageId: 'code/vue/vue2-communication'
          },
          {
            name: 'Vue2 vs Vue3',
            path: '/vue2-vs-vue3',
            pageId: 'code/vue/vue2-vs-vue3'
          }
        ]
      },
      {
        name: 'Vue 3 与工程',
        path: '/vue-3-and-architecture',
        list: [
          {
            name: 'Composition API',
            path: '/composition-api',
            pageId: 'code/vue/composition-api'
          },
          {
            name: 'Vue3 新特性',
            path: '/vue3-feature',
            pageId: 'code/vue/vue3-feature'
          },
          {
            name: '生命周期差异',
            path: '/lifecycle-diff',
            pageId: 'code/vue/lifecycle-diff'
          },
          {
            name: '生态与工程化',
            path: '/vue-ecosystem',
            pageId: 'code/vue/vue-ecosystem'
          }
        ]
      }
    ]
  },
  {
    name: 'Webpack',
    path: '/webpack',
    pageId: 'code/webpack',
    type: 'file'
  }
]

export default Menu
