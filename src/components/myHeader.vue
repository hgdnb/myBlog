<template>
  <div class="header">
    <div class="main-container flex-row-sb">
      <router-link to="/index"
                   class="logo">
        <img src="/image/logo1.png"
             alt="">
      </router-link>
      <div class="right flex-row-fe">
        <div class="nav_list flex-row-sb">
          <router-link to="/index">首页</router-link>
          <router-link to="/article">博文</router-link>
          <router-link to="/project">工作</router-link>
          <router-link to="/music">音乐</router-link>
          <router-link to="/diary">日事</router-link>
        </div>
        <div :class="search_show ? 'search flex-row-sb search_active' : 'search flex-row-sb'">
          <img @click="search_show = !search_show" src="/image/icon1.png"
               alt="">
          <input type="text"
          v-model="search_input"
                 placeholder="请用空格隔开关键词" @input="changeInput">
          <div class="article_list" v-show="search_show && search_input">
            <h4>搜索结果</h4>
            <div class="list_box" v-loading="loading">
              <div @click="goArticleDetail(item.id)" class="one_article ellipsis_1" v-for="(item, index) in article_list" :key="item.id">{{item.attributes.title}}</div>
              <img v-if="article_list.length == 0 && !loading" class="empty" src="/public/image/empty.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import article from '@/api/article';
const search_show = ref(false)
const article_list = ref([])
const search_input = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()

// 输入框改变
let time = null
function changeInput (e) {
  loading.value = true
  clearTimeout(time)
  time = setTimeout(async () => {
    article_list.value = await article.searchArticle(e.target.value.split(' '))
    loading.value = false
  }, 1000);
}

// 点击文章跳转到详情页面
function goArticleDetail (id) {
  router.push({
    path: '/article_detail',
    query: {
      id: id
    }
  })
}

watch(route, (newVal, oldVal) => {
  search_show.value = false
})

</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 999;
  height: 70px;
  background-color: white;
  box-shadow: $box_shadow;
  .main-container {
    height: 100%;
  }
  .logo {
    height: 80%;
    img {
      height: 100%;
    }
  }
  .right {
    margin-left: 50px;
    .nav_list {
      width: 450px;
      margin-right: 80px;
      a {
        color: $color_theme_1;
        position: relative;
        transition: 0.5s;
        &:hover {
          transform: rotate(-20deg) scale(1.1);
        }
      }
      .router-link-active {
        &::after {
          content: "";
          display: block;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border-color: transparent transparent $color_theme_1 transparent;
          border-width: 2px;
          border-style: solid;
          position: absolute;
          left: calc(50% + 10px);
          top: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      }
    }
    .search {
      width: 30px;
      height: 34px;
      border-radius: 50px;
      border: 1px solid transparent;
      transition: .5s;
      position: relative;
      img {
        width: 26px;
        height: 26px;
        display: block;
        cursor: pointer;
        margin: auto;
        flex-shrink: 0;
      }
      input {
        transition: .5s;
        border: none;
        width: 0px;
        background: transparent;
        outline: none;
      }
      .article_list {
        position: absolute;
        background-color: white;
        top: calc(100% + 10px);
        box-shadow: $box_shadow;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 15px;
        border-radius: 8px;
        width: 200px;
        h4 {
          padding-top: 15px;
        }
        .one_article {
          padding: 10px 0;
          cursor: pointer;
          border-bottom: 1px solid #efefef;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          &:hover {
            border-color: black;
          }
        }
        .list_box {
          min-height: 100px;
        }
        .empty {
          width: 100%;
          height: 200px;
          display: block;
        }
      }
    }
    .search_active {
      width: 200px;
      border-color: $color_theme_2;
      input {
        flex-grow: 0.95;
      }
    }
  }
}
</style>

