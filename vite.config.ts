import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: set GITHUB_PAGES=true and use your repo name as base.
// e.g. base: '/tablite/' for repo github.com/user/tablite
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/tablite/' : '/',
})
