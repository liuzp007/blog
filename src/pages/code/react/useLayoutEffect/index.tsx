import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。
  在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新`,
  2: `useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的`,
  3: `使用服务端渲染时，无论 useLayoutEffect 还是 useEffect 都无法在 Javascript 代码加载完成之前执行.
  服务端渲染组件中引入 useLayoutEffect 代码时会触发 React 告警，解决这个问题，需要将代码逻辑移至 useEffect 中或使用 useEffectLayoutEffect 替代`,
  4: `// 基本用法
useLayoutEffect(() => {
  // DOM 更新后，浏览器绘制前执行

  return () => {
    // 清理函数
  };
}, [dependencies]);`,
  5: `// 读取 DOM 布局
function MeasureElement() {
  const [height, setHeight] = useState(0);
  const ref = useRef();

  useLayoutEffect(() => {
    // 在浏览器绘制前读取布局
    const rect = ref.current.getBoundingClientRect();
    setHeight(rect.height);
  });

  return <div ref={ref}>Height: {height}px</div>;
}`
}

export default function UseLayoutEffect() {
  return (
    <ContentWrapper className="code-page" title="useLayoutEffect Hook" subtitle="同步读取 DOM 布局">
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
            • 需要同步读取 DOM 布局（getBoundingClientRect、offsetHeight 等）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• 需要在浏览器绘制前同步修改 DOM</li>
          <li style={{ marginBottom: '0.5rem' }}>• 避免画面闪烁（如滚动位置恢复）</li>
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
          <li style={{ marginBottom: '0.5rem' }}>• 会阻塞浏览器绘制，谨慎使用</li>
          <li style={{ marginBottom: '0.5rem' }}>• 服务端渲染时会报警告，需配合 useEffect 使用</li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 优先使用 useEffect，只在必要时使用 useLayoutEffect
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• 可能影响性能，避免执行耗时操作</li>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>
          🔄 useLayoutEffect vs useEffect
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'var(--white-alpha-80)'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--code-indigo-alpha-30)' }}>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-indigo)' }}
              >
                特性
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-indigo)' }}
              >
                useLayoutEffect
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-indigo)' }}
              >
                useEffect
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>执行时机</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-pink)' }}>
                DOM 更新后，绘制前（同步）
              </td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>
                绘制后（异步）
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>是否阻塞绘制</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-pink)' }}>是</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>否</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>SSR 兼容</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-pink)' }}>警告（需处理）</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>完全兼容</td>
            </tr>
          </tbody>
        </table>
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>📝 实际示例</h3>
        <BeautifyCode
          code={`// 防止闪烁的滚动位置恢复
function ScrollContainer() {
  const containerRef = useRef();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    // 在绘制前恢复滚动位置，用户看不到跳动
    containerRef.current.scrollTop = position.top;
    containerRef.current.scrollLeft = position.left;
  }, [position]);

  const handleScroll = () => {
    setPosition({
      top: containerRef.current.scrollTop,
      left: containerRef.current.scrollLeft
    });
  };

  return (
    <div ref={containerRef} onScroll={handleScroll} style={{ height: '100vh', overflow: 'auto' }}>
      {/* 内容 */}
    </div>
  );
}

// 动态测量元素
function AutoResize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef();

  useLayoutEffect(() => {
    // 同步读取布局，更新状态
    const { width, height } = ref.current.getBoundingClientRect();
    setSize({ width, height });
  }, []);

  return (
    <div ref={ref} style={{ width: size.width, height: size.height, transition: 'all 0.3s' }}>
      Size: {size.width} x {size.height}
    </div>
  );
}`}
        />
      </div>
    </ContentWrapper>
  )
}
