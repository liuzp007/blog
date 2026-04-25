# 环境变量文档

## 概述

本项目支持多环境配置，包括开发、测试和生产环境。环境变量通过 `.env.{环境}` 文件管理。

## 环境文件

### `.env.development` (开发环境)

- `GENERATE_SOURCEMAP=true` - 生成 source map，便于调试
- `VITE_API_PROXY_TARGET=` - API 代理目标地址（可选）
- `VITE_BASE_URL=/` - 应用基础路径
- `VITE_APP_TITLE=Personal Blog` - 应用标题

### `.env.test` (测试环境)

- `GENERATE_SOURCEMAP=true` - 生成 source map
- `VITE_API_PROXY_TARGET=` - API 代理目标地址
- `VITE_BASE_URL=/` - 应用基础路径
- `VITE_APP_TITLE=Personal Blog (Test)` - 应用标题

### `.env.production` (生产环境)

- `GENERATE_SOURCEMAP=false` - 不生成 source map，减小包体积
- `VITE_API_PROXY_TARGET=` - API 代理目标地址（可选）
- `VITE_BASE_URL=/` - 应用基础路径
- `VITE_APP_TITLE=Personal Blog` - 应用标题
- `VITE_APP_ENV=production` - 环境标识

## 使用方法

### 开发环境

```bash
pnpm dev
```

默认使用 `.env.development` 配置。

### 测试环境

```bash
pnpm build --mode test
pnpm preview --mode test
```

### 生产环境

```bash
pnpm build
```

默认使用 `.env.production` 配置。

## 自定义环境变量

在 Vite 项目中，所有以 `VITE_` 开头的变量都会暴露给客户端代码。

### 添加新的环境变量

1. 在对应的 `.env.{环境}` 文件中添加：

```bash
VITE_CUSTOM_VAR=value
```

2. 在代码中使用：

```typescript
const customVar = import.meta.env.VITE_CUSTOM_VAR
```

## 注意事项

1. 所有环境变量必须以 `VITE_` 开头才能在客户端代码中访问
2. 不要在 `.env` 文件中存储敏感信息（如密钥、密码）
3. `.env.local` 文件会被 git 忽略，可以用于本地覆盖配置
4. 生产环境的敏感信息应通过构建时注入或服务端配置管理

## 最佳实践

1. **默认值处理**：

```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'
```

2. **类型定义**（在 `src/types/vite.d.ts` 中）：

```typescript
interface ImportMetaEnv {
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: string
}
```

3. **环境判断**：

```typescript
const isProduction = import.meta.env.VITE_APP_ENV === 'production'
```
