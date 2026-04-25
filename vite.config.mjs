import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: name => `antd/es/${name}/style/css`
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@store': path.resolve(rootDir, 'src/store'),
      '@router': path.resolve(rootDir, 'src/router'),
      '@page': path.resolve(rootDir, 'src/pages')
    }
  },
  css: {},
  base: '/',
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks(id) {
            if (id.includes('node_modules')) {
              // React 生态（不细分）
              if (
                id.includes('/react-dom/') ||
                (id.includes('/react/') && !id.includes('@react-three'))
              ) {
                return 'vendor-react'
              }
              // 三维生态（合并）
              if (
                id.includes('/three/') ||
                id.includes('@react-three/') ||
                id.includes('/postprocessing/')
              ) {
                return 'vendor-3d'
              }
              // Ant Design（合并 icons）
              if (id.includes('antd') || id.includes('@ant-design/icons')) {
                return 'vendor-ui'
              }
              // 其他工具库（合并）
              if (
                id.includes('axios') ||
                id.includes('dayjs') ||
                id.includes('framer-motion') ||
                id.includes('prismjs')
              ) {
                return 'vendor-utils'
              }
            }
          }
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 8081,
    strictPort: true,
    open: false,
    proxy: process.env.VITE_API_PROXY_TARGET
      ? {
          '/api': {
            target: process.env.VITE_API_PROXY_TARGET,
            changeOrigin: true
          }
        }
      : undefined
  }
})
