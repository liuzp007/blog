import fs from 'fs'
import path from 'path'

const contentDir = path.resolve(process.cwd(), 'src/content')

function walk(dir) {
  const res = []
  if (!fs.existsSync(dir)) return res
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const st = fs.statSync(p)
    if (st.isDirectory()) res.push(...walk(p))
    else if (f.endsWith('.md')) res.push(p)
  }
  return res
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

const files = walk(contentDir)
const slugs = new Set()
const errors = []

for (const f of files) {
  const md = fs.readFileSync(f, 'utf-8')
  const fm = parseFrontmatter(md)
  const title = fm.title && String(fm.title).trim()
  const slug = (fm.slug && String(fm.slug).trim()) || path.basename(f, '.md')
  const date = fm.date && String(fm.date).trim()
  const tags = fm.tags

  if (!title) errors.push(`${f}: 缺少 title`)
  if (!slug) errors.push(`${f}: 缺少 slug`)
  if (!/^[a-z0-9\-]+$/.test(slug)) errors.push(`${f}: slug 仅允许小写字母/数字/连字符`)
  const t = Date.parse(date || '')
  if (!date || Number.isNaN(t)) errors.push(`${f}: 日期格式无效，应为 YYYY-MM-DD 或 ISO`)
  if (t > Date.now() + 24 * 60 * 60 * 1000) errors.push(`${f}: 日期不应超出未来`)
  if (slugs.has(slug)) errors.push(`${f}: slug 与其他文章重复: ${slug}`)
  slugs.add(slug)
}

if (errors.length) {
  console.error('内容校验失败：')
  for (const e of errors) console.error(' -', e)
  process.exit(1)
} else {
  console.log(`内容校验通过，共 ${files.length} 篇`)
}

