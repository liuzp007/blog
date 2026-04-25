import React, { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface ScrollToTopProps {
  children: React.ReactNode
  targetId?: string
}

const getAnchorElement = (hash: string) => {
  if (!hash) return null
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return null
  return document.getElementById(id)
}

export default function ScrollToTop({ children, targetId }: ScrollToTopProps) {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    const anchor = getAnchorElement(hash)

    if (anchor) {
      requestAnimationFrame(() => {
        anchor.scrollIntoView({ behavior: 'auto', block: 'start' })
      })
      return
    }

    if (targetId) {
      const target = document.getElementById(targetId)
      if (target) {
        target.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        return
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hash, pathname, search, targetId])

  return <>{children}</>
}
