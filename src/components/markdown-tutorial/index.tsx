import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import {
  getArticle,
  parseMarkdown,
  resolveContentAsset,
  type ContentBlock,
  type ContentDoc,
  type InlineNode
} from '@/features/content/contentIndex'

interface MarkdownTutorialProps {
  slug: string
  className?: string
}

const RE_SCHEME = /^([A-Za-z][A-Za-z\d+\-.]*):/
const RE_EXTERNAL_LINK = /^https?:\/\//i

function getSafeHref(href: string): string | null {
  const value = href.trim()
  if (!value || value.startsWith('//')) return null

  const schemeMatch = value.match(RE_SCHEME)
  if (!schemeMatch) return value

  const scheme = schemeMatch[1].toLowerCase()
  return scheme === 'http' || scheme === 'https' || scheme === 'mailto' ? value : null
}

function renderInline(nodes: InlineNode[], keyPrefix: string): ReactNode {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`

    if (node.type === 'code') return <code key={key}>{node.text}</code>
    if (node.type === 'strong') return <strong key={key}>{node.text}</strong>

    if (node.type === 'link') {
      const safeHref = getSafeHref(node.href)
      if (!safeHref) return <Fragment key={key}>{node.text}</Fragment>
      const isExternal = RE_EXTERNAL_LINK.test(safeHref)
      return (
        <a
          key={key}
          href={safeHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          {node.text}
        </a>
      )
    }

    return <Fragment key={key}>{node.text}</Fragment>
  })
}

function MarkdownBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="markdown-tutorial">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`

        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h1' : block.level === 2 ? 'h2' : 'h3'
          return (
            <Tag key={key} id={block.id}>
              {renderInline(block.children, key)}
            </Tag>
          )
        }

        if (block.type === 'paragraph') {
          return <p key={key}>{renderInline(block.children, key)}</p>
        }

        if (block.type === 'code') {
          return (
            <pre key={key} data-language={block.language}>
              <code>{block.code}</code>
            </pre>
          )
        }

        if (block.type === 'table') {
          return (
            <div key={key} className="markdown-table-wrap">
              <table>
                <thead>
                  <tr>
                    {block.header.map((cell, cellIndex) => (
                      <th key={`${key}-head-${cellIndex}`}>
                        {renderInline(cell, `${key}-head-${cellIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${key}-row-${rowIndex}-${cellIndex}`}>
                          {renderInline(cell, `${key}-row-${rowIndex}-${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (block.type === 'image') {
          return (
            <img
              key={key}
              src={resolveContentAsset(block.src)}
              alt={block.alt}
              title={block.title}
              className="markdown-image"
            />
          )
        }

        const ListTag = block.ordered ? 'ol' : 'ul'
        return (
          <ListTag key={key}>
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
            ))}
          </ListTag>
        )
      })}
    </div>
  )
}

export default function MarkdownTutorial({ slug, className = '' }: MarkdownTutorialProps) {
  const [doc, setDoc] = useState<ContentDoc | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const data = await getArticle(slug)
        if (!active) return
        if (!data) throw new Error(`未找到内容：${slug}`)
        setDoc(data)
        setError(null)
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : '内容加载失败')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [slug])

  const blocks = useMemo(() => (doc ? parseMarkdown(doc.body).blocks : []), [doc])

  return (
    <ContentWrapper
      className={`code-page ${className}`.trim()}
      title={doc?.meta.title}
      subtitle={doc?.meta.summary}
      loading={loading}
      error={error}
    >
      <MarkdownBlocks blocks={blocks} />
    </ContentWrapper>
  )
}
