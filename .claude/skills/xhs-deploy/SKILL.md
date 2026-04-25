# xhs-deploy: 小红书 MCP 一键部署

一键部署 xiaohongshu-mcp 服务，并配置到 OpenCode。专为小白设计，自动检测和安装依赖。

## 使用方式

```
/xhs-deploy
```

## 功能

- 自动检测并安装 Docker（如果未安装）
- 自动启动 xiaohongshu-mcp 容器
- 提示扫码登录
- 自动安装 OpenCode（如果未安装）
- 自动配置 MCP
- 自动下载 xiaohongshu-mcp-skills

## 前置条件

无，完全自动化，小白也能用。

## 部署流程

### 自动模式

```bash
# 在项目目录执行
chmod +x install-xhs-mcp.sh
./install-xhs-mcp.sh
```

脚本会自动：

1. 检查 Docker，未安装则提示下载
2. 启动/创建 MCP 容器
3. 提示扫码登录
4. 检查 OpenCode，未安装则自动安装
5. 配置 MCP
6. 下载 skills

### 手动模式（如自动失败）

```bash
# 1. 手动安装 Docker Desktop
# https://www.docker.com/products/docker-desktop/

# 2. 启动服务
docker run -d --name xiaohongshu-mcp -p 18060:18060 xpzouying/xiaohongshu-mcp

# 3. 首次登录
open http://localhost:18060  # 扫码登录

# 4. 配置 MCP
opencode mcp add xiaohongshu-mcp http://localhost:18060/mcp Remote

# 5. 下载 skills
git clone https://github.com/autoclaw-cc/xiaohongshu-mcp-skills.git
```

## 后续使用

每次开机后启动服务：

```bash
docker start xiaohongshu-mcp
```

## 使用示例

部署成功后，在 OpenCode 中对话：

```
帮我发一篇"春天的咖啡馆"笔记到小红书
```

## 注意事项

- 首次必须扫码登录（无法跳过）
- 小红书每天建议发稿量不超过 50 篇
- 同一个账号不能在多个网页端登录
- Docker 首次启动需要等待镜像下载（约 150MB）
