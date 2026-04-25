import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 2 的响应式系统基于 Object.defineProperty
    通过数据劫持实现依赖收集和派发更新`,
  2: `// 响应式原理 - Object.defineProperty

// 简化的响应式实现
class Observer {
  constructor(value) {
    this.value = value
    if (typeof value === 'object') {
      this.walk(value)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function defineReactive(obj, key, val) {
  const dep = new Dep() // 创建依赖收集器

  // 递归处理嵌套对象
  if (typeof val === 'object') {
    new Observer(val)
  }

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 依赖收集：记录谁在读取这个属性
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal
        // 派发更新：通知所有依赖
        dep.notify()
      }
    }
  })
}

// 使用示例
const data = { count: 0 }
new Observer(data)

data.count // 触发 getter
data.count = 1 // 触发 setter`,

  3: `// 依赖收集器 Dep

class Dep {
  constructor() {
    this.subs = [] // 存储所有的 Watcher
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  removeSub(watcher) {
    const index = this.subs.indexOf(watcher)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  }

  notify() {
    // 通知所有 Watcher 更新
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

// Dep.target 是全局唯一的当前 Watcher
Dep.target = null`,

  4: `// 观察者 Watcher

class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm // 组件实例
    this.getter = expOrFn // 渲染函数或计算函数
    this.cb = cb // 回调函数
    this.value = this.get() // 触发依赖收集
  }

  get() {
    // 将当前 Watcher 设置为 Dep.target
    Dep.target = this
    // 执行 getter，触发数据的 getter，进行依赖收集
    const value = this.getter.call(this.vm)
    Dep.target = null // 重置
    return value
  }

  update() {
    // 数据变化时调用
    const oldValue = this.value
    this.value = this.get()
    if (this.cb) {
      this.cb.call(this.vm, this.value, oldValue)
    }
  }
}

// 使用场景
// 1. 渲染 Watcher：组件渲染函数
// 2. 计算 Watcher：computed 计算属性
// 3. 用户 Watcher：watch 侦听器`,

  5: `// 数组的响应式处理

// Vue 2 对数组方法的特殊处理
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

// 需要拦截的数组方法
const methodsToPatch = [
  'push', 'pop', 'shift', 'unshift',
  'splice', 'sort', 'reverse'
]

methodsToPatch.forEach(method => {
  Object.defineProperty(arrayMethods, method, {
    value: function mutator(...args) {
      const result = arrayProto[method].apply(this, args)
      // 派发更新
      this.__ob__.dep.notify()
      return result
    }
  })
})

// 观察数组时，替换原型
if (Array.isArray(value)) {
  value.__proto__ = arrayMethods
  this.observeArray(value)
}

// 这就是为什么 Vue 2 中
// • vm.items[0] = 'x' 不响应
// • vm.items.length = 0 不响应
// • vm.items.push('x') 响应
// • vm.items.splice(0, 1, 'x') 响应`,

  6: `// 数组响应式解决方案

// ❌ 不响应的操作
this.items[0] = newValue
this.items.length = 0
this.items[index] = newValue

// ✅ Vue 2 解决方案
// 1. 使用 Vue.set
this.$set(this.items, 0, newValue)
Vue.set(this.items, 0, newValue)

// 2. 使用数组方法
this.items.splice(0, 1, newValue)
this.items.splice() // 清空数组

// 3. 替换整个数组
this.items = [...this.items, newValue]
this.items = this.items.filter(...)

// Vue 3 中使用 Proxy，所有操作都是响应式的
state.items[0] = newValue // ✅ 响应
state.items.length = 0     // ✅ 响应`,

  7: `// 对象属性添加

// Vue 2 中动态添加属性不是响应式的
const vm = new Vue({
  data: {
    user: { name: '张三' }
  }
})

// ❌ 以下操作不是响应式的
vm.user.age = 25
vm.user.gender = '男'

// ✅ 解决方案 1：Vue.set
this.$set(this.user, 'age', 25)
Vue.set(this.user, 'age', 25)

// ✅ 解决方案 2：创建新对象
this.user = Object.assign({}, this.user, { age: 25 })
this.user = { ...this.user, age: 25 }

// ✅ 解决方案 3：预先定义
data() {
  return {
    user: {
      name: '张三',
      age: null,  // 预留属性
      gender: null
    }
  }
}`,

  8: `// 响应式初始化流程

// 1. new Vue() 创建实例
const vm = new Vue({
  data: { count: 0 }
})

// 2. initState 初始化状态
function initState(vm) {
  // 初始化 data
  if (vm.$options.data) {
    initData(vm)
  }
  // 初始化 props
  if (vm.$options.props) {
    initProps(vm)
  }
  // 初始化 methods
  if (vm.$options.methods) {
    initMethods(vm)
  }
  // 初始化 computed
  if (vm.$options.computed) {
    initComputed(vm)
  }
  // 初始化 watch
  if (vm.$options.watch) {
    initWatch(vm)
  }
}

// 3. initData 处理 data
function initData(vm) {
  const data = vm.$options.data
  // data 是函数时执行
  vm._data = typeof data === 'function'
    ? data.call(vm, vm)
    : data || {}

  // 代理 data 到实例上
  proxy(vm, '_data', key)

  // 观察数据
  observe(vm._data)
}

// 4. observe 开始观察
function observe(value) {
  if (!value || typeof value !== 'object') return
  return new Observer(value)
}`,

  9: `// computed 实现原理

// 计算属性本质上是一个懒执行的 Watcher
class ComputedWatcher extends Watcher {
  constructor(vm, getterFn) {
    super(vm, getterFn)
    this.dirty = true // 脏检查标志
    this.value = undefined
    this.dep = new Dep() // 自己的依赖收集器
  }

  get() {
    // 收集渲染 Watcher
    if (Dep.target) {
      this.dep.addSub(Dep.target)
    }

    if (this.dirty) {
      this.value = super.get()
      this.dirty = false
    }
    return this.value
  }

  update() {
    // 数据变化时只标记为脏，不立即计算
    this.dirty = true
    // 通知渲染 Watcher
    this.dep.notify()
  }

  depend() {
    this.dep.addSub(Dep.target)
  }
}

// 执行流程
// 1. 渲染时访问 computed
// 2. computed 的 get 被调用
// 3. 收集渲染 Watcher 到自己的 dep
// 4. computed 内部的响应式数据收集 computed Watcher
// 5. 数据变化时通知 computed Watcher
// 6. computed 标记 dirty，通知渲染 Watcher
// 7. 渲染时重新获取 computed，触发求值`,

  10: `// 响应式限制和注意事项

// 1. 无法检测对象属性的添加/删除
const data = { a: 1 }
data.b = 2 // 不响应
delete data.a // 不响应

// 2. 无法检测数组索引/长度变化
const items = [1, 2, 3]
items[0] = 4 // 不响应
items.length = 0 // 不响应

// 3. 对象冻结后无法响应
const data = Object.freeze({ count: 0 })
data.count = 1 // 不响应，Vue 会跳过

// 4. Vue.set 无法添加根级属性
const vm = new Vue({ data: {} })
// ❌ 无效
Vue.set(vm, 'newProp', 'value')
// ✅ 有效
Vue.set(vm.$data, 'newProp', 'value')

// 最佳实践
// • 预先在 data 中声明所有可能用到的属性
// • 使用对象展开运算符替换整个对象
// • 对于数组，使用变异方法`
}

export default function Vue2ReactivityPage() {
  const [count, setCount] = useState(0)
  const [arrayItems, setArrayItems] = useState(['苹果', '香蕉', '橙子'])
  const [log, setLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setLog(prev => [...prev.slice(-4), message])
  }

  return (
    <ContentWrapper
      className="code-page"
      title="Vue 2 响应式"
      subtitle="Object.defineProperty 数据劫持机制"
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>📡 响应式原理</h3>

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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯 数据劫持</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦 依赖收集</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
              Dep + Watcher
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📢 派发更新</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
              notify 所有依赖
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
        <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>📝 核心实现</h3>

        <pre
          style={{
            background: 'var(--code-page-surface-panel-deep)',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}
        >
          <code style={{ color: 'var(--color-code-indigo)' }}>{`// Object.defineProperty 响应式实现
function defineReactive(obj, key, val) {
  const dep = new Dep() // 依赖收集器

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target) // 收集依赖
      }
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal
        dep.notify() // 派发更新
      }
    }
  })
}

// 使用
const data = {}
defineReactive(data, 'count', 0)
data.count++ // 触发 get 和 set`}</code>
        </pre>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>
          🎮 数组响应式演示
        </h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          Vue 2 中数组索引赋值不是响应式的
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
              borderRadius: '8px'
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              数组内容
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-code-indigo)',
                marginBottom: '0.5rem'
              }}
            >
              {arrayItems.join(', ')}
            </div>
            <button
              onClick={() => {
                addLog('items[0] = "葡萄" ❌ 不响应')
                // 模拟 Vue 2 的不响应操作
                setArrayItems(prev => {
                  const newItems = [...prev]
                  newItems[0] = '葡萄'
                  return newItems
                })
              }}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--danger-soft-alpha-20)',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--color-white)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              items[0] = '葡萄'
            </button>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              Vue.set 方案 ✅
            </div>
            <button
              onClick={() => {
                addLog('Vue.set(items, 0, "葡萄") ✅ 响应')
                setArrayItems(prev => ['葡萄', ...prev.slice(1)])
              }}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--code-green-alpha-20)',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--color-white)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Vue.set(items, 0, '葡萄')
            </button>
            <div
              style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}
            >
              或使用 push/splice 等变异方法
            </div>
          </div>
        </div>
      </div>

      {/* 操作日志 */}
      {log.length > 0 && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--code-page-surface-panel)',
            borderRadius: '8px'
          }}
        >
          <h4 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            操作日志
          </h4>
          {log.map((msg, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.75rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.25rem'
              }}
            >
              {log.length - i}. {msg}
            </div>
          ))}
        </div>
      )}

      {/* 限制说明 */}
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 响应式限制</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>对象属性动态添加</strong>：需要使用 Vue.set
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>数组索引赋值</strong>：items[index] = value 不响应
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>数组长度修改</strong>：items.length = 0 不响应
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>冻结对象</strong>：Object.freeze 后无法响应
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
