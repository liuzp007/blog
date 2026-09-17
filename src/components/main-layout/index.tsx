import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import type { RouteLeaf } from '../../router/router_config'
import RouterView from '../../router/router-view'
import { Menu, getMainMenuState } from '../../data'
import Header from '../header'
import SimpleBackground from '../simple-background'
import SimpleNavigation from '../simple-navigation'
import ScrollToTop from '../scroll-top'

import './index.css'

interface MainLayoutProps {
  children?: React.ReactNode
  routers?: RouteLeaf[]
}

export default function MainLayout(props: MainLayoutProps) {
  const routerHistory = useHistory()
  const routerLocation = useLocation()
  const menuState = useMemo(() => {
    const pathSegment = routerLocation.pathname.replace('/main', '')
    return getMainMenuState(Menu, pathSegment)
  }, [routerLocation.pathname])
  const [openKeys, setOpenKeys] = useState(menuState.openKeys)

  useEffect(() => {
    setOpenKeys(menuState.openKeys)
  }, [menuState.openKeys])

  // 处理菜单点击
  const handleMenuClick = useCallback(
    (e: { key: string }) => {
      const targetPath = `/main${e.key}`

      // 避免重复导航
      if (routerLocation.pathname === targetPath) return

      // 使用history API进行导航
      routerHistory.push(targetPath)
    },
    [routerHistory, routerLocation.pathname]
  )

  // 处理菜单展开/收起
  const handleOpenChange = useCallback((keys: string[]) => {
    setOpenKeys(keys)
  }, [])

  return (
    <div className="main-layout relative h-screen w-screen overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">
      <SimpleBackground />
      <div className="main-layout__chrome relative z-[1] flex h-full flex-col">
        <Header />
        <div className="main-layout__content flex min-h-0 flex-1 overflow-hidden px-[var(--space-5)] pt-[var(--space-5)] max-md:px-[var(--space-3)]">
          <div className="main-layout__body flex min-h-0 w-full flex-1 gap-[var(--space-4)] max-md:flex-col max-md:gap-[var(--space-3)]">
            {/* 固定侧边栏导航 - 不随路由切换重新挂载 */}
            <aside className="main-layout__sidebar ui-card ui-card--compact min-h-0 w-[220px] min-w-[200px] max-w-[280px] shrink-0 overflow-auto select-none bg-[var(--color-sidebar-surface)] backdrop-blur-[10px] transition-[border-color,background-color,box-shadow] duration-300 max-md:h-auto max-md:w-full max-md:max-w-none">
              <SimpleNavigation
                menuData={Menu}
                onMenuClick={handleMenuClick}
                selectedKeys={menuState.selectedKeys}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
              />
            </aside>

            {/* 动态内容区域 */}
            <main
              className="main-layout__main ui-card min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-[color-mix(in srgb, var(--color-white) 2%, transparent)] text-base leading-[1.8] text-[color-mix(in srgb, var(--color-white) 80%, transparent)] backdrop-blur-[10px] transition-[border-color,background-color,box-shadow] duration-300 max-md:h-auto"
              id="contentID"
            >
              <ScrollToTop targetId="contentID">
                {props.children ? (
                  props.children
                ) : props.routers ? (
                  <RouterView routes={props.routers} />
                ) : (
                  <div className="main-layout__empty ui-body-text grid min-h-full place-items-center p-[var(--space-8)] text-center">
                    暂无子组件内容
                  </div>
                )}
              </ScrollToTop>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
