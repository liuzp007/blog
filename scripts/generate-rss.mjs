import fs from 'fs'
import path from 'path'

const contentDir = path.resolve(process.cwd(), 'src/content')
const site = process.env.SITE_ORIGIN || 'https://example.com'
const title = 'My Blog'
const description = 'Personal blog feed'

function walk(dir) {
  const res = []
  if (!fs.existsSync(dir)) return res
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) res.push(...walk(p))
    else if (f.endsWith('.md')) res.push(p)
  }
  return res
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) return {}
  const obj = {}
  m[1].split(/\n/).forEach((l) => {
    const kv = l.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (kv) obj[kv[1]] = kv[2]
  })
  return obj
}

const files = walk(contentDir)
const items = files.map((p) => {
  const md = fs.readFileSync(p, 'utf-8')
  const fm = parseFrontmatter(md)
  if (fm.draft === 'true') return null
  const slug = (fm.slug && String(fm.slug)) || path.basename(p, '.md')
  const link = `${site}/blog-detail?slug=${encodeURIComponent(slug)}`
  const date = (fm.date && String(fm.date)) || new Date().toISOString()
  const t = (fm.title && String(fm.title)) || slug
  const desc = (fm.summary && String(fm.summary)) || ''
  return { link, date, t, desc }
}).filter(Boolean)

const rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n<title>${title}</title>\n<link>${site}</link>\n<description>${description}</description>\n${items.map(i => `<item><title>${i.t}</title><link>${i.link}</link><pubDate>${i.date}</pubDate><description>${i.desc}</description></item>`).join('\n')}\n</channel>\n</rss>`

const outDir = path.resolve(process.cwd(), 'public')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'rss.xml'), rss)
console.log('rss.xml generated:', items.length)
