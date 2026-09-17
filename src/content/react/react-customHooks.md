---
title: 自定义 Hooks
slug: react-custom-hooks
category: React
tags: [React]
summary: 复用逻辑，提高代码可维护性
date: 2026-04-26
series: React 基础教程
seriesOrder: 12
---

## 概述

复用逻辑，提高代码可维护性

## 内容片段

### 片段 1

```tsx
// Cookie Hook - 管理 Cookie
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function useCookie(cookieName) {
  const [cookieValue, setCookieValue] = useState(null);

  useEffect(() => {
    // 获取 cookie 值
    const value = Cookies.get(cookieName);
    setCookieValue(value);
  }, [cookieName]);

  // 设置 cookie 值
  const setCookie = (value, options) => {
    Cookies.set(cookieName, value, options);
    setCookieValue(value);
  };

  // 删除 cookie
  const removeCookie = () => {
    Cookies.remove(cookieName);
    setCookieValue(null);
  };

  return [cookieValue, setCookie, removeCookie];
}

export default useCookie;
```

### 片段 2

```tsx
// LocalStorage Hook - 本地存储管理
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
```

### 片段 3

```tsx
// Fetch Hook - 数据请求
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
```

### 片段 4

```tsx
// useToggle - 切换布尔值
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, setValue, toggle, setTrue, setFalse };
}

export default useToggle;
```

## 补充说明

### 💡 自定义 Hook 的优势

- 逻辑复用：将组件逻辑提取到可重用的函数中
- 关注分离：将组件逻辑与 UI 分离
- 更易测试：纯函数更容易编写单元测试
- 状态共享：多个组件可以共享相同的逻辑
### ⚠️ 命名规范

- 必须以 use 开头
- 使用驼峰命名：useLocalStorage、useFetch
- 名称应该清晰地表达其功能
### 📝 编写规则

- 两个组件如果使用相同的 Hook，不会共享 state
- 每次调用 Hook 都是独立的实例
- 自定义 Hook 可以调用其他 Hook
- 只能在函数组件的顶层调用
- 条件调用应该放在 Hook 内部，而不是外层
### 🔗 常用自定义 Hook 库

- •ahooks- React Hooks 工具库
- •react-use- 多种实用的 Hooks
- •usehooks-ts- TypeScript 版本
