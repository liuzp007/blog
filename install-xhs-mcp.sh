#!/bin/bash

# xiaohongshu-mcp 一键部署脚本（小白版）
# 使用方法：chmod +x install-xhs-mcp.sh && ./install-xhs-mcp.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "  小红书 MCP 一键部署脚本"
echo "========================================="

# ========== 第 1 步：安装 Docker ==========
echo ""
echo "[1/6] 检查并安装 Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装"
else
    echo "📦 正在下载 Docker Desktop..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if [[ "$(uname -m)" == "arm64" ]]; then
            DOCKER_URL="https://desktop.docker.com/mac/main/arm64/Docker.dmg"
            FILENAME="Docker.dmg"
        else
            DOCKER_URL="https://desktop.docker.com/mac/main/amd64/Docker.dmg"
            FILENAME="Docker.dmg"
        fi
        
        echo "请手动下载 Docker Desktop:"
        echo "$DOCKER_URL"
        echo ""
        echo "下载完成后，双击安装包，将 Docker 拖入 Applications 文件夹"
        echo "然后打开 Docker，等待它显示"鲸鱼图标"..."
        echo ""
        read -p "Docker 安装完成后，按回车键继续..."
        
        # 尝试启动 docker
        open -a Docker || true
    else
        # 其他系统
        echo "请手动安装 Docker: https://www.docker.com/products/docker-desktop/"
        read -p "安装完成后，按回车键继续..."
    fi
    
    # 等待 Docker 启动
    echo "等待 Docker 启动..."
    for i in {1..30}; do
        if docker info &> /dev/null; then
            echo "✅ Docker 已启动"
            break
        fi
        sleep 2
    done
    
    if ! docker info &> /dev/null; then
        echo "❌ Docker 启动失败，请手动打开 Docker 后重试"
        exit 1
    fi
fi

# ========== 第 2 步：启动 MCP 服务 ==========
echo ""
echo "[2/6] 启动 MCP 服务..."
if docker ps | grep -q xiaohongshu-mcp; then
    echo "⚠️  xiaohongshu-mcp 已在运行中"
elif docker ps -a | grep -q xiaohongshu-mcp; then
    echo "▶️  启动已有容器..."
    docker start xiaohongshu-mcp
else
    echo "📦 首次运行，正在下载镜像（约 150MB）..."
    docker run -d --name xiaohongshu-mcp -p 18060:18060 xpzouying/xiaohongshu-mcp
fi

# 等待服务就绪
sleep 3
echo "✅ MCP 服务已就绪"

# ========== 第 3 步：首次登录 ==========
echo ""
echo "[3/6] 首次登录（重要!）"
echo "请在浏览器打开: http://localhost:18060"
echo ""
echo "📱 扫码登录小红书"
echo "💾 登录后 Cookie 会自动保存，之后就不用再登录了"
echo ""
open http://localhost:18060 2>/dev/null || true
read -p "扫码登录完成后，按回车键继续..."

# ========== 第 4 步：安装 OpenCode（可选）==========
echo ""
echo "[4/6] 检查 OpenCode..."
if command -v opencode &> /dev/null; then
    echo "✅ OpenCode 已安装"
else
    echo "📦 正在安装 OpenCode..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # 安装 homebrew（如果没有）
        if ! command -v brew &> /dev/null; then
            echo "📦 安装 Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        
        # 安装 opencode
        brew install opencode-ai/opencode/opencode
        echo "✅ OpenCode 已安装"
    else
        echo "请手动安装 OpenCode: https://opencode.ai"
        read -p "安装完成后，按回车键继续..."
    fi
fi

# ========== 第 5 步：配置 MCP ==========
echo ""
echo "[5/6] 配置 MCP 到 OpenCode..."
if command -v opencode &> /dev/null; then
    # 检查是否已配置
    if opencode mcp list 2>/dev/null | grep -q xiaohongshu-mcp; then
        echo "⚠️  MCP 已配置，跳过"
    else
        opencode mcp add xiaohongshu-mcp http://localhost:18060/mcp Remote
        echo "✅ MCP 配置完成"
    fi
else
    echo "⚠️  OpenCode 未安装，跳过 MCP 配置"
    echo "   你可以手动运行: opencode mcp add"
fi

# ========== 第 6 步：下载 skills ==========
echo ""
echo "[6/6] 下载 skills..."
if [ -d "xiaohongshu-mcp-skills" ]; then
    echo "⚠️  skills 目录已存在，跳过"
else
    echo "📦 正在下载 xiaohongshu-mcp-skills..."
    git clone https://github.com/autoclaw-cc/xiaohongshu-mcp-skills.git
    echo "✅ skills 已下载"
fi

# ========== 完成 ==========
echo ""
echo "========================================="
echo "  🎉 部署完成!"
echo "========================================="
echo ""
echo "📖 使用方法："
echo "1. 浏览器访问 http://localhost:18060 检查登录状态"
echo "2. 在 OpenCode 中对话：帮我发一篇笔记到小红书"
echo ""
echo "⚡ 之后每次开机后，只需运行："
echo "   docker start xiaohongshu-mcp"
echo ""
echo "📚 相关文件："
echo "   - 脚本: install-xhs-mcp.sh"
echo "   - skills: xiaohongshu-mcp-skills/"
echo ""
