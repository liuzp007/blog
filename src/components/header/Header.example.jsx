import React, { useState } from 'react'
import { Button, Drawer } from 'antd'
import { ArrowRightOutlined, MenuOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import Vinyl from '../vinyl'
import { SITE_NAV_ITEMS } from '@/config/siteNavigation'
import styles from './Header.module.css'

function isActivePath(currentPath, targetPath) {
  if (targetPath === '/blog') {
    return currentPath === '/blog' || currentPath === '/blog-detail'
  }
  if (targetPath === '/main') {
    return currentPath.startsWith('/main')
  }
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

function Header() {
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header className={styles.headerWrap}>
      <div className={styles.header}>
        <Link to="/" className={styles.brandButton} onClick={() => setDrawerOpen(false)}>
          <div className={styles.brandButton__disc}>
            <Vinyl />
          </div>
          <div className={styles.brandButton__content}>
            <strong>MY SPACE</strong>
            <span>Frontend notes, experiments and dispatches</span>
          </div>
        </Link>

        <nav className={styles.headerNav} aria-label="主导航">
          {SITE_NAV_ITEMS.map(item => {
            const isActive = isActivePath(location.pathname, item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={[styles.headerNav__item, isActive && styles['headerNav__item--active']]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </Link>
            )
          })}
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
          onClose={() => setDrawerOpen(false)}
          className={styles.headerDrawer}
        >
          <div className={styles.headerDrawer__list}>
            {SITE_NAV_ITEMS.map(item => {
              const isActive = isActivePath(location.pathname, item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={[
                    styles.headerDrawer__item,
                    isActive && styles['headerDrawer__item--active']
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span>{item.label}</span>
                  <small>{item.description}</small>
                </Link>
              )
            })}
          </div>
        </Drawer>
      </div>
    </header>
  )
}

export default React.memo(Header)
