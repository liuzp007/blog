export interface SearchDoc {
  t: string
  s: string
  g: string[]
  u: string
}
export interface SearchResult {
  slug: string
  score: number
}

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'to',
  'and',
  'or',
  'in',
  'on',
  'for',
  'is',
  'are',
  'with',
  'at',
  'as'
])

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/)
    .map(s => s.trim())
    .filter(s => s.length >= 2 && !STOPWORDS.has(s))
}

export function scoreDoc(doc: SearchDoc, tokens: string[]): number {
  let score = 0
  for (const tk of tokens) {
    if (doc.t.toLowerCase().includes(tk)) score += 3
    if (doc.g.some(t => t.toLowerCase().includes(tk))) score += 2
    if (doc.s.toLowerCase().includes(tk)) score += 1
  }
  return score
}

export function search(index: SearchDoc[], q: string, limit = 20): SearchResult[] {
  const tokens = tokenize(q)
  if (!tokens.length) return []
  const results: SearchResult[] = []
  for (const d of index) {
    const s = scoreDoc(d, tokens)
    if (s > 0) results.push({ slug: d.u, score: s })
  }
  results.sort((a, b) => b.score - a.score)
  return results.slice(0, limit)
}
