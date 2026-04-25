import type { SimpleContentItem } from '@/components/simple-content-card'

export const MAIN_HOME_ITEMS: SimpleContentItem[] = [
  {
    id: '1',
    title: 'React Hooks 深度解析',
    description:
      '从零开始深入理解 React Hooks 的原理和最佳实践，包括自定义 Hooks 的开发技巧和性能优化策略。',
    tags: ['React', 'Hooks', 'JavaScript'],
    meta: {
      date: '2024-01-15',
      readTime: 15,
      difficulty: 'intermediate'
    },
    views: 1234
  },
  {
    id: '2',
    title: 'TypeScript 高级类型体操',
    description:
      '通过实际案例深入理解 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等核心概念。',
    tags: ['TypeScript', '类型系统'],
    meta: {
      date: '2024-01-12',
      readTime: 20,
      difficulty: 'advanced'
    },
    views: 987
  },
  {
    id: '3',
    title: '前端性能优化实战',
    description: '深入探讨前端性能优化的各种技术手段，包括代码分割、懒加载、缓存策略等实用技巧。',
    tags: ['Performance', 'Optimization'],
    meta: {
      date: '2024-01-10',
      readTime: 18,
      difficulty: 'intermediate'
    },
    views: 756
  }
]
