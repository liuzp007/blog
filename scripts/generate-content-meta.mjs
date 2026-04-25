import fs from 'fs'
import path from 'path'

const contentDir = path.resolve(process.cwd(), 'src/content')
const outFile = path.resolve(process.cwd(), 'src/features/content/contentMeta.json')

function walk(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name)
    const stat = fs.statSync(file)
    if (stat.isDirectory()) out.push(...walk(file))
    else if (name.endsWith('.md')) out.push(file)
  }
  return out
}

function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { meta: {}, body: md }

  const meta = {}
  for (const line of match[1].split(/\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1]
    let value = kv[2]
    const arrayLike = value.match(/^\[(.*)\]$/)
    if (arrayLike) {
      value = arrayLike[1]
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    } else if (value === 'true' || value === 'false') {
      value = value === 'true'
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      value = Number(value)
    }
    meta[key] = value
  }

  return {
    meta,
    body: md.slice(match[0].length),
  }
}

function inferCategory(file, tags) {
  const normalized = path.relative(contentDir, file).replace(/\\/g, '/')
  const segments = normalized.split('/').filter(Boolean)
  if (segments.length > 1) return segments[0]
  if (tags.length) return tags[0]
  return '精选'
}

function estimateWordsAndTime(text) {
  const plain = text.replace(/```[\s\S]*?```/g, ' ').replace(/\s+/g, ' ').trim()
  const zhCount = (plain.match(/[\u4e00-\u9fa5]/g) || []).length
  const enWords = (plain.match(/[A-Za-z0-9_\-]+/g) || []).length
  const words = Math.max(zhCount, enWords)
  const minutesFromZh = Math.ceil(zhCount / 300)
  const minutesFromEn = Math.ceil(enWords / 180)
  const readTime = Math.max(1, Math.max(minutesFromZh, minutesFromEn))
  return { words, readTime }
}

const files = walk(contentDir)
const docs = files
  .map((file) => {
    const raw = fs.readFileSync(file, 'utf-8')
    const { meta, body } = parseFrontmatter(raw)
    if (meta.draft === true) return null

    const title = String(meta.title || path.basename(file, '.md'))
    const slug = String(meta.slug || title.toLowerCase().replace(/\s+/g, '-'))
    const tags = Array.isArray(meta.tags) ? meta.tags.map((item) => String(item)) : []
    const category = String(meta.category || inferCategory(file, tags))
    const { words, readTime } = estimateWordsAndTime(body)
    const sourcePath = `../../content/${path.relative(contentDir, file).replace(/\\/g, '/')}`

    return {
      slug,
      title,
      summary: String(meta.summary || ''),
      date: String(meta.date || new Date().toISOString().slice(0, 10)),
      tags,
      category,
      visualScene: meta.visualScene ? String(meta.visualScene) : undefined,
      cover: meta.cover ? String(meta.cover) : undefined,
      draft: false,
      featured: Boolean(meta.featured),
      series: meta.series ? String(meta.series) : undefined,
      seriesTitle: meta.seriesTitle ? String(meta.seriesTitle) : undefined,
      seriesOrder: typeof meta.seriesOrder === 'number' ? meta.seriesOrder : undefined,
      readTime,
      words,
      sourcePath,
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, `${JSON.stringify(docs, null, 2)}\n`)
console.log(`content meta generated: ${docs.length} docs`) // eslint-disable-line no-console
