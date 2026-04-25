import { useState, useEffect, useRef, useCallback, memo } from 'react'
import clsx from 'clsx'
import { Menu, Button, Tooltip, Badge } from 'antd'
import {
  SettingOutlined,
  AppstoreOutlined,
  FolderOutlined,
  FileOutlined,
  PushpinOutlined,
  ExpandOutlined,
  CompressOutlined
} from '@ant-design/icons'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import anime from 'animejs'
import { useAppSelector, useAppDispatch } from '../../store'
import { toggleSidebar, setSidebarCollapsed } from '../../store/ui'
import { MenuItem, ChildrenItem } from '../../data'
import '../../styles/3_components/layout/collapsible-navigation.css'

type MenuClick = Parameters<NonNullable<React.ComponentProps<typeof Menu>['onClick']>>[0]

interface CollapsibleNavigationProps {
  menuData: MenuItem[]
  selectedKeys: string[]
  openKeys: string[]
  onMenuClick: (info: MenuClick) => void
  onOpenChange: (keys: string[]) => void
}

// Extracted outside component to avoid recreation every render
const ICON_MAP: Record<string, React.ReactNode> = {
  folder: <FolderOutlined />,
  file: <FileOutlined />,
  app: <AppstoreOutlined />,
  settings: <SettingOutlined />
}

const SIDEBAR_VARIANTS: Variants = {
  expanded: {
    width: 280,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  collapsed: {
    width: 80,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
}

const CollapsibleNavigation: React.FC<CollapsibleNavigationProps> = ({
  menuData,
  selectedKeys,
  openKeys,
  onMenuClick,
  onOpenChange
}) => {
  const dispatch = useAppDispatch()
  const sidebarCollapsed = useAppSelector(state => state.ui.sidebarCollapsed)
  const [isPinned, setIsPinned] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleToggleCollapse = useCallback(() => {
    dispatch(toggleSidebar())
    if (sidebarRef.current) {
      anime({
        targets: sidebarRef.current,
        scale: [1, 0.98, 1],
        duration: 200,
        easing: 'easeInOutQuad'
      })
    }
  }, [dispatch])

  const handleTogglePin = useCallback(() => {
    setIsPinned(prev => !prev)
    dispatch(toggleSidebar())
  }, [dispatch])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => setIsHovering(false), [])

  useEffect(() => {
    if (isPinned) return

    if (isHovering && sidebarCollapsed) {
      const timer = setTimeout(() => {
        dispatch(setSidebarCollapsed(false))
      }, 300)
      return () => clearTimeout(timer)
    }

    if (!isHovering && !sidebarCollapsed) {
      const timer = setTimeout(() => {
        dispatch(setSidebarCollapsed(true))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isHovering, sidebarCollapsed, isPinned, dispatch])

  const renderMenuItems = (items: MenuItem[]): React.ReactNode => {
    return items.map(item => {
      const icon = item.icon || ICON_MAP[item.type || 'file'] || <FileOutlined />
      const menuTextClassName = sidebarCollapsed ? 'menu-text hidden' : 'menu-text'
      const menuBadgeClassName = sidebarCollapsed
        ? 'menu-badge absolute right-3 top-3'
        : 'menu-badge'

      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu
            key={item.path}
            icon={icon}
            title={
              <span className={menuTextClassName}>
                {item.name}
                {item.badge && (
                  <Badge count={item.badge} size="small" className={menuBadgeClassName} />
                )}
              </span>
            }
          >
            {item.children.map((child: ChildrenItem) => (
              <Menu.Item key={child.path} icon={child.icon || <FileOutlined />}>
                <span className={menuTextClassName}>{child.name}</span>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        )
      }

      return (
        <Menu.Item key={item.path} icon={icon}>
          <span className={menuTextClassName}>
            {item.name}
            {item.badge && <Badge count={item.badge} size="small" className={menuBadgeClassName} />}
          </span>
        </Menu.Item>
      )
    })
  }

  return (
    <motion.div
      ref={sidebarRef}
      className="collapsible-navigation relative flex h-full flex-col overflow-hidden border-r border-[var(--white-alpha-10)] bg-[linear-gradient(135deg,var(--color-sidebar-start),var(--color-sidebar-end))] backdrop-blur-[20px] transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-r-[var(--indigo-alpha-30)]"
      data-collapsed={sidebarCollapsed ? 'true' : 'false'}
      variants={SIDEBAR_VARIANTS}
      animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={clsx(
          'collapsible-navigation__header flex min-h-[60px] items-center border-b border-[var(--white-alpha-10)] bg-[var(--white-alpha-02)]',
          sidebarCollapsed ? 'justify-center px-2 py-4' : 'justify-between px-4'
        )}
      >
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.h3
              className="collapsible-navigation__title m-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-[var(--color-white)] transition-opacity duration-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              导航菜单
            </motion.h3>
          )}
        </AnimatePresence>

        <div className="collapsible-navigation__controls flex gap-2">
          <Tooltip title={isPinned ? '取消固定' : '固定侧边栏'} placement="bottom">
            <Button
              type="text"
              size="small"
              className={clsx(
                'collapsible-navigation__control text-[var(--white-alpha-60)] hover:bg-[var(--white-alpha-10)] hover:text-[var(--color-white)] focus:bg-[var(--white-alpha-10)] focus:text-[var(--color-white)]',
                isPinned &&
                  'collapsible-navigation__control--active bg-[var(--indigo-alpha-10)] text-[var(--color-indigo-500)] hover:bg-[var(--indigo-alpha-10)] hover:text-[var(--color-indigo-500)] focus:bg-[var(--indigo-alpha-10)] focus:text-[var(--color-indigo-500)]'
              )}
              icon={<PushpinOutlined />}
              onClick={handleTogglePin}
            />
          </Tooltip>

          <Tooltip title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'} placement="bottom">
            <Button
              type="text"
              size="small"
              className="collapsible-navigation__control text-[var(--white-alpha-60)] hover:bg-[var(--white-alpha-10)] hover:text-[var(--color-white)] focus:bg-[var(--white-alpha-10)] focus:text-[var(--color-white)]"
              icon={sidebarCollapsed ? <ExpandOutlined /> : <CompressOutlined />}
              onClick={handleToggleCollapse}
            />
          </Tooltip>
        </div>
      </div>

      <div className="collapsible-navigation__content flex-1 overflow-x-hidden overflow-y-auto p-2">
        <Menu
          className="collapsible-navigation__menu border-0 bg-transparent text-[var(--white-alpha-80)]"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={onMenuClick}
          inlineIndent={12}
        >
          {renderMenuItems(menuData)}
        </Menu>
      </div>

      <div
        className={clsx(
          'collapsible-navigation__footer flex justify-center border-t border-[var(--white-alpha-10)]',
          sidebarCollapsed ? 'p-2' : 'p-3'
        )}
      >
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              className="collapsible-navigation__footer-text text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="collapsible-navigation__footer-count mb-1 text-xs text-[var(--white-alpha-50)]">
                {menuData.length} 项菜单
              </div>
              <div className="collapsible-navigation__footer-version text-[10px] text-[var(--white-alpha-30)]">
                v2.0.0
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default memo(CollapsibleNavigation)
