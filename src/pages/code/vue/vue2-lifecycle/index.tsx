import React, { useState, useEffect } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 2 的生命周期钩子让开发者可以在特定阶段执行代码
    从实例创建到销毁的完整生命周期`,
  2: `// 完整生命周期

export default {
  // 1. 创建阶段
  beforeCreate() {
    // 实例初始化之后，数据观测和事件配置之前
    // 此时：this.$el、this.$data 不存在
  },
  created() {
    // 实例创建完成，数据观测、属性运算、事件回调已配置
    // 此时：this.$data 存在，this.$el 不存在
    // 常用：发起 API 请求
  },

  // 2. 挂载阶段
  beforeMount() {
    // 挂载开始之前，render 函数首次被调用
    // 此时：this.$el 不存在
  },
  mounted() {
    // el 被新创建的 vm.$el 替换，挂载到实例上
    // 此时：this.$el 存在，可以操作 DOM
    // 常用：初始化第三方库、绑定事件、定时器
  },

  // 3. 更新阶段
  beforeUpdate() {
    // 数据更新，DOM 重新渲染之前
    // 可以在此进一步更改状态，不会触发重渲染
  },
  updated() {
    // DOM 已更新，可以执行依赖于 DOM 的操作
    // 避免在此更改状态，可能导致无限循环
  },

  // 4. 销毁阶段
  beforeDestroy() {
    // 实例销毁之前，实例仍完全可用
    // 常用：解绑事件、清除定时器
  },
  destroyed() {
    // 实例销毁后调用，所有绑定解除
    // 此时：this.$el、子组件不存在
  }
}`,

  3: `// 生命周期图示

创建阶段：
┌─────────────────────────────────────────────┐
│ 1. new Vue()                        │
│    ↓                                 │
│ 2. initEvents()      // 初始化事件    │
│    ↓                                 │
│ 3. initLifecycle()    // 初始化生命周期  │
│    ↓                                 │
│ 4. beforeCreate()    // 钩子         │
│    ↓                                 │
│ 5. initState()       // 初始化状态    │
│    ├─ initProps()                    │
│    ├─ initMethods()                   │
│    ├─ initData() → observe()          │
│    ├─ initComputed()                 │
│    └─ initWatch()                   │
│    ↓                                 │
│ 6. created()          // 钩子         │
└─────────────────────────────────────────────┘

挂载阶段：
┌─────────────────────────────────────────────┐
│ 7. beforeMount()     // 钩子         │
│    ↓                                 │
│ 8. render()          // 生成 VNode    │
│    ↓                                 │
│ 9. update()         // 更新 DOM      │
│    ↓                                 │
│ 10. mounted()         // 钩子        │
└─────────────────────────────────────────────┘`,

  4: `// 常见使用场景

// 1. 数据初始化 - created
export default {
  data() {
    return { users: [] }
  },
  created() {
    // ✅ 在 created 中请求数据，避免 DOM 闪烁
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      const res = await api.getUsers()
      this.users = res.data
    }
  }
}

// 2. DOM 操作 - mounted
export default {
  mounted() {
    // ✅ 在 mounted 中操作 DOM
    const chart = echarts.init(this.$refs.chart)
    chart.setOption(this.chartOptions)
  }
}

// 3. 清理副作用 - beforeDestroy
export default {
  data() {
    return { timer: null }
  },
  mounted() {
    this.timer = setInterval(() => {
      // 定时器逻辑
    }, 1000)
  },
  beforeDestroy() {
    // ✅ 清理定时器
    clearInterval(this.timer)
    // ✅ 解绑事件
    window.removeEventListener('resize', this.handleResize)
    // ✅ 销毁第三方实例
    this.$refs.chart.dispose()
  }
}`,

  5: `// keep-alive 生命周期

// 被 keep-alive 包裹的组件有额外钩子

export default {
  // 组件首次进入时调用
  activated() {
    // 组件激活
    // 恢复滚动位置
    // 重新启动定时器
  },
  // 组件离开时调用
  deactivated() {
    // 组件失活
    // 保存滚动位置
    // 暂停定时器
  },
  mounted() {
    // 只在首次挂载时调用一次
    // 首次挂载
  }
}
}

// 使用示例
<keep-alive>
  <component :is="currentComponent" />
</keep-alive>

// 组件切换时
// 首次显示：mounted → activated
// 再次显示：只调用 activated
// 切换走：deactivated`,

  6: `// 父子组件生命周期顺序

// 挂载顺序（先父后子，子先挂载完成）
// Parent beforeCreate
// Parent created
// Parent beforeMount
//   ↓
// Child beforeCreate
// Child created
// Child beforeMount
// Child mounted  ← 子组件先挂载完成
// Parent mounted  ← 父组件后挂载完成

// 更新顺序（父先开始，子先完成）
// Parent beforeUpdate
//   ↓
// Child beforeUpdate
// Child updated     ← 子组件先更新完成
// Parent updated     ← 父组件后更新完成

// 销毁顺序（先父后子，子先销毁完成）
// Parent beforeDestroy
//   ↓
// Child beforeDestroy
// Child destroyed   ← 子组件先销毁
// Parent destroyed   ← 父组件后销毁

// 实践意义
// • 父组件 mounted 在子组件 mounted 之后
// • 子组件 updated 在父组件 updated 之前
// • 销毁是从内向外进行`,

  7: `// 错误处理钩子

// errorCaptured 捕获后代组件的错误
export default {
  errorCaptured(err, vm, info) {
    // err: 错误对象
    // vm: 发生错误的组件实例
    // info: 字符串，错误来源

    // 返回 false 阻止错误继续向上传播
    // 返回 true 继续传播到全局 errorhandler
    return false
  }
}

// 可以捕获的错误
// • 组件模板渲染
// • 生命周期钩子
// • 事件处理器
// • watch 回调
// • computed getter

// 不能捕获的错误
// • 异步回调中的错误（setTimeout、Promise）
// • 自定义事件函数中的错误
// • setup() 自身的错误

// 全局错误处理器
Vue.config.errorHandler = (err, vm, info) => {
  // 处理全局错误
}`,

  8: `// 生命周期常见问题

// 问题 1：多次请求 API
export default {
  created() {
    this.fetchData()
  },
  mounted() {
    // ❌ created 和 mounted 都会调用
    // 导致发起两次请求
    this.fetchData()
  }
}

// ✅ 解决方案：只在一个钩子中请求
export default {
  created() {
    this.fetchData() // 只在这里请求
  }
}

// 问题 2：updated 中修改数据导致无限循环
export default {
  data() {
    return { count: 0 }
  },
  updated() {
    // ❌ 更新导致 count 变化，count 变化触发 updated
    // 形成无限循环
    this.count++
  }
}

// ✅ 解决方案：使用 nextTick 或 watch
export default {
  updated() {
    this.$nextTick(() => {
      // nextTick 中修改不会触发新的 updated
      if (this.shouldUpdate) {
        this.count++
        this.shouldUpdate = false
      }
    })
  }
}

// 问题 3：beforeDestroy/destroyed 中访问 this
export default {
  beforeDestroy() {
    // ✅ 此时仍可访问 this
    this.$refs.chart.dispose()
  },
  destroyed() {
    // ⚠️ 子组件已销毁，无法访问子组件
    this.$refs.child.method() // undefined
  }
}`,

  9: `// $nextTick 的使用

// 在 DOM 更新后执行回调
export default {
  methods: {
    updateList() {
      this.items.push(...newItems)

      // ❌ 此时 DOM 还未更新
      // this.$refs.list.children.length

      // ✅ 使用 $nextTick
      this.$nextTick(() => {
        // DOM 已更新，可以操作
        this.scrollToBottom()
      })
    }
  }
}

// 常见使用场景
// 1. 操作更新后的 DOM
this.$nextTick(() => {
  this.$refs.input.focus()
})

// 2. 等待子组件更新
this.$nextTick(() => {
  // 访问子组件数据
})

// 3. 批量更新后的操作
this.items = [...newItems]
this.$nextTick(() => {
  this.initList()
})

// 返回 Promise
this.$nextTick().then(() => {
  // DOM 更新完成
})`,

  10: `// 生命周期最佳实践

// 1. 数据请求
export default {
  created() {
    // ✅ 在 created 中请求数据
    this.fetchData()
  }
}

// 2. DOM 操作
export default {
  mounted() {
    // ✅ 在 mounted 中初始化需要 DOM 的库
    this.$refs.chart.init()
  }
}

// 3. 清理副作用
export default {
  data() {
    return {
      resizeHandler: null
    }
  },
  mounted() {
    // ✅ 保存引用，便于后续清理
    this.resizeHandler = this.handleResize.bind(this)
    window.addEventListener('resize', this.resizeHandler)
    this.timer = setInterval(...)
  },
  beforeDestroy() {
    // ✅ 清理所有副作用
    window.removeEventListener('resize', this.resizeHandler)
    clearInterval(this.timer)
    this.$refs.chart?.dispose()
  }
}

// 4. 避免性能问题
export default {
  data() {
    return { items: [] }
  },
  watch: {
    // ✅ 使用 watch 而不是 updated
    items: {
      handler(newVal) {
        this.processItems(newVal)
      },
      deep: true
    }
  }
}

// 5. $nextTick 配合
export default {
  methods: {
    async updateAndProcess() {
      this.data = newData
      // ✅ 等待 DOM 更新后再操作
      await this.$nextTick()
      this.measureLayout()
    }
  }
}`
}

const lifecycleFlow = [
  { name: 'beforeCreate', desc: '实例初始化之后', el: false, data: false },
  { name: 'created', desc: '实例创建完成', el: false, data: true },
  { name: 'beforeMount', desc: '挂载开始', el: false, data: true },
  { name: 'mounted', desc: 'DOM 已挂载', el: true, data: true },
  { name: 'beforeUpdate', desc: '数据更新前', el: true, data: true },
  { name: 'updated', desc: 'DOM 已更新', el: true, data: true },
  { name: 'beforeDestroy', desc: '销毁开始', el: true, data: true },
  { name: 'destroyed', desc: '实例已销毁', el: false, data: false }
]

export default function Vue2LifecyclePage() {
  const [activeStep, setActiveStep] = useState(-1)
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 4)])
  }

  // 模拟生命周期触发
  useEffect(() => {
    addLog('beforeMount: 组件即将挂载')
    return () => {
      addLog('beforeDestroy: 组件即将销毁')
    }
  }, [])

  useEffect(() => {
    if (activeStep >= 0) {
      addLog(`进入 ${lifecycleFlow[activeStep].name} 阶段`)
    }
  }, [activeStep])

  return (
    <ContentWrapper
      className="code-page"
      title="Vue 2 生命周期"
      subtitle="组件从创建到销毁的完整流程"
    >
      {/* 生命周期流程 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🔄 生命周期流程</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {lifecycleFlow.map((stage, index) => (
            <div
              key={index}
              onClick={() => setActiveStep(activeStep === index ? -1 : index)}
              style={{
                padding: '1rem',
                background:
                  activeStep === index
                    ? 'var(--code-indigo-alpha-20)'
                    : 'var(--code-indigo-alpha-05)',
                borderRadius: '8px',
                border: '1px solid var(--code-indigo-alpha-30)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background:
                    index < 4
                      ? 'var(--color-code-indigo)'
                      : index < 6
                        ? 'var(--color-code-green)'
                        : 'var(--color-code-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: 'var(--color-white)'
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: 'var(--color-white)',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}
                >
                  {stage.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--white-alpha-60)' }}>
                  {stage.desc}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--white-alpha-40)',
                    marginTop: '0.25rem'
                  }}
                >
                  $el: {stage.el ? '✅' : '❌'} | data: {stage.data ? '✅' : '❌'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 阶段说明 */}
      {activeStep >= 0 && (
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
          <h4 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
            {lifecycleFlow[activeStep].name} 详解
          </h4>
          <p style={{ color: 'var(--white-alpha-70)', lineHeight: 1.8 }}>
            {lifecycleFlow[activeStep].desc}。在此阶段：
            {activeStep <= 2 && ' DOM 还未挂载，无法访问 this.$el'}
            {activeStep === 3 && ' DOM 已挂载，可以操作 DOM 元素，初始化第三方库'}
            {activeStep >= 4 && activeStep <= 5 && ' 数据发生变化，虚拟 DOM 重新渲染'}
            {activeStep >= 6 && ' 实例即将被销毁，此时仍可访问实例'}
          </p>
        </div>
      )}

      {/* 演示区域 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🎮 生命周期演示</h3>

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
              计数: {count}
            </div>
            <button
              onClick={() => setCount(c => c + 1)}
              style={{
                padding: '0.5rem 1rem',
                background:
                  'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--color-white)',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              +1 (模拟更新)
            </button>
            <div
              style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--white-alpha-50)' }}
            >
              {count > 0 ? '触发 beforeUpdate/updated' : '初始状态'}
            </div>
          </div>
        </div>
      </div>

      {/* 日志 */}
      {logs.length > 0 && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--code-page-surface-panel)',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }}
        >
          <h4 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>生命周期日志</h4>
          {logs.map((log, i) => (
            <div key={i} style={{ color: 'var(--white-alpha-60)', marginBottom: '0.25rem' }}>
              {log}
            </div>
          ))}
        </div>
      )}

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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 最佳实践</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>在 created 中请求数据</strong>，避免页面闪烁
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>在 mounted 中操作 DOM</strong>，此时 DOM 已挂载
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>在 beforeDestroy 中清理副作用</strong>，避免内存泄漏
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>避免在 updated 中修改数据</strong>，可能导致无限循环
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>使用 watch 监听变化</strong>，而不是依赖 updated
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
