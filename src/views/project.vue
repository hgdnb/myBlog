<template>
  <div class="project">
    <div class="flex-row-sb project_list main-container">
      <div class="project_one" @click="goProjectDetail(item.id)" v-for="(item, index) in project_list" :key="item.id">
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
    </div>
    <div class="pages_box flex-row-center">
      <el-pagination v-model:currentPage="page" background @current-change="changePage" layout="prev, pager, next"
            :total="project_count" />
    </div>
  </div>
</template>
<script setup>
import project from '@/api/project';
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const page = ref(1) // 分页器页码
const project_list = ref(null) // 项目列表
const project_count = ref(0)

// 页面滚动到顶部
let goTop = inject('goTop')

// 更改页码时触发
function changePage (e) {
  page.value = e
  getProject()
  goTop()
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

// 查询项目列表
async function getProject () {
  project_list.value = await project.findProject(page)
}
getProject()

// 查询项目数量
async function getProjectCount() {
  project_count.value = await project.findProjectCount()
}
getProjectCount()

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
.project {
  padding-top: 20px;
  padding-bottom: 100px;
}

.project_list {
  flex-wrap: wrap;
  align-items: stretch;

  &::after {
    content: '';
    display: block;
    width: calc(33% - 15px);
  }
}

.project_one {
  width: calc(33% - 15px);
  background-color: white;
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
    padding: 20px 20px 10px;

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
      margin-bottom: 10px;
    }
  }
}

.pages_box {
  :deep(.el-pager) {
    li {
      background-color: white;
    }
  }
}
</style>