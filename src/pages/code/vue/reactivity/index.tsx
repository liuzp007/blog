import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 的响应式系统是其核心特性
    通过数据劫持和依赖收集实现视图自动更新`,
  2: `// Vue 2 响应式原理
// 使用 Object.defineProperty 劫持数据

function observe(obj) {
  if (!obj || typeof obj !== 'object') return

  Object.keys(obj).forEach(key => {
    let value = obj[key]
    let dep = [] // 依赖收集器

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 依赖收集：记录谁在读取这个属性
        if (Dep.target) {
          dep.push(Dep.target)
        }
        return value
      },
      set(newVal) {
        if (newVal !== value) {
          value = newVal
          // 派发更新：通知所有依赖
          dep.forEach(watcher => watcher.update())
        }
      }
    })
  })
  return obj
}

// 使用示例
const vm = observe({ count: 0 })
vm.count // 触发 get，收集依赖
vm.count = 1 // 触发 set，派发更新`,

  3: `// Vue 3 响应式原理
// 使用 ES6 Proxy

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 依赖收集
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      return result
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        // 派发更新
        trigger(target, key)
      }
      return result
    }
  })
}

// Proxy 的优势
// • 可以监听对象属性的添加和删除
// • 可以监听数组的变化
// • 支持 Map、Set、WeakMap、WeakSet
// • 性能更好，不需要遍历所有属性`,

  4: `// 依赖收集与派发更新

// 1. 依赖收集器 Dep
class Dep {
  constructor() {
    this.subs = [] // 存储所有的 Watcher
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

// 2. 观察者 Watcher
class Watcher {
  constructor(vm, expOrFn) {
    this.vm = vm
    this.getter = expOrFn
    this.value = this.get()
  }
  get() {
    Dep.target = this // 将当前 watcher 指向 Dep.target
    const value = this.getter.call(this.vm)
    Dep.target = null // 重置
    return value
  }
  update() {
    const value = this.get()
    this.value = value
  }
}

// 工作流程
// 1. 组件初始化时，创建 Watcher 实例
// 2. Watcher 执行 get()，触发数据的 getter
// 3. 数据的 getter 中收集当前 Watcher 到 Dep
// 4. 数据变化时，触发 setter，Dep 通知所有 Watcher 更新`,

  5: `// 响应式 API 对比

// Vue 2
const vm = new Vue({
  data: {
    user: { name: '张三' }
  },
  created() {
    // ❌ 直接添加属性不是响应式的
    this.user.age = 25
    // ✅ 使用 $set
    this.$set(this.user, 'age', 25)
    // ✅ 使用 Object.assign
    this.user = Object.assign({}, this.user, { age: 25 })
  }
})

// Vue 3
import { reactive } from 'vue'

const state = reactive({
  user: { name: '张三' }
})

// ✅ 所有添加的属性都是响应式的
state.user.age = 25
delete state.user.name // ✅ 删除也是响应式的`,

  6: `// ref vs reactive

// ref：用于基本类型
import { ref, reactive } from 'vue'

const count = ref(0)
count.value // 需要 .value

// reactive：用于对象类型
const state = reactive({
  count: 0,
  user: { name: '张三' }
})
state.count // 不需要 .value

// 选择建议
// • 基本类型使用 ref
// • 对象使用 reactive
// • 需要替换整个对象用 ref
// • 解构保持响应式用 toRefs`,

  7: `// 响应式转换

// toRefs：将 reactive 对象转换为 ref
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0, name: 'Vue' })
const { count, name } = toRefs(state)
// count 和 name 现在都是 ref

// toRef：创建单个 ref
const countRef = toRef(state, 'count')

// shallowRef：浅层响应式
const shallow = shallowRef({ nested: { value: 1 } })
// shallow.value.nested.value = 2 // 不会触发更新
// shallow.value = { nested: { value: 2 } } // 会触发更新`,

  8: `// readonly 与 shallowReadonly

import { readonly, shallowReadonly } from 'vue'

const original = reactive({ count: 0 })
const copy = readonly(original)

copy.count++ // ❌ 警告：不能修改只读属性

// shallowReadonly：只有根层是只读
const state = reactive({
  nested: { value: 1 }
})
const shallow = shallowReadonly(state)
// shallow.nested.value = 2 // ✅ 允许
// shallow.count = 1 // ❌ 警告

// 使用场景
// • 保护状态不被修改
// • 传递给子组件时防止子组件修改
// • 性能优化：不需要响应式的数据用 readonly`,

  9: `// computed 的响应式原理

// 计算属性本质是一个惰性的 Watcher
class ComputedWatcher extends Watcher {
  constructor(vm, getterFn) {
    super(vm, getterFn)
    this.dirty = true // 脏检查标志
    this.value = undefined
  }
  get() {
    if (this.dirty) {
      this.value = super.get()
      this.dirty = false
    }
    return this.value
  }
  update() {
    this.dirty = true // 标记为脏，不立即计算
    // 等到下次读取时才计算（惰性求值）
  }
  depend() {
    this.dep.addSub(Dep.target)
  }
}

// 依赖收集流程
// 1. 计算属性读取时，收集渲染 Watcher
// 2. 计算属性内部访问的响应式数据，收集计算属性 Watcher
// 3. 数据变化时，通知计算属性 Watcher
// 4. 计算属性标记为 dirty，通知渲染 Watcher
// 5. 渲染时重新读取计算属性，触发求值`,

  10: `// 响应式常见问题

// 问题 1：数组变更检测
const vm = new Vue({
  data: {
    items: [1, 2, 3]
  }
})

// ❌ 以下操作不是响应式的
vm.items[0] = 4
vm.items.length = 0

// ✅ 使用 Vue 提供的方法
vm.items.splice(0, 1, 4)
Vue.set(vm.items, 0, 4)

// Vue 3 使用 Proxy 解决了这个问题

// 问题 2：对象属性添加
// Vue 2
this.$set(this.obj, 'newProp', value)

// Vue 3
state.newProp = value // 直接添加即可

// 问题 3：解构失去响应性
const { count } = state // 失去响应性

// 解决方案：toRefs
const { count } = toRefs(state) // 保持响应性`
}

export default function ReactivityPage() {
  const [count, setCount] = useState(0)
  const [proxyCount, setProxyCount] = useState({ value: 0 })
  const [dependencyTree, setDependencyTree] = useState<string[]>([])

  // 模拟依赖收集
  const handleCollect = () => {
    setDependencyTree(['Render', 'Computed', 'Watcher'])
    setTimeout(() => setDependencyTree([]), 2000)
  }

  return (
    <ContentWrapper className="code-page" title="响应式系统" subtitle="Vue 的数据驱动核心机制">
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🔮 核心概念</h3>

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
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📡 依赖收集</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
              Getter 收集 Watcher
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📢 派发更新</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
              Setter 通知依赖
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-red-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👀 观察者</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
              Watcher 监听变化
            </div>
          </div>
        </div>
      </div>

      {/* Vue 2 vs Vue 3 */}
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>
          ⚖️ Vue 2 vs Vue 3
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <div
            style={{
              padding: '1rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '8px',
              border: '1px solid var(--code-indigo-alpha-20)'
            }}
          >
            <h4 style={{ color: 'var(--color-code-indigo)', marginBottom: '0.75rem' }}>Vue 2</h4>
            <ul style={{ color: 'var(--white-alpha-80)', fontSize: '0.875rem', lineHeight: 1.8 }}>
              <li>Object.defineProperty</li>
              <li>初始化时遍历所有属性</li>
              <li>无法检测属性添加/删除</li>
              <li>数组需特殊处理</li>
              <li>嵌套对象递归劫持</li>
            </ul>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px',
              border: '1px solid var(--code-green-alpha-20)'
            }}
          >
            <h4 style={{ color: 'var(--color-code-green)', marginBottom: '0.75rem' }}>Vue 3</h4>
            <ul style={{ color: 'var(--white-alpha-80)', fontSize: '0.875rem', lineHeight: 1.8 }}>
              <li>ES6 Proxy</li>
              <li>懒代理，访问时才劫持</li>
              <li>支持所有数据类型</li>
              <li>性能更好</li>
              <li>支持 Map/Set/WeakMap/WeakSet</li>
            </ul>
          </div>
        </div>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🎮 响应式演示</h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          模拟 Vue 的响应式更新机制
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
              计数 (ref)
            </div>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-indigo)' }}
            >
              {count}
            </div>
            <button
              onClick={() => setCount(c => c + 1)}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background:
                  'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              +1
            </button>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-red-alpha-05)',
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
              对象 (reactive)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-red)' }}>
              {proxyCount.value}
            </div>
            <button
              onClick={() => setProxyCount({ value: proxyCount.value + 1 })}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--danger-soft-alpha-20)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              更新
            </button>
          </div>

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
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              依赖收集
            </div>
            <button
              onClick={handleCollect}
              style={{
                padding: '0.5rem 1rem',
                background:
                  dependencyTree.length > 0
                    ? 'var(--code-green-alpha-30)'
                    : 'var(--code-violet-alpha-30)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              触发收集
            </button>
            <div
              style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-code-green)' }}
            >
              {dependencyTree.map((d, i) => (
                <span key={i} style={{ marginRight: '0.5rem' }}>
                  {d}
                </span>
              ))}
            </div>
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
        <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>📝 Proxy 实现</h3>

        <pre
          style={{
            background: 'var(--code-page-surface-panel-deep)',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}
        >
          <code style={{ color: 'var(--color-code-indigo)' }}>{`// Vue 3 响应式实现简化版
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)  // 依赖收集
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value)
      trigger(target, key)  // 派发更新
      return result
    }
  })
}

const state = reactive({ count: 0 })
state.count++  // 触发 get 和 set`}</code>
        </pre>
      </div>

      {/* 最佳实践 */}
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 注意事项</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>ref 需要 .value</strong>访问，模板中自动解包
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>reactive 解构会失去响应性</strong>，使用 toRefs
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>直接替换 reactive 对象会失去响应性</strong>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>readonly 可以防止意外修改</strong>，适合传递给子组件
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
