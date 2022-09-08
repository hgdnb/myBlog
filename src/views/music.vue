<template>
  <div class="music" v-if="music_list">
    <div class="audio_source"><audio ref="audio_dom" @pause="onPause" @play="onPlay" @timeupdate="onTimeupdate"
        @loadedmetadata="onLoadedmetadata" :src="music_url" controls="controls" crossOrigin='anonymous'></audio></div>
    <div class="audio_visual" ref="audio_visual"></div>
    <div class="control flex-row-sb main-container">
      <div class="left">
        <el-collapse accordion>
          <el-collapse-item :title="key" v-for="(item, key) in music_list" :key="key">
            <p :class="catalog_key == key && index_son == music_index ? 'active' : ''"
              @click="changeMusic(key, index_son)" class="ellipsis_1" v-for="(item_son, index_son) in item"
              :key="item_son.id">{{item_son.attributes.title}}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="center flex-col-sb">
        <div class="top">
          <h2>{{music_list[catalog_key][music_index].attributes.title}}</h2>
          <h3>歌手：{{music_list[catalog_key][music_index].attributes.author}}</h3>
          <div class="flex-row-fs play_control">
            <div :class="music_index == 0 ? 'disabled play' : 'play'" @click="prevMusic">
              <img src="/image/icon15.png" alt="">
            </div>
            <div class="play">
              <img v-show="audio_info.playing" @click="pause" src="/image/icon16.png" alt="">
              <img v-show="!audio_info.playing" @click="play" src="/image/icon17.png" alt="">
            </div>
            <div :class="music_list[catalog_key].length - 1 > music_index ? 'play' : 'play disabled'" @click="nextMusic">
              <img src="/image/icon14.png" alt="">
            </div>
          </div>
        </div>
        <img class="photo" :src="music_list[catalog_key][music_index].attributes.img" alt="">
        <div class="progress flex-row-fs">
          <el-slider v-model="audio_info.progress" :show-tooltip="false" @change="changeProgress" />
          <div class="time">{{ audio_info.currentTime_text }} / {{ audio_info.maxTime_text }}</div>
        </div>
      </div>
      <div class="right flex-col-fe">
        <el-slider v-model="audio_info.volume" vertical height="170px" @change="changeVolume" />
        <p>音量</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 音频可视化
import * as THREE from "@/lib/three.module.js";
import { OrbitControls } from "@/lib/OrbitControls.js";
import { EffectComposer } from "@/lib/EffectComposer.js";
import { RenderPass } from "@/lib/RenderPass.js";
import { UnrealBloomPass } from "@/lib/UnrealBloomPass.js";
import { ShaderPass } from "@/lib/ShaderPass.js";
import { CopyShader } from "@/lib/CopyShader.js";
import Stats from "@/lib/stats.module.js";
import { range } from "@/lib/range";
import { node } from "@/lib/node";
import { randomRange } from "@/lib/randomRange";
import { Triangle } from "@/lib/Triangle";
import axios from "axios";

// vue模块
import { ref, reactive, nextTick } from 'vue'
import { useRoute } from "vue-router";
import music from '@/api/music'

const route = useRoute()
const audio_dom = ref(null)
const audio_info = reactive({
  // 该字段是音频是否处于播放状态的属性
  playing: false,
  // 音频当前播放时长数字
  currentTime: 0,
  // 音频当前播放时长文字
  currentTime_text: '0:00:00',
  // 最大播放时间数字
  maxTime: 0,
  // 音频最大播放时长文字
  maxTime_text: '0:00:00',
  // 进度
  progress: 0,
  // 音量
  volume: 100
})
const music_list = ref(null)
const music_url = ref('')
const catalog_key = ref('')
const music_index = ref(0)

// 加载音乐列表
async function getMusicList () {
  const res = await music.findMusic()
  catalog_key.value = res[0].attributes.catalog
  let obj = {}
  res.forEach((item, index) => {
    if (!obj[item.attributes.catalog]) {
      obj[item.attributes.catalog] = []
    }
    obj[item.attributes.catalog].push(item)
  });
  music_list.value = obj
  if (route.query.id && route.query.catalog) {
    music_index.value = music_list.value[route.query.catalog].findIndex((item, index) => {
      return item.id == route.query.id
    })
    catalog_key.value = route.query.catalog
    const res_music = await axios.get('https://autumnfish.cn/song/url', {
      params: {
        id: music_list.value[catalog_key.value][music_index.value].attributes.music_id
      }
    })
    music_url.value = res_music.data.data[0].url
  } else {
    const res_music = await axios.get('https://autumnfish.cn/song/url', {
      params: {
        id: res[0].attributes.music_id
      }
    })
    music_url.value = res_music.data.data[0].url
  }
  init()
}
getMusicList()

// 加载切换音乐
function changeMusic (key, index) {
  catalog_key.value = key
  music_index.value = index
  axios.get('https://autumnfish.cn/song/url', {
    params: {
      id: music_list.value[key][index].attributes.music_id
    }
  }).then(res => {
    music_url.value = res.data.data[0].url
    nextTick(() => {
      play()
    })
  })
}

// 下一个音乐
function nextMusic () {
  if (music_list.value[catalog_key.value].length - 1 > music_index.value) {
    changeMusic(catalog_key.value, music_index.value + 1)
  }
}

// 上一个音乐
function prevMusic () {
  if (0 < music_index.value) {
    changeMusic(catalog_key.value, music_index.value - 1)
  }
}

// 将音频时间转化为时分秒
function realFormatSecond (second) {
  let secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    let hours = Math.floor(second / 3600)
    second = second - hours * 3600
    let mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}
// 播放音频
const play = function () {
  audio_dom.value.play()
}
// 暂停音频
const pause = function () {
  audio_dom.value.pause()
}
// 当音频播放
const onPlay = function () {
  audio_info.playing = true
}
// 当音频暂停
const onPause = function () {
  audio_info.playing = false
}
// 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
const onTimeupdate = function (res) {
  audio_info.currentTime_text = realFormatSecond(res.target.currentTime)
  audio_info.progress = res.target.currentTime / audio_info.maxTime * 100
}
// 语音元数据主要是语音的长度之类的数据
const onLoadedmetadata = function (res) {
  audio_info.maxTime_text = realFormatSecond(parseInt(res.target.duration))
  audio_info.maxTime = res.target.duration
}

// 滑动滑块
const changeProgress = function (val) {
  audio_dom.value.currentTime = val / 100 * audio_info.maxTime
}

// 改变音量
const changeVolume = function (val) {
  audio_dom.value.volume = val / 100
}

// 音频可视化相关函数
let renderer, scene, camera, controls, stats, composer;
let gui = {
  R: 0,
  G: 55,
  B: 44,
  TrianglesBgColor: 0xffffff,
  TrianglesLineColor: 0xffffff,
  lineColor: 0xffffff,
  rotate: false
};
let audio = null
let analyser = null // 音频
let linesGroup,
  outLine,
  inLine,
  barLine = [],
  barNodes; // 线
let barGroup; // 柱子
let Triangles = [],
  TriangleGroup;


let positionZ = ref(110)
let N = ref(256)
let clock = ref(new THREE.Clock())
let scale = ref(1)
let audio_visual = ref(null)

const init = function () {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearAlpha(0);
  renderer.setSize(audio_visual.value.offsetWidth, audio_visual.value.offsetHeight); // 画布大小
  console.log(audio_visual)
  audio_visual.value.appendChild(renderer.domElement); // 将画布添加到body中
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    audio_visual.value.offsetWidth / audio_visual.value.offsetHeight,
    1,
    10000
  ); // 初始化摄像机
  camera.position.z = positionZ.value; // 设置摄像机的位置
  window.addEventListener("resize", onWindowResize, false); // 当屏幕尺寸变化时触发

  audioLines(20, N.value); // 添加音频线
  audioBars(25, N.value / 2); // 添加音频柱子

  TriangleGroup = new THREE.Group(); // 实例化一个对象组

  setInterval(addTriangle.bind(this), 500); // 每0.5秒生成一个三角形
  scene.add(TriangleGroup); // 向画布中添加对象组

  // 加载音频 start
  let listener = new THREE.AudioListener(); // 监听者
  audio = new THREE.Audio(listener); // 非位置音频对象
  audio.setMediaElementSource(audio_dom.value)
  analyser = new THREE.AudioAnalyser(audio, N.value * 2);
  initLight(); // 初始化灯光
  initControls(); // 初始化鼠标控制

  initBloomPass(); // 初始化辉光

  initStats(); // 帧率渲染
  animate(); // 动态渲染音频
}

// 渲染几何图形
const renderGeometries = function (vertices) {
  const res = [];
  vertices = vertices.concat(vertices[0]);
  vertices.forEach(value => {
    res.push(value.x, value.y, 0);
  });
  return new THREE.BufferAttribute(new Float32Array(res), 3);
}
// 自适应屏幕
const onWindowResize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}
// 更新圆形
const updateCircle = function () {
  if (barNodes) {
    linesGroup.scale.set(scale.value, scale.value, scale.value);
    const geometryA = outLine.geometry;
    const AttributeA = geometryA.getAttribute("position");
    const geometryB = inLine.geometry;
    const AttributeB = geometryB.getAttribute("position");

    const positions = barNodes.map(value => {
      return [value.positionA(), value.positionB()];
    });
    positions.forEach((position, index) => {
      AttributeA.set([position[0].x, position[0].y], index * 3);
      AttributeB.set([position[1].x, position[1].y], index * 3);
      const geometry = barLine[index].geometry;
      const Attribute = geometry.getAttribute("position");
      Attribute.set(
        [position[0].x, position[0].y, 0, position[1].x, position[1].y, 0],
        0
      );
      Attribute.needsUpdate = true;
    });
    AttributeA.set(
      [AttributeA.array[0], AttributeA.array[1]],
      positions.length * 3
    );
    AttributeB.set(
      [AttributeB.array[0], AttributeB.array[1]],
      positions.length * 3
    );
    AttributeA.needsUpdate = true;
    AttributeB.needsUpdate = true;
  }
}
// 音频线
const audioLines = function (radius, countData) {
  barNodes = range(0, countData).map(index => {
    return new node(
      radius,
      ((index / countData) * 360 + 45) % 360,
      new THREE.Vector2(0, 0)
    );
  });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: gui.lineColor
  });
  barLine = range(0, countData).map(index => {
    return new THREE.Line(
      new THREE.BufferGeometry().setAttribute(
        "position",
        renderGeometries([
          barNodes[index].positionA(),
          barNodes[index].positionB()
        ])
      ),
      lineMaterial
    );
  });
  outLine = new THREE.Line(
    new THREE.BufferGeometry().setAttribute(
      "position",
      renderGeometries(barNodes.map(node => node.positionA()))
    ),
    lineMaterial
  );

  inLine = new THREE.Line(
    new THREE.BufferGeometry().setAttribute(
      "position",
      renderGeometries(barNodes.map(node => node.positionB()))
    ),
    lineMaterial
  );

  linesGroup = new THREE.Group();
  linesGroup.add(outLine);
  linesGroup.add(inLine);
  barLine.forEach(line => linesGroup.add(line));
  scene.add(linesGroup);
}
// 添加三角形
const addTriangle = function () {
  const material = new THREE.MeshBasicMaterial({
    color: gui.TrianglesBgColor
  });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: gui.TrianglesLineColor
  });
  const triangle = makeTriangle(material, lineMaterial, t => {
    Triangles = Triangles.filter(triangle => {
      return triangle !== t;
    });
    TriangleGroup.remove(t.group);
  });
  TriangleGroup.add(triangle.group);

  Triangles.push(triangle);
}
// 制作三角形
const makeTriangle = function (material, lineMaterial, t) {
  const triangle = new Triangle(
    2,
    new THREE.Vector3(0, 0, 0),
    Math.random() * 360,
    randomRange(5, 1),
    randomRange(0.1, 0.05),
    material,
    lineMaterial,
    {
      startShow: 15,
      endShow: 30,
      startHide: 60,
      endHide: 70
    },
    t
  );
  return triangle;
}
// 音频柱子
const audioBars = function (radius, countData) {
  barGroup = new THREE.Group();
  let R = radius;
  let N = countData;
  for (let i = 0; i < N; i++) {
    let minGroup = new THREE.Group();
    let box = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshPhongMaterial({
      color: 0x00ffff
    }); // 材质对象
    let m = i;
    let mesh = new THREE.Mesh(box, material);

    mesh.position.y = 0.5;
    minGroup.add(mesh);
    minGroup.position.set(
      Math.sin(((m * Math.PI) / N) * 2) * R,
      Math.cos(((m * Math.PI) / N) * 2) * R,
      0
    );
    minGroup.rotation.z = ((-m * Math.PI) / N) * 2;
    barGroup.add(minGroup);
  }
  scene.add(barGroup);
}
// 辉光
const initBloomPass = function () {
  // 辉光
  let params = {
    exposure: 0.5,
    bloomStrength: 1,
    bloomThreshold: 0,
    bloomRadius: 0.8
  };
  let renderScene = new RenderPass(scene, camera);
  let bloomPass = new UnrealBloomPass(
    new THREE.Vector2(audio_visual.value.offsetWidth, audio_visual.value.offsetHeight),
    1.5,
    0.2,
    0
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  composer = new EffectComposer(renderer);
  // console.log(composer)
  const copyShader = new ShaderPass(CopyShader);
  copyShader.renderToScreen = true;
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(copyShader);

  // 辉光 end
}
// 动态渲染
const animate = function () {
  stats.update();
  controls.update();

  if (analyser) {
    // 获得频率数据N个
    let arr = analyser.getFrequencyData();
    if (barGroup) {
      barGroup.rotation.z += 0.002;
      barGroup.scale.set(scale.value, scale.value, scale.value);
      barGroup.children.forEach((elem, index) => {
        if (gui.R) {
          elem.children[0].material.color.r = arr[index] / (gui.R * 3);
        }
        if (gui.G) {
          elem.children[0].material.color.g = arr[index] / (gui.G * 3);
        }
        if (gui.B) {
          elem.children[0].material.color.b = arr[index] / (gui.B * 3);
        }
        if (arr[index] === 0) {
          elem.scale.set(0, 0, 0);
        } else {
          let m = arr[index] / 20;
          let targetRange = Math.max(
            arr[index] / 20 - arr[index - 1] / 20,
            0
          );
          if (m < targetRange) {
            m = targetRange;
          }

          elem.scale.set(1, m, 1);
        }
      });
    }
    const Delta = clock.value.getDelta();
    barNodes.forEach((node, index, array) => {
      node.strength(arr[index % array.length] * 0.1);
      node.transition(Delta);
    });
    scale.value = 1 + arr[Math.ceil(arr.length * 0.05)] / 500;
    updateCircle(arr);
    Triangles.forEach(triangle => triangle.transition(Delta));
  }

  // renderer.render(scene, camera);
  composer.render();
  requestAnimationFrame(animate);
}
// 鼠标控制
const initControls = function () {
  controls = new OrbitControls(camera, renderer.domElement);
  // 如果使用animate方法时，将此函数删除
  //controls.addEventListener( 'change', render );
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true;
  //动态阻尼系数 就是鼠标拖拽旋转灵敏度
  //controls.dampingFactor = 0.25;
  //是否可以缩放
  controls.enableZoom = false;
  //是否自动旋转
  controls.autoRotate = false;
  //是否开启右键拖拽
  controls.enablePan = false;
}
// FPS显示
const initStats = function () {
  stats = new Stats();
}
// 环境光和平行光
const initLight = function () {
  scene.add(new THREE.AmbientLight(0x444444));
  let light = new THREE.PointLight(0xffffff);
  light.position.set(80, 100, 50);
  //告诉平行光需要开启阴影投射
  light.castShadow = true;
  scene.add(light);
}
</script>

<style lang="scss" scoped>
.music {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

.audio_source {
  height: 0;
  width: 0;
  overflow: hidden;
}

.audio_visual {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 11;
  background-size: cover;
  background-image: url(http://lc-Ddp3rNzt.cn-n1.lcfile.com/6GmeoaASLTkUgFNrzBkQ06eRKyP7fh8j/function%20getTime%28%29%20%7B%20%5Bnative%20code%5D%20%7D);

  &::after {
    content: '';
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.2);
    z-index: -1;
  }
}

.control {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  color: white;

  .left {
    width: 180px;
    flex-shrink: 0;
    box-shadow: 0 0 10px rgba($color: aqua, $alpha: 1.0);
    padding: 10px 15px;
    border-radius: 10px;
    color: aqua;
    position: relative;
    align-self: flex-start;
    margin-top: 20px;
    overflow: hidden;
    z-index: 13;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: block;
      backdrop-filter: blur(20px);
      z-index: -1;
    }

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
        font-size: 16px;
        padding-bottom: 10px;

        p {
          cursor: pointer;
          font-size: 18px;
          margin: 10px;

          &:hover {
            &::after {
              width: 100%;
              position: relative;
            }
          }

          &::after {
            content: '';
            display: block;
            height: 1px;
            width: 0px;
            background-color: white;
            transition: .4s;
            top: -1px;
          }
        }

        .active {
          &::after {
            width: 100%;
            position: relative;
          }
        }
      }
    }
  }

  .center {
    align-self: stretch;
    flex-grow: 1;
    margin: 20px;

    .top {
      flex-grow: 1;

      h2 {
        position: relative;
        z-index: 13;
        font-size: 40px;
      }

      h3 {
        position: relative;
        z-index: 13;
        font-size: 24px;
        margin-top: 10px;
      }

      .play_control {
        position: relative;
        z-index: 13;
        margin-top: 20px;

        .play {
          position: relative;
          margin-right: 30px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 0 10px rgba($color: aqua, $alpha: 1.0);

          &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: block;
            backdrop-filter: blur(20px);
            z-index: -1;
          }
        }

        .disabled {
          opacity: .9;
        }

        img {
          height: 32px;
          width: 32px;
          position: relative;
          overflow: hidden;
          display: block;
          padding: 10px;
          flex-shrink: 0;
        }
      }

    }

    .photo {
      width: 220px;
      height: 160px;
      position: relative;
      z-index: 13;
      align-self: flex-end;
      margin-bottom: 15px;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba($color: aqua, $alpha: 1.0);
      backdrop-filter: blur(20px);
    }

    .progress {
      overflow: hidden;
      padding: 20px;
      padding-left: 30px;
      box-shadow: 0 0 10px rgba($color: aqua, $alpha: 1.0);
      border-radius: 10px;
      z-index: 13;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: block;
        backdrop-filter: blur(20px);
        z-index: -1;
      }

      .time {
        margin-left: 20px;
        flex-shrink: 0;
      }
    }
  }

  .right {
    z-index: 13;
    position: relative;
    width: 80px;
    height: 205px;
    align-self: flex-end;
    margin-bottom: 20px;
    box-shadow: 0 0 10px rgba($color: aqua, $alpha: 1.0);
    border-radius: 10px;
    overflow: hidden;
    padding: 20px 0;
    text-align: center;

    p {
      margin-top: 10px;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: block;
      backdrop-filter: blur(20px);
      z-index: -1;
    }

    :deep(.el-slider__runway) {
      flex: unset;
      margin: 0 auto;
    }
  }
}

.swiper {
  width: 100%;
  height: 100%;

  &::after {
    content: '';
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    background-color: rgba($color: #000000, $alpha: 0.5);
    z-index: 0;
  }
}

.swiper-slide {
  opacity: 0.3;
  transition: 1s;
}

.swiper-slide-active {
  opacity: 1;
}
</style>