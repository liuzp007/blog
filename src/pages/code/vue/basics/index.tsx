import React from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 的响应式系统是其核心特性
    通过数据劫持和依赖收集，自动追踪数据变化并更新视图

    // 核心原理
    new Vue({
      data() {
        return { count: 0 }
      }
    }).$mount('#app')

    // 当 data.count 变化时，视图自动更新`,
  2: `Vue 使用 Object.defineProperty 劫持数据属性
    为每个属性添加 getter/setter
    在属性被访问时触发依赖收集
    在属性被修改时通知视图更新

    Object.defineProperty(obj, 'count', {
      get() {
        dep.push() // 依赖收集
      },
      set(newVal) {
        // 触发更新
        dep.notify() // 通知视图
      }
    })`,
  3: `// 模板语法 - 基于 HTML 的声明式渲染

    <div id="app">
      {{ message }}
      <!-- 单向绑定 -->
      <p v-text="message"></p>

      <!-- 指令 -->
      <p v-if="show">显示内容</p>
      <p v-else="!show">隐藏内容</p>

      <!-- 事件绑定 -->
      <button @click="handleClick">点击</button>

      <!-- 列表渲染 -->
      <li v-for="item in list" :key="item.id">
        {{ item.text }}
      </li>

      <!-- 双向绑定 -->
      <input v-model="searchQuery" />
      <p>{{ searchQuery }}</p>

      <!-- 表单绑定修饰符 -->
      <input v-model.number="age" />
      <input v-model.trim="name" />
      <input v-model.lazy="user" />
    </div>

    // Vue 2 vs Vue 3 对比
    // Vue 2: Options API，配置式
    // Vue 3: Composition API，组合式`,
  4: `// 生命周期钩子

    Vue 2 生命周期：
    beforeCreate() {
      // 实例创建之前
    }
    created() {
      // 实例创建完成，属性已绑定
    }
    beforeMount() {
      // DOM 挂载之前
    }
    mounted() {
      // DOM 挂载完成，可以访问 DOM
    }
    beforeUpdate() {
      // 数据更新之前
    }
    updated() {
      // 数据更新完成，DOM 已重新渲染
    }
    beforeDestroy() {
      // 实例销毁之前
    }
    destroyed() {
      // 实例销毁完成
    }

    Vue 3 Composition API 生命周期：
    import { onMounted, onUpdated, onUnmounted } from 'vue'

    setup() {
      onMounted(() => {
        // 组件已挂载
      })

      const count = ref(0)

      watch(count, (newVal) => {
        // count 变化处理
      })

      onUnmounted(() => {
        // 组件即将卸载
      })
    }`,
  5: `// 计算属性 computed

    export default {
      data() {
        return {
          firstName: '张',
          lastName: '三'
        }
      },
      computed: {
        fullName() {
          return this.firstName + ' ' + this.lastName
        }
      }
    }

    // 计算属性 vs 方法的区别
    // computed 有缓存，依赖不变时不会重新计算
    // methods 每次调用都会执行`,
  6: `// 侦听器 watch

    export default {
      data() {
        return { count: 0, message: '' }
      },
      watch: {
        count(newVal, oldVal) {
          this.message = '计数变化：' + newVal
        },
        message(newVal) {
          // message 变化处理
        }
      }
    }

    // watch 侦听器 vs computed 的区别
    // watch: 监听数据变化，执行副作用（API 调用、DOM 操作）
    // computed: 计算衍生数据，不产生副作用`
  // watch 可以获取新旧值，computed 只能获取当前值`
}

// 子组件用于演示
function DemoChild() {
  const [count, setCount] = React.useState(0)

  return (
    <div
      style={{
        padding: '1rem',
        background: 'var(--code-page-chip-bg-strong)',
        borderRadius: '8px',
        marginBottom: '0.5rem'
      }}
    >
      <span>子组件计数: {count}</span>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          marginLeft: '1rem',
          padding: '0.5rem',
          background: 'var(--code-green-alpha-20)',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        +1
      </button>
    </div>
  )
}

export default function VueBasics() {
  const [parentCount, setParentCount] = React.useState(0)

  return (
    <ContentWrapper className="code-page" title="Vue 基础" subtitle="响应式系统的核心原理与实践">
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>💡 核心概念</h3>

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
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>响应式系统</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--white-alpha-60)' }}>数据驱动视图</div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>模板语法</div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-red-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>指令系统</div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔄</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>双向绑定</div>
          </div>
        </div>
      </div>

      {/* 代码示例 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>📝 代码示例</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>响应式数据</strong>：修改 data 自动更新视图
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>模板语法</strong>：声明式、直观的 HTML 模板
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>指令系统</strong>：v-bind、v-on、v-for 简化开发
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>双向绑定</strong>：v-model 实现数据与视图同步
          </li>
        </ul>
      </div>

      {/* 交互演示 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🎮 简单交互演示</h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          点击按钮模拟 Vue 的响应式更新
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setParentCount(c => c + 1)}
            style={{
              padding: '0.75rem 2rem',
              background:
                'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            +1
          </button>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-page-surface-panel)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-70)',
                marginBottom: '0.5rem'
              }}
            >
              父组件计数
            </div>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-indigo)' }}
            >
              {parentCount}
            </div>
          </div>
        </div>

        <DemoChild />
      </div>
    </ContentWrapper>
  )
}
