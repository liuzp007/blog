import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

const contentDir = path.resolve(process.cwd(), 'src/content')
const outDir = path.resolve(process.cwd(), 'public')

function walk(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) return {}
  const obj = {}
  for (const line of m[1].split(/\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (kv) obj[kv[1]] = kv[2]
  }
  return obj
}

function sanitizeSummary(s) {
  if (!s) return ''
  const trimmed = String(s).trim().replace(/\s+/g, ' ')
  return trimmed.length > 180 ? trimmed.slice(0, 177) + '…' : trimmed
}

const files = walk(contentDir)
const docs = []
for (const file of files) {
  const md = fs.readFileSync(file, 'utf-8')
  const fm = parseFrontmatter(md)
  if (fm.draft === 'true') continue
  const t = (fm.title && String(fm.title)) || path.basename(file, '.md')
  const s = sanitizeSummary(fm.summary || fm.description || '')
  const tagsStr = fm.tags || ''
  const g = Array.isArray(tagsStr)
    ? tagsStr.map((x) => String(x))
    : String(tagsStr)
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
  const u = (fm.slug && String(fm.slug)) || path.basename(file, '.md')
  docs.push({ t, s, g, u })
}

fs.mkdirSync(outDir, { recursive: true })
const jsonPath = path.join(outDir, 'search-index.json')
fs.writeFileSync(jsonPath, JSON.stringify(docs))
const gz = zlib.gzipSync(JSON.stringify(docs), { level: 9 })
const gzPath = path.join(outDir, 'search-index.json.gz')
fs.writeFileSync(gzPath, gz)

const KB50 = 50 * 1024
if (gz.length >= KB50) {
  console.error(`search-index.json.gz too large: ${gz.length} bytes (>= 50KB)`) // eslint-disable-line no-console
  process.exit(1)
}
console.log(`search index generated: ${docs.length} docs, gzip size ${gz.length} bytes`) // eslint-disable-line no-console

