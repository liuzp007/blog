import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { ContentMeta } from '@/features/content/contentIndex'
import './alternatives.css'

interface Props {
  items: ContentMeta[]
}

export const TimelineList = memo(function TimelineList({ items }: Props) {
  return (
    <div className="timeline relative pl-6">
      {items.map(m => (
        <div key={m.slug} className="timeline__item relative my-5">
          <div className="timeline__dot" aria-hidden />
          <div className="timeline__date ui-meta-text mb-1 opacity-80">{m.date}</div>
          <Link
            className="timeline__title ui-body-text-strong"
            to={`/blog-detail?slug=${encodeURIComponent(m.slug)}`}
          >
            {m.title}
          </Link>
          <div className="timeline__meta ui-meta-text mt-1 opacity-75">
            约 {m.readTime} 分钟 · {m.words} 字
          </div>
          {m.summary && (
            <div className="timeline__summary ui-body-text mt-2 text-[var(--white-alpha-90)]">
              {m.summary}
            </div>
          )}
        </div>
      ))}
    </div>
  )
})

export const MagazineMasonry = memo(function MagazineMasonry({ items }: Props) {
  return (
    <div className="magazine columns-1 [column-gap:20px] md:columns-2">
      {items.map(m => (
        <Link
          key={m.slug}
          className="magazine__card ui-card ui-card--dense ui-card--interactive mb-5 block [break-inside:avoid] no-underline text-[var(--color-text-soft)]"
          to={`/blog-detail?slug=${encodeURIComponent(m.slug)}`}
        >
          <div className="magazine__header flex items-start justify-between gap-3">
            <div className="magazine__tagline ui-overline text-[var(--color-indigo-300)]">
              {m.tags[0] || 'untagged'}
            </div>
            <div className="magazine__date ui-meta-text opacity-80">{m.date}</div>
          </div>
          <div className="magazine__title ui-card-title">{m.title}</div>
          {m.summary && (
            <div className="magazine__summary ui-body-text opacity-90">{m.summary}</div>
          )}
        </Link>
      ))}
    </div>
  )
})

export default {}
