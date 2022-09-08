import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue';
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

console.log(router)

export default router
