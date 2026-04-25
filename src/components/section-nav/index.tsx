import { memo, useCallback } from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'

export interface SectionNavItem {
  id: string
  label: string
  href?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

interface SectionNavProps {
  className?: string
  homeLabel?: string
  homeButtonClassName?: string
  linksClassName?: string
  linkButtonClassName?: string
  items?: SectionNavItem[]
  homeTo?: string
}

export default memo(function SectionNav({
  className,
  homeLabel = 'ROC',
  homeButtonClassName,
  linksClassName,
  linkButtonClassName,
  items = [],
  homeTo = '/'
}: SectionNavProps) {
  const history = useHistory()

  const handleHomeClick = useCallback(() => history.push(homeTo), [history, homeTo])

  return (
    <nav className={className} aria-label="页面导航">
      <Button type="text" className={clsx(homeButtonClassName)} onClick={handleHomeClick}>
        {homeLabel}
      </Button>
      {items.length > 0 && (
        <div className={linksClassName}>
          {items.map(item => (
            <Button
              key={item.id}
              type="text"
              className={clsx(linkButtonClassName)}
              onClick={e => {
                if (item.onClick) {
                  item.onClick(e)
                  return
                }
                if (!item.href) return
                history.push(item.href)
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </nav>
  )
})
