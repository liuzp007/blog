import { useMemo, useState, useEffect, useCallback } from 'react'
import { ArrowRightOutlined, BookOutlined } from '@ant-design/icons'
import { Select, Pagination, Segmented } from 'antd'
import { Link, useHistory, useLocation } from 'react-router-dom'
import ContentWrapper from '@/components/content-wrapper'
import SectionNav from '@/components/section-nav'
import ArticleCard from '@/features/content/ArticleCard'
import { TimelineList, MagazineMasonry } from '@/features/content/ArticleListAlternatives'
import CategoryBar from '@/features/content/CategoryBar'
import { allMetas, allSeries, type ContentMeta } from '@/features/content/contentIndex'
import InvisibleCardList from '@/features/content/InvisibleCardList'
import TagCloud from '@/features/content/TagCloud'
import SearchBox from '@/features/search/SearchBox'
import { search, type SearchDoc } from '@/features/search/searchClient'
import { parseQuery, stringifyQuery, type QueryState, type SortKey } from '@/utils/query'
import '@/features/content/alternatives.css'
import './index.css'

type ViewMode = 'cards' | 'timeline' | 'magazine' | 'invisible'

// rerender-derived-state-no-effect: 合并搜索状态为单一对象，避免级联 re-render
interface SearchState {
  docs: SearchDoc[]
  loading: boolean
  error: Error | null
}

const INITIAL_SEARCH_STATE: SearchState = { docs: [], loading: false, error: null }

export default function BlogIndex() {
  const history = useHistory()
  const location = useLocation()
  const state = useMemo(() => parseQuery(location.search), [location.search])

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const offset = window.innerWidth <= 768 ? 88 : 108
    const top = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  const metas: ContentMeta[] = allMetas
  const categories = useMemo(
    () => Array.from(new Set(metas.map(m => m.category || m.tags[0] || '未分类'))),
    [metas]
  )

  const [searchState, setSearchState] = useState<SearchState>(INITIAL_SEARCH_STATE)

  useEffect(() => {
    let cancelled = false
    setSearchState(prev => ({ ...prev, loading: true, error: null }))
    fetch('/search-index.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`)
        return r.json()
      })
      .then((data: SearchDoc[]) => {
        if (!cancelled)
          setSearchState({ docs: Array.isArray(data) ? data : [], loading: false, error: null })
      })
      .catch((error: unknown) => {
        const err = error instanceof Error ? error : new Error(String(error))
        if (!cancelled) {
          setSearchState({ docs: [], loading: false, error: err })
          console.error('Failed to load search index:', err)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const index = searchState.docs

  const searchHits = useMemo(() => {
    if (!state.q || !index.length) return null
    return new Set(search(index, state.q, 100).map(item => item.slug))
  }, [index, state.q])

  const filtered = useMemo(() => {
    const bySearch = searchHits ? metas.filter(item => searchHits.has(item.slug)) : metas
    if (!state.tag) return bySearch
    return bySearch.filter(m => {
      const category = m.category || m.tags[0] || '未分类'
      if (category === state.tag) return true
      return m.tags.length ? m.tags.includes(state.tag!) : state.tag === 'untagged'
    })
  }, [metas, searchHits, state.tag])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (state.sort === 'date_asc') return a.date.localeCompare(b.date)
      if (state.sort === 'tag_asc') return (a.tags[0] || '').localeCompare(b.tags[0] || '')
      return b.date.localeCompare(a.date)
    })
  }, [filtered, state.sort])

  const pageList = useMemo(() => {
    const start = (state.page - 1) * state.pageSize
    return sorted.slice(start, start + state.pageSize)
  }, [sorted, state.page, state.pageSize])

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / state.pageSize))
  const [view, setView] = useState<ViewMode>('cards')
  const activeTag = state.tag || '全部文章'
  const heroPicks = useMemo(() => {
    const featured = metas.filter(item => item.featured)
    return (featured.length ? featured : metas).slice(0, 3)
  }, [metas])
  const topCategories = useMemo(() => {
    const map = new Map<string, number>()
    for (let i = 0; i < metas.length; i += 1) {
      const key = metas[i].category || metas[i].tags[0] || '未分类'
      map.set(key, (map.get(key) || 0) + 1)
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [metas])
  const seriesSpotlights = useMemo(() => allSeries.slice(0, 5), [])
  const navItems = useMemo(() => {
    const items = [
      { id: 'overview', label: '概览' },
      { id: 'channels', label: '频道' },
      { id: 'articles', label: '文章' }
    ]

    if (seriesSpotlights.length > 0) {
      items.splice(2, 0, { id: 'series', label: '专题' })
    }

    return items.map(item => ({
      ...item,
      href: `#${item.id}`,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        scrollToSection(item.id)
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}#${item.id}`
        )
      }
    }))
  }, [scrollToSection, seriesSpotlights.length])

  const updateQuery = useCallback(
    (patch: Partial<QueryState>) => {
      const next = { ...state, ...patch }
      history.push({
        pathname: '/blog',
        search: stringifyQuery(next)
      })
    },
    [history, state]
  )

  return (
    <ContentWrapper allowOverflow surface="plain">
      <div className="blog-lab">
        <SectionNav
          className="blog-nav fixed left-[clamp(16px,3vw,48px)] right-[clamp(16px,3vw,48px)] top-4 z-[120] mb-[18px] flex items-center justify-between gap-4 rounded-[18px] px-[18px] py-[14px] max-[1024px]:top-3 max-[1024px]:px-[14px] max-[1024px]:py-3 max-[640px]:top-[10px] max-[640px]:flex-col max-[640px]:items-start max-[640px]:rounded-[14px]"
          homeButtonClassName="blog-nav__logo"
          linksClassName="blog-nav__links flex flex-wrap justify-end gap-3 max-[640px]:w-full max-[640px]:justify-between max-[640px]:gap-x-[14px] max-[640px]:gap-y-[10px]"
          linkButtonClassName="blog-nav__button"
          homeTo="/"
          items={navItems}
        />
        <div className="blog-nav-spacer h-[var(--blog-nav-space)]" aria-hidden="true" />

        <main>
          <section
            id="overview"
            className="blog-lab__hero mb-[18px] overflow-hidden rounded-[18px] p-7 [scroll-margin-top:calc(var(--blog-nav-space)+24px)] max-[640px]:rounded-[14px] max-[640px]:px-4 max-[640px]:py-5"
          >
            <div className="blog-lab__hero-grid relative z-[2] grid items-stretch gap-[18px] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
              <div className="blog-lab__hero-main min-w-0">
                <div className="blog-lab__kicker">FUTURE NEWSROOM</div>
                <h2 className="blog-lab__hero-title ui-display-title">趋势实验室</h2>
                <p className="blog-lab__hero-desc ui-lead-text">
                  把技术文章做成数字杂志，不只是"按时间倒序"的内容堆叠。
                  你可以在这里按主题信号筛选、切换阅读视图，并追踪前端工程实践的趋势波动。
                </p>
                <div className="blog-lab__metrics mt-[18px] grid gap-[10px] min-[641px]:grid-cols-2 lg:grid-cols-4 max-[640px]:grid-cols-1 max-[640px]:gap-2">
                  <div className="blog-lab__metric ui-card ui-card--metric">
                    <span className="blog-lab__metric-label ui-meta-text">总文章</span>
                    <strong className="ui-card-title">{metas.length}</strong>
                  </div>
                  <div className="blog-lab__metric ui-card ui-card--metric">
                    <span className="blog-lab__metric-label ui-meta-text">当前筛选</span>
                    <strong className="ui-card-title">{total}</strong>
                  </div>
                  <div className="blog-lab__metric ui-card ui-card--metric">
                    <span className="blog-lab__metric-label ui-meta-text">活跃频道</span>
                    <strong className="ui-card-title">{activeTag}</strong>
                  </div>
                  <div className="blog-lab__metric ui-card ui-card--metric">
                    <span className="blog-lab__metric-label ui-meta-text">专题系列</span>
                    <strong className="ui-card-title">{allSeries.length}</strong>
                  </div>
                </div>
              </div>
              <aside className="blog-lab__hero-side grid auto-rows-max gap-2 rounded-[14px] p-3">
                <div className="blog-lab__hero-side-title ui-eyebrow">主编推荐</div>
                {heroPicks.map((item, idx) => (
                  <Link
                    key={item.slug}
                    className="blog-lab__pick ui-card ui-card--dense ui-card--interactive"
                    to={`/blog-detail?slug=${encodeURIComponent(item.slug)}`}
                  >
                    <span className="blog-lab__pick-index">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="blog-lab__pick-text">
                      <span className="ui-body-text-strong">{item.title}</span>
                      <small className="ui-meta-text">
                        {item.category || item.tags[0] || '精选'} · {item.date}
                      </small>
                    </span>
                  </Link>
                ))}
              </aside>
            </div>
          </section>

          <section
            id="channels"
            className="blog-lab__signals ui-card ui-card--compact mb-[14px] [scroll-margin-top:calc(var(--blog-nav-space)+24px)]"
          >
            <div className="blog-lab__signals-title ui-eyebrow mb-2">热门频道</div>
            <div className="blog-lab__signal-list flex flex-wrap gap-2">
              {topCategories.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  className={`blog-lab__signal-btn ui-button-secondary ui-button-sm ui-button-pill${state.tag === name ? ' is-active' : ''}`}
                  aria-pressed={state.tag === name}
                  onClick={() => updateQuery({ tag: name, page: 1 })}
                >
                  <span>{name}</span>
                  <em>{count}</em>
                </button>
              ))}
              <button
                type="button"
                className={`blog-lab__signal-btn ui-button-secondary ui-button-sm ui-button-pill${!state.tag ? ' is-active' : ''}`}
                aria-pressed={!state.tag}
                onClick={() => updateQuery({ tag: undefined, page: 1 })}
              >
                <span>全部</span>
                <em>{metas.length}</em>
              </button>
            </div>
          </section>

          {seriesSpotlights.length > 0 ? (
            <section
              id="series"
              className="blog-lab__series ui-card mb-[18px] [scroll-margin-top:calc(var(--blog-nav-space)+24px)]"
            >
              <div className="blog-lab__section-head mb-[14px] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="blog-lab__section-kicker ui-eyebrow">SERIES CIRCUIT</span>
                  <h3 className="blog-lab__section-title ui-section-title">专题航道</h3>
                </div>
                <p className="blog-lab__section-desc ui-lead-text">
                  把 25 篇深度长文组织成 5 条知识路径，按主题顺序阅读，而不是只在时间线上漂流。
                </p>
              </div>
              <div className="blog-lab__series-grid grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] max-[640px]:grid-cols-1">
                {seriesSpotlights.map((series, index) => (
                  <article
                    key={series.key}
                    className={`blog-lab__series-card ui-card ui-card--feature blog-lab__series-card--${index % 5} flex min-h-[250px] flex-col gap-3 max-[640px]:min-h-[220px] max-[640px]:[--ui-card-padding:16px]`}
                  >
                    <div className="blog-lab__series-topline ui-meta-text flex flex-wrap justify-between gap-[10px]">
                      <span>{series.category}</span>
                      <span>{series.count} 篇</span>
                    </div>
                    <h4 className="ui-card-title">{series.title}</h4>
                    <p className="ui-body-text">
                      {series.featured.summary || `围绕 ${series.category} 的连续专题阅读。`}
                    </p>
                    <div className="blog-lab__series-tags flex flex-wrap gap-2">
                      {series.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="blog-lab__series-tag ui-tag ui-tag--sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="blog-lab__series-footer mt-auto grid gap-3">
                      <div className="blog-lab__series-meta ui-meta-text flex flex-wrap justify-between gap-[10px]">
                        <span>
                          <BookOutlined /> {series.totalWords.toLocaleString()} 字
                        </span>
                        <span>起篇：#{series.articles[0]?.seriesOrder || 1}</span>
                      </div>
                      <div className="blog-lab__series-actions flex flex-wrap items-center gap-[10px] max-[640px]:flex-col max-[640px]:items-stretch">
                        <Link
                          to={{
                            pathname: '/blog',
                            search: stringifyQuery({ ...state, tag: series.category, page: 1 })
                          }}
                          className="blog-lab__action blog-lab__action--browse blog-lab__series-link blog-lab__series-link--browse ui-button-ghost ui-button-sm"
                        >
                          浏览专题
                        </Link>
                        <Link
                          to={`/blog-detail?slug=${encodeURIComponent(series.featured.slug)}`}
                          className="blog-lab__action blog-lab__action--feature blog-lab__series-link blog-lab__series-link--feature ui-button-primary ui-button-md"
                        >
                          <span>从推荐篇开始</span>
                          <ArrowRightOutlined aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section
            id="articles"
            className="blog-lab__control-surface ui-card ui-card--compact mb-5 [scroll-margin-top:calc(var(--blog-nav-space)+24px)] max-[640px]:p-3"
          >
            <div className="blog-lab__search mb-3">
              <SearchBox
                value={state.q || ''}
                onSubmit={q => updateQuery({ q: q.trim() || undefined, page: 1 })}
              />
            </div>
            <div className="blog-lab__tags mb-3">
              <TagCloud
                metas={metas}
                activeTag={state.tag}
                onSelect={tag => updateQuery({ tag, page: 1 })}
              />
            </div>
            <div className="blog-lab__categories mb-3">
              <CategoryBar
                categories={categories}
                active={state.tag ? state.tag : '全部文章'}
                onChange={val => {
                  const tag = val === '全部文章' ? undefined : val
                  updateQuery({ tag, page: 1 })
                }}
              />
            </div>
            <div className="blog-lab__toolbar flex flex-wrap items-center justify-between gap-[10px]">
              <div className="blog-lab__status ui-meta-text">
                共 {total} 篇 · 第 {state.page}/{totalPages} 页
              </div>
              <div className="blog-lab__toolbar-right flex flex-wrap items-center gap-[10px] max-[640px]:w-full">
                <Select
                  className="ui-input blog-lab__sort-select"
                  value={state.sort}
                  onChange={val => {
                    updateQuery({ sort: val as SortKey, page: 1 })
                  }}
                  options={[
                    { label: '按日期(新→旧)', value: 'date_desc' },
                    { label: '按日期(旧→新)', value: 'date_asc' },
                    { label: '按标签名', value: 'tag_asc' }
                  ]}
                  style={{ minWidth: 180 }}
                />
                <Segmented
                  value={view}
                  onChange={v => setView(v as ViewMode)}
                  className='blog-segmented'
                  options={[
                    { label: '卡片', value: 'cards' },
                    { label: '时间轴', value: 'timeline' },
                    { label: '拼贴', value: 'magazine' },
                    { label: '隐形', value: 'invisible' }
                  ]}
                />
              </div>
            </div>
          </section>

          {view === 'cards' ? (
            <div className="blog-lab__cards grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))] max-[640px]:grid-cols-1">
              {pageList.map(m => (
                <ArticleCard key={m.slug} meta={m} />
              ))}
            </div>
          ) : view === 'timeline' ? (
            <TimelineList items={pageList} />
          ) : view === 'magazine' ? (
            <MagazineMasonry items={pageList} />
          ) : (
            <InvisibleCardList items={pageList} />
          )}

          <div className="blog-lab__pagination mt-[18px] flex justify-center">
            <Pagination
              current={state.page}
              pageSize={state.pageSize}
              total={total}
              onChange={p => updateQuery({ page: p })}
              showSizeChanger={false}
            />
          </div>

          {filtered.length === 0 && state.q ? (
            <div className="blog-lab__empty mt-[14px] text-center">
              未找到相关内容，试试其他关键词或清空搜索。
            </div>
          ) : null}
        </main>
      </div>
    </ContentWrapper>
  )
}
