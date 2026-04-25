# API 使用文档

## 概述

本文档描述了项目中使用的 API 接口和相关工具函数的使用方法。

## 目录结构

```
src/api/
└── uploadFile.ts       # 文件上传接口
```

## 文件上传 API

### 接口地址

```
/api/upload
```

### 请求方法

```
POST
```

### 请求头

```typescript
{
  'Content-Type': 'multipart/form-data'
}
```

### 请求体

```typescript
{
  file: File // 要上传的文件
}
```

### 响应

```typescript
{
  success: boolean
  data: {
    url: string // 文件访问 URL
    size: number // 文件大小
    name: string // 文件名
    type: string // 文件类型
  }
  message: string
}
```

### 使用示例

```typescript
import { uploadFile } from '@/api/uploadFile'

// 上传文件
const handleUpload = async (file: File) => {
  try {
    const response = await uploadFile(file)
    if (response.success) {
      console.log('上传成功:', response.data.url)
      // 处理上传成功逻辑
    }
  } catch (error) {
    console.error('上传失败:', error)
    // 处理错误逻辑
  }
}

// 使用示例
const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', e => {
  const file = e.target.files[0]
  if (file) {
    handleUpload(file)
  }
})
```

## HTTP 客户端配置

项目使用 Axios 作为 HTTP 客户端，配置如下：

### 基础配置

```typescript
// src/utils/axios_instance.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 可以在这里添加 token 等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 统一错误处理
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default instance
```

### 使用示例

```typescript
import http from '@/utils/axios_instance'

// GET 请求
const fetchData = async () => {
  const response = await http.get('/data')
  return response
}

// POST 请求
const postData = async (data: any) => {
  const response = await http.post('/data', data)
  return response
}

// PUT 请求
const updateData = async (id: string, data: any) => {
  const response = await http.put(`/data/${id}`, data)
  return response
}

// DELETE 请求
const deleteData = async (id: string) => {
  const response = await http.delete(`/data/${id}`)
  return response
}
```

## Cookie 管理

项目使用 js-cookie 库进行 Cookie 管理。

### 基础使用

```typescript
import Cookies from 'js-cookie'

// 设置 Cookie
Cookies.set('token', 'your-token-here', { expires: 7 })

// 获取 Cookie
const token = Cookies.get('token')

// 删除 Cookie
Cookies.remove('token')
```

### 配置选项

```typescript
// 设置带有完整选项的 Cookie
Cookies.set('name', 'value', {
  expires: 7, // 过期时间（天）
  path: '/', // 路径
  domain: '', // 域名
  secure: true, // 安全传输
  sameSite: 'strict' // 同站策略
})
```

## 日期处理

项目使用 dayjs 库进行日期处理（别名 moment）。

### 基础使用

```typescript
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 获取当前时间
const now = dayjs()

// 格式化日期
const formatted = dayjs().format('YYYY-MM-DD HH:mm:ss')

// 相对时间
const timeAgo = dayjs('2024-01-01').fromNow() // "2个月前"

// 日期计算
const nextWeek = dayjs().add(7, 'day')
const lastMonth = dayjs().subtract(1, 'month')
```

## 数据验证

### 基础验证工具

```typescript
// 邮箱验证
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL 验证
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 手机号验证（中国）
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}
```

## 数据转换

### 常用转换函数

```typescript
// 首字母大写
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 驼峰转换
const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// 格式化数字
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
```

## 错误处理

### 统一错误处理

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 错误处理中间件
const handleApiError = (error: any) => {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.statusCode}):`, error.message)
  } else if (error.response) {
    // Axios 错误
    console.error('Response Error:', error.response.data)
  } else if (error.request) {
    // 请求错误
    console.error('Request Error:', error.request)
  } else {
    // 其他错误
    console.error('Unknown Error:', error.message)
  }
}
```

## 类型定义

### API 响应类型

```typescript
// 标准响应类型
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  timestamp: number
}

// 分页响应类型
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

## 最佳实践

### 1. 错误处理

```typescript
// ✅ 推荐：使用 try-catch 处理异步操作
const fetchData = async () => {
  try {
    const response = await http.get('/data')
    return response
  } catch (error) {
    console.error('获取数据失败:', error)
    throw error
  }
}
```

### 2. 类型安全

```typescript
// ✅ 推荐：使用 TypeScript 接口定义数据结构
interface UserData {
  id: string
  name: string
  email: string
}

const getUserData = async (id: string): Promise<UserData> => {
  const response = await http.get<UserData>(`/users/${id}`)
  return response
}
```

### 3. 请求取消

```typescript
// ✅ 推荐：使用 AbortController 取消请求
const fetchDataWithCancel = async (signal: AbortSignal) => {
  try {
    const response = await http.get('/data', { signal })
    return response
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('请求失败:', error)
    }
  }
}

// 使用示例
const controller = new AbortController()
fetchDataWithCancel(controller.signal)
controller.abort() // 取消请求
```

### 4. 请求节流

```typescript
// ✅ 推荐：避免重复请求
const debounceRequest = (() => {
  let timer: NodeJS.Timeout
  return (fn: Function, delay: number) => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
  }
})()

const handleSearch = (query: string) => {
  debounceRequest(() => {
    search(query)
  }, 300)
}
```

## 环境变量

### 可用的环境变量

```typescript
// API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 代理目标
const API_PROXY_TARGET = import.meta.env.VITE_API_PROXY_TARGET

// 当前环境
const NODE_ENV = import.meta.env.MODE
```

## 调试技巧

### 1. 开启调试日志

```typescript
const DEBUG = import.meta.env.DEV

const debugLog = (...args: any[]) => {
  if (DEBUG) {
    console.log('[DEBUG]', ...args)
  }
}
```

### 2. 网络请求监控

```typescript
// 添加请求日志
instance.interceptors.request.use(config => {
  console.log('请求:', config.method?.toUpperCase(), config.url)
  return config
})

instance.interceptors.response.use(response => {
  console.log('响应:', response.status, response.config.url)
  return response
})
```

## 安全建议

1. **永远不要在前端存储敏感信息**
2. **使用 HTTPS 进行数据传输**
3. **验证和清理用户输入**
4. **使用 CSRF 保护**
5. **实施适当的认证和授权**

## 参考资源

- [Axios 文档](https://axios-http.com/)
- [js-cookie 文档](https://github.com/js-cookie/js-cookie)
- [dayjs 文档](https://day.js.org/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
