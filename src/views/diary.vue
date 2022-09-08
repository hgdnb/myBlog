<template>
  <div class="diary" v-if="diary_list">
    <div class="time_line">
      <el-collapse accordion>
        <el-collapse-item :title="key_year" v-for="(item_year, key_year) in diary_list" :key="key_year">
          <p @click="getMonthDiary(key_year, key_month)" :class="key_month == month_key ? 'active' : ''"
            v-for="(item_month, key_month) in item_year" :key="key_month">{{ key_month }}月</p>
        </el-collapse-item>
      </el-collapse>
    </div>
    <swiper :direction="'vertical'" :slidesPerView="1" :spaceBetween="0" :speed="1000" :mousewheel="true"
      :pagination="pagination" :modules="modules" class="mySwiper">
      <swiper-slide v-for="(item, index) in month_diary_list">
        <div class="swiper_content flex-col-center bg-cover-center"
          :style="{ backgroundImage: `url('${item.attributes.img}')` }">
          <div class="main-container">
            <div class="title">
              <h1>{{ item.attributes.title }}</h1>
              <p class="mood">天气：{{ item.attributes.weather }} &nbsp;&nbsp;&nbsp; 心情：{{ item.attributes.mood }}</p>
              <p class="time">{{ getFullTime(item.attributes.time) }}</p>
            </div>
            <div class="content_box">
              <div class="flex-row-sb">
                <div class="dot" v-for="item in 14" :key="item"></div>
              </div>
              <div class="content">
                <p>{{ item.attributes.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Mousewheel, Pagination } from "swiper";
import "swiper/css/pagination";
import { ref } from 'vue'
import diary from '@/api/diary'
const modules = ref([Mousewheel, Pagination])

const diary_list = ref(null)
const month_diary_list = ref([])
const year_key = ref('')
const month_key = ref('')

// 获取选中月份的日事列表
function getMonthDiary (year, month) {
  year_key.value = year
  month_key.value = month
  month_diary_list.value = diary_list.value[year][month]
}
// 读取所有日事
async function getAllDiary () {
  const res = await diary.findDiary()
  console.log(res)
  let obj = {}
  res.forEach((item, index) => {
    let year = item.attributes.time.getFullYear()
    let month = item.attributes.time.getMonth() + 1
    if (!obj[year]) {
      obj[year] = {}
    }
    if (!obj[year][month]) {
      obj[year][month] = []
    }
    obj[year][month].push(item)
  });
  diary_list.value = obj
  getMonthDiary(res[0].attributes.time.getFullYear(), res[0].attributes.time.getMonth() + 1)
  console.log(obj)
}

getAllDiary()

// 轮播图分页器钩子
const pagination = ref({
  clickable: true,
  renderBullet: function (index, className) {
    return '<span class="' + className + '">' + (month_diary_list.value[index].attributes.time.getDate()) + "</span>";
  }
})

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
.diary {
  height: calc(100vh - 70px);
  overflow: hidden;
  position: relative;
}


.time_line {
  position: absolute;
  left: 20px;
  top: 30px;
  z-index: 20;
  border-left: 1px solid white;
  padding-left: 20px;

  :deep(.el-collapse) {
    border-bottom: none;
    border-top: none;

    .el-collapse-item__arrow {
      display: none;
    }

    .el-collapse-item__header {
      border-bottom: none;
      background-color: transparent;
      color: white;
      font-size: 26px;
    }

    .el-collapse-item__wrap {
      background-color: transparent;
      border-bottom: none;
    }

    .el-collapse-item__content {
      color: white;
      font-size: 20px;

      p {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &:hover {
          &::before {
            width: 20px;
          }
        }

        &::before {
          content: '';
          display: block;
          height: 1px;
          width: 0px;
          background-color: white;
          transition: .4s;
        }
      }

      .active {
        &::before {
          width: 20px;
        }
      }
    }
  }
}

.swiper {
  width: 100%;
  height: 100%;
}

:deep(.swiper-pagination) {
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
  display: flex;
  width: 1100px;
  max-width: calc(100% - 200px);
  padding-left: 100px;
  padding-right: 100px;

  &::before {
    content: '日期：';
    font-size: 18px;
    line-height: 24px;
    color: white;
    margin-top: 5px;
    margin-right: 10px;
  }

  .swiper-pagination-bullet {
    border-top: 1px solid white;
    padding-right: 20px;
    border-radius: 0;
    width: unset;
    height: unset;
    opacity: 1;
    color: white;
    font-size: 18px;
    line-height: 24px;
    background-color: transparent;

    &::before {
      content: '';
      display: block;
      height: 0px;
      width: 1px;
      background-color: white;
      margin: 0px auto;
      transition: .4s;
    }
  }

  .swiper-pagination-bullet-active {
    &::before {
      height: 20px;
    }
  }

  .swiper-pagination-bullet:only-child {
    display: block !important;
  }
}

.swiper-slide {
  opacity: 0.3;
  transition: 1s;
}

.swiper-slide-active {
  opacity: 1;

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
    height: 100%;
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
</style>