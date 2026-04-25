import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 的组件系统是其核心功能之一
    组件是可复用的 Vue 实例，通过 props 传递数据`,
  2: `// 基本组件定义
import { createApp } from 'vue'

// 父组件
const Father = {
  template: \`
    <div>
      <h2>父组件</h2>
      <p>父组件数据: {{ message }}</p>
      <child @message="handleChildMessage" />
    </div>
  \`
}

// 子组件
const Child = {
  props: ['message'],
  template: \`
    <div>
      <h3>子组件</h3>
      <p>来自父组件: {{ message }}</p>
      <button @click="notifyParent">通知父组件</button>
    </div>
  \`,
  methods: {
    notifyParent() {
      this.$emit('child-event', '来自子组件的消息')
    }
  }
}

// 创建应用
createApp('#app').component('Child', {
  propsData: {
    message: 'Hello from Parent!'
  }
})`,
  3: `// 动态组件
Vue 支持动态组件的创建

// 1. 効态组件使用场景
//    • 根据用户权限动态加载不同组件
//    • 根据条件渲染不同内容
//    • 动态表单字段生成

// 2. 动态组件基础
const AsyncComponent = () => import('./DynamicComponent.vue')
const DynamicComponent = resolveComponent(() => import('./DynamicComponent.vue'))

// 3. 组件递归
// 组件可以包含自身，形成树形结构
const TreeItem = {
  name: 'TreeItem',
  template: \`
    <div>
      <span>{{ item.name }}</span>
      <tree-children :data="item.children">
        <tree-item v-for="child in item.children" :item="child" />
      </tree-children>
    </div>
  \`
}

// 4. 组件通信
// 父子组件通信的方式有多种：props down、$emit up、$parent/$children、provide/inject、Event Bus

// 父向子传递：props
export default {
  data() {
    return { parentMessage: '' }
  },
  methods: {
    handleChildMessage(msg) {
      this.parentMessage = msg
    }
  },
  template: \`
    <div>
      <h2>父组件</h2>
      <p>来自子组件：{{ parentMessage }}</p>
      <child @msg-from-child="handleChildMessage" />
    </div>
  \`
}

// 子向父传递：$emit
const ChildComponent = {
  template: \`
    <button @click="sendToParent">发送消息给父组件</button>
  \`,
  methods: {
    sendToParent() {
      this.$emit('custom-event', '来自子组件的数据')
    }
  }
}

// 5. 插槽 Slots
// 插槽是 Vue 中分发内容的强大机制
// 父组件可以在模板中预留插槽，子组件可以填充具体内容

const ParentWithSlot = {
  template: \`
    <div class="container">
      <header>
        <slot name="header">默认标题</slot>
      </header>
      <main>
        <slot name="content">默认内容</slot>
      </main>
      <footer>
        <slot name="footer">默认页脚</slot>
      </footer>
    </div>
  \`
}

const ChildWithSlot = {
  template: \`
    <div class="child-container">
      <h3>子组件</h3>
      <slot name="header">
        <template #header="{ props }">
          <h1>{{ props.title }}</h1>
        </template>
      </slot>
      <slot>
        <p>主要内容区域</p>
      </slot>
      <slot name="footer">
        <p>页脚区域</p>
      </slot>
    </div>
  \`
}

 // 6. 混合组件 Mixins
// Mixins 是一种分发 Vue 组件可复用功能的灵活方式
// 注意：Vue 3 中 Composition API 已基本替代 Mixins

const MyMixin = {
  created() {
    // 组件已创建
  },
  methods: {
    sayHello() {
      // 问候逻辑
    }
  }
}

export default {
  mixins: [MyMixin],
  template: \`
    <div>
      <button @click="sayHello">调用 Mixin 方法</button>
    </div>
  \`
}
`
}

export default function Components() {
  return (
    <ContentWrapper className="code-page" title="Vue 组件系统" subtitle="可复用模块的构建与通信">
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>📦 组件基础</h3>

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
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝 组件定义</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}>
              通过 template + props + methods 定义
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔄 数据通信</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}>
              props down、$emit up、provide/inject
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎨 插槽 Slots</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}>
              分发内容、具名/作用域插槽
            </div>
          </div>
        </div>
      </div>

      {/* 动态组件 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🔧 动态组件</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>动态加载</strong>：import() 动态导入组件
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>异步组件</strong>：defineAsyncComponent 异步定义
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>条件渲染</strong>：v-if、v-show 控制显示
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>组件递归</strong>：树形结构的组件嵌套
          </li>
        </ul>
      </div>

      {/* 组件通信示例 */}
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 通信方式对比</h3>
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
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>父 → 子</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}>Props 传递</div>
            <div
              style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-code-green)' }}
            >
              单向数据流
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>子 → 父</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}>
              事件触发 $emit
            </div>
            <div
              style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-code-green)' }}
            >
              双向绑定 v-model
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>跨级通信</div>
            <div
              style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-code-green)' }}
            >
              provide/inject
            </div>
            <div
              style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-code-green)' }}
            >
              事件总线 Event Bus
            </div>
          </div>
        </div>
      </div>

      {/* 插槽示例 */}
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>🎨 插槽示例</h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          父组件使用 <code>&lt;slot name="xxx"&gt;</code> 预留位置，子组件可以填充具体内容
        </p>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>默认插槽</strong>：没有 name 时作为默认内容
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>具名插槽</strong>：使用 name 属性指定多个插槽
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>作用域插槽</strong>：限制插槽内容访问范围
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
