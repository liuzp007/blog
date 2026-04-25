import fs from 'fs'
import path from 'path'

const contentDir = path.resolve(process.cwd(), 'src/content')
const base = process.env.SITE_ORIGIN || 'https://example.com'

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
const urls = files
  .map((p) => {
    const md = fs.readFileSync(p, 'utf-8')
    const fm = parseFrontmatter(md)
    if (fm.draft === 'true') return null
    const slug = (fm.slug && String(fm.slug)) || path.basename(p, '.md')
    const date = (fm.date && String(fm.date)) || new Date().toISOString().slice(0, 10)
    return { loc: `${base}/blog-detail?slug=${encodeURIComponent(slug)}`, lastmod: date }
  })
  .filter(Boolean)

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`)
  .join('\n')}\n</urlset>`

const outDir = path.resolve(process.cwd(), 'public')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml)
console.log('sitemap.xml generated:', urls.length)
