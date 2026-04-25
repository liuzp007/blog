import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Home from '@/pages/home'
import { usePerformanceTier } from '@/hooks/usePerformanceTier'

let mockTier: 'low' | 'medium' | 'high' = 'high'
vi.mock('@/hooks/usePerformanceTier', () => ({
  usePerformanceTier: () => mockTier
}))

vi.mock('@/hooks/useIdleMount', () => ({
  useIdleMount: () => true
}))

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
    { slug: 'test-1', title: 'Test Article 1', featured: true },
    { slug: 'test-2', title: 'Test Article 2', featured: true }
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

const mockHistory = { push: vi.fn(), goBack: vi.fn(), location: { pathname: '/' } }

describe('Home Smoke Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTier = 'high'
  })

  it('首屏关键内容可见', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Home history={mockHistory as any} />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('探索')).toBeInTheDocument()
    expect(screen.getByText('无限的代码')).toBeInTheDocument()
    expect(screen.getByText('宇宙')).toBeInTheDocument()
    expect(screen.getByText('阅读最新文章')).toBeInTheDocument()
  })

  it('所有主要 section 可渲染', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Home history={mockHistory as any} />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getAllByText('实验工坊').length).toBeGreaterThan(0)
    expect(screen.getByText('精选文章信号源')).toBeInTheDocument()
    expect(screen.getAllByText('互动演示').length).toBeGreaterThan(0)
    expect(screen.getByText('来聊聊')).toBeInTheDocument()
  })

  it('低端设备不加载 FX 层', () => {
    mockTier = 'low'

    const { unmount } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Home history={mockHistory as any} />
        </MemoryRouter>
      </Provider>
    )

    const heroFx = screen.queryByTestId('hero-fx')
    expect(heroFx).toHaveAttribute('data-enabled', 'false')

    unmount()
  })
})
