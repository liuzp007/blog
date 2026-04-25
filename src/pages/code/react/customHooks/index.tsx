import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `// Cookie Hook - 管理 Cookie
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

export default useCookie;`,
  2: `// LocalStorage Hook - 本地存储管理
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

export default useLocalStorage;`,
  3: `// Fetch Hook - 数据请求
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

export default useFetch;`,
  4: `// useToggle - 切换布尔值
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, setValue, toggle, setTrue, setFalse };
}

export default useToggle;`
}

export default function CustomHooks() {
  return (
    <ContentWrapper
      className="code-page"
      title="自定义 Hooks"
      subtitle="复用逻辑，提高代码可维护性"
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
          💡 自定义 Hook 的优势
        </h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• 逻辑复用：将组件逻辑提取到可重用的函数中</li>
          <li style={{ marginBottom: '0.5rem' }}>• 关注分离：将组件逻辑与 UI 分离</li>
          <li style={{ marginBottom: '0.5rem' }}>• 更易测试：纯函数更容易编写单元测试</li>
          <li style={{ marginBottom: '0.5rem' }}>• 状态共享：多个组件可以共享相同的逻辑</li>
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 命名规范</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • 必须以{' '}
            <code
              style={{
                background: 'var(--code-indigo-alpha-10)',
                color: 'var(--color-code-indigo)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              use
            </code>{' '}
            开头
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• 使用驼峰命名：useLocalStorage、useFetch</li>
          <li style={{ marginBottom: '0.5rem' }}>• 名称应该清晰地表达其功能</li>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>📝 编写规则</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• 两个组件如果使用相同的 Hook，不会共享 state</li>
          <li style={{ marginBottom: '0.5rem' }}>• 每次调用 Hook 都是独立的实例</li>
          <li style={{ marginBottom: '0.5rem' }}>• 自定义 Hook 可以调用其他 Hook</li>
          <li style={{ marginBottom: '0.5rem' }}>• 只能在函数组件的顶层调用</li>
          <li style={{ marginBottom: '0.5rem' }}>• 条件调用应该放在 Hook 内部，而不是外层</li>
        </ul>
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
          🔗 常用自定义 Hook 库
        </h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong style={{ color: 'var(--color-code-violet)' }}>ahooks</strong> - React Hooks
            工具库
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong style={{ color: 'var(--color-code-violet)' }}>react-use</strong> - 多种实用的
            Hooks
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong style={{ color: 'var(--color-code-violet)' }}>usehooks-ts</strong> -
            TypeScript 版本
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
