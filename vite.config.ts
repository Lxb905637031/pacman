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
    sourcemap: false, // 生产环境建议关闭 sourcemap 以减小体积
    minify: 'terser', // 启用代码压缩
  }
}