import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite設定ファイル
// base: GitHub Pagesのリポジトリ名に合わせる
export default defineConfig({
  plugins: [react()],
  base: '/NewApp/',
})
