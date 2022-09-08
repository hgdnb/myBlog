<template>
  <div class="index">
    <div class="swiper" v-if="diary_banner">
      <el-carousel height="70vh" interval="10000">
        <el-carousel-item v-for="(item, index) in diary_banner.slice(0, 3)" :key="item.id">
          <div class="swiper_content flex-col-center bg-cover-center" :style="{ backgroundImage: `url('${item.attributes.img}')` }">
            <div class="main-container">
              <div class="title">
                <h1>{{item.attributes.title}}</h1>
                <p class="mood">天气：{{item.attributes.weather}} &nbsp;&nbsp;&nbsp; 心情：{{item.attributes.mood}}</p>
                <p class="time">{{getFullTime(item.attributes.time)}}</p>
              </div>
              <div class="content_box">
                <div class="flex-row-sb">
                  <div class="dot" v-for="item in 14" :key="item"></div>
                </div>
                <div class="content">
                  <p>{{item.attributes.content}}</p>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="index_content main-container flex-row-sb">
      <div class="left" v-if="blogger">
        <div class="photo" @mouseover="show_info = '0'" @mouseleave="show_info = '1'">
          <img :src="blogger.userPhoto" alt="">
        </div>
        <el-collapse v-model="show_info">
          <el-collapse-item name="0">
            <div class="userinfo">
              <p><span>性别：</span> {{blogger.gender}}</p>
              <p><span>爱好：</span> {{blogger.like}}</p>
              <p><span>职业：</span> {{blogger.job}}</p>
              <p><span>QQ邮箱：</span> {{blogger.email}}</p>
              <p><span>籍贯：</span> {{blogger.address}}</p>
              <p><span>座右铭：</span> {{blogger.motto}}</p>
              <p><span>生日：</span>{{getFullTime(blogger.birthday)}}</p>
            </div>
          </el-collapse-item>
          <el-collapse-item name="1">
            <div class="qLink">
              <div class="tag">
                <span @click="changeCalalog(-1)" :class="calalog_index == -1 ? 'active' : ''">全部</span>
                <span @click="changeCalalog(index)" v-for="(item, index) in all_catalog" :key="item.id" :class="calalog_index == index ? 'active' : ''">{{item.attributes.name}}</span>
              </div>
              <div class="flex-row-sb contact">
                <a :href="blogger.weChat" target="_blank"><img src="/image/icon3.png" alt=""></a>
                <a :href="blogger.QQ" target="_blank"><img src="/image/icon4.png" alt=""></a>
                <a :href="blogger.weibo" target="_blank"><img src="/image/icon5.png" alt=""></a>
                <a :href="blogger.gitee" target="_blank"><img src="/image/icon6.png" alt=""></a>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="center">
        <div class="one_article" @click="goArticleDetail(item.id)" v-for="(item, index) in article_list" :key="item.id">
          <img class="cover"
            :src="item.attributes.img"
            alt="">
          <div class="intro">
            <h4>{{item.attributes.title}}</h4>
            <p class="time">{{getFullTime(item.attributes.time)}}</p>
            <div class="tag">
              <span v-for="(item_son, index_son) in item.attributes.tags" :key="index_son">{{item_son}}</span>
            </div>
          </div>
        </div>
        <div class="pages_box flex-row-center">
          <el-pagination v-model:currentPage="page" background @current-change="changePage" layout="prev, pager, next" :total="article_count" />
        </div>
      </div>
      <div class="right">
        <div @click="goMusic(item.attributes.catalog, item.id)" class="one flex-row-sb" v-for="(item, index) in music_list" :key="item.id">
          <img :src="item.attributes.img"
            alt="">
          <div class="intro flex-col-sb">
            <p class="ellipsis_1">{{item.attributes.title}}</p>
            <span class="ellipsis_1">{{item.attributes.author}}</span>
          </div>
          <div class="voice flex-row-center">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElCarousel, ElCarouselItem } from 'element-plus'
import { ref, inject } from 'vue'
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'
import userinfo from '@/api/userinfo'
import catalog from '@/api/catalog'
import diary from '@/api/diary'
import article from '@/api/article'
import music from '@/api/music'


let show_info = ref('1') // 是否显示用户信息
const diary_banner = ref(null) // banner数据
const blogger = ref(null) // 博主信息
const all_catalog = ref(null) // 全部目录
const article_count = ref(0) // 文章数量
const article_list = ref([]) // 文章列表
const page = ref(1) // 第几页
const calalog_index = ref(-1) // 目录索引
const music_list = ref([]) // 音乐列表
const router = useRouter() // 路由方法

// 页面滚动到顶部
let goTop = inject('goTop')

// 查找音乐
async function getMusic() {
  music_list.value = (await music.findMusic()).slice(0, 7)
}
getMusic()

// 改变目录
function changeCalalog(index) {
  calalog_index.value = index
  page.value = 1
  getArticle()
  goTop()
}

// 页面改变时触发
function changePage (e) {
  page.value = e
  getArticle()
  goTop()
}

// 查找日事
async function getDiary () {
  diary_banner.value = await diary.findDiary()
}
getDiary()

// 用户信息
async function getUserInfo () {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  blogger.value = (await userinfo.findUser()).attributes
  loadingInstance.close()
}
getUserInfo()

// 查找目录
async function getCatalog () {
  const res = await catalog.findCatalog()
  all_catalog.value = res
}
getCatalog()

// 查找文章数量
async function getArticleCount () {
  const catalog_id = calalog_index.value === -1 ? '' : all_catalog.value[calalog_index.value].id
  article_count.value = await article.findArticleCount(catalog_id)
}

// 查询文章列表
async function getArticle () {
  const catalog_id = calalog_index.value === -1 ? '' : all_catalog.value[calalog_index.value].id
  article_list.value = await article.findArticle(page.value, catalog_id)
  getArticleCount()
}
getArticle()

// 将时间戳转化为yy-mm-dd
function getFullTime (timestamp) {
  let date = new Date(timestamp);    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  return Y + M + D
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

// 点击跳转到音乐详情页
function goMusic (catalog, id) {
  console.log(catalog)
  router.push({
    path: '/music',
    query: {
      catalog:catalog,
      id: id
    }
  })
}

</script>

<style lang="scss" scoped>
.swiper {
  .main-container {
    width: 100%;
  }

  :deep(.is-active) {
    .swiper_content {
      .content_box {
        transform: rotate(-10deg) translateX(0);
        opacity: 1;
      }

      .title {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }

  .swiper_content {
    width: 100%;
    height: 100%;
    position: relative;

    &::after {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      background-color: rgba($color: #000000, $alpha: 0.3);
      z-index: 0;
    }

    .main-container {
      width: 100%;
      z-index: 10;
    }

    .title {
      transform: translateX(-100%);
      transition: 1.2s;
      opacity: 0;
      color: white;

      h1 {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid white;
      }

      .mood {
        font-size: 26px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid white;
      }

      .time {
        font-size: 26px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid white;
      }
    }

    .content_box {
      border-top-left-radius: 20px;
      background-color: white;
      position: absolute;
      right: 0;
      top: 0;
      width: 500px;
      height: 55vh;
      color: $font_color_1;
      padding: 30px 13vh 13vh 40px;
      transition: 1.2s;
      transform: rotate(-10deg) translateX(100%);
      opacity: 0;
      transform-origin: top right;

      .dot {
        width: 14px;
        height: 14px;
        background-color: $color_theme_2;
        border-radius: 50%;
        margin-bottom: 20px;
      }

      .content {
        padding-top: 20px;
        line-height: 32px;
        background-image: url(/image/icon2.png);
        height: 100%;
      }
    }
  }
}

.index_content {
  align-items: flex-start;
  padding-bottom: 100px;

  .left {
    background-color: white;
    width: 220px;
    margin-top: -60px;
    z-index: 20;
    border-radius: 10px;
    box-shadow: $box_shadow;
    position: sticky;
    top: 80px;
    flex-shrink: 0;
    padding: 80px 30px 30px;

    .photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%) rotate(-45deg);
      border-color: $color_theme_1 transparent $color_theme_1 transparent;
      border-style: solid;
      border-width: 4px;
      transition: 1s;

      &:hover {
        transform: translate(-50%, -50%) rotate(405deg);

        img {
          transform: rotate(-405deg);
        }
      }

      img {
        transition: 1s;
        background-color: white;
        padding: 10px;
        object-fit: cover;
        height: calc(100% - 20px);
        width: calc(100% - 20px);
        display: block;
        border-radius: 50%;
        transform: rotate(45deg);
      }
    }

    :deep(.el-collapse) {
      border-bottom: none;
      border-top: none;

      .el-collapse-item__header {
        display: none;
      }

      .el-collapse-item__content {
        border-bottom: none;
        padding-bottom: 0;
      }

      .el-collapse-item__wrap {
        border-bottom: none;
      }
    }

    .qLink {
      .tag {
        padding: 10px 10px 20px;
        overflow: visible;

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

        .active {
          border: 1px solid white;
          background-color: white;
          box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
        }
      }

      .contact {
        padding: 0 10px;
        img {
          height: 36px;
          width: 36px;
          cursor: pointer;
        }
      }
    }

    .userinfo {
      padding-top: 20px;
      line-height: 32px;
      background-image: url(/image/icon2.png);

      span {
        color: $color_theme_1;
      }
    }
  }

  .center {
    margin-left: 15px;
    flex-grow: 1;
    margin-right: 15px;
    padding-top: 20px;

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
    flex-shrink: 0;
    position: sticky;
    top: 0px;
    width: 260px;
    padding: 20px 0 0;

    .one {
      box-shadow: $box_shadow;
      margin-bottom: 10px;
      background-color: white;
      border-radius: 5px;
      padding: 10px;
      cursor: pointer;

      &:hover {
        .voice {
          display: flex;
        }
      }

      img {
        height: 50px;
        width: 50px;
        object-fit: cover;
        border-radius: 4px;
      }

      p {
        font-size: 16px;
      }

      span {
        font-size: 14px
      }

      ;

      .intro {
        flex-grow: 1;
        align-self: stretch;
        margin: 5px 15px;
      }

      .voice {
        align-items: flex-end;
        align-self: flex-end;
        display: none;

        div {
          width: 4px;
          background-color: $color_theme_1;
          margin: 0 2px;

          &:nth-child(1) {
            height: 10px;
            animation: voice_active_1 1s infinite linear;
          }

          &:nth-child(2) {
            height: 20px;
            animation: voice_active_2 1s infinite linear;
          }

          &:nth-child(3) {
            height: 5px;
            animation: voice_active_3 1s infinite linear;
          }

          &:nth-child(4) {
            height: 15px;
            animation: voice_active_4 1s infinite linear;
          }
        }
      }
    }

    .active {
      .voice {
        display: flex !important;
      }
    }
  }
}


@keyframes voice_active_1 {
  0% {
    height: 10px;
  }

  50% {
    height: 20px;
  }

  100% {
    height: 10px;
  }
}

@keyframes voice_active_2 {
  0% {
    height: 20px;
  }

  50% {
    height: 0;
  }

  100% {
    height: 20px;
  }
}

@keyframes voice_active_3 {
  0% {
    height: 5px;
  }

  50% {
    height: 20px;
  }

  100% {
    height: 5px;
  }
}

@keyframes voice_active_4 {
  0% {
    height: 15px;
  }

  50% {
    height: 0;
  }

  100% {
    height: 15px;
  }
}
</style>
