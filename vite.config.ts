import serveStatic from "serve-static";
import { ViteDevServer, defineConfig, type Plugin } from "vite";
import react from '@vitejs/plugin-react'

const PORT = 5179
const FS_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}` : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    fsServer()
  ],
  define: {
    FS_URL: JSON.stringify(FS_URL),
    DEFAULT_DAYS_TO_FETCH: 30,
    MAX_LABELS: 10
  },
  server: {
    port: PORT,
    strictPort: true
  }
})

function fsServer(): Plugin {
  return {
    name: 'fs-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/cache', serveStatic('/cache'))
    }
  }
}