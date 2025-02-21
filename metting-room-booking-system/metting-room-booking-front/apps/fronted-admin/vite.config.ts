import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // 监听所有IP地址
    port: 5174, // 端口号
    open: '/', // 自动打开浏览器
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [react()],
})
