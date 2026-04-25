import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 3 带来了许多新特性和改进
    包括 Composition API、Teleport、Suspense 等`,
  2: `// 1. Composition API

import { ref, reactive, computed, watch, onMounted } from 'vue'

export default {
  setup() {
    // 响应式状态
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })

    // 计算属性
    const doubled = computed(() => count.value * 2)

    // 监听器
    watch(count, (newVal) => {
      // 处理 count 变化
    })

    // 生命周期
    onMounted(() => {
      // 组件已挂载
    })

    // 方法
    function increment() {
      count.value++
    }

    return { count, state, doubled, increment }
  }
}

// <script setup> 语法糖
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count++
}
</script>

<template>
  <div>{{ count }} x 2 = {{ doubled }}</div>
  <button @click="increment">+1</button>
</template>`,

  3: `// 2. Teleport 传送门

// 将内容渲染到 DOM 的其他位置

// 基础用法
<Teleport to="body">
  <div class="modal">
    <h3>模态框</h3>
    <p>这个内容会被渲染到 body 下</p>
  </div>
</Teleport>

// 多个 Teleport 到同一目标
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

// JavaScript 调用
import { createVNode, render } from 'vue'
import { Teleport } from 'vue'

const vnode = createVNode(Teleport, {
  to: 'body',
  disabled: false
}, [contentNode])

// 使用场景
// • 模态框、对话框
// • 提示框、下拉菜单
// • Toast 通知
// • 脱离父级 overflow:hidden`,

  4: `// 3. Fragments 多根节点

// Vue 3 支持多个根元素

<template>
  <header>头部</header>
  <main>内容</main>
  <footer>页脚</footer>
</template>

// Vue 2 需要包裹
<template>
  <div class="wrapper">
    <header>头部</header>
    <main>内容</main>
    <footer>页脚</footer>
  </div>
</template>

// 使用 Fragment 组件
<template>
  <Fragment>
    <td>数据1</td>
    <td>数据2</td>
  </Fragment>
</template>

// 优势
// • 减少无意义的包裹元素
// • 更好的语义化结构
// • 减少嵌套层级
// • 更小的 DOM 树`,

  5: `// 4. Suspense 异步组件

// 等待异步组件加载时显示加载状态

<Suspense>
  <template #default>
    <!-- 异步组件 -->
    <AsyncComponent />
  </template>
  <template #fallback>
    <!-- 加载中状态 -->
    <div class="loading">嘘，好戏即将开场...</div>
  </template>
</Suspense>

// 多个 Suspense
<Suspense>
  <template #default>
    <AsyncComponent1 />
    <AsyncComponent2 />
  </template>
  <template #fallback>
    <GlobalSpinner />
  </template>
</Suspense>

// 与异步组件配合
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
)

<Suspense>
  <template #default>
    <AsyncComp />
  </template>
  <template #fallback>
    <Spinner />
  </template>
</Suspense>

// 事件
<Suspense @resolve="onResolve" @pending="onPending">
  <AsyncComponent />
</Suspense>`,

  6: `// 5. 移除的 API

// $on, $off, $once
// ❌ Vue 3 移除
this.$on('custom-event', handler)
this.$emit('custom-event', data)
this.$off('custom-event', handler)

// ✅ 使用事件库或 mitt
import mitt from 'mitt'
const emitter = mitt()

// filters 过滤器
// ❌ Vue 3 移除
{{ message | capitalize }}
{{ price | currency('¥') }}

// ✅ 使用方法或计算属性
{{ capitalize(message) }}
{{ formatCurrency(price, '¥') }}

// $children
// ❌ Vue 3 移除
this.$children[0].doSomething()

// ✅ 使用模板引用和 $refs
const child = ref()
child.value.doSomething()`,

  7: `// 6. v-model 变化

// 默认使用 modelValue 和 update:modelValue

<!-- 父组件 -->
<UserName v-model="firstName" />

<!-- 等价于 -->
<UserName
  :modelValue="firstName"
  @update:modelValue="firstName = $event"
/>

<!-- 多个 v-model -->
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>

<!-- 子组件定义 -->
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input
    :value="firstName"
    @input="firstName = $event.target.value"
  />
  <input
    :value="lastName"
    @input="lastName = $event.target.value"
  />
</template>

<!-- 或使用 defineModel() -->
<script setup>
const modelValue = defineModel()
</script>

<template>
  <input v-model="modelValue" />
</template>`,

  8: `// 7. defineComponent 和类型推断

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String,
    count: {
      type: Number,
      required: true
    }
  },
  emits: {
    // 声明触发的事件
    change: (payload: { id: number }) => {
      // 运行时验证
      if (payload.id < 0) {
        console.warn('Invalid id')
        return false
      }
      return true
    }
  },
  setup(props, { emit }) {
    // 完整的 TypeScript 类型推断
    const count = ref(0)

    function handleChange() {
      emit('change', { id: count.value })
    }

    return { count, handleChange }
  }
})

// setup 类型
interface Props {
  message: string
  count?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()`,

  9: `// 8. 自定义渲染函数

import { h, Fragment } from 'vue'

export default {
  setup() {
    return () => h('div', { class: 'container' }, [
      h('h1', '标题'),
      h('p', '内容')
    ])
  }
}

// 使用 JSX
export default {
  setup() {
    const count = ref(0)
    return () => (
      <div class="container">
        <h1>计数: {count.value}</h1>
        <button onClick={() => count.value++}>+1</button>
      </div>
    )
  }
}

// 配置 JSX
// vite.config.js / vue.config.js
export default {
  esbuild: {
    jsx: 'automatic'
  },
  jsx: 'automatic'
}

// tsconfig.json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
  }
}`,

  10: `// 9. watch 和 watchEffect

import { watch, watchEffect, watchPostEffect } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const name = ref('Vue')

    // watch - 需要明确指定监听源
    watch(count, (newVal, oldVal) => {
      // 处理 count 变化
    })

    // 监听多个源
    watch([count, name], ([newCount, newName]) => {
      // 处理多个数据变化
    })

    // watchEffect - 自动追踪依赖
    watchEffect(() => {
      // 自动追踪 count 和 name 的变化
    })

    // watchPostEffect - 更新后执行
    watchPostEffect(() => {
      // DOM 更新完成
    })

    return { count, name }
  }
}

// watch vs watchEffect
// watch: 更明确，可以访问新旧值，惰性执行
// watchEffect: 更简洁，自动依赖收集，立即执行

// 使用场景
// • 需要 oldValue → watch
// • 异步操作 → watch
// • 副作用隔离 → watchEffect
// • DOM 更新后操作 → watchPostEffect`,

  11: `// 10. provide / inject 改进

import { provide, inject, readonly } from 'vue'

// 祖先组件
export default {
  setup() {
    const theme = ref('dark')

    // 提供只读数据，防止子组件修改
    provide('theme', readonly(theme))

    // 提供响应式数据
    provide('userInfo', reactive({ name: '张三' }))

    // 提供修改方法
    provide('updateTheme', (newTheme) => {
      theme.value = newTheme
    })
  }
}

// 后代组件
export default {
  setup() {
    // 注入数据，带默认值
    const theme = inject('theme', 'light')

    // 注入只读数据
    const userInfo = inject('userInfo')

    // 注入方法
    const updateTheme = inject('updateTheme')

    return { theme, userInfo, updateTheme }
  }
}

// 使用 provide / inject 组合式 API
import { createInjectionKey } from 'vue'

const ThemeKey = createInjectionKey<string>()

// 祖先
provide(ThemeKey, ref('dark'))

// 后代
const theme = inject(ThemeKey, 'light') // 有类型推断`,

  12: `// 11. Tree-shaking 支持

// Vue 3 支持按需引入，减小打包体积

// Vue 2
import Vue from 'vue'
// 整个 vue 都被打包

// Vue 3
import { ref, computed, watch } from 'vue'
// 只打包使用的 API

// 创建应用时也可以按需引入
import { createApp } from 'vue'

const app = createApp(App)

// 打包体积对比
// Vue 2 完整: ~95KB (gzipped ~30KB)
// Vue 3 完整: ~83KB (gzipped ~25KB)
// Vue 3 Composition API: ~13KB (gzipped ~4KB)

// 优化建议
// • 使用 Composition API 减小体积
// • 按需引入 API
// • 使用 Tree-shaking 友好的库
// • 避免引入整个库`,

  13: `// 12. 性能提升

// 1. 静态提升
// Vue 3 编译器会智能提升静态节点
<div>
  <div class="header">标题</div>
  <div class="content">内容</div>
</div>

// 编译后
// 静态部分被提升，只创建一次

// 2. Patch Flags 优化
// Vue 3 在虚拟 DOM 中添加标志位
// 跳过不必要的比较，提升 diff 性能

// 3. 事件缓存
<!-- Vue 2 -->
<button @click="handler">点击</button>

<!-- Vue 3 编译后自动缓存 -->
<button onClick={handler}>点击</button>

// 4. 响应式优化
// 只对需要响应式的数据使用 reactive/ref
const staticData = { name: '静态数据' }
const reactiveState = reactive({ count: 0 })

// 5. 列表渲染优化
<!-- 使用稳定的 key -->
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

// 6. 计算属性缓存
const doubled = computed(() => count.value * 2)
// 只有 count 变化时才重新计算`
}

const featureCategories = [
  {
    name: 'Composition API',
    desc: '函数式 API，更好的逻辑复用',
    color: 'var(--color-code-indigo)',
    surface: 'var(--code-indigo-alpha-10)',
    surfaceActive: 'var(--code-indigo-alpha-30)',
    border: 'var(--code-indigo-alpha-40)'
  },
  {
    name: 'Teleport',
    desc: '将内容渲染到 DOM 其他位置',
    color: 'var(--color-code-green)',
    surface: 'var(--code-green-alpha-10)',
    surfaceActive: 'var(--code-green-alpha-30)',
    border: 'var(--code-green-alpha-50)'
  },
  {
    name: 'Fragments',
    desc: '支持多个根节点',
    color: 'var(--color-code-red)',
    surface: 'var(--code-red-alpha-10)',
    surfaceActive: 'var(--code-red-alpha-30)',
    border: 'var(--code-red-alpha-30)'
  },
  {
    name: 'Suspense',
    desc: '异步组件的加载状态',
    color: 'var(--color-code-violet)',
    surface: 'var(--code-violet-alpha-10)',
    surfaceActive: 'var(--code-violet-alpha-30)',
    border: 'var(--code-violet-alpha-40)'
  },
  {
    name: 'v-model 改进',
    desc: '默认使用 modelValue',
    color: 'var(--code-page-warning)',
    surface: 'var(--code-page-warning-soft)',
    surfaceActive: 'var(--code-page-warning-border)',
    border: 'var(--code-page-warning-border)'
  },
  {
    name: 'Tree-shaking',
    desc: '按需引入，减小打包体积',
    color: 'var(--code-page-pink)',
    surface: 'var(--code-page-pink-soft)',
    surfaceActive: 'var(--code-page-pink-border)',
    border: 'var(--code-page-pink-border)'
  }
]

export default function Vue3FeaturePage() {
  const [activeTab, setActiveTab] = useState('Composition API')

  return (
    <ContentWrapper className="code-page" title="Vue 3 新特性" subtitle="Vue 3 带来的新功能和改进">
      {/* 特性分类 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>✨ 新增特性</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}
        >
          {featureCategories.map((feature, index) => (
            <div
              key={index}
              onClick={() => setActiveTab(feature.name)}
              style={{
                padding: '1rem',
                background: activeTab === feature.name ? feature.surfaceActive : feature.surface,
                borderRadius: '8px',
                border: `1px solid ${feature.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <h4 style={{ color: feature.color, marginBottom: '0.5rem' }}>{feature.name}</h4>
              <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Composition API 示例 */}
      {activeTab === 'Composition API' && (
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
          <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>
            📝 Composition API 示例
          </h3>

          <pre
            style={{
              background: 'var(--code-page-surface-panel-deep)',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}
          >
            <code style={{ color: 'var(--color-code-green)' }}>{`<script setup>
import { ref, computed, watch } from 'vue'

// 响应式状态
const count = ref(0)
const doubled = computed(() => count.value * 2)

// 监听变化
watch(count, (newVal) => {
  // 处理 count 变化
})

// 直接在模板中使用，无需 return
</script>

<template>
  <div>Count: {{ count }}</div>
  <div>Doubled: {{ doubled }}</div>
  <button @click="count++">+1</button>
</template>`}</code>
          </pre>
        </div>
      )}

      {/* Teleport 示例 */}
      {activeTab === 'Teleport' && (
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
          <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>
            🌀 Teleport 传送门
          </h3>
          <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
            将组件内容渲染到 DOM 的其他位置
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'var(--code-indigo-alpha-10)',
                borderRadius: '8px'
              }}
            >
              <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>使用场景</h5>
              <ul style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                <li>模态框、对话框</li>
                <li>下拉菜单</li>
                <li>Toast 通知</li>
                <li>Tooltip 提示</li>
              </ul>
            </div>
            <div
              style={{
                padding: '1rem',
                background: 'var(--code-green-alpha-10)',
                borderRadius: '8px'
              }}
            >
              <h5 style={{ color: 'var(--color-code-green)', marginBottom: '0.5rem' }}>代码示例</h5>
              <pre
                style={{
                  background: 'var(--code-page-code-block-bg-soft)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--color-code-green)'
                }}
              >{`<Teleport to="body">
  <div class="modal">
    模态框内容
  </div>
</Teleport>`}</pre>
            </div>
          </div>
        </div>
      )}

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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          <div>
            <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>
              $on / $off / $once
            </h5>
            <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem' }}>
              事件总线 API 移除，使用 mitt 或事件库替代
            </p>
          </div>
          <div>
            <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>filters</h5>
            <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem' }}>
              过滤器移除，使用方法或计算属性替代
            </p>
          </div>
          <div>
            <h5 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>$children</h5>
            <p style={{ color: 'var(--white-alpha-60)', fontSize: '0.875rem' }}>
              不再保证顺序，使用模板引用替代
            </p>
          </div>
        </div>
      </div>

      {/* 迁移指南 */}
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
            • <strong>使用 @vue/compat</strong>：提供兼容模式，逐步迁移
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>优先使用 Composition API</strong>：更好的类型支持和代码组织
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>更新全局 API 调用</strong>：Vue.xxx → app.xxx
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>使用 Vite</strong>：更快的构建和热更新
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>更新 v-model 语法</strong>：value → modelValue
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
