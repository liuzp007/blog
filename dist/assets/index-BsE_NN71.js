import{j as t}from"./vendor-react-CC9qU9RZ.js";import{C as e}from"./index-Q60UGwvo.js";import{B as n,a as i}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const o={B:` componentWillMount 生命周期函数（已废弃）
    · 在 DOM 挂载前、render 执行前调用
    · 在 React 17+ 中被重命名为 UNSAFE_componentWillMount
    · 在 React 18 中已完全移除

    废弃原因：
    - 建议在 componentDidMount 中执行初始化
    - 服务端渲染时也会调用（但无法使用 DOM）
    - 未来异步渲染可能导致多次调用
    `,C:` componentWillUnmount 生命周期函数
    · 在组件卸载(unmounted)或销毁(destroyed)之前执行
    · 做一些清理操作，比如无效的timers、interval，或者取消网络请求，
    · 清理任何在 componentDidMount() 中创建的DOM元素(elements);
    · 这是完全卸载组件前执行的最后一步
    `};function m(){return t.jsxs(e,{className:"code-page",title:"componentWillMount (已废弃)",subtitle:"了解历史，拥抱未来",children:[t.jsx(n,{list:o}),t.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[t.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 为什么废弃"}),t.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"时机问题"}),"：在 render 前调用，但此时 DOM 未准备好"]}),t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"SSR 问题"}),"：服务端渲染时也会调用，但无法访问浏览器 API"]}),t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"双重调用"}),"：React 18 的并发特性可能导致多次调用"]}),t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"可替代性"}),"：大部分场景可以用 constructor 或 componentDidMount 替代"]})]})]}),t.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[t.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"💡 迁移指南"}),t.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"初始化 state"}),"：移到 constructor 或 useState 初始值"]}),t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"数据获取"}),"：移到 componentDidMount 或 useEffect"]}),t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"订阅事件"}),"：移到 componentDidMount"]})]})]}),t.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[t.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"🔄 迁移示例"}),t.jsx(i,{code:`// 旧代码（已废弃）
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
}`})]}),t.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-violet-alpha-10)",border:"1px solid var(--code-violet-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[t.jsx("h3",{style:{color:"var(--color-code-violet)",marginBottom:"1rem"},children:"📚 其他废弃的生命周期"}),t.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"componentWillReceiveProps"})," → 使用 getDerivedStateFromProps"]}),t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"componentWillUpdate"})," → 使用 getSnapshotBeforeUpdate"]}),t.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",t.jsx("strong",{children:"componentWillMount"})," → 使用 constructor 或 componentDidMount"]})]})]})]})}export{m as default};
