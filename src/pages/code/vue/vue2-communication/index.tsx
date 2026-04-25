import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 2 组件间通信有多种方式
    根据组件关系选择合适的通信方式`,
  2: `// 1. Props Down - 父向子传递

// 父组件
export default {
  data() {
    return {
      parentMessage: '来自父组件的消息',
      user: {
        name: '张三',
        age: 25
      }
    }
  },
  template: \`
    <div>
      <child-component
        :message="parentMessage"
        :user="user"
        :count="10"
      />
    </div>
  \`
}

// 子组件接收
export default {
  props: {
    message: String,       // 类型声明
    user: Object,
    count: Number
  },
  // 或使用数组形式（不推荐）
  props: ['message', 'user', 'count'],
  template: \`
    <div>{{ message }}</div>
    <div>{{ user.name }} - {{ user.age }}</div>
    <div>Count: {{ count }}</div>
  \`
}

// prop 验证
props: {
  // 基础类型检查
  propA: Number,
  // 多种类型
  propB: [String, Number],
  // 必填
  propC: {
    type: String,
    required: true
  },
  // 默认值
  propD: {
    type: Number,
    default: 100
  },
  // 对象/数组默认值
  propE: {
    type: Object,
    default: function() {
      return { message: 'hello' }
    }
  },
  // 自定义验证
  propF: {
    validator: function(value) {
      return ['success', 'warning', 'danger'].indexOf(value) !== -1
    }
  }
}`,

  3: `// 2. Events Up - 子向父传递

// 子组件触发事件
export default {
  props: ['message'],
  methods: {
    notifyParent() {
      // $emit 触发自定义事件
      this.$emit('custom-event', {
        data: '来自子组件的数据',
        timestamp: Date.now()
      })
    },
    sendValue(value) {
      this.$emit('update:value', value)
    }
  },
  template: \`
    <div>
      <p>{{ message }}</p>
      <button @click="notifyParent">通知父组件</button>
      <input :value="value" @input="sendValue" />
    </div>
  \`
}

// 父组件监听事件
export default {
  data() {
    return {
      receivedData: null,
      childValue: ''
    }
  },
  methods: {
    handleCustomEvent(data) {
      this.receivedData = data
    },
    handleValueUpdate(value) {
      this.childValue = value
    }
  },
  template: \`
    <child-component
      :message="'Hello'"
      @custom-event="handleCustomEvent"
      @update:value="handleValueUpdate"
    />
  \`
}

// .sync 修饰符（Vue 2.3+）
// 子组件
this.$emit('update:title', newTitle)

// 父组件
<child-component :title.sync="pageTitle" />`,

  4: `// 3. v-model 双向绑定

// 自定义 v-model
// 子组件
export default {
  props: ['value'],
  template: \`
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  \`
}

// 使用
<my-input v-model="username" />
// 等价于
<my-input
  :value="username"
  @input="username = $event"
/>

// 自定义 model 选项
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: \`
    <input
      type="checkbox"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
    />
  \`
}

// 使用
<my-checkbox v-model="isChecked" />
// 等价于
<my-checkbox
  :checked="isChecked"
  @change="isChecked = $event"
/>`,

  5: `// 4. $ref / $parent 直接访问

// 使用 $ref 访问子组件
export default {
  data() {
    return { parentData: '父数据' }
  },
  methods: {
    callChildMethod() {
      // 通过 $refs 访问子组件实例
      this.$refs.childComponent.childMethod()
      // 或访问 DOM 元素
      this.$refs.childInput.focus()
    }
  },
  template: \`
    <div>
      <child-component ref="childComponent" />
      <input ref="childInput" />
      <button @click="callChildMethod">调用子组件方法</button>
    </div>
  \`
}

// 使用 $parent 访问父组件
export default {
  methods: {
    accessParent() {
      // 访问父组件实例
      // this.$parent.parentData
      // 调用父组件方法
      // this.$parent.parentMethod()
    }
  }
}

// ⚠️ 注意事项
// • $refs 只在组件渲染完成后可用
// • 避免在模板或计算属性中访问 $refs
// • $parent 造成紧耦合，不推荐使用`,

  6: `// 5. provide / inject 跨级通信

// 祖先组件提供数据
export default {
  data() {
    return {
      theme: 'dark',
      userInfo: { name: '张三', role: 'admin' }
    }
  },
  provide() {
    // 提供响应式数据
    return {
      theme: this.theme,
      userInfo: this.userInfo,
      // 提供方法
      updateUser: this.updateUser
    }
  },
  methods: {
    updateUser(newInfo) {
      this.userInfo = { ...this.userInfo, ...newInfo }
    }
  }
}

// 后代组件注入数据
export default {
  inject: {
    // 数组语法
    theme: 'default-theme',
    userInfo: 'default-user',
    updateUser: {
      from: 'updateUser',  // 可重命名
      default: () => {}
    }
  },
  // 或对象语法（更推荐）
  inject: {
    theme: {
      from: 'theme',
      default: 'light'
    },
    userInfo: {
      default: () => ({})
    }
  },
  computed: {
    displayInfo() {
      return this.userInfo.name || '未知用户'
    }
  },
  template: \`
    <div :class="theme">
      {{ displayInfo }}
      <button @click="updateUser({ name: '李四' })">更新</button>
    </div>
  \`
}

// ⚠️ provide 的响应式问题
// ❌ 直接提供 data 不是响应式的
provide: {
    data: this.data
  }

// ✅ 提供对象的 getter
provide() {
    return {
      data: () => this.data
    }
  }

// 或使用 Vue.observable
provide: {
    reactiveData: Vue.observable(this.data)
  }`,

  7: `// 6. $children / $listeners 访问

// $children 访问子组件
export default {
  methods: {
    validateChildren() {
      // 遍历所有子组件
      this.$children.forEach(child => {
        if (child.validate) {
          child.validate()
        }
      })
    }
  }
}

// $listeners 访问所有监听器
export default {
  created() {
    // 可以访问所有监听器
    // { click: fn, custom-event: fn }
  },
  template: \`
    <div v-on="$listeners">
      <!-- 将所有监听器绑定到根元素 -->
    </div>
  \`
}

// inheritAttrs = false 结合使用
export default {
  inheritAttrs: false,
  template: \`
    <div v-bind="$attrs">
      <!-- $attrs 包含所有未在 props 中声明的属性 -->
    </div>
  \`
}`,

  8: `// 7. Event Bus 事件总线

// 创建事件总线
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件 A 发送事件
import { EventBus } from './event-bus'

export default {
  methods: {
    notifyGlobal() {
      EventBus.$emit('global-event', {
        message: '全局消息',
        data: { /* ... */ }
      })
    }
  }
}

// 组件 B 接收事件
import { EventBus } from './event-bus'

export default {
  created() {
    EventBus.$on('global-event', this.handleEvent)
  },
  methods: {
    handleEvent(payload) {
      // 处理事件
    }
  },
  beforeDestroy() {
    // 移除监听器
    EventBus.$off('global-event', this.handleEvent)
  }
}

// ⚠️ Vue 3 移除了 $on/$off
// 推荐使用 mitt 或事件库替代

// 使用 mitt
import mitt from 'mitt'
const EventBus = mitt()
EventBus.on('foo', e => {
  // 处理事件
})
EventBus.emit('foo', { a: 'b' })`,

  9: `// 8. Vuex 状态管理

// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user: null
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    async fetchUser({ commit }) {
      const user = await api.getUser()
      commit('SET_USER', user)
    }
  },
  getters: {
    doubleCount: state => state.count * 2,
    isLoggedIn: state => !!state.user
  }
})

// 组件中使用
export default {
  computed: {
    ...mapState(['count', 'user']),
    ...mapGetters(['doubleCount', 'isLoggedIn'])
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapMutations(['INCREMENT']),
    increment() {
      this.INCREMENT()
    }
  }
}

// 或者使用 this.$store
this.$store.state.count
this.$store.commit('INCREMENT')
this.$store.dispatch('fetchUser')
this.$store.getters.doubleCount`,

  10: `// 通信方式选择指南

// 根据场景选择通信方式

1. 父子直接通信
   • 父 → 子：Props
   • 子 → 父：Events ($emit)
   • 双向绑定：v-model

2. 跨层级通信
   • 简单场景：provide/inject
   • 复杂场景：Vuex
   • 兄弟通信：Event Bus（Vue 2）/ Vuex

3. 访问组件实例
   • 父访问子：$refs
   • 子访问父：$parent（不推荐）
   • 访问所有子：$children（不推荐）

4. 全局通信
   • 状态管理：Vuex / Pinia
   • 事件通信：Event Bus（Vue 2）
   • 原生事件：window.addEventListener / postMessage

// 选择建议
// • 能用 Props/Events 就不用 provide/inject
// • 能用 provide/inject 就不用 Vuex
// • 能用 Vuex 就不用 Event Bus
// • 优先选择耦合度低的方式`
}

const communicationMethods = [
  {
    name: 'Props',
    desc: '父向子传递数据',
    direction: '↓',
    color: 'var(--color-code-indigo)',
    background: 'var(--code-page-tone-info)',
    border: 'var(--code-indigo-alpha-40)'
  },
  {
    name: '$emit',
    desc: '子向父传递事件',
    direction: '↑',
    color: 'var(--color-code-green)',
    background: 'var(--code-page-tone-success)',
    border: 'var(--code-green-alpha-50)'
  },
  {
    name: 'v-model',
    desc: '双向数据绑定',
    direction: '⇅',
    color: 'var(--color-code-violet)',
    background: 'var(--code-violet-alpha-10)',
    border: 'var(--code-violet-alpha-40)'
  },
  {
    name: '$refs',
    desc: '直接访问子组件',
    direction: '→',
    color: 'var(--color-code-red)',
    background: 'var(--code-page-tone-danger)',
    border: 'var(--danger-soft-alpha-30)'
  },
  {
    name: 'provide/inject',
    desc: '跨级通信',
    direction: '↕',
    color: 'var(--code-page-warning)',
    background: 'var(--code-page-warning-soft)',
    border: 'var(--code-page-warning-border)'
  },
  {
    name: 'Vuex',
    desc: '全局状态管理',
    direction: '⌬',
    color: 'var(--code-page-pink)',
    background: 'var(--code-page-pink-soft)',
    border: 'var(--code-page-pink-border)'
  }
]

export default function Vue2CommunicationPage() {
  const [parentMessage, setParentMessage] = useState('来自父组件的消息')
  const [childMessage, setChildMessage] = useState('')
  const [sharedData, setSharedData] = useState('共享数据')

  return (
    <ContentWrapper className="code-page" title="Vue 2 组件通信" subtitle="父子、跨级组件通信方式">
      {/* 通信方式概览 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>📡 通信方式</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          {communicationMethods.map((method, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: method.background,
                borderRadius: '8px',
                border: `1px solid ${method.border}`,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{method.direction}</div>
              <h4 style={{ color: method.color, marginBottom: '0.25rem' }}>{method.name}</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--white-alpha-70)' }}>
                {method.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Props Down 演示 */}
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
          🎮 Props Down / Events Up 演示
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {/* 父组件 */}
          <div
            style={{
              padding: '1rem',
              background: 'var(--code-indigo-alpha-10)',
              borderRadius: '8px',
              border: '2px solid var(--code-indigo-alpha-30)'
            }}
          >
            <h4 style={{ color: 'var(--color-code-indigo)', marginBottom: '0.75rem' }}>父组件</h4>
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              发送数据: <span style={{ color: 'var(--color-code-indigo)' }}>{parentMessage}</span>
            </div>
            <input
              type="text"
              value={parentMessage}
              onChange={e => setParentMessage(e.target.value)}
              placeholder="输入要发送的消息"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'var(--code-page-surface-panel)',
                border: '1px solid var(--code-indigo-alpha-30)',
                borderRadius: '6px',
                color: 'white',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
            {childMessage && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-code-green)' }}>
                收到子组件: {childMessage}
              </div>
            )}
          </div>

          {/* 子组件 */}
          <div
            style={{
              padding: '1rem',
              background: 'var(--code-red-alpha-10)',
              borderRadius: '8px',
              border: '2px solid var(--code-red-alpha-30)'
            }}
          >
            <h4 style={{ color: 'var(--color-code-red)', marginBottom: '0.75rem' }}>子组件</h4>
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--white-alpha-60)',
                marginBottom: '0.5rem'
              }}
            >
              接收数据: <span style={{ color: 'var(--color-code-red)' }}>{parentMessage}</span>
            </div>
            <button
              onClick={() => setChildMessage('来自子组件的消息')}
              style={{
                padding: '0.5rem 1rem',
                background:
                  'linear-gradient(135deg, var(--color-code-red) 0%, var(--button-danger-bg-hover) 100%)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              $emit 发送消息给父组件
            </button>
          </div>
        </div>
      </div>

      {/* provide/inject 演示 */}
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
          🌳 provide / inject 跨级通信
        </h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          祖先组件提供数据，所有后代组件都可以注入使用
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
            <h5 style={{ color: 'var(--color-code-indigo)', marginBottom: '0.5rem' }}>
              祖先 (provide)
            </h5>
            <button
              onClick={() => setSharedData('共享数据: ' + Date.now().toLocaleTimeString())}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--code-indigo-alpha-20)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              更新共享数据
            </button>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h5 style={{ color: 'var(--color-code-green)', marginBottom: '0.5rem' }}>
              后代 (inject)
            </h5>
            <div
              style={{
                padding: '0.75rem',
                background: 'var(--code-page-surface-panel)',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            >
              共享数据: <span style={{ color: 'var(--color-code-green)' }}>{sharedData}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 选择指南 */}
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>
          ⚠️ 通信方式选择指南
        </h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>父子通信</strong>：优先使用 Props / Events
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>跨级通信</strong>：使用 provide / inject
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>兄弟通信</strong>：通过共同父组件或 Vuex
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>复杂状态</strong>：使用 Vuex 集中管理
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>避免使用</strong>：$parent、$children（耦合度高）
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
