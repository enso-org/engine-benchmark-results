import vue from '@vitejs/plugin-vue'
import serveStatic from 'serve-static'
import { ViteDevServer, defineConfig, type Plugin } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vuetify from 'vite-plugin-vuetify'

const LOCAL_FS_PORT = 5179
const REPO_NAME = '/engine-benchmark-results/'
const REPO_URL = 'https://enso-org.github.io/engine-benchmark-results'
const FS_URL = isDevBuild() ? `http://localhost:${LOCAL_FS_PORT}` : REPO_URL

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    fsServer(),
    // Copy all the cache files to `dist/cache`.
    viteStaticCopy({
      targets: [
        {
          src: 'cache/*',
          dest: 'cache',
        },
        {
          src: ['stdlib-benchs.html', 'engine-benchs.html'],
          dest: '.',
        },
      ],
    }),
  ],
  define: {
    FS_URL: JSON.stringify(FS_URL),
    DEFAULT_DAYS_TO_FETCH: 30,
    MAX_LABELS: 10,
    MIN_DATE: JSON.stringify('2022-12-13'),
  },
  base: isDevBuild() ? '/' : REPO_NAME,
  server: {
    port: LOCAL_FS_PORT,
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

function isDevBuild(): boolean {
  return process.env.NODE_ENV === 'development'
}
