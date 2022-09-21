import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import vuex from '@/store/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// 引入你所使用的主题 此处以 github 主题为例
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});



const app = createApp(App)
app.use(router)
app.use(vuex)
app.use(ElementPlus)
app.use(VMdPreview);

app.mount('#app')
