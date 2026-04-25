# 部署文档

## 概述

本文档提供了项目的完整部署指南，包括本地环境、开发环境和生产环境的配置。

## 前置要求

- **Node.js**: 18.0.0 或更高版本
- **pnpm**: 10.0.0 或更高版本
- **Git**: 最新版本

## 本地开发

### 环境配置

1. **克隆仓库**

```bash
git clone <repository-url>
cd blog
```

2. **安装依赖**

```bash
pnpm install
```

3. **启动开发服务器**

```bash
pnpm dev
```

开发服务器将在 `http://127.0.0.1:8081` 启动。

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行测试
pnpm test

# 完整质量检查
pnpm ci:check
```

## 生产部署

### 构建准备

1. **环境变量配置**

创建 `.env.production` 文件：

```env
# API 配置
VITE_API_BASE_URL=https://your-api.com
VITE_API_PROXY_TARGET=

# 其他配置
NODE_ENV=production
```

2. **构建项目**

```bash
pnpm build
```

构建产物将在 `build/` 目录中生成。

### 部署到 Vercel

#### 方式一: 通过 Vercel CLI

1. **安装 Vercel CLI**

```bash
npm i -g vercel
```

2. **登录 Vercel**

```bash
vercel login
```

3. **部署项目**

```bash
vercel
```

4. **部署到生产环境**

```bash
vercel --prod
```

#### 方式二: 通过 Git 集成

1. **推送代码到 Git 仓库**

2. **在 Vercel 中导入项目**
   - 访问 https://vercel.com/new
   - 导入你的 Git 仓库
   - 配置构建设置

3. **配置构建设置**

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "build",
  "framework": "vite"
}
```

### 部署到 Netlify

1. **安装 Netlify CLI**

```bash
npm i -g netlify-cli
```

2. **登录 Netlify**

```bash
netlify login
```

3. **初始化项目**

```bash
netlify init
```

4. **部署项目**

```bash
netlify deploy --prod
```

### 部署到静态托管服务

对于任何静态托管服务（如 GitHub Pages、AWS S3 等），只需：

1. **构建项目**

```bash
pnpm build
```

2. **上传 build 目录内容到服务器**

3. **配置服务器**（如果需要）
   - 确保服务器支持单页应用路由
   - 配置正确的 MIME 类型

## 环境变量

### 开发环境变量 (.env.development)

```env
# 本地开发配置
VITE_API_BASE_URL=http://localhost:3000
VITE_API_PROXY_TARGET=http://localhost:3000
```

### 生产环境变量 (.env.production)

```env
# 生产环境配置
VITE_API_BASE_URL=https://api.yourdomain.com
NODE_ENV=production
```

## CI/CD 配置

### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 性能优化

### 构建优化

项目已配置以下优化：

- **代码分割**: 手动配置 vendor chunks
- **资源压缩**: gzip 压缩
- **Tree Shaking**: 自动移除未使用的代码

### CDN 配置

建议为静态资源配置 CDN：

- 将 build 目录上传到 CDN
- 配置缓存策略
- 启用 HTTP/2

## 监控与分析

### 推荐工具

1. **性能监控**
   - Google Analytics
   - Vercel Analytics
   - Web Vitals

2. **错误监控**
   - Sentry
   - LogRocket

3. **用户行为分析**
   - Hotjar
   - Clarity

## 备份与恢复

### 备份策略

1. **代码备份**: 通过 Git 仓库自动备份
2. **数据库备份**: 定期导出数据库
3. **配置备份**: 备份环境变量和配置文件

### 恢复流程

1. **克隆代码仓库**
2. **安装依赖**
3. **配置环境变量**
4. **构建项目**
5. **部署到服务器**

## 故障排查

### 常见问题

1. **构建失败**

   ```bash
   # 清除缓存重新构建
   rm -rf node_modules build .vite
   pnpm install
   pnpm build
   ```

2. **部署后页面空白**
   - 检查构建日志
   - 确认环境变量配置正确
   - 检查浏览器控制台错误

3. **API 请求失败**
   - 检查 API 端点配置
   - 确认 CORS 配置
   - 验证网络连接

### 日志查看

```bash
# 开发环境日志
pnpm dev

# 生产环境日志
tail -f /var/log/nginx/access.log
```

## 安全建议

1. **环境变量**: 永远不要将敏感信息提交到 Git
2. **依赖更新**: 定期更新依赖，修复安全漏洞
3. **HTTPS**: 生产环境必须使用 HTTPS
4. **防火墙**: 配置适当的防火墙规则
5. **备份**: 定期备份数据和配置

## 更新与维护

### 依赖更新

```bash
# 检查过时的依赖
pnpm outdated

# 更新所有依赖
pnpm update

# 更新特定依赖
pnpm update <package-name>
```

### 安全审计

```bash
# 检查安全漏洞
pnpm audit

# 自动修复安全漏洞
pnpm audit fix
```

## 支持与联系

如遇到部署问题，请：

1. 检查本文档的故障排查部分
2. 查看 GitHub Issues
3. 联系技术支持团队
