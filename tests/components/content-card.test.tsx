import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ContentCard from '@/components/content-card'

const mockStore = configureStore({
  reducer: {
    main: (state = { activeMenuItem: null }) => state,
    ui: (state = {}) => state,
    navigation: (state = {}) => state,
    userPreferences: (state = {}) => state
  }
})

describe('ContentCard 组件测试', () => {
  it('应该正确渲染 ContentCard 组件', () => {
    const mockItem = {
      id: '1',
      title: '测试标题',
      description: '测试描述',
      tags: ['React', 'TypeScript'],
      stats: {
        views: 100,
        likes: 10,
        stars: 5
      },
      meta: {
        date: '2024-01-01',
        readTime: 5
      }
    }

    render(
      <Provider store={mockStore}>
        <ContentCard item={mockItem} />
      </Provider>
    )

    expect(screen.getByText('测试标题')).toBeInTheDocument()
  })

  it('应该显示标签', () => {
    const mockItem = {
      id: '1',
      title: '测试标题',
      description: '测试描述',
      tags: ['React', 'TypeScript'],
      stats: {
        views: 100,
        likes: 10,
        stars: 5
      },
      meta: {
        date: '2024-01-01',
        readTime: 5
      }
    }

    render(
      <Provider store={mockStore}>
        <ContentCard item={mockItem} />
      </Provider>
    )

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})
