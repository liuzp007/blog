export type SortKey = 'date_desc' | 'date_asc' | 'tag_asc'

const VALID_SORT_KEYS = new Set<SortKey>(['date_desc', 'date_asc', 'tag_asc'])

export interface QueryState {
  q?: string
  tag?: string
  page: number
  pageSize: number
  sort: SortKey
}

const DEFAULTS: QueryState = {
  page: 1,
  pageSize: 10,
  sort: 'date_desc'
}

function parseSearchPart(input: string): URLSearchParams {
  const i = input.indexOf('?')
  const query = i >= 0 ? input.slice(i + 1) : input
  return new URLSearchParams(query)
}

export function parseQuery(input: string): QueryState {
  const sp = parseSearchPart(input)
  const page = Math.max(1, Number(sp.get('page') || DEFAULTS.page))
  const pageSize = Math.max(1, Number(sp.get('pageSize') || DEFAULTS.pageSize))
  const sortParam = (sp.get('sort') || DEFAULTS.sort) as SortKey
  const sort: SortKey = VALID_SORT_KEYS.has(sortParam) ? sortParam : DEFAULTS.sort
  const q = sp.get('q') || undefined
  const tag = sp.get('tag') || undefined

  return { q, tag, page, pageSize, sort }
}

export function getQueryParam(input: string, key: string): string | undefined {
  const sp = parseSearchPart(input)
  const value = sp.get(key)
  return value || undefined
}

export function stringifyQuery(state: QueryState): string {
  const sp = new URLSearchParams()
  if (state.q && state.q.trim()) sp.set('q', state.q.trim())
  if (state.tag && state.tag.trim()) sp.set('tag', state.tag.trim())
  if (state.page !== DEFAULTS.page) sp.set('page', String(state.page))
  if (state.pageSize !== DEFAULTS.pageSize) sp.set('pageSize', String(state.pageSize))
  if (state.sort !== DEFAULTS.sort) sp.set('sort', state.sort)
  const s = sp.toString()
  return s ? `?${s}` : ''
}

export function getCurrentQuery(): QueryState {
  return parseQuery(window.location.search)
}

export function replacePathWithQuery(path: string, state: QueryState): void {
  const qs = stringifyQuery(state)
  const target = `${path}${qs}`
  const current = `${window.location.pathname}${window.location.search}`
  if (current !== target) {
    window.history.replaceState(null, '', target)
  }
}
