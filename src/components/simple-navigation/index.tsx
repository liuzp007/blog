import { memo, useCallback, useMemo } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { FolderOutlined, FileOutlined } from '@ant-design/icons'
import { MenuItem, ChildrenItem } from '@/data'
import '../../styles/3_components/layout/simple-navigation.css'

interface SimpleNavigationProps {
  menuData: MenuItem[]
  selectedKeys?: string[]
  openKeys?: string[]
  onMenuClick?: (params: { key: string }) => void
  onOpenChange?: (keys: string[]) => void
}

const getMenuIcon = (
  item: MenuItem | ChildrenItem | { list?: any[]; comparison?: any[]; icon?: React.ReactNode }
) => {
  if (item.icon) return item.icon
  if ('children' in item && item.children && item.children.length > 0) return <FolderOutlined />
  if ('comparison' in item && item.comparison && item.comparison.length > 0)
    return <FolderOutlined />
  if ('list' in item && item.list && item.list.length > 0) return <FolderOutlined />
  return <FileOutlined />
}

function SimpleNavigation({
  menuData,
  selectedKeys = [],
  openKeys = [],
  onMenuClick,
  onOpenChange
}: SimpleNavigationProps) {
  const menuItems = useMemo<MenuProps['items']>(
    () =>
      menuData.map(item => {
        if (item.children && item.children.length > 0) {
          return {
            key: item.path,
            icon: getMenuIcon(item),
            label: item.name,
            children: item.children.map(child => ({
              key: child.path,
              icon: getMenuIcon(child),
              label: child.name
            }))
          }
        }

        if (item.comparison && item.comparison.length > 0) {
          return {
            key: item.path,
            icon: getMenuIcon(item),
            label: item.name,
            children: item.comparison.map(comp => {
              if (comp.list && comp.list.length > 0) {
                return {
                  key: comp.path,
                  icon: getMenuIcon(comp),
                  label: comp.name,
                  children: comp.list.map(listItem => ({
                    key: listItem.path,
                    icon: getMenuIcon(listItem),
                    label: listItem.name
                  }))
                }
              }
              return {
                key: comp.path,
                icon: getMenuIcon(comp),
                label: comp.name
              }
            })
          }
        }

        return {
          key: item.path,
          icon: getMenuIcon(item),
          label: item.name
        }
      }) as MenuProps['items'],
    [menuData]
  )

  const handleMenuClick = useCallback(
    (e: { key: string }) => {
      onMenuClick?.({ key: e.key })
    },
    [onMenuClick]
  )

  return (
    <div className="simple-navigation flex h-full flex-col border-r border-[var(--white-alpha-10)] bg-[var(--color-sidebar-surface)] backdrop-blur-[10px] max-md:h-auto max-md:max-h-[200px] max-md:border-b max-md:border-r-0">
      <div className="simple-navigation__header border-b border-[var(--white-alpha-10)] px-4 py-5 max-md:p-3">
        <h3 className="ui-body-text-strong m-0 text-[16px] text-[var(--color-white)] max-md:text-[13px]">
          导航菜单
        </h3>
      </div>
      <div className="simple-navigation__content flex-1 overflow-y-auto p-2 max-md:p-1">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
          onOpenChange={onOpenChange}
          className="custom-menu"
        />
      </div>
    </div>
  )
}

export default memo(SimpleNavigation)
