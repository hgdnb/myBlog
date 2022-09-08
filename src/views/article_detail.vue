<template>
  <div class="article_detail" v-if="article_detail">
    <div class="detail_box main-container flex-row-sb">
      <div class="left flex-col-fe">
        <div class="control">
          <div @click="goTop" class="img_box"><img src="/image/icon18.png" alt=""></div>
        </div>
      </div>
      <div class="center">
        <img class="cover" :src="article_detail.attributes.img" alt="">
        <div class="intro">
          <h2>{{article_detail.attributes.title}}</h2>
          <p class="time">{{getFullTime(article_detail.attributes.time)}}</p>
          <div class="tag">
            <span v-for="(item_tag, index_tag) in article_detail.attributes.tags">{{item_tag}}</span>
          </div>
        </div>
        <div class="detail" v-html="article_detail.attributes.content"></div>
      </div>
      <div class="right">
        <h2>相关文章推荐</h2>
        <div class="list">
          <div class="one" v-for="(item, index) in article_list" :key="item.id" @click="goArticleDetail(item.id)">
            <h4 class="ellipsis_1">{{item.attributes.title}}</h4>
            <p>{{getFullTime(item.attributes.time)}}</p>
          </div>
          <img v-if="!article_list || article_list.length == 0" class="empty" src="/public/image/empty.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import article from '@/api/article';
import { inject, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
const goTop = inject('goTop')
const route = useRoute()
const router = useRouter()
const article_detail = ref(null)
const article_list = ref(null)
async function findArticleDetail () {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  article_detail.value = await article.findArticleDetail(route.query.id)
  fundArticleOther()
  loadingInstance.close()
}
findArticleDetail()
async function fundArticleOther () {
  article_list.value = await article.findArticleOther(route.query.id, article_detail.value.attributes.catalog_id)
}

// 将时间戳转化为yy-mm-dd
function getFullTime (timestamp) {
  let date = new Date(timestamp);    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  return Y + M + D
}

// 前往推荐文章
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
  if (newVal.path !== '/article_detail') {
    return false
  }
  findArticleDetail()
})
</script>
<style lang="scss" scoped>
.detail_box {
  max-width: 1000px;
  align-items: stretch;
  min-height: calc(100vh - 70px);

  .left {
    padding-bottom: 20px;
    flex-shrink: 0;

    .control {
      position: sticky;
      bottom: 20px;
    }

    .img_box {
      box-shadow: $box_shadow;
      padding: 10px;
      border-radius: 50%;
      background-color: white;
      margin-top: 20px;
      cursor: pointer;
    }

    img {
      height: 30px;
      width: 30px;
      display: block;
    }
  }

  .center {
    margin: 0 20px;
    flex-grow: 1;
    margin-top: 20px;
    margin-bottom: 20px;

    .intro {
      border-radius: 10px;
      background-color: white;
      margin-bottom: 15px;
      padding: 15px;
      box-shadow: $box_shadow;
      h2 {
        margin-bottom: 10px;
      }
      .time {
        margin-bottom: 10px;
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
    }

    .cover {
      box-shadow: $box_shadow;
      border-radius: 10px;
      margin-bottom: 15px;
      display: block;
    }

    .detail {
      padding: 15px;
      box-shadow: $box_shadow;
      background-color: white;
      border-radius: 10px;
      box-shadow: $box_shadow;
    }
  }

  .right {
    width: 220px;
    background-color: white;
    margin-top: 20px;
    margin-bottom: 20px;
    align-self: flex-start;
    position: sticky;
    top: 20px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 10px;

    h2 {
      padding: 15px;
      background-color: $color_theme_1;
      color: white;
    }

    .list {
      padding: 0 15px;
    }

    .one {
      padding: 10px 0;
      border-bottom: 1px solid #efefef;
      cursor: pointer;

      &:hover {
        color: $color_theme_1;
      }

      h4 {
        margin-bottom: 5px;
        font-size: 14px;
      }

      p {
        font-size: 14px;
      }
    }
    .empty {
      width: 100%;
      display: block;
    }
  }
}
</style>