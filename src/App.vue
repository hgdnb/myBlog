<template>
  <div class="flex-col-fs page_box">
    <my-header></my-header>
    <el-scrollbar ref="scrollbar">
      <router-view v-slot="{ Component }">
        <transition name="page">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<script setup>
import myHeader from "@/components/myHeader.vue";
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
let scrollbar = ref(null)
const goTop = function() {
  scrollbar.value.setScrollTop(0)
}
provide ('goTop', goTop)

const route = useRoute()
watch(route, (newVal, oldVal) => {
  goTop()
})
</script>

<style lang="scss" scoped>
.page_box {
  height: 100vh;
}

:deep(.el-scrollbar) {
  flex-grow: 1;

  .el-scrollbar__view {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
}
</style>

<style lang="scss">
// 全局配置
* {
  margin: 0;
  padding: 0;
}

img {
  max-width: 100%;
}

html {
  font-size: 16px;
  font-family: SimSun;
  background-color: $color_theme_3;
}

a {
  text-decoration: none;
}

// 常用类名
.flex-row-sb,
.flex-row-center,
.flex-row-fs,
.flex-row-fe {
  display: flex;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
}

.flex-col-sb,
.flex-col-center,
.flex-col-fs,
.flex-col-fe {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}

.flex-row-sb,
.flex-col-sb {
  justify-content: space-between;
}

.flex-row-fs,
.flex-col-fs {
  justify-content: flex-start;
}

.flex-row-fe,
.flex-col-fe {
  justify-content: flex-end;
}

.flex-row-center,
.flex-col-center {
  justify-content: center;
}

.bg-cover-center {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.bg-contain-center {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.main-container {
  max-width: 1100px;
  padding-left: 100px;
  padding-right: 100px;
  margin: 0 auto;
}

.ellipsis_1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.ellipsis_2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
