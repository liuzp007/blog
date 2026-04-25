import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Home from '@/pages/home'

// Mock dependencies
vi.mock('@/pages/home/components/LineDog', () => ({
  default: () => <div data-testid="line-dog">LineDog</div>
}))

vi.mock('@/pages/home/components/SignalWaveOverlay', () => ({
  default: ({ enabled }: { enabled: boolean }) => (
    <div data-testid="signal-wave" data-enabled={enabled}>
      SignalWaveOverlay
    </div>
  )
}))

vi.mock('@/pages/home/components/HeroCore', () => ({
  default: () => <div data-testid="hero-core">HeroCore</div>
}))

vi.mock('@/hooks/usePerformanceTier', () => ({
  usePerformanceTier: () => 'high'
}))

vi.mock('@/hooks/useIdleMount', () => ({
  useIdleMount: () => true
}))

vi.mock('@/pages/home/components/HomeHeroFx', () => ({
  default: ({ enabled }: { enabled: boolean }) => (
    <div data-testid="hero-fx" data-enabled={enabled}>
      HomeHeroFx
    </div>
  )
}))

vi.mock('@/pages/home/components/HomeInteractiveDemo', () => ({
  default: () => <div data-testid="interactive-demo">HomeInteractiveDemo</div>
}))

vi.mock('@/components/ui/tilt-card', () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} data-testid="tilt-card">
      {children}
    </button>
  )
}))

vi.mock('@/features/content/contentCatalog', () => ({
  allMetas: [
    {
      slug: 'test-1',
      title: 'Test Article 1',
      featured: true
    },
    {
      slug: 'test-2',
      title: 'Test Article 2',
      featured: true
    }
  ],
  allSeries: ['React', 'TypeScript']
}))

vi.mock('@/features/content/ArticleSignalMediaCard', () => ({
  default: ({ item }: { item: any }) => <div data-testid={`article-${item.slug}`}>{item.title}</div>
}))

vi.mock('@/pages/home/homeContent', () => ({
  HOME_CONTACT_ACTIONS: [{ label: 'Github', desc: '查看我的开源项目', path: '/github' }],
  HOME_EXPERIMENTS: [
    {
      title: '实验1',
      desc: '描述',
      tech: ['React'],
      eyebrow: '前端',
      accent: 'cyan',
      stat: '1个项目',
      path: '/exp1'
    }
  ],
  HOME_SHOWCASES: [
    {
      title: '展示1',
      desc: '描述',
      tech: ['Three.js'],
      eyebrow: '3D',
      accent: 'gold',
      mode: '沉浸式',
      path: '/showcase1'
    }
  ],
  HOME_TIMELINE: [{ year: '2024', title: '开始', desc: '开始写代码' }]
}))

const mockStore = configureStore({
  reducer: {
    main: (state = { menu: [], selectedKeys: [], openKeys: [], loading: false, error: null }) =>
      state,
    ui: (state = {}) => state,
    navigation: (state = {}) => state,
    userPreferences: (state = {}) => state
  }
})

const mockHistory = {
  push: vi.fn(),
  goBack: vi.fn(),
  location: { pathname: '/' }
}

const renderHome = () => {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <Home history={mockHistory as any} />
      </MemoryRouter>
    </Provider>
  )
}

describe('Home 首页组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染首页', () => {
    renderHome()
    expect(screen.getByText('探索')).toBeInTheDocument()
    expect(screen.getByText('无限的代码')).toBeInTheDocument()
    expect(screen.getByText('宇宙')).toBeInTheDocument()
  })

  it('应该渲染所有主要部分', () => {
    renderHome()

    expect(screen.getByText('Hello world')).toBeInTheDocument()
    expect(screen.getByText('精选文章信号源')).toBeInTheDocument()
    expect(screen.getAllByText('实验工坊').length).toBeGreaterThan(0)
    expect(screen.getAllByText('作品展').length).toBeGreaterThan(0)
    expect(screen.getAllByText('互动演示').length).toBeGreaterThan(0)
    expect(screen.getAllByText('成长轨迹').length).toBeGreaterThan(0)
    expect(screen.getByText('来聊聊')).toBeInTheDocument()
  })

  it('应该显示导航按钮', () => {
    renderHome()

    const navButtons = screen.getAllByRole('button')
    expect(navButtons.length).toBeGreaterThan(0)

    expect(screen.getByText('阅读最新文章')).toBeInTheDocument()
    expect(screen.getByText('进入作品展')).toBeInTheDocument()
  })

  it('应该渲染LineDog组件', () => {
    renderHome()
    expect(screen.getByTestId('line-dog')).toBeInTheDocument()
  })

  it('应该渲染HomeHeroFx组件', () => {
    renderHome()
    expect(screen.getByTestId('hero-fx')).toBeInTheDocument()
  })

  it('应该渲染文章卡片', () => {
    renderHome()
    expect(screen.getByTestId('article-test-1')).toBeInTheDocument()
    expect(screen.getByTestId('article-test-2')).toBeInTheDocument()
  })

  it('应该渲染实验卡片', () => {
    renderHome()
    expect(screen.getByText('实验1')).toBeInTheDocument()
  })

  it('应该渲染展示卡片', () => {
    renderHome()
    expect(screen.getByText('展示1')).toBeInTheDocument()
  })

  it('应该渲染时间线', () => {
    renderHome()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('开始')).toBeInTheDocument()
  })

  it('应该渲染联系表单', () => {
    renderHome()
    expect(screen.getByText('给我留言')).toBeInTheDocument()
    expect(screen.getByLabelText('姓名')).toBeInTheDocument()
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('想说的话...')).toBeInTheDocument()
  })

  it('应该点击导航按钮调用history.push', async () => {
    renderHome()

    const blogButton = screen.getByText('阅读最新文章')
    fireEvent.click(blogButton)

    await waitFor(() => {
      expect(mockHistory.push).toHaveBeenCalledWith('/blog')
    })
  })

  it('应该渲染页脚', () => {
    renderHome()
    expect(screen.getAllByText('信号站').length).toBeGreaterThan(0)
  })
})
