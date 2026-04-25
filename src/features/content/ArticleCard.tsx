import { useCallback, useMemo, memo } from 'react'
import type { MouseEvent, KeyboardEvent } from 'react'
import {
  StarOutlined,
  ShareAltOutlined,
  EyeOutlined,
  WechatOutlined,
  WeiboOutlined,
  LinkOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { Button, Space, Tooltip, Popover, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import MediaCard from '@/components/ui/media-card'
import ArticleConceptCanvas from '@/features/content/ArticleConceptCanvas'
import type { ContentMeta } from '@/features/content/contentIndex'
import './article-card.css'

interface ArticleCardProps {
  meta: ContentMeta
}

const THEME_POOL = ['is-cyan', 'is-amber', 'is-coral'] as const

export default memo(function ArticleCard({ meta }: ArticleCardProps) {
  const history = useHistory()

  const toDetail = useMemo(() => `/blog-detail?slug=${encodeURIComponent(meta.slug)}`, [meta.slug])
  const toCategory = useMemo(
    () => `/blog?tag=${encodeURIComponent(meta.category || meta.tags[0] || '未分类')}`,
    [meta.category, meta.tags]
  )
  const category = meta.category || meta.tags[0] || '未分类'
  const views = Math.max(128, Math.round(meta.words * 0.3))
  const theme = THEME_POOL[meta.slug.length % 3]

  const navigate = useCallback(() => {
    history.push(toDetail)
  }, [history, toDetail])

  const onFav = useCallback((e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    message.success('收藏成功', 1)
  }, [])

  const onCopy = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        const url = new URL(toDetail, window.location.origin).toString()
        await navigator.clipboard.writeText(url)
      } catch (error) {
        console.error('复制失败:', error)
      }
      message.success('链接已复制', 1)
    },
    [toDetail]
  )

  const onCardKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        navigate()
      }
    },
    [navigate]
  )

  return (
    <MediaCard
      as="article"
      className={`article-card-link article-card ${theme} block !rounded-[14px] no-underline [--media-card-bg:var(--article-card-bg)] [--media-card-border:var(--article-card-border)] [--media-card-shadow:var(--article-card-shadow)] [--media-card-shadow-hover:var(--article-card-shadow-hover)] [--media-card-border-hover:color-mix(in_srgb,var(--article-card-accent)_55%,var(--color-white)_25%)]`}
      mediaClassName="article-card__media relative h-[150px] overflow-hidden bg-[var(--article-card-media-bg)] max-[480px]:h-[136px]"
      bodyClassName="article-card__body p-3.5 pb-3 max-[480px]:p-3"
      metaClassName="article-card__head mb-2 flex items-center justify-between gap-2"
      titleClassName="article-card__title ui-card-title overflow-hidden text-[18px] leading-[1.35] text-[var(--article-card-title)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] max-[480px]:text-base"
      descriptionClassName="article-card__description"
      ctaClassName="justify-end"
      role="link"
      tabIndex={0}
      maxTilt={6}
      scale={1.014}
      lift={6}
      onClick={navigate}
      onKeyDown={onCardKeyDown}
      aria-label={`阅读文章：${meta.title}`}
      media={
        <Link
          to={toDetail}
          className="article-card__media-link block h-full w-full text-inherit no-underline"
          aria-label={`阅读文章：${meta.title}`}
        >
          <ArticleConceptCanvas
            item={meta}
            enabled={true}
            className="absolute inset-0 block h-full w-full"
          />
          <div
            className="absolute inset-x-[10px] bottom-2 z-[3] flex justify-between gap-2"
            aria-hidden="true"
          >
            <span className="article-card__cover-chip article-card__cover-chip--category">
              {category}
            </span>
            <span className="article-card__cover-chip article-card__cover-chip--meta">
              {meta.seriesOrder ? `系列 ${meta.seriesOrder}` : `约 ${meta.readTime} 分钟`}
            </span>
          </div>
        </Link>
      }
      meta={
        <>
          <Link to={toCategory} className="article-card__category-link text-inherit no-underline">
            <span className="article-card__category-chip">{category}</span>
          </Link>
          <div className="article-card__ops flex items-center gap-0.5">
            <Tooltip title="收藏">
              <Button
                className="article-card__op-btn"
                type="text"
                size="small"
                icon={<StarOutlined />}
                onClick={onFav}
              />
            </Tooltip>
            <Popover
              placement="left"
              trigger="click"
              content={
                <Space>
                  <Button className="article-card__op-btn" type="text" icon={<WechatOutlined />} />
                  <Button className="article-card__op-btn" type="text" icon={<WeiboOutlined />} />
                  <Button
                    className="article-card__op-btn"
                    type="text"
                    icon={<LinkOutlined />}
                    onClick={onCopy}
                  />
                </Space>
              }
            >
              <Button
                className="article-card__op-btn"
                type="text"
                size="small"
                icon={<ShareAltOutlined />}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              />
            </Popover>
          </div>
        </>
      }
      title={
        <Link
          to={toDetail}
          className="article-card__title-link text-inherit no-underline"
          aria-label={`阅读文章：${meta.title}`}
        >
          {meta.title}
        </Link>
      }
      description={
        <>
          <div className="article-card__meta ui-meta-text mt-1 text-[var(--article-card-meta)]">
            {meta.date} · {meta.words} 字 · TECH DISPATCH
          </div>
          {meta.summary ? (
            <div className="article-card__summary ui-body-text mt-2 min-h-[44px] overflow-hidden text-[13px] leading-[1.65] text-[var(--article-card-summary)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] max-[480px]:min-h-10 max-[480px]:text-xs">
              {meta.summary}
            </div>
          ) : null}
          {meta.seriesTitle ? (
            <div className="article-card__series ui-overline mt-2.5 text-[var(--article-card-accent)]">
              {meta.seriesTitle}
            </div>
          ) : null}
        </>
      }
      descriptionAs="div"
      footer={
        <div className="article-card__footer-main flex flex-1 items-center justify-between gap-2">
          <span className="article-card__foottext ui-caption inline-flex items-center gap-1 text-[11px] text-[var(--article-card-foottext)]">
             {meta.date.replace(/-/g, '.')}
          </span>
          <span className="article-card__foottext ui-caption inline-flex items-center gap-1 text-[11px] text-[var(--article-card-foottext)]  min-w-[max-content]">
            <EyeOutlined /> {views} 阅读
          </span>
        </div>
      }
      cta={
        <Link
          to={toDetail}
          className="blog-lab__action blog-lab__action--feature blog-lab__series-link blog-lab__series-link--feature min-w-[max-content]"
        >
          <span>开始阅读</span>
          <ArrowRightOutlined aria-hidden="true" />
        </Link>
      }
    />
  )
})
