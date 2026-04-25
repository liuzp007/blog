import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `useCallback 和 useMemo 类似，接受两个参数，第一个参数是一个函数，
  第二个参数是Array,Array里的依赖项发生变化，更新第一个回调。`,
  2: `主要作用是缓存函数引用，减少不必要的渲染，例如不使用useCallback，
  在父组件中创建了一个名为handleClick的事件处理函数，
  根据需求我们需要把这个handleClick传给子组件，
  当父组件中的一些state变化后（这些state跟子组件没有关系），
  父组件会reRender，然后会重新创建名为handleClick函数实例，
  并传给子组件，这时即使用React.memo把子组件包裹起来，子组件也会重新渲染，
  因为props已经变化了，但这个渲染是无意义的`,
  3: `const handleClick = useCallback(() => {
  // 处理逻辑
}, [total]) //  只有 total 改变的时候，重新创建这个函数实例`,
  4: `useCallback(fn, deps) 相当于 useMemo(() => fn, deps)
  即：缓存一个函数，而不是计算结果`,
  5: `每次渲染时，useCallback 返回的都是同一个函数实例（依赖未变时）`,
  6: `// 基本使用
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// 带参数的回调
const handleClick = useCallback((id) => {
  setSelectedId(id);
}, []);`
}

export default function UseCallback() {
  return (
    <ContentWrapper
      className="code-page"
      title="useCallback Hook"
      subtitle="缓存函数引用，优化子组件渲染"
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>
          💡 为什么要用 useCallback
        </h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• 保持函数引用稳定，避免子组件不必要的重渲染</li>
          <li style={{ marginBottom: '0.5rem' }}>• 当函数作为 useEffect 的依赖时，避免无限循环</li>
          <li style={{ marginBottom: '0.5rem' }}>• 配合 React.memo 包裹的子组件使用效果最佳</li>
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 常见误区</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • 不要为了&quot;优化&quot;而包装所有函数，useCallback 本身也有开销
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 如果不传递给子组件或作为其他 Hook 的依赖，通常不需要
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• 依赖数组必须准确，否则可能捕获到过期的值</li>
        </ul>
      </div>

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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>📝 实际示例</h3>
        <BeautifyCode
          code={`// 父组件
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // 不使用 useCallback：每次 Parent 重渲染都会创建新函数
  // const handleClick = () => {};

  // 使用 useCallback：只有 count 变化时才重新创建
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, [count]);

  return <Child onClick={handleClick} name={name} />;
}

// 子组件用 React.memo 包裹
const Child = React.memo(({ onClick, name }) => {
  return <button onClick={onClick}>{name}</button>;
});`}
        />
      </div>
    </ContentWrapper>
  )
}
