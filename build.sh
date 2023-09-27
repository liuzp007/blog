#!/bin/bash


if ! [ -x "$(command -v yarn)" ]; then
    echo 'Error: yarn is not installed. install yarn...' >&2
    npm install -g yarn
fi

# 执行构建或打包命令（例如，使用 npm）
npm run build

git pull
# 提交所有修改到 Git 仓库
git add .

# 提取传递给脚本的第一个参数作为提交消息（如果未提供参数，则使用默认消息）
commit_message="$1"
if [ -z "$commit_message" ]; then
  commit_message="Automated build and push"
fi

# 提交代码并添加提交消息
git commit -m "feat: $commit_message"

# 推送到远程仓库（修改为你的远程仓库地址和分支）
git push origin master
