import { useState, useMemo, memo } from 'react'
import clsx from 'clsx'
import { Button, Drawer } from 'antd'
import { ArrowRightOutlined, MenuOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import Vinyl from '../vinyl'
import { SITE_NAV_ITEMS } from '@/config/siteNavigation'
import styles from './Header.module.css'

/** Check if a navigation item should be highlighted */
function isActivePath(currentPath: string, targetPath: string) {
  if (targetPath === '/blog') {
    return currentPath === '/blog' || currentPath === '/blog-detail'
  }
  if (targetPath === '/main') {
    return currentPath.startsWith('/main')
  }
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

interface NavItemProps {
  item: { path: string; label: string; description: string }
  isActive: boolean
  onClick?: () => void
  className: string
  activeClassName: string
}

const NavItem = memo(function NavItem({
  item,
  isActive,
  onClick,
  className,
  activeClassName
}: NavItemProps) {
  return (
    <Link
      to={item.path}
      className={clsx(className, isActive && activeClassName)}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      <span>{item.label}</span>
      <small>{item.description}</small>
    </Link>
  )
})

function Header() {
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Compute active states once per route change
  const activeMap = useMemo(
    () =>
      new Map(SITE_NAV_ITEMS.map(item => [item.path, isActivePath(location.pathname, item.path)])),
    [location.pathname]
  )

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className={styles.headerWrap}>
      <div className={styles.header}>
        <Link to="/" className={styles.brandButton} onClick={closeDrawer}>
          <span className={styles.brandButton__disc}>
            <Vinyl />
          </span>
          <span className={styles.brandButton__content}>
            <strong>MY SPACE</strong>
            <span>Frontend notes, experiments and dispatches</span>
          </span>
        </Link>

        <nav className={styles.headerNav} aria-label="主导航">
          {SITE_NAV_ITEMS.map(item => (
            <NavItem
              key={item.path}
              item={item}
              isActive={activeMap.get(item.path) ?? false}
              className={styles.headerNav__item}
              activeClassName={styles['headerNav__item--active']}
            />
          ))}
        </nav>

        <div className={styles.headerActions}>
          <Link to="/blog" className={styles.headerActions__cta}>
            <ArrowRightOutlined aria-hidden="true" />
            最新博客
          </Link>
          <Button
            type="text"
            className={styles.headerActions__menu}
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            aria-label="打开导航菜单"
          />
        </div>

        <Drawer
          placement="right"
          title="Navigation"
          open={drawerOpen}
          onClose={closeDrawer}
          className={styles.headerDrawer}
        >
          <div className={styles.headerDrawer__list}>
            {SITE_NAV_ITEMS.map(item => (
              <NavItem
                key={item.path}
                item={item}
                isActive={activeMap.get(item.path) ?? false}
                onClick={closeDrawer}
                className={styles.headerDrawer__item}
                activeClassName={styles['headerDrawer__item--active']}
              />
            ))}
          </div>
        </Drawer>
      </div>
    </div>
  )
}

export default memo(Header)
