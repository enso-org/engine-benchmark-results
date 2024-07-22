import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'

import { createMemoryHistory, createRouter } from 'vue-router'
import MainPage from './components/MainPage.vue'

const routes = [{ path: '/', component: MainPage }]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
})
app.use(pinia)
app.use(vuetify)
app.use(router)
app.mount('#app')
