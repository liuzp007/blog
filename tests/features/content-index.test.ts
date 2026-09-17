import { describe, expect, it } from 'vitest'
import { parseMarkdown } from '@/features/content/contentIndex'

describe('parseMarkdown', () => {
  it('parses tables with inline nodes', () => {
    const result = parseMarkdown(`| 特性 | Hook |
| --- | --- |
| 执行时机 | \`useLayoutEffect\` |
`)

    expect(result.blocks).toEqual([
      {
        type: 'table',
        header: [[{ type: 'text', text: '特性' }], [{ type: 'text', text: 'Hook' }]],
        rows: [
          [
            [{ type: 'text', text: '执行时机' }],
            [{ type: 'code', text: 'useLayoutEffect' }]
          ]
        ]
      }
    ])
  })

  it('keeps normal paragraph pipes when no divider follows', () => {
    const result = parseMarkdown('A | B\nC')

    expect(result.blocks).toHaveLength(1)
    expect(result.blocks[0].type).toBe('paragraph')
  })

  it('parses images with alt text and title', () => {
    const result = parseMarkdown('![React 渲染流程图](@/assets/img/01.png "渲染流程")')

    expect(result.blocks).toEqual([
      { type: 'image', alt: 'React 渲染流程图', src: '@/assets/img/01.png', title: '渲染流程' }
    ])
  })
})
