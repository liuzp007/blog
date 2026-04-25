import { useState, memo } from 'react'
import type { ContentMeta } from '@/features/content/contentIndex'
import { Skeleton } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useIntersection } from '@/hooks/useIntersection'
import './invisible-list.css'

interface Props {
  items: ContentMeta[]
}

const Cover = memo(function Cover({ src, alt }: { src?: string; alt: string }) {
  const { ref, visible } = useIntersection<HTMLDivElement>()
  const [loaded, setLoaded] = useState(false)
  return (
    <div
      ref={ref}
      className="icard__cover relative block h-[150px] overflow-hidden rounded-xl md:h-[120px]"
    >
      {!loaded && <Skeleton.Image active style={{ width: '100%', height: '100%' }} />}
      {visible && src && (
        <img
          className="block h-full w-full object-cover"
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{ display: loaded ? 'block' : 'none' }}
        />
      )}
    </div>
  )
})

export default memo(function InvisibleCardList({ items }: Props) {
  return (
    <div className="icard flex flex-col gap-7">
      {items.map(m => (
        <Link
          key={m.slug}
          className="icard__item relative block cursor-pointer no-underline"
          to={`/blog-detail?slug=${encodeURIComponent(m.slug)}`}
          aria-label={`阅读文章：${m.title}`}
        >
          <Cover src={m.cover} alt={m.title} />
          <h3 className="icard__title ui-card-title mb-1.5 mt-2.5 text-base" title={m.title}>
            {m.title}
          </h3>
          {m.summary && (
            <p className="icard__summary ui-body-text overflow-hidden leading-[1.6] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
              {m.summary}
            </p>
          )}
          <div className="icard__meta ui-meta-text mt-2 flex items-center gap-3">
            <span className="icard__chip ui-tag">{m.tags[0] || '未分类'}</span>
            <span>{m.date}</span>
            <span className="icard__views inline-flex items-center gap-1">
              <EyeOutlined /> {Math.max(128, Math.round(m.words * 0.3))}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
})
