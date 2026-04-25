import contentMeta from './contentMeta.json'

export interface ContentMeta {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
  category?: string
  visualScene?: string
  cover?: string
  draft?: boolean
  featured?: boolean
  series?: string
  seriesTitle?: string
  seriesOrder?: number
  readTime: number
  words: number
}

export interface ContentSeries {
  key: string
  title: string
  category: string
  articles: ContentMeta[]
  count: number
  featured: ContentMeta
  totalWords: number
  tags: string[]
}

export interface ContentMetaRecord extends ContentMeta {
  sourcePath: string
}

function ensureSlug(input?: string): string {
  if (input && input.trim()) return input
  return ''
}

export const metaRecords = (contentMeta as ContentMetaRecord[])
  .map(item => ({
    ...item,
    slug: ensureSlug(item.slug) || item.title.toLowerCase().replace(/\s+/g, '-'),
    tags: Array.isArray(item.tags) ? item.tags : []
  }))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))

export const metaMap = new Map(metaRecords.map(item => [item.slug, item]))

export const allMetas: ContentMeta[] = metaRecords.map(({ sourcePath, ...meta }) => meta)

export const allSeries: ContentSeries[] = Array.from(
  allMetas
    .reduce((map, meta) => {
      if (!meta.series || !meta.seriesTitle) return map
      const current = map.get(meta.series) || []
      current.push(meta)
      map.set(meta.series, current)
      return map
    }, new Map<string, ContentMeta[]>())
    .entries()
)
  .map(([key, articles]) => {
    const ordered = [...articles].sort((a, b) => {
      const orderA = a.seriesOrder ?? Number.MAX_SAFE_INTEGER
      const orderB = b.seriesOrder ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB || b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
    })
    const tags = Array.from(new Set(ordered.flatMap(item => item.tags))).slice(0, 8)
    return {
      key,
      title: ordered[0].seriesTitle || ordered[0].title,
      category: ordered[0].category || '精选',
      articles: ordered,
      count: ordered.length,
      featured: ordered.find(item => item.featured) || ordered[0],
      totalWords: ordered.reduce((sum, item) => sum + item.words, 0),
      tags
    }
  })
  .sort((a, b) => b.featured.date.localeCompare(a.featured.date) || a.title.localeCompare(b.title))

export function getSeriesArticles(series?: string): ContentMeta[] {
  if (!series) return []
  return allSeries.find(item => item.key === series)?.articles || []
}

export function getRelatedArticles(meta: ContentMeta, limit = 3): ContentMeta[] {
  const seriesRelated = getSeriesArticles(meta.series)
    .filter(item => item.slug !== meta.slug)
    .slice(0, limit)
  if (seriesRelated.length >= limit) return seriesRelated

  const extra = allMetas.filter(item => {
    if (item.slug === meta.slug) return false
    if (seriesRelated.some(article => article.slug === item.slug)) return false
    if (item.category && meta.category && item.category === meta.category) return true
    return item.tags.some(tag => meta.tags.includes(tag))
  })

  return [...seriesRelated, ...extra].slice(0, limit)
}
