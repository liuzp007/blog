import { useMemo, memo } from 'react'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import MediaCard from '@/components/ui/media-card'
import type { ContentMeta } from './contentCatalog'
import ArticleConceptCanvas from './ArticleConceptCanvas'

interface ArticleSignalMediaCardProps {
  item: ContentMeta
  enabled: boolean
  className?: string
}

export default memo(function ArticleSignalMediaCard({
  item,
  enabled,
  className = ''
}: ArticleSignalMediaCardProps) {
  const toDetail = useMemo(() => `/blog-detail?slug=${encodeURIComponent(item.slug)}`, [item.slug])

  return (
    <MediaCard
      as="article"
      className={`article-card home-article-card ${className}`.trim()}
      mediaClassName="article-media home-article-card__media"
      bodyClassName="article-content home-article-card__body p-[18px] !gap-0"
      metaClassName="article-meta home-article-card__meta mb-3"
      titleClassName="article-title home-article-card__title"
      descriptionClassName="article-excerpt home-article-card__excerpt"
      footerClassName="home-article-card__footer border-t border-[var(--home-border-faint)] pt-3"
      ctaClassName="home-article-card__cta"
      maxTilt={7}
      scale={1.018}
      lift={8}
      media={
        <Link
          to={toDetail}
          className="home-article-card__media-link block h-full w-full no-underline"
          aria-label={`查看文章：${item.title}`}
        >
          <ArticleConceptCanvas
            item={item}
            enabled={enabled}
            className="home-article-card__signal-canvas"
          />
        </Link>
      }
      meta={
        <>
          <span className="article-tag home-article-card__tag">
            {item.category || item.tags[0] || '精选'}
          </span>
          <span className="article-date home-article-card__date">{item.date}</span>
        </>
      }
      title={
        <Link to={toDetail} className="home-article-card__title-link text-inherit no-underline">
          {item.title}
        </Link>
      }
      description={item.summary || '打开这篇文章查看完整内容。'}
      footer={<span className="home-article-card__readtime">约 {item.readTime} 分钟</span>}
      cta={
        <Link
          to={toDetail}
          className="home-article-card__cta-link inline-flex items-center gap-1.5 text-inherit no-underline"
        >
          <span>查看更多</span>
          <ArrowRightOutlined aria-hidden="true" />
        </Link>
      }
    />
  )
})
