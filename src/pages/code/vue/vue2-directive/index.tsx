import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'

const data = {
  1: `Vue 2 的指令系统提供了强大的模板操作能力
    指令以 v- 开头，用于在模板中应用特殊行为`,
  2: `// 内置指令列表

// 文本插值
{{ message }}           // 文本插值
v-text="message"        // 等价于 {{ }}
v-html="rawHtml"        // 解析 HTML

// 条件渲染
v-if="condition"        // 条件为真时渲染
v-else-if="condition"   // else if 条件
v-else                // else 块
v-show="condition"      // 切换 display

// 列表渲染
v-for="item in items"
v-for="(item, index) in items"
v-for="(value, key) in object"
v-for="(value, key, index) in object"

// 事件绑定
v-on:click="handler"        // 简写 @click="handler"
v-on:click.native="nativeHandler"

// 属性绑定
v-bind:href="url"           // 简写 :href="url"
v-bind:class="{ active: isActive }"
v-bind:style="{ color: textColor }"

// 双向绑定
v-model="message"

// 其他指令
v-cloak       // 编译前隐藏，配合 [v-cloak] { display: none }
v-once        // 只渲染一次
v-pre         // 跳过编译
v-slot        // 插槽`,

  3: `// v-if vs v-show

// v-if：真正的条件渲染
<div v-if="isActive">显示内容</div>
<div v-else-if="isPending">嘘，好戏即将开场...</div>
<div v-else>隐藏内容</div>

// 特点
// • 条件为 false 时元素不存在于 DOM
// • 有较高的切换开销（创建/销毁）
// • 适合条件很少改变的场景

// v-show：简单的显示/隐藏
<div v-show="isActive">显示内容</div>

// 特点
// • 元素始终存在于 DOM
// • 使用 CSS display 切换
// • 有较高的初始渲染开销
// • 适合频繁切换的场景

// 选择建议
// 频繁切换 → v-show
// 条件很少改变 → v-if`,

  4: `// v-for 的 key

// 基础用法
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>

// key 的作用
// • 帮助 Vue 识别节点
// • 优化 DOM 复用
// • 提高列表渲染性能

// 不使用 key 的问题
// • 列表重排时可能复用错误的 DOM
// • 输入框内容可能错乱
// • 动画可能出现异常

// key 选择原则
// ✅ 唯一、稳定的 id
<li v-for="user in users" :key="user.id">

// ❌ 不要使用 index
<li v-for="(user, index) in users" :key="index">

// ⚠️ 随机数也不合适
<li v-for="item in items" :key="Math.random()">`,

  5: `// v-model 修饰符

// .lazy：改为 change 事件触发
<input v-model.lazy="message" />
// 默认是 input 事件，lazy 改为 change 事件

// .number：自动转为数字
<input v-model.number="age" type="number" />
// 输入自动转为 Number 类型

// .trim：自动去除首尾空格
<input v-model.trim="username" />
// 自动去除输入的首尾空格

// 组合使用
<input v-model.trim.number="price" />

// 自定义组件的 v-model
// Vue 2 默认使用 value prop 和 input 事件
Vue.component('my-input', {
  props: ['value'],
  template: \`
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  \`
})

// 自定义 model 选项
Vue.component('my-checkbox', {
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
})`,

  6: `// 事件修饰符

// .stop：阻止事件冒泡
<button @click.stop="doThis">阻止冒泡</button>

// .prevent：阻止默认行为
<form @submit.prevent="onSubmit">阻止表单提交</form>

// .capture：添加事件监听器时使用捕获模式
<div @click.capture="doThis">...</div>

// .self：只在事件从元素本身触发时才执行
<div @click.self="doThat">...</div>

// .once：只触发一次
<button @click.once="doOnce">只执行一次</button>

// .passive：滚动事件的默认行为立即执行
<div @scroll.passive="onScroll">滚动优化</div>

// 按键修饰符
<input @keyup.enter="submit" />
<input @keyup.13="submit" />  // keyCode 旧写法
<input @keyup.page-down="onPageDown" />

// 系统修饰符
<button @click.ctrl="onClick">Ctrl + Click</button>
<button @click.meta="onClick">Cmd/Meta + Click</button>

// 鼠标修饰符
<button @click.left="onClick">左键</button>
<button @click.right="onRightClick">右键</button>`,

  7: `// 自定义指令

// 全局注册
Vue.directive('focus', {
  // 只调用一次，指令第一次绑定到元素时
  bind(el, binding, vnode) {
    el.focus()
  },
  // 被绑定元素插入父节点时调用
  inserted(el, binding, vnode) {},
  // 所在组件的 VNode 更新时调用
  update(el, binding, vnode, oldVnode) {},
  // 指令所在组件的 VNode 及子 VNode 全部更新后调用
  componentUpdated(el, binding, vnode, oldVnode) {},
  // 只调用一次，指令与元素解绑时
  unbind(el, binding, vnode) {}
})

// 使用
<input v-focus />

// 钩子参数
// • el：指令绑定的元素
// • binding：对象 { name, value, oldValue, expression, arg, modifiers }
// • vnode：Vue 编译的虚拟节点
// • oldVnode：上一个虚拟节点

// binding 对象
Vue.directive('color', {
  bind(el, binding) {
    el.style.color = binding.value
    // binding.name = 'color'
    // binding.value = 'red'
    // binding.expression = 'color'
    // binding.arg = 'color'
    // binding.modifiers = {}
  }
})

// 带参数的指令
<div v-color:text="'blue'">文字</div>
<div v-color:text="textColor">文字</div>

// 带修饰符的指令
<div v-text-format.uppercase="message">文字</div>
// modifiers: { uppercase: true }`,

  8: `// 常用自定义指令示例

// 1. 权限指令
Vue.directive('permission', {
  inserted(el, binding) {
    const { value } = binding
    if (!checkPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
})

// 使用
<button v-permission="'user:edit'">编辑</button>

// 2. 无限滚动
Vue.directive('infinite-scroll', {
  inserted(el, binding) {
    const callback = binding.value
    el.addEventListener('scroll', () => {
      if (el.scrollHeight - el.scrollTop === el.clientHeight) {
        callback()
      }
    })
  }
})

// 使用
<div v-infinite-scroll="loadMore">...</div>

// 3. 复制到剪贴板
Vue.directive('copy', {
  bind(el, binding) {
    el.value = binding.value
    el.$copy = () => {
      navigator.clipboard.writeText(binding.value)
    }
    el.addEventListener('click', el.$copy)
  },
  unbind(el) {
    el.removeEventListener('click', el.$copy)
  }
})

// 4. 防抖指令
Vue.directive('debounce', {
  inserted(el, binding) {
    let timer
    el.addEventListener('click', () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
      }, 500)
    })
  }
})`,

  9: `// v-cloak 解决闪烁

// 问题：页面加载时显示 {{ message }} 模板语法
// 解决：使用 v-cloak

// CSS
[v-cloak] {
  display: none;
}

// HTML
<div v-cloak>
  {{ message }}
</div>

// 工作原理
// 1. Vue 编译前元素有 v-cloak 属性
// 2. CSS 隐藏带 v-cloak 的元素
// 3. Vue 编译完成后移除 v-cloak
// 4. 元素显示，显示的是渲染后的内容`,

  10: `// v-once 静态优化

// 只渲染元素一次，后续更新跳过
<span v-once>{{ message }}</span>

// 使用场景
// • 静态内容优化
// • 大量列表中不变的项
<div v-for="item in items">
  <span v-once>{{ item.id }}</span>  // 不变
  <span>{{ item.name }}</span>          // 可能变化
</div>

// 注意事项
// • 不要对需要响应式更新的内容使用 v-once
// • 子元素也会跳过更新
// • 适合纯展示内容`
}

const directiveCategories = [
  {
    name: '文本渲染',
    directives: ['v-text', 'v-html', '{{ }}'],
    color: 'var(--color-code-indigo)',
    surface: 'var(--code-indigo-alpha-10)',
    border: 'var(--code-indigo-alpha-40)'
  },
  {
    name: '条件渲染',
    directives: ['v-if', 'v-else-if', 'v-else', 'v-show'],
    color: 'var(--color-code-green)',
    surface: 'var(--code-green-alpha-10)',
    border: 'var(--code-green-alpha-50)'
  },
  {
    name: '列表渲染',
    directives: ['v-for', ':key'],
    color: 'var(--color-code-red)',
    surface: 'var(--code-red-alpha-10)',
    border: 'var(--code-red-alpha-30)'
  },
  {
    name: '属性绑定',
    directives: ['v-bind', ':class', ':style', ':href'],
    color: 'var(--color-code-violet)',
    surface: 'var(--code-violet-alpha-10)',
    border: 'var(--code-violet-alpha-40)'
  },
  {
    name: '事件绑定',
    directives: ['v-on', '@click', '@submit'],
    color: 'var(--code-page-warning)',
    surface: 'var(--code-page-warning-soft)',
    border: 'var(--code-page-warning-border)'
  },
  {
    name: '双向绑定',
    directives: ['v-model', '.lazy', '.number', '.trim'],
    color: 'var(--code-page-pink)',
    surface: 'var(--code-page-pink-soft)',
    border: 'var(--code-page-pink-border)'
  }
]

export default function Vue2DirectivePage() {
  const [showElement, setShowElement] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState([
    { id: 1, name: '苹果' },
    { id: 2, name: '香蕉' },
    { id: 3, name: '橙子' }
  ])
  const [hoverCount, setHoverCount] = useState(0)

  return (
    <ContentWrapper className="code-page" title="Vue 2 指令" subtitle="模板指令的完整指南">
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>📜 指令分类</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          {directiveCategories.map((cat, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: cat.surface,
                borderRadius: '8px',
                border: `1px solid ${cat.border}`
              }}
            >
              <h4 style={{ color: cat.color, marginBottom: '0.5rem', fontSize: '1rem' }}>
                {cat.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--white-alpha-70)' }}>
                {cat.directives.join(', ')}
              </div>
            </div>
          ))}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🎮 指令演示</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {/* v-if/v-show 演示 */}
          <div>
            <h4
              style={{ color: 'var(--color-white)', marginBottom: '0.75rem', fontSize: '0.875rem' }}
            >
              v-if / v-show
            </h4>
            <button
              onClick={() => setShowElement(!showElement)}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--code-indigo-alpha-20)',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--color-white)',
                cursor: 'pointer',
                marginBottom: '0.75rem'
              }}
            >
              切换显示
            </button>
            <div
              style={{
                padding: '1rem',
                background: 'var(--code-indigo-alpha-10)',
                borderRadius: '8px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showElement ? (
                <span style={{ color: 'var(--color-code-green)' }}>元素已显示 (v-if)</span>
              ) : (
                <span style={{ color: 'var(--white-alpha-30)' }}>元素已隐藏</span>
              )}
            </div>
          </div>

          {/* v-model 演示 */}
          <div>
            <h4
              style={{ color: 'var(--color-white)', marginBottom: '0.75rem', fontSize: '0.875rem' }}
            >
              v-model (双向绑定)
            </h4>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="输入内容..."
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'var(--code-page-surface-panel)',
                border: '1px solid var(--code-indigo-alpha-30)',
                borderRadius: '6px',
                color: 'var(--color-white)',
                marginBottom: '0.75rem'
              }}
            />
            <div
              style={{
                padding: '0.5rem',
                background: 'var(--code-indigo-alpha-10)',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            >
              输入值:{' '}
              <span style={{ color: 'var(--color-code-indigo)' }}>{inputValue || '(空)'}</span>
            </div>
          </div>

          {/* v-for 演示 */}
          <div>
            <h4
              style={{ color: 'var(--color-white)', marginBottom: '0.75rem', fontSize: '0.875rem' }}
            >
              v-for (列表渲染)
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map(item => (
                <li
                  key={item.id}
                  onMouseEnter={() => setHoverCount(item.id)}
                  style={{
                    padding: '0.5rem',
                    background:
                      hoverCount === item.id
                        ? 'var(--code-green-alpha-20)'
                        : 'var(--code-indigo-alpha-10)',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.id}. {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 事件修饰符 */}
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>⚡ 事件修饰符</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {[
            { name: '.stop', desc: '阻止冒泡' },
            { name: '.prevent', desc: '阻止默认' },
            { name: '.capture', desc: '捕获模式' },
            { name: '.self', desc: '自身触发' },
            { name: '.once', desc: '只触发一次' },
            { name: '.passive', desc: '滚动优化' },
            { name: '.enter', desc: '回车键' },
            { name: '.ctrl', desc: 'Ctrl键' }
          ].map((mod, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                background: 'var(--code-violet-alpha-05)',
                borderRadius: '6px',
                border: '1px solid var(--code-violet-alpha-20)'
              }}
            >
              <code style={{ color: 'var(--color-code-violet)', fontSize: '0.875rem' }}>
                {mod.name}
              </code>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--white-alpha-60)',
                  marginTop: '0.25rem'
                }}
              >
                {mod.desc}
              </div>
            </div>
          ))}
        </div>
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 最佳实践</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>v-for 必须配合 key</strong>，使用稳定的唯一标识
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>v-if 和 v-for 不要同时使用</strong>，使用 template 包裹或计算属性
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>频繁切换用 v-show</strong>，很少切换用 v-if
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>使用 v-once 优化静态内容</strong>，减少不必要的渲染
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
