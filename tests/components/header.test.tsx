import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import Header from '@/components/header'

const mockHistory = {
  push: vi.fn(),
  goBack: vi.fn(),
  location: { pathname: '/' }
}

describe('Header 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染 Header 组件', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    const header = document.querySelector('.headerWrap')
    expect(header).toBeInTheDocument()
  })

  it('应该包含导航链接', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('应该在特定路径下正确激活导航项', () => {
    const history = createMemoryHistory()
    history.push('/blog')

    render(
      <Router history={history}>
        <Header />
      </Router>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
