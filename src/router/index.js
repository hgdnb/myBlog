import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: "/index",
    component: () => import('@/views/index.vue')
  },
  {
    path: "/music",
    component: () => import('@/views/music.vue')
  },
  {
    path: "/project",
    component: () => import('@/views/project.vue')
  },
  {
    path: "/diary",
    component: () => import('@/views/diary.vue')
  },
  {
    path: "/article",
    component: () => import('@/views/article.vue'),
  },
  {
    path: "/article_detail",
    component: () => import('@/views/article_detail.vue')
  },
  {
    path: "/project_detail",
    component: () => import('@/views/project_detail.vue')
  }
]

const router = createRouter({

  history: createWebHashHistory(),

  routes

});

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach((to, from) => {
  NProgress.done()
})

export default router
