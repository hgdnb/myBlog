import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import vuex from '@/store/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(vuex)
app.use(ElementPlus)

app.mount('#app')
