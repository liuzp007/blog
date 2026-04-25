import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 2 和 Vue 3 的生命周期钩子有一些变化
    主要变化在于命名和销毁阶段的钩子`,
  2: `// 生命周期对比表

// Vue 2 Options API
export default {
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},  // Vue 3 改名
  destroyed() {},     // Vue 3 改名
  activated() {},
  deactivated() {},
  errorCaptured() {}
}

// Vue 3 Options API (兼容 Vue 2)
export default {
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},  // 新名称
  unmounted() {},     // 新名称
  activated() {},
  deactivated() {},
  errorCaptured() {},
  // 新增钩子
  renderTracked() {},
  renderTriggered() {}
}

// Vue 3 Composition API
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onBeforeMount(() => {})
    onMounted(() => {})
    onBeforeUpdate(() => {})
    onUpdated(() => {})
    onBeforeUnmount(() => {})
    onUnmounted(() => {})

    // 调试钩子
    onRenderTracked(() => {})
    onRenderTriggered(() => {})

    return {}
  }
}`,
  3: `// 销毁阶段钩子变化

// Vue 2
export default {
  beforeDestroy() {
    // 清理工作：定时器、事件监听、订阅
  },
  destroyed() {
    // DOM 已移除，所有子组件已销毁
  }
}

// Vue 3 - 新命名
export default {
  beforeUnmount() {
    // 对应 Vue 2 的 beforeDestroy
    // 组件即将卸载
  },
  unmounted() {
    // 对应 Vue 2 的 destroyed
    // 组件已卸载
  }
}

// Composition API
import { onBeforeUnmount, onUnmounted } from 'vue'

export default {
  setup() {
    onBeforeUnmount(() => {
      // 即将卸载
    })
    onUnmounted(() => {
      // 已卸载
    })
  }
}

// 命名原因
// • destroy 与组件生命周期语义不符
// • unmount 更准确地描述了从 DOM 移除的行为
// • 与其他框架术语保持一致`,
  4: `// Vue 3 新增钩子

// 1. renderTracked
// 首次渲染时跟踪虚拟 DOM 渲染
import { onRenderTracked } from 'vue'

export default {
  setup() {
    onRenderTracked((e) => {
      // 跟踪渲染
    })
  }
}

// 2. renderTriggered
// 虚拟 DOM 重新渲染时触发
import { onRenderTriggered } from 'vue'

export default {
  setup() {
    onRenderTriggered((e) => {
      // 触发重新渲染
    })
  }
}

// 用途
// • 性能调试：找出频繁重渲染的原因
// • 开发环境下的性能分析
// • 生产环境自动移除`,
  5: `// 生命周期组合使用

// Options API - 数据获取
export default {
  data() {
    return { users: [], loading: false }
  },
  created() {
    // DOM 不存在，可以获取数据
    this.fetchUsers()
  },
  mounted() {
    // DOM 已挂载，可以操作 DOM
    this.initChart()
  },
  beforeDestroy() {
    // 清理工作
    this.$store.unsubscribe()
  }
}

// Composition API - 数据获取
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    const users = ref([])
    const loading = ref(false)

    // 直接在 setup 中获取数据
    // 此时相当于 created 阶段
    fetchUsers()

    onMounted(() => {
      initChart()
    })

    onUnmounted(() => {
      // 清理
      unsubscribe()
    })

    return { users, loading }
  }
}

// 关键差异
// • setup 本身相当于 beforeCreate 和 created
// • onMounted 钩子在 setup 中注册
// • Composition API 钩子可以注册多次`,
  6: `// 父子组件生命周期顺序

// 挂载阶段
// 1. Parent beforeCreate
// 2. Parent created
// 3. Parent beforeMount
// 4. Child beforeCreate
// 5. Child created
// 6. Child beforeMount
// 7. Child mounted
// 8. Parent mounted

// 更新阶段
// 1. Parent beforeUpdate
// 2. Child beforeUpdate
// 3. Child updated
// 4. Parent updated

// 卸载阶段
// 1. Parent beforeUnmount
// 2. Child beforeUnmount
// 3. Child unmounted
// 4. Parent unmounted

// 实践意义
// • 父组件的 mounted 在子组件之后
// • 子组件的 updated 在父组件之前
// • 销毁是先子后父`,
  7: `// keep-alive 生命周期

// 被 keep-alive 缓存的组件有特殊钩子

export default {
  // 组件被激活时调用
  activated() {
    // 恢复滚动位置
    // 重新启动定时器
    // 刷新数据
  },
  // 组件失活时调用
  deactivated() {
    // 保存滚动位置
    // 清除定时器
    // 暂停视频播放
  }
}

// Composition API
import { onActivated, onDeactivated } from 'vue'

export default {
  setup() {
    onActivated(() => {
      // 组件激活
    })
    onDeactivated(() => {
      // 组件失活
    })
  }
}

// 使用场景
// • tab 切换保持状态
// • 列表页和详情页切换
// • 多步骤表单`,
  8: `// 错误处理钩子

// errorCaptured - 捕获后代组件错误
export default {
  errorCaptured(err, vm, info) {
    // err: 错误对象
    // vm: 发生错误的组件实例
    // info: 字符串，错误来源

    // 返回 false 阻止错误继续传播
    return false
  }
}

// Composition API
import { onErrorCaptured } from 'vue'

export default {
  setup() {
    onErrorCaptured((err, vm, info) => {
      // 处理错误
    })
  }
}

// errorCaptured 可以捕获的错误类型
// • 组件渲染函数
// • 生命周期钩子
// • 事件处理器
// • watch 回调
// • computed getter

// 不能捕获的错误
// • 异步回调中的错误
// • 自定义事件处理器的错误
// • setup() 自身的错误（向上传播）`,
  9: `// Vue 3 setup 详解

// setup 执行时机
export default {
  beforeCreate() {
    // beforeCreate
  },
  setup() {
    // 在 beforeCreate 之后调用
    // 此时组件实例还未创建
    // this 不可用

    // 无法访问组件实例
    // undefined

    return {
      // 返回的数据将暴露给模板
    }
  },
  created() {
    // 可以访问 this
  }
}

// setup 参数
export default {
  setup(props, { emit, attrs, slots, expose }) {
    // props: 响应式 props 对象
    // context: 包含 emit, attrs, slots, expose

    emit('custom-event', 'data')

    return {}
  }
}
}
  },
  created() {
    // 可以访问 this
  }
  },
  created() {
    // created
    // 可以访问 this
  }
}

// setup 参数
export default {
  setup(props, { emit, attrs, slots, expose }) {
    // props: 响应式 props 对象
    // context: 包含 emit, attrs, slots, expose

    emit('custom-event', 'data')

    return {}
  }
}

// expose 限制暴露
export default {
  setup(props, { expose }) {
    const publicData = ref('public')
    const privateData = ref('private')

    // 只暴露 publicData
    expose({ publicData })

    return { publicData, privateData }
  }
}

// 父组件
// const child = ref()
// child.value.publicData // ✅ 可访问
// child.value.privateData // ❌ 不可访问`,
  10: `// 生命周期最佳实践

// 1. 数据初始化
export default {
  created() {
    // ✅ 推荐：在 created 中初始化数据
    this.fetchData()
  },
  mounted() {
    // ❌ 不推荐：在 mounted 中请求数据会闪烁
  }
}

// 2. DOM 操作
export default {
  mounted() {
    // ✅ 必须在 mounted 中操作 DOM
    this.$refs.chart.init()
  }
}

// 3. 清理副作用
export default {
  mounted() {
    // ✅ 注册事件监听
    window.addEventListener('resize', this.handleResize)
    this.timer = setInterval(...)
  },
  beforeUnmount() {
    // ✅ 清理副作用
    window.removeEventListener('resize', this.handleResize)
    clearInterval(this.timer)
  }
}

// 4. 避免无限循环
export default {
  updated() {
    // ❌ 危险：在 updated 中修改数据
    this.count++ // 可能导致无限循环
  }
}

// 解决方案
export default {
  watch: {
    count(newVal) {
      // ✅ 使用 watch 监听变化
      if (newVal > 10) {
        this.doSomething()
      }
    }
  }
}`
}

const lifecycleComparison = [
  { vue2: 'beforeCreate', vue3: 'beforeCreate', composition: '-', phase: '创建前' },
  { vue2: 'created', vue3: 'created', composition: 'setup()', phase: '创建后' },
  { vue2: 'beforeMount', vue3: 'beforeMount', composition: 'onBeforeMount', phase: '挂载前' },
  { vue2: 'mounted', vue3: 'mounted', composition: 'onMounted', phase: '挂载后' },
  { vue2: 'beforeUpdate', vue3: 'beforeUpdate', composition: 'onBeforeUpdate', phase: '更新前' },
  { vue2: 'updated', vue3: 'updated', composition: 'onUpdated', phase: '更新后' },
  { vue2: 'beforeDestroy', vue3: 'beforeUnmount', composition: 'onBeforeUnmount', phase: '卸载前' },
  { vue2: 'destroyed', vue3: 'unmounted', composition: 'onUnmounted', phase: '卸载后' },
  { vue2: 'activated', vue3: 'activated', composition: 'onActivated', phase: '激活' },
  { vue2: 'deactivated', vue3: 'deactivated', composition: 'onDeactivated', phase: '失活' }
]

export default function LifecycleDiffPage() {
  const [activeTab, setActiveTab] = useState('comparison')

  return (
    <ContentWrapper
      className="code-page"
      title="生命周期对比"
      subtitle="Vue 2 与 Vue 3 生命周期钩子对比"
    >
      {/* 选项卡 */}
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
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('comparison')}
            style={{
              padding: '0.5rem 1.5rem',
              background:
                activeTab === 'comparison'
                  ? 'var(--code-indigo-alpha-20)'
                  : 'var(--code-indigo-alpha-05)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--color-white)',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            对比表
          </button>
          <button
            onClick={() => setActiveTab('order')}
            style={{
              padding: '0.5rem 1.5rem',
              background:
                activeTab === 'order'
                  ? 'var(--code-indigo-alpha-20)'
                  : 'var(--code-indigo-alpha-05)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--color-white)',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            执行顺序
          </button>
          <button
            onClick={() => setActiveTab('new')}
            style={{
              padding: '0.5rem 1.5rem',
              background:
                activeTab === 'new' ? 'var(--code-indigo-alpha-20)' : 'var(--code-indigo-alpha-05)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--color-white)',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Vue 3 新增
          </button>
        </div>

        {/* 对比表 */}
        {activeTab === 'comparison' && (
          <div
            style={{
              padding: '1rem',
              background: 'var(--code-page-surface-panel)',
              borderRadius: '12px',
              overflow: 'auto'
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--code-indigo-alpha-30)' }}>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      color: 'var(--color-code-indigo)'
                    }}
                  >
                    阶段
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      color: 'var(--color-code-indigo)'
                    }}
                  >
                    Vue 2 Options
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      color: 'var(--color-code-indigo)'
                    }}
                  >
                    Vue 3 Options
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      color: 'var(--color-code-indigo)'
                    }}
                  >
                    Composition API
                  </th>
                </tr>
              </thead>
              <tbody>
                {lifecycleComparison.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom:
                        index === lifecycleComparison.length - 1
                          ? 'none'
                          : '1px solid var(--code-page-chip-border)',
                      background:
                        item.vue2 !== item.vue3 ? 'var(--code-red-alpha-10)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.75rem', color: 'var(--white-alpha-80)' }}>
                      {item.phase}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color:
                          item.vue2 !== item.vue3
                            ? 'var(--color-code-red)'
                            : 'var(--color-code-green)',
                        fontFamily: 'monospace'
                      }}
                    >
                      {item.vue2}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color:
                          item.vue2 !== item.vue3
                            ? 'var(--color-code-red)'
                            : 'var(--color-code-green)',
                        fontFamily: 'monospace'
                      }}
                    >
                      {item.vue3}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color: 'var(--color-code-violet)',
                        fontFamily: 'monospace'
                      }}
                    >
                      {item.composition}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 执行顺序 */}
        {activeTab === 'order' && (
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--code-page-surface-panel)',
              borderRadius: '12px'
            }}
          >
            <h4 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
              父子组件生命周期顺序
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}
            >
              <div>
                <h5 style={{ color: 'var(--color-code-green)', marginBottom: '0.5rem' }}>
                  挂载阶段
                </h5>
                <ul
                  style={{ color: 'var(--white-alpha-80)', fontSize: '0.875rem', lineHeight: 1.8 }}
                >
                  <li>1. Parent beforeCreate</li>
                  <li>2. Parent created</li>
                  <li>3. Parent beforeMount</li>
                  <li>4. Child beforeCreate</li>
                  <li>5. Child created</li>
                  <li>6. Child beforeMount</li>
                  <li>7. Child mounted</li>
                  <li>8. Parent mounted</li>
                </ul>
              </div>

              <div>
                <h5 style={{ color: 'var(--color-code-red)', marginBottom: '0.5rem' }}>更新阶段</h5>
                <ul
                  style={{ color: 'var(--white-alpha-80)', fontSize: '0.875rem', lineHeight: 1.8 }}
                >
                  <li>1. Parent beforeUpdate</li>
                  <li>2. Child beforeUpdate</li>
                  <li>3. Child updated</li>
                  <li>4. Parent updated</li>
                </ul>
              </div>

              <div>
                <h5 style={{ color: 'var(--color-code-violet)', marginBottom: '0.5rem' }}>
                  卸载阶段
                </h5>
                <ul
                  style={{ color: 'var(--white-alpha-80)', fontSize: '0.875rem', lineHeight: 1.8 }}
                >
                  <li>1. Parent beforeUnmount</li>
                  <li>2. Child beforeUnmount</li>
                  <li>3. Child unmounted</li>
                  <li>4. Parent unmounted</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Vue 3 新增 */}
        {activeTab === 'new' && (
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--code-page-surface-panel)',
              borderRadius: '12px'
            }}
          >
            <h4 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Vue 3 新增钩子</h4>

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
                  background: 'var(--code-indigo-alpha-10)',
                  borderRadius: '8px',
                  border: '1px solid var(--code-indigo-alpha-30)'
                }}
              >
                <h5
                  style={{
                    color: 'var(--color-code-indigo)',
                    marginBottom: '0.5rem',
                    fontFamily: 'monospace'
                  }}
                >
                  renderTracked
                </h5>
                <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
                  首次渲染时跟踪虚拟 DOM，用于性能调试
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  background: 'var(--code-green-alpha-10)',
                  borderRadius: '8px',
                  border: '1px solid var(--code-green-alpha-30)'
                }}
              >
                <h5
                  style={{
                    color: 'var(--color-code-green)',
                    marginBottom: '0.5rem',
                    fontFamily: 'monospace'
                  }}
                >
                  renderTriggered
                </h5>
                <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
                  虚拟 DOM 重新渲染时触发，找出频繁渲染原因
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  background: 'var(--code-red-alpha-10)',
                  borderRadius: '8px',
                  border: '1px solid var(--code-red-alpha-30)'
                }}
              >
                <h5
                  style={{
                    color: 'var(--color-code-red)',
                    marginBottom: '0.5rem',
                    fontFamily: 'monospace'
                  }}
                >
                  钩子重命名
                </h5>
                <p style={{ color: 'var(--white-alpha-70)', fontSize: '0.875rem' }}>
                  beforeDestroy → beforeUnmount
                  <br />
                  destroyed → unmounted
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API 命名变化说明 */}
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 重要变更</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>destroy → unmount</strong>：unmount 更准确地描述了组件从 DOM 移除的行为
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>setup() 替代 beforeCreate/created</strong>：setup 中无法访问
            this，但可以直接获取 props
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>Composition API 钩子可多次注册</strong>：不同的逻辑可以注册各自的钩子
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>调试钩子仅开发环境</strong>：renderTracked 和 renderTriggered
            在生产环境自动移除
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
