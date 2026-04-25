import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

const list = {
  B: ` componentDidMount 生命周期函数
    · 在DOM挂载结束后执行（在 render() 执行后立即执行）
    · 在这一步虚拟DOM转换成真实DOM
    · 一般在这个函数内做一些消息订阅发布、开启定时器、开始网络请求等操作
    · 可以使用 setState() 方法触发重新渲染 (re-render)
    · 只会执行一次
    `,
  C: ` componentWillUnmount 生命周期函数
    · 在组件卸载(unmounted)或销毁(destroyed)之前执行
    · 做一些清理操作，比如无效的timers、interval，或者取消网络请求，
    · 清理任何在 componentDidMount() 中创建的DOM元素(elements);
    · 这是完全卸载组件前执行的最后一步
    `
}

export default function ComponentDidMount() {
  return (
    <ContentWrapper
      className="code-page"
      title="componentDidMount & componentWillUnmount"
      subtitle="类组件生命周期方法"
    >
      <BeautifyCodeList list={list} />

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
            • componentDidMount：数据获取、订阅事件、初始化第三方库
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • componentWillUnmount：清理定时器、取消订阅、清理请求
          </li>
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
          <li style={{ marginBottom: '0.5rem' }}>
            • componentDidMount 中调用 setState 会触发额外渲染
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • componentWillUnmount 中不能调用 setState（组件即将卸载）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• 确保清理所有副作用，避免内存泄漏</li>
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
          🔄 Hooks 等价写法
        </h3>
        <BeautifyCode
          code={`// componentDidMount
useEffect(() => {
  // 组件挂载后执行一次（相当于 componentDidMount）

  return () => {
    // 清理函数（相当于 componentWillUnmount）
  };
}, []); // 空依赖数组表示只执行一次

// 带依赖的 effect
useEffect(() => {
  const timer = setInterval(() => {
    // 定时器逻辑
  }, 1000);

  return () => clearInterval(timer); // 清理定时器
}, [propValue]); // propValue 变化时重新执行`}
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>📝 完整示例</h3>
        <BeautifyCode
          code={`// 类组件
class DataFetcher extends Component {
  state = { data: null, loading: false };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true });
    const data = await api.getData();
    this.setState({ data, loading: false });
  };

  componentWillUnmount() {
    // 取消未完成的请求
    if (this.request) {
      this.request.abort();
    }
  }

  render() {
    const { data, loading } = this.state;
    if (loading) return <Spinner />;
    return <div>{data}</div>;
  }
}

// 函数组件等价写法
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let aborted = false;

    const fetchData = async () => {
      setLoading(true);
      const result = await api.getData();
      if (!aborted) {
        setData(result);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      aborted = true; // 清理标记
    };
  }, []);

  if (loading) return <Spinner />;
  return <div>{data}</div>;
}`}
        />
      </div>
    </ContentWrapper>
  )
}
