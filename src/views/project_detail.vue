<template>
  <div class="project_detail" v-if="project_detail">
    <div class="main-container box">
      <div class="intro">
        <h3>{{project_detail.title}}</h3>
        <p>{{getFullTime(project_detail.time)}}</p>
      </div>
      <div class="flex-row-sb detail">
        <div class="left">
          <img :src="project_detail.img" alt="">
        </div>
        <div class="right">
          <v-md-preview :text="project_detail.content"></v-md-preview>
        </div>
      </div>
    </div>
    <div class="main-container other" v-if="project_list && project_list.length>0">
      <h2>相关项目</h2>
      <swiper :slidesPerView="3" :spaceBetween="30" :speed="1000" :pagination="pagination" :modules="modules"
        class="mySwiper">
        <swiper-slide v-for="(item, index) in project_list" :key="item.id">
          <div class="project_one" @click="goProjectDetail(item.id)">
            <div class="project_img">
              <img :src="item.attributes.img" alt="">
              <div class="pop flex-row-center">{{getFullTime(item.attributes.time)}}</div>
            </div>
            <div class="project_intro">
              <h4>{{item.attributes.title}}</h4>
              <div class="technical flex-row-fs">
                <div v-for="(item_tag, index_tag) in item.attributes.tags" class="technical_one">{{item_tag}}</div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script setup>
import project from '@/api/project';
import { Swiper, SwiperSlide } from "swiper/vue";
import { ElLoading } from 'element-plus'
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const project_list = ref(null)
const project_detail = ref(null)
const modules = ref([Pagination])

// 项目详情
async function findProjectDetail (id) {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  project_detail.value = (await project.findProjectDetail(id)).attributes
  findProjectOther(project_detail.value.tags)
  loadingInstance.close()
}
findProjectDetail(route.query.id)

// 查询项目列表
async function findProjectOther (tags) {
  project_list.value = await project.findProjectOther(route.query.id, tags)
}

// 前往目录详情
function goProjectDetail (id) {
  router.push({
    path: '/project_detail',
    query: {
      id: id
    }
  })
}

// 将时间戳转化为yy-mm-dd
function getFullTime (timestamp) {
  let date = new Date(timestamp);    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  return Y + M + D
}

watch(route, (newVal, oldVal) => {
  if (newVal.path !== '/project_detail') {
    return false
  }
  findProjectDetail(newVal.query.id)
})
</script>
<style lang="scss" scoped>
.project_detail {
  padding-bottom: 80px;
}
.box {
  margin-top: 20px;
}

.intro {
  background-color: white;
  border-radius: 10px;
  box-shadow: $box_shadow;
  padding: 10px;

  h3 {
    margin-bottom: 10px;
  }
}

.detail {
  margin-top: 15px;
  align-items: flex-start;
  margin-bottom: 20px;

  .left {
    width: 260px;
    background-color: rgb(41, 40, 40);
    padding: 10px;
    border-radius: 20px;
    box-shadow: $box_shadow;
    margin-right: 15px;
    flex-shrink: 0;

    img {
      display: block;
      border-radius: 8px;
    }
  }

  .right {
    flex-grow: 1;
    align-self: stretch;
    background-color: white;
    border-radius: 10px;
    box-shadow: $box_shadow;
  }
}

.other {
  padding-top: 30px;
  h2 {
    margin-bottom: 20px;
  }
  .swiper {
    width: 100%;
  }

  .project_one {
    background-color: white;
    box-shadow: $box_shadow;
    margin-bottom: 20px;
    cursor: pointer;

    &:hover {
      .project_img {
        .pop {
          opacity: 1;
        }
      }
    }

    .project_img {
      position: relative;
      padding-bottom: 60%;

      img {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        object-fit: cover;
      }

      .pop {
        background-color: rgba($color: #000000, $alpha: 0.7);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: white;
        opacity: 0;
        transition: .5s;
      }
    }

    .project_intro {
      padding: 20px;

      h4 {
        margin-bottom: 10px;
      }

      .technical {
        flex-wrap: wrap;
      }

      .technical_one {
        padding: 5px 10px;
        border-radius: 4px;
        background-color: rgba(153, 211, 223, 0.225);
        border: 1px solid $color_theme_2;
        margin-right: 10px;
        box-shadow: $box_shadow;
      }
    }
  }
}
</style>