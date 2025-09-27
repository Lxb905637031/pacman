import path from 'path'

export default {
  base: '/pacman/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    open: true,
    port: 3000,
    hmr: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}