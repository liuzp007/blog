import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 拥有丰富的生态系统
    包括官方工具库、UI 框架、状态管理等`,
  2: `// 官方核心工具

// 1. Vue Router - 路由管理
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history', // or 'hash'
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/user/:id', component: User }
  ]
})

new Vue({ router }).$mount('#app')

// 编程式导航
this.$router.push('/about')
this.$router.replace('/home')
this.$router.go(-1)

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

// 2. Vuex - 状态管理
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) { state.count++ }
  },
  actions: {
    async fetchData({ commit }) {
      const data = await api.fetch()
      commit('SET_DATA', data)
    }
  }
})

new Vue({ store }).$mount('#app')`,

  3: `// 3. Vue DevTools - 开发调试

// 浏览器扩展
// • Chrome: Vue.js devtools
// • Firefox: Vue.js devtools
// • Edge: Vue.js devtools

// 功能特性
// • 组件树查看
// • Vuex 状态查看
// • 路由状态查看
// • 性能分析
// • 事件追踪
// • 时间旅行调试

// 生产环境禁用
if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false
}

// 4. Vue CLI - 项目脚手架
// 安装
npm install -g @vue/cli

// 创建项目
vue create my-project
vue ui  // 图形化界面

// 插件系统
// • @vue/cli-plugin-eslint
// • @vue/cli-plugin-typescript
// • @vue/cli-plugin-pwa
// • @vue/cli-plugin-router
// • @vue/cli-plugin-vuex`,

  4: `// UI 组件库

// 1. Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

// 使用
<el-button>默认按钮</el-button>
<el-input v-model="value"></el-input>
<el-date-picker v-model="date"></el-date-picker>

// 2. Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)

// 使用
<a-button type="primary">按钮</a-button>
<a-input v-model="value" />
<a-date-picker v-model="date" />

// 3. Vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

// 使用 Material Design
<v-btn color="primary">按钮</v-btn>
<v-text-field v-model="text" />
<v-date-picker v-model="date" />

// 4. iView / View UI
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

Vue.use(ViewUI)

// 使用
<Button type="primary">按钮</Button>
<Input v-model="value" />
<DatePicker v-model="date" />`,

  5: `// 状态管理库

// 1. Pinia - Vue 3 官方推荐
import { createPinia } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({ name: '', age: 0 }),
  getters: {
    fullName: state => state.name + ' Doe'
  },
  actions: {
    async fetchUser() {
      const user = await api.getUser()
      this.name = user.name
    }
  }
})

// 组件中使用
const userStore = useUserStore()
userStore.name
userStore.$patch({ age: 25 })

// 2. Vuex 4
import { createStore } from 'vuex'

const store = createStore({
  state: { count: 0 },
  mutations: { ... },
  actions: { ... },
  modules: { user, products }
})

// Composition API 风格
import { useStore } from 'vuex'

const store = useStore()
const count = computed(() => store.state.count)

// 3. EventBus 事件总线
// Vue 2
Vue.prototype.$bus = new Vue()

// 组件 A
this.$bus.$emit('custom-event', data)

// 组件 B
this.$bus.$on('custom-event', handler)

// Vue 3 使用 mitt
import mitt from 'mitt'
const emitter = mitt()`,

  6: `// 构建工具

// 1. Vite - 官方推荐
npm create vite@latest my-vue-app

// 特性
// • 极快的冷启动
// • 即时热更新
// • 原生 ESM 支持
// • 优化的生产构建

// 2. Vue CLI (Webpack)
vue create my-project

// 特性
// • 功能齐全
// • 插件生态丰富
// • 图形化配置界面

// 3. Nuxt.js - SSR 框架
npx create-nuxt-app my-app

// 特性
// • 服务端渲染
// • 静态站点生成
// • 自动路由
// • API 路由
// • SEO 优化

// 4. Quasar - 全平台框架
npm install -g @quasar/cli
quasar create my-app

// 特性
// • 一套代码多端运行
// • Web、移动端、桌面端
// • Material Design 组件`,

  7: `// 测试框架

// 1. Vue Test Utils
import { mount } from '@vue/test-utils'
import { expect } from 'chai'

describe('MyComponent', () => {
  it('renders props', () => {
    const wrapper = mount(MyComponent, {
      propsData: { message: 'Hello' }
    })
    expect(wrapper.text()).to.include('Hello')
  })

  it('emits events', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('custom-event')).to.be.true
  })
})

// 2. Jest Vue 配置
module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  }
}

// 3. Cypress - E2E 测试
describe('My App', () => {
  it('displays welcome message', () => {
    cy.visit('/')
    cy.contains('h1', 'Welcome')
  })

  it('user can login', () => {
    cy.visit('/login')
    cy.get('[data-testid="username"]').type('admin')
    cy.get('[data-testid="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})

// 4. Vitest - Vite 原生测试
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('MyComponent', () => {
  it('works', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toBe('Hello')
  })
})`,

  8: `// 工具库

// 1. VueUse - Composition API 工具集
import { useMouse, useLocalStorage, useFetch } from '@vueuse/core'

export default {
  setup() {
    const { x, y } = useMouse()
    const stored = useLocalStorage('my-key', 'default value')
    const { data, error } = useFetch('/api/data')
    return { x, y, stored, data, error }
  }
}

// 2. Vue I18n - 国际化
import VueI18n from 'vue-i18n'

Vue.use(VueI18n, {
  locale: 'zh',
  messages: {
    zh: {
      hello: '你好'
    },
    en: {
      hello: 'Hello'
    }
  }
})

// 使用
<p>{{ $t('hello') }}</p>

// 3. VeeValidate - 表单验证
import { ValidationProvider, ValidationObserver } from 'vee-validate'

<ValidationProvider rules="required|email" v-slot="{ errors }">
  <input v-model="email" />
  <span>{{ errors[0] }}</span>
</ValidationProvider>

// 4. VueCurrencyInput - 货币输入
// 5. Vue-Multiselect - 多选下拉
// 6. VueTour - 引导教程`,

  9: `// 开发者工具

// 1. Vue.js DevTools 浏览器扩展
// • 组件层级查看
// • Vuex/Pinia 状态监控
// • 事件追踪
// • 性能分析
// • 时间旅行调试

// 2. Vue CLI UI 图形化界面
vue ui
// • 项目管理
// • 插件安装
// • 配置修改
// • 依赖管理

// 3. Vue Docs 官方文档
// • guide.vuejs.org - 指南
// • vue-router.vuejs.org - 路由文档
// • vuex.vuejs.org - Vuex 文档

// 4. Awesome Vue 资源集合
github.com/vuejs/awesome-vue
// • 组件库
// • 工具库
// • 示例项目
// • 教程文章`,

  10: `// 学习资源

// 官方资源
// • vuejs.org - 官方网站
// • github.com/vuejs/core - 源码
// • @vuejs - 官方 Twitter

// 推荐课程
// • Vue Mastery - 官方推荐
// • Vue School - 视频教程
// • Udemy Vue 课程

// 中文资源
// • vue-js.com - 中文社区
// • cnodejs.org - CNode 社区
// • learn.vue.video - 视频教程

// 实战项目
// • Vue RealWorld Example
// • Vue HackerNews Clone
// • Vue Element Admin
// • Vue Vben Admin`
}

const ecosystemCategories = [
  {
    name: '核心工具',
    items: ['Vue Router', 'Vuex', 'Pinia', 'DevTools'],
    color: 'var(--color-code-indigo)',
    surface: 'var(--code-indigo-alpha-10)',
    border: 'var(--code-indigo-alpha-40)'
  },
  {
    name: '构建工具',
    items: ['Vite', 'Vue CLI', 'Nuxt.js', 'Quasar'],
    color: 'var(--color-code-green)',
    surface: 'var(--code-green-alpha-10)',
    border: 'var(--code-green-alpha-50)'
  },
  {
    name: 'UI 组件库',
    items: ['Element UI', 'Ant Design Vue', 'Vuetify', 'iView'],
    color: 'var(--color-code-red)',
    surface: 'var(--code-red-alpha-10)',
    border: 'var(--code-red-alpha-30)'
  },
  {
    name: '测试框架',
    items: ['Vue Test Utils', 'Jest', 'Cypress', 'Vitest'],
    color: 'var(--color-code-violet)',
    surface: 'var(--code-violet-alpha-10)',
    border: 'var(--code-violet-alpha-40)'
  },
  {
    name: '工具库',
    items: ['VueUse', 'Vue I18n', 'VeeValidate'],
    color: 'var(--code-page-warning)',
    surface: 'var(--code-page-warning-soft)',
    border: 'var(--code-page-warning-border)'
  }
]

export default function VueEcosystemPage() {
  return (
    <ContentWrapper className="code-page" title="Vue 生态系统" subtitle="Vue 相关工具与资源">
      {/* 生态分类 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-indigo-alpha-10)',
          border: '1px solid var(--code-indigo-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🌍 生态分类</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}
        >
          {ecosystemCategories.map((category, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: category.surface,
                borderRadius: '8px',
                border: `1px solid ${category.border}`
              }}
            >
              <h4 style={{ color: category.color, marginBottom: '0.75rem' }}>{category.name}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {category.items.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--code-page-surface-panel)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--white-alpha-70)'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 核心工具 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-green-alpha-10)',
          border: '1px solid var(--code-green-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🛠️ 核心工具</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}
        >
          <div
            style={{
              padding: '1rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-indigo)', marginBottom: '0.5rem' }}>
              Vue Router
            </h4>
            <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
              官方路由管理器，支持路由守卫、动态路由、嵌套路由
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-red-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-red)', marginBottom: '0.5rem' }}>Vuex / Pinia</h4>
            <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
              状态管理模式，Pinia 是 Vue 3 推荐的方案
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-violet-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-violet)', marginBottom: '0.5rem' }}>
              Vue CLI / Vite
            </h4>
            <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
              项目脚手架，Vite 是新一代构建工具，速度更快
            </p>
          </div>
        </div>
      </div>

      {/* UI 组件库 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-violet-alpha-10)',
          border: '1px solid var(--code-violet-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>🎨 UI 组件库</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          {[
            {
              name: 'Element UI',
              desc: '饿了么出品，Vue 2 最流行',
              color: 'var(--code-page-lib-element)'
            },
            {
              name: 'Ant Design Vue',
              desc: '蚂蚁集团设计语言',
              color: 'var(--code-page-lib-antdv)'
            },
            {
              name: 'Vuetify',
              desc: 'Material Design 规范',
              color: 'var(--code-page-lib-vuetify)'
            },
            { name: 'PrimeVue', desc: '丰富的组件集合', color: 'var(--code-page-lib-prime)' },
            { name: 'Naive UI', desc: 'Vue 3 现代组件库', color: 'var(--code-page-lib-naive)' }
          ].map((lib, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                background: 'var(--code-page-surface-panel)',
                borderRadius: '8px',
                border: `1px solid color-mix(in srgb, ${lib.color} 40%, transparent)`
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    background: lib.color
                  }}
                />
                <h5 style={{ color: 'var(--color-white)', margin: 0 }}>{lib.name}</h5>
              </div>
              <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem', margin: 0 }}>
                {lib.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 学习资源 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-page-surface-panel)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>📚 学习资源</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}
        >
          <div>
            <h5 style={{ color: 'var(--color-code-indigo)', marginBottom: '0.5rem' }}>官方文档</h5>
            <ul
              style={{
                color: 'var(--white-alpha-70)',
                fontSize: '0.875rem',
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: '1.2rem'
              }}
            >
              <li>vuejs.org - 官方指南</li>
              <li>router.vuejs.org - 路由文档</li>
              <li>vuex.vuejs.org - 状态管理</li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: 'var(--color-code-green)', marginBottom: '0.5rem' }}>社区资源</h5>
            <ul
              style={{
                color: 'var(--white-alpha-70)',
                fontSize: '0.875rem',
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: '1.2rem'
              }}
            >
              <li>vuejs.org Awesome Vue</li>
              <li>Vue Mastery 视频教程</li>
              <li>Vue School 交互课程</li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: 'var(--color-code-violet)', marginBottom: '0.5rem' }}>实战项目</h5>
            <ul
              style={{
                color: 'var(--white-alpha-70)',
                fontSize: '0.875rem',
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: '1.2rem'
              }}
            >
              <li>Vue RealWorld Example</li>
              <li>Element Admin</li>
              <li>Vben Admin</li>
            </ul>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
