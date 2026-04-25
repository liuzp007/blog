import diagramCover from '@/assets/img/01.png'

export interface FootmarkRoutePoint {
  city: string
  lng: number
  lat: number
}

export interface FootmarkMedia {
  id: string
  type: 'image'
  src: string
  thumbnail?: string
  width?: number
  height?: number
  alt: string
}

export interface FootmarkWork {
  id: string
  cityId: string
  title: string
  shotAt?: string
  description?: string
  tags?: string[]
  mediaIds: string[]
}

export interface FootmarkCity {
  id: string
  slug: string
  name: string
  lng: number
  lat: number
  eyebrow: string
  headline: string
  detail: string
  summary: string
  story: string[]
  tone: 'origin' | 'growth' | 'craft' | 'horizon'
  workIds: string[]
}

export interface FootmarkStoryNode extends FootmarkRoutePoint {
  id: string
  title: string
  eyebrow: string
  detail: string
  tone: 'origin' | 'growth' | 'craft' | 'horizon'
}

const MEDIA_SEED: FootmarkMedia[] = [
  {
    id: 'night-portrait',
    type: 'image',
    src: '/nb.jpeg',
    thumbnail: '/nb.jpeg',
    width: 596,
    height: 842,
    alt: '夜色中的人像与霓虹实验作品'
  },
  {
    id: 'react-diagram',
    type: 'image',
    src: diagramCover,
    thumbnail: diagramCover,
    width: 736,
    height: 800,
    alt: 'React 渲染流程草图'
  },
  {
    id: 'blog-mark',
    type: 'image',
    src: '/blog.png',
    thumbnail: '/blog.png',
    width: 216,
    height: 216,
    alt: 'Blog 标识图形草稿'
  }
]

const WORK_SEED: FootmarkWork[] = [
  {
    id: 'lanxian-roadbook',
    cityId: 'origin',
    title: '出发前的路书草页',
    shotAt: '2016',
    description: '那时候还没有太多器材和经验，先把想去的地方、想拍的角度、想留下的颜色都记在纸上。',
    tags: ['起点', '路书', '手记'],
    mediaIds: ['react-diagram']
  },
  {
    id: 'taiyuan-night-neon',
    cityId: 'taiyuan',
    title: '太原夜色里的霓虹练习',
    shotAt: '2018',
    description: '第一次认真地对着城市的夜色反复试光，开始明白同一条街道也可以有完全不同的气质。',
    tags: ['夜景', '人像', '霓虹'],
    mediaIds: ['night-portrait']
  },
  {
    id: 'changsha-poster-lab',
    cityId: 'changsha',
    title: '长沙街头海报感实验',
    shotAt: '2019',
    description:
      '把街头颜色、店招和人物动作拼成一张更有热度的画面，开始喜欢城市里那种很近的烟火气。',
    tags: ['街头', '色彩', '热度'],
    mediaIds: ['night-portrait', 'blog-mark']
  },
  {
    id: 'hangzhou-structure-notes',
    cityId: 'hangzhou',
    title: '杭州阶段的结构草图',
    shotAt: '2021',
    description:
      '在更强调体验和秩序的环境里，开始把页面结构、交互节奏和视觉表达放在同一张图上审视。',
    tags: ['结构', '体验', '前端'],
    mediaIds: ['react-diagram']
  },
  {
    id: 'hangzhou-brand-frame',
    cityId: 'hangzhou',
    title: '品牌框架初稿',
    shotAt: '2021',
    description: '不是追求复杂，而是练习怎样用更克制的图形语言把一个产品的气质立起来。',
    tags: ['品牌', '图形', '框架'],
    mediaIds: ['blog-mark']
  },
  {
    id: 'shanghai-system-layout',
    cityId: 'shanghai',
    title: '高密度协作下的系统页面草稿',
    shotAt: '2022',
    description: '交付压力让很多设计选择必须更早变成工程判断，也逼着我把创意翻译成更稳定的系统。',
    tags: ['系统', '协作', '交付'],
    mediaIds: ['react-diagram', 'blog-mark']
  },
  {
    id: 'shenzhen-speed-frame',
    cityId: 'shenzhen',
    title: '速度感界面练习',
    shotAt: '2023',
    description:
      '在节奏极快的环境里，很多作品都像边跑边修正的现场，最后留下的是一种更直接的判断力。',
    tags: ['速度', '界面', '迭代'],
    mediaIds: ['night-portrait']
  },
  {
    id: 'beijing-route-archive',
    cityId: 'beijing',
    title: '足迹档案封面',
    shotAt: '2024',
    description: '当城市越来越多，作品开始不只是一张图，而像一套能反复回看的航行记录。',
    tags: ['归档', '城市', '作品集'],
    mediaIds: ['blog-mark', 'night-portrait']
  },
  {
    id: 'beijing-method-note',
    cityId: 'beijing',
    title: '方法论卡片',
    shotAt: '2024',
    description: '最后回看时，最有价值的不是去过哪里，而是那些地方怎样一起塑造了现在的判断与审美。',
    tags: ['方法论', '观察', '记录'],
    mediaIds: ['react-diagram']
  }
]

export const FOOTMARK_CITIES: FootmarkCity[] = [
  {
    id: 'origin',
    slug: 'lanxian',
    name: '岚县',
    lng: 111.795807,
    lat: 38.372999,
    eyebrow: 'Origin / 00',
    headline: '从山间出发，先学会抬头看轨道。',
    detail:
      '起点不一定热闹，但它决定了你如何理解距离。第一段足迹不是奔向远方，而是先建立自己的方向感。',
    summary: '起点更像一张安静的路书，提醒自己别把世界误以为只有眼前这一小块。',
    story: [
      '从县城抬头看天的时候，世界先是被想象出来的。',
      '也是在这里第一次意识到，出去看看不是冲动，而是一种要一直保持的愿望。'
    ],
    tone: 'origin',
    workIds: ['lanxian-roadbook']
  },
  {
    id: 'taiyuan',
    slug: 'taiyuan',
    name: '太原',
    lng: 112.549248,
    lat: 37.857012,
    eyebrow: 'Growth / 01',
    headline: '把半径慢慢拉大，第一次意识到地图会继续展开。',
    detail: '从熟悉的生活尺度走向更大的城市系统，视野和节奏开始被重新校准。',
    summary: '城市密度开始变大，夜色、街景和人群都在提醒你：原来同样的生活还能有别的节奏。',
    story: ['开始试着在夜色里拍人，也试着让画面有更明确的情绪。'],
    tone: 'growth',
    workIds: ['taiyuan-night-neon']
  },
  {
    id: 'changsha',
    slug: 'changsha',
    name: '长沙',
    lng: 112.982279,
    lat: 28.19409,
    eyebrow: 'Growth / 02',
    headline: '向南，进入更热、更快、也更有人味的叙事。',
    detail: '城市的温度感、街道气味和工作节奏一起改变了“做东西”的手感。',
    summary: '长沙让我开始喜欢把作品做得更热一点、更近一点，不再只追求规整和克制。',
    story: ['真正喜欢上街头的温度，是从这座城市开始的。'],
    tone: 'growth',
    workIds: ['changsha-poster-lab']
  },
  {
    id: 'hangzhou',
    slug: 'hangzhou',
    name: '杭州',
    lng: 120.153576,
    lat: 30.287459,
    eyebrow: 'Craft / 03',
    headline: '开始把审美、产品与前端放到同一张桌子上。',
    detail: '在更强调体验和设计密度的环境里，代码不再只是完成任务，而是开始承载表达。',
    summary: '这里像一个分水岭，开始认真地把“怎么做”和“为什么这样做”合在一起思考。',
    story: ['产品、设计和代码第一次真正开始互相影响，而不是各做各的。'],
    tone: 'craft',
    workIds: ['hangzhou-structure-notes', 'hangzhou-brand-frame']
  },
  {
    id: 'shanghai',
    slug: 'shanghai',
    name: '上海',
    lng: 121.473701,
    lat: 31.230416,
    eyebrow: 'Craft / 04',
    headline: '高密度协作让每一次选择都更像工程判断。',
    detail: '系统复杂度、协作压力和交付节奏，把“创意”进一步逼成了可以稳定落地的能力。',
    summary: '在更大的协作系统里，作品开始带上稳定交付的要求，也开始有了更强的系统性。',
    story: ['很多想法都要经得住协作和时间，而不是只在一张图里好看。'],
    tone: 'craft',
    workIds: ['shanghai-system-layout']
  },
  {
    id: 'shenzhen',
    slug: 'shenzhen',
    name: '深圳',
    lng: 114.057963,
    lat: 22.543095,
    eyebrow: 'Horizon / 05',
    headline: '把速度变成肌肉，把试错变成习惯。',
    detail: '在足够快的城市里，很多决策都要边跑边修正；这反而逼出了更直接的创造力。',
    summary: '这座城市让很多作品都带上了“先跑起来”的速度感，也让判断更直接。',
    story: ['在节奏足够快的地方，创意不是想太久，而是边做边校正。'],
    tone: 'horizon',
    workIds: ['shenzhen-speed-frame']
  },
  {
    id: 'beijing',
    slug: 'beijing',
    name: '北京',
    lng: 116.407851,
    lat: 39.904501,
    eyebrow: 'Horizon / 06',
    headline: '最后回头看，地图已经不是地图，而是一条方法论。',
    detail: '当足迹足够多，城市就不再只是经纬度，而是你构建判断、气质和作品的底层坐标系。',
    summary: '当城市被重新串起来，足迹开始像一份持续更新的作品档案，而不是单纯的签到列表。',
    story: [
      '地图上的每一个点，最后都会重新回到作品里。',
      '世界很大，而继续出去看看，已经成了接下来默认要做的事。'
    ],
    tone: 'horizon',
    workIds: ['beijing-route-archive', 'beijing-method-note']
  }
]

const mediaMap = MEDIA_SEED.reduce<Record<string, FootmarkMedia>>((acc, item) => {
  acc[item.id] = item
  return acc
}, {})

const workMap = WORK_SEED.reduce<Record<string, FootmarkWork>>((acc, item) => {
  acc[item.id] = item
  return acc
}, {})

const cityMap = FOOTMARK_CITIES.reduce<Record<string, FootmarkCity>>((acc, item) => {
  acc[item.id] = item
  return acc
}, {})

export const FOOTMARK_MEDIA = MEDIA_SEED
export const FOOTMARK_WORKS = WORK_SEED

export const FOOTMARK_ROUTE_POINTS: FootmarkRoutePoint[] = FOOTMARK_CITIES.map(city => ({
  city: city.name,
  lng: city.lng,
  lat: city.lat
}))

export const FOOTMARK_STORY_NODES: FootmarkStoryNode[] = FOOTMARK_CITIES.map(city => ({
  id: city.id,
  city: city.name,
  lng: city.lng,
  lat: city.lat,
  eyebrow: city.eyebrow,
  title: city.headline,
  detail: city.detail,
  tone: city.tone
}))

export function getFootmarkCityById(cityId: string) {
  return cityMap[cityId]
}

export function getFootmarkWorkById(workId: string) {
  return workMap[workId]
}

export function getFootmarkWorksByCityId(cityId: string) {
  const city = getFootmarkCityById(cityId)
  if (!city) return []
  return city.workIds.map(workId => getFootmarkWorkById(workId)).filter(Boolean) as FootmarkWork[]
}

export function getFootmarkMediaById(mediaId: string) {
  return mediaMap[mediaId]
}

export function getFootmarkMediaByIds(mediaIds: string[]) {
  return mediaIds.map(mediaId => getFootmarkMediaById(mediaId)).filter(Boolean) as FootmarkMedia[]
}
