import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `计算属性 computed 是 Vue 中非常有用的功能
    它会基于其依赖自动缓存结果，只有依赖变化时才重新计算`,
  2: `// 基本语法
const count = ref(0)

export default {
  data() {
    return count.value
  }
}

// computed vs methods 的区别
// computed: 有缓存，基于依赖自动更新，主要用于计算派生值
// methods: 无缓存，需要手动调用，主要用于事件处理

// 计算属性的写法
const fullName = computed(() => {
  return this.firstName + ' ' + this.lastName
})

// 计算属性的 getter/setter
const user = computed({
  get() {
    return this.firstName
  },
  set(newVal) {
    this.firstName = newVal
  }
})`,
  3: `// 可写计算属性
import { ref, computed } from 'vue'

export default {
  data() {
    return {
      count: 0,
      firstName: '张',
      lastName: '三'
    }
  },

  // 可写计算属性
  computed: {
    fullName: {
      get() {
        return this.firstName + ' ' + this.lastName
      },
      set(newVal) {
        const names = newVal.split(' ')
        this.firstName = names[0] || ''
        this.lastName = names[1] || ''
      }
    }
  }
}

// 在模板中使用
// <template>
//   <input v-model="user.fullName" />
// </template>

// 不可写计算属性
// 使用只带 getter 的函数
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}`,
  4: `// 计算属性的缓存机制

computed 会基于其依赖进行缓存：
• 依赖不变时，直接返回缓存结果
• 依赖变化时，重新计算并更新缓存

// 示例演示缓存：
const count = ref(0)
const doubled = computed(() => count.value * 2)

// 第一次访问：doubled.value = 0 * 2 = 0，函数执行
doubled.value // 0

count.value++
// 第二次访问：doubled.value = 1 * 2 = 2，函数执行
doubled.value // 2

count.value++
// 第三次访问（依赖不变）：
// 不会重新计算，直接返回缓存的 2
doubled.value // 2

// 重置缓存
// 只有当 count 变化时，doubled 才会重新计算`,
  5: `// computed vs watch 的选择

computed 和 watch 都可以观察数据变化，
但使用场景不同：

// 使用 computed 的场景：
• 需要从现有数据计算派生值
• 数据只用于展示，不需要进一步处理
• 有多个依赖，且依赖变化频率较低

// 使用 watch 的场景：
• 需要执行异步操作或副作用
• 需要在数据变化时执行特定逻辑
• 需要传入新值和旧值

// 示例对比
const searchQuery = ref('')

// ❌ 使用 computed
const filteredList = computed(() => {
  return this.list.filter(item => item.includes(this.searchQuery.value))
})

// ✅ 使用 watch
watch(searchQuery, (newQuery) => {
  // 执行 API 请求
  fetchSearchResults(newQuery)
})

// 性能考虑
// computed 有缓存，适合计算密集型操作
// watch 每次数据变化都会执行回调，需注意性能`,
  6: `// 计算属性的陷阱

陷阱 1：修改计算属性
// 不要在计算属性中修改其他数据
const user = computed(() => {
  // ❌ 错误做法：在 getter 中修改其他状态
  this.otherData.push(newValue)
  return this.firstName + ' ' + this.lastName
})

// 陷阱 2：无限递归
// 计算属性相互依赖导致无限循环
const a = computed(() => b.value)
const b = computed(() => a.value + 1)

// 解决方案：
// 使用函数式组件，明确数据流向
// 或使用 watch + methods 替代复杂的 computed

// 最佳实践
• 计算属性保持纯函数，不产生副作用
• 复杂逻辑考虑使用 watch 代替
• 避免在 getter 中修改数据`
}

// 子组件用于演示
function ComputedDemo() {
  const [count, setCount] = useState(0)
  const [doubled, setDoubled] = useState(0)

  const handleIncrement = () => {
    setCount(c => c + 1)
    setDoubled(c => c * 2)
  }

  const handleReset = () => {
    setCount(0)
    setDoubled(0)
  }

  return (
    <div
      style={{
        padding: '1.5rem',
        background: 'var(--code-page-chip-bg-strong)',
        borderRadius: '8px',
        marginBottom: '0.5rem'
      }}
    >
      <span>原始计数: {count}</span>
      <button
        onClick={handleIncrement}
        style={{
          marginLeft: '1rem',
          padding: '0.5rem 1rem',
          background: 'var(--code-green-alpha-20)',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        +1
      </button>
      <button
        onClick={handleReset}
        style={{
          marginLeft: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--danger-soft-alpha-20)',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        重置
      </button>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--code-indigo-alpha-05)',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <div
          style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}
        >
          计算属性 (2x)
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-indigo)' }}>
          {doubled}
        </div>
      </div>
    </div>
  )
}

export default function ComputedPage() {
  return (
    <ContentWrapper
      className="code-page"
      title="computed 计算属性"
      subtitle="Vue 的响应式计算与缓存机制"
    >
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
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              响应式原理
            </div>
            <div
              style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-code-indigo)' }}
            >
              Object.defineProperty
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              依赖收集
            </div>
            <div
              style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-code-green)' }}
            >
              派发更新
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-violet-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              getter/setter
            </div>
            <div
              style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-code-violet)' }}
            >
              缓存机制
            </div>
          </div>
        </div>
      </div>

      {/* 代码示例 */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-page-surface-panel)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>📝 代码示例</h3>

        {/* 交互演示 */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'var(--code-green-alpha-10)',
            border: '1px solid var(--code-green-alpha-30)',
            borderRadius: '12px',
            position: 'relative',
            zIndex: 3
          }}
        >
          <h4 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>缓存演示</h4>
          <p style={{ color: 'var(--white-alpha-80)', marginBottom: '1rem' }}>
            点击 +1 后观察&quot;计算属性(2x)&quot;的变化
          </p>
          <ComputedDemo />
        </div>
      </div>

      {/* 最佳实践 */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-red-alpha-10)',
          border: '1px solid var(--code-red-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 使用陷阱</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>避免在计算属性中修改其他数据</strong>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>避免复杂计算属性的相互依赖</strong>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>计算属性保持纯函数，不产生副作用</strong>
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
