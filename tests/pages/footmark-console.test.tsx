import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FootmarkConsole from '@/pages/footmark/components/FootmarkConsole'
import {
  FOOTMARK_CITIES,
  getFootmarkCityById,
  getFootmarkWorksByCityId
} from '@/pages/footmark/footmarkContent'

const renderConsole = ({ cities = FOOTMARK_CITIES, activeCityId = 'origin' } = {}) => {
  const activeCity = getFootmarkCityById(activeCityId)

  if (!activeCity) throw new Error('测试城市不存在')

  const handlers = {
    onChapterChange: vi.fn(),
    onCityChange: vi.fn(),
    onOpenCity: vi.fn()
  }

  const view = render(
    <FootmarkConsole
      cities={cities}
      activeCity={activeCity}
      activeWorks={getFootmarkWorksByCityId(activeCity.id)}
      chapterFilter="all"
      {...handlers}
    />
  )

  return { handlers, view }
}

describe('Footmark Atlas Console', () => {
  it('应渲染城市索引与当前城市档案', () => {
    renderConsole({ activeCityId: 'hangzhou' })

    expect(screen.getByText('经历索引')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /杭州/ })).toBeInTheDocument()
    expect(screen.getAllByText('杭州').length).toBeGreaterThan(1)
    expect(
      screen.getByText((_, element) => element?.tagName === 'DD' && element.textContent === '2 组')
    ).toBeInTheDocument()
  })

  it('应触发章节筛选回调', async () => {
    const { handlers } = renderConsole()

    const selector = screen.getByText('全部章节').closest('.ant-select-selector')
    if (!selector) throw new Error('章节筛选选择器不存在')

    fireEvent.mouseDown(selector)
    const craftLabel = await screen.findByText('Craft / 沉淀')
    const craftOption = craftLabel.closest('.ant-select-item-option')
    if (!craftOption) throw new Error('章节筛选选项不存在')

    fireEvent.mouseMove(craftOption)
    fireEvent.click(craftOption)

    await waitFor(() => {
      expect(handlers.onChapterChange).toHaveBeenCalledWith('craft')
    })
  })

  it('应触发城市切换回调', () => {
    const { handlers } = renderConsole()

    fireEvent.click(screen.getByRole('button', { name: /北京/ }))

    expect(handlers.onCityChange).toHaveBeenCalledWith('beijing')
  })

  it('应打开当前城市档案', () => {
    const { handlers } = renderConsole({ activeCityId: 'taiyuan' })

    fireEvent.click(screen.getByRole('button', { name: '打开城市档案' }))

    expect(handlers.onOpenCity).toHaveBeenCalledWith('taiyuan')
  })
})
