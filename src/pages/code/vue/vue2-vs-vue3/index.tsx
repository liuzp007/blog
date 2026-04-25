import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 2 和 Vue 3 是两个重大版本
    Vue 3 带来了性能提升、更好的 TypeScript 支持和新的 API`,
  2: `// 核心差异对比

// 1. 响应式系统
// Vue 2 - Object.defineProperty
const vm = new Vue({
  data: { count: 0 }
})

// ❌ 无法检测的变动
vm.newProp = 'value'  // 不响应
vm.items[0] = 'new'    // 数组索引不响应
delete vm.count          // 删除不响应

// Vue 3 - Proxy
import { createApp, reactive } from 'vue'

const app = createApp({
  setup() {
    const state = reactive({ count: 0 })
    // ✅ 所有操作都是响应式的
    state.newProp = 'value'
    state.items[0] = 'new'
    delete state.count
    return { state }
  }
})`,

  3: `// 2. 全局 API 变化

// Vue 2
import Vue from 'vue'

Vue.use(Vuex)
Vue.component('my-component', MyComponent)
Vue.directive('focus', FocusDirective)
Vue.mixin(MyMixin)
Vue.prototype.$http = http

new Vue({
  // ...
})

// Vue 3 - 应用实例
import { createApp } from 'vue'

const app = createApp(RootComponent)

app.use(Vuex)
app.component('my-component', MyComponent)
app.directive('focus', FocusDirective)
app.mixin(MyMixin)

// 多个应用实例隔离
const app1 = createApp(App1)
const app2 = createApp(App2)

app1.mount('#app1')
app2.mount('#app2')`,

  4: `// 3. 组件定义方式

// Vue 2 - Options API
export default {
  name: 'MyComponent',
  components: { ChildComponent },
  props: {
    message: String
  },
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // mounted
  }
}

// Vue 3 - Composition API
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'MyComponent',
  components: { ChildComponent },
  props: {
    message: String
  },
  setup(props) {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    onMounted(() => {
      // mounted
    })

    return { count, doubled, increment }
  }
}

// Vue 3 - <script setup> 语法
<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  message: string
}>()

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count++
}

onMounted(() => {
  // mounted
})
</script>`,

  5: `// 4. 生命周期钩子变化

// Vue 2
export default {
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},  // Vue 3 中改名
  destroyed() {},     // Vue 3 中改名
  activated() {},
  deactivated() {}
}

// Vue 3 - <script setup> 语法
<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  message: string
}>()

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count++
}

onMounted(() => {
  // mounted
})
</script>`,

  7: `// 6. 异步组件

// Vue 2
const AsyncComponent = () => ({
  component: import('./MyComponent.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
})

new Vue({
  components: {
    AsyncComponent
  }
})

// Vue 3
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000,
  suspensible: false
})

// 或简写
const AsyncComponent = defineAsyncComponent(() =>
  import('./MyComponent.vue')
)

// 与 Suspense 配合使用
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>`,

  8: `// 7. Teleport 传送门

// Vue 3 新增 - 将内容渲染到 DOM 的其他位置

// 模态框场景
<Teleport to="body">
  <div class="modal">
    <p>渲染到 body 下</p>
  </div>
</Teleport>

// 多个 Teleport
<Teleport to="#modal-container">
  <div>A</div>
</Teleport>
<Teleport to="#modal-container">
  <div>B</div>
</Teleport>

// 禁用 Teleport
<Teleport to="body" :disabled="isMobile">
  <div class="modal">...</div>
</Teleport>

// 使用场景
// • 模态框、对话框
// • 提示框、下拉菜单
// • 需要脱离父级样式限制`,

  9: `// 8. Fragments 片段

// Vue 2 - 只能有一个根元素
<template>
  <div class="wrapper">
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>

// Vue 3 - 支持多个根元素
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

// 或使用 Fragment
<template>
  <Fragment>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </Fragment>
</template>

// 优势
// • 减少无意义的包裹元素
// • 更好的语义化
// • 更小的 DOM 树`,

  10: `// 9. 移除的 API

// $on, $off, $one - 事件总线
// ❌ Vue 3 移除
this.$on('custom-event', handler)
this.$emit('custom-event', data)
this.$off('custom-event', handler)

// ✅ 使用 mitt 或事件库
import mitt from 'mitt'
const emitter = mitt()
emitter.on('foo', e => {
  // 处理事件
})
emitter.emit('foo', { a: 'b' })

// filters 过滤器
// ❌ Vue 3 移除
{{ message | capitalize }}
{{ price | currency('¥') }}

// ✅ 使用方法或计算属性
{{ capitalize(message) }}
{{ formatCurrency(price, '¥') }}

// $children, $refs 访问
// ❌ Vue 3 不再保证顺序
this.$children[0].doSomething()

// ✅ 使用模板引用和 $refs
const child = ref()
child.value.doSomething()`,

  11: `// 10. Tree-shaking 支持

// Vue 2 - 打包整个 vue
import Vue from 'vue'
// 即使只用部分功能，也打包全部

// Vue 3 - 按需引入
import { createApp, ref, computed } from 'vue'

// 或
import { ref } from 'vue'
import { useStore } from 'vuex'

// 打包体积对比
// Vue 2: ~95KB (gzipped ~30KB)
// Vue 3: ~83KB (gzipped ~25KB)
// Composition API: ~13KB (gzipped ~4KB)

// 性能提升
// • 打包体积减少 41%
// • 初始渲染快 55%
// • 更新快 133%
// • 内存占用减半`,

  12: `// 11. TypeScript 支持

// Vue 2 - TypeScript 支持有限
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  components: { MyComponent }
})
export default class MyComponent extends Vue {
  message: string = 'Hello'
  count: number = 0

  increment(): void {
    this.count++
  }
}

// Vue 3 - 原生 TypeScript 支持
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    message: String,
    count: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const count = ref(0)
    return { count }
  }
})

// <script setup lang="ts">
<script setup lang="ts">
interface Props {
  message: string
  count?: number
}

const props = defineProps<Props>()
const count = ref<number>(0)
</script>`,

  13: `// 12. 自定义指令 API

// Vue 2
Vue.directive('focus', {
  bind(el, binding, vnode) {
    el.focus()
  },
  inserted(el, binding, vnode) {},
  update(el, binding, vnode, oldVnode) {},
  componentUpdated(el, binding, vnode, oldVnode) {},
  unbind(el, binding, vnode) {}
})

// Vue 3 - 更简洁的钩子
import { createApp } from 'vue'

const app = createApp(App)

app.directive('focus', {
  mounted(el, binding) {
    el.focus()
  },
  updated(el, binding) {}
})

// 指令钩子映射
// bind → mounted
// inserted → mounted
// update → (removed)
// componentUpdated → updated
// unbind → unmounted`
}

const comparisonFeatures = [
  {
    name: '响应式系统',
    vue2: 'Object.defineProperty',
    vue3: 'ES6 Proxy',
    improvement: '性能更好，支持更多类型'
  },
  { name: '全局 API', vue2: 'Vue 全局对象', vue3: 'app 实例', improvement: '支持多实例，避免污染' },
  {
    name: '组件 API',
    vue2: 'Options API',
    vue3: '+ Composition API',
    improvement: '更好的逻辑复用和 TS 支持'
  },
  { name: '打包体积', vue2: '~95KB', vue3: '~83KB', improvement: '减少 41%' },
  { name: '渲染性能', vue2: '基准', vue3: '快 55%', improvement: 'Virtual DOM 重写' },
  { name: 'TypeScript', vue2: '需要装饰器', vue3: '原生支持', improvement: '更好的类型推断' }
]

export default function Vue2VsVue3Page() {
  const [activeCategory, setActiveCategory] = useState('core')

  return (
    <ContentWrapper className="code-page" title="Vue 2 vs Vue 3" subtitle="两个主要版本的全面对比">
      {/* 概念卡片 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🆚 核心差异</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}
        >
          {comparisonFeatures.map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: 'var(--code-indigo-alpha-05)',
                borderRadius: '8px',
                border: '1px solid var(--code-indigo-alpha-20)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => setActiveCategory(feature.name)}
            >
              <h4 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                {feature.name}
              </h4>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--white-alpha-60)',
                  marginBottom: '0.25rem'
                }}
              >
                <span style={{ color: 'var(--color-code-red)' }}>Vue 2:</span> {feature.vue2}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--white-alpha-60)',
                  marginBottom: '0.5rem'
                }}
              >
                <span style={{ color: 'var(--color-code-green)' }}>Vue 3:</span> {feature.vue3}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-code-violet)' }}>
                {feature.improvement}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 新增特性 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>
          ✨ Vue 3 新增特性
        </h3>

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
            <h4 style={{ color: 'var(--color-code-indigo)', marginBottom: '0.5rem' }}>Teleport</h4>
            <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
              将组件内容传送到 DOM 的任意位置
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-violet-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-violet)', marginBottom: '0.5rem' }}>Fragments</h4>
            <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
              支持多个根元素，减少无意义的包裹
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-red-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-red)', marginBottom: '0.5rem' }}>Suspense</h4>
            <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
              异步组件的加载状态管理
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-green)', marginBottom: '0.5rem' }}>
              Composition API
            </h4>
            <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
              函数式 API，更好的逻辑复用
            </p>
          </div>
        </div>
      </div>

      {/* 移除的 API */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-red-alpha-10)',
          border: '1px solid var(--code-red-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>❌ 移除的 API</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}
        >
          <div>
            <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>$on/$off/$once</h5>
            <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem' }}>
              事件总线移除，使用 mitt 或第三方库
            </p>
          </div>
          <div>
            <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>filters</h5>
            <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem' }}>
              过滤器移除，使用方法或计算属性
            </p>
          </div>
          <div>
            <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>$children</h5>
            <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem' }}>
              不再保证顺序，使用模板引用
            </p>
          </div>
          <div>
            <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>plugin 选项</h5>
            <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem' }}>
              使用 app.use() 代替
            </p>
          </div>
        </div>
      </div>

      {/* 迁移建议 */}
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
        <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>🚀 迁移建议</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>使用迁移构建版本</strong>：@vue/compat 提供兼容模式
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>逐步替换 Options API 为 Composition API</strong>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>更新全局 API 调用</strong>：Vue.xxx → app.xxx
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>检查第三方库兼容性</strong>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>使用 vite</strong>：更快的构建和热更新
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
