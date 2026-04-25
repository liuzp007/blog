import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'
import CodeBlock from '@/components/code-block'

const data = {
  1: `useImperativeHandle 可以在使用 ref 时自定义暴露给父组件的实例值（父拿子的方法或者状态）`,
  2: `useImperativeHandle(ref, createHandle, [deps])，第一个参数为父组件传过来的ref，
  第二个参数为一个回调返回值是一个对象，对象的value就是子组件的要暴露给父组件的方法。
  第三个参数是可选参数，和useMemo，useEffect的可选参数一样，是一个依赖数组每当依赖列表中的值发生改变时，createHandle才会重新计算`,
  3: `React 会确保 dispatch 函数的标识是稳定的，并且不会在组件重新渲染时改变，createHandle 也只在依赖变化时重新计算`,
  4: `import React, { useRef, useImperativeHandle, forwardRef } from 'react';

function FancyInput(props, ref) {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    reset: () => {
      inputRef.current.value = '';
    }
  }));

  return <input ref={inputRef} {...props} />;
}

export default forwardRef(FancyInput);`,
  5: `// 父组件中使用
import React, { useRef, useEffect } from 'react';
import FancyInput from './FancyInput';

function Parent() {
  const childInputRef = useRef(null);

  useEffect(() => {
    // 调用子组件暴露的方法
    childInputRef.current.focus();
    childInputRef.current.reset();
  }, []);

  return <FancyInput ref={childInputRef} />;
}`
}

export default function UseImperativeHandle() {
  return (
    <ContentWrapper
      className="code-page"
      title="useImperativeHandle Hook"
      subtitle="自定义 ref 暴露给父组件的实例"
    >
      <BeautifyCodeList list={data} />

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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>💡 使用场景</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • 需要父组件调用子组件的方法（如 focus、scroll 等）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• 不想暴露整个 DOM 元素，只想暴露特定方法</li>
          <li style={{ marginBottom: '0.5rem' }}>• 封装第三方组件时，提供统一的 API 接口</li>
        </ul>
      </div>

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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 注意事项</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• 必须配合 forwardRef 使用</li>
          <li style={{ marginBottom: '0.5rem' }}>• 暴露的方法应该是稳定的，避免频繁变化</li>
          <li style={{ marginBottom: '0.5rem' }}>• 过度使用会破坏组件的封装性</li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 优先考虑使用 props 传递回调，而不是命令式调用
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ color: 'var(--color-code-green)', margin: '0 0 8px 0' }}>📝 完整示例</h3>
        <CodeBlock
          language="tsx"
          code={`// 子组件 - Modal 框
import { forwardRef, useImperativeHandle, useState } from 'react';

const Modal = forwardRef(({ children }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  // 只暴露 open 和 close 方法
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    isOpen: () => isOpen,
  }), []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={() => setIsOpen(false)}>关闭</button>
      </div>
    </div>
  );
});

export default Modal;

// 父组件
import { useRef } from 'react';
import Modal from './Modal';

function App() {
  const modalRef = useRef(null);

  const handleOpenModal = () => {
    modalRef.current?.open(); // 通过 ref 控制模态框
  };

  return (
    <div>
      <button onClick={handleOpenModal}>打开模态框</button>
      <Modal ref={modalRef}>
        <h2>这是模态框内容</h2>
      </Modal>
    </div>
  );
}`}
        />
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-violet-alpha-10)',
          border: '1px solid var(--code-violet-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>🔗 替代方案</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • 使用状态提升：将状态放在父组件，通过 props 传递
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• 使用 Context API：跨组件共享状态和方法</li>
          <li style={{ marginBottom: '0.5rem' }}>• 使用状态管理库：Redux、Zustand 等</li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
