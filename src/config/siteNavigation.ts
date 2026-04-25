import type { MainPageId } from '@/data'

export interface SiteRouteMeta {
  label: string
  path: string
  description: string
  pageId?: MainPageId
  exact?: boolean
  showInTopNav?: boolean
}

export interface SiteNavItem {
  label: string
  path: string
  description: string
}

export const SITE_PAGE_ROUTES: SiteRouteMeta[] = [
  {
    label: '博客',
    path: '/blog',
    description: '最新文章与专题阅读',
    pageId: 'blog',
    exact: true,
    showInTopNav: true
  },
  {
    label: '代码',
    path: '/main',
    description: '技术目录与知识索引',
    showInTopNav: true
  },
  {
    label: '规范',
    path: '/standard',
    description: '规范、方法与审美判断',
    pageId: 'standard',
    exact: true,
    showInTopNav: true
  },
  {
    label: '足迹',
    path: '/footmark',
    description: '足迹、实验与空间表达',
    pageId: 'footmark',
    exact: true,
    showInTopNav: true
  },
  {
    label: '关于我',
    path: '/aboutme',
    description: '个人简介、经历与合作方式',
    pageId: 'aboutme',
    exact: true,
    showInTopNav: true
  },
  {
    label: '博客详情',
    path: '/blog-detail',
    description: '博客正文详情页',
    pageId: 'blog-detail',
    exact: true
  },
  {
    label: '简历',
    path: '/resume',
    description: '简历与经历概览',
    pageId: 'resume',
    exact: true
  },
  {
    label: '作品展 Signal',
    path: '/showcase-signal',
    description: 'Signal 作品展示页',
    pageId: 'showcase-signal',
    exact: true
  },
  {
    label: '作品展 Arcade',
    path: '/showcase-arcade',
    description: 'Arcade 作品展示页',
    pageId: 'showcase-arcade',
    exact: true
  },
  {
    label: '作品展 Orbit',
    path: '/showcase-orbit',
    description: 'Orbit 作品展示页',
    pageId: 'showcase-orbit',
    exact: true
  },
  {
    label: '作品展 Vault',
    path: '/showcase-vault',
    description: 'Vault 作品展示页',
    pageId: 'showcase-vault',
    exact: true
  },
  {
    label: 'Fluid Form',
    path: '/fluid-form',
    description: 'Fluid Form 交互实验',
    pageId: 'fluid-form',
    exact: true
  },
  {
    label: 'Digital Garden',
    path: '/digital-garden',
    description: 'Digital Garden 页面',
    pageId: 'digital-garden',
    exact: true
  },
  {
    label: 'Sound Visualizer',
    path: '/sound-visualizer',
    description: '声音可视化实验',
    pageId: 'sound-visualizer',
    exact: true
  },
  {
    label: 'Fractal Cosmos',
    path: '/fractal-cosmos',
    description: '分形宇宙实验页面',
    pageId: 'fractal-cosmos',
    exact: true
  }
]

export const SITE_NAV_ITEMS: SiteNavItem[] = SITE_PAGE_ROUTES.filter(item => item.showInTopNav).map(
  ({ label, path, description }) => ({
    label,
    path,
    description
  })
)
