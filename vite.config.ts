import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three.js is lazy-loaded for the hero only; its chunk is expected to be ~550 kB raw / ~135 kB gzip
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/@xyflow')) return 'xyflow'
          if (id.includes('node_modules/gsap')) return 'gsap'
          return undefined
        },
      },
    },
  },
})
