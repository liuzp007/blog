---
title: componentDidMount & componentWillUnmount
slug: react-did-mount
category: React
tags: [React]
summary: 类组件生命周期方法
date: 2026-04-26
series: React 基础教程
seriesOrder: 10
---

## 概述

类组件生命周期方法

## 内容片段

### 片段 B

```text
 componentDidMount 生命周期函数
    · 在DOM挂载结束后执行（在 render() 执行后立即执行）
    · 在这一步虚拟DOM转换成真实DOM
    · 一般在这个函数内做一些消息订阅发布、开启定时器、开始网络请求等操作
    · 可以使用 setState() 方法触发重新渲染 (re-render)
    · 只会执行一次
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

### 💡 使用场景

- componentDidMount：数据获取、订阅事件、初始化第三方库
- componentWillUnmount：清理定时器、取消订阅、清理请求
### ⚠️ 注意事项

- componentDidMount 中调用 setState 会触发额外渲染
- componentWillUnmount 中不能调用 setState（组件即将卸载）
- 确保清理所有副作用，避免内存泄漏
### 🔄 Hooks 等价写法

```tsx
// componentDidMount
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
}, [propValue]); // propValue 变化时重新执行
```

### 📝 完整示例

```tsx
// 类组件
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
}
```

