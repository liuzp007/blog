import { describe, it, expect } from 'vitest'
import routers from '@/router/router_config'

describe('Router Smoke Test', () => {
  it('路由配置应包含核心路径', () => {
    const paths = routers.map(r => r.path)

    expect(paths).toContain('/')
    expect(paths).toContain('/blog')
    expect(paths.some(p => p.startsWith('/404') || p === '*')).toBe(true)
  })

  it('路由配置应包含所有站点页面路由', () => {
    const paths = routers.map(r => r.path)

    // siteNavigation 中注册的核心页面都应有对应路由
    const expectedPaths = ['/', '/blog', '/main']
    expectedPaths.forEach(p => {
      expect(paths).toContain(p)
    })
  })

  it('每条路由应有有效配置', () => {
    for (const route of routers) {
      expect(route).toHaveProperty('path')
      expect(route.path).toBeTruthy()
    }
  })
})
