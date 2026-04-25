import { useRef, useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  CompassOutlined
} from '@ant-design/icons'
import ContentWrapper from '@/components/content-wrapper'
import SEOHead from '@/components/seo-head'
import TOC, { type TOCItem } from '@/components/toc'
import {
  allMetas,
  getArticle,
  getRelatedArticles,
  getSeriesArticles,
  parseMarkdown,
  type ContentBlock,
  type ContentMeta,
  type InlineNode
} from '@/features/content/contentIndex'
import { getQueryParam } from '@/utils/query'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-nginx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/themes/prism.css'
import './index.css'

// js-hoist-regexp: 正则提取到模块级
const RE_EXTERNAL_LINK = /^https?:\/\//i
const RE_SCHEME = /^([a-z][a-z0-9+.-]*):/i

// js-cache-function-results: 语言标签缓存
const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  jsx: 'JSX',
  typescript: 'TypeScript',
  tsx: 'TSX',
  markup: 'HTML',
  bash: 'Bash',
  json: 'JSON',
  nginx: 'Nginx'
}

function articleHref(slug: string): string {
  return `/blog-detail?slug=${encodeURIComponent(slug)}`
}

function getSafeHref(href: string): string | null {
  const value = href.trim()
  if (!value || value.startsWith('//')) return null

  const schemeMatch = value.match(RE_SCHEME)
  if (!schemeMatch) return value

  const scheme = schemeMatch[1].toLowerCase()
  if (scheme === 'http' || scheme === 'https' || scheme === 'mailto') return value

  return null
}

function renderInline(nodes: InlineNode[], keyPrefix: string): React.ReactNode {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`

    if (node.type === 'code') return <code key={key}>{node.text}</code>
    if (node.type === 'strong') return <strong key={key}>{node.text}</strong>

    if (node.type === 'link') {
      const safeHref = getSafeHref(node.href)
      if (!safeHref) return <Fragment key={key}>{node.text}</Fragment>
      const isExternal = RE_EXTERNAL_LINK.test(safeHref)
      return (
        <a
          key={key}
          href={safeHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          {node.text}
        </a>
      )
    }

    return <Fragment key={key}>{node.text}</Fragment>
  })
}

function codeLanguageLabel(language: string): string {
  return LANGUAGE_LABELS[language] || language.toUpperCase() || 'TEXT'
}

// rerender-functional-setstate: handleCopy 使用 functional setState
function ArticleCodeBlock({ code, language }: { code: string; language: string }) {
  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const normalizedLanguage = language || 'typescript'
  const languageClass = `language-${normalizedLanguage}`

  useEffect(() => {
    if (!codeRef.current) return
    Prism.highlightElement(codeRef.current)
  }, [code, normalizedLanguage])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1200)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      /* noop */
    }
  }, [code])

  return (
    <pre className="blog-detail-code" data-language={codeLanguageLabel(normalizedLanguage)}>
      <button
        type="button"
        className="blog-detail-copy-button"
        onClick={handleCopy}
        aria-label="复制代码"
      >
        {copied ? '已复制' : '复制'}
      </button>
      <code ref={codeRef} className={languageClass}>
        {code}
      </code>
    </pre>
  )
}

function renderBlocks(blocks: ContentBlock[]): React.ReactNode {
  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`

    if (block.type === 'heading') {
      const Tag = block.level === 1 ? 'h1' : block.level === 2 ? 'h2' : 'h3'
      return (
        <Tag key={key} id={block.id}>
          {renderInline(block.children, key)}
        </Tag>
      )
    }

    if (block.type === 'paragraph') return <p key={key}>{renderInline(block.children, key)}</p>

    if (block.type === 'code')
      return <ArticleCodeBlock key={key} code={block.code} language={block.language} />

    const ListTag = block.ordered ? 'ol' : 'ul'
    return (
      <ListTag key={key}>
        {block.items.map((item, itemIndex) => (
          <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
        ))}
      </ListTag>
    )
  })
}

function ReadingCard({
  item,
  label,
  align = 'left'
}: {
  item: ContentMeta
  label: string
  align?: 'left' | 'right'
}) {
  return (
    <Link
      to={articleHref(item.slug)}
      className={`blog-detail-reading-card blog-detail-reading-card--${align} flex flex-col gap-[10px] rounded-[20px] p-[18px] no-underline ${align === 'right' ? 'text-right' : ''}`}
    >
      <span className="blog-detail-chip blog-detail-chip--section blog-detail-reading-card__label">
        {label}
      </span>
      <strong>{item.title}</strong>
      <span>
        {item.category || '精选'} · {item.readTime} 分钟 · {item.words} 字
      </span>
    </Link>
  )
}

export default function BlogDetail() {
  const location = useLocation()
  const slug = useMemo(() => getQueryParam(location.search, 'slug') || '', [location.search])

  const [doc, setDoc] = useState<Awaited<ReturnType<typeof getArticle>> | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      const data = slug ? await getArticle(slug) : null
      if (active) setDoc(data)
    }
    load()
    return () => {
      active = false
    }
  }, [slug])

  const { blocks, toc, prev, next, relatedArticles, seriesArticles, seriesIndex } = useMemo(() => {
    if (!doc)
      return {
        blocks: [] as ContentBlock[],
        toc: [] as TOCItem[],
        prev: null as ContentMeta | null,
        next: null as ContentMeta | null,
        relatedArticles: [] as ContentMeta[],
        seriesArticles: [] as ContentMeta[],
        seriesIndex: -1
      }

    const { blocks, toc } = parseMarkdown(doc.body)
    const seriesArts = getSeriesArticles(doc.meta.series)
    const sIdx = seriesArts.findIndex(item => item.slug === doc.meta.slug)
    const globalIndex = allMetas.findIndex(item => item.slug === doc.meta.slug)
    const globalPrev = globalIndex > 0 ? allMetas[globalIndex - 1] : null
    const globalNext =
      globalIndex >= 0 && globalIndex < allMetas.length - 1 ? allMetas[globalIndex + 1] : null
    const prev = seriesArts.length > 0 ? (sIdx > 0 ? seriesArts[sIdx - 1] : null) : globalPrev
    const next =
      seriesArts.length > 0
        ? sIdx >= 0 && sIdx < seriesArts.length - 1
          ? seriesArts[sIdx + 1]
          : null
        : globalNext
    const related = getRelatedArticles(doc.meta, 3)
    return {
      blocks,
      toc,
      prev,
      next,
      relatedArticles: related,
      seriesArticles: seriesArts,
      seriesIndex: sIdx
    }
  }, [doc])

  if (!slug) return <ContentWrapper title="文章详情">未提供 slug</ContentWrapper>
  if (!doc)
    return (
      <ContentWrapper title="文章详情" loading>
        嘘，好戏即将开场...
      </ContentWrapper>
    )
  const url = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <ContentWrapper>
      <SEOHead
        title={doc.meta.title}
        description={doc.meta.summary}
        url={url}
        cover={doc.meta.cover}
        publishedTime={doc.meta.date}
        type="article"
        tags={doc.meta.tags}
        breadcrumb={[
          { name: 'Blog', url: '/blog' },
          { name: doc.meta.title, url }
        ]}
      />
      <div className="blog-detail-page">
        <section className="blog-detail-hero relative mb-8 overflow-hidden rounded-[28px] p-7 max-md:rounded-[22px] max-md:p-5">
          <div className="blog-detail-hero__eyebrow mb-[18px] flex flex-wrap gap-[10px]">
            <Link to="/blog" className="blog-detail-chip blog-detail-chip--link">
              Editorial Archive
            </Link>
            {doc.meta.category ? (
              <span className="blog-detail-chip blog-detail-chip--eyebrow">
                {doc.meta.category}
              </span>
            ) : null}
            {doc.meta.seriesTitle ? (
              <span className="blog-detail-chip blog-detail-chip--eyebrow">
                {doc.meta.seriesTitle}
              </span>
            ) : null}
          </div>
          <h1>{doc.meta.title}</h1>
          {doc.meta.summary ? (
            <p className="blog-detail-hero__summary mt-[18px] max-w-[760px]">{doc.meta.summary}</p>
          ) : null}
          <div className="blog-detail-hero__meta mt-[22px] flex flex-wrap gap-[10px]">
            <span className="blog-detail-chip blog-detail-chip--meta">{doc.meta.date}</span>
            <span className="blog-detail-chip blog-detail-chip--meta">
              {doc.meta.readTime} 分钟阅读
            </span>
            <span className="blog-detail-chip blog-detail-chip--meta">{doc.meta.words} 字</span>
            {doc.meta.seriesOrder && seriesArticles.length > 0 ? (
              <span className="blog-detail-chip blog-detail-chip--meta">
                系列第 {doc.meta.seriesOrder} 篇 / 共 {seriesArticles.length} 篇
              </span>
            ) : null}
          </div>
          <div className="blog-detail-hero__tags mt-[18px] flex flex-wrap gap-2">
            {(doc.meta.tags || []).map(tag => (
              <span key={tag} className="blog-detail-chip blog-detail-chip--tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="blog-detail-hero__actions mt-6 flex flex-wrap gap-3">
            <Link to="/blog" className="ui-button-secondary ui-button-sm">
              <ArrowLeftOutlined aria-hidden="true" />
              返回文章列表
            </Link>
            {next ? (
              <Link to={articleHref(next.slug)} className="ui-button-primary ui-button-sm">
                <ArrowRightOutlined aria-hidden="true" />
                继续阅读
              </Link>
            ) : null}
          </div>
        </section>

        {seriesArticles.length > 0 ? (
          <section className="blog-detail-series mb-7 rounded-[26px] p-6 max-md:rounded-[22px] max-md:p-5">
            <div className="blog-detail-series__header flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <span className="blog-detail-chip blog-detail-chip--section blog-detail-series__label">
                  <BookOutlined /> 系列阅读
                </span>
                <h2>{doc.meta.seriesTitle}</h2>
                <p>这不是单篇散点内容，而是一条有前后依赖的知识路径。建议按顺序阅读。</p>
              </div>
              <div className="blog-detail-series__progress">
                <strong>{seriesIndex + 1}</strong>
                <span>/ {seriesArticles.length}</span>
              </div>
            </div>
            <div className="blog-detail-series__rail mt-[22px] grid gap-[14px] grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
              {seriesArticles.map((item, index) => {
                const isActive = item.slug === doc.meta.slug
                const isPassed = seriesIndex >= 0 && index < seriesIndex
                return (
                  <Link
                    key={item.slug}
                    to={articleHref(item.slug)}
                    className={clsx(
                      'blog-detail-series__chapter flex min-h-[148px] flex-col gap-2 rounded-[20px] p-[18px] no-underline',
                      isActive && 'is-active',
                      isPassed && 'is-passed'
                    )}
                  >
                    <span className="blog-detail-series__index">
                      {item.seriesOrder || index + 1}
                    </span>
                    <strong>{item.title}</strong>
                    <span>
                      {item.readTime} 分钟 · {item.words} 字
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : null}

        <div className="blog-detail-layout grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_290px]">
          <article className="blog-detail-main min-w-0">
            <div className="blog-detail-body rounded-[28px] p-[34px] max-md:rounded-[22px] max-md:p-5">
              {renderBlocks(blocks)}
            </div>

            {prev || next ? (
              <section className="blog-detail-reading mt-7 rounded-[24px] p-6 max-md:rounded-[22px] max-md:p-5">
                <div className="blog-detail-section-title mb-[18px] inline-flex items-center gap-2">
                  <CompassOutlined />
                  <span>{seriesArticles.length > 0 ? '继续这个系列' : '继续浏览'}</span>
                </div>
                <div className="blog-detail-reading__grid grid grid-cols-1 gap-4 md:grid-cols-2">
                  {prev ? <ReadingCard item={prev} label="上一篇" /> : null}
                  {next ? <ReadingCard item={next} label="下一篇" align="right" /> : null}
                </div>
              </section>
            ) : null}

            {relatedArticles.length > 0 ? (
              <section className="blog-detail-related mt-7 rounded-[24px] p-6 max-md:rounded-[22px] max-md:p-5">
                <div className="blog-detail-section-title mb-[18px] inline-flex items-center gap-2">
                  <CompassOutlined />
                  <span>相关阅读</span>
                </div>
                <div className="blog-detail-related__grid grid grid-cols-1 gap-4 md:grid-cols-2">
                  {relatedArticles.map(item => (
                    <Link
                      key={item.slug}
                      to={articleHref(item.slug)}
                      className="blog-detail-related__item flex flex-col gap-[10px] rounded-[20px] p-[18px] no-underline"
                    >
                      <span className="blog-detail-chip blog-detail-chip--section blog-detail-related__category">
                        {item.category || '精选'}
                      </span>
                      <strong>{item.title}</strong>
                      <p>{item.summary}</p>
                      <span>
                        {item.readTime} 分钟 · {item.words} 字
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="blog-detail-side sticky top-5 max-xl:static">
            <div className="blog-detail-side__panel mb-[18px] rounded-[22px] p-5 max-md:rounded-[22px] max-md:p-5">
              <div className="blog-detail-section-title mb-[18px] inline-flex items-center gap-2">
                <BookOutlined />
                <span>目录</span>
              </div>
              <TOC items={toc} />
            </div>
            {seriesArticles.length > 0 ? (
              <div className="blog-detail-side__panel blog-detail-side__panel--series mb-[18px] rounded-[22px] p-5 max-md:rounded-[22px] max-md:p-5">
                <div className="blog-detail-section-title mb-[18px] inline-flex items-center gap-2">
                  <CompassOutlined />
                  <span>系列定位</span>
                </div>
                <div className="blog-detail-side__series-meta mb-[14px] flex flex-col gap-[6px]">
                  <strong>{doc.meta.seriesTitle}</strong>
                  <span>
                    第 {seriesIndex + 1} 篇 / 共 {seriesArticles.length} 篇
                  </span>
                </div>
                <div className="blog-detail-side__series-list grid gap-[10px]">
                  {seriesArticles.map(item => (
                    <Link
                      key={item.slug}
                      to={articleHref(item.slug)}
                      className={item.slug === doc.meta.slug ? 'is-active' : ''}
                    >
                      {item.seriesOrder || '-'} · {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </ContentWrapper>
  )
}
