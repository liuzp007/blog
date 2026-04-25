import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

const list = {
  B: ` componentWillMount 生命周期函数（已废弃）
    · 在 DOM 挂载前、render 执行前调用
    · 在 React 17+ 中被重命名为 UNSAFE_componentWillMount
    · 在 React 18 中已完全移除

    废弃原因：
    - 建议在 componentDidMount 中执行初始化
    - 服务端渲染时也会调用（但无法使用 DOM）
    - 未来异步渲染可能导致多次调用
    `,
  C: ` componentWillUnmount 生命周期函数
    · 在组件卸载(unmounted)或销毁(destroyed)之前执行
    · 做一些清理操作，比如无效的timers、interval，或者取消网络请求，
    · 清理任何在 componentDidMount() 中创建的DOM元素(elements);
    · 这是完全卸载组件前执行的最后一步
    `
}

export default function WillMount() {
  return (
    <ContentWrapper
      className="code-page"
      title="componentWillMount (已废弃)"
      subtitle="了解历史，拥抱未来"
    >
      <BeautifyCodeList list={list} />

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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 为什么废弃</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>时机问题</strong>：在 render 前调用，但此时 DOM 未准备好
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>SSR 问题</strong>：服务端渲染时也会调用，但无法访问浏览器 API
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>双重调用</strong>：React 18 的并发特性可能导致多次调用
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>可替代性</strong>：大部分场景可以用 constructor 或 componentDidMount 替代
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-indigo-alpha-10)',
          border: '1px solid var(--code-indigo-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>💡 迁移指南</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>初始化 state</strong>：移到 constructor 或 useState 初始值
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>数据获取</strong>：移到 componentDidMount 或 useEffect
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>订阅事件</strong>：移到 componentDidMount
          </li>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🔄 迁移示例</h3>
        <BeautifyCode
          code={`// 旧代码（已废弃）
class OldComponent extends Component {
  componentWillMount() {
    this.setState({ initializing: true });
    this.fetchData();
  }

  fetchData = () => {
    // 获取数据...
  };

  render() {
    return <div>{this.state.data}</div>;
  }
}

// 新代码（推荐写法）
class NewComponent extends Component {
  state = { initializing: true, data: null };

  constructor(props) {
    super(props);
    // 初始化状态在 constructor 中
    this.state = { initializing: true, data: null };
  }

  componentDidMount() {
    // 数据获取在 componentDidMount 中
    this.fetchData();
  }

  fetchData = async () => {
    const data = await api.getData();
    this.setState({ data, initializing: false });
  };

  render() {
    const { initializing, data } = this.state;
    if (initializing) return <Spinner />;
    return <div>{data}</div>;
  }
}

// 函数组件等价写法
function ModernComponent() {
  const [initializing, setInitializing] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // 相当于 componentDidMount
    const fetchData = async () => {
      const result = await api.getData();
      setData(result);
      setInitializing(false);
    };
    fetchData();
  }, []);

  if (initializing) return <Spinner />;
  return <div>{data}</div>;
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>
          📚 其他废弃的生命周期
        </h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>componentWillReceiveProps</strong> → 使用 getDerivedStateFromProps
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>componentWillUpdate</strong> → 使用 getSnapshotBeforeUpdate
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>componentWillMount</strong> → 使用 constructor 或 componentDidMount
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
