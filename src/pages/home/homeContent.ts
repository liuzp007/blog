export interface HomeExperimentCard {
  eyebrow: string
  title: string
  desc: string
  tech: string[]
  stat: string
  path: string
  accent: 'gold' | 'cyan' | 'coral' | 'mint'
}

export interface HomeShowcaseCard {
  eyebrow: string
  title: string
  desc: string
  tech: string[]
  mode: string
  path: string
  accent: 'gold' | 'cyan' | 'coral' | 'mint'
}

export interface HomeTimelineItem {
  year: string
  title: string
  desc: string
}

export interface HomeActionLink {
  label: string
  desc: string
  path: string
}

export const HOME_EXPERIMENTS: HomeExperimentCard[] = [
  {
    eyebrow: '空间',
    title: '3D 足迹宇宙',
    desc: '把空间叙事、地理场景和太阳系切换放进一个连续体验里，作为首页之外最完整的沉浸式实验入口。',
    tech: ['Three.js', 'R3F', 'Map'],
    stat: '足迹 / 3D',
    path: '/footmark',
    accent: 'gold'
  },
  {
    eyebrow: '图谱',
    title: '代码专题地图',
    desc: '把技术主题、案例和知识索引整理成一张更清楚的地图，方便你按主题继续往下逛。',
    tech: ['React', '内容系统', '索引'],
    stat: '代码 / 主站',
    path: '/main',
    accent: 'cyan'
  },
  {
    eyebrow: '身份',
    title: '关于我与合作',
    desc: '把个人经历、能力方向和合作方式整理成一页更完整的介绍，也保留了 PDF 简历入口。',
    tech: ['简历', '展示', '叙事'],
    stat: '关于 / 合作',
    path: '/aboutme',
    accent: 'coral'
  },
  {
    eyebrow: '系统',
    title: '表达规范',
    desc: '把我做内容、写代码和协作时的一些标准放在这里，方便你快速理解我的做事方式。',
    tech: ['规范', '表达', '规则'],
    stat: '规范 / 规则',
    path: '/standard',
    accent: 'mint'
  }
]

export const HOME_TIMELINE: HomeTimelineItem[] = [
  {
    year: '2020',
    title: '入行前端开发',
    desc: '从中教云迪起步，参与从 0 到 1 构建教育科技产品体系，主导 React + TypeScript 技术选型，服务用户从 0 增长到十万级。'
  },
  {
    year: '2022',
    title: '金融科技与 3D 可视化',
    desc: '加入 Gate.io 全球交易所，带领 5 人前端小组，主导平台首页重构和千万级交易数据可视化，首次将 Three.js 引入生产项目。'
  },
  {
    year: '2023',
    title: '微前端与跨端架构',
    desc: '加入小米团队，主导分销通微前端架构落地（10+ 异构系统集成）和 React Native 跨端 APP 开发，覆盖全球 3000+ 分销商。'
  },
  {
    year: '2025',
    title: '工程化深耕',
    desc: '持续打磨构建优化、组件库设计和性能调优，将 Vite 构建时间从 15 分钟降至 3 分钟，累计主导 4 个中大型项目落地。'
  },
  {
    year: '2026',
    title: 'AI 辅助研发',
    desc: '深度融入 Cursor、Copilot 等 AI 工具到日常工作流，探索代码生成、自动化测试与 CR 提效的新范式。'
  }
]

export const HOME_SHOWCASES: HomeShowcaseCard[] = [
  {
    eyebrow: '棱镜',
    title: '霓虹棱镜',
    desc: '拖动棱镜改变激光折射角度，在倒计时里点亮 5 颗浮空水晶，越快完成连击越高。',
    tech: ['激光', '点亮', '限时'],
    mode: '折射小游戏',
    path: '/showcase-signal',
    accent: 'gold'
  },
  {
    eyebrow: '街机',
    title: '蒸汽波记忆',
    desc: '把蒸汽波落日、玻璃卡面和翻牌挑战放在同一页里，再补上扫频预览、连击计分和收官反馈。',
    tech: ['翻牌', '扫频', '连击'],
    mode: '复古记忆局',
    path: '/showcase-arcade',
    accent: 'cyan'
  },
  {
    eyebrow: '弹弓',
    title: '引力弹弓',
    desc: '拖拽发射彗星，借行星引力转向，在有限推进次数里连续穿过三道光环。',
    tech: ['轨迹', '重力', '发射'],
    mode: '空间闯关',
    path: '/showcase-orbit',
    accent: 'coral'
  },
  {
    eyebrow: '声呐',
    title: '深海声呐',
    desc: '点击或长按海域发出声呐脉冲，在有限能量里找出遗迹、生物群和信标的位置。',
    tech: ['探索', '回波', '搜索'],
    mode: '深海探索',
    path: '/showcase-vault',
    accent: 'mint'
  }
]

export const HOME_CONTACT_ACTIONS: HomeActionLink[] = [
  {
    label: '进入博客',
    desc: '看最新长文与专题内容',
    path: '/blog'
  },
  {
    label: '浏览代码',
    desc: '查看技术目录与知识索引',
    path: '/main'
  },
  {
    label: '关于我',
    desc: '了解经历、能力与合作方式',
    path: '/aboutme'
  },
  {
    label: '探索足迹',
    desc: '体验空间实验与 3D 场景',
    path: '/footmark'
  }
]
