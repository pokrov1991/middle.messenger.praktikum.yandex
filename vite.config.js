import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist')
  },
  publicDir: resolve(__dirname, 'public')
}) 
