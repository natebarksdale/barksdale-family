import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/family-allowance-tracker/',
  build: {
    outDir: 'dist',
  },
})