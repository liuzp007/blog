import {
  allMetas,
  allSeries,
  getRelatedArticles,
  getSeriesArticles,
  metaMap,
  type ContentMeta,
  type ContentMetaRecord,
  type ContentSeries
} from './contentCatalog'

export interface ContentDoc {
  meta: ContentMeta
  body: string
}

export interface TocItem {
  id: string
  text: string
  level: 1 | 2 | 3
}

export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'link'; text: string; href: string }

export type ContentBlock =
  | { type: 'heading'; id: string; level: 1 | 2 | 3; children: InlineNode[] }
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }

export interface ParsedMarkdown {
  toc: TocItem[]
  blocks: ContentBlock[]
}

const modules = import.meta.glob('../../content/**/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, () => Promise<string>>

function parseFrontmatter(md: string): { meta: Partial<ContentMeta>; body: string } {
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!fmMatch) return { meta: {}, body: md }
  const fm = fmMatch[1]
  const body = md.slice(fmMatch[0].length)
  const meta: Record<string, unknown> = {}
  fm.split(/\n/).forEach(line => {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) return
    const key = m[1]
    let value: unknown = m[2]
    if (typeof value === 'string') {
      // 简单数组: [a,b,c]
      const arr = value.match(/^\[(.*)\]$/)
      if (arr) {
        value = arr[1]
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      } else if (value === 'true' || value === 'false') {
        value = value === 'true'
      } else if (/^-?\d+(\.\d+)?$/.test(value)) {
        value = Number(value)
      }
    }
    meta[key] = value
  })
  return { meta: meta as Partial<ContentMeta>, body }
}

export async function getArticle(slug: string): Promise<ContentDoc | null> {
  const found = metaMap.get(slug)
  if (!found) return null

  const loader = modules[found.sourcePath]
  if (!loader) return null

  const raw = await loader()
  const { body } = parseFrontmatter(raw)
  const { sourcePath, ...meta } = found
  return {
    meta,
    body
  }
}

export { allMetas, allSeries, getRelatedArticles, getSeriesArticles }
export type { ContentMeta, ContentMetaRecord, ContentSeries }

function createHeadingId(text: string): string {
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
  return id || 'section'
}

function getInlinePlainText(nodes: InlineNode[]): string {
  return nodes.map(node => node.text).join('')
}

function normalizeFenceLanguage(language: string): string {
  const normalized = language.trim().toLowerCase()
  if (!normalized) return 'typescript'

  const aliasMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    html: 'markup',
    xml: 'markup',
    svg: 'markup',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    bash: 'bash',
    json: 'json',
    nginx: 'nginx'
  }

  return aliasMap[normalized] || normalized
}

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  const tokenPattern = /(`[^`]+`|\*\*[^*\n]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0

  text.replace(tokenPattern, (token, offset: number) => {
    if (offset > lastIndex) {
      nodes.push({
        type: 'text',
        text: text.slice(lastIndex, offset)
      })
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push({
        type: 'code',
        text: token.slice(1, -1)
      })
    } else if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push({
        type: 'strong',
        text: token.slice(2, -2)
      })
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        nodes.push({
          type: 'link',
          text: linkMatch[1],
          href: linkMatch[2].trim()
        })
      } else {
        nodes.push({
          type: 'text',
          text: token
        })
      }
    }

    lastIndex = offset + token.length
    return token
  })

  if (lastIndex < text.length) {
    nodes.push({
      type: 'text',
      text: text.slice(lastIndex)
    })
  }

  if (!nodes.length) {
    nodes.push({
      type: 'text',
      text
    })
  }

  return nodes
}

function flushParagraph(lines: string[], blocks: ContentBlock[]) {
  if (!lines.length) return
  const text = lines
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ')
    .trim()

  lines.length = 0

  if (!text) return
  blocks.push({
    type: 'paragraph',
    children: parseInline(text)
  })
}

function flushList(
  listState: { ordered: boolean; items: string[] } | null,
  blocks: ContentBlock[]
): null {
  if (!listState || !listState.items.length) return null

  blocks.push({
    type: 'list',
    ordered: listState.ordered,
    items: listState.items.map(item => parseInline(item.trim()))
  })

  return null
}

// 极简 markdown → 受控块结构，避免直接拼接 HTML 注入 DOM。
export function parseMarkdown(md: string): ParsedMarkdown {
  const lines = md.split(/\r?\n/)
  const toc: TocItem[] = []
  const blocks: ContentBlock[] = []
  let inCode = false
  let codeLines: string[] = []
  let codeLanguage = 'typescript'
  const paragraphLines: string[] = []
  let listState: { ordered: boolean; items: string[] } | null = null

  for (const line of lines) {
    const fenceMatch = line.match(/^```([A-Za-z0-9_-]+)?\s*$/)
    if (fenceMatch) {
      flushParagraph(paragraphLines, blocks)
      listState = flushList(listState, blocks)

      if (inCode) {
        blocks.push({
          type: 'code',
          language: normalizeFenceLanguage(codeLanguage),
          code: codeLines.join('\n')
        })
        codeLanguage = 'typescript'
        codeLines = []
      } else {
        codeLanguage = fenceMatch[1] || 'typescript'
      }
      inCode = !inCode
      continue
    }

    if (inCode) {
      codeLines.push(line)
      continue
    }

    if (!line.trim()) {
      flushParagraph(paragraphLines, blocks)
      listState = flushList(listState, blocks)
      continue
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/)
    if (headingMatch) {
      flushParagraph(paragraphLines, blocks)
      listState = flushList(listState, blocks)

      const level = headingMatch[1].length as 1 | 2 | 3
      const children = parseInline(headingMatch[2].trim())
      const plainText = getInlinePlainText(children).trim()
      const id = createHeadingId(plainText)
      toc.push({ id, text: plainText, level })
      blocks.push({
        type: 'heading',
        id,
        level,
        children
      })
      continue
    }

    const listMatch = line.match(/^(\d+\.|[-*])\s+(.*)$/)
    if (listMatch) {
      flushParagraph(paragraphLines, blocks)

      const ordered = /\d+\./.test(listMatch[1])
      if (!listState || listState.ordered !== ordered) {
        listState = flushList(listState, blocks)
        listState = {
          ordered,
          items: []
        }
      }

      listState.items.push(listMatch[2])
      continue
    }

    if (listState) {
      listState = flushList(listState, blocks)
    }

    paragraphLines.push(line)
  }

  if (inCode) {
    blocks.push({
      type: 'code',
      language: normalizeFenceLanguage(codeLanguage),
      code: codeLines.join('\n')
    })
  }

  flushParagraph(paragraphLines, blocks)
  flushList(listState, blocks)

  return { toc, blocks }
}

export default {}
