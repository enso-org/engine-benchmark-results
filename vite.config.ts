import { ViteDevServer, defineConfig , type Plugin} from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from "vite-plugin-vuetify"
import serveStatic from "serve-static"

const PORT = 5179
const FS_URL = process.env.NODE_ENV === "development" ? `http://localhost:${PORT}` : "/"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    fsServer()
  ],
  define: {
    FS_URL: JSON.stringify(FS_URL)
  },
  server: {
    port: PORT,
    strictPort: true
  }
})

function fsServer(): Plugin {
  return {
    name: "fs-server",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/cache", serveStatic("/cache"))
    }
  }
}
