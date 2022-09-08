import AV from '@/api/AV'

const music = {}

// 查找音乐列表
music.findMusic = () => {
  const query = new AV.Query('Music')
  return query.find()
}

export default music
