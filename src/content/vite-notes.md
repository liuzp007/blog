---
slug: vite-notes
title: Vite 构建与优化笔记
summary: Vite 项目中的若干构建优化思路备忘。
date: 2026-03-21
tags: [vite, build]
visualScene: vite-stream
---

# Vite 优化

## 动态导入

通过 `import.meta.glob` 可以按需加载页面模块，减少首屏负担。

## 依赖优化

避免引入重型运行时依赖，尽可能在构建期完成工作。

