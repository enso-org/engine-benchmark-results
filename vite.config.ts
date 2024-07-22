import vue from '@vitejs/plugin-vue'
import serveStatic from 'serve-static'
import { ViteDevServer, defineConfig, type Plugin } from 'vite'
import vuetify from 'vite-plugin-vuetify'

const PORT = 5179
const FS_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}` : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true }), fsServer()],
  define: {
    FS_URL: JSON.stringify(FS_URL),
    DEFAULT_DAYS_TO_FETCH: 30,
    MAX_LABELS: 10,
    MIN_DATE: new Date('2022-12-01'),
    MAX_DATE: new Date('2024-06-01'),
  },
  server: {
    port: PORT,
    strictPort: true,
  },
})

function fsServer(): Plugin {
  return {
    name: 'fs-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/cache', serveStatic('/cache'))
    },
  }
}
