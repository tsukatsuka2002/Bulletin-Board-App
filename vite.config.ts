import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 開発サーバーの設定
// /api へのリクエストを http://localhost:4000 にプロキシします
// これによりフロントは fetch('/api/posts') のままでバックエンドに到達します
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
