---
title: componentWillMount (已废弃)
slug: react-will-mount
category: React
tags: [React]
summary: 了解历史，拥抱未来
date: 2026-04-26
series: React 基础教程
seriesOrder: 11
---

## 概述

了解历史，拥抱未来

## 内容片段

### 片段 B

```text
 componentWillMount 生命周期函数（已废弃）
    · 在 DOM 挂载前、render 执行前调用
    · 在 React 17+ 中被重命名为 UNSAFE_componentWillMount
    · 在 React 18 中已完全移除

    废弃原因：
    - 建议在 componentDidMount 中执行初始化
    - 服务端渲染时也会调用（但无法使用 DOM）
    - 未来异步渲染可能导致多次调用
```

### 片段 C

```text
 componentWillUnmount 生命周期函数
    · 在组件卸载(unmounted)或销毁(destroyed)之前执行
    · 做一些清理操作，比如无效的timers、interval，或者取消网络请求，
    · 清理任何在 componentDidMount() 中创建的DOM元素(elements);
    · 这是完全卸载组件前执行的最后一步
```

## 补充说明

### ⚠️ 为什么废弃

- •时机问题：在 render 前调用，但此时 DOM 未准备好
- •SSR 问题：服务端渲染时也会调用，但无法访问浏览器 API
- •双重调用：React 18 的并发特性可能导致多次调用
- •可替代性：大部分场景可以用 constructor 或 componentDidMount 替代
### 💡 迁移指南

- •初始化 state：移到 constructor 或 useState 初始值
- •数据获取：移到 componentDidMount 或 useEffect
- •订阅事件：移到 componentDidMount
### 🔄 迁移示例

```tsx
// 旧代码（已废弃）
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
}
```

### 📚 其他废弃的生命周期

- •componentWillReceiveProps→ 使用 getDerivedStateFromProps
- •componentWillUpdate→ 使用 getSnapshotBeforeUpdate
- •componentWillMount→ 使用 constructor 或 componentDidMount
