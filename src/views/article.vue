<template>
  <div class="article">
    <div class="banner">
      <img class="banner_bg"
        src="http://lc-Ddp3rNzt.cn-n1.lcfile.com/6GmeoaASLTkUgFNrzBkQ06eRKyP7fh8j/function%20getTime%28%29%20%7B%20%5Bnative%20code%5D%20%7D"
        alt="">
    </div>
    <div class="flex-row-sb main-container article_list">
      <div class="left">
        <div class="catalog" v-for="(item, index) in calalog_list" :key="item.id">
          <span @click="changeCalalog(index)" :class="index == calalog_index ? 'active' : ''">{{ item.attributes.name
          }}</span>
        </div>
      </div>
      <div class="center">
        <div class="one_article" v-for="(item, index) in article_list" :key="item.id" @click="goArticleDetail(item.id)">
          <img class="cover" :src="item.attributes.img" alt="">
          <div class="intro">
            <h4>{{item.attributes.title}}</h4>
            <p class="time">{{getFullTime(item.attributes.time)}}</p>
            <div class="tag">
              <span v-for="(item_tag, index_tag) in item.attributes.tags">{{item_tag}}</span>
            </div>
          </div>
        </div>
        <div class="pages_box flex-row-center">
          <el-pagination v-model:currentPage="page" background @current-change="changePage" layout="prev, pager, next"
            :total="article_count" />
        </div>
      </div>
      <div class="right flex-row-fs" v-if="calalog_list">
        <span :class="tag_index == -1 ? 'active' : ''" @click="changeTag(-1)">全部</span>
        <span :class="tag_index == index ? 'active' : ''"
          v-for="(item, index) in calalog_list[calalog_index].attributes.tags" :key="index" @click="changeTag(index)">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import article from '@/api/article'
import catalog from '@/api/catalog'
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const calalog_list = ref(null) // 目录列表
const calalog_index = ref(0) // 当前目录索引
const article_list = ref([]) // 文章列表
const page = ref(1) // 分页的页码
const article_count = ref(0) // 文章数量
const tag_index = ref(-1) // 标签索引
const router = useRouter() // 路由方法


// 页面滚动到顶部
let goTop = inject('goTop')

// 查询文章列表
async function getArticle () {
  const catalog_id = calalog_list.value[calalog_index.value].id
  const tag = tag_index.value == -1 ? null : [calalog_list.value[calalog_index.value].attributes.tags[tag_index.value]]
  article_list.value = await article.findArticle(page.value, catalog_id, tag)
  console.log(article_list.value)
  getArticleCount()
}

// 获取全部目录
async function getCatalog () {
  calalog_list.value = await catalog.findCatalog()
  getArticle()
}
getCatalog()

// 改变标签
async function changeTag (index) {
  page.value = 1
  tag_index.value = index
  getArticle()
  goTop()
}

// 改变目录
function changeCalalog (index) {
  page.value = 1
  tag_index.value = -1
  calalog_index.value = index
  getArticle()
  goTop()
}

// 页面改变时触发
function changePage (e) {
  page.value = e
  getArticle()
  goTop()
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
// 查找文章数量
async function getArticleCount () {
  const catalog_id = calalog_list.value[calalog_index.value].id
  const tag = tag_index.value == -1 ? null : [calalog_list.value[calalog_index.value].attributes.tags[tag_index.value]]
  article_count.value = await article.findArticleCount(catalog_id, tag)
}

// 将时间戳转化为yy-mm-dd
function getFullTime (timestamp) {
  let date = new Date(timestamp);    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  return Y + M + D
}
</script>

<style lang="scss" scoped>
.banner {
  height: 400px;

  .banner_bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article_list {
  align-items: flex-start;
  margin-top: 20px;
}

.left {
  max-height: calc(100vh - 110px);
  width: 280px;
  position: sticky;
  flex-shrink: 0;
  top: 20px;

  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 100%;
    background-color: $color_theme_1;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 3px;
  }

  .catalog {
    margin-left: 15px;

    span {
      display: inline-block;
      background-color: white;
      padding: 12px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: $box_shadow;
      cursor: pointer;
      transition: .3s;
    }

    .active {
      transform: translateX(-50px);
    }
  }
}

.center {
  margin-left: 15px;
  flex-grow: 1;
  margin-right: 15px;
  padding-bottom: 20px;

  .one_article {
    background-color: white;
    margin-bottom: 10px;
    box-shadow: $box_shadow;
    border-radius: 10px;
    overflow: hidden;
    padding: 10px;
    cursor: pointer;

    .cover {
      display: block;
      border-radius: 6px;
      margin-bottom: 15px;
      height: 350px;
      object-fit: cover;
      width: 100%;
    }

    .intro {
      h4 {
        margin-bottom: 5px;
      }

      .time {
        font-size: 14px;
        color: #666666;
        margin-bottom: 10px;
      }
    }

    .tag {
      span {
        display: inline-block;
        padding: 4px 10px;
        background-color: rgba(153, 211, 223, 0.225);
        border: 1px solid $color_theme_2;
        margin-right: 5px;
        margin-bottom: 5px;
        border-radius: 4px;
        cursor: pointer;
      }
    }

    .data {
      margin-top: 10px;

      .flex-row-fs {
        margin-left: 20px;
      }

      img {
        height: 20px;
        width: 20px;
        margin-right: 5px;
      }

      span {
        font-size: 14px;
      }
    }
  }

  :deep(.el-pager) {
    li {
      background-color: white;
    }
  }
}

.right {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  bottom: 20px;
  align-self: flex-end;
  flex-wrap: wrap;

  span {
    display: inline-block;
    padding: 10px 20px;
    background-color: white;
    box-shadow: $box_shadow;
    margin-right: 5px;
    margin-top: 5px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .active {
    background-color: rgba(153, 211, 223, 0.225);
    border-color: $color_theme_2;
  }
}
</style>